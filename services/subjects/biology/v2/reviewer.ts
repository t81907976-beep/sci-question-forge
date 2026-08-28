import { callLLM, cleanJsonString } from '../../../llmClient';
import { cleanAndParseJSON } from '../../../utils/jsonCleaner';
import type { BiologyV2Draft } from './generator';
import type { BiologyProblemType } from '../../../../types/multiNodeTypes';
import type { DisciplineEntry } from '../disciplines';

/**
 * Biology V2 Node A2/A3: Reviewer + Repair Loop
 *
 * 对标化学 reviewer，但审查维度完全替换为生物学自洽性：
 *
 * 审查维度 1 — 题目合理性（biology-specific）：
 *   - 遗传题：后代比例是否符合孟德尔或常见变式，条件能否唯一确定遗传方式
 *   - 网络题：激活/抑制关系是否自洽，推导路径是否唯一
 *   - 阈值题：阈值是否明确，迟滞参数是否自洽
 *   - 结构题：结构约束是否完整，结构→功能链是否无缺失步骤
 *   - 计算题：数值单位是否匹配，已知数据是否充分，答案是否唯一
 *
 * 审查维度 2 — 难度合理性：
 *   - 是否达到竞赛/研究生水平
 *   - 推理步骤是否 ≥8 步
 *   - 是否有真正的推理而非查表代入
 *
 * 审查维度 3 — 逻辑深度：
 *   - 是否有判断分叉（先判断某条件，再走不同路径）
 *   - 是否有隐含条件（需自行推断，不是全部显式给出）
 *   - 是否是教材模板题
 *
 * 修复策略：
 * - depthIssues 存在 → deepRepair（更换情境/重构推理链）
 * - 仅 validity/difficulty 问题 → detailRepair（精确修复数值/条件）
 * - 最多 2 轮修复，第 3 轮只做终审
 */

export interface BiologyReviewResult {
  passed: boolean;
  validityIssues: string[];
  difficultyIssues: string[];
  depthIssues: string[];
  overallVerdict: string;
  correctionHints: string[];
  cascadeTrapReview?: {
    expected: boolean;
    present: boolean;
    passed: boolean;
    issues: string[];
    summary: string;
  };
}

export interface BiologyReviewedDraft {
  draft: BiologyV2Draft;
  reviewResult: BiologyReviewResult;
  repairCycles: number;
}

function sanitizeBiologyTokensForSafety(text: string): string {
  if (!text) return text;

  let sanitized = text;

  // 先处理完整的 "... pv. ... ATCC 12345" 片段，避免分步替换后语义碎裂
  sanitized = sanitized.replace(
    /\b([A-Z][a-z]+\s+[a-z][a-z0-9-]*)\s+pv\.\s*[A-Za-z0-9_-]+\s+ATCC\s*\d+\b/gi,
    '某研究菌株',
  );

  // 单独替换高风险菌株编号与变种标记
  sanitized = sanitized.replace(/\bATCC\s*\d+\b/gi, '某标准菌株');
  sanitized = sanitized.replace(/\bpv\.\s*[A-Za-z0-9_-]+\b/gi, '某变种');

  return sanitized;
}

function buildSanitizedDraftForReview(draft: BiologyV2Draft): BiologyV2Draft {
  return {
    ...draft,
    questionText: sanitizeBiologyTokensForSafety(draft.questionText || ''),
    referenceAnswer: sanitizeBiologyTokensForSafety(draft.referenceAnswer || ''),
    requiredAnswer: sanitizeBiologyTokensForSafety(draft.requiredAnswer || ''),
    referenceSteps: (draft.referenceSteps ?? []).map(step => sanitizeBiologyTokensForSafety(step)),
    seductiveWrongPath: draft.seductiveWrongPath
      ? {
          wrongApproach: sanitizeBiologyTokensForSafety(draft.seductiveWrongPath.wrongApproach || ''),
          divergenceStep: sanitizeBiologyTokensForSafety(draft.seductiveWrongPath.divergenceStep || ''),
          whySeductive: sanitizeBiologyTokensForSafety(draft.seductiveWrongPath.whySeductive || ''),
        }
      : draft.seductiveWrongPath,
  };
}

