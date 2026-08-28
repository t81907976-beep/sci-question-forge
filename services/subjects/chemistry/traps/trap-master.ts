import { callLLM } from "../../../llmClient";
import { BaseProblem, TrapModification, TrapType, UserInput } from "../../../../types/multiNodeTypes";
import { getDifficultyConstraints } from "../../../nodes/node0-input";

/**
 * Chemistry: Trap Master (Consolidated)
 */

export async function applyTraps(
    baseProblem: BaseProblem,
    trapCount: number
): Promise<TrapModification[]> {
    if (trapCount === 0) return [];

    const availableTraps = [
        '- 过程判定陷阱 (Process Determination)：修改情境描述，使得过程类型（如等温/绝热、定压/定容）具有迷惑性。',
        '- 公式适用性陷阱 (Formula Applicability)：提供容易错用的公式所需的数据，或隐含某些条件让常用公式失效。',
        '- 单位与量纲陷阱 (Unit Dimension)：使用非标准单位，或在计算过程中容易忽略的单位转换。'
    ];

    const trapsToApply = availableTraps.slice(0, trapCount).join('\n');

    const prompt = `
你是陷阱设计专家。给定一道标准化学"白板题"，你需要一次性为其添加多个维度的陷阱。

【原题信息】：
题目：${baseProblem.originalProblemText}
情境：${baseProblem.scenario}
已知核心数据：${JSON.stringify(baseProblem.coreData, null, 2)}

【任务】：
在保证题目**依然有唯一正确解**的前提下，注入 ${trapCount} 个陷阱：
${trapsToApply}

【修改规则】：
1. **彻底拒绝生硬的情境转折**：陷阱必须通过冷峻、专业的参数描述自然融入。
2. **过程陷阱多样性（极重要）**：严格禁止总是使用"冷却水夹套"！根据题目背景选择不同手法：
   - 实验室科研：用"隔热杜瓦瓶""恒温浴槽设定温度"等
   - 工业生产：可使用"换热器""冷却水夹套"，配合工业流程参数
   - 前沿学术研究：用"绝热量热仪""密封高压釜"等
   - 纯理论推导：通过"文字措辞模糊"实现，不加实验设备
3. **单位陷阱铁律**：修改单位时必须进行严格等价换算，绝对禁止直接替换单位字符。
4. 原有正确求解所需数据必须保留。
5. 干扰数据必须有迷惑性但不能破坏守恒定律。

【事实纪律（强制执行）】：
1. 绝对禁止篡改基础物理常数
2. 晶体结构与物质必须严格对应
3. 绝热与恒温不能同时出现（除非有明确热交换机制）
4. 液相操作温度必须低于沸点
5. 修改后题干必须保证数据完整性

【输出格式】（JSON数组）：
[
  {
    "trapType": "process/formula/unit/distractor",
    "agentId": "trap_master",
    "trapModifiedText": "完整修改后的题目文本（包含所有核心数据和干扰数据）",
    "distractorData": { "干扰量1": {"value": 123, "unit": "单位"} },
    "trapDescription": "陷阱设计原理",
    "expectedConfusion": "学生可能产生的误会"
  }
]

【特别注意】：在**第一个对象**中提供最终合并所有文本修改后的 trapModifiedText，后续对象保持一致或留空。
`;

    try {
        const cleanContent = (await callLLM(prompt, {
            model: 'reasoning',
            temperature: 0.4,
            systemPrompt: "你是综合陷阱设计大师，专注于将多个陷阱融合进化学物理题目中。只返回 JSON 数组。"
        })).replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        return JSON.parse(cleanContent) as TrapModification[];

    } catch (error) {
        console.error("Chemistry Trap Master Error:", error);
        throw new Error(`Trap Master failed: ${error.message}`);
    }
}
