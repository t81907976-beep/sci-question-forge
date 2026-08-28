import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“加性组合”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMBINATORICS_ADDITIVE_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 和集与差集的基本量与倍增常数。
    "additive-sumset-doubling": {
        id: "additive-sumset-doubling", l2Key: "combinatorics-additive", name: "和集倍增常数与 Ruzsa 距离", kind: "object",
        aliases: ["和集倍增常数", "Ruzsa距离", "差集大小估计", "加性三角不等式"],
    },
    // Plünnecke-Ruzsa 不等式与迭代和集。
    "additive-plunnecke-ruzsa": {
        id: "additive-plunnecke-ruzsa", l2Key: "combinatorics-additive", name: "Plünnecke-Ruzsa 不等式", kind: "theorem",
        aliases: ["Plünnecke-Ruzsa不等式", "迭代和集上界", "Plünnecke不等式", "多重和集估计"],
    },
    // Ruzsa 覆盖引理。
    "additive-ruzsa-covering": {
        id: "additive-ruzsa-covering", l2Key: "combinatorics-additive", name: "Ruzsa 覆盖引理", kind: "lemma",
        aliases: ["Ruzsa覆盖引理", "平移覆盖论证", "和集覆盖引理"],
    },
    // Freiman 逆定理与广义等差数列。
    "additive-freiman-theorem": {
        id: "additive-freiman-theorem", l2Key: "combinatorics-additive", name: "Freiman 逆定理", kind: "theorem",
        aliases: ["Freiman定理", "广义等差数列", "小倍增结构定理", "Green-Ruzsa定理"],
    },
    // Kneser 定理与和集下界。
    "additive-kneser-bound": {
        id: "additive-kneser-bound", l2Key: "combinatorics-additive", name: "Kneser 定理与和集下界", kind: "theorem",
        aliases: ["Kneser定理", "Cauchy-Davenport不等式", "和集下界", "稳定化子论证"],
    },
    // 加性能量与 Balog-Szemerédi-Gowers 定理。
    "additive-energy-bsg": {
        id: "additive-energy-bsg", l2Key: "combinatorics-additive", name: "加性能量与 Balog-Szemerédi-Gowers 定理", kind: "theorem",
        aliases: ["加性能量", "Balog-Szemerédi-Gowers定理", "加法四元组计数", "大能量取子集"],
    },
    // 三项等差数列的密度定理与 Fourier 论证。
    "additive-roth-three-term": {
        id: "additive-roth-three-term", l2Key: "combinatorics-additive", name: "三项等差数列密度定理", kind: "theorem",
        aliases: ["三项等差数列密度定理", "Roth三项定理", "密度增量论证", "Behrend构造"],
    },
    // Szemerédi 等差数列定理与 Gowers 范数。
    "additive-szemeredi-gowers-norm": {
        id: "additive-szemeredi-gowers-norm", l2Key: "combinatorics-additive", name: "Szemerédi 等差数列定理与 Gowers 范数", kind: "theorem",
        aliases: ["Szemerédi等差数列定理", "Gowers一致性范数", "逆定理", "k项等差数列"],
    },
    // 有限群上的 Fourier 分析与 Bohr 集。
    "additive-fourier-bohr-set": {
        id: "additive-fourier-bohr-set", l2Key: "combinatorics-additive", name: "有限群 Fourier 分析与 Bohr 集", kind: "object",
        aliases: ["Bohr集", "有限群Fourier分析", "大频率集", "Chang谱引理"],
    },
    // Sidon 集与 B_h 集。
    "additive-sidon-set": {
        id: "additive-sidon-set", l2Key: "combinatorics-additive", name: "Sidon 集与 B_h 集", kind: "object",
        aliases: ["Sidon集", "B_h集", "完美差集", "Singer构造"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMBINATORICS_ADDITIVE_L3_RULES: Record<string, MathV2L3Rules> = {
    // 和集与差集的基本量与倍增常数。
    "additive-sumset-doubling": {
        definitions: ["和集 A + B = {a + b}、差集 A - B 与倍增常数 sigma(A) = |A + A|/|A| 度量集合偏离子群的程度；Ruzsa 距离 d(A, B) = log(|A - B|/sqrt(|A||B|)) 把这种偏离量化为满足三角不等式的伪距离"],
        formulas: ["平凡界：max(|A|, |B|) <= |A + B| <= |A||B|；在 Z 中 |A + A| >= 2|A| - 1，等号当且仅当 A 是等差数列", "倍增常数 sigma(A) = |A + A|/|A|；差集倍增 |A - A|/|A|；sigma(A) = 1 当且仅当 A 是某有限子群的平移", "Ruzsa 距离：d(A, B) = log(|A - B| / sqrt(|A| |B|))，满足 d(A, B) = d(B, A)、d(A, A) >= 0 与三角不等式 d(A, C) <= d(A, B) + b(B, C) 型形式 d(A,C) <= d(A,B) + d(B,C)", "Ruzsa 三角不等式（原始形式）：|A| |B - C| <= |A - B| |A - C|", "和差不对称：存在 |A + A| 与 |A - A| 相差任意多项式因子的集合（MSTD 集满足 |A+A| > |A-A|），但二者由 |A - A| <= |A + A|^2/|A| 型不等式互相控制", "Z 中的等差数列取 sigma ≈ 2，d 维广义等差数列取 sigma ≈ 2^d，随机集取 sigma ≈ |A|"],
        theorems: ["sigma(A) = 1 的刻画是全部小倍增理论的起点：只有子群的平移达到最小倍增，因此“倍增常数接近 1”应被理解为“接近子群或广义等差数列”，而非“接近任意结构”", "Ruzsa 距离不是度量：d(A, A) 一般严格大于 0（只有子群平移取 0），故不能用 d(A,B) = 0 推 A = B；能用的只是三角不等式", "和集与差集不能互推等价结论：MSTD 集的存在说明 |A + A| 与 |A - A| 的大小关系两个方向都可能，凡由差集小推出和集小的论证必须经 Plünnecke-Ruzsa 型不等式并承担多项式损失", "上界 |A + B| <= |A||B| 的等号刻画为“所有和互不相同”（Sidon 型条件），因此接近上界意味着无加性结构，与小倍增是两个极端", "倍增常数在取子集时不单调：A' ⊆ A 可以有 sigma(A') 远大于 sigma(A)，故不能通过验证子集的倍增来推断整体，反向的取子集论证必须显式给出子集的构造"],
        generalRequirements: ["必须指明所在的加法群（Z、Z_N 或一般阿贝尔群）", "使用倍增常数须写明是和集还是差集版本", "使用 Ruzsa 距离须声明它只满足三角不等式而非度量公理"],
        forbiddenErrors: ["【和差混用】由差集估计直接断言同阶的和集估计", "【度量误用】把 d(A,B) = 0 当作 A = B", "【单调性臆断】认为子集的倍增常数不超过原集合", "【群未声明】不指明所在群即使用子群刻画", "【等号误判】把 |A+A| = 2|A| - 1 的等差数列刻画用到一般群"],
        parameterConstraints: { ambientGroup: "须固定阿贝尔群。", finiteness: "A、B 须为有限非空集。", doublingDefinition: "sigma(A) = |A+A|/|A|。", ruzsaTriangle: "|A||B-C| <= |A-B||A-C|。" },
        closureChecks: ["写出所在群与集合大小。", "分别计算和集与差集大小。", "给出倍增常数或 Ruzsa 距离。", "与等差数列、子群、Sidon 集三种极端情形比对定位。"],
        scenarioChecks: { doublingEstimate: ["确定群与 A", "计算 |A + A|", "给出 sigma(A) 并定位结构类型"], triangleApplication: ["选取中间集 B", "施加 Ruzsa 三角不等式", "得目标差集的上界"], extremalCharacterization: ["判断是否达到下界或上界", "引用等差数列或 Sidon 刻画", "说明结构结论"] },
    },
    // Plünnecke-Ruzsa 不等式与迭代和集。
    "additive-plunnecke-ruzsa": {
        definitions: ["Plünnecke-Ruzsa 不等式把单次倍增的信息传递到任意多重和差集：若 |A + A| <= K|A|，则一切 |mA - nA| 都被 K 的固定幂次乘 |A| 控制，这是小倍增理论中把局部信息全局化的关键工具"],
        formulas: ["主结论：|A + A| <= K |A| ⇒ |mA - nA| <= K^{m+n} |A|（m, n >= 0 整数，mA 表示 m 重和集）", "非对称形式：|A + B| <= K |A| ⇒ 存在非空 A' ⊆ A 使 |A' + 2B| <= K^2 |A'|，迭代得 |A' + nB| <= K^n |A'|", "Ruzsa 覆盖配合形式：|A + B| <= K|B| 时 |nA - mA| 受 K 的幂次控制", "Plünnecke 的图论核心：分层交换图的放大因子（magnification ratio）具有乘性，D(G^{(k)}) >= D(G)^k", "Petridis 的现代证明：取使 |A' + B|/|A'| 最小的 A' ⊆ A，则该比值在再加 B 后不增，从而得到迭代界", "特例：|A - A| <= K^2 |A| 与 |A + A + A| <= K^3 |A|"],
        theorems: ["幂次 K^{m+n} 的形式是本质的：不能把常数换成 mnK 或 K + O(1) 型的线性依赖，且在 A 为广义等差数列时该幂次是紧的（差一个绝对常数），因此任何声称多重和集只损失常数因子的论证都是错的", "非对称版本必须先取子集 A'：对整个 A 断言 |A + 2B| <= K^2|A| 是错误的，存在反例；因此使用时必须显式保留“存在子集”这一量词并追踪 |A'| >= |A|/常数 之类的信息", "Plünnecke 型不等式对差集的处理不对称：由 |A + A| 小能控制 |A - A|，但从 |A - A| 小推 |A + A| 小同样成立（都经三角不等式），二者的常数幂次不同，不能互换", "该不等式在非交换群上失效（自由群中的例子给出指数增长），故所有结论必须声明加法群交换；非交换情形只有 Tao 的近似群理论给出较弱结论", "不等式给出的是上界而非结构：它不能替代 Freiman 定理，也不能由它推出 A 含长等差数列；把 |mA - nA| 的界当作结构结论是范围性误用"],
        generalRequirements: ["必须声明群为交换群并写明倍增常数 K 的定义", "使用非对称形式须保留“存在子集”量词与子集的大小信息", "结论只能作为基数上界使用，不得当作结构定理"],
        forbiddenErrors: ["【幂次错误】把 K^{m+n} 写成线性依赖 K", "【子集省略】非对称形式中对整个 A 断言结论", "【非交换外推】在非交换群上使用该不等式", "【结构误推】由多重和集界断言含长等差数列", "【方向混淆】混用和集与差集版本的常数幂次"],
        parameterConstraints: { abelianGroup: "群须交换。", doublingHypothesis: "假设 |A+A| <= K|A|。", exponentForm: "结论为 K^{m+n}|A|。", subsetQuantifier: "非对称形式须取子集 A' ⊆ A。" },
        closureChecks: ["写出倍增假设与常数 K。", "确定目标多重和差集的 m、n。", "施加相应形式并记录幂次。", "如用非对称形式则给出子集与其大小下界。"],
        scenarioChecks: { iteratedSumset: ["由 |A+A| <= K|A| 出发", "取 m、n 并施加不等式", "得 |mA - nA| <= K^{m+n}|A|"], asymmetricUse: ["写出 |A + B| <= K|A|", "取极小化比值的子集 A'", "得 |A' + nB| 的界"], structureBoundary: ["给出多重和集上界", "声明这不是结构结论", "若需结构则转 Freiman 定理"] },
    },
    // Ruzsa 覆盖引理。
    "additive-ruzsa-covering": {
        definitions: ["Ruzsa 覆盖引理用极大不交平移把一个集合装进另一个集合的少数平移之并：若 |A + B| <= K|B|，则 A 被 A + B - B 中至多 K 个元素的平移所覆盖，从而把基数信息转成覆盖（结构）信息"],
        formulas: ["标准形式：|A + B| <= K |B| ⇒ 存在 X ⊆ A，|X| <= K，使 A ⊆ X + B - B", "证明骨架：取 X ⊆ A 使 {x + B}_{x ∈ X} 两两不交且 X 极大，则 |X||B| = |X + B| <= |A + B| <= K|B| 给出 |X| <= K；极大性给出任意 a ∈ A 有 (a + B) ∩ (X + B) ≠ ∅，即 a ∈ X + B - B", "推论（同态型）：若 |A + A| <= K|A| 则 A ⊆ X + A - A，|X| <= K，可用于把和集控制传给群生成", "与 Plünnecke-Ruzsa 联用：先用不等式控制 |A + B| 再用覆盖得 nA - nA ⊆ 少数平移 + (A - A)", "Chang 型推论：覆盖后对 B - B 取 Bohr 集或子群近似，得 Freiman 定理证明中的关键步骤", "覆盖数的量级：|X| <= K 是紧的（B 为子群、A 为 K 个陪集之并时取等）"],
        theorems: ["覆盖引理的输出集是 B - B 而不是 B：由不交平移的极大性只能得到 a + B 与 x + B 相交，从而 a ∈ x + B - B；写成 A ⊆ X + B 是错误的，且存在反例", "极大不交族的选取必须是“极大”而非“最大”：贪心取到不能再加即可，无需最优，因此该引理是完全构造性的且不依赖任何选择公理式论证", "假设的形式是 |A + B| <= K|B|（以 B 的大小为分母）：若误写成 K|A|，得到的覆盖数界是错的；两种假设在 |A| 与 |B| 不同阶时差异巨大", "覆盖引理把基数假设转成集合包含，是从“统计信息”跨到“结构信息”的唯一初等步骤，因此 Freiman 型定理的证明必须经过它或其变体，纯计数不可能给出包含关系", "引理对非交换群有对应版本（用 A ⊆ X B B^{-1}），但那里左右乘的顺序不可交换，故交换群的写法不能照搬"],
        generalRequirements: ["必须写明假设是以 |B| 为分母的 |A + B| <= K|B|", "覆盖结论必须写成 X + B - B 的形式并给出 |X| <= K", "使用极大不交平移族时须说明其贪心可构造性"],
        forbiddenErrors: ["【覆盖集写错】结论写成 A ⊆ X + B", "【分母写错】假设误写为 |A + B| <= K|A| 仍断言 |X| <= K", "【极大性缺失】未用不交族的极大性即得覆盖", "【非交换照搬】在非交换群上沿用加法写法", "【覆盖数夸大】给出与 K 不匹配的覆盖数"],
        parameterConstraints: { hypothesisForm: "假设 |A + B| <= K|B|。", coveringSize: "|X| <= K。", coveringTarget: "结论为 A ⊆ X + B - B。", maximalFamily: "X 由极大不交平移族给出。" },
        closureChecks: ["核对假设的分母是 |B|。", "贪心取极大不交平移族得 X。", "由计数得 |X| <= K。", "由极大性得 A ⊆ X + B - B。"],
        scenarioChecks: { coveringStep: ["验证 |A + B| <= K|B|", "构造极大不交族", "写出 A ⊆ X + B - B 与 |X| <= K"], freimanReduction: ["先用 Plünnecke-Ruzsa 控制多重和集", "用覆盖引理换成包含关系", "进入结构逼近步骤"], groupGeneration: ["取 B = A", "覆盖得 A ⊆ X + A - A", "估计生成子群的大小"] },
    },
    // Freiman 逆定理与广义等差数列。
    "additive-freiman-theorem": {
        definitions: ["Freiman 逆定理是小倍增的结构刻画：整数集若倍增常数有界，则它必落在一个维数与体积都被该常数控制的广义等差数列（GAP）之中；一般阿贝尔群上的版本（Green-Ruzsa）把 GAP 换成“陪集前进”（子群加 GAP）"],
        formulas: ["广义等差数列：P = {a_0 + sum_{i=1}^{d} l_i a_i : 0 <= l_i < L_i}，维数 d，体积 prod L_i；称其真（proper）当所有表示互不相同", "Freiman 定理：A ⊆ Z 且 |A + A| <= K|A| ⇒ 存在真 GAP P，A ⊆ P，d <= d(K)，|P| <= f(K) |A|", "Ruzsa 的界与 Chang 的改进：d <= K - 1 型与 |P| <= exp(O(K^2 log^3 K)) |A|；Sanders 与 Schoen 给出多项式型改进", "多项式 Freiman-Ruzsa 猜想：可取 |P| <= K^{O(1)}|A|（在 F_2^n 中由 Gowers-Green-Manners-Tao 型工作解决为 Marton 猜想）", "Green-Ruzsa：一般阿贝尔群中 A ⊆ H + P，H 为子群，P 为 GAP，rank 与体积由 K 控制", "F_p^n 特例：|A + A| <= K|A| ⇒ A 含于大小 <= f(K)|A| 的子群（Ruzsa 的子群逼近）"],
        theorems: ["定理是双向的但两个方向的难度悬殊：GAP 的倍增常数不超过 2^d 是初等的，反向（由小倍增得 GAP）才是 Freiman 定理的内容，因此使用时必须说清用的是哪一方向", "GAP 必须要求“真”（proper）：否则体积与基数脱节，|P| <= f(K)|A| 这类结论失去意义；证明中把非真 GAP 化为真 GAP 是一个独立的技术步骤，不能省略", "常数 f(K) 的依赖是指数型的（Chang 的 exp(K^2 log^3 K)），多项式依赖仍是猜想（Z 中）；因此凡需要多项式界的推论都不能直接引用 Freiman 定理", "结论只给覆盖（A ⊆ P）而不给 A 在 P 中的密度下界超过 1/f(K)，也不断言 A 含长等差数列；由 Freiman 定理推出长等差数列须再用 Szemerédi 型结果", "在 F_p^n 中结论形态改变（子群逼近而非 GAP），因为该群的有限指数结构使 GAP 退化为子群；把 Z 的表述照搬到有限特征群上是错误的"],
        generalRequirements: ["必须声明所在群并给出对应的结构形态（GAP 或陪集前进）", "使用 GAP 须声明其为真 GAP 并给出维数与体积的界", "引用界时须说明是指数型依赖，不得当作多项式界"],
        forbiddenErrors: ["【非真GAP】不验证表示唯一即用体积估计基数", "【方向混淆】把易证方向当作 Freiman 定理", "【界过强】断言 |P| <= K^{O(1)}|A| 在 Z 中已证", "【形态照搬】在 F_p^n 中仍断言 GAP 形式", "【结构外推】由 A ⊆ P 断言 A 含长等差数列"],
        parameterConstraints: { doublingHypothesis: "|A + A| <= K|A|。", properGAP: "GAP 须为真。", dimensionBound: "维数 d 由 K 控制。", volumeBound: "|P| <= f(K)|A| 且 f 为指数型。" },
        closureChecks: ["写出群与倍增假设。", "选择对应的结构形态（GAP 或子群加 GAP）。", "给出维数与体积的显式依赖。", "验证 GAP 的真性并声明界的量级类型。"],
        scenarioChecks: { structureFromDoubling: ["验证 |A+A| <= K|A|", "引用 Freiman 或 Green-Ruzsa", "写出覆盖结构与参数界"], easyDirection: ["由 GAP 维数 d 出发", "估计 |P + P| <= 2^d |P|", "说明这是初等方向"], finiteFieldCase: ["确认群为 F_p^n", "改用子群逼近形式", "给出子群大小的界"] },
    },
    // Kneser 定理与和集下界。
    "additive-kneser-bound": {
        definitions: ["Kneser 定理给出阿贝尔群中和集大小的普遍下界：|A + B| >= |A + H| + |B + H| - |H|，其中 H 是 A + B 的稳定化子（使 A + B + H = A + B 的最大子群）；Cauchy-Davenport 不等式是其在 Z_p 上的特例"],
        formulas: ["Kneser：设 H = Stab(A + B) = {g : A + B + g = A + B}，则 |A + B| >= |A + H| + |B + H| - |H|", "无稳定化子情形（H 平凡）：|A + B| >= |A| + |B| - 1", "Cauchy-Davenport（Z_p，p 素数）：|A + B| >= min(p, |A| + |B| - 1)", "Z 中（无扭）：|A + B| >= |A| + |B| - 1，等号当且仅当 A、B 为同公差的等差数列", "Vosper 定理（等号邻域）：Z_p 中 |A + B| = |A| + |B| - 1 且规模条件满足时 A、B 必为同公差等差数列", "Davenport 常数与 Erdős-Ginzburg-Ziv：有限阿贝尔群上零和序列长度的对应界"],
        theorems: ["下界必须用稳定化子表述：在含非平凡有限子群的群中 |A + B| >= |A| + |B| - 1 是错的（取 A = B = H 得 |A + B| = |H| < 2|H| - 1），因此 Cauchy-Davenport 的形式只对 Z_p 与无扭群成立", "min(p, ...) 中的截断不可省略：和集大小不能超过群的阶，故一切下界都要与群阶取小；忽略截断会给出大于 p 的“下界”", "稳定化子由 A + B 决定而非由 A 或 B 决定，且必须取最大者；用 A 的稳定化子代替会破坏不等式", "等号情形的刻画（Vosper、Kemperman 结构定理）比不等式本身强得多，且需要额外规模条件（如 |A|, |B| >= 2 与 |A + B| <= p - 2）；无条件断言等号即等差数列是错的", "Kneser 定理只对交换群成立；非交换情形的对应结论（Kemperman、Olson）形式不同且更弱，不能照搬"],
        generalRequirements: ["必须指明群并判断是否存在非平凡有限子群", "使用 Cauchy-Davenport 须写出与群阶取小的截断", "断言等号情形须给出 Vosper/Kemperman 的附加规模条件"],
        forbiddenErrors: ["【稳定化子忽略】在有扭群中直接用 |A|+|B|-1", "【截断省略】给出超过群阶的下界", "【稳定化子取错】用 A 的稳定化子代替 A+B 的", "【等号无条件】不验证规模条件即断言等差数列", "【非交换照搬】在非交换群上使用 Kneser 定理"],
        parameterConstraints: { abelianGroup: "群须交换。", stabilizerDefinition: "H = Stab(A+B) 取最大。", truncation: "下界须与群阶取小。", vosperConditions: "等号刻画须附加规模条件。" },
        closureChecks: ["确定群及其有限子群结构。", "计算或估计 A + B 的稳定化子。", "写出 Kneser 下界并作群阶截断。", "如需等号刻画则检验附加条件后引用 Vosper 或 Kemperman。"],
        scenarioChecks: { primeModulus: ["确认群为 Z_p", "用 Cauchy-Davenport", "取 min(p, |A|+|B|-1)"], generalAbelian: ["求 A+B 的稳定化子 H", "施加 Kneser 不等式", "得含 H 的下界"], equalityAnalysis: ["验证规模条件", "引用 Vosper 或 Kemperman", "断言等差数列或陪集结构"] },
    },
    // 加性能量与 Balog-Szemerédi-Gowers 定理。
    "additive-energy-bsg": {
        definitions: ["加性能量 E(A, B) 计数加法四元组 a + b = a' + b'，度量集合的“部分”加性结构；Balog-Szemerédi-Gowers 定理说明大能量必来自一个大子集上的真实小倍增，从而把统计信息转为结构信息"],
        formulas: ["能量定义：E(A, B) = #{(a, b, a', b') ∈ A×B×A×B : a + b = a' + b'} = sum_x r_{A+B}(x)^2 = sum_x r_{A-B}(x)^2 型（按定义取和或差）", "Fourier 表示：E(A) = sum_xi |hat{1_A}(xi)|^4（归一化依约定）", "平凡界：|A|^2 <= E(A, A) <= |A|^3；由 Cauchy-Schwarz 得 E(A, B) >= |A|^2|B|^2/|A + B|", "小倍增蕴含大能量：|A + A| <= K|A| ⇒ E(A) >= |A|^3/K", "Balog-Szemerédi-Gowers：E(A, B) >= |A|^{3/2}|B|^{3/2}/K 型假设（或 E(A) >= |A|^3/K）⇒ 存在 A' ⊆ A，|A'| >= c K^{-C}|A|，使 |A' + A'| <= C' K^{C'}|A'|", "常数量级：现代证明给出 |A'| >= K^{-O(1)}|A| 与 |A' ± A'| <= K^{O(1)}|A'|"],
        theorems: ["大能量不蕴含整体小倍增：把一个小倍增集与一个大随机集并起来，能量由前者主导而 |A + A| 仍很大，因此 BSG 中“取子集”这一步不可去，任何省略子集的推论都是错的", "能量与倍增的关系是单向的：小倍增经 Cauchy-Schwarz 必给大能量，反向只有 BSG 的带损失版本，且损失是多项式的（不能是常数）", "Cauchy-Schwarz 下界 E(A,B) >= |A|^2|B|^2/|A+B| 是所有能量论证的起点，方向必须正确：它给下界而非上界，用它去界住能量的上方是方向性错误", "BSG 的图论核心是稠密二部图中存在“大量路径的子图”（近似正则化 + 路径计数），因此其结论天然只对子集成立；能量的定义中四元组的角色必须在计数时保持一致（不能混淆和型与差型）", "能量在取子集时不具单调控制：子集能量可以按体积比例的高次幂下降，故不能通过子集能量推断整体能量，反之亦然"],
        generalRequirements: ["必须写出能量的精确计数定义并固定和型或差型", "使用 BSG 须保留子集量词并给出 |A'| 的下界与新倍增的界", "所有损失必须显式写成 K 的幂次"],
        forbiddenErrors: ["【子集省略】由大能量直接断言 |A+A| 小", "【方向反用】把 Cauchy-Schwarz 下界当上界", "【和差混淆】计数中混用 a+b=a'+b' 与 a-b=a'-b' 两种四元组", "【损失省略】声称 BSG 只损失绝对常数", "【单调性臆断】由子集能量推断整体能量"],
        parameterConstraints: { energyDefinition: "E 为加法四元组个数。", trivialRange: "|A|^2 <= E(A) <= |A|^3。", bsgSubset: "BSG 结论只对子集 A' 成立。", polynomialLoss: "损失为 K 的幂次。" },
        closureChecks: ["写出能量的计数定义与类型。", "用 Cauchy-Schwarz 得能量与和集的关系。", "若需结构则引用 BSG 并取子集。", "写出子集大小与新倍增常数的幂次依赖。"],
        scenarioChecks: { energyLowerBound: ["写出 |A + B|", "施加 Cauchy-Schwarz", "得 E >= |A|^2|B|^2/|A+B|"], bsgApplication: ["由大能量假设出发", "引用 BSG 取子集 A'", "写出 |A'| 与 |A'+A'| 的幂次界"], counterexampleCheck: ["构造小倍增集并随机集的并", "核对能量大而倍增大", "说明子集步骤必要"] },
    },
    // 三项等差数列的密度定理与 Fourier 论证。
    "additive-roth-three-term": {
        definitions: ["三项等差数列密度定理断言正上密度的整数集必含三项等差数列，其定量形式给出无三项等差数列集合在 [N] 中的密度上界；标准证明用 Fourier 分析作密度增量迭代，Behrend 构造给出下界"],
        formulas: ["定性形式：A ⊆ Z 上密度为正 ⇒ A 含 x, x+d, x+2d（d ≠ 0）", "定量形式（无三项等差数列集）：r_3(N) = o(N)；Roth 的界 r_3(N) = O(N/log log N)，Bourgain、Sanders 至 O(N (log log N)^k/log N) 型，Bloom-Sisask 给出 O(N/(log N)^{1+c})", "Behrend 下界：r_3(N) >= N exp(-C sqrt(log N))，由高维球面上无三点共线的构造给出", "Fourier 论证：三项等差数列计数 = sum_xi hat{1_A}(xi)^2 hat{1_A}(-2xi)（Z_N 中，N 奇），主项为 delta^3 N^2", "密度增量：若无三项等差数列，则存在非零频率 xi 使 |hat{1_A}(xi)| >= c delta^2，在对应的等差子列上密度增至 delta + c delta^2", "迭代终止：密度不能超过 1，故迭代次数 O(1/delta)，每次长度开根号或除以常数幂，反解得 delta 的上界"],
        theorems: ["Fourier 论证必须在 Z_N（N 为奇素数或与 2 互素）上进行：三项等差数列的线性形式含系数 2，在偶模数下 2 不可逆会破坏计数恒等式，因此从 [N] 转到 Z_N 时须取合适模数并控制回绕（wrap-around）", "密度增量的增益量级 c delta^2（而非 c delta）决定了最终界的对数量级：把增益写成常数或线性于 delta 会得到错误的（过强的）界", "Behrend 构造说明密度上界不可能是 N^{1-c} 型：任何声称无三项等差数列集只有多项式小密度的结论都与该构造矛盾，因此上界只能是准对数型", "三项情形可用单一 Fourier 变换（一致性即 U^2 控制），但四项及以上不行：存在 Fourier 一致但含异常多四项等差数列的集合（如 x^2 型相位），故必须换用 Gowers 范数", "从 Z_N 结论回到 [N] 需处理回绕：只在中间三分之一取值或用 Bohr 集截断，否则计数中会混入非真实的等差数列"],
        generalRequirements: ["必须声明工作模数与从 [N] 到 Z_N 的转换及回绕处理", "密度增量论证须写出增益量级与迭代终止条件", "给出上界时须与 Behrend 下界的量级作一致性核对"],
        forbiddenErrors: ["【模数不当】在偶模数下使用含 2 的线性形式", "【回绕忽略】不处理 Z_N 到 [N] 的回绕即计数", "【增益夸大】把密度增益写成常数或线性于 delta", "【界过强】断言多项式小的密度上界", "【方法外推】用单一 Fourier 一致性处理四项等差数列"],
        parameterConstraints: { modulus: "模数须与 2 互素。", densityIncrement: "增益量级为 delta^2。", iterationBound: "迭代次数受密度不超过 1 限制。", behrendConsistency: "上界须弱于 exp(-C sqrt(log N)) 型下界。" },
        closureChecks: ["把问题转到合适的 Z_N 并处理回绕。", "写出三项等差数列的 Fourier 计数恒等式。", "由无解假设提取大频率并作密度增量。", "迭代反解得密度上界并与 Behrend 下界核对。"],
        scenarioChecks: { fourierCounting: ["取奇模数 Z_N", "写出计数恒等式与主项 delta^3 N^2", "比较主项与误差项"], densityIncrementIteration: ["提取 |hat{1_A}(xi)| >= c delta^2", "在等差子列上提升密度", "统计迭代次数得上界"], lowerBoundCheck: ["引用 Behrend 构造", "核对与所得上界不矛盾", "说明界的可能量级"] },
    },
    // Szemerédi 等差数列定理与 Gowers 范数。
    "additive-szemeredi-gowers-norm": {
        definitions: ["Szemerédi 定理把三项结论推广到任意长度：正上密度集含任意长等差数列；其定量证明用 Gowers 一致性范数 U^k 度量集合与“次数 k-1 多项式相位”的相关性，逆定理说明大 U^k 范数必来自多项式相位结构"],
        formulas: ["定理：A ⊆ Z 上密度为正 ⇒ 对每个 k，A 含 k 项等差数列；等价定量形式 r_k(N) = o(N)", "Gowers 范数：‖f‖_{U^k}^{2^k} = E_{x, h_1, ..., h_k} prod_{omega ∈ {0,1}^k} C^{|omega|} f(x + omega · h)，C 为复共轭", "范数塔：‖f‖_{U^1} <= ‖f‖_{U^2} <= ... <= ‖f‖_{U^k} <= ‖f‖_infinity（Gowers-Cauchy-Schwarz 单调性）", "广义 von Neumann 定理：k 项等差数列计数与均值项之差被 ‖f‖_{U^{k-1}} 控制", "逆定理（Green-Tao-Ziegler）：‖f‖_{U^{k}} >= delta ⇒ f 与某个次数 <= k-1 的幂零序列（多项式相位）相关 >= c(delta)", "Gowers 的定量界：r_k(N) <= N/(log log N)^{c_k}；k = 4 时 Green-Tao 给出更好界；下界仍为 Behrend 型"],
        theorems: ["Fourier（U^2）一致性不足以控制四项及更长的等差数列：形如 e(x^2 alpha) 的二次相位集合 Fourier 一致但四项等差数列计数异常，因此 k >= 4 必须使用 U^{k-1} 与其逆定理", "Gowers 范数的单调性方向固定（U^1 <= U^2 <= ...）：小的高阶范数蕴含小的低阶范数，反之不成立；把方向写反会导致用弱一致性冒充强一致性", "广义 von Neumann 定理只控制“误差项”，主项仍需另行计算：只证 U^{k-1} 范数小不足以断言存在等差数列，还必须给出正的主项（密度的 k 次幂型）", "范数为零的刻画：‖f‖_{U^k} = 0 不意味 f = 0（只在 U^k 为半范数时如此），故不能把 U^k 当作严格范数用于唯一性论证；在有界函数上它是范数当 k >= 2 且定义域取环面等情形，须逐一确认", "遍历论证明（Furstenberg）与组合证明给出同一定理但不给可计算界：凡需要显式界的场合必须引用 Gowers 或后续的定量工作，不能引用遍历版本"],
        generalRequirements: ["必须写出所用 Gowers 范数的阶与完整平均定义", "使用广义 von Neumann 定理须同时给出主项估计", "引用界时须区分定性（遍历）与定量（Gowers 型）证明"],
        forbiddenErrors: ["【阶数不足】用 Fourier 一致性处理 k >= 4", "【单调性反用】由低阶范数小推高阶范数小", "【主项缺失】只估误差项即断言存在等差数列", "【范数性质误用】由 U^k 范数为零断言函数为零", "【界来源混淆】把遍历证明当作提供显式界"],
        parameterConstraints: { normOrder: "控制 k 项等差数列须用 U^{k-1}。", monotoneDirection: "U^1 <= U^2 <= ... 方向固定。", vonNeumannScope: "该定理只控制误差项。", quantitativeSource: "显式界须来自定量证明。" },
        closureChecks: ["确定等差数列长度 k 与所需范数阶。", "写出 U^{k-1} 范数定义并估计其大小。", "用广义 von Neumann 分离主项与误差项。", "必要时引用逆定理得到多项式相位结构。"],
        scenarioChecks: { longAPCounting: ["写出 k 项等差数列的平均", "用广义 von Neumann 控制误差", "给出主项密度幂次"], inverseTheoremUse: ["由 U^k 范数大出发", "引用逆定理得多项式相位相关性", "进入结构化分解"], orderSelection: ["确认 k 的取值", "选取 U^{k-1}", "说明 Fourier 不足的原因"] },
    },
    // 有限群上的 Fourier 分析与 Bohr 集。
    "additive-fourier-bohr-set": {
        definitions: ["有限阿贝尔群上的 Fourier 变换把加性结构转成频率信息；Bohr 集 B(S, rho) = {x : ‖xi · x‖ <= rho for all xi ∈ S} 是频率受限的“近似子群”，在没有真子群可用的群（如 Z_N）中充当子群的替代物"],
        formulas: ["Fourier 变换（Z_N）：hat{f}(xi) = sum_x f(x) e(-xi x/N)，e(t) = exp(2 pi i t)；Parseval：sum_xi |hat{f}(xi)|^2 = N sum_x |f(x)|^2", "卷积定理：hat{f * g} = hat{f} hat{g}；和集计数 r_{A+B}(x) = (1_A * 1_B)(x)", "Bohr 集：B(S, rho) = {x ∈ Z_N : ‖xi x/N‖ <= rho, xi ∈ S}，秩 |S|，宽度 rho", "大小下界：|B(S, rho)| >= rho^{|S|} N（由鸽笼或 Minkowski 型论证）", "近似子群性：B(S, rho) + B(S, rho') ⊆ B(S, rho + rho')，故 B(S, rho/2) 在加法下近似封闭", "Chang 谱引理：Spec_alpha(A) = {xi : |hat{1_A}(xi)| >= alpha |A|} 含于秩 O(alpha^{-2} log(N/|A|)) 的 Bohr 集（或其对偶生成的低维格）"],
        theorems: ["Bohr 集不是子群：它对加法只近似封闭，宽度会累加，因此每次相加都必须缩小宽度；把 Bohr 集当子群使用（如断言 B + B = B）是核心错误", "Bohr 集的规则性（regularity）不是自动的：一般 Bohr 集的大小可能对宽度极端敏感，因此论证前必须先用 Bourgain 的规则化引理取一个规则的宽度值，否则宽度微调会使大小失控", "Chang 引理是把“大频率集可能很大”降为“大频率集低维”的关键：大频率个数本身只有 O(alpha^{-2}) 型界（Parseval），但其加性维数更小，这一点不能由 Parseval 直接得到", "在 F_p^n 中真子群充足，Bohr 集可换成子空间，论证显著简化；在 Z_N 中没有子群，因此 Bohr 集不可绕过——不能把 F_p^n 的子空间论证照搬到 Z_N", "Fourier 方法只捕捉线性（U^2）结构：由 hat{f} 全小只能断言与线性相位不相关，不能断言与二次相位不相关，故涉及高阶结构时 Fourier 分析必须让位于 Gowers 范数"],
        generalRequirements: ["必须固定群与 Fourier 变换的归一化约定", "使用 Bohr 集须给出秩与宽度并声明近似封闭时的宽度衰减", "涉及宽度调整须先引用规则化引理"],
        forbiddenErrors: ["【当作子群】断言 Bohr 集在加法下封闭", "【宽度不缩】多次相加不缩小宽度", "【规则性缺失】不作规则化即微调宽度", "【归一化混乱】Parseval 与卷积定理的常数不自洽", "【阶数误用】用 Fourier 小断言高阶一致性"],
        parameterConstraints: { finiteAbelian: "群须有限阿贝尔。", bohrRankWidth: "须给出秩 |S| 与宽度 rho。", sizeLowerBound: "|B(S,rho)| >= rho^{|S|} N。", regularity: "宽度调整须用规则化引理。" },
        closureChecks: ["写出 Fourier 变换与归一化约定。", "用 Parseval 或卷积定理转换计数问题。", "构造 Bohr 集并给出秩与宽度。", "作规则化并在相加处缩小宽度。"],
        scenarioChecks: { sumsetViaFourier: ["把 r_{A+B} 写成卷积", "取 Fourier 变换", "由频率估计得计数结论"], bohrSubstitute: ["确认群中无合适子群", "构造 Bohr 集替代", "给出大小下界与近似封闭性"], spectrumStructure: ["定义 Spec_alpha(A)", "引用 Chang 引理", "得低秩 Bohr 集包含"] },
    },
    // Sidon 集与 B_h 集。
    "additive-sidon-set": {
        definitions: ["Sidon 集（B_2 集）是所有两元和互不相同的集合，等价地所有非零差互不相同；B_h 集把条件推广到 h 元和；它们是“无加性结构”的极端，其最大规模由 Erdős-Turán 与 Singer 构造夹紧"],
        formulas: ["Sidon 条件：a + b = c + d（a,b,c,d ∈ A）仅在 {a,b} = {c,d} 时成立；等价 |A + A| = C(|A|, 2) + |A|，差互异", "极值规模（[N] 中）：|A| <= sqrt(N) + O(N^{1/4})（Erdős-Turán 上界），且存在 |A| = (1 + o(1)) sqrt(N) 的构造", "Singer 构造：用 PG(2, q) 的完美差集在 Z_{q^2+q+1} 中给出 q + 1 个元素的 Sidon 集，故 Z_N 中可达 (1+o(1)) sqrt(N)", "Bose 与 Ruzsa 的构造：借助 F_{q^2} 的乘法结构给出等价规模", "B_h 集：所有 h 元和互异，[N] 中 |A| <= (h N)^{1/h}(1 + o(1)) 型上界，下界由代数构造给出但常数未匹配", "能量与 Sidon：A 为 Sidon 集当且仅当 E(A) = 2|A|^2 - |A|（取最小可能值）"],
        theorems: ["Sidon 条件的两种表述（和互异与差互异）在阿贝尔群中等价，但在证明中必须选定一种并保持一致；把“差互异”用于计数和的表达式时需要重新核对重数（对角项）", "上界 sqrt(N) 的来源是差集计数：|A|(|A|-1) 个非零差互异且落在 (-N, N) 中，故 |A|^2 <~ 2N；精确常数需要更精细的论证（Erdős-Turán 用滑动窗口），因此简单计数只给出 sqrt(2N) 型界", "上下界的常数已匹配到 (1+o(1))：因此凡断言 [N] 中 Sidon 集可以有 N^{1/2 + c} 或只能有 N^{1/2 - c} 个元素的结论都是错的", "B_h 集的上下界常数尚未匹配（h >= 3），故引用 B_h 极值规模时只能写量级 N^{1/h} 而不能声称已知精确常数", "Sidon 集的加性能量取最小值，因此它与小倍增集是两个相反极端；无限 Sidon 集的密度（Erdős 问题）与有限情形结论不同，不能由有限构造直接外推到无限稠密性"],
        generalRequirements: ["必须写明 Sidon 或 B_h 条件的精确形式与所在区间或群", "引用极值规模须区分 h = 2（常数已匹配）与 h >= 3（仅量级）", "使用构造须指明所依赖的代数结构（射影平面或有限域）"],
        forbiddenErrors: ["【表述混用】和互异与差互异条件在同一计数中混用而不校正重数", "【常数误称】声称 B_h（h>=3）极值常数已确定", "【规模错阶】给出 N^{1/2±c} 型 Sidon 集规模", "【构造无依据】声称存在达到上界的构造而不指明代数来源", "【有限到无限】由有限构造外推无限 Sidon 集的密度"],
        parameterConstraints: { sidonCondition: "两元和互异（等价非零差互异）。", extremalSize: "[N] 中 |A| = (1+o(1)) sqrt(N)。", bhOrder: "B_h 集规模量级为 N^{1/h}。", energyMinimum: "E(A) = 2|A|^2 - |A|。" },
        closureChecks: ["写出所在区间或群与 Sidon/B_h 条件。", "用差集或和集计数给出规模上界。", "如需下界则引用 Singer 或 Bose 型构造。", "用加性能量取最小值作自检。"],
        scenarioChecks: { upperBoundProof: ["计数互异非零差", "与区间长度比较", "得 sqrt(N) 量级上界"], constructionCitation: ["选取素数幂 q", "引用 Singer 完美差集", "得 (1+o(1))sqrt(N) 规模"], energyCheck: ["计算 E(A)", "与 2|A|^2 - |A| 比较", "判定是否为 Sidon 集"] },
    },
};
