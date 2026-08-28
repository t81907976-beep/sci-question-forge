import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数论-计算数论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMBER_THEORY_COMPUTATIONAL_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Miller-Rabin 概率素性检测。
    "miller-rabin-primality": {
        id: "miller-rabin-primality", l2Key: "number-theory-computational", name: "Miller-Rabin 素性检测", kind: "algorithm",
        aliases: ["Miller-Rabin", "Miller-Rabin检测"],
    },
    // Pollard rho 因子分解。
    "pollard-rho-factorization": {
        id: "pollard-rho-factorization", l2Key: "number-theory-computational", name: "Pollard rho 因子分解", kind: "algorithm",
        aliases: ["Pollard rho", "Pollard ρ"],
    },
    // Tonelli-Shanks 模平方根算法。
    "tonelli-shanks-sqrt": {
        id: "tonelli-shanks-sqrt", l2Key: "number-theory-computational", name: "Tonelli-Shanks 模平方根", kind: "algorithm",
        aliases: ["Tonelli-Shanks", "模平方根", "二次剩余求根", "Cipolla算法"],
    },
    // ECM：椭圆曲线因子分解。
    "elliptic-curve-factorization": {
        id: "elliptic-curve-factorization", l2Key: "number-theory-computational", name: "椭圆曲线因子分解 ECM", kind: "algorithm",
        aliases: ["ECM", "椭圆曲线分解法", "Lenstra ECM", "光滑群阶", "Hasse区间"],
    },
    // 筛法分解：二次筛与数域筛的平方同余框架。
    "sieve-factorization-qs-nfs": {
        id: "sieve-factorization-qs-nfs", l2Key: "number-theory-computational", name: "二次筛与数域筛", kind: "algorithm",
        aliases: ["二次筛", "数域筛法", "QS", "NFS", "平方同余", "光滑数关系"],
    },
    // AKS 确定性多项式时间素性检测。
    "aks-primality": {
        id: "aks-primality", l2Key: "number-theory-computational", name: "AKS 素性检测", kind: "algorithm",
        aliases: ["AKS算法", "AKS primality", "确定性多项式时间素性", "(X+a)^n判据"],
    },
    // 离散对数算法与 Pohlig-Hellman 归约。
    "discrete-logarithm-algorithms": {
        id: "discrete-logarithm-algorithms", l2Key: "number-theory-computational", name: "离散对数算法", kind: "algorithm",
        aliases: ["离散对数", "BSGS", "Pohlig-Hellman", "指数演算法", "index calculus"],
    },
    // LLL 格基约化与 Coppersmith 小根方法。
    "lll-coppersmith": {
        id: "lll-coppersmith", l2Key: "number-theory-computational", name: "LLL 约化与 Coppersmith 方法", kind: "algorithm",
        aliases: ["LLL算法", "格基约化", "Coppersmith方法", "模方程小根", "Boneh-Durfee攻击"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMBER_THEORY_COMPUTATIONAL_L3_RULES: Record<string, MathV2L3Rules> = {
    // Miller-Rabin：强伪素数判据与错误概率控制。
    "miller-rabin-primality": {
        definitions: ["Miller-Rabin 检测基于强伪素数判据：把 n - 1 分解出 2 的幂后，检查底数的幂序列是否符合素数必须满足的平方根为 ±1 的结构，是实用素性测试的标准算法。"],
        formulas: ["分解：n - 1 = 2^s · d（d 奇）。", "通过条件（底数 a，gcd(a, n) = 1）：a^d ≡ 1 (mod n)，或存在 0 ≤ r < s 使 a^{2^r d} ≡ -1 (mod n)。", "错误概率：单次随机底数误判合数为素数的概率 ≤ 1/4，k 次独立测试 ≤ 4^{-k}。", "复杂度：单次测试 O(log^3 n)（快速幂 + 大数乘法可更优）。"],
        theorems: ["Miller-Rabin 判据的正确性：n 为奇素数时任意底数都通过；n 为奇合数时至多 1/4 的底数是强伪证人。", "确定性版本：对 n < 3.3·10^{24} 用前 13 个素数作底数即可确定判定；在广义 Riemann 假设下检查 a ≤ 2(log n)^2 的底数即可（Miller）。", "与 Fermat 检测的关系：强伪素数条件严格强于 Fermat 条件，故 Carmichael 数不能通过 Miller-Rabin 的全部底数。"],
        generalRequirements: ["必须先处理平凡情形（n 偶、n 小、完全幂）并保证 n 为奇数且 > 2。", "结论必须区分「合数（已证）」与「可能是素数（概率）」，不能把概率通过当作素性证明。"],
        forbiddenErrors: ["【概率当证明】用若干随机底数通过就断言 n 是素数（除非落在已验证的确定性范围）。", "【判据写错】只检查 a^{n-1} ≡ 1（退化为 Fermat 检测）而不检查平方根序列。", "【底数越界】选取 a ≡ 0, ±1 (mod n) 作为有效证人。", "【Carmichael 误判】声称 Miller-Rabin 与 Fermat 测试同样会被 Carmichael 数骗过。"],
        parameterConstraints: { modulus: "n 为奇数且 n > 2；需预先排除小素数与完全幂情形。", base: "底数 2 ≤ a ≤ n - 2 且 gcd(a, n) = 1。", decomposition: "n - 1 = 2^s d 中 d 必须为奇数。" },
        closureChecks: ["核对 n - 1 的 2 进分解与幂序列检查步骤。", "给出所用底数集合并声明是随机的还是确定性范围内的固定集合。", "若返回合数，给出证人底数作为可验证证据。"],
        scenarioChecks: { deterministicSmallRange: ["n 在已验证范围内时用固定素数底数集合得到确定性结论。"], cryptographicKeyGeneration: ["RSA 素数生成中先做小素数试除再用多轮 Miller-Rabin 并补充 Lucas 测试。"], primalityProof: ["需要严格证明时改用 ECPP 或 AKS，而非增加 Miller-Rabin 轮数。"] },
    },
    // Pollard rho：碰撞检测型分解，期望复杂度 O(p^{1/2})。
    "pollard-rho-factorization": {
        definitions: ["Pollard rho 用伪随机迭代序列在模最小素因子 p 下的碰撞（生日悖论）来提取因子，是中小因子分解的低空间开销标准方法。"],
        formulas: ["迭代：x_{i+1} = f(x_i) = x_i^2 + c (mod n)，c 通常取 1（避免 c = 0、-2）。", "因子提取：g = gcd(|x_i - x_j|, n)，当 1 < g < n 时得到真因子。", "期望复杂度：O(√p) ≈ O(n^{1/4}) 次迭代，其中 p 为最小素因子；空间 O(1)。", "Brent 改进：用倍增步长与批量累乘（每 m 步做一次 gcd）显著减少 gcd 调用。"],
        theorems: ["正确性：序列模 p 进入长度约 √p 的循环，故存在 i ≠ j 使 x_i ≡ x_j (mod p) 而一般 x_i ≢ x_j (mod n)，从而 gcd 给出真因子。", "失败情形：若 gcd = n（在模所有素因子处同时碰撞），须更换 c 或起点重启；n = p^2 型输入成功率较低。", "Pollard p-1 方法作为对照：当 p - 1 为 B-光滑时用 a^{M} - 1（M = lcm(1..B)）的 gcd 提取 p，因此密码学中要求 p - 1 有大素因子。"],
        generalRequirements: ["运行前必须排除 n 为素数（先做 Miller-Rabin）与 n 为小数/完全幂的情形。", "必须给出失败重启策略（更换 c、起点）与迭代次数上界。"],
        forbiddenErrors: ["【素数输入未排除】对素数 n 运行 rho 并把无输出当作分解失败结论。", "【退化多项式】取 c = 0 或 c = -2 导致迭代退化。", "【gcd 结果未判定】得到 gcd = 1 或 n 时仍宣称找到因子。", "【复杂度错述】声称期望复杂度为 O(n^{1/2}) 或与 n 的位数成多项式关系。"],
        parameterConstraints: { compositeInput: "n 必须是已判定的合数且非完全幂（完全幂另行处理）。", iterationMap: "f(x) = x^2 + c 中 c ≠ 0, -2。", restartPolicy: "gcd = n 时必须更换参数重启。" },
        closureChecks: ["先确认 n 为合数。", "运行迭代并对每个候选 gcd 判定是否为真因子。", "递归分解得到的因子直到全部为素数（用素性测试确认）。"],
        scenarioChecks: { mediumFactorExtraction: ["提取 10^{10} 量级以下因子优先用 rho，更大因子改用 ECM。"], smoothMinusOneStructure: ["若怀疑 p - 1 光滑，先用 Pollard p-1 更快命中。"], cryptographicImplication: ["RSA 素数需避免 p - 1 或 p + 1 光滑，以抵抗 p-1/p+1 方法。"] },
    },
    // Tonelli-Shanks：求解 x^2 ≡ a (mod p)。
    "tonelli-shanks-sqrt": {
        definitions: ["Tonelli-Shanks 算法在奇素数模下求二次剩余的平方根，通过把问题放到 2-Sylow 子群中逐层消去 2 的幂来实现，是模平方根计算的标准方法。"],
        formulas: ["前置判定：需 (a/p) = 1，即 a^{(p-1)/2} ≡ 1 (mod p)。", "简单情形：p ≡ 3 (mod 4) 时 x = a^{(p+1)/4} (mod p)。", "一般情形：写 p - 1 = 2^s q（q 奇），取非二次剩余 z，令 c = z^q，从 R = a^{(q+1)/2}、t = a^q 出发逐步用 c 的幂消去 t 的阶。", "复杂度：期望 O(log^2 p)（需随机找非剩余，s 较大时代价随 s^2 增长）。"],
        theorems: ["正确性：算法输出 x 满足 x^2 ≡ a (mod p)，且解恰为 ±x 两个（p 奇素数、p ∤ a）。", "推广：模 p^k 的平方根由 Hensel 提升得到（p 奇）；模 2^k 需单独讨论（解数为 0、1、2 或 4，取决于 a mod 8）。", "替代算法：Cipolla 算法在 F_{p^2} 中构造，复杂度与 s 无关，s 很大时更优。"],
        generalRequirements: ["必须先用 Euler 判别法或 Legendre 符号确认 a 是二次剩余。", "必须显式给出所用的非二次剩余 z（随机取并验证）。"],
        forbiddenErrors: ["【剩余性未验】直接对非二次剩余运行算法并输出「解」。", "【p = 2 或合数模误用】对模 2 或合数模套用该算法（合数模需 CRT + 各素幂求根）。", "【解数错述】断言 x^2 ≡ a (mod p) 有唯一解或超过两个解。", "【非剩余误取】把二次剩余当作 z 使算法不终止。"],
        parameterConstraints: { modulus: "p 为奇素数。", residueCondition: "要求 gcd(a, p) = 1 且 (a/p) = 1。", nonResidue: "需一个二次非剩余 z（随机试验期望 2 次命中）。" },
        closureChecks: ["验证 (a/p) = 1。", "运行算法后回代检查 x^2 ≡ a (mod p) 并给出两个解 ±x。", "若模为素幂或合数，说明 Hensel 提升与 CRT 的组合步骤。"],
        scenarioChecks: { compositeModulusSqrt: ["模 n = ∏ p_i^{k_i} 时对每个素幂求根再用 CRT 合并，解数为各局部解数之积。"], ellipticCurvePointDecompression: ["由 x 坐标恢复 y 需模平方根，是 ECC 点压缩的关键步骤。"], largePowerOfTwo: ["p - 1 的 2 进赋值 s 很大时改用 Cipolla 以避免 O(s^2) 代价。"] },
    },
    // ECM：利用椭圆曲线群阶的光滑性提取因子。
    "elliptic-curve-factorization": {
        definitions: ["ECM（Lenstra 椭圆曲线方法）把 Pollard p-1 中的乘法群换成模 p 的椭圆曲线群：当某条曲线在 F_p 上的群阶光滑时，标量乘在模 n 运算中出现不可逆分母，从而暴露因子 p。"],
        formulas: ["群阶范围（Hasse 界）：|#E(F_p) - (p + 1)| ≤ 2√p。", "分解触发：在 Z/n 上做点加时若某个分母与 n 的 gcd 落在 (1, n)，即得到真因子。", "阶段一：计算 [k]P，k = ∏_{q ≤ B_1} q^{⌊log_q B_1⌋}；阶段二：在 (B_1, B_2] 内搜索单个大素因子。", "复杂度：提取素因子 p 的期望代价 L_p[1/2, √2] = exp((√2 + o(1))√(log p · log log p))，与 n 的大小仅多项式相关。"],
        theorems: ["ECM 的成功率由 #E(F_p) 在 Hasse 区间内的光滑概率决定；由于每条曲线给出不同群阶，可通过更换曲线独立重试，这是它优于 p-1 方法的关键。", "ECM 的复杂度只依赖于最小素因子 p 的大小（亚指数于 log p），故是提取中等大小因子（当前实践约 50-70 位十进制）的最佳方法。", "对比 NFS：NFS 复杂度依赖 n 的大小 L_n[1/3, c]，适合分解无小因子的大整数；ECM 适合先剥离中等因子。"],
        generalRequirements: ["必须先排除 n 为素数、完全幂与含小素因子（先试除）。", "必须给出曲线与点的选取方式（如 Suyama 参数化）并说明失败重试策略。"],
        forbiddenErrors: ["【群律非法运算】在 Z/n 上做点加时未处理分母不可逆的情形（这恰是分解信号，不可当作错误跳过）。", "【复杂度错配】声称 ECM 复杂度依赖 n 的位数而非最小因子大小。", "【单曲线依赖】只用一条曲线失败即断言 n 不可分解。", "【阶段参数混用】把 B_1、B_2 的作用互换或只做阶段一就断言方法失效。"],
        parameterConstraints: { input: "n 为合数，非完全幂，且已剥离小素因子。", curveSelection: "需选取 Z/n 上的曲线与非平凡点（常用 Montgomery/Edwards 形式以加速）。", boundParameters: "B_1 < B_2，按目标因子大小选取。" },
        closureChecks: ["确认输入已通过素性与完全幂检查。", "在点运算中检测 gcd(分母, n) 并判定真因子。", "多条曲线独立重试并记录尝试次数与参数。"],
        scenarioChecks: { mediumFactorStage: ["大整数分解流水线中先试除、再 rho/p-1、再 ECM、最后 NFS。"], montgomeryArithmetic: ["用 Montgomery 曲线的 x 坐标算术避免求逆，提高阶段一效率。"], groupOrderSmoothness: ["估计成功概率时用 Hasse 区间内整数的光滑数密度（Dickman 函数）。"] },
    },
    // 二次筛与数域筛：平方同余 + 光滑数关系 + 线性代数。
    "sieve-factorization-qs-nfs": {
        definitions: ["筛法分解的共同框架是构造平方同余 x^2 ≡ y^2 (mod n)：先在筛区间上收集光滑关系，再用模 2 线性代数组合出平方，最后由 gcd(x - y, n) 得到因子；QS 用有理整数，NFS 额外引入数域一侧。"],
        formulas: ["核心恒等式：x^2 ≡ y^2 (mod n) 且 x ≢ ±y (mod n) ⇒ gcd(x - y, n) 为真因子。", "QS 筛函数：Q(t) = (t + ⌈√n⌉)^2 - n，在因子基（满足 (n/p) = 1 的素数）上分解为光滑数。", "关系组合：把每个光滑关系的素因子指数向量取模 2，在 F_2 上求核向量得到平方组合。", "复杂度：QS 为 L_n[1/2, 1]，NFS 为 L_n[1/3, (64/9)^{1/3} ≈ 1.923]，其中 L_n[a, c] = exp((c + o(1))(log n)^a (log log n)^{1-a})。"],
        theorems: ["平方同余定理：随机得到的非平凡平方同余以概率至少 1/2 给出真因子（对 n 至少两个不同素因子）。", "NFS 的结构：选取多项式 f 与 m 使 f(m) ≡ 0 (mod n)，在 Z[α]（α 为 f 的根）与 Z 两侧同时筛光滑元素，通过范数光滑性配对形成关系。", "线性代数瓶颈：关系矩阵稀疏且规模巨大，实践中用 Block Lanczos 或 Block Wiedemann 求 F_2 上的核。"],
        generalRequirements: ["必须先排除 n 为素数、完全幂与小因子情形。", "必须说明因子基的选取（QS 中只取 (n/p) = 1 的素数）与关系数量需超过因子基规模。"],
        forbiddenErrors: ["【平凡同余】得到 x ≡ ±y (mod n) 时仍宣称分解成功。", "【因子基错选】QS 中把所有小素数纳入因子基而不筛掉 (n/p) = -1 的素数。", "【关系不足】关系个数不超过因子基维数就求核。", "【复杂度混淆】把 NFS 的 L_n[1/3, ·] 与 QS 的 L_n[1/2, 1] 互换，或声称筛法为多项式时间。"],
        parameterConstraints: { input: "n 合数、非完全幂、无小素因子。", factorBase: "QS 因子基由 (n/p) = 1 的素数构成，规模 B 由复杂度权衡决定。", relationCount: "关系数需 > 因子基维数（含符号位）以保证核非空。" },
        closureChecks: ["收集足够光滑关系并构造指数矩阵。", "在 F_2 上求核并组合出 x、y，检查是否 x ≢ ±y (mod n)。", "对得到的因子递归分解并用素性测试确认。"],
        scenarioChecks: { rsaModulusFactorization: ["无小因子的 RSA 模数用 GNFS；因子接近等长时不可依赖 ECM。"], polynomialSelection: ["NFS 的多项式选择直接影响关系产出率，是实践中的关键调参环节。"], sparseLinearAlgebra: ["巨型稀疏矩阵用 Block Lanczos/Wiedemann，而非高斯消元。"] },
    },
    // AKS：确定性多项式时间素性判定。
    "aks-primality": {
        definitions: ["AKS 算法给出第一个确定性、无条件、多项式时间的素性判定：其核心是把 Fermat 小定理的多项式版本在合适的小模 X^r - 1 下检验，从而把判据压缩到多项式规模。"],
        formulas: ["理论判据：gcd(a, n) = 1 时 n 为素数 ⇔ (X + a)^n ≡ X^n + a (mod n) 在 Z[X] 中成立。", "AKS 判据：在环 (Z/n)[X]/(X^r - 1) 中对 a = 1, ..., ⌊√(φ(r)) log n⌋ 检验 (X + a)^n ≡ X^n + a。", "r 的选取：取最小 r 使 ord_r(n) > (log n)^2（存在性由解析估计保证 r = O((log n)^5)）。", "复杂度：原始版本 Õ((log n)^{12})，用 Lenstra-Pomerance 改进后 Õ((log n)^6)。"],
        theorems: ["AKS 定理（Agrawal-Kayal-Saxena 2002）：上述有限次检验成立 ⇔ n 是素数幂的判定后可判定素性，算法确定性且多项式时间。", "算法先排除完全幂与含小因子情形，再用 r 与 a 的有限范围完成判定，无需任何未证假设（区别于依赖 GRH 的确定性 Miller 检测）。", "实践对比：AKS 常数因子巨大，实际素性证明使用 ECPP 或 APR-CL，而概率判定使用 Miller-Rabin。"],
        generalRequirements: ["必须先做完全幂检测与小因子试除，再进入多项式同余检验。", "必须说明 r 与 a 的取值范围来源，不能只写「检验若干 a」。"],
        forbiddenErrors: ["【判据未降模】直接在 Z[X] 中检验 (X+a)^n ≡ X^n + a（这需要指数级代价，不是 AKS）。", "【a 范围随意】只检验少量 a 就断言确定性结论。", "【完全幂遗漏】跳过完全幂检测导致对 n = m^k 误判。", "【实用性误述】声称 AKS 在实践中比 Miller-Rabin 或 ECPP 更快。"],
        parameterConstraints: { input: "n > 1 为奇数且非完全幂（预处理阶段排除）。", parameterR: "r 需满足 ord_r(n) > (log n)^2。", rangeOfA: "a 遍历 1 到 ⌊√(φ(r)) log n⌋。" },
        closureChecks: ["完成完全幂与小因子预处理。", "确定 r 并核对 ord_r(n) 条件。", "对全部指定 a 检验多项式同余，任一失败即判定合数。"],
        scenarioChecks: { theoreticalSignificance: ["用于说明 PRIMES ∈ P，与 FACTORING 的困难性形成对照。"], practicalPrimalityProof: ["需要证书化素性证明时选择 ECPP（可产生可验证证书）。"], polynomialCongruenceIdentity: ["(X+a)^p ≡ X^p + a (mod p) 的 Frobenius 解释是判据的来源。"] },
    },
    // 离散对数：通用平方根算法、Pohlig-Hellman 归约与指数演算法。
    "discrete-logarithm-algorithms": {
        definitions: ["离散对数问题（DLP）要求在循环群中由 g、h 求 x 使 g^x = h；其算法分为只依赖群运算的通用算法（平方根复杂度）与利用群的算术结构的亚指数算法（指数演算法）。"],
        formulas: ["BSGS：写 x = i·m + j（m = ⌈√N⌉），比较 h·g^{-im} 与 g^j，时间与空间均 O(√N)。", "Pollard rho（DLP 版）：期望 O(√N) 时间、O(1) 空间的碰撞法。", "Pohlig-Hellman：N = ∏ p_i^{e_i} 时把 DLP 归约到各 p_i 子群并用 CRT 合并，代价 O(∑ e_i(log N + √p_i))。", "指数演算法（F_p^* 上）：复杂度 L_p[1/3, c]，与 NFS 同族；一般椭圆曲线群上不适用。"],
        theorems: ["通用群下界（Shoup）：只用群运算的算法需 Ω(√N) 次操作，故 BSGS/rho 在通用模型下最优。", "Pohlig-Hellman 定理：DLP 的难度由群阶的最大素因子决定，因此密码学要求群阶含大素因子（或取素数阶子群）。", "结构差异：F_p^* 上有亚指数指数演算法，而一般椭圆曲线群上最优仍为 O(√N)，这是同等安全强度下 ECC 密钥更短的原因。"],
        generalRequirements: ["必须给出群阶 N 及其分解情况（至少最大素因子的规模）。", "必须声明所在群的类型（F_p^*、椭圆曲线群、一般循环群），因为可用算法依此不同。"],
        forbiddenErrors: ["【结构算法误用】在一般椭圆曲线群上套用指数演算法的亚指数复杂度。", "【群阶忽略】不分解群阶就断言 DLP 难度等于 √N（光滑阶时 Pohlig-Hellman 使问题崩塌）。", "【子群约束缺失】未验证 h 落在 g 生成的子群中就断言解存在。", "【空间代价忽略】把 BSGS 的 O(√N) 空间当作可忽略成本。"],
        parameterConstraints: { groupOrder: "需给出 N = ord(g) 及其素因子分解（或最大素因子下界）。", membership: "解存在要求 h ∈ ⟨g⟩。", algorithmScope: "指数演算法要求群具有可利用的因子基结构（如 F_p^*、F_{p^n}^*）。" },
        closureChecks: ["确认 h ∈ ⟨g⟩ 并给出 N 的分解。", "按群阶结构选择 Pohlig-Hellman + 子群算法或直接 √N 方法。", "回代验证 g^x = h，并在子群合并时核对 CRT 相容性。"],
        scenarioChecks: { smoothOrderAttack: ["群阶光滑时用 Pohlig-Hellman 迅速求解，说明参数选择缺陷。"], eccSecurityMargin: ["椭圆曲线群阶为大素数时安全强度约为 (log N)/2 比特。"], smallSubgroupConfinement: ["协议中未验证子群归属会导致小子群攻击，须显式检查阶。"] },
    },
    // LLL 与 Coppersmith：格约化求模方程小根。
    "lll-coppersmith": {
        definitions: ["LLL 算法在多项式时间内给出格的约化基，Coppersmith 方法用它在模多项式方程中求出「足够小」的根，是格方法在数论与密码分析中的核心工具。"],
        formulas: ["LLL 保证：输出基 b_1 满足 ‖b_1‖ ≤ 2^{(n-1)/4} det(Λ)^{1/n}（近似最短向量因子 2^{O(n)}）。", "Coppersmith（单变量）：首一多项式 f 次数 d、模 N 时可在多项式时间内求出所有满足 |x_0| ≤ N^{1/d} 的根 f(x_0) ≡ 0 (mod N)。", "构造思想：由 f 的位移倍式 x^i N^{j} f(x)^{k} 构造格，用 LLL 找短向量得到在整数上成立的多项式，再求其整数根。", "Howgrave-Graham 判据：若 ‖g(xX)‖ < N^m/√(deg g + 1) 且 g(x_0) ≡ 0 (mod N^m)，则 g(x_0) = 0 在 Z 上成立。"],
        theorems: ["LLL 定理（Lenstra-Lenstra-Lovász 1982）：在维数固定的多项式时间内给出近似最短向量，误差因子指数于维数但与格的大小无关。", "Coppersmith 定理（1996）：上述小根界 N^{1/d} 最优到指数意义；二元/多元推广需启发式（Gröbner 或结式）保证方程组独立。", "密码分析推论：RSA 小公钥指数下的部分明文/密钥泄露攻击、Boneh-Durfee 对 d < N^{0.292} 的小私钥攻击、Håstad 广播攻击均由该方法给出。"],
        generalRequirements: ["使用小根界必须核对 |x_0| ≤ N^{1/d} 的量级条件与多项式是否首一（否则先乘首项逆元）。", "多变量情形必须声明所用启发式假设（所得方程组独立性）。"],
        forbiddenErrors: ["【根界越界】对超过 N^{1/d} 量级的根断言可解。", "【首一条件忽略】对非首一多项式直接套用界而不归一化。", "【多元当定理】把多变量 Coppersmith 的启发式结果当作无条件定理。", "【LLL 近似当精确】把 LLL 输出当作精确最短向量（SVP 一般 NP-hard）。"],
        parameterConstraints: { latticeDimension: "格维数决定 LLL 的近似因子与运行时间，需在构造中权衡。", polynomialForm: "单变量 Coppersmith 要求 f 首一、次数 d 已知。", rootBound: "可求根需满足 |x_0| ≲ N^{1/d}（含实现常数损失）。" },
        closureChecks: ["写出格构造与 Howgrave-Graham 判据的验证。", "对 LLL 输出的多项式在 Z 上求根并回代原同余式核验。", "多元情形核对所得方程是否代数独立，必要时声明启发式。"],
        scenarioChecks: { rsaPartialKeyExposure: ["已知私钥或明文部分比特时构造模方程用 Coppersmith 恢复剩余部分。"], stereotypedMessage: ["已知明文格式（固定前缀）时小公钥 RSA 可被小根攻击破解。"], latticeReductionPreprocessing: ["高维格先做 BKZ 预处理再 LLL，以改善实际约化质量。"] },
    },
};
