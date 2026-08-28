import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“概率论-随机过程”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const PROBABILITY_STOCHASTIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Poisson 过程的等价刻画。
    "poisson-process-characterization": {
        id: "poisson-process-characterization", l2Key: "probability-stochastic", name: "Poisson 过程的刻画", kind: "criterion",
        aliases: ["Poisson过程", "泊松过程", "独立增量", "指数等待时间", "非齐次Poisson过程"],
    },
    // Brownian 运动的定义与路径性质。
    "brownian-motion-properties": {
        id: "brownian-motion-properties", l2Key: "probability-stochastic", name: "Brownian 运动与路径性质", kind: "object",
        aliases: ["布朗运动", "Wiener过程", "二次变差", "反射原理", "尺度不变性"],
    },
    // 鞅与可选停止定理。
    "martingale-optional-stopping": {
        id: "martingale-optional-stopping", l2Key: "probability-stochastic", name: "鞅与可选停止定理", kind: "theorem",
        aliases: ["鞅", "停时", "可选停止定理", "optional stopping", "鞅一致可积"],
    },
    // Doob 分解与鞅不等式、收敛定理。
    "doob-inequalities-convergence": {
        id: "doob-inequalities-convergence", l2Key: "probability-stochastic", name: "Doob 不等式与鞅收敛定理", kind: "theorem",
        aliases: ["Doob不等式", "鞅收敛定理", "Doob分解", "上穿不等式", "极大不等式"],
    },
    // Itô 积分与等距性。
    "ito-integral-isometry": {
        id: "ito-integral-isometry", l2Key: "probability-stochastic", name: "Itô 积分与等距性", kind: "object",
        aliases: ["Itô积分", "随机积分", "Itô等距", "适应过程", "可预测过程"],
    },
    // Itô 公式。
    "ito-formula": {
        id: "ito-formula", l2Key: "probability-stochastic", name: "Itô 公式", kind: "formula",
        aliases: ["Itô公式", "Ito lemma", "二阶校正项", "随机链式法则", "乘积法则"],
    },
    // 随机微分方程的强解存在唯一性。
    "sde-existence-uniqueness": {
        id: "sde-existence-uniqueness", l2Key: "probability-stochastic", name: "随机微分方程存在唯一性", kind: "theorem",
        aliases: ["随机微分方程", "SDE", "强解", "弱解", "Lipschitz条件"],
    },
    // Girsanov 定理与测度变换。
    "girsanov-theorem": {
        id: "girsanov-theorem", l2Key: "probability-stochastic", name: "Girsanov 定理", kind: "theorem",
        aliases: ["Girsanov定理", "测度变换", "等价鞅测度", "Novikov条件", "Radon-Nikodym导数"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const PROBABILITY_STOCHASTIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // Poisson 过程：三种等价定义与等待时间。
    "poisson-process-characterization": {
        definitions: ["强度 λ 的 Poisson 过程是计数过程 N_t，可等价地由独立平稳增量加 Poisson 分布、由独立指数等待时间、或由无穷小概率条件三种方式刻画。"],
        formulas: ["有限维分布：N_t - N_s ~ Poisson(λ(t-s))，s < t，且不同区间增量独立。", "等待时间：间隔 T_i i.i.d. ~ Exp(λ)，到达时刻 S_n = ∑_{i≤n} T_i ~ Gamma(n, λ)。", "条件均匀性：给定 N_t = n，n 个到达时刻的联合分布等于 [0,t] 上 n 个 i.i.d. 均匀点的次序统计量。", "非齐次情形：N_t - N_s ~ Poisson(∫_s^t λ(u) du)。", "复合 Poisson：X_t = ∑_{i ≤ N_t} Y_i，E[X_t] = λ t E[Y]，Var(X_t) = λ t E[Y^2]。"],
        theorems: ["三种定义等价：可由无穷小条件推出增量的 Poisson 分布，也可由指数等待时间构造过程。", "叠加与分裂：独立 Poisson 过程之和为强度相加的 Poisson 过程；以概率 p 独立标记得到强度 λp 与 λ(1-p) 的两个独立 Poisson 过程。", "N_t - λt 是鞅；Poisson 过程是唯一具有独立平稳增量的纯跳跃计数过程（跳跃幅度为 1）。", "小跳跃归一化极限（Poisson 逼近/Le Cam 界）说明稀有事件计数的普遍性。"],
        generalRequirements: ["必须声明齐次性：强度是否随时间变化。", "使用条件均匀性必须固定区间与给定的计数值。"],
        forbiddenErrors: ["【增量非独立误设】对非独立增量的计数过程套用 Poisson 分布。", "【齐次与非齐次混用】非齐次强度仍用 λ(t-s) 而非积分。", "【指数与 Gamma 混淆】把第 n 个到达时刻当作指数分布。", "【分裂后相关性误判】称标记分裂得到的两个过程相关。"],
        parameterConstraints: { intensityPositive: "λ > 0；非齐次情形要求 λ(t) ≥ 0 且局部可积。", counting: "N_0 = 0，路径右连续、非降、整数值、跳跃幅度为 1。", independentIncrements: "不重叠区间上的增量相互独立。" },
        closureChecks: ["确认所用刻画（增量分布/等待时间/无穷小条件）并保持一致。", "核对区间长度或强度积分。", "涉及多个过程时说明独立性与叠加/分裂结构。"],
        scenarioChecks: { queueingArrivals: ["排队系统到达流建模与 M/M/1 的分析。"], conditionalOrderStatistics: ["已知总数时用条件均匀性计算到达时刻的分布。"], compoundClaims: ["保险索赔总额用复合 Poisson 的均值方差公式。"] },
    },
    // Brownian 运动：定义、路径性质与反射原理。
    "brownian-motion-properties": {
        definitions: ["标准 Brownian 运动 B_t 是满足 B_0 = 0、增量独立且 B_t - B_s ~ N(0, t-s)、路径连续的过程；其路径几乎必然处处不可导且二次变差有限。"],
        formulas: ["协方差：E[B_s B_t] = min(s, t)。", "尺度不变性：c^{-1/2} B_{ct} 与 B_t 同分布；时间反演 t B_{1/t}（t > 0）也是 Brownian 运动。", "二次变差：[B]_t = t（依概率），故 (dB_t)^2 = dt 的形式记法。", "反射原理：P(max_{s ≤ t} B_s ≥ a) = 2 P(B_t ≥ a) = 2(1 - Φ(a/√t))，a > 0。", "首达时：T_a = inf{t : B_t = a} 满足 P(T_a ≤ t) = 2(1 - Φ(|a|/√t))，E[T_a] = ∞。"],
        theorems: ["路径几乎必然连续但处处不可导，且在任意区间上无有界变差（故不能按 Riemann-Stieltjes 积分处理）。", "强 Markov 性：对任意停时 τ，(B_{τ+t} - B_τ)_{t ≥ 0} 是与 F_τ 独立的 Brownian 运动，是反射原理的基础。", "B_t、B_t^2 - t、exp(λB_t - λ^2 t/2) 均为鞅，是计算首达时分布与矩的标准工具。", "重对数律：limsup B_t/√(2t log log t) = 1 几乎必然，给出精确增长阶。"],
        generalRequirements: ["区分「几乎必然」路径性质与分布性质。", "使用反射原理必须依赖强 Markov 性与路径连续性。"],
        forbiddenErrors: ["【可导性误设】对 B_t 逐点求导或用普通链式法则。", "【有界变差假设】按经典 Stieltjes 积分处理 ∫ f dB。", "【二次变差为零】沿用光滑函数二次变差为零的直觉。", "【极大值分布错算】漏掉反射原理的因子 2 或用单尾正态概率。"],
        parameterConstraints: { initialValue: "标准 BM 要求 B_0 = 0；一般起点需平移。", varianceScaling: "增量方差等于时间增量（σ ≠ 1 时为 σ^2(t-s)）。", filtrationAdaptedness: "所有结论相对自然域流（含增广）陈述。" },
        closureChecks: ["核对增量的独立性与方差是否等于时间差。", "涉及极大值或首达时时明确使用反射原理与强 Markov 性。", "使用指数鞅时验证参数并说明可选停止的条件。"],
        scenarioChecks: { hittingTimeComputation: ["用指数鞅与可选停止定理计算双边首达概率与期望时间。"], quadraticVariationChecks: ["由 [B]_t = t 判断随机积分与 Itô 校正项。"], scalingArguments: ["用尺度不变性把一般时间区间归一化处理。"] },
    },
    // 鞅与可选停止定理。
    "martingale-optional-stopping": {
        definitions: ["(M_t) 关于域流 (F_t) 为鞅指 M_t 适应、可积且 E[M_t | F_s] = M_s（s < t）；可选停止定理给出 E[M_τ] = E[M_0] 成立的条件。"],
        formulas: ["鞅性：E[M_{n+1} | F_n] = M_n；上鞅 ≤，下鞅 ≥。", "可选停止（充分条件之一）：τ 有界；或 τ 几乎必然有限且 (M_{t∧τ}) 一致可积；或 τ 可积且增量有界。", "Wald 恒等式：i.i.d. 和 S_n 与可积停时 τ ⇒ E[S_τ] = E[τ] E[X]。", "指数鞅：E[exp(λS_n - n ψ(λ))] 型鞅用于首达概率（赌徒破产、随机游走）。", "Doob 停止后仍为鞅：(M_{t ∧ τ}) 是鞅，故 E[M_{t ∧ τ}] = E[M_0] 恒成立（无需附加条件）。"],
        theorems: ["可选停止定理在无附加条件时可失效：简单对称随机游走与 τ = 首次到 1 的时刻给出 E[M_τ] = 1 ≠ 0 = M_0。", "一致可积鞅收敛：(M_n) 一致可积 ⇒ M_n → M_∞ 于 L^1 且 M_n = E[M_∞ | F_n]（闭鞅）。", "Optional stopping 的三组标准条件（有界停时、一致可积、有界增量加可积停时）互不包含，需按题设选择。"],
        generalRequirements: ["必须验证停时的可测性（{τ ≤ t} ∈ F_t）与所用可积性条件之一。", "必须写明域流；同一过程相对不同域流鞅性可能不同。"],
        forbiddenErrors: ["【无条件套用】对无界停时直接写 E[M_τ] = M_0 而不验证一致可积或增量有界。", "【停时非停时】使用依赖未来信息的随机时刻（如最大值到达时刻）。", "【适应性缺失】被积/被条件化过程非适应仍断言鞅性。", "【上鞅下鞅方向混淆】把上鞅的不等号方向写反导致结论反向。"],
        parameterConstraints: { integrability: "要求 E|M_t| < ∞ 对每个 t。", stoppingTimeMeasurability: "{τ ≤ t} ∈ F_t（离散情形 {τ = n} ∈ F_n）。", uniformIntegrability: "无界停时需 (M_{t ∧ τ}) 一致可积或增量有界且 E[τ] < ∞。" },
        closureChecks: ["写出域流并验证适应性与可积性。", "核对停时定义不依赖未来。", "明确引用哪一组可选停止条件并逐条验证。"],
        scenarioChecks: { gamblersRuin: ["用鞅与可选停止求破产概率与期望时长。"], hittingProbabilities: ["构造指数鞅或 h-调和函数求击中概率。"], counterexampleAwareness: ["单边首达时刻说明无条件套用会得到矛盾结论。"] },
    },
    // Doob 不等式、上穿引理与鞅收敛。
    "doob-inequalities-convergence": {
        definitions: ["Doob 不等式用终端时刻的矩控制路径极大值；上穿不等式控制鞅穿越区间的次数，二者给出鞅收敛定理的证明路径。"],
        formulas: ["极大不等式（非负下鞅）：P(max_{s ≤ t} M_s ≥ λ) ≤ E[M_t]/λ。", "L^p 极大不等式（p > 1）：E[(max_{s ≤ t} |M_s|)^p] ≤ (p/(p-1))^p E[|M_t|^p]，p = 2 时常数为 4。", "上穿不等式：E[U_n[a,b]] ≤ (E[(M_n - a)^-])/(b - a)，U_n 为上穿次数。", "Doob 分解（离散）：任意可积适应过程 X_n = M_n + A_n，M 为鞅、A 为可预测过程且 A_0 = 0（下鞅时 A 非降）。", "Doob-Meyer（连续）：右连续下鞅唯一分解为局部鞅加可预测非降过程。"],
        theorems: ["鞅收敛定理：sup_n E|M_n| < ∞（特别是非负鞅或 L^1 有界鞅）⇒ M_n 几乎必然收敛到可积极限。", "L^p 收敛（p > 1）：sup_n E|M_n|^p < ∞ ⇒ M_n 于 L^p 与几乎必然同时收敛。", "L^1 收敛需一致可积：非负鞅可几乎必然收敛但 E[M_∞] < E[M_0] 可能严格（如指数鞅退化到 0）。", "反向鞅收敛（Lévy 向下定理）给出条件期望关于递缩域流的收敛，是 Kolmogorov 0-1 律等结论的工具。"],
        generalRequirements: ["必须区分几乎必然收敛、L^1 收敛与一致可积性三者，不可互推。", "使用 L^p 不等式必须核对 p > 1（p = 1 时不成立）。"],
        forbiddenErrors: ["【期望保持误设】由 M_n → M_∞ 几乎必然断言 E[M_∞] = E[M_0]（需一致可积）。", "【p = 1 用 L^p 不等式】对 p = 1 套用 (p/(p-1))^p 常数。", "【非负性缺失】对可变号鞅使用非负下鞅版极大不等式。", "【Doob 分解方向】把可预测部分写成非可预测的适应过程或忽略其单调性。"],
        parameterConstraints: { submartingaleNonnegativity: "极大不等式的初等形式要求非负下鞅。", exponentRange: "L^p 极大不等式要求 p > 1。", uniformIntegrability: "L^1 收敛与闭鞅表示要求一致可积。" },
        closureChecks: ["确认过程是鞅、下鞅还是上鞅并核对不等号方向。", "检查所需的非负性、L^p 有界或一致可积条件。", "区分结论的收敛模式并说明极限的可积性。"],
        scenarioChecks: { branchingProcessLimits: ["分支过程归一化后的非负鞅收敛，需讨论极限是否退化。"], stochasticApproximation: ["用鞅收敛定理证明随机逼近/Robbins-Monro 算法的收敛。"], maximalBounds: ["用 Doob L^2 不等式给出路径极大值的矩估计。"] },
    },
    // Itô 积分：构造、等距性与鞅性。
    "ito-integral-isometry": {
        definitions: ["Itô 积分 ∫_0^T H_s dB_s 先在简单可预测过程上定义，再由 L^2 等距性延拓到平方可积可预测过程；结果是连续平方可积鞅。"],
        formulas: ["Itô 等距性：E[(∫_0^T H_s dB_s)^2] = E[∫_0^T H_s^2 ds]。", "零均值鞅性：E[∫_0^T H_s dB_s] = 0，且 (∫_0^t H dB)_{t ≤ T} 是鞅。", "二次变差：[∫ H dB]_t = ∫_0^t H_s^2 ds。", "极化形式：E[∫ H dB ∫ K dB] = E[∫ H_s K_s ds]。", "简单过程定义：∑_i H_{t_i}(B_{t_{i+1}} - B_{t_i})，被积过程取左端点（前瞻取值会破坏鞅性）。"],
        theorems: ["Itô 积分与 Stratonovich 积分相差 (1/2)∫ d[H, B]，故两者的链式法则不同。", "可预测性（左端点取值）是鞅性与等距性成立的关键：取右端点或中点得到不同的积分。", "局部化：H 只满足 ∫_0^T H_s^2 ds < ∞ 几乎必然时积分仍有定义，但只是局部鞅，可能不是鞅。", "Itô 表示定理：Brownian 域流下任意平方可积鞅可写成 M_0 + ∫ H dB。"],
        generalRequirements: ["必须验证被积过程适应/可预测且满足平方可积条件。", "断言鞅性必须区分真鞅与局部鞅（后者期望可能不守恒）。"],
        forbiddenErrors: ["【前瞻取值】用区间右端点或未来信息构造被积过程。", "【等距性误写】写成 E[(∫H dB)^2] = (E∫H ds)^2 或漏掉平方。", "【局部鞅当鞅】对仅局部平方可积的积分断言 E[·] = 0。", "【Stratonovich 混用】用普通链式法则处理 Itô 积分。"],
        parameterConstraints: { adaptedness: "H 必须关于 (F_t) 可预测（左连续适应）。", squareIntegrability: "真鞅性要求 E[∫_0^T H_s^2 ds] < ∞。", brownianDriver: "标准结论针对 Brownian 运动驱动；一般半鞅需相应二次变差。" },
        closureChecks: ["核对被积过程的适应性与平方可积性。", "用等距性计算二阶矩并核对量纲（时间积分）。", "说明结果是鞅还是局部鞅。"],
        scenarioChecks: { varianceOfStochasticIntegral: ["用 Itô 等距性直接算随机积分的方差。"], hedgingRepresentation: ["用 Itô 表示定理把目标随机变量写成可对冲的积分形式。"], localMartingaleCaution: ["积分被积函数增长过快时只能用局部鞅性质并配合停时。"] },
    },
    // Itô 公式：二阶校正与乘积法则。
    "ito-formula": {
        definitions: ["Itô 公式是随机分析的链式法则：由于 Brownian 路径二次变差非零，函数变换需额外的二阶校正项。"],
        formulas: ["一维：df(B_t) = f'(B_t) dB_t + (1/2) f''(B_t) dt。", "含时：df(t, X_t) = ∂_t f dt + ∂_x f dX_t + (1/2) ∂_{xx} f d[X]_t。", "一般 Itô 过程 dX_t = μ_t dt + σ_t dB_t：df(X_t) = (f'μ_t + (1/2) f''σ_t^2) dt + f'σ_t dB_t。", "乘积法则：d(X_t Y_t) = X_t dY_t + Y_t dX_t + d[X, Y]_t。", "多维：df(X) = ∑_i ∂_i f dX^i + (1/2) ∑_{i,j} ∂_{ij} f d[X^i, X^j]。"],
        theorems: ["Itô 公式要求 f ∈ C^2（含时情形 C^{1,2}）；对 |x| 等非光滑函数需 Tanaka 公式与局部时。", "指数鞅：dS = σ S dB ⇒ S_t = S_0 exp(σB_t - σ^2 t/2)，指数中的 -σ^2 t/2 正是 Itô 校正的体现。", "用 Itô 公式验证鞅性：漂移项系数为零 ⇔ 过程为局部鞅（Dynkin 算子消失）。", "Feynman-Kac 公式由 Itô 公式加期望给出 PDE 与 SDE 的对应。"],
        generalRequirements: ["必须写出完整的二阶项，并使用正确的二次变差 d[X]_t（不是 dt 通用）。", "使用前必须核对 f 的 C^2 光滑性与过程的半鞅性。"],
        forbiddenErrors: ["【二阶项遗漏】按普通链式法则写 df = f' dX。", "【二次变差错误】对一般 Itô 过程仍用 (dX)^2 = dt 而非 σ^2 dt。", "【光滑性不足】对绝对值、max 等非 C^2 函数直接套用。", "【交叉变差漏项】多维或乘积法则中漏掉 d[X, Y] 项。"],
        parameterConstraints: { smoothness: "f ∈ C^2（时间变量只需 C^1）。", semimartingale: "X 必须是（连续）半鞅并给出其二次变差。", crossVariation: "多维情形需给出协变差 d[X^i, X^j]（独立 Brownian 时为 0）。" },
        closureChecks: ["写出 dX 的漂移与扩散系数并计算 d[X]。", "逐项列出 ∂_t、∂_x、∂_{xx} 贡献。", "分离漂移项与鞅项，据此判断鞅性。"],
        scenarioChecks: { geometricBrownianMotion: ["解 dS = μS dt + σS dB 得对数正态解并识别 -σ^2/2 校正。"], martingaleVerification: ["令漂移项为零求出使过程成为鞅的参数或函数。"], feynmanKacLink: ["把期望 u(t,x) = E[f(X_T) | X_t = x] 转化为抛物型 PDE。"] },
    },
    // SDE：强解存在唯一性与强弱解之分。
    "sde-existence-uniqueness": {
        definitions: ["随机微分方程 dX_t = b(t, X_t) dt + σ(t, X_t) dB_t 的强解是给定 Brownian 运动与域流下适应的解；弱解允许同时构造概率空间与 Brownian 运动。"],
        formulas: ["积分形式：X_t = X_0 + ∫_0^t b(s, X_s) ds + ∫_0^t σ(s, X_s) dB_s。", "Lipschitz 条件：|b(t,x) - b(t,y)| + |σ(t,x) - σ(t,y)| ≤ K|x - y|。", "线性增长：|b(t,x)| + |σ(t,x)| ≤ K(1 + |x|)。", "矩估计：上述条件下 E[sup_{t ≤ T} |X_t|^2] ≤ C(1 + E|X_0|^2) e^{CT}。", "线性 SDE 显式解（Ornstein-Uhlenbeck）：dX = -θX dt + σ dB ⇒ X_t = X_0 e^{-θt} + σ∫_0^t e^{-θ(t-s)} dB_s。"],
        theorems: ["Itô 存在唯一性定理：系数满足 Lipschitz 与线性增长且 E|X_0|^2 < ∞ ⇒ 存在唯一强解（轨道唯一）。", "Yamada-Watanabe：弱解存在 + 轨道唯一 ⇒ 强解存在且唯一；仅有弱唯一性不足以得到强解。", "线性增长条件不可省：dX = X^2 dt 型超线性漂移可在有限时间爆破。", "Lipschitz 可放宽：一维情形 σ 只需 Hölder-1/2（Yamada-Watanabe 条件），如 CIR 过程；Tanaka 例子说明纯扩散系数不连续时可能只有弱解。"],
        generalRequirements: ["必须逐条验证 Lipschitz 与线性增长，并声明初值的可积性。", "必须明确所求是强解还是弱解，两者的唯一性含义不同。"],
        forbiddenErrors: ["【条件跳过】对超线性系数直接断言全局解存在。", "【强弱解混淆】用弱解的存在性断言强解唯一。", "【适应性缺失】给出的解依赖未来 Brownian 增量。", "【爆破忽略】不讨论爆破时间就在全时间区间上使用解。"],
        parameterConstraints: { lipschitzConstant: "K 与 x 无关（可依赖 t 且局部有界）。", initialCondition: "X_0 为 F_0 可测且 E|X_0|^2 < ∞。", timeHorizon: "结论在 [0, T] 上成立，T 任意有限。" },
        closureChecks: ["逐项验证系数的 Lipschitz 与增长条件。", "说明解的类型（强/弱）与唯一性类型（轨道/分布）。", "如条件不满足，讨论局部解与爆破时间。"],
        scenarioChecks: { linearSDEExplicitSolution: ["用 Itô 公式与积分因子解线性 SDE（OU、GBM）。"], degenerateCoefficients: ["CIR、Bessel 等 σ = √x 型模型用 Yamada-Watanabe 条件。"], numericalScheme: ["Euler-Maruyama 的收敛阶依赖同一组 Lipschitz 条件。"] },
    },
    // Girsanov 定理：漂移变换与等价鞅测度。
    "girsanov-theorem": {
        definitions: ["Girsanov 定理说明通过指数鞅给出的测度变换可以改变 Brownian 运动的漂移而保持路径的二次变差不变，是等价鞅测度构造的基础。"],
        formulas: ["密度过程：Z_t = exp(-∫_0^t θ_s dB_s - (1/2)∫_0^t θ_s^2 ds)，dQ/dP|_{F_T} = Z_T。", "新 Brownian 运动：B̃_t = B_t + ∫_0^t θ_s ds 在 Q 下是标准 Brownian 运动。", "Novikov 条件：E_P[exp((1/2)∫_0^T θ_s^2 ds)] < ∞ ⇒ Z 是真鞅且 Q 为概率测度。", "漂移变换：dX = b dt + σ dB 在 Q 下变为 dX = (b - σθ) dt + σ dB̃。", "期望换算：E_Q[F] = E_P[Z_T F]。"],
        theorems: ["Girsanov 定理要求两测度在 F_T 上等价（Z_T > 0 几乎必然），故只能改漂移，不能改扩散系数或引入新的跳跃。", "Novikov 条件是充分非必要；Kazamaki 条件给出另一充分判据；条件不满足时 Z 只是严格局部鞅，E[Z_T] < 1 而 Q 非概率测度。", "金融应用：无套利等价于存在等价鞅测度（资产定价第一基本定理），完备性等价于其唯一（第二基本定理）。", "二次变差在测度变换下不变，故波动率是「可从路径观测的」而漂移不是。"],
        generalRequirements: ["必须验证 Novikov 或 Kazamaki 条件以保证 Z 是真鞅。", "必须固定有限时间界 T 并在 F_T 上陈述等价性。"],
        forbiddenErrors: ["【真鞅性未验】直接假定 E[Z_T] = 1。", "【改变扩散系数】声称测度变换可调整 σ 或消除跳跃。", "【无穷时间等价】在 F_∞ 上断言两测度等价（通常只在有限 T 上成立）。", "【符号错误】B̃ = B - ∫θ ds 与 B̃ = B + ∫θ ds 混用导致漂移方向反号。"],
        parameterConstraints: { novikov: "E_P[exp((1/2)∫_0^T θ^2 ds)] < ∞（或 Kazamaki 条件）。", finiteHorizon: "结论限定在有限时间区间 [0, T] 与 F_T 上。", equivalence: "要求 Z_T > 0 几乎必然，两测度互相绝对连续。" },
        closureChecks: ["写出 θ 与密度过程 Z 并验证真鞅条件。", "核对 B̃ 的符号与新漂移表达式。", "计算期望时统一在同一测度下并显式带上 Z_T。"],
        scenarioChecks: { riskNeutralPricing: ["把 μ 变换为 r 得到风险中性测度并对折现资产定价。"], importanceSampling: ["用测度变换做重要性抽样以降低模拟方差。"], driftEstimationLimits: ["漂移可被测度变换改变，说明有限区间内漂移不可由单条路径确定。"] },
    },
};
