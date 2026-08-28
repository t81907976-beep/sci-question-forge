import { callLLM } from "../../llmClient";
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
    /** 修复后的最终题面与数据，供 Node 7 组装时替换原始版本 */
    finalBaseProblem?: BaseProblem;
    finalTrapData?: TrapCluster['mergedTrapData'];
}

export interface SanityCheckResult {
    allChecksPass: boolean;
    violations: string[];
    checkedAt: string;
}

/**
 * Finance: Solver & Formatter (Standard Solution with Trap Avoidance)
 */

async function performSanityCheck(
    baseProblem: BaseProblem,
    modifiedText: string
): Promise<SanityCheckResult> {
    const checkPrompt = `
你是量化金融领域的博士后级别审核专家。在求解以下题目前，必须独立执行防伪审查（Sanity Check），检查题目本身的金融合理性与自洽性。

【被审查的完整题目（陷阱注入后）】：
${modifiedText}

【原始白板题（陷阱注入前）】：
${baseProblem.originalProblemText}

【题目的核心已知数据】：
${JSON.stringify(baseProblem.coreData, null, 2)}
${baseProblem.marketConventions ? `\n【题目的市场约定】：\n${JSON.stringify(baseProblem.marketConventions, null, 2)}` : ''}

【防伪审查清单】：
0. **陷阱注入差异审查（最重要）**：逐句对比差异，检查是否引入了导致无法唯一求解的真矛盾（合法的迷惑条件不算违规）
1. **市场约定合法性**：折现公式与复利约定是否一致（连续复利 e^(−rT) vs 年复利 (1+r)^(−T)）；天数惯例是否声明
2. **无套利边界**：期权价格是否满足 max(S₀−K·e^(−rT),0) ≤ C ≤ S₀；美式 ≥ 欧式；看跌看涨平价是否成立
3. **参数可实现性**：σ > 0 且 ≤ 200%；概率/回收率/信度因子 ∈ [0,1]；ρ ∈ [−1,1]；λ > 0；永续增长率 g < 折现率
4. **口径一致性**：FCFF↔WACC、FCFE↔k_e、名义↔名义、实际↔实际；风险中性测度下漂移必须为 r（或 r−q）
5. **数据完整性**：求解目标所需的每一个参数是否都能从题面读到
6. **统计与会计前提**：重尾分布的矩是否存在；检验原假设方向是否正确；资产 = 负债 + 所有者权益是否成立

【输出格式】（严格 JSON，不含 markdown）：
{
  "allChecksPass": true或false,
  "violations": ["如果失败，列举每一个违规项"],
  "checksPerformed": {
    "trapDiffCheck": "通过/失败/无法检查",
    "conventionValidity": "通过/失败/无法检查",
    "noArbitrageBounds": "通过/失败/无法检查",
    "parameterFeasibility": "通过/失败/无法检查",
    "measureAndScopeConsistency": "通过/失败/无法检查",
    "dataCompleteness": "通过/失败/无法检查"
  }
}
`;

    try {
        const content = (await callLLM(checkPrompt, { model: 'reasoning', temperature: 0.2 }));
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
    attemptNumber: number
): Promise<{ success: boolean; repairedProblem?: BaseProblem; repairedTrapData?: TrapCluster['mergedTrapData']; error?: string; }> {
    const violationsList = violations.map((v, i) => `${i + 1}. ${v}`).join('\n');

    const repairPrompt = `
你是量化金融题目修复专家。一个题目在防伪审查中发现了以下问题：

【检查失败的违规项】：
${violationsList}

【原始题目】：
${validatedTrapData.trapModifiedText}

【原始核心数据】：
${JSON.stringify(baseProblem.coreData, null, 2)}

【修复任务】（这是第 ${attemptNumber} 次修复尝试）：
修改题目文本或核心数据，使其通过防伪审查，同时保持考核深度与陷阱的迷惑性。
修复必须遵守：无套利边界、口径一致性（现金流与折现率配对）、参数可实现区间、会计恒等式。
修改任何数值时必须同步更新题干文本中出现的对应数字，禁止出现题面与 coreData 不一致。

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
        const content = (await callLLM(repairPrompt, { model: 'reasoning', temperature: 0.2 }));
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
    validatedTrapData: TrapCluster['mergedTrapData']
): Promise<CombinedSolverFormatterResult> {
    const MAX_REPAIR_ATTEMPTS = 3;
    let repairAttempt = 0;
    let currentBaseProblem = baseProblem;
    let currentTrapData = validatedTrapData;
    let lastSanityCheckResult: SanityCheckResult | null = null;
    let wasProblemRepaired = false;

    const hasTraps = currentTrapData.appliedTraps.length > 0;

    if (hasTraps) {
        while (repairAttempt < MAX_REPAIR_ATTEMPTS) {
            const sanityCheckResult = await performSanityCheck(currentBaseProblem, currentTrapData.trapModifiedText);
            lastSanityCheckResult = sanityCheckResult;

            if (sanityCheckResult.allChecksPass) break;

            if (repairAttempt < MAX_REPAIR_ATTEMPTS - 1) {
                const repairResult = await attemptProblemRepair(currentBaseProblem, currentTrapData, sanityCheckResult.violations, repairAttempt + 1);

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
你是量化金融领域的博士后级别专家，负责题目验证与教学解答。请尝试完整解决以下题目。

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

【解答必须显式完成的判定】：
1. 先判定现金流/收益口径与所处测度，再选择匹配的折现率或漂移
2. 显式声明复利约定与天数惯例，必要时先做等价换算再代入
3. 显式说明为什么排除了题面提供的干扰参数

【任务】：验证题目是否可解，是否答案唯一，是否至少需要 ${minSteps} 步推理。

【输出格式】（纯 JSON）：
{
  "isSolvable": true/false,
  "stepCount": 实际推理步数,
  "hasUniqueAnswer": true/false,
  "errorMessage": "如果不满足条件，说明原因",
  "formattedSolution": {
    "reasoningChain": [{"stepNumber": 1, "description": "详尽计算过程（含公式与代入数值）", "justification": "金融理论依据", "trapAvoidanceNote": "避开的陷阱（可选）"}],
    "finalAnswer": "最终答案（含数值和单位）",
    "keyInsights": ["关键考点1", "关键考点2"]
  }
}
`
        : `
你是量化金融领域的博士后级别专家，负责题目验证与教学解答。请尝试完整解决以下题目。

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
    "reasoningChain": [{"stepNumber": 1, "description": "详尽计算过程（含公式与代入数值）", "justification": "金融理论依据"}],
    "finalAnswer": "最终答案（含数值和单位）",
    "keyInsights": ["关键考点1"]
  }
}
`;

    try {
        const content = (await callLLM(prompt, {
            model: 'reasoning',
            systemPrompt: "你是顶级的量化金融专家。请验证并严格以 JSON 格式输出解题报告。"
        }));
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
                standardSafeSolutionText: result.formattedSolution?.reasoningChain?.map((step: any, i: number) => `[${i + 1}] ${step.description}`).join('\n')
            } : undefined,
            sanityCheckResult: lastSanityCheckResult ?? undefined,
            repairAttempts: repairAttempt,
            wasProblemRepaired,
            finalBaseProblem: currentBaseProblem,
            finalTrapData: currentTrapData
        };

    } catch (error) {
        console.error("Finance Solver Error:", error);
        return { isValid: false, requiresMinimumSteps: false, hasUniqueAnswer: false, errorMessage: `Solver/Formatter failed: ${error.message}`, repairAttempts: repairAttempt, wasProblemRepaired };
    }
}
