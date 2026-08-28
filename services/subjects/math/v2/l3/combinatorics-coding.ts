import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“编码理论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMBINATORICS_CODING_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 线性码、生成矩阵与校验矩阵。
    "coding-linear-code-basics": {
        id: "coding-linear-code-basics", l2Key: "combinatorics-coding", name: "线性码与生成矩阵、校验矩阵", kind: "object",
        aliases: ["线性码", "生成矩阵", "校验矩阵", "对偶码"],
    },
    // 最小距离与纠错检错能力。
    "coding-minimum-distance": {
        id: "coding-minimum-distance", l2Key: "combinatorics-coding", name: "最小距离与纠错能力判据", kind: "criterion",
        aliases: ["最小距离", "纠错能力判据", "Hamming距离", "校验矩阵线性无关判据"],
    },
    // Singleton 界与 MDS 码。
    "coding-singleton-mds": {
        id: "coding-singleton-mds", l2Key: "combinatorics-coding", name: "Singleton 界与 MDS 码", kind: "theorem",
        aliases: ["Singleton界", "MDS码", "极大距离可分码"],
    },
    // Hamming 球包装界与完美码。
    "coding-hamming-perfect": {
        id: "coding-hamming-perfect", l2Key: "combinatorics-coding", name: "球包装界与完美码分类", kind: "theorem",
        aliases: ["球包装界", "完美码", "Hamming码", "Golay码"],
    },
    // Gilbert-Varshamov 下界。
    "coding-gilbert-varshamov": {
        id: "coding-gilbert-varshamov", l2Key: "combinatorics-coding", name: "Gilbert-Varshamov 下界", kind: "theorem",
        aliases: ["Gilbert-Varshamov界", "码存在性下界", "渐近GV界"],
    },
    // Plotkin 界与 Griesmer 界。
    "coding-plotkin-griesmer": {
        id: "coding-plotkin-griesmer", l2Key: "combinatorics-coding", name: "Plotkin 界与 Griesmer 界", kind: "theorem",
        aliases: ["Plotkin界", "Griesmer界", "高距离码上界"],
    },
    // 循环码与 BCH 码。
    "coding-cyclic-bch": {
        id: "coding-cyclic-bch", l2Key: "combinatorics-coding", name: "循环码与 BCH 码", kind: "object",
        aliases: ["循环码", "BCH码", "生成多项式", "BCH界"],
    },
    // Reed-Solomon 码与列表译码。
    "coding-reed-solomon": {
        id: "coding-reed-solomon", l2Key: "combinatorics-coding", name: "Reed-Solomon 码与列表译码", kind: "object",
        aliases: ["Reed-Solomon码", "列表译码", "Berlekamp-Welch算法", "Johnson半径"],
    },
    // 重量枚举多项式与 MacWilliams 恒等式。
    "coding-macwilliams": {
        id: "coding-macwilliams", l2Key: "combinatorics-coding", name: "重量枚举多项式与 MacWilliams 恒等式", kind: "theorem",
        aliases: ["重量枚举多项式", "MacWilliams恒等式", "对偶码重量分布"],
    },
    // Reed-Muller 码与局部可译性。
    "coding-reed-muller": {
        id: "coding-reed-muller", l2Key: "combinatorics-coding", name: "Reed-Muller 码与局部可译性", kind: "object",
        aliases: ["Reed-Muller码", "局部可译码", "多项式求值码"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMBINATORICS_CODING_L3_RULES: Record<string, MathV2L3Rules> = {
    // 线性码、生成矩阵与校验矩阵。
    "coding-linear-code-basics": {
        definitions: ["[n, k, d]_q 线性码 C：F_q^n 的 k 维子空间，n 为码长、k 为维数、d 为最小距离。", "生成矩阵 G：k x n 矩阵，其行构成 C 的基，C = {xG : x ∈ F_q^k}。", "校验矩阵 H：(n-k) x n 矩阵，C = {c : H c^T = 0}；对偶码 C^⊥ = {u : u · c = 0 对一切 c ∈ C}。"],
        formulas: ["|C| = q^k，码率 R = k/n", "标准形 G = [I_k | A]，对应 H = [-A^T | I_{n-k}]", "dim C + dim C^⊥ = n", "陪集与伴随式：s = H y^T，y = c + e 时 s 只依赖错误向量 e"],
        theorems: ["线性码由 G 的行空间唯一确定，但 G 不唯一：行变换给出同一码，列置换给出等价码，二者必须区分。", "G 与 H 的关系为 G H^T = 0 且 rank G = k、rank H = n-k；由 G 求 H 需先化为标准形或用零空间基。", "对偶运算是对合的：(C^⊥)^⊥ = C，但 C ∩ C^⊥ 一般非零，自对偶码要求 C = C^⊥ 从而 n = 2k。", "伴随式译码把译码化为陪集首查找，正确性依赖每个陪集选取唯一最小重量代表元；重量并列时译码不唯一。"],
        generalRequirements: ["给出码必须写明 q、n、k、d 四项，且 k = rank G 需实际核算。", "由 G 推 H 必须验证 G H^T = 0 与秩条件。", "线性性必须显式使用：零向量属于码、码字集对加法与数乘封闭。", "谈等价码时说明使用的是置换等价还是单项等价。"],
        forbiddenErrors: ["【维数误取】把 G 的行数当维数而未验证行满秩。", "【对偶维数错】写出 dim C^⊥ = k 或忽略 dim C + dim C^⊥ = n。", "【校验关系颠倒】写成 H G^T = I 或 G H = 0（维数不匹配）。", "【非线性混入】把一般（非线性）码的码字个数写成 q^k。", "【伴随式误用】认为伴随式唯一决定错误向量而非其陪集。"],
        parameterConstraints: { fieldSize: "q 为素数幂。", lengthDim: "1 <= k <= n。", generatorRank: "rank G = k。", checkRank: "rank H = n - k。", dualDimension: "dim C^⊥ = n - k。" },
        closureChecks: ["G 行满秩且维数与 k 一致。", "G H^T = 0 成立。", "码字集对线性运算封闭。", "对偶码维数满足 n - k。"],
        scenarioChecks: { matrixConversion: ["把 G 化为标准形", "写出对应 H", "验证 G H^T = 0"], dualComputation: ["用 H 作为 C^⊥ 的生成矩阵", "核对维数", "判断是否自对偶"], syndromeDecoding: ["计算伴随式", "查陪集首", "指出并列情形译码不唯一"] },
    },
    // 最小距离与纠错检错能力。
    "coding-minimum-distance": {
        definitions: ["Hamming 距离 d(x,y)：两向量不同坐标的个数；重量 w(x) = d(x, 0)。", "最小距离 d = min{d(c, c') : c ≠ c'}；线性码时 d = min{w(c) : c ≠ 0}。", "纠错半径 t：以码字为心、半径 t 的球两两不交时可纠 t 个错误。"],
        formulas: ["线性码：d = 最小非零码字重量", "纠错能力 t = floor((d-1)/2)", "检错能力 = d - 1 个错误", "同时纠 t 错检 e 错（e >= t）：要求 d >= t + e + 1", "d = 校验矩阵 H 中线性相关列的最小个数"],
        theorems: ["对线性码，最小距离等于最小非零重量，这把 O(|C|^2) 的距离比较降为 O(|C|) 的重量扫描，但对非线性码不成立。", "H 的任意 d-1 列线性无关且存在 d 列相关，等价于最小距离为 d；这是判定 d 的标准判据。", "球包装给出唯一译码半径 t = floor((d-1)/2)；超过 t 个错误时最近码字译码可能出错，恰好 d/2 处（d 偶）出现并列。", "纠错与检错能力不能同时取满：纠 t 错的同时只能检出至多 d-1-t 个错误，必须在 d >= t+e+1 下分配。"],
        generalRequirements: ["计算线性码的 d 必须用最小非零重量或 H 的列相关性判据，并说明依据。", "纠错能力必须用下取整公式，偶距离时明确并列情形。", "非线性码不得使用最小重量代替最小距离。", "同时纠错检错时必须写出 d >= t + e + 1 的分配关系。"],
        forbiddenErrors: ["【重量代距离】对非线性码用最小重量当最小距离。", "【取整错误】把 t 写成 (d-1)/2 而不取整，或写成 floor(d/2)。", "【能力叠加】声称 d 距离码可同时纠 floor((d-1)/2) 错并检 d-1 错。", "【列相关误判】只验证某 d 列相关而未验证任意 d-1 列无关。", "【球不交遗漏】用超过 t 的半径做唯一译码。"],
        parameterConstraints: { distanceRange: "1 <= d <= n。", correctionRadius: "t = floor((d-1)/2)。", detectionCapacity: "检错数 <= d - 1。", combinedCondition: "同时纠 t 检 e 需 d >= t + e + 1 且 e >= t。", checkColumns: "H 的任意 d-1 列线性无关。" },
        closureChecks: ["d 的判定依据（最小重量或列相关）已写明。", "t 用下取整给出。", "纠错检错分配满足 d >= t+e+1。", "线性性前提在使用最小重量时已确认。"],
        scenarioChecks: { distanceComputation: ["扫描非零码字重量或分析 H 的列", "给出 d", "说明所用判据"], capabilityClaim: ["由 d 算 t", "分别报告纠错与检错能力", "偶距离时说明并列"], parameterTradeoff: ["写出 d >= t+e+1", "给出可行的 (t,e) 组合"] },
    },
    // Singleton 界与 MDS 码。
    "coding-singleton-mds": {
        definitions: ["Singleton 界：任意 [n,k,d]_q 码满足 d <= n - k + 1。", "MDS 码：达到 Singleton 界的码，即 d = n - k + 1。", "重量分布完全由参数决定是 MDS 码的特征之一。"],
        formulas: ["d <= n - k + 1", "MDS：d = n - k + 1", "MDS 等价刻画：G 的任意 k 列线性无关；H 的任意 n-k 列线性无关", "MDS 码的对偶仍为 MDS，参数 [n, n-k, k+1]", "Reed-Solomon 码：n <= q，k 任意，为 MDS"],
        theorems: ["Singleton 界由删除任意 d-1 个坐标后码字仍互异（投影单射）得到，故 q^k <= q^{n-d+1}。", "MDS 码等价于 G 的任意 k 列构成可逆子矩阵，也等价于任意 k 个坐标构成信息位集，这使 MDS 码可从任意 k 个坐标恢复信息。", "MDS 码的对偶码仍是 MDS，这一自封闭性是 MDS 类的关键性质。", "MDS 猜想：对 q 为素数幂、2 <= k <= q-1，非平凡 MDS 码长满足 n <= q+1（q 偶且 k = 3 或 k = q-1 时可到 q+2）；一般 q 的完整证明仅在 q 为素数时由 Ball 给出。"],
        generalRequirements: ["断言 MDS 必须验证 d = n-k+1 而非仅 d 较大。", "使用任意 k 列可逆的刻画时必须说明与 MDS 的等价性。", "码长上界必须区分已证结论与 MDS 猜想。", "平凡 MDS（k = 1、k = n、d = 1）应单独排除或说明。"],
        forbiddenErrors: ["【界方向错】写成 d >= n-k+1。", "【MDS误判】d 未达界即称 MDS。", "【对偶参数错】把 MDS 对偶写成 [n, n-k, n-k+1]。", "【猜想当定理】对一般素数幂 q 断言 n <= q+1 已被完全证明。", "【列条件弱化】只验证某 k 列可逆就断言 MDS。"],
        parameterConstraints: { singletonBound: "d <= n - k + 1 恒成立。", mdsCondition: "MDS 要求等号成立。", dualParameters: "MDS 对偶为 [n, n-k, k+1]。", rsLength: "Reed-Solomon 码要求 n <= q（扩展后 n <= q+1）。", nonTrivialRange: "非平凡情形取 2 <= k <= n-2。" },
        closureChecks: ["d 与 n-k+1 的比较已明确。", "MDS 宣称配有列可逆性或已知构造。", "对偶参数按 [n, n-k, k+1] 给出。", "码长上界的引用区分了定理与猜想。"],
        scenarioChecks: { boundApplication: ["写出 d <= n-k+1", "核对具体参数", "指出是否达界"], mdsVerification: ["验证任意 k 列可逆", "或引用 RS 等已知 MDS 构造"], dualAnalysis: ["写出对偶参数", "确认仍达 Singleton 界"] },
    },
    // Hamming 球包装界与完美码。
    "coding-hamming-perfect": {
        definitions: ["半径 t 的 Hamming 球体积 V_q(n,t) = sum_{i=0}^{t} C(n,i)(q-1)^i。", "球包装（Hamming）界：以码字为心、半径 t 的球两两不交给出的码大小上界。", "完美码：球恰好划分整个空间 F_q^n，即球包装取等号。"],
        formulas: ["|C| · V_q(n,t) <= q^n，t = floor((d-1)/2)", "线性码形式：q^k <= q^n / V_q(n,t)", "Hamming 码 [ (q^r-1)/(q-1), (q^r-1)/(q-1) - r, 3 ]_q 完美纠 1 错", "二元 Golay 码 [23, 12, 7]，三元 Golay 码 [11, 6, 5]"],
        theorems: ["球包装界由不交球的体积相加不超过全空间得到，是上界；等号成立即完美码。", "完美码分类定理：非平凡完美码只有 Hamming 码族、二元 [23,12,7] Golay 码与三元 [11,6,5] Golay 码（以及重复码等平凡情形），这是 Tietäväinen 与 Zinovʹev-Leontʹev 的结果。", "球体积整除 q^n 只是完美码的必要条件，存在满足整除而无完美码的参数（如 (n,q,t) = (90,2,2)）。", "完美码必满足 d = 2t+1 为奇数；偶最小距离的码不可能完美。"],
        generalRequirements: ["使用球包装界必须写出 V_q(n,t) 的完整求和式，含 (q-1)^i 因子。", "断言完美必须验证等号并对照分类定理。", "整除条件只作必要条件使用。", "t 必须由 d 通过下取整确定。"],
        forbiddenErrors: ["【体积漏因子】把 V_q 写成 sum C(n,i) 而漏掉 (q-1)^i。", "【界方向错】写出 |C| V >= q^n。", "【完美码超纲】声称存在分类之外的非平凡完美码。", "【整除当充分】由 V | q^n 断言完美码存在。", "【偶距离完美】对 d 为偶数的码声称完美。"],
        parameterConstraints: { radius: "t = floor((d-1)/2)。", volumeFormula: "V_q(n,t) = sum_{i<=t} C(n,i)(q-1)^i。", packingInequality: "|C| V_q(n,t) <= q^n。", perfectCondition: "完美要求等号且 d = 2t+1。", knownPerfect: "非平凡完美码限于 Hamming 族与两个 Golay 码。" },
        closureChecks: ["球体积公式含 (q-1)^i。", "不等式方向为 <= q^n。", "完美宣称与分类定理一致。", "d 与 t 的关系为 d = 2t+1（完美情形）。"],
        scenarioChecks: { boundComputation: ["算出 V_q(n,t)", "代入不等式", "给出 |C| 上界"], perfectClaim: ["验证等号", "对照 Hamming/Golay 分类", "排除偶距离"], necessaryOnly: ["检查整除条件", "说明不足以保证存在"] },
    },
    // Gilbert-Varshamov 下界。
    "coding-gilbert-varshamov": {
        definitions: ["Gilbert 界：贪心覆盖论证给出的码存在性下界。", "Varshamov 界：对线性码用逐列扩展校验矩阵给出的存在性下界。", "渐近形式用相对距离 delta = d/n 与 q 元熵函数 H_q 表述。"],
        formulas: ["Gilbert：存在 |C| >= q^n / V_q(n, d-1) 的码", "Varshamov：若 V_q(n-1, d-2) < q^{n-k} 则存在 [n,k,d]_q 线性码", "渐近 GV 界：R >= 1 - H_q(delta)，其中 H_q(x) = x log_q(q-1) - x log_q x - (1-x) log_q(1-x)", "适用范围 0 < delta < 1 - 1/q"],
        theorems: ["Gilbert 界通过反复取未被半径 d-1 球覆盖的点得到，故给出的是存在性下界，不给出显式构造。", "Varshamov 界把条件加在 V_q(n-1, d-2) 上，保证可为 H 再添一列而不产生 d-1 个相关列，从而线性码也能达到 GV 界。", "渐近 GV 界 R >= 1 - H_q(delta) 在 q <= 49 的二元及小域情形长期是最好的一般下界；对 q >= 49 的平方素数幂，代数几何码（Tsfasman-Vladut-Zink）超越了 GV 界。", "GV 界是下界不是可达曲线：随机线性码以高概率达到 GV 界，但不能断言存在码恰好落在界上。"],
        generalRequirements: ["球半径必须与所用版本匹配：Gilbert 用 d-1，Varshamov 用 (n-1, d-2)。", "渐近界必须写出 q 元熵函数并限制 delta < 1 - 1/q。", "结论方向必须是存在性下界，不能反用为上界。", "宣称超越 GV 界必须引用代数几何码并说明 q 的条件。"],
        forbiddenErrors: ["【半径混用】Varshamov 条件里用 V_q(n, d-1) 代替 V_q(n-1, d-2)。", "【界当上界】用 GV 界断言码率不能更高。", "【熵函数错】把 H_q 写成二元熵而漏掉 x log_q(q-1) 项。", "【范围越界】在 delta >= 1 - 1/q 处使用渐近界。", "【构造性误称】声称 GV 界给出显式好码。"],
        parameterConstraints: { gilbertRadius: "Gilbert 用球半径 d-1。", varshamovCondition: "V_q(n-1, d-2) < q^{n-k}。", asymptoticRange: "0 < delta < 1 - 1/q。", rateBound: "R >= 1 - H_q(delta)。", agThreshold: "代数几何码超越 GV 需 q >= 49 且为平方素数幂。" },
        closureChecks: ["所用球半径与版本一致。", "熵函数含 log_q(q-1) 项。", "delta 落在有效区间。", "结论表述为存在性下界。"],
        scenarioChecks: { existenceProof: ["用贪心覆盖或逐列扩展", "写出体积条件", "给出下界码率"], asymptoticEstimate: ["写出 1 - H_q(delta)", "核对 delta 范围", "标注为下界"], comparisonWithAG: ["说明 q 的条件", "指出 TVZ 界在大 q 处更优"] },
    },
    // Plotkin 界与 Griesmer 界。
    "coding-plotkin-griesmer": {
        definitions: ["Plotkin 界：高相对距离区间内的码大小上界。", "Griesmer 界：线性码在给定 k 与 d 下的最短码长下界。", "两者互补于球包装界：球包装在小 d 有效，Plotkin 在大 d 有效。"],
        formulas: ["二元 Plotkin：d > n/2 时 |C| <= 2 floor(d / (2d - n))", "一般 q：d > (1 - 1/q) n 时 |C| <= d / (d - (1-1/q)n)", "Griesmer：n >= sum_{i=0}^{k-1} ceil(d / q^i)", "二元 Griesmer：n >= sum_{i=0}^{k-1} ceil(d / 2^i)"],
        theorems: ["Plotkin 界由所有码字对的平均距离不超过 (1-1/q)n |C|^2/(|C|-1) 型上界推出，故只在 d 超过该平均阈值时非平凡。", "Griesmer 界由剩余码（residual code）归纳得到：删去某个重量为 d 的码字的支撑后得 [n-d, k-1, >= ceil(d/q)] 码，递归展开即得求和式。", "渐近上，Plotkin 界给出 delta >= 1 - 1/q 时 R -> 0，即相对距离不能超过 1 - 1/q（对固定字母表）。", "Griesmer 界仅适用于线性码；非线性码需用 Plotkin 或 LP 界，二者不可互换。"],
        generalRequirements: ["使用 Plotkin 界前必须核验 d > (1-1/q)n 的适用条件。", "Griesmer 求和必须逐项上取整，且项数恰为 k。", "必须声明 Griesmer 界只对线性码成立。", "与球包装界并用时应说明各自适用区间。"],
        forbiddenErrors: ["【适用条件缺失】在 d <= n/2 时套用二元 Plotkin 公式。", "【取整方向错】Griesmer 求和用下取整。", "【项数错误】Griesmer 求和写到 i = k 或只到 k-2。", "【线性性忽略】把 Griesmer 界用于非线性码。", "【相对距离越限】声称固定 q 下可有 delta > 1 - 1/q 且 R > 0。"],
        parameterConstraints: { plotkinCondition: "二元需 d > n/2；一般 q 需 d > (1-1/q)n。", griesmerSum: "n >= sum_{i=0}^{k-1} ceil(d/q^i)。", linearityRequired: "Griesmer 界只对线性码有效。", asymptoticLimit: "delta <= 1 - 1/q。", dimensionRange: "k >= 1，d >= 1。" },
        closureChecks: ["Plotkin 适用条件已核验。", "Griesmer 各项为上取整且共 k 项。", "线性性前提已声明。", "结论方向为上界（Plotkin）或码长下界（Griesmer）。"],
        scenarioChecks: { plotkinUse: ["检查 d 与 (1-1/q)n 的大小", "代入公式", "报告码字数上界"], griesmerUse: ["逐项计算 ceil(d/q^i)", "求和得最短码长", "与给定 n 比较"], boundSelection: ["按 d/n 大小选择球包装或 Plotkin", "说明选择理由"] },
    },
    // 循环码与 BCH 码。
    "coding-cyclic-bch": {
        definitions: ["循环码：对循环移位封闭的线性码，等价于 F_q[x]/(x^n - 1) 中的理想。", "生成多项式 g(x)：该理想的首一最低次生成元，g(x) | x^n - 1。", "BCH 码：由 g(x) 取为若干连续幂次 alpha^b, ..., alpha^{b+delta-2} 的极小多项式最小公倍式定义，delta 称设计距离。"],
        formulas: ["dim C = n - deg g，g(x) | x^n - 1", "校验多项式 h(x) = (x^n - 1)/g(x)", "BCH 界：d >= delta（设计距离）", "本原 BCH 码：n = q^m - 1，纠 t 错时 deg g <= mt，故 k >= n - mt", "定义集 T = {i : g(alpha^i) = 0} 决定码"],
        theorems: ["循环码与 x^n - 1 的因子一一对应，因此循环码的枚举归结为 x^n - 1 在 F_q 上的分解；gcd(n, q) = 1 时 x^n - 1 无重根。", "BCH 界给出 d >= delta，但真实最小距离可严格大于设计距离，故 delta 只能当下界使用。", "Reed-Solomon 码是 n = q-1 的本原 BCH 码，此时 d = delta 恰好达 Singleton 界。", "循环码的对偶仍循环，其生成多项式由 h(x) 的互反多项式给出；定义集互补且取负指数，符号处理是常见错误源。"],
        generalRequirements: ["给出循环码必须验证 g(x) | x^n - 1 并由 deg g 算维数。", "BCH 构造必须写出定义集与所用连续幂次区间。", "最小距离只能以 delta 为下界报告，除非另有计算。", "需要 gcd(n, q) = 1（或说明重根情形）才能使用标准根集分析。"],
        forbiddenErrors: ["【非因子生成】给出的 g(x) 不整除 x^n - 1。", "【维数错算】写成 dim = deg g。", "【设计距离当真值】断言 d = delta 而无额外论证（RS 等特例除外）。", "【定义集不连续】BCH 构造中取非连续幂次却仍套用 BCH 界。", "【对偶符号错】对偶码生成多项式忽略互反与负指数。"],
        parameterConstraints: { divisibility: "g(x) | x^n - 1。", dimension: "k = n - deg g。", designDistance: "delta >= 2，d >= delta。", coprimality: "标准分析要求 gcd(n, q) = 1。", primitiveLength: "本原 BCH 取 n = q^m - 1。" },
        closureChecks: ["g(x) 整除 x^n - 1 已验证。", "维数由 n - deg g 给出。", "定义集为连续幂次区间。", "最小距离表述为 >= delta。"],
        scenarioChecks: { cyclicConstruction: ["分解 x^n - 1", "选取因子作 g", "算维数与 h(x)"], bchDesign: ["选定 alpha 与连续幂次区间", "取极小多项式的 lcm", "报告 delta 与 k 的下界"], dualCyclic: ["由 h(x) 求互反多项式", "写出对偶定义集", "核对维数"] },
    },
    // Reed-Solomon 码与列表译码。
    "coding-reed-solomon": {
        definitions: ["Reed-Solomon 码：RS[n,k] = {(f(x_1), ..., f(x_n)) : deg f < k}，求值点 x_i ∈ F_q 互异。", "唯一译码半径：floor((n-k)/2)。", "列表译码：在半径 rho n 内输出所有码字构成的列表，允许列表长度多项式增长。"],
        formulas: ["参数 [n, k, n-k+1]_q，n <= q，为 MDS", "唯一译码半径 = floor((d-1)/2) = floor((n-k)/2)", "Berlekamp-Welch：解 Q(x, y) = N(x) - y E(x)，deg N <= k-1+e，deg E <= e", "Johnson 半径 1 - sqrt(R)（Guruswami-Sudan 可达）", "列表译码容量 1 - R（折叠 RS 码可达）"],
        theorems: ["RS 码是 MDS 码，因为次数 < k 的非零多项式至多有 k-1 个根，故非零码字重量 >= n-k+1。", "Berlekamp-Welch 把译码化为线性方程组，在错误数 e <= (n-k)/2 时正确恢复 f，复杂度多项式，这是唯一译码的构造性算法。", "Guruswami-Sudan 列表译码在半径 1 - sqrt(R) 内给出多项式长度列表，超越唯一译码半径 (1-R)/2；折叠 RS 码进一步达到列表译码容量 1 - R。", "列表译码输出列表而非唯一答案：不能声称在 Johnson 半径内唯一译码；唯一性只在 (1-R)/2 内保证。"],
        generalRequirements: ["求值点必须互异且个数 n <= q，扩展 RS 需显式说明加入无穷点。", "唯一译码与列表译码的半径必须分开陈述。", "使用 Berlekamp-Welch 必须给出次数约束与错误数上限。", "MDS 性的论证必须基于多项式根数上界。"],
        forbiddenErrors: ["【半径混用】声称在 1 - sqrt(R) 内可唯一译码。", "【求值点重复】取重复求值点仍称参数为 [n,k,n-k+1]。", "【码长越界】取 n > q（未说明扩展构造）。", "【次数越界】允许 deg f >= k 仍称 RS 码字。", "【容量误称】声称 Guruswami-Sudan 达到列表译码容量 1-R。"],
        parameterConstraints: { evaluationPoints: "x_i 互异，n <= q。", dimensionRange: "1 <= k <= n。", uniqueRadius: "唯一译码半径 floor((n-k)/2)。", listRadius: "Guruswami-Sudan 半径 1 - sqrt(R)。", capacityRadius: "列表译码容量 1 - R，需折叠 RS 等构造。" },
        closureChecks: ["求值点互异且 n <= q。", "码字来自 deg < k 的多项式。", "所报半径与译码类型匹配。", "MDS 参数与 Singleton 界一致。"],
        scenarioChecks: { uniqueDecoding: ["核对错误数 <= (n-k)/2", "写出 Berlekamp-Welch 方程", "由 N/E 恢复 f"], listDecoding: ["给出半径与列表长度界", "说明输出为列表", "区分 GS 与折叠 RS"], mdsArgument: ["用根数上界估计重量", "得 d = n-k+1"] },
    },
    // 重量枚举多项式与 MacWilliams 恒等式。
    "coding-macwilliams": {
        definitions: ["重量枚举多项式 W_C(x, y) = sum_{c ∈ C} x^{n - w(c)} y^{w(c)}，即 sum_i A_i x^{n-i} y^i。", "重量分布 {A_i}：重量为 i 的码字个数。", "MacWilliams 恒等式：对偶码的重量枚举由原码的枚举经线性替换得到。"],
        formulas: ["W_C(x,y) = sum_{i=0}^{n} A_i x^{n-i} y^i，A_0 = 1（线性码）", "MacWilliams：W_{C^⊥}(x, y) = (1/|C|) W_C(x + (q-1)y, x - y)", "sum_i A_i = q^k", "自对偶码：W_C 在该替换下不变", "Krawtchouk 展开：A_j^⊥ = (1/|C|) sum_i A_i K_j(i)"],
        theorems: ["MacWilliams 恒等式说明对偶码的重量分布完全由原码的重量分布决定，无需知道 C^⊥ 的码字；这依赖线性性与特征和（Fourier 变换）论证。", "恒等式只对线性码成立；非线性码需用距离分布与 Delsarte 的 LP 框架而非 MacWilliams 变换。", "由 A_i^⊥ >= 0 与整数性可反推原码重量分布的约束，这是 LP 界（Delsarte 线性规划）的出发点。", "MDS 码的重量分布由 n、k、q 唯一确定，这是 MacWilliams 恒等式加 A_i = 0（i < d）的直接推论。"],
        generalRequirements: ["写出恒等式必须带 1/|C| 因子并使用正确的替换 x -> x+(q-1)y、y -> x-y。", "使用前必须确认码是线性的。", "重量分布必须满足 sum A_i = q^k 与 A_0 = 1。", "反推约束时必须显式使用 A_i^⊥ 非负整数。"],
        forbiddenErrors: ["【因子遗漏】恒等式漏掉 1/|C|。", "【替换写错】写成 W_C(x+y, x-y)（漏 q-1）或颠倒两个替换。", "【非线性误用】对非线性码使用 MacWilliams 变换。", "【分布不自洽】给出的 A_i 之和不等于 q^k 或 A_0 ≠ 1。", "【负值忽略】变换后出现负的 A_i^⊥ 仍宣称结果有效。"],
        parameterConstraints: { linearityRequired: "MacWilliams 恒等式要求 C 线性。", normalization: "sum_i A_i = q^k，A_0 = 1。", dualSize: "|C^⊥| = q^{n-k}。", nonNegativity: "所有 A_i 与 A_i^⊥ 为非负整数。", selfDualCondition: "自对偶需 n = 2k 且 W_C 变换不变。" },
        closureChecks: ["恒等式的因子与替换正确。", "原码与对偶码的分布之和分别为 q^k 与 q^{n-k}。", "所有系数非负整数。", "线性性前提已声明。"],
        scenarioChecks: { dualDistribution: ["写出 W_C", "作 MacWilliams 替换", "展开得 A_i^⊥ 并检查非负"], consistencyCheck: ["核对分布和", "核对 A_0 = 1", "核对 A_i = 0 对 i < d"], lpBound: ["以非负性列出线性约束", "说明得到的是上界"] },
    },
    // Reed-Muller 码与局部可译性。
    "coding-reed-muller": {
        definitions: ["r 阶 m 元 Reed-Muller 码 RM(r, m)：F_2 上次数 <= r 的 m 变量多项式在 F_2^m 全部点上的求值向量集合。", "局部可译码（LDC）：可通过查询码字的 O(1) 或 n^{o(1)} 个坐标以高概率恢复单个信息位。", "广义 Reed-Muller 码为 q 元情形的同类求值码。"],
        formulas: ["RM(r,m)：n = 2^m，k = sum_{i=0}^{r} C(m,i)，d = 2^{m-r}", "对偶：RM(r,m)^⊥ = RM(m-r-1, m)", "RM(1,m) 为一阶码，去掉常数项后即 Hadamard 码 [2^m, m, 2^{m-1}]", "RM(m-2, m) 为扩展 Hamming 码", "沿直线限制：RM(r,m) 在任一条直线上的限制落入 RM(r,1)"],
        theorems: ["RM(r,m) 的最小距离 2^{m-r} 由次数 <= r 的非零多项式的非零点个数下界（Schwartz-Zippel 型论证）给出，取等于坐标乘积形式的多项式。", "RM 码的对偶是 RM(m-r-1, m)，故 RM 族在对偶下自封闭；r = (m-1)/2 附近给出自对偶或近自对偶码。", "沿随机直线限制并用一维插值给出局部译码：Hadamard 码（RM(1,m) 去常数）有 2 次查询的局部译码器，一般 RM 码给出 q 次查询与次指数码长的折中。", "局部可译码存在码率与查询次数的强折中：2 次查询的 LDC 码长必须指数级，故不能同时要求常数查询与常数码率。"],
        generalRequirements: ["给出 RM 参数必须用 k = sum_{i<=r} C(m,i) 逐项求和，不能用近似。", "对偶阶数必须写成 m-r-1。", "局部译码必须说明查询次数、成功概率与是否需要随机化。", "断言 LDC 参数时必须遵守查询次数与码长的已知折中。"],
        forbiddenErrors: ["【维数公式错】把 k 写成 C(m,r) 而非部分和。", "【距离公式错】把 d 写成 2^{m-r-1} 或 2^r。", "【对偶阶错】写成 RM(m-r, m)。", "【局部译码确定化】声称存在无随机化的常数查询局部译码器。", "【折中违背】声称存在常数查询且常数码率的 LDC。"],
        parameterConstraints: { orderRange: "0 <= r <= m。", length: "n = 2^m。", dimension: "k = sum_{i=0}^{r} C(m,i)。", distance: "d = 2^{m-r}。", dualOrder: "对偶阶为 m-r-1（r <= m-1）。" },
        closureChecks: ["k 由二项式部分和核算。", "d = 2^{m-r} 与 Singleton 界不冲突。", "对偶阶数为 m-r-1。", "局部译码的查询次数与成功概率均已给出。"],
        scenarioChecks: { parameterComputation: ["由 r 与 m 算 n、k、d", "核对部分和", "报告码率"], dualIdentification: ["写出 RM(m-r-1, m)", "验证维数互补"], localDecoding: ["描述随机直线取法", "给出查询次数", "说明成功概率与折中限制"] },
    },
};
