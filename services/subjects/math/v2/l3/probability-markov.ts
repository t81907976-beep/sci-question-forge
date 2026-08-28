import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“概率论-马尔可夫过程”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const PROBABILITY_MARKOV_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Markov 性与 Chapman-Kolmogorov 方程。
    "markov-property-chapman-kolmogorov": {
        id: "markov-property-chapman-kolmogorov", l2Key: "probability-markov", name: "Markov 性与 Chapman-Kolmogorov 方程", kind: "theorem",
        aliases: ["Markov性", "马尔可夫性", "Chapman-Kolmogorov方程", "转移矩阵", "n步转移"],
    },
    // 状态分类：常返、暂留、不可约与周期。
    "recurrence-transience-classification": {
        id: "recurrence-transience-classification", l2Key: "probability-markov", name: "常返性与状态分类", kind: "criterion",
        aliases: ["常返", "暂留", "正常返", "零常返", "不可约", "周期"],
    },
    // 平稳分布的存在唯一性。
    "stationary-distribution-existence": {
        id: "stationary-distribution-existence", l2Key: "probability-markov", name: "平稳分布的存在唯一性", kind: "theorem",
        aliases: ["平稳分布", "不变测度", "πP=π", "回返时间倒数"],
    },
    // 遍历定理与收敛到平稳分布。
    "ergodic-convergence-theorem": {
        id: "ergodic-convergence-theorem", l2Key: "probability-markov", name: "Markov 链遍历定理", kind: "theorem",
        aliases: ["遍历定理", "极限分布", "非周期", "时间平均", "总变差收敛"],
    },
    // 可逆性与细致平衡。
    "detailed-balance-reversibility": {
        id: "detailed-balance-reversibility", l2Key: "probability-markov", name: "细致平衡与可逆链", kind: "criterion",
        aliases: ["细致平衡", "可逆链", "reversible chain", "Kolmogorov判据", "Metropolis-Hastings"],
    },
    // 命中时间、吸收概率与调和方程。
    "hitting-time-absorption-equations": {
        id: "hitting-time-absorption-equations", l2Key: "probability-markov", name: "命中时间与吸收概率方程", kind: "formula",
        aliases: ["命中时间", "首达时间", "吸收概率", "调和函数", "基本矩阵"],
    },
    // 连续时间链：生成元与 Kolmogorov 方程。
    "continuous-time-generator": {
        id: "continuous-time-generator", l2Key: "probability-markov", name: "生成元与 Kolmogorov 微分方程", kind: "object",
        aliases: ["生成元", "Q矩阵", "转移速率", "Kolmogorov前向方程", "跳跃链"],
    },
    // 谱间隙与混合时间。
    "spectral-gap-mixing-time": {
        id: "spectral-gap-mixing-time", l2Key: "probability-markov", name: "谱间隙与混合时间", kind: "theorem",
        aliases: ["谱间隙", "混合时间", "总变差距离", "耦合方法", "cutoff现象"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const PROBABILITY_MARKOV_L3_RULES: Record<string, MathV2L3Rules> = {
    // Markov 性、强 Markov 性与 Chapman-Kolmogorov。
    "markov-property-chapman-kolmogorov": {
        definitions: ["Markov 性指给定当前状态后未来与过去条件独立；转移概率的多步复合由 Chapman-Kolmogorov 方程给出，等价于转移矩阵的乘幂。"],
        formulas: ["Markov 性：P(X_{n+1} = j | X_n = i, X_{n-1}, ..., X_0) = P(X_{n+1} = j | X_n = i) = p_{ij}。", "Chapman-Kolmogorov：p_{ij}^{(m+n)} = ∑_k p_{ik}^{(m)} p_{kj}^{(n)}，矩阵形式 P^{(m+n)} = P^m P^n。", "边缘分布演化：μ_n = μ_0 P^n（行向量约定）。", "函数期望：E[f(X_n) | X_0 = i] = (P^n f)(i)，f 为列向量。", "强 Markov 性：对停时 τ，给定 X_τ = i 后 (X_{τ+n}) 是从 i 出发的同一链且与 F_τ 条件独立。"],
        theorems: ["转移矩阵的乘幂完全决定有限维分布，故初始分布加转移核唯一确定链的分布（Kolmogorov 扩张）。", "强 Markov 性对离散时间链自动成立，是首达分解与更新论证的基础。", "首达分解：p_{ij}^{(n)} = ∑_{m=1}^n f_{ij}^{(m)} p_{jj}^{(n-m)}，把多步转移拆成首次到达与之后的回返。", "时齐性可通过把时间并入状态（X_n, n）来还原，故非时齐链可化为时齐链处理。"],
        generalRequirements: ["必须写清行/列向量约定与转移矩阵的乘法方向。", "使用条件独立必须只以当前状态为条件，不得混入历史信息。"],
        forbiddenErrors: ["【矩阵方向混用】把 μ_n = μ_0 P^n 写成 P^n μ_0 或行列约定前后不一致。", "【历史依赖】在转移概率中保留对过去状态的依赖仍称 Markov 链。", "【时齐性默认】对随时间变化的转移概率直接使用 P^n。", "【强 Markov 用于非停时】在依赖未来的随机时刻使用强 Markov 性。"],
        parameterConstraints: { stochasticMatrix: "p_{ij} ≥ 0 且 ∑_j p_{ij} = 1（行随机）。", timeHomogeneity: "P^n 公式要求时齐；否则用乘积 P_1 P_2 ... P_n。", stateSpace: "状态空间可数（有限或可数无穷），一般空间需转移核表述。" },
        closureChecks: ["核对转移矩阵每行和为 1。", "确认使用的乘法方向与向量约定一致。", "涉及随机时刻时验证其为停时。"],
        scenarioChecks: { multiStepProbabilities: ["用 P^n 或首达分解计算多步转移概率。"], hiddenHistoryModels: ["历史依赖模型通过扩充状态（如 (X_{n-1}, X_n)）恢复 Markov 性。"], functionalExpectations: ["用 P^n f 计算路径函数的期望。"] },
    },
    // 状态分类：常返/暂留、不可约、周期。
    "recurrence-transience-classification": {
        definitions: ["状态 i 常返指从 i 出发几乎必然回到 i；正常返进一步要求回返时间期望有限。不可约指任意两状态互通，周期是回返步数集合的最大公因数。"],
        formulas: ["常返判据：∑_{n≥1} p_{ii}^{(n)} = ∞ ⇔ i 常返；等价于 f_{ii} = P_i(T_i < ∞) = 1。", "正常返判据：E_i[T_i] < ∞（零常返为常返但 E_i[T_i] = ∞）。", "周期：d(i) = gcd{n ≥ 1 : p_{ii}^{(n)} > 0}；d = 1 称非周期。", "互通关系：i ↔ j ⇔ 存在 m, n 使 p_{ij}^{(m)} > 0 且 p_{ji}^{(n)} > 0，据此划分通信类。", "随机游走判据：一维、二维简单对称随机游走常返，三维及以上暂留（Pólya 定理）。"],
        theorems: ["常返性、正常返性与周期都是通信类的类性质，同一类中所有状态一致。", "有限状态链的所有常返状态必为正常返，且至少存在一个常返类（不存在零常返）。", "暂留状态被访问次数服从几何分布，故 ∑_n p_{ii}^{(n)} < ∞ 且 p_{ii}^{(n)} → 0。", "Foster-Lyapunov 判据用漂移条件判定可数无穷状态链的正常返性。"],
        generalRequirements: ["必须先划分通信类再判断类性质，闭类与非闭类需区分。", "无限状态空间必须区分正常返与零常返。"],
        forbiddenErrors: ["【有限无限混用】把有限链的「常返即正常返」推广到无限状态链。", "【类性质越界】对不同通信类中的状态套用同一分类结论。", "【周期性与常返性混淆】用周期性否定常返或用非周期性推正常返。", "【开类当常返】把非闭通信类中的状态判为常返。"],
        parameterConstraints: { communicationClass: "分类结论以通信类为单位；闭类才可能常返。", finiteStateSpace: "有限状态时常返 ⇔ 正常返。", periodDefinition: "周期由 gcd 定义，要求集合非空（否则该状态不可回返）。" },
        closureChecks: ["画出状态图并划分通信类，标注闭类与开类。", "对每个闭类判断正常返/零常返与周期。", "无限状态时给出 ∑ p_{ii}^{(n)} 或漂移条件的验证。"],
        scenarioChecks: { randomWalkDimension: ["用 Pólya 定理判断随机游走在不同维数下的常返性。"], birthDeathChains: ["生灭链用比值判据（∑ ∏ q/p）判定常返与正常返。"], absorbingChains: ["含吸收态的链把吸收态作为单点闭类，其余为暂留类。"] },
    },
    // 平稳分布：存在唯一性与回返时间。
    "stationary-distribution-existence": {
        definitions: ["平稳分布 π 是满足 π = πP 且 ∑ π_i = 1 的概率分布；不变测度放宽归一化要求，可为无穷测度。"],
        formulas: ["平稳方程：π_j = ∑_i π_i p_{ij}，∑_j π_j = 1，π_j ≥ 0。", "回返时间关系：不可约正常返链有 π_i = 1/E_i[T_i]。", "有限链求解：解 π(P - I) = 0 加归一化，或用 π ∝ 左特征向量（特征值 1）。", "生灭链显式解：π_n = π_0 ∏_{k=1}^n (λ_{k-1}/μ_k)（需可归一化）。", "遍历平均：不可约正常返链中长期处于状态 i 的时间比例几乎必然趋于 π_i。"],
        theorems: ["不可约链存在平稳分布 ⇔ 正常返，且此时平稳分布唯一且各分量严格正。", "零常返或暂留的不可约链存在不变测度但不可归一化，故无平稳分布（如简单对称随机游走的计数测度）。", "周期性不影响平稳分布的存在与唯一，只影响 P^n 的逐点收敛。", "可约链的平稳分布一般不唯一：每个正常返闭类给出一个，全体平稳分布是它们的凸组合。"],
        generalRequirements: ["必须先确认不可约性与正常返性再断言唯一性。", "求解后必须核对归一化与非负性。"],
        forbiddenErrors: ["【唯一性误设】对可约链断言平稳分布唯一。", "【存在性误设】对暂留或零常返链断言存在平稳分布。", "【周期性排除】因链有周期而断言无平稳分布。", "【归一化遗漏】给出左特征向量而未归一化即当作平稳分布。"],
        parameterConstraints: { irreducibility: "唯一性要求不可约。", positiveRecurrence: "存在性（可归一化）要求正常返。", normalization: "π_i ≥ 0 且 ∑ π_i = 1。" },
        closureChecks: ["验证不可约性与（无限状态时的）正常返性。", "解平稳方程并归一化。", "可用 π_i = 1/E_i[T_i] 或细致平衡交叉验证。"],
        scenarioChecks: { queueingStability: ["排队链的平稳分布存在性等价于稳定性条件（如 ρ < 1）。"], reducibleChains: ["多个吸收/常返类时按类分别求平稳分布并取凸组合。"], returnTimeComputation: ["由 π 直接读出平均回返时间 1/π_i。"] },
    },
    // 遍历定理：收敛到平稳分布与时间平均。
    "ergodic-convergence-theorem": {
        definitions: ["遍历定理断言不可约、非周期、正常返链的 n 步转移概率收敛到平稳分布，且路径的时间平均收敛到关于平稳分布的空间平均。"],
        formulas: ["分布收敛：p_{ij}^{(n)} → π_j（∀i, j），等价于 ‖μ_0 P^n - π‖_{TV} → 0。", "时间平均（遍历定理）：(1/n)∑_{k=1}^n f(X_k) → ∑_i π_i f(i) 几乎必然（f 关于 π 可积）。", "周期 d > 1 时：p_{ii}^{(nd)} → d/E_i[T_i]，逐点极限不存在但 Cesàro 平均仍为 π_i。", "有限非周期链的几何收敛：‖μ_0 P^n - π‖_{TV} ≤ C ρ^n，ρ = 第二大特征值模长。", "Markov 链中心极限定理：√n((1/n)∑ f(X_k) - E_π[f]) →_d N(0, σ_f^2)，σ_f^2 含自协方差之和。"],
        theorems: ["三条件（不可约、非周期、正常返）缺一不可：周期链无逐点极限，零常返/暂留链 p_{ij}^{(n)} → 0。", "时间平均的遍历定理只需不可约正常返，不要求非周期，故比分布收敛条件更弱。", "收敛速度对有限链是几何的，但常数与谱间隙相关；可数无穷状态链可能是次几何或多项式速度。", "MCMC 的合理性正是遍历定理：用长程路径平均估计目标分布的期望。"],
        generalRequirements: ["必须逐条核对不可约、非周期、正常返三个条件。", "必须区分「分布收敛」与「时间平均收敛」两类结论及其条件差异。"],
        forbiddenErrors: ["【周期链断言逐点收敛】对 d > 1 的链声称 p_{ij}^{(n)} → π_j。", "【条件缺失】不验证非周期性就断言极限分布存在。", "【两类结论混用】用时间平均的遍历性推出分布逐点收敛。", "【初始分布依赖】声称极限依赖初始分布（不可约非周期时不依赖）。"],
        parameterConstraints: { aperiodicity: "分布收敛要求周期 d = 1。", irreducibilityRecurrence: "要求不可约且正常返。", integrability: "时间平均结论要求 ∑_i π_i |f(i)| < ∞。" },
        closureChecks: ["确认三条件成立并指出各自作用。", "明确所述收敛是分布收敛还是时间平均。", "若需速度，给出谱间隙或耦合估计。"],
        scenarioChecks: { mcmcValidity: ["MCMC 采样的一致性与遍历定理、平稳分布唯一性配套。"], periodicCounterexample: ["两状态确定性交替链说明周期性破坏逐点收敛。"], longRunCostAverage: ["长期平均成本用 ∑ π_i c(i) 计算。"] },
    },
    // 细致平衡与可逆性。
    "detailed-balance-reversibility": {
        definitions: ["细致平衡 π_i p_{ij} = π_j p_{ji} 表示每一对状态间的概率流平衡；满足细致平衡的链称可逆链，其时间反转与原链同分布。"],
        formulas: ["细致平衡条件：π_i p_{ij} = π_j p_{ji}（∀i, j）。", "可逆性推平稳性：对 j 求和得 ∑_i π_i p_{ij} = π_j，故细致平衡是平稳的充分条件。", "Kolmogorov 判据：链可逆 ⇔ 任意闭环上正向与反向概率乘积相等，p_{i_1i_2}...p_{i_ki_1} = p_{i_1i_k}...p_{i_2i_1}。", "Metropolis-Hastings 接受概率：α(i,j) = min(1, π_j q_{ji}/(π_i q_{ij})) 使链对 π 可逆。", "可逆链的谱：P 在 L^2(π) 中自伴，特征值实且落在 [-1, 1]，可用变分刻画谱间隙。"],
        theorems: ["细致平衡是平稳的充分但非必要条件：存在平稳但不可逆的链（如带方向的循环游走）。", "无向图上的随机游走可逆，π_i ∝ deg(i)；带权图上 π_i ∝ ∑_j w_{ij}。", "可逆性使 P 自伴，从而可用谱定理、Dirichlet 形式与 Cheeger 不等式分析收敛速度。", "非可逆链可能混合更快，故可逆性是分析便利而非最优性保证。"],
        generalRequirements: ["用细致平衡求 π 后必须归一化并验证可归一化性。", "断言不可逆必须给出违反 Kolmogorov 环判据的具体环路。"],
        forbiddenErrors: ["【必要性误设】由平稳分布存在断言细致平衡成立。", "【方向遗漏】只验证部分状态对的细致平衡即断言可逆。", "【归一化缺失】把满足细致平衡的非归一化测度当作平稳分布。", "【谱结论越界】对非可逆链使用实特征值与自伴性结论。"],
        parameterConstraints: { positiveMeasure: "π_i > 0 于所讨论状态上。", symmetryCondition: "细致平衡须对所有状态对成立。", normalizability: "∑ π_i < ∞ 才能得到平稳分布。" },
        closureChecks: ["逐对验证细致平衡或用 Kolmogorov 环判据。", "归一化并核对 π = πP。", "若用于 MCMC，验证接受概率使目标分布可逆。"],
        scenarioChecks: { randomWalkOnGraph: ["图上随机游走由度数直接读出平稳分布。"], mcmcDesign: ["设计 Metropolis-Hastings 或 Gibbs 采样使目标分布可逆。"], nonreversibleExamples: ["单向循环链平稳但不可逆，用环判据证明。"] },
    },
    // 命中时间与吸收概率：线性方程组与基本矩阵。
    "hitting-time-absorption-equations": {
        definitions: ["命中时间与吸收概率满足以转移矩阵为系数的线性方程组（离散调和方程），吸收链可用基本矩阵一次性给出全部期望量。"],
        formulas: ["吸收概率：h_i = P_i(击中 A) 满足 h_i = 1（i ∈ A），h_i = ∑_j p_{ij} h_j（i ∉ A）。", "期望命中时间：k_i = E_i[T_A] 满足 k_i = 0（i ∈ A），k_i = 1 + ∑_{j ∉ A} p_{ij} k_j。", "基本矩阵：暂留部分 Q 的 N = (I - Q)^{-1}，N_{ij} 为从 i 出发访问 j 的期望次数，期望吸收时间为 N1。", "吸收概率矩阵：B = N R，R 为暂留态到吸收态的转移块。", "回返时间与平稳分布：E_i[T_i^+] = 1/π_i（不可约正常返）。"],
        theorems: ["方程组的解在有限状态时唯一（在适当边界条件下）；无限状态时需附加最小非负解的选取（h 取最小非负解）。", "h 是关于链的调和函数：Ph = h 于 A 之外，加边界值给出 Dirichlet 问题的离散版本，唯一性由极大值原理保证。", "期望命中时间有限 ⇔ 相应吸收几乎必然发生且期望可积；暂留结构下可能 h < 1 或 k = ∞。", "赌徒破产、生灭链等经典结果均为该方程组在特定结构下的显式解（用差分方程求解）。"],
        generalRequirements: ["必须写出完整边界条件并说明在 A 上的取值。", "无限状态时必须说明取最小非负解（否则解不唯一）。"],
        forbiddenErrors: ["【边界条件缺失】只写内部递推而不设定 A 上的值。", "【最小解未取】无限状态下取到非最小解导致吸收概率大于真值。", "【常数项遗漏】期望命中时间方程漏掉 +1。", "【吸收态纳入求和】在 k_i 的递推中对吸收态求和。"],
        parameterConstraints: { targetSet: "目标集 A 非空且明确给定。", finiteness: "基本矩阵要求 I - Q 可逆（暂留块）。", minimalSolution: "无限状态时吸收概率取最小非负解，期望时间取最小非负解。" },
        closureChecks: ["写出内部方程与边界条件并核对方程个数。", "有限吸收链用基本矩阵交叉验证。", "检查解的取值范围（概率在 [0,1]、时间非负）。"],
        scenarioChecks: { gamblersRuinFormula: ["生灭链差分方程给出破产概率与期望时长的显式解。"], absorbingChainAnalysis: ["用 N = (I - Q)^{-1} 一次求出访问次数、吸收时间与吸收概率。"], infiniteStateCaution: ["无限状态时先判断是否几乎必然吸收，再取最小非负解。"] },
    },
    // 连续时间链：生成元与前向/后向方程。
    "continuous-time-generator": {
        definitions: ["连续时间 Markov 链由生成元（Q 矩阵）刻画：q_{ij}（i ≠ j）为跳跃速率，q_{ii} = -∑_{j≠i} q_{ij}；转移半群 P(t) = e^{tQ} 满足 Kolmogorov 微分方程。"],
        formulas: ["Q 矩阵条件：q_{ij} ≥ 0（i ≠ j），行和为 0。", "前向方程：dP(t)/dt = P(t) Q；后向方程：dP(t)/dt = Q P(t)；解为 P(t) = e^{tQ}。", "跳跃构造：在状态 i 停留时间 ~ Exp(λ_i)（λ_i = -q_{ii}），随后以概率 q_{ij}/λ_i 跳到 j。", "平稳分布：πQ = 0 且 ∑π_i = 1（不是 πP = π）。", "嵌入跳跃链：P̃_{ij} = q_{ij}/λ_i，其平稳分布与原链的 π 相差因子 λ_i。"],
        theorems: ["有限状态下 P(t) = e^{tQ} 恒为随机矩阵，且解唯一；无限状态时可能爆破（非正则），需 ∑ 1/λ_{X_n} = ∞ 保证不爆破。", "连续时间链无周期性问题：不可约正常返即蕴含 P(t) → π（t → ∞）。", "细致平衡的连续时间版本为 π_i q_{ij} = π_j q_{ji}。", "嵌入链的平稳分布 π̃_i ∝ π_i λ_i，故不能直接把跳跃链的平稳分布当作原链的。"],
        generalRequirements: ["必须核对 Q 的行和为零与非对角非负性。", "平稳分布必须解 πQ = 0，不得套用离散链的 πP = π。"],
        forbiddenErrors: ["【Q 与 P 混用】把 Q 当转移矩阵（行和为 1）使用。", "【平稳方程错误】用 πQ = π 或 πP̃ = π 求原链平稳分布。", "【嵌入链平稳分布混淆】忽略 λ_i 权重直接搬用跳跃链结果。", "【周期性讨论多余】对连续时间链讨论周期并据此否定收敛。"],
        parameterConstraints: { generatorStructure: "q_{ij} ≥ 0（i ≠ j），∑_j q_{ij} = 0。", holdingRates: "λ_i = -q_{ii} > 0（吸收态 λ_i = 0）。", nonexplosion: "无限状态需不爆破条件才有唯一全时间解。" },
        closureChecks: ["写出 Q 并核对行和为零。", "求平稳分布时解 πQ = 0 并归一化。", "涉及无限状态时检查不爆破条件。"],
        scenarioChecks: { birthDeathProcesses: ["生灭过程用 πQ = 0 递推得比值形式的平稳分布。"], queueingSystems: ["M/M/c 队列的稳态分布与稳定性条件由 Q 矩阵给出。"], matrixExponential: ["小规模链用 e^{tQ} 的谱分解求瞬态分布。"] },
    },
    // 谱间隙与混合时间。
    "spectral-gap-mixing-time": {
        definitions: ["混合时间是分布与平稳分布的总变差距离降到给定阈值所需的步数；谱间隙与耦合方法给出其上下界。"],
        formulas: ["总变差距离：‖μ - ν‖_{TV} = (1/2)∑_i |μ_i - ν_i| = sup_A |μ(A) - ν(A)|。", "混合时间：t_mix(ε) = min{n : max_i ‖δ_i P^n - π‖_{TV} ≤ ε}，常取 ε = 1/4。", "谱间隙上界（可逆链）：t_mix(ε) ≤ (1/γ) log(1/(ε π_min))，γ = 1 - λ_2。", "谱间隙下界：t_mix(ε) ≥ (1 - 2ε) λ_2/(2γ) 型，故 1/γ 给出正确量级。", "耦合上界：存在两条链的耦合使 P(τ_couple > n) ≤ ε ⇒ t_mix(ε) ≤ n。", "Cheeger 不等式：Φ^2/2 ≤ γ ≤ 2Φ，Φ 为电导（conductance）。"],
        theorems: ["可逆链的谱间隙控制 L^2 收敛速度，是混合时间的主导量级（相差 log(1/π_min) 因子）。", "耦合方法给出无需谱信息的上界，强稳定时间（strong stationary time）给出分离距离的上界。", "cutoff 现象：许多链的总变差距离在 t_mix 附近由 1 骤降至 0，此时 t_mix 与 1/γ 的比值趋于无穷。", "电导小（存在瓶颈）必然导致混合慢，是下界论证（bottleneck ratio）的标准手段。"],
        generalRequirements: ["使用谱界必须先确认可逆性（否则 λ_2 可为复数）。", "必须固定阈值 ε 并说明界的方向（上界/下界）。"],
        forbiddenErrors: ["【非可逆用谱界】对不可逆链直接使用 1 - λ_2 型界。", "【总变差定义漏 1/2】把 TV 距离写成 ∑|μ_i - ν_i| 而不除以 2。", "【耦合方向误用】用耦合时间给出下界。", "【cutoff 默认】未验证就断言存在 cutoff 或把 t_mix 与 1/γ 等同。"],
        parameterConstraints: { reversibility: "谱界要求链关于 π 可逆。", epsilonThreshold: "t_mix 依赖阈值 ε，需显式给出。", minimumProbability: "上界中出现 π_min = min_i π_i，状态数大时该因子不可忽略。" },
        closureChecks: ["确认可逆性并给出 λ_2 或电导估计。", "明确所得为上界还是下界及其阈值。", "若用耦合，写出耦合构造与耦合时间的尾估计。"],
        scenarioChecks: { cardShuffling: ["洗牌链用强稳定时间或耦合估计混合时间并讨论 cutoff。"], mcmcEfficiency: ["MCMC 收敛诊断以谱间隙/电导为理论依据。"], bottleneckLowerBound: ["存在低电导割集时用瓶颈比给出混合时间下界。"] },
    },
};
