import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数论-初等数论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMBER_THEORY_BASIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 二次互反律：奇素数间 Legendre 符号的对称关系。
    "quadratic-reciprocity": {
        id: "quadratic-reciprocity", l2Key: "number-theory-basic", name: "二次互反律", kind: "theorem",
        aliases: ["二次互反律", "quadratic reciprocity"],
    },
    // 中国剩余定理：互素模同余方程组的唯一解与环同构。
    "chinese-remainder-theorem": {
        id: "chinese-remainder-theorem", l2Key: "number-theory-basic", name: "中国剩余定理", kind: "theorem",
        aliases: ["中国剩余定理", "CRT", "Chinese remainder theorem", "孙子定理"],
    },
    // 原根存在定理：(Z/n)^* 循环的充要条件与原根判据。
    "primitive-root-existence": {
        id: "primitive-root-existence", l2Key: "number-theory-basic", name: "原根存在定理", kind: "theorem",
        aliases: ["原根", "原根存在定理", "primitive root"],
    },
    // Euler 定理与 Fermat 小定理：模幂降幂的基本工具。
    "euler-fermat-theorem": {
        id: "euler-fermat-theorem", l2Key: "number-theory-basic", name: "Euler 定理与 Fermat 小定理", kind: "theorem",
        aliases: ["Euler定理", "欧拉定理", "Fermat小定理", "费马小定理"],
    },
    // Möbius 反演与 Dirichlet 卷积：算术函数的乘法结构。
    "mobius-inversion": {
        id: "mobius-inversion", l2Key: "number-theory-basic", name: "Möbius 反演与 Dirichlet 卷积", kind: "theorem",
        aliases: ["Möbius反演", "莫比乌斯反演", "Mobius inversion", "Dirichlet卷积", "乘性函数"],
    },
    // LTE 引理：p-adic 赋值对 x^n ± y^n 的精确计算。
    "lifting-the-exponent": {
        id: "lifting-the-exponent", l2Key: "number-theory-basic", name: "LTE 升幂引理", kind: "lemma",
        aliases: ["LTE引理", "升幂引理", "lifting the exponent"],
    },
    // Hensel 提升引理：模 p 单根到模 p^k 与 Z_p 的唯一提升。
    "hensel-lemma-lifting": {
        id: "hensel-lemma-lifting", l2Key: "number-theory-basic", name: "Hensel 提升引理", kind: "lemma",
        aliases: ["Hensel引理", "Hensel lemma"],
    },
    // Wilson 定理及其逆命题与 Gauss 推广。
    "wilson-theorem": {
        id: "wilson-theorem", l2Key: "number-theory-basic", name: "Wilson 定理", kind: "theorem",
        aliases: ["Wilson定理", "威尔逊定理", "Wilson theorem"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMBER_THEORY_BASIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // 二次互反律：(p/q)(q/p) = (-1)^{((p-1)/2)((q-1)/2)}。
    "quadratic-reciprocity": {
        definitions: ["二次互反律研究奇素数之间二次剩余性的对称性：Legendre 符号 (a/p) 对 gcd(a,p)=1 取 +1（a 是模 p 二次剩余）或 -1，Jacobi 符号 (a/n) 按分母的素因子分解乘性延拓到正奇数 n。"],
        formulas: ["互反律：p ≠ q 为奇素数时 (p/q)(q/p) = (-1)^{((p-1)/2)((q-1)/2)}。", "补充律：(-1/p) = (-1)^{(p-1)/2}，(2/p) = (-1)^{(p^2-1)/8}。", "Euler 判别法：(a/p) ≡ a^{(p-1)/2} (mod p)。", "Jacobi 符号：(a/n) = ∏_i (a/p_i)^{e_i}，其中 n = ∏ p_i^{e_i} 为正奇数。"],
        theorems: ["Gauss 二次互反律：上述符号关系成立；等价地当 p 或 q ≡ 1 (mod 4) 时 (p/q) = (q/p)，当 p ≡ q ≡ 3 (mod 4) 时 (p/q) = -(q/p)。", "Euler 判别法给出 (a/p) 的幂运算刻画，并推出 x^2 ≡ a (mod p) 的解数为 1 + (a/p)。", "Jacobi 符号仍满足互反律与补充律，但 (a/n) = 1 不能推出 a 是模 n 的二次剩余（只有 (a/n) = -1 能否定）。"],
        generalRequirements: ["使用 Legendre 符号前必须验证分母是奇素数且 gcd(a, p) = 1。", "计算链中每一步都必须声明所用的是互反律、补充律还是乘性。"],
        forbiddenErrors: ["【Jacobi 误判】由 (a/n) = 1 断言 a 是模 n 二次剩余。", "【p = 2 误用】对偶素数 2 套用互反律而不使用 (2/p) 补充律。", "【非互素误用】gcd(a, p) ≠ 1 时仍写 (a/p) = ±1（此时符号为 0）。", "【指数符号错算】把 (2/p) 的指数写成 (p-1)/2 或把 (-1/p) 的指数写成 (p^2-1)/8。"],
        parameterConstraints: { primeParity: "互反律要求 p, q 是互不相同的奇素数。", coprimality: "Legendre 符号非零要求 gcd(a, p) = 1。", jacobiDenominator: "Jacobi 符号的分母必须是正奇数。" },
        closureChecks: ["把 a 分解为 -1、2 与奇素数因子，逐项计算符号。", "对每个奇素因子用互反律翻转并对分子取模缩小。", "核对最终结果为 ±1，并在需要时用 Euler 判别法小规模验证。"],
        scenarioChecks: { solvabilityOfQuadraticCongruence: ["先用符号判定 x^2 ≡ a (mod p) 可解，再用 Tonelli-Shanks 求显式根。"], primeSplittingCondition: ["把「p 在 Q(√d) 中分裂」翻译为 (d/p) = 1，用互反律给出 p 的同余类条件。"], jacobiFastEvaluation: ["无需分解分子时用 Jacobi 符号做欧几里得式迭代计算。"] },
    },
    // 中国剩余定理：互素模同余方程组的唯一解与环同构 Z/M ≅ ∏ Z/m_i。
    "chinese-remainder-theorem": {
        definitions: ["中国剩余定理研究同余方程组 x ≡ a_i (mod m_i) 的可解性与解的结构，其本质是剩余环在互素分解下的直积分解。"],
        formulas: ["互素情形通解：x ≡ ∑_i a_i M_i y_i (mod M)，其中 M = ∏ m_i，M_i = M/m_i，y_i M_i ≡ 1 (mod m_i)。", "环同构：Z/M ≅ ∏_i Z/m_i（m_i 两两互素），并限制为单位群同构 (Z/M)^* ≅ ∏_i (Z/m_i)^*。", "非互素两式合并：x ≡ a_1 (mod m_1)、x ≡ a_2 (mod m_2) 有解 ⇔ gcd(m_1, m_2) | a_1 - a_2，此时解唯一模 lcm(m_1, m_2)。"],
        theorems: ["中国剩余定理：m_i 两两互素时方程组恰有一个模 M = ∏ m_i 的解。", "相容性判据：一般模下方程组有解 ⇔ 对每对 i, j 有 a_i ≡ a_j (mod gcd(m_i, m_j))，解唯一模 lcm(m_i)。", "推论：φ 与一般乘性函数的乘性、以及 (Z/p^k)^* 分解下的结构定理均由该环同构导出。"],
        generalRequirements: ["必须先声明模是否两两互素；不互素时必须逐对验证相容条件。", "结论中的模必须写成 ∏ m_i（互素）或 lcm(m_i)（一般情形）。"],
        forbiddenErrors: ["【互素性遗漏】模不互素仍用 M = ∏ m_i 的通解公式。", "【相容性未验】非互素情形直接宣称有解。", "【解的模写错】把一般情形的解模写成 ∏ m_i 而非 lcm。", "【逆元不存在】在 gcd(M_i, m_i) ≠ 1 时仍求 y_i。"],
        parameterConstraints: { moduli: "m_i ≥ 2 为正整数；标准形式要求两两互素。", compatibility: "非互素情形要求 gcd(m_i, m_j) | a_i - a_j。", inverseExistence: "y_i 存在要求 gcd(M_i, m_i) = 1。" },
        closureChecks: ["验证互素性或逐对相容性。", "构造解并回代每个同余式核验。", "声明解的唯一性范围（模 ∏ m_i 或模 lcm）。"],
        scenarioChecks: { multiplicativeFunctionSplit: ["用 Z/M ≅ ∏ Z/m_i 把 φ、σ、d 等乘性函数按素幂拆开计算。"], primePowerReduction: ["把模 n 的方程分解为模 p^k 的子问题求解后再合并。"], nonCoprimeSystem: ["模不互素时先两两合并并检查相容，再迭代到全部方程。"] },
    },
    // 原根存在定理：(Z/n)^* 循环 ⇔ n = 1, 2, 4, p^k, 2p^k。
    "primitive-root-existence": {
        definitions: ["原根理论研究模 n 单位群 (Z/n)^* 何时循环：其生成元称为模 n 的原根，取对数得到的指标把模幂运算线性化。"],
        formulas: ["阶的整除性：ord_n(a) | φ(n)，且 a^k ≡ 1 (mod n) ⇔ ord_n(a) | k。", "幂的阶：ord_n(a^k) = ord_n(a)/gcd(k, ord_n(a))。", "原根判据：gcd(g, n) = 1 且对 φ(n) 的每个素因子 q 都有 g^{φ(n)/q} ≢ 1 (mod n) ⇔ g 是原根。", "原根个数：存在原根时恰有 φ(φ(n)) 个。"],
        theorems: ["原根存在定理：(Z/n)^* 循环 ⇔ n = 1, 2, 4, p^k 或 2p^k（p 为奇素数，k ≥ 1）。", "结构定理：(Z/2^k)^* ≅ Z/2 × Z/2^{k-2}（k ≥ 3），因此模 8 及更高的 2 幂无原根。", "存在原根时指标 ind_g 给出同构 (Z/n)^* ≅ Z/φ(n)，把 x^m ≡ a 化为线性同余 m·ind_g(x) ≡ ind_g(a) (mod φ(n))。"],
        generalRequirements: ["断言存在原根前必须核对 n 属于 1, 2, 4, p^k, 2p^k。", "验证候选原根必须遍历 φ(n) 的全部素因子。"],
        forbiddenErrors: ["【存在性滥用】对任意模 n（如 8, 12, 15）断言存在原根。", "【判据不足】只验证 g^{φ(n)/2} ≢ 1 就断言 g 是原根。", "【阶与 φ 混淆】把 ord_n(a) 直接当作 φ(n)。", "【素因子遗漏】φ(n) 分解不完整导致漏检某个 g^{φ(n)/q}。"],
        parameterConstraints: { modulusForm: "存在原根要求 n ∈ {1, 2, 4, p^k, 2p^k}。", coprimality: "候选 g 必须满足 gcd(g, n) = 1。", factorization: "判据要求给出 φ(n) 的完整素因子分解。" },
        closureChecks: ["核对 n 的形状确认原根存在性。", "分解 φ(n) 并逐素因子检验候选 g。", "如需求解高次同余，转为指标下的线性同余并回代验证。"],
        scenarioChecks: { discreteLogReduction: ["用指标把 x^m ≡ a (mod p) 转为模 φ(p) 的线性同余，解数由 gcd(m, p-1) 控制。"], nthPowerResidueCount: ["模 p 的 m 次剩余恰构成 (Z/p)^* 的指数 gcd(m, p-1) 子群。"], twoPowerModulus: ["模 2^k（k ≥ 3）无原根，须改用 ±5^j 的显式生成元表示。"] },
    },
    // Euler 定理与 Fermat 小定理：a^{φ(n)} ≡ 1 与降幂公式。
    "euler-fermat-theorem": {
        definitions: ["Euler 定理与 Fermat 小定理刻画模 n 乘法群中元素的周期性，是模幂化简、降幂与素性测试的基础；Carmichael 函数 λ(n) 给出普遍指数的最小值。"],
        formulas: ["Euler 定理：gcd(a, n) = 1 ⇒ a^{φ(n)} ≡ 1 (mod n)。", "Fermat 小定理：p 素数 ⇒ a^p ≡ a (mod p)，且 p ∤ a 时 a^{p-1} ≡ 1 (mod p)。", "互素降幂：gcd(a, n) = 1 时 a^e ≡ a^{e mod φ(n)} (mod n)。", "广义降幂（不需互素）：e ≥ log_2 n 时 a^e ≡ a^{(e mod φ(n)) + φ(n)} (mod n)。"],
        theorems: ["Euler 定理是 Lagrange 定理在 (Z/n)^* 上的特例；Fermat 小定理是 n = p 的情形。", "普遍指数：a^{λ(n)} ≡ 1 对所有 gcd(a, n) = 1 成立，且 λ(n) | φ(n)，λ 是使该式成立的最小正整数。", "Fermat 小定理的逆命题不成立：Carmichael 数（561 = 3·11·17 为最小者）对所有底数都通过 Fermat 测试。"],
        generalRequirements: ["使用 a^{φ(n)} ≡ 1 前必须验证 gcd(a, n) = 1。", "不互素时化简指数必须使用带 +φ(n) 修正的广义降幂并核对 e ≥ log_2 n。"],
        forbiddenErrors: ["【互素性遗漏】gcd(a, n) ≠ 1 时直接用 a^e ≡ a^{e mod φ(n)}。", "【逆命题误用】由 a^{n-1} ≡ 1 (mod n) 断言 n 是素数（Carmichael 数反例）。", "【φ 与 λ 混淆】把 λ(n) 当作 φ(n) 或反之，导致阶的上界错误。", "【降幂修正缺失】广义降幂时漏掉 +φ(n) 项。"],
        parameterConstraints: { coprimality: "Euler 定理与互素降幂要求 gcd(a, n) = 1。", modulus: "n ≥ 2；Fermat 小定理要求模为素数。", exponentSize: "广义降幂要求指数足够大（e ≥ log_2 n）。" },
        closureChecks: ["核对 gcd(a, n) 并选择互素降幂或广义降幂。", "计算 φ(n)（必要时 λ(n)）并化简指数。", "用小规模快速幂回代验证结果。"],
        scenarioChecks: { towerExponent: ["幂塔 a^{b^c} mod n 须逐层用广义降幂并跟踪每层指数是否已足够大。"], pseudoprimeTest: ["Fermat 测试只能否定素性；遇到 Carmichael 数必须改用 Miller-Rabin。"], orderComputation: ["求 ord_n(a) 时只需在 φ(n) 或 λ(n) 的因子中搜索。"] },
    },
    // Möbius 反演与 Dirichlet 卷积：算术函数在卷积下的群结构。
    "mobius-inversion": {
        definitions: ["该知识项研究算术函数在 Dirichlet 卷积下的代数结构：μ 是常函数 1 的卷积逆，反演公式把「求和形式」与「原函数」互相恢复。"],
        formulas: ["Dirichlet 卷积：(f * g)(n) = ∑_{d | n} f(d) g(n/d)。", "μ 的基本性质：∑_{d | n} μ(d) = [n = 1]，即 1 * μ = ε。", "反演公式：F(n) = ∑_{d | n} f(d) ⇔ f(n) = ∑_{d | n} μ(n/d) F(d)。", "Dirichlet 级数对应：∑_n (f * g)(n) n^{-s} = (∑_n f(n) n^{-s})(∑_n g(n) n^{-s})，在绝对收敛域内成立。"],
        theorems: ["算术函数在 Dirichlet 卷积下构成交换环，f(1) ≠ 0 的函数构成 Abel 群，单位元为 ε；乘性函数在卷积下封闭。", "Möbius 反演定理及其对偶（区间形式）：F(x) = ∑_{n ≤ x} f(x/n) ⇔ f(x) = ∑_{n ≤ x} μ(n) F(x/n)。", "标准卷积恒等式：1 * 1 = d，1 * Id = σ，φ * 1 = Id，μ * d = 1。"],
        generalRequirements: ["必须声明所用函数是否乘性；乘性才可按素幂拆分计算。", "使用无穷或区间形式反演时必须说明求和交换的绝对收敛性或有限性。"],
        forbiddenErrors: ["【乘性误设】对非乘性函数按素幂拆分求值。", "【反演方向反用】把 f 与 F 的角色互换，导致符号 μ 的位置错误。", "【μ 取值错算】对非平方自由的 n 未取 μ(n) = 0。", "【求和交换未验】在无界求和中随意交换次序而不检查绝对收敛。"],
        parameterConstraints: { domain: "算术函数定义在正整数上；卷积要求逐点有限求和。", multiplicativity: "按素幂分解计算要求 f 乘性（f(mn) = f(m)f(n) 对 gcd(m, n) = 1）。", convergence: "Dirichlet 级数形式要求 Re(s) 落在绝对收敛半平面。" },
        closureChecks: ["写出卷积关系并确认单位元与逆。", "反演后用小 n（例如 n = 1, p, p^2, pq）验证公式。", "若使用乘性，逐素幂核对局部因子。"],
        scenarioChecks: { divisorSumInversion: ["从 ∑_{d | n} f(d) 的封闭式反演出 f，典型用于由 σ 或 d 恢复原函数。"], eulerPhiIdentity: ["由 ∑_{d | n} φ(d) = n 反演得到 φ = μ * Id 的显式表达。"], averageOrderEstimate: ["估计 ∑_{n ≤ x} f(n) 时用卷积拆分并对双和换序，交给较易估计的一侧。"] },
    },
    // LTE 升幂引理：v_p(x^n ± y^n) 的精确公式。
    "lifting-the-exponent": {
        definitions: ["LTE 引理研究 p-adic 赋值 v_p（p 整除的最高次幂指数）在幂差 x^n - y^n 与幂和 x^n + y^n 上的精确取值，是指数型丢番图方程的核心估值工具。"],
        formulas: ["奇素数幂差：p 为奇素数、p | x - y、p ∤ x 且 p ∤ y ⇒ v_p(x^n - y^n) = v_p(x - y) + v_p(n)。", "奇素数幂和：p 为奇素数、n 为奇数、p | x + y、p ∤ xy ⇒ v_p(x^n + y^n) = v_p(x + y) + v_p(n)。", "p = 2 情形：x, y 为奇数时 n 奇 ⇒ v_2(x^n - y^n) = v_2(x - y)；n 偶 ⇒ v_2(x^n - y^n) = v_2(x - y) + v_2(x + y) + v_2(n) - 1。"],
        theorems: ["LTE 引理由 x^n - y^n = (x - y)(x^{n-1} + ... + y^{n-1}) 配合 p | x - y 时第二因子的 v_p 等于 v_p(n) 得到。", "p = 2 与奇素数结论必须分开：偶指数情形出现额外的 v_2(x + y) - 1 修正项。", "推论：Zsygmondy 型问题、a^n - 1 的素因子指数控制与指数丢番图方程的模约束均由 LTE 给出精确赋值。"],
        generalRequirements: ["套用公式前必须逐条验证 p | x - y（或 p | x + y）与 p ∤ x、p ∤ y。", "必须区分 p 是奇素数还是 p = 2，并对 p = 2 区分 n 的奇偶。"],
        forbiddenErrors: ["【p = 2 误用】对 p = 2 套用奇素数公式，漏掉 v_2(x + y) - 1 修正。", "【整除前提缺失】p ∤ x - y 时仍使用 v_p(x - y) + v_p(n)。", "【非互素误用】p | x 或 p | y 时套用公式。", "【幂和指数错配】对偶数 n 使用幂和版本 v_p(x^n + y^n) = v_p(x + y) + v_p(n)。"],
        parameterConstraints: { primeParity: "奇素数版本要求 p ≥ 3；p = 2 使用专用公式。", divisibility: "幂差版本要求 p | x - y，幂和版本要求 p | x + y。", nonDivisibility: "必须有 p ∤ x 且 p ∤ y。", exponentParity: "幂和版本要求 n 为奇数；p = 2 版本按 n 的奇偶分类。" },
        closureChecks: ["逐条核对 p 的奇偶、整除与互素前提。", "代入公式计算 v_p 并与小规模数值实验对照。", "把赋值结论转成对指数 n 或未知量的整除/上界约束。"],
        scenarioChecks: { exponentialDiophantine: ["形如 a^n - b^n = c 的方程用 LTE 锁定每个素因子指数，从而限制 n。"], orderAndPrimePower: ["估计 ord_{p^k}(a) 时用 LTE 把模 p^k 的阶与模 p 的阶联系起来。"], twoAdicCase: ["涉及 2 的幂时必须单独处理 n 偶的修正项，常用于平方数条件分析。"] },
    },
    // Hensel 提升引理：模 p 单根唯一提升到模 p^k 与 Z_p。
    "hensel-lemma-lifting": {
        definitions: ["Hensel 引理研究整系数多项式同余解从模 p 逐层提升到模 p^{k+1} 乃至 Z_p 的机制，其判别量是导数在该解处的 p-adic 大小。"],
        formulas: ["提升迭代：f(a) ≡ 0 (mod p^k) 且 p ∤ f'(a) ⇒ 唯一提升 a' = a - f(a)·f'(a)^{-1} (mod p^{k+1})。", "强形式条件：|f(a)|_p < |f'(a)|_p^2 ⇒ 存在唯一 α ∈ Z_p 使 f(α) = 0 且 |α - a|_p < |f'(a)|_p。", "退化情形须逐层枚举：把 a + t·p^k（t = 0, ..., p-1）代入 f 检查 mod p^{k+1}。"],
        theorems: ["Hensel 引理（单根版）：模 p 的单根唯一提升到任意 p^k 及 Z_p，因此解数在各层保持不变。", "强 Hensel 引理（Newton 版）：满足 |f(a)|_p < |f'(a)|_p^2 时 Newton 迭代二次收敛到 Z_p 中的唯一根。", "退化根（p | f'(a)）可能有 0 个、1 个或 p 个提升，必须逐层判定，不能由模 p 的解数推出模 p^k 的解数。"],
        generalRequirements: ["提升前必须计算 f'(a) mod p 并判断是否为单根。", "退化情形必须显式枚举 a + t·p^k 的所有候选。"],
        forbiddenErrors: ["【单根条件缺失】p | f'(a) 时仍断言唯一提升。", "【解数误推】把模 p 解的个数直接当作模 p^k 解的个数。", "【迭代公式错写】提升步长写成 f(a)/f'(a) 而不取 f'(a) 在模 p^{k+1} 下的逆。", "【p = 2 特例忽略】平方类问题（如 x^2 ≡ a）在 p = 2 时须验证 mod 8 条件而非直接提升。"],
        parameterConstraints: { polynomial: "f ∈ Z[x]（或 Z_p[x]），提升在固定素数 p 下进行。", simpleRoot: "标准版本要求 p ∤ f'(a)。", startingSolution: "起点必须满足 f(a) ≡ 0 (mod p^k)。" },
        closureChecks: ["验证起点解与 f'(a) 的 p-adic 条件。", "执行提升迭代并把结果回代到 mod p^{k+1} 核验。", "在退化情形给出所有提升或说明无解。"],
        scenarioChecks: { squareRootModPrimePower: ["求 x^2 ≡ a (mod p^k) 时对奇 p 用 Hensel 提升；p = 2 须单独讨论 mod 8。"], padicRootExistence: ["判定方程在 Z_p 中是否有根，配合局部-整体原则分析丢番图方程。"], degenerateRoot: ["p | f'(a) 时以 a + t·p^k 逐层分支，记录分支数变化。"] },
    },
    // Wilson 定理：(p-1)! ≡ -1 (mod p) 及其逆命题与 Gauss 推广。
    "wilson-theorem": {
        definitions: ["Wilson 定理研究模 n 简化剩余系全体乘积的取值，其素数情形给出 (p-1)! ≡ -1 (mod p)，并给出素性的充要刻画。"],
        formulas: ["Wilson 定理：p 素数 ⇒ (p-1)! ≡ -1 (mod p)。", "逆命题：n > 1 且 (n-1)! ≡ -1 (mod n) ⇒ n 素数；n > 4 为合数 ⇒ (n-1)! ≡ 0 (mod n)。", "Gauss 推广：∏_{1 ≤ k ≤ n, gcd(k, n) = 1} k ≡ -1 (mod n) 当 n = 4, p^k, 2p^k（p 奇素数），其余 n 时 ≡ +1 (mod n)。", "推论（p ≡ 1 mod 4）：((p-1)/2)!^2 ≡ -1 (mod p)，给出 -1 的平方根。"],
        theorems: ["Wilson 定理的证明基于简化剩余系中除 ±1 外元素与其逆两两配对。", "Wilson 定理与其逆合起来构成素性的充要条件，但阶乘计算代价使其不可用于实际素性判定。", "Gauss 推广说明乘积为 -1 恰在 (Z/n)^* 中只有一个 2 阶元时成立，即 n ∈ {4, p^k, 2p^k}。"],
        generalRequirements: ["使用 (p-1)! ≡ -1 必须确认模是素数。", "推广形式必须先判定 n 的形状再确定乘积是 -1 还是 +1。"],
        forbiddenErrors: ["【素性判定滥用】把 Wilson 定理当作可行的素性算法使用。", "【合数情形错算】对合数 n 断言 (n-1)! ≡ -1，或忽略 n = 4 的特例（3! ≡ 2 mod 4）。", "【推广符号错判】对 n = 8, 15 等仍取乘积为 -1。", "【平方根推论误用】对 p ≡ 3 (mod 4) 断言 ((p-1)/2)!^2 ≡ -1。"],
        parameterConstraints: { modulusPrimality: "标准形式要求 p 为素数。", compositeCase: "(n-1)! ≡ 0 (mod n) 的结论要求 n > 4 且为合数。", gaussForm: "推广形式按 n ∈ {4, p^k, 2p^k} 与其余情形分类取 -1 或 +1。" },
        closureChecks: ["确认模的素性或形状。", "用配对论证或小规模计算核对乘积符号。", "若用于构造 -1 的平方根，验证 p ≡ 1 (mod 4)。"],
        scenarioChecks: { minusOneSquareRoot: ["p ≡ 1 (mod 4) 时用 ((p-1)/2)! 构造 x^2 ≡ -1 (mod p) 的解。"], factorialCongruence: ["计算 (p-1)! 型阶乘同余时先用 Wilson 定理约简，再处理剩余因子。"], reducedResiduePairing: ["把简化剩余系按 k 与 k^{-1} 配对，用于证明各类乘积恒等式。"] },
    },
};
