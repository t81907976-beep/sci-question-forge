import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“微分方程-渐近与摄动方法”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ODE_PERTURBATION_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 渐近序列与 Poincare 意义下的渐近展开。
    "asymptotic-expansion-poincare-sense": {
        id: "asymptotic-expansion-poincare-sense", l2Key: "ode-perturbation", name: "渐近展开与 Poincare 渐近意义", kind: "object",
        aliases: ["渐近序列", "Poincare渐近展开", "余项阶估计", "发散渐近级数"],
    },
    // 无量纲化与主导平衡定尺度。
    "asymptotic-dominant-balance-scaling": {
        id: "asymptotic-dominant-balance-scaling", l2Key: "ode-perturbation", name: "无量纲化与主导平衡", kind: "criterion",
        aliases: ["主导平衡", "无量纲化", "尺度选取", "小参数识别"],
    },
    // 正则摄动展开与一致有效性。
    "asymptotic-regular-perturbation": {
        id: "asymptotic-regular-perturbation", l2Key: "ode-perturbation", name: "正则摄动与一致有效性", kind: "theorem",
        aliases: ["正则摄动", "逐阶方程", "一致有效", "奇异摄动判别"],
    },
    // 边界层与匹配渐近展开。
    "asymptotic-boundary-layer-matching": {
        id: "asymptotic-boundary-layer-matching", l2Key: "ode-perturbation", name: "边界层与匹配渐近展开", kind: "algorithm",
        aliases: ["边界层", "内外解匹配", "重叠区", "复合展开"],
    },
    // Poincare-Lindstedt 法与频率修正。
    "asymptotic-poincare-lindstedt": {
        id: "asymptotic-poincare-lindstedt", l2Key: "ode-perturbation", name: "Poincare-Lindstedt 法与频率修正", kind: "algorithm",
        aliases: ["Lindstedt法", "长期项消除", "频率修正", "周期解摄动"],
    },
    // 多重尺度法与可解性条件。
    "asymptotic-multiple-scales": {
        id: "asymptotic-multiple-scales", l2Key: "ode-perturbation", name: "多重尺度法与可解性条件", kind: "algorithm",
        aliases: ["多重尺度", "慢时间变量", "可解性条件", "调制方程"],
    },
    // 平均化定理与慢变系统。
    "asymptotic-averaging-theorem": {
        id: "asymptotic-averaging-theorem", l2Key: "ode-perturbation", name: "平均化定理与慢变近似", kind: "theorem",
        aliases: ["平均化方法", "慢变系统", "长时间误差估计", "共振排除"],
    },
    // Laplace 方法与驻相法的积分渐近。
    "asymptotic-laplace-stationary-phase": {
        id: "asymptotic-laplace-stationary-phase", l2Key: "ode-perturbation", name: "Laplace 方法与驻相法", kind: "formula",
        aliases: ["Laplace方法", "驻相法", "最陡下降", "鞍点贡献"],
    },
    // Watson 引理与积分的逐项渐近展开。
    "asymptotic-watson-lemma": {
        id: "asymptotic-watson-lemma", l2Key: "ode-perturbation", name: "Watson 引理与积分渐近展开", kind: "theorem",
        aliases: ["Watson引理", "端点贡献", "Gamma函数系数", "逐项渐近"],
    },
    // 指数小项与 Stokes 现象。
    "asymptotic-stokes-phenomenon": {
        id: "asymptotic-stokes-phenomenon", l2Key: "ode-perturbation", name: "指数小项与 Stokes 现象", kind: "object",
        aliases: ["Stokes现象", "指数小项", "连接公式", "Borel求和"],
    },
});

/**
 * L3 审查规则：
 * - definitions：核心定义与前提
 * - formulas：可直接使用的公式
 * - theorems：关键定理与结论
 * - generalRequirements：通用命题与解答要求
 * - forbiddenErrors：必须避免的错误
 * - parameterConstraints：参数取值约束
 * - closureChecks：闭合性检查
 * - scenarioChecks：分场景检查项
 */
