import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数-格论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const LATTICE_THEORY_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 分配格判据 N5/M3：无子格同构于 N5 或 M3 等价于分配律成立。
    "distributive-lattice-n5-m3": {
        id: "distributive-lattice-n5-m3", l2Key: "lattice-theory", name: "分配格 N5/M3 判据", kind: "criterion",
        aliases: ["分配格判据", "N5判据", "M3判据", "N5-M3判据", "分配格结构刻画", "distributive lattice N5 M3"],
    },
    // 模格：由 a ≤ c 时 a ∨ (b ∧ c) = (a ∨ b) ∧ c 定义。
    "modular-lattice": {
        id: "modular-lattice", l2Key: "lattice-theory", name: "模格", kind: "object",
        aliases: ["模格", "modular lattice", "Dedekind模格", "Dedekind lattice"],
    },
    // 布尔代数：有补分配格，等价于布尔环。
    "boolean-algebra": {
        id: "boolean-algebra", l2Key: "lattice-theory", name: "布尔代数", kind: "object",
        aliases: ["布尔代数", "Boolean algebra", "有补分配格"],
    },
    // Heyting 代数：直觉逻辑代数语义，配备相对伪补运算。
    "heyting-algebra": {
        id: "heyting-algebra", l2Key: "lattice-theory", name: "Heyting 代数", kind: "object",
        aliases: ["Heyting代数", "Heyting algebra", "海廷代数", "直觉逻辑代数", "相对伪补代数"],
    },
    // Birkhoff 表示定理：有限分配格与有限偏序集的下集格一一对应。
    "birkhoff-representation-theorem": {
        id: "birkhoff-representation-theorem", l2Key: "lattice-theory", name: "Birkhoff 表示定理", kind: "theorem",
        aliases: ["Birkhoff表示定理", "Birkhoff representation theorem", "有限分配格表示定理", "有限分配格Birkhoff定理"],
    },
    // Stone 对偶：布尔代数范畴对偶等价于紧 Hausdorff 全不连通空间范畴。
    "stone-duality-boolean": {
        id: "stone-duality-boolean", l2Key: "lattice-theory", name: "布尔代数的 Stone 对偶", kind: "theorem",
        aliases: ["Stone对偶", "Stone表示定理", "Stone duality", "Stone representation theorem", "布尔代数Stone对偶"],
    },
    // Knaster-Tarski 不动点定理：完备格上单调映射的不动点集本身是完备格。
    "knaster-tarski-fixed-point": {
        id: "knaster-tarski-fixed-point", l2Key: "lattice-theory", name: "Knaster-Tarski 不动点定理", kind: "theorem",
        aliases: ["Knaster-Tarski定理", "Knaster Tarski不动点定理", "Tarski不动点定理", "Knaster-Tarski fixed point theorem", "完备格不动点定理"],
    },
    // Galois 连接：一对偏序集之间的单调映射伴随。
    "galois-connection": {
        id: "galois-connection", l2Key: "lattice-theory", name: "Galois 连接", kind: "object",
        aliases: ["Galois连接", "Galois connection", "伽罗瓦连接", "monotone Galois connection"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const LATTICE_THEORY_L3_RULES: Record<string, MathV2L3Rules> = {
    // 分配格 N5/M3 判据：格分配 ⇔ 无子格同构于 N5 或 M3。
    "distributive-lattice-n5-m3": {
        definitions: ["分配格是满足分配律 a ∧ (b ∨ c) = (a ∧ b) ∨ (a ∧ c) 的格；N5 是五元非模非分配格，M3 是菱形模格但非分配。"],
        formulas: ["分配律：a ∧ (b ∨ c) = (a ∧ b) ∨ (a ∧ c)（在格中与对偶等式 a ∨ (b ∧ c) = (a ∨ b) ∧ (a ∨ c) 等价）。", "N5 的 Hasse 图：0 < a < b < 1 与 0 < c < 1，且 a ∨ c = b ∨ c = 1，a ∧ c = b ∧ c = 0。", "M3 的 Hasse 图：0 < a, b, c < 1，两两不可比且 a ∨ b = a ∨ c = b ∨ c = 1，a ∧ b = a ∧ c = b ∧ c = 0。"],
        theorems: ["Birkhoff-Dedekind N5/M3 判据：格 L 分配 ⇔ L 不含同构于 N5 或 M3 的子格。", "推论：模格 L 分配 ⇔ L 不含同构于 M3 的子格；仅 N5 出现即打破模格性。", "分配格中每个元素 x 有唯一的（若存在的）补元。"],
        generalRequirements: ["必须先验证 L 是格（有 ∨、∧ 且满足吸收律）。", "使用 N5/M3 判据时必须核对候选子集在原格中的 ∨、∧ 运算是否封闭为对应五元结构。"],
        forbiddenErrors: ["【子格封闭遗漏】只取五个元素作为集合，未验证它们在原格的 ∨、∧ 下封闭构成子格。", "【N5 与 M3 混淆】把 M3 当作 N5 使用，或反之。", "【补元唯一性误用】非分配格中直接声称每个元素补元唯一。", "【模格与分配格混用】将「无 M3 子格」误当作分配格判据（实际上是模格判据）。"],
        parameterConstraints: { latticeStructure: "L 必须为格，∨、∧ 满足交换、结合、吸收、幂等。", subLattice: "N5/M3 候选必须在 L 的 ∨、∧ 下封闭并对应完整 Hasse 图。" },
        closureChecks: ["确认 L 是格。", "在 L 中排查是否存在子格同构于 N5 或 M3。", "若无对应子格则声明分配律成立并给出必要例证。"],
        scenarioChecks: { moduleSubmoduleLattice: ["模的子模格总是模格，因此判定其分配性只需排查是否含 M3 子格。"], booleanEmbedding: ["有限分配格可通过 Birkhoff 表示嵌入到某个幂集布尔格，用于列出所有补元。"], counterExampleDesign: ["构造非分配格反例时优先给出 N5 或 M3 的显式子格。"] },
    },
    // 模格由 a ≤ c 时 a ∨ (b ∧ c) = (a ∨ b) ∧ c 定义，是分配格的弱化推广。
    "modular-lattice": {
        definitions: ["模格研究比分配格更弱的一类格，其定义放宽为在包含关系约束下的分配等式；模格的原型是模的子模格。"],
        formulas: ["模律：a ≤ c ⇒ a ∨ (b ∧ c) = (a ∨ b) ∧ c。", "等价形式：a ∨ (b ∧ (a ∨ c)) = (a ∨ b) ∧ (a ∨ c)（无需假设 a ≤ c）。"],
        theorems: ["Dedekind 判据：格 L 模 ⇔ L 不含子格同构于 N5。", "模格 L 分配 ⇔ L 不含子格同构于 M3；分配格是模格的严格子类。", "任何模的子模格是模格（并给出维数函数与 Jordan-Hölder 型结论）。"],
        generalRequirements: ["必须先验证 L 是格。", "使用判据时必须区分模格与分配格：无 N5 只保证模格，无 M3 需在模格前提下才保证分配。"],
        forbiddenErrors: ["【判据错配】用「无 M3」判定模格，或用「无 N5」判定分配格。", "【前提遗漏】使用模律时未验证 a ≤ c。", "【模的子模格误推广】把模的一般子集当作子模格。", "【模格误等于分配格】断言模格自动分配。"],
        parameterConstraints: { latticeStructure: "L 必须是格。", modularCondition: "a ≤ c 时的模律必须逐对元素验证或引用模的子模格结构。" },
        closureChecks: ["确认 L 是格。", "验证模律或引用「无 N5 子格」判据。", "如需分配性，再验证「无 M3 子格」。"],
        scenarioChecks: { submoduleLattice: ["模 M 的子模格是模格；通过维数函数得到 Jordan-Hölder 型定理。"], normalSubgroupLattice: ["群 G 的正规子群格是模格（但一般不分配）。"], projectiveGeometry: ["射影几何中子空间格是模格，且当维数 ≥ 3 时几乎是分配的反例。"] },
    },
    // 布尔代数是有补分配格，等价于布尔环。
    "boolean-algebra": {
        definitions: ["布尔代数研究经典命题逻辑的代数模型：一个有补分配格，其结构可由 ∨、∧、¬ 或加法/乘法（幂等 x^2=x 的环运算）两种等价方式描述。"],
        formulas: ["De Morgan 律：¬(a ∨ b) = ¬a ∧ ¬b，¬(a ∧ b) = ¬a ∨ ¬b。", "布尔环转换：定义 a + b = (a ∧ ¬b) ∨ (¬a ∧ b)，a · b = a ∧ b，则 (B, +, ·) 是幂等布尔环，反之亦然。", "有限布尔代数基数 |B| = 2^n，其中 n 为原子个数。"],
        theorems: ["布尔代数 ⇔ 有补分配格 ⇔ 幂等布尔环。", "Stone 表示定理：任何布尔代数同构于某个集合的域（Set 的子代数）中的子代数。", "有限布尔代数由其原子集合完全决定，且同构于该原子集合的幂集。"],
        generalRequirements: ["必须验证「有界 + 分配 + 每元素有补」。", "使用布尔环等价形式时必须确认加法定义与幂等性 x^2=x。"],
        forbiddenErrors: ["【补元存在遗漏】只验证分配就声称是布尔代数。", "【补元非唯一】未指出分配格中补元唯一（若存在），把不同补元当作独立候选。", "【无限布尔代数基数误算】把无限布尔代数的基数写成 2^n。", "【布尔环运算错配】把布尔环加法直接当作 ∨。"],
        parameterConstraints: { boundedness: "布尔代数必须是有界格（存在最大 1 和最小 0）。", complementExistence: "每个元素必须有补元；分配前提保证补元唯一。", ringForm: "布尔环形式要求幂等 x^2=x 并给出对应加法定义。" },
        closureChecks: ["验证 L 是有界分配格。", "验证每个元素有补，并核对补元唯一性。", "如需运用 Stone 表示，构造原子集合并写出到幂集的同构。"],
        scenarioChecks: { propositionalLogic: ["命题逻辑的 Lindenbaum-Tarski 代数是布尔代数，用于模型论真值分析。"], powerSetAlgebra: ["集合 X 的幂集 (P(X), ∪, ∩, ^c) 是标准布尔代数。"], measureAlgebra: ["测度代数（模零集的可测集）是无原子的布尔代数，需借助 Stone 空间处理。"] },
    },
    // Heyting 代数是直觉逻辑的代数语义，配备相对伪补。
    "heyting-algebra": {
        definitions: ["Heyting 代数研究直觉逻辑的代数语义：在有界分配格上引入相对伪补 a → b（≤-adjoint 意义下的最大元），并把伪补 ¬a 定义为 a → 0。"],
        formulas: ["相对伪补的 Galois 刻画：c ≤ a → b ⇔ a ∧ c ≤ b；因此 a → b = ⋁ { c : a ∧ c ≤ b }。", "伪补：¬a = a → 0；一般 a ∨ ¬a ≠ ⊤，区别于布尔代数。", "De Morgan 只单向成立：¬(a ∨ b) = ¬a ∧ ¬b 恒成立，但 ¬(a ∧ b) = ¬a ∨ ¬b 一般不成立。"],
        theorems: ["Heyting 代数即完备（或有界）Cartesian 闭偏序集：满足 a ∧ (-) ⊣ (a → -) 伴随关系。", "布尔代数 ⇔ 满足 a ∨ ¬a = ⊤ 的 Heyting 代数（排中律成立）。", "任意拓扑空间 X 的开集格 O(X) 是完备 Heyting 代数（frame/locale），其中 U → V = int((X \\ U) ∪ V)。"],
        generalRequirements: ["必须验证 L 是有界分配格并给出相对伪补的显式存在性。", "必须区分伪补 ¬a 与相对伪补 a → b，不能相互替换。"],
        forbiddenErrors: ["【补元混淆】把相对伪补 a → b 当作补元使用，或把伪补当补元。", "【排中律误设】断言 a ∨ ¬a = ⊤ 对所有 Heyting 代数成立。", "【De Morgan 双向滥用】在 Heyting 代数中断言 ¬(a ∧ b) = ¬a ∨ ¬b。", "【存在性遗漏】只在部分对偶存在 a → b 就声称 Heyting 代数。"],
        parameterConstraints: { boundedness: "L 必须有 0 与 1。", distributivity: "L 必须分配。", relativePseudocomplement: "每对 (a, b) 都必须存在最大 c 使 a ∧ c ≤ b。" },
        closureChecks: ["验证 L 是有界分配格。", "对每对 (a, b) 检查相对伪补存在。", "在具体推理中区分 ¬a、a → b 与布尔补。"],
        scenarioChecks: { intuitionisticLogic: ["直觉逻辑命题演算恰对应 Heyting 代数上的公式恒真性。"], topologicalFrame: ["拓扑空间开集格是完备 Heyting 代数；使用内部/闭包描述蕴涵。"], booleanCollapse: ["若给定 Heyting 代数满足排中律，则塌陷为布尔代数。"] },
    },
    // Birkhoff 表示定理：有限分配格 ↔ 有限偏序集的下集格。
    "birkhoff-representation-theorem": {
        definitions: ["Birkhoff 表示定理研究有限分配格与有限偏序集之间的对偶：每个有限分配格都可由其并不可约元素的下集格恢复。"],
        formulas: ["并不可约元素：非零元 x 满足 x = a ∨ b ⇒ x = a 或 x = b。", "对应：L ↔ J(L)，其中 J(L) 是并不可约元素构成的偏序集，L ≅ O(J(L))，O(P) 是偏序集 P 的下集格。"],
        theorems: ["Birkhoff 表示定理：有限分配格范畴与有限偏序集范畴的对偶等价：L ↦ J(L) 与 P ↦ O(P) 互为逆等价（在同构意义下）。", "推论：有限分配格由其并不可约元素完全决定，且 |L| = 2^{|J(L)|} 当且仅当 J(L) 是反链（此时 L 是布尔格）。", "对偶版本使用交不可约元素与上集格给出相同结论。"],
        generalRequirements: ["必须首先验证 L 有限且分配。", "必须给出并不可约元素集合 J(L) 及其偏序结构。"],
        forbiddenErrors: ["【无限情形误用】对无限分配格直接使用 Birkhoff 定理（一般需借助 Priestley 对偶）。", "【非分配情形误用】对模格或一般格套用 J(L) ↔ L 的对偶。", "【并不可约与不可约元素混淆】把「a ≤ x 的极小元」当作并不可约。", "【方向反用】把 J(L) 与 M(L)（交不可约）搞混，忽略两者互为对偶。"],
        parameterConstraints: { finiteness: "格 L 必须有限。", distributivity: "L 必须分配。" },
        closureChecks: ["验证 L 有限且分配。", "计算 J(L) 及其偏序。", "构造 L -> O(J(L)) 的同构并检验。"],
        scenarioChecks: { orderPolytope: ["Stanley 序多面体和 Birkhoff 多面体源自偏序集下集格的表示。"], booleanCase: ["J(L) 反链 ⇔ L 布尔；此时 L ≅ 2^{|J(L)|}。"], youngLattice: ["Young 格是分拆的 Birkhoff 表示例子（无限但有限层）。"] },
    },
    // Stone 对偶：布尔代数与紧 Hausdorff 全不连通空间的对偶等价。
    "stone-duality-boolean": {
        definitions: ["Stone 对偶研究布尔代数与拓扑空间之间的对偶：把布尔代数对应到其超滤空间，把紧 Hausdorff 全不连通空间对应到其开闭集布尔代数。"],
        formulas: ["Stone 空间：S(B) = { ultrafilters of B }，拓扑基由 {U_a = { U : a in U } : a in B} 生成。", "开闭集布尔代数：Clop(X) = 所有开且闭的子集，运算为 ∪、∩、^c。", "对偶等价：B ≅ Clop(S(B)) 与 X ≅ S(Clop(X))。"],
        theorems: ["Stone 对偶（Stone 1936）：布尔代数范畴 Bool^op 等价于紧 Hausdorff 全不连通拓扑空间范畴 Stone；对应函子分别为 B ↦ S(B) 与 X ↦ Clop(X)。", "任意布尔代数可嵌入到某集合的幂集布尔代数中（Stone 表示定理，Stone 对偶的推论）。", "有限情形退化为幂集与离散有限集之间的对偶：|B| = 2^n ↔ |S(B)| = n。"],
        generalRequirements: ["必须使用超滤（不是普通滤子）作为 Stone 空间的点。", "紧 Hausdorff 全不连通三条件缺一不可，否则对偶不闭合。"],
        forbiddenErrors: ["【滤子误用】用素滤子或普通滤子代替超滤定义 S(B)。", "【空间条件遗漏】把普通紧 Hausdorff 空间当 Stone 空间使用而未验证全不连通。", "【对偶方向反用】把 B 与 X 的对应搞反，例如让 B ↦ Clop 或 X ↦ ultrafilters 顺序颠倒。", "【无限布尔代数对偶低估】把无限布尔代数 Stone 空间当作离散空间。"],
        parameterConstraints: { booleanSide: "布尔代数 B 必须给出运算 ∨, ∧, ¬。", topologicalSide: "拓扑空间必须紧 Hausdorff 且全不连通（等价地：紧 Hausdorff 且有开闭基）。" },
        closureChecks: ["建立 S(B) 或 Clop(X) 并验证拓扑/代数结构。", "验证 B -> Clop(S(B)) 的同构或 X -> S(Clop(X)) 的同胚。", "对具体问题使用超滤或紧空间紧性性质。"],
        scenarioChecks: { propositionalCompactness: ["命题逻辑紧性定理由 Stone 空间紧性直接导出。"], profiniteGroup: ["有限群的极限（射影极限）作为 profinite 群的底空间是 Stone 空间。"], measureTheoryOnStone: ["布尔代数上的正规测度可扩张到其 Stone 空间上的紧测度。"] },
    },
    // Knaster-Tarski 不动点定理：完备格上单调映射的不动点集是完备格。
    "knaster-tarski-fixed-point": {
        definitions: ["Knaster-Tarski 不动点定理研究完备格上保序自映射的不动点集合结构，用以在离散/顺序设置下建立不动点存在性和最小/最大不动点的计算方案。"],
        formulas: ["设 (L, ≤) 是完备格，f: L -> L 单调。定义 lfp(f) = ⋀ { x : f(x) ≤ x }，gfp(f) = ⋁ { x : x ≤ f(x) }。", "则 lfp(f) 与 gfp(f) 都是不动点；且不动点集合 Fix(f) 在 ≤ 下也是完备格。"],
        theorems: ["Knaster-Tarski 定理：完备格 (L, ≤) 上单调映射 f: L -> L 的不动点集合 Fix(f) 是完备格（关于 ≤）。", "特别地存在最小不动点 lfp(f) = ⋀ { x : f(x) ≤ x } 与最大不动点 gfp(f) = ⋁ { x : x ≤ f(x) }。", "推论（Cantor-Schröder-Bernstein）：通过 P(A) 上的适当单调映射构造双射存在性。"],
        generalRequirements: ["必须验证 (L, ≤) 完备（每个子集都有上下确界）。", "必须验证 f 单调（保序），不需要连续或 Scott 连续。"],
        forbiddenErrors: ["【完备性遗漏】在只是格（非完备格）上直接使用 Knaster-Tarski。", "【单调性遗漏】对非保序映射断言不动点存在。", "【最小最大混淆】把 lfp 与 gfp 的定义交换，导致不等式方向反。", "【连续性混淆】将 Knaster-Tarski 与 Kleene 不动点定理混用（后者要求 Scott 连续）。"],
        parameterConstraints: { completeLattice: "L 必须是完备格（例如幂集 P(A) 配 ⊆）。", monotone: "f 必须单调：a ≤ b ⇒ f(a) ≤ f(b)。" },
        closureChecks: ["验证 (L, ≤) 完备。", "验证 f 单调。", "计算或估算 lfp(f) 与 gfp(f)，并核对为不动点。"],
        scenarioChecks: { schroederBernstein: ["证明 Cantor-Schröder-Bernstein 定理：通过 P(A) 上的单调映射构造双射存在性。"], denotationalSemantics: ["程序语义中递归定义的最小不动点由 lfp 给出，需 Scott 连续时可退回 Kleene 迭代。"], leastPrefixedPoint: ["逻辑与模态 μ-演算中 μX.φ 由 lfp 于 P(状态空间) 上定义。"] },
    },
    // Galois 连接：偏序集之间的一对单调映射构成的伴随。
    "galois-connection": {
        definitions: ["Galois 连接研究两个偏序集之间的一对单调映射，它们通过相互伴随刻画对象与属性、闭包算子与内核算子的对应。"],
        formulas: ["单调 Galois 连接 (f, g)：f: P -> Q 与 g: Q -> P 满足 f(x) ≤ y ⇔ x ≤ g(y)。", "由此推出 f g f = f、g f g = g，且 g f: P -> P 与 f g: Q -> Q 分别是闭包算子。", "反变形式 (Galois 对偶)：f: P -> Q^op 与 g: Q -> P^op 满足 f(x) ≥ y ⇔ x ≥ g(y)。"],
        theorems: ["每个 Galois 连接诱导 P 上的闭包算子 c = g f 和 Q 上的闭包算子 k = f g，二者的固定点集合 P^c、Q^k 通过 (f|_{P^c}, g|_{Q^k}) 反同构。", "反之，每个闭包算子来自某个 Galois 连接（可取 Q = 固定点集）。", "推论：Galois 域扩张的中间域-子群对应、形式概念分析中的概念格都是 Galois 连接的实例。"],
        generalRequirements: ["必须明确 f, g 的方向以及是单调还是反变形式。", "必须写出核心等价 f(x) ≤ y ⇔ x ≤ g(y)（或反变对偶）。"],
        forbiddenErrors: ["【方向混用】把单调 Galois 连接与反变 Galois 连接的等价式方向搞反。", "【闭包核内核混淆】把 g f 当作 Q 上的算子，或 f g 当作 P 上的算子。", "【伴随两侧混用】把 f 视为「右伴随」时把不等式写成 x ≤ f(y)。", "【固定点集非闭包】未验证 g f 幂等而声称 P^c 就是任意 P 的子集。"],
        parameterConstraints: { posets: "P 与 Q 必须是偏序集。", monotone: "f, g 都必须单调；反变形式则对偶。", adjunctionCondition: "核心等价 f(x) ≤ y ⇔ x ≤ g(y) 或其反变对偶必须严格成立。" },
        closureChecks: ["写出 f, g 与其单调性。", "验证 f(x) ≤ y ⇔ x ≤ g(y) 或反变等价式。", "由此构造闭包/内核算子并描述固定点集合。"],
        scenarioChecks: { galoisFieldExtension: ["经典 Galois 理论中中间域 <-> 子群的反变 Galois 连接给出主定理。"], formalConceptAnalysis: ["形式概念分析中 (extent, intent) 反变 Galois 连接生成概念格。"], closureOperator: ["拓扑闭包与开核算子由包含关系上的单调 Galois 连接给出。"] },
    },
};
