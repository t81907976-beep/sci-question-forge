import { callLLM, getCurrentProvider, getModelInfo } from "../../llmClient";
import { recordMathTokenUsage, type MathTokenTrackerId } from "./tokenTracker";

type MathLLMOptions = {
    model?: 'default' | 'reasoning' | 'review' | (string & {});
    temperature?: number;
    responseFormat?: 'json' | 'text';
    systemPrompt?: string;
    reasoning?: {
        effort: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';
        summary: 'auto' | 'concise' | 'detailed';
    };
};

function resolveModelName(
    model: string | undefined,
    info: { defaultModel: string; reasoningModel: string; reviewModel?: string }
): string {
    if (model === 'reasoning') return info.reasoningModel;
    if (model === 'review') return info.reviewModel || info.reasoningModel;
    if (!model || model === 'default') return info.defaultModel;
    return model;
}

export async function callMathLLM(
    nodeKey: string,
    trackerId: MathTokenTrackerId,
    prompt: string,
    options: MathLLMOptions = {}
): Promise<string> {
    const result = await callLLM(prompt, options);
    const info = getModelInfo() as { defaultModel: string; reasoningModel: string; reviewModel?: string };
    recordMathTokenUsage(trackerId, nodeKey, {
        provider: getCurrentProvider(),
        model: resolveModelName(options.model, info),
        promptText: prompt + (options.systemPrompt || ''),
        outputText: result,
    });
    return result;
}
