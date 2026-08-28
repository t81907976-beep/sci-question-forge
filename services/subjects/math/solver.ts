import type { FormattedSolution, TrapCluster, TrapModification } from "../../../types/multiNodeTypes";
import type { RetryContext } from "../../../types/multiNodeTypes";
import { cleanAndParseJSON } from "../../utils/jsonCleaner";
import { callMathLLM } from "./mathLlmTracker";
import type { MathTokenTrackerId } from "./tokenTracker";
import { getMathDifficultyLevel, getMathMinimumReasoningSteps } from "../../nodes/node2-base-generator-math";

export type MathSolverFailureType =
    | 'solver_failed'
    | 'unsolvable'
    | 'non_unique_answer'
    | 'insufficient_steps'
    | 'too_simple'
    | 'implicit_conditions'
    | 'not_self_consistent'
    | 'not_closed_form'
    | 'parameter_ambiguity'
    | 'bic_solvability_issue'
    | 'perturbation_invalid'
    | 'discipline_mismatch'
    | 'other';

export interface CombinedSolverFormatterResult {
    isValid: boolean;
    requiresMinimumSteps: boolean;
    hasUniqueAnswer: boolean;
    errorMessage?: string;
    failureType?: MathSolverFailureType;
    formattedSolution?: FormattedSolution;
}

type MathSolverRawValidation = {
    isSolvable?: boolean;
    stepCount?: number;
    hasUniqueAnswer?: boolean;
    hasImplicitConditions?: boolean;
    isSelfConsistent?: boolean;
    isNonTrivial?: boolean;
    hasClosedFormAnswer?: boolean;
    answerFormatIssue?: string;
    hasParameterAmbiguity?: boolean;
    parameterAmbiguityDetails?: string;
    requiresCaseAnalysis?: boolean;
    hasBICSolvabilityIssue?: boolean;
    bicIssueDetails?: string;
    perturbationRemainsValid?: boolean;
    expectedWrongPathIsNatural?: boolean;
    divergenceStepVerified?: boolean;
    perturbationIssueDetails?: string;
    errorMessage?: string;
};

type MathSolverFailureContext = {
    minSteps: number;
    hasStructuralPerturbation: boolean;
    requiresRigorousProof: boolean;
    matchesDisciplineLevel: boolean;
};

