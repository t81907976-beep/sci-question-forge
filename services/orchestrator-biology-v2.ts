import { FinalProblem, MultiNodeStage, TrapType, UserInput } from '../types/multiNodeTypes';

function normalizeTextForCompare(text?: string): string {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function buildTextDiffSummary(before?: string, after?: string): string {
  const b = normalizeTextForCompare(before);
  const a = normalizeTextForCompare(after);

  if (!b && !a) return 'A1与最终题干均为空';
  if (b === a) return '题干无文本改动';

  const minLen = Math.min(b.length, a.length);
  let firstDiff = 0;
  while (firstDiff < minLen && b[firstDiff] === a[firstDiff]) firstDiff++;

  return `题干已修改: 长度 ${b.length}→${a.length}, 首个差异位置=${firstDiff}`;
}

function stripStepNumber(step: string): string {
  return step
    .replace(/^\s*(?:步骤\s*)?\[?\d+\]?\s*[\.、:：)）\-—]*\s*/u, '')
    .trim();
}

function removeConcreteResultFragments(step: string): string {
  return step
    // 去掉“= 具体数值/答案”的结果片段，尽量保留公式左侧与符号关系。
    .replace(/=\s*[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:\s*(?:×|x|\*)\s*10\s*\^?\s*[+-]?\d+)?\s*[\w%°℃μµ·\/\-^{}\\]*\b/gi, '')
    .replace(/(?:约为|≈|≃|\bapprox\.?\b)\s*[+-]?(?:\d+(?:\.\d+)?|\.\d+)[^；;，,。)]*/gi, '')
    .replace(/(?:得到|得出|计算得到|最终得到|答案为|为)\s*[+-]?(?:\d+(?:\.\d+)?|\.\d+)[^；;，,。)]*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[，,；;：:]?\s*$/u, '')
    .trim();
}

function buildSolutionReference(steps?: string[]): string {
  const cleaned = (steps ?? [])
    .map(stripStepNumber)
    .map(removeConcreteResultFragments)
    .map(step => step.replace(/[。；;\s]*$/u, ''))
    .filter(Boolean);

  return cleaned.map((step, idx) => `${idx + 1}.${step}`).join(';');
}

function splitKnowledgePointList(raw: string): string[] {
  const topics: string[] = [];
  let current = '';
  let depth = 0;
  let inDollarMath = false;
  let inParenMath = false;
  let inBracketMath = false;

  const flush = () => {
    const topic = current.trim();
    if (topic) topics.push(topic);
    current = '';
  };

  const isEscaped = (index: number) => index > 0 && raw[index - 1] === '\\';

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    const nextTwo = raw.slice(i, i + 2);
    const nextThree = raw.slice(i, i + 3);
    const inMath = inDollarMath || inParenMath || inBracketMath;

    if (!isEscaped(i) && char === '$') {
      inDollarMath = !inDollarMath;
      current += char;
      continue;
    }
    if (!inDollarMath && nextTwo === '\\(') {
      inParenMath = true;
      current += nextTwo;
      i += 1;
      continue;
    }
    if (inParenMath && nextTwo === '\\)') {
      inParenMath = false;
      current += nextTwo;
      i += 1;
      continue;
    }
    if (!inDollarMath && nextTwo === '\\[') {
      inBracketMath = true;
      current += nextTwo;
      i += 1;
      continue;
    }
    if (inBracketMath && nextTwo === '\\]') {
      inBracketMath = false;
      current += nextTwo;
      i += 1;
      continue;
    }

    if (!inMath && '([{（【'.includes(char)) {
      depth += 1;
      current += char;
      continue;
    }
    if (!inMath && ')] }）】'.replace(/ /g, '').includes(char)) {
      depth = Math.max(0, depth - 1);
      current += char;
      continue;
    }
    if (!inMath && depth === 0 && /[\n,，;；]/.test(char)) {
      flush();
      continue;
    }
    if (!inMath && depth === 0 && (nextThree === ' + ' || nextThree === ' ＋ ')) {
      flush();
      i += 2;
      continue;
    }

    current += char;
  }
  flush();

  return Array.from(new Set(topics));
}

function hasExternalizationDepthIssue(depthIssues?: string[]): boolean {
  return (depthIssues ?? []).some(issue =>
    /外显|显式化|判断句式|路径命名|操作方法|数据用途|\[Lint\]/i.test(issue),
  );
}

function hasCriticalValidityIssue(validityIssues?: string[]): boolean {
  return (validityIssues ?? []).some(issue =>
    /critical|答案不唯一|无法唯一|不唯一|模糊参数|可导出不同答案|不同答案|不同推理路径|自洽计算|条件.*不闭合|计数不闭合|归一化.*改变|缺失\s*\d+\s*帧|未.*唯一限定|使用角色未.*唯一|竞争.*观测|替代.*计算|覆盖全部|独立子样本/.test(issue),
  );
}

function pickCyclic<T>(items: T[] | undefined, index: number, offset = 0): T | undefined {
  if (!items || items.length === 0) return undefined;
  return items[(index + offset) % items.length];
}

const FINAL_TASK_FRAMES = [
  '求唯一数值，并用该数值闭合一个后续阈值或边界判断',
  '求唯一范围，并说明范围边界由哪些题干约束共同决定',
  '求唯一中间闭合量，并据此完成后续机制/方案/读出口径判定',
  '求可由题设约束唯一确定的表达式/公式，并说明适用边界或变量定义',
  '求两个机制/模型在同一读出口径下的可区分判别量，并用判别量唯一闭合结论',
  '求设计或实验结论成立所需的临界参数/约束表达式，并据此判断是否满足',
];

type BiologyDimension = BiologyKPAnalysisResult['testDimensions'][number];

type BiologyProblemAssignment = {
  dimensionIndex: number;
  dimension: BiologyDimension;
};

