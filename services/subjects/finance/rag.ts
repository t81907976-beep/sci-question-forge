import type { TextbookConstraints, UserInput } from "../../../types/multiNodeTypes";

/**
 * Finance: Textbook / Market-Convention Constraints (Node 1)
 *
 * 与化学版 node1-rag 同构，但术语、符号、单位全部替换为量化金融口径。
 */

export function getFinanceTextbookConstraints(input: UserInput): TextbookConstraints {
    return {
        terminology: getStandardTerminology(input.topic),
        standardNotations: getStandardNotations(),
        forbiddenExpressions: getForbiddenExpressions(),
        requiredUnits: getRequiredUnits(input.topic)
    };
}

function getStandardTerminology(topic: string): string[] {
    const commonTerms = [
        '无套利', '风险中性测度', '计价单位', '折现因子', '远期价格',
        '隐含波动率', '久期', '凸性', '资本成本', '自由现金流'
    ];

    const topicTerms: Record<string, string[]> = {
        '期权定价': ['风险中性概率', '复制组合', 'Delta 对冲', '局部波动率'],
        '利率期限结构': ['即期利率', '远期利率', 'OIS 折现曲线', '互换利率'],
        '信用衍生品': ['危险率', '违约强度', '回收率', '信用价差'],
        '企业估值': ['WACC', 'FCFF', 'FCFE', '终值增长率'],
        '时间序列': ['单位根', '协整', '条件异方差', '脉冲响应'],
        '因果推断': ['工具变量', '双重差分', '平行趋势', '识别假设'],
        '寿险精算': ['生存函数', '死力', '准备金', 'Thiele 微分方程'],
        '非寿险精算': ['索赔频率', '索赔强度', '信度因子', '进展三角'],
        '风险度量': ['VaR', 'TVaR', '一致性风险度量', '次可加性'],
        '汇率': ['利率平价', '基准货币', '标价方向', '交叉货币基差']
    };

    return [...commonTerms, ...(topicTerms[topic] || [])];
}

function getStandardNotations(): Record<string, string> {
    return {
        '无风险利率': 'r (单位: 年化小数, 需注明复利约定)',
        '波动率': 'σ (单位: 年化小数)',
        '标的价格': 'S 或 S₀',
        '执行价格': 'K',
        '到期期限': 'T (单位: 年)',
        '折现因子': 'P(0,T) 或 D(0,T)',
        '远期价格': 'F(0,T)',
        '风险中性测度': 'ℚ (测度需显式标注)',
        '危险率': 'λ (单位: 年化)',
        '资本成本': 'WACC 或 k_e / k_d',
        '现金流': 'CF_t (需注明名义/实际口径)'
    };
}

function getForbiddenExpressions(): string[] {
    return [
        '随便', '大概', '可能', '也许',
        '差不多', '基本上', '一般来说',
        // 金融计量语境中禁止的模糊表述
        '大致折现', '约等于市场价'
    ];
}

function getRequiredUnits(topic: string): string[] {
    const baseUnits = ['%', 'bp', '年', '万元', '百万美元', '手'];

    const topicUnits: Record<string, string[]> = {
        '期权定价': ['%', '年', '元/股'],
        '利率期限结构': ['bp', '%', '年'],
        '企业估值': ['百万元', '%', '倍'],
        '风险度量': ['%', '万元', '天'],
        '寿险精算': ['元', '年', '‰']
    };

    return [...baseUnits, ...(topicUnits[topic] || [])];
}

/**
 * Generate a prompt suffix that enforces market-convention constraints
 */
export function getFinancePromptConstraints(constraints: TextbookConstraints): string {
    return `
【金融规范要求】：
1. 必须使用以下标准术语：${constraints.terminology.slice(0, 5).join('、')}等
2. 符号表示遵循：${Object.entries(constraints.standardNotations).slice(0, 3).map(([k, v]) => `${k}用${v}`).join('；')}
3. 禁止使用非正式表述：${constraints.forbiddenExpressions.join('、')}
4. 单位与计量口径必须规范：${constraints.requiredUnits.slice(0, 5).join('、')}
5. 所有利率、波动率必须显式标注年化基准与复利/天数约定，绝对不得出现口径不明的数字
6. 所有数据必须落在市场可实现的合理区间内，不得臆造违反无套利边界的数值
`;
}
