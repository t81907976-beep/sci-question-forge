import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“动力系统-混沌与分岔”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const DYNAMICAL_CHAOS_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 鞍结分岔的标准型与横截条件。
    "chaos-saddle-node-normal-form": {
        id: "chaos-saddle-node-normal-form", l2Key: "dynamical-chaos", name: "鞍结分岔标准型与横截条件", kind: "theorem",
        aliases: ["鞍结分岔", "标准型", "横截性条件", "折叠分岔"],
    },
    // Hopf 分岔判据与第一 Lyapunov 系数。
    "chaos-hopf-bifurcation-criterion": {
        id: "chaos-hopf-bifurcation-criterion", l2Key: "dynamical-chaos", name: "Hopf 分岔判据与临界性判别", kind: "criterion",
        aliases: ["Hopf分岔", "第一Lyapunov系数", "超临界与亚临界", "特征值穿越"],
    },
    // 中心流形归约与标准型化简。
    "chaos-center-manifold-reduction": {
        id: "chaos-center-manifold-reduction", l2Key: "dynamical-chaos", name: "中心流形归约与标准型化简", kind: "algorithm",
        aliases: ["中心流形归约", "共振项", "标准型变换", "退化维数"],
    },
    // 倍周期分岔与 Feigenbaum 普适性。
    "chaos-period-doubling-feigenbaum": {
        id: "chaos-period-doubling-feigenbaum", l2Key: "dynamical-chaos", name: "倍周期分岔与 Feigenbaum 常数", kind: "theorem",
        aliases: ["倍周期分岔", "Feigenbaum常数", "分岔级联", "普适性"],
    },
    // Sharkovskii 序与三周期蕴含混沌。
    "chaos-sharkovskii-period-three": {
        id: "chaos-sharkovskii-period-three", l2Key: "dynamical-chaos", name: "Sharkovskii 序与三周期定理", kind: "theorem",
        aliases: ["Sharkovskii序", "三周期蕴含混沌", "周期集结构", "区间映射"],
    },
    // 符号动力系统与移位共轭。
    "chaos-symbolic-dynamics-shift-conjugacy": {
        id: "chaos-symbolic-dynamics-shift-conjugacy", l2Key: "dynamical-chaos", name: "符号动力系统与移位共轭", kind: "object",
        aliases: ["符号动力系统", "移位映射", "拓扑共轭", "符号动力学转移矩阵"],
    },
    // Smale 马蹄与横截同宿点。
    "chaos-smale-horseshoe-homoclinic": {
        id: "chaos-smale-horseshoe-homoclinic", l2Key: "dynamical-chaos", name: "Smale 马蹄与横截同宿定理", kind: "theorem",
        aliases: ["Smale马蹄", "横截同宿点", "Smale-Birkhoff定理", "不变Cantor集"],
    },
    // Melnikov 函数与同宿轨断裂判据。
    "chaos-melnikov-criterion": {
        id: "chaos-melnikov-criterion", l2Key: "dynamical-chaos", name: "Melnikov 判据", kind: "criterion",
        aliases: ["Melnikov函数", "同宿轨横截相交", "周期扰动", "简单零点"],
    },
    // Lyapunov 指数与 Oseledets 定理。
    "chaos-lyapunov-exponent-oseledets": {
        id: "chaos-lyapunov-exponent-oseledets", l2Key: "dynamical-chaos", name: "Lyapunov 指数与 Oseledets 定理", kind: "object",
        aliases: ["Lyapunov指数", "Oseledets定理", "乘性遍历定理", "Lyapunov谱"],
    },
    // 拓扑熵与 Devaney 混沌定义。
    "chaos-topological-entropy-devaney": {
        id: "chaos-topological-entropy-devaney", l2Key: "dynamical-chaos", name: "拓扑熵与 Devaney 混沌", kind: "object",
        aliases: ["拓扑熵", "Devaney混沌", "敏感依赖性", "稠密周期轨"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const DYNAMICAL_CHAOS_L3_RULES: Record<string, MathV2L3Rules> = {
    // 鞍结分岔标准型与横截条件。
    "chaos-saddle-node-normal-form": {
        definitions: ["单参数族 x' = f(x, mu)（x 属于 R^n）在 (x_0, mu_0) 处发生鞍结分岔，指线性化 D_x f(x_0, mu_0) 有单重零特征值、其余特征值实部非零，且平衡点随参数穿越时成对产生或成对消失。", "标准型指经过中心流形归约与光滑坐标变换后化为一维方程 y' = mu + a y^2 + O(y^3)（a 非零）的等价形式。"],
        formulas: ["一维标准型 y' = mu + a y^2，a > 0 时 mu < 0 有两平衡点 y = ±sqrt(-mu/a)、mu > 0 无平衡点。", "平衡点分支 y_±(mu) 满足 |y_±| ~ sqrt(|mu|/|a|)，即分岔处的半幂律标度。", "标准型系数 a = (1/2) <w, D_x^2 f (v, v)>，其中 v、w 分别是零特征值的右、左特征向量并归一化为 <w, v> = 1。"],
        theorems: ["鞍结分岔定理：设 f(x_0, mu_0) = 0，D_x f 有单重零特征值 v（左特征向量 w），若非退化条件 <w, D_x^2 f(v, v)> 非零与横截条件 <w, partial_mu f> 非零同时成立，则在 (x_0, mu_0) 附近存在光滑坐标变换与参数重标度把系统化为 y' = mu + a y^2 + O(y^3)。", "分支的稳定性：一维归约中 y_-(mu) 与 y_+(mu) 的线性化系数互为反号，故两支恰有一支渐近稳定、一支不稳定（在中心流形上）。", "映射情形的对应结论：离散系统 x -> g(x, mu) 在特征值恰为 1 且同样两条非退化条件成立时发生鞍结（折叠）分岔，标准型为 y -> y + mu + a y^2。"],
        generalRequirements: ["必须同时给出非退化条件（二阶项系数非零）与横截条件（对参数的导数非零），只写零特征值不构成鞍结分岔的判据。", "多维系统必须先说明中心流形归约的合法性（其余特征值实部非零），再写一维标准型。", "涉及离散系统必须区分特征值为 1（鞍结）与特征值为 -1（倍周期），不能混用同一临界条件。"],
        forbiddenErrors: ["【条件缺失】只验证 D_x f 有零特征值就断言鞍结分岔，忽略二阶非退化条件导致实际为跨临界或尖点分岔。", "【退化混淆】当 <w, D_x^2 f(v, v)> = 0 时仍套用 y' = mu + a y^2，正确结论应转向尖点或跨临界标准型。", "【横截性遗漏】忽略 <w, partial_mu f> 非零，导致参数方向不穿越分岔面而平衡点数量并不改变。", "【稳定性误判】称鞍结分岔的两条分支都稳定，或忽略中心流形外方向特征值的符号对整体稳定性的贡献。", "【标度错误】把平衡点分支写成 |mu| 的一次幂而非 sqrt(|mu|)。"],
        parameterConstraints: { quadraticCoefficient: "a = (1/2)<w, D_x^2 f(v, v)> 必须非零，否则不是鞍结分岔。", transversality: "<w, partial_mu f(x_0, mu_0)> 必须非零，保证参数横截穿越分岔面。", spectrumCondition: "D_x f(x_0, mu_0) 的零特征值必须单重，其余特征值实部严格非零。", smoothness: "f 至少 C^2（要求标准型高阶展开时提高到 C^3 以上）。" },
        closureChecks: ["检查零特征值单重性与其余谱的双曲性是否都已验证。", "检查非退化条件与横截条件的表达式是否用左特征向量做了正确投影。", "检查平衡点分支的存在区间（mu 与 a 符号的组合）是否与结论一致。", "检查两条分支的稳定性判定是否互为反号。"],
        scenarioChecks: { continuousSystem: ["零特征值单重", "其余特征值实部非零", "二阶非退化系数非零", "参数横截条件非零"], discreteMap: ["临界特征值等于 1 而非 -1", "标准型写为 y -> y + mu + a y^2", "不与倍周期分岔条件混用"], degenerateCase: ["二阶系数为零时改判尖点或跨临界", "必要时展开到三阶项", "说明高阶项对分支个数的影响"] },
    },
    // Hopf 分岔判据与临界性判别。
    "chaos-hopf-bifurcation-criterion": {
        definitions: ["Hopf 分岔指平衡点的线性化在临界参数处有一对纯虚共轭特征值 ±i omega（omega > 0）、其余特征值实部非零，参数穿越时该对特征值横截穿越虚轴，从而产生周期轨分支。", "第一 Lyapunov 系数 l_1 是中心流形上极坐标标准型 r' = d mu r + l_1 r^3 + O(r^5) 的三次项系数，其符号决定分岔的超临界或亚临界性质。"],
        formulas: ["极坐标标准型 r' = d mu r + l_1 r^3 + O(r^5)，theta' = omega + c mu + b r^2。", "周期轨振幅 r_* = sqrt(-d mu / l_1)，故振幅按 sqrt(|mu|) 增长、周期约为 2 pi / omega。", "横截性系数 d = Re(d lambda / d mu)|_{mu = 0}，其中 lambda(mu) 是穿越虚轴的特征值分支。"],
        theorems: ["Andronov-Hopf 定理：若线性化在 mu = 0 处有单重共轭纯虚特征值 ±i omega、其余特征值实部非零，且横截条件 Re(d lambda / d mu) 非零与非退化条件 l_1 非零成立，则存在唯一的单参数周期轨族，其振幅按 sqrt(|mu|) 标度。", "临界性判别：l_1 < 0 时分岔超临界，稳定极限环出现在平衡点失稳一侧；l_1 > 0 时亚临界，不稳定极限环出现在平衡点仍稳定的一侧并给出硬激发与滞后现象。", "平面系统的 l_1 计算公式：在 x' = -omega y + P(x,y)、y' = omega x + Q(x,y) 形式下可由 P、Q 的二阶与三阶偏导数组合显式给出 l_1，其符号不依赖所选的光滑坐标。"],
        generalRequirements: ["必须验证纯虚特征值的单重性与其余特征值的双曲性，再谈周期轨的存在。", "必须写出横截条件 Re(d lambda / d mu) 非零，仅指出某个参数值处存在纯虚特征值不足以断言分岔。", "断言极限环稳定与否必须依据 l_1 的符号，不能仅由数值轨道图直接下结论。"],
        forbiddenErrors: ["【判据不全】只由特征值存在纯虚对就宣称出现极限环，忽略横截条件与 l_1 非零。", "【临界性反向】把 l_1 < 0 说成亚临界或把 l_1 > 0 说成超临界，导致极限环出现在错误的参数侧。", "【退化情形】l_1 = 0 时仍用 r' = d mu r + l_1 r^3 判定，正确做法是计算第二 Lyapunov 系数并考虑 Bautin（广义 Hopf）分岔。", "【全局误推】把局部 Hopf 分岔给出的小振幅环等同于系统的全局吸引子或唯一极限环。", "【标度错误】把振幅写成与 mu 成正比而非与 sqrt(|mu|) 成正比。"],
        parameterConstraints: { eigenvaluePair: "临界处特征值必须是单重共轭纯虚对 ±i omega，omega > 0，且不存在 ±i k omega（k 为整数）的共振情形。", transversality: "Re(d lambda / d mu)|_{mu=0} 必须非零。", lyapunovCoefficient: "l_1 必须非零，符号决定超临界（l_1 < 0）或亚临界（l_1 > 0）。", smoothness: "向量场至少 C^3，以保证三次项系数有意义。" },
        closureChecks: ["检查纯虚特征值单重与其余谱双曲是否都验证。", "检查横截条件的导数是否对正确的参数分支求得。", "检查 l_1 的符号与极限环出现在哪一侧、稳定性如何是否自洽。", "检查振幅与周期的标度是否分别为 sqrt(|mu|) 与 2 pi / omega + O(mu)。"],
        scenarioChecks: { planarSystem: ["化为 x' = -omega y + P、y' = omega x + Q 形式", "用显式公式计算 l_1", "由 l_1 符号判定临界性"], higherDimension: ["先做中心流形归约到二维", "验证其余特征值实部非零", "在中心流形上计算 l_1"], degenerateHopf: ["l_1 = 0 时计算第二 Lyapunov 系数", "考虑 Bautin 分岔与两个极限环共存", "说明滞后区间的成因"] },
    },
    // 中心流形归约与标准型化简。
    "chaos-center-manifold-reduction": {
        definitions: ["中心流形指在非双曲平衡点附近与临界特征空间（特征值实部为零的广义特征空间）相切的局部不变流形 W^c，系统的分岔行为完全由其上的归约方程决定。", "标准型化简指用形式幂级数坐标变换逐阶消去归约方程中的非共振项，只保留共振单项式的过程。"],
        formulas: ["谱分解 R^n = E^s + E^c + E^u，归约方程 u' = B u + g(u, h(u))，其中图像 x_{s,u} = h(u) 满足 h(0) = 0、D h(0) = 0。", "共振条件：单项式 u^m e_j 在标准型中不可消去当且仅当 <m, lambda> = lambda_j，其中 lambda 是临界特征值组、m 是多重指标且 |m| >= 2。", "中心流形的图像由不变性方程 D h(u) [B u + g(u, h(u))] = A h(u) + G(u, h(u)) 逐阶求解得到。"],
        theorems: ["中心流形定理：若向量场 C^k（k >= 1）且平衡点的谱分解为 E^s + E^c + E^u，则存在局部 C^k 的不变流形 W^c 与 E^c 相切；W^c 一般不唯一，但其上的 Taylor 系数在任意有限阶都唯一确定。", "归约原理：平衡点附近的局部拓扑等价类由中心流形上的归约方程与稳定、不稳定方向的标准鞍点结构的乘积给出，故分岔分析可只在 W^c 上进行。", "Poincare-Dulac 标准型定理：形式坐标变换可把 u' = B u + O(|u|^2) 化为只含共振项的形式；当无共振时可形式线性化，但收敛性还需 Siegel 或 Bruno 型条件。"],
        generalRequirements: ["必须先给出谱分解并确认 E^c 非空，再写归约方程的维数。", "中心流形只在平衡点的某个邻域内定义且一般不唯一，涉及唯一性的表述必须限制到有限阶 Taylor 系数。", "标准型化简必须明确列出共振关系，逐阶消去时不得改变低阶共振系数。"],
        forbiddenErrors: ["【唯一性误断】声称中心流形唯一或全局存在，忽略其只是局部对象且在 C^infinity 层面一般不唯一。", "【光滑性错位】把 C^k 向量场的中心流形当作解析流形，或对 h 的展开使用超出 C^k 的阶数。", "【共振漏项】在标准型中消去了实际共振的单项式（如 Hopf 情形的 |u|^2 u 项），使三次项系数丢失。", "【归约越界】把归约方程的结论直接推广到远离平衡点的全局动力学。", "【维数错误】把中心流形维数写成 E^s 或 E^u 的维数，或忽略纯虚特征值成对出现导致维数至少为二。"],
        parameterConstraints: { spectrumSplit: "必须存在实部为零的特征值（E^c 非空），否则由 Hartman-Grobman 直接双曲化而无需归约。", tangency: "h(0) = 0 且 D h(0) = 0，保证 W^c 与 E^c 相切。", smoothness: "向量场 C^k 时中心流形与归约方程只保证 C^k，标准型展开阶数不得超过 k。", resonance: "共振指标满足 <m, lambda> = lambda_j 且 |m| >= 2 的单项式必须保留。" },
        closureChecks: ["检查谱分解三部分维数之和是否等于 n。", "检查归约方程是否只保留临界方向变量。", "检查共振单项式清单是否完整、消去顺序是否自低阶到高阶。", "检查结论的适用范围是否限定在平衡点邻域内。"],
        scenarioChecks: { saddleNodeSetting: ["E^c 一维", "归约为 y' = mu + a y^2 + O(y^3)", "保留二次共振项"], hopfSetting: ["E^c 二维对应 ±i omega", "保留 |u|^2 u 型共振项", "由该系数读出第一 Lyapunov 系数"], parameterDependent: ["把参数视为附加变量做延拓归约", "保证归约对参数光滑", "检查分岔条件在归约方程中的对应形式"] },
    },
    // 倍周期分岔与 Feigenbaum 常数。
    "chaos-period-doubling-feigenbaum": {
        definitions: ["倍周期分岔（翻转分岔）指离散映射 x -> g(x, mu) 的不动点或 k 周期轨在乘子等于 -1 处失稳，并分岔出周期为原周期两倍的轨道。", "Feigenbaum 常数 delta 约为 4.6692 描述分岔点间距的几何收敛率，alpha 约为 2.5029 描述吸引子标度收缩率，二者对单峰映射类具有普适性。"],
        formulas: ["标准型 y -> -(1 + mu) y + a y^2 + b y^3，二次迭代后化为 y -> (1 + mu)^2 y - c y^3。", "分岔点收敛 (mu_n - mu_{n-1}) / (mu_{n+1} - mu_n) -> delta，故 mu_infinity - mu_n ~ C delta^{-n}。", "重整化算子 (R f)(x) = alpha f(f(x / alpha))，Feigenbaum 不动点 f_* 满足 R f_* = f_*，delta 是 R 在 f_* 处线性化的唯一不稳定特征值。"],
        theorems: ["倍周期分岔定理：若 g(x_0, mu_0) = x_0、partial_x g = -1、非退化条件（二次迭代的三次项系数非零）与横截条件 partial_mu(partial_x g) 非零成立，则在临界值一侧出现唯一的二周期轨，其稳定性与三次项符号相反。", "Feigenbaum 普适性：具有单个二次型极大点、负 Schwarz 导数的单峰映射族的倍周期级联给出同一对常数 delta 与 alpha，与具体函数形式无关。", "级联极限处出现 Feigenbaum 吸引子：它是一个 Cantor 型极小集，拓扑熵为零，故级联端点本身尚不是正熵混沌，而是通向混沌的边界。"],
        generalRequirements: ["必须写出乘子等于 -1 这一临界条件，与鞍结分岔的乘子等于 1 严格区分。", "讨论普适常数必须限定在单峰映射（单个二次型临界点）类别内，不能推广到任意映射。", "级联极限点与其后的正熵混沌区必须区分陈述。"],
        forbiddenErrors: ["【临界值混淆】把倍周期分岔的乘子条件写成 +1，或对连续时间系统的平衡点直接谈倍周期分岔而不经 Poincare 映射。", "【普适性滥用】对非单峰、非负 Schwarz 导数或含多个临界点的映射套用 delta 与 alpha。", "【熵误判】称级联极限处已具备正拓扑熵或正 Lyapunov 指数，实际该处 Lyapunov 指数为零、熵为零。", "【周期计数错】称分岔后原轨道消失，实际原周期轨继续存在但变为不稳定。", "【收敛率误用】把 mu_n 的收敛写成算术级数或指数 alpha 而非 delta 的幂。"],
        parameterConstraints: { multiplier: "临界乘子必须为 -1（k 周期轨则指 g^k 的乘子为 -1）。", nondegeneracy: "二次迭代标准型的三次项系数必须非零。", transversality: "乘子对参数的导数在临界点非零。", universalityClass: "普适常数只适用于光滑单峰映射且 Schwarz 导数为负的映射族。" },
        closureChecks: ["检查是否验证乘子为 -1 及其单重性。", "检查二周期轨出现在参数的哪一侧与三次项符号是否一致。", "检查原周期轨在分岔后的稳定性变化是否正确陈述。", "检查普适常数的适用条件是否显式说明。"],
        scenarioChecks: { logisticFamily: ["确认单峰与二次型临界点", "分岔点比值趋于 delta", "级联端点熵为零"], periodKOrbit: ["对 g^k 计算乘子", "乘子为 -1 时得到 2k 周期轨", "区分 g 与 g^k 的稳定性判据"], renormalization: ["写出重整化算子形式", "delta 为不稳定特征值", "alpha 为标度收缩因子"] },
    },
    // Sharkovskii 序与三周期定理。
    "chaos-sharkovskii-period-three": {
        definitions: ["Sharkovskii 序是正整数上的一个全序：3 > 5 > 7 > ... > 2·3 > 2·5 > ... > 4·3 > 4·5 > ... > 8 > 4 > 2 > 1，用于比较区间连续映射的周期集。", "周期集 P(f) 指连续映射 f: I -> I（I 为区间）所有周期轨的周期构成的正整数集合。"],
        formulas: ["Sharkovskii 序中的排列规则：奇数按升序居前，随后是 2 乘奇数、4 乘奇数等，最后是 2 的幂按降序。", "若 m 属于 P(f) 且 m > n（Sharkovskii 序），则 n 属于 P(f)。", "Li-Yorke 结论：3 属于 P(f) 蕴含 P(f) 包含所有正整数，且存在不可数的混沌集（Li-Yorke 混沌）。"],
        theorems: ["Sharkovskii 定理：对区间上的连续映射 f，若存在周期为 m 的点且 m 在 Sharkovskii 序中优先于 n，则 f 也存在周期为 n 的点；反之对任意 m 存在映射使 P(f) 恰为 m 及其后继构成的尾段。", "三周期蕴含混沌（Li-Yorke）：区间连续映射若有三周期点，则对一切正整数都有周期点，并存在不可数的混沌散射集 S 使任意两点的轨道既无限接近又无限分离。", "只有 2 的幂的情形：若 P(f) 只含 2 的幂，则 f 的拓扑熵为零；若 P(f) 含某个奇数大于 1 的周期，则拓扑熵严格为正。"],
        generalRequirements: ["必须限定在区间（一维连通紧区间）上的连续映射，Sharkovskii 定理不能直接搬到圆周或高维空间。", "使用蕴含关系时必须按 Sharkovskii 序方向正确陈述，即由序中靠前的周期推出靠后的周期。", "三周期结论必须区分周期点存在性与正熵、Li-Yorke 混沌等不同强度的结论。"],
        forbiddenErrors: ["【定义域越界】把 Sharkovskii 定理用于圆周映射或平面映射，忽略圆周旋转只有单一周期这类反例。", "【方向颠倒】由存在二周期点推出存在三周期点。", "【连续性遗漏】对不连续或分段定义不连续的映射套用该定理。", "【结论过强】由三周期存在直接断言存在正 Lyapunov 指数或存在遍历不变测度，正确结论只到周期完全性与 Li-Yorke 混沌。", "【熵判据误用】称仅含 2 的幂的周期集也可给出正拓扑熵。"],
        parameterConstraints: { domain: "定义域必须是实直线上的区间且映射连续，允许非满射但必须自映。", orderDirection: "蕴含只沿 Sharkovskii 序从前向后传递。", periodThree: "存在周期恰为 3 的点即可，周期 3 的轨道不必稳定。", entropyLink: "含奇数大于 1 的周期给出正熵，只含 2 的幂给出零熵。" },
        closureChecks: ["检查映射的定义域与连续性假设是否符合定理前提。", "检查所用周期在 Sharkovskii 序中的相对位置是否正确。", "检查从周期集得到的熵结论是否与奇周期是否出现相匹配。", "检查是否把周期点存在性与轨道稳定性混为一谈。"],
        scenarioChecks: { intervalMap: ["确认区间自映且连续", "定位给定周期在 Sharkovskii 序中的位置", "列出被蕴含的全部周期"], periodThreeCase: ["确认存在三周期点", "推出所有周期均存在", "陈述 Li-Yorke 混沌集不可数"], zeroEntropyCase: ["周期集只含 2 的幂", "拓扑熵为零", "不能断言存在敏感依赖性"] },
    },
    // 符号动力系统与移位共轭。
    "chaos-symbolic-dynamics-shift-conjugacy": {
        definitions: ["全移位空间 Sigma_k 是有限字母表上双边或单边无穷序列的集合，配以积拓扑（等价于柱形度量），移位映射 sigma 把序列整体左移一位。", "子移位 Sigma_A 由转移矩阵 A（0-1 矩阵）给定的允许相邻关系确定，称为有限型子移位；两个系统拓扑共轭指存在同胚 h 使 h 交换两者的动力学。"],
        formulas: ["度量 d(x, y) = sum_{n} |x_n - y_n| / 2^{|n|}，与积拓扑等价，使 Sigma_k 成为紧致度量空间。", "周期点计数 #Fix(sigma^n) = tr(A^n)，全移位情形为 k^n。", "拓扑熵 h(sigma) = log(spectral radius of A)，全移位为 log k。"],
        theorems: ["移位系统的基本性质：Sigma_k 紧致、sigma 连续且满射，周期点在 Sigma_k 中稠密，存在稠密轨道（传递性），因此 sigma 是 Devaney 意义下的混沌系统。", "共轭原理：若映射在某不变集上与（子）移位拓扑共轭，则周期点计数、拓扑熵、传递性、混合性等全部拓扑不变量可直接由转移矩阵读出。", "不可约转移矩阵对应拓扑传递的有限型子移位；本原矩阵（存在 n 使 A^n 全正）对应拓扑混合，Perron-Frobenius 特征值给出熵与周期点增长率。"],
        generalRequirements: ["必须写清字母表、允许字与单边或双边的选择，因为可逆性依赖单双边之分。", "使用转移矩阵结论前必须说明矩阵是否不可约或本原。", "由共轭传递结论时必须保证共轭是同胚而非仅半共轭（因子映射），后者只给出单向的熵不等式。"],
        forbiddenErrors: ["【共轭强度混淆】把因子半共轭当作拓扑共轭，从而错误地断言熵相等（半共轭只给出被因子系统的熵不超过原系统）。", "【单双边错位】在单边移位上断言可逆，或在双边移位上按单边方式计数原像。", "【矩阵条件缺失】对可约转移矩阵断言拓扑传递，或对不可约但非本原矩阵断言混合。", "【熵计算错误】把熵写成矩阵迹或行和的对数而非谱半径的对数。", "【周期点计数错】把 #Fix(sigma^n) 写成 A^n 的元素和而非迹。"],
        parameterConstraints: { alphabet: "字母表必须有限，保证紧致性；无限字母表需另作紧化。", transitionMatrix: "A 为 0-1 方阵；不可约给出传递，本原给出混合。", spectralRadius: "谱半径必须大于 1 才有正熵。", conjugacyType: "共轭映射必须是双向连续的同胚且与动力学交换。" },
        closureChecks: ["检查字母表有限性与单双边选择是否明确。", "检查转移矩阵的不可约或本原性是否与所断言的传递或混合性质匹配。", "检查熵与周期点计数是否分别用谱半径与迹给出。", "检查共轭还是半共轭是否表述准确。"],
        scenarioChecks: { fullShift: ["熵为 log k", "周期点计数 k^n", "传递且混合"], subshiftOfFiniteType: ["写出转移矩阵", "检查不可约或本原", "熵取谱半径的对数"], conjugacyTransfer: ["确认同胚且交换动力学", "把周期点与熵等不变量搬运过去", "半共轭情形只写熵的不等式"] },
    },
    // Smale 马蹄与横截同宿定理。
    "chaos-smale-horseshoe-homoclinic": {
        definitions: ["Smale 马蹄指存在矩形 R 使映射 f 把 R 在一个方向均匀压缩、另一方向均匀拉伸并折叠回来，使 f(R) 与 R 至少有两条横向相交的竖条，从而在最大不变集上产生双侧移位结构。", "横截同宿点指双曲不动点 p 的稳定流形 W^s(p) 与不稳定流形 W^u(p) 在 p 之外的交点，且两流形在该点横截相交。"],
        formulas: ["最大不变集 Lambda = 交集 over n in Z of f^n(R)，它与双边全移位 Sigma_2 拓扑共轭。", "熵下界 h(f) >= h(f|_Lambda) = log 2（两条竖条情形），一般 m 条给出 log m。", "周期点计数 #Fix(f^n|_Lambda) = 2^n。"],
        theorems: ["Smale-Birkhoff 同宿定理：若可逆映射 f 有双曲不动点 p 且存在横截同宿点，则存在整数 N 使 f^N 在 p 附近某不变集上与全移位共轭，即出现马蹄，从而 f 有正拓扑熵与无穷多周期轨。", "马蹄的结构稳定性：马蹄上的双曲不变集在 C^1 小扰动下持续存在且共轭类型不变，因此由横截同宿得到的混沌是稳健现象而非临界巧合。", "Lambda 是双曲不变 Cantor 集：它紧致、完全不连通、无孤立点，Lebesgue 测度为零，故马蹄给出的混沌可能不被典型初值观测到（非吸引子）。"],
        generalRequirements: ["必须验证同宿交点的横截性，切向同宿只给出退化情形而不能直接得到马蹄。", "必须说明不动点是双曲的以及映射在所讨论区域可逆。", "陈述结论时须指出马蹄不变集通常是零测集，不能等同于观测到的吸引子。"],
        forbiddenErrors: ["【横截性缺失】由稳定流形与不稳定流形相交就断言马蹄，忽略必须横截相交。", "【自交误判】把同一不动点的稳定流形与自身相交或把异宿环与同宿点混为一谈而不加区分论证。", "【测度误解】称马蹄不变集有正 Lebesgue 测度或必然是吸引子。", "【可逆性遗漏】对不可逆映射直接套用双边移位共轭。", "【迭代次数省略】忽略共轭通常只对某个 f^N 成立，直接断言 f 本身与全移位共轭。"],
        parameterConstraints: { hyperbolicity: "不动点必须双曲（乘子模不等于 1），且区域内一致双曲估计成立。", transversality: "W^s(p) 与 W^u(p) 在同宿点处的切空间之和必须充满整个切空间。", invertibility: "需要双边符号编码时映射必须在相关区域为微分同胚。", iterateIndex: "共轭结论一般对某个足够大的迭代 f^N 成立。" },
        closureChecks: ["检查双曲性与横截性两个前提是否都已验证。", "检查最大不变集是否取双向交集以匹配双边移位。", "检查熵下界与周期点计数是否与竖条数一致。", "检查是否声明该不变集为零测且非吸引。"],
        scenarioChecks: { horseshoeConstruction: ["找到被拉伸压缩的矩形", "确认像与原矩形横向相交至少两条", "得到与 Sigma_2 的共轭"], homoclinicDetection: ["确认不动点双曲", "确认同宿交点横截", "由 Smale-Birkhoff 推出马蹄"], perturbation: ["C^1 小扰动下双曲集持续存在", "共轭类型不变", "横截性被保持"] },
    },
    // Melnikov 判据。
    "chaos-melnikov-criterion": {
        definitions: ["Melnikov 函数是对含小周期扰动的近可积平面系统 x' = f(x) + eps g(x, t)（未扰动系统具有同宿轨 x_0(t)）度量稳定流形与不稳定流形分离距离的一阶量。", "同宿轨横截相交指扰动后 W^s 与 W^u 以非零角度相交，从而依 Smale-Birkhoff 定理产生马蹄与混沌。"],
        formulas: ["M(t_0) = int_{-infinity}^{+infinity} f(x_0(t)) wedge g(x_0(t), t + t_0) dt，其中 a wedge b = a_1 b_2 - a_2 b_1。", "含耗散项时 M(t_0) = int e^{-int tr Df} f wedge g dt，指数因子来自未扰动流的散度不为零。", "流形间距 d(t_0) = eps M(t_0) / |f(x_0(0))| + O(eps^2)。"],
        theorems: ["Melnikov 判据：若 M(t_0) 有简单零点（M(t_0^*) = 0 且 M'(t_0^*) 非零），则对充分小的 eps > 0 扰动系统的 Poincare 映射具有横截同宿点，从而存在马蹄与正拓扑熵。", "若 M(t_0) 处处不为零，则在一阶意义下流形不相交，该同宿结构在小扰动下被破坏为分离的两支且不产生一阶横截相交。", "Melnikov 方法的适用范围：结论仅对充分小的 eps 成立，一阶消失（M 恒为零）时须计算高阶 Melnikov 函数才能判定。"],
        generalRequirements: ["必须写出未扰动同宿轨的显式或至少可积表示，积分沿该轨道进行。", "必须区分保守与耗散未扰动系统，后者的 Melnikov 积分需带指数权因子。", "结论须限定在小参数范围，不得对有限大扰动强度直接使用。"],
        forbiddenErrors: ["【零点性质错】由 M(t_0) 有零点即断言混沌，忽略必须是简单零点（重零点对应切向相交）。", "【权因子遗漏】未扰动系统散度非零时仍用无权积分公式。", "【楔积写错】把 f wedge g 写成内积 f·g 或颠倒分量顺序导致符号相反。", "【范围越界】把小参数结论推广到大扰动或断言全局吸引子结构。", "【退化未处理】M 恒为零时仍下结论，正确做法是转向二阶 Melnikov 分析。"],
        parameterConstraints: { epsilonSmall: "扰动参数 eps 必须充分小且结论为渐近陈述。", homoclinicOrbit: "未扰动系统必须存在连接双曲鞍点的同宿轨（或异宿环）。", simpleZero: "M(t_0^*) = 0 且 M'(t_0^*) 非零。", integrability: "Melnikov 积分必须绝对收敛，通常依赖 g 有界与同宿轨指数趋于鞍点。" },
        closureChecks: ["检查积分是否沿未扰动同宿轨在全实轴上取。", "检查是否使用楔积并保持分量顺序。", "检查零点是否被验证为简单零点。", "检查耗散情形是否加入指数权因子。"],
        scenarioChecks: { conservativeUnperturbed: ["未扰动系统为 Hamilton 系统", "使用无权 Melnikov 积分", "简单零点给出横截同宿"], dissipativeUnperturbed: ["计算 tr Df 沿轨积分", "加入指数权因子", "重新判定零点性质"], degenerateFirstOrder: ["M 恒为零时展开到二阶", "分析二阶 Melnikov 函数零点", "说明一阶方法失效原因"] },
    },
    // Lyapunov 指数与 Oseledets 定理。
    "chaos-lyapunov-exponent-oseledets": {
        definitions: ["Lyapunov 指数刻画切向量沿轨道的指数增长率 lambda(x, v) = lim (1/n) log |D f^n(x) v|，其取值集合构成该点的 Lyapunov 谱。", "Oseledets（乘性遍历）定理给出的可测分解把切空间分成对应各指数的不变子空间族，称为 Oseledets 分解或 Lyapunov 滤链。"],
        formulas: ["lambda(x, v) = lim_{n -> infinity} (1/n) log |D f^n(x) v|，连续时间情形用 (1/t) log |D phi^t(x) v|。", "指数和与体积增长 sum_i m_i lambda_i = lim (1/n) log |det D f^n(x)|，其中 m_i 为重数。", "一维映射的指数 lambda = int log |f'(x)| d mu(x)（mu 为不变遍历测度）。"],
        theorems: ["Oseledets 定理：若 f 保持遍历概率测度 mu 且 log|D f| 可积，则对 mu-几乎所有 x 存在有限个 Lyapunov 指数 lambda_1 > ... > lambda_k（重数计入）与可测不变滤链 V_1 包含 V_2 ... 使 v 属于 V_i 去掉 V_{i+1} 时增长率恰为 lambda_i；遍历性使指数与 x 无关。", "Pesin 公式：对保持光滑不变测度（或 SRB 测度）的系统，测度熵等于正 Lyapunov 指数按重数之和；一般情形有 Ruelle 不等式 h_mu(f) <= sum of positive exponents。", "指数与稳定性联系：正的最大指数意味着轨道对初值敏感依赖并给出局部不稳定方向的维数，全部指数为负则轨道被吸引到该轨道所在的稳定对象。"],
        generalRequirements: ["必须指明所依赖的不变测度，Lyapunov 指数是测度相关量而非单条轨道的绝对属性。", "使用与 x 无关的谱前必须假定遍历性。", "连续时间系统沿轨道方向必有一个零指数（自治流），周期轨情形须显式指出。"],
        forbiddenErrors: ["【测度缺失】谈 Lyapunov 指数而不指定不变测度，或对不同测度的指数互相比较得出矛盾结论。", "【遍历性遗漏】在非遍历测度下断言指数处处相同。", "【零指数遗漏】自治流的轨道方向指数为零却被计入正指数，从而高估熵或不稳定维数。", "【熵关系反向】把 Ruelle 不等式方向写反，或对任意不变测度断言 Pesin 等式成立。", "【可积性忽视】未验证 log|D f| 可积就调用 Oseledets 定理。"],
        parameterConstraints: { invariantMeasure: "必须存在 f-不变概率测度，遍历性用于消去对 x 的依赖。", integrability: "log^+ |D f| 与 log^+ |D f^{-1}|（可逆情形）需可积。", flowZeroExponent: "自治流沿轨道方向恒有一个零指数。", pesinCondition: "Pesin 等式要求测度关于不稳定叶层具有绝对连续性（如 SRB 测度）。" },
        closureChecks: ["检查是否明确了不变测度与遍历性假设。", "检查指数个数与重数之和是否等于相空间维数。", "检查体积增长率是否等于全部指数的加权和。", "检查熵与正指数之间使用的是等式还是不等式并给出理由。"],
        scenarioChecks: { discreteMap: ["写出 (1/n) log |D f^n v| 的极限", "指定不变遍历测度", "由正指数判定敏感依赖"], autonomousFlow: ["计入沿轨方向的零指数", "指数之和等于散度的时间平均", "判定不稳定维数时排除零指数"], entropyLink: ["一般情形用 Ruelle 不等式", "SRB 测度下用 Pesin 等式", "说明所需的绝对连续性条件"] },
    },
    // 拓扑熵与 Devaney 混沌。
    "chaos-topological-entropy-devaney": {
        definitions: ["拓扑熵用 (n, eps)-分离集或跨越集的最大基数增长率定义：h(f) = lim_{eps -> 0} limsup_{n} (1/n) log s(n, eps, f)，也可用开覆盖的最小子覆盖数定义，二者在紧致度量空间上等价。", "Devaney 混沌指系统同时具备拓扑传递性、周期点稠密与对初值的敏感依赖性。"],
        formulas: ["Bowen 度量 d_n(x, y) = max_{0 <= i < n} d(f^i x, f^i y)，s(n, eps) 为其 eps-分离集最大基数。", "迭代关系 h(f^k) = k h(f)，乘积关系 h(f x g) = h(f) + h(g)。", "有限型子移位 h = log(转移矩阵谱半径)；扩张映射 x -> m x mod 1 的熵为 log m。"],
        theorems: ["变分原理：紧致空间上连续映射的拓扑熵等于所有不变概率测度的测度熵的上确界，h(f) = sup over invariant mu of h_mu(f)。", "Banks 等人的结论：在无限紧致度量空间上，拓扑传递性与周期点稠密蕴含敏感依赖性，故 Devaney 定义中的敏感性是冗余条件。", "熵的拓扑不变性：拓扑共轭保持熵；半共轭（因子）只给出因子系统的熵不超过原系统，且正熵蕴含存在指数增长的可区分轨道数。"],
        generalRequirements: ["必须在紧致度量空间与连续映射的框架下讨论熵，非紧情形需另行说明定义。", "断言混沌时必须明确所用定义（Devaney、Li-Yorke 或正熵），三者强度不同。", "熵为零不等于系统平凡，需与周期结构的结论配合陈述。"],
        forbiddenErrors: ["【定义混用】把 Devaney 混沌、Li-Yorke 混沌与正拓扑熵当作同一概念互相替换。", "【冗余误判】仍把敏感依赖性列为需要独立验证的条件（在无限紧致空间中它由前两条推出）。", "【变分原理误用】把变分原理写成对某个特定测度的等式，而不是对所有不变测度取上确界。", "【共轭不变性滥用】用半共轭断言两系统熵相等。", "【极限顺序错】在熵定义中把 eps -> 0 与 n -> infinity 的极限次序颠倒。"],
        parameterConstraints: { compactness: "相空间需紧致度量，映射连续。", separationScale: "先对固定 eps 取 n 的上极限，再令 eps -> 0。", devaneyIngredients: "传递性与周期点稠密为核心条件，敏感性在无限空间中自动成立。", positiveEntropy: "正熵要求可区分轨道数按指数增长，等价于存在正熵不变测度。" },
        closureChecks: ["检查熵定义中两个极限的次序是否正确。", "检查所用混沌定义是否与所验证的性质一致。", "检查变分原理的上确界表述是否完整。", "检查共轭与半共轭对熵的结论是否分别表述。"],
        scenarioChecks: { entropyComputation: ["选择分离集或开覆盖定义", "计算增长率", "与已知模型（移位或扩张映射）核对"], devaneyVerification: ["验证拓扑传递性", "验证周期点稠密", "说明敏感性为推论"], variationalPrinciple: ["取遍所有不变测度", "上确界给出拓扑熵", "在扩张系统中由测度熵最大者实现"] },
    },
};
