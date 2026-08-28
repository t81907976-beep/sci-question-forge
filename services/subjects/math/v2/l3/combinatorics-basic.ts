import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“计数组合”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMBINATORICS_BASIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 二项式系数的恒等式体系与系数提取。
    "counting-binomial-identities": {
        id: "counting-binomial-identities", l2Key: "combinatorics-basic", name: "二项式系数恒等式与系数提取", kind: "formula",
        aliases: ["二项式系数", "Vandermonde卷积", "上标求和恒等式", "系数提取法"],
    },
    // 容斥原理及其筛法形式。
    "counting-inclusion-exclusion": {
        id: "counting-inclusion-exclusion", l2Key: "combinatorics-basic", name: "容斥原理与错排计数", kind: "theorem",
        aliases: ["容斥原理", "错排数", "筛法计数", "至少一个性质的计数"],
    },
    // 球盒模型：可区分性与约束的十二重分类。
    "counting-twelvefold-way": {
        id: "counting-twelvefold-way", l2Key: "combinatorics-basic", name: "球盒模型与十二重计数", kind: "object",
        aliases: ["球盒模型", "十二重计数", "可区分性判定", "集合划分计数"],
    },
    // Catalan 数与反射法。
    "counting-catalan-numbers": {
        id: "counting-catalan-numbers", l2Key: "combinatorics-basic", name: "Catalan 数与反射法", kind: "formula",
        aliases: ["Catalan数", "反射法", "合法括号序列", "Dyck路径"],
    },
    // 指数生成函数与标号结构的构造法。
    "counting-egf-labeled-structures": {
        id: "counting-egf-labeled-structures", l2Key: "combinatorics-basic", name: "指数生成函数与标号结构构造", kind: "theorem",
        aliases: ["指数生成函数", "标号结构合并", "EGF乘积法则", "集合构造exp"],
    },
    // 拉格朗日反演与树计数。
    "counting-lagrange-inversion": {
        id: "counting-lagrange-inversion", l2Key: "combinatorics-basic", name: "拉格朗日反演与有根树计数", kind: "theorem",
        aliases: ["拉格朗日反演", "隐式方程系数提取", "有根树计数", "Cayley公式"],
    },
    // Burnside 引理与 Pólya 计数定理。
    "counting-burnside-polya": {
        id: "counting-burnside-polya", l2Key: "combinatorics-basic", name: "Burnside 引理与 Pólya 计数定理", kind: "theorem",
        aliases: ["Burnside引理", "Pólya计数定理", "轮换指标多项式", "不动点平均"],
    },
    // 鸽巢原理的加强形式与平均值论证。
    "counting-pigeonhole-strong-form": {
        id: "counting-pigeonhole-strong-form", l2Key: "combinatorics-basic", name: "鸽巢原理的加强形式", kind: "criterion",
        aliases: ["鸽巢原理", "抽屉原理", "平均值论证", "重复抽屉计数"],
    },
    // 格路计数与 Lindström-Gessel-Viennot 引理。
    "counting-lattice-path-lgv": {
        id: "counting-lattice-path-lgv", l2Key: "combinatorics-basic", name: "格路计数与 LGV 引理", kind: "theorem",
        aliases: ["格路计数", "Lindström-Gessel-Viennot引理", "不交路径组", "路径矩阵行列式"],
    },
    // 计数序列的奇点分析与系数渐近。
    "counting-singularity-analysis": {
        id: "counting-singularity-analysis", l2Key: "combinatorics-basic", name: "奇点分析与计数系数渐近", kind: "algorithm",
        aliases: ["奇点分析", "主奇点定位", "系数渐近估计", "转移定理"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMBINATORICS_BASIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // 二项式系数的恒等式体系与系数提取。
    "counting-binomial-identities": {
        definitions: ["二项式系数 C(n, k) 既是 k 元子集个数，也是 (1 + x)^n 的展开系数；恒等式体系的核心是把求和识别为某个生成函数的系数，从而把组合求和化为代数运算"],
        formulas: ["基本关系：C(n, k) = C(n, n-k)，C(n, k) = C(n-1, k-1) + C(n-1, k)，k C(n, k) = n C(n-1, k-1)", "上标求和：sum_{k=0}^{m} C(n + k, k) = C(n + m + 1, m)；平行求和：sum_{k <= m} C(k, r) = C(m + 1, r + 1)", "Vandermonde 卷积：sum_k C(m, k) C(n, p - k) = C(m + n, p)；特例 sum_k C(n, k)^2 = C(2n, n)", "交错和：sum_k (-1)^k C(n, k) k^m = 0（m < n），= (-1)^n n!（m = n）", "系数提取记号：[x^n] (1 + x)^m = C(m, n)，[x^n] (1 - x)^{-r} = C(n + r - 1, r - 1)", "广义二项式：C(alpha, k) = alpha(alpha-1)...(alpha-k+1)/k! 对任意实数 alpha 有定义，(1 + x)^alpha = sum_k C(alpha, k) x^k 在 |x| < 1 收敛"],
        theorems: ["上指标为负或非整数时 C(n, k) 仍由下降阶乘定义，但组合解释失效，故只能用代数恒等式而不能用子集计数论证；负上标反射律为 C(-n, k) = (-1)^k C(n + k - 1, k)", "组合求和的三条标准路径：双计数（同一集合两种数法）、生成函数系数比较、对上界作数学归纳；三者中生成函数法最不依赖求和上界的具体形式，故对含参数求和最稳健", "Vandermonde 卷积等价于 (1+x)^m (1+x)^n = (1+x)^{m+n} 的系数比较，故一切形如 sum_k C(a, k) C(b, c - k) 的和都可由生成函数乘积求出，无需逐项处理", "超几何判据（Gosper-Zeilberger）：形如 sum_k t(k) 且 t(k+1)/t(k) 为 k 的有理函数的和是否有封闭形式可机械判定，故不存在封闭形式的和（如 sum_k C(n, k)^3）不应强求恒等式", "Lucas 定理给出 C(n, k) mod p 由 n、k 的 p 进位数字乘积决定，故整除性问题应转到 p 进表示而非直接展开阶乘"],
        generalRequirements: ["必须写清求和变量的取值范围，并约定 k < 0 或 k > n 时 C(n, k) = 0", "使用组合解释论证时必须确认上标为非负整数", "交换求和次序或改变求和变量前必须确认求和为有限和或绝对收敛"],
        forbiddenErrors: ["【组合解释越界】对负数或非整数上标使用子集计数解释", "【边界项遗漏】求和时漏掉 k = 0 或 k = n 的端项，或未约定越界系数为零", "【卷积错配】使用 Vandermonde 卷积时把两个系数的下标之和写错，未对应到同一 x 的幂次", "【封闭形式强求】对不存在超几何封闭形式的和硬凑答案", "【阶乘约分错误】在 k > n 时仍按 n!/(k!(n-k)!) 计算，出现负数阶乘"],
        parameterConstraints: { upperIndexInteger: "组合解释要求上标为非负整数。", outOfRangeConvention: "k < 0 或 k > n 时约定 C(n, k) = 0。", generalizedBinomialRadius: "广义二项式展开要求 |x| < 1（alpha 非非负整数时）。", summationFiniteness: "交换求和次序要求有限和或绝对收敛。" },
        closureChecks: ["确认上标类型并选择组合解释或代数恒等式。", "写出求和范围与越界约定。", "用生成函数系数比较或双计数完成证明。", "对小 n 代入数值验证恒等式。"],
        scenarioChecks: { convolutionSum: ["识别为两个生成函数的 Cauchy 乘积", "比较同幂次系数", "读出 Vandermonde 型结果"], alternatingSum: ["写成 (1 - x)^n 的系数或差分算子作用", "用 n 阶差分消去低次多项式", "确认 m 与 n 的大小关系决定结果"], divisibilityQuestion: ["转为 p 进表示并用 Lucas 定理", "逐位比较数字", "确认进位导致的因子 p"] },
    },
    // 容斥原理及其筛法形式。
    "counting-inclusion-exclusion": {
        definitions: ["容斥原理把“至少具有一个性质”的计数化为各性质交集大小的交错和；筛法形式把“不具任何性质”的计数写成同样的交错和，是处理带禁止条件计数的基本工具"],
        formulas: ["并集形式：|A_1 ∪ ... ∪ A_n| = sum_{∅ ≠ S ⊆ [n]} (-1)^{|S|-1} |A_S|，其中 A_S = ∩_{i in S} A_i", "筛法形式：满足零个性质的元素数 N_0 = sum_{S} (-1)^{|S|} N(S)，N(S) 表示至少满足 S 中全部性质的元素数", "恰好 m 个性质：N_{=m} = sum_{j >= m} (-1)^{j-m} C(j, m) N_j，其中 N_j = sum_{|S| = j} N(S)", "错排数：D_n = n! sum_{k=0}^{n} (-1)^k / k!，递推 D_n = (n-1)(D_{n-1} + D_{n-2})，D_n / n! -> 1/e", "满射计数：从 n 元集到 m 元集的满射数为 sum_{k=0}^{m} (-1)^k C(m, k) (m - k)^n", "Euler 函数：phi(n) = n prod_{p | n} (1 - 1/p) 即以“被 p 整除”为性质的容斥"],
        theorems: ["容斥原理的本质是恒等式 sum_{S ⊆ T} (-1)^{|S|} = [T = ∅]，故它是子集格上的 Möbius 反演的特例；这说明只要指标集构成有限偏序集，同型反演公式即成立", "Bonferroni 不等式：截断到偶数项给出上界、截断到奇数项给出下界，即部分和交替包夹真值，故在项数过多时可用截断得到严格估计而不是近似", "容斥的复杂度是 2^n 项，故实用性取决于 N(S) 是否只依赖 |S|（对称情形），此时求和退化为 n + 1 项；不对称时应改用递推、转移矩阵或概率方法", "错排数的渐近 D_n / n! -> 1/e 收敛极快（误差小于 1/(n+1)!），故有限 n 的估计可直接用 1/e 且给出显式误差界", "容斥可推广到带权形式 sum_S (-1)^{|S|} w(A_S)，只要 w 是有限可加测度；因此对概率、体积、生成函数系数均适用"],
        generalRequirements: ["必须明确“性质”的定义使 N(S) 只依赖交集而非顺序", "必须写出全部子集求和或说明对称性下的退化形式", "使用截断估计必须指明截断项数的奇偶与不等式方向"],
        forbiddenErrors: ["【符号错位】把 (-1)^{|S|} 与 (-1)^{|S|-1} 混用，导致并集与补集形式互换", "【交集独立性假设】默认 |A_i ∩ A_j| = |A_i| |A_j| / N 之类的独立性而不验证", "【恰好 m 个误算】把 N_m（至少 m 个的和）直接当作恰好 m 个的计数", "【不等式方向错误】用偶数项截断当下界或奇数项截断当上界", "【无限集直接套用】对无限集或不可加权重直接使用容斥而不做有限化"],
        parameterConstraints: { propertyWellDefined: "N(S) 必须只依赖子集 S 本身。", finiteAdditivity: "带权形式要求权为有限可加。", symmetryForReduction: "退化为 n+1 项求和要求 N(S) 只依赖 |S|。", truncationParity: "Bonferroni 截断的不等式方向由末项奇偶决定。" },
        closureChecks: ["列出性质集合并写出 N(S) 表达式。", "确认使用并集形式还是筛法形式并核对符号。", "若求恰好 m 个，使用带 C(j, m) 的公式。", "必要时用小规模枚举校验结果。"],
        scenarioChecks: { forbiddenPositionCounting: ["把禁止位置设为性质", "计算 N(S) 为选定禁止位后的剩余排列数", "代入筛法公式得错排型结果"], surjectionCounting: ["以“某个像点未被取到”为性质", "得到 (m-k)^n 型交集计数", "写出交错和"], numberTheoreticSieve: ["以素因子整除为性质", "利用乘性得到乘积形式", "确认无平方因子条件"] },
    },
    // 球盒模型：可区分性与约束的十二重分类。
    "counting-twelvefold-way": {
        definitions: ["球盒模型按“球是否可区分、盒是否可区分、每盒是否受限（任意/至多一个/至少一个）”三个维度分类，给出十二种基本计数问题；它是判断一道计数题真正类型的标准坐标系"],
        formulas: ["球异盒异：任意为 m^n，至少一个为 m! S(n, m)（S 为集合划分数），至多一个为 m(m-1)...(m-n+1)", "球同盒异：任意为 C(n + m - 1, n)，至少一个为 C(n - 1, m - 1)，至多一个为 C(m, n)", "球异盒同：任意为 sum_{k=1}^{m} S(n, k)，至少一个为 S(n, m)，至多一个为 [n <= m]", "球同盒同：任意为 p_{<= m}(n)（把 n 拆成至多 m 个正整数之和的拆分数），至少一个为 p_m(n)，至多一个为 [n <= m]", "隔板法：正整数解 x_1 + ... + x_m = n 有 C(n - 1, m - 1) 组，非负整数解有 C(n + m - 1, m - 1) 组", "拆分数生成函数：sum_n p(n) q^n = prod_{k >= 1} 1/(1 - q^k)；至多 m 部分时取 prod_{k=1}^{m} 1/(1 - q^k)"],
        theorems: ["盒可区分与不可区分之间不是简单除以 m!：只有当所有盒内容互不相同时商才是整数，故“先算有序再除以 m!”只在无重复配置时正确，一般情形必须用集合划分数或拆分数", "拆分数没有初等封闭形式，其精确值由 Euler 五边形数递推给出，渐近由 Hardy-Ramanujan 公式 p(n) ~ exp(pi sqrt(2n/3))/(4n sqrt3) 给出；故球同盒同类问题不应期待二项式型答案", "共轭拆分（Young 图转置）给出对合双射，故“至多 m 个部分”的拆分数等于“每部分至多为 m”的拆分数，这是把约束在两种形式间转换的标准手段", "球异盒异且每盒至少一个的计数既可写成 m! S(n, m)，也可由容斥写成 sum_k (-1)^k C(m, k)(m-k)^n，两式相等给出集合划分数的显式公式", "重复组合 C(n + m - 1, n) 的隔板法证明要求盒可区分，若盒不可区分则该公式失效；这是最常见的模型误判来源"],
        generalRequirements: ["必须先判定球与盒的可区分性，再判定每盒容量约束", "使用除以 m! 的化归必须验证不存在相同内容的盒", "涉及拆分数时必须说明是按部分个数还是按最大部分设限"],
        forbiddenErrors: ["【可区分性误判】把不可区分的盒当作可区分，或反之", "【盲目除阶乘】用有序结果除以 m! 处理不可区分盒而不检查重复配置", "【隔板法越界】对不可区分的盒使用隔板法", "【拆分数封闭形式】声称拆分数有二项式型封闭表达", "【空盒约束遗漏】把“至少一个”与“任意”混用，漏掉容斥或换成错误公式"],
        parameterConstraints: { distinguishability: "必须分别声明球与盒的可区分性。", capacityConstraint: "每盒容量为任意/至多一个/至少一个三类之一。", surjectivityRange: "至少一个的情形要求 n >= m。", injectivityRange: "至多一个的情形要求 n <= m。" },
        closureChecks: ["在十二格中定位问题类型。", "写出该格对应的公式并核对参数范围。", "若使用双射化归，验证双射的单值与满性。", "对小 n、m 枚举校验。"],
        scenarioChecks: { integerSolutionCounting: ["判定变量是否可区分（一般可区分）", "按正整数或非负整数选择隔板公式", "上界约束用容斥扣除"], setPartitionCounting: ["确认元素可区分、块不可区分", "用集合划分数或其容斥表达式", "按块数是否固定选择求和"], partitionOfInteger: ["确认球与盒都不可区分", "写出生成函数乘积形式", "必要时用共轭拆分转换约束"] },
    },
    // Catalan 数与反射法。
    "counting-catalan-numbers": {
        definitions: ["Catalan 数计数一类受“前缀部分和非负”约束的对象：合法括号序列、不越过对角线的格路、二叉树形状、凸多边形三角剖分等；反射法是把越界路径与自由路径建立对应从而扣除非法情形的标准技巧"],
        formulas: ["C_n = C(2n, n)/(n + 1) = C(2n, n) - C(2n, n - 1)，C_0 = 1, C_1 = 1, C_2 = 2, C_3 = 5, C_4 = 14, C_5 = 42", "递推：C_{n+1} = sum_{k=0}^{n} C_k C_{n-k}（卷积递推）；比值递推 C_{n+1} = C_n * 2(2n+1)/(n+2)", "生成函数：C(x) = sum_n C_n x^n 满足 C = 1 + x C^2，故 C(x) = (1 - sqrt(1 - 4x))/(2x)", "Ballot 数（推广）：从 (0,0) 到 (m, n) 且始终满足 x >= y 的路径数为 ((m - n + 1)/(m + 1)) C(m + n, n)", "循环移位法（Cycle lemma）：长为 m + n 的 ±1 序列中恰有 m - n 个循环移位使全部前缀和为正", "渐近：C_n ~ 4^n / (n^{3/2} sqrt(pi))"],
        theorems: ["反射法的正确性依赖“首次越界时刻”的存在与唯一：把首次触及 y = x + 1 之后的路段关于该直线反射，得到越界路径与从反射起点出发的全体路径之间的双射，因此非法路径数恰为 C(2n, n-1)；若约束不是单条直线（如双侧带宽限制），一次反射不够，必须用 Lindström 型行列式或反射群的交错和", "卷积递推 C = 1 + x C^2 来自“按第一个匹配右括号切分”的唯一分解，故凡具有“根 + 左右两个独立子结构”的对象都满足 Catalan 递推；这给出判断一个计数序列是否为 Catalan 的结构判据", "生成函数取负号分支：C(x) = (1 - sqrt(1-4x))/(2x) 必须取使 C(0) = 1 的分支，取正号分支会给出在 0 处发散的错误解", "sqrt(1 - 4x) 在 x = 1/4 的平方根型奇点给出 n^{-3/2} 的次指数因子，故 Catalan 型序列的渐近必带 n^{-3/2}，与有理生成函数的纯指数型渐近本质不同", "Catalan 数满足 C_n = C(2n, n) - C(2n, n-1) 的差式形式，等价于 Ballot 问题的反射结果，也直接给出 (n+1) | C(2n, n) 的整除性"],
        generalRequirements: ["必须写清约束是“前缀和非负”还是“严格正”，二者相差一次平移", "使用反射法必须指明被反射的直线与首次越界时刻", "使用生成函数必须选定满足初值的分支"],
        forbiddenErrors: ["【索引偏移】把 C_n 与 C_{n+1} 混用，或把 2n 步路径写成 n 步", "【反射线错误】反射关于 y = x 而非 y = x + 1，导致扣除量偏差", "【双侧约束单次反射】对带宽限制问题只做一次反射就断言结果", "【分支取错】生成函数取 (1 + sqrt(1-4x))/(2x)", "【严格与非严格混用】把“不越过对角线”与“严格位于对角线下方”当作同一约束"],
        parameterConstraints: { stepBalance: "格路解释要求上升步与下降步数目相等（2n 步）。", reflectionLine: "反射直线取首次越界的位置 y = x + 1。", branchSelection: "生成函数分支须满足 C(0) = 1。", ballotCondition: "Ballot 公式要求 m >= n。" },
        closureChecks: ["确认对象与前缀约束的精确形式。", "选择反射法、循环移位法或生成函数其一并写出中间量。", "核对小 n 的值 1, 1, 2, 5, 14。", "若给渐近，写出 n^{-3/2} 因子。"],
        scenarioChecks: { ballotProblem: ["设为 ±1 序列前缀和约束", "用反射法扣除越界路径", "得到差式或 Ballot 公式"], treeShapeCounting: ["识别根与两个独立子结构", "写出卷积递推", "解出生成函数并提取系数"], bandConstrainedPath: ["识别为双侧约束", "改用反射群交错和或转移矩阵", "确认单次反射不足"] },
    },
    // 指数生成函数与标号结构的构造法。
    "counting-egf-labeled-structures": {
        definitions: ["指数生成函数把标号结构的计数序列编码为 A(x) = sum_n a_n x^n / n!；标号结构上的“不交并、乘积（标号重分配）、集合、轮换”四种构造分别对应 EGF 的加、乘、exp、log 运算，从而把结构方程直接翻译为函数方程"],
        formulas: ["EGF 定义：A(x) = sum_{n >= 0} a_n x^n / n!；乘积法则 (A B)(x) 的第 n 项系数为 sum_k C(n, k) a_k b_{n-k}", "集合构造：由连通块类 B 组成的无序集合类满足 A = exp(B(x))；至少一块则为 exp(B) - 1，恰 k 块为 B^k / k!", "轮换构造：由 B 组成轮换的 EGF 为 log(1/(1 - B))（B 为单点时给出排列的轮换分解）", "标准例：排列 1/(1-x)，轮换 log(1/(1-x))，集合划分 exp(e^x - 1)，对合 exp(x + x^2/2)，错排 e^{-x}/(1-x)", "Bell 数：sum_n B_n x^n / n! = exp(e^x - 1)；有标号连通图与全体图满足 exp(C(x)) = sum_n 2^{C(n,2)} x^n / n!", "指数公式（Exponential formula）：若结构由连通分支唯一分解，则整体 EGF 等于分支 EGF 的指数"],
        theorems: ["EGF 乘积对应标号集合的二分拆分：系数中出现的 C(n, k) 恰是把 n 个标号分给两部分的方式数，故 EGF 只适用于标号对象；对无标号对象必须用普通生成函数或 Pólya 型循环指标，两者不可互换", "指数公式成立的条件是“分支分解唯一且分支之间无相互约束”，故对连通性可定义且分支可独立取值的结构（图、排列、映射函数图）适用，对带全局约束（如度序列固定）的结构不适用", "轮换构造给出 log 而非 1/(1-B) 是因为轮换在旋转下等同，需除以块长；这解释了排列按轮换分解得到 exp(log(1/(1-x))) = 1/(1-x) 的自洽性", "EGF 的乘法逆与复合都在形式幂级数环内合法，只要常数项条件满足（求逆需 a_0 ≠ 0，复合 A(B(x)) 需 B(0) = 0），否则运算无意义", "从 EGF 提取渐近不能直接用奇点分析的标准转移定理，因为 n! 因子必须先剥离；含 e^{f(x)} 型 EGF 常需鞍点法而非奇点分析"],
        generalRequirements: ["必须先确认对象是标号的，才可使用 EGF", "使用集合或轮换构造必须验证分支分解的唯一性", "作复合或求逆必须检查常数项条件"],
        forbiddenErrors: ["【标号性混淆】对无标号对象使用 EGF，或对标号对象用普通生成函数的乘积法则", "【二项卷积漏系数】EGF 相乘时按 sum a_k b_{n-k} 计算，漏掉 C(n, k)", "【指数公式滥用】对分支间存在约束的结构直接取 exp", "【常数项违规】对 B(0) ≠ 0 的 B 作复合 A(B(x))", "【轮换重复计数】用 B^k 而非 B^k / k! 或 log 形式，导致同一无序集合被重复计数"],
        parameterConstraints: { labeledOnly: "EGF 仅适用于标号结构。", uniqueDecomposition: "指数公式要求分支分解唯一且独立。", compositionCondition: "复合 A(B(x)) 要求 B(0) = 0。", inverseCondition: "乘法求逆要求常数项非零。" },
        closureChecks: ["确认标号性并写出基本块类的 EGF。", "把结构方程翻译为加、乘、exp、log 组合。", "提取系数时补回 n! 因子。", "对小 n 与直接枚举结果对照。"],
        scenarioChecks: { setPartitionEgf: ["块为非空集合，EGF 为 e^x - 1", "整体取 exp 得 exp(e^x - 1)", "系数乘 n! 得 Bell 数"], connectedComponentCounting: ["写出全体结构的 EGF", "取 log 得连通结构 EGF", "确认分支独立性"], constrainedPermutation: ["把轮换长度约束写入 log 求和的项", "取 exp 得整体 EGF", "提取系数并乘 n!"] },
    },
    // 拉格朗日反演与树计数。
    "counting-lagrange-inversion": {
        definitions: ["拉格朗日反演给出由隐式方程 w = x phi(w) 定义的幂级数的系数显式表达，把“解方程再展开”换成“对 phi 的幂取系数”；它是树类与递归结构计数的主力工具"],
        formulas: ["标准形式：若 w = x phi(w) 且 phi(0) ≠ 0，则 [x^n] w = (1/n) [t^{n-1}] phi(t)^n（n >= 1）", "带函数形式：[x^n] H(w) = (1/n) [t^{n-1}] H'(t) phi(t)^n", "反函数形式：若 w = f^{-1}(x) 且 f(t) = t/phi(t)，则同一公式成立；等价写法 [x^n] w = (1/n) [t^{-1}] (t/f(t))^n / t^{...}（留数记号）", "Cayley 公式：n 个标号顶点的树有 n^{n-2} 棵，有根树有 n^{n-1} 棵；有根树 EGF 满足 T = x e^T", "Catalan 应用：C = 1 + x C^2 化为 w = x(1 + w)^2（w = C - 1）给出 [x^n] w = (1/n) C(2n, n-1)", "k 元树：w = x(1 + w)^k 给出 (1/n) C(kn, n-1)，即 Fuss-Catalan 数"],
        theorems: ["反演公式成立的充要条件是 phi(0) ≠ 0（等价地 f'(0) ≠ 0），此时 w 作为形式幂级数唯一存在且 w(0) = 0；若 f'(0) = 0 则反函数不是幂级数而含分数幂，公式失效", "Cayley 公式的反演证明：T = x e^T 对应 phi(t) = e^t，得 [x^n] T = (1/n)[t^{n-1}] e^{nt} = n^{n-1}/n!，乘 n! 得 n^{n-1} 棵有根树，除以 n 个根的选择得 n^{n-2} 棵无根树；这条链条同时说明为何有根与无根差一个因子 n", "拉格朗日反演与 Bürmann 形式、留数计算等价，本质是把系数提取写成围道积分并作变量替换；因此它对形式幂级数与解析函数两种设定都成立，但解析设定下需 |x| 小以保证反函数解析", "对多元隐式方程（多类型递归结构）需用多元 Lagrange-Good 反演，其中出现 Jacobi 行列式因子，单变量公式不能逐个变量套用", "反演给出的是精确系数而非渐近；渐近须另由 f 的临界点（phi(t) - t phi'(t) = 0 型条件）定位主奇点得到"],
        generalRequirements: ["必须把递归结构整理为 w = x phi(w) 的标准形并验证 phi(0) ≠ 0", "必须区分有根与无根、标号与无标号，并说明相应的因子", "使用带 H 的形式时必须写出 H' 而非 H"],
        forbiddenErrors: ["【标准形未化归】方程未整理为 w = x phi(w) 就套公式，例如漏掉平移 w = C - 1", "【退化条件忽略】在 phi(0) = 0（即 f'(0) = 0）时仍使用反演", "【1/n 因子遗漏】提取系数时漏掉 1/n 或写成 1/(n-1)", "【导数遗漏】用 H(t) phi(t)^n 而不是 H'(t) phi(t)^n", "【多元逐个套用】对多元隐式方程分别套单变量公式，忽略 Jacobi 因子"],
        parameterConstraints: { nonDegeneracy: "要求 phi(0) ≠ 0，等价于 f'(0) ≠ 0。", zeroConstantTerm: "解 w 须满足 w(0) = 0。", indexRange: "公式对 n >= 1 成立，n = 0 需单独讨论。", multivariateJacobian: "多元情形需引入 Jacobi 行列式因子。" },
        closureChecks: ["化为 w = x phi(w) 并检验非退化条件。", "按公式提取 [t^{n-1}] phi(t)^n 并保留 1/n。", "说明标号性与根的处理导致的额外因子。", "对小 n 与直接计数对照。"],
        scenarioChecks: { rootedTreeCounting: ["写出 T = x e^T", "反演得到 n^{n-1}/n!", "乘 n! 并按需除以 n 得无根树数"], planeTreeCounting: ["写出 w = x(1 + w)^k", "反演得 Fuss-Catalan 形式", "核对 k = 2 时退化为 Catalan"], implicitSeriesCoefficient: ["整理隐式方程为标准形", "选择带 H 的形式提取所需量", "确认导数与 1/n 因子齐全"] },
    },
    // Burnside 引理与 Pólya 计数定理。
    "counting-burnside-polya": {
        definitions: ["Burnside 引理把群作用下的轨道数写成群元不动点数的平均；Pólya 计数定理进一步用置换群的轮换指标多项式给出“着色在对称性下的等价类数”，是处理旋转翻转等对称计数的标准工具"],
        formulas: ["Burnside：轨道数 |X/G| = (1/|G|) sum_{g in G} |Fix(g)|", "轮换指标：Z_G(z_1, ..., z_n) = (1/|G|) sum_{g in G} prod_i z_i^{c_i(g)}，c_i(g) 为 g 的长度为 i 的轮换个数", "Pólya：用 m 种颜色着色的等价类数为 Z_G(m, m, ..., m)", "带权 Pólya：等价类的生成函数为 Z_G(sum_j w_j, sum_j w_j^2, ..., sum_j w_j^n)，可按颜色使用次数分类计数", "循环群实例：Z_{C_n} = (1/n) sum_{d | n} phi(n/d) z_d^{n/d}，故 n 珠项链 m 色数为 (1/n) sum_{d | n} phi(n/d) m^d", "二面体群 D_n 需另加 n 个反射项：n 奇时每个反射有 (n+1)/2 个轮换，n 偶时分为 n/2 个 z_2^{n/2} 与 n/2 个 z_1^2 z_2^{(n-2)/2}"],
        theorems: ["Burnside 引理是轨道-稳定子定理的求和形式，其证明是对集合 {(g, x) : g x = x} 双向计数；因此它要求 G 为有限群且作用在有限集上，对无限群或无限集必须另作紧性或测度假设", "轨道数不等于 |X|/|G|：只有当作用自由（所有稳定子平凡）时该商才正确，故凡存在对称配置（如全同色着色）都必须用不动点平均而不能除以群阶", "Pólya 定理的关键是“g 不动的着色恰是每个轮换内同色的着色”，故不动点数为 m^{c(g)}，c(g) 为轮换总数；这条对应也说明为何轮换结构而非群元本身决定计数", "带权形式把颜色替换为形式变量，因此可同时回答“恰用 k 个黑珠”的分类计数；这比先算总数再分解稳健，因为分类结果直接是多项式系数", "对同一几何对象，作用群的选取（只旋转 C_n 还是含翻转 D_n，或作用在顶点、边、面上）改变答案，必须先明确等价的定义再写群与轮换指标"],
        generalRequirements: ["必须写出所作用的群及其在具体元素集上的置换表示", "必须逐类计算群元的轮换结构而非只算恒等元", "使用带权形式必须说明变量替换 z_i -> sum_j w_j^i"],
        forbiddenErrors: ["【除以群阶】用 |X|/|G| 代替不动点平均", "【群选错】题目允许翻转却只用旋转群，或作用对象（顶点/边/面）搞错", "【轮换结构漏项】对反射或复合元素的轮换分解计算错误，尤其是 n 奇偶不同的情形", "【不动点误算】把 Fix(g) 当作 g 的不动点元素个数而非不动的着色个数", "【无限群直接套用】对无限群使用 Burnside 平均而无有限化处理"],
        parameterConstraints: { finiteGroupAction: "G 有限且作用在有限集上。", permutationRepresentation: "须固定 G 在被着色元素集上的置换表示。", colorCountNonneg: "颜色数 m 为正整数（带权时为形式变量）。", parityCases: "二面体群反射项需分 n 奇偶讨论。" },
        closureChecks: ["写出群与置换表示。", "按共轭类或元素类型列出轮换结构与不动点数。", "求平均并核对 m = 1 时结果为 1。", "必要时用带权形式给出分类计数。"],
        scenarioChecks: { necklaceCounting: ["取 C_n 或 D_n 视是否允许翻转", "用 phi 求和写出轮换指标", "代入颜色数得答案"], polyhedronFaceColoring: ["确定旋转群及其在面上的作用", "按轴类型分类计算轮换数", "求平均得等价类数"], weightedColorCount: ["把颜色替换为形式变量", "展开轮换指标多项式", "读取指定次数的系数"] },
    },
    // 鸽巢原理的加强形式与平均值论证。
    "counting-pigeonhole-strong-form": {
        definitions: ["鸽巢原理断言把 n 个对象放入 m 个类时必有一类至少含 ceil(n/m) 个；加强形式（平均值论证）把“存在超过平均者”作为一般判据，是从计数信息推出存在性结论的最基本手段"],
        formulas: ["基本形式：n 个对象放入 m 类，存在一类含至少 ceil(n/m) 个，也存在一类含至多 floor(n/m) 个", "推广形式：若 sum_i q_i - m + 1 个对象放入 m 类，则存在 i 使第 i 类含至少 q_i 个", "平均值形式：若 a_1 + ... + a_m = S，则存在 i 使 a_i >= S/m，也存在 j 使 a_j <= S/m", "概率形式：E[X] = mu 蕴含 P(X >= mu) > 0 且 P(X <= mu) > 0，故存在取值不小于（不大于）均值", "重复距离型应用：从 {1, ..., 2n} 中任取 n + 1 个数，必有两数互质且必有一数整除另一数", "Erdős-Ko 型上界应用：在边长为 1 的正方形中任取 5 点，必有两点距离不超过 sqrt2 / 2"],
        theorems: ["鸽巢原理的强形式给出的下界 ceil(n/m) 是可达的最优界（均匀分配时取等），故结论中不能把 ceil(n/m) 加强为更大值而不给出额外结构假设", "平均值论证只给出存在性而不给出构造：从“存在超过平均者”不能提取出具体的 i，故凡要求显式构造的问题必须另加算法或极值取法", "选择合适的“盒”是应用的全部难点：常用盒包括余数类、区间分割、几何网格、二进制前缀、单调子序列长度对；盒的构造必须验证覆盖全体对象且互不重叠（或说明重叠如何处理）", "推广形式 sum q_i - m + 1 的下界是紧的：取每类恰 q_i - 1 个给出反例，故不能把该阈值降低", "与 Ramsey 型结论的关系：鸽巢是 Ramsey 定理最简单的情形（对顶点着色），故当需要“单色结构”而非“同类元素”时应上升到 Ramsey 型论证而非反复用鸽巢"],
        generalRequirements: ["必须明确对象集与盒的定义并验证盒覆盖全体对象", "使用平均值论证必须写出总量与类数并说明取整方向", "结论只声明存在性，不得声明可构造性"],
        forbiddenErrors: ["【取整方向错误】把 ceil(n/m) 写成 floor(n/m) 或反用于上界结论", "【盒未覆盖】构造的盒未覆盖全部对象或相互重叠导致计数失效", "【存在变构造】由存在性直接断言可显式找到该对象", "【阈值加强】把推广形式的 sum q_i - m + 1 降低为 sum q_i - m 或更小", "【严格不等误用】写成存在 a_i > S/m（均匀情形不成立）"],
        parameterConstraints: { boxCover: "盒必须覆盖全体对象。", integerCeiling: "下界为 ceil(n/m)，上界为 floor(n/m)。", generalizedThreshold: "推广形式阈值为 sum q_i - m + 1，不可再降。", nonStrictInequality: "平均值结论为非严格不等式。" },
        closureChecks: ["定义盒并验证覆盖性。", "写出对象数与盒数并取正确方向的整。", "确认结论为存在性表述。", "给出取等的均匀分配以说明界紧。"],
        scenarioChecks: { residueClassBox: ["按模 m 余数分盒", "由对象数超过 m 得同余对", "从同余推出差被 m 整除"], geometricGridBox: ["把区域分为面积相等的小格", "由点数超过格数得同格两点", "用格的直径给出距离上界"], divisibilityChainBox: ["按最大奇因子分盒", "同盒两数成倍数关系", "确认盒数恰为 n"] },
    },
    // 格路计数与 Lindström-Gessel-Viennot 引理。
    "counting-lattice-path-lgv": {
        definitions: ["格路计数研究在整点格上按给定步集从起点走到终点的路径数；LGV 引理把“多条互不相交路径组”的带符号计数写成单路径计数矩阵的行列式，从而把不交约束转化为线性代数问题"],
        formulas: ["自由格路：从 (0,0) 到 (m, n) 只用右步与上步的路径数为 C(m + n, n)", "带障碍：绕过若干禁止点用容斥，禁止点按顺序排列时得到交错和 sum (-1)^{|S|} prod(分段路径数)", "LGV 引理：设起点 A_1, ..., A_k 与终点 B_1, ..., B_k，M_{ij} = 从 A_i 到 B_j 的路径数，则 det M = sum_{(P, sigma)} sign(sigma) prod 权重，求和取遍互不相交路径组", "可相容情形：若有向无环图与端点排列使任何不交路径组只能对应恒等置换，则 det M 直接等于不交路径组数", "Lindström 权重版：给边赋权时 M_{ij} 取路径权和，行列式给出不交路径组的权和", "应用：det[C(a_i + b_j, b_j)] 型行列式等于对应的平面拆分或半标准 Young 表计数"],
        theorems: ["LGV 的证明是对“存在相交”的路径组作交换尾段的对合：相交路径组按第一个交点交换后置换的符号反转，故这些项在行列式中成对相消，只剩不交项；因此引理的成立不依赖具体图，只需有向无环（保证交点概念良定）", "行列式等于不交路径组数（而非带符号和）的条件是端点“相容”（non-permutable）：即任何不交路径组必对应恒等置换；在平面格上取 A_i 与 B_j 单调错开排列即可保证，否则必须保留 sign(sigma)", "有向无环性是必要的：含有向环时同一对端点路径数可能无限，或交换尾段的对合不再是良定对合，引理失效", "LGV 与 Catalan 型反射法的关系：单条路径的一次反射是 k = 1 与 k = 2 的特例，故双侧或多条约束问题应直接用行列式而非叠加反射", "行列式形式使不交路径计数可用矩阵运算与恒等式（如 Dodgson 凝聚、Jacobi-Trudi）求值，这是把组合量与对称函数、平面拆分联系起来的桥梁"],
        generalRequirements: ["必须写出有向无环图（或格与步集）与端点的排列顺序", "使用行列式等于计数的结论必须验证端点相容性", "带权情形必须说明权是否可乘且路径权和有限"],
        forbiddenErrors: ["【相容性未验】未检查端点排列即断言 det M 等于不交路径组数而丢掉符号", "【有向环存在】在含环图上使用 LGV", "【交点定义含糊】把“共享顶点”与“交叉但不共点”混用，导致不交条件不明确", "【矩阵转置错位】把 M_{ij} 定义为 B_j 到 A_i 的路径数导致行列式符号或值出错", "【反射法叠加】对多条不交路径反复使用单路径反射法而不用行列式"],
        parameterConstraints: { acyclicity: "底图必须有向无环。", endpointCompatibility: "去掉符号需端点相容（不可置换）。", equalCardinality: "起点与终点个数相同为 k。", weightMultiplicativity: "带权版本要求路径权为边权之积且和有限。" },
        closureChecks: ["写出图、步集与端点顺序。", "构造路径数矩阵 M 并明确 ij 方向。", "验证相容性以决定是否保留符号。", "计算行列式并对小规模枚举校验。"],
        scenarioChecks: { nonIntersectingPaths: ["设定 k 组端点并构造 M", "验证端点单调错开", "取行列式得计数"], planePartitionCounting: ["把平面拆分编码为不交格路组", "写出二项式系数矩阵", "用行列式恒等式求值"], obstacleAvoidance: ["把禁止点转为路径分段", "用容斥交错和或 LGV 行列式", "核对无障碍时退化为 C(m+n, n)"] },
    },
    // 计数序列的奇点分析与系数渐近。
    "counting-singularity-analysis": {
        definitions: ["奇点分析把生成函数的解析性质翻译为系数渐近：离原点最近的奇点位置决定指数增长率，该奇点处的局部展开类型决定次指数因子；它是从精确计数过渡到规模估计的标准流程"],
        formulas: ["指数增长率：若 A(z) 的收敛半径为 rho，则 a_n = rho^{-n} theta(n)，其中 theta(n) 次指数（n 次方根趋于 1）", "基本尺度：[z^n] (1 - z)^{-alpha} ~ n^{alpha - 1} / Gamma(alpha)（alpha 不为零或负整数）", "转移定理：若 A(z) ~ c (1 - z/rho)^{-alpha} 且在 Delta 域内解析，则 a_n ~ c rho^{-n} n^{alpha - 1} / Gamma(alpha)", "极点情形：单极点给出纯指数 a_n ~ c rho^{-n}；m 阶极点给出 n^{m-1} rho^{-n}", "平方根奇点：alpha = -1/2 给出 n^{-3/2} rho^{-n}，是树类与 Catalan 类的标志", "大幂次鞍点：对 e^{f(z)} 型或 EGF，用鞍点法 a_n ≈ A(r) r^{-n} / sqrt(2 pi b(r))，r 由 r A'(r)/A(r) = n 定，b(r) 为二阶量"],
        theorems: ["Pringsheim 定理：系数非负的幂级数在其收敛半径的正实点处必有奇点，故对计数生成函数寻找主奇点只需沿正实轴搜索，这是奇点分析可自动化的根本原因", "转移定理要求函数在“去心扇形 Delta 域”内解析延拓（即除主奇点外在半径略大的区域解析），仅有渐近等价的局部展开不足以推出系数渐近；这是把局部行为直接搬到系数的最常见漏洞", "多个模最小奇点时各奇点贡献相加，可能出现周期性振荡（如生成函数只在 n 属于某同余类时非零），此时不存在单一渐近等价式，只有沿子序列的渐近", "隐式定义的函数（w = x phi(w)）主奇点由分支条件 phi(t) - t phi'(t) = 0 的解 tau 给出，rho = tau / phi(tau)，且局部为平方根型，故这类树函数系数普遍带 n^{-3/2}", "EGF 与 OGF 的渐近方法不同：OGF 用奇点分析，EGF 因 n! 因子常须鞍点法或 Hayman 可容许性判据，二者不可混用；整函数型 EGF 完全没有有限奇点，奇点分析不适用"],
        generalRequirements: ["必须先定位模最小奇点并确认其唯一性或列出全部同模奇点", "使用转移定理必须说明 Delta 域内的解析延拓", "必须区分 OGF 与 EGF 并选择相应方法"],
        forbiddenErrors: ["【局部展开直接搬运】仅有主奇点处的展开就断言系数渐近，未验证 Delta 域解析性", "【周期性忽略】存在多个同模奇点时给出单一渐近式，忽略子序列振荡", "【方法混用】对 EGF 直接用奇点分析转移定理而不处理 n! 因子", "【整函数误用】对无有限奇点的整函数寻找主奇点", "【常数丢失】只给出增长阶而漏掉 Gamma(alpha) 与前因子 c，导致数值估计偏差"],
        parameterConstraints: { dominantSingularity: "需定位模最小奇点及其个数。", deltaDomainAnalyticity: "转移定理要求 Delta 域内解析延拓。", exponentExclusion: "n^{alpha-1}/Gamma(alpha) 形式要求 alpha 非零或负整数。", saddleEquation: "鞍点法要求鞍点方程 r A'(r)/A(r) = n 有正实解。" },
        closureChecks: ["确定生成函数类型（OGF/EGF）。", "沿正实轴定位主奇点并检查同模奇点。", "识别奇点类型（极点/代数/对数）并套用相应尺度。", "写出含常数因子的完整渐近式并与数值计算对照。"],
        scenarioChecks: { rationalGeneratingFunction: ["分母求根定位最小模极点", "按极点阶给出 n^{m-1} rho^{-n}", "多个同模根时叠加并检查振荡"], algebraicTreeFunction: ["用分支条件定位 tau 与 rho", "确认平方根型奇点", "得到 n^{-3/2} rho^{-n}"], egfSaddlePoint: ["剥离 n! 因子", "解鞍点方程", "用鞍点公式给出含 sqrt 因子的渐近"] },
    },
};