export function classifyMathSolverFailure(
    result: MathSolverRawValidation,
    context: MathSolverFailureContext
): { isValid: boolean; failureType?: MathSolverFailureType; errorReason?: string } {
    const stepCount = Number(result.stepCount || 0);
    const hasImplicitConditions = result.hasImplicitConditions === true;
    const isSelfConsistent = result.isSelfConsistent !== false;
    const isNonTrivial = result.isNonTrivial !== false;
    const hasClosedFormAnswer = result.hasClosedFormAnswer !== false;
    const hasParameterAmbiguity = result.hasParameterAmbiguity === true;
    const requiresCaseAnalysis = result.requiresCaseAnalysis === true;
    const hasBICSolvabilityIssue = result.hasBICSolvabilityIssue === true;
    const perturbationRemainsValid = !context.hasStructuralPerturbation || result.perturbationRemainsValid === true;
    const expectedWrongPathIsNatural = !context.hasStructuralPerturbation || result.expectedWrongPathIsNatural === true;
    const divergenceStepVerified = !context.hasStructuralPerturbation || result.divergenceStepVerified === true;

    const isValid = result.isSolvable === true &&
        stepCount >= context.minSteps &&
        result.hasUniqueAnswer === true &&
        !hasImplicitConditions &&
        isSelfConsistent &&
        isNonTrivial &&
        hasClosedFormAnswer &&
        (!hasParameterAmbiguity || requiresCaseAnalysis) &&
        !hasBICSolvabilityIssue &&
        perturbationRemainsValid &&
        expectedWrongPathIsNatural &&
        divergenceStepVerified &&
        (!context.requiresRigorousProof || context.matchesDisciplineLevel);

    if (isValid) {
        return { isValid: true };
    }

    if (!result.isSolvable) return { isValid: false, failureType: 'unsolvable', errorReason: '题目无解' };
    if (stepCount < context.minSteps) return { isValid: false, failureType: 'insufficient_steps', errorReason: `推理步数不足（需要至少${context.minSteps}步，实际${stepCount}步）` };
    if (result.hasUniqueAnswer !== true) return { isValid: false, failureType: 'non_unique_answer', errorReason: '答案不唯一' };
    if (hasImplicitConditions) return { isValid: false, failureType: 'implicit_conditions', errorReason: '题目存在隐含条件/分支选择' };
    if (!isSelfConsistent) return { isValid: false, failureType: 'not_self_consistent', errorReason: '题目不自洽' };
    if (!isNonTrivial) return { isValid: false, failureType: 'too_simple', errorReason: '题目过于简单/过于显而易见' };
    if (!hasClosedFormAnswer) return { isValid: false, failureType: 'not_closed_form', errorReason: `最终答案不是闭式形式：${result.answerFormatIssue || '仅给出级数形式或需要进一步求解'}` };
    if (hasParameterAmbiguity && !requiresCaseAnalysis) return { isValid: false, failureType: 'parameter_ambiguity', errorReason: `题目存在参数歧义但未分情况讨论：${result.parameterAmbiguityDetails || ''}` };
    if (hasBICSolvabilityIssue) return { isValid: false, failureType: 'bic_solvability_issue', errorReason: `边界/初值条件可解性问题：${result.bicIssueDetails || ''}` };
    if (!perturbationRemainsValid) return { isValid: false, failureType: 'perturbation_invalid', errorReason: `结构扰动后题目无效：${result.perturbationIssueDetails || ''}` };
    if (!expectedWrongPathIsNatural) return { isValid: false, failureType: 'perturbation_invalid', errorReason: `预期错误路径不自然：${result.perturbationIssueDetails || ''}` };
    if (!divergenceStepVerified) return { isValid: false, failureType: 'perturbation_invalid', errorReason: `结构扰动分叉点不成立：${result.perturbationIssueDetails || ''}` };
    if (context.requiresRigorousProof && !context.matchesDisciplineLevel) return { isValid: false, failureType: 'discipline_mismatch', errorReason: '题目不符合当前 discipline 层级或边界卡要求' };

    return { isValid: false, failureType: 'other', errorReason: result.errorMessage };
}

/**
 * Node 5: Solver & Formatter (Combined)
 *
 * Solves the problem internally to verify solvability, step count, and answer uniqueness.
 * If valid, it IMMEDIATELY formats the solution to avoid a second LLM reasoning call.
 *
 * Validation includes:
 * 1. Uniqueness: Answer must be unique or have explicit case analysis
 * 2. Solvability: Boundary/initial conditions must be compatible
 * 3. Closed-form: Final answer must be explicit (not just series form)
 */

