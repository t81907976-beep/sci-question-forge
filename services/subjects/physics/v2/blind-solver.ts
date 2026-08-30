import { callLLM } from "../../../llmClient";
import { callLLMTracked } from "../costTracker";
import type { V2QuestionDraft } from "./generator";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { callWithGatewayRetry } from "./gateway-retry";

/**
 * V2 Node A4: Blind Solver
 *
 * A fresh LLM context that only sees the question text — no reference answer,
 * no internal hints. Produces an independent solution.
 */

export interface BlindSolverResult {
    blindAnswer: string;        // Step-by-step independent solution
    blindFinalAnswer: string;   // Final answer only
    isSolvable: boolean;
    failReason?: string;
}

export async function solveBlind(draft: V2QuestionDraft, problemIndex?: number): Promise<BlindSolverResult> {
    const prompt = `你是顶级物理专家。请独立解答以下题目，不借助任何外部提示。

【题目】：
${draft.questionText}

要求：
1. 从题目文字出发，逐步推导
2. 每步写出具体公式和数值代入（不能只写思路）
3. 给出最终答案（含数值和单位）
4. 如果题目有问题无法求解，说明原因

输出必须是严格 JSON，不含 markdown 代码块：
{
  "isSolvable": true 或 false,
  "failReason": "若无法求解，说明原因，否则为空字符串",
  "blindAnswer": "完整分步解答过程",
  "blindFinalAnswer": "最终答案（含数值和单位）"
}`;

    const raw = (await callWithGatewayRetry(
        () => problemIndex !== undefined
            ? callLLMTracked(prompt, {
                model: 'reasoning',
                systemPrompt: "你是物理专家，请独立解答题目，严格按 JSON 格式输出。",
                temperature: 0.1,
                reasoning: { effort: 'xhigh', summary: 'auto' }
            }, problemIndex)
            : callLLM(prompt, {
                model: 'reasoning',
                systemPrompt: "你是物理专家，请独立解答题目，严格按 JSON 格式输出。",
                temperature: 0.1,
                reasoning: { effort: 'xhigh', summary: 'auto' }
            }),
        'A4 盲解',
    )).trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return {
            isSolvable: false,
            blindAnswer: "",
            blindFinalAnswer: "",
            failReason: "Failed to parse blind solver response"
        };
    }

    try {
        return cleanAndParseJSON(jsonMatch[0]) as BlindSolverResult;
    } catch (e) {
        return {
            isSolvable: false,
            blindAnswer: "",
            blindFinalAnswer: "",
            failReason: `JSON parse failed: ${(e as Error).message}`
        };
    }
}
