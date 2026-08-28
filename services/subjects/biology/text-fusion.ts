import { callLLM } from "../../llmClient";
import type { BaseProblem, TrapModification } from "../../../types/multiNodeTypes";

/**
 * Biology: Text Fusion
 * 
 * 将散落的条件/数据自然融入题干，干扰条件无痕融入
 */

export async function fuseProblemText(
    baseProblem: BaseProblem,
    trapModifications: TrapModification[]
): Promise<string> {
    // 如果没有陷阱修改，直接返回原题干
    if (!trapModifications || trapModifications.length === 0) {
        return baseProblem.questionBody || '';
    }

    // 获取合并后的题目描述
    const modifiedQuestionBody = trapModifications[0]?.modifiedFields?.questionBody;
    if (modifiedQuestionBody) {
        return modifiedQuestionBody;
    }

    // 如果没有修改题干，返回原题干
    return baseProblem.questionBody || '';
}

/**
 * 构建完整的融合题干（用于推理题）
 */
export async function buildFusedProblemText(
    baseProblem: BaseProblem,
    trapModifications: TrapModification[]
): Promise<string> {
    const isReasoning = baseProblem.problemType && baseProblem.problemType !== 'calculation';
    
    // 如果已有修改后的题干，直接返回
    const modifiedQuestionBody = trapModifications[0]?.modifiedFields?.questionBody;
    if (modifiedQuestionBody) {
        return modifiedQuestionBody;
    }

    // 否则构建融合题干
    const prompt = isReasoning
        ? buildReasoningFusionPrompt(baseProblem, trapModifications)
        : buildCalculationFusionPrompt(baseProblem, trapModifications);

    try {
        const result = await callLLM(prompt, { model: 'chat', temperature: 0.3 });
        return result.trim();
    } catch (error) {
        console.error("Text Fusion Error:", error);
        return baseProblem.questionBody || '';
    }
}

function buildReasoningFusionPrompt(
    baseProblem: BaseProblem,
    trapModifications: TrapModification[]
): string {
    const logicConditions = {
        ...baseProblem.logicConditions,
        ...trapModifications.reduce((acc, m) => ({
            ...acc,
            ...m.modifiedFields?.logicConditions
        }), {}),
    };

    const logicDistractors = trapModifications.reduce((acc, m) => ({
        ...acc,
        ...m.modifiedFields?.logicDistractors
    }), {});

    return `
你是一位生物学题目润色专家。请将以下散落的条件和干扰项自然地融入题干中。

【原题干】：
${baseProblem.questionBody}

【需要融入的条件】：
${Object.entries(logicConditions).map(([k, v]) => `- ${k}：${v}`).join('\n')}

【需要融入的干扰条件】（表述形式与正常条件完全相同，不得出现"另一组"、"参考实验"等提示性措辞）：
${Object.entries(logicDistractors).map(([k, v]) => `- ${k}：${v}`).join('\n')}

【要求】：
1. 将条件和干扰项自然地融入题干，不要改变原意
2. 干扰条件的表述形式必须与正常条件完全相同
3. 保持题目长度在 200-300 字
4. 题目末尾保持"请推断："结尾

【输出】：
直接输出融合后的完整题干文字，不要输出任何解释。
`;
}

function buildCalculationFusionPrompt(
    baseProblem: BaseProblem,
    trapModifications: TrapModification[]
): string {
    const distractorData = trapModifications.reduce((acc, m) => ({
        ...acc,
        ...m.modifiedFields?.distractorData
    }), {});

    return `
你是一位生物学题目润色专家。请将以下干扰数据自然地融入题干中。

【原题干】：
${baseProblem.questionBody}

【已知数据】：
${Object.entries(baseProblem.givenData || {}).map(([k, v]) => `- ${k}：${(v as any).value} ${(v as any).unit}`).join('\n')}

【干扰数据】（表述形式与正常数据完全相同）：
${Object.entries(distractorData).map(([k, v]) => `- ${k}：${(v as any).value} ${(v as any).unit}`).join('\n')}

【要求】：
1. 将干扰数据自然地融入题干，不要改变原意
2. 干扰数据的表述形式必须与正常数据完全相同
3. 保持题目长度在 200-300 字
4. 题目末尾保持单一求解目标

【输出】：
直接输出融合后的完整题干文字，不要输出任何解释。
`;
}