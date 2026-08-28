import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { identifyMathV2L2DisciplineWithEvidence, MATH_V2_L2_CATALOG } from "./l2-catalog.ts";
import { getMathV2L2Rules, MATH_V2_L2_RULES } from "./l2-rules.ts";
import { buildMathV2RuleContext } from "./rule-context.ts";

test("math V2 L2 rules cover every catalog direction", () => {
  assert.deepEqual(Object.keys(MATH_V2_L2_RULES).sort(), Object.keys(MATH_V2_L2_CATALOG).sort());

  for (const key of Object.keys(MATH_V2_L2_CATALOG)) {
    const rules = getMathV2L2Rules(key);
    assert.ok(rules.peak_difficulty.length > 30, `${key} should define subject-specific peak difficulty`);
    assert.ok(rules.forbidden_errors.length >= 4, `${key} should have detailed forbidden errors`);
    assert.ok(rules.forbidden_errors.every(item => /^【.+】/.test(item)), `${key} forbidden errors should be titled`);
    assert.ok(Object.keys(rules.parameter_constraints).length >= 3, `${key} should have parameter constraints`);
    assert.ok(rules.anti_pattern_strategies.length >= 4, `${key} should have anti-pattern strategies`);
    assert.ok(rules.v2_strategies.length >= 2, `${key} should have V2 strategies`);
    assert.ok(rules.v2_strategies.every(item => item.includes("\n- ")), `${key} V2 strategies should be multi-line strategy blocks`);
    assert.ok(rules.v2_constraints.length >= 5, `${key} should have V2 constraints`);
  }
});

test("math V2 L2 rules are written as an explicit 66-key table", () => {
  const source = readFileSync(new URL("l2-rules.ts", import.meta.url), "utf8");

  assert.doesNotMatch(source, /\bPROFILES\b/);
  assert.doesNotMatch(source, /\bbuildRulesForKey\b/);
  assert.doesNotMatch(source, /Object\.fromEntries/);
  assert.doesNotMatch(source, /toPhysicsStyleRule/);
  assert.doesNotMatch(source, /MathV2L2RuleSource/);
  assert.doesNotMatch(source, /competitionGuidance:/);
  assert.doesNotMatch(source, /forbiddenQuestionTypes:/);
  assert.doesNotMatch(source, /closureChecks:/);

  for (const key of Object.keys(MATH_V2_L2_CATALOG)) {
    assert.match(source, new RegExp(`"${key}"\\s*:`), `${key} should be explicit in l2-rules.ts`);
  }
});

test("pde-distribution V2 rules keep distribution boundary trace checks", () => {
  const context = buildMathV2RuleContext("pde-distribution");

  assert.equal(context.disciplineKey, "pde-distribution");
  assert.ok(context.forbidden_errors.some(item => item.includes("delta")));
  assert.ok(context.v2_constraints.some(item => item.includes("测试函数")));
  assert.ok(context.forbidden_errors.some(item => item.includes("一阶导数") && item.includes("delta")));
  assert.ok(context.forbidden_errors.every(item => !item.includes("delta 导数项")));
  assert.match(context.generationBlock, /数学 V2 规则匹配/);
  assert.match(context.generationBlock, /竞赛级难度要求/);
  assert.match(context.generationBlock, /反模板策略/);
  assert.match(context.generationBlock, /反模板策略/);
  assert.doesNotMatch(context.generationBlock, /禁用错误/);
  assert.doesNotMatch(context.generationBlock, /V2 强制约束/);
  assert.match(context.reviewBlock, /高频错误/);
  assert.match(context.reviewBlock, /参数约束/);
  assert.match(context.reviewBlock, /V2 强制约束/);
  assert.doesNotMatch(context.reviewBlock, /反模板策略/);
  assert.doesNotMatch(context.reviewBlock, /V2 专项策略/);
  assert.match(context.reviewBlock, /题干条件充分、答案唯一、证明链完整/);
  assert.doesNotMatch(context.reviewBlock, /仅核验题目实际涉及/);
});

