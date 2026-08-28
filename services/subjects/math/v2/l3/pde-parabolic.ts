import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“偏微分方程-抛物型方程”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const PDE_PARABOLIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 热核与解的积分表示。
    "parabolic-heat-kernel-representation": {
        id: "parabolic-heat-kernel-representation", l2Key: "pde-parabolic", name: "热核与解的表示公式", kind: "formula",
        aliases: ["高斯核", "热半群", "Duhamel", "热核估计"],
    },
    // 抛物极值原理与 Hopf 引理。
    "parabolic-maximum-principle-hopf": {
        id: "parabolic-maximum-principle-hopf", l2Key: "pde-parabolic", name: "抛物极值原理与 Hopf 引理", kind: "theorem",
        aliases: ["弱极值原理", "强极值原理", "抛物边界", "抛物Hopf引理"],
    },
    // 抛物平滑效应与逆时不适定性。
    "parabolic-smoothing-backward-illposedness": {
        id: "parabolic-smoothing-backward-illposedness", l2Key: "pde-parabolic", name: "瞬时光滑与逆时不适定性", kind: "object",
        aliases: ["瞬时光滑", "无限传播速度", "逆时热方程", "解析性"],
    },
    // Harnack 不等式与内部正性估计。
    "parabolic-harnack-inequality": {
        id: "parabolic-harnack-inequality", l2Key: "pde-parabolic", name: "抛物 Harnack 不等式", kind: "theorem",
        aliases: ["抛物Harnack不等式", "时间滞后", "Moser迭代", "正解比较"],
    },
    // Schauder 与 L^p 抛物估计。
    "parabolic-schauder-lp-estimates": {
        id: "parabolic-schauder-lp-estimates", l2Key: "pde-parabolic", name: "抛物 Schauder 与 L^p 估计", kind: "theorem",
        aliases: ["抛物Schauder估计", "抛物L^p估计", "抛物Holder空间", "抛物尺度"],
    },
    // 解析半群生成与抛物型演化方程。
    "parabolic-analytic-semigroup-generation": {
        id: "parabolic-analytic-semigroup-generation", l2Key: "pde-parabolic", name: "解析半群与抛物演化方程", kind: "theorem",
        aliases: ["解析半群", "扇形算子", "分数幂空间", "mild解"],
    },
    // Galerkin 方法与抛物弱解的存在唯一性。
    "parabolic-galerkin-weak-solution": {
        id: "parabolic-galerkin-weak-solution", l2Key: "pde-parabolic", name: "抛物弱解与 Galerkin 构造", kind: "theorem",
        aliases: ["Galerkin逼近", "Lions-Magenes", "Aubin-Lions", "抛物能量不等式"],
    },
    // 比较原理与半线性方程的爆破判据。
    "parabolic-comparison-blowup-criterion": {
        id: "parabolic-comparison-blowup-criterion", l2Key: "pde-parabolic", name: "比较原理与爆破判据", kind: "criterion",
        aliases: ["上下解", "Kaplan方法", "Fujita指数", "有限时间爆破"],
    },
    // De Giorgi-Nash-Moser 型内部正则性。
    "parabolic-de-giorgi-nash-moser": {
        id: "parabolic-de-giorgi-nash-moser", l2Key: "pde-parabolic", name: "散度型抛物方程内部正则性", kind: "theorem",
        aliases: ["De Giorgi-Nash-Moser", "可测系数", "Holder内部估计", "Caccioppoli不等式"],
    },
    // Stefan 问题与自由边界条件。
    "parabolic-stefan-free-boundary": {
        id: "parabolic-stefan-free-boundary", l2Key: "pde-parabolic", name: "Stefan 问题与自由边界", kind: "object",
        aliases: ["Stefan条件", "潜热", "自由边界", "弱焓形式"],
    },
});

