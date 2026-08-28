import { FINANCE_RULE_BANK, FinanceRule, FinanceRuleNode } from './finance-rule-bank';

export interface FinanceRuleMatchContext {
    node: FinanceRuleNode;
    knowledgePoint?: string;
    dimension?: string;
    questionText?: string;
    referenceAnswer?: string;
    extraText?: string;
    maxRules?: number;
}

export interface MatchedFinanceRule extends FinanceRule {
    score: number;
    matchedTerms: string[];
}

const NODE_RULE_LIMITS: Record<FinanceRuleNode, number> = {
    A0: 3,
    A1: 4,
    'A2/A3': 4,
    A4: 3,
    A5: 4,
};

const NODE_PROMPT_BUDGETS: Record<FinanceRuleNode, number> = {
    A0: 720,
    A1: 960,
    'A2/A3': 960,
    A4: 960,
    A5: 960,
};

const MAX_RULE_SNIPPET_CHARS = 220;

/** 通用学科词：仅命中该词的规则被视为"泛规则"，只在没有更具体规则时兜底。 */
const UNIVERSAL_TERM = '金融';

function normalize(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '');
}

function uniqueTerms(terms: string[]): string[] {
    return [...new Set(terms.filter(Boolean))];
}

/**
 * 知识点常以「一级分支/二级分支：具体知识点」形式传入，
 * 面包屑前缀会让路由规则被上级分支词误命中，故优先取冒号后的主体。
 */
function preferPrimaryText(text: string): string {
    const separators = [text.indexOf(':'), text.indexOf('：')].filter(index => index >= 0);
    if (separators.length === 0) return text;

    const separatorIndex = Math.min(...separators);
    const prefix = text.slice(0, separatorIndex);
    const primary = text.slice(separatorIndex + 1).trim();
    if (!primary) return text;

    const looksLikeBreadcrumb = prefix.includes('/') || prefix.includes('／');
    return looksLikeBreadcrumb ? primary : text;
}

/** 单字符希腊字母/符号在金融文本中过于常见，单独命中不构成证据。 */
const WEAK_STANDALONE_TERMS = new Set([
    'α', 'β', 'γ', 'δ', 'ρ', 'ν', 'σ', 'θ', 'λ', 'μ', 'τ', 'φ', 'χ',
    'g', 'r', 'z', 'q', 't', 'p', 'k', 'v',
]);

function isAsciiAlphaNumeric(char: string | undefined): boolean {
    return Boolean(char && /[a-z0-9]/.test(char));
}

/**
 * 金融缩写密集（IV / CIP / VaR / APV / OIS…），
 * 2-3 字母缩写必须做词边界匹配，否则 VaR 会命中 variance、IV 会命中 derivative。
 */
function containsAsciiAbbreviation(haystack: string, term: string): boolean {
    let index = haystack.indexOf(term);
    while (index >= 0) {
        const before = haystack[index - 1];
        const after = haystack[index + term.length];
        if (!isAsciiAlphaNumeric(before) && !isAsciiAlphaNumeric(after)) return true;
        index = haystack.indexOf(term, index + 1);
    }
    return false;
}

function termMatches(haystack: string, term: string, allowWeakStandalone = false): boolean {
    const normalizedTerm = normalize(term);
    if (!normalizedTerm) return false;
    if (!allowWeakStandalone && WEAK_STANDALONE_TERMS.has(normalizedTerm)) return false;
    if (/^[a-z]{2,3}$/.test(normalizedTerm)) return containsAsciiAbbreviation(haystack, normalizedTerm);
    return haystack.includes(normalizedTerm);
}

/**
 * A0 只拿到一个知识点名，词面往往极短（如「期权定价」），
 * 这里按方向补齐同义/关联术语，使方向路由规则能被稳定命中。
 */
