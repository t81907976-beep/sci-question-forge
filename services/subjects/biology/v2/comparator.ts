import { callLLM } from '../../../llmClient';
import type { BiologyV2Draft } from './generator';
import type { BiologyBlindSolverResult } from './blind-solver';
import type { BiologyProblemType } from '../../../../types/multiNodeTypes';
import { formatBiologyRulesForPrompt, selectBiologyRules } from './rule-matcher';

/**
 * Biology V2 Node A5: Answer Comparator
 *
 * 对比出题者参考答案 vs 盲解者独立答案，裁定最终权威解答。
 * 逻辑与化学 comparator 基本一致，但比较维度适配生物题型：
 *
 * - calculation:          数值+单位是否一致
 * - genetic-reasoning:    遗传方式推断/基因型结论是否一致
 * - network-reasoning:    信号传播方向和最终节点状态是否一致
 * - threshold-reasoning:  系统状态转换判断是否一致
 * - structural-reasoning: 功能变化方向和机制是否一致
 */

export interface BiologyComparisonResult {
  answersAgree: boolean;
  discrepancies: string[];
  finalAuthorizedAnswer: string;
  finalSolutionText: string;
  confidence: 'high' | 'medium' | 'low';
  notes: string;
/**
   * 级联陷阱追踪指标（仅题目含 cascadeTrap 字段时存在）。
   * 用于单独追踪"级联正确率"与总体正确率，评估对抗性提升效果。
   */
  cascadeTrapResult?: {
    trap1Solved: boolean;           // 盲解模型是否正确处理了层1陷阱
    trap2Triggered: boolean;        // 正确解层1后是否落入了层2陷阱（cascading failure）
    usedTrap2Discriminator?: boolean; // 是否实际使用层2判别量改变候选集合/结论
    outcomeShiftHandled?: boolean;    // 是否处理了层2前后候选/机制/结论变化
    cascadeScore: 'full_solve' | 'cascade_triggered' | 'trap1_failed' | 'no_cascade';
    notes: string;
  };
  reasoningValid: boolean;
  reasoningIssues: string[];
  solutionRepaired: boolean;
  repairSummary: string;
}

const COMPARISON_FOCUS: Record<BiologyProblemType, string> = {
  'calculation':
    '重点检查：最终目标是否一致——可能是唯一数值、唯一范围、唯一中间闭合量、可由题设约束唯一确定的表达式/公式，或由主闭合量支撑的判定/选择/归因/可行性/异常解释；数值/范围需核对单位，表达式/公式需核对变量定义、适用条件、边界条件和是否由题设唯一确定；若最终目标是判定、选择、归因、可行性或异常解释，还必须检查两版是否识别同一个主判定变量，并用它与观测值、阈值或候选窗口比较来唯一排除错误机制；若不一致，哪版计算过程有错误（如单位换算/公式应用/主判据错选/表达式闭合条件缺失）；即使最终答案一致，也要检查公式适用条件、单位换算、中间步骤和反证约束是否真实成立',
  'genetic-reasoning':
    '重点检查：遗传方式推断（常/X/细胞质）和亲本基因型结论是否一致；即使结论一致，也要检查排除假设、比例推断、连锁/独立分配前提是否成立',
  'network-reasoning':
    '重点检查：各下游节点的最终激活/抑制状态是否一致；即使状态一致，也要检查信号方向、正负调控、反馈环和因果链是否被错误抵消',
  'threshold-reasoning':
    '重点检查：系统最终状态（激活/静息）和迟滞推理是否一致；即使最终状态一致，也要检查阈值跨越、迟滞区间和状态转换条件是否被正确使用',
  'structural-reasoning':
    '重点检查：突变对功能影响的方向（增强/减弱/丧失）和机制（Km变化/疏水核心破坏等）是否一致；即使结论一致，也要检查结构-功能因果解释是否真实支撑结论',
};

function isConfidence(value: unknown): value is BiologyComparisonResult['confidence'] {
  return value === 'high' || value === 'medium' || value === 'low';
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(item => String(item)).filter(Boolean) : [];
}

