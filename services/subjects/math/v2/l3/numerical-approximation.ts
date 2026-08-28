import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数值分析-函数逼近”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMERICAL_APPROXIMATION_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 插值余项、Lebesgue 常数与 Runge 现象。
    "numapx-polynomial-interpolation-error": {
        id: "numapx-polynomial-interpolation-error", l2Key: "numerical-approximation", name: "多项式插值余项与 Runge 现象", kind: "theorem",
        aliases: ["插值余项", "Runge现象", "Lebesgue常数", "等距节点失效"],
    },
    // Chebyshev 极小极大逼近与等波动刻画。
    "numapx-chebyshev-minimax": {
        id: "numapx-chebyshev-minimax", l2Key: "numerical-approximation", name: "Chebyshev 极小极大逼近", kind: "theorem",
        aliases: ["极小极大逼近", "Chebyshev节点", "等波动定理", "Chebyshev多项式"],
    },
    // 正交多项式与最小二乘逼近。
    "numapx-least-squares-orthogonal-polynomials": {
        id: "numapx-least-squares-orthogonal-polynomials", l2Key: "numerical-approximation", name: "正交多项式最小二乘逼近", kind: "algorithm",
        aliases: ["正交多项式基", "三项递推", "Legendre多项式", "Gram矩阵病态"],
    },
    // 样条插值与极小弯曲能量性质。
    "numapx-spline-interpolation": {
        id: "numapx-spline-interpolation", l2Key: "numerical-approximation", name: "样条插值", kind: "object",
        aliases: ["三次样条", "B样条", "自然边界条件", "极小弯曲能量"],
    },
    // Newton-Cotes 求积与代数精度。
    "numapx-newton-cotes-quadrature": {
        id: "numapx-newton-cotes-quadrature", l2Key: "numerical-approximation", name: "Newton-Cotes 求积公式", kind: "formula",
        aliases: ["复化梯形公式", "Simpson公式", "代数精度", "Euler-Maclaurin余项"],
    },
    // Gauss 型求积与正交多项式零点。
    "numapx-gauss-quadrature": {
        id: "numapx-gauss-quadrature", l2Key: "numerical-approximation", name: "Gauss 型求积", kind: "theorem",
        aliases: ["Gauss求积", "求积节点为正交多项式零点", "最高代数精度", "Gauss-Lobatto"],
    },
    // Richardson 外推与 Romberg 积分。
    "numapx-romberg-extrapolation": {
        id: "numapx-romberg-extrapolation", l2Key: "numerical-approximation", name: "Richardson 外推与 Romberg 积分", kind: "algorithm",
        aliases: ["Richardson外推", "Romberg积分", "自适应求积", "误差阶提升"],
    },
    // 离散 Fourier 变换、FFT 与谱逼近。
    "numapx-fft-trigonometric": {
        id: "numapx-fft-trigonometric", l2Key: "numerical-approximation", name: "快速 Fourier 变换与三角逼近", kind: "algorithm",
        aliases: ["快速Fourier变换", "离散Fourier变换", "谱精度", "混叠现象"],
    },
    // 有理逼近与 Pade 逼近。
    "numapx-rational-pade": {
        id: "numapx-rational-pade", l2Key: "numerical-approximation", name: "有理逼近与 Pade 逼近", kind: "object",
        aliases: ["Pade逼近", "有理逼近", "极点捕捉", "伪极点"],
    },
    // 数值微分的截断误差与舍入误差权衡。
    "numapx-numerical-differentiation-tradeoff": {
        id: "numapx-numerical-differentiation-tradeoff", l2Key: "numerical-approximation", name: "数值微分的截断-舍入权衡", kind: "criterion",
        aliases: ["数值微分", "中心差分", "最优步长", "相减相消"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMERICAL_APPROXIMATION_L3_RULES: Record<string, MathV2L3Rules> = {
    // 插值余项、Lebesgue 常数与 Runge 现象。
    "numapx-polynomial-interpolation-error": {
        definitions: ["给定 n+1 个互异节点，插值多项式 p_n 是唯一次数不超过 n 且在节点处与 f 取值相同的多项式", "Lebesgue 常数 Lambda_n = max_x sum_i |l_i(x)| 度量插值算子在无穷范数下的范数，刻画节点分布的稳定性", "Runge 现象指等距节点上高次插值在区间端点附近出现剧烈振荡且不收敛的行为"],
        formulas: ["余项 f(x) - p_n(x) = f^{(n+1)}(xi) / (n+1)! * prod_i (x - x_i)，xi 介于节点与 x 之间", "误差不等式 ||f - p_n||_inf <= (1 + Lambda_n) ||f - p_n^*||_inf，p_n^* 为最佳一致逼近", "等距节点 Lambda_n 约 2^n / (e n log n) 指数增长，Chebyshev 节点 Lambda_n 约 (2 / pi) log n 对数增长", "Newton 形式 p_n(x) = sum_k f[x_0, ..., x_k] prod_{j<k} (x - x_j)，差商 f[x_0, ..., x_k] = f^{(k)}(xi) / k!"],
        theorems: ["互异节点上的插值多项式存在且唯一，其系数矩阵为 Vandermonde 矩阵，故唯一性来自节点互异", "余项公式要求 f 在包含所有节点与求值点的区间上 n+1 阶连续可导；仅连续的 f 没有这种余项表示", "Runge 定理型结论：存在在区间上解析的函数（如 1 / (1 + 25 x^2)）使等距节点插值在端点附近发散，故提高次数不必然提高精度", "Faber 定理：不存在一个节点序列使得对所有连续函数插值都一致收敛；一致收敛需对 f 的光滑性或节点分布（如 Chebyshev 分布）作额外假设"],
        generalRequirements: ["使用余项公式前必须验证所需的可导阶数，并明确 xi 依赖于 x 且位置未知", "讨论收敛性时必须同时说明节点分布与函数光滑性，不能只提次数", "把误差拆成最佳逼近误差与 Lebesgue 常数放大两部分，避免把插值误差与逼近误差混为一谈"],
        forbiddenErrors: ["【光滑性缺失】对只连续或低阶可导的函数套用含 f^{(n+1)} 的余项公式", "【收敛误断】断言插值次数越高精度越好，忽视 Runge 现象与 Lebesgue 常数的指数增长", "【节点重合】在节点重合时仍用 Lagrange 基而不转向 Hermite 插值", "【中值点滥用】把 xi 当作与 x 无关的固定点从而对余项求导或积分", "【存在性外推】由存在性唯一性推出数值稳定性，忽视 Vandermonde 矩阵的严重病态"],
        parameterConstraints: { nodeDistinctness: "节点必须互异，重节点情形需改用 Hermite 插值", smoothness: "余项公式要求 f 属于 C^{n+1}[a, b]", nodeDistribution: "一致收敛的实用充分条件是采用 Chebyshev 或 Legendre-Gauss-Lobatto 型节点", degreeLimit: "等距节点下次数通常不超过 10 左右，更高次应改用分段低次或谱方法" },
        closureChecks: ["检查是否声明节点互异性与函数光滑阶", "检查是否讨论节点分布对稳定性的影响", "检查误差估计是否区分逼近误差与插值算子放大"],
        scenarioChecks: { rungeExample: ["对 1 / (1 + 25 x^2) 在 [-1, 1] 用等距节点高次插值，验证端点振荡发散", "改用 Chebyshev 节点后验证一致收敛"], lowSmoothness: ["对分段光滑函数说明余项公式失效，改用分段线性或样条", "禁止直接套用高阶导数余项"], conditioningTrap: ["用单项式基解 Vandermonde 系统观察病态，改用 Newton 或重心形式", "指出唯一性不保证计算稳定"] },
    },
    // Chebyshev 极小极大逼近与等波动定理。
    "numapx-chebyshev-minimax": {
        definitions: ["f 在 [a, b] 上的 n 次最佳一致逼近（极小极大逼近）指使 ||f - p||_inf 最小的次数不超过 n 的多项式", "第一类 Chebyshev 多项式 T_n(x) = cos(n arccos x)，其零点与极值点分别给出 Chebyshev 节点与 Chebyshev-Lobatto 节点", "等波动指误差函数在至少 n+2 个点上交替达到最大绝对值"],
        formulas: ["T_{n+1}(x) = 2 x T_n(x) - T_{n-1}(x)，T_0 = 1，T_1 = x", "T_n 的零点 x_k = cos((2k - 1) pi / (2n))，k = 1, ..., n", "首一多项式在 [-1, 1] 上的极小无穷范数为 2^{1-n}，由 2^{1-n} T_n 达到", "Chebyshev 节点插值误差 ||f - p_n||_inf <= 2^{-n} / (n+1)! * ||f^{(n+1)}||_inf", "对解析函数误差按 rho^{-n} 几何衰减，rho 为 Bernstein 椭圆参数"],
        theorems: ["最佳一致逼近多项式存在且唯一（Chebyshev），其特征是 Chebyshev 等波动定理：p 为最佳逼近当且仅当误差 f - p 在至少 n+2 个交错点上以交替符号取到 ||f - p||_inf", "de la Vallee Poussin 定理给出下界：若误差在 n+2 个点交替变号，则最佳逼近误差不小于这些点上误差绝对值的最小值，可用于验证近最优性", "在所有首一 n 次多项式中，缩放的 Chebyshev 多项式唯一地极小化无穷范数，这解释了 Chebyshev 节点使余项中的节点多项式最小", "Remez 交换算法基于等波动特征迭代求最佳逼近，每步解一个含波动幅度未知量的线性系统并交换参考点，收敛为超线性"],
        generalRequirements: ["必须区分最佳一致逼近（无穷范数）与最小二乘逼近（二范数），两者的最优解与刻画方式不同", "使用 Chebyshev 结论时必须先把区间线性映射到 [-1, 1]，并在误差估计中带上映射引起的尺度因子", "给出误差估计时必须声明是最坏情形界、几何衰减界还是等波动给出的精确刻画"],
        forbiddenErrors: ["【交错点数错误】把等波动条件写成 n+1 个点或不要求符号交替", "【区间遗漏】在非 [-1, 1] 区间上直接套用 2^{1-n} 或节点公式而不作线性映射", "【最优性混淆】把 Chebyshev 节点插值当作最佳一致逼近本身，忽视两者相差一个 O(log n) 因子", "【唯一性误否】声称最佳一致逼近可能不唯一（多项式情形唯一，有理情形另论）", "【衰减率误用】对仅有限阶可导的函数宣称几何衰减"],
        parameterConstraints: { intervalNormalization: "所有 Chebyshev 公式默认区间为 [-1, 1]，其他区间需作 x = (2 t - a - b) / (b - a) 变换", degreeCondition: "等波动交错点数至少为 n + 2，其中 n 为逼近多项式次数上界", smoothnessForGeometric: "几何衰减要求 f 在包含区间的 Bernstein 椭圆内解析", weightChoice: "带权极小极大问题需相应修改交错条件与算法" },
        closureChecks: ["检查交错点个数与符号交替要求是否完整", "检查区间映射与尺度因子是否处理", "检查所用衰减率与函数光滑性假设是否匹配"],
        scenarioChecks: { remezVerification: ["用 de la Vallee Poussin 下界检验 Remez 迭代得到的近似是否接近最优", "指出仅看最大误差无法判定最优性"], nodeChoice: ["比较等距节点与 Chebyshev 节点的 Lebesgue 常数增长", "说明 Chebyshev 插值近最优但不等于最佳一致逼近"], analyticVsSmooth: ["对解析函数验证几何收敛，对仅 C^k 函数给出代数阶收敛", "禁止跨类别套用衰减率"] },
    },
    // 正交多项式基下的最小二乘逼近与三项递推。
    "numapx-least-squares-orthogonal-polynomials": {
        definitions: ["带权 w > 0 的内积 <f, g> = int_a^b f g w dx 下的正交多项式序列 {phi_k} 满足 <phi_i, phi_j> = 0（i != j）", "n 次最小二乘逼近为 f 在 span{phi_0, ..., phi_n} 上的正交投影", "Legendre 多项式对应 w = 1 于 [-1, 1]，Chebyshev 对应 w = 1 / sqrt(1 - x^2)，Hermite 对应 w = exp(-x^2) 于全实轴"],
        formulas: ["最佳系数 c_k = <f, phi_k> / <phi_k, phi_k>", "Parseval 型误差 ||f - p_n||^2 = ||f||^2 - sum_{k<=n} c_k^2 <phi_k, phi_k>", "三项递推 phi_{k+1}(x) = (x - alpha_k) phi_k(x) - beta_k phi_{k-1}(x)", "Legendre 递推 (k+1) P_{k+1} = (2k+1) x P_k - k P_{k-1}", "单项式基 Gram 矩阵在 [0, 1] 上即 Hilbert 矩阵，条件数随 n 指数增长"],
        theorems: ["Hilbert 空间中对闭凸（此处为有限维线性）子空间的最佳二范数逼近存在唯一，且由残差与子空间正交等价刻画（正规方程即该正交条件）", "任意正定权下的正交多项式满足三项递推，递推系数由内积矩量决定；据此可用 Stieltjes 过程稳定地生成基，而不必解病态的 Gram 系统", "正交多项式的零点全部单重且落在权支撑区间内部，且相邻次数的零点相互交错，这是 Gauss 求积节点性质的来源", "最小二乘逼近的误差按 Parseval 单调下降，且增加基函数不会破坏已算得的系数，这与单项式基下必须重解全部系数形成对比"],
        generalRequirements: ["必须声明权函数与区间，正交性依赖于两者，脱离权谈正交多项式无意义", "构造基时必须使用三项递推或 Stieltjes 过程，禁止在高次时直接解单项式基的正规方程", "误差陈述必须使用与内积相容的加权二范数，不得与无穷范数结论混用"],
        forbiddenErrors: ["【权遗漏】只说正交多项式而不给出权函数与区间", "【范数错配】用二范数最优性宣称无穷范数下也最优", "【病态基使用】在高次逼近中用单项式基与 Hilbert 型 Gram 矩阵求解", "【系数依赖误判】认为提高次数后低次系数会改变（正交基下不变，非正交基下才改变）", "【零点位置误断】声称正交多项式零点可能重合或落在区间外"],
        parameterConstraints: { weightPositivity: "要求 w >= 0、非零且所有矩量 int x^k w dx 有限", intervalSupport: "区间可无界（Hermite、Laguerre），但需权保证矩量收敛", degreeRange: "投影次数 n 需小于线性无关基的个数，且离散最小二乘要求样本数不少于 n+1", recurrenceStability: "递推系数须由稳定的矩量或离散内积计算，避免相减相消" },
        closureChecks: ["检查权函数、区间与内积定义是否一致", "检查是否使用正交基递推而非病态正规方程", "检查误差度量与最优性范数是否统一"],
        scenarioChecks: { dataFitting: ["离散带权最小二乘拟合中用离散正交多项式（Forsythe 方法）避免病态", "禁止直接用高次单项式设计矩阵"], degreeIncrement: ["提高逼近次数时验证正交基下已有系数不变，只需新增一项", "对比单项式基需重解整个系统"], spectralAccuracy: ["对光滑函数用 Legendre 或 Chebyshev 展开，说明系数快速衰减带来的谱精度", "对不光滑函数指出 Gibbs 型振荡"] },
    },
    // 样条插值：极小弯曲能量与边界条件。
    "numapx-spline-interpolation": {
        definitions: ["k 次样条是分段 k 次多项式且在内部节点处具有 k-1 阶连续导数的函数；三次样条对应 k = 3、C^2 连续", "自然边界条件指两端二阶导为零，完全（clamped）边界条件指两端一阶导给定，非节点（not-a-knot）条件指首末两个内节点处三阶导连续", "B 样条是具有最小支撑的样条基，由 Cox-de Boor 递推定义"],
        formulas: ["三次样条的二阶导矩量满足三对角方程 h_{i-1} M_{i-1} + 2 (h_{i-1} + h_i) M_i + h_i M_{i+1} = 6 (f[x_i, x_{i+1}] - f[x_{i-1}, x_i])", "Cox-de Boor 递推 B_{i,k}(x) = (x - t_i) / (t_{i+k} - t_i) B_{i,k-1}(x) + (t_{i+k+1} - x) / (t_{i+k+1} - t_{i+1}) B_{i+1,k-1}(x)", "弯曲能量 E(g) = int_a^b (g''(x))^2 dx", "完全三次样条误差 ||f - s||_inf <= (5 / 384) h^4 ||f^{(4)}||_inf", "导数误差阶依次为 h^3、h^2"],
        theorems: ["极小范数性质：在所有 C^2 插值函数中，自然三次样条唯一地极小化弯曲能量 int (g'')^2 dx，这是样条被称为最光滑插值的精确含义", "给定互异节点与一组标准边界条件（自然、完全或非节点），三次样条插值存在且唯一，其线性系统为严格对角占优三对角，故可用 O(n) 的 Thomas 算法稳定求解", "完全或非节点边界下三次样条对 C^4 函数给出 O(h^4) 一致收敛，且与插值多项式不同，样条不会出现 Runge 现象，误差随节点加密单调改善", "B 样条基具有非负性、局部支撑与和为一的分割性质，故样条曲线落在控制点凸包内，且系数扰动只有局部影响；自然三次样条在端点外的自然延拓是线性函数"],
        generalRequirements: ["必须明确样条次数、连续阶与所用边界条件，不同边界条件的误差阶不同（自然边界在端点仅 O(h^2)）", "使用极小能量性质时必须限定在自然样条与 C^2 插值函数类内", "涉及数值实现时必须指出三对角系统的对角占优与 O(n) 复杂度，不得当作一般稠密系统处理"],
        forbiddenErrors: ["【边界条件缺失】只说三次样条插值而不给边界条件却宣称唯一", "【误差阶混淆】把完全边界的 O(h^4) 结论用于自然边界的端点区域", "【极小性外推】声称任意边界条件的三次样条都极小化弯曲能量", "【连续阶错误】把三次样条说成 C^3 连续，或声称二阶导在节点处可以跳跃", "【局部性误判】认为改动一个数据点会使整条样条全局剧烈改变（B 样条系数为局部支撑，影响随距离迅速衰减）"],
        parameterConstraints: { knotOrdering: "节点须严格递增 x_0 < x_1 < ... < x_n", continuityOrder: "k 次样条在内节点为 C^{k-1}，三次样条为 C^2", boundaryCount: "三次样条自由度比插值条件多两个，必须由两个边界条件补齐", smoothnessForRate: "O(h^4) 收敛要求 f 属于 C^4；低光滑度只能得到相应的低阶率" },
        closureChecks: ["检查次数、连续阶、边界条件三者是否同时给定", "检查误差阶与边界条件、光滑性假设是否匹配", "检查是否指出线性系统的三对角结构与求解复杂度"],
        scenarioChecks: { shapePreservingFit: ["需要保持单调或凸性时改用单调三次（Fritsch-Carlson）或凸性约束样条", "指出标准三次样条不保形，可能产生过冲"], boundaryChoice: ["比较自然、完全与非节点边界在端点处的精度差异", "禁止用完全边界的误差阶为自然边界背书"], vsHighDegreePolynomial: ["对 Runge 函数比较高次插值与三次样条，验证样条无端点振荡", "说明分段低次是避免 Runge 现象的根本手段"] },
    },
    // Newton-Cotes 求积、代数精度与 Euler-Maclaurin 余项。
    "numapx-newton-cotes-quadrature": {
        definitions: ["求积公式 int_a^b f dx 约等于 sum_i w_i f(x_i)；Newton-Cotes 公式取等距节点并对插值多项式积分得到权", "代数精度指使公式对所有次数不超过 m 的多项式精确成立的最大 m", "复化公式指把区间分成若干小段并在每段上使用低阶公式"],
        formulas: ["复化梯形 T_h = h (f_0 / 2 + f_1 + ... + f_{n-1} + f_n / 2)，误差 -(b - a) h^2 f''(xi) / 12", "复化 Simpson S_h = (h / 3)(f_0 + 4 f_1 + 2 f_2 + ... + 4 f_{n-1} + f_n)，误差 -(b - a) h^4 f^{(4)}(xi) / 180", "Euler-Maclaurin 展开 T_h - int f = sum_{k>=1} B_{2k} h^{2k} (f^{(2k-1)}(b) - f^{(2k-1)}(a)) / (2k)!", "n 点 Newton-Cotes 代数精度为 n-1（n 为偶数个节点时）或 n（n 为奇数个节点时）"],
        theorems: ["节点数为奇数（即公式阶为偶数）的 Newton-Cotes 公式因对称性额外提升一阶代数精度，这解释了 Simpson 公式以三点达到三次精度", "高阶 Newton-Cotes 公式（节点数不小于 9 起）出现负权，导致数值不稳定与舍入误差放大，因此实践中只用低阶复化形式而非提高单段阶数", "复化梯形对光滑周期函数具有超代数精度：Euler-Maclaurin 中所有边界项因周期性抵消，误差随光滑度按任意代数阶乃至指数衰减（梯形法则用于周期问题的最优性）", "Euler-Maclaurin 展开使梯形值成为 h^2 的光滑函数，这正是 Richardson 外推与 Romberg 积分成立的理论基础"],
        generalRequirements: ["必须区分单段公式与复化公式的误差阶，复化误差以整体 h 的幂表示且带区间长度因子", "使用误差公式必须验证相应阶导数存在，且指出中值点 xi 未知", "涉及提高精度时必须优先考虑加密网格或改用 Gauss 型公式，而不是提高 Newton-Cotes 阶数"],
        forbiddenErrors: ["【高阶滥用】使用高阶 Newton-Cotes 公式而不提负权与不稳定性", "【误差阶张冠李戴】把单段 Simpson 的局部 h^5 误差当作复化公式的整体误差", "【光滑性缺失】对含端点奇性或不连续导数的函数套用 h^4 误差估计", "【代数精度错算】声称 n 点公式代数精度恒为 n-1 而忽视奇数节点的对称提升", "【周期性误用】把梯形法则对周期函数的超收敛结论推广到一般非周期函数"],
        parameterConstraints: { nodeSpacing: "Newton-Cotes 要求等距节点，步长 h = (b - a) / n", smoothnessOrder: "梯形误差需 f 属于 C^2，Simpson 需 C^4", subintervalParity: "复化 Simpson 要求子区间数为偶数", weightPositivity: "为保证稳定性应限于权全为正的低阶公式" },
        closureChecks: ["检查节点等距性、子区间数奇偶与光滑性假设", "检查所引误差是局部还是整体形式", "检查是否提示高阶公式的负权风险"],
        scenarioChecks: { periodicIntegrand: ["对周期光滑被积函数使用复化梯形，说明边界项抵消带来的超收敛", "禁止把该现象归因于公式代数精度"], endpointSingularity: ["被积函数在端点有代数奇性时误差阶退化，改用变量替换、加权 Gauss 或自适应细分", "指出标准误差公式此时无效"], accuracyUpgrade: ["需要更高精度时通过减小 h 或改用 Gauss 求积，而非提高 Newton-Cotes 阶", "给出负权引起的舍入放大理由"] },
    },
    // Gauss 型求积：节点为正交多项式零点与最高代数精度。
    "numapx-gauss-quadrature": {
        definitions: ["带权 Gauss 求积 int_a^b f w dx 约等于 sum_{i=1}^{n} w_i f(x_i)，其中节点与权同时待定", "Gauss-Legendre 对应 w = 1，Gauss-Chebyshev 对应 w = 1 / sqrt(1 - x^2)，Gauss-Hermite、Gauss-Laguerre 对应无界区间的指数型权", "Gauss-Radau 固定一个端点、Gauss-Lobatto 固定两个端点为节点，代数精度相应降低"],
        formulas: ["n 点 Gauss 公式的代数精度为 2n - 1", "节点为 n 次正交多项式 phi_n 的零点", "权 w_i = int_a^b (prod_{j != i} (x - x_j) / (x_i - x_j)) w dx > 0", "Gauss-Legendre 误差 = f^{(2n)}(xi) (b - a)^{2n+1} (n!)^4 / ((2n + 1) ((2n)!)^3)", "Golub-Welsch：节点与权由 Jacobi 三对角矩阵的特征值与第一分量平方给出"],
        theorems: ["n 点求积公式的代数精度不可能超过 2n - 1（取 prod (x - x_i)^2 为反例），而 Gauss 公式恰好达到该上界，故 Gauss 求积在代数精度意义下最优", "Gauss 节点必为对应正交多项式的零点，因而全部单重且严格落在区间内部；所有 Gauss 权严格为正，这保证了公式的数值稳定性与对连续函数的收敛性", "Stieltjes 定理型收敛结论：因权为正且代数精度随 n 增长，Gauss 求积对区间上任意连续函数收敛（复化 Newton-Cotes 需固定低阶才能保证）", "Golub-Welsch 算法把节点与权的计算化为对称三对角特征值问题，代价 O(n^2)，避免了直接求正交多项式零点的病态"],
        generalRequirements: ["必须声明权函数与区间，并选择与被积函数奇性相匹配的 Gauss 族", "使用误差公式必须验证 2n 阶导数存在；对低光滑函数应改述为收敛性结论而非高阶率", "把被积函数中的奇性或权因子显式吸收到求积权中，而不是留给函数值计算"],
        forbiddenErrors: ["【精度上界突破】声称 n 点公式可达 2n 或更高代数精度", "【节点位置错误】把 Gauss 节点当作等距节点或包含端点（除 Radau、Lobatto 变体）", "【权符号错误】允许出现负的 Gauss 权", "【区间未映射】在一般区间上直接使用 [-1, 1] 的标准节点与权而不作线性变换与 Jacobi 因子缩放", "【奇性误处理】对含 1 / sqrt(1 - x^2) 型奇性的被积函数使用 Gauss-Legendre 而不改用匹配权的 Gauss-Chebyshev"],
        parameterConstraints: { weightAdmissibility: "权 w >= 0 且各阶矩量有限，正交多项式方可存在", nodeCount: "n >= 1，代数精度 2n - 1；Lobatto n 点精度为 2n - 3", intervalMapping: "一般区间需变换 x = ((b - a) t + a + b) / 2 并乘 (b - a) / 2", smoothnessForRate: "误差公式要求 f 属于 C^{2n}；解析函数可得几何收敛" },
        closureChecks: ["检查权、区间与 Gauss 族选择是否匹配被积函数结构", "检查代数精度与节点数的关系是否正确", "检查区间映射的缩放因子是否带上"],
        scenarioChecks: { weightMatchedSingularity: ["被积函数含端点代数奇性时改用 Gauss-Jacobi 权吸收奇性", "对比 Gauss-Legendre 在同一问题上的阶退化"], compositeVsHighOrder: ["对整体光滑函数用高阶 Gauss，对分段光滑函数用分段（复化）Gauss", "说明单个高阶公式跨越不光滑点会失效"], nodeComputation: ["用 Golub-Welsch 由三对角矩阵求节点与权，避免直接解高次多项式零点", "指出直接求根的病态风险"] },
    },
    // Richardson 外推、Romberg 积分与自适应策略。
    "numapx-romberg-extrapolation": {
        definitions: ["若数值量满足 A(h) = A + c_1 h^p + c_2 h^{p+q} + ...，Richardson 外推按该展开消去主导误差项", "Romberg 积分是对复化梯形值按 Euler-Maclaurin 的 h^2 幂次展开反复外推得到的三角表", "自适应求积按局部误差估计递归细分区间，使全局误差满足给定容差"],
        formulas: ["Richardson 一步外推 A_new = (2^p A(h/2) - A(h)) / (2^p - 1)", "Romberg 递推 R_{k,j} = R_{k,j-1} + (R_{k,j-1} - R_{k-1,j-1}) / (4^j - 1)，R_{k,0} = T_{h_k}", "R_{k,1} 即复化 Simpson，R_{k,2} 即 Boole 型公式", "Romberg 第 j 列误差阶为 O(h^{2j+2})", "自适应误差估计 |I_fine - I_coarse| / (2^p - 1)"],
        theorems: ["Richardson 外推的合法性依赖于误差按 h 的已知幂次渐近展开；展开阶数写错会使外推放大误差而非消去误差", "对 C^{2m} 光滑被积函数，Romberg 表的第 j 列具有 O(h^{2j+2}) 精度，故只需 O(log(1/eps)) 次网格加倍即可达到高精度；这是 Euler-Maclaurin 只含 h 的偶次幂的直接后果", "被积函数含端点代数奇性时 Euler-Maclaurin 展开失效，Romberg 收敛阶显著退化，须先作变量替换（如双指数变换）或改用带权 Gauss", "自适应细分把误差分配到局部，对分段光滑或局部剧变的被积函数远优于均匀网格，但基于两级差的误差估计只是启发式，可能因偶然抵消而低估误差"],
        generalRequirements: ["外推前必须写出误差渐近展开并明确主导幂次 p，不能凭经验取 p", "使用 Romberg 时必须验证被积函数在闭区间上的足够光滑性，含奇性者先作变换", "自适应算法必须给出局部误差估计方式、容差分配规则与最大递归深度"],
        forbiddenErrors: ["【幂次错误】把梯形法的 h^2 展开当作 h^1 或 h^4 进行外推", "【奇性忽视】对端点奇性被积函数直接使用 Romberg 并宣称高阶收敛", "【外推过度】在舍入误差已主导时继续外推，导致结果恶化", "【估计误信】把自适应两级差估计当作严格误差上界", "【展开缺失】对不存在渐近幂展开的量（如含 log h 项而未纳入模型）盲目外推"],
        parameterConstraints: { errorExpansion: "要求 A(h) = A + c_1 h^p + o(h^p) 且 p 已知", smoothnessDepth: "外推 j 次需 f 属于 C^{2j+2} 量级的光滑性", refinementRatio: "标准 Romberg 使用步长减半比 2，其他比例需相应修改外推系数", roundingFloor: "当两级差接近 u * |I| 时应停止外推，否则舍入主导" },
        closureChecks: ["检查误差展开与外推系数是否一致", "检查光滑性假设与外推层数是否匹配", "检查停止准则是否考虑舍入误差下限"],
        scenarioChecks: { smoothIntegrand: ["对整体光滑被积函数用 Romberg，验证列阶提升", "记录每列误差比以核对 4^j 规律"], endpointSingular: ["对 sqrt(x) 型端点奇性说明 Romberg 阶退化，改用变量替换", "禁止套用 O(h^{2j+2}) 结论"], adaptiveTolerance: ["按局部容差分配递归细分，设定最大深度防止无穷递归", "指出误差估计的启发式性质"] },
    },
    // 离散 Fourier 变换、FFT 与三角逼近的谱精度。
    "numapx-fft-trigonometric": {
        definitions: ["长度 N 的离散 Fourier 变换为 X_k = sum_{n=0}^{N-1} x_n exp(-2 pi i k n / N)，逆变换含 1 / N 因子", "FFT 是利用 N 的因子分解递归拆分 DFT 的算法族，Cooley-Tukey 基 2 形式把 N = 2^m 的变换化为两个半长变换", "三角插值指用 N 个等距节点上的三角多项式插值周期函数；混叠指采样不足使高频分量被误认作低频"],
        formulas: ["X_k = sum_n x_n omega_N^{-k n}，omega_N = exp(2 pi i / N)", "FFT 复杂度 O(N log N)，直接求和为 O(N^2)", "Parseval 关系 sum_n |x_n|^2 = (1 / N) sum_k |X_k|^2", "采样定理：带宽小于 N / (2 T) 的信号由 N 个等距样本唯一确定", "循环卷积定理 DFT(x 卷 y) = DFT(x) . DFT(y)"],
        theorems: ["DFT 是有限维酉变换（差一个归一化常数），故 FFT 由酉的蝶形运算复合而成，其舍入误差界为 O(u log N)，比直接求和的 O(u N) 更优，FFT 既更快又更稳定", "对解析周期函数，三角插值与截断 Fourier 级数误差按几何速率 exp(-c N) 衰减（谱精度）；对仅 C^k 周期函数为 O(N^{-k})；对不连续函数出现 Gibbs 现象，误差在跳跃点邻域不趋于零", "DFT 计算的是循环卷积，线性卷积必须先零填充到长度不小于两序列长度之和减一，否则出现回绕污染", "采样定理与混叠：频率超过 Nyquist 频率的分量不可恢复且会折叠到低频，因此加密采样不能修正已发生的混叠，只能在采样前作抗混叠滤波"],
        generalRequirements: ["必须区分连续 Fourier 变换、Fourier 级数与 DFT 三者，混用其归一化与频率轴会导致系数错误", "使用三角逼近时必须先确认函数的周期性；非周期函数直接周期化会在端点引入跳跃与 Gibbs 振荡", "作卷积时必须声明是循环卷积还是线性卷积，并给出零填充长度"],
        forbiddenErrors: ["【归一化混乱】在正逆变换中重复或漏掉 1 / N 因子", "【卷积回绕】未零填充就用 DFT 计算线性卷积", "【混叠误解】认为提高采样率可以恢复已被折叠的高频信息", "【周期性忽视】对非周期函数套用谱精度结论而不提端点跳跃", "【复杂度误断】声称 FFT 要求 N 必为 2 的幂（混合基与 Bluestein 算法可处理任意 N）"],
        parameterConstraints: { lengthFactorization: "基 2 FFT 要求 N = 2^m；一般 N 用混合基或 Bluestein，素数长度亦可 O(N log N)", nyquistLimit: "可分辨频率上限为 N / 2（离散频率指标取 -N/2 到 N/2 - 1）", zeroPadding: "线性卷积需填充到长度 >= N_1 + N_2 - 1", periodicity: "谱精度结论要求函数及其各阶导数在周期意义下连续" },
        closureChecks: ["检查归一化约定与频率指标范围", "检查卷积类型与零填充长度", "检查收敛率与周期光滑性假设是否一致"],
        scenarioChecks: { spectralDifferentiation: ["用 FFT 作周期问题的谱微分，乘 i k 后逆变换，说明对光滑解的指数精度", "对含跳跃的解指出 Gibbs 振荡与需要滤波"], aliasedSampling: ["构造被欠采样的高频正弦，验证其被识别为低频", "说明抗混叠滤波须在采样前进行"], convolutionCost: ["长序列卷积用零填充 FFT 把 O(N^2) 降为 O(N log N)", "核对零填充不足时的回绕错误"] },
    },
    // 有理逼近与 Pade 逼近：极点捕捉与伪极点。
    "numapx-rational-pade": {
        definitions: ["类型 (m, n) 的有理逼近为 r = p_m / q_n，p_m、q_n 分别为次数不超过 m、n 的多项式", "f 在 0 处的 (m, n) 型 Pade 逼近由 f - p_m / q_n = O(x^{m+n+1}) 唯一（在正规情形下）确定", "伪极点（Froissart doublet）指由数据噪声或舍入造成的、与相邻零点几乎重合的虚假极点"],
        formulas: ["Pade 条件 q_n(x) f(x) - p_m(x) = O(x^{m+n+1})", "系数由 Hankel 型线性系统 sum_{j} q_j c_{m+k-j} = 0（k = 1, ..., n）确定，c 为 Taylor 系数", "有理极小极大逼近的等波动交错点数为 m + n + 2", "指数函数的 (n, n) 型 Pade 给出 Pade 型时间步进（如 Crank-Nicolson 对应 (1, 1)）", "重心有理插值 r(x) = sum_i (w_i f_i / (x - x_i)) / sum_i (w_i / (x - x_i))"],
        theorems: ["有理逼近对含极点或近奇性的函数远优于多项式逼近：多项式逼近的收敛半径受最近奇点限制，而有理逼近可用分母显式捕捉极点，从而在包含奇点的区域仍收敛", "de Montessus 定理：若 f 在圆盘内除 n 个极点外解析，则 (m, n) 型 Pade 逼近随 m 趋于无穷收敛，且其极点收敛到 f 的真极点", "有理极小极大逼近存在，但唯一性与等波动刻画比多项式情形复杂（可能出现退化，交错点数不足），Remez 型算法在有理情形可能不收敛", "Pade 逼近的分母系数由 Hankel 系统给出，该系统常严重病态；AAA 或重心有理插值等基于最小二乘与 SVD 的算法通过清除小奇异值抑制伪极点，是稳健的替代方案"],
        generalRequirements: ["必须给出分子分母次数 (m, n) 与展开中心（或插值节点集），仅说有理逼近不足以确定对象", "必须检查分母在关注区域内是否有零点，若有需说明是真极点还是伪极点", "对含奇性的目标函数必须论证有理逼近相对多项式逼近的优势来源，而不仅陈述结果更好"],
        forbiddenErrors: ["【极点未检】给出有理逼近却不检验分母在逼近区间内是否为零", "【伪极点忽视】把由噪声产生的极点-零点对当作真实奇性", "【唯一性外推】把多项式最佳逼近的存在唯一与等波动刻画直接搬到有理情形", "【退化未察】在 Pade 表中出现非正规（退化）块时仍宣称逼近唯一", "【病态求解】直接解高阶 Hankel 系统求 Pade 系数而不作正则化或改用重心形式"],
        parameterConstraints: { degreePair: "需指定 (m, n)，且 m + n + 1 个匹配条件对应展开阶数", normality: "Pade 唯一性要求相应 Hankel 行列式非零（正规情形）", poleLocation: "逼近区间内分母不得有零点，除非该零点对应 f 的真极点", conditioning: "高阶 Pade 需用重心或 AAA 形式并配合奇异值截断" },
        closureChecks: ["检查次数对、展开中心与匹配阶是否一致", "检查分母零点与伪极点的判别是否给出", "检查求解方式是否规避 Hankel 病态"],
        scenarioChecks: { functionWithPoles: ["对 tan x 或含极点的函数比较 Taylor 截断与 Pade，验证有理逼近跨越极点仍有效", "用 de Montessus 说明极点收敛"], noisyData: ["对含噪数据用 AAA 并清除 Froissart 对，说明奇异值截断的作用", "禁止把伪极点解释为物理奇性"], timeSteppingStability: ["用 exp 的 Pade 逼近构造 A 稳定单步法，讨论 (m, n) 选择与稳定性", "指出分母次数不足会破坏 A 稳定性"] },
    },
    // 数值微分的截断误差与舍入误差权衡。
    "numapx-numerical-differentiation-tradeoff": {
        definitions: ["前向差分 D_+ f = (f(x + h) - f(x)) / h，中心差分 D_0 f = (f(x + h) - f(x - h)) / (2 h)", "截断误差指由 Taylor 展开截断引起的误差，舍入误差指浮点相减相消与函数值误差被 1 / h 放大的部分", "相减相消指两个接近数相减导致有效位大量丢失"],
        formulas: ["前向差分截断误差 -h f''(xi) / 2，中心差分截断误差 -h^2 f'''(xi) / 6", "总误差模型 E(h) 约等于 C h^p + 2 eps / h（p = 1 或 2，eps 为函数值绝对误差）", "最优步长 h_opt 约等于 (eps / C)^{1 / (p + 1)}，中心差分下 h_opt 约 eps^{1/3}，可达最小误差约 eps^{2/3}", "二阶导中心公式 (f(x + h) - 2 f(x) + f(x - h)) / h^2，舍入项按 eps / h^2 放大", "复步长公式 f'(x) 约 Im(f(x + i h)) / h，无相减相消"],
        theorems: ["数值微分是病态问题：截断误差随 h 减小而下降，舍入误差随 h 减小而上升，总误差在 h_opt 处取极小，故存在不可逾越的精度上限（中心差分双精度下约 1e-11），一味减小 h 反而恶化结果", "对称性使中心差分的偶次误差项抵消，得到 O(h^2) 而非 O(h)，同理高阶中心公式通过增加对称点消去更多项，但每提高一阶都加剧舍入放大", "Richardson 外推可把中心差分提升到 O(h^4)、O(h^6)，但可用的外推层数受舍入误差下限限制", "复步长微分与自动微分完全避免相减相消：复步长对解析函数给出 O(h^2) 精度且 h 可取到 1e-100 量级；自动微分给出机器精度的导数值，是数值微分的结构性替代"],
        generalRequirements: ["必须同时给出截断项与舍入项，并据此讨论步长选取，不得只写 Taylor 截断阶", "涉及高阶导数时必须指出舍入放大因子为 eps / h^k，精度上限随阶数迅速恶化", "当问题允许时应优先推荐自动微分、解析导数或复步长，而非细化有限差分"],
        forbiddenErrors: ["【单侧误差分析】只给截断阶而不提舍入放大，宣称 h 越小越准", "【最优步长错算】把 h_opt 写成与 eps 无关或幂次错误", "【阶数误用】把中心差分的 O(h^2) 用于前向差分", "【高阶导轻视】用小 h 计算二阶或三阶导而忽视 eps / h^2、eps / h^3 的爆炸", "【复步长滥用】对非解析（如含绝对值或分段）函数使用复步长公式"],
        parameterConstraints: { stepSize: "h > 0 且不宜远小于 h_opt 约 eps^{1/(p+1)}", functionAccuracy: "eps 应取函数求值的实际绝对误差，含模型误差与舍入", smoothnessOrder: "中心差分误差公式要求 f 属于 C^3，二阶导公式要求 C^4", analyticityForComplexStep: "复步长要求 f 在实轴邻域解析且实现支持复运算" },
        closureChecks: ["检查截断项与舍入项是否同时建模", "检查最优步长与所声称精度上限是否自洽", "检查是否评估了自动微分或解析导数的可行性"],
        scenarioChecks: { stepSizeSweep: ["对固定 x 扫描 h 观察误差先降后升的 V 形曲线，定位 h_opt", "验证最小误差与 eps^{2/3} 量级相符"], noisyFunction: ["函数值含较大噪声时先平滑或改用正则化微分（如 Tikhonov）", "指出直接差分会把噪声放大 1 / h 倍"], gradientForOptimization: ["优化中优先用自动微分或解析梯度，必要时用中心差分并按 eps^{1/3} 选步长", "禁止用极小 h 的前向差分作为高精度梯度"] },
    },
};
