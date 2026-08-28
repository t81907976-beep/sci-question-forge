import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { callMathLLM } from "../mathLlmTracker";
import type { MathTokenTrackerId } from "../tokenTracker";
import type { V2QuestionDraft } from "./generator";
import { prescreenDefense } from "./defense-prescreener";
import { buildMathV2RuleContext } from "./rule-context";
import { buildNumericAnswerReviewRule } from "./numeric-answer-option";
import { buildMathHardClosureReviewRule, normalizeHardClosurePlan } from "./hard-closure";
import { buildMathV2QuestionStructureReviewRule } from "./question-structure";

export interface ReviewResult {
    passed: boolean;
    depthIssues: string[];
    correctnessIssues: string[];
    clarityIssues: string[];
    repairInstructions: string;
    overallVerdict: string;
}

export interface ReviewedDraft {
    draft: V2QuestionDraft;
    reviewResult: ReviewResult;
    repairCycles: number;
    degradationLevel: "stable" | "minor" | "major";
    degradationReason: string;
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

function normalizeReviewResult(parsed: Partial<ReviewResult>): ReviewResult {
    return {
        passed: Boolean(parsed.passed),
        depthIssues: normalizeStringArray(parsed.depthIssues),
        correctnessIssues: normalizeStringArray(parsed.correctnessIssues),
        clarityIssues: normalizeStringArray(parsed.clarityIssues),
        repairInstructions: String(parsed.repairInstructions || ""),
        overallVerdict: String(parsed.overallVerdict || ""),
    };
}

function normalizeDraft(parsed: Partial<V2QuestionDraft>, previous: V2QuestionDraft): V2QuestionDraft {
    return {
        ...previous,
        problemId: String(parsed.problemId || previous.problemId),
        knowledgePoint: String(parsed.knowledgePoint || previous.knowledgePoint),
        chosenDimension: String(parsed.chosenDimension || previous.chosenDimension),
        questionText: String(parsed.questionText || previous.questionText),
        coreData: parsed.coreData && typeof parsed.coreData === "object" ? parsed.coreData : previous.coreData,
        requiredAnswer: String(parsed.requiredAnswer || previous.requiredAnswer),
        referenceAnswer: String(parsed.referenceAnswer || previous.referenceAnswer),
        referenceSteps: normalizeStringArray(parsed.referenceSteps).length ? normalizeStringArray(parsed.referenceSteps) : previous.referenceSteps,
        mathDiscipline: String(parsed.mathDiscipline || previous.mathDiscipline || ""),
        difficultyRationale: String(parsed.difficultyRationale || previous.difficultyRationale || ""),
        expectedWrongPath: String(parsed.expectedWrongPath || previous.expectedWrongPath || ""),
        closureChecklist: normalizeStringArray(parsed.closureChecklist).length ? normalizeStringArray(parsed.closureChecklist) : previous.closureChecklist,
        hardClosurePlan: normalizeHardClosurePlan(parsed.hardClosurePlan || previous.hardClosurePlan),
    };
}

async function reviewDraft(draft: V2QuestionDraft, trackerId: MathTokenTrackerId, singleQuestion: boolean, numericAnswerOnly: boolean): Promise<ReviewResult> {
    const prescreen = prescreenDefense(`${draft.questionText}\n${draft.referenceAnswer}`);
    const ruleContext = buildMathV2RuleContext(draft.knowledgePoint);
    const hardClosurePlan = normalizeHardClosurePlan(draft.hardClosurePlan);
    const prompt = `你是数学 V2 A2 审查器。请审查题目和标准答案是否可发布。

【题目】
${draft.questionText}

【标准答案】
${draft.referenceAnswer}

【步骤】
${draft.referenceSteps.join("\n")}

【预筛标签】${prescreen.tier}：${prescreen.reasons.join("；") || "无"}

${ruleContext.reviewBlock}
${buildMathV2QuestionStructureReviewRule(singleQuestion)}
${buildNumericAnswerReviewRule(numericAnswerOnly)}
${buildMathHardClosureReviewRule(hardClosurePlan)}

审查标准：
1. 正确性：条件充分、定义域明确、答案唯一、无多解/无解硬伤。
2. 证明闭合：关键步骤不能跳步，必要性/充分性不能缺失，最终要回代或边界检验。
3. 难度深度：不能是单步套公式、教材模板题或仅靠机械计算；若违反规则块中的禁用题型或低防御模式，必须进入 depthIssues。
4. 表述清晰：题干自足，无歧义，无未声明符号或外部依赖。
5. 参数规则：若违反规则块中的禁用错误或参数约束，必须进入 correctnessIssues 或 clarityIssues。

输出严格 JSON，不含 markdown：
{
  "passed": true,
  "depthIssues": [],
  "correctnessIssues": [],
  "clarityIssues": [],
  "repairInstructions": "若不通过，写给 A3 的具体修复要求；通过则为空",
  "overallVerdict": "一句话结论"
}`;

    const raw = (await callMathLLM("v2_a2_review", trackerId, prompt, {
        model: "review",
        temperature: 0.15,
        responseFormat: "json",
        systemPrompt: "你是严格数学审查器，只输出严格 JSON。",
        reasoning: { effort: "xhigh", summary: "auto" },
    })).trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return normalizeReviewResult({
            passed: false,
            clarityIssues: ["审查响应无法解析"],
            repairInstructions: "重新生成严格 JSON，并核查题目闭合性。",
            overallVerdict: "审查响应无法解析",
        });
    }