test("L2 rule context preserves the main generation and review responsibility split", () => {
  const context = buildMathV2RuleContext("线性代数");
  assert.equal(context.disciplineKey, "algebra-linear");

  const generationHeadings = [...context.generationBlock.matchAll(/^【([^】]+)】/gm)].map(match => match[1]);
  assert.deepEqual(generationHeadings, [
    "数学 V2 规则匹配",
    "固定难度",
    "竞赛级难度要求",
    "反模板策略",
    "参数约束",
  ]);

  const reviewHeadings = [...context.reviewBlock.matchAll(/^【([^】]+)】/gm)].map(match => match[1]);
  assert.deepEqual(reviewHeadings, [
    "数学 V2 审查规则匹配",
    "固定难度",
    "竞赛级难度要求",
    "V2 强制约束",
    "高频错误",
    "参数约束",
    "闭合验收",
  ]);
});

test("math V2 rules avoid global template leakage and known mathematical ambiguities", () => {
  const source = readFileSync(new URL("l2-rules.ts", import.meta.url), "utf8");

  assert.doesNotMatch(source, /scope_boundary:/);
  assert.doesNotMatch(source, /顶级考核必须具体落在/);
  assert.doesNotMatch(source, /对象-约束-闭合链路/);
  assert.doesNotMatch(source, /在题面中保留一个低防御模型容易跳过的分支/);
  assert.doesNotMatch(source, /审查时按高频错误、参数约束和 V2 强制约束逐项判定/);
  assert.doesNotMatch(source, /若题目或解析触发该情形/);
  assert.doesNotMatch(source, /加入一个会暴露低防御解法的局部陷阱/);
  assert.doesNotMatch(source, /题干不得直接暴露关键辅助构造/);
  assert.doesNotMatch(source, /审查时若发现定义域、参数范围、边界、唯一性、存在性/);
  assert.doesNotMatch(source, /禁止无证明引用深定理/);

  const distribution = getMathV2L2Rules("pde-distribution");
  assert.ok(distribution.forbidden_errors.some(item => item.includes("D(Hf)") && item.includes("一阶")));

  const hyperbolic = getMathV2L2Rules("pde-hyperbolic");
  assert.ok(hyperbolic.forbidden_errors.some(item => item.includes("仅对守恒律")));

  const stochastic = getMathV2L2Rules("probability-stochastic");
  assert.ok(stochastic.forbidden_errors.some(item => item.includes("平方可积") && item.includes("可预测")));

  const optimization = getMathV2L2Rules("optimization-nonlinear");
  assert.ok(optimization.forbidden_errors.some(item => item.includes("Slater") && item.includes("必要性")));

  const coding = getMathV2L2Rules("information-coding");
  assert.ok(coding.forbidden_errors.some(item => item.includes("离散 Shannon 熵")));
});

test("research-level directions carry additional theorem-specific constraints", () => {
  const advancedKeys = [
    "category-theory",
    "algebraic-geometry-classical",
    "algebraic-geometry-curves",
    "algebraic-geometry-schemes",
    "number-theory-modular",
    "number-theory-transcendental",
    "complex-geometry",
    "functional-spectral",
    "dynamical-ergodic",
    "special-functions",
  ];

  for (const key of advancedKeys) {
    const rules = getMathV2L2Rules(key);
    assert.ok(rules.forbidden_errors.length >= 6, `${key} should include theorem-specific failure modes`);
    assert.ok(Object.keys(rules.parameter_constraints).length >= 4, `${key} should include theorem-specific object constraints`);
  }
});

