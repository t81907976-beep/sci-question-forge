import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“特殊函数”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const SPECIAL_FUNCTIONS_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Gamma 函数的解析延拓与极点结构。
    "specfn-gamma-analytic-continuation": {
        id: "specfn-gamma-analytic-continuation", l2Key: "special-functions", name: "Gamma 函数的解析延拓与极点结构", kind: "theorem",
        aliases: ["Gamma函数极点", "Hankel围道表示", "Gamma无穷乘积", "余元公式"],
    },
    // Digamma 与 Polygamma 函数的递推与渐近。
    "specfn-digamma-polygamma": {
        id: "specfn-digamma-polygamma", l2Key: "special-functions", name: "Digamma 与 Polygamma 函数", kind: "formula",
        aliases: ["Digamma函数", "Polygamma函数", "调和数渐近", "Euler-Mascheroni常数"],
    },
    // Stirling 渐近级数与其误差控制。
    "specfn-stirling-asymptotic-series": {
        id: "specfn-stirling-asymptotic-series", l2Key: "special-functions", name: "Stirling 渐近级数与误差控制", kind: "formula",
        aliases: ["Stirling级数", "Binet对数Gamma公式", "阶乘渐近误差", "Lanczos近似"],
    },
    // 超几何方程与 2F1 的解结构。
    "specfn-hypergeometric-2f1": {
        id: "specfn-hypergeometric-2f1", l2Key: "special-functions", name: "超几何方程与 2F1 的解结构", kind: "object",
        aliases: ["超几何方程", "Gauss超几何函数", "2F1", "正则奇点指标方程"],
    },
    // Gauss 求和公式与 Kummer 连接公式。
    "specfn-gauss-summation-kummer": {
        id: "specfn-gauss-summation-kummer", l2Key: "special-functions", name: "Gauss 求和与 Kummer 连接公式", kind: "formula",
        aliases: ["Gauss求和公式", "Kummer变换", "超几何连接公式", "参数退化判据"],
    },
    // Bessel 方程的解与大变量渐近。
    "specfn-bessel-solutions-asymptotics": {
        id: "specfn-bessel-solutions-asymptotics", l2Key: "special-functions", name: "Bessel 方程的解与大变量渐近", kind: "object",
        aliases: ["Bessel函数", "Neumann函数", "Bessel大变量渐近", "Bessel零点交错"],
    },
    // 正交多项式的 Favard 定理与零点性质。
    "specfn-orthogonal-polynomial-zeros": {
        id: "specfn-orthogonal-polynomial-zeros", l2Key: "special-functions", name: "正交多项式的 Favard 定理与零点性质", kind: "theorem",
        aliases: ["Favard定理", "正交多项式零点", "Christoffel-Darboux恒等式", "零点分离性"],
    },
    // 球调和函数与连带 Legendre 函数。
    "specfn-spherical-harmonics": {
        id: "specfn-spherical-harmonics", l2Key: "special-functions", name: "球调和函数与连带 Legendre 函数", kind: "object",
        aliases: ["球调和函数", "连带Legendre函数", "球面加法定理", "球面Laplace特征值"],
    },
    // 椭圆积分与 Jacobi 椭圆函数。
    "specfn-elliptic-integrals-jacobi": {
        id: "specfn-elliptic-integrals-jacobi", l2Key: "special-functions", name: "椭圆积分与 Jacobi 椭圆函数", kind: "object",
        aliases: ["第一类椭圆积分", "Jacobi椭圆函数", "AGM迭代", "双周期性"],
    },
    // Airy 函数与转点附近的连接。
    "specfn-airy-turning-point": {
        id: "specfn-airy-turning-point", l2Key: "special-functions", name: "Airy 函数与转点连接", kind: "object",
        aliases: ["Airy函数", "转点连接公式", "Airy渐近", "Stokes线"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const SPECIAL_FUNCTIONS_L3_RULES: Record<string, MathV2L3Rules> = {
    // Gamma 函数的解析延拓与极点结构。
    "specfn-gamma-analytic-continuation": {
        definitions: ["Gamma 函数由 Re s > 0 上的 Euler 积分定义，通过函数方程或无穷乘积延拓为整个复平面上除非正整数外全纯的亚纯函数，在 s = 0, -1, -2, ... 处有单极点且无零点"],
        formulas: ["Euler 积分：Gamma(s) = int_0^inf t^{s-1} e^{-t} dt（Re s > 0）", "函数方程：Gamma(s + 1) = s Gamma(s)，用于向左延拓", "极点与留数：Gamma 在 s = -n 处留数为 (-1)^n / n!", "余元公式：Gamma(s) Gamma(1 - s) = pi / sin(pi s)", "无穷乘积：1 / Gamma(s) = s e^{gamma s} prod_{n>=1} (1 + s/n) e^{-s/n}", "倍元关系：Gamma(s) Gamma(s + 1/2) = 2^{1 - 2s} sqrt(pi) Gamma(2s)", "Hankel 围道：1 / Gamma(s) = (1 / (2 pi i)) int_C e^t t^{-s} dt，C 绕负实轴", "对数导数：Gamma'(s) / Gamma(s) = psi(s)"],
        theorems: ["Bohr-Mollerup 定理给出唯一性：满足 f(1) = 1、f(s + 1) = s f(s) 且 log f 在正半轴凸的函数唯一为 Gamma，故任何自称推广阶乘的函数若不满足对数凸性就不是 Gamma", "1 / Gamma 是整函数且无极点，Gamma 本身无零点：这一点使 Gamma 常作分母出现在留数计算与超几何系数中，若误认为 Gamma 有零点会得到虚假的解析性", "延拓的合法路径是函数方程或无穷乘积，Euler 积分在 Re s <= 0 发散；对 Re s <= 0 直接代入积分式是最常见的错误", "余元公式在 s 为整数处两侧同时发散，其正确用法是在非整数点建立恒等式并由连续性取极限，不能在整点直接使用", "Hankel 围道表示给出 1 / Gamma 的整函数性质并支持 Gamma 在负方向的渐近分析，是 Stirling 型渐近与鞍点分析的出发点", "Gamma 的极点结构决定了众多特殊函数的解析性质：超几何系数、Mellin 变换的极点位置与留数展开都由 Gamma 的单极点及其留数直接读出"],
        generalRequirements: ["必须写明所用表示式的有效区域并说明延拓方式", "涉及非正整数点必须先判断是否落在极点上", "使用余元或倍元公式必须核对参数不使两侧同时发散"],
        forbiddenErrors: ["【收敛域外用积分】对 Re s <= 0 直接使用 Euler 积分定义", "【极点处取有限值】在 s = 0, -1, -2, ... 处给出有限 Gamma 值", "【零点误断】声称 Gamma 存在零点或 1/Gamma 存在极点", "【余元公式整点滥用】在 sin(pi s) = 0 处使用余元公式", "【唯一性缺条件】用函数方程加 f(1) = 1 即断言函数为 Gamma 而不要求对数凸", "【留数符号错】把 s = -n 处留数写成 1/n! 而漏掉 (-1)^n"],
        parameterConstraints: { integralDomain: "Euler 积分要求 Re s > 0", poleSet: "极点为 s = 0, -1, -2, ...，留数 (-1)^n / n!", reflectionValidity: "余元公式要求 s 非整数", productConvergence: "Weierstrass 型乘积需 e^{-s/n} 因子保证收敛", logConvexity: "Bohr-Mollerup 唯一性要求 log Gamma 在 (0, inf) 上凸" },
        closureChecks: ["核对参数是否落在极点集合内", "验证所用恒等式在参数处两侧均有限", "用 Gamma(n + 1) = n! 与 Gamma(1/2) = sqrt(pi) 检验数值"],
        scenarioChecks: { continuationStep: ["用函数方程把参数移入 Re s > 0 后再用积分表示计算"], residueExtraction: ["在非正整数点写出单极点的主部并给出留数"], reflectionUse: ["用余元公式化简 Gamma(s)Gamma(1-s) 并核对 s 非整数"] },
    },
    // Digamma 与 Polygamma 函数的递推与渐近。
    "specfn-digamma-polygamma": {
        definitions: ["Digamma 函数是 log Gamma 的导数，Polygamma 是其高阶导数；它们把调和和、Gamma 的对数凸性与 zeta 值的算术联系起来，是有理函数级数求和的标准工具"],
        formulas: ["定义：psi(s) = d/ds log Gamma(s) = Gamma'(s) / Gamma(s)，psi^{(m)}(s) = d^m psi / ds^m", "递推：psi(s + 1) = psi(s) + 1/s", "特殊值：psi(1) = -gamma，psi(n) = -gamma + sum_{k=1}^{n-1} 1/k = -gamma + H_{n-1}", "半整数：psi(1/2) = -gamma - 2 log 2", "余元关系：psi(1 - s) - psi(s) = pi cot(pi s)", "级数表示：psi(s) = -gamma + sum_{n>=0} (1/(n+1) - 1/(n+s))", "渐近式：psi(s) ~ log s - 1/(2s) - 1/(12 s^2) + ...（s -> inf）", "Polygamma 与 zeta：psi^{(m)}(1) = (-1)^{m+1} m! zeta(m + 1)"],
        theorems: ["psi 的极点与 Gamma 相同（s = 0, -1, -2, ... 处为单极点且留数 -1），但 psi 在正实轴上严格单调递增且 psi' > 0，这正是 log Gamma 凸性的解析表达", "调和数没有初等闭式，H_n = psi(n + 1) + gamma 是其正确的解析表达；用 log n 直接代替 H_n 会丢掉 gamma 与 1/(2n) 阶修正", "有理函数级数 sum (1/(n + a) - 1/(n + b)) 的闭式为 psi(b) - psi(a)，这是 Digamma 最主要的求和用途；逐项分离成两个发散级数再相减是错误做法", "psi 的渐近展开是发散渐近级数而非收敛级数，其误差由首个被舍弃项控制，不能通过增加项数无限提高精度", "Polygamma 在正实轴上具有确定符号：psi^{(m)}(s) 的符号为 (-1)^{m+1}，故 psi' 完全单调，这给出许多不等式（如 Gautschi 型界）的证明途径", "Euler-Mascheroni 常数 gamma 由 psi(1) = -gamma 唯一固定，它不是可任意归一化的常数；改变归一化会同时破坏递推与级数表示"],
        generalRequirements: ["必须用递推把参数移入渐近式适用范围再展开", "级数求和必须写成 psi 差的形式而非拆分为发散级数", "使用渐近展开必须给出截断误差阶"],
        forbiddenErrors: ["【调和数当对数】用 log n 代替 H_n 而丢掉 gamma 与 1/(2n) 项", "【发散级数拆分】把 sum (1/(n+a) - 1/(n+b)) 拆成两个各自发散的级数", "【渐近当收敛】对 psi 的渐近级数无限加项求精确值", "【极点忽略】在非正整数点使用 psi 的有限值", "【余元误用】在整数点使用 psi(1-s) - psi(s) = pi cot(pi s)", "【Polygamma 符号错】写出与 (-1)^{m+1} 相反的符号"],
        parameterConstraints: { poleSet: "psi 与各阶 Polygamma 极点为 s = 0, -1, -2, ...", asymptoticRange: "渐近式要求 |s| 大且 arg s 有界远离负实轴", recurrenceUse: "小参数需先用 psi(s+1) = psi(s) + 1/s 平移", zetaLink: "psi^{(m)}(1) 与 zeta(m+1) 的关系要求 m >= 1", signPattern: "psi^{(m)} 在正实轴上符号为 (-1)^{m+1}" },
        closureChecks: ["核对参数是否需要先递推平移", "用 psi(1) = -gamma 与 psi(n) 的调和和表达式检验", "给出渐近截断的误差阶"],
        scenarioChecks: { harmonicSum: ["把调和和写成 psi(n+1) + gamma 并给出渐近修正"], rationalSeries: ["把有理项级数化为 psi 差并说明收敛性"], asymptoticEstimate: ["用 log s - 1/(2s) 展开估计大参数值并保留误差阶"] },
    },
    // Stirling 渐近级数与其误差控制。
    "specfn-stirling-asymptotic-series": {
        definitions: ["Stirling 渐近级数给出 log Gamma 在大参数处的展开，其系数由 Bernoulli 数决定；该级数发散但每次截断的余项有精确的积分表示与符号，故可用于严格的上下界估计"],
        formulas: ["主项：Gamma(s + 1) ~ sqrt(2 pi s) (s / e)^s（s -> inf）", "对数形式：log Gamma(s) ~ (s - 1/2) log s - s + (1/2) log(2 pi) + sum_{n>=1} B_{2n} / (2n (2n - 1) s^{2n - 1})", "前两项修正：log Gamma(s) = (s - 1/2) log s - s + (1/2) log(2 pi) + 1/(12 s) - 1/(360 s^3) + ...", "Binet 第一公式：mu(s) = log Gamma(s) - [(s - 1/2) log s - s + (1/2) log(2 pi)] = int_0^inf (t^{-1} - (e^t - 1)^{-1}) e^{-st} / t dt", "双侧界：sqrt(2 pi s) (s/e)^s e^{1/(12 s + 1)} < Gamma(s + 1) < sqrt(2 pi s) (s/e)^s e^{1/(12 s)}", "阶乘比：C(2n, n) ~ 4^n / sqrt(pi n)", "复参数版本：展开在 |arg s| <= pi - delta 的扇形内一致成立", "Lanczos 近似：用有限有理逼近给出全平面高精度数值实现"],
        theorems: ["Stirling 级数是发散渐近级数：对固定 s 增加项数最终使误差增大，最优截断项数约与 s 成比例，故必须报告截断阶而不能声称任意精度", "余项符号可由 Binet 积分确定：截断到 1/(12 s) 项给出上界、到 -1/(360 s^3) 给出下界，交错性使双侧界成立，这是把渐近式用于严格证明的唯一合法方式", "主项中 sqrt(2 pi s) 的常数 (1/2) log(2 pi) 无法由 Euler-Maclaurin 的形式推导直接得到，需用 Wallis 公式或余元公式定出，遗漏该常数是最常见的定量错误", "渐近式在扇形 |arg s| <= pi - delta 内一致有效，但在负实轴附近失效（Gamma 在此有极点），故不能对负参数直接套用", "对整数阶乘的相对误差为 O(1/n)：n! 的 Stirling 估计不能用于要求绝对误差的场合（如精确整除性判断），只能用于比值与增长率分析", "在计算 log 阶乘之比（如二项系数渐近、熵的组合表达）时应先取对数再相减，直接对两个巨大数值作商会带来灾难性的浮点误差"],
        generalRequirements: ["必须以渐近符号书写并给出截断项与误差阶", "使用双侧界必须写出所用的 Binet 型余项估计", "复参数必须声明扇形区域限制"],
        forbiddenErrors: ["【渐近当等式】把 Stirling 公式写成严格等号使用", "【常数遗漏】漏掉 sqrt(2 pi s) 或 (1/2) log(2 pi) 项", "【无限加项】对固定 s 无限增加项数以求精确值", "【负参数套用】对负实轴附近参数直接使用渐近展开", "【绝对误差误用】用 Stirling 估计断言阶乘的精确整数性质", "【比值直算】不取对数直接对巨大阶乘作除法"],
        parameterConstraints: { largeParameter: "要求 |s| 充分大", sectorRestriction: "|arg s| <= pi - delta，远离负实轴", coefficientSource: "系数由 Bernoulli 数 B_{2n} 给出，交错增长", truncationOptimum: "最优截断项数随 s 增大而增大，需显式报告", relativeError: "误差为相对误差 O(1/s)" },
        closureChecks: ["核对是否保留了 sqrt(2 pi s) 常数因子", "给出截断阶及对应误差项", "用小整数阶乘数值检验相对误差量级"],
        scenarioChecks: { factorialEstimate: ["用主项加 1/(12 n) 修正估计 n! 并给出相对误差"], binomialAsymptotics: ["取对数后作差得到中心二项系数的 4^n / sqrt(pi n) 渐近"], rigorousBounds: ["用 Binet 余项给出双侧不等式而非单一近似值"] },
    },
    // 超几何方程与 2F1 的解结构。
    "specfn-hypergeometric-2f1": {
        definitions: ["Gauss 超几何方程是具有三个正则奇点 0、1、inf 的二阶线性方程的标准形，其解空间由 2F1 及其在各奇点处的局部解给出；几乎所有经典特殊函数都是它的退化或特例"],
        formulas: ["方程：z(1 - z) w'' + [c - (a + b + 1) z] w' - a b w = 0", "级数：2F1(a, b; c; z) = sum_{n>=0} ((a)_n (b)_n / ((c)_n n!)) z^n，(a)_n = a(a+1)...(a+n-1)", "收敛半径：|z| < 1；z = 1 处绝对收敛当且仅当 Re(c - a - b) > 0", "奇点指标：z = 0 处为 {0, 1 - c}，z = 1 处为 {0, c - a - b}，z = inf 处为 {a, b}", "指标和：三奇点指标之和为 1（Fuchs 关系）", "第二解（c 非整数）：z^{1-c} 2F1(a - c + 1, b - c + 1; 2 - c; z)", "导数关系：d/dz 2F1(a, b; c; z) = (a b / c) 2F1(a+1, b+1; c+1; z)", "退化：2F1(a, b; b; z) = (1 - z)^{-a}，1F1 与 Bessel 由参数合流得到"],
        theorems: ["解的局部结构完全由指标决定：当两指标之差为整数时对数解出现，此时 z^{1-c} 型第二解退化，必须改用含 log z 的 Frobenius 第二解，直接写幂级数会遗漏一个解", "c 为非正整数时 2F1 一般无定义（分母 (c)_n 出现零因子），除非 a 或 b 为使级数提前截断的非正整数；套用公式前必须检查该退化情形", "参数对称性 2F1(a, b; c; z) = 2F1(b, a; c; z) 与 24 个 Kummer 解的等价性说明同一函数有多种表示，比较结果不一致时应先核对是否为同一分支的不同表示", "z = 1 与 z = inf 处的行为不能由 |z| < 1 内的级数直接读出：需用连接公式解析延拓，越出收敛圆直接求和是无效操作", "超几何方程是二阶 Fuchs 型方程中三奇点情形的唯一标准形（任意三奇点方程可通过分式线性变换与因子提取化为它），这解释了它在特殊函数中的统一地位", "合流（confluence）通过令一个奇点趋于无穷得到 1F1、Bessel、Airy、Hermite 等，但极限过程改变奇点性质（正则奇点变为非正则），故渐近行为需重新分析而不能由 2F1 的结论继承"],
        generalRequirements: ["必须检查参数 c 是否为非正整数及指标差是否为整数", "使用级数必须声明 |z| < 1 及端点收敛条件", "延拓到 z >= 1 必须显式给出所用连接公式"],
        forbiddenErrors: ["【对数解遗漏】指标差为整数时仍写两个纯幂级数解", "【c 非正整数】对 c = 0, -1, -2, ... 直接使用级数定义", "【收敛圆外求和】对 |z| >= 1 直接代入级数", "【端点条件缺失】在 z = 1 处不检验 Re(c - a - b) > 0 即断言收敛", "【合流继承】把 2F1 的正则奇点结论直接用于合流后的非正则奇点", "【指标和错误】给出的三组指标之和不等于 1"],
        parameterConstraints: { cNotNonpositiveInteger: "需 c 不为 0, -1, -2, ...（否则级数分母为零）", convergenceRadius: "级数在 |z| < 1 内收敛", endpointConvergence: "z = 1 处需 Re(c - a - b) > 0", exponentDifference: "指标差为整数时出现对数解", fuchsRelation: "三奇点的指标之和恒为 1" },
        closureChecks: ["核对三个奇点的指标并验证指标和为 1", "检查参数是否落入退化或对数情形", "确认所用表示式的收敛域覆盖目标点"],
        scenarioChecks: { frobeniusAtZero: ["由 z = 0 的指标写出两个局部解并处理整数指标差"], degenerateParameters: ["检查 c 与 a、b 的整数关系判断级数是否截断或失效"], confluenceLimit: ["由参数合流导出 1F1 或 Bessel 并重新分析奇点类型"] },
    },
    // Gauss 求和公式与 Kummer 连接公式。
    "specfn-gauss-summation-kummer": {
        definitions: ["Gauss 求和公式给出 2F1 在 z = 1 处的闭式，Kummer 型连接公式把 2F1 在不同奇点邻域的解相互表出；二者共同构成超几何函数解析延拓与闭式求和的工具箱"],
        formulas: ["Gauss 求和：2F1(a, b; c; 1) = Gamma(c) Gamma(c - a - b) / (Gamma(c - a) Gamma(c - b))，需 Re(c - a - b) > 0", "Kummer 定理：2F1(a, b; 1 + a - b; -1) = Gamma(1 + a - b) Gamma(1 + a/2) / (Gamma(1 + a) Gamma(1 + a/2 - b))", "Euler 变换：2F1(a, b; c; z) = (1 - z)^{c - a - b} 2F1(c - a, c - b; c; z)", "Pfaff 变换：2F1(a, b; c; z) = (1 - z)^{-a} 2F1(a, c - b; c; z / (z - 1))", "z -> 1 - z 连接：2F1(a,b;c;z) = [Gamma(c)Gamma(c-a-b)/(Gamma(c-a)Gamma(c-b))] 2F1(a,b;a+b-c+1;1-z) + (1-z)^{c-a-b} [Gamma(c)Gamma(a+b-c)/(Gamma(a)Gamma(b))] 2F1(c-a,c-b;c-a-b+1;1-z)", "Chu-Vandermonde：2F1(a, -n; c; 1) = (c - a)_n / (c)_n（n 非负整数）", "Saalschütz 求和适用于平衡（Saalschützian）参数组合", "端点发散：Re(c - a - b) <= 0 时 z -> 1 处 2F1 发散或有对数奇性"],
        theorems: ["Gauss 求和的成立条件 Re(c - a - b) > 0 不可省：Re(c - a - b) = 0 时级数发散而函数有对数奇性，Re(c - a - b) < 0 时按 (1-z)^{c-a-b} 幂次发散，故直接代入 z = 1 求闭式是标准错误", "连接公式在 c - a - b 为整数时退化：两项的 Gamma 因子同时出现极点，需取极限得到含 log(1 - z) 的表达式，直接套用会出现 0 乘 inf 的无意义式", "Chu-Vandermonde 是 Gauss 求和的多项式特例（b = -n 使级数截断），此时收敛条件自动满足，故它对任意参数（c 非非正整数）都成立，是组合恒等式的主要来源", "Euler 与 Pfaff 变换给出 24 个 Kummer 解，它们两两等价但适用的收敛区域不同：选择变换的准则是使新变元落入单位圆内，用于把 z 接近 1 或为负数的情形化为快速收敛的级数", "Pfaff 变换的新变元 z/(z-1) 在 z < 1/2 时模长更小，故负实轴上的 2F1 应先作变换再求和；直接对 z 接近 -1 求和收敛极慢", "平衡型（Saalschützian）与良平衡型（well-poised）参数结构是闭式求和存在的判别标志：不满足这些代数关系的 3F2 一般不存在 Gamma 闭式，因此不应盲目寻求闭式"],
        generalRequirements: ["使用端点闭式必须先验证 Re(c - a - b) > 0", "使用连接公式必须检查 c - a - b 是否为整数", "选择变换必须说明新变元落入收敛区域"],
        forbiddenErrors: ["【条件缺失求和】不检验 Re(c - a - b) > 0 就代入 z = 1", "【整数退化套用】c - a - b 为整数时直接使用两项连接公式", "【发散当有限】在 Re(c - a - b) <= 0 时给出有限端点值", "【变换后区域未验】作 Pfaff 变换后不检查新变元是否在单位圆内", "【闭式盲求】对非平衡的高阶超几何强行给出 Gamma 闭式", "【Vandermonde 参数错】b = -n 时把截断长度写错导致组合恒等式失效"],
        parameterConstraints: { gaussCondition: "Gauss 求和需 Re(c - a - b) > 0 且 c 非非正整数", integerDegeneracy: "c - a - b 为整数时连接公式需取极限并出现对数项", truncationCase: "b = -n（n 非负整数）时级数截断为多项式", transformDomain: "变换后需 |新变元| < 1 才可逐项求和", balancedCondition: "闭式求和通常要求平衡或良平衡参数关系" },
        closureChecks: ["核对端点求和的参数条件与 Gamma 因子是否有极点", "检查是否落入整数退化情形并给出对数修正", "验证变换后级数的收敛速度改善"],
        scenarioChecks: { endpointEvaluation: ["验证 Re(c-a-b) > 0 后用 Gamma 商给出 z = 1 处的值"], negativeArgument: ["用 Pfaff 变换把负变元化为单位圆内变元再求和"], combinatorialIdentity: ["用 Chu-Vandermonde 把截断超几何和化为 Pochhammer 商"] },
    },
    // Bessel 方程的解与大变量渐近。
    "specfn-bessel-solutions-asymptotics": {
        definitions: ["Bessel 方程是柱坐标下 Helmholtz 方程分离变量的结果，其在原点为正则奇点、在无穷远为非正则奇点；两类解 J_nu 与 Y_nu 的选择由原点正则性或无穷远行为的物理条件决定"],
        formulas: ["方程：x^2 y'' + x y' + (x^2 - nu^2) y = 0", "级数解：J_nu(x) = sum_{m>=0} ((-1)^m / (m! Gamma(m + nu + 1))) (x/2)^{2m + nu}", "原点行为：J_nu(x) ~ (x/2)^nu / Gamma(nu + 1)，Y_nu(x) ~ -(Gamma(nu)/pi)(2/x)^nu（nu > 0），Y_0(x) ~ (2/pi) log x", "整数阶第二解：Y_n = lim_{nu -> n} (J_nu cos(nu pi) - J_{-nu}) / sin(nu pi)，含 log x 项", "大变量渐近：J_nu(x) ~ sqrt(2/(pi x)) cos(x - nu pi/2 - pi/4)，Y_nu(x) ~ sqrt(2/(pi x)) sin(x - nu pi/2 - pi/4)", "递推：J_{nu-1}(x) + J_{nu+1}(x) = (2 nu / x) J_nu(x)，J_nu'(x) = (J_{nu-1} - J_{nu+1}) / 2", "Wronskian：W(J_nu, Y_nu) = 2/(pi x)，恒不为零故两解独立", "修正 Bessel：I_nu 与 K_nu 满足 x^2 y'' + x y' - (x^2 + nu^2) y = 0，分别指数增长与指数衰减"],
        theorems: ["整数阶时 J_{-n} = (-1)^n J_n，故 J_nu 与 J_{-nu} 线性相关，第二解必须取 Y_n 并含 log x：这是指标差为整数导致对数解的典型实例，用 J_{-n} 作第二解是错误的", "J_nu 的零点全为实且单重（nu > -1），相邻阶零点交错（J_nu 与 J_{nu+1} 的零点互相分离），零点渐近为 j_{nu,k} ~ (k + nu/2 - 1/4) pi，这是柱域特征值问题的谱结构来源", "大变量渐近显示 Bessel 函数是振幅按 x^{-1/2} 衰减的振荡函数，衰减来自二维柱面波的几何扩散；把它误认为指数衰减会给出错误的辐射条件", "渐近展开的相位 -nu pi/2 - pi/4 不可省：遗漏 pi/4 会使零点位置与相位匹配全部错位，这是数值与物理计算中最易出错的常数", "修正 Bessel 的两解行为截然不同（I_nu 指数增长、K_nu 指数衰减），有界性条件唯一选出 K_nu；把 J、Y 的振荡直觉搬到 I、K 上会得到定性错误的解", "向上递推 J_{nu+1} = (2 nu/x) J_nu - J_{nu-1} 在 nu > x 时数值不稳定（相对误差被放大），稳定算法需向下递推并归一化（Miller 算法），故递推关系正确不等于数值可用"],
        generalRequirements: ["必须根据原点正则性或无穷远条件说明所选解", "整数阶必须使用含对数的第二解", "使用大变量渐近必须完整写出相位常数"],
        forbiddenErrors: ["【整数阶第二解错】用 J_{-n} 作整数阶的独立第二解", "【相位遗漏】渐近式中漏掉 -pi/4 或 -nu pi/2", "【衰减类型错】把 J_nu 的 x^{-1/2} 代数衰减写成指数衰减", "【修正函数混用】用 I_nu 满足无穷远有界条件", "【递推数值滥用】在 nu > x 区域向上递推计算 J_nu", "【原点奇性忽略】在含原点区域保留 Y_nu 而不排除奇性解"],
        parameterConstraints: { orderRange: "nu 可为任意实数或复数；整数阶需特殊处理第二解", originRegularity: "含原点的区域只允许 J_nu（nu >= 0）", asymptoticRange: "大变量渐近要求 x >> max(1, nu^2)", zeroReality: "nu > -1 时零点全为实且单重", recurrenceStability: "向上递推仅在 nu < x 时数值稳定" },
        closureChecks: ["核对所选解在原点与无穷远的行为是否满足边界条件", "用 Wronskian 验证两解的独立性", "检查渐近相位常数是否完整"],
        scenarioChecks: { cylindricalEigenvalue: ["由 J_nu 的零点确定圆盘上 Laplace 特征值"], solutionSelection: ["按原点正则性与无穷远条件在 J、Y、I、K 中选定解"], largeArgumentEstimate: ["用 sqrt(2/(pi x)) 振荡渐近估计幅值并核对相位"] },
    },
    // 正交多项式的 Favard 定理与零点性质。
    "specfn-orthogonal-polynomial-zeros": {
        definitions: ["关于正测度正交的多项式序列必满足三项递推，其系数结构（Jacobi 矩阵）与测度一一对应（Favard 定理）；其零点全落在测度支撑的凸包内并具有严格分离与交错性质"],
        formulas: ["正交性：int p_m(x) p_n(x) d mu(x) = delta_{mn} h_n，h_n > 0", "三项递推：x p_n(x) = a_n p_{n+1}(x) + b_n p_n(x) + a_{n-1} p_{n-1}(x)，a_n > 0，b_n 实", "Jacobi 矩阵：以 b_n 为对角、a_n 为次对角的对称三对角矩阵，其 n 阶截断的特征值即 p_n 的零点", "Christoffel-Darboux：sum_{k=0}^{n} p_k(x) p_k(y) / h_k = (a_n / h_n) (p_{n+1}(x) p_n(y) - p_n(x) p_{n+1}(y)) / (x - y)", "对角形式：sum_{k=0}^{n} p_k(x)^2 / h_k = (a_n / h_n)(p_{n+1}'(x) p_n(x) - p_n'(x) p_{n+1}(x))", "Gauss 求积：n 点公式取 p_n 的零点为节点，权 w_i > 0，代数精度 2n - 1", "零点交错：p_n 的 n 个零点严格分离 p_{n+1} 的相邻零点", "经典权：Jacobi (1-x)^alpha (1+x)^beta、Laguerre x^alpha e^{-x}、Hermite e^{-x^2}"],
        theorems: ["Favard 定理是双向的：任给 a_n > 0 与实 b_n 的三项递推，由其生成的多项式序列必关于某个正 Borel 测度正交，故三项递推与正交性完全等价；a_n > 0 的正性条件不可省，否则测度不必为正", "零点全为实、单重且落在支撑凸包内部，其原因是 Jacobi 截断矩阵对称：把零点问题转化为对称特征值问题是数值求 Gauss 节点的标准做法（Golub-Welsch），比直接求根稳定", "零点交错性给出支撑区间的逐步细分，是 Sturm 型振荡定理在正交多项式上的具体化，也是自适应求积节点嵌套的理论依据", "Christoffel-Darboux 恒等式使 n 项和坍缩为两项之比，其对角形式给出核函数正定性并直接推出 Gauss 求积权全为正，进而给出求积公式的稳定性（无正负相消放大）", "Gauss 求积的 2n - 1 代数精度是 n 节点公式的最优值（不可能达到 2n），证明用 p_n^2 作反例；声称 n 点公式可达 2n 精度必错", "只有 Jacobi、Laguerre、Hermite 三族（至多相差仿射变换）满足二阶微分方程（Bochner 定理），故不能对任意正交多项式族套用经典微分方程与 Rodrigues 公式"],
        generalRequirements: ["必须写出权函数或测度并检验其正性与矩的有限性", "使用递推必须给出 a_n > 0 的验证", "零点相关论断必须说明落在支撑凸包内"],
        forbiddenErrors: ["【递推系数负】使用 a_n <= 0 的递推却断言正交性", "【零点越界】声称零点可落在支撑区间之外", "【求积精度夸大】称 n 点 Gauss 公式代数精度为 2n", "【权正性遗漏】给出含负权的 Gauss 型公式而不说明其非 Gauss 性", "【微分方程滥用】对非经典族套用二阶微分方程或 Rodrigues 公式", "【交错性反用】由交错性断言零点重合或跨越"],
        parameterConstraints: { measurePositivity: "需正 Borel 测度且各阶矩有限", recurrencePositivity: "a_n > 0 是 Favard 定理的必要条件", supportConvexHull: "零点位于 supp(mu) 的凸包内部", quadratureNodes: "n 点 Gauss 节点为 p_n 的零点，权全正", classicalFamilies: "满足二阶微分方程的仅 Jacobi、Laguerre、Hermite 三族" },
        closureChecks: ["检验递推系数的正性与实性", "核对零点个数、实性与位置区间", "用低阶情形验证 Gauss 求积的代数精度"],
        scenarioChecks: { favardConstruction: ["由三项递推系数构造 Jacobi 矩阵并说明对应测度存在"], gaussQuadrature: ["用 p_n 零点与正权构造求积公式并验证 2n-1 精度"], zeroInterlacing: ["比较相邻阶零点位置验证严格交错"] },
    },
    // 球调和函数与连带 Legendre 函数。
    "specfn-spherical-harmonics": {
        definitions: ["球调和函数是球面 Laplace-Beltrami 算子的特征函数，等价于齐次调和多项式在单位球面上的限制；它们构成球面 L^2 的完备正交基，并按旋转群的不可约表示分解"],
        formulas: ["定义：Y_l^m(theta, phi) = N_{lm} P_l^m(cos theta) e^{i m phi}，-l <= m <= l", "归一化：N_{lm} = sqrt((2l+1)(l-m)! / (4 pi (l+m)!))", "特征值：Delta_{S^2} Y_l^m = -l(l+1) Y_l^m", "维数：固定 l 的特征空间维数为 2l + 1（在 S^{n-1} 上为齐次调和多项式空间维数）", "连带 Legendre：P_l^m(x) = (-1)^m (1 - x^2)^{m/2} d^m P_l(x) / dx^m", "Rodrigues：P_l(x) = (1 / (2^l l!)) d^l (x^2 - 1)^l / dx^l", "加法定理：sum_{m=-l}^{l} Y_l^m(u) conj(Y_l^m(v)) = ((2l+1)/(4 pi)) P_l(u . v)", "多极展开：1 / |x - y| = sum_l (r_<^l / r_>^{l+1}) P_l(cos gamma)，r_< < r_>"],
        theorems: ["球调和的完备性给出球面上任意 L^2 函数的展开，其收敛为 L^2 收敛：逐点收敛需额外光滑性，把 L^2 展开当作逐点等式是标准错误", "特征值 -l(l+1) 的重数恰为 2l + 1，且该特征空间是旋转群 SO(3) 的不可约表示：任何旋转把 Y_l^m 映为同一 l 的线性组合（由 Wigner D 矩阵给出），故 l 是旋转不变的量子数而 m 依赖坐标轴选择", "加法定理是旋转不变性的解析表达：右端只依赖两方向夹角，由此推出 Funk-Hecke 定理与球面卷积的对角化，这是球面调和分析的核心机制", "连带 Legendre 函数在 |m| > l 时恒为零，故 m 的范围限制不是约定而是解析事实；越界取值会得到平凡零解并使计数错误", "P_l^m 的正交性只在固定 m 时对 l 成立（不同 m 之间由 e^{i m phi} 因子正交），把两组指标混为一体计算内积会得到错误的归一化常数", "多极展开的收敛依赖 r_< / r_> < 1，展开中心与远近关系一旦颠倒级数即发散；场点与源点的角色不可互换"],
        generalRequirements: ["必须给出归一化约定与 Condon-Shortley 相位约定", "必须写出 m 的取值范围并说明 |m| <= l", "使用展开必须声明收敛类型（L^2 或逐点）"],
        forbiddenErrors: ["【指标越界】使用 |m| > l 的球调和分量", "【逐点收敛误断】把 L^2 展开当作处处逐点相等", "【重数错误】把特征值 -l(l+1) 的重数写成 l 或 l+1", "【归一化混用】在同一计算中混用不同归一化或相位约定", "【正交性误推】对不同 m 的连带 Legendre 直接套用 l 方向正交性", "【多极展开越界】在 r_< > r_> 的情形使用同一展开式"],
        parameterConstraints: { degreeOrder: "l 为非负整数，m 为整数且 |m| <= l", eigenvalue: "球面 Laplace 特征值为 -l(l+1)，重数 2l+1", normalization: "需固定归一化常数与 Condon-Shortley 相位", argumentRange: "P_l^m 的自变量为 cos theta in [-1, 1]", multipoleConvergence: "多极展开要求 r_< / r_> < 1" },
        closureChecks: ["核对 l、m 的取值范围与特征空间维数", "验证归一化常数与所用约定一致", "检查展开的收敛条件与几何配置"],
        scenarioChecks: { laplaceSeparation: ["在球坐标下分离变量得到 Y_l^m 与径向方程"], additionTheorem: ["用加法定理把双方向求和化为 P_l(cos gamma)"], multipoleExpansion: ["按内外区域正确排列 r_< 与 r_> 后展开 Green 函数"] },
    },
    // 椭圆积分与 Jacobi 椭圆函数。
    "specfn-elliptic-integrals-jacobi": {
        definitions: ["椭圆积分是含二次多项式平方根的不可初等化积分，其反函数给出双周期亚纯的 Jacobi 椭圆函数；四分之一周期由完全椭圆积分给出，模与补模的关系决定周期格结构"],
        formulas: ["第一类不完全：F(phi, k) = int_0^phi d theta / sqrt(1 - k^2 sin^2 theta)", "第一类完全：K(k) = F(pi/2, k)，补模 k' = sqrt(1 - k^2)，K'(k) = K(k')", "第二类完全：E(k) = int_0^{pi/2} sqrt(1 - k^2 sin^2 theta) d theta", "Jacobi 函数：u = F(phi, k) 时 sn(u, k) = sin phi，cn(u, k) = cos phi，dn(u, k) = sqrt(1 - k^2 sn^2 u)", "恒等式：sn^2 + cn^2 = 1，dn^2 + k^2 sn^2 = 1", "导数：d(sn u)/du = cn u dn u", "周期：sn 与 cn 的实周期为 4K，dn 为 2K；虚周期分别为 2iK'、4iK'、4iK'", "Legendre 关系：E K' + E' K - K K' = pi/2；AGM 迭代给出 K(k) = pi / (2 M(1, k'))"],
        theorems: ["椭圆积分不可用初等函数表出（Liouville 意义下），这是定义新函数的理由；把 K(k) 写成初等闭式的任何尝试必错，只有 k = 0、1 的退化情形有初等值", "Jacobi 椭圆函数是双周期亚纯函数，其两个周期之比非实数：这使它们在周期平行四边形内有确定的零点与极点结构（sn 在 0 与 2K 处零点、在 iK' 与 2K + iK' 处单极点），仅用实周期分析会遗漏极点", "退化极限给出三角与双曲函数：k -> 0 时 sn -> sin、cn -> cos、dn -> 1；k -> 1 时 sn -> tanh、cn = dn -> sech，故 Jacobi 函数是三角函数的双周期推广，而 K(k) 在 k -> 1 时按 log(4/k') 对数发散", "K 与 K' 满足同一超几何方程（K = (pi/2) 2F1(1/2, 1/2; 1; k^2)），其解的连接给出模变换与 Legendre 关系，这是椭圆积分与超几何理论的接口", "AGM 迭代二次收敛地计算 K，是高精度计算 pi 与椭圆积分的标准算法；直接对被积函数在 k 接近 1 时数值积分会因端点近奇性而精度骤降", "参数约定必须固定：文献中同时使用模 k 与参数 m = k^2，二者混用会使数值相差极大，任何计算前必须声明所用约定"],
        generalRequirements: ["必须声明使用模 k 还是参数 m = k^2", "必须给出模的取值范围与退化情形的处理", "涉及周期性必须同时给出实周期与虚周期"],
        forbiddenErrors: ["【初等化】把完全椭圆积分写成初等函数闭式", "【模与参数混用】把 m = k^2 直接当作 k 代入公式", "【单周期分析】只用实周期讨论 Jacobi 函数而忽略虚周期与极点", "【退化误断】在 k -> 1 时给出 K 的有限极限", "【恒等式错写】写出 dn^2 + sn^2 = 1 之类漏掉 k^2 因子的关系", "【端点数值积分】在 k 接近 1 时直接数值积分而不换用 AGM"],
        parameterConstraints: { modulusRange: "通常取 0 <= k < 1，k' = sqrt(1 - k^2)", conventionChoice: "需固定模 k 或参数 m = k^2 的约定", periodStructure: "sn 的周期为 4K 与 2iK'，需同时给出", degenerateLimits: "k = 0 退化为三角函数，k -> 1 时 K 对数发散", agmConvergence: "AGM 迭代对 0 < k < 1 二次收敛" },
        closureChecks: ["核对所用参数约定并统一到同一记号", "验证 sn、cn、dn 的两条平方恒等式", "在 k -> 0 极限下检验退化为三角函数"],
        scenarioChecks: { pendulumPeriod: ["用 K(k) 表示单摆大幅振动周期并给出小幅极限"], jacobiInversion: ["由第一类不完全积分反演定义 sn 并给出周期"], agmComputation: ["用 AGM 迭代计算 K 并说明二次收敛的迭代次数"] },
    },
    // Airy 函数与转点附近的连接。
    "specfn-airy-turning-point": {
        definitions: ["Airy 方程是最简单的含转点线性方程，其解在转点两侧分别呈振荡与指数行为；Airy 函数给出转点邻域的一致近似，是渐近解在转点处相互连接的标准桥梁"],
        formulas: ["方程：y'' - x y = 0", "积分表示：Ai(x) = (1/pi) int_0^inf cos(t^3/3 + x t) dt", "级数起点：Ai(0) = 1 / (3^{2/3} Gamma(2/3))，Ai'(0) = -1 / (3^{1/3} Gamma(1/3))", "正向渐近（x -> +inf）：Ai(x) ~ exp(-(2/3) x^{3/2}) / (2 sqrt(pi) x^{1/4})，Bi(x) ~ exp((2/3) x^{3/2}) / (sqrt(pi) x^{1/4})", "负向渐近（x -> -inf）：Ai(-x) ~ sin((2/3) x^{3/2} + pi/4) / (sqrt(pi) x^{1/4})", "与 Bessel 的关系：Ai(x) = (1/pi) sqrt(x/3) K_{1/3}((2/3) x^{3/2})", "Wronskian：W(Ai, Bi) = 1/pi", "连接公式：转点处振荡侧的相位常数为 pi/4，衰减侧系数按 1/2 与 1 的比例匹配"],
        theorems: ["转点是渐近解失效的位置：一般的指数型渐近近似在转点处的分母含 (势差)^{1/4} 而趋于零，故必须用 Airy 函数作局部一致近似再向两侧匹配，直接跨转点延拓渐近解是错误的", "连接公式中的相位 pi/4 与系数 1/2 不是可调常数，它们由 Airy 函数的精确渐近确定；相位取错会使量子化条件出现 1/2 的偏移，从而给出错误的特征值序列", "Ai 在 x > 0 指数衰减而 Bi 指数增长，有界性条件唯一选出 Ai：在半无界问题中保留 Bi 分量会使解在无穷远处发散，物理与数学上都不可接受", "Ai 的零点全为负实数（无正零点），其渐近位置由 (2/3)|a_n|^{3/2} ~ (n - 1/4) pi 给出，这直接给出线性势阻挡问题的能级渐近", "Airy 函数是抛物型 caustic 的普遍局部形式（Berry 的折叠 catastrophe），因此转点分析的结论对任意具有单一简单转点的方程一致成立，但对二阶转点（势的一阶导数也为零）必须换用更高阶的 catastrophe 函数", "在复平面上 Ai 的渐近展开在不同扇形有不同主导项，Stokes 线上两项同阶，跨越 Stokes 线时必须切换表示；只用一个渐近式覆盖全复平面会得到错误的指数小项"],
        generalRequirements: ["必须指明转点位置并说明近似在其邻域的有效范围", "使用连接公式必须完整给出相位与系数常数", "无界区域必须由有界性条件排除增长解"],
        forbiddenErrors: ["【跨转点直接延拓】不作 Airy 匹配即把渐近解从振荡侧延拓到衰减侧", "【相位常数错】连接时把 pi/4 写成 pi/2 或省略", "【增长解保留】在半无界问题中保留 Bi 分量", "【零点位置错】声称 Ai 存在正零点", "【高阶转点套用】对二阶转点仍使用标准 Airy 连接", "【Stokes 线忽略】在整个复平面用同一渐近表示"],
        parameterConstraints: { turningPointSimple: "标准连接要求转点为简单零点（势的一阶导数非零）", boundednessCondition: "无界区域由有界性选取 Ai", asymptoticValidity: "两侧渐近式要求距转点足够远，(2/3)|x|^{3/2} >> 1", zeroLocation: "Ai 的零点全为负实数", sectorDependence: "复参数需按扇形与 Stokes 线切换渐近表示" },
        closureChecks: ["核对转点两侧解的类型（振荡 / 指数）是否正确对应", "验证连接公式中的相位与系数", "检查所选解在无穷远处是否满足有界性"],
        scenarioChecks: { wkbMatching: ["在转点邻域用 Airy 近似把振荡解与衰减解连接并读出相位"], eigenvalueQuantization: ["由连接相位导出含 1/2 修正的量子化条件"], zeroAsymptotics: ["用 (2/3)|a_n|^{3/2} ~ (n - 1/4) pi 估计 Airy 零点位置"] },
    },
};
