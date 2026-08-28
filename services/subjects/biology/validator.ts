import type { BaseProblem, BiologyProblemType } from '../../../types/multiNodeTypes';
import { callLLM } from '../../llmClient';
import { cleanAndParseJSON } from '../../utils/jsonCleaner';

/**
 * Biology: Node 4 Consistency Validator  (v2)
 *
 * 两层结构：
 * 1. 静态规则 — 无 LLM，只做三件事：
 *      a. 字段完整性
 *      b. 单位/量纲合理性（值域范围 + 符号）
 *      c. 明显逻辑冲突（同一上下文内的矛盾）
 * 2. LLM 语义层 — 把遗传比例合法性、条件充分性、推导唯一性全部交给 LLM
 *
 * 设计原则：
 * - 宁可漏检（false negative），不要误杀（false positive）
 * - 静态检查只保留误杀率极低的规则
 * - critical = 流水线继续也毫无意义；high = 可能影响解题；medium = 提示性
 */

// ─────────────────────────────────────────────────────────────────────────────
// 公共接口
// ─────────────────────────────────────────────────────────────────────────────

export interface BiologyViolation {
  category: string;
  severity: 'critical' | 'high' | 'medium';
  description: string;
  suggestedFix?: string;
}

export interface BiologyValidationResult {
  isValid: boolean;
  violations: BiologyViolation[];
  severity: 'critical' | 'high' | 'medium' | 'none';
  passedStaticChecks: boolean;
  summary: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 主入口
// ─────────────────────────────────────────────────────────────────────────────

export async function validateBiologyProblem(
  problem: BaseProblem,
): Promise<BiologyValidationResult> {
  const violations: BiologyViolation[] = [];

  // ── Layer 1: 静态规则（快速，无 LLM） ─────────────────────────────────────
  violations.push(...checkFieldCompleteness(problem));
  violations.push(...checkStepCount(problem));
  violations.push(...checkConditionCount(problem));

  const problemType = problem.problemType ?? 'calculation';
  if (problemType === 'calculation') {
    violations.push(...checkCalculationData(problem));
  }
  if (problemType === 'network-reasoning') {
    violations.push(...checkNetworkContradictions(problem));
  }

  const passedStaticChecks = violations.length === 0;

  // ── Layer 2: LLM 语义检查（仅在无 critical 时调用）─────────────────────────
  const hasCritical = violations.some(v => v.severity === 'critical');
  if (!hasCritical) {
    try {
      const llmViolations = await llmSanityCheck(problem);
      violations.push(...llmViolations);
    } catch (err) {
      console.warn('[BiologyValidator] LLM sanity check failed, skipping:', err);
    }
  }

  // ── 综合严重程度 ─────────────────────────────────────────────────────────
  let severity: BiologyValidationResult['severity'] = 'none';
  if (violations.some(v => v.severity === 'critical')) severity = 'critical';
  else if (violations.some(v => v.severity === 'high')) severity = 'high';
  else if (violations.length > 0) severity = 'medium';

  const summary =
    violations.length === 0
      ? '验证通过'
      : violations.map(v => `[${v.severity.toUpperCase()}] ${v.description}`).join(' | ');

  return {
    isValid: violations.length === 0,
    violations,
    severity,
    passedStaticChecks,
    summary,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Check 0: 字段完整性
// ─────────────────────────────────────────────────────────────────────────────

function checkFieldCompleteness(problem: BaseProblem): BiologyViolation[] {
  const violations: BiologyViolation[] = [];

  // Accept multiple possible text fields (legacy/multi-node adapters)
  const textField = (problem.questionBody ?? problem.originalProblemText ?? problem.mergedProblemText ?? (problem as any).questionText) as string | undefined;
  if (!textField || textField.trim().length < 10) {
    violations.push({
      category: 'missing_question_body',
      severity: 'critical',
      description: '题目缺少题干（questionBody 为空或过短），无法进行任何验证或求解。',
      suggestedFix: '确保 questionBody 包含完整的题目描述。',
    });
  }

  if (!problem.requiredAnswer || problem.requiredAnswer.trim().length === 0) {
    violations.push({
      category: 'missing_required_answer',
      severity: 'critical',
      description: '题目缺少求解目标（requiredAnswer 为空），solver 无法确认求解方向。',
      suggestedFix: '补充 requiredAnswer 字段，明确本题要求推断或计算的目标。',
    });
  }

  return violations;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Check 1: 解题步骤数
// 改为：按 logicConditions 数量（而非 difficulty 分数）动态计算下界
// 避免用 expectedDifficulty 代理步骤复杂度导致误杀
// ─────────────────────────────────────────────────────────────────────────────

function checkStepCount(problem: BaseProblem): BiologyViolation[] {
  const steps = problem.solutionPath ?? problem.referenceSteps ?? [];
  if (steps.length === 0) return []; // 无步骤信息时跳过（不误杀）

  const conditionCount = Object.keys(problem.logicConditions ?? {}).length;
  const dataCount = Object.keys(problem.givenData ?? {}).length;

  // 最低步骤数 = max(条件数, 已知数据数, 2)，上限为 6
  const minSteps = Math.min(Math.max(conditionCount, dataCount, 2), 6);

  if (steps.length < minSteps) {
    return [
      {
        category: 'insufficient_steps',
        severity: 'high',
        description:
          `解题路径步骤数不足：当前 ${steps.length} 步，` +
          `题目有 ${conditionCount} 个条件 / ${dataCount} 个数据，` +
          `预期至少 ${minSteps} 步。`,
        suggestedFix: `扩充 solutionPath，补充至 ≥${minSteps} 步的完整推导。`,
      },
    ];
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Check 2: 条件数量（按题型分别定义下界）
// 改为：per-type 下界，避免"1条件推理题"被过强误杀
// ─────────────────────────────────────────────────────────────────────────────

const MIN_CONDITIONS_BY_TYPE: Partial<Record<BiologyProblemType, number>> = {
  'genetic-reasoning':    1,  // 最简单的遗传题可以只有1条件
  'network-reasoning':    2,  // 图推理至少需要2条边/条件
  'threshold-reasoning':  1,
  'structural-reasoning': 1,
};

function checkConditionCount(problem: BaseProblem): BiologyViolation[] {
  const isReasoning = problem.problemType && problem.problemType !== 'calculation';
  if (!isReasoning) return [];

  const problemType = problem.problemType as BiologyProblemType;
  const minConditions = MIN_CONDITIONS_BY_TYPE[problemType] ?? 1;
  const conditionCount = Object.keys(problem.logicConditions ?? {}).length;

  if (conditionCount < minConditions) {
    return [
      {
        category: 'insufficient_conditions',
        severity: 'critical',
        description:
          `推理题（${problemType}）条件不足：当前 ${conditionCount} 个 logicConditions，` +
          `该题型至少需要 ${minConditions} 个独立条件。`,
        suggestedFix: `补充至少 ${minConditions} 个独立且不相矛盾的 logicConditions 条件。`,
      },
    ];
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Check 3: 计算题数值合理性
// 改动：
//   a. 用 regex alias 做 key 匹配，更健壮
//   b. 扩大 Km 范围至 1e-9 ~ 1e2
//   c. 移除"单位存在即通过"检查（单位存在 ≠ 单位正确，改交 LLM 处理）
//   d. 负值检查降级为 medium 并缩小范围（只检查肯定不能为负的量）
// ─────────────────────────────────────────────────────────────────────────────

interface ValueRange {
  min: number;
  max: number;
  description: string;
  /** 匹配 key 的 regex（忽略大小写） */
  pattern: RegExp;
}

const BIOLOGY_VALUE_RANGES: ValueRange[] = [
  {
    pattern: /\bpH\b/i,
    min: 0, max: 14,
    description: 'pH 合法范围 0–14',
  },
  {
    pattern: /(^|_|\s)(km|米氏常数|michaelis)(_|\s|$)/i,
    min: 1e-9, max: 1e2,
    description: 'Km（mol/L），通常 nM 至几十 mM',
  },
  {
    pattern: /(林德曼效率|trophic.efficiency|能流效率)/i,
    min: 0.05, max: 0.30,
    description: '林德曼能流效率 5%–30%',
  },
  {
    pattern: /(细胞周期时长|cell.cycle.duration)/i,
    min: 0.5, max: 72,
    description: '细胞周期（h），通常 0.5–72 小时',
  },
  {
    pattern: /(atp.合成效率|oxidative.phosphorylation.efficiency)/i,
    min: 0.05, max: 1.0,
    description: 'ATP 合成效率，不超过 100%（即≤1.0）',
  },
];

/** 明确不能为负的量（精确匹配，避免误杀温度/自由能等） */
const MUST_BE_NON_NEGATIVE: RegExp[] = [
  /\b(浓度|concentration|density|种群数量|细胞数量|菌落数|摩尔数|mol数)\b/i,
  /\b(速率|rate|velocity|flux)\b/i,
  /\b(效率|efficiency|yield|产率)\b/i,
];

function checkCalculationData(problem: BaseProblem): BiologyViolation[] {
  const violations: BiologyViolation[] = [];
  const data = { ...(problem.givenData ?? {}), ...(problem.coreData ?? {}) };

  // Require parameterDependencyTable for calculation-style biology problems when available
  if ((problem as any).problemType === 'calculation') {
    const pdt = (problem as any).parameterDependencyTable;
    if (!pdt || Object.keys(pdt).length === 0) {
      violations.push({
        category: 'missing_parameter_dependency_table',
        severity: 'high',
        description: '计算题应提供 parameterDependencyTable，说明每个参数在解题路径中的用途或为何为陷阱参数。',
        suggestedFix: '在生成结果中填充 parameterDependencyTable，或在题干中明确每个参数的角色。',
      });
    }
  }

  for (const [key, item] of Object.entries(data)) {
    if (!item || typeof item !== 'object') continue;
    const rawValue = (item as any).value;
    if (rawValue === undefined || rawValue === null) continue;
    const numValue = typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue));
    if (isNaN(numValue)) continue;

    // a. 值域检查（regex 匹配 key）
    for (const range of BIOLOGY_VALUE_RANGES) {
      if (range.pattern.test(key)) {
        if (numValue < range.min || numValue > range.max) {
          violations.push({
            category: 'value_out_of_range',
            severity: 'high',
            description:
              `字段「${key}」的数值 ${numValue} 超出合理范围（${range.min} ~ ${range.max}）。` +
              `（${range.description}）`,
            suggestedFix: `将「${key}」修正至合理范围 ${range.min} ~ ${range.max}。`,
          });
        }
        break;
      }
    }

    // b. 明确不能为负的量
    if (numValue < 0) {
      const mustBePositive = MUST_BE_NON_NEGATIVE.some(r => r.test(key));
      if (mustBePositive) {
        violations.push({
          category: 'negative_value',
          severity: 'medium',
          description: `字段「${key}」的数值为 ${numValue}（负数），该量在生物学上应为非负值。`,
          suggestedFix: `检查「${key}」的数值是否录入错误，该量应 ≥ 0。`,
        });
      }
    }
  }

  // c. Unit existence check for calculation core data
  if ((problem as any).problemType === 'calculation') {
    for (const [k, v] of Object.entries(problem.coreData ?? {})) {
      if (!v || typeof v !== 'object') continue;
      if (!('unit' in v) || !(v as any).unit || String((v as any).unit).trim().length === 0) {
        violations.push({
          category: 'missing_unit',
          severity: 'high',
          description: `字段「${k}」缺少单位信息，计算题必须为数值提供单位以避免歧义。`,
          suggestedFix: `为字段「${k}」补充单位（例如"mM","g","h"等）。`,
        });
      }
    }
  }

  return violations;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Check 4: 调控网络矛盾（仅限同一上下文内）
// 改动：
//   - 只在"同一句话/紧邻句子"内同时出现激活+抑制才判矛盾
//   - 不同条件下的双重调控（如浓度依赖）降级为 medium
// ─────────────────────────────────────────────────────────────────────────────

function checkNetworkContradictions(problem: BaseProblem): BiologyViolation[] {
  const violations: BiologyViolation[] = [];

  // 把全文分割为句子，每句单独检查
  const allText =
    (problem.questionBody ?? '') +
    Object.values(problem.logicConditions ?? {}).join(' ');

  // 简单分句：中文句号/分号 或英文句点/分号
  const sentences = allText.split(/[。；;.!！?？\n]+/).filter(s => s.trim().length > 0);

  const activatePattern = /(\S{1,20})\s*(?:激活|促进|上调|activate[sd]?|stimulate[sd]?)\s*(\S{1,20})/g;
  const inhibitPattern  = /(\S{1,20})\s*(?:抑制|降低|下调|inhibit[sd]?|suppress[ed]*)\s*(\S{1,20})/g;

  for (const sentence of sentences) {
    const activates: [string, string][] = [];
    const inhibits:  [string, string][] = [];

    let m: RegExpExecArray | null;
    const ap = new RegExp(activatePattern.source, 'g');
    const ip = new RegExp(inhibitPattern.source, 'g');

    while ((m = ap.exec(sentence)) !== null) activates.push([m[1], m[2]]);
    while ((m = ip.exec(sentence)) !== null) inhibits.push([m[1], m[2]]);

    for (const [src, tgt] of activates) {
      const conflict = inhibits.find(([s, t]) => s === src && t === tgt);
      if (conflict) {
        violations.push({
          category: 'network_edge_contradiction',
          severity: 'critical',
          description:
            `调控网络矛盾（同一句话内）：「${src}」对「${tgt}」同时被描述为激活和抑制。` +
            `原句：「${sentence.trim().slice(0, 60)}...」`,
          suggestedFix:
            `明确「${src}」对「${tgt}」的单一调控方向，或通过不同条件分开描述。`,
        });
      }
    }
  }

  return violations;
}

// ─────────────────────────────────────────────────────────────────────────────
// Layer 2: LLM 深层语义检查
// 改动：
//   - 把遗传比例、条件充分性、推导唯一性、阈值、结构约束全部移到此处
//   - 加 schema 校验：severity 必须是合法值
// ─────────────────────────────────────────────────────────────────────────────

const VALID_SEVERITIES = new Set<string>(['critical', 'high', 'medium']);

const TYPE_SPECIFIC_CHECKS: Record<BiologyProblemType, string> = {
  'calculation':
    `① 已知数据是否足够（无遗漏关键参数）
② 数值单位是否匹配可计算（如不能把 mol 直接当 g）
③ 计算过程能否给出唯一确定答案
④ 题目涉及的生物实体所假设的动力学模型是否适用：别构酶（PFK-1、ATCase、血红蛋白等）不适用简单 Michaelis-Menten 方程；协同结合蛋白不适用单位点结合模型；若套用了不适合的模型，报告 critical`,

  'genetic-reasoning':
    `① 后代比例（若有）是否符合孟德尔遗传规律或常见变式（致死、连锁、表观遗传等）
② 给定条件能否唯一确定遗传方式，是否存在无法排除的竞争假设
③ 是否需要更多杂交实验数据才能得出唯一结论
④ 【跨源数值一致性】若题目同时给出后代统计数量和显式声明的遗传参数（图距、交换率、双交换分类等），请从统计数据独立推算这些参数，并与题干声明值比对——差距超过 5% 或分类矛盾，报告 critical
⑤ 【术语定义一致性】检查遗传学术语是否用法正确：干涉系数（interference）= 1 - 并发系数（coefficient of coincidence），不可混用；若题目在括号或"即"后给出了错误等价定义，报告 high`,

  'network-reasoning':
    `① 跨句子的激活/抑制关系是否整体自洽（无矛盾循环）
② 从给定的网络图/关系描述能否唯一推断信号输出；若存在竞争路径（多信号作用同一靶点），题目是否给出了明确的优先级规则或定量关系——缺失时报告 high
③ 是否存在未定义的节点、孤立边或缺失的边`,

  'threshold-reasoning':
    `① 题目是否明确或暗示了阈值/临界值（包括数值比较、"超过/达到/高于"等表述）
② 迟滞条件（若有）是否自洽（激活阈值与去激活阈值方向正确）
③ 扰动方向与系统状态转换是否一致（增大信号 → 越过阈值 → 状态跳变方向正确）
④ 【迟滞初始状态完备性】若存在迟滞（θ_off ≠ θ_on），中间区间行为依赖历史状态，题目必须显式声明初始激活/去激活状态；仅凭"在某条件下培养"推断初始状态，报告 critical`,

  'structural-reasoning':
    `① 是否存在明确的结构→功能推导关系（如突变影响结合口袋→丧失催化活性）
② 结构约束条件是否完整（碱基互补/氨基酸特性/空间构象，至少一项需明确）
③ 实验条件是否与结构约束矛盾`,
};

async function llmSanityCheck(problem: BaseProblem): Promise<BiologyViolation[]> {
  const problemType = (problem.problemType ?? 'calculation') as BiologyProblemType;

  const conditionBlock =
    problem.logicConditions && Object.keys(problem.logicConditions).length > 0
      ? '【已知条件】：\n' +
        Object.entries(problem.logicConditions)
          .map(([k, v]) => `  - ${k}：${v}`)
          .join('\n')
      : '';

  const dataBlock =
    problem.givenData && Object.keys(problem.givenData).length > 0
      ? '【已知数据】：\n' +
        Object.entries(problem.givenData)
          .map(([k, v]) => `  - ${k}：${(v as any).value} ${(v as any).unit ?? ''}`)
          .join('\n')
      : '';

  const solutionBlock =
    (problem.solutionPath ?? []).length > 0
      ? '【参考解题路径】：\n' +
        (problem.solutionPath ?? []).map((s, i) => `  ${i + 1}. ${s}`).join('\n')
      : '';

  const prompt = `你是生物学竞赛阅卷专家。请检查以下生物学题目是否存在内部逻辑问题。

【题型】：${problemType}
【主题】：${problem.topic}
【题目正文】：
${problem.questionBody ?? '（无）'}
${conditionBlock}
${dataBlock}
${solutionBlock}
【求解目标】：${problem.requiredAnswer}

【检查重点（${problemType}）】：
${TYPE_SPECIFIC_CHECKS[problemType] ?? TYPE_SPECIFIC_CHECKS['calculation']}

【判断规则】：
- 只报告确实存在的、明确的问题；不报告风格偏好或主观判断
- 每个问题必须具体说明：哪里有问题、为什么是问题、怎么修复
- 如果存在多个解释但题目本身没有明确说哪种，算作"条件不充分（high）"而非"critical"
- 最多报告 3 个最严重的问题
- 如果题目完全合理，返回空数组 []

输出必须是严格 JSON 数组（不含 markdown 代码块）：
[
  {
    "category": "问题类别（英文小写下划线，如 ambiguous_ratio）",
    "severity": "critical 或 high 或 medium",
    "description": "问题描述（1-2句话，具体）",
    "suggestedFix": "修复建议（1句话）"
  }
]
或 []`;

  // Use deterministic low-temperature reasoning model and robust JSON cleaner
  let raw: string;
  try {
    raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.05 })).trim();
  } catch (e) {
    console.warn('[BiologyValidator] LLM sanity check call failed, skipping LLM checks:', e);
    return [];
  }

  // Extract JSON-like array and parse with robust cleaner
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const parsed = cleanAndParseJSON(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is BiologyViolation =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.category === 'string' &&
          VALID_SEVERITIES.has(item.severity) &&
          typeof item.description === 'string' &&
          item.description.length > 0,
      )
      .slice(0, 3);
  } catch (err) {
    console.warn('[BiologyValidator] LLM sanity parse failed, raw response prefix:', raw.slice(0, 200));
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 修复辅助：生成修复 prompt（供 orchestrator 调用）
// ─────────────────────────────────────────────────────────────────────────────

export function buildRepairPrompt(
  problem: BaseProblem,
  violations: BiologyViolation[],
): string {
  const violationList = violations
    .map(
      (v, i) =>
        `${i + 1}. [${v.severity.toUpperCase()}] ${v.description}` +
        (v.suggestedFix ? `\n   修复建议：${v.suggestedFix}` : ''),
    )
    .join('\n');

  const problemType = problem.problemType ?? 'calculation';

  const conditionBlock =
    problem.logicConditions && Object.keys(problem.logicConditions).length > 0
      ? JSON.stringify(problem.logicConditions, null, 2)
      : '{}';

  const dataBlock =
    problem.givenData && Object.keys(problem.givenData).length > 0
      ? JSON.stringify(problem.givenData, null, 2)
      : '{}';

  return `你是生物学题目修复专家。请根据下方验证问题对题目进行最小化修复。

【当前题目】：
主题：${problem.topic}
题型：${problemType}
题目正文：
${problem.questionBody ?? ''}

已知条件：
${conditionBlock}

已知数据：
${dataBlock}

求解目标：${problem.requiredAnswer}

解题路径：
${(problem.solutionPath ?? []).map((s, i) => `  步骤${i + 1}：${s}`).join('\n')}

【需要修复的问题】：
${violationList}

【修复规则】：
1. 只修复上述列出的问题，保持题目主题、题型、核心考察点不变
2. 修复后必须确保：条件充分且不矛盾、结论唯一可推导、数值在合理范围内
3. 如果修复需要增加条件，增加的条件必须与已有条件逻辑一致
4. 如果是数值超范围，修正为合理数值并同步更新解题路径
5. 不得删除已有的有效条件或推理步骤

输出必须是严格 JSON（不含 markdown 代码块），字段与原 BaseProblem 结构完全一致：
{
  "problemId": "${problem.problemId}",
  "topic": "${problem.topic}",
  "problemType": "${problemType}",
  "scenario": ${JSON.stringify(problem.scenario ?? '')},
  "questionBody": "修复后的完整题目正文",
  "logicConditions": {},
  "givenData": {},
  "requiredAnswer": "${problem.requiredAnswer}",
  "solutionPath": ["步骤1", "步骤2", "步骤3", "步骤4"],
  "expectedDifficulty": ${problem.expectedDifficulty ?? 5}
}`;
}
