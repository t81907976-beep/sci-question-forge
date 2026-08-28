export interface MathHardClosurePlan {
    targetFailureMode: string;
    mainHardClosurePoint: string;
    auxiliaryClosurePoints: string[];
    invalidShortcut: string;
}

export const DEFAULT_MATH_HARD_CLOSURE_PLAN: MathHardClosurePlan = {
    targetFailureMode: "定义域/边界闭合失败",
    mainHardClosurePoint: "必须检查定义域、边界条件或参数非退化条件后才能得到最终答案。",
    auxiliaryClosurePoints: ["答案唯一性", "回代检验"],
    invalidShortcut: "直接套公式或形式变形后不检查定义域、边界和回代条件。",
};

function normalizeString(value: unknown): string {
    return String(value || "").trim();
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => normalizeString(item)).filter(Boolean) : [];
}

export function normalizeHardClosurePlan(parsed: Partial<MathHardClosurePlan> | undefined): MathHardClosurePlan {
    const auxiliaryClosurePoints = normalizeStringArray(parsed?.auxiliaryClosurePoints);

    return {
        targetFailureMode: normalizeString(parsed?.targetFailureMode) || DEFAULT_MATH_HARD_CLOSURE_PLAN.targetFailureMode,
        mainHardClosurePoint: normalizeString(parsed?.mainHardClosurePoint) || DEFAULT_MATH_HARD_CLOSURE_PLAN.mainHardClosurePoint,
        auxiliaryClosurePoints: auxiliaryClosurePoints.length
            ? auxiliaryClosurePoints.slice(0, 2)
            : DEFAULT_MATH_HARD_CLOSURE_PLAN.auxiliaryClosurePoints,
        invalidShortcut: normalizeString(parsed?.invalidShortcut) || DEFAULT_MATH_HARD_CLOSURE_PLAN.invalidShortcut,
    };
}

export function formatHardClosurePlan(plan: MathHardClosurePlan): string {
    return [
        `【目标失败机制】${plan.targetFailureMode}`,
        `【主硬闭合点】${plan.mainHardClosurePoint}`,
        `【辅助闭合点】${plan.auxiliaryClosurePoints.join("；") || "无"}`,
        `【禁止捷径】${plan.invalidShortcut}`,
    ].join("\n");
}

export function buildMathHardClosureGenerationRule(plan: MathHardClosurePlan): string {
    return `【数学硬闭合点设计（对齐物理 V2）】
每道题必须只突出 1 个主硬闭合点，并允许 1-2 个辅助闭合点。不得把定义域、边界、唯一性、量词、分支、归一化等多个机制无序堆叠。
${formatHardClosurePlan(plan)}

生成要求：
1. 主硬闭合点必须是解题必经步骤，跳过它会得到错误答案或无法证明唯一性。
2. 题干不得直接提示该闭合点的处理方式；解答必须显式完成它。
3. 标准答案必须指出禁止捷径为什么非法。`;
}

export function buildMathHardClosureReviewRule(plan: MathHardClosurePlan): string {
    return `【数学硬闭合点验收（对齐物理 V2）】
${formatHardClosurePlan(plan)}

审查要求：
1. 若题目没有把主硬闭合点设计成解题必经步骤，必须进入 depthIssues 且 passed=false。
2. 若标准答案没有显式完成主硬闭合点，或没有排除禁止捷径，必须进入 correctnessIssues。
3. 若题目同时堆叠多个同等主导失败机制，导致失败归因不清，必须进入 depthIssues。`;
}
