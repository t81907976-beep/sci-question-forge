import type { TextbookConstraints, UserInput } from "../../types/multiNodeTypes";

/**
 * Node 1: RAG Knowledge Base (Simplified)
 * 
 * For MVP, this simulates a RAG system by providing textbook-style
 * constraints based on the topic. In a full implementation, this would
 * query a vector database of chemistry textbooks.
 */

export function getTextbookConstraints(input: UserInput): TextbookConstraints {
    // Simulate knowledge base lookup
    // In production, this would query embeddings from actual textbooks

    const baseConstraints: TextbookConstraints = {
        terminology: getStandardTerminology(input.topic),
        standardNotations: getStandardNotations(input.topic),
        forbiddenExpressions: getForbiddenExpressions(),
        requiredUnits: getRequiredUnits(input.topic)
    };

    return baseConstraints;
}

function getStandardTerminology(topic: string): string[] {
    // Chemistry-specific standard terms
    const commonTerms = [
        '摩尔质量', '物质的量', '反应热', '活化能', '平衡常数',
        '电离度', '溶解度', '浓度', '反应速率', '催化剂'
    ];

    // Topic-specific additions
    const topicTerms: Record<string, string[]> = {
        '化学平衡': ['平衡移动', '勒夏特列原理', '平衡常数表达式'],
        '氧化还原': ['氧化剂', '还原剂', '电极电势', '原电池'],
        '热化学': ['焓变', '熵变', '吉布斯自由能', '标准摩尔生成焓'],
        '反应动力学': ['速率常数', '反应级数', '半衰期', '阿仑尼乌斯方程']
    };

    return [...commonTerms, ...(topicTerms[topic] || [])];
}

function getStandardNotations(topic: string): Record<string, string> {
    return {
        '浓度': 'c 或 [X]',
        '物质的量': 'n',
        '摩尔质量': 'M',
        '体积': 'V',
        '温度': 'T (单位: K)',
        '压强': 'p (单位: Pa 或 kPa)',
        '焓变': 'ΔH',
        '熵变': 'ΔS',
        '吉布斯自由能变': 'ΔG',
        '平衡常数': 'K 或 Kc/Kp',
        '气体常数': 'R = 8.314 J/(mol·K)'
    };
}

function getForbiddenExpressions(): string[] {
    return [
        '随便', '大概', '可能', '也许',
        '差不多', '基本上', '一般来说',
        // Avoid casual language in scientific context
    ];
}

function getRequiredUnits(topic: string): string[] {
    const baseUnits = ['mol', 'L', 'K', 'Pa', 'J', 'kJ'];

    const topicUnits: Record<string, string[]> = {
        '化学平衡': ['mol/L', 'Pa', 'K'],
        '热化学': ['kJ/mol', 'J/(mol·K)'],
        '反应动力学': ['s', 'min', 'mol/(L·s)']
    };

    return [...baseUnits, ...(topicUnits[topic] || [])];
}

/**
 * Generate a prompt suffix that enforces textbook-style constraints
 */
export function getTextbookPromptConstraints(constraints: TextbookConstraints): string {
    return `
【教材规范要求】：
1. 必须使用以下标准术语：${constraints.terminology.slice(0, 5).join('、')}等
2. 符号表示遵循：${Object.entries(constraints.standardNotations).slice(0, 3).map(([k, v]) => `${k}用${v}`).join('；')}
3. 禁止使用非正式表述：${constraints.forbiddenExpressions.join('、')}
4. 单位必须规范：${constraints.requiredUnits.slice(0, 5).join('、')}
5. 所有数据必须符合物理意义，不得人为臆造不合理数值
`;
}
