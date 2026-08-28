import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“几何-凸几何”下的原子 L3 知识项。
// 本分支统一采用凸体语言：对象是 R^n 中的凸集、凸体与多面体，
// 工具是组合型定理（Carathéodory、Helly、Radon）、分离与支撑、支撑函数与 Minkowski 和、体积不等式。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const GEOMETRY_CONVEX_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Carathéodory 定理：凸包中的点可由至多 n+1 个点的凸组合表示。
    "caratheodory-theorem": {
        id: "caratheodory-theorem", l2Key: "geometry-convex", name: "Carathéodory 定理", kind: "theorem",
        aliases: ["Carathéodory定理", "Caratheodory定理", "Carathéodory theorem"],
    },
    // Helly 定理：R^n 中凸集族的交非空判据。
    "helly-theorem": {
        id: "helly-theorem", l2Key: "geometry-convex", name: "Helly 定理", kind: "theorem",
        aliases: ["Helly定理", "Helly theorem"],
    },
    // Radon 定理：n+2 个点可分为两组凸包相交。
    "radon-theorem": {
        id: "radon-theorem", l2Key: "geometry-convex", name: "Radon 定理", kind: "theorem",
        aliases: ["Radon定理", "Radon theorem", "Radon分割"],
    },
    // 分离超平面与支撑超平面定理。
    "separating-supporting-hyperplane": {
        id: "separating-supporting-hyperplane", l2Key: "geometry-convex", name: "分离超平面与支撑超平面定理", kind: "theorem",
        aliases: ["分离超平面定理", "超平面分离定理", "separating hyperplane theorem", "支撑超平面定理", "supporting hyperplane"],
    },
    // 支撑函数与 Minkowski 和。
    "support-function-minkowski-sum": {
        id: "support-function-minkowski-sum", l2Key: "geometry-convex", name: "支撑函数与 Minkowski 和", kind: "object",
        aliases: ["支撑函数", "support function", "Minkowski和", "Minkowski sum"],
    },
    // 极体与对偶。
    "polar-body-duality": {
        id: "polar-body-duality", l2Key: "geometry-convex", name: "极体与对偶", kind: "object",
        aliases: ["极体", "polar body", "对偶凸体", "双极定理", "bipolar theorem"],
    },
    // Krein-Milman 定理与极点。
    "krein-milman-extreme-points": {
        id: "krein-milman-extreme-points", l2Key: "geometry-convex", name: "Krein-Milman 定理与极点", kind: "theorem",
        aliases: ["Krein-Milman定理", "Krein-Milman theorem", "凸集极点", "extreme point"],
    },
    // Brunn-Minkowski 不等式。
    "brunn-minkowski-inequality": {
        id: "brunn-minkowski-inequality", l2Key: "geometry-convex", name: "Brunn-Minkowski 不等式", kind: "theorem",
        aliases: ["Brunn-Minkowski不等式", "Brunn-Minkowski inequality"],
    },
    // 混合体积与 Steiner 公式。
    "mixed-volume-steiner-formula": {
        id: "mixed-volume-steiner-formula", l2Key: "geometry-convex", name: "混合体积与 Steiner 公式", kind: "formula",
        aliases: ["混合体积", "mixed volume", "Steiner公式", "Steiner formula"],
    },
    // 等周不等式。
    "isoperimetric-inequality-convex": {
        id: "isoperimetric-inequality-convex", l2Key: "geometry-convex", name: "等周不等式", kind: "theorem",
        aliases: ["等周不等式", "isoperimetric inequality", "等周问题"],
    },
    // John 椭球与 Löwner 椭球。
    "john-lowner-ellipsoid": {
        id: "john-lowner-ellipsoid", l2Key: "geometry-convex", name: "John 椭球与 Löwner 椭球", kind: "theorem",
        aliases: ["John椭球", "John ellipsoid", "Löwner椭球", "Lowner ellipsoid"],
    },
    // Minkowski 格点定理。
    "minkowski-lattice-point-theorem": {
        id: "minkowski-lattice-point-theorem", l2Key: "geometry-convex", name: "Minkowski 格点定理", kind: "theorem",
        aliases: ["Minkowski格点定理", "Minkowski凸体定理", "Minkowski lattice point theorem"],
    },
    // 多面体的 H-表示与 V-表示。
    "polytope-h-v-representation": {
        id: "polytope-h-v-representation", l2Key: "geometry-convex", name: "多面体的 H-表示与 V-表示", kind: "theorem",
        aliases: ["H-表示", "V-表示", "H-representation", "V-representation", "Minkowski-Weyl定理"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const GEOMETRY_CONVEX_L3_RULES: Record<string, MathV2L3Rules> = {
    // Carathéodory 定理：凸组合所需点数的上界。
    "caratheodory-theorem": {
        definitions: ["Carathéodory 定理研究 R^n 中集合的凸包元素所需的最少凸组合点数，把“凸包”这一整体构造归约为有界个数的局部数据。"],
        formulas: ["conv(S) = { Σ_{i=1}^{m} λ_i x_i : x_i ∈ S, λ_i ≥ 0, Σ λ_i = 1 }。", "Carathéodory：x ∈ conv(S) ⊂ R^n ⇒ 存在至多 n+1 个点 x_1,...,x_{n+1} ∈ S 与 λ_i ≥ 0、Σλ_i = 1 使 x = Σ λ_i x_i；可进一步要求这些点仿射无关。", "锥版本：x ∈ cone(S) ⊂ R^n ⇒ x 是 S 中至多 n 个线性无关向量的非负组合。", "Fenchel-Bunt：S 连通（例如至多 n 个连通分支）时上界可降为 n。"],
        theorems: ["Carathéodory 定理：R^n 中凸包的每个点是至多 n+1 个原集合点的凸组合，且可取仿射无关的点。", "推论：紧集的凸包是紧集（由 n+1 单形上的连续映射像给出）。", "推论：凸包运算与有限维紧性、闭性的关系——紧集凸包紧，但闭集的凸包不必闭。"],
        generalRequirements: ["必须明确空间维数 n：上界 n+1 与维数直接相关。", "使用 Fenchel-Bunt 改进（上界 n）时必须验证连通性假设。"],
        forbiddenErrors: ["【上界错误】声称需要至多 n 个点（一般情形应为 n+1）。", "【连通性遗漏】未验证连通性就使用 n 的上界。", "【闭性误推】由 Carathéodory 断言闭集的凸包总是闭集。", "【锥版本混用】把锥情形的 n 个线性无关向量的结论套到凸组合情形。"],
        parameterConstraints: { ambientDimension: "上界依赖环绕空间维数 n。", nonnegativeWeights: "λ_i ≥ 0 且 Σλ_i = 1。", connectednessForImprovement: "上界降为 n 需要连通性（Fenchel-Bunt）。" },
        closureChecks: ["写出所用的凸组合并核对点数不超过 n+1。", "必要时说明所取点仿射无关。", "若使用改进上界，验证连通性前提。"],
        scenarioChecks: { compactnessOfHull: ["证明紧集凸包紧时用 Carathéodory 把凸包写成单形的连续像。"], linearProgrammingBasis: ["线性规划中基本可行解的支撑大小限制与 Carathéodory 同源。"], coneVersion: ["非负组合（锥）问题使用 n 个线性无关向量的版本。"] },
    },
    // Helly 定理：凸集族公共点判据。
    "helly-theorem": {
        definitions: ["Helly 定理研究 R^n 中凸集族何时有公共点：只要每 n+1 个成员都有公共点，则整族有公共点，它把“整体相交”归约为“局部相交”。"],
        formulas: ["有限族形式：C_1,...,C_m ⊂ R^n 凸，m ≥ n+1，若任意 n+1 个的交非空，则 ∩_{i=1}^m C_i ≠ ∅。", "无限族形式：需附加紧性（或闭且某一族成员紧）以避免交为空。", "分数 Helly：若至少 α 比例的 (n+1)-子族有公共点，则存在 β(α) 比例的成员有公共点。", "对偶应用（区间情形 n = 1）：区间族两两相交 ⇒ 有公共点。"],
        theorems: ["Helly 定理（有限族）：R^n 中至少 n+1 个凸集，若每 n+1 个都有公共点，则全体有公共点；证明可由 Radon 定理归纳得到。", "紧性必要性：无限凸集族若无紧性假设，逐个 n+1 相交也可能整体交为空（如 R 中的 [k, ∞)）。", "推论（中心点定理）：任意 m 个点存在点使任意含它的半空间至少含 m/(n+1) 个点。"],
        generalRequirements: ["必须验证全部成员为凸集（Helly 对非凸集不成立）。", "无限族必须补充紧性（或适当闭性 + 一个紧成员）。"],
        forbiddenErrors: ["【凸性遗漏】对非凸集族使用 Helly。", "【交数错误】用“两两相交”作为 R^n（n ≥ 2）的充分条件。", "【紧性遗漏】对无限族不加紧性假设直接断言公共点存在。", "【维数错误】把 n+1 写成 n 或 2n。"],
        parameterConstraints: { convexity: "所有成员必须为凸集。", intersectionNumber: "需每 n+1 个成员有公共点。", compactnessForInfinite: "无限族需紧性假设。" },
        closureChecks: ["确认凸性与族的成员个数。", "验证任意 n+1 个成员有公共点。", "无限族时补充紧性论证。"],
        scenarioChecks: { intervalsOnLine: ["n = 1 时退化为区间两两相交必有公共点。"], piercingProblems: ["穿刺/覆盖问题用 Helly 或分数 Helly 给出界。"], centerpointTheorem: ["数据深度与中心点定理由 Helly 型论证给出。"] },
    },
    // Radon 定理：点集的 Radon 分割。
    "radon-theorem": {
        definitions: ["Radon 定理研究 R^n 中任意 n+2 个点必可分成两个不相交子集，使两子集的凸包相交，是 Helly 定理与 Tverberg 定理的基础。"],
        formulas: ["Radon：任意 x_1,...,x_{n+2} ∈ R^n 存在划分 I ⊔ J = {1,...,n+2} 使 conv{x_i : i ∈ I} ∩ conv{x_j : j ∈ J} ≠ ∅。", "证明机制：n+2 个点必有仿射相关关系 Σ λ_i x_i = 0、Σ λ_i = 0（λ 不全为零），取 I = {i : λ_i > 0}、J = {i : λ_i ≤ 0} 并归一化。", "Tverberg 定理（推广）：任意 (r-1)(n+1)+1 个点可分为 r 组，使 r 个凸包有公共点。"],
        theorems: ["Radon 定理：R^n 中 n+2 个点必存在 Radon 分割；点数 n+1 时一般不成立（单形顶点无法分割）。", "Radon ⇒ Helly：Helly 定理可由 Radon 定理对成员个数归纳证明。", "Tverberg 定理是 Radon 的 r 分割推广，界 (r-1)(n+1)+1 是最优的。"],
        generalRequirements: ["必须使用至少 n+2 个点（点数不足时结论不成立）。", "构造分割时必须用仿射相关关系（系数和为零），不能只用线性相关。"],
        forbiddenErrors: ["【点数不足】用 n+1 个点断言存在 Radon 分割。", "【线性/仿射相关混淆】只用 Σλ_i x_i = 0 而不要求 Σλ_i = 0。", "【划分不交遗漏】允许两个子集共享点。", "【Tverberg 界错误】把界写成 r(n+1) 或 (r-1)n+1。"],
        parameterConstraints: { pointCount: "至少 n+2 个点。", affineDependence: "需 Σλ_i = 0 的非零仿射相关关系。", disjointPartition: "两子集必须不相交。" },
        closureChecks: ["写出仿射相关关系并按系数符号划分。", "验证两子集不相交且凸包有公共点。", "如用于推 Helly，说明归纳步骤。"],
        scenarioChecks: { hellyProof: ["用 Radon 归纳证明 Helly 定理。"], tverbergPartition: ["需要 r 组公共点时使用 Tverberg 定理。"], generalPositionExample: ["单形的 n+1 个顶点说明点数下界 n+2 是必要的。"] },
    },
    // 分离超平面与支撑超平面。
    "separating-supporting-hyperplane": {
        definitions: ["分离定理研究两个不相交凸集能否被超平面分开，支撑超平面定理研究凸集在边界点处的切超平面存在性；二者是凸分析对偶理论（含 Hahn-Banach 几何形式）的核心。"],
        formulas: ["分离：存在 u ≠ 0 与 c 使 ⟨u, x⟩ ≤ c ≤ ⟨u, y⟩ 对所有 x ∈ A、y ∈ B。", "严格分离：存在 u ≠ 0 与 c_1 < c_2 使 ⟨u,x⟩ ≤ c_1 < c_2 ≤ ⟨u,y⟩，条件是 A 闭、B 紧且 A ∩ B = ∅（或 A - B 闭且不含 0）。", "支撑超平面：x_0 ∈ ∂K（K 凸）时存在 u ≠ 0 使 ⟨u, x⟩ ≤ ⟨u, x_0⟩ 对所有 x ∈ K，即 ⟨u,x⟩ = h_K(u) 在 x_0 处取到。", "点与凸集分离：x_0 ∉ K（K 闭凸）⇒ 存在 u 使 ⟨u,x_0⟩ > h_K(u)。"],
        theorems: ["分离定理（一般形式）：两个不相交非空凸集可被超平面分离（可能不严格）；若其中一个开则可取严格不等号之一。", "严格分离定理：A 闭凸、B 紧凸且不相交 ⇒ 存在严格分离超平面（紧性不可去，两个闭集可能无法严格分离）。", "支撑超平面定理：凸集的每个边界点都有支撑超平面；反之若每点都有支撑超平面（且集合闭）则集合凸。"],
        generalRequirements: ["必须区分分离、严格分离与支撑三种结论及其各自的前提（闭性、紧性、开性）。", "必须验证凸性；非凸集一般不可分离。"],
        forbiddenErrors: ["【紧性遗漏】对两个仅闭的不相交凸集断言严格分离。", "【凸性遗漏】对非凸集使用分离定理。", "【支撑唯一性误设】声称边界点处支撑超平面唯一（角点处不唯一）。", "【方向遗漏】给出的 u 为零向量（不定义超平面）。", "【内点混淆】把相对内点与内点混用导致分离形式判断错误。"],
        parameterConstraints: { convexSets: "两集合都必须为凸。", closedCompactForStrict: "严格分离需一闭一紧。", nonzeroNormal: "分离方向 u ≠ 0。" },
        closureChecks: ["核对凸性与所需的闭/紧/开条件。", "给出显式分离方向 u 与常数 c（或支撑点）。", "验证不等式对所有元素成立。"],
        scenarioChecks: { pointOutsideClosedConvex: ["点不在闭凸集内时用严格分离（取最近点方向）。"], dualityInOptimization: ["凸优化中的 Lagrange 对偶、Farkas 引理都由分离定理导出。"], supportAtCorner: ["多面体顶点处支撑超平面构成法锥，非唯一。"] },
    },
    // 支撑函数与 Minkowski 和。
    "support-function-minkowski-sum": {
        definitions: ["支撑函数把凸体编码为方向上的最大投影，从而把凸体的几何运算（Minkowski 和、伸缩、包含）线性化；Minkowski 和是凸体的自然加法。"],
        formulas: ["支撑函数：h_K(u) = sup_{x ∈ K} ⟨x, u⟩（K 有界闭凸时为有限、正齐次、次可加）。", "Minkowski 和：K + L = { x + y : x ∈ K, y ∈ L }；h_{K+L} = h_K + h_L；h_{λK} = λ h_K（λ ≥ 0）。", "包含判据：K ⊆ L ⇔ h_K ≤ h_L（K、L 闭凸）。", "宽度函数：w_K(u) = h_K(u) + h_K(-u)（|u| = 1）；平均宽度与内蕴体积相关。", "支撑函数刻画：函数 h 是某凸体的支撑函数 ⇔ h 正齐次一次且次可加（即凸）。"],
        theorems: ["凸体与其支撑函数一一对应（Hörmander 对应），凸体运算对应支撑函数的逐点线性运算。", "Minkowski 和保持凸性与紧性，但一般不保持体积的线性性（体积由混合体积展开）。", "Minkowski 差/消去律：K + M = L + M ⇒ K = L（凸紧集），因此 Minkowski 加法构成消去半群。"],
        generalRequirements: ["必须要求 K 闭凸有界才保证 h_K 有限并与 K 一一对应。", "必须区分 Minkowski 和与集合并/交，以及 Minkowski 差与集合差。"],
        forbiddenErrors: ["【非凸对应误设】声称非凸集也由支撑函数唯一确定（支撑函数只决定其凸包）。", "【体积线性误设】写 |K + L| = |K| + |L|。", "【包含判据方向反用】由 h_K ≤ h_L 推 L ⊆ K。", "【齐次性错误】写 h_{λK} = λ^n h_K。", "【集合差混淆】把 Minkowski 差定义为逐元素相减的集合。"],
        parameterConstraints: { compactConvex: "对应关系要求 K 紧凸非空。", positiveHomogeneous: "h_K 正齐次一次且次可加。", nonnegativeScaling: "h_{λK} = λh_K 仅对 λ ≥ 0。" },
        closureChecks: ["写出 h_K 并核对正齐次与凸性。", "用支撑函数计算 Minkowski 和、伸缩与包含关系。", "如需体积，改用混合体积/Steiner 公式而非线性相加。"],
        scenarioChecks: { widthProblems: ["常宽体（w_K 为常数）问题直接用宽度函数刻画。"], sumOfSegments: ["线段的 Minkowski 和给出 zonotope，其支撑函数为绝对值之和。"], containmentTest: ["判断一凸体是否含于另一凸体时比较支撑函数。"] },
    },
    // 极体与对偶。
    "polar-body-duality": {
        definitions: ["极体研究凸集通过内积不等式给出的对偶对象，它把包含关系反转、把支撑函数与规范函数互换，是凸对偶理论的几何载体。"],
        formulas: ["极体：K° = { y : ⟨x, y⟩ ≤ 1 对所有 x ∈ K }。", "双极定理：K 闭凸且 0 ∈ K ⇒ (K°)° = K；一般情形 (K°)° = closed conv(K ∪ {0})。", "反序性：K ⊆ L ⇒ L° ⊆ K°；(λK)° = λ^{-1}K°（λ > 0）。", "规范与支撑的互换：h_{K°} = ‖·‖_K（K 的规范函数），即 K 的支撑函数是 K° 的规范函数。", "对偶范数与经典例子：(B_p)° = B_q，1/p + 1/q = 1；立方体与正八面体互为极体。", "Mahler 体积 |K|·|K°| 是线性不变量；Blaschke-Santaló 不等式给出其上界（椭球取等）。"],
        theorems: ["双极定理：对含原点的闭凸集，取极两次回到自身；这是凸对偶的核心闭合性。", "极运算把 Minkowski 和与凸包对偶化：(conv(K ∪ L))° = K° ∩ L°，(K ∩ L)° = closed conv(K° ∪ L°)。", "Blaschke-Santaló 不等式：对称凸体的 Mahler 体积不超过球的值，等号当且仅当为椭球；Mahler 猜想给出下界（对称情形猜测为立方体）。"],
        generalRequirements: ["必须要求 0 ∈ K（通常取 0 为内点）才使极体有界且双极定理成立。", "必须区分极体与对偶锥（锥情形使用 ⟨x,y⟩ ≤ 0 的定义）。"],
        forbiddenErrors: ["【原点条件遗漏】对不含原点的集合断言 (K°)° = K。", "【反序性遗漏】声称 K ⊆ L ⇒ K° ⊆ L°。", "【伸缩公式错误】写 (λK)° = λK°。", "【极体与对偶锥混用】对锥使用 ≤ 1 的定义。", "【有界性误设】断言任意凸集的极体有界（需 0 为内点）。"],
        parameterConstraints: { originInside: "双极定理要求 0 ∈ K（有界性要求 0 为内点）。", closedConvex: "K 需闭凸（否则取极两次得到闭凸包）。", inclusionReversing: "极运算反转包含关系。" },
        closureChecks: ["写出 K° 的定义并核对原点条件。", "验证反序性与伸缩公式。", "如用到双极定理，说明 K 闭凸含原点。"],
        scenarioChecks: { dualNorms: ["单位球的极体给出对偶范数（ℓ_p 与 ℓ_q 对偶）。"], polytopeDuality: ["多面体的极体是多面体，顶点与面互换（H-表示与 V-表示对偶）。"], volumeProduct: ["涉及 |K||K°| 的极值问题引用 Blaschke-Santaló 与 Mahler 猜想。"] },
    },
    // Krein-Milman 定理与极点。
    "krein-milman-extreme-points": {
        definitions: ["极点是凸集中不能表为其他两点非平凡凸组合的点；Krein-Milman 定理断言紧凸集是其极点集闭凸包，在有限维（Minkowski 定理）中可去掉闭包。"],
        formulas: ["极点：x ∈ K 是极点 ⇔ x = (y+z)/2 且 y, z ∈ K ⇒ y = z = x。", "有限维（Minkowski）：K ⊂ R^n 紧凸 ⇒ K = conv(ext K)。", "一般（Krein-Milman）：K 在局部凸 Hausdorff 空间中紧凸 ⇒ K = closed conv(ext K)。", "暴露点：存在支撑超平面与 K 只交于该点；暴露点必为极点，反之不然（Straszewicz：极点是暴露点的闭包）。"],
        theorems: ["Krein-Milman 定理：紧凸集由其极点的闭凸包恢复；无限维情形闭包不可去。", "Minkowski 定理（有限维版本）：R^n 中紧凸集是极点集的凸包（无需闭包），且由 Carathéodory 可用至多 n+1 个极点表示每个点。", "线性泛函在紧凸集上的最大值必在某极点取到（线性规划最优解在顶点取到的抽象形式）。"],
        generalRequirements: ["必须验证紧性与凸性；无界或非闭集的极点集可能不足以恢复集合。", "无限维情形必须保留闭凸包（不能只取凸包）。"],
        forbiddenErrors: ["【紧性遗漏】对无界凸集断言等于极点凸包（如半平面无极点）。", "【闭包遗漏】无限维情形写 K = conv(ext K)。", "【极点与暴露点混淆】断言所有极点都是暴露点。", "【极点存在性误设】声称任意凸集都有极点（开球无极点）。", "【最优值位置错误】断言凸函数（非线性）最大值也必在极点取到而不加条件。"],
        parameterConstraints: { compactConvex: "定理要求集合紧凸。", localConvexSpace: "无限维情形需局部凸 Hausdorff 空间。", closureInInfiniteDim: "无限维必须取闭凸包。" },
        closureChecks: ["确认紧性与凸性。", "找出极点集并验证其（闭）凸包等于原集合。", "如涉及最优化，说明线性目标在极点取到最优。"],
        scenarioChecks: { polytopeVertices: ["多面体的极点恰为顶点，Minkowski 定理给出 V-表示。"], linearProgramming: ["线性规划最优解可取在可行域顶点（极点）。"], probabilitySimplex: ["概率测度集合的极点是 Dirac 测度，用于极值分解。"] },
    },
    // Brunn-Minkowski 不等式。
    "brunn-minkowski-inequality": {
        definitions: ["Brunn-Minkowski 不等式研究 Minkowski 和的体积下界，它把体积的 1/n 次幂变成关于 Minkowski 加法的凹（超加）量，是凸几何体积不等式体系的源头。"],
        formulas: ["Brunn-Minkowski：|A + B|^{1/n} ≥ |A|^{1/n} + |B|^{1/n}（A、B 非空紧集，n 为维数）。", "等价（凹性）形式：|(1-λ)A + λB|^{1/n} ≥ (1-λ)|A|^{1/n} + λ|B|^{1/n}，λ ∈ [0,1]。", "乘性（较弱）形式：|(1-λ)A + λB| ≥ |A|^{1-λ}|B|^{λ}，可由 AM-GM 从上式推出。", "Minkowski 第一不等式：V(K, ..., K, L) ≥ |K|^{(n-1)/n}|L|^{1/n}（混合体积形式）。", "函数版本：Prékopa-Leindler 不等式。"],
        theorems: ["Brunn-Minkowski 不等式对任意非空紧（可测）集成立；对凸体等号成立 ⇔ A 与 B 相似（位似），即 B = λA + t。", "推论：等周不等式可由 Brunn-Minkowski 取 B = εB_2^n 并令 ε → 0 得到。", "推论（Brunn 的截面原理）：凸体沿平行超平面族的截面体积的 1/(n-1) 次幂是凹函数。"],
        generalRequirements: ["必须使用同一维数 n 的 Lebesgue 体积；1/n 次幂不可省略。", "讨论等号必须限定为凸体且位似（一般可测集的等号情形更复杂）。"],
        forbiddenErrors: ["【幂次遗漏】写成 |A+B| ≥ |A| + |B|。", "【不等号方向反用】写成 ≤。", "【等号条件错误】声称等号当且仅当 A = B（应为位似）。", "【维数错误】用 1/(n-1) 或 1/2 次幂。", "【非空性遗漏】允许 A 或 B 为空集（此时 Minkowski 和为空）。"],
        parameterConstraints: { nonemptyCompact: "A、B 非空紧（或可测且和可测）。", dimensionPower: "指数为 1/n，n 为环绕空间维数。", equalityHomothety: "凸体等号 ⇔ 位似。" },
        closureChecks: ["确认维数与集合非空紧性。", "写出 1/n 次幂形式的不等式并核对方向。", "如讨论等号，验证位似关系。"],
        scenarioChecks: { deriveIsoperimetric: ["取 B 为小球并令半径趋零，得到等周不等式。"], sectionConcavity: ["用 Brunn 截面原理证明截面体积的凹性结论。"], functionalVersion: ["积分/概率情形改用 Prékopa-Leindler 不等式。"] },
    },
    // 混合体积与 Steiner 公式。
    "mixed-volume-steiner-formula": {
        definitions: ["混合体积是 Minkowski 和体积展开的系数，Steiner 公式是其在外平行体（K + tB）情形的特例，把体积、表面积等几何量统一为内蕴体积。"],
        formulas: ["Minkowski 展开：|λ_1K_1 + ... + λ_mK_m| = Σ λ_{i_1}···λ_{i_n} V(K_{i_1},...,K_{i_n})（对称、多重线性系数即混合体积）。", "Steiner 公式：|K + tB_2^n| = Σ_{i=0}^{n} C(n,i) W_i(K) t^i，其中 W_i 为 quermassintegral，W_0 = |K|、n W_1 = S(K)（表面积）。", "混合体积的性质：对称、Minkowski 加法多重线性、单调（包含意义下）、平移不变、非负。", "表面积作为导数：S(K) = lim_{t→0+} (|K + tB| - |K|)/t = n V(K,...,K,B)。", "Alexandrov-Fenchel 不等式：V(K_1,K_2,K_3,...,K_n)^2 ≥ V(K_1,K_1,K_3,...,K_n) V(K_2,K_2,K_3,...,K_n)。"],
        theorems: ["Minkowski 定理：凸体族 Minkowski 组合的体积是各系数的齐次 n 次多项式，其系数为混合体积。", "Steiner 公式：外平行体体积是 t 的 n 次多项式，系数给出内蕴体积（Hadwiger 定理表明它们生成所有刚体运动不变的连续赋值）。", "Alexandrov-Fenchel 不等式统一了 Brunn-Minkowski、等周与 Minkowski 第一/第二不等式。"],
        generalRequirements: ["必须使用凸体（紧凸非空）；非凸集的 Steiner 公式一般不是多项式。", "必须固定归一化约定（C(n,i) 与 W_i 的定义随文献不同）。"],
        forbiddenErrors: ["【多项式性误推】对非凸体断言 |K + tB| 是 t 的多项式。", "【系数约定混用】把 W_i 与内蕴体积 V_i 的归一化混用导致系数错误。", "【表面积公式错误】写 S(K) = V(K,...,K,B) 而漏因子 n。", "【单调性误设】声称混合体积对任意集合单调（需凸性）。", "【Alexandrov-Fenchel 方向反用】把不等号写反。"],
        parameterConstraints: { convexBodies: "参与运算的集合必须为凸体。", normalizationConvention: "需声明 quermassintegral 与内蕴体积的归一化。", nonnegativity: "混合体积非负且平移不变。" },
        closureChecks: ["写出 Minkowski 展开或 Steiner 公式并核对系数约定。", "由 t 的一次项读出表面积并检验因子 n。", "如用不等式，核对方向与前提（凸性）。"],
        scenarioChecks: { surfaceAreaFromSteiner: ["用 Steiner 公式的一次项计算表面积。"], intrinsicVolumes: ["需要刚体运动不变赋值时用内蕴体积（Hadwiger 定理）。"], quermassIntegralInequalities: ["quermassintegral 之间的不等式由 Alexandrov-Fenchel 给出。"] },
    },
    // 等周不等式。
    "isoperimetric-inequality-convex": {
        definitions: ["等周不等式研究给定体积（面积）时表面积（周长）的最小值，其唯一最优形状是球（圆），在凸几何中由 Brunn-Minkowski 不等式导出。"],
        formulas: ["平面形式：L^2 ≥ 4π A，等号 ⇔ 圆。", "R^n 形式：S(K)^n ≥ n^n ω_n |K|^{n-1}，其中 ω_n = |B_2^n|；等价 (S(K)/S(B))^{n} ≥ (|K|/|B|)^{n-1}。", "等周商（归一化）：|K|^{1/n}/S(K)^{1/(n-1)} 取最大值当且仅当 K 为球。", "由 Brunn-Minkowski 推导：|K + tB|^{1/n} ≥ |K|^{1/n} + t ω_n^{1/n}，对 t 求导取 t → 0+。"],
        theorems: ["等周不等式：在 R^n 中给定体积的集合中球的表面积最小；等号当且仅当集合（在零测集意义下）为球。", "反向表述（等容不等式）：给定表面积时球的体积最大。", "稳定性版本：等周商接近最优时集合在对称差意义下接近球（定量稳定性结果）。"],
        generalRequirements: ["必须使用相容的体积与表面积定义（凸体用 Minkowski 内容或 Hausdorff 测度）。", "必须说明等号情形为球（并注意零测集修正）。"],
        forbiddenErrors: ["【指数错误】写 S(K)^{n-1} ≥ ... |K|^{n} 之类的幂次颠倒。", "【平面常数错误】写 L^2 ≥ 2πA 或 L^2 ≥ 4A。", "【等号情形错误】声称正多边形或椭球取等。", "【非可测集使用】对无良定表面积的集合断言不等式。", "【方向反用】把不等号写成 ≤。"],
        parameterConstraints: { measurability: "集合需可测且表面积良定。", dimensionExponents: "指数为 n 与 n-1，不可互换。", equalityBall: "等号当且仅当为球。" },
        closureChecks: ["写出与维数匹配的等周不等式并核对指数。", "代入球验证等号成立。", "如需推导，说明由 Brunn-Minkowski 取极限的步骤。"],
        scenarioChecks: { planarPerimeterArea: ["平面问题直接用 L^2 ≥ 4πA。"], fromBrunnMinkowski: ["需要证明而非引用时由 Brunn-Minkowski 取 B = tB_2^n。"], stabilityEstimate: ["近最优形状问题引用定量稳定性版本。"] },
    },
    // John 椭球与 Löwner 椭球。
    "john-lowner-ellipsoid": {
        definitions: ["John 椭球是凸体内体积最大的椭球，Löwner 椭球是包含凸体的体积最小的椭球；两者唯一存在，并给出凸体被椭球逼近的最优比例。"],
        formulas: ["John 位置（K 内最大体积椭球为单位球 B）：K ⊆ n B（一般凸体）；K 中心对称时 K ⊆ sqrt(n) B。", "Löwner 位置（最小外接椭球为 B）：(1/n)B ⊆ K（一般），对称情形 (1/sqrt(n))B ⊆ K。", "John 分解定理：B 是 K 的最大内接椭球 ⇔ 存在接触点 u_i ∈ ∂K ∩ S^{n-1} 与 c_i > 0 使 Σ c_i u_i = 0 且 Σ c_i u_i ⊗ u_i = Id。", "Banach-Mazur 距离：d(K, B) ≤ n（一般），≤ sqrt(n)（对称），由 John 椭球给出。"],
        theorems: ["John/Löwner 椭球的存在唯一性：体积最大内接椭球与体积最小外接椭球都唯一（由体积泛函的严格凹/凸性给出）。", "John 定理：适当仿射位置下 K ⊆ n·(John 椭球)，对称情形常数为 sqrt(n)，且常数是最优的（单形/立方体取到）。", "对偶关系：K 的 Löwner 椭球与 K° 的 John 椭球在极运算下互相对应。"],
        generalRequirements: ["必须区分一般凸体（常数 n）与中心对称凸体（常数 sqrt(n)）。", "结论是仿射不变的：必须先把椭球标准化为球（John/Löwner 位置）。"],
        forbiddenErrors: ["【常数混用】对一般凸体使用 sqrt(n) 的包含常数。", "【唯一性误设】声称最大内接椭球可能不唯一。", "【仿射位置遗漏】未标准化就直接使用 K ⊆ nB。", "【对偶关系反用】把 K 的 John 椭球对应到 K° 的 John 椭球。", "【接触点条件遗漏】使用 John 分解时不写 Σc_i u_i ⊗ u_i = Id。"],
        parameterConstraints: { convexBodyWithInterior: "K 紧凸且内部非空。", symmetryDistinction: "常数取 n 或 sqrt(n) 取决于是否中心对称。", affineNormalization: "结论需在 John/Löwner 位置下表述。" },
        closureChecks: ["确定 John 或 Löwner 椭球并标准化为球。", "写出对应的包含关系与常数（区分对称性）。", "如用 John 分解，验证接触点条件。"],
        scenarioChecks: { banachMazurDistance: ["估计凸体与球的 Banach-Mazur 距离时引用 John 定理。"], simplexExtremal: ["单形是常数 n 的极值例子，立方体是对称情形 sqrt(n) 的极值例子。"], dualPairing: ["由 K° 的 John 椭球得到 K 的 Löwner 椭球。"] },
    },
    // Minkowski 格点定理。
    "minkowski-lattice-point-theorem": {
        definitions: ["Minkowski 格点定理研究中心对称凸体何时必然包含非零格点，是几何数论的基石，把体积（几何量）与整数解存在性（算术量）联系起来。"],
        formulas: ["Minkowski 第一定理：L ⊂ R^n 为格、K 中心对称凸体，若 vol(K) > 2^n det(L)，则 K 含非零格点；若 K 还紧，则 vol(K) ≥ 2^n det(L) 即可。", "连续极小与第二定理：λ_1 ≤ ... ≤ λ_n 为逐次极小，则 (2^n/n!) det(L) ≤ λ_1···λ_n vol(K) ≤ 2^n det(L)。", "Blichfeldt 定理（引理）：vol(S) > det(L) ⇒ 存在两点 x, y ∈ S 使 x - y ∈ L \\ {0}。", "典型应用：Dirichlet 逼近定理、Lagrange 四平方和定理、二次型表示与理想类数估计。"],
        theorems: ["Minkowski 第一定理（凸体定理）：中心对称凸体体积超过 2^n det(L) 时必含非零格点；常数 2^n 最优（开立方体 (-1,1)^n 与 Z^n 为界例）。", "Minkowski 第二定理给出逐次极小乘积的双边界，是格约化理论（LLL 等）的理论背景。", "Blichfeldt 定理是证明 Minkowski 定理的标准工具（平移抽屉原理）。"],
        generalRequirements: ["必须验证 K 中心对称（关于原点）且凸；缺一常数不成立。", "必须使用格的行列式 det(L)（基本平行体体积）作为比较量。"],
        forbiddenErrors: ["【对称性遗漏】对非中心对称凸体套用 2^n 常数。", "【常数错误】写成 vol(K) > 2 det(L) 或 n^n det(L)。", "【严格/非严格混用】非紧情形用等号条件断言存在格点。", "【格行列式错误】用格点个数或基向量长度乘积代替 det(L)。", "【凸性遗漏】对非凸对称集使用定理。"],
        parameterConstraints: { centrallySymmetricConvex: "K 关于原点中心对称且凸。", volumeThreshold: "vol(K) > 2^n det(L)（紧时可取等号）。", latticeDeterminant: "det(L) 为基本平行体体积。" },
        closureChecks: ["验证中心对称与凸性。", "计算 vol(K) 与 det(L) 并比较阈值。", "把所得非零格点翻译为原问题的整数解。"],
        scenarioChecks: { dirichletApproximation: ["用适当的对称凸体（平行体）证明有理逼近定理。"], sumOfFourSquares: ["四平方和定理的几何数论证明用 Minkowski 定理。"], latticeReduction: ["逐次极小与格约化算法引用第二定理的界。"] },
    },
    // 多面体的 H-表示与 V-表示。
    "polytope-h-v-representation": {
        definitions: ["本条研究多面体的两种等价描述：H-表示（有限个半空间的交）与 V-表示（有限点集的凸包），并给出二者等价性（Minkowski-Weyl 定理）与相互转换的意义。"],
        formulas: ["H-表示：P = { x ∈ R^n : Ax ≤ b }；有界时称多胞形（polytope），无界时为一般多面体。", "V-表示：P = conv{v_1,...,v_k} + cone{r_1,...,r_m}（多胞形时锥部分为空）。", "维数-面结构：面由把部分不等式取等号得到；顶点 = 极点 = 至少 n 个线性无关约束取等号的可行点。", "对偶：多胞形的极体仍是多胞形，顶点与刻面互换（H 与 V 表示互换）。"],
        theorems: ["Minkowski-Weyl 定理：一个集合是有限个半空间的交 ⇔ 它是有限点集的凸包与有限锥的和；有界情形即 polytope 的两种表示等价。", "顶点刻画：x 是 P = {Ax ≤ b} 的顶点 ⇔ 在 x 处取等号的约束行秩为 n（基本可行解）。", "表示复杂度：两种表示的规模可以指数级不同（如立方体有 2n 个刻面但 2^n 个顶点），因此转换（顶点枚举/刻面枚举）在计算上是困难的。"],
        generalRequirements: ["必须区分有界（多胞形）与无界（含锥部分）情形，无界时 V-表示必须包含射线生成元。", "使用顶点判据必须验证约束的秩条件，而不仅是数量。"],
        forbiddenErrors: ["【无界情形遗漏】把无界多面体写成纯凸包而不含锥部分。", "【顶点判据错误】仅数取等号约束个数而不检查线性无关性。", "【表示规模等价误设】默认两种表示规模相当（可指数差异）。", "【对偶关系错误】声称极体的顶点对应原多面体的顶点（应对应刻面）。", "【冗余约束忽略】把冗余不等式当作刻面而误算面结构。"],
        parameterConstraints: { finiteDescription: "H-表示与 V-表示都要求有限个数据。", boundednessDistinction: "有界为多胞形，无界需锥生成元。", rankConditionForVertex: "顶点要求取等号约束的秩为 n。" },
        closureChecks: ["写出所用表示并说明有界性。", "顶点/刻面识别时验证秩条件并剔除冗余约束。", "必要时给出两种表示的相互转换或说明规模差异。"],
        scenarioChecks: { linearProgramming: ["线性规划最优解在顶点取到，用基本可行解刻画。"], polytopeDuality: ["由极体把顶点问题转为刻面问题（或反之）。"], unboundedPolyhedron: ["无界可行域用 conv + cone 分解描述所有可行点。"] },
    },
};
