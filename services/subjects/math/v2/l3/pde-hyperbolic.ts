import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“偏微分方程-双曲型方程”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const PDE_HYPERBOLIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 波方程基本解与各维显式求解公式。
    "hyperbolic-wave-equation-solution-formulas": {
        id: "hyperbolic-wave-equation-solution-formulas", l2Key: "pde-hyperbolic", name: "波方程显式解公式", kind: "formula",
        aliases: ["d'Alembert公式", "Kirchhoff公式", "Poisson公式", "球面平均法"],
    },
    // 特征线与特征曲面方法。
    "hyperbolic-characteristics-method": {
        id: "hyperbolic-characteristics-method", l2Key: "pde-hyperbolic", name: "特征线法与特征曲面", kind: "algorithm",
        aliases: ["特征线", "特征方程", "Riemann不变量", "特征相交"],
    },
    // 能量估计与唯一性。
    "hyperbolic-energy-estimate-uniqueness": {
        id: "hyperbolic-energy-estimate-uniqueness", l2Key: "pde-hyperbolic", name: "双曲方程能量估计与唯一性", kind: "theorem",
        aliases: ["能量守恒", "能量不等式", "Gronwall", "唯一性"],
    },
    // 依赖域、影响域与有限传播速度。
    "hyperbolic-domain-of-dependence": {
        id: "hyperbolic-domain-of-dependence", l2Key: "pde-hyperbolic", name: "依赖域与有限传播速度", kind: "theorem",
        aliases: ["依赖域", "影响域", "光锥", "有限传播速度"],
    },
    // Huygens 原理与色散、衰减性质。
    "hyperbolic-huygens-principle-decay": {
        id: "hyperbolic-huygens-principle-decay", l2Key: "pde-hyperbolic", name: "Huygens 原理与解的衰减", kind: "object",
        aliases: ["强Huygens原理", "奇偶维差异", "波尾", "衰减率"],
    },
    // 守恒律弱解与 Rankine-Hugoniot 跳跃条件。
    "hyperbolic-weak-solution-rankine-hugoniot": {
        id: "hyperbolic-weak-solution-rankine-hugoniot", l2Key: "pde-hyperbolic", name: "守恒律弱解与激波条件", kind: "criterion",
        aliases: ["守恒律弱解", "Rankine-Hugoniot", "激波速度", "跳跃条件"],
    },
    // 熵条件与弱解唯一性判据。
    "hyperbolic-entropy-condition-uniqueness": {
        id: "hyperbolic-entropy-condition-uniqueness", l2Key: "pde-hyperbolic", name: "熵条件与允许解判据", kind: "criterion",
        aliases: ["Lax熵条件", "Oleinik条件", "Kruzhkov熵解", "粘性消失"],
    },
    // Riemann 问题的激波、稀疏波与接触间断结构。
    "hyperbolic-riemann-problem-wave-structure": {
        id: "hyperbolic-riemann-problem-wave-structure", l2Key: "pde-hyperbolic", name: "Riemann 问题波结构", kind: "object",
        aliases: ["Riemann问题", "稀疏波", "接触间断", "自相似解"],
    },
    // 色散估计与 Strichartz 不等式。
    "hyperbolic-strichartz-dispersive-estimate": {
        id: "hyperbolic-strichartz-dispersive-estimate", l2Key: "pde-hyperbolic", name: "色散估计与 Strichartz 不等式", kind: "theorem",
        aliases: ["Strichartz估计", "允许指标", "色散衰减", "局部光滑"],
    },
    // 对称双曲系统的适定性与双曲性判据。
    "hyperbolic-symmetric-system-wellposedness": {
        id: "hyperbolic-symmetric-system-wellposedness", l2Key: "pde-hyperbolic", name: "对称双曲系统适定性", kind: "theorem",
        aliases: ["对称双曲系统", "严格双曲", "Friedrichs对称化", "Sobolev适定性"],
    },
});

