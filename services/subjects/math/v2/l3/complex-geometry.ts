import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“复分析-复几何”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMPLEX_GEOMETRY_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Riemann 映照定理。
    "riemann-mapping-theorem": {
        id: "riemann-mapping-theorem", l2Key: "complex-geometry", name: "Riemann 映照定理", kind: "theorem",
        aliases: ["Riemann映照定理", "单连通区域", "共形等价", "归一化唯一性", "Carathéodory边界对应"],
    },
    // Möbius 变换与圆盘自同构。
    "mobius-disk-automorphism": {
        id: "mobius-disk-automorphism", l2Key: "complex-geometry", name: "Möbius 变换与圆盘自同构群", kind: "object",
        aliases: ["Möbius变换", "分式线性变换", "圆盘自同构", "Möbius变换交比", "双曲度量"],
    },
    // Riemann 面、图册与分支覆盖。
    "riemann-surface-branched-covering": {
        id: "riemann-surface-branched-covering", l2Key: "complex-geometry", name: "Riemann 面与分支覆盖", kind: "object",
        aliases: ["Riemann面", "全纯图册", "分支点", "分支点分歧指数", "亏格"],
    },
    // 单值化定理。
    "uniformization-theorem": {
        id: "uniformization-theorem", l2Key: "complex-geometry", name: "单值化定理", kind: "theorem",
        aliases: ["单值化定理", "普遍覆盖", "双曲型", "抛物型", "Fuchsian群"],
    },
    // 几乎复结构的可积性。
    "almost-complex-newlander-nirenberg": {
        id: "almost-complex-newlander-nirenberg", l2Key: "complex-geometry", name: "几乎复结构与 Newlander-Nirenberg 定理", kind: "theorem",
        aliases: ["几乎复结构", "Newlander-Nirenberg定理", "Nijenhuis张量", "可积性", "复流形"],
    },
    // Dolbeault 上同调。
    "dolbeault-cohomology": {
        id: "dolbeault-cohomology", l2Key: "complex-geometry", name: "Dolbeault 上同调", kind: "object",
        aliases: ["Dolbeault上同调", "∂̄算子", "(p,q)形式", "∂̄-Poincaré引理", "Dolbeault定理"],
    },
    // Kähler 度量与 Kähler 恒等式。
    "kahler-metric-identities": {
        id: "kahler-metric-identities", l2Key: "complex-geometry", name: "Kähler 度量与 Kähler 恒等式", kind: "object",
        aliases: ["Kähler流形", "Kähler形式", "Hermitian度量", "Kähler恒等式", "Kähler势"],
    },
    // Kähler 流形上的 Hodge 分解。
    "hodge-decomposition-kahler": {
        id: "hodge-decomposition-kahler", l2Key: "complex-geometry", name: "Kähler 流形的 Hodge 分解", kind: "theorem",
        aliases: ["Hodge分解", "Hodge数", "hp-q对称", "调和形式", "Lefschetz分解"],
    },
    // Kodaira 嵌入定理。
    "kodaira-embedding-theorem": {
        id: "kodaira-embedding-theorem", l2Key: "complex-geometry", name: "Kodaira 嵌入定理", kind: "theorem",
        aliases: ["Kodaira嵌入定理", "正线丛", "Hodge流形", "射影嵌入", "Kodaira消灭定理"],
    },
    // 拟共形映射与 Teichmüller 空间。
    "quasiconformal-teichmuller-space": {
        id: "quasiconformal-teichmuller-space", l2Key: "complex-geometry", name: "拟共形映射与 Teichmüller 空间", kind: "object",
        aliases: ["拟共形映射", "Beltrami方程", "最大伸缩商", "Teichmüller空间", "测度可测Riemann映照定理"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMPLEX_GEOMETRY_L3_RULES: Record<string, MathV2L3Rules> = {
    // Riemann 映照定理。
    "riemann-mapping-theorem": {
        definitions: ["Riemann 映照定理断言复平面上任意单连通真子域都与单位圆盘双全纯等价，并在归一化条件下唯一，是一维复几何的分类基石。"],
        formulas: ["定理：D ⊊ C 单连通且非空 ⇒ 存在双全纯 f: D → 𝔻。", "归一化：指定 z₀ ∈ D，要求 f(z₀) = 0 且 f'(z₀) > 0 ⇒ f 唯一。", "自同构自由度：Aut(𝔻) = {e^{iθ}(z - a)/(1 - āz)}，三实参数，恰对应归一化消去的自由度。", "Carathéodory 定理：∂D 为 Jordan 曲线 ⇒ f 延拓为 D̄ → 𝔻̄ 的同胚。", "Schwarz-Christoffel 公式：多边形区域的映照可写成 f(z) = A + C∫∏(z - z_k)^{α_k - 1} dz。"],
        theorems: ["整个复平面 C 必须排除：Liouville 定理说明不存在 C → 𝔻 的非常数全纯映射，故「真子域」条件本质。", "单连通性不可省：圆环之间的共形等价还需模数（内外半径之比）相等，这是多连通区域出现共形不变量的最初例子。", "唯一性由 Schwarz 引理的等号刚性给出，存在性由正规族（Montel）与 Hurwitz 定理给出，属非构造性证明。", "边界正则性不自动成立：定理本身只给内部双全纯，边界延拓需 Carathéodory 型条件（如 Jordan 边界）。"],
        generalRequirements: ["必须逐条验证非空、单连通、真子域三个条件。", "断言唯一性必须写出归一化条件。"],
        forbiddenErrors: ["【真子域条件遗漏】对整个复平面或去掉一点的平面（非单连通）套用。", "【多连通仍断言等价】对圆环或挖洞区域断言与圆盘共形等价。", "【唯一性无归一化】不给出 f(z₀) = 0、f'(z₀) > 0 就断言映照唯一。", "【边界延拓默认】未验证边界正则性就断言边界同胚。", "【构造性误导】声称定理给出显式映照公式（一般不显式，特殊区域才有）。"],
        parameterConstraints: { simplyConnectedProper: "区域需单连通、非空且不等于 C。", normalization: "唯一性需指定内点像为 0 且导数为正实数。", boundaryRegularity: "边界延拓需 Jordan 曲线等条件。" },
        closureChecks: ["核对三个前提条件。", "写出归一化条件并说明唯一性来源。", "若涉及边界行为，说明所依据的正则性定理。"],
        scenarioChecks: { domainToDisk: ["用初等映射（幂、指数、Möbius）复合构造到圆盘的显式映照。"], moduliObstruction: ["圆环情形指出模数为共形不变量，故不共形等价于圆盘。"], dirichletTransfer: ["把区域上的 Dirichlet 问题通过映照转移到圆盘用 Poisson 核求解。"] },
    },
    // Möbius 变换与圆盘自同构群。
    "mobius-disk-automorphism": {
        definitions: ["Möbius 变换是 Riemann 球面的全体双全纯自同构，其保广义圆与交比的性质，以及单位圆盘与上半平面的自同构子群构成双曲几何的模型。"],
        formulas: ["一般形式：T(z) = (az + b)/(cz + d)，ad - bc ≠ 0；Aut(P¹) ≅ PGL₂(C)。", "圆盘自同构：φ_a(z) = e^{iθ}(z - a)/(1 - āz)（|a| < 1）。", "上半平面自同构：Aut(H) = PSL₂(R)，即实系数且 ad - bc > 0。", "交比不变性：(z₁,z₂;z₃,z₄) 在 Möbius 变换下不变，且三点像可任意指定（唯一确定变换）。", "Poincaré 度量：ds = 2|dz|/(1 - |z|²)（圆盘）或 |dz|/Im z（上半平面），在自同构下不变。"],
        theorems: ["Möbius 变换把广义圆（圆或直线）映为广义圆，但不必把圆映为圆（可映为直线），故必须在扩充复平面上理解。", "由三点像唯一确定变换是构造具体映照的标准手段；不动点个数（1 或 2）给出抛物、椭圆、双曲、斜驶四种共轭类型。", "Schwarz-Pick 引理说明圆盘的全纯自映射是 Poincaré 度量的压缩，等号成立当且仅当映射为自同构，这给出双曲几何的等距群刻画。", "Aut(𝔻) 与 Aut(H) 通过 Cayley 变换 z ↦ (z - i)/(z + i) 共轭，故两模型等价，可按问题便利选用。"],
        generalRequirements: ["必须核对 ad - bc ≠ 0 并在扩充复平面上处理分母为零的点。", "使用自同构公式必须验证参数在允许范围内（如 |a| < 1）。"],
        forbiddenErrors: ["【行列式退化】ad - bc = 0 仍当作变换（此时为常值映射）。", "【圆映为圆】断言 Möbius 变换必把圆映为圆而忽略直线情形。", "【无穷点未处理】不在 P¹ 上讨论极点与无穷远的像。", "【自同构参数越界】用 |a| ≥ 1 的 φ_a 作为圆盘自同构。", "【度量不变性误用】把欧氏距离当作双曲不变量。"],
        parameterConstraints: { nonDegenerate: "要求 ad - bc ≠ 0。", diskParameter: "圆盘自同构要求 |a| < 1。", realCoefficients: "上半平面自同构要求实系数且行列式为正。" },
        closureChecks: ["检查行列式非零并确定极点与 ∞ 的像。", "用三点对应验证所构造的变换。", "涉及距离或不变量时明确使用双曲度量或交比。"],
        scenarioChecks: { threePointMapping: ["用三点像唯一确定 Möbius 变换。"], regionCorrespondence: ["用一点内外测试判断区域被映到圆内还是圆外。"], hyperbolicIsometry: ["把自同构解释为双曲等距并计算双曲距离。"] },
    },
    // Riemann 面与分支覆盖。
    "riemann-surface-branched-covering": {
        definitions: ["Riemann 面是一维复流形，由全纯图册给出；多值函数通过分支覆盖在 Riemann 面上单值化，分支点处的局部模型为 z ↦ z^n。"],
        formulas: ["图册条件：坐标变换全纯；一维复流形即实二维定向曲面加复结构。", "局部模型：分支点处 f(z) = z^e（e 为分歧指数），非分支点处 e = 1。", "覆盖次数：∑_{p ∈ f^{-1}(q)} e_p = deg f（对一切 q）。", "Riemann-Hurwitz：2g_X - 2 = deg f (2g_Y - 2) + ∑_p (e_p - 1)。", "亏格与欧氏特征：χ = 2 - 2g；紧 Riemann 面由亏格拓扑分类。"],
        theorems: ["紧 Riemann 面与光滑射影代数曲线一一对应，故一维复几何与代数曲线论是同一理论的两种语言。", "√z、log z 的 Riemann 面分别为二重分支覆盖与无穷重覆盖，绕分支点一周改变分支，这正是单值群的作用。", "复结构远细于拓扑结构：亏格 g ≥ 1 的曲面上存在连续族的不等价复结构（模空间维数 3g - 3，g ≥ 2），故不能由拓扑同胚推复结构等价。", "紧 Riemann 面上的亚纯函数域是超越次数 1 的域，其上的除子与线丛理论由 Riemann-Roch 定理控制。"],
        generalRequirements: ["必须给出图册或明确的构造方式，并验证坐标变换全纯。", "讨论覆盖时必须列出分支点与分歧指数。"],
        forbiddenErrors: ["【实曲面当 Riemann 面】只给拓扑曲面而不指定复结构或不验证坐标变换全纯。", "【分支点遗漏】计算覆盖次数或用 Riemann-Hurwitz 时漏掉分支点（含无穷远点）。", "【拓扑推复结构】由同亏格断言双全纯等价。", "【分歧指数与重数混淆】把 e_p 与覆盖次数混用。", "【紧性未声明】把 Riemann-Roch、亏格等紧曲面结论用于开 Riemann 面。"],
        parameterConstraints: { holomorphicCharts: "坐标变换必须全纯。", ramificationSum: "每根纤维的分歧指数之和等于覆盖次数。", compactnessForGenus: "亏格与 Riemann-Hurwitz 的标准形式针对紧曲面。" },
        closureChecks: ["写出图册或构造并验证全纯相容性。", "列出全部分支点（含 ∞）与分歧指数并核对纤维和。", "用 Riemann-Hurwitz 校验亏格。"],
        scenarioChecks: { multivaluedUniformization: ["把 √(z³ - 1) 等代数函数化为分支覆盖并定亏格。"], genusComputation: ["用 Riemann-Hurwitz 由分支数据算亏格。"], monodromyAction: ["绕分支点的闭路给出分支置换。"] },
    },
    // 单值化定理。
    "uniformization-theorem": {
        definitions: ["单值化定理断言任意单连通 Riemann 面双全纯等价于球面、复平面或单位圆盘三者之一，从而一切 Riemann 面都是这三种模型对离散群的商。"],
        formulas: ["三分类：单连通 Riemann 面 ≅ P¹（椭圆型）、C（抛物型）或 𝔻（双曲型）。", "商表示：X = X̃/π₁(X)，π₁ 作为普遍覆盖上的自由无不动点全纯作用。", "椭圆型：仅 P¹ 自身；抛物型：C、C*、复环面 C/Λ；其余全为双曲型 𝔻/Γ（Γ 为 Fuchsian 群）。", "亏格对应：g = 0 且至多两个穿孔为非双曲；g ≥ 2 的紧曲面必双曲。", "Gauss-Bonnet 配合常曲率度量：球面 K = +1、平面 K = 0、双曲 K = -1。"],
        theorems: ["单值化定理是 Riemann 映照定理的推广（后者为平面单连通域的特例），把复结构的分类完全归结为覆盖群的分类。", "绝大多数 Riemann 面是双曲型的：只有 P¹、C、C*、环面与一次穿孔环面等有限几类不是。", "定理给出每个 Riemann 面上唯一的常曲率共形度量（双曲型上为 Poincaré 度量），故双曲几何成为研究复结构的标准工具。", "Fuchsian 群的基本区域与边界配对给出曲面的显式构造，Teichmüller 空间正是这些结构的变形空间。"],
        generalRequirements: ["必须先判断所讨论 Riemann 面的类型（椭圆、抛物、双曲）。", "用商表示时必须说明群作用自由且真不连续。"],
        forbiddenErrors: ["【类型判断遗漏】不区分三种模型直接使用双曲度量。", "【群作用条件缺失】商构造中未验证无不动点或真不连续（否则得轨形而非流形）。", "【平面与球面混淆】把 C 与 P¹ 视为共形等价（前者非紧）。", "【穿孔影响忽略】不计穿孔点数就判定类型。", "【与 Riemann 映照混用】把定理当作只适用于平面区域的结论。"],
        parameterConstraints: { simplyConnectedTarget: "三分类针对单连通 Riemann 面。", freeProperAction: "商表示要求覆盖群作用自由且真不连续。", curvatureNormalization: "常曲率度量按类型取 +1、0、-1。" },
        closureChecks: ["按亏格与穿孔数判定类型。", "写出普遍覆盖与覆盖群并验证作用性质。", "如引入度量，说明其常曲率与共形类。"],
        scenarioChecks: { typeClassification: ["由亏格与穿孔数判定椭圆、抛物或双曲型。"], torusModuli: ["复环面写成 C/Λ 并用 τ ∈ H 参数化其复结构。"], hyperbolicMetric: ["双曲型曲面上引入 Poincaré 度量作研究工具。"] },
    },
    // 几乎复结构与 Newlander-Nirenberg 定理。
    "almost-complex-newlander-nirenberg": {
        definitions: ["几乎复结构是切丛上满足 J² = -I 的自同态，它来自真正的复结构当且仅当 Nijenhuis 张量为零，这是 Newlander-Nirenberg 定理的内容。"],
        formulas: ["几乎复结构：J: TM → TM，J² = -id；诱导分解 TM ⊗ C = T^{1,0} ⊕ T^{0,1}。", "Nijenhuis 张量：N_J(X,Y) = [JX, JY] - J[JX, Y] - J[X, JY] - [X, Y]。", "Newlander-Nirenberg：N_J ≡ 0 ⇔ J 可积（存在全纯坐标图册使 J 为标准复结构）。", "等价刻画：∂̄² = 0 ⇔ dΩ^{1,0} ⊂ Ω^{2,0} ⊕ Ω^{1,1}（无 (0,2) 分量）。", "维数约束：几乎复流形的实维数必为偶数且流形可定向。"],
        theorems: ["二维情形 N_J 自动为零，故任意几乎复结构在实二维上都可积（等价于等温坐标存在），高维则是实质限制。", "S⁶ 上有几乎复结构（来自八元数）但是否存在复结构至今未知；S⁴ 则不存在几乎复结构，说明可积性与存在性都是深刻问题。", "可积性把复流形的一切局部复分析工具（全纯坐标、Dolbeault 复形、∂̄ 算子的平方为零）激活，是复几何的入口条件。", "非可积几乎复结构在辛几何（几乎复结构相容于辛形式）与 Gromov-Witten 理论中仍有核心作用，故并非只有可积情形有意义。"],
        generalRequirements: ["讨论复流形前必须说明复结构可积或直接给出全纯图册。", "涉及 J 的计算必须核对 J² = -I 与维数为偶。"],
        forbiddenErrors: ["【可积性默认】把几乎复结构当作复结构使用而不验证 N_J = 0。", "【奇维数流形】在奇维实流形上讨论几乎复结构。", "【二维结论推广】用二维的自动可积性断言高维亦然。", "【几乎复与复混称】把「存在几乎复结构」当作「是复流形」。", "【Nijenhuis 张量项数遗漏】计算 N_J 时漏项或符号错误。"],
        parameterConstraints: { evenDimension: "实维数必为偶数且流形可定向。", involutiveCondition: "可积性等价于 T^{1,0} 在 Lie 括号下闭。", dimensionTwoSpecial: "实二维情形 N_J 自动为零。" },
        closureChecks: ["验证 J² = -I 与维数条件。", "计算 N_J 或验证 T^{1,0} 的对合性。", "可积后再引用全纯坐标与 Dolbeault 理论。"],
        scenarioChecks: { integrabilityCheck: ["计算 Nijenhuis 张量判定可积性。"], surfaceCase: ["实二维情形直接引用自动可积性（等温坐标）。"], symplecticCompatibility: ["讨论与辛形式相容的几乎复结构而不要求可积。"] },
    },
    // Dolbeault 上同调。
    "dolbeault-cohomology": {
        definitions: ["Dolbeault 上同调是复流形上 (p,q) 形式关于 ∂̄ 算子的上同调，是全纯层上同调的解析实现，并给出 Hodge 数。"],
        formulas: ["形式分解：Ω^k = ⊕_{p+q=k} Ω^{p,q}；d = ∂ + ∂̄，∂² = ∂̄² = 0，∂∂̄ + ∂̄∂ = 0。", "Dolbeault 上同调：H^{p,q}(X) = ker(∂̄: Ω^{p,q} → Ω^{p,q+1})/im(∂̄: Ω^{p,q-1} → Ω^{p,q})。", "Dolbeault 定理：H^{p,q}(X) ≅ H^q(X, Ω^p)（Ω^p 为全纯 p 形式层）。", "∂̄-Poincaré 引理：多圆盘上 ∂̄ 闭的 (p,q) 形式（q ≥ 1）局部 ∂̄ 精确。", "Hodge 数：h^{p,q} = dim H^{p,q}；紧情形有限维。"],
        theorems: ["∂̄-Poincaré 引理是全局理论的局部基础，它使 Dolbeault 复形成为 Ω^p 的细分解，从而由抽象de Rham型论证得 Dolbeault 定理。", "一般紧复流形上 H^k_{dR} 与 ⊕ H^{p,q} 之间只有谱序列关系而无直和分解，分解需 Kähler 条件（Frölicher 谱序列可不退化）。", "H^{0,q}(X) = H^q(X, O_X) 度量全纯函数层的障碍，H^{0,1} ≠ 0 正是某些方程不可解与 Picard 群非平凡的来源。", "小平消灭定理与 Serre 消灭定理都以 Dolbeault 上同调的消失为结论，从而把几何正性条件转化为可计算的代数信息。"],
        generalRequirements: ["必须区分 d、∂、∂̄ 上同调，不得混用。", "使用 Dolbeault 定理必须明确层 Ω^p 与指标 (p,q) 的对应。"],
        forbiddenErrors: ["【指标错位】把 H^{p,q} 写成 H^p(X, Ω^q)。", "【分解无条件断言】在非 Kähler 紧复流形上断言 H^k = ⊕_{p+q=k} H^{p,q}。", "【局部与全局混淆】用 ∂̄-Poincaré 引理断言全局精确性。", "【实与复上同调混用】把 de Rham 上同调维数直接当作 Hodge 数之和。", "【非紧情形有限维】在非紧流形上默认上同调有限维。"],
        parameterConstraints: { bidegree: "算子 ∂̄ 把 (p,q) 映到 (p,q+1)。", localExactness: "∂̄-Poincaré 引理要求 q ≥ 1 且定义域为多圆盘（凸型）。", compactnessForFiniteness: "有限维性需紧性（或适当的椭圆性条件）。" },
        closureChecks: ["核对双次数与算子作用方向。", "引用 Dolbeault 定理时写清对应的层。", "断言分解或有限维前检查 Kähler 性与紧性。"],
        scenarioChecks: { hodgeNumberComputation: ["由已知层上同调算 h^{p,q} 并列 Hodge 菱形。"], obstructionInterpretation: ["用 H^{0,1} 解释 ∂̄ 方程的可解性障碍。"], vanishingTheoremUse: ["用消灭定理把正性条件转为上同调消失。"] },
    },
    // Kähler 度量与 Kähler 恒等式。
    "kahler-metric-identities": {
        definitions: ["Kähler 度量是复流形上其关联二形式闭合的 Hermitian 度量，这一相容条件把复结构、度量与辛结构统一，并导出一族算子恒等式。"],
        formulas: ["Hermitian 度量：h = ∑ h_{jk̄} dz^j ⊗ dz̄^k，h_{jk̄} 正定 Hermitian。", "Kähler 形式：ω = (i/2)∑ h_{jk̄} dz^j ∧ dz̄^k；Kähler 条件 dω = 0。", "局部 Kähler 势：dω = 0 ⇒ 局部存在实函数 φ 使 ω = i∂∂̄φ。", "Kähler 恒等式：[Λ, ∂̄] = -i∂*，[Λ, ∂] = i∂̄*，[L, ∂̄*] = i∂ 等（L 为与 ω 的楔积，Λ 为其伴随）。", "推论：Δ_d = 2Δ_{∂̄} = 2Δ_∂，即三个 Laplace 算子相差常数倍。"],
        theorems: ["Kähler 条件等价于复结构 J 关于度量的 Levi-Civita 联络平行（∇J = 0），因此 Kähler 是黎曼、复与辛三种几何的交汇点。", "Kähler 恒等式是 Hodge 分解、hp,q 对称性与 Lefschetz 分解的共同来源，故这些结论都依赖 Kähler 条件而非仅复结构。", "射影空间与其一切光滑射影子流形都是 Kähler（Fubini-Study 度量的限制），故代数几何的对象自动落入 Kähler 框架。", "非 Kähler 复流形确实存在（Iwasawa 流形、Kodaira-Thurston 流形、Hopf 曲面），其上 Hodge 分解与 b₁ 的偶性都可失效。"],
        generalRequirements: ["必须验证 dω = 0 才能引用 Kähler 框架下的结论。", "度量的正定性与 Hermitian 性必须明确。"],
        forbiddenErrors: ["【Kähler 条件默认】在一般 Hermitian 流形上使用 Kähler 恒等式或 Hodge 分解。", "【Kähler 势全局化】断言 Kähler 势全局存在（紧情形一般不存在，只有局部）。", "【正定性遗漏】只写形式而不验证 h_{jk̄} 正定。", "【辛与 Kähler 等同】认为辛流形都是 Kähler（Thurston 反例）。", "【Laplace 算子系数错误】写成 Δ_d = Δ_{∂̄} 而漏系数 2。"],
        parameterConstraints: { positiveDefinite: "h_{jk̄} 需正定 Hermitian。", closedForm: "Kähler 条件为 dω = 0。", localPotential: "Kähler 势只保证局部存在。" },
        closureChecks: ["验证 ω 的闭性与度量正定性。", "使用恒等式前确认 Kähler 条件成立。", "涉及紧性结论时另行声明紧致性假设。"],
        scenarioChecks: { fubiniStudyMetric: ["射影空间及其子流形用 Fubini-Study 度量的限制。"], laplacianComparison: ["用 Kähler 恒等式把 ∂̄-Laplace 与 d-Laplace 互换。"], nonKahlerExample: ["用 Iwasawa 或 Hopf 曲面说明 Kähler 条件的实质性。"] },
    },
    // Kähler 流形的 Hodge 分解。
    "hodge-decomposition-kahler": {
        definitions: ["紧 Kähler 流形上的 Hodge 分解把 de Rham 上同调分解为 Dolbeault 分量的直和，并给出 Hodge 数的对称性与 Lefschetz 结构。"],
        formulas: ["Hodge 分解：H^k(X, C) = ⊕_{p+q=k} H^{p,q}(X)。", "共轭对称：h^{p,q} = h^{q,p}；Serre 对偶：h^{p,q} = h^{n-p,n-q}（n = dim_C X）。", "Betti 数：b_k = ∑_{p+q=k} h^{p,q}；推论 b_{2k+1} 为偶数。", "硬 Lefschetz：L^{n-k}: H^k ≅ H^{2n-k} 为同构（L 为与 ω 的楔积），并给出原始分解。", "Hodge 恒等式基础：每个上同调类有唯一调和代表元（Hodge 定理）。"],
        theorems: ["分解依赖 Kähler 条件：非 Kähler 紧复流形上可有 b₁ 为奇数（Hopf 曲面）从而分解失效。", "由 h^{1,0} = h^{0,1} 得 b₁ = 2h^{1,0}，故紧 Kähler 流形的第一 Betti 数必为偶数，这是最常用的非 Kähler 判别法。", "硬 Lefschetz 给出 Betti 数的单峰性（b_0 ≤ b_2 ≤ ... 到中间维数），可用于排除某些拓扑类型承载 Kähler 结构。", "Hodge 理论的紧性依赖：非紧情形需 L² 理论或加权空间，分解与有限维性均可失效。"],
        generalRequirements: ["必须同时声明紧性与 Kähler 条件。", "引用 Hodge 数对称性必须区分共轭对称与 Serre 对偶。"],
        forbiddenErrors: ["【条件缺失】在非紧或非 Kähler 情形使用 Hodge 分解。", "【两种对称混淆】把 h^{p,q} = h^{q,p} 与 h^{p,q} = h^{n-p,n-q} 混用。", "【奇 Betti 数】给出 b₁ 为奇数的紧 Kähler 例子。", "【Lefschetz 方向错误】把 L^{n-k} 的定义域与值域颠倒。", "【调和代表元唯一性推广】在非紧情形断言唯一调和代表元。"],
        parameterConstraints: { compactKahler: "要求 X 紧且 Kähler。", dimensionIndex: "Serre 对偶中的 n 为复维数。", lefschetzRange: "硬 Lefschetz 中 k ≤ n。" },
        closureChecks: ["核对紧性与 Kähler 条件。", "列 Hodge 菱形并检验两类对称性与 b_k 的求和。", "用 b₁ 的偶性或 Lefschetz 单峰性作一致性检验。"],
        scenarioChecks: { hodgeDiamond: ["由部分 Hodge 数用对称性补全菱形。"], kahlerObstruction: ["用 b₁ 奇数或 Lefschetz 失效证明不存在 Kähler 结构。"], surfaceInvariants: ["复曲面用 Hodge 数计算 χ 与 Noether 公式相关不变量。"] },
    },
    // Kodaira 嵌入定理。
    "kodaira-embedding-theorem": {
        definitions: ["Kodaira 嵌入定理刻画哪些紧复流形是射影代数的：存在正线丛（等价地，Kähler 类为整类）当且仅当流形可全纯嵌入射影空间。"],
        formulas: ["定理：X 紧复流形，存在全纯线丛 L 使 c₁(L) 可由正的 (1,1) 形式代表 ⇒ 某个 L^{⊗m} 给出嵌入 X ↪ P^N。", "Hodge 流形：紧 Kähler 且 [ω] ∈ H²(X, Z)（整 Kähler 类）。", "嵌入实现：由 H⁰(X, L^{⊗m}) 的基 s_0, ..., s_N 定义 x ↦ [s_0(x) : ... : s_N(x)]。", "Kodaira 消灭定理：L 正 ⇒ H^q(X, K_X ⊗ L) = 0（q ≥ 1）。", "Chow 定理：P^N 的闭复子流形必为代数簇，故嵌入后自动获得代数结构。"],
        theorems: ["定理把「射影代数性」这一代数条件完全转化为线丛正性这一微分几何条件，是 GAGA 型对应的核心一环。", "正性不可省：一般复环面 C^n/Λ（n ≥ 2）是 Kähler 但 Kähler 类不整，故非代数，说明 Kähler 严格弱于射影。", "需要取足够高次幂 m：L 本身给出的映射可能不是嵌入（甚至无处定义），只有 m ≫ 0 时才分离点与切向。", "证明依赖 Kodaira 消灭定理与凹凸性论证，消灭定理的正性假设同样不可弱化为半正。"],
        generalRequirements: ["必须说明所用线丛的正性（或 Kähler 类的整性）。", "嵌入结论必须允许取足够高的张量幂。"],
        forbiddenErrors: ["【Kähler 即射影】由 Kähler 断言射影代数。", "【幂次固定】断言 L 本身即给出嵌入。", "【正性弱化】用半正或仅非负的线丛套用定理。", "【紧性遗漏】在非紧复流形上套用。", "【消灭定理指标错误】写成 H^q(X, L) = 0 而漏掉 K_X 因子。"],
        parameterConstraints: { positiveLineBundle: "需存在正线丛（曲率形式正定）。", integralKahlerClass: "等价条件为 Kähler 类属于 H²(X, Z) 的像。", sufficientlyLargePower: "嵌入需 m ≫ 0。" },
        closureChecks: ["验证线丛正性或 Kähler 类整性。", "说明所取幂次足够大以分离点与切方向。", "嵌入后可引用 Chow 定理得到代数簇结构。"],
        scenarioChecks: { projectivityCriterion: ["用整 Kähler 类判定紧复流形是否射影。"], nonAlgebraicTorus: ["用一般复环面说明 Kähler 不足以推出射影。"], vanishingApplication: ["用 Kodaira 消灭定理计算截面维数或证明超越性结论。"] },
    },
    // 拟共形映射与 Teichmüller 空间。
    "quasiconformal-teichmuller-space": {
        definitions: ["拟共形映射允许有界的角度畸变，由 Beltrami 系数刻画；Teichmüller 空间是曲面上复结构的变形空间，其点由 Beltrami 微分的等价类给出。"],
        formulas: ["Beltrami 方程：f_{z̄} = μ f_z，‖μ‖_∞ = k < 1。", "最大伸缩商：K = (1 + k)/(1 - k)，K = 1 ⇔ 共形。", "可测 Riemann 映照定理：任意可测 μ 且 ‖μ‖_∞ < 1 存在拟共形解，在归一化下唯一。", "Teichmüller 空间维数：dim_C T(S_g) = 3g - 3（g ≥ 2）；带 n 个穿孔时为 3g - 3 + n。", "Teichmüller 度量：d(X, Y) = (1/2) inf log K(f)（f 取同伦类内的拟共形映射）。"],
        theorems: ["可测 Riemann 映照定理是 Riemann 映照定理的推广（μ = 0 时回到共形情形），它把复结构的变形化为 Beltrami 系数的选取。", "Teichmüller 空间同胚于 R^{6g-6}（g ≥ 2）故为胞腔，模空间 M_g = T(S_g)/Mod(S_g) 则有轨形奇点，两者不可混同。", "Teichmüller 唯一极值映射定理：每个同伦类中存在唯一的极值拟共形映射，其 Beltrami 系数由全纯二次微分给出（Teichmüller 微分）。", "余切空间与全纯二次微分空间同构（dim = 3g - 3），这解释了维数公式并联系到 Riemann-Roch 计算。"],
        generalRequirements: ["必须给出 ‖μ‖_∞ < 1 的界，退化到 1 时理论失效。", "讨论 Teichmüller 空间必须区分它与模空间（是否商去映射类群）。"],
        forbiddenErrors: ["【伸缩界缺失】允许 ‖μ‖_∞ = 1 或 K 无界。", "【Teichmüller 与模空间混同】把 T(S_g) 的胞腔性质说成 M_g 的性质。", "【维数公式误用】对 g ≤ 1 套用 3g - 3（球面为 0 维，环面为 1 维，需单独处理）。", "【拟共形当共形】用共形不变量（如全纯性）处理拟共形映射。", "【可测性条件忽略】要求 μ 连续或光滑（定理只需可测）。"],
        parameterConstraints: { dilatationBound: "要求 ‖μ‖_∞ < 1（等价 K < ∞）。", genusRange: "维数公式 3g - 3 适用于 g ≥ 2；低亏格需单独讨论。", markingEquivalence: "Teichmüller 空间的点为带标记的复结构等价类。" },
        closureChecks: ["写出 Beltrami 系数并核对其模的上界。", "明确所讨论对象是 Teichmüller 空间还是模空间。", "低亏格情形单独给出维数与结构。"],
        scenarioChecks: { beltramiSolution: ["由给定 μ 用可测 Riemann 映照定理构造拟共形映射。"], moduliDimension: ["用全纯二次微分空间维数解释 3g - 3。"], extremalMapping: ["同伦类内求极值拟共形映射并识别 Teichmüller 微分。"] },
    },
};

