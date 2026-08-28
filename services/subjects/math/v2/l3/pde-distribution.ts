import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“偏微分方程-分布与弱解”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const PDE_DISTRIBUTION_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 分布的定义、收敛与阶。
    "distribution-space-definition-convergence": {
        id: "distribution-space-definition-convergence", l2Key: "pde-distribution", name: "分布空间与分布收敛", kind: "object",
        aliases: ["测试函数", "D'(Omega)", "分布收敛", "分布的阶"],
    },
    // 分布导数与分部积分公式。
    "distribution-derivative-integration-by-parts": {
        id: "distribution-derivative-integration-by-parts", l2Key: "pde-distribution", name: "分布导数与弱分部积分", kind: "formula",
        aliases: ["弱导数", "分布导数", "跳跃项", "Heaviside求导"],
    },
    // 分布的支集、奇异支集与紧支分布。
    "distribution-support-singular-support": {
        id: "distribution-support-singular-support", l2Key: "pde-distribution", name: "支集与奇异支集", kind: "object",
        aliases: ["支集", "奇异支集", "E'(Omega)", "点支分布"],
    },
    // 卷积、正则化与恒等逼近。
    "distribution-convolution-mollification": {
        id: "distribution-convolution-mollification", l2Key: "pde-distribution", name: "卷积与磨光逼近", kind: "theorem",
        aliases: ["磨光子", "恒等逼近", "卷积可微性", "稠密性"],
    },
    // 缓增分布与 Fourier 变换。
    "distribution-tempered-fourier-transform": {
        id: "distribution-tempered-fourier-transform", l2Key: "pde-distribution", name: "缓增分布的 Fourier 变换", kind: "theorem",
        aliases: ["S'(R^n)", "缓增分布", "Fourier变换", "Plancherel"],
    },
    // 基本解与常系数算子的可解性。
    "distribution-fundamental-solution": {
        id: "distribution-fundamental-solution", l2Key: "pde-distribution", name: "基本解与 Malgrange-Ehrenpreis", kind: "theorem",
        aliases: ["分布意义基本解", "分布意义Green函数", "Malgrange-Ehrenpreis", "Delta响应"],
    },
    // 椭圆算子的亚椭圆性与弱解正则性。
    "distribution-elliptic-hypoellipticity-regularity": {
        id: "distribution-elliptic-hypoellipticity-regularity", l2Key: "pde-distribution", name: "亚椭圆性与弱解正则性", kind: "theorem",
        aliases: ["亚椭圆", "Weyl引理", "弱解光滑性", "亚椭圆正则性提升"],
    },
    // Sobolev 弱解与变分表述。
    "distribution-weak-solution-variational-formulation": {
        id: "distribution-weak-solution-variational-formulation", l2Key: "pde-distribution", name: "弱解的变分表述与 Lax-Milgram", kind: "criterion",
        aliases: ["弱形式", "Lax-Milgram", "强制性", "H^1弱解"],
    },
    // 迹算子与弱意义下的边界条件。
    "distribution-trace-boundary-condition": {
        id: "distribution-trace-boundary-condition", l2Key: "pde-distribution", name: "迹算子与弱边界条件", kind: "theorem",
        aliases: ["迹定理", "H^{1/2}迹", "Neumann弱形式", "H_0^1"],
    },
    // 波前集与奇性传播。
    "distribution-wavefront-set-propagation": {
        id: "distribution-wavefront-set-propagation", l2Key: "pde-distribution", name: "波前集与奇性传播", kind: "object",
        aliases: ["波前集", "微局部分析", "特征集", "奇性传播"],
    },
});

