import type {
    BaseProblem,
    TrapModification,
    TrapCluster,
    ValidationResult
} from "../../../types/multiNodeTypes";

/**
 * Chemistry: Trap Fusion & Consistency Validator
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

    const consistencyChecks = validateChemistryConsistency(mergedTrapText);
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

    const strictFields = [
        '浓度', 'concentration', 'c',
        '温度', 'temperature', 'T',
        '压力', 'pressure', 'P',
        '体积', 'volume', 'V',
        'pH', '活度系数', 'activity coefficient',
        '平衡常数', 'equilibrium constant', 'K',
        '溶度积', 'solubility product', 'Ksp',
        'pKa', 'pKb', '摩尔质量', 'molar mass',
        '摩尔体积', 'molar volume',
        'ΔH', '焓变', 'enthalpy',
        'ΔG', '自由能', 'Gibbs energy',
        'ΔS', '熵变', 'entropy'
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

function validateChemistryConsistency(text: string): string[] {
    const violations: string[] = [];
    const lowerText = text.toLowerCase();

    // Thermodynamics: adiabatic + isothermal contradiction
    const adiabaticKeywords = ['绝热', 'adiabatic', '杜瓦瓶', 'dewar', '隔热'];
    const isothermalKeywords = ['恒温', '等温', 'isothermal', '温度恒定', '温度不变', '温度保持'];
    const hasAdiabatic = adiabaticKeywords.some(kw => lowerText.includes(kw));
    const hasIsothermal = isothermalKeywords.some(kw => lowerText.includes(kw));

    if (hasAdiabatic && hasIsothermal) {
        const heatExchangeKeywords = ['水浴', '加热器', '换热器', '冷却水', '恒温浴槽控制'];
        const hasHeatExchange = heatExchangeKeywords.some(kw => lowerText.includes(kw));
        if (!hasHeatExchange) {
            violations.push(
                '热力学矛盾：题目同时包含绝热条件和恒温条件，但未提供热交换机制。'
            );
        }
    }

    // Coordination chemistry: bidentate ligand count
    const coordMatch = text.match(/\[(\w+)L[₁-₉1-9]*\][²³⁺⁻\d+\-]*/g);
    if (coordMatch) {
        for (const match of coordMatch) {
            const subscriptMap: Record<string, number> = { '₁': 1, '₂': 2, '₃': 3, '₄': 4, '₅': 5, '₆': 6 };
            const ligandCountMatch = match.match(/L([₁-₉]|[1-9])/);
            if (ligandCountMatch) {
                const count = subscriptMap[ligandCountMatch[1]] || parseInt(ligandCountMatch[1]);
                if (count > 4 && (lowerText.includes('双齿') || lowerText.includes('bidentate') || lowerText.includes('螯合'))) {
                    violations.push(
                        `配位化学矛盾：双齿配体不可能形成 ${match}。六配位金属双齿配体最多3个。`
                    );
                }
            }
        }
    }

    // Electrochemistry checks
    const electrochemViolations = validateElectrochemistryConsistency(text);
    violations.push(...electrochemViolations);

    // Kinetics checks
    const kineticsViolations = validateKineticsConsistency(text);
    violations.push(...kineticsViolations);

    // Thermodynamics checks
    const thermoViolations = validateThermodynamicsConsistency(text);
    violations.push(...thermoViolations);

    // Acid-base checks
    const acidBaseViolations = validateAcidBaseConsistency(text);
    violations.push(...acidBaseViolations);

    // Equilibrium checks
    const equilibriumViolations = validateEquilibriumConsistency(text);
    violations.push(...equilibriumViolations);

    // Organic chemistry checks
    const organicViolations = validateOrganicConsistency(text);
    violations.push(...organicViolations);

    return violations;
}

/**
 * Electrochemistry consistency validation
 */
