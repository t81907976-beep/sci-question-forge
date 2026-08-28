import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数论-解析数论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMBER_THEORY_ANALYTIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Euler 乘积：zeta 与 Dirichlet 级数的乘积表示。
    "euler-product-zeta": {
        id: "euler-product-zeta", l2Key: "number-theory-analytic", name: "Euler 乘积", kind: "formula",
        aliases: ["Euler乘积", "Euler product", "Riemann zeta函数", "Dirichlet级数", "乘性函数级数"],
    },
    // zeta 的解析延拓与函数方程。
    "zeta-functional-equation": {
        id: "zeta-functional-equation", l2Key: "number-theory-analytic", name: "zeta 的解析延拓与函数方程", kind: "theorem",
        aliases: ["函数方程", "zeta解析延拓", "完备化zeta", "平凡零点", "临界带"],
    },
    // 素数定理与 Re(s) = 1 上零点的等价性。
    "prime-number-theorem": {
        id: "prime-number-theorem", l2Key: "number-theory-analytic", name: "素数定理", kind: "theorem",
        aliases: ["素数定理", "prime number theorem", "PNT", "Chebyshev函数", "Li(x)误差项"],
    },
    // 无零区域与素数定理误差项。
    "zero-free-region": {
        id: "zero-free-region", l2Key: "number-theory-analytic", name: "无零区域与误差项", kind: "theorem",
        aliases: ["无零区域", "zero-free region", "De la Vallée-Poussin", "误差项估计", "Riemann假设等价"],
    },
    // von Mangoldt 显式公式：素数计数与零点的对偶。
    "von-mangoldt-explicit-formula": {
        id: "von-mangoldt-explicit-formula", l2Key: "number-theory-analytic", name: "显式公式", kind: "formula",
        aliases: ["显式公式", "explicit formula", "von Mangoldt公式", "零点求和", "Perron公式"],
    },
    // Dirichlet 算术级数素数定理与 L(1, χ) ≠ 0。
    "dirichlet-theorem-l-nonvanishing": {
        id: "dirichlet-theorem-l-nonvanishing", l2Key: "number-theory-analytic", name: "Dirichlet 定理与 L(1, χ) 非消失", kind: "theorem",
        aliases: ["Dirichlet定理", "算术级数素数定理", "Dirichlet L函数", "Dirichlet特征", "L(1,χ)非零"],
    },
    // 筛法上界：Selberg 筛、大筛与奇偶障碍。
    "selberg-large-sieve": {
        id: "selberg-large-sieve", l2Key: "number-theory-analytic", name: "Selberg 筛与大筛法", kind: "theorem",
        aliases: ["Selberg筛", "大筛法", "Brun筛", "Brun-Titchmarsh", "奇偶障碍"],
    },
    // Hardy-Littlewood 圆法。
    "circle-method": {
        id: "circle-method", l2Key: "number-theory-analytic", name: "Hardy-Littlewood 圆法", kind: "algorithm",
        aliases: ["圆法", "circle method", "主弧次弧", "奇异级数", "Waring问题", "Vinogradov定理"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMBER_THEORY_ANALYTIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // Euler 乘积：唯一分解的解析化。
    "euler-product-zeta": {
        definitions: ["Euler 乘积把乘性算术函数的 Dirichlet 级数写成局部因子的乘积，是算术基本定理的解析表述，也是所有 L 函数理论的出发点。"],
        formulas: ["Riemann zeta：ζ(s) = ∑_{n ≥ 1} n^{-s} = ∏_p (1 - p^{-s})^{-1}（Re(s) > 1）。", "一般乘性函数：f 乘性且级数绝对收敛时 ∑_n f(n) n^{-s} = ∏_p (1 + ∑_{k ≥ 1} f(p^k) p^{-ks})。", "完全乘性情形：∑_n f(n) n^{-s} = ∏_p (1 - f(p) p^{-s})^{-1}。", "对数导数：-ζ'(s)/ζ(s) = ∑_{n ≥ 1} Λ(n) n^{-s}，Λ 为 von Mangoldt 函数。"],
        theorems: ["Euler 乘积定理：绝对收敛域内乘积与级数相等；其成立等价于唯一素因子分解。", "推论（Euler）：∏_p (1 - 1/p)^{-1} 发散，故素数无穷多，且 ∑_p 1/p 发散。", "1/ζ(s) = ∑ μ(n) n^{-s}、ζ(s)^2 = ∑ d(n) n^{-s} 等恒等式由卷积与乘积的对应给出。"],
        generalRequirements: ["必须声明绝对收敛域（ζ 为 Re(s) > 1），越界使用需先解析延拓。", "使用乘性拆分必须区分乘性与完全乘性。"],
        forbiddenErrors: ["【收敛域越界】在 Re(s) ≤ 1 直接使用级数或乘积表达式。", "【乘性误设】对非乘性函数写出 Euler 乘积。", "【完全乘性混用】对仅乘性（非完全乘性）的 f 写成 (1 - f(p)p^{-s})^{-1}。", "【对数导数符号错写】把 -ζ'/ζ 写成 ζ'/ζ 导致 Λ 的符号相反。"],
        parameterConstraints: { convergence: "ζ 的级数与乘积在 Re(s) > 1 绝对收敛。", multiplicativity: "乘积展开要求 f 乘性；完全乘性才有单因子几何级数形式。", localFactors: "每个局部因子须在 |p^{-s}| < 1 意义下展开。" },
        closureChecks: ["核对收敛域与乘性类型。", "写出局部因子并与前若干系数比对。", "如使用对数导数或倒数，核对对应的算术函数（Λ、μ）。"],
        scenarioChecks: { infinitudeOfPrimes: ["由乘积在 s = 1 的发散给出素数无穷性的解析证明。"], meanValueViaDirichletSeries: ["估计 ∑_{n ≤ x} f(n) 时先用 Euler 乘积识别主项奇点。"], lFunctionAnalogue: ["Dirichlet L 函数、Dedekind zeta 与模形式 L 函数的乘积形式遵循同一框架。"] },
    },
    // zeta 的完备化、函数方程与零点分布的基本格局。
    "zeta-functional-equation": {
        definitions: ["该定理把 ζ(s) 延拓到整个复平面（除 s = 1 的单极点）并给出关于 s ↦ 1 - s 的对称性，由此确定平凡零点位置与临界带的几何格局。"],
        formulas: ["完备化：ξ(s) = π^{-s/2} Γ(s/2) ζ(s) 满足 ξ(s) = ξ(1 - s)。", "非对称形式：ζ(s) = 2^s π^{s-1} sin(πs/2) Γ(1-s) ζ(1-s)。", "极点与特殊值：ζ 在 s = 1 有留数 1 的单极点，ζ(0) = -1/2，ζ(-2n) = 0（平凡零点），ζ(1-2n) = -B_{2n}/(2n)。", "临界带：所有非平凡零点位于 0 < Re(s) < 1，且关于临界线 Re(s) = 1/2 与实轴对称。"],
        theorems: ["Riemann 函数方程：上述完备化恒等式成立；ξ 为整函数（去掉极点因子后），其零点恰为 ζ 的非平凡零点。", "平凡零点来自 Γ(s/2) 的极点：s = -2, -4, -6, ...；s = 1 的极点由 ζ 自身提供。", "Riemann 假设：所有非平凡零点满足 Re(s) = 1/2；已知等价形式包括 π(x) = Li(x) + O(√x log x) 与 Mertens 型估计。"],
        generalRequirements: ["使用 s = 1 附近的展开必须写出极点与 Euler-Mascheroni 常数项（ζ(s) = 1/(s-1) + γ + ...）。", "讨论零点必须区分平凡零点与非平凡零点。"],
        forbiddenErrors: ["【零点混淆】把平凡零点 s = -2n 计入临界带零点或反之。", "【极点遗漏】把 ζ 当作整函数。", "【函数方程形式错写】漏掉 π^{-s/2}Γ(s/2) 因子或把对称写成 s ↦ -s。", "【RH 当已证】把 Riemann 假设作为已知定理使用。"],
        parameterConstraints: { domain: "延拓后定义域为 C \\ {1}。", symmetry: "函数方程给出关于 Re(s) = 1/2 的对称。", trivialZeros: "平凡零点仅在负偶整数处。" },
        closureChecks: ["核对完备化因子与函数方程形式。", "分类所讨论零点的类型与位置。", "若引用 RH，明确标注为假设而非定理。"],
        scenarioChecks: { specialValueComputation: ["用 ζ(1-2n) = -B_{2n}/(2n) 与 ζ(2n) 的 Bernoulli 公式互相验证。"], criticalStripAnalysis: ["讨论零点密度或临界线附近估计时先固定函数方程给出的对称。"], analyticContinuationMethod: ["用 θ 函数的模变换或 Γ 因子的 Mellin 表示导出延拓。"] },
    },
    // 素数定理：π(x) ~ x/log x 与 Re(s) = 1 上无零点的等价。
    "prime-number-theorem": {
        definitions: ["素数定理给出素数计数函数的主项渐近；其解析核心是 ζ(s) 在直线 Re(s) = 1 上不为零，通过 Chebyshev 函数与 Tauber 型定理转换为计数结论。"],
        formulas: ["主项形式：π(x) ~ x/log x，更精确地 π(x) = Li(x) + 误差项，Li(x) = ∫_2^x dt/log t。", "Chebyshev 函数：ψ(x) = ∑_{n ≤ x} Λ(n)，θ(x) = ∑_{p ≤ x} log p；PNT ⇔ ψ(x) ~ x ⇔ θ(x) ~ x。", "经典误差项：π(x) = Li(x) + O(x exp(-c √(log x)))（De la Vallée-Poussin）。", "RH 等价：π(x) = Li(x) + O(√x log x)。"],
        theorems: ["素数定理（Hadamard、De la Vallée-Poussin 1896）：ψ(x) ~ x；其等价条件是 ζ(1 + it) ≠ 0 对所有实 t ≠ 0。", "Newman/Wiener-Ikehara 型 Tauber 定理把 -ζ'/ζ 在 Re(s) = 1 上的解析性转成 ψ(x) ~ x，无需完整无零区域。", "初等证明（Selberg-Erdős）存在但不给出优于经典的误差项；Li(x) 比 x/log x 的近似显著更精确（Chebyshev 偏差、Skewes 数说明 π(x) - Li(x) 变号）。"],
        generalRequirements: ["必须区分主项形式 x/log x 与更精确的 Li(x)。", "给出误差项必须说明其来源（无零区域或 RH 假设）。"],
        forbiddenErrors: ["【等价条件误述】把 PNT 等价于 RH。", "【误差项越界】未假设 RH 就使用 O(√x log x) 级别的误差。", "【Li 与 x/log x 混用】断言 π(x) - x/log x 的误差与 π(x) - Li(x) 同阶。", "【偏差方向断言】声称 π(x) < Li(x) 恒成立。"],
        parameterConstraints: { asymptoticRange: "结论为 x → ∞ 的渐近，不适用于小 x 的精确计数。", errorTermSource: "误差项须与所引用的无零区域强度一致。", chebyshevEquivalence: "ψ、θ、π 三者的渐近等价需通过 log 权重转换。" },
        closureChecks: ["明确所用形式（π、θ 还是 ψ）并给出转换。", "核对误差项与所依赖的零点信息。", "若做数值比较，注明 Li(x) 与 x/log x 的差异量级。"],
        scenarioChecks: { primeCountingEstimate: ["估计区间内素数个数用 Li(x) 差值而非 x/log x。"], nthPrimeAsymptotic: ["p_n ~ n log n，更精确 p_n = n(log n + log log n - 1 + o(1))。"], bertrandChebyshev: ["区间 (x, 2x) 中素数存在性可由 θ(x) 的显式估计直接给出。"] },
    },
    // 无零区域：σ > 1 - c/log(|t|+2) 与误差项的对应。
    "zero-free-region": {
        definitions: ["无零区域研究 ζ（及 L 函数）在临界带右侧不含零点的显式区域，其宽度直接决定素数定理误差项的强度，是解析数论中「零点信息 ↔ 分布精度」对应的量化形式。"],
        formulas: ["经典无零区域：存在 c > 0 使 ζ(σ + it) ≠ 0 当 σ ≥ 1 - c/log(|t| + 2)。", "对应误差项：ψ(x) = x + O(x exp(-c' √(log x)))。", "Vinogradov-Korobov 改进：σ ≥ 1 - c/((log|t|)^{2/3} (log log|t|)^{1/3})，给出误差 O(x exp(-c'(log x)^{3/5}(log log x)^{-1/5}))。", "RH 情形：无零区域为 σ > 1/2，对应 ψ(x) = x + O(√x log^2 x)。"],
        theorems: ["De la Vallée-Poussin 定理：上述经典无零区域成立，其证明依赖 3 + 4cos θ + cos 2θ ≥ 0 型不等式与 ζ 在 Re(s) = 1 附近的阶估计。", "L 函数的无零区域含 Siegel 零点例外：实特征 χ 可能有靠近 1 的实零点，Siegel-Walfisz 定理因此对模 q 的范围有限制（q ≤ (log x)^A）。", "零点密度定理与 Bombieri-Vinogradov 定理在无法排除个别零点时提供平均意义下的等价强度结论。"],
        generalRequirements: ["引用误差项必须与所用无零区域强度匹配，不能混用 RH 与经典结果。", "涉及 Dirichlet L 函数必须声明是否排除了 Siegel 零点及对 q 的一致性范围。"],
        forbiddenErrors: ["【区域与误差错配】用经典无零区域得出 RH 级别误差项。", "【Siegel 零点忽略】在算术级数素数分布中断言对所有 q 一致成立的强误差。", "【常数具体化】把 c 当作已知的具体最优常数。", "【无零区域越界】声称已知 ζ 在 σ > 1/2 + ε 上无零点。"],
        parameterConstraints: { regionShape: "无零区域宽度随 |t| 增大而收缩，须显式写出对 |t| 的依赖。", uniformity: "L 函数情形需声明对模 q 的一致性范围。", siegelZero: "实特征的可能 Siegel 零点必须显式排除或纳入误差。" },
        closureChecks: ["写出所用无零区域及其来源文献级结论。", "由该区域推出误差项并核对指数形式。", "涉及一致性时核查 q 与 x 的相对范围。"],
        scenarioChecks: { errorTermDerivation: ["用显式公式把无零区域转成 ψ(x) - x 的上界。"], arithmeticProgressionUniformity: ["Siegel-Walfisz 给出 q ≤ (log x)^A 的一致误差，超出范围改用 Bombieri-Vinogradov。"], densityHypothesisSubstitute: ["无法排除零点时用零点密度估计替代逐点无零信息。"] },
    },
    // 显式公式：ψ(x) 与 zeta 零点的对偶求和。
    "von-mangoldt-explicit-formula": {
        definitions: ["显式公式把素数计数量表示为主项加上 ζ 零点贡献的求和，是「零点位置 ↔ 素数分布振荡」对偶关系的精确形式，其技术基础是 Perron 公式与留数计算。"],
        formulas: ["Perron 公式：ψ(x) = (1/2πi) ∫_{(c)} (-ζ'(s)/ζ(s)) x^s/s ds（c > 1）。", "von Mangoldt 显式公式：ψ(x) = x - ∑_ρ x^ρ/ρ - log(2π) - (1/2) log(1 - x^{-2})（x 非素数幂，ρ 遍历非平凡零点）。", "截断形式：ψ(x) = x - ∑_{|Im ρ| ≤ T} x^ρ/ρ + O(x (log x)^2 / T + √x log x)。", "Riemann-von Mangoldt 零点计数：N(T) = (T/2π) log(T/2π) - T/2π + O(log T)。"],
        theorems: ["显式公式定理：上述恒等式成立，其中 -log(2π) 与 -(1/2)log(1-x^{-2}) 分别来自 s = 0 处与平凡零点的贡献。", "零点实部控制振荡幅度：Re(ρ) = β 时 |x^ρ/ρ| ≈ x^β/|ρ|，故 RH ⇔ 振荡项为 O(√x log^2 x)。", "反向对应：ψ(x) 的任意超出 x^{1/2+ε} 的振荡都会迫使存在 Re(ρ) > 1/2 + ε 的零点，因此素数分布与零点信息互相等价。"],
        generalRequirements: ["使用零点求和必须声明求和的对称配对（ρ 与 1-ρ、共轭配对）与收敛/截断方式。", "在 x 为素数幂处必须说明 ψ 的跳跃与公式的取值约定。"],
        forbiddenErrors: ["【收敛性忽视】把 ∑_ρ x^ρ/ρ 当作绝对收敛级数逐项操作。", "【平凡零点项遗漏】漏掉 -(1/2)log(1 - x^{-2}) 或常数 -log(2π)。", "【截断误差缺失】用截断求和而不给出 T 相关误差。", "【假设混用】在未假设 RH 时把振荡项直接估为 O(√x log^2 x)。"],
        parameterConstraints: { pointCondition: "标准形式要求 x > 1 且 x 不是素数幂（否则取左右极限平均）。", truncationParameter: "截断求和需给出 T 及相应误差项。", zeroSum: "零点求和需按 |Im ρ| 递增并配对以保证条件收敛。" },
        closureChecks: ["写出所用公式的完整项（含常数项与平凡零点项）。", "如截断，给出误差并选择合适 T。", "把零点实部的假设与最终误差项一致化。"],
        scenarioChecks: { oscillationAnalysis: ["用零点虚部密度分析 ψ(x) - x 的振荡频率（与 Fourier 对偶）。"], zeroCountingCheck: ["用 N(T) 的渐近核验截断求和中零点个数量级。"], primeGapHeuristic: ["由显式公式与零点间隔统计给出素数间隔的启发式预测（需 RH 或更强假设）。"] },
    },
    // Dirichlet 定理：算术级数中的素数与 L(1, χ) ≠ 0。
    "dirichlet-theorem-l-nonvanishing": {
        definitions: ["Dirichlet 定理断言互素算术级数中含无穷多素数；其解析核心是 Dirichlet 特征的正交性把素数按剩余类分离，并需要非主特征的 L 函数在 s = 1 处不为零。"],
        formulas: ["Dirichlet L 函数：L(s, χ) = ∑_{n ≥ 1} χ(n) n^{-s} = ∏_p (1 - χ(p) p^{-s})^{-1}（Re(s) > 1）。", "特征正交性：(1/φ(q)) ∑_{χ mod q} χ̄(a) χ(n) = [n ≡ a (mod q)]（gcd(a, q) = 1）。", "分布定理：gcd(a, q) = 1 时 π(x; q, a) ~ (1/φ(q)) · x/log x（等分布）。", "Siegel-Walfisz：q ≤ (log x)^A 时 ψ(x; q, a) = x/φ(q) + O(x exp(-c√(log x)))。"],
        theorems: ["Dirichlet 定理：gcd(a, q) = 1 时算术级数 a, a+q, a+2q, ... 含无穷多素数。", "关键引理：非主特征 χ 满足 L(1, χ) ≠ 0；实特征的非消失可由类数公式（h_K > 0）或 Dirichlet 的原始论证给出。", "推广：Chebotarev 密度定理把等分布结论推广到 Galois 扩张中的 Frobenius 共轭类。"],
        generalRequirements: ["必须验证 gcd(a, q) = 1（否则级数中至多含一个素数）。", "使用等分布主项必须区分固定 q 的渐近与对 q 一致的结论（后者需 Siegel-Walfisz 或 Bombieri-Vinogradov）。"],
        forbiddenErrors: ["【互素条件缺失】对 gcd(a, q) > 1 的级数断言无穷多素数。", "【非消失当显然】把 L(1, χ) ≠ 0 当作平凡结论跳过。", "【一致性越界】在 q 随 x 增长时直接使用固定 q 的渐近式。", "【主特征混用】把主特征的 L 函数（含 ζ 的极点）与非主特征同等处理。"],
        parameterConstraints: { coprimality: "要求 gcd(a, q) = 1。", characterType: "非主特征的 L 函数在 s = 1 解析且非零；主特征对应 ζ 的极点。", uniformityRange: "一致性结论要求 q 相对 x 的增长受限（如 q ≤ (log x)^A）。" },
        closureChecks: ["核对互素条件与特征的模、导子。", "用正交性写出剩余类的素数计数表达式。", "声明所用误差项与 q 的允许范围。"],
        scenarioChecks: { primesInProgression: ["证明特定形式素数（如 4k+1）无穷多时用相应二次特征。"], bombieriVinogradovAverage: ["需要对大范围 q 的平均一致性时用 Bombieri-Vinogradov 替代逐个 q 的估计。"], chebotarevGeneralization: ["把剩余类条件换成 Galois 群共轭类条件以处理更一般的素数分裂问题。"] },
    },
    // Selberg 筛与大筛法：筛法上界与奇偶障碍。
    "selberg-large-sieve": {
        definitions: ["筛法研究在筛去若干剩余类后集合的规模上界：Brun/Selberg 的组合-二次型筛给出上界（有时给出下界），大筛法则处理筛去剩余类数量随模增长的情形，本质是对指数和的均值估计。"],
        formulas: ["筛函数：S(A, P, z) = #{a ∈ A : gcd(a, ∏_{p < z} p) = 1}。", "Selberg 筛上界：S(A, P, z) ≤ X/G(z) + 误差，其中 G(z) = ∑_{d < z, d | P} μ^2(d)/g(d) 由二次型最优化给出。", "Brun-Titchmarsh：π(x + y; q, a) - π(x; q, a) ≤ 2y/(φ(q) log(y/q))（y > q）。", "大筛不等式：∑_{q ≤ Q} ∑_{a mod q}^* |S(a/q)|^2 ≤ (N + Q^2) ∑_n |a_n|^2，S(α) = ∑_{n ≤ N} a_n e(nα)。"],
        theorems: ["Selberg 筛给出的上界在孪生素数、Goldbach 型问题中给出正确量级的上界（如 π_2(x) ≪ x/(log x)^2）。", "奇偶障碍（Selberg parity problem）：仅用筛法权重无法区分含偶数个与奇数个素因子的整数，故筛法本身不能证明孪生素数无穷或 Goldbach，需要额外输入（如 Chen 的转换、GPY/Maynard 的多维筛与 Bombieri-Vinogradov）。", "Chen 定理与 Maynard-Tao 定理展示了在筛法框架内加入均值型解析输入后可获得的最强结论（如 p + 2 为素数或素数之积、有界素数间隔）。"],
        generalRequirements: ["必须写明筛集合 A、筛去的剩余类与筛限 z，并给出维数（sifting dimension）。", "结论必须区分上界、下界与渐近，不能把筛法上界当作渐近等式。"],
        forbiddenErrors: ["【上界当渐近】用 Selberg 筛的上界断言渐近计数或存在性。", "【奇偶障碍忽视】声称纯筛法证明了孪生素数猜想或 Goldbach 猜想。", "【大筛条件缺失】使用大筛不等式而不给出 N 与 Q 的相对范围（Q^2 与 N 的量级关系）。", "【Brun-Titchmarsh 越界】在 y ≤ q 时使用该不等式或忽略常数 2 无法改进到渐近常数 1。"],
        parameterConstraints: { siftingRange: "筛限 z 与集合规模 X 需满足误差可控的相对范围（如 z ≤ X^{1/2-ε}）。", dimension: "筛法维数 κ 决定主项常数与可用的下界结论。", largeSieveParameters: "大筛不等式的界含 N + Q^2，须核对 Q 与 √N 的关系。" },
        closureChecks: ["写出筛集合、筛去类与筛限并核对维数。", "给出上界（必要时下界）并声明其类型。", "若目标结论涉及素数的奇偶性，说明如何绕过奇偶障碍。"],
        scenarioChecks: { twinPrimeUpperBound: ["用 Selberg 筛给出 π_2(x) ≪ x/(log x)^2 的正确量级上界。"], boundedGapsFramework: ["有界素数间隔（Zhang、Maynard）用多维 GPY 筛配合 Bombieri-Vinogradov 型均值。"], largeSieveApplication: ["估计特定同余条件下的稀疏集合规模时用大筛不等式控制指数和均值。"] },
    },
    // 圆法：主弧-次弧分解与奇异级数。
    "circle-method": {
        definitions: ["Hardy-Littlewood 圆法把加性表示计数写成指数和的积分，通过把单位圆分成有理点附近的主弧与其余的次弧，分别给出主项（奇异级数）与误差控制。"],
        formulas: ["计数积分：r(n) = ∫_0^1 S(α)^k e(-nα) dα，其中 S(α) = ∑_{x ≤ N} e(α x^j)（e(t) = e^{2πit}）。", "主弧贡献：n 的表示数主项 = 𝔖(n) · (奇异积分)，奇异级数 𝔖(n) = ∏_p 局部密度因子（局部可解性乘积）。", "Waring 问题：s 足够大时 r_{k,s}(n) = 𝔖(n) Γ(1+1/k)^s/Γ(s/k) · n^{s/k - 1} (1 + o(1))。", "Weyl 和估计：次弧上 |S(α)| ≤ N^{1-σ+ε} 型上界（Weyl 差分、Vinogradov 均值定理）。"],
        theorems: ["Vinogradov 三素数定理：每个充分大的奇数都是三个素数之和（弱 Goldbach 的渐近形式，2013 年 Helfgott 完成全部情形）。", "Waring-Hilbert 型结论：对每个 k 存在 s(k) 使每个充分大整数都是 s 个 k 次幂之和；圆法给出渐近公式与 𝔖(n) > 0 的局部条件。", "主项非零性等价于所有局部（p-adic 与实）条件可解，故圆法是局部-整体原则在加性问题上的解析实现；变量数不足时次弧无法控制（如二素数 Goldbach）。"],
        generalRequirements: ["必须给出主弧/次弧的显式划分参数并说明次弧估计的来源。", "必须验证奇异级数 𝔖(n) > 0（局部可解性），否则主项消失。"],
        forbiddenErrors: ["【次弧控制缺失】只算主项就宣称渐近公式成立。", "【奇异级数忽略】不检查局部条件而断言表示存在。", "【变量数不足】把圆法直接用于二元问题（如 Goldbach 二素数）并声称可证。", "【弧划分不当】主弧过宽或过窄导致主项与误差重复计入。"],
        parameterConstraints: { arcParameters: "主弧 |α - a/q| ≤ Q^{-1} 的参数 q ≤ Q 需与 N 的幂次匹配。", numberOfVariables: "渐近公式要求变量数 s 超过与 k 相关的阈值。", singularSeries: "𝔖(n) 由所有 p 的局部密度乘积构成，需验证收敛与正性。" },
        closureChecks: ["写出弧划分与两部分的估计。", "计算奇异级数并验证正性（含小素数局部条件）。", "合并主项与误差给出渐近式及适用的 n 范围（「充分大」）。"],
        scenarioChecks: { ternaryGoldbach: ["三素数表示用素数指数和与 Siegel-Walfisz 型主弧估计。"], waringProblem: ["k 次幂表示的阈值 G(k)、g(k) 由奇异级数与次弧估计共同决定。"], localSolvabilityFailure: ["某素数处局部无解时 𝔖(n) = 0，表示数为 0，须先排除此类 n。"] },
    },
};
