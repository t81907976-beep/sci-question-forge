import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“微积分-极限与连续”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const CALCULUS_LIMIT_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 实数完备性的等价命题体系。
    "real-completeness-equivalences": {
        id: "real-completeness-equivalences", l2Key: "calculus-limit", name: "实数完备性等价命题", kind: "theorem",
        aliases: ["确界原理", "单调有界定理", "闭区间套定理", "Bolzano-Weierstrass定理", "Heine-Borel定理"],
    },
    // Cauchy 收敛准则与 Heine 归结原理。
    "cauchy-criterion-heine-principle": {
        id: "cauchy-criterion-heine-principle", l2Key: "calculus-limit", name: "Cauchy 收敛准则与归结原理", kind: "criterion",
        aliases: ["Cauchy收敛准则", "Cauchy列", "归结原理", "Heine定理", "子列判据"],
    },
    // Stolz-Cesàro 定理（离散洛必达）。
    "stolz-cesaro-theorem": {
        id: "stolz-cesaro-theorem", l2Key: "calculus-limit", name: "Stolz-Cesàro 定理", kind: "theorem",
        aliases: ["Stolz定理", "Stolz-Cesàro定理", "离散洛必达", "Cesàro平均"],
    },
    // 无穷小的阶与渐近展开的合法使用范围。
    "asymptotic-expansion-order": {
        id: "asymptotic-expansion-order", l2Key: "calculus-limit", name: "无穷小阶的比较与渐近展开", kind: "criterion",
        aliases: ["等价无穷小", "阶的比较", "Landau记号", "渐近展开", "o与O"],
    },
    // 一致连续性与 Cantor 定理。
    "uniform-continuity-cantor": {
        id: "uniform-continuity-cantor", l2Key: "calculus-limit", name: "一致连续性与 Cantor 定理", kind: "theorem",
        aliases: ["一致连续", "Cantor定理", "Lipschitz连续", "连续模", "紧集上连续"],
    },
    // 函数列与函数级数的一致收敛判据。
    "uniform-convergence-criteria": {
        id: "uniform-convergence-criteria", l2Key: "calculus-limit", name: "一致收敛判据", kind: "criterion",
        aliases: ["一致收敛", "Weierstrass判别法", "Dini定理", "上确界范数", "内闭一致收敛"],
    },
    // Arzelà-Ascoli 定理。
    "arzela-ascoli-theorem": {
        id: "arzela-ascoli-theorem", l2Key: "calculus-limit", name: "Arzelà-Ascoli 定理", kind: "theorem",
        aliases: ["Arzelà-Ascoli定理", "等度连续", "一致有界", "紧性判据", "预紧"],
    },
    // Stone-Weierstrass 定理。
    "stone-weierstrass-theorem": {
        id: "stone-weierstrass-theorem", l2Key: "calculus-limit", name: "Stone-Weierstrass 定理", kind: "theorem",
        aliases: ["Stone-Weierstrass定理", "多项式逼近", "稠密子代数", "点分离", "三角多项式逼近"],
    },
    // 多元函数极限的路径无关性。
    "multivariable-limit-path-independence": {
        id: "multivariable-limit-path-independence", l2Key: "calculus-limit", name: "多元极限的路径无关性判据", kind: "criterion",
        aliases: ["多元函数极限", "极限路径无关", "累次极限", "极坐标夹逼", "重极限"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const CALCULUS_LIMIT_L3_RULES: Record<string, MathV2L3Rules> = {
    // 实数完备性：六个等价命题及其循环证明结构。
    "real-completeness-equivalences": {
        definitions: ["实数完备性是把有理数域与实数域区分开的核心性质，可由六个互相等价的命题刻画，任一命题都可作为公理并推出其余。"],
        formulas: ["确界原理：非空有上界的实数集必有上确界 sup。", "单调有界定理：单调递增且有上界的数列收敛且极限为 sup{a_n}。", "闭区间套定理：[a_n, b_n] 递减且 b_n - a_n → 0 ⇒ ∩ [a_n, b_n] 为单点。", "Bolzano-Weierstrass：有界数列必有收敛子列。", "Heine-Borel：[a,b] 的任意开覆盖有有限子覆盖；Cauchy 准则：Cauchy 列必收敛。"],
        theorems: ["六个命题两两等价，标准证明路线为确界原理 ⇒ 单调有界 ⇒ 区间套 ⇒ Bolzano-Weierstrass ⇒ Cauchy 准则 ⇒ 确界原理。", "完备性在有理数域上全部失效：√2 的有理逼近列是 Cauchy 列但无有理极限，可用于检验论证是否真正使用了完备性。", "闭区间套定理中 b_n - a_n → 0 不可省，否则交集可能是非退化区间；开区间套的交集可以为空（如 (0, 1/n)）。", "紧性（Heine-Borel）在 R^n 中等价于有界闭，但在一般度量空间中只等价于列紧或完备且全有界。"],
        generalRequirements: ["使用任一完备性命题必须核对其全部前提（非空、有界、闭、单调、嵌套且长度趋零）。", "证明中必须指明所依赖的完备性形式，不能默认「显然收敛」。"],
        forbiddenErrors: ["【区间套条件残缺】漏掉 b_n - a_n → 0 或改用开区间仍断言交点唯一。", "【确界与最值混淆】把 sup 当作集合中的最大元素。", "【有界即收敛】由有界直接断言收敛（只能得收敛子列）。", "【紧性误推广】把 Heine-Borel 直接搬到无穷维空间（单位球在无穷维中不紧）。"],
        parameterConstraints: { nonEmptyBounded: "确界原理要求集合非空且有上界（下界）。", nestedShrinking: "闭区间套需嵌套、闭且长度趋于零。", ambientSpace: "Heine-Borel 形式的等价性只在 R^n 中成立。" },
        closureChecks: ["写明所用完备性命题及其前提验证。", "检查是否可用有理数反例证伪同一论证。", "若结论为存在性，指出所得对象的唯一性来源。"],
        scenarioChecks: { existenceOfLimit: ["用单调有界或 Cauchy 准则给出极限存在性而不需先求出极限值。"], subsequenceExtraction: ["用 Bolzano-Weierstrass 抽取收敛子列并说明有界性来源。"], compactnessArgument: ["用有限子覆盖把局部性质提升为整体一致性质。"] },
    },
    // Cauchy 准则与归结原理。
    "cauchy-criterion-heine-principle": {
        definitions: ["Cauchy 准则用序列内部的项间距离刻画收敛而不需预知极限；归结原理（Heine 定理）把函数极限等价转化为一切趋近数列上的数列极限。"],
        formulas: ["数列 Cauchy 准则：{a_n} 收敛 ⇔ ∀ε > 0 ∃N，∀m, n > N，|a_m - a_n| < ε。", "函数 Cauchy 准则：lim_{x→a} f(x) 存在 ⇔ ∀ε > 0 ∃δ > 0，∀x, y ∈ U̇(a, δ)，|f(x) - f(y)| < ε。", "归结原理：lim_{x→a} f(x) = L ⇔ 对一切 x_n → a（x_n ≠ a）有 f(x_n) → L。", "否定形式：找到两个 x_n → a、y_n → a 使 lim f(x_n) ≠ lim f(y_n) ⇒ 极限不存在。", "一致收敛的 Cauchy 准则：sup_x |f_m(x) - f_n(x)| → 0（m, n → ∞）。"],
        theorems: ["Cauchy 准则的充分性依赖完备性，故它是完备性的等价刻画而非普适真理。", "归结原理是证明极限不存在的标准工具（如 lim_{x→0} sin(1/x) 用 x_n = 1/(2nπ) 与 y_n = 1/(2nπ + π/2)）。", "归结原理要求对「一切」数列成立，只验证若干特殊数列不能证明极限存在，只能用于否证。", "复合函数极限需归结原理配合内函数在去心邻域内不取极限值，否则换元后极限可能改变。"],
        generalRequirements: ["用归结原理证明存在性时必须覆盖任意趋近数列，不能枚举。", "使用 Cauchy 准则必须写出对 m、n 同时成立的双指标估计。"],
        forbiddenErrors: ["【单指标 Cauchy】只验证 |a_{n+1} - a_n| → 0 就断言收敛（如 a_n = ln n 反例）。", "【归结原理反用】由若干数列极限相同断言函数极限存在。", "【去心条件遗漏】复合极限换元时未排除内函数取到极限值的情形。", "【完备性缺失】在有理数或非完备空间中使用 Cauchy 准则的充分性。"],
        parameterConstraints: { doubleIndex: "Cauchy 条件必须对任意 m, n > N 成立。", punctured: "归结原理中要求 x_n ≠ a。", completeness: "充分性方向要求空间完备。" },
        closureChecks: ["核对是否为双指标估计而非相邻项估计。", "证明极限不存在时给出两条具体的趋近数列。", "复合极限换元时检查去心邻域条件。"],
        scenarioChecks: { nonexistenceProof: ["构造两条趋近路径的数列给出不同极限。"], recursiveSequence: ["压缩型递推用 |a_{n+1} - a_n| ≤ c^n 求和后满足 Cauchy 条件。"], uniformConvergenceCheck: ["用一致 Cauchy 准则避免先求出极限函数。"] },
    },
    // Stolz-Cesàro 定理。
    "stolz-cesaro-theorem": {
        definitions: ["Stolz-Cesàro 定理是洛必达法则的离散类比，用相邻差商的极限处理和式或递推数列的比值极限。"],
        formulas: ["∞/∞ 型：{b_n} 严格单调且 b_n → +∞，若 lim (a_{n+1} - a_n)/(b_{n+1} - b_n) = L，则 lim a_n/b_n = L。", "0/0 型：a_n → 0、b_n → 0 且 {b_n} 严格单调，同样结论成立。", "Cesàro 平均推论：a_n → L ⇒ (a_1 + ... + a_n)/n → L。", "几何平均推论：a_n > 0 且 a_n → L ⇒ (a_1 ⋯ a_n)^{1/n} → L；比值形式 lim a_{n+1}/a_n = L ⇒ lim a_n^{1/n} = L。", "典型应用：lim (1^p + ... + n^p)/n^{p+1} = 1/(p+1)。"],
        theorems: ["定理是单向的：差商极限存在 ⇒ 比值极限存在，反之不成立（差商可振荡而比值收敛）。", "严格单调性与 b_n → ∞ 不可省，否则结论失效。", "由 lim a_n^{1/n} 存在不能反推 lim a_{n+1}/a_n 存在，故根值判别法比比值判别法更强。", "Stolz 定理与 Toeplitz 正则求和法同源，可推广到一般加权平均的正则性条件。"],
        generalRequirements: ["必须验证分母数列严格单调且趋于无穷（或与分子同趋于零）。", "差商极限不存在时必须改用其他方法，不能断言原极限不存在。"],
        forbiddenErrors: ["【逆用定理】由比值极限不存在断言差商极限不存在，或由差商振荡断言原极限不存在。", "【单调性缺失】对非单调分母套用。", "【0/0 型条件混用】把 ∞/∞ 型条件用于 0/0 型而不核对同趋于零。", "【Cesàro 逆命题】由 Cesàro 平均收敛断言原数列收敛（如 a_n = (-1)^n）。"],
        parameterConstraints: { strictMonotone: "{b_n} 必须严格单调。", divergence: "∞/∞ 型要求 b_n → +∞。", oneDirection: "结论方向只能由差商推比值。" },
        closureChecks: ["核对分母的严格单调性与趋向。", "计算差商并确认其极限存在。", "若差商极限不存在，换用夹逼、积分估计或求和公式。"],
        scenarioChecks: { powerSumAsymptotics: ["用差商把和式的渐近阶化为单项比较。"], recurrenceLimit: ["递推数列的增长阶用 Stolz 定理确定。"], rootVsRatioTest: ["由比值极限推根值极限，注意不可逆。"] },
    },
    // 无穷小阶的比较与渐近展开的使用边界。
    "asymptotic-expansion-order": {
        definitions: ["无穷小的阶用 Landau 记号刻画，等价无穷小替换与 Taylor 渐近展开是处理未定式的核心工具，但替换有严格的适用范围。"],
        formulas: ["o(x^k)：比 x^k 高阶；O(x^k)：不超过 x^k 量级；o(x^k) ⊊ O(x^k)。", "等价：f ~ g ⇔ lim f/g = 1；可用于乘除因子，不可用于加减项。", "常用展开：sin x = x - x^3/6 + o(x^3)，cos x = 1 - x^2/2 + x^4/24 + o(x^4)，e^x = 1 + x + x^2/2 + o(x^2)，ln(1+x) = x - x^2/2 + x^3/3 + o(x^3)，(1+x)^α = 1 + αx + α(α-1)x^2/2 + o(x^2)。", "临界例：lim_{x→0} (sin x - x)/x^3 = -1/6，用 sin x ~ x 替换后得 0，说明替换失效。", "阶的运算：o(x^m)·o(x^n) = o(x^{m+n})，x^m·o(x^n) = o(x^{m+n})，o(x^m) + o(x^n) = o(x^{min(m,n)})。"],
        theorems: ["加减项中做等价替换会丢失主项，必须展开到差不相消的阶（消去阶数由分母决定）。", "展开阶数下界：分母为 x^k 时分子至少展开到 x^k 且保留首个非零系数项。", "洛必达法则要求 0/0 或 ∞/∞ 型且分母导数在去心邻域非零，且 lim f'/g' 存在；后者不存在时不能断言原极限不存在。", "1^∞、0^0、∞^0 型必须先取对数化为 0·∞ 或 0/0 型再处理；∞-∞ 型需通分或提取主项。"],
        generalRequirements: ["必须先判定未定式类型再选择方法。", "使用 Taylor 展开必须声明展开点与保留阶数，并核对余项不影响结论。"],
        forbiddenErrors: ["【加减项等价替换】在和差中替换等价无穷小导致主项抵消。", "【展开阶不足】展开阶低于分母阶导致得到 0 或 ∞ 的错误结论。", "【洛必达条件未核】非未定式或分母导数为零仍求导，或循环求导不终止。", "【洛必达逆用】由 lim f'/g' 不存在断言原极限不存在。", "【o 与 O 混用】把 O(x^k) 当作 o(x^k) 忽略。"],
        parameterConstraints: { indeterminateForm: "必须属于 0/0、∞/∞、0·∞、∞-∞、1^∞、0^0、∞^0 之一。", expansionOrder: "分子展开阶不低于分母阶且保留首个非零项。", lhopitalRegularity: "洛必达要求去心邻域可导且 g'(x) ≠ 0。" },
        closureChecks: ["写明未定式类型。", "核对等价替换只用于乘除因子。", "核对展开阶数足以给出非零主项，并写出余项形式。"],
        scenarioChecks: { nestedInfinitesimals: ["多层复合逐层确定阶数后再统一展开。"], oneToInfinityForm: ["1^∞ 型用 exp(g ln f) 化为 0·∞ 型。"], lhopitalAlternative: ["洛必达失效或循环时改用 Taylor 展开或夹逼。"] },
    },
    // 一致连续性与 Cantor 定理。
    "uniform-continuity-cantor": {
        definitions: ["一致连续要求 δ 只依赖 ε 而不依赖点，是全局性质；Cantor 定理断言紧集上的连续函数自动一致连续。"],
        formulas: ["一致连续：∀ε > 0 ∃δ > 0，∀x, y ∈ D，|x - y| < δ ⇒ |f(x) - f(y)| < ε。", "连续（逐点）：δ 可依赖 x₀。", "Cantor 定理：f ∈ C[a,b] ⇒ f 在 [a,b] 上一致连续。", "Lipschitz：|f(x) - f(y)| ≤ L|x - y| ⇒ 一致连续；Hölder：≤ L|x - y|^α（0 < α ≤ 1）亦然。", "连续模：ω(δ) = sup_{|x-y| ≤ δ} |f(x) - f(y)|，一致连续 ⇔ ω(δ) → 0（δ → 0⁺）。"],
        theorems: ["开区间或无界区间上连续未必一致连续：1/x 于 (0,1)、x^2 于 R、sin(1/x) 于 (0,1) 均为标准反例。", "R 上一致连续必要条件：导数无界时可能仍一致连续（如 √x），但导数有界 ⇒ Lipschitz ⇒ 一致连续（充分不必要）。", "一致连续函数把 Cauchy 列映为 Cauchy 列，故可唯一连续延拓到定义域的闭包（这是判别一致连续的有力工具）。", "一致连续性是紧性的推论：证明思路为用有限子覆盖或反证 + Bolzano-Weierstrass 抽取子列。"],
        generalRequirements: ["必须明确定义域，并区分逐点连续与一致连续。", "断言一致连续必须给出 δ(ε) 的显式构造或引用 Cantor 定理/Lipschitz 条件。"],
        forbiddenErrors: ["【连续即一致连续】在开区间或无界域上把连续性当作一致连续。", "【δ 依赖点】给出的 δ 含 x₀ 仍声称一致连续。", "【Cantor 定理条件缺失】对开区间或非紧集套用 Cantor 定理。", "【导数无界即非一致连续】由导数无界断言不一致连续（√x 于 [0,1] 反例）。"],
        parameterConstraints: { domainCompactness: "Cantor 定理要求定义域为紧集（有界闭）。", deltaIndependence: "δ 不得依赖具体点。", holderExponent: "Hölder 指数 0 < α ≤ 1。" },
        closureChecks: ["写出 δ(ε) 且检查其与点无关。", "非紧定义域时检查端点与无穷远行为或用 Cauchy 列判据。", "给出反例时明确指出 ε 的固定取法。"],
        scenarioChecks: { extensionToClosure: ["一致连续函数延拓到闭包并保持连续。"], counterexampleConstruction: ["用趋近同一点的两列点使函数值差不趋于零。"], derivativeBound: ["导数有界给出 Lipschitz 常数从而一致连续。"] },
    },
    // 一致收敛判据与极限交换。
    "uniform-convergence-criteria": {
        definitions: ["一致收敛是保证极限运算与连续、积分、求导交换的最小要求，其判据体系包括上确界判据、Cauchy 判据、Weierstrass 判别法与 Dini 定理。"],
        formulas: ["一致收敛：sup_{x ∈ D} |f_n(x) - f(x)| → 0。", "Cauchy 判据：sup_x |f_m(x) - f_n(x)| → 0（m, n → ∞）。", "Weierstrass M 判别法：|u_n(x)| ≤ M_n 且 ∑ M_n < ∞ ⇒ ∑ u_n 一致收敛（且绝对收敛）。", "Dini 定理：紧集上 f_n 连续、逐点单调收敛到连续 f ⇒ 一致收敛。", "Abel/Dirichlet 判别法：部分和一致有界 + 单调一致趋零 ⇒ 一致收敛（用于 ∑ a_n(x) b_n(x) 型）。"],
        theorems: ["一致收敛 ⇒ 极限函数连续、可交换极限与积分；但交换极限与求导需 f_n' 一致收敛（f_n 逐点收敛即可）。", "逐点收敛不足以保住连续性（f_n = x^n 于 [0,1]）或积分值（n x^{n-1} 于 [0,1] 积分恒为 1 而极限函数几乎处处为 0）。", "Dini 定理的三个条件（紧、单调、极限函数连续）缺一不可，去掉任一条均有反例。", "幂级数在收敛半径内内闭一致收敛但一般不在整个开圆盘上一致收敛，故只能对紧子集断言一致性质。"],
        generalRequirements: ["必须明确一致收敛所在的集合（整体还是内闭）。", "交换极限与微分必须对导数列验证一致收敛。"],
        forbiddenErrors: ["【逐点当一致】由逐点收敛断言极限函数连续或积分可交换。", "【求导交换条件错位】只用 f_n 一致收敛就交换极限与求导。", "【M 判别法误用】M_n 依赖 x 或 ∑ M_n 发散仍断言一致收敛。", "【Dini 条件缺失】在非紧集或极限函数不连续时套用 Dini 定理。", "【内闭与整体混淆】把内闭一致收敛当作整个区间上一致收敛。"],
        parameterConstraints: { supremumOverDomain: "上确界必须对整个所述集合取。", derivativeUniformity: "微分交换要求 {f_n'} 一致收敛且某点 f_n 收敛。", compactnessForDini: "Dini 定理要求紧定义域与单调性。" },
        closureChecks: ["计算或估计 sup_x |f_n - f|。", "指明所断言性质（连续性、可积性、可导性）对应的一致性条件。", "若只在紧子集上成立，明确写出内闭一致收敛。"],
        scenarioChecks: { limitIntegralExchange: ["一致收敛或控制收敛条件下交换极限与积分。"], seriesOfFunctions: ["用 M 判别法或 Dirichlet 判别法判定函数级数的一致收敛。"], powerSeriesRegion: ["幂级数结论限定在收敛半径内的紧子集上。"] },
    },
    // Arzelà-Ascoli 定理。
    "arzela-ascoli-theorem": {
        definitions: ["Arzelà-Ascoli 定理给出连续函数空间 C(K) 中集合预紧的充要条件：一致有界加等度连续，是无穷维紧性的核心判据。"],
        formulas: ["等度连续：∀ε > 0 ∃δ > 0，∀f ∈ F，∀|x - y| < δ，|f(x) - f(y)| < ε。", "一致有界：∃M，∀f ∈ F，sup_x |f(x)| ≤ M。", "定理：K 紧，F ⊂ C(K) 相对紧（任意序列有一致收敛子列）⇔ F 一致有界且等度连续。", "充分条件：|f'| ≤ L 对一切 f ∈ F ⇒ 等度 Lipschitz ⇒ 等度连续。", "推广：K 紧、目标为完备度量空间时结论仍成立；非紧域需改用内闭一致收敛版本。"],
        theorems: ["两个条件缺一即失效：f_n(x) = x^n 一致有界但不等度连续；f_n(x) = n 等度连续但不一致有界。", "无穷维空间中有界闭集一般不紧，Arzelà-Ascoli 提供了替代的紧性来源，是 ODE 存在性（Peano 定理）与变分法紧性论证的基础。", "等度连续可由导数一致有界、Hölder 一致有界或 Sobolev 嵌入（紧嵌入）获得。", "该定理是 Montel 定理（全纯函数正规族）在实分析中的对应版本，后者用局部一致有界即可推出等度连续（Cauchy 估计）。"],
        generalRequirements: ["必须同时验证一致有界与等度连续，并确认定义域紧。", "结论只给出子列一致收敛，不能断言整列收敛。"],
        forbiddenErrors: ["【单条件套用】只验证一致有界或只验证等度连续。", "【等度与逐点连续混淆】用每个 f 连续代替族的等度连续（δ 必须与 f 无关）。", "【整列收敛】断言全序列一致收敛而非子列。", "【非紧定义域】在无界域上直接套用而不改用内闭版本。"],
        parameterConstraints: { compactDomain: "定义域需紧（否则用内闭一致收敛版本）。", uniformityInFamily: "δ 与 M 必须对族中一切函数统一。", conclusionScope: "结论为存在一致收敛子列。" },
        closureChecks: ["验证一致有界常数 M 与等度连续的 δ(ε) 均与 f 无关。", "确认定义域紧或改用逐个紧子集抽取子列。", "把结论正确表述为子列一致收敛。"],
        scenarioChecks: { odeExistence: ["Peano 存在性定理用等度 Lipschitz 的逼近解族抽取收敛子列。"], variationalCompactness: ["极小化序列的紧性由导数一致有界给出。"], normalFamilyAnalogue: ["全纯函数族改用 Montel 定理，由局部有界得等度连续。"] },
    },
    // Stone-Weierstrass 定理。
    "stone-weierstrass-theorem": {
        definitions: ["Stone-Weierstrass 定理刻画 C(K) 中稠密子代数的条件，把 Weierstrass 多项式逼近定理推广到一般紧空间与一般函数代数。"],
        formulas: ["Weierstrass 原始形式：多项式在 C[a,b] 中按上确界范数稠密。", "实形式：K 紧 Hausdorff，A ⊂ C(K,R) 为子代数、含常数、点分离 ⇒ A 在 C(K) 中稠密。", "复形式：还需 A 对共轭封闭（自共轭），否则结论失效。", "三角形式：三角多项式在 C(T)（周期连续函数）中稠密。", "构造性证明：Bernstein 多项式 B_n f(x) = ∑_k f(k/n) C(n,k) x^k (1-x)^{n-k} 一致收敛到 f。"],
        theorems: ["点分离与含常数缺一不可：偶函数代数不能分离 x 与 -x，无常数的代数不能逼近非零常数。", "复情形反例：圆盘上的全纯多项式代数点分离且含常数，但在 C(D̄) 中不稠密（极限必全纯），说明自共轭条件必需。", "定理给出稠密性但不给出逼近速度；速度由函数光滑性决定（Jackson 定理），最佳一致逼近的存在唯一性另由 Chebyshev 理论给出。", "该定理是 Fourier 级数完备性、矩问题唯一性与紧算子谱理论中函数演算的基础。"],
        generalRequirements: ["必须验证紧性、子代数结构、含常数与点分离；复值情形补验自共轭。", "结论是一致逼近的稠密性，不得强化为等式或逐点插值。"],
        forbiddenErrors: ["【点分离缺失】对不能区分两点的函数族断言稠密。", "【自共轭遗漏】在复值情形忽略共轭封闭条件。", "【非紧定义域】在 R 或开区间上断言多项式一致稠密（多项式在 R 上不能一致逼近有界函数）。", "【稠密当可达】把一致逼近说成存在多项式与 f 相等。", "【逼近速度臆断】未引用光滑性就断言收敛阶。"],
        parameterConstraints: { compactHausdorff: "K 需紧 Hausdorff。", algebraStructure: "A 对加法、数乘、乘法封闭且含常数函数。", separationAndConjugation: "点分离必需；复值情形还需自共轭。" },
        closureChecks: ["逐条核对紧性、代数封闭性、含常数、点分离（复情形加自共轭）。", "把结论写成任意 ε 下的一致逼近而非等式。", "如需逼近速度，另引 Jackson 型定理并说明光滑性假设。"],
        scenarioChecks: { polynomialApproximation: ["用 Bernstein 多项式给出显式一致逼近。"], trigonometricDensity: ["周期函数用三角多项式稠密性讨论 Fourier 逼近。"], holomorphicCounterexample: ["用全纯多项式代数说明自共轭条件不可省。"] },
    },
    // 多元极限的路径无关性判据。
    "multivariable-limit-path-independence": {
        definitions: ["多元函数的重极限要求沿定义域内一切趋近方式取同一值，与累次极限和方向极限均不等价。"],
        formulas: ["定义：∀ε > 0 ∃δ > 0，0 < ‖(x,y) - (a,b)‖ < δ ⇒ |f(x,y) - L| < ε。", "极坐标判据：f(a + r cos θ, b + r sin θ) - L 的界与 θ 无关且随 r → 0 趋零 ⇒ 极限为 L。", "夹逼：|f - L| ≤ g(‖(x,y) - (a,b)‖) 且 g(r) → 0。", "标准反例：f = xy/(x^2 + y^2) 沿一切直线极限为 0（y = kx 得 k/(1+k^2)，非零）；f = x^2 y/(x^4 + y^2) 沿一切直线为 0 但沿 y = x^2 为 1/2。", "累次极限：lim_x lim_y f 与 lim_y lim_x f 存在且相等仍不能推出重极限存在。"],
        theorems: ["重极限存在 ⇒ 一切方向极限与累次极限存在且相等；反向蕴含全部不成立，故只能用路径法否证、用 ε-δ/夹逼/极坐标证明。", "否证只需两条趋近路径给出不同极限，直线不够时需用抛物线、指数曲线等高阶路径。", "极坐标法必须给出与 θ 一致的估计，若界依赖 θ 则不能断言极限存在。", "连续性与偏导存在互不蕴含：偏导可在一点存在而函数不连续，故不能用偏导存在推极限存在。"],
        generalRequirements: ["证明极限存在必须给出与方向无关的统一估计。", "否证必须给出两条具体路径及其不同极限值。"],
        forbiddenErrors: ["【有限路径证存在】只验证若干直线或坐标轴路径就断言极限存在。", "【累次极限代替重极限】用两个累次极限相等断言重极限存在。", "【极坐标估计含 θ】保留依赖 θ 的界仍断言趋零。", "【路径阶数不足】仅用直线路径检验需高阶曲线才暴露的反例。", "【偏导推连续】由偏导存在断言极限存在或函数连续。"],
        parameterConstraints: { deletedNeighborhood: "在去心邻域内考察且需保证该邻域含于定义域。", uniformInDirection: "估计必须对一切方向一致。", pathFamily: "否证所用路径必须落在定义域内并趋于该点。" },
        closureChecks: ["若断言存在，给出 ε-δ、夹逼或与 θ 无关的极坐标估计。", "若断言不存在，写出两条路径及各自极限。", "检查是否误用累次极限或方向极限作为充分条件。"],
        scenarioChecks: { nonexistenceViaPaths: ["用 y = kx 与 y = x^2 类路径给出不同极限。"], polarBoundEstimate: ["用 r 的单调界给出与角度无关的一致估计。"], continuityAtOrigin: ["讨论分段定义函数在原点的连续性并区分偏导存在性。"] },
    },




};
