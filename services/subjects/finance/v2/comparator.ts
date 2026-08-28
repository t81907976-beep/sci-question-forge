import { callLLM } from "../../../llmClient";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { V2QuestionDraft } from "./generator";
import type { BlindSolverResult } from "./blind-solver";
import { formatFinanceRulesForPrompt, selectFinanceRules } from "./rule-matcher";

/**
 * V2 Node A5 (finance): Answer Comparator
 *
 * 除了裁定答案，还要用盲解表现反推题目难度是否达到博士级。
 */

export interface ComparisonResult {
    answersAgree: boolean;
    discrepancies: string[];
    finalAuthorizedAnswer: string;
    finalSolutionText: string;
    confidence: "high" | "medium" | "low";
    notes: string;
    reasoningValid: boolean;
    reasoningIssues: string[];
    solutionRepaired: boolean;
    repairSummary: string;
    releaseLabel: 'standard' | 'with_caveats' | 'discussion_only' | 'adversarial' | 'not_recommended';
}

function isConfidence(value: unknown): value is ComparisonResult["confidence"] {
    return value === "high" || value === "medium" || value === "low";
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item)).filter(Boolean) : [];
}

function normalizeComparisonResult(parsed: Partial<ComparisonResult>): ComparisonResult {
    const confidence = isConfidence(parsed.confidence) ? parsed.confidence : "low";
    const discrepancies = normalizeStringArray(parsed.discrepancies);
    const reasoningIssues = normalizeStringArray(parsed.reasoningIssues);
    const solutionRepaired = Boolean(parsed.solutionRepaired ?? reasoningIssues.length > 0);
    const reasoningValid = Boolean(parsed.reasoningValid ?? (confidence === "high" && reasoningIssues.length === 0 && !solutionRepaired));
    const rawReleaseLabel = (parsed.releaseLabel && ['standard', 'with_caveats', 'discussion_only', 'adversarial', 'not_recommended'].includes(parsed.releaseLabel))
        ? parsed.releaseLabel
        : confidence === 'high' ? 'standard' : confidence === 'medium' ? 'with_caveats' : 'not_recommended';
    const releaseLabel = (!reasoningValid || reasoningIssues.length > 0 || solutionRepaired) && rawReleaseLabel === 'standard'
        ? (confidence === 'low' ? 'not_recommended' : 'with_caveats')
        : rawReleaseLabel;

    return {
        answersAgree: Boolean(parsed.answersAgree),
        discrepancies,
        finalAuthorizedAnswer: String(parsed.finalAuthorizedAnswer ?? ""),
        finalSolutionText: String(parsed.finalSolutionText ?? ""),
        confidence,
        notes: String(parsed.notes ?? ""),
        reasoningValid,
        reasoningIssues,
        solutionRepaired,
        repairSummary: String(parsed.repairSummary ?? ""),
        releaseLabel,
    };
}

function fallbackComparison(draft: V2QuestionDraft, reason: string): ComparisonResult {
    return {
        answersAgree: false,
        discrepancies: [reason],
        finalAuthorizedAnswer: draft.referenceAnswer.split("\n").slice(-1)[0] || "",
        finalSolutionText: draft.referenceAnswer,
        confidence: "low",
        notes: "Comparator failed, fell back to reference answer",
        reasoningValid: false,
        reasoningIssues: ["比较器未能完成推理审查，无法确认解析链条正确性"],
        solutionRepaired: false,
        repairSummary: "",
        releaseLabel: "not_recommended",
    };
}

function includesAny(text: string, keywords: string[]): boolean {
    return keywords.some(kw => text.includes(kw));
}

