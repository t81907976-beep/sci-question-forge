import type { BaseProblem, UserInput, TextbookConstraints } from "../../types/multiNodeTypes";
import type { RetryContext } from "../../types/multiNodeTypes";
import { getTextbookPromptConstraints } from "./node1-rag";
import { getDisciplineGuidance, getDisciplineGuidanceByKey, getKnowledgePointAliases, identifyDiscipline } from "../subjects/math/disciplines";
import type { NormalizeResult } from "../subjects/math/normalizer";
import { getModelInfo } from "../llmClient";
import { callMathLLM } from "../subjects/math/mathLlmTracker";
import type { MathTokenTrackerId } from "../subjects/math/tokenTracker";
import { cleanAndParseJSON } from "../utils/jsonCleaner";
import { getMathPerturbationRuleByType } from "../subjects/math/perturbation-rules";
import { buildMathDisciplineContext } from "../subjects/math/discipline-context";
import {
    getMathDifficultyLevel,
    getMathMinimumReasoningSteps
} from "../subjects/math/difficulty";

/**
 * Node 2: Base Problem Generator
 *
 * Generates clean, solvable "whiteboard" problems WITHOUT any traps.
 * This is the foundation that trap agents will modify.
 */

export async function generateBaseProblem(
    input: UserInput,
    constraints: TextbookConstraints,
    normalizeResult: NormalizeResult,
    problemNumber: number,
    problemIndex: number,
    tokenTrackerId: MathTokenTrackerId,
    retryContext?: RetryContext | null
): Promise<BaseProblem> {
    // 使用用户原始输入作为主题（而不是归一化后的知识点库名称）
    // 这样用户输入"中值定理"就会生成中值定理相关的题目，而不是"导数与微分"大类
    const effectiveTopic = input.topic;

    // 获取别名列表（用于提示 LLM 相关概念）
    const aliases = normalizeResult.success && normalizeResult.matchedKey
        ? getKnowledgePointAliases(normalizeResult.matchedKey)
        : [];

    const aliasText = aliases.length > 0
        ? `（相关概念：${aliases.join('、')}）`
        : '';

    // 获取难度指导时使用归一化后的 key（用于确定学科框架），但题目主题仍用用户输入
    const disciplineKey = normalizeResult.success && normalizeResult.matchedKey
        ? normalizeResult.matchedKey
        : identifyDiscipline(effectiveTopic);
    const difficultyStr = getMathDifficultyLevel(input.trapCount);
    const minReasoningSteps = getMathMinimumReasoningSteps(input.trapCount);
    const disciplineContext = buildMathDisciplineContext(disciplineKey, difficultyStr);
    const topicDisciplineGuidance = getDisciplineGuidanceByKey(disciplineKey, difficultyStr);

    // 获取该方向的具体指导内容（避免将整个 MATH_DISCIPLINES 读入 prompt）
    const forbiddenQuestionTypes = disciplineContext.validationRules.forbiddenQuestionTypes;
    const forbiddenErrors = disciplineContext.validationRules.forbiddenErrors;
    const parameterConstraints = disciplineContext.validationRules.parameterConstraints;
    const antiPatterns = disciplineContext.generationGuidance.antiPatternStrategies;
    if (!input.perturbationType) {
        throw new Error('Math perturbationType is required');
    }
    const selectedPerturbationRule = getMathPerturbationRuleByType(input.perturbationType);
    const perturbationRulesText = `1. ${selectedPerturbationRule.id}
   扰动类型：${selectedPerturbationRule.perturbationType}
   目标弱点：${selectedPerturbationRule.targetWeakness}
   失效熟路：${selectedPerturbationRule.invalidatedStandardMethod}
   预期错误路径：${selectedPerturbationRule.expectedWrongPath}
   人工验证提示：${selectedPerturbationRule.manualValidationHints.join("；")}`;

    // 构建 discipline-specific 指导部分
    const disciplineSpecificPart = (() => {
        if (antiPatterns.length === 0) {
            return ''; // 如果该方向没有详细内容，返回空
        }

        let result = '【该方向生成指导】（根据用户输入方向自动提取，仅包含当前方向内容）：\n';

        if (antiPatterns.length > 0) {
            result += '\n【高防御题型设计策略——至少执行其中1条以增加题目区分度】：\n';
            result += antiPatterns.map((s, i) => `${i + 1}. ${s}`).join('\n');
            result += '\n';
        }

        return result + '\n';
    })();

    const node2RetryGuidance = retryContext ? `
【重试指导 — 上次生成失败，本次必须从题目结构层面重新设计】

上次失败类别：${retryContext.failureCategory}
上次失败原因：${retryContext.failureReason}
上次题目前150字：${retryContext.previousQuestionHead || '无'}

${retryContext.retryHint?.promptPatch ? `审查器给出的结构修改建议：${retryContext.retryHint.promptPatch}` : ''}
${retryContext.retryHint?.avoidPattern ? `必须避免的旧模式：${retryContext.retryHint.avoidPattern}` : ''}

本次重试硬性要求：
- 不得复用上次的题型骨架、参数结构或解题路线。
- 如果上次问题是难度不足，必须提高核心数学结构复杂度，而不是增加题面长度。
- 如果上次问题是条件矛盾、无解或答案不唯一，必须重新设计条件并自查唯一性。
- 如果上次问题是主题偏离，必须让题目核心对象直接属于用户主题。
- 仍然必须是单一求解题，最终答案必须是闭式形式。
` : '';

    const prompt = `
你是一位资深数学教育专家。请生成一道高质量的数学题目。

${node2RetryGuidance}

【跨学科渗透禁止】（必须严格遵守，否则题目无效）：
- 绝对禁止使用其他学科的专业术语和概念，包括但不限于：
  * 化学术语：平衡常数、活化能、摩尔、化学键、分子轨道、电离能、亲电性、亲核性、氧化还原、化学平衡、反应速率、催化作用、反应热、熵变、自由能、同位素、化学计量、电极电势、缓冲溶液、溶度积、离子积、电离常数、水解常数、分解反应、化合反应、置换反应
  * 物理术语：量子力学、相对论、杨-米尔斯理论、洛伦兹变换、普朗克常数、玻尔兹曼分布、费米子、玻色子、相变、熵、焓、热力学定律、电磁场、引力场、标准模型、粒子物理、量子电动力学、量子色动力学
  * 生物学术语：基因突变、蛋白质折叠、神经网络（生物）、细胞分裂、酶催化、DNA复制、转录、翻译、代谢途径、生态系统、种群遗传学、进化论、分子生物学、生物化学
  * 计算机科学术语（非数学）：算法复杂度、机器学习、深度学习、神经网络（AI）、池化、梯度下降、反向传播、Transformer、GPT、大语言模型
- 题目场景必须是纯数学场景，不能包装成化学实验、物理实验、生物实验等应用场景
- 如果需要使用"浓度"、"速率"、"温度"、"压力"等可跨学科概念，必须明确说明这是数学建模中的抽象变量，且用数学符号表示，不能使用化学/物理的专业表述

【硬性要求】（必须严格遵守，否则题目无效）：
1. **题目必须有唯一、明确、可验证的答案**
2. **题面不得依赖未声明的分支选择、归一化条件、路径选择或默认约定**
3. **难度应来自数学结构本身，而不是题面噪声**
4. **题目应至少需要两种不同工具的组合才能完成**
5. **不得出现"看似高级但对解答无贡献"的背景信息**
6. **题目核心必须与用户输入的主题${effectiveTopic}相关**
7. **题目条件必须自洽（没有互相矛盾的条件，如同时包含"k=1"与"结果用k表示"）**
8. **题目表达必须严谨（没有语言上的歧义）**
9. **题目条件必须符合客观事实（与已知数学结论一致，且涉及的常数的值与真实值一致）**
10. **题目数值必须在合理范围内（如几何题中边长为正、概率在[0,1]之间）**
11. **题目必须不包含任何未说明的隐含假设（如未明确定义的变量或未说明是连续可微的函数）**
12. **题目必须是求解题（求值、求表达式），不能是证明题（如求证某个结论）或选择题（如单选题、多选题）**

【关键：答案必须是闭式形式】（这是最重要的要求）：
- 最终答案必须是以下形式之一：
  - 具体数值（如 3.14159, 2√2, e²）
  - 闭式表达式（如 $u(x,t) = e^{-kt}\sin x$, $f(x) = x^2 + 2x + 1$）
  - 带有通项的级数（如 $\sum_{n=1}^{\infty} \frac{\sin(nx)}{n^2}$，必须给出通项公式）
  - 定积分表达式（如 $\int_0^1 x^2 dx = \frac{1}{3}$）
  - 明确的函数展开（如泰勒展开前N项+通项公式）
- 禁止出现以下形式：
  - 仅给出级数形式但无闭式结果（如 "解为 $u = \sum a_n \sin(nx)$，其中系数待定"）
  - 仅含省略号的加法列表（如 "1+2+3+..." 或 "解为若干项之和"）
  - 需要进一步求解的隐式方程（如 "解满足 f(x) = 0" 而未给出 x 的具体值）
  - 互补误差函数erfc()等特殊函数

【出题原则】：
- 任何题目都必须先通过"唯一性检查"和"可解性检查"
- 如果存在参数歧义（如 a²=1, |a|=2 等），必须在题目中明确说明如何处理或要求分情况讨论
- 如果是PDE/ODE问题，边界条件和初始条件必须相互兼容
- 如果题目条件中包含矩阵，其阶至少为3
- 题面中每个条件都必须对解题有用，不允许无谓的干扰信息
- 如果题目存在隐含条件或分支可能，必须在题面中明确说明
- 题目应体现"结构识别"的难度，而不是"计算长度"的难度

【参数歧义处理】（如果适用）：
- 如果题目中参数满足某个方程有多个解，必须在题面中说明：
  - 要么明确指定参数值（如 "设 a > 0"）
  - 要么要求分情况讨论（如 "求 a² = 1 时的解，需要讨论 a = 1 和 a = -1 两种情况"）

【PDE/ODE 边界条件要求】：
- 边界条件之间必须兼容（如不能在同一点同时指定 Dirichlet 和 Neumann）
- 分离变量法使用的边界条件必须与特征函数匹配
- 初始条件和边界条件必须自洽（如热传导方程在无穷远处需要适当的衰减条件）

【题目格式要求】（必须严格遵守）：
1. **必须是单一问题**：只能有1个小问，不能有(1)(2)(3)或第一问第二问这样的多问
2. **必须是计算题**：答案必须是一个具体数值（或具体表达式），不能是"证明xxx"或"讨论xxx的性质"
3. **题干必须干净**：所有条件都必须对解题有用，不允许出现与解题无关的废话
4. **条件必须正确**：所有给出的条件在数学上必须是正确的，不能有错误描述
5. **题目直观**：变量命名规范，条件描述清晰易懂

${antiPatterns.length > 0 ? `
【高难度题目设计方向】（根据学科框架自动提取）：

该方向的高级题型设计策略如下，出题时请根据难度要求灵活运用：

${antiPatterns.map((s, i) => `${i + 1}. ${s}`).join('\n')}

注意：对于竞赛级（difficulty ≥ 4）题目，必须至少使用上述策略中的2条来增加题目区分度。
` : ''}

【主题】：${effectiveTopic}${aliasText}
【难度】：${input.trapCount}
【是否允许查表】：${input.allowTableLookup ? '是' : '否'}

${getTextbookPromptConstraints(constraints)}

${disciplineSpecificPart}

【该方向最终验证规则】：
后续 Reviewer 会按以下验证规则检查最终题目；若违反会直接重试，不得把这些规则当成软建议。
- 禁止题型：${forbiddenQuestionTypes.length > 0 ? forbiddenQuestionTypes.join('；') : '无'}
- 禁止错误：${forbiddenErrors.length > 0 ? forbiddenErrors.join('；') : '无'}
- 参数约束：${Object.keys(parameterConstraints).length > 0 ? Object.entries(parameterConstraints).map(([key, desc]) => `${key}: ${desc}`).join('；') : '无'}

【数学结构扰动蓝图要求】：
本节点只生成基础题和扰动蓝图，不直接完成最终扰动。后续 Node3 会根据蓝图改写题目。
你必须使用用户选择的扰动类型 ${input.perturbationType}，并在输出的 mathPerturbationBlueprint 中完整填写：

${perturbationRulesText}

蓝图必须满足：
- basePattern：说明当前基础题的熟题外观或常见解法入口。
- targetWeakness：说明希望人工验证的解题模型能力弱点。
- perturbationType：必须严格等于 ${input.perturbationType}，不得输出其他扰动类型。
- invalidatedStandardMethod：说明哪条熟题解法将在 Node3 扰动后失效。
- expectedWrongPath：说明解题模型可能走的错误路线。
- divergenceStep：说明正确路线和错误路线在哪一步分叉。
- manualValidationChecklist：给人工验证解题模型回答时使用的 3-5 条检查项。

【难度梯度体系及学科特征】：

根据主题"${effectiveTopic}"，系统已自动聚焦到对应的学科难度框架：

${topicDisciplineGuidance}

${difficultyStr === 'competition' ? `
【竞赛级特别要求】（全国数学竞赛/IMO/Putnam/博士研究生水平 - 必须满足）：
- 题目必须使用高级数学理论（见上述学科框架中的competition级别）
- 题目应来源于或类似以下来源：
  * IMO Shortlist/LonglistProblems
  * Putnam数学竞赛试题
  * 全国大学生数学竞赛决赛/预赛试题
  * 研究生入学考试数学专业试题
  * 著名数学期刊中的数学问题
- 必须具有原创性或深刻性，不是经典题目的简单变形
- 解题路径至少需要${minReasoningSteps}步推理
- 必须体现以下至少4种数学思想：
  * 抽象化：从抽象代数结构（如群、环、模）角度思考
  * 深刻性：涉及深刻定理（如Riemann-Roch，Spectral Theorem）
  * 综合性：跨学科综合（如代数+几何+拓扑）
  * 构造性：构造反例、函数，流形
  * 技巧性：需要高超的代数变形或分析估计
  * 理论性：证明深刻定理的推论或引理
- 题目应能区分顶尖数学研究生水平的学生
` : ''}

【输出要求】：
请返回一个 JSON 对象，包含以下字段：
{
  "problemId": "base_${problemNumber}_${Date.now()}",
  "topic": "${effectiveTopic}",
  "scenario": "真实场景描述（数学建模/理论/应用，1-2句话）",
  "questionBody": "完整题目描述（必须只有1个小问，必须是计算题，答案必须是闭式结果，100-200字）",
  "givenData": {
    "核心数学对象": {"value": "若无具体数值，可用字符串表示核心方程/多项式/函数/矩阵/条件", "unit": ""},
    "数学量名称2": {"value": "数值或字符串", "unit": "单位（可省略）"}
  },
  "requiredAnswer": "求解目标（必须是闭式答案：具体数值、闭式表达式、带通项的级数、定积分等；不能是"证明"或"讨论"）",
  "solutionPath": ["解题步骤1", "解题步骤2", "解题步骤3", "解题步骤4"${difficultyStr === 'basic' ? '' : ', "更多推理步骤..."'}],
  "expectedDifficulty": ${input.trapCount},
  "mathPerturbationBlueprint": {
    "basePattern": "基础题呈现出的熟题外观或常见解法入口",
    "targetWeakness": "希望人工验证的解题模型能力弱点",
    "perturbationType": "${input.perturbationType}",
    "invalidatedStandardMethod": "扰动后会失效的熟题解法",
    "expectedWrongPath": "解题模型可能走的错误路线",
    "divergenceStep": "正确路线与错误路线开始分叉的步骤",
    "manualValidationChecklist": ["人工检查项1", "人工检查项2", "人工检查项3"]
  }
}

【关键规则】：
- 题目必须基于真实的数学原理和背景
- 数据范围合理（如角度0-2π，矩阵维度2-5，概率0-1）
- 难度必须与所选学科的Level定义严格匹配，不可越级
- 解题路径应包含与难度对应的关键理论推导步骤，且不得少于 ${minReasoningSteps} 步
- 学科特征明显，避免模糊不清的"万金油"题目
- 禁止生成多问题目（如"（1）...（2）..."）
- **【关键】最终答案必须是闭式形式**：具体数值、闭式表达式、带通项的级数、定积分、明确的函数展开
- 如果存在参数歧义，必须在题面中明确说明处理方式（指定参数值或要求分情况讨论）
- 禁止生成证明题（答案必须是具体数值或表达式，不是证明过程）
- 所有条件必须对解题有用，禁止添加冗余信息
- 所有条件描述必须正确，不能有数学错误
- **【关键】绝对禁止跨学科渗透**：题目中不得出现任何化学、物理、生物等非数学学科的专业术语和概念
- givenData 至少应包含1项代表题目核心数学对象；纯数学题没有具体数值时，可用字符串保存核心方程、函数、多项式、矩阵或约束条件。
`;

    try {
        // Retry mechanism for API connection errors
        const maxRetries = 3;
        let lastError: Error | null = null;
        let content = '';

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                content = await callMathLLM(`node2_${problemIndex}`, tokenTrackerId, prompt, {
                    model: 'reasoning',
                    temperature: 1.0,
                    reasoning: { effort: 'xhigh', summary: 'auto' }
                });
                break;
            } catch (error: any) {
                lastError = error;
                console.warn(`API attempt ${attempt} failed: ${error.message}`);
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        }

        if (!content) {
            throw lastError || new Error('Failed to get API response after retries');
        }

        // Log raw response for debugging (first 500 chars)
        console.log(`[Node2] LLM原始响应（前500字符）:`, content.substring(0, 500));

        // Try multiple parsing strategies using the robust cleanAndParseJSON utility
        let baseProblem: BaseProblem;
        try {
            baseProblem = cleanAndParseJSON(content);
            console.log(`[Node2] JSON解析成功`);
        } catch (parseError: any) {
            console.error(`[Node2] JSON解析失败:`, parseError.message);
            console.error(`[Node2] 完整响应内容:\n`, content);
            throw new Error(`JSON解析失败: ${parseError.message}。请检查LLM输出格式。`);
        }

        // Validation
        if (!baseProblem.questionBody || !baseProblem.givenData || !baseProblem.solutionPath) {
            throw new Error('Generated problem is incomplete');
        }

        if (baseProblem.solutionPath.length < minReasoningSteps) {
            throw new Error(`Solution path too short (minimum ${minReasoningSteps} steps required)`);
        }

        if (!baseProblem.mathPerturbationBlueprint) {
            const fallbackRule = selectedPerturbationRule;
            baseProblem.mathPerturbationBlueprint = {
                basePattern: baseProblem.solutionPath[0] || `${effectiveTopic} 常规解法`,
                targetWeakness: fallbackRule.targetWeakness,
                perturbationType: fallbackRule.perturbationType,
                invalidatedStandardMethod: fallbackRule.invalidatedStandardMethod,
                expectedWrongPath: fallbackRule.expectedWrongPath,
                divergenceStep: '在选择可用定理、定义域、边界或参数分支时发生分叉',
                manualValidationChecklist: fallbackRule.manualValidationHints
            };
        }

        baseProblem.mathPerturbationBlueprint.perturbationType = input.perturbationType;

        if (!Array.isArray(baseProblem.mathPerturbationBlueprint.manualValidationChecklist)) {
            baseProblem.mathPerturbationBlueprint.manualValidationChecklist = [
                String(baseProblem.mathPerturbationBlueprint.manualValidationChecklist || '检查是否执行扰动对应的关键分叉')
            ];
        }

        baseProblem.mathDisciplineContext = disciplineContext;

        return baseProblem;

    } catch (error) {
        console.error("Node 2 Error:", error);
        throw new Error(`Failed to generate base problem: ${error.message}`);
    }
}

