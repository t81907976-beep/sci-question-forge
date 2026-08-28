import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“优化-非线性优化”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const OPTIMIZATION_NONLINEAR_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // KKT 一阶必要条件及其成立所需的约束品性。
    "nlp-kkt-necessary-conditions": {
        id: "nlp-kkt-necessary-conditions", l2Key: "optimization-nonlinear", name: "KKT 必要条件与约束品性", kind: "criterion",
        aliases: ["KKT必要性", "LICQ", "MFCQ", "活跃约束集"],
    },
    // 凸优化中 Slater 条件保证零对偶间隙。
    "nlp-slater-strong-duality": {
        id: "nlp-slater-strong-duality", l2Key: "optimization-nonlinear", name: "Slater 条件与凸优化强对偶", kind: "theorem",
        aliases: ["Slater条件", "凸优化强对偶", "Lagrange对偶间隙", "弱对偶界"],
    },
    // 强凸与 L-光滑下梯度法的线性收敛率。
    "nlp-strong-convexity-rate": {
        id: "nlp-strong-convexity-rate", l2Key: "optimization-nonlinear", name: "强凸性与梯度法收敛率", kind: "theorem",
        aliases: ["强凸性模", "L光滑", "梯度下降收敛率", "Nesterov加速"],
    },
    // 线搜索的 Armijo-Wolfe 准则与全局收敛。
    "nlp-line-search-wolfe": {
        id: "nlp-line-search-wolfe", l2Key: "optimization-nonlinear", name: "Armijo-Wolfe 线搜索条件", kind: "criterion",
        aliases: ["Armijo条件", "Wolfe条件", "回溯线搜索", "Zoutendijk条件"],
    },
    // 拟 Newton 更新的割线方程与超线性收敛。
    "nlp-newton-quasi-newton": {
        id: "nlp-newton-quasi-newton", l2Key: "optimization-nonlinear", name: "拟 Newton 更新与超线性收敛", kind: "algorithm",
        aliases: ["拟Newton法", "BFGS更新", "割线方程", "Dennis-More条件"],
    },
    // 信赖域方法的子问题与全局收敛机制。
    "nlp-trust-region-global": {
        id: "nlp-trust-region-global", l2Key: "optimization-nonlinear", name: "信赖域方法与全局收敛", kind: "algorithm",
        aliases: ["信赖域", "Cauchy点", "信赖域子问题", "半径更新规则"],
    },
    // 次微分与非光滑函数的一阶最优性。
    "nlp-subgradient-nonsmooth": {
        id: "nlp-subgradient-nonsmooth", l2Key: "optimization-nonlinear", name: "次微分与非光滑最优性条件", kind: "theorem",
        aliases: ["次微分", "零属于次微分", "Clarke广义梯度", "Danskin定理"],
    },
    // 近端算子与近端梯度法的收敛性。
    "nlp-proximal-gradient": {
        id: "nlp-proximal-gradient", l2Key: "optimization-nonlinear", name: "近端算子与近端梯度法", kind: "algorithm",
        aliases: ["近端算子", "近端梯度法", "Moreau包络", "软阈值算子"],
    },
    // 罚函数法与增广 Lagrange 方法的乘子更新。
    "nlp-penalty-augmented-lagrangian": {
        id: "nlp-penalty-augmented-lagrangian", l2Key: "optimization-nonlinear", name: "罚函数法与增广 Lagrange 方法", kind: "algorithm",
        aliases: ["罚函数法", "增广Lagrange函数", "乘子迭代", "罚参数病态"],
    },
    // 二阶充分条件与临界锥上的曲率判别。
    "nlp-second-order-sufficiency": {
        id: "nlp-second-order-sufficiency", l2Key: "optimization-nonlinear", name: "二阶充分条件与临界锥", kind: "criterion",
        aliases: ["二阶充分条件", "临界锥", "投影二阶导矩阵", "严格局部极小"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const OPTIMIZATION_NONLINEAR_L3_RULES: Record<string, MathV2L3Rules> = {
    // KKT 一阶必要条件及其成立所需的约束品性。
    "nlp-kkt-necessary-conditions": {
        definitions: ["KKT 条件是带不等式与等式约束的非线性优化问题在局部最优点处一阶必要条件的标准形式，其成立需要约束品性（constraint qualification）保证 Lagrange 乘子存在且有界"],
        formulas: ["问题：min f(x) s.t. g_i(x) <= 0 (i = 1..m), h_j(x) = 0 (j = 1..p)", "KKT 系统：grad f(x*) + sum_i lambda_i grad g_i(x*) + sum_j mu_j grad h_j(x*) = 0", "符号与互补：lambda_i >= 0, g_i(x*) <= 0, lambda_i g_i(x*) = 0, h_j(x*) = 0", "活跃集：A(x*) = {i : g_i(x*) = 0}", "LICQ：{grad g_i(x*) : i in A(x*)} 与 {grad h_j(x*)} 合并后线性无关", "MFCQ：{grad h_j} 线性无关且存在 d 使 grad g_i(x*)^T d < 0 (i in A(x*)), grad h_j(x*)^T d = 0"],
        theorems: ["无约束品性时 KKT 可能不成立：min x s.t. x^2 <= 0 的唯一可行点 x = 0 处 grad g = 0，不存在 lambda 满足梯度条件，故必须先验证 LICQ 或 MFCQ", "LICQ 蕴含 MFCQ，MFCQ 蕴含 Abadie 约束品性；LICQ 下乘子唯一，MFCQ 下乘子集合非空有界但可能不唯一", "KKT 只是必要条件：非凸问题的 KKT 点可能是极大点或鞍点，必须结合二阶条件或全局论证才能断言最优", "凸问题（f 与 g_i 凸、h_j 仿射）中 KKT 条件同时充分：任一 KKT 点即全局最优，这是凸优化算法以 KKT 残差作为停机准则的依据", "Fritz John 条件无需约束品性但允许目标乘子 lambda_0 = 0，此时条件退化为约束之间的相关性而不含目标信息"],
        generalRequirements: ["必须写出完整的 KKT 系统：梯度条件、原始可行性、乘子符号、互补松弛四组", "必须显式验证或说明所用约束品性，或改用 Fritz John 形式", "非凸问题不得由 KKT 直接断言全局最优"],
        forbiddenErrors: ["【约束品性未验】在活跃约束梯度退化处直接套用 KKT", "【乘子符号错误】不等式约束乘子取负或对 <= 与 >= 形式混用同一符号", "【互补松弛遗漏】只写梯度条件而不分区讨论活跃与非活跃约束", "【必要当充分】非凸问题中把 KKT 点判定为最优解", "【等式拆成两个不等式后仍要求非负】把 h = 0 拆为 h <= 0 与 -h <= 0 时错误保留单一非负乘子"],
        parameterConstraints: { smoothness: "f、g_i、h_j 需在 x* 附近连续可微（二阶条件另需 C^2）", multiplierSign: "不等式约束乘子 lambda_i >= 0，等式约束乘子 mu_j 无符号限制", qualification: "需 LICQ 或 MFCQ 等约束品性，否则乘子可能不存在", convexityForSufficiency: "KKT 充分性要求 f、g_i 凸且 h_j 仿射" },
        closureChecks: ["列出活跃约束集并逐一给出乘子取值", "验证约束品性或说明改用 Fritz John", "对求得的 KKT 点补充二阶条件或凸性论证以确定性质"],
        scenarioChecks: { degenerateConstraint: ["活跃约束梯度线性相关时说明 LICQ 失效并改用 MFCQ 或 Fritz John"], convexProgram: ["凸问题中由 KKT 直接给出全局最优并写明凸性验证"], caseAnalysis: ["按活跃约束的所有子集分区求解并逐一检验可行性与符号"] },
    },
    // 凸优化中 Slater 条件保证零对偶间隙。
    "nlp-slater-strong-duality": {
        definitions: ["Lagrange 对偶函数是 Lagrange 函数对原始变量取下确界所得的凹函数，对偶问题为其极大化；Slater 条件是存在严格可行点，它在凸问题中保证强对偶（零对偶间隙）且对偶最优解集非空有界"],
        formulas: ["Lagrange 函数：L(x, lambda, mu) = f(x) + lambda^T g(x) + mu^T h(x)", "对偶函数：q(lambda, mu) = inf_{x in D} L(x, lambda, mu)，对任意 lambda、mu 均为凹函数", "弱对偶：q(lambda, mu) <= f(x) 对一切可行 x 与 lambda >= 0 成立，故 d* <= p*", "对偶间隙：p* - d* >= 0", "Slater 条件：存在 x in relint D 使 g_i(x) < 0 (非仿射的 i), h(x) = 0", "凸二次例：min x^T Q x / 2 + c^T x s.t. A x = b 的对偶为 -（1/2）(A^T y - c)^T Q^{-1}(A^T y - c) - b^T y 的极大化（Q 正定）"],
        theorems: ["对偶函数的凹性与原问题的凸性无关：q 作为一族仿射函数的下确界总是凹的，故对偶问题总是凸问题，这是对偶方法用于非凸原问题求界的根据", "凸性单独不足以保证强对偶：存在凸问题使 p* > d*（如 min e^{-x} s.t. x^2 / y <= 0 于 y > 0），必须附加 Slater 或其他正则条件", "Slater 条件下强对偶成立且对偶最优解即为 KKT 乘子；进一步若原问题最优值有限则对偶最优解集非空紧致", "非凸问题的对偶界可严格劣于原始最优值，正的对偶间隙是常态；此时对偶界仍可用于分支限界剪枝但不能作为最优值", "仿射约束不需要严格不等式：Slater 条件对仿射约束只要求相对内点可行，这使线性约束凸问题几乎总满足强对偶"],
        generalRequirements: ["必须显式写出对偶函数的定义域（q > -inf 的 (lambda, mu) 集合）", "断言强对偶必须给出 Slater 或等价正则条件的验证", "非凸问题只能声称弱对偶界"],
        forbiddenErrors: ["【凸性即强对偶】仅由凸性断言零对偶间隙而不验证 Slater", "【对偶域遗漏】忽略 q = -inf 的乘子区域导致对偶问题无界或错解", "【非凸滥用强对偶】对非凸问题声称对偶最优值等于原始最优值", "【符号约束丢失】对偶问题中忘记 lambda >= 0", "【下确界与最小值混用】把 inf 当作可达最小值而不检查下确界是否达到"],
        parameterConstraints: { convexity: "强对偶结论要求 f、g_i 凸、h 仿射", slaterPoint: "需存在严格满足非仿射不等式约束的相对内点", finiteValue: "p* 有限；p* = -inf 时对偶不可行", dualDomain: "只在 q(lambda, mu) > -inf 的乘子上讨论对偶目标" },
        closureChecks: ["逐步推导 q 并明确其定义域", "验证 Slater 条件后再断言 p* = d*", "由对偶最优解还原原始最优解并核对互补松弛"],
        scenarioChecks: { strongDualityClaim: ["给出严格可行点显式坐标以验证 Slater"], nonconvexBound: ["非凸问题只把 d* 作为下界并说明间隙可能为正"], dualDerivation: ["逐项对 x 求下确界并记录使 q 有限的乘子约束"] },
    },
    // 强凸与 L-光滑下梯度法的线性收敛率。
    "nlp-strong-convexity-rate": {
        definitions: ["L-光滑指梯度 Lipschitz 连续（模 L），mu-强凸指函数减去 (mu/2)||x||^2 仍凸；二者之比 kappa = L / mu 是决定一阶方法收敛速度的条件数"],
        formulas: ["L-光滑：||grad f(x) - grad f(y)|| <= L ||x - y||，等价于 f(y) <= f(x) + grad f(x)^T (y - x) + (L/2)||y - x||^2", "mu-强凸：f(y) >= f(x) + grad f(x)^T (y - x) + (mu/2)||y - x||^2", "二阶刻画：mu I <= Hessian f(x) <= L I", "定步长梯度法：x_{k+1} = x_k - t grad f(x_k)，t = 1/L 时 f(x_k) - f* <= (1 - mu/L)^k (f(x_0) - f*)", "仅 L-光滑凸（非强凸）：f(x_k) - f* <= 2 L ||x_0 - x*||^2 / (k + 4)，即 O(1/k)", "Nesterov 加速：y_k = x_k + beta_k (x_k - x_{k-1}), x_{k+1} = y_k - (1/L) grad f(y_k)，收敛率 O(1/k^2)，强凸下为 (1 - sqrt(mu/L))^k", "PL 不等式：||grad f(x)||^2 >= 2 mu (f(x) - f*) 亦足以给出线性收敛"],
        theorems: ["步长上界不可越过：t > 2/L 时定步长梯度法在二次函数上发散，故步长必须由 L 校准或用线搜索自适应确定", "强凸给出线性（几何）收敛而仅凸只给出次线性 O(1/k)，二者阶数差异本质，不能用强凸的结论套到一般凸函数", "一阶方法在 L-光滑凸类上的复杂度下界为 O(1/k^2)，在强凸类上为 (1 - sqrt(mu/L))^k，故 Nesterov 加速是阶意义下最优的，普通梯度法不是", "强凸蕴含唯一最优解且 ||x_k - x*|| 与 f(x_k) - f* 可互相控制：(mu/2)||x - x*||^2 <= f(x) - f* <= (1/(2mu))||grad f(x)||^2", "PL 不等式弱于强凸（允许非凸且最优解集非单点），却仍给出线性收敛，这解释了部分非凸问题上梯度法的快速收敛", "加速方法非单调：Nesterov 迭代的目标值可能上升，故不能用目标单调性作为实现正确性的判据"],
        generalRequirements: ["必须明确所用光滑性与强凸常数并据此设定步长", "给出收敛率时必须写清所处函数类（凸 / 强凸 / PL / 一般非凸）", "非凸情形只能声称收敛到梯度小的点而非全局最优"],
        forbiddenErrors: ["【步长越界】取 t > 2/L 仍断言收敛", "【函数类混用】把强凸的线性收敛率用于仅凸函数", "【常数未定】不给出 L 或 mu 的来源却写出显式收敛率", "【收敛到全局】非凸问题中由梯度趋零断言全局最优", "【加速法单调性误设】要求 Nesterov 迭代目标值逐步下降"],
        parameterConstraints: { stepSize: "定步长需 0 < t <= 2/L，最优常用 t = 1/L 或 2/(L + mu)", constants: "需 0 < mu <= L < inf；mu = 0 退化为非强凸情形", differentiability: "L-光滑要求 f 可微且梯度 Lipschitz", domain: "结论要求在整个可行域（通常 R^n 或凸集）上成立" },
        closureChecks: ["由 Hessian 谱界或差分估计给出 L 与 mu", "按函数类选取正确的收敛率表达式", "核对步长是否落在允许区间并说明是否使用线搜索"],
        scenarioChecks: { quadraticModel: ["二次函数上用 Hessian 特征值直接给出 L、mu 与最优步长"], acceleratedRate: ["写出动量系数并给出 O(1/k^2) 或 sqrt(kappa) 型率"], nonconvexPL: ["用 PL 不等式在非凸问题上导出线性收敛并说明最优解集可能非单点"] },
    },
    // 线搜索的 Armijo-Wolfe 准则与全局收敛。
    "nlp-line-search-wolfe": {
        definitions: ["线搜索沿下降方向选取步长使目标充分下降；Armijo 条件控制目标下降量，曲率（Wolfe）条件排除过小步长，二者合称 Wolfe 条件，是不精确线搜索方法全局收敛性的标准前提"],
        formulas: ["方向导数：phi(t) = f(x_k + t d_k), phi'(0) = grad f(x_k)^T d_k < 0（下降方向）", "Armijo（充分下降）：f(x_k + t d_k) <= f(x_k) + c_1 t grad f(x_k)^T d_k，0 < c_1 < 1（常取 1e-4）", "曲率条件：grad f(x_k + t d_k)^T d_k >= c_2 grad f(x_k)^T d_k，c_1 < c_2 < 1（常取 0.9，拟 Newton 用 0.9，共轭方向法用 0.1）", "强 Wolfe：|grad f(x_k + t d_k)^T d_k| <= c_2 |grad f(x_k)^T d_k|", "Goldstein：f(x_k) + (1 - c) t grad f^T d <= f(x_k + t d) <= f(x_k) + c t grad f^T d，0 < c < 1/2", "回溯：t <- rho t（0 < rho < 1）直到 Armijo 成立", "Zoutendijk 条件：sum_k cos^2(theta_k) ||grad f(x_k)||^2 < inf，其中 cos theta_k = -grad f(x_k)^T d_k / (||grad f(x_k)|| ||d_k||)"],
        theorems: ["仅用 Armijo 不足以保证收敛到驻点：允许步长任意小，须配合回溯的确定性产生机制或曲率条件排除退化步长", "只要 f 下有界且 L-光滑、d_k 为下降方向，Wolfe 线搜索必存在满足条件的步长区间（区间非空定理），故线搜索算法可实现", "Zoutendijk 条件在 Wolfe 线搜索下成立；若同时方向不与负梯度渐近正交（cos theta_k >= delta > 0），则 ||grad f(x_k)|| -> 0，这是最速下降与拟 Newton 全局收敛的统一证明框架", "全局收敛只保证梯度趋零，不保证收敛到极小点；非凸问题中极限点可能是鞍点，需二阶信息或负曲率利用才能逃离", "c_1 >= c_2 时 Wolfe 条件区间可能为空，故参数必须满足 0 < c_1 < c_2 < 1", "精确线搜索并不总是更优：它使相邻方向正交，在最速下降法中导致锯齿现象，代价高而收敛阶不改善"],
        generalRequirements: ["必须先验证 d_k 为下降方向（grad f^T d < 0）再讨论步长", "给出 c_1、c_2 的具体取值并检验 c_1 < c_2", "断言全局收敛时必须补充方向角条件或方向的正定性来源"],
        forbiddenErrors: ["【方向未检】未验证下降性即执行线搜索", "【参数区间错误】取 c_1 >= c_2 导致 Wolfe 条件不可满足", "【Armijo 单用断言收敛】仅由充分下降条件断言收敛到驻点", "【梯度趋零当最优】由 ||grad f|| -> 0 断言收敛到极小点", "【曲率条件符号错】把曲率条件写成不等号反向或对绝对值形式与普通形式混用"],
        parameterConstraints: { armijoConst: "0 < c_1 < 1，实践取 1e-4", curvatureConst: "c_1 < c_2 < 1，拟 Newton 取 0.9，共轭梯度取 0.1", backtrackRatio: "回溯因子 0 < rho < 1，常取 0.5", boundedBelow: "需 f 下有界，否则线搜索可能取到无界步长", descentDirection: "每步需 grad f(x_k)^T d_k < 0" },
        closureChecks: ["写出 phi(t) 与 phi'(0) 并确认负号", "检验所选步长同时满足 Armijo 与曲率条件", "由 Zoutendijk 条件与方向角条件完成收敛性论证"],
        scenarioChecks: { backtrackingRun: ["从 t = 1 起按 rho 回溯并记录首个满足 Armijo 的步长"], wolfeVerification: ["对给定步长逐条验证两个 Wolfe 不等式"], globalConvergenceProof: ["用 Zoutendijk 条件加方向角下界推出梯度趋零"] },
    },
    // 拟 Newton 更新的割线方程与超线性收敛。
    "nlp-newton-quasi-newton": {
        definitions: ["拟 Newton 法用满足割线方程的对称正定矩阵近似二阶导矩阵，避免显式计算与分解 Hessian；BFGS 与 DFP 是秩二更新的两个互为对偶的代表，L-BFGS 用有限内存的向量对隐式表示近似逆"],
        formulas: ["Newton 步：x_{k+1} = x_k - H_k^{-1} grad f(x_k)，H_k = Hessian f(x_k)", "位移与梯度差：s_k = x_{k+1} - x_k, y_k = grad f(x_{k+1}) - grad f(x_k)", "割线方程：B_{k+1} s_k = y_k（或 H_{k+1} y_k = s_k，H = B^{-1}）", "BFGS：B_{k+1} = B_k - B_k s_k s_k^T B_k / (s_k^T B_k s_k) + y_k y_k^T / (y_k^T s_k)", "BFGS 逆形式：H_{k+1} = (I - rho_k s_k y_k^T) H_k (I - rho_k y_k s_k^T) + rho_k s_k s_k^T, rho_k = 1 / (y_k^T s_k)", "曲率正性条件：y_k^T s_k > 0", "Dennis-More 条件：||(B_k - H(x*)) s_k|| / ||s_k|| -> 0 等价于超线性收敛", "Newton 局部二次收敛：||x_{k+1} - x*|| <= C ||x_k - x*||^2"],
        theorems: ["Newton 法的二次收敛是局部的：初值远离时 Hessian 可能不定或奇异，纯 Newton 步不下降，必须配合线搜索、信赖域或修正（加对角阵、修正 Cholesky）", "BFGS 保持正定性当且仅当 y_k^T s_k > 0；Wolfe 曲率条件恰好保证该正性，这是线搜索与拟 Newton 更新必须配套的原因", "拟 Newton 达到超线性但一般不是二次收敛，Dennis-More 条件说明只需近似矩阵在步长方向上渐近正确，而不需 B_k -> H(x*)", "在 n 维二次函数上精确线搜索的 BFGS 至多 n 步终止，且逐步复现共轭方向，这是拟 Newton 与共轭方向法的联系", "BFGS 在实践中显著优于 DFP（对不精确线搜索更稳健），二者由 Broyden 族参数连接，理论收敛结论相同而数值表现不同", "L-BFGS 用 m 对 (s, y) 递归重构方向，存储 O(mn) 而非 O(n^2)；代价是丢弃早期曲率信息，在高度非线性问题上可能退化", "Hessian 奇异或最优点退化时 Newton 法收敛阶降为线性，需用正则化或高阶修正"],
        generalRequirements: ["必须写明近似矩阵的初始化与正定性维持机制", "更新前必须检验 y_k^T s_k > 0，否则跳过更新或作阻尼修正", "断言收敛阶时必须区分 Newton 的二次收敛与拟 Newton 的超线性收敛"],
        forbiddenErrors: ["【正定性未检】在 y^T s <= 0 时仍执行 BFGS 更新导致近似矩阵失去正定", "【收敛阶夸大】声称 BFGS 具有二次收敛", "【全局二次收敛】把 Newton 的局部结论当作全局性质", "【割线方程写反】把 B s = y 与 H y = s 混用", "【奇异未处理】Hessian 奇异或不定时仍直接求解 Newton 方程", "【逆矩阵显式求解】用显式求逆代替 Cholesky 分解或递推公式"],
        parameterConstraints: { curvaturePositivity: "BFGS 更新需 y_k^T s_k > 0（由 Wolfe 曲率条件保证）", initialMatrix: "B_0 常取 I 或按尺度 (y^T s / y^T y) 缩放，需对称正定", smoothness: "Newton 二次收敛要求 f 为 C^2 且 Hessian 在 x* 处正定并 Lipschitz", memorySize: "L-BFGS 内存对数 m 通常取 5 到 20", localNeighborhood: "二次收敛仅在 x* 的某邻域内成立" },
        closureChecks: ["逐步给出 s_k、y_k 与更新后的矩阵并核对割线方程", "检验正定性与曲率条件", "说明收敛阶及其成立范围（局部 / 全局）"],
        scenarioChecks: { bfgsStep: ["给出一步 BFGS 更新的显式矩阵并验证 B_{k+1} s_k = y_k"], newtonModification: ["Hessian 不定时给出修正 Cholesky 或加对角正则的具体处理"], quadraticTermination: ["在二次函数上说明 n 步终止与共轭方向的关系"] },
    },
    // 信赖域方法的子问题与全局收敛机制。
    "nlp-trust-region-global": {
        definitions: ["信赖域方法在当前点邻域内用二次模型近似目标，通过求解带范数约束的子问题得到试探步，再依据实际下降与预测下降之比调整半径；它不依赖模型正定性，因而能处理不定曲率"],
        formulas: ["子问题：min_p m_k(p) = f(x_k) + grad f(x_k)^T p + p^T B_k p / 2 s.t. ||p|| <= Delta_k", "最优性刻画：存在 lambda >= 0 使 (B_k + lambda I) p* = -grad f(x_k)，lambda (Delta_k - ||p*||) = 0，且 B_k + lambda I 半正定", "下降比：rho_k = (f(x_k) - f(x_k + p_k)) / (m_k(0) - m_k(p_k))", "半径更新：rho_k < 1/4 时 Delta_{k+1} = Delta_k / 4；rho_k > 3/4 且 ||p_k|| = Delta_k 时 Delta_{k+1} = min(2 Delta_k, Delta_max)；否则不变", "接受准则：rho_k > eta（常取 eta in [0, 1/4)）时 x_{k+1} = x_k + p_k，否则 x_{k+1} = x_k", "Cauchy 点：p_k^C = -tau_k (Delta_k / ||grad f(x_k)||) grad f(x_k)", "充分下降（Cauchy 点保证）：m_k(0) - m_k(p_k) >= c_1 ||grad f(x_k)|| min(Delta_k, ||grad f(x_k)|| / ||B_k||)"],
        theorems: ["子问题解不必在边界上：若 B_k 正定且 Newton 步落在球内则 lambda = 0，此时信赖域步与 Newton 步一致；边界解对应 lambda > 0（硬情形需单独处理特征方向）", "全局收敛不要求精确求解子问题，只需达到 Cauchy 点水准的充分下降；这使截断共轭梯度（Steihaug）与 dogleg 等近似解法在理论上足够", "信赖域方法允许 B_k 不定并自然利用负曲率方向逃离鞍点，这是它相对线搜索加正定修正的结构优势", "半径的收缩机制保证在模型不可靠区域不会接受坏步：rho_k 小意味着模型与真实函数偏差大，收缩半径是唯一正确响应", "硬情形（hard case）出现在 -grad f 与 B_k 最小特征值的特征子空间正交时，此时 lambda 趋于 -lambda_min(B_k)，需加入特征向量分量才能取到边界解", "dogleg 法要求 B_k 正定，Steihaug-CG 在遇到负曲率时沿该方向走到边界，二者的适用范围不同不能互换"],
        generalRequirements: ["必须写出子问题及其一阶最优性刻画（含乘子 lambda 与半正定条件）", "必须给出 rho_k 的计算与半径更新规则", "断言全局收敛必须引用充分下降条件而非精确解"],
        forbiddenErrors: ["【总在边界】默认子问题解满足 ||p|| = Delta 而不检查内部解情形", "【下降比误用】用模型下降代替实际下降计算 rho", "【半径不更新】接受或拒绝步长后不调整半径", "【正定性误设】对不定 B_k 使用要求正定的 dogleg 法", "【硬情形忽略】边界解求解时不处理特征子空间正交的退化情况", "【接受阈值错误】取 eta >= 1/4 或负值破坏收敛性论证"],
        parameterConstraints: { radiusPositive: "Delta_k > 0，并设上界 Delta_max", acceptanceThreshold: "eta in [0, 1/4)", multiplierSign: "lambda >= 0 且需 B_k + lambda I 半正定", modelSymmetry: "B_k 需对称（可不定）", normChoice: "范数固定（常用 2 范数或按尺度加权），全程一致" },
        closureChecks: ["求解或近似求解子问题并核对最优性条件", "计算 rho_k 并按规则给出接受与半径更新决策", "说明所用近似解法（dogleg / Steihaug）的适用前提"],
        scenarioChecks: { subproblemSolve: ["按 lambda = 0 与 lambda > 0 两种情形分别求解并检验半正定"], radiusAdjustment: ["给出多步迭代的 rho 与半径变化表"], negativeCurvature: ["B_k 不定时说明如何沿负曲率方向走到边界"] },
    },
    // 次微分与非光滑函数的一阶最优性。
    "nlp-subgradient-nonsmooth": {
        definitions: ["凸函数在一点的次微分是全体次梯度构成的闭凸集，它把可微情形的梯度替换为支撑不等式的斜率集合；非凸 Lipschitz 情形用 Clarke 广义梯度（方向导数上极限的凸包）作为推广"],
        formulas: ["次梯度：g in partial f(x) 当且仅当 f(y) >= f(x) + g^T (y - x) 对一切 y 成立", "可微点：partial f(x) = {grad f(x)}（凸函数处处如此）", "绝对值：partial |x| = {sign(x)} (x != 0), [-1, 1] (x = 0)", "最优性（Fermat 型）：x* 为凸函数 f 的全局极小点当且仅当 0 in partial f(x*)", "和法则：partial (f + g)(x) = partial f(x) + partial g(x)（需相对内点条件或一者连续）", "极大函数：f = max_i f_i 时 partial f(x) = conv{grad f_i(x) : f_i(x) = f(x)}（Danskin 定理）", "次梯度法：x_{k+1} = x_k - t_k g_k, g_k in partial f(x_k)，t_k = c / sqrt(k) 时 f_best - f* = O(1 / sqrt(k))"],
        theorems: ["零属于次微分是充要条件而非仅必要：这与光滑情形驻点只是必要条件形成对照，凸性使一阶条件同时充分", "次梯度法不是下降法：单步可能使目标上升，故不能用目标单调性判断实现正确，收敛结论只针对历史最优值或平均迭代", "非光滑凸问题上次梯度法复杂度为 O(1 / eps^2)，不能通过步长调节改善到光滑情形的 O(1 / eps)，这是函数类信息复杂度的本质限制", "和法则的等号需要正则条件：一般只有 partial f + partial g 包含于 partial(f + g)，在相对内点相交或一者连续时取等，随意分拆会得到错误的最优性条件", "Clarke 广义梯度对非凸 Lipschitz 函数良定义且上半连续，但 0 in partial_C f(x) 只是必要条件，不再充分", "Danskin 定理要求参数集紧且目标关于参数连续，只有活跃指标集为单点时极大函数在该点可微；忽略非唯一活跃指标会漏掉非光滑性", "次梯度集非空有界当且仅当 x 在定义域相对内部，边界点上次微分可能为空（如 f = -sqrt(x) 在 0 处）"],
        generalRequirements: ["必须写出非光滑点处的完整次微分集合而非任取一个次梯度", "使用和法则、链式法则前必须说明正则条件", "断言最优性必须区分凸情形（充要）与非凸 Clarke 情形（仅必要）"],
        forbiddenErrors: ["【集合退化为单点】在非光滑点只给一个次梯度而丢失整个集合", "【下降法误设】要求次梯度法目标值逐步下降", "【和法则无条件取等】不验证正则条件直接拆分次微分", "【非凸滥用充分性】对非凸 Lipschitz 函数由 0 in partial_C f 断言极小", "【极大函数误求导】活跃指标非唯一时仍按可微处理", "【定义域边界忽略】在次微分为空的边界点上讨论最优性条件"],
        parameterConstraints: { convexityForEquivalence: "0 in partial f(x*) 与全局最优的等价性要求 f 凸", properDomain: "需 f 真凸且 x 在 dom f 的相对内部以保证次微分非空有界", stepSizeRule: "次梯度法需 sum t_k = inf 且 sum t_k^2 < inf（或递减步长 c / sqrt(k)）", lipschitzForClarke: "Clarke 广义梯度要求 f 局部 Lipschitz", sumRuleCondition: "和法则取等需 relint(dom f) 与 relint(dom g) 相交或一者连续" },
        closureChecks: ["在所有非光滑点显式给出次微分区间或凸包", "由 0 in partial f 求解最优点并核对是否落在非光滑点", "选定步长规则并给出对应的收敛率表述"],
        scenarioChecks: { piecewiseLinear: ["分段线性函数逐折点给出次微分并求最优点"], l1Regularization: ["带 L1 项的问题用 0 in partial f 导出阈值型解结构"], maxFunctionRule: ["极大函数按活跃指标集取凸包并说明可微性失效位置"] },
    },
    // 近端算子与近端梯度法的收敛性。
    "nlp-proximal-gradient": {
        definitions: ["近端算子把邻近点搜索与函数值折衷为一个强凸子问题的唯一解；近端梯度法处理可微项加非光滑正则项的复合目标，对可微项作显式梯度步、对非光滑项作隐式近端步"],
        formulas: ["近端算子：prox_{t h}(v) = argmin_x { h(x) + ||x - v||^2 / (2t) }，t > 0 时唯一（h 真闭凸）", "Moreau 包络：h_t(v) = min_x { h(x) + ||x - v||^2 / (2t) }，可微且 grad h_t(v) = (v - prox_{t h}(v)) / t", "软阈值（h = lambda ||x||_1）：prox_{t lambda ||.||_1}(v)_i = sign(v_i) max(|v_i| - t lambda, 0)", "指示函数（h = i_C）：prox_{t h} = 投影 P_C", "核范数：对奇异值作软阈值", "近端梯度步：x_{k+1} = prox_{t h}(x_k - t grad f(x_k))，t in (0, 1/L]", "固定点刻画：x* 是最优解当且仅当 x* = prox_{t h}(x* - t grad f(x*))", "FISTA：y_k = x_k + ((k - 1)/(k + 2))(x_k - x_{k-1}) 后作近端梯度步，率为 O(1/k^2)"],
        theorems: ["近端算子是 firmly nonexpansive 的（因此 1-Lipschitz），这保证迭代的稳定性；该性质来自子问题的强凸性而非 h 的光滑性", "近端梯度法的收敛率与光滑情形一致：凸时 O(1/k)，强凸时线性，FISTA 达到 O(1/k^2)，故非光滑正则项不降低阶数（与纯次梯度法的 O(1/sqrt(k)) 形成关键对照）", "步长上界仍由 f 的 Lipschitz 常数 L 决定而与 h 无关：t <= 1/L；t 过大将破坏下降性质，若 L 未知须用回溯搜索校准", "投影梯度法是近端梯度法在 h 为凸集指示函数时的特例，二者不必分别论证", "近端算子的可计算性决定方法可用性：L1、核范数、简单凸集有闭式解，一般 h 需内层迭代，此时须控制内层精度以保证外层收敛", "Moreau 包络给出非光滑函数的光滑逼近且保持极小点集合不变，这是近端方法与光滑化方法的桥梁", "FISTA 非单调：目标值可能上升，需要单调版本（MFISTA）才能保证逐步下降"],
        generalRequirements: ["必须显式写出 prox 的解析形式或说明其求解方式", "步长必须由可微项的 L 校准并说明是否使用回溯", "收敛率表述必须与所在函数类（凸 / 强凸 / 加速）匹配"],
        forbiddenErrors: ["【prox 形式错误】软阈值写成硬阈值或漏掉 max(., 0)", "【步长与正则项挂钩】用 h 的性质决定步长上界", "【顺序颠倒】先作近端步再作梯度步却仍套用标准收敛结论", "【率的错配】把 FISTA 的 O(1/k^2) 用于未加动量的近端梯度法", "【单调性误设】要求 FISTA 目标值逐步下降", "【非凸滥用唯一性】对非凸 h 断言 prox 唯一"],
        parameterConstraints: { stepSize: "0 < t <= 1/L，L 为 grad f 的 Lipschitz 常数", properClosedConvex: "h 需真、闭、凸以保证 prox 良定义且唯一", positiveProxParam: "近端参数 t > 0", splittingStructure: "目标须可分解为可微 f 加可计算 prox 的 h", innerAccuracy: "prox 无闭式解时内层求解精度需随外层迭代加严" },
        closureChecks: ["推导并验证 prox 的闭式表达", "核对固定点条件与 KKT 型最优性的一致性", "给出步长选取依据与收敛率结论"],
        scenarioChecks: { lassoSolve: ["用软阈值写出 Lasso 的近端梯度迭代并说明稀疏性来源"], projectionCase: ["h 为指示函数时化为投影梯度法并给出投影公式"], acceleratedVariant: ["写出 FISTA 动量系数并给出 O(1/k^2) 的率"] },
    },
    // 罚函数法与增广 Lagrange 方法的乘子更新。
    "nlp-penalty-augmented-lagrangian": {
        definitions: ["罚函数法把约束违反量以罚参数加权并入目标，将约束问题化为一列无约束问题；增广 Lagrange 方法在二次罚项外保留乘子项，用乘子迭代替代罚参数无限增大，从而避免子问题条件数爆炸"],
        formulas: ["二次罚函数（等式约束）：Q(x; sigma) = f(x) + (sigma / 2) sum_j h_j(x)^2", "不等式罚：f(x) + (sigma / 2) sum_i max(0, g_i(x))^2", "增广 Lagrange：L_A(x, mu; sigma) = f(x) + sum_j mu_j h_j(x) + (sigma / 2) sum_j h_j(x)^2", "乘子更新：mu_j^{k+1} = mu_j^k + sigma_k h_j(x^k)", "不等式情形：mu_i^{k+1} = max(0, mu_i^k + sigma_k g_i(x^k))", "对数障碍（内点型）：f(x) - nu sum_i ln(-g_i(x))，nu -> 0", "误差刻画：||x^k - x*|| = O(||mu^k - mu*|| / sigma_k)", "子问题条件数：约 O(sigma) 量级增长"],
        theorems: ["纯二次罚法必须让 sigma -> inf 才能收敛到约束最优解：有限 sigma 下极小点一般不可行，把有限罚参数的解当作最优解是系统性错误", "增广 Lagrange 方法在乘子足够接近 mu* 时只需 sigma 超过某个有限阈值即可使 x* 成为子问题的严格局部极小，这是它优于纯罚法的核心机制", "罚参数增大使子问题条件数以 O(sigma) 增长，Hessian 沿约束法向趋于奇异，故无限增大 sigma 在数值上不可行", "二次罚函数对不等式约束只有一阶光滑性（max(0, g)^2 为 C^1 而非 C^2），直接使用二阶方法会因二阶导不连续而失效", "精确罚函数（如 L1 罚 f + sigma ||h||_1）在 sigma 超过乘子范数上界时有限参数即可精确重现最优解，代价是目标非光滑", "内点障碍法要求严格可行起点且迭代保持严格可行，一旦触界障碍项发散；这与外点罚法允许不可行迭代形成本质区别", "增广 Lagrange 的乘子更新即对偶上升步：其收敛性由对偶函数的凹性与 sigma 提供的正则化共同保证，故非凸问题只能声称局部收敛"],
        generalRequirements: ["必须给出罚参数与乘子的更新策略及终止判据（含约束违反量阈值）", "必须说明子问题求解精度如何随外层迭代加严", "不得在有限罚参数下把子问题解直接当作原问题最优解（增广 Lagrange 除外并需说明乘子收敛）"],
        forbiddenErrors: ["【有限罚当精确】纯二次罚法在有限 sigma 下断言可行与最优", "【条件数忽视】无限制增大 sigma 而不讨论数值病态", "【乘子不更新】使用增广 Lagrange 却只增大 sigma 不更新乘子", "【符号处理错误】不等式乘子更新漏掉 max(0, .) 投影", "【光滑性误设】对 max(0, g)^2 使用需要 C^2 的二阶方法", "【障碍法起点非法】内点法从不严格可行点启动或允许迭代越界"],
        parameterConstraints: { penaltyPositive: "sigma_k > 0 且单调不减（常按 sigma_{k+1} = 10 sigma_k 放大）", multiplierSign: "不等式约束乘子需保持非负", subproblemAccuracy: "子问题容差随外层迭代递减以保证整体收敛", barrierPositive: "障碍参数 nu > 0 且需严格可行内点", localityForNonconvex: "非凸问题结论为局部；全局最优需附加凸性" },
        closureChecks: ["逐轮记录约束违反量与乘子变化并检验单调改善", "说明罚参数上限与子问题条件数的关系", "在终止时验证原始可行性与 KKT 残差"],
        scenarioChecks: { equalityConstrained: ["用增广 Lagrange 迭代求解等式约束问题并给出乘子序列"], inequalityHandling: ["用带投影的乘子更新处理不等式约束"], illConditioningDiscussion: ["估计子问题条件数随 sigma 的增长并说明改用增广 Lagrange 的理由"] },
    },
    // 二阶充分条件与临界锥上的曲率判别。
    "nlp-second-order-sufficiency": {
        definitions: ["约束优化的二阶条件在临界锥（一阶信息未定的方向集合）上考察 Lagrange 函数关于原始变量的二阶导矩阵的定性；充分条件要求在该锥上严格正定，必要条件只给半正定"],
        formulas: ["Lagrange 函数二阶导：W(x*, lambda*, mu*) = Hessian_{xx} L = Hessian f + sum_i lambda_i Hessian g_i + sum_j mu_j Hessian h_j", "临界锥：C(x*) = {d != 0 : grad h_j(x*)^T d = 0; grad g_i(x*)^T d = 0 若 lambda_i > 0; grad g_i(x*)^T d <= 0 若 i in A(x*), lambda_i = 0}", "二阶充分条件：d^T W d > 0 对一切 d in C(x*)", "二阶必要条件（LICQ 下）：d^T W d >= 0 对一切 d in C(x*)", "等式约束情形：取切空间基 Z（列空间为 null(grad h^T)），条件化为 Z^T W Z 正定", "加边矩阵判别：加边 Hessian 的顺序主子式符号规则给出等价判据", "二阶增长：f(x) >= f(x*) + c ||x - x*||^2 在充分条件下局部成立"],
        theorems: ["必须在临界锥上而非全空间上判别：无约束的 Hessian 可以不定而约束最优点仍为严格局部极小，直接用 Hessian f 会给出错误结论", "严格互补失效时临界锥严格大于活跃约束的切空间：lambda_i = 0 的活跃约束贡献单边方向 grad g_i^T d <= 0，遗漏这些方向会把非极小点误判为极小点", "二阶充分条件蕴含二次增长与孤立局部极小，并保证解在数据小扰动下 Lipschitz 稳定，这是灵敏度分析与算法局部收敛率分析的共同前提", "充分条件不必要：f = x^4 在无约束情形是严格极小但二阶导为零，故 W 在临界锥上退化时必须转向高阶分析或直接论证", "二阶必要条件需要约束品性（LICQ 或更弱的条件）；无约束品性时半正定结论可能失效", "乘子必须先由 KKT 系统确定：W 依赖 lambda*、mu*，不同乘子（乘子非唯一时）给出不同 W，此时充分条件需对全体乘子集合讨论", "凸问题不需要二阶条件：KKT 已给出全局最优，引入二阶判别只用于确定解的唯一性与稳定性"],
        generalRequirements: ["必须先解出 KKT 点与对应乘子再构造 W", "必须显式写出临界锥（含严格互补失效时的单边方向）", "W 在临界锥上退化时必须给出高阶或直接论证而不得给出结论"],
        forbiddenErrors: ["【全空间判别】用 Hessian f 或全空间上的 W 代替临界锥上的判别", "【切空间替代临界锥】严格互补失效时仍只用等式化的切空间", "【半定当正定】由 d^T W d >= 0 断言严格局部极小", "【约束二阶导遗漏】W 中漏掉 sum lambda_i Hessian g_i 项", "【乘子未定即判别】不求出乘子就构造二阶矩阵", "【退化仍结论】临界锥上出现零曲率方向时仍断言极小"],
        parameterConstraints: { c2Regularity: "f、g、h 需 C^2", kktPoint: "判别只在满足 KKT 条件的点进行", qualification: "二阶必要条件需 LICQ 等约束品性", strictPositivity: "充分条件要求在临界锥上严格大于零", multiplierSet: "乘子非唯一时需对乘子集合中的相应元素讨论" },
        closureChecks: ["写出 W 的完整表达式含全部约束二阶导项", "构造临界锥的基或不等式描述并检验每个方向", "由充分条件补充二次增长或稳定性结论"],
        scenarioChecks: { equalityTangentSpace: ["用零空间基把条件化为 Z^T W Z 正定并验证"], strictComplementarityFailure: ["lambda_i = 0 的活跃约束单边方向单独检验曲率"], degenerateCurvature: ["临界锥上存在零曲率方向时给出高阶展开分析"] },
    },
};
