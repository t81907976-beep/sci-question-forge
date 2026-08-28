import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“泛函分析-Banach空间理论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const FUNCTIONAL_BANACH_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 线性泛函的保范延拓与凸集分离。
    "banach-hahn-banach-extension": {
        id: "banach-hahn-banach-extension", l2Key: "functional-banach", name: "Hahn-Banach 延拓与分离定理", kind: "theorem",
        aliases: ["Hahn-Banach定理", "保范延拓", "凸集分离", "次线性控制"],
    },
    // 由 Baire 纲性质得到的算子族有界性。
    "banach-uniform-boundedness": {
        id: "banach-uniform-boundedness", l2Key: "functional-banach", name: "一致有界原理", kind: "theorem",
        aliases: ["一致有界原理", "Banach-Steinhaus定理", "点态有界推一致有界"],
    },
    // 开映射、有界逆与闭图像三者的等价链条。
    "banach-open-mapping-closed-graph": {
        id: "banach-open-mapping-closed-graph", l2Key: "functional-banach", name: "开映射定理与闭图像定理", kind: "theorem",
        aliases: ["Banach开映射定理", "闭图像定理", "有界逆定理"],
    },
    // 对偶空间的具体表示与共轭算子性质。
    "banach-dual-space-and-adjoint": {
        id: "banach-dual-space-and-adjoint", l2Key: "functional-banach", name: "对偶空间与共轭算子", kind: "object",
        aliases: ["对偶空间", "共轭算子", "L^p对偶", "范数对偶公式"],
    },
    // 弱拓扑、弱星拓扑与对偶球紧性。
    "banach-weak-topology-alaoglu": {
        id: "banach-weak-topology-alaoglu", l2Key: "functional-banach", name: "弱拓扑与 Banach-Alaoglu 定理", kind: "theorem",
        aliases: ["弱拓扑", "弱星拓扑", "Banach-Alaoglu定理", "对偶单位球紧性"],
    },
    // 自反性的判据、反例与与弱紧性的联系。
    "banach-reflexivity-criteria": {
        id: "banach-reflexivity-criteria", l2Key: "functional-banach", name: "自反性判据", kind: "criterion",
        aliases: ["自反空间", "James定理", "弱紧单位球", "典范嵌入满射"],
    },
    // 紧凸集由极点凸包恢复的表示定理。
    "banach-krein-milman-extreme-points": {
        id: "banach-krein-milman-extreme-points", l2Key: "functional-banach", name: "Krein-Milman 极点定理", kind: "theorem",
        aliases: ["Banach空间Krein-Milman定理", "紧凸集极点", "凸包闭包表示"],
    },
    // Riesz 引理与有限维空间的紧性刻画。
    "banach-riesz-lemma-finite-dimension": {
        id: "banach-riesz-lemma-finite-dimension", l2Key: "functional-banach", name: "Riesz 引理与有限维刻画", kind: "lemma",
        aliases: ["Riesz引理", "单位球紧性", "有限维等价范数"],
    },
    // Hilbert 空间的正交投影与泛函表示。
    "banach-hilbert-projection-riesz-representation": {
        id: "banach-hilbert-projection-riesz-representation", l2Key: "functional-banach", name: "Hilbert 空间投影与 Riesz 表示", kind: "theorem",
        aliases: ["正交投影", "Riesz表示定理", "闭凸集最近点", "正交补分解"],
    },
    // Schauder 基、可分性与基展开的收敛性。
    "banach-schauder-basis-separability": {
        id: "banach-schauder-basis-separability", l2Key: "functional-banach", name: "Schauder 基与可分性", kind: "object",
        aliases: ["Schauder基", "可分Banach空间", "基常数", "Enflo反例"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const FUNCTIONAL_BANACH_L3_RULES: Record<string, MathV2L3Rules> = {
    // Hahn-Banach：保范延拓与凸集分离的统一形式。
    "banach-hahn-banach-extension": {
        definitions: ["次线性函数 p：满足 p(x+y) <= p(x)+p(y) 与 p(tx) = t p(x)（t >= 0）", "支撑泛函：在给定点取到范数的泛函", "分离：存在泛函 f 与常数 c 使一集上 f <= c 而另一集上 f >= c"],
        formulas: ["延拓形式：Y subset X 子空间，f in Y^* => 存在 F in X^* 使 F|_Y = f 且 ||F|| = ||f||", "控制形式：f <= p 于 Y => 存在延拓 F <= p 于 X", "第一几何形式：A 开凸、B 凸、A cap B 空 => 存在闭超平面分离", "第二几何形式：A 闭凸、B 紧凸、不交 => 存在严格分离"],
        theorems: ["Hahn-Banach 延拓定理在实空间由 Zorn 引理证明，复空间需先处理实部；延拓一般不唯一", "推论：对任意 x != 0 存在 f 使 ||f|| = 1, f(x) = ||x||，故对偶空间非平凡且 ||x|| = sup_{||f||<=1} |f(x)|", "严格分离需一侧紧或内点条件，两个仅闭凸不交集在无穷维中可能无法严格分离", "延拓保范只对范数（或次线性泛函）控制成立，对一般非凸约束失效"],
        generalRequirements: ["延拓时必须写出被控制的次线性泛函或范数，并验证控制不等式在子空间上成立", "使用几何形式必须逐条确认开性、紧性与凸性", "复标量情形必须说明由实部延拓再复化的步骤"],
        forbiddenErrors: ["【唯一性误设】断言保范延拓唯一（仅在严格凸对偶等特殊情形成立）", "【凸性缺失】对非凸集使用分离定理", "【严格分离越界】两个闭凸不交集直接断言严格分离而无紧性或内点", "【控制条件失配】延拓后仍宣称满足原控制却未验证次线性性", "【线性性破坏】把延拓当作可任意指定值的构造，忽略线性约束"],
        parameterConstraints: { scalarField: "实空间直接适用；复空间需实部技巧", dominatingFunctional: "控制函数需次线性（含范数、半范数）", convexityRequirement: "几何形式要求集合凸", separationStrictness: "严格分离需一侧紧或开内点" },
        closureChecks: ["确认延拓所依赖的控制不等式已在子空间验证", "确认几何形式的开/闭/紧/凸条件逐条列出", "确认结论中范数是否保持", "确认未把非唯一延拓当作唯一对象使用"],
        scenarioChecks: { normAttainingFunctional: ["构造支撑泛函以证明 ||x|| = sup |f(x)|", "确认单位球上取上确界"], convexSeparationApplication: ["用于对偶性、最优性条件时确认凸性与内点", "确认分离超平面闭"], momentAndExtensionProblems: ["矩问题类延拓需给出次线性控制", "确认正性或序结构额外条件"] },
    },
    // 一致有界原理：点态有界推出范数一致有界。
    "banach-uniform-boundedness": {
        definitions: ["算子族 {T_i} subset B(X, Y)", "点态有界：对每个 x，sup_i ||T_i x|| < infinity", "一致有界：sup_i ||T_i|| < infinity"],
        formulas: ["结论：X 完备（Banach）+ 点态有界 => sup_i ||T_i|| < infinity", "推论（共鸣定理）：若 sup_i ||T_i|| = infinity，则存在 x 使 sup_i ||T_i x|| = infinity 的集合为稠密 G_delta", "弱收敛推论：x_n 弱收敛 => ||x_n|| 有界；T_n x -> Tx 点态 => T 有界且 ||T|| <= liminf ||T_n||"],
        theorems: ["Banach-Steinhaus 定理依赖定义域完备性（Baire 纲性质），值域完备性不必要", "完备性不可去：在不完备的赋范空间上存在点态有界但范数无界的算子族", "推论：点态极限算子有界，但一般不能断言 ||T_n - T|| -> 0（强收敛不推一致收敛）", "闭凸集与桶（barrel）语言下可推广到桶型空间"],
        generalRequirements: ["使用定理必须声明定义域为 Banach（或桶型）空间", "必须区分点态有界、一致有界与一致收敛三个层级", "由点态极限得到的算子必须单独说明有界性来源"],
        forbiddenErrors: ["【完备性缺失】在不完备赋范空间（如多项式空间）上套用一致有界原理", "【收敛层级混淆】由点态收敛断言算子范数收敛", "【范数极限误算】断言 ||T|| = lim ||T_n|| 而非仅 <= liminf", "【值域条件误加】要求值域完备作为前提", "【纲论跳步】直接由无界性断言处处发散而非稠密 G_delta"],
        parameterConstraints: { domainCompleteness: "定义域必须 Banach 或桶型", codomainRequirement: "值域只需赋范，无需完备", boundednessType: "结论为范数一致有界，非一致收敛", limitNormInequality: "||T|| <= liminf ||T_n||" },
        closureChecks: ["确认定义域完备性已声明", "确认结论表述为一致有界而非一致收敛", "确认极限算子范数用不等式而非等式", "确认反例类型（不完备空间）未被忽略"],
        scenarioChecks: { fourierSeriesDivergence: ["用共鸣定理构造发散点集", "确认 Dirichlet 核范数无界"], weakConvergenceBoundedness: ["由弱收敛推有界需 Banach 性", "确认使用典范嵌入到对偶的对偶"], operatorLimitBoundedness: ["点态极限算子有界性由定理给出", "确认不能得到范数收敛"] },
    },
    // 开映射定理与闭图像定理：完备性驱动的三个等价结论。
    "banach-open-mapping-closed-graph": {
        definitions: ["开映射：把开集映为开集", "闭图像：图 G(T) = {(x, Tx)} 在 X times Y 中闭", "有界逆：双射有界算子的逆仍有界"],
        formulas: ["开映射定理：T in B(X, Y) 满射，X、Y Banach => T 开，且存在 c > 0 使 B_Y(0, c) subset T(B_X(0,1))", "有界逆定理：T 双射有界 => T^{-1} 有界，即存在 c 使 ||Tx|| >= c ||x||", "闭图像定理：T 线性且图闭，X、Y Banach => T 有界"],
        theorems: ["三个定理在 Banach 空间上互相等价，均由 Baire 纲定理推出，两端完备性均不可省", "闭图像定理与连续性的区别：闭图像只要求 x_n -> x 且 Tx_n -> y 时 y = Tx，不要求先知 Tx_n 收敛", "推论：Banach 空间上两个可比范数若都完备则等价；商映射自动开", "对非完备空间反例存在，如微分算子在 C^1 与 C^0 范数下图闭但无界（定义域不完备）"],
        generalRequirements: ["必须验证两端完备性与算子的线性、满射或双射条件", "使用闭图像定理必须验证图闭而不是仅验证序列极限存在", "由开映射得到的下界估计必须写出常数存在性"],
        forbiddenErrors: ["【完备性缺失】对不完备的定义域或值域套用三定理", "【满射性缺失】未验证满射就断言开映射或下界估计", "【闭图像与连续混同】用图闭直接断言连续而不引用定理（或反用为定义）", "【逆有界误推】非双射情形断言逆算子存在且有界", "【范数等价滥用】对只有一个完备范数的情形断言范数等价"],
        parameterConstraints: { completenessBothSides: "X、Y 均需 Banach", surjectivityRequirement: "开映射定理需满射", bijectivityRequirement: "有界逆定理需双射", closedGraphCondition: "图在乘积拓扑下闭" },
        closureChecks: ["确认两端完备性", "确认满射或双射假设已验证", "确认闭图像验证覆盖了极限存在的全部情形", "确认下界常数或逆算子范数的存在性表述"],
        scenarioChecks: { normEquivalenceProof: ["两个完备可比范数用有界逆定理证等价", "确认恒等映射双射且有界"], quotientMapOpenness: ["商映射开性由定理给出", "确认子空间闭以保证商完备"], unboundedOperatorExample: ["微分算子说明定义域完备性必要", "确认其图闭"] },
    },
    // 对偶空间与共轭算子：具体表示与范数关系。
    "banach-dual-space-and-adjoint": {
        definitions: ["X^* = B(X, K) 为有界线性泛函空间，恒完备", "共轭（对偶）算子 T^*: Y^* -> X^* 由 (T^* g)(x) = g(Tx) 定义", "典范嵌入 J: X -> X^{**}，(Jx)(f) = f(x)"],
        formulas: ["范数公式：||x|| = sup_{||f|| <= 1} |f(x)|，||T^*|| = ||T||", "L^p 对偶：(L^p)^* = L^q，1/p + 1/q = 1，1 <= p < infinity（sigma 有限测度）；(L^infinity)^* 严格大于 L^1", "序列空间：(l^1)^* = l^infinity，(c_0)^* = l^1，(l^infinity)^* 非 l^1", "零化子关系：ker T^* = (im T)^perp，cl(im T) = (ker T^*)^perp"],
        theorems: ["X^* 总是 Banach 空间，即使 X 不完备；J 是等距嵌入但一般非满射", "Riesz 表示定理给出 (L^p)^* = L^q（p < infinity），p = infinity 情形失败", "C(K)^* 由 Riesz-Markov 定理表示为 Radon 测度空间", "T 满射 <=> T^* 有界下界（有限维直觉在无穷维需闭值域条件），闭值域定理给出精确等价"],
        generalRequirements: ["写出 L^p 对偶必须限制 p < infinity 并声明测度 sigma 有限", "使用 T^* 必须写清定义域与值域方向（反变）", "断言 X = X^{**} 必须验证自反性而非仅等距嵌入"],
        forbiddenErrors: ["【p 端点越界】断言 (L^infinity)^* = L^1", "【测度条件缺失】非 sigma 有限测度下套用 L^p 对偶表示", "【嵌入满射误设】把典范嵌入当作同构而不验证自反", "【共轭方向错】把 T^* 写成 X^* -> Y^*", "【值域闭性忽略】由 T^* 单射直接断言 T 满射"],
        parameterConstraints: { exponentRange: "L^p 对偶需 1 <= p < infinity", measureCondition: "需 sigma 有限（或更强）测度", adjointDirection: "T: X -> Y 则 T^*: Y^* -> X^*", canonicalEmbedding: "J 等距，满射当且仅当自反" },
        closureChecks: ["确认指数范围与测度条件", "确认共轭算子方向与范数等式", "确认自反性主张有独立依据", "确认零化子关系中闭包与正交补的位置正确"],
        scenarioChecks: { lpDualityUse: ["Hölder 配对给出泛函时确认共轭指数", "确认 p = infinity 例外"], measureRepresentation: ["C(K) 上泛函用 Radon 测度表示", "确认 K 紧 Hausdorff"], adjointSpectrum: ["用 T^* 分析值域闭性与可解性", "确认闭值域定理条件"] },
    },
    // 弱拓扑、弱星拓扑与 Banach-Alaoglu 紧性。
    "banach-weak-topology-alaoglu": {
        definitions: ["弱拓扑 sigma(X, X^*)：由全部 f in X^* 生成的最粗拓扑", "弱星拓扑 sigma(X^*, X)：X^* 上由 X 中点求值生成的拓扑", "弱收敛 x_n -> x：f(x_n) -> f(x) 对所有 f in X^*"],
        formulas: ["Banach-Alaoglu：X^* 的闭单位球在弱星拓扑下紧（依赖 Tychonoff 定理）", "Eberlein-Šmulian：Banach 空间的弱拓扑上紧与序列紧等价（弱拓扑的特殊现象）", "范数与弱极限：x_n 弱收敛 x => ||x|| <= liminf ||x_n||（范数弱下半连续）", "Mazur：凸集弱闭 <=> 强闭"],
        theorems: ["Banach-Alaoglu 对任意 Banach 空间成立，但闭单位球在弱星拓扑下一般不可度量化（X 不可分时）", "X 的闭单位球弱紧 <=> X 自反（Kakutani）；一般 Banach 空间的球不弱紧", "弱收敛不蕴含强收敛，范数可能严格损失（如 l^2 中标准基弱收敛到 0 而范数恒为 1）", "弱星拓扑在 X^* 上的有界集上可度量化当 X 可分"],
        generalRequirements: ["必须区分弱拓扑（X 上）与弱星拓扑（X^* 上），Alaoglu 只对后者给紧性", "由弱收敛推范数结论只能用下半连续不等式", "使用序列语言必须确认可分性或引用 Eberlein-Šmulian"],
        forbiddenErrors: ["【弱与弱星混用】断言 X 的单位球弱紧（需自反）", "【范数连续误设】认为弱收敛保持范数收敛", "【可度量化默认】在不可分空间的弱星球上使用序列收敛刻画", "【凸性遗漏】把任意强闭集当弱闭集（仅凸集成立）", "【紧性来源错】声称 Alaoglu 不依赖选择公理"],
        parameterConstraints: { topologyLocation: "Alaoglu 作用于对偶空间的弱星拓扑", reflexivityForWeakCompactness: "X 的球弱紧 <=> X 自反", separabilityForMetrizability: "弱星有界集可度量化需 X 可分", convexityForClosedness: "弱闭 = 强闭仅对凸集" },
        closureChecks: ["确认拓扑是弱还是弱星", "确认紧性结论对应的空间与球", "确认范数结论使用下半连续形式", "确认序列化论证的可分性或 Eberlein-Šmulian 依据"],
        scenarioChecks: { variationalMinimization: ["用弱紧性提取极小化序列的弱收敛子列", "确认自反性与泛函弱下半连续"], measureWeakStarLimits: ["测度空间中用弱星紧性取极限", "确认 C(K) 可分性"], counterexampleInL1: ["l^1 或 L^1 非自反，球不弱紧", "确认弱星紧性仍成立于其对偶"] },
    },
    // 自反性判据：典范嵌入满射与弱紧性的等价刻画。
    "banach-reflexivity-criteria": {
        definitions: ["自反：典范嵌入 J: X -> X^{**} 为满射（等距同构）", "James 泛函取值：每个泛函在单位球上取到范数", "弱紧生成与弱序列紧的相关刻画"],
        formulas: ["等价刻画：X 自反 <=> B_X 弱紧 <=> B_X 弱序列紧（Banach 空间）<=> X^* 自反", "James 定理：X 自反 <=> 每个 f in X^* 在 B_X 上取到范数（X 完备时）", "Milman-Pettis：一致凸 Banach 空间自反", "例：L^p、l^p（1 < p < infinity）与 Hilbert 空间自反；L^1、L^infinity、c_0、C[0,1] 非自反"],
        theorems: ["自反性由 J 的满射性定义，等距嵌入始终存在故不能作为判据", "自反空间的闭子空间与商空间仍自反；自反性不被同构以外的一般等价保持（但被同构保持）", "有限维空间恒自反；无穷维中一致凸（如 L^p, 1 < p < infinity）给出自反", "自反空间中每个有界序列有弱收敛子列，是变分法紧性论证的基础"],
        generalRequirements: ["断言自反必须给出满射性、弱紧性或一致凸等具体判据", "使用弱收敛子列提取必须先确认自反或改用弱星紧性", "区分自反与可分：两者互不蕴含"],
        forbiddenErrors: ["【嵌入等距误认】以 J 为等距断言自反", "【经典空间误判】称 L^1、L^infinity、c_0 或 C[0,1] 自反", "【子列提取无依据】在非自反空间中直接取弱收敛子列", "【可分性混淆】把可分性当作自反性的充分或必要条件", "【一致凸方向反用】由自反断言一致凸（反向不成立）"],
        parameterConstraints: { exponentRange: "l^p、L^p 自反仅当 1 < p < infinity", uniformConvexityDirection: "一致凸 => 自反，反向不成立", hereditaryProperties: "闭子空间、商、对偶均保持自反", completenessRequirement: "James 定理需空间完备" },
        closureChecks: ["确认自反性判据具体到满射、弱紧或一致凸之一", "确认所引经典空间的自反性判断正确", "确认弱收敛子列提取的依据", "确认自反与可分未被混用"],
        scenarioChecks: { calculusOfVariations: ["在自反空间中用有界序列的弱收敛子列", "确认能量泛函弱下半连续"], nonReflexiveWorkaround: ["L^1 情形改用测度弱星收敛或紧性补偿", "确认可能出现集中现象"], sobolevSpaceSetting: ["W^{1,p} 自反当 1 < p < infinity", "确认 p = 1 或 infinity 需另行处理"] },
    },
    // Krein-Milman：紧凸集由极点凸包闭包恢复。
    "banach-krein-milman-extreme-points": {
        definitions: ["极点：x in K 不能写成 K 中两个不同点的非平凡凸组合", "面（face）：K 的凸子集 F，使任何 K 中以 F 内点为凸组合的端点都落在 F", "凸包闭包 cl(conv(E))"],
        formulas: ["Krein-Milman：K 在局部凸 Hausdorff 空间中紧凸非空 => K = cl(conv(ext K))，且 ext K 非空", "逆向（Milman）：若 cl(conv(E)) = K 且 K 紧，则 ext K subset cl(E)", "Bauer 极大原理：凸上半连续泛函在 K 上的最大值可在极点处取到", "有限维（Minkowski）：紧凸集等于极点凸包本身，无需取闭包"],
        theorems: ["定理要求局部凸性与紧性；缺紧性时极点集可能为空（如无穷维开球或 c_0 的单位球）", "闭单位球的极点：l^p（1 < p < infinity）与 Hilbert 空间为整个单位球面，L^1[0,1] 单位球无极点，C[0,1] 单位球极点仅 +-1 常函数", "弱星紧性 + Alaoglu 使 Krein-Milman 常在对偶球上使用（如概率测度集的极点为 Dirac 测度）", "Choquet 定理进一步给出极点上的表示测度，是 Krein-Milman 的积分加强"],
        generalRequirements: ["必须声明所在空间局部凸、集合紧且凸", "无穷维中结论只给凸包的闭包，不能省略闭包", "使用极点最优化必须验证泛函凸性或线性与半连续性"],
        forbiddenErrors: ["【紧性缺失】对非紧凸集断言极点存在或表示成立", "【闭包省略】在无穷维写 K = conv(ext K)", "【极点误判】称 L^1 单位球或 c_0 单位球有极点", "【凸性缺失】对非凸紧集使用定理", "【方向反用】由 cl(conv(E)) = K 直接断言 E = ext K 而不取闭包"],
        parameterConstraints: { ambientSpace: "需局部凸 Hausdorff 拓扑向量空间", compactnessRequirement: "K 紧（常用弱星紧）", convexityRequirement: "K 凸非空", closureNecessity: "无穷维必须取凸包闭包" },
        closureChecks: ["确认紧性来源（有限维 Heine-Borel 或 Alaoglu）", "确认结论保留凸包闭包", "确认所举极点集与空间范数匹配", "确认最优化论证的半连续性条件"],
        scenarioChecks: { probabilityMeasureExtremePoints: ["紧空间上概率测度集的极点为 Dirac 测度", "确认弱星紧性"], linearProgrammingVertices: ["有限维可行多面体最优值在顶点取到", "确认可行集有界"], noExtremePointCounterexamples: ["L^1 与 c_0 单位球说明紧性不可省", "确认所用范数"] },
    },
    // Riesz 引理与有限维空间的紧性、范数等价刻画。
    "banach-riesz-lemma-finite-dimension": {
        definitions: ["真闭子空间 Y subsetneq X", "范数等价：存在 c_1, c_2 > 0 使 c_1 ||x||_1 <= ||x||_2 <= c_2 ||x||_1", "全有界与相对紧"],
        formulas: ["Riesz 引理：Y 真闭子空间，0 < theta < 1 => 存在 ||x|| = 1 使 dist(x, Y) >= theta", "闭单位球紧 <=> dim X < infinity", "有限维空间上任意两个范数等价，且所有线性映射自动连续", "紧性判据（Riesz 定理）：赋范空间局部紧 <=> 有限维"],
        theorems: ["Riesz 引理中 theta = 1 一般不可达（在非自反或非严格凸空间中取不到），有限维或自反严格凸情形可取到", "有限维等价范数由单位球紧性与连续性推出，无穷维反例：C[0,1] 上 sup 范数与 L^1 范数不等价", "推论：无穷维 Banach 空间的闭单位球非紧，故紧算子不能是同构；恒等算子紧 <=> 有限维", "有限维子空间恒闭且有拓扑补，无穷维闭子空间不一定有闭补（Lindenstrauss-Tzafriri：仅 Hilbert 空间所有闭子空间可补）"],
        generalRequirements: ["使用 Riesz 引理必须取 theta < 1 或说明取到 1 的额外条件", "断言范数等价必须限定有限维或给出具体估计", "由紧性结论推有限维必须指明是闭单位球（或某邻域）的紧性"],
        forbiddenErrors: ["【theta 端点越界】断言总能取到 dist(x, Y) = 1", "【范数等价滥用】在无穷维空间断言任意两范数等价", "【单位球紧性误设】在无穷维中使用闭单位球紧性提取收敛子列", "【子空间闭性假设】默认任意线性子空间闭（无穷维需验证）", "【可补性默认】断言任意闭子空间有闭补"],
        parameterConstraints: { thetaRange: "0 < theta < 1", dimensionCondition: "范数等价与球紧性均要求 dim < infinity", subspaceClosedness: "Riesz 引理要求 Y 闭且真", complementability: "一般闭子空间不必可补" },
        closureChecks: ["确认 theta 严格小于 1 或补充可达性条件", "确认维数条件已声明", "确认未在无穷维使用球紧性", "确认子空间闭性与可补性主张有依据"],
        scenarioChecks: { compactOperatorTheory: ["用球非紧说明紧算子不可逆", "确认恒等算子紧当且仅当有限维"], normComparisonProblems: ["无穷维需具体不等式而非等价定理", "确认反例范数对"], approximationTheorySetting: ["有限维子空间上最佳逼近存在由紧性给出", "确认子空间维数有限"] },
    },
    // Hilbert 空间：闭凸集投影与 Riesz 表示。
    "banach-hilbert-projection-riesz-representation": {
        definitions: ["内积空间完备即 Hilbert 空间，范数 ||x|| = sqrt(<x, x>)", "闭凸集 C 上的投影 P_C x = argmin_{y in C} ||x - y||", "正交补 M^perp = {x : <x, y> = 0 for all y in M}"],
        formulas: ["投影定理：C 闭凸非空 => P_C x 存在唯一，且 <x - P_C x, y - P_C x> <= 0 对所有 y in C", "正交分解：M 闭子空间 => H = M oplus M^perp，P_M 线性、自伴、幂等、||P_M|| <= 1", "Riesz 表示：对每个 f in H^* 存在唯一 y 使 f(x) = <x, y> 且 ||f|| = ||y||", "平行四边形恒等式：||x+y||^2 + ||x-y||^2 = 2||x||^2 + 2||y||^2（刻画内积范数）"],
        theorems: ["投影存在唯一性依赖闭性、凸性与完备性；一般 Banach 空间需严格凸+自反才有唯一最近点", "P_C 是非扩张映射（||P_C x - P_C y|| <= ||x - y||），但仅当 C 为子空间时线性", "M^{perp perp} = cl(M)，故 M 稠密 <=> M^perp = {0}；对非闭子空间不能直接用正交分解", "Riesz 表示使 H 自反并给出共轭线性的等距同构 H^* = H（复情形共轭线性）"],
        generalRequirements: ["使用投影必须验证集合闭且凸，子空间情形还需闭性以保证正交分解", "把泛函写成内积必须声明空间完备（Hilbert）", "复空间中必须注明内积的共轭线性变元位置"],
        forbiddenErrors: ["【完备性缺失】在非完备内积空间使用投影或 Riesz 表示", "【闭性缺失】对非闭子空间写 H = M oplus M^perp", "【线性性误加】把一般闭凸集投影当线性算子", "【共轭线性忽略】复情形下把 H^* = H 写成线性同构", "【Banach 越界】在一般 Banach 空间断言最近点存在唯一"],
        parameterConstraints: { completenessRequirement: "需 Hilbert（完备内积）空间", closedConvexity: "投影要求 C 闭且凸", subspaceClosedness: "正交分解要求 M 闭", conjugateLinearity: "复内积对第二变元共轭线性" },
        closureChecks: ["确认闭性与凸性条件", "确认线性性主张仅用于闭子空间投影", "确认 Riesz 表示的唯一性与等距", "确认稠密性论证走 M^perp = {0}"],
        scenarioChecks: { leastSquaresApproximation: ["最佳逼近由正交投影给出", "确认逼近子空间闭"], variationalInequality: ["投影刻画写成变分不等式形式", "确认凸集闭"], weakFormulationOfPDE: ["Lax-Milgram 或 Riesz 表示给出弱解", "确认双线性形式有界强制"] },
    },
    // Schauder 基、基常数与可分性关系。
    "banach-schauder-basis-separability": {
        definitions: ["Schauder 基 {e_n}：每个 x 有唯一展开 x = sum_n a_n e_n（按范数收敛）", "基常数 K = sup_n ||S_n||，S_n 为部分和投影", "可分：存在可数稠密子集"],
        formulas: ["展开唯一性：系数泛函 a_n = e_n^*(x) 连续", "有基 => 可分（有限有理组合稠密），反向不成立", "部分和算子一致有界：sup_n ||S_n|| = K < infinity，且 ||x|| <= K ||sum_{n<=N} a_n e_n|| 的相关估计", "例：l^p、c_0 有标准基；L^p[0,1]（1 < p < infinity）有基；l^infinity 与 L^infinity 不可分故无基"],
        theorems: ["Enflo 反例：存在可分 Banach 空间无 Schauder 基，故可分不蕴含有基", "Schauder 基的部分和一致有界由基定义与完备性（闭图像/一致有界）推出", "无条件基更强：l^p（1 <= p < infinity）与 c_0 的标准基无条件，L^1 与 C[0,1] 无无条件基", "Gowers-Maurey 等构造给出无无条件基序列的空间，说明基理论的层级严格"],
        generalRequirements: ["断言存在基必须给出具体基或引用已知结果，不能由可分推出", "使用展开必须说明收敛为范数收敛且系数唯一", "区分基、无条件基与正交基三个层级"],
        forbiddenErrors: ["【可分推有基】由可分性断言存在 Schauder 基（Enflo 反例）", "【收敛方式混淆】把基展开当无条件收敛或逐点收敛", "【不可分空间给基】声称 l^infinity 有 Schauder 基", "【Hamel 基混同】把代数 Hamel 基当 Schauder 基", "【基常数忽略】使用部分和估计而不引入基常数"],
        parameterConstraints: { convergenceMode: "展开按范数收敛，顺序相关", basisConstant: "K = sup ||S_n|| 有限", separabilityDirection: "有基 => 可分，反向不成立", exponentRange: "L^p 有基需 1 <= p < infinity" },
        closureChecks: ["确认基的存在性有具体依据", "确认收敛类型与顺序依赖已说明", "确认基常数在估计中出现", "确认未把 Hamel 基与 Schauder 基混用"],
        scenarioChecks: { seriesExpansionEstimates: ["用基常数控制部分和范数", "确认展开顺序固定"], unconditionalityQuestions: ["重排不变需无条件基", "确认 L^1、C[0,1] 例外"], nonseparableSpaces: ["l^infinity 类空间直接排除基的存在", "确认不可分性论证"] },
    },
};
