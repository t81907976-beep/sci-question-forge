import type { FinalProblem, FormattedSolution, BaseProblem, UserInput, TrapCluster } from "../../types/multiNodeTypes";

/**
 * Node 7: Final Output Assembler
 * 
 * Combines all components into the final output format defined by the 6 core fields.
 */

function normalizeNumericToken(value: number): string {
    return String(value)
        .replace(/\.0+$/, '')
        .replace(/(\.\d*?)0+$/, '$1');
}

function coreDataValueVisible(text: string, value: number): boolean {
    const compactText = text.replace(/\s+/g, '');
    const tokens = new Set<string>([
        normalizeNumericToken(value),
        String(value),
        value.toPrecision(6).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e'),
        value.toExponential(6).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e'),
    ]);

    return [...tokens].some(token => compactText.includes(token.replace(/\s+/g, '')));
}

function findMissingVisibleCoreData(output: FinalProblem): string[] {
    const text = `${output.originalProblemText || ''}\n${output.trapModifiedText || ''}`;
    const solutionText = `${output.standardSafeSolution || ''}\n${output.finalAnswer || ''}`;
    return Object.entries(output.coreData || {})
        .filter(([, data]) => Number.isFinite(Number(data?.value)))
        // 只校验解答实际用到的量：解答里没出现的 coreData 不强制写入题面。
        .filter(([, data]) => coreDataValueVisible(solutionText, Number(data.value)))
        .filter(([, data]) => !coreDataValueVisible(text, Number(data.value)))
        .map(([name, data]) => `${name}=${normalizeNumericToken(Number(data.value))}${data.unit ? ` ${data.unit}` : ''}`);
}

function hasMultiPartQuestion(text: string): boolean {
    return [
        /(?:^|[\s，。；;：:])\([一二三四五六七八九十\d]+\)/,
        /(?:^|[\s，。；;：:])（[一二三四五六七八九十\d]+）/,
        /第[一二三四五六七八九十\d]+问/,
    ].some(pattern => pattern.test(text));
}

export function assembleFinalOutput(
    input: Partial<UserInput>,
    baseProblem: BaseProblem,
    validatedTrapData: TrapCluster['mergedTrapData'],
    solution: FormattedSolution,
    executionTimes: Record<string, number>
): FinalProblem {
    // 确保所有必需字段都有安全的默认值
    const safeAppliedTraps = validatedTrapData?.appliedTraps ?? [];
    const safeTrapDescriptions = validatedTrapData?.trapDescriptions ?? [];

    return {
        problemId: baseProblem.problemId,
        subject: input.subject || 'chemistry',
        topic: baseProblem.topic,
        scenario: baseProblem.scenario,
        questionAngle: (baseProblem as any).questionAngle || '',
        trapCount: input.trapCount ?? 0,
        originalProblemText: baseProblem.originalProblemText || '',
        referenceSteps: baseProblem.referenceSteps || [],
        trapModifiedText: validatedTrapData?.trapModifiedText || baseProblem.originalProblemText || '',
        standardSafeSolution: solution.standardSafeSolutionText || solution.reasoningChain.map((step: any, i: number) => `[${i + 1}] ${step.description}`).join('\n'),
        coreData: baseProblem.coreData || {},
        distractorData: validatedTrapData?.distractorData ?? {},
        finalAnswer: solution.finalAnswer,
        metadata: {
            appliedTraps: Array.isArray(safeAppliedTraps) ? safeAppliedTraps : [],
            trapDescriptions: Array.isArray(safeTrapDescriptions) ? safeTrapDescriptions : [],
            generatedAt: new Date().toISOString(),
            nodeExecutionTime: executionTimes
        }
    };
}

/**
 * Validate final output format
 */
export function validateFinalOutput(
    output: FinalProblem,
    options: { subject?: UserInput['subject']; singleQuestion?: boolean } = {}
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const subject = options.subject || output.subject;

    if (!output.originalProblemText || output.originalProblemText.length < 50) {
        errors.push('Original problem body too short');
    }

    if (!output.trapModifiedText || output.trapModifiedText.length < 50) {
        errors.push('Trap modified problem body too short');
    }

    if (!output.standardSafeSolution) {
        errors.push('Solution missing');
    }

    if (!output.coreData || Object.keys(output.coreData).length === 0) {
        errors.push('No given core data');
    }

    const missingVisibleCoreData = subject === 'math' ? [] : findMissingVisibleCoreData(output);
    if (missingVisibleCoreData.length > 0) {
        errors.push(`Core data not visible in problem text: ${missingVisibleCoreData.slice(0, 8).join('; ')}`);
    }

    if (options.singleQuestion && hasMultiPartQuestion(`${output.trapModifiedText || ''}\n${output.mergedProblemText || ''}`)) {
        errors.push('单问约束违反：题干包含多小问结构');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
