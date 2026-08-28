import { callLLMTracked } from "../costTracker";
import { getDisciplineGuidance, getMatchedDisciplineForbiddenErrors, getPeakDifficulty } from "../disciplines";
import { getMaterialsTextbookConstraints, getMaterialsTextbookPromptConstraints } from "../rag";
import { cleanAndParseJSON, validateAndFixProblemJSON } from "../../../utils/jsonCleaner";
import type { UserInput, MaterialsQuestionType } from "../../../../types/multiNodeTypes";
import type { MaterialsKPAnalysisResult } from "./kp-analyzer";
import type { MaterialsDifficultyLevel } from "./difficulty";

/**
 * Materials V2 — A1 出题 + 答案生成器
 *
 * 支持两种题型：
 *  - calculation（计算题）：生成题干 + 数值参考答案 + 6 步以上推导（原有路径）
 *  - short-answer（简答题）：生成题干 + 论述型参考答案 + 4-8 条要点数组
 */

export interface MaterialsV2QuestionDraft {
    problemId: string;
    knowledgePoint: string;
    chosenDimension: string;
    questionType: MaterialsQuestionType;
    difficultyLevel: MaterialsDifficultyLevel;
    questionText: string;
    coreData: Record<string, { value: number | string; unit: string }>;
    requiredAnswer: string;
    referenceAnswer: string;
    referenceSteps: string[];
    referencePoints: string[];  // 简答题专用：核心要点数组（计算题为空）
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

/**
 * 知识点名 → 简短别名，用于构造可读题目ID。
 * 例：'金属材料-相变与热处理' → '相变热处理'
 * 规则：取 '-' 后的部分，再去掉连接词与括号内容，超长则截断。
 */
function abbreviateKnowledgePoint(kp: string): string {
    const tail = kp.includes('-') ? kp.split('-').slice(1).join('') : kp;
    const cleaned = tail
        .replace(/[（(][^）)]*[）)]/g, '')   // 去括号注释，如 "(Fick定律)"
        .replace(/[与和及、\s]/g, '')        // 去连接词与空白
        .trim();
    const base = cleaned || kp.replace(/[-\s]/g, '');
    return base.length > 8 ? base.slice(0, 8) : base;
}

const QUESTION_TYPE_ID_TAG: Record<MaterialsQuestionType, string> = {
    calculation: '计算',
    'short-answer': '论述',
    mixed: '混合',
};

/**
 * 生成可读题目ID：mat_{知识点缩写}_{题型}_{MMDD}_{序号}
 * 例：mat_相变热处理_计算_0806_001
 */
export function buildMaterialsProblemId(kp: string, questionType: MaterialsQuestionType, problemIndex: number): string {
    const now = new Date();
    const mmdd = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const seq = String(problemIndex + 1).padStart(3, '0');
    return `mat_${abbreviateKnowledgePoint(kp)}_${QUESTION_TYPE_ID_TAG[questionType]}_${mmdd}_${seq}`;
}

