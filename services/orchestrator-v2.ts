import { FinalProblem, MultiNodeStage, Subject, TrapType, UserInput } from "../types/multiNodeTypes";

function normalizeTextForCompare(text?: string): string {
    return (text || '').replace(/\s+/g, ' ').trim();
}

function buildTextDiffSummary(before?: string, after?: string): string {
    const b = normalizeTextForCompare(before);
    const a = normalizeTextForCompare(after);

    if (!b && !a) return 'A1与最终题干均为空';
    if (b === a) return '题干无文本改动';

    const minLen = Math.min(b.length, a.length);
    let firstDiff = 0;
    while (firstDiff < minLen && b[firstDiff] === a[firstDiff]) firstDiff++;

    return `题干已修改: 长度 ${b.length}→${a.length}, 首个差异位置=${firstDiff}`;
}

function compactChemistryRuleMatches(rules: ReturnType<typeof selectChemistryRules>) {
    return rules.map(rule => ({
        id: rule.id,
        family: rule.family || rule.id,
        score: rule.score,
        matchedTerms: rule.matchedTerms,
        source: rule.source,
        effect: rule.effect,
    }));
}

function buildChemistryRuleTraceJSON(params: {
    inputKnowledgePoint: string;
    kpAnalysis: ChemistryKPAnalysisResult;
    draft: ChemistryV2QuestionDraft;
    reviewedDraft: ChemistryV2QuestionDraft;
    blindResult: ChemistryBlindSolverResult;
}): string {
    const { inputKnowledgePoint, kpAnalysis, draft, reviewedDraft, blindResult } = params;
    const avoidList = Array.isArray(kpAnalysis.coreConceptsToAvoid) ? kpAnalysis.coreConceptsToAvoid.join('、') : '';

    const trace = {
        A0: compactChemistryRuleMatches(selectChemistryRules({
            node: 'A0',
            knowledgePoint: inputKnowledgePoint,
            maxRules: 3,
        })),
        A1: compactChemistryRuleMatches(selectChemistryRules({
            node: 'A1',
            knowledgePoint: kpAnalysis.knowledgePoint,
            dimension: draft.chosenDimension,
            extraText: `${kpAnalysis.suggestedDifficulty} ${avoidList}`,
            maxRules: 4,
        })),
        A2A3: compactChemistryRuleMatches(selectChemistryRules({
            node: 'A2/A3',
            knowledgePoint: draft.knowledgePoint,
            dimension: draft.chosenDimension,
            questionText: draft.questionText,
            referenceAnswer: draft.referenceAnswer,
            maxRules: 4,
        })),
        A4: compactChemistryRuleMatches(selectChemistryRules({
            node: 'A4',
            knowledgePoint: reviewedDraft.knowledgePoint,
            dimension: reviewedDraft.chosenDimension,
            questionText: reviewedDraft.questionText,
            maxRules: 2,
        })),
        A5: compactChemistryRuleMatches(selectChemistryRules({
            node: 'A5',
            knowledgePoint: reviewedDraft.knowledgePoint,
            dimension: reviewedDraft.chosenDimension,
            questionText: reviewedDraft.questionText,
            referenceAnswer: reviewedDraft.referenceAnswer,
            extraText: blindResult.blindAnswer,
            maxRules: 4,
        })),
    };

    return JSON.stringify(trace);
}

function compactFinanceRuleMatches(rules: ReturnType<typeof selectFinanceRules>) {
    return rules.map(rule => ({
        id: rule.id,
        family: rule.family || rule.id,
        score: rule.score,
        matchedTerms: rule.matchedTerms,
        source: rule.source,
        effect: rule.effect,
    }));
}

function buildFinanceRuleTraceJSON(params: {
    inputKnowledgePoint: string;
    kpAnalysis: FinanceKPAnalysisResult;
    draft: FinanceV2QuestionDraft;
    reviewedDraft: FinanceV2QuestionDraft;
    blindResult: FinanceBlindSolverResult;
}): string {
    const { inputKnowledgePoint, kpAnalysis, draft, reviewedDraft, blindResult } = params;
    const avoidList = Array.isArray(kpAnalysis.coreConceptsToAvoid) ? kpAnalysis.coreConceptsToAvoid.join('、') : '';

    const trace = {
        A0: compactFinanceRuleMatches(selectFinanceRules({
            node: 'A0',
            knowledgePoint: inputKnowledgePoint,
            maxRules: 3,
        })),
        A1: compactFinanceRuleMatches(selectFinanceRules({
            node: 'A1',
            knowledgePoint: kpAnalysis.knowledgePoint,
            dimension: draft.chosenDimension,
            extraText: `${kpAnalysis.suggestedDifficulty} ${avoidList}`,
            maxRules: 4,
        })),
        A2A3: compactFinanceRuleMatches(selectFinanceRules({
            node: 'A2/A3',
            knowledgePoint: draft.knowledgePoint,
            dimension: draft.chosenDimension,
            questionText: draft.questionText,
            referenceAnswer: draft.referenceAnswer,
            maxRules: 4,
        })),
        A4: compactFinanceRuleMatches(selectFinanceRules({
            node: 'A4',
            knowledgePoint: reviewedDraft.knowledgePoint,
            dimension: reviewedDraft.chosenDimension,
            questionText: reviewedDraft.questionText,
            maxRules: 3,
        })),
        A5: compactFinanceRuleMatches(selectFinanceRules({
            node: 'A5',
            knowledgePoint: reviewedDraft.knowledgePoint,
            dimension: reviewedDraft.chosenDimension,
            questionText: reviewedDraft.questionText,
            referenceAnswer: reviewedDraft.referenceAnswer,
            extraText: blindResult.blindAnswer,
            maxRules: 4,
        })),
    };

    return JSON.stringify(trace);
}