// 规则字段固定为 8 项：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const PDE_HYPERBOLIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // 波方程一维、三维、二维显式解公式及其正则性代价。
    "hyperbolic-wave-equation-solution-formulas": {
        definitions: ["初值问题 u_tt - c^2 Delta u = 0，u(0) = g，u_t(0) = h", "球面平均 U(x, r, t) = 平均值 over 半径 r 球面", "Duhamel 项处理非齐次源"],
        formulas: ["一维 d'Alembert：u = (g(x + ct) + g(x - ct)) / 2 + (1 / 2c) int_{x-ct}^{x+ct} h(y) dy", "三维 Kirchhoff：u = 平均 over |y - x| = ct 的 (t h + g + grad g · (y - x))", "二维 Poisson：u = (1 / 2 pi c) int_{|y-x| < ct} (t h(y) + g(y) + grad g · (y-x)) / sqrt(c^2 t^2 - |y-x|^2) dy", "非齐次 Duhamel：u(t) = int_0^t S(t - s) f(s) ds，S 为齐次解算子"],
        theorems: ["三维公式导数落在初值上，故解的正则性比初值低一阶（焦散/正则性损失），不能断言同阶光滑", "偶数维解在整个圆盘内积分（波尾存在），奇数维（n >= 3）只依赖球面上的值", "解公式对 g in C^{k+1}、h in C^k 给出 C^k 解，光滑性要求不可省", "球面平均法把高维问题化为 Euler-Poisson-Darboux 方程，仅在奇数维得到简洁降维"],
        generalRequirements: ["按维数选择正确公式，不得用一维公式套高维", "写公式必须标明积分区域是球面还是实心球", "非齐次项必须通过 Duhamel 而非直接叠加"],
        forbiddenErrors: ["【维数混用】三维问题使用 d'Alembert 公式", "【区域误设】把二维 Poisson 公式的实心圆盘写成圆周", "【正则性高估】断言解与初值同阶光滑", "【Duhamel 遗漏】非齐次方程直接写齐次解公式", "【速度遗漏】公式中丢掉波速 c 的量纲因子"],
        parameterConstraints: { dimensionSelection: "n = 1 / 2 / 3 各有不同公式", initialRegularity: "g in C^{k+1}, h in C^k", waveSpeed: "c > 0 且需在积分半径中出现", integrationDomain: "奇数维取球面、偶数维取实心球" },
        closureChecks: ["确认维数与公式匹配", "确认积分区域类型", "确认初值正则性假设", "确认非齐次项的 Duhamel 处理"],
        scenarioChecks: { threeDimensionalRadiation: ["用 Kirchhoff 公式求解", "确认正则性下降一阶"], oneDimensionalString: ["用 d'Alembert 并处理边界反射", "确认奇延拓或偶延拓"], sourceTermProblem: ["用 Duhamel 叠加", "确认源项时间连续"] },
    },
    // 特征线法、Riemann 不变量与特征相交导致的破裂。
    "hyperbolic-characteristics-method": {
        definitions: ["一阶方程 a(x, t, u) u_t + b u_x = c 的特征曲线", "特征方程组 dx/dt = lambda_k(u)", "Riemann 不变量：沿某族特征守恒的量"],
        formulas: ["标量守恒律 u_t + f(u)_x = 0 的特征：dx/dt = f'(u)，沿特征 u 常值", "隐式解：u = g(x_0)，x = x_0 + f'(g(x_0)) t", "破裂时间：T_b = -1 / min_{x_0} (f''(g) g'(x_0))（当该量为负时）", "特征形式（p 系统）：沿 C_{+-} 特征 dw_{+-} = 0，w_{+-} 为 Riemann 不变量"],
        theorems: ["特征线法仅在特征不相交的区域给出经典解；相交处必须转入弱解框架", "对严格双曲系统，n 个实特征速度给出 n 族特征线与 n 个 Riemann 不变量（二阶系统情形）", "非线性方程即使初值光滑也会在有限时间破裂（梯度爆破），线性方程不会", "边界处特征方向决定定解条件个数：只有入射特征对应可给的边界条件"],
        generalRequirements: ["用特征线法必须检验特征是否相交并给出有效时间区间", "写隐式解必须说明可解性（隐函数定理条件）", "边界条件个数必须与入射特征数一致"],
        forbiddenErrors: ["【破裂忽视】在特征相交后继续用经典特征解", "【隐式解可解性缺失】不检查 1 + f''(g) g' t != 0", "【边界条件超定】在出射特征上强加边界条件", "【不变量误设】对非严格双曲系统硬造 Riemann 不变量", "【线性外推】把线性方程的全局光滑性结论套到非线性方程"],
        parameterConstraints: { hyperbolicityCondition: "特征速度需实且（严格双曲时）互异", solvabilityWindow: "t < T_b 才有经典解", boundaryCharacteristicCount: "边界条件数 = 入射特征数", fluxConvexity: "破裂时间公式需 f 二阶可导" },
        closureChecks: ["确认特征是否相交与有效时间", "确认隐函数条件", "确认边界条件与特征方向匹配", "确认双曲性假设"],
        scenarioChecks: { burgersEquationEvolution: ["用特征线得隐式解并算破裂时间", "确认 g' < 0 区域"], gasDynamicsRiemannInvariants: ["用 Riemann 不变量化简", "确认严格双曲"], boundaryValueHyperbolic: ["按入射特征给边界条件", "确认特征方向符号"] },
    },
    // 能量方法给出的先验估计与唯一性。
    "hyperbolic-energy-estimate-uniqueness": {
        definitions: ["能量 E(t) = (1/2) int (u_t^2 + c^2 |grad u|^2) dx", "加权能量与 Gronwall 结构", "乘子法：用 u_t 或 x · grad u 作乘子"],
        formulas: ["守恒：齐次自由边界或紧支撑情形 dE/dt = 0", "非齐次估计：dE/dt = int f u_t dx <= ||f|| sqrt(2 E)，故 sqrt(E(t)) <= sqrt(E(0)) + (1/sqrt(2)) int_0^t ||f|| ds", "Gronwall 型：E(t) <= E(0) e^{C t} 当低阶项系数有界", "高阶能量：E_k(t) 控制 H^k 范数，需初值在 H^k × H^{k-1}"],
        theorems: ["能量估计给出唯一性：两解之差初值为零则能量恒零，故解唯一（需边界项消失）", "边界项 int_{partial Omega} u_t (partial_n u) dS 必须由边界条件（Dirichlet、Neumann 或吸收）控制，否则估计不成立", "能量方法对变系数与低阶扰动仍有效，只是常数变为指数增长因子", "能量守恒不蕴含 L^infinity 有界或衰减；衰减需色散或局部能量衰减定理"],
        generalRequirements: ["写能量估计必须显式处理边界项", "对非齐次或变系数情形必须用 Gronwall 而非直接守恒", "由能量得唯一性必须说明所在解类（弱解或强解）"],
        forbiddenErrors: ["【边界项忽略】有界区域上直接断言能量守恒", "【守恒滥用】变系数或有耗散项时仍写 dE/dt = 0", "【范数错配】用一阶能量控制 H^2 范数", "【衰减误推】由能量守恒断言解逐点衰减到零", "【解类混淆】对弱解直接使用逐点乘子而不做正则化"],
        parameterConstraints: { boundaryCondition: "需 Dirichlet / Neumann / 吸收边界使边界项非正", coefficientRegularity: "变系数需 Lipschitz 以保证 Gronwall", initialSpace: "E_k 需初值属 H^k × H^{k-1}", timeInterval: "指数因子随 t 增长，长时间结论需额外条件" },
        closureChecks: ["确认边界项处理", "确认是否守恒或仅有上界", "确认能量阶数与范数对应", "确认解类与乘子合法性"],
        scenarioChecks: { dirichletWaveProblem: ["边界项消失得能量守恒", "确认 u_t = 0 on boundary"], dampedWaveEquation: ["耗散项给出能量衰减", "确认阻尼符号"], uniquenessProof: ["对差解用零初值能量", "确认线性性与边界一致"] },
    },
    // 依赖域、影响域与有限传播速度。
    "hyperbolic-domain-of-dependence": {
        definitions: ["依赖域 D(x_0, t_0) = {|x - x_0| <= c t_0}", "影响域：初值扰动可影响的时空区域", "后向光锥与前向光锥"],
        formulas: ["局部能量：E(t; B_{R - ct}) 关于 t 单调不增（截断锥上的能量不等式）", "有限传播：supp u(t) subset supp(g, h) + B_{ct}", "多维锥面：|x - x_0| = c (t_0 - t) 为特征锥", "系统情形速度上界：c_max = max_k sup |lambda_k|"],
        theorems: ["双曲方程解在锥外为零：初值在球外为零则解在相应光锥外为零，这是与抛物型方程（无限传播速度）的本质区别", "依赖域结论由截断锥上的能量不等式证明，故只需局部能量有限而无需全局条件", "对变系数或准线性系统，传播速度由特征速度上界给出，不可用常系数波速", "有限传播速度不排除锥内的奇性聚焦（焦散、几何光学奇点）"],
        generalRequirements: ["给出依赖域必须写出与波速一致的锥开口", "非常系数情形必须用特征速度上界", "断言解支撑必须明确初值支撑与时间"],
        forbiddenErrors: ["【锥开口错】依赖域用错波速或写成柱体", "【抛物类比】断言双曲方程解瞬时非零传播到全空间", "【速度上界忽视】变系数问题用固定 c 定锥", "【全局条件误设】做局部依赖域论证时要求全局有限能量", "【奇性排除】由有限传播速度断言解在锥内光滑"],
        parameterConstraints: { coneAperture: "锥斜率 = 1 / c_max", speedBound: "需特征速度一致有界", localEnergyFiniteness: "只需截断球上能量有限", supportCondition: "结论依赖初值支撑紧" },
        closureChecks: ["确认锥开口与波速一致", "确认速度上界来源", "确认局部能量假设", "确认结论仅关于支撑而非光滑性"],
        scenarioChecks: { causalitySetting: ["用光锥说明因果性", "确认 c 为最大特征速度"], localizedInitialData: ["紧支撑初值得紧支撑解", "确认支撑扩张速率"], variableCoefficientCase: ["用 sup 特征速度定锥", "确认系数有界"] },
    },
    // Huygens 原理的奇偶维差异与解的时间衰减。
    "hyperbolic-huygens-principle-decay": {
        definitions: ["强 Huygens 原理：解在 t 时刻只依赖初值支撑的球面而非实心球", "波尾（tail）现象", "局部能量衰减"],
        formulas: ["三维自由波：||u(t)||_{L^infinity} <= C / t（紧支撑光滑初值）", "一般奇维 n >= 3：色散衰减 ||u(t)||_{L^infinity} <~ t^{-(n-1)/2}", "偶维：解在锥内不为零，衰减 t^{-(n-1)/2} 但带波尾", "局部能量衰减（外部区域、非陷俘几何）：E_{loc}(t) <= C e^{-a t}（奇维）"],
        theorems: ["强 Huygens 原理只在奇数空间维 n >= 3 成立；n = 1 与所有偶数维不成立（n = 1 时波前后为常态区域）", "偶维波尾使初值扰动的影响长期存在，故不能用奇维直觉分析二维问题", "衰减率依赖维数与初值支撑紧性；无紧支撑或仅 L^2 初值时逐点衰减一般失效", "陷俘几何（存在被困测地线）会破坏指数局部能量衰减，只留对数或多项式速率"],
        generalRequirements: ["讨论 Huygens 原理必须先固定空间维数的奇偶", "给衰减率必须写维数指数与初值假设", "断言指数局部衰减必须排除陷俘几何"],
        forbiddenErrors: ["【奇偶不分】对二维问题断言强 Huygens 原理", "【一维误判】认为 n = 1 满足强 Huygens 原理", "【衰减率维数错】把 t^{-(n-1)/2} 写成与维数无关的固定率", "【初值假设缺失】对一般 L^2 初值断言逐点衰减", "【几何忽视】在陷俘区域断言指数能量衰减"],
        parameterConstraints: { dimensionParity: "强 Huygens 需 n 奇且 n >= 3", decayExponent: "自由波 L^infinity 衰减指数 (n-1)/2", initialSupport: "逐点衰减需紧支撑或充分衰减初值", geometricCondition: "指数局部衰减需非陷俘" },
        closureChecks: ["确认维数奇偶与 Huygens 结论", "确认衰减指数含维数", "确认初值支撑与光滑性", "确认几何非陷俘假设"],
        scenarioChecks: { threeDimensionalSharpSignal: ["奇维得干净波前", "确认 n = 3"], twoDimensionalTail: ["偶维存在波尾", "确认锥内非零"], exteriorDomainDecay: ["非陷俘外部区域指数衰减", "确认障碍星形或凸"] },
    },
    // 守恒律弱解定义与 Rankine-Hugoniot 跳跃关系。
    "hyperbolic-weak-solution-rankine-hugoniot": {
        definitions: ["弱解：对所有测试函数 phi in C_c^1 满足 int int (u phi_t + f(u) phi_x) dx dt + int u_0 phi(0) dx = 0", "间断曲线 x = s(t)", "跳跃 [u] = u_r - u_l"],
        formulas: ["Rankine-Hugoniot：s' [u] = [f(u)]，即 s' = (f(u_r) - f(u_l)) / (u_r - u_l)", "Burgers 情形：s' = (u_l + u_r) / 2", "系统情形：s [U] = [F(U)]（Hugoniot 曲线族）", "守恒形式与非守恒形式在光滑解处等价、在间断处不等价"],
        theorems: ["弱解一般不唯一：仅靠 Rankine-Hugoniot 不能排除非物理激波，必须附加熵条件", "改写方程为不同守恒形式（如 u_t + (u^2/2)_x 与 (u^2)_t + ((2/3)u^3)_x）会给出不同的激波速度，故守恒变量的选取本质", "弱解允许 u in L^infinity，无需可微；导数只在分布意义下存在", "接触间断满足 R-H 但两侧特征速度相同，需与激波区分"],
        generalRequirements: ["写弱解必须给出测试函数类与初值项", "算激波速度必须声明所用守恒形式", "只用 R-H 得到的解必须再做熵筛选"],
        forbiddenErrors: ["【唯一性误断】仅用 R-H 条件断言弱解唯一", "【守恒形式随意】任意乘除方程后仍用原激波速度", "【测试函数缺失】弱解定义中漏掉初值项或紧支撑要求", "【可微性强加】对弱解逐点求导", "【间断类型混淆】把接触间断当作激波处理"],
        parameterConstraints: { conservationFormFixed: "必须固定守恒变量与通量", jumpNonDegeneracy: "R-H 除法需 u_r != u_l", solutionClass: "u in L^infinity 或 BV", testFunctionClass: "phi in C_c^1 含 t = 0" },
        closureChecks: ["确认弱解定义完整", "确认守恒形式已固定", "确认是否补充熵条件", "确认间断类型判定"],
        scenarioChecks: { burgersShockSpeed: ["用平均值公式算激波速度", "确认守恒形式为 u_t + (u^2/2)_x"], systemHugoniotCurve: ["求 Hugoniot 曲线", "确认状态可连接"], nonuniquenessExample: ["构造非物理弱解说明需熵条件", "确认 R-H 成立"] },
    },
    // 熵条件（Lax、Oleinik、Kruzhkov）与允许解筛选。
    "hyperbolic-entropy-condition-uniqueness": {
        definitions: ["熵对 (eta, q)：eta 凸且 q' = eta' f'", "熵解：满足 eta(u)_t + q(u)_x <= 0（分布意义）", "粘性消失极限 u^eps 满足 u_t + f(u)_x = eps u_xx"],
        formulas: ["Lax 熵条件（凸通量）：f'(u_l) > s > f'(u_r)，即左态特征速度大于激波速度", "Oleinik E 条件（一般通量）：对 u 介于 u_l, u_r 之间，(f(u) - f(u_l)) / (u - u_l) >= s >= (f(u) - f(u_r)) / (u - u_r)", "Kruzhkov 熵族：eta = |u - k|，q = sign(u - k)(f(u) - f(k))，对所有 k in R", "L^1 收缩：||u(t) - v(t)||_{L^1} <= ||u(0) - v(0)||_{L^1}"],
        theorems: ["Kruzhkov 定理：标量多维守恒律的熵解在 L^infinity cap BV 中存在唯一，且 L^1 依赖初值连续", "凸通量下 Lax 条件等价于 Oleinik 条件；非凸通量下 Lax 条件不足，必须用 Oleinik（可能出现复合波）", "熵条件等价于粘性消失极限的可达性，故它是物理筛选而非附加人为约定", "系统情形无一般唯一性定理；小 BV 初值下由 Glimm 格式与 Bressan 理论给出唯一性"],
        generalRequirements: ["用 Lax 条件前必须验证通量凸性", "断言唯一性必须限定标量方程与解类（L^infinity cap BV）", "写熵不等式必须指明不等号方向与分布意义"],
        forbiddenErrors: ["【凸性缺失】非凸通量下只用 Lax 条件判定允许性", "【方向反置】把熵不等式写成 >= 0", "【系统唯一性外推】把 Kruzhkov 唯一性用于方程组", "【熵族不全】只取单个熵函数就断言熵解", "【稀疏激波允许】接受违反熵条件的膨胀间断"],
        parameterConstraints: { fluxConvexity: "Lax 条件需 f 凸（或凹并调整方向）", entropyConvexity: "eta 需凸", solutionSpace: "唯一性在 L^infinity cap BV", inequalitySign: "熵产生非正（分布意义）" },
        closureChecks: ["确认通量凸性与所选熵条件匹配", "确认熵不等式方向", "确认标量或系统的适用范围", "确认解空间与初值假设"],
        scenarioChecks: { burgersAdmissibility: ["用 u_l > u_r 判定允许激波", "确认通量凸"], nonconvexFluxComposite: ["用 Oleinik 条件构造复合波", "确认凸包构造"], viscousLimitJustification: ["用粘性消失说明熵条件", "确认 eps -> 0 一致有界"] },
    },
    // Riemann 问题的自相似波结构与解的构造。
    "hyperbolic-riemann-problem-wave-structure": {
        definitions: ["Riemann 初值：u_0 = u_l (x < 0)，u_r (x > 0)", "自相似解 u = U(x / t)", "波族：激波、稀疏波、接触间断", "Hugoniot 曲线与积分曲线"],
        formulas: ["Burgers 稀疏波（u_l < u_r）：u = u_l (x < u_l t)，x / t (u_l t <= x <= u_r t)，u_r (x > u_r t)", "Burgers 激波（u_l > u_r）：间断沿 x = ((u_l + u_r)/2) t", "稀疏波沿积分曲线：Riemann 不变量常值且 lambda_k 单调增", "n 系统解结构：n 个波按特征速度排序连接 n + 1 个常状态"],
        theorems: ["严格双曲且各特征真非线性（genuinely nonlinear）时，小振幅 Riemann 问题有唯一允许解（Lax 定理）", "解按 k 波族排序：第 k 波速度介于 lambda_{k-1} 与 lambda_{k+1} 之间，顺序不可交换", "线性退化特征给出接触间断（不自加强也不膨胀），真非线性特征给出激波或稀疏波", "大数据 Riemann 问题可能无解或出现真空（气体动力学中的真空状态）"],
        generalRequirements: ["构造 Riemann 解必须按特征速度从左到右排序波", "每段波必须声明是激波（满足熵条件）还是稀疏波", "使用 Lax 定理必须声明小振幅与真非线性"],
        forbiddenErrors: ["【波序错乱】把慢波放在快波右侧", "【类型误配】用激波连接应为稀疏波的状态（u_l < u_r 的凸通量情形）", "【线性退化混淆】把接触间断当真非线性波处理", "【真空忽视】大数据下不检验真空出现", "【自相似性破坏】给出显含 x 与 t 而非 x/t 的解"],
        parameterConstraints: { strictHyperbolicity: "特征速度互异", genuineNonlinearity: "grad lambda_k · r_k != 0", amplitudeSmallness: "Lax 唯一性需 |u_r - u_l| 小", waveOrdering: "波速须单调递增" },
        closureChecks: ["确认波族排序", "确认每段波类型与熵条件", "确认真非线性或线性退化判定", "确认自相似形式"],
        scenarioChecks: { scalarRiemannProblem: ["按 u_l 与 u_r 大小判激波或稀疏波", "确认通量凸性"], eulerEquationsRiemann: ["构造激波-接触-稀疏三波结构", "确认中间压力速度匹配"], vacuumFormation: ["检验大数据是否产生真空", "确认稀疏波不相接"] },
    },
    // 色散估计与 Strichartz 不等式的允许指标。
    "hyperbolic-strichartz-dispersive-estimate": {
        definitions: ["自由波传播子 e^{i t |D|}", "时空范数 L_t^q L_x^r", "允许（admissible）指标对", "齐次 Sobolev 空间 H^s"],
        formulas: ["色散衰减：||e^{i t |D|} P_1 f||_{L^infinity} <~ t^{-(n-1)/2} ||f||_{L^1}（频率局部化）", "波方程 Strichartz：||u||_{L_t^q L_x^r} <~ ||u_0||_{H^s} + ||u_1||_{H^{s-1}} + ||F||_{L_t^{q'} L_x^{r'}}", "尺度关系：1/q + n/r = n/2 - s", "允许条件（波）：1/q + (n-1)/(2 r) <= (n-1)/4，q > 2"],
        theorems: ["Strichartz 估计由色散估计加 TT^* 论证与 Hardy-Littlewood-Sobolev 得到，不能由能量估计单独推出", "端点情形（如 n = 3 的 q = 2）常失效或需 Besov 空间修正，不能默认取到端点", "尺度不变关系是必要条件：不满足尺度关系的指标组合估计必假", "变系数或有界区域上 Strichartz 估计需额外几何假设（非陷俘、Lipschitz 度量），一般不自动成立"],
        generalRequirements: ["写 Strichartz 估计必须同时给出尺度关系与允许条件", "使用端点指标必须说明其成立性或改用 Besov 修正", "对非平坦背景必须声明几何条件"],
        forbiddenErrors: ["【尺度不匹配】给出违反 1/q + n/r = n/2 - s 的指标", "【端点滥用】默认端点 Strichartz 成立", "【允许条件缺失】只写尺度关系不写 q > 2 与 r 限制", "【几何忽视】在有障碍区域直接引用自由空间估计", "【维数遗漏】把 t^{-(n-1)/2} 写成与维数无关"],
        parameterConstraints: { scalingRelation: "1/q + n/r = n/2 - s", admissibilityRange: "波方程需 1/q + (n-1)/(2r) <= (n-1)/4 且 q > 2", dimensionCondition: "n >= 2 才有非平凡色散", geometricAssumption: "变系数需非陷俘或全局光滑度量" },
        closureChecks: ["确认尺度关系", "确认允许指标范围", "确认是否触及端点", "确认背景几何假设"],
        scenarioChecks: { nonlinearWaveLocalTheory: ["用 Strichartz 做压缩映射", "确认非线性项落在对偶空间"], criticalExponentProblem: ["用尺度关系定临界指标", "确认 s 的取值"], obstacleScattering: ["外部区域需非陷俘假设", "确认障碍凸性"] },
    },
    // 对称双曲系统的适定性与双曲性判据。
    "hyperbolic-symmetric-system-wellposedness": {
        definitions: ["一阶系统 A_0 U_t + sum_j A_j U_{x_j} + B U = F", "Friedrichs 对称双曲：A_0 对称正定、A_j 对称", "严格双曲：符号矩阵 sum_j A_j xi_j 有 n 个互异实特征值", "对称化子 S(xi)"],
        formulas: ["能量泛函 E(t) = <A_0 U, U>，dE/dt <= C E + C ||F||^2（A_j 对称时交换项为低阶）", "适定性估计：||U(t)||_{H^s} <= C e^{C t} (||U(0)||_{H^s} + int_0^t ||F||_{H^s})", "特征多项式条件：det(tau A_0 + sum_j xi_j A_j) = 0 的根 tau 全实", "拟线性局部存在时间下界：T >~ 1 / ||U_0||_{H^s}，s > n/2 + 1"],
        theorems: ["Friedrichs 对称双曲系统在 H^s（s > n/2 + 1）中局部适定；对称性是能量法闭合的关键", "严格双曲蕴含可对称化，故严格双曲系统也适定；但仅有实特征值（弱双曲）不足，弱双曲系统可能不适定（Hadamard 型不稳定）", "拟线性情形只有局部时间适定性，解可在有限时间破裂（激波形成）", "边界值问题需一致 Kreiss 条件；仅有内部双曲性不能保证边界适定"],
        generalRequirements: ["断言适定性必须给出对称化或严格双曲的验证", "拟线性情形必须限定局部时间并给 Sobolev 指标", "边界问题必须检验 Kreiss 型条件"],
        forbiddenErrors: ["【弱双曲误判】仅由特征值实断言适定", "【对称性缺失】非对称系统直接用 A_0 能量法", "【全局时间外推】拟线性系统断言全局光滑解", "【Sobolev 指标错】用 s <= n/2 + 1 做拟线性局部理论", "【边界条件随意】不验证 Kreiss 条件即断言边值适定"],
        parameterConstraints: { symmetryCondition: "A_0 对称正定、A_j 对称（或可对称化）", strictHyperbolicity: "符号矩阵特征值互异实", sobolevThreshold: "拟线性需 s > n/2 + 1", boundaryCondition: "边值问题需一致 Kreiss 条件" },
        closureChecks: ["确认对称化或严格双曲性", "确认时间区间是局部还是全局", "确认 Sobolev 指标门槛", "确认边界条件类型"],
        scenarioChecks: { maxwellOrElasticitySystem: ["写成对称双曲形式", "确认 A_0 正定"], quasilinearLocalExistence: ["用能量法得局部解", "确认 s > n/2 + 1"], boundaryValueHyperbolicSystem: ["检验 Kreiss 条件", "确认入射特征计数"] },
    },
};
