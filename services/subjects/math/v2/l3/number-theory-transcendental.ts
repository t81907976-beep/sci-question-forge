import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数论-超越数论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMBER_THEORY_TRANSCENDENTAL_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Liouville 判据：逼近过好 ⇒ 超越。
    "liouville-approximation": {
        id: "liouville-approximation", l2Key: "number-theory-transcendental", name: "Liouville 超越性判据", kind: "criterion",
        aliases: ["Liouville逼近定理", "Liouville数", "Liouville不等式", "逼近判据"],
    },
    // Hermite-Lindemann：e^α 的超越性。
    "hermite-lindemann": {
        id: "hermite-lindemann", l2Key: "number-theory-transcendental", name: "Hermite-Lindemann 定理", kind: "theorem",
        aliases: ["Hermite-Lindemann", "e的超越性", "π的超越性", "e^α超越"],
    },
    // Lindemann-Weierstrass：指数的线性无关性。
    "lindemann-weierstrass": {
        id: "lindemann-weierstrass", l2Key: "number-theory-transcendental", name: "Lindemann-Weierstrass 定理", kind: "theorem",
        aliases: ["Lindemann-Weierstrass", "指数代数无关", "e^{α_i}线性无关"],
    },
    // Gelfond-Schneider：Hilbert 第七问题。
    "gelfond-schneider": {
        id: "gelfond-schneider", l2Key: "number-theory-transcendental", name: "Gelfond-Schneider 定理", kind: "theorem",
        aliases: ["Gelfond-Schneider", "Hilbert第七问题", "α^β超越", "2^√2"],
    },
    // Baker 定理：对数线性型下界。
    "baker-linear-forms-logs": {
        id: "baker-linear-forms-logs", l2Key: "number-theory-transcendental", name: "Baker 对数线性型定理", kind: "theorem",
        aliases: ["Baker定理", "对数线性型", "linear forms in logarithms", "有效下界"],
    },
    // Schmidt 子空间定理。
    "schmidt-subspace-theorem": {
        id: "schmidt-subspace-theorem", l2Key: "number-theory-transcendental", name: "Schmidt 子空间定理", kind: "theorem",
        aliases: ["Schmidt子空间定理", "subspace theorem", "同时逼近", "Roth高维推广"],
    },
    // 代数无关性：Nesterenko 定理。
    "nesterenko-algebraic-independence": {
        id: "nesterenko-algebraic-independence", l2Key: "number-theory-transcendental", name: "Nesterenko 代数无关性定理", kind: "theorem",
        aliases: ["Nesterenko定理", "代数无关", "π与e^π", "模函数超越性"],
    },
    // 超越性度量：Mahler 分类与逼近指数。
    "mahler-classification": {
        id: "mahler-classification", l2Key: "number-theory-transcendental", name: "Mahler 分类与超越性度量", kind: "criterion",
        aliases: ["Mahler分类", "S数T数U数", "超越性度量", "无理性度量"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMBER_THEORY_TRANSCENDENTAL_L3_RULES: Record<string, MathV2L3Rules> = {
    // Liouville 判据：逼近指数超过次数 ⇒ 超越。
    "liouville-approximation": {
        definitions: ["Liouville 判据由「代数数不能被有理数逼近得太好」的下界反推超越性：逼近速度快于任何 q^{-d} 的实数必为超越数。"],
        formulas: ["Liouville 不等式：α 代数、deg α = d ≥ 2 ⇒ 存在 c(α) > 0 使 |α - p/q| > c(α)/q^d 对一切有理 p/q 成立。", "Liouville 判据：若对每个 n 存在既约 p/q（q > 1）使 |α - p/q| < 1/q^n，则 α 超越。", "Liouville 数示例：ℓ = ∑_{k≥1} 10^{-k!}，截断给出 |ℓ - p/q| < q^{-n} 的无穷多逼近。", "常数来源：c(α) 由极小多项式 f 的导数界 |f'| 与 f(p/q) ≠ 0 且 |f(p/q)| ≥ q^{-d} 给出。"],
        theorems: ["Liouville 定理：代数无理数的逼近指数 μ(α) ≤ d = deg α（Roth 后加强为 μ = 2）。", "Liouville 数全体构成零测但稠密的 G_δ 集，Hausdorff 维数为 0。", "Liouville 判据只是充分条件：e、π 均非 Liouville 数（μ = 2 或有限），却仍超越。"],
        generalRequirements: ["构造超越数时必须验证逼近不等式对所有 n 成立，且分母 q 随 n 增大。", "使用 Liouville 不等式必须指明极小多项式次数 d 与常数 c 的来源。"],
        forbiddenErrors: ["【必要性误设】由「不是 Liouville 数」断言代数（e、π 为反例）。", "【常数与 α 无关】把 c(α) 当作绝对常数使用。", "【有限多个逼近】只给出有限组好逼近就断言超越。", "【次数误用】对 d = 1（有理数）套用不等式或忽略 f(p/q) ≠ 0 的验证。"],
        parameterConstraints: { degreeCondition: "Liouville 不等式要求 deg α = d ≥ 2（α 无理）。", constantDependence: "c(α) 依赖 α 的极小多项式，不可统一取定。", denominatorGrowth: "判据要求 q ≥ 2 且随 n 可任意大。" },
        closureChecks: ["核对逼近不等式的量词（对每个 n 存在 p/q）。", "验证分母增长与既约性。", "指明结论方向：仅由「逼近过好」推超越，不可反推。"],
        scenarioChecks: { explicitTranscendentalConstruction: ["用 ∑ 10^{-k!} 或快速增长部分商的连分数构造具体超越数。"], irrationalityMeasureBound: ["由 Liouville 不等式给出代数数无理性度量的初等上界。"], contrastWithRoth: ["Roth 定理把指数从 d 降到 2，构造 Liouville 数时须用远超 2 的指数。"] },
    },
    // Hermite-Lindemann：α ≠ 0 代数 ⇒ e^α 超越。
    "hermite-lindemann": {
        definitions: ["Hermite-Lindemann 定理断言非零代数数的指数值必为超越数，由此一举得到 e 与 π 的超越性以及对数、三角函数在代数点的超越性。"],
        formulas: ["Hermite-Lindemann：α 代数且 α ≠ 0 ⇒ e^α 超越。", "推论（e）：取 α = 1 得 e 超越。", "推论（π）：若 π 代数则 iπ 代数，但 e^{iπ} = -1 代数，矛盾，故 π 超越。", "推论（对数）：β 代数、β ∉ {0,1} ⇒ ln β 超越；同理 α ≠ 0 代数 ⇒ sin α、cos α、tan α 超越。"],
        theorems: ["Hermite-Lindemann 定理成立，是 Lindemann-Weierstrass 的 n = 1 情形。", "等价形式：若 α ≠ 0 与 e^α 同时代数则矛盾，即 (α, e^α) 中至多一个代数。", "几何推论：化圆为方不可能（π 超越 ⇒ π 非规矩数）。"],
        generalRequirements: ["必须排除 α = 0（e^0 = 1 代数）。", "推论到对数与三角函数时必须核对所取代数数不落在退化点（如 ln 1 = 0）。"],
        forbiddenErrors: ["【零点漏排】对 α = 0 断言 e^α 超越。", "【超越指数误推】对 α 超越断言 e^α 超越（如 e^{ln 2} = 2）。", "【π 超越性循环论证】用 π 超越来证 e^{iπ} 关系而非反向。", "【三角函数退化点】对 sin 0、cos 0 等断言超越。"],
        parameterConstraints: { nonzeroAlgebraic: "要求 α ∈ \\bar{Q}，α ≠ 0。", complexAllowed: "α 可为复代数数（如 iπ 的论证需要复情形）。", logarithmBranch: "对数推论需固定分支且 β ≠ 0, 1。" },
        closureChecks: ["确认 α 代数且非零（给出极小多项式或代数性理由）。", "结论只断言 e^α 超越，不涉及代数无关性。", "若用于反证（如 π），核对代数封闭性的每一步。"],
        scenarioChecks: { transcendenceOfEAndPi: ["e、π 超越性的标准证明路径。"], geometricConstructions: ["尺规作图不可能性（化圆为方）由 π 超越给出。"], logTrigValues: ["证明 ln 2、sin 1 等具体常数超越。"] },
    },
    // Lindemann-Weierstrass：指数值的代数无关性。
    "lindemann-weierstrass": {
        definitions: ["Lindemann-Weierstrass 定理把 Hermite-Lindemann 提升到多点情形：代数数在 Q 上线性无关时，其指数值在 \\bar{Q} 上代数无关。"],
        formulas: ["定理（代数无关形式）：α_1, ..., α_n 代数且在 Q 上线性无关 ⇒ e^{α_1}, ..., e^{α_n} 在 \\bar{Q} 上代数无关。", "等价（线性无关形式）：α_1, ..., α_n 代数且互不相同 ⇒ e^{α_1}, ..., e^{α_n} 在 \\bar{Q} 上线性无关。", "推论：∑ β_i e^{α_i} = 0（β_i 代数不全为零，α_i 代数互异）不可能。", "超越次数：trdeg_Q Q(e^{α_1}, ..., e^{α_n}) = n。"],
        theorems: ["Lindemann-Weierstrass 定理成立；n = 1 退化为 Hermite-Lindemann。", "两种表述（代数无关/线性无关）等价，转换需注意前提从「线性无关」变为「互异」。", "Baker 给出的推广：把系数放宽到代数数并处理对数情形；Schanuel 猜想是其统一猜测形式（未证）。"],
        generalRequirements: ["使用代数无关形式必须验证 α_i 在 Q 上线性无关（不只是互异）。", "使用线性无关形式必须验证 α_i 互不相同。"],
        forbiddenErrors: ["【两版本前提互换】用「互异」推代数无关，或用「线性无关」推线性无关结论。", "【系数域越界】允许超越系数 β_i（结论失效）。", "【Schanuel 猜想当定理】用 Schanuel 猜想推 e + π 超越等未证结论。", "【指数为超越数】对 α_i 超越套用定理。"],
        parameterConstraints: { algebraicExponents: "所有 α_i ∈ \\bar{Q}。", linearIndependenceOverQ: "代数无关结论要求 {α_i} 在 Q 上线性无关。", algebraicCoefficients: "线性组合的系数必须为代数数。" },
        closureChecks: ["明确使用的是代数无关版本还是线性无关版本，并核对对应前提。", "检查系数与指数均在 \\bar{Q} 内。", "若结论涉及 e + π、eπ 等，指出这属于 Schanuel 猜想范围而非已证。"],
        scenarioChecks: { algebraicIndependenceOfExponentials: ["证明 e、e^{√2}、e^{√3} 等代数无关。"], nonvanishingExponentialSums: ["排除代数系数指数和为零，用于微分方程与差分方程解的超越性。"], schanuelBoundary: ["区分已证结论（Lindemann-Weierstrass）与猜想（Schanuel）。"] },
    },
    // Gelfond-Schneider：α^β 的超越性。
    "gelfond-schneider": {
        definitions: ["Gelfond-Schneider 定理解决 Hilbert 第七问题：代数底的代数无理次幂必超越，等价于两个对数之比若无理则超越。"],
        formulas: ["定理：α 代数、α ∉ {0,1}，β 代数无理 ⇒ α^β 超越（取定 α^β = e^{β ln α} 的任一分支）。", "对数比形式：ln α_1 / ln α_2（α_i 代数非零）若无理则超越。", "示例：2^{√2}、i^i = e^{-π/2}、e^π = (-1)^{-i} 均超越。", "两对数线性型：等价于「β_1 ln α_1 + β_2 ln α_2 ≠ 0 当 ln α_i 在 \\bar{Q} 上线性无关」的定量版本 n = 2 情形。"],
        theorems: ["Gelfond-Schneider 定理成立，是 Baker 定理在两个对数时的特例。", "结论对任意分支成立：所有 α^β 的值同时超越。", "反例边界：β 有理时 α^β 代数（如 2^{1/2}）；α = 1 或 0 时退化。"],
        generalRequirements: ["必须核对 α ≠ 0, 1 且 β 代数无理（有理 β 结论失效）。", "复情形须说明取的对数分支不影响超越性结论。"],
        forbiddenErrors: ["【有理指数误用】对 β ∈ Q 断言 α^β 超越。", "【底数退化漏排】允许 α = 1（1^β = 1）或 α = 0。", "【超越指数误推】对 β 超越套用定理（如 2^{log_2 3} = 3）。", "【分支歧义误判】声称仅某个分支超越、其他分支可能代数。"],
        parameterConstraints: { baseCondition: "α ∈ \\bar{Q}，α ≠ 0 且 α ≠ 1。", exponentCondition: "β ∈ \\bar{Q} 且 β ∉ Q。", branchIndependence: "结论对 α^β 的所有取值成立。" },
        closureChecks: ["核对底数与指数的代数性与非退化条件。", "指数须验证无理性（给出极小多项式次数 ≥ 2 或无理性证明）。", "若目标是 e^π、i^i 等，写出化为 α^β 的具体表示。"],
        scenarioChecks: { hilbertSeventhProblem: ["2^{√2}、e^π 超越性的标准结论。"], logarithmRatios: ["判断 log_2 3 等对数比的超越性（无理 ⇒ 超越）。"], bakerGeneralization: ["超过两个对数时须改用 Baker 定理。"] },
    },
    // Baker 定理：对数线性型的有效下界。
    "baker-linear-forms-logs": {
        definitions: ["Baker 定理给出代数数对数的线性型的非零性与有效下界，是超越数论中唯一能产出显式解界的核心工具，广泛用于丢番图方程的有效解决。"],
        formulas: ["非零性：ln α_1, ..., ln α_n 在 Q 上线性无关 ⇒ 1, ln α_1, ..., ln α_n 在 \\bar{Q} 上线性无关。", "超越性推论：β_0 + β_1 ln α_1 + ... + β_n ln α_n ≠ 0（β_i 代数不全为零，α_i 代数非零）。", "有效下界（Baker-Wüstholz）：Λ = ∑ b_i ln α_i ≠ 0 ⇒ |Λ| > exp(-C(n, d) · h(α_1) ... h(α_n) · log B)，B = max |b_i|。", "乘性形式：|α_1^{b_1} ... α_n^{b_n} - 1| 的下界，用于 S-单位方程。"],
        theorems: ["Baker 定理（1966，Fields 奖工作）：上述非零性与有效下界成立，n = 2 退化为 Gelfond-Schneider。", "有效性：常数 C(n, d) 可显式计算，故能给出丢番图方程解高度的显式上界并配合规约（LLL）穷尽求解。", "应用：Thue 方程、Mordell 方程 y^2 = x^3 + k、Catalan 型方程、类数一问题（虚二次域 d = 163 结束）均获有效解决。"],
        generalRequirements: ["使用有效下界必须给出各 α_i 的高度与次数，常数依赖必须写明。", "必须先验证线性型非零（Λ ≠ 0），否则下界无意义。"],
        forbiddenErrors: ["【非零性未验】直接对可能为零的线性型套用下界。", "【常数含糊】声称有效但不给出对 n、d、高度的依赖。", "【与非有效定理混用】把 Roth/Schmidt 的非有效结论当作可给显式界。", "【高度定义混乱】混用绝对对数高度与朴素高度而不换算。"],
        parameterConstraints: { algebraicInputs: "α_i ∈ \\bar{Q}^*，系数 b_i ∈ Z（或代数数版本 β_i ∈ \\bar{Q}）。", heightDependence: "下界依赖各 α_i 的绝对对数高度 h(α_i) 与域次数 d。", nonvanishing: "要求 Λ ≠ 0，通常由线性无关性保证。" },
        closureChecks: ["确认线性型非零及其理由。", "列出所有 α_i 的次数与高度，写清常数依赖。", "若要求解方程，说明如何由上界配合规约完成穷举。"],
        scenarioChecks: { thueAndMordellEquations: ["由 Baker 界给出整数解高度上界，再用 LLL 规约穷举。"], classNumberOneProblem: ["虚二次域类数一的有效解决依赖三对数线性型下界。"], sUnitEquations: ["乘性形式用于 S-单位方程与递推序列的完全平方项判定。"] },
    },
    // Schmidt 子空间定理：Roth 的高维推广。
    "schmidt-subspace-theorem": {
        definitions: ["Schmidt 子空间定理把 Roth 定理推广到高维同时逼近：满足强逼近条件的整点只能落在有限多个真线性子空间中，是现代丢番图几何的基本工具。"],
        formulas: ["子空间定理：L_1, ..., L_n 为 \\bar{Q} 系数的线性无关线性型，∀ε > 0，则 ∏_{i=1}^n |L_i(x)| < ‖x‖^{-ε} 的整点 x ∈ Z^n 落在有限多个真子空间的并中。", "同时逼近版本：α_1, ..., α_m 代数且 1, α_1, ..., α_m 在 Q 上线性无关 ⇒ max_i |α_i - p_i/q| < q^{-1-1/m-ε} 只有有限多解。", "推广（Schlickewei）：加入有限多个素位的 p-adic 绝对值，得 S-单位方程有限性。", "n = 2 情形退化为 Roth 定理。"],
        theorems: ["Schmidt 子空间定理成立，结论是「有限多个例外子空间」而非「有限多个解」。", "非有效性：子空间的个数可界，但其显式列表与解的高度界不可有效给出。", "核心应用：S-单位方程 u + v = 1 的解有限、递推序列的零点与整值问题、Vojta 型高维推广、整点在代数簇上的稀疏性。"],
        generalRequirements: ["必须验证线性型的线性无关性与系数代数性。", "结论只能表述为「落在有限多个真子空间中」，不得直接说解有限。"],
        forbiddenErrors: ["【结论强化】把「有限多个子空间」误述为「有限多组解」。", "【有效性误设】声称可显式列出所有例外子空间或给出解的高度界。", "【线性无关缺失】对线性相关的线性型套用定理。", "【维数退化误用】n = 1 或忽略 1 与 α_i 的线性无关前提。"],
        parameterConstraints: { algebraicCoefficients: "线性型系数须在 \\bar{Q} 中，且线性型线性无关。", epsilonPositive: "ε > 0 任意，子空间个数依赖 ε 与线性型。", properSubspaces: "例外集为有限多个 Q 上真子空间。" },
        closureChecks: ["核对线性型个数、线性无关性与系数域。", "确认结论表述为例外子空间有限。", "若需有效结果，改用 Baker 型方法。"],
        scenarioChecks: { sUnitEquationFiniteness: ["u + v = 1 在 S-单位群中解有限，由子空间定理得出。"], recurrenceSequenceZeros: ["线性递推序列取定值/完全幂的有限性论证。"], integralPointsOnVarieties: ["高维整点稀疏性与 Vojta 猜想框架下的应用。"] },
    },
    // Nesterenko：模函数与 π、e^π 的代数无关性。
    "nesterenko-algebraic-independence": {
        definitions: ["Nesterenko 定理通过 Eisenstein 级数 E_2、E_4、E_6 在代数点的值给出代数无关性结果，直接推出 π、e^π、Γ(1/4) 的代数无关性。"],
        formulas: ["Nesterenko 定理（1996）：0 < |q| < 1 且 q 代数 ⇒ E_2(q)、E_4(q)、E_6(q) 中至少三个数 q, E_2, E_4, E_6 里有 3 个代数无关，即 trdeg_Q Q(q, E_2(q), E_4(q), E_6(q)) ≥ 3。", "推论：q = e^{-2π} 时得 π、e^π、Γ(1/4) 在 Q 上代数无关。", "对照 Gelfond：π 与 e^π 的代数无关性此前仅知超越性单项结论。", "超越次数下界是此类定理的标准表述形式（trdeg ≥ k）。"],
        theorems: ["Nesterenko 定理成立，方法为模函数的微分方程（Ramanujan 恒等式）加多重变量消去理论。", "Chudnovsky 先前结果：Γ(1/4) 与 π 代数无关（弱于 Nesterenko 的三元结论）。", "限度：e + π、eπ 是否超越仍未知（属 Schanuel 猜想范围），Nesterenko 方法不覆盖。"],
        generalRequirements: ["表述代数无关性必须给出超越次数下界与具体生成元集合。", "涉及 Γ 函数特殊值必须限定为 1/4、1/3 等已知情形。"],
        forbiddenErrors: ["【猜想当定理】用 Schanuel 猜想断言 e + π 超越或 e 与 π 代数无关。", "【超越次数误报】把 trdeg ≥ 3 说成 = 3 或对四元组全体断言代数无关。", "【Γ 值越界】对 Γ(1/5) 等尚未解决的值断言代数无关。", "【E_2 归一化混乱】使用 Eisenstein 级数时不声明 q = e^{2πiτ} 与权/归一化约定。"],
        parameterConstraints: { algebraicQ: "要求 q ∈ \\bar{Q} 且 0 < |q| < 1。", transcendenceDegree: "结论为超越次数下界 3。", knownGammaValues: "Γ 特殊值结论限于 1/4（及 1/3 的类似结果）。" },
        closureChecks: ["核对 q 的代数性与 |q| < 1。", "确认结论写成超越次数下界形式。", "若涉及 e 与 π 的联合关系，指出属未解决问题。"],
        scenarioChecks: { piAndEpiIndependence: ["π 与 e^π 代数无关的标准引用。"], gammaSpecialValues: ["Γ(1/4)、Γ(1/3) 超越性与代数无关性结论。"], schanuelBoundary: ["明确区分已证（Nesterenko）与猜想（Schanuel）。"] },
    },
    // Mahler 分类与超越性度量。
    "mahler-classification": {
        definitions: ["Mahler 分类按整系数多项式在给定点取小值的能力把复数分为 A、S、T、U 四类，并以超越性度量（逼近函数的量化上下界）刻画超越的「强弱」。"],
        formulas: ["定义 w_n(α) = 逼近指数：|P(α)| < H(P)^{-w_n(α)} 对无穷多个 deg ≤ n 的整系数 P 成立；w(α) = limsup_n w_n(α)/n。", "分类：A 类 w = 0（代数数）；S 类 w < ∞ 且各 w_n 有界；T 类 w_n 有限但无界；U 类 某个 w_n = ∞。", "U 类含 Liouville 数（w_1 = ∞）；e 属 S 类（w_n(e) 有显式界）；T 类由 Schmidt 首次构造非空。", "无理性度量：μ(α) 使 |α - p/q| > q^{-μ} 对 q 充分大成立，如 μ(π) 的当前最好上界为有限显式值。"],
        theorems: ["几乎所有实数（Lebesgue 意义）属 S 类且 w_n = n（Sprindžuk 证明的 Mahler 猜想）。", "Koksma 分类（用代数数逼近的 w_n^*）与 Mahler 分类等价到类划分层面。", "U 类中按 w_n = ∞ 的最小 n 可再细分（U_m 类），代数数的逼近由 Wirsinger/Schmidt 型结果控制。"],
        generalRequirements: ["给出超越性度量必须写明是关于多项式高度还是有理逼近，并声明量词（无穷多/充分大）。", "断言类别归属必须给出对应 w_n 的界或已知定理引用。"],
        forbiddenErrors: ["【度量与分类混淆】用无理性度量 μ 直接断言 Mahler 类别。", "【几乎处处误推个例】由「几乎所有为 S 类」断言 π 为 S 类（π 的类别未知）。", "【高度定义不一致】混用多项式朴素高度与 Mahler 度量而不换算。", "【U 类误判】把逼近较好的数直接归入 U 类而不验证 w_n = ∞。"],
        parameterConstraints: { polynomialHeight: "H(P) 为整系数多项式的高度，须固定定义。", degreeIndex: "w_n 依赖多项式次数上界 n。", quantifierConvention: "w_n 用 limsup 与「无穷多 P」定义；无理性度量用「q 充分大」。" },
        closureChecks: ["核对所用度量的定义（Mahler w_n / Koksma w_n^* / 无理性度量 μ）。", "给出类别归属的依据或说明尚未确定。", "区分几乎处处结论与具体常数结论。"],
        scenarioChecks: { liouvilleNumbersAsU: ["Liouville 数属 U_1 类，用 w_1 = ∞ 判定。"], measureOfIrrationality: ["引用 π、ln 2、ζ(3) 等常数无理性度量的显式上界。"], typicalRealNumbers: ["随机实数几乎必属 S 类且 w_n = n。"] },
    },
};
