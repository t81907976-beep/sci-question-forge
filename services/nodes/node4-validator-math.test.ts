import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { validateAndMergeTraps } from './node4-validator-math.ts';
import type { TrapType } from '../../types/multiNodeTypes.ts';

const processDeterminationTrap = 'PROCESS_DETERMINATION' as TrapType;

const baseProblem = {
  problemId: 'base_test',
  topic: '代数方程',
  questionBody: '设 x 满足方程 x + 1 = 2，求 x。',
  givenData: {
    equation: { value: 'x + 1 = 2', unit: '' },
  },
  requiredAnswer: 'x',
  solutionPath: ['移项', '求解', '验证', '写出答案'],
  expectedDifficulty: 1,
  mathPerturbationBlueprint: {
    basePattern: '一元一次方程',
    targetWeakness: '约束处理失败',
    perturbationType: 'constraint_handling_failure',
    invalidatedStandardMethod: '忽略定义域直接求解',
    expectedWrongPath: '保留不满足约束的候选解',
    divergenceStep: '筛选候选解时分叉',
    manualValidationChecklist: ['检查定义域', '检查候选解', '检查最终集合'],
  },
  mathDisciplineContext: {
    generationGuidance: {
      disciplineKey: 'algebra-equation',
      name: '代数-代数方程',
      keywords: ['方程'],
      level: '一元一次方程',
      antiPatternStrategies: ['加入定义域约束'],
    },
    validationRules: {
      disciplineKey: 'algebra-equation',
      name: '代数-代数方程',
      forbiddenQuestionTypes: ['避开一步题'],
      forbiddenErrors: ['必须检验增根'],
      parameterConstraints: { fraction_domain: '分母不能为零' },
    },
  },
} as const;

test('rejects math trap merge when discipline context is missing', () => {
  const { mathDisciplineContext: _context, ...withoutContext } = baseProblem;
  const result = validateAndMergeTraps(withoutContext as any, [
    {
      trapType: processDeterminationTrap,
      agentId: 'math_structural_perturbation',
      perturbationType: 'constraint_handling_failure',
      invalidatedStandardMethod: '忽略定义域直接求解',
      expectedWrongPath: '保留不满足约束的候选解',
      divergenceStep: '筛选候选解时分叉',
      manualValidationChecklist: ['检查定义域', '检查候选解', '检查最终集合'],
      modifiedFields: { questionBody: '设 x 满足 x + 1 = 2 且 x 为整数，求 x。' },
      trapDescription: '加入整数约束',
    },
  ]);

  assert.equal(result.isValid, false);
  assert.ok(result.physicalConstraintsViolated.some(item => item.includes('缺少数学学科上下文')));
});

test('rejects math trap merge when perturbation type differs from blueprint', () => {
  const result = validateAndMergeTraps(baseProblem as any, [
    {
      trapType: processDeterminationTrap,
      agentId: 'math_structural_perturbation',
      perturbationType: 'branch_explosion',
      invalidatedStandardMethod: '忽略定义域直接求解',
      expectedWrongPath: '保留不满足约束的候选解',
      divergenceStep: '筛选候选解时分叉',
      manualValidationChecklist: ['检查定义域', '检查候选解', '检查最终集合'],
      modifiedFields: { questionBody: '设 x 满足 x + 1 = 2 且 x 为整数，求 x。' },
      trapDescription: '加入整数约束',
    },
  ]);

  assert.equal(result.isValid, false);
  assert.ok(result.physicalConstraintsViolated.some(item => item.includes('扰动类型不一致')));
});

test('rejects math trap merge when structural perturbation metadata is incomplete', () => {
  const result = validateAndMergeTraps(baseProblem as any, [
    {
      trapType: processDeterminationTrap,
      agentId: 'math_structural_perturbation',
      perturbationType: 'constraint_handling_failure',
      invalidatedStandardMethod: '',
      expectedWrongPath: '',
      divergenceStep: '',
      manualValidationChecklist: ['检查定义域', '检查候选解'],
      modifiedFields: { questionBody: '设 x 满足 x + 1 = 2 且 x 为整数，求 x。' },
      trapDescription: '加入整数约束',
    },
  ]);

  assert.equal(result.isValid, false);
  assert.ok(result.physicalConstraintsViolated.some(item => item.includes('缺少 invalidatedStandardMethod')));
  assert.ok(result.physicalConstraintsViolated.some(item => item.includes('缺少 expectedWrongPath')));
  assert.ok(result.physicalConstraintsViolated.some(item => item.includes('缺少 divergenceStep')));
  assert.ok(result.physicalConstraintsViolated.some(item => item.includes('manualValidationChecklist 少于 3 条')));
});
