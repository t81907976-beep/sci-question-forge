import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { validateUserInput } from './node0-input.ts';
import {
  getMathDifficultyLevel,
  getMathMinimumReasoningSteps,
} from '../subjects/math/difficulty.ts';

test('maps math difficulty levels directly to discipline depth levels', () => {
  assert.equal(getMathDifficultyLevel(1), 'basic');
  assert.equal(getMathDifficultyLevel(2), 'intermediate');
  assert.equal(getMathDifficultyLevel(3), 'advanced');
  assert.equal(getMathDifficultyLevel(4), 'competition');
});

test('maps math difficulty levels to required minimum reasoning steps', () => {
  assert.equal(getMathMinimumReasoningSteps(1), 4);
  assert.equal(getMathMinimumReasoningSteps(2), 6);
  assert.equal(getMathMinimumReasoningSteps(3), 8);
  assert.equal(getMathMinimumReasoningSteps(4), 10);
});

test('clamps math difficulty to 1-4 while keeping other subjects trap count at 0-5', () => {
  assert.equal(validateUserInput({
    subject: 'math',
    topic: '导数',
    trapCount: 0,
    perturbationType: 'constraint_handling_failure',
  }).trapCount, 1);
  assert.equal(validateUserInput({
    subject: 'math',
    topic: '导数',
    trapCount: 5,
    perturbationType: 'constraint_handling_failure',
  }).trapCount, 4);

  assert.equal(validateUserInput({ subject: 'chemistry', topic: '化学平衡', trapCount: 0 }).trapCount, 0);
  assert.equal(validateUserInput({ subject: 'chemistry', topic: '化学平衡', trapCount: 5 }).trapCount, 5);
});

test('requires an explicit perturbation type for math input', () => {
  assert.throws(
    () => validateUserInput({ subject: 'math', topic: '导数', trapCount: 3 }),
    /Math perturbationType is required/,
  );

  assert.equal(
    validateUserInput({
      subject: 'math',
      topic: '导数',
      trapCount: 3,
      perturbationType: 'branch_explosion',
    }).perturbationType,
    'branch_explosion',
  );
});