import { validateUserInput } from "./nodes/node0-input";
import * as chemistryKP   from "./subjects/chemistry/v2/kp-analyzer";
import * as chemistryGen  from "./subjects/chemistry/v2/generator";
import * as chemistryRev  from "./subjects/chemistry/v2/reviewer";
import * as chemistryBS   from "./subjects/chemistry/v2/blind-solver";
import * as chemistryCmp  from "./subjects/chemistry/v2/comparator";
import { selectChemistryRules } from "./subjects/chemistry/v2/rule-matcher";
import type { V2QuestionDraft as ChemistryV2QuestionDraft } from "./subjects/chemistry/v2/generator";
import type { KPAnalysisResult as ChemistryKPAnalysisResult } from "./subjects/chemistry/v2/kp-analyzer";
import type { BlindSolverResult as ChemistryBlindSolverResult } from "./subjects/chemistry/v2/blind-solver";
import * as physicsKP     from "./subjects/physics/v2/kp-analyzer";
import * as physicsGen    from "./subjects/physics/v2/generator";
import * as physicsRev    from "./subjects/physics/v2/reviewer";
import * as physicsBS     from "./subjects/physics/v2/blind-solver";
import * as physicsCmp    from "./subjects/physics/v2/comparator";
import * as mathKP        from "./subjects/math/v2/kp-analyzer";
import * as mathGen       from "./subjects/math/v2/generator";
import * as mathRev       from "./subjects/math/v2/reviewer";
import * as mathBS        from "./subjects/math/v2/blind-solver";
import * as mathCmp       from "./subjects/math/v2/comparator";
import { buildMathV2RuleContext } from "./subjects/math/v2/rule-context";
import * as financeKP      from "./subjects/finance/v2/kp-analyzer";
import * as financeGen     from "./subjects/finance/v2/generator";
import * as financeRev     from "./subjects/finance/v2/reviewer";
import * as financeBS      from "./subjects/finance/v2/blind-solver";
import * as financeCmp     from "./subjects/finance/v2/comparator";
import { selectFinanceRules } from "./subjects/finance/v2/rule-matcher";
import type { V2QuestionDraft as FinanceV2QuestionDraft } from "./subjects/finance/v2/generator";
import type { KPAnalysisResult as FinanceKPAnalysisResult } from "./subjects/finance/v2/kp-analyzer";
import type { BlindSolverResult as FinanceBlindSolverResult } from "./subjects/finance/v2/blind-solver";
import type { ComparisonResult as FinanceComparisonResult } from "./subjects/finance/v2/comparator";
import { buildFinanceV2Metadata } from "./subjects/finance/v2/metadata";
import { selectMathV2L2Topics } from "./subjects/math/v2/l2-catalog";
import {
    clearMathTokenTracker,
    getMathTokenUsage,
    resetMathTokenTracker,
    type MathTokenTrackerId,
} from "./subjects/math/tokenTracker";
import * as materialsKP   from "./subjects/materials/v2/kp-analyzer";
import * as materialsGen  from "./subjects/materials/v2/generator";
import * as materialsRev  from "./subjects/materials/v2/reviewer";
import * as materialsBS   from "./subjects/materials/v2/blind-solver";
import * as materialsCmp  from "./subjects/materials/v2/comparator";
import { resetCostTracker as resetMaterialsCostTracker, getCostSummary as getMaterialsCostSummary } from "./subjects/materials/costTracker";
import { assignDifficultyLevels, type MaterialsDifficultyLevel, DIFFICULTY_LEVEL_LABEL } from "./subjects/materials/v2/difficulty";
import * as mechanicalKP  from "./subjects/mechanical/v2/kp-analyzer";
import * as mechanicalGen from "./subjects/mechanical/v2/generator";
import * as mechanicalRev from "./subjects/mechanical/v2/reviewer";
import * as mechanicalBS  from "./subjects/mechanical/v2/blind-solver";
import * as mechanicalCmp from "./subjects/mechanical/v2/comparator";
import { resetCostTracker as resetMechanicalCostTracker, getCostSummary as getMechanicalCostSummary } from "./subjects/mechanical/costTracker";
import {
    assignDifficultyLevels as assignMechanicalDifficultyLevels,
    type MechanicalDifficultyLevel,
    DIFFICULTY_LEVEL_LABEL as MECHANICAL_DIFFICULTY_LABEL,
} from "./subjects/mechanical/v2/difficulty";
import { resetCostTracker, getCostSummary } from "./subjects/physics/costTracker";
import { assembleFinalOutput, validateFinalOutput } from "./nodes/node7-output";
import { getBatchGenerationService, type BatchGenerationRequest } from "./batchGenerationService";
import { defaultCatalog } from "./data/knowledgePointsCatalog";
import type { OrchestratorCallbacks, BatchModeConfig } from "./orchestrator";
import { runBiologyV2Workflow, type BiologyV2WorkflowOptions } from "./orchestrator-biology-v2";

type GenericV2Modules = {
    analyzeKnowledgePoint: (knowledgePointName: string, trackerId?: any) => Promise<any>;
    generateQuestionWithAnswer: (kpAnalysis: any, dimensionIndex: number, language?: string, singleQuestion?: boolean, numericAnswerOnlyOrTrackerId?: boolean | any, trackerId?: any) => Promise<any>;
    reviewAndRepair: (draft: any, trackerId?: any, singleQuestion?: boolean, numericAnswerOnly?: boolean) => Promise<any>;
    solveBlind: (draft: any, trackerId?: any) => Promise<any>;
    compareAnswers: (draft: any, blindResult: any, trackerId?: any, singleQuestion?: boolean, numericAnswerOnly?: boolean) => Promise<any>;
};

