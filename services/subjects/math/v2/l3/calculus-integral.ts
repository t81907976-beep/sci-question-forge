import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“微积分-积分”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const CALCULUS_INTEGRAL_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Riemann 可积性判据。
    "riemann-integrability-criterion": {
        id: "riemann-integrability-criterion", l2Key: "calculus-integral", name: "Riemann 可积性判据", kind: "criterion",
        aliases: ["Riemann可积", "Darboux准则", "振幅和", "零测集", "Lebesgue可积性判据"],
    },
    // 微积分基本定理与变限积分。
    "fundamental-theorem-calculus": {
        id: "fundamental-theorem-calculus", l2Key: "calculus-integral", name: "微积分基本定理", kind: "theorem",
        aliases: ["Newton-Leibniz公式", "变限积分求导", "原函数存在性", "Lebesgue微分定理"],
    },
    // 反常积分收敛判别体系。
    "improper-integral-convergence-tests": {
        id: "improper-integral-convergence-tests", l2Key: "calculus-integral", name: "反常积分收敛判别法", kind: "criterion",
        aliases: ["反常积分", "p判别法", "比较判别法", "Dirichlet判别法", "条件收敛"],
    },
    // 含参积分的求导与极限交换。
    "parameter-integral-differentiation": {
        id: "parameter-integral-differentiation", l2Key: "calculus-integral", name: "含参积分的求导与极限交换", kind: "theorem",
        aliases: ["含参积分", "Leibniz积分法则", "一致收敛积分", "控制收敛定理", "积分号下求导"],
    },
    // Beta 与 Gamma 函数。
    "beta-gamma-functions": {
        id: "beta-gamma-functions", l2Key: "calculus-integral", name: "Beta 函数与 Gamma 函数", kind: "object",
        aliases: ["Gamma函数", "Beta函数", "反射公式", "Stirling公式", "倍元公式"],
    },
    // Fubini-Tonelli 定理与积分换序。
    "fubini-tonelli-theorem": {
        id: "fubini-tonelli-theorem", l2Key: "calculus-integral", name: "Fubini-Tonelli 定理", kind: "theorem",
        aliases: ["Fubini定理", "Tonelli定理", "累次积分换序", "绝对可积", "σ有限"],
    },
    // 重积分变量替换与 Jacobian。
    "change-of-variables-jacobian": {
        id: "change-of-variables-jacobian", l2Key: "calculus-integral", name: "重积分变量替换公式", kind: "theorem",
        aliases: ["Jacobian行列式", "变量替换", "极坐标", "球坐标", "微分同胚"],
    },
    // 保守场与路径无关判据。
    "conservative-field-path-independence": {
        id: "conservative-field-path-independence", l2Key: "calculus-integral", name: "保守场与路径无关判据", kind: "criterion",
        aliases: ["保守场", "势函数", "路径无关", "旋度为零", "单连通"],
    },
    // Green、Gauss、Stokes 公式与定向。
    "green-gauss-stokes-theorems": {
        id: "green-gauss-stokes-theorems", l2Key: "calculus-integral", name: "Green、Gauss 与 Stokes 公式", kind: "theorem",
        aliases: ["Green公式", "Gauss散度定理", "Stokes公式", "定向约定", "广义Stokes定理"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const CALCULUS_INTEGRAL_L3_RULES: Record<string, MathV2L3Rules> = {
    // Riemann 可积性判据。
    "riemann-integrability-criterion": {
        definitions: ["Riemann 可积性由 Darboux 上下积分相等刻画，等价于振幅和可任意小；Lebesgue 判据把它归结为有界且不连续点集测度为零。"],
        formulas: ["Darboux 准则：f 于 [a,b] 可积 ⇔ ∀ε > 0 存在分割 P 使 ∑_i ω_i Δx_i < ε（ω_i 为小区间上的振幅）。", "上下积分：∫̄ f = inf_P U(f,P)，∫_ f = sup_P L(f,P)；可积 ⇔ 两者相等。", "Lebesgue 判据：f 于 [a,b] Riemann 可积 ⇔ f 有界且其不连续点集为零测集。", "充分类：连续函数、单调函数、有界且只有有限个（或可数个）间断点的函数均可积。", "不可积例：Dirichlet 函数（有理点取 1）处处不连续，上积分 1、下积分 0。"],
        theorems: ["有界是 Riemann 可积的必要条件，故无界函数（即使只在一点无界）必须按反常积分处理。", "Riemann 函数（1/q 于有理点 p/q，其余取 0）不连续点为全体有理点（可数零测），故 Riemann 可积且积分为 0，说明「处处不连续」并不等同于不可积的判据。", "可积函数的复合一般不可积（Riemann 函数与指示函数复合可得 Dirichlet 函数），但可积函数与连续函数的外复合 g∘f（g 连续）可积。", "Riemann 可积 ⇒ Lebesgue 可积且两积分相等；反之不成立（有界的 Lebesgue 可积函数可以处处不连续）。"],
        generalRequirements: ["必须先验证被积函数在闭区间上有界。", "断言可积必须给出所依据的判据（连续、单调、间断点零测或振幅估计）。"],
        forbiddenErrors: ["【无界仍按定积分】对在区间内无界的函数直接用 Newton-Leibniz 公式。", "【间断点数目误判】认为无穷多个间断点必不可积。", "【上下积分不等仍求值】上下积分不等仍给出积分值。", "【复合保持可积】默认可积函数的复合仍可积。", "【Riemann 与 Lebesgue 混用】用 Lebesgue 可积性替代 Riemann 可积的结论。"],
        parameterConstraints: { boundedness: "Riemann 可积要求 f 在 [a,b] 上有界。", finiteInterval: "区间需有限（无穷区间按反常积分处理）。", nullDiscontinuity: "不连续点集需为零测集。" },
        closureChecks: ["核对有界性与区间有限性。", "指明可积性来源（连续/单调/零测间断/振幅估计）。", "若不可积，给出上下积分的差或具体振幅下界。"],
        scenarioChecks: { pathologicalFunctions: ["用 Dirichlet 与 Riemann 函数区分可积与不可积。"], improperReduction: ["无界或无穷区间转为反常积分并单独判别收敛。"], oscillationEstimate: ["用振幅和估计给出可积性的直接证明。"] },
    },
    // 微积分基本定理与变限积分。
    "fundamental-theorem-calculus": {
        definitions: ["微积分基本定理由两部分组成：变限积分是被积函数的原函数（微分部分），以及原函数的差给出定积分值（求值部分）。"],
        formulas: ["第一部分：f 于 [a,b] 可积，F(x) = ∫_a^x f(t) dt ⇒ F 连续；f 在 x₀ 连续 ⇒ F'(x₀) = f(x₀)。", "第二部分（Newton-Leibniz）：F 于 [a,b] 连续、在 (a,b) 内 F' = f 且 f 可积 ⇒ ∫_a^b f = F(b) - F(a)。", "复合变限求导：d/dx ∫_{u(x)}^{v(x)} f(t) dt = f(v(x))v'(x) - f(u(x))u'(x)。", "被积函数含 x 时须先化去：∫_0^x f(x - t)g(t) dt 需换元或用含参积分法则。", "Lebesgue 微分定理：f 局部可积 ⇒ F'(x) = f(x) 几乎处处成立。"],
        theorems: ["f 只可积时 F 连续但不必可导（f 有跳跃处 F 有折点），故 F' = f 只在 f 的连续点成立。", "存在导数处处存在但导数不 Riemann 可积的函数（Volterra 函数），故第二部分中「f 可积」不可省。", "可积不推出存在原函数，存在原函数也不推出可积：这两个概念相互独立，不能互推。", "变限积分是构造连续函数、证明中值定理型结论与建立积分不等式的核心工具，其正则性总比被积函数高一阶。"],
        generalRequirements: ["求导变限积分必须核对被积函数在相应点的连续性与上下限的可导性。", "使用 Newton-Leibniz 必须确认原函数在闭区间连续且被积函数可积。"],
        forbiddenErrors: ["【可积即可导】由 f 可积断言 F 处处可导且 F' = f。", "【上下限求导漏链式因子】遗漏 v'(x) 或 u'(x)。", "【下限项符号错误】忘记下限项前的负号。", "【被积函数含外变量未处理】直接把 x 当常数求导。", "【区间含奇点】被积函数在区间内有奇点仍套用 Newton-Leibniz。"],
        parameterConstraints: { continuityForDifferentiation: "F' = f 需 f 在该点连续。", integrabilityForEvaluation: "Newton-Leibniz 需 f 可积且 F 在闭区间连续。", limitDifferentiability: "复合形式要求上下限函数可导。" },
        closureChecks: ["核对被积函数在所求点的连续性。", "写出含上下限导数的完整链式表达式并检查符号。", "确认积分区间内无奇点，否则改按反常积分处理。"],
        scenarioChecks: { variableLimitDerivative: ["对上下限均为函数的情形写出两项并核对符号。"], zeroPointExistence: ["用变限积分构造辅助函数并结合中值定理证明根的存在。"], singularityDetection: ["先扫描区间内的奇点再决定是否用反常积分。"] },
    },
    // 反常积分收敛判别法。
    "improper-integral-convergence-tests": {
        definitions: ["反常积分包含无穷限与无界被积函数两类，其收敛性由极限定义，判别体系包括比较判别、p 判别与 Dirichlet/Abel 判别。"],
        formulas: ["定义：∫_a^∞ f = lim_{A→∞} ∫_a^A f；奇点在 b 时 ∫_a^b f = lim_{η→0⁺} ∫_a^{b-η} f。", "p 判别（无穷限）：∫_1^∞ dx/x^p 收敛 ⇔ p > 1；p 判别（奇点）：∫_0^1 dx/x^p 收敛 ⇔ p < 1。", "对数修正：∫_2^∞ dx/(x (ln x)^p) 收敛 ⇔ p > 1。", "比较判别：0 ≤ f ≤ g，∫ g 收敛 ⇒ ∫ f 收敛；极限形式 lim f/g = c ∈ (0,∞) 时同敛散。", "Dirichlet 判别：∫_a^A f 一致有界且 g 单调趋零 ⇒ ∫_a^∞ f g 收敛（典型：∫_1^∞ (sin x)/x dx 条件收敛，π/2）。"],
        theorems: ["条件收敛与绝对收敛必须区分：∫_1^∞ (sin x)/x dx 收敛但 ∫_1^∞ |sin x|/x dx 发散。", "多个奇点必须逐段拆分并要求每段独立收敛：∫_{-1}^1 dx/x 按主值为 0，但作为反常积分是发散的。", "被积函数趋于零不是收敛的充分条件（1/x），也不是必要条件（振荡型被积函数可不趋于零而积分收敛）。", "无穷限积分的收敛性与级数收敛性通过积分判别法相互转化，但被积函数需单调才能直接比较。"],
        generalRequirements: ["必须先定位所有奇点并逐段拆分，逐段判别收敛。", "必须明确所得结论是绝对收敛还是条件收敛。"],
        forbiddenErrors: ["【奇点未识别】区间内有奇点仍按普通定积分计算。", "【拆分后混合抵消】用两段发散的相互抵消得出收敛（把主值当收敛）。", "【条件收敛当绝对收敛】用绝对收敛的性质（如任意重排、乘积）处理条件收敛积分。", "【p 判别方向记错】把无穷限与奇点两种 p 判别的不等号方向互换。", "【Dirichlet 条件不全】未验证部分积分一致有界或单调趋零。"],
        parameterConstraints: { singularityLocation: "需列出区间内所有使被积函数无界的点。", pThreshold: "无穷限需 p > 1；端点奇点需 p < 1。", monotoneFactor: "Dirichlet/Abel 判别要求其中一因子单调。" },
        closureChecks: ["列出奇点并给出拆分方案，逐段判别。", "写明使用的判别法及其条件验证。", "结论区分绝对收敛、条件收敛与发散。"],
        scenarioChecks: { parameterRangeDiscussion: ["含参反常积分讨论参数使各段同时收敛的范围。"], oscillatoryIntegral: ["振荡型用 Dirichlet 判别并检查绝对收敛性。"], seriesComparison: ["用积分判别法在级数与积分间转换敛散性。"] },
    },
    // 含参积分的求导与极限交换。
    "parameter-integral-differentiation": {
        definitions: ["含参积分把积分值看作参数的函数，其连续性、可导性与积分号下求导的合法性由一致收敛或控制收敛条件保证。"],
        formulas: ["Leibniz 法则（固定区间）：∂f/∂y 连续 ⇒ d/dy ∫_a^b f(x,y) dx = ∫_a^b ∂f/∂y dx。", "变限形式：d/dy ∫_{u(y)}^{v(y)} f(x,y) dx = ∫_u^v ∂f/∂y dx + f(v,y)v'(y) - f(u,y)u'(y)。", "无穷限情形：需 ∫_a^∞ ∂f/∂y dx 关于 y 一致收敛且 ∫_a^∞ f dx 于某点收敛。", "控制收敛：|f_n| ≤ g 且 ∫ g < ∞ ⇒ lim ∫ f_n = ∫ lim f_n。", "Feynman 技巧：引入参数使 dI/dy 易算，再对 y 积分回去并用边界值定常数。"],
        theorems: ["无穷限或含奇点时逐点收敛不足以交换求导与积分，必须一致收敛（或用控制收敛的可积主控函数）。", "标准反例：∫_0^∞ y e^{-xy} dx = 1（y > 0）与 y → 0 的极限不等于 y = 0 时的积分值 0，说明缺一致性时极限与积分不可交换。", "级数与积分互换属于同一问题类：需一致收敛、单调收敛或控制收敛条件之一。", "Frullani 积分、Dirichlet 积分 ∫_0^∞ (sin x)/x dx = π/2 与 Gauss 积分的参数化求值都是该技巧的标准应用。"],
        generalRequirements: ["交换极限、求导或求和与积分前必须给出一致收敛或主控函数。", "变限含参情形必须写全边界项。"],
        forbiddenErrors: ["【无条件换序】不验证一致收敛就把导数或极限移入积分号。", "【主控函数缺失】使用控制收敛却不给出可积主控 g。", "【边界项遗漏】变限含参积分只写 ∂f/∂y 项。", "【一致收敛范围未声明】只在参数的某点验证一致性就推广到整个区间。", "【端点值直接代入】用极限过程外的端点参数值替代极限。"],
        parameterConstraints: { uniformConvergence: "无穷限或奇异情形需关于参数一致收敛。", dominatingFunction: "控制收敛需与参数无关的可积主控函数。", partialContinuity: "Leibniz 法则要求 ∂f/∂y 连续。" },
        closureChecks: ["写出所用交换定理及其条件验证。", "变限情形写全两个边界项与积分项。", "对结果在特殊参数值上作独立核验。"],
        scenarioChecks: { feynmanTrick: ["引入参数求导化简后再积分回去并用边界条件定常数。"], seriesIntegralExchange: ["级数与积分互换给出主控估计。"], uniformityFailure: ["在参数趋于边界处检查一致性是否失效。"] },
    },
    // Beta 与 Gamma 函数。
    "beta-gamma-functions": {
        definitions: ["Gamma 函数是阶乘的解析延拓，Beta 函数是与之配对的二元积分，两者构成计算有理幂次与三角幂次积分的标准工具。"],
        formulas: ["Γ(s) = ∫_0^∞ t^{s-1} e^{-t} dt（Re s > 0）；Γ(s+1) = sΓ(s)，Γ(n+1) = n!，Γ(1/2) = √π。", "B(p,q) = ∫_0^1 x^{p-1}(1-x)^{q-1} dx = Γ(p)Γ(q)/Γ(p+q)（p, q > 0）。", "三角形式：∫_0^{π/2} sin^{2p-1}θ cos^{2q-1}θ dθ = B(p,q)/2。", "反射公式：Γ(s)Γ(1-s) = π/sin(πs)；倍元公式：Γ(s)Γ(s+1/2) = 2^{1-2s}√π Γ(2s)。", "Stirling 渐近：Γ(s+1) ~ √(2πs)(s/e)^s（s → ∞）。"],
        theorems: ["Γ 通过 Γ(s) = Γ(s+1)/s 延拓到全平面，在 s = 0, -1, -2, ... 处有单极点、无零点，故 1/Γ 为整函数。", "Bohr-Mollerup 定理：满足 Γ(1) = 1、Γ(s+1) = sΓ(s) 且 log 凸的函数唯一，故 Γ 的延拓在自然条件下唯一。", "积分定义只在 Re s > 0 收敛，负参数结论必须经函数方程延拓后使用，不能直接代入积分。", "Beta 与 Gamma 的关系式来自二重积分换序与极坐标替换，其成立要求 p, q > 0（或经延拓后避开极点）。"],
        generalRequirements: ["使用积分定义必须核对参数落在收敛域内。", "换算到 Beta/Gamma 形式必须写出换元并核对参数与指数的对应。"],
        forbiddenErrors: ["【收敛域外用积分定义】对 Re s ≤ 0 直接代入 Γ 的积分式。", "【极点处取值】在 s = 0, -1, -2, ... 处给出有限的 Γ 值。", "【Beta 参数错位】把被积函数指数与 p-1、q-1 的对应弄反。", "【反射公式滥用】在 s 为整数（sin πs = 0）处使用反射公式。", "【Stirling 当等式】把渐近式写成等号使用。"],
        parameterConstraints: { gammaDomain: "积分定义要求 Re s > 0。", betaPositivity: "B(p,q) 的积分定义要求 p > 0 且 q > 0。", polesOfGamma: "Γ 在非正整数处有单极点。" },
        closureChecks: ["核对参数收敛域或说明所用延拓。", "写出换元过程并核对 Beta 参数。", "用已知特值（Γ(1/2) = √π、B(1,1) = 1）验算结果。"],
        scenarioChecks: { trigPowerIntegral: ["三角幂次积分化为 B(p,q)/2 形式。"], normalizationConstant: ["概率密度归一化常数用 Gamma 表达并核对参数正性。"], asymptoticFactorial: ["大参数阶乘用 Stirling 渐近估计并保留误差阶。"] },
    },
    // Fubini-Tonelli 定理。
    "fubini-tonelli-theorem": {
        definitions: ["Fubini 定理给出可积函数的重积分与累次积分相等的条件，Tonelli 定理则在非负可测的前提下先验证可积性。"],
        formulas: ["Tonelli：f ≥ 0 可测（σ 有限测度空间）⇒ ∫∫ f = ∫(∫ f dy) dx = ∫(∫ f dx) dy（允许取 +∞）。", "Fubini：f 可积（∫∫ |f| < ∞）⇒ 两个累次积分相等且等于重积分。", "实用流程：先用 Tonelli 对 |f| 验证 ∫∫ |f| < ∞，再用 Fubini 换序。", "离散情形：双重级数换序需 ∑∑ |a_{mn}| < ∞。", "经典反例：f(x,y) = (x²-y²)/(x²+y²)² 于 (0,1)² 两个累次积分分别为 π/4 与 -π/4。"],
        theorems: ["两个累次积分都存在且相等仍不能推出重积分存在（需绝对可积性），故换序前必须验证 ∫∫ |f| < ∞。", "非负情形无需先验可积性，这正是 Tonelli 定理的作用；两定理常配合使用。", "σ 有限性不可省：非 σ 有限测度下有换序失败的反例（如计数测度与 Lebesgue 测度的对角线指示函数）。", "双重级数的换序是同一定理在计数测度下的特例，条件收敛的双重级数换序可改变和值。"],
        generalRequirements: ["换序前必须验证绝对可积性或被积函数非负。", "必须写明测度空间的 σ 有限性（常规 R^n 情形可直接引用）。"],
        forbiddenErrors: ["【无条件换序】不验证绝对可积就交换累次积分次序。", "【累次相等推重积分】由两累次积分相等断言可积。", "【非负条件误用】对变号函数直接用 Tonelli。", "【σ 有限性忽略】在非 σ 有限测度上套用。", "【条件收敛级数换序】对非绝对收敛的双重级数任意换序。"],
        parameterConstraints: { absoluteIntegrability: "Fubini 要求 ∫∫ |f| < ∞。", nonnegativity: "Tonelli 要求 f ≥ 0 可测。", sigmaFinite: "两定理均要求 σ 有限测度空间。" },
        closureChecks: ["先对 |f| 用 Tonelli 计算并确认有限。", "换序后核对内外层积分的区域描述是否同步变换。", "对结果作一个特例或对称性核验。"],
        scenarioChecks: { orderExchange: ["改变累次积分次序前给出绝对可积性论证。"], regionRedescription: ["换序时重写内层积分的上下限（区域投影）。"], doubleSeries: ["双重级数换序验证绝对收敛。"] },
    },
    // 重积分变量替换与 Jacobian。
    "change-of-variables-jacobian": {
        definitions: ["重积分变量替换用微分同胚把积分区域化简，积分元乘以 Jacobian 行列式的绝对值，区域边界必须同步变换。"],
        formulas: ["一般公式：∫_{Φ(U)} f(x) dx = ∫_U f(Φ(u)) |det JΦ(u)| du（Φ 为 C¹ 微分同胚）。", "极坐标：dx dy = r dr dθ。", "柱坐标：dx dy dz = r dr dθ dz。", "球坐标：dx dy dz = ρ² sin φ dρ dφ dθ（φ 为极角，0 ≤ φ ≤ π）。", "线性替换：x = Au 时 |det A| 为常数因子；Jacobian 的乘法链式关系 det J(Φ∘Ψ) = det JΦ · det JΨ。"],
        theorems: ["必须取 Jacobian 的绝对值：定向反转时行列式为负，而积分元为正。", "单射性可在零测集上失效（极坐标在 r = 0、球坐标在 φ = 0, π 处退化），因此这些标准变换仍然适用。", "Jacobian 为零的点集若非零测则公式失效，此时需分片处理或改换变量。", "变换后必须重新描述区域：漏掉边界变换是重积分计算中最常见的实质性错误，其结果通常量级正确但数值错误。"],
        generalRequirements: ["必须写出变换、Jacobian 与新区域三者，缺一不可。", "必须核对变换在区域内（除零测集外）单射且 Jacobian 不为零。"],
        forbiddenErrors: ["【Jacobian 遗漏或未取绝对值】直接替换变量不乘 |det J| 或保留负号。", "【区域未变换】更换变量却沿用原上下限。", "【球坐标因子错误】写成 ρ² sin θ 或漏 sin φ。", "【非单射未分片】变换在区域内多对一仍直接套用。", "【Jacobian 退化集非零测】在退化集上仍使用公式。"],
        parameterConstraints: { diffeomorphism: "Φ 需 C¹ 且在区域内（除零测集外）单射。", jacobianNonzero: "|det JΦ| ≠ 0 于区域内（可在零测集上为零）。", orientationAbsolute: "积分元用行列式的绝对值。" },
        closureChecks: ["写出变换公式、Jacobian 计算过程与新区域描述。", "核对角度范围与半径范围是否覆盖原区域且不重复。", "用简单特例（如单位圆面积）验算 Jacobian 因子。"],
        scenarioChecks: { polarSubstitution: ["圆域或含 x²+y² 的被积函数用极坐标并核对 r dr dθ。"], sphericalSubstitution: ["球体或含 x²+y²+z² 的情形用球坐标并核对 ρ² sin φ。"], linearTransform: ["椭圆或平行体区域用线性替换并提出常数 |det A|。"] },
    },
    // 保守场与路径无关判据。
    "conservative-field-path-independence": {
        definitions: ["保守场指第二类曲线积分只依赖端点的向量场，等价于存在势函数；在单连通区域上等价于旋度为零。"],
        formulas: ["路径无关 ⇔ 存在 φ 使 F = ∇φ，此时 ∫_C F·dr = φ(终点) - φ(起点)。", "闭路条件：对一切闭曲线 ∮_C F·dr = 0。", "平面必要条件：∂P/∂y = ∂Q/∂x（F = (P, Q)）；空间必要条件：curl F = 0。", "势函数构造：φ(x,y) = ∫_{(x_0,y_0)}^{(x,y)} P dx + Q dy（沿任一路径，常取折线）。", "关键反例：F = (-y, x)/(x²+y²) 于 R²\\{0} 上旋度为零但沿单位圆 ∮ F·dr = 2π，故非保守。"],
        theorems: ["旋度为零只是局部条件，只有在单连通区域上才等价于保守；区域拓扑（第一同调）决定二者的差距。", "多连通区域上「旋度为零」的场沿不同同调类的闭曲线的环量可以不同，这些环量称为该场的周期。", "势函数存在时在连通区域上相差一个常数（分量上逐连通分支各差一常数）。", "该判据是复分析中 Cauchy 定理对区域单连通性要求的实分析对应，也是 de Rham 上同调的最初例子。"],
        generalRequirements: ["必须先声明区域并判断其是否单连通。", "断言保守必须给出势函数或验证任意闭路环量为零。"],
        forbiddenErrors: ["【旋度零即保守】在多连通（挖点、挖洞）区域上由旋度为零断言保守。", "【区域未声明】不指明定义域就断言路径无关。", "【势函数构造未验证】给出 φ 后不回代验证 ∇φ = F。", "【奇点跨越】积分路径穿过场的奇点仍用势函数差。", "【必要与充分混淆】把 ∂P/∂y = ∂Q/∂x 当作充要条件而不论区域。"],
        parameterConstraints: { domainConnectivity: "等价性要求区域单连通（且连通）。", c1Field: "旋度判据要求 F 的分量 C¹。", singularityExclusion: "路径必须避开场的奇点。" },
        closureChecks: ["画出或描述区域并判断单连通性。", "验证混合偏导条件后构造势函数并回代检验。", "多连通情形计算各洞对应的环量周期。"],
        scenarioChecks: { potentialConstruction: ["沿折线积分构造势函数并回代验证。"], multiplyConnectedDomain: ["挖点区域计算绕奇点的环量以否证保守性。"], workComputation: ["保守场做功用端点势差直接给出，与路径无关。"] },
    },
    // Green、Gauss、Stokes 公式与定向。
    "green-gauss-stokes-theorems": {
        definitions: ["Green、Gauss 与 Stokes 公式把区域上的微分量的积分化为边界上的积分，是广义 Stokes 定理在低维的三个具体形式，其成立依赖区域正则性与定向一致性。"],
        formulas: ["Green：∮_{∂D} P dx + Q dy = ∫∫_D (∂Q/∂x - ∂P/∂y) dA（∂D 取逆时针，即区域在左）。", "Gauss（散度定理）：∮∮_{∂Ω} F·n dS = ∫∫∫_Ω div F dV（n 取外法向）。", "Stokes：∮_{∂S} F·dr = ∫∫_S (curl F)·n dS（右手法则联系边界方向与 n）。", "面积公式（Green 推论）：A = (1/2)∮_{∂D} (x dy - y dx)。", "广义形式：∫_M dω = ∫_{∂M} ω（M 为定向紧流形）。"],
        theorems: ["定向错误使结果整体差一个负号，这是这三个公式最高频的错误来源；必须显式写出所取定向。", "场在区域内有奇点时不能直接套用，须挖去奇点邻域并补上内边界的积分（这正是留数定理与 Gauss 定律的机制）。", "多连通区域的 Green 公式中外边界取逆时针、内边界取顺时针，等价于统一取「区域在左」。", "三个公式统一于 ∫_M dω = ∫_{∂M} ω，Green 是 2 维 Stokes 的平面特例，Gauss 是 3 维情形的对偶表述。"],
        generalRequirements: ["必须验证区域与边界的正则性（分段光滑、闭合）以及向量场在闭区域上 C¹。", "必须显式声明边界定向与法向方向。"],
        forbiddenErrors: ["【定向未声明或取反】未说明逆时针/外法向，或方向取反导致符号错误。", "【奇点未处理】场在区域内有奇点仍直接套用公式。", "【边界不闭合】对非闭合边界使用需闭曲线/闭曲面的公式。", "【多连通内边界方向错误】内边界仍取逆时针。", "【正则性缺失】向量场在边界上不 C¹ 或区域边界不分段光滑仍套用。"],
        parameterConstraints: { boundaryOrientation: "Green 取区域在左；Gauss 取外法向；Stokes 由右手法则匹配。", fieldRegularity: "向量场分量需在闭区域上 C¹。", boundaryClosedPiecewiseSmooth: "边界需闭合且分段光滑。" },
        closureChecks: ["写明区域、边界与所取定向。", "扫描区域内的奇点并决定是否挖洞补边界积分。", "用简单特例（如单位圆上的常向量场）核验符号。"],
        scenarioChecks: { areaViaGreen: ["用 (1/2)∮(x dy - y dx) 计算封闭曲线所围面积。"], fluxComputation: ["闭曲面通量用散度定理，非闭曲面需补面或直接计算。"], singularityExcision: ["挖去奇点后在内边界补积分，得到与环量/通量的对应关系。"] },
    },
};
