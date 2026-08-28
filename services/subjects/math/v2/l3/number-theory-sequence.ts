import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数论-特殊数列”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMBER_THEORY_SEQUENCE_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 线性递推的特征根法与 Binet 型闭式。
    "linear-recurrence-characteristic-roots": {
        id: "linear-recurrence-characteristic-roots", l2Key: "number-theory-sequence", name: "线性递推特征根法与 Binet 公式", kind: "theorem",
        aliases: ["特征根法", "Binet公式", "线性递推通项", "characteristic root", "重根情形"],
    },
    // Lucas 序列与强整除性质。
    "lucas-sequence-divisibility": {
        id: "lucas-sequence-divisibility", l2Key: "number-theory-sequence", name: "Lucas 序列与强整除性", kind: "theorem",
        aliases: ["Lucas序列", "Lucas sequence", "强整除序列", "Fibonacci整除性", "秩与出现律"],
    },
    // Pisano 周期：Fibonacci 数列模 n 的周期结构。
    "pisano-period": {
        id: "pisano-period", l2Key: "number-theory-sequence", name: "Pisano 周期", kind: "object",
        aliases: ["Pisano周期", "Pisano period", "模周期", "递推序列周期性"],
    },
    // 有理生成函数与线性递推的等价。
    "rational-generating-function": {
        id: "rational-generating-function", l2Key: "number-theory-sequence", name: "有理生成函数与线性递推等价", kind: "theorem",
        aliases: ["有理生成函数", "生成函数与递推", "rational generating function", "部分分式展开"],
    },
    // Stirling 数：两类 Stirling 数与基变换。
    "stirling-numbers": {
        id: "stirling-numbers", l2Key: "number-theory-sequence", name: "两类 Stirling 数", kind: "object",
        aliases: ["Stirling数", "第一类Stirling数", "第二类Stirling数", "Stirling numbers", "下降阶乘基变换"],
    },
    // Bell 数：集合分拆计数与 Touchard 同余。
    "bell-numbers": {
        id: "bell-numbers", l2Key: "number-theory-sequence", name: "Bell 数", kind: "object",
        aliases: ["Bell数", "Bell numbers", "集合分拆数", "Dobinski公式", "Touchard同余"],
    },
    // Bernoulli 数与 Faulhaber 公式、von Staudt-Clausen 定理。
    "bernoulli-numbers-faulhaber": {
        id: "bernoulli-numbers-faulhaber", l2Key: "number-theory-sequence", name: "Bernoulli 数与 Faulhaber 公式", kind: "formula",
        aliases: ["Bernoulli数", "伯努利数", "Faulhaber公式", "幂和公式", "von Staudt-Clausen定理"],
    },
    // 分拆数：Euler 乘积、五边形数定理与渐近式。
    "partition-euler-pentagonal": {
        id: "partition-euler-pentagonal", l2Key: "number-theory-sequence", name: "分拆数与五边形数定理", kind: "theorem",
        aliases: ["分拆数", "partition function", "分拆生成函数Euler乘积", "五边形数定理", "Hardy-Ramanujan渐近"],
    },
    // Skolem-Mahler-Lech 定理：线性递推序列零点集的结构。
    "skolem-mahler-lech-theorem": {
        id: "skolem-mahler-lech-theorem", l2Key: "number-theory-sequence", name: "Skolem-Mahler-Lech 定理", kind: "theorem",
        aliases: ["Skolem-Mahler-Lech定理", "零点集结构", "Skolem问题", "递推序列零点"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMBER_THEORY_SEQUENCE_L3_RULES: Record<string, MathV2L3Rules> = {
    // 特征根法：常系数线性递推的通项与重根修正。
    "linear-recurrence-characteristic-roots": {
        definitions: ["特征根法研究常系数齐次线性递推 a_n = c_1 a_{n-1} + ... + c_k a_{n-k} 的通项闭式：解空间由特征多项式的根决定，重根引入多项式因子。"],
        formulas: ["特征多项式：x^k - c_1 x^{k-1} - ... - c_k = 0。", "相异根：a_n = ∑_i A_i r_i^n，系数 A_i 由 k 个初值线性方程唯一确定。", "重根（r 的重数 m）：贡献 (A_0 + A_1 n + ... + A_{m-1} n^{m-1}) r^n。", "Binet 公式：F_n = (φ^n - ψ^n)/√5，φ = (1+√5)/2，ψ = (1-√5)/2；Lucas 数 L_n = φ^n + ψ^n。"],
        theorems: ["解空间定理：k 阶常系数齐次线性递推的解构成 k 维向量空间，上述根基底给出其完整基。", "矩阵形式：a_n 由转移矩阵幂给出，例如 [[1,1],[1,0]]^n = [[F_{n+1}, F_n], [F_n, F_{n-1}]]，故 F 的增长率为最大特征值 φ。", "非齐次情形：通解 = 齐次通解 + 特解；特解形式须按右端项与特征根是否共振（右端指数底与某根相同）选取并升幂。"],
        generalRequirements: ["必须先写出特征多项式并判定根的重数。", "系数必须由与阶数相同数量的初值联立解出并回代验证。"],
        forbiddenErrors: ["【重根未修正】重根情形仍写 A r^n 而不乘 n 的多项式因子。", "【初值数量不足】用少于 k 个初值确定系数。", "【共振忽略】非齐次项与特征根共振时特解未升幂（漏乘 n）。", "【实数化遗漏】复根情形未把结论写成实形式（r^n cos/sin）而声称序列非实。"],
        parameterConstraints: { constantCoefficients: "递推系数为常数（非变系数）。", initialValues: "需给出 k 个初值。", rootMultiplicity: "通项形式按各根重数分配多项式次数，且总维数等于 k。" },
        closureChecks: ["解特征多项式并列出各根与重数。", "由初值解系数并回代若干项验证。", "如为非齐次，核对特解与共振修正。"],
        scenarioChecks: { fibonacciClosedForm: ["Binet 公式配合 |ψ| < 1 给出 F_n 的最近整数近似 φ^n/√5。"], matrixPowerMethod: ["用转移矩阵快速幂在 O(log n) 时间计算第 n 项（模意义下亦可）。"], growthRateEstimate: ["最大模特征根决定序列的指数增长率与渐近主项。"] },
    },
    // Lucas 序列：U_n、V_n 的整除性与强整除性质。
    "lucas-sequence-divisibility": {
        definitions: ["Lucas 序列是由参数 (P, Q) 决定的两族二阶递推序列 U_n(P, Q)、V_n(P, Q)，它们的整除性质（强整除、出现律与重复律）统一了 Fibonacci、Mersenne 等序列的算术行为。"],
        formulas: ["递推：U_0 = 0，U_1 = 1；V_0 = 2，V_1 = P；两者同满足 X_{n+1} = P X_n - Q X_{n-1}。", "闭式：判别式 D = P^2 - 4Q，根 α, β 时 U_n = (α^n - β^n)/(α - β)，V_n = α^n + β^n。", "强整除性（Q 与 P 互素等标准条件下）：gcd(U_m, U_n) = U_{gcd(m, n)}；特别地 m | n ⇒ U_m | U_n。", "出现律：素数 p ∤ 2QD 时 p | U_{r} 的最小 r（称 p 的秩）整除 p - (D/p)。"],
        theorems: ["强整除定理：Fibonacci 序列满足 gcd(F_m, F_n) = F_{gcd(m,n)}，一般 Lucas 序列在 gcd(P, Q) = 1 时同样成立。", "出现律与重复律：p 的秩 r 存在且 p | U_n ⇔ r | n；p^{k} 层的秩通常为 p^{k-1} r（野例外需单独验证）。", "Lucas-Lehmer 判据：Mersenne 数 M_p = 2^p - 1 素性由序列 s_{i+1} = s_i^2 - 2（s_1 = 4）模 M_p 是否终止于 0 判定，本质是 Lucas 序列的秩条件。"],
        generalRequirements: ["使用强整除性必须核对参数条件（典型 gcd(P, Q) = 1）。", "使用出现律必须排除 p | 2QD 的例外素数。"],
        forbiddenErrors: ["【强整除滥用】对不满足 gcd(P, Q) = 1 或非 Lucas 型序列断言 gcd(U_m, U_n) = U_{gcd(m,n)}。", "【U 与 V 混用】把 V_n 的整除性质当作 U_n 的（V 不是强整除序列）。", "【例外素数忽略】对 p | D 或 p | Q 使用秩整除 p - (D/p)。", "【素性判据误用】把 Lucas 序列的必要条件当作素性充分条件而不核对完整判据。"],
        parameterConstraints: { parameters: "P, Q 为整数，标准结论要求 gcd(P, Q) = 1。", discriminant: "D = P^2 - 4Q；出现律要求 p ∤ 2QD。", indexing: "U_0 = 0、U_1 = 1 与 V_0 = 2、V_1 = P 的初值约定不可混用。" },
        closureChecks: ["写出 (P, Q)、D 与初值约定。", "验证所用整除结论的前提（互素、例外素数）。", "用小规模数值核对秩与整除关系。"],
        scenarioChecks: { fibonacciGcd: ["gcd(F_m, F_n) = F_{gcd(m,n)} 用于处理 Fibonacci 的整除与互素问题。"], primalityTesting: ["Lucas-Lehmer 与强 Lucas 伪素数测试基于秩条件，常与 Miller-Rabin 组合使用。"], zsygmondyPrimitiveDivisor: ["用本原素因子（Zsygmondy/Bilu-Hanrot-Voutier）结论排除 U_n 无新素因子的例外指标。"] },
    },
    // Pisano 周期：Fibonacci 模 n 的周期与其素幂结构。
    "pisano-period": {
        definitions: ["Pisano 周期 π(n) 是 Fibonacci 数列模 n 的最小正周期；更一般地任意整系数线性递推在模 n 下最终周期，是模意义下计算大指标项的基础。"],
        formulas: ["周期性来源：模 n 的状态 (F_k, F_{k+1}) 取值有限且转移矩阵可逆（det = -1），故序列纯周期。", "乘性分解：π(lcm(m, n)) = lcm(π(m), π(n))，特别地 π(∏ p_i^{k_i}) = lcm_i π(p_i^{k_i})。", "素幂层：已知情形下 π(p^k) = p^{k-1} π(p)（未发现反例，等价于 Wall-Sun-Sun 素数不存在）。", "素数层：p ≡ ±1 (mod 5) 时 π(p) | p - 1；p ≡ ±2 (mod 5) 时 π(p) | 2(p + 1)；且 π(n) ≤ 6n。"],
        theorems: ["纯周期定理：Fibonacci 模 n 的序列是纯周期（无预周期），因为转移矩阵在 Z/n 上可逆。", "周期的乘性分解定理：π 在互素模上取 lcm，故计算归约为素幂情形。", "π(p) 与 p 在 Q(√5) 中的分裂形态一致：(5/p) = 1 时分裂对应 π(p) | p - 1，(5/p) = -1 时惰性对应 π(p) | 2(p+1)。"],
        generalRequirements: ["必须区分「周期」与「秩（首次出现 0 的位置）」，两者一般不等（π(p) 是秩的 1、2 或 4 倍）。", "使用乘性分解前必须把模完全分解为素幂。"],
        forbiddenErrors: ["【周期与秩混淆】把首次 F_r ≡ 0 的 r 当作周期。", "【乘性误写】写 π(mn) = π(m)π(n) 而非 lcm。", "【素幂公式滥用】把 π(p^k) = p^{k-1}π(p) 当作已证明的一般定理而不声明其与 Wall-Sun-Sun 素数的关联。", "【预周期误设】断言 Fibonacci 模 n 存在非周期前段。"],
        parameterConstraints: { modulus: "n ≥ 2；分解为素幂后用 lcm 合并。", invertibility: "纯周期性依赖转移矩阵在 Z/n 上可逆（det = ±1）。", legendreCondition: "素数层的整除条件按 (5/p) 分类。" },
        closureChecks: ["分解 n 为素幂并分别求 π(p^k)。", "取 lcm 得到 π(n) 并用序列前若干项验证周期。", "如需 F_N mod n，先把 N 化归到 N mod π(n)。"],
        scenarioChecks: { largeIndexModulo: ["计算 F_N mod n（N 极大）时先求 π(n) 再降指标。"], quadraticFieldLink: ["用 (5/p) 判定 p 的分裂形态从而给出 π(p) 的整除约束。"], generalRecurrencePeriod: ["一般线性递推模 n 只保证最终周期；转移矩阵不可逆时存在预周期。"] },
    },
    // 有理生成函数 ⇔ 常系数线性递推。
    "rational-generating-function": {
        definitions: ["该定理刻画生成函数的有理性与线性递推的等价：序列最终满足常系数线性递推当且仅当其普通生成函数是有理函数，分母的倒多项式即特征多项式。"],
        formulas: ["生成函数：A(x) = ∑_{n ≥ 0} a_n x^n。", "等价关系：a_n = c_1 a_{n-1} + ... + c_k a_{n-k}（n ≥ k）⇔ A(x) = P(x)/Q(x)，Q(x) = 1 - c_1 x - ... - c_k x^k，deg P < k（含初值修正项）。", "部分分式展开：Q 的根为 1/r_i 时 A(x) = ∑_i B_i/(1 - r_i x) 给出 a_n = ∑_i B_i r_i^n；重根产生 1/(1 - r x)^m 项与 C(n + m - 1, m - 1) r^n 型系数。", "Fibonacci 实例：∑ F_n x^n = x/(1 - x - x^2)。"],
        theorems: ["有理性判据（Kronecker）：A(x) 有理 ⇔ 由 a_{i+j} 构成的 Hankel 行列式序列从某阶起全为 0，即序列的线性复杂度有限。", "分母的因式分解决定渐近行为：离原点最近的极点 1/r（r 为最大模特征根）给出 a_n 的指数增长率，极点阶数给出多项式因子。", "闭包性质：有理生成函数在加法、Cauchy 乘积与 Hadamard 乘积下封闭，故线性递推序列的和、卷积、逐项乘积仍满足线性递推。"],
        generalRequirements: ["写出 A(x) = P/Q 必须同时给出初值造成的分子修正与 deg P < deg Q 的核验（否则先做多项式除法）。", "使用部分分式必须区分单极点与重极点的系数形式。"],
        forbiddenErrors: ["【分母倒序错写】把 Q(x) 写成特征多项式本身而非其倒多项式 1 - c_1x - ... - c_kx^k。", "【初值项遗漏】只按递推写分母而未用初值确定分子。", "【重极点系数错算】重极点仍按 B r^n 展开而漏掉 C(n+m-1, m-1) 因子。", "【收敛半径忽略】在 |x| ≥ 1/|r_max| 处使用形式展开当作数值等式。"],
        parameterConstraints: { formalSeries: "等式在形式幂级数意义下成立；数值使用需 |x| < 1/max|r_i|。", degreeCondition: "标准形式要求 deg P < deg Q = k。", constantCoefficients: "有理性对应常系数递推；变系数递推一般给出 D-finite（微分有限）而非有理。" },
        closureChecks: ["由递推与初值算出 P、Q 并核对前若干系数。", "部分分式展开得到闭式并与特征根法结果一致性核验。", "如需渐近，读出最小模极点及其阶。"],
        scenarioChecks: { closedFormExtraction: ["用部分分式从 A(x) 反读通项，处理重根时引入组合系数。"], asymptoticFromPoles: ["由主极点位置与阶给出 a_n ~ C n^{m-1} r^n 的渐近主项。"], hadamardProduct: ["逐项乘积（如 a_n b_n）仍线性递推，可用于构造新序列的递推阶上界。"] },
    },
    // 两类 Stirling 数：幂基与下降阶乘基之间的变换。
    "stirling-numbers": {
        definitions: ["Stirling 数给出多项式的幂基与下降阶乘基之间的转换系数：第二类 S(n, k) 计数把 n 元集分成 k 个非空块的方案，第一类（无符号）c(n, k) 计数 n 元置换含 k 个循环的个数。"],
        formulas: ["递推：S(n, k) = S(n-1, k-1) + k·S(n-1, k)；c(n, k) = c(n-1, k-1) + (n-1)·c(n-1, k)。", "基变换：x^n = ∑_k S(n, k) (x)_k，(x)_n = x(x-1)...(x-n+1) = ∑_k s(n, k) x^k，其中 s(n, k) = (-1)^{n-k} c(n, k)。", "显式公式：S(n, k) = (1/k!) ∑_{j=0}^{k} (-1)^j C(k, j) (k - j)^n。", "指数生成函数：∑_{n ≥ k} S(n, k) x^n/n! = (e^x - 1)^k/k!；∑_{n ≥ k} c(n, k) x^n/n! = (-log(1-x))^k/k!。"],
        theorems: ["两类 Stirling 数构成互逆的下三角变换矩阵：∑_k s(n, k) S(k, m) = δ_{nm}，即幂基与下降阶乘基互相转换。", "组合解释：S(n, k) 为集合分拆计数，c(n, k) 为置换循环计数；由此 ∑_k c(n, k) = n!，∑_k S(n, k) = B_n（Bell 数）。", "同余与算术性质：S(n, k) 与 c(n, k) 的素模性质可用于导出 Bell 数的 Touchard 同余与置换统计的算术结论。"],
        generalRequirements: ["必须明确所用的是第一类还是第二类、有符号还是无符号，并给出对应记号。", "使用显式公式或 EGF 必须声明边界约定 S(0,0) = 1、S(n,0) = 0 (n ≥ 1)。"],
        forbiddenErrors: ["【两类混用】把 S(n, k) 的递推系数 k 与第一类的 (n-1) 互换。", "【符号遗漏】把有符号 s(n, k) 与无符号 c(n, k) 等同。", "【基变换方向反用】用 S 做「下降阶乘 → 幂」的转换（该方向应用 s）。", "【边界值错设】取 S(n, 0) = 1（n ≥ 1）或 S(n, k) 在 k > n 时非零。"],
        parameterConstraints: { indexRange: "0 ≤ k ≤ n；k > n 时两类 Stirling 数为 0。", boundary: "S(0,0) = c(0,0) = 1，S(n,0) = c(n,0) = 0（n ≥ 1）。", signConvention: "s(n, k) = (-1)^{n-k} c(n, k)。" },
        closureChecks: ["核对递推与边界值并计算小表验证。", "用基变换恒等式在 n = 2, 3 上双向核验。", "如用 EGF，检查 (e^x - 1)^k/k! 与 (-log(1-x))^k/k! 的对应关系。"],
        scenarioChecks: { surjectionCount: ["从 n 元集到 k 元集的满射个数为 k!·S(n, k)。"], powerSumConversion: ["把 ∑ i^n 型和用 x^n = ∑ S(n,k)(x)_k 转成组合数求和。"], permutationStatistics: ["置换循环数分布由 c(n, k) 给出，其生成函数为 ∏(x + i)。"] },
    },
    // Bell 数：集合分拆总数、Dobinski 公式与 Touchard 同余。
    "bell-numbers": {
        definitions: ["Bell 数 B_n 计数 n 元集合的全部分拆（块数不限），是第二类 Stirling 数在块数上的求和，具有指数生成函数与素模同余的独特结构。"],
        formulas: ["Stirling 求和：B_n = ∑_{k=0}^{n} S(n, k)，B_0 = 1。", "递推：B_{n+1} = ∑_{k=0}^{n} C(n, k) B_k。", "指数生成函数：∑_{n ≥ 0} B_n x^n/n! = e^{e^x - 1}。", "Dobinski 公式：B_n = e^{-1} ∑_{k ≥ 0} k^n/k!。"],
        theorems: ["Bell 三角（Aitken 数组）给出 B_n 的逐行递推构造，与上述二项递推等价。", "Touchard 同余：p 素数时 B_{p+n} ≡ B_n + B_{n+1} (mod p)；特别地 B_p ≡ 2 (mod p)。", "Bell 数模 p 的序列是周期的，其周期整除 (p^p - 1)/(p - 1)。"],
        generalRequirements: ["使用递推必须固定 B_0 = 1 的初值约定。", "使用 Dobinski 公式必须说明其为收敛的无穷级数（不是有限和）。"],
        forbiddenErrors: ["【递推系数错写】把 B_{n+1} = ∑ C(n,k)B_k 写成 ∑ C(n+1,k)B_k。", "【EGF 与 OGF 混用】把 e^{e^x - 1} 当作普通生成函数。", "【Touchard 越界】对合数模使用 B_{p+n} ≡ B_n + B_{n+1}。", "【有序分拆混淆】把有序分拆（Fubini 数）计入 B_n。"],
        parameterConstraints: { initialValue: "B_0 = 1（空集恰有一个分拆）。", primeModulus: "Touchard 同余要求 p 为素数。", seriesConvergence: "Dobinski 公式为无穷级数，需在实数意义下求和。" },
        closureChecks: ["用递推或 Bell 三角计算前若干项并核对已知值 1, 1, 2, 5, 15, 52。", "用 EGF 系数比对验证。", "涉及同余时用 Touchard 关系交叉验证若干小素数。"],
        scenarioChecks: { setPartitionCounting: ["计数无标号块的集合分拆用 B_n，块数固定则用 S(n, k)。"], modularPeriodicity: ["求 B_n mod p 的大指标值时先确定模 p 周期。"], asymptoticGrowth: ["B_n 的增长快于任何指数但慢于 n!，渐近由 Dobinski 的鞍点分析给出。"] },
    },
    // Bernoulli 数：幂和公式、zeta 特殊值与 von Staudt-Clausen 定理。
    "bernoulli-numbers-faulhaber": {
        definitions: ["Bernoulli 数由指数生成函数定义，控制幂和的闭式（Faulhaber 公式）、zeta 函数在偶数点与负整数点的取值，并具有精确的分母算术结构。"],
        formulas: ["生成函数：x/(e^x - 1) = ∑_{n ≥ 0} B_n x^n/n!，故 B_0 = 1，B_1 = -1/2，B_2 = 1/6，B_4 = -1/30。", "奇数项：n ≥ 3 为奇数时 B_n = 0。", "Faulhaber 公式：∑_{k=1}^{n} k^m = (1/(m+1)) ∑_{j=0}^{m} C(m+1, j) B_j n^{m+1-j}。", "zeta 联系：ζ(2n) = (-1)^{n+1} B_{2n} (2π)^{2n} / (2·(2n)!)，且 ζ(1-n) = -B_n/n。"],
        theorems: ["von Staudt-Clausen 定理：B_{2n} + ∑_{p - 1 | 2n} 1/p ∈ Z，因此 B_{2n} 的分母恰为 ∏_{p-1 | 2n} p（无平方因子）。", "Kummer 同余与不规则素数：p | B_{2n} 的分子（p 为不规则素数，最小者 37）关系到分圆域类数与 Fermat 大定理的经典部分情形。", "Faulhaber 公式表明 ∑_{k ≤ n} k^m 是 n 的 m+1 次多项式，其首项为 n^{m+1}/(m+1)。"],
        generalRequirements: ["必须声明所用的 B_1 约定（-1/2 的标准约定或某些文献的 +1/2）。", "使用 Faulhaber 公式必须核对求和上界约定（从 1 到 n）与所用 Bernoulli 约定一致。"],
        forbiddenErrors: ["【约定混用】在同一推导中混用 B_1 = -1/2 与 B_1 = +1/2 两套约定。", "【奇数项误设】断言 B_3、B_5 非零。", "【zeta 公式符号错写】漏掉 (-1)^{n+1} 或把 ζ(2n) 的分母写错。", "【分母定理错用】把 von Staudt-Clausen 的条件 p - 1 | 2n 写成 p | 2n。"],
        parameterConstraints: { convention: "标准约定 B_1 = -1/2；ζ(1-n) = -B_n/n 与之匹配。", parity: "非零 Bernoulli 数除 B_1 外均为偶数指标。", faulhaberRange: "幂和公式针对 ∑_{k=1}^{n} k^m，m ≥ 0。" },
        closureChecks: ["由生成函数递推算出所需 B_n 并核对已知值。", "用 Faulhaber 公式在 m = 1, 2, 3 上与经典闭式核对。", "如涉及分母或同余，用 von Staudt-Clausen 验证。"],
        scenarioChecks: { powerSumPolynomial: ["把 ∑ k^m 写成 n 的多项式并用 n = 1, 2 校验系数。"], zetaSpecialValues: ["由 B_{2n} 计算 ζ(2n)，或由 ζ(1-n) = -B_n/n 联系负整数点。"], irregularPrimes: ["讨论分圆域类数或 Kummer 同余时须检查 p 是否整除某个 B_{2n} 的分子。"] },
    },
    // 分拆数：Euler 乘积、五边形数定理与渐近式。
    "partition-euler-pentagonal": {
        definitions: ["分拆数 p(n) 计数把 n 写成无序正整数和的方案数；其生成函数为 Euler 无穷乘积，五边形数定理给出该乘积倒数的显式展开与高效递推。"],
        formulas: ["生成函数：∑_{n ≥ 0} p(n) q^n = ∏_{k ≥ 1} 1/(1 - q^k)（|q| < 1）。", "五边形数定理：∏_{k ≥ 1} (1 - q^k) = ∑_{j ∈ Z} (-1)^j q^{j(3j-1)/2}。", "递推：p(n) = ∑_{j ≥ 1} (-1)^{j-1} [ p(n - j(3j-1)/2) + p(n - j(3j+1)/2) ]（约定 p(m) = 0 当 m < 0，p(0) = 1）。", "Hardy-Ramanujan 渐近：p(n) ~ e^{π√(2n/3)}/(4n√3)，精确值由 Rademacher 收敛级数给出。"],
        theorems: ["Euler 分拆定理族：受限分拆的生成函数由相应乘积给出，例如互不相同部分的分拆数等于奇数部分的分拆数（∏(1+q^k) = ∏ 1/(1-q^{2k-1}))。", "五边形数定理是 Jacobi 三重积的特例，给出 O(n^{3/2}) 复杂度的 p(n) 递推算法。", "Ramanujan 同余：p(5n + 4) ≡ 0 (mod 5)，p(7n + 5) ≡ 0 (mod 7)，p(11n + 6) ≡ 0 (mod 11)，其解释来自模形式与 Hecke 理论。"],
        generalRequirements: ["必须明确分拆是无序的（有序则为组合数 2^{n-1}）并给出 p(0) = 1 的约定。", "使用无穷乘积必须声明形式幂级数意义或 |q| < 1 的收敛条件。"],
        forbiddenErrors: ["【有序无序混淆】把 p(n) 与有序分解（composition）计数混用。", "【五边形指标遗漏】递推中只取 j(3j-1)/2 一支而漏掉 j(3j+1)/2。", "【符号错写】五边形数定理中丢掉 (-1)^j 或把展开写成正项级数。", "【渐近式当精确值】用 Hardy-Ramanujan 主项当作 p(n) 的精确公式。"],
        parameterConstraints: { convention: "p(0) = 1，p(m) = 0 当 m < 0。", convergence: "无穷乘积在 |q| < 1 收敛，形式展开在 Z[[q]] 中进行。", congruenceModuli: "Ramanujan 同余仅对 5、7、11 及其幂的特定形式成立。" },
        closureChecks: ["用五边形数递推计算前若干 p(n) 并核对 1, 1, 2, 3, 5, 7, 11。", "涉及受限分拆时写出对应的生成函数乘积。", "如用渐近式，说明误差量级或引用 Rademacher 精确级数。"],
        scenarioChecks: { restrictedPartitions: ["部分大小或个数受限时用相应乘积/Gauss 二项式系数处理。"], efficientComputation: ["用五边形数递推在 O(n^{3/2}) 内计算 p(n)（可在模意义下进行）。"], modularFormsLink: ["1/∏(1-q^k) 与 η 函数相关，分拆同余由模形式与 Hecke 算子解释。"] },
    },
    // Skolem-Mahler-Lech 定理：线性递推序列零点集的结构。
    "skolem-mahler-lech-theorem": {
        definitions: ["Skolem-Mahler-Lech 定理研究特征为 0 的域上线性递推序列的零点集结构，断言零点集是有限集与有限多个等差数列的并，从而把「某项是否为 0」化为结构性问题。"],
        formulas: ["设 a_n 满足常系数线性递推，Z = { n : a_n = 0 }，则 Z = F ∪ (⋃_{i=1}^{m} A_i)，F 有限，A_i 为等差数列。", "退化根条件：等差数列分支出现当且仅当存在两个特征根之比为单位根（退化序列）。", "非退化情形：若无两根之比为单位根，则零点集有限（Skolem 定理），个数可用 Evertse-van der Poorten-Schlickewei 界控制。"],
        theorems: ["Skolem-Mahler-Lech 定理（Skolem 于 Q、Mahler 于代数数域、Lech 于一般特征 0 域）：零点集为上述形式。", "证明依赖 p-adic 分析与 Skolem-Mahler-Lech 的 p-adic 指数函数插值（p-adic 解析法）；结论对正特征失效（Lech 反例）。", "可判定性：给定递推判断是否存在零项（Skolem 问题）在阶 ≤ 4 时已知可判定，一般阶的可判定性仍未解决。"],
        generalRequirements: ["必须声明系数域特征为 0（结论在正特征失效）。", "断言零点有限必须先验证非退化（无两根之比为单位根）。"],
        forbiddenErrors: ["【正特征误用】在特征 p 的域上套用该定理。", "【退化情形忽略】对根比为单位根的序列断言零点有限。", "【有效性误设】声称定理给出零点的可计算枚举（一般 Skolem 问题可判定性未知）。", "【结构误述】把零点集描述为单个等差数列或必然无限。"],
        parameterConstraints: { characteristic: "系数域特征必须为 0。", recurrenceType: "序列须满足常系数线性递推（有限阶）。", nondegeneracy: "零点有限性要求任意两特征根之比不是单位根。" },
        closureChecks: ["写出特征根并检查是否存在根比为单位根。", "据此判定零点集为有限还是含等差数列分支。", "如需具体零点，说明搜索范围的来源（有效界或阶数 ≤ 4 的判定结果）。"],
        scenarioChecks: { degenerateSequence: ["把退化序列按等差子列拆分后分别分析，每支化为非退化情形。"], padicMethod: ["用 p-adic 插值把 a_n = 0 转为 p-adic 解析函数的零点计数。"], skolemProblemStatus: ["涉及算法判定时必须声明阶数限制与一般情形的未决状态。"] },
    },
};
