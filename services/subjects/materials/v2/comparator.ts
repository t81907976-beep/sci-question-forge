import { callLLMTracked } from "../costTracker";
import { getDisciplineGuidance } from "../disciplines";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { MaterialsV2QuestionDraft } from "./generator";
import type { MaterialsBlindSolverResult } from "./blind-solver";

/**
 * Materials V2 — A5 对比裁判
 *
 * 将出题器标准答案（draft.referenceAnswer）与盲解答案（blindResult.blindAnswer）对比，
 * 给出最终权威答案和发布标签。
 */

export interface MaterialsComparisonResult {
    answersAgree: boolean;
    discrepancies: string[];
    finalAuthorizedAnswer: string;
    finalSolutionText: string;
    confidence: "high" | "medium" | "low";
    notes: string;
    reasoningValid: boolean;
    reasoningIssues: string[];
    solutionRepaired: boolean;
    repairSummary: string;
    releaseLabel: 'standard' | 'with_caveats' | 'discussion_only' | 'not_recommended';
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

function normalizeComparisonResult(parsed: Partial<MaterialsComparisonResult>, draft: MaterialsV2QuestionDraft): MaterialsComparisonResult {
    const confidence: MaterialsComparisonResult['confidence'] =
        parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
            ? parsed.confidence
            : "low";
    const reasoningIssues = normalizeStringArray(parsed.reasoningIssues);
    const solutionRepaired = Boolean(parsed.solutionRepaired ?? false);

    // releaseLabel 降级逻辑
    let releaseLabel: MaterialsComparisonResult['releaseLabel'] =
        (parsed.releaseLabel && ['standard', 'with_caveats', 'discussion_only', 'not_recommended'].includes(parsed.releaseLabel))
            ? parsed.releaseLabel
            : confidence === "high" ? "standard" : confidence === "medium" ? "with_caveats" : "not_recommended";

    // reasoningValid：只要存在推理问题或答案被修复，一律判定推理无效（不信任LLM返回的true）
    const reasoningValid = (reasoningIssues.length === 0 && !solutionRepaired)
        ? Boolean(parsed.reasoningValid ?? (confidence === "high"))
        : false;

    // 硬降级
    if (!reasoningValid || reasoningIssues.length > 0 || solutionRepaired) {
        if (releaseLabel === 'standard') {
            releaseLabel = confidence === 'low' ? 'not_recommended' : 'with_caveats';
        }
    }

    return {
        answersAgree: Boolean(parsed.answersAgree),
        discrepancies: normalizeStringArray(parsed.discrepancies),
        finalAuthorizedAnswer: String(parsed.finalAuthorizedAnswer || (draft.questionType === 'short-answer' ? (draft.referencePoints || []).join('；') || draft.referenceAnswer : draft.requiredAnswer) || ""),
        finalSolutionText: String(parsed.finalSolutionText || draft.referenceAnswer || ""),
        confidence,
        notes: String(parsed.notes || ""),
        reasoningValid,
        reasoningIssues,
        solutionRepaired,
        repairSummary: String(parsed.repairSummary || ""),
        releaseLabel,
    };
}

function fallbackComparison(draft: MaterialsV2QuestionDraft, reason: string): MaterialsComparisonResult {
    return normalizeComparisonResult({
        answersAgree: false,
        discrepancies: [reason],
        finalAuthorizedAnswer: draft.requiredAnswer,
        finalSolutionText: draft.referenceAnswer,
        confidence: "low",
        notes: reason,
        reasoningValid: false,
        reasoningIssues: [reason],
        solutionRepaired: false,
        repairSummary: "",
        releaseLabel: "not_recommended",
    }, draft);
}

export async function compareAnswers(
    draft: MaterialsV2QuestionDraft,
    blindResult: MaterialsBlindSolverResult,
    problemIndex: number = 0
): Promise<MaterialsComparisonResult> {
    if (!blindResult.isSolvable) {
        return fallbackComparison(draft, `盲解失败：${blindResult.failReason || "未知原因"}`);
    }

    const disciplineGuidance = getDisciplineGuidance(draft.knowledgePoint);
    const isShortAnswer = draft.questionType === 'short-answer';
    const isMixed = draft.questionType === 'mixed';

    const prompt = isMixed
        ? buildMixedComparePrompt(draft, blindResult, disciplineGuidance)
        : isShortAnswer
        ? buildShortAnswerComparePrompt(draft, blindResult, disciplineGuidance)
        : buildCalculationComparePrompt(draft, blindResult, disciplineGuidance);

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'default',
            temperature: 0.1,
            responseFormat: 'json',
            systemPrompt: '你是材料科学权威裁判，只输出严格 JSON。',
        }, problemIndex, 'a5_compare')).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return fallbackComparison(draft, "对比裁判响应无法解析为 JSON");
        }
        return normalizeComparisonResult(cleanAndParseJSON(jsonMatch[0]) as Partial<MaterialsComparisonResult>, draft);
    } catch (error) {
        return fallbackComparison(draft, `对比裁判异常: ${(error as Error).message}`);
    }
}

