import type {
    BaseProblem,
    TrapModification,
    ValidationResult
} from "../../../types/multiNodeTypes";

/**
 * Finance: Trap Fusion & Consistency Validator
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

    const consistencyChecks = validateFinanceConsistency(mergedTrapText);
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
        '利率', 'rate', 'r',
        '收益率', 'yield', 'ytm',
        '波动率', 'volatility', 'sigma', 'σ',
        '价格', 'price', 'S', 'K',
        '期限', 'maturity', 'tenor', 'T',
        '现金流', 'cash flow', 'CF',
        '折现率', 'discount rate', 'WACC',
        '资本成本', 'cost of capital',
        '名义本金', 'notional',
        '久期', 'duration', '凸性', 'convexity',
        '价差', 'spread', 'bp',
        '危险率', 'hazard rate', 'λ',
        '死亡率', 'mortality', 'q_x',
        '保费', 'premium', '准备金', 'reserve',
        'VaR', 'TVaR', '在险价值',
        '汇率', 'exchange rate', 'FX',
        'EBITDA', '净利润', 'net income',
        '贝塔', 'beta', 'β'
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

function validateFinanceConsistency(text: string): string[] {
    const violations: string[] = [];
    const lowerText = text.toLowerCase();

    // Measure discipline: risk-neutral pricing must not discount real-world expected returns
    const claimsRiskNeutral = /风险中性|risk[- ]neutral|测度\s*ℚ|Q\s*测度/.test(text);
    const usesRealWorldDrift = /真实世界(?:期望)?(?:收益|回报)|真实概率|历史期望收益|physical measure|真实测度/.test(text);
    if (claimsRiskNeutral && usesRealWorldDrift) {
        const explicitlyContrasted = /对比|区分|辨析|不得混用|请判断/.test(text);
        if (!explicitlyContrasted) {
            violations.push(
                '测度矛盾：题目同时声明风险中性定价与真实世界期望收益折现，但未说明二者的区分用途。'
            );
        }
    }

    // Compounding convention must be declared whenever both continuous and discrete appear
    const hasContinuous = /连续复利|continuously compounded|e\^\(?[-−]?\s*r/.test(text);
    const hasDiscrete = /年复利|半年复利|季度复利|annually compounded|semi[- ]annual/.test(text);
    if (hasContinuous && hasDiscrete) {
        const hasConversion = /等价换算|折算为|换算成|equivalent rate|连续复利等价/.test(text);
        if (!hasConversion) {
            violations.push(
                '复利约定矛盾：题目并存连续复利与离散复利报价，但未给出换算口径说明，将导致答案不唯一。'
            );
        }
    }

    const derivativesViolations = validateDerivativesConsistency(text);
    violations.push(...derivativesViolations);

    const rateViolations = validateRateAndDiscountConsistency(text);
    violations.push(...rateViolations);

    const distributionViolations = validateDistributionConsistency(text);
    violations.push(...distributionViolations);

    const econometricsViolations = validateEconometricsConsistency(text);
    violations.push(...econometricsViolations);

    const actuarialViolations = validateActuarialConsistency(text);
    violations.push(...actuarialViolations);

    const statementViolations = validateStatementConsistency(text);
    violations.push(...statementViolations);

    const fxViolations = validateFxConsistency(text, lowerText);
    violations.push(...fxViolations);

    return violations;
}

/**
 * Derivatives pricing consistency validation
 */
