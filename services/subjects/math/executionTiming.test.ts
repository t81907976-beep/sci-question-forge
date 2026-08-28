import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createMathProblemExecutionTimes, recordMathNodeExecutionTime } from './executionTiming.ts';

test('records execution times with per-problem node names', () => {
  const times = createMathProblemExecutionTimes({ node0: 1, node1: 2 });

  recordMathNodeExecutionTime(times, 2, 3000);
  recordMathNodeExecutionTime(times, 3, 4000);
  recordMathNodeExecutionTime(times, 7, 5);

  assert.deepEqual(times, {
    node0: 1,
    node1: 2,
    node2: 3000,
    node3: 4000,
    node7: 5,
  });
  assert.equal(Object.keys(times).some(key => /^node\d+_\d+$/.test(key)), false);
});
