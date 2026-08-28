import { cleanJsonString } from "../../llmClient";
import { callMathLLM } from "./mathLlmTracker";
import type { MathTokenTrackerId } from "./tokenTracker";
import { getMathDifficultyLevel, getMathMinimumReasoningSteps } from "../../nodes/node2-base-generator-math";
import type { FinalProblem } from "../../../types/multiNodeTypes";
import {
    mapReviewFailureToRetryNode,
    normalizeReviewResult,
    type ReviewResult
} from "./reviewer-normalizer";
import { requireMathReviewMetadata } from "./reviewer-metadata";

export { mapReviewFailureToRetryNode };

/**
 * Math Question Reviewer
 *
 * Reviews math questions from three dimensions:
 * - Validity: Mathematical correctness, consistency, uniqueness
 * - Difficulty: Competition-level, step complexity, concept depth
 * - Depth: Branching conditions, implicit constraints, non-template
 */

export async function reviewMathQuestion(
    problem: FinalProblem,
    problemIndex: number,
    tokenTrackerId: MathTokenTrackerId
): Promise<ReviewResult> {
    const difficultyMatch = problem.difficulty?.match(/难度:\s*(\d+)/);
    const difficulty = difficultyMatch ? parseInt(difficultyMatch[1]) : 2;
    const difficultyLevel = getMathDifficultyLevel(difficulty);
    const minReasoningSteps = getMathMinimumReasoningSteps(difficulty);
    const metadata = requireMathReviewMetadata(problem.metadata);

    const prompt = `你是数学题目人工验证准备度审核专家。当前流程不直接调用外部解题模型，你无法判断解题模型是否真的会错。你的任务是判断这道数学题是否已经适合转人工验证。

【题目】：
${problem.mergedProblemText || problem.questionBody}

【解答】：
${problem.standardSafeSolution}

【难度与步数硬性要求】：
- 当前难度：${difficultyLevel}（难度值 ${difficulty}）
- 标准答案 reasoningChain 至少需要 ${minReasoningSteps} 个完整推理步骤。
- 每一步必须包含实际推导、计算、等价变形、枚举或验证过程，不能把一句提纲当作一步。
- too_easy 的含义是“不符合当前 discipline 层级或边界卡要求”，不是“不够硕博”。
- 如果解答少于 ${minReasoningSteps} 步、不符合 ${difficultyLevel} 层级，或通过拆分提纲凑步数，必须 passed=false，failureType="too_easy"，并在 difficultyIssues 中明确指出具体原因。

【学科上下文与最终验证规则】：
${JSON.stringify({
        disciplineKey: metadata.disciplineKey,
        disciplineName: metadata.disciplineName,
        difficultyLevel: metadata.difficultyLevel,
        validationRules: metadata.validationRules
    }, null, 2)}

【人工验证元数据】：
${JSON.stringify({
        perturbationType: metadata.perturbationType,
        predictedFailureMode: metadata.predictedFailureMode,
        expectedWrongPath: metadata.expectedWrongPath,
        divergenceStep: metadata.divergenceStep,
        manualValidationChecklist: metadata.manualValidationChecklist
    }, null, 2)}

【审查维度 1 - 题目有效性】：
- 题目是否以用户提供的主题 ${problem.topic} 为核心？
- 题目条件是否自洽、充分、无歧义？
- 是否唯一可解，且答案不是由缺条件、多解或表述模糊造成争议？
- 题面是否没有题外假设、未声明分支、未声明默认数域或默认正则性？
- 若含干扰条件，该条件是否可被严格弃用，而不是制造歧义？

【审查维度 2 - 标准答案可靠性】：
- 解答与题目是否对应（未对任何题目条件进行修改）？
- 解答是否完整，必要的分类讨论是否覆盖？
- 解答是否包含唯一确定的最终答案？
- 最终答案是否是闭式解或题面允许的明确表达？
- 解答中是否没有任何计算错误？
- 解答中是否没有任何关键跳步？
- 解答是否满足当前难度要求的最少 ${minReasoningSteps} 个完整推理步骤？
- 解答是否明确处理结构扰动引入的定义域、边界、条件弱化、参数退化、量词顺序或干扰条件？

【审查维度 3 - 人工验证准备度】：
- predictedFailureMode 是否清楚说明要测的能力弱点？
- expectedWrongPath 是否是一条自然但错误的熟题路线？
- divergenceStep 是否能让人工定位正确路线和错误路线的分叉点？
- manualValidationChecklist 是否足够具体，人工拿到解题模型回答后能快速判错？
- 扰动是否自然，不是靠堆高级术语、加长题面或制造坏题来让模型失败？

【结构化门禁】：
你必须额外输出 disciplineGate 和 perturbationGate。

disciplineGate 判定规则：
- disciplineMatched：题目核心对象必须属于 disciplineKey / disciplineName 对应方向。
- difficultyMatched：题目必须符合 difficultyLevel 描述和当前难度 ${difficultyLevel}。
- forbiddenQuestionTypeHit：若题目命中 validationRules.forbiddenQuestionTypes 中任一禁止题型，则为 true。
- forbiddenErrorHit：若题目或标准答案出现 validationRules.forbiddenErrors 中任一禁止错误，则为 true。
- parameterConstraintViolated：若最终题目或答案违反 validationRules.parameterConstraints 中任一参数/定义域/自洽约束，则为 true。

perturbationGate 判定规则：
- perturbationMatched：最终题必须真实体现 metadata.perturbationType 对应的扰动类型。
- expectedWrongPathNatural：expectedWrongPath 必须是自然但错误的熟路，不是坏题导致的错误。
- divergenceStepClear：divergenceStep 必须能定位正确路线与错误路线分叉点。
- checklistUsable：manualValidationChecklist 必须具体可执行，人工可据此判错。

输出必须是严格 JSON，不含 markdown 代码块：
{
  "passed": true 或 false,
  "qualityLabel": "manual_validation_ready | needs_rework | invalid",
  "failureType": "none | too_easy | template_problem | topic_mismatch | contradictory_conditions | unsolvable | non_unique_answer | solution_math_error | solution_incomplete | unclear_statement | format_issue",
  "retryFromNode": 2 或 5 或 6 或 7 或 null,
  "retryHint": {
    "promptPatch": "仅当需要 Node2 重试时填写，说明新题目必须如何避开旧模式",
    "solverInstruction": "仅当需要 Node5 重试时填写，说明解答必须重新核查的点",
    "formattingInstruction": "仅当需要 Node6 重试时填写，说明题面表述必须如何澄清",
    "outputInstruction": "仅当需要 Node7 重试时填写，说明最终对象格式问题",
    "avoidPattern": "上次题目需要避免的模式"
  },
  "queryIssues": ["题目合理性问题"],
  "responseIssues": ["解答合理性问题"],
  "difficultyIssues": ["难度合理性问题"],
  "disciplineGate": {
    "disciplineMatched": true 或 false,
    "difficultyMatched": true 或 false,
    "forbiddenQuestionTypeHit": true 或 false,
    "forbiddenErrorHit": true 或 false,
    "parameterConstraintViolated": true 或 false,
    "issues": ["领域、难度、禁止题型、禁止错误或参数约束问题"]
  },
  "perturbationGate": {
    "perturbationMatched": true 或 false,
    "expectedWrongPathNatural": true 或 false,
    "divergenceStepClear": true 或 false,
    "checklistUsable": true 或 false,
    "issues": ["扰动类型、错误路径、分叉点或人工检查清单问题"]
  },
  "overallVerdict": "一句话总结审查结论"
}

你只负责审查人工验证准备度、分类、路由，不得改写题目，不得给出修复后的题目，不得重新求解。

路由规则：
- too_easy/template_problem/topic_mismatch/contradictory_conditions/unsolvable/non_unique_answer -> retryFromNode=2
- too_easy 表示题目或解答不符合当前 discipline 层级、边界卡要求或最低步数要求；不要把它解释为“不够硕博”。
- solution_math_error/solution_incomplete -> retryFromNode=5
- unclear_statement -> retryFromNode=6
- format_issue -> retryFromNode=7

如果多个问题同时存在，选择最上游的根因：Node2 问题优先于 Node5，Node5 优先于 Node6，Node6 优先于 Node7。

质量标签规则：
- manual_validation_ready：题目、答案、扰动和人工 checklist 都可直接用于人工验证。
- needs_rework：题目基本可用，但扰动、错误路径或 checklist 不够清楚。
- invalid：题目或答案有硬伤。

注意：三个维度全部无问题才可 passed 为 true。审查结果为 false 时，三个维度均需明确说明是哪条不满足。`;

    const maxParseAttempts = 2;

    for (let attempt = 1; attempt <= maxParseAttempts; attempt++) {
        const raw = (await callMathLLM(`reviewer_${problemIndex}`, tokenTrackerId, prompt, {
            model: 'reasoning',
            temperature: 0.2,
            reasoning: { effort: 'xhigh', summary: 'auto' }
        })).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.warn(`[MathReviewer] JSON block missing, attempt ${attempt}/${maxParseAttempts}`);
            continue;
        }

        try {
            return normalizeReviewResult(
                JSON.parse(cleanJsonString(jsonMatch[0])) as Partial<ReviewResult>
            );
        } catch (e) {
            console.warn(`[MathReviewer] JSON parse failed, attempt ${attempt}/${maxParseAttempts}:`, e);
        }
    }

    return {
        passed: false,
        qualityLabel: 'invalid',
        failureType: 'review_parse_failed',
        retryFromNode: 'reviewer',
        retryHint: {
            outputInstruction: 'Reviewer returned invalid JSON twice; do not save this problem without a valid review.'
        },
        queryIssues: ['审查响应JSON解析失败'],
        responseIssues: [],
        difficultyIssues: [],
        overallVerdict: '审查响应JSON解析失败'
    };
}