// 按学科路由 V2 模块
function getV2Modules(subject: Subject): GenericV2Modules {
    if (subject === 'physics') {
        return {
            analyzeKnowledgePoint: physicsKP.analyzeKnowledgePoint,
            generateQuestionWithAnswer: physicsGen.generateQuestionWithAnswer,
            reviewAndRepair: physicsRev.reviewAndRepair,
            solveBlind: physicsBS.solveBlind,
            compareAnswers: physicsCmp.compareAnswers,
        };
    }
    if (subject === 'math') {
        return {
            analyzeKnowledgePoint: mathKP.analyzeKnowledgePoint,
            generateQuestionWithAnswer: mathGen.generateQuestionWithAnswer,
            reviewAndRepair: mathRev.reviewAndRepair,
            solveBlind: mathBS.solveBlind,
            compareAnswers: mathCmp.compareAnswers,
        };
    }
    if (subject === 'finance') {
        return {
            analyzeKnowledgePoint: financeKP.analyzeKnowledgePoint,
            generateQuestionWithAnswer: financeGen.generateQuestionWithAnswer,
            reviewAndRepair: financeRev.reviewAndRepair,
            solveBlind: financeBS.solveBlind,
            compareAnswers: financeCmp.compareAnswers,
        };
    }
    if (subject === 'materials') {
        // 材料学 V2：签名适配 generic 接口（trackerId → problemIndex）
        return {
            analyzeKnowledgePoint: (kp: string, trackerId?: any, questionType?: any, difficultyLevel?: any) =>
                materialsKP.analyzeKnowledgePoint(kp, typeof trackerId === 'number' ? trackerId : 0, questionType || 'calculation', difficultyLevel || 'standard'),
            generateQuestionWithAnswer: (kpAnalysis: any, dimensionIndex: number, language?: string, singleQuestion?: boolean, _numericOrTracker?: any, trackerId?: any, questionType?: any, difficultyLevel?: any) => {
                const problemIndex = typeof trackerId === 'number' ? trackerId : (typeof _numericOrTracker === 'number' ? _numericOrTracker : 0);
                return materialsGen.generateQuestionWithAnswer(kpAnalysis, dimensionIndex, language, singleQuestion, problemIndex, questionType || 'calculation', difficultyLevel || 'standard');
            },
            reviewAndRepair: (draft: any, trackerId?: any, singleQuestion?: boolean) =>
                materialsRev.reviewAndRepair(draft, typeof trackerId === 'number' ? trackerId : 0, singleQuestion),
            solveBlind: (draft: any, trackerId?: any) =>
                materialsBS.solveBlind(draft, typeof trackerId === 'number' ? trackerId : 0),
            compareAnswers: (draft: any, blindResult: any, trackerId?: any) =>
                materialsCmp.compareAnswers(draft, blindResult, typeof trackerId === 'number' ? trackerId : 0),
        };
    }
    if (subject === 'mechanical') {
        // 机械 V2：签名与 materials 同形（trackerId → problemIndex + 题型 + 难度档位）
        return {
            analyzeKnowledgePoint: (kp: string, trackerId?: any, questionType?: any, difficultyLevel?: any) =>
                mechanicalKP.analyzeKnowledgePoint(kp, typeof trackerId === 'number' ? trackerId : 0, questionType || 'calculation', difficultyLevel || 'standard'),
            generateQuestionWithAnswer: (kpAnalysis: any, dimensionIndex: number, language?: string, singleQuestion?: boolean, _numericOrTracker?: any, trackerId?: any, questionType?: any, difficultyLevel?: any) => {
                const problemIndex = typeof trackerId === 'number' ? trackerId : (typeof _numericOrTracker === 'number' ? _numericOrTracker : 0);
                return mechanicalGen.generateQuestionWithAnswer(kpAnalysis, dimensionIndex, language, singleQuestion, problemIndex, questionType || 'calculation', difficultyLevel || 'standard');
            },
            reviewAndRepair: (draft: any, trackerId?: any, singleQuestion?: boolean) =>
                mechanicalRev.reviewAndRepair(draft, typeof trackerId === 'number' ? trackerId : 0, singleQuestion),
            solveBlind: (draft: any, trackerId?: any) =>
                mechanicalBS.solveBlind(draft, typeof trackerId === 'number' ? trackerId : 0),
            compareAnswers: (draft: any, blindResult: any, trackerId?: any) =>
                mechanicalCmp.compareAnswers(draft, blindResult, typeof trackerId === 'number' ? trackerId : 0),
        };
    }
    // 默认（chemistry 及其他尚未实现 V2 的学科）
    return {
        analyzeKnowledgePoint: chemistryKP.analyzeKnowledgePoint,
        generateQuestionWithAnswer: chemistryGen.generateQuestionWithAnswer,
        reviewAndRepair: chemistryRev.reviewAndRepair,
        solveBlind: chemistryBS.solveBlind,
        compareAnswers: chemistryCmp.compareAnswers,
    };
}

// V2 Stage labels (reuses existing MultiNodeStage enum where possible)
export const V2_STAGE_LABELS: Record<string, string> = {
    [MultiNodeStage.NODE_0_INPUT]:      "输入校验",
    [MultiNodeStage.NODE_1_RAG]:        "知识点分析",
    [MultiNodeStage.NODE_2_BASE_GEN]:   "生题 + 答案",
    [MultiNodeStage.NODE_3_TRAPS]:      "审查 / 修复",
    [MultiNodeStage.NODE_4_VALIDATION]: "盲解",
    [MultiNodeStage.NODE_5_SOLVING]:    "答案对比",
    [MultiNodeStage.NODE_7_OUTPUT]:     "整理输出",
};

/**
 * New V2 pipeline for a single problem:
 *   A0 → A1 → A2/A3 loop → A4 → A5 → Node7
 *
 * Outputs the same FinalProblem type so the existing UI works unchanged.
 */
