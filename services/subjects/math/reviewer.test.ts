import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { normalizeReviewResult } from './reviewer-normalizer.ts';
import { requireMathReviewMetadata } from './reviewer-metadata.ts';

test('review normalization fails when discipline gate has a hard violation', () => {
  const result = normalizeReviewResult({
    passed: true,
    qualityLabel: 'manual_validation_ready',
    failureType: 'none',
    queryIssues: [],
    responseIssues: [],
    difficultyIssues: [],
    overallVerdict: '模型声称通过',
    disciplineGate: {
      disciplineMatched: true,
      difficultyMatched: true,
      forbiddenQuestionTypeHit: false,
      forbiddenErrorHit: false,
      parameterConstraintViolated: true,
      issues: ['违反分式方程定义域约束'],
    },
    perturbationGate: {
      perturbationMatched: true,
      expectedWrongPathNatural: true,
      divergenceStepClear: true,
      checklistUsable: true,
      issues: [],
    },
  });

  assert.equal(result.passed, false);
  assert.equal(result.failureType, 'contradictory_conditions');
  assert.equal(result.retryFromNode, 2);
  assert.ok(result.queryIssues.some(item => item.includes('违反分式方程定义域约束')));
});

test('review normalization fails when perturbation gate does not match', () => {
  const result = normalizeReviewResult({
    passed: true,
    qualityLabel: 'manual_validation_ready',
    failureType: 'none',
    queryIssues: [],
    responseIssues: [],
    difficultyIssues: [],
    overallVerdict: '模型声称通过',
    disciplineGate: {
      disciplineMatched: true,
      difficultyMatched: true,
      forbiddenQuestionTypeHit: false,
      forbiddenErrorHit: false,
      parameterConstraintViolated: false,
      issues: [],
    },
    perturbationGate: {
      perturbationMatched: false,
      expectedWrongPathNatural: true,
      divergenceStepClear: true,
      checklistUsable: true,
      issues: ['最终题没有体现 constraint_handling_failure'],
    },
  });

  assert.equal(result.passed, false);
  assert.equal(result.failureType, 'perturbation_invalid');
  assert.equal(result.retryFromNode, 2);
  assert.ok(result.queryIssues.some(item => item.includes('最终题没有体现 constraint_handling_failure')));
});

test('math reviewer requires perturbation metadata before calling LLM', () => {
  assert.throws(
    () => requireMathReviewMetadata(undefined),
    /Math review metadata is required/,
  );

  assert.throws(
    () => requireMathReviewMetadata({} as any),
    /Math review metadata missing disciplineKey/,
  );

  assert.throws(
    () => requireMathReviewMetadata({
      appliedTraps: [],
      trapDescriptions: [],
      generatedAt: '2026-06-24T00:00:00.000Z',
      nodeExecutionTime: {},
      disciplineKey: 'algebra-equation',
      disciplineName: '代数-代数方程',
      difficultyLevel: 'advanced',
      validationRules: {
        disciplineKey: 'algebra-equation',
        name: '代数-代数方程',
        forbiddenQuestionTypes: [],
        forbiddenErrors: [],
        parameterConstraints: {},
      },
      predictedFailureMode: '忽略定义域',
      expectedWrongPath: '直接保留候选解',
      divergenceStep: '筛选候选解',
      manualValidationChecklist: ['检查定义域', '检查候选解', '检查最终集合'],
    } as any),
    /Math review metadata missing perturbationType/,
  );
});
