import type { TrapCluster } from "../../../types/multiNodeTypes";
import type { RetryContext } from "../../../types/multiNodeTypes";
import { callMathLLM } from "./mathLlmTracker";
import type { MathTokenTrackerId } from "./tokenTracker";

/**
 * Node 6: Problem Text Fusion Agent - Enhanced Version
 *
 * Takes the dry questionBody and the structured givenData
 * and uses an LLM to seamlessly weave the data values into a natural language paragraph.
 *
 * Note: This version no longer uses distractorData.
 * Traps now work by modifying/enhancing the original problem conditions.
 */

export async function fuseProblemText(
    problem: TrapCluster['combinedProblem'],
    problemIndex: number,
    tokenTrackerId: MathTokenTrackerId,
    retryContext?: RetryContext | null
): Promise<string> {
    // 从 requiredAnswer 中提取求解目标的描述，而不是具体答案
    // 例如："求曲线所围面积" 而不是 "面积 = 3.14"
    const extractGoalDescription = (answer: string): string => {
        // 尝试提取求解目标的描述（去掉具体数值和表达式）
        // 例如："求 C 上所有的仿射有理点" <- 这是描述
        // 而不是："答案是 (1, 0) 和 (-1, 0)" <- 这是具体答案
        if (!answer) return '求解';

        // 如果答案中包含"="或具体数值/表达式，说明是具体答案
        if (answer.includes('=') || /\d/.test(answer)) {
            // 尝试从 questionBody 中提取求解目标（通常在最后）
            const questionMatch = problem.questionBody.match(/[求计计算][[:punct:]\s]*.+$/);
            if (questionMatch) {
                return questionMatch[0].replace(/[。！？\n].*$/, '').trim();
            }
            return '求解';
        }
        return answer;
    };

    const goalDescription = extractGoalDescription(problem.requiredAnswer);

    const formattingRetryGuidance = retryContext ? `
【重试指导 — 仅修正题面表达，不得改变数学内容】

上次失败类别：${retryContext.failureCategory}
上次失败原因：${retryContext.failureReason}
${retryContext.retryHint?.formattingInstruction ? `审查器给出的表达修改建议：${retryContext.retryHint.formattingInstruction}` : ''}

本次重试要求：
- 不得改变任何数学条件、数值、符号关系或求解目标。
- 必须补足符号定义和语言歧义。
- 必须让题面自然包含必要数据。
- 禁止泄露答案。
` : '';

    const prompt = `
你是资深的数学出题专家，精通题目排版与语言润色。你的任务是将一道数学题的【题干背景】和【散落的数据】完美并自然流畅地融合为一段或多段话。

${formattingRetryGuidance}

【输入信息】：
干瘪的原始题干情境：
${problem.questionBody}

正确的必备数据：
${JSON.stringify(problem.givenData, null, 2)}

【求解目标】（只需要描述要求解什么，切勿包含具体答案或计算结果）：
${goalDescription}

【任务与规则】：
1. 你的首要目标是：**最大程度地保留【干瘪的原始题干情境】的原文句型和语气**，绝对不要像重写作文一样改变题干的叙述结构。
2. 你的唯一工作就是在这个原文的适当位置，以自然插入定语、同位语或补充说明的方式，把【必备数据】的数值与单位"填"进去。
3. **【最关键】将【求解目标】作为问题的结尾，但只能说"求xxx"、"计算xxx"、"找出xxx"等描述性语言，绝对不能写出具体的答案、数值或表达式！**
4. 绝对不准篡改或丢失任何一个数据的值与单位。
5. **极其重要：绝对不要自作主张地添加括号来进行单位换算或解释**（例如，如果数据给的是 3.14，就直接写 3.14，**不容许**在后面加上"(即 314%)"等任何解释性文字）。
6. 绝对不要产生生硬的罗列（如 "已知: xxx"）。
7. **不要过多加戏**，如果原句是简单的描述，就保持简单。
8. **禁止在输出中出现任何答案信息**：不能出现等号(=)后的具体数值、不能出现具体坐标、不能出现表达式结果。

【输出要求】
不要说任何废话，不要带有 Markdown 格式符号和开场白，直接输出填报好数值的那一大段"题目文本"字符串即可。输出中绝对不能包含任何答案信息！
`;

    try {
        // Retry mechanism for API connection errors
        const maxRetries = 3;
        let lastError: Error | null = null;
        let content = '';

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                content = await callMathLLM(`node6_${problemIndex}`, tokenTrackerId, prompt, {
                    model: 'default',
                    temperature: 0.7,
                    systemPrompt: "你是一个文本排版与润色器。直接输出整理后自然流畅的一段话，无需任何前缀或解释。"
                });
                break;
            } catch (error: any) {
                lastError = error;
                console.warn(`Node 6 API attempt ${attempt} failed: ${error.message}`);
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        }

        if (!content) {
            throw lastError || new Error('Failed to get API response after retries');
        }

        return content.trim();

    } catch (error) {
        console.error("Node 6 Text Fusion Error:", error);
        // Fallback: 仅使用原始题干，不泄露答案
        return problem.questionBody.trim();
    }
}
