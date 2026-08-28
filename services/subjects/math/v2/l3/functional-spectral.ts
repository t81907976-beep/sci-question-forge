import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“泛函分析-谱理论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const FUNCTIONAL_SPECTRAL_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 谱集的分解与 resolvent 的解析性。
    "spectral-spectrum-decomposition-resolvent": {
        id: "spectral-spectrum-decomposition-resolvent", l2Key: "functional-spectral", name: "谱的分解与 resolvent 解析性", kind: "object",
        aliases: ["点谱", "连续谱", "剩余谱", "resolvent集解析"],
    },
    // 谱半径公式与谱的非空紧性。
    "spectral-radius-formula": {
        id: "spectral-radius-formula", l2Key: "functional-spectral", name: "谱半径公式与谱的紧非空性", kind: "formula",
        aliases: ["谱半径公式", "Gelfand公式", "谱非空", "谱紧性"],
    },
    // 自伴算子的投影值测度分解。
    "spectral-theorem-selfadjoint-pvm": {
        id: "spectral-theorem-selfadjoint-pvm", l2Key: "functional-spectral", name: "自伴算子谱定理与投影值测度", kind: "theorem",
        aliases: ["无界自伴算子谱定理", "投影值测度", "谱积分", "谱测度唯一性"],
    },
    // 连续与 Borel 函数演算及其谱映射。
    "spectral-functional-calculus-mapping": {
        id: "spectral-functional-calculus-mapping", l2Key: "functional-spectral", name: "函数演算与谱映射定理", kind: "theorem",
        aliases: ["函数演算", "谱映射定理", "全纯演算", "Borel演算"],
    },
    // 紧自伴算子的特征展开与极小极大原理。
    "spectral-compact-selfadjoint-expansion": {
        id: "spectral-compact-selfadjoint-expansion", l2Key: "functional-spectral", name: "紧自伴算子特征展开与极小极大", kind: "theorem",
        aliases: ["Hilbert-Schmidt定理", "特征展开", "Courant-Fischer", "极小极大原理"],
    },
    // 本质谱与紧扰动下的谱稳定性。
    "spectral-essential-spectrum-weyl": {
        id: "spectral-essential-spectrum-weyl", l2Key: "functional-spectral", name: "本质谱与 Weyl 定理", kind: "theorem",
        aliases: ["本质谱", "Weyl定理", "本质谱紧扰动不变", "离散谱"],
    },
    // 绝对连续、奇异连续与纯点谱的分解。
    "spectral-measure-classification": {
        id: "spectral-measure-classification", l2Key: "functional-spectral", name: "谱测度的连续性分类", kind: "criterion",
        aliases: ["绝对连续谱", "奇异连续谱", "纯点谱", "Lebesgue分解"],
    },
    // 变分刻画与 Rayleigh 商估计。
    "spectral-rayleigh-quotient-variational": {
        id: "spectral-rayleigh-quotient-variational", l2Key: "functional-spectral", name: "Rayleigh 商与变分特征值刻画", kind: "criterion",
        aliases: ["Rayleigh商", "变分刻画", "基态能量", "算子谱间隙"],
    },
    // Banach 代数与 Gelfand 变换下的谱刻画。
    "spectral-gelfand-transform-banach-algebra": {
        id: "spectral-gelfand-transform-banach-algebra", l2Key: "functional-spectral", name: "Gelfand 变换与交换 Banach 代数谱", kind: "theorem",
        aliases: ["Gelfand变换", "极大理想空间", "Gelfand-Naimark", "交换C*代数"],
    },
    // 摄动下特征值的解析依赖与稳定性。
    "spectral-perturbation-eigenvalue-stability": {
        id: "spectral-perturbation-eigenvalue-stability", l2Key: "functional-spectral", name: "特征值摄动与谱稳定性", kind: "theorem",
        aliases: ["Kato摄动", "解析摄动", "Riesz投影", "谱间隙稳定"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const FUNCTIONAL_SPECTRAL_L3_RULES: Record<string, MathV2L3Rules> = {
    // 谱的分解与 resolvent 在补集上的解析性。
    "spectral-spectrum-decomposition-resolvent": {
        definitions: ["谱 sigma(T) = {lambda : lambda I - T 不可逆}", "点谱 sigma_p：lambda I - T 非单射", "连续谱：单射、值域稠密但非满", "剩余谱：单射但值域不稠密", "resolvent 集 rho(T) = C \\ sigma(T)"],
        formulas: ["resolvent 恒等式：R(lambda) - R(mu) = (mu - lambda) R(lambda) R(mu)", "解析展开：R(lambda) = sum_{n>=0} (lambda_0 - lambda)^n R(lambda_0)^{n+1}，收敛半径 >= 1/||R(lambda_0)||", "范数下界：dist(lambda, sigma(T)) <= 1/||R(lambda)||，故靠近谱时 resolvent 范数爆破", "|lambda| > ||T|| => R(lambda) = sum_{n>=0} T^n / lambda^{n+1}"],
        theorems: ["无穷维中特征值不必存在：谱可全为连续谱（如 L^2[0,1] 上的乘法算子 (Mf)(x) = x f(x)）", "谱是非空紧集（复 Banach 空间、有界算子），resolvent 在 rho(T) 上算子值解析", "自伴算子无剩余谱；正规算子的剩余谱亦为空", "无界算子的谱可为空（如某些定义域下的微分算子）或整个复平面，紧非空性只对有界情形"],
        generalRequirements: ["写谱必须区分点谱、连续谱与剩余谱，不能一律称特征值", "使用 resolvent 展开必须给出收敛区域", "无界算子情形必须声明定义域并放弃有界情形的紧非空结论"],
        forbiddenErrors: ["【谱等特征值】把无穷维谱直接等同于特征值集合", "【非空紧性越界】对无界算子断言谱非空紧", "【展开域缺失】使用 Neumann 型展开而不写 |lambda| > ||T||", "【剩余谱误设】声称自伴算子有剩余谱", "【解析性错位】称 resolvent 在谱上也解析"],
        parameterConstraints: { operatorBoundedness: "谱非空紧要求有界算子与复标量", spectrumParts: "点谱、连续谱、剩余谱互不相交且并为谱", resolventAnalyticity: "解析域为 rho(T)", expansionRadius: "Neumann 展开需 |lambda| > r(T)" },
        closureChecks: ["确认谱的分解与算子类型匹配", "确认 resolvent 展开的收敛条件", "确认无界情形的定义域声明", "确认自伴/正规情形剩余谱为空的使用"],
        scenarioChecks: { multiplicationOperatorSpectrum: ["乘法算子谱为乘子的本质值域", "确认无特征值时归入连续谱"], shiftOperatorSpectrum: ["单侧移位谱为闭单位圆盘，点谱空、剩余谱非空", "确认共轭算子谱"], resolventEstimateUse: ["用 resolvent 范数下界定位谱", "确认距离不等式方向"] },
    },
    // 谱半径公式与谱的紧非空性。
    "spectral-radius-formula": {
        definitions: ["谱半径 r(T) = sup{|lambda| : lambda in sigma(T)}", "Banach 代数中的谱与谱半径", "拟幂零：r(T) = 0"],
        formulas: ["Gelfand 公式：r(T) = lim_n ||T^n||^{1/n} = inf_n ||T^n||^{1/n}", "界：r(T) <= ||T||，正规算子取等", "谱在 |lambda| <= ||T|| 的闭圆盘内且非空（复 Banach 代数，含单位元）", "Beurling-Gelfand：r(ST) <= r(S) r(T) 一般不成立，需交换性"],
        theorems: ["Gelfand 公式的极限恒存在且等于下确界，无需正规性", "谱非空依赖复标量域：实 Banach 代数（如实四元数或旋转矩阵）可有空谱", "拟幂零算子（如 Volterra 积分算子）谱为 {0} 但非零，说明谱不刻画算子大小", "谱半径 < 1 <=> ||T^n|| -> 0（幂稳定），是迭代法收敛的正确判据"],
        generalRequirements: ["计算谱半径必须用 Gelfand 公式或谱集，不能用范数替代", "使用幂稳定判据必须写 r(T) < 1 而非 ||T|| < 1", "在实标量情形必须复化后再谈谱非空"],
        forbiddenErrors: ["【范数替代谱半径】用 ||T|| < 1 作为幂稳定的必要条件", "【实域谱非空】在实 Banach 代数断言谱非空", "【拟幂零误判】由 sigma(T) = {0} 断言 T = 0", "【乘积不等式滥用】非交换情形写 r(ST) <= r(S) r(T)", "【极限存在性质疑】认为 lim ||T^n||^{1/n} 可能不存在"],
        parameterConstraints: { scalarField: "谱非空需复标量", radiusFormula: "r(T) = lim ||T^n||^{1/n}", normalityForEquality: "r(T) = ||T|| 需正规", stabilityCriterion: "幂稳定 <=> r(T) < 1" },
        closureChecks: ["确认谱半径计算依据", "确认标量域为复", "确认稳定性判据使用谱半径", "确认拟幂零情形未被误推为零算子"],
        scenarioChecks: { iterativeMethodConvergence: ["迭代矩阵谱半径判收敛", "确认非正规时范数可 >= 1"], volterraOperatorExample: ["Volterra 算子拟幂零", "确认 ||T^n||^{1/n} -> 0"], matrixPowerAsymptotics: ["用 Jordan 型或谱半径估计 ||T^n||", "确认多项式因子"] },
    },
    // 自伴算子谱定理：投影值测度与谱积分。
    "spectral-theorem-selfadjoint-pvm": {
        definitions: ["投影值测度 E：Borel 集到正交投影的可加映射，E(R) = I", "谱积分 T = int lambda dE(lambda)", "谱测度 mu_x(B) = <E(B)x, x>"],
        formulas: ["谱定理（有界自伴）：T = int_{sigma(T)} lambda dE(lambda)，且 <Tx, x> = int lambda dmu_x(lambda)", "无界自伴：T = int_R lambda dE(lambda)，D(T) = {x : int lambda^2 dmu_x < infinity}", "乘法算子模型：存在酉 U 使 U T U^{-1} 为某测度空间上的乘法算子 M_f，f 实值", "谱与支撑：sigma(T) = supp E，E({lambda}) != 0 <=> lambda 为特征值"],
        theorems: ["谱定理对（可能无界的）自伴算子成立，对仅对称的算子失败，故定义域验证不可省", "投影值测度唯一（由 T 唯一确定），是函数演算与谱分类的基础", "正规算子有复谱定理（E 支撑在 C 中）；一般非正规算子无投影值测度分解", "Stone 定理：单参数酉群与自伴生成元一一对应，e^{itA} = int e^{it lambda} dE(lambda)"],
        generalRequirements: ["使用谱定理必须验证自伴（或正规），不能只用对称", "无界情形必须写出定义域的平方可积条件", "把特征值与谱测度原子对应时必须写 E({lambda}) != 0"],
        forbiddenErrors: ["【对称代自伴】用对称性直接调用谱定理", "【定义域缺失】无界情形不写 D(T) 的谱积分条件", "【非正规越界】对一般有界算子写投影值测度分解", "【原子误判】认为谱中每点都是特征值", "【唯一性忽略】用不同投影值测度表示同一自伴算子"],
        parameterConstraints: { selfadjointnessRequirement: "需自伴（正规情形谱在 C 中）", domainCondition: "无界情形 int lambda^2 dmu_x < infinity", measureUniqueness: "投影值测度唯一", supportIdentity: "sigma(T) = supp E" },
        closureChecks: ["确认自伴或正规性验证", "确认无界情形定义域条件", "确认谱与测度支撑关系", "确认特征值判定使用原子测度"],
        scenarioChecks: { quantumObservableSpectrum: ["观测量谱分解给出测量概率 mu_x", "确认自伴性"], multiplicationOperatorModel: ["用乘法算子模型化简", "确认酉等价与测度空间"], unitaryGroupGeneration: ["Stone 定理给出时间演化", "确认生成元自伴"] },
    },
    // 函数演算与谱映射定理。
    "spectral-functional-calculus-mapping": {
        definitions: ["多项式演算 p(T)", "全纯（Riesz-Dunford）演算：f 在 sigma(T) 邻域全纯", "连续演算：C(sigma(T)) -> B(H)（自伴/正规）", "Borel 演算：有界 Borel 函数经投影值测度作用"],
        formulas: ["Cauchy 型定义：f(T) = (1/(2 pi i)) oint_Gamma f(lambda) R(lambda) dlambda，Gamma 围绕 sigma(T)", "谱映射定理：sigma(f(T)) = f(sigma(T))（全纯或连续演算，紧谱情形）", "自伴演算范数：||f(T)|| = sup_{lambda in sigma(T)} |f(lambda)|（正规情形为等式）", "Borel 演算：f(T) = int f(lambda) dE(lambda)，且 f -> f(T) 为 *-同态"],
        theorems: ["全纯演算对任意有界算子成立并保持代数运算，但范数等式一般失败（仅有 von Neumann 型不等式在特殊类成立）", "谱映射定理对多项式与全纯函数成立；对无界算子或一般连续函数需附加条件（如 f 在谱上连续且算子正规）", "正规算子的连续演算是等距 *-同态（Gelfand-Naimark 的具体化）", "平方根与对数等演算需选取分支：谱不与分支割线相交才可定义"],
        generalRequirements: ["使用演算必须声明函数类别（多项式、全纯、连续、Borel）与算子类别匹配", "使用谱映射定理必须确认所用演算的适用范围", "涉及多值函数必须给出分支选取与谱的位置关系"],
        forbiddenErrors: ["【范数等式滥用】对非正规算子写 ||f(T)|| = sup |f|", "【演算越级】对一般有界算子使用 Borel 演算", "【谱映射误用】对未验证条件的无界算子直接写 sigma(f(T)) = f(sigma(T))", "【分支忽略】取平方根或对数而不检查谱与割线", "【同态性质假设】默认演算对非交换组合仍为同态"],
        parameterConstraints: { functionClass: "多项式 / 全纯 / 连续 / Borel 逐级需更强算子条件", operatorClass: "连续与 Borel 演算需正规或自伴", contourRequirement: "全纯演算需围道包含谱且在全纯域内", branchCondition: "多值函数需谱避开分支割线" },
        closureChecks: ["确认函数类与算子类的匹配", "确认围道与谱位置", "确认范数估计的正规性前提", "确认分支选取说明"],
        scenarioChecks: { squareRootConstruction: ["正算子取唯一正平方根", "确认谱非负"], semigroupFromGenerator: ["用演算构造 e^{tA}", "确认谱位于左半平面"], projectionFromIndicator: ["用指示函数的 Borel 演算得谱投影", "确认投影值测度存在"] },
    },
    // 紧自伴算子的特征展开与 Courant-Fischer 极小极大。
    "spectral-compact-selfadjoint-expansion": {
        definitions: ["紧自伴算子 T = T^* 且紧", "特征系 {(lambda_n, e_n)}，{e_n} 正交", "Rayleigh 商 R(x) = <Tx, x> / <x, x>"],
        formulas: ["Hilbert-Schmidt 展开：T x = sum_n lambda_n <x, e_n> e_n，lambda_n 实且 lambda_n -> 0", "谱结构：sigma(T) = {0} cup {lambda_n}，非零谱点均为有限重特征值", "Courant-Fischer：lambda_k = max_{dim V = k} min_{x in V, x != 0} R(x) = min_{codim W = k-1} max_{x in W} R(x)（按降序）", "极值刻画：lambda_1 = max_{||x|| = 1} <Tx, x>，且最大值在对应特征向量取到"],
        theorems: ["紧自伴算子必有由特征向量构成的正交基（在 cl(im T) 上），0 可能是特征值也可能只是聚点", "特征值绝对值单调趋零，故不能有非零聚点；重数有限", "极小极大原理给出特征值的单调性与比较（Weyl 不等式），是数值与谱几何估计的基础", "非自伴紧算子一般无特征展开（如 Volterra 算子无非零特征值）"],
        generalRequirements: ["使用特征展开必须同时验证紧性与自伴性", "写谱必须包含 0 并说明其是否为特征值", "使用极小极大必须固定特征值排序方向与子空间维数约束"],
        forbiddenErrors: ["【自伴性缺失】对紧非自伴算子写特征展开", "【零点遗漏】断言 sigma(T) 仅由非零特征值组成", "【趋零性忽视】给出不趋于零的特征值列", "【极小极大方向错】把降序与升序刻画混用", "【重数无限】声称某非零特征值有无限重数"],
        parameterConstraints: { compactnessAndSelfadjointness: "需紧且自伴", eigenvalueAsymptotics: "lambda_n -> 0", multiplicityFiniteness: "非零特征值重数有限", orderingConvention: "极小极大需固定排序方向" },
        closureChecks: ["确认紧性与自伴性", "确认谱含 0 的表述", "确认特征值趋零与重数有限", "确认极小极大公式的维数约束"],
        scenarioChecks: { sturmLiouvilleEigenvalues: ["逆算子紧自伴给出特征展开", "确认边界条件自伴"], eigenvalueComparison: ["用极小极大比较两算子特征值", "确认序关系 A <= B"], integralOperatorDiagonalization: ["对称核积分算子对角化", "确认核对称且平方可积"] },
    },
    // 本质谱、Weyl 定理与紧扰动稳定性。
    "spectral-essential-spectrum-weyl": {
        definitions: ["本质谱 sigma_ess(T)：lambda I - T 非 Fredholm 的 lambda 集合", "离散谱：孤立有限重特征值", "Weyl 谱：所有紧扰动谱的交"],
        formulas: ["紧扰动不变：sigma_ess(T + K) = sigma_ess(T)（K 紧）", "分解：自伴算子情形 sigma(T) = sigma_disc(T) cup sigma_ess(T)，两者不交", "Weyl 定理（自伴）：sigma(T) \\ sigma_ess(T) = 孤立有限重特征值集合", "Weyl 准则：lambda in sigma_ess(T) <=> 存在正交归一序列 x_n 使 ||(T - lambda)x_n|| -> 0"],
        theorems: ["本质谱是 Calkin 代数 B(H)/K(H) 中像元素的谱，故对紧扰动完全稳定", "紧算子的本质谱为 {0}；有限维空间本质谱为空", "Weyl 定理对自伴算子成立，对一般算子需 Weyl 型条件（如超正规），不可默认", "Schrödinger 算子 -Delta + V（V 趋零）满足 sigma_ess = [0, infinity)，束缚态属于离散谱"],
        generalRequirements: ["区分本质谱与离散谱并给出判定依据（Fredholm 或 Weyl 准则）", "使用紧扰动不变性必须验证扰动紧", "对非自伴算子使用 Weyl 定理必须声明额外条件"],
        forbiddenErrors: ["【扰动类别越界】用相对有界但非紧的扰动断言本质谱不变", "【谱分解误设】认为本质谱与离散谱可以相交", "【Weyl 定理滥用】对任意有界算子断言 Weyl 定理成立", "【准则误用】用非正交序列验证 Weyl 准则", "【紧算子本质谱误判】称紧算子本质谱含非零点"],
        parameterConstraints: { perturbationClass: "紧（或相对紧）扰动", selfadjointnessForWeyl: "Weyl 定理需自伴或超正规", weylSequenceCondition: "序列需正交归一且 ||(T-lambda)x_n|| -> 0", fredholmCharacterization: "本质谱由 Fredholm 性定义" },
        closureChecks: ["确认扰动紧性", "确认谱分解不相交", "确认 Weyl 准则序列条件", "确认非自伴情形的额外假设"],
        scenarioChecks: { schrodingerBoundStates: ["位势衰减时本质谱由自由算子决定", "确认相对紧性"], differenceOfOperators: ["用紧差判断本质谱相同", "确认差算子紧"], discreteSpectrumCounting: ["计数离散特征值用极小极大", "确认低于本质谱下界"] },
    },
    // 谱测度的绝对连续、奇异连续与纯点分类。
    "spectral-measure-classification": {
        definitions: ["谱测度 mu_x(B) = <E(B)x, x>", "Lebesgue 分解 mu = mu_ac + mu_sc + mu_pp", "对应子空间 H_ac、H_sc、H_pp 与谱 sigma_ac、sigma_sc、sigma_pp"],
        formulas: ["空间分解：H = H_ac oplus H_sc oplus H_pp，各子空间 T 不变", "sigma_pp = cl({特征值})，注意 sigma_pp 为闭包故可含非特征值点", "判据（Simon-Wolff / Kato）：resolvent 的边界行为 lim_{eps->0} Im <(T - lambda - i eps)^{-1} x, x> 给出绝对连续部分密度", "RAGE 定理：连续谱部分的时间平均 (1/T) int_0^T ||chi_K e^{-itT} x||^2 dt -> 0（K 紧、x in H_c）"],
        theorems: ["纯点谱不等于点谱：sigma_pp 为特征值集合的闭包，可包含非特征值的极限点", "奇异连续谱真实存在（准周期 Schrödinger、Anderson 型模型），不能默认为空", "绝对连续谱对应散射态与输运，纯点谱对应局域化（Anderson 局域化）", "谱分类不被酉等价以外的一般变换保持；紧扰动可改变谱型（Weyl-von Neumann 定理：自伴算子可用紧扰动变为纯点谱）"],
        generalRequirements: ["区分点谱、纯点谱与特征值集合三者", "断言某类谱为空必须给出判据或引用具体模型结论", "使用谱型讨论动力学必须指明对应的不变子空间"],
        forbiddenErrors: ["【纯点谱等特征值集】把 sigma_pp 与特征值集合直接等同", "【奇异连续谱忽略】默认谱只有绝对连续与纯点两部分", "【紧扰动谱型不变】认为紧扰动保持谱型（反例：Weyl-von Neumann）", "【子空间遗漏】讨论动力学时不区分 H_ac 与 H_pp", "【判据误用】用单点 resolvent 值断言绝对连续性"],
        parameterConstraints: { decompositionCompleteness: "mu = mu_ac + mu_sc + mu_pp 三部分", subspaceInvariance: "三个子空间均 T 不变", closureInPurePoint: "sigma_pp 为特征值闭包", perturbationSensitivity: "谱型对紧扰动不稳定" },
        closureChecks: ["确认三类谱均被考虑", "确认纯点谱定义使用闭包", "确认谱型结论的判据或模型依据", "确认动力学结论与子空间对应"],
        scenarioChecks: { andersonLocalization: ["随机位势给出纯点谱与局域化", "确认几乎必然意义"], scatteringTheorySetting: ["绝对连续谱对应散射态", "确认 RAGE 或 Kato 平滑条件"], quasiperiodicModels: ["准周期算子可现奇异连续谱", "确认频率的丢番图条件"] },
    },
    // Rayleigh 商与变分特征值刻画。
    "spectral-rayleigh-quotient-variational": {
        definitions: ["Rayleigh 商 R(x) = <Tx, x> / ||x||^2（自伴 T，x in D(T) \\ {0})", "谱下界 inf sigma(T)", "谱间隙 lambda_2 - lambda_1", "二次形式 q(x) = <Tx, x> 与形式定义域"],
        formulas: ["下界刻画：inf sigma(T) = inf_{x != 0} R(x)，上界同理取 sup", "第 k 个特征值（若低于本质谱下界）：lambda_k = inf_{dim V = k} sup_{x in V} R(x)", "谱间隙与 Poincaré 型不等式：<Tx, x> >= lambda_2 ||x||^2 对 x perp e_1", "试探函数上界：任意 x 给出 lambda_1 <= R(x)，是变分数值方法的基础"],
        theorems: ["变分刻画只对自伴（或半有界形式）算子成立，非自伴情形需用数值域或伪谱", "试探函数只能给出基态能量的上界，得下界需另设方法（如 Temple 不等式或本质谱定位）", "极小极大对低于本质谱下界的特征值有效；进入本质谱后计数失效", "Friedrichs 延拓允许对半有界形式定义自伴算子并保持变分刻画"],
        generalRequirements: ["使用变分刻画必须声明自伴性与半有界性", "用试探函数给结论必须明确是上界", "对 k >= 2 的特征值必须写出正交约束或子空间维数约束"],
        forbiddenErrors: ["【方向误设】用试探函数断言基态能量下界", "【自伴性缺失】对非自伴算子使用 Rayleigh 商刻画特征值", "【本质谱越界】在本质谱内继续用极小极大计数特征值", "【约束遗漏】计算 lambda_2 时不施加正交条件", "【形式定义域忽略】在 D(T) 外的向量上使用 R(x)"],
        parameterConstraints: { selfadjointnessRequirement: "需自伴或半有界二次形式", boundednessBelow: "极小刻画需谱下有界", orthogonalityConstraints: "高阶特征值需正交或维数约束", validityRange: "极小极大仅在本质谱下界以下有效" },
        closureChecks: ["确认自伴与半有界性", "确认结论方向（上界或精确值）", "确认正交约束写明", "确认与本质谱下界的位置关系"],
        scenarioChecks: { groundStateEnergyEstimate: ["用试探函数得上界", "确认归一化"], poincareInequality: ["谱间隙给出加权不等式", "确认正交于基态"], numericalRayleighRitz: ["Rayleigh-Ritz 给出特征值上界序列", "确认子空间维数"] },
    },
    // Gelfand 变换与交换 Banach 代数的谱刻画。
    "spectral-gelfand-transform-banach-algebra": {
        definitions: ["交换含单位 Banach 代数 A", "极大理想空间（谱空间）Delta(A) = 复同态集合，带弱*拓扑", "Gelfand 变换 hat{a}(phi) = phi(a)", "根基 rad(A) = 所有极大理想之交"],
        formulas: ["谱等同：sigma_A(a) = { phi(a) : phi in Delta(A) } = hat{a}(Delta(A))", "范数关系：||hat{a}||_infinity = r(a) = lim ||a^n||^{1/n} <= ||a||", "Gelfand 变换核：ker(Gelfand) = rad(A)，故半单时为单射", "Gelfand-Naimark：交换 C*-代数 A ≅ C(Delta(A))（等距 *-同构）"],
        theorems: ["Delta(A) 在含单位时为弱*紧 Hausdorff 空间，故 Gelfand 变换落在 C(Delta(A))", "Gelfand 变换一般只是范数递减同态，不必是等距或满射；等距当且仅当 ||a^2|| = ||a||^2 类条件成立", "Gelfand-Naimark 需要 C*-恒等式 ||a^* a|| = ||a||^2 与交换性；对一般交换 Banach 代数（如 Wiener 代数 l^1(Z)）不成立等距", "Wiener 引理是 Gelfand 理论的典型应用：绝对收敛 Fourier 级数无零点则其倒数仍绝对收敛"],
        generalRequirements: ["使用谱等同必须声明含单位与交换性", "断言 Gelfand 变换等距或满射必须验证 C*-条件", "用极大理想空间必须说明弱*拓扑与紧性来源"],
        forbiddenErrors: ["【交换性缺失】对非交换代数使用 Gelfand 变换的谱等同", "【等距误断】把一般交换 Banach 代数的 Gelfand 变换当作等距同构", "【单位遗漏】无单位代数直接断言 Delta(A) 紧", "【半单性忽略】在有非零根基时断言 Gelfand 变换单射", "【谱依赖对象错】混淆 sigma_A(a) 与在更大代数中的谱（不作谱不变性说明）"],
        parameterConstraints: { commutativity: "谱等同需交换", unitalRequirement: "紧性与满谱刻画需含单位", cstarCondition: "等距同构需 ||a^* a|| = ||a||^2", semisimplicity: "单射需 rad(A) = 0" },
        closureChecks: ["确认交换与含单位假设", "确认变换是否等距的依据", "确认根基为零再谈单射", "确认谱所依赖的代数已指明"],
        scenarioChecks: { wienerLemmaApplication: ["l^1(Z) 上用 Gelfand 变换判可逆", "确认变换后函数无零点"], continuousFunctionalCalculusSetup: ["由 Gelfand-Naimark 构造连续演算", "确认生成的 C*-代数交换"], maximalIdealIdentification: ["把极大理想与点求值对应", "确认代数含单位且交换"] },
    },
    // 特征值摄动的解析依赖与谱稳定性。
    "spectral-perturbation-eigenvalue-stability": {
        definitions: ["解析族 T(z) = T_0 + z V", "相对有界扰动：D(V) supset D(T_0) 且 ||V x|| <= a ||T_0 x|| + b ||x||", "Riesz 投影 P(z) = (1 / 2 pi i) oint_Gamma (w - T(z))^{-1} dw", "谱间隙与孤立特征值"],
        formulas: ["一阶摄动（单重特征值）：lambda(z) = lambda_0 + z <V e_0, e_0> + O(z^2)", "二阶项：lambda^{(2)} = sum_{n != 0} |<V e_0, e_n>|^2 / (lambda_0 - lambda_n)", "自伴情形谱距离：dist(sigma(T_0 + V), sigma(T_0)) <= ||V||（Weyl 不等式 |lambda_k(T_0+V) - lambda_k(T_0)| <= ||V||）", "Riesz 投影稳定：Gamma 上无谱时 P(z) 随 z 解析，且 rank P(z) 常值"],
        theorems: ["Kato-Rellich：自伴解析族的孤立有限重特征值随参数解析延伸，重数在小扰动下守恒（但可分裂为多支）", "非自伴情形特征值只保证代数函数（Puiseux）依赖，可出现半整数幂分支（例外点/EP）", "谱不连续现象：一般算子的谱对范数扰动不连续，需伪谱或数值域刻画稳定性", "本质谱在相对紧扰动下不变，但绝对连续谱可被小的迹类扰动改变（谱型不稳定）"],
        generalRequirements: ["用摄动展开必须先确认特征值孤立且重数有限", "写一阶公式必须声明单重（或给出退化情形的矩阵化处理）", "对非自伴族必须允许 Puiseux 型分支而非解析展开"],
        forbiddenErrors: ["【孤立性缺失】对嵌入本质谱的特征值直接做摄动展开", "【单重性误设】对退化特征值直接用 <V e, e> 一阶公式", "【解析性误断】对非自伴族断言特征值总解析依赖参数", "【谱连续性误用】用范数小断言非自伴算子谱位置几乎不变", "【重数漂移】忽略特征值分裂而坚持单一分支"],
        parameterConstraints: { isolationRequirement: "特征值需孤立且有限重", perturbationSize: "需小于谱间隙的一半量级", relativeBoundedness: "无界情形需相对有界且 a < 1", analyticityClass: "自伴解析族才有解析分支" },
        closureChecks: ["确认孤立性与重数", "确认扰动尺度与谱间隙比较", "确认自伴性以决定分支类型", "确认 Riesz 投影围道不穿谱"],
        scenarioChecks: { starkOrZeemanExpansion: ["小场强下用一阶摄动", "确认基态孤立"], degeneratePerturbation: ["退化时对特征子空间做矩阵摄动", "确认投影后有限维化"], numericalEigenvalueSensitivity: ["用条件数或伪谱估计敏感性", "确认非自伴时不用 Weyl 不等式"] },
    },
};
