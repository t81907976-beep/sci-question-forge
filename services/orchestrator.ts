import {
    UserInput,
    MultiNodeStage,
    BaseProblem,
    TrapCluster,
    FinalProblem,
    TrapModification
} from "../types/multiNodeTypes";
import { validateUserInput, getDifficultyConstraints } from "./nodes/node0-input";
import { getTextbookConstraints } from "./nodes/node1-rag";
import { generateBaseProblem } from "./nodes/node2-base-generator";
import { applyTraps } from "./nodes/node3-traps/trap-master";
import { validateAndMergeTraps } from "./nodes/node4-validator";
import { solveAndFormatProblem } from "./nodes/node5-solver";
import { assembleFinalOutput, validateFinalOutput } from "./nodes/node7-output";
import { getBatchGenerationService, type BatchGenerationRequest } from "./batchGenerationService";
import { defaultCatalog } from "./data/knowledgePointsCatalog";
import { runMathMultiNodeWorkflow } from "./orchestrator-math";
import { runPhysicsMultiNodeWorkflow } from "./orchestrator-physics";
import { runBiologyMultiNodeWorkflow } from "./orchestrator-biology";
import { runFinanceMultiNodeWorkflow } from "./orchestrator-finance";
import { runMaterialsMultiNodeWorkflow } from "./orchestrator-materials";
import { callLLM } from "./llmClient";

/**
 * Pre-batch scope generation:
 * Ask the model to enumerate 5-8 independent question angles for the given topic.
 * Returns an array of short angle keywords (e.g. ["路径积分", "恒等式证明", ...]).
 */
async function generateQuestionScope(topic: string): Promise<string[]> {
    const prompt = `主题：「${topic}」。请列出该主题下 5—8 个独立的高难度考法维度，每个维度不超过 10 个字。只返回 JSON 数组，格式：["...", "..."]`;
    try {
        const raw = (await callLLM(prompt, { model: 'default', temperature: 0.5 })).replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
    } catch {
        return []; // Graceful fallback: if scope generation fails, run without constraints
    }
}

/**
 * Main Orchestrator for Multi-Node Problem Generation
 * 
 * Coordinates the execution of all 7 nodes with retry logic
 */

export interface OrchestratorCallbacks {
    onStageChange?: (stage: MultiNodeStage, problemIndex: number) => void;
    onProgress?: (current: number, total: number) => void;
    onError?: (error: string) => void;
    onProblemGenerated?: (problem: FinalProblem, index: number) => Promise<void>;
}

export interface BatchModeConfig {
    mode: 'batch';
    knowledgePointIds: string[];
    difficultyFilter?: (1 | 2 | 3 | 4 | 5)[];
    concurrencyLimit?: number;  // Default: 20
}

