/**
 * Materials V2 — 物理自洽性确定性拦截器（材料学专属，非 LLM）
 *
 * 这是材料学 V2 相对于化学/物理/数学 V2 增设的独立拦截层：
 * 在 LLM 审查（A2）之前先跑一遍确定性硬规则检查，命中即强制进入 validityIssues，
 * 不依赖 LLM 是否"注意到"。材料学的晶体结构-元素对应、相变温度、
 * 绝热/恒温冲突等是可以用规则精确判定的硬伤，交给 LLM 判会漏。
 */

export interface MaterialsPhysicalLintResult {
    /** 是否存在硬伤 */
    hasViolation: boolean;
    /** 违规明细（会被注入 A2 的 validityIssues） */
    violations: string[];
    /** 需要 LLM 重点复核的可疑点（非阻断） */
    warnings: string[];
}

/** 晶体结构 → 该结构下的典型元素/化合物 */
const CRYSTAL_STRUCTURE_MAP: Record<string, string[]> = {
    'FCC': ['Cu', 'Al', 'Ni', 'γ-Fe', 'Ag', 'Au', 'Pb', 'Pt', '奥氏体'],
    '面心立方': ['Cu', 'Al', 'Ni', 'γ-Fe', 'Ag', 'Au', 'Pb', 'Pt', '奥氏体'],
    'BCC': ['α-Fe', 'W', 'Cr', 'Mo', 'V', 'Nb', 'Ta', '铁素体', 'δ-Fe'],
    '体心立方': ['α-Fe', 'W', 'Cr', 'Mo', 'V', 'Nb', 'Ta', '铁素体', 'δ-Fe'],
    'HCP': ['Mg', 'α-Ti', 'Zn', 'Cd', 'Zr', 'Be', 'Co'],
    '密排六方': ['Mg', 'α-Ti', 'Zn', 'Cd', 'Zr', 'Be', 'Co'],
};

/** 各结构的正确原子堆垛系数与配位数 */
const STRUCTURE_APF: Record<string, { apf: number; cn: number; atomsPerCell: number }> = {
    'FCC': { apf: 0.74, cn: 12, atomsPerCell: 4 },
    '面心立方': { apf: 0.74, cn: 12, atomsPerCell: 4 },
    'BCC': { apf: 0.68, cn: 8, atomsPerCell: 2 },
    '体心立方': { apf: 0.68, cn: 8, atomsPerCell: 2 },
    'HCP': { apf: 0.74, cn: 12, atomsPerCell: 6 },
    '密排六方': { apf: 0.74, cn: 12, atomsPerCell: 6 },
};

/**
 * 同义结构名 → 规范名。用于统计题面中「真正独立」的结构数量：
 * "FCC" 与 "面心立方" 是同一结构的两种写法，不应被数成 2 个。
 */
const STRUCTURE_CANONICAL: Record<string, string> = {
    'FCC': 'FCC',
    '面心立方': 'FCC',
    'BCC': 'BCC',
    '体心立方': 'BCC',
    'HCP': 'HCP',
    '密排六方': 'HCP',
};

/** 统计题面中出现的独立晶体结构数量（同义名去重后） */
function countDistinctStructures(text: string): number {
    const seen = new Set<string>();
    for (const [alias, canonical] of Object.entries(STRUCTURE_CANONICAL)) {
        if (text.includes(alias)) seen.add(canonical);
    }
    return seen.size;
}

/** 关键相变/物性温度锚点（°C），用于检测明显错误的数值 */
const TEMPERATURE_ANCHORS: Array<{ pattern: RegExp; correct: number; tolerance: number; label: string }> = [
    { pattern: /A[₁1]\s*(?:线|温度)?\s*[为=≈:：]?\s*(\d{3,4})\s*°C/i, correct: 727, tolerance: 5, label: 'Fe-C 相图 A1 共析温度（727°C）' },
    { pattern: /A[₃3]\s*(?:线|温度)?\s*[为=≈:：]?\s*(\d{3,4})\s*°C/i, correct: 912, tolerance: 8, label: 'Fe-C 相图 A3 上限 / 纯铁 α→γ 温度（912°C）' },
    { pattern: /共析(?:反应|转变|点)?(?:温度)?\s*[为=≈:：]?\s*(\d{3,4})\s*°C/, correct: 727, tolerance: 5, label: 'Fe-C 共析温度（727°C）' },
    { pattern: /共晶(?:反应|转变|点)?(?:温度)?\s*[为=≈:：]?\s*(\d{3,4})\s*°C/, correct: 1148, tolerance: 8, label: 'Fe-C 共晶温度（1148°C）' },
    { pattern: /(?:纯)?铁(?:的)?熔点\s*[为=≈:：]?\s*(\d{3,4})\s*°C/, correct: 1538, tolerance: 10, label: '纯铁熔点（1538°C）' },
    { pattern: /α\s*(?:→|->)+\s*γ\s*(?:转变)?(?:温度)?\s*[为=≈:：]?\s*(\d{3,4})\s*°C/, correct: 912, tolerance: 8, label: '纯铁 α→γ 同素异构转变（912°C）' },
    { pattern: /γ\s*(?:→|->)+\s*δ\s*(?:转变)?(?:温度)?\s*[为=≈:：]?\s*(\d{3,4})\s*°C/, correct: 1394, tolerance: 10, label: '纯铁 γ→δ 同素异构转变（1394°C）' },
];

