import { callLLMTracked } from "../costTracker";
import type { BaseProblem, TrapModification } from "../../../../types/multiNodeTypes";
import { getMatchedDisciplineAntiPatterns } from "../disciplines";

/**
 * Materials Science: Trap Master (Consolidated)
 */

export async function applyTraps(
    baseProblem: BaseProblem,
    trapCount: number,
    problemIndex: number = 0
): Promise<TrapModification[]> {
    if (trapCount === 0) return [];

    // 通用陷阱策略库
    const genericTraps = [
        '- 过程判定陷阱 (Process Determination)：修改情境描述，使得过程类型（如等温/绝热、定压/定容、平衡/非平衡）具有迷惑性。',
        '- 公式适用性陷阱 (Formula Applicability)：提供容易错用的公式所需的数据，或隐含某些条件让常用公式失效。',
        '- 单位与量纲陷阱 (Unit Dimension)：使用非标准单位，或在计算过程中容易忽略的单位转换。',
        '- 干扰数据陷阱 (Distractor Data)：引入与正确求解无关但极具迷惑性的数据（如多余的材料参数、非相关相图数据）。',
        '- 边界条件陷阱 (Boundary Condition)：题目条件暗示某些极端情况（如接近相变点、极低温/极高温），使学生误判适用模型。',
        '- 晶体学混淆陷阱 (Crystallographic Confusion)：利用不同晶系/晶向/晶面的相似性进行迷惑。',
    ];

    // 材料学科方向特有的反模式策略
    const disciplineAntiPatterns = getMatchedDisciplineAntiPatterns(baseProblem.topic);
    const disciplineTrapsSection = disciplineAntiPatterns.length > 0
        ? `\n【学科方向专属反模式陷阱策略（优先采用）】：\n${disciplineAntiPatterns.map(s => `- ${s}`).join('\n')}\n`
        : '';

    // 随机采样：从通用 + 学科专属中混合抽取
    const allCandidates = [...genericTraps];
    if (disciplineAntiPatterns.length > 0) {
        allCandidates.push(...disciplineAntiPatterns.map(s => `- [学科专属] ${s}`));
    }
    // Fisher-Yates 洗牌
    for (let i = allCandidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCandidates[i], allCandidates[j]] = [allCandidates[j], allCandidates[i]];
    }
    const trapsToApply = allCandidates.slice(0, Math.max(trapCount, 3)).join('\n');

    const prompt = `
你是陷阱设计专家。给定一道标准材料科学与工程"白板题"，你需要一次性为其添加多个维度的陷阱。

【原题信息】：
题目：${baseProblem.originalProblemText}
情境：${baseProblem.scenario}
已知核心数据：${JSON.stringify(baseProblem.coreData, null, 2)}

【任务】：
在保证题目**依然有唯一正确解**的前提下，注入 ${trapCount} 个陷阱。请从下方候选中挑选与本题**学科方向和情境最贴合的 ${trapCount} 种**：
${trapsToApply}
${disciplineTrapsSection}

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
        const cleanContent = (await callLLMTracked(prompt, {
            model: 'reasoning',
            temperature: 0.4,
            systemPrompt: "你是综合陷阱设计大师，专注于将多个陷阱融合进材料科学与工程题目中。只返回 JSON 数组。"
        }, problemIndex)).replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        return JSON.parse(cleanContent) as TrapModification[];

    } catch (error) {
        console.error("Materials Science Trap Master Error:", error);
        throw new Error(`Trap Master failed: ${error.message}`);
    }
}
