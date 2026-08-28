import { callLLM } from "../../llmClient";
import type { BaseProblem, UserInput, TextbookConstraints, BiologyProblemType, ReasoningType } from "../../../types/multiNodeTypes";
import { getTextbookPromptConstraints } from "../../nodes/node1-rag";
import { resolveTopicGuidance } from "./disciplines";
import { cleanAndParseJSON, validateAndFixProblemJSON } from "../../utils/jsonCleaner";
import { ACTIVE_PROMPT_BUILDER } from "./promptSwitcher";

/**
 * Biology: Base Problem Generator
 * 
 * 支持 5 种题型：
 * - calculation         : 定量计算题（守恒逻辑）
 * - genetic-reasoning   : 遗传推理题（概率逻辑）
 * - network-reasoning   : 调控网络推理题（拓扑逻辑）
 * - threshold-reasoning : 阈值逻辑推理题
 * - structural-reasoning: 结构约束推理题
 */

// ─────────────────────────────────────────────────────────────────────────────
// 推理范式约束（两种题型共用）
// ─────────────────────────────────────────────────────────────────────────────
export const REASONING_CONSTRAINTS: Record<ReasoningType, string> = {
    conservation: '【推理范式约束（守恒逻辑）】：题目核心逻辑必须是守恒约束——物质/能量的输入 = 输出 + 积累 + 消耗。必须存在至少一条因路径阻断而流向旁路的推理链。',
    topology:     '【推理范式约束（拓扑逻辑）】：题目核心逻辑必须体现调控网络的因果链——包含至少一个抑制箭头（--|}）和一个激活箭头（→），答案需通过追踪信号传递链得出。',
    threshold:    '【推理范式约束（阈值逻辑）】：题目核心逻辑必须涉及阈值门控——存在一个隐藏的临界值 θ，系统在 θ 两侧的行为不连续（全有全无）。',
    probability:  '【推理范式约束（概率逻辑）】：题目核心逻辑必须是条件概率推断——给出后代表现型比例，要求反推亲本基因型或遗传方式；结论必须唯一。',
    constraint:   '【推理范式约束（结构约束逻辑）】：题目核心逻辑必须是结构决定功能——答案需要从微观结构（碱基互补、氨基酸电荷、空间位阻）推导宏观功能或实验结果。',
    equilibrium:  '【推理范式约束（稳态逻辑）】：题目核心逻辑必须体现负反馈维持稳态——扰动方向与系统回调方向相反，且必须存在一个量化的稳态平衡点。',
    selection:    '【推理范式约束（筛选逻辑）】：题目核心逻辑必须体现"多样性库→过滤条件→差异扩增"的三段式结构。',
};

