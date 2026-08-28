import { callLLM } from "../../llmClient";
import { getOneApiModel, getOneApiReviewModel, getOneApiBlindModel, getCurrentProvider } from "../../llmClient";
import pricingData from "./pricing.json";

interface CostAccumulator {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
    callCount: number;
    modelsUsed: Set<string>;
}

const trackers = new Map<number, CostAccumulator>();

const CHARS_PER_TOKEN = pricingData.charsPerToken;

function getModelPrice(modelName: string): { inputPer1M: number; outputPer1M: number } {
    const key = modelName.toLowerCase();
    const models = pricingData.models as Record<string, { inputPer1M: number; outputPer1M: number }>;
    if (models[key]) return models[key];
    for (const [k, v] of Object.entries(models)) {
        if (key.includes(k) || k.includes(key)) return v;
    }
    return { inputPer1M: 5.0, outputPer1M: 15.0 };
}

function resolveModelName(modelRole?: string): string {
    if (getCurrentProvider() !== 'oneapi') {
        return modelRole === 'reasoning' ? 'deepseek-reasoner' : 'deepseek-chat';
    }
    if (modelRole === 'review') return getOneApiReviewModel();
    if (modelRole === 'reasoning') return getOneApiModel();
    return getOneApiModel();
}

export function resetCostTracker(problemIndex: number): void {
    trackers.set(problemIndex, { inputTokens: 0, outputTokens: 0, totalCost: 0, callCount: 0, modelsUsed: new Set() });
}

export function getCostSummary(problemIndex: number): { totalCost: number; inputTokens: number; outputTokens: number; callCount: number; modelsUsed: string[]; formatted: string } {
    const acc = trackers.get(problemIndex) || { inputTokens: 0, outputTokens: 0, totalCost: 0, callCount: 0, modelsUsed: new Set<string>() };
    trackers.delete(problemIndex);
    return {
        totalCost: acc.totalCost,
        inputTokens: acc.inputTokens,
        outputTokens: acc.outputTokens,
        callCount: acc.callCount,
        modelsUsed: Array.from(acc.modelsUsed),
        formatted: `¥${acc.totalCost.toFixed(4)}`
    };
}

export async function callLLMTracked(
    prompt: string,
    options: {
        model?: 'default' | 'reasoning' | 'review' | (string & {});
        temperature?: number;
        responseFormat?: 'json' | 'text';
        systemPrompt?: string;
    } = {},
    problemIndex: number
): Promise<string> {
    const result = await callLLM(prompt, options);

    const acc = trackers.get(problemIndex);
    if (acc) {
        const modelName = resolveModelName(options.model);
        const price = getModelPrice(modelName);
        const inputTokens = Math.ceil((prompt.length + (options.systemPrompt?.length || 0)) / CHARS_PER_TOKEN);
        const outputTokens = Math.ceil(result.length / CHARS_PER_TOKEN);
        const cost = (inputTokens * price.inputPer1M + outputTokens * price.outputPer1M) / 1_000_000;

        acc.inputTokens += inputTokens;
        acc.outputTokens += outputTokens;
        acc.totalCost += cost;
        acc.callCount += 1;
        acc.modelsUsed.add(modelName);
    }

    return result;
}