function validateDerivativesConsistency(text: string): string[] {
    const violations: string[] = [];

    // Volatility must be positive and within a realizable band
    const sigmaMatch = text.match(/(?:波动率|volatility|σ)\s*[=＝]?\s*(-?[\d.]+)\s*%/);
    if (sigmaMatch) {
        const sigma = parseFloat(sigmaMatch[1]);
        if (sigma <= 0) {
            violations.push(`衍生品矛盾：年化波动率 σ=${sigma}% ≤ 0，波动率必须为正值。`);
        } else if (sigma > 200) {
            violations.push(`衍生品潜在错误：年化波动率 σ=${sigma}% 超出可实现区间（0, 200%]。`);
        }
    }

    // Correlation must be in [-1, 1]
    const rhoMatch = text.match(/(?:相关系数|correlation|ρ)\s*[=＝]\s*(-?[\d.]+)/);
    if (rhoMatch) {
        const rho = parseFloat(rhoMatch[1]);
        if (rho < -1 || rho > 1) {
            violations.push(`衍生品矛盾：相关系数 ρ=${rho} 超出 [−1, 1]。`);
        }
    }

    // Recovery rate must be in [0, 1]
    const recoveryMatch = text.match(/回收率\s*[=＝]?\s*(-?[\d.]+)\s*%/);
    if (recoveryMatch) {
        const recovery = parseFloat(recoveryMatch[1]);
        if (recovery < 0 || recovery > 100) {
            violations.push(`信用衍生品矛盾：回收率 R=${recovery}% 超出 [0%, 100%]。`);
        }
    }

    // Hazard rate must be positive
    const hazardMatch = text.match(/(?:危险率|违约强度|hazard rate|λ)\s*[=＝]\s*(-[\d.]+)/);
    if (hazardMatch) {
        violations.push(
            `信用衍生品矛盾：危险率 λ=${hazardMatch[1]} < 0，违约强度必须为正值。`
        );
    }

    // No-arbitrage bound: European call cannot exceed spot
    const callMatch = text.match(/(?:看涨期权|call)\s*(?:价格|premium|价值)?\s*[=＝]\s*([\d.]+)/);
    const spotMatch = text.match(/(?:标的|现价|即期价格|S[₀0]?)\s*[=＝]\s*([\d.]+)/);
    if (callMatch && spotMatch) {
        const call = parseFloat(callMatch[1]);
        const spot = parseFloat(spotMatch[1]);
        if (call > spot) {
            violations.push(
                `无套利边界违反：欧式看涨期权价格 ${call} 超过标的现价 ${spot}，违反 C ≤ S₀。`
            );
        }
    }

    // American option cannot be cheaper than the otherwise identical European option
    const americanMatch = text.match(/美式(?:期权)?\s*(?:价格|价值)?\s*[=＝]\s*([\d.]+)/);
    const europeanMatch = text.match(/欧式(?:期权)?\s*(?:价格|价值)?\s*[=＝]\s*([\d.]+)/);
    if (americanMatch && europeanMatch) {
        const american = parseFloat(americanMatch[1]);
        const european = parseFloat(europeanMatch[1]);
        if (american < european) {
            violations.push(
                `无套利边界违反：美式期权价格 ${american} 低于同参数欧式期权价格 ${european}。`
            );
        }
    }

    // Volatility layer confusion: implied vol fed straight into a local-vol model
    const hasImpliedVol = /隐含波动率|implied volatility/.test(text);
    const hasLocalVol = /局部波动率|local volatility|Dupire/.test(text);
    if (hasImpliedVol && hasLocalVol) {
        const distinguishes = /区分|辨析|不等于|不可直接|Dupire\s*公式/.test(text);
        if (!distinguishes) {
            violations.push(
                '波动率层次矛盾：题目并列隐含波动率与局部波动率但未说明二者关系，直接混用会导致定价错误。'
            );
        }
    }

    return violations;
}

/**
 * Interest rate & discounting consistency validation
 */
