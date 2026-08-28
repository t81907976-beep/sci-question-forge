import {
    formatMathPerturbationRulesForPrompt,
    getMathPerturbationRuleByType,
    getMathPerturbationRules,
    type MathPerturbationRule
} from "./perturbation-rules.ts";
import type { MathPerturbationType } from "../../../types/multiNodeTypes.ts";

const rules = getMathPerturbationRules("代数方程");

const firstRule: MathPerturbationRule | undefined = rules[0];

if (!firstRule) {
    throw new Error("Expected at least one math perturbation rule");
}

if (!firstRule.expectedWrongPath || firstRule.manualValidationHints.length === 0) {
    throw new Error("Math perturbation rules must include manual validation hints");
}

const newPerturbationTypes = [
    "constraint_handling_failure",
    "branch_explosion",
    "non_equivalent_transformation",
    "template_overfitting",
    "symbol_role_drift",
    "quantifier_order_error",
    "exact_calculation_fragility",
    "representation_selection_failure",
    "self_check_closure_failure",
    "logical_condition_misjudgment",
] satisfies MathPerturbationType[];

const oldPerturbationTypes = [
    "constraint_forgetting",
    "cot_unfaithfulness",
    "quantifier_translation_failure",
    "self_check_failure",
    "domain_shift",
    "boundary_shift",
    "condition_weakening",
    "parameter_degeneracy",
    "quantifier_swap",
    "distractor_condition",
];

const promptText = formatMathPerturbationRulesForPrompt("函数 方程 参数 矩阵 同余 绝对值 恒成立 精确计算 回代 分类表 充要 必要 充分 弱条件");

for (const type of newPerturbationTypes) {
    if (!promptText.includes(`扰动类型：${type}`)) {
        throw new Error(`Expected new perturbation type in prompt: ${type}`);
    }
}

for (const type of oldPerturbationTypes) {
    if (promptText.includes(`扰动类型：${type}`)) {
        throw new Error(`Old perturbation type should not appear in prompt: ${type}`);
    }
}

for (const type of newPerturbationTypes) {
    const exactRule = getMathPerturbationRuleByType(type);
    if (exactRule.perturbationType !== type) {
        throw new Error(`Expected exact perturbation rule for type: ${type}`);
    }
}