function normalizeCascadeTrapShape(draft: BiologyV2Draft): BiologyV2Draft {
  const rawTrap = (draft as any).cascadeTrap;
  if (!rawTrap || typeof rawTrap !== 'object' || Array.isArray(rawTrap)) return draft;

  const safeStringify = (value: unknown): string => {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const fieldToString = (value: unknown): string => {
    if (typeof value === 'string') return value.trim();
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) {
      return value.map(fieldToString).filter(Boolean).join('; ');
    }
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const preferred = obj.description ?? obj.desc ?? obj.summary ?? obj.mechanism ?? obj.text ?? obj.content;
      if (typeof preferred === 'string' && preferred.trim()) return preferred.trim();
      return Object.entries(obj)
        .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : safeStringify(v)}`)
        .join('; ')
        .trim();
    }
    return String(value).trim();
  };

  const nestedTrap = typeof rawTrap.trap === 'object' && rawTrap.trap !== null ? rawTrap.trap : {};
  const source = { ...(nestedTrap as Record<string, unknown>), ...(rawTrap as Record<string, unknown>) };

  (draft as any).cascadeTrap = {
    trap1: fieldToString(source.trap1 ?? source.layer1 ?? source.first),
    trap2: fieldToString(source.trap2 ?? source.layer2 ?? source.second),
    linkage: fieldToString(source.linkage ?? source.link ?? source.relation),
    trap1WrongOutcome: fieldToString(source.trap1WrongOutcome ?? source.wrongOutcome ?? source.layer1WrongOutcome),
    trap1CorrectUnlock: fieldToString(source.trap1CorrectUnlock ?? source.correctUnlock ?? source.layer1CorrectUnlock),
    trap2Discriminator: fieldToString(source.trap2Discriminator ?? source.discriminator ?? source.layer2Discriminator),
    finalOutcomeShift: fieldToString(source.finalOutcomeShift ?? source.outcomeShift ?? source.finalShift),
  };

  return draft;
}

function isExternalizationLintEnabled(): boolean {

  const raw = ((process as any)?.env?.EXTERNALIZATION_LINT_STRICT ?? 'true').toString().toLowerCase();
  return !(raw === '0' || raw === 'false' || raw === 'off');
}

function detectExternalizationIssues(questionText: string): string[] {
  const text = questionText || '';
  const issues: string[] = [];

  const splitSentences = (input: string): string[] =>
    input
      .split(/[。！？；\n]/)
      .map(s => s.trim())
      .filter(Boolean);

  const containsAny = (s: string, words: string[]): boolean => words.some(w => s.includes(w));

  const allowlistedContext = (s: string): boolean => {
    // 允许客观实验流程/记录性描述，避免把合理题面误杀为外显
    return containsAny(s, [
      '实验步骤', '处理组', '对照组', '测得', '记录', '采样', '培养', '孵育', '统计方法',
    ]);
  };

  const sentences = splitSentences(text);

  let hasJudgmentExternalization = false;
  let hasMethodExternalization = false;
  let hasPathNamingExternalization = false;
  let hasHintExternalization = false;

  for (const s of sentences) {
    const sentence = s.replace(/\s+/g, '');
    if (!sentence || allowlistedContext(sentence)) continue;

    // 规则1：判断句式外显（关键词 + 结论/操作词 同句共现）
    const hasConditionStarter = /(若|如果|当|超过|低于|高于|一旦)/.test(sentence);
    const hasActionOrConclusion = /(则|就|应|需|要|必须|改用|采用|判断为|可判定|可知|因此)/.test(sentence);
    if (hasConditionStarter && hasActionOrConclusion) {
      hasJudgmentExternalization = true;
    }

    // 规则2：操作方法/数据用途外显（用途词 + 判断/操作词 同句共现）
    const hasUsageWord = /(用于判定|用于判断|用来判断|据此判断|以便判断|用于计算|据此计算|按.*(加权|建立方程|计算))/.test(sentence);
    const hasOperationWord = /(判定|判断|计算|选择|改用|采用|建立方程|加权)/.test(sentence);
    if (hasUsageWord && hasOperationWord) {
      hasMethodExternalization = true;
    }

    // 规则3：路径命名外显（同句出现两个路径/模型及其用途绑定）
    const hasDualPathMention = /(路径|模型).{0,20}(和|与|及|分别).{0,20}(路径|模型)/.test(sentence)
      || /(聚集态|解聚态).{0,20}(牛顿|幂律|模型)/.test(sentence);
    const hasBindingWord = /(用|采用|应使用|改用|对应)/.test(sentence);
    if (hasDualPathMention && hasBindingWord) {
      hasPathNamingExternalization = true;
    }

    // 规则4：结论/提示外显（强提示词）
    if (/(提示：|隐含条件|可知应|因此应选|因此答案|故选)/.test(sentence)) {
      hasHintExternalization = true;
    }
  }

  if (hasJudgmentExternalization) issues.push('【Lint】判断句式外显（条件词与结论/操作词同句共现）');
  if (hasMethodExternalization) issues.push('【Lint】操作方法/数据用途外显（用途词与判断/操作词同句共现）');
  if (hasPathNamingExternalization) issues.push('【Lint】路径命名外显（路径/模型与用途绑定）');
  if (hasHintExternalization) issues.push('【Lint】结论/提示外显');

  return issues;
}

function mergeExternalizationLint(
  review: BiologyReviewResult,
  draft: BiologyV2Draft,
): BiologyReviewResult {
  if (!isExternalizationLintEnabled()) return review;

  const lintIssues = detectExternalizationIssues(draft.questionText || '');
  if (lintIssues.length === 0) return review;

  return {
    ...review,
    correctionHints: [
      ...review.correctionHints,
      ...lintIssues.map(issue => `${issue}（仅提示，不拦截）`),
    ],
  };
}

export function detectFormulaChainDegeneration(draft: BiologyV2Draft): string[] {
  if (draft.problemType !== 'calculation') return [];

  const questionText = draft.questionText || '';
  const referenceText = [draft.referenceAnswer, ...(draft.referenceSteps ?? [])].join('\n');
  const combined = `${questionText}\n${referenceText}`;
  const issues: string[] = [];

  const asksTerminalScalar = /(求|计算|估算).{0,28}(总量|增量|浓度|比例|通量|速率|分子数|产量|固定量|同化量|积分|末端|最终值|报告值)/i.test(questionText)
    || /(最终|总|净).{0,16}(数值|标量|读数|输出|产物|产量)/i.test(questionText);
  const hasLinearFormulaOperators = /(代入|乘以|减去|加上|换算|积分|取最小|取最大|取上限|取下限|min\s*\(|max\s*\(|=|×)/i.test(referenceText);
  const hasAllInputsVisible = /(已知|给出|记录|显示|为|等于).{0,20}(上限|容量|比例|效率|速率|浓度|时间|面积|体积|分子数|参数|公式|函数)/i.test(questionText);
  const mechanismDecisionSignals = [
    /(判定|判断|比较|排除|选择|归因|异常|机制|模型|方案|可行性|边界条件)/i.test(questionText),
    /(读出|读数|通道|口径|状态池|亚群|构象|慢变量|快变量|滞后|迟滞|阈值|时标|分叉)/i.test(questionText),
    /(竞争|替代|不可区分|不可识别|冲突|反证|候选|排他|唯一解释)/i.test(questionText),
  ].filter(Boolean).length;

  const branchSignalCount = (combined.match(/判定|判断|比较|排除|选择|归因|异常|机制|模型|方案|可行性|边界条件|读出|通道|口径|状态池|阈值|分叉|竞争|冲突|候选|排他/g) ?? []).length;

  const steps = draft.referenceSteps ?? [];
  const shortStepCount = steps.length > 0 && steps.length < 8;
  const directFormulaStepCount = steps.filter(step => /(代入|乘以|减去|加上|换算|积分|取最小|取最大|取上限|得到|=|×)/.test(step)).length;
  const formulaDominatedSteps = steps.length > 0 && directFormulaStepCount >= Math.max(2, steps.length - 1);
  const decisionClosure = draft.decisionClosure;
  const hasRealDecisionClosure = Boolean(
    decisionClosure?.primaryDecisionVariable &&
    decisionClosure?.comparisonTarget &&
    decisionClosure?.exclusionConstraint,
  );
  const hasWeakSeductivePath = !draft.seductiveWrongPath?.wrongApproach || !draft.seductiveWrongPath?.divergenceStep;
  const cascadeTrap = draft.cascadeTrap as any;
  const hasCausalCascade = Boolean(
    cascadeTrap?.trap1CorrectUnlock &&
    cascadeTrap?.trap2Discriminator &&
    cascadeTrap?.finalOutcomeShift &&
    tokenOverlapScore(String(cascadeTrap.trap1CorrectUnlock), referenceText) >= 2 &&
    tokenOverlapScore(String(cascadeTrap.trap2Discriminator), referenceText) >= 2 &&
    tokenOverlapScore(String(cascadeTrap.finalOutcomeShift), referenceText) >= 2,
  );

  if (asksTerminalScalar && hasLinearFormulaOperators && hasAllInputsVisible && mechanismDecisionSignals < 2 && !hasRealDecisionClosure && !hasCausalCascade) {
    issues.push('【DeterministicLint】公式链退化：题目是无分叉终点标量直算，可由题面显式参数按线性代入/换算/取极值直接得到，没有足够路径分叉、变量定义切换或唯一候选闭合。');
  }

  if (asksTerminalScalar && branchSignalCount > 10 && !hasRealDecisionClosure && !hasCausalCascade) {
    issues.push('【DeterministicLint】分叉过载但无主闭合链：题目堆叠多个判断/口径/候选信号，却没有 decisionClosure 或能进入 referenceSteps 的因果级联；必须压缩为 1 个主分叉 + 1 个层2判别 + 最多 1 个辅助闭合。');
  }

  if (asksTerminalScalar && shortStepCount && formulaDominatedSteps && !hasRealDecisionClosure && !hasCausalCascade) {
    issues.push('【DeterministicLint】计算链过短且几乎全为代入/换算/取极值步骤，未形成多机制耦合、隐含框架选择、跨通道冲突或级联陷阱。');
  }

  if (asksTerminalScalar && hasWeakSeductivePath) {
    issues.push('【DeterministicLint】缺少有效诱惑性错误路径；计算题必须让错误路径在变量定义、适用模型、读出口径、状态归属或边界条件上分叉，而不是只设置多余参数。');
  }

  return issues;
}

function hasFormulaChainDegenerationIssue(issues: string[]): boolean {
  return issues.some(issue => /DeterministicLint|公式链退化|计算链过短|分叉过载|缺少有效诱惑性错误路径/.test(issue));
}

function mergeDeterministicDegenerationLint(
  review: BiologyReviewResult,
  draft: BiologyV2Draft,
): BiologyReviewResult {
  const depthIssues = detectFormulaChainDegeneration(draft);
  if (depthIssues.length === 0) return review;

  return {
    ...review,
    passed: false,
    depthIssues: [...review.depthIssues, ...depthIssues],
    overallVerdict: review.overallVerdict === 'pass' ? 'fail_formula_chain_degenerated' : review.overallVerdict,
    correctionHints: [
      ...review.correctionHints,
      '修复方向：不要只补步骤或换数字，必须重写题目骨架；先设计“主分叉变量 → 分叉后变量定义/模型切换 → 层2判别量 → 最终结论改变”，再生成题面和答案。保持计算闭合优先；可以求唯一数值、唯一范围、唯一中间闭合量、可由题设约束唯一确定的表达式/公式，或由主闭合量支撑的唯一判定结论，但必须增加会改变后续路径、变量定义、读出口径或表达式形式的真实分叉和级联陷阱。若采用机制/归因/方案判定，必须由可计算主闭合量/判别量唯一闭合，禁止候选列表逐条排除或开放式解释题。',
    ],
  };
}

function tokenOverlapScore(source: string, target: string): number {
  const tokens = source
    .split(/[\s，,。；;、：:（）()\[\]{}<>《》"'“”‘’=+\-×*/]+/u)
    .map(token => token.trim())
    .filter(token => token.length >= 2);
  if (tokens.length === 0) return 0;
  return tokens.filter(token => target.includes(token)).length;
}

function evaluateCascadeTrapReview(
  draft: BiologyV2Draft,
  cascadeExpected: boolean,
): { expected: boolean; present: boolean; passed: boolean; issues: string[]; summary: string } {
  const trap = draft.cascadeTrap;
  const present = Boolean(trap);
  const issues: string[] = [];

  if (cascadeExpected && !present) {
    issues.push('【CascadeReview】已启用级联陷阱但题目缺少 cascadeTrap 字段');
  }

  if (present) {
    const normalizeCascadeField = (value: unknown): string => {
      if (typeof value === 'string') return value.trim();
      if (value === null || value === undefined) return '';
      return String(value).trim();
    };

    const trap1Raw = trap?.trap1;
    const trap2Raw = trap?.trap2;
    const linkageRaw = trap?.linkage;
    const trap1WrongOutcomeRaw = (trap as any)?.trap1WrongOutcome;
    const trap1CorrectUnlockRaw = (trap as any)?.trap1CorrectUnlock;
    const trap2DiscriminatorRaw = (trap as any)?.trap2Discriminator;
    const finalOutcomeShiftRaw = (trap as any)?.finalOutcomeShift;

    const fieldSpecs = [
      ['trap1', trap1Raw],
      ['trap2', trap2Raw],
      ['linkage', linkageRaw],
      ['trap1WrongOutcome', trap1WrongOutcomeRaw],
      ['trap1CorrectUnlock', trap1CorrectUnlockRaw],
      ['trap2Discriminator', trap2DiscriminatorRaw],
      ['finalOutcomeShift', finalOutcomeShiftRaw],
    ] as const;

    for (const [fieldName, rawValue] of fieldSpecs) {
      if (rawValue !== undefined && rawValue !== null && typeof rawValue !== 'string') {
        issues.push(`【CascadeReview】cascadeTrap.${fieldName} 类型异常: ${typeof rawValue}`);
      }
    }

    const trap1 = normalizeCascadeField(trap1Raw);
    const trap2 = normalizeCascadeField(trap2Raw);
    const linkage = normalizeCascadeField(linkageRaw);
    const trap1WrongOutcome = normalizeCascadeField(trap1WrongOutcomeRaw);
    const trap1CorrectUnlock = normalizeCascadeField(trap1CorrectUnlockRaw);
    const trap2Discriminator = normalizeCascadeField(trap2DiscriminatorRaw);
    const finalOutcomeShift = normalizeCascadeField(finalOutcomeShiftRaw);

    if (!trap1) issues.push('【CascadeReview】cascadeTrap.trap1 为空');
    if (!trap2) issues.push('【CascadeReview】cascadeTrap.trap2 为空');
    if (!linkage) issues.push('【CascadeReview】cascadeTrap.linkage 为空');
    if (!trap1WrongOutcome) issues.push('【CascadeReview】cascadeTrap.trap1WrongOutcome 为空，未说明层1错解导向的错误结果');
    if (!trap1CorrectUnlock) issues.push('【CascadeReview】cascadeTrap.trap1CorrectUnlock 为空，未说明层1正解后解锁的层2变量/状态空间');
    if (!trap2Discriminator) issues.push('【CascadeReview】cascadeTrap.trap2Discriminator 为空，未说明层2判别量');
    if (!finalOutcomeShift) issues.push('【CascadeReview】cascadeTrap.finalOutcomeShift 为空，未说明层2如何改变最终候选/结论');

    if (trap1 && trap2 && trap1 === trap2) {
      issues.push('【CascadeReview】trap1 与 trap2 完全相同，未形成级联分层');
    }

    if (linkage && !/(层1|trap1|第一层|先|触发|引入|解锁|暴露)/.test(linkage)) {
      issues.push('【CascadeReview】linkage 未清晰描述“层1如何引入层2”');
    }

    if (trap1CorrectUnlock && !/(解锁|暴露|进入|剩余|状态空间|变量|边界|候选)/.test(trap1CorrectUnlock)) {
      issues.push('【CascadeReview】trap1CorrectUnlock 未体现层1正解后才出现的新变量/边界/候选空间');
    }

    if (finalOutcomeShift && !/(改变|翻转|排除|剩余|候选|机制|结论|错误|正确|由.*到|从.*到|数值|范围|表达式|闭合量)/.test(finalOutcomeShift)) {
      issues.push('【CascadeReview】finalOutcomeShift 未体现层2对最终候选、数值、范围、表达式或结论的改变');
    }

    const referenceTrace = [draft.referenceAnswer, ...(draft.referenceSteps ?? [])].join('\n');
    const unlockUsed = tokenOverlapScore(trap1CorrectUnlock, referenceTrace) >= 2;
    const discriminatorUsed = tokenOverlapScore(trap2Discriminator, referenceTrace) >= 2;
    const outcomeShiftUsed = tokenOverlapScore(finalOutcomeShift, referenceTrace) >= 2;

    if (trap1CorrectUnlock && trap2Discriminator && finalOutcomeShift && (!unlockUsed || !discriminatorUsed || !outcomeShiftUsed)) {
      issues.push('【CascadeReview】级联陷阱未进入参考解题因果链：trap1CorrectUnlock、trap2Discriminator、finalOutcomeShift 必须在 referenceSteps/referenceAnswer 中实际改变后续变量、读出口径、候选集合、数值范围或表达式形式，不能只写在 cascadeTrap 文案里。');
    }
  }

  const passed = issues.length === 0;
  const summary = !cascadeExpected
    ? (present ? '未强制启用，题目包含可选级联陷阱' : '未强制启用，题目未包含级联陷阱')
    : (passed ? '已启用且通过级联陷阱结构审查' : '已启用但未通过级联陷阱结构审查');

  return { expected: cascadeExpected, present, passed, issues, summary };
}

function mergeCascadeTrapReview(
  review: BiologyReviewResult,
  draft: BiologyV2Draft,
  cascadeExpected: boolean,
): BiologyReviewResult {
  const cascadeTrapReview = evaluateCascadeTrapReview(draft, cascadeExpected);
  if (cascadeTrapReview.passed) {
    return { ...review, cascadeTrapReview };
  }

  return {
    ...review,
    passed: false,
    difficultyIssues: [...review.difficultyIssues, ...cascadeTrapReview.issues],
    correctionHints: [
      ...review.correctionHints,
      '补齐 cascadeTrap 全部字段：层1错解结果、层1正解解锁的层2变量、层2判别量、层2导致的最终候选/结论变化；禁止并列质控式弱级联',
    ],
    cascadeTrapReview,
  };
}

function getCascadeTrapFieldType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function logCascadeTrapDiagnostics(
  draft: BiologyV2Draft,
  tracePrefix: string,
  round: number,
): void {
  const trap = draft.cascadeTrap as any;
  if (!trap) {
    console.log(`[BioV2 CascadeTrap] ${tracePrefix}round=${round} present=false`);
    return;
  }

  const trapType = getCascadeTrapFieldType(trap);
  const trap1Type = getCascadeTrapFieldType(trap?.trap1);
  const trap2Type = getCascadeTrapFieldType(trap?.trap2);
  const linkageType = getCascadeTrapFieldType(trap?.linkage);

  console.log(
    `[BioV2 CascadeTrap] ${tracePrefix}round=${round} present=true trapType=${trapType} trap1Type=${trap1Type} trap2Type=${trap2Type} linkageType=${linkageType}`,
  );

  if (trapType !== 'object' || trap1Type !== 'string' || trap2Type !== 'string' || linkageType !== 'string') {
    console.warn(
      `[BioV2 CascadeTrap] ${tracePrefix}round=${round} 非预期字段快照:`,
      {
        trap,
        trap1: trap?.trap1,
        trap2: trap?.trap2,
        linkage: trap?.linkage,
      },
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 按题型定制的审查维度 1 重点
// ─────────────────────────────────────────────────────────────────────────────

const VALIDITY_CHECKS: Record<BiologyProblemType, string> = {
  'calculation':
    `- 【强制执行：数值交叉验证】提取题目正文中所有显式公式/定义（如"效率 = A/B×100%"、"Km = (k₋₁+k₂)/k₁"等），将题目给出的全部数值代入，计算结果；若结果超出物理/热力学允许范围（如任何形式的"效率">100%、速率为负、Km/Ki为负数、摩尔数>总投入量），或与题干另一处声明的数值矛盾，判为 critical validityIssue，写明具体数值冲突（如"按题目公式计算理论ATP上限=12，但题目给出33.6，偶联效率=280%"）
- 【强制执行：参数角色唯一性】遍历题目中每一个给出的数值参数，逐一在 referenceSteps 或 parameterDependencyTable 中查找其使用位置；对每个未参与推导的参数，按以下顺序判断：
  ① 若 parameterDependencyTable 中已标注"陷阱参数: [唯一弃用理由]"，且题干条件足以唯一排除其参与主计算 → 合法设计，不报错
  ② 若该参数使用与否都有生物学支持，或可替代估计某个中间变量并推出不同自洽答案 → 判为 critical validityIssue（"模糊参数/答案不唯一"）
  ③ 若未标注且代入后无法改变结论（纯冗余）→ 仅在 correctionHints 中建议删除，不判为 validityIssue，不触发修复
- 【强制执行：答案唯一性硬约束】检查三件事：
  ① 参数角色唯一：每个数值只能是计算输入、单位换算输入、或有唯一弃用理由的质控/陷阱参数；
  ② 观测通道唯一：若多个观测量可估计同一中间变量，题干必须唯一指定 operational definition，否则判为 critical 答案不唯一；
  ③ 总数/子集闭合：若给出总数及分类/直方图计数，分类合计必须等于总数；若不是全集，必须说明独立子样本分母，否则判为 critical 计数不闭合。
- 【强制执行：判定型问法主闭合量】若计算题最终目标是阈值判定、机制选择、方案比较、可行性判断、错误来源或异常解释，必须检查 draft.decisionClosure 是否存在且与 referenceSteps 一致：primaryDecisionVariable 必须是最小主闭合量，comparisonTarget 必须是明确观测/阈值/候选窗口，exclusionConstraint 必须能唯一排除错误机制；若只列多个中间量后直接给语义结论，判为 high depthIssue 或 critical validityIssue。
- 【领域知识核查（以下为常见示例，原则适用于题目所涉及的任何生命科学领域）】凡题目涉及化学计量比、速率、效率、浓度等，须与该领域标准值对照；以下为高频出错点举例：
  · 线粒体能量学：NADH链每0.5 mol O₂泵出10 mol H⁺（即H⁺/O₂=20，而非10）；ATP合酶标准H⁺/ATP≈4；P/O比（NADH≈2.5，FADH₂≈1.5）；任何能量转化效率须≤100%
  · 酶动力学：Km量纲与底物浓度相同；Vmax须≥题目中任意实测反应速率；kcat=Vmax/[E]总
  · 生态与信息流：林德曼效率5-30%；细胞周期时长0.5-72h；DNA复制错误率~10⁻⁹/bp
  · 其他领域同理：遇到任何化学计量/速率/效率定义，均应代入题目数值验证，不局限于以上三类
- 数值单位是否自洽可计算（不存在量纲不匹配）；【例外】若 parameterDependencyTable 中某参数标注为"单位换算: ..."，则该量纲差异是故意设计的考察点（单位换算本身即为解题步骤），不判为 validityIssue
- 已知数据是否充分（无遗漏关键参数）
- 计算路径是否能给出唯一确定答案
- 题目涉及的生物实体（酶/蛋白/通路）所假设的动力学模型是否适用：例如别构酶（PFK-1、ATCase 等）不适用简单 Michaelis-Menten 方程；协同结合蛋白不适用单位点结合模型；若套用了不适合的模型，属于 critical 问题`,

  'genetic-reasoning':
    `- 【强制执行：比例推算验证】若题目给出了后代表现型数量或比例数据，你必须从题目推断的遗传方式和亲本基因型出发，手动列出棋格法或比例计算，验证理论比例是否与题目给出的数据一致；偏差超过5%判为 critical validityIssue
- 后代表现型比例（若给出）是否符合孟德尔规律或常见变式（致死、连锁、互补等）
- 给定条件能否唯一确定遗传方式（不存在无法排除的竞争假设）
- 正反交结果（若涉及）解释是否唯一且自洽
- 所有推断结论是否均有条件支撑
- 【跨源数值一致性】：若题目同时提供了统计后代数据（各表型数量）和显式声明的遗传参数（如"已知A-B图距为X cM""交换率为Y%""双交换属于某类型"），请分别从统计数据推算遗传参数，并与题干显式声明的数值进行比对——两者差距超过 5% 则判为 critical 问题；若题干对交换类型的分类与数据推断的基因顺序矛盾，也判为 critical
- 【术语定义一致性】：检查题目中所有遗传学术语的定义是否与标准用法一致，尤其注意：干涉系数（interference）= 1 - 并发系数（coefficient of coincidence），两者不可混用；若题目在"即"或括号内给出了错误的等价定义，判为 high 问题`,

  'network-reasoning':
    `- 【强制执行：网络状态追踪】从给出的初始扰动出发，逐节点追踪激活/抑制状态传播（AND门须两个信号同时满足；双重否定须逐层取反；OR门任一信号满足即可），写出每个下游节点的最终状态，验证与题目声称的结论一致；任何节点状态推断与结论不一致判为 critical validityIssue
- 激活/抑制关系在全文中是否自洽（同一节点对同一目标不能同时激活和抑制，除非有条件限定）
- 从给定网络结构和扰动条件能否唯一推断下游输出；若存在两条竞争路径（如 A 同时激活 B 和抑制 C，而 B 与 C 均影响 D），必须给出优先级规则或定量关系，否则判为 high 问题
- 是否存在未定义的节点或缺失的关键边
- 若多个信号同时作用于同一靶点（如高浓度 X 抑制且低浓度 Y 激活同一酶），题目必须明确哪种效应占主导或给出定量规则；缺失时判为 high`,

  'threshold-reasoning':
    `- 【强制执行：刺激序列状态追踪】从题目明确声明的初始状态出发，按给出的刺激序列逐步计算系统状态（每次刺激后比较强度与θ_on/θ_off，含迟滞时区分方向），写出每步后的系统状态，验证最终状态与题目答案一致；任一步推断有误或最终状态不一致判为 critical validityIssue
- 阈值是否明确给出或可由题目条件推算
- 若有迟滞，激活阈值与去激活阈值是否方向自洽（θ_off < θ_on 对应正迟滞）
- 刺激历史对系统状态的影响是否描述正确
- 【迟滞系统初始状态完备性】：若题目涉及迟滞（双稳态）系统（θ_off ≠ θ_on），则系统在中间区间的行为依赖历史状态，题目必须显式声明系统的初始激活/去激活状态；若仅凭"处于某条件下培养"等模糊表述推断初始状态，判为 critical 问题
- 【"长期"规则的时间尺度】：若题目规定"长期处于某状态会触发不可逆转变"，必须给出具体时间定义；缺失时判为 high`,

  'structural-reasoning':
    `- 【强制执行：推导链逐步验证】逐步追踪从结构变化到功能变化的推导链（结构特征→构象影响→结合/催化能力→功能表型），对每一跳明确写出其生化依据；若任一跳缺乏依据或存在跳步，判为 high validityIssue；若因缺失关键步骤导致结论不可推出，判为 critical
- 结构约束是否足够具体（碱基互补/氨基酸特性/构象变化，至少一项明确）
- 结构→功能的推导链是否无缺失步骤
- 实验条件（pH/温度/离子强度）是否与结构变化方向一致`,
};

// ─────────────────────────────────────────────────────────────────────────────
// 约束闭合审查（全题型通用，与生成端 CONSTRAINT_CLOSURE_PRINCIPLES 对称）
// ─────────────────────────────────────────────────────────────────────────────

const CLOSURE_CHECKS = `【约束闭合审查（全题型通用，任一项不通过判为对应级别的 validityIssue）】：
- 【模糊参数 — critical】：检查题干中每个数值/参数：是否存在"使用与否都有生物学支持"的模糊参数（即用了和不用各自都能推出一个自洽结论）？若存在，判为 critical。（合法的干扰参数 ≠ 模糊参数：合法干扰有唯一正确的"弃用理由"，题目条件足以唯一确定它不适用）
- 【答案唯一性硬约束 — critical】：检查参数角色唯一、观测通道唯一、总数/子集闭合。若多个观测量可估计同一中间变量但题干未唯一指定 operational definition，或总数与分类/直方图计数不闭合且未说明独立子样本分母，或任一条件可支持另一条自洽计算路径并改变最终答案，判为 critical。
- 【答案唯一性 — critical】：尝试从题干条件出发构造与参考答案不同的推理路径；若能得到同样满足全部给出条件的不同结论，或参考答案含"更可能"/"取决于"/"若假设"等歧义表述，判为 critical
- 【判定闭合 — high/critical】：若最终问法是判断/选择/归因/异常解释，检查题目与参考答案是否存在唯一主判定变量，并且该变量必须与观测值、阈值或候选窗口比较后排除错误路径；若主判定变量缺失、多个候选判据并列不分主次或反证约束不足以排他，按影响判为 high depthIssue 或 critical validityIssue。
- 【机制聚焦度 — critical】：题目是否把 ≥2 个独立科研结论强行焊接成一道题（两个矛盾各自都足以单独出题）？若是，判为 critical
- 【推理深度上界 — high】：从题干到最终结论，核心决策点是否 >3 个？（核心决策点 = 需要学生判断走哪条路径的节点，不含代入计算步骤）若是，判为 high
- 【约定自足性 — high】：题目用到的热力学convention/符号方向/动力学模型选择，是否均在题干中显式声明？若存在"使用不同约定即得不同答案"的隐含约定，判为 high。
  ⚠️【豁免规则——可推断近似不属于"约定"，不触发本条】：若某假设（如C_L≈0、底物饱和、死区存在）可由题目给出的数值唯一推算得出（即做题者自己算一下就能确认），则它是②隐含约束而非⑤约定——此时"未写入题干"是正确做法，不得以本条为由要求将其外显；若已被写入题干，应在 depthIssues 中报"隐含条件外显"，而非在此报 validityIssue`;

// ─────────────────────────────────────────────────────────────────────────────
// 学科护栏审查块（由 disciplines.ts v2 字段动态生成，字段缺失时自动跳过）
// ─────────────────────────────────────────────────────────────────────────────

function buildDisciplineGuardrailBlock(discipline?: DisciplineEntry): string {
  if (!discipline) return '';
  const parts: string[] = [];

  if (discipline.forbiddenErrors?.length) {
    parts.push(
      '▸ 严禁出现的学术硬伤（任一违反判为 critical validityIssue）：\n' +
      discipline.forbiddenErrors.map(e => `  - ${e}`).join('\n'),
    );
  }
  if (discipline.parameterConstraints && Object.keys(discipline.parameterConstraints).length > 0) {
    parts.push(
      '▸ 底层物理/生理常数边界（数值超出范围判为 critical validityIssue）：\n' +
      Object.values(discipline.parameterConstraints).map(v => `  - ${v}`).join('\n'),
    );
  }
  if (discipline.antiPatternStrategies?.length) {
    parts.push(
      '▸ 高防御出题策略执行验收（至少体现其中 1 条；若题目完全未体现任何一条，判为 high difficultyIssue）：\n' +
      discipline.antiPatternStrategies.map((s, i) => `  ${i + 1}. ${s}`).join('\n'),
    );
  }

  if (parts.length === 0) return '';
  return '\n【审查维度 5 - 学科专项护栏】：\n' + parts.join('\n\n') + '\n';
}

// ─────────────────────────────────────────────────────────────────────────────
// 审查
// ─────────────────────────────────────────────────────────────────────────────

async function reviewDraft(
  draft: BiologyV2Draft,
  discipline?: DisciplineEntry,
  debugContext?: { traceId?: string; round?: number },
): Promise<BiologyReviewResult> {
  const safeDraft = buildSanitizedDraftForReview(draft);
  const problemType = safeDraft.problemType;
  const validityCheck = VALIDITY_CHECKS[problemType] ?? VALIDITY_CHECKS['calculation'];
  const disciplineGuardrailBlock = buildDisciplineGuardrailBlock(discipline);

  const conditionBlock =
    safeDraft.explicitConditions && Object.keys(safeDraft.explicitConditions).length > 0
      ? '【已知条件（题干已明示）】：\n' + Object.entries(safeDraft.explicitConditions).map(([k, v]) => `  - ${k}：${v}`).join('\n')
      : '';

  const implicitBlock =
    safeDraft.implicitConditions && Object.keys(safeDraft.implicitConditions).length > 0
      ? '【隐含条件（仅审查用，不应出现在题干）】：\n' + Object.entries(safeDraft.implicitConditions).map(([k, v]) => `  - ${k}：${v}`).join('\n')
      : '';

  const trapBlock = safeDraft.seductiveWrongPath
    ? `【陷阱路径（仅审查用）】：
  错误入口：${safeDraft.seductiveWrongPath.wrongApproach}
  偏差节点：${safeDraft.seductiveWrongPath.divergenceStep}
  诱惑性来源：${safeDraft.seductiveWrongPath.whySeductive}`
    : '【陷阱路径】：（生成时未提供）';

  const dataBlock =
    safeDraft.givenData && Object.keys(safeDraft.givenData).length > 0
      ? '【已知数据】：\n' + Object.entries(safeDraft.givenData).map(([k, v]) => `  - ${k}：${(v as any).value} ${(v as any).unit ?? ''}`).join('\n')
      : '';

  const dependencyBlock =
    safeDraft.parameterDependencyTable && Object.keys(safeDraft.parameterDependencyTable).length > 0
      ? '【参数依赖表（仅审查用）】：\n' + Object.entries(safeDraft.parameterDependencyTable).map(([k, v]) => `  - ${k}：${v}`).join('\n')
      : '';

  const prompt = `你是生物学竞赛题目审核专家，需要从三个维度独立审查以下题目。

【题型】：${problemType}
【题目正文】：
${safeDraft.questionText}
${conditionBlock}
${implicitBlock}
${trapBlock}
${dataBlock}
${dependencyBlock}
【求解目标】：${safeDraft.requiredAnswer}

【参考答案】：
${safeDraft.referenceAnswer}

【审查维度 1 - 题目合理性（${problemType} 专项）】：
${validityCheck}

${CLOSURE_CHECKS}

【审查维度 2 - 难度合理性】：
- 是否达到竞赛/研究生水平（而非高中知识点直接套用）
- 推理/计算步骤是否 ≥8 步（不是简单代入公式或直接查比例）
- 是否考察了深层概念理解，而非表面记忆
- 【场景真实性检查（仅 calculation 题型）】：题目背景是否绑定了真实物种/菌株/细胞系和实验技术？若背景是"某细胞""某生物""某酶"等泛化描述，判为 high difficultyIssue
- 【参数精度检查（仅 calculation 题型）】：统计题目中所有数值参数，若超过 60% 为整数（不含分子数/计数类参数），判为 high difficultyIssue（整数参数是教材模板题特征，真实实验数据几乎不会全为整数）

【审查维度 3 - 逻辑深度】：
- 是否有真正的判断分叉（解题中途需先判断某条件是否成立，走不同路径，而非题目直接告知走哪条路）
- 是否有至少一个隐含条件（需学生从生物学图像/守恒律/系统特性中自行推断，非全部显式给出）
- 是否是教材原型题/模板题（结构与教材例题高度相似则不通过）
- 【隐含条件外显检查】：对照上方"隐含条件（仅审查用）"列表，逐条检查每条隐含条件是否以直接陈述/括号标注/提示语/"隐含条件"字样等形式出现在题目正文中——若有任何一条在正文中被直接说出，仅写入 correctionHints 提示，不写入 depthIssues，不影响 passed；隐含条件只能以现象/数据/实验结果的形式暗藏于背景叙述，让做题者自行推断。
  ⚠️【外显检查专项——可推断近似的外显判定】：对于可由题目数值推算出的近似结论（如"氧限制时C_L≈0"、"底物饱和近似"、"混合死区存在"），若题目正文中出现以下任意一种表述，均仅写入 correctionHints 提示，不写入 depthIssues，不影响 passed：(a) 直接给出近似结论；(b) 给出判断步骤提示；(c) 给出验证后结论。正确写法：只提供使近似成立所需的原始数值参数，让做题者自行计算和判断
- 【改动2：判断逻辑显式化检测（补充原有外显检查的盲区）】：逐字扫描题目正文，查找以下四种外显形式——
  (a) 【判断句式】完整判断句：如"若B2X则Y"/"当X时应改用Y"/"超过X则判断为Y"
  (b) 【路径命名】两条分支路径被同时命名："聚集态用牛顿模型，解聚态用幂律"
  (c) 【操作方法外显】直接说明某中间步骤应该怎么做，而该操作本应由解题者从物理约束自行推导：如"按体积分数加权求体积平均OTR"、"对总干细胞量M建立方程"、"局部氧传递推动力取C*"
  (d) 【数据用途说明】解释某实验数据用于做什么判断：如"在线HPLC数据用于判定CRP-cAMP回路状态"、"同一记录键下各模块数据已对齐"
  出现任意一种，仅写入 correctionHints 提示，不写入 depthIssues，不影响 passed（注明具体类型）；正确写法：只给原始参数和数据，不说明如何使用、不说明判断结论、不说明操作方向
  ⚠️与假设审计不冲突：auditor 查"题目物理成立所需的前提是否缺失"，本条查"判断逻辑/操作方法有没有被写进题面"，方向相反
- 【改动5：隐含前提注入验证】：检查 implicitConditions 中每一条——若该前提的触发阈值在题面同时出现"原始数值"和"使用说明"（即"X=某值，超过则…"形式），仅写入 correctionHints 提示，不写入 depthIssues，不影响 passed；正确写法：给出原始标定数值，不附加说明其用途或判断结论的文字
- 【多步数值依赖链检查（仅 calculation 题型）】：逐步检查 referenceSteps，判断计算步骤是否构成串行依赖（步骤N的数值结果被步骤N+1直接引用作为输入）。强化检查：对每一步骤，判断"跳过前步、直接代入原始题目数据能否完成该步骤"——若能跳过则说明该步骤与前步无真实数值依赖，不构成串行链。注意：此项为条件性检查——若知识点本身天然存在级联路径（如能量代谢、生态能流、遗传图距、酶级联），且各步骤明显独立可解，判为 high depthIssue；若知识点本身只有2-3步计算，不因"缺乏串行依赖"报错。

输出必须是严格 JSON，字段名称不得修改，直接以 { 开头、以 } 结尾，不含 markdown 代码块或任何说明文字：
{
  "passed": true 或 false,
  "validityIssues": ["问题1（critical）", "问题2（high）"],
  "difficultyIssues": ["问题1"],
  "depthIssues": ["问题1"],
  "overallVerdict": "一句话总结审查结论（如 pass / fail_needs_revision / needs_revision）",
  "correctionHints": ["修复建议1（含正确值/方向依据）", "修复建议2"]
}`;

  const systemPrompt = '你是生物学竞赛题目审核专家。完成所有内部推理后，你的最终回答必须是且仅是一个严格 JSON 对象，直接以 { 开头、以 } 结尾，不含 markdown 代码块或任何说明文字。';
  const raw = (await callLLM(prompt, {
    model: 'review',
    temperature: 0.2,
    systemPrompt,
    responseFormat: 'json',
  })).trim();
  const tracePrefix = debugContext?.traceId ? `[traceId=${debugContext.traceId}] ` : '';
  const roundInfo = typeof debugContext?.round === 'number' ? `round=${debugContext.round} ` : '';
  console.warn(`[BioV2 Review] ${tracePrefix}${roundInfo}原始回應:`, raw.slice(0, 200));

  const parseReviewJson = (text: string): BiologyReviewResult => {
    const parsed = cleanAndParseJSON(text) as any;
    const validityIssues   = Array.isArray(parsed.validityIssues)   ? parsed.validityIssues   : [];
    const difficultyIssues = Array.isArray(parsed.difficultyIssues) ? parsed.difficultyIssues : [];
    const depthIssues      = Array.isArray(parsed.depthIssues)      ? parsed.depthIssues      : [];
    const correctionHints  = Array.isArray(parsed.correctionHints)  ? parsed.correctionHints  : [];
    const overallVerdict: string =
      parsed.overallVerdict || parsed.overallDecision || parsed.verdict ||
      (validityIssues.length === 0 && difficultyIssues.length === 0 && depthIssues.length === 0
        ? 'pass'
        : 'fail_needs_revision');
    const passed: boolean =
      typeof parsed.passed === 'boolean'
        ? parsed.passed
        : (validityIssues.length === 0 && difficultyIssues.length === 0 && depthIssues.length === 0);
    return { passed, validityIssues, difficultyIssues, depthIssues, overallVerdict, correctionHints };
    };

  try {
    return parseReviewJson(raw);
  } catch (err) {
    try {
      const repairedRaw = (await callLLM(
        `你是 JSON 修复器。请将下面内容修复为严格合法 JSON：\n` +
        `要求：\n` +
        `1) 只修复 JSON 语法与包裹格式（代码块、前后缀说明、缺逗号/括号、引号转义）\n` +
        `2) 不增删业务字段，不改动字段语义\n` +
        `3) 只输出 JSON 本体，不要任何解释\n\n` +
        `待修复内容：\n${raw}`,
        {
          model: 'default',
          temperature: 0,
          responseFormat: 'json',
          systemPrompt: '你是严格 JSON 语法修复器，只输出合法 JSON。',
        },
      )).trim();

      const repairedCleaned = cleanJsonString(repairedRaw);
      console.warn(`[BioV2 Review] ${tracePrefix}${roundInfo}JSON 修复器生效`);
      return parseReviewJson(repairedCleaned);
    } catch (repairErr) {
      console.warn(`[BioV2 Review] ${tracePrefix}${roundInfo}JSON 解析失败，原始末尾200字符:`, raw.slice(-200));
      console.warn(`[BioV2 Review] ${tracePrefix}${roundInfo}JSON 修复器失败:`, repairErr);
      console.warn(`[BioV2 Review] ${tracePrefix}${roundInfo}原始解析错误:`, err);
      return {
        passed: false,
        validityIssues: ['Failed to parse review response'],
        difficultyIssues: [],
        depthIssues: [],
        overallVerdict: '审查响应解析失败',
        correctionHints: [],
      };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 修复侧学科护栏提示块（告知 repair LLM 必须满足的高防御策略）
// ─────────────────────────────────────────────────────────────────────────────

function buildRepairDisciplineBlock(discipline?: DisciplineEntry): string {
  if (!discipline?.antiPatternStrategies?.length) return '';
  return (
    '\n【学科专项护栏——修复必须满足（审查将严格验收）】：\n' +
    '题目修复完成后，必须体现下列高防御策略中的至少 1 条，否则审查仍会报 difficultyIssue：\n' +
    discipline.antiPatternStrategies.map((s, i) => `  ${i + 1}. ${s}`).join('\n') +
    '\n'
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 外显修复专项规则（三个修复函数共用）
// 对应 reviewer 改动2检测到的 B1/B2/B3/B4 四种外显类型
// ─────────────────────────────────────────────────────────────────────────────

const CASCADE_REPAIR_REQUIREMENTS = `【级联陷阱修复专项规则（difficultyIssues 含 CascadeReview 时必须执行）】
- 必须补齐 cascadeTrap 全部字段，禁止输出空字符串或只写“同上”。
- trap1：层1陷阱，必须对应一个具体错误入口。
- trap2：层2陷阱，必须是层1正确后才出现的第二约束。
- linkage：说明层1正确结论如何解锁层2，不得只写“相关”。
- trap1WrongOutcome：写明走错层1会得到哪个错误候选/机制/数值区间。
- trap1CorrectUnlock：写明层1正确后才暴露的层2变量、边界或状态空间。
- trap2Discriminator：写明层2用于改变候选集合或排除错误机制的判别量。
- finalOutcomeShift：写明层2处理前后的候选/机制/结论如何改变。
- 若当前题目无法形成上述链条，必须重写题目骨架；禁止把所有约束并列成候选表筛选。`;

const CASCADE_TRAP_OUTPUT_SCHEMA = `,
  "cascadeTrap": {
    "trap1": "（层1陷阱描述，非空）",
    "trap2": "（层2陷阱描述，非空）",
    "linkage": "（层1正确结论如何解锁层2，非空）",
    "trap1WrongOutcome": "（层1错解导向的错误候选/机制/数值区间，非空）",
    "trap1CorrectUnlock": "（层1正解后才暴露的层2变量/边界/状态空间，非空）",
    "trap2Discriminator": "（层2判别量，非空）",
    "finalOutcomeShift": "（层2如何改变最终候选/机制/结论，非空）"
  }`;

const FORMULA_CHAIN_DEGENERATION_REPAIR_RULES = `【公式链退化修复专项规则（depthIssues 含 DeterministicLint / 公式链退化 / 计算链过短 / 分叉过载时必须执行）】
- 禁止只补 referenceSteps、只增加小数、只增加单位换算、只补 cascadeTrap 文案；这些不会修复公式链退化。
- 先改骨架，后改数值：第一目标是形成“1 个主分叉变量 → 分叉后变量定义/模型切换 → 1 个层2判别量 → 最终闭合量改变”的主链；数值精修、真实对象、单位换算只能在骨架成立后处理。
- 分叉预算：最多 3 个核心决策点（1 个主分叉 + 1 个层2判别 + 最多 1 个辅助闭合）。若已有判断点超过 3 个，必须删除、合并或改成题干给定条件；禁止继续堆叠并列质控判断。
- 每个保留的分叉都必须改变后续计算对象、变量定义、读出口径、候选集合或表达式形式；只影响解释措辞、精度校正或质控说明的判断不算分叉。
- 至少引入一个跨通道冲突或隐含框架选择：读数通道≠真实状态池、表观参数≠真实参数、局部边界≠整体平均、快慢变量时标冲突、候选机制一阶读数相同但二阶判别量不同，任选其一并让它改变后续计算对象。
- referenceSteps 至少 8 步；其中至少 2 步必须是“排除错误口径/错误模型/错误状态归属”的判断步骤，不能全是代入、换算、求和、积分、取 min/max。
- seductiveWrongPath 必须从一个真实可算的错误口径出发，并在 divergenceStep 被题干数据或隐含框架唯一反驳。
- cascadeTrap 不能只存在于字段文案中：trap1CorrectUnlock、trap2Discriminator、finalOutcomeShift 必须进入 referenceSteps/referenceAnswer，并实际改变最终唯一数值、唯一范围、唯一表达式/公式、唯一候选或主闭合量。
- 禁止继续做无分叉终点标量直算；计算题仍优先保持唯一数值、唯一范围、唯一中间闭合量，或可由题设约束唯一确定的表达式/公式。
- 若当前知识点天然容易落成直算，允许保持主知识点但改写 chosenDimension 表述，并引入强相关副知识点、读出口径切换、边界条件切换或多通道约束来形成闭合主链；只有仍无法形成有效闭合量时，才改成唯一候选/机制/读出口径判定。若采用机制选择、方案选择或异常归因问法，必须在 questionText 中给出足以排除其他合理答案的可见证据。`;

const EXPLICIT_LOGIC_REPAIR_RULES = `【外显修复专项规则（depthIssues 含"判断逻辑显式化"或"隐含条件外显"时必须执行）】：
对题目正文中发现的每一处外显，按以下对应操作处理：

