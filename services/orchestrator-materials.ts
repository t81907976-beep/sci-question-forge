import {
    UserInput,
    MultiNodeStage,
    FinalProblem,
} from "../types/multiNodeTypes";
import { validateUserInput } from "./nodes/node0-input";
import { getMaterialsTextbookConstraints } from "./subjects/materials/rag";
import { generateBaseProblem } from "./subjects/materials/generator";
import { applyTraps } from "./subjects/materials/traps/trap-master";
import { validateAndMergeTraps } from "./subjects/materials/validator";
import { solveAndFormatProblem } from "./subjects/materials/solver";
import { fuseProblemText } from "./subjects/materials/text-fusion";
import { assembleFinalOutput, validateFinalOutput } from "./nodes/node7-output";
import { callLLM, cleanJsonString } from "./llmClient";
import { resetCostTracker, getCostSummary } from "./subjects/materials/costTracker";

import type { OrchestratorCallbacks } from './orchestrator';

async function generateQuestionScope(topic: string): Promise<string[]> {
    const prompt = `主题：「${topic}」。请列出该主题下 5—8 个独立的高难度考法维度，每个维度不超过 10 个字。只返回 JSON 数组，格式：["...", "..."]`;
    try {
        const raw = await callLLM(prompt, { model: 'default', temperature: 0.5 });
        const parsed = JSON.parse(cleanJsonString(raw));
        return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
    } catch {
        return [];
    }
}