function normalizeDraft(
    parsed: Partial<MaterialsV2QuestionDraft>,
    kp: string,
    dimension: string,
    questionType: MaterialsQuestionType,
    problemIndex: number,
    difficultyLevel: MaterialsDifficultyLevel
): MaterialsV2QuestionDraft {
    const draft: MaterialsV2QuestionDraft = {
        // ID 由本地统一生成，不采纳 LLM 返回值（避免格式漂移与重复）
        problemId: buildMaterialsProblemId(kp, questionType, problemIndex),
        knowledgePoint: String(parsed.knowledgePoint || kp),
        chosenDimension: String(parsed.chosenDimension || dimension),
        questionType,
        difficultyLevel,
        questionText: String(parsed.questionText || ""),
        coreData: (parsed.coreData && typeof parsed.coreData === "object") ? parsed.coreData : {},
        requiredAnswer: String(parsed.requiredAnswer || ""),
        referenceAnswer: String(parsed.referenceAnswer || ""),
        referenceSteps: normalizeStringArray(parsed.referenceSteps),
        referencePoints: normalizeStringArray(parsed.referencePoints),
    };
    // 计算题：若 referenceSteps 不足，从 referenceAnswer 按行拆
    if (questionType === 'calculation' && draft.referenceSteps.length < 3 && draft.referenceAnswer) {
        const lines = draft.referenceAnswer.split('\n').filter(l => l.trim().length > 0);
        if (lines.length >= 3) {
            draft.referenceSteps = lines.slice(0, 8);
        }
    }
    // 简答题：若 referencePoints 不足，从 referenceAnswer 按行拆
    if (questionType === 'short-answer' && draft.referencePoints.length < 3 && draft.referenceAnswer) {
        const lines = draft.referenceAnswer.split('\n').filter(l => l.trim().length > 10);
        if (lines.length >= 3) {
            draft.referencePoints = lines.slice(0, 8);
        }
    }
    // 混合题：两类都需要，缺失的一方从 referenceAnswer 兜底拆分
    if (questionType === 'mixed' && draft.referenceAnswer) {
        const lines = draft.referenceAnswer.split('\n').filter(l => l.trim().length > 5);
        if (draft.referenceSteps.length < 2 && lines.length >= 2) {
            draft.referenceSteps = lines.slice(0, 8);
        }
        if (draft.referencePoints.length < 2 && lines.length >= 2) {
            draft.referencePoints = lines.filter(l => l.trim().length > 10).slice(0, 8);
        }
    }
    return draft;
}

/** 材料学事实纪律硬约束（V2 版，与 V1 generator 保持一致的物理常数/结构对应） */
const MATERIALS_FACT_DISCIPLINE = `【事实纪律（强制执行）】：
1. 绝对禁止篡改基础物理常数：
   - 阿伏伽德罗常数: N_A = 6.02214076×10²³ mol⁻¹
   - 气体常数: R = 8.314 J/(mol·K)
   - 玻尔兹曼常数: k_B = 1.380649×10⁻²³ J/K
   - 元素摩尔质量误差范围: ±0.01 g/mol

2. 晶体结构与金属/材料必须严格对应：
   - FCC（面心立方）: Cu, Al, Ni, γ-Fe, Ag, Au, Pb
   - BCC（体心立方）: α-Fe, W, Cr, Mo, V, Nb
   - HCP（密排六方）: Mg, α-Ti, Zn, Cd, Zr, Be
   - 金刚石结构: Si, Ge, 金刚石
   - NaCl 岩盐型: MgO, NiO, CaO
   - 萤石型: CaF₂, ZrO₂(立方)

3. 相变温度与力学参数必须严格自洽：
   - Fe-C 相图: A1=727°C (共析), 共晶点 1148°C/4.3%C
   - 纯 Fe 同素异构转变: α→γ 912°C, γ→δ 1394°C, 熔点 1538°C
   - 杨氏模量典型值: E_steel≈200 GPa, E_Al≈70 GPa, E_Cu≈110 GPa, E_Ti≈110 GPa
   - 高分子玻璃化转变温度: Tg(PS)≈100°C, Tg(PMMA)≈105°C, Tg(PVC)≈80°C, Tg(PC)≈150°C
   - ⚠️ **核心禁止**: 恒温相变过程不能同时声称"绝热"

4. 加工工艺参数必须符合材料实验数据（淬火温度必须高于 A3 或 A_cm，回火温度必须低于 A1，热加工温度必须低于熔点）

5. 强化机制、扩散、位错行为必须材料学上可行`;

/**
 * 生成 A1 出题 prompt 中的"难度档位指令"段落。
 *
 * - standard：维持原有约束（≥4-6 步、多步推理），只在措辞上明确标为标准档
 * - hard：强制跨概念耦合 + ≥2 判断分叉点 + 隐含陷阱
 * - peak：直接对齐 disciplines.ts 的 peak_difficulty 全文，要求非标准边界/模型修正
 *
 * 计算/简答/混合三种题型共用此段（各自的其他约束由各 buildXxxPrompt 保留）。
 */
