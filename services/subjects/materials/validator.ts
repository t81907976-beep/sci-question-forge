import type {
    BaseProblem,
    TrapModification,
    ValidationResult
} from "../../../types/multiNodeTypes";

/**
 * Materials Science: Trap Fusion & Consistency Validator
 */

export function validateAndMergeTraps(
    baseProblem: BaseProblem,
    modifications: TrapModification[]
): ValidationResult {
    const conflicts: string[] = [];
    const violations: string[] = [];

    const appliedTraps: string[] = [];
    const trapDescriptions: string[] = [];
    let mergedTrapText = baseProblem.originalProblemText;
    let combinedDistractorData = {};

    modifications.forEach(mod => {
        if (mod.trapModifiedText && mod.trapModifiedText.trim() !== '') {
            mergedTrapText = mod.trapModifiedText;
        }
        if (mod.distractorData) {
            combinedDistractorData = { ...combinedDistractorData, ...mod.distractorData };
        }
        appliedTraps.push(mod.trapType);
        trapDescriptions.push(mod.trapDescription);
    });

    const validatedTrapData = {
        appliedTraps: appliedTraps as any,
        trapModifiedText: mergedTrapText,
        distractorData: combinedDistractorData,
        trapDescriptions: trapDescriptions
    };

    const minSteps = modifications.length > 0 ? 6 : 4;
    if (!baseProblem.referenceSteps || baseProblem.referenceSteps.length < minSteps) {
        violations.push(
            `Solution depth insufficient: only ${baseProblem.referenceSteps?.length ?? 0} steps ` +
            `(minimum ${minSteps} required). Regenerate.`
        );
    }

    const combinedData = { ...baseProblem.coreData, ...combinedDistractorData };
    const basicChecks = validateBasicDataStructure(combinedData);
    violations.push(...basicChecks);

    const consistencyChecks = validateMaterialsConsistency(mergedTrapText);
    violations.push(...consistencyChecks);

    const isValid = conflicts.length === 0 && violations.length === 0;

    return {
        isValid,
        conflicts,
        physicalConstraintsViolated: violations,
        validatedTrapData: isValid ? validatedTrapData : undefined
    };
}

function validateBasicDataStructure(combinedData: any): string[] {
    const violations: string[] = [];

    // 材料学常见需要「值+单位」的物理量
    const strictFields = [
        // 通用
        '温度', 'temperature', 'T',
        '压力', 'pressure', 'P',
        '体积', 'volume', 'V',
        '质量', 'mass',
        '密度', 'density', 'ρ',
        '时间', 'time', 't',
        // 力学性能
        '弹性模量', "Young's modulus", 'E',
        '屈服强度', 'yield strength', 'σy', 'σ_y',
        '抗拉强度', 'tensile strength', 'σb', 'UTS',
        '断裂韧性', 'fracture toughness', 'KIC', 'K_IC',
        '硬度', 'hardness', 'HV', 'HRC',
        '应变', 'strain', 'ε',
        '应力', 'stress', 'σ',
        // 热学
        '热导率', 'thermal conductivity', 'k', 'κ',
        '比热容', 'specific heat', 'Cp',
        '热膨胀系数', 'CTE', 'α',
        '熔点', 'melting point', 'Tm', 'T_m',
        '玻璃化转变温度', 'Tg', 'T_g',
        // 电学/磁学/光学
        '电导率', 'conductivity', 'σ',
        '电阻率', 'resistivity', 'ρ',
        '介电常数', 'permittivity', 'εr',
        '磁化率', 'susceptibility', 'χ',
        '带隙', 'band gap', 'Eg', 'E_g',
        // 扩散/动力学
        '扩散系数', 'diffusion coefficient', 'D',
        '活化能', 'activation energy', 'Ea', 'Q',
        '速率常数', 'rate constant', 'k',
        // 晶体学
        '晶格常数', 'lattice parameter', 'a', 'c',
        '晶粒尺寸', 'grain size', 'd',
        '位错密度', 'dislocation density',
        // 通用材料参数
        '摩尔质量', 'molar mass',
        '摩尔体积', 'molar volume',
        'ΔH', '焓变', 'enthalpy',
        'ΔG', '自由能', 'Gibbs energy',
        'ΔS', '熵变', 'entropy',
    ];

    Object.entries(combinedData).forEach(([key, item]: [string, any]) => {
        const requiresUnit = strictFields.some(field =>
            key.toLowerCase().includes(field.toLowerCase())
        );

        if (requiresUnit) {
            if (!item || typeof item !== 'object' || !('value' in item) || !('unit' in item)) {
                violations.push(`${key} must have both value and unit fields`);
            }
        } else {
            if (!item) {
                violations.push(`${key} is missing or empty`);
            }
        }
    });

    return violations;
}