function validateRateAndDiscountConsistency(text: string): string[] {
    const violations: string[] = [];

    // FCFF must be paired with WACC, FCFE with cost of equity
    const hasFCFF = /FCFF|公司自由现金流/.test(text);
    const hasFCFE = /FCFE|股权自由现金流/.test(text);
    const hasWACC = /WACC|加权平均资本成本/.test(text);
    const hasCostOfEquity = /股权资本成本|k_?e|权益成本/.test(text);

    if (hasFCFF && !hasWACC && hasCostOfEquity) {
        violations.push(
            '折现口径错配：题目使用 FCFF 但只提供股权资本成本，FCFF 必须以 WACC 折现。'
        );
    }
    if (hasFCFE && !hasCostOfEquity && hasWACC) {
        violations.push(
            '折现口径错配：题目使用 FCFE 但只提供 WACC，FCFE 必须以股权资本成本折现。'
        );
    }

    // Nominal vs real mismatch
    const hasNominalCF = /名义现金流|nominal cash flow/.test(text);
    const hasRealRate = /实际(?:折现率|利率)|real (?:discount )?rate/.test(text);
    const hasRealCF = /实际现金流|real cash flow/.test(text);
    const hasNominalRate = /名义(?:折现率|利率)|nominal (?:discount )?rate/.test(text);
    if (hasNominalCF && hasRealRate && !hasNominalRate) {
        violations.push(
            '折现口径错配：名义现金流必须以名义折现率折现，但题目仅提供实际折现率（Fisher 关系未给出）。'
        );
    }
    if (hasRealCF && hasNominalRate && !hasRealRate) {
        violations.push(
            '折现口径错配：实际现金流必须以实际折现率折现，但题目仅提供名义折现率（Fisher 关系未给出）。'
        );
    }

    // Terminal value growth rate must not exceed the discount rate
    const growthMatch = text.match(/(?:永续增长率|终值增长率|g)\s*[=＝]\s*([\d.]+)\s*%/);
    const waccMatch = text.match(/(?:WACC|加权平均资本成本)\s*[=＝]\s*([\d.]+)\s*%/);
    if (growthMatch && waccMatch) {
        const g = parseFloat(growthMatch[1]);
        const wacc = parseFloat(waccMatch[1]);
        if (g >= wacc) {
            violations.push(
                `估值矛盾：永续增长率 g=${g}% ≥ 折现率 ${wacc}%，Gordon 增长模型的终值将为负或无穷。`
            );
        }
    }

    // Leverage path dependence: changing capital structure with a single fixed WACC
    const leverageChanges = /资本结构(?:显著)?(?:变化|调整)|债务(?:逐年)?(?:偿还|下降|上升)|去杠杆|杠杆率.*(?:逐年|每年).*(?:变化|下降|上升)/.test(text);
    const usesFixedWacc = /(?:恒定|固定|不变)的?\s*WACC|WACC\s*(?:保持)?(?:恒定|不变)/.test(text);
    if (leverageChanges && usesFixedWacc) {
        violations.push(
            '杠杆路径矛盾：资本结构在预测期内变化时，单一固定 WACC 折现失效，应使用 APV 或逐期 WACC。'
        );
    }

    // Duration/convexity sanity
    const durationMatch = text.match(/(?:久期|duration)\s*[=＝]\s*(-[\d.]+)/);
    if (durationMatch) {
        const isShort = /空头|做空|负久期头寸|short position/.test(text);
        if (!isShort) {
            violations.push(
                `固定收益矛盾：多头普通债券久期 ${durationMatch[1]} 为负值，普通付息债券久期必须为正。`
            );
        }
    }

    return violations;
}

/**
 * Distribution & risk-measure consistency validation
 */
function validateDistributionConsistency(text: string): string[] {
    const violations: string[] = [];

    // Probability-like quantities must be in [0, 1]
    const probMatch = text.match(/(?:违约概率|概率|probability)\s*[=＝]\s*(-?[\d.]+)\s*%/);
    if (probMatch) {
        const p = parseFloat(probMatch[1]);
        if (p < 0 || p > 100) {
            violations.push(`概率公理违反：概率 ${p}% 超出 [0%, 100%]。`);
        }
    }

    // Pareto tail: variance exists only when alpha > 2
    const alphaMatch = text.match(/(?:形状参数|尾部指数|α|alpha)\s*[=＝]\s*([\d.]+)/);
    if (alphaMatch) {
        const alpha = parseFloat(alphaMatch[1]);
        const asksVariance = /(?:方差|标准差|variance|standard deviation)/.test(text);
        const isHeavyTail = /Pareto|帕累托|重尾|幂律/.test(text);
        if (isHeavyTail && asksVariance && alpha <= 2) {
            const acknowledgesNonexistence = /不存在|无穷|发散|不可用/.test(text);
            if (!acknowledgesNonexistence) {
                violations.push(
                    `重尾矩矛盾：Pareto 形状参数 α=${alpha} ≤ 2 时方差不存在，但题目要求计算方差/标准差。`
                );
            }
        }
    }

    // VaR confidence level must be in (0, 1)
    const confMatch = text.match(/(?:置信水平|confidence level)\s*[=＝]?\s*([\d.]+)\s*%/);
    if (confMatch) {
        const conf = parseFloat(confMatch[1]);
        if (conf <= 0 || conf >= 100) {
            violations.push(`风险度量矛盾：置信水平 ${conf}% 必须严格落在 (0%, 100%) 内。`);
        }
    }

    // TVaR must be at least as large as VaR at the same level
    const varMatch = text.match(/VaR\s*[=＝]\s*([\d.]+)/);
    const tvarMatch = text.match(/(?:TVaR|CVaR|ES|期望损失)\s*[=＝]\s*([\d.]+)/);
    if (varMatch && tvarMatch) {
        const varValue = parseFloat(varMatch[1]);
        const tvarValue = parseFloat(tvarMatch[1]);
        if (tvarValue < varValue) {
            violations.push(
                `风险度量矛盾：同置信水平下 TVaR=${tvarValue} 小于 VaR=${varValue}，TVaR ≥ VaR 恒成立。`
            );
        }
    }

    // Claiming subadditivity for VaR
    const claimsVarSubadditive = /VaR.*(?:满足|具有)\s*次可加性|VaR.*一致性风险度量/.test(text);
    if (claimsVarSubadditive) {
        violations.push(
            '风险度量矛盾：VaR 一般不满足次可加性，也不是一致性风险度量（TVaR 才是）。'
        );
    }

    return violations;
}

