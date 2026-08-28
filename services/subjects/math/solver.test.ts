import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { classifyMathSolverFailure } from './solver.ts';

test('classifies structural perturbation validation failure explicitly', () => {
  const failure = classifyMathSolverFailure({
    isSolvable: true,
    stepCount: 5,
    hasUniqueAnswer: true,
    hasImplicitConditions: false,
    isSelfConsistent: true,
    isNonTrivial: true,
    hasClosedFormAnswer: true,
    hasParameterAmbiguity: false,
    requiresCaseAnalysis: false,
    hasBICSolvabilityIssue: false,
    perturbationRemainsValid: false,
    expectedWrongPathIsNatural: true,
    divergenceStepVerified: true,
    perturbationIssueDetails: '最终题没有真实体现所选扰动类型',
  }, {
    minSteps: 4,
    hasStructuralPerturbation: true,
    requiresRigorousProof: false,
    matchesDisciplineLevel: true,
  });

  assert.equal(failure.isValid, false);
  assert.equal(failure.failureType, 'perturbation_invalid');
  assert.match(failure.errorReason, /结构扰动后题目无效/);
});