export function checkTrapCompatibility(modifications: TrapModification[]): string[] {
    const issues: string[] = [];
    const trapTypes = modifications.map(m => m.trapType);
    const uniqueTraps = new Set(trapTypes);
    if (uniqueTraps.size !== trapTypes.length) {
        issues.push('Duplicate trap types detected');
    }
    return issues;
}

function validateMaterialsConsistency(text: string): string[] {
    const violations: string[] = [];
    const lowerText = text.toLowerCase();

    // 绝热 + 恒温矛盾（材料热处理题常见）
    const adiabaticKeywords = ['绝热', 'adiabatic', '杜瓦瓶', 'dewar', '隔热'];
    const isothermalKeywords = ['恒温', '等温', 'isothermal', '温度恒定', '温度不变', '温度保持'];
    const hasAdiabatic = adiabaticKeywords.some(kw => lowerText.includes(kw));
    const hasIsothermal = isothermalKeywords.some(kw => lowerText.includes(kw));

    if (hasAdiabatic && hasIsothermal) {
        const heatExchangeKeywords = ['水浴', '加热器', '换热器', '冷却水', '恒温浴槽控制', '盐浴', '恒温炉'];
        const hasHeatExchange = heatExchangeKeywords.some(kw => lowerText.includes(kw));
        if (!hasHeatExchange) {
            violations.push(
                '热处理条件矛盾：题目同时包含绝热条件和恒温条件，但未提供热交换机制（如盐浴、恒温炉）。'
            );
        }
    }

    violations.push(...validateCrystalStructure(text));
    violations.push(...validatePhaseTransition(text));
    violations.push(...validateMechanicalProperties(text));
    violations.push(...validateDiffusionKinetics(text));
    violations.push(...validateProcessingConditions(text));
    violations.push(...validatePolymerCeramic(text));
    violations.push(...validateSemiconductorMagnetic(text));

    return violations;
}

