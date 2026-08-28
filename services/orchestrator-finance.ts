import {
    UserInput,
    MultiNodeStage,
    FinalProblem
} from "../types/multiNodeTypes";
import { validateUserInput } from "./nodes/node0-input";
import { getFinanceTextbookConstraints } from "./subjects/finance/rag";
import { generateBaseProblem } from "./subjects/finance/generator";
import { applyTraps } from "./subjects/finance/traps/trap-master";
import { validateAndMergeTraps } from "./subjects/finance/validator";
import { solveAndFormatProblem } from "./subjects/finance/solver";
import { assembleFinalOutput, validateFinalOutput } from "./nodes/node7-output";
import { callLLM } from "./llmClient";

/**
 * Finance Orchestrator
 *
 * 7 节点量化金融计算题生成链路：
 * Node 0 输入校验 → Node 1 市场规范约束 → Node 2 白板题生成 → Node 3 陷阱注入
 * → Node 4 陷阱融合与金融一致性验证 → Node 5 防伪审查/修复/求解 → Node 7 终稿组装
 */

export interface FinanceOrchestratorCallbacks {
    onStageChange?: (stage: MultiNodeStage, problemIndex: number) => void;
    onProgress?: (current: number, total: number) => void;
    onError?: (error: string) => void;
    onProblemGenerated?: (problem: FinalProblem, index: number) => Promise<void>;
}

/**
 * Pre-batch scope generation：为该主题枚举 5-8 个独立考法维度，避免同批题目撞车。
 */
async function generateQuestionScope(topic: string): Promise<string[]> {
    const prompt = `量化金融主题：「${topic}」。请列出该主题下 5—8 个独立的高难度考法维度，每个维度不超过 10 个字。只返回 JSON 数组，格式：["...", "..."]`;
    try {
        const raw = (await callLLM(prompt, { model: 'default', temperature: 0.5 }))
            .replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
    } catch {
        return []; // Graceful fallback: 生成失败则不施加角度约束
    }
}