function assignBiologyDimension(
  kpAnalysis: BiologyKPAnalysisResult,
  usedDimensionCounts: Map<string, number>,
  fallbackIndex: number,
): BiologyProblemAssignment {
  const dimensions = kpAnalysis.testDimensions;
  const indexed = dimensions.map((dimension, index) => ({ dimension, index }));
  const calcIndexed = indexed.filter(({ dimension }) => dimension.problemType === 'calculation');
  const candidatePool = calcIndexed.length > 0 ? calcIndexed : indexed;
  const minUsed = Math.min(...candidatePool.map(({ index }) => usedDimensionCounts.get(String(index)) ?? 0));
  const leastUsed = candidatePool.filter(({ index }) => (usedDimensionCounts.get(String(index)) ?? 0) === minUsed);
  const picked = leastUsed[fallbackIndex % leastUsed.length] ?? candidatePool[fallbackIndex % Math.max(1, candidatePool.length)];
  const key = String(picked.index);
  usedDimensionCounts.set(key, (usedDimensionCounts.get(key) ?? 0) + 1);
  return { dimensionIndex: picked.index, dimension: picked.dimension };
}

function detectA1RegenerationIssues(draft: BiologyV2Draft): string[] {
  const issues: string[] = [];
  if (draft.problemType === 'calculation') {
    issues.push(...detectFormulaChainDegeneration(draft));
    if (/某(?:贴壁)?(?:肿瘤)?细胞|某生物|某体系|某实验/.test(draft.questionText || '')) {
      issues.push('【A1Regen】计算题背景泛化：题干使用“某细胞/某体系”类背景，未绑定真实细胞系、物种、菌株或实验平台。');
    }
  }
  return issues;
}

function hasFormulaChainRegenerationIssue(issues: string[]): boolean {
  return issues.some(issue => /DeterministicLint|公式链退化|计算链过短|缺少有效诱惑性错误路径/.test(issue));
}

function buildFormulaChainFusionPlan(
  kpAnalysis: BiologyKPAnalysisResult,
  disciplineKey: string,
  diversityPlan: BiologyDiversityPlan,
): FormulaChainFusionPlan {
  const topic = kpAnalysis.knowledgePoint || '当前知识点';
  const isEnzymeThermo = /酶|enzyme|热力学|ΔG|thermo/i.test(topic);
  const isMetabolism = /代谢|通量|线粒体|呼吸|辅因子|NAD|FAD|ATP|MFA|FBA/i.test(topic);
  const isNeuroOrMembrane = /神经|膜电位|离子|通道|兴奋|突触/i.test(topic);

  const fusionAxis = isEnzymeThermo
    ? '酶学/热力学 × 代谢通量读出口径 × 局部状态池边界'
    : isMetabolism
      ? '代谢通量 × 辅因子/能荷状态 × 多通道实验读出'
      : isNeuroOrMembrane
        ? '膜电位/离子通道 × 时标切换 × 读出通道校正'
        : `${formatBiologyTopicLabel(disciplineKey, topic)} × 多通道读出 × 边界条件切换`;

  return {
    fusionAxis,
    primaryBranchVariable: isEnzymeThermo
      ? '由原始ΔG/底物比值先判断反应方向或有效驱动力，再决定使用表观速率、容量上界还是净通量口径'
      : '由一个可计算的状态量先判断读出口径或模型适用范围，再决定后续计算对象',
    readoutConflict: `让${diversityPlan.measurementTool || '主读出通道'}与${diversityPlan.dataModality || '第二实验通道'}估计同一潜在量但口径不同，正确解必须先统一 operational definition`,
    cascadeUnlock: '层1正解后才暴露层2判别量；层2必须改变最终数值范围、表达式形式或可用候选集合，而不是只做质控说明',
    finalClosureTarget: diversityPlan.finalTaskFrame || '唯一中间闭合量，并据此完成后续机制/读出口径判定',
    branchBudget: '最多 3 个核心决策点：1 个主分叉 + 1 个层2判别 + 最多 1 个辅助闭合；其余条件必须改为给定条件或删除',
  };
}

function buildBiologyDiversityPlan(
  disciplineKey: string,
  problemIndex: number,
  totalProblems: number,
  disciplines: Record<string, DisciplineEntry> = getAllDisciplines(),
): BiologyDiversityPlan {
  const scaffolding = disciplines[disciplineKey]?.diversityScaffolding;
  const hasPool = Boolean(scaffolding && Object.values(scaffolding).some(v => Array.isArray(v) && v.length > 0));

  return {
    batchSize: totalProblems,
    problemOrdinal: problemIndex,
    objectVariant: pickCyclic(scaffolding?.objectVariants, problemIndex, 0),
    measurementTool: pickCyclic(scaffolding?.measurementTools, problemIndex, 1),
    dataModality: pickCyclic(scaffolding?.dataModalities, problemIndex, 2),
    perturbationType: pickCyclic(scaffolding?.perturbationTypes, problemIndex, 3),
    questionStyle: pickCyclic(scaffolding?.questionStyles, problemIndex, 4),
    subfieldVariant: pickCyclic(scaffolding?.subfieldVariants, problemIndex, 5),
    modelVariant: pickCyclic(scaffolding?.modelVariants, problemIndex, 6),
    finalTaskFrame: pickCyclic(FINAL_TASK_FRAMES, problemIndex, 0),
    requiredDifferenceRule: hasPool
      ? (scaffolding?.antiRepeatRule ?? '同一知识点重复出题时，至少更换实验对象、测量工具、数据形式、扰动条件、问题目标中的两项。')
      : '即使当前学科没有显式多样性池，同一批次也必须至少更换“实验对象/系统、测量或观察数据形式、扰动条件、问题目标”中的两项，不得复用同一叙事链。',
  };
}

