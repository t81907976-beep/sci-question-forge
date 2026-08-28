export type MathDifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'competition';

export function getMathDifficultyLevel(difficulty: number): MathDifficultyLevel {
    if (difficulty === 1) return 'basic';
    if (difficulty === 2) return 'intermediate';
    if (difficulty === 3) return 'advanced';
    return 'competition';
}

export function getMathMinimumReasoningSteps(difficulty: number): number {
    const level = getMathDifficultyLevel(difficulty);
    const steps = {
        basic: 4,
        intermediate: 6,
        advanced: 8,
        competition: 10
    };
    return steps[level];
}
