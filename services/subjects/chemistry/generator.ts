import { callLLM } from "../../llmClient";
import type { BaseProblem, UserInput, TextbookConstraints } from "../../../types/multiNodeTypes";
import { getTextbookPromptConstraints } from "../../nodes/node1-rag";
import { getDisciplineGuidance } from "./disciplines";
import { cleanAndParseJSON, validateAndFixProblemJSON } from "../../utils/jsonCleaner";

/**
 * Chemistry: Base Problem Generator
 */

export async function generateBaseProblem(
    input: UserInput,
    constraints: TextbookConstraints,
    problemNumber: number,
    allowedAngles: string[] = [],
    usedAngles: string[] = []
): Promise<BaseProblem> {
    const topicDisciplineGuidance = getDisciplineGuidance(input.topic);

    const backgrounds = ["实验室科研", "工业生产", "前沿学术研究", "纯理论推导"];
    const randomBackground = backgrounds[(problemNumber - 1) % backgrounds.length];

    const prompt = `
你是一位资深化学教育专家。请生成一道以【${randomBackground}】为背景的高质量化学题目。

【重要】：这是一道"白板题"，必须：
1. 题目清晰明确，无陷阱
2. 所有条件充分且必要
3. 有唯一正确解
4. 体现真实的${randomBackground}场景

【主题】：${input.topic}
${input.trapCount > 0 ? `【陷阱数预期】：${input.trapCount}\n` : ''}【是否允许查表】：${input.allowTableLookup ? '是' : '否'}

${getTextbookPromptConstraints(constraints)}

【事实纪律（强制执行）】：
1. 绝对禁止篡改基础物理常数：
   - 阿伏伽德罗常数: N_A = 6.02214076×10²³ mol⁻¹
   - 气体常数: R = 8.314 J/(mol·K)
   - 玻尔兹曼常数: k_B = 1.380649×10⁻²³ J/K
   - 元素摩尔质量误差范围: ±0.01 g/mol

2. 晶体结构与物质必须严格对应：
   - BaCO₃: 斜方晶系（不是方解石/三方）
   - CaF₂: 萤石型结构
   - NaCl: 岩盐型结构
   - CeF₃: 六方坐标晶型（非萤石型）

3. 物理边界条件必须严格自洽：
   - **绝热过程 (Q=0)**: 温度必然变化
   - **恒温过程 (T=const)**: 必须有热交换，绝对禁止与"绝热"同时出现
   - ⚠️ **核心禁止**: 绝热与恒温不能同时指定

4. 物质的物理性质必须符合实验数据（液相操作温度必须低于沸点）

5. 反应机理必须化学上可行

【逻辑深度要求】：
${input.singleQuestion ? `⚠️ 【强制单问】：题目必须只有一个问题，只有一个求解目标。\n\n` : ''}- 题目应有合理的推理深度，考察学科核心概念的深层理解。
- 采用化学竞赛或研究生考试的思维水平，要求多步推理。
- 题目应包含多步逻辑推演（至少 4-6 个独立步骤）。
- ⚠️ **铁律**：当难度要求与物理自洽性冲突时，必须优先保证物理自洽性。

【题型角度规则（严格执行）】：
${allowedAngles.length > 0
        ? `合法考法范围：${allowedAngles.join('、')}\n已用角度：${usedAngles.length > 0 ? usedAngles.join('、') : '无'}\n请选择一个尚未使用的角度出题；若所有角度已用，允许复用但必须更换情境与数值。`
        : '请从该主题挖掘最深度且尽量多样化的考法角度。'
    }

【逻辑深度与学科特征】：
${topicDisciplineGuidance}

【输出要求】：
请返回一个 JSON 对象，包含以下字段：
{
  "problemId": "base_${problemNumber}_${Date.now()}",
  "questionAngle": "本题核心考法关键词（2-5个字）",
  "topic": "${input.topic}",
  "scenario": "真实场景描述（1-2句话）",
  "originalProblemText": "完整的带数据文字的原始题干（200-300字）",
  "coreData": {
    "物理量名称1": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "求解目标${input.singleQuestion ? '，必须只有一个求解目标' : ''}",
  "referenceSteps": ["步骤1", "步骤2", "...（至少6步）"]
}
`;

    try {
        const cleanContent = (await callLLM(prompt, { model: 'reasoning', temperature: 0.3 }))
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const baseProblem: BaseProblem = cleanAndParseJSON(cleanContent);
        const fixedProblem = validateAndFixProblemJSON(baseProblem);

        if (!fixedProblem.originalProblemText || !fixedProblem.coreData || !fixedProblem.referenceSteps) {
            throw new Error('Generated problem is incomplete: missing text, data, or steps.');
        }
        if (fixedProblem.referenceSteps.length < 3) {
            throw new Error('Reference solution path too short (minimum 3 steps required)');
        }

        return fixedProblem;

    } catch (error) {
        console.error("Chemistry Generator Error:", error);
        throw new Error(`Failed to generate base problem: ${error.message}`);
    }
}
