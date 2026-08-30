import OpenAI from "openai";

/**
 * 统一的 LLM 客户端配置
 * 切换模型只需修改此文件的配置，或通过 setLLMProvider() / setOneApiModel() 在运行时切换
 */

// 配置项：当前使用的模型提供商
export type LLMProvider = 'deepseek' | 'oneapi';

export interface LLMConfig {
    provider: LLMProvider;
    apiKey: string;
    baseURL: string;
    defaultModel: string;      // 用于快速生成的模型
    reasoningModel: string;    // 用于复杂推理/修复的模型
    reviewModel: string;       // 用于质检审查的模型（与生成/修复模型分离，减少自我确认偏差）
}

export interface GatewayModel {
    id: string;
    vendor: string;
}

// 网关暴露的模型 ID 由网关自己决定，不一定是各厂商的标准命名。
// 通过 VITE_GATEWAY_MODELS 覆盖，格式为 `厂商:模型ID` 列表，例如：
//   VITE_GATEWAY_MODELS="Claude:claude-opus-5,Claude:claude-sonnet-5,DeepSeek:deepseek-reasoner"
const DEFAULT_GATEWAY_MODELS: GatewayModel[] = [
    { id: "claude-opus-5", vendor: "Claude" },
    { id: "claude-sonnet-5", vendor: "Claude" },
    { id: "claude-haiku-4-5-20251001", vendor: "Claude" },
    { id: "deepseek-reasoner", vendor: "DeepSeek" },
    { id: "deepseek-chat", vendor: "DeepSeek" },
];

function parseGatewayModels(raw: string): GatewayModel[] {
    const parsed = raw
        .split(',')
        .map(entry => entry.trim())
        .filter(Boolean)
        .map(entry => {
            const separator = entry.indexOf(':');
            if (separator < 0) return { id: entry, vendor: 'Other' };
            return {
                vendor: entry.slice(0, separator).trim() || 'Other',
                id: entry.slice(separator + 1).trim(),
            };
        })
        .filter(model => model.id.length > 0);
    return parsed.length > 0 ? parsed : DEFAULT_GATEWAY_MODELS;
}

// Vite 注入 import.meta.env；在纯 Node 环境（如 node:test）下它不存在
const ENV: Record<string, string | undefined> = import.meta.env ?? {};

export const ONEAPI_MODELS: GatewayModel[] = parseGatewayModels(
    ENV.VITE_GATEWAY_MODELS || '',
);

// 从环境变量读取配置（过滤非ASCII字符，防止中文占位符污染HTTP Headers）
function sanitizeKey(key: string): string {
    // eslint-disable-next-line no-control-regex
    return /^[\x00-\xff]*$/.test(key) ? key : '';
}
const DEEPSEEK_API_KEY = sanitizeKey(ENV.VITE_DEEPSEEK_API_KEY || '');
const ONEAPI_API_KEY = sanitizeKey(ENV.VITE_ANTHROPIC_API_KEY || ''); // 网关共用这个 key

const DEFAULT_GATEWAY_MODEL: string = ONEAPI_MODELS[0].id;

// 当前网关选中的模型
let currentOneApiModel: string = DEFAULT_GATEWAY_MODEL;

// 质检模型（默认与生成模型相同，可通过 setOneApiReviewModel 独立设置）
let currentOneApiReviewModel: string = DEFAULT_GATEWAY_MODEL;

// 盲解模型（默认与生成模型相同，可通过 setOneApiBlindModel 独立设置）
let currentOneApiBlindModel: string = DEFAULT_GATEWAY_MODEL;

// 当前配置
let CURRENT_CONFIG: LLMConfig = {
    provider: 'deepseek',
    apiKey: DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
    defaultModel: "deepseek-chat",
    reasoningModel: "deepseek-reasoner",
    reviewModel: "deepseek-reasoner"
};

// 判断模型是否为 Claude 系列（部分网关的展示名不带 claude 前缀，只给系列名）
function isClaudeModel(modelName: string): boolean {
    const lower = modelName.toLowerCase();
    return lower.includes('claude') || /\b(fable|opus|sonnet|haiku)\b/.test(lower);
}

