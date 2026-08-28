import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  getMathV2L2Node,
  identifyMathV2L2Discipline,
  identifyMathV2L2DisciplineWithEvidence,
  MATH_V2_L2_CATALOG,
  selectMathV2L2Topics,
} from "./l2-catalog.ts";

test("math V2 L2 catalog keeps all 66 directions with aliases", () => {
  const entries = Object.entries(MATH_V2_L2_CATALOG);

  assert.equal(entries.length, 66);
  for (const [key, node] of entries) {
    assert.equal(node.id, key);
    assert.ok(node.name.length > 0, `${key} should have name`);
    assert.ok(node.aliases.includes(node.name), `${key} should include name alias`);
    assert.ok(node.aliases.length >= 2, `${key} should include its L2 name and stable ID`);
  }
});

test("math V2 L2 alias recognition uses only L2 names and identifiers", () => {
  assert.equal(identifyMathV2L2Discipline("偏微分方程-分布与弱解"), "pde-distribution");
  assert.equal(identifyMathV2L2Discipline("偏微分方程分布与弱解"), "pde-distribution");
  assert.equal(identifyMathV2L2Discipline("分布与弱解"), "pde-distribution");
  assert.equal(identifyMathV2L2Discipline("代数-代数方程"), "algebra-equation");
  assert.equal(identifyMathV2L2Discipline("代数代数方程"), "algebra-equation");
  assert.equal(identifyMathV2L2Discipline("代数方程"), "algebra-equation");
  assert.equal(identifyMathV2L2Discipline("optimization-nonlinear"), "optimization-nonlinear");
  assert.equal(identifyMathV2L2Discipline("combinatorics-extremal"), "combinatorics-extremal");
  assert.equal(identifyMathV2L2Discipline("algebraic-geometry-schemes"), "algebraic-geometry-schemes");

  assert.equal(getMathV2L2Node("pde-distribution").name, "偏微分方程-分布与弱解");
  assert.ok(getMathV2L2Node("algebra-equation").aliases.includes("代数方程"));
});

test("all L2 names route with or without their connector", () => {
  for (const [key, node] of Object.entries(MATH_V2_L2_CATALOG)) {
    const parts = node.name.split(/[-—–·/]/).map(part => part.trim()).filter(Boolean);
    assert.equal(identifyMathV2L2Discipline(node.name), key);
    if (parts.length > 1) {
      assert.equal(identifyMathV2L2Discipline(parts.join("")), key, `${node.name} compact form should route to ${key}`);
      assert.equal(identifyMathV2L2Discipline(parts.slice(1).join("")), key, `${node.name} short form should route to ${key}`);
    }
  }
});

test("math V2 L2 catalog does not embed L3 routing terms", () => {
  const aliases = Object.values(MATH_V2_L2_CATALOG).flatMap(node => node.aliases);
  const l3Terms = [
    "D H=delta", "Heaviside导数", "KKT条件", "Slater条件",
    "Ramsey理论", "Erdos-Ko-Rado", "齐次坐标环", "Proj构造",
  ];

  for (const term of l3Terms) {
    assert.ok(!aliases.includes(term), `${term} should not be stored in the L2 catalog`);
  }

  assert.equal(identifyMathV2L2Discipline("D H=delta"), "algebra-equation");
  assert.equal(identifyMathV2L2Discipline("KKT条件"), "algebra-equation");
});

test("parent input selects distinct L2 children before parallel generation", () => {
  const algebraChildren = [
    "代数-代数方程",
    "代数-多项式",
    "代数-不等式",
    "代数-抽象代数",
    "代数-范畴论",
    "代数-格论",
    "代数-线性代数",
  ];
  const childSet = new Set(algebraChildren);
  const random = () => 0.25;

  const one = selectMathV2L2Topics("代数", 1, random);
  assert.equal(one.length, 1);
  assert.ok(childSet.has(one[0]));

  const three = selectMathV2L2Topics("代数", 3, random);
  assert.equal(new Set(three).size, 3);
  assert.ok(three.every(topic => childSet.has(topic)));

  const threeByEnglishParent = selectMathV2L2Topics("algebra", 3, random);
  assert.equal(new Set(threeByEnglishParent).size, 3);
  assert.ok(threeByEnglishParent.every(topic => childSet.has(topic)));

  const ten = selectMathV2L2Topics("代数", 10, random);
  assert.deepEqual(new Set(ten.slice(0, 7)), childSet);
  assert.equal(new Set(ten.slice(7)).size, 3);
  assert.ok(ten.every(topic => childSet.has(topic)));
});

test("parent ID word is not treated as a specific L2 alias", () => {
  const evidence = identifyMathV2L2DisciplineWithEvidence("algebra");
  assert.equal(evidence.matchMethod, "fallback");
  assert.equal(evidence.matchedAlias, "");
  assert.equal(evidence.fallbackUsed, true);
  assert.ok(!getMathV2L2Node("algebra-equation").aliases.includes("algebra"));
  assert.ok(!getMathV2L2Node("algebra-equation").aliases.includes("equation"));
});

test("specific L2 input remains unchanged for every requested problem", () => {
  assert.deepEqual(
    selectMathV2L2Topics("代数方程", 3, () => 0.5),
    ["代数方程", "代数方程", "代数方程"],
  );
});
