import { callLLM, getCurrentProvider, getOneApiModel } from '../../../llmClient';
import type { BiologyV2Draft } from './generator';

/**
 * Biology V2 假设审计（Assumption Auditor）
 *
 * 仅针对 calculation 类型题目，在 A1→A2 之间插入，默认使用当前主模型。
 *
 * 核心区分：
 *   ✅ 应该声明的假设：让题目物理/生物学上成立的"设置性前提"
 *      （如"ADP可瞬时平衡通透"——缺了题目就内部矛盾）
 *   ❌ 不应触碰的：implicitConditions 中故意藏的推理目标
 *      （这些是题目难度，不是缺陷）
 *
 * 非 calculation 题型直接返回通过，不消耗调用。
 */

export interface AssumptionIssue {
  assumption: string;
  severity: 'critical' | 'high';
  reason: string;
  fix: string;
}

export interface AssumptionAuditResult {
  passed: boolean;
  issues: AssumptionIssue[];
}

function getAuditModel(): string {
  return getCurrentProvider() === 'oneapi' ? getOneApiModel() : 'deepseek-reasoner';
}

export async function auditCalculationAssumptions(
  draft: BiologyV2Draft,
): Promise<AssumptionAuditResult> {
  if (draft.problemType !== 'calculation') {
    return { passed: true, issues: [] };
  }

  const dataBlock =
    draft.givenData && Object.keys(draft.givenData).length > 0
      ? '\n【已知数据】：\n' +
        Object.entries(draft.givenData)
          .map(([k, v]) => `  - ${k}：${(v as any).value} ${(v as any).unit ?? ''}`)
          .join('\n')
      : '';

  // 故意藏的隐含条件——这些是题目难度，审计不应触碰
  const intentionallyHidden =
    draft.implicitConditions && Object.keys(draft.implicitConditions).length > 0
      ? '\n【以下是出题者故意隐藏的推理目标（不要将这些列为缺失假设）】：\n' +
        Object.entries(draft.implicitConditions)
          .map(([k, v]) => `  - ${k}：${v}`)
          .join('\n')
      : '';

  const prompt = `你是生物化学题目假设审计专家。你的任务是找出让题目"物理上不自洽或生物学上不合理"的缺失设置性前提，而不是挖出学生需要自己推断的难点。

【核心区分——必须理解后再作答】：
✅ 应该报告的缺失假设（"设置性前提"）：
   - 若缺少该假设，题目本身就存在物理矛盾或生物学不合理（如用介质浓度代入基质Km却未说明膜通透性）
   - 无论学生多聪明，在这个假设缺失的情况下，题目的设定就是错的

❌ 不应报告的内容（"推理目标"）：
   - 学生需要通过计算或推理才能得出的结论（这是题目的难度设计）
   - 出题者故意隐藏的条件（见下方列表）
   - 生化领域公认的默认值（如标准自由能值、pH与解离的关系等）

【题目正文】：
${draft.questionText}
${dataBlock}
【参考解答】：
${draft.referenceAnswer}
${intentionallyHidden}

【审计步骤】：

步骤1 — 识别解答中依赖的设置性前提
阅读参考解答，列出所有"令题目在物理/生物学上成立所需的前提"，重点关注：
  · 多隔室系统：浓度/速率是否被跨隔室使用，是否需要通透假设
  · 速率/常数的定义：所用速率是否与其生物学定义匹配（实测偶联速率 ≠ 最大潜在速率）
  · 计量边界：净值问法是否与题目给出的条件存在重叠扣除

步骤2 — 逐条判断：设置性前提 vs. 推理目标
对每个前提：
  A. 是否在上方"故意隐藏"列表中？→ 跳过
  B. 是否属于领域公认默认值？→ 跳过
  C. 否则：这是一个设置性前提——继续步骤3

步骤3 — 核查题干是否已声明
逐字检查题目正文，该前提是否以任何形式出现（直接陈述/括号/前提说明）？
  · 若已出现 → 无问题，跳过
  · 若未出现 → 报告

步骤4 — 严重程度判断
  · critical：缺失该假设导致题目生物学上不自洽（如隔室浓度混用、循环逻辑）
  · high：缺失该假设导致解题路径有歧义（不同理解得不同数值结果）

【输出规则】：
- 仅报告步骤3中未声明的设置性前提，最多3个最严重的
- 无问题则返回空数组 []
- 直接输出 JSON 数组，不含 markdown 代码块：

[
  {
    "assumption": "缺失的设置性前提（一句话，具体说明是什么前提）",
    "severity": "critical | high",
    "reason": "缺少它为何让题目不自洽（1-2句话，聚焦物理/生物学合理性）",
    "fix": "建议在题干中如何补充（1句话）"
  }
]
或 []`;

  const model = getAuditModel();
  const raw = (await callLLM(prompt, { model, temperature: 0.1 })).trim();
  console.warn(`[BioV2 Audit] 模型=${model}，原始回应:`, raw.slice(0, 200));

  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return { passed: true, issues: [] };

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) return { passed: true, issues: [] };

    const issues: AssumptionIssue[] = parsed
      .filter(
        (item: any) =>
          typeof item === 'object' &&
          (item.severity === 'critical' || item.severity === 'high') &&
          typeof item.assumption === 'string' &&
          item.assumption.length > 0 &&
          typeof item.reason === 'string' &&
          typeof item.fix === 'string',
      )
      .slice(0, 3) as AssumptionIssue[];

    return { passed: issues.length === 0, issues };
  } catch {
    return { passed: true, issues: [] };
  }
}
