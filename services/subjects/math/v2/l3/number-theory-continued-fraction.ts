import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数论-连分数与丢番图逼近”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMBER_THEORY_CONTINUED_FRACTION_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 收敛子递推与基本逼近不等式。
    "convergent-recurrence": {
        id: "convergent-recurrence", l2Key: "number-theory-continued-fraction", name: "收敛子递推与逼近不等式", kind: "formula",
        aliases: ["收敛子", "连分数收敛子"],
    },
    // Legendre 判据：最佳逼近必为收敛子。
    "legendre-best-approximation": {
        id: "legendre-best-approximation", l2Key: "number-theory-continued-fraction", name: "Legendre 最佳逼近判据", kind: "criterion",
        aliases: ["Legendre定理", "最佳逼近", "best approximation", "1/(2q^2)判据"],
    },
    // Hurwitz 定理：逼近常数 1/√5 最优。
    "hurwitz-theorem": {
        id: "hurwitz-theorem", l2Key: "number-theory-continued-fraction", name: "Hurwitz 逼近定理", kind: "theorem",
        aliases: ["Hurwitz定理", "Hurwitz theorem", "黄金比例逼近"],
    },
    // Lagrange 定理：周期连分数与二次无理数。
    "lagrange-periodic-quadratic": {
        id: "lagrange-periodic-quadratic", l2Key: "number-theory-continued-fraction", name: "Lagrange 周期性定理", kind: "theorem",
        aliases: ["Lagrange周期性定理", "周期连分数", "二次无理数", "reduced quadratic irrational", "√d展开"],
    },
    // 坏逼近数：部分商有界的刻画。
    "badly-approximable-numbers": {
        id: "badly-approximable-numbers", l2Key: "number-theory-continued-fraction", name: "坏逼近数与有界部分商", kind: "criterion",
        aliases: ["坏逼近数", "badly approximable", "有界部分商", "Hausdorff维数", "Liouville型对比"],
    },
    // Gauss 映射的遍历性与 Khinchin/Lévy 常数。
    "gauss-map-ergodicity": {
        id: "gauss-map-ergodicity", l2Key: "number-theory-continued-fraction", name: "Gauss 映射与连分数度量理论", kind: "theorem",
        aliases: ["Gauss映射", "Gauss测度", "Khinchin常数", "Lévy常数", "连分数遍历性"],
    },
    // Markov 谱与 Lagrange 谱。
    "markov-lagrange-spectrum": {
        id: "markov-lagrange-spectrum", l2Key: "number-theory-continued-fraction", name: "Markov 谱与 Lagrange 谱", kind: "object",
        aliases: ["Markov谱", "Lagrange谱", "Markov数", "Markov三元组", "Freiman常数"],
    },
    // Roth 定理：代数数的逼近阶为 2。
    "roth-theorem": {
        id: "roth-theorem", l2Key: "number-theory-continued-fraction", name: "Roth 逼近定理", kind: "theorem",
        aliases: ["Roth定理", "Roth theorem", "Thue-Siegel-Roth", "逼近阶", "代数数逼近"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMBER_THEORY_CONTINUED_FRACTION_L3_RULES: Record<string, MathV2L3Rules> = {
    // 收敛子递推：p_n/q_n 的生成与逼近速度。
    "convergent-recurrence": {
        definitions: ["收敛子是连分数 α = [a_0; a_1, a_2, ...] 的有限截断所给出的有理数 p_n/q_n；其递推与行列式恒等式给出逼近误差的精确上下界。"],
        formulas: ["递推：p_n = a_n p_{n-1} + p_{n-2}，q_n = a_n q_{n-1} + q_{n-2}（p_{-1} = 1, p_0 = a_0；q_{-1} = 0, q_0 = 1）。", "行列式恒等式：p_n q_{n-1} - p_{n-1} q_n = (-1)^{n-1}，故 gcd(p_n, q_n) = 1。", "误差夹逼：1/(q_n(q_n + q_{n+1})) < |α - p_n/q_n| < 1/(q_n q_{n+1}) ≤ 1/q_n^2。", "增长性：q_n ≥ F_{n+1}（Fibonacci 下界），故 q_n 至少指数增长。"],
        theorems: ["交替性：偶阶收敛子递增、奇阶收敛子递减，均收敛到 α，且 α 恒在相邻两收敛子之间。", "既约性：由行列式恒等式，p_n/q_n 自动既约，无需额外约分。", "所有收敛子都满足 |α - p/q| < 1/q^2；反向的判据由 Legendre 定理给出。"],
        generalRequirements: ["必须固定连分数展开的约定（a_i ≥ 1 对 i ≥ 1，有限展开末项 > 1）以保证展开唯一。", "使用误差估计必须同时给出上界与（需要时）下界，不能只用 1/q_n^2。"],
        forbiddenErrors: ["【递推初值错设】p_0、q_0 或 p_{-1}、q_{-1} 取值错误导致整列收敛子偏移。", "【既约性重复处理】对 p_n/q_n 再做约分或声称可能不既约。", "【单调性误述】断言收敛子单调递增趋于 α（实际为交替逼近）。", "【展开非唯一】未约定末项 > 1 而给出两种有限展开并当作不同数。"],
        parameterConstraints: { partialQuotients: "a_0 ∈ Z，a_i ∈ Z_{≥1}（i ≥ 1）。", uniqueness: "有限连分数要求末项 a_n ≥ 2 以保证唯一性。", irrationalCase: "无限连分数对应无理数，且展开唯一。" },
        closureChecks: ["写出前若干 a_i 与对应 p_n/q_n 并核对行列式恒等式。", "用误差夹逼估计逼近精度。", "核对交替性与收敛性（相邻收敛子夹住 α）。"],
        scenarioChecks: { rationalApproximation: ["给定精度要求时取满足 1/(q_n q_{n+1}) < ε 的最小 n。"], euclideanAlgorithmLink: ["有理数的连分数展开即辗转相除的商序列，用于分析算法步数。"], pellSolutionSearch: ["√d 的收敛子给出 x^2 - d y^2 = ±1 的候选解，需回代筛选。"] },
    },
    // Legendre 判据：|α - p/q| < 1/(2q^2) ⇒ p/q 是收敛子。
    "legendre-best-approximation": {
        definitions: ["Legendre 判据给出「有理数是连分数收敛子」的充分条件，并把连分数与最佳有理逼近（第二类最佳逼近）完全对应起来。"],
        formulas: ["Legendre 判据：gcd(p, q) = 1 且 |α - p/q| < 1/(2q^2) ⇒ p/q 是 α 的某个收敛子。", "第二类最佳逼近定义：对所有 1 ≤ q' ≤ q 与整数 p' 有 |qα - p| ≤ |q'α - p'|（等号仅在同一分数时）。", "收敛子的最优性：|q_n α - p_n| < |q α - p| 对所有 q < q_{n+1} 且 p/q ≠ p_n/q_n 成立。", "中间分数（mediants）给出第一类最佳逼近，但一般不是收敛子。"],
        theorems: ["最佳逼近定理：α 的全部第二类最佳逼近恰为其收敛子（p_0/q_0 的边界情形另议）。", "Legendre 判据的常数 1/2 不能替换为 1：存在满足 |α - p/q| < 1/q^2 但非收敛子的分数。", "推论：任何比 1/(2q^2) 更精确的有理逼近都能通过连分数算法找到，故连分数是最佳逼近的完备算法。"],
        generalRequirements: ["使用判据必须核对既约性 gcd(p, q) = 1 与严格不等号。", "必须区分第一类（|α - p/q| 最小）与第二类（|qα - p| 最小）最佳逼近。"],
        forbiddenErrors: ["【常数放宽】用 |α - p/q| < 1/q^2 断言 p/q 是收敛子。", "【既约性缺失】对非既约分数套用判据。", "【两类逼近混用】把中间分数当作收敛子或反之。", "【逆命题误设】断言所有收敛子都满足 |α - p/q| < 1/(2q^2)（并非总成立）。"],
        parameterConstraints: { coprimality: "要求 gcd(p, q) = 1，q ≥ 1。", strictBound: "判据要求严格小于 1/(2q^2)。", approximationType: "最优性结论针对第二类最佳逼近。" },
        closureChecks: ["核对既约性与不等式常数。", "用连分数算法定位该分数在收敛子序列中的位置。", "若为中间分数，说明其属于第一类最佳逼近。"],
        scenarioChecks: { recoveringFractionFromDecimal: ["由数值近似恢复未知有理数（如实验数据定分数）时用判据确认唯一性。"], calendarAndGearRatios: ["用收敛子给出分母受限下的最佳比例近似。"], cryptanalysisWienerAttack: ["RSA Wiener 攻击用连分数从 e/N 的逼近恢复小私钥 d。"] },
    },
    // Hurwitz 定理：常数 1/√5 最优。
    "hurwitz-theorem": {
        definitions: ["Hurwitz 定理给出所有无理数都能达到的最佳普适逼近常数：以 1/(√5 q^2) 为界的逼近有无穷多个，且常数 √5 不能再改进。"],
        formulas: ["Hurwitz 不等式：α 无理 ⇒ 存在无穷多既约 p/q 使 |α - p/q| < 1/(√5 q^2)。", "最优性：对 α = φ = (1+√5)/2（或任何与之 GL_2(Z) 等价的数），任何 c > √5 使 |α - p/q| < 1/(c q^2) 只有有限多解。", "逼近函数：定义 L(α) = liminf_{q → ∞} q‖qα‖，则 Hurwitz 定理等价于 L(α) ≤ 1/√5，且 L(φ) = 1/√5。", "三连续收敛子论证：q_n、q_{n+1}、q_{n+2} 中至少一个满足 |α - p/q| < 1/(√5 q^2)。"],
        theorems: ["Hurwitz 定理：上述不等式对所有无理数成立，常数 √5 最优。", "Dirichlet 逼近定理（较弱）：|α - p/q| < 1/q^2 有无穷多解，对任意实数成立（有理数情形退化）。", "分层结论：排除与 φ 等价的数后常数可提升到 √8，再排除下一类可提升到 √221/5，形成 Lagrange 谱的离散前段。"],
        generalRequirements: ["必须声明 α 为无理数（有理数只有有限多个此类逼近）。", "断言最优性必须给出等号临界的具体类（黄金比例及其等价类）。"],
        forbiddenErrors: ["【常数改进错误】声称 √5 可以替换为更大常数而不排除等价类。", "【有理数误用】对有理 α 断言无穷多解。", "【无穷多与存在混淆】只给出一个满足不等式的分数就当作定理结论。", "【等价类忽略】用 √8 常数而不排除 φ 的 GL_2(Z) 等价类。"],
        parameterConstraints: { irrationality: "α 必须无理。", constantOptimality: "√5 的最优性由 φ 类实现。", infinitude: "结论是「无穷多个既约分数」而非单个。" },
        closureChecks: ["确认 α 无理并给出连分数展开（判断是否与 φ 等价）。", "用三连续收敛子论证或直接引用定理。", "若讨论更优常数，明确排除的等价类。"],
        scenarioChecks: { goldenRatioExtremal: ["φ = [1; 1, 1, ...] 部分商全为 1，逼近最差，达到 Hurwitz 界。"], spectrumRefinement: ["排除若干等价类后逼近常数按 Lagrange 谱 √5 < √8 < √221/5 < ... 上升。"], uniformVsPointwise: ["Dirichlet 定理给出普适但更弱的 1/q^2，Hurwitz 给出最优常数。"] },
    },
    // Lagrange 定理：周期连分数 ⇔ 二次无理数。
    "lagrange-periodic-quadratic": {
        definitions: ["Lagrange 定理刻画连分数展开最终周期的实数恰为二次无理数，并给出纯周期展开与既约二次无理数的对应。"],
        formulas: ["周期记号：α = [a_0; a_1, ..., a_k, \\overline{a_{k+1}, ..., a_{k+m}}]，m 为周期长。", "纯周期判据：α = [\\overline{a_0; a_1, ..., a_{m-1}}] ⇔ α 既约（α > 1 且 -1 < 共轭 α' < 0）。", "√d 的展开：√d = [a_0; \\overline{a_1, ..., a_{m-1}, 2a_0}]，周期部分回文对称。", "周期长与 Pell：√d 展开周期 m 决定 x^2 - d y^2 = ±1 的基本解位置（m 奇则 -1 可解）。"],
        theorems: ["Lagrange 定理：α 的连分数展开最终周期 ⇔ α 是二次无理数（满足整系数二次方程且无理）。", "Galois 定理：纯周期展开 ⇔ 既约二次无理数；共轭数的展开为周期的逆序。", "周期长上界：√d 的周期 m = O(√d log d)，与类数和基本单位的正则子相关。"],
        generalRequirements: ["断言周期必须给出周期起点与周期长，不能只说「循环」。", "涉及 √d 必须要求 d 非完全平方，否则展开有限。"],
        forbiddenErrors: ["【周期与纯周期混淆】把最终周期当作纯周期而误用 Galois 判据。", "【完全平方漏排】对 d 为完全平方仍断言无限周期展开。", "【共轭条件缺失】判定既约时只检查 α > 1 而忽略 -1 < α' < 0。", "【回文结构误用】写出 √d 展开而破坏末项 2a_0 或回文对称。"],
        parameterConstraints: { quadraticIrrational: "α 满足 Aα^2 + Bα + C = 0（A ≠ 0，整系数）且判别式非完全平方。", reducedCondition: "既约要求 α > 1 且共轭 α' ∈ (-1, 0)。", squarefreeInput: "√d 展开要求 d ∈ Z_{≥2} 且非完全平方。" },
        closureChecks: ["核对 α 满足的整系数二次方程与判别式。", "写出周期起点与周期长，检查 √d 情形末项是否为 2a_0。", "如需 Pell 解，用周期奇偶判断 -1 是否可解。"],
        scenarioChecks: { pellFundamentalSolution: ["由 √d 的周期收敛子 p_{m-1}/q_{m-1} 读出 Pell 基本解。"], reductionAlgorithm: ["用 (P + √D)/Q 形式的既约化循环计算周期，避免浮点误差。"], unitGroupComputation: ["实二次域基本单位由周期连分数给出，联系 Dirichlet 单位定理。"] },
    },
    // 坏逼近数：部分商有界。
    "badly-approximable-numbers": {
        definitions: ["坏逼近数是逼近指数达到最小的无理数：存在 c > 0 使 |α - p/q| > c/q^2 对一切有理数成立，等价于连分数部分商有界。"],
        formulas: ["坏逼近判据：α 坏逼近 ⇔ 存在 c > 0 使 ‖qα‖ > c/q（∀q ≥ 1）⇔ sup_i a_i < ∞。", "逼近常数：L(α) = liminf q‖qα‖ > 0 ⇔ α 坏逼近。", "度量性质：坏逼近数集 Lebesgue 测度为 0，但 Hausdorff 维数为 1。", "对照 Liouville 数：部分商增长极快 ⇒ 逼近指数无穷，与坏逼近为两个极端。"],
        theorems: ["Borel-Bernstein/Khinchin 型结论：几乎所有实数的部分商无界，故几乎所有数不是坏逼近数。", "Jarník：坏逼近数集虽零测但 Hausdorff 维数 1（甚至与任意稠密开集交仍维数 1）。", "所有二次无理数都是坏逼近数（周期展开 ⇒ 部分商有界）。"],
        generalRequirements: ["断言坏逼近必须给出常数 c 或部分商上界，不能只说「逼近不好」。", "区分「零测」与「小」：需明确用 Lebesgue 测度还是 Hausdorff 维数度量。"],
        forbiddenErrors: ["【测度与维数混用】由零测断言 Hausdorff 维数为 0。", "【全称量词缺失】只对部分 q 验证不等式即断言坏逼近。", "【与 Liouville 混淆】把部分商无界的数当作坏逼近数。", "【常数缺失】声称 |α - p/q| > c/q^2 而不指明 c 与 α 的依赖关系。"],
        parameterConstraints: { positiveConstant: "常数 c 依赖 α，必须 c > 0 且对所有 q ≥ 1 成立。", boundedQuotients: "等价条件是部分商序列有界。", exponentTwo: "指数固定为 2；改变指数即改变问题类型。" },
        closureChecks: ["检查连分数部分商是否有界并给出上界。", "由上界反推常数 c。", "若讨论集合大小，分别给出测度与维数结论。"],
        scenarioChecks: { quadraticIrrationalCase: ["二次无理数部分商周期有界，直接得坏逼近性。"], dynamicalBoundedOrbits: ["坏逼近对应 Gauss 映射轨道在紧集内，用动力系统语言刻画。"], littlewoodTypeProblems: ["多维推广（Littlewood 猜想）中坏逼近向量集的维数是核心对象。"] },
    },
    // Gauss 映射：不变测度与 Khinchin/Lévy 常数。
    "gauss-map-ergodicity": {
        definitions: ["Gauss 映射 T(x) = {1/x} 把连分数展开转化为动力系统的移位；其保测遍历性给出几乎所有数的部分商与分母增长的统计规律。"],
        formulas: ["Gauss 映射：T(x) = 1/x - ⌊1/x⌋，作用于 (0,1)。", "Gauss 测度：dμ = (1/ln 2) dx/(1 + x)，为 T 的不变概率测度。", "部分商分布：μ(a_n = k) = log_2(1 + 1/(k(k+2)))。", "Khinchin 常数：几乎所有 x 有 (a_1 a_2 ... a_n)^{1/n} → K_0 ≈ 2.6854。", "Lévy 常数：几乎所有 x 有 (1/n) ln q_n → π^2/(12 ln 2) ≈ 1.1866。"],
        theorems: ["Gauss 测度关于 T 不变且 T 遍历（甚至混合），故 Birkhoff 平均给出几乎处处的统计极限。", "Khinchin 定理：部分商的几何平均几乎处处收敛到 K_0（算术平均几乎处处为 +∞）。", "Lévy 定理：ln q_n 的线性增长率几乎处处为 π^2/(12 ln 2)，故逼近误差几乎处处指数衰减。", "Gauss-Kuzmin 定理：T^n 下的分布收敛到 Gauss 测度，收敛速度由转移算子谱隙控制。"],
        generalRequirements: ["所有统计结论必须限定为「关于 Lebesgue/Gauss 测度几乎处处」，不能对具体数断言。", "使用 Birkhoff 定理必须确认被平均函数可积（如 ln a_1 可积、a_1 不可积）。"],
        forbiddenErrors: ["【几乎处处误推个例】用 Khinchin/Lévy 常数断言某个具体数（如 π、√2）的行为。", "【平均类型混淆】把几何平均常数 K_0 当作算术平均极限。", "【不变测度错误】使用 Lebesgue 测度作为 T 的不变测度。", "【可积性忽略】对 a_1（不可积）直接套用 Birkhoff 平均。"],
        parameterConstraints: { domain: "T 定义在 (0,1) 上，需排除有理点构成的零测集。", measureNormalization: "Gauss 测度含归一化因子 1/ln 2。", almostEverywhere: "结论仅对几乎所有 x 成立，二次无理数等零测集为反例。" },
        closureChecks: ["确认所用测度为 Gauss 测度并已归一化。", "核对结论的「几乎处处」限定与例外集。", "区分算术平均、几何平均与分母增长率三类常数。"],
        scenarioChecks: { typicalNumberBehavior: ["随机取实数时用 Gauss-Kuzmin 分布估计部分商大小。"], algorithmComplexity: ["Lévy 常数给出连分数/欧几里得算法的平均步数量级。"], exceptionalSets: ["坏逼近数、Liouville 数等构成零测例外集，需单独处理。"] },
    },
    // Markov 谱与 Lagrange 谱：逼近常数的取值集合。
    "markov-lagrange-spectrum": {
        definitions: ["Lagrange 谱是逼近常数 1/L(α) 在无理数上的取值集合，Markov 谱是二元不定二次型最小值比的取值集合；两者在 3 以下离散重合，由 Markov 三元组参数化。"],
        formulas: ["Lagrange 数：L(α) = liminf_{q→∞} q‖qα‖，谱元素取 1/L(α)。", "离散前段：√5 < √8 < √221/5 < ... → 3，第 n 个值为 √(9 - 4/m_n^2)，m_n 为 Markov 数。", "Markov 方程：x^2 + y^2 + z^2 = 3xyz，解由 (1,1,1) 经 Vieta 变换 (x,y,z) → (x,y,3xy-z) 生成树。", "Markov 谱定义：M = { √(disc f)/inf_{(x,y)≠0} |f(x,y)| }，f 为不定二元二次型。", "Freiman 常数：Lagrange 谱在 F ≈ 4.5278 以上为整条射线。"],
        theorems: ["Markov 定理：谱在 (−∞, 3) 部分离散，由 Markov 三元组一一对应，对应的极值数为周期连分数（部分商仅取 1、2）。", "Lagrange 谱 ⊆ Markov 谱，两者在 [0,3] 上相同，但 Markov 谱严格更大（存在不属于 Lagrange 谱的元素）。", "Hall 射线：存在 F 使 [F, ∞) 完全含于 Lagrange 谱，Freiman 确定了 F 的精确值。", "谱在 3 处有聚点，3 以上结构复杂（含 Cantor 型集与射线的混合）。"],
        generalRequirements: ["必须区分 Lagrange 谱与 Markov 谱，仅在 [0,3] 上可互换。", "引用离散前段必须给出对应 Markov 数与极值连分数。"],
        forbiddenErrors: ["【两谱等同】在 3 以上仍断言 Lagrange 谱等于 Markov 谱。", "【离散性越界】声称整条谱离散（3 以上非离散）。", "【Markov 方程误写】把 3xyz 写成其他系数或漏掉唯一性树结构。", "【极值数误设】给出的极值连分数部分商超出 {1,2}。"],
        parameterConstraints: { markovTriples: "Markov 三元组为 x^2+y^2+z^2 = 3xyz 的正整数解，按 Vieta 树唯一生成。", spectrumBelowThree: "离散性仅在谱值 < 3 时成立。", quadraticForms: "Markov 谱来自不定二元二次型（判别式 > 0 且不为完全平方）。" },
        closureChecks: ["核对所用谱是 Lagrange 谱还是 Markov 谱。", "若在离散段，给出对应 Markov 数与 √(9 - 4/m^2) 的值。", "若在 3 以上，说明结构（Cantor 集/Hall 射线）而不断言离散。"],
        scenarioChecks: { extremalApproximation: ["求逼近常数第 n 优的数时沿 Markov 树取三元组。"], quadraticFormMinima: ["不定二次型最小值估计直接读 Markov 谱下端。"], uniquenessConjecture: ["Markov 唯一性猜想（最大分量唯一确定三元组）仍未解决，不得当作定理使用。"] },
    },
    // Roth 定理：代数数的逼近指数恰为 2。
    "roth-theorem": {
        definitions: ["Roth 定理断言任何次数 ≥ 2 的代数数的有理逼近指数恰为 2：对任意 ε > 0，|α - p/q| < q^{-2-ε} 只有有限多解，是 Thue-Siegel-Roth 系列的终极形式。"],
        formulas: ["Roth 定理：α 代数无理 ⇒ ∀ε > 0，|α - p/q| < 1/q^{2+ε} 只有有限多既约 p/q。", "逼近指数：μ(α) = sup{ μ : |α - p/q| < q^{-μ} 有无穷多解 }，则代数无理数 μ(α) = 2。", "历史指数链：Liouville d、Thue d/2+1、Siegel 2√d、Dyson √(2d)、Roth 2 + ε（d = deg α）。", "Liouville 下界（对照）：|α - p/q| > c(α)/q^d 对一切有理数成立。"],
        theorems: ["Roth 定理（1955）：上述有限性成立，常数 2 最优（Dirichlet 定理给出无穷多 q^{-2} 逼近）。", "非有效性：证明基于 Thue-Siegel 型辅助多项式与 Roth 引理，只给出解个数上界，不能有效定出解的高度界。", "Schmidt 子空间定理：Roth 定理的高维推广，把例外解限制在有限多个真子空间中。", "应用：Roth 定理蕴含 Thue 方程 F(x,y) = m（deg F ≥ 3）只有有限多整数解。"],
        generalRequirements: ["必须要求 α 为代数数且次数 ≥ 2（超越数与有理数均不适用）。", "使用结论只能断言「有限多解」，不得给出显式解界（定理非有效）。"],
        forbiddenErrors: ["【超越数误用】对 π、e 等未知逼近指数的超越数套用 Roth 定理。", "【有效性误设】声称 Roth 定理给出解的显式上界或可枚举全部解。", "【指数误写】把结论写成 2 而非 2 + ε，或漏掉「对任意 ε」量词。", "【与 Liouville 混淆】用 Liouville 指数 d 代替 Roth 指数 2。"],
        parameterConstraints: { algebraicity: "α 必须代数且 deg α ≥ 2。", epsilonPositive: "ε > 0 任意小，但解的有限性个数依赖 ε 与 α。", ineffectivity: "定理不提供解高度的有效上界。" },
        closureChecks: ["确认 α 代数且给出其次数与极小多项式。", "检查不等式写成 q^{-2-ε} 且带任意 ε 量词。", "若需显式界，改用 Baker 型有效方法而非 Roth。"],
        scenarioChecks: { thueEquationFiniteness: ["由 Roth 定理推 Thue 方程解有限，但有效解界需 Baker 方法。"], liouvilleNumberContrast: ["Liouville 数逼近指数无穷，故必为超越数，与 Roth 定理互补。"], subspaceGeneralization: ["同时逼近多个代数数时改用 Schmidt 子空间定理。"] },
    },
};
