import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { callMathLLM } from "../mathLlmTracker";
import type { MathTokenTrackerId } from "../tokenTracker";
import { buildMathV2RuleContext } from "./rule-context";
import { MATH_V2_L2_CATALOG } from "./l2-catalog.ts";
import { normalizeHardClosurePlan, type MathHardClosurePlan } from "./hard-closure";

export interface KPAnalysisResult {
    knowledgePoint: string;
    mathDiscipline: string;
    testDimensions: string[];
    coreConceptsToAvoid: string[];
    commonWrongPaths: string[];
    suggestedDifficulty: string;
    closureChecklist: string[];
    hardClosurePlan: MathHardClosurePlan;
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

function normalizeKPAnalysis(parsed: Partial<KPAnalysisResult>, fallbackKnowledgePoint: string): KPAnalysisResult {
    return {
        knowledgePoint: String(parsed.knowledgePoint || fallbackKnowledgePoint),
        mathDiscipline: String(parsed.mathDiscipline || "数学综合"),
        testDimensions: normalizeStringArray(parsed.testDimensions),
        coreConceptsToAvoid: normalizeStringArray(parsed.coreConceptsToAvoid),
        commonWrongPaths: normalizeStringArray(parsed.commonWrongPaths),
        suggestedDifficulty: String(parsed.suggestedDifficulty || "竞赛级非套路题，要求完整推理闭环"),
        closureChecklist: normalizeStringArray(parsed.closureChecklist),
        hardClosurePlan: normalizeHardClosurePlan(parsed.hardClosurePlan),
    };
}

export async function analyzeKnowledgePoint(
    knowledgePointName: string,
    trackerId: MathTokenTrackerId = "math-v2"
): Promise<KPAnalysisResult> {
    const disciplineNames = Object.values(MATH_V2_L2_CATALOG).map(discipline => discipline.name).join("、");
    const ruleContext = buildMathV2RuleContext(knowledgePointName);
    const prompt = `你是数学竞赛与高阶数学命题专家。知识点：「${knowledgePointName}」。

任务：为数学 V2 生题链路做 A0 规划。你必须把知识点转成可检验、可闭合、非套路的命题方向。

参考原则：
- Pólya：理解题意、制定计划、执行计划、回顾检验必须能在标准解中闭合。
- Schoenfeld：题目必须考察资源调用、启发式选择、过程控制，而不是单步模板。
- NCTM/NRC：重视推理证明、表达、表示转换、概念理解、程序流畅、策略能力与自检。

可选数学分支：${disciplineNames}

${ruleContext.generationBlock}

要求：
1. 给出 3-5 个具体考察维度，每个维度必须说明要考什么判断、证明或计算，不能只写知识名。
2. 列出 2-4 个必须避开的老套角度，如单步套公式、直接代入、标准模板证明。
3. 列出 2-4 个自然但错误的熟路，用于后续防御审查。
4. 给出难度定位，必须满足上述固定竞赛级规则，说明关键分叉和最容易错的闭环点。
5. 给出 3-5 条闭合检查项，覆盖条件充分性、答案唯一性、定义域、证明链、回代检验。
6. 给出数学硬闭合点设计：只选择 1 个主目标失败机制，配 1-2 个辅助闭合点。主硬闭合点必须是解题必经步骤，跳过它会得到错误答案或无法证明唯一性。禁止把多个失败机制无序堆叠。

输出严格 JSON，不含 markdown：
{
  "knowledgePoint": "${knowledgePointName}",
  "mathDiscipline": "分支名称",
  "testDimensions": ["维度1"],
  "coreConceptsToAvoid": ["避开项"],
  "commonWrongPaths": ["错误熟路"],
  "suggestedDifficulty": "难度定位",
  "closureChecklist": ["检查项"],
  "hardClosurePlan": {
    "targetFailureMode": "定义域遗漏/非等价变形/边界退化/唯一性误判/分支选择/归一化条件遗漏/量词顺序错误 中选一个",
    "mainHardClosurePoint": "本题唯一主硬闭合点，必须写成具体可验收的解题必经步骤",
    "auxiliaryClosurePoints": ["辅助闭合点1", "辅助闭合点2"],
    "invalidShortcut": "模型可能走的非法捷径"
  }
}`;

    const raw = (await callMathLLM("v2_a0_kp_analysis", trackerId, prompt, {
        model: "default",
        temperature: 0.5,
        responseFormat: "json",
        systemPrompt: "你是数学竞赛命题规划专家，只输出严格 JSON。",
    })).trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return normalizeKPAnalysis({}, knowledgePointName);
    }

    try {
        return normalizeKPAnalysis(cleanAndParseJSON(jsonMatch[0]) as Partial<KPAnalysisResult>, knowledgePointName);
    } catch {
        return normalizeKPAnalysis({}, knowledgePointName);
    }
}
