import { callLLM } from "../../llmClient";
import { callLLMTracked } from "./costTracker";
import type { FormattedSolution, BaseProblem, TrapCluster } from "../../../types/multiNodeTypes";

export interface CombinedSolverFormatterResult {
    isValid: boolean;
    requiresMinimumSteps: boolean;
    hasUniqueAnswer: boolean;
    errorMessage?: string;
    formattedSolution?: FormattedSolution;
    sanityCheckResult?: SanityCheckResult;
    repairAttempts?: number;
    wasProblemRepaired?: boolean;
}

export interface SanityCheckResult {
    allChecksPass: boolean;
    violations: string[];
    checkedAt: string;
}

/**
 * Physics: Solver & Formatter (Standard Solution with Trap Avoidance)
 */

async function performSanityCheck(
    baseProblem: BaseProblem,
    modifiedText: string,
    problemIndex?: number
): Promise<SanityCheckResult> {
    const checkPrompt = `
你是物理学审核专家。在求解以下题目前，必须独立执行防伪审查（Sanity Check），检查题目本身的物理合理性。

【被审查的完整题目（陷阱注入后）】：
${modifiedText}

【原始白板题（陷阱注入前）】：
${baseProblem.originalProblemText}

【题目的核心已知数据】：
${JSON.stringify(baseProblem.coreData, null, 2)}

【防伪审查清单】：
0. **陷阱注入差异审查（最重要）**：逐句对比差异，检查是否引入物理条件矛盾
1. **常数合法性**：物理常数是否与标准值一致（N_A = 6.02214076×10²³ mol⁻¹, R = 8.314 J/(mol·K)）
2. **晶体结构匹配**：晶体结构与对应物质是否真实匹配
3. **物理边界自洽性**：过程定义与热力学定律是否一致
4. **数据完整性**：求解目标所需数据是否完整
5. **微积分与数学规范性**：偏导数与全导数是否正确区分
6. **相变与极限条件的合理性**

【输出格式】（严格 JSON，不含 markdown）：
{
  "allChecksPass": true或false,
  "violations": ["如果失败，列举每一个违规项"],
  "checksPerformed": {
    "trapDiffCheck": "通过/失败/无法检查",
    "constantValidity": "通过/失败/无法检查",
    "crystalStructureMatch": "通过/失败/无法检查",
    "thermodynamicConsistency": "通过/失败/无法检查",
    "dataCompleteness": "通过/失败/无法检查",
    "calculusCorrectness": "通过/失败/无法检查"
  }
}
`;

    try {
        const content = problemIndex !== undefined
            ? await callLLMTracked(checkPrompt, { model: 'reasoning', temperature: 0.2 }, problemIndex)
            : await callLLM(checkPrompt, { model: 'reasoning', temperature: 0.2 });
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return { allChecksPass: false, violations: ["Failed to parse Sanity Check response"], checkedAt: new Date().toISOString() };
        }
        const parsed = JSON.parse(jsonMatch[0]);
        return { allChecksPass: parsed.allChecksPass === true, violations: parsed.violations || [], checkedAt: new Date().toISOString() };
    } catch (error) {
        return { allChecksPass: false, violations: [`Sanity Check execution failed: ${error.message}`], checkedAt: new Date().toISOString() };
    }
}

