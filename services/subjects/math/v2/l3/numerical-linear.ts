import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数值分析-数值线性代数”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMERICAL_LINEAR_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // LU 分解、列主元与增长因子。
    "numlin-lu-partial-pivoting": {
        id: "numlin-lu-partial-pivoting", l2Key: "numerical-linear", name: "列主元 LU 分解", kind: "algorithm",
        aliases: ["LU分解", "列主元", "增长因子", "PA=LU"],
    },
    // Cholesky 分解与正定性判定。
    "numlin-cholesky-factorization": {
        id: "numlin-cholesky-factorization", l2Key: "numerical-linear", name: "Cholesky 分解", kind: "algorithm",
        aliases: ["Cholesky分解", "对称正定", "LDL^T分解", "无需选主元"],
    },
    // QR 分解与最小二乘求解。
    "numlin-qr-householder-least-squares": {
        id: "numlin-qr-householder-least-squares", l2Key: "numerical-linear", name: "QR 分解与最小二乘", kind: "algorithm",
        aliases: ["Householder变换", "Givens旋转", "正规方程病态", "满秩最小二乘"],
    },
    // 条件数与扰动界。
    "numlin-condition-number-perturbation": {
        id: "numlin-condition-number-perturbation", l2Key: "numerical-linear", name: "矩阵条件数与扰动界", kind: "criterion",
        aliases: ["矩阵条件数", "病态矩阵", "相对误差放大", "残差与误差之别"],
    },
    // 后向误差与数值稳定性。
    "numlin-backward-error-stability": {
        id: "numlin-backward-error-stability", l2Key: "numerical-linear", name: "后向误差与数值稳定性", kind: "criterion",
        aliases: ["后向稳定", "Wilkinson分析", "舍入误差单位", "误差=稳定性×条件数"],
    },
    // 截断 SVD 与最优低秩逼近。
    "numlin-truncated-svd-low-rank": {
        id: "numlin-truncated-svd-low-rank", l2Key: "numerical-linear", name: "截断 SVD 与最优低秩逼近", kind: "theorem",
        aliases: ["Eckart-Young定理", "截断SVD", "数值秩", "最优低秩逼近"],
    },
    // 定常迭代法的收敛判据。
    "numlin-stationary-iteration-convergence": {
        id: "numlin-stationary-iteration-convergence", l2Key: "numerical-linear", name: "定常迭代法收敛判据", kind: "criterion",
        aliases: ["Jacobi迭代", "Gauss-Seidel迭代", "SOR方法", "迭代矩阵谱半径"],
    },
    // 共轭梯度法与 Krylov 收敛估计。
    "numlin-conjugate-gradient-krylov": {
        id: "numlin-conjugate-gradient-krylov", l2Key: "numerical-linear", name: "共轭梯度法与收敛估计", kind: "algorithm",
        aliases: ["共轭梯度法", "Krylov子空间", "Chebyshev误差界", "预条件子"],
    },
    // Arnoldi、Lanczos 与 GMRES。
    "numlin-arnoldi-lanczos-gmres": {
        id: "numlin-arnoldi-lanczos-gmres", l2Key: "numerical-linear", name: "Arnoldi、Lanczos 与 GMRES", kind: "algorithm",
        aliases: ["Arnoldi方法", "Lanczos方法", "GMRES方法", "正交性丢失"],
    },
    // 特征值算法：幂法与移位 QR。
    "numlin-eigenvalue-power-qr-algorithm": {
        id: "numlin-eigenvalue-power-qr-algorithm", l2Key: "numerical-linear", name: "幂法与 QR 特征值算法", kind: "algorithm",
        aliases: ["幂法", "反幂法", "Rayleigh商迭代", "移位QR算法"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMERICAL_LINEAR_L3_RULES: Record<string, MathV2L3Rules> = {
    // 列主元 LU 分解：存在性、增长因子与稳定性边界。
    "numlin-lu-partial-pivoting": {
        definitions: ["LU 分解指把方阵 A 写成下三角 L 与上三角 U 的乘积，列主元策略在第 k 步于第 k 列的第 k 行及以下选取绝对值最大元并做行交换，得到 P A = L U，其中 P 为置换矩阵、L 单位下三角且所有元素绝对值不超过 1", "增长因子定义为 rho = max_{i,j} |u_ij| / max_{i,j} |a_ij|，用于度量消元过程中元素放大的程度"],
        formulas: ["P A = L U", "消元公式 l_ik = a_ik^{(k)} / a_kk^{(k)}，a_ij^{(k+1)} = a_ij^{(k)} - l_ik a_kj^{(k)}", "浮点运算量约 2 n^3 / 3，解两个三角系统各需 n^2", "列主元下 |l_ik| <= 1 且 rho <= 2^{n-1}"],
        theorems: ["A 的所有顺序主子式非零当且仅当 A 存在无需选主元的 LU 分解，且此时分解唯一", "任意方阵（含奇异矩阵）都存在列主元 LU 分解 P A = L U，故列主元 Gauss 消元总可执行到底", "列主元 Gauss 消元的后向误差满足 ||A + delta A|| = O(rho n u ||A||)，即算法在增长因子有界时后向稳定，其中 u 为舍入单位", "全主元的增长因子上界为多项式量级，理论上更安全但选主元代价为 O(n^3) 比较次数"],
        generalRequirements: ["必须明确所用主元策略（不选主元、列主元、全主元）并据此给出对应结论，不同策略的存在性与稳定性结论不能混用", "涉及稳定性时必须区分后向误差（由增长因子控制）与前向误差（还要乘条件数）", "给出运算量时必须写清是分解阶段还是回代阶段，并指出同一矩阵多右端项只需一次分解"],
        forbiddenErrors: ["【存在性误断】断言任意可逆矩阵都存在不选主元的 LU 分解，忽视首个主元为零的情形，例如 [[0,1],[1,0]]", "【上界误用】把列主元的最坏增长因子上界 2^{n-1} 当作实际增长量，或反过来宣称列主元一定使 rho 为 O(1)", "【稳定性混淆】把后向稳定直接说成计算解精确，忽略条件数放大", "【唯一性误推】在做了行交换后仍宣称 L、U 唯一而不提置换矩阵 P", "【复杂度错误】把三角回代的 O(n^2) 与分解的 O(n^3) 混为一谈，或对多右端项重复计数分解代价"],
        parameterConstraints: { matrixSize: "A 为 n x n 实或复方阵，n >= 1", pivotStrategy: "列主元要求每步在当前列剩余行中取绝对值最大元，若该最大值为 0 则该列已零化，矩阵奇异", growthFactor: "rho >= 1 恒成立，列主元下 rho <= 2^{n-1}", roundingUnit: "舍入单位 u 满足 n u << 1 才能使误差界有意义" },
        closureChecks: ["检查是否声明主元策略，以及在奇异或近奇异情形下的处理方式", "检查存在性、唯一性、稳定性三类结论是否各自配齐假设", "检查运算量与误差界中的 n、rho、u 是否量纲一致、没有混用阶数"],
        scenarioChecks: { noPivotFailure: ["构造主元为零的可逆矩阵，验证不选主元时分解不存在", "说明列主元如何通过行交换恢复可执行性"], growthExtreme: ["给出使列主元增长因子达到 2^{n-1} 的经典构造，说明上界是紧的", "指出该构造为人工设计，实际问题中罕见"], multipleRightHandSides: ["同一矩阵多个右端项时，验证只需一次 O(n^3) 分解加多次 O(n^2) 回代", "禁止对每个右端项重复完整消元"] },
    },
    // Cholesky 分解：正定性等价刻画与无需选主元的稳定性。
    "numlin-cholesky-factorization": {
        definitions: ["对称正定矩阵 A 的 Cholesky 分解为 A = L L^T，其中 L 为对角元严格正的下三角矩阵；等价的无平方根形式为 A = L D L^T，L 单位下三角、D 对角且对角元严格正", "半定情形只能保证存在带列置换的分解 P^T A P = L L^T，其中 L 的后若干列为零"],
        formulas: ["A = L L^T", "l_jj = sqrt(a_jj - sum_{k<j} l_jk^2)", "l_ij = (a_ij - sum_{k<j} l_ik l_jk) / l_jj，i > j", "运算量约 n^3 / 3，为列主元 LU 的一半；存储只需下三角部分", "det(A) = prod_j l_jj^2"],
        theorems: ["对称矩阵 A 正定当且仅当存在对角元为正的下三角 L 使 A = L L^T，且此时 L 唯一", "Cholesky 过程可作为正定性判据：若某步根号下的量非正，则 A 不正定，这比计算全部特征值或全部顺序主子式更经济", "Cholesky 分解无需选主元即后向稳定，因为 |l_ij| <= sqrt(a_jj) 自动给出 rho <= 1 量级的元素界", "对称正定矩阵的顺序主子式全为正（Sylvester 判据），与 Cholesky 存在性等价"],
        generalRequirements: ["使用 Cholesky 前必须先确认矩阵对称（复情形为 Hermite）且正定，仅对称不足以保证分解存在", "把 Cholesky 当判据使用时必须说明失败信号是根号下量非正，并区分正定、半定、不定三种结论", "涉及半定或近奇异矩阵时必须改用带置换的半定版本或加正则化项，并说明其代价"],
        forbiddenErrors: ["【对称性遗漏】对非对称矩阵套用 A = L L^T 并宣称成立", "【正定性跳步】仅由对角元为正就断定正定，或仅由行列式为正就断定正定", "【唯一性错误】不限定对角元为正就宣称 L 唯一", "【半定误用】对奇异半定矩阵直接执行标准 Cholesky 而不作列置换或正则化，导致除以零", "【复杂度混淆】把 Cholesky 的 n^3 / 3 与 LU 的 2 n^3 / 3 弄反，或声称 Cholesky 也需要选主元才稳定"],
        parameterConstraints: { symmetry: "实情形要求 A = A^T，复情形要求 A = A^*", positivity: "要求对任意非零 x 有 x^T A x > 0；半定情形需改用置换版本", diagonalEntries: "分解中要求 l_jj > 0，若计算出的平方根被开负数则判定非正定", conditioning: "近奇异正定矩阵中最小特征值接近 0 时，误差被 cond(A) 放大，需要正则化或更高精度" },
        closureChecks: ["检查对称性与正定性是否分别验证并给出依据", "检查失败分支（非正定、半定、近奇异）是否都有明确处置", "检查运算量、存储量与 LU 的对比是否正确"],
        scenarioChecks: { positiveDefiniteTest: ["用 Cholesky 过程检验正定性，指出失败步对应的非正定方向", "与 Sylvester 顺序主子式判据结果相互印证"], semidefiniteCase: ["对秩亏半定矩阵改用带列置换的 Cholesky，说明零列的含义", "指出标准算法在此会因除以零失败"], normalEquations: ["求解正规方程 A^T A x = A^T b 时可用 Cholesky，但必须提示 cond(A^T A) = cond(A)^2 的病态放大", "对比 QR 路线在数值上的优越性"] },
    },
    // QR 分解与最小二乘：Householder、Givens 与正规方程的病态对比。
    "numlin-qr-householder-least-squares": {
        definitions: ["QR 分解把 m x n 矩阵 A（m >= n）写成 A = Q R，Q 为 m x m 正交矩阵、R 为 m x n 上三角；薄型形式为 A = Q_1 R_1，Q_1 为 m x n 列正交", "Householder 变换为 H = I - 2 v v^T / (v^T v)，是关于超平面的镜面反射；Givens 旋转为只作用于两行的平面旋转", "线性最小二乘问题指求 x 使 ||A x - b||_2 最小"],
        formulas: ["A = Q R", "H = I - 2 v v^T / (v^T v)，H^T H = I 且 det(H) = -1", "满秩时最小二乘解由 R_1 x = Q_1^T b 给出，残差 ||A x - b||_2 = ||Q_2^T b||_2", "正规方程 A^T A x = A^T b", "cond_2(A^T A) = cond_2(A)^2", "Householder QR 运算量约 2 n^2 (m - n/3)"],
        theorems: ["A 列满秩时最小二乘解唯一，且等价于正规方程的解，也等价于残差与 A 的列空间正交（正交投影刻画）", "A 列满秩时薄型 QR 分解在要求 R_1 对角元为正的约定下唯一", "Householder QR 是后向稳定算法，其误差界只含 cond(A) 的一次方；而经正规方程求解的误差界含 cond(A)^2，因此病态问题必须走 QR 或 SVD 路线", "经典 Gram-Schmidt 在有限精度下正交性严重丢失，修正 Gram-Schmidt 好得多但仍弱于 Householder；Givens 旋转适合稀疏或已接近三角的矩阵"],
        generalRequirements: ["必须区分完全 QR 与薄型 QR，并说明 Q_2 部分对残差范数的作用", "讨论最小二乘时必须先声明是否列满秩，秩亏时应转向极小范数解与 SVD/带列选主元 QR", "比较算法时必须以条件数的幂次为依据，不能只比较运算量"],
        forbiddenErrors: ["【满秩假设遗漏】在秩亏情形下宣称最小二乘解唯一或直接使用 R_1 回代", "【病态忽视】对病态问题推荐正规方程而不指出 cond(A)^2 的放大", "【正交性误信】把经典 Gram-Schmidt 的计算结果当作严格正交基使用", "【维数混乱】把 Q 的尺寸写成 m x n 却仍称其为正交方阵，或漏掉 Q_2^T b 导致残差公式错误", "【行列式误判】声称 Householder 矩阵行列式为 1，忽视反射的定向反转"],
        parameterConstraints: { shape: "要求 m >= n，超定情形才是标准最小二乘设置", rankCondition: "唯一性要求 rank(A) = n；秩亏时解集为一个仿射子空间", householderVector: "取 v = x + sign(x_1) ||x||_2 e_1 以避免相减相消", uniquenessConvention: "薄型 QR 唯一性需附加 R_1 对角元为正的规范化" },
        closureChecks: ["检查是否声明满秩条件以及秩亏时的替代方案", "检查所用分解形状与后续回代公式是否一致", "检查稳定性论断是否给出条件数幂次的依据"],
        scenarioChecks: { illConditionedFitting: ["对高次多项式拟合的病态设计矩阵，比较正规方程与 QR 的精度差异", "指出 cond(A)^2 使正规方程在双精度下可能完全失效"], rankDeficient: ["秩亏时改用带列选主元 QR 或 SVD 求极小范数解", "禁止直接对奇异 R_1 作回代"], sparseUpdate: ["对已有 QR 分解作行增删或稀疏零化时使用 Givens 旋转", "说明 Householder 会破坏稀疏结构"] },
    },
    // 矩阵条件数与扰动界：残差小不等于误差小。
    "numlin-condition-number-perturbation": {
        definitions: ["可逆矩阵 A 关于某算子范数的条件数定义为 cond(A) = ||A|| ||A^{-1}||；二范数下 cond_2(A) = sigma_max / sigma_min", "条件数刻画问题本身对数据扰动的敏感度，是问题属性而非算法属性；cond(A) 很大时称矩阵病态", "对奇异矩阵约定 cond(A) = 无穷"],
        formulas: ["cond(A) = ||A|| ||A^{-1}|| >= 1", "cond_2(A) = sigma_max(A) / sigma_min(A)", "扰动界 ||delta x|| / ||x|| <= cond(A) (||delta A|| / ||A|| + ||delta b|| / ||b||) / (1 - cond(A) ||delta A|| / ||A||)", "残差与误差关系 ||x - x_hat|| / ||x|| <= cond(A) ||r|| / ||b||，其中 r = b - A x_hat", "距奇异的相对距离 min ||delta A|| / ||A|| = 1 / cond_2(A)"],
        theorems: ["只扰动右端项时误差放大因子恰为 cond(A)，且该上界在最坏方向上可达，因此条件数不可改进", "cond_2(A) 的倒数等于 A 到最近奇异矩阵的相对距离（Kahan 定理），给出病态的几何解释", "正交矩阵的二范数条件数为 1，故正交变换不放大误差，这是 QR、Householder、Givens 稳定性的根源", "cond(A B) <= cond(A) cond(B)，且对角缩放可显著改变条件数，因此条件数依赖于问题的标度选择"],
        generalRequirements: ["必须说明所用范数，不同范数下条件数不同但相互等价到维数常数", "必须区分条件数（问题敏感度）与稳定性（算法性质），并在结论中体现误差约等于稳定性乘条件数", "报告残差小时必须补充条件数信息才能推断解的精度"],
        forbiddenErrors: ["【残差误判】仅凭残差范数小就断定计算解精确，忽视 cond(A) 的放大", "【范数缺失】写出条件数数值却不声明所用范数", "【属性混淆】把病态归咎于算法不稳定，或用换算法来消除条件数本身", "【行列式替代】用行列式接近 0 判断病态，忽视缩放可任意改变行列式而条件数不变", "【上界失效】在 cond(A) ||delta A|| / ||A|| 接近或超过 1 时仍套用扰动界公式"],
        parameterConstraints: { invertibility: "A 必须可逆，否则条件数取无穷", normChoice: "cond 依赖范数，须固定为 1、2 或无穷范数之一", perturbationSize: "扰动界要求 cond(A) ||delta A|| / ||A|| < 1", scalingSensitivity: "行列缩放会改变条件数，比较前需统一标度" },
        closureChecks: ["检查范数、可逆性与扰动幅度限制是否齐备", "检查是否把条件数与算法稳定性分开陈述", "检查所引扰动界的分母非退化条件是否成立"],
        scenarioChecks: { hilbertMatrix: ["以 Hilbert 矩阵为例说明条件数随阶数指数增长", "指出即便使用后向稳定算法，前向误差仍不可避免"], smallResidualLargeError: ["构造残差极小但误差很大的病态例子，验证残差不足以判定精度", "给出基于条件数的误差上界"], scalingEffect: ["对同一线性系统作行缩放，观察条件数的改变", "说明行列式判据在此失效"] },
    },
    // 后向误差与数值稳定性：误差约等于稳定性乘条件数。
    "numlin-backward-error-stability": {
        definitions: ["算法的后向误差指使计算解成为某个扰动问题精确解所需的最小数据扰动，例如求解 A x = b 得到 x_hat 时，后向误差为最小的 ||delta A|| / ||A|| 使 (A + delta A) x_hat = b", "算法后向稳定指后向误差为 O(u) 量级，其中 u 为舍入单位；前向稳定指前向误差与后向稳定算法同量级但不必来自小扰动", "IEEE 双精度下 u = 2^{-53} 约 1.1e-16"],
        formulas: ["浮点模型 fl(a op b) = (a op b)(1 + delta)，|delta| <= u", "前向误差 <= 条件数 x 后向误差", "内积的后向误差界 |fl(x^T y) - x^T y| <= n u |x|^T |y| / (1 - n u)", "常用记号 gamma_n = n u / (1 - n u)", "Householder QR 与列主元 LU 的后向误差为 O(rho n u)"],
        theorems: ["后向稳定算法的前向相对误差满足 ||x - x_hat|| / ||x|| <= cond(A) O(u)，即误差 = 稳定性 x 条件数，这是数值线性代数的基本误差分解", "列主元 Gauss 消元、Householder QR、Givens QR、Cholesky 均后向稳定；用 Cramer 法则或显式求逆再相乘则不稳定", "正交变换保持二范数，故由正交变换复合的算法误差不被放大，这是 QR 类算法后向稳定的结构性原因", "后向误差可事后估计：对线性系统，相对后向误差约为 ||r|| / (||A|| ||x_hat||)，因此可在不知真解的情况下检验稳定性"],
        generalRequirements: ["必须区分后向稳定、前向稳定与不稳定三种情形，并指明所论算法属于哪一类", "误差分析必须写清是相对误差还是绝对误差，并给出所依赖的舍入单位与维数因子", "不能用单个算例的良好结果替代稳定性证明，也不能用不稳定算法在良态问题上的成功掩盖其缺陷"],
        forbiddenErrors: ["【概念倒置】把后向稳定理解为计算解接近真解，忽视条件数因子", "【结论外推】由算法在良态问题上精度高就宣称其后向稳定", "【显式求逆】用计算 A^{-1} 再乘 b 的方式求解并声称与直接求解等价稳定", "【维数遗漏】误差界中漏掉 n 或 gamma_n 因子，把界写成与维数无关", "【模型缺失】未声明浮点模型和舍入单位就给出定量误差估计"],
        parameterConstraints: { roundingUnit: "要求 n u << 1，否则 gamma_n 的分母退化，误差界无效", perturbationTarget: "后向误差须明确扰动对象是 A、b 还是两者同时", normConsistency: "前向界与后向界必须使用同一范数体系", growthDependence: "涉及 LU 时后向界含增长因子 rho，须一并声明" },
        closureChecks: ["检查是否给出浮点模型、舍入单位与维数因子", "检查稳定性结论与条件数结论是否分别陈述并正确复合", "检查所声称的稳定性是否对应经典结果而非算例经验"],
        scenarioChecks: { crossValidation: ["用相对残差估计后向误差，判断算法实现是否达到 O(u)", "指出该检验不能反映条件数导致的精度损失"], unstableAlgorithm: ["对小规模系统比较 Cramer 法则、显式求逆与列主元消元的误差", "说明不稳定算法的后向误差随规模迅速恶化"], wellConditionedTrap: ["在良态问题上不稳定算法也可能给出好结果，禁止据此推断稳定性", "改用病态或大规模算例暴露差别"] },
    },
    // 截断 SVD 与最优低秩逼近：Eckart-Young 定理与数值秩。
    "numlin-truncated-svd-low-rank": {
        definitions: ["m x n 矩阵的奇异值分解为 A = U Sigma V^T，Sigma 的对角元 sigma_1 >= ... >= sigma_p >= 0 为奇异值；截断到前 k 项得到 A_k = sum_{i<=k} sigma_i u_i v_i^T", "数值秩指在给定容差 tol 下大于 tol 的奇异值个数，反映有限精度下的有效秩", "Frobenius 范数 ||A||_F = sqrt(sum_i sigma_i^2)，二范数 ||A||_2 = sigma_1"],
        formulas: ["A = U Sigma V^T，A_k = sum_{i=1}^{k} sigma_i u_i v_i^T", "min_{rank(B) <= k} ||A - B||_2 = sigma_{k+1}", "min_{rank(B) <= k} ||A - B||_F = sqrt(sum_{i>k} sigma_i^2)", "Moore-Penrose 伪逆 A^+ = V Sigma^+ U^T，极小范数最小二乘解 x = A^+ b", "截断正则化解 x_k = sum_{i<=k} (u_i^T b / sigma_i) v_i"],
        theorems: ["Eckart-Young-Mirsky 定理：截断 SVD 在二范数与 Frobenius 范数（更一般地任意酉不变范数）下都达到秩不超过 k 的最优逼近，误差分别为 sigma_{k+1} 与后尾奇异值的平方和平方根", "最优逼近的唯一性当且仅当 sigma_k > sigma_{k+1}；奇异值相等时最优解不唯一", "Weyl 型扰动不等式 |sigma_i(A + E) - sigma_i(A)| <= ||E||_2，故奇异值对扰动是良态的，数值秩判定因此可靠", "秩亏最小二乘的极小范数解由伪逆唯一给出，而截断 SVD 通过丢弃小奇异值抑制噪声放大，是 Tikhonov 之外的另一种正则化"],
        generalRequirements: ["必须声明所用范数并给出对应的最优逼近误差表达式，二范数与 Frobenius 范数的误差不同", "使用数值秩时必须给出容差的选取依据（如 max(m,n) u sigma_1 或噪声水平），不能凭直觉截断", "涉及正则化时必须说明截断参数 k 在偏差与方差之间的权衡"],
        forbiddenErrors: ["【范数混用】用 Frobenius 误差公式回答二范数最优逼近的误差，或反之", "【唯一性夸大】在 sigma_k = sigma_{k+1} 时仍宣称最优低秩逼近唯一", "【秩判定失当】以是否严格为零判定秩而不设容差，或容差与矩阵尺度无关", "【伪逆滥用】对含噪数据直接用完整伪逆求解，忽视小奇异值使噪声放大 1 / sigma", "【最优性外推】把截断 SVD 的最优性推广到非酉不变范数或有附加结构约束（如非负、稀疏）的逼近问题"],
        parameterConstraints: { truncationIndex: "要求 1 <= k <= rank(A)，且唯一性需 sigma_k > sigma_{k+1}", tolerance: "数值秩容差通常取 tol = max(m, n) u sigma_1，或取噪声水平量级", normClass: "最优性结论限于酉不变范数", cost: "完整 SVD 代价约 O(m n min(m,n))，大规模时应改用随机化或 Krylov 方法" },
        closureChecks: ["检查范数、截断指标与容差三者是否同时给定", "检查是否讨论奇异值重合时的非唯一性", "检查在含噪声场景下是否给出正则化理由而非单纯逼近理由"],
        scenarioChecks: { imageCompression: ["用截断 SVD 作低秩压缩，用 sigma_{k+1} 给出误差保证", "指出所选范数决定误差表达式"], noisyInverseProblem: ["含噪反问题中用截断 SVD 抑制小奇异值放大，讨论 k 的选取", "禁止直接使用完整伪逆"], structuredApproximation: ["若要求逼近矩阵非负或稀疏，说明 Eckart-Young 最优性不再适用", "改用相应的结构化优化方法"] },
    },
    // 定常迭代法收敛判据：谱半径、对角占优与 SOR 最优参数。
    "numlin-stationary-iteration-convergence": {
        definitions: ["把 A 分裂为 A = M - N，定常迭代为 x^{(k+1)} = M^{-1} N x^{(k)} + M^{-1} b，迭代矩阵 G = M^{-1} N", "Jacobi 取 M = D，Gauss-Seidel 取 M = D - L，SOR 取 M = D / omega - L，其中 A = D - L - U 为对角、严格下三角、严格上三角部分", "严格对角占优指 |a_ii| > sum_{j != i} |a_ij| 对所有 i 成立"],
        formulas: ["x^{(k+1)} = G x^{(k)} + c，误差 e^{(k)} = G^k e^{(0)}", "G_Jacobi = D^{-1} (L + U)，G_GS = (D - L)^{-1} U", "SOR 迭代矩阵 G_omega = (D / omega - L)^{-1} ((1 / omega - 1) D + U)", "收敛速率 ||e^{(k)}|| 约 rho(G)^k，迭代次数约 log(eps) / log(rho(G))", "对一致有序矩阵有 rho(G_GS) = rho(G_Jacobi)^2，最优参数 omega_opt = 2 / (1 + sqrt(1 - rho(G_Jacobi)^2))"],
        theorems: ["定常迭代对任意初值收敛当且仅当 rho(G) < 1；rho(G) 是收敛的充要判据，任何范数条件都只是充分条件", "严格对角占优（或不可约弱对角占优）保证 Jacobi 与 Gauss-Seidel 同时收敛", "对称正定矩阵上 Gauss-Seidel 必收敛；SOR 收敛的必要条件是 0 < omega < 2，对称正定时该区间内充分（Ostrowski-Reich 定理）", "Gauss-Seidel 与 Jacobi 的收敛没有普遍的优劣关系，存在 Jacobi 收敛而 Gauss-Seidel 发散的矩阵，反之亦然；仅在一致有序等结构假设下才有平方加速关系"],
        generalRequirements: ["给出收敛结论时必须指明依据的是谱半径判据还是充分的结构条件（对角占优、正定、一致有序）", "涉及 SOR 最优参数时必须声明一致有序或分块三对角等结构假设，否则 omega_opt 公式不成立", "必须区分渐近收敛速率（由 rho(G) 决定）与前若干步的实际下降行为"],
        forbiddenErrors: ["【判据误用】用 ||G|| < 1 的失败来断定不收敛，忽视范数条件只是充分条件", "【优劣误断】无条件宣称 Gauss-Seidel 总比 Jacobi 快", "【参数越界】使用 omega >= 2 或 omega <= 0 的 SOR 并宣称收敛", "【结构遗漏】在无一致有序假设下套用 rho(G_GS) = rho(G_Jacobi)^2 或最优 omega 公式", "【占优条件弱化】把弱对角占优当作严格对角占优使用而不附加不可约性"],
        parameterConstraints: { spectralRadius: "收敛要求 rho(G) < 1，rho(G) 越接近 1 收敛越慢", relaxationParameter: "SOR 要求 0 < omega < 2；omega = 1 退化为 Gauss-Seidel", diagonalEntries: "所有 a_ii != 0，否则 Jacobi、Gauss-Seidel 的 M 不可逆", structuralAssumption: "平方加速与最优参数公式要求一致有序（如分块三对角）结构" },
        closureChecks: ["检查是否给出 rho(G) 的估计或结构性充分条件", "检查 SOR 参数范围与结构假设是否齐备", "检查是否避免了 Jacobi 与 Gauss-Seidel 的无条件比较"],
        scenarioChecks: { poissonFiveStencil: ["对五点差分 Poisson 矩阵计算 Jacobi 谱半径与最优 omega，说明网格细化时 rho 趋近 1", "指出此结构满足一致有序，故平方加速成立"], counterexamplePair: ["构造 Jacobi 收敛而 Gauss-Seidel 发散的矩阵，验证两者无普遍优劣", "禁止把结构化结论当作一般规律"], nonNormalIteration: ["对非正规迭代矩阵，指出前若干步误差可能先增大再按 rho 衰减", "说明只用渐近速率评估实际迭代次数会失真"] },
    },
    // 共轭梯度法与 Krylov 收敛估计。
    "numlin-conjugate-gradient-krylov": {
        definitions: ["Krylov 子空间为 K_k(A, r_0) = span{r_0, A r_0, ..., A^{k-1} r_0}", "共轭梯度法在对称正定 A 下于 x_0 + K_k 中极小化能量范数误差 ||x - x_k||_A，等价于极小化二次函数 phi(x) = x^T A x / 2 - b^T x", "预条件子 M 是近似 A 且易求逆的对称正定矩阵，PCG 在 M^{-1} A 的谱上迭代"],
        formulas: ["alpha_k = r_k^T r_k / (p_k^T A p_k)，x_{k+1} = x_k + alpha_k p_k，r_{k+1} = r_k - alpha_k A p_k，beta_k = r_{k+1}^T r_{k+1} / (r_k^T r_k)，p_{k+1} = r_{k+1} + beta_k p_k", "共轭性 p_i^T A p_j = 0（i != j），残差正交 r_i^T r_j = 0", "误差界 ||x - x_k||_A <= 2 ((sqrt(kappa) - 1) / (sqrt(kappa) + 1))^k ||x - x_0||_A，kappa = cond_2(A)", "每步代价为一次矩阵向量乘加 O(n) 运算，存储只需常数个向量"],
        theorems: ["精确算术下共轭梯度法至多 n 步终止，且若 A 只有 m 个不同特征值则至多 m 步终止；有限精度下正交性丢失使该有限终止性失效，实际须按误差界估计迭代次数", "共轭梯度的极小化性质给出 Chebyshev 型界，迭代次数约 O(sqrt(kappa) log(1 / eps))，比定常迭代的 O(kappa log(1 / eps)) 显著更优", "预条件后收敛速度由 cond(M^{-1} A) 决定，好的预条件子使谱聚集；不完全 Cholesky、多重网格、代数多重网格是常用构造", "共轭梯度法要求 A 对称正定；非对称问题需改用 GMRES、BiCGStab 等，直接套用 CG 会破坏共轭性推导"],
        generalRequirements: ["必须先验证对称正定性，非对称或不定问题不得使用标准 CG", "给出迭代次数估计时必须基于条件数的平方根界，并说明该界是最坏情形、谱分布可使实际收敛更快", "使用预条件时必须说明预条件子对称正定以及作用后的条件数改善"],
        forbiddenErrors: ["【适用性越界】对非对称或不定矩阵使用共轭梯度法", "【有限终止误信】在有限精度下声称至多 n 步得到精确解", "【范数错配】用二范数误差替代 A 范数误差直接套用 Chebyshev 界", "【预条件破坏对称】使用非对称预条件子却仍用 CG 而不改为相应的非对称方法", "【估计过粗】仅用条件数一次幂估计 CG 迭代次数，忽视平方根加速"],
        parameterConstraints: { matrixProperty: "A 必须对称正定；PCG 中要求 M 也对称正定", conditionNumber: "kappa = cond_2(A) >= 1，界中迭代次数约 sqrt(kappa) 量级", storage: "只需存储少量向量，无需显式存 A，适合大规模稀疏问题", stoppingCriterion: "常用相对残差 ||r_k|| / ||b|| <= tol，须注意其与 A 范数误差的差别" },
        closureChecks: ["检查对称正定性与预条件子性质是否验证", "检查误差界所用范数与终止判据是否一致", "检查是否区分精确算术性质与有限精度行为"],
        scenarioChecks: { sparseEllipticSolve: ["求解大规模稀疏椭圆离散系统时用 PCG，配合多重网格或不完全 Cholesky 预条件", "对比未预条件时迭代次数随网格细化的增长"], clusteredSpectrum: ["当特征值聚成少数簇时说明实际收敛远快于 Chebyshev 界", "指出该界为最坏情形上界"], nonsymmetricMisuse: ["对非对称系统改用 GMRES 或 BiCGStab", "禁止将 CG 直接用于非对称矩阵"] },
    },
    // Arnoldi、Lanczos 与 GMRES：非对称 Krylov 方法与正交性丢失。
    "numlin-arnoldi-lanczos-gmres": {
        definitions: ["Arnoldi 过程用修正 Gram-Schmidt 在 Krylov 子空间上构造正交基 V_k，满足 A V_k = V_{k+1} H_bar_k，其中 H_k 为 k x k 上 Hessenberg 矩阵", "Lanczos 过程是 Arnoldi 在对称情形的退化，H_k 变为三对角 T_k，只需三项递推", "GMRES 在 x_0 + K_k(A, r_0) 中极小化残差二范数 ||b - A x||_2"],
        formulas: ["A V_k = V_k H_k + h_{k+1,k} v_{k+1} e_k^T", "对称时 A v_k = beta_{k-1} v_{k-1} + alpha_k v_k + beta_k v_{k+1}", "GMRES 子问题 min_y ||beta e_1 - H_bar_k y||_2，用 Givens 旋转逐步更新最小二乘", "残差单调不增 ||r_k||_2 <= ||r_{k-1}||_2", "正规矩阵时 ||r_k|| / ||r_0|| <= min_{p in P_k, p(0)=1} max_{lambda in spec(A)} |p(lambda)|"],
        theorems: ["GMRES 的残差范数单调不增，且在精确算术下至多 n 步终止；若 A 有 m 个不同特征值且初始残差在相应不变子空间中展开，最多 m 步终止", "对非正规矩阵，仅凭特征值分布无法预测 GMRES 收敛：存在任意给定谱而残差在前 n-1 步几乎不下降的矩阵，故需借助伪谱或场值域分析", "Lanczos 在有限精度下正交性迅速丢失，导致重复出现已收敛的特征值（ghost eigenvalues），必须使用完全或选择性重正交化；Arnoldi 因显式正交化而稳健但代价与存储随 k 线性增长", "重启是控制 Arnoldi/GMRES 存储的标准手段，但 GMRES(m) 可能停滞不收敛，重启破坏了全局极小化性质"],
        generalRequirements: ["必须说明所处理矩阵是否对称，据此选择 Lanczos 三项递推或 Arnoldi 完全正交化", "讨论 GMRES 收敛时必须区分正规与非正规情形，非正规时不得仅用特征值论证", "使用重启版本时必须提示存储与收敛之间的权衡以及可能的停滞"],
        forbiddenErrors: ["【谱推断误用】对非正规矩阵仅由特征值聚集断言 GMRES 快速收敛", "【正交性误信】直接使用未重正交化的 Lanczos 基并把重复特征值当作真实重数", "【单调性外推】把 GMRES 残差单调不增误解为误差单调下降或收敛速度有保证", "【重启忽视】声称 GMRES(m) 与完全 GMRES 有相同的有限终止性质", "【对称性错配】对非对称矩阵套用三项递推 Lanczos 并宣称基正交"],
        parameterConstraints: { symmetryBranch: "对称正定时优先 CG，对称不定用 MINRES，非对称用 GMRES 或 BiCGStab", storageGrowth: "完全 GMRES 第 k 步需存 k 个基向量，正交化代价 O(k n)", restartParameter: "GMRES(m) 中 m 需权衡内存与收敛，m 过小易停滞", reorthogonalization: "Lanczos 必须配合完全或选择性重正交化才能信赖计算得到的谱" },
        closureChecks: ["检查对称性判断与方法选择是否匹配", "检查非正规情形是否避免了纯特征值论证", "检查存储、重启与重正交化的代价是否说明"],
        scenarioChecks: { convectionDominated: ["对强对流占优离散得到的高度非正规矩阵，说明 GMRES 收敛需伪谱或场值域分析", "禁止仅用特征值实部为正就断言快速收敛"], lanczosGhosts: ["在无重正交化的 Lanczos 中观察重复出现的伪特征值，验证正交性丢失", "改用完全重正交化后核对谱"], restartStagnation: ["给出 GMRES(m) 停滞的例子，说明重启牺牲了全局极小性", "对比完全 GMRES 的单调收敛"] },
    },
    // 幂法与 QR 特征值算法：收敛速率、移位与位移策略。
    "numlin-eigenvalue-power-qr-algorithm": {
        definitions: ["幂法迭代 x_{k+1} = A x_k / ||A x_k||，收敛到模最大特征值对应的特征向量；反幂法对 (A - sigma I)^{-1} 作幂法，收敛到最接近 sigma 的特征值", "Rayleigh 商为 r(x) = x^T A x / (x^T x)，Rayleigh 商迭代用当前 Rayleigh 商作为移位反复求解移位系统", "QR 算法先把 A 正交相似化为 Hessenberg 形（对称时为三对角），再作带移位的 QR 迭代 A_k - sigma_k I = Q_k R_k，A_{k+1} = R_k Q_k + sigma_k I"],
        formulas: ["幂法收敛因子 |lambda_2 / lambda_1|，误差按其几何速率下降", "反幂法收敛因子 |(lambda_1 - sigma) / (lambda_2 - sigma)|，其中 lambda_1 为最接近 sigma 者", "对称矩阵的 Rayleigh 商迭代局部三次收敛，非对称一般为二次", "A_{k+1} = Q_k^T A_k Q_k，正交相似故谱不变", "对称矩阵特征值扰动 |lambda_i(A + E) - lambda_i(A)| <= ||E||_2（Weyl 不等式）"],
        theorems: ["幂法收敛要求 |lambda_1| > |lambda_2| 且初始向量在 lambda_1 的特征方向上有非零分量；模最大特征值成共轭对或重模时幂法不收敛到单一方向", "带 Wilkinson 移位的隐式 QR 算法对对称三对角矩阵实际总收敛且每个特征值平均常数次迭代，整体代价对特征值为 O(n^3)；无移位 QR 收敛缓慢且对模相等的特征值会停滞", "QR 算法通过正交相似变换保持谱，并对对称矩阵保持三对角结构，这既是稳定性来源也是 O(n) 每步代价的来源", "对称特征值问题是良态的（Weyl 不等式给出绝对扰动界），而非对称特征值可以极端敏感，敏感度由特征值条件数 1 / |y^T x| 控制，缺陷矩阵附近扰动引起分数幂响应"],
        generalRequirements: ["必须区分对称与非对称特征值问题的敏感度与算法选择，不能把对称情形的良态性推广到一般矩阵", "给出收敛速率时必须写出对应的比值因子与所需的谱间隔假设", "使用移位时必须说明移位如何改变收敛因子以及移位系统的求解代价"],
        forbiddenErrors: ["【收敛条件遗漏】未要求 |lambda_1| > |lambda_2| 或初值分量非零就宣称幂法收敛", "【复共轭忽视】对实矩阵存在共轭主特征值对时仍用实幂法求单一特征向量", "【敏感度外推】把 Weyl 型良态结论用于非对称或缺陷矩阵的特征值", "【移位误解】认为移位改变了矩阵的谱而非只平移，或忽视近奇异移位系统仍可安全求解这一事实", "【收敛阶夸大】声称无移位 QR 或幂法具有二次以上收敛"],
        parameterConstraints: { spectralGap: "幂法要求 |lambda_1| > |lambda_2|，比值越接近 1 收敛越慢", initialVector: "初始向量在目标特征方向的分量必须非零，随机初值几乎必然满足", shiftChoice: "反幂法与 Rayleigh 商迭代的移位需接近目标特征值但不必避开近奇异", reductionCost: "Hessenberg 或三对角化预处理代价约 O(n^3)，之后每步 QR 迭代为 O(n^2) 或 O(n)" },
        closureChecks: ["检查谱间隔、初值条件与移位设定是否齐备", "检查是否区分了特征值的条件数与矩阵求解的条件数", "检查所报收敛阶与所用移位策略是否匹配"],
        scenarioChecks: { dominantEigenpair: ["用幂法求最大特征对，用 |lambda_2 / lambda_1| 预测迭代次数", "对模相等的主特征值改用子空间迭代或块方法"], interiorEigenvalue: ["用带移位反幂法求内部特征值，说明移位越准收敛越快", "指出近奇异移位系统在后向稳定求解下仍给出正确方向"], defectiveSensitivity: ["对缺陷或近缺陷非对称矩阵，说明特征值对扰动呈分数幂敏感", "禁止用对称情形的 Weyl 界给出误差保证"] },
    },
};
