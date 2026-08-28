import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“极值组合”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMBINATORICS_EXTREMAL_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Turán 定理与禁团的极值边数。
    "extremal-turan-theorem": {
        id: "extremal-turan-theorem", l2Key: "combinatorics-extremal", name: "Turán 定理与极值边数", kind: "theorem",
        aliases: ["Turán定理", "禁团极值边数", "完全多部图构造", "ex(n, K_r)"],
    },
    // Erdős-Stone 定理与极值密度由色数决定。
    "extremal-erdos-stone": {
        id: "extremal-erdos-stone", l2Key: "combinatorics-extremal", name: "Erdős-Stone 定理与 Turán 密度", kind: "theorem",
        aliases: ["Erdős-Stone定理", "Turán密度", "色数决定极值密度", "退化极值问题"],
    },
    // Zarankiewicz 问题与二部禁子图计数。
    "extremal-zarankiewicz-bound": {
        id: "extremal-zarankiewicz-bound", l2Key: "combinatorics-extremal", name: "Kővári-Sós-Turán 界与 Zarankiewicz 问题", kind: "theorem",
        aliases: ["Kővári-Sós-Turán界", "Zarankiewicz问题", "禁完全二部子图", "双计数上界"],
    },
    // Ramsey 数的存在性与上下界方法。
    "extremal-ramsey-numbers": {
        id: "extremal-ramsey-numbers", l2Key: "combinatorics-extremal", name: "Ramsey 定理与 Ramsey 数界", kind: "theorem",
        aliases: ["Ramsey定理", "Ramsey数", "单色团", "Erdős-Szekeres递推"],
    },
    // Sperner 定理与 LYM 不等式。
    "extremal-sperner-lym": {
        id: "extremal-sperner-lym", l2Key: "combinatorics-extremal", name: "Sperner 定理与 LYM 不等式", kind: "theorem",
        aliases: ["Sperner定理", "LYM不等式", "最大反链", "对称链分解"],
    },
    // Erdős-Ko-Rado 定理与交叉族极值。
    "extremal-erdos-ko-rado": {
        id: "extremal-erdos-ko-rado", l2Key: "combinatorics-extremal", name: "Erdős-Ko-Rado 定理", kind: "theorem",
        aliases: ["Erdős-Ko-Rado定理", "交叉族极值", "星族构造", "循环置换法"],
    },
    // Kruskal-Katona 定理与压缩法。
    "extremal-kruskal-katona": {
        id: "extremal-kruskal-katona", l2Key: "combinatorics-extremal", name: "Kruskal-Katona 定理与压缩法", kind: "theorem",
        aliases: ["Kruskal-Katona定理", "压缩法", "阴影极值", "殖民序"],
    },
    // 向日葵引理与核的抽取。
    "extremal-sunflower-lemma": {
        id: "extremal-sunflower-lemma", l2Key: "combinatorics-extremal", name: "向日葵引理", kind: "lemma",
        aliases: ["向日葵引理", "sunflower lemma", "花瓣与核", "Erdős-Rado界"],
    },
    // Szemerédi 正则性引理与三角形移除引理。
    "extremal-szemeredi-regularity": {
        id: "extremal-szemeredi-regularity", l2Key: "combinatorics-extremal", name: "Szemerédi 正则性引理与移除引理", kind: "theorem",
        aliases: ["Szemerédi正则性引理", "正则划分", "三角形移除引理", "计数引理"],
    },
    // Dilworth 定理与偏序集的链分解。
    "extremal-dilworth-mirsky": {
        id: "extremal-dilworth-mirsky", l2Key: "combinatorics-extremal", name: "Dilworth 定理与 Mirsky 定理", kind: "theorem",
        aliases: ["Dilworth定理", "Mirsky定理", "最小链覆盖", "最长反链"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMBINATORICS_EXTREMAL_L3_RULES: Record<string, MathV2L3Rules> = {
    // Turán 定理与禁团的极值边数。
    "extremal-turan-theorem": {
        definitions: ["Turán 型问题问在 n 个顶点、不含给定子图 H 的图中边数最多是多少，记为 ex(n, H)；Turán 定理解决 H = K_r 的情形，唯一极值图是平衡完全 (r-1)-部图，给出极值组合中“禁子结构-最大规模-唯一极值构型”的范式"],
        formulas: ["ex(n, K_r) = e(T(n, r-1))，T(n, r-1) 为平衡完全 (r-1)-部图", "上界形式：e(G) <= (1 - 1/(r-1)) n^2 / 2，当 (r-1) | n 时取等", "r = 3（无三角形）即 Mantel 定理：e(G) <= n^2/4，极值图为 K_{ceil(n/2), floor(n/2)}", "边数与团数的密度形式：e(G) > (1 - 1/(r-1)) n^2 / 2 蕴含 G 含 K_r", "度数论证：无三角形图满足 d(u) + d(v) <= n 对每条边 (u,v) 成立，配合 Cauchy-Schwarz 给 sum d(v)^2 <= n * e(G)"],
        theorems: ["Turán 定理的等号刻画是完整的：达到 ex(n, K_r) 的图必同构于 T(n, r-1)，故极值问题的答案包含界与唯一构型两部分，只给出界的解答不完整", "Zykov 对称化（把非相邻点的邻域互换复制）把任意极值图化为完全多部图，这是证明极值构型唯一性的标准手段；随机化或概率下界只能给出构造性下界而不能证明唯一性", "平衡性是必要的：非平衡的完全 (r-1)-部图边数严格更少，故极值构型中每部大小之差不超过 1；忽略整除性会导致把 (1 - 1/(r-1))n^2/2 当成可达值", "Turán 界给出的是充分条件的方向：边数超过阈值蕴含含 K_r，但含 K_r 的图边数可以很少，故不能反用", "对非完全图 H，ex(n, H) 的阶由 chi(H) 决定（Erdős-Stone），因此二部 H 属于退化情形，必须换用 Kővári-Sós-Turán 型上界而非 Turán 公式"],
        generalRequirements: ["必须明确禁用子图是 K_r 还是一般 H，并说明是子图还是诱导子图意义", "断言达到极值必须给出具体构型并验证平衡性", "使用 (1 - 1/(r-1))n^2/2 时必须讨论整除性"],
        forbiddenErrors: ["【界当可达】不检验 (r-1) | n 就断言 e = (1 - 1/(r-1))n^2/2 可达", "【极值图缺失】只给边数上界而不给出唯一极值图", "【方向反用】由含 K_r 反推边数超过 Turán 阈值", "【非完全图误用】对二部禁子图套用 Turán 公式而得错误阶", "【部数错位】把禁 K_r 对应的部数写成 r 而非 r-1"],
        parameterConstraints: { partCount: "禁 K_r 对应 (r-1)-部构型。", balanceCondition: "极值图各部大小之差不超过 1。", divisibility: "闭式取等要求 (r-1) 整除 n。", subgraphSense: "Turán 型问题默认子图（非诱导）意义。" },
        closureChecks: ["写出禁用子图与 n 的整除关系。", "给出候选极值构型并计算其边数。", "用对称化或双计数证明上界。", "核对等号情形与唯一性论断。"],
        scenarioChecks: { triangleFree: ["套用 Mantel 界 n^2/4", "给出完全二部极值图", "核对奇偶导致的取整"], generalCliqueFree: ["确定部数 r-1", "构造平衡多部图", "比较边数与上界是否取等"], bipartiteForbidden: ["识别 H 为二部", "改用 Kővári-Sós-Turán 界", "说明 Turán 密度为 0"] },
    },
    // Erdős-Stone 定理与极值密度由色数决定。
    "extremal-erdos-stone": {
        definitions: ["Turán 密度 pi(H) 定义为 lim ex(n, H) / C(n, 2)；Erdős-Stone 定理断言该密度只由 H 的色数决定，从而把一切非二部禁子图问题归约为 Turán 问题，而二部情形密度为 0 成为“退化”极值问题"],
        formulas: ["Erdős-Stone-Simonovits：ex(n, H) = (1 - 1/(chi(H) - 1)) n^2 / 2 + o(n^2)", "Turán 密度：pi(H) = 1 - 1/(chi(H) - 1)；chi(H) = 2 时 pi(H) = 0", "K_r(t)（r 部各 t 点的完全多部图）：ex(n, K_r(t)) = (1 - 1/(r-1)) n^2/2 + o(n^2)", "退化情形的真实阶：ex(n, K_{s,t}) = O(n^{2 - 1/s})（s <= t）", "误差项：对 K_r(t) 有 ex(n, K_r(t)) - e(T(n, r-1)) = O(n^{2 - c})，但对一般二部图 o(n^2) 无法改进为常数误差"],
        theorems: ["Erdős-Stone 的内容是任何超过 Turán 密度的图都含任意大的完全多部子图 K_r(t)，因此密度层面只有色数可见；这说明密度渐近不能分辨同色数的不同 H", "对二部 H，pi(H) = 0 只说明 ex(n, H) = o(n^2)，真实阶必须另行确定（Kővári-Sós-Turán 上界与随机代数构造下界），把 pi(H) = 0 解读为“边数很少”而不给阶是错误的", "Simonovits 的稳定性定理补充结构信息：接近极值的图在删改 o(n^2) 条边后接近 T(n, chi(H) - 1)，故渐近界与结构逼近是两个层次的结论", "o(n^2) 误差不可省略：对 chi(H) = r 的 H，ex(n, H) 与 e(T(n, r-1)) 之差可以是 Theta(n^{2 - c})，因此不能把 Erdős-Stone 写成等式而无误差项", "超图版本失效：3-一致超图上连 K_4^{(3)} 的 Turán 密度都未知，故不能把由色数决定密度的结论推广到超图"],
        generalRequirements: ["必须先算出 chi(H) 再写密度，并明确误差项 o(n^2)", "对二部禁子图必须转入退化情形并给出多项式阶的上下界", "断言结构接近极值图必须引用稳定性定理"],
        forbiddenErrors: ["【误差项省略】把 Erdős-Stone 写成无 o(n^2) 的等式", "【零密度误读】由 pi(H) = 0 断言 ex(n, H) = O(n)", "【色数算错】用团数代替色数决定密度", "【超图推广】把结论用于一致超图的 Turán 密度", "【稳定性越界】由密度接近直接断言图同构于极值图"],
        parameterConstraints: { chromaticInput: "密度公式的输入是 chi(H) 而非 omega(H)。", asymptoticOnly: "结论为渐近，误差 o(n^2) 必保留。", degenerateCase: "chi(H) = 2 时须另求多项式阶。", graphOnly: "结论限于图，不含超图。" },
        closureChecks: ["计算 chi(H)。", "写出带 o(n^2) 的密度渐近式。", "若 chi(H) = 2 转入退化上下界分析。", "如需结构结论引用稳定性定理。"],
        scenarioChecks: { nonBipartiteForbidden: ["求 chi(H)", "写出 (1 - 1/(chi-1))n^2/2 + o(n^2)", "必要时给出多部构造作下界"], degenerateOrder: ["确认 H 二部", "用 Kővári-Sós-Turán 给上界", "用代数或随机构造给下界"], stabilityUse: ["验证边数接近极值", "引用 Simonovits 稳定性", "指出需删改的边数量级"] },
    },
    // Zarankiewicz 问题与二部禁子图计数。
    "extremal-zarankiewicz-bound": {
        definitions: ["Zarankiewicz 问题问不含 K_{s,t} 的（二部）图最多有多少边；Kővári-Sós-Turán 界用对 s 元子集的双计数给出 n^{2 - 1/s} 阶上界，是退化极值问题的基本工具"],
        formulas: ["Kővári-Sós-Turán：ex(n, K_{s,t}) <= (1/2)(t-1)^{1/s} n^{2 - 1/s} + O(n)", "双计数核心：sum_v C(d(v), s) <= (t-1) C(n, s)，配合凸性 sum C(d_v, s) >= n C(d_avg, s)", "s = t = 2：ex(n, C_4) = (1/2) n^{3/2} + o(n^{3/2})，由 Erdős-Rényi 射影平面构造达到", "二部版本：z(m, n; s, t) <= (t-1)^{1/s}(m - s + 1) n^{1 - 1/s} + (s-1) n", "不含 C_4 的等价说法：任意两点至多一条公共邻居，故 sum_v C(d(v), 2) <= C(n, 2)", "偶圈：ex(n, C_{2k}) = O(n^{1 + 1/k})，下界仅在 k = 2, 3, 5 已知匹配"],
        theorems: ["上界的机制是双计数加 Jensen 凸性：把“每个 s 元集的公共邻居数 <= t-1”转成度数的 s 次矩不等式，因此该界只需禁 K_{s,t} 的一侧计数，s 与 t 的角色不对称，交换会改变指数", "指数 2 - 1/s 在 t 固定、s <= t 时对 s = 2 与部分代数构造是紧的（射影平面、范数图 Kollár-Rónyai-Szabó 给 t >= s! 情形匹配），但一般 (s, t) 的紧性仍未知，故不能声称该界总是最优", "凸性方向必须正确：C(x, s) 对 x >= s-1 是凸函数，Jensen 给出的是 sum C(d_v, s) 的下界，从而反推 d_avg 的上界；把不等号方向搞反会得到无意义的界", "偶圈的上界不能由 Kővári-Sós-Turán 直接得到最优阶：C_{2k} 不是完全二部图，需 Bondy-Simonovits 型论证，故禁圈问题与禁完全二部子图问题不可混同", "随机图给出的下界弱于代数构造：随机删边只给 n^{2 - 2/(s+t-2)} 阶，因此在退化极值问题中构造性（有限几何、范数图）是达到上界阶的关键"],
        generalRequirements: ["必须写清禁用的是 K_{s,t} 还是偶圈，并固定 s <= t 的约定", "使用双计数必须写出 s 元子集的公共邻居约束", "断言阶最优必须给出构造而非只给上界"],
        forbiddenErrors: ["【s 与 t 互换】把指数写成 2 - 1/t", "【凸性反向】Jensen 不等号方向用反导致上界失效", "【禁圈混同】对 C_{2k} 直接套用 K_{s,t} 的界并宣称最优", "【构造缺失】只给上界即断言 ex 的阶已确定", "【常数当精确】把 (1/2)(t-1)^{1/s} 当作精确系数使用"],
        parameterConstraints: { indexConvention: "约定 s <= t，指数为 2 - 1/s。", degreeDomain: "C(d, s) 的凸性要求 d >= s - 1，小度顶点需单独处理。", asymptoticOnly: "常数不精确，仅给阶与主项。", forbiddenType: "界针对完全二部子图，禁圈需另法。" },
        closureChecks: ["写出禁用子图与 s、t。", "建立 s 元集公共邻居的双计数不等式。", "用凸性转为度数矩不等式并解出边数上界。", "如需最优阶，给出代数构造下界。"],
        scenarioChecks: { c4FreeGraph: ["用任意两点至多一公共邻居", "双计数得 sum C(d_v, 2) <= C(n, 2)", "解出 e = O(n^{3/2}) 并引用射影平面构造"], generalKst: ["固定 s <= t", "写出 s 元子集计数约束", "得 n^{2 - 1/s} 阶上界"], incidenceApplication: ["把点线关联建为二部图", "禁 K_{2,2} 表示两点定一线", "由界得关联数上界"] },
    },
    // Ramsey 数的存在性与上下界方法。
    "extremal-ramsey-numbers": {
        definitions: ["Ramsey 数 R(s, t) 是使任意红蓝边着色都出现红 K_s 或蓝 K_t 的最小顶点数；Ramsey 定理保证其有限，上界来自组合递推，下界来自概率或构造，是“足够大的结构必含有序子结构”的原型"],
        formulas: ["Erdős-Szekeres 递推：R(s, t) <= R(s-1, t) + R(s, t-1)，故 R(s, t) <= C(s + t - 2, s - 1)", "对角上界：R(k, k) <= 4^{k-1}（更精细为 4^{k - o(k)}）", "概率下界：若 C(n, k) 2^{1 - C(k,2)} < 1 则 R(k, k) > n，给 R(k, k) > (1 + o(1)) (k/e) 2^{k/2}", "小值：R(3, 3) = 6, R(3, 4) = 9, R(3, 5) = 14, R(4, 4) = 18；R(5, 5) 未知", "多色版本：R(k_1, ..., k_r) 有限，且 R_r(3) 的上界由 r 色递推给出", "无限版本：任意 2-着色的可数完全图含无限单色团（无限 Ramsey 定理）"],
        theorems: ["递推的等号可加强：当 R(s-1, t) 与 R(s, t-1) 都为偶数时不等式严格，故给出小 Ramsey 数的精确值需要这类奇偶改进而非仅用递推", "概率下界是非构造的：一阶矩法只证明存在无大单色团的着色，不给出显式着色；显式构造（Frankl-Wilson 型）给出的界远弱于概率界，二者不能混称", "上下界的指数差距是本质困难：已知 2^{k/2} <= R(k,k) <= 4^k（近期改进仍为 (4 - eps)^k），故不能断言 R(k,k) 的增长阶已确定", "Ramsey 定理的存在性不给规模控制：由“足够大”得到的 n 通常是塔式或指数级，因此凡需要具体阈值的问题必须给出显式界而非只引用存在性", "结构版本（Ramsey 型定理族）包括 Erdős-Szekeres 单调子序列 (n-1)^2 + 1、Van der Waerden、Hales-Jewett，它们共享“着色必有单色结构”的模式但界的增长率完全不同，不能相互替代"],
        generalRequirements: ["必须写清着色的颜色数与所求单色结构", "给出上界必须指明用递推还是加权论证；给出下界必须区分概率与构造", "断言具体数值必须是已知精确值"],
        forbiddenErrors: ["【未知值臆断】给出 R(5,5) 或 R(k,k) 的精确值", "【构造性混淆】称概率下界提供了显式着色", "【递推方向错】把 R(s,t) <= R(s-1,t) + R(s,t-1) 写成等式或反向", "【阈值省略】只引用存在性而在需要显式界处不给界", "【定理族混用】用 Ramsey 界替代 Van der Waerden 或 Szemerédi 型界"],
        parameterConstraints: { colorCount: "须固定颜色数与各色目标团大小。", monotoneStructure: "R(s, t) 中 s、t 分别对应两色目标。", boundNature: "下界须声明概率或构造。", knownValues: "只使用已确证的小 Ramsey 数值。" },
        closureChecks: ["写出着色模型与目标单色子结构。", "用 Erdős-Szekeres 递推得上界。", "用一阶矩法或显式构造得下界。", "核对是否把未知量当已知使用。"],
        scenarioChecks: { upperBoundDerivation: ["对 s、t 归纳", "套用递推与二项系数界", "必要时用奇偶改进"], lowerBoundProbabilistic: ["随机 2-着色", "计算期望单色团数", "由 < 1 得存在性"], monotoneSequence: ["改用 Erdős-Szekeres 单调子序列版本", "取 (n-1)^2 + 1 阈值", "由鸽巢构造长度对"] },
    },
    // Sperner 定理与 LYM 不等式。
    "extremal-sperner-lym": {
        definitions: ["布尔格上的反链是任意两成员互不包含的集族；Sperner 定理给出反链的最大规模，LYM 不等式给出其加权形式，两者由对称链分解统一证明，是集族极值问题的基准结论"],
        formulas: ["Sperner：反链 F ⊆ 2^[n] 满足 |F| <= C(n, floor(n/2))", "LYM 不等式：sum_{A in F} 1 / C(n, |A|) <= 1", "取等刻画：n 偶数时唯一极值族为中间层；n 奇数时为两个中间层之一", "对称链分解：2^[n] 可分解为 C(n, floor(n/2)) 条对称链，每链至多含反链的一个成员", "Dilworth 视角：把包含关系视为偏序，最小链覆盖数 = 最大反链大小", "概率证明：随机取满链，P(链遇到 A) = 1 / C(n, |A|)，期望遇到成员数 <= 1"],
        theorems: ["LYM 强于 Sperner：把所有 |A| 换为 floor(n/2) 得 |F| / C(n, floor(n/2)) <= 1，故解题应优先建立 LYM 再退化到 Sperner", "对称链分解的存在性给出结构性证明并直接得取等条件：反链达到最大当且仅当在每条对称链上恰取一点且落在同一中间层，因此“规模最大”与“位于中间层”是等价的（n 偶数时）", "极值族唯一性对奇偶敏感：n 奇数时中间两层规模相同，极值族不唯一，故不能笼统声称极值族是“第 floor(n/2) 层”", "推广方向明确：Erdős 的 k-Sperner 定理给不含 k+1 条链的族最大规模为最大 k 个中间层之和；Bollobás-Lubell 型加权推广仍以 LYM 为原型", "反链上界不能与交叉族上界混用：Sperner 限制包含关系，Erdős-Ko-Rado 限制相交性，二者的极值构型（中间层与星族）本质不同"],
        generalRequirements: ["必须明确所限制的关系是包含还是相交", "使用 LYM 必须按成员大小分层加权", "断言极值族必须讨论 n 的奇偶"],
        forbiddenErrors: ["【条件混用】把反链极值界用于交叉族问题", "【奇偶忽略】n 奇数时断言极值族唯一", "【权重错配】LYM 中用 C(n, floor(n/2)) 代替 C(n, |A|) 作分母", "【链覆盖误算】声称对称链条数不等于 C(n, floor(n/2))", "【非最大反链当极值】用某个不可扩反链的大小充当上界"],
        parameterConstraints: { relationType: "反链条件为两两不包含。", weightForm: "LYM 的分母是成员自身大小的二项系数。", parityCase: "极值族的唯一性依赖 n 的奇偶。", groundSetFixed: "结论针对固定基集 [n] 的子集族。" },
        closureChecks: ["确认族满足反链条件。", "写出 LYM 加权和并验证 <= 1。", "退化得 Sperner 界。", "讨论取等构型与 n 的奇偶。"],
        scenarioChecks: { antichainBound: ["验证两两不包含", "套用 C(n, floor(n/2))", "指出中间层达到上界"], weightedEstimate: ["按大小分层", "建立 LYM 求和", "由权重推出各层规模限制"], chainDecomposition: ["构造对称链分解", "论证每链至多一个成员", "由链条数得界与取等条件"] },
    },
    // Erdős-Ko-Rado 定理与交叉族极值。
    "extremal-erdos-ko-rado": {
        definitions: ["k-一致交叉族指 [n] 的 k 元子集族中任意两成员相交；Erdős-Ko-Rado 定理给出 n >= 2k 时的最大规模及极值构型（全部含某固定点的星族），并以循环置换法给出标准证明"],
        formulas: ["EKR：n >= 2k 时最大交叉族规模为 C(n-1, k-1)", "星族构造：F_x = {A : |A| = k, x in A}，|F_x| = C(n-1, k-1)", "n = 2k 的临界情形：每对补集恰取一个，规模为 (1/2) C(2k, k) = C(2k-1, k-1)，极值族不唯一", "循环置换法：在长度 n 的圆排列上至多可取 k 个成为区间的交叉成员，得 |F| / C(n, k) <= k / n", "Hilton-Milner：n > 2k 时非星族的交叉族满足 |F| <= C(n-1, k-1) - C(n-k-1, k-1) + 1", "t-交叉推广（Frankl, Ahlswede-Khachatrian）：|A ∩ B| >= t 时极值族在 n 较大时为 {A : [t] ⊆ A}"],
        theorems: ["条件 n >= 2k 不可去：n < 2k 时任意两个 k 元集必相交，全体 C(n, k) 个集合都构成交叉族，故极值问题失去意义，凡使用 EKR 必须先核对 n >= 2k", "循环置换法的关键计数是“圆上区间型成员至多 k 个”，由此得密度界 k/n，与星族密度 C(n-1,k-1)/C(n,k) = k/n 一致，说明界紧且极值族对应密度取等", "唯一性区分严格与临界：n > 2k 时极值族必为星族（唯一到点的选择），n = 2k 时任何“每对补集取一”的族都极值，故不能笼统断言极值族是星族", "Hilton-Milner 定理说明星族之外存在明显间隙（稳定性），因此接近最大的交叉族必接近星族，这类稳定性结论不能由 EKR 本身推出", "交叉性与其他集族条件不可混：EKR 处理相交约束，Sperner 处理包含约束，Frankl-Rödl 型结果处理禁距离约束，极值构型分别是星族、中间层与代数构造"],
        generalRequirements: ["必须验证一致性 k 与条件 n >= 2k", "断言极值族必须区分 n > 2k 与 n = 2k", "使用密度形式必须写出 k/n 的来源"],
        forbiddenErrors: ["【范围失检】n < 2k 时仍断言最大规模为 C(n-1, k-1)", "【唯一性越界】n = 2k 时声称极值族唯一为星族", "【非一致族混入】把非 k 元的集合放进 k-一致族的计数", "【t-交叉误推】把 t = 1 的极值构型直接用于 t >= 2 而不检验 n 的范围", "【稳定性无据】不引用 Hilton-Milner 就断言接近极值必为星族"],
        parameterConstraints: { uniformity: "族须为 k-一致。", rangeCondition: "EKR 上界要求 n >= 2k。", criticalCase: "n = 2k 时极值族不唯一。", tIntersecting: "t >= 2 的极值构型依赖 n 与 t 的关系。" },
        closureChecks: ["检验一致性与 n >= 2k。", "给出星族作为下界构造。", "用循环置换法或压缩法证明上界。", "按 n 与 2k 的关系陈述唯一性。"],
        scenarioChecks: { maximumIntersecting: ["确认 n >= 2k", "取固定点星族", "由 k/n 密度界证明最优"], criticalHalf: ["n = 2k 时按补集配对", "每对取一个", "说明极值族的多样性"], nonStarFamily: ["排除星族", "套用 Hilton-Milner 界", "给出对应极值构型"] },
    },
    // Kruskal-Katona 定理与压缩法。
    "extremal-kruskal-katona": {
        definitions: ["k-一致族的阴影是其成员删去一个元素所得的 (k-1) 元集全体；Kruskal-Katona 定理用殖民序（colex）下的初始段给出阴影规模的精确下界，压缩法是把任意族单调化为初始段的标准技术"],
        formulas: ["k-级联表示：m = C(a_k, k) + C(a_{k-1}, k-1) + ... + C(a_s, s)，a_k > a_{k-1} > ... > a_s >= s >= 1（表示唯一）", "Kruskal-Katona：|F| = m 时 |partial F| >= C(a_k, k-1) + C(a_{k-1}, k-2) + ... + C(a_s, s-1)", "局部 LYM（归一化形式）：|partial F| / C(n, k-1) >= |F| / C(n, k)", "Lovász 版本：|F| = C(x, k)（x 实数）时 |partial F| >= C(x, k-1)", "上阴影对偶：|F| = C(x, k) 时 |partial^{up} F| >= C(n - x, ...) 由补族转化得到", "殖民序：A < B 当且仅当 max(A Δ B) in B"],
        theorems: ["定理的取等构型是殖民序初始段，故阴影界是精确的（不只是渐近的），凡给出弱于初始段的构型都不能达到下界", "压缩（compression）保持族的一致性并不增大阴影，因此把任意族逐步压缩为初始段是合法的极值化操作；但压缩不保持“相交性”等其他性质时必须改用适配的压缩算子（如 (i, j)-shift）", "k-级联表示必须严格递减且下标随之递减，否则表示不唯一且阴影界公式失效，故解题第一步是写出并验证该表示", "局部 LYM 是 Kruskal-Katona 的归一化弱化，可直接推出 LYM 与 Sperner，说明阴影界统辖布尔格上的层级极值不等式", "上阴影与下阴影不是对称结论：由补运算相互转化时一致性参数变为 n - k，故不能直接把下阴影公式套用于上阴影"],
        generalRequirements: ["必须写出 |F| 的 k-级联表示并验证参数严格递减", "使用压缩法必须说明压缩保持了所需性质", "区分下阴影与上阴影并给出对应界"],
        forbiddenErrors: ["【级联表示错】参数不严格递减或下标不匹配", "【构型不最优】以非初始段族声称达到阴影下界", "【压缩越界】用删元压缩处理相交性约束而不换算子", "【上下阴影混用】把下阴影公式直接用于上阴影", "【渐近化】把精确界弱化为渐近界后仍声称取等"],
        parameterConstraints: { cascadeUniqueness: "k-级联表示要求 a_k > ... > a_s >= s。", uniformity: "定理针对 k-一致族。", shadowDirection: "须固定下阴影或上阴影。", compressionValidity: "压缩算子须保持所考察的族性质。" },
        closureChecks: ["写出 |F| 的 k-级联表示。", "代入公式得阴影下界。", "用压缩法论证初始段最优。", "核对阴影方向与一致性参数。"],
        scenarioChecks: { shadowLowerBound: ["求 k-级联表示", "代入 Kruskal-Katona 公式", "以初始段验证取等"], layerInequality: ["改用局部 LYM 归一化形式", "在相邻层间比较密度", "推出 Sperner 型结论"], compressionProof: ["选择保持性质的压缩算子", "论证阴影不增", "归约到初始段"] },
    },
    // 向日葵引理与核的抽取。
    "extremal-sunflower-lemma": {
        definitions: ["k 花瓣向日葵指 k 个集合，任两者的交都等于同一个核 Y，且各集合去掉核后的花瓣两两不交；Erdős-Rado 向日葵引理断言足够大的一致族必含 k 花瓣向日葵，是抽取结构的基本工具"],
        formulas: ["Erdős-Rado：|F| > s!(k-1)^s（F 为 s-一致族）蕴含 F 含 k 花瓣向日葵", "核与花瓣：A_i ∩ A_j = Y（i ≠ j），花瓣 A_i \\ Y 两两不交且非空（或允许空核 Y = ∅ 即两两不交族）", "归纳步：若存在极大两两不交子族规模 < k，则其并集大小 < s(k-1)，某点被至少 |F| / (s(k-1)) 个成员覆盖，去点后对 s-1 归纳", "改进界（Alweiss-Lovett-Wu-Zhang 及后续）：|F| > (C k log k)^s 即可，常数 C 为绝对常数", "向日葵猜想：界应为 C(k)^s 形式，即 s 的指数中不含 log k，仍未解决"],
        theorems: ["引理的证明机制是二分讨论：要么已有 k 个两两不交的成员（空核向日葵），要么某点度数高从而可对一致性参数归纳，因此结论中“两两不交”必须被视为向日葵的合法特例", "界对 s 的依赖是本质的：s!(k-1)^s 中的 s! 来自逐层归纳，Alweiss-Lovett-Wu-Zhang 把它改进到 (k log k)^s 但未去掉 log k，故不能声称已知最优界", "花瓣两两不交与核统一是两条独立要求：仅有“任两交相同”不足以构成向日葵（还须花瓣不交），仅有“花瓣不交”也不足（还须交相同），审查时须逐条验证", "该引理是电路复杂度下界（Razborov 的近似方法）与集族极值论证的共用工具，其价值在于把任意大族化为高度对称的子结构，而非给出精确极值", "一致性不可去：非一致族中可以有任意多集合而无 k 花瓣向日葵（如按大小递增的链），因此使用前必须先把族分层为一致族"],
        generalRequirements: ["必须给出一致性参数 s 与目标花瓣数 k", "验证向日葵时须同时核对核相同与花瓣两两不交", "引用界时必须说明是经典 s!(k-1)^s 还是改进界"],
        forbiddenErrors: ["【一致性缺失】对非一致族直接套用引理", "【向日葵判据不全】只验证两两交相同而不验证花瓣不交", "【空核排除】把两两不交族排除在向日葵之外", "【最优界臆断】声称向日葵猜想已被证明", "【参数错位】把 k 与 s 在界 s!(k-1)^s 中互换"],
        parameterConstraints: { uniformity: "族须 s-一致（或先按大小分层）。", petalCount: "k 为花瓣数，k >= 2。", coreCondition: "核可为空集。", boundVersion: "须声明使用经典界或改进界。" },
        closureChecks: ["把族分层为一致族并确定 s。", "比较 |F| 与所用阈值。", "抽取核与花瓣并逐条验证两个条件。", "说明所用界的版本与出处。"],
        scenarioChecks: { extractSunflower: ["确认 s-一致与 |F| 超阈值", "按归纳或高度数点抽取", "验证核与花瓣条件"], disjointFamilyCase: ["先找极大两两不交子族", "若达 k 则得空核向日葵", "否则由覆盖点归纳降 s"], complexityApplication: ["把项集合建为一致族", "抽取向日葵合并项", "用于近似方法的下界论证"] },
    },
    // Szemerédi 正则性引理与三角形移除引理。
    "extremal-szemeredi-regularity": {
        definitions: ["正则性引理断言任意足够大的图的顶点集可划分为有界多个几乎等大的部，使得除少量例外对外，各对之间的边分布类似随机二部图；配合计数引理得到移除引理，是稠密图极值理论的核心框架"],
        formulas: ["eps-正则对：对 A' ⊆ A, B' ⊆ B 且 |A'| >= eps|A|, |B'| >= eps|B|，有 |d(A', B') - d(A, B)| <= eps，其中 d(X, Y) = e(X, Y) / (|X||Y|)", "正则划分：V = V_0 ∪ V_1 ∪ ... ∪ V_k，|V_0| <= eps n，|V_1| = ... = |V_k|，非 eps-正则的对数 <= eps k^2", "部数界：k <= M(eps)，其中 M 为 eps^{-5} 级的塔式（tower）函数，且该塔式依赖不可去（Gowers）", "均方密度（能量）增量：不正则时精化划分使 sum (|V_i||V_j|/n^2) d(V_i,V_j)^2 至少增加 eps^5，因能量 <= 1 故迭代次数有界", "三角形计数引理：三部密度均 >= 2eps 且两两 eps-正则时三角形数 >= (1 - 2eps) d_1 d_2 d_3 |V_1||V_2||V_3|", "三角形移除引理：任意 eps > 0 存在 delta > 0，若图含少于 delta n^3 个三角形，则可删去少于 eps n^2 条边使其无三角形"],
        theorems: ["引理只对稠密图有效：边数为 o(n^2) 时所有对的密度趋于 0，正则划分成立但不含信息，故稀疏情形必须改用稀疏正则性引理或转移原理", "部数的塔式依赖是本质的（Gowers 下界），因此凡由正则性引理导出的结论其定量界都极差，任何要求多项式界的结论都不能仅由正则性引理得到", "移除引理的 delta 与 eps 的关系继承塔式依赖，因此 Roth 定理经由移除引理只得极弱的界，而 Fourier 或 Sanders 方法给出显著更好的界，二者不可互换", "正则性 + 计数给出的是稠密子结构的存在性阈值：三部密度须显著大于 eps 才能保证三角形存在，密度低于 eps 时计数引理失效，故不能省略密度条件", "该框架推广为超图正则性引理（Gowers、Rödl-Skokan、Nagle-Rödl-Schacht），并给出多维 Szemerédi 定理；但超图版本的正则性概念更强且不能由图版本推出"],
        generalRequirements: ["必须先确认所研究的图是稠密图并给出 eps 与部数界的依赖关系", "使用计数引理必须验证正则性与密度下界两个条件", "由移除引理得算术结论必须说明界的定量弱点"],
        forbiddenErrors: ["【稀疏误用】对边数 o(n^2) 的图用稠密正则性引理并断言结构信息", "【密度条件省略】不验证密度 >= 2eps 就套用三角形计数引理", "【界的量级误称】声称正则性引理给出多项式量级的部数", "【例外对忽略】把全部对当作 eps-正则处理", "【超图直接推广】用图正则性引理代替超图正则性引理"],
        parameterConstraints: { densityRegime: "适用于边数 Theta(n^2) 的稠密图。", epsilonHierarchy: "delta 依赖 eps 且为塔式量级。", exceptionalPairs: "至多 eps k^2 对可不正则。", countingHypothesis: "计数引理要求密度显著大于 eps。" },
        closureChecks: ["确认稠密性并固定 eps。", "取正则划分并标出例外对与 V_0。", "对目标子结构验证正则性与密度条件后用计数引理。", "说明所得界的定量依赖。"],
        scenarioChecks: { triangleRemoval: ["设三角形数 < delta n^3", "取正则划分并清理低密度与不正则对", "由计数引理反证得删边界"], rothTheorem: ["把三项等差数列建为三部图", "应用移除引理", "指出所得界弱于 Fourier 方法"], embeddingSubgraph: ["验证各部两两正则", "核对密度下界", "由计数引理得子图数量下界"] },
    },
    // Dilworth 定理与偏序集的链分解。
    "extremal-dilworth-mirsky": {
        definitions: ["Dilworth 定理断言有限偏序集的最小链覆盖数等于最大反链大小，Mirsky 定理给出对偶的最小反链覆盖数等于最长链长度；两者是偏序集上的极小-极大定理，并与二部匹配对偶直接互推"],
        formulas: ["Dilworth：最小链覆盖数 = 最大反链大小", "Mirsky：最小反链覆盖数 = 最长链的元素个数", "Mirsky 的构造：按高度函数 h(x) = 最长以 x 结尾的链长度分层，每层为反链", "与 König 的关系：把偏序集的可比关系建为二部图，链覆盖对应匹配，得最小链覆盖 = n - 最大匹配", "Erdős-Szekeres 推论：长度 > (r-1)(s-1) 的序列含长 r 递增或长 s 递减子序列（由 Dilworth/Mirsky 得）", "偏序集乘积：dim 与链分解无关，但 n <= (最长链) * (最大反链) 由 Mirsky 分层立得"],
        theorems: ["Dilworth 与 Mirsky 不是同一定理的对偶自动推论：Mirsky 有一行式的高度函数证明，而 Dilworth 需要归纳或经由 König/最大流，因此不能声称把“链”与“反链”互换即得另一方", "Dilworth 等价于二部图的 König 定理（进而等价于最大流最小割），故偏序集上的极小-极大问题可用匹配算法在多项式时间求解，链覆盖的最优性证书是一条最大反链", "有限性是必要的：无限偏序集上 Dilworth 定理需要额外条件（有限宽度时仍成立），任意无限情形的链覆盖基数论断需选择公理并可能失败", "n <= (最长链长) * (最大反链大小) 给出 Erdős-Szekeres 型结论的统一来源，因此这类单调子序列问题应先建立偏序再套用分层论证，而不是逐一构造", "覆盖数与划分数在此一致：链覆盖可无损地取为链划分（去掉重复元素仍为链），故最小覆盖与最小划分数相同，但对一般集合覆盖问题这一化归不成立"],
        generalRequirements: ["必须写出所用偏序关系并验证其自反、反对称、传递", "断言最优覆盖必须给出等大小的反链（或链）作为证书", "使用 Erdős-Szekeres 推论必须说明偏序的构造方式"],
        forbiddenErrors: ["【定理互换】声称 Mirsky 是 Dilworth 的直接对偶推论", "【证书缺失】只给链覆盖而不给同规模反链证明最优", "【关系非偏序】所用关系不满足传递性仍套用定理", "【无限情形滥用】对无限宽度偏序集断言有限链覆盖", "【链反链混淆】把最长链与最大反链的角色互换"],
        parameterConstraints: { finiteness: "标准结论针对有限偏序集（或有限宽度）。", partialOrderAxioms: "关系须为偏序。", certificatePairing: "最优性须由等规模的对偶对象证明。", coverEqualsPartition: "链覆盖可取为链划分。" },
        closureChecks: ["写出偏序关系并验证公理。", "求最大反链或最长链。", "构造同规模的链覆盖或反链覆盖。", "核对极小-极大等式成立。"],
        scenarioChecks: { chainCovering: ["建可比性二部图", "求最大匹配得最小链覆盖", "由 König 读出最大反链"], monotoneSubsequence: ["按位置与数值建二维偏序", "用 Mirsky 分层", "由 n <= 长 * 宽 得 Erdős-Szekeres"], layerConstruction: ["计算高度函数", "按高度分层为反链", "验证层数等于最长链长"] },
    },
};