function validateElectrochemistryConsistency(text: string): string[] {
    const violations: string[] = [];

    // Nernst equation with temperature in Celsius instead of Kelvin
    const hasNernst = /Nernst|能斯特/.test(text);
    const hasCelsiusTemp = text.match(/T\s*[=＝]\s*(\d+)\s*°C/);
    if (hasNernst && hasCelsiusTemp) {
        const tempC = parseInt(hasCelsiusTemp[1]);
        if (tempC > 0 && tempC < 200) {
            const hasConversion = /\+\s*273|\d+\s*K/.test(text);
            if (!hasConversion) {
                violations.push(
                    `电化学潜在错误：Nernst方程中T=${tempC}°C，但要求绝对温度（K）。应使用T=${tempC + 273}K。`
                );
            }
        }
    }

    // Spontaneous cell with negative EMF
    const claimsSpontaneous = /自发|spontaneous|正向进行/.test(text);
    const negativeCellEMF = text.match(/E[_cell电池]*°?\s*[=＝]\s*(-[\d.]+)\s*V/);
    if (negativeCellEMF && claimsSpontaneous) {
        violations.push(
            '电化学矛盾：自发电池的EMF必须为正值（E_cell > 0），但计算得到负值并声称反应自发。'
        );
    }

    // Faraday's law electron count mismatch
    const faradayMatch = text.match(/转移\s*(\d+)\s*(?:mol\s*)?电子|n[_e]*\s*[=＝]\s*(\d+)/);
    const halfReactionMatch = text.match(/[+＋]\s*(\d+)\s*e[⁻-]/);
    if (faradayMatch && halfReactionMatch) {
        const claimedN = parseInt(faradayMatch[1] || faradayMatch[2]);
        const reactionN = parseInt(halfReactionMatch[1]);
        if (claimedN !== reactionN && claimedN > 0 && reactionN > 0) {
            violations.push(
                `电化学矛盾：声称转移${claimedN}个电子，但半反应显示转移${reactionN}个电子。`
            );
        }
    }

    return violations;
}

/**
 * Kinetics consistency validation
 */
function validateKineticsConsistency(text: string): string[] {
    const violations: string[] = [];

    // Negative rate constant
    const kMatch = text.match(/k\s*[=＝]\s*(-[\d.]+)\s*(s⁻¹|mol|L|M)/);
    if (kMatch) {
        const kValue = parseFloat(kMatch[1]);
        if (kValue < 0) {
            violations.push(`动力学矛盾：速率常数k=${kValue}<0，速率常数必须为正值。`);
        }
    }

    // Negative activation energy
    const eaMatch = text.match(/E[_a活化]*\s*[=＝]\s*(-[\d.]+)\s*(kJ|J)/);
    if (eaMatch) {
        const ea = parseFloat(eaMatch[1]);
        const isReverse = /逆反应|反向|负活化能/.test(text);
        if (ea < 0 && !isReverse) {
            violations.push(`动力学矛盾：活化能Ea=${ea}${eaMatch[2]}/mol为负值，正反应活化能必须≥0。`);
        }
    }

    // Half-life formula mismatch with reaction order
    const hasFirstOrderHL = /t[½₁\/₂]\s*[=＝]\s*(?:ln\s*2|0\.693)\s*[/／]\s*k/.test(text);
    const claimsSecondOrder = /二级反应|second.order/.test(text);
    if (hasFirstOrderHL && claimsSecondOrder) {
        violations.push(
            '动力学矛盾：使用了一级反应半衰期公式t½=ln2/k，但题目声称为二级反应。'
        );
    }

    return violations;
}

/**
 * Thermodynamics consistency validation
 */
