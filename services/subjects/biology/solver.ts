import { callLLM } from "../../llmClient";
import type { BaseProblem, FormattedSolution, BiologyProblemType } from "../../../types/multiNodeTypes";
import { cleanAndParseJSON } from "../../utils/jsonCleaner";

/**
 * Biology: Solver
 * 
 * 支持 5 种题型的求解
 */

// ─────────────────────────────────────────────────────────────────────────────
// 推理求解指导
// ─────────────────────────────────────────────────────────────────────────────
const REASONING_SOLVER_GUIDES: Record<string, string> = {
    'genetic-reasoning': `
【遗传推理求解路径】：
1. 判断显隐性（从 F1 或 F2 比例推断）
2. 判断遗传方式（常染色体 / 伴性 / 细胞质）
3. 推导亲本基因型
4. 计算后代概率（如有需要）`,
    
    'network-reasoning': `
【调控网络推理求解路径】：
1. 标注图中各边的符号（激活 → / 抑制 --|}）
2. 从扰动点开始图遍历
3. 识别 AND 门（多个输入汇聚）或 OR 门（任一输入激活）
4. 注意双重否定（负负得正）`,
    
    'threshold-reasoning': `
【阈值逻辑推理求解路径】：
1. 确认系统当前状态（激活态 / 静息态）
2. 确认阈值 θ_on 和 θ_off（如有迟滞）
3. 追踪信号历史轨迹
4. 判断是否越过阈值触发状态转换`,
    
    'structural-reasoning': `
【结构约束推理求解路径】：
1. 识别关键结构约束（序列特征、空间构象）
2. 分析突变/修饰对结构的影响
3. 推导功能变化
4. 排除不满足约束的候选`,
};

// ─────────────────────────────────────────────────────────────────────────────
// 主入口
// ─────────────────────────────────────────────────────────────────────────────
export async function solveAndFormatProblem(
    problem: BaseProblem,
    problemNumber: number
): Promise<FormattedSolution> {
    const isReasoning = problem.problemType && problem.problemType !== 'calculation';
    
    const prompt = isReasoning
        ? buildReasoningSolverPrompt(problem, problemNumber)
        : buildCalculationSolverPrompt(problem, problemNumber);

    try {
        const cleanContent = (await callLLM(prompt, { model: 'reasoning', temperature: 0.3 }))
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const solution: FormattedSolution = cleanAndParseJSON(cleanContent);

        // 验证必要字段
        if (!solution.reasoningChain || !solution.finalAnswer) {
            throw new Error('Generated solution is incomplete');
        }
        if (solution.reasoningChain.length < 3) {
            throw new Error('Solution chain too short (minimum 3 steps required)');
        }

        return solution;

    } catch (error) {
        console.error("Biology Solver Error:", error);
        throw new Error(`Failed to solve problem: ${error.message}`);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 推理题求解 prompt
// ─────────────────────────────────────────────────────────────────────────────
function buildReasoningSolverPrompt(problem: BaseProblem, problemNumber: number): string {
    const solverGuide = REASONING_SOLVER_GUIDES[problem.problemType || 'genetic-reasoning'] || '';
    const conditionsDisplay = problem.logicConditions
        ? Object.entries(problem.logicConditions).map(([k, v]) => `- ${k}：${v}`).join('\n')
        : '（无文字条件）';

    return `
你是生物学解题专家。请为以下生物学推理题提供标准解答。

【题目信息】：
主题：${problem.topic}
题型：${problem.problemType}
情境：${problem.scenario}

【题目描述】：
${problem.questionBody}

【已知条件】：
${conditionsDisplay}

【求解目标】：${problem.requiredAnswer}

${solverGuide}

【输出要求】：
请返回一个 JSON 对象，包含以下字段：
{
  "problemId": "${problem.problemId}",
  "reasoningChain": [
    {"stepNumber": 1, "description": "步骤描述", "justification": "推理依据"},
    {"stepNumber": 2, "description": "步骤描述", "justification": "推理依据"}
  ],
  "finalAnswer": "最终答案",
  "keyInsights": ["关键洞察1", "关键洞察2"],
  "sftAnswer": "完整的标准解题过程（客观陈述句，无思考过程语言）",
  "stepsReference": "步骤列表：每步一行"
}

【关键规则】：
- 每个推理步骤必须明确写出推理依据
- 最终答案必须唯一
- 步骤数至少 6 步
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 定量计算题求解 prompt
// ─────────────────────────────────────────────────────────────────────────────
function buildCalculationSolverPrompt(problem: BaseProblem, problemNumber: number): string {
    const givenDataDisplay = problem.givenData
        ? Object.entries(problem.givenData).map(([k, v]) => `- ${k}：${v.value} ${v.unit}`).join('\n')
        : '（无数据）';

    return `
你是生物学解题专家。请为以下生物学计算题提供标准解答。

【题目信息】：
主题：${problem.topic}
情境：${problem.scenario}

【题目描述】：
${problem.questionBody}

【已知数据】：
${givenDataDisplay}

【求解目标】：${problem.requiredAnswer}

【输出要求】：
请返回一个 JSON 对象，包含以下字段：
{
  "problemId": "${problem.problemId}",
  "reasoningChain": [
    {"stepNumber": 1, "description": "步骤描述（含公式）", "justification": "物理/生物学依据"},
    {"stepNumber": 2, "description": "步骤描述（含代入过程）", "justification": "计算过程"}
  ],
  "finalAnswer": "最终答案（含单位）",
  "keyInsights": ["关键洞察1", "关键洞察2"],
  "sftAnswer": "完整的标准解题过程（含公式、代入、中间量、最终答案）",
  "stepsReference": "步骤列表：每步一行"
}

【关键规则】：
- 每个计算步骤必须写出公式
- 中间量必须明确标注
- 最终答案必须带单位
- 步骤数至少 6 步
`;
}