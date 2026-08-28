import type { FinalProblem, FormattedSolution, TrapCluster, TrapModification } from "../../types/multiNodeTypes";
import type { NormalizeResult } from "../subjects/math/normalizer";
import { getMathMinimumReasoningSteps } from "./node2-base-generator-math";

/**
 * Node 7: Final Output Assembler
 *
 * Combines all components into the final output format
 */

function formatReasoningStep(step: any): string {
    const description = String(step?.description || '').trim();
    return `[${step.stepNumber}] ${description}`;
}

function isOutlineOnlyReasoningStep(step: any): boolean {
    const description = String(step?.description || '').trim();
    return description.length < 35 || /^(验证|说明|计算|使用|应用|明确|构造)[^，。；:：]*[。.]?$/.test(description);
}

export function assembleFinalOutput(
    problem: TrapCluster['combinedProblem'],
    solution: FormattedSolution,
    mergedText: string,
    executionTimes: Record<string, number>,
    trapModifications?: TrapModification[],
    modelInfo?: string,
    normalizeResult?: NormalizeResult,
    retryHistory?: { node: number; reason: string }[]
): FinalProblem {
    // 确保所有必需字段都有安全的默认值
    const safeAppliedTraps = problem?.appliedTraps ?? [];

    // 从 trapModifications 中提取陷阱描述
    const trapDescriptions = trapModifications && trapModifications.length > 0
        ? trapModifications.map(m => m.trapDescription)
        : [];
    const structuralPerturbation = trapModifications?.find(m => m.agentId === 'math_structural_perturbation');
    const blueprint = problem.mathPerturbationBlueprint;
    const disciplineContext = problem.mathDisciplineContext;

    return {
        problemId: problem.problemId,
        subject: 'math',
        topic: problem.topic,
        difficulty: `难度: ${problem.expectedDifficulty}`,
        questionBody: problem.questionBody || '',
        givenData: problem.givenData || {},
        mergedProblemText: mergedText,
        solution: solution,
        finalAnswer: solution.finalAnswer,
        trapModifiedText: mergedText,  // Add this field for UI compatibility
        standardSafeSolution: solution.reasoningChain?.map(formatReasoningStep).join('\n\n') || '',
        metadata: {
            appliedTraps: Array.isArray(safeAppliedTraps) ? safeAppliedTraps : [],
            trapDescriptions: trapDescriptions,
            generatedAt: new Date().toISOString(),
            nodeExecutionTime: executionTimes,
            reviewResult: undefined,  // Will be populated after review
            modelInfo: modelInfo,
            perturbationType: structuralPerturbation?.perturbationType || blueprint?.perturbationType,
            disciplineKey: disciplineContext?.generationGuidance.disciplineKey,
            disciplineName: disciplineContext?.generationGuidance.name,
            difficultyLevel: disciplineContext?.generationGuidance.level,
            validationRules: disciplineContext?.validationRules,
            predictedFailureMode: structuralPerturbation?.invalidatedStandardMethod || blueprint?.targetWeakness,
            expectedWrongPath: structuralPerturbation?.expectedWrongPath || blueprint?.expectedWrongPath,
            divergenceStep: structuralPerturbation?.divergenceStep || blueprint?.divergenceStep,
            manualValidationChecklist: structuralPerturbation?.manualValidationChecklist || blueprint?.manualValidationChecklist,
            qualityLabel: "needs_rework",
            normalizeResult: normalizeResult ? { originalInput: normalizeResult.originalInput, matchedKey: normalizeResult.matchedKey, matchedName: normalizeResult.matchedPoint?.name, confidence: normalizeResult.confidence, message: normalizeResult.message } : undefined,
            tokenUsageByNode: undefined,
            retryNodeHistory: retryHistory ?? []
        }
    };
}

/**
 * Validate final output format
 */
export function validateFinalOutput(output: FinalProblem): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!output.questionBody || output.questionBody.length < 50) {
        errors.push('Question body too short');
    }

    if (!output.solution || !output.solution.reasoningChain) {
        errors.push('Solution missing');
    }

    // Parse difficulty from string like "难度: 4"
    const difficultyMatch = output.difficulty.match(/难度:\s*(\d+)/);
    const difficulty = difficultyMatch ? parseInt(difficultyMatch[1]) : 2;
    const minSteps = getMathMinimumReasoningSteps(difficulty);

    // 输出结果不含中文答案筛查
    const isChineseAnswer = /[\u4e00-\u9fa5]/.test(output.standardSafeSolution);
    if (!isChineseAnswer) {
        errors.push(`不接受非中文的答案`);
    }

    if (output.solution && output.solution.reasoningChain.length < minSteps) {
        errors.push(`Solution has fewer than ${minSteps} reasoning steps (got ${output.solution.reasoningChain.length})`);
    }

    if (output.solution?.reasoningChain?.some(isOutlineOnlyReasoningStep)) {
        errors.push('Solution contains outline-only reasoning steps; each step must include the actual derivation or calculation process');
    }

    const givenDataEmpty = !output.givenData || Object.keys(output.givenData).length === 0;
    const substantiveQuestionText = `${output.mergedProblemText || ''}\n${output.questionBody || ''}`.trim();
    const questionIsSubstantive = substantiveQuestionText.length >= 100;

    if (givenDataEmpty && !questionIsSubstantive) {
        errors.push('No given data and question body too short');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
