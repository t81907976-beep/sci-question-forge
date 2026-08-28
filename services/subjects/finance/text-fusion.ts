import { callLLM } from "../../llmClient";
import type { TrapCluster } from "../../../types/multiNodeTypes";

/**
 * Finance: Problem Text Fusion Agent
 */

export async function fuseProblemText(
    problem: TrapCluster['combinedProblem']
): Promise<string> {
    const prompt = `
你是量化金融领域的博士后级别命题专家，精通题目排版与语言润色。你的任务是将一道量化金融题的【题干背景】和【散落的数据】完美并自然流畅地融合为一段或多段话。

【输入信息】：
干瘪的原始题干情境：
${problem.questionBody}

正确的必备数据：
${JSON.stringify(problem.givenData, null, 2)}

${Object.keys(problem.distractorData || {}).length > 0 ? `
用来迷惑解题者的干扰数据（请像给出正常市场条件一样不漏声色地插进语境里）：
${JSON.stringify(problem.distractorData, null, 2)}
` : ''}
${problem.marketConventions && Object.keys(problem.marketConventions).length > 0 ? `
必须保留的市场约定与合约条款（以专业口吻自然写入，不要罗列）：
${JSON.stringify(problem.marketConventions, null, 2)}
` : ''}
${problem.conventionDistractors && Object.keys(problem.conventionDistractors).length > 0 ? `
用来迷惑解题者的约定型干扰条款：
${JSON.stringify(problem.conventionDistractors, null, 2)}
` : ''}
【最后的问题（求解目标）】：
${problem.requiredAnswer}

【任务与规则】：
1. 你的首要目标是：**最大程度地保留【干瘪的原始题干情境】的原文句型和语气**，绝对不要像重写作文一样改变题干的叙述结构。
2. 你的唯一工作就是在这个原文的适当位置（如提到某个合约、某个标的、某家公司时），以自然插入定语、同位语或补充说明的方式，把【必备数据】和【干扰数据】的数值与单位"填"进去。
3. 请将【最后的问题】自然流畅地接在最后，作为收尾的一句话。
4. 绝对不准篡改或丢失任何一个数据的值与单位；利率、波动率的年化基准与复利约定必须原样保留。
5. **极其重要：绝对不要自作主张地添加括号来进行单位换算、复利换算或解释**。
6. 绝对不要产生生硬的罗列（如 "已知: xxx"）。
7. **不要过多加戏**，如果原句是简洁的交易台描述，就保持简洁。

【输出要求】
不要说任何废话，不要带有 Markdown 格式符号和开场白，直接输出填报好数值的那一大段"题目文本"字符串即可。
`;

    try {
        const mergedText = (await callLLM(prompt, {
            model: 'default',
            temperature: 0.7,
            systemPrompt: "你是一个文本排版与润色器。直接输出整理后自然流畅的一段话，无需任何前缀或解释。"
        })) || problem.questionBody;
        return mergedText.trim();

    } catch (error) {
        console.error("Finance Text Fusion Error:", error);
        let fallbackText = problem.questionBody + "\n\n已知数据：\n";
        Object.entries(problem.givenData || {}).forEach(([key, val]) => {
            fallbackText += `${key}: ${val.value} ${val.unit}\n`;
        });
        if (problem.marketConventions && Object.keys(problem.marketConventions).length > 0) {
            fallbackText += "\n市场约定：\n";
            Object.entries(problem.marketConventions).forEach(([key, val]) => {
                fallbackText += `${key}: ${val}\n`;
            });
        }
        if (problem.distractorData && Object.keys(problem.distractorData).length > 0) {
            fallbackText += "\n附加参考数据：\n";
            Object.entries(problem.distractorData).forEach(([key, val]) => {
                fallbackText += `${key}: ${val.value} ${val.unit}\n`;
            });
        }
        if (problem.conventionDistractors && Object.keys(problem.conventionDistractors).length > 0) {
            fallbackText += "\n附加条款说明：\n";
            Object.entries(problem.conventionDistractors).forEach(([key, val]) => {
                fallbackText += `${key}: ${val}\n`;
            });
        }
        fallbackText += `\n求解：${problem.requiredAnswer}`;
        return fallbackText.trim();
    }
}
