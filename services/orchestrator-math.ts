import {
    UserInput,
    MultiNodeStage,
    BaseProblem,
    FinalProblem,
    TrapModification
} from "../types/multiNodeTypes";
import type { RetryContext } from "../types/multiNodeTypes";
import { validateUserInput } from "./nodes/node0-input";
import { getTextbookConstraints } from "./nodes/node1-rag";
import { generateBaseProblem } from "./nodes/node2-base-generator-math";
import { applyMathPerturbation } from "./nodes/node3-traps/trap-master-math";
import { validateAndMergeTraps } from "./nodes/node4-validator-math";
import { solveAndFormatProblem, CombinedSolverFormatterResult } from "./subjects/math/solver";
import { fuseProblemText } from "./subjects/math/text-fusion";
import { assembleFinalOutput, validateFinalOutput } from "./nodes/node7-output-math";
import { normalizeKnowledgePoint } from "./subjects/math/normalizer";
import { reviewMathQuestion } from "./subjects/math/reviewer";
import { clearMathTokenTracker, getMathTokenUsage, resetMathTokenTracker } from "./subjects/math/tokenTracker";
import { createMathProblemExecutionTimes, recordMathNodeExecutionTime } from "./subjects/math/executionTiming";
import { formatMathReviewerFailureReason } from "./subjects/math/sheetsFormatting";
import { canScheduleReviewerRetry, getRetryableReviewerNode } from "./subjects/math/reviewerRouting";
import { getModelInfo } from "./llmClient";

/**
 * Main Orchestrator for Multi-Node Problem Generation
 *
 * Coordinates the execution of all nodes with retry logic
 * Modified: Node 3 (Trap Master) has been removed - Node 2 proceeds directly to Node 4
 */

import type { OrchestratorCallbacks } from './orchestrator';

const MAX_WORKFLOW_ATTEMPTS = 3;

type RetryableMathNode = 2 | 5 | 6 | 7;

const MAX_ROUTE_RETRIES: Record<RetryableMathNode, number> = {
    2: 3,
    5: 1,
    6: 1,
    7: 1
};

function classifyOutputValidationRetryNode(errors: string[]): RetryableMathNode {
    const text = errors.join('\n');

    if (/Solution missing|fewer than|非中文|non-Chinese|答案/.test(text)) {
        return 5;
    }

    if (/Question body too short|No given data and question body too short/.test(text)) {
        return 2;
    }

    return 7;
}