/** 全角/异体温度与数字写法归一，使锚点正则能稳定命中 */
function normalizeTemperatureText(text: string): string {
    return text
        .replace(/℃/g, '°C')
        .replace(/摄氏度/g, '°C')
        .replace(/([0-9])\s*度(?![数量])/g, '$1°C')
        .replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
}


function checkCrystalStructure(text: string): string[] {
    const violations: string[] = [];
    for (const [structure, validMembers] of Object.entries(CRYSTAL_STRUCTURE_MAP)) {
        if (!text.includes(structure)) continue;
        // 找出题面中提到的、属于其它结构的元素
        for (const [otherStructure, otherMembers] of Object.entries(CRYSTAL_STRUCTURE_MAP)) {
            if (otherStructure === structure) continue;
            // 同义结构名跳过（FCC 与 面心立方）
            if (validMembers.join() === otherMembers.join()) continue;
            for (const member of otherMembers) {
                if (validMembers.includes(member)) continue;
                // 要求元素与结构名在同一句内出现才判定
                const sentences = text.split(/[。；\n]/);
                for (const sentence of sentences) {
                    if (sentence.includes(structure) && sentence.includes(member)) {
                        violations.push(`晶体结构错配：「${member}」不是 ${structure} 结构（应为 ${otherStructure}），但题面把两者写在同一句中`);
                    }
                }
            }
        }
    }
    return [...new Set(violations)];
}

function checkStructureParameters(text: string): string[] {
    const violations: string[] = [];
    for (const [structure, params] of Object.entries(STRUCTURE_APF)) {
        if (!text.includes(structure)) continue;
        // 配位数检查
        const cnMatch = text.match(new RegExp(`配位数\\s*[为=≈]?\\s*(\\d{1,2})`));
        if (cnMatch) {
            const stated = parseInt(cnMatch[1], 10);
            // 只有当文中仅提到一种结构时才判定，避免多结构对比题误报（同义名去重）
            const structureCount = countDistinctStructures(text);
            if (structureCount <= 1 && stated !== params.cn) {
                violations.push(`配位数错误：${structure} 的配位数应为 ${params.cn}，题面/解答中为 ${stated}`);
            }
        }
        // 每晶胞原子数检查
        const apcMatch = text.match(/每(?:个)?晶胞(?:含|内)?(?:有)?\s*(\d{1,2})\s*个?原子/);
        if (apcMatch) {
            const stated = parseInt(apcMatch[1], 10);
            const structureCount = countDistinctStructures(text);
            if (structureCount <= 1 && stated !== params.atomsPerCell) {
                violations.push(`晶胞原子数错误：${structure} 每晶胞应含 ${params.atomsPerCell} 个原子，题面/解答中为 ${stated}`);
            }
        }
    }
    return [...new Set(violations)];
}

function checkTemperatureAnchors(text: string): string[] {
    const violations: string[] = [];
    const normalized = normalizeTemperatureText(text);
    for (const anchor of TEMPERATURE_ANCHORS) {
        const match = normalized.match(anchor.pattern);
        if (!match) continue;
        const stated = parseInt(match[1], 10);
        if (Math.abs(stated - anchor.correct) > anchor.tolerance) {
            violations.push(`相变温度错误：${anchor.label}，题面/解答中为 ${stated}°C`);
        }
    }
    return violations;
}

function checkProcessTemperature(text: string): string[] {
    const violations: string[] = [];
    const normalized = normalizeTemperatureText(text);

    // 支持"回火温度=800°C"与"800°C 回火"两种语序
    const temperMatch =
        normalized.match(/回火(?:温度|加热)?\s*[为=≈至到:：]?\s*(\d{3,4})\s*°C/) ||
        normalized.match(/(\d{3,4})\s*°C\s*(?:下|下?进行)?\s*回火/);
    if (temperMatch) {
        const t = parseInt(temperMatch[1], 10);
        if (t > 727) {
            violations.push(`工艺参数错误：回火温度 ${t}°C 高于 A1 线（727°C），已进入奥氏体化区间，不再是回火工艺`);
        }
    }

    // 支持"淬火温度=900°C"与"900°C 淬火"两种语序
    const quenchMatch =
        normalized.match(/淬火(?:加热)?(?:温度)?\s*[为=≈至到:：]?\s*(\d{3,4})\s*°C/) ||
        normalized.match(/(\d{3,4})\s*°C\s*(?:下|下?进行)?\s*淬火/);
    if (quenchMatch) {
        const t = parseInt(quenchMatch[1], 10);
        if (t < 727) {
            violations.push(`工艺参数错误：淬火加热温度 ${t}°C 低于 A1 线（727°C），无法完成奥氏体化`);
        }
        if (t > 1538) {
            violations.push(`工艺参数错误：淬火加热温度 ${t}°C 超过纯铁熔点（1538°C）`);
        }
    }
    return violations;
}