import { analyzeKnowledgePoint, analyzeFusionKnowledgePoints, classifyAndGroupKPs } from './subjects/biology/v2/kp-analyzer';
import { generateBiologyQuestion } from './subjects/biology/v2/generator';
import type { BiologyDiversityPlan, BiologyV2Draft, FormulaChainFusionPlan } from './subjects/biology/v2/generator';
import { detectFormulaChainDegeneration, reviewAndRepairBiology } from './subjects/biology/v2/reviewer';
import { auditCalculationAssumptions } from './subjects/biology/v2/assumption-auditor';
import { detectTemplateContamination } from './subjects/biology/v2/template-contamination-detector';
import { solveBiologyBlind } from './subjects/biology/v2/blind-solver';
import { compareBiologyAnswers } from './subjects/biology/v2/comparator';
import { assembleFinalOutput, validateFinalOutput } from './nodes/node7-output';
import type { OrchestratorCallbacks } from './orchestrator';
import { getCurrentProvider, getOneApiModel } from './llmClient';
import type { BiologyKPAnalysisResult } from './subjects/biology/v2/kp-analyzer';
import {
  identifyBiologyDiscipline,
  getAllDisciplines,
  getBiologyTopicCandidatesWithFallbackNormalization,
  detectExplicitBiologyDiscipline,
  formatBiologyTopicLabel,
  resolveBiologyDisciplineKeyFromName,
} from './subjects/biology/disciplines';
import type { DisciplineEntry } from './subjects/biology/disciplines';

/**
 * Biology V2 Orchestrator
 *
 * 流水线：A0 → A1 → A2/A3 loop → A4 → A5 → Node7
 *
 *   A0: KP 分析（生物维度 + 推荐题型）
 *   A1: 生题 + 参考答案（5种题型专属 prompt）
 *   A2: 审查（生物自洽性 + 难度 + 逻辑深度）
 *   A3: 修复（深度重写 or 细节修复，最多2轮）
 *   A4: 盲解（题型专属解题框架，不看参考答案）
 *   A5: 答案对比（题型专属比较维度）
 *   Node7: 组装最终输出（复用现有 assembleFinalOutput）
 *
 * 输出与 V1 相同的 FinalProblem 类型，UI 无需改动。
 */

export const BIOLOGY_V2_STAGE_LABELS: Record<string, string> = {
  [MultiNodeStage.NODE_0_INPUT]:      '输入校验',
  [MultiNodeStage.NODE_1_RAG]:        '知识点分析（KP）',
  [MultiNodeStage.NODE_2_BASE_GEN]:   '生题 + 参考答案',
  [MultiNodeStage.NODE_3_TRAPS]:      '审查 / 修复',
  [MultiNodeStage.NODE_4_VALIDATION]: '盲解',
  [MultiNodeStage.NODE_5_SOLVING]:    '答案对比',
  [MultiNodeStage.NODE_7_OUTPUT]:     '整理输出',
};

const BIOLOGY_V2_K_STAGE_LABELS: Record<string, string> = {
  [MultiNodeStage.NODE_0_INPUT]:      'K0 输入校验',
  [MultiNodeStage.NODE_1_RAG]:        'K1 知识点分析',
  [MultiNodeStage.NODE_2_BASE_GEN]:   'K2 生题',
  [MultiNodeStage.NODE_3_TRAPS]:      'K3 审查/修复',
  [MultiNodeStage.NODE_4_VALIDATION]: 'K4 盲解',
  [MultiNodeStage.NODE_5_SOLVING]:    'K5 答案对比',
  [MultiNodeStage.NODE_7_OUTPUT]:     'K6 整理输出',
};