/** 晶体结构与物质的对应关系校验 */
function validateCrystalStructure(text: string): string[] {
    const violations: string[] = [];

    // 常见金属的室温晶体结构（材料学基础，写错是硬错误）
    const knownStructures: Record<string, { structure: string; aliases: string[] }> = {
        'Cu': { structure: 'FCC', aliases: ['铜'] },
        'Al': { structure: 'FCC', aliases: ['铝'] },
        'Ni': { structure: 'FCC', aliases: ['镍'] },
        'Ag': { structure: 'FCC', aliases: ['银'] },
        'Au': { structure: 'FCC', aliases: ['金'] },
        'Pb': { structure: 'FCC', aliases: ['铅'] },
        'Cr': { structure: 'BCC', aliases: ['铬'] },
        'W': { structure: 'BCC', aliases: ['钨'] },
        'Mo': { structure: 'BCC', aliases: ['钼'] },
        'V': { structure: 'BCC', aliases: ['钒'] },
        'Nb': { structure: 'BCC', aliases: ['铌'] },
        'Mg': { structure: 'HCP', aliases: ['镁'] },
        'Zn': { structure: 'HCP', aliases: ['锌'] },
        'Ti': { structure: 'HCP', aliases: ['钛', 'α-Ti', 'α钛'] },
        'Cd': { structure: 'HCP', aliases: ['镉'] },
    };

    const structureRegex = /(FCC|BCC|HCP|面心立方|体心立方|密排六方|密排立方)/gi;
    const normalizeStructure = (s: string): string => {
        const u = s.toUpperCase();
        if (u === 'FCC' || s === '面心立方') return 'FCC';
        if (u === 'BCC' || s === '体心立方') return 'BCC';
        if (u === 'HCP' || s === '密排六方') return 'HCP';
        return u;
    };

    // 在同一句话内出现「元素 + 晶体结构」时校验
    const sentences = text.split(/[。；;\n]/);
    for (const sentence of sentences) {
        const structMatches = sentence.match(structureRegex);
        if (!structMatches) continue;
        const mentionedStructures = new Set(structMatches.map(normalizeStructure));

        for (const [symbol, info] of Object.entries(knownStructures)) {
            const names = [symbol, ...info.aliases];
            // 元素符号用词边界匹配，避免 Al 匹配到 Alloy
            const mentioned = names.some(n =>
                /^[A-Z][a-z]?$/.test(n)
                    ? new RegExp(`(?<![A-Za-z])${n}(?![a-z])`).test(sentence)
                    : sentence.includes(n)
            );
            if (mentioned && mentionedStructures.size === 1) {
                const claimed = Array.from(mentionedStructures)[0];
                if (claimed !== info.structure && ['FCC', 'BCC', 'HCP'].includes(claimed)) {
                    violations.push(
                        `晶体结构错误：${symbol}（${info.aliases[0]}）室温下为 ${info.structure} 结构，题目声称为 ${claimed}。`
                    );
                }
            }
        }
    }

    // α-Fe / γ-Fe 的结构不能混
    if (/α-?Fe|α铁|铁素体/.test(text) && /(FCC|面心立方)/i.test(text) && !/γ|奥氏体/.test(text)) {
        violations.push('晶体结构错误：α-Fe（铁素体）为 BCC 结构，不是 FCC。');
    }
    if (/γ-?Fe|γ铁|奥氏体/.test(text) && /(BCC|体心立方)/i.test(text) && !/α|铁素体|马氏体/.test(text)) {
        violations.push('晶体结构错误：γ-Fe（奥氏体）为 FCC 结构，不是 BCC。');
    }

    // 配位数与结构的对应
    const cnMatch = text.match(/配位数\s*[=＝为]?\s*(\d+)/);
    if (cnMatch) {
        const cn = parseInt(cnMatch[1]);
        const expectedCN: Record<string, number> = { FCC: 12, HCP: 12, BCC: 8 };
        for (const [struct, expected] of Object.entries(expectedCN)) {
            const structMentioned = new RegExp(struct, 'i').test(text);
            if (structMentioned && cn !== expected && [8, 12].includes(cn)) {
                violations.push(
                    `晶体学错误：${struct} 结构的配位数为 ${expected}，题目给出配位数 ${cn}。`
                );
            }
        }
    }

    // 致密度（原子堆积因子）
    const apfMatch = text.match(/(?:致密度|堆积因子|APF)\s*[=＝为]?\s*(0?\.\d+)/);
    if (apfMatch) {
        const apf = parseFloat(apfMatch[1]);
        if (/FCC|面心立方|HCP|密排六方/i.test(text) && Math.abs(apf - 0.74) > 0.02) {
            violations.push(`晶体学错误：FCC/HCP 致密度为 0.74，题目给出 ${apf}。`);
        }
        if (/BCC|体心立方/i.test(text) && Math.abs(apf - 0.68) > 0.02) {
            violations.push(`晶体学错误：BCC 致密度为 0.68，题目给出 ${apf}。`);
        }
    }

    return violations;
}

