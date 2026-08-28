import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“拓扑学-点集拓扑”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const TOPOLOGY_POINTSET_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 任意积空间的紧性，等价于选择公理。
    "pointset-tychonoff-theorem": {
        id: "pointset-tychonoff-theorem", l2Key: "topology-pointset", name: "Tychonoff 乘积紧性定理", kind: "theorem",
        aliases: ["Tychonoff定理", "乘积空间紧性", "Alexander子基引理", "选择公理等价"],
    },
    // 紧、列紧、可数紧、序列紧在一般空间中互不等价。
    "pointset-compactness-variants": {
        id: "pointset-compactness-variants", l2Key: "topology-pointset", name: "紧性诸变体的分离与等价条件", kind: "criterion",
        aliases: ["列紧", "可数紧", "序列紧", "有限交性质", "度量空间紧性等价"],
    },
    // 正规空间上由闭集分离构造连续函数。
    "pointset-urysohn-lemma": {
        id: "pointset-urysohn-lemma", l2Key: "topology-pointset", name: "Urysohn 引理", kind: "lemma",
        aliases: ["Urysohn引理", "正规空间", "闭集分离", "连续函数构造"],
    },
    // 可度量化的充要判据。
    "pointset-metrization-theorems": {
        id: "pointset-metrization-theorems", l2Key: "topology-pointset", name: "度量化定理", kind: "theorem",
        aliases: ["Urysohn度量化定理", "Nagata-Smirnov定理", "σ局部有限基", "第二可数正则"],
    },
    // 闭子集上的连续函数可保范扩张到全空间。
    "pointset-tietze-extension": {
        id: "pointset-tietze-extension", l2Key: "topology-pointset", name: "Tietze 扩张定理", kind: "theorem",
        aliases: ["Tietze扩张", "闭集上连续函数延拓", "保界扩张", "正规性必要"],
    },
    // 连通与道路连通的严格分离及局部性修正。
    "pointset-connected-vs-path-connected": {
        id: "pointset-connected-vs-path-connected", l2Key: "topology-pointset", name: "连通性与道路连通性的分离", kind: "criterion",
        aliases: ["道路连通", "局部道路连通", "拓扑学家正弦曲线", "连通分支"],
    },
    // 商拓扑的普遍性质与诱导映射的良定性。
    "pointset-quotient-topology-universal-property": {
        id: "pointset-quotient-topology-universal-property", l2Key: "topology-pointset", name: "商拓扑的普遍性质与诱导映射良定性", kind: "criterion",
        aliases: ["商拓扑", "商映射", "饱和开集", "诱导映射连续性", "紧到Hausdorff闭映射"],
    },
    // 完备度量空间与局部紧 Hausdorff 空间中稠密开集的可数交仍稠密。
    "pointset-baire-category-theorem": {
        id: "pointset-baire-category-theorem", l2Key: "topology-pointset", name: "Baire 范畴定理", kind: "theorem",
        aliases: ["Baire范畴定理", "第一范畴集", "无处稠密", "完备度量空间", "局部紧Hausdorff"],
    },
    // 完全正则空间的最大紧化及其函数延拓刻画。
    "pointset-stone-cech-compactification": {
        id: "pointset-stone-cech-compactification", l2Key: "topology-pointset", name: "Stone-Čech 紧化", kind: "object",
        aliases: ["Stone-Cech紧化", "完全正则空间", "有界连续函数延拓", "最大紧化", "一点紧化对比"],
    },
    // 一般拓扑空间中收敛必须用网或滤子刻画。
    "pointset-net-filter-convergence": {
        id: "pointset-net-filter-convergence", l2Key: "topology-pointset", name: "网与滤子收敛判据", kind: "criterion",
        aliases: ["网收敛", "滤子", "超滤", "闭包的网刻画", "序列不足性"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const TOPOLOGY_POINTSET_L3_RULES: Record<string, MathV2L3Rules> = {
    // Tychonoff 定理：任意基数乘积的紧性与选择公理的等价性。
    "pointset-tychonoff-theorem": {
        definitions: ["乘积拓扑以有限个坐标限制生成的柱形集为基，而非以全部坐标的开集之积为基", "空间紧指任意开覆盖有有限子覆盖，等价于任意具有有限交性质的闭集族有非空交", "超滤是极大真滤子，紧性等价于每个超滤收敛"],
        formulas: ["乘积拓扑基元：pi_{i1}^{-1}(U_1) cap ... cap pi_{in}^{-1}(U_n)，仅有限个坐标受限", "Tychonoff 定理：X = prod_{i in I} X_i 紧 <=> 每个 X_i 紧（I 可为任意指标集）"],
        theorems: ["Tychonoff 定理：任意族紧空间的乘积在乘积拓扑下紧", "Alexander 子基引理：若某子基的每个覆盖有有限子覆盖，则空间紧，这是回避 Zorn 直接归纳的标准证法", "在 ZF 中 Tychonoff 定理（一般情形）等价于选择公理；Hausdorff 情形等价于较弱的超滤引理", "有限乘积情形（管状引理）不需要选择公理"],
        generalRequirements: ["必须明确指标集是有限、可数还是任意，只有任意指标集情形才真正需要选择公理", "必须使用乘积拓扑而不是箱拓扑，箱拓扑下结论失效", "使用有限交性质或超滤刻画时必须验证族的极大性或有限交条件"],
        forbiddenErrors: ["【拓扑混用】在箱拓扑下套用 Tychonoff 定理，箱拓扑下即使可数个紧区间之积也不紧", "【选择公理隐用】在要求 ZF 证明的语境中不声明就调用 Zorn 引理或超滤引理", "【投影方向反用】由乘积紧推每个因子紧时未指出投影是连续满射（因子非空时才成立）", "【有限化误推】用管状引理的有限乘积论证直接覆盖无限乘积情形", "【空因子忽略】某个 X_i 为空时乘积为空，紧性讨论退化，未单独交代"],
        parameterConstraints: { indexSetCardinality: "指标集 I 任意；I 有限时结论不依赖选择公理", productTopologyChoice: "必须为乘积（Tychonoff）拓扑，不能是箱拓扑", factorNonemptiness: "推乘积紧到因子紧需各因子非空", separationAxiom: "Hausdorff 情形只需超滤引理，一般情形需完全选择公理" },
        closureChecks: ["确认所用拓扑为乘积拓扑并写出其基", "确认指标集基数与所依赖的集论公理强度匹配", "确认紧性判据（开覆盖/有限交性质/超滤收敛）在使用前已验证前提", "确认结论方向（因子紧 => 乘积紧，或反向）与所给条件一致"],
        scenarioChecks: { cantorSetRepresentation: ["把 {0,1}^N 视为紧空间时确认用乘积拓扑", "确认与 Cantor 集的同胚是拓扑等价而非仅双射"], functionSpaceCompactness: ["把点态收敛拓扑下的函数空间当乘积空间处理时确认值域各因子紧", "确认所需的是点态紧而非一致紧"], choiceAxiomSensitivity: ["若题目要求构造性证明则不得使用一般 Tychonoff 定理", "确认是否可退化到 Hausdorff 或可数情形以降低公理强度"] },
    },
    // 紧性诸变体：紧、可数紧、列紧、序列紧的蕴含关系与反例边界。
    "pointset-compactness-variants": {
        definitions: ["紧：任意开覆盖有有限子覆盖", "可数紧：任意可数开覆盖有有限子覆盖，等价于每个无限子集有 omega 聚点", "列紧（极限点紧）：每个无限子集有聚点", "序列紧：每个序列有收敛子列"],
        formulas: ["度量空间中等价链：紧 <=> 序列紧 <=> 列紧 <=> 可数紧 <=> 完备且全有界", "一般空间蕴含链：紧 => 可数紧 => 列紧；紧与序列紧互不蕴含"],
        theorems: ["度量空间中紧、序列紧、列紧、可数紧四者等价（Bolzano-Weierstrass 型）", "一般拓扑空间中紧不蕴含序列紧：{0,1}^{[0,1]} 紧但非序列紧", "序列紧不蕴含紧：第一个不可数序数 [0, omega_1) 序列紧而不紧", "第一可数空间中可数紧 => 序列紧；T1 空间中可数紧 <=> 列紧"],
        generalRequirements: ["断言等价性前必须声明空间是度量空间或至少给出第一可数、T1 等分离与可数性假设", "使用子列收敛论证时必须确认空间第一可数或已知序列紧", "紧性证明必须针对任意开覆盖而非仅可数覆盖"],
        forbiddenErrors: ["【等价滥用】在一般拓扑空间中直接用序列紧代替紧，缺少第一可数或度量前提", "【子列存在性误设】非第一可数空间中假定聚点必有收敛子列", "【闭有界误判】非欧氏空间（如无穷维赋范空间）中用闭且有界断言紧", "【可数覆盖偷换】只对可数开覆盖验证有限子覆盖就宣称紧", "【反例缺失】声称蕴含关系为等价却不给出或不承认已知反例方向"],
        parameterConstraints: { metrizability: "四者等价仅在度量（或可度量化）空间成立", firstCountability: "可数紧 => 序列紧需第一可数", separationAxiom: "可数紧与列紧等价需 T1", dimensionality: "闭有界 => 紧仅在有限维赋范空间成立" },
        closureChecks: ["确认空间是否度量化或第一可数，再选用相应判据", "确认所用蕴含方向在给定公理下成立而非反向", "确认无穷维或非第一可数情形已排除或单独处理", "确认聚点、omega 聚点、子列极限三种极限概念未混用"],
        scenarioChecks: { infiniteDimensionalSpace: ["在 Hilbert 或 Banach 空间中确认闭单位球非紧（除有限维）", "改用弱紧或自反性论证"], functionSpaceSequentialCompactness: ["确认所用是点态收敛还是一致收敛拓扑", "需要子列时先确认第一可数或使用网"], ordinalSpaceCounterexample: ["用 [0, omega_1) 说明序列紧不推紧时确认序拓扑定义", "确认其不可数余有限覆盖无有限子覆盖"] },
    },
    // Urysohn 引理：正规空间中由不交闭集构造分离函数。
    "pointset-urysohn-lemma": {
        definitions: ["正规（T4 常含 T1）：任意两个不交闭集可被不交开集分离", "完全正则（T3.5）：点与闭集可被连续函数分离", "Urysohn 函数：在一闭集上取 0、另一闭集上取 1 的连续函数"],
        formulas: ["结论形式：存在连续 f: X -> [0,1] 使 f|_A = 0, f|_B = 1，A, B 闭且不交", "构造核心：用二进有理数指标的开集族 U_r 满足 r < s => cl(U_r) subset U_s，令 f(x) = inf{r : x in U_r}"],
        theorems: ["Urysohn 引理：X 正规 <=> 任意不交闭集存在 Urysohn 函数", "推论：正规空间是完全正则的；正规 + 第二可数 => 可度量化（Urysohn 度量化定理）", "注意不能要求 f 在 A、B 之外严格介于 0 与 1 之间，也不能一般地要求 f^{-1}(0) = A（需 A 为零集）"],
        generalRequirements: ["必须先验证正规性，正则性或 Hausdorff 性单独不够", "两个集合必须是闭集且不交，仅不交或仅为一般集合时结论不成立", "构造中的开集族递归必须显式使用正规性逐步插入闭包"],
        forbiddenErrors: ["【前提降格】只假设 Hausdorff 或正则就构造 Urysohn 函数", "【集合类型错误】对非闭集或相交集合套用引理", "【纤维精确化】断言 f^{-1}(0) 恰为 A，未附加 A 是零集或空间完全正规（T6）的条件", "【严格不等误设】声称 f 在 A、B 外严格取 (0,1) 内值", "【度量化跳步】由 Urysohn 引理直接断言可度量化而不加第二可数条件"],
        parameterConstraints: { separationAxiom: "需正规性；推可度量化还需第二可数", closednessOfSets: "A、B 必须闭且不交", targetInterval: "值域可取任意闭区间 [a,b]，通过仿射变换等价于 [0,1]", exactZeroSet: "要求 f^{-1}(0) = A 需 A 为零集或空间为完全正规 T6" },
        closureChecks: ["确认分离公理级别（正则/正规/完全正规）与结论强度匹配", "确认所分离对象为闭集", "确认构造中每步插入闭包都调用了正规性", "确认推论（完全正则、度量化、Tietze）所需附加条件已写出"],
        scenarioChecks: { partitionOfUnityConstruction: ["构造单位分解时确认空间正规或仿紧", "确认覆盖是局部有限的以保证求和有意义"], tietzePrerequisite: ["用 Urysohn 引理作为 Tietze 扩张的基础时确认闭集与正规性条件", "确认扩张保界要求"], metrizationChain: ["确认第二可数或 σ 局部有限基条件", "区分 Urysohn 与 Nagata-Smirnov 两种度量化判据"] },
    },
    // 度量化定理：Urysohn 与 Nagata-Smirnov 判据及其可数性代价。
    "pointset-metrization-theorems": {
        definitions: ["可度量化：存在度量 d 使其诱导拓扑与原拓扑相同", "σ 局部有限基：基可写成可数多个局部有限族之并", "第二可数：存在可数基；可分：存在可数稠密子集"],
        formulas: ["Urysohn 度量化：正规 + T1 + 第二可数 => 可度量化", "Nagata-Smirnov 度量化：可度量化 <=> 正则 + T1 + 存在 σ 局部有限基", "Bing 度量化：可度量化 <=> 正则 + T1 + 存在 σ 离散基"],
        theorems: ["Urysohn 度量化定理给出充分条件而非充要条件，可度量空间不必第二可数（如不可分离 Hilbert 空间）", "Nagata-Smirnov 与 Bing 定理给出充要刻画", "度量空间中可分 <=> 第二可数 <=> Lindelöf，一般空间中三者互不等价", "紧 Hausdorff + 第二可数 => 可度量化；紧 Hausdorff 空间可度量化 <=> 第二可数"],
        generalRequirements: ["使用 Urysohn 判据必须写出第二可数假设，不能只用正规性", "宣称充要刻画必须用 Nagata-Smirnov 或 Bing 而非 Urysohn", "在度量空间中使用可分与第二可数互换前先声明度量性"],
        forbiddenErrors: ["【判据升格】把 Urysohn 度量化定理当作充要条件使用", "【可数性混同】在非度量空间中把可分、第二可数、Lindelöf 当等价", "【基条件弱化】用可数基替代 σ 局部有限基，或反之忽略局部有限性", "【分离公理缺失】遗漏 T1 导致伪度量与度量混淆", "【紧性误用】对非第二可数的紧 Hausdorff 空间断言可度量化"],
        parameterConstraints: { separationAxiom: "至少需正则 + T1；Urysohn 判据用正规 + T1", countabilityAssumption: "Urysohn 判据需第二可数；Nagata-Smirnov 不需要", baseStructure: "σ 局部有限基或 σ 离散基，局部有限性不可省", metricUniqueness: "度量不唯一，只要求诱导同一拓扑" },
        closureChecks: ["确认所用度量化判据是充分还是充要", "确认分离公理与可数性假设逐条列出", "确认基的 σ 局部有限或 σ 离散结构已验证", "确认由可度量化反推的性质（第一可数、正规、仿紧）方向正确"],
        scenarioChecks: { compactHausdorffCase: ["紧 Hausdorff 下确认第二可数与可度量化等价", "确认不可数乘积如 {0,1}^{[0,1]} 不可度量化"], nonSeparableMetricSpace: ["确认不可分度量空间不第二可数但仍可度量化", "据此排除 Urysohn 判据的必要性主张"], manifoldMetrization: ["流形可度量化需附加第二可数或仿紧条件", "确认长直线等反例已排除"] },
    },
    // Tietze 扩张定理：正规空间上闭集连续函数的保界扩张。
    "pointset-tietze-extension": {
        definitions: ["扩张：F: X -> R 连续且 F|_A = f", "保界扩张：扩张后值域仍落在原区间内", "闭集是扩张定理的必要定义域限制"],
        formulas: ["有界情形：f: A -> [a,b] 连续，A 闭，X 正规 => 存在连续 F: X -> [a,b] 且 F|_A = f", "无界情形：f: A -> R 连续可扩张为 F: X -> R", "凸值域推广：值域可换为 R^n 中任意凸集或可缩空间"],
        theorems: ["Tietze 扩张定理与 Urysohn 引理在正规空间上互相等价", "值域为 [a,b] 或 R 时结论成立；值域为一般拓扑空间时一般失效", "对开集或非闭子集，即使函数连续也可能无连续扩张（如 sin(1/x) 在 (0,1) 上）", "推广：值域取 R^n 的紧凸集仍成立，取球面 S^1 时出现障碍（与同调相关）"],
        generalRequirements: ["定义域必须是闭子集，非闭子集必须先讨论边界行为", "必须声明空间正规，且值域为区间、R 或凸集", "要求保界时必须使用截断或压缩技巧并说明连续性保持"],
        forbiddenErrors: ["【定义域非闭】对开集或稠密子集直接套用 Tietze 扩张", "【值域越界】给出扩张但值域超出原区间，却宣称保界", "【值域拓扑错配】对取值于球面或一般流形的映射断言无条件扩张", "【正规性缺失】仅假设 Hausdorff 或正则", "【一致连续替代】用一致连续在完备空间的延拓混淆闭集扩张定理"],
        parameterConstraints: { separationAxiom: "需正规空间（通常含 T1）", domainClosedness: "A 必须为 X 的闭子集", codomainStructure: "值域为 [a,b]、R 或 R^n 中凸集；一般空间不成立", boundednessPreservation: "保界结论要求值域为闭区间或凸紧集" },
        closureChecks: ["确认子集闭性已验证", "确认值域结构落在允许范围", "确认保界要求是否被显式满足", "确认与 Urysohn 引理的等价方向未被当作更强结论使用"],
        scenarioChecks: { boundedExtensionRequest: ["确认使用截断保持值域", "确认端点值在 A 上未被破坏"], vectorValuedExtension: ["逐坐标扩张时确认值域凸性", "确认非凸值域需拓扑障碍分析"], gluingConstruction: ["用扩张拼接函数时确认闭集族与正规性", "确认重叠部分定义一致"] },
    },
    // 连通与道路连通：蕴含方向、局部条件与经典反例。
    "pointset-connected-vs-path-connected": {
        definitions: ["连通：不能分解为两个非空不交开集之并", "道路连通：任意两点存在连续道路相连", "局部连通/局部道路连通：每点有由（道路）连通开集组成的邻域基"],
        formulas: ["蕴含关系：道路连通 => 连通；反向一般不成立", "局部道路连通条件下：连通 <=> 道路连通", "连通分支与道路连通分支：后者细分前者，局部道路连通时两者一致"],
        theorems: ["道路连通蕴含连通，反例为拓扑学家的正弦曲线（closure of {(x, sin(1/x))}）连通但非道路连通", "开集在 R^n 中连通 <=> 道路连通（局部道路连通性来自欧氏局部凸性）", "连续像保持连通性与道路连通性；乘积保持两者", "连通分支总是闭集，但不必是开集（除局部连通时）"],
        generalRequirements: ["由连通推道路连通必须补充局部道路连通假设", "使用连通分支的开性必须先确认局部连通", "反例引用必须明确空间与拓扑（子空间拓扑）"],
        forbiddenErrors: ["【蕴含反用】直接由连通断言道路连通而不加局部道路连通条件", "【分支开性误设】把连通分支当作开集使用而未验证局部连通", "【正弦曲线误判】认为拓扑学家的正弦曲线不连通或道路连通", "【局部条件遗漏】在一般空间中把 R^n 开集的等价性推广到任意空间", "【分离方式混淆】用去掉一点后不连通等同于非道路连通"],
        parameterConstraints: { localConnectivity: "连通 => 道路连通需局部道路连通", ambientSpaceType: "R^n 开集情形自动局部道路连通", subspaceTopology: "反例必须在子空间拓扑下讨论", componentStructure: "连通分支闭；开性需局部连通" },
        closureChecks: ["确认蕴含方向与所加局部假设一致", "确认所用反例的拓扑与结论方向匹配", "确认连通分支的开闭性主张有依据", "确认连续性与乘积运算保持的是哪一种连通性"],
        scenarioChecks: { euclideanOpenSet: ["确认 R^n 开集连通即道路连通", "确认结论依赖局部凸性"], pathologicalCounterexample: ["引用正弦曲线或 Cantor 型集合时给出精确定义", "确认其连通分支结构"], quotientConnectivity: ["商映射保持连通与道路连通", "确认不保持局部连通性"] },
    },
    // 商拓扑的普遍性质：由商映射诱导的连续性判据。
    "pointset-quotient-topology-universal-property": {
        definitions: ["商拓扑：U 在 X/~ 中开 <=> q^{-1}(U) 在 X 中开，q 为自然投影", "饱和集：等于其等价类之并的集合", "商映射：连续满射且开集判据由原像给出"],
        formulas: ["普遍性质：g: X/~ -> Y 连续 <=> g circ q: X -> Y 连续", "开性判据：q 开 <=> 每个开集的饱和化仍开", "闭映射判据：q 闭 <=> 每个闭集的饱和化仍闭"],
        theorems: ["商拓扑是使 q 连续的最细拓扑，普遍性质给出商空间的唯一刻画（相差同胚）", "紧空间的商仍紧，但 Hausdorff 性一般不被商保持，需等价关系为闭关系或 q 为闭映射", "紧 Hausdorff 空间到 Hausdorff 空间的连续满射自动是商映射", "商映射一般既不开也不闭"],
        generalRequirements: ["由 X 上映射诱导商空间映射时必须验证其在等价类上常值（良定义性）", "断言商空间 Hausdorff 必须给出闭关系或闭映射等附加条件", "验证开集时必须回到原像判据而非直观图像"],
        forbiddenErrors: ["【良定义跳过】直接写出商空间上的映射而不验证在纤维上常值", "【Hausdorff 误继承】认为 Hausdorff 空间的商必然 Hausdorff", "【开闭性误设】默认商映射是开映射或闭映射", "【拓扑方向错】用像的开性定义商拓扑而非原像", "【饱和性忽略】用非饱和开集的像断言商空间开集"],
        parameterConstraints: { equivalenceRelationType: "商空间 Hausdorff 通常需关系图闭或 q 闭", saturationRequirement: "开性判断需对饱和集进行", compactnessTransfer: "紧性、连通性、道路连通性被商保持", separationTransfer: "T1 需每个等价类闭" },
        closureChecks: ["确认诱导映射的良定义性已验证", "确认商拓扑用原像判据定义", "确认所声称的分离公理有附加条件支撑", "确认所保持的性质（紧、连通）与不保持的性质（Hausdorff、局部紧）区分清楚"],
        scenarioChecks: { cwComplexGluing: ["粘贴构造时确认商映射为闭映射以保证 Hausdorff", "确认粘贴映射连续"], groupActionQuotient: ["确认作用为紧群或作用适当（proper）以保 Hausdorff", "确认轨道空间开性来自作用的开映射性质"], collapsingSubspace: ["X/A 型商中确认 A 闭", "确认所得空间的分离性质单独验证"] },
    },
    // Baire 纲定理：完备度量与局部紧 Hausdorff 空间的稠密开集交性质。
    "pointset-baire-category-theorem": {
        definitions: ["无处稠密集：闭包内部为空", "第一纲集：可数个无处稠密集之并；第二纲集：非第一纲", "Baire 空间：可数个稠密开集之交仍稠密"],
        formulas: ["结论形式：{U_n} 稠密开 => cap_n U_n 稠密", "等价形式：X = cup_n F_n 且 F_n 闭 => 某个 F_n 有非空内部", "完备度量空间与局部紧 Hausdorff 空间都是 Baire 空间"],
        theorems: ["Baire 纲定理：完备度量空间是 Baire 空间；局部紧 Hausdorff 空间也是", "推论：一致有界原理、开映射定理、闭图像定理的标准证明依赖 Baire 性", "R 不是可数个无处稠密闭集之并；Q 是第一纲集，故 Q 不能作为完备度量空间的拓扑", "Baire 性不被一般子空间继承，但被开子集与 G_delta 子集继承"],
        generalRequirements: ["使用纲定理前必须确认完备性或局部紧 Hausdorff 之一", "集合族必须可数，不可数族结论失效", "断言存在性时必须说明所构造集合为稠密 G_delta 而非全空间"],
        forbiddenErrors: ["【完备性缺失】对非完备度量空间（如 Q 或 C[0,1] 的某些不完备范数）套用纲定理", "【可数性破坏】对不可数族稠密开集取交并宣称稠密", "【稠密与全体混同】把稠密 G_delta 当作全空间，忽略例外集非空", "【子空间继承误设】对任意子空间断言 Baire 性", "【纲与测度混淆】把第一纲等同于零测度（二者互不包含）"],
        parameterConstraints: { completenessRequirement: "完备度量或局部紧 Hausdorff", familyCardinality: "族必须可数", subspaceInheritance: "开子集与 G_delta 子集继承 Baire 性", measureIndependence: "纲与 Lebesgue 测度零集互不蕴含" },
        closureChecks: ["确认空间满足完备性或局部紧 Hausdorff", "确认所取族为可数族", "确认结论表述为稠密（G_delta）而非处处成立", "确认未将纲论结论与测度论结论互换"],
        scenarioChecks: { functionalAnalysisApplication: ["用于一致有界原理时确认 Banach 空间完备性", "确认所构造闭集族覆盖全空间"], genericityArgument: ["以稠密 G_delta 表述典型性时确认可数交结构", "确认例外集为第一纲"], nowhereDifferentiableExample: ["构造处处不可微函数时确认 C[0,1] 完备", "确认可微函数集为第一纲"] },
    },
    // Stone-Čech 紧化：完全正则空间的最大紧化与其普遍性质。
    "pointset-stone-cech-compactification": {
        definitions: ["紧化：紧 Hausdorff 空间 K 与稠密嵌入 X -> K", "beta X：由 C_b(X) 或超滤给出的最大紧化", "单点紧化 alpha X：局部紧 Hausdorff 空间的最小紧化"],
        formulas: ["普遍性质：任意连续 f: X -> K（K 紧 Hausdorff）唯一延拓为 beta f: beta X -> K", "构造一：beta X subset prod_{f in C_b(X,[0,1])} [0,1] 的闭包", "构造二：beta N 为 N 上全部超滤之集，基数 2^{2^{aleph_0}}"],
        theorems: ["beta X 存在当且仅当 X 完全正则（Tychonoff 空间），且在紧化偏序中最大", "C(beta X) 与 C_b(X) 同构为 Banach 代数，体现 Gelfand 对偶", "beta N \\ N 不可度量化、非序列紧，包含 2^{2^{aleph_0}} 个点，且不含孤立点", "beta X = X 当且仅当 X 紧；beta 的延拓性质唯一确定 beta X 相差同胚"],
        generalRequirements: ["使用 beta X 必须先确认 X 完全正则（Hausdorff 不够）", "延拓只对映到紧 Hausdorff 空间的映射成立，不能延拓到 R 上的无界函数", "讨论 beta N 的点必须以超滤或 C_b 的极大理想语言描述，不可当作具体数列极限"],
        forbiddenErrors: ["【前提降格】对仅 Hausdorff 或正则的空间构造 Stone-Čech 紧化", "【延拓越界】延拓无界连续函数或映到非紧空间的映射", "【最小最大混淆】把 beta X 当作单点紧化或最小紧化", "【序列直觉误用】在 beta N 中使用序列收敛论证（beta N 非第一可数）", "【基数低估】认为 beta N 只比 N 多可数或连续多个点"],
        parameterConstraints: { separationAxiom: "X 必须完全正则 T3.5（通常含 Hausdorff）", extensionCodomain: "延拓目标必须紧 Hausdorff", latticePosition: "beta X 在紧化偏序中为最大，alpha X（局部紧时）为最小", cardinalityOfBetaN: "|beta N| = 2^{2^{aleph_0}}" },
        closureChecks: ["确认完全正则性已验证", "确认延拓映射的值域紧 Hausdorff", "确认所用紧化是最大（beta）还是最小（alpha）", "确认在 beta X 中未使用第一可数或序列刻画"],
        scenarioChecks: { boundedFunctionAlgebra: ["用 C_b(X) 与 C(beta X) 同构时确认有界性", "确认 Gelfand 谱与超滤描述一致"], ultrafilterLimits: ["以超滤极限定义广义极限时确认超滤存在性依赖选择公理", "确认所得极限非唯一构造"], localCompactCase: ["局部紧时可对比 alpha X 与 beta X", "确认 beta X \\ X 一般不是单点"] },
    },
    // 网与滤子收敛：一般拓扑空间中替代序列的收敛工具。
    "pointset-net-filter-convergence": {
        definitions: ["网：由有向集 D 到 X 的映射 (x_d)_{d in D}", "滤子：X 上非空、有限交封闭、向上封闭的集族；超滤为极大滤子", "网收敛到 x：对 x 的任意邻域 U，存在 d_0 使 d >= d_0 时 x_d in U"],
        formulas: ["闭包刻画：x in cl(A) <=> 存在 A 中的网收敛到 x", "连续性刻画：f 连续 <=> 每个收敛网 x_d -> x 满足 f(x_d) -> f(x)", "紧性刻画：X 紧 <=> 每个网有收敛子网 <=> 每个超滤收敛"],
        theorems: ["网与滤子在收敛理论上等价，且在一般空间中完全刻画闭包、连续性与紧性，序列不能（除第一可数）", "Hausdorff 性等价于每个网至多有一个极限", "紧性等价于每个超滤收敛（Bourbaki 判据），是 Tychonoff 定理超滤证明的核心", "子网的定义需保序共尾映射，不能简单类比子列"],
        generalRequirements: ["在非第一可数空间中必须用网或滤子而不是序列", "使用子网必须给出共尾单调的指标映射而非任意子集", "用滤子刻画收敛时必须区分滤子、滤子基与超滤"],
        forbiddenErrors: ["【序列代网】在非第一可数空间用序列闭包或序列连续代替一般闭包与连续性", "【子网定义错】把子网当作指标集的任意子集限制", "【极限唯一性误设】非 Hausdorff 空间中假定网极限唯一", "【超滤存在性隐用】不声明就用超滤引理（依赖选择公理）", "【滤子层级混淆】把滤子基当滤子或把滤子当超滤使用"],
        parameterConstraints: { indexSetStructure: "网的指标集必须是有向集（预序 + 上界存在）", subnetDefinition: "子网需共尾且保序的指标映射", firstCountabilityFallback: "第一可数时网可退化为序列", choiceDependence: "超滤存在性依赖选择公理（超滤引理）" },
        closureChecks: ["确认所用收敛工具与空间的可数性假设匹配", "确认子网构造满足共尾保序条件", "确认极限唯一性主张附有 Hausdorff 前提", "确认滤子、滤子基、超滤三个层级使用正确"],
        scenarioChecks: { compactnessProof: ["用超滤收敛证明紧性时确认超滤引理已声明", "确认每个超滤的收敛点存在"], weakTopologyConvergence: ["弱拓扑或点态收敛拓扑中确认用网而非序列", "确认非第一可数性"], productSpaceConvergence: ["乘积空间中网收敛等价于逐坐标收敛", "确认该等价对箱拓扑失效"] },
    },
};