export async function runMultiNodeWorkflow(
    rawInput: Partial<UserInput>,
    callbacks?: OrchestratorCallbacks,
    batchConfig?: BatchModeConfig
): Promise<FinalProblem[]> {
    // ========== Subject Router ==========
    if (rawInput.subject === 'math') {
        return runMathMultiNodeWorkflow(rawInput, callbacks);
    }
    if (rawInput.subject === 'physics') {
        return runPhysicsMultiNodeWorkflow(rawInput, callbacks);
    }
    if (rawInput.subject === 'biology') {
        return runBiologyMultiNodeWorkflow(rawInput as any, callbacks);
    }
    if (rawInput.subject === 'finance') {
        return runFinanceMultiNodeWorkflow(rawInput, callbacks);
    }
    if (rawInput.subject === 'materials') {
        return runMaterialsMultiNodeWorkflow(rawInput, callbacks);
    }

    // ========== Batch Mode Detection & Delegation ==========
    // If batch config is provided or multiple knowledge points are in the request, use batch service
    if (batchConfig && batchConfig.mode === 'batch') {
        try {
            const batchService = getBatchGenerationService();

            const batchRequest: BatchGenerationRequest = {
                knowledgePointIds: batchConfig.knowledgePointIds,
                difficultyFilter: batchConfig.difficultyFilter,
                trapCounts: [rawInput.trapCount ?? 2],
                language: (rawInput.language as any) || 'zh-CN',
                problemCountPerKP: rawInput.problemCount || 1,
                useAntiInterference: rawInput.useAntiInterference ?? true,
                singleQuestion: rawInput.singleQuestion,
                concurrencyLimit: batchConfig.concurrencyLimit ?? 20  // Pass concurrency config
            };

            // Validate batch request
            const validationErrors = batchService.validateRequest(batchRequest, defaultCatalog);
            if (validationErrors.length > 0) {
                callbacks?.onError?.(`Batch 请求验证失败: ${validationErrors.join(', ')}`);
                throw new Error(validationErrors.join(', '));
            }

            // Use batch service to generate problems
            const batchResult = await batchService.generateByKnowledgePoints(
                batchRequest,
                defaultCatalog,
                (input: Partial<UserInput>, cb?: OrchestratorCallbacks) =>
                    runMultiNodeWorkflow(input, cb), // Recursive call for individual KP problems
                callbacks
            );

            return batchResult.problems;
        } catch (error) {
            callbacks?.onStageChange?.(MultiNodeStage.ERROR, 0);
            callbacks?.onError?.(error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    // ========== Single Mode Workflow ==========
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

        const difficultyConfig = getDifficultyConstraints(input.trapCount);

        // ========== Pre-Batch: Generate Question Scope ==========
        // Ask model to enumerate valid question angles for this topic (runs once, uses light model)
        const allowedAngles = await generateQuestionScope(input.topic);
        const usedAngles: string[] = [];  // Tracks angles used so far in this batch

        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(50); // Effectively unlimited for typical usage (≤50 problems)

        const generateSingleProblem = async (i: number): Promise<FinalProblem | null> => {
            let validProblem: FinalProblem | null = null;
            let retryCount = 0;
            const maxRetries = 2;

            while (!validProblem && retryCount <= maxRetries) {
                try {
                    // ========== Node 2: Base Problem Generation ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_2_BASE_GEN, i);
                    const startNode2 = Date.now();
                    const baseProblem = await generateBaseProblem(input, constraints, i + 1, allowedAngles, usedAngles);
                    executionTimes[`node2_${i}`] = Date.now() - startNode2;

                    // Record the angle used by this problem (if any)
                    if ((baseProblem as any).questionAngle) {
                        usedAngles.push((baseProblem as any).questionAngle);
                    }

                    // ========== Node 3: Trap Master (Consolidated) ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_3_TRAPS, i);
                    const startNode3 = Date.now();
                    const trapModifications = await applyTraps(baseProblem, input.trapCount);
                    executionTimes[`node3_${i}`] = Date.now() - startNode3;

                    // ========== Node 4: Validation ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_4_VALIDATION, i);
                    const startNode4 = Date.now();
                    const validationResult = validateAndMergeTraps(baseProblem, trapModifications);
                    executionTimes[`node4_${i}`] = Date.now() - startNode4;

                    if (!validationResult.isValid) {
                        console.warn(`Problem ${i + 1} Validation failed (attempt ${retryCount + 1}):`, validationResult.conflicts, validationResult.physicalConstraintsViolated);
                        retryCount++;
                        continue;
                    }

                    // ========== Node 5: Internal Solver & Formatter ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_5_SOLVING, i);
                    const startNode5 = Date.now();
                    const solverResult = await solveAndFormatProblem(baseProblem, validationResult.validatedTrapData!);
                    executionTimes[`node5_${i}`] = Date.now() - startNode5;

                    if (!solverResult.isValid || !solverResult.formattedSolution) {
                        console.warn(`Problem ${i + 1} Solver validation/formatting failed (attempt ${retryCount + 1}):`, solverResult.errorMessage);
                        retryCount++;
                        continue;
                    }

                    // ========== Node 7: Final Assembly ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_7_OUTPUT, i);
                    const startNode7 = Date.now();
                    const finalOutput = assembleFinalOutput(
                        input,
                        baseProblem,
                        validationResult.validatedTrapData!,
                        solverResult.formattedSolution,
                        executionTimes
                    );
                    executionTimes[`node7_${i}`] = Date.now() - startNode7;

                    // Final validation
                    const outputValidation = validateFinalOutput(finalOutput);
                    if (!outputValidation.isValid) {
                        console.warn(`Problem ${i + 1} Output validation failed:`, outputValidation.errors);
                        retryCount++;
                        continue;
                    }

                    validProblem = finalOutput;
                    if (validProblem) {
                        (validProblem as any).subject = 'chemistry';
                    }

                } catch (error) {
                    console.error(`Problem ${i + 1} Error in workflow (attempt ${retryCount + 1}):`, error);
                    retryCount++;
                    if (retryCount > maxRetries) {
                        // We don't throw here to avoid crashing Promise.all, just return null
                        console.error(`Problem ${i + 1} failed completely.`);
                        break;
                    }
                }
            }

            if (!validProblem) {
                console.error(`⚠️ 跳过第 ${i + 1} 道题（${maxRetries} 次重试后仍失败）`);
                // Do not call onError here, because onError halts the entire workflow in App.tsx
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

    } catch (error) {
        callbacks?.onStageChange?.(MultiNodeStage.ERROR, 0);
        callbacks?.onError?.(error.message);
        throw error;
    }
}