// 各提供商的预设配置
function getProviderConfig(provider: LLMProvider): LLMConfig {
    if (provider === 'deepseek') {
        return {
            provider: 'deepseek',
            apiKey: DEEPSEEK_API_KEY,
            baseURL: "https://api.deepseek.com",
            defaultModel: "deepseek-chat",
            reasoningModel: "deepseek-reasoner",
            reviewModel: "deepseek-reasoner"
        };
    }
    // oneapi: 使用当前选中的模型，通过 Vite proxy 转发避免 CORS 问题
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return {
        provider: 'oneapi',
        apiKey: ONEAPI_API_KEY,
        // baseURL 根据模型类型动态决定，这里给默认值（Claude 用 Anthropic 端点）
        baseURL: `${origin}/api/oneapi`,
        defaultModel: currentOneApiModel,
        reasoningModel: currentOneApiModel,
        reviewModel: currentOneApiReviewModel
    };
}


/**
 * 运行时切换 LLM 提供商
 */
export function setLLMProvider(provider: LLMProvider): void {
    CURRENT_CONFIG = getProviderConfig(provider);
    console.log(`[LLM] 已切换到: ${provider} (模型: ${CURRENT_CONFIG.defaultModel})`);
}

/**
 * 设置 OneAPI 使用的具体模型
 */
export function setOneApiModel(modelId: string): void {
    currentOneApiModel = modelId;
    currentOneApiReviewModel = modelId;
    currentOneApiBlindModel = modelId;
    // 如果当前 provider 就是 oneapi，立即刷新配置
    if (CURRENT_CONFIG.provider === 'oneapi') {
        CURRENT_CONFIG = getProviderConfig('oneapi');
    }
    console.log(`[LLM] OneAPI 主模型切换为: ${modelId}（同时更新质检/盲解模型为同一模型）`);
}

/**
 * 获取当前 OneAPI 选中的模型
 */
export function getOneApiModel(): string {
    return currentOneApiModel;
}

/**
 * 设置 OneAPI 质检模型（独立于生成/修复模型，用于 reviewer.ts 的 reviewDraft）
 */
export function setOneApiReviewModel(modelId: string): void {
    currentOneApiReviewModel = modelId;
    console.log(`[LLM] OneAPI 质检模型切换为: ${modelId}`);
}

/**
 * 获取当前 OneAPI 质检模型
 */
export function getOneApiReviewModel(): string {
    return currentOneApiReviewModel;
}

/**
 * 设置 OneAPI 盲解模型（独立于生成/修复模型，用于 blind-solver.ts 的 solveBiologyBlind）
 */
export function setOneApiBlindModel(modelId: string): void {
    currentOneApiBlindModel = modelId;
    console.log(`[LLM] OneAPI 盲解模型切换为: ${modelId}`);
}

/**
 * 获取当前 OneAPI 盲解模型
 */
export function getOneApiBlindModel(): string {
    return currentOneApiBlindModel;
}

/**
 * 获取当前激活的提供商
 */
export function getCurrentProvider(): LLMProvider {
    return CURRENT_CONFIG.provider;
}

function getActiveConfig(): LLMConfig {
    // oneapi 每次取最新模型
    if (CURRENT_CONFIG.provider === 'oneapi') {
        return getProviderConfig('oneapi');
    }
    return CURRENT_CONFIG;
}

// 创建 OpenAI 兼容客户端（DeepSeek 使用）
function createOpenAIClient(config: LLMConfig): OpenAI {
    return new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        dangerouslyAllowBrowser: true,
        timeout: 3600000  // 1小时超时
    });
}

// 导出向后兼容的 llmClient（OpenAI 兼容接口）
export const llmClient = createOpenAIClient(getProviderConfig('deepseek'));

// 导出当前配置供其他地方使用
export const currentConfig = CURRENT_CONFIG;

/**
 * 通用 LLM 调用函数
 * - OneAPI Claude 模型 → Anthropic SDK（支持 thinking）
 * - OneAPI 非 Claude 模型 → OpenAI SDK（/v1/chat/completions）
 * - DeepSeek → OpenAI SDK
 */
