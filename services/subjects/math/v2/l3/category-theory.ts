import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数-范畴论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const CATEGORY_THEORY_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Yoneda 引理与 Yoneda 嵌入把对象完全嵌入到 Hom 函子中。
    "yoneda-lemma": {
        id: "yoneda-lemma", l2Key: "category-theory", name: "Yoneda 引理", kind: "lemma",
        aliases: ["Yoneda引理", "Yoneda lemma", "米田引理", "Yoneda嵌入", "Yoneda embedding"],
    },
    // 伴随函子的 Hom 同构给出左伴随/右伴随的核心刻画。
    "adjoint-functor-hom-iso": {
        id: "adjoint-functor-hom-iso", l2Key: "category-theory", name: "伴随函子的 Hom 同构", kind: "theorem",
        aliases: ["伴随函子", "adjoint functor", "adjunction", "伴随", "Hom伴随同构", "adjoint hom isomorphism"],
    },
    // 极限与余极限由锥/余锥上的泛性质定义，并具有唯一性。
    "limit-colimit-universal-property": {
        id: "limit-colimit-universal-property", l2Key: "category-theory", name: "极限与余极限的泛性质", kind: "theorem",
        aliases: ["极限泛性质", "余极限泛性质", "limit universal property", "colimit universal property", "limits and colimits"],
    },
    // 自然变换是函子之间的态射，必须验证交换性方阵。
    "natural-transformation": {
        id: "natural-transformation", l2Key: "category-theory", name: "自然变换", kind: "object",
        aliases: ["自然变换", "natural transformation", "自然同构", "natural isomorphism", "函子间态射"],
    },
    // Abel 范畴给出核/余核/像/余像的四位一体结构，是同调代数的舞台。
    "abelian-category": {
        id: "abelian-category", l2Key: "category-theory", name: "Abel 范畴", kind: "object",
        aliases: ["Abel范畴", "abelian category", "阿贝尔范畴", "预加范畴Abel化", "AB范畴"],
    },
    // 可表示函子由 Yoneda 嵌入的像刻画，是极限计算的常用工具。
    "representable-functor": {
        id: "representable-functor", l2Key: "category-theory", name: "可表示函子", kind: "object",
        aliases: ["可表示函子", "representable functor", "Hom函子", "presheaf representable", "representable presheaf"],
    },
    // 蛇引理把短正合列诱导为核-余核间的长正合列。
    "snake-lemma": {
        id: "snake-lemma", l2Key: "category-theory", name: "蛇引理", kind: "lemma",
        aliases: ["蛇引理", "snake lemma", "连接同态", "connecting homomorphism"],
    },
    // 五引理利用同构判据从四个位置推断第五个位置的同构。
    "five-lemma": {
        id: "five-lemma", l2Key: "category-theory", name: "五引理", kind: "lemma",
        aliases: ["五引理", "five lemma", "5-lemma"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const CATEGORY_THEORY_L3_RULES: Record<string, MathV2L3Rules> = {
    // Yoneda 引理把对象嵌入到函子范畴，通过 Hom 函子恢复整个范畴的结构。
    "yoneda-lemma": {
        definitions: ["Yoneda 引理研究局部小范畴中的对象与其表示函子 h_A = Hom(-, A) 的关系，用以把对象和态射完全翻译为函子之间的自然变换。"],
        formulas: ["自然同构：Nat(h_A, F) ≅ F(A)，其中 h_A = Hom(-, A): C^op -> Set，F: C^op -> Set 任意函子；双方在 A 上自然。", "对偶形式：Nat(h^A, F) ≅ F(A)，其中 h^A = Hom(A, -)。", "Yoneda 嵌入 y: C -> [C^op, Set] 由 A ↦ h_A 定义，是完全忠实的。"],
        theorems: ["Yoneda 引理：对局部小范畴 C 中任意对象 A 与预层 F: C^op -> Set，存在自然同构 Nat(h_A, F) ≅ F(A)，把自然变换 eta 送到 eta_A(id_A)。", "Yoneda 嵌入 y: C -> [C^op, Set] 完全忠实：Hom_C(A, B) ≅ Nat(h_A, h_B)。", "推论：两个对象若在所有 Hom 函子下都不可区分，则彼此同构。"],
        generalRequirements: ["必须先确认范畴局部小（每个 Hom 集合是集合而非真类）。", "必须明确 h_A 是协变还是反变以及对应的自然变换方向。"],
        forbiddenErrors: ["【局部小遗漏】对非局部小范畴直接使用 Yoneda 引理。", "【方向混用】把 h_A 与 h^A 混用导致自然性方阵搞反。", "【自然性遗漏】只写点态双射不验证在 A 上的自然性。", "【嵌入充分性误用】把 Yoneda 嵌入的忠实性等同于本质满，忽略像不必占满预层范畴。"],
        parameterConstraints: { locallySmall: "范畴 C 必须局部小以定义 Hom 集合。", presheaf: "F 必须是 C^op -> Set 的函子（协变版对应 h^A）。", naturality: "所述自然同构须在 A（及 F）上自然，不能仅点态成立。" },
        closureChecks: ["验证 C 局部小并写出 h_A 或 h^A 的方向。", "构造双射 Nat(h_A, F) <-> F(A) 并验证自然性方阵。", "在结论中区分 Yoneda 引理与 Yoneda 嵌入的完全忠实性。"],
        scenarioChecks: { representableFunctor: ["用 Yoneda 引理证明可表示函子的表示对象在同构意义下唯一。"], universalArrow: ["由 Yoneda 引理把泛箭头翻译成自然变换存在性问题。"], limitFromRepresentable: ["利用 h_{lim} ≅ lim h_{-} 把极限计算转化为集合中极限。"] },
    },
    // 伴随函子由 Hom 集合的自然同构刻画，等价于单位/余单位与三角恒等式。
    "adjoint-functor-hom-iso": {
        definitions: ["范畴论中的伴随刻画一对函子 F: C -> D 与 G: D -> C 何时把两侧 Hom 集合翻译为同一件事，等价于给出泛箭头 / 单位余单位。"],
        formulas: ["Hom 同构：Hom_D(F X, Y) ≅ Hom_C(X, G Y) 自然于 X 和 Y。", "单位/余单位：eta: 1_C -> G F, epsilon: F G -> 1_D，满足三角恒等式 epsilon F ∘ F eta = 1_F 与 G epsilon ∘ eta G = 1_G。"],
        theorems: ["伴随的等价刻画：F ⊣ G 等价于给出自然同构 Hom_D(F -, -) ≅ Hom_C(-, G -)，也等价于给出满足三角恒等式的 (eta, epsilon)。", "左伴随保持余极限、右伴随保持极限（RAPL/LAPC 原则）。", "伴随复合仍是伴随：若 F ⊣ G 且 F' ⊣ G'，则 F' F ⊣ G G'。"],
        generalRequirements: ["必须明确哪个是左伴随、哪个是右伴随，写清 F ⊣ G。", "必须指明 Hom 同构在两侧变量上的自然性。"],
        forbiddenErrors: ["【左右伴随反接】把左伴随和右伴随位置对调，破坏 Hom_D(F X, Y) ≅ Hom_C(X, G Y)。", "【自然性遗漏】只给点态双射不验证在 X, Y 上的自然性。", "【极限保持反用】用左伴随保持极限或右伴随保持余极限。", "【三角恒等式缺失】只给单位/余单位不核验三角恒等式，得到伪伴随。"],
        parameterConstraints: { direction: "必须固定 F: C -> D 与 G: D -> C 的方向。", naturality: "Hom 同构必须自然于两侧参数。", triangleIdentities: "以单位/余单位形式刻画伴随时必须满足两条三角恒等式。" },
        closureChecks: ["建立 Hom_D(F X, Y) ≅ Hom_C(X, G Y) 或等价的 (eta, epsilon) 并验证自然性。", "核对三角恒等式。", "利用伴随推知极限/余极限保持结论。"],
        scenarioChecks: { freeForgetful: ["自由构造 F 通常是遗忘函子 G 的左伴随，例如 Free_Grp ⊣ U_Set。"], sheafification: ["层化函子 a 是包含函子 i 的左伴随 (a ⊣ i)，用于把预层范畴的余极限抽取为层。"], tensorHom: ["模范畴中张量与 Hom 形成伴随 (- ⊗_R M) ⊣ Hom_R(M, -)，Frobenius 互反律是其特例。"] },
    },
    // 极限与余极限用泛性质给出，锥/余锥的存在与唯一性都必须显式验证。
    "limit-colimit-universal-property": {
        definitions: ["范畴论中的极限（余极限）研究图 D: J -> C 何时可以被一个「最普适」的对象所概括，其构造由泛性质刻画。"],
        formulas: ["极限锥：lim D 附带投影 pi_j: lim D -> D(j)，对任意锥 (X, f_j) 存在唯一 u: X -> lim D 使 pi_j ∘ u = f_j。", "余极限锥：colim D 附带插入 iota_j: D(j) -> colim D，对任意余锥 (Y, g_j) 存在唯一 v: colim D -> Y 使 v ∘ iota_j = g_j。", "特例：乘积（离散图）、等化子（平行对图）、拉回（V 形图）；对偶得余积、余等化子、推出。"],
        theorems: ["极限（当存在时）在同构意义下唯一；余极限同理。", "范畴对小极限完备等价于它有所有等化子和小乘积（对偶：余完备 ⇔ 余等化子 + 小余积）。", "右伴随保持所有极限、左伴随保持所有余极限（RAPL/LAPC）；因此可表示函子把极限翻译为集合中的极限。"],
        generalRequirements: ["必须明确指标范畴 J 与图 D: J -> C。", "必须区分极限（锥）与余极限（余锥）的方向；不能把泛箭头方向反过来。"],
        forbiddenErrors: ["【唯一性遗漏】只构造锥不验证泛性质中的唯一因子分解。", "【方向反用】把余极限当极限使用（例如把商写成乘积）。", "【存在性误判】在不完备范畴中默认所有小极限存在。", "【余极限保持误用】用右伴随保持余极限或左伴随保持极限。"],
        parameterConstraints: { indexCategory: "指标范畴 J 必须明确；小极限指 J 小范畴。", diagram: "D: J -> C 是显式函子，不能仅列对象忽略态射。", completeness: "极限（余极限）存在需要范畴对相应形状完备（余完备）。" },
        closureChecks: ["写出图 D 与锥/余锥。", "验证泛性质的存在与唯一因子分解。", "如需具体计算，套用 Set 中的极限公式或利用伴随保持性质。"],
        scenarioChecks: { pullbackSquare: ["拉回 P = A ×_C B 是等化子的特例，验证泛箭头唯一性时通常沿对角线展开。"], colimitOfSequence: ["Set 中滤过余极限等于并集商；一般范畴中滤过余极限与有限极限交换。"], productAsLimit: ["乘积是离散图上的极限，其泛性质对应到 Hom(X, ∏ A_i) ≅ ∏ Hom(X, A_i)。"] },
    },
    // 自然变换是函子之间的态射，其自然性方阵是核心。
    "natural-transformation": {
        definitions: ["自然变换研究两个同向函子之间的「相容映射」——它在每个对象上给出目标态射，并让所有原范畴的态射交换。"],
        formulas: ["自然变换 eta: F -> G 由分量 {eta_A: F A -> G A}_{A in C} 组成，且对每个 f: A -> B 都有 G(f) ∘ eta_A = eta_B ∘ F(f)。", "自然同构：每个 eta_A 都是同构；等价于 eta 有自然的逆变换。"],
        theorems: ["自然变换的复合（垂直复合与水平复合）满足交换律 (Godement 恒等式)；因此函子范畴 [C, D] 与 2-范畴结构成立。", "两个函子 F, G 自然同构等价于存在 eta: F -> G 使每个分量为同构。", "自然性方阵是自然变换的判据，任何具体范畴中都必须逐个态射核验。"],
        generalRequirements: ["必须明确 F, G: C -> D 同向且同形。", "必须写出自然性方阵 G(f) ∘ eta_A = eta_B ∘ F(f) 而不仅列分量。"],
        forbiddenErrors: ["【自然性遗漏】只给分量 eta_A 不检查自然性方阵。", "【方向不符】F 与 G 方向不同（一协变一反变）时错用自然变换定义。", "【同构与自然同构混淆】断言存在双射就声称自然同构，未构造出可自然复合的逆。", "【态射范围遗漏】仅在部分态射（如生成元）上验证自然性并推广，未指明范畴由该生成元生成。"],
        parameterConstraints: { sameFunctors: "F, G 必须同源同标且同变（皆协变或皆反变）。", commutativeSquare: "对每个 f: A -> B 都要求 G(f) ∘ eta_A = eta_B ∘ F(f) 成立。" },
        closureChecks: ["写出 F, G 与分量 eta_A。", "对足够多的 f 验证自然性方阵。", "如需自然同构，验证每个 eta_A 有自然逆。"],
        scenarioChecks: { yonedaNaturality: ["Yoneda 引理的双射 Nat(h_A, F) ≅ F(A) 是自然变换意义下的自然同构。"], adjointUnitCounit: ["伴随 F ⊣ G 的单位 eta 与余单位 epsilon 都是自然变换，需验证三角恒等式。"], categoricalIsomorphismCheck: ["证明两个函子等价时用自然同构而非点态同构。"] },
    },
    // Abel 范畴给出核、余核、像、余像全部存在且像等于余像的结构，是同调代数的舞台。
    "abelian-category": {
        definitions: ["Abel 范畴研究能像模范畴一样进行同调代数操作的范畴，其对象类支持核、余核、像、余像并使基本正合序列理论有效。"],
        formulas: ["核：ker f 是 f 的等化子（与 0）；余核：coker f 是 f 与 0 的余等化子。", "像与余像：im f = ker(coker f)，coim f = coker(ker f)；Abel 范畴要求典范映射 coim f -> im f 是同构。"],
        theorems: ["Abel 范畴的公理：加法预加范畴 + 零对象 + 有限双积 + 每个态射有核和余核 + 每个单态是其余核的核、每个满态是其核的余核。", "Freyd-Mitchell 嵌入定理：任何小 Abel 范畴都可完全忠实、正合地嵌入到某个模范畴 R-Mod。", "Abel 范畴中蛇引理、五引理、九引理和长正合列均成立；因此同调代数（Ext, Tor, 导出函子）可展开。"],
        generalRequirements: ["必须验证六条 Abel 范畴公理，尤其是核/余核存在和像=余像。", "必须区分加法范畴、预加范畴、Abel 范畴的层级——不是所有加法范畴都是 Abel。"],
        forbiddenErrors: ["【像=余像遗漏】只验证核/余核存在，未验证 coim -> im 是同构。", "【零对象缺失】没有零对象却声称是 Abel 范畴（如非零范畴 Ab_{≠0}）。", "【单态/满态刻画错用】把普通单射满射与 Abel 范畴意义下的单/满态混淆。", "【非 Abel 范畴滥用同调】在拓扑范畴 Top 或群范畴 Grp 上直接使用蛇引理或长正合列。"],
        parameterConstraints: { additive: "范畴必须预加（Hom 是 Ab 群且复合双线性）。", zeroObject: "必须存在零对象且有限双积存在。", kernelCokernel: "每个态射有核和余核，且典范 coim -> im 是同构。" },
        closureChecks: ["核对六条 Abel 公理。", "验证核、余核、像、余像存在并 coim = im。", "在需要同调工具时引用 Freyd-Mitchell 嵌入把结论转到模范畴。"],
        scenarioChecks: { moduleCategory: ["R-Mod 是典型 Abel 范畴，Ext 与 Tor 由投射/内射分解得到。"], sheafCategory: ["Abel 群层范畴 Sh(X, Ab) 是 Abel 范畴，可展开层同调。"], nonAbelianExample: ["Grp、Top 不是 Abel 范畴（缺少加法结构或核-余核对称性），不能直接套用同调工具。"] },
    },
    // 可表示函子的存在等价于泛箭头，是构造伴随的关键手段。
    "representable-functor": {
        definitions: ["可表示函子研究一个到 Set 的函子何时同构于某个 Hom 函子 h_A = Hom(-, A) 或 h^A = Hom(A, -)，用以把抽象函子转化为具体对象。"],
        formulas: ["F: C^op -> Set 可表示 ⇔ 存在 A in C 与自然同构 F ≅ h_A = Hom(-, A)；表示对象 A 由 F 唯一（同构）决定。", "对偶：G: C -> Set 可表示 ⇔ 存在 A in C 与自然同构 G ≅ h^A = Hom(A, -)。"],
        theorems: ["可表示函子的表示对象在同构意义下唯一，且伴随一个泛箭头 x in F(A) 使每个 F(f) 从中取值。", "F 可表示 ⇔ F 的元素范畴 elt(F) 有终对象 (A, x)；此时 (A, x) 就是泛对偶。", "极限存在的函子刻画：C 对形状 J 完备 ⇔ 对每个 D: J -> C，函子 Hom(-, lim D) 与 X ↦ lim Hom(X, D) 自然同构；后者可表示时确定 lim D。"],
        generalRequirements: ["必须给出候选表示对象 A 以及泛元素 x in F(A)。", "必须核实 F ≅ h_A 是自然同构（每个态射方阵成立）。"],
        forbiddenErrors: ["【自然性遗漏】只在对象上给出双射就声称可表示。", "【元素方向反用】把 x in F(A) 与 x in Hom(A, -) 的方向混淆。", "【表示对象非唯一化】声称存在多个不同构的表示对象。", "【存在性误判】未验证 elt(F) 有终对象即断言 F 可表示。"],
        parameterConstraints: { targetSet: "F 必须以 Set（或适当基本范畴）为值。", representingObject: "候选表示对象 A 与泛元素 x in F(A) 必须显式给出。", naturality: "同构 F ≅ h_A 必须在所有参数上自然。" },
        closureChecks: ["确定候选表示对象 A 与泛元素 x。", "构造 F(X) -> Hom(X, A) 的自然双射并验证自然性。", "由 Yoneda 引理得到表示对象唯一性。"],
        scenarioChecks: { tensorHomAdjoint: ["Hom(-, Hom(M, N)) 与 Hom(- ⊗ M, N) 都可表示，且互为自然同构，给出 - ⊗ M ⊣ Hom(M, -)。"], moduliProblem: ["若 moduli 函子可表示为某几何对象，则它就是精细 moduli 空间（否则至多有粗 moduli 空间）。"], sheafRepresentable: ["拓扑空间 Top(-, X) 在 Top^op 上可表示，即 X 本身是表示对象。"] },
    },
    // 蛇引理把三行短正合方阵翻译为一条长六项正合列。
    "snake-lemma": {
        definitions: ["Abel 范畴（或其可嵌入的模范畴）中的蛇引理研究一个可交换、行正合的两行方阵如何在核和余核之间自动引出一段长正合序列。"],
        formulas: ["若两行短正合方阵 0 -> A -> B -> C -> 0 与 0 -> A' -> B' -> C' -> 0 通过纵向 f, g, h 相接，则得到长正合序列：0 -> ker f -> ker g -> ker h ->(delta) coker f -> coker g -> coker h -> 0，其中 delta 为连接同态。"],
        theorems: ["蛇引理：在 Abel 范畴中，三个纵向态射 f, g, h 诱导出核到余核的六项长正合序列。", "推论：若 f, h 同构则 g 同构；若 f, h 单则 g 单；若 f, h 满则 g 满（三分之一定理组）。", "蛇引理是长正合列构造和五引理证明的基础。"],
        generalRequirements: ["必须验证方阵可交换且两行短正合。", "必须显式说明工作范畴是 Abel（或可嵌入模范畴）。"],
        forbiddenErrors: ["【行不正合】只验证复合为零就直接使用蛇引理。", "【连接同态方向反用】把 delta 从 coker 引到 ker，或用错元素追踪路径。", "【非 Abel 环境滥用】在 Set、Top、Grp 等非 Abel 范畴上直接使用蛇引理。", "【方阵不交换】未验证方阵交换即断言长正合。"],
        parameterConstraints: { commutativity: "方阵所有小方格必须交换。", exactRows: "两行必须短正合。", ambientCategory: "工作范畴必须是 Abel（或至少可通过 Freyd-Mitchell 嵌入模范畴）。" },
        closureChecks: ["验证方阵交换性与行正合。", "构造连接同态 delta 并验证独立于选择。", "写出六项长正合序列并核验相邻项的核像关系。"],
        scenarioChecks: { longExactCohomology: ["复形短正合列 0 -> A. -> B. -> C. -> 0 通过蛇引理迭代得到上同调长正合序列。"], derivedFunctor: ["计算 Ext^n 时利用蛇引理串联投射分解上的诸方阵。"], modulesOverRing: ["R-Mod 中的具体计算可以逐元素追踪 delta，验证正合性。"] },
    },
    // 五引理利用两侧四个同构判据推出中间同构，是同调代数的常用工具。
    "five-lemma": {
        definitions: ["Abel 范畴（或其可嵌入的模范畴）中的五引理研究：给定一个五项可交换、行正合的方阵，两侧四个纵向态射的单/满性质如何决定中间态射。"],
        formulas: ["设两行正合方阵 A_1 -> A_2 -> A_3 -> A_4 -> A_5，A'_1 -> ... -> A'_5，纵向 f_i。若 f_1 满、f_2, f_4 同构、f_5 单，则 f_3 同构。", "弱化版：若 f_2 满、f_4 单，则 f_3 是——由前四行的其他信息决定的——单或满态之一（拆成短五引理）。"],
        theorems: ["五引理：在 Abel 范畴的可交换行正合方阵中，两侧四个态射的单/满信息可以唯一决定中间态射的对应性质。", "推论（短五引理）：若两行是短正合，仅需 f_1 与 f_3 单/满 ⇒ f_2 单/满；具体表述见证明。", "五引理是判断双复形导出同构、比较不同分解的核心工具。"],
        generalRequirements: ["必须验证方阵交换、两行正合并写清五个位置的纵向态射。", "必须区分单五引理、满五引理和完整五引理三种情形。"],
        forbiddenErrors: ["【单/满前提混用】以「f_2 单 + f_4 满」推出 f_3 同构，实际方向反了。", "【方阵不交换】未验证方阵交换直接套五引理。", "【行不正合】只满足复合为零就套五引理。", "【非 Abel 范畴滥用】在 Grp、Top 等非 Abel 范畴中直接使用完整五引理。"],
        parameterConstraints: { rowsExact: "两行必须正合。", squareCommutes: "所有小方格都必须交换。", boundaryMorphisms: "两端 f_1, f_5 的单/满信息必须与中间 f_2, f_4 的同构信息配合使用。" },
        closureChecks: ["核对方阵交换性与行正合。", "根据 f_1, f_2, f_4, f_5 的单/满信息推导 f_3 的对应性质。", "如需完整同构，同时使用五引理的单版本和满版本。"],
        scenarioChecks: { longExactComparison: ["比较两个空间的长正合列时，通过五引理证明中间项之间的同构。"], mayerVietoris: ["Mayer-Vietoris 序列中利用五引理判断同调群同构。"], spectralSequenceCollapse: ["谱序列在 E_2 层退化时利用五引理比较相邻页的结构。"] },
    },
};
