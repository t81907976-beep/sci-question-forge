import {
    BaseProblem,
    MathPerturbationBlueprint,
    TrapModification,
    TrapType
} from "../../../types/multiNodeTypes";
import { cleanAndParseJSON } from "../../utils/jsonCleaner";
import { callMathLLM } from "../../subjects/math/mathLlmTracker";
import type { MathTokenTrackerId } from "../../subjects/math/tokenTracker";

function normalizeChecklist(value: unknown, fallback: string[]): string[] {
    if (Array.isArray(value)) {
        const items = value.map(String).map(item => item.trim()).filter(Boolean);
        if (items.length > 0) return items;
    }
    return fallback;
}

function normalizeModification(
    parsed: Partial<TrapModification>,
    baseProblem: BaseProblem,
    blueprint: MathPerturbationBlueprint
): TrapModification {
    const modifiedFields = parsed.modifiedFields && typeof parsed.modifiedFields === "object"
        ? parsed.modifiedFields
        : {};

    return {
        trapType: TrapType.PROCESS_DETERMINATION,
        agentId: "math_structural_perturbation",
        perturbationType: blueprint.perturbationType,
        invalidatedStandardMethod: String(parsed.invalidatedStandardMethod || blueprint.invalidatedStandardMethod),
        expectedWrongPath: String(parsed.expectedWrongPath || blueprint.expectedWrongPath),
        divergenceStep: String(parsed.divergenceStep || blueprint.divergenceStep),
        manualValidationChecklist: normalizeChecklist(
            parsed.manualValidationChecklist,
            blueprint.manualValidationChecklist
        ),
        modifiedFields: {
            ...modifiedFields,
            questionBody: String(modifiedFields.questionBody || baseProblem.questionBody || "")
        },
        trapDescription: String(
            parsed.trapDescription ||
            `数学结构扰动：${blueprint.perturbationType}；失效熟路：${blueprint.invalidatedStandardMethod}`
        ),
        expectedConfusion: String(parsed.expectedConfusion || blueprint.expectedWrongPath)
    };
}

/**
 * Node 3: Math Structural Perturbation
 *
 * Applies exactly one structural perturbation described by Node 2's blueprint.
 * This is not an adversarial rewrite and does not intentionally make the problem ambiguous;
 * the output must remain a clean, uniquely solvable math problem.
 */
export async function applyMathPerturbation(
    baseProblem: BaseProblem,
    problemIndex: number,
    tokenTrackerId: MathTokenTrackerId
): Promise<TrapModification[]> {
    const blueprint = baseProblem.mathPerturbationBlueprint;

    if (!blueprint) {
        return [];
    }

    const prompt = `
你是数学结构扰动专家。请根据蓝图对基础题做一次结构扰动，产出更适合人工验证大模型能力边界的数学题。

【基础题】：
${baseProblem.questionBody}

【已知数据】：
${JSON.stringify(baseProblem.givenData, null, 2)}

【求解目标】：
${baseProblem.requiredAnswer}

【扰动蓝图】：
${JSON.stringify(blueprint, null, 2)}

【硬性要求】：
1. 只执行蓝图中的 perturbationType=${blueprint.perturbationType} 这一种主扰动，不叠加多个扰动，不改成其他扰动类型。
2. 扰动后的题目仍必须条件充分、无歧义、有唯一闭式答案。
3. 不得生成多问，不得改成证明题或开放题。
4. 不得加入题面外才能求解的数据。
5. expectedWrongPath 必须是“自然但错误”的熟路，不是因为题目缺条件或表述不清导致错误。
6. manualValidationChecklist 必须能让人工拿到解题模型回答后快速判定错因。
7. 题面不要出现“大模型”“扰动”“陷阱”“与原题不同”等元叙事文字。

输出严格 JSON，不含 markdown：
{
  "modifiedFields": {
    "questionBody": "扰动后的完整题目，只保留一个求解目标",
    "givenData": {
      "如需同步更新数据则填写": {"value": "数值或字符串", "unit": ""}
    }
  },
  "trapDescription": "本次结构扰动的数学设计说明",
  "invalidatedStandardMethod": "扰动后失效的熟题解法",
  "expectedWrongPath": "预期错误路线",
  "divergenceStep": "正确路线与错误路线的分叉点",
  "manualValidationChecklist": ["人工检查项1", "人工检查项2", "人工检查项3"]
}`;

    try {
        const content = await callMathLLM(`node3_${problemIndex}`, tokenTrackerId, prompt, {
            model: "reasoning",
            temperature: 0.6,
            systemPrompt: "你是数学结构扰动专家。只返回严格 JSON，确保扰动后题目仍唯一可解。",
            reasoning: { effort: "xhigh", summary: "auto" }
        });

        const parsed = cleanAndParseJSON(content) as Partial<TrapModification>;
        return [normalizeModification(parsed, baseProblem, blueprint)];
    } catch (error: any) {
        console.error("Math Structural Perturbation Error:", error);
        throw new Error(`Math structural perturbation failed: ${error.message}`);
    }
}

export async function applyTraps(
    baseProblem: BaseProblem,
    _trapCount: number,
    problemIndex: number = 0,
    tokenTrackerId: MathTokenTrackerId = problemIndex
): Promise<TrapModification[]> {
    return applyMathPerturbation(baseProblem, problemIndex, tokenTrackerId);
}
