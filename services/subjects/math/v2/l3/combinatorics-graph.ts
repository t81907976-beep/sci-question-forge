import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“图论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMBINATORICS_GRAPH_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 欧拉回路与 Hamilton 回路的判据差异。
    "graph-euler-hamilton-criteria": {
        id: "graph-euler-hamilton-criteria", l2Key: "combinatorics-graph", name: "欧拉回路与 Hamilton 回路判据", kind: "criterion",
        aliases: ["欧拉回路判据", "Hamilton回路", "Dirac定理", "Ore条件"],
    },
    // 矩阵树定理与生成树计数。
    "graph-matrix-tree-theorem": {
        id: "graph-matrix-tree-theorem", l2Key: "combinatorics-graph", name: "矩阵树定理与生成树计数", kind: "theorem",
        aliases: ["矩阵树定理", "Kirchhoff定理", "Laplace矩阵余子式", "生成树计数"],
    },
    // Menger 定理与连通度的极小-极大关系。
    "graph-menger-connectivity": {
        id: "graph-menger-connectivity", l2Key: "combinatorics-graph", name: "Menger 定理与连通度", kind: "theorem",
        aliases: ["Menger定理", "点连通度", "边连通度", "内部不交路径"],
    },
    // Hall 定理与 König 定理：二部图匹配的对偶。
    "graph-hall-konig-matching": {
        id: "graph-hall-konig-matching", l2Key: "combinatorics-graph", name: "Hall 定理与 König 定理", kind: "theorem",
        aliases: ["Hall婚配定理", "König定理", "二部图最大匹配", "最小点覆盖"],
    },
    // Tutte 定理与 Berge-Tutte 公式。
    "graph-tutte-berge-matching": {
        id: "graph-tutte-berge-matching", l2Key: "combinatorics-graph", name: "Tutte 定理与 Berge-Tutte 公式", kind: "theorem",
        aliases: ["Tutte定理", "Berge-Tutte公式", "完美匹配存在性", "奇分支计数"],
    },
    // 最大流最小割定理与增广路方法。
    "graph-maxflow-mincut": {
        id: "graph-maxflow-mincut", l2Key: "combinatorics-graph", name: "最大流最小割定理", kind: "theorem",
        aliases: ["最大流最小割", "增广路定理", "残量网络", "整数流定理"],
    },
    // Euler 公式与 Kuratowski 平面性判据。
    "graph-planarity-euler-kuratowski": {
        id: "graph-planarity-euler-kuratowski", l2Key: "combinatorics-graph", name: "Euler 公式与平面性判据", kind: "criterion",
        aliases: ["图的Euler公式", "Kuratowski定理", "平面性判据", "K5与K33"],
    },
    // 色数上界：Brooks 定理与 Vizing 定理。
    "graph-coloring-brooks-vizing": {
        id: "graph-coloring-brooks-vizing", l2Key: "combinatorics-graph", name: "Brooks 定理与 Vizing 定理", kind: "theorem",
        aliases: ["Brooks定理", "Vizing定理", "点色数上界", "边色数"],
    },
    // 图谱与特征值给出的结构界。
    "graph-spectral-eigenvalue-bounds": {
        id: "graph-spectral-eigenvalue-bounds", l2Key: "combinatorics-graph", name: "图谱与特征值界", kind: "theorem",
        aliases: ["图谱", "代数连通度", "expander混合引理", "Cheeger不等式"],
    },
    // 完美图与弦图的判据。
    "graph-perfect-chordal-criteria": {
        id: "graph-perfect-chordal-criteria", l2Key: "combinatorics-graph", name: "完美图与弦图判据", kind: "criterion",
        aliases: ["完美图定理", "弦图", "完美消除序", "团数等于色数"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMBINATORICS_GRAPH_L3_RULES: Record<string, MathV2L3Rules> = {
    // 欧拉回路与 Hamilton 回路的判据差异。
    "graph-euler-hamilton-criteria": {
        definitions: ["欧拉回路遍历每条边恰一次，Hamilton 回路遍历每个顶点恰一次；前者有完全的度数判据且可多项式判定，后者只有充分条件与必要条件而判定问题 NP 完全，这一对比是图论中局部条件与全局条件差异的标准范例"],
        formulas: ["欧拉回路判据：连通图（忽略孤立点）存在欧拉回路 <=> 每点度为偶；存在欧拉路 <=> 恰有 0 或 2 个奇度点", "有向图判据：存在欧拉回路 <=> 底图连通且每点入度等于出度", "Dirac 定理：n >= 3 且最小度 delta >= n/2 => 存在 Hamilton 回路", "Ore 条件：n >= 3 且对任意不相邻的 u、v 有 d(u) + d(v) >= n => 存在 Hamilton 回路", "Chvátal-Erdős 条件：连通度 kappa >= 独立数 alpha => 存在 Hamilton 回路", "必要条件（割点型）：若存在 S 使 G - S 的分支数超过 |S|，则无 Hamilton 回路"],
        theorems: ["欧拉判据的充分性由 Hierholzer 构造给出：反复取闭迹并插入，故不仅判定而且给出 O(|E|) 算法；Hamilton 问题不存在这种局部拼接结构，故任何“逐步延长路径”的贪心都可能失败", "Dirac 与 Ore 的界都是紧的：K_{k, k+1} 的最小度为 k 而 n = 2k+1，说明 delta >= n/2 不能放宽为 delta >= (n-1)/2；因此这些条件只能验证而不能近似使用", "Ore 条件严格强于 Dirac（Dirac 是 Ore 的特例），Chvátal-Erdős 与二者互不包含，故一个图不满足某条件不等于无 Hamilton 回路——充分条件不成立时必须另行判断而不能反用", "闭包定理（Bondy-Chvátal）：若 d(u) + d(v) >= n 则 G 有 Hamilton 回路当且仅当 G + uv 有，故可反复加边到闭包，闭包为完全图时即得存在性；这是把 Ore 型条件算法化的正确形式", "度序列条件（Chvátal 定理）给出比 Dirac/Ore 更弱的充分条件，但仍非充要；Hamilton 性的判定问题 NP 完全，故不应期待多项式判据"],
        generalRequirements: ["必须先声明是回路还是路、有向还是无向", "使用 Dirac/Ore 必须核对 n >= 3 与度条件对全体（不相邻）点对成立", "充分条件不满足时不得直接断言不存在"],
        forbiddenErrors: ["【判据混用】把欧拉的度数判据用于 Hamilton 回路", "【连通性遗漏】只验证度为偶而不验证连通性", "【路与回路混淆】把恰有两个奇度点的情形当作存在欧拉回路", "【充分条件反用】由不满足 Dirac 或 Ore 推出无 Hamilton 回路", "【有向图度条件错误】有向情形只验证总度为偶而不验证入度等于出度"],
        parameterConstraints: { connectivityRequired: "欧拉判据要求（去掉孤立点后）连通。", parityCondition: "欧拉回路要求全部顶点度为偶。", diracThreshold: "Dirac 要求 n >= 3 且 delta >= n/2。", oreScope: "Ore 条件须对所有不相邻点对成立。" },
        closureChecks: ["区分回路/路与有向/无向。", "欧拉情形核对连通性与度的奇偶。", "Hamilton 情形写出所用充分条件并核对紧性。", "若判定不存在，给出割集或计数型必要条件的违反。"],
        scenarioChecks: { eulerianExistence: ["检查连通性", "统计奇度点个数", "按 0 或 2 给出回路或路"], hamiltonianSufficient: ["核对 n >= 3", "验证 Dirac 或 Ore 或 Chvátal-Erdős", "必要时用闭包定理加边"], hamiltonianNonexistence: ["寻找割集 S 使分支数超过 |S|", "或用二部性奇偶论证", "确认不是错用充分条件"] },
    },
    // 矩阵树定理与生成树计数。
    "graph-matrix-tree-theorem": {
        definitions: ["矩阵树定理把生成树个数表示为 Laplace 矩阵任一主子式的行列式，从而把组合计数化为线性代数计算；它同时给出加权版本与有向树版本，是生成树相关量的统一工具"],
        formulas: ["Laplace 矩阵 L = D - A，D 为度对角阵，A 为邻接矩阵；L 的每行每列和为零", "矩阵树定理：生成树数 tau(G) = det(L_0)，L_0 为删去任意一行一列（同标号）后的余子式，结果与所删顶点无关", "特征值形式：tau(G) = (1/n) prod_{i=2}^{n} mu_i，mu_i 为 L 的非零特征值（mu_1 = 0）", "完全图：tau(K_n) = n^{n-2}；完全二部图 tau(K_{m,n}) = m^{n-1} n^{m-1}", "加权版本：把 A_{ij} 换为边权 w_{ij}，则余子式给出 sum over 生成树 prod 边权", "有向版本（Tutte）：以 v 为根的内向生成树数等于删去第 v 行第 v 列后的 L^{out} 余子式"],
        theorems: ["余子式与所删顶点无关的原因是 L 的行列和为零使全体 (n-1) 阶主余子式相等，这也解释了为何 rank L = n - c（c 为连通分支数）：图不连通时全体余子式为零，与 tau = 0 相符", "证明的组合核心是 Cauchy-Binet 公式作用于定向关联矩阵 M（L = M M^T）：M 的 (n-1) 阶子式为 ±1 当对应边集为生成树、为 0 否则，故 det L_0 恰计数生成树；这说明定理本质是关联矩阵的全单模性", "代数连通度 mu_2 > 0 当且仅当图连通，故特征值形式同时给出连通性判据；由 mu_2 的大小可界定生成树数的量级", "带权形式使删除-收缩递推 tau(G) = tau(G - e) + tau(G / e) 与行列式展开一致，故二者可互相验证；递推适合小图手算，行列式适合结构化大图", "有向情形必须区分入度型与出度型 Laplace 矩阵，二者分别计数内向树与外向树，混用会给出错误结果；无向定理不是有向定理的特例"],
        generalRequirements: ["必须写出 Laplace 矩阵的定义并说明处理重边与自环的方式", "必须说明所删顶点的选择及其无关性", "有向情形必须声明所用 Laplace 的类型与根"],
        forbiddenErrors: ["【矩阵取错】用邻接矩阵而非 L = D - A 的余子式", "【全行列式为零】直接计算 det L（恒为零）而不删行列", "【自环处理错误】把自环计入度数或计入生成树", "【有向类型混用】用入度 Laplace 计数外向树", "【不连通误判】图不连通时给出非零生成树数"],
        parameterConstraints: { laplacianDefinition: "L = D - A，自环不计入度。", minorSize: "取 (n-1) 阶主余子式（删同标号的一行一列）。", weightedNonnegativity: "加权版本按边权乘积求和，权可为形式变量。", directedRootChoice: "有向版本须固定根并选择正确的 Laplace 类型。" },
        closureChecks: ["写出 L 并核对行列和为零。", "删去一行一列并计算行列式。", "用特征值形式或删除-收缩递推交叉验证。", "对 K_n 等已知例子核对公式。"],
        scenarioChecks: { spanningTreeCount: ["构造 L", "取余子式求行列式", "与已知小图结果对照"], weightedTreeSum: ["把权代入邻接位置", "求余子式得权和", "按需提取指定权次数的系数"], connectivityViaSpectrum: ["计算 L 的特征值", "由 mu_2 是否为零判连通", "用非零特征值乘积除 n 得 tau"] },
    },
    // Menger 定理与连通度的极小-极大关系。
    "graph-menger-connectivity": {
        definitions: ["Menger 定理断言两点之间内部不交路径的最大条数等于分离这两点所需的最小顶点数（边版本对应边不交路径与最小割边数）；它是图论中第一个极小-极大定理，也是最大流最小割的组合原型"],
        formulas: ["点版本：对不相邻的 u、v，最大内部不交 u-v 路径数 = 最小 u-v 分离点集大小 kappa(u, v)", "边版本：最大边不交 u-v 路径数 = 最小 u-v 割边集大小 lambda(u, v)", "全局连通度：kappa(G) = min over 不相邻点对 kappa(u,v)；k-连通 <=> 任意两点间有 k 条内部不交路径（Whitney）", "扇形式（fan version）：从点 v 到点集 S 的最大 v-S 不交路径数 = 最小分离 v 与 S 的点集大小", "不等式链：kappa(G) <= lambda(G) <= delta(G)，其中 delta 为最小度", "二部图特例：Menger 边版本退化为 König 定理，故匹配对偶是连通度对偶的特例"],
        theorems: ["Menger 定理的两个版本可互相推出（通过顶点分裂把点容量转为边容量），但直接互换会改变图的规模与结构，故在给出数值结论时必须声明所用版本", "有向版本同样成立，但必须固定路径方向；无向结论不能直接搬到有向图上，反例是仅有单向可达的图", "相邻点对的点版本不成立（无法用顶点分离相邻点），故全局 kappa(G) 的定义只对不相邻点对取最小，且 K_n 需单独规定 kappa = n - 1", "Whitney 的 k-连通刻画使连通度可由“任意两点间不交路径数”验证，这给出通过构造路径证明高连通性的标准手段，而证明连通度上界则通过给出一个分离集", "Menger 是 LP 对偶的整数版本，其整性来自路径-割矩阵的结构；因此不交路径数与分离集大小都可用最大流算法在多项式时间求出，这与 Hamilton 型问题的困难形成对照"],
        generalRequirements: ["必须声明点版本或边版本、有向或无向", "点版本必须验证两点不相邻", "给出等号时需同时构造路径族与分离集以证明两侧界"],
        forbiddenErrors: ["【相邻点用点版本】对相邻的 u、v 断言存在分离点集", "【版本混用】用最小割边数去界定内部不交路径（点版本）的条数", "【不交含义含糊】未说明“内部不交”允许共享端点而不允许共享内部顶点", "【方向忽略】有向图中把反向路径计入不交路径族", "【上界证明缺失】只构造出 k 条不交路径就断言连通度恰为 k，未给出大小为 k 的分离集"],
        parameterConstraints: { nonAdjacency: "点版本要求 u、v 不相邻。", internallyDisjoint: "路径仅共享端点，内部顶点互不相同。", directedConsistency: "有向情形路径方向须一致。", completeGraphConvention: "K_n 约定 kappa = n - 1。" },
        closureChecks: ["确定版本与图的定向。", "构造不交路径族给出下界。", "构造分离集给出上界。", "核对 kappa <= lambda <= delta。"],
        scenarioChecks: { connectivityLowerBound: ["在任意两点间构造 k 条内部不交路径", "引用 Whitney 刻画", "得到 k-连通"], connectivityUpperBound: ["找出一个小分离集", "由 Menger 得路径数上界", "确认与下界一致"], reductionToFlow: ["把点容量用顶点分裂转为边容量", "用最大流最小割求值", "把结果翻译回原图"] },
    },
    // Hall 定理与 König 定理：二部图匹配的对偶。
    "graph-hall-konig-matching": {
        definitions: ["Hall 定理给出二部图存在饱和一侧的匹配的充要条件（邻域大小条件）；König 定理给出二部图最大匹配等于最小点覆盖的极小-极大关系。两者共同构成二部图匹配理论的核心对偶"],
        formulas: ["Hall 条件：二部图 G = (X ∪ Y, E) 存在饱和 X 的匹配 <=> 对任意 S ⊆ X 有 |N(S)| >= |S|", "缺陷版本（defect Hall）：最大匹配大小 = |X| - max_{S ⊆ X} (|S| - |N(S)|)", "König 定理：二部图中最大匹配数 = 最小点覆盖数", "Gallai 恒等式：最大独立集 + 最小点覆盖 = n；最大匹配 + 最小边覆盖 = n（无孤立点）", "正则二部图：k-正则二部图（k >= 1）的边集可分解为 k 个完美匹配", "增广路判据（Berge）：匹配 M 最大 <=> 不存在 M-增广路"],
        theorems: ["Hall 条件的必要性显然，充分性可由增广路或归纳给出；关键是条件必须对 X 的一切子集成立，只验证单点或全集不足，反例是两点共用同一邻居的星形结构", "König 定理仅对二部图成立：奇圈 C_3 的最大匹配为 1 而最小点覆盖为 2，故不能推广到一般图；一般图的匹配对偶必须换成 Tutte-Berge 公式", "Hall 与 König 等价，且都是 Menger 与最大流最小割的特例；这一等价说明二部匹配的整性来自图的二部性（关联矩阵的全单模性）而非匹配本身", "Berge 增广路判据给出匈牙利算法的正确性基础，复杂度 O(|V| |E|)（Hopcroft-Karp 为 O(sqrt(|V|) |E|)）；对一般图需用带花树（Blossom）算法处理奇圈", "由 Hall 定理推出正则二部图的完美匹配分解：k-正则时任意 S 的邻域边数计数给出 |N(S)| >= |S|，逐次剥离匹配即得 1-因子分解，这是拉丁方与排课问题的理论依据"],
        generalRequirements: ["必须明确二部划分并声明匹配饱和哪一侧", "使用 Hall 条件必须对全体子集成立或给出反例子集", "使用 König 必须确认图为二部图"],
        forbiddenErrors: ["【子集验证不全】只对部分子集验证 Hall 条件即断言匹配存在", "【König 越界】对含奇圈的一般图使用最大匹配等于最小点覆盖", "【覆盖类型混淆】把点覆盖与边覆盖或独立集混用", "【缺陷公式误用】把 max(|S| - |N(S)|) 写成对某一特定 S 的值", "【方向性遗漏】把二部图当作有向网络时未正确设定容量与方向"],
        parameterConstraints: { bipartiteness: "König 与 Hall 均要求二部图。", allSubsets: "Hall 条件须对 X 的所有子集成立。", saturationSide: "须声明匹配饱和 X 还是 Y。", regularityForFactorization: "1-因子分解结论要求 k-正则且 k >= 1。" },
        closureChecks: ["写出二部划分与待饱和一侧。", "验证 Hall 条件或给出违反子集。", "需要数值时用缺陷公式或 König 对偶。", "用增广路判据确认匹配最大性。"],
        scenarioChecks: { systemOfDistinctRepresentatives: ["把集合族建为二部图", "验证 Hall 条件", "得到相异代表系存在性"], maxMatchingComputation: ["用增广路算法求匹配", "由 König 构造同大小点覆盖", "确认两侧数值相等"], latinSquareCompletion: ["建立行与符号的正则二部图", "用 Hall 得完美匹配", "逐行推进完成构造"] },
    },
    // Tutte 定理与 Berge-Tutte 公式。
    "graph-tutte-berge-matching": {
        definitions: ["Tutte 定理给出一般图存在完美匹配的充要条件：删去任意点集后奇分支数不超过所删点数；Berge-Tutte 公式把最大匹配的缺陷量表示为同一奇分支计数的最大值，是一般图匹配的完整对偶"],
        formulas: ["Tutte 条件：G 有完美匹配 <=> 对任意 S ⊆ V 有 o(G - S) <= |S|，o 表示奇阶连通分支数", "Berge-Tutte 公式：最大匹配大小 = (1/2)(n - max_{S ⊆ V} (o(G - S) - |S|))", "缺陷量 def(G) = max_S (o(G - S) - |S|) = 未被最大匹配覆盖的顶点数；def(G) 与 n 同奇偶", "Petersen 定理：每个无桥的 3-正则图有完美匹配", "Tutte 的 f-因子与 k-因子推广：k-正则且 (k-1)-边连通（k 偶时无条件）保证 k-因子存在的相应条件", "Gallai-Edmonds 分解：由 D(G)（可被某最大匹配漏掉的点）、A(G) = N(D) \\ D、C(G) 三部分刻画全部最大匹配的结构"],
        theorems: ["Tutte 条件的必要性来自每个奇分支至少有一点必须匹配到 S 外部；充分性证明（Tutte 或 Gallai-Edmonds）非平凡，故不能用二部情形的 Hall 论证直接类推", "取 S = ∅ 给出必要条件“n 为偶且分支均为偶阶”，故奇阶图立即无完美匹配；这一退化情形常被漏检", "Berge-Tutte 公式与 Tutte 定理等价（def = 0 即完美匹配），其价值在于给出最大匹配的精确数值而非仅存在性，故求最大匹配大小时应给出达到最大的紧障碍 S", "一般图的匹配整性来自 Edmonds 的奇集不等式（匹配多面体需加 sum_{e in E(S)} x_e <= (|S|-1)/2 型约束），故简单的度约束 LP 松弛在奇圈上不整，这是一般图与二部图的本质差别", "Gallai-Edmonds 分解给出最大匹配的全部结构信息：G - A 的每个 D 分支为因子临界的，A 到 D 的匹配可任意选取；因此结构性结论（如所有最大匹配的公共未覆盖点）应由该分解读出而非逐个枚举匹配"],
        generalRequirements: ["必须给出所用的点集 S 及其 o(G - S) 的计数", "证明不存在完美匹配时必须显式给出违反 Tutte 条件的 S", "使用 Berge-Tutte 求数值时必须说明 S 取到最大"],
        forbiddenErrors: ["【奇分支误数】把偶阶分支计入 o(G - S) 或漏掉孤立点分支", "【二部化归】用 Hall 定理处理一般图的完美匹配", "【奇偶性遗漏】不检查 n 的奇偶即讨论完美匹配", "【障碍未给出】声称无完美匹配但不给出具体 S", "【缺陷公式取值错误】用某个 S 的值当作最大值而不论证最优性"],
        parameterConstraints: { oddComponentCount: "o(G - S) 只计奇阶连通分支。", allSubsetsQuantifier: "Tutte 条件须对全体 S ⊆ V 成立。", parityConsistency: "def(G) 与 n 同奇偶。", bridgelessForPetersen: "Petersen 定理要求 3-正则且无桥。" },
        closureChecks: ["先查 n 的奇偶与分支奇偶。", "寻找候选障碍 S 并计算 o(G - S) - |S|。", "由 Berge-Tutte 给出最大匹配大小。", "必要时用 Gallai-Edmonds 分解说明结构。"],
        scenarioChecks: { perfectMatchingExistence: ["检查 n 为偶", "尝试构造匹配或寻找违反 S", "引用 Tutte 条件下结论"], maximumMatchingSize: ["计算若干 S 的缺陷量", "取最大得 def(G)", "代入 (n - def)/2"], regularGraphFactor: ["核对正则度与边连通性", "引用 Petersen 或 f-因子定理", "给出因子分解或反例"] },
    },
    // 最大流最小割定理与增广路方法。
    "graph-maxflow-mincut": {
        definitions: ["最大流最小割定理断言网络中最大可行流量等于最小割容量；增广路方法在残量网络中反复寻找增广路直至不存在，其终止状态给出的割证明了最优性，是组合优化中原始-对偶思想的典型实现"],
        formulas: ["流的可行性：0 <= f(e) <= c(e)，且除源汇外每点满足流入等于流出", "流值 |f| = sum_{e out of s} f(e) - sum_{e into s} f(e)", "割容量：对 s-t 割 (S, T) 有 cap(S, T) = sum_{u in S, v in T} c(u, v)（只计正向边）", "弱对偶：任意流值 <= 任意割容量；强对偶（最大流最小割）：max |f| = min cap(S, T)", "残量容量：c_f(u,v) = c(u,v) - f(u,v) + f(v,u)；无增广路时取 S = {从 s 在残量网络可达的点}", "复杂度：Edmonds-Karp O(V E^2)，Dinic O(V^2 E)（单位容量二部匹配为 O(sqrt(V) E)）"],
        theorems: ["三条命题等价：f 是最大流；残量网络中无 s-t 增广路；存在割使 |f| = cap(S, T)。这一等价既给出终止判据也给出最优性证书，故任何“最大流”结论都应附带一个饱和割", "整数容量下存在整数最大流（整性定理），因为增广路每次至少增加 1；无理容量时 Ford-Fulkerson 可能不终止，必须用最短增广路（Edmonds-Karp）或阻塞流保证多项式终止", "反向边（残量）必不可少：只沿正向边贪心会卡在非最优流，反向边允许撤销先前决策，这正是贪心与增广路方法的分界", "多源多汇、点容量、下界约束都可通过增加超级源汇、顶点分裂、流量平移化归为标准问题，故建模的关键在于化归而非改动定理本身", "最大流最小割是 LP 对偶的整数版本，并统一涵盖 König、Hall、Menger；反之最小费用流需另加势函数（Bellman-Ford 或 Johnson 型）判据，费用最优性不能由割给出"],
        generalRequirements: ["必须写出网络的容量函数、源与汇，并说明是否允许反平行边", "断言最大流必须给出饱和割或残量不可达论证", "使用整性结论必须确认容量为整数"],
        forbiddenErrors: ["【割容量含反向边】计算 cap(S, T) 时把 T 到 S 的边容量计入", "【残量反向边遗漏】构造残量网络时不加反向边，得到次优流", "【整性误用】容量为无理数或分数时断言存在整数最大流", "【守恒违反】在源汇之外的点上流入流出不等", "【最优性无证书】只说“找不到增广路了”而不给出对应的割"],
        parameterConstraints: { capacityNonnegativity: "容量非负。", conservation: "非源汇顶点须满足流量守恒。", integralityCondition: "整数最大流结论要求容量为整数。", cutOrientation: "割容量只累加从 S 到 T 的正向容量。" },
        closureChecks: ["写出网络与容量并核对建模化归。", "运行增广路直到残量网络无 s-t 路径。", "由残量可达集构造割并核对容量等于流值。", "如需整数解，确认容量整数性。"],
        scenarioChecks: { bipartiteMatchingViaFlow: ["建单位容量网络", "求最大流", "由整性读出匹配并由割得点覆盖"], projectSelection: ["把收益与成本建为源汇边", "求最小割", "由割的两侧读出选择方案"], edgeDisjointPaths: ["取全部容量为 1", "最大流即边不交路径数", "由最小割得 Menger 的分离边集"] },
    },
    // Euler 公式与 Kuratowski 平面性判据。
    "graph-planarity-euler-kuratowski": {
        definitions: ["平面图是能嵌入平面使边只在端点相交的图；Euler 公式给出连通平面图顶点、边、面数的刚性关系，由此导出边数上界与低度顶点存在性，而 Kuratowski-Wagner 定理把平面性刻画为不含特定子结构"],
        formulas: ["Euler 公式：连通平面图有 n - m + f = 2（含外部面）；连通分支数为 c 时 n - m + f = 1 + c", "边数上界：n >= 3 时 m <= 3n - 6；无三角形（含二部）平面图 m <= 2n - 4；围长 g 时 m <= g(n-2)/(g-2)", "面度数求和：sum_{面 F} deg(F) = 2m，每面度数 >= 3（简单图且 m >= 2）", "K_5：n = 5, m = 10 > 3*5 - 6 = 9；K_{3,3}：n = 6, m = 9 > 2*6 - 4 = 8", "度数推论：平面图存在度 <= 5 的顶点（否则 2m >= 6n 与 m <= 3n - 6 矛盾）", "极大平面图（三角剖分）恰有 m = 3n - 6, f = 2n - 4"],
        theorems: ["Kuratowski 定理：图可平面当且仅当不含 K_5 或 K_{3,3} 的剖分（subdivision）；Wagner 定理等价地用 K_5 或 K_{3,3} 的子式（minor）表述。剖分与子式在此两个禁用图上等价，但一般不可混用", "Euler 公式的界只是必要条件：m <= 3n - 6 成立并不推出平面性（如 K_{3,3} 加边的某些图），故只能用来证明非平面，不能用来证明平面", "度 <= 5 顶点的存在性给出五色定理的归纳证明；四色定理成立但无初等证明，任何“简短证明四色”的论证应视为错误", "平面性可在 O(n) 时间判定（Hopcroft-Tarjan 等），且平面图的面结构由嵌入决定：3-连通平面图的嵌入在球面上本质唯一（Whitney），低连通度时面集合不唯一", "非平面图的量化指标是亏格与交叉数：K_5、K_{3,3} 亏格为 1，环面上可嵌入图满足 m <= 3n（一般曲面 m <= 3(n - 2 + 2g)），不能沿用 3n - 6"],
        generalRequirements: ["使用 Euler 公式必须说明图连通且为简单图，并明确是否计入外部面", "断言非平面必须给出 K_5 或 K_{3,3} 的剖分/子式，或给出违反边界的计数", "使用无三角形界必须先验证围长"],
        forbiddenErrors: ["【逆用边界】由 m <= 3n - 6 反推图是平面图", "【剖分子式混淆】声称含 K_5 子式即含 K_5 剖分（一般不成立）", "【连通性忽略】对不连通图直接套用 n - m + f = 2", "【外部面漏计】数面时忘记无界面导致 f 少 1", "【曲面界误用】在环面或更高亏格上仍用 m <= 3n - 6"],
        parameterConstraints: { connectivity: "Euler 公式的标准形式要求图连通。", simplicity: "边界 m <= 3n - 6 要求简单图且 n >= 3。", girthCondition: "m <= 2n - 4 要求无三角形。", genusScope: "高亏格曲面须用推广的 Euler 公式。" },
        closureChecks: ["确认图简单、连通并统计 n、m。", "用 Euler 界或围长界尝试排除平面性。", "若界不违反，显式构造嵌入或找出 K_5 / K_{3,3} 结构。", "结论方向核对：界只能否证平面性。"],
        scenarioChecks: { provingNonplanar: ["计数 n、m 与围长", "与相应 Euler 界比较", "若不违反则改找 Kuratowski 子结构"], countingFaces: ["确认连通性", "由 n - m + f = 2 解出 f", "用 sum deg(F) = 2m 校验面度数"], coloringConsequence: ["取度 <= 5 顶点", "删点归纳着色", "回插时讨论邻居颜色（五色论证）"] },
    },
    // 色数上界：Brooks 定理与 Vizing 定理。
    "graph-coloring-brooks-vizing": {
        definitions: ["点色数 chi(G) 是使相邻点异色所需最少颜色数，边色数 chi'(G) 是使相邻边异色所需最少颜色数；Brooks 定理与 Vizing 定理分别把贪心给出的平凡上界收紧一格，并精确刻画例外情形"],
        formulas: ["贪心界：chi(G) <= Delta(G) + 1；按退化序着色给 chi(G) <= col(G) = 1 + max_{H ⊆ G} delta(H)", "Brooks：G 连通且既非完全图又非奇圈时 chi(G) <= Delta(G)", "Vizing：Delta(G) <= chi'(G) <= Delta(G) + 1（简单图）", "König：二部图 chi'(G) = Delta(G)", "下界：chi(G) >= omega(G)，chi(G) >= n / alpha(G)", "多重图 Vizing-Gupta：chi' <= Delta + mu（mu 为最大重数）"],
        theorems: ["Brooks 定理的例外恰为完全图与奇圈（此时 chi = Delta + 1），因此使用 chi <= Delta 前必须排除这两类，且必须在每个连通分支上分别检验", "Vizing 定理把简单图按 chi' = Delta（class 1）与 chi' = Delta + 1（class 2）分类，但判定属于哪一类是 NP-难的；奇阶正则图必为 class 2（因为 m = Delta*n/2 不能被 Delta 个完美匹配整除）", "chi >= omega 不紧：存在无三角形而色数任意大的图（Mycielski 构造、Kneser 图），故不能用团数估计色数上界，也不能由无三角形推出可 3 着色", "平面图有 chi <= 4（四色定理），无三角形平面图 chi <= 3（Grötzsch）；五色定理可由度 <= 5 顶点归纳初等证明", "列表着色不遵循同样的界：ch(G) >= chi(G) 且差可任意大（K_{k,k} 的列表色数约 log_2 k），但 Vizing 猜想的边版本给 ch'(二部) = Delta（Galvin），故点、边、列表三种界不可互推"],
        generalRequirements: ["使用 Brooks 必须验证连通性并排除完全图与奇圈", "断言 chi' = Delta 必须给出 Delta 个匹配的分解或引用二部性", "给出色数上下界时必须区分点色数与边色数"],
        forbiddenErrors: ["【Brooks 例外忽略】对 K_n 或奇圈断言 chi <= Delta", "【团数当上界】用 chi = omega 作为一般结论", "【类判定臆断】直接断言简单图属于 class 1 而不构造边着色", "【点边混淆】把 Vizing 的 Delta + 1 用于点色数或反之", "【列表着色误推】用 chi 的界直接当作列表色数的界"],
        parameterConstraints: { brooksHypothesis: "Brooks 要求连通、非完全图、非奇圈。", vizingScope: "chi' <= Delta + 1 针对简单图，多重图须加最大重数。", componentwise: "色数结论须逐连通分支验证。", lowerBoundUse: "omega 与 n/alpha 只作下界。" },
        closureChecks: ["计算 Delta 并给出贪心界。", "检验 Brooks 前提以决定能否收紧一格。", "对边着色区分二部/正则/奇阶情形。", "用 omega 或 n/alpha 校验下界与上界是否相容。"],
        scenarioChecks: { vertexColoringBound: ["求 Delta 与连通分支", "排除完全图与奇圈", "给出 Delta 着色或说明例外"], edgeColoringClass: ["求 Delta 与顶点数奇偶", "二部则用 König", "正则奇阶判为 class 2"], tightnessCheck: ["计算 omega 与 alpha", "比较上下界", "必要时引用 Mycielski 型反例"] },
    },
    // 图谱与特征值给出的结构界。
    "graph-spectral-eigenvalue-bounds": {
        definitions: ["图谱指邻接矩阵 A 或 Laplace 矩阵 L = D - A 的特征值集合；特征值的间隙控制图的连通性、扩张性与随机游走混合速度，把组合量转化为可计算的线性代数量"],
        formulas: ["邻接谱：lambda_1 >= ... >= lambda_n，d_avg <= lambda_1 <= Delta；G 连通时 lambda_1 = Delta 当且仅当 G 正则", "Laplace 谱：0 = mu_1 <= mu_2 <= ... <= mu_n，mu_2 > 0 当且仅当 G 连通；零特征值重数等于连通分支数", "代数连通度：mu_2 = min_{x ⊥ 1} (x^T L x) / (x^T x)，其中 x^T L x = sum_{(u,v) in E} (x_u - x_v)^2", "二部性判据：G 连通时 lambda_n = -lambda_1 当且仅当 G 二部（谱关于 0 对称）", "expander 混合引理：正则图中 |e(S,T) - d|S||T|/n| <= lambda |S|^{1/2}|T|^{1/2}，lambda = max(|lambda_2|, |lambda_n|)", "Cheeger 不等式：mu_2 / 2 <= h(G) <= sqrt(2 Delta mu_2)（d-正则归一化版 h >= (d - lambda_2)/2d）", "Hoffman 界：alpha(G) <= n(-lambda_n) / (lambda_1 - lambda_n)，且 chi(G) >= 1 + lambda_1 / (-lambda_n)", "生成树数：tau = (1/n) prod_{i>=2} mu_i；闭路计数 tr(A^k) = sum lambda_i^k"],
        theorems: ["Laplace 零特征值的重数等于连通分支数，故 mu_2 > 0 是连通性的谱判据；mu_2 越大图越难被稀疏割切开，这是 Cheeger 不等式的定量内容", "Cheeger 不等式两侧都紧到常数与平方：由 mu_2 小只能得到存在稀疏割，由 mu_2 大能得到扩张性，故不能把 h(G) 与 mu_2 视为同阶量（环图上差距为平方）", "混合引理要求控制的是 lambda_2 与 lambda_n 的绝对值最大者：只界定 lambda_2 会漏掉接近二部的图（lambda_n 接近 -d 时不混合）", "Alon-Boppana 界 lambda_2 >= 2sqrt(d-1) - o(1) 说明扩张性有谱上限，达到 2sqrt(d-1) 的图称 Ramanujan 图，因此不能期望 lambda_2 任意小", "谱不是完全不变量：存在同谱非同构图（如 K_{1,4} 与 C_4 ∪ K_1 的邻接同谱例），故由谱相同不能断言图同构；反之同构必同谱"],
        generalRequirements: ["必须说明所用矩阵是邻接、Laplace 还是归一化 Laplace，并给出特征值排序约定", "使用正则图专属结论前必须验证正则性", "由谱推结构必须注明是必要条件还是充分条件"],
        forbiddenErrors: ["【矩阵混淆】把邻接特征值的界直接当作 Laplace 特征值的界", "【同谱推同构】由谱相同断言图同构", "【只控 lambda_2】用混合引理时忽略 lambda_n 接近 -d 的情形", "【Cheeger 同阶化】把 h(G) 与 mu_2 当成同阶量而忽略平方根", "【非正则误用】对非正则图使用 d-正则专属的归一化公式"],
        parameterConstraints: { matrixChoice: "须固定邻接/Laplace/归一化 Laplace 之一。", regularityCondition: "混合引理与 Ramanujan 界针对正则图。", connectivityFromSpectrum: "mu_2 > 0 等价于连通。", bipartiteSpectrum: "谱对称性判据要求连通。" },
        closureChecks: ["写出矩阵定义与排序约定。", "由 mu_2 判连通性、由 lambda_n 判二部性。", "使用扩张性结论时同时给出 lambda_2 与 lambda_n。", "核对所得界的方向（上界或下界）。"],
        scenarioChecks: { connectivityCheck: ["构造 L = D - A", "求零特征值重数", "由 mu_2 定量估计连通强度"], expanderEstimate: ["确认 d-正则", "计算 lambda = max(|lambda_2|, |lambda_n|)", "代入混合引理或 Cheeger 界"], independenceBound: ["求 lambda_1 与 lambda_n", "代入 Hoffman 界", "与构造出的独立集比较紧性"] },
    },
    // 完美图与弦图的判据。
    "graph-perfect-chordal-criteria": {
        definitions: ["完美图指每个诱导子图都满足色数等于团数的图；弦图指每个长度 >= 4 的圈都有弦的图，它由完美消除序刻画，是完美图的重要子类，并使着色、最大团等 NP-难问题在其上多项式可解"],
        formulas: ["完美性：对一切诱导子图 H 有 chi(H) = omega(H)", "弦图的完美消除序：存在顶点序 v_1, ..., v_n 使每个 v_i 在 {v_i, ..., v_n} 中的邻居构成团", "弦图着色：按完美消除序逆序贪心得 chi = omega，且团数可在 O(n + m) 求出", "团数与色数的极端差：一般图可有 omega = 2 而 chi 任意大", "完美图的团-独立集关系：n <= omega(G) * alpha(G)（完美图上此界由划分实现）", "弦图团数上界：极大团个数 <= n"],
        theorems: ["完美图定理（Lovász）：G 完美当且仅当补图 G-bar 完美，这把着色问题与团覆盖问题对偶起来", "强完美图定理（Chudnovsky-Robertson-Seymour-Thomas）：G 完美当且仅当 G 不含奇洞（长度 >= 5 的奇诱导圈）与奇反洞，故 C_5 是最小非完美图；判据必须用诱导子图而非子图", "弦图判据等价链：有完美消除序 当且仅当 每个 >= 4 圈有弦 当且仅当 是某树的子树交图 当且仅当 极大团可组织成团树；Lex-BFS 或 MCS 可在线性时间给出该序并验证", "弦图必完美（无长度 >= 4 的诱导圈，故无奇洞），但完美图不必弦：C_4 完美而非弦图，C_6 的补图完美而非弦，因此不能用弦性作为完美性的必要条件", "在完美图上 chi、omega、alpha、团覆盖数均可多项式计算（Grötschel-Lovász-Schrijver，经由 Lovász theta 与椭球法），但一般图上这些量都是 NP-难，故算法性结论必须以完美性为前提"],
        generalRequirements: ["检验完美性与弦性必须使用诱导子图与诱导圈", "断言弦图必须给出完美消除序或团树", "使用多项式算法结论必须先确认图属于完美图或弦图类"],
        forbiddenErrors: ["【非诱导子图】用一般子图代替诱导子图检验奇洞", "【弦等同完美】断言完美图必为弦图（C_4 反例）", "【消除序缺失】声称是弦图却给不出完美消除序", "【贪心方向错】不按完美消除序逆序着色而随意贪心", "【类外推广】把弦图上的多项式算法结论用于任意图"],
        parameterConstraints: { inducedOnly: "完美性与弦性的判据只对诱导子结构成立。", holeLength: "奇洞指长度 >= 5 的奇诱导圈。", eliminationOrder: "弦图判据要求存在完美消除序。", algorithmScope: "多项式可解性以完美图/弦图为前提。" },
        closureChecks: ["列出需检验的诱导圈与诱导子图。", "对弦图用 Lex-BFS 求消除序并验证。", "按逆消除序着色核对 chi = omega。", "如断言完美性，检查奇洞与奇反洞两侧。"],
        scenarioChecks: { chordalRecognition: ["运行 Lex-BFS 得候选序", "验证每点后邻构成团", "由团树读出极大团"], perfectnessCheck: ["搜索长度 >= 5 的奇诱导圈", "同时检查奇反洞", "无则由强完美图定理判完美"], coloringOnChordal: ["取完美消除序", "逆序贪心着色", "核对使用颜色数等于最大团大小"] },
    },
};
