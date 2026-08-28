import { callLLM, cleanJsonString } from "../../../llmClient";
import { callLLMTracked } from "../costTracker";
import { BaseProblem, TrapModification, TrapType, UserInput } from "../../../../types/multiNodeTypes";
import { getDifficultyConstraints } from "../../../nodes/node0-input";
import { identifyDiscipline } from "../disciplines";

/**
 * Physics: Trap Master (Consolidated)
 */

export async function applyTraps(
    baseProblem: BaseProblem,
    trapCount: number,
    problemIndex?: number
): Promise<TrapModification[]> {
    if (trapCount === 0) return [];

    // 判断是否为量子力学方向，选择对应的陷阱池
    const disciplineKey = identifyDiscipline(baseProblem.topic);
    const isQuantumMechanics = disciplineKey === 'modern-quantum';

    const generalTraps = [
        '- 过程判定陷阱 (Process Determination)：修改情境描述，使得过程类型（如等温/绝热、定压/定容）具有迷惑性。',
        '- 公式适用性陷阱 (Formula Applicability)：提供容易错用的公式所需的数据，或隐含某些条件让常用公式失效。',
        '- 单位与量纲陷阱 (Unit Dimension)：使用非标准单位，或在计算过程中容易忽略的单位转换。'
    ];

    const quantumTraps = [
        '- 算符对易性陷阱 (Operator Commutativity)：在题目中给出两个不对易算符的期望值或"精确值"，诱导学生假设它们可同时精确确定。例如给出⟨x⟩和⟨p⟩的具体值后问⟨xp⟩，学生可能直接相乘而忽视[x,p]=iℏ带来的非对易修正项。',
        '- 基底选择陷阱 (Basis Selection)：在某个非本征基底下写出哈密顿量的矩阵表示，诱导学生误认为对角元就是本征能量。实际需要对角化该矩阵才能得到真正的能级。例如在|↑⟩|↓⟩基底下写出自旋哈密顿量但该基底并非H的本征基底。',
        '- 量子数耦合陷阱 (Quantum Number Coupling)：题目在非耦合表象|l₁,m₁,l₂,m₂⟩下给出信息（如各角动量分量的值），但实际问题需要在耦合表象|L,M,l₁,l₂⟩下回答（如总角动量的本征值）。需要通过CG系数进行表象变换，直接在非耦合表象中回答会得到错误结果。'
    ];

    const availableTraps = isQuantumMechanics ? quantumTraps : generalTraps;
    const trapsToApply = availableTraps.slice(0, trapCount).join('\n');

    const qmSpecificRules = isQuantumMechanics ? `
6. 量子力学陷阱专项规则：
   - 算符陷阱中必须保证题目仍有唯一正确解（正确处理对易关系后可解出）
   - 基底陷阱中矩阵表示必须数学正确（矩阵元计算无误），只是基底选择具有迷惑性
   - 量子数陷阱中CG系数必须使用正确数值，不得伪造
   - 所有陷阱修改后的题目文本必须保持量子数合法性（n≥1, 0≤l≤n-1, |m|≤l）
` : '';

    const prompt = `
你是陷阱设计专家。给定一道标准物理"白板题"，你需要一次性为其添加多个维度的陷阱。

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
${qmSpecificRules}
【事实纪律（强制执行）】：
1. 绝对禁止篡改基础物理常数
2. 晶体结构与物质必须严格对应
3. 绝热与恒温不能同时出现（除非有明确热交换机制）
4. 液相操作温度必须低于沸点
5. 修改后题干必须保证数据完整性

【输出格式】（JSON数组）：
[
  {
    "trapType": "${isQuantumMechanics ? 'operator_commutativity/basis_selection/quantum_number_coupling' : 'process/formula/unit/distractor'}",
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
        const raw = problemIndex !== undefined
            ? await callLLMTracked(prompt, {
                model: 'reasoning',
                systemPrompt: "你是综合陷阱设计大师，专注于将多个陷阱融合进物理题目中。只返回 JSON 数组。",
                temperature: 0.4
            }, problemIndex)
            : await callLLM(prompt, {
                model: 'reasoning',
                systemPrompt: "你是综合陷阱设计大师，专注于将多个陷阱融合进物理题目中。只返回 JSON 数组。",
                temperature: 0.4
            });
        const cleanContent = cleanJsonString(raw);
        return JSON.parse(cleanContent) as TrapModification[];

    } catch (error) {
        console.error("Physics Trap Master Error:", error);
        throw new Error(`Trap Master failed: ${error.message}`);
    }
}
