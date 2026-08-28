import { callLLM } from "../../../llmClient";
import { BaseProblem, TrapModification, TrapType } from "../../../../types/multiNodeTypes";

/**
 * Finance: Trap Master (Consolidated)
 */

export async function applyTraps(
    baseProblem: BaseProblem,
    trapCount: number
): Promise<TrapModification[]> {
    if (trapCount === 0) return [];

    const availableTraps = [
        '- 折现口径错配陷阱 (DISCOUNT_RATE_MISMATCH)：让现金流口径（FCFF/FCFE、名义/实际、税前/税后）与题面给出的多个折现率之间存在诱导性错配，正确解必须先判定口径再选率。',
        '- 复利与天数惯例陷阱 (COMPOUNDING_CONVENTION)：同一题中并存年化连续复利、半年复利报价与不同天数惯例（ACT/360 vs ACT/365），直接代入会系统性偏差。',
        '- 测度与计价单位混淆陷阱 (MEASURE_CHANGE_CONFUSION)：同时给出真实世界期望收益 μ 与无风险利率 r，或给出远期测度下的数据却要求风险中性测度下的期望，诱导用错漂移或错计价单位。',
        '- 波动率层次混淆陷阱 (VOLATILITY_LAYER_CONFUSION)：混合给出隐含波动率、局部波动率与瞬时波动率/已实现波动率，诱导直接把某一层当作 Black-Scholes 输入。',
        '- 重尾矩不存在陷阱 (TAIL_MOMENT_NONEXISTENCE)：给出形状参数使方差（或均值）不存在的重尾分布，诱导求标准差型风险度量。',
        '- 会计政策可比性陷阱 (ACCOUNTING_POLICY_COMPARABILITY)：给出两家公司口径不同（资本化 vs 费用化、租赁处理、存货计价）的报表数据，诱导直接横向对比比率。',
        '- 汇率标价方向陷阱 (QUOTATION_DIRECTION)：混用直接标价与间接标价、基准货币与报价货币，诱导把利率平价公式的分子分母写反。',
        '- 内生性与识别假设陷阱 (ENDOGENEITY_IDENTIFICATION)：提供看似可用的回归结果与工具变量，但识别假设被题面条件破坏，诱导直接做因果解读。',
        '- 杠杆路径依赖陷阱 (LEVERAGE_PATH_DEPENDENCE)：让资本结构在预测期内显著变化，诱导使用单一固定 WACC 折现全部期间。'
    ];

    const trapsToApply = availableTraps.slice(0, trapCount).join('\n');

    const prompt = `
你是量化金融领域的博士后级别命题专家，专精"陷阱设计"。给定一道标准量化金融"白板题"，你需要一次性为其添加多个维度的陷阱。

【原题信息】：
题目：${baseProblem.originalProblemText}
情境：${baseProblem.scenario}
已知核心数据：${JSON.stringify(baseProblem.coreData, null, 2)}
${baseProblem.marketConventions ? `市场约定：${JSON.stringify(baseProblem.marketConventions, null, 2)}` : ''}

【任务】：
在保证题目**依然有唯一正确解**的前提下，注入 ${trapCount} 个陷阱：
${trapsToApply}

【修改规则】：
1. **彻底拒绝生硬的情境转折**：陷阱必须通过冷峻、专业的参数与条款描述自然融入，读起来像真实的交易确认书、募集说明书或研究报告。
2. **陷阱手法多样性（极重要）**：严格禁止每题都用"多给一个折现率"这一招！根据题目背景选择不同手法：
   - 交易台实务：用"经纪商双边报价""不同期限的隐含波动率报价""结算日惯例"等
   - 投行项目执行：用"管理层预测口径""可比公司会计政策差异""过桥融资条款"等
   - 监管与合规审查：用"监管资本口径与内部模型口径并列""压力情景参数"等
   - 学术前沿研究：用"样本期结构断点""不同估计量并列报告"等
   - 纯理论推导：通过"测度与计价单位表述模糊"实现，不添加额外市场数据
3. **数值一致性铁律**：修改复利约定或天数惯例时必须进行严格等价换算，绝对禁止只替换单位字符串而保持数值不变（例如把 5% 年复利直接改写成 5% 连续复利）。
4. 原有正确求解所需数据必须保留，且数值必须在修改后的题干文本中原样出现。
5. 干扰数据必须有迷惑性，但不得破坏无套利边界、会计恒等式或概率公理，也不得使题目变成无解或多解。

【事实纪律（强制执行）】：
1. 绝对禁止篡改市场标准定义（看跌看涨平价、远期定价公式、风险中性漂移为 r）
2. 参数必须留在可实现区间：σ > 0，概率与回收率 ∈ [0,1]，ρ ∈ [−1,1]，λ > 0
3. 不得同时声明"风险中性定价"又要求用真实世界收益率折现（除非该矛盾本身即为待识别陷阱，且正确解能唯一判定）
4. 三张财务报表必须保持联动自洽，资产 = 负债 + 所有者权益
5. 修改后题干必须保证数据完整性：解出正确答案所需的一切参数都能从题面读到

【输出格式】（JSON数组）：
[
  {
    "trapType": "DISCOUNT_RATE_MISMATCH/COMPOUNDING_CONVENTION/MEASURE_CHANGE_CONFUSION/VOLATILITY_LAYER_CONFUSION/TAIL_MOMENT_NONEXISTENCE/ACCOUNTING_POLICY_COMPARABILITY/QUOTATION_DIRECTION/ENDOGENEITY_IDENTIFICATION/LEVERAGE_PATH_DEPENDENCE",
    "agentId": "trap_master",
    "trapModifiedText": "完整修改后的题目文本（包含所有核心数据和干扰数据）",
    "distractorData": { "干扰参数1": {"value": 123, "unit": "单位"} },
    "trapDescription": "陷阱设计原理",
    "expectedConfusion": "解题者可能产生的误判与错误路径"
  }
]

【特别注意】：在**第一个对象**中提供最终合并所有文本修改后的 trapModifiedText，后续对象保持一致或留空。
`;

    try {
        const cleanContent = (await callLLM(prompt, {
            model: 'reasoning',
            temperature: 0.4,
            systemPrompt: "你是综合陷阱设计大师，专注于将多个陷阱融合进量化金融计算题中。只返回 JSON 数组。"
        })).replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const parsed = JSON.parse(cleanContent) as TrapModification[];
        return normalizeTrapTypes(parsed);

    } catch (error) {
        console.error("Finance Trap Master Error:", error);
        throw new Error(`Trap Master failed: ${error.message}`);
    }
}