export async function runMathMultiNodeWorkflow(
    rawInput: Partial<UserInput>,
    callbacks?: OrchestratorCallbacks
): Promise<FinalProblem[]> {
    const executionTimes: Record<string, number> = {};
    const finalProblems: FinalProblem[] = [];

    try {
        // ========== Node 0: Input Validation ==========
        callbacks?.onStageChange?.(MultiNodeStage.NODE_0_INPUT, 0);
        const startNode0 = Date.now();
        const input = validateUserInput(rawInput);
        executionTimes['node0'] = Date.now() - startNode0;

        // ========== Node 1: RAG Constraints ==========
        callbacks?.onStageChange?.(MultiNodeStage.NODE_1_RAG, 0);
        const startNode1 = Date.now();
        const constraints = getTextbookConstraints(input);
        executionTimes['node1'] = Date.now() - startNode1;

// ========== Knowledge Point Normalization (for Node 2) ==========
        const normalizeResult = normalizeKnowledgePoint(input.topic);

        // 打印归一化匹配结果（更详细的调试信息）
        if (normalizeResult.success) {
            console.log(`[主题归一化] ✅ 匹配成功`);
            console.log(`   └─ 用户输入: ${input.topic}`);
            console.log(`   └─ 匹配到知识点: ${normalizeResult.matchedPoint?.name}`);
            console.log(`   └─ 置信度: ${(normalizeResult.confidence * 100).toFixed(1)}%`);
            if (normalizeResult.message) {
                console.log(`   └─ 匹配方式: ${normalizeResult.message}`);
            }
        } else {
            // 匹配失败，不再降级使用原输入，而是抛出错误让用户重新输入
            const errorMsg = `主题 "${input.topic}" 未匹配到知识点库（置信度: ${(normalizeResult.confidence * 100).toFixed(1)}%）。请使用更精确的关键词，如 "导数"、"积分"、"微分方程"、"平面几何"、"概率论" 等。`;
            console.error(`[主题归一化] ❌ 匹配失败 - ${errorMsg}`);
            throw new Error(errorMsg);
        }

        // Setup concurrency control
        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(50); // Effectively unlimited for typical usage (≤50 problems)

        const generateSingleProblem = async (i: number): Promise<FinalProblem | null> => {
            callbacks?.onProgress?.(i, input.problemCount);
            const tokenTrackerId = `math-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}-${i}`;
            const problemExecutionTimes = createMathProblemExecutionTimes(executionTimes);
            resetMathTokenTracker(tokenTrackerId);

            console.log(`\n========== 开始生成第 ${i + 1}/${input.problemCount} 道题 ==========`);
            console.log(`[配置] 主题: ${input.topic}, 难度: ${input.trapCount}, 查表: ${input.allowTableLookup ? '允许' : '禁止'}`);

            let validProblem: FinalProblem | null = null;
            let retryCount = 0;
            const retryNodeHistory: { node: number; reason: string }[] = [];

            let node2Result: BaseProblem | null = null;
            let node3Result: TrapModification[] | null = null;
            let node4Result: ReturnType<typeof validateAndMergeTraps> | null = null;
            let node5Result: CombinedSolverFormatterResult | null = null;
            let node6Result: string | null = null;
            let lastFailureReason: string | null = null;
            let retryContext: RetryContext | null = null;
            let nextStartNode: RetryableMathNode = 2;
            const routeRetryCounts: Record<RetryableMathNode, number> = {
                2: 0,
                5: 0,
                6: 0,
                7: 0
            };

            const consumeNextStartNode = (): RetryableMathNode => nextStartNode;

            const scheduleRetry = (
                retryFromNode: RetryableMathNode,
                failureReason: string,
                failureCategory: string,
                retryHint?: RetryContext['retryHint']
            ): boolean => {
                if (retryCount + 1 >= MAX_WORKFLOW_ATTEMPTS) {
                    console.warn(`[智能重试] 已无剩余尝试次数，停止重试: ${failureReason}`);
                    validProblem = null;
                    retryCount = MAX_WORKFLOW_ATTEMPTS;
                    return false;
                }

                if (routeRetryCounts[retryFromNode] >= MAX_ROUTE_RETRIES[retryFromNode]) {
                    console.warn(`[智能重试] Node ${retryFromNode} 路由重试次数已达上限，停止重试: ${failureReason}`);
                    validProblem = null;
                    retryCount = MAX_WORKFLOW_ATTEMPTS;
                    return false;
                }

                routeRetryCounts[retryFromNode] += 1;
                retryNodeHistory.push({ node: retryFromNode, reason: failureCategory });
                retryCount += 1;
                nextStartNode = retryFromNode;
                lastFailureReason = failureCategory;
                retryContext = {
                    failureReason,
                    failureCategory,
                    previousQuestionHead: node2Result?.questionBody?.slice(0, 150) ?? '',
                    retryHint,
                    retryFromNode
                };

                validProblem = null;

                if (retryFromNode === 2) {
                    node2Result = null;
                    node3Result = null;
                    node4Result = null;
                    node5Result = null;
                    node6Result = null;
                } else if (retryFromNode === 5) {
                    node5Result = null;
                } else if (retryFromNode === 6) {
                    node6Result = null;
                }

                console.log(`[智能重试] 下次从 Node ${retryFromNode} 开始: ${failureCategory} - ${failureReason}`);
                return true;
            };

            while (!validProblem && retryCount < MAX_WORKFLOW_ATTEMPTS) {
                try {
                    const startNode = consumeNextStartNode();
                    const isNode2Retry = startNode === 2;
                    const isNode5Retry = startNode === 5;
                    const isNode6Retry = startNode === 6;
                    nextStartNode = 2;

                    if (retryCount > 0) {
                        console.log(`[智能重试] 从 Node ${startNode} 开始重试 (原因: ${lastFailureReason || '未知'})`);
                    }

                    // ========== Node 2: Base Problem Generation ==========
                    if (isNode2Retry || !node2Result) {
                        callbacks?.onStageChange?.(MultiNodeStage.NODE_2_BASE_GEN, i);
                        const startNode2 = Date.now();
                        node2Result = await generateBaseProblem(
                            input,
                            constraints,
                            normalizeResult,
                            i + 1,
                            i,
                            tokenTrackerId,
                            isNode2Retry ? retryContext : null
                        );
                        recordMathNodeExecutionTime(problemExecutionTimes, 2, Date.now() - startNode2);
                    }
                    const baseProblem: BaseProblem = node2Result!;

                    // ========== Node 3: Math Structural Perturbation ==========
                    if (isNode2Retry || !node3Result) {
                        callbacks?.onStageChange?.(MultiNodeStage.NODE_3_TRAPS, i);
                        const startNode3 = Date.now();
                        node3Result = await applyMathPerturbation(baseProblem, i, tokenTrackerId);
                        recordMathNodeExecutionTime(problemExecutionTimes, 3, Date.now() - startNode3);
                    }
                    const trapModifications: TrapModification[] = node3Result;

                    if (isNode2Retry || !node4Result) {
                        callbacks?.onStageChange?.(MultiNodeStage.NODE_4_VALIDATION, i);
                        const startNode4 = Date.now();
                        node4Result = validateAndMergeTraps(baseProblem, trapModifications);
                        recordMathNodeExecutionTime(problemExecutionTimes, 4, Date.now() - startNode4);
                    }
                    const validationResult: ReturnType<typeof validateAndMergeTraps> = node4Result!;

                    if (!validationResult.isValid) {
                        console.warn(`Validation failed (attempt ${retryCount + 1}):`, validationResult.conflicts, validationResult.physicalConstraintsViolated);
                        scheduleRetry(
                            2,
                            validationResult.conflicts.concat(validationResult.physicalConstraintsViolated).join('; ') || 'Node4 validation failed',
                            'NODE_4_VALIDATION_FAILED'
                        );
                        continue;
                    }

                    // ========== Node 5 & 6: Internal Solver & Formatter (Combined) ==========
                    if (isNode2Retry || isNode5Retry || !node5Result) {
                        callbacks?.onStageChange?.(MultiNodeStage.NODE_5_SOLVING, i);
                        const startNode5 = Date.now();
                        node5Result = await solveAndFormatProblem(
                            validationResult.mergedProblem!,
                            trapModifications,
                            i,
                            tokenTrackerId,
                            isNode5Retry ? retryContext : null
                        );
                        recordMathNodeExecutionTime(problemExecutionTimes, 5, Date.now() - startNode5);
                    }
                    const solverResult: CombinedSolverFormatterResult = node5Result!;

                    if (!solverResult.isValid || !solverResult.formattedSolution) {
                        const errorMsg = solverResult.errorMessage || '';
                        let retryFromNode: RetryableMathNode = 2;
                        let failureCategory = 'NODE_5_OTHER';

                        if (solverResult.failureType === 'perturbation_invalid') {
                            retryFromNode = 2;
                            failureCategory = 'NODE_5_PERTURBATION_INVALID';
                        } else if (solverResult.failureType === 'solver_failed' || errorMsg.includes('Solver/Formatter failed')) {
                            retryFromNode = 5;
                            failureCategory = 'NODE_5_SOLVER_FAILED';
                        } else if (solverResult.failureType === 'unsolvable' || solverResult.failureType === 'not_self_consistent' || errorMsg.includes('无解') || errorMsg.includes('不自洽')) {
                            retryFromNode = 2;
                            failureCategory = 'NODE_5_UNSOLVABLE';
                        } else if (solverResult.failureType === 'non_unique_answer' || errorMsg.includes('答案不唯一')) {
                            retryFromNode = 2;
                            failureCategory = 'NODE_5_NON_UNIQUE';
                        } else if (solverResult.failureType === 'insufficient_steps' || errorMsg.includes('步数不足') || errorMsg.includes('推理步数')) {
                            retryFromNode = 2;
                            failureCategory = 'NODE_5_INSUFFICIENT_STEPS';
                        } else if (solverResult.failureType === 'too_simple' || errorMsg.includes('过于简单') || errorMsg.includes('显而易见')) {
                            retryFromNode = 2;
                            failureCategory = 'NODE_5_TOO_SIMPLE';
                        }

                        console.warn(`Solver validation/formatting failed (attempt ${retryCount + 1}):`, errorMsg);
                        scheduleRetry(retryFromNode, errorMsg || 'Node5 failed', failureCategory);
                        continue;
                    }

                    // ========== Node 6: Problem Text Fusion ==========
                    if (isNode2Retry || isNode6Retry || !node6Result) {
                        callbacks?.onStageChange?.(MultiNodeStage.NODE_6_FORMATTING, i);
                        const startNode6 = Date.now();
                        node6Result = await fuseProblemText(
                            validationResult.mergedProblem!,
                            i,
                            tokenTrackerId,
                            isNode6Retry ? retryContext : null
                        );
                        recordMathNodeExecutionTime(problemExecutionTimes, 6, Date.now() - startNode6);
                    }
                    const fusedMergedText: string = node6Result!;

                    // ========== Node 7: Final Assembly ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_7_OUTPUT, i);
                    const startNode7 = Date.now();
                    validProblem = assembleFinalOutput(
                        validationResult.mergedProblem!,
                        solverResult.formattedSolution,
                        fusedMergedText,
                        problemExecutionTimes,
                        trapModifications,
                        getModelInfo().defaultModel,
                        normalizeResult,
                        retryNodeHistory
                    );
                    validProblem.metadata.tokenUsageByNode = getMathTokenUsage(tokenTrackerId);
                    recordMathNodeExecutionTime(problemExecutionTimes, 7, Date.now() - startNode7);

                    const outputValidation = validateFinalOutput(validProblem);
                    if (!outputValidation.isValid) {
                        console.warn(`Output validation failed:`, outputValidation.errors);
                        scheduleRetry(
                            classifyOutputValidationRetryNode(outputValidation.errors),
                            outputValidation.errors.join('; '),
                            'NODE_7_VALIDATION_FAILED'
                        );
                        continue;
                    }

                    // ========== Question Review ==========
                    // 所有数学难度都进行审查，确保领域、难度、扰动和验证规则闭环。
                    {
                        const reviewResult = await reviewMathQuestion(validProblem, i, tokenTrackerId);
                        console.log(
                            `[第${i + 1}题] 审查结果: passed=${reviewResult.passed}, failureType=${reviewResult.failureType}, retryFromNode=${reviewResult.retryFromNode}, ${reviewResult.overallVerdict}`
                        );

                        validProblem.metadata.reviewResult = JSON.stringify({
                            status: reviewResult.passed ? "通过" : "未通过",
                            qualityLabel: reviewResult.qualityLabel,
                            failureType: reviewResult.failureType,
                            retryFromNode: reviewResult.retryFromNode,
                            verdict: reviewResult.overallVerdict,
                            validation: "通过",
                            query: reviewResult.queryIssues.length === 0 ? "通过" : reviewResult.queryIssues.join("; "),
                            response: reviewResult.responseIssues.length === 0 ? "通过" : reviewResult.responseIssues.join("; "),
                            difficulty: reviewResult.difficultyIssues.length === 0 ? "通过" : reviewResult.difficultyIssues.join("; "),
                            disciplineGate: reviewResult.disciplineGate,
                            perturbationGate: reviewResult.perturbationGate
                        }, null, 2);
                        validProblem.metadata.qualityLabel = reviewResult.qualityLabel;
                        validProblem.metadata.reviewerResult = reviewResult.passed ? 1 : 0;
                        validProblem.metadata.reviewerFailureReason = reviewResult.passed
                            ? ''
                            : formatMathReviewerFailureReason(reviewResult);
                        validProblem.metadata.tokenUsageByNode = getMathTokenUsage(tokenTrackerId);

                        if (!reviewResult.passed) {
                            const reviewerRetryNode = getRetryableReviewerNode(reviewResult.retryFromNode);
                            if (
                                reviewerRetryNode &&
                                canScheduleReviewerRetry({
                                    retryCount,
                                    maxWorkflowAttempts: MAX_WORKFLOW_ATTEMPTS,
                                    routeRetryCount: routeRetryCounts[reviewerRetryNode],
                                    maxRouteRetries: MAX_ROUTE_RETRIES[reviewerRetryNode]
                                })
                            ) {
                                scheduleRetry(
                                    reviewerRetryNode,
                                    reviewResult.overallVerdict || validProblem.metadata.reviewerFailureReason || 'Reviewer failed',
                                    `REVIEWER_${reviewResult.failureType}`,
                                    reviewResult.retryHint
                                );
                                continue;
                            }

                            console.warn(`[审查未通过且无可用重试额度] 继续保存到 Google Sheets: ${validProblem.metadata.reviewerFailureReason}`);
                        }
                    }

                } catch (error: any) {
                    // 详细记录失败信息
                    const errorMsg = error?.message || String(error);
                    console.error(`❌ [第${i + 1}题] 工作流失败 (尝试 ${retryCount + 1}):`, errorMsg);

                    let retryFromNode: RetryableMathNode = 2;
                    let failureCategory = 'UNKNOWN_ERROR';

                    if (errorMsg.includes('generateBaseProblem') || errorMsg.includes('JSON') || errorMsg.includes('Node 2')) {
                        console.error(`   └─ 失败节点: Node 2 (基础题目生成)`);
                        console.error(`   └─ 可能原因: LLM返回格式错误、JSON解析失败、题目生成超时`);
                        retryFromNode = 2;
                        failureCategory = 'NODE_2_GENERATION_FAILED';
                    } else if (errorMsg.includes('validateAndMergeTraps')) {
                        console.error(`   └─ 失败节点: Node 4 (验证合并)`);
                        retryFromNode = 2;
                        failureCategory = 'NODE_4_VALIDATION_FAILED';
                    } else if (errorMsg.includes('solveAndFormatProblem') || errorMsg.includes('Node 5')) {
                        console.error(`   └─ 失败节点: Node 5 (求解验证)`);
                        retryFromNode = 5;
                        failureCategory = 'NODE_5_SOLVER_FAILED';
                    } else if (errorMsg.includes('fuseProblemText') || errorMsg.includes('Node 6')) {
                        console.error(`   └─ 失败节点: Node 6 (题面融合)`);
                        retryFromNode = 6;
                        failureCategory = 'NODE_6_TEXT_FUSION_FAILED';
                    }

                    scheduleRetry(retryFromNode, errorMsg, failureCategory);
                    continue;
                }
            }

            if (!validProblem) {
                clearMathTokenTracker(tokenTrackerId);
                console.error(`❌ [第 ${i + 1} 道题] 生成失败，已跳过（${retryCount} 次尝试均失败）`);
                console.error(`   └─ 最后失败原因: ${lastFailureReason || '未知'}`);
                callbacks?.onError?.(`第 ${i + 1} 道题生成失败，已跳过`);
                return null;
            }

            // Save to external storage (e.g., Google Sheets) immediately
            if (callbacks?.onProblemGenerated) {
                try {
                    await callbacks.onProblemGenerated(validProblem, i);
                } catch (saveError) {
                    console.warn(`Failed to save problem ${i + 1} to external storage:`, saveError);
                    // Continue even if save fails - we still have it in memory
                }
            }

            callbacks?.onProgress?.(i + 1, input.problemCount);
            clearMathTokenTracker(tokenTrackerId);
            return validProblem;
        };

        // Generate problems in parallel with concurrency limit
        const problemPromises = [];
        for (let i = 0; i < input.problemCount; i++) {
            problemPromises.push(limit(() => generateSingleProblem(i)));
        }

        const results = await Promise.all(problemPromises);

        // Filter out failed generations (nulls)
        for (const result of results) {
            if (result) {
                finalProblems.push(result);
            }
        }

        callbacks?.onStageChange?.(MultiNodeStage.COMPLETED, input.problemCount);
        return finalProblems;

    } catch (error: any) {
        callbacks?.onStageChange?.(MultiNodeStage.ERROR, 0);
        callbacks?.onError?.(error.message);
        throw error;
    }
}
