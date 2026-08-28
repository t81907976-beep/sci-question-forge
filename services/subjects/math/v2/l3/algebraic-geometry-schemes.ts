import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数几何-概形与上同调”下的原子 L3 知识项。
// 本分支统一采用概型（scheme）语言：仿射侧以 Spec R（交换环的素谱）为基本对象，
// 射影侧以 Proj S（分次环的齐次素谱）为基本对象，并进一步展开凝聚层与上同调工具。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ALGEBRAIC_GEOMETRY_SCHEMES_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 素谱 Spec R 与 Zariski 拓扑：点=素理想，闭集 V(a)、主开集 D(f)，拟紧空间。
    "spec-prime-spectrum": {
        id: "spec-prime-spectrum", l2Key: "algebraic-geometry-schemes", name: "素谱 Spec R 与 Zariski 拓扑", kind: "object",
        aliases: ["素谱", "Spec", "Spec R", "prime spectrum", "素理想谱", "Zariski拓扑概型", "V(a)", "主开集", "distinguished open", "D(f)"],
    },
    // 结构层 O_Spec：主开集截面 O(D(f))=R_f，茎 O_p=R_p，构成局部环化空间。
    "structure-sheaf-spec": {
        id: "structure-sheaf-spec", l2Key: "algebraic-geometry-schemes", name: "结构层与局部环化空间", kind: "object",
        aliases: ["结构层", "structure sheaf", "O_Spec", "局部环化空间", "locally ringed space", "茎", "stalk", "仿射概型定义"],
    },
    // 仿射概型-交换环反变等价：Spec 与全局截面 Γ 互逆，Hom(Spec A,Spec B)=Hom(B,A)。
    "spec-ring-antiequivalence": {
        id: "spec-ring-antiequivalence", l2Key: "algebraic-geometry-schemes", name: "仿射概型与交换环的反变等价", kind: "theorem",
        aliases: ["仿射概型反变等价", "Spec反变等价", "affine scheme antiequivalence", "Spec函子", "全局截面函子", "纤维积概型", "Spec(A⊗B)"],
    },
    // 素谱的既约/不可约/连通刻画：由幂零根、极小素理想、幂等元决定。
    "spec-reduced-irreducible-connected": {
        id: "spec-reduced-irreducible-connected", l2Key: "algebraic-geometry-schemes", name: "素谱的既约、不可约与连通性", kind: "criterion",
        aliases: ["既约概型", "reduced scheme", "不可约概型", "irreducible scheme", "连通概型", "幂零根", "nilradical", "幂等元", "非既约概型"],
    },
    // 闭子概型与理想：闭子概型 ↔ 理想（不必取根），闭浸入 ↔ 满环同态，保留幂零厚化。
    "closed-subscheme-ideal": {
        id: "closed-subscheme-ideal", l2Key: "algebraic-geometry-schemes", name: "闭子概型与理想", kind: "theorem",
        aliases: ["闭子概型", "closed subscheme", "闭浸入", "closed immersion", "理想对应", "幂零厚化", "nilpotent thickening", "概型论交"],
    },
    // 仿射概型维数 = 环的 Krull 维数：素理想链长度，局部维数 = height。
    "affine-scheme-dimension": {
        id: "affine-scheme-dimension", l2Key: "algebraic-geometry-schemes", name: "仿射概型的维数与 Krull 维数", kind: "criterion",
        aliases: ["概型维数", "scheme dimension", "概型Krull维数", "Krull dimension", "素理想链", "height", "高度", "catenary"],
    },
    // Proj S 构造：分次环的齐次素谱（排除 irrelevant 理想）及其结构层。
    "proj-construction": {
        id: "proj-construction", l2Key: "algebraic-geometry-schemes", name: "Proj S 构造与射影概型", kind: "object",
        aliases: ["Proj", "Proj S", "分次环Proj", "齐次素谱", "射影概型构造", "irrelevant理想", "V_+(a)", "D_+(f)", "graded ring Proj"],
    },
    // Serre 扭层 O(n) 与分次模层化：可逆层 O_X(n) = (S(n))~，凝聚层 ↔ 分次模。
    "twisting-sheaf-serre": {
        id: "twisting-sheaf-serre", l2Key: "algebraic-geometry-schemes", name: "Serre 扭层 O(n) 与分次模层化", kind: "object",
        aliases: ["Serre扭层", "扭层", "O(n)", "O_X(1)", "twisting sheaf", "Serre twist", "分次模层化", "凝聚层分次模对应", "Serre theorem"],
    },
    // 到射影空间的态射与极丰线丛：X→P^n ↔ 可逆层 + 全局生成截面。
    "proj-morphism-very-ample": {
        id: "proj-morphism-very-ample", l2Key: "algebraic-geometry-schemes", name: "射影空间的态射与极丰线丛", kind: "theorem",
        aliases: ["极丰线丛", "very ample", "丰线丛", "ample", "线性系", "完整线性系", "linear system of divisors", "到射影空间的态射", "morphism to projective space", "线丛与截面"],
    },
    // 凝聚层上同调与 Serre 有限性/消失定理：H^i(P^n, O(d)) 计算与高阶消失。
    "sheaf-cohomology-serre": {
        id: "sheaf-cohomology-serre", l2Key: "algebraic-geometry-schemes", name: "凝聚层上同调与 Serre 有限性/消失", kind: "theorem",
        aliases: ["层上同调", "sheaf cohomology", "凝聚层上同调", "Serre消失定理", "Serre vanishing", "Serre有限性", "Grothendieck消失", "H^i(P^n,O(d))"],
    },
    // Serre 对偶：光滑射影簇上 H^i(X,F) ≅ H^{n-i}(X, ω_X⊗F^∨)^*。
    "serre-duality": {
        id: "serre-duality", l2Key: "algebraic-geometry-schemes", name: "Serre 对偶与 dualizing sheaf", kind: "theorem",
        aliases: ["Serre对偶", "Serre duality", "对偶层", "dualizing sheaf", "典范层", "canonical sheaf", "ω_X", "对偶定理"],
    },
    // Euler 特征与 Hilbert 多项式（概型版）：χ(F(n)) 是多项式，Riemann-Roch 基础。
    "euler-characteristic-hilbert-polynomial": {
        id: "euler-characteristic-hilbert-polynomial", l2Key: "algebraic-geometry-schemes", name: "Euler 特征与 Hilbert 多项式（概型版）", kind: "theorem",
        aliases: ["Euler特征", "Euler characteristic", "χ(F)", "Hilbert多项式概型", "算术亏格", "arithmetic genus", "Riemann-Roch", "平坦族Hilbert多项式"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const ALGEBRAIC_GEOMETRY_SCHEMES_L3_RULES: Record<string, MathV2L3Rules> = {
    // 素谱 Spec R 与 Zariski 拓扑：仿射概型的底空间，点为素理想。
    "spec-prime-spectrum": {
        definitions: ["仿射概型的底空间 Spec R 研究交换含幺环 R 的全体素理想构成的集合及其上的 Zariski 拓扑，把交换代数几何化；点不再限于极大理想，还包含非闭的一般点。"],
        formulas: ["Spec R = { p ⊆ R : p 素理想 }；一个点 = 一个素理想。", "闭集：V(a) = { p ∈ Spec R : a ⊆ p }，a ⊆ R 为理想；V(a) ∪ V(b) = V(a ∩ b) = V(ab)，∩_i V(a_i) = V(Σ_i a_i)。", "主开集（distinguished open）：D(f) = Spec R \\ V(f) = { p : f ∉ p }，构成拓扑基，D(f) ∩ D(g) = D(fg)。", "闭点 ↔ 极大理想；不可约闭集的一般点（generic point）↔ 素理想。"],
        theorems: ["Spec R 在 Zariski 拓扑下是拟紧（quasi-compact）空间（即使一般非 Hausdorff，只满足 T_0）。", "反变对应：V(-) 给出闭集与根理想的反变一一对应，V(a) = V(√a)，V(a) ⊆ V(b) ⇔ √b ⊆ √a。", "不可约闭子集 ↔ 素理想：每个不可约闭集有唯一一般点，这是概型「一般点」概念的来源。", "函子性：环同态 φ: R -> S 诱导连续映射 Spec S -> Spec R，q ↦ φ^{-1}(q)。"],
        generalRequirements: ["R 必须是交换含幺环；点是素理想而非仅极大理想（区别于经典簇的极大理想=点）。", "拓扑是 Zariski 拓扑，一般非 Hausdorff。"],
        forbiddenErrors: ["【只取极大理想】把 Spec R 的点限制为极大理想，漏掉非闭的一般点。", "【Hausdorff 误设】声称 Spec R 是 Hausdorff（一般只 T_0，非 T_2）。", "【闭集运算错误】用 V(a ∪ b) 之类未良定写法表并（应为 V(a ∩ b) 或 V(ab)）。", "【拟紧与紧混淆】把拟紧当作 Hausdorff 意义下的紧致。"],
        parameterConstraints: { commutativeRing: "R 交换含幺。", pointsArePrimes: "点 = 素理想（含非极大素）。", basis: "主开集 D(f) 构成拓扑基。" },
        closureChecks: ["写出 Spec R 的点（素理想）。", "用 V(a)/D(f) 描述闭集与开集。", "验证拟紧性与 V-√ 反变对应。"],
        scenarioChecks: { genericPoint: ["整环 R 的 Spec 有唯一一般点 (0)（零理想），在整个空间稠密。"], specOfBasicRings: ["Spec k 为单点；Spec Z 的点为 (0) 与各素数 (p)；Spec k[x] 的点为 (0) 与各 (f)（f 不可约）。"], functorialityOfSpec: ["环同态 φ: R -> S 诱导连续 Spec S -> Spec R，是 Spec 函子性的核心。"] },
    },
    // 结构层与局部环化空间：O_Spec 使 Spec R 成为局部环化空间，是概型的定义。
    "structure-sheaf-spec": {
        definitions: ["仿射概型的结构层 O_{Spec R} 给 Spec R 的每个开集配一个环，使 (Spec R, O_{Spec R}) 成为局部环化空间——「仿射概型」即与某 (Spec R, O_{Spec R}) 同构的局部环化空间，是一般概型的局部模型。"],
        formulas: ["主开集截面：O_{Spec R}(D(f)) = R_f（在 f 处局部化）；特别地 O_{Spec R}(Spec R) = O(D(1)) = R。", "茎：O_{Spec R, p} = R_p（在素理想 p 处局部化），是局部环，极大理想为 pR_p，剩余域 κ(p) = R_p / pR_p = Frac(R/p)。", "主开集本身是仿射概型：(D(f), O|_{D(f)}) ≅ Spec R_f。"],
        theorems: ["(Spec R, O_{Spec R}) 是局部环化空间：每个茎 R_p 都是局部环——这正是「局部环化」的含义。", "全局截面恢复环：Γ(Spec R, O_{Spec R}) = R，与 Spec 互为逆构造。", "一般概型定义：局部同构于仿射概型 (Spec R, O) 的局部环化空间；概型由仿射片沿主开集黏合而成。"],
        generalRequirements: ["结构层由主开集上的局部化 R_f 确定并层化；须验证层公理（限制与黏合）。", "茎必须是局部环，否则不是局部环化空间。"],
        forbiddenErrors: ["【全局截面误算】声称 O(Spec R) ≠ R 或 O(D(f)) ≠ R_f。", "【茎非局部环】认为茎是 R 而非局部环 R_p。", "【预层当层】不层化直接用主开集赋值而不验证黏合公理。", "【幂零丢失】用既约化 R_red 替换 R 从而丢弃幂零结构（概型层面应保留）。"],
        parameterConstraints: { localizations: "主开集截面为 R_f。", stalksLocal: "茎 R_p 是局部环。", ringedSpace: "结构为局部环化空间 (Spec R, O)。" },
        closureChecks: ["计算 O(D(f)) = R_f 与茎 R_p。", "验证层公理（黏合/限制）。", "确认 Γ(Spec R, O) = R。"],
        scenarioChecks: { distinguishedOpenAffine: ["D(f) ≅ Spec R_f 仍是仿射概型，用于把几何问题局部化到 R_f。"], residueField: ["点 p 的剩余域 κ(p) = R_p/pR_p 用于定义纤维与「在点 p 取值」。"], gluingToScheme: ["一般概型（如射影空间 P^n）由多个仿射概型沿主开集黏合得到。"] },
    },
    // 仿射概型与交换环的反变等价：Spec 与 Γ 给出范畴反等价。
    "spec-ring-antiequivalence": {
        definitions: ["本条研究 Spec 函子给出的仿射概型范畴与交换环范畴之间的反变等价，是概型论把交换代数完全几何化的基石；它把任意交换环（含幂零、非域上）都纳入几何框架，远比经典簇的「有限型简约 k-代数」情形广。"],
        formulas: ["Spec: (CRing)^op -> (AffSch)，R ↦ (Spec R, O_{Spec R})；全局截面 Γ 为其拟逆。", "Hom_{Sch}(Spec A, Spec B) ≅ Hom_{Ring}(B, A)：概型态射与环同态反变一一对应。", "纤维积 ↔ 张量积：Spec A ×_{Spec R} Spec B = Spec(A ⊗_R B)。"],
        theorems: ["反变等价定理：仿射概型范畴反变等价于交换环范畴，(AffSch) ≅ (CRing)^op。", "推论：概型态射 Spec A -> Spec B ↔ 环同态 B -> A；这对任意交换环成立，不需有限型、简约或域上假设。", "推论（纤维积/基变换）：纤维积 Spec A ×_{Spec R} Spec B = Spec(A ⊗_R B)，是概型基变换的代数实现。"],
        generalRequirements: ["对象为任意交换含幺环（不限有限型/简约/域上）。", "态射方向反变：几何态射对应环同态的反向。"],
        forbiddenErrors: ["【方向错用】把 Spec A -> Spec B 与 A -> B 视为同向。", "【限制到 k-代数】误以为反变等价仅对有限型 k-代数成立（实为任意交换环）。", "【纤维积误算】把 Spec A ×_{Spec R} Spec B 对应到 A × B 而非张量积 A ⊗_R B。", "【简约假设】默认环无幂零从而丢弃非既约概型。"],
        parameterConstraints: { anyCommutativeRing: "对象为任意交换含幺环。", contravariant: "Spec 与 Γ 反变互逆。", fiberProductTensor: "纤维积对应张量积 A ⊗_R B。" },
        closureChecks: ["由环同态 B -> A 构造概型态射 Spec A -> Spec B（反向）。", "用 Γ 验证与 Spec 互逆。", "纤维积/基变换用张量积计算。"],
        scenarioChecks: { morphismFromRingHom: ["概型态射完全由环同态决定，几何问题可翻译为代数问题。"], fiberProduct: ["用 Spec(A ⊗_R B) 计算纤维积与基变换（如纤维 Spec(A ⊗_R κ(p))）。"], comparisonWithVarieties: ["k 代数闭时限制到有限型简约 k-代数，恢复经典仿射簇范畴（古典分支的坐标环对应）。"] },
    },
    // 素谱的既约、不可约与连通性：由 nilradical、极小素理想、幂等元刻画。
    "spec-reduced-irreducible-connected": {
        definitions: ["本条研究仿射概型 Spec R 的既约性、不可约性与连通性如何由环 R 的代数性质（幂零元、极小素理想、幂等元）刻画；其中「既约」是概型层面（含幂零信息）的性质，而不可约、连通是纯拓扑性质。"],
        formulas: ["既约：Spec R 既约（结构层无非零幂零截面）⇔ nilradical N(R) = √(0) = 0（R 无非零幂零元）。", "不可约：Spec R 不可约 ⇔ N(R) 是素理想 ⇔ R 有唯一极小素理想；不可约分量 ↔ 极小素理想。", "连通：Spec R 连通 ⇔ R 无非平凡幂等元（除 0, 1 外无 e^2 = e）；R ≅ R_1 × R_2 ⇔ Spec R = Spec R_1 ⊔ Spec R_2。"],
        theorems: ["既约判据：Spec R 既约 ⇔ N(R) = 0；一般地 Spec R 与 Spec R_red（R_red = R/N(R)）同胚，拓扑相同但概型结构相差幂零。", "不可约判据：Spec R 不可约 ⇔ 幂零根 N(R) 素；不可约分量与极小素理想一一对应。", "连通判据：连通分量 ↔ R 的本原幂等元分解；不可约 ⇒ 连通，反之不真。"],
        generalRequirements: ["必须区分「拓扑性质」（不可约、连通）与「概型性质」（既约，携带幂零信息）。", "既约是结构层层面的性质，不能只看底拓扑空间。"],
        forbiddenErrors: ["【既约=不可约混淆】把既约（看幂零根）与不可约（看素谱）当作同一条件。", "【幂零丢弃】认为 Spec R 与 Spec R_red 作为概型相同（底拓扑同胚，但概型不同）。", "【连通与不可约混淆】把连通当作不可约（不可约蕴含连通，反向不成立）。", "【幂等元遗漏】判断连通时不检查幂等元。"],
        parameterConstraints: { nilradical: "既约 ⇔ N(R) = 0。", minimalPrime: "不可约 ⇔ 唯一极小素理想。", idempotent: "连通 ⇔ 无非平凡幂等元。" },
        closureChecks: ["计算 nilradical N(R) 判既约。", "求极小素理想判不可约及不可约分量。", "查幂等元判连通并分解。"],
        scenarioChecks: { nonreducedScheme: ["Spec k[x]/(x^2) 底空间为单点却非既约（含幂零 x），是概型语言相对经典簇的关键新对象。"], irreducibleComponents: ["Spec k[x,y]/(xy) 有两个不可约分量（两条坐标轴），对应两个极小素理想 (x), (y)。"], disconnectedSpec: ["Spec(R_1 × R_2) = Spec R_1 ⊔ Spec R_2，由幂等元 (1,0) 给出连通分量。"] },
    },
    // 闭子概型与理想：闭子概型 ↔ 理想（不必根理想），闭浸入 ↔ 满环同态。
    "closed-subscheme-ideal": {
        definitions: ["本条研究仿射概型 Spec R 的闭子概型与环 R 的理想之间的对应，以及闭浸入与满环同态的关系；与经典簇不同，这里的理想不必取根，从而能表达带幂零的「厚化」子概型。"],
        formulas: ["闭子概型 ↔ 理想 I ⊆ R（不必根理想）：理想 I 给出闭子概型 Spec(R/I) ↪ Spec R，结构环为 R/I。", "闭浸入 Spec(R/I) -> Spec R ↔ 满环同态 R ↠ R/I。", "底空间 |V(I)| 只依赖 √I（拓扑闭集），但概型结构依赖 I 本身（保留幂零/重数），如 (x) 与 (x^2) 底同而概型不同。"],
        theorems: ["对应定理：仿射概型 Spec R 的闭子概型与 R 的理想一一对应（I ↦ Spec R/I）。", "闭浸入 ⇔ 满环同态；两个理想给同一底闭集 ⇔ √I = √J，但概型可不同（厚化）。", "推论：概型层面可区分幂零厚化（nilpotent thickening），是形变理论与交点重数的语言基础，经典簇无法表达。"],
        generalRequirements: ["理想不必取根（与经典簇的根理想对应不同）。", "必须区分底拓扑闭集 |V(I)| 与闭子概型的结构（R/I）。"],
        forbiddenErrors: ["【强取根】误以为闭子概型只对应根理想，从而丢失非既约子概型。", "【闭浸入方向】把闭浸入对应到单环同态而非满环同态。", "【拓扑=概型】认为同底闭集的闭子概型相同（(x) 与 (x^2) 底同但概型不同）。", "【厚化忽略】忽略幂零厚化在形变、交点重数中的作用。"],
        parameterConstraints: { idealNotNecessarilyRadical: "理想 I 任意，不必取根。", surjectionClosedImmersion: "闭浸入 ↔ 满环同态。", structureQuotient: "闭子概型结构环为 R/I。" },
        closureChecks: ["由理想 I 构造闭子概型 Spec R/I。", "验证闭浸入对应满同态 R ↠ R/I。", "比较 √I 相同但 I 不同的厚化结构。"],
        scenarioChecks: { nilpotentThickening: ["Spec k[x]/(x^2) ↪ A^1 是原点的一阶厚化（对偶数），是形变理论的基本模型。"], schemeTheoreticIntersection: ["概型论交 V(I) ∩ V(J) = V(I+J) 保留重数（如相切曲线的交点是非既约点）。"], fatPoint: ["胖点 Spec k[x,y]/(x,y)^2 记录原点的一阶邻域信息。"] },
    },
    // 仿射概型的维数与 Krull 维数：dim Spec R = Krull dim R，局部维数 = height。
    "affine-scheme-dimension": {
        definitions: ["本条研究仿射概型 Spec R 的维数如何由环 R 的 Krull 维数刻画，并在有限型 k-代数上与经典簇维数一致；维数用素理想链（等价地不可约闭子集链）的长度定义。"],
        formulas: ["dim Spec R = Krull dim R = 素理想严格包含链 p_0 ⊊ p_1 ⊊ ... ⊊ p_n 的最大长度 n。", "局部维数：dim_p = dim O_{Spec R, p} = Krull dim R_p = height(p)（素理想 p 的高度）。", "维数公式（catenary 环，如有限型 k-代数）：height(p) + dim(R/p) = dim R。"],
        theorems: ["概型维数 = 底环 Krull 维数；对有限型 k-代数（k 域）与经典簇维数一致。", "有限型 k-代数整环：dim R = tr.deg_k Frac(R)（与超越次数一致，衔接古典分支的维数三重等价）。", "局部性：height(p) = dim R_p；有限型 k-代数上 height(p) + dim(R/p) = dim R（catenary 性质）。"],
        generalRequirements: ["维数用素理想严格包含链定义（Krull），链长度按边数计。", "一般环 height(p) + dim(R/p) 未必等于 dim R，需 catenary 条件。"],
        forbiddenErrors: ["【链长度误计】把素理想链长度算成理想个数而非严格包含链的边数。", "【维数公式恒等误设】对非 catenary 环断言 height(p) + dim(R/p) = dim R。", "【超越次数越界】对非有限型或非整环直接套用 dim = tr.deg 公式。", "【局部/全局维数混淆】用 dim R 替代局部维数 dim R_p = height(p)。"],
        parameterConstraints: { krullChain: "维数 = 素理想严格包含链的最大长度。", localDimHeight: "局部维数 dim_p = height(p) = dim R_p。", catenary: "height + coheight = dim 需要 catenary（有限型 k-代数满足）。" },
        closureChecks: ["找最长素理想严格包含链得 Krull 维数。", "有限型整环可用超越次数核对。", "局部维数用 height(p) = dim R_p 计算。"],
        scenarioChecks: { affineSpaceDim: ["dim A^n_k = Krull dim k[x_1,...,x_n] = n。"], arithmeticScheme: ["dim Spec Z = 1（链 (0) ⊊ (p)）；算术概型 Spec Z[x] 维数为 2，混合算术与几何方向。"], localRingDimension: ["点 p 处局部维数 = dim R_p = height(p)，刻画该点邻域的局部几何。"] },
    },
    // Proj S 构造：分次环的齐次素谱（排除 irrelevant 理想）黏合成射影概型。
    "proj-construction": {
        definitions: ["射影概型的基本构造 Proj S 研究分次交换环 S = ⊕_{d≥0} S_d 的齐次素理想（不含 irrelevant 理想 S_+）构成的空间及其结构层，是仿射 Spec 在分次情形的类比，给出射影空间与射影簇的概型模型。"],
        formulas: ["Proj S = { p ⊂ S : p 齐次素理想且 p ⊉ S_+ }，其中 S_+ = ⊕_{d>0} S_d 是 irrelevant 理想。", "闭集 V_+(a) = { p ∈ Proj S : a ⊆ p }（a 齐次理想）；主开集 D_+(f) = { p : f ∉ p }（f ∈ S_d, d > 0）。", "仿射覆盖：D_+(f) ≅ Spec S_(f)，S_(f) 是局部化 S_f 的 0 次分量 { g/f^m : g ∈ S_{m·deg f} }。", "射影空间：P^n_A = Proj A[x_0, ..., x_n]。"],
        theorems: ["(Proj S, O_{Proj S}) 是概型：由仿射片 D_+(f) ≅ Spec S_(f) 沿交叠黏合而成。", "若 S 由 S_1 作为 S_0-代数生成，则 O(1) 是 Proj S 上的可逆层（O(1) 极丰）。", "Proj 是函子但不给出与分次环的范畴反等价：不同分次环可有同构的 Proj（如 S 与其 Veronese 子环 S^{(d)}）。"],
        generalRequirements: ["S 是分次交换环，通常 S_0 = A 为基环、S 由 S_1 有限生成。", "必须排除 irrelevant 理想 S_+：含 S_+ 的齐次素理想不是 Proj S 的点。"],
        forbiddenErrors: ["【irrelevant 理想混入】把 S_+ 或包含 S_+ 的素理想当作 Proj S 的点。", "【非齐次素理想】用非齐次素理想作为 Proj S 的点。", "【D_+(f) 截面误算】声称 O(D_+(f)) = S_f 而非 0 次分量 S_(f)。", "【Proj 反等价误设】以为 Proj 像 Spec 那样与分次环范畴反等价（Veronese 子环反例）。"],
        parameterConstraints: { gradedRing: "S = ⊕_{d≥0} S_d 分次交换环，S_0 = A。", irrelevantIdeal: "排除 irrelevant 理想 S_+ = ⊕_{d>0} S_d。", affineChart: "D_+(f) ≅ Spec S_(f)（0 次局部化）。" },
        closureChecks: ["写出 S 的分次与 irrelevant 理想 S_+。", "描述 Proj S 的点（不含 S_+ 的齐次素理想）与仿射覆盖 D_+(f) ≅ Spec S_(f)。", "如为射影空间/簇，写成 Proj A[x_0,...,x_n] 或 Proj(S/I)。"],
        scenarioChecks: { projectiveSpace: ["P^n_A = Proj A[x_0,...,x_n]，D_+(x_i) ≅ A^n_A 是标准仿射覆盖。"], veroneseSubring: ["Proj S ≅ Proj S^{(d)}（Veronese 子环），说明 Proj 不是范畴反等价。"], projectiveVariety: ["射影簇 = Proj(S/I)，I 为齐次理想，是 Proj 构造的既约既定情形。"] },
    },
    // Serre 扭层 O(n) 与分次模层化：可逆层与凝聚层-分次模对应。
    "twisting-sheaf-serre": {
        definitions: ["Serre 扭层研究射影概型 X = Proj S 上由分次模 S(n) 层化得到的层 O_X(n)，以及凝聚层与有限生成分次模之间的对应，是线丛、线性系与射影上同调的基础。"],
        formulas: ["O_X(n) = (S(n))~，S(n) 是 S 的移位分次模 S(n)_d = S_{n+d}。", "张量律：O_X(m) ⊗ O_X(n) = O_X(m+n)，O_X(n) = O_X(1)^{⊗ n}。", "全局截面（P^n = Proj k[x_0,...,x_n]）：H^0(P^n, O(d)) = k[x_0,...,x_n]_d（d ≥ 0，维数 C(n+d, n)）；d < 0 时 H^0 = 0。", "Γ_*(F) = ⊕_{n∈Z} H^0(X, F(n)) 是分次 S-模，层化恢复凝聚层 F。"],
        theorems: ["若 S 由 S_1 生成，O_X(1) 是可逆层，O_X(n) 皆可逆。", "Serre 对应定理：S 由 S_1 生成且 Noether 时，X = Proj S 上凝聚层范畴等价于有限生成分次 S-模范畴模去 S_+-挠（有限长度）模。", "每个凝聚层都可由形如 ⊕ O(a_i) 的层表出（生成/局部自由分解）。"],
        generalRequirements: ["O(1) 为可逆层需 S 由 1 次元素生成；一般 Proj 上 O(1) 只是凝聚层。", "必须区分扭层 O(n) 本身与其全局截面模 H^0(X, O(n))。"],
        forbiddenErrors: ["【O(1) 非可逆情形】未验证 S 由 S_1 生成就断言 O(1) 可逆。", "【全局截面误算】声称 H^0(P^n, O(d)) 对 d < 0 非零。", "【张量加法错误】写成 O(m) ⊗ O(n) = O(mn) 而非 O(m+n)。", "【模层对应遗漏挠】忽略 S_+-挠模层化为零层，导致对应非唯一。"],
        parameterConstraints: { generatedByDegreeOne: "O(1) 可逆需 S 由 S_1 生成。", twistTensor: "O(m) ⊗ O(n) = O(m+n)。", coherentModuleCorrespondence: "凝聚层 ↔ 有限生成分次模模去 S_+-挠。" },
        closureChecks: ["写出 O_X(n) = (S(n))~ 并验证张量律。", "计算所需的全局截面 H^0(X, O(n))。", "如需层-模对应，取 Γ_*(F) 并层化核对。"],
        scenarioChecks: { globalSectionsCount: ["dim_k H^0(P^n, O(d)) = C(n+d, n)（d ≥ 0），d < 0 为 0。"], picardOfProjectiveSpace: ["Pic(P^n) = Z，由 O(1) 生成；O(d) 对应超平面 d 倍。"], lineBundleFromDivisor: ["超平面 H ⊂ P^n 给出 O(H) = O(1)，线性系 |O(d)| 即 d 次超曲面族。"] },
    },
    // 射影空间的态射与极丰线丛：X→P^n ↔ 可逆层 + 全局生成截面。
    "proj-morphism-very-ample": {
        definitions: ["本条研究概型到射影空间的态射如何由可逆层与其全局截面刻画，以及丰/极丰线丛的判据，是把「嵌入射影空间」代数化的核心（射影嵌入 = 无基点完整线性系）。"],
        formulas: ["态射资料对应：φ: X -> P^n_A 的资料 ↔ (可逆层 L on X, 全局生成截面 s_0,...,s_n ∈ Γ(X, L))，满足 φ^* O(1) = L, φ^* x_i = s_i。", "极丰（very ample over A）：L 极丰 ⇔ 存在闭嵌入 i: X ↪ P^n_A 使 i^* O_{P^n}(1) = L。", "丰（ample）：L 丰 ⇔ 存在 m > 0 使 L^{⊗ m} 极丰。"],
        theorems: ["态射分类定理：Hom_A(X, P^n_A) ↔ {(L, s_0,...,s_n) : s_i 全局生成 L} / 同构。", "Serre 定理：X 上凝聚层 F 与丰线丛 L，则 F ⊗ L^{⊗ n} 对 n >> 0 由全局截面生成且高阶上同调消失。", "射影态射是紧合（proper）的：闭嵌入 X ↪ P^n_A 与 P^n_A -> Spec A 的合成。"],
        generalRequirements: ["截面 s_0,...,s_n 必须全局生成 L（无公共零点），否则只得有理映射。", "必须区分丰（需取幂次）与极丰（直接给闭嵌入），且二者是相对基环的概念。"],
        forbiddenErrors: ["【全局生成遗漏】用有公共零点（基点）的截面定义到 P^n 的态射，在基点处无定义。", "【丰/极丰混淆】把丰线丛直接当极丰而不取幂次。", "【拉回方向错误】搞反 φ^* O(1) = L 的方向。", "【proper 遗漏】以为射影态射不必紧合。"],
        parameterConstraints: { globallyGenerated: "定义态射的截面必须全局生成 L。", veryAmpleClosedEmbedding: "极丰 ⇔ 由 L 给出闭嵌入到某 P^n_A。", ampleIsPowerVeryAmple: "丰 ⇔ 某 L^{⊗m} 极丰。" },
        closureChecks: ["给定 L 与全局生成截面，写出到 P^n 的态射并验证无基点。", "判断 L 是丰还是极丰（是否需取幂次）。", "如需嵌入，验证 L 给出闭嵌入。"],
        scenarioChecks: { veroneseAsLinearSystem: ["Veronese 嵌入由 O(d) 的完整线性系 |O(d)| 给出，是极丰线丛的标准例。"], rationalMapBaseLocus: ["截面有公共基点时只得有理映射 X ⇢ P^n；爆破基点可消除不定性。"], ampleCriterionOnCurve: ["光滑射影曲线上 deg L > 0 ⇒ L 丰；deg L ≥ 2g+1 ⇒ L 极丰（g 为亏格）。"] },
    },
    // 凝聚层上同调与 Serre 有限性/消失定理。
    "sheaf-cohomology-serre": {
        definitions: ["本条研究射影概型上凝聚层的层上同调 H^i(X, F) 及 Serre 的有限性与消失定理，是计算亏格、Riemann-Roch 与判定整体几何性质的核心工具。"],
        formulas: ["射影空间上同调（Serre）：H^0(P^n, O(d)) = k[x_0,...,x_n]_d（d ≥ 0，维数 C(n+d, n)）；H^n(P^n, O(d)) ≅ H^0(P^n, O(-d-n-1))^*（对偶）；中间 H^i(P^n, O(d)) = 0（0 < i < n，任意 d）。", "Serre 消失：X 射影 over Noether A，F 凝聚，L 丰，则 H^i(X, F ⊗ L^{⊗ n}) = 0 对所有 i > 0 与 n >> 0。", "Serre 有限性：X proper over Noether A、F 凝聚 ⇒ H^i(X, F) 是有限生成 A-模；A = k 时 dim_k H^i(X, F) < ∞。"],
        theorems: ["Grothendieck 消失定理：dim X = n ⇒ H^i(X, F) = 0 对所有 i > n。", "Serre 有限性与消失定理（如上）：射影/proper + Noether + 凝聚是前提。", "射影空间上同调完全计算：H^i(P^n, O(d)) 仅在 i = 0（d ≥ 0）与 i = n（d ≤ -n-1）非零。"],
        generalRequirements: ["X 必须 proper 或射影 over Noether 基环。", "F 必须凝聚；上同调的有限性、消失依赖这些前提。"],
        forbiddenErrors: ["【中间上同调误设】声称 H^i(P^n, O(d)) 对 0 < i < n 非零。", "【消失定理无 twist】不取 L 的高幂或不要求 L 丰就断言高阶上同调消失。", "【有限性无前提】对非 proper 或非 Noether 情形断言 H^i 有限维。", "【维数上界错误】声称 H^i 在 i > dim X 仍可非零。"],
        parameterConstraints: { properOverNoether: "X proper/射影 over Noether 基环。", coherentSheaf: "F 凝聚层。", vanishingRange: "H^i = 0 对 i > dim X（Grothendieck），高阶消失需丰线丛高幂。" },
        closureChecks: ["确认 X proper/射影 over Noether、F 凝聚。", "对 P^n 上线丛用 Serre 计算表读出 H^i。", "如需消失，取丰线丛的高幂并用 Serre 消失。"],
        scenarioChecks: { genusFromCohomology: ["光滑射影曲线 g = dim H^1(X, O_X) = dim H^0(X, ω_X)。"], projectiveSpaceCohomology: ["H^*(P^n, O(d)) 只集中在 i = 0 与 i = n，是最基本的计算范例。"], ampleVanishingForGlobalGeneration: ["丰线丛高幂高阶上同调消失，用于证明凝聚层被整体截面生成。"] },
    },
    // Serre 对偶与 dualizing sheaf。
    "serre-duality": {
        definitions: ["Serre 对偶研究光滑射影簇上层上同调的对偶关系，通过 dualizing sheaf（典范层）ω_X 把 H^i 与 H^{n-i} 联系起来，是 Riemann-Roch 与曲线/曲面理论的支柱。"],
        formulas: ["光滑射影 X（dim n）over k、F 局部自由（向量丛）：H^i(X, F) ≅ H^{n-i}(X, ω_X ⊗ F^∨)^*（k-线性对偶）。", "dualizing / 典范层（光滑时）：ω_X = ∧^n Ω_{X/k}；特别 ω_{P^n} = O(-n-1)。", "曲线（n = 1）：H^1(X, L) ≅ H^0(X, ω_X ⊗ L^{-1})^*。"],
        theorems: ["Serre 对偶定理（光滑射影）：存在迹映射 H^n(X, ω_X) ≅ k 使配对 H^i(X, F) × H^{n-i}(X, ω_X ⊗ F^∨) -> k 完全。", "一般（Cohen-Macaulay/proper）：用 dualizing complex ω_X^• 表述，光滑时退化为 ω_X[n]。", "推论：光滑射影曲线 ω_X 是典范丛，deg ω_X = 2g - 2，h^0(ω_X) = g。"],
        generalRequirements: ["标准形式要求 X 光滑射影；奇异情形须用 dualizing sheaf/复形（Cohen-Macaulay + proper）。", "F 局部自由时用 F^∨ 对偶；一般凝聚层需用 Ext 表述。"],
        forbiddenErrors: ["【光滑性遗漏】对奇异簇直接用 ω_X = ∧^n Ω（奇异时须用 dualizing sheaf/复形）。", "【对偶指标错误】把 H^i 对偶到 H^i 而非 H^{n-i}。", "【F^∨ 遗漏】对非平凡 F 忘记取对偶 F^∨。", "【典范层误算】把 ω_{P^n} 写成 O(n+1) 而非 O(-n-1)。"],
        parameterConstraints: { smoothProjective: "标准 Serre 对偶要求 X 光滑射影。", dualizingSheaf: "ω_X = ∧^n Ω_{X/k}（光滑）；一般用 dualizing complex。", localFree: "F 局部自由时用 F^∨；否则用 Ext^i。" },
        closureChecks: ["确认 X 光滑射影并求 dim X = n 与 ω_X。", "把 H^i(X, F) 对偶为 H^{n-i}(X, ω_X ⊗ F^∨)^*。", "如为奇异簇，改用 dualizing complex。"],
        scenarioChecks: { curveCanonical: ["曲线 ω_X 典范丛 deg = 2g-2；Riemann-Roch 中 h^1(L) = h^0(ω_X - L)。"], projectiveSpaceDualizing: ["ω_{P^n} = O(-n-1)，是判定态射与消失定理的基准。"], riemannRochInput: ["Serre 对偶把 Riemann-Roch 的 H^1 项转成 H^0(ω_X ⊗ L^∨)，便于计算。"] },
    },
    // Euler 特征与 Hilbert 多项式（概型版）。
    "euler-characteristic-hilbert-polynomial": {
        definitions: ["本条研究射影概型上凝聚层的 Euler 特征 χ(F) = Σ(-1)^i dim H^i(X, F)，以及 χ(F(n)) 作为 n 的多项式给出概型的 Hilbert 多项式，是 Riemann-Roch 型公式与次数、算术亏格等不变量的来源。"],
        formulas: ["Euler 特征：χ(F) = Σ_{i≥0} (-1)^i dim_k H^i(X, F)（X proper over k，交替有限和）。", "Hilbert 多项式：P_F(n) = χ(F(n)) = χ(F ⊗ O_X(n)) 是 n 的多项式，deg P_F = dim(supp F)。", "概型 Hilbert 多项式：P_X(n) = χ(O_X(n))；X ⊂ P^N（dim d）时首项为 (deg X / d!) n^d。", "算术亏格：p_a(X) = (-1)^{dim X}(P_X(0) - 1) = (-1)^{dim X}(χ(O_X) - 1)。"],
        theorems: ["Euler 特征加性：对短正合列 0 -> F' -> F -> F'' -> 0 有 χ(F) = χ(F') + χ(F'')；且在平坦族中 χ（Hilbert 多项式）恒定（Hilbert scheme 的基础）。", "Hilbert 多项式定理（Snapper）：χ(F(n)) 是 n 的多项式。", "Riemann-Roch（曲线）：χ(L) = deg L + 1 - g，即 h^0(L) - h^1(L) = deg L + 1 - g。"],
        generalRequirements: ["X proper over k、F 凝聚：Euler 特征用交替和消去了单个上同调维数的计算难点。", "平坦性是 Hilbert 多项式在族中恒定的前提。"],
        forbiddenErrors: ["【χ 与 h^0 混淆】把 χ(F) 当作 h^0(F)（忽略高阶交替项）。", "【平坦性遗漏】断言 Hilbert 多项式在任意族中恒定（需平坦族）。", "【算术/几何亏格混淆】奇异曲线上把 p_a 当作几何亏格。", "【首项系数遗漏 d!】写 P_X 首项时漏掉 1/d! 分母。"],
        parameterConstraints: { properOverField: "X proper over k、F 凝聚。", flatFamilyConstant: "Hilbert 多项式在平坦族中恒定。", leadingTerm: "P_X 首项 (deg X / (dim X)!) n^{dim X}。" },
        closureChecks: ["确认 X proper over k、F 凝聚。", "用交替和或加性计算 χ(F(n))，拟合 Hilbert 多项式 P_X(n)。", "从 P_X 读出 deg X（首项）与 p_a（常数项）。"],
        scenarioChecks: { riemannRochCurve: ["曲线 χ(L) = deg L + 1 - g，配合 Serre 对偶给出经典 Riemann-Roch。"], flatFamilyConstantHilbert: ["平坦族纤维 Hilbert 多项式恒定，是 Hilbert scheme 与模空间构造的基石。"], degreeAndGenusReadOff: ["由 P_X(n) 的首项读出 deg X、由 P_X(0) 读出算术亏格 p_a。"] },
    },
};
