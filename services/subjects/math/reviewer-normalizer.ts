import type {
    ReviewFailureType,
    ReviewRetryFromNode,
    ReviewRetryHint
} from "../../../types/multiNodeTypes";

export interface DisciplineGateReview {
    disciplineMatched: boolean;
    difficultyMatched: boolean;
    forbiddenQuestionTypeHit: boolean;
    forbiddenErrorHit: boolean;
    parameterConstraintViolated: boolean;
    issues: string[];
}

export interface PerturbationGateReview {
    perturbationMatched: boolean;
    expectedWrongPathNatural: boolean;
    divergenceStepClear: boolean;
    checklistUsable: boolean;
    issues: string[];
}

export interface ReviewResult {
    passed: boolean;
    qualityLabel: "manual_validation_ready" | "needs_rework" | "invalid";
    failureType: ReviewFailureType;
    retryFromNode: ReviewRetryFromNode;
    retryHint?: ReviewRetryHint;
    queryIssues: string[];
    responseIssues: string[];
    difficultyIssues: string[];
    overallVerdict: string;
    disciplineGate?: DisciplineGateReview;
    perturbationGate?: PerturbationGateReview;
}

const REVIEW_FAILURE_TYPES: ReviewFailureType[] = [
    'none',
    'too_easy',
    'template_problem',
    'topic_mismatch',
    'contradictory_conditions',
    'unsolvable',
    'non_unique_answer',
    'solution_math_error',
    'solution_incomplete',
    'unclear_statement',
    'perturbation_invalid',
    'format_issue',
    'review_parse_failed'
];

function isReviewFailureType(value: unknown): value is ReviewFailureType {
    return typeof value === 'string' && REVIEW_FAILURE_TYPES.includes(value as ReviewFailureType);
}

export function mapReviewFailureToRetryNode(failureType: ReviewFailureType): ReviewRetryFromNode {
    switch (failureType) {
        case 'none':
            return null;
        case 'too_easy':
        case 'template_problem':
        case 'topic_mismatch':
        case 'contradictory_conditions':
        case 'unsolvable':
        case 'non_unique_answer':
            return 2;
        case 'solution_math_error':
        case 'solution_incomplete':
            return 5;
        case 'unclear_statement':
            return 6;
        case 'perturbation_invalid':
            return 2;
        case 'format_issue':
            return 7;
        case 'review_parse_failed':
            return 'reviewer';
    }
}

function toStringArray(value: unknown): string[] {
    return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : [];
}

function normalizeDisciplineGate(value: unknown): DisciplineGateReview | undefined {
    if (!value || typeof value !== 'object') return undefined;
    const gate = value as Partial<DisciplineGateReview>;
    return {
        disciplineMatched: gate.disciplineMatched === true,
        difficultyMatched: gate.difficultyMatched === true,
        forbiddenQuestionTypeHit: gate.forbiddenQuestionTypeHit === true,
        forbiddenErrorHit: gate.forbiddenErrorHit === true,
        parameterConstraintViolated: gate.parameterConstraintViolated === true,
        issues: toStringArray(gate.issues)
    };
}

function normalizePerturbationGate(value: unknown): PerturbationGateReview | undefined {
    if (!value || typeof value !== 'object') return undefined;
    const gate = value as Partial<PerturbationGateReview>;
    return {
        perturbationMatched: gate.perturbationMatched === true,
        expectedWrongPathNatural: gate.expectedWrongPathNatural === true,
        divergenceStepClear: gate.divergenceStepClear === true,
        checklistUsable: gate.checklistUsable === true,
        issues: toStringArray(gate.issues)
    };
}