B1【判断句式外显】：找到"若X则Y"/"当X时应改用Y"/"超过X则判断为Y"等完整判断句
  → 操作：删除整个判断句，只保留使该判断可以被推算出来的原始参数
  → 示例：删除"若τw超过Kγc^n则用幂律公式"→ 只保留K、n、γc的数值，不说明用途

B2【路径命名外显】：找到两条分支路径被同时命名的句子
  → 操作：删除路径命名，只保留各路径对应的参数；让做题者自己判断走哪条路
  → 示例：删除"聚集态用牛顿模型η₀，解聚态用幂律K/n"→ 只给η₀、K、n数值，不标注各属于哪个状态

B3【操作方法外显】：找到直接说明"应该怎么做"的句子（如"按体积分数加权""对总量M建立方程""推动力取C*"）
  → 操作：删除操作说明，保留使该操作成立的原始约束数据
  → 删除"按体积分数加权求体积平均OTR"→ 只保留各区室体积分数φ和各自kLa值
  → 删除"对总干细胞量M建立方程"→ 只保留补料速率F、起始量M₀等边界数据
  → 删除"局部氧传递推动力取C*"→ 只保留kLa和C*数值
  ⚠️删除操作说明后必须确认：原始约束数据是否足够让做题者推导出该操作——若不足则补充缺失的原始参数，不补充操作说明本身