function validateThermodynamicsConsistency(text: string): string[] {
    const violations: string[] = [];

    // ΔG° and K sign consistency: ΔG°<0 implies K>1, ΔG°>0 implies K<1
    const deltaGMatch = text.match(/ΔG°?\s*[=＝]\s*(-?[\d.]+)\s*(kJ|J)/);
    const kEqMatch = text.match(/K\s*[=＝]\s*([\d.]+(?:[×x]\s*10[⁻⁺\-+]?\d+)?)/);
    if (deltaGMatch && kEqMatch) {
        const deltaG = parseFloat(deltaGMatch[1]);
        const kStr = kEqMatch[1].replace(/[×x]\s*10/, 'e').replace(/[⁻⁺]/g, m => m === '⁻' ? '-' : '+');
        const K = parseFloat(kStr);
        if (!isNaN(K) && K > 0) {
            if (deltaG < -5 && K < 1) {
                violations.push(
                    `热力学矛盾：ΔG°=${deltaG}${deltaGMatch[2]}/mol<0意味着K>1，但题目给K=${kEqMatch[1]}<1。`
                );
            }
            if (deltaG > 5 && K > 1) {
                violations.push(
                    `热力学矛盾：ΔG°=${deltaG}${deltaGMatch[2]}/mol>0意味着K<1，但题目给K=${kEqMatch[1]}>1。`
                );
            }
        }
    }

    // Entropy change sign for obvious processes
    const hasEntropySMatch = text.match(/ΔS°?\s*[=＝]\s*(-?[\d.]+)\s*J/);
    if (hasEntropySMatch) {
        const deltaS = parseFloat(hasEntropySMatch[1]);
        const isGasExpansion = /气体.*膨胀|体积增大|mol.*气体增多/.test(text);
        const isGasCompression = /气体.*压缩|体积减小|mol.*气体减少/.test(text);
        if (isGasExpansion && deltaS < -50) {
            violations.push(
                `热力学潜在错误：气体膨胀/气体物质的量增多过程ΔS应为正值，但给出ΔS=${deltaS}J/(mol·K)。`
            );
        }
        if (isGasCompression && deltaS > 50) {
            violations.push(
                `热力学潜在错误：气体压缩/气体物质的量减少过程ΔS应为负值，但给出ΔS=${deltaS}J/(mol·K)。`
            );
        }
    }

    return violations;
}

/**
 * Acid-base consistency validation
 */
function validateAcidBaseConsistency(text: string): string[] {
    const violations: string[] = [];

    // pH out of range for aqueous solution
    const pHMatch = text.match(/pH\s*[=＝]\s*(-?[\d.]+)/);
    if (pHMatch) {
        const pH = parseFloat(pHMatch[1]);
        const isAqueous = /水溶液|aqueous|水中|溶液/.test(text);
        const isConcentrated = /浓酸|浓碱|超酸|超强/.test(text);
        if (isAqueous && !isConcentrated) {
            if (pH < -1 || pH > 15) {
                violations.push(
                    `酸碱矛盾：水溶液中pH=${pH}超出合理范围。常规水溶液pH∈[0,14]，极端情况可到[-1,15]。`
                );
            }
        }
    }

    // pKa + pKb = 14 (conjugate pair) consistency
    const pKaMatch = text.match(/pK[_a]*\s*[=＝]\s*([\d.]+)/);
    const pKbMatch = text.match(/pK[_b]*\s*[=＝]\s*([\d.]+)/);
    if (pKaMatch && pKbMatch) {
        const pKa = parseFloat(pKaMatch[1]);
        const pKb = parseFloat(pKbMatch[1]);
        const isConjugate = /共轭|conjugate/.test(text);
        if (isConjugate && Math.abs(pKa + pKb - 14) > 0.5) {
            violations.push(
                `酸碱矛盾：共轭酸碱对pKa+pKb应=14（25°C水溶液），但pKa=${pKa}+pKb=${pKb}=${(pKa + pKb).toFixed(1)}≠14。`
            );
        }
    }

    // Buffer pH far from pKa
    const isBuffer = /缓冲|buffer/.test(text);
    if (isBuffer && pKaMatch && pHMatch) {
        const pKa = parseFloat(pKaMatch[1]);
        const pH = parseFloat(pHMatch[1]);
        if (Math.abs(pH - pKa) > 2) {
            violations.push(
                `酸碱潜在错误：缓冲溶液pH=${pH}偏离pKa=${pKa}超过2个单位，缓冲能力极弱，不应称为有效缓冲。`
            );
        }
    }

    return violations;
}

/**
 * Equilibrium consistency validation
 */
