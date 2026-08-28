import { callLLM } from "../../../llmClient";
import type { KPAnalysisResult } from "./kp-analyzer";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { selectFinanceRules, formatFinanceRulesForPrompt } from "./rule-matcher";
import { getDisciplineGuidance } from "../disciplines";

/**
 * V2 Node A1 (finance): Question Generator
 *
 * 本节点的首要目标是**难度**：把题目顶到博士资格考/顶刊复现级别。
 * 陷阱不是重点——所有"易混量""口径分叉"都是为了制造真实的推导门槛，
 * 而不是为了骗人。
 */

export interface V2QuestionDraft {
    problemId: string;
    knowledgePoint: string;
    chosenDimension: string;
    questionText: string;
    coreData: Record<string, { value: number; unit: string }>;
    requiredAnswer: string;
    referenceAnswer: string;
    referenceSteps: string[];
}

function includesAny(text: string, keywords: string[]): boolean {
    return keywords.some(kw => text.includes(kw));
}

function normalizeDraft(draft: Partial<V2QuestionDraft>, kpAnalysis: KPAnalysisResult, dimension: string): V2QuestionDraft {
    return {
        problemId: String(draft.problemId || `v2_${Date.now()}`),
        knowledgePoint: String(draft.knowledgePoint || kpAnalysis.knowledgePoint),
        chosenDimension: String(draft.chosenDimension || dimension),
        questionText: String(draft.questionText || ""),
        coreData: draft.coreData && typeof draft.coreData === 'object' ? draft.coreData as Record<string, { value: number; unit: string }> : {},
        requiredAnswer: String(draft.requiredAnswer || ""),
        referenceAnswer: String(draft.referenceAnswer || ""),
        referenceSteps: Array.isArray(draft.referenceSteps) ? draft.referenceSteps.map(String).filter(Boolean) : [],
    };
}