B4【数据用途说明外显】：找到解释某数据"用于做什么"的句子
  → 操作：删除用途说明，只呈现数据本身（数值+单位+测量时间点）
  → 删除"在线HPLC数据用于判定CRP-cAMP回路状态"→ 只给HPLC浓度读数和时间点
  → 删除"同一记录键下各模块数据已对齐"→ 只给各模块的原始时间戳和数值

【外显修复后必须验证】：
- 删除外显内容后，题目是否仍然可解（原始参数足够推导出答案）？
- 若发现删除后题目缺少某个推导所需的原始参数 → 补充该原始参数，不补充操作说明
- 若发现删除后题目变得无法求解 → 说明该外显内容实际是必要的约定声明，应保留并报告为约定自足问题，而非外显问题`;

// ─────────────────────────────────────────────────────────────────────────────
// 深度修复（仅 depthIssues，无 validityIssues 时）
// ─────────────────────────────────────────────────────────────────────────────

async function deepRepairDraft(
  draft: BiologyV2Draft,
  review: BiologyReviewResult,
  cycleNumber: number,
  discipline?: DisciplineEntry,
): Promise<BiologyV2Draft> {
  const depthList  = review.depthIssues.map((v, i) => `${i + 1}. ${v}`).join('\n');
  const otherIssues = [...review.validityIssues, ...review.difficultyIssues];
  const otherList  = otherIssues.length > 0
    ? '\n【同时修复的难度问题】：\n' + otherIssues.map((v, i) => `${i + 1}. ${v}`).join('\n')
    : '';
  const hintsBlock = review.correctionHints.length > 0
    ? '\n【审查建议的修复方向（优先参考，含正确值/方向依据）】：\n' + review.correctionHints.map((h, i) => `${i + 1}. ${h}`).join('\n')
    : '';

  const isReasoning = draft.problemType !== 'calculation';
  const repairDisciplineBlock = buildRepairDisciplineBlock(discipline);

  const isFormulaChainRepair = hasFormulaChainDegenerationIssue(review.depthIssues);

  const prompt = `你是生物学竞赛题目深度重写专家。本题存在逻辑深度不足的问题，需要较大幅度改写。（第 ${cycleNumber} 次修复 — 深度模式）

