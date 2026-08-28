import { callLLM } from "../../llmClient";
import type { BaseProblem, UserInput, TextbookConstraints } from "../../../types/multiNodeTypes";
import { getFinancePromptConstraints } from "./rag";
import { getDisciplineGuidance } from "./disciplines";
import { cleanAndParseJSON, validateAndFixProblemJSON } from "../../utils/jsonCleaner";

/**
 * Finance: Base Problem Generator
 */

export async function generateBaseProblem(
    input: UserInput,
    constraints: TextbookConstraints,
    problemNumber: number,
    allowedAngles: string[] = [],
    usedAngles: string[] = []
): Promise<BaseProblem> {
    const topicDisciplineGuidance = getDisciplineGuidance(input.topic);

    const backgrounds = ["交易台实务", "投行项目执行", "监管与合规审查", "学术前沿研究", "纯理论推导"];
    const randomBackground = backgrounds[(problemNumber - 1) % backgrounds.length];

    const prompt = `
你是量化金融领域的博士后级别专家，长期从事衍生品定价、金融计量与精算建模研究，并负责 CFA/FRM/精算师级别命题。请生成一道以【${randomBackground}】为背景的高质量量化金融计算题。

【重要】：这是一道"白板题"，必须：
1. 题目清晰明确，无陷阱
2. 所有条件充分且必要
3. 有唯一正确解
4. 体现真实的${randomBackground}场景

【主题】：${input.topic}
${input.trapCount > 0 ? `【陷阱数预期】：${input.trapCount}\n` : ''}【是否允许查表】：${input.allowTableLookup ? '是（可使用标准正态分布表、生命表、临界值表）' : '否'}

${getFinancePromptConstraints(constraints)}

【事实纪律（强制执行）】：
1. 绝对禁止篡改市场标准约定与定义：
   - 连续复利折现: D(0,T) = e^(−rT)；离散年复利折现: D(0,T) = (1+r)^(−T)，两者不可混用
   - 天数惯例必须显式声明: ACT/360、ACT/365、30/360 三者计息结果不同
   - 看跌看涨平价（无股息欧式）: C − P = S₀ − K·e^(−rT)
   - 远期价格（无收益标的）: F(0,T) = S₀·e^(rT)
   - 风险中性测度 ℚ 下的漂移必须是 r（或 r − q），绝不是真实世界期望收益 μ

2. 参数必须落在市场可实现区间：
   - 年化波动率 σ ∈ (0, 200%]，且不得为负
   - 概率、回收率、信度因子 ∈ [0, 1]
   - 相关系数 ρ ∈ [−1, 1]
   - 危险率 λ > 0；死亡率 q_x ∈ (0, 1)
   - 名义利率可为负（如欧元/日元环境），但必须显式说明该市场环境

3. 无套利边界必须严格自洽：
   - 欧式看涨价格必须满足 max(S₀ − K·e^(−rT), 0) ≤ C ≤ S₀
   - 美式期权价格 ≥ 同参数欧式期权价格
   - **核心禁止**：折现率口径与现金流口径错配（FCFF 必须配 WACC，FCFE 必须配 k_e；名义现金流必须配名义折现率）
   - **核心禁止**：同一题中既声明"风险中性定价"又用真实世界收益率折现

4. 会计与财务恒等式必须成立：
   - 资产 = 负债 + 所有者权益；三表必须联动自洽
   - 现金流量表期末现金必须等于资产负债表现金余额

5. 统计与计量前提必须可行：
   - 声称"重尾分布方差不存在"时，Pareto 形状参数必须 α ≤ 2
   - 使用 t 检验/渐近正态时，样本量与识别假设必须与结论一致
   - 单位根检验的原假设方向（ADF 为存在单位根、KPSS 为平稳）不得写反

【逻辑深度要求】：
${input.singleQuestion ? `⚠️ 【强制单问】：题目必须只有一个问题，只有一个求解目标。\n\n` : ''}- 题目应有合理的推理深度，考察学科核心概念的深层理解。
- 采用 CFA III/FRM II、精算师资格考试或金融工程博士课程的思维水平，要求多步推理。
- 题目应包含多步逻辑推演（至少 4-6 个独立步骤）。
- ⚠️ **铁律**：当难度要求与金融自洽性（无套利、口径一致、会计恒等）冲突时，必须优先保证金融自洽性。

【题型角度规则（严格执行）】：
${allowedAngles.length > 0
        ? `合法考法范围：${allowedAngles.join('、')}\n已用角度：${usedAngles.length > 0 ? usedAngles.join('、') : '无'}\n请选择一个尚未使用的角度出题；若所有角度已用，允许复用但必须更换情境与数值。`
        : '请从该主题挖掘最深度且尽量多样化的考法角度。'
    }

【逻辑深度与学科特征】：
${topicDisciplineGuidance}

【输出要求】：
请返回一个 JSON 对象，包含以下字段：
{
  "problemId": "base_${problemNumber}_${Date.now()}",
  "questionAngle": "本题核心考法关键词（2-5个字）",
  "topic": "${input.topic}",
  "scenario": "真实场景描述（1-2句话）",
  "originalProblemText": "完整的带数据文字的原始题干（200-300字）",
  "coreData": {
    "参数名称1": {"value": 数值, "unit": "单位"}
  },
  "marketConventions": {
    "复利约定": "连续复利 / 年复利 / 半年复利",
    "天数惯例": "ACT/365 等",
    "标价方向或结算约定": "如需要则填写，否则可省略"
  },
  "requiredAnswer": "求解目标${input.singleQuestion ? '，必须只有一个求解目标' : ''}",
  "referenceSteps": ["步骤1", "步骤2", "...（至少6步）"]
}

【coreData 硬性约束】：
- 所有可量化的市场参数（价格、利率、波动率、期限、现金流、死亡率等）必须以 {"value": 数值, "unit": "单位"} 形式放入 coreData，且数值必须在题干文本中原样出现。
- 纯文字型条款（如"季度重置""行权仅在到期日"）放入 marketConventions，不要放进 coreData。
`;

    try {
        const cleanContent = (await callLLM(prompt, { model: 'reasoning', temperature: 0.3 }))
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const baseProblem: BaseProblem = cleanAndParseJSON(cleanContent);
        const fixedProblem = validateAndFixProblemJSON(baseProblem);

        if (!fixedProblem.originalProblemText || !fixedProblem.coreData || !fixedProblem.referenceSteps) {
            throw new Error('Generated problem is incomplete: missing text, data, or steps.');
        }
        if (fixedProblem.referenceSteps.length < 3) {
            throw new Error('Reference solution path too short (minimum 3 steps required)');
        }

        return fixedProblem;

    } catch (error) {
        console.error("Finance Generator Error:", error);
        throw new Error(`Failed to generate base problem: ${error.message}`);
    }
}