async function attemptProblemRepair(
    baseProblem: BaseProblem,
    validatedTrapData: TrapCluster['mergedTrapData'],
    violations: string[],
    attemptNumber: number,
    problemIndex?: number
): Promise<{ success: boolean; repairedProblem?: BaseProblem; repairedTrapData?: TrapCluster['mergedTrapData']; error?: string; }> {
    const violationsList = violations.map((v, i) => `${i + 1}. ${v}`).join('\n');

    const repairPrompt = `
你是物理问题修复专家。一个题目在防伪审查中发现了以下问题：

【检查失败的违规项】：
${violationsList}

【原始题目】：
${validatedTrapData.trapModifiedText}

【原始核心数据】：
${JSON.stringify(baseProblem.coreData, null, 2)}

【修复任务】（这是第 ${attemptNumber} 次修复尝试）：
修改题目文本或核心数据，使其通过防伪审查，保持教学意义和复杂度。

【输出格式】（纯 JSON）：
{
  "success": true或false,
  "repairedText": "修改后的完整题目文本",
  "reasonsForRepair": ["修改原因1"],
  "modifiedCoreData": { "原coreData修正版" },
  "errorDetails": "如果失败，说明无法修复的原因"
}
`;

    try {
        const content = problemIndex !== undefined
            ? await callLLMTracked(repairPrompt, { model: 'reasoning', temperature: 0.2 }, problemIndex)
            : await callLLM(repairPrompt, { model: 'reasoning', temperature: 0.2 });
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { success: false, error: "Failed to parse repair response JSON" };

        const parsed = JSON.parse(jsonMatch[0]);
        if (!parsed.success) return { success: false, error: parsed.errorDetails || "Problem repair failed" };

        return {
            success: true,
            repairedProblem: { ...baseProblem, coreData: parsed.modifiedCoreData || baseProblem.coreData },
            repairedTrapData: { ...validatedTrapData, trapModifiedText: parsed.repairedText || validatedTrapData.trapModifiedText }
        };
    } catch (error) {
        return { success: false, error: `Problem repair execution failed: ${error.message}` };
    }
}