【当前题目】：
${draft.questionText}

【当前参考答案】：
${draft.referenceAnswer}

【逻辑深度问题（本次修复核心）】：
${depthList}
${otherList}${hintsBlock}
${repairDisciplineBlock}
${CASCADE_REPAIR_REQUIREMENTS}
${FORMULA_CHAIN_DEGENERATION_REPAIR_RULES}
${EXPLICIT_LOGIC_REPAIR_RULES}
【深度修复规则（全部执行）】：
1. ${isFormulaChainRepair ? `公式链退化修复允许保持主知识点但改写考察维度表述：原维度为“${draft.chosenDimension}”，新维度必须体现强相关副知识点、读出口径切换、边界条件切换或多通道约束；不得只换背景名。` : `核心考察维度保持不变（${draft.chosenDimension}），情境/数字/背景可完全替换`}
2. 必须引入真正的判断分叉：解题者在推导中途需先验证某条件，才能选择后续路径
3. 必须有至少一个隐含条件：删除一个显式约束，改为让学生从守恒律/系统性质自行推断
4. 若是教材模板题：更换实验系统（如从植物改为微生物，或从单细胞改为多细胞），引入跨概念融合
5. 修复后推理/计算步骤必须 ≥8 步，且每步有明确推理依据
6. 题型保持不变（${draft.problemType}）
7. 重新设计 seductiveWrongPath：确保错误路径从标准方法出发，在 divergenceStep 处被隐含条件反驳，且标准方法确实导向错误结论
8. 【calculation 题型专项，仅当被判为"缺少多步数值依赖链"时执行】若知识点本身天然支持级联计算（如能量代谢、生态能流、遗传图距），则重构计算路径，使前一步的数值结果成为后一步的必要输入，形成≥3层串行依赖；若知识点本身只有2-3步，不强行凑依赖链，改用更深的近似判据节点或AI专项陷阱补充难度。

