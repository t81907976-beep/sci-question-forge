import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数-抽象代数”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ALGEBRA_ABSTRACT_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    "first-isomorphism-theorem-group": {
        id: "first-isomorphism-theorem-group", l2Key: "algebra-abstract", name: "群第一同构定理", kind: "theorem",
        aliases: ["第一同构定理", "群第一同构定理", "first isomorphism theorem"],
    },
    "lagrange-theorem-group": {
        id: "lagrange-theorem-group", l2Key: "algebra-abstract", name: "Lagrange 定理", kind: "theorem",
        aliases: ["Lagrange定理", "拉格朗日定理", "Lagrange theorem"],
    },
    "sylow-theorems": {
        id: "sylow-theorems", l2Key: "algebra-abstract", name: "Sylow 定理", kind: "theorem",
        aliases: ["Sylow定理", "西罗定理", "Sylow theorems", "Sylow subgroup"],
    },
    "chinese-remainder-theorem-ring": {
        id: "chinese-remainder-theorem-ring", l2Key: "algebra-abstract", name: "环的中国剩余定理", kind: "theorem",
        aliases: ["环的中国剩余定理", "环版CRT", "ring Chinese remainder theorem"],
    },
    "galois-correspondence": {
        id: "galois-correspondence", l2Key: "algebra-abstract", name: "Galois 对应", kind: "theorem",
        aliases: ["Galois对应", "伽罗瓦对应", "Galois correspondence"],
    },
    // 有限交换群结构定理给出唯一分解为循环群直积，是有限交换群分类的基础。
    "structure-theorem-finite-abelian-group": {
        id: "structure-theorem-finite-abelian-group", l2Key: "algebra-abstract", name: "有限交换群结构定理", kind: "theorem",
        aliases: ["有限交换群结构定理", "有限Abel群分类", "structure theorem finite abelian group", "fundamental theorem of finite abelian groups"],
    },
    // Jordan-Hölder 定理给出合成列因子的唯一性，是群的组成因子概念的基础。
    "jordan-holder-theorem": {
        id: "jordan-holder-theorem", l2Key: "algebra-abstract", name: "Jordan-Hölder 定理", kind: "theorem",
        aliases: ["Jordan-Holder定理", "Jordan-Hölder定理", "Jordan Holder theorem"],
    },
    // 本原元定理说明有限可分扩张可由单个元素生成。
    "primitive-element-theorem": {
        id: "primitive-element-theorem", l2Key: "algebra-abstract", name: "本原元定理", kind: "theorem",
        aliases: ["本原元定理", "primitive element theorem", "单扩张定理", "有限可分扩张单生成"],
    },
    // Wedderburn-Artin 定理刻画半单 Artin 环为除环上矩阵环的有限直积。
    "wedderburn-artin-theorem": {
        id: "wedderburn-artin-theorem", l2Key: "algebra-abstract", name: "Wedderburn-Artin 定理", kind: "theorem",
        aliases: ["Wedderburn-Artin定理", "Wedderburn定理", "Artin-Wedderburn定理", "Wedderburn Artin theorem", "半单环结构定理"],
    },
    // 戴德金整环是数论和代数几何中一维正规环的核心对象，理想具有唯一素分解。
    "dedekind-domain": {
        id: "dedekind-domain", l2Key: "algebra-abstract", name: "戴德金整环", kind: "object",
        aliases: ["戴德金整环", "Dedekind整环", "Dedekind domain", "Dedekind环"],
    },
    // 群表示论中的 Schur 引理刻画不可约表示之间的交换子代数结构。
    "schur-lemma-representation": {
        id: "schur-lemma-representation", l2Key: "algebra-abstract", name: "Schur 引理", kind: "lemma",
        aliases: ["Schur引理", "Schur lemma", "舒尔引理", "群表示论Schur引理", "不可约表示Schur引理"],
    },
    // Maschke 定理给出有限群在特征不整除群阶时的表示的完全可约性。
    "maschke-theorem": {
        id: "maschke-theorem", l2Key: "algebra-abstract", name: "Maschke 定理", kind: "theorem",
        aliases: ["Maschke定理", "Maschke theorem", "马施克定理", "完全可约定理"],
    },
    // Nakayama 引理是交换代数与局部代数中处理有限生成模的核心工具。
    "nakayama-lemma": {
        id: "nakayama-lemma", l2Key: "algebra-abstract", name: "Nakayama 引理", kind: "lemma",
        aliases: ["Nakayama引理", "中山引理", "Nakayama lemma", "NAK引理", "Nakayama-Azumaya-Krull引理"],
    },
    // Burnside p^a q^b 定理给出仅有两个素因子的有限群必可解的经典结论。
    "burnside-p-a-q-b-theorem": {
        id: "burnside-p-a-q-b-theorem", l2Key: "algebra-abstract", name: "Burnside p^a q^b 定理", kind: "theorem",
        aliases: ["Burnside p^a q^b 定理", "Burnside可解性定理", "Burnside paqb theorem", "伯恩赛德可解性定理", "两素因子群可解定理"],
    },
    // Frobenius 互反律给出诱导表示与限制表示之间的伴随关系。
    "frobenius-reciprocity": {
        id: "frobenius-reciprocity", l2Key: "algebra-abstract", name: "Frobenius 互反律", kind: "theorem",
        aliases: ["Frobenius互反律", "Frobenius reciprocity", "弗罗贝尼乌斯互反律", "诱导表示互反律", "induction restriction adjunction"],
    },
    // Krull-Schmidt 定理给出不可分解直和分解的唯一性。
    "krull-schmidt-theorem": {
        id: "krull-schmidt-theorem", l2Key: "algebra-abstract", name: "Krull-Schmidt 定理", kind: "theorem",
        aliases: ["Krull-Schmidt定理", "Krull Schmidt theorem", "Krull-Remak-Schmidt定理", "克鲁尔-施密特定理", "不可分解直和分解唯一性定理"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const ALGEBRA_ABSTRACT_L3_RULES: Record<string, MathV2L3Rules> = {
    // 第一同构定理必须把概念描述和定理形式分开。
    "first-isomorphism-theorem-group": {
        definitions: ["群同态会把原群按核分成若干陪集，第一同构定理说明这种“模掉核”的结构与像群完全一致。"],
        formulas: ["诱导映射 phi(g ker phi)=phi(g)；需证明良定义、同态、单射和满射。"],
        theorems: ["若 phi:G->H 为群同态，则存在唯一同构 φ̄:G/ker phi -> im phi，使 φ̄(g ker phi)=phi(g)；因此 G/ker phi ≅ im phi。"],
        generalRequirements: ["必须明确同态 phi:G->H。", "必须求出 ker phi 和 im phi，不能只写目标群 H。"],
        forbiddenErrors: ["【像遗漏】phi 不满射时直接写 G/ker phi ≅ H。", "【良定义遗漏】未说明 coset 代表元改变不影响诱导映射。", "【只比阶数】两个有限群同阶不等于同构。"],
        parameterConstraints: { homomorphism: "第一同构定理必须基于明确的群同态。", image: "结论对象是 im phi，除非已证明 phi 满射。" },
        closureChecks: ["验证 phi 是同态。", "计算 ker phi 与 im phi。", "构造诱导同构并验证良定义。"],
        scenarioChecks: { quotientIdentification: ["不要混淆子群和商群。"] },
    },
    // Lagrange 定理只给必要整除条件，其逆命题一般不成立。
    "lagrange-theorem-group": {
        definitions: ["有限群中的子群会把群划分成若干等大小陪集，Lagrange 定理正是利用这种划分关系刻画阶数之间的联系。"],
        formulas: ["|G|=[G:H]|H|。"],
        theorems: ["若 G 为有限群且 H<=G，则 |G|=[G:H]|H|，因此 |H| 整除 |G|。", "任意元素 g 的阶也整除 |G|。", "子群阶整除群阶的逆命题一般不成立。"],
        generalRequirements: ["必须确认群有限。", "不能由 d| |G| 直接断言存在 d 阶子群。"],
        forbiddenErrors: ["【逆命题误用】阶数整除就声称存在对应阶子群。", "【无限群误用】无限群直接使用有限阶整除公式。", "【元素阶/子群阶混淆】元素阶是其生成循环子群的阶。"],
        parameterConstraints: { finiteness: "Lagrange 阶数整除形式要求 G 有限。", subgroup: "H 必须已验证为子群。" },
        closureChecks: ["确认 G 有限且 H<=G。", "计算陪集数并验证 |G|=[G:H]|H|。"],
        scenarioChecks: { nonexistenceByOrder: ["可用不整除排除子群或元素阶；不能用整除保证存在。"] },
    },
    // Sylow 定理给出 p-Sylow 子群存在、共轭性和个数同余条件。
    "sylow-theorems": {
        definitions: ["p-Sylow 子群是有限群中阶数达到 p-primary 部分最大值的 p-子群，Sylow 定理用它来分析有限群的局部结构。"],
        formulas: ["若 |G|=p^a m 且 p 不整除 m，则 p-Sylow 子群的阶为 p^a，个数记作 n_p。"],
        theorems: ["Sylow 第一定理：G 存在阶为 p^a 的 p-Sylow 子群。", "Sylow 第二定理：所有 p-Sylow 子群彼此共轭。", "Sylow 第三定理：n_p ≡ 1 mod p 且 n_p | m；若 n_p=1，则该 Sylow 子群正规。"],
        generalRequirements: ["必须正确分解 |G|=p^a m。", "必须同时使用同余条件和整除条件筛选 n_p。"],
        forbiddenErrors: ["【只用整除】只列 n_p|m 忘记 n_p≡1 mod p。", "【正规误判】存在 Sylow 子群不等于正规，唯一才正规。", "【素数幂错误】p^a 未取到 |G| 中 p 的最高幂。"],
        parameterConstraints: { groupOrder: "群必须有限且需分解素因子。", prime: "p 必须是素数。" },
        closureChecks: ["分解群阶。", "列出 n_p 的整除与同余候选。", "若唯一则推出正规，并说明结构后果。"],
        scenarioChecks: { simplicity: ["证明非单时寻找唯一 Sylow 子群或非平凡正规子群。"] },
    },
    // 中国剩余定理要求理想两两互素，结论是同构而非只是一组同余解。
    "chinese-remainder-theorem-ring": {
        definitions: ["环的中国剩余定理研究若干理想对应的商环如何通过自然映射拼成一个整体。"],
        formulas: ["若 I_i+I_j=R（i!=j），则 R/(cap I_i) ≅ product R/I_i；在两两互素时 cap I_i=product I_i。"],
        theorems: ["中国剩余定理：若 I_i+I_j=R（i!=j），则 R/(cap I_i) ≅ product R/I_i。", "整数同余版是 R=Z、I_i=(m_i) 的特例；要求模数两两互素。"],
        generalRequirements: ["必须验证理想两两互素。", "必须区分交理想和乘积理想，只有互素时可相等。"],
        forbiddenErrors: ["【互素遗漏】模数或理想不互素仍直接套 CRT。", "【交积混淆】未证明互素时把 cap I_i 写成 product I_i。", "【唯一性范围遗漏】整数解唯一性是模乘积意义下唯一。"],
        parameterConstraints: { comaximal: "理想必须两两互素 I_i+I_j=R。", uniqueness: "解的唯一性应在商环或模乘积意义下表述。" },
        closureChecks: ["验证两两互素。", "构造自然映射并说明核与像。", "给出同构或同余解并核对唯一性模数。"],
        scenarioChecks: { integerCongruences: ["整数同余组中先检查 gcd(m_i,m_j)=1。"] },
    },
    // Galois 对应反转包含关系，正规子群对应正规中间扩张。
    "galois-correspondence": {
        definitions: ["有限 Galois 扩张的基本定理描述中间域与子群之间的反包含对应，并把域扩张结构翻译成群论结构。"],
        formulas: ["中间域 E 对应 Gal(L/E)，子群 H 对应固定域 L^H；包含关系反转：E1⊂E2 对应 Gal(L/E2)⊂Gal(L/E1)。"],
        theorems: ["有限 Galois 扩张 L/K 的中间域与 Gal(L/K) 的子群一一对应，且对应关系反转包含。", "E/K 为 Galois 当且仅当 Gal(L/E) 是 Gal(L/K) 的正规子群；此时 Gal(E/K) ≅ Gal(L/K)/Gal(L/E)。"],
        generalRequirements: ["必须确认 L/K 是有限 Galois 扩张。", "必须注意中间域和子群的包含方向反转。"],
        forbiddenErrors: ["【Galois前提遗漏】非正规或不可分扩张直接使用完整 Galois 对应。", "【方向错误】中间域包含关系和子群包含关系同向写。", "【正规性遗漏】商 Galois 群需要对应子群正规。"],
        parameterConstraints: { extension: "标准基本定理要求有限 Galois 扩张。", normality: "中间扩张 Galois 等价于对应子群正规。" },
        closureChecks: ["验证扩张 Galois。", "列出中间域/子群对应。", "检查包含方向和正规性结论。"],
        scenarioChecks: { solvabilityByRadicals: ["讨论根式可解性时需将多项式分裂域的 Galois 群与可解群联系起来。"] },
    },
    // 有限交换群结构定理给出唯一分解，分解形式有不变因子分解和初等因子分解两种等价写法。
    "structure-theorem-finite-abelian-group": {
        definitions: ["有限交换群结构定理研究有限 Abel 群的分类问题，即它们能否拆成循环群直积以及这种拆分如何唯一刻画。"],
        formulas: ["初等因子分解：G ≅ Z_{p_1^{a_1}} × ... × Z_{p_k^{a_k}}，其中各 p_i^{a_i} 为初等因子；不变因子分解：G ≅ Z_{d_1} × ... × Z_{d_r}，其中 d_1 | d_2 | ... | d_r。"],
        theorems: ["有限交换群同构于若干个循环群的直积。", "这种分解可写成唯一的不变因子分解或唯一的初等因子分解。", "两种分解形式彼此等价。"],
        generalRequirements: ["必须确认群有限且交换。", "给出分解时必须选定一种规范形式（初等因子或不变因子）并保持唯一性。"],
        forbiddenErrors: ["【非交换误用】对非交换群直接声称满足有限交换群结构定理。", "【分解形式混淆】初等因子和不变因子不同时给出两种形式但不说明等价。", "【唯一性误判】把群元素集合写出了多种直积形式但未核对同构。"],
        parameterConstraints: { finiteness: "群必须有限。", commutativity: "群必须交换（Abel 群）。" },
        closureChecks: ["确认有限交换群。", "计算群阶的素因子分解。", "给出初等因子或不变因子分解并核对阶数。"],
        scenarioChecks: { enumerateGroups: ["枚举给定阶的交换群同构类时，按各素数幂次划分列出所有初等因子组合。"] },
    },
    // Jordan-Hölder 定理保证合成列因子集合与合成列选取无关，是可解群和单群理论的基础。
    "jordan-holder-theorem": {
        definitions: ["合成列是把群逐层细分成正规子群链的工具，每一层都尽量细到不能再分。"],
        formulas: ["若 G 有合成列，则可记录为一串单群商因子 G_{i+1}/G_i。"],
        theorems: ["Jordan-Hölder 定理说明：任意两条合成列的长度相同，且组成因子在同构意义下只差一个排列。", "因此群的组成因子多重集是群的不变量。"],
        generalRequirements: ["必须说明每个 G_{i+1}/G_i 是单群（不是任意正规子群商）。", "唯一性是因子集合意义下的，不是合成列本身唯一。"],
        forbiddenErrors: ["【合成列唯一性误读】把定理误解为合成列本身唯一而非因子集合唯一。", "【单群条件遗漏】合成列要求每个商为单群，普通正规列不满足。", "【无限群误用】无限群未必有合成列，不能无条件应用。"],
        parameterConstraints: { compositionSeries: "合成列要求每个商 G_{i+1}/G_i 为单群。", finiteness: "有限群保证合成列存在；无限群需另行验证。" },
        closureChecks: ["构造或指定合成列。", "验证每个商为单群。", "引用定理说明组成因子集合与选取无关。"],
        scenarioChecks: { solvableGroup: ["可解群的组成因子均为 Z_p；通过 Jordan-Hölder 可判断群是否可解。"] },
    },
    // 本原元定理依赖可分性和有限性，一般特征零域上总成立，正特征须验证可分性。
    "primitive-element-theorem": {
        definitions: ["本原元是能生成整个有限域扩张的单个元素；本原元定理研究有限扩张何时可以写成单扩张。"],
        formulas: ["若 [L:K] 有限且 L/K 可分，则存在 alpha in L 使 L=K(alpha)。"],
        theorems: ["本原元定理：有限可分域扩张 L/K 存在 alpha in L 使 L=K(alpha)。", "特征零域上的有限扩张都可分，因此都存在本原元。", "有限域上的有限扩张也存在本原元。"],
        generalRequirements: ["必须验证扩张有限且可分。", "本原元不唯一；只需证明存在，不需要给出所有本原元。"],
        forbiddenErrors: ["【可分性遗漏】正特征完全非可分扩张直接声称有本原元。", "【有限性遗漏】无限扩张未必有本原元。", "【唯一性误判】本原元不唯一，不能声称'唯一的本原元'。"],
        parameterConstraints: { separability: "扩张必须可分；特征零自动可分，正特征须验证。", finiteness: "扩张必须有限。" },
        closureChecks: ["确认有限可分扩张。", "构造或声明本原元存在。", "验证 K(alpha)=L（通常通过次数比较）。"],
        scenarioChecks: { characteristicZero: ["特征零有限扩张直接适用本原元定理，无需单独验证可分性。"], finiteField: ["有限域 F_{q^n}/F_q 的本原元是乘法群 F_{q^n}^* 的生成元，即乘法本原元。"] },
    },
    // Wedderburn-Artin 定理把半单 Artin 环唯一分解为除环上矩阵环的有限直积。
    "wedderburn-artin-theorem": {
        definitions: ["半单环是每个左（或右）理想都是可直和补的环，等价地作为自身左模是单模的有限直和；Wedderburn-Artin 定理描述这类环的完全结构。"],
        formulas: ["R ≅ M_{n_1}(D_1) × ... × M_{n_r}(D_r)，其中每个 D_i 为除环，n_i 为正整数，分量数 r 等于 R 的非同构单左模个数。"],
        theorems: ["Wedderburn-Artin 定理：每个半单环（等价地：左 Artin 且 Jacobson 根为零的环）同构于有限个除环上的矩阵环的直积。", "分解中的 (n_i, D_i) 对在同构和排列意义下唯一。", "推论（Wedderburn 小定理）：有限除环必为域，因此有限半单环是有限域上矩阵环的直积。"],
        generalRequirements: ["必须先验证环是半单的（或左 Artin 且 J(R)=0）。", "结论中的每个直积分量都必须写为 M_n(D) 形式且说明 D 是除环。"],
        forbiddenErrors: ["【半单性遗漏】未验证 R 半单直接套用矩阵环分解。", "【除环误写为域】非交换半单情形错把每个 D_i 当作域。", "【唯一性错解】把 (n_i, D_i) 的排列不同视为不同分解。", "【无限维滥用】非 Artin 无限维代数直接套用 Wedderburn-Artin。"],
        parameterConstraints: { semisimplicity: "R 必须半单，或等价地左 Artin 且 Jacobson 根 J(R)=0。", divisionRing: "每个直积分量 M_{n_i}(D_i) 的 D_i 必须是除环，不必是交换的。" },
        closureChecks: ["验证 R 半单（或左 Artin 且 J(R)=0）。", "分解 R 为极小左理想的直和以定位单模。", "写出 R ≅ ∏ M_{n_i}(D_i) 并核对分量唯一性。"],
        scenarioChecks: { finiteGroupAlgebra: ["特征不整除 |G| 时 k[G] 是半单代数；Wedderburn-Artin 分解给出 k[G] ≅ ∏ M_{n_i}(D_i)，代数闭时 D_i=k 且 sum n_i^2=|G|。"], finiteSimpleAlgebra: ["有限维单代数是单个 M_n(D) 分量；这类中心单代数由 Brauer 群刻画。"] },
    },
    // 戴德金整环是一维正规 Noetherian 整环，其非零真理想可唯一分解为素理想乘积。
    "dedekind-domain": {
        definitions: ["戴德金整环是 Noetherian、整闭且 Krull 维数不超过 1 的整环；直观上它是一维正规环，代数数论中的整数环是典型例子。"],
        formulas: ["非零真理想的分解：I = P_1^{a_1} ... P_r^{a_r}，各 P_i 为不同的非零素理想，a_i 为正整数且分解在因子顺序意义下唯一。", "分式理想集合在乘法下构成群 I(R)，主分式理想构成子群 P(R)，理想类群定义为 Cl(R)=I(R)/P(R)。"],
        theorems: ["戴德金整环的等价刻画：(a) Noetherian、整闭、Krull 维数 ≤ 1；(b) 每个非零真理想有唯一素理想因式分解；(c) 每个非零分式理想可逆。", "戴德金整环的局部化在每个非零素理想处是离散赋值环（DVR）。", "戴德金整环是 PID 当且仅当其理想类群 Cl(R) 平凡。", "代数数域 K 的整数环 O_K 总是戴德金整环。"],
        generalRequirements: ["必须验证三条件：Noetherian、整闭、维数不超过 1，或直接使用理想唯一素分解性质。", "必须区分理想乘积与理想相加；素理想分解针对乘积。"],
        forbiddenErrors: ["【维数超限】把二维正规 Noetherian 环（如多项式环 k[x,y]）当作戴德金整环。", "【整闭性遗漏】仅验证 Noetherian 而未证明整闭。", "【素分解与因子分解混淆】戴德金整环的元素未必唯一分解为素元乘积；唯一分解是针对理想的。", "【类群误判】Cl(R) 非平凡时仍声称 R 是 PID。"],
        parameterConstraints: { noetherianity: "R 必须是 Noetherian 整环。", integralClosure: "R 必须在其分式域中整闭。", krullDimension: "R 的 Krull 维数不超过 1（每个非零素理想都是极大理想）。" },
        closureChecks: ["验证 R 是 Noetherian 整环。", "验证 R 在分式域中整闭。", "验证每个非零素理想是极大理想，或等价地使用理想唯一素分解。"],
        scenarioChecks: { numberFieldIntegers: ["证明代数数域 K 的整数环 O_K 是戴德金整环并使用素理想唯一分解刻画理想结构。"], classGroup: ["讨论理想类群 Cl(R) 与主理想化障碍；PID 等价于 Cl(R)=1。"], localization: ["在非零素理想 P 处局部化得到 DVR R_P，用其赋值分析理想。"] },
    },
    // Schur 引理是群表示论的基本工具，刻画不可约表示之间的交换子代数为除代数。
    "schur-lemma-representation": {
        definitions: ["群表示论中的 Schur 引理研究不可约表示之间的 G-等变映射结构，它是构造和分类表示的核心工具。"],
        formulas: ["若 phi: V -> W 是不可约表示间的 G-等变映射，则 phi=0 或 phi 是同构。", "当 V=W 且基域 k 代数闭时，任何 G-等变自同态 phi 皆为 phi = lambda·id，某 lambda in k。"],
        theorems: ["Schur 引理：设 (rho, V) 和 (sigma, W) 为群 G 在域 k 上的不可约表示，若 phi: V -> W 满足 phi rho(g) = sigma(g) phi 对所有 g in G 成立，则 phi=0 或 phi 是同构。", "推论一：不可约表示的 G-等变自同态代数 End_G(V) 是 k 上的除代数。", "推论二：若 k 代数闭且 dim V < infty，则 End_G(V) ≅ k，且 V 的中心元素在 V 上按标量作用；从而交换群的所有不可约复表示都是一维的。"],
        generalRequirements: ["必须先说明两侧表示是不可约的。", "必须给出明确的 G-等变条件 phi rho(g)=sigma(g) phi。"],
        forbiddenErrors: ["【不可约性遗漏】对可约或不完全可约的表示直接套 Schur 引理。", "【代数闭遗漏】非代数闭域上直接断言 End_G(V) ≅ k 或标量作用。", "【等变性遗漏】把普通线性映射当作 G-等变映射使用 Schur 引理。", "【标量断言错误】在无限维不可约表示上未讨论收敛就断言标量作用（应指明有限维前提）。"],
        parameterConstraints: { irreducibility: "两侧表示 V, W 都必须不可约。", equivariance: "映射 phi 必须与群作用交换，即 phi rho(g)=sigma(g) phi。", baseField: "标量作用推论要求 k 代数闭且 dim V 有限。" },
        closureChecks: ["确认表示 V, W 不可约。", "验证 phi 是 G-等变的。", "结论 phi=0 或 phi 为同构；同表示且代数闭有限维时进一步得 phi 为标量。"],
        scenarioChecks: { finiteAbelianGroup: ["交换群的复不可约表示皆为一维；用 Schur 引理证明特征标构成完备正交系。"], characterTheory: ["利用 Schur 引理证明不可约特征标之间的正交关系。"], commutingOperator: ["在有限维复表示上找到与所有 rho(g) 交换的算子，则该算子在每个不可约分量上按标量作用。"] },
    },
    // Maschke 定理给出有限群在特征不整除群阶时的复完全可约性，是有限群表示论的基石。
    "maschke-theorem": {
        definitions: ["有限群表示论中的 Maschke 定理研究何时每个表示都可分解为不可约子表示的直和，即群代数 k[G] 何时是半单代数。"],
        formulas: ["若 G 有限且 char(k) 不整除 |G|，则任意 G-不变子空间 W ⊂ V 都存在 G-不变补 W'，使 V = W ⊕ W'；此补可由平均投影子 P=(1/|G|) sum_{g in G} g P_0 g^{-1} 得到。"],
        theorems: ["Maschke 定理：设 G 是有限群，k 是域，且 char(k) 不整除 |G|。则每个有限维 k[G]-模都是半单的（完全可约）。", "等价形式：在同一条件下 k[G] 是半单代数；结合 Wedderburn-Artin 可得 k[G] ≅ ∏ M_{n_i}(D_i)。", "反例：char(k) | |G| 时（模表示论情形），k[G] 一般不半单，例如 F_p[Z/pZ] 有不可裂表示。"],
        generalRequirements: ["必须验证 G 有限。", "必须验证基域特征满足 char(k) ∤ |G|（特征零总满足）。"],
        forbiddenErrors: ["【特征条件遗漏】对模表示（char(k)|G|）情形直接声称完全可约。", "【无限群误用】对无限群直接套 Maschke 定理。", "【平均投影非法】特征 p 整除 |G| 时使用 1/|G| 平均，操作在 k 中不可逆导致构造失败。", "【半单与不可约混淆】断言每个表示都不可约，实际 Maschke 只保证分解为不可约的直和。"],
        parameterConstraints: { finiteness: "群 G 必须有限。", characteristic: "基域特征满足 char(k) ∤ |G|；特征零情形自动满足。" },
        closureChecks: ["验证 G 有限。", "验证 char(k) 不整除 |G|。", "对给定 G-不变子空间构造 G-不变补，或直接引用 k[G] 半单得到分解。"],
        scenarioChecks: { characteristicZeroComplex: ["复表示论中 Maschke 定理自动成立，结合 Wedderburn-Artin 有 C[G] ≅ ∏ M_{n_i}(C) 且 sum n_i^2=|G|。"], modularRepresentation: ["char(k) | |G| 属于模表示论，需用 Brauer 特征标等工具，Maschke 定理不再成立。"], invariantInnerProduct: ["复表示上通过对任意内积按群平均，构造 G-不变内积，从而将补空间取为正交补。"] },
    },
    // Nakayama 引理在局部环或 Jacobson 根条件下让「模 mod J 是零」升级为「模本身是零」，是有限生成模处理的基石。
    "nakayama-lemma": {
        definitions: ["Nakayama 引理研究有限生成模 M 与理想 I（多为 Jacobson 根 J(R) 或局部环极大理想 m）之间的关系，用以在 M/IM=0 时推出关于 M 的结论。"],
        formulas: ["经典形式：设 R 交换环，M 为有限生成 R-模，I ⊆ J(R)，若 IM=M，则 M=0。", "局部环形式：R 为局部环、极大理想 m、剩余域 k=R/m，则 M=mM 蕴含 M=0；从而 M/mM 的 k-基底提升为 M 的极小生成元集。", "行列式技巧：若 phi: M -> M 是 R-线性且 phi(M) ⊆ IM，则存在 a_i in I 使 phi^n + a_1 phi^{n-1} + ... + a_n·id = 0。"],
        theorems: ["Nakayama 引理（Nakayama-Azumaya-Krull）：R 交换环，M 有限生成 R-模，I 为 R 的理想且 I ⊆ J(R)；若 IM=M，则 M=0。", "推论一：若 N ⊆ M 且 M=N+IM，I ⊆ J(R)，M 有限生成，则 M=N。", "推论二：局部环 (R,m,k) 上有限生成 M 的极小生成元数 = dim_k(M/mM)。", "推论三：局部环上有限生成投射模是自由模（进而 Serre 猜想在局部情形的初步）。"],
        generalRequirements: ["必须验证 M 是有限生成的（无限生成情形反例众多）。", "必须验证 I ⊆ J(R)，或直接在局部环上取 I=m。"],
        forbiddenErrors: ["【有限生成遗漏】对无限生成模直接套 Nakayama（例：R=Z_(p)，M=Q，则 pM=M 但 M≠0）。", "【Jacobson 根条件遗漏】任取普通理想 I 直接套用，未验证 I ⊆ J(R)。", "【方向反用】把 M=0 推出 IM=M（顺序错误）。", "【极小生成元数误算】用 M 中任意生成元集大小代替 dim_k(M/mM)。"],
        parameterConstraints: { finitelyGenerated: "M 必须是有限生成 R-模。", jacobsonRadical: "理想 I 必须包含在 Jacobson 根 J(R) 中；局部环上取 I=m 自动满足。", commutativity: "标准形式在交换环上叙述；非交换情形需替换为左/右模并保留 I ⊆ J(R)。" },
        closureChecks: ["验证 M 有限生成。", "验证 I ⊆ J(R) 或工作在局部环上取 I=m。", "由 IM=M 或 M=N+IM 得到 M=0 或 M=N 的结论。"],
        scenarioChecks: { localRing: ["局部环 (R,m,k) 上通过 M/mM 计算极小生成元数，并把生成元提升回 M。"], minimalGenerators: ["求有限生成模的极小生成元集时，先降到剩余域向量空间取基再提升。"], projectiveOverLocal: ["证明局部环上有限生成投射模自由：先在 M/mM 取基再由 Nakayama 得同构。"] },
    },
    // Burnside p^a q^b 定理是特征标理论的经典应用，说明仅有两个素因子的有限群必可解。
    "burnside-p-a-q-b-theorem": {
        definitions: ["Burnside p^a q^b 定理研究群阶素因子个数与可解性的关系，是特征标理论早期最具代表性的应用。"],
        formulas: ["若 |G|=p^a q^b，其中 p, q 为素数且 a, b ≥ 0，则 G 可解。", "特别地：|G|=p^a 时 G 幂零；|G|=p^a q^b 时 G 至少可解。"],
        theorems: ["Burnside 定理：p, q 为素数，若 |G|=p^a q^b，则 G 是可解群。", "证明关键：使用复特征标和代数整数论证 G 存在非平凡正规子群，再归纳。", "推论：三个不同素因子是有限群不可解（非可解单群）出现的最小规模，如 |A_5|=60=2^2·3·5。"],
        generalRequirements: ["必须验证 |G| 只含至多两个不同素因子。", "结论只是可解性，不是幂零性或交换性。"],
        forbiddenErrors: ["【素因子个数越界】把三个或以上素因子的群直接套用 p^a q^b 定理。", "【结论强化】由可解直接推出交换或幂零。", "【无限群误用】对无限群直接使用该定理。", "【逆命题误用】由 G 可解反推出 |G| 只有两个素因子。"],
        parameterConstraints: { finiteness: "群 G 必须是有限群。", primeFactors: "|G| 的素因子集合基数不超过 2。" },
        closureChecks: ["分解 |G| 并核对素因子个数不超过 2。", "引用 Burnside 定理得到可解性。", "如需具体合成因子，构造合成列并检验每个因子为素阶循环群。"],
        scenarioChecks: { threePrimeFactors: ["|G| 有三个素因子时不能用 Burnside p^a q^b 定理，需另做分析（例如 |A_5|=60 是不可解单群）。"], nilpotencyVsSolvability: ["|G|=p^a 时 G 幂零；|G|=p^a q^b 一般只能保证可解，不必幂零。"], compositionFactors: ["可解群的组成因子均为素阶循环群 Z_p；通过合成列具体化 Burnside 结论。"] },
    },
    // Frobenius 互反律给出诱导表示与限制表示作为函子的伴随关系，是表示论核心工具。
    "frobenius-reciprocity": {
        definitions: ["Frobenius 互反律研究群 G 与其子群 H 之间的诱导表示 Ind_H^G 与限制表示 Res_H^G 作为函子的关系，是表示论中的伴随原理。"],
        formulas: ["Hom 形式：Hom_G(Ind_H^G V, W) ≅ Hom_H(V, Res_H^G W)。", "特征标形式（[G:H] 有限、复表示）：<Ind_H^G chi, psi>_G = <chi, Res_H^G psi>_H，其中 chi 为 H 的特征标，psi 为 G 的特征标。", "对偶形式（有限群、代数闭且特征不整除 |G|）：Hom_G(W, Ind_H^G V) ≅ Hom_H(Res_H^G W, V)（半单情形下 Ind 与 Res 互为双侧伴随）。"],
        theorems: ["Frobenius 互反律：诱导函子 Ind_H^G 与限制函子 Res_H^G 是伴随的，Hom_G(Ind_H^G V, W) ≅ Hom_H(V, Res_H^G W) 自然同构。", "在有限群、特征零（或 char∤|G|）复表示范畴中，Ind_H^G 与 Res_H^G 互为双侧伴随，特征标内积也满足互反等式。", "推论：不可约表示的诱导分解可通过限制分解读出重数；由此 (Ind_H^G chi) 中出现的 G 不可约特征标 psi 的重数等于 chi 在 Res_H^G psi 中的重数。"],
        generalRequirements: ["必须明确子群 H ≤ G 及诱导/限制的对象。", "使用特征标形式时必须验证 [G:H] 有限（或有限群）与半单前提。"],
        forbiddenErrors: ["【子群前提遗漏】把 H 当作 G 的任意子集而非子群使用互反律。", "【Hom 方向搞反】把 Hom_G(Ind V, W) 写成 Hom_H(W, V) 或其它错误对偶。", "【半单前提遗漏】在模表示（char(k)| |G|）情形直接使用双侧伴随和特征标内积互反。", "【指数无限滥用】[G:H]=∞ 时用有限求和特征标公式。"],
        parameterConstraints: { subgroup: "H 必须是 G 的子群。", indexOrFiniteness: "特征标形式需要 [G:H] 有限；一般 Hom 形式的伴随本身仅需 Ind 良好定义。", semisimplicity: "特征标内积互反式需在半单表示范畴中使用（有限群 + char(k) ∤ |G|）。" },
        closureChecks: ["确认 H ≤ G 并写出 Ind_H^G 与 Res_H^G。", "写出 Hom 同构或特征标内积等式。", "根据分解需要读出重数并核对总维数一致。"],
        scenarioChecks: { characterDecomposition: ["用特征标形式的 Frobenius 互反律计算 Ind_H^G chi 在 G 不可约表示中的重数。"], mackeyRestriction: ["与 Mackey 分解定理配合分析双陪集分解 H\\G/H 上的诱导-限制结构。"], subgroupRepresentation: ["从 G 的不可约表示读出限制到 H 后的分解，进而推知 H 表示的结构。"] },
    },
    // Krull-Schmidt 定理保证在合适有限条件下模（或群）的不可分解直和分解在同构与顺序意义下唯一。
    "krull-schmidt-theorem": {
        definitions: ["Krull-Schmidt 定理研究何时一个模（或群）可以写成不可分解子对象的直和，以及这种分解是否本质上唯一。"],
        formulas: ["若 M = M_1 ⊕ ... ⊕ M_r = N_1 ⊕ ... ⊕ N_s 且每个 M_i, N_j 皆不可分解，则 r=s 且存在排列 sigma 使 M_i ≅ N_{sigma(i)}。", "关键引理：Fitting 引理——对满足升降链条件的模 M 上的自同态 f，M = ker(f^n) ⊕ im(f^n)（n 足够大）。"],
        theorems: ["Krull-Schmidt 定理（模版本）：满足升降链条件的模（例如有限生成模在 Artin 环上，或有限维模）具有直和不可分解分量分解，且分解在同构和排列意义下唯一。", "群版本：有限群（或满足升降链条件的群）的直积不可分解分解在同构与排列意义下唯一。", "算子刻画：Krull-Schmidt 成立当且仅当每个不可分解分量的自同态环是局部环。"],
        generalRequirements: ["必须验证升降链条件或有限维/有限性前提。", "唯一性针对不可分解分量集合，不针对分解本身的具体子模选择。"],
        forbiddenErrors: ["【前提遗漏】对无有限性或无升降链条件的模直接套用 Krull-Schmidt。", "【子模唯一性错解】把子模本身唯一化，实际是不可分解分量在同构意义下唯一。", "【与 Jordan-Hölder 混用】把不可分解直和分量与合成因子（单模）混淆，两者仅在半单情形一致。", "【局部性反例】对自同态环不是局部环的分量情形声称唯一分解。"],
        parameterConstraints: { chainConditions: "模需满足升降链条件（例如 Artin+Noether，或有限长度、有限维）。", indecomposableEndomorphism: "每个不可分解分量的自同态环需为局部环，Krull-Schmidt 才成立。" },
        closureChecks: ["验证升降链条件或有限长度前提。", "分解为不可分解直和分量。", "核对每个不可分解分量的自同态环是局部环，或直接引用有限长度模的 Krull-Schmidt。"],
        scenarioChecks: { finiteDimensionalAlgebra: ["有限维代数上的有限维模自动满足升降链条件，Krull-Schmidt 直接适用。"], finiteAbelianGroup: ["有限交换群的循环分量分解由 Krull-Schmidt 保证在同构意义下唯一，与有限交换群结构定理一致。"], nonUniqueWithoutChain: ["无升降链条件时可能出现同一模多种不等价的不可分解分解，需另加限制。"] },
    },
};
