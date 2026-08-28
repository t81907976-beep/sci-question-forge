import type { UserInput, TextbookConstraints } from "../../types/multiNodeTypes.ts";

/**
 * Node 0: User Input Configuration
 * 
 * Validates and structures user input for the problem generation workflow
 */

export function normalizeTrapCountForSubject(subject: UserInput['subject'], trapCount: number | undefined): number {
    const fallback = trapCount ?? 2;
    if (subject === 'math') {
        return Math.min(Math.max(fallback, 1), 4);
    }
    return Math.min(Math.max(fallback, 0), 5);
}

export function validateUserInput(
    rawInput: Partial<UserInput>,
    options: { requireMathPerturbation?: boolean } = {}
): UserInput {
    const subject = rawInput.subject || 'chemistry';
    const requireMathPerturbation = options.requireMathPerturbation ?? true;

    if (subject === 'math' && requireMathPerturbation && !rawInput.perturbationType) {
        throw new Error('Math perturbationType is required');
    }

    // Default values
    const defaults: UserInput = {
        subject,
        topic: rawInput.topic || '化学平衡',
        trapCount: normalizeTrapCountForSubject(subject, rawInput.trapCount),
        problemCount: Math.min(Math.max(rawInput.problemCount || 3, 1), 100),
        allowTableLookup: rawInput.allowTableLookup ?? true,
        singleQuestion: rawInput.singleQuestion ?? false,
        numericAnswerOnly: rawInput.numericAnswerOnly ?? false,
        perturbationType: rawInput.perturbationType,
        chapterRange: rawInput.chapterRange,
        materialsQuestionType: rawInput.materialsQuestionType,
        mechanicalQuestionType: rawInput.mechanicalQuestionType,
    };

    // Validation
    if (!defaults.topic.trim()) {
        throw new Error('Topic cannot be empty');
    }

    if (defaults.problemCount < 1 || defaults.problemCount > 100) {
        throw new Error('Problem count must be between 1 and 100');
    }

    return defaults;
}

// We no longer compute trapCount from difficulty, as trapCount is passed directly.
// But we still return a config object for other parameters if needed by legacy nodes.
export function getDifficultyConstraints(trapCount: number): {
    minReasoningSteps: number;
    trapCount: number;
    allowQuantitativeReasoning: boolean;
} {
    return {
        minReasoningSteps: 4 + trapCount, // Higher trap count = more steps
        trapCount: trapCount,
        allowQuantitativeReasoning: true
    };
}