export async function generateQuestionWithAnswer(
    kpAnalysis: KPAnalysisResult,
    dimensionIndex: number,
    language: string = 'zh-CN',
    singleQuestion: boolean = false
): Promise<V2QuestionDraft> {
    const dimensions = Array.isArray(kpAnalysis.testDimensions) && kpAnalysis.testDimensions.length > 0
        ? kpAnalysis.testDimensions
        : ["先判定模型适用域再完成多步定价推导"];
    const dimension = dimensions[dimensionIndex % dimensions.length];
    const avoidList = Array.isArray(kpAnalysis.coreConceptsToAvoid) ? kpAnalysis.coreConceptsToAvoid.join("、") : "";

    const singleQuestionConstraint = singleQuestion
        ? `⚠️ 【强制单问】：题目必须只有一个问题，只有一个求解目标。绝对禁止出现 (1)(2)(3) 等多小问、多子任务的形式。整道题从头到尾只问一件事。这是对题目结构的约束，禁止把"全题只形成一个求解目标""不得拆分成多个小问"这类话写进 questionText 题面文字。\n`
        : '';

    const planningText = `${kpAnalysis.knowledgePoint} ${dimension} ${kpAnalysis.suggestedDifficulty}`;

    const derivativesKeywords = ['期权', '衍生品', '波动率', '对冲', 'Delta', 'Gamma', 'Vega', '希腊值', 'Black-Scholes', 'BSM', '测度', 'Girsanov', 'numéraire', '计价单位', '风险中性', 'Dupire', 'SABR', 'Heston', '鞅', '期货', '互换'];
    const rateCurveKeywords = ['期限结构', '收益率曲线', '久期', 'DV01', '自举', 'bootstrap', 'OIS', 'SOFR', '凸性调整', 'CMS', 'Hull-White', 'Vasicek', 'CIR', 'HJM', '债券', '利率衍生品', '折现曲线', '远期曲线'];
    const creditKeywords = ['信用', 'CDS', '违约概率', '危险率', 'hazard', '信用价差', '回收率', 'CVA', '强度模型', 'Merton模型', '生存概率', '错向风险'];
    const valuationKeywords = ['估值', 'DCF', 'WACC', 'FCFF', 'FCFE', '资本成本', '股权成本', '终值', '永续增长', 'APV', '税盾', 'MM定理', 'Hamada', '去杠杆', '重加杠杆', '企业价值', '并购', 'LBO'];
    const capitalBudgetKeywords = ['资本预算', 'NPV', 'IRR', '多重IRR', 'MIRR', '实物期权', '增量现金流', '沉没成本', '互斥项目', '不等寿命', '折旧税盾'];
    const timeSeriesKeywords = ['时间序列', 'ADF', 'KPSS', '单位根', '协整', '误差修正', 'ECM', 'GARCH', '伪回归', 'Granger', '波动率预测', '平稳'];
    const causalKeywords = ['因果推断', '工具变量', 'IV', '2SLS', '双重差分', 'DID', 'RDD', '断点回归', '固定效应', '内生性', 'GMM', '平行趋势', '弱工具', '聚类标准误'];
    const lifeActuarialKeywords = ['寿险', '生命表', '死亡率', 'UDD', 'Balducci', '常数死力', '分数年龄', '准备金', 'Thiele', 'Fackler', '年金', '纯保费', '多状态', '多减因', '现金价值'];
    const nonLifeKeywords = ['非寿险', '损失分布', '免赔额', '责任限额', '再保险', '复合泊松', '帕累托', 'Pareto', 'GPD', '极值理论', '重尾', '链梯法', 'Bühlmann', '信度', '停止损失'];
    const riskMeasureKeywords = ['风险度量', 'VaR', 'TVaR', 'CVaR', '一致性风险度量', '次可加', '压力测试', '经济资本', '回测', '尾部依赖', '分位数'];
    const fxKeywords = ['汇率', '外汇', '利率平价', 'CIP', 'UIP', 'PPP', 'quanto', '货币互换', '掉期点', '跨货币基差', '三角套汇', '标价', '国际收支'];
    const statementKeywords = ['财务报表', '财务分析', '资产负债表', '现金流量表', '三表联动', '权责发生制', '应计', '资本化', '费用化', 'FIFO', 'LIFO', '租赁', '递延所得税', '杜邦', 'ROIC', '盈余管理'];
    const portfolioKeywords = ['投资组合', '资产定价', 'CAPM', '因子模型', '有效前沿', '均值方差', '协方差矩阵', '风险溢价', 'APT', '业绩归因', '夏普比率', '风险平价'];

    const isDerivatives = includesAny(planningText, derivativesKeywords);
    const isRateCurve = includesAny(planningText, rateCurveKeywords);
    const isCredit = includesAny(planningText, creditKeywords);
    const isValuation = includesAny(planningText, valuationKeywords);
    const isCapitalBudget = includesAny(planningText, capitalBudgetKeywords);
    const isTimeSeries = includesAny(planningText, timeSeriesKeywords);
    const isCausal = includesAny(planningText, causalKeywords);
    const isLifeActuarial = includesAny(planningText, lifeActuarialKeywords);
    const isNonLife = includesAny(planningText, nonLifeKeywords);
    const isRiskMeasure = includesAny(planningText, riskMeasureKeywords);
    const isFx = includesAny(planningText, fxKeywords);
    const isStatement = includesAny(planningText, statementKeywords);
    const isPortfolio = includesAny(planningText, portfolioKeywords);

    const derivativesStrategies = isDerivatives ? `
策略D1 — 计价单位判定前置：设置随机利率且标的与利率相关的情形，解题者必须自行判断哪个计价单位使目标量成为鞅，再由 Girsanov 得漂移修正；把 exp(−∫r ds) 当常数外提会得到量级错误的结果。
策略D2 — 波动率三层量分离：题面同时给隐含波动率报价与波动率过程参数，正确路径需区分隐含/局部/瞬时并检验 Dupire 前提；隐含波动率算术平均或直接代入 PDE 都是错的。
策略D3 — 对冲 P&L 分解：给再平衡频率、交易成本与实现波动率，要求求最优频率或分解 P&L；"频率越高越好"是错误结论，需体现方差 ∝Δt 与成本 ∝1/√Δt 的反向权衡。
` : '';

    const rateCurveStrategies = isRateCurve ? `
策略R1 — 双曲线分离：给抵押品条款与 OIS/IBOR 双套报价，解题者须自行判断折现曲线与远期曲线的归属；单曲线自举会产生系统性偏差，其量级本身可作为求解目标。
策略R2 — 凸性调整来源辨析：设置远期利率与期货利率、或 CMS 与远期互换利率的比较，要求由测度不匹配推出调整项的符号与量级，而非引用"经验修正值"。
策略R3 — 二阶展开失效域：给大幅或非平行的曲线移动，久期-凸性近似与全额重定价结果显著分歧，要求判定近似何时失效并给出误差方向。
` : '';

    const creditStrategies = isCredit ? `
策略C1 — 概率口径分叉：同时给 CDS 价差与评级迁移矩阵，两者隐含的违约概率相差数倍；解题者须判定各自口径（风险中性 vs 真实世界）及可用场景，混用即量级错误。
策略C2 — 回收率不可分离：仅给单一价差时 PD 与 LGD 无法唯一分离，题目须要求给出独立约束或做敏感性区间，而非直接假设 40% 回收率。
策略C3 — 模型形态判别：强度模型与 Merton 结构模型在短期限给出不同的违约概率形态，要求由题面证据（股价波动率、资本结构、期限）选择模型并说明失效边界。
` : '';

    const valuationStrategies = isValuation ? `
策略V1 — 现金流与折现率配对：题面同时给 FCFF、FCFE、WACC、k_e 与名义/实际口径，配错即得到企业价值与股权价值混淆的量级错误；正确路径须显式声明配对。
策略V2 — 杠杆路径依赖：设置杠杆比率逐期变化，常数 WACC 失效；正确路径为 APV 或逐期重算 WACC，且两法须能交叉验证（差异应可解释）。
策略V3 — 终值自洽性：给出的增长率、退出乘数与 WACC 之间存在张力，要求先检验 g<WACC 与 g≤长期名义增速，再用两法交叉验证终值。
` : '';

    const capitalBudgetStrategies = isCapitalBudget ? `
策略B1 — IRR 多解判别：构造现金流多次变号的项目，IRR 不唯一或不存在，须判别后改用 NPV/MIRR 并说明再投资假设差异导致的排序反转。
策略B2 — 增量口径闭合：题面混入沉没成本、分摊费用、营运资本变动与产品侵蚀效应，正确路径须完整闭合增量现金流并剔除非增量项。
策略B3 — 实物期权反转决策：静态 NPV 为负但含延迟/放弃/扩张期权，期权价值使决策方向反转；期权估值所需波动率须可由题面推出。
` : '';

    const timeSeriesStrategies = isTimeSeries ? `
策略T1 — 原假设方向对立：给出 ADF 不拒绝且 KPSS 也拒绝之类的组合，解题者须先辨清两者原假设方向相反，再做出平稳性判定；用常规 t 临界值即错。
策略T2 — 伪回归识别链：给高 R²、低 DW 的回归结果，正确路径须先判协整再建 ECM，而不是直接解读系数。
策略T3 — 矩条件约束：GARCH 参数接近 α+β=1 或四阶矩条件边界，要求判定平稳性与峰度是否存在，进而判断标准误与预测区间是否可用。
` : '';

    const causalStrategies = isCausal ? `
策略I1 — 识别策略自证：题面只给数据结构与制度背景，不指定方法；解题者须自行提出识别策略并论证其假设的可检验性与不可检验部分。
策略I2 — 弱工具量化：给首段 F 统计量偏低的情形，要求判断 2SLS 偏误方向（趋向 OLS）与标准误失真程度，而非只报点估计。
策略I3 — 估计量含义差异：设置 IV/DID/RDD 估计的是 LATE/ATT/局部效应而非 ATE 的场景，要求说明适用人群与外推限制；交错处理下须讨论负权重。
` : '';

    const lifeActuarialStrategies = isLifeActuarial ? `
策略L1 — 分数年龄假设唯一化：题面条款须使 UDD / 常数死力 / Balducci 中恰好一个适用（三者给出不同数值），解题者自行判定；题面不得点名假设。
策略L2 — 递归闭合与交叉验证：要求用 Thiele/Fackler 递归求准备金，并与前瞻式或后顾式结果互验，差异须能归因到费用或保费口径。
策略L3 — 减因率口径：多减因模型中给出独立减因率与总强度，正确路径须换算为从属减因率；直接混用会得到概率之和不为 1 的结果。
` : '';

    const nonLifeStrategies = isNonLife ? `
策略N1 — 矩存在性前置：给 Pareto α 落在 1<α≤2 的区间，方差不存在，正态近似与 CLT 型区间失效，须改走 EVT/GPD 路径。
策略N2 — 免赔额双重影响：免赔额同时压低索赔频率（穿透概率）与右移条件强度，只调整其中之一即错；分层积分须显式写出。
策略N3 — 再保险分层闭合：给停止损失或限额层，要求分层期望与 LER 自洽，且原保险人与再保险人期望之和等于总期望。
` : '';

    const riskMeasureStrategies = isRiskMeasure ? `
策略K1 — 次可加性反例：要求构造或识别 VaR 不满足次可加的组合，并与 TVaR 对比说明一致性公理；不能停留在"VaR 是分位数"的定义复述。
策略K2 — 时间与置信度换算：给非独立同分布或重尾情形，√t 外推与置信水平换算失效，须判定可否使用并给出偏差方向。
策略K3 — 离散分布分位数约定：损失分布离散或有原子点时分位数定义（上/下分位数）会改变结果，须由题面约定唯一化。
` : '';

    const fxStrategies = isFx ? `
策略X1 — 标价方向唯一化：题面须以基准/报价货币约定使方向唯一，解题者自行判定；方向错误会使结论符号反转，这是本方向的核心难点之一。
策略X2 — 跨货币基差破坏 CIP：给含基差的报价，要求判断抛补套利是否真实可执行（扣除基差与融资成本后），而非机械套 CIP 公式。
策略X3 — 相关性必要性：quanto 或跨货币产品必须使用给定的相关系数；忽略相关性会漏掉漂移调整项。
` : '';

    const statementStrategies = isStatement ? `
策略S1 — 恒等式强制闭合：题面给部分科目，要求由三表联动（净利润→留存收益→资产负债表）反推缺失项；只算单表无法闭合。
策略S2 — 口径调平后比较：给两家公司采用不同会计政策（资本化 vs 费用化、FIFO vs LIFO、经营 vs 融资租赁），必须先调至同一口径再比较，否则结论反向。
策略S3 — 应计质量与现金流背离：设置利润上升而经营现金流下降的情形，要求由营运资本与应计项定位背离来源。
` : '';

    const portfolioStrategies = isPortfolio ? `
策略F1 — 协方差结构主导：给因子结构或相关性矩阵，最优权重由协方差而非单独方差决定；忽略相关性会得到错误的前沿位置。
策略F2 — 约束改变解结构：加入不允许卖空、杠杆上限或跟踪误差约束后，无约束解析解失效，须判定约束是否起作用。
策略F3 — 归因口径一致：业绩归因的配置/选择/交互项之和须等于总超额收益，几何与算术归因不可混用。
` : '';

    const derivativesConstraints = isDerivatives ? `
【衍生品/波动率/对冲专项约束】
1. 禁止"已知 S、K、r、σ、T 直接套 Black-Scholes"的代入题——必须包含测度/计价单位判定、波动率层级辨析或对冲误差分解中的至少一项。
2. 涉及随机利率时必须给出利率波动率与相关系数；测度变换后的漂移须在参考答案中显式写出。
3. 隐含波动率报价必须自身无套利（蝶式凸性、总方差随期限不减）；用 Dupire 时分母不得趋零或为负。
4. 波动率按 √t 缩放，禁止线性缩放；不同期限的 Vega 不得直接相加。
5. 期权价格须落在无套利边界内（内在价值下界、标的价与行权价折现值给出的上界），并满足看跌看涨平价。
` : '';

    const rateCurveConstraints = isRateCurve ? `
【利率曲线/期限结构专项约束】
1. 禁止"已知票息与到期收益率直接求价格/久期"的代入题——必须包含折现曲线与远期曲线的分离、凸性调整或二阶近似失效判定。
2. 日计数基准、付息频率、复利约定必须在题面给定且全题一致；债券等价收益率与有效年利率不得混用。
3. 自举出的贴现因子须单调且落在 (0,1]；由曲线导出的远期利率不得出现无经济含义的取值。
4. 久期须区分麦考利久期与修正久期；组合久期以市值加权，禁止面值加权。
5. 凸性调整的符号与量级须由测度不匹配推出，不得作为给定常数直接使用。
` : '';

    const creditConstraints = isCredit ? `
【信用风险专项约束】
1. 禁止"已知价差除以(1−R)求违约概率"的单步题——必须包含风险中性与真实世界口径的辨析、PD/LGD 不可分离性或模型形态判别。
2. 生存概率须单调不增且落在 [0,1]；分段常数危险率的期限结构须与各期限价差自洽。
3. 若同时给评级迁移概率与市场价差，题面须使两者的口径差异可被推出，且不得暗示哪个"正确"。
4. CVA 计算须体现暴露与违约的相关性（错向风险），不得默认独立相乘；有抵押品时须处理阈值与最低转移金额。
` : '';

    const valuationConstraints = isValuation ? `
【企业估值/资本结构专项约束】
1. 禁止"已知 FCFF 与 WACC 直接求企业价值"的代入题——必须包含现金流与折现率的配对判定、杠杆时变或终值自洽性中的至少一项。
2. 名义与实际口径不得混用；若涉及通胀须经 Fisher 关系换算。
3. 必须满足 g<WACC 且永续增长率不超过长期名义增长率；终值占比过高时须有交叉验证路径。
4. beta 的去杠杆/重加杠杆须声明 Hamada 前提（债务 beta、税率恒定）；税率、目标资本结构与实际资本结构须区分。
5. 企业价值与股权价值之间的桥接项（净债务、少数股东权益、非经营资产）须完整且可由题面推出。
` : '';

    const capitalBudgetConstraints = isCapitalBudget ? `
【资本预算专项约束】
1. 禁止"已知现金流序列直接求 NPV"的代入题——必须包含 IRR 多解判别、增量口径闭合或实物期权反转中的至少一项。
2. 增量现金流须含营运资本变动与期末回收、折旧税盾、机会成本与侵蚀效应，并排除沉没成本。
3. 互斥且不等寿命项目须用等年值或重置链比较，禁止直接比较 NPV。
4. 涉及实物期权时，估值所需的波动率与行权条件须可由题面推出，不得凭空假设。
` : '';

    const timeSeriesConstraints = isTimeSeries ? `
【时间序列计量专项约束】
1. 禁止"已知统计量查表下结论"的单步题——必须包含原假设方向辨析、协整判定链或矩条件检验中的至少一项。
2. 单位根检验须使用非标准（Dickey-Fuller）临界值，题面给出的临界值须与检验类型（含截距/趋势）匹配。
3. GARCH 参数须满足非负与 α+β<1；若涉及峰度或标准误，须检验四阶矩条件。
4. 样本量、滞后阶选择准则与检验功效之间的张力须在参考答案中说明，不得只报 p 值。
` : '';

    const causalConstraints = isCausal ? `
【因果推断专项约束】
1. 禁止题面指定识别方法后仅要求计算——必须让解题者自行提出并论证识别策略。
2. 排他性约束、平行趋势的不可检验部分必须被明确区分于可检验部分（首段 F、前期系数联合检验、过度识别检验的适用前提）。
3. 聚类层级须与处理分配层级一致；聚类数过少时标准误不可靠，须说明。
4. 估计量须明确是 ATE / ATT / LATE 中的哪一个，并说明外推限制。
` : '';

    const lifeActuarialConstraints = isLifeActuarial ? `
【寿险精算专项约束】
1. 禁止"已知 q_x 与利率直接查表求年金现值"的代入题——必须包含分数年龄假设判定、递归准备金或保费分解中的至少一项。
2. 分数年龄假设在同一题中必须唯一且可由条款判定，禁止并存或题面点名。
3. 须满足 0<q_x<1 与 p_x+q_x=1；选择表与终极表的选择期须正确接续。
4. 多减因模型中各减因强度之和须等于总强度，独立减因率不得直接当从属减因率使用。
5. 利率、保费缴付方式（期初/期末）、给付时点须全题一致且明确。
` : '';

    const nonLifeConstraints = isNonLife ? `
【非寿险/损失分布专项约束】
1. 禁止"已知均值与方差直接算保费"的代入题——必须包含矩存在性判定、免赔额双重影响或分层闭合中的至少一项。
2. 重尾分布须先判矩是否存在（Pareto α≤2 无方差、α≤1 无均值）；矩不存在时禁止正态近似。
3. 免赔额、限额、共保比例必须同时作用于频率与强度，分层期望之和须等于总期望。
4. 复合分布的均值方差须用复合公式（含频率与强度双重随机性），不得只用强度的方差。
5. 信度因子须落在 [0,1]；Bühlmann 结构参数须可由题面数据估计。
` : '';

    const riskMeasureConstraints = isRiskMeasure ? `
【风险度量专项约束】
1. 禁止"已知正态参数直接乘 z 值求 VaR"的代入题——必须包含一致性公理、重尾适用性或换算失效判定中的至少一项。
2. 置信水平、持有期与分位数取值约定须在题面明确；离散分布须指明上/下分位数。
3. TVaR≥VaR 必须成立；若题目涉及组合，须能判定次可加性是否被违反。
4. √t 时间换算仅在独立同分布下成立，题面若违反须要求解题者识别并说明偏差方向。
` : '';

    const fxConstraints = isFx ? `
【国际金融/汇率专项约束】
1. 禁止"已知两国利率直接套 CIP 求远期汇率"的代入题——必须包含标价方向判定、跨货币基差或相关性必要性中的至少一项。
2. 题面必须使标价方向（基准/报价货币，直接/间接标价）可唯一确定；参考答案须显式声明方向。
3. CIP 与 UIP/PPP 不可混用：前者是近似无套利关系（含基差），后者是均衡条件，不能用于推导远期报价。
4. quanto 与跨货币产品必须给出相关系数；三角套汇须用双边报价并扣除交易成本闭合。
5. 汇率、利率的日计数与期限须一致；掉期点与即期汇率的单位换算须明确。
` : '';

    const statementConstraints = isStatement ? `
【财务报表分析专项约束】
1. 禁止"已知净利润与权益直接算 ROE"的代入题——必须包含三表联动闭合、会计政策口径调平或应计质量辨析中的至少一项。
2. 资产=负债+所有者权益必须严格闭合；间接法调节项须与资产负债表变动一致。
3. 跨公司比较前必须先调至同一会计政策口径，题面须给出足以完成调整的信息。
4. 杜邦分解各层乘积须还原为 ROE；ROIC 的分子（税后经营利润）与分母（投入资本）口径须匹配。
5. 所有科目须数量级合理，且不得出现相互矛盾的科目关系（如折旧超过固定资产原值）。
` : '';

    const portfolioConstraints = isPortfolio ? `
【投资组合/资产定价专项约束】
1. 禁止"已知 beta 与市场溢价直接套 CAPM"的代入题——必须包含协方差结构、约束起效判定或归因口径一致中的至少一项。
2. 协方差矩阵须半正定，相关系数落在 [−1,1]；权重之和须满足题面约定的预算约束。
3. 若含约束（禁止卖空、杠杆上限、跟踪误差），须判定约束是否起作用而非直接套无约束解析解。
4. 归因分解各项之和须等于总超额收益；几何与算术归因不可混用。
` : '';

    const limitDomainSections = (sections: string[], maxSections = 2) => sections.filter(section => section.trim()).slice(0, maxSections).join('');
    const domainConstraints = limitDomainSections([derivativesConstraints, rateCurveConstraints, creditConstraints, valuationConstraints, capitalBudgetConstraints, timeSeriesConstraints, causalConstraints, lifeActuarialConstraints, nonLifeConstraints, riskMeasureConstraints, fxConstraints, statementConstraints, portfolioConstraints]);
    const domainStrategies = limitDomainSections([derivativesStrategies, rateCurveStrategies, creditStrategies, valuationStrategies, capitalBudgetStrategies, timeSeriesStrategies, causalStrategies, lifeActuarialStrategies, nonLifeStrategies, riskMeasureStrategies, fxStrategies, statementStrategies, portfolioStrategies]);

    const ruleBlock = formatFinanceRulesForPrompt(
        selectFinanceRules({
            node: 'A1',
            knowledgePoint: kpAnalysis.knowledgePoint,
            dimension,
            extraText: kpAnalysis.suggestedDifficulty,
            maxRules: 4,
        }),
        '【已匹配的规则库动态难度要求】'
    );

    // V1 已积累的学科分支指引（峰值难度、禁止性错误、参数可行域）
    const disciplineGuidance = getDisciplineGuidance(`${kpAnalysis.knowledgePoint} ${dimension}`);

    const prompt = `你是量化金融领域的博士后级别专家，同时是金融工程博士资格考与 CFA/FRM/精算师资格考试的命题人。请根据以下规划出一道**博士级难度**的题目，并给出详细参考答案。

【知识点】：${kpAnalysis.knowledgePoint}
【本题考察维度】：${dimension}
【难度定位】：${kpAnalysis.suggestedDifficulty}
【必须避开的老套角度】：${avoidList || "无"}
【输出语言】：${language}

⚠️ 本链路的**唯一核心目标是难度**：题目要难到博士资格考水平。设置易混量、口径分叉不是为了"骗人"，而是为了制造真实存在的推导门槛——每一个分叉都必须是该领域中真实会导致专业人士判断失误的地方，不得为了增加难度而编造人为的文字游戏。

${ruleBlock}${disciplineGuidance}
【出题要求】：
${singleQuestionConstraint}1. 题目条件充分且必要，有唯一正确解；所有必要参数（利率约定、日计数基准、复利方式、货币与标价方向、相关系数、税率）都在题面给出
2. 嵌入真实市场/交易台/审计/监管背景，禁止照搬教材例题场景
3. 所有数值、单位、约定必须准确无误；需要解题者使用的通用公式或常数必须在题面给出
4. coreData 只是题面已列关键数据的结构化镜像，不能作为题面外附件；凡参考答案会使用的 coreData 数值、单位和系数，必须逐项出现在 questionText 中
5. 题干文字叙述部分控制在 250 字以内，必要数据保留，避免冗长背景
6. 禁止低难度结构：计算题不能是"已知A和B，求C"的直接代入；论证题不能单步结论跳转；概念题不能只复述定义——必须有真正的判定分叉和多步推导
7. 金融条件必须自洽（无套利、恒等式闭合、概率与相关系数落在合法范围、单位与约定不矛盾）
${domainConstraints}
【难度地板（全部强制，否则废题）】：
- 解题链须有 ≥5 个相互依赖的实质步骤（前一步输出是后一步输入，不是并列小问）
- 须有至少一个"判定后才知道走哪条路"的模型/口径适用域判断，且判错会改变数值量级或结论方向
- 至少一个关键前提不显式写在题面，须能从数据关系、无套利条件、恒等式或制度背景推出（但不得是缺少必要参数）
- 解题链中须出现一次不可跳过的口径/基准转换：名义↔实际、离散↔连续复利、日计数换算、隐含↔局部↔瞬时波动率、风险中性↔真实世界概率、企业价值↔股权价值、独立↔从属减因率、面值↔市值加权
- 必须区别于教材模板，不能只替换数字或背景

【低难度模板禁令】（命中任一且未实质升级则废题）：
- 禁止 Black-Scholes / Gordon 增长 / CAPM / 久期公式 / Nernst 型单公式直接代入
- 禁止题面直接告知"应使用某模型/某假设成立/应换某测度"，这些必须由解题者判定
- 禁止只把教材题换背景和数字；必须至少融合两个概念并有多步依赖链
- 禁止靠增加数字位数、增加小问数量或堆叠无关背景来伪装难度
${domainStrategies}
【答案要求】：
1. 给出完整的分步推导过程（每步含具体公式和数值代入）
2. 给出最终答案（含数值和单位）
3. 判定分叉、隐含前提来源、口径转换节点这些解题说明只能写在 referenceAnswer 字段里，绝对不能出现在 questionText 题面中
4. referenceAnswer 中须显式声明本题采用的口径（利率约定、日计数、货币方向、测度或折现曲线）

【题面纯净性硬规则（强制）】：
- questionText 只能是自然的题目背景叙述、数据和最终提问，禁止出现任何面向解题者或出题者的元要求句，例如"解答必须…""需要判断…""必须指出…""注意测度变换""不得拆分成多个小问"等。
- 禁止在题面出现"本题考查/难点在于/陷阱是/分值"等命题者视角表述。
- 上述难度地板是对题目设计的要求，必须靠数据和情境本身体现，不能把要求原文写进题面。

输出必须是严格的 JSON，不包含 markdown 代码块：
{
  "problemId": "v2_${Date.now()}",
  "knowledgePoint": "${kpAnalysis.knowledgePoint}",
  "chosenDimension": "${dimension}",
  "questionText": "完整题目文字，只含背景叙述、数据和提问，所有数据已嵌入，250字以内，禁止任何解题/出题元要求句",
  "coreData": {
    "金融量名称": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "求解目标",
  "referenceAnswer": "完整分步解答，含口径声明、公式推导、数值计算、判定分叉、隐含前提来源和口径转换",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]
}`;

    const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.7 })).trim();
    const draft = normalizeDraft(cleanAndParseJSON(raw) as Partial<V2QuestionDraft>, kpAnalysis, dimension);

    if (!draft.questionText || !draft.referenceAnswer) {
        throw new Error("Generator: incomplete question or answer in response");
    }
    if (draft.referenceSteps.length < 3) {
        draft.referenceSteps = draft.referenceAnswer
            .split(/\n+/)
            .map(s => s.trim())
            .filter(Boolean)
            .slice(0, 8);
    }

    return draft;
}





