import {
    UserInput,
    MultiNodeStage,
    FinalProblem,
    BaseProblem,
    BiologyProblemType,
    BiologyDifficulty
} from "../types/multiNodeTypes";
import { getTextbookConstraints } from "./nodes/node1-rag";
import { generateBaseProblem } from "./subjects/biology/generator";
import { applyTraps } from "./subjects/biology/traps/trap-master";
import { solveAndFormatProblem } from "./subjects/biology/solver";
import { buildFusedProblemText } from "./subjects/biology/text-fusion";
import {
    validateBiologyProblem,
    buildRepairPrompt,
    type BiologyValidationResult
} from "./subjects/biology/validator";
import { callLLM } from "./llmClient";
import { cleanAndParseJSON } from "./utils/jsonCleaner";

/**
 * Biology Orchestrator
 *
 * 支持生物学 5 种题型的生成：
 * - calculation         : 定量计算题
 * - genetic-reasoning   : 遗传推理题
 * - network-reasoning   : 调控网络推理题
 * - threshold-reasoning : 阈值逻辑推理题
 * - structural-reasoning: 结构约束推理题
 *
 * P1 改造：
 * ③ Node 4 — 生物一致性验证器（静态规则 + LLM 语义检查）
 * ④ Node 5 前 — sanity check + repair 循环（最多 1 次修复）
 */

// ─────────────────────────────────────────────────────────────────────────────
// Pre-batch scope generation
// ─────────────────────────────────────────────────────────────────────────────