export async function solveAndFormatProblem(
    problem: TrapCluster['combinedProblem'],
    appliedTraps: TrapModification[],
    problemIndex: number,
    tokenTrackerId: MathTokenTrackerId,
    retryContext?: RetryContext | null
): Promise<CombinedSolverFormatterResult> {
    // 现在的陷阱是通过修改条件来增加难度，而不是误导
    const trapDescriptions = appliedTraps.map(t =>
        `- ${t.trapDescription}`
    ).join('\n');
    const structuralPerturbation = appliedTraps.find(t => t.agentId === 'math_structural_perturbation');

    const difficulty = problem.expectedDifficulty || 2;
    const difficultyLevel = getMathDifficultyLevel(difficulty);
    const minSteps = getMathMinimumReasoningSteps(difficulty);
    const requiresRigorousProof = difficultyLevel === 'competition';

    // 使用 mergedProblemText（已经融合了题干和数据的完整版本）进行求解验证
    // 而不是原始的 questionBody
    const solverRetryGuidance = retryContext ? `
【重试指导 — 仅重新求解与格式化，不得修改题目】

上次失败类别：${retryContext.failureCategory}
上次失败原因：${retryContext.failureReason}
${retryContext.retryHint?.solverInstruction ? `审查器给出的求解核查建议：${retryContext.retryHint.solverInstruction}` : ''}

本次重试要求：
- 不得改变题目条件、题干、给定数据或求解目标。
- 必须重新逐步验证计算、唯一性、闭式答案和分类讨论完整性。
- 如果发现题目本身无解、条件矛盾或答案不唯一，必须返回失败，不得擅自修题。
- 如果只是上次解答计算错误或推理不完整，应给出新的完整 reasoningChain。
` : '';

    const prompt = `
你是数学问题验证与教学专家。请按当前 discipline 层级和边界卡要求完整解决以下题目，并在最后给出与题目对应的完整答案。

【完整题目】（已经包含题干和所有数据）：
${problem.mergedProblemText || problem.questionBody}

【题目增强说明】（如果Trap修改了原题条件）：
${trapDescriptions || '无（题目未做修改）'}

【数学结构扰动记录】：
${structuralPerturbation ? JSON.stringify({
        perturbationType: structuralPerturbation.perturbationType,
        invalidatedStandardMethod: structuralPerturbation.invalidatedStandardMethod,
        expectedWrongPath: structuralPerturbation.expectedWrongPath,
        divergenceStep: structuralPerturbation.divergenceStep,
        manualValidationChecklist: structuralPerturbation.manualValidationChecklist
    }, null, 2) : '无'}

【已知数据】（仅作为参考，如果题目中已包含可以忽略）：
${JSON.stringify(problem.givenData, null, 2)}

【求解目标】：
${problem.requiredAnswer}

【题目难度等级】：${difficultyLevel === 'competition' ? '竞赛级' : difficultyLevel === 'advanced' ? '高级' : difficultyLevel === 'intermediate' ? '中级' : '基础'}（${difficultyLevel}，难度值 ${difficulty}）
【最低推理步数要求】：${minSteps} 步

${solverRetryGuidance}

${difficultyLevel === 'competition' ? `
【竞赛级特殊要求】：
1. 题目是否使用了高级数学理论？（如代数几何、表示论、解析数论、代数拓扑等）
2. 证明是否需要构造性思维？（构造反例、构造序列、构造泛函）
3. 是否涉及跨学科综合？（如数论+代数几何，拓扑+几何）
4. 推理是否足够严格和深刻？（不是简单套用公式）
5. 答案/结论是否具有一般性或有理论意义？
` : `
【解题指导】：
1. 如涉及函数方程，考虑是否需要凸性/单调性来确定唯一解
2. 如涉及不等式，注意等号成立条件的讨论
3. 如涉及分类讨论，确保覆盖所有情况
4. 注意定义域和值域的限制
`}

【关键验证项】（必须逐项检查）：
1. **唯一性验证**：答案是否唯一？是否存在多解可能？是否有分支选择未说明？
   【重要】如果题目可能有多解（如参数方程有多个解、多个可行解等），必须标记 hasUniqueAnswer=false
2. **自洽性验证**：题面条件是否充分？是否有隐含条件未声明？是否有归一化/路径选择依赖？
   【重要】如果题目条件互相矛盾（如约束条件不可能同时满足），必须标记 isSelfConsistent=false
3. **可解性验证**：题目条件是否矛盾？是否有充分必要条件缺失？
4. **难度验证**：解题是否需要至少两种不同工具？是否有非平凡中间结构？
5. **反模板验证**：解题方法是否非显而易见？是否不能直接套用常见公式？
6. **【新增】闭式答案验证**：最终答案必须是以下形式之一：
   - 具体数值（如 3.14159, 2√2）
   - 闭式表达式（如 $u(x,t) = e^{-kt}\sin x$）
   - 带有通项的级数（如 $\sum_{n=1}^{\infty} \frac{\sin(nx)}{n^2}$，必须给出通项公式）
   - 定积分表达式（如 $\int_0^1 x^2 dx$）
   - 明确的函数展开（如泰勒展开的前N项+通项公式）

   **禁止**出现以下形式：
   - 仅给出级数形式但无闭式结果（如 "解为 $u = \sum a_n \sin(nx)$，其中系数待定"）
   - 仅含省略号的加法列表（如 "1+2+3+..." 或 "解为若干项之和，详见上文"）
   - 未定义结构的数值拼接（如 "答案是 [1,2,3] 这种无明确数学意义的结构"）
   - 需要进一步求解的隐式方程（如 "解满足 f(x) = 0" 而未给出 x 的具体值）
   - 互补误差函数erfc()等特殊函数

7. **【新增】参数歧义分情况验证**：如果题目中存在以下情况，必须分情况讨论：
   - 参数满足特定方程但有多个解（如 a²=1 → a=1 或 a=-1）
   - 积分路径/分支选择不唯一
   - 边界条件有多种等效表述
   - 如果存在上述歧义，检查题目是否明确说明了如何选择，如果未说明，则必须要求分情况讨论

8. **【新增】边界/初值可解性验证**（针对PDE/ODE问题）：
   - 边界条件之间是否兼容？（如 Dirichlet + Neumann 不能同时在同一点指定）
   - 初值与边界条件是否匹配？（如热传导方程初值在无穷远处需要衰减条件）
   - 分离变量法中边界条件是否与特征函数匹配？（如圆柱问题用球坐标分离变量却用矩形边界）
   - 如果存在不兼容，必须标记为"不可解"并说明原因

9. **【新增】结构扰动验证**：
   - 如果存在数学结构扰动记录，必须检查扰动后题目仍然条件充分、唯一可解。
   - 必须判断 expectedWrongPath 是否是一条自然但错误的熟路，而不是由题目歧义、缺条件或多解造成。
   - 必须验证 divergenceStep 是否真实存在：正确路线和预期错误路线确实在该步骤分叉。
   - 必须说明该扰动为什么能暴露预期结构弱点，且不会让题目变成歧义题或多解题。

【任务】：
1. 验证题目是否可解、答案唯一、得到最终完整答案时（不包含验证答案正确性）至少需要 ${minSteps} 步推理
2. 验证题目无隐含分支、无未声明的归一化条件、答案唯一可确定
3. 验证题目难度来自核心数学结构，而非噪声长度
4. **【新增】验证最终答案是闭式形式**，如果不是，必须拒绝并说明原因
5. **【新增】验证参数歧义是否需要分情况讨论**
6. **【新增】验证边界/初值条件是否可解且自洽**
${difficultyLevel === 'competition' ? '7. 验证题目是否真正符合 competition 层级和边界卡要求（需要深刻结构而非技巧性计算）' : ''}
8. 如果满足上述所有条件，生成详尽解答；否则只返回失败原因

【解答步骤输出要求】：
- formattedSolution.reasoningChain[*].description 是最终展示给用户的完整解题步骤，必须自包含必要推导、代入、等价变形、枚举细节和中间结论。
- 禁止在 description 中只写“验证……”“说明……”“计算……”这类提纲式短句；如果需要验证，必须写出验证过程。
- justification 只用于内部说明该步骤为什么成立，不得承载任何用户理解解题过程所必需的推导内容。
- 如果某一步用到定理，description 中写“使用某定理并代入得到……”，不要把代入过程放到 justification。

【输出格式】（必须为纯粹的 JSON）：
{
  "isSolvable": true/false,
  "stepCount": 实际推理步数,
  "hasUniqueAnswer": true/false,
  "hasImplicitConditions": true/false - 是否存在隐含条件/分支选择,
  "isSelfConsistent": true/false - 题面是否自洽,
  "isNonTrivial": true/false - 解题方法是否非显而易见,
  // 【新增】闭式答案验证
  "hasClosedFormAnswer": true/false - 最终答案是否为闭式形式,
  "answerFormatIssue": "如果不是闭式，说明具体问题（如：仅级数形式无闭式结果、需要进一步求解的隐式方程等）",
  // 【新增】参数歧义验证
  "hasParameterAmbiguity": true/false - 是否存在参数歧义需要分情况讨论,
  "parameterAmbiguityDetails": "如果存在参数歧义，说明是哪个参数、可能的取值、以及是否已分情况讨论",
  "requiresCaseAnalysis": true/false - 是否需要分情况讨论,
  // 【新增】边界/初值可解性验证（针对PDE/ODE）
  "hasBICSolvabilityIssue": true/false - 边界/初值条件是否有可解性问题,
  "bicIssueDetails": "如果有问题，说明具体是什么（如边界条件不兼容、分离变量法与边界不匹配等）",
  "perturbationRemainsValid": true/false - 扰动后题目是否仍然有效且唯一可解,
  "expectedWrongPathIsNatural": true/false - 预期错误路径是否自然但错误,
  "divergenceStepVerified": true/false - 分叉点是否真实存在且可人工检查,
  "distractorStrictlyDiscardable": true,
  "perturbationIssueDetails": "如果结构扰动验证失败，说明具体原因",
  "matchesDisciplineLevel": ${difficultyLevel === 'competition' ? 'true/false - 题目是否真正符合 competition 层级和边界卡要求' : 'true'},
  "errorMessage": "如果不满足条件，说明具体原因",

  // 以下字段仅在 isSolvable=true 且 stepCount>=${minSteps} 且 hasUniqueAnswer=true 且 hasImplicitConditions=false 且 isSelfConsistent=true 且 hasClosedFormAnswer=true 且 (hasParameterAmbiguity=false OR requiresCaseAnalysis=true) 且 hasBICSolvabilityIssue=false 时提供
  "formattedSolution": {
    "reasoningChain": [
      {
        "stepNumber": 1,
        "description": "完整解题步骤（包含必要推导、代入、计算或验证过程；不得只是提纲）",
        "justification": "内部理论依据（不要放用户必须看到的解题过程）",
        "trapAvoidanceNote": "如果这一步避开了题目的某个陷阱，说明如何避开（可选）"
      }
    ],
    "finalAnswer": "最终答案（含精确数值和单位，必须是闭式形式）",
    "keyInsights": ["关键考点归纳1 - 使用的深刻定理", "关键考点归纳2"],
    // 【新增】分情况讨论记录
    "caseAnalysis": ["如果需要分情况讨论，列出每种情况的结果"]
  }
}
`;

    try {
        // Retry mechanism for API connection errors
        const maxRetries = 3;
        let lastError: Error | null = null;
        let content = '';

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                content = await callMathLLM(`node5_${problemIndex}`, tokenTrackerId, prompt, {
                    model: 'reasoning',
                    systemPrompt: "你是顶级的数学专家。请验证并严格以 JSON 格式输出解题报告。",
                    reasoning: { effort: 'xhigh', summary: 'auto' }
                });
                break;
            } catch (error: any) {
                lastError = error;
                console.warn(`Node 5 API attempt ${attempt} failed: ${error.message}`);
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        }

        if (!content) {
            throw lastError || new Error('Failed to get API response after retries');
        }

        // 使用 cleanAndParseJSON 来处理可能包含未转义反斜杠等问题的 JSON
        const result = cleanAndParseJSON(content);

        const matchesDisciplineLevel = difficultyLevel !== 'competition' || result.matchesDisciplineLevel === true || result.isGraduateLevel === true;
        const hasStructuralPerturbation = Boolean(structuralPerturbation);
        const solverFailure = classifyMathSolverFailure(result, {
            minSteps,
            hasStructuralPerturbation,
            requiresRigorousProof,
            matchesDisciplineLevel
        });

        return {
            isValid: solverFailure.isValid,
            requiresMinimumSteps: result.stepCount >= minSteps,
            hasUniqueAnswer: result.hasUniqueAnswer,
            failureType: solverFailure.failureType,
            errorMessage: solverFailure.isValid ? undefined : (solverFailure.errorReason || result.errorMessage),
            formattedSolution: solverFailure.isValid ? {
                problemId: problem.problemId,
                reasoningChain: result.formattedSolution?.reasoningChain || [],
                finalAnswer: result.formattedSolution?.finalAnswer || '未提供答案',
                keyInsights: result.formattedSolution?.keyInsights || [],
                caseAnalysis: result.formattedSolution?.caseAnalysis || []
            } : undefined
        };

    } catch (error: any) {
        console.error("Node 5 Combined Error:", error);
        return {
            isValid: false,
            requiresMinimumSteps: false,
            hasUniqueAnswer: false,
            failureType: 'solver_failed',
            errorMessage: `Solver/Formatter failed: ${error.message}`
        };
    }
}