// 规则字段固定为 8 项：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const PDE_DISTRIBUTION_L3_RULES: Record<string, MathV2L3Rules> = {
    // 分布空间的对偶定义、弱*收敛与阶。
    "distribution-space-definition-convergence": {
        definitions: ["测试函数空间 D(Omega) = C_c^infty(Omega)，带归纳极限拓扑；紧集列举出的半范族给出其收敛概念", "分布 T in D'(Omega) 是 D(Omega) 上的线性函数，且对每个紧 K subset Omega 存在 C_K 与整数 N_K 使 |<T, phi>| <= C_K sup_{|alpha| <= N_K} sup |partial^alpha phi|", "分布的阶 = 可取的最小 N_K（若可全局取同一 N 则称有限阶）", "L_loc^1 函数 f 通过 <T_f, phi> = int f phi 嵌入 D'(Omega)，嵌入是单射（几乎处处相等意义下）"],
        formulas: ["Dirac 分布：<delta_a, phi> = phi(a)，阶为 0", "主值分布：<pv(1/x), phi> = lim_{eps -> 0+} int_{|x| > eps} phi(x)/x dx", "Sokhotski-Plemelj：1/(x -+ i0) = pv(1/x) +- i pi delta", "分布收敛：T_j -> T 当且仅当对每个 phi in D 有 <T_j, phi> -> <T, phi>（弱*收敛）"],
        theorems: ["连续性判据：线性函数 T 是分布当且仅当上述局部有界估计成立，等价于对 phi_j -> 0（D 中）有 <T, phi_j> -> 0", "结构定理：紧支分布必有有限阶，且可写成有限个连续函数导数之和", "阶为 0 的分布恰是 Radon 测度（Riesz 表示）", "D'(Omega) 上弱*有界集列紧（D 可分且是 Montel 型空间的结果）"],
        generalRequirements: ["必须指明开集 Omega 与作用的测试函数类，并检查配对积分绝对收敛或按主值规范定义", "凡断言某公式在分布意义成立，必须写出对任意 phi in D 的配对等式而不是逐点等式", "涉及收敛必须区分逐点收敛、L^1 收敛与分布收敛，只有分布收敛可用于弱*论证", "把函数当分布使用前必须验证局部可积性；不可积奇性必须显式正则化"],
        forbiddenErrors: ["【逐点误用】把 delta 当成取值为 +infty 的函数并计算 delta(0) 或 delta^2", "【可积性缺失】直接把 1/x 或 1/|x|^n 视为分布而不作主值或有限部分正则化", "【收敛混淆】由 T_j -> T 分布收敛推出逐点收敛或范数收敛", "【阶忽略】对无限阶分布使用有限阶结构定理", "【乘法幻觉】任意两个分布相乘并声称结果仍是分布"],
        parameterConstraints: { domainOpenness: "Omega subset R^n 必须开，紧支集必须紧包含于 Omega", testFunctionClass: "phi in C_c^infty(Omega)，若换成 S 或 C^k 必须重新声明对偶空间", localBoundConstant: "C_K 与 N_K 只允许依赖紧集 K，不得依赖 phi", regularizationScheme: "主值或有限部分正则化方案必须固定，改变方案会改变分布" },
        closureChecks: ["回代若干具体测试函数（例如截断的高斯或凸起函数）核验配对值", "检查所得分布对 D 中收敛列的连续性估计", "验证在光滑函数子类上与经典公式一致", "核验支集与阶与所声称的分布类型相符"],
        scenarioChecks: { principalValueProblem: ["核验对称截断极限存在", "确认奇函数配对项相消是极限存在的真正原因"], measureRepresentation: ["确认分布非负从而对应正测度", "写出对应 Radon 测度并核验总变差有限性"], sequenceApproximation: ["核验逼近族质量归一", "确认弱*极限唯一而不依赖逼近方式"] },
    },
    // 分布导数与含跳跃项的弱分部积分。
    "distribution-derivative-integration-by-parts": {
        definitions: ["分布导数由对偶定义：<partial^alpha T, phi> = (-1)^{|alpha|} <T, partial^alpha phi>，对任意分布任意阶恒有意义", "弱导数：u in L_loc^1 的弱导数是满足 int u partial_i phi = - int v_i phi 的 v_i in L_loc^1，存在时与分布导数一致", "跳跃项：分片光滑函数在界面 S 上的跃度 [u] = u_+ - u_-，进入分布导数作为界面上的单层测度"],
        formulas: ["Heaviside：H' = delta；符号函数 sgn' = 2 delta", "一维跳跃公式：若 u 分片 C^1 且在 x_k 处跳跃 [u]_k，则 u' = {u'} + sum_k [u]_k delta_{x_k}", "高维跳跃公式：partial_i u = {partial_i u} + [u] n_i dS|_S", "log 的导数：(ln|x|)' = pv(1/x)", "基本恒等式：Delta (1/|x|^{n-2}) = -(n-2) omega_{n-1} delta（n >= 3）", "分部积分：int_Omega u partial_i phi = - int_Omega partial_i u phi + int_{partial Omega} u phi n_i dS"],
        theorems: ["分布导数与极限交换：分布收敛 T_j -> T 蕴含 partial^alpha T_j -> partial^alpha T（弱*连续性）", "混合偏导可交换：任意分布满足 partial_i partial_j T = partial_j partial_i T，无需正则性假设", "导数为零判据：连通开集上 T' = 0 蕴含 T 为常数分布", "du Bois-Reymond 引理：局部可积函数若对所有 phi in D 满足 int u phi = 0，则 u = 0 几乎处处"],
        generalRequirements: ["求分片函数的导数必须逐一列出所有不连续界面并给出跳跃项，不得只取古典部分", "分部积分必须写出边界项，只有 phi 紧支于 Omega 内部或迹为零时才可丢弃", "对不光滑函数求导前必须确认其局部可积，且导数结论只在分布意义下断言", "凡使用弱导数与古典导数一致，必须验证古典导数存在且局部可积"],
        forbiddenErrors: ["【跳跃遗漏】对分片光滑函数求导只写古典部分，漏掉 [u] delta 或界面测度项", "【边界项丢弃】在测试函数不紧支或迹不为零时仍丢弃 int_{partial Omega} 项", "【链式滥用】对分布施加非线性复合并直接使用链式法则，如声称 (H(u))' = H'(u) u'", "【绝对值误算】把 |x| 的二阶导数写成 0 而不是 2 delta", "【弱导数误判】由 u 几乎处处可导推出弱导数存在且等于该逐点导数（Cantor 函数反例）"],
        parameterConstraints: { interfaceRegularity: "界面 S 需 Lipschitz 或 C^1 以定义外法向 n 与面测度 dS", integrabilityOfJumpPart: "跳跃量 [u] 需在 S 上局部可积以定义单层分布", classicalPartLocalIntegrability: "古典部分 {partial_i u} 必须局部可积，否则整体不是分布", testSupportCondition: "丢弃边界项要求 supp phi 紧含于 Omega" },
        closureChecks: ["用具体跨越界面的测试函数核验跳跃项系数", "对光滑情形退化检查：跳跃项应自动消失", "核验所得导数在分布意义下与积分表达式一致", "检查混合偏导交换后结果不变"],
        scenarioChecks: { piecewiseDefinedFunction: ["列出所有分段点或界面", "对每处写出跃度与法向并核验符号"], distributionalPDEVerification: ["把候选解代入弱形式并逐项分部积分", "核验界面处产生的 delta 项与方程右端匹配"], nonlinearOperation: ["确认非线性运算在分布空间无定义并改用逼近或熵解框架"] },
    },
    // 支集、奇异支集与紧支分布的结构。
    "distribution-support-singular-support": {
        definitions: ["支集 supp T = Omega 去掉所有使 T 在其上为零的开集之并，等价于 T 不局部为零的点集之闭包", "奇异支集 sing supp T = T 不局部为光滑函数的点集，是 supp T 的闭子集", "紧支分布空间 E'(Omega) = C^infty(Omega) 的对偶，恰为支集紧的分布", "点支分布：支集为单点的分布必为该点处 delta 及其有限阶导数的线性组合"],
        formulas: ["局部化：若 supp T cap supp phi = 空集，则 <T, phi> = 0", "支集包含关系：supp(partial^alpha T) subset supp T；supp(f T) subset supp f cap supp T", "卷积支集：supp(S * T) subset supp S + supp T（其中一者紧支）", "点支结构：supp T = {a} 蕴含 T = sum_{|alpha| <= N} c_alpha partial^alpha delta_a"],
        theorems: ["紧支分布必有有限阶；E'(Omega) 中元素可延拓为 D'(R^n) 中紧支分布", "Paley-Wiener-Schwartz：T in E'(R^n) 的 Fourier 变换是整函数且满足指数型多项式增长估计，反之亦然", "奇异支集判据：sing supp T 为空集当且仅当 T 由光滑函数给出", "拟局部性：卷积算子满足 sing supp(S * T) subset sing supp S + sing supp T"],
        generalRequirements: ["断言支集必须给出闭集并逐点说明局部为零或局部不为零的理由", "使用配对为零的局部化论证必须核验支集不相交而不是只在有限点不相交", "区分支集与奇异支集，正则性结论只能由奇异支集控制", "把分布延拓到更大开集或更小测试类前必须核验支集紧性或增长条件"],
        forbiddenErrors: ["【支集开集化】把支集写成开集或漏取闭包", "【导数扩张】声称求导会使支集扩大", "【卷积越界】不核验其中一个因子紧支就使用卷积支集公式", "【点支泛化】把点支结构定理用于支集是曲线或曲面的分布", "【奇异支集混淆】用 supp T 非空推断 T 不光滑"],
        parameterConstraints: { closednessOfSupport: "supp T 必须是 Omega 中相对闭集", compactnessForPairing: "与 C^infty 配对要求 supp T 紧", orderFiniteness: "点支结构中导数阶 N 有限且由分布阶决定", convolutionAdmissibility: "S * T 需至少一个因子紧支或支集满足适当锥条件" },
        closureChecks: ["用支集外的测试函数核验配对确实为零", "核验支集内每点存在测试函数使配对非零", "对紧支情形核验 Fourier 变换的整性与指数估计", "核验奇异支集之外分布确实局部光滑"],
        scenarioChecks: { pointSupportClassification: ["确定分布阶", "按阶写出 delta 导数展开并定出系数"], compactSupportFourier: ["核验支集包含于半径 R 的球", "核验 |hat{T}(zeta)| <= C (1 + |zeta|)^N e^{R |Im zeta|}"], singularityLocation: ["用磨光刻画局部光滑区域", "标出奇异支集并与方程特征集比较"] },
    },
    // 卷积、磨光与稠密性逼近。
    "distribution-convolution-mollification": {
        definitions: ["磨光子：rho in C_c^infty(R^n)，rho >= 0，int rho = 1，rho_eps(x) = eps^{-n} rho(x/eps)", "分布与测试函数卷积：(T * phi)(x) = <T, phi(x - .)>，结果为光滑函数", "分布卷积：S * T 通过 <S * T, phi> = <S, T~ * phi> 定义，其中 T~(x) = T(-x)，需支集条件保证有意义"],
        formulas: ["卷积求导：partial^alpha (S * T) = (partial^alpha S) * T = S * (partial^alpha T)", "单位元：delta * T = T；平移：delta_a * T = T(. - a)", "磨光逼近：T * rho_eps -> T 在 D' 中，eps -> 0+", "L^p 磨光：||u * rho_eps||_{L^p} <= ||u||_{L^p}（Young 不等式）且 u * rho_eps -> u 于 L^p（1 <= p < infty）", "支集：supp(T * rho_eps) subset supp T + supp rho_eps"],
        theorems: ["卷积光滑性：T in D'，phi in D 蕴含 T * phi in C^infty，且导数可移入任一因子", "稠密性：D(Omega) 在 D'(Omega) 中弱*稠密；C_c^infty 在 L^p（1 <= p < infty）与 W^{k,p} 中稠密", "结合律：三个分布卷积在至多一个非紧支且支集条件满足时结合律成立", "Lebesgue 点收敛：连续函数的磨光在紧集上一致收敛"],
        generalRequirements: ["使用磨光必须声明磨光子的归一性与非负性，并说明逼近在何种拓扑下成立", "在有界区域上磨光必须处理边界层，只在内部紧子集上断言收敛", "使用卷积结合律或求导规则必须核验支集条件", "凡用稠密性把恒等式从光滑函数推广到一般函数，必须核验两端在相应范数下连续"],
        forbiddenErrors: ["【结合律滥用】三个非紧支分布卷积随意结合", "【边界越界】在 Omega 上直接磨光而不缩小到内部紧子集", "【收敛类型错配】由 L^p 磨光收敛推出 L^infty 或逐点一致收敛（p = infty 时一般失败）", "【非负性缺失】用变号核声称保持极值原理或范数不增", "【稠密性过度】把只在光滑函数上成立且两端不连续的等式经稠密性推广"],
        parameterConstraints: { mollifierNormalization: "int rho = 1 且 rho >= 0，支集含于单位球", epsilonRange: "eps 需小于到边界的距离 dist(K, partial Omega) 才能在 K 上定义磨光", convolutionSupportCondition: "分布卷积要求至少一个因子紧支", exponentRangeForLpDensity: "L^p 磨光收敛要求 1 <= p < infty" },
        closureChecks: ["核验磨光后函数光滑且支集按 supp T + B_eps 扩张", "令 eps -> 0 核验弱*极限回到原分布", "在紧子集上核验一致或 L^p 收敛率", "核验求导与卷积交换后两种写法一致"],
        scenarioChecks: { boundaryLayerHandling: ["取内部紧穷竭 K_j", "对每个 K_j 选 eps < dist(K_j, partial Omega)"], approximateIdentityProof: ["拆成主项与尾项", "用连续性或 L^p 连续性控制尾项"], densityArgument: ["核验目标恒等式两端对所用范数连续", "在光滑稠密子类上验证后取极限"] },
    },
    // 缓增分布与 Fourier 变换的对偶延拓。
    "distribution-tempered-fourier-transform": {
        definitions: ["Schwartz 空间 S(R^n) = 所有 phi in C^infty 使 sup |x^beta partial^alpha phi| < infty，带可数半范族", "缓增分布 S'(R^n) = S(R^n) 的连续对偶；缓增性排除指数增长", "对偶 Fourier 变换：<hat{T}, phi> = <T, hat{phi}>，对任意 T in S' 有定义", "Sobolev 空间的 Fourier 刻画：H^s(R^n) = { u in S' : (1 + |xi|^2)^{s/2} hat{u} in L^2 }"],
        formulas: ["约定：hat{phi}(xi) = int phi(x) e^{-2 pi i x . xi} dx（若改用 e^{-i x xi} 需同步改常数）", "求导对应：hat{partial^alpha T} = (2 pi i xi)^alpha hat{T}；hat{x^alpha T} = (-1/(2 pi i))^{|alpha|} partial^alpha hat{T}", "hat{delta} = 1；hat{1} = delta", "卷积定理：hat{S * T} = hat{S} hat{T}（需一因子紧支或属于合适类以保证乘积有意义）", "Plancherel：||hat{u}||_{L^2} = ||u||_{L^2}", "Sobolev 范数：||u||_{H^s}^2 = int (1 + |xi|^2)^s |hat{u}(xi)|^2 dxi"],
        theorems: ["Fourier 变换是 S 上的拓扑同构，并按对偶延拓为 S' 上的同构，逆变换公式在 S' 中成立", "Paley-Wiener-Schwartz：紧支分布的 Fourier 变换是满足指数估计的整函数", "Bochner-Schwartz：正定分布恰为正缓增测度的 Fourier 变换", "Hormander 乘子刻画：常系数算子 P(D) 在 S' 中的可解性与符号 P(xi) 的零点结构相关；P(xi) 不为零且倒数缓增时可逆"],
        generalRequirements: ["必须先确认分布缓增才能作 Fourier 变换；只在 D' 中的分布一般没有 Fourier 变换", "必须固定并声明变换核的常数约定，全解使用同一约定", "使用卷积定理必须核验乘积 hat{S} hat{T} 在分布意义有定义", "涉及 Sobolev 指标必须写出权 (1 + |xi|^2)^s 并核验积分收敛"],
        forbiddenErrors: ["【缓增缺失】对 e^{x^2} 或 e^x 这类非缓增对象作 Fourier 变换", "【常数漂移】在同一推导中混用 e^{-2 pi i x xi} 与 e^{-i x xi} 约定导致 2 pi 因子错误", "【乘积无定义】两个奇性重叠的分布相乘并使用卷积定理", "【逆变换越界】在 S' 中使用逐点逆变换积分公式而非对偶意义", "【符号零点忽视】在 P(xi) 有零点时仍用 1/P(xi) 直接定义解算子"],
        parameterConstraints: { temperedGrowth: "T 需满足对某些 N 有 |<T, phi>| <= C sum sup |x^beta partial^alpha phi|", kernelConvention: "变换核常数约定必须全局一致", multiplierRegularity: "乘子 m(xi) 需为缓增光滑函数（或至少满足 Mikhlin-Hormander 条件）以保证 m hat{u} in S'", sobolevIndex: "s in R 任意，但嵌入结论需 s > n/2 等具体阈值" },
        closureChecks: ["对 delta 与高斯这类标准对象核验公式与常数", "核验逆变换回代得到原分布", "核验 Plancherel 或 Sobolev 范数两端有限", "检查所得 hat{T} 的增长阶与缓增性一致"],
        scenarioChecks: { constantCoefficientSolving: ["把方程化为 P(2 pi i xi) hat{u} = hat{f}", "核验 1/P 的缓增性或改用基本解构造"], sobolevRegularityEstimate: ["写出频率权并分低频高频估计", "核验嵌入所需指标条件"], compactlySupportedCase: ["核验支集紧性", "使用 Paley-Wiener-Schwartz 得到整性与指数界"] },
    },
    // 基本解与常系数算子的可解性。
    "distribution-fundamental-solution": {
        definitions: ["基本解：满足 P(D) E = delta 的分布 E；解由 u = E * f 给出（f 紧支或支集条件满足时）", "Green 函数：带边界条件的基本解，满足 P(D) G(., y) = delta_y 且在边界上满足给定齐次条件", "参数化基本解（parametrix）：满足 P(D) E = delta + R 且 R 光滑核，用于正则性论证"],
        formulas: ["Laplace 基本解：n >= 3 时 E(x) = -1/((n-2) omega_{n-1} |x|^{n-2})；n = 2 时 E(x) = (1/(2 pi)) ln|x|", "热方程基本解：E(x, t) = (4 pi t)^{-n/2} e^{-|x|^2/(4t)} H(t)", "波方程基本解（n = 3）：E = (1/(4 pi t)) dS_{|x| = t}（单层测度）", "解表示：u = E * f 满足 P(D) u = f；Green 表示 u(x) = int G(x, y) f(y) dy + 边界项"],
        theorems: ["Malgrange-Ehrenpreis：任意非零常系数偏微分算子在 R^n 上存在基本解", "基本解非唯一，差为齐次方程 P(D) v = 0 的解；附加衰减或支集条件可定唯一", "支集条件下卷积可解性：f in E'(R^n) 时 u = E * f 有定义并解方程", "Green 函数对称性：自共轭算子（如 Laplace 带 Dirichlet 条件）满足 G(x, y) = G(y, x)"],
        generalRequirements: ["写出基本解必须给出维数依赖形式与归一常数，并核验 P(D) E = delta 的分布意义验证", "使用 u = E * f 必须核验卷积有定义（f 紧支或衰减足够）", "使用 Green 函数必须同时声明区域与边界条件类型，并核验相容性", "必须说明所选基本解在何附加条件下唯一（因果性、衰减或支集）"],
        forbiddenErrors: ["【维数错用】在 n = 2 用 |x|^{2-n} 形式或漏掉对数情形", "【常数缺失】基本解漏掉 omega_{n-1} 或 (n-2) 归一因子导致 delta 系数错误", "【唯一性误判】声称基本解唯一而不加衰减或因果条件", "【卷积不可解】对无衰减且非紧支的 f 直接写 u = E * f", "【边界条件混淆】用自由空间基本解直接充当有界区域 Green 函数"],
        parameterConstraints: { dimensionCase: "n = 1、n = 2 与 n >= 3 的显式形式不同，必须分类", operatorNonTriviality: "P 需为非零多项式算子", sourceSupportOrDecay: "f 需紧支或有足够衰减以保证卷积收敛", boundaryConditionType: "Green 函数需指明 Dirichlet、Neumann 或 Robin 条件并满足相容性" },
        closureChecks: ["对任意 phi in D 核验 <E, P(-D) phi> = phi(0)", "核验远场衰减或因果支集性质", "把 u = E * f 回代原方程并核验源项", "核验 Green 函数在边界上满足所设条件与对称性"],
        scenarioChecks: { laplaceOrPoisson: ["核验维数对应形式与归一常数", "核验解的远场衰减与可能的对数增长"], heatOrCausalProblem: ["核验支集含于 t >= 0 的因果性", "核验初值极限 t -> 0+ 回到 delta"], boundedDomainGreenFunction: ["用镜像或特征展开构造", "核验边界条件与对称性"] },
    },
    // 亚椭圆性与椭圆弱解的正则性提升。
    "distribution-elliptic-hypoellipticity-regularity": {
        definitions: ["算子 P(D) 称亚椭圆，若对任意开集 U 与任意 u in D'，P(D) u in C^infty(U) 蕴含 u in C^infty(U)", "椭圆算子：主符号 P_m(xi) 对任意实 xi 不为零（xi 不为零向量）", "内部正则性：解在区域内部的光滑度只由方程系数与右端的内部光滑度决定，与边界数据的正则性无关"],
        formulas: ["Weyl 引理：Delta u = 0（分布意义）蕴含 u in C^infty 且调和", "椭圆先验估计：||u||_{H^{s+m}(K)} <= C (||P(D) u||_{H^s(K')} + ||u||_{H^{s-1}(K')})，K 紧含于 K'", "Sobolev 正则性提升：P 为 m 阶椭圆且 P u in H_loc^s 蕴含 u in H_loc^{s+m}", "Schauder 型：P u in C^{k, alpha} 蕴含 u in C^{k+m, alpha}（系数足够光滑，0 < alpha < 1）"],
        theorems: ["椭圆算子必亚椭圆；热算子 partial_t - Delta 亦亚椭圆但非椭圆，故亚椭圆严格弱于椭圆", "Hormander 判据：常系数算子亚椭圆当且仅当其特征簇上 |Im zeta| -> infty 时 |Re zeta| -> infty", "Hormander 平方和定理：由向量场生成的算子若其李括号张成整个切空间（Hormander 条件），则亚椭圆", "波算子非亚椭圆：存在只在特征方向不光滑的分布解，故奇性可沿特征传播"],
        generalRequirements: ["断言弱解光滑必须先核验算子亚椭圆或椭圆，并给出主符号非退化的验证", "正则性结论必须限定为内部结论；到边界的正则性需另加边界光滑性与相容条件", "使用先验估计必须写出内外紧集与低阶项，不得省略 ||u||_{H^{s-1}} 型误差项", "系数非常数时必须声明系数正则性，因为正则性提升上限受系数光滑度限制"],
        forbiddenErrors: ["【亚椭圆滥用】把 Weyl 引理式结论用于波算子或输运算子", "【边界越界】由内部正则性直接推出解在闭区域上光滑", "【系数忽视】在仅可测系数下断言 C^infty 正则性（应止于 Holder 或 W^{1,p}）", "【低阶项丢弃】写先验估计时省略低阶项使估计变为伪先验不等式", "【椭圆性误判】只检查 xi 的某些方向就断言主符号不为零"],
        parameterConstraints: { principalSymbolNonvanishing: "P_m(xi) 对所有实 xi 不为零向量时不为零", coefficientRegularity: "系数需 C^infty 才能得到 C^infty 提升，C^{k, alpha} 系数只给有限阶提升", nestedCompactSets: "先验估计中 K 必须紧含于 K'", sobolevOrElderIndex: "指标 s in R 或 0 < alpha < 1 需明确并保持一致" },
        closureChecks: ["核验主符号在单位球面上不为零并给出下界", "对具体解核验其在内部确实光滑而在边界可能不然", "核验先验估计中所用截断函数与紧集嵌套", "把提升后的正则性回代方程核验各项均有意义"],
        scenarioChecks: { weakHarmonicFunction: ["用磨光与均值性质核验光滑", "核验平均值公式成立"], variableCoefficientOperator: ["核验一致椭圆常数上下界", "按系数光滑度确定可达到的最高正则性"], nonEllipticOperator: ["定出特征集", "沿特征方向构造奇性解说明亚椭圆失败"] },
    },
    // 弱解的变分表述与 Lax-Milgram 判据。
    "distribution-weak-solution-variational-formulation": {
        definitions: ["弱形式：求 u in V 使 a(u, v) = <f, v> 对任意 v in V 成立，V 为含边界条件的 Hilbert 空间（如 H_0^1）", "强制性（coercivity）：存在 alpha > 0 使 a(v, v) >= alpha ||v||_V^2", "有界性：存在 M 使 |a(u, v)| <= M ||u||_V ||v||_V", "能量泛函：对称强制情形 J(v) = (1/2) a(v, v) - <f, v>，其唯一极小元即弱解"],
        formulas: ["散度型方程弱形式：int_Omega (A grad u . grad v + b . grad u v + c u v) = int_Omega f v + int_{Gamma_N} g v dS", "Lax-Milgram 估计：||u||_V <= (1/alpha) ||f||_{V'}", "一致椭圆性：alpha_0 |xi|^2 <= A(x) xi . xi <= Lambda |xi|^2", "Poincare 不等式：||v||_{L^2(Omega)} <= C_Omega ||grad v||_{L^2(Omega)}，v in H_0^1(Omega)"],
        theorems: ["Lax-Milgram 定理：V 完备、a 双线性有界且强制时弱解存在唯一且连续依赖 f", "Riesz 表示定理（对称强制情形）与变分原理等价：极小化 J 与解弱形式等价", "Fredholm 择一：a 只满足 Garding 不等式 a(v, v) >= alpha ||v||_V^2 - C ||v||_H^2 时，可解性由齐次问题解空间维数决定", "Cea 引理：Galerkin 子空间近似误差被最佳逼近误差乘以 M/alpha 控制"],
        generalRequirements: ["必须先声明解空间 V 及其内含的边界条件类型，Dirichlet 条件进空间、Neumann 条件进弱形式", "必须逐项核验有界性与强制性常数，并说明 Poincare 或 Garding 不等式的使用位置", "右端 f 必须属于 V' 并说明配对意义；非齐次 Dirichlet 数据必须先做提升化为齐次", "结论只能断言弱解；提升到强解或古典解需另引正则性定理"],
        forbiddenErrors: ["【强制性缺失】只验证有界性就套用 Lax-Milgram", "【边界条件错位】把 Neumann 条件写进空间约束或把 Dirichlet 条件只放在弱形式里", "【非对称误用】对非对称双线性形式使用能量极小化变分原理", "【低阶项忽视】存在负的 c(x) 时不检查是否破坏强制性或落入 Fredholm 择一", "【正则性跃迁】由弱解存在直接断言解二阶可导并满足逐点方程"],
        parameterConstraints: { uniformEllipticity: "A(x) 需满足 alpha_0 |xi|^2 <= A xi . xi 且有上界 Lambda", coefficientIntegrability: "b in L^infty、c in L^infty（或适当 L^p）以保证双线性形式有界", zerothOrderSign: "c >= 0 保证强制性；c 可负时需 Poincare 常数配合或改用 Garding", dataRegularity: "f in H^{-1}(Omega)，Neumann 数据 g in H^{-1/2}(Gamma_N)" },
        closureChecks: ["核验 a 的有界常数 M 与强制常数 alpha 的显式表达", "核验解的能量估计 ||u||_V <= ||f||_{V'} / alpha", "取特殊测试函数核验边界项与方程各项对应", "核验唯一性：设两解相减代入得 a(w, w) = 0 与强制性矛盾"],
        scenarioChecks: { nonhomogeneousDirichlet: ["构造提升函数 u_0 使迹匹配", "对 u - u_0 化为齐次问题并核验右端属于对偶空间"], mixedBoundaryCondition: ["拆分边界为 Gamma_D 与 Gamma_N", "核验 Gamma_D 非空以保证 Poincare 可用"], indefiniteLowerOrderTerm: ["核验 Garding 不等式常数", "用 Fredholm 择一讨论可解性与解空间维数"] },
    },
    // 迹算子与弱意义下的边界条件。
    "distribution-trace-boundary-condition": {
        definitions: ["迹算子 gamma_0 : H^1(Omega) -> H^{1/2}(partial Omega) 是 C^infty(bar{Omega}) 上限制映射的连续延拓", "H_0^1(Omega) = C_c^infty(Omega) 在 H^1 中的闭包，等价刻画为迹为零的 H^1 函数（Omega 边界 Lipschitz）", "法向迹：gamma_1 u = partial_n u 对 H^2 函数落在 H^{1/2}(partial Omega)；一般只能在对偶意义下定义", "弱 Neumann 条件：不进入解空间，而体现在弱形式的边界积分项中"],
        formulas: ["迹不等式：||gamma_0 u||_{H^{1/2}(partial Omega)} <= C ||u||_{H^1(Omega)}", "乘法迹不等式：||u||_{L^2(partial Omega)}^2 <= C ||u||_{L^2(Omega)} ||u||_{H^1(Omega)}", "Green 公式：int_Omega (Delta u) v + int_Omega grad u . grad v = int_{partial Omega} (partial_n u) v dS", "对偶配对：<partial_n u, gamma_0 v>_{H^{-1/2}, H^{1/2}} 定义了 u in H^1 且 Delta u in L^2 时的法向迹"],
        theorems: ["迹定理：Omega 有界 Lipschitz 时 gamma_0 : H^1 -> H^{1/2} 有界满射且有连续右逆（提升算子）", "核刻画：ker gamma_0 = H_0^1(Omega)", "迹映射一般不落在 H^1(partial Omega)，恰好损失半阶；因此 H^1 函数的边界值不必连续", "Neumann 问题相容性：纯 Neumann 的 Laplace 问题可解当且仅当 int_Omega f + int_{partial Omega} g dS = 0，解在相差常数意义下唯一"],
        generalRequirements: ["使用边界值必须先确认迹有定义，并写出其所属分数阶空间", "Dirichlet 条件必须通过解空间或提升实现，Neumann 与 Robin 条件必须出现在弱形式边界项中", "使用 Green 公式必须核验正则性足以让边界项有意义，否则改写为对偶配对", "纯 Neumann 问题必须先核验相容性条件并说明解的常数不唯一性"],
        forbiddenErrors: ["【逐点取值】对 H^1 函数（n >= 2）断言边界逐点连续取值", "【空间错标】把迹写在 H^1(partial Omega) 而非 H^{1/2}(partial Omega)", "【相容性缺失】不检验积分相容条件就断言纯 Neumann 问题唯一可解", "【边界项越界】在 u 仅属 H^1 时直接写出 int partial_n u v 而不用对偶配对", "【边界正则性忽视】在只有 Lipschitz 甚至更差的边界上使用光滑边界结论"],
        parameterConstraints: { boundaryRegularity: "partial Omega 需 Lipschitz（部分结论需 C^1 或 C^{1,1}）", sobolevIndexForTrace: "gamma_0 需 s > 1/2 才有界，s = 1/2 时迹一般无定义", measureZeroSetIrrelevance: "迹是面测度意义下的等价类，不可逐点解释", compatibilityCondition: "纯 Neumann 需 int f + int g dS = 0" },
        closureChecks: ["核验所构造提升函数的迹与给定边界数据一致", "核验弱形式中边界项与所设边界条件逐项对应", "核验迹不等式常数只依赖 Omega 与维数", "对纯 Neumann 情形核验相容性并归一化常数（如令平均值为零）"],
        scenarioChecks: { dirichletProblem: ["核验数据 g in H^{1/2}(partial Omega)", "构造提升并化为齐次问题"], neumannOrRobinProblem: ["把边界项写入弱形式", "Robin 情形核验系数符号保证强制性"], mixedRegularityBoundary: ["核验边界 Lipschitz 性", "在角点处降级使用可用的正则性结论"] },
    },
    // 波前集与奇性沿特征的传播。
    "distribution-wavefront-set-propagation": {
        definitions: ["波前集 WF(u) subset (Omega × (R^n 去零向量)) 记录奇性的位置与频率方向，其在底空间的投影为 sing supp u", "特征集 Char(P) = { (x, xi) : p_m(x, xi) = 0，xi 不为零 }，由主符号零点构成", "H^s 波前集 WF^s(u)：按 Sobolev 阶细化的奇性方向集合", "零次比刻画：(x_0, xi_0) 不属于 WF(u) 当且仅当存在锥邻域内 u 的局部 Fourier 变换快速衰减"],
        formulas: ["投影关系：pi(WF(u)) = sing supp u", "微局部椭圆正则性：WF(u) subset WF(P u) union Char(P)", "拟微分算子作用：WF(A u) subset WF(u)（A 为拟微分算子，具拟局部性）", "Hamilton 流：dx/dt = partial_xi p_m，dxi/dt = -partial_x p_m，其积分曲线即零次特征带（bicharacteristic）"],
        theorems: ["Hormander 奇性传播定理：P u = f 时 WF(u) 去掉 WF(f) 的部分在 Char(P) 内沿零次特征带不变", "微局部椭圆性：在 P 椭圆的方向上不产生奇性，故椭圆算子解的奇性完全由右端决定", "波方程奇性沿光锥传播；奇异支集随时间按特征速度移动，可解释几何光学与反射", "波前集是锥集合且闭：(x, xi) in WF(u) 蕴含 (x, t xi) in WF(u)（t > 0）"],
        generalRequirements: ["断言奇性传播必须先写出主符号并求出特征集与零次特征带方程", "必须区分奇异支集（位置信息）与波前集（位置加方向信息）", "使用微局部估计必须说明所取锥邻域与截断，不得只作局部截断", "结论必须限定在方程右端光滑的区域，右端自身奇性会注入新的波前集"],
        forbiddenErrors: ["【方向丢失】用奇异支集代替波前集从而漏掉方向信息与传播结论", "【椭圆越界】对椭圆算子仍讨论沿特征传播（特征集为空故无传播）", "【锥性违背】给出的波前集不满足正倍数不变性", "【右端忽视】在右端不光滑的区域仍断言奇性只沿特征带传播", "【流方程错写】Hamilton 方程符号写错导致传播方向反转"],
        parameterConstraints: { symbolHomogeneity: "主符号 p_m(x, xi) 对 xi 齐次 m 次", nonvanishingFrequency: "波前集与特征集中 xi 不为零向量", conicNeighborhood: "微局部分析需在 xi 方向的开锥邻域内进行", principalTypeCondition: "沿特征传播的标准结论要求主型条件（p_m 与 dp_m 不同时退化）" },
        closureChecks: ["核验波前集的锥性与闭性", "核验其投影与奇异支集一致", "解 Hamilton 方程并核验特征带落在特征集内", "在椭圆方向核验局部 Fourier 变换的快速衰减"],
        scenarioChecks: { waveEquationSingularity: ["写出光锥特征带", "核验奇性按特征速度传播并处理反射方向"], ellipticEquation: ["核验特征集为空", "得出解在右端光滑处光滑"], microlocalRegularityEstimate: ["选取锥截断与拟微分算子", "核验 WF(u) subset WF(P u) union Char(P) 的逐项来源"] },
    },
};