/** 相变温度与相图自洽性校验 */
function validatePhaseTransition(text: string): string[] {
    const violations: string[] = [];

    // Fe-C 相图关键温度
    const A1 = 727;   // 共析温度
    const A3max = 912; // 纯铁 α→γ

    // 共析温度写错
    const eutectoidMatch = text.match(/共析(?:温度|反应|转变)[^。；\n]{0,20}?(\d{3,4})\s*°?C/);
    if (eutectoidMatch && /Fe-?C|铁碳|碳钢|钢/.test(text)) {
        const t = parseInt(eutectoidMatch[1]);
        if (Math.abs(t - A1) > 15) {
            violations.push(
                `相图错误：Fe-C 系共析温度（A1）为 ${A1}°C，题目给出 ${t}°C。`
            );
        }
    }

    // 共析成分写错
    const eutectoidCMatch = text.match(/共析(?:成分|点)[^。；\n]{0,20}?(0?\.\d+)\s*(?:%|wt)/);
    if (eutectoidCMatch && /Fe-?C|铁碳|碳钢/.test(text)) {
        const c = parseFloat(eutectoidCMatch[1]);
        if (Math.abs(c - 0.77) > 0.05 && Math.abs(c - 0.8) > 0.05) {
            violations.push(
                `相图错误：Fe-C 系共析成分约为 0.77 wt% C，题目给出 ${c} wt%。`
            );
        }
    }

    // 等温转变温度高于 A1 却声称发生珠光体/贝氏体转变
    const isothermalTempMatch = text.match(/(?:等温|保温)[^。；\n]{0,15}?(\d{3,4})\s*°?C/);
    if (isothermalTempMatch && /珠光体|贝氏体|pearlite|bainite/.test(text)) {
        const t = parseInt(isothermalTempMatch[1]);
        if (t > A1 + 20) {
            violations.push(
                `相变条件矛盾：等温温度 ${t}°C 高于共析温度 A1=${A1}°C，此温度下奥氏体稳定，不会发生珠光体/贝氏体转变。`
            );
        }
    }

    // 马氏体相变被描述为扩散型
    if (/马氏体|martensit/i.test(text) && /扩散型相变|扩散控制.*马氏体|马氏体.*扩散控制/.test(text)) {
        violations.push(
            '相变机制错误：马氏体相变为无扩散的切变型相变，不是扩散型/扩散控制相变。'
        );
    }

    // 杠杆定律用在单相区
    if (/杠杆定律|lever rule/i.test(text) && /单相区|单相区域/.test(text) && !/两相区/.test(text)) {
        violations.push(
            '相图应用错误：杠杆定律仅适用于两相区，单相区不适用。'
        );
    }

    // 热处理温度超过熔点
    const meltingPoints: Record<string, number> = {
        '铝': 660, 'Al': 660, '铜': 1085, 'Cu': 1085, '铁': 1538, 'Fe': 1538,
        '镁': 650, 'Mg': 650, '锌': 420, 'Zn': 420, '钛': 1668, 'Ti': 1668,
        '镍': 1455, 'Ni': 1455,
    };
    const heatTreatMatch = text.match(/(?:加热|保温|退火|淬火|固溶|时效|烧结)[^。；\n]{0,20}?(\d{3,4})\s*°?C/g);
    if (heatTreatMatch) {
        for (const [name, mp] of Object.entries(meltingPoints)) {
            if (!text.includes(name)) continue;
            for (const m of heatTreatMatch) {
                const tMatch = m.match(/(\d{3,4})\s*°?C/);
                if (!tMatch) continue;
                const t = parseInt(tMatch[1]);
                // 排除合金（合金熔点可能不同），只在明确提到纯金属时检查
                const isPure = new RegExp(`纯${name}|pure\\s*${name}`, 'i').test(text);
                if (isPure && t > mp) {
                    violations.push(
                        `工艺条件错误：纯${name}熔点为 ${mp}°C，题目中固相热处理温度 ${t}°C 已超过熔点。`
                    );
                }
            }
        }
    }

    return violations;
}

