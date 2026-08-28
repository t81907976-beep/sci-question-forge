import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { callMathLLM } from "../mathLlmTracker";
import type { MathTokenTrackerId } from "../tokenTracker";
import type { V2QuestionDraft } from "./generator";

export interface BlindSolverResult {
    blindAnswer: string;
    blindFinalAnswer: string;
    isSolvable: boolean;
    failReason?: string;
}

function normalizeBlindResult(parsed: Partial<BlindSolverResult>): BlindSolverResult {
    return {
        isSolvable: Boolean(parsed.isSolvable),
        failReason: String(parsed.failReason || ""),
        blindAnswer: String(parsed.blindAnswer || ""),
        blindFinalAnswer: String(parsed.blindFinalAnswer || ""),
    };
}

export async function solveBlind(
    draft: V2QuestionDraft,
    trackerId: MathTokenTrackerId = "math-v2"
): Promise<BlindSolverResult> {
    const prompt = `你是严格的数学解题者。请只根据题干独立求解，不要使用任何参考答案或出题意图。

【题目】
${draft.questionText}

要求：
1. 先检查题干条件是否充分、答案是否应唯一、定义域是否明确。
2. 若可解，给出完整推理过程，不能用“显然”“易得”跳过关键步骤。
3. 最后给出最终答案，并做必要的回代或边界检验。
4. 若不可解、多解或条件不充分，说明原因。

输出严格 JSON，不含 markdown：
{
  "isSolvable": true,
  "failReason": "",
  "blindAnswer": "完整独立解答",
  "blindFinalAnswer": "最终答案"
}`;

    const raw = (await callMathLLM("v2_a4_blind_solver", trackerId, prompt, {
        model: "reasoning",
        temperature: 0.1,
        responseFormat: "json",
        systemPrompt: "你是严谨数学解题者，只输出严格 JSON。",
        reasoning: { effort: "xhigh", summary: "auto" },
    })).trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return {
            isSolvable: false,
            failReason: "Failed to parse blind solver response",
            blindAnswer: "",
            blindFinalAnswer: "",
        };
    }

    try {
        return normalizeBlindResult(cleanAndParseJSON(jsonMatch[0]) as Partial<BlindSolverResult>);
    } catch (error) {
        return {
            isSolvable: false,
            failReason: `JSON parse failed: ${(error as Error).message}`,
            blindAnswer: "",
            blindFinalAnswer: "",
        };
    }
}
