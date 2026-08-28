import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“微分方程-边值问题”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ODE_BOUNDARY_VALUE_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Sturm-Liouville 自共轭形式与特征值谱结构。
    "bvp-sturm-liouville-spectrum": {
        id: "bvp-sturm-liouville-spectrum", l2Key: "ode-boundary-value", name: "Sturm-Liouville 特征值问题", kind: "theorem",
        aliases: ["Sturm-Liouville", "自共轭形式", "特征值单重", "特征函数完备性"],
    },
    // Sturm 比较定理与零点振动性。
    "bvp-sturm-comparison-oscillation": {
        id: "bvp-sturm-comparison-oscillation", l2Key: "ode-boundary-value", name: "Sturm 比较定理与振动性", kind: "theorem",
        aliases: ["Sturm比较", "零点分离", "振动与非振动", "Prufer变换"],
    },
    // Green 函数的构造与对称性。
    "bvp-green-function-construction": {
        id: "bvp-green-function-construction", l2Key: "ode-boundary-value", name: "Green 函数的构造与性质", kind: "object",
        aliases: ["边值问题Green函数", "Green函数跳跃条件", "对称核", "解的积分表示"],
    },
    // 边值问题的 Fredholm 二择一与共振可解性。
    "bvp-fredholm-alternative-resonance": {
        id: "bvp-fredholm-alternative-resonance", l2Key: "ode-boundary-value", name: "Fredholm 二择一与共振可解条件", kind: "criterion",
        aliases: ["边值问题Fredholm二择一", "共振情形", "正交可解条件", "共轭齐次问题"],
    },
    // Rayleigh 商变分刻画与极小极大原理。
    "bvp-rayleigh-quotient-minimax": {
        id: "bvp-rayleigh-quotient-minimax", l2Key: "ode-boundary-value", name: "Rayleigh 商与极小极大原理", kind: "theorem",
        aliases: ["边值问题Rayleigh商", "Sturm-Liouville极小极大原理", "边值特征值变分刻画", "特征值单调性"],
    },
    // 特征值与特征函数的渐近分布。
    "bvp-eigenvalue-asymptotics": {
        id: "bvp-eigenvalue-asymptotics", l2Key: "ode-boundary-value", name: "特征值渐近分布与 WKB 估计", kind: "formula",
        aliases: ["特征值渐近", "WKB近似", "Weyl渐近律", "高阶特征函数振荡"],
    },
    // 奇异端点的 Weyl 极限点与极限圆分类。
    "bvp-weyl-limit-point-circle": {
        id: "bvp-weyl-limit-point-circle", l2Key: "ode-boundary-value", name: "Weyl 极限点与极限圆判别", kind: "criterion",
        aliases: ["极限点情形", "极限圆情形", "奇异端点", "自共轭扩张"],
    },
    // 打靶法与解的存在性归约。
    "bvp-shooting-method-existence": {
        id: "bvp-shooting-method-existence", l2Key: "ode-boundary-value", name: "打靶法与边值存在性归约", kind: "algorithm",
        aliases: ["打靶法", "初值参数连续性", "介值定理归约", "打靶函数单调性"],
    },
    // 二阶边值问题的极值原理与唯一性。
    "bvp-maximum-principle-uniqueness": {
        id: "bvp-maximum-principle-uniqueness", l2Key: "ode-boundary-value", name: "边值问题极值原理与唯一性", kind: "theorem",
        aliases: ["极值原理", "比较原理", "唯一性判据", "非负系数条件"],
    },
    // 非线性边值问题的上下解与单调迭代。
    "bvp-upper-lower-solution-method": {
        id: "bvp-upper-lower-solution-method", l2Key: "ode-boundary-value", name: "上下解方法与单调迭代", kind: "theorem",
        aliases: ["上解与下解", "单调迭代", "有序区间解", "Nagumo条件"],
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
export const ODE_BOUNDARY_VALUE_L3_RULES: Record<string, MathV2L3Rules> = {
    // Sturm-Liouville 自共轭形式与特征值谱结构。
    "bvp-sturm-liouville-spectrum": {
        definitions: ["正则 Sturm-Liouville 问题为 -(p u')' + q u = lambda w u 在 [a, b] 上配以分离边界条件 alpha_1 u(a) + alpha_2 p(a) u'(a) = 0 与 beta_1 u(b) + beta_2 p(b) u'(b) = 0", "正则性要求 p 在 [a, b] 上连续可微且 p > 0、q 与权 w 连续且 w > 0，端点非奇异", "算子 L u = (1/w)(-(p u')' + q u) 在加权空间 L^2([a, b], w dx) 中以定义域含边界条件的方式取自共轭"],
        formulas: ["Lagrange 恒等式 int_a^b (v L u - u L v) w dx = [p (u' v - u v')]_a^b", "特征函数加权正交 int_a^b u_m u_n w dx = 0 (m 不等于 n)", "任意二阶方程 A u'' + B u' + C u = 0 可乘积分因子化为自共轭形式，p = exp(int B/A dx)"],
        theorems: ["正则 Sturm-Liouville 问题的特征值全为实数、皆为单重，可排成 lambda_1 < lambda_2 < ... 且 lambda_n -> +无穷", "第 n 个特征函数在开区间 (a, b) 内恰有 n - 1 个零点，全部为单零点", "特征函数系在 L^2([a, b], w dx) 中构成完备正交基，展开在分段光滑函数处逐点收敛，若配合边界条件相容则一致收敛"],
        generalRequirements: ["先验证方程已化为自共轭形式并写清 p、q、w，再谈特征值实性与正交性", "正交性必须带权 w，权被漏掉时正交关系一般不成立", "给出特征值序列时需说明其可数、无上界与单重性依赖正则性假设"],
        forbiddenErrors: ["【自共轭】未化为自共轭形式即断言特征值为实、特征函数正交", "【权函数】把加权正交 int u_m u_n w dx = 0 误写为无权正交", "【重数】断言一般自共轭问题特征值必单重，忽略周期边界条件下可出现二重特征值", "【完备性】把完备性等同于逐点收敛，忽略收敛方式与光滑性前提", "【奇异性】把奇异端点问题直接套用正则问题的谱结论"],
        parameterConstraints: { coefficientPositivity: "p > 0 与 w > 0 在闭区间上成立，否则退化为奇异或非定问题", boundaryCoefficients: "分离边界条件中 (alpha_1, alpha_2) 与 (beta_1, beta_2) 均不能同时为零", selfAdjointDomain: "定义域须使 [p (u' v - u v')]_a^b = 0 对所有定义域内函数成立" },
        closureChecks: ["检查所写边界条件是否使 Lagrange 边界项消失", "检查特征值排序与特征函数零点个数是否一致", "检查展开系数是否按加权内积 c_n = int f u_n w dx / int u_n^2 w dx 计算"],
        scenarioChecks: { regularProblemSpectrum: ["确认 p、w 正性与端点正则", "写出特征值单重递增结论", "标注零点计数"], eigenfunctionExpansion: ["按加权内积求系数", "说明收敛方式", "检查边界相容性"], periodicBoundaryCondition: ["改用周期条件 u(a) = u(b)、p u'(a) = p u'(b)", "允许二重特征值", "重新核对正交组的选取"] },
    },
    // Sturm 比较定理与零点振动性。
    "bvp-sturm-comparison-oscillation": {
        definitions: ["方程 (p u')' + q u = 0 称在 [a, 无穷) 上振动，若其任一非平凡解有无穷多零点，否则称非振动", "Prufer 变换取 p u' = r cos theta、u = r sin theta，把零点计数化为相角 theta 的单调增长", "分离零点指两个线性无关解的零点在区间上互相交错"],
        formulas: ["Prufer 相角方程 theta' = (1/p) cos^2 theta + q sin^2 theta", "Euler 方程 u'' + (k/x^2) u = 0 的振动临界值为 k = 1/4", "Sturm 分离下相邻零点间距由比较方程 u'' + M u = 0 控制，间距不超过 pi / sqrt(M)"],
        theorems: ["Sturm 比较定理：若 q_2 >= q_1 且 p_2 <= p_1，则在 (p_1 u')' + q_1 u = 0 的任意两个相邻零点之间，(p_2 v')' + q_2 v = 0 的每个解至少有一个零点", "Sturm 分离定理：同一方程两个线性无关解的零点严格交错，且零点均为单零点", "Kneser 判据：u'' + q(x) u = 0 在 lim inf x^2 q(x) > 1/4 时振动，在 lim sup x^2 q(x) < 1/4 时非振动"],
        generalRequirements: ["使用比较定理前必须同时核对 q 的不等号方向与 p 的反向不等号方向", "断言振动性时须明确所考察区间是有限区间还是无穷区间", "零点计数论证优先用 Prufer 相角单调性而非直接作图"],
        forbiddenErrors: ["【比较方向】把 q_2 >= q_1 的结论方向反用，得出系数变大解反而零点变少", "【系数遗漏】只比较 q 而忽略 p 的方向要求", "【零点重数】允许非平凡解出现二重零点，与解的唯一性矛盾", "【临界值】把 u'' + (k/x^2) u = 0 的振动临界值误取为 k = 1", "【区间混淆】把有限区间上零点有限直接等同于非振动"],
        parameterConstraints: { comparisonHypothesis: "要求 p_2 <= p_1 且 q_2 >= q_1 在整个所比较区间上成立", positivityOfP: "p > 0 保证 Prufer 变换与相角单调性有效", intervalType: "无穷区间振动性结论需在 x -> 无穷 的极限意义下陈述" },
        closureChecks: ["检查两方程的系数不等式是否在同一区间同时成立", "检查所得零点个数与相角增量 theta(b) - theta(a) 是否相容", "检查振动判据所用临界常数 1/4 是否写对"],
        scenarioChecks: { comparisonOfTwoEquations: ["核对 p 与 q 的双重不等式", "指出被比较解的零点区间", "给出至少一个零点的结论"], oscillationAtInfinity: ["计算 lim inf x^2 q(x)", "与 1/4 比较", "说明临界情形需更精细判据"], zeroCountingForEigenfunction: ["用 Prufer 相角计数", "说明零点为单零点", "与特征值序号对应"] },
    },
    // Green 函数的构造与对称性。
    "bvp-green-function-construction": {
        definitions: ["Green 函数 G(x, s) 是满足 L G = delta(x - s)、对 x 满足齐次边界条件的核，使 u(x) = int_a^b G(x, s) f(s) ds 解 L u = f", "对二阶算子 L u = -(p u')' + q u，G 在 x = s 处连续而其一阶导数有规定跳跃", "广义 Green 函数用于齐次问题有非平凡解的情形，需在核中扣除零空间方向"],
        formulas: ["G(x, s) = u_1(min(x, s)) u_2(max(x, s)) / (p(s) W(s))，其中 u_1、u_2 分别满足左、右端齐次条件，W 为 Wronskian", "跳跃条件 p(s)[partial_x G(s^+, s) - partial_x G(s^-, s)] = -1", "Wronskian 的 Abel 公式给出 p(s) W(s) = 常数，故构造中的分母与 s 无关", "谱表示 G(x, s) = sum_n u_n(x) u_n(s) / (lambda_n int u_n^2 w dx)"],
        theorems: ["若齐次问题只有零解，则 Green 函数存在唯一，且由自共轭性得对称性 G(x, s) = G(s, x)", "由 Green 函数给出的积分算子在 L^2 上是紧的自共轭算子，其特征值为 1/lambda_n，故 Sturm-Liouville 谱离散", "非自共轭边值问题的 Green 函数与共轭问题的 Green 函数满足 G^*(x, s) = G(s, x) 而一般不对称"],
        generalRequirements: ["构造前必须先确认齐次问题只有零解，否则改用广义 Green 函数并写出可解性条件", "必须写清跳跃条件所用符号约定与算子前的正负号约定是否一致", "写出解的积分表示后需回代验证边界条件"],
        forbiddenErrors: ["【跳跃符号】跳跃条件正负号与算子中 -(p u')' 的符号约定不匹配", "【存在性】齐次问题有非平凡解时仍强行构造普通 Green 函数", "【对称性】对非自共轭问题断言 G(x, s) = G(s, x)", "【Wronskian】把 W(s) 当作变量却又约掉，或漏掉因子 p(s)", "【边界条件】选取的 u_1、u_2 未分别满足左端与右端齐次条件"],
        parameterConstraints: { homogeneousTriviality: "普通 Green 函数存在的充要条件是齐次边值问题仅有零解", signConvention: "跳跃量的符号由 L 中二阶项的符号唯一确定，须全程统一", regularity: "p 连续可微且 p > 0，f 至少可积以保证积分表示有意义" },
        closureChecks: ["检查 G 在 x = s 连续、导数跳跃为规定值", "检查 u(x) = int G f ds 是否满足两端齐次边界条件", "检查谱表示中是否出现 lambda_n = 0 导致的发散"],
        scenarioChecks: { constructGreenFunction: ["验证齐次问题只有零解", "取满足单侧条件的解并计算 p W", "写出分段表达式并核对跳跃"], generalizedGreenFunction: ["写出零空间与可解性正交条件", "在核中扣除零空间投影", "说明解在加常数方向上不唯一"], spectralRepresentation: ["核对加权正交归一化", "写出 1/lambda_n 的收敛性", "指出零特征值需单独处理"] },
    },
    // 边值问题的 Fredholm 二择一与共振可解性。
    "bvp-fredholm-alternative-resonance": {
        definitions: ["共振指齐次边值问题 L u = 0 配以给定齐次边界条件存在非平凡解，此时 lambda = 0 属于谱", "共轭问题由 Lagrange 恒等式的边界项消失条件确定，自共轭情形下与原问题一致", "非齐次边界条件可通过减去一个满足边界条件的函数化归为齐次边界条件加修正右端"],
        formulas: ["自共轭情形可解条件 int_a^b f v w dx = 0 对齐次问题的每个解 v 成立", "带非齐次边界数据的相容条件为 int_a^b f v w dx = [p (u' v - u v')]_a^b 由已知边界数据算出", "共振时通解为 u = u_p + sum c_i v_i，自由参数个数等于零空间维数"],
        theorems: ["Fredholm 二择一：非共振时 L u = f 对任意 f 唯一可解；共振时可解当且仅当 f 与共轭齐次问题的全部解正交，此时解不唯一", "自共轭边值问题的零空间与共轭零空间维数相同，因此可解性条件个数等于自由参数个数", "对紧自共轭积分算子，二择一表述等价于 L^2 分解为零空间与其正交补上的可逆部分"],
        generalRequirements: ["先判断是否共振，再决定是套唯一可解结论还是写正交可解条件", "正交条件必须对零空间的一组完整基逐个验证，且带权 w", "非齐次边界条件必须先归化或直接进入相容性等式的右端"],
        forbiddenErrors: ["【共振判断】未检验齐次问题是否有非平凡解就断言唯一可解", "【条件遗漏】零空间维数大于一时只验证一个正交条件", "【权与边界项】正交条件中漏掉权 w 或漏掉非齐次边界带来的边界项", "【共轭问题】非自共轭情形直接用原齐次解代替共轭齐次解做正交", "【唯一性】共振可解时仍声称解唯一"],
        parameterConstraints: { resonanceCheck: "需明确指出使齐次问题有非平凡解的参数值，例如 lambda 取到特征值", orthogonalityBasis: "正交条件对零空间的每个基元素成立，条件个数等于零空间维数", boundaryDataConsistency: "非齐次边界数据必须与所写相容性等式的边界项一致" },
        closureChecks: ["检查是否分别处理了共振与非共振两种情形", "检查可解性条件个数与解的自由参数个数是否一致", "检查特解加通解的表达式是否满足全部边界条件"],
        scenarioChecks: { nonResonantSolvability: ["验证齐次问题只有零解", "用 Green 函数写出唯一解", "核对边界条件"], resonantSolvability: ["求出零空间基", "逐个写出加权正交条件", "给出含自由参数的通解"], nonhomogeneousBoundaryData: ["归化为齐次边界条件", "把边界项计入相容性等式", "重新判断可解性"] },
    },
    // Rayleigh 商变分刻画与极小极大原理。
    "bvp-rayleigh-quotient-minimax": {
        definitions: ["Rayleigh 商 R[u] = (int_a^b (p u'^2 + q u^2) dx + 边界贡献) / int_a^b u^2 w dx，定义在满足本质边界条件的试验函数类上", "试验函数类为 H^1 中满足 Dirichlet 型条件的子空间，Neumann 与 Robin 条件作为自然边界条件进入泛函", "第 n 个特征值的极小极大刻画在所有 n 维子空间上取上确界的极小"],
        formulas: ["lambda_1 = min R[u] 取遍非零允许试验函数，极小由第一特征函数达到", "Courant-Fischer 刻画 lambda_n = min_{dim V = n} max_{u in V 去零} R[u]", "Robin 条件下 R[u] 含边界项 (sigma_b u(b)^2 + sigma_a u(a)^2) / int u^2 w dx"],
        theorems: ["Rayleigh 商在允许类上的极小值等于 lambda_1，且极小点恰为第一特征函数，第一特征函数可取为不变号", "特征值对区域单调：缩小区间并加 Dirichlet 条件使每个 lambda_n 不减；对 q 与权也单调，q 增大使 lambda_n 增大，w 增大使 lambda_n 减小", "Dirichlet 与 Neumann 特征值交错，Dirichlet 特征值不低于同序号 Neumann 特征值"],
        generalRequirements: ["用 Rayleigh 商估计特征值时必须说明试验函数落在允许类中且满足本质边界条件", "任何具体试验函数只给出 lambda_1 的上界，下界必须另用比较或单调性论证", "自然边界条件的边界项不得随意丢弃"],
        forbiddenErrors: ["【上下界方向】把单个试验函数算出的 R[u] 当作 lambda_1 的精确值或下界", "【边界项】Robin 或 Neumann 情形漏掉 Rayleigh 商中的边界贡献", "【权函数】分母漏掉权 w 或误用无权 L^2 范数", "【单调方向】把 q 增大误判为特征值减小", "【试验函数】使用不满足 Dirichlet 条件的试验函数仍套用极小刻画"],
        parameterConstraints: { admissibleClass: "试验函数须属于 H^1 且满足本质边界条件，分母不为零", positivity: "p > 0 与 w > 0 保证 Rayleigh 商有下界且极小可达", monotonicityHypothesis: "区域单调性结论只对 Dirichlet 型条件成立，Neumann 情形不成立" },
        closureChecks: ["检查 Rayleigh 商中是否包含全部边界项", "检查所得数值是上界还是下界", "检查试验函数是否与低阶特征函数正交以估计高阶特征值"],
        scenarioChecks: { estimateFirstEigenvalue: ["选取满足本质条件的试验函数", "计算 R[u]", "明确结论为上界"], higherEigenvalueEstimate: ["构造 n 维试验子空间", "在子空间上取最大值", "用 Courant-Fischer 得上界"], comparisonAcrossBoundaryConditions: ["写出两组条件的允许类包含关系", "由包含关系推特征值不等式", "标注结论方向"] },
    },
    // 特征值与特征函数的渐近分布。
    "bvp-eigenvalue-asymptotics": {
        definitions: ["特征值渐近律描述 lambda_n 随 n -> 无穷 的主项行为", "WKB 近似在大特征值下把解写成快速振荡的指数形式，振幅由输运方程确定", "转向点是使经典动量为零的点，在其邻域 WKB 展开失效需衔接 Airy 型近似"],
        formulas: ["-u'' + q u = lambda u 配 Dirichlet 条件在 [0, L] 上有 sqrt(lambda_n) = n pi / L + O(1/n)", "一般 Sturm-Liouville 的 Weyl 型渐近 sqrt(lambda_n) ~ n pi / int_a^b sqrt(w/p) dx", "WKB 解 u ~ (p k)^{-1/2} exp(±i int k dx)，k = sqrt((lambda w - q)/p)", "量子化条件 int_a^b sqrt((lambda_n w - q)/p) dx = n pi + O(1) 由相位积分给出"],
        theorems: ["正则 Sturm-Liouville 问题的特征值计数函数满足 N(lambda) = (sqrt(lambda)/pi) int_a^b sqrt(w/p) dx + O(1)", "边界条件类型只影响渐近式的常数项，不改变主项系数", "高阶特征函数在 WKB 区域内以振幅 (p k)^{-1/2} 振荡，零点密度与局部波数 k 成正比"],
        generalRequirements: ["写渐近式必须给出主项与误差阶，不能只写主项而不说明 O 项", "使用 WKB 时须指出适用区域并排除转向点邻域", "相位积分的被积函数须与自共轭形式中的 p、q、w 一致"],
        forbiddenErrors: ["【主项系数】把一般 Sturm-Liouville 的渐近主项直接取为 n pi / (b - a) 而忽略 sqrt(w/p) 的积分", "【转向点】在 lambda w - q 变号处仍使用 WKB 主项", "【误差阶】把渐近式当作精确等式反解特征值", "【边界依赖】声称边界条件改变会改变渐近主项系数", "【平方混淆】把 lambda_n 的渐近与 sqrt(lambda_n) 的渐近互相混用"],
        parameterConstraints: { largeIndexRegime: "渐近结论仅在 n 充分大时有效，小序号特征值须直接计算", turningPointExclusion: "WKB 有效性要求 lambda w - q > 0 且波长远小于系数变化尺度", regularity: "系数需足够光滑以保证输运方程可解并给出 O(1) 误差" },
        closureChecks: ["检查主项中的积分 int sqrt(w/p) dx 是否收敛", "检查渐近式量纲与特征值定义是否一致", "检查零点计数是否与 n - 1 相容"],
        scenarioChecks: { asymptoticFormulaDerivation: ["化为自共轭形式", "写相位积分量子化条件", "给出主项与误差阶"], wkbApproximation: ["确定波数 k 的表达式", "排除转向点邻域", "写振幅因子"], turningPointAnalysis: ["定位 lambda w = q 的点", "改用 Airy 型近似", "做内外解衔接"] },
    },
    // 奇异端点的 Weyl 极限点与极限圆分类。
    "bvp-weyl-limit-point-circle": {
        definitions: ["端点奇异指该端点处 p 趋于零、系数不可积或区间无界，使正则理论不适用", "极限点情形指对某个非实 lambda，方程在该端点附近只有一维解空间平方可积；极限圆情形指全部解都平方可积", "在极限圆情形需在端点补加边界条件才能确定自共轭算子"],
        formulas: ["平方可积性按加权范数 int^b |u|^2 w dx < 无穷 判定", "Weyl 圆的极限半径为零对应极限点，半径为正对应极限圆", "判别式常用 int^b (1/p) dx 与 int^b w dx 的收敛性组合"],
        theorems: ["Weyl 二择一：极限点或极限圆的分类只依赖端点与方程，不依赖所取的非实 lambda", "极限点情形下自共轭扩张唯一，无需在该端点补加边界条件；极限圆情形自共轭扩张构成一参数族", "两端均为极限圆时自共轭扩张需两个衔接条件，扩张族由二维边界空间描述"],
        generalRequirements: ["判定奇异端点前先明确奇异性来源是系数退化还是区间无界", "分类结论须写清是极限点还是极限圆，并据此说明是否补加端点条件", "在极限圆情形所补条件必须使 Lagrange 边界项消失"],
        forbiddenErrors: ["【正则套用】对奇异端点直接套用正则问题的特征值单重与完备性结论", "【补条件】极限点情形仍在奇异端点强加边界条件", "【唯一性】极限圆情形声称自共轭扩张唯一", "【依赖性】认为分类结果随所取 lambda 变化", "【谱结构】断言奇异问题谱必离散，忽略可能出现连续谱"],
        parameterConstraints: { squareIntegrabilityWeight: "平方可积性必须按权 w 判定，不能用无权积分", nonrealSpectralParameter: "分类判定使用 Im lambda 不等于 0 的谱参数", selfAdjointExtension: "极限圆端点所补条件的参数化需保证实性与边界项消失" },
        closureChecks: ["检查两端点分别属于哪一类", "检查自共轭扩张所需条件个数与极限圆端点个数一致", "检查谱是否可能含连续部分"],
        scenarioChecks: { classifyEndpoint: ["写出端点附近解的渐近行为", "检验加权平方可积性", "给出极限点或极限圆结论"], constructSelfAdjointExtension: ["统计极限圆端点数", "补加使边界项消失的条件", "参数化扩张族"], spectrumTypeDiscussion: ["区分离散谱与连续谱", "说明极限点情形下谱由方程本身决定", "避免直接套用完备正交基结论"] },
    },
    // 打靶法与解的存在性归约。
    "bvp-shooting-method-existence": {
        definitions: ["打靶法把两点边值问题 u'' = f(x, u, u')、u(a) = A、u(b) = B 转化为初值问题 u(a) = A、u'(a) = s 并调节参数 s", "打靶函数定义为 Phi(s) = u(b; s) - B，其零点对应边值问题的解", "打靶法可解性依赖初值问题解在 [a, b] 上不发生爆破"],
        formulas: ["Phi(s) = u(b; s) - B，求解归约为 Phi(s) = 0", "导数 Phi'(s) = y(b) 由变分方程 y'' = f_u y + f_{u'} y'、y(a) = 0、y'(a) = 1 给出", "Newton 迭代 s_{k+1} = s_k - Phi(s_k) / Phi'(s_k)"],
        theorems: ["若 f 连续且解对参数连续依赖、且存在 s_- 与 s_+ 使 Phi(s_-) < 0 < Phi(s_+)，则由介值定理存在解", "若 Phi 严格单调（例如 f_u >= 0 保证变分方程解正性），则边值问题解唯一", "打靶法可行性要求所有相关参数下解在整个 [a, b] 上存在，Nagumo 型条件用于排除导数爆破"],
        generalRequirements: ["使用介值定理前必须验证 Phi 在参数区间上连续，即解对初值连续依赖且不爆破", "唯一性结论必须由 Phi 的严格单调性给出，不能由存在性直接推得", "变分方程必须与原方程线性化一致"],
        forbiddenErrors: ["【爆破】忽略初值问题解可能在到达 b 前爆破而直接用介值定理", "【连续性】未验证 Phi 连续即断言零点存在", "【唯一性】把存在性论证当作唯一性论证", "【线性化】变分方程漏掉 f_{u'} y 项", "【符号】打靶函数两端符号未真正确定就宣称变号"],
        parameterConstraints: { globalExistenceOnInterval: "对所考察的每个 s，初值问题解须在 [a, b] 上整体存在", nagumoCondition: "需要 f 关于 u' 的增长不超过 Nagumo 条件允许的量级以获得导数先验界", monotonicityForUniqueness: "唯一性通常要求 f_u >= 0 使变分方程解保持正号" },
        closureChecks: ["检查是否给出使 Phi 变号的两个具体参数值", "检查解在整个区间存在的先验界论证", "检查数值迭代的收敛判据与初值选取"],
        scenarioChecks: { existenceByIntermediateValue: ["构造两个符号相反的打靶值", "论证 Phi 连续", "得出零点存在"], uniquenessDiscussion: ["写出变分方程", "论证 Phi 严格单调", "给出唯一性"], numericalShooting: ["写出 Newton 迭代与 Phi' 的计算", "说明步长与容差", "检查解未爆破"] },
    },
    // 二阶边值问题的极值原理与唯一性。
    "bvp-maximum-principle-uniqueness": {
        definitions: ["考虑算子 L u = u'' + b(x) u' - c(x) u，其中 c >= 0，极值原理断言解的极值出现在端点", "强极值原理指内部取到与端点相同极值时解必为常数", "算子的反号性质给出比较原理：L u >= L v 且边界上 u <= v 蕴含区间内 u <= v"],
        formulas: ["若 L u >= 0 且 c >= 0，则 max_{[a, b]} u <= max(0, max(u(a), u(b)))", "先验界 max |u| <= max(|u(a)|, |u(b)|) + C max |L u|，常数 C 依赖区间长度与系数界", "线性化差 w = u - v 满足 L w >= 0 与 w 在端点非正，故 w <= 0"],
        theorems: ["弱极值原理：c >= 0 且 L u >= 0 时 u 的非负最大值只能在端点达到", "强极值原理（Hopf 型）：若内部点达到非负最大值则 u 在整个区间为常数，且端点处外法向导数严格为正", "唯一性：c >= 0 时 Dirichlet 问题的解唯一，比较原理同时给出解对边界数据与右端的单调依赖"],
        generalRequirements: ["使用极值原理前必须核对系数符号条件 c >= 0 与算子中各项符号约定", "唯一性论证应通过对差函数应用极值原理而非直接凑 Green 函数", "结论涉及非负最大值时须区分弱形式与强形式"],
        forbiddenErrors: ["【符号条件】在 c < 0 的情形直接套用极值原理，忽略此时可能出现内部极值与非唯一", "【算子形式】把 L u = u'' - c u 与 L u = -u'' + c u 的不等号方向混用", "【弱强混淆】用弱极值原理直接推出内部严格不等式", "【端点导数】忽略 Hopf 引理对边界导数严格性的要求", "【非线性】把线性极值原理直接套到未做单调性检验的非线性方程"],
        parameterConstraints: { signCondition: "要求 c(x) >= 0，若 c 变负需借助第一特征值条件 lambda_1 > 0", coefficientRegularity: "b 与 c 至少连续以保证解的 C^2 正则与极值论证", boundaryComparison: "比较原理要求两端点边界数据均满足对应不等式" },
        closureChecks: ["检查 c >= 0 是否在整个区间成立", "检查差函数在两端点的符号是否都被验证", "检查是否需要强极值原理才能得到严格不等式"],
        scenarioChecks: { uniquenessProof: ["构造差函数", "验证 c >= 0 与端点符号", "由极值原理得差恒为零"], comparisonEstimate: ["写出上界函数", "验证微分不等式方向", "在端点比较边界数据"], signChangingLowerOrderTerm: ["改用第一特征值正性条件", "或做变换消去负项", "说明标准极值原理不适用"] },
    },
    // 非线性边值问题的上下解与单调迭代。
    "bvp-upper-lower-solution-method": {
        definitions: ["下解 alpha 满足 alpha'' + f(x, alpha) >= 0 与边界条件不超过给定数据，上解 beta 满足反向不等式", "有序对要求 alpha <= beta 于整个区间，解落在有序区间 [alpha, beta] 内", "Nagumo 条件限制 f 关于 u' 的增长，用于导出导数的先验界"],
        formulas: ["单调迭代 u_{k+1}'' - M u_{k+1} = -f(x, u_k) - M u_k，其中 M >= max |partial_u f| 于有序区间上", "迭代自 u_0 = alpha 出发单调递增收敛到最小解，自 u_0 = beta 出发单调递减收敛到最大解", "Nagumo 型界 |u'| <= N 由 int_0^N (s / h(s)) ds > max beta - min alpha 决定，其中 |f| <= h(|u'|)"],
        theorems: ["若存在有序上下解且 f 连续，则边值问题在 [alpha, beta] 内至少有一个解，并存在最小解与最大解", "在 M 取足够大时线性化迭代算子满足极值原理，迭代序列单调且一致收敛", "对含 u' 的非线性项，需附加 Nagumo 条件才能保证解族的导数一致有界从而取极限"],
        generalRequirements: ["必须显式给出并验证上解与下解的微分不等式与边界不等式", "必须验证有序性 alpha <= beta，顺序颠倒会使方法失效", "含 u' 的方程必须检验 Nagumo 条件"],
        forbiddenErrors: ["【顺序错误】把上下解顺序写反仍宣称解存在", "【不等式方向】下解与上解的微分不等式方向互换", "【边界条件】只验证微分不等式而不验证端点上的不等式", "【导数界】f 依赖 u' 时省略 Nagumo 条件直接取极限", "【唯一性】由上下解方法直接断言解唯一，忽略有序区间内可能存在多解"],
        parameterConstraints: { orderedPair: "要求 alpha(x) <= beta(x) 于闭区间上处处成立", monotonicityShift: "迭代常数 M 须不小于 f 关于 u 的偏导在有序区间上的模的上界", nagumoGrowth: "f 关于 u' 的增长不超过二次量级的 Nagumo 允许范围" },
        closureChecks: ["检查上下解在端点的不等式方向", "检查迭代序列是否保持在有序区间内", "检查是否给出最小解与最大解的存在性而非仅一个解"],
        scenarioChecks: { constructUpperLowerSolutions: ["取常数或简单函数试作上下解", "验证微分与边界不等式", "验证有序性"], monotoneIteration: ["选取足够大的 M", "验证线性化问题的极值原理", "论证单调收敛"], gradientDependentNonlinearity: ["检验 Nagumo 条件", "导出导数一致界", "用紧性取收敛子列"] },
    },
};