function buildDifficultyDirective(difficultyLevel: MaterialsDifficultyLevel, peakDifficulty: string, questionType: MaterialsQuestionType): string {
    const stepUnit = questionType === 'short-answer' ? '论述层次' : '推导步骤';
    const stepUnitAlt = questionType === 'short-answer' ? '论述深度' : '推导链条';

    if (difficultyLevel === 'peak') {
        return `【难度档位：顶级 ⚠️ 科研级，必须满足以下全部条件】
1. ${stepUnit}数 ≥ 8，涉及非标准边界条件或多个模型的交叉使用；${stepUnitAlt}必须包含经典公式适用边界的判断。
2. **必须直接对齐**该知识点的顶级难度天花板方向：
${peakDifficulty || '（该知识点未提供顶级难度描述，请自行按科研级深度设计）'}
3. 要求考生识别何时经典公式不再适用，需要修正/推广（如 JMAK 非等温推广、Scheil 有限扩散修正 Brody-Flemings、Scherrer 用 Williamson-Hall 分离尺寸与应变、DFT 带隙低估需 HSE06/GW 修正、经典形核理论需考虑非均匀形核势垒修正）。
4. 题目本身达到顶刊论文/博士资格考试/教授级出题水平，绝不能是教材例题的直接改数字。
5. 参考答案必须包含该修正/推广的完整推导过程，说明为什么标准公式失效以及如何得到修正结果。
6. 严格禁止：任何一步可以在本科教材中原封不动找到解法的题目。`;
    }
    if (difficultyLevel === 'hard') {
        return `【难度档位：困难 ⚠️ 必须满足以下全部条件】
1. ${stepUnit}数 6-8 步，且步骤之间**至少有 2 个判断分叉点**（如需要选用哪个模型/近似/边界条件/公式版本）。
2. 必须耦合至少 2 个子概念（如：相图杠杆定律 + 扩散动力学，或位错理论 + 强化机制叠加，或屈服准则 + 应力状态判断，或热力学判据 + 动力学速率）。
3. 条件设置必须有至少 1 个**隐含陷阱**——表面上像 A 模型但实际应该用 B；或数据自洽但单位/基准/坐标系不同；或某个中间量默认取平衡值但题目情境是非平衡。
4. 严禁作为教材典型例题的直接改数字。
5. 参考答案必须在关键分叉处**显式说明**："如果错选 X（常见错误）则会得到错误结果 Y；正确应选 Z 因为…"。`;
    }
    return `【难度档位：标准】
1. 需要 4-6 步相互依赖的${stepUnit}，不能是单步公式代入。
2. 属研究生入学考试难度，聚焦该知识点内的核心公式与典型判据。
3. 参考答案完整给出公式、代入、单位换算、最终答案。`;
}

