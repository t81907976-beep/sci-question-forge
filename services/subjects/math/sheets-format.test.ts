import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  formatMathNodeExecutionTime,
  formatMathReviewerFailureReason,
  formatMathReviewerResult,
  formatMathPerturbationInfo,
  formatMathTokenUsage,
} from './sheetsFormatting.ts';

test('formats math node execution time in seconds', () => {
  assert.equal(
    formatMathNodeExecutionTime({
      node0: 1,
      node2_0: 55594,
      node5_0: 106649,
    }),
    'node0: 0.001秒\nnode2_0: 55.594秒\nnode5_0: 106.649秒',
  );
});

test('formats math token usage by node and provider', () => {
  assert.equal(
    formatMathTokenUsage({
      node2_0: {
        provider: 'deepseek',
        model: 'deepseek-reasoner',
        inputTokens: 120,
        outputTokens: 30,
        totalTokens: 150,
        callCount: 1,
      },
      node6_0: {
        provider: 'oneapi',
        model: 'gpt-4o',
        inputTokens: 80,
        outputTokens: 20,
        totalTokens: 100,
        callCount: 1,
      },
    }),
    'node2_0: deepseek/deepseek-reasoner 输入120 输出30 合计150 调用1次\nnode6_0: oneapi/gpt-4o 输入80 输出20 合计100 调用1次',
  );
});

test('formats math reviewer result and preserves failed zero', () => {
  assert.equal(formatMathReviewerResult(1), 1);
  assert.equal(formatMathReviewerResult(0), 0);
  assert.equal(formatMathReviewerResult(undefined), '');
});

test('formats math reviewer failure reason from issues or verdict', () => {
  assert.equal(
    formatMathReviewerFailureReason({
      queryIssues: ['题面条件矛盾'],
      responseIssues: ['解答第 3 步计算错误'],
      difficultyIssues: ['难度不足'],
      overallVerdict: '审查未通过',
    }),
    '题面条件矛盾; 解答第 3 步计算错误; 难度不足',
  );

  assert.equal(
    formatMathReviewerFailureReason({
      queryIssues: [],
      responseIssues: [],
      difficultyIssues: [],
      overallVerdict: '审查响应JSON解析失败',
    }),
    '审查响应JSON解析失败',
  );

  assert.equal(
    formatMathReviewerFailureReason({
      queryIssues: [],
      responseIssues: [],
      difficultyIssues: [],
      overallVerdict: '',
    }),
    '',
  );

  assert.equal(
    formatMathReviewerFailureReason({
      queryIssues: [],
      responseIssues: [],
      difficultyIssues: [],
      perturbationGate: {
        issues: ['最终题没有体现 constraint_handling_failure'],
      },
      overallVerdict: '扰动不成立',
    }),
    '最终题没有体现 constraint_handling_failure',
  );
});

test('formats math perturbation info from math perturbation type instead of generic trap type', () => {
  assert.equal(
    formatMathPerturbationInfo({
      perturbationType: 'constraint_handling_failure',
      appliedTraps: ['PROCESS_DETERMINATION'],
      trapDescriptions: ['数学结构扰动：constraint_handling_failure；失效熟路：默认忽略定义域约束'],
    }),
    'constraint_handling_failure | 数学结构扰动：constraint_handling_failure；失效熟路：默认忽略定义域约束',
  );
});