const A0_SYNONYM_EXPANSIONS: Array<{ triggers: string[]; expansions: string[]; excludes?: string[] }> = [
    {
        triggers: ['期权', '衍生品', '衍生工具', '期货', '互换', '对冲', '希腊值', '波动率', '结构化产品'],
        expansions: ['期权', '衍生品', '波动率', '对冲', 'Delta', 'Gamma', 'Vega', 'Black-Scholes', 'BSM', '风险中性', 'Girsanov', '测度', '计价单位', 'numéraire', '远期测度', '隐含波动率', '局部波动率', '波动率曲面', 'Dupire', 'SABR', 'Heston', '蝶式', '日历价差', '无套利', '再平衡', '交易成本', '实现波动率', '鞅'],
    },
    {
        triggers: ['期限结构', '收益率曲线', '利率衍生品', '债券', '久期', '互换曲线', '国债'],
        expansions: ['期限结构', '收益率曲线', '久期', 'DV01', '自举', 'bootstrap', 'OIS', 'SOFR', '双曲线', '折现曲线', '远期曲线', '抵押品', '凸性调整', 'CMS', '期货利率', '修正久期', '关键期限', 'Hull-White', 'Vasicek', 'CIR', 'HJM', '互换'],
    },
    {
        triggers: ['信用', '信用风险', 'CDS', '违约', '信用衍生品', '债券违约', '评级'],
        expansions: ['信用', 'CDS', '违约概率', '危险率', 'hazard', '信用价差', '回收率', 'CVA', '强度模型', '风险中性违约概率', '真实世界违约概率', '生存概率', 'Merton模型', '结构化模型', '错向风险', 'wrong-way'],
    },
    {
        triggers: ['估值', '企业估值', '公司理财', '公司金融', '资本结构', '资本预算', '投资银行', '并购', 'LBO'],
        expansions: ['估值', 'DCF', 'WACC', 'FCFF', 'FCFE', '资本成本', '股权成本', '终值', '永续增长', 'APV', '税盾', 'MM定理', '去杠杆', '重加杠杆', 'Hamada', '资本预算', 'NPV', 'IRR', '多重IRR', 'MIRR', '实物期权', '增量现金流', '沉没成本', '互斥项目', '退出乘数'],
    },
    {
        triggers: ['计量', '计量经济', '实证', '回归', '时间序列', '面板', '因果推断', '统计推断'],
        expansions: ['计量', '时间序列', '回归', '因果推断', '面板', 'ADF', 'KPSS', '单位根', '协整', '误差修正', 'ECM', 'GARCH', '伪回归', 'Granger', 'VAR模型', '工具变量', 'IV', '2SLS', '弱工具', '首段F', '排他性', '双重差分', 'DID', 'RDD', '固定效应', '内生性', 'GMM', '平行趋势', '聚类', 'LATE', 'ATT'],
    },
    {
        triggers: ['精算', '寿险', '生命表', '年金', '准备金', '保险定价', '非寿险', '再保险', '损失分布', '信度'],
        expansions: ['精算', '寿险', '非寿险', '生命表', '死亡率', 'UDD', 'Balducci', '常数死力', '分数年龄', '准备金', 'Thiele', 'Fackler', '递归', '年金', '纯保费', '复合泊松', '免赔额', '责任限额', '再保险', '重尾', '帕累托', 'Pareto', 'GPD', '极值理论', 'Bühlmann', '链梯法', '多状态', '多减因'],
    },
    {
        triggers: ['风险管理', '风险度量', 'VaR', '压力测试', '市场风险', '经济资本'],
        expansions: ['风险度量', 'VaR', 'TVaR', '一致性风险度量', '次可加', '分位数', '重尾', '极值理论', 'GPD', '持有期', '置信水平', '回测', '压力测试', '相关性', '尾部依赖'],
    },
    {
        triggers: ['国际金融', '汇率', '外汇', '利率平价', '国际收支', '跨货币', 'quanto'],
        expansions: ['汇率', '外汇', '利率平价', 'CIP', 'UIP', 'PPP', 'quanto', '货币互换', '直接标价', '间接标价', '基准货币', '报价货币', '掉期点', '抛补', '跨货币基差', '三角套汇', '风险逆转', '折算风险', 'carry trade'],
    },
    {
        triggers: ['财务分析', '财务管理', '财务报表', '会计', '盈余管理', '报表'],
        expansions: ['财务报表', '财务分析', '资产负债表', '现金流量表', '三表联动', '权责发生制', '应计', '折旧', '资本化', '费用化', 'FIFO', 'LIFO', '存货计价', '租赁', '递延所得税', '表外融资', '杜邦', 'ROE分解', 'ROIC', '现金转换周期', '留存收益', '间接法'],
    },
    {
        triggers: ['投资组合', '资产配置', '资产定价', 'CAPM', '因子模型', '组合优化'],
        expansions: ['投资组合', '资产定价', 'CAPM', '因子模型', '有效前沿', '均值方差', '协方差矩阵', 'beta', '风险溢价', '套利定价', 'APT', '业绩归因', '夏普比率', '信息比率', '风险平价'],
    },
];

function expandA0MatchText(text: string): string {
    const expansions = A0_SYNONYM_EXPANSIONS
        .filter(group => group.triggers.some(trigger => text.includes(normalize(trigger))))
        .filter(group => !group.excludes?.some(exclude => text.includes(normalize(exclude))))
        .flatMap(group => group.expansions);

    if (expansions.length === 0) return text;
    return `${text}${normalize(uniqueTerms(expansions).join(' '))}`;
}

function scoreTerms(haystack: string, terms: string[] = [], weight: number, allowWeakStandalone = false): { score: number; matchedTerms: string[] } {
    const matchedTerms = uniqueTerms(terms.filter(term => termMatches(haystack, term, allowWeakStandalone)));
    return { score: matchedTerms.length * weight, matchedTerms };
}

function isGenericUniversalRule(rule: FinanceRule, matchedTerms: string[]): boolean {
    const hasStrongGate = Boolean(rule.requireAny?.length || rule.requireAll?.length);
    if (hasStrongGate || !rule.knowledgeKeywords.includes(UNIVERSAL_TERM)) return false;
    return matchedTerms.length === 0 || matchedTerms.every(term => normalize(term) === normalize(UNIVERSAL_TERM));
}

