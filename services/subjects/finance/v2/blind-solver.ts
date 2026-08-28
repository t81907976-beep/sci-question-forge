import { callLLM } from "../../../llmClient";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { V2QuestionDraft } from "./generator";
import { formatFinanceRulesForPrompt, selectFinanceRules } from "./rule-matcher";

/**
 * V2 Node A4 (finance): Blind Solver
 *
 * A fresh LLM context that only sees the question text — no reference answer,
 * no internal hints. Produces an independent solution.
 * 盲解表现同时被 A5 用来反推题目难度是否真的达到博士级。
 */

export interface BlindSolverResult {
    blindAnswer: string;        // Step-by-step independent solution
    blindFinalAnswer: string;   // Final answer only
    isSolvable: boolean;
    failReason?: string;
}

export async function solveBlind(draft: V2QuestionDraft): Promise<BlindSolverResult> {
    const dynamicRules = formatFinanceRulesForPrompt(selectFinanceRules({
        node: 'A4',
        knowledgePoint: draft.knowledgePoint,
        dimension: draft.chosenDimension,
        questionText: draft.questionText,
        maxRules: 3,
    }), '【已匹配的规则库动态盲解自检要求】');

    const prompt = `你是量化金融领域的博士后级别专家。请独立解答以下题目，不借助任何外部提示。

【题目】：
${draft.questionText}

${dynamicRules}要求：
1. 动笔前先把本题的口径显式写出：计价单位与标价方向、利率的复利与日计数约定、波动率年化方式、现金流口径与对应折现率、所用测度或折现曲线。题面未给定而必须假设时，明确标注"假设：…"并说明该假设影响结果的方向。
2. 从题目文字出发，逐步推导；每步写出具体公式和数值代入（不能只写思路）。
3. 套用任何公式前先检验其适用条件是否被本题满足（常数参数、分布假设、矩存在性、平稳性、无套利、连续交易与无摩擦、小变动线性近似）；不满足时说明偏差方向并改用适用方法。
4. 不要把易混量互相代入：名义与实际、隐含与局部与瞬时波动率、风险中性与真实世界概率、企业价值与股权价值、FCFF 与 FCFE、独立与从属减因率、面值加权与市值加权。
5. 得出数值后做三重校验：符号与方向是否符合经济直觉；量级是否落在合理区间（期权价在无套利边界内、概率与相关系数合法、贴现因子在 (0,1]、波动率非负、TVaR≥VaR）；极端参数下是否退化为已知结果。
6. 给出最终答案（含数值和单位）。
7. 若题目无法求解，必须精确指出缺失的是哪个具体输入（例如"缺少两资产相关系数，quanto 漂移调整无法确定"），而不是笼统说"信息不足"；若能在标注假设后求解，则同时给出"标注假设下的解"与"缺失项清单"。

输出必须是严格 JSON，不含 markdown 代码块：
{
  "isSolvable": true 或 false,
  "failReason": "若无法求解，指出具体缺失的输入，否则为空字符串",
  "blindAnswer": "完整分步解答过程，开头含口径声明",
  "blindFinalAnswer": "最终答案（含数值和单位）"
}`;

    const raw = (await callLLM(prompt, {
        model: 'reasoning',
        temperature: 0.1,
        systemPrompt: "你是量化金融专家，请独立解答题目，严格按 JSON 格式输出。"
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
