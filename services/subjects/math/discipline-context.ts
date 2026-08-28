import { MATH_DISCIPLINES } from './disciplines.ts';

export interface MathGenerationGuidance {
    disciplineKey: string;
    name: string;
    keywords: string[];
    level: string;
    antiPatternStrategies: string[];
}

export interface MathValidationRules {
    disciplineKey: string;
    name: string;
    forbiddenQuestionTypes: string[];
    forbiddenErrors: string[];
    parameterConstraints: Record<string, string>;
}

export interface MathDisciplineContext {
    generationGuidance: MathGenerationGuidance;
    validationRules: MathValidationRules;
}

type MathDifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'competition';

export function buildMathDisciplineContext(
    disciplineKey: string,
    difficulty: MathDifficultyLevel
): MathDisciplineContext {
    const discipline = MATH_DISCIPLINES[disciplineKey] ?? MATH_DISCIPLINES['algebra-equation'];
    const resolvedKey = MATH_DISCIPLINES[disciplineKey] ? disciplineKey : 'algebra-equation';

    return {
        generationGuidance: {
            disciplineKey: resolvedKey,
            name: discipline.name,
            keywords: discipline.keywords ?? [],
            level: discipline.levels?.[difficulty] ?? discipline.levels?.intermediate ?? '',
            antiPatternStrategies: discipline.anti_pattern_strategies ?? []
        },
        validationRules: {
            disciplineKey: resolvedKey,
            name: discipline.name,
            forbiddenQuestionTypes: discipline.forbidden_question_types ?? [],
            forbiddenErrors: discipline.forbidden_errors ?? [],
            parameterConstraints: discipline.parameter_constraints ?? {}
        }
    };
}
