export function buildNumericAnswerGenerationRule(numericAnswerOnly: boolean): string {
    return numericAnswerOnly
        ? "【答案形态硬约束】本题最终答案必须是数值解或表达式，包括确定表达式、方程根集合、区间、函数表达式或代数对象的明确表达；禁止生成证明题、叙述题、开放讨论题，题干不得以“证明/求证/说明/讨论/判断并说明理由”为最终目标。"
        : "";
}

export function buildNumericAnswerReviewRule(numericAnswerOnly: boolean): string {
    return numericAnswerOnly
        ? "【答案形态审查】本题最终目标必须产出数值解或表达式；若题目是证明题、叙述题、开放讨论题，或最终答案只能是一段论证文字，必须进入 clarityIssues，passed=false，并要求修复为求值、求解、求表达式或求明确集合/区间的题目。"
        : "";
}

export function buildNumericAnswerComparisonRule(numericAnswerOnly: boolean): string {
    return numericAnswerOnly
        ? "题目必须保持答案为数值解或表达式；若最终目标是证明题、叙述题或开放讨论题，reasoningValid=false 且 releaseLabel=not_recommended。"
        : "";
}
