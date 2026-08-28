import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  getMathV2L3Knowledge,
  getMathV2L3Rules,
  identifyMathV2L3KnowledgeWithEvidence,
  MATH_V2_L3_CATALOG,
} from "./l3/index.ts";
import { buildMathV2RuleContext } from "./rule-context.ts";
import { PDE_ELLIPTIC_L3_CATALOG, PDE_ELLIPTIC_L3_RULES } from "./l3/pde-elliptic.ts";

test("Green function is an explicit L3 knowledge item under elliptic PDE", () => {
  const node = getMathV2L3Knowledge("green-function");

  assert.equal(node.l2Key, "pde-elliptic");
  assert.equal(node.name, "Green 函数");
  assert.equal(node.kind, "object");
  assert.deepEqual(identifyMathV2L3KnowledgeWithEvidence("Green函数"), {
    l3Key: "green-function",
    l2Key: "pde-elliptic",
    l3Name: "Green 函数",
    matchMethod: "alias",
    matchedAlias: "Green函数",
  });
});

test("Green function L3 rules contain knowledge, generic checks, and scenario checks", () => {
  const rules = getMathV2L3Rules("green-function");

  assert.ok(rules.formulas.some(item => item.includes("L_x G(x,y)")));
  assert.ok(rules.formulas.some(item => item.includes("Green 恒等式")));
  assert.ok(rules.theorems.some(item => item.includes("齐次问题只有零解")));
  assert.ok(rules.theorems.some(item => item.includes("自伴")));
  assert.ok(rules.generalRequirements.some(item => item.includes("定义域")));
  assert.ok(rules.forbiddenErrors.some(item => item.includes("奇性")));
  assert.ok(rules.closureChecks.some(item => item.includes("代回原边值问题")));
  assert.ok(rules.scenarioChecks.selfAdjointBoundaryValueProblem.some(item => item.includes("对称性")));
  assert.ok(rules.scenarioChecks.nonSelfAdjointOrNonUniqueProblem.some(item => item.includes("伴随算子")));
  assert.ok(rules.scenarioChecks.nonSelfAdjointOrNonUniqueProblem.some(item => item.includes("Fredholm")));
});

test("L2 context does not inject Green function rules for an L2-only input", () => {
  const context = buildMathV2RuleContext("偏微分方程-椭圆型方程");

  assert.equal(context.topicLevel, "L2");
  assert.equal(context.l3Key, undefined);
  assert.doesNotMatch(context.generationBlock, /Green 函数/);
  assert.doesNotMatch(context.reviewBlock, /Green 函数/);
});

test("L3 context inherits its parent L2 and injects Green function rules", () => {
  const context = buildMathV2RuleContext("Green函数");

  assert.equal(context.topicLevel, "L3");
  assert.equal(context.disciplineKey, "pde-elliptic");
  assert.equal(context.l3Key, "green-function");
  assert.match(context.generationBlock, /Green 函数/);
  assert.match(context.generationBlock, /算子方程/);
  assert.match(context.reviewBlock, /自伴边值问题/);
  assert.match(context.reviewBlock, /导数跳跃/);
});

test("elliptic PDE L3 catalog keeps the explicitly approved Green function item", () => {
  assert.ok(Object.keys(MATH_V2_L3_CATALOG).includes("green-function"));
});

test("elliptic PDE L3 catalog covers the first theorem-and-formula set", () => {
  const expectedKeys = [
    "green-function",
    "fundamental-solution",
    "weak-maximum-principle",
    "strong-maximum-principle",
    "hopf-boundary-point-lemma",
    "harnack-inequality",
    "lax-milgram-theorem",
    "elliptic-weak-formulation",
    "dirichlet-problem",
    "neumann-problem",
    "poisson-kernel",
    "elliptic-regularity",
    "schauder-estimate",
    "calderon-zygmund-estimate",
    "de-giorgi-nash-moser-regularity",
    "elliptic-principal-eigenvalue",
    "p-laplace-equation",
    "monge-ampere-equation",
    "critical-sobolev-exponent",
    "obstacle-problem",
    "method-of-continuity",
    "pohozaev-identity",
    "fredholm-alternative-elliptic",
  ];

  assert.deepEqual(Object.keys(PDE_ELLIPTIC_L3_CATALOG).sort(), expectedKeys.sort());
  assert.deepEqual(Object.keys(PDE_ELLIPTIC_L3_RULES).sort(), expectedKeys.sort());

  for (const key of expectedKeys) {
    const rules = PDE_ELLIPTIC_L3_RULES[key];
    assert.ok(rules.definitions.length > 0, `${key} needs definitions`);
    assert.ok(rules.formulas.length > 0, `${key} needs formulas`);
    assert.ok(rules.theorems.length > 0, `${key} needs theorems`);
    assert.ok(rules.generalRequirements.length >= 2, `${key} needs general requirements`);
    assert.ok(rules.forbiddenErrors.length >= 3, `${key} needs forbidden errors`);
    assert.ok(Object.keys(rules.parameterConstraints).length >= 2, `${key} needs parameter constraints`);
    assert.ok(rules.closureChecks.length >= 3, `${key} needs closure checks`);
  }
});