/** 力学性能参数合理性校验 */
function validateMechanicalProperties(text: string): string[] {
    const violations: string[] = [];

    // 屈服强度不应高于抗拉强度
    const ysMatch = text.match(/(?:屈服强度|σ_?[ys]|yield\s*strength)\s*[=＝为约]?\s*([\d.]+)\s*(MPa|GPa)/i);
    const utsMatch = text.match(/(?:抗拉强度|拉伸强度|σ_?[bu]|UTS|tensile\s*strength)\s*[=＝为约]?\s*([\d.]+)\s*(MPa|GPa)/i);
    if (ysMatch && utsMatch) {
        const toMPa = (v: string, u: string) => u.toUpperCase() === 'GPA' ? parseFloat(v) * 1000 : parseFloat(v);
        const ys = toMPa(ysMatch[1], ysMatch[2]);
        const uts = toMPa(utsMatch[1], utsMatch[2]);
        if (ys > uts * 1.02) {
            violations.push(
                `力学性能矛盾：屈服强度 ${ysMatch[1]}${ysMatch[2]} 高于抗拉强度 ${utsMatch[1]}${utsMatch[2]}，物理上不成立。`
            );
        }
    }

    // 弹性模量量级检查（金属 ~10-600 GPa，高分子 ~0.001-10 GPa）
    const eMatch = text.match(/(?:弹性模量|杨氏模量|Young'?s?\s*modulus|E)\s*[=＝为约]?\s*([\d.]+)\s*(MPa|GPa|TPa)/i);
    if (eMatch) {
        const unit = eMatch[2].toUpperCase();
        const val = parseFloat(eMatch[1]);
        const inGPa = unit === 'MPA' ? val / 1000 : unit === 'TPA' ? val * 1000 : val;
        const isPolymer = /高分子|聚合物|塑料|橡胶|polymer|PE\b|PP\b|PS\b|PMMA|PVC/.test(text);
        const isMetal = /金属|钢|合金|metal|steel|alloy/.test(text);
        const isCeramic = /陶瓷|ceramic|Al2O3|氧化铝|SiC|碳化硅/.test(text);

        if (isMetal && !isPolymer && (inGPa < 5 || inGPa > 700)) {
            violations.push(
                `力学参数不合理：金属弹性模量典型范围为 10-600 GPa（钢约 210 GPa、铝约 70 GPa），题目给出 ${inGPa.toFixed(2)} GPa。`
            );
        }
        if (isCeramic && !isPolymer && (inGPa < 20 || inGPa > 1200)) {
            violations.push(
                `力学参数不合理：陶瓷弹性模量典型范围为 50-1000 GPa（Al₂O₃ 约 380 GPa），题目给出 ${inGPa.toFixed(2)} GPa。`
            );
        }
        if (isPolymer && !isMetal && !isCeramic && inGPa > 20) {
            violations.push(
                `力学参数不合理：高分子材料弹性模量典型不超过 10 GPa（工程塑料 1-4 GPa），题目给出 ${inGPa.toFixed(2)} GPa。`
            );
        }
    }

    // 泊松比范围
    const nuMatch = text.match(/(?:泊松比|Poisson'?s?\s*ratio|ν)\s*[=＝为约]?\s*(-?[\d.]+)/i);
    if (nuMatch) {
        const nu = parseFloat(nuMatch[1]);
        if (nu > 0.5 || nu < -1) {
            violations.push(
                `力学参数不合理：等向材料泊松比理论范围为 -1 到 0.5（常见材料 0.2-0.45），题目给出 ${nu}。`
            );
        }
    }

    // 断裂韧性为负
    const kicMatch = text.match(/(?:断裂韧性|K_?IC)\s*[=＝为约]?\s*(-[\d.]+)/i);
    if (kicMatch) {
        violations.push(`力学参数错误：断裂韧性 K_IC 必须为正值，题目给出 ${kicMatch[1]}。`);
    }

    // Hall-Petch 关系方向反了
    if (/Hall-?Petch|霍尔.?佩奇/i.test(text)) {
        const wrongDirection = /晶粒(?:尺寸)?(?:越大|增大)[^。；\n]{0,20}强度(?:越高|增大|提高)/.test(text);
        if (wrongDirection) {
            violations.push(
                'Hall-Petch 关系错误：σy = σ0 + k/√d，晶粒尺寸 d 越小强度越高，题目描述方向相反。'
            );
        }
    }

    // Paris 公式方向
    if (/Paris|帕里斯/i.test(text) && /da\/dN/.test(text)) {
        if (/ΔK\s*(?:越大|增大)[^。；\n]{0,20}(?:扩展速率|da\/dN)\s*(?:越小|减小|降低)/.test(text)) {
            violations.push(
                '疲劳裂纹扩展错误：Paris 公式 da/dN = C(ΔK)^m 中，ΔK 增大裂纹扩展速率增大，题目描述方向相反。'
            );
        }
    }

    return violations;
}

/** 扩散与动力学参数校验 */
function validateDiffusionKinetics(text: string): string[] {
    const violations: string[] = [];

    // 扩散系数为负
    const dMatch = text.match(/(?:扩散系数|D)\s*[=＝为约]?\s*(-[\d.]+)/);
    if (dMatch && /扩散|diffusion/.test(text)) {
        violations.push(`动力学参数错误：扩散系数 D 必须为正值，题目给出 ${dMatch[1]}。`);
    }

    // 活化能为负（正向过程）
    const qMatch = text.match(/(?:活化能|扩散激活能|E_?a|Q)\s*[=＝为约]?\s*(-[\d.]+)\s*(kJ|J)/i);
    if (qMatch) {
        const isReverse = /逆反应|反向|负活化能/.test(text);
        if (!isReverse) {
            violations.push(
                `动力学参数错误：扩散/相变激活能必须为正值，题目给出 ${qMatch[1]} ${qMatch[2]}/mol。`
            );
        }
    }

    // Arrhenius 温度方向反了
    if (/Arrhenius|阿伦尼乌斯/i.test(text)) {
        if (/温度(?:升高|越高|增大)[^。；\n]{0,25}(?:扩散系数|速率|D|k)\s*(?:减小|降低|越小)/.test(text)) {
            violations.push(
                'Arrhenius 关系错误：D = D₀·exp(-Q/RT)，温度升高扩散系数/反应速率增大，题目描述方向相反。'
            );
        }
    }

    // Avrami/JMAK 指数范围
    const nMatch = text.match(/(?:Avrami\s*指数|JMAK[^。；\n]{0,10}指数|指数\s*n)\s*[=＝为约]?\s*([\d.]+)/i);
    if (nMatch && /Avrami|JMAK|结晶动力学|等温转变/i.test(text)) {
        const n = parseFloat(nMatch[1]);
        if (n <= 0 || n > 6) {
            violations.push(
                `动力学参数不合理：Avrami/JMAK 指数 n 的物理合理范围约为 0.5-4（形核+长大机制决定），题目给出 n=${n}。`
            );
        }
    }

    // 转变分数超出 0-1
    const fMatch = text.match(/转变(?:分数|量|率)\s*[=＝为约]?\s*([\d.]+)(?!\s*%)/);
    if (fMatch) {
        const f = parseFloat(fMatch[1]);
        if (f > 1.001) {
            violations.push(
                `物理量越界：转变分数以小数表示时必须在 0-1 之间，题目给出 ${f}（若为百分数请标注 %）。`
            );
        }
    }

    // Scherrer 公式方向
    if (/Scherrer|谢乐/i.test(text)) {
        if (/(?:半高宽|FWHM|峰宽)\s*(?:越大|增大)[^。；\n]{0,20}晶粒\s*(?:越大|增大)/.test(text)) {
            violations.push(
                'Scherrer 公式错误：D = Kλ/(β·cosθ)，衍射峰半高宽 β 越大晶粒尺寸越小，题目描述方向相反。'
            );
        }
    }

    return violations;
}

/** 工艺与极限条件校验 */
function validateProcessingConditions(text: string): string[] {
    const violations: string[] = [];

    // 冷加工温度高于再结晶温度却称为冷加工
    const coldWorkMatch = text.match(/冷(?:加工|变形|轧制)[^。；\n]{0,25}?(\d{3,4})\s*°?C/);
    if (coldWorkMatch) {
        const t = parseInt(coldWorkMatch[1]);
        // 大多数工程金属再结晶温度在 0.4Tm 以上；这里用一个宽松阈值避免误报
        if (t > 600) {
            violations.push(
                `工艺定义矛盾：题目称为冷加工但温度为 ${t}°C，该温度对多数工程金属已高于再结晶温度（应为热加工）。`
            );
        }
    }

    // 淬火介质与冷速矛盾
    if (/空冷|空气冷却/.test(text) && /马氏体/.test(text) && /碳钢|低合金钢/.test(text) && !/高合金|气淬|喷气/.test(text)) {
        violations.push(
            '工艺条件可疑：普通碳钢空冷通常得不到马氏体（冷速不足），需水淬或油淬。若为高合金钢请在题干中说明。'
        );
    }

    // 焊接预热温度低于 0
    const preheatMatch = text.match(/预热(?:温度)?\s*[=＝为约]?\s*(-[\d.]+)\s*°?C/);
    if (preheatMatch) {
        violations.push(`工艺参数错误：焊接预热温度不应为负值，题目给出 ${preheatMatch[1]}°C。`);
    }

    // 孔隙率超出 0-100%
    const porosityMatch = text.match(/孔隙率\s*[=＝为约]?\s*([\d.]+)\s*%/);
    if (porosityMatch) {
        const p = parseFloat(porosityMatch[1]);
        if (p >= 100 || p < 0) {
            violations.push(`物理量越界：孔隙率必须在 0-100% 之间，题目给出 ${p}%。`);
        }
    }

    // 相对密度超过 100%
    const relDensityMatch = text.match(/(?:相对密度|致密度)\s*[=＝为约]?\s*([\d.]+)\s*%/);
    if (relDensityMatch) {
        const d = parseFloat(relDensityMatch[1]);
        if (d > 100.5) {
            violations.push(`物理量越界：相对密度不能超过 100%，题目给出 ${d}%。`);
        }
    }

    return violations;
}

/** 高分子与陶瓷专项校验 */
function validatePolymerCeramic(text: string): string[] {
    const violations: string[] = [];

    // Tg 高于 Tm
    const tgMatch = text.match(/(?:T_?g|玻璃化转变温度)\s*[=＝为约]?\s*(-?[\d.]+)\s*(°?C|K)/i);
    const tmMatch = text.match(/(?:T_?m|熔点|熔融温度)\s*[=＝为约]?\s*(-?[\d.]+)\s*(°?C|K)/i);
    if (tgMatch && tmMatch) {
        const toC = (v: string, u: string) => u === 'K' ? parseFloat(v) - 273.15 : parseFloat(v);
        const tg = toC(tgMatch[1], tgMatch[2]);
        const tm = toC(tmMatch[1], tmMatch[2]);
        if (tg > tm) {
            violations.push(
                `高分子参数矛盾：玻璃化转变温度 Tg (${tgMatch[1]}${tgMatch[2]}) 不能高于熔点 Tm (${tmMatch[1]}${tmMatch[2]})。`
            );
        }
    }

    // 结晶度超出范围
    const crystallinityMatch = text.match(/结晶度\s*[=＝为约]?\s*([\d.]+)\s*%/);
    if (crystallinityMatch) {
        const c = parseFloat(crystallinityMatch[1]);
        if (c > 100 || c < 0) {
            violations.push(`物理量越界：结晶度必须在 0-100% 之间，题目给出 ${c}%。`);
        }
    }

    // 分散度 PDI < 1
    const pdiMatch = text.match(/(?:PDI|分散度|多分散(?:性)?指数|Mw\/Mn)\s*[=＝为约]?\s*([\d.]+)/i);
    if (pdiMatch) {
        const pdi = parseFloat(pdiMatch[1]);
        if (pdi < 1) {
            violations.push(
                `高分子参数错误：多分散指数 PDI = Mw/Mn ≥ 1（单分散极限为 1），题目给出 ${pdi}。`
            );
        }
    }

    // Mw < Mn
    const mwMatch = text.match(/M_?w\s*[=＝为约]?\s*([\d.]+(?:\s*[×x]\s*10\^?\d+)?)/i);
    const mnMatch = text.match(/M_?n\s*[=＝为约]?\s*([\d.]+(?:\s*[×x]\s*10\^?\d+)?)/i);
    if (mwMatch && mnMatch) {
        const parseVal = (s: string) => {
            const m = s.match(/([\d.]+)(?:\s*[×x]\s*10\^?(\d+))?/);
            if (!m) return NaN;
            return parseFloat(m[1]) * (m[2] ? Math.pow(10, parseInt(m[2])) : 1);
        };
        const mw = parseVal(mwMatch[1]);
        const mn = parseVal(mnMatch[1]);
        if (!isNaN(mw) && !isNaN(mn) && mw < mn * 0.99) {
            violations.push(
                `高分子参数矛盾：重均分子量 Mw 必须 ≥ 数均分子量 Mn，题目给出 Mw=${mwMatch[1]}, Mn=${mnMatch[1]}。`
            );
        }
    }

    // Weibull 模数为负
    const weibullMatch = text.match(/(?:Weibull\s*模数|威布尔模数|模数\s*m)\s*[=＝为约]?\s*(-[\d.]+)/i);
    if (weibullMatch) {
        violations.push(`陶瓷参数错误：Weibull 模数 m 必须为正值，题目给出 ${weibullMatch[1]}。`);
    }

    // 陶瓷被描述为有明显塑性变形
    if (/陶瓷|ceramic/i.test(text) && /室温[^。；\n]{0,15}(?:显著|明显|大量)(?:塑性变形|延展性)/.test(text)) {
        violations.push(
            '陶瓷性能描述错误：结构陶瓷在室温下为脆性材料，几乎无塑性变形能力（超塑性陶瓷需高温+细晶条件）。'
        );
    }

    return violations;
}

/** 半导体与磁性材料专项校验 */
function validateSemiconductorMagnetic(text: string): string[] {
    const violations: string[] = [];

    // 带隙为负
    const egMatch = text.match(/(?:带隙|禁带宽度|E_?g|band\s*gap)\s*[=＝为约]?\s*(-[\d.]+)\s*eV/i);
    if (egMatch) {
        violations.push(`半导体参数错误：带隙 Eg 必须为正值（金属可视为 0），题目给出 ${egMatch[1]} eV。`);
    }

    // 常见半导体带隙值
    const knownGaps: Record<string, { eg: number; names: string[] }> = {
        'Si': { eg: 1.12, names: ['硅', 'Si'] },
        'Ge': { eg: 0.67, names: ['锗', 'Ge'] },
        'GaAs': { eg: 1.42, names: ['砷化镓', 'GaAs'] },
        'GaN': { eg: 3.4, names: ['氮化镓', 'GaN'] },
        'SiC': { eg: 3.26, names: ['碳化硅', '4H-SiC'] },
    };
    const egValMatch = text.match(/(?:带隙|禁带宽度|E_?g)\s*[=＝为约]?\s*([\d.]+)\s*eV/i);
    if (egValMatch) {
        const eg = parseFloat(egValMatch[1]);
        for (const [key, info] of Object.entries(knownGaps)) {
            const mentioned = info.names.some(n => text.includes(n));
            // 只在题目明确只提到一种半导体时校验
            const otherMentioned = Object.entries(knownGaps)
                .filter(([k]) => k !== key)
                .some(([, i]) => i.names.some(n => text.includes(n)));
            if (mentioned && !otherMentioned && Math.abs(eg - info.eg) > 0.3) {
                violations.push(
                    `半导体参数错误：${info.names[0]} 室温带隙约为 ${info.eg} eV，题目给出 ${eg} eV。`
                );
            }
        }
    }

    // 掺杂类型与载流子矛盾
    if (/n\s*型|n-type/i.test(text) && /(?:多数载流子|majority\s*carrier)[^。；\n]{0,15}空穴/.test(text)) {
        violations.push('半导体掺杂错误：n 型半导体多数载流子为电子，不是空穴。');
    }
    if (/p\s*型|p-type/i.test(text) && /(?:多数载流子|majority\s*carrier)[^。；\n]{0,15}电子/.test(text)) {
        violations.push('半导体掺杂错误：p 型半导体多数载流子为空穴，不是电子。');
    }

    // 居里温度以上仍称铁磁
    const tcMatch = text.match(/(?:居里温度|T_?[Cc])\s*[=＝为约]?\s*([\d.]+)\s*(°?C|K)/);
    const tempMatch = text.match(/(?:工作温度|测试温度|环境温度)\s*[=＝为约]?\s*([\d.]+)\s*(°?C|K)/);
    if (tcMatch && tempMatch && /铁磁|ferromagnet/i.test(text)) {
        const toK = (v: string, u: string) => u === 'K' ? parseFloat(v) : parseFloat(v) + 273.15;
        const tc = toK(tcMatch[1], tcMatch[2]);
        const t = toK(tempMatch[1], tempMatch[2]);
        if (t > tc && !/顺磁|paramagnet|失去铁磁/i.test(text)) {
            violations.push(
                `磁性矛盾：工作温度 ${tempMatch[1]}${tempMatch[2]} 高于居里温度 ${tcMatch[1]}${tcMatch[2]}，材料应为顺磁态而非铁磁态。`
            );
        }
    }

    // 软磁/硬磁与矫顽力矛盾
    const hcMatch = text.match(/矫顽力\s*(?:H_?c)?\s*[=＝为约]?\s*([\d.]+)\s*(kA\/m|A\/m|Oe|kOe|T|mT)/i);
    if (hcMatch) {
        const val = parseFloat(hcMatch[1]);
        const unit = hcMatch[2].toLowerCase();
        // 统一换算成 A/m
        const toAm = unit === 'ka/m' ? val * 1000
            : unit === 'a/m' ? val
            : unit === 'oe' ? val * 79.577
            : unit === 'koe' ? val * 79577
            : unit === 't' ? val / (4 * Math.PI * 1e-7)
            : unit === 'mt' ? val * 1e-3 / (4 * Math.PI * 1e-7)
            : NaN;
        if (!isNaN(toAm)) {
            if (/软磁/.test(text) && toAm > 1e4) {
                violations.push(
                    `磁性参数矛盾：软磁材料矫顽力应很低（通常 < 1 kA/m），题目称软磁但给出 ${hcMatch[1]} ${hcMatch[2]}。`
                );
            }
            if (/(?:硬磁|永磁)/.test(text) && toAm < 1e4) {
                violations.push(
                    `磁性参数矛盾：永磁/硬磁材料矫顽力应很高（通常 > 100 kA/m），题目称永磁但给出 ${hcMatch[1]} ${hcMatch[2]}。`
                );
            }
        }
    }

    return violations;
}
