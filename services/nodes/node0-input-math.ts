import type { UserInput, TextbookConstraints } from "../../types/multiNodeTypes";

/**
 * Node 0: User Input Configuration
 * 
 * Validates and structures user input for the problem generation workflow
 */

export function validateUserInput(rawInput: Partial<UserInput>): UserInput {
    // Default values
    const defaults: UserInput = {
        topic: rawInput.topic || '代数方程',
        trapCount: Math.min(Math.max(rawInput.trapCount ?? 2, 0), 5),
        problemCount: Math.min(Math.max(rawInput.problemCount || 3, 1), 100),
        allowTableLookup: rawInput.allowTableLookup ?? true,
        chapterRange: rawInput.chapterRange
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

/**
 * Get trapCount-specific constraints
 */
export function getDifficultyConstraints(trapCount: UserInput['trapCount']): {
    minReasoningSteps: number;
    trapCount: number;
    allowQuantitativeReasoning: boolean;
} {
    if (trapCount <= 1) {
        return { minReasoningSteps: 4, trapCount: 1, allowQuantitativeReasoning: false };
    } else if (trapCount <= 2) {
        return { minReasoningSteps: 6, trapCount: 2, allowQuantitativeReasoning: true };
    } else if (trapCount <= 4) {
        return { minReasoningSteps: 7, trapCount: 3, allowQuantitativeReasoning: true };
    } else {
        return { minReasoningSteps: 8, trapCount: 4, allowQuantitativeReasoning: true };
    }
}