function logBiologyV2Stage(stage: MultiNodeStage, traceId: string, problemIndex: number): void {
  const label = BIOLOGY_V2_K_STAGE_LABELS[stage] ?? BIOLOGY_V2_STAGE_LABELS[stage] ?? stage;
  console.log(`[BioV2 Stage] traceId=${traceId} 题${problemIndex + 1}: ${label}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 单题生成（V2 流水线核心）
// ─────────────────────────────────────────────────────────────────────────────

async function generateSingleBiologyV2(
  input: UserInput,
  problemIndex: number,
  kpAnalysis: BiologyKPAnalysisResult,
  a0Time: number,
  disciplineKey: string,
  callbacks?: OrchestratorCallbacks,
  typeTracker?: { calculationCount: number; totalCount: number },
  blindSolverModel?: string,
  cascadeEnabled?: boolean,
  totalProblemsInBatch?: number,
  assignedDimensionIndex?: number,
  disciplines: Record<string, DisciplineEntry> = getAllDisciplines(),
): Promise<FinalProblem | null> {
  const traceId = `bioV2-p${problemIndex + 1}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const executionTimes: Record<string, number> = {};
  executionTimes['a0_kp_analysis'] = a0Time;

  try {
    callbacks?.onStageChange?.(MultiNodeStage.NODE_1_RAG, problemIndex);
    logBiologyV2Stage(MultiNodeStage.NODE_1_RAG, traceId, problemIndex);

    console.log(`[BioV2 Trace] traceId=${traceId} start problemIndex=${problemIndex} kp=${kpAnalysis.knowledgePoint}`);

    // ── 维度选择：批量入口会预先分配题型/维度，避免并发任务都选到同一种题型 ──────────────
    let dimensionIndex = assignedDimensionIndex ?? (problemIndex % Math.max(1, kpAnalysis.testDimensions.length));

    // ── A1: Generate Question + Reference Answer ──────────────────────────────
    callbacks?.onStageChange?.(MultiNodeStage.NODE_2_BASE_GEN, problemIndex);
    logBiologyV2Stage(MultiNodeStage.NODE_2_BASE_GEN, traceId, problemIndex);
    const disciplineEntry = disciplines[disciplineKey];
    const diversityPlan = buildBiologyDiversityPlan(disciplineKey, problemIndex, totalProblemsInBatch ?? input.problemCount, disciplines);
    const t1 = Date.now();
    let draft = await generateBiologyQuestion(
      kpAnalysis,
      dimensionIndex,
      input.language,
      cascadeEnabled ?? false,
      disciplineEntry,
      diversityPlan,
    );
    const maxA1Regenerations = 2;
    for (let regenAttempt = 1; regenAttempt <= maxA1Regenerations; regenAttempt++) {
      const regenerationIssues = detectA1RegenerationIssues(draft);
      if (regenerationIssues.length === 0) break;

      console.warn(
        `[BioV2 A1 Regen] traceId=${traceId} 题${problemIndex + 1}: 第${regenAttempt}次重生，原因=${regenerationIssues.join(' | ')}`,
      );
      draft = await generateBiologyQuestion(
        kpAnalysis,
        dimensionIndex,
        input.language,
        cascadeEnabled ?? false,
        disciplineEntry,
        diversityPlan,
        {
          reason: regenerationIssues.join('；'),
          formulaChainFusionPlan: hasFormulaChainRegenerationIssue(regenerationIssues)
            ? buildFormulaChainFusionPlan(kpAnalysis, disciplineKey, diversityPlan)
            : undefined,
        },
      );
    }
    executionTimes['a1_generate'] = Date.now() - t1;
    console.log(`[BioV2 A1] traceId=${traceId} 生题 (题${problemIndex + 1}): ${draft.problemType} — ${draft.chosenDimension}`);

    // 更新批次题型计数，用于后续题目的分布调节
    if (typeTracker) {
      typeTracker.totalCount++;
      if (draft.problemType === 'calculation') typeTracker.calculationCount++;
    }

    // ── 模板污染检测（仅 calculation 题，最多重试1次）────────────────────────
    if (draft.problemType === 'calculation') {
      try {
        const contamination = await detectTemplateContamination(draft);
        if (contamination.contaminated) {
          console.warn(
            `[BioV2 Contamination] 题${problemIndex + 1} 场景为教材模板：${contamination.templateSource}，` +
            `建议替换方向：${contamination.suggestedAlternative}，重新生成`,
          );
          // 将 suggestedAlternative 注入 kpAnalysis 的 coreConceptsToAvoid，引导重生成换场景
          const patchedKP = {
            ...kpAnalysis,
            coreConceptsToAvoid: [
              ...kpAnalysis.coreConceptsToAvoid,
              ...(contamination.templateSource ? [contamination.templateSource] : []),
              ...(contamination.suggestedAlternative
                ? [`避免使用教材模板场景，改用：${contamination.suggestedAlternative}`]
                : []),
            ],
          };
          const tRetry = Date.now();
          draft = await generateBiologyQuestion(
            patchedKP,
            dimensionIndex,
            input.language,
            cascadeEnabled ?? false,
            disciplineEntry,
            diversityPlan,
            {
              reason: `模板污染：${contamination.templateSource || '教材模板'}；建议替换方向：${contamination.suggestedAlternative || '更换实验系统和读出通道'}`,
              formulaChainFusionPlan: buildFormulaChainFusionPlan(patchedKP, disciplineKey, diversityPlan),
            },
          );
          executionTimes['a1_generate'] += Date.now() - tRetry;
          console.log(`[BioV2 A1] traceId=${traceId} 重生成完成 (题${problemIndex + 1}): ${draft.problemType} — ${draft.chosenDimension}`);
        }
      } catch (err) {
        console.warn('[BioV2 Contamination] 检测失败，跳过:', err);
      }
    }

    // ── Assumption Audit（仅 calculation 题，DeepSeek V4 Pro）────────────────
    let preAuditIssues: string[] = [];
    if (draft.problemType === 'calculation') {
      try {
        const auditResult = await auditCalculationAssumptions(draft);
        if (!auditResult.passed) {
          preAuditIssues = auditResult.issues.map(
            i => `【假设审计-${i.severity}】${i.assumption}（${i.reason}）修复建议：${i.fix}`,
          );
          console.warn(`[BioV2 Audit] 题${problemIndex + 1} 发现 ${preAuditIssues.length} 个缺失假设`);
        }
      } catch (err) {
        console.warn('[BioV2 Audit] 审计失败，跳过:', err);
      }
    }

    // ── A2/A3: Review + Repair Loop ───────────────────────────────────────────
    callbacks?.onStageChange?.(MultiNodeStage.NODE_3_TRAPS, problemIndex);
    logBiologyV2Stage(MultiNodeStage.NODE_3_TRAPS, traceId, problemIndex);
    const t2 = Date.now();
    let reviewPack = await reviewAndRepairBiology(
      draft,
      preAuditIssues,
      disciplineEntry,
      { traceId, problemIndex },
      Boolean(cascadeEnabled),
    );

    let reviewedDraft = reviewPack.draft;
    let reviewResult = reviewPack.reviewResult;
    let repairCycles = reviewPack.repairCycles;

    console.log(
      `[BioV2 ReviewSummary] traceId=${traceId} passed=${reviewResult.passed} repairCycles=${repairCycles} verdict=${reviewResult.overallVerdict}`,
    );
    executionTimes['a2_a3_review'] = Date.now() - t2;

    if (!reviewResult.passed) {
      const reviewIssueSummary = [
        ...(reviewResult.validityIssues?.length
          ? [`validity(${reviewResult.validityIssues.length}): ${reviewResult.validityIssues.join(' | ')}`]
          : []),
        ...(reviewResult.difficultyIssues?.length
          ? [`difficulty(${reviewResult.difficultyIssues.length}): ${reviewResult.difficultyIssues.join(' | ')}`]
          : []),
        ...(reviewResult.depthIssues?.length
          ? [`depth(${reviewResult.depthIssues.length}): ${reviewResult.depthIssues.join(' | ')}`]
          : []),
      ].join(' || ');

      console.warn(
        `[BioV2] traceId=${traceId} 题${problemIndex + 1}: 审查未完全通过（${repairCycles}轮修复），继续。 verdict=${reviewResult.overallVerdict}`,
      );
      console.warn(
        `[BioV2] traceId=${traceId} 题${problemIndex + 1}: 审查综合判定详情: ${reviewIssueSummary || '无具体问题列表'}`,
      );

      const hasExternalization = hasExternalizationDepthIssue(reviewResult.depthIssues);

      if (hasExternalization) {
        console.warn(
          `[BioV2 Gate] traceId=${traceId} 题${problemIndex + 1}: 命中外显化深度问题，触发一次去外显复修。`,
        );

        const retryPack = await reviewAndRepairBiology(
          reviewedDraft,
          [],
          disciplineEntry,
          { traceId: `${traceId}-deext`, problemIndex },
          Boolean(cascadeEnabled),
        );

        reviewedDraft = retryPack.draft;
        reviewResult = retryPack.reviewResult;
        repairCycles += retryPack.repairCycles;

        console.log(
          `[BioV2 Gate] traceId=${traceId} de-externalize retry result passed=${reviewResult.passed} depth=${reviewResult.depthIssues?.length ?? 0}`,
        );

        if (hasExternalizationDepthIssue(reviewResult.depthIssues)) {
          console.warn(
            `[BioV2 Gate] traceId=${traceId} 题${problemIndex + 1}: 去外显复修后仍命中外显化问题，阻断发布。`,
          );
          return null;
        }
      }

      if (!reviewResult.passed && hasCriticalValidityIssue(reviewResult.validityIssues)) {
        console.warn(
          `[BioV2 Gate] traceId=${traceId} 题${problemIndex + 1}: 命中 critical validity issue（答案唯一性/约束闭合/模糊参数），阻断发布。`,
        );
        return null;
      }
    }

    // ── A4: Blind Solve ───────────────────────────────────────────────────────
    callbacks?.onStageChange?.(MultiNodeStage.NODE_4_VALIDATION, problemIndex);
    logBiologyV2Stage(MultiNodeStage.NODE_4_VALIDATION, traceId, problemIndex);
    const t4 = Date.now();
    const blindResult = await solveBiologyBlind(reviewedDraft, blindSolverModel);
    executionTimes['a4_blind_solve'] = Date.now() - t4;

    if (!blindResult.isSolvable) {
      console.warn(`[BioV2] 题${problemIndex + 1}: 盲解报告无法求解 — ${blindResult.failReason}`);
    }

    // ── A5: Compare Answers ───────────────────────────────────────────────────
    callbacks?.onStageChange?.(MultiNodeStage.NODE_5_SOLVING, problemIndex);
    logBiologyV2Stage(MultiNodeStage.NODE_5_SOLVING, traceId, problemIndex);
    const t5 = Date.now();
    const comparison = await compareBiologyAnswers(reviewedDraft, blindResult);
    executionTimes['a5_compare'] = Date.now() - t5;

    // 盲解高置信答对也保留输出（不再丢弃）
    if (comparison.answersAgree && comparison.confidence === 'high') {
      console.log(`[BioV2] traceId=${traceId} 题${problemIndex + 1}: 盲解高置信答对，保留本题`);
    }

    // ── Node 7: Assemble Final Output ─────────────────────────────────────────
    callbacks?.onStageChange?.(MultiNodeStage.NODE_7_OUTPUT, problemIndex);
    logBiologyV2Stage(MultiNodeStage.NODE_7_OUTPUT, traceId, problemIndex);
    const t7 = Date.now();

    // 适配器：把 BiologyV2Draft 映射到 assembleFinalOutput 所需的入参结构
    const baseProblemAdapter = {
      problemId:        reviewedDraft.problemId,
      topic:            reviewedDraft.knowledgePoint,
      scenario:         reviewedDraft.chosenDimension,
      originalProblemText: draft.questionText,
      coreData:         (reviewedDraft.givenData ?? {}) as Record<string, { value: number; unit: string }>,
      requiredAnswer:   reviewedDraft.requiredAnswer,
      referenceSteps:   reviewedDraft.referenceSteps,
      knowledgePointIds: input.knowledgePointIds,
    };

    const trapDataAdapter = {
      appliedTraps: [] as TrapType[],
      trapModifiedText: reviewedDraft.questionText,
      distractorData: {},
      trapDescriptions: [
        `题型: ${reviewedDraft.problemType}`,
        `考察维度: ${reviewedDraft.chosenDimension}`,
        `审查: ${reviewResult.overallVerdict}`,
        `修复轮次: ${repairCycles}`,
        `答案一致: ${comparison.answersAgree ? '是' : '否'}`,
        `置信度: ${comparison.confidence}`,
        `推理审查: ${comparison.reasoningValid ? '通过' : '发现问题并已修复'}`,
        `解答修复: ${comparison.solutionRepaired ? '是' : '否'}`,
        ...((reviewResult.depthIssues?.length ?? 0) > 0
          ? [`深度问题: ${reviewResult.depthIssues.join('; ')}`]
          : []),
        ...(reviewResult.cascadeTrapReview
          ? [`级联陷阱审查: ${reviewResult.cascadeTrapReview.summary}`]
          : []),
        ...((reviewResult.cascadeTrapReview?.issues?.length ?? 0) > 0
          ? [`级联陷阱审查问题: ${reviewResult.cascadeTrapReview!.issues.join('; ')}`]
          : []),
        ...((comparison.reasoningIssues?.length ?? 0) > 0
          ? [`推理问题: ${comparison.reasoningIssues.join('; ')}`]
          : []),
        ...(comparison.repairSummary
          ? [`修复说明: ${comparison.repairSummary}`]
          : []),
        ...((comparison.discrepancies?.length ?? 0) > 0
          ? [`差异: ${comparison.discrepancies.join('; ')}`]
          : []),
        ...(comparison.cascadeTrapResult
          ? [`级联陷阱: ${comparison.cascadeTrapResult.cascadeScore} | 层1:${comparison.cascadeTrapResult.trap1Solved ? '✓' : '✗'} 层2触发:${comparison.cascadeTrapResult.trap2Triggered ? '✓' : '✗'}`]
          : []),
      ],
    };

    const solutionAdapter = {
      problemId: reviewedDraft.problemId,
      reasoningChain: comparison.finalSolutionText
        .split('\n')
        .filter(line => line.trim())
        .map((line, i) => ({
          stepNumber:  i + 1,
          description: line,
          justification: '',
          trapAvoidanceNote: undefined,
        })),
      finalAnswer: comparison.finalAuthorizedAnswer,
      keyInsights: [
        `考察维度: ${reviewedDraft.chosenDimension}`,
        `题型: ${reviewedDraft.problemType}`,
        `答案置信度: ${comparison.confidence}`,
        `推理审查: ${comparison.reasoningValid ? '通过' : '发现问题并已修复'}`,
        ...(comparison.repairSummary ? [`修复说明: ${comparison.repairSummary}`] : []),
        ...(comparison.notes ? [comparison.notes] : []),
      ],
      standardSafeSolutionText: comparison.finalSolutionText,
    };

    const finalProblem = assembleFinalOutput(
      input,
      baseProblemAdapter,
      trapDataAdapter,
      solutionAdapter,
      executionTimes,
    );

    const a1QuestionBody = draft.questionText || '';
    const reviewedMergedText = reviewedDraft.questionText || '';
    const isTextModified = normalizeTextForCompare(a1QuestionBody) !== normalizeTextForCompare(reviewedMergedText);
    const textDiffSummary = buildTextDiffSummary(a1QuestionBody, reviewedMergedText);

    finalProblem.questionBody = a1QuestionBody;
    finalProblem.mergedProblemText = reviewedMergedText;
    finalProblem.solutionReference = buildSolutionReference(reviewedDraft.referenceSteps);


    // 补充生物学特有字段
    (finalProblem as any).problemType     = reviewedDraft.problemType;
    (finalProblem as any).logicConditions = reviewedDraft.logicConditions;
    (finalProblem as any).givenData       = reviewedDraft.givenData;
    // hardVerified=true 表示 reasoning 模型盲解高置信答错，题目对推理模型具有对抗性
    (finalProblem as any).hardVerified    = !comparison.answersAgree && comparison.confidence === 'high';

    // 谷歌在线表输出：审查结果 & 盲解结果
    (finalProblem.metadata as any).traceId             = traceId;
    (finalProblem.metadata as any).reviewPassed         = reviewResult.passed;
    (finalProblem.metadata as any).reviewVerdict        = reviewResult.overallVerdict;
    (finalProblem.metadata as any).reviewValidityIssues = reviewResult.validityIssues ?? [];
    (finalProblem.metadata as any).reviewDifficultyIssues = reviewResult.difficultyIssues ?? [];
    (finalProblem.metadata as any).reviewDepthIssues    = reviewResult.depthIssues ?? [];
    (finalProblem.metadata as any).cascadeTrapReview    = reviewResult.cascadeTrapReview ?? null;
    (finalProblem.metadata as any).repairCycles         = repairCycles;
    (finalProblem.metadata as any).blindSolveAnswer    = blindResult.blindFinalAnswer;
    (finalProblem.metadata as any).blindSolveSolvable  = blindResult.isSolvable;
    (finalProblem.metadata as any).blindSolveFailReason = blindResult.failReason || '';
    (finalProblem.metadata as any).answersAgree        = comparison.answersAgree;
    (finalProblem.metadata as any).comparisonConfidence = comparison.confidence;
    (finalProblem.metadata as any).isTextModified = isTextModified;
    (finalProblem.metadata as any).textDiffSummary = textDiffSummary;
    (finalProblem.metadata as any).solutionReference = finalProblem.solutionReference;
    (finalProblem.metadata as any).a0KnowledgePoint = kpAnalysis.knowledgePoint;
    (finalProblem.metadata as any).a0DisciplineKey = disciplineKey;

    executionTimes['node7_assemble'] = Date.now() - t7;

    const validation = validateFinalOutput(finalProblem);
    // 推理题 givenData 故意为空，过滤掉对推理题无意义的 coreData 校验项
    const validationErrors = reviewedDraft.problemType !== 'calculation'
      ? validation.errors.filter(e => e !== 'No given core data')
      : validation.errors;
    if (validationErrors.length > 0) {
      console.warn(`[BioV2] 题${problemIndex + 1} 输出校验:`, validationErrors);
    }

    if (callbacks?.onProblemGenerated) {
      try {
        console.log(`[BioV2 Publish] traceId=${traceId} onProblemGenerated start problemIndex=${problemIndex}`);
        await callbacks.onProblemGenerated(finalProblem, problemIndex);
        console.log(`[BioV2 Publish] traceId=${traceId} onProblemGenerated success problemIndex=${problemIndex}`);
      } catch (saveErr) {
        console.warn(`[BioV2] traceId=${traceId} 保存题${problemIndex + 1}失败:`, saveErr);
      }
    }

    const comparatorUsable =
      reviewResult.passed &&
      comparison.confidence !== 'low' &&
      Boolean(comparison.finalAuthorizedAnswer?.trim()) &&
      Boolean(comparison.finalSolutionText?.trim());
    finalProblem.qualityLevel = validation.isValid && comparatorUsable ? 'verified' : 'degraded';

    console.log(
      `[BioV2 Final] traceId=${traceId} quality=${finalProblem.qualityLevel} answersAgree=${comparison.answersAgree} confidence=${comparison.confidence}`,
    );

    return finalProblem;

  } catch (err) {
    console.error(`[BioV2] traceId=${traceId} 题${problemIndex + 1} 生成失败:`, err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 公共入口
// ─────────────────────────────────────────────────────────────────────────────

export interface BiologyV2WorkflowOptions {
  blindSolverModel?: string;
  cascadeEnabled?: boolean;
}

export async function runBiologyV2Workflow(
  rawInput: Partial<UserInput>,
  callbacks?: OrchestratorCallbacks,
  options?: BiologyV2WorkflowOptions,
): Promise<FinalProblem[]> {
  const finalProblems: FinalProblem[] = [];

  try {
    callbacks?.onStageChange?.(MultiNodeStage.NODE_0_INPUT, 0);

    const input: UserInput = {
      subject:         rawInput.subject ?? 'biology',
      topic:           rawInput.topic ?? '生物学',
      trapCount:       rawInput.trapCount ?? 0,
      problemCount:    rawInput.problemCount ?? 3,
      allowTableLookup: rawInput.allowTableLookup ?? true,
      language:        rawInput.language ?? 'zh-CN',
      singleQuestion:  rawInput.singleQuestion ?? false,
      useAntiInterference: rawInput.useAntiInterference ?? true,
      knowledgePointIds:   rawInput.knowledgePointIds,
    };
    console.log(`[BioV2 Stage] 题0: K0 输入校验 problemCount=${input.problemCount}`);

    const pLimit = (await import('p-limit')).default;
    // Kimi/MiniMax/GLM 有严格 TPM 限流，串行生成避免并发打爆 quota
    const currentModel = getOneApiModel().toLowerCase();
    const isRateLimited = getCurrentProvider() === 'oneapi'
        && (currentModel.includes('kimi') || currentModel.includes('minimax') || currentModel.includes('glm'));
    const isGptRateLimited = getCurrentProvider() === 'oneapi'
        && currentModel.includes('gpt');
    const limit  = pLimit(isRateLimited ? 1 : isGptRateLimited ? 10 : 10);

    // 批次题型分布追踪（记录最终草稿题型；维度选择在并发前完成，避免竞态）
    const typeTracker = { calculationCount: 0, totalCount: 0 };
    const disciplineCatalog = getAllDisciplines();

    // ── A0: 知识点分析 ────────────────────────────────────────────────────────
    // 单 KP  → analyzeKnowledgePoint（原逻辑不变）
    // 多 KP  → classifyAndGroupKPs 先分组：
    //   fusionGroup(≥2) → analyzeFusionKnowledgePoints（真融合，每题同时考察全部 KP）
    //   soloKPs         → analyzeKnowledgePoint(crossDomainHint=true)（生物跨领域交叉题）
    // 题目数量按各组覆盖的 KP 数加权分配，每组至少 1 题。

    const rawKPs: string[] = (() => {
      if (input.knowledgePointIds && input.knowledgePointIds.length > 0) {
        return input.knowledgePointIds;
      }
      const parts = splitKnowledgePointList(input.topic ?? '');
      return parts.length > 0 ? parts : [input.topic ?? '生物学'];
    })();

    const disciplineKey = identifyBiologyDiscipline(rawKPs[0], disciplineCatalog);
    const disciplineReasoningType = disciplineKey ? disciplineCatalog[disciplineKey]?.reasoningType : undefined;

    callbacks?.onStageChange?.(MultiNodeStage.NODE_1_RAG, 0);
    const t0 = Date.now();

    type KPAnalysisEntry = {
      analysis: BiologyKPAnalysisResult;
      kpCount: number;
      disciplineKey: string;
    };
    let kpEntries: KPAnalysisEntry[];

    if (rawKPs.length === 1) {
      // 单 KP：
      // - 用户已写明学科：只按该学科出题
      // - 用户未写明学科：取本地候选学科，允许同一知识点按不同学科/方向出题
      const explicit = detectExplicitBiologyDiscipline(rawKPs[0], disciplineCatalog);
      const candidates = explicit
        ? [explicit]
        : await getBiologyTopicCandidatesWithFallbackNormalization(
          rawKPs[0],
          Math.min(Math.max(1, input.problemCount), 3),
          disciplineCatalog,
        );

      kpEntries = (await Promise.all(candidates.map(async candidate => {
        const rt = disciplineCatalog[candidate.disciplineKey]?.reasoningType;
        const disciplineName = candidate.disciplineName;
        const analysis = await analyzeKnowledgePoint(
          candidate.knowledgePoint,
          rt,
          !candidate.explicitDiscipline,
          disciplineName,
        );
        return {
          analysis: {
            ...analysis,
            knowledgePoint: candidate.formattedTopic,
          },
          kpCount: 1,
          disciplineKey: candidate.disciplineKey,
        };
      }))).filter(e => {
        if (!e.analysis.unsupported && e.analysis.testDimensions.length > 0) return true;
        console.log(
          `[BioV2 A0] 跳过不自然方向: ${e.analysis.knowledgePoint}[${e.disciplineKey}] — ${e.analysis.unsupportedReason ?? 'unsupported'}`,
        );
        return false;
      });

      if (kpEntries.length === 0) {
        const fallback = explicit ?? candidates[0];
        const fallbackKey = fallback?.disciplineKey ?? identifyBiologyDiscipline(rawKPs[0], disciplineCatalog);
        if (!fallbackKey) throw new Error(`无法判别知识点所属生物子领域：${rawKPs[0]}`);
        const fallbackRt = disciplineCatalog[fallbackKey]?.reasoningType;
        const fallbackKnowledgePoint = fallback?.knowledgePoint ?? rawKPs[0];
        const fallbackFormattedTopic = fallback?.formattedTopic ?? `生物-${disciplineCatalog[fallbackKey]?.name ?? '生物学'}-${fallbackKnowledgePoint}`;
        const analysis = await analyzeKnowledgePoint(fallbackKnowledgePoint, fallbackRt, false);
        kpEntries = [{
          analysis: { ...analysis, knowledgePoint: fallbackFormattedTopic, unsupported: false },
          kpCount: 1,
          disciplineKey: fallbackKey,
        }];
        console.warn(`[BioV2 A0] 所有候选方向均被判 unsupported，回退到 ${fallbackFormattedTopic}`);
      }

      console.log(
        `[BioV2 A0] 单KP候选:`,
        kpEntries.map(e => `${e.analysis.knowledgePoint}[${e.disciplineKey}]`).join(' | '),
      );
    } else {
      // 多 KP：先分组
      const grouping = await classifyAndGroupKPs(rawKPs);
      console.log(
        `[BioV2 A0] 分组 → 融合:${JSON.stringify(grouping.fusionGroup)}`,
        `独立:${JSON.stringify(grouping.soloKPs)}`,
        `模式:${grouping.fusionMode ?? 'none'}`,
        `主学科:${grouping.primaryDisciplineHint ?? '未指定'} —`,
        grouping.reasoning,
      );

      const entryPromises: Promise<KPAnalysisEntry>[] = [];

      if (grouping.fusionGroup.length >= 2) {
        const fusionTopic = grouping.fusionGroup.join(' ');
        const fusionCandidate = (await getBiologyTopicCandidatesWithFallbackNormalization(fusionTopic, 1, disciplineCatalog))[0];
        const fusionDisciplineKey =
          resolveBiologyDisciplineKeyFromName(grouping.primaryDisciplineHint) ??
          fusionCandidate?.disciplineKey ??
          identifyBiologyDiscipline(fusionTopic, disciplineCatalog);
        if (!fusionDisciplineKey) throw new Error(`无法判别融合知识点所属生物子领域：${fusionTopic}`);
        const fusionDisciplineReasoningType = disciplineCatalog[fusionDisciplineKey]?.reasoningType;
        const fusionDisciplineName = disciplineCatalog[fusionDisciplineKey]?.name ?? grouping.primaryDisciplineHint;

        entryPromises.push(
          analyzeFusionKnowledgePoints(
            grouping.fusionGroup,
            fusionDisciplineReasoningType,
            fusionDisciplineName,
            {
              fusionMode: grouping.fusionMode,
              dependencyChain: grouping.dependencyChain,
              removalTest: grouping.removalTest,
              reasoning: grouping.reasoning,
            },
          )
            .then(analysis => ({
              analysis: {
                ...analysis,
                knowledgePoint: formatBiologyTopicLabel(fusionDisciplineKey, analysis.knowledgePoint),
                fusionMode: grouping.fusionMode,
                primaryDisciplineHint: grouping.primaryDisciplineHint,
                dependencyChain: grouping.dependencyChain,
                removalTest: grouping.removalTest,
              },
              kpCount: grouping.fusionGroup.length,
              disciplineKey: fusionDisciplineKey,
            })),
        );
      }

      for (const kp of grouping.soloKPs) {
        entryPromises.push((async () => {
          const candidate = (await getBiologyTopicCandidatesWithFallbackNormalization(kp, 1, disciplineCatalog))[0];
          const soloDiscKey = candidate?.disciplineKey ?? identifyBiologyDiscipline(kp, disciplineCatalog);
          if (!soloDiscKey) throw new Error(`无法判别知识点所属生物子领域：${kp}`);
          const soloDiscRT  = disciplineCatalog[soloDiscKey]?.reasoningType;
          const analysis = await analyzeKnowledgePoint(kp, soloDiscRT, true, disciplineCatalog[soloDiscKey]?.name);
          const formattedTopic = candidate?.formattedTopic ?? formatBiologyTopicLabel(soloDiscKey, kp);
          return {
            analysis: { ...analysis, knowledgePoint: formattedTopic },
            kpCount: 1,
            disciplineKey: soloDiscKey,
          };
        })());
      }

      kpEntries = (await Promise.all(entryPromises)).filter(e => {
        if (!e.analysis.unsupported && e.analysis.testDimensions.length > 0) return true;
        console.log(
          `[BioV2 A0] 跳过不自然方向: ${e.analysis.knowledgePoint}[${e.disciplineKey}] — ${e.analysis.unsupportedReason ?? 'unsupported'}`,
        );
        return false;
      });
      if (kpEntries.length === 0) {
        const fallbackKp = rawKPs[0] ?? '生物学';
        const candidate = (await getBiologyTopicCandidatesWithFallbackNormalization(fallbackKp, 1, disciplineCatalog))[0];
        const fallbackKey = candidate?.disciplineKey ?? identifyBiologyDiscipline(fallbackKp, disciplineCatalog);
        if (!fallbackKey) throw new Error(`无法判别知识点所属生物子领域：${fallbackKp}`);
        const fallbackRt = disciplineCatalog[fallbackKey]?.reasoningType;
        const analysis = await analyzeKnowledgePoint(fallbackKp, fallbackRt, false);
        kpEntries = [{
          analysis: {
            ...analysis,
            knowledgePoint: candidate?.formattedTopic ?? formatBiologyTopicLabel(fallbackKey, fallbackKp),
            unsupported: false,
          },
          kpCount: 1,
          disciplineKey: fallbackKey,
        }];
        console.warn('[BioV2 A0] 多KP所有方向均被判 unsupported，回退到首个知识点');
      }
      console.log(`[BioV2 A0] 分析完成:`, kpEntries.map(e => `${e.analysis.knowledgePoint}(w=${e.kpCount})`));
    }

    const a0Time = Date.now() - t0;

    // ── 按 KP 数量加权分配题目数 ──────────────────────────────────────────────
    // 权重 = 各组覆盖的 KP 数；每组至少 1 题；剩余题按权重比例分配。
    const totalWeight   = kpEntries.reduce((s, e) => s + e.kpCount, 0);
    const totalProblems = input.problemCount;
    const remaining     = Math.max(0, totalProblems - kpEntries.length);

    const allotments = kpEntries.map(e => 1 + Math.round((e.kpCount / totalWeight) * remaining));

    // 修正舍入误差（找权重最大的组补差值）
    const allotSum = allotments.reduce((s, n) => s + n, 0);
    const maxIdx   = kpEntries.reduce((mi, e, i) => e.kpCount > kpEntries[mi].kpCount ? i : mi, 0);
    allotments[maxIdx] += totalProblems - allotSum;

    console.log(`[BioV2 A0] 题目分配:`, kpEntries.map((e, i) => `${e.analysis.knowledgePoint}×${allotments[i]}`).join(' | '));

    // 展开成每道题对应的 kpAnalysis，并在并发前预分配维度/题型，避免批量同质化
    const kpPerProblem: KPAnalysisEntry[] = kpEntries.flatMap(
      (e, i) => Array(Math.max(1, allotments[i])).fill(e),
    ).slice(0, totalProblems);
    const plannedTypeCounts = new Map<string, number>();
    const assignments = kpPerProblem.map((entry, i) => assignBiologyDimension(entry.analysis, plannedTypeCounts, i));

    console.log(
      `[BioV2 A0] 题型/维度预分配:`,
      assignments.map((a, i) => `题${i + 1}:${a.dimension.problemType}/${a.dimension.dimension}`).join(' | '),
    );

    const promises = Array.from({ length: totalProblems }, (_, i) => {
      const entry = kpPerProblem[i] ?? kpEntries[0];
      const assignment = assignments[i];
      return limit(() => generateSingleBiologyV2(
        input, i,
        entry.analysis,
        a0Time, entry.disciplineKey, callbacks, typeTracker,
        options?.blindSolverModel, options?.cascadeEnabled, totalProblems,
        assignment?.dimensionIndex, disciplineCatalog,
      ));
    });

    const results = await Promise.all(promises);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result) {
        finalProblems.push(result);
        callbacks?.onProgress?.(i + 1, input.problemCount);
      }
    }

    callbacks?.onStageChange?.(MultiNodeStage.COMPLETED, input.problemCount);
    return finalProblems;

  } catch (err) {
    callbacks?.onStageChange?.(MultiNodeStage.ERROR, 0);
    callbacks?.onError?.(err instanceof Error ? err.message : String(err));
    throw err;
  }
}