export async function generateQuestionWithAnswer(
    kpAnalysis: MaterialsKPAnalysisResult,
    dimensionIndex: number,
    language: string = 'zh-CN',
    singleQuestion: boolean = false,
    problemIndex: number = 0,
    questionType: MaterialsQuestionType = 'calculation',
    difficultyLevel: MaterialsDifficultyLevel = 'standard'
): Promise<MaterialsV2QuestionDraft> {
    const dimensions = kpAnalysis.testDimensions;
    const chosenDimension = dimensions[dimensionIndex % dimensions.length];
    const kp = kpAnalysis.knowledgePoint;

    const disciplineGuidance = getDisciplineGuidance(kp);
    const forbiddenErrors = getMatchedDisciplineForbiddenErrors(kp);
    const constraints = getMaterialsTextbookConstraints({ topic: kp } as UserInput);
    const textbookConstraints = getMaterialsTextbookPromptConstraints(constraints);
    const peakDifficulty = getPeakDifficulty(kp);
    const difficultyDirective = buildDifficultyDirective(difficultyLevel, peakDifficulty, questionType);

    const isShortAnswer = questionType === 'short-answer';
    const isMixed = questionType === 'mixed';

    const prompt = isMixed
        ? buildMixedPrompt(kp, chosenDimension, kpAnalysis, disciplineGuidance, textbookConstraints, forbiddenErrors, singleQuestion, problemIndex, difficultyDirective)
        : isShortAnswer
        ? buildShortAnswerPrompt(kp, chosenDimension, kpAnalysis, disciplineGuidance, textbookConstraints, forbiddenErrors, singleQuestion, problemIndex, difficultyDirective)
        : buildCalculationPrompt(kp, chosenDimension, kpAnalysis, disciplineGuidance, textbookConstraints, forbiddenErrors, singleQuestion, problemIndex, difficultyDirective);

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'reasoning',
            temperature: 0.4,
            responseFormat: 'json',
            systemPrompt: `你是材料科学命题专家，用${language === 'zh-CN' ? '中文' : language}出${isMixed ? '混合题（含计算+论述小问）' : isShortAnswer ? '简答题（论述题）' : '计算题'}，只输出严格 JSON。`,
        }, problemIndex, 'a1_generate'))
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse generator response as JSON');
        }

        const parsed = cleanAndParseJSON(jsonMatch[0]);
        // 计算题走原有 fix 逻辑；简答题/混合题跳过（validateAndFixProblemJSON 假设有 coreData）
        const rawParsed = (isShortAnswer || isMixed) ? parsed : validateAndFixProblemJSON(parsed);
        const draft = normalizeDraft(rawParsed as Partial<MaterialsV2QuestionDraft>, kp, chosenDimension, questionType, problemIndex, difficultyLevel);

        if (!draft.questionText) {
            throw new Error('Generated question text is empty');
        }
        if (!draft.referenceAnswer) {
            throw new Error('Generated reference answer is empty');
        }
        if (isShortAnswer) {
            if (draft.referencePoints.length < 3) {
                throw new Error('Reference points too short (minimum 3 required for short-answer)');
            }
        } else if (isMixed) {
            // mixed 题型同时需要 referenceSteps（计算部分）和 referencePoints（论述部分）
            // 任一方不足即视为结构不合规（此处必须是 OR，用 AND 会让"只有计算、论述空缺"的题误判合格）
            if (draft.referenceSteps.length < 2 || draft.referencePoints.length < 2) {
                throw new Error(`Mixed question must have both referenceSteps (≥2, got ${draft.referenceSteps.length}) and referencePoints (≥2, got ${draft.referencePoints.length})`);
            }
        } else {
            if (draft.referenceSteps.length < 3) {
                throw new Error('Reference steps too short (minimum 3 required)');
            }
        }

        return draft;
    } catch (error) {
        console.error("Materials V2 A1 Error:", error);
        throw new Error(`Materials V2 generation failed: ${(error as Error).message}`);
    }
}

