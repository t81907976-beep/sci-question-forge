/**
 * 物理 V2 专用：网关/传输类错误的节点级重试。
 *
 * 起因（0827 真机批量，gpt-5.6 目标 12-13 题只成 3 题）：
 *   [V2] Problem 5 failed: _APIError: Upstream HTTP/2 stream failed
 *       at callLLM (llmClient.ts:426) → deepRepairQuestion (reviewer.ts:390)
 *
 * `Upstream HTTP/2 stream failed` **不在** llmClient 的重试白名单里 —— 那里有
 * `Upstream request failed` / `Upstream body read failed` / `Upstream service` /
 * `temporarily unavailable`，独缺 stream 这一支，于是 isRetryable=false、0 次重试直接抛，
 * 一路冒到 orchestrator-v2.ts 唯一的 catch，整题变 null。
 *
 * 机械学科在 mechanical/v2/blind-solver.ts 已就同一个串踩过坑并自建了重试；本文件是物理版，
 * 区别是物理**每个节点都包**，不只盲解：单题约 9-10 次调用（A0×1 A1×2 A2/A3×5 A4×1 A5×1），
 * 而 A0/A1/A2/A3 在 orchestrator 里没有任何 try/catch 兜底（A4/A5 才有），一次断流即报废整题。
 * 10 次串联、单次硬失败率 8%，整题存活率就只剩 43%。
 *
 * llmClient 是跨学科主框架，不在本次改动范围内，所以补在物理节点这一层。
 */

/**
 * 只认与题目内容无关的传输层错误。
 *
 * 模型答不出来、JSON 解析失败都不在此列：那种情况重试只是重复烧钱，还会掩盖真实问题。
 * 因此本包装器只套在 LLM 调用本身，parse 一律留在包装器外面。
 *
 * 数字判据用 \b 收边（机械版是裸 `502|503|504`）：避免 "at position 5041" 这类内容型
 * 错误信息里以状态码开头的偏移量被误判成网关错误。注意它防不住恰好独立成词的巧合
 * （"position 503" 仍会命中），实测里这类偏移量都是四位以上，够用。
 */
const GATEWAY_ERROR =
    /HTTP\/2|stream failed|Upstream|temporarily unavailable|terminated|ECONNRESET|socket hang up|other side closed|Concurrency|rate limit|\b(?:429|500|502|503|504)\b/i;

export function isGatewayError(message: string): boolean {
    return GATEWAY_ERROR.test(message);
}

/**
 * 网关重试包装器。
 *
 * MAX_ATTEMPTS=3（即最多 2 次重试）、退避 6s/12s：与机械版对齐。网关瞬时断流通常几秒内恢复，
 * 而物理单次 reasoning 调用本身要跑 1-4 分钟，退避再长就没意义了。
 *
 * 注意这一层之上 llmClient 自己还有 MAX_RETRIES=4；能落到这里的都是 llmClient 判定
 * 「不可重试」而抛穿的，两层不会叠乘。
 */
export async function callWithGatewayRetry(
    call: () => Promise<string>,
    label: string,
): Promise<string> {
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; ; attempt++) {
        try {
            return await call();
        } catch (error) {
            const message = (error as Error)?.message || String(error);
            if (attempt >= MAX_ATTEMPTS || !isGatewayError(message)) throw error;
            const waitMs = 6000 * attempt;
            console.warn(
                `[V2 物理] ${label} 网关错误，${waitMs / 1000}s 后重试（第 ${attempt}/${MAX_ATTEMPTS - 1} 次）: ${message.slice(0, 160)}`
            );
            await new Promise(resolve => setTimeout(resolve, waitMs));
        }
    }
}
