import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“概率论-极限定理”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const PROBABILITY_LIMIT_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 四种收敛模式及其强弱关系。
    "convergence-modes-hierarchy": {
        id: "convergence-modes-hierarchy", l2Key: "probability-limit", name: "收敛模式的强弱关系", kind: "criterion",
        aliases: ["依概率收敛", "几乎处处收敛", "依分布收敛", "L^p收敛", "一致可积"],
    },
    // Borel-Cantelli 引理。
    "borel-cantelli-lemmas": {
        id: "borel-cantelli-lemmas", l2Key: "probability-limit", name: "Borel-Cantelli 引理", kind: "lemma",
        aliases: ["Borel-Cantelli引理", "无穷多次发生", "limsup事件", "Kolmogorov0-1律"],
    },
    // 强大数定律与 Kolmogorov 三级数定理。
    "strong-law-large-numbers": {
        id: "strong-law-large-numbers", l2Key: "probability-limit", name: "强大数定律", kind: "theorem",
        aliases: ["强大数定律", "Kolmogorov强大数定律", "三级数定理", "Etemadi", "弱大数定律"],
    },
    // Lévy 连续性定理与特征函数方法。
    "levy-continuity-theorem": {
        id: "levy-continuity-theorem", l2Key: "probability-limit", name: "Lévy 连续性定理", kind: "theorem",
        aliases: ["Lévy连续性定理", "特征函数方法", "弱收敛判据", "Prokhorov定理", "紧性"],
    },
    // Lindeberg-Feller 中心极限定理。
    "lindeberg-feller-clt": {
        id: "lindeberg-feller-clt", l2Key: "probability-limit", name: "Lindeberg-Feller 中心极限定理", kind: "theorem",
        aliases: ["中心极限定理", "CLT", "Lindeberg条件", "三角阵列", "Lyapunov条件"],
    },
    // Berry-Esseen 界与收敛速度。
    "berry-esseen-bound": {
        id: "berry-esseen-bound", l2Key: "probability-limit", name: "Berry-Esseen 界", kind: "theorem",
        aliases: ["Berry-Esseen定理", "收敛速度", "三阶矩", "正态近似误差", "Edgeworth展开"],
    },
    // Slutsky 定理与 Delta 方法。
    "slutsky-delta-method": {
        id: "slutsky-delta-method", l2Key: "probability-limit", name: "Slutsky 定理与 Delta 方法", kind: "theorem",
        aliases: ["Slutsky定理", "Delta方法", "连续映射定理", "渐近方差", "方差稳定化变换"],
    },
    // 重对数律。
    "law-of-iterated-logarithm": {
        id: "law-of-iterated-logarithm", l2Key: "probability-limit", name: "重对数律", kind: "theorem",
        aliases: ["重对数律", "Hartman-Wintner定理", "limsup精确阶", "√(2n log log n)"],
    },
    // Cramér 大偏差定理。
    "cramer-large-deviations": {
        id: "cramer-large-deviations", l2Key: "probability-limit", name: "Cramér 大偏差定理", kind: "theorem",
        aliases: ["大偏差原理", "Cramér定理", "速率函数", "Legendre变换", "Chernoff指数"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const PROBABILITY_LIMIT_L3_RULES: Record<string, MathV2L3Rules> = {
    // 收敛模式：定义、蕴含关系与反例。
    "convergence-modes-hierarchy": {
        definitions: ["随机变量列的收敛有四种基本模式：几乎必然收敛、L^p 收敛、依概率收敛与依分布收敛，强弱关系严格且反向蕴含一般不成立。"],
        formulas: ["几乎必然：P(lim X_n = X) = 1。", "依概率：∀ε > 0，P(|X_n - X| > ε) → 0。", "L^p：E|X_n - X|^p → 0（p ≥ 1）。", "依分布：F_n(x) → F(x) 于 F 的所有连续点。", "蕴含链：a.s. ⇒ 依概率 ⇒ 依分布；L^p ⇒ 依概率；p > q ≥ 1 时 L^p ⇒ L^q。"],
        theorems: ["依概率收敛 + 一致可积 ⇔ L^1 收敛；依概率收敛 ⇒ 存在几乎必然收敛的子序列。", "Skorokhod 表示：依分布收敛可实现为某概率空间上的几乎必然收敛（换构造后）。", "依分布收敛到常数 ⇒ 依概率收敛到该常数（这是唯一的反向蕴含情形）。", "标准反例：X_n 在 [0,1] 上取 n·1_{[0,1/n]} 依概率收敛但不 L^1 收敛；独立同分布非退化列依分布收敛但不依概率收敛。"],
        generalRequirements: ["必须明确所述收敛模式，并在使用蕴含关系时保持方向正确。", "依分布收敛只在极限分布函数的连续点比较，不得要求处处收敛。"],
        forbiddenErrors: ["【蕴含方向反用】由依分布收敛推依概率或几乎必然收敛（极限非常数时）。", "【连续点条件遗漏】要求 F_n(x) → F(x) 对所有 x 成立。", "【L^p 与依概率互推】由依概率收敛直接断言矩收敛（需一致可积）。", "【极限唯一性混淆】把依分布收敛的极限当作同一概率空间上的随机变量比较。"],
        parameterConstraints: { sameProbabilitySpace: "a.s./依概率/L^p 收敛要求同一概率空间；依分布收敛不要求。", momentOrder: "L^p 收敛要求 E|X_n|^p < ∞。", uniformIntegrability: "由依概率收敛升级到 L^1 需一致可积。" },
        closureChecks: ["写出所用收敛模式的定义式。", "核对蕴含方向与所需附加条件（一致可积、极限为常数）。", "若断言不成立，给出具体反例。"],
        scenarioChecks: { estimatorConsistency: ["一致性即依概率收敛，强一致性为几乎必然收敛。"], momentConvergenceUpgrade: ["需要矩收敛时补充一致可积性或有界性论证。"], weakConvergenceUsage: ["渐近分布结论只需依分布收敛，不必也不能断言更强模式。"] },
    },
    // Borel-Cantelli 引理与 0-1 律。
    "borel-cantelli-lemmas": {
        definitions: ["Borel-Cantelli 引理用概率级数的收敛性判断事件是否无穷多次发生，是几乎必然性结论的核心工具。"],
        formulas: ["第一引理：∑ P(A_n) < ∞ ⇒ P(limsup A_n) = 0（几乎必然只发生有限次）。", "第二引理：{A_n} 独立且 ∑ P(A_n) = ∞ ⇒ P(limsup A_n) = 1。", "limsup 事件：limsup A_n = ∩_N ∪_{n ≥ N} A_n = {A_n 无穷多次发生}。", "推论（a.s. 收敛判据）：∀ε > 0，∑_n P(|X_n - X| > ε) < ∞ ⇒ X_n → X 几乎必然。", "Kolmogorov 0-1 律：独立列的尾事件概率必为 0 或 1。"],
        theorems: ["第一引理不需独立性；第二引理必须独立（或至少两两独立的 Erdős-Rényi 版本）。", "由两引理得二分法：独立事件列的 limsup 概率只能是 0 或 1，取决于 ∑ P(A_n) 的收敛性。", "Hewitt-Savage 0-1 律把 Kolmogorov 0-1 律推广到可交换事件。", "应用：证明强大数定律的部分情形、随机游走的常返性、记录值出现的无穷性。"],
        generalRequirements: ["使用第二引理必须验证独立性。", "必须把目标事件正确写成 limsup 形式并核对概率级数。"],
        forbiddenErrors: ["【第二引理缺独立性】对相依事件用 ∑ P = ∞ 断言无穷多次发生。", "【limsup 与 liminf 混淆】把「无穷多次发生」写成 liminf。", "【逆命题误设】由 P(limsup A_n) = 0 断言 ∑ P(A_n) < ∞（不独立时不成立）。", "【收敛判据量词遗漏】只对某个 ε 验证级数收敛就断言几乎必然收敛。"],
        parameterConstraints: { independence: "第二引理要求 {A_n} 独立（或用两两独立的推广版本）。", seriesConvergence: "第一引理只需 ∑ P(A_n) < ∞。", tailEvent: "0-1 律适用于尾 σ 代数中的事件。" },
        closureChecks: ["把结论事件写成 limsup/liminf 形式。", "计算或估计 ∑ P(A_n) 并判断收敛性。", "使用第二引理前逐条验证独立性。"],
        scenarioChecks: { almostSureConvergenceProof: ["用第一引理加 ε 的可数序列证明几乎必然收敛。"], recordValues: ["记录值事件概率为 1/n，级数发散且独立，故记录无穷多次出现。"], randomWalkRecurrence: ["用 0-1 律与级数判据讨论回到原点的次数。"] },
    },
    // 强大数定律与三级数定理。
    "strong-law-large-numbers": {
        definitions: ["强大数定律断言独立同分布样本均值几乎必然收敛到期望；Kolmogorov 三级数定理给出一般独立列部分和几乎必然收敛的充要条件。"],
        formulas: ["Kolmogorov 强大数定律：X_i i.i.d.，E|X| < ∞ ⇒ (1/n)∑ X_i → E[X] 几乎必然。", "弱大数定律（Khinchin）：同条件下依概率收敛（结论更弱）。", "三级数定理：∑ X_n 几乎必然收敛 ⇔ 存在 c > 0 使 ∑ P(|X_n| > c)、∑ E[X_n^c]、∑ Var(X_n^c) 均收敛（X_n^c 为截断）。", "Kolmogorov 判据：独立零均值且 ∑ Var(X_n)/n^2 < ∞ ⇒ (1/n)∑ X_i → 0 几乎必然。", "Etemadi 版本：只需两两独立同分布即可得强大数定律。"],
        theorems: ["E|X| = ∞ 时 (1/n)∑ X_i 几乎必然不收敛（Cauchy 分布样本均值与单个变量同分布，不收敛）。", "E[X^+] = ∞、E[X^-] < ∞ 时样本均值几乎必然趋于 +∞，故一侧可积仍有确定极限行为。", "强大数定律推出经验分布函数一致收敛（Glivenko-Cantelli 定理）。", "非同分布情形需附加方差条件或截断论证，不能直接套用 i.i.d. 版本。"],
        generalRequirements: ["必须验证 E|X| < ∞ 并声明独立性（或两两独立）与同分布。", "非同分布或相依情形必须改用三级数定理、Kolmogorov 判据或混合条件。"],
        forbiddenErrors: ["【可积性缺失】对无期望分布（Cauchy）套用大数定律。", "【强弱混用】用弱大数定律的结论断言几乎必然收敛。", "【独立性缺失】对相依序列直接套用（需遍历性或混合条件）。", "【方差条件误当必要】认为强大数定律需要有限方差（i.i.d. 只需一阶矩）。"],
        parameterConstraints: { firstMoment: "i.i.d. 情形只需 E|X| < ∞。", independenceLevel: "Kolmogorov 版本要求独立；Etemadi 版本允许两两独立。", nonIdenticalCase: "非同分布需方差和条件或三级数条件。" },
        closureChecks: ["核对一阶矩存在性与独立同分布假设。", "明确结论是几乎必然还是依概率。", "若假设不满足，改用相应的推广定理并说明。"],
        scenarioChecks: { monteCarloConsistency: ["Monte Carlo 估计的几乎必然收敛由强大数定律保证。"], heavyTailFailure: ["Cauchy 或 Pareto（α ≤ 1）时样本均值不收敛，需改用中位数等稳健统计量。"], empiricalDistribution: ["Glivenko-Cantelli 定理给出经验分布函数的一致强收敛。"] },
    },
    // Lévy 连续性定理与紧性。
    "levy-continuity-theorem": {
        definitions: ["Lévy 连续性定理把弱收敛转化为特征函数的逐点收敛，是中心极限定理与极限分布识别的标准工具。"],
        formulas: ["正向：X_n →_d X ⇒ φ_n(t) → φ(t) 对每个 t。", "反向：φ_n(t) → φ(t) 逐点且 φ 为某分布的特征函数（或 φ 在 0 处连续）⇒ X_n →_d X。", "紧性（Prokhorov）：分布族一致紧 ⇔ 任意子列有弱收敛子列。", "一致紧判据：∀ε > 0 存在 M 使 sup_n P(|X_n| > M) < ε。", "portmanteau 刻画：X_n →_d X ⇔ E[f(X_n)] → E[f(X)] 对一切有界连续 f。"],
        theorems: ["若 φ_n 逐点收敛到某函数 φ 但 φ 在 0 处不连续，则无弱收敛极限（分布逃逸到无穷），故 0 处连续性不可省。", "Prokhorov 定理与有限维分布收敛结合是证明过程级弱收敛（如 Donsker 定理）的标准两步法。", "Cramér-Wold 器：随机向量列弱收敛 ⇔ 一切线性组合 a^T X_n 弱收敛，把多维问题化为一维。", "portmanteau 定理给出弱收敛的多种等价刻画（闭集、开集、连续点、有界连续函数）。"],
        generalRequirements: ["用反向定理必须验证极限函数是特征函数或在 0 处连续。", "多维问题必须显式引用 Cramér-Wold 器再化为一维。"],
        forbiddenErrors: ["【连续性条件遗漏】仅由 φ_n 逐点收敛就断言弱收敛。", "【一致收敛要求过强】要求 φ_n 一致收敛（逐点即可）。", "【紧性缺失】在无一致紧性的情形使用子列抽取论证。", "【多维直接套一维】未用 Cramér-Wold 就把一维结论搬到随机向量。"],
        parameterConstraints: { pointwiseConvergence: "只需对每个固定 t 收敛。", limitContinuity: "极限函数需在 t = 0 连续（等价于极限为概率分布）。", tightnessForSubsequences: "抽子列需一致紧性。" },
        closureChecks: ["写出 φ_n 并计算逐点极限。", "验证极限函数在 0 处连续或识别为已知分布的特征函数。", "多维情形先用 Cramér-Wold 化为线性组合。"],
        scenarioChecks: { cltViaCharacteristicFunctions: ["Taylor 展开 φ 得 exp(-t^2/2) 并引用连续性定理。"], poissonLimit: ["二项到 Poisson 的极限用特征函数逐点收敛证明。"], escapeToInfinity: ["φ_n(t) → 1_{t=0} 说明分布无极限，须报告无弱收敛。"] },
    },
    // Lindeberg-Feller CLT：三角阵列与条件。
    "lindeberg-feller-clt": {
        definitions: ["Lindeberg-Feller 中心极限定理给出独立非同分布三角阵列部分和渐近正态的充分（在渐近可忽略下亦必要）条件。"],
        formulas: ["i.i.d. 经典形式：√n(X̄_n - μ)/σ →_d N(0,1)（0 < σ^2 < ∞）。", "三角阵列设定：S_n = ∑_{k=1}^{k_n} X_{n,k}，s_n^2 = ∑_k Var(X_{n,k})。", "Lindeberg 条件：∀ε > 0，(1/s_n^2) ∑_k E[(X_{n,k} - μ_{n,k})^2 1_{|X_{n,k} - μ_{n,k}| > ε s_n}] → 0。", "Lyapunov 条件（更强、更易验证）：存在 δ > 0 使 (1/s_n^{2+δ}) ∑_k E|X_{n,k} - μ_{n,k}|^{2+δ} → 0。", "结论：(S_n - E[S_n])/s_n →_d N(0,1)。"],
        theorems: ["Lyapunov 条件蕴含 Lindeberg 条件；Lindeberg 条件在渐近可忽略（Feller 条件）下是渐近正态的充要条件。", "方差无限时极限一般为稳定分布而非正态（如 α-稳定分布，α < 2），且归一化不是 √n。", "相依序列需混合条件、鞅中心极限定理或 m-相依分解，不能直接套用独立情形。", "鞅 CLT：条件方差归一化后收敛且 Lindeberg 型条件成立时鞅差和渐近正态，是 i.i.d. CLT 的自然推广。"],
        generalRequirements: ["必须核对方差有限且 s_n → ∞，并正确标准化。", "非同分布情形必须验证 Lindeberg 或 Lyapunov 条件，不能仅靠独立性。"],
        forbiddenErrors: ["【标准化缺失】用 (X̄_n - μ) 而不除以 σ/√n 或用错的 s_n。", "【无限方差套用】对 α-稳定型重尾分布使用正态极限。", "【条件跳过】非同分布只声明独立即断言 CLT。", "【单个项主导】阵列中存在不可忽略项（违反 Feller 条件）仍断言正态极限。"],
        parameterConstraints: { finiteVariance: "要求 0 < Var < ∞ 且 s_n^2 → ∞。", independenceWithinRows: "同一行内的 X_{n,k} 相互独立。", asymptoticNegligibility: "必要性方向需 max_k Var(X_{n,k})/s_n^2 → 0。" },
        closureChecks: ["写出 s_n^2 与标准化形式。", "逐项验证 Lindeberg 或 Lyapunov 条件。", "若为相依或重尾情形，指明改用的定理与归一化。"],
        scenarioChecks: { weightedSums: ["加权和 ∑ a_{n,k} X_k 用 Lyapunov 条件验证渐近正态。"], stableLimits: ["无穷方差重尾和用稳定分布与 n^{1/α} 归一化。"], martingaleCase: ["相依数据用鞅 CLT 并给出条件方差的收敛。"] },
    },
    // Berry-Esseen 界与收敛速度。
    "berry-esseen-bound": {
        definitions: ["Berry-Esseen 定理给出中心极限定理的一致收敛速度：正态近似的最大误差以 1/√n 阶被三阶绝对矩控制。"],
        formulas: ["i.i.d. 情形：sup_x |P((S_n - nμ)/(σ√n) ≤ x) - Φ(x)| ≤ C ρ/(σ^3 √n)，ρ = E|X - μ|^3。", "常数：目前最优的绝对常数约 C ≤ 0.4690（历史上 C = 3 已足够用于估计）。", "非同分布形式：误差 ≤ C ∑_k E|X_k - μ_k|^3 / (∑_k σ_k^2)^{3/2}。", "阶数最优：两点分布说明 1/√n 阶不可改进。", "Edgeworth 展开：F_n(x) = Φ(x) + (γ_1/(6√n))(1 - x^2)φ(x) + O(1/n)，给出偏度修正主项。"],
        theorems: ["Berry-Esseen 界要求三阶绝对矩有限；只有二阶矩时仍有 CLT 但无此速度保证。", "该界是一致（对所有 x 同时）成立的，故可用于给定精度下反推样本量。", "对偏态分布，Edgeworth 展开的一阶修正比朴素正态近似显著更准，说明 1/√n 项由偏度主导。", "离散分布还有格点效应，需用连续性校正（±0.5）才能达到期望精度。"],
        generalRequirements: ["必须验证三阶绝对矩有限并写清标准化。", "使用具体常数必须声明所引用的版本。"],
        forbiddenErrors: ["【三阶矩缺失】对只有二阶矩的分布给出 Berry-Esseen 速度。", "【n ≥ 30 经验法则替代】用经验规则代替误差界的定量论证。", "【逐点与一致混淆】把一致界当作某点处的精确误差。", "【离散校正遗漏】对二项等离散和不做连续性校正就套用误差界。"],
        parameterConstraints: { thirdMoment: "要求 ρ = E|X - μ|^3 < ∞。", positiveVariance: "σ > 0。", sampleSize: "界对所有 n ≥ 1 成立，但只有 n 较大时才有实用精度。" },
        closureChecks: ["计算 σ 与 ρ 并代入界。", "核对是否需要连续性校正。", "如需更高精度，改用 Edgeworth 展开并写出偏度项。"],
        scenarioChecks: { sampleSizeForAccuracy: ["由误差界反推达到给定近似精度所需的 n。"], skewedDistributions: ["偏度大时用 Edgeworth 一阶修正或增大样本量。"], binomialNormalApproximation: ["二项正态近似加 ±0.5 校正并用界评估误差。"] },
    },
    // Slutsky 定理与 Delta 方法。
    "slutsky-delta-method": {
        definitions: ["Slutsky 定理给出弱收敛与依概率收敛的组合运算规则；Delta 方法用一阶 Taylor 展开把渐近正态性传递到光滑函数。"],
        formulas: ["Slutsky：X_n →_d X，Y_n →_p c（常数）⇒ X_n + Y_n →_d X + c，X_n Y_n →_d cX，X_n/Y_n →_d X/c（c ≠ 0）。", "连续映射定理：X_n →_d X 且 g 在 X 的支撑上连续 ⇒ g(X_n) →_d g(X)。", "Delta 方法：√n(θ̂_n - θ) →_d N(0, σ^2) 且 g 在 θ 处可微且 g'(θ) ≠ 0 ⇒ √n(g(θ̂_n) - g(θ)) →_d N(0, g'(θ)^2 σ^2)。", "多维形式：渐近协方差为 ∇g(θ)^T Σ ∇g(θ)。", "二阶 Delta 方法：g'(θ) = 0 时 n(g(θ̂_n) - g(θ)) →_d (1/2) g''(θ) σ^2 χ^2(1)。"],
        theorems: ["Slutsky 定理要求其中一列收敛到常数：两列都仅弱收敛时和的极限分布不确定（依赖联合分布）。", "Delta 方法在 g'(θ) = 0 处失效，须用二阶展开，极限为卡方型而非正态。", "方差稳定化变换（如 arcsin√p̂、log、Fisher z）由 Delta 方法反推得到，使渐近方差与参数无关。", "Delta 方法给出的是渐近方差，有限样本方差可能显著不同（尤其在边界附近）。"],
        generalRequirements: ["使用 Slutsky 必须确认第二列收敛到常数而非随机变量。", "使用 Delta 方法必须核对可微性与 g'(θ) ≠ 0。"],
        forbiddenErrors: ["【非常数极限套 Slutsky】两列均弱收敛就相加求极限分布。", "【导数为零仍用一阶】g'(θ) = 0 时仍给出正态极限（应为退化或卡方型）。", "【期望与渐近混淆】把 E[g(θ̂)] ≈ g(E[θ̂]) 当作严格等式使用。", "【连续性缺失】在 g 的不连续点应用连续映射定理。"],
        parameterConstraints: { constantLimit: "Slutsky 要求 Y_n →_p c 且商运算需 c ≠ 0。", differentiability: "Delta 方法要求 g 在 θ 处可微（一阶版本还需 g'(θ) ≠ 0）。", asymptoticRegime: "结论为 n → ∞ 的渐近性质。" },
        closureChecks: ["核对各列的收敛模式与极限是否为常数。", "计算 g'(θ) 并确认非零。", "写出渐近方差并说明其为渐近而非有限样本结论。"],
        scenarioChecks: { tStatisticLimit: ["用 Slutsky 把 σ 替换为 S 后仍得 N(0,1) 极限。"], varianceStabilization: ["用 Delta 方法设计使渐近方差为常数的变换。"], degenerateFirstDerivative: ["g'(θ) = 0 时改用二阶 Delta 方法给出卡方型极限。"] },
    },
    // 重对数律：波动的精确阶。
    "law-of-iterated-logarithm": {
        definitions: ["重对数律给出独立同分布部分和波动的精确渐近阶，介于强大数定律与中心极限定理之间的精细刻画。"],
        formulas: ["Hartman-Wintner：X_i i.i.d.，E[X] = 0，Var(X) = σ^2 ∈ (0, ∞) ⇒ limsup S_n/√(2σ^2 n log log n) = 1 几乎必然。", "对称结论：liminf S_n/√(2σ^2 n log log n) = -1 几乎必然。", "Brownian 版本：limsup B_t/√(2t log log t) = 1 几乎必然（t → ∞）；t → 0 时有局部版本。", "与 CLT 对比：CLT 的尺度为 √n，重对数律的尺度为 √(n log log n)，故 S_n/√n 无几乎必然极限。", "逆命题（Strassen）：重对数律成立 ⇒ E[X] = 0 且 Var(X) < ∞。"],
        theorems: ["Hartman-Wintner 定理的条件（零均值、有限方差）既充分又必要。", "S_n/√(2σ^2 n log log n) 的极限点集几乎必然为 [-1, 1]，故取值反复穿越整个区间。", "Strassen 不变性原理把重对数律推广为路径集在紧集上的几乎必然聚集，是泛函形式。", "重对数律说明 CLT 的 √n 归一化不能升级为几乎必然收敛，两者刻画不同层次的波动。"],
        generalRequirements: ["必须声明零均值（或先中心化）与有限方差。", "必须区分 limsup 的几乎必然值与依分布陈述。"],
        forbiddenErrors: ["【中心化遗漏】对非零均值序列直接套用公式。", "【与 CLT 混用】用 √n 尺度陈述重对数律或反之。", "【limsup 当极限】断言 S_n/√(2n log log n) 收敛（实际极限点集为 [-1,1]）。", "【无穷方差套用】对重尾（无限方差）序列使用该结论。"],
        parameterConstraints: { zeroMean: "要求 E[X] = 0（否则先减去均值）。", finiteVariance: "要求 0 < σ^2 < ∞。", asymptoticDirection: "结论针对 n → ∞（Brownian 情形也有 t → 0 局部版本）。" },
        closureChecks: ["核对中心化与方差有限。", "写清 limsup/liminf 而非极限。", "对照 CLT 与强大数定律说明尺度差异。"],
        scenarioChecks: { randomWalkGrowth: ["给出随机游走最大偏离的精确阶。"], brownianPathRoughness: ["Brownian 路径的局部与全局波动阶。"], sharpnessComparison: ["用于说明 CLT 不能提升为几乎必然收敛。"] },
    },
    // Cramér 大偏差定理。
    "cramer-large-deviations": {
        definitions: ["大偏差原理刻画样本均值远离期望的概率的指数衰减率；Cramér 定理给出速率函数为对数矩母函数的 Legendre 变换。"],
        formulas: ["对数矩母函数：Λ(λ) = ln E[e^{λX}]。", "速率函数：I(x) = sup_λ (λx - Λ(λ))（Legendre-Fenchel 变换）。", "Cramér 定理：(1/n) ln P(S_n/n ≥ x) → -I(x)（x > E[X]）。", "一般 LDP 形式：闭集上界 limsup (1/n) ln P(S_n/n ∈ C) ≤ -inf_{x ∈ C} I(x)，开集下界对应 inf。", "性质：I 凸、非负、下半连续，且 I(E[X]) = 0；Chernoff 界给出对应的非渐近上界 P(S_n/n ≥ x) ≤ e^{-n I(x)}。"],
        theorems: ["Cramér 定理要求 Λ(λ) 在 0 的邻域有限（次指数尾）；重尾分布只有多项式衰减，无指数型 LDP。", "Gärtner-Ellis 定理把 Cramér 定理推广到 Λ_n(λ)/n 收敛的相依情形（如 Markov 链）。", "Sanov 定理给出经验分布的 LDP，速率函数为相对熵；Varadhan 引理给出指数积分的渐近。", "Chernoff 界与 LDP 上界一致，说明大偏差速率是 Chernoff 指数的最优值。"],
        generalRequirements: ["必须验证矩母函数在原点邻域有限。", "必须区分渐近速率（LDP）与非渐近界（Chernoff）。"],
        forbiddenErrors: ["【重尾套用】对无指数矩的分布断言指数衰减速率。", "【Legendre 变换方向错误】对 Λ 求错的上确界变量或漏掉 λx 项。", "【上下界混用】把闭集上界用于开集或反之。", "【速率函数符号】漏掉负号写成 (1/n) ln P → I(x)。"],
        parameterConstraints: { mgfFiniteness: "要求 Λ(λ) < ∞ 于 λ 的某个原点邻域（Cramér 条件）。", deviationRange: "x 需在分布支撑的凸包内且 x > E[X]（上尾情形）。", iidAssumption: "经典 Cramér 定理要求独立同分布；相依情形用 Gärtner-Ellis。" },
        closureChecks: ["计算 Λ(λ) 并确认其有限区间。", "求 Legendre 变换得到 I(x) 并核对 I(E[X]) = 0。", "说明结论是渐近速率还是可用的非渐近 Chernoff 界。"],
        scenarioChecks: { chernoffBoundApplication: ["用 e^{-nI(x)} 给出有限 n 的尾概率上界。"], empiricalMeasureLDP: ["经验分布偏离用 Sanov 定理与相对熵速率函数。"], heavyTailContrast: ["重尾分布用「单一大跳」原理而非指数速率。"] },
    },
};
