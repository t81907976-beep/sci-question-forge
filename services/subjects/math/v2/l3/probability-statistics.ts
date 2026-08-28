import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“概率论-数理统计”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const PROBABILITY_STATISTICS_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 充分统计量与 Fisher-Neyman 因子分解。
    "sufficient-statistic-factorization": {
        id: "sufficient-statistic-factorization", l2Key: "probability-statistics", name: "充分统计量与因子分解定理", kind: "criterion",
        aliases: ["充分统计量", "因子分解定理", "Fisher-Neyman定理", "极小充分统计量"],
    },
    // 指数族、完备性与 Lehmann-Scheffé。
    "exponential-family-completeness": {
        id: "exponential-family-completeness", l2Key: "probability-statistics", name: "指数族与完备性", kind: "theorem",
        aliases: ["指数族", "完备统计量", "Lehmann-Scheffé定理", "Rao-Blackwell定理", "UMVUE"],
    },
    // Cramér-Rao 下界与 Fisher 信息。
    "cramer-rao-lower-bound": {
        id: "cramer-rao-lower-bound", l2Key: "probability-statistics", name: "Cramér-Rao 下界", kind: "theorem",
        aliases: ["Cramér-Rao下界", "Fisher信息量", "信息不等式", "有效估计"],
    },
    // 最大似然估计的一致性与渐近正态性。
    "mle-asymptotic-normality": {
        id: "mle-asymptotic-normality", l2Key: "probability-statistics", name: "MLE 渐近正态性", kind: "theorem",
        aliases: ["最大似然估计", "MLE", "渐近正态性", "渐近有效", "正则条件"],
    },
    // Neyman-Pearson 引理与最优检验。
    "neyman-pearson-lemma": {
        id: "neyman-pearson-lemma", l2Key: "probability-statistics", name: "Neyman-Pearson 引理", kind: "lemma",
        aliases: ["Neyman-Pearson引理", "似然比检验", "最大功效检验", "UMP检验"],
    },
    // 似然比检验与 Wilks 定理。
    "likelihood-ratio-wilks": {
        id: "likelihood-ratio-wilks", l2Key: "probability-statistics", name: "广义似然比检验与 Wilks 定理", kind: "theorem",
        aliases: ["广义似然比检验", "Wilks定理", "Wald检验", "Score检验", "渐近卡方"],
    },
    // 置信区间与枢轴量、检验的对偶性。
    "pivotal-confidence-interval": {
        id: "pivotal-confidence-interval", l2Key: "probability-statistics", name: "枢轴量与置信区间", kind: "criterion",
        aliases: ["枢轴量", "置信区间", "置信集", "检验与区间对偶", "覆盖概率"],
    },
    // 线性模型：Gauss-Markov 与正态理论检验。
    "gauss-markov-linear-model": {
        id: "gauss-markov-linear-model", l2Key: "probability-statistics", name: "Gauss-Markov 定理与线性模型", kind: "theorem",
        aliases: ["Gauss-Markov定理", "BLUE", "最小二乘", "线性回归", "帽子矩阵"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const PROBABILITY_STATISTICS_L3_RULES: Record<string, MathV2L3Rules> = {
    // 充分统计量：因子分解判据与极小充分性。
    "sufficient-statistic-factorization": {
        definitions: ["统计量 T 对参数 θ 充分，指给定 T 后样本的条件分布不依赖 θ，即 T 保留了样本关于 θ 的全部信息。"],
        formulas: ["Fisher-Neyman 因子分解：T 充分 ⇔ f(x; θ) = g(T(x); θ) h(x)，h 与 θ 无关。", "极小充分判据：f(x; θ)/f(y; θ) 与 θ 无关 ⇔ T(x) = T(y)。", "指数族的自然充分统计量：f(x; θ) = h(x) exp(∑_j η_j(θ) T_j(x) - A(θ)) ⇒ (T_1, ..., T_k) 充分。", "例：正态未知 (μ, σ^2) ⇒ (∑X_i, ∑X_i^2) 充分；均匀 U(0, θ) ⇒ X_{(n)} 充分。"],
        theorems: ["Rao-Blackwell 定理：以充分统计量为条件取期望可使无偏估计的方差不增。", "极小充分统计量是任何充分统计量的函数，通常由似然比判据得到。", "辅助统计量（ancillary）与充分统计量的独立性由 Basu 定理在完备性下给出。"],
        generalRequirements: ["因子分解必须显式分离出与 θ 无关的因子 h(x)，包括支撑上的指示函数。", "支撑依赖参数时（如 U(0, θ)）必须把指示函数计入 g。"],
        forbiddenErrors: ["【指示函数错分】把依赖 θ 的指示函数放入 h(x)。", "【维数误判】声称一维统计量对多维参数充分而未验证分解。", "【充分与完备混淆】用充分性直接推 UMVUE 而跳过完备性。", "【极小性缺证】把任一充分统计量当作极小充分统计量。"],
        parameterConstraints: { sampleModel: "样本需为来自同一参数族的独立观测（或明确给出联合密度）。", supportDependence: "支撑依赖参数时指示函数必须归入 g(T; θ)。", dimensionality: "充分统计量维数一般不低于参数维数。" },
        closureChecks: ["写出联合密度并完成因子分解。", "核对 h(x) 完全不含 θ。", "若需极小性，用似然比常数判据验证。"],
        scenarioChecks: { dataReduction: ["由充分性论证只需保留 T 而不必保留全样本。"], umvueConstruction: ["充分 + 完备 → 由 Lehmann-Scheffé 得 UMVUE。"], parameterDependentSupport: ["均匀分布等支撑依赖参数的模型须单独处理指示函数。"] },
    },
    // 指数族与完备性：Lehmann-Scheffé 路线。
    "exponential-family-completeness": {
        definitions: ["统计量 T 完备，指对任意函数 g，E_θ[g(T)] = 0（∀θ）蕴含 g(T) = 0 几乎必然；指数族的自然统计量在参数空间含内点时完备。"],
        formulas: ["指数族标准型：f(x; θ) = h(x) exp(η(θ)^T T(x) - A(θ))，A 为对数配分函数。", "累积量恒等式：∂A/∂η_j = E[T_j]，∂^2 A/∂η_j∂η_k = Cov(T_j, T_k)。", "Lehmann-Scheffé：T 充分完备且 E[g(T)] = τ(θ) ⇒ g(T) 是 τ(θ) 的唯一 UMVUE。", "Rao-Blackwell：Var(E[δ | T]) ≤ Var(δ)，等号仅当 δ 已是 T 的函数。"],
        theorems: ["完备性对 UMVUE 的唯一性是关键：仅有充分性只能改进估计而不能断言最优。", "Basu 定理：有界完备充分统计量与任何辅助统计量独立（如正态中 X̄ 与 S^2 独立）。", "曲指数族（参数空间无内点，如 N(θ, θ^2)）可能不完备，UMVUE 结论失效。"],
        generalRequirements: ["使用 Lehmann-Scheffé 必须同时验证充分性与完备性。", "指数族判定必须写成标准型并确认自然参数空间含内点。"],
        forbiddenErrors: ["【完备性省略】只有充分性就断言 UMVUE。", "【曲指数族误用】对参数受约束的曲指数族套用完备性。", "【支撑含参当指数族】把 U(0, θ) 当作指数族（h 依赖 θ 不成立）。", "【无偏性缺失】对有偏的 g(T) 断言 UMVUE。"],
        parameterConstraints: { naturalParameterSpace: "完备性要求自然参数空间含内点（满秩指数族）。", supportIndependence: "指数族要求 h(x) 的支撑与 θ 无关。", unbiasedness: "Lehmann-Scheffé 结论针对无偏估计类。" },
        closureChecks: ["写出指数族标准型并识别 T 与 η(θ)。", "验证参数空间含内点以确认完备性。", "确认候选估计无偏后再断言 UMVUE。"],
        scenarioChecks: { normalMeanVariance: ["正态族中 (X̄, S^2) 充分完备，给出 μ、σ^2 的 UMVUE。"], improveEstimator: ["对任意无偏估计条件化到 T 得到方差更小的估计。"], nonCompleteCounterexamples: ["N(θ, θ^2)、U(θ, θ+1) 等曲族说明完备性可能失效。"] },
    },
    // Cramér-Rao 下界与 Fisher 信息。
    "cramer-rao-lower-bound": {
        definitions: ["Cramér-Rao 下界给出正则模型下无偏估计方差的信息论下界，Fisher 信息量度量似然对参数的敏感度。"],
        formulas: ["Fisher 信息：I(θ) = E[(∂ ln f/∂θ)^2] = -E[∂^2 ln f/∂θ^2]（正则条件下两式相等）。", "标量情形：δ 无偏 ⇒ Var(δ) ≥ 1/(n I(θ))。", "有偏/可微变换情形：Var(δ) ≥ (τ'(θ))^2/(n I(θ))，τ(θ) = E[δ]。", "多参数情形：Cov(δ) ⪰ I(θ)^{-1}（矩阵半序），I(θ) 为 Fisher 信息矩阵。", "等号条件：∂ ln f/∂θ = k(θ)(δ - θ)，即模型为指数族且 δ 为自然统计量的线性函数。"],
        theorems: ["Cramér-Rao 不等式在正则条件（支撑与 θ 无关、可微、积分与求导可换序）下成立。", "达到下界的估计称为有效估计，只在指数族中存在；不存在时 UMVUE 的方差可严格大于下界。", "信息量的可加性：n 个独立观测的信息为 n I(θ)，故下界以 1/n 阶衰减。"],
        generalRequirements: ["必须先验证正则条件，尤其是支撑不依赖 θ 与换序合法性。", "对有偏估计必须使用含 τ'(θ) 的一般形式。"],
        forbiddenErrors: ["【正则条件忽略】对 U(0, θ) 等支撑含参模型套用下界（其 UMVUE 方差可低于形式下界）。", "【有偏估计误用】对有偏估计直接用 1/(nI) 作下界。", "【下界必达】断言总存在达到下界的估计。", "【两种信息公式混用】在非正则模型中用 -E[∂^2 ln f] 代替定义式。"],
        parameterConstraints: { regularity: "支撑与 θ 无关、ln f 对 θ 二阶可微、积分与微分可换序。", positiveInformation: "要求 0 < I(θ) < ∞。", unbiasedOrDifferentiableBias: "标准形式针对无偏估计；有偏须用 τ'(θ) 修正。" },
        closureChecks: ["核对正则条件并计算 I(θ)。", "确认估计的偏差函数并选择对应形式的下界。", "若声称有效，验证等号条件（指数族结构）。"],
        scenarioChecks: { efficiencyComparison: ["用下界评估估计量的相对效率。"], sampleSizePlanning: ["由 1/(nI(θ)) 反推达到目标精度所需样本量。"], nonregularModels: ["支撑含参模型改用直接计算或 Bayes/极值方法。"] },
    },
    // MLE：一致性、渐近正态性与渐近有效性。
    "mle-asymptotic-normality": {
        definitions: ["最大似然估计 θ̂ 使似然函数取最大；在正则条件下它一致、渐近正态且渐近达到 Cramér-Rao 下界。"],
        formulas: ["似然方程：∂ ln L(θ)/∂θ |_{θ̂} = 0，L(θ) = ∏ f(X_i; θ)。", "渐近正态性：√n(θ̂ - θ_0) →_d N(0, I(θ_0)^{-1})。", "观测信息与期望信息：I_n(θ̂) = -∂^2 ln L/∂θ^2 |_{θ̂}，可用于估计渐近方差。", "变换的 MLE：g 可测 ⇒ g(θ) 的 MLE 为 g(θ̂)（不变性）。", "Delta 方法：√n(g(θ̂) - g(θ_0)) →_d N(0, g'(θ_0)^2 I(θ_0)^{-1})。"],
        theorems: ["一致性（Wald）：参数可识别、对数似然一致收敛于其期望时 θ̂ →_p θ_0。", "渐近正态性依赖正则条件：θ_0 在参数空间内点、三阶可微性或 Lipschitz 型控制、Fisher 信息正有限。", "MLE 一般有偏但偏差为 O(1/n)，故有限样本下无偏性不能默认（如 σ^2 的 MLE 偏小）。", "非正则情形（边界解、U(0,θ)、混合模型）渐近正态性失效，收敛率或极限分布改变。"],
        generalRequirements: ["必须验证解为全局最大而非驻点或边界点。", "使用渐近正态性必须声明正则条件与 θ_0 位于内点。"],
        forbiddenErrors: ["【驻点当最大】只解似然方程而不检验二阶条件或边界。", "【无偏性误设】断言 MLE 无偏（如正态方差 MLE 偏小）。", "【非正则套渐近】对支撑含参或边界参数使用 √n 渐近正态。", "【不变性方向错误】把 g(θ̂) 与 θ̂ 的期望变换混淆（E[g(θ̂)] ≠ g(E[θ̂])）。"],
        parameterConstraints: { identifiability: "参数必须可识别：θ ≠ θ' ⇒ 分布不同。", interiorPoint: "渐近正态性要求 θ_0 为参数空间内点。", finiteInformation: "0 < I(θ_0) < ∞ 且支撑与 θ 无关。" },
        closureChecks: ["写出对数似然、求驻点并检验最大性（含边界）。", "计算 I(θ) 或观测信息给出渐近方差。", "若模型非正则，显式说明渐近结论不适用。"],
        scenarioChecks: { boundarySolutions: ["U(0, θ) 的 MLE 为 X_{(n)}，由单调性而非导数得到。"], asymptoticConfidenceInterval: ["用 θ̂ ± z_{1-α/2}/√(n I(θ̂)) 构造区间（Wald 型）。"], reparametrization: ["用不变性直接给出变换参数的 MLE 并用 Delta 方法求渐近方差。"] },
    },
    // Neyman-Pearson 引理：简单假设的最优检验。
    "neyman-pearson-lemma": {
        definitions: ["Neyman-Pearson 引理指出：检验简单原假设对简单备择时，以似然比为统计量的检验在给定显著性水平下功效最大。"],
        formulas: ["似然比检验：拒绝 H_0 当 Λ(x) = f_1(x)/f_0(x) > k，k 由 P_{H_0}(Λ > k) = α 定出。", "随机化形式：φ(x) = 1（Λ > k）、γ（Λ = k）、0（Λ < k），使 E_{H_0}[φ] = α 恰好达到。", "功效：β(k) = P_{H_1}(Λ > k)，随 α 单调增。", "单调似然比（MLR）族：Λ 关于 T(x) 单调 ⇒ 单侧检验为一致最大功效（UMP）。"],
        theorems: ["Neyman-Pearson 引理：满足上述形式的检验在所有水平 ≤ α 的检验中功效最大，且最优检验几乎必然为该形式。", "Karlin-Rubin 定理：MLR 族中基于 T 的单侧检验对单侧复合假设为 UMP。", "双侧复合假设一般无 UMP 检验，需引入无偏性约束得到 UMPU 检验。"],
        generalRequirements: ["必须先固定显著性水平 α 并在 H_0 下定出临界值。", "离散分布若无法精确达到 α，必须说明随机化或采用保守水平。"],
        forbiddenErrors: ["【似然比方向颠倒】用 f_0/f_1 并保留同向拒绝域。", "【复合假设直接套用】对复合假设直接断言 NP 最优而不验证 MLR。", "【临界值在错误分布下算】用 H_1 分布定 k。", "【双侧 UMP 误设】断言双侧检验为 UMP。"],
        parameterConstraints: { simpleHypotheses: "基本形式要求 H_0、H_1 均为简单假设。", levelConstraint: "要求 E_{H_0}[φ] ≤ α；离散情形可能需随机化取等。", mlrForComposite: "推广到单侧复合假设需要单调似然比结构。" },
        closureChecks: ["写出似然比并化为关于充分统计量的单调形式。", "在 H_0 分布下解出临界值，核对水平。", "计算功效并说明最优性适用范围。"],
        scenarioChecks: { normalMeanTest: ["正态已知方差下 Λ 关于 X̄ 单调，得到单侧 z 检验的 UMP 性。"], discreteRandomization: ["二项/Poisson 检验中用随机化恰好达到水平 α。"], compositeAlternatives: ["无 UMP 时改用似然比检验或 UMPU 检验。"] },
    },
    // 广义似然比检验与 Wilks 定理。
    "likelihood-ratio-wilks": {
        definitions: ["广义似然比检验用受限与不受限最大似然之比构造统计量；Wilks 定理给出其在原假设下的渐近卡方分布，Wald 与 Score 检验为其渐近等价形式。"],
        formulas: ["似然比统计量：λ = sup_{θ ∈ Θ_0} L(θ)/sup_{θ ∈ Θ} L(θ)，检验量 -2 ln λ。", "Wilks 定理：正则条件下 -2 ln λ →_d χ^2(r)，r = dim Θ - dim Θ_0。", "Wald 检验：(θ̂ - θ_0)^T I_n(θ̂) (θ̂ - θ_0) →_d χ^2(r)。", "Score（Rao）检验：U(θ_0)^T I_n(θ_0)^{-1} U(θ_0) →_d χ^2(r)，U 为得分向量。", "三者渐近等价，有限样本下数值不同（Wald 依赖参数化，LR 不依赖）。"],
        theorems: ["Wilks 定理要求 θ_0 为内点、参数可识别、Fisher 信息正定，且 Θ_0 为光滑子流形。", "边界情形（如方差分量为零、混合模型成分数）极限分布为卡方混合而非纯 χ^2(r)。", "在正态线性模型中 LR 检验精确等价于 F 检验，不必用渐近近似。"],
        generalRequirements: ["必须正确计算自由度 r = 受限参数个数（约束个数）。", "使用渐近分布必须说明样本量与正则条件；边界假设须单独处理。"],
        forbiddenErrors: ["【自由度错算】用参数总数或样本量代替约束个数。", "【边界假设套纯卡方】对 H_0 落在参数空间边界的情形直接用 χ^2(r)。", "【比值方向颠倒】把 λ 写成不受限比受限导致 -2 ln λ 为负。", "【三检验混用】把 Wald 的参数化依赖性结论当作 LR 检验结论。"],
        parameterConstraints: { nestedModels: "要求 Θ_0 ⊂ Θ 为嵌套且光滑（约束可微且秩满）。", degreesOfFreedom: "r 等于独立约束个数。", interiorNull: "渐近卡方要求 θ_0 位于 Θ 的内点。" },
        closureChecks: ["写出受限与不受限的最大似然值。", "核对自由度等于约束个数。", "说明所用是渐近结论还是精确分布（正态线性模型可精确）。"],
        scenarioChecks: { nestedModelComparison: ["嵌套模型比较（如回归系数是否为零）用 -2 ln λ 对照 χ^2 临界值。"], boundaryTesting: ["检验方差分量为零时使用卡方混合分布。"], exactVsAsymptotic: ["正态线性模型下改用精确 F 检验避免渐近误差。"] },
    },
    // 枢轴量与置信区间：覆盖概率与检验对偶。
    "pivotal-confidence-interval": {
        definitions: ["枢轴量是分布不依赖未知参数的样本与参数的函数；由枢轴量的分位数反解得到置信区间，其覆盖概率是频率意义下的性质。"],
        formulas: ["枢轴量构造：P(a ≤ Q(X, θ) ≤ b) = 1 - α ⇒ 反解得置信区间。", "正态均值（σ 未知）：(X̄ - μ)/(S/√n) ~ t(n-1) ⇒ X̄ ± t_{1-α/2}(n-1) S/√n。", "正态方差：(n-1)S^2/σ^2 ~ χ^2(n-1) ⇒ 区间由 χ^2 两个分位数反解（非对称）。", "检验-区间对偶：{θ_0 : 水平 α 检验不拒绝 H_0: θ = θ_0} 即为 1-α 置信集。", "大样本 Wald 区间：θ̂ ± z_{1-α/2} · SE(θ̂)。"],
        theorems: ["覆盖概率的正确解释是重复抽样意义下区间包含真值的频率，不是参数落入区间的概率。", "由对偶性，区间构造与假设检验一一对应，故检验的最优性可转化为区间长度的最优性。", "离散分布（二项、Poisson）的精确区间（Clopper-Pearson）覆盖概率 ≥ 1-α 但保守，与 Wald 区间在小样本差异显著。"],
        generalRequirements: ["必须验证枢轴量的分布确实不含未知参数。", "必须声明是精确区间还是大样本近似区间，并给出对应前提。"],
        forbiddenErrors: ["【贝叶斯式解读】把 1-α 说成参数落在区间内的概率。", "【方差区间强行对称】把 χ^2 区间写成对称形式。", "【σ 已知未知混用】σ 未知仍用 z 分位数（小样本下必须用 t）。", "【近似区间当精确】对小样本二项比例直接用 Wald 区间而不说明覆盖不足。"],
        parameterConstraints: { pivotDistribution: "枢轴量分布必须完全已知且不含未知参数。", normalityOrLargeSample: "t/χ^2 区间要求正态总体；Wald 区间要求样本量足够大。", coverageLevel: "1 - α ∈ (0,1)，区间宽度随置信水平上升而增大。" },
        closureChecks: ["写出枢轴量及其精确分布。", "反解不等式并保持不等号方向正确。", "说明覆盖概率含义与所依赖的分布假设。"],
        scenarioChecks: { smallSampleNormal: ["小样本正态均值用 t 区间，方差用 χ^2 区间。"], proportionIntervals: ["二项比例用 Wilson 或 Clopper-Pearson 而非朴素 Wald。"], testInversion: ["复杂参数用检验反演（如似然比区间）构造置信集。"] },
    },
    // Gauss-Markov 与线性模型的正态理论。
    "gauss-markov-linear-model": {
        definitions: ["线性模型 Y = Xβ + ε 中，Gauss-Markov 定理断言在误差零均值、同方差、不相关条件下最小二乘估计是所有线性无偏估计中方差最小者（BLUE）。"],
        formulas: ["正规方程与解：X^T X β̂ = X^T Y ⇒ β̂ = (X^T X)^{-1} X^T Y（X 满列秩）。", "协方差：Cov(β̂) = σ^2 (X^T X)^{-1}；无偏方差估计 σ̂^2 = RSS/(n - p)。", "帽子矩阵：H = X(X^T X)^{-1} X^T，Ŷ = HY，残差 e = (I - H)Y，H 为正交投影。", "正态误差下：β̂ ~ N(β, σ^2 (X^T X)^{-1})，RSS/σ^2 ~ χ^2(n-p) 且与 β̂ 独立。", "F 检验：((RSS_0 - RSS)/r)/(RSS/(n-p)) ~ F(r, n-p)。"],
        theorems: ["Gauss-Markov 定理只需一阶二阶矩条件，不需正态性；正态性用于分布结论与 t/F 检验。", "正态误差下最小二乘等于最大似然，且 β̂ 为 UMVUE（超出线性估计类）。", "X 非满列秩时 β 不可识别，只有可估函数（estimable function）有唯一 BLUE，须用广义逆或伪逆表述。", "误差异方差或相关时改用广义最小二乘（Aitken 定理），普通最小二乘仍无偏但不再最优。"],
        generalRequirements: ["必须核对设计矩阵满列秩（否则说明可识别性问题）。", "断言检验分布必须额外假设正态性并说明自由度。"],
        forbiddenErrors: ["【正态性混入 Gauss-Markov】声称 BLUE 结论需要误差正态。", "【共线性忽略】X 不满列秩仍写 (X^T X)^{-1}。", "【自由度错误】用 n-1 代替 n-p 估计 σ^2。", "【异方差下断言最优】误差异方差仍称 OLS 为 BLUE。"],
        parameterConstraints: { fullRank: "X ∈ R^{n×p} 需满列秩且 n > p。", errorAssumptions: "E[ε] = 0，Cov(ε) = σ^2 I（同方差、不相关）。", normalityForInference: "t/F 检验与置信带额外要求 ε ~ N(0, σ^2 I)。" },
        closureChecks: ["检查设计矩阵秩与样本量条件。", "区分哪些结论只需矩条件、哪些需要正态性。", "核对方差估计与检验统计量的自由度。"],
        scenarioChecks: { modelDiagnostics: ["用残差与帽子矩阵对角元识别杠杆点与异方差。"], anovaDecomposition: ["平方和分解与 F 检验依赖投影矩阵的正交性（Cochran 定理）。"], generalizedLeastSquares: ["误差协方差非 σ^2 I 时用 GLS 恢复最优性。"] },
    },
};