【约束闭合修复规则（若存在闭合性违规，按对应操作修复）】：
- 若存在模糊参数（使用与否都有生物学支持）：优先删除该参数；若必须保留，增加题干约束使其适用性有唯一判断，或改为有唯一弃用理由的结构性陷阱
- 若存在观测通道竞争：题干必须唯一指定 operational definition；删除多余观测量，或将其改为质控/陷阱参数并给出唯一不参与计算理由
- 若存在总数/子集不闭合：修改分类/直方图计数使其合计等于总数，或明确这些数据来自独立子样本并给出该子样本分母
- 若答案含歧义表述（"更可能"/"取决于"）：增加定量约束或边界条件，使解空间收敛到唯一解
- 若存在两个独立核心矛盾：保留与考察维度最相关的那一个，移除另一个
- 若推理深度 >3 个核心决策点：合并中间步骤，或将部分结论性步骤作为显式给出条件
- 若存在隐含约定：在题干中补充声明所采用的 convention/模型/假设

【修复后必须执行的自检（不可跳过）】：
若题型为 calculation：（1）列出修复后题目中所有数值参数，在输出 JSON 的 parameterDependencyTable 字段中逐一写明"用于步骤N: XXX"、"单位换算: XXX"或"陷阱/质控参数: 唯一弃用理由"；（2）对题目中所有显式公式代入数值验证两边一致，尤其确认任何"效率/比率"计算结果≤100%且无负值；（3）验证答案唯一性硬约束：参数角色唯一、观测通道唯一、总数/子集闭合；有矛盾先修正数值再输出，禁止遗漏 parameterDependencyTable 字段。
若题型为 threshold-reasoning：确认题目正文已显式声明系统初始状态（激活或静息）。
自检通过后再输出 JSON，禁止带矛盾或缺失内容输出。

