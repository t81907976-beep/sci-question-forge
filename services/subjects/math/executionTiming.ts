export type MathExecutionTimes = Record<string, number>;

export function createMathProblemExecutionTimes(baseTimes: MathExecutionTimes): MathExecutionTimes {
    return {
        node0: baseTimes.node0 ?? 0,
        node1: baseTimes.node1 ?? 0,
    };
}

export function recordMathNodeExecutionTime(
    executionTimes: MathExecutionTimes,
    nodeNumber: number,
    durationMs: number
): void {
    executionTimes[`node${nodeNumber}`] = durationMs;
}