function checkThermodynamicConflict(text: string): string[] {
    const violations: string[] = [];
    const sentences = text.split(/[。；\n]/);
    for (const sentence of sentences) {
        const isAdiabatic = /绝热/.test(sentence);
        const isIsothermal = /恒温|等温|温度(?:保持)?不变|isothermal/.test(sentence);
        if (isAdiabatic && isIsothermal) {
            violations.push(`热力学矛盾：同一过程同时声称"绝热"和"恒温/等温"（相变放热过程在绝热条件下温度必然升高）`);
        }
        // 相变 + 绝热 + 恒温
        if (isAdiabatic && /相变|凝固|结晶|析出|转变/.test(sentence) && isIsothermal) {
            violations.push(`热力学矛盾：绝热条件下的相变过程不可能维持恒温`);
        }
    }
    return [...new Set(violations)];
}

function checkUnitPresence(draft: { questionText: string; referenceAnswer: string }): string[] {
    const warnings: string[] = [];
    // 最终答案缺单位检测（材料学计算题几乎都有量纲）
    const answerTail = draft.referenceAnswer.slice(-200);
    const hasUnit = /(?:GPa|MPa|kPa|Pa|nm|μm|um|mm|cm|m³|m2|m\^2|K|°C|J\/mol|kJ\/mol|J\/\(mol·K\)|mol\/(?:L|m³)|g\/cm³|kg\/m³|%|s|h|min|N|kN|MPa·√m|MPa√m|W\/\(m·K\)|个|次|循环)/i.test(answerTail);
    if (!hasUnit) {
        warnings.push('标准解答末尾未检出物理单位，请复核最终答案是否漏写单位');
    }
    return warnings;
}

function checkDataSelfSufficiency(draft: {
    questionText: string;
    coreData: Record<string, { value: number | string; unit: string }>;
}): string[] {
    const warnings: string[] = [];
    // coreData 中的数值应能在题面文字中找到（题干自足性）
    const missing: string[] = [];
    for (const [name, entry] of Object.entries(draft.coreData || {})) {
        const valueStr = String(entry.value);
        if (!valueStr || valueStr.length < 1) continue;

        // 科学计数法特殊处理：提取底数部分做宽松匹配
        // 例如 "6.02e23" / "6.02×10²³" → 底数 "6.02"
        const sciMatch = valueStr.match(/^([0-9]+\.?[0-9]*)\s*[×xX*]?\s*(?:10|e|E)\s*[⁰¹²³⁴⁵⁶⁷⁸⁹⁻\-\^]*\s*[0-9⁰¹²³⁴⁵⁶⁷⁸⁹]*/);
        if (sciMatch) {
            const mantissa = sciMatch[1]; // 如 "6.02"
            if (draft.questionText.includes(mantissa)) continue; // 题面含底数即视为自足
        }

        const numericCore = valueStr.replace(/[^\d.]/g, '');
        if (numericCore.length === 0) continue;
        if (!draft.questionText.includes(numericCore) && !draft.questionText.includes(valueStr)) {
            missing.push(`${name}=${valueStr}${entry.unit || ''}`);
        }
    }
    if (missing.length > 0) {
        warnings.push(`题干自足性可疑：coreData 中以下数据未在题面文字中检出，考生可能无法解题 —— ${missing.join('、')}`);
    }
    return warnings;
}

/**
 * 材料学 V2 物理自洽性拦截主入口。
 * 同时检查题干和标准解答（两者的硬伤都会导致题目不可发布）。
 * skipNumericChecks=true 时跳过依赖 coreData 和数值单位的检查（简答题无数值答案），
 * 但保留晶体结构 / 相变温度 / 热力学矛盾等文本级硬规则。
 *
 * 注意：混合题（mixed）虽含论述小问，但计算小问仍有 coreData 与数值答案，
 * 必须传 skipNumericChecks=false 才能检出单位缺失与题干不自足。
 */
export function lintMaterialsPhysics(draft: {
    questionText: string;
    referenceAnswer: string;
    coreData: Record<string, { value: number | string; unit: string }>;
}, skipNumericChecks: boolean = false): MaterialsPhysicalLintResult {
    const combined = `${draft.questionText}\n${draft.referenceAnswer}`;

    const violations = [
        ...checkCrystalStructure(combined),
        ...checkStructureParameters(combined),
        ...checkTemperatureAnchors(combined),
        ...checkThermodynamicConflict(combined),
        ...checkProcessTemperature(combined),
    ];

    // 简答题无数值答案与 coreData，跳过单位缺失与题干自足性检查
    const warnings = skipNumericChecks
        ? []
        : [
            ...checkUnitPresence(draft),
            ...checkDataSelfSufficiency(draft),
        ];

    return {
        hasViolation: violations.length > 0,
        violations: [...new Set(violations)],
        warnings: [...new Set(warnings)],
    };
}
