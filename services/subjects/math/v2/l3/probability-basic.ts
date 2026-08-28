import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“概率论-基础概率”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const PROBABILITY_BASIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 概率空间与 Kolmogorov 公理。
    "probability-space-axioms": {
        id: "probability-space-axioms", l2Key: "probability-basic", name: "概率空间与 Kolmogorov 公理", kind: "object",
        aliases: ["概率空间", "概率公理", "Kolmogorov公理", "可测空间", "σ代数"],
    },
    // 条件期望的塔性质与投影刻画。
    "conditional-expectation-tower": {
        id: "conditional-expectation-tower", l2Key: "probability-basic", name: "条件期望与塔性质", kind: "theorem",
        aliases: ["条件期望", "全期望公式", "塔性质", "tower property", "L2投影"],
    },
    // 全方差分解。
    "total-variance-decomposition": {
        id: "total-variance-decomposition", l2Key: "probability-basic", name: "全方差公式", kind: "formula",
        aliases: ["全方差公式", "方差分解", "law of total variance", "条件方差"],
    },
    // Jensen 不等式与凸性。
    "jensen-inequality-probability": {
        id: "jensen-inequality-probability", l2Key: "probability-basic", name: "Jensen 不等式", kind: "theorem",
        aliases: ["概率Jensen不等式", "probabilistic Jensen inequality", "凸函数期望不等式"],
    },
    // 尾概率不等式：Markov、Chebyshev、Chernoff。
    "tail-probability-inequalities": {
        id: "tail-probability-inequalities", l2Key: "probability-basic", name: "尾概率不等式", kind: "criterion",
        aliases: ["Markov不等式", "Chebyshev不等式", "Chernoff界", "尾概率估计", "集中不等式"],
    },
    // 特征函数：唯一性、反演与独立和。
    "characteristic-function": {
        id: "characteristic-function", l2Key: "probability-basic", name: "特征函数与矩母函数", kind: "object",
        aliases: ["特征函数", "矩母函数", "characteristic function", "反演公式", "Bochner定理"],
    },
    // 多元正态分布的条件分布与独立性判据。
    "multivariate-normal-distribution": {
        id: "multivariate-normal-distribution", l2Key: "probability-basic", name: "多元正态分布", kind: "object",
        aliases: ["多元正态", "多维正态分布", "协方差矩阵", "条件正态分布", "Schur补"],
    },
    // 随机向量变换：Jacobian 公式与卷积。
    "random-vector-transformation": {
        id: "random-vector-transformation", l2Key: "probability-basic", name: "随机向量变换与卷积", kind: "formula",
        aliases: ["随机变量函数分布", "Jacobian变换", "卷积公式", "随机向量变量替换", "次序统计量分布"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const PROBABILITY_BASIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // 概率空间：三元组 (Ω, F, P) 与可数可加性。
    "probability-space-axioms": {
        definitions: ["概率空间是三元组 (Ω, F, P)：Ω 为样本空间，F 为 Ω 上的 σ 代数，P 为 F 上满足规范性与可数可加性的测度。"],
        formulas: ["公理：P(A) ≥ 0；P(Ω) = 1；互不相交 {A_n} ⇒ P(∪ A_n) = ∑ P(A_n)。", "连续性：A_n ↑ A ⇒ P(A_n) → P(A)；A_n ↓ A 且 P(A_1) < ∞ ⇒ P(A_n) → P(A)。", "容斥：P(∪_{i=1}^n A_i) = ∑_k (-1)^{k-1} ∑_{|S| = k} P(∩_{i ∈ S} A_i)。", "次可加性：P(∪ A_n) ≤ ∑ P(A_n)（Boole 不等式）。"],
        theorems: ["Carathéodory 扩张定理：半环上的预测度可唯一扩张到生成的 σ 代数，是概率测度构造的基础。", "π-λ（Dynkin）定理：在生成 σ 代数的 π 系上相等的两个概率测度全局相等，是唯一性论证的标准工具。", "Kolmogorov 扩张定理：相容的有限维分布族唯一决定乘积空间上的概率测度，保证随机过程存在。"],
        generalRequirements: ["必须先明确 σ 代数 F；只在 F 中的集合上谈概率。", "涉及不可数 Ω 必须说明可测性，不能对任意子集赋概率。"],
        forbiddenErrors: ["【可测性缺失】对非可测集或未声明的事件族直接赋概率。", "【有限可加代替可数可加】只验证有限可加性就当作概率测度。", "【等可能性滥用】在无限或非对称样本空间上默认均匀分布。", "【零测非空混淆】由 P(A) = 0 断言 A = ∅（或由 P(A) = 1 断言 A = Ω）。"],
        parameterConstraints: { sigmaAlgebra: "F 必须对补与可数并封闭且含 Ω。", normalization: "P(Ω) = 1，且 P 取值于 [0,1]。", countableAdditivity: "可加性要求事件两两不交且为可数族。" },
        closureChecks: ["写出 (Ω, F, P) 并确认所讨论事件属于 F。", "核对规范性与可数可加性。", "若用极限操作，引用测度连续性而非直接换序。"],
        scenarioChecks: { geometricProbability: ["几何概型用 Lebesgue 测度归一化，须说明区域可测且测度有限。"], infiniteCoinTossing: ["可数无穷试验空间用柱集生成 σ 代数并由扩张定理构造 P。"], uniquenessArguments: ["证明两分布相同时用 π-λ 定理，只在生成族上比较。"] },
    },
    // 条件期望：L^2 投影与塔性质。
    "conditional-expectation-tower": {
        definitions: ["条件期望 E[X | G] 是 G 可测且满足 ∫_A E[X | G] dP = ∫_A X dP（∀A ∈ G）的随机变量，几乎必然唯一；X ∈ L^2 时它是 X 到 L^2(G) 的正交投影。"],
        formulas: ["塔性质：H ⊆ G ⇒ E[E[X | G] | H] = E[X | H]；特别地 E[E[X | G]] = E[X]。", "取出已知量：Y 为 G 可测且 XY 可积 ⇒ E[XY | G] = Y E[X | G]。", "独立性：X 与 G 独立 ⇒ E[X | G] = E[X]。", "条件 Jensen：φ 凸 ⇒ φ(E[X | G]) ≤ E[φ(X) | G]。", "最优预测：E[X | G] 最小化 E[(X - Z)^2]（Z 取遍 G 可测的平方可积变量）。"],
        theorems: ["存在唯一性由 Radon-Nikodým 定理给出（X 可积即可，不需 L^2）。", "条件期望是压缩算子：‖E[X | G]‖_p ≤ ‖X‖_p（p ≥ 1）。", "条件收敛定理：条件版本的单调收敛、Fatou、控制收敛均成立。"],
        generalRequirements: ["必须先声明条件所依赖的 σ 代数（或随机变量生成的 σ 代数）。", "使用取出已知量必须核对 Y 的 G 可测性与乘积可积性。"],
        forbiddenErrors: ["【逐点定义误用】把 E[X | Y] 当作对每个 y 的初等平均而忽略几乎必然唯一性。", "【可测性误判】把非 G 可测的因子提到条件期望外。", "【条件化方向颠倒】混用 E[X | G] 与 E[G | X] 型表述或塔性质取错粗细。", "【可积性缺失】对不可积 X 使用条件期望或换序取极限。"],
        parameterConstraints: { integrability: "要求 E|X| < ∞（或 X ≥ 0 允许取 +∞）。", subAlgebra: "塔性质要求较粗的 σ 代数包含于较细者。", almostSureUniqueness: "结论只在 P 几乎必然意义下唯一。" },
        closureChecks: ["明确 σ 代数并验证可积性。", "使用塔性质时核对 H ⊆ G 的方向。", "若做最优预测，确认在 L^2 中并说明正交性。"],
        scenarioChecks: { multiStageExperiments: ["分阶段试验用全期望公式按第一阶段结果分解。"], randomSumsWald: ["随机个数求和 E[∑_{i≤N} X_i] = E[N] E[X] 需 N 与 X_i 独立并用条件期望。"], martingaleConstruction: ["用塔性质验证 E[M_{n+1} | F_n] = M_n 得到鞅。"] },
    },
    // 全方差公式：方差的组间与组内分解。
    "total-variance-decomposition": {
        definitions: ["全方差公式把方差分解为条件期望的方差（组间）与条件方差的期望（组内）两部分。"],
        formulas: ["Var(X) = Var(E[X | G]) + E[Var(X | G)]。", "条件方差定义：Var(X | G) = E[X^2 | G] - (E[X | G])^2。", "协方差版本：Cov(X, Y) = Cov(E[X | G], E[Y | G]) + E[Cov(X, Y | G)]。", "混合分布应用：X | N ~ 已知时 Var(X) 由两项相加而非仅取条件方差。"],
        theorems: ["由塔性质与 Var 的定义直接推出；要求 X ∈ L^2。", "推论（Rao-Blackwell 型）：Var(E[X | G]) ≤ Var(X)，条件化不增加方差。", "推论：E[Var(X | G)] = 0 ⇔ X 几乎必然是 G 可测的。"],
        generalRequirements: ["必须两项齐全，不得只取组内或只取组间。", "使用前必须确认 E[X^2] < ∞。"],
        forbiddenErrors: ["【漏项】写成 Var(X) = E[Var(X | G)] 或 Var(X) = Var(E[X | G])。", "【顺序颠倒】把 Var(E[·]) 与 E[Var(·)] 互换。", "【二阶矩缺失】对无二阶矩的分布使用分解。", "【条件方差当常数】把 Var(X | G) 当作与条件无关的常数直接取出。"],
        parameterConstraints: { secondMoment: "要求 E[X^2] < ∞。", conditioningSigmaAlgebra: "G 为子 σ 代数（常取某随机变量生成）。", nonnegativity: "两项均非负，可用于检查计算结果。" },
        closureChecks: ["分别写出 E[X | G] 与 Var(X | G) 的表达式。", "核对两项均非负且相加等于总方差。", "若为混合/复合分布，说明条件参数的随机性来源。"],
        scenarioChecks: { compoundDistributions: ["复合 Poisson 等随机和的方差用全方差公式（含 Var(N) 项）。"], hierarchicalModels: ["分层模型中区分组间方差与组内方差。"], varianceReduction: ["条件化降低方差是 Rao-Blackwell 与方差缩减技术的依据。"] },
    },
    // Jensen 不等式：凸性与期望的交换方向。
    "jensen-inequality-probability": {
        definitions: ["Jensen 不等式给出凸函数与期望的交换方向：凸函数在期望点的值不超过函数值的期望，是矩不等式的统一来源。"],
        formulas: ["φ 凸且 X、φ(X) 可积 ⇒ φ(E[X]) ≤ E[φ(X)]；φ 凹时不等号反向。", "条件版本：φ(E[X | G]) ≤ E[φ(X) | G]。", "严格性：φ 严格凸 ⇒ 等号成立 ⇔ X 几乎必然为常数。", "推论：矩不等式 (E|X|^p)^{1/p} ≤ (E|X|^q)^{1/q}（p ≤ q）；AM-GM 的概率形式 E[ln X] ≤ ln E[X]。"],
        theorems: ["Jensen 不等式对任意凸 φ 成立（可用支撑直线 φ(x) ≥ φ(m) + c(x - m) 取期望证明）。", "Lyapunov 不等式与 Hölder、Cauchy-Schwarz 均可由 Jensen 导出。", "Kullback-Leibler 散度非负性（Gibbs 不等式）是 Jensen 的直接推论。"],
        generalRequirements: ["必须核对凸性方向与 X、φ(X) 的可积性。", "断言严格不等号必须验证严格凸性与 X 非退化。"],
        forbiddenErrors: ["【凸凹方向错误】对凹函数使用凸函数方向的不等号。", "【局部凸性外推】在 X 取值范围外判断凸性或忽略取值区间限制。", "【可积性缺失】E[φ(X)] 可能为 +∞ 而仍作有限量运算。", "【等号误判】未验证 X 为常数就断言等号成立。"],
        parameterConstraints: { convexity: "φ 在 X 的取值区间（凸集）上凸。", integrability: "要求 E|X| < ∞ 且 E[φ(X)] 有定义。", strictness: "严格不等号要求 φ 严格凸且 X 非退化。" },
        closureChecks: ["确认 φ 的凸性及其定义域覆盖 X 的取值。", "核对可积性。", "若需等号情形，讨论 X 是否退化。"],
        scenarioChecks: { momentComparison: ["用 Jensen 比较不同阶矩或证明 Lyapunov 不等式。"], entropyAndDivergence: ["证明 KL 散度非负、熵的上界。"], estimatorBias: ["非线性变换后的估计量偏差方向由 Jensen 判定。"] },
    },
    // 尾概率不等式：Markov、Chebyshev、Chernoff、Hoeffding。
    "tail-probability-inequalities": {
        definitions: ["尾概率不等式用矩或矩母函数给出偏离概率的上界，是集中现象与大数定律定量化的基本工具。"],
        formulas: ["Markov：X ≥ 0，t > 0 ⇒ P(X ≥ t) ≤ E[X]/t。", "Chebyshev：P(|X - μ| ≥ kσ) ≤ 1/k^2。", "Chernoff：P(X ≥ t) ≤ inf_{λ>0} e^{-λt} M_X(λ)，M_X 为矩母函数。", "Hoeffding：X_i ∈ [a_i, b_i] 独立 ⇒ P(|∑(X_i - EX_i)| ≥ t) ≤ 2exp(-2t^2/∑(b_i - a_i)^2)。", "Paley-Zygmund（下界）：P(X > θE[X]) ≥ (1-θ)^2 (E[X])^2/E[X^2]。"],
        theorems: ["Chebyshev 是 Markov 应用于 (X - μ)^2 的结果；Chernoff 是应用于 e^{λX} 的结果，故三者同源。", "指数型界要求矩母函数在原点邻域有限（次高斯/次指数条件），重尾分布只能得到多项式衰减界。", "Chebyshev 界在一般分布类中是紧的（存在达到等号的两点分布），故改进必须附加分布假设。"],
        generalRequirements: ["必须核对非负性、矩存在性或有界性等对应前提。", "使用指数界必须说明矩母函数的有限区间或有界区间参数。"],
        forbiddenErrors: ["【非负性缺失】对可取负值的 X 直接用 Markov 不等式。", "【矩母函数存在性忽略】对重尾分布使用 Chernoff/Hoeffding 型指数界。", "【独立性缺失】对相依变量套用 Hoeffding。", "【界当近似】把上界当作概率的近似值或等式使用。"],
        parameterConstraints: { nonnegativity: "Markov 要求 X ≥ 0 且 t > 0。", momentExistence: "Chebyshev 要求 σ^2 < ∞；Chernoff 要求 M_X(λ) < ∞。", boundedness: "Hoeffding 要求各 X_i 落在已知有界区间且相互独立。" },
        closureChecks: ["核对所用不等式的前提（非负、方差有限、有界、独立）。", "写清偏离量 t 与参数的关系。", "指明结论为上界，不得反向使用。"],
        scenarioChecks: { weakLawProof: ["由 Chebyshev 直接证明弱大数定律并给出样本量估计。"], concentrationForSums: ["独立有界和用 Hoeffding 给出指数尾界。"], heavyTailCaution: ["重尾情形只能用 Markov/Chebyshev 型多项式界。"] },
    },
    // 特征函数与矩母函数：唯一性、反演与独立和。
    "characteristic-function": {
        definitions: ["特征函数 φ_X(t) = E[e^{itX}] 对任意分布恒存在且唯一决定分布；矩母函数 M_X(t) = E[e^{tX}] 只在原点邻域有限时可用。"],
        formulas: ["独立和：X ⊥ Y ⇒ φ_{X+Y}(t) = φ_X(t) φ_Y(t)。", "矩关系：φ_X 在 0 处 k 阶可导 ⇒ E[X^k] = φ_X^{(k)}(0)/i^k。", "反演公式：密度存在时 f(x) = (1/2π) ∫ e^{-itx} φ_X(t) dt。", "正态：φ(t) = exp(iμt - σ^2 t^2/2)；Poisson：exp(λ(e^{it} - 1))；Cauchy：exp(-|t|)（无矩母函数）。", "基本性质：φ_X(0) = 1，|φ_X(t)| ≤ 1，φ_X(-t) = \\overline{φ_X(t)}。"],
        theorems: ["唯一性定理：φ_X = φ_Y ⇒ X 与 Y 同分布。", "Bochner 定理：连续、正定且在 0 取 1 的函数恰为某分布的特征函数。", "Lévy 连续性定理：φ_n → φ 逐点且 φ 连续 ⇔ 对应分布弱收敛（是 CLT 证明的核心）。", "Cramér 分解定理：正态随机变量的独立分解因子必为正态。"],
        generalRequirements: ["使用矩母函数必须验证其在原点邻域有限，否则改用特征函数。", "由 φ 反推分布必须引用唯一性定理，不可只比较有限个矩。"],
        forbiddenErrors: ["【矩母函数存在性假设】对 Cauchy、重尾分布使用矩母函数。", "【矩决定分布】由所有矩相同断言同分布而不验证矩问题的确定性。", "【独立性缺失】对相依变量用乘积公式。", "【实部虚部混淆】把 φ_X 当实值函数处理或忽略共轭对称性。"],
        parameterConstraints: { existence: "特征函数对任意分布存在；矩母函数需 M_X(t) < ∞ 于 t ∈ (-δ, δ)。", momentDifferentiability: "由 φ 求 k 阶矩要求 E|X|^k < ∞。", inversionCondition: "反演给出密度需 φ 可积或分布绝对连续。" },
        closureChecks: ["写出 φ_X 并核对 φ_X(0) = 1、|φ_X| ≤ 1。", "独立和使用乘积前确认独立性。", "识别分布时引用唯一性定理。"],
        scenarioChecks: { sumOfIndependentVariables: ["用乘积性质识别独立和的分布（正态、Poisson、Gamma 的可加性）。"], cltProof: ["Taylor 展开 φ 并配合 Lévy 连续性定理证明中心极限定理。"], heavyTailIdentification: ["由 φ 在 0 处不可导识别无穷方差或无穷期望。"] },
    },
    // 多元正态：条件分布、独立性判据与线性变换封闭性。
    "multivariate-normal-distribution": {
        definitions: ["随机向量 X 服从多元正态 N(μ, Σ) 当且仅当其任意线性组合 a^T X 均为一维正态；Σ 为对称半正定协方差矩阵。"],
        formulas: ["密度（Σ 正定时）：f(x) = (2π)^{-n/2} |Σ|^{-1/2} exp(-(x-μ)^T Σ^{-1} (x-μ)/2)。", "特征函数：φ_X(t) = exp(i t^T μ - t^T Σ t/2)（Σ 退化时仍成立）。", "线性变换：X ~ N(μ, Σ) ⇒ AX + b ~ N(Aμ + b, AΣA^T)。", "条件分布：X_1 | X_2 = x_2 ~ N(μ_1 + Σ_{12}Σ_{22}^{-1}(x_2 - μ_2), Σ_{11} - Σ_{12}Σ_{22}^{-1}Σ_{21})（Schur 补）。", "二次型：Σ 正定时 (X-μ)^T Σ^{-1} (X-μ) ~ χ^2(n)。"],
        theorems: ["联合正态时不相关等价于独立（一般分布不成立）。", "条件均值对条件值线性、条件协方差与条件值无关，这是正态分布的特征性质。", "Cochran 定理：正态样本的二次型分解为独立 χ^2，是方差分析与 t/F 分布的基础。"],
        generalRequirements: ["用不相关推独立必须先确认联合正态（不只是各分量边缘正态）。", "Σ 退化时不得使用密度公式，应改用特征函数或退化子空间表述。"],
        forbiddenErrors: ["【边缘正态推联合正态】由各分量正态断言联合正态。", "【不相关推独立越界】在非联合正态下用 Cov = 0 断言独立。", "【奇异协方差用密度】Σ 不可逆仍写 |Σ|^{-1/2} 密度。", "【条件方差含 x】把条件协方差写成依赖 x_2 的表达式。"],
        parameterConstraints: { covariancePSD: "Σ 必须对称半正定；密度存在要求正定。", dimensionMatch: "μ ∈ R^n 与 Σ ∈ R^{n×n} 维数一致。", conditioningInvertibility: "条件分布公式要求 Σ_{22} 可逆（否则用广义逆）。" },
        closureChecks: ["核对 Σ 的对称半正定性与是否可逆。", "使用条件分布时写出 Schur 补并检查其正定性。", "涉及独立性结论时确认联合正态前提。"],
        scenarioChecks: { linearRegressionGeometry: ["最小二乘的正态理论用线性变换封闭性与 Cochran 定理。"], kalmanFilterUpdate: ["条件均值/协方差公式即高斯滤波的更新步。"], degenerateCases: ["Σ 奇异时分布集中在低维仿射子空间，用特征函数刻画。"] },
    },
    // 随机向量变换：Jacobian 公式、卷积与次序统计量。
    "random-vector-transformation": {
        definitions: ["随机向量变换给出 Y = g(X) 的分布：光滑一对一变换用 Jacobian 公式，一般情形用分布函数法或测度像的定义。"],
        formulas: ["Jacobian 公式：g 为双射且光滑 ⇒ f_Y(y) = f_X(g^{-1}(y)) |det J_{g^{-1}}(y)|。", "多值分支：g 分片单调 ⇒ f_Y(y) = ∑_k f_X(x_k(y)) |dx_k/dy|。", "卷积：X ⊥ Y ⇒ f_{X+Y}(z) = ∫ f_X(x) f_Y(z-x) dx。", "次序统计量：f_{X_{(k)}}(x) = n!/((k-1)!(n-k)!) F(x)^{k-1} (1-F(x))^{n-k} f(x)。", "概率积分变换：F 连续严增 ⇒ F(X) ~ U(0,1)，逆变换法由此得来。"],
        theorems: ["分布函数法（先求 P(g(X) ≤ y) 再求导）对非单调变换普遍适用，是 Jacobian 法的兜底方法。", "极值分布：F_{X_{(n)}}(x) = F(x)^n，F_{X_{(1)}}(x) = 1 - (1-F(x))^n。", "Box-Muller、极坐标变换等构造依赖 Jacobian 公式与独立性的联合验证。"],
        generalRequirements: ["用 Jacobian 公式必须验证变换在支撑上双射且 Jacobian 非零。", "必须显式给出变换后变量的支撑范围。"],
        forbiddenErrors: ["【Jacobian 绝对值遗漏】不取 |det J| 导致密度为负。", "【非单调直接套公式】对分片单调变换只取一个分支。", "【支撑范围错误】未随变换更新取值区间。", "【离散连续混用】对离散变量套用密度变换公式。"],
        parameterConstraints: { bijectivity: "Jacobian 公式要求 g 在支撑上为双射且 C^1。", nonvanishingJacobian: "要求 det J ≠ 0。", independenceForConvolution: "卷积公式要求 X 与 Y 独立。" },
        closureChecks: ["写出反变换与 Jacobian 并取绝对值。", "更新并写明新变量支撑。", "对结果做归一化检验 ∫ f_Y = 1。"],
        scenarioChecks: { simulationInverseTransform: ["逆变换抽样与 Box-Muller 生成正态样本。"], sumsAndRatios: ["独立和用卷积、比值用二维变换加边缘化（如 t 分布的构造）。"], orderStatisticsApplications: ["极差、中位数、极值分布的推导。"] },
    },
};
