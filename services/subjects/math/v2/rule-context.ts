import {
    getMathV2L2Node,
    identifyMathV2L2DisciplineWithEvidence,
    type MathV2L2RoutingEvidence,
} from "./l2-catalog.ts";
import {
    getMathV2L2Rules,
    MATH_V2_L2_RULE_VERSION,
    type MathV2L2Rules,
} from "./l2-rules.ts";
import {
    identifyMathV2L3KnowledgeWithEvidence,
    type MathV2L3RoutingEvidence,
} from "./l3/index.ts";
import { getMathV2L3Rules, type MathV2L3Rules } from "./l3/index.ts";

export type MathV2DifficultyLevel = "competition";

export interface MathV2RuleContext {
    topicLevel: "L2" | "L3";
    disciplineKey: string;
    disciplineName: string;
    difficultyLevel: MathV2DifficultyLevel;
    peak_difficulty: string;
    forbidden_errors: string[];
    parameter_constraints: Record<string, string>;
    anti_pattern_strategies: string[];
    v2_strategies: string[];
    v2_constraints: string[];
    ruleVersion: string;
    routingEvidence: MathV2L2RoutingEvidence;
    ruleSnapshot: MathV2L2Rules;
    validation: {
        l2RoutingVerified: "unverified";
        l2RuleViolation: string[];
        l2RuleEffective: "unverified";
    };
    generationBlock: string;
    reviewBlock: string;
    l3Key?: string;
    l3Name?: string;
    l3RoutingEvidence?: MathV2L3RoutingEvidence;
    l3RuleSnapshot?: MathV2L3Rules;
}

function formatList(title: string, items: string[], fallback: string): string {
    const content = items.length ? items.map((item, index) => `${index + 1}. ${item}`).join("\n") : fallback;
    return `【${title}】\n${content}`;
}

function formatRecord(title: string, record: Record<string, string>, fallback: string): string {
    const entries = Object.entries(record);
    const content = entries.length
        ? entries.map(([key, value], index) => `${index + 1}. ${key}：${value}`).join("\n")
        : fallback;
    return `【${title}】\n${content}`;
}

function formatL3Rules(rules: MathV2L3Rules): string[] {
    const scenarioEntries = Object.entries(rules.scenarioChecks)
        .map(([name, checks]) => formatList(`专项检查：${name}`, checks, "无"))
        .join("\n\n");

    return [
        formatList("L3 定义", rules.definitions, "无"),
        formatList("L3 公式", rules.formulas, "无"),
        formatList("L3 定理", rules.theorems, "无"),
        formatList("L3 通用要求", rules.generalRequirements, "无"),
        formatList("L3 禁止错误", rules.forbiddenErrors, "无"),
        formatRecord("L3 参数约束", rules.parameterConstraints, "无"),
        formatList("L3 闭合检查", rules.closureChecks, "无"),
        scenarioEntries,
    ].filter(Boolean);
}

export function buildMathV2RuleContext(knowledgePoint: string): MathV2RuleContext {
    const l3RoutingEvidence = identifyMathV2L3KnowledgeWithEvidence(knowledgePoint);
    const routingEvidence = l3RoutingEvidence
        ? identifyMathV2L2DisciplineWithEvidence(getMathV2L2Node(l3RoutingEvidence.l2Key).name)
        : identifyMathV2L2DisciplineWithEvidence(knowledgePoint);
    const disciplineKey = l3RoutingEvidence?.l2Key || routingEvidence.disciplineKey;
    const discipline = getMathV2L2Node(disciplineKey);
    const rules = getMathV2L2Rules(disciplineKey);
    const peak_difficulty = rules.peak_difficulty;
    const forbidden_errors = rules.forbidden_errors;
    const parameter_constraints = rules.parameter_constraints;
    const anti_pattern_strategies = rules.anti_pattern_strategies;
    const v2_strategies = rules.v2_strategies;
    const v2_constraints = rules.v2_constraints;
    const ruleSnapshot: MathV2L2Rules = {
        peak_difficulty,
        forbidden_errors,
        parameter_constraints,
        anti_pattern_strategies,
        v2_strategies,
        v2_constraints,
    };

    const generationStrategies = [...anti_pattern_strategies, ...v2_strategies];
    const l3Rules = l3RoutingEvidence ? getMathV2L3Rules(l3RoutingEvidence.l3Key) : undefined;
    const l3RuleBlock = l3Rules ? formatL3Rules(l3Rules) : [];

    const generationBlock = [
        `【数学 V2 规则匹配】${discipline.name}（${disciplineKey}）`,
        `【固定难度】竞赛级 / 高防御，不读取前端难度等级`,
        `【竞赛级难度要求】\n${peak_difficulty || "必须形成非模板化推理、判断分叉和完整证明闭环。"}`,
        formatList("反模板策略", generationStrategies, "必须避免单步套公式、机械代入和教材模板题。"),
        formatRecord("参数约束", parameter_constraints, "若题目涉及参数、定义域或退化情形，必须显式给出并核对相应条件。"),
        ...(l3Rules ? [`【L3 规则匹配】${l3RoutingEvidence!.l3Name}（${l3RoutingEvidence!.l3Key}）`, ...l3RuleBlock] : []),
    ].join("\n\n");

    const reviewBlock = [
        `【数学 V2 审查规则匹配】${discipline.name}（${disciplineKey}）`,
        `【固定难度】竞赛级 / 高防御，不接受低难模板题降级`,
        `【竞赛级难度要求】\n${peak_difficulty || "必须形成非模板化推理、判断分叉和完整证明闭环。"}`,
        formatList("V2 强制约束", v2_constraints, "必须检查题目实际涉及的适用条件、错误禁区和闭合要求。"),
        formatList("高频错误", forbidden_errors, "不得遗漏题目实际涉及的定义域、边界、必要充分性或回代检验。"),
        formatRecord("参数约束", parameter_constraints, "参数必须自洽，且不得制造退化、无解或多解歧义。"),
        "【闭合验收】题干条件充分、答案唯一、证明链完整、定义域/边界已检查、最终答案已回代或用必要充分性闭合。",
        ...(l3Rules ? [`【L3 规则匹配】${l3RoutingEvidence!.l3Name}（${l3RoutingEvidence!.l3Key}）`, ...l3RuleBlock] : []),
    ].join("\n\n");

    return {
        topicLevel: l3RoutingEvidence ? "L3" : "L2",
        disciplineKey,
        disciplineName: discipline.name,
        difficultyLevel: "competition",
        peak_difficulty,
        forbidden_errors,
        parameter_constraints,
        anti_pattern_strategies,
        v2_strategies,
        v2_constraints,
        ruleVersion: MATH_V2_L2_RULE_VERSION,
        routingEvidence,
        ruleSnapshot,
        validation: {
            l2RoutingVerified: "unverified",
            l2RuleViolation: [],
            l2RuleEffective: "unverified",
        },
        generationBlock,
        reviewBlock,
        l3Key: l3RoutingEvidence?.l3Key,
        l3Name: l3RoutingEvidence?.l3Name,
        l3RoutingEvidence: l3RoutingEvidence || undefined,
        l3RuleSnapshot: l3Rules,
    };
}