export async function compareAnswers(
    draft: V2QuestionDraft,
    blindResult: BlindSolverResult
): Promise<ComparisonResult> {
    const judgeText = `${draft.knowledgePoint} ${draft.chosenDimension} ${draft.questionText}`;

    const isDerivatives = includesAny(judgeText, ['期权', '衍生品', '波动率', '对冲', 'Delta', 'Gamma', 'Vega', 'Black-Scholes', 'BSM', '测度', 'Girsanov', 'numéraire', '计价单位', '风险中性', 'Dupire', 'SABR', 'Heston', '鞅', '期货', '互换']);
    const isRateCurve = includesAny(judgeText, ['期限结构', '收益率曲线', '久期', 'DV01', '自举', 'bootstrap', 'OIS', 'SOFR', '凸性调整', 'CMS', 'Hull-White', 'Vasicek', 'CIR', 'HJM', '债券', '折现曲线', '远期曲线']);
    const isCredit = includesAny(judgeText, ['信用', 'CDS', '违约概率', '危险率', 'hazard', '信用价差', '回收率', 'CVA', '强度模型', 'Merton', '生存概率', '错向风险']);
    const isValuation = includesAny(judgeText, ['估值', 'DCF', 'WACC', 'FCFF', 'FCFE', '资本成本', '股权成本', '终值', '永续增长', 'APV', '税盾', 'MM定理', 'Hamada', '企业价值', '并购', 'LBO']);
    const isCapitalBudget = includesAny(judgeText, ['资本预算', 'NPV', 'IRR', 'MIRR', '实物期权', '增量现金流', '沉没成本', '互斥项目', '不等寿命', '折旧税盾']);
    const isTimeSeries = includesAny(judgeText, ['时间序列', 'ADF', 'KPSS', '单位根', '协整', '误差修正', 'ECM', 'GARCH', '伪回归', 'Granger', '平稳']);
    const isCausal = includesAny(judgeText, ['因果推断', '工具变量', 'IV', '2SLS', '双重差分', 'DID', 'RDD', '断点回归', '固定效应', '内生性', 'GMM', '平行趋势', '弱工具', '聚类标准误']);
    const isLifeActuarial = includesAny(judgeText, ['寿险', '生命表', '死亡率', 'UDD', 'Balducci', '常数死力', '分数年龄', '准备金', 'Thiele', 'Fackler', '年金', '纯保费', '多减因', '现金价值']);
    const isNonLife = includesAny(judgeText, ['非寿险', '损失分布', '免赔额', '责任限额', '再保险', '复合泊松', '帕累托', 'Pareto', 'GPD', '极值理论', '重尾', '链梯法', 'Bühlmann', '信度', '停止损失']);
    const isRiskMeasure = includesAny(judgeText, ['风险度量', 'VaR', 'TVaR', 'CVaR', '一致性风险度量', '次可加', '压力测试', '经济资本', '回测', '尾部依赖', '分位数']);
    const isFx = includesAny(judgeText, ['汇率', '外汇', '利率平价', 'CIP', 'UIP', 'PPP', 'quanto', '货币互换', '掉期点', '跨货币基差', '三角套汇', '标价']);
    const isStatement = includesAny(judgeText, ['财务报表', '财务分析', '资产负债表', '现金流量表', '三表联动', '权责发生制', '应计', '资本化', '费用化', 'FIFO', 'LIFO', '租赁', '递延所得税', '杜邦', 'ROIC']);
    const isPortfolio = includesAny(judgeText, ['投资组合', '资产定价', 'CAPM', '因子模型', '有效前沿', '均值方差', '协方差矩阵', 'APT', '业绩归因', '夏普比率', '风险平价']);

    const checklists: string[] = [];
    if (isDerivatives) checklists.push(`【衍生品/波动率裁判清单】
- 两解若差在漂移项：判定谁正确的依据是计价单位选择与 Girsanov 变换，不是"哪个更常见"。随机利率下把 exp(−∫r ds) 当常数外提的一方错。
- 隐含/局部/瞬时波动率混用属实质错误；隐含波动率算术平均、按 t 线性缩放、跨期限直接相加 Vega 均错。
- 期权价须落在无套利边界内并满足看跌看涨平价；越界的一方直接判错，不进入"口径差异"讨论。`);
    if (isRateCurve) checklists.push(`【利率曲线裁判清单】
- 单曲线 vs OIS 折现+远期曲线分离造成的差异属实质错误，不是容差；须指出偏差方向。
- 麦考利久期与修正久期、面值加权与市值加权混用属实质错误。
- 凸性调整符号错误即判错；贴现因子须单调且落在 (0,1]。`);
    if (isCredit) checklists.push(`【信用风险裁判清单】
- 风险中性 PD 与真实世界 PD 相差数倍属口径问题：须判定题目要求的是哪一个，不能各取一半。
- 生存概率须单调不增且落在 [0,1]；越界方判错。
- 未处理 PD/LGD 不可分离性而直接假设回收率 40% 的一方，须在 discrepancies 中记录。`);
    if (isValuation) checklists.push(`【估值裁判清单】
- FCFF↔WACC、FCFE↔k_e 配错属实质错误（企业价值与股权价值混淆），量级差异不可容忍。
- 名义与实际口径混用、g≥WACC、g 超长期名义增速均判错。
- 杠杆时变时用常数 WACC 的一方错；APV 与逐期 WACC 的残差须可解释。`);
    if (isCapitalBudget) checklists.push(`【资本预算裁判清单】
- 现金流多次变号时报单一 IRR 的一方错；须用 NPV/MIRR 判排序。
- 增量口径未剔除沉没成本、漏营运资本变动或折旧税盾的一方错。
- 不等寿命项目直接比 NPV 的一方错。`);
    if (isTimeSeries) checklists.push(`【时间序列裁判清单】
- ADF 原假设为存在单位根、KPSS 原假设为平稳；方向搞反属实质错误。
- 用常规 t 临界值判单位根的一方错。
- GARCH 未检验 α+β<1 或四阶矩条件却给出峰度/预测区间的一方错。`);
    if (isCausal) checklists.push(`【因果推断裁判清单】
- 估计量究竟是 ATE/ATT/LATE：认定错误属实质错误，不是措辞差异。
- 弱工具下只报点估计而不给偏误方向（趋向 OLS）的一方不完整。
- 聚类层级与处理分配层级不一致、交错处理未讨论负权重的一方错。`);
    if (isLifeActuarial) checklists.push(`【寿险精算裁判清单】
- UDD / 常数死力 / Balducci 三者数值不同：判定哪个适用的依据是条款，不是习惯。选错即判错。
- 独立减因率直接当从属减因率使用的一方错；各减因强度之和须等于总强度。
- 前瞻式与后顾式准备金的差异须能归因到费用或保费口径，否则计算有误。`);
    if (isNonLife) checklists.push(`【非寿险裁判清单】
- Pareto α≤2 时方差不存在，仍做正态近似的一方错。
- 免赔额只调整频率或只调整强度的一方错；分层期望之和须等于总期望。
- 复合分布方差未含频率随机性的一方错；信度因子须落在 [0,1]。`);
    if (isRiskMeasure) checklists.push(`【风险度量裁判清单】
- TVaR<VaR 的结果直接判错。
- 非独立同分布或重尾下用 √t 外推、跨置信水平机械换算的一方错。
- 离散分布分位数上/下约定不同导致的差异属口径问题，须按题面约定唯一化后再裁定。`);
    if (isFx) checklists.push(`【国际金融裁判清单】
- 标价方向错误导致符号反转属实质错误；须按题面基准/报价货币约定裁定。
- 用 UIP/PPP 推远期报价的一方错（远期由 CIP 与基差决定）。
- quanto 或跨货币产品漏掉相关性带来的漂移调整项的一方错。`);
    if (isStatement) checklists.push(`【财务报表裁判清单】
- 资产=负债+所有者权益未闭合、间接法调节项与资产负债表变动不一致的一方错。
- 跨公司比较未先调平会计政策口径（资本化/费用化、FIFO/LIFO、租赁分类）的一方错。
- 杜邦各层乘积须还原 ROE；ROIC 分子分母口径不匹配判错。`);
    if (isPortfolio) checklists.push(`【投资组合裁判清单】
- 忽略相关性/协方差结构而按单独方差定权重的一方错。
- 有约束时直接套无约束解析解、未判定约束是否起作用的一方错。
- 归因各项之和须等于总超额收益；几何与算术归因混用判错。`);

    const domainRules = checklists.slice(0, 3).join('\n\n');

    const ruleBlock = formatFinanceRulesForPrompt(
        selectFinanceRules({
            node: 'A5',
            knowledgePoint: draft.knowledgePoint,
            dimension: draft.chosenDimension,
            questionText: draft.questionText,
            maxRules: 4,
        }),
        '【已匹配的规则库动态裁判要求】'
    );

    const prompt = `你是量化金融领域的博士后级别专家，现在担任答案仲裁人。请比较同一道题的"出题方参考答案"与"独立盲解答案"，裁定最终权威答案，并用盲解表现反推题目难度。

【题目】：
${draft.questionText}

【求解目标】：
${draft.requiredAnswer}

【参考答案（出题方）】：
${draft.referenceAnswer}

【盲解答案（独立求解，未见参考答案）】：
盲解是否认为可解：${blindResult.isSolvable}
${blindResult.failReason ? `盲解失败原因：${blindResult.failReason}\n` : ''}盲解过程：${blindResult.blindAnswer}
盲解最终答案：${blindResult.blindFinalAnswer}

${ruleBlock}【核心裁判规则】：
1. 先对齐口径再比数值：计价单位与标价方向、复利与日计数约定、波动率年化方式、现金流与折现率配对、测度或折现曲线、分位数上/下约定。口径不同导致的差异不等于有人算错，须先定位是哪一处口径分叉。
2. 差异归因必须落到四类之一，并写进 discrepancies：(a) 题面口径歧义（题目缺陷）；(b) 参考答案错；(c) 盲解错；(d) 两者都对（等价表达或不同但均自洽的合法口径）。禁止只写"两者不一致"。
3. 数值容差分级：相对误差 <1%（或利率类 <1bp）视为一致，仅为舍入；1%–5% 须定位到具体的方法或口径差异（如连续 vs 离散复利、日计数基准、中点 vs 期末折现）后才可判一致；>5%、量级不同、符号或方向相反一律视为实质分歧。
4. 有界量不给容差：概率与生存概率须在 [0,1]，相关系数在 [−1,1]，贴现因子在 (0,1]，波动率非负，TVaR≥VaR，期权价在无套利边界内并满足平价关系，会计恒等式须闭合。任一越界方直接判错，不进入"口径差异"讨论。
5. 即使两个最终答案数值一致，也必须逐步审查参考答案的推导链：公式适用条件是否检验、易混量是否互相代入、口径转换是否完成、中间量是否越界。链条有问题即写入 reasoningIssues，并在 finalSolutionText 中修正后置 solutionRepaired=true、在 repairSummary 说明改了什么。
6. finalSolutionText 必须是可独立阅读的完整解答：开头显式声明本题口径，逐步给出公式与数值代入，结尾给出带单位的最终答案。不得写成"参考答案第 3 步改为…"这类增量说明。
7. 若盲解指出的是题面真实缺失的必要输入（而非它自己没读到），则题目有缺陷：answersAgree=false，confidence 不得为 high，并在 notes 中点明缺失项。

${domainRules ? `${domainRules}\n\n` : ''}【难度反推（本链路的核心目标）】：
根据盲解行为给出难度判断，写入 notes：
- 盲解一次直达、无需任何判定 ⇒ 难度不足，未达博士级，须在 notes 中明确写"难度不足"。
- 盲解在"该走哪条路"处做了实质判定并判对 ⇒ 难度达标。
- 盲解判定走错但后续推导自洽 ⇒ 难度合格且区分度良好，这是理想状态。
- 盲解因题面歧义或缺参数而失败 ⇒ 属题目缺陷，不计入难度达标。

【置信度标准】：
- high：口径对齐后两解一致，参考答案推导链每步可验证，所有有界量合法，且难度达标。
- medium：存在可解释的口径差异或参考答案有已被修正的小瑕疵，最终答案仍可确定。
- low：两解实质分歧且无法判定谁对，或题面有歧义/缺参数，或有界量越界。

【发布标签判定】：
- standard：confidence=high、reasoningValid=true、reasoningIssues 为空、solutionRepaired=false、难度达标。
- with_caveats：答案可确定但需注明口径假设，或解析经过修正。
- discussion_only：题目本身有多解或口径无法唯一化，只适合讨论。
- adversarial：题目正确且盲解在判定分叉处失败——高区分度的对抗性好题。
- not_recommended：题面缺参数、条件矛盾、有界量越界，或难度不足。

输出必须是严格 JSON，不含 markdown 代码块：
{
  "answersAgree": true 或 false,
  "discrepancies": ["每条差异须含归因：题面歧义/参考答案错/盲解错/两者都对"],
  "finalAuthorizedAnswer": "最终权威答案（含数值和单位）",
  "finalSolutionText": "完整可独立阅读的解答，开头含口径声明",
  "confidence": "high 或 medium 或 low",
  "notes": "裁判说明，必须含难度反推结论",
  "reasoningValid": true 或 false,
  "reasoningIssues": ["参考答案推导链中的问题"],
  "solutionRepaired": true 或 false,
  "repairSummary": "若修正了解析，说明改了哪一步及为什么",
  "releaseLabel": "standard 或 with_caveats 或 discussion_only 或 adversarial 或 not_recommended"
}`;

    let raw: string;
    try {
        raw = (await callLLM(prompt, { model: 'default', temperature: 0.1, responseFormat: 'json' })).trim();
    } catch (error) {
        return fallbackComparison(draft, `Comparator LLM call failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return fallbackComparison(draft, "Failed to parse comparator response");
    }

    try {
        const parsed = cleanAndParseJSON(jsonMatch[0]) as Partial<ComparisonResult>;
        const result = normalizeComparisonResult(parsed);
        if (!result.finalAuthorizedAnswer) {
            result.finalAuthorizedAnswer = draft.referenceAnswer.split("\n").slice(-1)[0] || "";
        }
        if (!result.finalSolutionText) {
            result.finalSolutionText = draft.referenceAnswer;
        }
        return result;
    } catch {
        return fallbackComparison(draft, "Comparator JSON parse failed");
    }
}
