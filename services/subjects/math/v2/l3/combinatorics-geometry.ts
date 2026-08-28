import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“组合几何”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMBINATORICS_GEOMETRY_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Sylvester-Gallai 定理与普通直线计数。
    "combgeom-sylvester-gallai": {
        id: "combgeom-sylvester-gallai", l2Key: "combinatorics-geometry", name: "Sylvester-Gallai 定理与普通直线", kind: "theorem",
        aliases: ["Sylvester-Gallai定理", "普通直线", "Green-Tao普通直线界", "Orchard问题"],
    },
    // Szemerédi-Trotter 入射界。
    "combgeom-szemeredi-trotter": {
        id: "combgeom-szemeredi-trotter", l2Key: "combinatorics-geometry", name: "Szemerédi-Trotter 入射界", kind: "theorem",
        aliases: ["Szemerédi-Trotter定理", "点线入射数", "入射几何上界", "富直线计数"],
    },
    // 交叉数引理与嵌入方法。
    "combgeom-crossing-lemma": {
        id: "combgeom-crossing-lemma", l2Key: "combinatorics-geometry", name: "交叉数引理", kind: "lemma",
        aliases: ["交叉数引理", "crossing number lemma", "交叉数下界", "Ajtai-Chvátal-Newborn-Szemerédi界"],
    },
    // 单位距离问题与上界方法。
    "combgeom-unit-distance": {
        id: "combgeom-unit-distance", l2Key: "combinatorics-geometry", name: "单位距离问题与上界", kind: "theorem",
        aliases: ["单位距离问题", "单位距离图", "Erdős单位距离猜想", "整格构造下界"],
    },
    // 相异距离问题与 Guth-Katz 定理。
    "combgeom-distinct-distances": {
        id: "combgeom-distinct-distances", l2Key: "combinatorics-geometry", name: "相异距离问题与 Guth-Katz 定理", kind: "theorem",
        aliases: ["相异距离问题", "Guth-Katz定理", "距离集下界", "Elekes-Sharir框架"],
    },
    // 多项式分割法。
    "combgeom-polynomial-partitioning": {
        id: "combgeom-polynomial-partitioning", l2Key: "combinatorics-geometry", name: "多项式分割法", kind: "lemma",
        aliases: ["多项式分割", "polynomial partitioning", "Guth-Katz分割引理", "多项式胞腔分解"],
    },
    // VC 维与 epsilon-网定理。
    "combgeom-epsilon-net": {
        id: "combgeom-epsilon-net", l2Key: "combinatorics-geometry", name: "VC 维与 epsilon-网定理", kind: "theorem",
        aliases: ["epsilon-网定理", "VC维", "Sauer-Shelah引理", "epsilon-逼近"],
    },
    // 切割引理与配置的分治。
    "combgeom-cutting-lemma": {
        id: "combgeom-cutting-lemma", l2Key: "combinatorics-geometry", name: "切割引理", kind: "lemma",
        aliases: ["切割引理", "cutting lemma", "1/r-切割", "超平面配置分治"],
    },
    // 凸位置与 Erdős-Szekeres 凸多边形定理。
    "combgeom-convex-position": {
        id: "combgeom-convex-position", l2Key: "combinatorics-geometry", name: "凸位置与凸多边形存在定理", kind: "theorem",
        aliases: ["凸位置", "凸多边形存在定理", "Happy Ending问题", "Suk上界"],
    },
    // 火腿三明治定理与均分。
    "combgeom-ham-sandwich": {
        id: "combgeom-ham-sandwich", l2Key: "combinatorics-geometry", name: "火腿三明治定理与均分", kind: "theorem",
        aliases: ["火腿三明治定理", "ham-sandwich定理", "同时均分", "中心横截"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMBINATORICS_GEOMETRY_L3_RULES: Record<string, MathV2L3Rules> = {
    // Sylvester-Gallai 定理与普通直线计数。
    "combgeom-sylvester-gallai": {
        definitions: ["Sylvester-Gallai 定理断言：实平面上有限多个不全共线的点必存在一条“普通直线”（ordinary line），即恰过其中两个点的直线；它是入射几何中最基本的“非退化必留痕迹”结论，其力量完全依赖实系数的序结构"],
        formulas: ["定理：P ⊂ R^2 有限、|P| = n >= 3 且不全共线 ⇒ 至少存在一条恰含 2 个 P 点的直线", "Green-Tao（n 充分大）：普通直线数 >= n/2，且当 n 为偶数时该界可达（三次曲线上的构造）；n 为奇数时最优值为 3(n-1)/4 型", "Kelly-Moser 弱界：普通直线数 >= 3n/7", "对偶形式：R^2 中 n 条不全共点的直线必有一个恰由两条直线确定的交点（simple point）", "Orchard 问题（互补计数）：三点共线的直线最多 floor(n(n-3)/6) + 1 条，界由 Green-Tao 对大 n 证实", "Kelly 定理（复情形替代）：C^2（等价地 CP^2）中不存在普通直线的非共线点集必落在一个复平面（二维复线性子空间的仿射像）内"],
        theorems: ["定理在复数域上直接失效：Hesse 配置（9 点 12 线，每线 3 点）在 CP^2 中没有普通直线，故任何“同样论证适用于复平面”的说法都是错误的；复情形的正确陈述是 Kelly 定理（共面性结论）而非普通直线存在性", "在有限域平面上也失效：PG(2, q) 的全部点集每条直线含 q+1 >= 3 个点，说明定理本质用到实数的序（凸性/最小距离论证），不能作为纯组合入射公理的推论", "标准证明是 Gallai 的极小距离论证或投影对偶后的凸包论证：取点到直线的最小正距离并导出矛盾；该论证不给出普通直线的条数，故不能由它推出 n/2 型下界", "n/2 的界是紧的但只对充分大的 n：小 n 有例外（如 n = 7 的 Kelly-Moser 配置只有 3 条普通直线），因此引用 n/2 时必须附加“n 充分大”", "定理只保证存在性，不保证普通直线通过指定点，也不给出其位置；把结论加强为“每点都在某条普通直线上”是错误的"],
        generalRequirements: ["必须声明点集有限、不全共线且在实平面（或实射影平面）中", "使用 n/2 等定量下界时必须写明“n 充分大”并区分奇偶最优值", "使用极小距离论证时必须说明为何最小正距离存在（有限性）"],
        forbiddenErrors: ["【域推广错误】把定理照搬到 C^2 或 CP^2，忽略 Hesse 配置反例", "【有限域误用】在 PG(2, q) 上断言存在普通直线", "【条数臆断】由 Gallai 的存在性论证直接给出普通直线的条数下界", "【小规模界误用】对小 n 使用 n/2 或 3(n-1)/4 的最优界", "【结论加强】断言每个点都落在某条普通直线上，或普通直线可任意指定方向", "【共线退化遗漏】未排除全部点共线的情形（此时结论无意义）"],
        parameterConstraints: { fieldRequirement: "必须在实数（有序域）上，复数与有限域反例存在", pointCount: "n >= 3 且点不全共线", asymptoticThreshold: "n/2 与 3(n-1)/4 的最优界只对充分大 n 成立", parityDependence: "最优普通直线数依赖 n 的奇偶", finiteness: "点集必须有限，极小距离论证依赖有限性" },
        closureChecks: ["确认点集有限、在实平面内且不全共线。", "给出普通直线的存在性论证（极小距离或对偶凸包）。", "若需条数下界，说明 n 充分大并按奇偶给出最优值。", "若涉及复域或有限域，改用 Kelly 定理或指出反例。"],
        scenarioChecks: { existenceProof: ["用极小距离论证给出普通直线", "说明有限性保证最小值存在", "指出矛盾来源"], quantitativeCount: ["引用 Green-Tao 的 n/2 型界", "声明 n 充分大", "按奇偶给出最优构造"], fieldComparison: ["复情形引用 Hesse 配置反例", "改述为 Kelly 共面性定理", "有限域情形给出 PG(2,q) 反例"] },
    },
    // Szemerédi-Trotter 入射界。
    "combgeom-szemeredi-trotter": {
        definitions: ["Szemerédi-Trotter 定理给出平面上点集与直线集之间入射对个数 I(P, L) 的最优上界，是把“富直线不能太多”这一几何事实定量化的核心工具，几乎所有平面入射型估计都归约到它"],
        formulas: ["入射数定义：I(P, L) = #{(p, l) ∈ P × L : p ∈ l}，|P| = m，|L| = n", "主界：I(P, L) = O(m^{2/3} n^{2/3} + m + n)，且该界在 m ≈ n 时给出 Theta(n^{4/3})，是最优的（格点构造达到）", "富直线形式：至少含 k 个点的直线条数为 O(m^2/k^3 + m/k)（k >= 2）", "对偶富点形式：至少落在 k 条直线上的点数为 O(n^2/k^3 + n/k)", "平凡界（不可省的比较对象）：由 Cauchy-Schwarz 与两点定一线得 I = O(m n^{1/2} + n)，Szemerédi-Trotter 在 n 远小于 m^2 的范围内更强", "标准证明：交叉数引理（把入射图画成平面图）或切割引理分治；多项式分割给出高维推广", "曲线推广：若曲线族满足两点至多定 C 条曲线、两条曲线至多交 C 点，则同型界成立（常数依赖 C）"],
        theorems: ["界的三项形式不可简化为单项：m 与 n 两个线性项在极端不平衡（m 远大于 n^2 或 n 远大于 m^2）时占主导，只写 m^{2/3}n^{2/3} 会给出错误的（更小的）界", "最优性由 sqrt-格点构造给出（P 为 N × 2N^2 型格点，L 为斜率与截距受限的直线），故不能期待改进指数；任何“可改进为 m^{1/2}n^{1/2}”的说法都是错误的", "定理在复平面上仍成立（Tóth、Zahl），但在有限域上完全失效：F_q^2 的全部点与全部直线给出 I ≈ q^3 远超 O(m^{2/3}n^{2/3})；有限域入射需 Bourgain-Katz-Tao 型和积方法", "结论是上界而非下界：不能由它断言存在富直线；下界需构造或用 Beck 定理（n 点不共线时至少有 c n^2 条连线或存在含 c n 点的直线）", "推论方向固定：由入射界得到相异距离、单位距离、和积等估计，是把几何问题编码为点线入射；编码步骤（如把距离化为入射）必须显式给出并核验重数"],
        generalRequirements: ["必须写出完整三项界并说明各项主导的参数范围", "用于曲线族时必须验证两点定曲线条数与两曲线交点数的有界性", "在有限域或非实域上使用时必须改换工具并说明原因"],
        forbiddenErrors: ["【项遗漏】只写 O(m^{2/3}n^{2/3}) 而丢掉 + m + n", "【指数臆改】声称可改进为更小的指数，忽略格点构造的最优性", "【有限域误用】在 F_q^2 上直接套用 Szemerédi-Trotter", "【上下界混淆】用入射上界断言富直线的存在", "【曲线条件遗漏】对任意曲线族套用直线情形结论而不验证交点重数", "【富直线公式错】把富直线界写成 O(m^2/k^2) 或省略 m/k 项"],
        parameterConstraints: { pointLineCounts: "m = |P|、n = |L| 均有限，界含 m 与 n 的线性项", richnessRange: "富直线界要求 k >= 2，且 k <= m", fieldRequirement: "实（或复）平面成立，有限域失效", curveFamilyDegrees: "曲线推广需两点至多 C 条曲线、两曲线至多 C 交点", optimality: "格点构造说明指数 2/3 不可改进" },
        closureChecks: ["写出完整三项入射界并判断主导项。", "若用富直线/富点形式，核对 k 的范围与两项之和。", "说明所用几何对象是直线还是需验证条件的曲线族。", "若把几何问题编码为入射，显式给出编码并核验重数。"],
        scenarioChecks: { incidenceUpperBound: ["代入 m、n 判断主导项", "给出完整三项界", "必要时对比平凡 Cauchy-Schwarz 界"], richLinesCounting: ["用 O(m^2/k^3 + m/k) 计数", "确认 k >= 2", "说明两项的适用区间"], geometricApplication: ["把距离或和积问题编码为点线入射", "核验编码的重数与退化情形", "由入射界导出目标估计"] },
    },
    // 交叉数引理与嵌入方法。
    "combgeom-crossing-lemma": {
        definitions: ["交叉数引理给出稠密图在平面上任何画法都必须产生的交叉数下界：交叉数 cr(G) 与边数的三次、顶点数的平方成比例；它把“图太稠密画不平面”定量化，是入射几何与嵌入型证明的通用引擎"],
        formulas: ["交叉数 cr(G)：G 的所有平面画法中边交叉对数的最小值；cr(G) = 0 当且仅当 G 可平面", "Euler 型基础界：简单平面图满足 m <= 3n - 6，故 m > 3n - 6 时 cr(G) >= m - (3n - 6)", "交叉数引理（ACNS）：若 m >= 4n，则 cr(G) >= m^3/(64 n^2)", "当前最优常数：cr(G) >= m^3/(29 n^2)（Ackerman），对应假设 m >= 6.95n 型条件", "二部/无三角情形改进：无三角图（用 m <= 2n - 4）给出 cr(G) >= m^3/(c n^2) 的更好常数", "证明机制：对随机诱导子图取期望（概率放大论证）+ Euler 界；随机保留概率 p = 4n/m 是最优选择", "推论（Szemerédi-Trotter）：把点作顶点、直线上相邻点对作边，得 I <= O(m^{2/3}n^{2/3} + m + n)"],
        theorems: ["稠密性条件 m >= 4n（或 m > c n）不可省：稀疏图可平面，cr = 0，而 m^3/(64 n^2) > 0，故无条件套用引理直接给出错误的正下界", "常数 1/64 不是最优但形式不可改进：cr = Theta(m^3/n^2) 的量级由完全图 K_n 的画法给出（cr(K_n) = Theta(n^4)），因此指数 3 与 -2 是紧的", "交叉数是画法的最小值，不是某个具体画法的交叉数：由一个坏画法的交叉数不能推出 cr(G)，只能得上界", "交叉数与相关变体不等价：矫直交叉数（rectilinear crossing number，直线段画法）一般严格大于 cr(G)，成对交叉数与奇交叉数虽渐近同阶但定义不同，混用会导致错误的等式", "K_n 与 K_{m,n} 的精确交叉数未完全解决（Zarankiewicz 猜想对 K_{m,n} 仍未证），故不能引用精确公式作为已知结论", "多重边必须先约化：允许重边时 cr 可任意大而与稠密性无关，引理陈述针对简单图"],
        generalRequirements: ["使用引理必须先验证 m >= 4n（或所引版本的稠密性阈值）", "必须区分 cr(G) 的最小性与具体画法给出的上界", "推导入射界时必须显式给出图的构造并检验简单性（无重边）"],
        forbiddenErrors: ["【稠密条件遗漏】对 m < 4n 的图套用 m^3/(64 n^2) 下界", "【最小性混淆】用某个画法的交叉数当作 cr(G)", "【变体混用】把矫直交叉数与交叉数当作同一量", "【精确值臆断】给出 K_n 或 K_{m,n} 的精确交叉数作为已知定理", "【重边未约化】对多重图直接套用简单图版本", "【指数错误】把界写成 m^2/n 或 m^3/n"],
        parameterConstraints: { densityThreshold: "需 m >= 4n（最优常数版本要求 m >= 6.95n 型）", simpleGraph: "G 必须是简单图，重边需先约化", constantVersion: "常数 1/64 与 1/29 对应不同阈值，不可混搭", planarBaseline: "Euler 界 m <= 3n - 6 需 n >= 3", triangleFreeVariant: "无三角改进版本需验证无三角形" },
        closureChecks: ["核验图为简单图并计算 n、m。", "确认稠密性阈值成立后套用相应常数版本。", "说明得到的是 cr(G) 的下界而非某画法的值。", "若用于入射界，写出点边构造并核验重数。"],
        scenarioChecks: { crossingLowerBound: ["核对 m >= 4n", "代入 m^3/(64 n^2)", "声明常数版本"], incidenceDerivation: ["把点线入射编码为图", "确认边无重复", "由交叉数引理得 4/3 次幂界"], planarityContrast: ["m <= 3n - 6 只能证非平面", "cr = 0 等价于可平面", "稀疏图不得套用引理"] },
    },
    // 单位距离问题与上界方法。
    "combgeom-unit-distance": {
        definitions: ["单位距离问题问：平面上 n 个点最多能确定多少对距离恰为 1 的点对，即单位距离图的最大边数 u(n)；它是入射几何中上界与构造差距最大的核心问题之一，目前上下界仍未匹配"],
        formulas: ["定义：u(n) = max #{(p, q) ⊂ P : |p - q| = 1}，|P| = n ⊂ R^2", "Erdős 下界（格点构造）：u(n) >= n^{1 + c/log log n}，来自适当缩放的整格与表示为两平方和的数的除数函数增长", "上界（Spencer-Szemerédi-Trotter）：u(n) = O(n^{4/3})，由把单位圆族与点集的入射编码为 Szemerédi-Trotter 型问题得到", "Erdős 单位距离猜想：u(n) = n^{1 + o(1)}（即对任意 eps > 0 有 u(n) = O(n^{1+eps})），至今未解决", "三维情形：u_3(n) = Theta(n^{4/3}) 型上界为 O(n^{3/2})，与平面情形指数不同；四维及以上有 Lenz 构造给出 Theta(n^2)", "F_q^2 及球面等其他度量下结论形态不同，不能沿用平面指数"],
        theorems: ["上界 O(n^{4/3}) 的机制是每两点确定至多两个单位圆心、两单位圆至多交两点，故单位圆族满足 Szemerédi-Trotter 的曲线条件；缺少这两条重数验证时该编码无效", "上下界差距是本质的：n^{4/3} 与 n^{1+o(1)} 之间的差距不能靠现有入射方法弥合，任何声称已证 Erdős 猜想或已把上界降到 n log n 的论断都是错误的", "维数四及以上问题退化：Lenz 构造（两个正交圆上取点）在 R^4 给出 Theta(n^2) 条单位距离，故“高维更难”的直觉相反——高维反而平凡，问题只在 d = 2, 3 有意义", "单位距离图的结构性质与计数分离：其色数（Hadwiger-Nelson 问题，已知在 5 到 7 之间，de Grey 给出下界 5）与边数上界无直接推导关系，不能互推", "单位距离并非相异距离问题的对偶：单个距离的重数最大值与相异距离个数的最小值是两个不同的量，Guth-Katz 解决了后者而前者仍开放"],
        generalRequirements: ["必须区分上界（O(n^{4/3})）与下界构造（格点，n^{1+c/log log n}）并声明二者未匹配", "使用入射方法时必须验证单位圆族的两点定圆数与两圆交点数", "涉及维数时必须分别处理 d = 2、d = 3 与 d >= 4"],
        forbiddenErrors: ["【猜想当定理】把 u(n) = n^{1+o(1)} 作为已证结论", "【界的方向混淆】把格点构造的下界写成上界或反之", "【重数验证缺失】不检验两圆交点数就套用 Szemerédi-Trotter", "【高维沿用】把平面指数 4/3 用到 R^4（Lenz 构造给出 n^2）", "【问题混淆】把单位距离最大重数与相异距离最小个数混为一题", "【色数误引】用 Hadwiger-Nelson 的色数界推导边数上界"],
        parameterConstraints: { dimension: "d = 2 上界 O(n^{4/3})；d = 3 为 O(n^{3/2})；d >= 4 由 Lenz 给出 Theta(n^2)", metricRequirement: "结论依赖欧氏度量，其他范数（如 l_infinity）可有 Theta(n^2)", scaling: "距离 1 可由缩放归一，但点集须有限", curveMultiplicity: "入射编码需两点至多定两圆、两圆至多两交点", openStatus: "n^{1+o(1)} 仅为猜想" },
        closureChecks: ["明确维数与度量。", "上界经由单位圆入射编码并验证重数条件。", "下界给出格点构造并说明除数函数增长来源。", "声明上下界之间的差距仍未解决。"],
        scenarioChecks: { upperBoundDerivation: ["把单位距离编码为点与单位圆的入射", "验证两点定圆与两圆交点重数", "得 O(n^{4/3})"], lowerBoundConstruction: ["取缩放整格", "用两平方和表示数的除数估计", "给出 n^{1+c/log log n}"], dimensionComparison: ["d = 3 用 O(n^{3/2})", "d >= 4 引用 Lenz 构造", "说明高维问题平凡化"] },
    },
    // 相异距离问题与 Guth-Katz 定理。
    "combgeom-distinct-distances": {
        definitions: ["相异距离问题问：平面上 n 个点至少确定多少个不同的距离，即 g(n) = min |{|p - q| : p, q ∈ P}|；Guth-Katz 定理给出 g(n) = Omega(n/log n)，与格点上界 O(n/sqrt(log n)) 只差 sqrt(log n) 因子，是多项式方法的里程碑"],
        formulas: ["定义：g(n) = min_{|P| = n} #{不同距离}", "Guth-Katz 下界：g(n) >= c n / log n", "Erdős 上界（整格构造）：g(n) = O(n / sqrt(log n))，来自 [sqrt n] × [sqrt n] 格中两平方和可表数的密度（Landau-Ramanujan）", "Erdős 猜想：g(n) = Theta(n / sqrt(log n))，即上界是真值，仍未证明", "Elekes-Sharir 框架：把距离重复计数转为平面刚体运动群中的入射——四元组 (p, q, p', q') 满足 |pq| = |p'q'| 对应一条 R^3 中的直线，问题化为直线族的富点计数", "关键归约：距离数 >= c n^2 / Q，其中 Q = #{(p,q,p',q') : |pq| = |p'q'|} 为等距四元组数；Guth-Katz 证明 Q = O(n^3 log n)", "所用工具：R^3 中的多项式分割 + 直线的 Guth-Katz 富点定理（n 条直线中至多 O(n^{3/2}) 个三重点，配以退化平面/正则曲面的处理）"],
        theorems: ["下界与上界之间的 sqrt(log n) 差距尚未消除：Guth-Katz 解决的是 Erdős 猜想的“对数因子精度”版本，不是猜想本身；把 n/log n 与 n/sqrt(log n) 当作同一结论是错误的", "Elekes-Sharir 归约的正确方向是把相异距离的下界转为等距四元组数的上界；反向使用（由四元组多推距离多）不成立", "Guth-Katz 的直线入射定理必须附带非退化条件：若过多直线落在同一平面或同一正则二次曲面（regulus）上，三重点计数可远超 n^{3/2}，故证明中处理退化情形是不可省的步骤", "结论对高维不自动推广：R^3 中相异距离的最优界形态不同（下界约 Omega(n^{2/3})，Solymosi-Vu 型结果），维数上升并不使问题更容易", "定理是极小值的下界：对具体点集只能得到不少于该界的距离数，不能反推某个点集恰好达到界；达到量级的构造只有格点型", "距离集结构与计数分离：Falconer 型（测度版本）与离散版本不能互推，连续问题的进展不构成离散结论"],
        generalRequirements: ["必须同时给出下界 Omega(n/log n) 与上界 O(n/sqrt(log n)) 并声明差距未消除", "使用 Elekes-Sharir 归约时必须写出等距四元组计数与距离数的关系方向", "引用直线富点定理时必须声明退化（共面、共正则曲面）情形已排除"],
        forbiddenErrors: ["【猜想当定理】声称 Erdős 相异距离猜想已被完全证明", "【界混淆】把 n/log n 与 n/sqrt(log n) 视为同一量级", "【归约反向】由等距四元组数多推出相异距离多", "【退化情形遗漏】使用三重点界 O(n^{3/2}) 而不排除共面或共 regulus 直线", "【维数沿用】把平面界照搬到 R^3", "【离散连续混用】用 Falconer 猜想的进展支持离散相异距离结论"],
        parameterConstraints: { dimension: "结论针对 R^2，R^3 及更高维界的形态不同", quadrupleCounting: "关键估计为 Q = O(n^3 log n)", lineIncidenceNondegeneracy: "富点定理需排除共面与共正则曲面的直线族", constructionOptimality: "上界由整格构造给出，依赖两平方和表示密度", openGap: "sqrt(log n) 因子的差距仍未解决" },
        closureChecks: ["写出 g(n) 的下界与上界并指出差距。", "若用 Elekes-Sharir，明确四元组计数到距离数的归约方向。", "引用多项式分割与直线富点定理时声明退化情形处理。", "上界部分给出格点构造与数论依据。"],
        scenarioChecks: { lowerBoundArgument: ["用 Elekes-Sharir 转为 R^3 直线入射", "引用 Q = O(n^3 log n)", "得 Omega(n/log n)"], upperBoundConstruction: ["取 sqrt n × sqrt n 整格", "用两平方和可表数密度", "得 O(n/sqrt(log n))"], degeneracyHandling: ["检查直线是否共面或共 regulus", "分离退化分量", "对非退化部分套用三重点界"] },
    },
    // 多项式分割法。
    "combgeom-polynomial-partitioning": {
        definitions: ["多项式分割法用一个次数受控的多项式把 R^d 切成若干胞腔，使每个胞腔只含点集的一小部分，从而对入射型问题实施分治；它是 Guth-Katz 之后离散几何的标准工具，取代了旧的切割引理在高维的作用"],
        formulas: ["Guth-Katz 分割定理：P ⊂ R^d 有 n 点，任意 D >= 1，存在非零多项式 f，deg f <= D，使 R^d \\ Z(f) 的每个连通分支（胞腔）含至多 O(n/D^d) 个 P 点，且胞腔数为 O(D^d)", "证明工具：多项式的 ham-sandwich 型二分（Stone-Tukey 推广）迭代 log 次，或代数拓扑的 Borsuk-Ulam 论证", "代数簇上的入射控制：Z(f) 上的点须单独处理，通常用归纳到低维或用 Milnor-Thom 界（次数 D 的簇与直线的入射受 deg 限制）", "直线的胞腔穿越计数：一条直线与 Z(f) 至多交 D 点（若不含于 Z(f)），故至多穿过 D + 1 个胞腔——这是分治求和收敛的关键", "Milnor-Thom：Z(f) 的连通分支数为 O(D^d)，给出胞腔数上界", "典型应用形态：I(P, L) <= sum_cells I(P_i, L_i) + I(P ∩ Z(f), L)，取 D 使两部分平衡"],
        theorems: ["点数均分是“每胞腔至多 O(n/D^d)”而非精确等分：把它当作精确均分会在计数中丢失常数并导致错误的紧界", "落在零集 Z(f) 上的点必须单独处理，且这一部分往往是证明的主要难点：忽略 Z(f) 上的点是最常见的错误，因为分割定理对它们不提供任何控制", "次数 D 的选择是平衡参数：D 太小则胞腔内点太多，D 太大则零集部分与穿越项占主导；证明必须显式给出 D 的取法并核验两端平衡", "直线（或低次曲线）与胞腔的穿越次数界依赖 Bézout 型事实（直线与 Z(f) 至多 D 交点），对高次曲线需相应调整，不能沿用 D + 1", "该方法给出的常数依赖维数 d 且通常不显式；因此它适合确定指数量级，不适合追求最优常数", "分割存在性不构造多项式：定理是存在性结论（拓扑论证），故不能据此给出算法效率结论；算法版本需另行（Agarwal-Matoušek-Sharir）建立"],
        generalRequirements: ["必须显式给出次数 D 的取法并说明平衡依据", "必须单独处理 Z(f) 上的点，并给出该部分的独立估计", "计算穿越项时必须给出直线或曲线与 Z(f) 的交点上界依据"],
        forbiddenErrors: ["【零集遗漏】忽略落在 Z(f) 上的点直接求和", "【均分误解】把胞腔点数当作恰好 n/D^d", "【次数未平衡】不给出 D 的取法或取值使某一项发散", "【穿越界错误】把直线穿过的胞腔数写成与 D 无关的常数", "【构造性误认】声称分割多项式可由定理显式构造或高效算法给出", "【维数常数忽略】在需要显式常数的结论中使用该方法"],
        parameterConstraints: { degreeChoice: "D >= 1 且需按平衡条件显式选取", cellPointBound: "每胞腔至多 O(n/D^d) 个点", cellCount: "胞腔数 O(D^d)（Milnor-Thom）", crossingBound: "不含于 Z(f) 的直线至多穿过 D + 1 个胞腔", varietyHandling: "Z(f) 上的点需独立处理，常需降维归纳" },
        closureChecks: ["选定 D 并写出胞腔点数与胞腔数的界。", "对每个胞腔内的子问题递归或套用已有界。", "单独估计 Z(f) 上的点与穿越项。", "核验取定的 D 使各项平衡。"],
        scenarioChecks: { incidenceDivideConquer: ["用分割定理切分点集", "对胞腔递归求和", "单独处理零集部分"], degreeBalancing: ["写出各项关于 D 的表达式", "解出使各项同阶的 D", "核验最终指数"], varietyPointsAnalysis: ["把 Z(f) 上的点归约到低维问题", "或用 Milnor-Thom 型界", "说明该部分不被分割定理覆盖"] },
    },
    // VC 维与 epsilon-网定理。
    "combgeom-epsilon-net": {
        definitions: ["epsilon-网定理断言：对有界 VC 维的集合系统，随机取 O((d/eps) log(1/eps)) 个点即以高概率命中所有测度至少 eps 的集合；它把“小样本代表大范围”这一几何抽样原理定量化，是几何算法与组合界的通用工具"],
        formulas: ["集合系统 (X, F) 的 VC 维 d：最大的 |A| 使 F 打散 A（即 {A ∩ S : S ∈ F} = 2^A）", "Sauer-Shelah 引理：VC 维 <= d ⇒ 对任意 m 点集合，诱导子集数 <= sum_{i=0}^{d} C(m, i) = O(m^d)", "epsilon-网定义：N ⊆ X 使任意 S ∈ F 且 mu(S) >= eps 都满足 S ∩ N ≠ ∅", "epsilon-网定理（Haussler-Welzl）：取样大小 |N| = O((d/eps) log(d/eps)) 的随机样本以概率 >= 1 - delta 是 epsilon-网（加 log(1/delta)/eps 项）", "epsilon-逼近（更强）：|N| = O((d/eps^2) log(d/eps)) 使 | |S ∩ N|/|N| - mu(S) | <= eps 对所有 S 成立", "半空间等几何情形的改进：某些几何系统存在大小 O(1/eps) 或 O((1/eps) log log(1/eps)) 的网", "下界：一般有界 VC 维系统的 epsilon-网必须有 Omega((1/eps) log(1/eps)) 大小（Komlós-Pach-Woeginger 对某些系统给出匹配下界；Alon 给出超线性下界）"],
        theorems: ["网与逼近不可混用：epsilon-网只保证“命中大集合”，不保证频率估计；需要频率精度时必须用 epsilon-逼近，其样本量是 1/eps^2 而非 1/eps 量级", "有界 VC 维是必要前提：VC 维无限时不存在与 |X| 无关的网大小界（如全部有限子集构成的系统）", "log 因子一般不可去：Alon 证明存在有界 VC 维的几何系统其最小 epsilon-网大小为超线性 omega(1/eps)，故“任意几何系统都有 O(1/eps) 网”是错误的；O(1/eps) 只对特定系统（如平面半空间、圆盘）成立", "Sauer-Shelah 给出的是多项式增长界 O(m^d)，它是 VC 维有界的组合刻画；把它当作对 F 本身基数的界（而非诱导子集数）是错误的", "结论是概率性的：随机样本以高概率是网，定理不给出确定性构造；确定性构造需 derandomization（如 Matoušek 的分割技术），且常数更差", "对偶系统的 VC 维可不同：使用对偶（点与集合互换）时必须重新估计 VC 维，不能直接沿用原系统的 d"],
        generalRequirements: ["必须先给出 VC 维的上界或说明系统的 VC 维有界", "必须区分 epsilon-网与 epsilon-逼近，并给出对应样本量", "使用改进的 O(1/eps) 型界时必须指明所限定的几何系统"],
        forbiddenErrors: ["【网与逼近混用】用 epsilon-网断言频率估计精度", "【VC 维未验证】对无界 VC 维系统套用网大小界", "【log 因子擅自去除】断言任意几何系统都有 O(1/eps) 的网", "【Sauer-Shelah 误读】把 O(m^d) 当作集合族总数而非诱导子集数", "【确定性误认】声称定理给出显式确定性网", "【对偶维数沿用】在对偶系统中直接使用原 VC 维"],
        parameterConstraints: { vcDimension: "需 VC 维 d < infinity，样本量线性依赖 d", netSize: "epsilon-网：O((d/eps) log(d/eps))", approximationSize: "epsilon-逼近：O((d/eps^2) log(d/eps))", probabilityParameter: "失败概率 delta 贡献 O(log(1/delta)/eps) 项", measureRequirement: "mu 为 X 上的概率测度（有限情形为计数测度归一）" },
        closureChecks: ["估计集合系统的 VC 维。", "按需求选择网或逼近并写出样本量。", "声明结论为高概率性质并给出失败概率。", "若引用改进界，指明适用的几何系统。"],
        scenarioChecks: { samplingBound: ["确定 VC 维", "代入 O((d/eps) log(d/eps))", "声明置信参数"], frequencyEstimation: ["改用 epsilon-逼近", "样本量按 1/eps^2 计", "说明与网的区别"], geometricSpecialCase: ["半空间或圆盘系统引用改进界", "说明该界不普遍适用", "必要时引用 Alon 的超线性下界"] },
    },
    // 切割引理与配置的分治。
    "combgeom-cutting-lemma": {
        definitions: ["切割引理断言：R^d 中 n 个超平面可被剖分为 O(r^d) 个（广义）单形胞腔，使每个胞腔内部只被 O(n/r) 个超平面穿过；它是多项式分割之前的标准分治工具，也是几何算法中范围搜索与入射计数的基础"],
        formulas: ["1/r-切割：把 R^d 剖分为若干互不相交的（可能无界）单形，每个单形内部与至多 n/r 个超平面相交", "切割引理（Chazelle-Friedman）：存在大小 O(r^d) 的 1/r-切割，且该界最优（配置的一般位置情形匹配下界）", "平面情形：n 条直线存在 O(r^2) 个三角形的 1/r-切割，每个三角形至多被 n/r 条直线穿过", "构造：对超平面取大小 O(r log r) 的随机样本作配置，再对“过重”的胞腔递归细分（Clarkson-Shor 型概率技术）", "Clarkson-Shor 界：随机样本的配置中期望复杂度由“至多 k 个超平面穿过的胞腔”计数给出，k-level 型估计为 O(r^d) 型", "应用于入射：把点线入射按胞腔分治并对每胞腔用平凡界，取 r 平衡后得 Szemerédi-Trotter 的 O(m^{2/3}n^{2/3} + m + n)"],
        theorems: ["“每胞腔至多 n/r 个超平面穿过”是穿过内部的计数，不含贡献胞腔边界的超平面：把边界超平面也算入或反之会破坏递归的收敛性", "胞腔数 O(r^d) 的最优性依赖一般位置：退化配置（多超平面共交）时构造仍成立但需仔细处理低维面，不能默认所有胞腔都是满维单形", "切割引理与 epsilon-网是同源但不同的工具：网只保证命中大集合，切割给出对整个空间的剖分与逐胞腔的量化控制，二者不能互相替代", "在高维与代数曲面情形切割引理效率退化：曲面族的切割存在性需附加条件且界更差，这正是多项式分割在 Guth-Katz 之后取代它的原因；把超平面版本照搬到曲面族是错误的", "引理是存在性 + 算法性双重结论：确定性 O(n r^{d-1}) 时间构造已知（Chazelle），故与只有存在性的多项式分割不同；但其常数随 d 指数增长", "用于导出入射界时 r 必须显式平衡：胞腔内平凡界之和与胞腔数的乘积须同阶，缺少平衡步骤得不到 4/3 次幂"],
        generalRequirements: ["必须写明 1/r-切割中 r 的取法及胞腔数 O(r^d)", "必须区分穿过胞腔内部与落在胞腔边界的超平面", "用于曲面族时必须说明附加条件，不得直接套用超平面版本"],
        forbiddenErrors: ["【穿越计数混淆】把边界上的超平面计入内部穿越数", "【胞腔数错误】把胞腔数写成 O(r) 或 O(r^{d-1})", "【一般位置默认】不处理退化配置的低维面", "【工具混用】用 epsilon-网替代切割的逐胞腔控制", "【曲面族沿用】对代数曲面族直接使用超平面切割界", "【平衡缺失】导出入射界时不给出 r 的取法"],
        parameterConstraints: { cuttingParameter: "1 <= r <= n，胞腔数 O(r^d)", crossingBound: "每胞腔内部至多 n/r 个超平面", dimensionConstant: "常数随维数 d 指数增长", constructionCost: "确定性构造时间 O(n r^{d-1})", objectType: "标准版本针对超平面，曲面族需另行论证" },
        closureChecks: ["选定 r 并写出胞腔数与逐胞腔穿越界。", "分别处理胞腔内部与边界上的对象。", "对每个胞腔套用平凡界或递归。", "核验 r 的取法使总和平衡。"],
        scenarioChecks: { incidenceViaCutting: ["取 1/r-切割分治点线", "每胞腔用平凡入射界", "平衡 r 得 4/3 次幂界"], rangeSearchingStructure: ["用切割建立层次结构", "给出查询复杂度", "说明预处理代价"], degenerateArrangement: ["检查超平面是否共交", "单独处理低维面上的点", "确认胞腔计数仍为 O(r^d)"] },
    },
    // 凸位置与 Erdős-Szekeres 凸多边形定理。
    "combgeom-convex-position": {
        definitions: ["Erdős-Szekeres 凸多边形定理断言：任意足够多的一般位置平面点中必有 n 个点处于凸位置（构成凸 n 边形的顶点集）；记最小点数为 ES(n)，其精确增长阶经 Suk 的上界后已确定为 2^{n + o(n)}"],
        formulas: ["ES(n)：最小的 N 使任意 N 个一般位置（无三点共线）平面点含 n 个凸位置点", "经典上下界：2^{n-2} + 1 <= ES(n) <= C(2n - 4, n - 2) + 1 ≈ 4^n / sqrt n（Erdős-Szekeres 上界）", "Suk 上界（2017）：ES(n) <= 2^{n + o(n)}，与下界匹配到 o(n) 指数误差", "Erdős-Szekeres 猜想：ES(n) = 2^{n-2} + 1，已验证至 n = 6（ES(6) = 17，由 Szekeres-Peters 计算机穷举）", "小值：ES(3) = 3、ES(4) = 5、ES(5) = 9、ES(6) = 17", "杯-帽（cup-cap）方法：f(k, l) = C(k + l - 4, k - 2) + 1 是保证存在 k-杯或 l-帽的最小点数，凸多边形界由 f(n, n) 得出", "空凸多边形（Horton）：任意大点集必含空凸五边形，但存在任意大的点集不含空凸七边形；空凸六边形存在性由 Gerken/Nicolás 证明"],
        theorems: ["一般位置假设不可省：允许三点共线时凸位置的定义退化（共线点不构成凸多边形顶点），结论需重新表述", "下界 2^{n-2} + 1 由显式构造（Erdős-Szekeres 的递归杯帽构造）给出，不是概率论证；因此该下界是构造性的且被猜想为最优", "Suk 的结果不证明猜想：2^{n + o(n)} 与 2^{n-2} + 1 相差一个 2^{o(n)} 因子，把 Suk 定理当作猜想的证明是错误的", "杯帽方法给出的是双参数结果 f(k, l)，其界 C(k+l-4, k-2)+1 是精确值（有匹配构造），而由它导出的 ES(n) 上界不精确；不能因 f 精确就断言 ES 精确", "空凸多边形问题与凸位置问题结论不同：Horton 集说明“任意大点集含空凸七边形”是假的，故不能把凸位置的存在性论证套用到空凸情形", "高维推广（凸位置的 d 维版本）与平面情形界不同，且“凸位置”需改为顶点均为凸包顶点的表述，不能沿用平面数值"],
        generalRequirements: ["必须声明点集为一般位置（无三点共线）", "引用界时必须区分下界构造 2^{n-2}+1、Suk 上界 2^{n+o(n)} 与未解决的猜想", "使用杯帽方法必须给出 f(k, l) 的精确表达并说明如何组合得到凸多边形界"],
        forbiddenErrors: ["【一般位置遗漏】允许三点共线仍断言凸 n 边形存在", "【猜想当定理】称 ES(n) = 2^{n-2} + 1 已被证明", "【Suk 结果误读】把 2^{n+o(n)} 当作精确值或猜想的证明", "【空凸混用】断言任意大点集含空凸七边形", "【小值错误】给出 ES(5) 或 ES(6) 的错误数值", "【杯帽精度误推】由 f(k,l) 的精确性推出 ES(n) 的精确性"],
        parameterConstraints: { generalPosition: "点集须无三点共线", knownExactValues: "仅 n <= 6 的 ES(n) 已知（3, 5, 9, 17）", lowerBoundConstruction: "2^{n-2} + 1 由递归杯帽构造给出", upperBoundStatus: "当前最优为 Suk 的 2^{n+o(n)}", emptyPolygonVariant: "空凸情形：五、六边形存在，七边形不存在（Horton 集）" },
        closureChecks: ["确认一般位置假设。", "用杯帽方法或引用 Suk 界给出上界。", "给出下界构造并声明猜想未解决。", "若涉及空凸多边形，改用相应结论与 Horton 反例。"],
        scenarioChecks: { existenceOfConvexPolygon: ["确认无三点共线", "用 f(n,n) 型杯帽界", "或引用 Suk 上界"], smallCaseComputation: ["引用 ES(3..6) 的已知值", "说明 ES(6)=17 依赖穷举", "不外推到更大 n"], emptyPolygonProblem: ["区分空凸与凸位置", "引用 Horton 集排除七边形", "六边形情形引用 Gerken/Nicolás"] },
    },
    // 火腿三明治定理与均分。
    "combgeom-ham-sandwich": {
        definitions: ["火腿三明治定理断言：R^d 中任意 d 个有限测度（或有限点集）都存在一个超平面同时把每一个测度（点集）平分；它是拓扑方法（Borsuk-Ulam）在离散几何中最典型的应用，也是几何分治算法的基础"],
        formulas: ["测度版本：mu_1, ..., mu_d 为 R^d 上的有限 Borel 测度（对超平面为零测），则存在超平面 H 使每个 mu_i 在 H 的两个闭半空间中的测度相等", "离散版本：P_1, ..., P_d ⊂ R^d 有限点集，存在超平面 H 使每侧至多含 |P_i|/2 个 P_i 的点（落在 H 上的点可任意分配）", "证明机制：把超平面参数化为 S^d 上的点，用 Borsuk-Ulam 定理对反对称连续映射 f: S^d -> R^{d-1}（或 R^d 的适当分量）取零点", "多项式 ham-sandwich（Stone-Tukey）：把 R^d 嵌入 Veronese 映射后，次数 D 的多项式曲面可同时平分 sum_{i=1}^{D} C(d+i-1, i) 型个数的测度，这是多项式分割的出发点", "中心横截/中心点定理（相关但不同）：任意 n 点集存在点使任意含它的半空间至少含 n/(d+1) 个点", "平面情形（d = 2）：两个点集可被一条直线同时平分，算法可在 O(n) 时间实现（Lo-Matoušek-Steiger）"],
        theorems: ["测度个数必须恰为维数 d：给出 d+1 个测度时超平面一般不能同时平分（自由度不足），把定理写成“任意多个测度”是错误的", "“平分”在离散情形只能保证每侧至多一半，落在超平面上的点需单独分配：断言严格等分（每侧恰好 |P_i|/2）在奇数基数或有点共面时不成立", "测度需对超平面为零测（或点集为一般位置）才能得到严格等分结论；否则只能得到闭半空间的弱形式", "定理是存在性结论（拓扑论证），不给出构造；离散情形有线性时间算法但只在低维（d = 2, 3）实用，高维为指数依赖", "Borsuk-Ulam 的维数匹配是本质的：映射的目标维数必须比球面维数低一，任何维数错配的论证都无效", "多项式版本的测度个数由多项式系数个数决定（次数 D 的多项式在 R^d 中有 C(d+D, D) - 1 个自由系数），不能任意增加待平分的测度个数"],
        generalRequirements: ["必须核对测度（点集）个数恰等于维数 d", "离散情形必须说明超平面上点的分配规则", "用 Borsuk-Ulam 时必须核验维数匹配与映射的反对称性"],
        forbiddenErrors: ["【个数超限】用一个超平面同时平分 d+1 个或更多测度", "【严格等分误断】离散情形断言每侧恰好一半而不处理超平面上的点", "【零测条件遗漏】对在超平面上有正测度的测度断言严格平分", "【维数错配】Borsuk-Ulam 中球面与目标空间维数不匹配", "【构造性误认】声称定理给出显式超平面或高维高效算法", "【多项式版本滥用】任意增加多项式版本可平分的测度个数而不核对系数自由度"],
        parameterConstraints: { measureCount: "待平分的测度（点集）个数必须恰为 d", nullOnHyperplanes: "严格等分需测度对超平面为零测", discreteAllocation: "离散情形超平面上的点可任意分配以达成平衡", topologicalTool: "证明依赖 S^d 上的 Borsuk-Ulam，目标维数需为 d", polynomialVersion: "次数 D 版本可平分个数受多项式系数自由度限制" },
        closureChecks: ["核对测度或点集个数等于维数。", "验证零测条件或说明离散分配规则。", "用 Borsuk-Ulam 给出存在性并核验维数匹配。", "若需算法，声明维数限制与复杂度依赖。"],
        scenarioChecks: { simultaneousBisection: ["核对测度个数 = d", "构造反对称映射", "由 Borsuk-Ulam 得零点"], discretePointSets: ["允许超平面上的点任意分配", "给出每侧至多一半的结论", "处理奇数基数情形"], polynomialGeneralization: ["用 Veronese 嵌入提升维数", "按系数自由度确定可平分个数", "衔接多项式分割构造"] },
    },
};
