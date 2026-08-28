import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数值分析-常微分方程数值解”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMERICAL_ODE_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 单步法的相容性、零稳定性与收敛性等价关系。
    "numode-one-step-consistency-convergence": {
        id: "numode-one-step-consistency-convergence", l2Key: "numerical-ode", name: "单步法相容性与收敛定理", kind: "theorem",
        aliases: ["局部截断误差", "相容阶", "整体误差估计", "Lipschitz常数依赖"],
    },
    // 显式 Runge-Kutta 的 Butcher 表与阶条件。
    "numode-runge-kutta-order-conditions": {
        id: "numode-runge-kutta-order-conditions", l2Key: "numerical-ode", name: "Runge-Kutta 方法与阶条件", kind: "criterion",
        aliases: ["Butcher表", "阶条件", "经典四阶RK", "级数与阶的界"],
    },
    // 线性多步法的根条件与 Dahlquist 等价定理。
    "numode-linear-multistep-root-condition": {
        id: "numode-linear-multistep-root-condition", l2Key: "numerical-ode", name: "线性多步法与根条件", kind: "criterion",
        aliases: ["零稳定性", "根条件", "Dahlquist等价定理", "Adams方法"],
    },
    // 绝对稳定域与 A-稳定性刻画。
    "numode-absolute-stability-region": {
        id: "numode-absolute-stability-region", l2Key: "numerical-ode", name: "绝对稳定域与 A-稳定性", kind: "criterion",
        aliases: ["稳定函数", "绝对稳定域", "A-稳定", "L-稳定"],
    },
    // 两个 Dahlquist 障碍对阶与稳定性的限制。
    "numode-dahlquist-barriers": {
        id: "numode-dahlquist-barriers", l2Key: "numerical-ode", name: "Dahlquist 两个障碍定理", kind: "theorem",
        aliases: ["第一障碍", "第二障碍", "A-稳定阶不超过二", "梯形法最优"],
    },
    // 刚性方程与隐式 BDF 方法。
    "numode-stiff-bdf-methods": {
        id: "numode-stiff-bdf-methods", l2Key: "numerical-ode", name: "刚性问题与 BDF 方法", kind: "algorithm",
        aliases: ["刚性比", "BDF方法", "A(alpha)-稳定", "隐式求解与Newton迭代"],
    },
    // 自适应步长控制与嵌入式误差估计。
    "numode-adaptive-step-control": {
        id: "numode-adaptive-step-control", l2Key: "numerical-ode", name: "自适应步长与嵌入式误差估计", kind: "algorithm",
        aliases: ["嵌入式RK对", "局部误差估计", "步长控制律", "稠密输出"],
    },
    // 隐式 Runge-Kutta 的代数稳定性与 B-稳定性。
    "numode-implicit-rk-algebraic-stability": {
        id: "numode-implicit-rk-algebraic-stability", l2Key: "numerical-ode", name: "隐式 Runge-Kutta 与 B-稳定性", kind: "criterion",
        aliases: ["Gauss配置法", "Radau IIA", "代数稳定性", "单调性与耗散"],
    },
    // 辛积分器与几何数值积分的保结构性质。
    "numode-symplectic-geometric-integration": {
        id: "numode-symplectic-geometric-integration", l2Key: "numerical-ode", name: "辛积分器与保结构方法", kind: "algorithm",
        aliases: ["蛙跳法", "隐式中点法", "后向误差分析", "能量线性漂移"],
    },
    // 微分方程数值解的刚性衰减与阶降现象。
    "numode-order-reduction-stiff-order": {
        id: "numode-order-reduction-stiff-order", l2Key: "numerical-ode", name: "阶降现象与刚性阶", kind: "criterion",
        aliases: ["阶降", "刚性阶", "级阶", "边界层与初值不相容"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMERICAL_ODE_L3_RULES: Record<string, MathV2L3Rules> = {
    // 单步法的局部截断误差、相容阶与整体收敛。
    "numode-one-step-consistency-convergence": {
        definitions: ["单步法写作 y_{n+1} = y_n + h Phi(t_n, y_n, h)，只用当前一层信息推进一步", "局部截断误差 tau_n = (y(t_{n+1}) - y(t_n)) / h - Phi(t_n, y(t_n), h)，把精确解代入格式所产生的残差", "方法相容阶为 p 指对充分光滑解 tau_n = O(h^p)；方法收敛指 max_n ||y_n - y(t_n)|| -> 0 当 h -> 0"],
        formulas: ["整体误差递推 ||e_{n+1}|| <= (1 + h L) ||e_n|| + h ||tau_n||，其中 L 为增量函数关于 y 的 Lipschitz 常数", "由递推得 ||e_n|| <= (exp(L (t_n - t_0)) - 1) / L * max_k ||tau_k||，即整体误差与局部截断误差同阶", "含舍入的估计 ||e_n|| <= exp(L T) (||e_0|| + (T / h) delta)，delta 为每步舍入，说明 h 过小时舍入项按 1 / h 放大", "Euler 法 tau_n = h y''(xi) / 2，故 p = 1；改进 Euler（Heun）p = 2"],
        theorems: ["Lipschitz 条件下初值问题解存在唯一（Picard-Lindelof），这是所有收敛性分析的前提；无 Lipschitz 时数值解可能收敛到非唯一解的某一支", "单步法收敛的充要条件是相容（Phi(t, y, 0) = f(t, y)），且相容阶 p 与整体收敛阶相等；这与多步法必须额外要求零稳定性形成对照", "Gronwall 型不等式是把局部误差累积为整体误差的核心工具，误差放大因子 exp(L T) 在 L T 很大时使先验界失去实用价值", "对刚性问题 L 极大，上述收敛界虽形式正确但完全无用，必须转向绝对稳定性与 B-稳定性分析"],
        generalRequirements: ["给出收敛阶前必须声明解的光滑阶与 f 的 Lipschitz 性，两者缺一则阶的结论不成立", "必须区分局部截断误差、整体误差与舍入误差三者，并说明整体误差不是局部误差的简单相加", "在长时间积分或刚性问题上必须指出 exp(L T) 型界的失效，不能用它作为精度保证"],
        forbiddenErrors: ["【阶数混淆】把局部截断误差的阶直接当作每步误差的绝对大小，或把 O(h^{p+1}) 的每步误差写成整体阶 p+1", "【Lipschitz缺失】对非 Lipschitz 或含奇点的右端函数照搬收敛定理", "【光滑性越界】用 p 阶方法处理只有 C^1 解的问题却宣称 p 阶精度", "【步长无下界】认为 h 越小越精确，忽视舍入项按 delta / h 增长导致的最优步长", "【刚性误判】用 exp(L T) 型误差界为刚性问题的显式方法辩护"],
        parameterConstraints: { lipschitzConstant: "L 为 f 关于 y 在相关区域的 Lipschitz 常数，须在解轨道邻域内一致成立", solutionSmoothness: "p 阶精度要求精确解属于 C^{p+1}", stepPositivity: "h > 0 且 h L 应保持适度，通常要求 h L 不大于 O(1)", roundoffFloor: "存在最优步长约 (delta / C)^{1 / (p+1)}，低于它误差反增" },
        closureChecks: ["检查是否给出 Lipschitz 条件与解的光滑阶", "检查是否明确区分局部与整体误差", "检查是否讨论舍入误差与最优步长"],
        scenarioChecks: { eulerVerification: ["对 y' = y 用 Euler 法数值验证整体误差按 h 一阶下降", "指出误差常数含 exp(T)"], nonLipschitz: ["对 y' = y^{2/3}, y(0) = 0 说明解不唯一，数值收敛结论失效", "禁止套用标准收敛定理"], roundoffFloor: ["把 h 逐步减小到 1e-12 观察误差回升，验证最优步长存在", "说明这是舍入而非方法阶的问题"] },
    },
    // 显式 Runge-Kutta 的 Butcher 表、阶条件与级数下界。
    "numode-runge-kutta-order-conditions": {
        definitions: ["s 级 Runge-Kutta 方法由 Butcher 表 (A, b, c) 决定：k_i = f(t_n + c_i h, y_n + h sum_j a_{ij} k_j)，y_{n+1} = y_n + h sum_i b_i k_i", "A 为严格下三角时方法显式，否则为隐式（对角线非零为对角隐式 DIRK）", "阶条件是使局部截断误差为 O(h^{p+1}) 的一组关于 (A, b, c) 的代数方程，可用有根树系统地枚举"],
        formulas: ["一阶条件 sum_i b_i = 1；二阶条件 sum_i b_i c_i = 1 / 2", "三阶条件 sum_i b_i c_i^2 = 1 / 3 与 sum_{i,j} b_i a_{ij} c_j = 1 / 6", "行和条件 c_i = sum_j a_{ij} 是使方法对非自治问题与自治化形式一致的标准假设", "经典 RK4：c = (0, 1/2, 1/2, 1)，b = (1/6, 1/3, 1/3, 1/6)，局部误差 O(h^5)", "阶 p 的阶条件个数等于阶不超过 p 的有根树个数，p = 1, 2, 3, 4 分别为 1, 2, 4, 8"],
        theorems: ["Butcher 阶理论：方法达到 p 阶当且仅当对每棵阶不超过 p 的有根树，相应的初等权等于该树的密度倒数，这是充要条件而非充分条件的集合", "显式 RK 的级数下界（Butcher 障碍）：p = 5 至少需 6 级，p = 6 至少需 7 级，p = 7 至少需 9 级，p = 8 至少需 11 级，故阶与级数不能一一对应", "显式 RK 的稳定函数是 z 的次数不超过 s 的多项式，因此稳定域必有界，显式方法不可能 A-稳定", "隐式 s 级 Gauss 配置法可达最高阶 2 s，说明隐式性换来阶与稳定性的双重收益"],
        generalRequirements: ["写出方法必须给出完整 Butcher 表并核验行和条件与全部阶条件，不能只报阶数", "验证阶时必须逐条列出所用阶条件，不能仅用一个标量测试问题（如 y' = y）验证", "讨论效率必须以每步函数求值次数而非级数名义比较"],
        forbiddenErrors: ["【阶数虚报】只用 y' = lambda y 验证便宣称高阶，忽视非线性阶条件（含 sum b_i a_{ij} c_j 型）", "【级数误信】认为 s 级显式 RK 总能达到 s 阶，忽视 p >= 5 时的级数障碍", "【显式A稳定】声称某显式 RK 对刚性问题无条件稳定", "【行和缺失】给出 A, b, c 不满足 c_i = sum_j a_{ij} 却按标准阶条件判定", "【隐式当显式】对隐式表直接逐级代入求值，忽视需解非线性方程组"],
        parameterConstraints: { rowSumCondition: "标准阶条件推导假设 c_i = sum_j a_{ij}", explicitStructure: "显式方法要求 A 严格下三角，即 a_{ij} = 0 当 j >= i", stageBound: "显式方法阶 p 与级数 s 满足 p <= s，且 p >= 5 时严格 p < s", smoothnessForOrder: "p 阶需 f 有 p 阶连续偏导数" },
        closureChecks: ["检查是否给出完整 Butcher 表与行和条件", "检查阶条件是否逐条核验而非仅测试线性问题", "检查显式与隐式的求解代价是否分别说明"],
        scenarioChecks: { orderVerification: ["用非线性问题 y' = -y^2 做步长减半实验验证误差按 h^4 下降", "禁止仅用线性问题验证四阶"], stiffFailure: ["对 y' = -1000 y 用 RK4 观察 h 超出稳定域后爆破", "指出这是稳定性而非精度问题"], stageEfficiency: ["比较 RK4 与 5 阶嵌入对的每步求值次数", "说明阶高不必然更省"] },
    },
    // 线性多步法的根条件与 Dahlquist 等价定理。
    "numode-linear-multistep-root-condition": {
        definitions: ["k 步线性多步法为 sum_{j=0}^{k} alpha_j y_{n+j} = h sum_{j=0}^{k} beta_j f_{n+j}，beta_k = 0 时显式", "特征多项式 rho(z) = sum_j alpha_j z^j 与 sigma(z) = sum_j beta_j z^j", "零稳定（满足根条件）指 rho 的所有根位于闭单位圆内且单位圆上的根为单根"],
        formulas: ["相容条件 rho(1) = 0 且 rho'(1) = sigma(1)，等价于阶至少为 1", "阶 p 的条件 sum_j alpha_j j^q = q sum_j beta_j j^{q-1}，q = 0, 1, ..., p，且 q = p+1 时不成立", "Adams-Bashforth 二步显式 y_{n+2} = y_{n+1} + h (3 f_{n+1} - f_n) / 2，阶 2", "Adams-Moulton 隐式梯形 y_{n+1} = y_n + h (f_n + f_{n+1}) / 2，阶 2", "误差常数 C = (rho(e^H) - H sigma(e^H)) 的 H^{p+1} 系数，用于比较同阶方法"],
        theorems: ["Dahlquist 等价定理：线性多步法收敛当且仅当它相容且零稳定；单靠高阶相容不能保证收敛，这是与单步法的本质区别", "违反根条件的方法（如 rho 有模大于 1 的根）会以指数速度放大扰动，误差与步长无关地爆破，即使其相容阶很高", "强零稳定（单位圆上仅 z = 1 一个根）是刚性问题与长时间积分的实用要求；仅弱零稳定的方法（如 Milne 法有根 z = -1）会出现寄生振荡解", "多步法需要 k 个初值，起步值的误差阶必须不低于方法阶，否则整体阶被起步误差压低"],
        generalRequirements: ["判定收敛必须同时验证相容性与根条件，二者缺一不可", "给出方法必须列出 rho 与 sigma 及其根的位置，并说明是否强零稳定", "使用多步法必须交代起步方案及其阶，并说明变步长时系数需重新推导"],
        forbiddenErrors: ["【只看阶数】用阶条件推出高阶便断言收敛，忽略根条件", "【根条件误述】把根条件写成所有根在开单位圆内（漏掉允许单位圆上单根）或允许单位圆上重根", "【起步随意】用一阶 Euler 起步却宣称整体保持四阶", "【变步长直接套】把定步长系数原样用于变步长而不改写为变系数或插值形式", "【寄生解忽视】对弱零稳定方法出现的振荡归因于舍入而非寄生根"],
        parameterConstraints: { rootCondition: "rho 的根须满足 |z| <= 1，且 |z| = 1 的根为单根", consistencyPair: "必须同时满足 rho(1) = 0 与 rho'(1) = sigma(1)", startupOrder: "起步值误差须为 O(h^p) 或更高，p 为方法阶", stepUniformity: "标准系数仅对定步长有效，变步长需重新推导" },
        closureChecks: ["检查相容性与根条件是否分别验证", "检查是否说明强零稳定与寄生根", "检查起步方案的阶是否匹配"],
        scenarioChecks: { unstableExample: ["构造相容阶 3 但 rho 有根 z = -2 的两步法，验证数值解指数爆破", "说明这是零稳定性失效"], startupImpact: ["用 Euler 与 RK4 分别起步四阶 Adams 方法，比较整体阶", "指出起步阶不足会压低整体阶"], parasiticOscillation: ["在 Milne 法上观察 z = -1 引起的奇偶振荡", "禁止归因于舍入误差"] },
    },
    // 稳定函数、绝对稳定域与 A-稳定、L-稳定。
    "numode-absolute-stability-region": {
        definitions: ["以测试问题 y' = lambda y 为基准，一步推进写成 y_{n+1} = R(h lambda) y_n，R 称为稳定函数", "绝对稳定域为 S = { z in C : |R(z)| <= 1 }（多步法则用特征方程所有根模不超过 1 刻画）", "A-稳定指 S 包含整个左半平面 { Re z <= 0 }；L-稳定指 A-稳定且 R(z) -> 0 当 z -> 无穷"],
        formulas: ["显式 Euler R(z) = 1 + z，稳定区间为实轴上 -2 <= h lambda <= 0", "隐式 Euler R(z) = 1 / (1 - z)，梯形法 R(z) = (1 + z / 2) / (1 - z / 2)", "一般 RK 的 R(z) = 1 + z b^T (I - z A)^{-1} 1 = det(I - z A + z 1 b^T) / det(I - z A)", "RK4 的 R(z) = 1 + z + z^2 / 2 + z^3 / 6 + z^4 / 24，实轴稳定区间约 -2.78 <= h lambda <= 0", "线性多步法的稳定性由 rho(w) - z sigma(w) = 0 的根决定"],
        theorems: ["显式 RK 的 R 是多项式，|R(z)| -> 无穷，故稳定域必有界，显式方法对刚性问题必受步长限制而不能 A-稳定", "梯形法 A-稳定但非 L-稳定：|R(z)| -> 1 当 Re z -> -无穷，故极刚性分量不被衰减而被保留为符号交替的振荡", "隐式 Euler L-稳定，能强制阻尼极刚性分量，代价是精度仅一阶且对轻阻尼振荡过度耗散", "对系统 y' = A y，稳定性条件为对 A 的每个特征值 lambda_i 都有 h lambda_i in S；对非正规 A 该条件必要但不充分，需用对数范数或伪谱分析"],
        generalRequirements: ["讨论稳定性必须明确给出稳定函数或特征方程，并说明用的是标量测试问题", "把稳定性与精度分开陈述：稳定不等于精确，A-稳定不保证高阶", "对系统问题必须说明特征值判据的局限，尤其在非正规与变系数情形"],
        forbiddenErrors: ["【稳定即精确】用位于稳定域内证明结果可信，忽视精度要求可能更严格", "【A-与L-混淆】把梯形法当作 L-稳定，或认为 A-稳定即能阻尼刚性振荡", "【显式无界】声称存在 A-稳定的显式 RK 方法", "【特征值滥用】对强非正规矩阵仅按特征值判稳而忽视瞬态放大", "【区间误记】把显式 Euler 稳定条件写成 h lambda <= 0 而漏掉 -2 的下界"],
        parameterConstraints: { testProblem: "标准定义基于 y' = lambda y, Re lambda <= 0", regionMembership: "系统情形要求 h lambda_i in S 对所有特征值成立", explicitBoundedness: "显式方法的 S 必有界，实轴稳定区间长度受级数上界约束", nonNormalCaution: "非正规问题需改用对数范数或 B-稳定性判据" },
        closureChecks: ["检查稳定函数或特征方程是否显式给出", "检查是否区分 A-稳定与 L-稳定", "检查系统与非正规情形的判据局限是否说明"],
        scenarioChecks: { stepLimitCheck: ["对 y' = -100 y 计算显式 Euler 的最大允许步长 0.02，并数值验证越界爆破", "对比隐式 Euler 无步长限制"], trapezoidRinging: ["对极刚性分量用梯形法观察不衰减的符号交替", "指出需 L-稳定方法"], nonNormalTransient: ["构造特征值均在左半平面但瞬态放大显著的非正规系统", "说明特征值判据不足"] },
    },
    // Dahlquist 第一、第二障碍对阶与稳定性的上限。
    "numode-dahlquist-barriers": {
        definitions: ["第一障碍讨论零稳定线性多步法可达的最高相容阶", "第二障碍讨论 A-稳定线性多步法可达的最高阶", "隐式与显式在障碍中给出不同上限，反映稳定性与阶之间的结构性冲突"],
        formulas: ["零稳定 k 步法最高阶：k 为偶数时 p <= k + 2，k 为奇数时 p <= k + 1；显式方法 p <= k", "A-稳定线性多步法 p <= 2，且阶为 2 时误差常数最小者唯一为梯形法", "梯形法误差常数 -1 / 12，二阶 BDF 误差常数 -2 / 9，可据此比较同阶方法", "达到第一障碍上界的方法称 Dahlquist 最优方法，但它们仅弱零稳定，实践中不稳健"],
        theorems: ["Dahlquist 第一障碍：零稳定 k 步法的阶不超过 k + 2（k 偶）或 k + 1（k 奇），因此不能通过单纯提高阶条件数目无限制提阶", "Dahlquist 第二障碍：A-稳定的线性多步法阶不超过 2，故高阶刚性求解器必须放弃 A-稳定（如 BDF 只 A(alpha)-稳定）或放弃多步结构（改用隐式 RK）", "在所有二阶 A-稳定线性多步法中梯形法误差常数最小，这是梯形法在二阶层级上的最优性刻画", "两个障碍只约束线性多步法：隐式 RK（Gauss、Radau IIA）可同时 A-稳定并达到任意高阶，说明障碍是方法类的性质而非普遍原理"],
        generalRequirements: ["引用障碍必须指明适用对象是线性多步法，不能推广到 Runge-Kutta 或一般单步法", "陈述第一障碍必须区分 k 的奇偶与显隐式三种上限", "由第二障碍出发讨论刚性求解器时必须说明实际方案如何绕开（降低稳定性要求或换方法类）"],
        forbiddenErrors: ["【适用范围越界】用第二障碍否认存在高阶 A-稳定方法，忽视隐式 RK", "【奇偶混淆】把第一障碍统一写成 p <= k + 2 而不分奇偶与显隐", "【最优即可用】直接采用达到第一障碍上界的 Dahlquist 最优方法而不提其弱零稳定缺陷", "【BDF误标】称高阶 BDF 为 A-稳定（k >= 3 时只 A(alpha)-稳定）", "【常数忽略】只比较阶而不比较误差常数便断言方法更优"],
        parameterConstraints: { methodClass: "两个障碍仅对线性多步法成立", stepNumberParity: "第一障碍上限依赖 k 的奇偶与是否显式", stabilityRequirement: "第二障碍中的 A-稳定要求整个左半平面包含于稳定域", uniquenessClause: "二阶最小误差常数的唯一性在归一化 sum alpha_j 之后成立" },
        closureChecks: ["检查是否限定方法类为线性多步法", "检查第一障碍的奇偶与显隐分类是否完整", "检查是否指出绕开第二障碍的实际途径"],
        scenarioChecks: { barrierApplication: ["对 k = 3 的零稳定多步法给出阶上限 4 并验证不可达 5", "说明上限来自根条件与阶条件的相容性"], stiffSolverChoice: ["为高阶刚性问题在 BDF 与 Radau IIA 之间选择并说明第二障碍的作用", "禁止寻找高阶 A-稳定多步法"], optimalMethodPitfall: ["对达到上界的方法检查单位圆上根的重数与寄生振荡", "指出其不适合长时间积分"] },
    },
    // 刚性问题的判别与 BDF 方法的实现要点。
    "numode-stiff-bdf-methods": {
        definitions: ["刚性问题指解中含有衰减速率差异极大的分量，使显式方法的步长被最快衰减分量而非精度需求所限制", "刚性比定义为 max |Re lambda_i| / min |Re lambda_i|，仅是启发式指标而非严格定义", "BDF k 步法用后向差分逼近导数：sum_j alpha_j y_{n+j} = h beta_k f_{n+k}，只在最新层取 f"],
        formulas: ["BDF1 即隐式 Euler y_{n+1} = y_n + h f_{n+1}", "BDF2 y_{n+2} - 4 y_{n+1} / 3 + y_n / 3 = 2 h f_{n+2} / 3，阶 2 且 A-稳定", "BDF3 至 BDF6 为 A(alpha)-稳定，alpha 约为 86, 73, 51, 17 度，随阶迅速退化", "每步 Newton 迭代解 (I - h beta_k J) delta = -residual，J = partial f / partial y", "刚性问题的显式步长限制 h <= 2 / max |lambda_i|，与精度需求无关"],
        theorems: ["BDF k 仅在 k <= 6 时零稳定，k >= 7 违反根条件而完全不可用，这是硬性上限而非精度取舍", "BDF1 与 BDF2 A-稳定且 L-稳定，BDF3 以上只 A(alpha)-稳定，故对特征值靠近虚轴的振荡型刚性问题高阶 BDF 会失稳", "刚性求解必须用隐式方法，且线性方程组求解必须用真实 Jacobi 矩阵（或其良好近似）；用简化迭代（如不含 h J 的定点迭代）会把隐式方法的稳定性优势完全抵消，收敛条件退化为 h L < 1", "对刚性问题误差界 exp(L T) 无意义，正确的分析框架是 A-稳定、L-稳定或 B-稳定，以及刚性阶的概念"],
        generalRequirements: ["判定刚性必须结合解的时间尺度与所需积分区间，不能只看刚性比数值", "使用 BDF 必须声明阶不超过 6，并对阶 3 以上给出 A(alpha) 的角度限制", "描述隐式求解必须说明 Newton 迭代与 Jacobi 矩阵的处理方式及其对稳定性的影响"],
        forbiddenErrors: ["【定点替代Newton】对刚性问题用不含 Jacobi 的简单迭代求解隐式方程，导致步长限制回归显式量级", "【BDF越阶】使用 BDF7 或更高阶，忽视零稳定性在 k >= 7 时失效", "【高阶BDF误用】对靠近虚轴的振荡刚性问题使用 BDF5、BDF6", "【刚性比绝对化】仅凭刚性比大就断定刚性，忽视积分区间与解的活跃尺度", "【显式硬撑】对刚性问题坚持显式方法并以减小步长应付，掩盖代价爆炸"],
        parameterConstraints: { bdfOrderLimit: "BDF 零稳定要求 k <= 6", stabilityAngle: "BDF3 到 BDF6 的 A(alpha) 角度随阶单调下降，需与问题特征值分布匹配", jacobianRequirement: "Newton 迭代矩阵为 I - h beta_k J，J 需足够准确或采用近似 Newton 并监控收敛", stiffnessContext: "刚性判定须相对于目标积分区间 T 与精度容差" },
        closureChecks: ["检查是否给出 BDF 的阶上限与稳定角限制", "检查隐式方程求解方式是否明确为 Newton 类", "检查刚性判定是否结合区间与精度而非仅刚性比"],
        scenarioChecks: { stiffBenchmark: ["对 Van der Pol 大参数或 Robertson 化学动力学系统比较显式 RK 与 BDF 的步数", "指出显式方法步数按刚性比增长"], oscillatoryStiff: ["对特征值接近虚轴的问题比较 BDF2 与 BDF5 的稳定表现", "说明 A(alpha) 角度不足导致失稳"], iterationChoice: ["把 Newton 迭代替换为定点迭代观察步长限制回归", "证实隐式稳定性依赖 Jacobi 信息"] },
    },
    // 嵌入式误差估计与步长控制律。
    "numode-adaptive-step-control": {
        definitions: ["嵌入式 RK 对共用同一 Butcher 表的 A 与 c，用两组权 b 与 b-hat 给出阶 p 与 p+1 的两个解，差值作为局部误差估计", "步长控制目标是使每步的局部误差估计满足用户给定的绝对与相对容差组合", "稠密输出指用同一步内的级值构造多项式，在步内任意点给出与方法同阶（或稍低阶）的解值"],
        formulas: ["局部误差估计 est = ||y_{n+1} - y-hat_{n+1}||，按 sc_i = atol + rtol |y_i| 加权取范数", "新步长 h_new = h * min(facmax, max(facmin, fac * (1 / err)^{1 / (p+1)}))，fac 约 0.8 至 0.9", "PI 控制律 h_new = h * err_n^{-alpha} err_{n-1}^{beta}，用于抑制步长振荡", "err <= 1 接受该步，err > 1 拒绝并以缩小的 h 重算", "Dormand-Prince 5(4) 为 7 级、首同末（FSAL）结构，每步实际 6 次函数求值"],
        theorems: ["嵌入式估计给出的是局部误差而非整体误差；即使每步局部误差都受控，整体误差仍按 exp(L T) 型因子累积，故容差不能被解读为全局精度保证", "局部外推（用高阶解作为推进值）通常更精确，但此时误差估计对应的不再是被推进的解，需注意估计的一致性", "拒绝步必须真正缩小步长重算，若为节省成本接受超差步骤则误差控制逻辑失效，方法退化为定步长", "刚性问题上步长控制与稳定性耦合：显式方法的步长会被稳定域而非精度反复压制，表现为大量拒绝步，这是切换隐式方法的信号"],
        generalRequirements: ["必须同时给出绝对容差与相对容差的作用，说明纯相对容差在解过零时失效", "必须区分局部误差控制与整体误差保证，不得把 rtol 当作最终精度", "报告成本必须计入拒绝步与 Jacobi 计算，不能只统计成功步数"],
        forbiddenErrors: ["【容差当精度】把 rtol = 1e-6 解释为解的整体相对误差为 1e-6", "【拒绝步忽略】把估计超差的步照常接受或只警告不重算", "【指数错误】把步长更新指数写成 1 / p 而非 1 / (p+1)", "【无限制放大】允许步长一次放大到任意倍数而不设 facmax，导致反复拒绝", "【纯相对容差】仅用 rtol 而不设 atol，使解接近零时步长被逼到极小"],
        parameterConstraints: { toleranceForm: "误差权重取 sc_i = atol + rtol |y_i|，atol 必须为正", stepFactorBounds: "通常 facmin 约 0.2，facmax 约 5，安全因子 fac 约 0.9", exponentRule: "步长更新指数为 1 / (p+1)，p 为低阶方法的阶", minStepGuard: "需设最小步长阈值以检出奇点或刚性，触发时应报错而非静默继续" },
        closureChecks: ["检查误差估计的加权方式与容差定义是否完整", "检查拒绝步处理与步长上下限是否明确", "检查是否声明局部误差控制不等于整体精度"],
        scenarioChecks: { toleranceSweep: ["把 rtol 从 1e-3 扫到 1e-10，检查实际整体误差与容差的比例关系", "指出比例常数依赖问题条件数"], solutionCrossingZero: ["对解穿越零点的问题验证纯 rtol 导致步长崩塌", "说明必须引入 atol"], stiffDetection: ["统计显式求解器在刚性问题上的拒绝步比例", "把高拒绝率解释为需切换隐式方法"] },
    },
    // 隐式 RK 的配置法、代数稳定性与 B-稳定性。
    "numode-implicit-rk-algebraic-stability": {
        definitions: ["s 级 Gauss 配置法取 c_i 为 Legendre 多项式在 [0, 1] 上的零点，阶为 2 s", "Radau IIA 取 c_s = 1，阶为 2 s - 1；Lobatto IIIC 取端点节点并 L-稳定", "B-稳定（非线性稳定）指对满足单侧 Lipschitz 条件 <f(y) - f(z), y - z> <= 0 的问题，数值解满足 ||y_{n+1} - z_{n+1}|| <= ||y_n - z_n||"],
        formulas: ["代数稳定性条件：B = diag(b) 且 M = B A + A^T B - b b^T 半正定，同时 b_i >= 0", "Gauss 法 R(z) 为 (s, s) 阶 Pade 逼近，|R(i y)| = 1，故 A-稳定且保持能量中性", "Radau IIA 的 R(无穷) = 0，故 L-稳定，适合极刚性问题", "隐式中点法（s = 1 Gauss）y_{n+1} = y_n + h f((y_n + y_{n+1}) / 2)，阶 2、A-稳定且代数稳定", "每步需解 s 个耦合的 d 维非线性方程，Newton 矩阵规模为 s d"],
        theorems: ["代数稳定性（b_i >= 0 且 M 半正定）蕴含 B-稳定，进而蕴含 A-稳定；反之 A-稳定不蕴含 B-稳定，故线性稳定性不足以保证非线性耗散问题的稳定", "Gauss、Radau IA、Radau IIA、Lobatto IIIC 均为代数稳定，Lobatto IIIA（含梯形）B-稳定但不 L-稳定，Lobatto IIIB 与显式方法均不 B-稳定", "s 级隐式 RK 的最高可达阶为 2 s，由 Gauss 配置法唯一达到；这突破了线性多步法的第二障碍", "Gauss 法同时辛且 A-稳定，适合守恒 Hamilton 系统；Radau IIA 强耗散，适合刚性耗散系统，两者不可混用"],
        generalRequirements: ["讨论刚性稳定性必须指明用的是线性（A、L）还是非线性（B、代数）稳定性概念", "给出隐式方法必须交代每步非线性方程组的规模与求解策略", "选择方法必须依据问题是耗散型还是守恒型，并说明相应稳定性概念"],
        forbiddenErrors: ["【线性推非线性】由 A-稳定直接断言对非线性耗散问题的收缩性", "【显式B稳定】声称某显式方法 B-稳定或代数稳定", "【条件缺失】陈述代数稳定性时漏掉 b_i >= 0 或写错 M = B A + A^T B - b b^T", "【方法类混用】用强耗散的 Radau IIA 长时间积分守恒 Hamilton 系统并期待能量守恒", "【成本忽视】把 s 级隐式方法的每步成本当作与显式同级"],
        parameterConstraints: { algebraicStabilityCondition: "要求 b_i >= 0 且 M = B A + A^T B - b b^T 半正定", oneSidedLipschitz: "B-稳定的结论以单侧 Lipschitz 常数不超过 0 为前提", maximalOrder: "s 级隐式 RK 阶不超过 2 s，等号仅 Gauss 达到", systemSize: "Newton 线性系统维数为 s d，可用变换或简化 Newton 降低成本" },
        closureChecks: ["检查稳定性概念是否明确区分线性与非线性", "检查代数稳定性的两个条件是否完整给出", "检查方法选择是否与耗散或守恒结构匹配"],
        scenarioChecks: { nonlinearDissipation: ["对满足单侧 Lipschitz 的非线性问题比较梯形法与显式 RK 的长期行为", "验证 B-稳定给出的收缩性"], stiffDissipative: ["对极刚性耗散问题比较 Gauss 与 Radau IIA 的瞬态处理", "说明 L-稳定的必要性"], costAccounting: ["统计 3 级 Radau IIA 每步的 Newton 迭代与分解成本", "与显式方法按等精度总成本比较"] },
    },
    // 辛积分器、保结构方法与后向误差分析。
    "numode-symplectic-geometric-integration": {
        definitions: ["一步映射保持辛二形式的方法称辛方法，用于哈密顿型问题的长时间积分", "蛙跳（Stormer-Verlet）方法是二阶显式辛方法，对可分离形式 H = T(p) + V(q) 采用位置与动量交错更新", "后向误差分析指把数值解解释为一个修正（摄动）哈密顿系统的精确解，从而解释长期定性行为"],
        formulas: ["Stormer-Verlet：p_{n+1/2} = p_n - h V'(q_n) / 2，q_{n+1} = q_n + h p_{n+1/2} / m，p_{n+1} = p_{n+1/2} - h V'(q_{n+1}) / 2", "隐式中点法对一般（非可分离）哈密顿系统辛，且为二阶 A-稳定", "辛条件（RK 形式）b_i a_{ij} + b_j a_{ji} = b_i b_j 对所有 i, j 成立", "修正哈密顿量 H_h = H + h^2 H_2 + h^4 H_4 + ...，数值解在指数长时间内近似保持 H_h", "辛方法能量误差在 O(h^p) 范围内有界振荡，非辛方法能量误差随时间线性或指数漂移"],
        theorems: ["辛方法不精确守恒原哈密顿量 H，但在指数长时间尺度内几乎守恒修正量 H_h，因此能量误差有界振荡而非单调漂移，这是长时间积分选择辛方法的根本理由", "对定步长辛方法上述结论成立；引入基于局部误差的自适应步长会破坏辛结构并使能量重新漂移，故变步长需用可逆或投影型特殊构造", "Ge-Marsden 型结论：一般情况下不存在同时精确保持辛结构与精确保持能量的定步长方法（除非方法重参数化时间），故必须在两者间取舍", "辛方法对哈密顿系统的一次积分（如角动量、Casimir）不自动守恒，需分裂或投影方法专门处理；投影法会破坏辛性，需权衡"],
        generalRequirements: ["使用辛方法必须声明问题具有哈密顿（或更一般的泊松）结构以及是否可分离", "陈述能量行为必须区分精确守恒、有界振荡与漂移三种情形，不可笼统称能量守恒", "讨论变步长必须指出对辛结构的破坏及补救构造"],
        forbiddenErrors: ["【能量守恒误断】声称辛方法精确守恒哈密顿量", "【结构缺失】对非哈密顿或含耗散项的系统使用辛方法并期待长期保结构", "【自适应破坏】在辛方法上直接套用标准嵌入式变步长控制而仍宣称保结构", "【辛条件误写】漏掉辛条件对所有指标对成立的要求或写成单个等式", "【不可分离误用】把仅对可分离哈密顿量成立的显式蛙跳公式用于一般 H(p, q) 的耦合情形"],
        parameterConstraints: { hamiltonianStructure: "方法的保结构结论要求问题具有哈密顿结构且无耗散项", separability: "显式蛙跳格式要求 H = T(p) + V(q) 可分离", fixedStepRequirement: "修正哈密顿量的长时间近似守恒结论以定步长为前提", stepBound: "后向误差分析的渐近展开要求 h 小于与哈密顿量解析性相关的阈值" },
        closureChecks: ["检查是否声明哈密顿结构与可分离性", "检查能量行为的表述是否为有界振荡而非精确守恒", "检查定步长前提与变步长后果是否说明"],
        scenarioChecks: { keplerLongTime: ["对二体问题用蛙跳与 RK4 长时间积分，比较能量误差的有界振荡与线性漂移", "指出高阶非辛方法短期更精确但长期更差"], separabilityCheck: ["对含 p q 交叉项的哈密顿量说明显式蛙跳不适用，改用隐式中点法", "验证辛条件"], adaptiveConflict: ["在辛方法上启用标准变步长控制观察能量漂移复现", "说明需可逆步长策略"] },
    },
    // 刚性问题上的阶降现象与刚性阶。
    "numode-order-reduction-stiff-order": {
        definitions: ["阶降指方法在刚性问题上实际观察到的收敛阶低于其经典阶", "刚性阶（stiff order）指在极刚性极限下方法保持的收敛阶，由级阶（stage order）与稳定函数在无穷处的行为共同决定", "级阶 q 指各内部级对精确解的逼近阶，满足 sum_j a_{ij} c_j^{k-1} = c_i^k / k 直到 k = q"],
        formulas: ["Prothero-Robinson 模型 y' = lambda (y - g(t)) + g'(t)，Re lambda -> -无穷，用于检测阶降", "显式 RK 的级阶通常为 1（首级除外），故在刚性极限下阶降至 1 或 2", "Radau IIA（s 级）级阶为 s，经典阶 2 s - 1，刚性阶为 s + 1，故仍有阶降但幅度可控", "Gauss 法级阶为 s，但因 |R(无穷)| = 1 在极刚性下不适用", "BDF 方法级阶等于经典阶，故在刚性极限下基本无阶降，这是它在刚性求解器中长期占据地位的原因"],
        theorems: ["经典阶只在 h 远小于所有时间尺度时可观察；当 h |lambda| 很大时，可观察阶由级阶与刚性阶决定，故经典阶高的方法未必在刚性区间更精确", "阶降与稳定性无关：一个 L-稳定方法仍可能严重阶降，因此稳定性分析不能替代刚性阶分析", "边界层与初值不相容会引发额外精度损失：若初值不在慢流形上，隐式方法在第一步内穿越边界层，误差表现与内层行为相关而非经典阶", "对微分代数方程（指标 1 及以上）阶降更严重，代数变量的阶通常低于微分变量，需按变量分别讨论阶"],
        generalRequirements: ["报告刚性问题上的收敛阶必须说明是经典阶还是刚性极限下的可观察阶", "必须给出级阶信息，并说明它如何限制刚性阶", "涉及初值不相容或边界层时必须单独讨论首几步的误差行为"],
        forbiddenErrors: ["【经典阶外推】用非刚性测试问题拟合出的阶宣称在刚性问题上同样成立", "【稳定性替代】以方法 A-稳定或 L-稳定为由否认阶降的可能", "【级阶忽视】比较方法只看经典阶而不看级阶", "【边界层混淆】把初值不相容引起的首步大误差归因于步长过大并盲目减小步长", "【DAE同阶】对微分代数方程假定所有变量具有相同收敛阶"],
        parameterConstraints: { stageOrderDefinition: "级阶 q 由条件 sum_j a_{ij} c_j^{k-1} = c_i^k / k（k <= q）确定", stiffLimitRegime: "刚性阶描述 h |lambda| >> 1 的区间，与 h |lambda| << 1 的经典阶区间需分开", consistentInitialData: "无额外阶损失要求初值满足与慢流形（或代数约束）的相容条件", indexCondition: "DAE 情形需给出指标，指标越高阶降越严重" },
        closureChecks: ["检查所报阶是否标明适用区间（经典或刚性极限）", "检查是否给出级阶并说明其对刚性阶的限制", "检查初值相容性与边界层影响是否讨论"],
        scenarioChecks: { protheroRobinson: ["在 Prothero-Robinson 问题上对高阶显式与 Radau IIA 做步长实验观察阶降", "对比 BDF 的无明显阶降"], stageOrderComparison: ["比较级阶为 1 与级阶为 s 的两个同经典阶方法在刚性区间的实际误差", "说明级阶主导"], inconsistentInitial: ["给出不在慢流形上的初值观察首步大误差", "禁止仅靠减小步长解释"] },
    },
};
