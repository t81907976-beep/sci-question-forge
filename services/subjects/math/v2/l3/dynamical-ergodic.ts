import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“动力系统-遍历理论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const DYNAMICAL_ERGODIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Poincare 复现定理与复现时间。
    "ergodic-poincare-recurrence": {
        id: "ergodic-poincare-recurrence", l2Key: "dynamical-ergodic", name: "Poincare 复现定理", kind: "theorem",
        aliases: ["Poincare复现", "复现时间", "保测变换", "有限测度空间"],
    },
    // 不变测度的存在性（Krylov-Bogolyubov）。
    "ergodic-krylov-bogolyubov-existence": {
        id: "ergodic-krylov-bogolyubov-existence", l2Key: "dynamical-ergodic", name: "不变测度存在性定理", kind: "theorem",
        aliases: ["Krylov-Bogolyubov", "不变测度构造", "弱星紧性", "Cesaro平均"],
    },
    // Birkhoff 逐点遍历定理。
    "ergodic-birkhoff-pointwise-theorem": {
        id: "ergodic-birkhoff-pointwise-theorem", l2Key: "dynamical-ergodic", name: "Birkhoff 逐点遍历定理", kind: "theorem",
        aliases: ["Birkhoff遍历定理", "Birkhoff时间平均", "空间平均", "Birkhoff几乎处处收敛"],
    },
    // von Neumann 均值遍历定理。
    "ergodic-von-neumann-mean-theorem": {
        id: "ergodic-von-neumann-mean-theorem", l2Key: "dynamical-ergodic", name: "von Neumann 均值遍历定理", kind: "theorem",
        aliases: ["均值遍历定理", "L2收敛", "等距算子", "不变子空间投影"],
    },
    // 遍历性判据与谱刻画。
    "ergodic-ergodicity-spectral-criterion": {
        id: "ergodic-ergodicity-spectral-criterion", l2Key: "dynamical-ergodic", name: "遍历性判据与谱刻画", kind: "criterion",
        aliases: ["遍历性判定", "不变集平凡", "特征值1单重", "不变函数为常数"],
    },
    // 混合性层级：强混合、弱混合与遍历。
    "ergodic-mixing-hierarchy": {
        id: "ergodic-mixing-hierarchy", l2Key: "dynamical-ergodic", name: "混合性层级与判据", kind: "criterion",
        aliases: ["强混合", "弱混合", "混合性", "相关衰减"],
    },
    // 遍历分解与遍历测度的极点性。
    "ergodic-decomposition-extremality": {
        id: "ergodic-decomposition-extremality", l2Key: "dynamical-ergodic", name: "遍历分解与极点刻画", kind: "theorem",
        aliases: ["遍历分解", "极点测度", "凸集端点", "条件期望分解"],
    },
    // Kolmogorov-Sinai 测度熵与分割。
    "ergodic-kolmogorov-sinai-entropy": {
        id: "ergodic-kolmogorov-sinai-entropy", l2Key: "dynamical-ergodic", name: "Kolmogorov-Sinai 测度熵", kind: "object",
        aliases: ["测度熵", "Kolmogorov-Sinai熵", "有限分割", "生成分割"],
    },
    // Shannon-McMillan-Breiman 定理。
    "ergodic-shannon-mcmillan-breiman": {
        id: "ergodic-shannon-mcmillan-breiman", l2Key: "dynamical-ergodic", name: "Shannon-McMillan-Breiman 定理", kind: "theorem",
        aliases: ["渐近等分性", "柱集测度指数衰减", "典型集", "局部熵"],
    },
    // 唯一遍历性与轨道等分布。
    "ergodic-unique-ergodicity-equidistribution": {
        id: "ergodic-unique-ergodicity-equidistribution", l2Key: "dynamical-ergodic", name: "唯一遍历性与一致等分布", kind: "theorem",
        aliases: ["唯一遍历性", "一致收敛的时间平均", "无理旋转", "轨道等分布"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const DYNAMICAL_ERGODIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // Poincare 复现定理。
    "ergodic-poincare-recurrence": {
        definitions: ["保测变换指测度空间 (X, B, mu) 上的可测映射 T 满足 mu(T^{-1} A) = mu(A) 对一切可测 A 成立。", "点 x 关于集合 A 复现指存在 n >= 1 使 T^n x 属于 A；复现时间为最小的这种 n。"],
        formulas: ["复现集合 A_infinity = {x in A : 存在无穷多 n 使 T^n x in A}，定理断言 mu(A \\ A_infinity) = 0。", "Kac 公式：T 遍历且 mu(A) > 0 时复现时间在 A 上的平均满足 int_A n_A(x) d mu = mu(X) = 1。", "由 Kac 公式得平均复现时间 E_{mu_A}[n_A] = 1 / mu(A)。"],
        theorems: ["Poincare 复现定理：若 mu 有限且 T 保测，则对任意 mu(A) > 0 的可测集 A，A 中几乎所有点都无穷多次返回 A。", "证明要点：若不返回集 B = A \\ 并集 T^{-n} A 有正测度，则 B, T^{-1} B, T^{-2} B, ... 互不相交且测度相同，与 mu 有限矛盾。", "Kac 引理：遍历情形下第一次返回时间关于诱导测度的期望恰为 1 / mu(A)，从而小集合的复现时间平均很长但仍有限。"],
        generalRequirements: ["必须假定测度有限（可归一化），无穷测度情形定理一般不成立。", "结论是几乎处处而非处处，必须保留零测例外集。", "涉及平均复现时间必须额外假定遍历性并说明所用的诱导测度。"],
        forbiddenErrors: ["【有限性缺失】在无穷测度系统（如直线上的平移）中套用复现定理，忽略平移下点一去不返的反例。", "【处处化】把几乎所有点复现说成所有点复现。", "【单次与无穷次混淆】只证明至少返回一次就等同于无穷多次返回。", "【时间可控误解】由复现定理断言复现时间有一致上界，实际复现时间可任意大。", "【Kac 公式误用】不假定遍历性就使用平均复现时间等于 1 / mu(A)。"],
        parameterConstraints: { measureFiniteness: "mu(X) < infinity（通常归一化为 1），无穷测度需换用 Hopf 型结论。", measurePreserving: "mu(T^{-1} A) = mu(A) 必须对全体可测集成立。", positiveMeasure: "目标集合必须满足 mu(A) > 0。", ergodicityForKac: "Kac 公式的平均复现时间结论要求 T 遍历。" },
        closureChecks: ["检查测度有限性与保测性是否都已声明。", "检查结论是否写成几乎处处成立。", "检查是否区分至少一次返回与无穷多次返回。", "检查平均复现时间的使用是否配以遍历性假设。"],
        scenarioChecks: { finiteMeasureSystem: ["确认 mu(X) 有限", "确认 T 保测", "得出几乎处处无穷多次返回"], infiniteMeasureCounterexample: ["举出平移或随机游走型反例", "说明不相交像列测度求和发散", "结论不成立"], recurrenceTime: ["假定遍历性", "使用诱导测度 mu_A", "平均复现时间为 1 / mu(A)"] },
    },
    // 不变测度存在性定理。
    "ergodic-krylov-bogolyubov-existence": {
        definitions: ["Krylov-Bogolyubov 定理断言紧致度量空间上的连续映射必有不变 Borel 概率测度，构造方式是取轨道经验测度的 Cesaro 平均并抽出弱星收敛子列。", "弱星拓扑指概率测度空间上由对连续函数积分给出的拓扑，紧致空间上的概率测度集在该拓扑下紧致。"],
        formulas: ["经验测度 mu_n = (1/n) sum_{k=0}^{n-1} T^k_* delta_x，其中 T_* 表示测度的推前。", "不变性检验 int f d mu = int f circ T d mu 对一切连续 f 成立。", "|int f circ T d mu_n - int f d mu_n| <= 2 ||f||_infinity / n -> 0，给出极限测度的不变性。"],
        theorems: ["Krylov-Bogolyubov 定理：X 紧致度量、T: X -> X 连续，则不变概率测度集 M_T(X) 非空、凸且在弱星拓扑下紧致。", "紧致性来源：Riesz 表示定理与 Banach-Alaoglu 给出概率测度集的弱星紧性，Prokhorov 定理在一般度量空间中以紧性（tightness）替代紧致性。", "M_T(X) 的端点恰为遍历测度，故非空紧凸性配合 Krein-Milman 保证遍历测度存在。"],
        generalRequirements: ["必须给出紧致性（或紧性条件），非紧空间中不变概率测度可能不存在。", "映射的连续性用于保证推前操作与弱星收敛相容，必须显式声明。", "断言不变测度唯一必须另加唯一遍历性等条件，存在性本身不给唯一性。"],
        forbiddenErrors: ["【紧致性遗漏】在非紧相空间上直接断言不变概率测度存在（平移映射即为反例）。", "【连续性遗漏】对仅可测的映射套用弱星极限论证。", "【唯一性误推】由存在性直接断言不变测度唯一。", "【极限次序错】先取弱星极限再做 Cesaro 平均，导致不变性论证失效。", "【测度类型混淆】把不变测度与绝对连续的不变密度混为一谈，后者的存在需要额外条件。"],
        parameterConstraints: { compactness: "X 紧致度量空间，或在一般空间中提供测度族的紧性。", continuity: "T 连续，保证 f circ T 连续。", probabilityNormalization: "构造的测度需归一化为概率测度。", extremePoints: "遍历测度对应 M_T(X) 的端点。" },
        closureChecks: ["检查紧致性与连续性两项前提。", "检查经验测度的 Cesaro 平均写法是否正确。", "检查不变性验证是否对所有连续函数进行。", "检查是否避免了对唯一性的越界断言。"],
        scenarioChecks: { compactSystem: ["取任一初值的经验测度", "抽弱星收敛子列", "验证极限测度不变"], nonCompactCase: ["检查是否存在紧性条件", "无紧性时可能只得到不变的无穷测度", "举平移反例"], ergodicExistence: ["不变测度集非空紧凸", "端点为遍历测度", "由 Krein-Milman 得遍历测度存在"] },
    },
    // Birkhoff 逐点遍历定理。
    "ergodic-birkhoff-pointwise-theorem": {
        definitions: ["Birkhoff 平均指 A_n f(x) = (1/n) sum_{k=0}^{n-1} f(T^k x)，即可观测量沿轨道的时间平均。", "逐点遍历定理断言该时间平均对几乎所有初值收敛，且极限是关于不变 sigma-代数的条件期望。"],
        formulas: ["A_n f(x) -> E[f | I](x) 几乎处处，其中 I 是 T-不变可测集构成的 sigma-代数。", "遍历情形 A_n f(x) -> int f d mu 对 mu-几乎所有 x 成立。", "L^1 收敛同时成立：||A_n f - E[f | I]||_{L^1} -> 0。"],
        theorems: ["Birkhoff 逐点遍历定理：T 保测、f 属于 L^1(mu)，则 A_n f 几乎处处收敛到 T-不变函数 bar f，且 int bar f d mu = int f d mu；若 T 遍历则 bar f 恒等于 int f d mu。", "证明依赖极大遍历不等式 mu({sup_n A_n |f| > lambda}) <= ||f||_{L^1} / lambda，或 Garsia 的极大函数论证。", "推论：遍历系统中集合 A 的访问频率几乎处处等于 mu(A)，把时间平均等同于空间平均，这是遍历假设的严格表述。"],
        generalRequirements: ["必须写明 f 属于 L^1 且测度不变，非可积观测量的时间平均可能发散。", "非遍历情形的极限必须写成关于不变 sigma-代数的条件期望，而不是全空间平均。", "结论为几乎处处收敛，必须保留零测例外集并不得声称一致收敛。"],
        forbiddenErrors: ["【遍历性缺失】未假定遍历性就把极限写成 int f d mu。", "【可积性忽略】对不可积观测量（如连分数的部分商）套用 Birkhoff 平均。", "【收敛模式误升】把几乎处处收敛提升为处处收敛或一致收敛（后者需唯一遍历性）。", "【测度混用】对非不变的初始分布直接使用定理结论。", "【个例误推】用几乎处处结论断言某个具体给定初值的轨道行为。"],
        parameterConstraints: { integrability: "f 属于 L^1(mu)；L^p（p >= 1）时同时有 L^p 收敛。", invariance: "mu 必须是 T-不变概率测度。", ergodicityOption: "遍历性把极限化为常数 int f d mu。", exceptionalSet: "结论允许一个 mu-零测例外集。" },
        closureChecks: ["检查 f 的可积性与 mu 的不变性。", "检查极限形式是否与是否假定遍历性一致。", "检查收敛类型是否写成几乎处处（必要时补充 L^1 收敛）。", "检查是否避免了对具体单个初值的断言。"],
        scenarioChecks: { ergodicSystem: ["确认遍历性", "时间平均收敛到空间平均", "访问频率等于集合测度"], nonErgodicSystem: ["极限写成条件期望", "识别不变 sigma-代数", "配合遍历分解解释"], nonIntegrableObservable: ["检查 int |f| d mu 是否有限", "不可积时定理失效", "改用截断或加权平均"] },
    },
    // von Neumann 均值遍历定理。
    "ergodic-von-neumann-mean-theorem": {
        definitions: ["Koopman 算子 U f = f circ T 在 L^2(mu) 上是等距算子（T 可逆时为酉算子）。", "均值遍历定理断言 Cesaro 平均 (1/n) sum_{k=0}^{n-1} U^k 在 L^2 强收敛到不变子空间上的正交投影。"],
        formulas: ["(1/n) sum_{k=0}^{n-1} U^k f -> P f（L^2 范数收敛），P 是到 ker(U - I) 的正交投影。", "正交分解 L^2 = ker(U - I) 直和 closure(range(U - I))，其中第二部分的 Cesaro 平均趋于零。", "遍历等价刻画：T 遍历当且仅当 ker(U - I) 只含常数函数，即 P f = int f d mu。"],
        theorems: ["von Neumann 均值遍历定理：Hilbert 空间上的压缩算子（特别是等距算子）U 的 Cesaro 平均强收敛到不变向量子空间上的正交投影；应用到 Koopman 算子即给出 L^2 版本的遍历定理。", "证明要点：在 ker(U - I) 上平均恒等，在 range(U - I) 的稠密子集上取 f = g - U g 得望远镜求和 (1/n)(g - U^n g) -> 0，再用一致有界性延拓。", "与 Birkhoff 定理的关系：均值定理给出 L^2 收敛而 Birkhoff 定理给出几乎处处收敛，二者互不包含，L^2 情形下极限一致。"],
        generalRequirements: ["必须区分 L^2 范数收敛与几乎处处收敛，不能用均值定理直接得到逐点结论。", "使用正交投影表述必须指明不变子空间是 ker(U - I)。", "把投影写成常数积分必须先假定遍历性。"],
        forbiddenErrors: ["【收敛类型混淆】由 L^2 收敛断言几乎处处收敛，或反向由 Birkhoff 定理断言 L^1 观测量的 L^2 收敛。", "【算子性质错】称 Koopman 算子在不可逆情形也是酉算子，实际只保证是等距算子。", "【子空间错认】把不变子空间写成 range(U - I) 的闭包而非其正交补。", "【遍历性缺失】直接把投影结果写成 int f d mu。", "【压缩条件遗漏】对范数大于 1 的算子套用该定理。"],
        parameterConstraints: { hilbertSpace: "在 L^2(mu) 或一般 Hilbert 空间中讨论，f 需平方可积。", operatorNorm: "U 必须是压缩算子（||U|| <= 1），Koopman 算子由保测性给出等距。", invariantSubspace: "极限投影的像空间为 ker(U - I)。", ergodicityOption: "遍历性等价于 ker(U - I) 为常数函数空间。" },
        closureChecks: ["检查所用算子的压缩或等距性质是否由保测性推出。", "检查收敛是在 L^2 范数意义下陈述。", "检查正交分解的两部分是否写对。", "检查遍历性假设与投影形式是否匹配。"],
        scenarioChecks: { l2Observable: ["确认 f 属于 L^2", "Cesaro 平均 L^2 收敛", "极限为不变部分的投影"], invertibleSystem: ["Koopman 算子为酉算子", "谱理论可用", "特征值 1 的重数刻画遍历性"], comparisonWithBirkhoff: ["均值定理给 L^2 收敛", "Birkhoff 定理给几乎处处收敛", "不得互相替代"] },
    },
    // 遍历性判据与谱刻画。
    "ergodic-ergodicity-spectral-criterion": {
        definitions: ["保测系统 (X, mu, T) 称为遍历，指任何 T-不变可测集 A（T^{-1} A = A）都满足 mu(A) = 0 或 1。", "谱刻画指用 Koopman 算子 U f = f circ T 的特征值 1 的重数来判定遍历性。"],
        formulas: ["不变函数判据：f 属于 L^2 且 f circ T = f 几乎处处，则 f 几乎处处为常数。", "傅里叶判据（圆周旋转 R_alpha）：U e_n = e^{2 pi i n alpha} e_n，不变函数存在非常数当且仅当存在 n 非零使 n alpha 属于整数。", "遍历等价形式：对一切 A、B 有 (1/n) sum_{k=0}^{n-1} mu(T^{-k} A 交 B) -> mu(A) mu(B)。"],
        theorems: ["遍历性的等价刻画：（一）不变集测度为 0 或 1；（二）不变可测函数几乎处处为常数；（三）Koopman 算子特征值 1 单重；（四）任意 L^1 观测量的时间平均几乎处处等于空间平均。", "无理旋转的遍历性：R_alpha(x) = x + alpha mod 1 关于 Lebesgue 测度遍历当且仅当 alpha 无理；alpha 有理时轨道有限从而存在非平凡不变集。", "扩张与双曲例子：倍映射 x -> 2x mod 1、有限型子移位配 Markov 测度（转移矩阵不可约）都是遍历的，可由不变集论证或混合性推出。"],
        generalRequirements: ["必须固定所讨论的不变测度，遍历性是关于测度的性质而非仅关于映射。", "使用不变函数判据必须写清几乎处处不变（而非处处）。", "对具体例子必须给出可验证的判据而非仅凭轨道图像断言。"],
        forbiddenErrors: ["【测度省略】只说映射遍历而不指明关于哪个不变测度。", "【严格不变误用】要求 T^{-1} A 与 A 完全相等而排除几乎处处相等的情形，导致判据过强。", "【蕴含方向错】把遍历性当作混合性的充分条件（实际是必要条件，混合蕴含遍历）。", "【有理旋转误判】称任意圆周旋转都遍历，忽略有理旋转的反例。", "【谱重数误算】称遍历等价于 Koopman 算子只有特征值 1，实际只要求特征值 1 的重数为一。"],
        parameterConstraints: { invariantMeasure: "mu 必须是 T-不变概率测度。", almostInvariance: "判据用几乎处处不变的集合与函数。", rotationCondition: "圆周旋转遍历当且仅当旋转数无理。", markovCondition: "子移位配 Markov 测度遍历要求转移矩阵不可约。" },
        closureChecks: ["检查是否明确了参照测度。", "检查所选判据（不变集、不变函数或谱）是否完整验证。", "检查与混合性的蕴含方向是否正确。", "检查具体例子的参数条件（如无理性、不可约性）。"],
        scenarioChecks: { circleRotation: ["判定 alpha 是否无理", "用傅里叶系数验证不变函数为常数", "有理情形给出非平凡不变集"], doublingMap: ["用二进制展开与移位共轭", "验证不变集测度为 0 或 1", "遍历且混合"], markovMeasure: ["检查转移矩阵不可约", "遍历性成立", "本原时进一步得到混合性"] },
    },
    // 混合性层级与判据。
    "ergodic-mixing-hierarchy": {
        definitions: ["强混合指对一切可测 A、B 有 mu(T^{-n} A 交 B) -> mu(A) mu(B)；弱混合指该收敛在 Cesaro 平均意义下成立。", "混合性层级指强混合蕴含弱混合、弱混合蕴含遍历，且三者互不等价的严格包含关系。"],
        formulas: ["强混合 lim_{n -> infinity} mu(T^{-n} A 交 B) = mu(A) mu(B)。", "弱混合 lim_{N} (1/N) sum_{n=0}^{N-1} |mu(T^{-n} A 交 B) - mu(A) mu(B)| = 0。", "相关函数形式 C_f,g(n) = int f circ T^n · g d mu - int f d mu int g d mu，强混合等价于 C_f,g(n) -> 0 对一切 f、g 属于 L^2。"],
        theorems: ["蕴含链：Bernoulli 蕴含 Kolmogorov 蕴含强混合蕴含弱混合蕴含遍历，且每步蕴含都严格（无理旋转遍历但不弱混合，存在弱混合而非强混合的例子）。", "弱混合的谱刻画：T 弱混合当且仅当 Koopman 算子除常数函数外无特征函数，即点谱只有单重的特征值 1；这与遍历性只要求特征值 1 单重形成对比。", "乘积判据：T 弱混合当且仅当 T x T 遍历；T 遍历不足以保证 T x T 遍历，故乘积系统的遍历性是弱混合的准确刻画。"],
        generalRequirements: ["必须按定义区分强混合、弱混合与遍历，不得以混沌等模糊说法代替。", "谈相关衰减时必须说明衰减是否有速率，混合性本身不给出速率。", "使用乘积判据必须写清乘积测度与乘积变换。"],
        forbiddenErrors: ["【蕴含反向】由遍历性推出混合性。", "【速率虚构】把强混合当作指数衰减相关，实际衰减速率需另加双曲性等条件。", "【谱刻画混淆】把弱混合的无非常数特征函数条件与遍历的特征值 1 单重条件互换。", "【乘积误判】称 T 遍历则 T x T 必遍历。", "【旋转误判】称无理旋转是混合的，实际它遍历但连弱混合都不满足（存在特征函数）。"],
        parameterConstraints: { measureSetting: "在概率测度空间上讨论，mu 为 T-不变。", strongMixing: "对一切可测 A、B 相关趋于零，无需一致速率。", weakMixing: "Cesaro 平均意义下相关趋于零，等价于 T x T 遍历。", spectralGap: "指数速率的相关衰减需要额外的谱间隙或双曲性假设。" },
        closureChecks: ["检查所用混合概念的定义式是否准确写出。", "检查蕴含链的方向与严格性是否正确陈述。", "检查是否避免了对衰减速率的无依据断言。", "检查乘积判据中变换与测度是否都取乘积形式。"],
        scenarioChecks: { strongMixingCheck: ["计算 mu(T^{-n} A 交 B) 的极限", "与 mu(A)mu(B) 比较", "必要时用稠密代数族验证"], weakMixingCheck: ["检验 T x T 是否遍历", "或检验无非常数特征函数", "Cesaro 平均相关趋零"], rotationCase: ["无理旋转遍历", "存在特征函数故非弱混合", "说明蕴含链的严格性"] },
    },
    // 遍历分解与极点性。
    "ergodic-decomposition-extremality": {
        definitions: ["M_T(X) 指紧度量空间 X 上全体 T-不变概率测度构成的集合，它是凸的且在弱星拓扑下紧。", "遍历分解指把任一不变测度写成遍历测度关于某个测度的积分平均。"],
        formulas: ["分解式 mu(A) = int_{M_T^e(X)} nu(A) d P(nu)，其中 M_T^e(X) 为遍历测度集，P 为该集上的概率测度。", "条件形式 mu = int mu_x d mu(x)，mu_x 是关于不变 sigma-代数 I 的条件测度且几乎处处遍历。", "可积观测量的分解 int f d mu = int (int f d nu) d P(nu)。"],
        theorems: ["极点刻画：nu 属于 M_T(X) 是该凸集的端点当且仅当 nu 遍历；非遍历测度必可写成两个不同不变测度的非平凡凸组合。", "遍历分解定理：X 紧度量、T 连续时任一不变测度存在唯一的遍历分解，分解测度 P 由不变 sigma-代数的条件期望给出。", "互奇性：两个不同的遍历测度必相互奇异，故遍历分解中的分量在支撑上互不重叠。"],
        generalRequirements: ["必须区分不变测度集与遍历测度集，分解的积分只在遍历测度上取。", "使用分解时必须说明分解测度的唯一性来源（不变 sigma-代数的条件期望）。", "涉及紧性与弱星收敛必须写明拓扑假设。"],
        forbiddenErrors: ["【端点误判】称任何不变测度都是端点，忽略非遍历测度的凸组合表示。", "【奇异性遗漏】把两个不同遍历测度当作可以绝对连续相关。", "【唯一性夸大】称分解中的遍历分量可任意选取，实际分解测度唯一。", "【假设省略】在非紧或不连续设定下直接引用遍历分解定理。", "【线性组合混淆】把遍历分解写成有限凸组合而排除连续族积分。"],
        parameterConstraints: { space: "X 为紧度量空间，T 连续，保证 M_T(X) 非空紧凸。", ergodicSet: "分解只对遍历测度族积分，M_T^e(X) 是端点集。", uniqueness: "分解测度 P 由不变 sigma-代数唯一决定。", mutualSingularity: "不同遍历测度相互奇异。" },
        closureChecks: ["检查是否验证了测度的不变性与遍历性。", "检查分解式中的积分域是否为遍历测度集。", "检查是否引用了紧性与连续性假设。", "检查是否指出了不同遍历分量的互奇性。"],
        scenarioChecks: { extremalityProof: ["假设 nu 非遍历取不变集 A 使 0 < nu(A) < 1", "构造两个条件测度", "得到非平凡凸组合故非端点"], decompositionUse: ["取不变 sigma-代数的条件期望", "得到几乎处处遍历的条件测度", "对观测量积分平均"], multipleMeasures: ["列出所有遍历测度", "验证互奇性", "任一不变测度写为其凸组合或积分"] },
    },
    // Kolmogorov-Sinai 测度熵。
    "ergodic-kolmogorov-sinai-entropy": {
        definitions: ["有限分割 xi 的熵 H(xi) = - sum_i mu(C_i) log mu(C_i)，其中 C_i 是分割块。", "系统的测度熵 h_mu(T) 是对一切有限分割取分割熵增长率的上确界。"],
        formulas: ["分割熵率 h_mu(T, xi) = lim_{n -> infinity} (1/n) H(xi 联 T^{-1} xi 联 ... 联 T^{-(n-1)} xi)。", "测度熵 h_mu(T) = sup_{xi 有限} h_mu(T, xi)。", "条件形式 h_mu(T, xi) = lim_n H(xi | T^{-1} xi 联 ... 联 T^{-n} xi)。", "Bernoulli 移位 h = - sum_i p_i log p_i；Markov 测度 h = - sum_{i,j} p_i P_{ij} log P_{ij}。"],
        theorems: ["Kolmogorov-Sinai 定理：若 xi 是生成分割（其在 T 作用下生成的 sigma-代数与整个可测结构模零测集相同），则 h_mu(T) = h_mu(T, xi)，无需再取上确界。", "幂与逆的行为：h_mu(T^k) = k h_mu(T)（k 为正整数），T 可逆时 h_mu(T^{-1}) = h_mu(T)。", "变分原理：连续变换的拓扑熵等于全体不变测度上测度熵的上确界 h_top(T) = sup_{mu 属于 M_T(X)} h_mu(T)，上确界在扩张系统中由最大熵测度达到。"],
        generalRequirements: ["计算测度熵必须指明所用测度与分割，并说明分割是否生成。", "使用 Kolmogorov-Sinai 定理必须先验证生成性，否则只得到下界。", "区分测度熵与拓扑熵，二者只通过变分原理相联系。"],
        forbiddenErrors: ["【生成性未验】对任意分割直接套用 Kolmogorov-Sinai 定理得出测度熵。", "【上确界误当最大】称单个分割的熵率必等于测度熵。", "【幂律错写】写成 h(T^k) = h(T) 或 h(T^k) = h(T)^k。", "【熵混淆】把测度熵与拓扑熵等同，不提变分原理与测度的选择。", "【达到性假设】断言变分原理的上确界总能被某个测度达到，实际需扩张性或可期性等条件。"],
        parameterConstraints: { partition: "分割为有限（或可数且熵有限）可测分割。", generating: "生成分割条件是联合 sigma-代数模零测集充满整个可测结构。", powerRule: "h(T^k) = k h(T) 对正整数 k 成立。", variational: "变分原理要求 X 紧、T 连续。" },
        closureChecks: ["检查测度与分割是否明确给出。", "检查生成性是否验证。", "检查幂次与逆的熵公式是否正确。", "检查测度熵与拓扑熵的区分与联系是否写清。"],
        scenarioChecks: { bernoulliEntropy: ["取坐标分割为生成分割", "独立性给出 H 的可加性", "熵为 - sum p_i log p_i"], markovEntropy: ["用平稳分布与转移矩阵", "条件熵求和", "得到 - sum p_i P_ij log P_ij"], variationalUse: ["确认紧性与连续性", "在不变测度集上取上确界", "扩张系统寻找最大熵测度"] },
    },
    // Shannon-McMillan-Breiman 定理。
    "ergodic-shannon-mcmillan-breiman": {
        definitions: ["柱集 xi_n(x) 指点 x 在分割 xi 联 T^{-1} xi 联 ... 联 T^{-(n-1)} xi 中所属的块，即 x 的前 n 步编码确定的集合。", "渐近等分性指几乎所有点的柱集测度以熵率为指数衰减。"],
        formulas: ["逐点收敛 - (1/n) log mu(xi_n(x)) -> h_mu(T, xi) 对 mu-几乎所有 x（T 遍历时极限为常数）。", "典型集估计 mu(xi_n(x)) ≈ exp(-n h)，典型集元素个数约 exp(n h)。", "非遍历情形极限为 I-可测函数 h(x)，且 int h d mu = h_mu(T, xi)。"],
        theorems: ["Shannon-McMillan-Breiman 定理：保测系统配有限熵分割时 - (1/n) log mu(xi_n(x)) 几乎处处且在 L^1 中收敛到条件熵函数；遍历时该极限几乎处处等于 h_mu(T, xi)。", "与 Birkhoff 的关系：该定理不是 Birkhoff 定理的直接推论，因被平均的函数随 n 变化，证明需用鞅收敛或 Maker 型推广。", "Brin-Katok 局部熵定理：把分割柱集换成 Bowen 球，- (1/n) log mu(B_n(x, epsilon)) 在 epsilon -> 0 后给出同一个熵值，从而熵有度量刻画。"],
        generalRequirements: ["必须写清极限是几乎处处意义，且遍历性是极限为常数的前提。", "必须说明分割熵有限的假设。", "使用指数估计必须限制在典型集上，不得对所有点断言。"],
        forbiddenErrors: ["【遍历性省略】在非遍历系统中直接把极限写成常数 h。", "【逐点夸大】称所有点的柱集测度都按 exp(-n h) 衰减，忽略零测例外集。", "【推导误认】把该定理当作 Birkhoff 定理对固定函数的直接应用。", "【熵有限遗漏】对熵无限的分割套用结论。", "【球与柱混用】不加 epsilon -> 0 极限就把 Bowen 球估计等同于柱集估计。"],
        parameterConstraints: { partitionEntropy: "分割需满足 H(xi) < infinity。", ergodicity: "极限为常数 h 需要 T 遍历，否则为 I-可测函数。", convergenceMode: "结论为几乎处处收敛并伴随 L^1 收敛。", brinKatok: "局部熵刻画需先取 n -> infinity 再令 epsilon -> 0。" },
        closureChecks: ["检查是否声明了几乎处处收敛与例外零测集。", "检查遍历性假设与极限常数化的对应。", "检查分割熵有限条件。", "检查典型集计数估计的指数是否与熵一致。"],
        scenarioChecks: { typicalSetCount: ["由柱集测度 exp(-n h) 估计", "典型集测度趋于 1", "元素个数约 exp(n h)"], nonErgodicCase: ["极限为不变 sigma-代数可测函数", "对分解分量分别取值", "积分回到分割熵率"], localEntropy: ["用 Bowen 度量球", "先 n -> infinity", "再 epsilon -> 0 得熵"] },
    },
    // 唯一遍历性与轨道等分布。
    "ergodic-unique-ergodicity-equidistribution": {
        definitions: ["系统 (X, T) 称唯一遍历，指 X 上仅存在一个 T-不变 Borel 概率测度（该测度自动遍历，因它必为端点）。", "轨道等分布指所有初始点的时间平均一致收敛到同一空间平均。"],
        formulas: ["一致收敛判据 (1/n) sum_{k=0}^{n-1} f(T^k x) -> int f d mu 对一切连续 f 一致于 x 成立。", "Weyl 等分布判据：{x_n} 在圆周上等分布当且仅当对一切非零整数 m 有 (1/N) sum_{n<=N} e^{2 pi i m x_n} -> 0。", "无理旋转 (1/N) sum_{n<=N} f(x + n alpha) -> int_0^1 f，对连续 f 一致成立。"],
        theorems: ["唯一遍历性的等价刻画：(X, T) 唯一遍历当且仅当对每个连续函数 f 的时间平均一致收敛到常数，当且仅当 M_T(X) 是单点集。", "无理旋转的唯一遍历性：R_alpha 在 alpha 无理时唯一遍历，故每条轨道都等分布，这比遍历性给出的几乎处处结论强。", "对比：一般遍历系统只保证几乎处处点的时间平均收敛（Birkhoff），存在测度零的例外集；唯一遍历性把结论提升为对一切点成立且收敛一致。"],
        generalRequirements: ["必须区分几乎处处收敛与对一切点的一致收敛，后者需唯一遍历性。", "检验对象必须是连续函数，对一般可积函数一致收敛不成立。", "对具体例子必须给出无理性或极小性等可验证条件。"],
        forbiddenErrors: ["【结论越权】在仅有遍历性时断言每个初始点的轨道都等分布。", "【函数类扩大】把一致收敛结论套用到不连续或仅可积的观测量。", "【极小性混淆】把极小性与唯一遍历性等同，实际极小不蕴含唯一遍历。", "【有理反例遗漏】称任意圆周旋转都使轨道等分布，忽略有理情形轨道有限。", "【判据误用】用 Weyl 判据时漏掉 m 非零的限制。"],
        parameterConstraints: { space: "X 紧度量空间，T 连续。", testFunctions: "一致收敛结论对连续函数成立。", rotation: "圆周旋转唯一遍历当且仅当 alpha 无理。", weylSum: "Weyl 判据对一切非零整数频率 m 检验。" },
        closureChecks: ["检查不变测度是否唯一。", "检查收敛的一致性与函数类是否匹配。", "检查是否避免了极小性与唯一遍历性的混同。", "检查具体例子的参数条件。"],
        scenarioChecks: { rotationEquidistribution: ["验证 alpha 无理", "用 Weyl 指数和判据", "结论对一切初始点成立"], uniquenessProof: ["设两个不变测度", "用连续函数时间平均一致收敛", "得两测度相等"], contrastWithBirkhoff: ["仅遍历时给出零测例外集", "唯一遍历时无例外点", "说明结论强度差别"] },
    },
};