/**
 * Econometrics consistency validation
 */
function validateEconometricsConsistency(text: string): string[] {
    const violations: string[] = [];

    // ADF null hypothesis is "unit root exists"
    const adfNullStationary = /ADF.*原假设.*(?:平稳|不存在单位根)/.test(text);
    if (adfNullStationary) {
        violations.push(
            '计量矛盾：ADF 检验的原假设是"存在单位根（非平稳）"，题目将原假设写成了平稳。'
        );
    }

    // KPSS null hypothesis is "stationary"
    const kpssNullUnitRoot = /KPSS.*原假设.*(?:存在单位根|非平稳)/.test(text);
    if (kpssNullUnitRoot) {
        violations.push(
            '计量矛盾：KPSS 检验的原假设是"序列平稳"，题目将原假设写成了存在单位根。'
        );
    }

    // R² must be in [0, 1]
    const r2Match = text.match(/R[²2]\s*[=＝]\s*(-?[\d.]+)/);
    if (r2Match) {
        const r2 = parseFloat(r2Match[1]);
        if (r2 < 0 || r2 > 1) {
            const isAdjusted = /调整后\s*R[²2]|adjusted\s*R[²2]/.test(text);
            if (!(isAdjusted && r2 < 0)) {
                violations.push(`计量矛盾：R²=${r2} 超出 [0, 1]（仅调整后 R² 可为负）。`);
            }
        }
    }

    // Causal claims from OLS without identification
    const claimsCausal = /(?:因果效应|causal effect|导致|因果解读)/.test(text);
    const hasEndogeneity = /内生|endogen|遗漏变量|反向因果|测量误差/.test(text);
    const hasIdentification = /工具变量|IV|双重差分|DID|断点回归|RDD|随机(?:化)?实验|外生冲击/.test(text);
    if (claimsCausal && hasEndogeneity && !hasIdentification) {
        violations.push(
            '识别假设缺失：题目在存在内生性的情形下直接给出因果解读，但未提供任何识别策略。'
        );
    }

    // Weak instrument with a strong causal conclusion
    const firstStageFMatch = text.match(/(?:第一阶段|first[- ]stage)\s*F\s*(?:统计量)?\s*[=＝]\s*([\d.]+)/);
    if (firstStageFMatch) {
        const fStat = parseFloat(firstStageFMatch[1]);
        const claimsValidIv = /工具变量.*(?:有效|可靠)|IV.*(?:一致|无偏)/.test(text);
        if (fStat < 10 && claimsValidIv) {
            violations.push(
                `计量矛盾：第一阶段 F=${fStat} < 10 属弱工具变量，2SLS 估计存在严重偏误，不能声称有效。`
            );
        }
    }

    // Parallel trends required for DID
    const hasDid = /双重差分|DID|difference[- ]in[- ]differences/.test(text);
    if (hasDid) {
        const hasParallelTrends = /平行趋势|parallel trends|共同趋势/.test(text);
        if (!hasParallelTrends) {
            violations.push(
                '识别假设缺失：使用双重差分但题面未给出可检验的平行趋势假设条件。'
            );
        }
    }

    return violations;
}

/**
 * Actuarial consistency validation
 */
