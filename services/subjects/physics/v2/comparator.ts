import { callLLM } from "../../../llmClient";
import { callLLMTracked } from "../costTracker";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { V2QuestionDraft } from "./generator";
import type { BlindSolverResult } from "./blind-solver";
import { callWithGatewayRetry } from "./gateway-retry";

/**
 * V2 Node A5: Answer Comparator
 *
 * Compares the generator's reference answer against the blind solver's answer.
 * Produces a final authoritative solution and flags discrepancies.
 */

export interface ComparisonResult {
    answersAgree: boolean;              // Do both arrive at the same final answer?
    discrepancies: string[];            // Any logical or numerical differences
    finalAuthorizedAnswer: string;      // The authoritative final answer to use
    finalSolutionText: string;          // The authoritative step-by-step solution
    confidence: "high" | "medium" | "low";
    notes: string;
    reasoningValid: boolean;
    reasoningIssues: string[];
    solutionRepaired: boolean;
    repairSummary: string;
    releaseLabel: 'standard' | 'with_caveats' | 'discussion_only' | 'adversarial' | 'not_recommended';
}

function isConfidence(value: unknown): value is ComparisonResult["confidence"] {
    return value === "high" || value === "medium" || value === "low";
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item)).filter(Boolean) : [];
}

function normalizeComparisonResult(parsed: Partial<ComparisonResult>): ComparisonResult {
    const confidence = isConfidence(parsed.confidence) ? parsed.confidence : "low";
    const discrepancies = normalizeStringArray(parsed.discrepancies);
    const reasoningIssues = normalizeStringArray(parsed.reasoningIssues);
    const solutionRepaired = Boolean(parsed.solutionRepaired ?? reasoningIssues.length > 0);
    const reasoningValid = Boolean(parsed.reasoningValid ?? (confidence === "high" && reasoningIssues.length === 0 && !solutionRepaired));

    const releaseLabel = (parsed.releaseLabel && ['standard', 'with_caveats', 'discussion_only', 'adversarial', 'not_recommended'].includes(parsed.releaseLabel))
        ? parsed.releaseLabel
        : confidence === 'high' ? 'standard' : confidence === 'medium' ? 'with_caveats' : 'not_recommended';

    return {
        answersAgree: Boolean(parsed.answersAgree),
        discrepancies,
        finalAuthorizedAnswer: String(parsed.finalAuthorizedAnswer ?? ""),
        finalSolutionText: String(parsed.finalSolutionText ?? ""),
        confidence,
        notes: String(parsed.notes ?? ""),
        reasoningValid,
        reasoningIssues,
        solutionRepaired,
        repairSummary: String(parsed.repairSummary ?? ""),
        releaseLabel,
    };
}

function fallbackComparison(draft: V2QuestionDraft, reason: string): ComparisonResult {
    return {
        answersAgree: false,
        discrepancies: [reason],
        finalAuthorizedAnswer: draft.referenceAnswer.split("\n").slice(-1)[0] || "",
        finalSolutionText: draft.referenceAnswer,
        confidence: "low",
        notes: "Comparator failed, fell back to reference answer",
        reasoningValid: false,
        reasoningIssues: ["比较器未能完成推理审查，无法确认解析链条正确性"],
        solutionRepaired: false,
        repairSummary: "",
        releaseLabel: "not_recommended",
    };
}

export async function compareAnswers(
    draft: V2QuestionDraft,
    blindResult: BlindSolverResult,
    problemIndex?: number
): Promise<ComparisonResult> {
    const prompt = `你是物理题目裁判专家。请对比以下两版解答，判断最终答案和推理链是否可靠，并给出最终权威解答。

【题目】：
${draft.questionText}

【版本 A（出题者参考答案）】：
${draft.referenceAnswer}

【版本 B（独立解题者答案）】：
${blindResult.blindAnswer}

【核心裁判规则】：
1. 不要只比较最终答案。即使两版最终答案一致，也必须逐步审查每个关键推理步骤。
2. 必须检查物理定律适用条件、量纲、单位换算、符号约定、参考系、能量零点/势能参考、边界条件、初始条件、近似条件和因果链条。
3. 如果最终答案一致但任一版本存在关键公式错误、单位错误、条件误用、参考零点混淆、符号约定错误、逻辑跳步或数值巧合，answersAgree 仍可为 true，但 reasoningValid 必须为 false，reasoningIssues 必须写明错误。
4. 遇到「最终答案正确但推理有错」的情况，不要简单通过，也不要只拒绝；必须在 finalSolutionText 中重写一版正确、完整、可直接导出的标准解答。
5. finalAuthorizedAnswer 必须与 finalSolutionText 的结论完全一致。
6. finalSolutionText 不得保留错误推理；如需提及错误，只能明确说明该错误已被排除或修正。

【对比任务】：
1. 判断两版最终答案是否一致（数值、单位、表达形式）。
2. 独立审查两版推理链，指出关键错误或不可支撑的步骤。
3. 裁定最终权威答案，并重写最终权威分步解答。
4. 给出置信度评估：
   - high：最终答案确定，推理审查无关键问题，最终解答可直接导出
   - medium：最终答案可确定，但原解答存在推理错误/缺漏，已在最终解答中修复
   - low：无法可靠确定最终答案或无法修复为可靠解析

输出必须是严格 JSON，不含 markdown 代码块：
{
  "answersAgree": true 或 false,
  "reasoningValid": true 或 false,
  "reasoningIssues": ["推理错误1", "推理错误2"],
  "solutionRepaired": true 或 false,
  "repairSummary": "如果修复了解析，说明修复了什么；否则为空字符串",
  "discrepancies": ["差异1", "差异2"],
  "finalAuthorizedAnswer": "最终权威答案（数值+单位）",
  "finalSolutionText": "最终权威分步解答（每步含必要公式、数值和物理意义）",
  "confidence": "high" 或 "medium" 或 "low",
  "notes": "裁判备注（如有争议点）"
}`;

    const raw = (await callWithGatewayRetry(
        () => problemIndex !== undefined
            ? callLLMTracked(prompt, { model: 'default', temperature: 0.1, reasoning: { effort: 'xhigh', summary: 'auto' } }, problemIndex)
            : callLLM(prompt, { model: 'default', temperature: 0.1, reasoning: { effort: 'xhigh', summary: 'auto' } }),
        'A5 答案比较',
    )).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return fallbackComparison(draft, "Failed to parse comparator response");
    }

    try {
        return normalizeComparisonResult(cleanAndParseJSON(jsonMatch[0]) as Partial<ComparisonResult>);
    } catch {
        return fallbackComparison(draft, "Comparator JSON parse failed");
    }
}