export async function runFinanceMultiNodeWorkflow(
    rawInput: Partial<UserInput>,
    callbacks?: FinanceOrchestratorCallbacks
): Promise<FinalProblem[]> {
    const executionTimes: Record<string, number> = {};
    const finalProblems: FinalProblem[] = [];

    try {
        // ========== Node 0: Input Validation ==========
        callbacks?.onStageChange?.(MultiNodeStage.NODE_0_INPUT, 0);
        const startNode0 = Date.now();
        const input = validateUserInput({ ...rawInput, subject: 'finance' });
        executionTimes['node0'] = Date.now() - startNode0;

        // ========== Node 1: Market Convention Constraints ==========
        callbacks?.onStageChange?.(MultiNodeStage.NODE_1_RAG, 0);
        const startNode1 = Date.now();
        const constraints = getFinanceTextbookConstraints(input);
        executionTimes['node1'] = Date.now() - startNode1;

        // ========== Pre-Batch: Generate Question Scope ==========
        const allowedAngles = await generateQuestionScope(input.topic);
        const usedAngles: string[] = [];

        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(50);

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

                    if ((baseProblem as any).questionAngle) {
                        usedAngles.push((baseProblem as any).questionAngle);
                    }

                    // ========== Node 3: Trap Master (Consolidated) ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_3_TRAPS, i);
                    const startNode3 = Date.now();
                    const trapModifications = await applyTraps(baseProblem, input.trapCount);
                    executionTimes[`node3_${i}`] = Date.now() - startNode3;

                    // ========== Node 4: Finance Consistency Validation ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_4_VALIDATION, i);
                    const startNode4 = Date.now();
                    const validationResult = validateAndMergeTraps(baseProblem, trapModifications);
                    executionTimes[`node4_${i}`] = Date.now() - startNode4;

                    if (!validationResult.isValid) {
                        console.warn(
                            `[Finance] Problem ${i + 1} Validation failed (attempt ${retryCount + 1}):`,
                            validationResult.conflicts,
                            validationResult.physicalConstraintsViolated
                        );
                        retryCount++;
                        continue;
                    }

                    // ========== Node 5: Sanity Check / Repair / Solver ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_5_SOLVING, i);
                    const startNode5 = Date.now();
                    const solverResult = await solveAndFormatProblem(baseProblem, validationResult.validatedTrapData!);
                    executionTimes[`node5_${i}`] = Date.now() - startNode5;

                    if (!solverResult.isValid || !solverResult.formattedSolution) {
                        console.warn(
                            `[Finance] Problem ${i + 1} Solver validation/formatting failed (attempt ${retryCount + 1}):`,
                            solverResult.errorMessage
                        );
                        retryCount++;
                        continue;
                    }

                    // Node 5 可能在 sanity-check 阶段修复过题面/数据，终稿必须使用修复后的版本
                    const finalBaseProblem = solverResult.finalBaseProblem ?? baseProblem;
                    const finalTrapData = solverResult.finalTrapData ?? validationResult.validatedTrapData!;

                    // ========== Node 7: Final Assembly ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_7_OUTPUT, i);
                    const startNode7 = Date.now();
                    const finalOutput = assembleFinalOutput(
                        input,
                        finalBaseProblem,
                        finalTrapData,
                        solverResult.formattedSolution,
                        executionTimes
                    );
                    finalOutput.subject = 'finance';
                    finalOutput.financeProblemType = finalBaseProblem.financeProblemType;
                    finalOutput.financeReasoningType = finalBaseProblem.financeReasoningType;
                    finalOutput.marketConventions = finalBaseProblem.marketConventions;
                    if (solverResult.wasProblemRepaired) {
                        finalOutput.metadata.trapDescriptions = [
                            ...finalOutput.metadata.trapDescriptions,
                            `SanityRepair: 题面在求解前经过 ${solverResult.repairAttempts ?? 0} 次修复`
                        ];
                    }
                    executionTimes[`node7_${i}`] = Date.now() - startNode7;

                    const outputValidation = validateFinalOutput(finalOutput, {
                        subject: 'finance',
                        singleQuestion: input.singleQuestion
                    });
                    if (!outputValidation.isValid) {
                        console.warn(`[Finance] Problem ${i + 1} Output validation failed:`, outputValidation.errors);
                        retryCount++;
                        continue;
                    }

                    validProblem = finalOutput;

                } catch (error) {
                    console.error(`[Finance] Problem ${i + 1} Error in workflow (attempt ${retryCount + 1}):`, error);
                    retryCount++;
                    if (retryCount > maxRetries) {
                        console.error(`[Finance] Problem ${i + 1} failed completely.`);
                        break;
                    }
                }
            }

            if (!validProblem) {
                console.error(`⚠️ 跳过第 ${i + 1} 道金融题（${maxRetries} 次重试后仍失败）`);
                return null;
            }

            if (callbacks?.onProblemGenerated) {
                try {
                    await callbacks.onProblemGenerated(validProblem, i);
                } catch (saveError) {
                    console.warn(`[Finance] Failed to save problem ${i + 1} to external storage:`, saveError);
                }
            }

            callbacks?.onProgress?.(i + 1, input.problemCount);
            return validProblem;
        };

        const problemPromises = [];
        for (let i = 0; i < input.problemCount; i++) {
            problemPromises.push(limit(() => generateSingleProblem(i)));
        }

        const results = await Promise.all(problemPromises);

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

/**
 * Quick single problem generation
 */
export async function generateFinanceProblem(
    topic: string,
    trapCount: number = 2,
    singleQuestion: boolean = false
): Promise<FinalProblem | null> {
    const results = await runFinanceMultiNodeWorkflow({
        subject: 'finance',
        topic,
        trapCount,
        problemCount: 1,
        singleQuestion,
        allowTableLookup: true
    });
    return results[0] || null;
}
