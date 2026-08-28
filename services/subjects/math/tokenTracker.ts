import type { MathTokenUsage } from "./sheetsFormatting.ts";

type MathNodeUsage = Record<string, MathTokenUsage>;
export type MathTokenTrackerId = string | number;

interface RecordTokenUsageInput {
    provider: string;
    model: string;
    promptText: string;
    outputText: string;
}

const CHARS_PER_TOKEN = 4;
const trackers = new Map<MathTokenTrackerId, MathNodeUsage>();

function estimateTokens(text: string): number {
    return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export function resetMathTokenTracker(trackerId: MathTokenTrackerId): void {
    trackers.set(trackerId, {});
}

export function recordMathTokenUsage(trackerId: MathTokenTrackerId, nodeKey: string, usageInput: RecordTokenUsageInput): void {
    const usageByNode = trackers.get(trackerId);
    if (!usageByNode) return;

    const inputTokens = estimateTokens(usageInput.promptText);
    const outputTokens = estimateTokens(usageInput.outputText);
    const existing = usageByNode[nodeKey];

    usageByNode[nodeKey] = {
        provider: existing?.provider || usageInput.provider,
        model: existing?.model || usageInput.model,
        inputTokens: (existing?.inputTokens || 0) + inputTokens,
        outputTokens: (existing?.outputTokens || 0) + outputTokens,
        totalTokens: (existing?.totalTokens || 0) + inputTokens + outputTokens,
        callCount: (existing?.callCount || 0) + 1,
    };
}

export function getMathTokenUsage(trackerId: MathTokenTrackerId): MathNodeUsage {
    const usage = trackers.get(trackerId) || {};
    return { ...usage };
}

export function clearMathTokenTracker(trackerId: MathTokenTrackerId): void {
    trackers.delete(trackerId);
}