// ─────────────────────────────────────────────────────────────────────────────
// 主入口
// ─────────────────────────────────────────────────────────────────────────────
export async function generateBaseProblem(
    input: UserInput,
    constraints: TextbookConstraints,
    problemNumber: number,
    problemType: BiologyProblemType = 'calculation',
    allowedAngles: string[] = [],
    usedAngles: string[] = []
): Promise<BaseProblem> {
    // 获取学科指导和推理范式
    const difficulty = (input as any).difficulty || 'intermediate';
    const { guidance: topicDisciplineGuidance, disciplineReasoningType } = await resolveTopicGuidance(
        input.topic,
        difficulty,
        null // client 将在内部创建
    );
    
    const isReasoning = problemType !== 'calculation';

    const prompt = isReasoning
        ? ACTIVE_PROMPT_BUILDER.buildReasoningPrompt(input, constraints, topicDisciplineGuidance, disciplineReasoningType, problemNumber, problemType, allowedAngles, usedAngles)
        : ACTIVE_PROMPT_BUILDER.buildCalculationPrompt(input, constraints, topicDisciplineGuidance, disciplineReasoningType, problemNumber, allowedAngles, usedAngles);

    try {
        const cleanContent = (await callLLM(prompt, { model: 'reasoning', temperature: 0.5 }))
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const baseProblem: BaseProblem = cleanAndParseJSON(cleanContent);
        const fixedProblem = validateAndFixProblemJSON(baseProblem);

        // 推理题：验证 logicConditions 而非 givenData
        if (isReasoning) {
            if (!fixedProblem.questionBody || !fixedProblem.logicConditions || !fixedProblem.solutionPath) {
                throw new Error('Generated reasoning problem is incomplete (missing questionBody / logicConditions / solutionPath)');
            }
            if (Object.keys(fixedProblem.logicConditions).length < 2) {
                throw new Error('Reasoning problem must have at least 2 logic conditions');
            }
            if (!fixedProblem.givenData) fixedProblem.givenData = {};
        } else {
            if (!fixedProblem.questionBody || !fixedProblem.givenData || !fixedProblem.solutionPath) {
                throw new Error('Generated problem is incomplete');
            }
        }

        // Enforce richer solution paths to ensure depth (all biology problem types: >=8)
        const minSteps = 8;
        if (fixedProblem.solutionPath!.length < minSteps) {
            throw new Error(`Solution path too short (minimum ${minSteps} steps required)`);
        }

        fixedProblem.problemType = problemType;
        return fixedProblem;

    } catch (error) {
        console.error("Biology Generator Error:", error);
        throw new Error(`Failed to generate base problem: ${error.message}`);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 推理题 prompt
// ─────────────────────────────────────────────────────────────────────────────
export function buildReasoningPrompt(
    input: UserInput,
    constraints: TextbookConstraints,
    disciplineGuidance: string,
    reasoningType: ReasoningType,
    problemNumber: number,
    problemType: BiologyProblemType,
    allowedAngles: string[] = [],
    usedAngles: string[] = []
): string {
    const difficulty = (input as any).difficulty || 'intermediate';
    const difficultyGuide: Record<string, string> = {
        basic:       '≥3 个条件，推断路径 ≤3 步，结论直接可读',
        intermediate:'≥3 个条件，推断需 3-4 步，至少一步需要排除某种假设',
        advanced:    '≥4 个条件（含至少 1 个干扰项），推断需 ≥8 步',
        competition: '≥5 个条件（含多个干扰项），需构建完整逻辑模型',
    };

    return `
你是一位资深生物学教育专家。请生成一道高质量的生物学推理题（不是计算题，而是逻辑推断题）。

【重要】：这是一道"白板推理题"，必须：
1. 给出若干实验观察结果或逻辑条件（文字描述）
2. 所有条件充分且必要，有唯一正确推断结果
3. 不出现无关的噪音条件
4. 推断过程需要多步逻辑演绎

【题型角度规则（严格执行）】：
${allowedAngles.length > 0
    ? `合法考法范围：${allowedAngles.join('、')}\n已用角度：${usedAngles.length > 0 ? usedAngles.join('、') : '无'}\n请选择一个尚未使用的角度出题；若所有角度已用，允许复用但必须更换情境与条件。`
    : '请从该主题挖掘最深度且尽量多样化的考法角度，避免重复常见套路。'
}

【主题】：${input.topic}
【推理类型】：${problemType}
【难度】：${difficulty} — ${difficultyGuide[difficulty] ?? difficultyGuide.intermediate}

${getTextbookPromptConstraints(constraints)}

【学科难度框架】：
${disciplineGuidance}

${REASONING_CONSTRAINTS[reasoningType]}

【输出要求】：
请返回一个 JSON 对象，包含以下字段：
{
  "problemId": "base_${problemNumber}_${Date.now()}",
  "questionAngle": "本题核心考法关键词（2-5个字）",
  "topic": "${input.topic}",
  "problemType": "${problemType}",
  "scenario": "真实实验背景描述（1-2句话）",
  "questionBody": "完整题目描述（150-250字），包含实验过程与观察结果，最后以"请推断："结尾引出问题",
  "logicConditions": {
    "条件名称1": "文字描述",
    "条件名称2": "文字描述"
  },
  "givenData": {},
  "requiredAnswer": "需要推断的唯一目标",
  "solutionPath": ["步骤1：...", "步骤2：...", "步骤3：..."],
  "expectedDifficulty": ${getDifficultyScore(difficulty)}
}

【关键规则】：
- logicConditions 必须包含至少 3 个独立条件
- 条件之间不能相互矛盾
- 推断目标必须能从给出条件中唯一确定
- 题目难度与选定的 Level 严格匹配
- 单终点：最终只问一个推断结论
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 定量计算题 prompt
// ─────────────────────────────────────────────────────────────────────────────
export function buildCalculationPrompt(
    input: UserInput,
    constraints: TextbookConstraints,
    disciplineGuidance: string,
    reasoningType: ReasoningType,
    problemNumber: number,
    allowedAngles: string[] = [],
    usedAngles: string[] = []
): string {
    const difficulty = (input as any).difficulty || 'intermediate';
    const minReasoningSteps = { basic: 3, intermediate: 4, advanced: 5, competition: 6 };

    return `
你是一位资深生物学教育专家。请生成一道工业级、高质量的生物学定量计算题。

【重要】：这是一道"白板题"，必须：
1. 题目清晰明确，无陷阱
2. 所有条件充分且必要
3. 有唯一正确解
4. 体现真实实验/生命科学研究场景

【题型角度规则（严格执行）】：
${allowedAngles.length > 0
    ? `合法考法范围：${allowedAngles.join('、')}\n已用角度：${usedAngles.length > 0 ? usedAngles.join('、') : '无'}\n请选择一个尚未使用的角度出题；若所有角度已用，允许复用但必须更换情境与数值。`
    : '请从该主题挖掘最深度且尽量多样化的考法角度，避免重复常见套路。'
}

【主题】：${input.topic}
【难度】：${difficulty}
【是否允许查表】：${input.allowTableLookup ? '是' : '否'}

${getTextbookPromptConstraints(constraints)}

【学科难度框架】：
${disciplineGuidance}

${REASONING_CONSTRAINTS[reasoningType]}

【推理难度要求】：
推理路径须包含 ≥${minReasoningSteps[difficulty] || 4} 步，需识别限速步骤或关键假设

【输出要求】：
请返回一个 JSON 对象，包含以下字段：
{
  "problemId": "base_${problemNumber}_${Date.now()}",
  "questionAngle": "本题核心考法关键词（2-5个字）",
  "topic": "${input.topic}",
  "problemType": "calculation",
  "scenario": "真实场景描述（1-2句话）",
  "questionBody": "完整题目描述（200-300字，数据真实合理）",
  "givenData": {
    "参数名称1": {"value": 数值, "unit": "单位"},
    "参数名称2": {"value": 数值, "unit": "单位"}
  },
  "logicConditions": {},
  "requiredAnswer": "求解目标",
  "solutionPath": ["解题步骤1", "解题步骤2", "解题步骤3"],
  "expectedDifficulty": ${getDifficultyScore(difficulty)}
}

【关键规则】：
- 数据范围合理
- 难度与 Level 定义严格匹配
- 单终点约束：题干末尾只能有一个明确的求解目标
`;
}

function getDifficultyScore(difficulty: string): number {
    const scores: Record<string, number> = { basic: 3, intermediate: 5, advanced: 7, competition: 9 };
    return scores[difficulty] || 5;
}