import { callLLMTracked } from "../costTracker";
import { getDisciplineGuidance, getMatchedDisciplineForbiddenErrors, getPeakDifficulty } from "../disciplines";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { MaterialsV2QuestionDraft } from "./generator";
import { lintMaterialsPhysics, type MaterialsPhysicalLintResult } from "./physics-lint";
import type { MaterialsQuestionType } from "../../../../types/multiNodeTypes";
import type { MaterialsDifficultyLevel } from "./difficulty";

/**
 * Materials V2 — A2/A3 审查 + 修复
 *
 * 材料学专属拦截：
 * 1. A2 前置一层「确定性物理自洽性 lint」（physics-lint.ts），命中即注入 validityIssues。
 * 2. 修复上限比通用 V2 多 1 轮（3 轮 vs 化学 2 轮），因为材料学参数耦合更多，
 *    需要更多修复空间。
 * 3. 修复失败降级检测新增 unrepairable 归类：连续两轮出现物理硬伤即判定为不可修复。
 */

export interface MaterialsReviewResult {
    passed: boolean;
    validityIssues: string[];       // 物理自洽 / 数据正确性（阻断）
    difficultyIssues: string[];     // 难度不足（阻断）
    depthIssues: string[];          // 结构防御（非阻断警告）
    overallVerdict: string;
    lintWarnings: string[];         // 来自 physics-lint 的非阻断警告
}

export interface MaterialsReviewedDraft {
    draft: MaterialsV2QuestionDraft;
    reviewResult: MaterialsReviewResult;
    repairCycles: number;
    needsRegeneration: boolean;
    degradationLevel: 'stable' | 'oscillating' | 'diverging' | 'unrepairable';
    degradationReason: string;
    physicalLintTrace: MaterialsPhysicalLintResult[];  // 每轮 lint 结果留痕
}

const MAX_REPAIR_CYCLES = 3;  // 材料学专属：比化学（2）多 1 轮

/**
 * 生成 A2 审查 prompt 中的"难度审查门槛"段落——按题目自身档位提升门槛。
 *
 * - standard：现有"不能是单步公式代入 / 至少 4 步推理"
 * - hard：步骤 < 6、判断分叉 < 2、未跨概念耦合、无隐含陷阱 → 全部进 difficultyIssues
 * - peak：步骤 < 8、仍是教材例题、未涉及模型修正/推广、未对齐 peak_difficulty → 进 difficultyIssues
 */
function buildDifficultyGate(difficultyLevel: MaterialsDifficultyLevel, questionType: MaterialsQuestionType, peakDifficulty: string): string {
    const stepUnit = questionType === 'short-answer' ? '论述层次/推理链条' : '推理步骤';
    if (difficultyLevel === 'peak') {
        return `3. **难度合理性（difficultyIssues）—— 顶级档，本题必须达到科研级深度**：
   - ${stepUnit}数 < 8 → difficultyIssues
   - 仍然是本科/研究生教材可直接找到原型的例题（哪怕换了数字）→ difficultyIssues
   - 未涉及经典模型的**适用边界或修正/推广**（如 JMAK 非等温推广、Scheil 有限扩散修正、Scherrer 用 Williamson-Hall 分离、DFT 带隙需 HSE06/GW）→ difficultyIssues
   - 未对齐以下"难度天花板"方向 → difficultyIssues：
${peakDifficulty ? peakDifficulty.split('\n').map(l => '     ' + l).join('\n') : '     （该知识点未提供顶级难度描述，请以科研级深度综合判断）'}
   - 单一公式一路代入即可解决 → difficultyIssues`;
    }
    if (difficultyLevel === 'hard') {
        return `3. **难度合理性（difficultyIssues）—— 困难档，本题必须达到跨概念耦合级深度**：
   - ${stepUnit}数 < 6 → difficultyIssues
   - 判断分叉点 < 2 个（全程只用一个公式/模型，无选择判断）→ difficultyIssues
   - 未耦合至少 2 个子概念（例如只用相图/只用扩散/只用位错，无耦合）→ difficultyIssues
   - 条件设置无隐含陷阱或易错点（一眼看穿的直线式题目）→ difficultyIssues
   - 明显是教材例题的直接改数字 → difficultyIssues`;
    }
    return `3. **难度合理性（difficultyIssues）—— 标准档**：
   - 是否是单步公式代入题（属难度不足）
   - 是否有 ≥4 步相互依赖的推理链
   - 是否有明显的判断分叉/易错点`;
}