export const ODE_PERTURBATION_L3_RULES: Record<string, MathV2L3Rules> = {
    // 渐近序列与 Poincare 意义下的渐近展开。
    "asymptotic-expansion-poincare-sense": {
        definitions: ["渐近序列 {phi_n(eps)} 满足 phi_{n+1}(eps) / phi_n(eps) -> 0 (eps -> 0)，最常用者为 phi_n = eps^n", "f(eps) ~ sum_{n=0}^{N} a_n phi_n(eps) 在 Poincare 意义下成立指对每个固定 N 有 f - sum_{n<=N} a_n phi_n = o(phi_N)", "一致有效性指余项估计在自变量所属区域上一致成立，常数不依赖该区域内的点"],
        formulas: ["余项判据 lim_{eps -> 0} (f(eps) - sum_{n=0}^{N} a_n eps^n) / eps^N = 0", "最优截断项数由项的最小值给出，典型阶为 N_opt ~ c / eps，误差约为 exp(-c / eps)", "系数唯一性由 a_0 = lim f、a_n = lim (f - sum_{k<n} a_k eps^k) / eps^n 递推确定"],
        theorems: ["给定渐近序列后，渐近展开的系数唯一确定，但同一渐近展开可对应无穷多个函数，差可为对该序列全阶为零的量", "渐近级数一般发散，其有用性来自固定 eps 时取有限项的误差控制而非收敛性", "指数小量 exp(-1 / eps) 对幂序列 eps^n 的渐近展开全阶为零，故幂级数展开无法捕捉此类项"],
        generalRequirements: ["写渐近展开必须指明所用渐近序列与 eps -> 0 的极限方向", "余项必须写成 O 或 o 形式，并说明估计是否在自变量区域上一致", "不得用收敛性讨论替代渐近性讨论"],
        forbiddenErrors: ["【收敛混淆】把渐近级数当作收敛级数并令项数趋于无穷", "【一致性】把逐点余项估计当作一致有效估计而忽略边界层区域失效", "【唯一性】断言渐近展开唯一确定函数", "【指数小项】用幂级数展开的全零性推出函数为零", "【极限方向】未说明 eps -> 0^+ 或 eps -> 0^- 就写单侧展开"],
        parameterConstraints: { smallParameterSign: "通常取 eps -> 0^+，若允许双侧需分别验证", asymptoticSequenceOrder: "序列须严格满足相邻比趋零，混用同阶量会破坏系数唯一性", uniformityDomain: "一致有效性须指明成立区域，边界层附近往往需要另一套展开" },
        closureChecks: ["检查每阶余项的阶是否严格低于所保留的最后一项", "检查所写展开在自变量端点或奇点附近是否仍一致有效", "检查是否遗漏指数小量对结论的影响"],
        scenarioChecks: { verifyAsymptoticExpansion: ["写出渐近序列", "逐阶验证余项极限", "说明一致性区域"], optimalTruncation: ["估计各项量级", "找最小项定截断", "给出误差量级"], exponentiallySmallContribution: ["指出幂展开全阶为零的量", "说明需超渐近分析", "避免断言量为零"] },
    },
    // 无量纲化与主导平衡定尺度。
    "asymptotic-dominant-balance-scaling": {
        definitions: ["无量纲化指引入特征尺度把变量化为量级 1 的无量纲量，使小参数以显式形式出现", "主导平衡指在给定尺度下选取方程中量级最大的若干项相平衡，其余项作为高阶小量", "内层尺度由要求最高阶导数项与被丢弃项重新同阶而定"],
        formulas: ["伸缩变换 x = delta(eps) X、u = mu(eps) U，代入后比较各项量级定 delta 与 mu", "对 eps u'' + u' + u = 0 的内层平衡由 eps / delta^2 ~ 1 / delta 给出 delta = eps", "边界层厚度一般由最高阶导数系数与主导低阶项系数之比确定"],
        theorems: ["若某组主导平衡使被丢弃项在所设尺度下确实为高阶小量，则该平衡是自相容的，否则必须弃用", "同一方程在不同区域可有多组自相容主导平衡，各自对应一个渐近区域，区域间需衔接", "小参数乘在最高阶导数上时正则展开一定不一致有效，必然出现奇异摄动结构"],
        generalRequirements: ["列出所有可能的平衡组合并逐一检验自相容性，而不是只取一种", "尺度确定后必须回代验证被忽略项确为高阶", "结果需说明该尺度对应的区域范围"],
        forbiddenErrors: ["【自相容性】选定平衡后不回代检验，导致被丢弃项与保留项同阶", "【尺度唯一】断言主导平衡唯一而漏掉其他渐近区域", "【最高阶导数】把乘在最高阶导数上的小参数直接置零而不讨论边界层", "【量纲错误】无量纲化时特征尺度取错使小参数不出现或位置错误", "【区域遗漏】只给内层或只给外层就宣称得到整体近似"],
        parameterConstraints: { scalingFunctions: "delta(eps) 与 mu(eps) 须为正且随 eps -> 0 有确定量级", balanceSelfConsistency: "所选平衡下被弃项与保留项之比须趋于零", regionIdentification: "每组尺度只在相应区域有效，需给出区域的量级描述" },
        closureChecks: ["检查每组候选平衡的自相容性结论", "检查所得层厚与方程系数量级一致", "检查内外区域是否覆盖整个定义域"],
        scenarioChecks: { nondimensionalization: ["选特征尺度", "写无量纲方程", "标出小参数位置"], findBoundaryLayerThickness: ["设伸缩变换", "令最高阶项与主导项同阶", "解出 delta"], enumerateBalances: ["列出所有两项平衡", "逐一检验自相容", "保留有效者并分区"] },
    },
    // 正则摄动展开与一致有效性。
    "asymptotic-regular-perturbation": {
        definitions: ["正则摄动指把解写成 u(x, eps) = sum_n eps^n u_n(x)，逐阶方程在同一尺度上求解且展开一致有效", "奇异摄动指正则展开在某区域失效，典型判别为小参数乘在最高阶导数上或解的量级随 eps 变化", "逐阶方程由把展开代入并按 eps 的同次幂归并得到"],
        formulas: ["零阶方程为 eps = 0 时的退化方程，一阶方程形如 L u_1 = -R(u_0)，其中 L 为在 u_0 处的线性化算子", "边界条件同样逐阶分离：u_0 承担原边界数据，u_n (n >= 1) 取齐次边界条件", "隐函数式判据：若线性化算子 L 在 u_0 处可逆，则展开可无穷阶进行且解对 eps 光滑依赖"],
        theorems: ["若退化问题有解 u_0 且线性化算子在 u_0 处可逆，则由隐函数定理存在唯一解族 u(eps) 且 u(eps) - sum_{n<=N} eps^n u_n = O(eps^{N+1}) 一致成立", "线性化算子不可逆（共振）时逐阶方程出现可解性条件，展开需引入参数修正或分岔分析", "退化方程降阶时正则展开无法满足全部边界条件，必须改用奇异摄动方法"],
        generalRequirements: ["先检验退化问题的解与线性化算子可逆性，再决定用正则展开还是奇异摄动", "逐阶方程与逐阶边界条件必须同时写出并对应", "结论必须给出余项阶与一致有效区域"],
        forbiddenErrors: ["【降阶忽略】小参数乘最高阶导数时仍用正则展开并声称一致有效", "【边界条件】把原始非齐次边界数据重复施加于各阶修正项", "【共振】线性化不可逆时忽略可解性条件强行求解", "【余项】只写出前几阶而不给出余项阶估计", "【阶数归并】展开代入后未按 eps 同次幂正确归并，混入不同阶项"],
        parameterConstraints: { invertibilityOfLinearization: "一致展开要求线性化算子在退化解处可逆或至少满足 Fredholm 可解条件", smoothDependence: "方程对 eps 与 u 的依赖需足够光滑以支撑逐阶求导", uniformDomain: "余项阶估计的一致性区域须排除任何边界层或奇点邻域" },
        closureChecks: ["检查零阶解是否满足全部原边界条件", "检查各阶方程的可解性条件是否被验证", "检查是否需要改判为奇异摄动"],
        scenarioChecks: { regularExpansionConstruction: ["写逐阶方程与逐阶边界条件", "求解前两阶", "给出余项阶"], singularityDetection: ["检查最高阶导数系数", "检查退化解能否满足全部边界条件", "必要时转入边界层分析"], resonantOrder: ["写出线性化零空间", "施加正交可解条件", "引入参数修正"] },
    },
    // 边界层与匹配渐近展开。
    "asymptotic-boundary-layer-matching": {
        definitions: ["外层解为在 O(1) 尺度上按 eps 幂展开的解，内层解为在伸缩变量 X = (x - x_0) / delta(eps) 上的展开", "匹配条件要求内层解在 X -> 无穷 的极限行为与外层解在 x -> x_0 的极限行为在重叠区一致", "复合展开为内层解加外层解减去二者的公共部分，给出全区间一致有效近似"],
        formulas: ["典型问题 eps u'' + a(x) u' + b(x) u = 0 的层厚为 delta = eps，内变量 X = (x - x_0) / eps", "van Dyke 匹配法则 lim_{X -> 无穷} u_in = lim_{x -> x_0} u_out，逐阶对应", "复合展开 u_comp = u_out + u_in - u_common"],
        theorems: ["层位置由退化方程的漂移方向决定：a > 0 时层出现在左端点，a < 0 时出现在右端点，符号错取会导致无法匹配", "若内层方程含指数增长解，匹配要求剔除该解，其系数由匹配条件唯一确定", "内部层（转向层）出现在 a(x) 变号处，其层厚与局部展开阶数由 a 的零点重数决定"],
        generalRequirements: ["必须先判定层的位置与厚度再写内层方程", "内层解的待定常数只能由匹配条件与该端点边界条件共同确定", "最终必须给出复合展开而不是只列内外解"],
        forbiddenErrors: ["【层位置】按错误端点设层导致内层解出现无法剔除的指数增长", "【匹配阶】只在零阶匹配而后续阶不匹配就宣称完成", "【边界条件分配】把两端边界条件都加在同一层上", "【复合展开】直接相加内外解而未减去公共部分", "【转向点】在 a(x) 变号处沿用常规层厚 eps 而不重新定尺度"],
        parameterConstraints: { layerLocationSign: "由退化方程一阶项系数的符号决定层位于哪个端点", layerThickness: "delta(eps) 由最高阶导数项与主导项同阶条件确定", overlapRegion: "匹配须在内外展开同时有效的重叠区进行" },
        closureChecks: ["检查内层解在无穷远的极限与外层解在层点的值逐阶一致", "检查复合展开在两端点是否精确满足边界条件", "检查是否存在被漏掉的内部层"],
        scenarioChecks: { twoPointBoundaryLayer: ["定层位置与层厚", "解内外方程", "匹配并写复合展开"], turningPointLayer: ["定位系数零点", "重新定层厚", "用局部特殊函数解衔接"], higherOrderMatching: ["写一阶内外解", "逐阶应用匹配法则", "核对余项阶"] },
    },
    // Poincare-Lindstedt 法与频率修正。
    "asymptotic-poincare-lindstedt": {
        definitions: ["长期项指形如 t sin(omega t) 的项，使朴素展开在 t ~ 1/eps 时失去一致有效性", "Poincare-Lindstedt 法把频率也展开 omega = omega_0 + eps omega_1 + ...，用 tau = omega t 作新时间以消除长期项", "该方法只适用于寻找周期解，不适用于一般初值问题的长时间行为"],
        formulas: ["设 tau = omega t，方程化为 omega^2 u_{tau tau} + ... = 0，逐阶展开 u = u_0 + eps u_1 + ...", "Duffing 方程 u'' + u + eps u^3 = 0 得频率修正 omega = 1 + (3/8) eps a^2 + O(eps^2)，a 为振幅", "消除长期项的条件即一阶方程右端在 cos tau 与 sin tau 上的投影为零"],
        theorems: ["保守振子的周期解族由振幅参数化，频率修正由一阶可解性条件唯一确定", "自持振子（如 van der Pol）中长期项消除条件同时确定极限环的振幅而非仅频率", "若一阶可解性条件无解，则不存在对应阶的周期解，需重新选取零阶解或引入其他尺度"],
        generalRequirements: ["必须显式写出长期项来源并给出消除条件", "频率与解必须同阶展开，只展开解不展开频率会重新产生长期项", "结论须说明所得为周期解的渐近近似及其有效阶"],
        forbiddenErrors: ["【频率未展开】只展开解不展开频率导致长期项无法消除", "【长期项容忍】保留长期项仍宣称展开一致有效", "【适用范围】把 Lindstedt 法用于非周期或强耗散问题", "【投影遗漏】只消除 cos 分量而漏掉 sin 分量", "【振幅确定】自持振子中忽略振幅由可解性条件确定，误把振幅当自由参数"],
        parameterConstraints: { periodicSolutionAssumption: "方法预设所求解为周期解，周期随 eps 变化", amplitudeParameter: "保守情形振幅自由，自持情形振幅由可解性条件锁定", validityTime: "所得近似在 O(1) 个周期到 O(1/eps) 时间尺度上有效需分别说明" },
        closureChecks: ["检查各阶右端在零空间方向的投影是否全部置零", "检查频率修正代回后是否消去全部长期项", "检查所得周期解是否满足所设初值或相位约定"],
        scenarioChecks: { conservativeOscillator: ["设频率展开", "写一阶方程", "消除长期项得频率修正"], selfSustainedOscillator: ["写可解性条件", "由条件定振幅", "给出极限环近似"], phaseNormalization: ["固定相位约定", "消除平移自由度", "确保解唯一"] },
    },
    // 多重尺度法与可解性条件。
    "asymptotic-multiple-scales": {
        definitions: ["多重尺度法引入互相独立的时间变量 T_0 = t、T_1 = eps t（必要时 T_2 = eps^2 t），把解视为多变量函数", "时间导数按链式法则展开 d/dt = partial_{T_0} + eps partial_{T_1} + ...", "调制方程指对慢变量 T_1 的振幅与相位演化方程，由消除长期项的可解性条件给出"],
        formulas: ["d/dt = partial_{T_0} + eps partial_{T_1} + eps^2 partial_{T_2} + O(eps^3)", "零阶解写成 u_0 = A(T_1) e^{i T_0} + 共轭，A 为复振幅", "Duffing 的调制方程为 2 i A_{T_1} + 3 |A|^2 A = 0，给出 |A| 常数与相位漂移"],
        theorems: ["可解性条件（消除共振项）等价于对一阶方程右端与零阶齐次解做正交投影为零，给出振幅的慢演化方程", "多重尺度法在 t = O(1/eps) 的时间区间上给出一致有效近似，超出该尺度需引入更慢的时间变量", "多重尺度法与平均化方法在一阶给出相同的调制方程，是同一可解性条件的不同实现"],
        generalRequirements: ["必须写清所引入的各个尺度及其独立性假设", "共振项的识别必须依据零阶齐次解的谱，逐项检查", "结论须给出近似有效的时间尺度"],
        forbiddenErrors: ["【尺度不足】只引入一个慢尺度却讨论 t ~ 1/eps^2 的行为", "【共振识别】漏掉某个共振频率分量导致长期项残留", "【导数展开】链式法则展开漏项或阶数错配", "【有效区间】把 O(1/eps) 尺度的结论外推到无穷时间", "【振幅方程】把复振幅方程只取实部处理而丢失相位演化"],
        parameterConstraints: { scaleIndependence: "各时间变量在形式推导中视为独立，最终结果需回代 T_k = eps^k t", resonanceCondition: "共振项由零阶解频率与强迫频率的匹配关系确定", timeValidity: "一阶多重尺度近似的有效时间为 O(1/eps)" },
        closureChecks: ["检查每阶方程右端的共振项是否全部被消除", "检查调制方程是否保有守恒量（如保守系统的振幅不变）", "检查回代后近似是否与数值或已知精确解量级相符"],
        scenarioChecks: { weaklyNonlinearOscillation: ["引入 T_0 与 T_1", "写零阶复振幅解", "由可解性条件得调制方程"], forcedResonance: ["比较强迫频率与自然频率", "引入失谐参数", "得含失谐的调制方程"], longTimeValidity: ["确认所需时间尺度", "必要时引入 T_2", "重述有效区间"] },
    },
    // 平均化定理与慢变系统。
    "asymptotic-averaging-theorem": {
        definitions: ["标准形式慢变系统为 x' = eps f(x, t, eps)，其中 f 关于 t 周期或有平均值", "平均化系统为 y' = eps bar{f}(y)，bar{f}(y) = (1/T) int_0^T f(y, t, 0) dt", "近恒等变换 x = y + eps w(y, t) 用于把原系统化为平均系统加高阶余项"],
        formulas: ["bar{f}(y) = (1/T) int_0^T f(y, t, 0) dt（周期情形）或 lim_{T -> 无穷} (1/T) int_0^T f dt（概周期情形）", "误差估计 |x(t) - y(t)| = O(eps) 对 0 <= t <= C / eps 成立", "极坐标化后 van der Pol 的平均方程为 r' = (eps/2) r (1 - r^2 / 4)，给出极限环半径 r = 2"],
        theorems: ["一阶平均化定理：在 f 关于 x 一致 Lipschitz 且关于 t 周期的条件下，原系统与平均系统的解在 O(1/eps) 时间尺度上相差 O(eps)", "若平均系统有双曲平衡点，则原系统在其邻域有对应的双曲周期解，稳定性与平衡点一致", "共振情形下平均化不能直接进行，需先做共振分离或引入共振变量，否则平均值失去意义"],
        generalRequirements: ["使用平均化前必须把系统化为标准慢变形式并确认小参数出现在整个右端", "必须写出平均的周期或平均过程，并说明平均是对快变量做的", "误差结论必须附带成立的时间区间"],
        forbiddenErrors: ["【时间尺度】把 O(eps) 误差结论外推到无穷长时间", "【标准形式】未化为 x' = eps f 形式即直接对方程系数取平均", "【共振】多频系统中忽略共振直接平均", "【平均对象】对慢变量而非快变量取平均", "【稳定性外推】由平均系统的非双曲平衡点直接推断原系统的稳定性"],
        parameterConstraints: { standardForm: "右端整体带因子 eps，快变量的显式周期性或平均可积性成立", hyperbolicityForPeriodicOrbit: "由平均平衡点推周期解需该平衡点双曲", timeWindow: "误差 O(eps) 的结论限于 t = O(1/eps)" },
        closureChecks: ["检查平均积分是否对快变量在整个周期上完成", "检查平均系统平衡点的双曲性", "检查是否存在共振使平均化失效"],
        scenarioChecks: { limitCycleAmplitude: ["化极坐标标准形式", "对相位取平均", "由平均方程零点定极限环半径"], slowFastEstimate: ["写近恒等变换", "给出 O(eps) 误差", "标明有效时间"], resonantMultiFrequency: ["识别共振组合频率", "引入共振相位变量", "只对非共振部分平均"] },
    },
    // Laplace 方法与驻相法的积分渐近。
    "asymptotic-laplace-stationary-phase": {
        definitions: ["Laplace 方法处理 int g(t) e^{-lambda h(t)} dt 在 lambda -> +无穷 时的渐近，主要贡献来自 h 的最小点", "驻相法处理 int g(t) e^{i lambda h(t)} dt，主要贡献来自 h'(t) = 0 的驻点", "最陡下降法把积分路径变形到复平面上使相位沿路径实部单调，把振荡积分化为 Laplace 型"],
        formulas: ["内点最小 Laplace 主项 int g e^{-lambda h} dt ~ g(t_0) e^{-lambda h(t_0)} sqrt(2 pi / (lambda h''(t_0)))", "端点最小情形主项 ~ g(a) e^{-lambda h(a)} / (lambda h'(a))", "非退化驻点驻相主项 ~ g(t_0) e^{i lambda h(t_0)} sqrt(2 pi / (lambda |h''(t_0)|)) e^{i sigma pi / 4}，sigma = sign h''(t_0)", "无驻点时振荡积分随 lambda 快速衰减，衰减快于任意负幂（在充分光滑且端点贡献消失时）"],
        theorems: ["Laplace 方法的主项由最小点的二阶行为确定，退化情形 h''(t_0) = 0 主项阶变为 lambda^{-1/k}，k 为最低非零导数阶", "驻相法主项含 e^{± i pi / 4} 相位因子，其符号由 h'' 的符号决定，漏掉该因子会导致相位错误", "最陡下降法中鞍点贡献按 e^{-lambda Re h} 大小排序，只有位于变形路径上的鞍点才贡献"],
        generalRequirements: ["先定位极值点或驻点并判断其位于内点还是端点、是否退化", "必须核对二阶导数的符号与非零性再套主项公式", "驻相法必须保留相位因子 e^{± i pi / 4}"],
        forbiddenErrors: ["【相位因子】驻相法漏掉 e^{± i pi / 4} 或符号取反", "【端点内点】把端点极值点误用内点公式，导致主项阶从 lambda^{-1} 错成 lambda^{-1/2}", "【退化点】h''(t_0) = 0 时仍套非退化主项", "【鞍点取舍】把不在变形路径上的鞍点计入贡献", "【符号约定】把 e^{-lambda h} 与 e^{i lambda h} 两类公式混用"],
        parameterConstraints: { largeParameterDirection: "lambda -> +无穷，且 Laplace 情形要求 h 在极小点附近取到全局最小", nondegeneracy: "主项公式要求 h''(t_0) 不等于零，退化时须改用高阶展开", pathAdmissibility: "最陡下降路径变形需保证被积函数解析且端点贡献可控" },
        closureChecks: ["检查主项量级与 lambda 的幂次是否与极值点类型匹配", "检查相位因子与符号", "检查是否存在多个同量级贡献点需相加"],
        scenarioChecks: { laplaceInteriorMinimum: ["定位内点最小", "验证 h'' > 0", "写平方根主项"], stationaryPhaseIntegral: ["求 h' 的零点", "判断 h'' 符号", "写含 pi/4 相位的主项"], steepestDescent: ["找鞍点", "变形路径并判断可达性", "叠加各鞍点贡献"] },
    },
    // Watson 引理与积分的逐项渐近展开。
    "asymptotic-watson-lemma": {
        definitions: ["Watson 引理给出 Laplace 型积分 int_0^T g(t) e^{-lambda t} dt 在 lambda -> 无穷 时的完整渐近展开", "要求 g 在 t = 0 附近有展开 g(t) ~ sum_{n>=0} c_n t^{alpha + n beta}，其中 alpha > -1、beta > 0", "端点贡献指渐近展开完全由被积函数在积分下限附近的局部行为决定"],
        formulas: ["int_0^无穷 t^{s - 1} e^{-lambda t} dt = Gamma(s) / lambda^s (Re s > 0)", "Watson 引理主结论 int_0^T g(t) e^{-lambda t} dt ~ sum_{n>=0} c_n Gamma(alpha + n beta + 1) / lambda^{alpha + n beta + 1}", "一般 int g e^{-lambda h} dt 经变换 u = h(t) - h(t_0) 化为标准 Laplace 型后再用 Watson 引理"],
        theorems: ["在上述条件下逐项渐近展开成立且余项为下一项的量级，展开一般发散但每个有限截断有效", "积分上限 T 有限或无穷不影响渐近展开的各项，差别为指数小量 O(e^{-lambda T})", "若 g 在 t = 0 处只有有限阶展开，则所得渐近展开的项数相应受限，不能形式外推"],
        generalRequirements: ["套用 Watson 引理前必须先把积分化为标准 Laplace 形式并核对指数 alpha > -1", "系数须由 g 在下限处的局部展开逐项读出，并配以正确的 Gamma 因子", "结论须说明展开的渐近性质与指数小量的被忽略"],
        forbiddenErrors: ["【指数条件】在 alpha <= -1 时仍套用引理，忽略积分本身发散", "【Gamma 因子】漏掉 Gamma(alpha + n beta + 1) 或参数偏移一位", "【展开位置】用 g 在积分中点或上限的展开代替下限处展开", "【上限贡献】把 O(e^{-lambda T}) 的指数小量当作幂级数项", "【发散外推】把发散渐近级数求和当作精确值"],
        parameterConstraints: { exponentRange: "要求 alpha > -1 且 beta > 0 以保证逐项积分收敛", integrabilityOfG: "g 需在 (0, T] 上可积且在原点具有所设的幂型展开", largeParameter: "lambda -> +无穷，复参数情形需限制在合适的扇形区域内" },
        closureChecks: ["检查每项的幂次序列是否严格递增", "检查首项与直接估计的量级一致", "检查变量替换后的雅可比因子是否并入 g"],
        scenarioChecks: { standardLaplaceIntegral: ["核对下限处幂型展开", "逐项配 Gamma 因子", "写出前两项"], changeOfVariableFirst: ["用 u = h(t) - h(t_0) 化标准型", "并入雅可比因子", "再用引理"], finiteUpperLimit: ["说明上限贡献为指数小量", "保留幂级数项", "给出余项阶"] },
    },
    // 指数小项与 Stokes 现象。
    "asymptotic-stokes-phenomenon": {
        definitions: ["指数小项指相对主项为 O(e^{-c / eps}) 的贡献，在幂级数渐近展开中全阶不可见", "Stokes 线是复平面中两个渐近解的相对量级发生交换的射线，跨越时渐近表示的组合系数发生跳变", "Borel 求和把发散渐近级数的形式和通过 Borel 变换与解析延拓赋予意义，其奇点结构对应指数小项"],
        formulas: ["Borel 变换 B[f](t) = sum_n a_n t^n / n! 后再作 Laplace 型积分 int_0^无穷 B[f](t) e^{-t / eps} dt", "典型连接公式给出跨越 Stokes 线后系数变化量正比于 e^{-c / eps}", "Airy 方程解在 Stokes 线两侧的渐近表示为指数增长与指数衰减解的不同线性组合"],
        theorems: ["渐近级数的系数增长率（典型为 a_n ~ n! / A^n）与最近 Borel 奇点位置 A 对应，并决定指数小项的量级 e^{-A / eps}", "Stokes 现象表现为渐近表示的系数在跨越 Stokes 线时按连接公式跳变，而所表示的函数本身是解析的、无跳变", "在 Borel 可求和的情形下，形式级数的 Borel 和给出真解，被忽略的指数小项由 Borel 平面奇点的绕行贡献给出"],
        generalRequirements: ["讨论指数小项时必须给出其量级 e^{-c / eps} 中的常数来源", "跨越 Stokes 线时必须写出系数的连接关系而不能沿用同一表示", "必须区分函数本身的解析性与渐近表示的不连续性"],
        forbiddenErrors: ["【跳变归属】把 Stokes 跳变说成解本身的不连续", "【指数小项忽略】在需要指数精度的问题中直接丢弃 e^{-c / eps} 项", "【连接公式】跨越 Stokes 线后继续使用原有系数组合", "【求和滥用】对不 Borel 可求和的级数直接取 Borel 和", "【常数来源】写出指数小项但不说明常数 c 与 Borel 奇点或作用量积分的关系"],
        parameterConstraints: { borelSummability: "Borel 求和要求 Borel 变换在适当扇形内解析延拓且积分收敛", stokesLineLocation: "Stokes 线由相位函数实部相等的条件确定，须在具体问题中算出", exponentialScale: "指数小项的常数 c 由相邻鞍点间的作用量差给出" },
        closureChecks: ["检查渐近系数增长率与所断言的指数小项量级是否一致", "检查连接公式在 Stokes 线两侧给出的表示是否描述同一解析函数", "检查最优截断误差是否与指数小项同量级"],
        scenarioChecks: { exponentialSmallEstimate: ["由系数增长率定 Borel 奇点", "写出 e^{-A/eps} 量级", "说明幂展开不可见"], stokesLineCrossing: ["定位 Stokes 线", "写连接公式", "核对函数解析性"], borelResummation: ["作 Borel 变换", "检验可求和性", "作 Laplace 型积分回代"] },
    },
};