function buildCalculationComparePrompt(
    draft: MaterialsV2QuestionDraft,
    blindResult: MaterialsBlindSolverResult,
    disciplineGuidance: string
): string {
    return `你是材料科学领域的权威答案裁判。请对比出题器标准答案和独立盲解，做最终裁定。

【题目】
${draft.questionText}

【版本 A：出题器标准答案】
${draft.referenceAnswer}

【版本 B：独立盲解答案】
${blindResult.blindAnswer}

【盲解最终答案】
${blindResult.blindFinalAnswer}

${disciplineGuidance}

【裁判规则】：
1. **数值对比**：允许合理精度差异（有效数字 ±1 位或相对误差 <2%），相同精度则视为一致。
2. **推理对比**：即使最终答案一致，也要检查推理过程。公式选用错误、近似条件不满足、单位换算有误都属于推理问题。
3. **不一致裁定**：若两版答案不一致，你需要独立判断哪个正确（或两者都有问题），给出 finalAuthorizedAnswer。
4. **物理合理性**：答案必须在物理意义上合理——例如扩散系数不会为负、晶粒尺寸不会是 nm 级而题面描述的是铸态粗晶组织。
5. **releaseLabel 定义**：
   - standard：答案一致、推理正确、置信度高
   - with_caveats：答案一致但有小瑕疵或推理有非致命问题
   - discussion_only：答案不一致但可通过裁判修复
   - not_recommended：无法确定正确答案或题目本身有致命缺陷

输出严格 JSON，不含 markdown：
{
  "answersAgree": true,
  "discrepancies": [],
  "finalAuthorizedAnswer": "最终权威答案（数值+单位）",
  "finalSolutionText": "最终完整解题过程",
  "confidence": "high",
  "notes": "裁判说明",
  "reasoningValid": true,
  "reasoningIssues": [],
  "solutionRepaired": false,
  "repairSummary": "",
  "releaseLabel": "standard"
}`;
}