function buildCalculationPrompt(
    kp: string,
    chosenDimension: string,
    kpAnalysis: MaterialsKPAnalysisResult,
    disciplineGuidance: string,
    textbookConstraints: string,
    forbiddenErrors: string[],
    singleQuestion: boolean,
    problemIndex: number,
    difficultyDirective: string
): string {
    return `你是材料科学与工程领域的资深教授和命题专家。请生成一道高质量材料科学计算题，**同时给出完整的标准解答**。

【知识点】：${kp}
【本题考察维度】：${chosenDimension}
【必须避开的老套角度】：${kpAnalysis.coreConceptsToAvoid.join('、') || '无'}
【难度定位】：${kpAnalysis.suggestedDifficulty}

${difficultyDirective}

${disciplineGuidance}

${textbookConstraints}

${MATERIALS_FACT_DISCIPLINE}

${forbiddenErrors.length > 0 ? `【本方向禁止出现的错误】：\n${forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}
【题目质量要求】：
1. 题干自足：所有求解必需的数据都必须出现在题面文字中，不依赖外部查表。
2. 条件充分且必要：不能缺条件，也不能给无用冗余数据。
3. 唯一确定解：必须有唯一正确的数值答案（含单位）。
4. 多步推理：至少需要 4-6 个相互依赖的推导步骤，不能是单步套公式。
5. 真实工程/科研场景：题目要有可信的材料学背景情境。
6. ${singleQuestion ? '⚠️【强制单问】题目只能有一个问题、一个求解目标，禁止拆成 (1)(2)。' : '最多 2 问，且第 1 问必须是第 2 问的必要前提。'}
7. 题面纯净：不要在题干中写"本题考察…"、"注意陷阱…"这类元信息。

【标准解答要求】：
1. 完整写出所用公式及其适用条件。
2. 逐步代入数值，显示中间结果。
3. 明确单位换算过程，最终答案必须带单位。
4. 说明关键判断点（如选用哪个模型、哪个近似成立）。

⚠️ **铁律**：当难度要求与物理自洽性冲突时，必须优先保证物理自洽性。

输出严格 JSON，不含 markdown：
{
  "problemId": "（系统自动生成，无需填写）",
  "knowledgePoint": "${kp}",
  "chosenDimension": "${chosenDimension}",
  "questionText": "完整题干（200-300字，包含全部已知数据）",
  "coreData": {
    "物理量名称": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "求解目标描述",
  "referenceAnswer": "完整标准解答（含公式、代入、单位换算、最终答案）",
  "referenceSteps": ["步骤1", "步骤2", "...（至少6步）"]
}`;
}

function buildShortAnswerPrompt(
    kp: string,
    chosenDimension: string,
    kpAnalysis: MaterialsKPAnalysisResult,
    disciplineGuidance: string,
    textbookConstraints: string,
    forbiddenErrors: string[],
    singleQuestion: boolean,
    problemIndex: number,
    difficultyDirective: string
): string {
    return `你是材料科学与工程领域的资深教授和命题专家。请生成一道高质量材料科学**简答题/论述题**，同时给出完整的参考答案和要点。

【知识点】：${kp}
【本题论述维度】：${chosenDimension}
【必须避开的低质量角度】：${kpAnalysis.coreConceptsToAvoid.join('、') || '无'}
【难度定位】：${kpAnalysis.suggestedDifficulty}

${difficultyDirective}

${disciplineGuidance}

${textbookConstraints}

${MATERIALS_FACT_DISCIPLINE}

${forbiddenErrors.length > 0 ? `【本方向需覆盖或警惕的知识点】：\n${forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}
【题目质量要求】：
1. 题干必须提出一个明确的论述性问题（"解释…的物理本质"/"对比…与…的差异及工程选择依据"/"分析…现象产生的机理并说明…"）。
2. 至少覆盖 3 个学科核心概念的推理链，考察机理理解、判据选择、工程含义等深层次内容。
3. 不要求数值计算；如需定量说明，可用半定量表述（数量级、单调性、关键判据）。
4. 允许在题干中给出必要的背景信息（合金牌号、工艺条件、实验现象、组织特征等）。
5. ${singleQuestion ? '⚠️【强制单问】题目只能有一个论述问题，禁止拆成 (1)(2) 多问。' : '最多 2 问，且第 1 问必须是第 2 问的必要前提。'}
6. 题面纯净：不要在题干中写"本题考察…"、"简答…"这类元信息。

【参考答案要求】：
1. referenceAnswer：完整论述文本（400-700 字），包含：
   - 涉及的核心机理与物理本质
   - 引用的学科定律/判据/理论名称（如 Hall-Petch、Schmid 因子、Pilling-Bedworth 比、Wagner 理论）
   - 关键推理链条（从现象到本质到工程含义）
   - 必要时的对比分析和分类讨论
2. referencePoints：4-8 条核心要点（每条 15-40 字），覆盖：
   - 至少 1 条核心机理/原理断言
   - 至少 1 条判据/公式/定律的引用
   - 至少 1 条工程含义或实际应用要点
   - 若涉及对比，需明确分类和分界条件
3. 论述必须材料学上正确，禁止捏造理论、误引定律、混淆概念。

⚠️ **铁律**：论述必须材料学正确；宁可简短也不能出现事实错误。

输出严格 JSON，不含 markdown：
{
  "problemId": "（系统自动生成，无需填写）",
  "knowledgePoint": "${kp}",
  "chosenDimension": "${chosenDimension}",
  "questionText": "完整简答题题干（150-250字）",
  "coreData": {},
  "requiredAnswer": "论述问题的简明描述（如\"解释…的物理本质\"）",
  "referenceAnswer": "完整论述参考答案（400-700字）",
  "referencePoints": ["要点1（15-40字）", "要点2", "...（至少4条）"]
}`;
}

function buildMixedPrompt(
    kp: string,
    chosenDimension: string,
    kpAnalysis: MaterialsKPAnalysisResult,
    disciplineGuidance: string,
    textbookConstraints: string,
    forbiddenErrors: string[],
    singleQuestion: boolean,
    problemIndex: number,
    difficultyDirective: string
): string {
    return `你是材料科学与工程领域的资深教授和命题专家。请生成一道高质量材料科学**混合题**：一道题包含 2-4 个小问，其中至少 1 个是**计算小问**（求数值答案），至少 1 个是**论述小问**（考察机理/判据/工程含义）。**同时给出完整的参考答案**。

【知识点】：${kp}
【本题考察维度】：${chosenDimension}
【必须避开的低质量角度】：${kpAnalysis.coreConceptsToAvoid.join('、') || '无'}
【难度定位】：${kpAnalysis.suggestedDifficulty}

${difficultyDirective}

${disciplineGuidance}

${textbookConstraints}

${MATERIALS_FACT_DISCIPLINE}

${forbiddenErrors.length > 0 ? `【本方向禁止出现的错误】：\n${forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}
【题目质量要求】：
1. 题干必须是**同一个情境**（同一体系/合金/工艺/材料），先描述背景与已知条件，再依次列出小问 (1)(2)(3)…
2. **小问结构规则**：
   - 至少 1 个计算小问，需要用公式定量计算，答案是带单位的数值
   - 至少 1 个论述小问，考察机理、判据、对比分析或工程含义
   - 论述小问必须**基于**前面的计算结果或已知条件展开（如"结合 (1) 的计算结果，解释…"），不能与计算小问相互独立
3. 题干自足：所有求解必需的数据都出现在题面文字中，不依赖外部查表。
4. ${singleQuestion ? '⚠️【强制】小问总数控制在 2 个：1 个计算 + 1 个论述。' : '小问总数 2-4 个，形成递进推理链。'}
5. 题面纯净：不写"本题考察…"、"注意…"这类元信息。

【参考答案要求】：
1. referenceAnswer：完整的分小问参考答案，明确标注小问编号，含：
   - 计算小问：公式、代入、单位换算、最终数值答案
   - 论述小问：机理阐述、定律引用、推理链条、工程含义
2. referenceSteps：**计算小问**的推导步骤数组（≥3 步，含公式、代入、结果）
3. referencePoints：**论述小问**的核心要点数组（≥3 条，每条 15-40 字，覆盖机理/判据/工程含义）
4. coreData：题干中出现的所有已知数据（供计算使用）
5. requiredAnswer：所有小问求解目标的合并简述（如"(1) 求 ...；(2) 论述 ...的机理"）

⚠️ **铁律**：
- 计算部分必须唯一确定解；论述部分必须材料学正确。
- 计算与论述必须共享同一情境，论述必须与计算结果或题设条件有逻辑绑定。

输出严格 JSON，不含 markdown：
{
  "problemId": "（系统自动生成，无需填写）",
  "knowledgePoint": "${kp}",
  "chosenDimension": "${chosenDimension}",
  "questionText": "完整题干含情境+已知+多小问 (1)(2)(3)（250-400字）",
  "coreData": {
    "物理量名称": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "所有小问的合并简述",
  "referenceAnswer": "完整分小问参考答案",
  "referenceSteps": ["计算步骤1", "计算步骤2", "...（至少3步）"],
  "referencePoints": ["论述要点1（15-40字）", "论述要点2", "...（至少3条）"]
}`;
}
