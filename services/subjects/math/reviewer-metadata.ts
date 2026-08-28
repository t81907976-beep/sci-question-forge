import type { FinalProblem } from "../../../types/multiNodeTypes.ts";

type MathReviewMetadata = FinalProblem["metadata"];

export function requireMathReviewMetadata(metadata: MathReviewMetadata | null | undefined): MathReviewMetadata {
    if (!metadata) {
        throw new Error("Math review metadata is required");
    }

    const requiredFields: Array<keyof MathReviewMetadata> = [
        "disciplineKey",
        "disciplineName",
        "difficultyLevel",
        "validationRules",
        "perturbationType",
        "predictedFailureMode",
        "expectedWrongPath",
        "divergenceStep",
        "manualValidationChecklist",
    ];

    for (const field of requiredFields) {
        const value = metadata[field];
        if (Array.isArray(value) ? value.length === 0 : !value) {
            throw new Error(`Math review metadata missing ${String(field)}`);
        }
    }

    return metadata;
}