function normalizeComparisonResult(parsed: Partial<BiologyComparisonResult>): BiologyComparisonResult {
  const confidence = isConfidence(parsed.confidence) ? parsed.confidence : 'low';
  const discrepancies = normalizeStringArray(parsed.discrepancies);
  const reasoningIssues = normalizeStringArray(parsed.reasoningIssues);
  const solutionRepaired = Boolean(parsed.solutionRepaired ?? reasoningIssues.length > 0);
  const reasoningValid = Boolean(parsed.reasoningValid ?? (confidence === 'high' && reasoningIssues.length === 0 && !solutionRepaired));

  return {
    answersAgree: Boolean(parsed.answersAgree),
    discrepancies,
    finalAuthorizedAnswer: String(parsed.finalAuthorizedAnswer ?? ''),
    finalSolutionText: String(parsed.finalSolutionText ?? ''),
    confidence,
    notes: String(parsed.notes ?? ''),
    reasoningValid,
    reasoningIssues,
    solutionRepaired,
    repairSummary: String(parsed.repairSummary ?? ''),
  };
}

function fallbackComparison(draft: BiologyV2Draft, reason: string): BiologyComparisonResult {
  return {
    answersAgree: false,
    discrepancies: [reason],
    finalAuthorizedAnswer: draft.referenceAnswer.split('\n').slice(-1)[0] ?? '',
    finalSolutionText: draft.referenceAnswer,
    confidence: 'low',
    notes: 'Comparator failed, fell back to reference answer',
    reasoningValid: false,
    reasoningIssues: ['比较器未能完成推理审查，无法确认解析链条正确性'],
    solutionRepaired: false,
    repairSummary: '',
  };
}