function validateActuarialConsistency(text: string): string[] {
    const violations: string[] = [];

    // Mortality rate must be in (0, 1)
    const qxMatch = text.match(/(?:死亡率|q[_x]*)\s*[=＝]\s*(-?[\d.]+)\s*(?:%|‰)?/);
    if (qxMatch) {
        const raw = qxMatch[0];
        const value = parseFloat(qxMatch[1]);
        const asFraction = raw.includes('%') ? value / 100 : raw.includes('‰') ? value / 1000 : value;
        if (asFraction < 0 || asFraction > 1) {
            violations.push(`精算矛盾：死亡率 ${raw} 换算后为 ${asFraction}，必须落在 [0, 1] 内。`);
        }
    }

    // Survival probability plus death probability must equal 1
    const pxMatch = text.match(/(?:生存概率|p[_x]*)\s*[=＝]\s*([\d.]+)/);
    if (pxMatch && qxMatch && !qxMatch[0].includes('%') && !qxMatch[0].includes('‰')) {
        const px = parseFloat(pxMatch[1]);
        const qx = parseFloat(qxMatch[1]);
        if (px <= 1 && qx <= 1 && Math.abs(px + qx - 1) > 0.005) {
            violations.push(
                `精算矛盾：同一年龄的 p_x=${px} 与 q_x=${qx} 之和为 ${(px + qx).toFixed(3)}≠1。`
            );
        }
    }

    // Credibility factor must be in [0, 1]
    const zMatch = text.match(/(?:信度因子|credibility|Z)\s*[=＝]\s*(-?[\d.]+)(?!\s*%)/);
    if (zMatch) {
        const z = parseFloat(zMatch[1]);
        if (z < 0 || z > 1) {
            violations.push(`精算矛盾：Bühlmann 信度因子 Z=${z} 超出 [0, 1]。`);
        }
    }

    // Fractional-age assumptions are mutually exclusive
    const assumptions = [
        /UDD|均匀分布假设/.test(text),
        /(?:恒定死力|constant force)/.test(text),
        /Balducci|双曲假设/.test(text)
    ].filter(Boolean).length;
    if (assumptions > 1) {
        const isComparison = /比较|对比|排序|辨析/.test(text);
        if (!isComparison) {
            violations.push(
                '精算矛盾：题目同时使用多个分数年龄假设（UDD/恒定死力/Balducci），三者互斥且结果不同。'
            );
        }
    }

    // Deductible affects both frequency and severity
    const hasDeductible = /免赔额|deductible/.test(text);
    if (hasDeductible) {
        const onlySeverity = /免赔额.*(?:仅|只)影响(?:索赔)?(?:强度|金额)|索赔频率.*不变/.test(text);
        if (onlySeverity) {
            violations.push(
                '精算矛盾：普通免赔额同时改变索赔频率（小额索赔被截断）与索赔强度，不能声称频率不变。'
            );
        }
    }

    // Reserve must not be negative without explanation
    const reserveMatch = text.match(/准备金\s*[=＝]\s*(-[\d.]+)/);
    if (reserveMatch) {
        const allowsNegative = /负准备金|zillmer|修正准备金|首年费用/.test(text);
        if (!allowsNegative) {
            violations.push(
                `精算潜在错误：准备金 ${reserveMatch[1]} 为负值，普通净准备金应非负（除修正准备金法）。`
            );
        }
    }

    return violations;
}

/**
 * Financial statement consistency validation
 */
