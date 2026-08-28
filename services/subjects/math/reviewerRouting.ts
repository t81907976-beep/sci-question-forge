type ReviewerRetryNode = 2 | 5 | 6 | 7 | 'reviewer' | null;

export interface ReviewerRetryBudget {
    retryCount: number;
    maxWorkflowAttempts: number;
    routeRetryCount: number;
    maxRouteRetries: number;
}

export function getRetryableReviewerNode(retryFromNode: ReviewerRetryNode): 2 | 5 | 6 | 7 | null {
    return retryFromNode === 2 || retryFromNode === 5 || retryFromNode === 6 || retryFromNode === 7
        ? retryFromNode
        : null;
}

export function canScheduleReviewerRetry(budget: ReviewerRetryBudget): boolean {
    return budget.retryCount + 1 < budget.maxWorkflowAttempts &&
        budget.routeRetryCount < budget.maxRouteRetries;
}
