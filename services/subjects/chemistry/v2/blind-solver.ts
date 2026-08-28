import { callLLM } from "../../../llmClient";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { V2QuestionDraft } from "./generator";
import { formatRulesForPrompt, selectChemistryRules } from "./rule-matcher";

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

export async function solveBlind(draft: V2QuestionDraft): Promise<BlindSolverResult> {
    const dynamicRules = formatRulesForPrompt(selectChemistryRules({
        node: 'A4',
        knowledgePoint: draft.knowledgePoint,
        dimension: draft.chosenDimension,
        questionText: draft.questionText,
        maxRules: 3,
    }), '【已匹配的规则库动态盲解自检要求】');

    const prompt = `你是顶级化学专家。请独立解答以下题目，不借助任何外部提示。

【题目】：
${draft.questionText}

${dynamicRules}要求：
1. 从题目文字出发，逐步推导
2. 每步写出具体公式和数值代入（不能只写思路）
3. 代入公式前先判断模型/近似/标准态/活度或浓度基准是否适用；不要把表观量直接当本征量、总浓度直接当活性形态浓度
4. 涉及守恒、电荷平衡、物料平衡、覆盖度、pH、速率常数、平衡常数、参比电极或参考零点时，检查数值范围和单位/基准自洽
5. 给出最终答案（含数值和单位）
6. 如果题目有问题无法求解，说明原因

输出必须是严格 JSON，不含 markdown 代码块：
{
  "isSolvable": true 或 false,
  "failReason": "若无法求解，说明原因，否则为空字符串",
  "blindAnswer": "完整分步解答过程",
  "blindFinalAnswer": "最终答案（含数值和单位）"
}`;

    const raw = (await callLLM(prompt, {
        model: 'reasoning',
        temperature: 0.1,
        systemPrompt: "你是化学专家，请独立解答题目，严格按 JSON 格式输出。"
    })).trim();
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
    } catch {
        return {
            isSolvable: false,
            blindAnswer: "",
            blindFinalAnswer: "",
            failReason: "Blind solver JSON parse failed"
        };
    }
}
