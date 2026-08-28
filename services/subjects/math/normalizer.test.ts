import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { MATH_DISCIPLINES } from './disciplines.ts';
import { getExplicitMathAliasKeys, normalizeKnowledgePoint } from './normalizer.ts';

test('keeps explicit math aliases aligned with disciplines config', () => {
  const disciplineKeys = new Set(Object.keys(MATH_DISCIPLINES));

  assert.deepEqual(
    getExplicitMathAliasKeys().filter(key => !disciplineKeys.has(key)),
    [],
  );
});

test('normalizes aliases for current math disciplines', () => {
  assert.equal(normalizeKnowledgePoint('代数-线性代数').matchedKey, 'algebra-linear');
  assert.equal(normalizeKnowledgePoint('射影簇').matchedKey, 'algebraic-geometry-classical');
  assert.equal(normalizeKnowledgePoint('球堆积').matchedKey, 'combinatorics-geometry');
});