function validateEquilibriumConsistency(text: string): string[] {
    const violations: string[] = [];

    // Equilibrium constant must be positive
    const kNegativeMatch = text.match(/K[_eq平衡sp]*\s*[=＝]\s*(-[\d.]+)/);
    if (kNegativeMatch) {
        violations.push(
            `平衡矛盾：平衡常数K=${kNegativeMatch[1]}<0，平衡常数必须为正值。`
        );
    }

    // Le Chatelier: exothermic reaction + temperature increase should decrease K
    const isExothermic = /放热|exothermic|ΔH\s*[<＜]\s*0|ΔH°?\s*[=＝]\s*-/.test(text);
    const tempIncrease = /升温|温度升高|加热.*平衡|T[₂2]\s*[>＞]\s*T[₁1]/.test(text);
    const kIncreases = /K[₂2]\s*[>＞]\s*K[₁1]|平衡常数增大|K.*增大/.test(text);
    if (isExothermic && tempIncrease && kIncreases) {
        violations.push(
            '平衡矛盾：放热反应升温时K应减小（van\'t Hoff方程：ΔH<0, T↑→K↓），但题目声称K增大。'
        );
    }

    // Endothermic + temperature increase should increase K
    const isEndothermic = /吸热|endothermic|ΔH\s*[>＞]\s*0/.test(text);
    const kDecreases = /K[₂2]\s*[<＜]\s*K[₁1]|平衡常数减小|K.*减小/.test(text);
    if (isEndothermic && tempIncrease && kDecreases) {
        violations.push(
            '平衡矛盾：吸热反应升温时K应增大（van\'t Hoff方程：ΔH>0, T↑→K↑），但题目声称K减小。'
        );
    }

    return violations;
}

/**
 * Organic chemistry consistency validation
 */
function validateOrganicConsistency(text: string): string[] {
    const violations: string[] = [];

    // Carbon with more than 4 bonds
    const carbonPentavalent = /碳.*五键|碳.*5个键|五配位碳|pentavalent.*carbon/.test(text);
    if (carbonPentavalent) {
        const isTransitionState = /过渡态|transition state|SN2/.test(text);
        if (!isTransitionState) {
            violations.push(
                '有机化学矛盾：碳原子价键数必须为4（sp3/sp2/sp杂化），检测到五配位碳描述。'
            );
        }
    }

    // Hückel rule: 4n+2 electrons for aromaticity
    const electronCount = text.match(/(\d+)\s*个?\s*π电子.*芳香|芳香.*(\d+)\s*个?\s*π电子/);
    if (electronCount) {
        const nElectrons = parseInt(electronCount[1] || electronCount[2]);
        const remainder = (nElectrons - 2) % 4;
        const claimsAromatic = /芳香性|aromatic|满足.*[Hh]ückel|满足.*休克尔/.test(text);
        const claimsAntiAromatic = /反芳香|antiaromatic/.test(text);
        if (claimsAromatic && remainder !== 0) {
            violations.push(
                `有机化学矛盾：声称${nElectrons}个π电子体系具有芳香性，但${nElectrons}不满足Hückel 4n+2规则。`
            );
        }
        if (claimsAntiAromatic && nElectrons % 4 !== 0) {
            violations.push(
                `有机化学矛盾：声称${nElectrons}个π电子体系为反芳香性，但${nElectrons}不满足4n规则。`
            );
        }
    }

    // Woodward-Hoffmann: thermal conrotatory/disrotatory mismatch
    const hasElectrocyclic = /电环化|electrocyclic/.test(text);
    if (hasElectrocyclic) {
        const thermalConrot = /热.*顺旋|加热.*conrotatory|Δ.*conrotatory/.test(text);
        const thermalDisrot = /热.*对旋|加热.*disrotatory|Δ.*disrotatory/.test(text);
        const electronMatch = text.match(/(\d+)\s*个?\s*(?:π)?电子.*电环化|电环化.*(\d+)\s*个?\s*(?:π)?电子/);
        if (electronMatch) {
            const n = parseInt(electronMatch[1] || electronMatch[2]);
            const is4n = n % 4 === 0;
            if (is4n && thermalDisrot) {
                violations.push(
                    `有机化学矛盾：${n}π电子(4n)电环化热反应应为顺旋(conrotatory)，但题目声称为对旋。`
                );
            }
            if (!is4n && (n - 2) % 4 === 0 && thermalConrot) {
                violations.push(
                    `有机化学矛盾：${n}π电子(4n+2)电环化热反应应为对旋(disrotatory)，但题目声称为顺旋。`
                );
            }
        }
    }

    return violations;
}