async function generateSingleProblemV2(
    input: UserInput,
    problemIndex: number,
    callbacks?: OrchestratorCallbacks,
    selectedMathL2Topic?: string,
    materialsDifficultyLevel?: MaterialsDifficultyLevel,
    mechanicalDifficultyLevel?: MechanicalDifficultyLevel,
): Promise<FinalProblem | null> {
    const executionTimes: Record<string, number> = {};
    const originalTopic = input.topic || input.knowledgePointIds?.[0] || '';
    const kpName = selectedMathL2Topic || originalTopic;
    const isPhysics = input.subject === 'physics';
    const isMath = input.subject === 'math';
    const isMaterials = input.subject === 'materials';
    const isMechanical = input.subject === 'mechanical';
    const mathTrackerId: MathTokenTrackerId | undefined = isMath ? `math-v2-${Date.now()}-${problemIndex}` : undefined;
    const trackerId = (isPhysics || isMaterials || isMechanical) ? problemIndex : mathTrackerId;

    if (isPhysics) resetCostTracker(problemIndex);
    if (isMaterials) resetMaterialsCostTracker(problemIndex);
    if (isMechanical) resetMechanicalCostTracker(problemIndex);
    if (mathTrackerId) resetMathTokenTracker(mathTrackerId);

    const {
        analyzeKnowledgePoint,
        generateQuestionWithAnswer,
        reviewAndRepair,
        solveBlind,
        compareAnswers,
    } = getV2Modules(input.subject);

    try {
        // ── A0: Knowledge Point Analysis ──────────────────────────────────────
        callbacks?.onStageChange?.(MultiNodeStage.NODE_1_RAG, problemIndex);
        const t0 = Date.now();
        const materialsQuestionType = isMaterials ? (input.materialsQuestionType || 'calculation') : undefined;
        const materialsDifficulty: MaterialsDifficultyLevel = isMaterials ? (materialsDifficultyLevel || 'standard') : 'standard';
        if (isMaterials) {
            console.log(`[V2 Materials] 题${problemIndex + 1} 难度档位: ${DIFFICULTY_LEVEL_LABEL[materialsDifficulty]} (${materialsDifficulty})`);
        }
        // 材料学科：校验知识点是否标记支持该题型（当前为软提示，不阻断生成）
        if (isMaterials && materialsQuestionType) {
            const { isQuestionTypeSupported } = await import('./subjects/materials/disciplines');
            if (!isQuestionTypeSupported(kpName, materialsQuestionType)) {
                console.warn(`[V2 A0] 知识点「${kpName}」未标记支持题型「${materialsQuestionType}」，仍继续生成（软提示）`);
            }
        }
        // 机械学科：题型 + 难度档位（与材料同形，但知识点表和 lint 完全独立）
        const mechanicalQuestionType = isMechanical ? (input.mechanicalQuestionType || 'calculation') : undefined;
        const mechanicalDifficulty: MechanicalDifficultyLevel = isMechanical ? (mechanicalDifficultyLevel || 'standard') : 'standard';
        if (isMechanical) {
            console.log(`[V2 Mechanical] 题${problemIndex + 1} 难度档位: ${MECHANICAL_DIFFICULTY_LABEL[mechanicalDifficulty]} (${mechanicalDifficulty})`);
            const { isQuestionTypeSupported } = await import('./subjects/mechanical/disciplines');
            if (mechanicalQuestionType && !isQuestionTypeSupported(kpName, mechanicalQuestionType)) {
                console.warn(`[V2 A0] 机械知识点「${kpName}」未标记支持题型「${mechanicalQuestionType}」，仍继续生成（软提示）`);
            }
        }
        const kpAnalysis = isMaterials
            ? await (analyzeKnowledgePoint as any)(kpName, trackerId, materialsQuestionType, materialsDifficulty)
            : isMechanical
                ? await (analyzeKnowledgePoint as any)(kpName, trackerId, mechanicalQuestionType, mechanicalDifficulty)
                : await analyzeKnowledgePoint(kpName, trackerId);
        executionTimes["a0_kp_analysis"] = Date.now() - t0;
        console.log(`[V2 A0] KP分析结果 (题${problemIndex + 1}):`, JSON.stringify(kpAnalysis, null, 2));

        // ── A1: Generate Question + Reference Answer ───────────────────────────
        callbacks?.onStageChange?.(MultiNodeStage.NODE_2_BASE_GEN, problemIndex);
        const t1 = Date.now();
        const draft = isMath
            ? await generateQuestionWithAnswer(kpAnalysis, problemIndex, input.language, input.singleQuestion, input.numericAnswerOnly, trackerId)
            : isMaterials
                ? await (generateQuestionWithAnswer as any)(kpAnalysis, problemIndex, input.language, input.singleQuestion, undefined, trackerId, materialsQuestionType, materialsDifficulty)
                : isMechanical
                    ? await (generateQuestionWithAnswer as any)(kpAnalysis, problemIndex, input.language, input.singleQuestion, undefined, trackerId, mechanicalQuestionType, mechanicalDifficulty)
                    : await generateQuestionWithAnswer(kpAnalysis, problemIndex, input.language, input.singleQuestion, trackerId);
        executionTimes["a1_generate"] = Date.now() - t1;
        console.log(`[V2 A1] 生题结果 (题${problemIndex + 1}):`, JSON.stringify(draft, null, 2));

        // ── A2/A3: Review + Repair Loop ────────────────────────────────────────
        callbacks?.onStageChange?.(MultiNodeStage.NODE_3_TRAPS, problemIndex);
        const t2 = Date.now();
        const { draft: reviewedDraft, reviewResult, repairCycles, degradationLevel, degradationReason } = await reviewAndRepair(draft, trackerId, input.singleQuestion, isMath ? input.numericAnswerOnly : undefined);
        executionTimes["a2_a3_review"] = Date.now() - t2;

        if (!reviewResult.passed) {
            console.warn(
                `[V2] Problem ${problemIndex + 1}: review not fully passed after ${repairCycles} repair(s).`,
                reviewResult.overallVerdict
            );
        }
        if (degradationLevel !== 'stable') {
            console.warn(
                `[V2] Problem ${problemIndex + 1}: 降级 [${degradationLevel}] — ${degradationReason}`
            );
        }

        // ── A4: Blind Solve ────────────────────────────────────────────────────
        callbacks?.onStageChange?.(MultiNodeStage.NODE_4_VALIDATION, problemIndex);
        let blindResult: Awaited<ReturnType<typeof solveBlind>>;
        try {
            const t4 = Date.now();
            blindResult = await solveBlind(reviewedDraft, trackerId);
            executionTimes["a4_blind_solve"] = Date.now() - t4;

            if (!blindResult.isSolvable) {
                console.warn(
                    `[V2] Problem ${problemIndex + 1}: blind solver reports unsolvable — ${blindResult.failReason}`
                );
            }
        } catch (a4Error) {
            console.warn(`[V2] Problem ${problemIndex + 1}: blind solve failed, skipping validation:`, a4Error);
            blindResult = {
                isSolvable: false,
                failReason: `Blind solve error: ${a4Error}`,
                blindAnswer: "",
                blindFinalAnswer: "",
                blindPoints: [],
            };
        }

        // ── A5: Compare Answers ────────────────────────────────────────────────
        callbacks?.onStageChange?.(MultiNodeStage.NODE_5_SOLVING, problemIndex);
        let comparison: Awaited<ReturnType<typeof compareAnswers>>;
        try {
            const t5 = Date.now();
            comparison = await compareAnswers(reviewedDraft, blindResult, trackerId, input.singleQuestion, isMath ? input.numericAnswerOnly : undefined);
            executionTimes["a5_compare"] = Date.now() - t5;
        } catch (a5Error) {
            console.warn(`[V2] Problem ${problemIndex + 1}: compare failed, using draft answer:`, a5Error);
            comparison = {
                answersAgree: false,
                confidence: "low",
                finalAuthorizedAnswer: reviewedDraft.requiredAnswer,
                finalSolutionText: reviewedDraft.referenceAnswer,
                discrepancies: [`A5 compare error: ${a5Error}`],
                notes: "比较阶段失败，直接使用出题者原始参考答案",
                reasoningValid: false,
                reasoningIssues: ["比较阶段失败，无法确认推理正确性"],
                solutionRepaired: false,
                repairSummary: "",
                releaseLabel: "not_recommended",
            };
        }

        // ── Node 7: Assemble Final Output (reuse existing, no API call) ─────────
        callbacks?.onStageChange?.(MultiNodeStage.NODE_7_OUTPUT, problemIndex);
        const t7 = Date.now();

        // Build adapter objects that match the existing assembleFinalOutput signature
        const baseProblemAdapter = {
            problemId: reviewedDraft.problemId,
            topic: reviewedDraft.knowledgePoint,
            scenario: reviewedDraft.chosenDimension,
            originalProblemText: draft.questionText,
            coreData: reviewedDraft.coreData,
            requiredAnswer: reviewedDraft.requiredAnswer,
            referenceSteps: reviewedDraft.referenceSteps,
            knowledgePointIds: input.knowledgePointIds,
        };

        const trapDataAdapter = {
            appliedTraps: [] as TrapType[],
            trapModifiedText: reviewedDraft.questionText,
            distractorData: {},
            trapDescriptions: [
                `审查状态: ${reviewResult.overallVerdict}`,
                `修复轮次: ${repairCycles}`,
                `答案一致: ${comparison.answersAgree ? "是" : "否"}`,
                `置信度: ${comparison.confidence}`,
                `发布标签: ${comparison.releaseLabel}`,
                `降级状态: ${degradationLevel}`,
                ...(degradationLevel !== 'stable' ? [`降级原因: ${degradationReason}`] : []),
                `推理审查: ${comparison.reasoningValid ? "通过" : "发现问题并已修复"}`,
                `解答修复: ${comparison.solutionRepaired ? "是" : "否"}`,
                ...((reviewResult.depthIssues?.length ?? 0) > 0
                    ? [`深度问题: ${reviewResult.depthIssues.join("; ")}`]
                    : []),
                ...((comparison.reasoningIssues?.length ?? 0) > 0
                    ? [`推理问题: ${comparison.reasoningIssues.join("; ")}`]
                    : []),
                ...(comparison.repairSummary
                    ? [`修复说明: ${comparison.repairSummary}`]
                    : []),
                ...((comparison.discrepancies?.length ?? 0) > 0
                    ? [`差异: ${comparison.discrepancies.join("; ")}`]
                    : []),
            ],
        };

        const solutionAdapter = {
            problemId: reviewedDraft.problemId,
            reasoningChain: comparison.finalSolutionText
                .split("\n")
                .filter(line => line.trim())
                .map((line, i) => ({
                    stepNumber: i + 1,
                    description: line,
                    justification: "",
                    trapAvoidanceNote: undefined,
                })),
            finalAnswer: comparison.finalAuthorizedAnswer,
            keyInsights: [
                `考察维度: ${reviewedDraft.chosenDimension}`,
                `答案置信度: ${comparison.confidence}`,
                `发布标签: ${comparison.releaseLabel}`,
                `推理审查: ${comparison.reasoningValid ? "通过" : "发现问题并已修复"}`,
                ...(comparison.repairSummary ? [`修复说明: ${comparison.repairSummary}`] : []),
                ...(comparison.notes ? [comparison.notes] : []),
            ],
            standardSafeSolutionText: comparison.finalSolutionText,
        };

        const finalProblem = assembleFinalOutput(
            input,
            baseProblemAdapter,
            trapDataAdapter,
            solutionAdapter,
            executionTimes
        );

        const a1QuestionBody = draft.questionText || '';
        const reviewedMergedText = reviewedDraft.questionText || '';
        const isTextModified = normalizeTextForCompare(a1QuestionBody) !== normalizeTextForCompare(reviewedMergedText);
        const textDiffSummary = buildTextDiffSummary(a1QuestionBody, reviewedMergedText);

        finalProblem.questionBody = a1QuestionBody;
        finalProblem.mergedProblemText = reviewedMergedText;
        (finalProblem.metadata as any).isTextModified = isTextModified;
        (finalProblem.metadata as any).textDiffSummary = textDiffSummary;

        // Populate reviewer metadata fields for dedicated Sheets columns
        (finalProblem.metadata as any).reviewPassed = reviewResult.passed;
        (finalProblem.metadata as any).reviewVerdict = reviewResult.overallVerdict || '';
        (finalProblem.metadata as any).reviewDepthIssues = reviewResult.depthIssues || [];
        (finalProblem.metadata as any).repairCycles = repairCycles;
        (finalProblem.metadata as any).blindSolveAnswer = blindResult.blindFinalAnswer || blindResult.blindAnswer || '';
        (finalProblem.metadata as any).blindSolveSolvable = blindResult.isSolvable;
        (finalProblem.metadata as any).blindSolveFailReason = blindResult.failReason || '';
        (finalProblem.metadata as any).answersAgree = comparison.answersAgree;
        (finalProblem.metadata as any).comparisonConfidence = comparison.confidence;

        if (isMath) {
            const ruleContext = buildMathV2RuleContext(reviewedDraft.knowledgePoint);
            (finalProblem.metadata as any).mathCategory = reviewedDraft.mathDiscipline || ruleContext.disciplineName;
            (finalProblem.metadata as any).chosenDimension = reviewedDraft.chosenDimension;
            (finalProblem.metadata as any).antiPatternStrategies = ruleContext.anti_pattern_strategies;
            (finalProblem.metadata as any).l2Key = ruleContext.disciplineKey;
            (finalProblem.metadata as any).l2Name = ruleContext.disciplineName;
            (finalProblem.metadata as any).l2OriginalInput = originalTopic;
            (finalProblem.metadata as any).l2RoutingEvidence = ruleContext.routingEvidence;
            (finalProblem.metadata as any).l2RuleVersion = ruleContext.ruleVersion;
            (finalProblem.metadata as any).l2RuleSnapshot = ruleContext.ruleSnapshot;
            (finalProblem.metadata as any).l2RoutingVerified = ruleContext.validation.l2RoutingVerified;
            (finalProblem.metadata as any).l2RuleViolation = ruleContext.validation.l2RuleViolation;
            (finalProblem.metadata as any).l2RuleEffective = ruleContext.validation.l2RuleEffective;
            (finalProblem.metadata as any).closureChecklist = reviewedDraft.closureChecklist || kpAnalysis.closureChecklist || [];
            (finalProblem.metadata as any).finalAuthorizedAnswer = comparison.finalAuthorizedAnswer;
            (finalProblem.metadata as any).finalSolutionText = comparison.finalSolutionText;
            (finalProblem.metadata as any).releaseLabel = comparison.releaseLabel;
            (finalProblem.metadata as any).reasoningValid = comparison.reasoningValid;
            (finalProblem.metadata as any).reasoningIssues = comparison.reasoningIssues || [];
            (finalProblem.metadata as any).reviewCorrectnessIssues = reviewResult.correctnessIssues || [];
            (finalProblem.metadata as any).reviewClarityIssues = reviewResult.clarityIssues || [];
            (finalProblem.metadata as any).degradationLevel = degradationLevel;
            (finalProblem.metadata as any).degradationReason = degradationReason;
            (finalProblem.metadata as any).numericAnswerOnly = input.numericAnswerOnly ?? false;
            if (mathTrackerId) {
                (finalProblem.metadata as any).tokenUsageByNode = getMathTokenUsage(mathTrackerId);
                clearMathTokenTracker(mathTrackerId);
            }
        }

        // Populate solutionReference from referenceSteps
        if (reviewedDraft.referenceSteps?.length) {
            finalProblem.solutionReference = reviewedDraft.referenceSteps
                .map((step: string, i: number) => `${i + 1}.${step.replace(/^\[\d+\]\s*/, '')}`)
                .join(';');
        }
        if (input.subject === 'chemistry') {
            try {
                (finalProblem.metadata as any).matchedRulesTrace = buildChemistryRuleTraceJSON({
                    inputKnowledgePoint: kpName,
                    kpAnalysis: kpAnalysis as ChemistryKPAnalysisResult,
                    draft: draft as ChemistryV2QuestionDraft,
                    reviewedDraft: reviewedDraft as ChemistryV2QuestionDraft,
                    blindResult: blindResult as ChemistryBlindSolverResult,
                });
            } catch (traceError) {
                (finalProblem.metadata as any).matchedRulesTrace = JSON.stringify({ error: String(traceError) });
            }
        }

        if (input.subject === 'finance') {
            try {
                Object.assign(finalProblem.metadata as any, buildFinanceV2Metadata({
                    inputKnowledgePoint: kpName,
                    kpAnalysis: kpAnalysis as FinanceKPAnalysisResult,
                    reviewedDraft: reviewedDraft as FinanceV2QuestionDraft,
                    reviewResult,
                    repairCycles,
                    degradationLevel,
                    degradationReason,
                    blindResult: blindResult as FinanceBlindSolverResult,
                    comparison: comparison as FinanceComparisonResult,
                }));
            } catch (metaError) {
                console.warn('[V2 金融] metadata 拼装失败:', metaError);
            }
            try {
                (finalProblem.metadata as any).matchedRulesTrace = buildFinanceRuleTraceJSON({
                    inputKnowledgePoint: kpName,
                    kpAnalysis: kpAnalysis as FinanceKPAnalysisResult,
                    draft: draft as FinanceV2QuestionDraft,
                    reviewedDraft: reviewedDraft as FinanceV2QuestionDraft,
                    blindResult: blindResult as FinanceBlindSolverResult,
                });
            } catch (traceError) {
                (finalProblem.metadata as any).matchedRulesTrace = JSON.stringify({ error: String(traceError) });
            }
        }

        executionTimes["node7_assemble"] = Date.now() - t7;

        const validation = validateFinalOutput(finalProblem, {
            subject: input.subject,
            singleQuestion: input.singleQuestion,
        });

        // 机械的题干口径与 node7 的通用校验相反：node7 要求 coreData 每一项都在题面可见
        // （题干自足），机械则要求手册可查量**必须缺席题面**（信息隔离，答题方自己查表取值）。
        // 因此把仅由 handbookLookupItems 造成的"不可见"报错剔除，否则一道信息隔离做对的
        // 机械题会被判 degraded。论述题无 coreData 亦属正常，同 biology 的处理。
        let validationErrors = validation.errors;
        if (isMechanical) {
            const handbookItems: string[] = (reviewedDraft as any).handbookLookupItems || [];
            const questionType = reviewedDraft.questionType || 'calculation';
            validationErrors = validationErrors.filter(err => {
                if (err === 'No given core data') return questionType !== 'short-answer';
                const invisible = err.match(/^Core data not visible in problem text: (.*)$/);
                if (!invisible) return true;
                // 逐项比对：只要还有非手册量不可见，就仍是真报错
                const names = invisible[1].split(';').map(s => s.trim().split('=')[0].trim());
                return names.some(name => !handbookItems.some(h => name.includes(h) || h.includes(name)));
            });
        }
        const outputValid = validationErrors.length === 0;
        if (!outputValid) {
            console.warn(`[V2] Problem ${problemIndex + 1} output validation:`, validationErrors);
        }

        const comparatorUsable =
            comparison.confidence !== "low" &&
            Boolean(comparison.finalAuthorizedAnswer?.trim()) &&
            Boolean(comparison.finalSolutionText?.trim()) &&
            // 机械专属：主控失效项分歧是结论级分歧（比较器已把 releaseLabel 降到
            // discussion_only），数值对得上也不能算 verified，必须留给人工质检
            (!isMechanical || (comparison as any).governingAgree !== false);
        finalProblem.qualityLevel = outputValid && comparatorUsable && degradationLevel === 'stable' ? "verified" : "degraded";

        if (isPhysics) {
            const costSummary = getCostSummary(problemIndex);
            (finalProblem.metadata as any).costPerProblem = costSummary.formatted;
            (finalProblem.metadata as any).costDetails = `${costSummary.callCount}次调用, 入${costSummary.inputTokens}tok, 出${costSummary.outputTokens}tok`;
            (finalProblem.metadata as any).modelsUsed = costSummary.modelsUsed.join(', ');
            console.log(`[V2 物理] 第${problemIndex+1}题 成本估算: ${costSummary.formatted} (${costSummary.callCount}次LLM调用, 模型: ${costSummary.modelsUsed.join(', ')})`);
        }

        if (isMaterials) {
            // 材料 V2 专用表格列所需 metadata（「材料题目」sheet 17 列）
            (finalProblem.metadata as any).chosenDimension = reviewedDraft.chosenDimension || '';
            (finalProblem.metadata as any).materialsQuestionType = reviewedDraft.questionType || 'calculation';
            (finalProblem.metadata as any).difficultyLevel = reviewedDraft.difficultyLevel || materialsDifficulty;
            (finalProblem.metadata as any).difficultyLevelLabel = DIFFICULTY_LEVEL_LABEL[(reviewedDraft.difficultyLevel || materialsDifficulty) as MaterialsDifficultyLevel];
            (finalProblem.metadata as any).finalAuthorizedAnswer = comparison.finalAuthorizedAnswer || '';
            (finalProblem.metadata as any).finalSolutionText = comparison.finalSolutionText || '';
            (finalProblem.metadata as any).reviewValidityIssues = reviewResult.validityIssues || [];
            (finalProblem.metadata as any).reviewDifficultyIssues = reviewResult.difficultyIssues || [];
            (finalProblem.metadata as any).qualityLevel = finalProblem.qualityLevel;

            const costSummary = getMaterialsCostSummary(problemIndex);
            (finalProblem.metadata as any).costPerProblem = costSummary.formatted;
            (finalProblem.metadata as any).costDetails = `${costSummary.callCount}次调用, 入${costSummary.inputTokens}tok, 出${costSummary.outputTokens}tok`;
            (finalProblem.metadata as any).modelsUsed = costSummary.modelsUsed.join(', ');
            (finalProblem.metadata as any).tokenUsageByNode = costSummary.usageByNode;
            console.log(`[V2 材料] 第${problemIndex+1}题 成本估算: ${costSummary.formatted} (${costSummary.callCount}次LLM调用, 模型: ${costSummary.modelsUsed.join(', ')})`);
        }

        if (isMechanical) {
            // 机械 V2 metadata：除通用列外，额外落 governing 项与手册待查量，供人工质检
            (finalProblem.metadata as any).chosenDimension = reviewedDraft.chosenDimension || '';
            (finalProblem.metadata as any).mechanicalQuestionType = reviewedDraft.questionType || 'calculation';
            (finalProblem.metadata as any).difficultyLevel = reviewedDraft.difficultyLevel || mechanicalDifficulty;
            (finalProblem.metadata as any).difficultyLevelLabel = MECHANICAL_DIFFICULTY_LABEL[(reviewedDraft.difficultyLevel || mechanicalDifficulty) as MechanicalDifficultyLevel];
            (finalProblem.metadata as any).finalAuthorizedAnswer = comparison.finalAuthorizedAnswer || '';
            (finalProblem.metadata as any).finalSolutionText = comparison.finalSolutionText || '';
            (finalProblem.metadata as any).reviewValidityIssues = reviewResult.validityIssues || [];
            (finalProblem.metadata as any).reviewDifficultyIssues = reviewResult.difficultyIssues || [];
            (finalProblem.metadata as any).governingItem = (reviewedDraft as any).governingItem || '';
            (finalProblem.metadata as any).handbookLookupItems = (reviewedDraft as any).handbookLookupItems || [];
            (finalProblem.metadata as any).roundedQuantities = (reviewedDraft as any).roundedQuantities || [];
            (finalProblem.metadata as any).governingAgree = (comparison as any).governingAgree ?? true;
            (finalProblem.metadata as any).qualityLevel = finalProblem.qualityLevel;

            const costSummary = getMechanicalCostSummary(problemIndex);
            (finalProblem.metadata as any).costPerProblem = costSummary.formatted;
            (finalProblem.metadata as any).costDetails = `${costSummary.callCount}次调用, 入${costSummary.inputTokens}tok, 出${costSummary.outputTokens}tok`;
            (finalProblem.metadata as any).modelsUsed = costSummary.modelsUsed.join(', ');
            (finalProblem.metadata as any).tokenUsageByNode = costSummary.usageByNode;
            console.log(`[V2 机械] 第${problemIndex+1}题 成本估算: ${costSummary.formatted} (${costSummary.callCount}次LLM调用, 模型: ${costSummary.modelsUsed.join(', ')})`);
        }

        if (callbacks?.onProblemGenerated) {
            try {
                await callbacks.onProblemGenerated(finalProblem, problemIndex);
            } catch (saveError) {
                console.warn(`[V2] Save error for problem ${problemIndex + 1}:`, saveError);
            }
        }

        return finalProblem;

    } catch (error) {
        if (mathTrackerId) clearMathTokenTracker(mathTrackerId);
        console.error(`[V2] Problem ${problemIndex + 1} failed:`, error);
        return null;
    }
}

