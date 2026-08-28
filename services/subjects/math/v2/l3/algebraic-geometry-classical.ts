import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数几何-古典代数几何”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ALGEBRAIC_GEOMETRY_CLASSICAL_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Hilbert 零点定理：代数闭域上根理想与代数集之间的反变对应。
    "hilbert-nullstellensatz-classical": {
        id: "hilbert-nullstellensatz-classical", l2Key: "algebraic-geometry-classical", name: "Hilbert 零点定理", kind: "theorem",
        aliases: ["Hilbert零点定理", "Nullstellensatz", "Hilbert Nullstellensatz", "希尔伯特零点定理", "强零点定理", "弱零点定理"],
    },
    // 理想-代数集反变对应：I(V(J)) = √J，V(I(X)) = X。
    "ideal-variety-correspondence": {
        id: "ideal-variety-correspondence", l2Key: "algebraic-geometry-classical", name: "理想-代数集反变对应", kind: "theorem",
        aliases: ["理想-代数集对应", "ideal-variety correspondence", "理想零点对应", "V-I对应", "根理想对应"],
    },
    // Zariski 拓扑：以代数集为闭集的拓扑，闭集满足有限并、任意交。
    "zariski-topology": {
        id: "zariski-topology", l2Key: "algebraic-geometry-classical", name: "Zariski 拓扑", kind: "object",
        aliases: ["Zariski拓扑", "Zariski topology", "扎里斯基拓扑"],
    },
    // 不可约分解定理：Noetherian 拓扑空间中每个代数集唯一分解为有限个不可约分支。
    "irreducible-decomposition": {
        id: "irreducible-decomposition", l2Key: "algebraic-geometry-classical", name: "代数集的不可约分解", kind: "theorem",
        aliases: ["不可约分解", "irreducible decomposition", "代数集分解定理"],
    },
    // Bezout 定理（平面曲线经典形式）：射影平面上两条无公共分支曲线交点重数总和 = deg C1 · deg C2。
    "bezout-theorem-plane-curves": {
        id: "bezout-theorem-plane-curves", l2Key: "algebraic-geometry-classical", name: "平面曲线 Bezout 定理", kind: "theorem",
        aliases: ["Bezout定理", "Bezout theorem plane curves", "贝祖定理", "射影平面交点定理", "curve intersection theorem"],
    },
    // Zariski 切空间与光滑性：切空间维数 = 局部维数 ⇔ 点光滑。
    "zariski-tangent-space-smoothness": {
        id: "zariski-tangent-space-smoothness", l2Key: "algebraic-geometry-classical", name: "Zariski 切空间与光滑性", kind: "criterion",
        aliases: ["Zariski切空间", "光滑点判据", "smooth point criterion", "切空间维数判据", "singular point criterion"],
    },
    // 有理映射与双有理等价：稠密开集上定义的映射及其可逆等价关系。
    "rational-map-birational": {
        id: "rational-map-birational", l2Key: "algebraic-geometry-classical", name: "有理映射与双有理等价", kind: "object",
        aliases: ["有理映射", "rational map", "双有理等价", "birational equivalence", "有理等价", "双有理映射"],
    },
    // 代数簇维数：由坐标环 Krull 维数或超越次数刻画。
    "dimension-krull-transcendence": {
        id: "dimension-krull-transcendence", l2Key: "algebraic-geometry-classical", name: "代数簇的维数", kind: "criterion",
        aliases: ["代数簇维数", "Krull维数", "超越次数", "transcendence degree", "dimension of variety", "Noether正规化维数"],
    },
    // Hilbert 基定理：Noether 环上多项式环仍 Noether，故 k[x_1,...,x_n] 每个理想有限生成。
    "hilbert-basis-theorem": {
        id: "hilbert-basis-theorem", l2Key: "algebraic-geometry-classical", name: "Hilbert 基定理", kind: "theorem",
        aliases: ["Hilbert基定理", "希尔伯特基定理", "Hilbert basis theorem"],
    },
    // 光滑三次曲面上的 27 条直线：代数闭域上光滑三次曲面恰含 27 条直线。
    "cubic-surface-27-lines": {
        id: "cubic-surface-27-lines", l2Key: "algebraic-geometry-classical", name: "三次曲面上的 27 条直线", kind: "theorem",
        aliases: ["27条直线", "27直线", "三次曲面27条线", "Cayley-Salmon定理", "twenty-seven lines", "27 lines on a cubic surface", "cubic surface lines"],
    },
    // 光滑平面三次曲线的 9 个拐点：char ≠ 3 时光滑平面三次曲线恰有 9 个拐点，构成 Hesse 配置。
    "plane-cubic-nine-flexes": {
        id: "plane-cubic-nine-flexes", l2Key: "algebraic-geometry-classical", name: "平面三次曲线的 9 个拐点", kind: "theorem",
        aliases: ["9个拐点", "九个拐点", "三次曲线拐点", "nine inflection points", "nine flexes", "Hesse配置", "Hesse configuration", "拐点配置", "3-挠点"],
    },
    // 亏格-次数公式：光滑平面 d 次曲线的几何亏格为 (d-1)(d-2)/2。
    "genus-degree-formula": {
        id: "genus-degree-formula", l2Key: "algebraic-geometry-classical", name: "亏格-次数公式", kind: "formula",
        aliases: ["亏格-次数公式", "亏格次数公式", "genus-degree formula", "平面曲线亏格", "几何亏格公式", "Plücker亏格公式", "delta不变量"],
    },
    // 仿射坐标环：k[X] = k[x_1,...,x_n] / I(X)，坐标环同构 ↔ 仿射簇同构（反变）。
    "affine-coordinate-ring": {
        id: "affine-coordinate-ring", l2Key: "algebraic-geometry-classical", name: "仿射坐标环", kind: "object",
        aliases: ["仿射坐标环", "affine coordinate ring", "坐标环", "affine algebra", "k[X]", "affine variety coordinate ring"],
    },
    // Noether 正规化引理：任意有限型 k-代数上有限满同态到 k[y_1,...,y_d]。
    "noether-normalization-lemma": {
        id: "noether-normalization-lemma", l2Key: "algebraic-geometry-classical", name: "Noether 正规化引理", kind: "lemma",
        aliases: ["Noether正规化", "Noether normalization lemma", "诺特正规化引理", "有限满态射到仿射空间"],
    },
    // Jacobian 判别法：仿射簇的光滑点由 Jacobian 秩条件刻画。
    "jacobian-criterion-smoothness": {
        id: "jacobian-criterion-smoothness", l2Key: "algebraic-geometry-classical", name: "Jacobian 光滑性判别法", kind: "criterion",
        aliases: ["Jacobian判别法", "Jacobian criterion", "雅可比判别法", "smoothness criterion", "Jacobian秩判据"],
    },
    // 消元理想：投影像的 Zariski 闭包由消元理想给出。
    "elimination-ideal-projection": {
        id: "elimination-ideal-projection", l2Key: "algebraic-geometry-classical", name: "消元理想与投影闭包", kind: "theorem",
        aliases: ["消元理想", "elimination ideal", "投影闭包", "projection closure", "消元定理"],
    },
    // Gröbner 基与 Buchberger 算法：计算理想标准形与消元的算法基础。
    "buchberger-groebner-basis": {
        id: "buchberger-groebner-basis", l2Key: "algebraic-geometry-classical", name: "Gröbner 基与 Buchberger 算法", kind: "algorithm",
        aliases: ["Gröbner基", "Groebner基", "Buchberger算法", "Buchberger algorithm", "S-多项式", "S-polynomial", "初始理想", "monomial order"],
    },
    // 有限态射与整扩张：拓扑闭映射且纤维有限，对应坐标环的整扩张。
    "finite-morphism-integral-extension": {
        id: "finite-morphism-integral-extension", l2Key: "algebraic-geometry-classical", name: "有限态射与整扩张", kind: "theorem",
        aliases: ["有限态射", "finite morphism", "整扩张", "integral extension", "闭映射", "有限纤维态射"],
    },
    // 纤维维数定理：满态射一般纤维维数 = 定义域维数 − 目标维数。
    "fiber-dimension-theorem": {
        id: "fiber-dimension-theorem", l2Key: "algebraic-geometry-classical", name: "纤维维数定理", kind: "theorem",
        aliases: ["纤维维数定理", "fiber dimension theorem", "维数纤维公式", "上半连续维数", "Chevalley纤维维数"],
    },
    // 仿射簇之间的态射：对应到坐标环 k-代数同态的反变对应。
    "affine-variety-morphism": {
        id: "affine-variety-morphism", l2Key: "algebraic-geometry-classical", name: "仿射簇之间的态射", kind: "theorem",
        aliases: ["仿射簇态射", "affine morphism", "morphism of affine varieties", "多项式映射", "k-代数同态对应"],
    },
    // 齐次 Nullstellensatz：射影空间中齐次理想与射影代数集的对应。
    "projective-nullstellensatz-homogeneous": {
        id: "projective-nullstellensatz-homogeneous", l2Key: "algebraic-geometry-classical", name: "射影 Nullstellensatz", kind: "theorem",
        aliases: ["射影Nullstellensatz", "射影零点定理", "projective Nullstellensatz", "齐次零点定理", "irrelevant ideal"],
    },
    // Hilbert 函数与 Hilbert 多项式：齐次坐标环分次分量的维数序列。
    "hilbert-polynomial-function": {
        id: "hilbert-polynomial-function", l2Key: "algebraic-geometry-classical", name: "Hilbert 函数与 Hilbert 多项式", kind: "theorem",
        aliases: ["Hilbert函数", "Hilbert多项式", "Hilbert polynomial", "Hilbert function", "分次坐标环Hilbert序列"],
    },
    // Veronese 嵌入：把 P^n 嵌入到 P^N 的 d 次单项式空间。
    "veronese-embedding": {
        id: "veronese-embedding", l2Key: "algebraic-geometry-classical", name: "Veronese 嵌入", kind: "object",
        aliases: ["Veronese嵌入", "Veronese embedding", "d次单项式嵌入", "维罗尼塞嵌入", "d-uple embedding"],
    },
    // Segre 嵌入：把 P^m × P^n 嵌入到 P^{(m+1)(n+1)-1}。
    "segre-embedding": {
        id: "segre-embedding", l2Key: "algebraic-geometry-classical", name: "Segre 嵌入", kind: "object",
        aliases: ["Segre嵌入", "Segre embedding", "塞格雷嵌入", "射影积嵌入", "product embedding"],
    },
    // 射影对偶原理：射影平面中点与直线的对偶命题成立性一致。
    "duality-projective-plane": {
        id: "duality-projective-plane", l2Key: "algebraic-geometry-classical", name: "射影对偶原理", kind: "theorem",
        aliases: ["射影对偶", "对偶原理", "duality principle", "projective duality", "对偶命题"],
    },
    // 交比不变性：射影变换保持四点交比。
    "cross-ratio-invariance": {
        id: "cross-ratio-invariance", l2Key: "algebraic-geometry-classical", name: "交比与射影不变性", kind: "theorem",
        aliases: ["交比", "cross-ratio", "cross ratio invariance", "交比不变量", "四点交比", "projective invariant"],
    },
    // 射影 Bezout 定理：射影空间中若干超曲面按重数相交为次数乘积。
    "bezout-theorem-projective": {
        id: "bezout-theorem-projective", l2Key: "algebraic-geometry-classical", name: "射影 Bezout 定理", kind: "theorem",
        aliases: ["射影Bezout定理", "Bezout theorem projective", "高维Bezout", "超曲面交点定理", "complete intersection Bezout"],
    },
    // Grassmann 簇与 Plücker 嵌入：k-维子空间参数空间及其射影嵌入。
    "grassmannian-plucker-embedding": {
        id: "grassmannian-plucker-embedding", l2Key: "algebraic-geometry-classical", name: "Grassmann 簇与 Plücker 嵌入", kind: "object",
        aliases: ["Grassmann簇", "Grassmannian", "Plücker嵌入", "Plucker embedding", "普吕克嵌入", "普吕克坐标", "Plücker coordinates"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const ALGEBRAIC_GEOMETRY_CLASSICAL_L3_RULES: Record<string, MathV2L3Rules> = {
    // Hilbert 零点定理：代数闭域上仿射代数集与根理想之间一一对应。
    "hilbert-nullstellensatz-classical": {
        definitions: ["Hilbert 零点定理研究代数闭域上多项式理想与其零点集之间的严格对应关系，是把代数与几何联系起来的桥梁。"],
        formulas: ["弱形式：k 代数闭时，理想 I ⊂ k[x_1,...,x_n] 满足 V(I) = ∅ ⇔ I = (1)。", "强形式：k 代数闭时，对任意理想 I，I(V(I)) = √I，其中 √I = {f : f^m ∈ I 某 m}。", "极大理想描述：k 代数闭时 k[x_1,...,x_n] 的极大理想恰为 (x_1-a_1, ..., x_n-a_n)，(a_1,...,a_n) ∈ A^n(k)。"],
        theorems: ["Hilbert 零点定理（强形式）：设 k 代数闭、I ⊂ k[x_1,...,x_n] 理想，则 I(V(I)) = √I。", "弱形式：k 代数闭时理想 I 无公共零点 ⇔ I = (1)。", "推论：仿射代数集范畴与 k[x_1,...,x_n] 的根理想集合反变一一对应；极大理想对应 A^n 中的点。"],
        generalRequirements: ["必须验证底域 k 代数闭；非代数闭时应改用 k-点或几何点的区分。", "必须区分根理想 √I 与理想 I 本身：非根理想只满足 I(V(I)) ⊇ I 而非等号。"],
        forbiddenErrors: ["【代数闭前提遗漏】在 R、Q 上直接使用强形式 Nullstellensatz。", "【根理想遗漏】把 I(V(I)) = I 写作恒等而未取根。", "【几何点/k-点混淆】非代数闭域上把 V(I) 简单理解为 k-有理点。", "【反变对应方向错用】声称 I ⊂ J ⇒ V(I) ⊂ V(J)，方向应反转。"],
        parameterConstraints: { algebraicClosure: "底域 k 必须代数闭；否则用 k-点和几何点分别处理。", radicalIdeal: "对应关系需在根理想层次讨论；非根理想需在概形语言下处理。" },
        closureChecks: ["确认底域代数闭。", "在需要时取 √I。", "利用 I(V(I)) = √I 与 V(I(X)) = X 建立双向对应。"],
        scenarioChecks: { finiteSolutions: ["方程组无公共解 ⇔ 生成理想含 1（由弱形式与 Bezout 恒等式给出算法）。"], nonAlgebraicallyClosed: ["R 或 Q 上使用时应换到代数闭包 k̄ 上讨论几何点，再回退 Galois 群不变量。"], schemeExtension: ["非根理想保留幂零信息，进入仿射概形 Spec 的语言。"] },
    },
    // 理想-代数集反变对应：I(V(J)) = √J、V(I(X)) = X 建立根理想与代数集的严格双射。
    "ideal-variety-correspondence": {
        definitions: ["仿射空间上多项式理想与代数集之间的反变对应研究哪些代数信息通过 V(-) 与 I(-) 保存下来，是古典代数几何的字典。"],
        formulas: ["V(J) = {p ∈ A^n : f(p) = 0 for all f ∈ J}；I(X) = {f ∈ k[x_1,...,x_n] : f(p) = 0 for all p ∈ X}。", "对应关系：I ⊂ J ⇒ V(I) ⊃ V(J)；X ⊂ Y ⇒ I(X) ⊃ I(Y)（反变）。", "在代数闭域上（Nullstellensatz）：I(V(J)) = √J，V(I(X)) = X。"],
        theorems: ["理想-代数集反变对应：仿射代数集 ↔ 根理想 是反变一一对应（代数闭域）。", "极大理想 ↔ 点；素理想 ↔ 不可约代数集；根理想 ↔ 一般代数集。", "运算对应：V(I + J) = V(I) ∩ V(J)；V(I ∩ J) = V(IJ) = V(I) ∪ V(J)（对应到 √-封闭下）。"],
        generalRequirements: ["必须在代数闭域上使用严格双射；否则只保留一侧包含关系。", "必须区分素/根/极大理想与其几何对应的类型（点、不可约集、一般集）。"],
        forbiddenErrors: ["【方向反用】I ⊂ J 推出 V(I) ⊂ V(J)（错误：反变对应，应反转方向）。", "【运算映射错误】V(I ∩ J) ≠ V(I) ∪ V(J) 之外的错误组合。", "【非代数闭滥用】直接在 Q 上把 I(V(I)) 写为 √I。", "【素理想与不可约集混用】只由根理想推出不可约。"],
        parameterConstraints: { field: "严格双射需要代数闭底域。", radicalIdeal: "对应对象是根理想 ↔ 代数集。" },
        closureChecks: ["核对底域代数闭。", "验证反变方向。", "利用 V/I 运算规律计算并/交/求根。"],
        scenarioChecks: { irreducibleComponent: ["不可约分支对应素理想的极小素约分支。"], intersectionUnion: ["V(I+J) 用于求交集，V(IJ) 或 V(I∩J) 用于求并集。"], coordinateRingIsomorphism: ["仿射簇同构 ↔ 坐标环同构（k-代数同构）。"] },
    },
    // Zariski 拓扑：以代数集为闭集，Noetherian 且几乎所有开集稠密。
    "zariski-topology": {
        definitions: ["Zariski 拓扑研究把仿射（或射影）空间上的代数集当作闭集所定义的拓扑结构；它非常「粗糙」，但是研究代数簇的自然工具。"],
        formulas: ["A^n 的 Zariski 闭集：V(J)，J ⊂ k[x_1,...,x_n] 理想；有限并 V(J_1) ∪ V(J_2) = V(J_1 J_2)，任意交 ∩_α V(J_α) = V(∑_α J_α)。", "在代数集 X 上诱导子空间拓扑：X 的 Zariski 闭子集 = 包含在 X 中的代数集。", "开集基（主开集）：D(f) = X \\ V(f)；D(f) ∩ D(g) = D(fg)。"],
        theorems: ["Zariski 拓扑将代数集定义为闭集；A^n 是 Noetherian 空间（下降链条件）。", "不可约代数集恰为不可约 Zariski 闭集；每个代数集分解为有限个不可约闭集之并（不可约分解定理）。", "在不可约簇上任意非空开集都是稠密的（不可约空间的特征）。", "有限型 k-代数簇上的连续代数映射即多项式态射；这将「几何连续」与「代数多项式」等价化。"],
        generalRequirements: ["必须与欧氏（度量）拓扑严格区分：Zariski 拓扑很粗糙，非 Hausdorff（除有限集外）。", "开集基通常取主开集 D(f)。"],
        forbiddenErrors: ["【Hausdorff 误设】声称仿射空间 A^n（在 Zariski 拓扑下）是 Hausdorff。", "【欧氏拓扑替代】用欧氏拓扑的稠密、开集直觉代替 Zariski 论证。", "【闭集运算错误】V(I ∩ J) 与 V(I ∪ J)（后者一般不良定，应换成 V(IJ) 或 V(I) ∪ V(J)）混淆。", "【非 Noetherian 直觉滥用】默认下降链无限。"],
        parameterConstraints: { closedSets: "Zariski 闭集为形如 V(J) 的代数集。", noetherian: "A^n 是 Noetherian 拓扑空间，闭集下降链条件成立。" },
        closureChecks: ["写出闭集/开集的代数描述。", "验证运算封闭性（有限并、任意交）。", "在不可约簇上利用非空开集稠密性质。"],
        scenarioChecks: { irreducibleSpace: ["不可约簇上任意非空开集稠密，用于反证/构造论证。"], principalOpens: ["主开集 D(f) 构成拓扑基；每个 D(f) 仍为仿射簇 Spec R_f。"], continuousMap: ["Zariski 连续映射恰为多项式态射（有限型情形）。"] },
    },
    // 不可约分解定理：Noetherian 空间中每个代数集分解为有限个不可约分支之并。
    "irreducible-decomposition": {
        definitions: ["代数集的不可约分解研究 Noetherian 空间中如何把代数集写成有限个不可约闭集的并，用以定位「几何分支」。"],
        formulas: ["设 X ⊂ A^n 代数集，则 X = ⋃_{i=1}^{r} X_i，其中每个 X_i 不可约且 X_i ⊄ X_j (i ≠ j)；分解在同构与排列意义下唯一。", "代数学侧：I(X) = ⋂ P_i，P_i = I(X_i) 素理想（极小素约分支）。"],
        theorems: ["不可约分解定理：Noetherian 拓扑空间中每个闭集写成有限个不可约闭集的极小并；对代数集分解与素理想的极小素约分支一一对应。", "唯一性：极小并中的不可约分量在同构与排列意义下唯一。", "推论：坐标环 k[X] 的极小素理想数 = X 的不可约分支数。"],
        generalRequirements: ["必须在 Noetherian 空间中讨论（代数集自动满足）。", "分解必须极小：X_i 之间无包含关系。"],
        forbiddenErrors: ["【极小性遗漏】声称分解唯一时未去掉多余的 X_i ⊂ X_j 分支。", "【极小素约分支/素理想混用】把嵌入素理想（primary decomposition 中的非极小素）当作分支。", "【无限分解误设】声称代数集可有无限个不可约分支。", "【不可约与连通混淆】把连通性直接等同于不可约性。"],
        parameterConstraints: { noetherianSpace: "空间必须 Noetherian；代数集自动满足。", minimality: "分解中各 X_i 两两无包含关系。" },
        closureChecks: ["证明代数集是 Noetherian 拓扑。", "找出所有极小素约分支 P_i = I(X_i)。", "验证并集为 X 且分支极小。"],
        scenarioChecks: { primaryDecomposition: ["交换代数中通过 primary decomposition 得到不可约分支：极小素约分支给出几何分支。"], reducibleVarietyExample: ["V(xy) = V(x) ∪ V(y) 是两条轴的并；标准初学示例。"], dimensionOfComponents: ["各分支可能维数不同，整体维数取分支维数的最大值。"] },
    },
    // Bezout 定理（平面曲线经典形式）：两条平面射影曲线无公共分支时交点重数总和 = 次数乘积。
    "bezout-theorem-plane-curves": {
        definitions: ["平面射影曲线的 Bezout 定理研究射影平面 P^2 上两条曲线的相交结构，把「几何交点数」精确翻译为「多项式次数乘积」。"],
        formulas: ["设 C_1 = V(F), C_2 = V(G) 是 P^2 上齐次多项式 F, G（次数 d_1, d_2）定义的平面曲线，且无公共不可约分支，则 ∑_{p ∈ C_1 ∩ C_2} m_p(C_1, C_2) = d_1 · d_2，其中 m_p 为局部交点重数。", "局部交重数 m_p(C_1, C_2) = dim_k O_{P^2, p} / (F, G)。"],
        theorems: ["平面 Bezout 定理：代数闭域上 P^2 中两条无公共分支的曲线 C_1, C_2 的交点（按重数计）总数为 d_1 · d_2。", "推论：仿射平面上两条曲线交点数 ≤ d_1 · d_2；等号需在射影闭包上按重数计。", "推论（Bezout 在高维）：P^n 中 n 条超曲面 V(F_1),...,V(F_n)（次数 d_i）若相交为有限点集，则计重后交点数为 ∏ d_i。"],
        generalRequirements: ["必须在代数闭域上使用；否则可能有交点消失到代数闭包中。", "必须使用射影闭包并按局部交重数计数；仿射交点数与结论一般不等。"],
        forbiddenErrors: ["【仿射与射影混用】把仿射交点数（无穷远点缺失）直接与 d_1 · d_2 比较。", "【公共分支忽视】两条曲线有公共不可约分支时直接套 Bezout（结论无限）。", "【重数忽略】只数交点几何位置个数而不计局部交重数。", "【非代数闭滥用】在 R 或 Q 上直接使用完整 Bezout 结论。"],
        parameterConstraints: { field: "代数闭域。", noCommonComponent: "C_1, C_2 无公共不可约分支。", ambientSpace: "工作空间为射影平面 P^2（或推广到 P^n 的完全交）。", multiplicity: "交点按局部交重数计数。" },
        closureChecks: ["验证 C_1, C_2 无公共分支。", "取射影闭包并列出所有交点（含无穷远）。", "计算各点的局部交重数并求和核对 d_1 · d_2。"],
        scenarioChecks: { conicIntersection: ["两条 P^2 中光滑二次曲线一般相交于 4 点（按重数），退化时重数集中。"], lineCurveIntersection: ["直线（d_1=1）与 d 次曲线相交按重数为 d 点，若含分支则退化。"], multiplicityFromLocalRing: ["局部交重数用局部环 dim_k O_{P^2,p}/(F,G) 计算，可分析尖点、切点等重合情形。"] },
    },
    // Zariski 切空间与光滑性：切空间维数 = 局部维数 ⇔ 点光滑。
    "zariski-tangent-space-smoothness": {
        definitions: ["Zariski 切空间 T_p X = (m_p / m_p^2)^*（对偶）研究代数簇在点 p 处的「一阶信息」；其维数与局部维数的比较给出光滑/奇异判据。"],
        formulas: ["T_p X = Hom_k(m_p / m_p^2, k)，其中 m_p ⊂ O_{X, p} 是局部环极大理想。", "Jacobian 判别法：X = V(f_1, ..., f_r) ⊂ A^n 在点 p 光滑 ⇔ rank(∂f_i / ∂x_j)|_p = n - dim_p X（局部维数）。", "光滑判据：dim T_p X = dim_p X ⇔ p 光滑；dim T_p X > dim_p X ⇔ p 奇异。"],
        theorems: ["光滑点判据：代数簇 X 在点 p 光滑 ⇔ Zariski 切空间维数等于局部维数 dim_p X。", "Jacobian 判别法：对完全交 X = V(f_1,...,f_r) 于代数闭域，p 光滑 ⇔ Jacobian 矩阵 (∂f_i/∂x_j)|_p 的秩为 n - dim_p X。", "推论：奇异点集是 X 的真闭子集；光滑点集在 X 中稠密开。"],
        generalRequirements: ["必须在代数闭域上（或明确使用几何点）；否则须区分 k-点与几何光滑。", "必须计算局部维数 dim_p X 而不能默认全局维数。"],
        forbiddenErrors: ["【局部维数忽视】用全局维数替代 dim_p X。", "【Jacobian 秩误用】对非完全交直接套 rank = n - dim。", "【非代数闭滥用】在 R 上把 Jacobian 判别法结论直接当几何光滑。", "【切空间维数误算】用切向量数替代 m_p/m_p^2 的对偶维数。"],
        parameterConstraints: { algebraicClosure: "使用几何光滑判据时底域宜代数闭或使用几何点。", localDimension: "使用 dim_p X 而非全局 dim X。", completeIntersection: "Jacobian 秩公式的精确形式要求完全交（一般代数簇需谨慎）。" },
        closureChecks: ["求局部环 O_{X, p} 与极大理想 m_p。", "计算 dim_k m_p/m_p^2。", "与 dim_p X 比较判定光滑或奇异。"],
        scenarioChecks: { nodeVsCusp: ["平面曲线节点与尖点由局部 Jacobian 秩和局部环结构区分。"], smoothLocusOpen: ["光滑点集是 X 的开稠密子集，是许多几何论证的默认工作空间。"], embeddingDimension: ["dim T_p X 也称嵌入维数——p 附近把 X 嵌入到 A^{dim T_p X} 而不能更低。"] },
    },
    // 有理映射与双有理等价：稠密开集上定义的映射及其可逆等价。
    "rational-map-birational": {
        definitions: ["代数几何中的有理映射研究只在稠密开集上定义的态射；双有理等价把两个簇在忽略低维「例外集」的意义下视为相同。"],
        formulas: ["有理映射 φ: X ⇢ Y 由某个稠密开子集 U ⊂ X 上的态射 φ_U: U -> Y 决定（两个开集上定义相同则视为同一有理映射）。", "双有理映射：存在稠密开 U ⊂ X, V ⊂ Y 使 φ|_U: U -> V 与 ψ|_V: V -> U 互逆的态射。", "推论：双有理等价 ⇔ 函数域 K(X) ≅ K(Y)（作为 k-代数同构）。"],
        theorems: ["有理映射-函数域对应：不可约簇之间的有理映射 X ⇢ Y 对应 k-代数嵌入 K(Y) -> K(X)；显然双有理 ⇔ 函数域同构。", "推论：任意不可约代数簇双有理于 A^n（有理簇）⇔ 函数域是 k 的纯超越扩张。", "推论：双有理不变量包括函数域、Kodaira 维数、几何亏格等；这些不能通过局部替换改变。"],
        generalRequirements: ["必须区分「态射」（处处定义）与「有理映射」（稠密开集上定义）。", "定义域和目标须不可约或至少讨论时限制在不可约分支。"],
        forbiddenErrors: ["【处处定义误设】认为有理映射在所有点都定义。", "【双有理与同构混用】把双有理等价当作范畴同构；实际它更弱，允许低维例外集。", "【函数域方向反用】把 K(X) -> K(Y) 与 X ⇢ Y 的方向搞反。", "【可约簇滥用】在可约簇上直接讨论有理映射而未选定分支。"],
        parameterConstraints: { irreducibility: "定义有理映射的自然设置是不可约簇。", denseOpenSet: "定义域必须是稠密开子集。", functionFieldK: "双有理等价用函数域 K(X) 的 k-代数同构刻画。" },
        closureChecks: ["写出稠密开集 U 与态射 φ_U。", "分析不可延拓的例外集 X \\ U。", "如需双有理，找逆映射并核实函数域同构。"],
        scenarioChecks: { rationalVariety: ["有理簇 = 双有理于 A^n 或 P^n；例如任意非奇异二次超曲面 P^n 在 char ≠ 2 时都是有理簇。"], stereographicProjection: ["球面到平面的立体投影是双有理映射，把 (0-维) 一点作为例外集。"], blowUp: ["Blow-up 是典型双有理但非同构的变换：改变簇的模型但保留函数域。"] },
    },
    // 代数簇维数：坐标环 Krull 维数 = 函数域超越次数 = 极大不可约链长度。
    "dimension-krull-transcendence": {
        definitions: ["代数簇的维数研究不可约代数簇 X 的「几何维数」，可等价地由坐标环的 Krull 维数、函数域的超越次数或极大不可约链的长度刻画。"],
        formulas: ["dim X = Krull dim k[X] = tr.deg_k K(X)（不可约仿射簇，k 代数闭）；等价地 dim X = 极大不可约链 X_0 ⊊ X_1 ⊊ ... ⊊ X_d = X 的长度 d。", "对射影不可约簇：dim X 由齐次坐标环的 Krull 维数减 1 给出。", "维数的可加性：对显式态射 f: X -> Y，一般纤维维数 = dim X - dim Y（当 f 满且 Y 不可约）。"],
        theorems: ["维数三重等价（k 代数闭、X 不可约仿射簇）：Krull dim k[X] = tr.deg_k K(X) = 极大不可约链长度。", "Noether 正规化：任意不可约仿射簇有到 A^d 的有限满态射，d = dim X。", "纤维维数定理：满态射 f: X -> Y 一般纤维维数 = dim X - dim Y；对每个 y ∈ Y，dim f^{-1}(y) ≥ dim X - dim Y。"],
        generalRequirements: ["必须在不可约簇上讨论标准维数；可约情形取极大分支维数。", "必须区分「拓扑维数」（不可约链长度）与「代数维数」（Krull dim）在一般 Noetherian 拓扑中的等价前提。"],
        forbiddenErrors: ["【方程个数假设】声称 dim X = n - (方程数)；只在完全交且极小生成情形才成立。", "【超越次数误算】在非代数闭域上直接把函数域视为纯超越扩张。", "【纤维维数下界与等式混用】把 dim f^{-1}(y) 恒等于 dim X - dim Y（一般只是下界）。", "【可约簇维数误取平均】把可约簇维数取分支维数平均或和。"],
        parameterConstraints: { irreducibility: "标准维数针对不可约簇；可约簇取分支最大值。", baseField: "严格三重等价在代数闭域上；一般情形须区分几何维数与算术维数。", finiteType: "维数概念在有限型 k-代数上成立。" },
        closureChecks: ["选取一种维数定义（Krull、超越次数或链长度）。", "在给定情境下计算并核对与另一种定义一致。", "如涉及态射，使用 Noether 正规化或纤维维数定理。"],
        scenarioChecks: { completeIntersection: ["完全交 X = V(f_1,...,f_r) ⊂ A^n 且 f_i 极小生成时 dim X = n - r。"], projectiveDimension: ["射影不可约簇 dim = Krull(齐次坐标环) - 1。"], hypersurface: ["超曲面 V(f) ⊂ A^n 不可约时 dim = n - 1；这也是「1 个方程去掉 1 维」的正确适用场景。"] },
    },
    // Hilbert 基定理：Noether 环上多项式环仍 Noether，是代数集由有限方程定义的代数基础。
    "hilbert-basis-theorem": {
        definitions: ["Hilbert 基定理研究多项式环的 Noether 性：若系数环 Noether，则其上一元多项式环仍 Noether；几何上它保证代数集总能由有限个多项式方程定义，是古典代数几何良定性的根基。"],
        formulas: ["定理陈述：R Noether ⇒ R[x] Noether；归纳得 R[x_1,...,x_n] Noether。", "Noether 环等价刻画：每个理想有限生成 ⇔ 理想升链条件（ACC）⇔ 每个非空理想族有极大元。", "几何推论：任意代数集 X = V(S)（S ⊂ k[x_1,...,x_n] 任意子集）可写成 X = V(f_1,...,f_r)，有限个多项式。"],
        theorems: ["Hilbert 基定理：设 R 为 Noether 环，则多项式环 R[x] 也是 Noether 环；特别地域 k（或 Z、任意 Noether 环）上的 k[x_1,...,x_n] Noether，其每个理想有限生成。", "推论：Noether 环上有限生成代数仍 Noether；坐标环 k[X] Noether。", "推论（几何 DCC 与 Zariski 拓扑 Noether 性）：仿射空间中代数集满足降链条件，A^n 是 Noetherian 拓扑空间，任意代数集有唯一不可约分解为有限个不可约分量。"],
        generalRequirements: ["必须从系数环 Noether 出发；对非 Noether 系数环结论失效。", "「有限生成」「ACC」「极大元存在」三种 Noether 刻画等价，可按语境选用。"],
        forbiddenErrors: ["【无穷变量滥用】对无限变量多项式环 k[x_1, x_2, ...] 声称 Noether（其非 Noether，理想 (x_1, x_2, ...) 非有限生成）。", "【系数环 Noether 遗漏】未验证系数环 Noether 就断言多项式环 Noether。", "【生成元个数误界】声称理想生成元个数受变量数 n 限制（一般无此界，只有限生成）。", "【ACC 方向混淆】把理想升链条件说成降链条件（后者是 Artin 环性质）。"],
        parameterConstraints: { noetherianBase: "系数环 R 必须 Noether（域 k、Z、PID 等均满足）。", finitelyManyVariables: "结论仅对有限个变量的多项式环成立。", equivalentForms: "有限生成 / ACC / 极大元存在三条件等价。" },
        closureChecks: ["确认系数环 Noether。", "由 Hilbert 基定理归纳得 k[x_1,...,x_n] Noether。", "如需几何结论，将任意生成集 S 替换为有限子集 {f_1,...,f_r} 且 V(S) = V(f_1,...,f_r)。"],
        scenarioChecks: { finiteDefiningEquations: ["任意 V(S) 都等于有限个方程的公共零点，保证代数集由有限方程定义。"], noetherianTopology: ["Noether 性给出 Zariski 拓扑的降链条件（A^n 是 Noetherian 空间），支撑不可约分解定理。"], coordinateRingNoetherian: ["坐标环 k[X] = k[x_1,...,x_n]/I(X) 作为 Noether 环的商仍 Noether，用于模有限性与维数理论。"] },
    },
    // 三次曲面上的 27 条直线：代数闭域上光滑三次曲面恰含 27 条直线（Cayley-Salmon）。
    "cubic-surface-27-lines": {
        definitions: ["27 条直线定理研究射影空间 P^3 中光滑三次曲面所含直线的枚举与组合结构，是古典枚举几何最著名的结果之一，与 P^2 在 6 个一般位置点处的爆破以及 E_6 根系密切相关。"],
        formulas: ["直线总数：代数闭域上光滑三次曲面 S ⊂ P^3 恰含 27 条直线。", "爆破模型下的 27 条 = 6 条例外曲线 E_i + 15 条过点对 p_i, p_j 直线的严格变换 F_{ij} + 6 条过 6 点中 5 点的二次曲线 G_i；6 + 15 + 6 = 27。", "组合关联：每条直线恰与其余 27 条中的 10 条相交；配置的对称群是 Weyl 群 W(E_6)，阶为 51840。"],
        theorems: ["Cayley-Salmon 定理：代数闭域上任意光滑三次曲面恰含 27 条直线。", "光滑三次曲面 S 同构于 P^2 在一般位置 6 点处的爆破（del Pezzo 曲面，次数 3），Picard 群 Pic(S) ≅ Z^7，27 条直线对应其中的 (-1)-曲线。", "27 条直线可组成 36 组「双六」(double-six) 配置；其对称群为 W(E_6)。"],
        generalRequirements: ["必须在代数闭域上并要求曲面光滑；奇异三次曲面直线数不同（可少于或等于 27，特殊情形出现无穷条或退化）。", "直线按射影几何计数，不计重数（光滑情形 27 条互异）。"],
        forbiddenErrors: ["【光滑性遗漏】对奇异三次曲面直接断言 27 条直线（奇异曲面直线数变化，如锥面含无穷条直线）。", "【非代数闭滥用】在 R 上声称恰有 27 条实直线（实光滑三次曲面实直线数为 3、7、15 或 27，依曲面而定）。", "【维数错置】把结论推广到 P^n 中一般三次超曲面而不核对为曲面（dim 2）情形。", "【(-1)-曲线混淆】把爆破例外曲线与一般直线的自交数搞混。"],
        parameterConstraints: { field: "底域代数闭；实/有理域上实直线数不同。", smoothness: "曲面必须光滑（非奇异）。", ambientAndDegree: "S ⊂ P^3 为三次（degree 3）曲面，dim S = 2。" },
        closureChecks: ["确认曲面光滑且底域代数闭。", "利用 del Pezzo 爆破模型或直接求解直线的 Fano 方案。", "核对直线总数为 27 及其相交组合（每条交 10 条）。"],
        scenarioChecks: { delPezzoModel: ["光滑三次曲面 = P^2 爆破 6 点，27 条直线 ↔ 27 条 (-1)-曲线，用 Pic(S) 中自交 -1、与 -K_S 相交 1 的类枚举。"], doubleSix: ["双六配置：两组各 6 条互不相交的直线，跨组相交模式给出 Schläfli 双六定理。"], realLinesCount: ["实三次曲面上实直线数只能是 3, 7, 15, 27，取决于曲面的实形。"] },
    },
    // 平面三次曲线的 9 个拐点：char ≠ 3 时光滑平面三次曲线恰有 9 个拐点，构成 Hesse 配置。
    "plane-cubic-nine-flexes": {
        definitions: ["9 个拐点定理研究光滑平面三次曲线（椭圆曲线）的拐点（inflection point / flex）枚举与组合结构，拐点是 Hessian 曲线与原曲线的交点，也正是取某拐点为原点时的 3-挠点。"],
        formulas: ["拐点总数：char k ≠ 3 的代数闭域上光滑平面三次曲线 C 恰有 9 个拐点。", "拐点 = C 与其 Hessian 曲线 H(C)（也是三次）的交，由 Bezout 定理得 3·3 = 9 个交点，光滑且 char ≠ 3 时全部互异。", "Hesse 配置 (9_4, 12_3)：9 个拐点与 12 条直线，每条直线过 3 个拐点、每个拐点在 4 条直线上；过任意两个拐点的直线必过第三个拐点。"],
        theorems: ["拐点定理：char ≠ 3 时光滑平面三次曲线恰有 9 个拐点。", "取一个拐点为原点，9 个拐点恰为椭圆曲线的 3-挠子群 E[3] ≅ (Z/3)^2（9 个元素）。", "9 个拐点构成 Hesse 配置：三点共线关系使它们组成 (Z/3)^2 上的仿射平面 AG(2,3) 结构，12 条线对应其中 12 条仿射直线。"],
        generalRequirements: ["必须要求底域代数闭且 char ≠ 3；char 3 时 Hessian 退化，拐点数减少（超奇异情形只有 1 个或 3 个）。", "曲线必须光滑（否则奇点吸收交点重数）。"],
        forbiddenErrors: ["【特征 3 滥用】在 char 3 上断言 9 个互异拐点（Hessian 退化，拐点数改变）。", "【奇异曲线误用】对节点/尖点三次曲线套用 9 拐点（奇异曲线拐点数不同）。", "【3-挠点对应遗漏原点选取】未固定拐点为原点就把拐点等同于 E[3]。", "【实拐点数误判】在 R 上声称 9 个实拐点（实光滑三次曲线只有 3 个实拐点）。"],
        parameterConstraints: { field: "代数闭且 char ≠ 3；实域上只有 3 个实拐点。", smoothness: "三次曲线光滑（椭圆曲线）。", ambientAndDegree: "C ⊂ P^2 为三次（degree 3）平面曲线。" },
        closureChecks: ["确认曲线光滑、底域代数闭且 char ≠ 3。", "计算 Hessian 曲线并用 Bezout 求 9 个交点。", "核对 Hesse 配置的三点共线关系或验证与 E[3] 的群同构。"],
        scenarioChecks: { threeTorsion: ["选一拐点为原点，9 个拐点 = E[3] ≅ (Z/3)^2，用于椭圆曲线挠点结构分析。"], hesseConfiguration: ["9 个拐点 + 12 条线组成 (9_4, 12_3) Hesse 配置，过两拐点的线必过第三拐点。"], hessianComputation: ["Hessian 行列式 det(∂²F/∂x_i∂x_j) 给出拐点方程，与 F 的公共零点即拐点。"] },
    },
    // 亏格-次数公式：光滑平面 d 次曲线几何亏格 g = (d-1)(d-2)/2，奇点按 δ 不变量修正。
    "genus-degree-formula": {
        definitions: ["亏格-次数公式研究平面射影曲线的几何亏格如何由其次数（以及奇点）决定，是把代数（次数、奇点）与拓扑/几何（亏格）联系起来的古典公式。"],
        formulas: ["光滑情形：代数闭域上光滑平面射影曲线 C ⊂ P^2（次数 d）的几何亏格 g = (d-1)(d-2)/2。", "奇点修正：一般（既约）平面曲线 g = (d-1)(d-2)/2 - Σ_p δ_p，δ_p 为点 p 处的 delta 不变量（节点 δ=1，普通尖点 δ=1）。", "低次示例：d=1,2 ⇒ g=0（直线、光滑二次曲线均有理）；d=3 ⇒ g=1（椭圆曲线）；d=4 ⇒ g=3。"],
        theorems: ["亏格-次数公式：光滑平面 d 次曲线几何亏格 g = (d-1)(d-2)/2。", "推论：光滑平面三次曲线亏格 1（椭圆曲线），四次曲线亏格 3（典范曲线）。", "推论（有理性）：g = 0 ⇔ 曲线可双有理参数化（有理曲线）；因此次数 ≥ 3 的光滑平面曲线非有理。"],
        generalRequirements: ["公式的无修正形式仅对光滑平面曲线成立；有奇点时须减去 Σ δ_p。", "亏格指几何亏格（正规化后的曲线亏格），与算术亏格在光滑时一致。"],
        forbiddenErrors: ["【奇点修正遗漏】对含节点/尖点的曲线直接用 (d-1)(d-2)/2 而不减 Σ δ_p。", "【几何/算术亏格混淆】奇异曲线上把算术亏格 p_a=(d-1)(d-2)/2 当作几何亏格。", "【非平面曲线滥用】对空间曲线或非平面模型直接套平面公式。", "【δ 不变量误算】把普通尖点 δ 值算错（普通尖点 δ=1 而非 2）。"],
        parameterConstraints: { planeCurve: "公式针对 P^2 中平面曲线；空间曲线需另用 Riemann-Roch/伴随公式。", smoothnessOrDelta: "光滑时无修正；奇异时减 Σ δ_p 得几何亏格。", geometricGenus: "g 指正规化后的几何亏格。" },
        closureChecks: ["确认曲线为平面曲线并读出次数 d。", "计算 (d-1)(d-2)/2。", "若有奇点，逐点计算 δ_p 并从算术亏格中减去得几何亏格。"],
        scenarioChecks: { ellipticCurve: ["d=3 光滑 ⇒ g=1，是椭圆曲线，配合 9 拐点与群结构。"], canonicalQuartic: ["d=4 光滑 ⇒ g=3，典范嵌入曲线。"], nodalRationalCurve: ["次数 d 的有理曲线（g=0）恰有 (d-1)(d-2)/2 个节点（若奇点均为节点），如三次节点曲线有 1 个节点。"] },
    },
    // 仿射坐标环：仿射簇 X 上的正则函数环 k[X] = k[x_1,...,x_n]/I(X)。
    "affine-coordinate-ring": {
        definitions: ["仿射代数几何中的坐标环研究仿射代数集 X ⊂ A^n 上正则函数（=多项式函数）的结构，通过 k[X] = k[x_1,...,x_n]/I(X) 把几何对象翻译为可用交换代数处理的对象。"],
        formulas: ["k[X] = k[x_1,...,x_n] / I(X)，其中 I(X) 是 X 的消零根理想；k 代数闭时 I(X) 根理想。", "点求值：p ∈ X 对应极大理想 m_p = { f ∈ k[X] : f(p) = 0 }；k[X]/m_p ≅ k。", "局部环：O_{X, p} = k[X]_{m_p}（在 m_p 处局部化）。"],
        theorems: ["范畴反变对应（k 代数闭）：仿射代数簇范畴 ↔ 有限型简约 k-代数范畴（k-代数同态方向反变）；X ↦ k[X] 与 R ↦ Spec R 互逆。", "仿射簇同构 ⇔ 坐标环 k-代数同构（k 代数闭）。", "X 不可约 ⇔ k[X] 是整环；X 光滑于 p ⇔ O_{X, p} 是正则局部环。"],
        generalRequirements: ["必须明确底域 k 是否代数闭；否则坐标环的极大理想不一定对应 k-有理点。", "对应关系是反变的（态射方向反转）。"],
        forbiddenErrors: ["【非根理想滥用】用非根理想定义坐标环而未标注是概形层次。", "【方向错用】把 X -> Y 与 k[X] -> k[Y] 视为同向。", "【非代数闭点误当极大理想】非代数闭域上把 k-有理点当作所有极大理想。", "【坐标环误定义】写成 k[x_1,...,x_n]/I(X) 时未取根，保留幂零。"],
        parameterConstraints: { field: "范畴反变对应最简形式要求 k 代数闭；否则采用 Spec 概形语言。", radicalIdeal: "仿射簇坐标环使用根理想；非根理想属仿射概形范畴。", finiteType: "对应到有限型简约 k-代数。" },
        closureChecks: ["写出 I(X) 并取根。", "构造 k[X] = k[x_1,...,x_n]/I(X)。", "利用坐标环研究点（极大理想）、局部性质（局部化）与态射（k-代数同态）。"],
        scenarioChecks: { pointsAsMaximalIdeals: ["k 代数闭时 X 的点 ↔ k[X] 的极大理想。"], localRingAtPoint: ["局部环 O_{X,p} = k[X]_{m_p} 用于研究点邻域几何。"], morphismByAlgebraHom: ["仿射态射 f: X -> Y ↔ k-代数同态 f^*: k[Y] -> k[X]。"] },
    },
    // Noether 正规化引理：有限型 k-代数是多项式环上的有限扩张。
    "noether-normalization-lemma": {
        definitions: ["Noether 正规化引理研究有限型 k-代数如何表示成多项式子环上的有限模——几何上给出仿射簇到仿射空间的有限满态射，是维数理论和 Nullstellensatz 的基础工具。"],
        formulas: ["设 A 为有限型 k-代数且 dim A = d，则存在代数无关元素 y_1, ..., y_d ∈ A 使 A 是 k[y_1, ..., y_d] 的有限模。", "几何：仿射簇 X ⊂ A^n（dim X = d）有有限满态射 π: X -> A^d。"],
        theorems: ["Noether 正规化引理：有限型 k-代数 A 存在代数无关元素 y_1, ..., y_d 使 A 有限于 k[y_1,...,y_d]；d = Krull dim A。", "推论（Zariski 引理，Nullstellensatz 之弱版）：有限型 k-代数为域 ⇒ 是 k 的有限扩张。", "几何推论：任意不可约仿射簇 X 存在有限满态射到 A^{dim X}；纤维维数为 0。"],
        generalRequirements: ["A 必须有限型于 k。", "存在的 y_i 一般通过基域上的线性变量替换构造；在无限域上直接线性替换即可。"],
        forbiddenErrors: ["【有限型遗漏】对非有限型 k-代数直接使用 Noether 正规化。", "【线性替换在小基域上滥用】有限域上的线性替换可能不足够，需选一般位置元素。", "【y_i 代数无关遗漏】选出的 y_i 未证明代数无关。", "【模有限与代数有限混淆】声称 A 是 k[y_1,...,y_d] 的代数扩张（一般更弱），未验证有限模条件。"],
        parameterConstraints: { finiteType: "A 必须有限型于 k。", dimension: "y_i 个数等于 Krull dim A。", finiteModule: "A 作为 k[y_1,...,y_d]-模有限生成。" },
        closureChecks: ["确认 A 有限型于 k。", "构造代数无关元素 y_1, ..., y_d（一般通过线性变量替换）。", "验证 A 是 k[y_1,...,y_d] 的有限模。"],
        scenarioChecks: { zariskiLemma: ["由 Noether 正规化推出 Zariski 引理：域的有限型 k-代数是 k 的有限扩张。"], integralityInDimensionTheory: ["证明 dim A = tr.deg_k K(A) 时通过 Noether 正规化建立整扩张。"], finiteSurjectiveMorphism: ["构造从 X 到 A^{dim X} 的有限满态射用于研究纤维和分岔。"] },
    },
    // Jacobian 光滑性判别法：完全交仿射簇的光滑点由 Jacobian 秩条件刻画。
    "jacobian-criterion-smoothness": {
        definitions: ["Jacobian 判别法研究仿射簇 X = V(f_1, ..., f_r) ⊂ A^n 在给定点 p 处的光滑/奇异性质，通过 Jacobian 矩阵秩与簇局部维数的比较判定。"],
        formulas: ["Jacobian 矩阵 J(p) = (∂f_i/∂x_j)|_p ∈ Mat_{r×n}(k)。", "光滑判据（完全交）：p 光滑于 X ⇔ rank J(p) = n - dim_p X。", "对超曲面 X = V(f)：p 光滑 ⇔ 至少存在一个 (∂f/∂x_j)|_p ≠ 0。"],
        theorems: ["Jacobian 判别法：设 X = V(f_1,...,f_r) ⊂ A^n 于代数闭域上，且 X 在 p 邻域是完全交（即 codim_p X = r），则 p 光滑 ⇔ rank J(p) = r = n - dim_p X。", "推论：若不假设完全交，一般仅有不等式 rank J(p) ≤ n - dim_p X，等号即光滑。", "推论：光滑点集是 X 的稠密开子集；奇异点集是低维闭子集。"],
        generalRequirements: ["必须使用局部维数 dim_p X 而非全局维数。", "代数闭底域；否则须区分几何光滑与 k-光滑。"],
        forbiddenErrors: ["【非完全交误用】对不满足 codim = r 的方程组直接套 rank J = r。", "【全局维数替代局部维数】用 dim X 替代 dim_p X 得到错误的阈值。", "【符号误算】漏项或用错偏导（如 char = p 时对 x^p 求导为 0）。", "【非代数闭滥用】R 上把 Jacobian 判据结果直接当几何光滑。"],
        parameterConstraints: { field: "代数闭底域；否则应明确工作在 k̄ 上。", completeIntersection: "标准判据要求 X 在 p 附近是完全交（codim = r）。", localDimension: "使用 dim_p X。" },
        closureChecks: ["计算 Jacobian 矩阵 J(p)。", "求 dim_p X（可通过 Krull 维数或纤维维数）。", "比较 rank J(p) 与 n - dim_p X。"],
        scenarioChecks: { hypersurfaceSmoothness: ["超曲面 V(f) 于 p 光滑 ⇔ 至少一个偏导 ∂f/∂x_j 不在 p 消失。"], nodeAndCusp: ["平面曲线 y^2 = x^3 (尖点) 与 y^2 = x^3 + x^2 (节点) 均在原点 rank J = 0 但 dim 为 1，故奇异；通过局部环进一步区分类型。"], singularLocusComputation: ["奇异点集 = V(f_1,...,f_r, minors_{r}(J))，可用 Gröbner 基计算。"] },
    },
    // 消元理想与投影闭包：投影像的 Zariski 闭包由消元理想的零点集刻画。
    "elimination-ideal-projection": {
        definitions: ["消元理想研究理想 I ⊂ k[x_1,...,x_n, y_1,...,y_m] 通过消去 x-变量得到 k[y_1,...,y_m] 中理想的过程；几何上对应仿射投影 π: A^{n+m} -> A^m 到 Y 空间的闭包。"],
        formulas: ["消元理想：I_x = I ∩ k[y_1,...,y_m]（消去 x 变量）。", "投影闭包：π(V(I))^{cl} = V(I_x)（Zariski 闭包）。", "算法：用消元序（如 lex 或 grevlex 消元序）计算 Gröbner 基 G，则 I_x = <G ∩ k[y_1,...,y_m]>。"],
        theorems: ["消元定理：设 I ⊂ k[x_1,...,x_n, y_1,...,y_m]，π: A^{n+m} -> A^m 为投影，则 V(I_x) ⊇ π(V(I))，且当 k 代数闭时 V(I_x) = π(V(I))^{cl}（Zariski 闭包）。", "推论：投影的像一般不闭；差集 V(I_x) \\ π(V(I)) 由「无穷分支消失」贡献。", "推论（Chevalley）：有限型态射的像是可构造集（有限个局部闭集的并）。"],
        generalRequirements: ["必须在代数闭底域使用「闭包 = V(I_x)」的严格等式。", "使用 Gröbner 基算法时须选消元序。"],
        forbiddenErrors: ["【像等于闭包滥用】声称 π(V(I)) = V(I_x)（一般只有闭包等号）。", "【单项式序错用】用非消元序计算消元理想。", "【非代数闭忽视】在 Q 上直接把消元理想的零点集当作投影像。", "【消元变量遗漏】只消去部分变量却声称已得到消元理想。"],
        parameterConstraints: { algebraicClosure: "闭包等号要求 k 代数闭。", monomialOrder: "使用消元序或字典序计算 Gröbner 基。", eliminationVariables: "明确消去哪些变量。" },
        closureChecks: ["选取消元序。", "计算 Gröbner 基 G。", "取 G ∩ k[y_1,...,y_m] 生成消元理想 I_x。", "分析 V(I_x) \\ π(V(I)) 中的「消失分支」。"],
        scenarioChecks: { implicitization: ["从参数方程 (t, f_1(t),...,f_n(t)) 消去 t 得到隐式方程；投影像可能包含额外分支。"], resultantForTwoVariables: ["两多项式的结式 Res(f, g; x) 恰是消元理想 <f, g> ∩ k[y] 的生成元（针对二变量情形）。"], missingPoints: ["经典反例：xy = 1 投影到 y 轴的像为 y ≠ 0，但消元理想为 (0)，闭包 = 整条 y 轴，缺失点 y = 0。"] },
    },
    // Gröbner 基与 Buchberger 算法：通过 S-多项式化归得到理想的标准生成集。
    "buchberger-groebner-basis": {
        definitions: ["Gröbner 基是理想 I ⊂ k[x_1,...,x_n] 相对于给定单项式序的一族生成元，其首项集合能生成 in(I)；Buchberger 算法通过 S-多项式的化归系统性地构造 Gröbner 基。"],
        formulas: ["初始理想 in(I) = <in(f) : f ∈ I>；G ⊂ I 是 Gröbner 基 ⇔ <in(G)> = in(I)。", "S-多项式：S(f, g) = (lcm(in f, in g) / in f) f - (lcm(in f, in g) / in g) g。", "Buchberger 判据：G 是 I 的 Gröbner 基 ⇔ 对每对 f, g ∈ G，S(f, g) 关于 G 的余式为 0。"],
        theorems: ["Gröbner 基存在性：对任意单项式序与理想 I，Gröbner 基存在（可通过 Buchberger 算法有限步构造，若基域可计算）。", "Buchberger 算法：反复计算 S-多项式并归约到不可再约后加入基，直到所有 S-多项式归约为 0。", "推论：Gröbner 基可用于成员判定 f ∈ I（唯一余式），消元（用消元序），Hilbert 函数计算等。"],
        generalRequirements: ["必须选定单项式序（lex、grlex、grevlex 等）；不同序得到不同 Gröbner 基与不同计算复杂度。", "计算需在可计算域上（Q、Q(t)、有限域等）。"],
        forbiddenErrors: ["【单项式序未指定】声称求出 Gröbner 基却不明确单项式序。", "【S-多项式遗漏】只在部分 pair 上验证 S 归约为 0。", "【归约不唯一化】未选定 Gröbner 基情形下的余式不唯一。", "【消元误用】用非消元序求消元理想。"],
        parameterConstraints: { monomialOrder: "必须选定一个整体单项式序。", computableField: "计算需在可精确算术的域上。", termination: "Buchberger 算法在 Noetherian 环上有限步终止。" },
        closureChecks: ["选择单项式序。", "运行 Buchberger 算法直到所有 S-多项式归约为 0。", "如需极小或简化 Gröbner 基，移除冗余元素并归约首项系数。"],
        scenarioChecks: { idealMembership: ["f ∈ I ⇔ f 关于 Gröbner 基 G 的余式为 0。"], eliminationTheoryUse: ["用 lex 或消元序 Gröbner 基读出消元理想 I ∩ k[y_1,...,y_m]。"], polynomialSystemSolving: ["零维理想的 Gröbner 基可用于枚举有限解或降到单变量方程。"] },
    },
    // 有限态射与整扩张：几何上闭且纤维有限的态射对应坐标环的整扩张。
    "finite-morphism-integral-extension": {
        definitions: ["仿射代数几何中的有限态射研究这样的仿射簇态射 f: X -> Y：其坐标环拉回 f^*: k[Y] -> k[X] 使 k[X] 成为 k[Y] 的有限模；等价于整扩张与「几乎处处纤维有限 + 闭」。"],
        formulas: ["f 是有限态射 ⇔ f^*: k[Y] -> k[X] 使 k[X] 是 k[Y] 的有限模。", "整扩张：a ∈ k[X] 满足 a^n + b_{n-1} a^{n-1} + ... + b_0 = 0，b_i ∈ k[Y]。"],
        theorems: ["有限态射的几何特征：f 有限 ⇔ f 是闭态射且每个纤维 f^{-1}(y) 是有限集合。", "有限态射保持维数：f: X -> Y 有限满射 ⇒ dim X = dim Y。", "推论：Noether 正规化引理给出的 π: X -> A^d 是有限满射。", "推论：有限态射满足 going-up 与 going-down（后者需附加正规性条件）。"],
        generalRequirements: ["必须区分「有限态射」（模有限）与「有限型」（代数有限生成）——两者不等价。", "整扩张与有限模等价（在交换代数条件下），几何上体现为闭 + 有限纤维。"],
        forbiddenErrors: ["【有限型与有限混用】声称 A^1 -> A^1，x ↦ x^2 与 A^2 -> A^1，(x,y) ↦ x 都是有限（后者非有限，纤维不有限）。", "【维数保持颠倒】声称有限满态射降维。", "【非满射滥用等式】只对满有限态射才有维数相等，一般只有 dim X ≤ dim Y 或反之视语境。", "【闭映射遗漏】只说纤维有限就断言有限（还需闭性）。"],
        parameterConstraints: { finiteModule: "k[X] 是 k[Y] 的有限模。", closedMap: "f 是拓扑闭映射。", finiteFibers: "每个纤维是有限集合。" },
        closureChecks: ["验证 k[X] 作为 k[Y]-模有限生成。", "或通过整扩张判据核对。", "如需几何刻画，验证 f 闭 + 有限纤维。"],
        scenarioChecks: { noetherNormalization: ["Noether 正规化给出的到 A^d 的映射是有限满射。"], integralClosureNormalization: ["计算 X 的正规化 X̃ -> X 是有限满态射，用于消解奇异。"], nonFiniteExample: ["投影 (x, y) ↦ x 从 A^2 到 A^1 非有限：纤维为 A^1，无限。"] },
    },
    // 纤维维数定理：满态射一般纤维维数 = 定义域 − 目标维数，边界处纤维可能升维。
    "fiber-dimension-theorem": {
        definitions: ["纤维维数定理研究代数簇之间的态射 f: X -> Y 各点纤维 f^{-1}(y) 的维数如何依赖于 y ∈ Y，用以在几何族中控制退化情形。"],
        formulas: ["设 f: X -> Y 为不可约簇间的满态射，dim X = m, dim Y = n（m ≥ n）。则每个 y ∈ Y 的纤维 f^{-1}(y) 各不可约分量维数 ≥ m - n；且在 Y 的稠密开集上等号成立。", "上半连续性：函数 y ↦ dim f^{-1}(y) 关于 Zariski 拓扑上半连续（跳跃只朝上）。"],
        theorems: ["纤维维数定理（Chevalley）：不可约簇之间的满态射 f: X -> Y 满足：(a) 每个纤维不可约分量维数 ≥ dim X - dim Y；(b) 存在 Y 的稠密开集 U 使 y ∈ U 时纤维维数恰为 dim X - dim Y。", "上半连续性：y ↦ dim f^{-1}(y) 上半连续；跳跃集是 Y 的低维闭子集。", "推论（一般纤维定理）：一般纤维维数一致，只有低维闭子集上出现「胖化」纤维。"],
        generalRequirements: ["必须假设 f 满射且 X, Y 不可约（否则须分别处理分支）。", "结论涉及一般纤维与特殊纤维的区分。"],
        forbiddenErrors: ["【纤维维数等式误设】声称所有纤维维数都恰为 dim X - dim Y。", "【非满态射滥用】对非满态射直接使用；应先取 f 的像的闭包再考虑限制态射。", "【方向混用】把 dim X - dim Y 视为「纤维 ≤ 该值」，实际是「纤维 ≥ 该值」。", "【上半连续与下半连续搞反】声称跳跃朝下。"],
        parameterConstraints: { irreducibility: "X, Y 不可约；否则须限制到分支。", surjectivity: "f 满射；一般态射需先取像的闭包。", finiteType: "态射有限型。" },
        closureChecks: ["确认 f 满且 X, Y 不可约。", "计算 dim X 与 dim Y。", "分析一般纤维与特殊纤维的维数跳跃。"],
        scenarioChecks: { projectionFromAffine: ["投影 A^2 -> A^1 一般纤维为 A^1（维数 1 = 2 - 1）；无特殊纤维跳跃。"], blowUpFiber: ["Blow-up π: X̃ -> X 对基点 p 的纤维 π^{-1}(p) 是 P^{n-1}（维数上升）；其他点纤维为一点。"], flatFamily: ["平坦族的纤维维数恒定；一般代数族只在稠密开集上纤维维数常量。"] },
    },
    // 仿射簇之间的态射：几何态射与 k-代数同态的反变对应。
    "affine-variety-morphism": {
        definitions: ["仿射簇之间的态射研究由多项式给出的映射 f: X -> Y ⊂ A^m（每个分量是 k[X] 中的元素），并通过 k-代数同态与坐标环建立完整反变对应。"],
        formulas: ["态射 f: X -> Y 由 m 元多项式 (f_1, ..., f_m) 定义，f_i ∈ k[X]，且对任意 g ∈ I(Y) 有 g(f_1, ..., f_m) = 0。", "拉回：f^*: k[Y] -> k[X]，f^*(g) = g ∘ f。", "范畴反变等价：仿射簇 X ↦ k[X]，态射 f: X -> Y ↦ f^*: k[Y] -> k[X]。"],
        theorems: ["范畴反变对应：k 代数闭时，仿射代数簇范畴反变等价于有限型简约 k-代数范畴。", "态射唯一由 f^*: k[Y] -> k[X] 决定；反之每个 k-代数同态给出唯一态射（应用于坐标）。", "推论：仿射簇同构 ⇔ 坐标环 k-代数同构；同构的完全「代数化」。"],
        generalRequirements: ["必须验证多项式分量满足 Y 的定义方程。", "态射与 k-代数同态方向反变。"],
        forbiddenErrors: ["【方向错用】把 f: X -> Y 与 k[X] -> k[Y] 视为同向。", "【值域检验遗漏】未验证 (f_1, ..., f_m) 落在 Y 上（即 g(f_1,...,f_m)=0 对 g ∈ I(Y) 成立）。", "【范畴等价条件遗漏】非代数闭或非简约情形直接套用反变等价。", "【正则性混淆】把有理映射（稠密开集）当作态射（处处定义）。"],
        parameterConstraints: { field: "反变范畴等价简形式要求 k 代数闭。", polynomialMap: "态射由 f_i ∈ k[X] 分量给出。", targetInclusion: "分量必须满足 Y 的定义方程。" },
        closureChecks: ["写出多项式分量并验证 f(X) ⊂ Y。", "构造 f^*: k[Y] -> k[X] 并核对同态性。", "利用坐标环同态判断同构或分析像与纤维。"],
        scenarioChecks: { closedEmbedding: ["闭嵌入 X ↪ Y 对应满 k-代数同态 k[Y] -> k[X]（商）。"], openImmersion: ["主开集包含 D(f) ↪ X 对应局部化 k[X] -> k[X]_f。"], productOfVarieties: ["仿射簇积 X × Y 对应 k-代数张量积 k[X] ⊗_k k[Y]。"] },
    },
    // 射影 Nullstellensatz：齐次根理想 ↔ 射影代数集，除去 irrelevant 理想。
    "projective-nullstellensatz-homogeneous": {
        definitions: ["射影 Nullstellensatz 研究射影空间 P^n 上齐次多项式理想与射影代数集之间的对应，需要额外排除 irrelevant 理想 m_0 = (x_0, ..., x_n)。"],
        formulas: ["V_+(J) = { [x] ∈ P^n : f(x) = 0 for all homogeneous f ∈ J }；I_+(X) = 齐次多项式集使 X 上恒零。", "强形式（k 代数闭）：对齐次理想 J，I_+(V_+(J)) = √J，若 √J ≠ m_0 = (x_0, ..., x_n)；否则 V_+(J) = ∅。", "弱形式：V_+(J) = ∅ ⇔ √J ⊇ m_0（irrelevant 理想 m_0 生成或包含）。"],
        theorems: ["射影 Nullstellensatz：k 代数闭时齐次根理想（除 irrelevant m_0 外）↔ 非空射影代数集是反变一一对应。", "irrelevant 理想 m_0 = (x_0, ..., x_n) 定义空的射影代数集；非零常数理想也定义空集。", "射影极大理想（除 m_0 外）↔ P^n 中的点。"],
        generalRequirements: ["必须使用齐次理想；非齐次生成元不定义射影代数集。", "必须排除 irrelevant 理想 m_0。"],
        forbiddenErrors: ["【非齐次滥用】把非齐次多项式作为射影方程使用。", "【irrelevant 理想遗漏】用 m_0 定义非空射影集。", "【非代数闭滥用】在 R 或 Q 上直接使用强形式。", "【射影极大理想误对应】把 m_0 也视为对应点的极大理想。"],
        parameterConstraints: { algebraicClosure: "强形式对应需要 k 代数闭。", homogeneousIdeal: "工作对象是齐次理想。", irrelevantIdeal: "irrelevant 理想 m_0 = (x_0, ..., x_n) 从对应中排除。" },
        closureChecks: ["验证理想齐次。", "取 √J 并检查是否等于 m_0。", "利用 V_+ 与 I_+ 建立射影代数集与齐次根理想对应。"],
        scenarioChecks: { projSchemeExtension: ["Proj R 构造把齐次坐标环推广到射影概形，允许非根、非简约结构。"], homogeneousDimension: ["射影不可约簇维数 = Krull(齐次坐标环) - 1。"], hypersurfaceDefinition: ["超曲面 V_+(F) ⊂ P^n 由齐次多项式 F 定义；deg F 是超曲面的射影次数。"] },
    },
    // Hilbert 函数与 Hilbert 多项式：分次坐标环的分次分量维数序列的多项式性质。
    "hilbert-polynomial-function": {
        definitions: ["射影代数几何中的 Hilbert 函数与 Hilbert 多项式研究射影簇 X ⊂ P^n 的齐次坐标环 S(X) 的分次结构，用以读出维数与次数不变量。"],
        formulas: ["Hilbert 函数：h_X(d) = dim_k S(X)_d，S(X)_d 为齐次坐标环第 d 分次分量。", "Hilbert 多项式：存在多项式 P_X(t) 使 h_X(d) = P_X(d) 对足够大的 d 成立；P_X(t) 首项为 (deg X / (dim X)!) t^{dim X}。", "算术亏格：p_a(X) = (-1)^{dim X} (P_X(0) - 1)。"],
        theorems: ["Hilbert 定理：对每个射影簇 X ⊂ P^n，存在唯一多项式 P_X(t) 满足 h_X(d) = P_X(d) 对 d >> 0；deg P_X = dim X。", "首项系数：P_X(t) 的首项 = deg(X) / (dim X)! · t^{dim X}，其中 deg(X) 是 X 在 P^n 中的次数。", "对超曲面 X = V_+(F) ⊂ P^n（deg F = e）：P_X(t) = C(t+n, n) - C(t+n-e, n)。"],
        generalRequirements: ["必须区分 Hilbert 函数（对所有 d 定义）与 Hilbert 多项式（仅对 d >> 0 匹配）。", "维数与次数信息由多项式最高次项读出。"],
        forbiddenErrors: ["【函数与多项式混淆】声称 h_X(d) = P_X(d) 对所有 d 成立（一般只在 d >> 0）。", "【首项系数遗漏 dim X!】写作 P_X 首项为 deg X · t^{dim X}，缺 (dim X)! 分母。", "【次数与维数混用】用 deg P_X 直接当作 deg X。", "【坐标环与齐次坐标环混淆】使用普通坐标环而非齐次坐标环计算。"],
        parameterConstraints: { gradedCoordinateRing: "使用齐次坐标环 S(X) = k[x_0,...,x_n]/I(X)。", degreeGeneratedByOne: "标准嵌入下齐次坐标由 1 次元素生成。", stabilizationRange: "多项式匹配从某个 d_0 起成立（regularity）。" },
        closureChecks: ["计算齐次坐标环 S(X) 并逐次分次求 dim_k S(X)_d。", "拟合多项式 P_X(t) 使 h_X(d) = P_X(d) 对 d >> 0。", "读出 dim X 与 deg X。"],
        scenarioChecks: { projectiveCurveGenus: ["光滑射影曲线 X ⊂ P^n 的几何亏格 g = 算术亏格 p_a(X)（光滑时二者相等）。"], veroneseImage: ["Veronese 嵌入 v_d(P^n) 的 Hilbert 多项式给出 v_d(P^n) 的次数 d^n。"], completeIntersectionFormula: ["完全交 X = V_+(F_1,...,F_r) 的 Hilbert 多项式由 Koszul 复形显式计算，deg X = ∏ deg F_i。"] },
    },
    // Veronese 嵌入：把 P^n 通过 d 次单项式嵌入到 P^{C(n+d,d)-1}。
    "veronese-embedding": {
        definitions: ["射影代数几何中的 Veronese 嵌入研究 P^n 通过所有 d 次单项式送到高维射影空间的嵌入方式，把 d 次超曲面几何化为超平面截面。"],
        formulas: ["v_d: P^n -> P^{N}，N = C(n+d, d) - 1，[x_0 : ... : x_n] ↦ [所有 d 次单项式 x_0^{a_0} ... x_n^{a_n}]（|a| = d）。", "特例：v_2: P^1 -> P^2, [x:y] ↦ [x^2 : xy : y^2]（射影二次曲线 image = 圆锥）；v_3: P^1 -> P^3 twisted cubic。"],
        theorems: ["Veronese 嵌入 v_d: P^n -> P^N（N = C(n+d, d) - 1）是闭嵌入，其像 v_d(P^n) 是射影簇。", "在 v_d(P^n) 中截得的超平面对应 P^n 中的 d 次超曲面；因此 v_d 把 O_{P^n}(d) 拉回 O_{P^N}(1)。", "推论：Segre-Veronese 嵌入是 Serre 曲面丛 O(d) 的射影积构造，用于生成极丰线丛。"],
        generalRequirements: ["必须给出维数公式 N = C(n+d, d) - 1。", "嵌入分量按字典序（或标准序）列出所有 d 次单项式。"],
        forbiddenErrors: ["【维数公式错算】把 N 写成 (n+d)^d 或类似错误组合。", "【分量丢失】只写主对角单项式而遗漏混合项。", "【线丛拉回方向反用】声称 v_d^* O(1) = O(1/d) 之类错误。", "【非闭嵌入误设】把 v_d 视为仅局部嵌入。"],
        parameterConstraints: { degree: "d ≥ 1；d = 1 时 v_1 = id。", ambientDimension: "目标空间 P^N，N = C(n+d, d) - 1。", monomials: "分量由所有 d 次单项式给出。" },
        closureChecks: ["写出所有 d 次单项式作为 v_d 的分量。", "验证 v_d 是良定义（非零点）与单射。", "分析 v_d(P^n) 的射影方程（Veronese 簇由二次关系定义）。"],
        scenarioChecks: { conicAsVeronese: ["v_2: P^1 -> P^2 的像为非退化圆锥曲线；圆锥曲线的有理参数化。"], twistedCubic: ["v_3: P^1 -> P^3 的像为扭立方曲线，是最简单的非平面射影曲线例子。"], veryAmpleLineBundle: ["证明 O(d) (d ≥ 1) 在 P^n 上极丰：通过 Veronese 嵌入实现。"] },
    },
    // Segre 嵌入：把 P^m × P^n 嵌入到 P^{(m+1)(n+1)-1}。
    "segre-embedding": {
        definitions: ["Segre 嵌入研究射影空间的乘积 P^m × P^n 如何嵌入到单一射影空间中，把双分次几何转化为通常射影几何。"],
        formulas: ["σ_{m,n}: P^m × P^n -> P^{(m+1)(n+1)-1}，([x_0:...:x_m], [y_0:...:y_n]) ↦ [x_i y_j : 0 ≤ i ≤ m, 0 ≤ j ≤ n]。", "特例：σ_{1,1}: P^1 × P^1 -> P^3，像是二次曲面 {ZW = XY}（射影二次曲面 = P^1 × P^1）。"],
        theorems: ["Segre 嵌入 σ_{m,n}: P^m × P^n -> P^{(m+1)(n+1)-1} 是闭嵌入，其像 Σ_{m,n} 为射影簇。", "像 Σ_{m,n} 由所有 2×2 子式 x_i y_j - x_k y_l （对应矩阵 M_{ij} = x_i y_j 的秩 1 条件）定义。", "σ_{m,n}^* O_{P^N}(1) = O_{P^m}(1) ⊠ O_{P^n}(1) （外张量积）。"],
        generalRequirements: ["必须使用双分次坐标；不同因子的坐标不能混淆。", "目标空间维数 (m+1)(n+1) - 1 由乘积维数决定。"],
        forbiddenErrors: ["【目标维数错算】写作 m + n + 1 或 (m + n + 1)^2 等错误组合。", "【秩 1 条件遗漏】未指出 Σ_{m,n} 由 2×2 子式（秩 1 矩阵）刻画。", "【乘积作为直和滥用】把 P^m × P^n 与 P^{m+n} 混用。", "【双分次记号丢失】未标注 O(1, 1) 与 O(1) 的外张量结构。"],
        parameterConstraints: { productDimensions: "维数为 m 与 n；目标 (m+1)(n+1) - 1。", coordinates: "分量为 x_i y_j。", rankOneImage: "像由秩 1 矩阵条件定义。" },
        closureChecks: ["写出 σ_{m,n} 的分量 x_i y_j。", "验证是闭嵌入并给出 Σ_{m,n} 的射影方程（秩 1 子式）。", "分析线丛拉回 σ^* O(1) = O(1, 1)。"],
        scenarioChecks: { quadricSurface: ["P^1 × P^1 的 Segre 像是 P^3 中非退化二次曲面，两族直纹族由两个 P^1 因子给出。"], multilinearForms: ["Segre 嵌入实现 P(V) × P(W) ↪ P(V ⊗ W)，与秩 1 张量对应。"], productMorphism: ["证明射影积仍是射影簇（不是仿射簇的积）。"] },
    },
    // 射影对偶原理：射影平面中点-直线对偶命题成立性一致。
    "duality-projective-plane": {
        definitions: ["射影对偶原理研究射影平面（乃至射影空间）中「点」和「超平面」互换后命题的成立情况，把「过点的直线族」与「直线上的点集」视为对偶结构。"],
        formulas: ["P^n 与其对偶 (P^n)^* 通过 [a_0 : ... : a_n] ↔ 超平面 ∑ a_i x_i = 0 建立双射。", "点在直线上 ⇔ 直线过点：满足对偶原理的最基本关联。", "P^2 中：命题「三点共线」对偶到「三线共点」；「四点决定圆锥」对偶到「四线决定圆锥」。"],
        theorems: ["射影对偶原理：射影几何中的命题若成立，其对偶命题（把「点」、「过」、「共线」分别换成「超平面」、「含」、「共点」）也成立。", "推论：Desargues 定理与其对偶命题都是射影不变命题；Pappus 定理自对偶。", "在 P^n 中，超平面族参数化仍是 P^n，因此对偶空间也是 P^n。"],
        generalRequirements: ["必须严格区分「点」与「超平面」的对偶关系。", "对偶命题需在射影范畴（保持射影关系）内表述，欧氏/仿射概念（如距离、平行）无对偶。"],
        forbiddenErrors: ["【非射影概念对偶】声称「平行线」与「两点间距离」有对偶命题。", "【维数对偶错误】声称 P^n 的对偶是 P^{n-1}。", "【对偶方向乱换】随意交换「点」与「线」而未同步反转「过」为「含」。", "【自对偶命题误判】声称所有射影命题都自对偶。"],
        parameterConstraints: { projectiveSetting: "命题必须在射影几何范畴内。", incidenceRelation: "对偶前后使用相同的关联关系（点 ∈ 超平面）。", dualSpaceDimension: "P^n 的对偶空间为 P^n（超平面参数化同维数）。" },
        closureChecks: ["写出原命题涉及的点-超平面关联关系。", "把每个「点」↔「超平面」、「过」↔「含」进行对偶。", "验证对偶命题是否与已知定理对应。"],
        scenarioChecks: { desarguesDual: ["Desargues 定理：两三角形透视⇔透视轴共线；对偶命题：两三角形透视⇔透视点共点。"], pappusSelfDual: ["Pappus 定理是自对偶命题：三条对角线共点等价于对偶命题自身。"], polePolarInConic: ["圆锥曲线的极点极线关系提供另一种对偶实现，联系点与线的具体几何。"] },
    },
    // 交比不变性：射影变换保持四点交比。
    "cross-ratio-invariance": {
        definitions: ["交比研究射影直线（或射影空间中同一直线上）四个不同点的一种射影不变量；交比是射影几何最基础的数值不变量。"],
        formulas: ["直线上四点 P_1, P_2, P_3, P_4 的交比：(P_1, P_2; P_3, P_4) = ((x_3 - x_1)(x_4 - x_2)) / ((x_3 - x_2)(x_4 - x_1))，x_i 为仿射坐标。", "在齐次坐标下：若 P_i = [a_i : b_i]，交比 = (det[P_1, P_3] · det[P_2, P_4]) / (det[P_2, P_3] · det[P_1, P_4])。", "对偶：直线束中四条直线的交比与在任意一条 transversal 上截得四点的交比相等。"],
        theorems: ["交比不变性：射影变换 f ∈ PGL_2 保持任意四点的交比：(f(P_1), f(P_2); f(P_3), f(P_4)) = (P_1, P_2; P_3, P_4)。", "推论：射影几何的唯一数值不变量（在直线上）就是交比；四点的射影分类由交比 λ ∈ k \\ {0, 1} 完全刻画。", "推论（对偶版）：四条共点直线的交比等于它们与任一横截线的四交点交比。"],
        generalRequirements: ["四点必须共线且两两不同（否则交比退化）。", "交比值随点的排列改变得到六个相关值 {λ, 1-λ, 1/λ, 1/(1-λ), λ/(λ-1), (λ-1)/λ}。"],
        forbiddenErrors: ["【排列忽视】声称交比与点的排列无关。", "【非射影变换误设】声称仿射变换或欧氏变换也是交比不变的（实际上射影变换的严格子集）。", "【退化误算】用退化四点（有重复）计算交比。", "【方向反用】把定义中的顺序系数搞乱导致取到六值之一而非目标值。"],
        parameterConstraints: { distinctPoints: "四点两两不同。", collinearity: "四点位于同一直线上（或推广为共线束的四条直线）。", projectiveTransformation: "不变性针对射影变换 PGL 群。" },
        closureChecks: ["写出四点的仿射或齐次坐标。", "按选定次序代入交比公式。", "如需处理射影变换，验证 PGL 元素作用下交比不变。"],
        scenarioChecks: { harmonicConjugate: ["交比 = -1 时四点组成调和点列；这是射影几何最重要的特殊配置之一。"], moebiusTransformation: ["复射影线 P^1(C) 上的 Möbius 变换保持交比。"], projectiveClassificationOfFourPoints: ["四点的射影分类由交比 λ ∈ k \\ {0, 1} 决定，六个相关值对应排列 S_4/V_4 ≅ S_3。"] },
    },
    // 射影 Bezout 定理（高维完全交形式）：n 条超曲面在 P^n 中相交为有限点集时，总交重数为次数乘积。
    "bezout-theorem-projective": {
        definitions: ["射影 Bezout 定理研究 P^n 中 n 个超曲面（次数 d_1, ..., d_n）相交为有限点集时的总交点数（按重数），是平面 Bezout 定理的高维推广。"],
        formulas: ["设 F_1, ..., F_n 为 P^n 中齐次多项式（次数 d_1, ..., d_n），若 V_+(F_1, ..., F_n) 为有限集，则 ∑_{p} m_p(F_1, ..., F_n) = ∏_{i=1}^n d_i。", "局部交重数 m_p(F_1, ..., F_n) = dim_k O_{P^n, p} / (F_1, ..., F_n)。"],
        theorems: ["射影 Bezout 定理：代数闭域上 P^n 中 n 条超曲面的完全交（有限点数时）按局部交重数计总数为 ∏ d_i。", "推广：Chow 环中 [V_+(F)] · [V_+(G)] = deg F · deg G · [直线] 的乘法规则，是交理论的基础。", "推论：P^n 中一般（generic）n 条超曲面 F_i 的交点数恰为 ∏ d_i（一般位置光滑相交）。"],
        generalRequirements: ["必须在代数闭域上；否则可能有复交点消失。", "必须使用射影闭包并按局部交重数计数。", "F_1, ..., F_n 必须给出完全交（有限点集）。"],
        forbiddenErrors: ["【完全交前提遗漏】超曲面公共零点集有正维分支时直接套 Bezout。", "【仿射交点数替代】只在仿射空间数交点，忽略无穷远点贡献。", "【非代数闭滥用】R 或 Q 上直接用总数为 ∏ d_i。", "【重数忽略】只数几何相异交点。"],
        parameterConstraints: { field: "代数闭底域。", completeIntersection: "V_+(F_1, ..., F_n) 有限（完全交）。", ambientDimension: "工作空间 P^n，超曲面数 = n。", multiplicity: "交点按局部交重数计数。" },
        closureChecks: ["验证 F_1, ..., F_n 定义有限交。", "取射影闭包并列出所有交点。", "计算局部交重数并求和核对 ∏ d_i。"],
        scenarioChecks: { threeQuadricsInP3: ["P^3 中三条二次曲面（一般位置）相交为 2^3 = 8 点（按重数）。"], hyperplaneSection: ["P^n 中 (n-1) 条一般超平面截 d 次曲线得 d 点（按重数）。"], excessIntersection: ["超曲面族的完全交出现正维分支时，需用 excess intersection 公式（Fulton）处理。"] },
    },
    // Grassmann 簇与 Plücker 嵌入：k-维子空间参数化及其射影嵌入。
    "grassmannian-plucker-embedding": {
        definitions: ["射影代数几何中的 Grassmann 簇 Gr(k, n) 参数化 n 维向量空间的所有 k-维子空间，是 P^{n-1} 的推广（Gr(1, n) = P^{n-1}）；Plücker 嵌入把 Gr(k, n) 嵌入到射影空间。"],
        formulas: ["Plücker 嵌入：p_{k,n}: Gr(k, n) -> P^{C(n,k) - 1}，一个 k 维子空间 W = span(v_1, ..., v_k) 送到 [v_1 ∧ ... ∧ v_k] ∈ P(∧^k V)。", "Plücker 坐标：k×n 矩阵 M（行为 v_i 坐标）的所有 k×k 子式 p_{i_1 ... i_k}(M)，1 ≤ i_1 < ... < i_k ≤ n。", "Plücker 关系：Grassmann 簇由 Plücker 坐标间的二次 Plücker 关系（Grassmann-Plücker 关系）定义。"],
        theorems: ["Plücker 嵌入定理：Gr(k, n) 通过 Plücker 坐标闭嵌入到 P^{C(n,k) - 1}；像 Gr(k, n) 是射影簇，由 Plücker 二次关系 ∑_{s=0}^{k} (-1)^s p_{i_1,...,i_{k-1},j_s} p_{j_0,...,ĵ_s,...,j_k} = 0 定义。", "Gr(k, n) 是光滑不可约射影簇，dim Gr(k, n) = k(n-k)。", "特例：Gr(1, n) = P^{n-1}；Gr(2, 4) ⊂ P^5 是由单个 Plücker 关系 p_{12} p_{34} - p_{13} p_{24} + p_{14} p_{23} = 0 定义的 4 维光滑二次超曲面。"],
        generalRequirements: ["必须使用外积或子式定义 Plücker 坐标；不能用普通矩阵项。", "Plücker 坐标随基变换只差非零标量因子，故落在射影空间中。"],
        forbiddenErrors: ["【维数公式错算】把 dim Gr(k, n) 写成 kn 或 n-k 等错误组合。", "【Plücker 关系遗漏】仅用坐标嵌入而未验证二次关系。", "【基相关性忽略】不同基下 Plücker 坐标视为不同点。", "【Grassmann 簇误为仿射】声称 Gr(k, n) 是仿射簇。"],
        parameterConstraints: { subspaceDimension: "1 ≤ k ≤ n - 1；k = 0 或 n 退化为一点。", ambientDimension: "目标 P^{C(n,k) - 1}。", pluckerRelations: "像 Gr(k, n) 由二次 Plücker 关系定义。" },
        closureChecks: ["写出 W = span(v_1,...,v_k) 并组成 k×n 矩阵。", "计算所有 k×k 子式作为 Plücker 坐标。", "验证 Plücker 关系并确认落在 Gr(k, n) 上。"],
        scenarioChecks: { linesInP3: ["Gr(2, 4) 参数化 P^3 中的直线族；由 Klein 二次超曲面 p_{12} p_{34} - p_{13} p_{24} + p_{14} p_{23} = 0 刻画。"], schubertCells: ["Grassmann 簇通过 Schubert cells 分层：Gr(k, n) = ⊔_λ Σ_λ，λ 为长度 k 的整数分拆嵌入 (n-k)^k 矩形；Schubert 演算给出交点数。"], flagVariety: ["旗簇 Fl(V) 通过 Grassmann 簇积嵌入，其 Plücker 型嵌入用于研究群 GL_n 的表示。"] },
    },
};