function scoreRule(rule: FinanceRule, text: string): MatchedFinanceRule | null {
    const requireAllTerms = rule.requireAll ?? [];
    const requireAnyTerms = rule.requireAny ?? [];
    const requireAll = scoreTerms(text, requireAllTerms, 7);
    if (requireAllTerms.length > 0 && requireAll.matchedTerms.length !== requireAllTerms.length) return null;

    const requireAny = scoreTerms(text, requireAnyTerms, 7);
    if (requireAnyTerms.length > 0 && requireAny.matchedTerms.length === 0) return null;

    const negatives = scoreTerms(text, rule.negativeTriggers ?? [], 0, true);
    if (negatives.matchedTerms.length > 0) return null;

    const knowledge = scoreTerms(text, rule.knowledgeKeywords, 5);
    const questionTypes = scoreTerms(text, rule.questionTypes, 4);
    const logic = scoreTerms(text, rule.logicPatterns, 4);
    const triggers = scoreTerms(text, rule.triggerKeywords, 3);
    const positives = scoreTerms(text, rule.positiveTriggers ?? [], 3);

    const matchedTerms = uniqueTerms([
        ...knowledge.matchedTerms,
        ...questionTypes.matchedTerms,
        ...logic.matchedTerms,
        ...triggers.matchedTerms,
        ...requireAll.matchedTerms,
        ...requireAny.matchedTerms,
        ...positives.matchedTerms,
    ]);

    if (matchedTerms.length === 0 && !rule.knowledgeKeywords.includes(UNIVERSAL_TERM)) return null;

    const universalFallback = isGenericUniversalRule(rule, matchedTerms) ? -30 : 0;
    const score = rule.priority
        + knowledge.score
        + questionTypes.score
        + logic.score
        + triggers.score
        + requireAll.score
        + requireAny.score
        + positives.score
        + universalFallback;

    return { ...rule, score, matchedTerms };
}

function dedupeByFamily(rules: MatchedFinanceRule[], maxRules: number): MatchedFinanceRule[] {
    const selected: MatchedFinanceRule[] = [];
    const usedFamilies = new Set<string>();

    for (const rule of rules) {
        const familyKey = rule.family || rule.id;
        if (usedFamilies.has(familyKey)) continue;
        selected.push(rule);
        usedFamilies.add(familyKey);
        if (selected.length >= maxRules) break;
    }

    return selected;
}

export function selectFinanceRules(context: FinanceRuleMatchContext): MatchedFinanceRule[] {
    const baseText = normalize([
        context.knowledgePoint,
        context.dimension,
        context.questionText,
        context.referenceAnswer,
        context.extraText,
    ].filter(Boolean).map(text => preferPrimaryText(String(text))).join(' '));
    const text = context.node === 'A0' ? expandA0MatchText(baseText) : baseText;

    const nodeLimit = NODE_RULE_LIMITS[context.node] ?? 4;
    const maxRules = Math.max(0, Math.min(context.maxRules ?? nodeLimit, nodeLimit));
    if (maxRules === 0) return [];

    const scored = FINANCE_RULE_BANK
        .filter(rule => rule.status === 'active' && rule.node === context.node)
        .map(rule => scoreRule(rule, text))
        .filter((rule): rule is MatchedFinanceRule => rule !== null)
        .sort((a, b) => b.score - a.score);

    const specific = scored.filter(rule => !isGenericUniversalRule(rule, rule.matchedTerms));
    const universalFallback = scored.filter(rule => isGenericUniversalRule(rule, rule.matchedTerms));

    const selected = dedupeByFamily(specific, maxRules);
    if (selected.length >= maxRules) return selected;

    const selectedFamilies = new Set(selected.map(rule => rule.family || rule.id));
    const fillRules = universalFallback.filter(rule => !selectedFamilies.has(rule.family || rule.id));
    return [...selected, ...dedupeByFamily(fillRules, maxRules - selected.length)];
}

function compactSnippet(snippet: string): string {
    const normalized = snippet.replace(/\s+/g, ' ').trim();
    return normalized.length <= MAX_RULE_SNIPPET_CHARS
        ? normalized
        : `${normalized.slice(0, MAX_RULE_SNIPPET_CHARS - 1)}…`;
}

export function formatFinanceRulesForPrompt(rules: MatchedFinanceRule[], title = '【动态规则匹配】'): string {
    if (rules.length === 0) return '';

    const node = rules[0]?.node;
    const budget = node ? NODE_PROMPT_BUDGETS[node] : 900;
    const lines: string[] = [];
    let used = title.length + 1;

    for (const rule of rules) {
        const line = `- [${rule.id}] ${compactSnippet(rule.promptSnippet)}`;
        if (lines.length > 0 && used + line.length + 1 > budget) break;
        lines.push(line);
        used += line.length + 1;
    }

    return lines.length === 0 ? '' : `${title}\n${lines.join('\n')}\n`;
}
