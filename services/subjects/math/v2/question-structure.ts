export function buildMathV2QuestionStructureRule(singleQuestion: boolean): string {
    return singleQuestion
        ? "【单问硬约束】本题必须只有一个求解目标，禁止出现 (1)(2)、（1）（2）、第一问/第二问等多小问结构；若出现，必须判为不合格。"
        : [
            "【多问硬约束】允许非单问时也不是自由多问，整题最多 2 问。",
            "若为 2 问，第 1 问必须产出第 2 问不可跳过的主硬闭合点；第 2 问必须显式使用第 1 问结论完成最终求解或证明。",
            "禁止两个并列任务、递进但可跳过的铺垫题、为了凑难度拆问；超过 2 问或两问无必要依赖，必须判为不合格。",
        ].join("\n");
}

export function buildMathV2QuestionStructureGenerationRule(singleQuestion: boolean): string {
    return singleQuestion
        ? `${buildMathV2QuestionStructureRule(true)}\n【A1 生题要求】题干、requiredAnswer、referenceAnswer、referenceSteps 都必须围绕唯一求解目标组织。`
        : `${buildMathV2QuestionStructureRule(false)}\n【A1 生题要求】若生成 2 问，requiredAnswer、referenceAnswer、referenceSteps 必须说明第 1 问结论如何作为第 2 问的主硬闭合点；若做不到，必须压回单问。`;
}

export function buildMathV2QuestionStructureReviewRule(singleQuestion: boolean): string {
    return singleQuestion
        ? `${buildMathV2QuestionStructureRule(true)}若违反，必须进入 clarityIssues 且 passed=false。`
        : `${buildMathV2QuestionStructureRule(false)}若超过 2 问，或第 1 问不是第 2 问的必要主硬闭合前提，必须进入 clarityIssues 或 depthIssues 且 passed=false。`;
}

export function buildMathV2QuestionStructureComparisonRule(singleQuestion: boolean): string {
    return singleQuestion
        ? `${buildMathV2QuestionStructureRule(true)}若题干含多小问结构，reasoningValid=false 且 releaseLabel=not_recommended。`
        : `${buildMathV2QuestionStructureRule(false)}若超过 2 问，或第 1 问不是第 2 问不可跳过的主硬闭合点，reasoningValid=false 且 releaseLabel=not_recommended。`;
}