async function generateQuestionScope(topic: string, problemType: BiologyProblemType): Promise<string[]> {
    const typeHint: Record<BiologyProblemType, string> = {
        'calculation':          '定量计算',
        'genetic-reasoning':    '遗传推理',
        'network-reasoning':    '调控网络推理',
        'threshold-reasoning':  '阈值逻辑推理',
        'structural-reasoning': '结构约束推理',
    };
    const prompt = `主题：「${topic}」，题型：${typeHint[problemType] ?? '生物学'}。请列出该主题下 5—8 个独立的高难度考法维度，每个维度不超过 10 个字。只返回 JSON 数组，格式：["...", "..."]`;
    try {
        const raw = (await callLLM(prompt, { model: 'default', temperature: 0.5 }))
            .replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
    } catch {
        return [];
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ④ Sanity Check + Repair（solver 前）
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 在 solver 之前对 baseProblem 做一轮验证，若有 high/critical 问题则尝试修复一次。
 * 返回（可能已修复的）baseProblem 和最终验证结果。
 */
async function sanityCheckAndRepair(
    baseProblem: BaseProblem,
    problemIndex: number
): Promise<{ problem: BaseProblem; validation: BiologyValidationResult; wasRepaired: boolean }> {
    // 第一次验证
    const validation = await validateBiologyProblem(baseProblem);

    if (validation.isValid) {
        return { problem: baseProblem, validation, wasRepaired: false };
    }

    const hasCriticalOrHigh = validation.violations.some(
        v => v.severity === 'critical' || v.severity === 'high'
    );

    // 只有 critical/high 才触发修复；medium 级别仅记录，不修复
    if (!hasCriticalOrHigh) {
        console.warn(
            `[Biology Sanity] Problem ${problemIndex + 1}: medium-only violations, skipping repair.`,
            validation.summary
        );
        return { problem: baseProblem, validation, wasRepaired: false };
    }

    console.warn(
        `[Biology Sanity] Problem ${problemIndex + 1}: violations found, attempting repair.`,
        validation.summary
    );

    // 构建修复 prompt，调用 LLM 修复
    try {
        const repairPrompt = buildRepairPrompt(baseProblem, validation.violations);
        const raw = (await callLLM(repairPrompt, { model: 'reasoning', temperature: 0.3 }))
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const repairedData = cleanAndParseJSON(raw);

        // 合并修复结果，保留原始不可变字段
        const repairedProblem: BaseProblem = {
            ...baseProblem,
            ...repairedData,
            problemId:   baseProblem.problemId,   // 不允许修复改 ID
            topic:       baseProblem.topic,        // 不允许修复改主题
            problemType: baseProblem.problemType,  // 不允许修复改题型
        };

        // 修复后再验证一次
        const revalidation = await validateBiologyProblem(repairedProblem);

        if (revalidation.isValid || revalidation.severity === 'medium') {
            console.log(`[Biology Sanity] Problem ${problemIndex + 1}: repair succeeded.`);
            return { problem: repairedProblem, validation: revalidation, wasRepaired: true };
        } else {
            // 修复未彻底通过，使用修复版本但记录警告（不阻断流程）
            console.warn(
                `[Biology Sanity] Problem ${problemIndex + 1}: repair did not fully resolve issues,`,
                `proceeding with repaired version. Remaining: ${revalidation.summary}`
            );
            return { problem: repairedProblem, validation: revalidation, wasRepaired: true };
        }
    } catch (repairErr) {
        // 修复失败，使用原始版本继续（不阻断）
        console.error(
            `[Biology Sanity] Problem ${problemIndex + 1}: repair attempt failed, using original.`,
            repairErr
        );
        return { problem: baseProblem, validation, wasRepaired: false };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface BiologyUserInput extends Partial<UserInput> {
    difficulty?: BiologyDifficulty;
    problemType?: BiologyProblemType;
}

export interface BiologyOrchestratorCallbacks {
    onStageChange?: (stage: MultiNodeStage, problemIndex: number) => void;
    onProgress?: (current: number, total: number) => void;
    onError?: (error: string) => void;
    onProblemGenerated?: (problem: FinalProblem, index: number) => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main workflow
// ─────────────────────────────────────────────────────────────────────────────

export async function runBiologyMultiNodeWorkflow(
    rawInput: BiologyUserInput,
    callbacks?: BiologyOrchestratorCallbacks
): Promise<FinalProblem[]> {
    const startTime = Date.now();

    // ── Node 0: Input Validation ──────────────────────────────────────────────
    callbacks?.onStageChange?.(MultiNodeStage.NODE_0_INPUT, 0);

    const problemCount = rawInput.problemCount || 3;
    const trapCount    = rawInput.trapCount ?? 2;
    const difficulty   = rawInput.difficulty || 'intermediate';
    const problemType  = rawInput.problemType || 'calculation';

    console.log(
        `[Biology Orchestrator] Start: topic="${rawInput.topic}", difficulty="${difficulty}",`,
        `problemType="${problemType}", count=${problemCount}`
    );

    // ── Node 1: RAG Constraints ───────────────────────────────────────────────
    callbacks?.onStageChange?.(MultiNodeStage.NODE_1_RAG, 0);
    const userInput   = { ...rawInput, difficulty } as UserInput;
    const constraints = getTextbookConstraints(userInput);

    // ── Pre-Batch: Question Scope ─────────────────────────────────────────────
    const allowedAngles = await generateQuestionScope(rawInput.topic ?? '', problemType);
    const usedAngles: string[] = [];


    const finalProblems: FinalProblem[] = [];

    // ── Per-Problem Loop ──────────────────────────────────────────────────────
    for (let i = 0; i < problemCount; i++) {
        callbacks?.onProgress?.(i + 1, problemCount);

        // 收集本题的验证元数据，追加到 trapDescriptions 里供 UI 展示
        const validationNotes: string[] = [];

        try {
            // ── Node 2: Base Problem Generation ──────────────────────────────
            callbacks?.onStageChange?.(MultiNodeStage.NODE_2_BASE_GEN, i);

            let baseProblem = await generateBaseProblem(
                userInput,
                constraints,
                i + 1,
                problemType,
                allowedAngles,
                usedAngles
            );

            if ((baseProblem as any).questionAngle) {
                usedAngles.push((baseProblem as any).questionAngle);
            }

            // ── Node 3: Trap Injection ────────────────────────────────────────
            callbacks?.onStageChange?.(MultiNodeStage.NODE_3_TRAPS, i);
            const trapModifications = await applyTraps(baseProblem, trapCount);

            // ── Node 4: Biology Consistency Validation ────────────────────────
            callbacks?.onStageChange?.(MultiNodeStage.NODE_4_VALIDATION, i);

            const node4Validation = await validateBiologyProblem(baseProblem);

            if (!node4Validation.isValid) {
                validationNotes.push(`Node4验证: ${node4Validation.summary}`);
                console.warn(
                    `[Biology Node4] Problem ${i + 1}: ${node4Validation.violations.length} violation(s).`,
                    node4Validation.summary
                );
            } else {
                validationNotes.push('Node4验证: 通过');
            }

            // ── Node 5: Sanity Check + Repair + Solve ─────────────────────────
            callbacks?.onStageChange?.(MultiNodeStage.NODE_5_SOLVING, i);

            // ④ Sanity check & repair before solving
            const {
                problem: checkedProblem,
                validation: finalValidation,
                wasRepaired
            } = await sanityCheckAndRepair(baseProblem, i);

            baseProblem = checkedProblem;

            if (wasRepaired) {
                validationNotes.push(
                    `SanityRepair: 已修复，剩余问题: ${finalValidation.severity}`
                );
            } else if (!finalValidation.isValid) {
                validationNotes.push(
                    `SanityCheck: 存在问题(${finalValidation.severity})，未触发修复`
                );
            } else {
                validationNotes.push('SanityCheck: 通过');
            }

            const solution = await solveAndFormatProblem(baseProblem, i + 1);

            // ── Node 6: Text Fusion ───────────────────────────────────────────
            callbacks?.onStageChange?.(MultiNodeStage.NODE_6_FORMATTING, i);
            const mergedProblemText = await buildFusedProblemText(baseProblem, trapModifications);

            // ── Node 7: Assemble Final Output ─────────────────────────────────
            callbacks?.onStageChange?.(MultiNodeStage.NODE_7_OUTPUT, i);

            const finalProblem: FinalProblem = {
                problemId:    baseProblem.problemId,
                subject:      'biology',
                topic:        baseProblem.topic,
                problemType:  baseProblem.problemType,
                questionBody: baseProblem.questionBody,
                givenData:    baseProblem.givenData,
                logicConditions: baseProblem.logicConditions,
                mergedProblemText,
                solution,
                finalAnswer:  solution.finalAnswer,
                metadata: {
                    appliedTraps:     trapModifications.map(t => t.trapType),
                    trapDescriptions: [
                        ...trapModifications.map(t => t.trapDescription),
                        ...validationNotes,
                    ],
                    generatedAt: new Date().toISOString(),
                    nodeExecutionTime: {
                        total: Date.now() - startTime,
                    },
                },
            };

            finalProblems.push(finalProblem);

            if (callbacks?.onProblemGenerated) {
                await callbacks.onProblemGenerated(finalProblem, i);
            }

        } catch (error) {
            console.error(`[Biology Orchestrator] Problem ${i + 1} failed:`, error);
            callbacks?.onError?.(`Problem ${i + 1} generation failed: ${(error as Error).message}`);
            // Continue with next problem
        }
    }

    callbacks?.onStageChange?.(MultiNodeStage.COMPLETED, problemCount);
    console.log(
        `[Biology Orchestrator] Done: ${finalProblems.length}/${problemCount} problems generated,`,
        `total time ${Date.now() - startTime}ms`
    );

    return finalProblems;
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick single problem generation
// ─────────────────────────────────────────────────────────────────────────────

export async function generateBiologyProblem(
    topic: string,
    difficulty: BiologyDifficulty = 'intermediate',
    problemType: BiologyProblemType = 'calculation',
    trapCount: number = 2
): Promise<FinalProblem | null> {
    const results = await runBiologyMultiNodeWorkflow({
        topic,
        difficulty,
        problemType,
        trapCount,
        problemCount: 1
    });
    return results[0] || null;
}