function inferFailureTypeFromLegacyIssues(parsed: Partial<ReviewResult>): ReviewFailureType {
    const queryText = toStringArray(parsed.queryIssues).join('\n');
    const responseText = toStringArray(parsed.responseIssues).join('\n');
    const difficultyText = toStringArray(parsed.difficultyIssues).join('\n');
    const allText = `${queryText}\n${responseText}\n${difficultyText}\n${parsed.overallVerdict ?? ''}`;

    if (/格式|字段|JSON|givenData|reasoningChain|final object|输出/.test(allText)) {
        return 'format_issue';
    }
    if (/主题|核心|不相关|跑题/.test(queryText)) {
        return 'topic_mismatch';
    }
    if (/模板|套路|套题|一元二次|分式不等式|重复/.test(allText)) {
        return 'template_problem';
    }
    if (/矛盾|冲突|不自洽|互相矛盾|约束|定义域|参数/.test(queryText)) {
        return 'contradictory_conditions';
    }
    if (/无解|不可解|不存在解/.test(allText)) {
        return 'unsolvable';
    }
    if (/不唯一|多解|唯一.*不明确|答案.*多个/.test(allText)) {
        return 'non_unique_answer';
    }
    if (/计算错误|算错|推导错误|数学错误|结果错误/.test(responseText)) {
        return 'solution_math_error';
    }
    if (/不完整|跳步|缺少|分类讨论|关键步骤/.test(responseText)) {
        return 'solution_incomplete';
    }
    if (/歧义|不清楚|表述|符号.*未定义|变量.*未定义/.test(queryText)) {
        return 'unclear_statement';
    }
    if (difficultyText.length > 0 || /简单|难度|层级|边界卡|竞赛|深度|步数不足/.test(allText)) {
        return 'too_easy';
    }
    if (responseText.length > 0) {
        return 'solution_incomplete';
    }
    if (queryText.length > 0) {
        return 'contradictory_conditions';
    }
    return 'too_easy';
}

function gateFailureType(
    disciplineGate: DisciplineGateReview | undefined,
    perturbationGate: PerturbationGateReview | undefined
): ReviewFailureType | null {
    if (disciplineGate) {
        if (!disciplineGate.disciplineMatched) return 'topic_mismatch';
        if (!disciplineGate.difficultyMatched) return 'too_easy';
        if (disciplineGate.forbiddenQuestionTypeHit) return 'template_problem';
        if (disciplineGate.forbiddenErrorHit || disciplineGate.parameterConstraintViolated) {
            return 'contradictory_conditions';
        }
    }

    if (perturbationGate) {
        if (!perturbationGate.perturbationMatched) return 'perturbation_invalid';
        if (!perturbationGate.expectedWrongPathNatural || !perturbationGate.divergenceStepClear || !perturbationGate.checklistUsable) {
            return 'perturbation_invalid';
        }
    }

    return null;
}

export function normalizeReviewResult(parsed: Partial<ReviewResult>): ReviewResult {
    const disciplineGate = normalizeDisciplineGate(parsed.disciplineGate);
    const perturbationGate = normalizePerturbationGate(parsed.perturbationGate);
    const gateIssues = [
        ...(disciplineGate?.issues ?? []),
        ...(perturbationGate?.issues ?? [])
    ];
    const queryIssues = [...toStringArray(parsed.queryIssues), ...gateIssues];
    const responseIssues = toStringArray(parsed.responseIssues);
    const difficultyIssues = toStringArray(parsed.difficultyIssues);
    const legacyHasIssues = queryIssues.length > 0 || responseIssues.length > 0 || difficultyIssues.length > 0;
    const gateFailure = gateFailureType(disciplineGate, perturbationGate);

    const passed = parsed.passed === true && !legacyHasIssues && !gateFailure;
    const failureType: ReviewFailureType = passed
        ? 'none'
        : gateFailure
            ?? (isReviewFailureType(parsed.failureType) && parsed.failureType !== 'none'
                ? parsed.failureType
                : inferFailureTypeFromLegacyIssues({
                    ...parsed,
                    queryIssues,
                    responseIssues,
                    difficultyIssues
                } as Partial<ReviewResult>));

    return {
        passed,
        qualityLabel: passed
            ? 'manual_validation_ready'
            : parsed.qualityLabel === 'invalid'
                ? 'invalid'
                : 'needs_rework',
        failureType,
        retryFromNode: passed ? null : mapReviewFailureToRetryNode(failureType),
        retryHint: parsed.retryHint && typeof parsed.retryHint === 'object'
            ? parsed.retryHint
            : undefined,
        queryIssues,
        responseIssues,
        difficultyIssues,
        overallVerdict: typeof parsed.overallVerdict === 'string'
            ? parsed.overallVerdict
            : passed
                ? '审查通过'
                : '审查未通过',
        disciplineGate,
        perturbationGate
    };
}
