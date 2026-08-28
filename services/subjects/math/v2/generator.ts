import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { callMathLLM } from "../mathLlmTracker";
import type { MathTokenTrackerId } from "../tokenTracker";
import type { KPAnalysisResult } from "./kp-analyzer";
import { buildMathV2RuleContext } from "./rule-context";
import type { CoreDataRecord } from "../../../../types/multiNodeTypes";
import { buildNumericAnswerGenerationRule } from "./numeric-answer-option";
import {
    buildMathHardClosureGenerationRule,
    normalizeHardClosurePlan,
    type MathHardClosurePlan,
} from "./hard-closure";
import { buildMathV2QuestionStructureGenerationRule } from "./question-structure";

export interface V2QuestionDraft {
    problemId: string;
    knowledgePoint: string;
    chosenDimension: string;
    questionText: string;
    coreData: CoreDataRecord;
    requiredAnswer: string;
    referenceAnswer: string;
    referenceSteps: string[];
    mathDiscipline?: string;
    difficultyRationale?: string;
    expectedWrongPath?: string;
    closureChecklist?: string[];
    hardClosurePlan?: MathHardClosurePlan;
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

function normalizeDraft(parsed: Partial<V2QuestionDraft>, kpAnalysis: KPAnalysisResult, chosenDimension: string): V2QuestionDraft {
    return {
        problemId: String(parsed.problemId || `math_v2_${Date.now().toString(36)}`),
        knowledgePoint: String(parsed.knowledgePoint || kpAnalysis.knowledgePoint),
        chosenDimension: String(parsed.chosenDimension || chosenDimension),
        questionText: String(parsed.questionText || ""),
        coreData: parsed.coreData && typeof parsed.coreData === "object" ? parsed.coreData : {},
        requiredAnswer: String(parsed.requiredAnswer || ""),
        referenceAnswer: String(parsed.referenceAnswer || ""),
        referenceSteps: normalizeStringArray(parsed.referenceSteps),
        mathDiscipline: String(parsed.mathDiscipline || kpAnalysis.mathDiscipline),
        difficultyRationale: String(parsed.difficultyRationale || kpAnalysis.suggestedDifficulty),
        expectedWrongPath: String(parsed.expectedWrongPath || kpAnalysis.commonWrongPaths[0] || ""),
        closureChecklist: normalizeStringArray(parsed.closureChecklist).length
            ? normalizeStringArray(parsed.closureChecklist)
            : kpAnalysis.closureChecklist,
        hardClosurePlan: normalizeHardClosurePlan(parsed.hardClosurePlan || kpAnalysis.hardClosurePlan),
    };
}

export async function generateQuestionWithAnswer(
    kpAnalysis: KPAnalysisResult,
    dimensionIndex: number,
    language: string = "zh-CN",
    singleQuestion: boolean = false,
    numericAnswerOnly: boolean = false,
    trackerId: MathTokenTrackerId = "math-v2"
): Promise<V2QuestionDraft> {
    const dimensions = kpAnalysis.testDimensions.length ? kpAnalysis.testDimensions : [kpAnalysis.knowledgePoint];
    const chosenDimension = dimensions[dimensionIndex % dimensions.length];
    const ruleContext = buildMathV2RuleContext(kpAnalysis.knowledgePoint);
    const hardClosurePlan = normalizeHardClosurePlan(kpAnalysis.hardClosurePlan);
    const prompt = `你是数学 V2 命题器。请基于 A0 规划生成一道高质量数学题和标准答案。

【知识点】${kpAnalysis.knowledgePoint}
【数学分支】${kpAnalysis.mathDiscipline}
【选定维度】${chosenDimension}
【难度定位】${kpAnalysis.suggestedDifficulty}
【必须避开】${kpAnalysis.coreConceptsToAvoid.join("；") || "单步套公式、模板题"}
【自然错误熟路】${kpAnalysis.commonWrongPaths.join("；") || "忽略条件或定义域"}
【闭合检查】${kpAnalysis.closureChecklist.join("；") || "条件充分、答案唯一、证明闭合"}
【语言】${language}
【题型】${singleQuestion ? "单问，不拆小问" : "最多 2 问，且两问必须形成主硬闭合点依赖"}
${buildNumericAnswerGenerationRule(numericAnswerOnly)}
${buildMathV2QuestionStructureGenerationRule(singleQuestion)}
${buildMathHardClosureGenerationRule(hardClosurePlan)}

${ruleContext.generationBlock}

硬性要求：
1. 题干必须自足，不依赖图像、外部表格或未声明定理。
2. 条件必须充分，答案必须唯一；若有参数，必须明确范围。
3. 不能是标准模板题或单步代入题；必须落实规则块中的反模板策略，且至少有一个判断分叉或表示转换。
4. 标准答案必须逐步说明关键推理、定义域/边界检查、参数约束核查和最终回顾检验。
5. 不要引入无用参数；不要为了复杂而复杂。
6. coreData 必须记录题面中的核心数学对象，允许非数值 value；kind 只能是 function、set、condition、equation、parameter、object。
7. ${singleQuestion ? "必须只有一个求解目标，禁止出现 (1)(2)、（1）（2）、第一问/第二问等多小问结构。" : "最多 2 问；若为 2 问，第 1 问必须产出第 2 问不可跳过的主硬闭合点，不得拆成并列任务。"}
8. ${numericAnswerOnly ? "最终答案必须是数值解或表达式，禁止证明题和叙述题。" : "最终答案形态按题目自然闭合需要确定。"}

输出严格 JSON，不含 markdown：
{
  "problemId": "math_v2_xxx",
  "knowledgePoint": "${kpAnalysis.knowledgePoint}",
  "mathDiscipline": "${kpAnalysis.mathDiscipline}",
  "chosenDimension": "${chosenDimension}",
  "questionText": "完整题干",
  "coreData": {
    "函数或对象名": {"kind": "function", "value": "题面给出的函数、集合、条件或方程", "unit": "数学对象"}
  },
  "requiredAnswer": "要求输出的最终形式",
  "referenceAnswer": "完整标准答案",
  "referenceSteps": ["步骤1", "步骤2"],
  "difficultyRationale": "为什么不是模板题",
  "expectedWrongPath": "自然但错误的熟路",
  "closureChecklist": ["检查项"],
  "hardClosurePlan": {
    "targetFailureMode": "${hardClosurePlan.targetFailureMode}",
    "mainHardClosurePoint": "${hardClosurePlan.mainHardClosurePoint}",
    "auxiliaryClosurePoints": ${JSON.stringify(hardClosurePlan.auxiliaryClosurePoints)},
    "invalidShortcut": "${hardClosurePlan.invalidShortcut}"
  }
}`;

    const raw = (await callMathLLM("v2_a1_generate", trackerId, prompt, {
        model: "reasoning",
        temperature: 0.45,
        responseFormat: "json",
        systemPrompt: "你是数学命题专家，只输出严格 JSON。",
        reasoning: { effort: "high", summary: "auto" },
    })).trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return normalizeDraft({}, kpAnalysis, chosenDimension);
    }

    try {
        return normalizeDraft(cleanAndParseJSON(jsonMatch[0]) as Partial<V2QuestionDraft>, kpAnalysis, chosenDimension);
    } catch {
        return normalizeDraft({}, kpAnalysis, chosenDimension);
    }
}
