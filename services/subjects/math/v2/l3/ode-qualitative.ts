import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“微分方程-常微分方程与定性理论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ODE_QUALITATIVE_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Picard-Lindelof 存在唯一性与解的延拓。
    "ode-picard-lindelof-continuation": {
        id: "ode-picard-lindelof-continuation", l2Key: "ode-qualitative", name: "Picard-Lindelof 定理与解的延拓", kind: "theorem",
        aliases: ["局部存在唯一", "Picard-Lindelof条件", "解的延拓", "最大存在区间"],
    },
    // Gronwall 不等式与解对初值的连续依赖。
    "ode-gronwall-continuous-dependence": {
        id: "ode-gronwall-continuous-dependence", l2Key: "ode-qualitative", name: "Gronwall 不等式与连续依赖", kind: "theorem",
        aliases: ["Gronwall不等式", "连续依赖", "初值敏感性", "解的稳定估计"],
    },
    // 线性系统的基本解矩阵与 Floquet 理论。
    "ode-linear-fundamental-matrix-floquet": {
        id: "ode-linear-fundamental-matrix-floquet", l2Key: "ode-qualitative", name: "基本解矩阵与 Floquet 理论", kind: "theorem",
        aliases: ["基本解矩阵", "Wronskian", "Floquet乘子", "周期系数系统"],
    },
    // 平衡点线性化与双曲性判据。
    "ode-linearization-hyperbolic-equilibrium": {
        id: "ode-linearization-hyperbolic-equilibrium", l2Key: "ode-qualitative", name: "线性化与双曲平衡点判据", kind: "criterion",
        aliases: ["Jacobi矩阵", "双曲平衡点", "Hartman-Grobman", "特征值判据"],
    },
    // Lyapunov 函数与稳定性判据。
    "ode-lyapunov-stability-criterion": {
        id: "ode-lyapunov-stability-criterion", l2Key: "ode-qualitative", name: "Lyapunov 函数与稳定性判据", kind: "criterion",
        aliases: ["Lyapunov函数", "渐近稳定", "Chetaev不稳定", "不变集原理"],
    },
    // 不变流形与稳定流形定理。
    "ode-stable-manifold-theorem": {
        id: "ode-stable-manifold-theorem", l2Key: "ode-qualitative", name: "稳定流形与不变流形定理", kind: "theorem",
        aliases: ["稳定流形", "不稳定流形", "中心流形", "切空间分解"],
    },
    // 平面系统的 Poincare-Bendixson 理论。
    "ode-poincare-bendixson-planar": {
        id: "ode-poincare-bendixson-planar", l2Key: "ode-qualitative", name: "Poincare-Bendixson 定理", kind: "theorem",
        aliases: ["极限集", "极限环", "Bendixson判据", "平面系统"],
    },
    // 周期解与 Poincare 映射。
    "ode-periodic-orbit-poincare-map": {
        id: "ode-periodic-orbit-poincare-map", l2Key: "ode-qualitative", name: "周期解与 Poincare 映射", kind: "object",
        aliases: ["Poincare映射", "横截截面", "周期轨稳定性", "特征乘子"],
    },
    // 指标理论与 Poincare 指标公式。
    "ode-index-theory-vector-field": {
        id: "ode-index-theory-vector-field", l2Key: "ode-qualitative", name: "向量场指标与指标公式", kind: "theorem",
        aliases: ["Poincare指标", "旋转数", "指标求和", "奇点分类"],
    },
    // 比较原理与微分不等式。
    "ode-comparison-differential-inequality": {
        id: "ode-comparison-differential-inequality", l2Key: "ode-qualitative", name: "比较原理与微分不等式", kind: "theorem",
        aliases: ["比较定理", "常微分上下解", "单调性论证", "解的界估计"],
    },
});