function buildShortAnswerComparePrompt(
    draft: MaterialsV2QuestionDraft,
    blindResult: MaterialsBlindSolverResult,
    disciplineGuidance: string
): string {
    const draftPoints = (draft.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无要点）';
    const blindPoints = (blindResult.blindPoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无要点）';

    return `你是材料科学领域的权威论述裁判。请对比出题器参考答案和独立盲解论述，做最终裁定。

【题目】
${draft.questionText}

【版本 A：出题器参考答案（完整论述）】
${draft.referenceAnswer}

【版本 A 核心要点】
${draftPoints}

【版本 B：独立盲解论述】
${blindResult.blindAnswer}

【版本 B 核心要点】
${blindPoints}

${disciplineGuidance}

【裁判规则】：
1. **要点重合度**：统计双方共同覆盖的核心断言、A 独有而 B 遗漏的要点、B 独有而 A 遗漏的要点。共同要点数 ≥ 双方总要点的 60% 视为一致。
2. **学科正确性**：任一版本是否有学科事实错误（如误引 Fick 第一定律用于非稳态扩散、混淆屈服准则表达式、错配晶体结构与元素）。有事实错误必须在 discrepancies 中列出。
3. **论述完整性**：是否覆盖机理本质 + 判据/公式 + 工程含义三个层次。仅覆盖 1-2 层次属于 reasoningIssues。
4. **融合权威答案**：
   - answersAgree=true 时，finalSolutionText 输出双方共识版本（融合互补要点），finalAuthorizedAnswer 为要点合并文本（分号分隔）
   - 不一致时，判断哪方论述更正确并输出该方的完整论述，将有问题的部分列入 discrepancies
5. **releaseLabel 定义**：
   - standard：要点高度一致、无学科错误、论述完整
   - with_caveats：要点基本一致但一方有小遗漏或非致命瑕疵
   - discussion_only：要点部分重合，双方各有对错但可修复融合
   - not_recommended：一方有关键学科错误或论述严重不完整

输出严格 JSON，不含 markdown：
{
  "answersAgree": true,
  "discrepancies": [],
  "finalAuthorizedAnswer": "融合后的核心要点合并文本（分号分隔）",
  "finalSolutionText": "融合后的完整论述文本",
  "confidence": "high",
  "notes": "裁判说明（列出共同要点数/A独有/B独有）",
  "reasoningValid": true,
  "reasoningIssues": [],
  "solutionRepaired": false,
  "repairSummary": "",
  "releaseLabel": "standard"
}`;
}

function buildMixedComparePrompt(
    draft: MaterialsV2QuestionDraft,
    blindResult: MaterialsBlindSolverResult,
    disciplineGuidance: string
): string {
    const draftPoints = (draft.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无要点）';
    const draftSteps = (draft.referenceSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n') || '（无步骤）';
    const blindPoints = (blindResult.blindPoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无要点）';

    return `你是材料科学领域的权威裁判。这是一道**混合题**（含计算小问 + 论述小问）。请分别对比计算部分和论述部分，做最终裁定。

【题目】
${draft.questionText}

【版本 A：出题器标准答案（分小问）】
${draft.referenceAnswer}

【版本 A 计算步骤】
${draftSteps}

【版本 A 论述要点】
${draftPoints}

【版本 B：独立盲解】
${blindResult.blindAnswer}

【版本 B 计算最终答案】
${blindResult.blindFinalAnswer}

【版本 B 论述要点】
${blindPoints}

${disciplineGuidance}

【裁判规则】：
1. **计算部分对比**：对计算小问的数值答案做对比，允许合理精度差异（相对误差 <2%）。数值不一致必须列入 discrepancies，并独立判断哪方正确。
2. **论述部分对比**：统计论述小问的要点重合度（共同要点、A 独有、B 遗漏）；检查是否有学科事实错误（误引定律、概念混淆）。
3. **整体一致性判定**：**计算部分和论述部分都一致**才算 answersAgree=true；任一部分不一致则为 false。
4. **物理合理性**：计算结果必须物理合理；论述必须与计算结果自洽（不能计算得出 A 结论而论述却支持相反结论）。
5. **融合权威答案**：
   - finalSolutionText 输出融合后的完整分小问解答（计算过程 + 论述）
   - finalAuthorizedAnswer 输出「计算最终答案 + 关键论述要点」的合并文本
6. **releaseLabel 定义**：
   - standard：计算与论述均一致、无学科错误、置信度高
   - with_caveats：整体一致但某小问有小瑕疵或非致命问题
   - discussion_only：某部分不一致但可通过裁判修复融合
   - not_recommended：计算错误无法确定、或论述有关键学科错误、或题目缺陷

输出严格 JSON，不含 markdown：
{
  "answersAgree": true,
  "discrepancies": [],
  "finalAuthorizedAnswer": "计算最终答案 + 关键论述要点（合并文本）",
  "finalSolutionText": "融合后的完整分小问解答",
  "confidence": "high",
  "notes": "裁判说明（分别说明计算部分和论述部分的对比结论）",
  "reasoningValid": true,
  "reasoningIssues": [],
  "solutionRepaired": false,
  "repairSummary": "",
  "releaseLabel": "standard"
}`;
}
