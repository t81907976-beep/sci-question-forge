export type MathV2L3Kind = "object" | "formula" | "theorem" | "lemma" | "criterion" | "algorithm";

export interface MathV2L3Node {
    id: string;
    l2Key: string;
    name: string;
    kind: MathV2L3Kind;
    aliases: string[];
}

export type MathV2L3MatchMethod = "exact_key" | "exact_name" | "alias";

export interface MathV2L3RoutingEvidence {
    l3Key: string;
    l2Key: string;
    l3Name: string;
    matchMethod: MathV2L3MatchMethod;
    matchedAlias: string;
}

export interface MathV2L3Rules {
    // 该 L3 知识项的正式定义、研究对象和基本语义。
    definitions: string[];
    // 可直接用于命题或推导的公式；每条公式应同时说明必要的符号和适用约定。
    formulas: string[];
    // 与该 L3 知识项直接相关的定理、引理或等价结论及其成立前提。
    theorems: string[];
    // 只要题目使用该 L3，就必须满足的通用命题和审查要求。
    generalRequirements: string[];
    // 该 L3 最容易出现的数学性错误；审查器据此检查错误结论和非法推导。
    forbiddenErrors: string[];
    // 题目中的算子、参数、定义域、边界和非退化条件等必须满足的约束。
    parameterConstraints: Record<string, string>;
    // 不依赖某个特殊题型的通用闭合动作，例如回代、边界核验和唯一性证明。
    closureChecks: string[];
    // 只有题目满足对应场景前提时才启用的专项检查。
    scenarioChecks: Record<string, string[]>;
}
