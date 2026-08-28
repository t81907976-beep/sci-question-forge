import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“信息论与编码”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const INFORMATION_CODING_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Shannon 熵、条件熵与链式法则。
    "info-shannon-entropy-properties": {
        id: "info-shannon-entropy-properties", l2Key: "information-coding", name: "Shannon 熵与条件熵链式法则", kind: "formula",
        aliases: ["Shannon熵", "条件熵", "熵的链式法则", "联合熵上界"],
    },
    // 相对熵的非负性与信息不等式。
    "info-kl-divergence-inequality": {
        id: "info-kl-divergence-inequality", l2Key: "information-coding", name: "相对熵与 Gibbs 不等式", kind: "theorem",
        aliases: ["相对熵", "KL散度", "Gibbs不等式", "对数和不等式"],
    },
    // 互信息与数据处理不等式。
    "info-mutual-information-dpi": {
        id: "info-mutual-information-dpi", l2Key: "information-coding", name: "互信息与数据处理不等式", kind: "theorem",
        aliases: ["互信息", "数据处理不等式", "信息不增原理", "充分统计量等号"],
    },
    // 渐近均分性与典型集的大小估计。
    "info-aep-typical-set": {
        id: "info-aep-typical-set", l2Key: "information-coding", name: "渐近均分性与典型集", kind: "theorem",
        aliases: ["渐近均分性", "AEP典型集", "典型集大小估计", "高概率集下界"],
    },
    // 无失真信源编码定理与 Kraft 不等式。
    "info-source-coding-theorem": {
        id: "info-source-coding-theorem", l2Key: "information-coding", name: "无失真信源编码定理", kind: "theorem",
        aliases: ["信源编码定理", "Kraft不等式", "前缀码平均码长", "唯一可译性"],
    },
    // Huffman 编码的最优前缀码性质。
    "info-huffman-optimality": {
        id: "info-huffman-optimality", l2Key: "information-coding", name: "Huffman 编码的最优性", kind: "algorithm",
        aliases: ["Huffman编码", "最优前缀码", "兄弟合并性质", "码长交换论证"],
    },
    // 信道容量与有噪信道编码定理。
    "info-channel-capacity": {
        id: "info-channel-capacity", l2Key: "information-coding", name: "信道容量与有噪信道编码定理", kind: "theorem",
        aliases: ["信道容量", "有噪信道编码定理", "可达速率", "二元对称信道容量"],
    },
    // Fano 不等式与编码逆定理。
    "info-fano-converse": {
        id: "info-fano-converse", l2Key: "information-coding", name: "Fano 不等式与逆定理", kind: "lemma",
        aliases: ["Fano不等式", "编码逆定理", "错误概率下界", "速率超容量必错"],
    },
    // 率失真函数与有失真压缩极限。
    "info-rate-distortion": {
        id: "info-rate-distortion", l2Key: "information-coding", name: "率失真函数", kind: "theorem",
        aliases: ["率失真函数", "有失真压缩极限", "Gaussian率失真", "失真约束下互信息极小"],
    },
    // 微分熵与最大熵分布。
    "info-differential-entropy-maxent": {
        id: "info-differential-entropy-maxent", l2Key: "information-coding", name: "微分熵与最大熵分布", kind: "theorem",
        aliases: ["微分熵", "最大熵分布", "Gaussian最大熵", "熵功率不等式"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const INFORMATION_CODING_L3_RULES: Record<string, MathV2L3Rules> = {
    // Shannon 熵、条件熵与链式法则。
    "info-shannon-entropy-properties": {
        definitions: ["Shannon 熵是离散随机变量不确定性的唯一满足连续性、单调性与可分解性（Khinchin 公理）的度量，条件熵为在条件分布下熵的加权平均，联合熵由链式法则分解为条件熵之和"],
        formulas: ["熵：H(X) = -sum_x p(x) log p(x)，约定 0 log 0 = 0", "联合熵：H(X, Y) = -sum_{x,y} p(x,y) log p(x,y)", "条件熵：H(Y | X) = sum_x p(x) H(Y | X = x) = -sum_{x,y} p(x,y) log p(y | x)", "链式法则：H(X_1, ..., X_n) = sum_{i=1}^n H(X_i | X_1, ..., X_{i-1})", "上下界：0 <= H(X) <= log |支撑集|，右端等号当且仅当均匀分布，左端等号当且仅当退化分布", "次可加性：H(X, Y) <= H(X) + H(Y)，等号当且仅当独立", "熵与互信息：H(X) - H(X | Y) = I(X; Y) >= 0", "Fano 型分解：H(X, Y) = H(X) + H(Y | X)"],
        theorems: ["条件化平均降低熵而逐点不降低：H(Y | X) <= H(Y) 恒成立，但存在具体 x 使 H(Y | X = x) > H(Y)，故不能对单个条件取值断言熵减少", "熵只依赖概率值而不依赖取值：对任意双射 g 有 H(g(X)) = H(X)；一般函数只有 H(g(X)) <= H(X)，这是熵作为不确定性度量与方差等依赖数值的量的本质区别", "离散熵非负且以 log|X| 为上界，但微分熵可取负值，故不能把非负性从离散情形直接搬到连续情形", "熵在分布上是凹函数（H(lambda p + (1 - lambda) q) >= lambda H(p) + (1 - lambda) H(q)），而相对熵关于分布对是凸的，二者凸性方向必须区分", "由 Khinchin 公理（或 Shannon 公理组）唯一确定熵的形式至一正常数倍，故对数底只改变单位（bit 与 nat）而不改变结论结构", "独立性检验的等号条件必须是全局独立：H(X, Y) = H(X) + H(Y) 与 X、Y 独立等价，成对不相关不足以给出该等式"],
        generalRequirements: ["必须明确对数底并统一单位（bit 取 2，nat 取 e）", "必须处理零概率项的约定 0 log 0 = 0", "断言等号必须给出对应的分布条件（均匀 / 退化 / 独立）"],
        forbiddenErrors: ["【逐点条件熵递减】由 H(Y | X) <= H(Y) 断言对每个 x 都有 H(Y | X = x) <= H(Y)", "【函数变换保熵】对非单射函数断言 H(g(X)) = H(X)", "【底数混用】同一推导中混用 log_2 与 ln 而不换算", "【上界误写】把 H(X) <= log n 中的 n 写成样本量而非取值个数", "【连续情形非负】把离散熵非负性用于微分熵", "【凸性方向错】称熵关于分布是凸函数"],
        parameterConstraints: { logBase: "对数底需固定，2 对应 bit，e 对应 nat", zeroConvention: "0 log 0 = 0", finiteSupport: "上界 log |X| 要求取值集合有限", probabilityNormalization: "p 需为概率分布（非负且和为 1）", conditionalWellDefined: "条件熵只在 p(x) > 0 的条件取值上求和" },
        closureChecks: ["核对熵值是否落在 [0, log |X|] 内", "用链式法则交叉验证联合熵的两种分解", "给出等号情形对应的分布并说明其唯一性"],
        scenarioChecks: { uniformExtremal: ["证明均匀分布唯一达到熵的上界并说明使用了何种凸性论证"], chainRuleExpansion: ["按两种变量顺序展开联合熵并核对结果一致"], functionTransform: ["区分单射与非单射变换给出等式或严格不等式"] },
    },
    // 相对熵的非负性与信息不等式。
    "info-kl-divergence-inequality": {
        definitions: ["相对熵（KL 散度）度量用分布 q 编码来自 p 的数据所付出的额外码长期望，它非负、不对称且不满足三角不等式，因此不是度量；信息不等式是其非负性的标准称法"],
        formulas: ["定义：D(p || q) = sum_x p(x) log (p(x) / q(x))，约定 0 log(0/q) = 0，p log(p/0) = +inf", "信息不等式：D(p || q) >= 0，等号当且仅当 p = q 处处成立", "熵与相对熵：H(p) = log |X| - D(p || uniform)", "互信息表示：I(X; Y) = D(p(x,y) || p(x) p(y))", "条件相对熵与链式法则：D(p(x,y) || q(x,y)) = D(p(x) || q(x)) + D(p(y|x) || q(y|x))", "对数和不等式：sum_i a_i log(a_i / b_i) >= (sum a_i) log((sum a_i) / (sum b_i))", "Pinsker 不等式：||p - q||_1 <= sqrt(2 D(p || q))（nat 单位）", "凸性：D(p || q) 关于 (p, q) 联合凸"],
        theorems: ["相对熵不是距离：D(p || q) 与 D(q || p) 一般不等且三角不等式不成立，故不能用它作对称度量或直接套用度量空间结论（需要对称化时用 Jensen-Shannon 散度）", "支撑集条件不可省：若存在 x 使 p(x) > 0 而 q(x) = 0 则 D(p || q) = +inf，这使正向与反向 KL 在近似推断中给出完全不同的行为（零避免与零强制）", "信息不等式的等号刻画是处处相等而非几乎处处近似，它由严格凸函数 -log 的 Jensen 不等式等号条件给出", "对数和不等式是相对熵凸性与数据处理不等式的共同来源，许多信息不等式可直接由它归约得到", "Pinsker 不等式给出 KL 控制全变差的单向界，反向不成立：全变差小不能推出 KL 小（q 的零点会使 KL 无界）", "数据处理版本：任何随机映射（信道）都不增加相对熵，D(p W || q W) <= D(p || q)，故后处理不能提高分布可区分性"],
        generalRequirements: ["必须检查支撑集包含关系并显式处理无穷值情形", "使用非负性时必须写出等号条件", "把 KL 用作差异度量时必须说明其不对称性带来的限制"],
        forbiddenErrors: ["【当作距离】对相对熵使用对称性或三角不等式", "【支撑集忽略】在 q 有零点而 p 无零点处仍给出有限值", "【等号条件缺失】只写 D >= 0 而不给出 p = q 的刻画", "【Pinsker 反用】由全变差小断言 KL 小", "【正反向混用】把 D(p || q) 的结论直接用于 D(q || p)", "【凸性对象错】称 D 关于 p 凹或只对单个变量讨论凸性"],
        parameterConstraints: { supportInclusion: "有限值要求 supp(p) 包含于 supp(q)", conventions: "0 log(0/q) = 0；p > 0 而 q = 0 时取 +inf", logBase: "Pinsker 不等式的常数依赖对数底（nat 下为 sqrt(2D)）", jointConvexity: "凸性针对分布对 (p, q) 联合成立", normalization: "p、q 均需为概率分布" },
        closureChecks: ["验证支撑集条件并给出可能的无穷值判断", "由 Jensen 不等式给出非负性证明及等号条件", "若需对称度量则改用对称化版本并说明理由"],
        scenarioChecks: { nonnegativityProof: ["用 -log 的严格凸性与 Jensen 不等式完成证明并写出等号条件"], asymmetryDemo: ["构造两分布使正反向 KL 相差悬殊或一侧为无穷"], mutualInformationLink: ["把互信息写成联合分布与乘积分布的相对熵并由此得到非负性"] },
    },
    // 互信息与数据处理不等式。
    "info-mutual-information-dpi": {
        definitions: ["互信息是两个随机变量共享的信息量，等于联合分布与边缘乘积分布的相对熵；数据处理不等式指沿马尔可夫链的后续处理不能增加关于源的信息"],
        formulas: ["互信息：I(X; Y) = H(X) - H(X | Y) = H(Y) - H(Y | X) = H(X) + H(Y) - H(X, Y)", "相对熵形式：I(X; Y) = D(p(x, y) || p(x) p(y)) >= 0", "条件互信息：I(X; Y | Z) = H(X | Z) - H(X | Y, Z)", "链式法则：I(X_1, ..., X_n; Y) = sum_i I(X_i; Y | X_1, ..., X_{i-1})", "数据处理不等式：X -> Y -> Z 构成马尔可夫链时 I(X; Y) >= I(X; Z)", "推论：I(X; Y) >= I(X; g(Y)) 对任意函数 g", "自信息：I(X; X) = H(X)", "凸凹性：I(X; Y) 关于 p(x) 凹，关于 p(y | x) 凸"],
        theorems: ["条件化可以增加互信息：一般 I(X; Y | Z) 与 I(X; Y) 无固定大小关系（如 X、Y 独立而 Z = X xor Y 时 I(X; Y) = 0 但 I(X; Y | Z) > 0），故不存在无条件的互信息单调性", "数据处理不等式要求马尔可夫性 p(z | x, y) = p(z | y)：若 Z 直接依赖 X 则结论失效，套用前必须验证链结构", "等号刻画为充分统计量：I(X; Y) = I(X; g(Y)) 当且仅当 g(Y) 是 X 关于 Y 的充分统计量，这是统计推断中充分性概念的信息论刻画", "互信息对边缘分布的凹性是信道容量作为凹函数极大化问题（存在唯一最大值且可用 Blahut-Arimoto 或 KKT 求解）的依据", "互信息不满足三变量的直接可加性：三重信息 I(X; Y; Z) 可为负，故不能把两变量直觉推广到多变量交互信息", "I(X; Y) = 0 与独立性等价，这比不相关严格更强，故零互信息可用于严格独立性判定"],
        generalRequirements: ["使用数据处理不等式必须先验证马尔可夫链结构", "多变量情形必须显式写出条件互信息而非笼统的信息量", "断言等号必须给出充分统计量或独立性论证"],
        forbiddenErrors: ["【马尔可夫性未验】对非马尔可夫三元组套用数据处理不等式", "【条件化单调】断言条件互信息必不大于无条件互信息", "【三重信息非负】认为多变量交互信息必非负", "【不相关当独立】由零协方差断言互信息为零", "【凸凹性混淆】把关于输入分布的凹性与关于信道的凸性对调", "【处理增益】声称通过后处理可提高关于源的信息量"],
        parameterConstraints: { markovChain: "数据处理不等式要求 X -> Y -> Z 的马尔可夫性", nonnegativity: "两变量互信息与条件互信息非负；交互信息可负", concavityInInput: "关于 p(x) 的凹性在固定信道下成立", convexityInChannel: "关于 p(y | x) 的凸性在固定输入分布下成立", discreteAssumption: "离散情形直接由熵差定义；连续情形需用微分熵或一般测度定义" },
        closureChecks: ["写出马尔可夫链结构并验证条件独立性", "用三种等价表达式交叉验证互信息数值", "对等号情形给出充分统计量或独立性证明"],
        scenarioChecks: { dpiApplication: ["验证马尔可夫性后逐级给出信息量不增的链式不等式"], conditioningParadox: ["用异或例子说明条件化可增加互信息"], sufficientStatistic: ["由 I(X; Y) = I(X; T(Y)) 判定充分统计量"] },
    },
    // 渐近均分性与典型集的大小估计。
    "info-aep-typical-set": {
        definitions: ["渐近均分性指独立同分布序列的经验对数概率依概率收敛到熵，由此定义的典型集在概率上几乎承载全部质量，其元素个数约为 2^{n H}，这是信源编码定理的组合基础"],
        formulas: ["AEP：-(1/n) log p(X_1, ..., X_n) -> H(X) 依概率成立", "典型集：A_eps^{(n)} = {x^n : 2^{-n(H + eps)} <= p(x^n) <= 2^{-n(H - eps)}}", "概率下界：P(A_eps^{(n)}) > 1 - eps 对充分大 n 成立", "大小上界：|A_eps^{(n)}| <= 2^{n(H + eps)}", "大小下界：|A_eps^{(n)}| >= (1 - eps) 2^{n(H - eps)} 对充分大 n 成立", "编码长度：用 n(H + eps) 比特可表示典型集元素并加 1 比特标志位", "高概率集下界：任意满足 P(B^{(n)}) > 1 - delta 的集合必有 (1/n) log |B^{(n)}| >= H - eps", "联合 AEP：(x^n, y^n) 联合典型的对数为 n H(X, Y)"],
        theorems: ["AEP 是弱大数律在 log p 上的直接应用，故只给出依概率收敛；断言几乎必然收敛需强大数律版本并另加条件", "典型序列并非最可能序列：偏斜 Bernoulli 源的最可能序列（全为高概率符号）通常不在典型集中，把典型集误认为最大概率集合是标准错误", "典型集大小 2^{n H} 远小于全空间 |X|^n = 2^{n log |X|}（当 X 非均匀），压缩正是舍弃非典型集所得，故压缩率下界为熵而非 log |X|", "任何高概率集的对数大小都不小于 n(H - eps)：这给出信源编码逆定理，故熵是压缩率的真实下界而不仅是一种构造的性能", "典型集论证要求独立同分布或平稳遍历（Shannon-McMillan-Breiman 定理）；对非平稳源直接套用 AEP 会得到错误的率", "联合典型性不能由各自典型性推出：需在联合分布下定义联合典型集，这是信道编码随机码论证的关键技术点"],
        generalRequirements: ["必须写明 eps 与 n 的依赖关系（对每个 eps 存在 N）", "必须同时给出典型集大小的上界与下界", "使用 AEP 必须声明独立同分布或平稳遍历假设"],
        forbiddenErrors: ["【典型即最可能】把典型集当作概率最大的序列集合", "【几乎必然误断】由弱大数律断言逐点几乎必然收敛", "【平稳性缺失】对非平稳或强相关源套用 AEP", "【单侧界】只给出典型集大小上界即断言压缩极限", "【联合典型误推】由边缘典型性断言联合典型性", "【eps 顺序错误】先取 n -> inf 再取 eps -> 0 的极限顺序颠倒导致结论无效"],
        parameterConstraints: { iidOrErgodic: "需独立同分布，或平稳遍历（用 Shannon-McMillan-Breiman）", epsPositive: "eps > 0 任意固定，n 需充分大依赖 eps", limitOrder: "先固定 eps 取 n -> inf，最后令 eps -> 0", finiteEntropy: "需 H(X) < inf", logBase: "以 2 为底时长度单位为比特" },
        closureChecks: ["核对典型集定义中的双侧概率不等式", "分别给出集合大小的上下界并说明其对应的编码与逆定理", "确认所用极限顺序与假设条件"],
        scenarioChecks: { compressionScheme: ["给出典型集索引编码方案并计算平均码长"], atypicalMostLikely: ["用偏斜 Bernoulli 源说明最可能序列非典型"], converseArgument: ["由高概率集大小下界给出压缩率的逆定理"] },
    },
    // 无失真信源编码定理与 Kraft 不等式。
    "info-source-coding-theorem": {
        definitions: ["无失真信源编码定理给出可唯一译码的期望码长的确切界：熵是可达下界且用分组编码可任意逼近；Kraft 不等式刻画前缀码码长向量的可实现性"],
        formulas: ["期望码长：L = sum_x p(x) l(x)", "Kraft 不等式：sum_x D^{-l(x)} <= 1（D 元码字母表），前缀码存在的充要条件", "McMillan 定理：任意唯一可译码的码长同样满足 Kraft 不等式", "下界：L >= H_D(X) = H(X) / log D，等号当且仅当 p(x) = D^{-l(x)}（D 进制字典分布）", "Shannon 码长：l(x) = ceil(-log_D p(x))，给出 H_D <= L < H_D + 1", "分组编码：n 长分组的每符号码长满足 H_D <= L_n / n < H_D + 1/n", "冗余：R = L - H_D >= 0", "非前缀但唯一可译示例：后缀码亦唯一可译且满足 Kraft"],
        theorems: ["前缀码不比一般唯一可译码差：McMillan 定理说明唯一可译码也满足 Kraft 不等式，故限制在前缀码内不损失任何最优性，这是只研究前缀码的理由", "Kraft 不等式是可实现性判据而非最优性判据：满足 Kraft 只说明存在对应码长的前缀码，不意味着该码长最优", "熵下界的等号条件极其苛刻：仅当所有概率为 D 的负整数次幂时才可达到，一般情形必有正冗余，故不能声称单符号编码可达熵", "加一比特的间隙不可通过单符号编码消除，但分组编码使每符号间隙降为 1/n，这解释了熵作为渐近极限而非单符号极限", "Kraft 不等式取严格小于号时码有冗余码字，可缩短某个码长而仍保持前缀性，故最优前缀码必使 Kraft 和为 1（D 元且树满时）", "定理要求已知信源分布：分布未知时需通用编码（Lempel-Ziv 等），其渐近最优性依赖平稳遍历性而非分布已知"],
        generalRequirements: ["必须区分前缀码、唯一可译码与一般码并说明所用类别", "给出码长必须验证 Kraft 不等式", "断言逼近熵必须说明使用分组编码及分组长度"],
        forbiddenErrors: ["【单符号达熵】声称非字典分布下单符号编码可使 L = H", "【Kraft 当最优】由满足 Kraft 不等式断言码最优", "【唯一可译需前缀】声称唯一可译码必为前缀码", "【底数遗漏】D 元码中用 log_2 熵直接与码长比较而不除以 log D", "【分布未知仍套定理】未知分布下直接使用熵界而不提通用编码", "【下界方向错】写成 L <= H 形式"],
        parameterConstraints: { alphabetSize: "码字母表大小 D >= 2，熵需换算为 H_D = H / log D", integerLengths: "码长需为正整数", kraftCondition: "前缀码存在当且仅当 sum D^{-l(x)} <= 1", knownDistribution: "定理要求信源分布已知（否则用通用编码）", blockLength: "分组编码的间隙为 1/n，需 n -> inf 才逼近熵" },
        closureChecks: ["验证所给码长满足 Kraft 不等式", "计算期望码长并与 H_D 及 H_D + 1 比较", "说明等号条件是否成立及冗余来源"],
        scenarioChecks: { kraftVerification: ["对给定码长向量计算 Kraft 和并判定前缀码可实现性"], shannonCodeConstruction: ["用取整码长构造码并给出码长界的证明"], blockCoding: ["用 n 长分组说明每符号码长向熵收敛的速率 1/n"] },
    },
    // Huffman 编码的最优前缀码性质。
    "info-huffman-optimality": {
        definitions: ["Huffman 算法自底向上反复合并概率最小的两个符号，生成使期望码长最小的前缀码；其最优性由若干交换论证引理与对合并后问题的归纳共同给出"],
        formulas: ["合并步：取最小两概率 p_1 <= p_2，合并为 p_1 + p_2，重复直到只剩一个节点", "期望码长：L = sum_x p(x) l(x)，等于所有内部节点概率之和", "性能界：H(X) <= L_Huffman < H(X) + 1（二元码）", "与 Shannon-Fano 比较：L_Huffman <= L_ShannonFano", "D 元情形需补零概率符号使 (m - 1) mod (D - 1) = 0", "递归关系：L(p_1, ..., p_m) = L(p_1 + p_2, p_3, ..., p_m) + (p_1 + p_2)", "复杂度：排序后用堆实现为 O(m log m)", "最优码长的兄弟性质：存在最优码使两个最小概率符号为最长码长且互为兄弟"],
        theorems: ["最优码的三条结构性引理是最优性证明的核心：概率大者码长不长于概率小者；最长码长必成对出现；两个最小概率符号可安排为兄弟。三者缺一则归纳无法闭合", "Huffman 码不唯一：概率并列时不同合并顺序给出不同码长向量（如 (0.4, 0.2, 0.2, 0.1, 0.1) 可得不同码长分布），但期望码长相同，故不能由码长向量唯一性反推算法错误", "最优性是关于单符号前缀码的：Huffman 一般不达到熵，其冗余可接近 1 比特（如极偏斜二元源），要突破需分组或算术编码", "D 元 Huffman 必须先补虚拟零概率符号使符号数满足同余条件，否则树不满、码长非最优", "Huffman 需要完整的概率表且对分布误差敏感；自适应版本每步更新频次，其最优性只在当前经验分布下成立", "算术编码可使每符号冗余趋于零并支持流式处理，故 Huffman 的最优性不是编码性能的绝对上限，只是单符号整数码长约束下的最优"],
        generalRequirements: ["必须给出完整的合并过程与最终码长向量", "必须说明码长非唯一而期望码长唯一", "D 元编码必须处理符号数的同余补齐"],
        forbiddenErrors: ["【达熵误断】声称 Huffman 码期望码长等于熵", "【码唯一性】断言 Huffman 码字唯一", "【合并选择错】每步不取最小两个概率合并", "【D 元未补齐】D > 2 时不补虚拟符号导致树不满", "【引理缺失】证明最优性时跳过兄弟性质或最长码长成对的引理", "【分组无益】声称分组编码不能改善单符号 Huffman 的冗余"],
        parameterConstraints: { probabilityTable: "需已知完整概率分布且概率非负和为 1", alphabetSize: "D >= 2；D 元需 (m - 1) mod (D - 1) = 0，否则补零概率符号", integerCodeLengths: "码长为正整数，故一般存在正冗余", prefixConstraint: "输出为前缀码，满足 Kraft 等号（树满时）", tieBreaking: "并列概率的合并顺序任意，不影响期望码长" },
        closureChecks: ["画出合并树并读出每个符号的码长", "计算期望码长并与熵及熵加一比较", "检验 Kraft 和是否为 1（树满）"],
        scenarioChecks: { huffmanConstruction: ["按概率升序逐步合并并给出完整码表"], optimalityProof: ["用三条结构引理加归纳完成最优性论证"], ternaryCase: ["三元编码先按同余条件补虚拟符号再合并"] },
    },
    // 信道容量与有噪信道编码定理。
    "info-channel-capacity": {
        definitions: ["离散无记忆信道的容量定义为输入分布上互信息的最大值，有噪信道编码定理断言严格小于容量的任何速率都可用长码把错误概率压到任意小，而超过容量的速率必然导致错误概率不趋于零"],
        formulas: ["容量：C = max_{p(x)} I(X; Y)，单位为每信道使用的比特", "二元对称信道：C = 1 - H(p)，H(p) = -p log p - (1 - p) log(1 - p)", "二元擦除信道：C = 1 - alpha（擦除概率 alpha）", "码率：R = (log M) / n，M 为码字数，n 为码长", "可达性：对任意 R < C 存在 (2^{nR}, n) 码使最大错误概率 P_e^{(n)} -> 0", "逆定理：R > C 时 P_e^{(n)} 不趋于零", "n 次使用无记忆信道：I(X^n; Y^n) <= n C，等号需输入独立同分布且取容量达到分布", "反馈不增容量：C_FB = C（离散无记忆信道）"],
        theorems: ["容量的极大化对象是输入分布而非信道：I(X; Y) 关于 p(x) 是凹函数，故最大值存在且可由 KKT 条件刻画（所有使用符号的 I(x; Y) 相等且不小于未使用符号的值），Blahut-Arimoto 迭代收敛到该最优", "定理只给出存在性而非构造：随机编码加联合典型性译码证明可达性，故不能由定理直接得到显式好码；显式逼近容量需 Turbo / LDPC / Polar 码", "无记忆性与独立使用不可省：I(X^n; Y^n) <= n C 的推导依赖 p(y^n | x^n) = prod p(y_i | x_i)，对有记忆信道容量需用 lim (1/n) max I(X^n; Y^n) 定义", "反馈不能增加离散无记忆信道的容量，但能显著简化编码并降低复杂度，故不能由反馈无益于容量断言反馈无用", "容量是关于错误概率趋零的渐近量：有限码长下存在速率与错误概率的折中（有限码长界如 Polyanskiy 正态逼近），不能用容量断言有限长系统的可靠速率", "并联与串联的容量不可随意相加：独立并联信道容量相加，而串联信道由数据处理不等式给出容量不超过各段最小值"],
        generalRequirements: ["必须写清信道转移概率与是否无记忆", "计算容量必须给出达到最大值的输入分布", "断言可达性必须说明码长趋于无穷的渐近含义"],
        forbiddenErrors: ["【极大化对象错】对信道而非输入分布取极大", "【零错误误断】声称 R < C 时可达严格零错误概率", "【有记忆套用】对有记忆信道直接使用单次使用容量乘 n", "【显式构造误断】称编码定理给出了具体最优码", "【有限码长滥用】用容量作为有限码长系统的可靠速率保证", "【反馈增容量】声称反馈可提高离散无记忆信道容量"],
        parameterConstraints: { channelModel: "需给定转移概率 p(y | x) 且假设离散无记忆", inputDistribution: "极大化在输入概率单纯形上进行", rateDefinition: "R = (log M) / n，与对数底一致", asymptotic: "可达性与逆定理均为 n -> inf 的渐近陈述", symmetricChannel: "对称信道的容量达到分布为均匀输入" },
        closureChecks: ["核对容量公式在极端参数（无噪、全噪）下的取值", "给出并验证达到容量的输入分布", "区分可达性与逆定理两个方向的陈述"],
        scenarioChecks: { bscCapacity: ["由 1 - H(p) 计算并验证 p = 1/2 时容量为零"], achievabilityProof: ["用随机编码与联合典型集译码给出错误概率趋零的论证"], memoryDiscussion: ["说明无记忆假设失效时容量定义需改为极限形式"] },
    },
    // Fano 不等式与编码逆定理。
    "info-fano-converse": {
        definitions: ["Fano 不等式把由 Y 估计 X 的错误概率与条件熵联系起来，给出错误概率的信息论下界；它是几乎所有编码逆定理与统计极小极大下界的核心工具"],
        formulas: ["Fano 不等式：H(X | Y) <= H(P_e) + P_e log(|X| - 1)", "弱化形式：H(X | Y) <= 1 + P_e log |X|", "错误概率下界：P_e >= (H(X | Y) - 1) / log |X|", "估计量形式：X -> Y -> X_hat，P_e = P(X_hat != X)", "信道逆定理：n R = H(W) = I(W; Y^n) + H(W | Y^n) <= n C + 1 + P_e n R", "整理得：P_e >= 1 - C / R - 1 / (n R)", "均匀消息假设：H(W) = log M = n R", "率失真逆定理同样以 Fano 型论证给出 R >= R(D)"],
        theorems: ["Fano 不等式的右端含 log(|X| - 1) 而非 log |X|：这一改进在二元情形给出 H(X | Y) <= H(P_e)，是判断误差是否可趋零的关键紧化，弱化形式会损失该结论", "不等式方向是由条件熵下界错误概率：条件熵大则不可能低错误估计；反之错误概率小不必然使条件熵小到任意程度，故不能反向使用", "逆定理需要消息均匀分布假设（H(W) = n R）：若消息非均匀则 n R 应换为 H(W)，直接套用会给出错误的速率界", "由 P_e >= 1 - C / R - 1/(nR) 可见 R > C 时错误概率被正常数下界隔开，这正是强逆的弱版本；强逆定理进一步给出 P_e -> 1", "Fano 不等式对连续或无限字母表需修改：log |X| 无界，此时用 rate-distortion 或 Le Cam / Assouad 型方法替代", "Fano 不等式与数据处理不等式配合使用：估计链 X -> Y -> X_hat 的马尔可夫性使 I(X; X_hat) <= I(X; Y)，这是统计下界推导的标准组合"],
        generalRequirements: ["必须写明字母表大小与消息分布假设", "使用逆定理必须给出完整的熵分解链", "连续参数情形必须说明替代方法"],
        forbiddenErrors: ["【弱化形式滥用】在二元情形用 1 + P_e log |X| 而丢失紧界", "【方向反用】由小错误概率断言条件熵必为零", "【均匀性缺失】非均匀消息下仍取 H(W) = n R", "【无限字母表】对连续变量直接使用含 log |X| 的形式", "【马尔可夫性忽略】未验证估计链结构即联用数据处理不等式", "【强逆误称】把 P_e 有正下界当作 P_e -> 1 的强逆结论"],
        parameterConstraints: { alphabetFinite: "需 |X| < inf 才能使用 log(|X| - 1) 项", uniformMessage: "逆定理常设消息均匀，否则用 H(W) 代替 n R", markovStructure: "X -> Y -> X_hat 需为马尔可夫链", logBase: "H(P_e) 与 log |X| 需同底", errorProbability: "P_e in [0, 1]，P_e = 0 时给出 H(X | Y) = 0" },
        closureChecks: ["核对不等式右端是否使用 log(|X| - 1)", "写出逆定理的完整熵分解并核对每一步依据", "检查 P_e = 0 与 P_e = 1 的边界一致性"],
        scenarioChecks: { binaryCase: ["在二元字母表下给出 H(X | Y) <= H(P_e) 并说明其紧性"], channelConverse: ["用 Fano 不等式导出 R > C 时错误概率的正下界"], estimationLowerBound: ["把参数估计问题离散化后用 Fano 不等式给出极小极大下界"] },
    },
    // 率失真函数与有失真压缩极限。
    "info-rate-distortion": {
        definitions: ["率失真函数给出在平均失真不超过 D 的约束下压缩率的确切极限，等于满足失真约束的所有测试信道上互信息的最小值；它把无失真信源编码定理推广到允许失真的情形"],
        formulas: ["定义：R(D) = min_{p(x_hat | x) : E d(X, X_hat) <= D} I(X; X_hat)", "失真约束：E d(X, X_hat) = sum_{x, x_hat} p(x) p(x_hat | x) d(x, x_hat) <= D", "Gaussian 源平方失真：R(D) = (1/2) log(sigma^2 / D)，0 <= D <= sigma^2；D > sigma^2 时 R(D) = 0", "Bernoulli(p) 源 Hamming 失真：R(D) = H(p) - H(D)，0 <= D <= min(p, 1 - p)", "边界值：R(0) = H(X)（离散无失真），R(D_max) = 0，D_max = min_{x_hat} E d(X, x_hat)", "Shannon 下界：R(D) >= h(X) - max_{E d <= D} h(d)（连续源）", "率失真定理：R > R(D) 可达失真 D；R < R(D) 时任何码的失真必超过 D", "凸性：R(D) 是 D 的非增凸函数"],
        theorems: ["极小化对象是测试信道 p(x_hat | x) 而非重建分布：忽略这一点会把问题误解为在输出分布上极小化，从而失去失真约束下的正确耦合结构", "R(D) 非增且凸，故其在 [0, D_max] 上连续并在 D >= D_max 处恒为零；断言 R(D) 在某点跳变或非凸即与定义矛盾", "Gaussian 源在平方失真下是最难压缩的：给定方差，Gaussian 的 R(D) 最大，故 (1/2) log(sigma^2 / D) 是同方差源的上界，这一极值性来自最大熵性质", "定理的可达性同样是渐近随机码论证（联合典型集加失真检验），不给出实用量化器；实际系统用向量量化或变换编码逼近", "失真度量的选择改变 R(D) 的整体形状：Hamming、平方、感知度量给出不同结果，因此不能跨度量搬用公式", "率失真与信道容量是对偶的极值问题（一个取极小一个取极大），Blahut-Arimoto 算法对两者都适用，但约束方向与 Lagrange 乘子符号相反，混用会给出错误迭代"],
        generalRequirements: ["必须显式给出失真度量与失真上限 D", "必须说明 D 的允许范围及边界处的取值", "使用闭式公式必须核对源分布与失真度量匹配"],
        forbiddenErrors: ["【极小化对象错】在重建分布而非测试信道上取极小", "【范围越界】对 D > sigma^2 仍使用 (1/2) log(sigma^2 / D) 得到负值", "【度量混用】把平方失真公式用于 Hamming 失真", "【凸性违背】给出非凸或递增的 R(D)", "【构造误断】声称定理给出显式量化器", "【对偶混淆】把容量的极大化条件直接用于率失真的极小化"],
        parameterConstraints: { distortionMeasure: "需给定 d(x, x_hat) >= 0 及其类型（Hamming / 平方 / 一般）", distortionRange: "0 <= D <= D_max，超出则 R(D) = 0", gaussianCase: "闭式解要求源为 Gaussian 且失真为均方误差", testChannel: "极小化在满足失真约束的条件分布上进行", convexity: "R(D) 非增且凸，边界 R(0) = H(X)（离散）" },
        closureChecks: ["核对 D 的取值范围与 R(D) 的边界值", "验证 R(D) 的单调性与凸性", "检查所用闭式公式与失真度量、源分布是否一致"],
        scenarioChecks: { gaussianQuadratic: ["由 (1/2) log(sigma^2 / D) 计算并说明 D >= sigma^2 时率为零"], bernoulliHamming: ["用 H(p) - H(D) 计算并给出 D 的允许上限"], converseArgument: ["用互信息与失真约束给出 R < R(D) 不可达的逆定理"] },
    },
    // 微分熵与最大熵分布。
    "info-differential-entropy-maxent": {
        definitions: ["微分熵是连续分布的对数密度期望的相反数，它可为负且不具坐标不变性；最大熵原理在给定矩约束下选出熵最大的分布，其解具有指数族形式"],
        formulas: ["微分熵：h(X) = -int f(x) log f(x) dx", "均匀分布：h = log(b - a)（可为负，当 b - a < 1）", "Gaussian：h = (1/2) log(2 pi e sigma^2)", "多元 Gaussian：h = (1/2) log((2 pi e)^n det Sigma)", "指数分布（均值 lambda）：h = log(e lambda)", "线性变换：h(A X) = h(X) + log |det A|，故 h 不是坐标不变量", "相对熵与最大熵：h(X) = log Z - D(f || f*) 型分解，最大熵解形如 f*(x) = exp(lambda_0 + sum_i lambda_i g_i(x))", "熵功率不等式：e^{2 h(X + Y) / n} >= e^{2 h(X) / n} + e^{2 h(Y) / n}（X、Y 独立）"],
        theorems: ["微分熵不是离散熵的极限：量化步长 Delta 下 H(X^Delta) 约为 h(X) - log Delta，故 Delta -> 0 时离散熵发散，二者相差一个发散项，不能互相替代", "微分熵可为负且随尺度变化（h(aX) = h(X) + log |a|），故不能把它解释为绝对不确定性量；只有互信息、相对熵这类差值才有坐标不变意义", "固定方差下 Gaussian 唯一最大化微分熵；固定均值且支撑在正半轴上是指数分布；固定支撑区间是均匀分布。约束类型决定解的形式，混用会给出错误的极值分布", "最大熵解的存在性依赖归一化可行：若约束不足（如仅固定均值而支撑为全直线），上确界为无穷且不存在最大熵分布，故必须检验配分函数收敛", "最大熵证明的标准手段是 h(f) - h(f*) <= D(f || f*) 的非负性配合矩约束使交叉项相等，直接对熵做变分而不检查约束相容性会遗漏边界情形", "熵功率不等式给出独立和的熵下界，比 h(X + Y) >= max(h(X), h(Y)) 强，且是中心极限定理的信息论证明与容量区域外界的关键工具"],
        generalRequirements: ["必须指明约束类型（支撑、矩）并检验最大熵解的归一化可行性", "使用微分熵必须注意其非坐标不变性与可负性", "与离散熵联用时必须写出量化修正项"],
        forbiddenErrors: ["【非负性搬用】断言微分熵非负", "【离散极限】把微分熵当作离散熵在细网格下的极限值", "【尺度不变】认为线性变换不改变微分熵", "【约束与解错配】在固定支撑区间时给出 Gaussian 为最大熵解", "【可行性未检】约束不足时仍声称存在最大熵分布", "【EPI 误用】把熵功率不等式用于相关的随机变量"],
        parameterConstraints: { densityExists: "需存在概率密度且积分收敛", supportSpecified: "最大熵问题必须给定支撑集与矩约束", scaleDependence: "h(aX) = h(X) + log |a|，单位改变会改变数值", gaussianMaximality: "方差固定时 Gaussian 最大，需二阶矩有限", epiIndependence: "熵功率不等式要求 X、Y 独立" },
        closureChecks: ["核对最大熵解的指数族形式与给定约束一致", "验证配分函数收敛与归一化条件", "检查所得熵值在尺度变换下的行为是否合理"],
        scenarioChecks: { gaussianMaxent: ["在方差约束下证明 Gaussian 唯一最大化微分熵"], quantizationLink: ["写出 H(X^Delta) 与 h(X) - log Delta 的关系并说明发散来源"], constraintFeasibility: ["检验给定矩约束下配分函数是否收敛以判断最大熵解存在性"] },
    },
};
