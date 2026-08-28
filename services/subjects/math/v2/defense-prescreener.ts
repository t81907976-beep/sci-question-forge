export type DefenseTier = "clear" | "grey" | "suspect";

export interface PrescreenResult {
    tier: DefenseTier;
    reasons: string[];
}

const TEMPLATE_PATTERNS = [
    /直接套用|套公式|代入公式|显然由.*公式/,
    /一眼可得|直接计算即可|化简即可/,
];

const CLOSURE_RISK_PATTERNS = [
    /条件不足|没有说明|未说明|未给出|参数范围|定义域|取值范围/,
    /不唯一|多解|无穷多|可能不唯一|答案可能/,
];

const PROOF_RISK_PATTERNS = [
    /显然|易知|不难看出|类似可证/,
    /跳步|循环论证|必要性未证|充分性未证/,
];

function collect(patterns: RegExp[], text: string, reason: string): string[] {
    return patterns.some(pattern => pattern.test(text)) ? [reason] : [];
}

export function prescreenDefense(solutionText: string): PrescreenResult {
    const text = solutionText || "";
    const reasons = [
        ...collect(TEMPLATE_PATTERNS, text, "疑似套公式或模板化解法"),
        ...collect(CLOSURE_RISK_PATTERNS, text, "条件闭合或答案唯一性风险"),
        ...collect(PROOF_RISK_PATTERNS, text, "证明链可能跳步或未闭合"),
    ];

    if (reasons.length >= 2) return { tier: "suspect", reasons };
    if (reasons.length === 1) return { tier: "grey", reasons };
    return { tier: "clear", reasons: [] };
}