test("math V2 chain imports the V2 catalog instead of legacy rule getters", () => {
  const files = ["rule-context.ts", "kp-analyzer.ts"].map(file =>
    readFileSync(new URL(file, import.meta.url), "utf8")
  );

  for (const source of files) {
    assert.doesNotMatch(source, /getKnowledgePoint(?:AntiPatterns|ForbiddenErrors|ForbiddenQuestionTypes|ParameterConstraints)/);
    assert.doesNotMatch(source, /\.\.\/disciplines(?:\.ts)?["']/);
  }
});

test("L2 routing exposes auditable match evidence", () => {
  assert.deepEqual(identifyMathV2L2DisciplineWithEvidence("pde-distribution"), {
    disciplineKey: "pde-distribution",
    disciplineName: "偏微分方程-分布与弱解",
    matchInput: "pde-distribution",
    matchMethod: "exact_key",
    matchedAlias: "pde-distribution",
    fallbackUsed: false,
  });

  const aliasMatch = identifyMathV2L2DisciplineWithEvidence("研究 pde-distribution 方向");
  assert.equal(aliasMatch.disciplineKey, "pde-distribution");
  assert.equal(aliasMatch.matchMethod, "alias");
  assert.equal(aliasMatch.matchedAlias, "pde-distribution");
  assert.equal(aliasMatch.fallbackUsed, false);

  const fallback = identifyMathV2L2DisciplineWithEvidence("完全未知的数学主题 xyz-987");
  assert.equal(fallback.disciplineKey, "algebra-equation");
  assert.equal(fallback.matchMethod, "fallback");
  assert.equal(fallback.matchedAlias, "");
  assert.equal(fallback.fallbackUsed, true);
});

test("L2 context exposes versioned six-field rule snapshots and empty validation defaults", () => {
  const context = buildMathV2RuleContext("pde-distribution");

  assert.match(context.ruleVersion, /^math-v2-l2-/);
  assert.equal(context.routingEvidence.disciplineKey, "pde-distribution");
  assert.deepEqual(context.ruleSnapshot, {
    peak_difficulty: context.peak_difficulty,
    forbidden_errors: context.forbidden_errors,
    parameter_constraints: context.parameter_constraints,
    anti_pattern_strategies: context.anti_pattern_strategies,
    v2_strategies: context.v2_strategies,
    v2_constraints: context.v2_constraints,
  });
  assert.deepEqual(context.validation, {
    l2RoutingVerified: "unverified",
    l2RuleViolation: [],
    l2RuleEffective: "unverified",
  });
});

test("math V2 orchestrator exports L2 metadata using the new field names", () => {
  const source = readFileSync(new URL("../../../orchestrator-v2.ts", import.meta.url), "utf8");

  assert.doesNotMatch(source, /ruleContext.antiPatternStrategies/);
  assert.match(source, /l2Key/);
  assert.match(source, /l2RoutingEvidence/);
  assert.match(source, /l2RuleSnapshot/);
  assert.match(source, /l2RoutingVerified/);
  assert.match(source, /l2RuleViolation/);
  assert.match(source, /l2RuleEffective/);
  assert.match(source, /selectMathV2L2Topics/);
  assert.match(source, /selectedMathL2Topics\[i\]/);
});

test("Google Sheets output carries the approved math table fields only", () => {
  const sheetsSource = readFileSync(new URL("../../../googleSheetsService.ts", import.meta.url), "utf8");
  const appsScriptSource = readFileSync(new URL("../../../../apps-script/Code.gs", import.meta.url), "utf8");
  for (const header of [
    "题目ID",
    "原始输入",
    "实际L2方向",
    "L2命中方式",
    "是否默认回退",
    "考察维度",
    "最终题干",
    "最终权威答案",
    "最终完整解法",
    "本题反模板策略",
    "闭合检查项",
    "审查是否通过",
    "不通过原因",
    "修复轮数",
    "盲解是否可解",
    "盲解最终答案",
    "答案是否一致",
    "答案裁判置信度",
    "发布标签",
    "质量等级",
    "各节点耗时",
    "Token消耗",
  ]) {
    assert.match(appsScriptSource, new RegExp(header));
  }

  for (const legacyHeader of [
    "L2方向Key",
    "L2方向名称",
    "L2原始输入",
    "L2实际匹配输入",
    "L2命中别名或关键词",
    "L2是否默认回退",
    "L2规则版本",
    "L2顶级难度规则",
    "L2禁止错误规则",
    "L2参数约束",
    "L2反模板策略",
    "L2 V2生成策略",
    "L2 V2强制约束",
    "L2路由是否验证",
    "L2规则违规",
    "L2规则有效性",
  ]) {
    assert.doesNotMatch(sheetsSource, new RegExp(legacyHeader));
    assert.doesNotMatch(appsScriptSource, new RegExp(legacyHeader));
  }

  assert.match(sheetsSource, /reviewPassed/);
  assert.match(sheetsSource, /blindSolveSolvable/);
  assert.match(sheetsSource, /comparisonConfidence/);
});
