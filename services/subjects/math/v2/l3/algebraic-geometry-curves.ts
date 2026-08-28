import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数几何-代数曲线与代数曲面”下的原子 L3 知识项。
// 本分支统一采用除子/线丛语言：对象是光滑射影曲线与曲面，
// 工具是 Riemann-Roch 型公式、伴随公式、交理论、吹胀与极小模型、Kodaira 维数分类。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ALGEBRAIC_GEOMETRY_CURVES_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 除子、线性等价与 Picard 群。
    "divisor-linear-equivalence-picard": {
        id: "divisor-linear-equivalence-picard", l2Key: "algebraic-geometry-curves", name: "除子、线性等价与 Picard 群", kind: "object",
        aliases: ["除子", "divisor", "线性等价", "linear equivalence", "Picard群", "Picard group"],
    },
    // 曲线的 Riemann-Roch 定理。
    "riemann-roch-curve": {
        id: "riemann-roch-curve", l2Key: "algebraic-geometry-curves", name: "曲线的 Riemann-Roch 定理", kind: "theorem",
        aliases: ["Riemann-Roch定理", "黎曼-罗赫定理", "曲线Riemann-Roch"],
    },
    // 典范除子与典范嵌入。
    "canonical-divisor-embedding": {
        id: "canonical-divisor-embedding", l2Key: "algebraic-geometry-curves", name: "典范除子与典范嵌入", kind: "theorem",
        aliases: ["典范除子", "canonical divisor", "典范类", "典范嵌入", "canonical embedding"],
    },
    // Riemann-Hurwitz 公式。
    "riemann-hurwitz-formula": {
        id: "riemann-hurwitz-formula", l2Key: "algebraic-geometry-curves", name: "Riemann-Hurwitz 公式", kind: "formula",
        aliases: ["Riemann-Hurwitz公式", "Hurwitz公式", "Riemann-Hurwitz formula"],
    },
    // Weierstrass 点与数值半群。
    "weierstrass-points-semigroup": {
        id: "weierstrass-points-semigroup", l2Key: "algebraic-geometry-curves", name: "Weierstrass 点与数值半群", kind: "theorem",
        aliases: ["Weierstrass点", "Weierstrass point", "Weierstrass半群", "数值半群", "numerical semigroup"],
    },
    // 椭圆曲线的群律。
    "elliptic-curve-group-law": {
        id: "elliptic-curve-group-law", l2Key: "algebraic-geometry-curves", name: "椭圆曲线的群律", kind: "theorem",
        aliases: ["椭圆曲线群律", "elliptic curve group law", "弦切法", "Weierstrass方程"],
    },
    // 曲线正规化与 δ 不变量。
    "curve-normalization-delta-invariant": {
        id: "curve-normalization-delta-invariant", l2Key: "algebraic-geometry-curves", name: "曲线正规化与 δ 不变量", kind: "theorem",
        aliases: ["曲线正规化", "normalization", "δ不变量", "delta invariant", "几何亏格"],
    },
    // Clifford 定理与特殊除子。
    "clifford-theorem": {
        id: "clifford-theorem", l2Key: "algebraic-geometry-curves", name: "Clifford 定理与特殊除子", kind: "theorem",
        aliases: ["Clifford定理", "Clifford theorem", "特殊除子", "special divisor"],
    },
    // 伴随公式。
    "adjunction-formula": {
        id: "adjunction-formula", l2Key: "algebraic-geometry-curves", name: "伴随公式", kind: "formula",
        aliases: ["伴随公式", "adjunction formula", "曲面上曲线亏格公式"],
    },
    // 曲面上的交数与自交数。
    "intersection-number-self-intersection": {
        id: "intersection-number-self-intersection", l2Key: "algebraic-geometry-curves", name: "曲面上的交数与自交数", kind: "object",
        aliases: ["交数", "intersection number", "自交数", "self-intersection"],
    },
    // 吹胀与例外曲线。
    "blow-up-exceptional-curve": {
        id: "blow-up-exceptional-curve", l2Key: "algebraic-geometry-curves", name: "吹胀与例外曲线", kind: "algorithm",
        aliases: ["吹胀", "blow-up", "blowup", "例外曲线", "exceptional curve"],
    },
    // 曲面的 Riemann-Roch 与 Noether 公式。
    "surface-riemann-roch-noether": {
        id: "surface-riemann-roch-noether", l2Key: "algebraic-geometry-curves", name: "曲面的 Riemann-Roch 与 Noether 公式", kind: "formula",
        aliases: ["曲面Riemann-Roch", "surface Riemann-Roch", "Noether公式", "Noether formula"],
    },
    // Hodge 指标定理与 Néron-Severi 群。
    "hodge-index-neron-severi": {
        id: "hodge-index-neron-severi", l2Key: "algebraic-geometry-curves", name: "Hodge 指标定理与 Néron-Severi 群", kind: "theorem",
        aliases: ["Hodge指标定理", "Hodge index theorem", "Néron-Severi群", "Neron-Severi群"],
    },
    // Castelnuovo 收缩判据与极小模型。
    "castelnuovo-contraction-criterion": {
        id: "castelnuovo-contraction-criterion", l2Key: "algebraic-geometry-curves", name: "Castelnuovo 收缩判据与极小模型", kind: "criterion",
        aliases: ["Castelnuovo判据", "Castelnuovo contraction", "极小模型", "minimal model"],
    },
    // Kodaira 维数与 Enriques 分类。
    "kodaira-dimension-enriques-classification": {
        id: "kodaira-dimension-enriques-classification", l2Key: "algebraic-geometry-curves", name: "Kodaira 维数与 Enriques 分类", kind: "theorem",
        aliases: ["Kodaira维数", "Kodaira dimension", "Enriques分类", "Enriques-Kodaira classification"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const ALGEBRAIC_GEOMETRY_CURVES_L3_RULES: Record<string, MathV2L3Rules> = {
    // 除子、线性等价与 Picard 群。
    "divisor-linear-equivalence-picard": {
        definitions: ["除子是曲线（或曲面）上余维一子簇的形式整系数组合，线性等价把主除子视为零，商群即 Picard 群；它把线丛的分类翻译成除子的加法运算。"],
        formulas: ["曲线除子：D = Σ_P n_P P（n_P ∈ Z，有限支撑），deg D = Σ n_P。", "主除子：div(f) = Σ_P ord_P(f) P（f ∈ K(X)^*），光滑射影曲线上 deg div(f) = 0。", "线性等价：D ~ D' ⇔ D - D' = div(f)；Pic(X) = Div(X)/{主除子} ≅ {线丛同构类}。", "次数正合列：0 → Pic^0(X) → Pic(X) →^deg Z → 0；对亏格 g 曲线 Pic^0(X) ≅ Jac(X)（g 维 Abel 簇）。", "线性系：|D| = { D' ≥ 0 : D' ~ D } ≅ P(L(D))，dim|D| = l(D) - 1，L(D) = { f : div(f) + D ≥ 0 } ∪ {0}。"],
        theorems: ["光滑射影曲线上主除子次数为零，故 deg 在线性等价类上良定；从而 D ~ D' ⇒ deg D = deg D'。", "除子类群与线丛群同构：Pic(X) ≅ H^1(X, O_X^*)，D ↦ O_X(D)，且 O_X(D+D') ≅ O_X(D) ⊗ O_X(D')。", "Abel-Jacobi 定理：Pic^0(X) ≅ Jac(X) = H^0(X, Ω)^*/H_1(X, Z)，Abel 定理给出 D ~ 0 的周期判据。"],
        generalRequirements: ["必须先声明曲线光滑射影且不可约，否则 deg div(f) = 0 与 Pic 的除子描述都可能失效。", "必须区分除子 D、除子类 [D]、线性系 |D| 与线丛 O_X(D) 四个对象，不能混用记号。"],
        forbiddenErrors: ["【次数不变性误用】在非完备（仿射）曲线上断言主除子次数为零。", "【维数差一错误】写 dim|D| = l(D) 而漏掉射影化带来的减一。", "【等价与相等混淆】由 D ~ D' 断言 D = D'。", "【有效性遗漏】计算 |D| 时未要求成员为有效除子。", "【奇异曲线滥用】对奇异曲线直接使用 Pic ≅ 线丛群而不区分 Cartier 与 Weil 除子。"],
        parameterConstraints: { smoothProjective: "除子理论的标准结论要求曲线光滑、射影、不可约。", degreeZeroPrincipal: "主除子必须次数为零（完备曲线）。", effectiveInLinearSystem: "|D| 的元素必须有效。" },
        closureChecks: ["写出除子并核对次数与支撑有限性。", "验证所用等价是线性等价（给出显式有理函数）。", "把结论翻译回线丛或线性系语言并核对维数关系 dim|D| = l(D) - 1。"],
        scenarioChecks: { computePicOfP1: ["P^1 上 Pic ≅ Z 由次数给出，任意次数相同的除子线性等价。"], ellipticCurveTranslation: ["椭圆曲线上用 Pic^0 ≅ E 把除子类翻译为点。"], divisorOfRationalFunction: ["给定有理函数时逐点计算 ord_P 得到 div(f) 并检验次数为零。"] },
    },
    // 曲线的 Riemann-Roch 定理。
    "riemann-roch-curve": {
        definitions: ["Riemann-Roch 定理给出光滑射影曲线上除子 D 的线性系维数 l(D) 与其“对偶亏损” l(K-D) 的精确差值，是曲线理论中把几何量（次数、亏格）与代数量（截面维数）联系起来的核心公式。"],
        formulas: ["Riemann-Roch：l(D) - l(K - D) = deg D + 1 - g，其中 K 为典范除子、g 为亏格。", "上同调形式：χ(O_X(D)) = h^0(D) - h^1(D) = deg D + 1 - g，配合 Serre 对偶 h^1(D) = h^0(K - D)。", "基本数据：deg K = 2g - 2，l(K) = g，l(O_X) = 1。", "Riemann 不等式（弱形式）：l(D) ≥ deg D + 1 - g。", "消失判据：deg D > 2g - 2 ⇒ l(K - D) = 0 ⇒ l(D) = deg D + 1 - g；deg D < 0 ⇒ l(D) = 0。"],
        theorems: ["Riemann-Roch 定理对任意除子成立，等号形式给出 l(D) 的完全确定条件（当 l(K-D) 已知）。", "推论：g = 0 ⇔ 存在 deg 1 的除子使 l(D) = 2 ⇔ X ≅ P^1；g = 1 ⇒ K ~ 0。", "推论（嵌入判据）：deg D ≥ 2g + 1 ⇒ |D| 无基点且给出闭嵌入 X ↪ P^{deg D - g}。"],
        generalRequirements: ["必须明确 g 与 K 的取值并核对 deg K = 2g - 2 的自洽性。", "只有在论证 l(K - D) = 0（例如 deg D > 2g - 2）之后才能把 Riemann-Roch 用作 l(D) 的显式公式。"],
        forbiddenErrors: ["【特殊项遗漏】直接写 l(D) = deg D + 1 - g 而不验证 l(K-D) = 0。", "【符号错误】写成 deg D + 1 + g 或 deg D - 1 + g。", "【典范次数错误】使用 deg K = 2g + 2 或 g - 2。", "【负次数误算】对 deg D < 0 给出 l(D) > 0。", "【奇异/非完备滥用】在奇异或仿射曲线上直接套用光滑射影版本。"],
        parameterConstraints: { smoothProjectiveCurve: "定理要求光滑射影不可约曲线（域上完备）。", canonicalDegree: "deg K = 2g - 2 必须自洽。", specialTermVanishing: "显式求 l(D) 需 l(K-D) = 0，通常由 deg D > 2g-2 保证。" },
        closureChecks: ["写出 g、deg D 与 deg K 并核对 Riemann-Roch 两侧。", "判断除子是否特殊（l(K-D) 是否为零）并说明理由。", "用极端情形（D = 0、D = K）检验公式自洽。"],
        scenarioChecks: { computeGenusFromSections: ["由 l(K) = g 或 χ 计算亏格。"], embeddingByLinearSystem: ["deg D ≥ 2g+1 时用 Riemann-Roch 得到嵌入维数。"], lowGenusClassification: ["g = 0, 1, 2 的分类结论直接由 Riemann-Roch 的小次数情形给出。"] },
    },
    // 典范除子与典范嵌入。
    "canonical-divisor-embedding": {
        definitions: ["典范除子是曲线上微分形式的除子类，典范映射由 |K| 给出；它的行为（是否为嵌入）把曲线分为有理、椭圆、超椭圆与非超椭圆四类，是曲线内蕴分类的第一工具。"],
        formulas: ["典范除子：K = div(ω)（ω 为非零有理微分），deg K = 2g - 2，l(K) = g，h^0(Ω_X) = g。", "典范映射：φ_K : X → P^{g-1}，由 |K| 的基 ω_1,...,ω_g 给出。", "平面曲线的典范除子：C ⊂ P^2 次数 d 光滑时 K_C = (d-3)·(直线截除子)，g = (d-1)(d-2)/2。", "超椭圆判据：g ≥ 2 时 X 超椭圆 ⇔ 存在 deg 2 除子 D 使 l(D) = 2 ⇔ φ_K 是 2:1 到有理正规曲线的映射。", "典范环与 Noether 定理：非超椭圆时 |K| 的像是次数 2g-2 的射影正规曲线，且典范环由 2 次与 3 次生成。"],
        theorems: ["g ≥ 2 时 |K| 无基点；非超椭圆时 φ_K 是闭嵌入，超椭圆时 φ_K 是到有理正规曲线的二重覆盖。", "g = 0 时 deg K = -2、l(K) = 0（无有效典范除子）；g = 1 时 K ~ 0，φ_K 退化为常映射。", "Noether 定理：非超椭圆典范曲线是射影正规的，其齐次坐标环由二次型生成（除 g = 3 平面四次与三角形曲线等经典例外情形需按 Petri 定理讨论）。"],
        generalRequirements: ["必须先按 g = 0、g = 1、g ≥ 2 分情形，再判断 |K| 是否无基点、是否给出嵌入。", "使用典范嵌入结论前必须判定曲线是否超椭圆。"],
        forbiddenErrors: ["【超椭圆遗漏】对 g ≥ 2 曲线直接断言 φ_K 是嵌入。", "【低亏格滥用】对 g ≤ 1 使用 φ_K : X → P^{g-1} 的嵌入结论。", "【典范次数错误】写 deg K = 2g + 2 或 g - 1。", "【平面曲线公式错误】把 K_C 写成 (d-2) 或 (d-1) 倍直线类。", "【像维数错误】把典范像放在 P^g 而非 P^{g-1}。"],
        parameterConstraints: { genusRange: "嵌入结论要求 g ≥ 3 且非超椭圆（g = 2 必超椭圆）。", canonicalDegree: "deg K = 2g - 2、l(K) = g。", targetDimension: "典范映射的目标空间是 P^{g-1}。" },
        closureChecks: ["计算 g 与 deg K 并核对 l(K) = g。", "判定是否超椭圆并据此说明 φ_K 的性质。", "如为平面曲线，用 K = (d-3)H 检验与亏格-次数公式一致。"],
        scenarioChecks: { genusTwoCurve: ["g = 2 必为超椭圆，φ_K 是到 P^1 的二重覆盖。"], planeQuarticGenus3: ["平面光滑四次曲线 g = 3 非超椭圆，典范嵌入即原平面嵌入。"], hyperellipticDetection: ["寻找 deg 2 且 l = 2 的除子以判定超椭圆性。"] },
    },
    // Riemann-Hurwitz 公式。
    "riemann-hurwitz-formula": {
        definitions: ["Riemann-Hurwitz 公式描述曲线间有限态射两端亏格与分歧数据的关系，把覆盖的拓扑复杂度化为分歧指数之和。"],
        formulas: ["Riemann-Hurwitz：2g_X - 2 = n(2g_Y - 2) + Σ_{P ∈ X} (e_P - 1)，其中 f : X → Y 次数 n、e_P 为分歧指数（特征零或驯服分歧）。", "等价形式：K_X = f^*K_Y + R，R = Σ (e_P - 1) P 为分歧除子。", "非驯服（野）分歧情形：e_P - 1 需换成 d_P = ord_P(不同式) ≥ e_P（char p | e_P 时严格大于）。", "分歧点上的关系：Σ_{P ↦ Q} e_P = n（对每个 Q ∈ Y）。", "Hurwitz 自同构界：g ≥ 2 ⇒ |Aut(X)| ≤ 84(g - 1)。"],
        theorems: ["Riemann-Hurwitz 公式对光滑射影曲线间的有限可分态射成立；驯服分歧下分歧项为 Σ(e_P - 1)。", "推论：不存在从低亏格到高亏格的非常态射（g_X ≥ g_Y），即亏格在有限覆盖下不降。", "Hurwitz 定理：g ≥ 2 曲线的自同构群有限且不超过 84(g-1)，由 Riemann-Hurwitz 对商映射的分析得到。"],
        generalRequirements: ["必须给出覆盖次数 n 与所有分歧点的分歧指数，并用 Σ_{P↦Q} e_P = n 交叉验证。", "必须声明特征与分歧是否驯服；野分歧时改用不同式指数。"],
        forbiddenErrors: ["【分歧项符号错误】写 Σ(e_P + 1) 或漏减一。", "【次数因子遗漏】把 n(2g_Y - 2) 写成 2g_Y - 2。", "【野分歧滥用】在 char p | e_P 时仍用 e_P - 1。", "【纤维度数不自洽】各点分歧指数之和不等于 n。", "【方向反用】把 g_X 与 g_Y 位置互换导致亏格下降结论。"],
        parameterConstraints: { finiteSeparableMorphism: "f 必须是有限可分态射且 X、Y 光滑射影。", degreeConsistency: "每个纤维的 Σ e_P = n。", tameRamification: "标准分歧项 e_P - 1 需驯服分歧假设。" },
        closureChecks: ["列出全部分歧点与指数并逐纤维核对 Σ e_P = n。", "代入公式核对左右两侧的偶数性与符号。", "必要时用 K_X = f^*K_Y + R 复核分歧除子次数。"],
        scenarioChecks: { hyperellipticDoubleCover: ["超椭圆曲线作为 P^1 的二重覆盖，2g - 2 = 2(-2) + (分歧点数)，得分歧点数 2g + 2。"], automorphismBound: ["估计自同构群阶时对商曲线用 Riemann-Hurwitz。"], unramifiedCover: ["无分歧覆盖给出 g_X - 1 = n(g_Y - 1)。"] },
    },
    // Weierstrass 点与数值半群。
    "weierstrass-points-semigroup": {
        definitions: ["Weierstrass 点是典范线性系在该点的阶数序列异常的点，其极点半群（数值半群）刻画了在该点有极点的函数的可能阶数，是曲线上离散的内蕴特殊点。"],
        formulas: ["空隙序列：P 处存在 g 个空隙 1 = α_1 < ... < α_g ≤ 2g - 1，α 是空隙 ⇔ l(αP) = l((α-1)P)。", "极点半群：H(P) = { n ≥ 0 : 存在 f 以 P 为唯一极点且 ord_P(f) = -n }，与空隙集互补，|N \\ H(P)| = g。", "Weierstrass 点判据：P 是 Weierstrass 点 ⇔ l(gP) ≥ 2 ⇔ 空隙序列 ≠ (1,2,...,g)。", "Weierstrass 权：w(P) = Σ_{i=1}^g (α_i - i)，且 Σ_{P} w(P) = (g-1)g(g+1)（特征零）。", "Weierstrass 点个数：2g + 2 ≤ #{Weierstrass 点} ≤ (g-1)g(g+1)（g ≥ 2）。"],
        theorems: ["g ≥ 2 曲线上 Weierstrass 点存在且个数有限，总权由 (g-1)g(g+1) 给出（特征零；正特征需另行处理）。", "超椭圆曲线的 Weierstrass 点恰为二重覆盖的 2g+2 个分歧点，半群为 ⟨2, 2g+1⟩。", "极点集构成数值半群（含 0、对加法封闭、Frobenius 数有限），其亏格（空隙数）等于曲线亏格。"],
        generalRequirements: ["必须限定 g ≥ 2（g ≤ 1 时无 Weierstrass 点）。", "必须用 Riemann-Roch 判定空隙（比较 l(nP) 与 l((n-1)P)），不能凭直觉给出半群。"],
        forbiddenErrors: ["【空隙数错误】给出的空隙个数不等于 g。", "【半群非封闭】给出的极点集合对加法不封闭或不含 0。", "【空隙上界错误】允许空隙超过 2g - 1。", "【低亏格滥用】对 g ≤ 1 讨论 Weierstrass 点。", "【总权公式错误】写成 g(g+1)(g+2) 或忽略特征零假设。"],
        parameterConstraints: { genusAtLeastTwo: "Weierstrass 点理论要求 g ≥ 2。", gapCount: "空隙恰 g 个且都 ≤ 2g - 1。", semigroupClosure: "H(P) 含 0 且对加法封闭。" },
        closureChecks: ["逐个 n 用 Riemann-Roch 判定空隙并核对空隙数为 g。", "验证所得半群对加法封闭且与空隙互补。", "如需计数，核对总权公式与特征假设。"],
        scenarioChecks: { hyperellipticSemigroup: ["超椭圆情形半群为 ⟨2, 2g+1⟩，Weierstrass 点为分歧点。"], countWeierstrassPoints: ["用总权 (g-1)g(g+1) 与各点权估计点数。"], monomialCurveSemigroup: ["由数值半群构造单项式曲线并读出亏格（空隙数）。"] },
    },
    // 椭圆曲线的群律。
    "elliptic-curve-group-law": {
        definitions: ["椭圆曲线是带有指定有理点的亏格一光滑射影曲线，其点集通过 Pic^0 的同构获得阿贝尔群结构，几何上由弦切法实现。"],
        formulas: ["Weierstrass 长方程：y^2 + a_1xy + a_3y = x^3 + a_2x^2 + a_4x + a_6；char ≠ 2,3 时可化为 y^2 = x^3 + Ax + B。", "光滑性判据：Δ = -16(4A^3 + 27B^2) ≠ 0（短方程），j = 1728·4A^3/(4A^3 + 27B^2)。", "群同构：E(k) → Pic^0(E)，P ↦ [P - O]；三点共线 ⇔ P + Q + R = O。", "加法公式（短方程，P ≠ ±Q）：λ = (y_2 - y_1)/(x_2 - x_1)，x_3 = λ^2 - x_1 - x_2，y_3 = λ(x_1 - x_3) - y_1。", "倍点公式：λ = (3x_1^2 + A)/(2y_1)，其余同上；-（x,y) = (x, -y)（短方程）。", "K_E ~ 0，l(nO) = n（n ≥ 1），故 |3O| 给出到 P^2 的三次嵌入。"],
        theorems: ["弦切法给出的运算满足群公理，其结合律由与 Pic^0(E) 的同构（Abel 定理）给出，而非直接代数验证。", "亏格一曲线带有理点 ⇔ 可由 Riemann-Roch 用 |3O| 嵌入为 P^2 中光滑三次曲线（Weierstrass 形式）。", "Mordell-Weil 定理：数域上 E(K) 是有限生成阿贝尔群 E(K) ≅ Z^r ⊕ E(K)_tors。"],
        generalRequirements: ["必须先验证曲线光滑（Δ ≠ 0）并指定无穷远点 O 作为单位元。", "必须区分短方程适用的特征（char ≠ 2, 3）与一般长方程情形。"],
        forbiddenErrors: ["【奇异曲线滥用】对 Δ = 0 的三次曲线使用椭圆曲线群律（此时为节点/尖点三次曲线，群结构不同）。", "【单位元遗漏】不指定 O 就谈群结构。", "【共线关系错误】写 P + Q + R = O 时未取第三交点的反射（把交点直接当作和）。", "【特征滥用】在 char 2 或 3 使用短 Weierstrass 方程与判别式公式。", "【结合律误证】声称结合律可由加法公式直接显然得到而不引用 Pic^0 同构或严格验证。"],
        parameterConstraints: { smoothnessDiscriminant: "Δ ≠ 0（等价于三次曲线光滑）。", markedPoint: "必须指定基点 O ∈ E(k) 作为群单位元。", characteristicRestriction: "短方程与 j 公式要求 char ≠ 2, 3。" },
        closureChecks: ["核对判别式非零与基点选取。", "用弦切法公式计算并验证结果点仍在曲线上。", "必要时用 Pic^0 同构解释群公理（尤其结合律）。"],
        scenarioChecks: { torsionPointComputation: ["有理挠点计算配合 Nagell-Lutz 判据。"], threeCollinearPoints: ["三点共线条件用于验证 P + Q + R = O。"], isomorphismByJInvariant: ["判断两椭圆曲线是否同构时比较 j 不变量（代数闭域）。"] },
    },
    // 曲线正规化与 δ 不变量。
    "curve-normalization-delta-invariant": {
        definitions: ["正规化把奇异曲线替换为唯一的光滑双有理模型，δ 不变量度量每个奇点使算术亏格超出几何亏格的量，从而把奇异曲线的亏格分解为光滑部分与局部奇点贡献。"],
        formulas: ["正规化：ν : X~ → X，X~ 光滑且 ν 有限双有理；局部为整闭化 O~_P。", "亏格关系：p_a(X) = g(X~) + Σ_{P 奇点} δ_P。", "δ 不变量：δ_P = dim_k (O~_P / O_P)；节点 δ = 1，普通尖点 δ = 1，普通 r 重点 δ = r(r-1)/2。", "平面曲线：p_a = (d-1)(d-2)/2，故 g(X~) = (d-1)(d-2)/2 - Σ δ_P。", "Milnor 数关系（平面曲线奇点）：μ_P = 2δ_P - r_P + 1（r_P 为分支数）。"],
        theorems: ["正规化存在且唯一（在双有理等价类中由整闭化给出），曲线情形正规化即为奇点消解。", "亏格公式 p_a = g + Σδ_P 成立；因此有理性判据为 Σ δ_P = (d-1)(d-2)/2（平面次数 d 曲线有理 ⇔ 奇点贡献用尽算术亏格）。", "光滑射影模型在曲线情形唯一：两条双有理的光滑射影曲线必同构。"],
        generalRequirements: ["必须区分算术亏格 p_a（由次数/上同调给出）与几何亏格 g（正规化后的亏格）。", "必须逐个奇点计算 δ_P 并说明奇点类型（节点、尖点、多重点）。"],
        forbiddenErrors: ["【亏格混用】把 (d-1)(d-2)/2 直接当作奇异曲线的几何亏格。", "【δ 值错误】把普通 r 重点的 δ 写成 r 或 r(r+1)/2。", "【符号错误】写 p_a = g - Σδ_P。", "【正规化非双有理误设】声称正规化会改变函数域。", "【高维推广滥用】把“正规化 = 奇点消解”这一曲线特有结论套到曲面。"],
        parameterConstraints: { integralCurve: "曲线需既约不可约（否则需按分支处理）。", deltaNonnegative: "δ_P ≥ 0，且 δ_P = 0 ⇔ P 光滑。", planeGenusFormula: "平面曲线用 p_a = (d-1)(d-2)/2。" },
        closureChecks: ["列出所有奇点与其类型并计算 δ_P。", "用 p_a = g + Σδ_P 求几何亏格并核对非负。", "如判定有理性，验证 g = 0 而非仅 p_a 减去部分奇点贡献。"],
        scenarioChecks: { nodalCubicIsRational: ["节点三次曲线 p_a = 1、δ = 1 ⇒ g = 0，故有理并可参数化。"], countSingularitiesFromGenus: ["已知几何亏格时反推奇点 δ 之和。"], resolveCuspidalCurve: ["尖点曲线通过正规化得到光滑模型并计算亏格。"] },
    },
    // Clifford 定理与特殊除子。
    "clifford-theorem": {
        definitions: ["特殊除子指 l(K - D) > 0 的有效除子，Clifford 定理给出这类除子上 l(D) 的上界，刻画曲线线性系维数在特殊情形下受限的程度。"],
        formulas: ["Clifford：D 有效且特殊（l(K-D) > 0）⇒ l(D) ≤ deg D / 2 + 1，即 dim|D| ≤ deg D / 2。", "等号情形：l(D) = deg D/2 + 1 ⇔ D = 0、D = K，或 X 超椭圆且 D 是超椭圆类的倍数。", "Clifford 指标：Cliff(D) = deg D - 2(l(D) - 1)，Cliff(X) = min{ Cliff(D) : l(D) ≥ 2, l(K-D) ≥ 2 }。", "gonality 关系：Cliff(X) ≤ gon(X) - 2，且 gon(X) ≤ ⌊(g+3)/2⌋。", "非特殊情形对照（Riemann-Roch）：l(K-D) = 0 ⇒ l(D) = deg D + 1 - g。"],
        theorems: ["Clifford 定理：有效特殊除子满足 l(D) ≤ deg D/2 + 1，等号仅在 0、K 与超椭圆倍数情形出现。", "推论：非超椭圆曲线上特殊除子的维数严格小于上界，这是 Brill-Noether 与 Petri 理论的出发点。", "Brill-Noether 存在性：ρ = g - (r+1)(g - d + r) ≥ 0 时一般曲线上存在 deg d、dim ≥ r 的线性系（Clifford 给出与之互补的上界约束）。"],
        generalRequirements: ["必须先验证 D 有效且特殊；非特殊除子应直接用 Riemann-Roch 而非 Clifford。", "讨论等号必须检查是否为 0、K 或超椭圆类的倍数。"],
        forbiddenErrors: ["【特殊性遗漏】对非特殊除子使用 Clifford 上界并当作最优。", "【有效性遗漏】对非有效除子套用定理。", "【上界形式错误】写 l(D) ≤ deg D/2 或 deg D + 1。", "【等号条件错误】声称任意超椭圆曲线上所有除子都取等号。", "【与 Riemann-Roch 混用】把 Clifford 不等式当作等式求 l(D)。"],
        parameterConstraints: { effectiveSpecial: "D 有效且 l(K-D) > 0。", boundForm: "上界为 deg D/2 + 1（dim|D| ≤ deg D/2）。", equalityCases: "等号仅 D = 0、D = K 或超椭圆类倍数。" },
        closureChecks: ["验证 D 有效并计算 l(K-D) 以确认特殊性。", "核对不等式方向与 deg D/2 + 1 的形式。", "若接近等号，检查超椭圆性或 D ∈ {0, K}。"],
        scenarioChecks: { boundLinearSystemDimension: ["估计特殊线性系维数上界时用 Clifford。"], hyperellipticEqualityCase: ["超椭圆曲线上 D = m·(超椭圆类) 给出等号。"], gonalityEstimate: ["由 Clifford 指标估计 gonality 下界。"] },
    },
    // 伴随公式。
    "adjunction-formula": {
        definitions: ["伴随公式把光滑曲面上曲线的典范类与曲面典范类联系起来，从而由交数计算曲线亏格，是曲面几何与曲线亏格之间的桥梁。"],
        formulas: ["伴随公式（光滑曲线 C ⊂ 光滑曲面 S）：K_C = (K_S + C)|_C，故 2g(C) - 2 = C·(C + K_S) = C^2 + C·K_S。", "算术亏格形式（C 为有效除子，允许奇异）：p_a(C) = 1 + (C^2 + C·K_S)/2。", "余法丛形式：ω_C ≅ ω_S ⊗ O_S(C)|_C，即 K_C = (K_S + C)|_C。", "P^2 特例：K_{P^2} = -3H、C = dH ⇒ 2g - 2 = d^2 - 3d，g = (d-1)(d-2)/2。", "P^1×P^1 特例：K = -2(F_1 + F_2)，C 为 (a,b) 型 ⇒ p_a = (a-1)(b-1)。"],
        theorems: ["伴随公式对光滑曲面上的光滑曲线给出 K_C 的精确表达式，从而亏格完全由交数决定。", "对奇异曲线该公式给出算术亏格 p_a，几何亏格需再减去奇点 δ 不变量之和。", "推论（例外曲线的亏格）：S 上 C ≅ P^1 且 C^2 = -1 ⇒ C·K_S = -1，这是 (-1)-曲线的数值刻画。"],
        generalRequirements: ["必须区分光滑曲线（得几何亏格）与一般有效除子（得算术亏格）。", "必须给出 K_S 与所有交数 C^2、C·K_S 的具体取值。"],
        forbiddenErrors: ["【因子二遗漏】写 p_a = 1 + C^2 + C·K_S 而漏除以 2。", "【奇点修正遗漏】对奇异曲线把 p_a 当作几何亏格。", "【典范类符号错误】把 K_{P^2} 写成 3H。", "【适用范围滥用】在奇异曲面上直接使用光滑情形的伴随公式。", "【非整值忽视】计算得到 p_a 非整数却不回查交数错误。"],
        parameterConstraints: { smoothSurface: "S 需光滑（射影）曲面。", curveSmoothnessForGenus: "几何亏格结论要求 C 光滑。", intersectionNumbersKnown: "需已知 C^2 与 C·K_S。" },
        closureChecks: ["写出 K_S 并计算 C^2、C·K_S。", "代入公式并检验 p_a 为整数、非负（若 C 不可约）。", "如 C 奇异，用 g = p_a - Σδ_P 得到几何亏格。"],
        scenarioChecks: { planeCurveGenus: ["P^2 中次数 d 光滑曲线由伴随公式得 g = (d-1)(d-2)/2。"], curveOnQuadric: ["P^1×P^1 上 (a,b) 型曲线得 p_a = (a-1)(b-1)。"], exceptionalCurveCheck: ["用 C^2 = C·K_S = -1 验证 (-1)-曲线。"] },
    },
    // 曲面上的交数与自交数。
    "intersection-number-self-intersection": {
        definitions: ["光滑射影曲面上的交数是除子类之间的对称双线性配对，自交数由线性等价移动到一般位置（或用线丛的次数）定义；它使曲面几何可以完全用数值不变量计算。"],
        formulas: ["交配对：Pic(S) × Pic(S) → Z，(C, D) ↦ C·D，对称、双线性、在线性等价类上良定。", "局部交数：C、D 无公共分支时 C·D = Σ_{P ∈ C ∩ D} m_P(C, D)（m_P 为局部相交重数），横截相交时即交点个数。", "自交数：C^2 = C·C'（C' ~ C 与 C 一般位置），也等于 deg(O_S(C)|_C) 或 deg(法丛)。", "P^2：H^2 = 1，故 (dH)·(eH) = de（Bézout）。P^1×P^1：F_1^2 = F_2^2 = 0，F_1·F_2 = 1。", "投影公式：f : S' → S 时 f^*C · f^*D = deg(f) · (C·D)；f^*C · E' = C · f_*E'。", "数值等价：C ≡ 0 ⇔ C·D = 0 对所有 D；Num(S) = Pic(S)/≡ 是无挠有限秩格。"],
        theorems: ["交数存在且唯一：由线丛的 Euler 特征二次型（C·D = χ(O_S) - χ(-C) - χ(-D) + χ(-C-D)）唯一确定，与移动选择无关。", "自交数可为负（例外曲线 C^2 = -1，Hirzebruch 曲面的截面可有任意负自交），故不能按“交点个数”直觉解释。", "投影公式与吹胀公式：π : S~ → S 在一点吹胀时 E^2 = -1、π^*C·E = 0、π^*C·π^*D = C·D。"],
        generalRequirements: ["必须在光滑射影曲面上并使用线性等价类上的良定配对，移动曲线时说明所用的等价。", "必须区分横截相交（交点计数）与带重数的局部交数。"],
        forbiddenErrors: ["【负自交否认】断言 C^2 ≥ 0 总成立或把 C^2 解释为交点个数。", "【重数遗漏】只数交点个数而忽略切触/奇点带来的重数。", "【公共分支直接相加】对有公共分支的曲线直接用局部交点求和。", "【投影公式误用】写 f^*C·f^*D = C·D 而漏 deg f 因子。", "【等价类外良定误设】用未经线性等价规范化的具体曲线声称交数不变。"],
        parameterConstraints: { smoothProjectiveSurface: "配对定义要求 S 光滑射影曲面。", bilinearSymmetric: "交数对称且双线性，在线性等价下不变。", multiplicityCounting: "无公共分支时交数为局部重数之和。" },
        closureChecks: ["写出所用除子类基（如 H、F_i、E_j）与它们的交表。", "计算交数并核对对称性与已知特例（Bézout、E^2 = -1）。", "如有公共分支，先用线性等价移动或改用上同调定义。"],
        scenarioChecks: { bezoutOnP2: ["P^2 上用 H^2 = 1 复现 Bézout 定理。"], blowUpIntersectionTable: ["吹胀后用 E^2 = -1、π^*C·E = 0 计算新交表。"], numericalClassRank: ["计算 Picard 数与交形式签名时用 Num(S)。"] },
    },
    // 吹胀与例外曲线。
    "blow-up-exceptional-curve": {
        definitions: ["点的吹胀把曲面上一点替换为该点切方向的射影线，得到双有理态射；例外曲线是这条 (-1)-曲线，吹胀与其逆（收缩）构成曲面双有理几何的基本操作。"],
        formulas: ["吹胀：π : S~ → S 在点 p 处，E = π^{-1}(p) ≅ P^1，E^2 = -1，K_{S~} = π^*K_S + E。", "Picard 群：Pic(S~) ≅ π^*Pic(S) ⊕ Z·E，交数由 π^*C·π^*D = C·D、π^*C·E = 0、E^2 = -1 给出。", "全变换与严格变换：π^*C = C~ + m_p(C)·E，其中 C~ 为严格变换、m_p(C) 为 C 在 p 处的重数。", "严格变换的交数：C~^2 = C^2 - m_p(C)^2，C~·K_{S~} = C·K_S + m_p(C)。", "亏格变化（伴随）：p_a(C~) = p_a(C) - m_p(C)(m_p(C) - 1)/2。", "数值不变量：χ(O_{S~}) = χ(O_S)，K_{S~}^2 = K_S^2 - 1，e(S~) = e(S) + 1。"],
        theorems: ["吹胀是双有理态射且在 E 外为同构；E 是 (-1)-曲线（E ≅ P^1，E^2 = -1）。", "Castelnuovo 判据（逆向）：光滑射影曲面上任意 (-1)-曲线都可收缩为光滑曲面上的一点。", "曲面双有理态射的结构：光滑射影曲面之间的双有理态射是有限次点吹胀的复合（Zariski）。"],
        generalRequirements: ["必须区分全变换 π^*C 与严格变换 C~，并给出重数 m_p(C)。", "必须使用 K_{S~} = π^*K_S + E 而非直接把 K 拉回。"],
        forbiddenErrors: ["【变换混淆】把 π^*C 当作严格变换直接用于交数计算。", "【自交修正遗漏】写 C~^2 = C^2 而不减 m_p^2。", "【典范类公式错误】写 K_{S~} = π^*K_S - E。", "【例外曲线自交错误】声称 E^2 = 1 或 0。", "【χ 变化误设】认为吹胀改变 χ(O_S)（实际不变，改变的是 K^2 与 Euler 数）。"],
        parameterConstraints: { smoothPoint: "吹胀点需为光滑曲面上的点（标准情形）。", exceptionalSelfIntersection: "E ≅ P^1 且 E^2 = -1。", multiplicityInput: "严格变换公式需 p 处重数 m_p(C)。" },
        closureChecks: ["写出 π^*C = C~ + m_p E 并据此计算交数。", "核对 E^2 = -1、K_{S~}^2 = K_S^2 - 1。", "用伴随公式复核严格变换的亏格变化。"],
        scenarioChecks: { resolveNodeOnCurve: ["吹胀节点使严格变换亏格降低 m(m-1)/2 = 1。"], blowUpP2ToHirzebruch: ["P^2 一点吹胀得 F_1，用新交表识别纤维与截面。"], contractMinusOneCurve: ["发现 (-1)-曲线时用 Castelnuovo 判据收缩以简化曲面。"] },
    },
    // 曲面的 Riemann-Roch 与 Noether 公式。
    "surface-riemann-roch-noether": {
        definitions: ["曲面 Riemann-Roch 用交数与 χ(O_S) 表达线丛的 Euler 特征，Noether 公式把 χ(O_S) 与 Chern 数 K^2、e 联系起来，两者共同构成曲面数值不变量的计算基础。"],
        formulas: ["曲面 Riemann-Roch：χ(O_S(D)) = χ(O_S) + (D·(D - K_S))/2，即 h^0 - h^1 + h^2 = χ(O_S) + (D^2 - D·K_S)/2。", "Noether 公式：χ(O_S) = (K_S^2 + e(S))/12，其中 e(S) 为拓扑 Euler 数 = Σ(-1)^i b_i。", "Hodge 分解下：χ(O_S) = 1 - q + p_g，q = h^1(O_S)（不规则性）、p_g = h^0(K_S)（几何亏格）。", "Serre 对偶：h^2(O_S(D)) = h^0(K_S - D)。", "多重亏格：P_n = h^0(nK_S)，用于定义 Kodaira 维数。"],
        theorems: ["曲面 Riemann-Roch 定理（Hirzebruch-Riemann-Roch 在维数 2 的特例）：χ(D) = χ(O_S) + (D^2 - D·K_S)/2。", "Noether 公式：12χ(O_S) = K_S^2 + e(S)，它对任意光滑射影曲面成立并在吹胀下自洽（K^2 减 1、e 加 1）。", "推论：由 χ(D) 与 Serre 对偶可给出 h^0(D) 的下界 h^0(D) ≥ χ(O_S) + (D^2 - D·K_S)/2 - h^0(K_S - D)。"],
        generalRequirements: ["必须区分 χ（Euler 特征，可算）与 h^0（需消失定理或额外论证）。", "必须给出 K_S、χ(O_S) 与相关交数，并用 Noether 公式交叉验证。"],
        forbiddenErrors: ["【χ 与 h^0 混用】把 χ(O_S(D)) 直接当作 h^0(D)。", "【符号错误】写 (D·(D + K_S))/2。", "【Noether 系数错误】写 χ = (K^2 + e)/6 或 (K^2 - e)/12。", "【Serre 对偶遗漏】计算 h^2 时不换成 h^0(K - D)。", "【吹胀不自洽】吹胀后 K^2 与 e 的变化未同时更新导致 Noether 公式失效。"],
        parameterConstraints: { smoothProjectiveSurface: "公式要求 S 光滑射影曲面。", noetherCoefficient: "12χ(O_S) = K_S^2 + e(S)。", eulerCharacteristicOnly: "Riemann-Roch 给出 χ，而非单个 h^i。" },
        closureChecks: ["列出 K_S、χ(O_S)、D^2、D·K_S 并代入公式。", "用 Noether 公式核对 K^2 与 e 的自洽性。", "用 Serre 对偶处理 h^2 项，必要时引用消失定理再谈 h^0。"],
        scenarioChecks: { computeChiOnP2: ["P^2 上 χ(O(d)) = (d+1)(d+2)/2 可由曲面 Riemann-Roch 复核。"], k3Invariants: ["K3 曲面 K = 0、χ(O) = 2、e = 24 满足 Noether 公式。"], boundSections: ["估计 h^0(D) 时结合 χ 与 h^0(K-D) 的上界。"] },
    },
    // Hodge 指标定理与 Néron-Severi 群。
    "hodge-index-neron-severi": {
        definitions: ["Néron-Severi 群是曲面除子类的数值等价商，Hodge 指标定理确定其上交形式的签名为 (1, ρ-1)，这使曲面的数值几何具有类似 Minkowski 空间的结构。"],
        formulas: ["NS(S) = Pic(S)/Pic^0(S)，秩 ρ(S) 为 Picard 数；Num(S) = NS(S)/挠。", "Hodge 指标定理：NS(S) ⊗ R 上交形式的签名为 (1, ρ - 1)。", "等价形式：若 H^2 > 0 且 D·H = 0、D ≢ 0，则 D^2 < 0。", "推论不等式：若 H^2 > 0，则对任意 D 有 (D·H)^2 ≥ D^2 · H^2（Cauchy-Schwarz 反向形式）。", "ρ 的界：ρ(S) ≤ b_2(S)；复曲面上 ρ ≤ h^{1,1}（Lefschetz (1,1) 类定理给出 NS 的刻画）。"],
        theorems: ["Hodge 指标定理：光滑射影曲面上交形式在 NS ⊗ R 上的签名为 (1, ρ-1)，即最多一个正方向。", "推论：与一个正自交类正交的非零类必有负自交，这解释了例外曲线与纤维类的负/零自交现象。", "Lefschetz (1,1) 定理：复曲面上 NS(S) ≅ H^2(S,Z) ∩ H^{1,1}(S)，从而 ρ ≤ h^{1,1}。"],
        generalRequirements: ["必须使用数值等价（而非线性等价）来讨论签名，先模去挠与 Pic^0。", "使用推论时必须先给出一个满足 H^2 > 0 的类（通常取丰沛类）。"],
        forbiddenErrors: ["【签名错误】写成 (ρ-1, 1) 或 (2, ρ-2)。", "【正定误设】断言交形式在 NS 上正定或负定。", "【正类遗漏】使用 D·H = 0 ⇒ D^2 < 0 时不验证 H^2 > 0。", "【等价混用】在 Pic 上（含 Pic^0 与挠）直接谈签名。", "【不等式方向反用】写 (D·H)^2 ≤ D^2 H^2。"],
        parameterConstraints: { smoothProjectiveSurface: "定理要求光滑射影曲面。", numericalEquivalence: "签名在 Num(S) ⊗ R 上表述。", positiveClassRequired: "推论需存在 H 使 H^2 > 0。" },
        closureChecks: ["确定 NS 的基与交矩阵。", "计算特征值符号并核对签名 (1, ρ-1)。", "如用推论，验证 H^2 > 0 与正交条件。"],
        scenarioChecks: { negativeSelfIntersectionProof: ["证明某类自交为负时用与丰沛类正交的 Hodge 指标推论。"], picardNumberBound: ["用 ρ ≤ h^{1,1} 估计 Picard 数。"], quadraticFormOnK3: ["K3 曲面 NS 格签名为 (1, ρ-1)，用于格论分类。"] },
    },
    // Castelnuovo 收缩判据与极小模型。
    "castelnuovo-contraction-criterion": {
        definitions: ["Castelnuovo 判据给出曲面上曲线可被收缩为光滑点的数值条件（(-1)-曲线），由此定义极小曲面并给出曲面极小模型纲领的基本步骤。"],
        formulas: ["Castelnuovo 判据：C ⊂ S 光滑射影曲面上 C ≅ P^1 且 C^2 = -1 ⇒ 存在光滑曲面 S' 与吹胀 π : S → S' 使 C 为例外曲线。", "等价数值刻画（由伴随公式）：C^2 = -1、C·K_S = -1、p_a(C) = 0。", "极小定义：S 极小 ⇔ S 上不存在 (-1)-曲线。", "极小化过程：反复收缩 (-1)-曲线，每步 K^2 增加 1、e 减少 1、ρ 减少 1，故过程有限终止。", "极小模型的存在性与（几乎）唯一性：κ ≥ 0 时极小模型唯一；κ = -∞（有理/直纹）时极小模型不唯一（如 P^2 与 Hirzebruch 曲面族）。"],
        theorems: ["Castelnuovo 收缩定理：(-1)-曲线可收缩且收缩结果仍为光滑射影曲面。", "每个光滑射影曲面都经过有限次收缩得到极小曲面（因 ρ 或 b_2 严格下降）。", "极小模型唯一性：Kodaira 维数 κ(S) ≥ 0 时极小模型在同构意义下唯一；κ = -∞ 时极小模型为 P^2 或 P^1 上的几何直纹曲面（不唯一）。"],
        generalRequirements: ["必须同时验证 C ≅ P^1（即 p_a(C) = 0）与 C^2 = -1，只有其一不足。", "必须区分“极小曲面”与“极小模型唯一”，κ = -∞ 情形不能断言唯一性。"],
        forbiddenErrors: ["【条件不全】仅由 C^2 = -1 断言可收缩而不验证有理性/光滑性。", "【收缩后奇异误设】认为收缩 (-1)-曲线会产生奇点。", "【唯一性滥用】对有理/直纹曲面断言极小模型唯一。", "【不变量变化错误】认为收缩后 K^2 减少或 χ(O_S) 改变。", "【终止性缺证】声称收缩过程可能无限进行。"],
        parameterConstraints: { rationalCurveWithMinusOne: "C ≅ P^1 且 C^2 = -1（等价 C·K = -1、p_a = 0）。", smoothProjective: "S 光滑射影曲面。", terminationInvariant: "每次收缩使 b_2（或 ρ）严格下降，保证终止。" },
        closureChecks: ["用伴随公式验证 p_a(C) = 0 与 C·K_S = -1。", "确认 C^2 = -1 后应用判据并更新 K^2、e、ρ。", "检查结果曲面是否仍含 (-1)-曲线以判断是否已极小。"],
        scenarioChecks: { minimalizeBlownUpSurface: ["对多点吹胀的曲面逐步收缩例外曲线回到极小模型。"], recognizeMinimalSurface: ["通过排除 (-1)-曲线证明曲面极小。"], ruledSurfaceNonuniqueness: ["直纹曲面情形说明极小模型不唯一（初等变换连接不同模型）。"] },
    },
    // Kodaira 维数与 Enriques 分类。
    "kodaira-dimension-enriques-classification": {
        definitions: ["Kodaira 维数由多重亏格的增长阶刻画典范线丛的正性，Enriques-Kodaira 分类按 κ ∈ {-∞, 0, 1, 2} 把光滑射影曲面（极小模型）分为四大类。"],
        formulas: ["多重亏格：P_n(S) = h^0(nK_S)；Kodaira 维数 κ(S) = limsup_n log P_n / log n ∈ {-∞, 0, 1, 2}（曲面情形）。", "等价刻画：κ = -∞ ⇔ P_n = 0 对所有 n ≥ 1；κ = 2 ⇔ P_n 增长为 n^2（典范模型为一般型）。", "κ = -∞：有理曲面（P^2、Hirzebruch 曲面）与非有理直纹曲面（P^1-丛）。", "κ = 0（极小模型的四类）：K3 曲面（K = 0, q = 0, p_g = 1）、Enriques 曲面（2K = 0, K ≠ 0, q = p_g = 0）、Abel 曲面（K = 0, q = 2, p_g = 1）、双椭圆（bielliptic）曲面。", "κ = 1：正规椭圆纤维化曲面（K^2 = 0，存在到曲线的椭圆纤维化）。", "κ = 2：一般型曲面，极小模型满足 K^2 > 0、K·H > 0，且 K^2 ≥ 2p_g - 4（Noether 不等式）。"],
        theorems: ["Enriques-Kodaira 分类：极小光滑射影曲面按 κ 分为四类，且 κ = 0 与 κ = 1 各有上述结构描述。", "Castelnuovo 有理性判据：q = 0 且 P_2 = 0 ⇒ S 有理（这是 κ = -∞ 中有理曲面的判定）。", "κ 是双有理不变量：吹胀不改变 P_n 与 κ，故分类在双有理等价类上进行（对极小模型陈述）。", "一般型曲面的典范模型：κ = 2 时 |nK| 对充分大 n 给出到典范模型（可能带有理双点奇点）的双有理态射。"],
        generalRequirements: ["必须先取极小模型再套用分类表（非极小曲面需先收缩 (-1)-曲线）。", "必须给出 q、p_g、P_2、K^2 等不变量作为判定依据，而非凭曲面名称断言类型。"],
        forbiddenErrors: ["【未极小化分类】直接对含 (-1)-曲线的曲面套用极小分类表。", "【κ 取值越界】给出 κ = 3 或非整数值（曲面情形只有 -∞, 0, 1, 2）。", "【K3 与 Enriques 混淆】把 2K = 0、K ≠ 0 的曲面判为 K3。", "【有理性判据错误】仅由 p_g = 0 断言有理（需 q = 0 且 P_2 = 0）。", "【双有理不变性误设】认为吹胀会改变 Kodaira 维数或多重亏格。"],
        parameterConstraints: { minimalModelRequired: "分类表针对极小曲面。", kodairaRange: "曲面 κ ∈ {-∞, 0, 1, 2}。", invariantsNeeded: "需 q、p_g、P_2、K^2 等不变量。" },
        closureChecks: ["先判定并（若需要）构造极小模型。", "计算 P_n（至少 P_1, P_2）与 q、p_g、K^2 确定 κ。", "把不变量与分类表比对，核对所选类型的全部特征（如 K 的挠阶）。"],
        scenarioChecks: { detectRationality: ["用 Castelnuovo 判据（q = 0, P_2 = 0）判定有理性。"], identifyK3: ["由 K = 0、q = 0、p_g = 1、e = 24 判定 K3 曲面。"], generalTypeInequality: ["一般型曲面用 Noether 不等式 K^2 ≥ 2p_g - 4 检验不变量自洽性。"] },
    },
};
