import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { callMathLLM } from "../mathLlmTracker";
import type { MathTokenTrackerId } from "../tokenTracker";
import type { BlindSolverResult } from "./blind-solver";
import type { V2QuestionDraft } from "./generator";
import { buildNumericAnswerComparisonRule } from "./numeric-answer-option";
import { buildMathHardClosureReviewRule, normalizeHardClosurePlan } from "./hard-closure";
import { buildMathV2QuestionStructureComparisonRule } from "./question-structure";

export interface ComparisonResult {
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
    releaseLabel: "standard" | "with_caveats" | "discussion_only" | "adversarial" | "not_recommended";
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

function normalizeComparisonResult(parsed: Partial<ComparisonResult>, draft: V2QuestionDraft): ComparisonResult {
    const confidence = parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
        ? parsed.confidence
        : "low";
    const reasoningIssues = normalizeStringArray(parsed.reasoningIssues);
    const releaseLabel = parsed.releaseLabel && ["standard", "with_caveats", "discussion_only", "adversarial", "not_recommended"].includes(parsed.releaseLabel)
        ? parsed.releaseLabel
        : confidence === "high" ? "standard" : confidence === "medium" ? "with_caveats" : "not_recommended";

    return {
        answersAgree: Boolean(parsed.answersAgree),
        discrepancies: normalizeStringArray(parsed.discrepancies),
        finalAuthorizedAnswer: String(parsed.finalAuthorizedAnswer || draft.requiredAnswer || ""),
        finalSolutionText: String(parsed.finalSolutionText || draft.referenceAnswer || ""),
        confidence,
        notes: String(parsed.notes || ""),
        reasoningValid: Boolean(parsed.reasoningValid ?? (confidence === "high" && reasoningIssues.length === 0)),
        reasoningIssues,
        solutionRepaired: Boolean(parsed.solutionRepaired ?? reasoningIssues.length > 0),
        repairSummary: String(parsed.repairSummary || ""),
        releaseLabel,
    };
}

function fallbackComparison(draft: V2QuestionDraft, reason: string): ComparisonResult {
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
    draft: V2QuestionDraft,
    blindResult: BlindSolverResult,
    trackerId: MathTokenTrackerId = "math-v2",
    singleQuestion: boolean = false,
    numericAnswerOnly: boolean = false
): Promise<ComparisonResult> {
    if (!blindResult.isSolvable) {
        return fallbackComparison(draft, `盲解失败：${blindResult.failReason || "未知原因"}`);
    }
    const hardClosurePlan = normalizeHardClosurePlan(draft.hardClosurePlan);

    const prompt = `你是数学答案裁判。请比较出题器参考答案和独立盲解，形成最终权威答案。

【题目】
${draft.questionText}

【参考答案】
${draft.referenceAnswer}

【参考步骤】
${draft.referenceSteps.join("\n")}

【盲解】
${blindResult.blindAnswer}

【盲解最终答案】
${blindResult.blindFinalAnswer}

裁判要求：
1. 检查两个答案是否数学等价，不只比较字面形式。
2. 检查定义域、边界、唯一性、充分必要性、证明链是否闭合。
3. 若参考答案有小错但题目可救，给出修复后的最终权威解。
4. 若题目条件不足、多解、无解或答案冲突不可裁决，标为低置信度和 not_recommended。
5. ${buildMathV2QuestionStructureComparisonRule(singleQuestion)}
6. ${buildNumericAnswerComparisonRule(numericAnswerOnly) || "确认最终答案形态与题目目标一致。"}
7. 即使两个最终答案一致，也必须检查参考答案和盲解是否都完成主硬闭合点；若盲解跳过主硬闭合点或走了禁止捷径，answersAgree 可为 true，但 reasoningValid 必须为 false。

${buildMathHardClosureReviewRule(hardClosurePlan)}

输出严格 JSON，不含 markdown：
{
  "answersAgree": true,
  "discrepancies": [],
  "finalAuthorizedAnswer": "最终答案",
  "finalSolutionText": "最终完整解法",
  "confidence": "high",
  "notes": "说明",
  "reasoningValid": true,
  "reasoningIssues": [],
  "solutionRepaired": false,
  "repairSummary": "",
  "releaseLabel": "standard"
}`;

    const raw = (await callMathLLM("v2_a5_comparator", trackerId, prompt, {
        model: "reasoning",
        temperature: 0.1,
        responseFormat: "json",
        systemPrompt: "你是严格数学裁判，只输出严格 JSON。",
        reasoning: { effort: "xhigh", summary: "auto" },
    })).trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return fallbackComparison(draft, "Failed to parse comparator response");
    }

    try {
        return normalizeComparisonResult(cleanAndParseJSON(jsonMatch[0]) as Partial<ComparisonResult>, draft);
    } catch (error) {
        return fallbackComparison(draft, `JSON parse failed: ${(error as Error).message}`);
    }
}
