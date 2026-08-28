import { CHEMISTRY_RULE_BANK, ChemistryRule, ChemistryRuleNode } from './chemistry-rule-bank';

export interface ChemistryRuleMatchContext {
    node: ChemistryRuleNode;
    knowledgePoint?: string;
    dimension?: string;
    questionText?: string;
    referenceAnswer?: string;
    extraText?: string;
    maxRules?: number;
}

export interface MatchedChemistryRule extends ChemistryRule {
    score: number;
    matchedTerms: string[];
}

const NODE_RULE_LIMITS: Record<ChemistryRuleNode, number> = {
    A0: 3,
    A1: 4,
    'A2/A3': 4,
    A4: 3,
    A5: 4,
};

const NODE_PROMPT_BUDGETS: Record<ChemistryRuleNode, number> = {
    A0: 720,
    A1: 960,
    'A2/A3': 960,
    A4: 960,
    A5: 960,
};

const MAX_RULE_SNIPPET_CHARS = 220;

function normalize(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '');
}

function uniqueTerms(terms: string[]): string[] {
    return [...new Set(terms.filter(Boolean))];
}

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

const REQUIRE_ALL_FAMILY_TERMS = new Set([
    'autocatalysis-chiral-amplification',
    'isotope-fractionation-model-gating',
    'precipitation-complexation-solid-proof',
    'conceptual-dft-hsab-energy-model',
    'ligand-field-magnetochemistry',
    'pitzer-water-activity-gamma-fit',
    'bz-oregonator-dynamics',
    'glass-transition-dsc-relaxation',
    'glass-transition-ehrenfest-pd',
    'quantum-chem-vqe-jw-coredata',
    'polymer-fh-fr',
    'photothermal-pericyclic-competition',
    'electrochem-bv-mass-transfer-eis',
    'electrochem-eis-warburg-small-signal',
    'nmr-model-applicability',
    'activity-ionic-strength-conditional-equilibrium',
    'photoredox-set-marcus-chain',
    'spinchem-radical-pair-cidnp',
    'electrochem-henderson-liquid-junction',
    'catalysis-temkin-redhead-dual-site',
    'quantum-chem-method-applicability',
    'nonadiabatic-lz-conical-intersection',
    'quantum-chem-two-electron-integral-pair-hopping',
    'closed-brine-adsorption-isotope-uncertainty',
    'catalysis-energetic-span-tof',
    'mixed-valence-mulliken-hush',
]);

const WEAK_STANDALONE_TERMS = new Set([
    'δ', '∆', 'Δ', 'α', 'r', 'aw', 'si', 'sit', 'fh', 'fr', 'ee', 'ev', 'ce', 'δε', 'q', 'pd', '2×2', '2x2', 'coredata', 'λ',
]);

function isAsciiAlphaNumeric(char: string | undefined): boolean {
    return Boolean(char && /[a-z0-9]/.test(char));
}

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