    try {
        return normalizeReviewResult(cleanAndParseJSON(jsonMatch[0]) as Partial<ReviewResult>);
    } catch (error) {
        return normalizeReviewResult({
            passed: false,
            clarityIssues: [`审查 JSON 解析失败：${(error as Error).message}`],
            repairInstructions: "重新生成严格 JSON，并核查题目闭合性。",
            overallVerdict: "审查 JSON 解析失败",
        });
    }
}

async function repairDraft(draft: V2QuestionDraft, reviewResult: ReviewResult, trackerId: MathTokenTrackerId, singleQuestion: boolean, numericAnswerOnly: boolean): Promise<V2QuestionDraft> {
    const ruleContext = buildMathV2RuleContext(draft.knowledgePoint);
    const hardClosurePlan = normalizeHardClosurePlan(draft.hardClosurePlan);
    const prompt = `你是数学 V2 A3 修复器。请只根据审查意见修复题目和答案，不要改变核心知识点和考察维度。

【原题】
${draft.questionText}

【原答案】
${draft.referenceAnswer}

【审查问题】
深度问题：${reviewResult.depthIssues.join("；") || "无"}
正确性问题：${reviewResult.correctnessIssues.join("；") || "无"}
清晰性问题：${reviewResult.clarityIssues.join("；") || "无"}
修复要求：${reviewResult.repairInstructions}

${ruleContext.reviewBlock}
${buildMathV2QuestionStructureReviewRule(singleQuestion)}
${buildNumericAnswerReviewRule(numericAnswerOnly)}
${buildMathHardClosureReviewRule(hardClosurePlan)}

修复硬性要求：
1. 补足条件、定义域和唯一性约束。
2. 修复证明链或计算链，保留必要回代检验。
3. 若题目过于模板化，按规则块中的反模板策略增加真实判断分叉，但不得引入无用复杂度。
4. 输出完整新题和完整新答案。
5. ${singleQuestion ? "修复后仍必须是单问，不能为了补深度拆成 (1)(2) 或第一问/第二问。" : "修复后最多 2 问；若保留 2 问，必须把第 1 问改成第 2 问的必要主硬闭合前提，否则压回单问。"}
6. coreData 必须记录题面中的核心数学对象，允许非数值 value；kind 只能是 function、set、condition、equation、parameter、object。
7. ${numericAnswerOnly ? "修复后最终答案必须是数值解或表达式，禁止保留证明题和叙述题。" : "修复后答案形态按题目自然闭合需要确定。"}

输出严格 JSON，不含 markdown，字段与输入 draft 一致：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "mathDiscipline": "${draft.mathDiscipline || ""}",
  "chosenDimension": "${draft.chosenDimension}",
  "questionText": "修复后的完整题干",
  "coreData": {
    "函数或对象名": {"kind": "function", "value": "题面给出的函数、集合、条件或方程", "unit": "数学对象"}
  },
  "requiredAnswer": "最终答案形式",
  "referenceAnswer": "修复后的完整标准答案",
  "referenceSteps": ["步骤1"],
  "difficultyRationale": "难度说明",
  "expectedWrongPath": "自然错误熟路",
  "closureChecklist": ["检查项"],
  "hardClosurePlan": {
    "targetFailureMode": "${hardClosurePlan.targetFailureMode}",
    "mainHardClosurePoint": "${hardClosurePlan.mainHardClosurePoint}",
    "auxiliaryClosurePoints": ${JSON.stringify(hardClosurePlan.auxiliaryClosurePoints)},
    "invalidShortcut": "${hardClosurePlan.invalidShortcut}"
  }
}`;

    const raw = (await callMathLLM("v2_a3_repair", trackerId, prompt, {
        model: "reasoning",
        temperature: 0.25,
        responseFormat: "json",
        systemPrompt: "你是数学题修复专家，只输出严格 JSON。",
        reasoning: { effort: "high", summary: "auto" },
    })).trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return draft;

    try {
        return normalizeDraft(cleanAndParseJSON(jsonMatch[0]) as Partial<V2QuestionDraft>, draft);
    } catch {
        return draft;
    }
}

function getDegradationLevel(reviewResult: ReviewResult, repairCycles: number): ReviewedDraft["degradationLevel"] {
    if (reviewResult.passed && repairCycles === 0) return "stable";
    if (reviewResult.passed) return "minor";
    return "major";
}

export async function reviewAndRepair(
    draft: V2QuestionDraft,
    trackerId: MathTokenTrackerId = "math-v2",
    singleQuestion: boolean = false,
    numericAnswerOnly: boolean = false
): Promise<ReviewedDraft> {
    let currentDraft = draft;
    let reviewResult = await reviewDraft(currentDraft, trackerId, singleQuestion, numericAnswerOnly);
    let repairCycles = 0;

    while (!reviewResult.passed && repairCycles < 2) {
        currentDraft = await repairDraft(currentDraft, reviewResult, trackerId, singleQuestion, numericAnswerOnly);
        repairCycles += 1;
        reviewResult = await reviewDraft(currentDraft, trackerId, singleQuestion, numericAnswerOnly);
    }

    const degradationLevel = getDegradationLevel(reviewResult, repairCycles);
    const allIssues = [
        ...reviewResult.depthIssues,
        ...reviewResult.correctnessIssues,
        ...reviewResult.clarityIssues,
    ];

    return {
        draft: currentDraft,
        reviewResult,
        repairCycles,
        degradationLevel,
        degradationReason: reviewResult.passed ? "" : allIssues.join("；") || reviewResult.overallVerdict,
    };
}