/**
 * LLM 返回的 trapType 可能是小写别名或自由文本，统一映射到 TrapType 枚举，
 * 无法识别时退化为通用的 FORMULA_APPLICABILITY，避免下游 metadata 出现脏值。
 */
const TRAP_TYPE_ALIASES: Record<string, TrapType> = {
    discount: TrapType.DISCOUNT_RATE_MISMATCH,
    discount_rate_mismatch: TrapType.DISCOUNT_RATE_MISMATCH,
    compounding: TrapType.COMPOUNDING_CONVENTION,
    compounding_convention: TrapType.COMPOUNDING_CONVENTION,
    measure: TrapType.MEASURE_CHANGE_CONFUSION,
    measure_change_confusion: TrapType.MEASURE_CHANGE_CONFUSION,
    volatility: TrapType.VOLATILITY_LAYER_CONFUSION,
    volatility_layer_confusion: TrapType.VOLATILITY_LAYER_CONFUSION,
    tail: TrapType.TAIL_MOMENT_NONEXISTENCE,
    tail_moment_nonexistence: TrapType.TAIL_MOMENT_NONEXISTENCE,
    accounting: TrapType.ACCOUNTING_POLICY_COMPARABILITY,
    accounting_policy_comparability: TrapType.ACCOUNTING_POLICY_COMPARABILITY,
    quotation: TrapType.QUOTATION_DIRECTION,
    quotation_direction: TrapType.QUOTATION_DIRECTION,
    endogeneity: TrapType.ENDOGENEITY_IDENTIFICATION,
    endogeneity_identification: TrapType.ENDOGENEITY_IDENTIFICATION,
    leverage: TrapType.LEVERAGE_PATH_DEPENDENCE,
    leverage_path_dependence: TrapType.LEVERAGE_PATH_DEPENDENCE,
    unit: TrapType.UNIT_DIMENSION,
    unit_dimension: TrapType.UNIT_DIMENSION,
    formula: TrapType.FORMULA_APPLICABILITY,
    formula_applicability: TrapType.FORMULA_APPLICABILITY,
    process: TrapType.PROCESS_DETERMINATION,
    process_determination: TrapType.PROCESS_DETERMINATION
};

function normalizeTrapTypes(modifications: TrapModification[]): TrapModification[] {
    return modifications.map(mod => {
        const raw = String(mod.trapType ?? '').trim();
        if ((Object.values(TrapType) as string[]).includes(raw)) {
            return mod;
        }
        const key = raw.toLowerCase().replace(/[\s-]+/g, '_');
        return { ...mod, trapType: TRAP_TYPE_ALIASES[key] ?? TrapType.FORMULA_APPLICABILITY };
    });
}
