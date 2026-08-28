import { identifyDiscipline, FINANCE_DISCIPLINES } from '../disciplines';
import type { KPAnalysisResult } from './kp-analyzer';
import type { V2QuestionDraft } from './generator';
import type { ReviewResult } from './reviewer';
import type { BlindSolverResult } from './blind-solver';
import type { ComparisonResult } from './comparator';

/**
 * 把金融 V2 链路各节点的产物收敛成一组 metadata 字段。
 *
 * 存在的理由：金融落表要的是"难度证据链"（难度审查 / 盲解对抗 / 裁判判定），
 * 这些字段化学口径的 metadata 里没有。集中在金融路径下拼装，
 * orchestrator 只负责挂载，列结构调整不用动编排层。
 */
export interface FinanceV2MetadataInput {
    inputKnowledgePoint: string;
    kpAnalysis: KPAnalysisResult;
    reviewedDraft: V2QuestionDraft;
    reviewResult: ReviewResult;
    repairCycles: number;
    degradationLevel: string;
    degradationReason: string;
    blindResult: BlindSolverResult;
    comparison: ComparisonResult;
}

export function buildFinanceV2Metadata(input: FinanceV2MetadataInput): Record<string, unknown> {
    const {
        inputKnowledgePoint,
        kpAnalysis,
        reviewedDraft,
        reviewResult,
        repairCycles,
        degradationLevel,
        degradationReason,
        blindResult,
        comparison,
    } = input;

    const disciplineKey = identifyDiscipline(inputKnowledgePoint) as keyof typeof FINANCE_DISCIPLINES;

    return {
        inputKeyword: inputKnowledgePoint,
        financeDisciplineKey: disciplineKey,
        financeDisciplineName: FINANCE_DISCIPLINES[disciplineKey]?.name || '',
        chosenDimension: reviewedDraft.chosenDimension,
        suggestedDifficulty: kpAnalysis.suggestedDifficulty,
        reviewPassed: reviewResult.passed,
        reviewVerdict: reviewResult.overallVerdict,
        reviewValidityIssues: reviewResult.validityIssues,
        reviewDifficultyIssues: reviewResult.difficultyIssues,
        reviewDepthIssues: reviewResult.depthIssues,
        repairCycles,
        degradationLevel,
        degradationReason,
        blindSolveSolvable: blindResult.isSolvable,
        blindSolveAnswer: blindResult.blindFinalAnswer || blindResult.blindAnswer || '',
        blindSolveFailReason: blindResult.failReason || '',
        answersAgree: comparison.answersAgree,
        discrepancies: comparison.discrepancies,
        comparisonConfidence: comparison.confidence,
        comparisonNotes: comparison.notes,
        reasoningValid: comparison.reasoningValid,
        reasoningIssues: comparison.reasoningIssues,
        solutionRepaired: comparison.solutionRepaired,
        repairSummary: comparison.repairSummary,
        releaseLabel: comparison.releaseLabel,
        finalAuthorizedAnswer: comparison.finalAuthorizedAnswer,
        finalSolutionText: comparison.finalSolutionText,
    };
}
