import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数论-代数数论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMBER_THEORY_ALGEBRAIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Dedekind 整环中非零理想唯一分解为素理想。
    "dedekind-ideal-unique-factorization": {
        id: "dedekind-ideal-unique-factorization", l2Key: "number-theory-algebraic", name: "Dedekind 整环理想唯一分解", kind: "theorem",
        aliases: ["Dedekind整环理想分解", "理想唯一分解", "素理想分解", "分式理想群", "Dedekind domain ideal factorization"],
    },
    // Dedekind-Kummer 定理：由极小多项式模 p 分解读出素理想分解。
    "dedekind-kummer-factorization": {
        id: "dedekind-kummer-factorization", l2Key: "number-theory-algebraic", name: "Dedekind-Kummer 分解定理", kind: "theorem",
        aliases: ["Dedekind-Kummer定理", "Dedekind判别法", "素理想分解算法", "Kummer factorization"],
    },
    // 分歧基本恒等式 ∑ e_i f_i = n 与判别式判据。
    "ramification-fundamental-identity": {
        id: "ramification-fundamental-identity", l2Key: "number-theory-algebraic", name: "分歧基本恒等式与判别式判据", kind: "criterion",
        aliases: ["分歧指数", "惯性次数", "分歧判据", "判别式", "e f 恒等式"],
    },
    // Minkowski 界：类群代表元的范数上界。
    "minkowski-bound": {
        id: "minkowski-bound", l2Key: "number-theory-algebraic", name: "Minkowski 界与类数计算", kind: "theorem",
        aliases: ["Minkowski界", "Minkowski bound", "类数计算", "理想类群", "几何数论格点定理"],
    },
    // Dirichlet 单位定理：单位群的秩为 r + s - 1。
    "dirichlet-unit-theorem": {
        id: "dirichlet-unit-theorem", l2Key: "number-theory-algebraic", name: "Dirichlet 单位定理", kind: "theorem",
        aliases: ["Dirichlet单位定理", "单位群", "基本单位", "调节子", "unit theorem"],
    },
    // Galois 扩张中的分解群、惯性群与 Frobenius 元。
    "decomposition-inertia-group": {
        id: "decomposition-inertia-group", l2Key: "number-theory-algebraic", name: "分解群、惯性群与 Frobenius 元", kind: "object",
        aliases: ["分解群", "惯性群", "Frobenius元", "Hilbert分歧理论", "decomposition group"],
    },
    // 解析类数公式：Dedekind zeta 在 s = 1 的留数。
    "analytic-class-number-formula": {
        id: "analytic-class-number-formula", l2Key: "number-theory-algebraic", name: "解析类数公式", kind: "formula",
        aliases: ["解析类数公式", "class number formula", "Dedekind zeta函数", "留数公式", "调节子与类数"],
    },
    // 类域论核心：Artin 互反律与 Hilbert 类域。
    "artin-reciprocity-class-field": {
        id: "artin-reciprocity-class-field", l2Key: "number-theory-algebraic", name: "Artin 互反律与 Hilbert 类域", kind: "theorem",
        aliases: ["Artin互反律", "类域论", "Hilbert类域", "ray class field", "Artin映射"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMBER_THEORY_ALGEBRAIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // Dedekind 整环：非零理想唯一分解为素理想，分式理想构成群。
    "dedekind-ideal-unique-factorization": {
        definitions: ["Dedekind 整环是 Noether、整闭且维数 1（每个非零素理想极大）的整环；数域 K 的代数整数环 O_K 是标准例子，其非零理想在乘法下具有唯一素理想分解。"],
        formulas: ["唯一分解：任意非零理想 a ⊂ O_K 可写成 a = ∏_i P_i^{e_i}，分解在重排下唯一。", "理想范数的乘性：N(ab) = N(a)N(b)，且 N(P) = p^f 当 P 位于素数 p 上、剩余次数为 f。", "分式理想群：非零分式理想在乘法下构成自由 Abel 群（以素理想为基），类群 Cl(K) = I(K)/P(K)。", "整除即包含：a | b ⇔ b ⊆ a。"],
        theorems: ["Dedekind 定理：Dedekind 整环中非零理想唯一分解为素理想幂；等价地每个非零分式理想可逆。", "O_K 是 Dedekind 整环（Noether + 整闭 + 维数 1），但一般不是唯一分解整环（UFD）。", "O_K 是 UFD ⇔ O_K 是 PID ⇔ 类数 h_K = 1；元素层面的分解唯一性由理想层面的唯一性替代。"],
        generalRequirements: ["必须区分「元素分解唯一」与「理想分解唯一」，后者才在一般 O_K 中成立。", "使用理想范数与包含关系时必须声明整环为 Dedekind（或所讨论环为 O_K）。"],
        forbiddenErrors: ["【UFD 误设】在 h_K > 1 的数域（如 Z[√-5]）中断言元素分解唯一。", "【整除方向反用】把 a | b 写成 a ⊆ b。", "【范数乘性滥用】对非理想的集合或非 Dedekind 环使用 N(ab) = N(a)N(b)。", "【整闭性遗漏】把 Z[α]（α 非整基生成元）当作 O_K 使用，破坏 Dedekind 性质与分解结论。"],
        parameterConstraints: { ringType: "环必须是 Dedekind 整环（典型取 O_K）。", ideals: "分解与范数乘性针对非零理想。", integralClosure: "Z[α] 只有在等于 O_K（即指标 [O_K : Z[α]] = 1）时可直接使用。" },
        closureChecks: ["确认所用环是 O_K 或已验证的 Dedekind 整环。", "给出理想的素理想分解并用范数乘性核对总范数。", "如涉及元素分解唯一性，先核对类数是否为 1。"],
        scenarioChecks: { quadraticFieldExample: ["在 Z[√-5] 中 6 = 2·3 = (1+√-5)(1-√-5) 说明元素分解不唯一而理想分解唯一。"], normEquation: ["解 N(x) = m 型范数方程时先分解理想 (m) 再筛选主理想。"], classNumberOne: ["h_K = 1 时可回到元素层面做唯一分解论证。"] },
    },
    // Dedekind-Kummer：p 在 O_K 中的分解由 f(x) mod p 的分解读出。
    "dedekind-kummer-factorization": {
        definitions: ["Dedekind-Kummer 定理把素数 p 在 O_K = Z[α] 中的素理想分解归约为极小多项式 f 在 F_p 上的因式分解，是素理想分解的标准计算工具。"],
        formulas: ["设 O_K = Z[α]，f 为 α 的极小多项式，f(x) ≡ ∏_i g_i(x)^{e_i} (mod p)（g_i 在 F_p[x] 中不可约互异），则 (p) = ∏_i P_i^{e_i}，P_i = (p, g_i(α))。", "剩余次数：f_i = deg g_i；分歧指数：e_i 即上式重数；且 ∑_i e_i f_i = n = [K : Q]。", "二次域 K = Q(√d)（d 无平方因子，判别式 D）：p 分裂 ⇔ (D/p) = 1，惰性 ⇔ (D/p) = -1，分歧 ⇔ p | D。"],
        theorems: ["Dedekind-Kummer 定理：当 p ∤ [O_K : Z[α]] 时上述对应成立；p 整除指标时该多项式分解可能给出错误结果，需换生成元或用 Round 2/Montes 等算法。", "p 分歧 ⇔ f mod p 有重因子 ⇔ p | disc(f)（在 p ∤ 指标时 ⇔ p | d_K）。", "推论：分裂类型完全由 p 在 f mod p 的分解型决定，且分解型在 Galois 情形下所有 e_i、f_i 相等。"],
        generalRequirements: ["使用前必须验证 p ∤ [O_K : Z[α]]（或说明 O_K = Z[α]）。", "必须给出 f mod p 的完整不可约分解并逐项写出 P_i = (p, g_i(α))。"],
        forbiddenErrors: ["【指标条件缺失】p 整除 [O_K : Z[α]] 时仍套用定理（经典反例：Dedekind 的 x^3 - x^2 - 2x - 8 与 p = 2）。", "【环误认】把 Z[α] 当作 O_K 而未验证整基。", "【e 与 f 互换】把 deg g_i 当成分歧指数、重数当成剩余次数。", "【恒等式失衡】给出的分解不满足 ∑ e_i f_i = n。"],
        parameterConstraints: { indexCondition: "要求 p ∤ [O_K : Z[α]]。", minimalPolynomial: "f 必须是 α 在 Q 上的首一整系数极小多项式。", degreeBalance: "分解结果必须满足 ∑_i e_i f_i = [K : Q]。" },
        closureChecks: ["计算 disc(f) 与 d_K，确认指标条件。", "在 F_p[x] 中完整分解 f 并写出各 P_i。", "用 ∑ e_i f_i = n 与 N(P_i) = p^{f_i} 双向核验。"],
        scenarioChecks: { quadraticSplitting: ["二次域用 Legendre 符号 (D/p) 直接判定分裂/惰性/分歧。"], cyclotomicField: ["Q(ζ_m) 中 p ∤ m 时 f = ord_p 的剩余次数由 p 在 (Z/m)^* 中的阶给出。"], badPrimeHandling: ["p 整除指标时改用其他生成元、局部化或 Round 2 算法求分解。"] },
    },
    // 分歧基本恒等式：∑ e_i f_i = n，分歧 ⇔ p | d_K。
    "ramification-fundamental-identity": {
        definitions: ["该判据研究素数 p 在扩张 L/K 中的分解形态：分歧指数 e（素理想幂次）、剩余次数 f（剩余域扩张次数）与素理想个数 g 之间的基本恒等式，以及分歧与判别式的关系。"],
        formulas: ["基本恒等式：pO_L = ∏_{i=1}^{g} P_i^{e_i}，∑_{i=1}^{g} e_i f_i = n = [L : K]。", "Galois 情形：所有 e_i = e、f_i = f 相等，故 efg = n。", "分歧判据：p 在 L/Q 中分歧 ⇔ p | d_L（域判别式）。", "驯分歧/野分歧：e_i 与剩余特征 p 互素为驯分歧，p | e_i 为野分歧；不同分歧指数 v_P(D_{L/K}) = e - 1（驯）或 ≥ e（野）。"],
        theorems: ["基本恒等式（Dedekind）：∑ e_i f_i = [L : K] 恒成立，来自 O_L/pO_L 作为 O_K/p-代数的维数计算。", "Galois 扩张中 Gal(L/K) 传递作用于 {P_i}，故 e、f 与分解群阶数一致，且 |D_{P}| = ef、|I_P| = e。", "Dedekind 判别式定理：p 分歧 ⇔ p | d_L；驯分歧时 v_P(D_{L/K}) = e_P - 1，野分歧时严格更大。"],
        generalRequirements: ["列出分解形态必须同时给出全部 e_i、f_i 并验证 ∑ e_i f_i = n。", "断言 efg = n 前必须确认扩张是 Galois。"],
        forbiddenErrors: ["【非 Galois 误用】对非 Galois 扩张断言所有 e_i、f_i 相等或写 efg = n。", "【恒等式违背】给出的分解使 ∑ e_i f_i ≠ [L : K]。", "【判别式混淆】用 disc(f)（多项式判别式）替代 d_L 判断分歧而忽略指标平方因子。", "【野驯不分】在 p | e 的野分歧情形套用 v_P(D) = e - 1。"],
        parameterConstraints: { extensionDegree: "n = [L : K] 必须与 ∑ e_i f_i 一致。", galoisAssumption: "efg = n 仅在 Galois 扩张成立。", discriminantRelation: "disc(f) = [O_K : Z[α]]^2 · d_K，判断分歧须使用 d_K。" },
        closureChecks: ["写出全部素理想及其 e_i、f_i 并核验恒等式。", "用 d_L 判定分歧素数集合。", "对分歧素数区分驯/野并给出相应的不同指数估计。"],
        scenarioChecks: { totallyRamified: ["e = n、g = f = 1 的完全分歧情形常由 Eisenstein 多项式给出。"], inertPrime: ["f = n、e = g = 1 时剩余域为 F_{p^n}，可用于构造有限域扩张。"], wildRamification: ["p | e 时（如 Q(ζ_p)/Q 在 p 处）必须用高阶分歧群分析不同指数。"] },
    },
    // Minkowski 界：每个理想类含范数不超过界的整理想代表。
    "minkowski-bound": {
        definitions: ["Minkowski 界用几何数论（格点凸体定理）给出每个理想类中最小理想范数的上界，从而把类群计算化为有限多个小范数素理想的关系搜索。"],
        formulas: ["Minkowski 界：每个理想类含整理想 a 使 N(a) ≤ M_K = (4/π)^s (n!/n^n) √|d_K|，其中 n = [K : Q]，s 为复嵌入对数。", "嵌入计数：n = r + 2s，r 为实嵌入数，s 为共轭复嵌入对数。", "Minkowski 格点定理：对称凸体体积 > 2^n · covol(Λ) 时含非零格点，是该界的来源。", "判别式下界推论：|d_K| 随 n 增长（Minkowski 界 ≥ 1 迫使 √|d_K| 有下界）。"],
        theorems: ["Minkowski 定理（理想类版本）：每个理想类可由范数 ≤ M_K 的整理想代表，故类群由范数 ≤ M_K 的素理想生成。", "类数有限性：Cl(K) 是有限群，其阶 h_K 由上述有限生成集合与主理想关系确定。", "推论：M_K < 2 时所有素理想代表均为主理想，故 h_K = 1（用于快速判定小判别式域类数为 1）。"],
        generalRequirements: ["必须先算出 n、r、s 与域判别式 d_K 再代入界。", "宣称 h_K 的具体值必须列出范数 ≤ M_K 的所有素理想并给出主理想关系（范数方程）。"],
        forbiddenErrors: ["【嵌入计数错误】把 s 取成复嵌入总数而非共轭对数，或漏掉 n = r + 2s 的核验。", "【判别式误用】用多项式判别式 disc(f) 替代 d_K 代入界。", "【生成集不完整】只检查部分小素数就断言类群平凡。", "【关系缺失】找到生成元后未验证主理想关系（未解范数方程）就给出 h_K。"],
        parameterConstraints: { fieldData: "需给出 n、r、s 与 d_K（域判别式）。", boundUsage: "界给出的是理想类代表的范数上界，不是元素大小上界。", primeEnumeration: "必须枚举所有范数 ≤ M_K 的素理想（即所有 p ≤ M_K 的分解）。" },
        closureChecks: ["计算 M_K 并列出 p ≤ M_K 的素数分解。", "对每个小范数素理想判定是否主理想（解范数方程）。", "由生成元与关系确定 Cl(K) 的结构与 h_K。"],
        scenarioChecks: { imaginaryQuadratic: ["虚二次域 r = 0、s = 1，界较小，常可直接得出 h_K 及类群结构。"], classNumberOneProof: ["M_K < 2 时立即得 h_K = 1；否则逐素理想核验主性。"], discriminantLowerBound: ["用 M_K ≥ 1 反推 |d_K| 随次数增长的下界。"] },
    },
    // Dirichlet 单位定理：O_K^* ≅ μ_K × Z^{r+s-1}。
    "dirichlet-unit-theorem": {
        definitions: ["Dirichlet 单位定理刻画代数整数环单位群的结构：单位由有限的单位根部分与秩 r + s - 1 的自由部分构成，自由部分的共体积由调节子度量。"],
        formulas: ["结构式：O_K^* ≅ μ_K × Z^{r+s-1}，μ_K 为 K 中单位根的有限循环群，r + 2s = n。", "单位判据：α ∈ O_K 是单位 ⇔ N_{K/Q}(α) = ±1。", "对数嵌入：L(α) = (log|σ_1(α)|, ..., log|σ_r(α)|, 2log|σ_{r+1}(α)|, ...)，像是秩 r + s - 1 的格（落在坐标和为 0 的超平面）。", "调节子 R_K = |det| 由基本单位的对数嵌入矩阵去掉一列得到。"],
        theorems: ["Dirichlet 单位定理：O_K^* 的自由秩恰为 r + s - 1。", "特例：虚二次域（r = 0, s = 1）秩为 0，单位群只含单位根（一般为 ±1，Q(i)、Q(ζ_3) 例外）；实二次域（r = 2, s = 0）秩为 1，由基本单位 ε 生成，与 Pell 方程解一致。", "调节子出现在解析类数公式中，与 h_K 共同控制 Dedekind zeta 在 s = 1 的留数。"],
        generalRequirements: ["必须先确定 r、s 才能给出单位群的秩。", "宣称某单位为基本单位必须论证其为最小（例如通过连分数或范数搜索的极小性）。"],
        forbiddenErrors: ["【秩公式错算】写成 r + s 或 r + 2s - 1。", "【单位判据误用】用 N(α) = 1 作为单位的充要条件而忽略 -1。", "【基本单位未验极小】任取一个范数 ±1 的元素当基本单位。", "【虚二次域误设】断言虚二次域有无限阶单位。"],
        parameterConstraints: { embeddingCounts: "需给出实嵌入数 r 与复嵌入对数 s，满足 r + 2s = [K : Q]。", unitCriterion: "单位要求 N_{K/Q}(α) = ±1 且 α ∈ O_K。", regulator: "调节子由基本单位组的对数嵌入矩阵定义，与所选基无关（取绝对值）。" },
        closureChecks: ["计算 r、s 与单位群秩。", "给出基本单位并验证范数 ±1 及极小性。", "如需调节子，写出对数嵌入矩阵并计算行列式绝对值。"],
        scenarioChecks: { realQuadraticFundamentalUnit: ["用 √d 的连分数展开求实二次域基本单位，与 Pell 方程最小解对应。"], normEquationSolutions: ["范数方程 N(x) = m 的解在乘以单位后成群轨道，须模去单位作用避免重复。"], regulatorInClassNumberFormula: ["把 R_K 与 h_K 代入解析类数公式做交叉验证。"] },
    },
    // 分解群与惯性群：D_P/I_P ≅ Gal(剩余域扩张)，Frobenius 元。
    "decomposition-inertia-group": {
        definitions: ["Hilbert 分歧理论研究 Galois 扩张 L/K 中素理想 P 的稳定子群：分解群 D_P = {σ : σP = P} 与惯性群 I_P（在剩余域上作用平凡的子群），并由此定义 Frobenius 元。"],
        formulas: ["群阶关系：|D_P| = e·f，|I_P| = e，[G : D_P] = g（G = Gal(L/K)）。", "商群同构：D_P/I_P ≅ Gal(𝔽_{P}/𝔽_{p}) 为 f 阶循环群，由 Frobenius 生成。", "Frobenius 元：p 非分歧（e = 1）时 D_P 循环，存在唯一 Frob_P ∈ D_P 使 Frob_P(x) ≡ x^{|𝔽_p|} (mod P)。", "共轭类：Frob_P 随 P | p 的选取在 G 中共轭，故 Frobenius 共轭类由 p 决定；G 交换时唯一确定 Frob_p。"],
        theorems: ["分解群基本定理：G 传递作用于 p 上的素理想，故 efg = [L : K]，且 D_P 的固定域是 p 分裂为一个素理想的最大中间域。", "惯性群精确列：1 → I_P → D_P → Gal(剩余域扩张) → 1 正合；驯分歧时 I_P 循环，野分歧时含 p-群部分。", "Chebotarev 密度定理：非分歧素数的 Frobenius 共轭类在 G 中按 |C|/|G| 的密度均匀分布（Dirichlet 算术级数定理的推广）。"],
        generalRequirements: ["定义 D_P、I_P 前必须确认 L/K 是 Galois 扩张。", "使用 Frobenius 元必须先确认 P 非分歧，并说明是元素还是共轭类。"],
        forbiddenErrors: ["【非 Galois 误用】对非 Galois 扩张定义分解群或 Frobenius。", "【分歧处 Frobenius】在 e > 1 时断言存在唯一 Frobenius 元（此时只在 D_P/I_P 中有意义）。", "【群阶错算】写 |D_P| = e 或 |I_P| = ef。", "【共轭类忽略】非交换 G 中把 Frob_P 当作与 P 无关的唯一元素。"],
        parameterConstraints: { galoisExtension: "要求 L/K Galois，G = Gal(L/K)。", unramifiedForFrobenius: "Frobenius 元的唯一性要求 e = 1（P 非分歧）。", residueField: "剩余域扩张 𝔽_P/𝔽_p 次数为 f，其 Galois 群循环。" },
        closureChecks: ["确认 Galois 性并计算 e、f、g 与 |D_P|、|I_P|。", "写出 D_P/I_P ≅ Gal(剩余域) 的对应，必要时给出 Frobenius 生成元。", "涉及素数分布时引用 Chebotarev 密度并核对共轭类大小。"],
        scenarioChecks: { cyclotomicFrobenius: ["Q(ζ_m)/Q 中 p ∤ m 时 Frob_p 对应 ζ ↦ ζ^p，Gal ≅ (Z/m)^*，给出分裂条件 p ≡ 1 (mod m) ⇔ 完全分裂。"], splittingFieldOfPolynomial: ["用 Frobenius 共轭类的循环型读出 f mod p 的因式分解型。"], chebotarevApplication: ["估计具有指定分解型的素数密度，或证明某类素数无穷多。"] },
    },
    // 解析类数公式：ζ_K 在 s = 1 的留数由 h_K、R_K、d_K 决定。
    "analytic-class-number-formula": {
        definitions: ["解析类数公式把数域的算术不变量（类数、调节子、单位根个数、判别式）与 Dedekind zeta 函数在 s = 1 处的解析行为联系起来，是解析方法计算类数的基础。"],
        formulas: ["Dedekind zeta：ζ_K(s) = ∑_{a ⊂ O_K} N(a)^{-s} = ∏_{P} (1 - N(P)^{-s})^{-1}（Re(s) > 1）。", "留数公式：lim_{s→1} (s-1) ζ_K(s) = (2^r (2π)^s h_K R_K) / (w_K √|d_K|)，其中 r 实嵌入数、s 复嵌入对数、w_K = |μ_K|。", "二次域特化：Dirichlet 类数公式，虚二次域（判别式 D < -4）h = (w/(2|D|)) |∑_{a=1}^{|D|-1} χ_D(a) a| 的经典形式；实二次域 h·log ε = √D · L(1, χ_D)/2。", "分解：ζ_K(s) = ζ(s) · ∏_{χ ≠ 1} L(s, χ)（K/Q Abel 扩张，χ 遍历相应 Dirichlet 特征）。"],
        theorems: ["解析类数公式：ζ_K 在 s = 1 有单极点，其留数由上式给出（Dirichlet-Dedekind）。", "推论：L(1, χ) ≠ 0（χ 非主特征），这正是 Dirichlet 算术级数素数定理的关键非消失性。", "Abel 扩张情形的分解 ζ_K = ζ · ∏ L(s, χ) 把类数与 L 函数特殊值联系起来，得到二次域的显式类数公式。"],
        generalRequirements: ["使用公式必须完整给出 r、s、w_K、d_K 与调节子的定义与取值。", "所有 L 函数与 zeta 的使用必须声明收敛域或解析延拓后的位置。"],
        forbiddenErrors: ["【常数因子错写】漏掉 2^r (2π)^s 或 w_K、√|d_K| 因子。", "【嵌入参数混淆】把公式中的 s（复嵌入对数）与变量 s 混用而不加区分说明。", "【调节子误取】虚二次域中把 R_K 取为非 1 的值（此时秩 0，R_K = 1）。", "【非 Abel 分解误用】对非 Abel 扩张写 ζ_K = ζ · ∏ L(s, χ)（一般需 Artin L 函数）。"],
        parameterConstraints: { fieldInvariants: "需给出 h_K、R_K、w_K、d_K、r、s。", convergence: "Euler 乘积与级数在 Re(s) > 1 绝对收敛，s = 1 处的结论需解析延拓。", abelianAssumption: "以 Dirichlet L 函数分解 ζ_K 要求 K/Q 为 Abel 扩张。" },
        closureChecks: ["核对 r + 2s = [K : Q] 与 w_K 的取值。", "代入公式并与已知小判别式域的类数表交叉验证。", "如使用 L 函数分解，核对特征的导子与个数是否与 [K : Q] 匹配。"],
        scenarioChecks: { imaginaryQuadraticClassNumber: ["虚二次域取 R_K = 1、r = 0、s = 1，公式退化为特征和形式的显式类数。"], realQuadraticRegulator: ["实二次域中公式把 h·log ε 与 L(1, χ_D) 绑定，可由基本单位反算类数。"], nonvanishingOfL: ["用留数为正推出 L(1, χ) ≠ 0，进而得到算术级数中的素数无穷性。"] },
    },
    // Artin 互反律与 Hilbert 类域：Abel 扩张与广义类群的对应。
    "artin-reciprocity-class-field": {
        definitions: ["类域论研究数域 K 的 Abel 扩张与 K 的广义理想类群之间的对应；Artin 互反律给出该对应的显式同构，Hilbert 类域是对应于理想类群本身的最大非分歧 Abel 扩张。"],
        formulas: ["Artin 映射：非分歧素理想 p ↦ Frob_p ∈ Gal(L/K)，延拓为 Art_{L/K} : I_K(𝔪) → Gal(L/K)。", "互反律：L/K Abel 且模 𝔪 为其导子时 Art 诱导同构 Cl_𝔪(K)/N_{L/K}(...) ≅ Gal(L/K)，核恰为范数类群。", "Hilbert 类域 H：K 的最大非分歧（含无穷位）Abel 扩张，Gal(H/K) ≅ Cl(K)，故 [H : K] = h_K。", "分裂判据：素理想 p 在 H 中完全分裂 ⇔ p 是主理想；一般 ray class field 中 p 分裂 ⇔ p 落在对应的类中。"],
        theorems: ["Artin 互反律：Abel 扩张 L/K 的 Galois 群同构于以导子 𝔪 为模的 ray 类群的商，且同构由 Frobenius 决定；这统一了二次互反律与更高次互反律。", "存在定理：K 的每个广义理想类群的商都对应唯一 Abel 扩张（ray class field），给出 Abel 扩张与类群的一一对应（含导子-判别式关系）。", "Kronecker-Weber 定理：Q 的每个有限 Abel 扩张包含在某个 Q(ζ_n) 中，是类域论在 K = Q 的显式化。"],
        generalRequirements: ["使用 Artin 映射必须限定在非分歧素理想（或对分歧位用局部符号处理）。", "断言某扩张是 Hilbert 类域必须验证非分歧性（含无穷位）与 Abel 性，并核对次数等于 h_K。"],
        forbiddenErrors: ["【非 Abel 误用】对非 Abel 扩张使用 Artin 互反律或断言 Gal 与类群同构。", "【分歧位忽略】在分歧素理想处直接取 Frobenius。", "【无穷位遗漏】判定 Hilbert 类域时只检查有限素理想的非分歧性。", "【分裂判据反用】把「p 主理想」与「p 在 H 中惰性」对应起来。"],
        parameterConstraints: { abelianExtension: "L/K 必须是有限 Abel 扩张。", conductor: "模 𝔪 必须取为导子的倍数，且 Artin 映射定义在与 𝔪 互素的理想上。", hilbertClassField: "Hilbert 类域要求处处（含无穷位）非分歧且 Abel。" },
        closureChecks: ["确认 Abel 性与导子，写出 Artin 映射及其核。", "核对 Gal(L/K) 与相应类群商的同构（阶数一致）。", "用主理想 ⇔ 完全分裂的判据在若干小素数上验证。"],
        scenarioChecks: { hilbertClassFieldConstruction: ["h_K = 2 的虚二次域可显式给出 H = K(√m) 型二次扩张并核验非分歧性。"], reciprocityLawDerivation: ["由 Q(ζ_p)/Q 的 Artin 映射推出二次互反律。"], primeSplittingPrediction: ["用 ray class field 判定素数在给定 Abel 扩张中的分裂形态。"] },
    },
};
