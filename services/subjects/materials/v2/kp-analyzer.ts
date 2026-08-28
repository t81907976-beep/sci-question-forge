import { callLLMTracked } from "../costTracker";
import { getDisciplineGuidance, getPeakDifficulty } from "../disciplines";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { MaterialsQuestionType } from "../../../../types/multiNodeTypes";
import type { MaterialsDifficultyLevel } from "./difficulty";

/**
 * Materials V2 — A0 知识点分析器
 *
 * 将用户选择的材料学方向转化为 3-5 个具体考察维度，
 * 同时列出应避免的老套角度和难度定位。
 * 支持 calculation（计算题）、short-answer（简答题）、mixed（混合题）三种题型。
 * 支持 standard / hard / peak 三个难度档位——档位决定维度的深度要求。
 */

export interface MaterialsKPAnalysisResult {
    knowledgePoint: string;
    testDimensions: string[];
    coreConceptsToAvoid: string[];
    suggestedDifficulty: string;
    difficultyLevel: MaterialsDifficultyLevel;
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

/** 各档位的默认难度定位文本（LLM 未返回 suggestedDifficulty 时兜底） */
const DEFAULT_DIFFICULTY_TEXT: Record<MaterialsDifficultyLevel, string> = {
    standard: '研究生入学考试级别，需 4-6 步多步推理与公式推导',
    hard: '重点院校研究生复试/专业课压轴级别，需 6-8 步推导、跨概念耦合、含 2 个以上判断分叉点',
    peak: '科研级/博士资格考试级别，需 8 步以上推导链，涉及经典模型的适用边界与修正推广',
};

/**
 * A0 prompt 中注入的难度档位要求——约束"考察维度"本身的深度。
 * 顶级档会额外注入该知识点的 peak_difficulty 全文。
 */
function buildDifficultyDirective(difficultyLevel: MaterialsDifficultyLevel, peakDifficulty: string): string {
    if (difficultyLevel === 'peak') {
        return `【难度档位：顶级（科研级）⚠️ 本批次这道题必须达到该深度】
你列出的考察维度必须**直接对齐**以下"难度天花板"中描述的具体方向，不能停留在教材层面：

${peakDifficulty || '（该知识点未提供难度天花板描述，请自行按科研级深度设计）'}

维度设计硬性要求：
1. 每个维度必须涉及经典模型/公式的**适用边界或修正推广**（如 JMAK 非等温推广、Scheil 的 Brody-Flemings 修正、Scherrer 的 Williamson-Hall 修正、DFT 带隙低估需 HSE06）。
2. 必须要求跨越至少 2 个理论层次的交叉（如热力学判据 + 动力学速率、晶体学几何 + 弹性理论）。
3. 禁止任何可以在本科教材例题中找到原型的维度。`;
    }
    if (difficultyLevel === 'hard') {
        return `【难度档位：困难 ⚠️ 本批次这道题必须达到该深度】
维度设计硬性要求：
1. 每个维度必须**耦合至少 2 个子概念**（如相图杠杆定律 + 扩散动力学、位错理论 + 强化机制叠加、屈服准则 + 应力状态判断）。
2. 每个维度必须存在**判断分叉点**——考生需要先判断该用哪个模型/近似/边界条件，选错会得到不同结果。
3. 不能是单一公式一路代入就能解决的维度。
4. 可参考该知识点"难度天花板"描述中的部分方向，但不必达到最深层。`;
    }
    return `【难度档位：标准】
维度设计要求：
1. 每个维度需要 4-6 步相互依赖的推导/推理，不能是单步代入。
2. 聚焦该知识点内的核心公式与典型判据，属研究生入学考试难度。`;
}

function normalizeKPAnalysis(
    parsed: Partial<MaterialsKPAnalysisResult>,
    fallbackKP: string,
    questionType: MaterialsQuestionType = 'calculation',
    difficultyLevel: MaterialsDifficultyLevel = 'standard'
): MaterialsKPAnalysisResult {
    const isShortAnswer = questionType === 'short-answer';
    const isMixed = questionType === 'mixed';
    const result: MaterialsKPAnalysisResult = {
        knowledgePoint: String(parsed.knowledgePoint || fallbackKP),
        testDimensions: normalizeStringArray(parsed.testDimensions),
        coreConceptsToAvoid: normalizeStringArray(parsed.coreConceptsToAvoid),
        suggestedDifficulty: String(parsed.suggestedDifficulty || DEFAULT_DIFFICULTY_TEXT[difficultyLevel]),
        difficultyLevel,
    };
    if (result.testDimensions.length === 0) {
        result.testDimensions = isMixed ? fallbackMixedDimensions(fallbackKP) : isShortAnswer ? fallbackShortAnswerDimensions(fallbackKP) : fallbackDimensions(fallbackKP);
    }
    if (result.coreConceptsToAvoid.length === 0) {
        result.coreConceptsToAvoid = isShortAnswer
            ? ["纯定义复述", "简单列举无分析", "不涉及深层机理"]
            : isMixed
            ? ["各小问相互独立毫无关联", "计算小问与论述小问不在同一情境", "论述部分沦为纯定义复述"]
            : ["单步公式代入", "纯定义辨析", "照搬教材例题"];
    }
    // 困难/顶级档：额外把"教材原型"类角度加入必须避开列表
    if (difficultyLevel !== 'standard') {
        const extra = difficultyLevel === 'peak'
            ? ["教材典型例题的直接搬用", "单一公式一路代入无模型选择", "只考察标准边界条件下的经典解"]
            : ["单一知识点内的孤立公式应用", "无判断分叉的直线式求解"];
        for (const item of extra) {
            if (!result.coreConceptsToAvoid.includes(item)) result.coreConceptsToAvoid.push(item);
        }
    }
    return result;
}

function fallbackDimensions(kp: string): string[] {
    return [
        `${kp}的核心公式推导与多步计算`,
        `${kp}中参数变化对结果的定量影响分析`,
        `${kp}与实际工程工艺参数的耦合计算`,
    ];
}

function fallbackShortAnswerDimensions(kp: string): string[] {
    return [
        `${kp}的核心机理与物理本质解释`,
        `${kp}中不同模型/判据的适用条件对比`,
        `${kp}在工程选材/工艺设计中的决策依据`,
    ];
}

function fallbackMixedDimensions(kp: string): string[] {
    return [
        `${kp}的核心公式定量计算（数值小问）`,
        `${kp}计算结果背后的物理机理解释（论述小问）`,
        `${kp}参数变化对结果的影响及工程含义分析（论述小问）`,
    ];
}

export async function analyzeKnowledgePoint(
    knowledgePointName: string,
    problemIndex: number = 0,
    questionType: MaterialsQuestionType = 'calculation',
    difficultyLevel: MaterialsDifficultyLevel = 'standard'
): Promise<MaterialsKPAnalysisResult> {
    const disciplineGuidance = getDisciplineGuidance(knowledgePointName);
    const peakDifficulty = getPeakDifficulty(knowledgePointName);
    const difficultyDirective = buildDifficultyDirective(difficultyLevel, peakDifficulty);

    const isShortAnswer = questionType === 'short-answer';
    const isMixed = questionType === 'mixed';

    const mixedPrompt = `你是材料科学与工程领域的资深命题专家。请为以下知识点做 A0 分析规划（混合题型：一道题含 2-4 个小问，同时包含计算小问与论述小问）。

【知识点】：${knowledgePointName}

【学科特征参考】：
${disciplineGuidance}

${difficultyDirective}

【任务】：
请围绕该知识点，列出适合出 **混合题（计算+论述小问）** 的考察维度。混合题要求：
- 同一情境（同一体系/合金/工艺）下,先定量计算,再基于计算结果或前提做机理/工程含义论述
- 计算小问和论述小问之间必须有推理链接,不能各自为政
- 论述小问考察对计算结果的物理理解或对参数变化的机理解释

要求：
1. 给出 3-5 个具体考察维度,每个维度用一句话说明该混合题的情境与考察焦点(如"由 Fick 第二定律计算渗碳深度,再论述实际工艺中扩散系数偏离理论值的原因")。维度之间不能有大面积重叠。
2. 列出 2-3 个必须避开的低质量角度（如各小问相互独立、计算小问与论述小问不在同一情境、论述部分沦为纯定义复述）。
3. 给出难度定位:说明该知识点下混合题的难度平衡点(计算与论述占比、易错点、需要的知识关联度)。

输出严格 JSON，不含 markdown：
{
  "knowledgePoint": "${knowledgePointName}",
  "testDimensions": ["维度1：具体描述", "维度2：具体描述"],
  "coreConceptsToAvoid": ["避开项1", "避开项2"],
  "suggestedDifficulty": "难度定位描述"
}`;

    const prompt = isMixed
        ? mixedPrompt
        : isShortAnswer
        ? `你是材料科学与工程领域的资深命题专家。请为以下知识点做 A0 分析规划（简答题/论述题方向）。

【知识点】：${knowledgePointName}

【学科特征参考】：
${disciplineGuidance}

${difficultyDirective}

【任务】：
请围绕该知识点，列出适合出 **简答题/论述题** 的考察维度。每个维度必须具体到可以出一道有深度的论述题的程度。

要求：
1. 给出 3-5 个具体考察维度，每个维度用一句话说明需要论述什么（如"解释Kirkendall效应的物理本质及其对互扩散系数测量的影响"、"对比Tresca与von Mises屈服准则在复杂应力状态下的适用性及工程选择依据"）。维度之间不能有大面积重叠。
2. 列出 2-3 个必须避开的低质量角度（如纯定义复述、简单列举无分析、不涉及深层机理）。
3. 给出难度定位：说明该知识点下论述题的核心考察深度、需要的知识关联度。

输出严格 JSON，不含 markdown：
{
  "knowledgePoint": "${knowledgePointName}",
  "testDimensions": ["维度1：具体描述", "维度2：具体描述"],
  "coreConceptsToAvoid": ["避开项1", "避开项2"],
  "suggestedDifficulty": "难度定位描述"
}`
        : `你是材料科学与工程领域的资深命题专家。请为以下知识点做 A0 分析规划。

【知识点】：${knowledgePointName}

【学科特征参考】：
${disciplineGuidance}

${difficultyDirective}

【任务】：
请围绕该知识点，列出适合出 **计算题** 的考察维度。每个维度必须具体到可以出一道完整计算题的程度。

要求：
1. 给出 3-5 个具体考察维度，每个维度用一句话说明需要计算什么（如"利用 Fick 第二定律求给定时间后的碳浓度分布"）。维度之间不能有大面积重叠。
2. 列出 2-3 个必须避开的老套/低防御角度（如纯定义辨析、单步代入公式、直接查表）。
3. 给出难度定位：说明该知识点下出题的核心判断分叉点、易错点、需要的前置知识跨度。

输出严格 JSON，不含 markdown：
{
  "knowledgePoint": "${knowledgePointName}",
  "testDimensions": ["维度1：具体描述", "维度2：具体描述"],
  "coreConceptsToAvoid": ["避开项1", "避开项2"],
  "suggestedDifficulty": "难度定位描述"
}`;

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'default',
            temperature: 0.6,
            responseFormat: 'json',
            systemPrompt: '你是材料科学命题规划专家，只输出严格 JSON。',
        }, problemIndex, 'a0_kp_analysis')).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return normalizeKPAnalysis({}, knowledgePointName, questionType, difficultyLevel);
        }
        return normalizeKPAnalysis(cleanAndParseJSON(jsonMatch[0]) as Partial<MaterialsKPAnalysisResult>, knowledgePointName, questionType, difficultyLevel);
    } catch (error) {
        console.error("Materials V2 A0 Error:", error);
        return normalizeKPAnalysis({}, knowledgePointName, questionType, difficultyLevel);
    }
}
