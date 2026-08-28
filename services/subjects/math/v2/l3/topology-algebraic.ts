import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“拓扑学-代数拓扑”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const TOPOLOGY_ALGEBRAIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 基本群的定义、基点依赖与函子性。
    "algtop-fundamental-group-functoriality": {
        id: "algtop-fundamental-group-functoriality", l2Key: "topology-algebraic", name: "基本群与函子性", kind: "object",
        aliases: ["基本群", "pi_1", "基点依赖", "诱导同态"],
    },
    // 由开覆盖计算基本群的推出结构。
    "algtop-van-kampen-theorem": {
        id: "algtop-van-kampen-theorem", l2Key: "topology-algebraic", name: "Seifert-van Kampen 定理", kind: "theorem",
        aliases: ["van Kampen定理", "基本群推出", "自由积带融合"],
    },
    // 覆盖空间与基本群子群的 Galois 型对应。
    "algtop-covering-space-classification": {
        id: "algtop-covering-space-classification", l2Key: "topology-algebraic", name: "覆盖空间分类与提升判据", kind: "theorem",
        aliases: ["覆盖空间分类", "提升判据", "万有覆盖", "半局部单连通"],
    },
    // 奇异同调的同伦不变性与公理刻画。
    "algtop-singular-homology-homotopy-invariance": {
        id: "algtop-singular-homology-homotopy-invariance", l2Key: "topology-algebraic", name: "奇异同调的同伦不变性", kind: "theorem",
        aliases: ["奇异同调", "同伦不变性", "链同伦", "Eilenberg-Steenrod公理"],
    },
    // 由开集分解得到的同调长正合列。
    "algtop-mayer-vietoris-sequence": {
        id: "algtop-mayer-vietoris-sequence", l2Key: "topology-algebraic", name: "Mayer-Vietoris 长正合列", kind: "theorem",
        aliases: ["Mayer-Vietoris序列", "长正合列", "Mayer-Vietoris连接同态"],
    },
    // CW 复形上以胞腔链复形完成的同调计算。
    "algtop-cellular-homology-cw": {
        id: "algtop-cellular-homology-cw", l2Key: "topology-algebraic", name: "CW 复形的胞腔同调", kind: "algorithm",
        aliases: ["胞腔同调", "CW复形", "度映射边界算子"],
    },
    // 上同调环结构与杯积对同伦型的区分能力。
    "algtop-cohomology-cup-product": {
        id: "algtop-cohomology-cup-product", l2Key: "topology-algebraic", name: "上同调环与杯积", kind: "object",
        aliases: ["杯积", "上同调环", "Künneth公式"],
    },
    // 闭定向流形同调与上同调的对偶配对。
    "algtop-poincare-duality": {
        id: "algtop-poincare-duality", l2Key: "topology-algebraic", name: "Poincaré 对偶", kind: "theorem",
        aliases: ["Poincaré对偶", "基本类", "定向性", "交配对"],
    },
    // 映射度理论与由此导出的不动点定理。
    "algtop-degree-fixed-point-theorems": {
        id: "algtop-degree-fixed-point-theorems", l2Key: "topology-algebraic", name: "映射度与不动点定理", kind: "theorem",
        aliases: ["映射度", "Brouwer不动点", "Lefschetz数", "Borsuk-Ulam"],
    },
    // 纤维化长正合列与 Hurewicz 定理连接同调与高阶同伦。
    "algtop-fibration-exact-sequence-hurewicz": {
        id: "algtop-fibration-exact-sequence-hurewicz", l2Key: "topology-algebraic", name: "纤维化长正合列与 Hurewicz 定理", kind: "theorem",
        aliases: ["纤维化长正合列", "Hurewicz定理", "高阶同伦群", "纤维丛提升性质"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const TOPOLOGY_ALGEBRAIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // 基本群：基点选取、函子性与同伦不变性的边界。
    "algtop-fundamental-group-functoriality": {
        definitions: ["pi_1(X, x_0) 为以 x_0 为基点的闭道路在道路同伦下的等价类群，运算为道路连接", "单连通：道路连通且 pi_1 平凡", "基于基点的诱导同态 f_*: pi_1(X, x_0) -> pi_1(Y, f(x_0))"],
        formulas: ["函子性：(g circ f)_* = g_* circ f_*，(id)_* = id", "基点更换：道路 gamma 从 x_0 到 x_1 给出同构 beta_gamma: pi_1(X, x_1) -> pi_1(X, x_0)，beta_gamma([f]) = [gamma * f * gamma^{-1}]", "乘积：pi_1(X times Y) 同构于 pi_1(X) times pi_1(Y)"],
        theorems: ["同伦等价的道路连通空间有同构的基本群，但同构的基本群不蕴含同伦等价", "pi_1(S^1) 同构于 Z，由覆盖 R -> S^1 的提升度给出", "pi_1(S^n) 平凡（n >= 2）；pi_1 只看 2 骨架，无法区分高维差异", "基点更换同构一般依赖 gamma 的同伦类，只有 pi_1 交换时才与路径无关"],
        generalRequirements: ["写 pi_1 必须给出基点，或先声明道路连通使基点无关（相差同构）", "同伦必须是保持端点的道路同伦而非自由同伦", "由基本群推空间性质时必须说明只反映 2 骨架信息"],
        forbiddenErrors: ["【基点省略】非道路连通空间中省略基点直接写 pi_1(X)", "【同伦类型误推】由基本群同构断言空间同伦等价或同胚", "【自由同伦混用】用不保端点的同伦证明闭道路同伦", "【逆函子方向错】把 f_* 写成 pi_1(Y) -> pi_1(X)", "【交换性默认】对非交换基本群使用与路径无关的基点更换"],
        parameterConstraints: { basepointDependence: "道路连通时不同基点的 pi_1 同构，同构依赖路径类", homotopyType: "同伦必须是保端点道路同伦", dimensionSensitivity: "pi_1 仅由 2 骨架决定", productFormula: "有限乘积可逐因子分解" },
        closureChecks: ["确认基点与道路连通性已交代", "确认同伦种类（道路同伦/自由同伦）正确", "确认由 pi_1 得出的结论强度不超过 2 骨架信息", "确认诱导同态方向与复合律一致"],
        scenarioChecks: { circleAndTorusComputation: ["S^1 与 T^n 的 pi_1 用覆盖度或乘积公式", "确认非交换情形（如 8 字空间）不可用乘积公式"], simpleConnectivityClaim: ["断言单连通需同时验证道路连通", "确认高维球面单连通但同调非平凡"], nonAbelianFundamentalGroup: ["处理楔和或亏格曲面时确认自由群或曲面群的非交换性", "确认基点更换同构不自然"] },
    },
    // Seifert-van Kampen 定理：由开覆盖计算基本群的推出。
    "algtop-van-kampen-theorem": {
        definitions: ["推出（pushout）/自由积带融合：由两个群沿公共子群粘合得到的群", "开覆盖 X = U cup V，U、V 及 U cap V 均开且道路连通，基点在交上", "生成元-关系表示：群由生成元与关系式给出"],
        formulas: ["pi_1(X) 同构于 pi_1(U) *_{pi_1(U cap V)} pi_1(V)（U cap V 道路连通）", "楔和情形：pi_1(X vee Y) 同构于 pi_1(X) * pi_1(Y)（好基点条件）", "亏格 g 闭曲面：pi_1 = <a_1,b_1,...,a_g,b_g | prod [a_i, b_i] = 1>"],
        theorems: ["Seifert-van Kampen 定理要求 U、V 开且 U cap V 道路连通，否则推出结论失效", "U cap V 不连通时需用图之群（graph of groups）或添加自由生成元修正", "由 CW 结构粘贴 2 胞腔对应在 pi_1 中添加关系元，粘贴 n >= 3 胞腔不改变 pi_1", "任意有限表示群都可实现为某 2 复形的基本群"],
        generalRequirements: ["必须验证覆盖集为开集且交道路连通，并把基点取在交内", "必须写出融合所沿的同态而不仅是抽象自由积", "使用生成元-关系表示时必须核对关系数与胞腔数一致"],
        forbiddenErrors: ["【交不连通】U cap V 不道路连通仍套用标准推出公式", "【闭集覆盖】用闭集覆盖代替开集覆盖", "【自由积滥用】把带融合的推出简化为纯自由积，忽略公共子群的像", "【基点错置】基点未取在 U cap V 内", "【高维胞腔误算】认为粘贴 3 胞腔会给 pi_1 增加关系"],
        parameterConstraints: { coverOpenness: "U、V 必须开", intersectionConnectivity: "U cap V 需道路连通（否则需推广形式）", basepointLocation: "基点必须在 U cap V 中", cellDimensionEffect: "1 胞腔加生成元，2 胞腔加关系，>=3 胞腔不影响 pi_1" },
        closureChecks: ["确认覆盖的开性与交的连通性", "确认融合同态（包含诱导）已写明", "确认所得表示的生成元与关系与胞腔结构对应", "确认结论未越过 pi_1 层级去断言高阶同伦"],
        scenarioChecks: { surfaceGroupComputation: ["闭曲面用一个 2 胞腔粘贴多边形边字", "确认定向与非定向情形关系式不同"], wedgeOfSpaces: ["楔和需好基点（非退化）条件", "确认得到自由积"], knotComplement: ["用 Wirtinger 表示计算结点补的 pi_1", "确认覆盖分解满足开性与交连通"] },
    },
    // 覆盖空间分类：子群对应与提升判据。
    "algtop-covering-space-classification": {
        definitions: ["覆盖映射 p: E -> X：每点有邻域使原像为若干同胚拷贝之并", "万有覆盖：单连通覆盖空间", "半局部单连通：每点有邻域使其 pi_1 到全空间的像平凡"],
        formulas: ["提升判据：f: (Y, y_0) -> (X, x_0) 提升到 E <=> f_*(pi_1(Y, y_0)) subset p_*(pi_1(E, e_0))（Y 道路连通、局部道路连通）", "分类：连通覆盖（相差同构）对应 pi_1(X, x_0) 的共轭子群类", "纤维基数 = 指数 [pi_1(X) : p_*(pi_1(E))]；正规覆盖的 Deck 群同构于商群"],
        theorems: ["万有覆盖存在 <=> X 道路连通、局部道路连通且半局部单连通", "覆盖空间对应定理（Galois 型）：子群格与覆盖格反序对应，正规子群对应正规（regular）覆盖", "唯一提升性质：连通空间上两个提升在一点相同则完全相同", "同伦提升性质对所有覆盖成立，覆盖是纤维化的特例"],
        generalRequirements: ["使用分类定理必须验证局部道路连通与半局部单连通", "提升论证必须写出基点与子群包含关系而非仅凭直观", "断言 Deck 群结构必须先确认覆盖正规"],
        forbiddenErrors: ["【存在性缺失】对不半局部单连通空间（如 Hawaiian earring）断言万有覆盖存在", "【提升条件误设】不检查子群包含就断言映射可提升", "【正规性默认】把任意覆盖的 Deck 群当作商群", "【共轭类忽略】把子群与覆盖的对应写成一一而不模共轭", "【局部条件遗漏】省略局部道路连通导致提升唯一性论证失效"],
        parameterConstraints: { localConnectivityAssumption: "需道路连通 + 局部道路连通", semilocalSimpleConnectivity: "万有覆盖存在的必要条件", subgroupCorrespondence: "覆盖同构类对应共轭子群类", deckGroupCondition: "Deck 群 = 商群仅对正规覆盖" },
        closureChecks: ["确认三条局部与整体连通性假设逐条成立", "确认提升判据的子群包含方向正确", "确认覆盖正规性与 Deck 群结论匹配", "确认纤维基数与子群指数一致"],
        scenarioChecks: { circleCoverings: ["S^1 的连通覆盖为 R 与 n 重自覆盖", "确认对应 Z 的子群 nZ"], graphCoverings: ["图的覆盖对应自由群子群（Nielsen-Schreier）", "确认秩由指数与欧拉特征给出"], liftingPathsAndHomotopies: ["用唯一提升性质证明单值性", "确认提升起点选定"] },
    },
    // 奇异同调：同伦不变性、链同伦与公理化刻画。
    "algtop-singular-homology-homotopy-invariance": {
        definitions: ["奇异链复形 C_n(X) 由从标准单形到 X 的连续映射自由生成，边界算子由面映射交替和给出", "链同伦：链映射 f, g 满足 f - g = partial D + D partial", "相对同调 H_n(X, A) 由商链复形 C_*(X)/C_*(A) 得到"],
        formulas: ["partial circ partial = 0；H_n = ker partial_n / im partial_{n+1}", "同伦不变性：f 同伦于 g => f_* = g_* 于 H_n", "长正合列：... -> H_n(A) -> H_n(X) -> H_n(X, A) -> H_{n-1}(A) -> ...", "H_n(S^k) = Z（n = 0, k 或 n = k）等，约化同调 tilde H_n(S^k) = Z 当 n = k"],
        theorems: ["同伦等价诱导同调同构，故同调是同伦型不变量而非仅拓扑不变量", "Eilenberg-Steenrod 公理（同伦、正合、切除、维数、可加性）唯一确定同调理论（在 CW 范畴上）", "切除定理与好对（good pair）条件给出 H_n(X, A) 同构于 tilde H_n(X/A)", "Hurewicz 型低维结论：H_1(X) 同构于 pi_1(X) 的交换化（X 道路连通）"],
        generalRequirements: ["证明同调同构必须给出链映射与链同伦而非仅空间层面的直观", "使用 H_n(X, A) 与 X/A 的同构必须验证好对（A 为 X 的 CW 子复形或邻域收缩核）", "计算球面、环面等基本例子时必须区分同调与约化同调的第 0 阶差异"],
        forbiddenErrors: ["【同调判同胚】由同调同构断言同胚（同调只判同伦型的必要条件）", "【链同伦缺失】声称两个链映射诱导相同同调而不给出链同伦", "【好对忽略】直接用 H_n(X, A) = tilde H_n(X/A) 而不检查条件", "【约化混用】在长正合列中混用约化与非约化同调", "【维数公理误用】把 H_0 的自由秩与连通分支数关系用于非道路连通的相对同调"],
        parameterConstraints: { coefficientRing: "默认整系数，改系数需重述结果（万有系数定理）", goodPairCondition: "商空间公式需好对", reducedVersusUnreduced: "H_0(X) = Z^{#分支}，约化同调去掉一个 Z", axiomScope: "Eilenberg-Steenrod 唯一性在 CW 范畴内" },
        closureChecks: ["确认所用不变性是同伦不变而非拓扑不变的更强主张", "确认长正合列中每一项的（相对/约化）类型一致", "确认切除或商空间公式的前提已验证", "确认系数环与所引用定理匹配"],
        scenarioChecks: { sphereComputation: ["用长正合列或 CW 结构算 H_n(S^k)", "确认约化同调形式"], relativeHomologyUse: ["用相对同调需检查子空间闭性与好对", "确认连接同态定义方向"], degreeAndOrientation: ["以 H_n 的生成元定义度时确认定向选取", "确认系数取 Z 而非 Z/2"] },
    },
    // Mayer-Vietoris 长正合列：由两块开集拼接计算同调。
    "algtop-mayer-vietoris-sequence": {
        definitions: ["X = A cup B，A、B 开（或为 CW 子复形形成好对）", "连接同态 partial_*: H_n(X) -> H_{n-1}(A cap B) 由切除构造给出", "约化版本适用于交非空的情形"],
        formulas: ["... -> H_n(A cap B) -> H_n(A) oplus H_n(B) -> H_n(X) -> H_{n-1}(A cap B) -> ...", "映射形式：x -> (i_*x, -j_*x)，(a, b) -> a|_X + b|_X（符号约定需固定）", "上同调版本方向相反：... -> H^n(X) -> H^n(A) oplus H^n(B) -> H^n(A cap B) -> H^{n+1}(X) -> ..."],
        theorems: ["Mayer-Vietoris 序列对开覆盖（或好对覆盖）恒成立，是同调计算的主力工具", "A cap B 为空时序列退化为直和分解 H_n(X) = H_n(A) oplus H_n(B)", "序列的正合性来自链层面的短正合列与蛇引理，符号约定影响连接同态但不影响正合性", "推论：可用于证明 Brouwer 不变维数、球面同调、亏格曲面同调"],
        generalRequirements: ["必须验证覆盖为开覆盖或 CW 好对，否则正合性可能失效", "必须固定并保持符号约定，尤其在 oplus 项的负号处", "使用序列求解未知项时必须交代相邻项已知且映射秩可判定"],
        forbiddenErrors: ["【覆盖条件缺失】对任意（如闭且非好对）覆盖套用序列", "【交连通性混淆】把交的连通性要求（van Kampen 需要）错加到 Mayer-Vietoris 上", "【正合性误用】由序列存在直接断言 H_n(X) 为两端之商而不分析映射核与像", "【符号错置】直和映射缺少负号导致连接同态计算错误", "【上下同调混用】把同调版本箭头方向用于上同调"],
        parameterConstraints: { coverCondition: "A、B 开或构成 CW 好对", intersectionNonemptiness: "约化版本需 A cap B 非空", coefficientChoice: "任意系数群均可，需在整个序列统一", cohomologyDirection: "上同调版本箭头与升次方向相反" },
        closureChecks: ["确认覆盖条件与所用版本匹配", "确认序列各项系数与约化性一致", "确认由正合性得出的结论使用了核像分析而非直接读取", "确认连接同态的次数降升方向正确"],
        scenarioChecks: { sphereByHemispheres: ["S^n 分解为两半球，交同伦等价于 S^{n-1}", "确认半球可缩"], torusAndSurfaces: ["曲面分解为柱面与手柄", "确认交的同调已知"], connectedSumComputation: ["连通和用去球邻域的分解", "确认交同伦等价于 S^{n-1}"] },
    },
    // CW 复形的胞腔同调：以胞腔链复形与度系数矩阵计算。
    "algtop-cellular-homology-cw": {
        definitions: ["CW 复形：逐维粘贴胞腔得到的空间，粘贴映射定义在球面边界上", "胞腔链群 C_n^{CW} 为 n 胞腔生成的自由交换群", "胞腔边界算子系数为粘贴映射与投影复合的度"],
        formulas: ["d_n(e_alpha^n) = sum_beta deg(S^{n-1} -> X^{n-1} -> S^{n-1}_beta) e_beta^{n-1}", "H_n^{CW}(X) 同构于 H_n(X)（奇异同调）", "欧拉特征：chi(X) = sum_n (-1)^n c_n = sum_n (-1)^n rank H_n(X)"],
        theorems: ["胞腔同调与奇异同调自然同构，故可用有限胞腔结构完成计算", "若 X 无相邻维数胞腔，则同调为胞腔链群本身（如 CP^n、偶数维胞腔情形）", "欧拉特征只依赖同调秩，与胞腔分解无关", "胞腔近似定理：连续映射可同伦到胞腔映射，从而使度计算合法"],
        generalRequirements: ["必须写出每个胞腔的粘贴映射并计算其度系数，不能只数胞腔个数", "使用秩公式必须确认系数环为域或已处理挠部分", "由 chi 推同调必须补充其余维数信息，chi 单独不足以确定同调"],
        forbiddenErrors: ["【度系数省略】把边界算子当作零映射（仅在无相邻维胞腔时成立）", "【挠信息丢失】用秩或 chi 代替完整同调群，忽略挠子群（如 RP^n 的 Z/2）", "【胞腔结构不合法】粘贴映射未定义在球面边界或未连续", "【维数错配】把 n 胞腔的边界算到 n-2 维", "【欧拉特征反推】由 chi 相同断言同调同构"],
        parameterConstraints: { cellStructureValidity: "粘贴映射需从 S^{n-1} 到 (n-1) 骨架且连续", boundaryDegreeComputation: "系数为复合映射的度（带定向符号）", coefficientRing: "整系数保留挠；域系数只给秩", eulerCharacteristicScope: "chi 只对有限（或紧）CW 复形定义" },
        closureChecks: ["确认所有胞腔与粘贴映射列出", "确认边界算子系数含定向符号", "确认结果同调群含可能的挠部分", "确认 chi 与同调秩交叉校验一致"],
        scenarioChecks: { projectiveSpaceComputation: ["RP^n 用 Z/2 型边界系数（交替 0 与 2）", "CP^n 用偶维胞腔得零边界"], surfaceCellStructure: ["闭曲面用一个 0、2g 个 1、一个 2 胞腔", "确认边界字给出交换化后的同调"], torsionDetection: ["确认整系数计算保留挠", "用万有系数定理交叉验证"] },
    },
    // 上同调环与杯积：比同调更强的同伦型区分工具。
    "algtop-cohomology-cup-product": {
        definitions: ["奇异上同调 H^n(X; R) 由链群到 R 的同态复形得到", "杯积 cup: H^p times H^q -> H^{p+q}，使 H^*(X; R) 成为分次环", "Künneth 公式给出乘积空间上同调的张量分解"],
        formulas: ["杯积反交换：alpha cup beta = (-1)^{pq} beta cup alpha", "Künneth（域系数）：H^*(X times Y) 同构于 H^*(X) tensor H^*(Y)", "H^*(CP^n; Z) = Z[x]/(x^{n+1})，deg x = 2；H^*(T^2; Z) 为外代数 Lambda(a, b)", "万有系数：H^n(X; R) 与 H_n(X; R) 由 Ext 项相差"],
        theorems: ["上同调环结构能区分同调群相同但同伦型不同的空间（如 CP^2 与 S^2 vee S^4）", "杯积由对角映射诱导，自然性给出映射诱导的环同态 f^*", "Künneth 定理在整系数下含 Tor 项修正，仅在无挠或域系数时是纯张量积", "Poincaré 对偶下杯积对应交配对，闭定向流形上给出非退化配对"],
        generalRequirements: ["用上同调区分空间必须比较环结构而非仅分次群", "使用 Künneth 必须声明系数为域或因子无挠，否则补 Tor 项", "写 f^* 必须注意上同调是反变函子，方向与同调相反"],
        forbiddenErrors: ["【环结构忽略】只比较上同调群就断言同伦等价", "【反变性错】把 f^* 写成 H^n(X) -> H^n(Y)", "【Künneth 无条件】整系数下省略 Tor 修正项", "【交换性符号错】忽略 (-1)^{pq} 符号，尤其奇数次类的平方", "【对偶滥用】在非紧或非定向流形上使用对偶诱导的非退化配对"],
        parameterConstraints: { coefficientRing: "环结构依赖系数环，Z/2 与 Z 结果显著不同", gradedCommutativity: "符号 (-1)^{pq}，奇次元素平方在整系数下受限", kunnethCondition: "纯张量分解需域系数或一因子无挠", functoriality: "上同调反变，杯积与 f^* 相容" },
        closureChecks: ["确认所比较的是环结构还是分次群", "确认系数环在整个论证中统一", "确认 Künneth 使用条件与修正项", "确认反变方向与诱导环同态一致"],
        scenarioChecks: { projectiveSpaceRing: ["CP^n 与 RP^n 的上同调环结构（截断多项式环）", "确认 RP^n 用 Z/2 系数得 Z/2[x]/(x^{n+1})"], distinguishingSpaces: ["比较 CP^2 与 S^2 vee S^4 时用 x cup x 是否为零", "确认同调群相同"], productSpaces: ["乘积用 Künneth，注意分次符号", "确认外代数结构（如环面）"] },
    },
    // Poincaré 对偶：闭定向流形上的对偶同构与交配对。
    "algtop-poincare-duality": {
        definitions: ["n 维闭（紧无边）定向流形：存在基本类 [M] in H_n(M; Z)", "对偶同构由与基本类的帽积给出", "交配对：H_k times H_{n-k} -> Z 的非退化配对（模挠）"],
        formulas: ["H^k(M; Z) 同构于 H_{n-k}(M; Z)（M 闭定向）", "非定向情形：H^k(M; Z/2) 同构于 H_{n-k}(M; Z/2)", "带边情形（Lefschetz 对偶）：H^k(M, partial M) 同构于 H_{n-k}(M)", "推论：chi(M) 为偶数当 n 为奇数；中维交配对对称性由 n 决定"],
        theorems: ["Poincaré 对偶要求紧、无边、定向（或改用 Z/2 系数），三条缺一失效", "对偶蕴含 Betti 数对称 b_k = b_{n-k}，可用作流形性判据的必要条件", "交配对在闭定向 4k 维流形上给出对称双线性形式，其符号差是重要不变量", "开流形或带边流形需用 Lefschetz 对偶或紧支上同调版本"],
        generalRequirements: ["使用对偶必须逐条确认紧性、无边、定向性", "非定向流形必须切换到 Z/2 系数并声明结论减弱", "带边或非紧情形必须使用相对同调或紧支上同调形式"],
        forbiddenErrors: ["【定向性缺失】对 RP^2、Möbius 带等非定向对象用整系数对偶", "【紧性缺失】对开流形直接用普通上同调对偶而非紧支版本", "【边界忽略】带边流形用闭流形版本导致 Betti 数对称失效", "【挠项误处理】断言交配对在整同调上完全非退化而不模挠", "【Betti 对称反推】由 b_k = b_{n-k} 断言空间是闭定向流形"],
        parameterConstraints: { compactness: "必须紧且无边（否则用紧支或相对版本）", orientability: "整系数需定向；非定向改 Z/2", boundaryCondition: "带边用 Lefschetz 对偶相对形式", torsionHandling: "交配对非退化性在模挠意义下" },
        closureChecks: ["确认紧、无边、定向三条件", "确认系数选择与定向性匹配", "确认所用对偶形式（闭/带边/紧支）正确", "确认交配对结论的非退化范围（模挠）"],
        scenarioChecks: { surfaceBettiNumbers: ["闭定向曲面 b_0 = b_2 = 1, b_1 = 2g", "确认非定向曲面改用 Z/2"], fourManifoldIntersectionForm: ["4 维闭定向流形的中维交形式对称", "确认符号差与 unimodularity"], nonOrientableCase: ["RP^{2k} 的 Z/2 对偶成立而整系数失效", "确认基本类只在 Z/2 系数存在"] },
    },
    // 映射度与不动点定理：Brouwer、Lefschetz 与 Borsuk-Ulam 的成立条件。
    "algtop-degree-fixed-point-theorems": {
        definitions: ["度 deg f：f_*: H_n(S^n) -> H_n(S^n) 的整数乘子", "Lefschetz 数 L(f) = sum_k (-1)^k tr(f_*: H_k(X; Q) -> H_k(X; Q))", "对合与反足映射：x -> -x 在 S^n 上"],
        formulas: ["deg(f circ g) = deg f cdot deg g；同伦映射同度", "Brouwer 不动点：任意连续 f: D^n -> D^n 有不动点", "Lefschetz 不动点定理：L(f) != 0 => f 有不动点（X 紧 CW 复形）", "Borsuk-Ulam：连续 f: S^n -> R^n 存在 x 使 f(x) = f(-x)"],
        theorems: ["deg 是完全同伦不变量：S^n 到自身的映射同伦类由度分类（Hopf 定理）", "反足映射 deg = (-1)^{n+1}；恒等映射 deg = 1，故 S^n 上无零向量场当 n 为偶数（毛球定理）", "Lefschetz 定理只给不动点存在的充分条件，L(f) = 0 不排除不动点", "Brouwer 定理要求定义域紧凸（或同胚于闭球），去掉紧性或凸性即失效（如平移、旋转开圆盘）"],
        generalRequirements: ["使用 Brouwer 必须确认定义域紧凸且映射自映射", "使用 Lefschetz 必须确认空间紧 CW 且用有理系数计算迹", "度的计算必须指明定向与基本类选取"],
        forbiddenErrors: ["【紧凸性缺失】对开球、无界集或非凸集套用 Brouwer 不动点定理", "【充分必要混淆】由 L(f) = 0 断言无不动点", "【维数条件错】Borsuk-Ulam 中把目标维数取为 n+1 或更高", "【定向未定】计算度时未固定定向导致符号错误", "【向量场结论误推】在奇数维球面上断言不存在非零切向量场"],
        parameterConstraints: { domainShape: "Brouwer 需紧凸（或同胚闭球）", spaceType: "Lefschetz 需紧 CW 复形，系数取 Q", dimensionMatching: "Borsuk-Ulam 需 f: S^n -> R^n（目标维数恰为 n）", parityDependence: "毛球定理仅对偶数维球面 S^{2k}" },
        closureChecks: ["确认定义域的紧性与凸性（或等价条件）", "确认所用定理是充分还是充要", "确认维数与奇偶条件", "确认度与迹计算中的定向与系数一致"],
        scenarioChecks: { existenceOfFixedPoint: ["先尝试 Brouwer（紧凸）再考虑 Lefschetz（一般紧 CW）", "确认自映射性质"], vectorFieldOnSphere: ["偶数维球面用毛球定理", "确认奇数维存在处处非零向量场"], antipodalArguments: ["用 Borsuk-Ulam 处理均分或对称性问题", "确认目标空间维数与球面维数匹配"] },
    },
    // 纤维化长正合列与 Hurewicz 定理：高阶同伦的计算入口。
    "algtop-fibration-exact-sequence-hurewicz": {
        definitions: ["Serre 纤维化：具同伦提升性质的映射 p: E -> B", "纤维 F = p^{-1}(b_0)；纤维丛为局部平凡的特例", "n 连通：pi_k 平凡对所有 k <= n"],
        formulas: ["长正合列：... -> pi_n(F) -> pi_n(E) -> pi_n(B) -> pi_{n-1}(F) -> ...（B 道路连通，带基点）", "Hurewicz：X 为 (n-1) 连通（n >= 2）=> pi_n(X) 同构于 H_n(X)", "n = 1 情形：H_1(X) 同构于 pi_1(X)^{ab}", "Hopf 纤维化：S^1 -> S^3 -> S^2 给出 pi_3(S^2) = Z"],
        theorems: ["纤维化长正合列对 Serre 纤维化成立，覆盖映射与主丛为特例", "Hurewicz 定理要求 (n-1) 连通性，缺失连通性时 pi_n 与 H_n 一般不同构（如 pi_3(S^2) = Z 而 H_3(S^2) = 0）", "高阶同伦群交换（n >= 2），但 pi_n 的计算一般困难，不存在 Mayer-Vietoris 型分解", "相对 Hurewicz 与 Whitehead 定理：CW 复形间诱导 pi_* 同构的映射是同伦等价"],
        generalRequirements: ["使用长正合列必须确认映射为纤维化（或验证同伦提升性质）并固定基点", "使用 Hurewicz 必须验证连通度条件并说明适用的维数 n", "由同伦群同构推同伦等价必须调用 Whitehead 定理并确认 CW 条件与映射存在性"],
        forbiddenErrors: ["【纤维化未验证】对任意满射套用长正合列", "【连通度缺失】不验证 (n-1) 连通就把 pi_n 与 H_n 等同", "【Whitehead 误用】仅由抽象同伦群同构（无实现映射）断言同伦等价", "【交换性误推】把 pi_1 当作交换群使用", "【正合列断章】只用一段序列而不分析相邻映射的核与像"],
        parameterConstraints: { fibrationCondition: "需同伦提升性质（Serre 纤维化）", connectivityRequirement: "Hurewicz 需 (n-1) 连通，n >= 2", basepointChoice: "序列基于基点，需 B 道路连通", whiteheadScope: "Whitehead 定理限于 CW 复形且需具体映射" },
        closureChecks: ["确认纤维化性质与基点条件", "确认 Hurewicz 的连通度与维数匹配", "确认由正合列推出的结论经过核像分析", "确认高阶同伦交换性与 pi_1 情形区分"],
        scenarioChecks: { hopfFibrationComputation: ["用 S^1 -> S^3 -> S^2 计算 pi_3(S^2) 与 pi_n(S^3) 的关系", "确认纤维为 S^1"], loopSpaceAndPathFibration: ["用道路纤维化 Omega B -> PB -> B 降维", "确认 PB 可缩"], connectivityBootstrapping: ["先用 Hurewicz 求最低非零同伦群", "确认更高维需谱序列或其他工具"] },
    },
};
