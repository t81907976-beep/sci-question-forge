import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  DEFAULT_MATH_PERTURBATION_TYPE,
  MATH_DIFFICULTY_OPTIONS,
  MATH_PERTURBATION_OPTIONS,
  getMathDisciplineOptions,
} from './mathGenerationOptions.ts';
import { MATH_DISCIPLINES } from './services/subjects/math/disciplines.ts';

test('builds math discipline dropdown options from disciplines config', () => {
  const options = getMathDisciplineOptions();
  const labels = options.map(option => option.label);
  const disciplineNames = Object.values(MATH_DISCIPLINES).map(discipline => discipline.name);

  assert.deepEqual(labels, disciplineNames);
  assert.deepEqual(options.map(option => option.value), disciplineNames);
});

test('provides math difficulty dropdown options for levels 1-4', () => {
  assert.deepEqual(MATH_DIFFICULTY_OPTIONS, [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
  ]);
});

test('provides concrete math perturbation dropdown options without auto matching', () => {
  assert.equal(DEFAULT_MATH_PERTURBATION_TYPE, 'constraint_handling_failure');
  assert.equal(MATH_PERTURBATION_OPTIONS.length, 10);
  assert.deepEqual(
    MATH_PERTURBATION_OPTIONS.map(option => option.value),
    [
      'constraint_handling_failure',
      'branch_explosion',
      'non_equivalent_transformation',
      'template_overfitting',
      'symbol_role_drift',
      'quantifier_order_error',
      'exact_calculation_fragility',
      'representation_selection_failure',
      'self_check_closure_failure',
      'logical_condition_misjudgment',
    ],
  );
  assert.ok(!MATH_PERTURBATION_OPTIONS.some(option => option.label.includes('自动')));
});