输出必须是严格 JSON，不含 markdown 代码块：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${isFormulaChainRepair ? `${draft.chosenDimension} × 多通道边界闭合` : draft.chosenDimension}",
  "problemType": "${draft.problemType}",
  "questionText": "深度修复后的完整题目正文（单问，无子问编号，隐含条件不得直接写出）",
  "explicitConditions": ${isReasoning ? '{"条件名": "描述"}' : '{}'},
  "implicitConditions": ${isReasoning ? '{"条件名": "需学生自行推断的条件，不出现在questionText中"}' : '{}'},
  "logicConditions": {},
  "givenData": ${!isReasoning ? '{"参数名": {"value": 数值, "unit": "单位"}}' : '{}'},
  "parameterDependencyTable": ${!isReasoning ? '{"参数名(值 单位)": "用于步骤N: 具体运算描述 | 陷阱参数: 唯一弃用理由"}' : '{}'},
  "requiredAnswer": "${draft.requiredAnswer}",
  "referenceAnswer": "重写后的完整分步参考解答",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"],
  "seductiveWrongPath": {
    "wrongApproach": "（重写后：标准方法走进的错误路径起点）",
    "divergenceStep": "（在哪一步被哪个约束反驳）",
    "whySeductive": "（为什么推理模型容易走错）"
  }${CASCADE_TRAP_OUTPUT_SCHEMA}
}`;

  const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.5 })).trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return draft;
  try {
    const repaired = cleanAndParseJSON(jsonMatch[0]) as BiologyV2Draft;
    repaired.problemId = draft.problemId;
    repaired.knowledgePoint = draft.knowledgePoint;
    if (!isFormulaChainRepair || !repaired.chosenDimension?.trim()) {
      repaired.chosenDimension = draft.chosenDimension;
    }
    repaired.problemType = draft.problemType;
    repaired.explicitConditions = repaired.explicitConditions ?? {};
    repaired.implicitConditions = repaired.implicitConditions ?? {};
    (repaired as any).logicConditions = repaired.explicitConditions; // @deprecated bridge
    if (draft.problemType === 'calculation') {
      repaired.parameterDependencyTable = repaired.parameterDependencyTable ?? {};
    }
    return repaired;
  } catch {
    return draft;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 细节修复（仅 validity/difficulty 问题时）
// ─────────────────────────────────────────────────────────────────────────────

async function detailRepairDraft(
  draft: BiologyV2Draft,
  review: BiologyReviewResult,
  cycleNumber: number,
  discipline?: DisciplineEntry,
): Promise<BiologyV2Draft> {
  const allIssues = [...review.validityIssues, ...review.difficultyIssues];
  const issueList = allIssues.map((v, i) => `${i + 1}. ${v}`).join('\n');
  const hintsBlock = review.correctionHints.length > 0
    ? '\n【审查建议的修复方向（优先参考，含正确值/方向依据）】：\n' + review.correctionHints.map((h, i) => `${i + 1}. ${h}`).join('\n')
    : '';

  const isReasoning = draft.problemType !== 'calculation';
  const repairDisciplineBlock = buildRepairDisciplineBlock(discipline);

  const prompt = `你是生物学竞赛题目细节修复专家。本题仅需修复合理性或难度问题，不改变情境和结构。（第 ${cycleNumber} 次修复 — 细节模式）

【当前题目】：
${draft.questionText}

【当前参考答案】：
${draft.referenceAnswer}
${hintsBlock}
${repairDisciplineBlock}
${CASCADE_REPAIR_REQUIREMENTS}
${EXPLICIT_LOGIC_REPAIR_RULES}
【需要修复的问题】：
${issueList}

【细节修复规则】：
1. 只修复上述列出的问题，保持题目情境、背景、结构和题型不变
2. 若数值超范围，修正为生物学合理数值并同步更新答案
3. 若条件不充分，最小化补充缺失条件
4. 若比例不合理，修正为符合遗传规律的合法比例并更新推导
5. 保持逻辑深度不降低（不得删除已有的判断分叉或隐含条件）
6. 修复后给出与修正后题目完全对应的参考答案
7. 修复或补充 seductiveWrongPath：若原有陷阱路径无效，重新设计有效的陷阱路径

【约束闭合修复规则（若存在闭合性违规，按对应操作修复）】：
- 若存在模糊参数（使用与否都有生物学支持）：优先删除该参数；若必须保留，增加题干约束使其适用性有唯一判断，或改为有唯一弃用理由的结构性陷阱
- 若存在观测通道竞争：题干必须唯一指定 operational definition；删除多余观测量，或将其改为质控/陷阱参数并给出唯一不参与计算理由
- 若存在总数/子集不闭合：修改分类/直方图计数使其合计等于总数，或明确这些数据来自独立子样本并给出该子样本分母
- 若答案含歧义表述（"更可能"/"取决于"）：增加定量约束或边界条件，使解空间收敛到唯一解
- 若存在两个独立核心矛盾：保留与考察维度最相关的那一个，移除另一个
- 若推理深度 >3 个核心决策点：合并中间步骤，或将部分结论性步骤作为显式给出条件
- 若存在隐含约定：在题干中补充声明所采用的 convention/模型/假设

【修复后必须执行的自检（不可跳过）】：
若题型为 calculation：列出所有数值约束方程，验证等式两边数值一致（如 Vmax 必须 ≥ 任何实测速率值，P/O比需与泵出质子数及ATP合酶化学计量一致）；验证答案唯一性硬约束：参数角色唯一、观测通道唯一、总数/子集闭合；有矛盾则先修正数值。
若题型为 threshold-reasoning：确认题目正文已显式声明系统初始状态（激活或静息）。
自检通过后再输出 JSON，禁止带矛盾或缺失内容输出。

输出必须是严格 JSON，不含 markdown 代码块：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${draft.chosenDimension}",
  "problemType": "${draft.problemType}",
  "questionText": "细节修复后的完整题目正文（单问，无子问编号，隐含条件不得直接写出）",
  "explicitConditions": ${isReasoning ? '{"条件名": "描述"}' : '{}'},
  "implicitConditions": ${isReasoning ? '{"条件名": "需学生自行推断的条件，不出现在questionText中"}' : '{}'},
  "logicConditions": {},
  "givenData": ${!isReasoning ? '{"参数名": {"value": 数值, "unit": "单位"}}' : '{}'},
  "parameterDependencyTable": ${!isReasoning ? '{"参数名(值 单位)": "用于步骤N: 具体运算描述 | 陷阱参数: 唯一弃用理由"}' : '{}'},
  "requiredAnswer": "${draft.requiredAnswer}",
  "referenceAnswer": "修复后的完整分步参考解答",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"],
  "seductiveWrongPath": {
    "wrongApproach": "（修复后：标准方法走进的错误路径起点）",
    "divergenceStep": "（在哪一步被哪个约束反驳）",
    "whySeductive": "（为什么推理模型容易走错）"
  }${CASCADE_TRAP_OUTPUT_SCHEMA}
}`;

  const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.2 })).trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return draft;
  try {
    const repaired = cleanAndParseJSON(jsonMatch[0]) as BiologyV2Draft;
    repaired.problemId = draft.problemId;
    repaired.knowledgePoint = draft.knowledgePoint;
    repaired.chosenDimension = draft.chosenDimension;
    repaired.problemType = draft.problemType;
    repaired.explicitConditions = repaired.explicitConditions ?? {};
    repaired.implicitConditions = repaired.implicitConditions ?? {};
    (repaired as any).logicConditions = repaired.explicitConditions; // @deprecated bridge
    if (draft.problemType === 'calculation') {
      repaired.parameterDependencyTable = repaired.parameterDependencyTable ?? {};
    }
    return repaired;
  } catch {
    return draft;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 综合修复（validity/difficulty + depthIssues 同时存在时）
// 先修复硬约束（合理性/难度），再在其基础上提升逻辑深度
// ─────────────────────────────────────────────────────────────────────────────

async function combinedRepairDraft(
  draft: BiologyV2Draft,
  review: BiologyReviewResult,
  cycleNumber: number,
  discipline?: DisciplineEntry,
): Promise<BiologyV2Draft> {
  const validityList   = review.validityIssues.map((v, i) => `${i + 1}. ${v}`).join('\n');
  const difficultyList = review.difficultyIssues.map((v, i) => `${i + 1}. ${v}`).join('\n');
  const depthList      = review.depthIssues.map((v, i) => `${i + 1}. ${v}`).join('\n');

  const validityBlock = review.validityIssues.length > 0
    ? `\n【阶段一：必须首先修复的合理性硬约束（每一条都是 critical）】：\n${validityList}`
    : '';
  const difficultyBlock = review.difficultyIssues.length > 0
    ? `\n【阶段一（续）：难度问题】：\n${difficultyList}`
    : '';
  const depthBlock = `\n【阶段二：在阶段一通过后再执行的逻辑深度提升】：\n${depthList}`;
  const hintsBlock = review.correctionHints.length > 0
    ? `\n【审查建议的修复方向（优先参考，含正确值/方向依据）】：\n` + review.correctionHints.map((h, i) => `${i + 1}. ${h}`).join('\n')
    : '';

  const isReasoning = draft.problemType !== 'calculation';
  const isFormulaChainRepair = hasFormulaChainDegenerationIssue(review.depthIssues);
  const repairDisciplineBlock = buildRepairDisciplineBlock(discipline);

  const prompt = `你是生物学竞赛题目综合修复专家。本题同时存在合理性/难度硬错误和逻辑深度不足，必须**按两阶段顺序**修复。（第 ${cycleNumber} 次修复 — 综合模式）

【当前题目】：
${draft.questionText}

【当前参考答案】：
${draft.referenceAnswer}
${validityBlock}${difficultyBlock}${depthBlock}${hintsBlock}
${repairDisciplineBlock}
${CASCADE_REPAIR_REQUIREMENTS}
${FORMULA_CHAIN_DEGENERATION_REPAIR_RULES}
${EXPLICIT_LOGIC_REPAIR_RULES}
【修复执行顺序（严格按以下步骤，不可跳过任何步骤）】：
步骤1 — 修复阶段一硬约束：
  - 若存在量纲/单位不自洽：修正为自洽数值，同步更新参考答案
  - 若存在生物学事实错误（如酶缩写错误、不适用的动力学模型）：替换为正确实体/模型
  - 若存在数值矛盾（如抑制剂效应与守恒律冲突）：选定一个一致的数值体系，消除矛盾
  - 若条件不充分：最小化补充缺失参数