export async function callLLM(
    prompt: string,
    options: {
        model?: 'default' | 'reasoning' | 'review' | (string & {});
        temperature?: number;
        responseFormat?: 'json' | 'text';
        systemPrompt?: string;
        reasoning?: {
            effort: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';  // 推理深度
            summary: 'auto' | 'concise' | 'detailed';                              // 推理摘要格式
        };  // 只对数学和 GPT 模型有效
    } = {}
): Promise<string> {
    const activeConfig = getActiveConfig();

    const requestedModel = options.model ?? 'default';
    let modelName = options.model === 'reasoning'
        ? activeConfig.reasoningModel
        : options.model === 'review'
            ? activeConfig.reviewModel
            : options.model === 'default' || !options.model
                ? activeConfig.defaultModel
                : options.model; // 非别名时直接透传模型名

    // 硬保护：主模型未选择 Claude 时，任何遗留的显式 Claude 参数都强制回落到当前主模型。
    // 典型场景：React state/HMR 中 oneApiBlindModel 仍是旧值 Claude，但用户主模型已切到非 Claude 模型。
    if (activeConfig.provider === 'oneapi' && isClaudeModel(modelName) && !isClaudeModel(currentOneApiModel)) {
        console.warn(`[LLM MODEL GUARD] requested=${requestedModel} resolved=${modelName} but main=${currentOneApiModel}; override resolved model to main model to avoid unintended Claude call`);
        modelName = currentOneApiModel;
    }

    const callId = `llm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const promptLen = prompt.length;
    console.log(
        `[LLM CALL START] id=${callId} provider=${activeConfig.provider} requested=${requestedModel} resolved=${modelName} responseFormat=${options.responseFormat ?? 'text'} temperature=${options.temperature ?? 0.7} reasoningEffort=${options.reasoning?.effort ?? 'unset(未发送)'} promptLen=${promptLen}`
    );

    // OneAPI: Claude → Anthropic SDK (/v1/messages)，非 Claude → OpenAI SDK (/v1/chat/completions)
    if (activeConfig.provider === 'oneapi') {
        const isKimi    = modelName.toLowerCase().includes('kimi');
        const isMiniMax = modelName.toLowerCase().includes('minimax');
        const isGLM     = modelName.toLowerCase().includes('glm');
        const isDeepSeek = modelName.toLowerCase().includes('deepseek');
        const isClaude  = isClaudeModel(modelName);
        const isGPT     = modelName.toLowerCase().includes('gpt');
        // GPT-5.x 是原生推理模型，思考与输出共用 token 预算；16384 太小会导致思考耗尽后 content 为空。
        // 提到 65536，给深度推理留出空间后仍能写完题目 JSON。
        const maxTokens = isGLM ? 131072 : isKimi ? 65536 : isDeepSeek ? 98304 : isMiniMax ? 8192 : isClaude ? 65536 : isGPT ? 65536 : 16384;

        const MAX_RETRIES = 4;
        let lastError: unknown;

        if (isClaudeModel(modelName)) {
            console.log(`[LLM ROUTE] id=${callId} route=oneapi-anthropic(claude)`);
            const messages = [
                { role: "user", content: prompt }
            ];

            // 开启 extended thinking：Opus/Sonnet 等 Claude 模型只有在传 thinking 参数时才会深度推理。
            // 不传等于"非思考模式"，会让生题/审查/盲解全部退化成浅层一遍过（模板题、宽松放行）。
            // 把 options.reasoning.effort 映射成思考预算；未指定 reasoning 时给一个足够出竞赛题的默认预算。
            // budget_tokens 必须 < max_tokens，且 Anthropic 要求 ≥1024；开启后 temperature 只能为 1（本分支本就不传 temperature，无冲突）。
            const effortToBudget: Record<string, number> = {
                none: 0, minimal: 0, low: 4096, medium: 10000, high: 16000, xhigh: 32000,
            };
            const requestedEffort = options.reasoning?.effort;
            const thinkingBudget = requestedEffort !== undefined
                ? (effortToBudget[requestedEffort] ?? 10000)
                : 10000;
            const enableThinking = thinkingBudget >= 1024 && thinkingBudget < maxTokens;
            const thinkingConfig = enableThinking
                ? { type: 'enabled' as const, budget_tokens: thinkingBudget }
                : undefined;
            if (thinkingConfig) {
                console.log(`[LLM THINKING] id=${callId} enabled budget_tokens=${thinkingBudget} (effort=${requestedEffort ?? 'default'})`);
            }

            let systemPrompt = options.systemPrompt || '';
            if (options.responseFormat === 'json') {
                const jsonConstraint = '\n\n【格式要求】你必须只输出严格的 JSON，不要输出 markdown 代码块、注释或任何非 JSON 文本。直接以 { 开头，以 } 结尾。';
                systemPrompt = systemPrompt ? systemPrompt + jsonConstraint : jsonConstraint.trim();
            }

            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                try {
                    const response = await fetch(`${activeConfig.baseURL}/v1/messages`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${activeConfig.apiKey}`,
                            'x-api-key': activeConfig.apiKey,
                        },
                        body: JSON.stringify({
                            model: modelName,
                            max_tokens: maxTokens,
                            system: systemPrompt || undefined,
                            thinking: thinkingConfig,
                            messages
                        })
                    });
                    if (!response.ok) {
                        const errorText = await response.text();
                        const requestError: any = new Error(errorText || `Claude request failed with HTTP ${response.status}`);
                        requestError.status = response.status;
                        throw requestError;
                    }
                    const responseBody = await response.json();
                    const block = responseBody.content?.find((b: any) => b.type === 'text') as any;
                    const output = block?.text || '';
                    // 诊断：确认网关是否真的让 Opus 进入了思考模式。
                    // thinking 真正生效时，响应 content 数组里会出现 type==='thinking' 的块。
                    // 若只有 text 块 → 网关吞掉了 thinking 参数，模型仍是非思考模式。
                    const blockTypes = Array.isArray(responseBody.content)
                        ? responseBody.content.map((b: any) => b.type)
                        : [];
                    const thinkingBlock = Array.isArray(responseBody.content)
                        ? responseBody.content.find((b: any) => b.type === 'thinking' || b.type === 'redacted_thinking')
                        : undefined;
                    const thinkingLen = (thinkingBlock?.thinking || thinkingBlock?.data || '').length;
                    console.log(
                        `[LLM THINKING CHECK] id=${callId} blockTypes=[${blockTypes.join(',')}] thinkingActuallyRan=${Boolean(thinkingBlock)} thinkingLen=${thinkingLen} usage=${JSON.stringify(responseBody.usage ?? {})}`
                    );
                    if (thinkingConfig && !thinkingBlock) {
                        console.warn(`[LLM THINKING CHECK] id=${callId} ⚠️ 请求已带 thinking 参数，但响应无 thinking 块 —— 网关可能未透传 thinking，Opus 实际未进入思考模式`);
                    }
                    console.log(`[LLM CALL END] id=${callId} success=true resolved=${modelName} outputLen=${output.length}`);
                    return output;
                } catch (err: any) {
                    lastError = err;
                    const status = err?.status ?? err?.statusCode;
                    const isRetryable = status === 504 || status === 502 || status === 503 || status === 429
                        || err?.message?.includes('ERR_ABORTED')
                        || err?.message?.includes('ECONNRESET')
                        || err?.message?.includes('timeout')
                        || err?.message?.includes('ERR_EMPTY_RESPONSE')
                        || err?.message?.includes('Failed to fetch')
                        || err?.message?.includes('Connection error')
                        || err?.message?.includes('Upstream request failed')
                        || err?.message?.includes('Upstream body read failed')
                        || err?.message?.includes('Upstream service')
                        || err?.message?.includes('temporarily unavailable')
                        || err?.message?.includes('api_error');
                    if (!isRetryable || attempt === MAX_RETRIES) throw err;
                    const base = status === 429 ? 8_000 : 3_000;
                    const delay = Math.min(base * Math.pow(2, attempt) + Math.random() * 2_000, 60_000);
                    console.warn(`[LLM] ${modelName} 请求失败 (${status ?? err?.message})，${(delay / 1000).toFixed(1)}s 后重试（第 ${attempt + 1}/${MAX_RETRIES} 次）`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            throw lastError;
        } else {
            console.log(`[LLM ROUTE] id=${callId} route=oneapi-openai-chat`);
            // 非 Claude 模型 → OpenAI SDK (/v1/chat/completions)
            const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
            const client = new OpenAI({
                apiKey: activeConfig.apiKey,
                baseURL: `${origin}/api/oneapi/v1`,
                dangerouslyAllowBrowser: true,
                timeout: 3600000  // 1小时超时
            });

            const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
            if (options.systemPrompt) {
                messages.push({ role: "system", content: options.systemPrompt });
            }
            messages.push({ role: "user", content: prompt });

            const createOptions: any = {
                model: modelName,
                messages,
                temperature: isKimi ? 1 : (options.temperature ?? 0.7)
            };

            // GLM thinking 模型：尝试限制 reasoning token 消耗，为 content 输出保留空间。
            // thinking.budget_tokens 若被 GLM API 支持则生效；不支持则忽略，无副作用。
            if (isGLM) {
                (createOptions as any).thinking = { budget_tokens: 4000 };
                createOptions.max_tokens = maxTokens;
            }
            // 推理模型使用 max_completion_tokens（涵盖思考+输出），非推理模型用 max_tokens
            else if (isKimi || isGPT) {
                createOptions.max_completion_tokens = maxTokens;
            } else {
                createOptions.max_tokens = maxTokens;
            }

            // reasoning 参数（只对数学和 GPT 模型有效）
            if (options.reasoning && modelName.toLowerCase().includes('gpt')) {
                (createOptions as any).reasoning = options.reasoning;
                // 本分支走的是 /chat/completions，该端点的官方推理档位字段是扁平的
                // reasoning_effort；reasoning: { effort } 是 /responses 端点的形状，
                // 走 chat 路由时可能被网关静默丢弃（表现为 reasoning=0 chars）。
                // 两个都发，谁生效算谁。'xhigh' 不是 OpenAI 合法取值，映射成 'high'
                // 以免严格校验的网关返回 400；'none'/'minimal' 表示不要思考，直接不发。
                const effort = options.reasoning.effort;
                if (effort && effort !== 'none' && effort !== 'minimal') {
                    (createOptions as any).reasoning_effort = effort === 'xhigh' ? 'high' : effort;
                }
            }

            if (options.responseFormat === 'json') {
                if (isKimi || isGLM) {
                    // Kimi/GLM 不支持 response_format，通过 system prompt 约束 JSON 输出
                    const jsonConstraint = '你必须只输出严格的 JSON，不要输出 markdown 代码块、注释或任何非 JSON 文本。直接以 { 开头，以 } 结尾。';
                    if (messages.length > 0 && messages[0].role === 'system') {
                        messages[0].content += '\n\n' + jsonConstraint;
                    } else {
                        messages.unshift({ role: 'system', content: jsonConstraint });
                    }
                } else {
                    createOptions.response_format = { type: "json_object" };
                }
            }

            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                try {
                    // 使用流式请求避免 OneAPI 网关 504 超时
                    const stream = await client.chat.completions.create({
                        ...createOptions,
                        stream: true
                    }) as any;
                    let result = '';
                    let reasoning = '';
                    let finishReason = '';
                    let chunkCount = 0;
                    for await (const chunk of stream) {
                        chunkCount++;
                        const delta = chunk.choices[0]?.delta as any;
                        if (delta?.content) result += delta.content;
                        if (delta?.reasoning_content) reasoning += delta.reasoning_content;
                        if (chunk.choices[0]?.finish_reason) finishReason = chunk.choices[0].finish_reason;
                    }

                    // 流式返回0个chunk时，抛出可重试的429错误
                    // （OpenAI SDK 在流式模式下遇到429/5xx不抛异常，而是静默给出0 chunks）
                    if (chunkCount === 0) {
                        const syntheticErr: any = new Error('Stream returned 0 chunks (possible 429 rate-limit or quota exhausted)');
                        syntheticErr.status = 429;
                        throw syntheticErr;
                    }

                    if (finishReason === 'length') {
                        console.warn(`[LLM] ${modelName} finish_reason=length，JSON 可能被截断，content=${result.length} chars，reasoning=${reasoning.length} chars`);
                    } else if (finishReason) {
                        console.warn(`[LLM] ${modelName} finish_reason=${finishReason}，content=${result.length} chars，reasoning=${reasoning.length} chars`);
                    }
                    if (!result && reasoning) {
                        console.warn(`[LLM] ${modelName} content 为空但 reasoning_content 有内容 (${reasoning.length} chars)，尝试从 reasoning 中提取 JSON`);
                        // DeepSeek/GLM reasoning 模型把最终 JSON 写在推理末尾。
                        // 用 \{\s*" 匹配 { 后紧跟任意空白再跟引号，可同时覆盖格式化 JSON（换行缩进）
                        // 和内联 JSON，且不会误匹配 LaTeX 花括号（如 {-1}、{V_{max}}，后面跟的不是引号）。
                        const jsonStartMatches = [...reasoning.matchAll(/\{\s*"/g)];
                        console.warn(`[LLM] reasoning 中找到 ${jsonStartMatches.length} 个 {"  候选起点`);
                        if (jsonStartMatches.length > 0) {
                            const lastIdx = jsonStartMatches[jsonStartMatches.length - 1].index!;
                            const slice = reasoning.slice(lastIdx);
                            const extracted = slice.match(/\{[\s\S]*\}/)?.[0] ?? '';
                            console.warn(`[LLM] 最后一个候选起点 @${lastIdx}，切片长度=${slice.length}，提取结果长度=${extracted.length}`);
                            result = extracted;
                        }
                        // last-resort fallback：原始行为（可能误匹配 LaTeX，但保持向后兼容）
                        if (!result) {
                            result = reasoning.match(/\{[\s\S]*\}/)?.[0] ?? '';
                            console.warn(`[LLM] last-resort 宽松提取结果长度=${result.length}`);
                        }
                        if (!result) {
                            console.warn(`[LLM] reasoning 末尾500字符（调试用）: ${reasoning.slice(-500)}`);
                        }
                    }
                    // GLM/DeepSeek 耗尽 thinking budget 后输出空 content 且 reasoning 无 JSON：触发重试
                    if (!result) {
                        const syntheticErr: any = new Error(`Empty output: content=0 chars, reasoning=${reasoning.length} chars but no JSON found`);
                        syntheticErr.status = 429;
                        throw syntheticErr;
                    }
                    console.log(`[LLM CALL END] id=${callId} success=true resolved=${modelName} outputLen=${result.length}`);
                    return result;
                } catch (err: any) {
                    lastError = err;
                    const status = err?.status ?? err?.statusCode;
                    const isRetryable = status === 504 || status === 502 || status === 503 || status === 429
                        || err?.message?.includes('ERR_ABORTED')
                        || err?.message?.includes('ECONNRESET')
                        || err?.message?.includes('timeout')
                        || err?.message?.includes('ERR_EMPTY_RESPONSE')
                        || err?.message?.includes('Failed to fetch')
                        || err?.message?.includes('Connection error')
                        || err?.message?.includes('Concurrency limit exceeded')
                        || err?.message?.includes('Upstream request failed')
                        || err?.message?.includes('Upstream body read failed')
                        || err?.message?.includes('Upstream service')
                        || err?.message?.includes('temporarily unavailable')
                        || err?.message?.includes('api_error')
                        || err?.message?.includes('返回空响应');
                    if (!isRetryable || attempt === MAX_RETRIES) throw err;
                    // Kimi/MiniMax/GLM 的 TPM 窗口约 60s，429 时需等够让 quota 恢复
                    const isKimiLike = modelName.toLowerCase().includes('kimi')
                        || modelName.toLowerCase().includes('minimax')
                        || modelName.toLowerCase().includes('glm');
                    const base = status === 429 ? (isKimiLike ? 30_000 : 8_000) : 3_000;
                    const delay = Math.min(base * Math.pow(2, attempt) + Math.random() * 2_000, 120_000);
                    console.warn(`[LLM] ${modelName} 请求失败 (${status ?? err?.message})，${(delay / 1000).toFixed(1)}s 后重试（第 ${attempt + 1}/${MAX_RETRIES} 次）`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            throw lastError;
        }
    }

    // DeepSeek → OpenAI SDK
    const client = createOpenAIClient(activeConfig);
    console.log(`[LLM ROUTE] id=${callId} route=deepseek-openai-chat`);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (options.systemPrompt) {
        messages.push({ role: "system", content: options.systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    // DeepSeek 的推理档模型思考链可达 20K+ 字符，需要更大 token 预算
    const isDeepSeekReasoning = /pro|reasoner/.test(modelName.toLowerCase());
    const dsMaxTokens = isDeepSeekReasoning ? 32768 : 8192;

    const createOptions: OpenAI.Chat.ChatCompletionCreateParams = {
        model: modelName,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: dsMaxTokens
    };

    if (options.responseFormat === 'json') {
        // DeepSeek pro 和某些模型不支持 response_format
        if (modelName.includes('pro')) {
            console.warn(`[LLM] ${modelName} 不支持 response_format，将通过 prompt 约束输出格式`);
        } else {
            createOptions.response_format = { type: "json_object" };
        }
    }

    const MAX_RETRIES = 2;
    let lastError: unknown;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await client.chat.completions.create(createOptions);
            const output = response.choices[0]?.message?.content || '';
            console.log(`[LLM CALL END] id=${callId} success=true resolved=${modelName} outputLen=${output.length}`);
            return output;
        } catch (err: any) {
            lastError = err;
            const status = err?.status ?? err?.statusCode;
            const isRetryable = status === 504 || status === 502 || status === 503 || status === 429
                || err?.message?.includes('ERR_ABORTED')
                || err?.message?.includes('ECONNRESET')
                || err?.message?.includes('timeout')
                || err?.message?.includes('ERR_EMPTY_RESPONSE')
                || err?.message?.includes('Failed to fetch')
                || err?.message?.includes('Connection error')
                || err?.message?.includes('Upstream request failed')
                || err?.message?.includes('Upstream body read failed')
                || err?.message?.includes('Upstream service')
                || err?.message?.includes('temporarily unavailable')
                || err?.message?.includes('api_error');
            if (!isRetryable || attempt === MAX_RETRIES) throw err;
            const delay = status === 429 ? (attempt + 1) * 15_000 : (attempt + 1) * 5_000;
            console.warn(`[LLM] ${modelName} 请求失败 (${status ?? err?.message})，${delay / 1000}s 后重试（第 ${attempt + 1}/${MAX_RETRIES} 次）`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}

/**
 * 清洗 JSON 字符串（处理 markdown 格式）
 * 使用括号匹配算法正确处理嵌套结构
 */
export function cleanJsonString(str: string): string {
    // 移除 markdown 代码块标记
    let cleaned = str.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();

    // 移除可能的非 JSON 前缀（如模型思考过程的标记）
    const jsonStart = cleaned.indexOf('{');
    const jsonArrayStart = cleaned.indexOf('[');

    // 找到第一个 JSON 结构开始的位置
    let startPos = -1;
    if (jsonStart !== -1 && jsonArrayStart !== -1) {
        startPos = Math.min(jsonStart, jsonArrayStart);
    } else if (jsonStart !== -1) {
        startPos = jsonStart;
    } else if (jsonArrayStart !== -1) {
        startPos = jsonArrayStart;
    }

    if (startPos > 0) {
        cleaned = cleaned.substring(startPos);
    }

    // 使用括号匹配算法正确找到 JSON 的结束位置
    let level = 0;
    let endPos = -1;

    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned.charAt(i);
        if (char === '{' || char === '[') {
            level++;
        } else if (char === '}' || char === ']') {
            if (level === 1) {
                endPos = i;
                break;
            }
            level--;
        }
    }

    // 如果匹配失败，使用原来的逻辑作为fallback
    if (endPos === -1) {
        const lastBrace = cleaned.lastIndexOf('}');
        const lastBracket = cleaned.lastIndexOf(']');
        endPos = Math.max(lastBrace, lastBracket);
    }

    if (endPos !== -1 && endPos < cleaned.length - 1) {
        cleaned = cleaned.substring(0, endPos + 1);
    }

    return cleaned.trim();
}

/**
 * 获取当前使用的模型信息（用于日志和调试）
 */
export function getModelInfo() {
    const activeConfig = getActiveConfig();
    return {
        provider: activeConfig.provider,
        defaultModel: activeConfig.defaultModel,
        reasoningModel: activeConfig.reasoningModel
    };
}