/**
 * V2 Orchestrator — public entry point.
 * Batch mode reuses the existing batchGenerationService (identical to V1).
 */
export async function runV2Workflow(
    rawInput: Partial<UserInput>,
    callbacks?: OrchestratorCallbacks,
    batchConfig?: BatchModeConfig,
    biologyOptions: BiologyV2WorkflowOptions = {}
): Promise<FinalProblem[]> {

    if (rawInput.subject === 'biology' && !batchConfig) {
        return runBiologyV2Workflow(rawInput, callbacks, biologyOptions);
    }

    // ── Batch mode: delegate to existing batch service ─────────────────────────
    if (batchConfig?.mode === "batch") {
        try {
            const batchService = getBatchGenerationService();

            const batchRequest: BatchGenerationRequest = {
                knowledgePointIds: batchConfig.knowledgePointIds,
                difficultyFilter: batchConfig.difficultyFilter,
                trapCounts: [rawInput.trapCount ?? 0],
                language: (rawInput.language as any) || "zh-CN",
                problemCountPerKP: rawInput.problemCount || 1,
                useAntiInterference: rawInput.useAntiInterference ?? true,
                singleQuestion: rawInput.singleQuestion,
                numericAnswerOnly: rawInput.numericAnswerOnly,
                subject: rawInput.subject,
                concurrencyLimit: batchConfig.concurrencyLimit ?? 20,
            };

            const validationErrors = batchService.validateRequest(batchRequest, defaultCatalog);
            if (validationErrors.length > 0) {
                callbacks?.onError?.(`Batch 请求验证失败: ${validationErrors.join(", ")}`);
                throw new Error(validationErrors.join(", "));
            }

            const batchResult = await batchService.generateByKnowledgePoints(
                batchRequest,
                defaultCatalog,
                // Pass V2 workflow as the per-problem generator
                (input: Partial<UserInput>, cb?: OrchestratorCallbacks) =>
                    runV2Workflow(input, cb, undefined, biologyOptions),
                callbacks
            );

            return batchResult.problems;
        } catch (error) {
            callbacks?.onStageChange?.(MultiNodeStage.ERROR, 0);
            callbacks?.onError?.(error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    // ── Single / per-KP mode ───────────────────────────────────────────────────
    const finalProblems: FinalProblem[] = [];

    try {
        callbacks?.onStageChange?.(MultiNodeStage.NODE_0_INPUT, 0);
        const input = validateUserInput(rawInput, {
            requireMathPerturbation: rawInput.subject !== 'math',
        });

        const pLimit = (await import("p-limit")).default;
        const limit = pLimit(5);
        // 先完成父级分支到具体 L2 的不放回抽样，再创建并发任务；
        // 每个任务拿到固定的 L2 名称，避免并发任务重复使用同一次随机路由。
        const selectedMathL2Topics = input.subject === "math"
            ? selectMathV2L2Topics(input.topic, input.problemCount)
            : [];
        // 材料学科：批量分配难度档位（标准/困难/顶级 ≈ 60/30/10，随机打乱）
        const materialsDifficultyLevels = input.subject === "materials"
            ? assignDifficultyLevels(input.problemCount)
            : [];
        // 机械学科：同口径独立分配（标准/困难/顶级 ≈ 60/30/10）
        const mechanicalDifficultyLevels = input.subject === "mechanical"
            ? assignMechanicalDifficultyLevels(input.problemCount)
            : [];

        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const promises = Array.from({ length: input.problemCount }, (_, i) =>
            limit(async () => {
                if (i > 0) await sleep(2000);
                return generateSingleProblemV2(input, i, callbacks, selectedMathL2Topics[i], materialsDifficultyLevels[i], mechanicalDifficultyLevels[i]);
            })
        );

        const results = await Promise.all(promises);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result) {
                finalProblems.push(result);
                callbacks?.onProgress?.(i + 1, input.problemCount);
            }
        }

        callbacks?.onStageChange?.(MultiNodeStage.COMPLETED, input.problemCount);
        return finalProblems;

    } catch (error) {
        callbacks?.onStageChange?.(MultiNodeStage.ERROR, 0);
        callbacks?.onError?.(error instanceof Error ? error.message : String(error));
        throw error;
    }
}