步骤2 — 修复约束闭合性违规（与步骤1并列优先）：
  - 若存在模糊参数（使用与否都有生物学支持）：优先删除该参数；若必须保留，增加题干约束使适用性有唯一判断，或替换为有唯一弃用理由的结构性陷阱
  - 若存在观测通道竞争：题干唯一指定 operational definition；删除多余观测量，或将其改为质控/陷阱参数并给出唯一不参与计算理由
  - 若存在总数/子集不闭合：修改分类/直方图计数使其合计等于总数，或明确独立子样本分母
  - 若答案含歧义表述（"更可能"/"取决于"）：增加定量约束，使解空间收敛到唯一解
  - 若存在两个独立核心矛盾：保留与考察维度最相关的那一个，移除另一个
  - 若推理深度 >3 个核心决策点：合并步骤或将部分结论性步骤作为给出条件
  - 若存在隐含约定：在题干中补充声明所用 convention/模型/假设
步骤3 — 验证步骤1、2通过后再进行阶段二：
  - ${isFormulaChainRepair ? '先重写主链骨架：允许保持主知识点但改写考察维度表述，引入强相关副知识点/读出口径切换/边界条件切换/多通道约束；把判断点压缩为 1 个主分叉 + 1 个层2判别 + 最多 1 个辅助闭合' : '引入真正的判断分叉（解题者需在推导中途先验证某条件再选路径）'}
  - 保留或新增至少一个隐含条件（让学生从守恒律/系统性质自行推断，不得写入题干）
  - 修复后推理/计算步骤 ≥8 步
  - 【calculation 题型专项】若知识点天然支持级联路径，确保计算步骤形成≥3层串行数值依赖链；若知识点本身只有2-3步，不强行凑依赖链，改用近似判据节点加深难度
步骤4 — 最终自检：
  - 若题型为 calculation：列出所有数值约束方程，逐一验证等式两边一致；验证答案唯一性硬约束：参数角色唯一、观测通道唯一、总数/子集闭合；有矛盾先修正再输出
  - 若题型为 threshold-reasoning：确认题目正文已显式声明系统初始状态（激活或静息）
  - 禁止输出含任何矛盾或缺失内容的 JSON

【其他约束】：
- ${isFormulaChainRepair ? `公式链退化修复允许保持主知识点但改写考察维度表述：原维度为“${draft.chosenDimension}”，新维度必须体现强相关副知识点、读出口径切换、边界条件切换或多通道约束；不得只换背景名。` : `核心考察维度不变（${draft.chosenDimension}）`}
- 题型不变（${draft.problemType}）
- 题目为单问，禁止包含子问编号

输出必须是严格 JSON，不含 markdown 代码块：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${isFormulaChainRepair ? `${draft.chosenDimension} × 多通道边界闭合` : draft.chosenDimension}",
  "problemType": "${draft.problemType}",
  "questionText": "综合修复后的完整题目正文（单问，无子问编号，隐含条件不得直接写出）",
  "explicitConditions": ${isReasoning ? '{"条件名": "描述"}' : '{}'},
  "implicitConditions": ${isReasoning ? '{"条件名": "需学生自行推断的条件，不出现在questionText中"}' : '{}'},
  "logicConditions": {},
  "givenData": ${!isReasoning ? '{"参数名": {"value": 数值, "unit": "单位"}}' : '{}'},
  "parameterDependencyTable": ${!isReasoning ? '{"参数名(值 单位)": "用于步骤N: 具体运算描述 | 陷阱参数: 唯一弃用理由"}' : '{}'},
  "requiredAnswer": "${draft.requiredAnswer}",
  "referenceAnswer": "修复后的完整分步参考解答（与修复后题目完全对应）",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"],
  "seductiveWrongPath": {
    "wrongApproach": "（修复后：标准方法走进的错误路径起点）",
    "divergenceStep": "（在哪一步被哪个约束反驳）",
    "whySeductive": "（为什么推理模型容易走错）"
  }${CASCADE_TRAP_OUTPUT_SCHEMA}
}`;

  const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.4 })).trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return draft;
  try {
    const repaired = cleanAndParseJSON(jsonMatch[0]) as BiologyV2Draft;
    repaired.problemId = draft.problemId;
    repaired.knowledgePoint = draft.knowledgePoint;
    if (!isFormulaChainRepair || !repaired.chosenDimension?.trim()) {
      repaired.chosenDimension = draft.chosenDimension;
    }
    repaired.problemType = draft.problemType;
    repaired.explicitConditions = repaired.explicitConditions ?? {};
    repaired.implicitConditions = repaired.implicitConditions ?? {};
    (repaired as any).logicConditions = repaired.explicitConditions; // @deprecated bridge
    if (draft.problemType === 'calculation') {
      repaired.parameterDependencyTable = repaired.parameterDependencyTable ?? {};
    }
    return repaired;
  } catch {
    return draft;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 策略路由
//
// 路由矩阵：
//   depthIssues=0 + validity/difficulty > 0 → detailRepair（精确修数值/事实）
//   depthIssues > 0 + validity/difficulty = 0 → deepRepair（重构推理链）
//   depthIssues > 0 + validity/difficulty > 0 → combinedRepair（先修硬约束再提深度）
// ─────────────────────────────────────────────────────────────────────────────

async function repairDraft(
  draft: BiologyV2Draft,
  review: BiologyReviewResult,
  cycleNumber: number,
  discipline?: DisciplineEntry,
): Promise<BiologyV2Draft> {
  const hasValidity = review.validityIssues.length > 0 || review.difficultyIssues.length > 0;
  const hasDepth    = review.depthIssues.length > 0;

  if (hasDepth && hasValidity) {
    return normalizeCascadeTrapShape(await combinedRepairDraft(draft, review, cycleNumber, discipline));
  }
  if (hasDepth) {
    return normalizeCascadeTrapShape(await deepRepairDraft(draft, review, cycleNumber, discipline));
  }
  return normalizeCascadeTrapShape(await detailRepairDraft(draft, review, cycleNumber, discipline));
}

// ─────────────────────────────────────────────────────────────────────────────
// 公共入口：审查 + 最多 2 轮修复
// ─────────────────────────────────────────────────────────────────────────────

export async function reviewAndRepairBiology(
  draft: BiologyV2Draft,
  preAuditIssues?: string[],
  discipline?: DisciplineEntry,
  debugContext?: { traceId?: string; problemIndex?: number },
  cascadeExpected: boolean = false,
): Promise<BiologyReviewedDraft> {
  let current = normalizeCascadeTrapShape(draft);
  let repairCycles = 0;

  const tracePrefix = debugContext?.traceId ? `[traceId=${debugContext.traceId}] ` : '';
  console.log(
    `[BioV2 Lint] ${tracePrefix}externalizationLint=${isExternalizationLintEnabled() ? 'on' : 'off'} (env.EXTERNALIZATION_LINT_STRICT)`
  );

  // Round 1
  logCascadeTrapDiagnostics(current, tracePrefix, 0);
  const review0Raw = await reviewDraft(current, discipline, { traceId: debugContext?.traceId, round: 0 });
  const review0WithLint = mergeDeterministicDegenerationLint(mergeExternalizationLint(review0Raw, current), current);
  const review0 = mergeCascadeTrapReview(review0WithLint, current, cascadeExpected);

  // 将假设审计发现的问题注入第一轮审查结果，触发修复
  if (preAuditIssues && preAuditIssues.length > 0) {
    review0.validityIssues = [...preAuditIssues, ...review0.validityIssues];
    if (review0.passed) review0.passed = false;
  }

  console.log(
    `[BioV2 ReviewFlow] ${tracePrefix}round=0 passed=${review0.passed} validity=${review0.validityIssues.length} difficulty=${review0.difficultyIssues.length} depth=${review0.depthIssues.length}`,
  );

  if (review0.passed) {
    return { draft: current, reviewResult: review0, repairCycles };
  }

  current = await repairDraft(current, review0, 1, discipline);
  repairCycles++;

  // Round 2：只有 deepRepair / combinedRepair（有 depthIssues）才走第2轮
  // detailRepair 只改数值/单位，不改情境，不会引入新问题，直接终审
  logCascadeTrapDiagnostics(current, tracePrefix, 1);
  const review1Raw = await reviewDraft(current, discipline, { traceId: debugContext?.traceId, round: 1 });
  const review1WithLint = mergeDeterministicDegenerationLint(mergeExternalizationLint(review1Raw, current), current);
  const review1 = mergeCascadeTrapReview(review1WithLint, current, cascadeExpected);
  console.log(
    `[BioV2 ReviewFlow] ${tracePrefix}round=1 passed=${review1.passed} validity=${review1.validityIssues.length} difficulty=${review1.difficultyIssues.length} depth=${review1.depthIssues.length}`,
  );
  if (review1.passed) {
    return { draft: current, reviewResult: review1, repairCycles };
  }

  // 无论第一轮是哪种 issue，只要 review1 仍失败就再修一轮
  current = await repairDraft(current, review1, 2, discipline);
  repairCycles++;

  // 终审，不再修复
  logCascadeTrapDiagnostics(current, tracePrefix, 2);
  const review2Raw = await reviewDraft(current, discipline, { traceId: debugContext?.traceId, round: 2 });
  const review2WithLint = mergeDeterministicDegenerationLint(mergeExternalizationLint(review2Raw, current), current);
  const review2 = mergeCascadeTrapReview(review2WithLint, current, cascadeExpected);
  console.log(
    `[BioV2 ReviewFlow] ${tracePrefix}round=2 passed=${review2.passed} validity=${review2.validityIssues.length} difficulty=${review2.difficultyIssues.length} depth=${review2.depthIssues.length}`,
  );
  return { draft: current, reviewResult: review2, repairCycles };
}
