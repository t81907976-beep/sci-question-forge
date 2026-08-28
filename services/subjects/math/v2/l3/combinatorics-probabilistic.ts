import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“概率组合”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMBINATORICS_PROBABILISTIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 一阶矩法：由期望推存在性。
    "probcomb-first-moment-method": {
        id: "probcomb-first-moment-method", l2Key: "combinatorics-probabilistic", name: "一阶矩法与期望论证", kind: "theorem",
        aliases: ["一阶矩法", "期望论证", "存在性概率证明", "期望阈值论证"],
    },
    // 二阶矩法：由方差推几乎必然存在。
    "probcomb-second-moment-method": {
        id: "probcomb-second-moment-method", l2Key: "combinatorics-probabilistic", name: "二阶矩法与方差论证", kind: "theorem",
        aliases: ["二阶矩法", "方差论证", "Paley-Zygmund下界", "计数变量集中"],
    },
    // Lovász 局部引理与相依事件的避免。
    "probcomb-lovasz-local-lemma": {
        id: "probcomb-lovasz-local-lemma", l2Key: "combinatorics-probabilistic", name: "Lovász 局部引理", kind: "lemma",
        aliases: ["Lovász局部引理", "局部引理", "相依图判据", "ep(d+1)<=1"],
    },
    // 删除法与交替法：先随机后修补。
    "probcomb-alteration-deletion": {
        id: "probcomb-alteration-deletion", l2Key: "combinatorics-probabilistic", name: "删除法与交替法", kind: "algorithm",
        aliases: ["删除法", "交替法", "先随机后修补", "坏结构删除"],
    },
    // 鞅集中：Azuma 与 Talagrand 型不等式。
    "probcomb-martingale-concentration": {
        id: "probcomb-martingale-concentration", l2Key: "combinatorics-probabilistic", name: "鞅集中与 Azuma 不等式", kind: "theorem",
        aliases: ["Azuma不等式", "点暴露鞅", "边暴露鞅", "Talagrand不等式"],
    },
    // 随机图的阈值与相变。
    "probcomb-random-graph-threshold": {
        id: "probcomb-random-graph-threshold", l2Key: "combinatorics-probabilistic", name: "随机图阈值与相变", kind: "theorem",
        aliases: ["随机图模型", "G(n,p)阈值", "巨大分支相变", "连通性阈值"],
    },
    // Janson 不等式与下尾估计。
    "probcomb-janson-inequality": {
        id: "probcomb-janson-inequality", l2Key: "combinatorics-probabilistic", name: "Janson 不等式与下尾估计", kind: "theorem",
        aliases: ["Janson不等式", "下尾估计", "Suen不等式", "不出现坏子结构的概率"],
    },
    // 熵方法与计数上界。
    "probcomb-entropy-method": {
        id: "probcomb-entropy-method", l2Key: "combinatorics-probabilistic", name: "熵方法与计数上界", kind: "algorithm",
        aliases: ["熵方法", "次可加性计数", "Shearer引理", "投影计数上界"],
    },
    // 随机着色与超图可着色判据。
    "probcomb-random-coloring-hypergraph": {
        id: "probcomb-random-coloring-hypergraph", l2Key: "combinatorics-probabilistic", name: "随机着色与超图二着色判据", kind: "criterion",
        aliases: ["性质B", "超图二着色", "随机着色论证", "Radhakrishnan-Srinivasan界"],
    },
    // 半随机方法（nibble）与近完美覆盖。
    "probcomb-semirandom-nibble": {
        id: "probcomb-semirandom-nibble", l2Key: "combinatorics-probabilistic", name: "半随机方法与 Rödl nibble", kind: "algorithm",
        aliases: ["半随机方法", "Rödl nibble", "近完美匹配覆盖", "分批随机选取"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMBINATORICS_PROBABILISTIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // 一阶矩法：由期望推存在性。
    "probcomb-first-moment-method": {
        definitions: ["一阶矩法用随机对象的期望推断存在性：若某计数变量的期望小于 1（或小于某阈值），则必有取值达不到该阈值的样本，从而存在具备所求性质的对象；这是概率方法最基本的非构造性论证"],
        formulas: ["存在性判据：E[X] < 1 且 X 取非负整数值 ⇒ P(X = 0) > 0", "阈值形式：存在样本使 X <= E[X]，也存在样本使 X >= E[X]", "并集界（第一矩的等价形式）：P(∪ A_i) <= sum P(A_i)，故 sum P(A_i) < 1 ⇒ 存在避开所有 A_i 的样本", "Ramsey 下界：C(n, k) 2^{1 - C(k,2)} < 1 ⇒ R(k, k) > n", "锦标赛/竞赛型应用：E[单色或坏结构数] = (对象数) × (单个概率)，由线性性逐项计算", "期望的线性性对相依变量同样成立，这是该方法可绕过独立性的原因"],
        theorems: ["方法的核心是期望线性性，不需要任何独立性假设，因此在事件高度相依时仍然可用；这与需要独立性的集中型论证形成分工", "结论是纯存在性的：由 E[X] < 1 只得 P(X = 0) > 0，不给出构造，也不给出满足性质的对象比例（要得到比例需二阶矩或集中论证）", "阈值论证的两侧同时成立：既存在不超过均值的样本也存在不低于均值的样本，故用于求上界还是下界取决于所构造的计数变量方向，必须明确说明", "当 E[X] 略大于 1 时方法失效，但可用删除法（先随机再删去坏结构）挽救，得到规模只损失 E[X] 量级的构造", "非负整数取值是必要的：对可取分数值或负值的 X，E[X] < 1 不能推出 P(X = 0) > 0，此时须改用 Markov 型不等式并核对非负性"],
        generalRequirements: ["必须明确概率空间（随机对象的分布）与所计数的坏结构", "必须验证计数变量非负且取整数值", "断言存在性时须说明结论是非构造的"],
        forbiddenErrors: ["【非整数取值】对非整数值随机变量由 E[X] < 1 推 P(X = 0) > 0", "【构造性误称】声称一阶矩法给出显式对象", "【概率空间不清】不写出随机模型即计算期望", "【方向混淆】需要下界时构造了上界方向的计数变量", "【独立性冗余假设】误以为必须假设独立才能用期望线性性"],
        parameterConstraints: { nonnegativeInteger: "计数变量须非负且取整数值。", modelSpecified: "须固定随机对象的分布。", nonconstructive: "结论仅为存在性。", thresholdDirection: "须说明使用均值的上侧或下侧。" },
        closureChecks: ["写出随机模型与坏结构计数变量。", "用线性性计算期望。", "与阈值 1（或目标值）比较。", "若期望略超阈值，转用删除法。"],
        scenarioChecks: { ramseyLowerBound: ["随机 2-着色完全图", "计算单色团期望数", "由 < 1 得存在无单色团着色"], tournamentProperty: ["随机定向每条边", "计算坏子集期望数", "由 < 1 得存在满足性质的锦标赛"], setSystemExistence: ["随机取子集族", "计算违反条件的对数期望", "由并集界得存在性"] },
    },
    // 二阶矩法：由方差推几乎必然存在。
    "probcomb-second-moment-method": {
        definitions: ["二阶矩法用方差控制计数变量与其期望的偏离，从而把“期望为正”升级为“几乎必然为正”，是判定随机结构中子结构是否几乎必然出现的标准工具，也是随机图阈值分析的基础"],
        formulas: ["基本形式：Var(X) = o(E[X]^2) ⇒ X / E[X] -> 1 依概率，特别地 P(X = 0) -> 0", "由 Chebyshev 得 P(|X - E X| >= t) <= Var(X) / t^2，取 t = E[X] 给 P(X = 0) <= Var(X) / E[X]^2", "指示变量和的方差：X = sum I_i 时 Var(X) = sum Var(I_i) + sum_{i ≠ j} Cov(I_i, I_j)", "相依项形式：P(X = 0) <= (1/E[X]) + (sum_{i ~ j} P(A_i ∩ A_j) / E[X]^2)，i ~ j 指相依对", "Paley-Zygmund：P(X > 0) >= E[X]^2 / E[X^2]（对非负 X）", "阈值判定：E[X] -> 0 给不出现，E[X] -> ∞ 且 Var(X) = o(E[X]^2) 给几乎必然出现"],
        theorems: ["E[X] -> ∞ 单独不足以推出 P(X > 0) -> 1：期望可能被少数样本上的巨大取值支配，因此必须验证方差条件或用 Paley-Zygmund，凡跳过方差直接断言出现的论证都是错误的", "方差计算的关键是只保留相依的指示变量对：独立对的协方差为零，故 Var 的量级由“相邻对”结构（共享顶点或元素的子结构对）决定，这也解释了阈值出现在何处", "二阶矩法给出的是依概率结论而非几乎必然（a.s.）结论，若需沿 n 的几乎必然性须配合 Borel-Cantelli 或更强集中不等式", "一阶矩与二阶矩合用给出阈值现象的两侧：一阶矩给消失侧（0-statement），二阶矩给出现侧（1-statement），二者的阈值在多数子图计数问题中匹配到常数", "当相依性过强（如稠密子结构计数）方差条件失效，须改用 Janson 型下尾估计或鞅集中，故二阶矩法的适用范围由相依对的贡献决定"],
        generalRequirements: ["必须把计数变量写成指示变量之和并识别相依对", "验证 Var(X) = o(E[X]^2) 后才可断言几乎必然出现", "结论须区分依概率与几乎必然"],
        forbiddenErrors: ["【期望趋无穷即出现】只由 E[X] -> ∞ 断言 P(X > 0) -> 1", "【协方差漏项】方差中遗漏相依对的协方差", "【独立性误设】把共享元素的指示变量当作独立", "【结论强化】把依概率结论说成几乎必然", "【强相依滥用】相依贡献占主项时仍套用二阶矩结论"],
        parameterConstraints: { varianceCondition: "须验证 Var(X) = o(E[X]^2)。", indicatorDecomposition: "X 须写为指示变量之和。", dependencyStructure: "须列出共享元素的相依对。", convergenceMode: "结论为依概率收敛。" },
        closureChecks: ["写出指示变量分解与期望。", "枚举相依对并计算协方差和。", "检验方差与期望平方的量级比。", "陈述依概率结论并说明阈值两侧。"],
        scenarioChecks: { subgraphAppearance: ["计算期望子图数", "按共享顶点数分类相依对", "验证方差条件得阈值"], thresholdTwoSided: ["用一阶矩给消失侧", "用二阶矩给出现侧", "比较两侧阈值是否匹配"], positiveProbability: ["计算 E[X] 与 E[X^2]", "套用 Paley-Zygmund", "得 P(X > 0) 的常数下界"] },
    },
    // Lovász 局部引理与相依事件的避免。
    "probcomb-lovasz-local-lemma": {
        definitions: ["局部引理处理有限多个坏事件在局部相依但整体不完全独立时的避免问题：只要每个坏事件概率小、且只与少数其他事件相依，就必有同时避开所有坏事件的样本；相依关系用相依图（每个事件与其非邻居事件族相互独立）刻画"],
        formulas: ["对称形式：P(A_i) <= p，每个 A_i 至多与 d 个其他事件相依，且 e p (d + 1) <= 1 ⇒ P(∩ 补A_i) > 0", "一般形式：存在 x_i ∈ [0,1) 使 P(A_i) <= x_i prod_{j ~ i} (1 - x_j) ⇒ P(∩ 补A_i) >= prod (1 - x_i) > 0", "相依图判据：A_i 与 {A_j : j 不相邻于 i} 整体相互独立（不是两两独立）", "超图二着色应用：每边至少 k 个点、每边与至多 d 条边相交，e (d + 1) 2^{1-k} <= 1 ⇒ 存在二着色无单色边", "Moser-Tardos：重采样违反事件的变量，期望重采样次数 <= sum x_i/(1 - x_i)，给出多项式期望时间的构造性算法", "偏侧（lopsided）形式：只需负相依方向的条件 P(A_i | ∩_{j ∈ S} 补A_j) <= x_i prod_{j ~ i}(1 - x_j)"],
        theorems: ["条件里的 d 计的是相依事件个数而非事件总数，这是局部引理优于并集界的全部原因：事件总数可以远大于 1/p，只要局部度受控结论仍成立", "相互独立性要求是整体的：A_i 必须与其全部非邻居事件构成的族相互独立，仅两两独立不足以支撑证明，构造相依图时须逐一核验共享随机变量", "常数 e 与 (d+1) 均不可随意改良：存在使 e p (d+1) 略大于 1 时结论失效的例子（Shearer 给出树形相依图上的精确阈值），故不能把判据放松为 p d <= 1", "经典形式只给出正概率（可能指数小），不给出构造；Moser-Tardos 熵压缩论证把它变为多项式期望时间算法，但需坏事件由变量族显式决定", "对称形式是一般形式取 x_i = 1/(d+1) 的特例，当各事件概率或度数不均衡时应直接用一般形式，硬套对称形式会得到过紧而失败的判据"],
        generalRequirements: ["必须显式给出坏事件族与相依图并说明独立性依据", "使用对称形式须验证 e p (d + 1) <= 1", "断言构造性须说明采用 Moser-Tardos 算法版本"],
        forbiddenErrors: ["【度数误计】把 d 取为事件总数或漏计共享变量的相依边", "【两两独立代替】以两两独立冒充与非邻居族的整体独立", "【判据放松】用 p d <= 1 之类无 e 因子的条件", "【构造性误称】由经典局部引理直接声称多项式算法", "【非均衡硬套】概率或度数差异大时仍用对称形式"],
        parameterConstraints: { dependencyDegree: "d 为相依事件个数上界。", symmetricCondition: "对称形式须满足 e p (d + 1) <= 1。", mutualIndependence: "须与全部非邻居事件相互独立。", constructiveVersion: "构造性结论须用 Moser-Tardos。" },
        closureChecks: ["列出坏事件族与其概率上界。", "建立相依图并核验独立性。", "验证对称或一般形式的判据不等式。", "说明结论是存在性还是算法性。"],
        scenarioChecks: { hypergraphTwoColoring: ["坏事件为某边单色", "统计相交边数得 d", "验证 e(d+1)2^{1-k} <= 1"], latinTransversal: ["坏事件为某对格同色", "计算相依对数", "套用对称形式"], algorithmicVersion: ["把坏事件写为变量函数", "运行重采样算法", "由 sum x_i/(1-x_i) 界期望步数"] },
    },
    // 删除法与交替法：先随机后修补。
    "probcomb-alteration-deletion": {
        definitions: ["删除法（交替法）先取随机对象，再删去所有违反条件的元素或坏结构，用期望估计删除量，从而在一阶矩条件不足时仍得到有效构造；核心是把“坏结构数的期望”转化为规模损失"],
        formulas: ["基本估计：随机取 n 个元素、坏结构期望数为 E[X]，则存在规模 >= n - E[X] 的无坏结构子对象", "独立集下界：平均度 d 的图中随机以 p = 1/d 取点再删去被覆盖端点，得 alpha(G) >= n/(2d)", "Ramsey 改良：取 G(n, 1/2) 删去每个单色 k-团的一点，得 R(k, k) > (1 - o(1)) (k/e) 2^{k/2}", "Turán 型：alpha(G) >= sum_v 1/(d_v + 1)（Caro-Wei，可由随机序或删除法得到）", "高围长高色数：G(n, p) 取 p = n^{-1+1/(2g)}，删去短圈上的点，同时保持独立数小", "删除后须重算：删除改变了对象，所有需要的性质必须在删除后的对象上重新验证"],
        theorems: ["删除法的适用区间正是一阶矩法失效之处：E[X] 与目标规模同阶而非小于 1 时，删除只损失常数比例，故结论仍非平凡；若 E[X] 与 n 同阶或更大则方法失效", "删除操作不是保持性质的：删点可能破坏原先验证过的性质（如连通性、正则性、度数下界），必须在删除后的对象上重新验证全部所需性质", "删除法给出的界通常只差常数或 log 因子于最优，例如 Ramsey 下界仅比一阶矩法改进常数倍，故不能宣称它带来量级改进", "先随机后修补的顺序不可交换：先删后随机会破坏概率模型的独立性，导致期望计算失效", "与局部引理的分工：删除法允许少量坏结构存在并事后消除，局部引理要求完全避开所有坏事件，故当坏结构不可容忍时须用局部引理"],
        generalRequirements: ["必须给出坏结构的期望数与删除规则", "必须在删除后的对象上重新验证所需性质", "结论规模须写成随机规模减去期望删除量"],
        forbiddenErrors: ["【性质不复验】删除后直接沿用删除前验证的性质", "【期望过大】E[X] 与 n 同阶仍宣称有效构造", "【顺序颠倒】先确定删除集再取随机对象", "【量级夸大】把常数倍改进说成量级改进", "【删除量不控】不估计期望删除量即断言存在性"],
        parameterConstraints: { expectedBadCount: "须估计坏结构期望数。", deletionRule: "删除规则须显式且可执行。", revalidation: "删除后须复验全部性质。", sizeGuarantee: "规模下界为 n - E[X] 形式。" },
        closureChecks: ["写出随机模型与坏结构计数。", "计算期望删除量。", "执行删除并复验性质。", "给出剩余规模的下界。"],
        scenarioChecks: { independentSetBound: ["按 1/d 随机取点", "删去内部边的端点", "得 n/(2d) 量级独立集"], ramseyImprovement: ["随机二着色", "删去每个单色团一点", "得改良的 R(k,k) 下界"], girthChromatic: ["取稀疏随机图", "删去短圈上的点", "同时保证围长大与独立数小"] },
    },
    // 鞅集中：Azuma 与 Talagrand 型不等式。
    "probcomb-martingale-concentration": {
        definitions: ["鞅集中把随机图或随机过程的函数按信息逐步暴露写成鞅，用增量的有界性推出该函数在其期望附近的指数集中；点暴露与边暴露是随机图上两种标准的暴露顺序，Talagrand 不等式则以中位数与 Lipschitz 证书为核心"],
        formulas: ["Azuma-Hoeffding：鞅 X_0, ..., X_m 满足 |X_i - X_{i-1}| <= c_i，则 P(|X_m - X_0| >= t) <= 2 exp(-t^2 / (2 sum c_i^2))", "等增量形式：|X_i - X_{i-1}| <= 1 时 P(|X_m - E X| >= lambda sqrt(m)) <= 2 exp(-lambda^2 / 2)", "边暴露鞅：按 C(n,2) 条边逐条暴露，色数、独立数等图参数的增量至多 1", "点暴露鞅：按 n 个点逐点暴露，色数增量至多 1，故 P(|chi - E chi| >= lambda sqrt(n)) <= 2 exp(-lambda^2/2)", "Talagrand：X 为 1-Lipschitz 且 f-certifiable，则 P(X <= b - t sqrt(f(b))) P(X >= b) <= exp(-t^2/4)", "McDiarmid 有界差分：|f(x) - f(x')| <= c_i（仅第 i 个坐标不同）时 P(|f - E f| >= t) <= 2 exp(-2t^2 / sum c_i^2)"],
        theorems: ["Azuma 的界依赖增量上界的平方和而非变量个数，故选择暴露顺序会改变界的量级：点暴露给 sqrt(n) 级偏差，边暴露给 n 级偏差，对色数这类参数点暴露严格更优", "有界增量条件是本质的：增量无界（如三角形计数）时 Azuma 完全失效，须改用 Kim-Vu 多项式集中或 Janson 型估计，套用 Azuma 会得到错误的指数界", "鞅集中控制的是围绕期望（或中位数）的偏离，本身不给出期望的值：要得到具体数值仍需独立计算 E[X] 的渐近，二者缺一不可", "Talagrand 不等式的优势在于偏差尺度为 sqrt(E X) 而非 sqrt(n)，代价是需要构造大小 f(b) 的证书集，证书不存在时不能使用", "McDiarmid 是独立坐标情形的 Azuma 特例；一旦坐标间有约束（如均匀随机置换、固定度数序列）就不能直接套用，须改用置换鞅或对称化技巧"],
        generalRequirements: ["必须写出鞅结构与暴露顺序并验证增量上界", "使用 Talagrand 须给出 Lipschitz 常数与证书函数", "集中结论须配合期望的独立估计"],
        forbiddenErrors: ["【增量无界】对增量无界的统计量套用 Azuma", "【暴露顺序不当】用边暴露得到弱界却宣称最优", "【期望缺失】只给集中不给期望渐近", "【证书缺失】无证书构造即用 Talagrand", "【独立性误设】坐标有约束时直接套 McDiarmid"],
        parameterConstraints: { boundedIncrement: "须验证 |X_i - X_{i-1}| <= c_i。", exposureOrder: "须声明点暴露或边暴露。", lipschitzCertificate: "Talagrand 须给出证书大小 f(b)。", expectationEstimate: "须另行给出期望渐近。" },
        closureChecks: ["定义过滤与鞅序列。", "验证增量上界并求平方和。", "代入 Azuma 或 Talagrand 得偏差界。", "结合期望估计给出最终结论。"],
        scenarioChecks: { chromaticNumberConcentration: ["用点暴露鞅", "增量上界取 1", "得 sqrt(n) 尺度集中"], lipschitzFunctional: ["验证有界差分常数", "套用 McDiarmid", "给出双侧尾界"], talagrandSharpening: ["构造证书集", "验证 1-Lipschitz", "得 sqrt(E X) 尺度偏差"] },
    },
    // 随机图的阈值与相变。
    "probcomb-random-graph-threshold": {
        definitions: ["随机图模型 G(n, p) 与 G(n, m) 中，单调性质通常在某个临界概率附近由几乎不成立突变为几乎成立，该临界值称为阈值；巨大分支的出现是最典型的相变现象"],
        formulas: ["模型：G(n, p) 每条边独立以概率 p 出现，期望边数 p C(n,2)；G(n, m) 均匀取 m 条边，两模型在 m ~ p C(n,2) 时渐近等价", "连通性阈值：p = (log n + c)/n 时 P(连通) -> exp(-e^{-c})，故 p = (log n + omega(1))/n 给几乎必然连通", "孤立点消失与连通同阈值：孤立点数依分布收敛到参数 e^{-c} 的 Poisson", "巨大分支相变：p = c/n 时 c < 1 最大分支 O(log n)，c = 1 为 Theta(n^{2/3})，c > 1 出现唯一规模 ~ y n 的巨大分支，y 由 1 - y = e^{-cy} 决定", "子图出现阈值：固定图 H 的阈值为 p = n^{-1/m(H)}，m(H) = max_{H' ⊆ H} e(H')/v(H')", "完美匹配与 Hamilton 圈阈值均为 p = (log n + omega(1))/n（后者需 log n + log log n 级修正）"],
        theorems: ["子图阈值由最密子图密度 m(H) 决定而非 H 自身的边点比：忽略子图取极大值会给出错误阈值，这是子图计数问题的标准陷阱", "阈值两侧的证明分工固定：0-statement 用一阶矩（期望趋零），1-statement 用二阶矩或集中不等式，二者必须分别给出，单侧论证不能推出相变", "临界窗口内（p = 1/n + lambda n^{-4/3}）行为既非亚临界也非超临界，最大分支为 n^{2/3} 量级并具非退化极限分布，故不能把 c = 1 归入任一侧", "巨大分支的唯一性是定理内容而非显然：超临界时第二大分支仅 O(log n)，断言存在多个线性规模分支是错误的", "所有单调性质都有阈值（Bollobás-Thomason），但阈值是否尖锐（sharp）取决于性质是否为局部性质：连通性、可满足性等为尖锐阈值，固定子图出现为粗阈值"],
        generalRequirements: ["必须声明所用模型与 p 或 m 的取值范围", "阈值论证须同时给出两侧", "子图阈值须按最密子图密度计算"],
        forbiddenErrors: ["【密度误算】用 e(H)/v(H) 代替最密子图密度", "【单侧论证】只给期望趋零即宣称阈值", "【临界归侧】把 c = 1 当作亚临界或超临界处理", "【多巨大分支】断言超临界存在多个线性分支", "【模型混用】在 G(n,m) 中直接套用独立边假设"],
        parameterConstraints: { modelDeclared: "须指明 G(n,p) 或 G(n,m)。", densityParameter: "子图阈值用 m(H) = max e(H')/v(H')。", twoSided: "须给出 0-statement 与 1-statement。", criticalWindow: "临界窗口须单独讨论。" },
        closureChecks: ["写出模型与参数标定。", "计算相关期望并定出候选阈值。", "用二阶矩或集中给出现侧。", "核对临界窗口与唯一性断言。"],
        scenarioChecks: { connectivityThreshold: ["计算孤立点期望", "取 p = (log n + c)/n", "得 Poisson 极限与连通概率"], giantComponent: ["比较 c 与 1", "解 1 - y = e^{-cy}", "给出巨大分支规模与唯一性"], subgraphThreshold: ["求最密子图密度 m(H)", "取 p = n^{-1/m(H)}", "两侧分别用一阶与二阶矩"] },
    },
    // Janson 不等式与下尾估计。
    "probcomb-janson-inequality": {
        definitions: ["Janson 不等式给出随机结构中“一个坏子结构都不出现”的概率的指数上界，属于下尾（lower tail）估计；它处理由同一独立随机变量族决定的单调增事件族，弥补二阶矩法在强相依时的失效"],
        formulas: ["设 A_i 为“第 i 个子结构全部出现”，mu = sum P(A_i)，Delta = sum_{i ~ j, i ≠ j} P(A_i ∩ A_j)（相交对求和）", "Janson：P(无任何 A_i 发生) <= exp(-mu + Delta/2)", "推论（Delta <= mu 时）：P(X = 0) <= exp(-mu^2 / (2(mu + Delta)))", "广义 Janson 下尾：对 0 < a < 1，P(X <= (1 - a) mu) <= exp(-a^2 mu^2 / (2(mu + Delta)))", "Suen 不等式：允许部分负相依，P(无 A_i) <= exp(-mu + sum_{i ~ j} P(A_i ∩ A_j) e^{2 delta_ij})", "对比：Harris/Kleitman 给同方向的下界 P(无 A_i) >= prod (1 - P(A_i))"],
        theorems: ["Janson 只给下尾：上尾（X 远大于 mu）不服从同样的指数律，稠密子结构的上尾常呈 exp(-Theta(mu^{1/k})) 之类的重尾，套用 Janson 处理上尾是典型错误", "适用前提是事件为同一独立随机变量族上的单调增事件（如“某条边集全在图中”）：一旦事件非单调或底层变量不独立，结论不成立", "Delta 只对相交（共享底层变量）的有序对求和且排除 i = j，重复计入自身或计入不相交对会破坏界的正确性", "当 Delta = o(mu) 时 Janson 给出与直觉一致的 exp(-mu(1+o(1)))，即“近似独立”区；当 Delta 远大于 mu 时应改用广义形式或 Harris 下界配合，硬用基本形式会给出无意义的正指数", "Janson 与二阶矩法的分工：二阶矩只给多项式衰减 P(X=0) <= Var/mu^2，Janson 给指数衰减，故在需要联合处理指数多个事件（如并集界后仍要求和）时必须用 Janson"],
        generalRequirements: ["必须写出 mu 与 Delta 的定义并说明相交关系", "只能用于单调增事件族的下尾估计", "结论须标明是下尾指数上界"],
        forbiddenErrors: ["【上尾误用】用 Janson 估计上尾概率", "【Delta 计错】把不相交对或 i = j 项计入 Delta", "【单调性缺失】对非单调事件族套用", "【强相依硬套】Delta 远超 mu 时仍用基本形式", "【方向反用】把上界当作下界使用"],
        parameterConstraints: { monotoneIncreasing: "事件须为单调增事件。", muDefinition: "mu = sum P(A_i)。", deltaDefinition: "Delta 只对相交且 i ≠ j 的有序对求和。", lowerTailOnly: "结论仅适用于下尾。" },
        closureChecks: ["列出坏子结构事件族并验证单调性。", "计算 mu 与 Delta。", "比较 Delta 与 mu 选择基本或广义形式。", "写出下尾指数上界。"],
        scenarioChecks: { noTriangleProbability: ["A_i 为某三角形出现", "计算 mu 与共享边对的 Delta", "得 P(无三角形) 的指数上界"], lowerTailDeviation: ["设定 a ∈ (0,1)", "套用广义 Janson", "得 P(X <= (1-a)mu) 的界"], ramseyTypeUnion: ["对每种坏结构分别用 Janson", "对指数多个事件求和", "验证总和仍小于 1"] },
    },
    // 熵方法与计数上界。
    "probcomb-entropy-method": {
        definitions: ["熵方法用 Shannon 熵的次可加性与条件熵单调性给出组合对象的计数上界：把随机均匀选取的对象编码为若干坐标，用各坐标熵之和控制总熵，从而控制对象个数的对数"],
        formulas: ["基本关系：X 均匀取值于有限集 S 时 H(X) = log|S|，一般地 H(X) <= log|支撑集|", "次可加性：H(X_1, ..., X_n) <= sum H(X_i)，等号成立当且仅当各分量独立", "链式法则：H(X, Y) = H(X) + H(Y | X)，且 H(Y | X) <= H(Y)", "Shearer 引理：若族 F 中每个下标被至少 t 个集合覆盖，则 t H(X_1,...,X_n) <= sum_{A ∈ F} H(X_A)", "投影计数（Bollobás-Thomason 盒定理的熵证明）：|S|^{d-1} <= prod_{i} |S_i|（S_i 为在去掉第 i 坐标的投影）", "应用：二部图完美匹配数上界、独立集计数、三角形与 Sidorenko 型不等式"],
        theorems: ["熵方法的力量来自 Shearer 引理：单用次可加性只能得到平凡的乘积界，覆盖重数 t 才把界改进到最优量级，缺少覆盖条件的“Shearer”应用是无效的", "等号条件是独立性：把次可加性当作等式使用即隐含独立假设，会低估熵从而给出错误的下界方向", "熵方法给的是上界方向：由 log|S| = H(X) <= 上界得 |S| 的上界；要得计数下界须改用构造或反向不等式（如 Sidorenko 型），方向不可颠倒", "均匀分布假设是关键：只有对均匀随机对象才有 H = log|S|，若采用非均匀分布只得 H <= log|S|，此时不能反推计数上界", "条件熵的处理顺序影响界的紧度：按合适顺序展开链式法则（如按顶点度数排序）常给出严格更好的界，这是独立集与匹配计数中的标准技巧"],
        generalRequirements: ["必须指明随机对象服从均匀分布", "使用 Shearer 须验证覆盖重数条件", "结论方向须为计数上界"],
        forbiddenErrors: ["【非均匀取对数】对非均匀分布断言 H = log|S|", "【覆盖条件缺失】无覆盖重数即用 Shearer", "【次可加性当等式】隐含独立性假设", "【方向反用】用熵上界推计数下界", "【条件熵误界】把 H(Y|X) 放大为大于 H(Y)"],
        parameterConstraints: { uniformDistribution: "须为均匀随机对象。", coveringMultiplicity: "Shearer 须给出覆盖重数 t。", subadditivityDirection: "次可加性为上界方向。", conditioningOrder: "须说明链式法则展开顺序。" },
        closureChecks: ["把计数对象写成随机变量并取均匀分布。", "选择坐标族与覆盖结构。", "用次可加性或 Shearer 界总熵。", "由 log|S| <= 界得计数上界。"],
        scenarioChecks: { projectionBound: ["设定坐标投影族", "验证每坐标覆盖重数", "得 |S|^{d-1} <= prod |S_i|"], matchingCount: ["对完美匹配取均匀分布", "按顶点顺序展开链式法则", "得匹配数上界"], independentSetCount: ["按邻域分组坐标", "套用 Shearer", "得独立集数的指数上界"] },
    },
    // 随机着色与超图可着色判据。
    "probcomb-random-coloring-hypergraph": {
        definitions: ["超图的性质 B 指存在顶点二着色使每条边都不单色；随机着色论证给出边数或边度的可着色判据，m(k) 记 k-均匀非二着色超图的最小边数"],
        formulas: ["基本随机着色：k-均匀超图有 m 条边，随机独立二着色后单色边期望为 m 2^{1-k}，故 m < 2^{k-1} ⇒ 可二着色，即 m(k) >= 2^{k-1}", "局部引理判据：每条边与至多 d 条边相交且 e (d + 1) 2^{1-k} <= 1 ⇒ 可二着色", "上界构造：m(k) = O(k^2 2^k)（Erdős 随机构造）", "Radhakrishnan-Srinivasan 下界：m(k) = Omega(2^k sqrt(k / log k))，用随机着色加“按随机顺序重着色”的修补论证", "一般 r 着色：单色边期望为 m r^{1-k}，故 m < r^{k-1} 保证存在无单色边的 r 着色", "属性 B 的判定是 NP 困难的，故判据只能给充分条件"],
        theorems: ["纯随机着色只给 2^{k-1} 量级，改进到 2^k sqrt(k/log k) 必须引入修补步骤（随机顺序下重着色危险点），这说明单纯期望论证在此问题上不是最优的", "判据是充分而非必要：m >= 2^{k-1} 不能推出不可二着色，实际最小非二着色超图边数与该下界相差 sqrt(k/log k) 量级因子", "边度条件与边数条件不可互换：局部引理版本只要求局部相交数 d 受控，允许边数任意大，故在稀疏相交的大规模超图上局部引理版本严格更强", "均匀性 k 是本质参数：非均匀超图须按最小边长 k_min 保守估计，用平均边长会得到错误判据", "r 着色的阈值随 r 增长为 r^{k-1}，但不能由二着色结论直接线性外推到 r 着色，须重新计算单色边期望"],
        generalRequirements: ["必须声明超图的均匀性与边数或相交度", "判据须明确为可着色的充分条件", "改进型界须说明所用修补策略"],
        forbiddenErrors: ["【必要性误称】由边数超界断言不可二着色", "【均匀性平均化】用平均边长代替最小边长", "【条件混用】把边数条件与边度条件互相替代", "【外推 r 着色】由二着色结论直接推 r 着色阈值", "【修补省略】声称纯随机着色达到 2^k sqrt(k/log k) 量级"],
        parameterConstraints: { uniformity: "k 取最小边长。", edgeCountCriterion: "m < 2^{k-1} 为可二着色充分条件。", localDegree: "局部引理版本须给相交数 d。", sufficientOnly: "判据仅为充分条件。" },
        closureChecks: ["确认超图均匀性与规模参数。", "计算单色边期望。", "比较边数或边度与阈值。", "需要更强界时加入重着色修补。"],
        scenarioChecks: { propertyBSufficient: ["统计边数 m", "计算 m 2^{1-k}", "由 < 1 得可二着色"], localLemmaVersion: ["统计每边相交边数 d", "验证 e(d+1)2^{1-k} <= 1", "得可二着色"], improvedLowerBound: ["随机着色后取随机顺序", "重着色单色边上的危险点", "得 2^k sqrt(k/log k) 量级界"] },
    },
    // 半随机方法（nibble）与近完美覆盖。
    "probcomb-semirandom-nibble": {
        definitions: ["半随机方法（Rödl nibble）分多轮进行，每轮只随机选取一小部分（一口）元素加入构造并删去被破坏的候选，通过跟踪剩余结构的近正则性迭代逼近近完美匹配或覆盖；它是解决 Erdős-Hanani 猜想与超图匹配问题的标准技巧"],
        formulas: ["每轮取比例：以概率 p = eps / D 独立选取候选边（D 为当前余度），使冲突量为选取量的低阶", "余度演化：一轮后剩余顶点比例约 e^{-eps}，余度近似乘以 e^{-(k-1)eps}，保持近正则性", "Frankl-Rödl 定理：k-均匀近正则超图（余度 o(D)）存在覆盖 (1 - o(1)) 比例顶点的匹配，即 nu >= (1 - o(1)) n / k", "Erdős-Hanani：覆盖数 C(n, k, l) = (1 + o(1)) C(n,l)/C(k,l)，由 nibble 给出", "Pippenger-Spencer：余度 o(D) 的近正则超图的色指数为 (1 + o(1)) D", "轮数取 O(log(1/delta)/eps)，最终剩余用贪心收尾"],
        theorems: ["每轮选取比例必须是 eps/D 量级的小量：一次性随机选取（p 为常数比例）会产生与选取量同阶的冲突，覆盖率无法趋近 1，这正是 nibble 分轮的必要性", "方法要求余度为 o(D)（近正则且成对余度小）：余度与度同阶时冲突不可忽略，结论失效，故使用前必须验证余度条件", "nibble 只给出近完美（1 - o(1) 比例）结论，不给出完美匹配：从近完美到完美需要额外的吸收法（absorption）或代数构造，二者不可混同", "每轮之后必须重新验证近正则性，这一步通过集中不等式（Azuma/Chernoff）完成；跳过集中性验证的论证是不完整的", "该方法本质上是存在性与算法性兼具的：随机贪心的多轮实现可在多项式时间给出同样量级的构造，但常数与 o(1) 项通常无法显式化"],
        generalRequirements: ["必须给出每轮选取概率与轮数安排", "必须验证余度条件与每轮后的近正则性", "结论须限定为近完美而非完美"],
        forbiddenErrors: ["【一次选取】用常数比例一次随机选取代替分轮", "【余度未验】不检验余度 o(D) 即套用结论", "【近完美当完美】由 nibble 直接断言完美匹配", "【集中性省略】不验证每轮后的近正则性", "【参数不给】不说明 eps 与轮数的取法"],
        parameterConstraints: { nibbleSize: "每轮选取概率取 eps/D 量级。", codegreeCondition: "须满足余度 o(D)。", roundCount: "轮数取 O(log(1/delta)/eps)。", nearPerfectOnly: "结论为覆盖 (1-o(1)) 比例。" },
        closureChecks: ["验证超图近正则与余度条件。", "设定每轮选取概率与轮数。", "用集中不等式验证每轮后参数演化。", "陈述近完美覆盖结论并说明收尾方式。"],
        scenarioChecks: { packingDesign: ["把设计问题写为超图匹配", "分轮随机取块", "得 (1+o(1)) 渐近覆盖数"], hypergraphMatching: ["验证余度 o(D)", "运行 nibble 迭代", "得 (1-o(1))n/k 匹配"], properEdgeColoring: ["套用 Pippenger-Spencer", "验证近正则性", "得 (1+o(1))D 色指数"] },
    },
};