export { getMathDifficultyLevel, getMathMinimumReasoningSteps };

function getDisciplineSpecificGuidance(topic: string, difficulty: 'basic' | 'intermediate' | 'advanced' | 'competition'): string {
    return getDisciplineGuidance(topic, difficulty);
}

function getDifficultyGuidance(difficulty: 'basic' | 'intermediate' | 'advanced' | 'competition'): string {
    const guidance = {
        'basic': `
- 应用 Level 1 要求：直接应用公式
- 单一知识点考察
- 数学：基础运算
- 示例：求解一元二次方程根`,

        'intermediate': `
- 应用 Level 2 要求：需要变形或转化
- 多个知识点综合
- 需要一定技巧（如换元、配方法）
- 示例：求复合函数导数，解三元方程组`,

        'advanced': `
- 应用 Level 3 要求：综合应用多个定理
- 需要构造性思维
- 涉及数形结合、分类讨论
- 示例：导数证明不等式，求矩阵特征值`,

        'competition': `
- 【研究生/博士水平 - 全国数学竞赛/IMO/Putnam级别】
- 必须使用前沿数学理论或深刻技巧
- 题目应体现以下特征（至少4项）：
  1) 深刻性：涉及代数几何、表示论、解析数论、代数拓扑等前沿领域
  2) 技巧性：需要高超的代数变形或分析技巧
  3) 综合性：跨多个数学分支（如数论+代数几何，拓扑+几何）
  4) 构造性：需要构造反例、构造序列、构造泛函
  5) 抽象性：从抽象结构出发而非具体计算
  6) 理论性：证明深刻定理的推论或引理
- 参考资料：IMO Shortlist/Longlist，Putnam， 全国大学生数学竞赛决试题，
  《走向IMO》《数学竞赛中的数论问题》《组合几何》《代数几何原理》
- 示例类型：
  * 抽象代数中有限群的阶与结构
  * 代数曲线奇点与贝祖定理
  * 解析数论中素数分布与L函数
  * 拓扑学中同调群计算
  * 微分几何中曲率与流形性质`
    };

    return guidance[difficulty] || guidance['intermediate'];
}