// 规则字段固定为 8 项：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const PDE_PARABOLIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // 热核、热半群与非齐次问题的 Duhamel 表示。
    "parabolic-heat-kernel-representation": {
        definitions: ["热核 Phi(x, t) = (4 pi t)^{-n/2} e^{-|x|^2 / (4t)}（t > 0）", "热半群 S(t) f = Phi(·, t) * f", "非齐次问题 u_t - Delta u = f"],
        formulas: ["初值问题解：u(x, t) = int Phi(x - y, t) u_0(y) dy", "Duhamel：u(t) = S(t) u_0 + int_0^t S(t - s) f(s) ds", "核估计：||Phi(·, t)||_{L^1} = 1，||Phi(·, t)||_{L^infinity} = (4 pi t)^{-n/2}", "L^p-L^q 衰减：||S(t) f||_{L^q} <~ t^{-(n/2)(1/p - 1/q)} ||f||_{L^p}（p <= q）", "导数估计：||grad^k S(t) f||_{L^p} <~ t^{-k/2} ||f||_{L^p}"],
        theorems: ["热核为正且质量守恒，故半群保正、保 L^1 质量并在 L^p（1 <= p < infinity）上强连续；在 L^infinity 上只强连续于有界一致连续子空间", "解公式对 u_0 in L^infinity 或增长不超过 e^{a|x|^2} 的初值有效；超此增长时积分发散，唯一性也失效（Tychonov 反例）", "t -> 0 时 S(t) u_0 -> u_0 只在 L^p 范数或连续点意义下成立，不能逐点无条件断言", "变系数或有界区域上核不再是高斯，但满足 Aronson 型上下界（一致椭圆时）"],
        generalRequirements: ["用积分表示必须声明初值的增长条件", "非齐次项必须写 Duhamel 而非直接加和", "写衰减估计必须给出 p、q 与指数关系"],
        forbiddenErrors: ["【增长越界】对增长快于 e^{a|x|^2} 的初值使用表示公式", "【唯一性误断】不加增长限制断言全空间热方程解唯一", "【Duhamel 遗漏】非齐次问题只写齐次公式", "【衰减指数错】写成与维数或 p, q 无关的衰减", "【核形式误用】有界区域直接用全空间高斯核"],
        parameterConstraints: { timePositivity: "核仅对 t > 0 定义", initialGrowth: "|u_0| <~ e^{a |x|^2} 且 a 与时间区间相容", exponentOrder: "L^p-L^q 需 p <= q", domainType: "全空间才用高斯核，边界情形需 Green 核" },
        closureChecks: ["确认初值增长条件", "确认非齐次项的 Duhamel 项", "确认衰减指数与 p, q, n 匹配", "确认区域与核形式一致"],
        scenarioChecks: { wholeSpaceCauchyProblem: ["用高斯核卷积求解", "确认初值可积或有界"], nonhomogeneousSource: ["用 Duhamel 得 mild 解", "确认 f 的时间可积性"], gradientDecayEstimate: ["用 t^{-1/2} 型导数估计", "确认半群作用在 L^p"] },
    },
    // 抛物极值原理、强极值原理与 Hopf 边界引理。
    "parabolic-maximum-principle-hopf": {
        definitions: ["抛物柱体 Q_T = Omega × (0, T]", "抛物边界 partial_p Q_T = (cl(Omega) × {0}) cup (partial Omega × [0, T])", "算子 L u = u_t - a^{ij} D_{ij} u - b^i D_i u - c u"],
        formulas: ["弱极值原理（c = 0，L u <= 0）：max_{cl(Q_T)} u = max_{partial_p Q_T} u", "含 c <= 0 时：max u <= max_{partial_p Q_T} u^+", "强极值原理：若内部点达到最大且 L u <= 0，则 u 在该点之前的时间层上恒为常数", "Hopf 引理：边界最大点处 partial u / partial nu > 0（nu 外法向，需内球条件）"],
        theorems: ["极值原理只在抛物边界上取最大值，终端时刻 t = T 的截面不属于抛物边界，故不能把 t = T 当作可取最大的边界", "强极值原理的常数传播只向过去时间成立（时间不可逆），不能推断未来时刻恒常", "c 的符号至关重要：c > 0 时结论对 u 本身失效，需改用 u^+ 或作指数变换", "Hopf 引理需要内球条件与算子一致抛物性；Lipschitz 角点处结论可能失效"],
        generalRequirements: ["使用极值原理必须写清抛物边界的组成", "必须核对零阶系数符号条件", "强极值原理结论必须限定时间方向"],
        forbiddenErrors: ["【边界集误设】把 t = T 截面算入抛物边界", "【符号条件缺失】c > 0 时直接套用无符号约束的极值原理", "【时间方向错】用强极值原理断言未来时刻恒常", "【一致抛物性忽视】退化算子直接使用 Hopf 引理", "【内球条件缺失】非光滑边界点断言法向导数严格正"],
        parameterConstraints: { zeroOrderSign: "需 c <= 0（否则改用变换或 u^+）", uniformParabolicity: "a^{ij} 一致正定", boundaryRegularity: "Hopf 需内球条件", timeDirection: "结论沿时间正向单侧" },
        closureChecks: ["确认抛物边界定义", "确认 c 的符号处理", "确认时间方向", "确认边界几何条件"],
        scenarioChecks: { uniquenessForDirichlet: ["用极值原理得唯一性", "确认差解满足零抛物边界值"], positivityPreservation: ["非负初值得非负解", "确认 c <= 0"], boundaryGradientEstimate: ["用 Hopf 引理得严格法向导数", "确认内球条件"] },
    },
    // 瞬时光滑、无限传播速度与逆时问题的不适定性。
    "parabolic-smoothing-backward-illposedness": {
        definitions: ["瞬时光滑：t > 0 时解属 C^infinity（甚至解析）", "逆时热方程：给定 u(T) 反求 u(0)", "Gevrey / 解析类估计"],
        formulas: ["光滑化估计：||grad^k u(t)||_{L^2} <~ t^{-k/2} ||u_0||_{L^2}", "频率放大（逆时）：Fourier 侧 e^{|xi|^2 t} 因子导致高频指数放大", "条件稳定（逆时）：||u(0)|| <~ ||u(T)||^{t/T} ||u(0)||^{1 - t/T} 型对数凸性估计", "无限传播：紧支撑非负初值使 u(x, t) > 0 对一切 x 与 t > 0"],
        theorems: ["抛物方程瞬时把 L^2 初值光滑为解析函数，但这一效应不可逆：逆时问题在任何 Sobolev 范数下不连续依赖数据（Hadamard 不适定）", "无限传播速度是与双曲方程的本质差别，故不存在依赖域或有限支撑保持性", "逆时问题只在附加先验界（如 ||u(0)|| <= M）下条件稳定，稳定性为对数型，故数值反演需正则化（Tikhonov、准可逆法）", "解在 t > 0 光滑不蕴含在 t = 0 光滑；初值不光滑处的正则性提升只对 t > 0 成立"],
        generalRequirements: ["讨论逆时问题必须声明不适定性与所加先验界", "断言正则性必须限定 t > 0", "不得对抛物问题使用依赖域或有限传播语言"],
        forbiddenErrors: ["【逆时适定】断言逆时热方程连续依赖终端数据", "【有限传播误植】对热方程给出光锥或依赖域", "【正则性时刻错】把 t > 0 的光滑性延伸到 t = 0", "【稳定性阶误设】把逆时稳定性写成 Lipschitz 或 Holder 而非对数型", "【正则化缺失】数值反演不加正则化即断言可解"],
        parameterConstraints: { timePositivity: "光滑性结论仅对 t > 0", priorBound: "逆时条件稳定需 ||u(0)|| <= M", regularizationParameter: "Tikhonov 参数需与噪声水平匹配", propagationSpeed: "传播速度无限，无依赖域" },
        closureChecks: ["确认时间区间与正则性对应", "确认逆时结论附带先验界", "确认稳定性阶为对数型", "确认未使用有限传播语言"],
        scenarioChecks: { instantSmoothing: ["由核卷积得解析性", "确认 t > 0"], backwardIdentification: ["加先验界得条件稳定", "确认正则化策略"], strongPositivity: ["非负初值瞬时全空间正", "确认初值非零"] },
    },
    // 抛物 Harnack 不等式与时间滞后结构。
    "parabolic-harnack-inequality": {
        definitions: ["非负解 u > 0 于 Q = B_{2R} × (0, T)", "抛物柱体 Q^- = B_R × (t_0 - 3 theta, t_0 - 2 theta)，Q^+ = B_R × (t_0 - theta, t_0)", "Moser 迭代与反 Holder 不等式"],
        formulas: ["Harnack（Moser 形式）：sup_{Q^-} u <= C inf_{Q^+} u，C 只依赖 n 与椭圆常数", "尺度：theta ~ R^2（抛物尺度 |x| ~ sqrt(t)）", "Harnack 链推论：Holder 连续性指数 alpha = alpha(n, lambda, Lambda)", "Li-Yau 型微分 Harnack（Ricci 非负）：|grad log u|^2 - partial_t log u <= n / (2 t)"],
        theorems: ["抛物 Harnack 必须带时间滞后：上确界取在较早时间柱、下确界取在较晚时间柱，同一时刻的 sup 与 inf 无法互控", "Harnack 不等式经 Harnack 链给出内部 Holder 估计，是 De Giorgi-Nash-Moser 理论的核心", "Harnack 常数与解无关但依赖椭圆界与维数；退化（p-Laplace、退化权）情形形式需修改（内蕴尺度）", "在 Ricci 曲率非负流形上 Li-Yau 不等式给出尖锐梯度估计并推出热核上下界"],
        generalRequirements: ["写 Harnack 不等式必须标出时间滞后与柱体位置", "必须声明解非负与一致抛物性", "尺度关系必须使用抛物尺度 t ~ R^2"],
        forbiddenErrors: ["【时间滞后缺失】写成同一时刻的 sup <= C inf", "【正性缺失】对变号解使用 Harnack", "【尺度错配】用椭圆尺度 t ~ R 代替 R^2", "【常数依赖误设】声称常数与椭圆界无关", "【退化情形照搬】对 p-Laplace 型直接用线性形式"],
        parameterConstraints: { nonnegativity: "u >= 0 于整个柱体", uniformParabolicity: "lambda |xi|^2 <= a^{ij} xi_i xi_j <= Lambda |xi|^2", timeLagRequirement: "sup 取较早时间层", scalingRelation: "theta ~ R^2" },
        closureChecks: ["确认时间滞后结构", "确认解非负", "确认抛物尺度", "确认常数依赖参数"],
        scenarioChecks: { holderRegularityDerivation: ["用 Harnack 链得振幅衰减", "确认柱体嵌套"], heatKernelBounds: ["用 Harnack 得核上下界", "确认非负性"], liYauGradientEstimate: ["曲率条件下用微分 Harnack", "确认 Ric >= 0"] },
    },
    // 抛物 Schauder 估计与 L^p（Ladyzhenskaya-Solonnikov-Uraltseva）估计。
    "parabolic-schauder-lp-estimates": {
        definitions: ["抛物 Holder 空间 C^{2 + alpha, 1 + alpha/2}", "抛物 Sobolev 空间 W_p^{2,1} = {u : u, D u, D^2 u, u_t in L^p}", "抛物距离 d((x,t),(y,s)) = |x - y| + |t - s|^{1/2}"],
        formulas: ["Schauder：||u||_{C^{2+alpha, 1+alpha/2}} <= C (||L u||_{C^{alpha, alpha/2}} + ||u||_{L^infinity})，需系数 C^{alpha}", "L^p 估计：||u||_{W_p^{2,1}(Q)} <= C (||f||_{L^p(Q)} + ||u_0||_{W^{2 - 2/p, p}})，1 < p < infinity", "内部估计（尺度化）：||D^2 u||_{L^p(Q_{R/2})} <= C (||f||_{L^p(Q_R)} + R^{-2} ||u||_{L^p(Q_R)})", "抛物嵌入：W_p^{2,1} 嵌入 C^{alpha, alpha/2}，当 p > (n + 2) / (1 - alpha) 型条件成立"],
        theorems: ["估计中时间导数与二阶空间导数同权，故正则性必须按抛物尺度计数（一阶时间导 = 二阶空间导）", "Schauder 估计要求系数 Holder 连续；仅可测有界系数时 C^{2+alpha} 估计失效，只能得 De Giorgi-Nash-Moser 型 Holder 估计", "L^p 估计对 p = 1 与 p = infinity 失效（需 BMO / Besov 端点修正）", "初值相容性：全局 W_p^{2,1} 估计需初值属迹空间 W^{2 - 2/p, p}，否则出现 t = 0 附近奇性"],
        generalRequirements: ["写估计必须使用抛物尺度并说明时间与空间导数权重", "必须声明系数正则性与 p 的范围", "全局估计必须给出初值与边界的相容性条件"],
        forbiddenErrors: ["【尺度混用】按椭圆尺度平权计数时间与空间导数", "【系数条件缺失】可测系数下断言 Schauder 估计", "【端点滥用】在 p = 1 或 p = infinity 用 L^p 估计", "【初值迹忽略】不检查初值属 W^{2-2/p,p} 就写全局估计", "【边界相容性缺失】角点处不验证初边值相容仍断言高正则性"],
        parameterConstraints: { coefficientRegularity: "Schauder 需 a^{ij} in C^{alpha}", exponentRange: "L^p 估计需 1 < p < infinity", parabolicScaling: "时间权重为空间权重的一半", initialTrace: "u_0 in W^{2-2/p, p}" },
        closureChecks: ["确认抛物尺度权重", "确认系数正则性", "确认 p 的取值范围", "确认初边值相容性"],
        scenarioChecks: { bootstrapRegularity: ["用 Schauder 逐步提升正则性", "确认系数光滑度足够"], quasilinearFixedPoint: ["用 L^p 估计做压缩", "确认 p 满足嵌入"], boundaryRegularityNearCorner: ["检查初边相容性", "确认角点条件"] },
    },
    // 解析半群、扇形算子与 mild 解框架。
    "parabolic-analytic-semigroup-generation": {
        definitions: ["扇形算子：sigma(-A) 落在扇形 Sigma_{theta} 内且 resolvent 有 1/|lambda| 界", "解析半群 e^{-tA}（可解析延拓到扇形）", "分数幂空间 D(A^alpha)", "mild 解 u(t) = e^{-tA} u_0 + int_0^t e^{-(t-s)A} f(s) ds"],
        formulas: ["生成判据：||(lambda + A)^{-1}|| <= M / |lambda| 于 |arg lambda| < pi/2 + delta", "光滑估计：||A^alpha e^{-tA}|| <= C_alpha t^{-alpha}（t > 0，alpha >= 0）", "Dunford 表示：e^{-tA} = (1 / 2 pi i) oint_Gamma e^{-t lambda} (lambda + A)^{-1} d lambda", "半线性局部存在：f 在 D(A^alpha) 上局部 Lipschitz 时得局部 mild 解"],
        theorems: ["解析半群的生成条件（扇形性）严格强于 Hille-Yosida 的 C_0 半群条件，故不能由 C_0 半群断言瞬时光滑与 t^{-alpha} 估计", "扇形算子给出 t > 0 的解析正则性与分数幂空间上的光滑作用，这正是抛物型问题与双曲型问题在半群层面的分界", "mild 解不自动是强解：需 f Holder 连续（时间）或落在合适插值空间才提升为经典解", "非自伴与非稠定情形需谨慎：非稠定域上需用 Hille-Yosida-Phillips 或积分半群框架"],
        generalRequirements: ["断言解析半群必须验证扇形 resolvent 估计", "用 t^{-alpha} 估计必须说明分数幂空间", "由 mild 解升级为经典解必须补时间正则性条件"],
        forbiddenErrors: ["【半群类别混淆】用 C_0 半群条件断言解析半群性质", "【扇形角错】扇形取到 |arg| < pi/2 而不含 delta 余量", "【mild 即经典】不加条件把 mild 解当经典解", "【分数幂域忽略】在 D(A^alpha) 外使用 A^alpha 估计", "【稠定性缺失】非稠定域上直接套标准生成定理"],
        parameterConstraints: { sectorialAngle: "扇形张角需超过 pi/2（含 delta）", resolventBound: "||(lambda + A)^{-1}|| <= M/|lambda|", fractionalPowerRange: "0 <= alpha < 1 常用于半线性项", nonlinearityLipschitz: "f 在分数幂空间局部 Lipschitz" },
        closureChecks: ["确认扇形性与 resolvent 估计", "确认分数幂空间选取", "确认 mild 解与强解的区分", "确认稠定与闭性假设"],
        scenarioChecks: { semilinearHeatLocalTheory: ["用解析半群做不动点", "确认非线性项分数幂 Lipschitz"], smoothingEstimateUse: ["用 t^{-alpha} 弥补导数损失", "确认 t > 0"], nonselfadjointParabolic: ["验证扇形性而非仅耗散性", "确认 resolvent 界"] },
    },
    // Galerkin 逼近、能量不等式与抛物弱解框架。
    "parabolic-galerkin-weak-solution": {
        definitions: ["弱解空间 u in L^2(0,T; H_0^1) 且 u_t in L^2(0,T; H^{-1})", "双线性形式 a(u, v) 与 Gelfand 三元组 V subset H subset V^*", "有限维 Galerkin 投影 u_m in span{w_1, ..., w_m}"],
        formulas: ["弱形式：<u_t, v> + a(u, v) = <f, v> 对几乎所有 t 与所有 v in H_0^1", "能量不等式：sup_t ||u||_{L^2}^2 + int_0^T ||grad u||_{L^2}^2 <~ ||u_0||_{L^2}^2 + int_0^T ||f||_{H^{-1}}^2", "链式法则（Lions-Magenes）：d/dt ||u||_{L^2}^2 = 2 <u_t, u>，需 u in L^2(0,T;V), u_t in L^2(0,T;V^*)", "Aubin-Lions：L^2(0,T;V) 中有界且 u_t 在 L^2(0,T;V^*) 有界的族在 L^2(0,T;H) 中紧"],
        theorems: ["Galerkin 极限的通过需要弱收敛加紧性；非线性项必须用 Aubin-Lions 型紧性定理，单靠弱收敛不能过极限", "弱解连续性 u in C([0,T]; L^2) 由 Lions-Magenes 引理得到，故初值取值有意义", "抛物弱解在 Gelfand 三元组下唯一（线性一致椭圆情形）；非线性情形唯一性需额外单调性或 Lipschitz 结构", "强制性（coercivity）a(v,v) >= alpha ||v||_V^2 - C ||v||_H^2 足以给出能量估计，不必要求严格正定"],
        generalRequirements: ["写弱解必须给出 u 与 u_t 所属的时空空间", "过极限必须指明所用紧性定理", "使用能量法必须依赖 Lions-Magenes 链式法则而非逐点求导"],
        forbiddenErrors: ["【空间缺失】只写 u in L^2(0,T;H^1) 而不给 u_t 的空间", "【紧性缺失】非线性项仅用弱收敛过极限", "【链式法则误用】对弱解逐点使用经典链式法则", "【强制性条件缺失】不验证 coercivity 即断言能量估计", "【初值意义不明】未建立 C([0,T];L^2) 就谈初值取值"],
        parameterConstraints: { gelfandTriple: "V subset H subset V^* 稠密连续嵌入", coercivityCondition: "a(v,v) >= alpha ||v||_V^2 - C ||v||_H^2", sourceRegularity: "f in L^2(0,T; V^*)", compactnessTool: "非线性需 Aubin-Lions 紧性" },
        closureChecks: ["确认 u 与 u_t 的空间", "确认强制性条件", "确认紧性来源", "确认解的时间连续性"],
        scenarioChecks: { linearParabolicExistence: ["Galerkin 加能量估计得弱解", "确认 coercivity"], nonlinearReactionDiffusion: ["用 Aubin-Lions 过极限", "确认非线性项增长可控"], uniquenessArgument: ["对差解用能量法", "确认链式法则条件"] },
    },
    // 上下解比较原理与半线性抛物方程爆破判据。
    "parabolic-comparison-blowup-criterion": {
        definitions: ["上解 bar{u}：bar{u}_t - Delta bar{u} >= f(bar{u})；下解反向", "爆破时间 T^* = sup{t : ||u(t)||_{L^infinity} < infinity}", "Fujita 指数 p_F = 1 + 2/n", "Kaplan 方法（用第一特征函数作试探）"],
        formulas: ["ODE 比较：u_t = u^p 的解在 T^* = 1 / ((p-1) u_0^{p-1}) 爆破", "Kaplan 泛函 J(t) = int u phi_1 dx，满足 J' >= -lambda_1 J + c J^p（由 Jensen）", "临界指数：u_t = Delta u + u^p 在 R^n 上小初值全局存在当 p > p_F = 1 + 2/n；p <= p_F 时所有非平凡非负解爆破", "Sobolev 临界（有界域、能量方法）：p < (n+2)/(n-2) 给出能量框架的次临界性"],
        theorems: ["比较原理要求非线性项对 u 单调或 Lipschitz（准单调），否则上下解夹逼不成立", "Fujita 现象说明爆破与否由维数与指数共同决定，故不能只看指数大小", "有界域上 Dirichlet 条件与全空间的爆破阈值不同：有界域第一特征值提供额外耗散，可导致小初值全局存在与大初值爆破共存", "爆破为 L^infinity 范数爆破，不必蕴含 L^1 或能量范数爆破（存在不完全爆破与延拓现象）"],
        generalRequirements: ["用比较原理必须验证非线性项的单调性或 Lipschitz 性", "给爆破结论必须区分维数、指数与区域类型", "写爆破必须明确所用范数"],
        forbiddenErrors: ["【单调性缺失】非单调非线性项直接用上下解夹逼", "【指数判据误用】忽略维数只按 p > 1 判断爆破", "【区域混用】把全空间 Fujita 阈值用于有界域 Dirichlet 问题", "【范数不明】只说“解爆破”而不指定范数", "【初值符号忽视】对变号初值套用非负解爆破结论"],
        parameterConstraints: { nonlinearityMonotonicity: "f 需准单调或局部 Lipschitz", fujitaThreshold: "p_F = 1 + 2/n（全空间）", initialSign: "Fujita 型结论需初值非负非平凡", domainType: "有界域需含第一特征值 lambda_1 的判据" },
        closureChecks: ["确认比较原理适用条件", "确认维数与指数关系", "确认区域与边界条件", "确认爆破范数"],
        scenarioChecks: { supersolutionGlobalExistence: ["构造全局上解得全局存在", "确认上解不等式方向"], kaplanBlowupProof: ["用第一特征函数泛函证爆破", "确认 Jensen 可用与 p > 1"], criticalExponentDiscussion: ["按 p 与 p_F 比较定结论", "确认维数 n"] },
    },
    // 散度型可测系数抛物方程的 De Giorgi-Nash-Moser 内部正则性。
    "parabolic-de-giorgi-nash-moser": {
        definitions: ["散度型方程 u_t - div(A(x, t) grad u) = 0，A 仅可测且一致椭圆", "Caccioppoli（能量）不等式", "De Giorgi 类函数", "抛物内蕴柱体 Q_R = B_R × (t_0 - R^2, t_0]"],
        formulas: ["Caccioppoli：int_{Q_{R/2}} |grad u|^2 <~ R^{-2} int_{Q_R} |u - k|^2 + 时间边界项", "振幅衰减：osc_{Q_{R/2}} u <= gamma osc_{Q_R} u，gamma < 1", "Holder 估计：|u(x,t) - u(y,s)| <~ (|x-y| + |t-s|^{1/2})^{alpha} ||u||_{L^2(Q_R)} / R^{alpha}", "Moser 迭代给出 sup 估计：sup_{Q_{R/2}} |u| <~ (average_{Q_R} |u|^2)^{1/2}"],
        theorems: ["Nash-De Giorgi-Moser 定理：一致椭圆可测系数下弱解自动内部 Holder 连续，指数 alpha 只依赖 n 与椭圆比 Lambda/lambda", "该结论不能提升到 C^1：可测系数下梯度一般不连续，故不能引用 Schauder 结论", "非散度型方程的对应理论是 Krylov-Safonov（需借助抛物 Harnack 与 ABP 型估计），两条路线的假设不可互换", "结论是内部的：边界正则性需额外几何条件（如外锥、Lipschitz 边界与 Wiener 型准则）"],
        generalRequirements: ["使用该正则性必须声明散度型与一致椭圆性", "正则性结论只能提到 Holder，不得提到导数连续", "区分散度型与非散度型所用理论"],
        forbiddenErrors: ["【正则性越级】由可测系数断言 C^1 或 C^{2}", "【方程型混用】对非散度型方程引用 De Giorgi-Nash-Moser", "【椭圆性缺失】退化或非一致椭圆情形照搬结论", "【边界外推】把内部 Holder 估计当作到边界的估计", "【尺度错误】Holder 距离不用抛物距离 |t-s|^{1/2}"],
        parameterConstraints: { equationForm: "需散度型弱形式", ellipticityRatio: "alpha 依赖 Lambda / lambda 与 n", regularityCeiling: "结论上限为 C^{alpha}", scopeInterior: "结论为内部估计" },
        closureChecks: ["确认方程为散度型", "确认一致椭圆常数", "确认正则性上限", "确认抛物距离与内部范围"],
        scenarioChecks: { measurableCoefficientProblem: ["由 Caccioppoli 与迭代得 Holder", "确认一致椭圆"], nonlinearDivergenceStructure: ["用 De Giorgi 类论证", "确认结构条件（p 增长）"], boundaryRegularityQuestion: ["补边界几何条件", "确认外锥或 Lipschitz"] },
    },
    // Stefan 问题的自由边界条件与弱焓形式。
    "parabolic-stefan-free-boundary": {
        definitions: ["两相 Stefan 问题：固液两相各满足热方程，界面 s(t) 未知", "潜热 L 与焓 H(u)（在 u = 0 处含跳跃区间）", "弱（焓）形式：H(u)_t = Delta u 于分布意义"],
        formulas: ["Stefan 条件：L s'(t) = k_s partial_n u_s - k_l partial_n u_l（界面热流跳跃 = 潜热吸放）", "界面温度条件：u = 0 于 x = s(t)（无过冷、忽略曲率时）", "一维自相似解：s(t) = 2 beta sqrt(t)，beta 由超越方程（含 erf 与潜热）确定", "带曲率修正（Gibbs-Thomson）：u = -sigma kappa 于界面"],
        theorems: ["弱焓形式给出全局弱解的存在唯一性（单相与两相经典设定），无需事先知道界面正则性；界面正则性是后验结果", "经典解一般只局部存在：界面可发生拓扑变化（融化断裂），故不能默认界面全时光滑", "过冷 Stefan 问题（无 Gibbs-Thomson 修正）不适定，界面可即刻失稳；加曲率项后适定性恢复", "Stefan 条件是能量（焓）守恒的界面形式，遗漏潜热项会破坏总焓守恒"],
        generalRequirements: ["写界面条件必须同时给出温度条件与热流跳跃条件", "弱解必须用焓形式并说明 H 的多值区间", "断言界面正则性必须给出条件或引用后验结果"],
        forbiddenErrors: ["【潜热遗漏】界面条件只写温度连续不写热流跳跃", "【焓形式缺失】用单一温度方程处理相变而不引入焓", "【界面正则性预设】默认界面为光滑曲线且全时存在", "【过冷不适定忽视】对过冷情形直接断言适定", "【符号错置】Stefan 条件中热流方向或潜热符号相反"],
        parameterConstraints: { latentHeatPositive: "L > 0", enthalpyMultivalued: "H 在 u = 0 处取区间 [0, L]", interfaceCondition: "需温度与热流两条条件", supercoolingRegularization: "过冷情形需 Gibbs-Thomson 项" },
        closureChecks: ["确认界面两条条件齐备", "确认焓的多值处理", "确认界面正则性来源", "确认过冷情形的正则化"],
        scenarioChecks: { oneDimensionalMelting: ["用自相似解定 beta", "确认潜热与热扩散系数"], weakEnthalpyFormulation: ["用焓形式证存在唯一", "确认 H 单调"], supercooledInstability: ["加曲率修正恢复适定", "确认表面张力系数"] },
    },
};
