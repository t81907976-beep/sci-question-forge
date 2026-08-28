import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“复分析-复变函数”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMPLEX_ANALYSIS_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Cauchy-Riemann 方程与全纯性判据。
    "cauchy-riemann-holomorphy": {
        id: "cauchy-riemann-holomorphy", l2Key: "complex-analysis", name: "Cauchy-Riemann 方程与全纯性判据", kind: "criterion",
        aliases: ["Cauchy-Riemann方程", "复可微", "全纯", "调和共轭", "Looman-Menchoff定理"],
    },
    // Cauchy 积分定理与积分公式。
    "cauchy-integral-theorem-formula": {
        id: "cauchy-integral-theorem-formula", l2Key: "complex-analysis", name: "Cauchy 积分定理与积分公式", kind: "theorem",
        aliases: ["Cauchy积分定理", "Cauchy积分公式", "Morera定理", "Liouville定理", "Cauchy估计"],
    },
    // Laurent 展开与孤立奇点分类。
    "laurent-expansion-singularity-classification": {
        id: "laurent-expansion-singularity-classification", l2Key: "complex-analysis", name: "Laurent 展开与孤立奇点分类", kind: "criterion",
        aliases: ["Laurent展开", "可去奇点", "极点", "本性奇点", "Casorati-Weierstrass定理"],
    },
    // 留数定理与实积分计算。
    "residue-theorem-real-integrals": {
        id: "residue-theorem-real-integrals", l2Key: "complex-analysis", name: "留数定理与实积分计算", kind: "theorem",
        aliases: ["留数定理", "留数计算", "Jordan引理", "主值积分", "支割线"],
    },
    // 辐角原理与 Rouché 定理。
    "argument-principle-rouche": {
        id: "argument-principle-rouche", l2Key: "complex-analysis", name: "辐角原理与 Rouché 定理", kind: "theorem",
        aliases: ["辐角原理", "Rouché定理", "零点极点计数", "Hurwitz零点定理", "绕数"],
    },
    // 最大模原理与 Schwarz 引理。
    "maximum-modulus-schwarz-lemma": {
        id: "maximum-modulus-schwarz-lemma", l2Key: "complex-analysis", name: "最大模原理与 Schwarz 引理", kind: "theorem",
        aliases: ["最大模原理", "Schwarz引理", "Schwarz-Pick引理", "开映射定理", "Phragmén-Lindelöf原理"],
    },
    // 解析延拓与单值性定理。
    "analytic-continuation-monodromy": {
        id: "analytic-continuation-monodromy", l2Key: "complex-analysis", name: "解析延拓与单值性定理", kind: "theorem",
        aliases: ["解析延拓", "唯一性定理", "单值性定理", "自然边界", "Schwarz反射原理"],
    },
    // 整函数的阶与 Hadamard 分解。
    "entire-function-order-hadamard": {
        id: "entire-function-order-hadamard", l2Key: "complex-analysis", name: "整函数的阶与 Hadamard 分解", kind: "theorem",
        aliases: ["整函数阶", "Hadamard分解定理", "Weierstrass乘积", "Jensen公式", "整函数亏格"],
    },
    // 正规族、Montel 与 Picard 定理。
    "montel-picard-normal-family": {
        id: "montel-picard-normal-family", l2Key: "complex-analysis", name: "正规族与 Picard 定理", kind: "theorem",
        aliases: ["正规族", "Montel定理", "小Picard定理", "大Picard定理", "局部一致有界"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMPLEX_ANALYSIS_L3_RULES: Record<string, MathV2L3Rules> = {
    // Cauchy-Riemann 方程与全纯性。
    "cauchy-riemann-holomorphy": {
        definitions: ["全纯是复可微在开集上的整体版本，其解析刻画为实部虚部满足 Cauchy-Riemann 方程，且远强于实二元函数的可微性。"],
        formulas: ["C-R 方程：u_x = v_y，u_y = -v_x（f = u + iv）。", "极坐标形式：u_r = v_θ/r，v_r = -u_θ/r。", "Wirtinger 形式：全纯 ⇔ ∂f/∂z̄ = 0；此时 f' = ∂f/∂z。", "调和性：f 全纯 ⇒ u、v 调和且 ∇u·∇v = 0（等值线正交）。", "导数关系：f'(z) = u_x + i v_x = v_y - i u_y。"],
        theorems: ["必要性无条件成立（复可微 ⇒ C-R）；充分性需附加条件：u、v 的一阶偏导在该点连续（或实可微）时 C-R ⇒ 复可微。", "仅满足 C-R 方程不足以推出全纯：f = z̄²/|z|²（f(0)=0）在原点满足 C-R 但不复可微，说明必须核对实可微性。", "Looman-Menchoff 定理：f 连续且在区域内处处满足 C-R ⇒ 全纯，说明连续性可替代偏导连续性这一较强假设。", "全纯性远强于实可微：全纯 ⇒ 无穷次可微、解析（局部幂级数）、满足最大模原理，而实可微函数没有任何这些性质。"],
        generalRequirements: ["由 C-R 方程推全纯必须补充实可微性或偏导连续性（或引用 Looman-Menchoff 的连续性条件）。", "必须明确定义域为开集，边界点上不谈全纯。"],
        forbiddenErrors: ["【C-R 即全纯】只验证 C-R 方程就断言全纯。", "【逐点全纯】在孤立点或闭集上谈全纯性。", "【共轭函数当全纯】把 z̄、|z|²、Re z 当作全纯函数（它们只在 ∂f/∂z̄ = 0 处不成立）。", "【调和共轭方向错误】由 u 求 v 时符号取反（应满足 v_x = -u_y）。", "【极坐标形式漏 r】写成 u_r = v_θ 而漏掉 1/r。"],
        parameterConstraints: { openDomain: "全纯要求定义域为开集。", realDifferentiability: "C-R 的充分性需实可微或偏导连续。", conjugateHarmonic: "调和共轭在单连通域上存在且相差常数。" },
        closureChecks: ["写出 u、v 并逐条验证 C-R 方程。", "补充实可微性或偏导连续性的说明。", "如需求调和共轭，验证所得 v 满足两个 C-R 方程。"],
        scenarioChecks: { holomorphyTest: ["用 ∂f/∂z̄ = 0 快速判定并核对实可微性。"], harmonicConjugate: ["由调和函数 u 积分构造 v 并确定常数。"], nonHolomorphicExample: ["用含 z̄ 的表达式说明不全纯及其原因。"] },
    },
    // Cauchy 积分定理与积分公式。
    "cauchy-integral-theorem-formula": {
        definitions: ["Cauchy 积分定理断言全纯函数沿单连通区域内闭曲线的积分为零，积分公式则把函数值与各阶导数用边界积分表示，是复分析的中枢。"],
        formulas: ["积分定理：f 于单连通域 D 全纯，γ ⊂ D 闭曲线 ⇒ ∮_γ f dz = 0。", "积分公式：f(z₀) = (1/2πi)∮_γ f(z)/(z - z₀) dz（γ 绕 z₀ 一周，逆时针）。", "高阶形式：f^{(n)}(z₀) = (n!/2πi)∮_γ f(z)/(z - z₀)^{n+1} dz。", "Cauchy 估计：|f^{(n)}(z₀)| ≤ n! M/R^n（M = max_{|z-z₀|=R} |f|）。", "均值性质：f(z₀) = (1/2π)∫_0^{2π} f(z₀ + Re^{iθ}) dθ。"],
        theorems: ["单连通性不可省：f = 1/z 于圆环上全纯但 ∮_{|z|=1} dz/z = 2πi ≠ 0；多连通情形需用同调形式（外边界减内边界）。", "由积分公式得全纯 ⇒ 无穷次可微且解析，这是复分析与实分析的本质分野；Morera 定理给出逆向刻画（连续且一切闭三角形积分为零 ⇒ 全纯）。", "Liouville 定理（由 Cauchy 估计取 R → ∞）：有界整函数必为常数，进而给出代数基本定理的证明。", "Cauchy 估计还给出正规族的等度连续性（Montel 定理）与 Schwarz 引理型系数界。"],
        generalRequirements: ["必须核对区域的单连通性（或改用同调/同伦形式）与曲线的定向和绕数。", "使用积分公式必须确认 z₀ 落在曲线所围内部且 f 在闭区域上全纯。"],
        forbiddenErrors: ["【单连通性缺失】在挖点或圆环区域直接断言积分为零。", "【绕数忽略】曲线绕 z₀ 多圈或顺时针仍用标准公式。", "【奇点位置误判】被积函数的奇点在曲线外仍按公式取值（或反之）。", "【高阶公式阶数错位】分母幂次与导数阶数不匹配（应为 n+1 对 n 阶导数）。", "【闭区域全纯性未验】f 仅在开区域全纯却在边界上取最大模用于估计而不作极限论证。"],
        parameterConstraints: { simpleConnectivity: "积分定理要求区域单连通（或曲线在区域内可缩为点）。", orientationWinding: "标准公式取逆时针且绕数为 1。", interiorPoint: "积分公式要求 z₀ 在曲线内部。" },
        closureChecks: ["列出被积函数在曲线内部的全部奇点。", "核对定向与绕数并写出对应系数。", "使用估计时明确 M 与 R 的取法。"],
        scenarioChecks: { contourIntegralEvaluation: ["按奇点是否在内部决定用积分公式还是积分定理。"], liouvilleApplication: ["用 Cauchy 估计令 R → ∞ 证明整函数为常数或多项式。"], moreraConverse: ["用 Morera 定理由积分性质反推全纯性。"] },
    },
    // Laurent 展开与奇点分类。
    "laurent-expansion-singularity-classification": {
        definitions: ["Laurent 展开把圆环域上的全纯函数表示为双边幂级数，其主部结构给出孤立奇点的三分类，并直接给出留数。"],
        formulas: ["Laurent 级数：f(z) = ∑_{n=-∞}^{∞} a_n (z - z₀)^n，a_n = (1/2πi)∮ f(z)/(z-z₀)^{n+1} dz，收敛于圆环 r < |z - z₀| < R。", "可去奇点：主部为零 ⇔ lim_{z→z₀} f(z) 存在有限 ⇔ f 在邻域内有界（Riemann 可去奇点定理）。", "m 阶极点：主部最低次为 (z-z₀)^{-m} ⇔ lim (z-z₀)^m f(z) 存在非零 ⇔ |f| → ∞。", "本性奇点：主部有无穷多非零项 ⇔ 极限不存在（Casorati-Weierstrass：像在任意邻域内稠密）。", "留数：Res(f, z₀) = a_{-1}；m 阶极点时 Res = lim_{z→z₀} [(z-z₀)^m f(z)]^{(m-1)}/(m-1)!。"],
        theorems: ["分类的三个刻画（Laurent 主部、极限行为、模的增长）互相等价，判定时可任选其一但必须自洽。", "大 Picard 定理进一步断言本性奇点的任意邻域上函数取到除至多一个值外的所有复值无穷多次，远强于 Casorati-Weierstrass。", "极点与零点对偶：f 在 z₀ 有 m 阶极点 ⇔ 1/f 在 z₀ 有 m 阶零点，可用于极点阶数的计算。", "无穷远点的分类由 g(w) = f(1/w) 在 w = 0 的分类给出；整函数在 ∞ 处为极点 ⇔ 它是多项式。"],
        generalRequirements: ["必须给出奇点的分类依据（主部、极限或增长）。", "Laurent 展开必须写明所在圆环域，不同圆环上的展开不同。"],
        forbiddenErrors: ["【圆环域未声明】给出 Laurent 展开而不指明收敛圆环（同一函数在不同圆环展开不同）。", "【极点阶数误判】未验证 lim (z-z₀)^m f(z) 非零就断定阶数。", "【留数直接用一阶公式】对高阶极点用 lim (z-z₀)f(z)。", "【本性奇点当极点】把 e^{1/z} 在 0 处判为极点。", "【可去奇点判据误用】由 f 在 z₀ 无定义断言奇点不可去。"],
        parameterConstraints: { annulusOfConvergence: "Laurent 级数收敛于某个圆环，需显式给出 r 与 R。", isolatedSingularity: "分类只适用于孤立奇点（非孤立奇点如 1/sin(1/z) 的聚点不适用）。", poleOrder: "m 阶极点要求 (z-z₀)^m f(z) 在 z₀ 有非零有限极限。" },
        closureChecks: ["写明展开所在圆环。", "用极限或主部两种方式交叉验证奇点类型与阶数。", "按阶数选择正确的留数计算公式。"],
        scenarioChecks: { singularityClassification: ["逐个奇点判定类型与阶数并说明依据。"], residueFromLaurent: ["直接读取 a_{-1} 得留数，适用于本性奇点。"], behaviorAtInfinity: ["用 f(1/w) 讨论无穷远点的类型。"] },
    },
    // 留数定理与实积分计算。
    "residue-theorem-real-integrals": {
        definitions: ["留数定理把闭路积分化为内部奇点留数之和，配合围道设计与 Jordan 引理成为计算实积分的系统方法。"],
        formulas: ["留数定理：∮_γ f dz = 2πi ∑_k n(γ, z_k) Res(f, z_k)（n 为绕数）。", "三角有理式：∫_0^{2π} R(cos θ, sin θ) dθ 用 z = e^{iθ}，cos θ = (z + z^{-1})/2，dθ = dz/(iz)，化为单位圆上的留数和。", "有理型无穷积分：∫_{-∞}^{∞} P/Q dx 用上半平面半圆围道，需 deg Q ≥ deg P + 2。", "含 e^{iax} 型：用 Jordan 引理（a > 0 时上半圆上积分趋零，只需 |f| → 0）。", "主值与半留数：单极点落在实轴上时用小半圆绕过，贡献 ±iπ Res，结果为 Cauchy 主值。"],
        theorems: ["围道选择由被积函数的衰减与对称性决定：多值函数（含 z^α、log z）必须先取定支割线并选用键孔围道，否则积分不封闭。", "半圆围道的余项估计不可省：deg Q - deg P ≥ 2 时用 ML 估计，含振荡因子时须用 Jordan 引理而非直接 ML 估计。", "实轴上的极点使原积分作为反常积分发散，只有主值存在；结果必须声明为主值。", "多值函数绕支割线一周后被积函数相差一个常数因子，正是这个差值给出原积分（如 ∫_0^∞ x^{α-1}/(1+x) dx = π/sin(πα)）。"],
        generalRequirements: ["必须画出或明确描述围道、列出内部奇点及其阶数与留数。", "必须给出辅助弧段积分趋零的估计（ML 估计或 Jordan 引理）。"],
        forbiddenErrors: ["【余项估计缺失】只算留数不证明大圆弧或小圆弧积分趋零。", "【实轴极点未处理】实轴上有极点仍按普通反常积分给出有限值而不声明主值。", "【支割线未取定】含多值函数却不指定分支与支割线。", "【绕数与定向错误】顺时针围道漏负号或多圈未乘绕数。", "【留数公式误用】对高阶极点使用一阶极点公式。"],
        parameterConstraints: { decayCondition: "有理型需 deg Q ≥ deg P + 2；振荡型用 Jordan 引理（只需 |f| → 0）。", branchCut: "多值函数需固定分支与支割线并避免围道穿越。", windingNumber: "留数前的系数为绕数，逆时针为正。" },
        closureChecks: ["列出围道内部奇点、阶数与留数。", "写出辅助弧段的极限估计。", "核对结果的实虚部与原积分的实值性（或主值声明）是否一致。"],
        scenarioChecks: { trigonometricIntegral: ["单位圆替换后按单位圆内的奇点求和。"], oscillatoryIntegral: ["含 e^{iax} 用 Jordan 引理并取实部或虚部。"], keyholeContour: ["含 x^α 或 log x 用键孔围道并利用绕行后的因子差。"] },
    },
    // 辐角原理与 Rouché 定理。
    "argument-principle-rouche": {
        definitions: ["辐角原理用边界上函数的辐角变化计数区域内零点与极点之差，Rouché 定理由此给出零点个数的扰动稳定性判据。"],
        formulas: ["辐角原理：(1/2πi)∮_γ f'/f dz = Z - P（Z、P 为 γ 内零点与极点个数，计重数）。", "几何形式：Δ_γ arg f = 2π(Z - P)，即像曲线 f(γ) 绕原点的绕数。", "Rouché 定理：γ 上 |f - g| < |f| ⇒ f 与 g 在 γ 内零点个数相同（计重数）。", "对称版本：|f - g| < |f| + |g| 于 γ 上（更弱的条件，允许两者模相近）。", "Hurwitz 定理：f_n → f 内闭一致收敛且 f ≢ 0 ⇒ 极限的零点是 f_n 零点的极限，零点个数在紧子集上最终相同。"],
        theorems: ["Rouché 的不等式必须在整条曲线上严格成立；某点取等号即失效（此时零点可能落在曲线上）。", "取「主项」的选择决定成败：应把模较大的项取作 f，若取反则不等式不成立。", "辐角原理要求 f 在 γ 上无零点、无极点，否则积分无定义。", "代数基本定理、Hurwitz 定理与开映射定理均可由辐角原理或 Rouché 定理直接导出；单叶性判据（辐角变化恰为 2π）也来自该原理。"],
        generalRequirements: ["必须验证曲线上无零点极点并给出闭曲线与定向。", "使用 Rouché 必须在整条曲线上给出严格不等式的估计过程。"],
        forbiddenErrors: ["【不等式非严格或仅部分点验证】只在若干点验证 |f - g| < |f|。", "【主项选取错误】把模较小的项当作 f。", "【曲线上有零点】γ 上存在零点仍套用辐角原理。", "【重数遗漏】计数时不计重数。", "【零点位置臆断】由个数结论断言零点的具体位置或模。"],
        parameterConstraints: { noZerosOnContour: "γ 上不得有 f 的零点或极点。", strictInequality: "Rouché 要求整条曲线上严格不等式。", multiplicityCount: "零点极点均按重数计。" },
        closureChecks: ["在曲线上逐项估计模并确认严格不等式。", "说明零点计数含重数。", "如需定位零点，改用逐个区域（不同半径的圆）分别计数。"],
        scenarioChecks: { rootCountingInDisk: ["取不同半径的圆用 Rouché 分层确定零点分布。"], polynomialDominance: ["高次项在大圆上占优、常数项在小圆上占优。"], hurwitzLimit: ["函数列极限的零点分布用 Hurwitz 定理讨论。"] },
    },
    // 最大模原理与 Schwarz 引理。
    "maximum-modulus-schwarz-lemma": {
        definitions: ["最大模原理断言非常数全纯函数的模不能在内部取到最大值，Schwarz 引理是其在单位圆盘上的定量形式，给出圆盘自映射的强刚性。"],
        formulas: ["最大模原理：f 于区域 D 全纯非常数 ⇒ |f| 在 D 内无局部最大值；D 有界且 f 连续到边界时 max_{D̄} |f| = max_{∂D} |f|。", "最小模原理：f 无零点时 |f| 也不在内部取最小值。", "Schwarz 引理：f: D → D 全纯，f(0) = 0 ⇒ |f(z)| ≤ |z| 且 |f'(0)| ≤ 1；等号（某点或导数）⇒ f(z) = e^{iθ} z。", "Schwarz-Pick：f: D → D 全纯 ⇒ |f'(z)|/(1 - |f(z)|²) ≤ 1/(1 - |z|²)，即双曲度量不增。", "开映射定理：非常数全纯映射把开集映为开集。"],
        theorems: ["等号情形给出完全的刚性结论：Schwarz 引理中任一等号成立即迫使 f 为旋转，这是唯一性论证（如 Riemann 映照的归一化唯一性）的核心。", "最大模原理要求区域连通；在非连通区域上分支可各自取不同的最大值。", "无界区域上最大模原理需附加增长条件（Phragmén-Lindelöf 原理），否则失效（如 e^z 于右半平面）。", "Schwarz-Pick 引理说明圆盘自映射是双曲度量的压缩映射，由此得 Pick-Nevanlinna 插值与圆盘自同构群 Aut(D) = {e^{iθ}(z-a)/(1-āz)}。"],
        generalRequirements: ["必须声明区域的连通性与有界性；无界区域需给出增长条件。", "使用 Schwarz 引理必须核对 f(0) = 0 与像落在单位圆盘内。"],
        forbiddenErrors: ["【规范化条件缺失】不满足 f(0) = 0 就用 |f(z)| ≤ |z|（应先用自同构平移）。", "【无界区域直接套用】在无界区域上使用最大模原理而不加增长条件。", "【最小模原理漏无零点条件】f 有零点仍断言 |f| 不取内部最小。", "【等号情形忽略】得到不等式后不讨论等号导致的刚性结论。", "【调和与全纯混淆】把最大模原理的结论用于 |f| 的实部或非全纯函数。"],
        parameterConstraints: { connectedDomain: "区域需连通。", boundedOrGrowth: "边界最大值形式需区域有界（或补 Phragmén-Lindelöf 条件）。", diskNormalization: "Schwarz 引理要求 f(D) ⊂ D 且 f(0) = 0。" },
        closureChecks: ["核对区域连通、有界与 f 到边界的连续性。", "使用 Schwarz 引理前用自同构把内点移到原点。", "讨论等号情形并给出对应的刚性结论。"],
        scenarioChecks: { boundEstimate: ["用边界最大值给出内部模估计。"], diskSelfMap: ["圆盘自映射用 Schwarz-Pick 给出导数界。"], uniquenessOfMapping: ["用等号刚性证明共形映射在归一化下唯一。"] },
    },
    // 解析延拓与单值性。
    "analytic-continuation-monodromy": {
        definitions: ["解析延拓把局部定义的全纯函数扩张到更大区域，其唯一性由零点孤立性保证，而延拓的单值性由区域的拓扑（单值性定理）控制。"],
        formulas: ["唯一性定理：f、g 于连通区域 D 全纯，若在 D 的某个有极限点的子集上相等 ⇒ 于 D 上恒等。", "零点孤立性：非零全纯函数的零点集在区域内孤立且无内部聚点。", "单值性定理：沿单连通区域内的一切路径延拓给出唯一的单值全纯函数。", "Schwarz 反射原理：f 在上半平面全纯、在实轴段上取实值 ⇒ f(z̄) = conj(f(z)) 给出到下半平面的延拓。", "幂级数延拓半径：收敛半径等于到最近奇点的距离，R = 1/limsup |a_n|^{1/n}。"],
        theorems: ["延拓沿不同路径可给出不同分支（如 log z、√z 绕原点一周后改变），差异由单值群（monodromy）刻画，这正是 Riemann 面的构造动机。", "自然边界可使延拓完全停止：∑ z^{n!} 在单位圆周上处处有奇点，故不能越过 |z| = 1 延拓。", "唯一性定理要求相等集有极限点在区域内：在孤立点列（如 1/n 但极限 0 不在区域内）上相等不足以推出恒等。", "唯一性定理是函数方程延拓（如 ζ 的函数方程、Γ 的递推）与恒等式从实轴推广到复域的标准依据。"],
        generalRequirements: ["必须声明区域连通性与相等集的极限点位置。", "多值情形必须给出分支与延拓路径。"],
        forbiddenErrors: ["【连通性缺失】在非连通区域上用唯一性定理。", "【极限点在区域外】相等集的极限点落在边界仍断言恒等。", "【多值性忽略】延拓 log 或根式时不声明分支导致结果不自洽。", "【越过自然边界】断言任意函数都可延拓到更大区域。", "【反射原理条件缺失】未验证在实轴段上取实值就使用 Schwarz 反射。"],
        parameterConstraints: { connectedRegion: "唯一性定理要求区域连通。", accumulationPoint: "相等集需在区域内有极限点。", pathHomotopy: "单值性要求延拓路径在区域内同伦。" },
        closureChecks: ["核对区域连通与极限点位置。", "多值函数写明分支切割与延拓路径。", "检查是否存在自然边界或奇点阻挡延拓。"],
        scenarioChecks: { functionalEquationExtension: ["用函数方程把定义域逐步延拓并引用唯一性。"], branchTracking: ["沿闭路追踪分支变化并计算单值群作用。"], reflectionExtension: ["实轴上取实值时用 Schwarz 反射延拓。"] },
    },
    // 整函数的阶与 Hadamard 分解。
    "entire-function-order-hadamard": {
        definitions: ["整函数的阶刻画其模的增长速度，Hadamard 分解定理把整函数写成零点因子乘积与指数多项式之积，把增长与零点分布联系起来。"],
        formulas: ["阶：ρ = limsup_{r→∞} log log M(r)/log r（M(r) = max_{|z|=r} |f|）。", "Weierstrass 乘积：f(z) = z^m e^{g(z)} ∏_n E_p(z/a_n)（E_p 为含指数修正的初等因子）。", "Hadamard 定理：有限阶 ρ 的整函数中 g 为次数不超过 ⌊ρ⌋ 的多项式，且 p ≤ ⌊ρ⌋。", "零点计数与阶的关系：∑_n 1/|a_n|^{s} < ∞ 对一切 s > ρ；收敛指数 ≤ ρ。", "Jensen 公式：(1/2π)∫_0^{2π} log|f(re^{iθ})| dθ = log|f(0)| + ∑_{|a_n| < r} log(r/|a_n|)。"],
        theorems: ["阶为 ρ 的整函数的零点不能过密：零点计数函数满足 n(r) = O(r^{ρ+ε})，这是 Jensen 公式的直接推论。", "阶为零或非整数时函数必有无穷多零点（除多项式情形），故 e^z（阶 1，无零点）说明整数阶是无零点整函数的必要条件。", "Hadamard 分解给出 sin 的乘积展开与 ζ、Γ 的完全分解，是解析数论中函数方程与零点分布分析的基础工具。", "Borel 与 Nevanlinna 理论把增长与值分布的关系精细化：亏值、亏量与第二基本定理刻画取值的稀缺程度。"],
        generalRequirements: ["必须先计算或估计阶，再选择分解形式与初等因子的次数 p。", "零点乘积必须验证收敛性（收敛指数条件）。"],
        forbiddenErrors: ["【阶的定义写错】漏掉双重对数或分母写成 r。", "【指数因子次数过高】g 的次数超过 ⌊ρ⌋。", "【乘积收敛性未验】不加初等因子修正就直接写 ∏(1 - z/a_n)。", "【零点密度臆断】不用 Jensen 公式就断言零点计数阶。", "【多项式与整函数混淆】把有限个零点的整函数当作一般情形处理。"],
        parameterConstraints: { finiteOrder: "Hadamard 定理要求有限阶。", genusBound: "初等因子次数 p 与多项式次数均不超过 ⌊ρ⌋。", zeroConvergenceExponent: "零点收敛指数不超过阶。" },
        closureChecks: ["估计 M(r) 并计算阶。", "写出分解式并验证乘积收敛与指数多项式次数。", "用 Jensen 公式核对零点计数与阶的相容性。"],
        scenarioChecks: { productExpansion: ["由零点分布写出 sin πz 型乘积展开。"], growthVsZeros: ["由增长阶反推零点计数的上界。"], zeroFreeEntire: ["无零点整函数写成 e^{g} 并由阶限制 g 的次数。"] },
    },
    // 正规族、Montel 与 Picard 定理。
    "montel-picard-normal-family": {
        definitions: ["正规族指任意序列都有内闭一致收敛子列的全纯函数族，Montel 定理给出其判据，Picard 定理则刻画整函数与本性奇点附近的值分布。"],
        formulas: ["正规族：F ⊂ Hol(D) 使任意 {f_n} ⊂ F 有内闭一致收敛（或一致趋于 ∞）的子列。", "Montel 判据（弱形式）：F 局部一致有界 ⇒ F 正规。", "Montel 判据（强形式）：F 中函数都遗漏两个固定的复值 a ≠ b ⇒ F 正规。", "小 Picard 定理：非常数整函数至多遗漏一个复值（e^z 遗漏 0，达到上界）。", "大 Picard 定理：本性奇点的任意去心邻域内，函数取到除至多一个值外的每个复值无穷多次。"],
        theorems: ["Montel 弱形式由 Cauchy 估计得等度连续，再用 Arzelà-Ascoli 得子列，故它是实分析紧性定理在全纯情形的加强（只需有界，不需另设等度连续）。", "强形式说明「遗漏两值」本身就迫使紧性，这是 Picard 定理的证明机制，也是 Fatou-Julia 迭代理论中正规性判别的基础。", "Riemann 映照定理的存在性证明用正规族取极限并配合 Hurwitz 定理保证极限映射单叶。", "Picard 定理是 Casorati-Weierstrass（像稠密）的实质加强：从稠密提升到取遍并无穷多次。"],
        generalRequirements: ["使用 Montel 定理必须说明是局部一致有界还是遗漏两值的形式。", "正规性与收敛性的结论只对紧子集成立。"],
        forbiddenErrors: ["【整体一致有界要求】要求在整个区域一致有界（只需局部）。", "【遗漏一值即正规】用遗漏一个值套用强形式（必须两个）。", "【极限函数性质臆断】不引用 Hurwitz 就断言极限保持单叶或非零。", "【Picard 与 Casorati-Weierstrass 混淆】把稠密性当作取遍所有值。", "【正规性推收敛】由族正规断言整个序列收敛（只有子列）。"],
        parameterConstraints: { localBoundedness: "弱形式要求在每个紧子集上一致有界。", omittedValues: "强形式要求遗漏两个不同的复值。", compactSubsets: "收敛性为内闭一致收敛。" },
        closureChecks: ["核对所用判据的形式及其条件。", "把结论表述为存在内闭一致收敛子列。", "如需极限的单叶性或非零性，补引 Hurwitz 定理。"],
        scenarioChecks: { riemannMappingExistence: ["用正规族取极限构造共形映射并用 Hurwitz 保单叶。"], valueDistribution: ["用 Picard 定理限制整函数可遗漏的值的个数。"], essentialSingularityBehavior: ["本性奇点邻域内的取值用大 Picard 定理描述。"] },
    },
};
