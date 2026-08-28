import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数值分析-偏微分方程数值解”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMERICAL_PDE_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 有限差分离散的截断误差与差分模板。
    "numpde-finite-difference-truncation": {
        id: "numpde-finite-difference-truncation", l2Key: "numerical-pde", name: "有限差分离散与截断误差", kind: "formula",
        aliases: ["有限差分", "五点差分格式", "差分截断误差", "网格Peclet数"],
    },
    // Lax 等价定理：相容加稳定等于收敛。
    "numpde-lax-equivalence-theorem": {
        id: "numpde-lax-equivalence-theorem", l2Key: "numerical-pde", name: "Lax 等价定理", kind: "theorem",
        aliases: ["Lax等价定理", "差分格式收敛性", "相容加稳定", "良态初值问题离散"],
    },
    // von Neumann 分析与 CFL 条件。
    "numpde-von-neumann-cfl": {
        id: "numpde-von-neumann-cfl", l2Key: "numerical-pde", name: "von Neumann 分析与 CFL 条件", kind: "criterion",
        aliases: ["von Neumann分析", "CFL条件", "放大因子", "显式格式步长限制"],
    },
    // 数值耗散、色散与 Godunov 单调性定理。
    "numpde-numerical-dissipation-godunov": {
        id: "numpde-numerical-dissipation-godunov", l2Key: "numerical-pde", name: "数值耗散色散与 Godunov 定理", kind: "theorem",
        aliases: ["数值耗散", "数值色散", "Godunov定理", "单调格式一阶上限"],
    },
    // 有限体积法与守恒型数值通量。
    "numpde-finite-volume-flux": {
        id: "numpde-finite-volume-flux", l2Key: "numerical-pde", name: "有限体积法与数值通量", kind: "algorithm",
        aliases: ["有限体积", "守恒型格式", "数值通量", "Lax-Wendroff定理"],
    },
    // TVD 格式与斜率限制器。
    "numpde-tvd-limiter": {
        id: "numpde-tvd-limiter", l2Key: "numerical-pde", name: "TVD 格式与斜率限制器", kind: "criterion",
        aliases: ["总变差不增", "斜率限制器", "minmod", "Harten判据"],
    },
    // 有限元的 Cea 引理与先验误差估计。
    "numpde-finite-element-error-estimate": {
        id: "numpde-finite-element-error-estimate", l2Key: "numerical-pde", name: "有限元先验误差估计", kind: "theorem",
        aliases: ["Cea引理", "Bramble-Hilbert引理", "有限元收敛阶", "网格正则性"],
    },
    // 混合有限元的 inf-sup 稳定性条件。
    "numpde-mixed-fem-inf-sup": {
        id: "numpde-mixed-fem-inf-sup", l2Key: "numerical-pde", name: "混合有限元与 inf-sup 条件", kind: "criterion",
        aliases: ["inf-sup条件", "Babuska-Brezzi条件", "Taylor-Hood元", "压力伪振荡"],
    },
    // 谱方法与谱精度。
    "numpde-spectral-method-accuracy": {
        id: "numpde-spectral-method-accuracy", l2Key: "numerical-pde", name: "谱方法与谱精度", kind: "algorithm",
        aliases: ["谱方法", "Fourier配置法", "指数收敛", "谱矩阵稠密性"],
    },
    // 算子分裂与多重网格求解器。
    "numpde-splitting-multigrid": {
        id: "numpde-splitting-multigrid", l2Key: "numerical-pde", name: "算子分裂与多重网格", kind: "algorithm",
        aliases: ["Strang分裂", "ADI方法", "多重网格", "网格无关收敛率"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMERICAL_PDE_L3_RULES: Record<string, MathV2L3Rules> = {
    // 有限差分离散、截断误差与网格 Peclet 数。
    "numpde-finite-difference-truncation": {
        definitions: ["有限差分法把导数用网格函数的差商代替，在网格点上得到代数方程组", "截断误差指把精确解代入差分算子后与原方程的偏差，其阶决定格式的相容阶", "网格 Peclet 数 Pe_h = a h / (2 nu) 度量对流与扩散在单个网格尺度上的相对强弱"],
        formulas: ["中心二阶差分 (u_{j+1} - 2 u_j + u_{j-1}) / h^2 = u''(x_j) + h^2 u^{(4)}(x_j) / 12 + O(h^4)", "一阶向前差分误差 -h u''(x_j) / 2，其等效效应是引入人工扩散", "Laplace 算子五点格式截断误差 h^2 (u_{xxxx} + u_{yyyy}) / 12", "对流扩散方程中心差分的无振荡条件 Pe_h <= 1，即 h <= 2 nu / |a|", "紧致差分（如四阶 Pade 型）以隐式三对角关系换取更高阶而不扩大模板"],
        theorems: ["中心差分的偶阶精度来自泰勒展开中奇次项对消，因此要求解在模板覆盖区间上有足够高阶导数；解只有低阶光滑时实际阶下降", "对流占优时中心差分的离散解在 Pe_h > 1 出现非物理振荡，格式虽相容且稳定但结果不可用；上风差分消除振荡但引入 O(h) 人工扩散，二者构成精度与单调性的取舍", "非均匀网格上直接套用等距差分系数会使阶降至一阶，必须按实际节点重新推导系数或使用坐标变换", "边界处降阶（如二阶内点配一阶边界）通常使整体阶降为边界阶，除非用虚拟节点或单侧高阶模板补齐"],
        generalRequirements: ["给出差分格式必须写出模板、系数与截断误差主项，并声明所需的解光滑阶", "对流扩散问题必须检验网格 Peclet 数并说明所选格式的单调性", "必须单独说明边界与非均匀网格处的离散精度，不能只报内点阶"],
        forbiddenErrors: ["【光滑性越界】对含激波或折点的解宣称二阶差分保持二阶精度", "【Peclet忽视】对流占优时用中心差分并把振荡解释为不稳定或舍入", "【非均匀网格套用】在变网格上直接使用等距系数", "【边界降阶隐藏】只报内点阶而不提边界离散的低阶影响", "【上风代价忽略】使用上风格式而不说明其等价人工扩散量 |a| h / 2"],
        parameterConstraints: { smoothnessOrder: "p 阶截断误差要求解属于 C^{p+2}（对二阶中心差分为 C^4）", pecletBound: "中心差分无振荡要求 Pe_h = |a| h / (2 nu) <= 1", gridUniformity: "标准系数仅对均匀网格成立", boundaryOrder: "边界离散阶应不低于内点阶减一，否则整体阶被压低" },
        closureChecks: ["检查模板、系数与截断误差主项是否齐备", "检查网格 Peclet 数与单调性讨论是否给出", "检查边界与非均匀网格处理是否说明"],
        scenarioChecks: { convectionDominated: ["对 nu = 1e-3 的对流扩散方程用中心差分观察振荡，改上风后比较", "报告人工扩散引起的边界层加宽"], nonsmoothSolution: ["对含折点的解做网格加密实验验证阶降到一阶", "禁止宣称二阶"], boundaryTreatment: ["把边界一阶离散换为二阶单侧模板，比较整体收敛阶", "说明边界阶对整体阶的约束"] },
    },
    // Lax 等价定理：良态问题下相容加稳定等价于收敛。
    "numpde-lax-equivalence-theorem": {
        definitions: ["格式相容指截断误差随网格尺度趋于零", "格式稳定指离散演化算子的幂在所选范数下一致有界，即存在 C 使 ||S_h^n|| <= C 对 n h_t <= T 一致成立", "收敛指网格解在网格细化时依所选范数趋于精确解"],
        formulas: ["离散演化写作 U^{n+1} = S_h U^n + h_t F^n，稳定性要求 ||S_h^n|| <= C", "误差递推 e^{n+1} = S_h e^n + h_t tau^n，故 ||e^n|| <= C (||e^0|| + T max_k ||tau^k||)", "常系数问题的稳定性条件可用放大因子 |g(theta)| <= 1 + C h_t 表述", "对抛物问题显式格式稳定条件 h_t <= h^2 / (2 nu d)，d 为空间维数"],
        theorems: ["Lax 等价定理：对线性良态初值问题的相容差分格式，稳定当且仅当收敛；因此稳定性分析可以替代直接的收敛证明，而相容性单独不足以保证收敛", "定理的三个前提缺一不可：问题线性、原问题良态、格式相容；对非线性守恒律该定理不成立，需改用 Lax-Wendroff 型（守恒性加 TVD 或熵条件）论证", "稳定性依赖所选范数：某格式在 L^2 稳定不意味在最大范数稳定，故必须声明范数", "定理给出收敛而不给出阶：阶由截断误差的阶决定，且在解不够光滑时不可达"],
        generalRequirements: ["引用定理必须核验线性性、良态性与相容性三个前提", "必须声明稳定性与收敛所依据的范数", "对非线性问题必须显式指出定理不适用并给出替代框架"],
        forbiddenErrors: ["【前提缺失】对非线性守恒律或非良态问题直接引用 Lax 等价定理", "【相容即收敛】由截断误差趋零断言收敛而不检验稳定性", "【范数缺省】不声明范数便宣称稳定或收敛", "【定理给阶】用等价定理直接推出收敛阶", "【方向误用】仅证明收敛推稳定或仅证稳定推收敛而不说明使用的是哪一方向"],
        parameterConstraints: { linearityRequirement: "定理限于线性差分格式与线性 PDE", wellPosedness: "原初值问题须在同一范数下良态", stabilityUniformity: "稳定性常数须对所有 h、h_t 与 n h_t <= T 一致", normSpecification: "常用 L^2（von Neumann 适用）或最大范数（需离散极值原理）" },
        closureChecks: ["检查线性、良态、相容三前提是否核验", "检查范数是否明确", "检查是否区分收敛性与收敛阶"],
        scenarioChecks: { classicalApplication: ["对热方程显式格式验证 h_t <= h^2 / 2 下稳定并据定理断言收敛", "指出越界后收敛失效"], nonlinearCase: ["对 Burgers 方程说明需 Lax-Wendroff 与熵条件而非等价定理", "禁止直接套用"], normDependence: ["构造 L^2 稳定但最大范数不稳定的例子", "说明范数选择改变结论"] },
    },
    // von Neumann 放大因子分析与 CFL 条件。
    "numpde-von-neumann-cfl": {
        definitions: ["von Neumann 分析把网格函数展成离散 Fourier 模 exp(i k j h)，逐模计算一步推进的放大因子 g(theta)，theta = k h", "CFL 数（Courant 数）对线性对流为 nu_C = a h_t / h，度量一步内信息传播距离与网格间距之比", "格式的数值依赖域指一步更新中影响某点的网格点集合"],
        formulas: ["L^2 稳定条件（常系数、周期边界）为 |g(theta)| <= 1 对所有 theta 成立", "上风格式 g = 1 - nu_C (1 - exp(-i theta))，稳定条件 0 <= nu_C <= 1", "中心差分显式（FTCS）用于对流方程时 |g|^2 = 1 + nu_C^2 sin^2 theta > 1，无条件不稳定", "Lax-Friedrichs、Lax-Wendroff 稳定条件均为 |nu_C| <= 1；Crank-Nicolson 对热方程无条件稳定", "热方程显式格式 g = 1 - 4 r sin^2(theta / 2)，r = nu h_t / h^2，稳定条件 r <= 1 / 2"],
        theorems: ["CFL 条件（数值依赖域必须包含物理特征依赖域）是显式格式收敛的必要条件；它不是充分条件，FTCS 用于对流方程时满足依赖域要求仍无条件不稳定", "von Neumann 分析的适用前提是常系数、线性、周期或无界边界；变系数问题只能作局部冻结系数的启发式判断，边界效应需另用 GKS 理论分析", "对非正规的放大矩阵（系统情形），逐模谱半径不超过 1 不足以保证幂一致有界，需要 |g| <= 1 的范数版本或对称化", "隐式格式可无条件稳定但不解除精度对步长的要求，也不解除时间离散阶的限制"],
        generalRequirements: ["使用 von Neumann 分析必须声明常系数与周期边界假设", "必须区分 CFL 必要条件与格式的实际稳定条件", "对系统或变系数问题必须说明分析的局限与替代工具"],
        forbiddenErrors: ["【CFL充分化】认为满足 CFL 条件即稳定，忽视 FTCS 型反例", "【边界忽视】对含物理边界的问题用纯 von Neumann 结论断言稳定", "【变系数直接套】对强变系数或非线性问题按冻结系数结论作严格断言", "【谱半径滥用】对非正规放大矩阵只查特征值模", "【无条件稳定即无条件精确】以隐式格式无条件稳定为由取极大时间步"],
        parameterConstraints: { periodicAssumption: "分析假设周期或无界域上的常系数问题", cflNumber: "线性对流显式格式通常要求 |a| h_t / h <= 1", parabolicRatio: "热方程显式格式要求 nu h_t / h^2 <= 1 / 2（一维）", systemNormality: "系统情形需对放大矩阵作范数估计而非仅谱半径" },
        closureChecks: ["检查放大因子是否显式给出并求模", "检查稳定条件与 CFL 必要条件是否分别陈述", "检查常系数与周期边界假设是否声明"],
        scenarioChecks: { ftcsFailure: ["对线性对流方程用 FTCS 观察无条件增长，计算 |g|^2 > 1", "指出 CFL 满足仍不稳定"], parabolicLimit: ["对热方程验证 r = 0.5 临界与 r = 0.6 爆破", "对比 Crank-Nicolson 无条件稳定"], boundaryEffect: ["在非周期边界上出现的不稳定用 GKS 型分析解释", "说明 von Neumann 不覆盖"] },
    },
    // 数值耗散、数值色散与 Godunov 单调性定理。
    "numpde-numerical-dissipation-godunov": {
        definitions: ["把放大因子写成 |g| exp(i phi)，|g| 相对 1 的偏差刻画数值耗散，phi 与精确相位的偏差刻画数值色散", "单调格式指若初值单调则数值解保持单调（等价于系数非负的线性格式）", "修正方程指数值解实际满足的高阶偏微分方程，用于识别人为的耗散或色散项"],
        formulas: ["上风格式的修正方程 u_t + a u_x = (a h / 2)(1 - nu_C) u_xx，人工扩散系数 (a h / 2)(1 - nu_C)", "Lax-Wendroff 的修正方程首项为三阶色散 -(a h^2 / 6)(1 - nu_C^2) u_xxx", "线性格式 u_j^{n+1} = sum_k c_k u_{j+k}^n 单调等价于所有 c_k >= 0", "总变差 TV(u) = sum_j |u_{j+1} - u_j|，单调格式满足 TV 不增", "偶阶格式的主导误差是色散型（相位误差），奇阶格式的主导误差是耗散型"],
        theorems: ["Godunov 定理：单调的线性常系数格式其精度阶最高为一，因此二阶以上的线性格式必然在间断附近产生振荡；要同时获得高阶与无振荡必须使用非线性（解依赖）格式如限制器或 WENO", "由修正方程可知一阶上风格式的误差主要表现为激波与陡峭前沿的过度抹平，而二阶中心型格式的误差主要表现为相位滞后与尾随振荡（Gibbs 型）", "数值耗散在 nu_C -> 1 时对上风格式趋于零（精确移位），说明 CFL 数取值直接改变耗散量，低 CFL 数并非总是更精确", "长时间波传播问题中相位误差随传播距离线性累积，因此色散误差通常比幅值误差更早破坏解，评估格式必须给出相位精度"],
        generalRequirements: ["评价格式必须同时报告幅值（耗散）与相位（色散）行为，不能只报截断误差阶", "断言无振荡必须或引用单调性系数条件，或说明使用了非线性限制机制", "使用修正方程解释现象时必须声明它只在光滑区域与渐近意义下有效"],
        forbiddenErrors: ["【线性高阶无振荡】声称存在二阶以上的线性单调格式", "【振荡归因错误】把二阶格式在间断处的振荡归因于步长过大或舍入", "【只看阶数】以阶高为唯一依据选择格式而不看间断与长时间相位表现", "【修正方程越界】用修正方程分析间断附近的行为", "【CFL单向解释】认为 CFL 数越小结果越准，忽视上风格式在 nu_C = 1 时无耗散"],
        parameterConstraints: { monotonicityCondition: "线性格式单调等价于全部系数非负", godunovBound: "线性单调格式阶不超过 1", modifiedEquationValidity: "修正方程分析要求解在局部光滑且 h 充分小", courantDependence: "人工扩散与色散系数显式依赖 CFL 数，需与所用步长一并报告" },
        closureChecks: ["检查是否同时给出耗散与色散刻画", "检查无振荡断言是否有单调性或限制器依据", "检查修正方程使用范围是否限定在光滑区"],
        scenarioChecks: { squareWaveAdvection: ["对方波初值用上风与 Lax-Wendroff 传播，比较抹平与振荡", "用 Godunov 定理解释二者的必然取舍"], phaseError: ["长时间传播正弦波，测量相位滞后随时间的线性累积", "说明色散主导"], courantSweep: ["固定网格改变 CFL 数观察上风格式耗散变化", "验证 nu_C = 1 时精确移位"] },
    },
    // 有限体积守恒型格式与 Lax-Wendroff 定理。
    "numpde-finite-volume-flux": {
        definitions: ["有限体积法在控制体上积分守恒律，未知量为单元平均值 U_j，更新只通过单元界面的数值通量完成", "守恒型格式指可写成 U_j^{n+1} = U_j^n - (h_t / h)(F_{j+1/2} - F_{j-1/2}) 的格式，其中 F 为界面数值通量", "数值通量的相容性指当所有参数相等时 F(u, u) = f(u)"],
        formulas: ["Godunov 通量由界面 Riemann 问题的精确解取值给出", "Rusanov（局部 Lax-Friedrichs）通量 F = (f(u_L) + f(u_R)) / 2 - alpha (u_R - u_L) / 2，alpha >= max |f'|", "Roe 通量用 A-hat 满足 A-hat (u_R - u_L) = f(u_R) - f(u_L)，需加熵修正以排除膨胀激波", "HLL 通量用最快左右波速 s_L, s_R 构造中间常态", "总质量守恒的离散形式 sum_j U_j^{n+1} h = sum_j U_j^n h - h_t (F_out - F_in)"],
        theorems: ["Lax-Wendroff 定理：守恒型且相容的格式若其数值解在 L^1_loc 有界变差意义下收敛，则极限是守恒律的弱解；因此守恒型结构是捕捉正确激波位置的必要保证", "非守恒型离散即使相容且稳定，也可能收敛到激波速度错误的函数，这一错误不随网格细化消失，属于结构性错误而非精度问题", "弱解不唯一，Lax-Wendroff 定理不保证收敛到熵解；还需格式满足离散熵不等式（如 E-格式、Godunov 型或带熵修正的 Roe）才能排除非物理解", "Roe 线性化格式不自动满足熵条件，声速点附近会产生非物理的膨胀激波，必须加入熵修正（如 Harten-Hyman 型）"],
        generalRequirements: ["处理守恒律必须使用守恒型离散并写出界面数值通量的显式表达", "断言收敛到物理解必须同时给出守恒性、相容性与熵条件三方面依据", "使用线性化通量（Roe）必须说明熵修正措施"],
        forbiddenErrors: ["【非守恒离散】对含激波的守恒律使用原始变量形式的非守恒差分并期待正确激波速度", "【弱解即熵解】由 Lax-Wendroff 定理断言得到唯一物理解", "【Roe无修正】使用 Roe 通量而不处理膨胀激波", "【通量不相容】给出的数值通量在 u_L = u_R 时不等于 f(u)", "【耗散不足】Rusanov 型格式中取 alpha 小于最大特征速度绝对值"],
        parameterConstraints: { conservativeForm: "格式须可写为界面通量差的形式", fluxConsistency: "要求 F(u, u) = f(u)", dissipationParameter: "Rusanov 参数 alpha >= max |f'(u)| 在局部波速范围内取值", entropyRequirement: "收敛到熵解需附加离散熵不等式或使用 Godunov 型通量" },
        closureChecks: ["检查是否为守恒型并给出界面通量", "检查通量相容性与耗散参数取值", "检查熵条件的离散实现是否说明"],
        scenarioChecks: { shockSpeedTest: ["对 Burgers 方程用守恒型与非守恒型离散比较激波位置", "验证非守恒格式激波速度错误且不随加密改善"], entropyViolation: ["用无修正 Roe 通量在声速点构造膨胀激波", "加入熵修正后验证消失"], fluxCheck: ["检验所写通量在常态下退化为物理通量", "指出不相容通量破坏收敛"] },
    },
    // TVD 判据与斜率限制器。
    "numpde-tvd-limiter": {
        definitions: ["格式称为 TVD（总变差不增）若 TV(U^{n+1}) <= TV(U^n) 对所有初值成立", "斜率限制器把重构斜率按相邻梯度比 r = (U_j - U_{j-1}) / (U_{j+1} - U_j) 缩放，使高阶重构在极值附近退化为一阶", "通量限制形式写作 F = F_low + phi(r) (F_high - F_low)，phi 为限制器函数"],
        formulas: ["minmod 限制器 phi(r) = max(0, min(1, r))", "superbee 限制器 phi(r) = max(0, min(2 r, 1), min(r, 2))", "van Leer 限制器 phi(r) = (r + |r|) / (1 + |r|)", "Harten 判据：格式 U_j^{n+1} = U_j^n + C_{j+1/2}(U_{j+1} - U_j) - D_{j-1/2}(U_j - U_{j-1}) 在 C >= 0、D >= 0、C + D <= 1 时 TVD", "Sweby 图给出二阶 TVD 区域：phi 位于 min(2 r, 2) 与 r 的适当包络内且 phi(1) = 1"],
        theorems: ["TVD 蕴含无新极值产生因而无振荡；由 Godunov 定理，任何 TVD 且二阶的格式必然是非线性的，限制器正是引入这种非线性的机制", "所有 TVD 格式在光滑极值点处必然退化为一阶精度，这是 TVD 概念的固有代价；要在极值处保持高阶需放松到 TVB 或改用 WENO 型重构", "TVD 的严格理论仅建立在一维标量守恒律上；多维情形一般不存在真正的 TVD 高阶格式（Goodman-LeVeque 定理表明多维 TVD 格式至多一阶），实践中只能按维分裂或使用保正、无振荡等较弱判据", "限制器选择改变结果：minmod 最耗散最稳健，superbee 最锐利但可能把光滑解压成阶梯状（过度压缩）"],
        generalRequirements: ["宣称 TVD 必须给出所用判据（如 Harten 条件）与相应的 CFL 限制", "必须说明 TVD 在光滑极值点的降阶代价", "多维问题必须声明一维 TVD 理论不能直接推广"],
        forbiddenErrors: ["【多维TVD】声称构造了真正二阶的多维 TVD 格式", "【极值不降阶】宣称限制器格式在所有点保持二阶", "【CFL遗漏】给出 TVD 结论而不附带步长限制条件", "【限制器越界】使用不满足 phi(1) = 1 的限制器却宣称光滑区二阶", "【压缩过度忽视】用 superbee 处理光滑解而不提阶梯化风险"],
        parameterConstraints: { hartenCondition: "要求 C >= 0、D >= 0 且 C + D <= 1", cflRestriction: "常见二阶 TVD 格式要求 CFL 数不超过 1（部分限制器需不超过 0.5）", limiterNormalization: "光滑区二阶要求 phi(1) = 1 且 phi 在 r = 1 附近连续", dimensionality: "严格 TVD 理论限于一维标量守恒律" },
        closureChecks: ["检查 TVD 判据与 CFL 限制是否同时给出", "检查限制器是否满足 Sweby 区域与 phi(1) = 1", "检查极值降阶与多维局限是否说明"],
        scenarioChecks: { limiterComparison: ["对方波与正弦波分别用 minmod、superbee 比较锐度与阶梯化", "指出耗散与压缩的取舍"], smoothExtremum: ["对含光滑极值的解做加密实验，观察极值附近阶降为一", "说明 TVD 的固有代价"], twoDimensional: ["在二维旋转流上说明按维分裂的限制器不构成严格 TVD", "禁止宣称多维二阶 TVD"] },
    },
    // 有限元的 Cea 引理与先验误差估计。
    "numpde-finite-element-error-estimate": {
        definitions: ["有限元法在有限维子空间 V_h 上求解变分问题，取试探与检验函数同属 V_h（Galerkin 情形）", "Cea 引理把离散解误差控制为最佳逼近误差乘以与强制性常数和连续性常数之比的因子", "网格正则性（形状正则）指单元的外接半径与内切半径之比一致有界，即单元不退化为细长形"],
        formulas: ["Cea 引理 ||u - u_h||_V <= (M / alpha) inf_{v in V_h} ||u - v||_V，M 为双线性形式连续常数，alpha 为强制性常数", "插值估计 ||u - I_h u||_{H^1} <= C h^k ||u||_{H^{k+1}}，k 为多项式次数", "能量范数收敛 ||u - u_h||_{H^1} <= C h^k ||u||_{H^{k+1}}，L^2 范数在对偶论证下提升为 C h^{k+1}", "反演不等式 ||grad v_h||_{L^2(K)} <= C h_K^{-1} ||v_h||_{L^2(K)} 仅对多项式空间成立", "刚度矩阵条件数约 O(h^{-2})（二阶问题），随维数与单元退化恶化"],
        theorems: ["Cea 引理把误差分析化归为纯逼近论问题，但它给出的是能量范数的最优性，L^2 或最大范数的高阶结论需借助 Aubin-Nitsche 对偶论证与额外正则性", "先验误差阶 h^k 要求精确解属于 H^{k+1}；在带角点、系数跳跃或混合边界条件的区域上解正则性受限，实际阶被正则性而非多项式次数决定，此时应加密网格局部而非提高次数", "形状正则性是插值估计常数一致有界的前提；退化的细长单元使常数按角度反比爆炸，误差估计失效", "Galerkin 正交性 a(u - u_h, v_h) = 0 是所有上述估计的核心；非对称或非强制问题需改用 inf-sup 条件替代 Cea 引理"],
        generalRequirements: ["给出收敛阶必须同时声明多项式次数、解的 Sobolev 正则性与网格形状正则性", "必须指明所用范数（能量、L^2 或最大范数），不同范数阶不同", "对角点或系数跳跃问题必须说明正则性限制及局部加密策略"],
        forbiddenErrors: ["【正则性假设缺失】在 L 形区域等角点问题上按多项式次数直接宣称 h^k 阶", "【范数混淆】把 L^2 的 h^{k+1} 阶报为能量范数阶", "【形状退化忽视】使用细长单元而不检查形状正则性", "【强制性缺失】对非强制或鞍点问题套用 Cea 引理", "【条件数忽略】不提刚度矩阵 O(h^{-2}) 条件数增长对求解器的影响"],
        parameterConstraints: { coercivity: "Cea 引理要求双线性形式在 V 上强制且连续", solutionRegularity: "h^k 能量阶要求 u 属于 H^{k+1}", shapeRegularity: "单元长宽比须一致有界，否则插值常数不可控", subspaceInclusion: "要求 V_h 是 V 的子空间（协调元），非协调元需另作分析" },
        closureChecks: ["检查多项式次数、正则性与形状正则性是否齐备", "检查误差所用范数是否明确", "检查非强制或鞍点情形是否改用 inf-sup"],
        scenarioChecks: { cornerSingularity: ["在 L 形区域上用 P1 与 P2 元做加密实验，观察阶受限于 H^{1+s} 正则性", "说明应局部加密"], normComparison: ["同一算例分别测量 H^1 与 L^2 误差阶，验证相差一阶", "指出对偶论证的作用"], anisotropicMesh: ["刻意使用长宽比 1000 的单元观察误差常数恶化", "验证形状正则性的必要性"] },
    },
    // 混合有限元的 inf-sup（Babuska-Brezzi）条件。
    "numpde-mixed-fem-inf-sup": {
        definitions: ["混合形式把原问题写成含两个未知场的鞍点问题，如 Stokes 中的速度与压力，或二阶椭圆问题中的位移与通量", "离散 inf-sup 条件要求存在与 h 无关的 beta > 0 使 inf_{q_h} sup_{v_h} b(v_h, q_h) / (||v_h|| ||q_h||) >= beta", "压力伪振荡（棋盘模式）是 inf-sup 不满足时出现的非物理离散压力模式"],
        formulas: ["鞍点系统 [[A, B^T], [B, 0]] [u; p] = [f; g]", "Brezzi 条件：A 在 B 的核上强制，且 B 满足离散 inf-sup 条件（后者常称 LBB 条件）", "误差估计 ||u - u_h|| + ||p - p_h|| <= C (1 + 1 / beta) inf 逼近误差，beta 退化时误差界爆炸", "Taylor-Hood 元 P2-P1（速度二次、压力线性）满足 inf-sup；等次 P1-P1 不满足", "Fortin 判据：存在一致有界的算子 Pi_h 使 b(Pi_h v - v, q_h) = 0，即可验证 inf-sup"],
        theorems: ["Babuska-Brezzi 定理：鞍点问题离散良态的充要条件是核上强制性加离散 inf-sup 条件；因此对混合问题单纯的相容性与稳定的单场离散完全不足", "离散 inf-sup 不是连续 inf-sup 的自动继承：连续问题满足而离散空间对不匹配时 beta_h -> 0，压力出现棋盘振荡且不随加密消失", "等次速度压力对（P1-P1）不满足 inf-sup，必须加稳定项（如 PSPG、Brezzi-Pitkaranta）或改用富化元（MINI 元加气泡函数）", "Fortin 判据给出验证 inf-sup 的构造性方法；一旦 beta 与 h 无关，误差估计常数才对网格一致"],
        generalRequirements: ["提出混合元必须显式声明所用元对及其 inf-sup 相容性证据", "必须区分连续与离散 inf-sup 条件，并强调 beta 与 h 无关", "使用等次元必须给出稳定化方案及其对精度的影响"],
        forbiddenErrors: ["【继承误信】由连续问题 inf-sup 成立推断任意离散空间对稳定", "【等次未稳定】直接用 P1-P1 求 Stokes 而不加稳定项", "【常数依赖网格】允许 beta_h 随 h 退化仍宣称收敛", "【振荡误判】把压力棋盘模式归因于求解器或舍入", "【核上强制遗漏】只验证 inf-sup 而不检查 A 在 B 的核上强制"],
        parameterConstraints: { infSupUniformity: "要求 beta 与网格尺度 h 无关", kernelCoercivity: "A 需在 ker B 上强制", spacePairing: "速度与压力空间次数需匹配（如 P2-P1、Q2-Q1、RT 元配分片常数）", stabilizationParameter: "稳定化项系数需按 h 的适当幂标定，过大破坏一致性、过小失去稳定性" },
        closureChecks: ["检查元对及 inf-sup 依据是否给出", "检查 beta 与 h 的无关性是否声明", "检查核上强制性条件是否验证"],
        scenarioChecks: { checkerboardPressure: ["用 Q1-Q1 求解驱动腔 Stokes 观察棋盘压力", "改用 Taylor-Hood 后验证消失"], stabilizedEqualOrder: ["为 P1-P1 加入 PSPG 稳定项并检验收敛阶", "报告稳定参数敏感性"], fortinOperator: ["为某元对构造 Fortin 算子验证 inf-sup", "说明构造性判据的作用"] },
    },
    // 谱方法的指数收敛、别名误差与稠密算子代价。
    "numpde-spectral-method-accuracy": {
        definitions: ["谱方法用全局正交基展开数值解，周期问题取 Fourier 基 exp(i k x)，非周期问题取 Chebyshev 或 Legendre 基，导数由变换域乘子或谱微分矩阵精确作用于基函数", "配置法在 Gauss-Lobatto 等节点上强制残差为零，谱 Galerkin 法要求残差与全部试探基正交", "谱精度指误差随模数 N 的衰减快于任意代数阶，对解析函数达到 exp(-c N) 量级"],
        formulas: ["Fourier 谱微分：u' 的第 k 个系数为 i k hat u_k，二阶导为 -k^2 hat u_k", "截断误差：u 属于周期 H^m 时 ||u - P_N u|| <= C N^{-m} ||u||_{H^m}；u 在含区间的带状复区域解析时 ||u - P_N u|| <= C exp(-c N)", "谱微分矩阵谱半径：Fourier 一阶约 O(N)、二阶约 O(N^2)；Chebyshev 一阶约 O(N^2)、二阶约 O(N^4)", "显式时间推进限制：Fourier 抛物问题 h_t <= C N^{-2}，Chebyshev 抛物问题 h_t <= C N^{-4}", "二次非线性去别名的 2/3 规则：保留 |k| <= 2 N / 3 的波数，其余清零"],
        theorems: ["周期解析函数的 Fourier 截断误差指数衰减，这是谱方法以极少自由度达到高精度的根本原因；解只有有限光滑时收敛退化为代数阶 N^{-m}", "解含间断时出现 Gibbs 现象，间断附近振荡幅值不随 N 减小，全局精度退化为 O(N^{-1})，必须用滤波、间断 Galerkin 或分区谱元处理", "非周期问题使用 Fourier 基会因端点不匹配产生 O(1) 端点误差，必须改用 Chebyshev/Legendre 基或先做周期化延拓", "谱配置法中二次非线性产生别名：高波数乘积折回低波数并持续积累能量导致爆破，须用 2/3 规则或过采样求积消除", "谱微分矩阵稠密，直接矩阵-向量乘为 O(N^2)；Fourier 情形借 FFT 降至 O(N log N)，Chebyshev 借快速余弦变换同理"],
        generalRequirements: ["必须先声明边界条件类型与解的光滑性，据此选择 Fourier 还是 Chebyshev/Legendre 基", "必须报告收敛是代数阶还是指数阶并给出对应的光滑性假设", "含非线性项时必须说明别名处理方式", "必须给出时间步限制对 N 的幂次依赖，不能只报空间精度"],
        forbiddenErrors: ["【基函数误配】对非周期问题使用 Fourier 基并宣称指数收敛", "【光滑性缺失】对含激波或角点奇性的解声称谱精度", "【别名忽略】非线性配置法不做去别名处理即断言稳定", "【复杂度误报】把稠密谱算子按稀疏矩阵估计计算量", "【时间步误估】沿用差分的 h_t ~ h^2 经验而忽视 Chebyshev 的 N^{-4} 限制"],
        parameterConstraints: { basisChoice: "周期边界用 Fourier，非周期用 Chebyshev/Legendre，各方向分别选择", analyticityRequirement: "指数收敛要求解在包含区间的带状复区域内解析，收敛率 c 由带宽决定", dealiasing: "二次非线性至少保留 3 N / 2 个求积点或按 2/3 规则截断", timeStepScaling: "显式推进步长按最大特征值标定：Fourier 二阶 O(N^2)、Chebyshev 二阶 O(N^4)" },
        closureChecks: ["检查基函数与边界条件的匹配性是否论证", "检查收敛阶类型与光滑性假设是否配对给出", "检查别名处理与时间步限制是否说明"],
        scenarioChecks: { periodicAnalytic: ["对周期解析初值的对流方程用 Fourier 配置法绘制误差随 N 的半对数曲线", "验证直线斜率给出指数率"], discontinuousGibbs: ["对方波初值做谱逼近观察 Gibbs 振荡不随 N 衰减", "说明滤波或分区谱元的必要性"], chebyshevStiffness: ["测量 Chebyshev 二阶微分矩阵谱半径随 N 的增长", "据此推断显式步长上限并与实验对比"] },
    },
    // 算子分裂的阶与多重网格的网格无关收敛。
    "numpde-splitting-multigrid": {
        definitions: ["算子分裂把 u_t = (A + B) u 拆成交替推进的子问题，Lie 分裂顺序执行 exp(h A) exp(h B)，Strang 分裂用对称组合 exp(h A / 2) exp(h B) exp(h A / 2)", "ADI（交替方向隐式）把多维隐式问题分解为逐方向的一维三对角求解", "多重网格用光滑迭代衰减高频误差、用粗网格校正消除低频误差，V 循环与 W 循环规定层间递归遍历方式"],
        formulas: ["Lie 分裂误差 exp(h (A + B)) - exp(h A) exp(h B) = (h^2 / 2) [B, A] + O(h^3)，全局一阶", "Strang 分裂局部误差 O(h^3)、全局二阶；当 [A, B] = 0 时两种分裂均精确", "Peaceman-Rachford ADI：(I - (h_t / 2) A_x) u* = (I + (h_t / 2) A_y) u^n，再交换方向，常系数热方程上二阶且无条件稳定", "两网格迭代算子 E = (I - P A_c^{-1} R A) S^nu，要求 ||E|| <= rho < 1 且 rho 与 h 无关", "多重网格代价：V 循环单次迭代 O(N)，达到离散精度总代价 O(N) 至 O(N log(1 / eps))"],
        theorems: ["Strang 分裂的二阶性依赖对称组合，交换两个半步的顺序不改变阶但改变误差常数；分裂阶高于二阶需负系数组合，对抛物问题不稳定", "分裂会破坏原问题的守恒量与稳态：即使各子步保守，组合后的平衡态可能被 O(h^p) 偏移，长时间积分中该偏移主导误差", "多重网格的网格无关收敛率依赖光滑子对高频的衰减性与粗网格对低频的逼近性，二者缺一即退化为单网格速度", "各向异性或强对流问题中逐点光滑子无法衰减沿强耦合方向的误差，需线光滑、半粗化或代数多重网格；粗网格未递归到可直接求解的规模时代价退化"],
        generalRequirements: ["必须声明分裂类型与阶，并说明子算子是否交换及换位子的量级", "必须指出分裂对守恒量、正性与稳态的影响", "多重网格必须给出光滑子、限制与插值算子、循环类型三要素", "必须报告收敛因子是否与网格尺度无关，而非仅报告迭代次数"],
        forbiddenErrors: ["【阶数虚高】把 Lie 分裂当作二阶方法使用", "【交换性误设】默认对流与扩散算子交换从而忽略换位子误差", "【稳态失真】用分裂求长时间平衡态而不检验稳态偏移", "【光滑子误配】对各向异性问题坚持逐点 Gauss-Seidel 仍宣称 h 无关收敛", "【层数不足】粗网格未粗到可直接求解即终止递归并宣称线性代价"],
        parameterConstraints: { splittingOrder: "Lie 一阶、Strang 二阶，更高阶需负系数组合且对耗散问题不可用", commutatorSize: "误差常数正比于 ||[A, B]||，强耦合时须相应减小 h", smootherChoice: "各向异性方向需线光滑或半粗化，对流主导需上风光滑或 ILU", cycleParameters: "V 循环通常前后光滑各 1-2 次，须递归至可直接求解的最粗网格" },
        closureChecks: ["检查分裂阶与换位子影响是否说明", "检查守恒量与稳态是否受分裂影响并被检验", "检查多重网格三要素与 h 无关收敛因子是否报告"],
        scenarioChecks: { strangVsLie: ["对对流扩散方程分别用 Lie 与 Strang 分裂做步长细化实验", "验证一阶与二阶收敛率"], adiSolve: ["用 ADI 求解二维热方程并统计每步一维三对角求解次数", "与全隐式直接法比较代价"], multigridScaling: ["对 Poisson 方程在多个网格尺度上运行 V 循环记录收敛因子", "验证因子与 h 无关且总代价近似线性"] },
    },
};
