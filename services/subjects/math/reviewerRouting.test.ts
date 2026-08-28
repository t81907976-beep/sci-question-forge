import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  canScheduleReviewerRetry,
  getRetryableReviewerNode,
} from './reviewerRouting.ts';

test('recognizes reviewer retry nodes that should drive workflow retries', () => {
  assert.equal(getRetryableReviewerNode(2), 2);
  assert.equal(getRetryableReviewerNode(5), 5);
  assert.equal(getRetryableReviewerNode(6), 6);
  assert.equal(getRetryableReviewerNode(7), 7);
  assert.equal(getRetryableReviewerNode('reviewer'), null);
  assert.equal(getRetryableReviewerNode(null), null);
});

test('allows reviewer retry only when workflow and route budgets remain', () => {
  assert.equal(canScheduleReviewerRetry({
    retryCount: 0,
    maxWorkflowAttempts: 3,
    routeRetryCount: 0,
    maxRouteRetries: 1,
  }), true);

  assert.equal(canScheduleReviewerRetry({
    retryCount: 2,
    maxWorkflowAttempts: 3,
    routeRetryCount: 0,
    maxRouteRetries: 1,
  }), false);

  assert.equal(canScheduleReviewerRetry({
    retryCount: 0,
    maxWorkflowAttempts: 3,
    routeRetryCount: 1,
    maxRouteRetries: 1,
  }), false);
});