function validateStatementConsistency(text: string): string[] {
    const violations: string[] = [];

    // Balance sheet identity
    const assetsMatch = text.match(/(?:总资产|资产总额)\s*[=＝]\s*([\d.]+)/);
    const liabilitiesMatch = text.match(/(?:总负债|负债总额)\s*[=＝]\s*([\d.]+)/);
    const equityMatch = text.match(/(?:所有者权益|股东权益|净资产)\s*(?:合计|总额)?\s*[=＝]\s*([\d.]+)/);
    if (assetsMatch && liabilitiesMatch && equityMatch) {
        const assets = parseFloat(assetsMatch[1]);
        const total = parseFloat(liabilitiesMatch[1]) + parseFloat(equityMatch[1]);
        if (Math.abs(assets - total) > Math.max(0.01, assets * 0.005)) {
            violations.push(
                `会计恒等式违反：资产 ${assets} ≠ 负债 + 所有者权益 ${total.toFixed(2)}。`
            );
        }
    }

    // Capitalization vs expensing comparability
    const hasCapitalization = /资本化/.test(text);
    const hasExpensing = /费用化/.test(text);
    const comparesRatios = /(?:直接)?(?:横向)?比较|可比公司|对比两家|ROE.*对比/.test(text);
    if (hasCapitalization && hasExpensing && comparesRatios) {
        const adjusts = /调整(?:为同一)?口径|统一口径|还原|重述/.test(text);
        if (!adjusts) {
            violations.push(
                '会计可比性矛盾：题目比较资本化与费用化口径不同的公司比率，但未做口径调整。'
            );
        }
    }

    // Interest coverage must be positive when EBIT is positive
    const ebitMatch = text.match(/EBIT\s*[=＝]\s*([\d.]+)/);
    const coverageMatch = text.match(/(?:利息保障倍数|interest coverage)\s*[=＝]\s*(-[\d.]+)/);
    if (ebitMatch && coverageMatch && parseFloat(ebitMatch[1]) > 0) {
        violations.push(
            `财务分析矛盾：EBIT=${ebitMatch[1]} > 0 时利息保障倍数 ${coverageMatch[1]} 不应为负。`
        );
    }

    // Tax rate must be in [0, 1)
    const taxMatch = text.match(/(?:税率|tax rate)\s*[=＝]\s*(-?[\d.]+)\s*%/);
    if (taxMatch) {
        const tax = parseFloat(taxMatch[1]);
        if (tax < 0 || tax >= 100) {
            violations.push(`财务矛盾：税率 ${tax}% 必须落在 [0%, 100%) 内。`);
        }
    }

    // IRR uniqueness with sign-alternating cash flows
    const hasMultipleSignChanges = /(?:现金流)?(?:多次|两次以上)变号|非常规现金流|符号变化.*多次/.test(text);
    const claimsUniqueIrr = /IRR\s*(?:唯一|存在唯一)|唯一的?\s*内部收益率/.test(text);
    if (hasMultipleSignChanges && claimsUniqueIrr) {
        violations.push(
            'IRR 矛盾：现金流多次变号时 IRR 可能不唯一或不存在，不能声称唯一（应使用 MIRR/NPV）。'
        );
    }

    return violations;
}

/**
 * FX & international finance consistency validation
 */
function validateFxConsistency(text: string, lowerText: string): string[] {
    const violations: string[] = [];

    // Quotation direction must be declared when parity conditions are used
    const hasParity = /利率平价|covered interest parity|CIP|UIP|抛补利率平价/.test(text);
    if (hasParity) {
        const declaresDirection = /直接标价|间接标价|基准货币|报价货币|USD\/|\/USD|每单位/.test(text);
        if (!declaresDirection) {
            violations.push(
                '汇率标价矛盾：使用利率平价条件但未声明标价方向与基准货币，公式分子分母无法确定。'
            );
        }
    }

    // Both direct and indirect quotes present without conversion
    const hasDirect = /直接标价/.test(text);
    const hasIndirect = /间接标价/.test(text);
    if (hasDirect && hasIndirect) {
        const reconciles = /互为倒数|换算|统一为/.test(text);
        if (!reconciles) {
            violations.push(
                '汇率标价矛盾：题目并存直接标价与间接标价但未说明换算关系，将导致答案不唯一。'
            );
        }
    }

    // Quanto drift adjustment sign
    const hasQuanto = /quanto|数量调整期权/.test(lowerText);
    if (hasQuanto) {
        const hasCorrelation = /相关系数|ρ/.test(text);
        if (!hasCorrelation) {
            violations.push(
                'Quanto 定价条件缺失：quanto 漂移调整项需要标的与汇率的相关系数，题面未提供。'
            );
        }
    }

    // Trilemma: cannot have all three simultaneously
    const fixedFx = /固定汇率|汇率(?:完全)?钉住/.test(text);
    const freeCapital = /资本(?:完全)?自由流动|开放资本账户/.test(text);
    const independentPolicy = /独立(?:的)?货币政策|自主货币政策/.test(text);
    if (fixedFx && freeCapital && independentPolicy) {
        const isTrilemmaQuestion = /三元悖论|不可能三角|trilemma|请判断|矛盾/.test(text);
        if (!isTrilemmaQuestion) {
            violations.push(
                '国际金融矛盾：题目同时假定固定汇率、资本自由流动与独立货币政策，违反三元悖论。'
            );
        }
    }

    return violations;
}
