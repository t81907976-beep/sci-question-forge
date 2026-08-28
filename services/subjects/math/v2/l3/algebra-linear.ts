import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数-线性代数”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ALGEBRA_LINEAR_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 秩-零化度定理把线性映射的核与像维数联系为定义域的维数。
    "rank-nullity-theorem": {
        id: "rank-nullity-theorem", l2Key: "algebra-linear", name: "秩-零化度定理", kind: "theorem",
        aliases: ["秩-零化度定理", "秩零化度定理", "rank-nullity theorem", "维数定理", "线性变换维数公式", "kernel image dimension formula"],
    },
    // Cayley-Hamilton 定理：任意方阵满足其特征多项式。
    "cayley-hamilton-theorem": {
        id: "cayley-hamilton-theorem", l2Key: "algebra-linear", name: "Cayley-Hamilton 定理", kind: "theorem",
        aliases: ["Cayley-Hamilton定理", "凯莱-哈密顿定理", "Cayley Hamilton theorem", "特征多项式零化定理"],
    },
    // 最小多项式与可对角化判据：矩阵可对角化 ⇔ 最小多项式无重根且在基域上分裂。
    "minimal-polynomial-diagonalizability": {
        id: "minimal-polynomial-diagonalizability", l2Key: "algebra-linear", name: "最小多项式与可对角化判据", kind: "criterion",
        aliases: ["最小多项式", "极小多项式", "minimal polynomial", "可对角化判据", "diagonalizability criterion", "最小多项式无重根"],
    },
    // Jordan 标准形：代数闭域上任意方阵相似于唯一的 Jordan 块直和。
    "jordan-canonical-form": {
        id: "jordan-canonical-form", l2Key: "algebra-linear", name: "Jordan 标准形", kind: "theorem",
        aliases: ["Jordan标准形", "若尔当标准形", "Jordan normal form", "Jordan canonical form", "Jordan块分解", "初等因子分解"],
    },
    // 实对称矩阵谱定理：实对称矩阵可正交对角化，特征值全为实数。
    "spectral-theorem-symmetric": {
        id: "spectral-theorem-symmetric", l2Key: "algebra-linear", name: "实对称矩阵谱定理", kind: "theorem",
        aliases: ["谱定理", "实对称矩阵谱定理", "spectral theorem", "正交对角化", "对称矩阵对角化", "自伴算子谱定理"],
    },
    // 奇异值分解：任意矩阵 A = U Σ V^T，Σ 为对角奇异值矩阵。
    "singular-value-decomposition": {
        id: "singular-value-decomposition", l2Key: "algebra-linear", name: "奇异值分解", kind: "theorem",
        aliases: ["奇异值分解", "SVD", "singular value decomposition", "极分解", "polar decomposition"],
    },
    // Gram-Schmidt 正交化：把线性无关序列改造为正交（正交单位）序列。
    "gram-schmidt-orthogonalization": {
        id: "gram-schmidt-orthogonalization", l2Key: "algebra-linear", name: "Gram-Schmidt 正交化", kind: "algorithm",
        aliases: ["Gram-Schmidt正交化", "Schmidt正交化", "施密特正交化", "Gram Schmidt orthogonalization", "QR分解基"],
    },
    // Sylvester 惯性定律：实二次型的正惯性、负惯性和零惯性指数在合同变换下不变。
    "sylvester-law-of-inertia": {
        id: "sylvester-law-of-inertia", l2Key: "algebra-linear", name: "Sylvester 惯性定律", kind: "theorem",
        aliases: ["Sylvester惯性定律", "惯性定律", "Sylvester's law of inertia", "签名不变量", "signature invariant"],
    },
    // 矩阵范数与范数等价性：谱范数、Frobenius 范数及有限维范数等价定理。
    "matrix-norm-equivalence": {
        id: "matrix-norm-equivalence", l2Key: "algebra-linear", name: "矩阵范数与范数等价性", kind: "theorem",
        aliases: ["矩阵范数", "谱范数", "Frobenius范数", "F范数", "算子范数", "范数等价", "matrix norm", "spectral norm", "Frobenius norm", "operator norm", "norm equivalence"],
    },
    // Von Neumann 迹不等式：迹被两矩阵奇异值的有序乘积和控制。
    "von-neumann-trace-inequality": {
        id: "von-neumann-trace-inequality", l2Key: "algebra-linear", name: "Von Neumann 迹不等式", kind: "theorem",
        aliases: ["Von Neumann迹不等式", "冯诺依曼迹不等式", "迹不等式", "von Neumann trace inequality", "trace inequality"],
    },
    // Weyl 特征值扰动不等式：Hermite 矩阵扰动后特征值/奇异值的稳定性界。
    "weyl-eigenvalue-perturbation": {
        id: "weyl-eigenvalue-perturbation", l2Key: "algebra-linear", name: "Weyl 特征值扰动不等式", kind: "theorem",
        aliases: ["Weyl不等式", "Weyl特征值不等式", "Weyl扰动", "特征值扰动", "Weyl inequality", "Weyl perturbation", "eigenvalue perturbation"],
    },
    // Bauer-Fike 定理：可对角化矩阵扰动后特征值受特征向量矩阵条件数控制。
    "bauer-fike-theorem": {
        id: "bauer-fike-theorem", l2Key: "algebra-linear", name: "Bauer-Fike 定理", kind: "theorem",
        aliases: ["Bauer-Fike定理", "Bauer Fike theorem", "特征值条件数", "可对角化扰动界", "condition number of eigenvalues"],
    },
    // Perron-Frobenius 定理：非负/正矩阵的谱半径是带正特征向量的主特征值。
    "perron-frobenius-theorem": {
        id: "perron-frobenius-theorem", l2Key: "algebra-linear", name: "Perron-Frobenius 定理", kind: "theorem",
        aliases: ["Perron-Frobenius定理", "Perron定理", "佩龙-弗罗贝尼乌斯定理", "非负矩阵定理", "Perron root", "Perron-Frobenius theorem", "nonnegative matrix"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const ALGEBRA_LINEAR_L3_RULES: Record<string, MathV2L3Rules> = {
    // 秩-零化度定理刻画有限维线性映射的核维数与像维数的和为定义域维数。
    "rank-nullity-theorem": {
        definitions: ["秩-零化度定理研究有限维向量空间之间线性映射 T: V -> W 的核空间与像空间维数之间的关系，用以约束线性方程组的解结构。"],
        formulas: ["dim ker T + dim im T = dim V；等价地 nullity(T) + rank(T) = dim V。", "对矩阵 A ∈ F^{m×n}：dim N(A) + rank(A) = n，其中 N(A) 为齐次方程组 Ax=0 的解空间。"],
        theorems: ["秩-零化度定理：设 V, W 为域 F 上有限维向量空间，T: V -> W 为线性映射，则 dim V = dim ker T + dim im T。", "推论：T 单 ⇔ ker T = {0} ⇔ rank T = dim V；有限维等维之间 T 单 ⇔ T 满 ⇔ T 同构。", "推论：齐次方程组 Ax=0 的自由变量数为 n - rank(A)。"],
        generalRequirements: ["必须验证定义域 V 有限维。", "必须明确 T 为线性映射（保持加法与数乘）。"],
        forbiddenErrors: ["【无限维滥用】对无限维空间直接使用秩-零化度定理（例如无限维空间上单射未必满射）。", "【维数遗漏项】只写 rank(T) 不写 nullity(T)，或反之。", "【非线性误用】对非线性映射直接套用维数公式。", "【等维单满互推越界】跨越不同维数的空间直接由单射推满射。"],
        parameterConstraints: { finiteDimensional: "V 必须有限维；W 可以任意维数。", linearity: "T 必须线性。" },
        closureChecks: ["验证 V 有限维且 T 线性。", "计算 dim ker T 与 dim im T。", "核对 dim ker T + dim im T = dim V。"],
        scenarioChecks: { homogeneousSolutionSpace: ["齐次方程组基础解系维数 = n - rank(A)，非齐次通解为特解 + 齐次通解。"], isomorphismCriterion: ["等维有限维空间之间 T 单 ⇔ T 满 ⇔ T 同构。"], subspaceIntersection: ["dim(U+W) = dim U + dim W - dim(U∩W)，通过秩-零化度处理和运算。"] },
    },
    // Cayley-Hamilton 定理：矩阵满足自己的特征多项式，是极小多项式与谱理论的桥梁。
    "cayley-hamilton-theorem": {
        definitions: ["Cayley-Hamilton 定理研究方阵与其特征多项式之间的关系，把「特征多项式的形式代入」变成「作用在矩阵上恒等为零」的代数结论。"],
        formulas: ["设 A ∈ F^{n×n}，特征多项式 p_A(λ) = det(λI - A)，则 p_A(A) = 0。", "推论：任意方阵的最小多项式 m_A(λ) 整除 p_A(λ)，且两者有相同的根（在代数闭包中）。"],
        theorems: ["Cayley-Hamilton 定理：任意域 F 上的方阵 A 满足其特征多项式 p_A(A) = 0。", "推论：A^{-1}（若存在）可写为 A 的多项式；A^n 可用 A 的低次幂的线性组合表示。", "最小多项式 m_A(λ) 是使 m_A(A)=0 的首一次数最低多项式；m_A | p_A，且两者根集（重复重数除外）相同。"],
        generalRequirements: ["必须区分特征多项式与最小多项式：Cayley-Hamilton 说 p_A(A)=0 而非 m_A(A)=0（虽二者都成立，但 m_A 一般次数更低）。", "必须明确 p_A(λ) = det(λI - A) 的符号约定（不同教材可能相差 (-1)^n）。"],
        forbiddenErrors: ["【多项式误代】把 p_A(λ) 视为多项式函数进行数值代入而非矩阵代入。", "【最小多项式滥用】声称 Cayley-Hamilton 定理直接给出最小多项式的形式。", "【任意零化多项式误当特征多项式】仅由 q(A)=0 推断 q 就是特征多项式或最小多项式。", "【符号错用】特征多项式定义为 det(A - λI) 而不核对首项 (-1)^n 造成正负号错误。"],
        parameterConstraints: { squareMatrix: "A 必须是方阵。", polynomialConvention: "特征多项式采用首一多项式 p_A(λ)=det(λI - A) 或对应统一约定。" },
        closureChecks: ["计算特征多项式 p_A(λ)。", "验证 p_A(A) = 0。", "如需最小多项式，计算 m_A 且核对 m_A | p_A。"],
        scenarioChecks: { inverseAsPolynomial: ["A 可逆时利用 p_A(A)=0 反解 A^{-1} 为 A 的多项式。"], powerReduction: ["高次幂 A^k 可通过 p_A(A)=0 归约为最多 n-1 次多项式。"], minimalPolynomialLink: ["求最小多项式时先分解 p_A，逐个降幂检验。"] },
    },
    // 最小多项式与可对角化判据：可对角化 ⇔ 最小多项式无重根且在基域上分裂。
    "minimal-polynomial-diagonalizability": {
        definitions: ["方阵的最小多项式 m_A(λ) 是使 m_A(A)=0 的首一次数最低多项式；它的因式结构完整刻画 A 可对角化的性质。"],
        formulas: ["A 可对角化于基域 F ⇔ m_A(λ) 在 F[λ] 中分裂为两两不同的一次因式之积：m_A(λ) = ∏_i (λ - λ_i)。", "几何重数 = 代数重数（对每个特征值 λ_i）⇔ 可对角化。", "对每个特征值 λ_i，λ_i 的 Jordan 块最大阶 = m_A 中 (λ - λ_i) 的次数。"],
        theorems: ["可对角化判据：方阵 A 可对角化 ⇔ 最小多项式 m_A(λ) 无重根且在基域 F 上完全分裂。", "推论：所有几何重数 = 代数重数 ⇔ A 可对角化。", "在代数闭域上：A 可对角化 ⇔ m_A 无重根。"],
        generalRequirements: ["必须验证基域 F 上 m_A 是否分裂；若不分裂需扩张到代数闭包再判断。", "必须区分「无重根」与「在基域上分裂」两个条件，缺一不可。"],
        forbiddenErrors: ["【基域忽视】声称实矩阵总可对角化而忽略特征值可能为复数。", "【特征多项式误替】用特征多项式无重根替代最小多项式无重根（前者更强，是可对角化的充分非必要条件）。", "【几何/代数重数混用】只验证部分特征值的几何重数等于代数重数就断言可对角化。", "【重根忽略】m_A 有重根却断言可对角化。"],
        parameterConstraints: { field: "必须明确基域 F；实矩阵可对角化的判据须区分实分裂与复分裂。", squareMatrix: "A 是方阵。", polynomialSplitting: "m_A 必须在 F 上分裂。" },
        closureChecks: ["计算特征多项式与最小多项式。", "核对 m_A 无重根且在 F 上分裂。", "如需特征分解，求出每个特征值的特征子空间基。"],
        scenarioChecks: { realSymmetric: ["实对称矩阵的最小多项式在 R 上分裂且无重根，因此可正交对角化。"], projectionIdempotent: ["幂等矩阵 P^2=P 满足 m_P(λ) | λ(λ-1)，无重根，故可对角化；特征值只能是 0 或 1。"], nilpotentNonDiagonalizable: ["非零幂零矩阵 N^k=0 的最小多项式为 λ^r（r≥2），有重根，故不可对角化。"] },
    },
    // Jordan 标准形：代数闭域上方阵在相似意义下有唯一的 Jordan 块直和分解。
    "jordan-canonical-form": {
        definitions: ["Jordan 标准形研究代数闭域（或最小多项式分裂）上的方阵在相似变换下的唯一规范形式：一族形如 J_k(λ) 的 Jordan 块直和。"],
        formulas: ["Jordan 块 J_k(λ) 是 k×k 上三角矩阵，对角为 λ，上对角为 1；A 相似于 ⊕_i J_{k_i}(λ_i)。", "对每个特征值 λ：Jordan 块个数 = 几何重数 dim ker(A - λI)；每块阶数由 dim ker(A - λI)^j 的递增差决定。", "初等因子 (λ - λ_i)^{k_i} 完整决定 Jordan 型。"],
        theorems: ["Jordan 标准形定理：代数闭域上任意方阵 A 相似于唯一的 Jordan 块直和（在 Jordan 块排列意义下唯一）。", "同一特征值的 Jordan 块个数 = 该特征值的几何重数；所有 Jordan 块阶数之和 = 代数重数。", "两个方阵在代数闭域上相似 ⇔ 它们的 Jordan 标准形（不计块顺序）相同 ⇔ 它们的初等因子相同。"],
        generalRequirements: ["必须验证基域代数闭或最小多项式在基域上分裂；否则应换到有理标准形。", "必须区分 Jordan 块个数（几何重数）与阶数（由 ker(A-λI)^j 的秩序列决定）。"],
        forbiddenErrors: ["【几何/代数重数混淆】把几何重数当作单个 Jordan 块的阶数或反之。", "【非代数闭域滥用】在实域上对非分裂特征值直接写 Jordan 型，应改用有理标准形或复化。", "【块排列非唯一化】声称 Jordan 标准形无排列自由度。", "【幂空间秩误算】用 dim ker(A-λI) 直接给出最大 Jordan 块阶数（应通过 dim ker(A-λI)^j 递增差得出）。"],
        parameterConstraints: { field: "基域代数闭，或最小多项式在基域上完全分裂。", squareMatrix: "A 是方阵。", blockData: "每个 Jordan 块由特征值 λ 与阶数 k 唯一决定。" },
        closureChecks: ["求特征值与代数重数。", "对每个特征值计算 dim ker(A - λI)^j 的秩序列。", "由秩序列反推每个 Jordan 块阶数并组合成 Jordan 标准形。"],
        scenarioChecks: { matrixExponential: ["计算 e^{tA} 时可对每个 Jordan 块单独求指数（对角部分 + 有限幂零和）。"], differentialSystem: ["常系数线性 ODE 组 y'=Ay 的通解结构由 A 的 Jordan 型决定。"], similarityClassification: ["矩阵相似分类问题：先化到 Jordan 标准形再比较初等因子。"] },
    },
    // 实对称矩阵谱定理：实对称矩阵可正交对角化，特征值全为实数。
    "spectral-theorem-symmetric": {
        definitions: ["实对称矩阵（或欧氏空间上的自伴算子）谱定理研究实内积空间上自伴变换的正交对角化性质，是二次型理论、主成分分析等应用的基石。"],
        formulas: ["设 A ∈ R^{n×n} 且 A^T = A，则存在正交矩阵 Q ∈ O(n) 使 Q^T A Q = diag(λ_1, ..., λ_n)，各 λ_i ∈ R。", "复版本（Hermite）：A^* = A 时存在酉矩阵 U 使 U^* A U = diag(λ_i)。"],
        theorems: ["实对称矩阵谱定理：实对称矩阵的特征值全为实数，且存在由特征向量组成的标准正交基；等价地存在正交矩阵 Q 使 Q^T A Q 对角。", "复自伴（Hermite）版本：任意 Hermite 矩阵可酉对角化，特征值为实。", "推论（正交分解）：R^n = ⊕_i E_{λ_i}，各特征子空间两两正交。"],
        generalRequirements: ["必须验证 A 对称（或 Hermite）：A^T = A（或 A^* = A）。", "在实域上使用时须指明结论：特征值实且存在正交对角化基。"],
        forbiddenErrors: ["【非对称滥用】对普通实矩阵直接使用正交对角化。", "【酉/正交混用】实对称却直接使用酉对角化，或复 Hermite 却只用正交矩阵。", "【特征值范围遗漏】不指出实对称矩阵特征值全实。", "【非自伴视为自伴】在非标准内积下没有验证 A 关于该内积自伴。"],
        parameterConstraints: { symmetric: "实版本要求 A^T = A；复版本要求 A^* = A。", innerProduct: "自伴性质相对于给定内积讨论；非标准内积须另作说明。" },
        closureChecks: ["验证 A 对称或 Hermite。", "求特征值与特征子空间。", "在每个特征子空间内做 Gram-Schmidt 正交化拼成正交对角化基。"],
        scenarioChecks: { quadraticForm: ["二次型 x^T A x 通过谱定理化为主轴形式 Σ λ_i y_i^2，配合 Sylvester 惯性定律分类。"], principalComponentAnalysis: ["协方差矩阵是实对称半正定，通过谱定理得到主成分方向。"], normalOperator: ["正规算子 (A A^* = A^* A) 在复内积空间上仍可酉对角化，是 Hermite 情形的推广。"] },
    },
    // 奇异值分解：任意矩阵分解为正交/酉矩阵与对角奇异值矩阵。
    "singular-value-decomposition": {
        definitions: ["奇异值分解研究任意矩阵（不必方阵）通过左右正交/酉变换化为对角奇异值矩阵的分解，是最稳健的矩阵分解之一。"],
        formulas: ["实 SVD：A ∈ R^{m×n} 可写 A = U Σ V^T，U ∈ O(m)、V ∈ O(n)、Σ ∈ R^{m×n} 为对角奇异值矩阵 σ_1 ≥ σ_2 ≥ ... ≥ σ_r > 0（r = rank A），其余对角为 0。", "复 SVD：A ∈ C^{m×n} 可写 A = U Σ V^*，U, V 为酉矩阵。", "奇异值 σ_i = √λ_i(A^T A) = √λ_i(A A^T)，右奇异向量为 A^T A 特征向量，左奇异向量为 A A^T 特征向量。"],
        theorems: ["奇异值分解定理：任意矩阵 A ∈ F^{m×n}（F = R 或 C）可写 A = U Σ V^* 其中 U, V 为正交/酉矩阵、Σ 为对角非负奇异值矩阵；奇异值集合（含重数）唯一。", "推论（Eckart-Young）：秩 k 截断 A_k = U_k Σ_k V_k^* 在 Frobenius 与算子范数意义下都是 A 的最佳秩 k 逼近。", "推论：谱范数 ||A||_2 = σ_1；条件数 κ(A) = σ_1 / σ_r（可逆情形）；Frobenius 范数 ||A||_F = √(Σ σ_i^2)。"],
        generalRequirements: ["必须明确基域（R 或 C）并使用相应的正交/酉矩阵。", "奇异值按降序排列且非负。"],
        forbiddenErrors: ["【特征值/奇异值混淆】把矩阵特征值当作奇异值使用（一般非方阵无特征值）。", "【方阵前提滥用】在非方阵上直接套用可对角化方法而非 SVD。", "【符号忽略】把奇异值取负或未按降序排列。", "【复共轭遗漏】复 SVD 中把 V^* 写成 V^T。"],
        parameterConstraints: { field: "F = R 时使用正交矩阵；F = C 时使用酉矩阵。", ordering: "奇异值 σ_1 ≥ ... ≥ σ_r > 0 = σ_{r+1} = ...", uniqueness: "奇异值集合（含重数）唯一；奇异向量在重奇异值处只在正交子空间内可选。" },
        closureChecks: ["计算 A^T A 或 A A^T 的特征值以获取奇异值。", "构造 V 的列（右奇异向量）与 U 的列（左奇异向量）。", "核对 A = U Σ V^*（考虑数值容差）。"],
        scenarioChecks: { lowRankApproximation: ["用截断 SVD 求最佳低秩逼近（图像压缩、LSA）。"], pseudoInverse: ["Moore-Penrose 伪逆 A^+ = V Σ^+ U^*，用于最小二乘解 x^+ = A^+ b。"], polarDecomposition: ["极分解 A = U P，P = √(A^* A) 半正定，U 为等距，从 SVD 直接读出。"] },
    },
    // Gram-Schmidt 正交化：把线性无关序列改造为正交序列，是 QR 分解与内积空间基构造基础。
    "gram-schmidt-orthogonalization": {
        definitions: ["Gram-Schmidt 正交化研究内积空间中如何把一组线性无关向量逐步减去在先前分量上的投影，得到正交（或正交单位）向量组。"],
        formulas: ["递推公式：u_k = v_k - Σ_{j<k} (<v_k, u_j> / <u_j, u_j>) u_j；归一化 e_k = u_k / ||u_k||。", "对应矩阵形式：设列向量 v_1, ..., v_n 组成矩阵 A，Gram-Schmidt 给出 A = QR，其中 Q 列为 e_i 正交，R 上三角且对角为正 ||u_i||。"],
        theorems: ["Gram-Schmidt 正交化定理：内积空间中任意有限线性无关序列 v_1, ..., v_n 可正交化为 u_1, ..., u_n（对应 e_1, ..., e_n 正交单位）且保持前 k 项张成子空间不变 span(v_1,...,v_k) = span(u_1,...,u_k)。", "推论：任意有限维内积空间存在正交单位基；等价地可对任意矩阵进行 QR 分解 A = QR，Q 正交、R 上三角。", "推论（Legendre、Chebyshev 多项式）：在 L^2([-1,1], w(x)dx) 中对 {1, x, x^2, ...} 做 Gram-Schmidt 得到正交多项式序列。"],
        generalRequirements: ["必须验证输入序列线性无关，否则递推中某个 u_k = 0。", "必须使用给定内积；不同内积得到不同的正交序列。"],
        forbiddenErrors: ["【线性相关滥用】对线性相关序列做 Gram-Schmidt 得零向量后继续归一化。", "【投影方向反用】用 (<u_j, v_k> / <u_j, u_j>) u_j 与实数系数写反，或投影到未归一化向量时忘除范数。", "【非内积滥用】把双线性型当作内积使用（可能非正定）。", "【顺序打乱】声称 Gram-Schmidt 结果与输入顺序无关。"],
        parameterConstraints: { linearlyIndependent: "输入向量必须线性无关。", innerProduct: "空间上必须给定正定对称（或 Hermite）内积。" },
        closureChecks: ["确认线性无关。", "逐步应用递推得到 u_k 并检查 u_k ≠ 0。", "归一化并核对 <e_i, e_j> = δ_{ij}。"],
        scenarioChecks: { qrDecomposition: ["QR 分解直接由 Gram-Schmidt 给出；数值实现应改用 Householder 或 Givens 以避免消去误差。"], orthogonalPolynomials: ["对权函数 w 在 L^2 上做 Gram-Schmidt 得到 Legendre、Hermite、Chebyshev 等正交多项式族。"], leastSquares: ["最小二乘 A x = b 通过 QR 分解得到 x = R^{-1} Q^T b，比正规方程数值稳定。"] },
    },
    // Sylvester 惯性定律：实二次型的正/负/零惯性指数在合同变换下不变。
    "sylvester-law-of-inertia": {
        definitions: ["Sylvester 惯性定律研究实二次型（或对称双线性型）在合同变换下的不变量：正惯性指数 p、负惯性指数 q、零惯性指数 z 及签名 (p, q, z)。"],
        formulas: ["任意实对称矩阵 A 合同于 diag(I_p, -I_q, 0_z)：存在可逆 P 使 P^T A P = diag(I_p, -I_q, 0_z)，且 (p, q, z) 由 A 唯一决定，n = p + q + z。", "签名 sig(A) = p - q；秩 rank(A) = p + q。"],
        theorems: ["Sylvester 惯性定律：实对称矩阵在合同变换 A ↦ P^T A P（P 可逆）下的三元数 (p, q, z) 唯一确定；因此二次型的正/负特征值个数与秩都是合同不变量。", "推论：实二次型 x^T A x 正定 ⇔ (p, q, z) = (n, 0, 0) ⇔ 所有特征值为正 ⇔ 所有顺序主子式为正。", "推论（惯性变化下的分类）：全部 n(n+1)/2 阶实对称矩阵在合同变换下的分类数目 = (n+1)(n+2)/2。"],
        generalRequirements: ["必须在实数域上讨论（复数域上任意对称矩阵都合同于 diag(I_r, 0)）。", "必须区分「合同变换 A ↦ P^T A P」与「相似变换 A ↦ P^{-1} A P」——前者保签名，后者保特征值。"],
        forbiddenErrors: ["【合同/相似混用】把合同不变量当作相似不变量或反之。", "【复域滥用】把 Sylvester 惯性定律推广到复对称矩阵。", "【顺序主子式判据滥用】非正定情形下直接由顺序主子式判正负惯性指数，忽略退化。", "【签名与秩混淆】把签名 p - q 当作秩 p + q。"],
        parameterConstraints: { realSymmetric: "矩阵在实域上对称。", congruence: "合同变换 P 可逆但不必正交。" },
        closureChecks: ["计算 A 的特征值符号得 (p, q, z)。", "或用配方法把二次型化为规范形 diag(I_p, -I_q, 0_z)。", "验证 p + q + z = n。"],
        scenarioChecks: { quadraticFormClassification: ["实二次型合同分类只需读出 (p, q, z)；用于分析二次曲线/曲面的欧氏或仿射类型。"], positiveDefiniteCriterion: ["正定判据：所有顺序主子式为正 ⇔ (p, q, z)=(n,0,0)。"], indexOfCriticalPoint: ["多元函数临界点分类由 Hessian 矩阵的签名 (p, q, z) 决定，出现在 Morse 理论中。"] },
    },
    // 矩阵范数与范数等价性：谱范数、Frobenius 范数、诱导范数及有限维范数等价定理。
    "matrix-norm-equivalence": {
        definitions: ["矩阵范数研究矩阵空间 F^{m×n} 上满足正定性、齐次性、三角不等式的范数，其中方阵范数常另要求次可乘性 ||AB|| ≤ ||A|| ||B||；核心对象包括由向量范数诱导的算子范数（谱范数）与由内积诱导的 Frobenius 范数，以及有限维空间上一切范数彼此等价的事实。"],
        formulas: ["谱范数（2-范数）：||A||_2 = σ_max(A) = √(λ_max(A^*A))，是 l^2→l^2 的诱导算子范数。", "Frobenius 范数：||A||_F = √(Σ_{i,j} |a_{ij}|^2) = √(tr(A^*A)) = √(Σ_i σ_i^2)，由内积 <A,B> = tr(A^*B) 诱导。", "范数等价（n 列方阵，r = rank A）：||A||_2 ≤ ||A||_F ≤ √r · ||A||_2 ≤ √n · ||A||_2。", "谱半径与范数：ρ(A) = lim_{k→∞} ||A^k||^{1/k} ≤ ||A||（任意次可乘范数），一般 ρ(A) ≤ ||A||_2 且等号仅对正规矩阵成立。"],
        theorems: ["有限维范数等价定理：有限维向量空间上任意两个范数 ||·||_a, ||·||_b 等价，即存在常数 0 < c ≤ C 使 c||x||_a ≤ ||x||_b ≤ C||x||_a（常数一般依赖维数）。", "谱范数与 Frobenius 范数都是酉不变范数：对酉（正交）矩阵 U, V 有 ||UAV|| = ||A||。", "Frobenius 范数不是诱导范数：||I_n||_F = √n ≠ 1，而任意诱导范数满足 ||I|| = 1。", "Gelfand 公式：ρ(A) = lim_{k→∞} ||A^k||^{1/k}，与所选次可乘范数无关。"],
        generalRequirements: ["必须区分「由向量范数诱导的算子范数」与「按元素计算的范数」（如 Frobenius）。", "使用次可乘性时必须限定方阵或相容的矩阵乘法维数。"],
        forbiddenErrors: ["【诱导范数误判】把 Frobenius 范数当作某个向量范数的诱导算子范数（其 ||I||_F = √n ≠ 1）。", "【谱半径等同范数】声称 ρ(A) = ||A||_2 对一般矩阵成立（仅正规矩阵成立，一般只有 ρ(A) ≤ ||A||_2）。", "【等价常数无关维数】断言范数等价常数与空间维数无关。", "【次可乘越界】对不相容维数或非方阵滥用 ||AB|| ≤ ||A|| ||B||。"],
        parameterConstraints: { field: "F = R 或 C；复情形用共轭转置 A^*。", submultiplicative: "次可乘性只对方阵或维数相容的乘积成立。", inducedVsEntrywise: "诱导范数满足 ||I|| = 1，元素范数（Frobenius）不满足。" },
        closureChecks: ["确认所用范数类型（诱导/元素）及是否要求次可乘。", "如涉及谱范数，通过 A^*A 的最大特征值计算 σ_max。", "如涉及范数等价，写出显式等价常数并核对维数依赖。"],
        scenarioChecks: { lowRankApproximation: ["Eckart-Young 定理在谱范数与 Frobenius 范数下都给出截断 SVD 为最佳低秩逼近。"], conditionNumber: ["条件数 κ_2(A) = ||A||_2 ||A^{-1}||_2 = σ_max/σ_min 衡量线性方程组的病态程度。"], convergenceOfIteration: ["矩阵幂 A^k → 0 ⇔ ρ(A) < 1；据 Gelfand 公式与谱半径判断迭代收敛。"] },
    },
    // Von Neumann 迹不等式：迹被两矩阵奇异值的有序乘积之和控制，是酉不变范数理论的核心。
    "von-neumann-trace-inequality": {
        definitions: ["Von Neumann 迹不等式研究两个复矩阵乘积的迹与它们奇异值之间的上界关系，是刻画酉不变范数、证明 Ky Fan 范数与低秩逼近等结果的基本工具。"],
        formulas: ["对 A, B ∈ C^{n×n}，设奇异值降序排列 σ_1(A) ≥ ... ≥ σ_n(A)、σ_1(B) ≥ ... ≥ σ_n(B)，则 |tr(AB)| ≤ Σ_{i=1}^n σ_i(A) σ_i(B)。", "Hermite 情形（迹的重排上界）：A, B Hermite 时，tr(AB) ≤ Σ_i λ_i(A) λ_i(B)（特征值均降序），且 tr(AB) ≥ Σ_i λ_i(A) λ_{n+1-i}(B)。"],
        theorems: ["Von Neumann 迹不等式：|tr(AB)| ≤ Σ_i σ_i(A) σ_i(B)；等号成立 ⇔ 存在酉矩阵使 A, B 可同时按对应奇异向量对齐（共享奇异值分解的相位配置）。", "推论（迹对偶）：谱范数与迹范数（核范数）互为对偶：||A||_* = Σ_i σ_i(A) = max_{||B||_2 ≤ 1} |tr(AB)|。", "推论：所有酉不变范数都是奇异值的对称规范函数（Ky Fan 定理），迹不等式是其证明基础。"],
        generalRequirements: ["必须把奇异值按降序一一对应求和，不能与特征值混用。", "复矩阵情形须取奇异值（λ_i(A^*A) 的平方根），不能直接用特征值。"],
        forbiddenErrors: ["【特征值替奇异值】对非正规矩阵用特征值乘积和替代奇异值乘积和。", "【排序错配】把 A 的降序奇异值与 B 的升序奇异值配对当作上界。", "【绝对值遗漏】漏写 |tr(AB)| 的绝对值导致复/符号情形失效。", "【等号条件臆断】未验证同时对齐条件即断言取等。"],
        parameterConstraints: { field: "A, B ∈ C^{n×n}（或相容维数）；奇异值取 A^*A 特征值的非负平方根。", ordering: "两组奇异值均按降序排列后逐项相乘求和。", hermitianVariant: "特征值版本仅在 A, B 均 Hermite 时适用。" },
        closureChecks: ["分别计算 A, B 的奇异值并降序排列。", "核对 |tr(AB)| ≤ Σ σ_i(A) σ_i(B)。", "若声称取等，验证奇异向量的对齐条件。"],
        scenarioChecks: { nuclearNormDuality: ["核范数与谱范数对偶关系由迹不等式直接得到，用于矩阵补全/低秩优化。"], kyFanNorm: ["Ky Fan k-范数 Σ_{i≤k} σ_i 的变分刻画依赖迹不等式。"], procrustesProblem: ["正交 Procrustes 问题 max_{U 酉} Re tr(U^*M) = Σ σ_i(M)，取等时 U 由 M 的 SVD 给出。"] },
    },
    // Weyl 特征值扰动不等式：Hermite 矩阵与奇异值在加性扰动下的稳定性界。
    "weyl-eigenvalue-perturbation": {
        definitions: ["Weyl 特征值扰动不等式研究 Hermite（对称）矩阵在加性扰动 A ↦ A + E 下特征值的移动幅度，以及推广到任意矩阵奇异值的扰动界，是数值线性代数稳定性分析的基石。"],
        formulas: ["单调扰动界（Hermite A, E，特征值降序 λ_1 ≥ ... ≥ λ_n）：|λ_i(A+E) - λ_i(A)| ≤ ||E||_2 对所有 i。", "Weyl 加性不等式：λ_{i+j-1}(A+E) ≤ λ_i(A) + λ_j(E)，以及对偶方向 λ_{i+j-n}(A+E) ≥ λ_i(A) + λ_j(E)。", "奇异值版本（任意 A ∈ C^{m×n}）：|σ_i(A+E) - σ_i(A)| ≤ ||E||_2 = σ_1(E)。"],
        theorems: ["Weyl 单调性定理：Hermite 矩阵的第 i 大特征值是关于矩阵（Löwner 序）的单调函数，扰动幅度不超过扰动的谱范数。", "Courant-Fischer 极小极大刻画：λ_i(A) = min_{dim S = n-i+1} max_{x∈S, ||x||=1} x^*Ax，是 Weyl 不等式的证明工具。", "推论：奇异值 σ_i 是 1-Lipschitz 函数（关于谱范数），保证 SVD 的数值稳定性。"],
        generalRequirements: ["必须验证 A（及扰动版本）为 Hermite/对称才能用特征值版本；一般矩阵改用奇异值版本。", "特征值须按统一（降序或升序）约定排列后逐项比较。"],
        forbiddenErrors: ["【非 Hermite 滥用】对非正规矩阵用特征值 Weyl 不等式（应改用奇异值版本）。", "【排序不一致】比较时 A 与 A+E 的特征值采用不同排序约定。", "【范数误用】用 Frobenius 范数替代谱范数得到更松/错误的界。", "【加性不等式下标越界】λ_{i+j-1} 的下标超出 [1, n] 范围仍套用。"],
        parameterConstraints: { hermitian: "特征值版本要求 A, A+E 均 Hermite（实对称）。", ordering: "特征值降序排列 λ_1 ≥ ... ≥ λ_n。", normChoice: "扰动界使用谱范数 ||E||_2 = σ_max(E)。" },
        closureChecks: ["确认矩阵 Hermite 性或改用奇异值版本。", "按降序排列特征值/奇异值。", "核对 |λ_i(A+E) - λ_i(A)| ≤ ||E||_2 或相应加性不等式。"],
        scenarioChecks: { numericalStability: ["有限精度下对称特征问题的特征值误差被舍入扰动的谱范数控制。"], eigenvalueInterlacing: ["Cauchy 交错定理（子矩阵特征值交错）可由 Weyl 不等式配合秩一扰动推出。"], singularValueStability: ["数据矩阵加噪 A+E 的奇异值稳定性由 σ 的 1-Lipschitz 性保证，用于 PCA 鲁棒性分析。"] },
    },
    // Bauer-Fike 定理：可对角化矩阵扰动后特征值受特征向量矩阵条件数控制。
    "bauer-fike-theorem": {
        definitions: ["Bauer-Fike 定理研究可对角化矩阵在加性扰动下特征值的移动界，指出扰动敏感度由对角化所用特征向量矩阵的条件数决定，是非正规矩阵特征值条件数理论的核心结论。"],
        formulas: ["设 A = V Λ V^{-1} 可对角化，Λ = diag(λ_1,...,λ_n)。对 A+E 的任一特征值 μ，min_{1≤i≤n} |μ - λ_i| ≤ κ_p(V) · ||E||_p，其中 κ_p(V) = ||V||_p ||V^{-1}||_p。", "谱范数形式：min_i |μ - λ_i| ≤ κ_2(V) ||E||_2。", "正规矩阵特例：A 正规时可取 V 酉，κ_2(V) = 1，退化为 min_i |μ - λ_i| ≤ ||E||_2（与 Weyl 界一致）。"],
        theorems: ["Bauer-Fike 定理：可对角化矩阵 A = VΛV^{-1} 的扰动特征值 μ 满足 min_i |μ - λ_i| ≤ κ_p(V) ||E||_p；即特征值扰动被特征向量矩阵条件数放大。", "推论：正规矩阵（含 Hermite、酉）的特征值是良态的（条件数 1）；高度非正规矩阵可能极度病态（κ(V) 巨大）。", "推论：单个特征值 λ_i 的条件数为 1/|y_i^* x_i|（x_i, y_i 为对应右/左单位特征向量），刻画局部敏感度。"],
        generalRequirements: ["必须验证 A 可对角化，否则应改用更一般的伪谱或 Jordan 型分析。", "条件数 κ_p(V) 依赖所选范数与特征向量归一化方式，须显式说明。"],
        forbiddenErrors: ["【非对角化滥用】对不可对角化（有非平凡 Jordan 块）矩阵直接套用 Bauer-Fike。", "【条件数遗漏】把界写成 min_i|μ-λ_i| ≤ ||E|| 而漏掉 κ(V) 因子（仅正规矩阵才成立）。", "【范数不一致】κ_p(V) 与 ||E||_p 使用不同范数。", "【特征向量归一化任意】未固定归一化就比较条件数大小。"],
        parameterConstraints: { diagonalizable: "A 必须可对角化 A = VΛV^{-1}。", normConsistency: "κ_p(V) 与 ||E||_p 采用同一 p-范数。", normalCase: "A 正规时可取 V 酉，κ_2(V) = 1。" },
        closureChecks: ["验证 A 可对角化并求特征向量矩阵 V。", "计算 κ_p(V) = ||V||_p ||V^{-1}||_p。", "核对 min_i |μ - λ_i| ≤ κ_p(V) ||E||_p。"],
        scenarioChecks: { nonNormalSensitivity: ["高度非正规矩阵（如大 Jordan 型附近）特征值对扰动极敏感，需用伪谱分析。"], normalWellConditioned: ["Hermite/正规矩阵特征值良态，数值特征求解误差被 ||E||_2 直接控制。"], eigenvalueConditionNumber: ["单特征值条件数 1/|y_i^* x_i| 指示哪些特征值在计算中最不可靠。"] },
    },
    // Perron-Frobenius 定理：非负/正矩阵的谱半径是带正特征向量的主特征值。
    "perron-frobenius-theorem": {
        definitions: ["Perron-Frobenius 定理研究元素非负矩阵（尤其正矩阵与不可约非负矩阵）的谱结构，指出其谱半径本身是一个具正特征向量的实特征值（Perron 根），支撑 Markov 链、种群模型、PageRank 等应用。"],
        formulas: ["正矩阵（A > 0）：ρ(A) > 0 是 A 的代数单重特征值（Perron 根），存在唯一（相差正倍数）严格正特征向量 v > 0 使 Av = ρ(A)v，且 ρ(A) 严格大于其余所有特征值的模。", "不可约非负矩阵（A ≥ 0 不可约）：ρ(A) 是正的单重特征值，对应正特征向量 v > 0；但可能存在其他模等于 ρ(A) 的特征值（周期 h 个，均匀分布在模 ρ(A) 的圆周上）。", "界估计：min_i Σ_j a_{ij} ≤ ρ(A) ≤ max_i Σ_j a_{ij}（行和夹逼）；对列和同理。"],
        theorems: ["Perron 定理（正矩阵）：ρ(A) 为单重、严格占优的正特征值，配唯一正特征向量。", "Frobenius 定理（不可约非负矩阵）：ρ(A) 为单重正特征值配正特征向量；若 A 本原（某幂全正）则 ρ(A) 严格占优，否则有 h 个模为 ρ(A) 的特征值均匀分布（h = 不可约图的周期）。", "推论（随机矩阵）：行随机矩阵 ρ(A) = 1，稳态分布是对应左特征向量；本原情形下幂 A^k 收敛到秩一极限。"],
        generalRequirements: ["必须区分「正矩阵」「不可约非负矩阵」「一般非负矩阵」三种前提，结论强度不同。", "使用严格占优/收敛结论时必须验证本原性（存在 k 使 A^k > 0），仅不可约不足以保证唯一模最大特征值。"],
        forbiddenErrors: ["【不可约性缺失】对可约非负矩阵直接断言 Perron 根单重且特征向量严格正。", "【本原性混淆】仅由不可约性推出 A^k 收敛（周期 h > 1 时不收敛，需本原）。", "【负元素滥用】对含负元素矩阵套用 Perron-Frobenius。", "【谱半径非特征值臆断】声称任意矩阵谱半径都是特征值（一般矩阵不成立，Perron-Frobenius 依赖非负性）。"],
        parameterConstraints: { nonnegative: "所有元素 a_{ij} ≥ 0（正矩阵要求 a_{ij} > 0）。", irreducibility: "Frobenius 版本要求 A 不可约（关联有向图强连通）。", primitivity: "严格谱占优与幂收敛额外要求本原性（∃k: A^k > 0）。" },
        closureChecks: ["验证矩阵非负及所需的不可约/本原性。", "确认 ρ(A) 为特征值并求其正特征向量。", "如涉及收敛，检验本原性并用行和/列和夹逼估计 ρ(A)。"],
        scenarioChecks: { markovChain: ["随机矩阵 ρ = 1，本原时收敛到唯一稳态分布（左 Perron 向量）。"], pageRank: ["PageRank 通过对本原随机矩阵取主左特征向量（阻尼因子保证本原性）计算网页排名。"], populationModel: ["Leslie 种群矩阵的 Perron 根给出渐近增长率，正特征向量给出稳定年龄结构。"] },
    },
};