export async function solveAndFormatProblem(
    baseProblem: BaseProblem,
    validatedTrapData: TrapCluster['mergedTrapData'],
    problemIndex?: number
): Promise<CombinedSolverFormatterResult> {
    const MAX_REPAIR_ATTEMPTS = 3;
    let repairAttempt = 0;
    let currentBaseProblem = baseProblem;
    let currentTrapData = validatedTrapData;

    let wasProblemRepaired = false;

    const hasTraps = currentTrapData.appliedTraps.length > 0;

    if (hasTraps) {
        while (repairAttempt < MAX_REPAIR_ATTEMPTS) {
            const sanityCheckResult = await performSanityCheck(currentBaseProblem, currentTrapData.trapModifiedText, problemIndex);

            if (sanityCheckResult.allChecksPass) break;

            if (repairAttempt < MAX_REPAIR_ATTEMPTS - 1) {
                const repairResult = await attemptProblemRepair(currentBaseProblem, currentTrapData, sanityCheckResult.violations, repairAttempt + 1, problemIndex);

                if (repairResult.success && repairResult.repairedProblem && repairResult.repairedTrapData) {
                    currentBaseProblem = repairResult.repairedProblem;
                    currentTrapData = repairResult.repairedTrapData;
                    wasProblemRepaired = true;
                    repairAttempt++;
                } else {
                    return { isValid: false, requiresMinimumSteps: false, hasUniqueAnswer: false, errorMessage: `Problem repair failed at attempt ${repairAttempt + 1}: ${repairResult.error}`, sanityCheckResult, repairAttempts: repairAttempt + 1, wasProblemRepaired: false };
                }
            } else {
                const violationsList = sanityCheckResult.violations.join("; ");
                return { isValid: false, requiresMinimumSteps: false, hasUniqueAnswer: false, errorMessage: `Sanity Check failed after ${MAX_REPAIR_ATTEMPTS} repair attempts: ${violationsList}`, sanityCheckResult, repairAttempts: MAX_REPAIR_ATTEMPTS, wasProblemRepaired };
            }
        }
    }

    const trapDescriptions = currentTrapData.trapDescriptions.map(desc => `- ${desc}`).join('\n');
    const minSteps = hasTraps ? 6 : 4;

    const prompt = hasTraps
        ? `
你是物理问题验证与教学专家。请尝试完整解决以下题目。

【带有陷阱的完整题目】：
${currentTrapData.trapModifiedText}

【真实核心已知数据】（仅供验证参考）：
${JSON.stringify(currentBaseProblem.coreData, null, 2)}

【题目设计的陷阱】：
${trapDescriptions}

【求解目标】：
${currentBaseProblem.requiredAnswer}

【极度重要的解题纪律】：
绝对禁止在解题步骤中提及或依赖【真实核心已知数据】，必须完全扮演只看到【带有陷阱的完整题目】的解题者。

【任务】：验证题目是否可解，是否答案唯一，是否至少需要 ${minSteps} 步推理。

【输出格式】（纯 JSON）：
{
  "isSolvable": true/false,
  "stepCount": 实际推理步数,
  "hasUniqueAnswer": true/false,
  "errorMessage": "如果不满足条件，说明原因",
  "formattedSolution": {
    "reasoningChain": [{"stepNumber": 1, "description": "详尽计算过程", "justification": "理论依据", "trapAvoidanceNote": "避开的陷阱（可选）"}],
    "finalAnswer": "最终答案（含数值和单位）",
    "keyInsights": ["关键考点1", "关键考点2"]
  }
}
`
        : `
你是物理问题验证与教学专家。请尝试完整解决以下题目。

【完整题目】：
${currentTrapData.trapModifiedText}

【核心已知数据】（仅供验证参考）：
${JSON.stringify(currentBaseProblem.coreData, null, 2)}

【求解目标】：
${currentBaseProblem.requiredAnswer}

【任务】：验证题目是否可解，是否答案唯一，是否至少需要 ${minSteps} 步推理。

【输出格式】（纯 JSON）：
{
  "isSolvable": true/false,
  "stepCount": 实际推理步数,
  "hasUniqueAnswer": true/false,
  "errorMessage": "如果不满足条件，说明原因",
  "formattedSolution": {
    "reasoningChain": [{"stepNumber": 1, "description": "详尽计算过程", "justification": "理论依据"}],
    "finalAnswer": "最终答案（含数值和单位）",
    "keyInsights": ["关键考点1"]
  }
}
`;

    try {
        const content = problemIndex !== undefined
            ? await callLLMTracked(prompt, { model: 'reasoning', systemPrompt: "你是顶级的物理专家。请验证并严格以 JSON 格式输出解题报告。" }, problemIndex)
            : await callLLM(prompt, { model: 'reasoning', systemPrompt: "你是顶级的物理专家。请验证并严格以 JSON 格式输出解题报告。" });
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return { isValid: false, requiresMinimumSteps: false, hasUniqueAnswer: false, errorMessage: 'Failed to parse solver response JSON', repairAttempts: repairAttempt, wasProblemRepaired };
        }

        const result = JSON.parse(jsonMatch[0]);
        const isValid = result.isSolvable && result.stepCount >= minSteps && result.hasUniqueAnswer;

        return {
            isValid,
            requiresMinimumSteps: result.stepCount >= minSteps,
            hasUniqueAnswer: result.hasUniqueAnswer,
            errorMessage: isValid ? undefined : result.errorMessage,
            formattedSolution: isValid ? {
                problemId: currentBaseProblem.problemId,
                reasoningChain: result.formattedSolution?.reasoningChain || [],
                finalAnswer: result.formattedSolution?.finalAnswer || 'No answer provided',
                keyInsights: result.formattedSolution?.keyInsights || [],
                standardSafeSolutionText: result.formattedSolution?.reasoningChain.map((step: any, i: number) => `[${i + 1}] ${step.description}`).join('\n')
            } : undefined,
            repairAttempts: repairAttempt,
            wasProblemRepaired
        };

    } catch (error) {
        console.error("Physics Solver Error:", error);
        return { isValid: false, requiresMinimumSteps: false, hasUniqueAnswer: false, errorMessage: `Solver/Formatter failed: ${error.message}`, repairAttempts: repairAttempt, wasProblemRepaired };
    }
}