export async function runMaterialsMultiNodeWorkflow(
    rawInput: Partial<UserInput>,
    callbacks?: OrchestratorCallbacks
): Promise<FinalProblem[]> {
    const executionTimes: Record<string, number> = {};
    const finalProblems: FinalProblem[] = [];

    try {
        // ========== Node 0: Input Validation ==========
        callbacks?.onStageChange?.(MultiNodeStage.NODE_0_INPUT, 0);
        const input = validateUserInput(rawInput);

        // ========== Node 1: RAG Constraints ==========
        callbacks?.onStageChange?.(MultiNodeStage.NODE_1_RAG, 0);
        const constraints = getMaterialsTextbookConstraints(input);

        // ========== Pre-Batch: Generate Question Scope ==========
        const allowedAngles = await generateQuestionScope(input.topic);
        // 预分配角度，避免并发时 usedAngles 竞态
        const assignedAngles: (string | undefined)[] = [];
        const usedAnglesSet = new Set<string>();
        for (let i = 0; i < input.problemCount; i++) {
            const available = allowedAngles.filter(a => !usedAnglesSet.has(a));
            if (available.length > 0) {
                const pick = available[i % available.length];
                assignedAngles.push(pick);
                usedAnglesSet.add(pick);
            } else {
                assignedAngles.push(undefined);
            }
        }

        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(50);

        const generateSingleProblem = async (i: number): Promise<FinalProblem | null> => {
            resetCostTracker(i);
            let validProblem: FinalProblem | null = null;
            let retryCount = 0;
            const maxRetries = 2;

            while (!validProblem && retryCount <= maxRetries) {
                try {
                    // ========== Node 2: Base Problem Generation ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_2_BASE_GEN, i);
                    const startNode2 = Date.now();
                    const baseProblem = await generateBaseProblem(input, constraints, i + 1, allowedAngles, Array.from(usedAnglesSet), assignedAngles[i]);
                    executionTimes[`node2_${i}`] = Date.now() - startNode2;

                    if ((baseProblem as any).questionAngle) {
                        usedAnglesSet.add((baseProblem as any).questionAngle);
                    }

                    // ========== Node 3: Trap Master ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_3_TRAPS, i);
                    const startNode3 = Date.now();
                    const trapModifications = await applyTraps(baseProblem, input.trapCount, i);
                    executionTimes[`node3_${i}`] = Date.now() - startNode3;

                    // ========== Node 4: Validation ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_4_VALIDATION, i);
                    const startNode4 = Date.now();
                    const validationResult = validateAndMergeTraps(baseProblem, trapModifications);
                    executionTimes[`node4_${i}`] = Date.now() - startNode4;

                    if (!validationResult.isValid) {
                        console.warn(`[材料科学] 第${i+1}题 Node4 验证失败 (尝试${retryCount+1}):`, validationResult.conflicts);
                        retryCount++;
                        continue;
                    }

                    // ========== Node 5: Solver ==========
                    callbacks?.onStageChange?.(MultiNodeStage.NODE_5_SOLVING, i);
                    const startNode5 = Date.now();
                    const solverResult = await solveAndFormatProblem(baseProblem, validationResult.validatedTrapData!, i);
                    executionTimes[`node5_${i}`] = Date.now() - startNode5;

                    if (!solverResult.isValid || !solverResult.formattedSolution) {
                        console.warn(`[材料科学] 第${i+1}题 Node5 求解失败 (尝试${retryCount+1}):`, solverResult.errorMessage);
                        retryCount++;
                        continue;
                    }

                    // ========== Node 6: Text Fusion (问题文本润色) ==========
                    const startNode6 = Date.now();
                    const mergedText = await fuseProblemText({
                        questionBody: validationResult.validatedTrapData!.trapModifiedText,
                        givenData: baseProblem.coreData || {},
                        distractorData: validationResult.validatedTrapData!.distractorData || {},
                        requiredAnswer: (baseProblem as any).requiredAnswer || '',
                    }, i);
                    validationResult.validatedTrapData!.trapModifiedText = mergedText;
                    executionTimes[`node6_${i}`] = Date.now() - startNode6;

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

                    const outputValidation = validateFinalOutput(finalOutput, {
                        subject: 'materials',
                        singleQuestion: input.singleQuestion === true,
                    });
                    if (!outputValidation.isValid) {
                        console.warn(`[材料科学] 第${i+1}题 Node7 输出验证失败:`, outputValidation.errors);
                        retryCount++;
                        continue;
                    }

                    validProblem = finalOutput;
                    if (validProblem) {
                        (validProblem as any).subject = 'materials';
                    }

                } catch (error) {
                    console.error(`[材料科学] 第${i+1}题 出错 (尝试${retryCount+1}):`, error);
                    retryCount++;
                    if (retryCount > maxRetries) {
                        console.error(`[材料科学] 第${i+1}题 已达最大重试次数，放弃`);
                        break;
                    }
                }
            }

            if (!validProblem) {
                console.error(`⚠️ [材料科学] 跳过第 ${i + 1} 道题（${maxRetries} 次重试后仍失败）`);
                return null;
            }

            const costSummary = getCostSummary(i);
            (validProblem.metadata as any).costPerProblem = costSummary.formatted;
            (validProblem.metadata as any).costDetails = `${costSummary.callCount}次调用, 入${costSummary.inputTokens}tok, 出${costSummary.outputTokens}tok`;
            (validProblem.metadata as any).modelsUsed = costSummary.modelsUsed.join(', ');
            console.log(`[材料科学] 第${i+1}题 成本估算: ${costSummary.formatted} (${costSummary.callCount}次LLM调用, 模型: ${costSummary.modelsUsed.join(', ')})`);

            if (callbacks?.onProblemGenerated) {
                try {
                    await callbacks.onProblemGenerated(validProblem, i);
                } catch (saveError) {
                    console.warn(`[材料科学] 第${i+1}题 保存失败:`, saveError);
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
            if (result) finalProblems.push(result);
        }

        callbacks?.onStageChange?.(MultiNodeStage.COMPLETED, input.problemCount);
        return finalProblems;

    } catch (error: any) {
        callbacks?.onStageChange?.(MultiNodeStage.ERROR, 0);
        callbacks?.onError?.(error.message);
        throw error;
    }
}