function buildCalculationReviewPrompt(
    draft: MaterialsV2QuestionDraft,
    lintReport: string,
    lintWarningsSection: string,
    disciplineGuidance: string,
    forbiddenErrors: string[],
    singleQuestion: boolean,
    difficultyGate: string
): string {
    return `你是材料科学与工程领域的资深审查专家。请审查以下题目和标准答案是否可发布。

【知识点】：${draft.knowledgePoint}
【考察维度】：${draft.chosenDimension}

【题目】
${draft.questionText}

【核心数据】
${JSON.stringify(draft.coreData, null, 2)}

【求解目标】
${draft.requiredAnswer}

【标准答案】
${draft.referenceAnswer}

【参考步骤】
${draft.referenceSteps.join('\n')}

${lintReport}

${lintWarningsSection}

${disciplineGuidance}

${forbiddenErrors.length > 0 ? `【本方向禁止出现的错误（审查清单）】：\n${forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}
【审查维度】：
1. **物理自洽性（validityIssues）**：
   - 晶体结构与元素对应是否正确
   - 相变温度、力学参数、扩散系数、活化能是否在合理量级
   - 是否存在绝热+恒温、放热+吸热等热力学矛盾
   - 工艺参数是否与实验数据一致（回火温度、淬火温度、热加工温度）
   - 单位换算是否正确
2. **数据正确性（validityIssues）**：
   - 参考解答的公式选用是否正确
   - 数值代入是否有算术错误
   - 最终答案量纲是否与求解目标一致
3. **难度合理性（difficultyIssues）**：
${difficultyGate}
4. **结构防御（depthIssues，非阻断）**：
   - 是否有隐含条件需要考生识别
   - 是否有单位/基准的陷阱
5. **单问约束**：${singleQuestion ? '题目必须是单问；若有 (1)(2) 拆分，进入 difficultyIssues。' : '题目最多 2 问且第 1 问必须是第 2 问的必要前提。'}

输出严格 JSON，不含 markdown：
{
  "passed": true,
  "validityIssues": [],
  "difficultyIssues": [],
  "depthIssues": [],
  "overallVerdict": "一句话结论"
}`;
}

function buildShortAnswerReviewPrompt(
    draft: MaterialsV2QuestionDraft,
    lintReport: string,
    lintWarningsSection: string,
    disciplineGuidance: string,
    forbiddenErrors: string[],
    singleQuestion: boolean,
    difficultyGate: string
): string {
    return `你是材料科学与工程领域的资深审查专家。请审查以下**简答题/论述题**和参考答案是否可发布。

【知识点】：${draft.knowledgePoint}
【论述维度】：${draft.chosenDimension}

【题目】
${draft.questionText}

【论述问题】
${draft.requiredAnswer}

【参考答案（完整论述）】
${draft.referenceAnswer}

【核心要点】
${(draft.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

${lintReport}

${lintWarningsSection}

${disciplineGuidance}

${forbiddenErrors.length > 0 ? `【本方向需覆盖或警惕的知识点（审查清单）】：\n${forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}
【审查维度】：
1. **学科事实正确性（validityIssues）**：
   - 引用的定律/判据/理论名称是否正确（如 Hall-Petch、Schmid 因子、Fick 定律的适用条件）
   - 晶体结构与元素对应是否正确
   - 相变温度、力学参数等关键数据是否在合理量级
   - 论述中是否有逻辑矛盾或因果倒置
   - 是否存在混淆概念（如把 Tresca 与 von Mises 的表达式写反）
2. **论述深度（difficultyIssues）**：
${difficultyGate}
   - 参考答案是否只是定义复述（深度不足）
   - 是否覆盖了至少 3 个学科核心概念的推理链
   - 是否包含机理 + 判据/公式 + 工程含义三个层次
   - referencePoints 是否 ≥ 4 条且每条有实质内容
3. **结构与完整性（depthIssues，非阻断）**：
   - 论述是否有条理（因果链/对比结构）
   - 是否遗漏了明显需要提及的关联概念
   - 引用是否精确到具体定律名称（而非笼统的"相关理论"）
4. **单问约束**：${singleQuestion ? '题目必须是单个论述问题；若有 (1)(2) 拆分，进入 difficultyIssues。' : '题目最多 2 问且第 1 问必须是第 2 问的必要前提。'}

输出严格 JSON，不含 markdown：
{
  "passed": true,
  "validityIssues": [],
  "difficultyIssues": [],
  "depthIssues": [],
  "overallVerdict": "一句话结论"
}`;
}

function buildMixedReviewPrompt(
    draft: MaterialsV2QuestionDraft,
    lintReport: string,
    lintWarningsSection: string,
    disciplineGuidance: string,
    forbiddenErrors: string[],
    singleQuestion: boolean,
    difficultyGate: string
): string {
    return `你是材料科学与工程领域的资深审查专家。请审查以下**混合题（含计算小问 + 论述小问）**和参考答案是否可发布。

【知识点】：${draft.knowledgePoint}
【考察维度】：${draft.chosenDimension}

【题目】
${draft.questionText}

【求解目标】
${draft.requiredAnswer}

【参考答案（分小问）】
${draft.referenceAnswer}

【计算推导步骤】
${(draft.referenceSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n') || '（无）'}

【论述核心要点】
${(draft.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无）'}

【核心数据】
${JSON.stringify(draft.coreData, null, 2)}

${lintReport}

${lintWarningsSection}

${disciplineGuidance}

${forbiddenErrors.length > 0 ? `【本方向禁止出现的错误（审查清单）】：\n${forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}
【审查维度】：
1. **物理自洽与学科事实正确性（validityIssues）**：
   - 计算小问：公式适用条件、单位换算、数值量级、唯一确定解
   - 论述小问：引用的定律/判据名称是否正确、适用条件是否正确、有无概念混淆
   - coreData 中的数值是否都能在 questionText 文字中找到（题干自足）
   - 计算结果与论述内容之间是否有矛盾
2. **混合题结构合规性（validityIssues，阻断）**：
   - 是否**确实**同时包含至少 1 个计算小问（有数值答案）和至少 1 个论述小问
   - 各小问是否处在**同一情境**（同一体系/合金/工艺）
   - 论述小问是否**基于**前面的计算结果或题设条件展开（不能各自为政）
   - 若小问相互完全独立、或论述部分只是纯定义复述 → 进入 validityIssues
3. **难度与深度（difficultyIssues）**：
${difficultyGate}
   - 计算小问是否需要多步推理（≥3 步），不是单步套公式
   - 论述小问是否覆盖机理 + 判据 + 工程含义（至少两个层次）
   - referenceSteps 是否 ≥3 步，referencePoints 是否 ≥3 条且每条有实质内容
4. **结构与完整性（depthIssues，非阻断）**：
   - 小问编号是否清晰、递进关系是否合理
   - 参考答案是否按小问分别作答、覆盖完整
5. **小问数量约束**：${singleQuestion ? '小问总数必须为 2（1 计算 + 1 论述）；超出进入 difficultyIssues。' : '小问总数 2-4 个，需形成递进推理链。'}

输出严格 JSON，不含 markdown：
{
  "passed": true,
  "validityIssues": [],
  "difficultyIssues": [],
  "depthIssues": [],
  "overallVerdict": "一句话结论"
}`;
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

function normalizeReviewResult(parsed: Partial<MaterialsReviewResult>, lint: MaterialsPhysicalLintResult): MaterialsReviewResult {
    const validityIssues = normalizeStringArray(parsed.validityIssues);
    const difficultyIssues = normalizeStringArray(parsed.difficultyIssues);
    const depthIssues = normalizeStringArray(parsed.depthIssues);

    // 材料学专属：确定性 lint 命中一律灌入 validityIssues
    for (const v of lint.violations) {
        if (!validityIssues.includes(v)) validityIssues.push(v);
    }

    const passed = validityIssues.length === 0 && difficultyIssues.length === 0;
    return {
        passed,
        validityIssues,
        difficultyIssues,
        depthIssues,
        overallVerdict: String(parsed.overallVerdict || (passed ? '通过' : '未通过')),
        lintWarnings: lint.warnings,
    };
}

function normalizeDraft(parsed: Partial<MaterialsV2QuestionDraft>, previous: MaterialsV2QuestionDraft): MaterialsV2QuestionDraft {
    return {
        ...previous,
        problemId: String(parsed.problemId || previous.problemId),
        knowledgePoint: String(parsed.knowledgePoint || previous.knowledgePoint),
        chosenDimension: String(parsed.chosenDimension || previous.chosenDimension),
        questionType: previous.questionType,
        difficultyLevel: previous.difficultyLevel,
        questionText: String(parsed.questionText || previous.questionText),
        coreData: (parsed.coreData && typeof parsed.coreData === 'object') ? parsed.coreData : previous.coreData,
        requiredAnswer: String(parsed.requiredAnswer || previous.requiredAnswer),
        referenceAnswer: String(parsed.referenceAnswer || previous.referenceAnswer),
        referenceSteps: normalizeStringArray(parsed.referenceSteps).length ? normalizeStringArray(parsed.referenceSteps) : previous.referenceSteps,
        referencePoints: normalizeStringArray(parsed.referencePoints).length ? normalizeStringArray(parsed.referencePoints) : (previous.referencePoints || []),
    };
}

async function reviewQuestion(
    draft: MaterialsV2QuestionDraft,
    lint: MaterialsPhysicalLintResult,
    problemIndex: number,
    singleQuestion: boolean
): Promise<MaterialsReviewResult> {
    const disciplineGuidance = getDisciplineGuidance(draft.knowledgePoint);
    const forbiddenErrors = getMatchedDisciplineForbiddenErrors(draft.knowledgePoint);
    const peakDifficulty = getPeakDifficulty(draft.knowledgePoint);
    const isShortAnswer = draft.questionType === 'short-answer';
    const isMixed = draft.questionType === 'mixed';
    const difficultyGate = buildDifficultyGate(draft.difficultyLevel || 'standard', draft.questionType, peakDifficulty);

    const lintReport = lint.hasViolation
        ? `⚠️ 前置确定性检查发现以下硬伤（请在你的 validityIssues 中确认或补充说明）：\n${lint.violations.map((v, i) => `${i + 1}. ${v}`).join('\n')}`
        : '前置确定性检查无硬伤。';

    const lintWarningsSection = lint.warnings.length > 0
        ? `【前置警告（请重点复核）】：\n${lint.warnings.map((w, i) => `${i + 1}. ${w}`).join('\n')}`
        : '';

    const prompt = isMixed
        ? buildMixedReviewPrompt(draft, lintReport, lintWarningsSection, disciplineGuidance, forbiddenErrors, singleQuestion, difficultyGate)
        : isShortAnswer
        ? buildShortAnswerReviewPrompt(draft, lintReport, lintWarningsSection, disciplineGuidance, forbiddenErrors, singleQuestion, difficultyGate)
        : buildCalculationReviewPrompt(draft, lintReport, lintWarningsSection, disciplineGuidance, forbiddenErrors, singleQuestion, difficultyGate);

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'review',
            temperature: 0.2,
            responseFormat: 'json',
            systemPrompt: '你是严格材料学审查器，只输出严格 JSON。',
        }, problemIndex, 'a2_review')).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return normalizeReviewResult({
                passed: false,
                validityIssues: ['审查响应无法解析为 JSON'],
                overallVerdict: '审查响应解析失败',
            }, lint);
        }

        return normalizeReviewResult(cleanAndParseJSON(jsonMatch[0]) as Partial<MaterialsReviewResult>, lint);
    } catch (error) {
        return normalizeReviewResult({
            passed: false,
            validityIssues: [`审查失败: ${(error as Error).message}`],
            overallVerdict: '审查异常',
        }, lint);
    }
}

async function repairQuestion(
    draft: MaterialsV2QuestionDraft,
    reviewResult: MaterialsReviewResult,
    cycle: number,
    problemIndex: number,
    singleQuestion: boolean
): Promise<MaterialsV2QuestionDraft> {
    const disciplineGuidance = getDisciplineGuidance(draft.knowledgePoint);
    // 有 validity 硬伤 → deepRepair（可换情境和数据），只有 depth → detailRepair
    const isDeep = reviewResult.validityIssues.length > 0 || reviewResult.difficultyIssues.length > 0;
    const isShortAnswer = draft.questionType === 'short-answer';
    const isMixed = draft.questionType === 'mixed';

    const issuesSection = `【审查问题】
- ${isShortAnswer ? '学科事实错误' : isMixed ? '物理自洽/结构合规' : '物理自洽/数据错误'}（必须修）：${reviewResult.validityIssues.join('；') || '无'}
- ${isShortAnswer ? '论述深度不足' : isMixed ? '深度/结构不足' : '难度不足'}（必须修）：${reviewResult.difficultyIssues.join('；') || '无'}
- 结构完整性（尽量修）：${reviewResult.depthIssues.join('；') || '无'}`;

    const prompt = isMixed
        ? buildMixedRepairPrompt(draft, issuesSection, isDeep, cycle, disciplineGuidance, singleQuestion)
        : isShortAnswer
        ? `你是材料科学简答题修复专家。请只根据审查意见修复题目和参考答案，保持知识点和论述维度不变。

【原题】
${draft.questionText}

【原论述问题】
${draft.requiredAnswer}

【原参考答案】
${draft.referenceAnswer}

【原核心要点】
${(draft.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

${issuesSection}

【本轮修复模式】：${isDeep ? '深度修复（第 ' + cycle + ' 轮）—— 允许调整论述角度、背景情境、追问方式' : '细节修复（第 ' + cycle + ' 轮）—— 保持题干不变，仅补充/修正答案要点'}

${disciplineGuidance}

【修复硬性要求】：
1. 必须消除所有 validityIssues 和 difficultyIssues。
2. 引用的定律/判据必须准确到具体名称，且适用条件正确。
3. referenceAnswer 为完整论述（400-700 字），覆盖机理 + 判据 + 工程含义三个层次。
4. referencePoints 为 4-8 条核心要点（每条 15-40 字）。
5. 不要求数值计算；如需定量说明用半定量表述（数量级、单调性、关键判据）。
6. ${singleQuestion ? '修复后仍必须是单个论述问题。' : '修复后最多 2 问且互为前置。'}

输出严格 JSON（字段与原 draft 一致）：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${draft.chosenDimension}",
  "questionText": "修复后的完整题干",
  "coreData": {},
  "requiredAnswer": "论述问题的简明描述",
  "referenceAnswer": "修复后的完整论述参考答案",
  "referencePoints": ["要点1", "要点2", "...（至少4条）"]
}`
        : `你是材料科学题目修复专家。请只根据审查意见修复题目和标准答案，保持知识点和考察维度不变。

【原题】
${draft.questionText}

【原标准答案】
${draft.referenceAnswer}

【原核心数据】
${JSON.stringify(draft.coreData, null, 2)}

${issuesSection}

【本轮修复模式】：${isDeep ? '深度修复（第 ' + cycle + ' 轮）—— 允许调整情境、数据、条件' : '细节修复（第 ' + cycle + ' 轮）—— 保持情境不变，仅调数值/边界'}

${disciplineGuidance}

【修复硬性要求】：
1. 必须消除所有 validityIssues 和 difficultyIssues。
2. coreData 中的数值必须能在 questionText 文字中找到（题干自足）。
3. 标准答案必须包含完整公式、代入过程、单位换算和带单位的最终答案。
4. 修复后至少 4-6 步推导。
5. ${singleQuestion ? '修复后仍必须是单问。' : '修复后最多 2 问且互为前置。'}

输出严格 JSON（字段与原 draft 一致）：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${draft.chosenDimension}",
  "questionText": "修复后的完整题干",
  "coreData": {
    "物理量名称": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "求解目标",
  "referenceAnswer": "修复后的完整标准答案",
  "referenceSteps": ["步骤1", "步骤2", "..."]
}`;

    function buildMixedRepairPrompt(
        draftIn: MaterialsV2QuestionDraft,
        issues: string,
        deep: boolean,
        cyc: number,
        guidance: string,
        single: boolean
    ): string {
        return `你是材料科学混合题修复专家。请只根据审查意见修复这道混合题（含计算+论述小问），保持知识点和考察维度不变。

【原题】
${draftIn.questionText}

【原求解目标】
${draftIn.requiredAnswer}

【原参考答案（分小问）】
${draftIn.referenceAnswer}

【原计算推导步骤】
${(draftIn.referenceSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n') || '（无）'}

【原论述要点】
${(draftIn.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无）'}

【原核心数据】
${JSON.stringify(draftIn.coreData, null, 2)}

${issues}

【本轮修复模式】：${deep ? '深度修复（第 ' + cyc + ' 轮）—— 允许调整情境、小问拆分、数据和论述角度' : '细节修复（第 ' + cyc + ' 轮）—— 保持情境和小问拆分不变，仅修正数值/论述内容'}

${guidance}

【修复硬性要求】：
1. 必须消除所有 validityIssues 和 difficultyIssues。
2. 修复后必须同时包含至少 1 个计算小问 + 1 个论述小问。
3. 各小问必须共享同一情境；论述小问必须基于计算结果或题设条件展开。
4. 计算小问：coreData 数值必须在 questionText 中找到，答案带单位。
5. 论述小问：引用学科定律/判据名称须准确。
6. referenceSteps ≥ 3 步（计算部分），referencePoints ≥ 3 条（论述部分）。
7. ${single ? '小问总数控制在 2 个。' : '小问总数 2-4 个，递进推理链。'}

输出严格 JSON（字段与原 draft 一致）：
{
  "problemId": "${draftIn.problemId}",
  "knowledgePoint": "${draftIn.knowledgePoint}",
  "chosenDimension": "${draftIn.chosenDimension}",
  "questionText": "修复后的完整题干含小问",
  "coreData": {"物理量名称": {"value": 数值, "unit": "单位"}},
  "requiredAnswer": "所有小问的合并简述",
  "referenceAnswer": "修复后的分小问完整答案",
  "referenceSteps": ["计算步骤1", "计算步骤2", "..."],
  "referencePoints": ["论述要点1", "论述要点2", "..."]
}`;
    }

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'reasoning',
            temperature: isDeep ? 0.4 : 0.2,
            responseFormat: 'json',
            systemPrompt: isMixed ? '你是材料学混合题修复专家，只输出严格 JSON。' : isShortAnswer ? '你是材料学简答题修复专家，只输出严格 JSON。' : '你是材料学题目修复专家，只输出严格 JSON。',
        }, problemIndex, 'a3_repair')).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return draft;
        return normalizeDraft(cleanAndParseJSON(jsonMatch[0]) as Partial<MaterialsV2QuestionDraft>, draft);
    } catch {
        return draft;
    }
}

function detectDegradation(reviews: MaterialsReviewResult[], repairCycles: number): { level: MaterialsReviewedDraft['degradationLevel']; reason: string } {
    if (reviews.length === 0) return { level: 'stable', reason: '' };
    const last = reviews[reviews.length - 1];
    if (last.passed) return { level: 'stable', reason: '' };
    if (reviews.length < 2) return { level: 'stable', reason: '' };
    const prev = reviews[reviews.length - 2];
    const lastIssues = [...last.validityIssues, ...last.difficultyIssues];
    const prevIssues = [...prev.validityIssues, ...prev.difficultyIssues];
    // 振荡：连续两轮问题集合有交集
    const overlap = lastIssues.filter(i => prevIssues.includes(i));
    if (overlap.length > 0) return { level: 'oscillating', reason: `连续两轮出现相同问题：${overlap.join('；')}` };
    // 发散：问题数增多
    if (lastIssues.length > prevIssues.length) return { level: 'diverging', reason: '问题数量在修复中反而增加' };
    // 材料学专属 unrepairable：连续两轮出现物理 validity 硬伤且已修满
    if (repairCycles >= MAX_REPAIR_CYCLES - 1 && last.validityIssues.length > 0 && prev.validityIssues.length > 0) {
        return { level: 'unrepairable', reason: '连续多轮物理自洽性硬伤，判定为不可修复' };
    }
    return { level: 'stable', reason: '' };
}

export async function reviewAndRepair(
    draft: MaterialsV2QuestionDraft,
    problemIndex: number = 0,
    singleQuestion: boolean = false
): Promise<MaterialsReviewedDraft> {
    let currentDraft = draft;
    const isShortAnswer = currentDraft.questionType === 'short-answer';
    const isMixed = currentDraft.questionType === 'mixed';
    // mixed 题有 coreData（计算小问），不能跳过数值检查；只有纯简答题跳过
    let firstLint = lintMaterialsPhysics(currentDraft, isShortAnswer);
    let review = await reviewQuestion(currentDraft, firstLint, problemIndex, singleQuestion);
    const reviews: MaterialsReviewResult[] = [review];
    const lintTrace: MaterialsPhysicalLintResult[] = [firstLint];
    let repairCycles = 0;

    while (!review.passed && repairCycles < MAX_REPAIR_CYCLES) {
        currentDraft = await repairQuestion(currentDraft, review, repairCycles + 1, problemIndex, singleQuestion);
        repairCycles += 1;
        const lint = lintMaterialsPhysics(currentDraft, isShortAnswer);
        review = await reviewQuestion(currentDraft, lint, problemIndex, singleQuestion);
        reviews.push(review);
        lintTrace.push(lint);

        const degradation = detectDegradation(reviews, repairCycles);
        if (degradation.level !== 'stable' && !review.passed) {
            return {
                draft: currentDraft,
                reviewResult: review,
                repairCycles,
                needsRegeneration: true,
                degradationLevel: degradation.level,
                degradationReason: degradation.reason,
                physicalLintTrace: lintTrace,
            };
        }
    }

    return {
        draft: currentDraft,
        reviewResult: review,
        repairCycles,
        needsRegeneration: !review.passed,
        degradationLevel: 'stable',
        degradationReason: '',
        physicalLintTrace: lintTrace,
    };
}
