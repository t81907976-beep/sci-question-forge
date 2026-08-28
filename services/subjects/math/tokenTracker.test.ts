import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { clearMathTokenTracker, getMathTokenUsage, recordMathTokenUsage, resetMathTokenTracker } from './tokenTracker.ts';

test('records math token usage by node', () => {
  resetMathTokenTracker(0);

  recordMathTokenUsage(0, 'node2_0', {
    provider: 'deepseek',
    model: 'deepseek-reasoner',
    promptText: '一二三四五',
    outputText: '一二三四',
  });
  recordMathTokenUsage(0, 'node2_0', {
    provider: 'deepseek',
    model: 'deepseek-reasoner',
    promptText: '一二三四',
    outputText: '一二三四五六七八',
  });

  assert.deepEqual(getMathTokenUsage(0), {
    node2_0: {
      provider: 'deepseek',
      model: 'deepseek-reasoner',
      inputTokens: 3,
      outputTokens: 3,
      totalTokens: 6,
      callCount: 2,
    },
  });

  recordMathTokenUsage(0, 'reviewer_0', {
    provider: 'oneapi',
    model: 'gpt-4o',
    promptText: '一二三四',
    outputText: '一二三四',
  });

  assert.equal(getMathTokenUsage(0).reviewer_0.totalTokens, 2);
  clearMathTokenTracker(0);
  assert.deepEqual(getMathTokenUsage(0), {});
});
