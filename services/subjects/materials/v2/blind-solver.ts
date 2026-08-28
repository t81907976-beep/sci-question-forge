import { callLLMTracked } from "../costTracker";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { MaterialsV2QuestionDraft } from "./generator";

/**
 * Materials V2 — A4 盲解
 *
 * ⚠️ 核心：只把 draft.questionText 交给一个全新的 LLM 上下文，
 * 不传 referenceAnswer / coreData / knowledgePoint / chosenDimension。
 * 用于独立求解，供 A5 与出题器答案对比。
 *
 * 三种题型分支：
 * - calculation：盲解输出为分步解答 + 最终数值答案
 * - short-answer：盲解输出为 blindPoints（要点数组）
 * - mixed：盲解同时输出计算步骤 + 论述要点
 */

export interface MaterialsBlindSolverResult {
    blindAnswer: string;        // 完整分步解答 / 完整论述
    blindFinalAnswer: string;   // 只有最终答案+单位（计算题）/ 要点摘要（简答题）
    blindPoints: string[];      // 简答题专用：盲解核心要点数组
    isSolvable: boolean;
    failReason?: string;
}

function normalizeBlindResult(parsed: Partial<MaterialsBlindSolverResult>, isShortAnswer: boolean): MaterialsBlindSolverResult {
    const blindPoints = Array.isArray(parsed.blindPoints)
        ? parsed.blindPoints.map(item => String(item).trim()).filter(Boolean)
        : [];

    const blindAnswer = String(parsed.blindAnswer || "");
    // 简答题：finalAnswer 用要点摘要；计算题/混合题：用数值最终答案（混合题的数值部分）
    const blindFinalAnswer = isShortAnswer
        ? (blindPoints.length > 0 ? blindPoints.join('；') : String(parsed.blindFinalAnswer || ""))
        : String(parsed.blindFinalAnswer || "");

    return {
        blindAnswer,
        blindFinalAnswer,
        blindPoints,
        isSolvable: Boolean(parsed.isSolvable ?? (blindAnswer.length > 0)),
        failReason: parsed.failReason ? String(parsed.failReason) : undefined,
    };
}

export async function solveBlind(
    draft: MaterialsV2QuestionDraft,
    problemIndex: number = 0
): Promise<MaterialsBlindSolverResult> {
    const isShortAnswer = draft.questionType === 'short-answer';
    const isMixed = draft.questionType === 'mixed';

    // 只暴露题面文字，实现真正的盲解
    const mixedPrompt = `请独立求解下面这道材料科学与工程**混合题**（包含计算小问与论述小问）。你只能看到题目本身，没有任何参考答案。

【题目】
${draft.questionText}

【作答要求】
1. 完全基于题面给出的信息独立作答，不要臆测题面未给出的数据。
2. 对**计算小问**：逐步写出公式、适用条件、数值代入、中间结果，给出带单位的数值答案。
3. 对**论述小问**：分条论述，引用具体定律/判据名称，覆盖机理与工程含义。
4. 注意量纲与单位换算；论述必须与计算结果或题设条件关联。
5. 如果题目条件不足、自相矛盾或无法作答，请在 isSolvable 中标记为 false 并说明原因。

输出严格 JSON，不含 markdown：
{
  "blindAnswer": "完整分小问解答（含计算过程与论述）",
  "blindFinalAnswer": "计算小问的最终数值答案（含单位；多个用；分隔）",
  "blindPoints": ["论述要点1（15-40字）", "论述要点2", "...（至少3条）"],
  "isSolvable": true,
  "failReason": "若不可解，说明原因；可解则留空"
}`;

    const prompt = isMixed
        ? mixedPrompt
        : isShortAnswer
        ? `请独立回答下面这道材料科学与工程简答题/论述题。你只能看到题目本身，没有任何参考答案。

【题目】
${draft.questionText}

【作答要求】
1. 完全基于题面给出的信息独立论述，展示你对学科核心概念的理解。
2. 按要点分条论述，每个要点覆盖一个核心断言或推理链条。
3. 引用具体的定律/判据/理论名称（如 Hall-Petch、Schmid 因子、Fick 定律等）。
4. 论述应覆盖机理本质、判据/公式适用条件、工程含义三个层次。
5. 如果题目条件不清或自相矛盾，请在 isSolvable 中标记为 false 并说明原因。

输出严格 JSON，不含 markdown：
{
  "blindAnswer": "完整论述文本（400-700字）",
  "blindPoints": ["要点1（15-40字）", "要点2", "...（至少4条）"],
  "blindFinalAnswer": "",
  "isSolvable": true,
  "failReason": ""
}`
        : `请独立求解下面这道材料科学与工程题目。你只能看到题目本身，没有任何参考答案。

【题目】
${draft.questionText}

【求解要求】
1. 完全基于题面给出的信息独立推导，不要臆测题面未给出的数据。
2. 逐步写出推理过程：所用公式、公式适用条件、数值代入、中间结果。
3. 注意量纲和单位换算，检查单位一致性。
4. 如果题目条件不足、自相矛盾或无法得到唯一解，请在 isSolvable 中标记为 false 并说明原因。
5. 给出带单位的最终数值答案。

输出严格 JSON，不含 markdown：
{
  "blindAnswer": "完整分步解答（含公式和代入过程）",
  "blindFinalAnswer": "最终答案（数值+单位）",
  "blindPoints": [],
  "isSolvable": true,
  "failReason": "若不可解，说明原因；可解则留空"
}`;

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'reasoning',
            temperature: 0.1,
            responseFormat: 'json',
            systemPrompt: isMixed
                ? '你是材料科学与工程领域的解题与论述专家，只根据题面独立作答，只输出严格 JSON。'
                : isShortAnswer
                ? '你是材料科学与工程领域的论述专家，只根据题面独立作答，只输出严格 JSON。'
                : '你是材料科学与工程领域的解题专家，只根据题面独立求解，只输出严格 JSON。',
        }, problemIndex, 'a4_blind_solve')).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                blindAnswer: "",
                blindFinalAnswer: "",
                blindPoints: [],
                isSolvable: false,
                failReason: "盲解响应无法解析为 JSON",
            };
        }
        return normalizeBlindResult(cleanAndParseJSON(jsonMatch[0]) as Partial<MaterialsBlindSolverResult>, isShortAnswer);
    } catch (error) {
        return {
            blindAnswer: "",
            blindFinalAnswer: "",
            blindPoints: [],
            isSolvable: false,
            failReason: `盲解异常: ${(error as Error).message}`,
        };
    }
}