const A0_SYNONYM_EXPANSIONS: Array<{ triggers: string[]; expansions: string[]; excludes?: string[] }> = [
    {
        triggers: ['电化学', '电极过程', '极化', '阻抗谱', '伏安', '电池', '界面浓度', '传质修正', '非零偏置', 'RctA', '面积电阻'],
        expansions: ['Nernst', '条件电位', 'Butler-Volmer', 'BV', 'Tafel', 'EIS', 'Warburg', 'Cottrell', '欧姆降', 'iRu', 'signed I', '传质', 'Fick', 'Rct', 'RctA', 'Rct,A', 'RD', '右截距', '高频截距', '低频平台', '面积电阻', '面积阻抗', '局部Nernst', '偏置态导数', 'nonzero-bias derivative', '固定表面浓度导数', 'αa/αc', '浓度显含BV', 'surface concentration', 'mM→mol cm⁻³', 'qL', 'coth', 'Cdl', 'Ageo', 'ECSA', 'Dox', 'Dred'],
    },
    {
        triggers: ['动力学', '反应速率', '速率方程', '催化动力学', '机理动力学'],
        excludes: ['能量跨度', 'energetic span', 'TDTS', 'TDI', 'XTOF', '休眠物种', 'off-cycle'],
        expansions: ['Arrhenius', 'Eyring', 'Curtin-Hammett', '稳态', '预平衡', 'Michaelis', 'KIE', '表观速率'],
    },
    {
        triggers: ['有机化学', '有机机理', '立体化学', '构象', '结构解析'],
        expansions: ['周环', 'FMO', 'NMR', 'Karplus', 'NOESY', '非经典', '三中心', 'Curtin-Hammett'],
    },
    {
        triggers: ['物理化学', '热力学', '化学平衡', '相平衡', '溶液热力学'],
        expansions: ['活度', '逸度', '标准态', '反应商', 'Debye-Hückel', 'Pitzer', 'γ±', '渗透系数', 'Cφ', '联合WLS', '诊断保留点', '域外点'],
    },
    {
        triggers: ['界面电荷', '特异离子效应', '溶剂化壳层', 'Gibbs面', '纳米狭缝', 'Poisson-Boltzmann', 'Grahame', 'Langmuir', '水化壳', '位点占据率'],
        expansions: ['Poisson-Boltzmann', 'Grahame', 'Langmuir', 'Stern层', '水化壳', '位点占据率', '表面电荷', '吸附面密度', 'n_ba²d'],
    },
    {
        triggers: ['高分子', '聚合物', '凝胶', '溶胀', '相分离', '双节线'],
        excludes: ['reaction-diffusion', '反应扩散', 'Turing', 'Neumann', 'Jacobian', '扩散矩阵', 'Oregonator', 'Brusselator'],
        expansions: ['Flory-Huggins', 'Flory-Rehner', 'FH', 'FR', 'spinodal', 'binodal', '双节线', '共同切线', '杠杆规则', 'χ', '体积分数'],
    },
    {
        triggers: ['光化学', '光反应', '光催化', '光氧化还原', '光物理', '有机光化学'],
        excludes: ['混合价', 'Mulliken-Hush', 'IVCT', 'Robin-Day', 'Creutz-Taube'],
        expansions: ['photoredox', 'SET', 'Marcus', 'Stern-Volmer', '周环', '电环化', '光热', '双光子', '量子产率', 'E00', 'Ered*=Ered+E00', '吸收光子', 'Iabs/V', 'CIP', 'φ²', 'kSET', 'kq', 'kq,total', 'active fraction', '游离浓度', 'fesc', 'Φesc', 'PSET', 'Ri=2kt[R]^2', '笼逃逸', '链长', '寿命SV', '强度SV'],
    },
    {
        triggers: ['谱学', '核磁', 'NMR', '结构鉴定', '结构解析', '动态 NMR'],
        expansions: ['ppm', 'Hz', 'rad', '强耦合', '动态NMR', 'NOESY', 'EXSY', 'Bloch-McConnell', 'coalescence', 'Karplus', 'HSQC', 'HMBC', 'Δν', '混合时间'],
    },
    {
        triggers: ['配位化学', '配合物', '配体', '晶场', '配位场', '金属络合物'],
        excludes: ['混合价', 'Mulliken-Hush', 'IVCT', 'Robin-Day', 'Creutz-Taube'],
        expansions: ['高自旋', '低自旋', '磁矩', 'HSAB', '端位', '条件稳定常数', '游离浓度', '晶场分裂'],
    },
    {
        triggers: ['同位素分馏', '稳定同位素', '同位素效应', 'δ值', '分馏因子', 'Craig-Gordon', 'HDO', '吸附同位素'],
        expansions: ['Rayleigh', 'Craig-Gordon', 'KIE', 'ZPE', '零点能', '约化质量', '平衡分馏', '扩散分馏', 'RH', 'aw', 'h=RH/aw', '水汽δ', '蒸发通量', 'rE=Ar-B', 'd(Vr)/dV', 'Vdr/dV', 'RK4', '终点δ残差', '双同位素残差', 'δ18O/δD residual table', 'squared S', '平方归一残差', '封闭卤水', '吸附剂', 'HDO', '吸附水', 'Langmuir', '液相水', '总水量', '误差传播', '不确定度'],
    },
    {
        triggers: ['化学振荡', 'BZ', 'Belousov', 'Zhabotinsky', '振荡反应', 'reaction-diffusion', '反应扩散', 'Oregonator'],
        expansions: ['Oregonator', 'Hopf', 'Turing', 'Nagumo', '快慢系统', '慢流形', 'Br-', '活度标度', 'Neumann', 'finite domain', '离散模态', 'integer modes', 'Dτ', 'Kn', 'qn=nπ/L', 'M_n=J-k_n²D', 'epsilon placement', 'all modes stable', 'Jacobian', '扩散矩阵', '特征向量', 'max Reλ', '最快增长模态'],
    },
    {
        triggers: ['玻璃转变', '玻璃化转变', 'Tg', 'fictive temperature', '结构弛豫', '焓恢复', '热容台阶'],
        expansions: ['VFT', '结构弛豫', '热滞后', '热容台阶', '非平衡相变', '成核窗口', 'Bi数', 'Tf', 'fictive temperature', '焓恢复', 'ΔHrec', 'T0', 'Tmid', 'RSS', 'AICc', 'E=-mR', 'VFT sample-back', '残差表', 'Prigogine-Defay'],
    },
    {
        triggers: ['自旋化学', '自由基对', 'CIDNP', '光化学CIDNP', '超精细', '自旋动力学', 'TADF', '隐花色素', '磁场效应', '低场效应', '低场', '近零场'],
        expansions: ['Δg', 'g因子差', 'HFI', 'S-T0', 'S-T±', 'Zeeman', '低场', '近零场', '三自旋', '笼内复合', '单态复合', '三态逃逸', 'Haberkorn', 'EPR张量', 'ESR', 'A/2π', '积分产率', '寿命加权', 'escape yield', 'FAD', 'FAD•−', 'IndH', 'flavin', 'indole', 'Trp'],
    },
    {
        triggers: ['自催化', '手性放大', 'ee', '对映体过量', '随机化学动力学'],
        expansions: ['二聚失活', '游离活性物种', 'Fokker-Planck', 'Kramers-Moyal', 'MFPT', '首达时间', '吸收边界'],
    },
    {
        triggers: ['量子计算化学', 'VQE', 'Jordan-Wigner', 'JW', 'STO-3G'],
        excludes: ['QPE', '相位估计', '演化时间', '整数支'],
        expansions: ['coreData', 'Pauli', 'I/Z/ZZ', 'single Z', 'X/Y strings', '哈密顿量', '对称性块', '核排斥能', 'Vnn', 'Hartree', '占据约定', 'row-sum'],
    },
    {
        triggers: ['QPE', '相位估计', '活性空间', '演化时间', '整数支'],
        excludes: ['VQE', '变分量子', '2×2变分'],
        expansions: ['QPE', '相位估计', 'multi-time', 'integer branch', 'phase residual', '多时间', '整数支', '相位残差', 'τ,m,r', 'aliasing', '2π/τ', 'Eref', 'Eel', 'Vnn', 'Etot', 'chemical precision', 'ceil边界'],
    },
    {
        triggers: ['量子化学', '计算化学', '二电子积分', 'Slater-Condon', '闭壳层', '双占据'],
        expansions: ['pair hopping', 'Pab', 'Kab', '同自旋交换', '开壳层', '闭壳层', '双占据', 'CSF', '避免交叉', '二阶扰动'],
    },
    {
        triggers: ['非绝热', 'Landau-Zener', 'LZ', '锥形交叉'],
        excludes: ['混合价', 'Mulliken-Hush', 'IVCT', 'Robin-Day'],
        expansions: ['diabatic', 'adiabatic', '最小绝热能隙', 'gap_min=2V', 'SOC', 'V²', '速度分布', '热平均', 'Rayleigh', '单速近似', '退相干'],
    },
    {
        triggers: ['能量跨度', 'energetic span', 'TDTS', 'TDI', 'XTOF', '决定态', '休眠物种', 'off-cycle', '循环外', '均相催化循环', '转化频率'],
        expansions: ['能量跨度', 'energetic span', 'TDTS', 'TDI', 'XTOF', '决定态', 'TOF', '转化频率', '催化循环', '自由能图', '中间体', '过渡态', 'ΔGr', 'kBT/h', '灵敏度', 'off-cycle', '循环外', '休眠物种', '静息态', '预催化剂', '循环净驱动力'],
    },
    {
        triggers: ['混合价', 'Mulliken-Hush', 'IVCT', '价间电荷转移', 'Robin-Day', 'Creutz-Taube', '电子耦合', 'Class III'],
        excludes: ['photoredox', '光氧化还原', 'Stern-Volmer', '概念DFT', '电负性均衡', 'Landau-Zener', '锥形交叉'],
        expansions: ['混合价', 'Mulliken-Hush', 'IVCT', '价间电荷转移', 'Robin-Day', 'Hab', '电子耦合', '二态模型', 'Class II', 'Class III', '重组能', 'εmax', 'νmax', '半高宽', 'Δν1/2', 'rab', '有效距离', '双核', '桥联', '摩尔吸光系数', '离域', 'cm-1'],
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

function isGenericUniversalRule(rule: ChemistryRule, matchedTerms: string[]): boolean {
    const hasStrongGate = Boolean(rule.requireAny?.length || rule.requireAll?.length);
    if (hasStrongGate || !rule.knowledgeKeywords.includes('化学')) return false;
    return matchedTerms.length === 0 || matchedTerms.every(term => normalize(term) === '化学');
}

function scoreRule(rule: ChemistryRule, text: string): MatchedChemistryRule | null {
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
    if (rule.family && REQUIRE_ALL_FAMILY_TERMS.has(rule.family)) {
        const hasFamilyTerm = knowledge.matchedTerms.length > 0 || questionTypes.matchedTerms.length > 0 || logic.matchedTerms.length > 0;
        const hasSupportTerm = triggers.matchedTerms.length > 0 || positives.matchedTerms.length > 0 || requireAll.matchedTerms.length > 0 || requireAny.matchedTerms.length > 0;
        if (!hasFamilyTerm || !hasSupportTerm) return null;
    }

    const matchedTerms = uniqueTerms([
        ...knowledge.matchedTerms,
        ...questionTypes.matchedTerms,
        ...logic.matchedTerms,
        ...triggers.matchedTerms,
        ...requireAll.matchedTerms,
        ...requireAny.matchedTerms,
        ...positives.matchedTerms,
    ]);

    if (matchedTerms.length === 0 && !rule.knowledgeKeywords.includes('化学')) return null;

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

function dedupeByFamily(rules: MatchedChemistryRule[], maxRules: number): MatchedChemistryRule[] {
    const selected: MatchedChemistryRule[] = [];
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

export function selectChemistryRules(context: ChemistryRuleMatchContext): MatchedChemistryRule[] {
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

    const scored = CHEMISTRY_RULE_BANK
        .filter(rule => rule.status === 'active' && rule.node === context.node)
        .map(rule => scoreRule(rule, text))
        .filter((rule): rule is MatchedChemistryRule => rule !== null)
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

export function formatRulesForPrompt(rules: MatchedChemistryRule[], title = '【动态规则匹配】'): string {
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