export async function compareBiologyAnswers(
  draft: BiologyV2Draft,
  blindResult: BiologyBlindSolverResult,
): Promise<BiologyComparisonResult> {
  const problemType = draft.problemType;
  const focus = COMPARISON_FOCUS[problemType] ?? COMPARISON_FOCUS['calculation'];

  // 有级联陷阱时，在 prompt 中加入专项评估段落
  const cascadeTrap = (draft as any).cascadeTrap as BiologyV2Draft['cascadeTrap'] | undefined;
  const dynamicRules = formatBiologyRulesForPrompt(selectBiologyRules({
    node: 'A5',
    knowledgePoint: draft.knowledgePoint,
    dimension: draft.chosenDimension,
    questionText: draft.questionText,
    referenceAnswer: draft.referenceAnswer,
    extraText: blindResult.blindAnswer,
    maxRules: 6,
  }), '【已匹配的生物动态裁判规则】');
  const cascadeEvalBlock = cascadeTrap ? `
【级联陷阱追踪（额外评估项）】：
本题设计了两层级联陷阱：
  层1陷阱：${cascadeTrap.trap1}
  层2陷阱：${cascadeTrap.trap2}
  联动关系：${cascadeTrap.linkage}
  层1错解结果：${(cascadeTrap as any).trap1WrongOutcome ?? '未提供'}
  层1正解解锁：${(cascadeTrap as any).trap1CorrectUnlock ?? '未提供'}
  层2判别量：${(cascadeTrap as any).trap2Discriminator ?? '未提供'}
  最终结论迁移：${(cascadeTrap as any).finalOutcomeShift ?? '未提供'}

请在对比两版解答后，额外评估盲解版本（版本B）的级联陷阱表现：
- trap1Solved：版本B是否正确识别并绕过了层1陷阱？若版本B落到“层1错解结果”，则为 false。
- trap2Triggered：版本B在正确解层1后，是否落入了层2陷阱？（true/false；若trap1Solved=false则填false）
- usedTrap2Discriminator：版本B是否实际使用层2判别量改变候选集合或排除机制？
- outcomeShiftHandled：版本B是否处理了层2前后的候选/机制/结论变化？
- cascadeScore：
  "full_solve"         = trap1和trap2均正确处理
  "cascade_triggered"  = trap1正确但随即落入trap2（级联失败，这正是题目设计目标）
  "trap1_failed"       = trap1未能正确处理
- notes：对版本B级联陷阱表现的简短说明

将上述6个字段填入输出 JSON 的 cascadeTrapResult 对象；若 usedTrap2Discriminator=false 或 outcomeShiftHandled=false，则不能给 full_solve。` : '';

  const prompt = `你是生物学题目裁判专家。请对比以下两版解答，判断最终答案和推理链是否可靠，并给出最终权威解答。

【题型】：${problemType}
【题目正文】：
${draft.questionText}
【求解目标】：${draft.requiredAnswer}

【版本 A（出题者参考答案）】：
${draft.referenceAnswer}

【版本 B（独立解题者答案）】：
${blindResult.blindAnswer}

【对比重点（${problemType}）】：
${focus}

${dynamicRules}【核心裁判规则】：
1. 不要只比较最终答案。即使两版最终答案一致，也必须逐步审查每个关键推理步骤。
2. 必须检查计算公式、单位换算、遗传比例、假设排除、调控方向、阈值条件、结构-功能因果链，以及题型所需的生物学前提。
3. 对判定型计算题，必须检查解答是否先闭合唯一主判定变量，再用该变量与观测值/阈值/候选窗口比较并排除错误机制；若只是列出多个中间量后直接语义判断，reasoningValid 必须为 false。
4. 如果最终答案一致但任一版本存在关键公式错误、条件误用、概念混淆、因果倒置、逻辑跳步、主判据错选或数值/结论巧合，answersAgree 仍可为 true，但 reasoningValid 必须为 false，reasoningIssues 必须写明错误。
4. 遇到“最终答案正确但推理有错”的情况，不要简单通过，也不要只拒绝；必须在 finalSolutionText 中重写一版正确、完整、可直接导出的标准解答。
5. finalAuthorizedAnswer 必须与 finalSolutionText 的结论完全一致。
6. finalSolutionText 不得保留错误推理；如需提及错误，只能明确说明该错误已被排除或修正。

【对比任务】：
1. 判断两版最终答案（结论/数值）是否一致。
2. 独立审查两版推理链，指出关键错误或不可支撑的步骤。
3. 裁定最终权威答案，并重写最终权威分步解答。
4. 给出置信度：
   - high：最终答案确定，推理审查无关键问题，最终解答可直接导出
   - medium：最终答案可确定，但原解答存在推理错误/缺漏，已在最终解答中修复
   - low：无法可靠确定最终答案或无法修复为可靠解析
${cascadeEvalBlock}

输出必须是严格 JSON，不含 markdown 代码块：
{
  "answersAgree": true 或 false,
  "reasoningValid": true 或 false,
  "reasoningIssues": ["推理错误1", "推理错误2"],
  "solutionRepaired": true 或 false,
  "repairSummary": "如果修复了解析，说明修复了什么；否则为空字符串",
  "discrepancies": ["差异1", "差异2"],
  "finalAuthorizedAnswer": "最终权威答案（一句话，推理题给结论，计算题给数值+单位）",
  "finalSolutionText": "最终权威分步解答（每步含必要推理依据）",
  "confidence": "high" 或 "medium" 或 "low",
  "notes": "裁判备注（如有争议点）"${cascadeTrap ? `,
  "cascadeTrapResult": {
    "trap1Solved": true 或 false,
    "trap2Triggered": true 或 false,
    "usedTrap2Discriminator": true 或 false,
    "outcomeShiftHandled": true 或 false,
    "cascadeScore": "full_solve 或 cascade_triggered 或 trap1_failed",
    "notes": "级联陷阱表现说明"
  }` : ''}
}`;

  const raw = (await callLLM(prompt, { model: 'default', temperature: 0.1 })).trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return fallbackComparison(draft, 'Failed to parse comparator response');
  }

  try {
    return normalizeComparisonResult(JSON.parse(jsonMatch[0]) as Partial<BiologyComparisonResult>);
  } catch {
    return fallbackComparison(draft, 'Comparator JSON parse failed');
  }
}
