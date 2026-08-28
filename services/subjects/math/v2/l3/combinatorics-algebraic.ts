import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数组合”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMBINATORICS_ALGEBRAIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 对称函数环与 Schur 函数基。
    "algcomb-symmetric-functions-schur": {
        id: "algcomb-symmetric-functions-schur", l2Key: "combinatorics-algebraic", name: "对称函数环与 Schur 函数", kind: "object",
        aliases: ["对称函数环", "Schur函数", "初等对称函数基", "半标准Young表权和"],
    },
    // RSK 对应与最长递增子序列。
    "algcomb-rsk-correspondence": {
        id: "algcomb-rsk-correspondence", l2Key: "combinatorics-algebraic", name: "RSK 对应", kind: "theorem",
        aliases: ["RSK对应", "Robinson-Schensted-Knuth对应", "插入算法双射", "最长递增子序列定理"],
    },
    // 钩长公式与标准 Young 表计数。
    "algcomb-hook-length-formula": {
        id: "algcomb-hook-length-formula", l2Key: "combinatorics-algebraic", name: "钩长公式", kind: "formula",
        aliases: ["钩长公式", "hook length formula", "标准Young表计数", "Frame-Robinson-Thrall公式"],
    },
    // Littlewood-Richardson 规则与 Schur 函数乘法。
    "algcomb-littlewood-richardson": {
        id: "algcomb-littlewood-richardson", l2Key: "combinatorics-algebraic", name: "Littlewood-Richardson 规则", kind: "theorem",
        aliases: ["Littlewood-Richardson规则", "LR系数", "Pieri规则", "斜表格反字典读法"],
    },
    // 对称群不可约特征标与 Murnaghan-Nakayama 规则。
    "algcomb-symmetric-group-characters": {
        id: "algcomb-symmetric-group-characters", l2Key: "combinatorics-algebraic", name: "对称群不可约特征标", kind: "theorem",
        aliases: ["对称群不可约特征标", "Specht模", "Murnaghan-Nakayama规则", "Frobenius特征标公式"],
    },
    // 偏序集 Möbius 函数与关联代数。
    "algcomb-poset-mobius-function": {
        id: "algcomb-poset-mobius-function", l2Key: "combinatorics-algebraic", name: "偏序集 Möbius 函数", kind: "theorem",
        aliases: ["偏序集Möbius函数", "关联代数", "偏序集反演公式", "偏序集特征多项式"],
    },
    // 拟阵与秩公理、贪心最优性。
    "algcomb-matroid-rank-greedy": {
        id: "algcomb-matroid-rank-greedy", l2Key: "combinatorics-algebraic", name: "拟阵与贪心最优性判据", kind: "criterion",
        aliases: ["拟阵", "秩函数公理", "贪心算法最优性判据", "基交换性质"],
    },
    // Tutte 多项式与删除收缩递推。
    "algcomb-tutte-polynomial": {
        id: "algcomb-tutte-polynomial", l2Key: "combinatorics-algebraic", name: "Tutte 多项式", kind: "formula",
        aliases: ["Tutte多项式", "删除收缩递推", "色多项式特化", "秩生成多项式"],
    },
    // 结合方案与 Bose-Mesner 代数。
    "algcomb-association-scheme": {
        id: "algcomb-association-scheme", l2Key: "combinatorics-algebraic", name: "结合方案与 Bose-Mesner 代数", kind: "object",
        aliases: ["结合方案", "Bose-Mesner代数", "对偶特征值矩阵", "Delsarte线性程序界"],
    },
    // 组合零点定理与多项式方法。
    "algcomb-combinatorial-nullstellensatz": {
        id: "algcomb-combinatorial-nullstellensatz", l2Key: "combinatorics-algebraic", name: "组合零点定理", kind: "theorem",
        aliases: ["组合零点定理", "Combinatorial Nullstellensatz", "Alon多项式方法", "非零系数判据"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMBINATORICS_ALGEBRAIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // 对称函数环与 Schur 函数基。
    "algcomb-symmetric-functions-schur": {
        definitions: ["对称函数环是无穷多变量下对称多项式按次数分层构成的分次环，其每一分次部分以拆分为下标的若干组基（单项、初等、完全齐次、幂和、Schur）张成；Schur 函数是与对称群及一般线性群表示论对应的正交基"],
        formulas: ["分次结构：Lambda = ⊕_n Lambda^n，dim Lambda^n = p(n)（拆分数）", "五组基：m_lambda（单项）、e_lambda（初等）、h_lambda（完全齐次）、p_lambda（幂和）、s_lambda（Schur），均以 lambda 遍历 n 的拆分为下标", "生成函数：prod (1 + x_i t) = sum e_n t^n，prod 1/(1 - x_i t) = sum h_n t^n，故 sum (-1)^k e_k h_{n-k} = 0（n >= 1）", "组合定义：s_lambda = sum_T x^T，T 遍历形状 lambda 的半标准 Young 表", "双行列式（Jacobi-Trudi）：s_lambda = det(h_{lambda_i - i + j}) = det(e_{lambda'_i - i + j})（对偶形式）", "Cauchy 恒等式：prod_{i,j} 1/(1 - x_i y_j) = sum_lambda s_lambda(x) s_lambda(y)"],
        theorems: ["对称函数基本定理：Lambda 在 Z 上由 e_1, e_2, ... 自由生成多项式环，故 e_lambda 是 Z-基；而 p_lambda 只在 Q 上构成基（幂和与初等的转换含分母），把 p 当整基使用是错误的", "Schur 函数在 Hall 内积 <s_lambda, s_mu> = delta_{lambda mu} 下正交归一，并对应对称群不可约特征标（特征标映射 ch: s_lambda ↦ chi^lambda）与 GL_n 不可约多项式表示，故对称函数恒等式与表示论分解一一对应", "变量数目必须与拆分长度相容：截断到 n 个变量时 s_lambda(x_1,...,x_n) = 0 当 lambda 长度超过 n，忽略此退化会得到错误的零和非零判断", "s_lambda 的系数（Kostka 数 K_{lambda mu}）非负且计数半标准表，故 Schur 函数在单项基下的展开自动具有组合正性；反之不是所有对称函数在 Schur 基下都有非负展开（正性需要额外证明）", "对偶（omega）对合把 e_n 与 h_n 互换、s_lambda 与 s_{lambda'} 互换，故共轭拆分层面的恒等式可由该对合自动得到，这是减少一半工作量的标准技巧"],
        generalRequirements: ["必须指明所用基与变量个数（有限截断或无穷变量）", "使用 p_lambda 作基时须声明系数域含 Q", "Schur 函数的组合断言须指明半标准表的严格性方向"],
        forbiddenErrors: ["【整基误用】把 p_lambda 当作 Z 上的基使用", "【长度退化漏检】拆分长度超过变量数仍断言非零", "【表格严格性错】半标准表列严格行弱增的条件写反", "【正性误推】不加证明地断言任意对称函数的 Schur 展开非负", "【内积基错】在非 Schur 基上直接套用正交归一关系"],
        parameterConstraints: { partitionIndex: "基的下标须为 n 的拆分。", variableCount: "须声明变量个数与截断。", coefficientRing: "p_lambda 作基须在 Q 上。", tableauSemistandard: "半标准表要求行弱增、列严格增。" },
        closureChecks: ["确认分次与拆分下标。", "选择合适基并写出转换关系。", "用 Jacobi-Trudi 或组合定义验证恒等式。", "核对变量截断导致的退化。"],
        scenarioChecks: { basisConversion: ["写出目标基与源基", "用生成函数或转换矩阵", "核对系数所在环"], schurExpansion: ["列出半标准表", "读出 Kostka 数", "验证展开系数非负"], representationDictionary: ["用特征标映射对应 s_lambda", "翻译乘法为张量分解", "核对 GL 与 S_n 两侧的字典"] },
    },
    // RSK 对应与最长递增子序列。
    "algcomb-rsk-correspondence": {
        definitions: ["RSK 对应把矩阵或双行序列（特别地把置换）双射地对应到一对同形状的（半）标准 Young 表，插入与推出算法给出显式构造，形状同时编码递增与递减子序列结构"],
        formulas: ["置换情形：S_n 与 {(P, Q) : P, Q 同形状 lambda 的标准 Young 表} 双射，故 sum_{lambda ⊢ n} f_lambda^2 = n!（f_lambda 为标准表数）", "一般 RSK：非负整数矩阵与同形状半标准表对 (P, Q) 双射，给出 Cauchy 恒等式 prod 1/(1-x_i y_j) = sum s_lambda(x) s_lambda(y) 的组合证明", "Schensted 定理：lambda_1 = 最长递增子序列长度，lambda'_1（列数）= 最长递减子序列长度", "Greene 定理：lambda_1 + ... + lambda_k = 最多 k 个递增子序列的并的最大长度", "逆序性质：RSK(w^{-1}) = (Q, P)，故 w 为对合 <=> P = Q，从而对合数 = sum_lambda f_lambda", "Erdős-Szekeres 推论：n > (r-1)(s-1) 的序列必含长 r 递增或长 s 递减子序列"],
        theorems: ["形状唯一性是定理内容：插入路径的“撞出”规则保证 P 的形状与插入顺序的相容性，任意改动插入规则（如列插入与行插入混用）都会破坏双射", "Schensted 结论只给第一行与第一列，其余行长必须用 Greene 定理刻画：把 lambda_2 直接解释为“第二长递增子序列”是错误的", "RSK 是保持权重的，故它把矩阵的行和列和分别翻译为 Q 与 P 的权，这正是它证明 Cauchy 恒等式的机制；忽略权对应只剩计数双射，不能推出对称函数恒等式", "对称矩阵情形（RSK 的对称版本）给出 P = Q，从而计数对合并联系到 Schur 函数的单变量特化；一般矩阵不具备该性质", "Erdős-Szekeres 的 RSK 证明比抽屉原理证明多给出结构信息（形状），故当题目要求极值构造而非仅存在性时应采用 RSK 视角"],
        generalRequirements: ["必须写明插入算法方向（行插入或列插入）与撞出规则", "使用 Schensted/Greene 结论须指明对应的行或列", "权对应结论须说明双行序列的读法"],
        forbiddenErrors: ["【行长误释】把 lambda_2 说成第二长递增子序列", "【算法混用】行插入与列插入规则混合使用", "【权忽略】用 RSK 证对称函数恒等式却不追踪权", "【对称性滥用】对非对称矩阵断言 P = Q", "【双射方向缺失】只给一方向构造即宣称双射"],
        parameterConstraints: { insertionRule: "须固定行插入或列插入。", sameShape: "P 与 Q 必须同形状。", weightTracking: "对称函数应用须追踪权。", symmetricCase: "P = Q 仅在对称输入下成立。" },
        closureChecks: ["写出插入算法与记录表规则。", "验证 P、Q 同形状。", "用 Schensted 或 Greene 读出子序列信息。", "需要恒等式时核对权的对应。"],
        scenarioChecks: { longestIncreasing: ["对序列作 RSK", "读出 lambda_1 与 lambda'_1", "得最长递增与递减长度"], identityProof: ["把恒等式两边解释为表对与矩阵", "构造保权双射", "核对权的对应"], involutionCount: ["用 RSK 的逆序性质", "取 P = Q", "得对合数等于标准表数之和"] },
    },
    // 钩长公式与标准 Young 表计数。
    "algcomb-hook-length-formula": {
        definitions: ["钩长公式用形状中每格的钩长乘积给出标准 Young 表的个数，等价地给出对称群不可约表示的维数；钩长为该格右侧格数加下方格数加一"],
        formulas: ["钩长：h(i, j) = lambda_i - j + lambda'_j - i + 1", "钩长公式：f^lambda = n! / prod_{(i,j) ∈ lambda} h(i, j)，n = |lambda|", "行列式形式：f^lambda = n! det(1/(lambda_i - i + j)!)", "Vandermonde 形式：取 l_i = lambda_i + k - i，则 f^lambda = n! prod_{i<j}(l_i - l_j) / prod_i l_i!", "维数关系：sum_{lambda ⊢ n} (f^lambda)^2 = n!（由 RSK 或 Burnside 得到）", "钩内容公式（半标准计数）：s_lambda(1^k) = prod_{(i,j)} (k + j - i)/h(i,j)"],
        theorems: ["钩长只依赖形状而非填数，故公式对同一形状的全部标准表统一给出计数；把钩长与内容 (j - i) 混用会得到半标准而非标准表的计数", "分母是钩长的乘积而不是行长或列长的乘积：对钩形 (n-k, 1^k) 等极端形状，用行列长乘积会给出错误答案，必须逐格计算钩长", "f^lambda 同时是 Specht 模 S^lambda 的维数，因此 sum (f^lambda)^2 = n! 是正则表示分解的直接推论；这一恒等式可用来自检所有 f^lambda 的计算", "公式的成立要求 lambda 为拆分（行长弱递减）：对斜形状 lambda/mu 不存在同样简洁的乘积公式（须用 Aitken 行列式或 Naruse 的钩长公式），套用普通钩长公式是错误的", "钩长公式的概率证明（Greene-Nijenhuis-Wilf 的钩走）给出均匀随机标准表的抽样算法，故当问题要求随机生成而非计数时应引用该构造"],
        generalRequirements: ["必须逐格给出钩长的计算方式", "必须确认形状是普通拆分而非斜形状", "维数解释须声明 Specht 模的域为特征零"],
        forbiddenErrors: ["【钩长误算】用行长或列长乘积代替钩长乘积", "【内容混淆】把钩长与内容 j - i 混用", "【斜形状套用】对 lambda/mu 直接用普通钩长公式", "【自检缺失】不用 sum (f^lambda)^2 = n! 校验结果", "【特征假设遗漏】在特征 p 下断言维数等于 f^lambda"],
        parameterConstraints: { partitionShape: "lambda 须为弱递减拆分。", hookDefinition: "h(i,j) = lambda_i - j + lambda'_j - i + 1。", totalSize: "n = |lambda|。", characteristicZero: "维数解释须在特征零。" },
        closureChecks: ["画出形状并逐格标注钩长。", "代入 n! / prod h 计算。", "用行列式或 Vandermonde 形式复核。", "用 sum (f^lambda)^2 = n! 自检。"],
        scenarioChecks: { tableauCount: ["写出形状", "计算钩长乘积", "得 f^lambda"], representationDimension: ["把形状对应 Specht 模", "用钩长公式给维数", "核对正则表示分解"], randomTableau: ["用钩走算法", "按钩长概率选格", "得均匀随机标准表"] },
    },
    // Littlewood-Richardson 规则与 Schur 函数乘法。
    "algcomb-littlewood-richardson": {
        definitions: ["Littlewood-Richardson 规则给出两个 Schur 函数乘积在 Schur 基下的展开系数，其组合模型为形状 lambda/mu 的斜表格中满足反字典读词为格子词（lattice word）的填法计数；该系数同时是 GL_n 张量分解重数与斜表格计数"],
        formulas: ["展开：s_mu s_nu = sum_lambda c^lambda_{mu nu} s_lambda，|lambda| = |mu| + |nu|", "组合模型：c^lambda_{mu nu} = 权为 nu 的 lambda/mu 斜半标准表中反字典读词为格子词的个数", "Pieri 规则：s_mu h_r = sum s_lambda（lambda/mu 为水平 r-条），s_mu e_r = sum s_lambda（lambda/mu 为竖直 r-条）", "对称性：c^lambda_{mu nu} = c^lambda_{nu mu}，且 c^lambda_{mu nu} = c^{lambda'}_{mu' nu'}", "必要条件：c^lambda_{mu nu} ≠ 0 ⇒ mu ⊆ lambda、nu ⊆ lambda 且 lambda 与 mu + nu 满足优先序 lambda <= mu + nu（Horn 型不等式给完整刻画）", "斜 Schur 展开：s_{lambda/mu} = sum_nu c^lambda_{mu nu} s_nu"],
        theorems: ["LR 系数非负是组合模型的直接结论，也对应张量积重数的表示论意义；任何给出负系数的“展开”必然计算有误，这是最有效的自检", "格子词条件不可省略：只数斜半标准表会严重高估系数，Kostka 数与 LR 系数的区别正在于此", "Pieri 规则是 nu 为单行或单列的特例，此时格子词条件自动满足，故只有在这两种特例下才允许用“加条形”的简单描述；一般情形必须回到完整规则", "LR 系数的计算是 #P 困难的，但非零性判定属于 P（由 Horn 不等式与 Knutson-Tao 蜂巢模型），因此判断是否出现某分量与算出重数应采用不同工具", "同一系数有多种等价模型（LR 斜表、蜂巢、Berenstein-Zelevinsky 三角形、拼图 puzzle），换模型可大幅简化计算，但必须完整搬移约束条件而不能只搬形状"],
        generalRequirements: ["必须给出斜形状与权并写出格子词条件的验证", "使用 Pieri 规则须确认 nu 为单行或单列", "结论须核对 |lambda| = |mu| + |nu| 与包含关系"],
        forbiddenErrors: ["【格子词省略】只数斜半标准表而不验证反字典读词条件", "【Pieri 滥用】一般 nu 也用加条形的简化描述", "【度数不平衡】展开中出现 |lambda| ≠ |mu| + |nu| 的项", "【负系数】给出负的 LR 系数", "【模型混搭】换用蜂巢或拼图模型却不搬移全部约束"],
        parameterConstraints: { degreeAdditivity: "|lambda| = |mu| + |nu|。", containment: "须有 mu ⊆ lambda 与 nu ⊆ lambda。", latticeWord: "反字典读词须为格子词。", nonnegativity: "系数须为非负整数。" },
        closureChecks: ["确认三个拆分的大小与包含关系。", "枚举斜表并验证格子词条件。", "读出系数并检验非负性。", "必要时用对称性或共轭自检。"],
        scenarioChecks: { schurProduct: ["写出 mu、nu", "枚举满足条件的斜表", "得 s_mu s_nu 的展开"], tensorMultiplicity: ["把 LR 系数解释为张量重数", "验证权守恒", "读出出现的不可约分量"], pieriSpecialCase: ["确认 nu 为单行或单列", "按水平或竖直条加格", "直接写出展开"] },
    },
    // 对称群不可约特征标与 Murnaghan-Nakayama 规则。
    "algcomb-symmetric-group-characters": {
        definitions: ["对称群的不可约复表示由 n 的拆分索引（Specht 模 S^lambda），其特征标可由 Frobenius 公式或 Murnaghan-Nakayama 递推计算；后者按循环型逐段剥去边缘钩，符号由钩的行跨度决定"],
        formulas: ["分类：S_n 的不可约复表示 ↔ n 的拆分 lambda，dim S^lambda = f^lambda（钩长公式）", "Frobenius 特征标公式：p_rho = sum_lambda chi^lambda(rho) s_lambda，即幂和在 Schur 基下的展开系数即特征标值", "Murnaghan-Nakayama：chi^lambda(rho) = sum_{xi} (-1)^{ht(xi)} chi^{lambda \\ xi}(rho 去掉一段)，xi 遍历长度为该循环长的边缘钩（rim hook），ht 为所跨行数减一", "特殊值：chi^lambda(1^n) = f^lambda；chi^{(n)} = 1（平凡），chi^{(1^n)} = sign", "正交关系：sum_rho |C_rho| chi^lambda(rho) chi^mu(rho) / n! = delta_{lambda mu}", "分支规则：S^lambda 限制到 S_{n-1} 分解为 ⊕ S^{lambda - 格}，诱导为 ⊕ S^{lambda + 格}"],
        theorems: ["特征标值全为整数，这是对称群的特殊性质（源于每个元素与其幂共轭）；出现非整数特征标值即计算有误，这是最快的自检", "Murnaghan-Nakayama 的符号 (-1)^{ht} 不可省略：剥钩时跨越多行会带来负号，只作正项求和会得到错误的（且违反正交关系的）结果", "剥去的必须是边缘钩（连通且去掉后仍为拆分）：任意选取长度合适的格集会破坏递推，故每一步都要验证剩余形状仍是拆分", "Frobenius 公式说明特征标表就是幂和基到 Schur 基的转换矩阵，故特征标计算与对称函数计算是同一件事；这也解释为何 p_lambda 只在 Q 上成基却给出整特征标", "特征零的完全可约性与拆分分类在模表示（特征 p 整除 n!）下失效：此时 Specht 模可能不可约性改变且维数不再由钩长公式给出，故所有结论必须声明特征零"],
        generalRequirements: ["必须声明基域为特征零的复数域", "使用 Murnaghan-Nakayama 须逐步验证边缘钩合法性与符号", "结果须用整值性与正交关系自检"],
        forbiddenErrors: ["【符号遗漏】剥钩递推中不带 (-1)^{ht}", "【非法钩】剥去的格集非连通边缘钩或剩余非拆分", "【非整值】给出非整数特征标值", "【模表示混用】特征 p 情形沿用特征零分类", "【维数误用】把 chi^lambda 在非单位元处的值当作维数"],
        parameterConstraints: { characteristicZero: "结论限于特征零。", partitionLabel: "不可约表示由拆分索引。", rimHook: "剥去的必须是边缘钩。", heightSign: "符号为 (-1)^{跨行数-1}。" },
        closureChecks: ["确定形状与循环型。", "按循环长逐次剥边缘钩并记录符号。", "递推到空形状读出特征标值。", "用整值性与正交关系检验。"],
        scenarioChecks: { characterValue: ["写出 lambda 与共轭类循环型", "运行 Murnaghan-Nakayama", "得整数特征标值"], dimensionCheck: ["取单位元循环型 1^n", "用钩长公式", "核对与递推结果一致"], branchingDecomposition: ["按加减一格规则分解", "核对维数守恒", "读出分支重数"] },
    },
    // 偏序集 Möbius 函数与关联代数。
    "algcomb-poset-mobius-function": {
        definitions: ["有限偏序集的关联代数由区间上的函数与卷积构成，其单位元的逆即 Möbius 函数；它把偏序集上的求和关系反演，是容斥原理的结构化推广，并通过特征多项式与拓扑（序复形）联系"],
        formulas: ["卷积：(f * g)(x, y) = sum_{x <= z <= y} f(x, z) g(z, y)", "递推定义：mu(x, x) = 1，且 sum_{x <= z <= y} mu(x, z) = 0（x < y），即 mu(x, y) = - sum_{x <= z < y} mu(z, y)", "反演公式：g(x) = sum_{y <= x} f(y) ⟺ f(x) = sum_{y <= x} mu(y, x) g(y)", "布尔格：mu(S, T) = (-1)^{|T| - |S|}，反演即容斥原理", "整除格：mu(1, n) 等于数论 Möbius 函数；乘积偏序集：mu 为各因子 mu 之积", "特征多项式：chi_L(t) = sum_{x ∈ L} mu(0, x) t^{rk(L) - rk(x)}；Weisner/Crapo 定理给出 mu 的加权求和公式"],
        theorems: ["Möbius 函数由局部区间递推唯一确定，故它是偏序集的组合不变量而非附加结构；两个偏序集若区间结构不同则 mu 不同，不能凭元素个数猜测", "Möbius 函数与拓扑相连（Philip Hall 定理）：mu(x, y) 等于开区间 (x, y) 的序复形的约化 Euler 特征，故 mu 的符号与量级受拓扑约束，纯代数计算结果可用拓扑复核", "交半格上有 Weisner 定理与 crosscut 定理简化计算；把一般偏序集上的公式套用到不具备格结构的偏序集是错误的", "反演方向必须与求和方向一致：下集求和用 mu(y, x) 的一种顺序，上集求和用另一种，写反顺序会得到错误公式，且在非自对偶偏序集上二者确实不同", "几何格的 Möbius 函数符号交错（mu(0,x) 的符号为 (-1)^{rk(x)}），故特征多项式系数交错，这给出色多项式与超平面配置区域数（Zaslavsky 定理）的正性结论；一般偏序集不具此性质"],
        generalRequirements: ["必须给出偏序集的区间结构与秩函数（若使用）", "反演公式须写明求和方向与 mu 的参数顺序", "使用格上定理须先验证格或几何格条件"],
        forbiddenErrors: ["【方向写反】反演中 mu 的两个参数顺序颠倒", "【结构假设缺失】非格偏序集套用 Weisner 或 crosscut 定理", "【符号臆断】非几何格仍断言 mu 符号交错", "【乘积性误用】非直积分解仍用 mu 的乘积公式", "【区间不闭】对非有限区间偏序集直接递推"],
        parameterConstraints: { locallyFinite: "偏序集须局部有限。", muRecursion: "由 sum_{x<=z<=y} mu(x,z) = 0 递推。", inversionDirection: "反演须与求和方向匹配。", latticeHypothesis: "格上定理须验证格结构。" },
        closureChecks: ["画出 Hasse 图并确定区间。", "自底向上递推计算 mu。", "写出与求和方向匹配的反演公式。", "用拓扑或已知特例（布尔格、整除格）复核。"],
        scenarioChecks: { inclusionExclusion: ["把问题建模为布尔格", "取 mu = (-1)^{|T|-|S|}", "得容斥公式"], characteristicPolynomial: ["计算 mu(0, x)", "按秩加权求和", "得特征多项式与区域计数"], divisorLattice: ["把整除关系建为格", "用乘积性分解到素幂", "得数论 Möbius 函数值"] },
    },
    // 拟阵与秩公理、贪心最优性。
    "algcomb-matroid-rank-greedy": {
        definitions: ["拟阵是把线性无关性与图的无环性统一抽象出的结构，可由独立集、基、圈、秩函数或闭包等价地公理化；其核心判据是贪心算法对任意权重都给出最优基当且仅当结构为拟阵"],
        formulas: ["独立集公理：∅ ∈ I；I 下闭；交换公理 |A| < |B| ⇒ 存在 x ∈ B \\ A 使 A ∪ {x} ∈ I", "秩函数公理：r(∅) = 0；r(A) <= r(A ∪ {x}) <= r(A) + 1；次模性 r(A ∪ B) + r(A ∩ B) <= r(A) + r(B)", "基交换性质：B_1, B_2 为基且 x ∈ B_1 \\ B_2 ⇒ 存在 y ∈ B_2 \\ B_1 使 (B_1 - x) ∪ {y} 为基", "圈公理：无圈真包含另一圈；C_1 ≠ C_2 且 e ∈ C_1 ∩ C_2 ⇒ (C_1 ∪ C_2) - e 含圈", "对偶：r*(A) = |A| - r(E) + r(E \\ A)，基为原基的补", "拟阵并与交：拟阵并的秩由 Nash-Williams 公式给出（多项式可解），一般两个拟阵的交最大化可解，三个拟阵的交为 NP 困难"],
        theorems: ["贪心最优性是拟阵的刻画性质（Rado-Edmonds）：若对一切权函数按权降序贪心都得最优独立集，则该独立系统必为拟阵；因此“贪心可行”不能只在个别权重上验证", "次模性是秩公理的实质内容，等价于交换公理；缺少次模性的“秩函数”不定义拟阵，故构造新拟阵时必须验证次模不等式而非仅单调性", "所有基等势（r(E)）是定理而非定义的一部分；断言存在不同大小的基即说明所给结构不是拟阵", "对偶运算是对合（(M*)* = M）且把删除与收缩互换，因此关于圈的结论可自动转成关于割的结论；但对偶不保持可表示性（存在图拟阵的对偶非图拟阵，如 K_5 的对偶）", "并非所有拟阵都可由矩阵表示：Vámos 拟阵不可表示，且可表示性依赖域（如 U_{2,4} 在 GF(2) 上不可表示），因此不能默认拟阵来自向量组"],
        generalRequirements: ["必须指明所用的公理系统并完整验证", "断言贪心最优须先确认拟阵结构", "使用对偶或表示性结论须说明前提"],
        forbiddenErrors: ["【次模缺验】只验证单调性即宣称秩函数", "【贪心倒推】由单个权重上贪心成功断言拟阵", "【基不等势】允许不同大小的基", "【表示性默认】默认任意拟阵有向量表示", "【对偶误推】由对偶结论直接断言保持图性质"],
        parameterConstraints: { groundSetFinite: "基集须有限。", submodularity: "秩函数须次模。", equicardinalBases: "所有基等势。", greedyEquivalence: "贪心最优性须对一切权函数成立。" },
        closureChecks: ["写出基集与独立集族。", "验证交换公理或次模性。", "确认基等势与秩值。", "需要算法结论时引用贪心或交定理。"],
        scenarioChecks: { greedyOptimality: ["验证结构为拟阵", "按权降序贪心", "断言所得基最优"], graphicMatroid: ["取边集为基集、森林为独立集", "秩为 n - 分支数", "对偶得割拟阵"], matroidIntersection: ["把问题写为两拟阵公共独立集", "引用交定理", "说明三拟阵情形不可推广"] },
    },
    // Tutte 多项式与删除收缩递推。
    "algcomb-tutte-polynomial": {
        definitions: ["Tutte 多项式是图（或拟阵）上由删除-收缩递推唯一确定的二元不变量，可等价地由秩生成多项式的替换定义；它统一了色多项式、流多项式与可靠性多项式等诸多计数"],
        formulas: ["秩生成形式：T(G; x, y) = sum_{A ⊆ E} (x - 1)^{r(E) - r(A)} (y - 1)^{|A| - r(A)}，r(A) = n - c(A)", "递推：e 既非环也非桥时 T(G) = T(G/e) + T(G \\ e)；e 为桥 T = x T(G/e)；e 为环 T = y T(G \\ e)；无边图 T = 1", "色多项式特化：P(G; k) = (-1)^{n - c} k^c T(G; 1 - k, 0)", "流多项式：F(G; k) = (-1)^{|E| - r} T(G; 0, 1 - k)；可靠性：R(p) 由 T(G; 1, 1/(1-p)) 型特化给出", "特殊值：T(G;1,1) = 生成树数（连通时）、T(G;2,1) = 森林数、T(G;1,2) = 生成连通子图数、T(G;2,2) = 2^{|E|}", "对偶（平面图）：T(G; x, y) = T(G*; y, x)"],
        theorems: ["递推的结果与删除-收缩的顺序无关（良定性），这一点必须由秩生成形式保证；仅凭递推式作定义时不同顺序可能给出不一致结果，故计算完成后应用某个已知特殊值自检", "桥与环必须在递推前识别：把桥当作普通边会漏掉 x 因子，把环当作普通边会漏掉 y 因子，这是最常见的计算错误来源", "色多项式的符号与前因子 (-1)^{n-c} k^c 不可省略：直接令 x = 1-k, y = 0 得到的不是色多项式本身，忽略归一化会得到符号与次数错误的答案", "计算 Tutte 多项式在一般图上是 #P 困难的（除若干特殊点如 (1,1) 的近似与 (2,2) 等），故对大图只能用结构分解（并联串联、张量积）而不能期待多项式算法", "平面对偶交换两个变量，故平面图的色多项式与流多项式互为对偶；这一对偶只对平面图成立，非平面图上无对应关系（拟阵层面则对偶总成立）"],
        generalRequirements: ["必须显式区分环、桥与普通边", "特化到色或流多项式须写全前因子", "递推结果须用已知特殊值自检"],
        forbiddenErrors: ["【桥环误判】把桥或环当作普通边递推", "【前因子遗漏】色多项式特化省略 (-1)^{n-c} k^c", "【顺序依赖】声称递推顺序影响结果", "【复杂度臆断】断言存在一般图的多项式算法", "【对偶滥用】对非平面图使用 T(G;x,y) = T(G*;y,x)"],
        parameterConstraints: { edgeClassification: "须区分环、桥、普通边。", rankFunction: "r(A) = n - c(A)。", specializationFactor: "特化须保留符号与前因子。", planarDuality: "变量交换仅限平面图。" },
        closureChecks: ["识别环与桥并处理相应因子。", "对普通边作删除-收缩递推。", "汇总得二元多项式。", "用 T(1,1) 或 T(2,2) 自检。"],
        scenarioChecks: { chromaticSpecialization: ["计算 T(G;x,y)", "代入 x = 1-k, y = 0", "乘上 (-1)^{n-c} k^c"], spanningTreeCount: ["取 T(G;1,1)", "核对连通性前提", "与矩阵树定理结果比对"], planarDualCheck: ["构造平面对偶图", "交换变量比对", "确认对偶关系成立"] },
    },
    // 结合方案与 Bose-Mesner 代数。
    "algcomb-association-scheme": {
        definitions: ["结合方案是把有限集上的“距离关系”公理化的组合结构：一族关系的邻接矩阵满足 A_0 = I、sum A_i = J 且乘积在其线性张成内封闭，这个张成即 Bose-Mesner 代数；它同时具有矩阵基与幂等基，是编码与设计界的代数框架"],
        formulas: ["公理：A_0 = I；sum_{i=0}^{d} A_i = J；每个 A_i 的转置仍在关系族中；A_i A_j = sum_k p^k_{ij} A_k，p^k_{ij} 为交叉数", "Bose-Mesner 代数 A = span{A_0, ..., A_d} 是 (d+1) 维的交换半单代数，故有第二组基：正交投影幂等 E_0 = J/|X|, ..., E_d，满足 E_i E_j = delta_{ij} E_i，sum E_j = I", "两组基的转换：A_i = sum_j P_{ji} E_j，E_j = (1/|X|) sum_i Q_{ij} A_i；P 为第一特征值矩阵，Q 为第二特征值矩阵", "对偶关系：P Q = Q P = |X| I；且 m_j P_{ji} = k_i (Q_{ij})^*，其中 k_i = p^0_{ii*} 为价数、m_j = rank E_j 为重数", "Delsarte 线性程序：内分布 a_i = |{(x,y) ∈ Y^2 : (x,y) ∈ R_i}| / |Y| 满足 a_i >= 0、a_0 = 1、(a Q)_j >= 0，最大化 sum a_i 得码大小上界", "Krein 条件 q^k_{ij} >= 0 与绝对界 |Y| <= m_j(m_j + 3)/2 型不等式给出附加限制"],
        theorems: ["Bose-Mesner 代数的交换性等价于 p^k_{ij} = p^k_{ji}，而对称性（每个 A_i 对称）是更强的条件：对称方案必交换，反之不然；把交换方案当作对称方案会错误地断言特征值全为实数", "同时可对角化是核心结构定理：所有 A_i 在同一组公共特征空间上对角化，故特征值矩阵 P 完全决定方案的谱信息；任何“各关系各自对角化”的论证都失去了方案的全部力量", "距离正则图恰对应 P-多项式（度量）方案：此时 A_i 是 A_1 的 i 次多项式，交叉数由交叉数组 {b_i, c_i} 决定；一般方案不具此性质，不能默认关系由单个关系生成", "Delsarte 线性程序界的成立只依赖内分布的非负性与 (aQ)_j >= 0 这两族约束，故它对任何子集都有效；但它是上界而非可达值，用 LP 最优解断言码存在是错误的", "可行的参数组（满足交叉数恒等式、Krein 条件与绝对界）不保证方案存在：参数可行性只是必要条件，存在性需显式构造或穷尽排除"],
        generalRequirements: ["必须写出关系族并验证 A_0 = I、sum A_i = J 与乘积封闭", "使用特征值矩阵须说明 P、Q 的定义方向与对偶关系", "引用 LP 界须完整列出非负性约束并声明这是上界"],
        forbiddenErrors: ["【公理缺验】未验证乘积封闭即称结合方案", "【对称交换混淆】把交换方案当对称方案并断言实特征值", "【度量性默认】默认 A_i 是 A_1 的多项式", "【界当可达】用 Delsarte LP 最优值断言码存在", "【参数即存在】由参数可行性断言方案存在"],
        parameterConstraints: { schemeAxioms: "须满足 A_0 = I、sum A_i = J、乘积封闭。", commutativity: "交换性等价于 p^k_{ij} 对称。", dualityPQ: "P Q = |X| I。", lpDirection: "Delsarte 程序给出上界。" },
        closureChecks: ["列出关系族并验证方案公理。", "计算交叉数与 Bose-Mesner 代数维数。", "求公共特征空间得 P、Q 与重数。", "需要界时建立并求解 Delsarte 线性程序。"],
        scenarioChecks: { schemeVerification: ["写出所有 A_i", "验证 A_0 = I 与 sum A_i = J", "验证乘积在张成内封闭"], eigenvalueComputation: ["取公共特征空间分解", "读出 P_{ji} 与重数 m_j", "用 P Q = |X| I 自检"], delsarteBound: ["写出内分布 a_i", "施加 a_i >= 0 与 (aQ)_j >= 0", "求 LP 最优值作为上界"] },
    },
    // 组合零点定理与多项式方法。
    "algcomb-combinatorial-nullstellensatz": {
        definitions: ["组合零点定理是 Alon 提出的多项式方法核心工具：若多项式在一族有限集的笛卡尔积上处处为零，则其某个“满次数”单项式的系数必为零；反用之，只要找到一个次数达到总次数上界且系数非零的单项式，就能断言存在使多项式非零的取值点"],
        formulas: ["定理：F 为任意域，S_1, ..., S_n ⊆ F 有限，f ∈ F[x_1, ..., x_n]，deg f = sum t_i，且 x_1^{t_1} ... x_n^{t_n} 的系数非零，|S_i| > t_i，则存在 (s_1, ..., s_n) ∈ S_1 × ... × S_n 使 f(s) ≠ 0", "对照的零化多项式：g_i(x_i) = prod_{s ∈ S_i} (x_i - s)，任何在积集上恒零的 f 都落在由 g_i 生成的理想中", "Cauchy-Davenport：|A + B| >= min(p, |A| + |B| - 1)（Z_p 中），由 f = prod_{a,b}(x + y - a - b) 与系数 C(|A|+|B|-2, |A|-1) ≠ 0 得出", "Erdős-Ginzburg-Ziv、Snevily 猜想的特例、以及 Z_p 上的限制和估计均由同一模板给出", "Chevalley-Warning：特征 p 域上若 sum deg f_i < n 则公共零点个数被 p 整除，是同族的“次数低于变量数”结论", "Alon-Füredi：不覆盖全部格点的超曲面的次数下界，给出与零点定理互补的计数形式"],
        theorems: ["非零系数的单项式必须是总次数达到 deg f 的那个：若选取的 x^{t} 的总次数低于 deg f，定理不适用，此时系数非零也推不出任何结论，这是最常见的误用", "条件 |S_i| > t_i 对每个 i 都必须逐一验证：只要有一个集合过小，结论即失效，且此时确实存在反例（如 f = g_i 本身在 S_i 上恒零）", "定理对任意域成立（不需特征零、不需代数封闭），但集合必须有限；把它用到无限集合上是把“存在非零点”这一有限性结论错误外推", "定理只给出存在性而不定位取值点，也不给出非零点个数；由它得到的加性组合下界通常是最优的，但不能反推构造", "在图论应用（正则子图存在性、平面图的列表着色、可选择性上界）中，多项式的构造与所选单项式必须显式给出：只声称“用多项式方法”而不给出 f 与非零系数的验证不构成证明"],
        generalRequirements: ["必须写出多项式 f、集合 S_i 与所用单项式并验证系数非零", "必须逐一验证 |S_i| > t_i 与 sum t_i = deg f", "结论只能声明存在性，不得声明构造或计数"],
        forbiddenErrors: ["【次数不足】所选单项式总次数低于 deg f", "【集合过小】未验证 |S_i| > t_i", "【无限集外推】把定理用于无限集合", "【系数未验】不计算即断言系数非零", "【存在当构造】由存在性断言具体取值点或个数"],
        parameterConstraints: { degreeMatch: "sum t_i = deg f。", setSize: "每个 i 须满足 |S_i| > t_i。", finiteSets: "S_i 须为有限集。", anyField: "域可任意，无需特征零。" },
        closureChecks: ["把命题转写为“存在使 f ≠ 0 的取值”。", "构造 f 并确定候选单项式 x^{t}。", "验证总次数相等、系数非零与 |S_i| > t_i。", "读出存在性结论并说明不含构造。"],
        scenarioChecks: { additiveLowerBound: ["构造和集对应的 f", "计算二项系数确认非零", "得 Cauchy-Davenport 型下界"], graphColoring: ["写出图多项式", "找出满次数非零系数单项式", "断言列表着色可行"], degreeArgument: ["比较 sum deg f_i 与 n", "引用 Chevalley-Warning", "得零点个数的整除性"] },
    },
};
