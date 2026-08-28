export interface MathTokenUsage {
    provider: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    callCount: number;
}

export interface MathReviewerFailureSummary {
    queryIssues?: string[];
    responseIssues?: string[];
    difficultyIssues?: string[];
    disciplineGate?: { issues?: string[] };
    perturbationGate?: { issues?: string[] };
    overallVerdict?: string;
}

export interface MathL2SheetsMetadata {
    l2Key?: string;
    l2Name?: string;
    l2OriginalInput?: string;
    l2RoutingEvidence?: {
        matchInput?: string;
        matchMethod?: string;
        matchedAlias?: string;
        fallbackUsed?: boolean;
    };
    l2RuleVersion?: string;
    l2RuleSnapshot?: {
        peak_difficulty?: string;
        forbidden_errors?: string[];
        parameter_constraints?: Record<string, string>;
        anti_pattern_strategies?: string[];
        v2_strategies?: string[];
        v2_constraints?: string[];
    };
    l2RoutingVerified?: string;
    l2RuleViolation?: string[];
    l2RuleEffective?: string;
}

function formatL2List(value: unknown): string {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean).join("\n") : "";
}

export function formatMathL2SheetsFields(meta: MathL2SheetsMetadata): {
    l2Key: string;
    l2Name: string;
    l2OriginalInput: string;
    l2MatchInput: string;
    l2MatchMethod: string;
    l2MatchedAlias: string;
    l2FallbackUsed: boolean | string;
    l2RuleVersion: string;
    peakDifficulty: string;
    forbiddenErrors: string;
    parameterConstraints: string;
    antiPatternStrategies: string;
    v2Strategies: string;
    v2Constraints: string;
    l2RoutingVerified: string;
    l2RuleViolation: string;
    l2RuleEffective: string;
} {
    const evidence = meta.l2RoutingEvidence ?? {};
    const snapshot = meta.l2RuleSnapshot ?? {};
    return {
        l2Key: meta.l2Key || "",
        l2Name: meta.l2Name || "",
        l2OriginalInput: meta.l2OriginalInput || "",
        l2MatchInput: evidence.matchInput || "",
        l2MatchMethod: evidence.matchMethod || "",
        l2MatchedAlias: evidence.matchedAlias || "",
        l2FallbackUsed: evidence.fallbackUsed ?? "",
        l2RuleVersion: meta.l2RuleVersion || "",
        peakDifficulty: snapshot.peak_difficulty || "",
        forbiddenErrors: formatL2List(snapshot.forbidden_errors),
        parameterConstraints: JSON.stringify(snapshot.parameter_constraints ?? {}),
        antiPatternStrategies: formatL2List(snapshot.anti_pattern_strategies),
        v2Strategies: formatL2List(snapshot.v2_strategies),
        v2Constraints: formatL2List(snapshot.v2_constraints),
        l2RoutingVerified: meta.l2RoutingVerified || "unverified",
        l2RuleViolation: formatL2List(meta.l2RuleViolation),
        l2RuleEffective: meta.l2RuleEffective || "unverified",
    };
}

function parseNodeKey(key: string): [number, number, string] {
    const match = key.match(/^node(\d+)(?:_(\d+))?$/);
    if (!match) return [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, key];
    return [
        Number(match[1]),
        match[2] === undefined ? -1 : Number(match[2]),
        key,
    ];
}

function compareNodeKeys(a: string, b: string): number {
    const left = parseNodeKey(a);
    const right = parseNodeKey(b);
    return left[0] - right[0] || left[1] - right[1] || left[2].localeCompare(right[2]);
}

export function formatMathNodeExecutionTime(value: unknown): string {
    const timings = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    return Object.keys(timings)
        .sort(compareNodeKeys)
        .map(key => {
            const milliseconds = Number(timings[key]);
            if (!Number.isFinite(milliseconds)) return '';
            return `${key}: ${(milliseconds / 1000).toFixed(3)}秒`;
        })
        .filter(Boolean)
        .join('\n');
}

export function formatMathTokenUsage(value: unknown): string {
    const usageByNode = value && typeof value === 'object' ? value as Record<string, Partial<MathTokenUsage>> : {};
    const lines = Object.keys(usageByNode)
        .sort(compareNodeKeys)
        .map(key => {
            const usage = usageByNode[key];
            if (!usage || typeof usage !== 'object') return '';
            const provider = String(usage.provider || '');
            const model = String(usage.model || '');
            const inputTokens = Number(usage.inputTokens || 0);
            const outputTokens = Number(usage.outputTokens || 0);
            const totalTokens = Number(usage.totalTokens || inputTokens + outputTokens);
            const callCount = Number(usage.callCount || 0);
            return `${key}: ${provider}/${model} 输入${inputTokens} 输出${outputTokens} 合计${totalTokens} 调用${callCount}次`;
        })
        .filter(Boolean);

    return lines.length > 0 ? lines.join('\n') : '未记录';
}

export function formatMathReviewerResult(value: unknown): 0 | 1 | '' {
    if (value === 1 || value === 0) return value;
    if (value === true) return 1;
    if (value === false) return 0;
    return '';
}

export function formatMathReviewerFailureReason(value: MathReviewerFailureSummary): string {
    const issues = [
        ...(Array.isArray(value.queryIssues) ? value.queryIssues : []),
        ...(Array.isArray(value.responseIssues) ? value.responseIssues : []),
        ...(Array.isArray(value.difficultyIssues) ? value.difficultyIssues : []),
        ...(Array.isArray(value.disciplineGate?.issues) ? value.disciplineGate.issues : []),
        ...(Array.isArray(value.perturbationGate?.issues) ? value.perturbationGate.issues : []),
    ].map(item => String(item).trim()).filter(Boolean);

    return issues.length > 0 ? issues.join('; ') : String(value.overallVerdict || '').trim();
}

export function formatMathPerturbationInfo(meta: Record<string, any>): string {
    const perturbationType = String(meta.perturbationType || '').trim();
    const perturbationDesc = Array.isArray(meta.trapDescriptions)
        ? meta.trapDescriptions.map(item => String(item).trim()).filter(Boolean).join(' | ')
        : '';

    return perturbationType ? `${perturbationType} | ${perturbationDesc}` : perturbationDesc;
}