// 规则字段固定为 8 项：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const ODE_QUALITATIVE_L3_RULES: Record<string, MathV2L3Rules> = {
    // 局部存在唯一性、Peano 存在性与最大存在区间。
    "ode-picard-lindelof-continuation": {
        definitions: ["初值问题 x' = f(t, x)，x(t_0) = x_0，f 定义于矩形 R = [t_0 - a, t_0 + a] × bar{B}(x_0, b)", "局部 Lipschitz：对每个紧子集存在 L 使 |f(t, x) - f(t, y)| <= L |x - y|", "最大存在区间 (t_-, t_+)：解不能再向两端延拓的开区间", "Picard 迭代：x_{k+1}(t) = x_0 + int_{t_0}^t f(s, x_k(s)) ds"],
        formulas: ["存在区间估计：h = min(a, b/M)，其中 M = sup_R |f|", "压缩条件：Picard 算子在 C([t_0 - h, t_0 + h]) 上当 L h < 1 时为压缩映射", "迭代误差：|x_k(t) - x(t)| <= M L^k |t - t_0|^{k+1} / (k+1)!", "延拓判据：若 t_+ < infty 则 limsup_{t -> t_-^+} |x(t)| = infty（f 在有界闭集上有界时）"],
        theorems: ["Picard-Lindelof：f 连续且对 x 局部 Lipschitz 时局部解存在且唯一", "Peano：f 只连续时解存在但可能不唯一（x' = x^{2/3} 有多解）", "延拓定理：解可延拓到最大开区间，且在有限端点处必逸出任一紧集", "全局存在判据：f 满足线性增长 |f(t, x)| <= A(t) |x| + B(t)（A、B 局部可积）时解在整个区间存在"],
        generalRequirements: ["必须显式核验 f 的连续性与对 x 的 Lipschitz 性，并写出所用矩形与常数 M、L", "断言唯一性必须依赖 Lipschitz 或单侧 Lipschitz 条件，仅连续只能得存在性", "给出存在区间必须写出 h = min(a, b/M) 或等价估计，不得声称在任意大区间上存在", "断言全局存在必须给出线性增长、先验界或不变紧集之一"],
        forbiddenErrors: ["【唯一性越权】仅由 f 连续断言解唯一", "【区间夸大】把局部解的存在区间直接当成整条实轴而不核验爆破可能", "【Lipschitz 误判】在含 |x|^{alpha}（0 < alpha < 1）或 sqrt 的右端处声称 Lipschitz", "【爆破忽视】对 x' = x^2 类方程忽略有限时间爆破 t_+ = t_0 + 1/x_0", "【迭代收敛错断】不核验压缩常数即断言 Picard 迭代收敛"],
        parameterConstraints: { rectangleParameters: "a、b > 0 决定矩形，M = sup_R |f| 必须有限", lipschitzConstant: "L 只允许依赖紧集，不得依赖具体解", initialDataInterior: "x_0 需位于 f 定义域内部以保证双侧局部解", growthCondition: "全局存在需 |f(t, x)| <= A(t) |x| + B(t) 或存在不变紧区域" },
        closureChecks: ["把所得解回代方程与初值核验", "核验解在存在区间端点处的极限行为（收敛或逸出）", "核验唯一性所依赖的 Lipschitz 常数在解轨道邻域内有效", "对可显式求解的情形与显式公式比较"],
        scenarioChecks: { nonLipschitzRightHandSide: ["构造多个解说明唯一性失败", "改用 Peano 存在性或单侧 Lipschitz 条件讨论"], blowUpInFiniteTime: ["估计 t_+ 的显式上界", "核验解在 t -> t_+ 时逸出紧集"], globalExistenceClaim: ["给出先验界或不变区域", "核验线性增长条件逐项成立"] },
    },
    // Gronwall 不等式与解对初值和参数的连续依赖。
    "ode-gronwall-continuous-dependence": {
        definitions: ["Gronwall 型微分不等式：u'(t) <= a(t) u(t) + b(t)，u(t_0) = u_0，u >= 0", "积分形式：u(t) <= C + int_{t_0}^t a(s) u(s) ds", "连续依赖：解映射 (t, x_0) -> x(t; x_0) 在最大存在区间的紧子集上连续", "解对参数的可微性：f 对 (x, lambda) 为 C^k 时解对 x_0 与 lambda 为 C^k"],
        formulas: ["Gronwall 积分不等式：u(t) <= C exp(int_{t_0}^t a(s) ds)", "两解偏差估计：|x(t) - y(t)| <= |x(t_0) - y(t_0)| e^{L |t - t_0|}", "含扰动的估计：|x(t) - y(t)| <= (|Delta x_0| + int |Delta f|) e^{L |t - t_0|}", "变分方程：Y'(t) = D_x f(t, x(t)) Y(t)，Y(t_0) = I，给出 partial x / partial x_0 = Y(t)", "Liouville 公式：det Y(t) = exp(int_{t_0}^t tr D_x f(s, x(s)) ds)"],
        theorems: ["连续依赖定理：f 连续且局部 Lipschitz 时解在紧时间区间上对初值一致连续依赖", "可微依赖定理：f in C^1 时解对初值可微，导数满足线性变分方程", "误差指数增长是最优的：x' = L x 达到等号，说明估计不可改进为多项式增长", "Gronwall 不等式给出唯一性的独立证明：初值相同则偏差恒为零"],
        generalRequirements: ["使用 Gronwall 必须核验被估函数非负、可积并写出积分形式的起点常数", "偏差估计必须限制在两解共同存在的紧时间区间上，并说明轨道停留在同一 Lipschitz 常数适用区域内", "断言可微依赖必须写出变分方程与其初值 Y(t_0) = I", "连续依赖只能在有限时间区间上断言，长时间行为需另用稳定性理论"],
        forbiddenErrors: ["【符号缺失】对可能变号的 u 使用 Gronwall 不等式", "【区间越界】在超出共同存在区间或超出 Lipschitz 区域后继续使用偏差估计", "【一致性误断】由有限时间连续依赖推出对所有 t 的一致连续依赖", "【指数忽视】把偏差增长写成线性而非 e^{L t}", "【变分初值错误】把变分方程初值写成零矩阵"],
        parameterConstraints: { nonnegativity: "u >= 0 且 a(t) >= 0 是标准 Gronwall 形式的前提", integrability: "a、b 需在所考虑区间上局部可积", commonExistenceInterval: "偏差估计只在两解共同存在的区间上有效", differentiabilityOrder: "可微依赖要求 f in C^k（k >= 1）" },
        closureChecks: ["核验 Gronwall 推导中每步不等号方向一致", "核验估计在 t = t_0 处退化为初值偏差", "对线性方程与显式解比较验证指数因子", "核验变分方程解的行列式与 Liouville 公式一致"],
        scenarioChecks: { uniquenessProofViaGronwall: ["令初值偏差为零", "核验偏差函数满足积分不等式并推出恒为零"], parameterSensitivity: ["写出对参数的变分方程", "核验灵敏度矩阵与数值差分一致"], longTimeBehavior: ["指出指数估计在长时间失效", "改用 Lyapunov 或不变集论证"] },
    },
    // 线性系统基本解矩阵、Wronskian 与周期系数的 Floquet 理论。
    "ode-linear-fundamental-matrix-floquet": {
        definitions: ["线性系统 x' = A(t) x，A 在区间上连续；基本解矩阵 Phi(t) 的各列构成解空间的基", "主基本解矩阵：Phi(t_0) = I 的基本解矩阵，记 Phi(t, t_0)", "单值矩阵（monodromy）：周期系统 A(t + T) = A(t) 时 M = Phi(t_0 + T, t_0)", "Floquet 乘子 = M 的特征值 rho_i；Floquet 指数 mu_i 满足 rho_i = e^{mu_i T}"],
        formulas: ["解表示：x(t) = Phi(t, t_0) x_0；非齐次解 x(t) = Phi(t, t_0) x_0 + int_{t_0}^t Phi(t, s) f(s) ds", "Liouville-Wronskian：det Phi(t) = det Phi(t_0) exp(int_{t_0}^t tr A(s) ds)", "常系数情形：Phi(t, t_0) = e^{A (t - t_0)}", "Floquet 表示：Phi(t) = P(t) e^{R t}，其中 P 周期为 T（或 2T，实形式），e^{R T} = M", "乘子与指数关系：prod rho_i = exp(int_0^T tr A(s) ds)"],
        theorems: ["解空间是 n 维线性空间；n 个解线性无关当且仅当某一点处 Wronskian 不为零，由 Liouville 公式知则处处不为零", "Floquet 定理：周期系统存在形如 P(t) e^{R t} 的基本解矩阵，从而可通过周期变换化为常系数系统", "周期解存在判据：x' = A(t) x 有非零 T 周期解当且仅当 1 是 Floquet 乘子", "稳定性判据：所有 |rho_i| < 1 时零解渐近稳定；某个 |rho_i| > 1 时不稳定；|rho_i| = 1 为临界情形需高阶分析"],
        generalRequirements: ["必须区分基本解矩阵与主基本解矩阵，并声明所取基点 t_0", "变系数系统不得使用 e^{int A(s) ds} 作为解，除非核验 A(t) 与其积分可交换", "使用 Floquet 理论必须先核验 A(t) 的周期性并明确周期 T", "由乘子判定稳定性必须给出全部乘子的模，并说明临界情形不能判定"],
        forbiddenErrors: ["【指数误写】对不可交换的变系数 A(t) 写 Phi(t) = exp(int_{t_0}^t A(s) ds)", "【Wronskian 误判】认为 Wronskian 可在部分点为零而在别处不为零", "【周期性缺失】对非周期系数系统套用 Floquet 乘子", "【乘子临界越权】在 |rho| = 1 时断言稳定或不稳定", "【乘子与指数混用】直接把 R 的特征值当成乘子而不取 e^{mu T}"],
        parameterConstraints: { coefficientContinuity: "A(t) 需在区间上连续（或局部可积）", periodicity: "Floquet 理论要求 A(t + T) = A(t)，T > 0 为最小正周期", invertibilityOfMonodromy: "M 必可逆，故乘子均不为零", realFormCaveat: "实基本解矩阵的周期部分周期可能为 2T" },
        closureChecks: ["核验 Phi'(t) = A(t) Phi(t) 与 Phi(t_0) = I", "用 Liouville 公式核验行列式不为零", "核验单值矩阵由一个周期上的积分得到且与基点选取共轭等价", "对常系数特例退化核验为矩阵指数"],
        scenarioChecks: { constantCoefficientSystem: ["用 Jordan 形或特征值求 e^{At}", "核验重根情形出现 t 的幂次项"], periodicCoefficientSystem: ["数值或解析求单值矩阵", "核验乘子模与稳定性结论一致"], nonhomogeneousSystem: ["用 Duhamel 公式写出特解", "核验初值项与积分项在 t = t_0 处相容"] },
    },
    // 平衡点线性化、双曲性与 Hartman-Grobman 定理。
    "ode-linearization-hyperbolic-equilibrium": {
        definitions: ["平衡点 x_*：f(x_*) = 0；线性化矩阵 J = Df(x_*)", "双曲平衡点：J 的所有特征值实部都不为零", "稳定子空间 E^s、不稳定子空间 E^u、中心子空间 E^c 分别由实部为负、正、零的特征值对应的广义特征子空间给出", "局部拓扑共轭：存在同胚把流局部映为线性流的轨道"],
        formulas: ["线性化系统：y' = J y，y = x - x_*", "谱分解维数：dim E^s + dim E^u + dim E^c = n", "平面情形判别：由 tr J 与 det J 分类，Delta = (tr J)^2 - 4 det J 决定结点或焦点", "平面稳定判据：tr J < 0 且 det J > 0 时渐近稳定；det J < 0 时为鞍点"],
        theorems: ["线性化稳定性定理：J 的所有特征值实部为负时 x_* 局部渐近稳定；存在正实部特征值时不稳定", "Hartman-Grobman：x_* 双曲时非线性流在其邻域内与线性流局部拓扑共轭", "中心情形失效：存在纯虚或零特征值时线性化不能判定稳定性（如 x' = -x^3 与 x' = x^3 有相同线性化）", "Sternberg 型光滑共轭需要额外的非共振条件，双曲性只保证同胚而非微分同胚共轭"],
        generalRequirements: ["必须先解 f(x_*) = 0 定出所有平衡点，再逐点计算 Jacobi 矩阵", "必须给出全部特征值实部符号，并据此声明双曲或非双曲", "非双曲情形必须转向中心流形、Lyapunov 函数或高阶项分析，不得用线性化下结论", "拓扑共轭只给出定性轨道结构，不能用来推断精确的收敛速率或轨道形状"],
        forbiddenErrors: ["【中心越权】在有纯虚特征值时用线性化断言中心或稳定性", "【共轭过强】声称 Hartman-Grobman 给出光滑（C^1 以上）共轭", "【平衡点遗漏】只找到部分平衡点即作全局相图结论", "【符号误判】把 tr J < 0 单独当成渐近稳定的充分条件而不检验 det J > 0", "【线性化范围越界】把局部结论推广为全局吸引"],
        parameterConstraints: { smoothness: "f 至少 C^1 才能线性化，Hartman-Grobman 需 C^1", hyperbolicity: "所有特征值实部不为零", equilibriumExactness: "x_* 必须精确满足 f(x_*) = 0，近似平衡点不适用", neighborhoodLocality: "结论只在 x_* 的某个邻域内有效" },
        closureChecks: ["核验 f(x_*) = 0 精确成立", "核验特征值计算（特征多项式或迹与行列式）", "核验稳定与不稳定子空间维数之和加中心维数等于 n", "用小扰动初值数值或定性核验轨道走向与结论一致"],
        scenarioChecks: { planarSystem: ["计算 tr J 与 det J 并分类结点、焦点或鞍点", "核验判别式符号确定螺旋与否"], nonhyperbolicCase: ["构造中心流形约化", "或用 Lyapunov 函数直接判定"], multipleEquilibria: ["逐一分类每个平衡点", "拼接局部相图并核验轨道全局相容性"] },
    },
    // Lyapunov 函数、渐近稳定性与不变集原理。
    "ode-lyapunov-stability-criterion": {
        definitions: ["Lyapunov 函数：邻域内 V in C^1，V(x_*) = 0，V(x) > 0（x 不等于 x_*），沿轨道导数 dV/dt <= 0", "沿轨道导数：dV/dt = grad V(x) . f(x)，只用方程右端而不需求解", "Lyapunov 稳定：任意 eps 存在 delta 使初值在 delta 邻域内的轨道永留在 eps 邻域内；渐近稳定还要求轨道趋于 x_*", "吸引域：所有趋于 x_* 的初值构成的集合"],
        formulas: ["稳定性判据：V 正定且 dV/dt <= 0 蕴含稳定；dV/dt < 0（x 不等于 x_*）蕴含渐近稳定", "指数估计：若 c_1 |x|^2 <= V <= c_2 |x|^2 且 dV/dt <= -c_3 V，则 |x(t)| <= C |x(0)| e^{-c_3 t / 2}", "Chetaev 不稳定判据：存在锥形区域与 V 使 V > 0 且 dV/dt > 0 则不稳定", "机械系统标准取法：V = 动能加势能，dV/dt = -耗散项"],
        theorems: ["Lyapunov 稳定性定理与其逆定理：渐近稳定的双曲平衡点存在光滑严格 Lyapunov 函数", "LaSalle 不变集原理：紧不变集内 dV/dt <= 0 时轨道趋于集合 { dV/dt = 0 } 内的最大不变集", "线性系统情形：A 的特征值实部全负当且仅当存在正定 P 满足 Lyapunov 方程 A^T P + P A = -Q（Q 正定）", "全局渐近稳定需 V 径向无界（V(x) -> infty 当 |x| -> infty），否则只得局部结论"],
        generalRequirements: ["必须逐项核验 V 的正定性与 dV/dt 的符号，并写出所用邻域", "dV/dt 必须通过代入方程右端计算，不得假设解已知", "只有 dV/dt 严格负定或配合 LaSalle 原理才能得渐近稳定；dV/dt <= 0 只给稳定", "断言全局稳定必须核验径向无界性与吸引域覆盖整个空间"],
        forbiddenErrors: ["【严格性误升】由 dV/dt <= 0 直接断言渐近稳定而不使用 LaSalle 原理", "【正定性缺失】使用只是半正定或在平衡点外取零的 V", "【径向无界忽视】由局部 Lyapunov 函数断言全局吸引", "【不变集误算】LaSalle 中把 { dV/dt = 0 } 整个集合当作极限集而不取其中最大不变集", "【逆命题误用】由某个 V 不满足条件断言平衡点不稳定"],
        parameterConstraints: { positiveDefiniteness: "V(x_*) = 0 且 V > 0 于去心邻域", differentiability: "V in C^1 于所考察邻域", invariantCompactSet: "LaSalle 原理需存在有界正向不变集", radialUnboundedness: "全局结论需 V(x) -> infty 当 |x| -> infty" },
        closureChecks: ["核验 V 在平衡点取严格极小", "逐项展开 grad V . f 并核验符号在整个邻域成立", "核验所用水平集 { V <= c } 有界且正向不变", "对线性化情形核验与 Lyapunov 方程解一致"],
        scenarioChecks: { mechanicalSystemWithDamping: ["取能量函数作为 V", "核验耗散项使 dV/dt <= 0 并用 LaSalle 得渐近稳定"], linearSystem: ["解 A^T P + P A = -Q", "核验 P 正定"], instabilityProof: ["构造 Chetaev 函数与锥形区域", "核验轨道离开邻域"] },
    },
    // 稳定流形、不稳定流形与中心流形定理。
    "ode-stable-manifold-theorem": {
        definitions: ["局部稳定流形 W_loc^s(x_*) = 邻域内正向趋于 x_* 的点集；不稳定流形对反向时间同样定义", "全局流形 W^s(x_*) = union_{t <= 0} phi_t(W_loc^s)", "中心流形 W^c：切于中心子空间 E^c 的局部不变流形", "同宿轨：连接同一平衡点的 W^u 与 W^s 的轨道；异宿轨连接不同平衡点"],
        formulas: ["切空间关系：T_{x_*} W^s = E^s，T_{x_*} W^u = E^u，T_{x_*} W^c = E^c", "维数关系：dim W^s = dim E^s，dim W^u = dim E^u", "指数趋近：x_0 in W_loc^s 时 |phi_t(x_0) - x_*| <= C e^{-alpha t}，0 < alpha < min |Re lambda|（lambda in 稳定谱）", "流形的图表示：W^s 局部可写成 x_u = h(x_s)，h(0) = 0，Dh(0) = 0"],
        theorems: ["稳定流形定理：x_* 双曲时 W_loc^s 与 W_loc^u 存在、唯一且与 f 同阶光滑（C^k 蕴含 C^k）", "中心流形定理：中心流形存在但一般不唯一，且光滑性可能低于 f 的光滑度", "约化原理：系统在中心流形上的约化方程决定非双曲平衡点的稳定性", "Lambda 引理与横截性：W^u 与 W^s 横截相交给出结构稳定的同宿缠结，非横截相交在扰动下可能消失"],
        generalRequirements: ["必须先核验双曲性再断言稳定与不稳定流形的存在唯一性", "写出流形必须给出切空间与图表示的低阶条件 h(0) = 0、Dh(0) = 0", "中心流形结论必须声明其非唯一性，并说明所取约化方程的截断阶数", "断言同宿或异宿连接必须核验两条流形确实相交且说明横截性"],
        forbiddenErrors: ["【唯一性误加】声称中心流形唯一", "【维数错配】使流形维数与对应特征子空间维数不符", "【切条件缺失】图表示中漏掉 Dh(0) = 0 使流形不与特征子空间相切", "【非双曲越权】在非双曲情形直接使用稳定流形定理", "【全局化误推】把局部流形的存在性直接当作全局流形的嵌入性（可能自缠绕）"],
        parameterConstraints: { hyperbolicityForStableManifold: "W^s、W^u 的存在唯一性要求特征值实部不为零", smoothnessTransfer: "f in C^k 给出 C^k 流形（k >= 1）", spectralGap: "指数趋近率 alpha 需严格小于稳定谱实部绝对值的最小值", localityRadius: "图表示只在某个邻域半径内有效" },
        closureChecks: ["核验流形在平衡点处与相应特征子空间相切", "核验流形的正向或反向不变性", "把图表示代入方程逐阶核验展开系数", "核验趋近速率与谱估计一致"],
        scenarioChecks: { saddleConnection: ["分别计算 W^u 与 W^s 的低阶展开", "核验相交与横截性"], centerManifoldReduction: ["按阶数求 h 的 Taylor 展开", "在约化方程上判定稳定性"], numericalContinuation: ["从切空间出发做流形延拓", "核验延拓结果的不变性误差"] },
    },
    // 平面系统极限集结构与 Poincare-Bendixson 定理。
    "ode-poincare-bendixson-planar": {
        definitions: ["omega 极限集 omega(x_0) = 所有存在时间列 t_k -> infty 使 phi_{t_k}(x_0) 收敛的极限点集合", "极限环：孤立的周期轨，其邻域内其他轨道螺旋趋近或远离", "捕获区域（trapping region）：正向不变的紧连通区域", "Dulac 函数：使 div(B f) 保号的正函数 B，用于排除周期轨"],
        formulas: ["Bendixson 判据：单连通区域内 div f = partial_x f_1 + partial_y f_2 保号（不恒为零）则该区域无周期轨", "Dulac 判据：存在 B > 0 使 div(B f) 保号则无周期轨", "环内积分恒等式：沿周期轨 oint (f_1 dy - f_2 dx) = int int div f dA", "极限环稳定性：由 Poincare 映射导数或 int_0^T div f(gamma(t)) dt 的符号决定，负则稳定"],
        theorems: ["Poincare-Bendixson 定理：平面 C^1 系统中非空紧 omega 极限集若不含平衡点则必为周期轨", "推论：紧正向不变区域内无平衡点则必存在周期轨", "结论仅限二维（或二维流形如球面、环面上局部）：三维起可出现混沌吸引子", "极限集三分类：平衡点、周期轨、或由平衡点与连接轨（同宿或异宿）组成的图"],
        generalRequirements: ["必须先构造紧正向不变区域并核验向量场在边界指向内部", "必须逐一定出区域内所有平衡点，无平衡点是导出周期轨的关键前提", "必须显式声明系统为二维；三维以上不得使用本定理", "排除周期轨必须使用 Bendixson 或 Dulac 判据并核验区域单连通"],
        forbiddenErrors: ["【维数越界】把 Poincare-Bendixson 用于三维或更高维系统", "【平衡点忽视】在区域内含平衡点时仍断言极限集是周期轨", "【单连通性缺失】在环状区域使用 Bendixson 判据", "【不变性未验】未核验边界流向即断言捕获区域", "【发散符号误判】div f 在区域内变号却断言无周期轨"],
        parameterConstraints: { dimensionTwo: "系统必须是平面（n = 2）或二维流形上的流", regularity: "f in C^1 保证唯一性与流的连续性", compactForwardInvariance: "极限集非空紧需正向轨道有界", simpleConnectedness: "Bendixson 与 Dulac 判据要求区域单连通" },
        closureChecks: ["核验边界上向量场内向（法向内积符号）", "核验区域内无平衡点或列出所有平衡点并分类", "核验 div f 或 div(B f) 在区域内符号一致", "对找到的周期轨核验其稳定性积分符号"],
        scenarioChecks: { annularTrappingRegion: ["核验内外边界均内向", "核验环内唯一平衡点被排除在环外"], excludingLimitCycles: ["计算 div f", "变号时尝试构造 Dulac 函数 B"], limitCycleStability: ["计算 int_0^T div f dt", "或用 Poincare 映射导数判定"] },
    },
    // 周期解、横截截面与 Poincare 映射。
    "ode-periodic-orbit-poincare-map": {
        definitions: ["横截截面 Sigma：与周期轨在点 p 横截相交的余维一超曲面（f(p) 不切于 Sigma）", "Poincare 首次回归映射 P : U subset Sigma -> Sigma，把 x 映为其正向轨道再次穿过 Sigma 的第一点", "特征乘子：DP(p) 的特征值，等于单值矩阵除去沿流方向的平凡乘子 1 后的剩余特征值", "双曲周期轨：所有特征乘子模不为 1"],
        formulas: ["单值矩阵谱：spec(M) = {1} union { 特征乘子 }，平凡乘子 1 对应流方向", "平面情形唯一乘子：rho = exp(int_0^T div f(gamma(t)) dt)", "一般情形行列式关系：prod_{i} rho_i × 1 = exp(int_0^T div f(gamma(t)) dt)", "周期轨稳定性判据：所有 |rho_i| < 1 则渐近稳定；存在 |rho_i| > 1 则不稳定"],
        theorems: ["Poincare 映射与 Sigma、p 的选取无关到局部共轭意义，特征乘子是周期轨的不变量", "周期轨的稳定性等价于其 Poincare 映射不动点的稳定性", "沿流方向必然出现平凡乘子 1，因此周期轨永不双曲双向双曲于全空间意义，稳定性只由其余乘子决定", "Andronov-Hopf 型分岔在乘子模穿越 1（或线性化特征值穿越虚轴）时发生，周期轨可产生倍周期分岔"],
        generalRequirements: ["必须显式给出截面与横截性验证（向量场与截面法向的内积不为零）", "必须区分平凡乘子 1 与非平凡特征乘子，稳定性只用后者", "使用 Poincare 映射必须说明首次回归时间的良定性与连续可微性", "涉及数值计算特征乘子必须说明积分单值矩阵的初值与周期"],
        forbiddenErrors: ["【平凡乘子误用】把乘子 1 当成临界情形而断言周期轨非双曲不可判定", "【横截性缺失】选取与轨道相切的截面导致映射无定义", "【回归时间忽视】不核验首次回归时间存在即定义映射", "【维数错配】Poincare 映射定义在 n-1 维截面上却按 n 维计算乘子个数", "【稳定性混淆】把 Lyapunov 意义下轨道稳定与相位渐近同步混为一谈"],
        parameterConstraints: { transversality: "f(p) . n_Sigma(p) 不为零", periodPositivity: "T > 0 为最小正周期", smoothness: "f in C^1 保证 P 为 C^1", multiplierCount: "非平凡特征乘子个数为 n - 1" },
        closureChecks: ["核验 P(p) = p 即 p 是不动点", "核验横截条件在整个所用截面邻域成立", "核验乘子乘积与 div f 的周期积分一致", "核验最小周期而非其整数倍"],
        scenarioChecks: { planarLimitCycle: ["计算唯一乘子的指数表达式", "由符号判定稳定或不稳定"], higherDimensionalOrbit: ["积分变分方程得单值矩阵", "去掉平凡乘子后判定谱在单位圆内外"], bifurcationDetection: ["跟踪乘子随参数移动", "标出穿越单位圆的临界参数并识别分岔类型"] },
    },
    // 平面向量场的奇点指标与指标求和公式。
    "ode-index-theory-vector-field": {
        definitions: ["沿闭曲线 C 的指标 ind(C) = 向量场方向角 theta = arg f 沿 C 一周的总变化除以 2 pi，取整数值", "孤立奇点指标 ind(x_*) = 围绕该奇点的小闭曲线的指标", "旋转数：轨道方向沿曲线的缠绕次数", "Poincare-Hopf 指标：紧曲面上向量场奇点指标之和等于曲面 Euler 特征数"],
        formulas: ["指标积分：ind(C) = (1/(2 pi)) oint_C (f_1 df_2 - f_2 df_1) / (f_1^2 + f_2^2)", "标准指标值：结点与焦点与中心的指标为 +1，鞍点为 -1", "双曲奇点指标：ind = sign det Df(x_*)", "求和公式：ind(C) = sum_{奇点在 C 内} ind(x_j)；周期轨作为闭曲线其指标为 +1", "Poincare-Hopf：sum_j ind(x_j) = chi(M)（M 紧无边，向量场奇点孤立）"],
        theorems: ["指标是同伦不变量：连续形变闭曲线且不经过奇点时指标不变", "闭轨内部必含奇点，且内部奇点指标之和为 +1，因此平面系统的周期轨内不可能只含单个鞍点", "指标为零的闭曲线内可以无奇点或奇点指标相消", "球面上（chi = 2）任意光滑向量场必有奇点，环面上（chi = 0）可存在无奇点向量场"],
        generalRequirements: ["计算指标必须确认闭曲线上向量场处处不为零", "使用求和公式必须列出闭曲线内部所有奇点并核验其孤立性", "对退化奇点必须用积分定义或分解为若干双曲奇点讨论，不得直接套用 sign det 公式", "在紧曲面上使用 Poincare-Hopf 必须声明曲面拓扑与 Euler 特征数"],
        forbiddenErrors: ["【零点跨越】所取闭曲线经过奇点仍计算指标", "【符号误用】把鞍点指标写成 +1 或把中心写成 -1", "【退化误算】对 det Df = 0 的退化奇点直接使用 sign det 公式", "【求和遗漏】漏掉曲线内部某个奇点导致求和不等于曲线指标", "【周期轨误判】断言存在只包含一个鞍点的周期轨"],
        parameterConstraints: { nonvanishingOnCurve: "闭曲线上 f 不为零向量", isolatedSingularities: "奇点必须孤立且有限个", orientationConvention: "闭曲线取正向（逆时针）以固定符号", compactnessForPoincareHopf: "Poincare-Hopf 要求 M 紧且无边（或处理边界项）" },
        closureChecks: ["核验闭曲线上向量场模有正下界", "分别计算各奇点指标并核验求和等于总指标", "对双曲奇点核验 sign det Df 与分类一致", "在紧曲面情形核验指标和等于 Euler 特征数"],
        scenarioChecks: { periodicOrbitObstruction: ["计算候选闭轨内部奇点指标和", "若不等于 +1 则排除周期轨存在"], degenerateSingularity: ["用积分定义直接计算指标", "或作小扰动分裂为双曲奇点后求和"], globalVectorFieldOnSurface: ["确定曲面 Euler 特征数", "核验奇点指标和与之一致"] },
    },
    // 比较原理、上下解与解的界估计。
    "ode-comparison-differential-inequality": {
        definitions: ["上解（超解）：满足 v' >= f(t, v) 的函数；下解（次解）满足 w' <= f(t, w)", "标量比较问题：x' = f(t, x) 与不等式 u' <= f(t, u) 的解之间的序关系", "拟单调条件（系统情形）：f_i 对 x_j（j 不等于 i）非减，即所谓合作系统条件", "不变区域：向量场在边界指向内部的区域，解一旦进入不再离开"],
        formulas: ["标量比较：u(t_0) <= x(t_0) 且 u' <= f(t, u)、x' = f(t, x) 蕴含 u(t) <= x(t)（t >= t_0）", "严格化：若 u(t_0) < x(t_0) 则不等式在 t >= t_0 上保持严格", "上下解夹逼：w(t) <= x(t) <= v(t) 只要初值满足 w(t_0) <= x(t_0) <= v(t_0)", "标量界估计：|x|' <= |f(t, x)| <= A(t) |x| + B(t) 给出 |x(t)| <= (|x_0| + int B) exp(int A)"],
        theorems: ["标量比较定理：f 连续且对 x 局部 Lipschitz（或单侧 Lipschitz）时序关系在正向时间保持", "系统情形需拟单调（合作）条件，一般非合作系统的分量序关系不保持", "不变区域定理：向量场在边界内向的闭区域是正向不变的", "上下解方法给出解的存在性：w <= v 且两者构成序区间时该区间内存在解（配合单调迭代）"],
        generalRequirements: ["使用比较原理必须核验方向为正向时间，并写出初值序关系", "系统情形必须逐项核验拟单调或合作性条件，否则只能对标量化的量（如范数）比较", "构造上下解必须核验其在整个所考察区间上满足相应微分不等式与初值序", "得到的界只在两者共同存在区间上有效，需同时讨论存在区间"],
        forbiddenErrors: ["【时间方向错误】把正向比较结论直接用于反向时间", "【系统越权】对非合作系统逐分量套用比较原理", "【初值序缺失】不核验初值序关系即断言解的序", "【存在区间忽视】在上解或下解已爆破之后继续使用夹逼", "【严格性误升】由非严格不等式断言严格不等式"],
        parameterConstraints: { forwardTimeOnly: "结论限于 t >= t_0", regularityForComparison: "f 连续且对 x 单侧 Lipschitz 或局部 Lipschitz", quasimonotonicity: "系统情形需 partial f_i / partial x_j >= 0（i 不等于 j）", commonInterval: "上下解与解需在同一区间上存在" },
        closureChecks: ["核验上下解的微分不等式在每一点成立", "核验初值序关系", "核验共同存在区间并给出端点行为", "对可解特例与显式解比较验证界的紧性"],
        scenarioChecks: { aPrioriBoundForGlobalExistence: ["构造常数或线性上解", "由界排除爆破从而得全局存在"], invariantRegionArgument: ["核验边界上向量场内向", "得出解永留区域的结论"], monotoneIterationForExistence: ["取有序上下解对", "核验迭代序列单调有界并收敛到解"] },
    },
};
