import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数-不等式”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ALGEBRA_INEQUALITY_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    "am-gm-inequality": {
        id: "am-gm-inequality", l2Key: "algebra-inequality", name: "均值不等式", kind: "theorem",
        aliases: ["均值不等式", "AM-GM", "算术几何均值不等式", "arithmetic geometric mean inequality"],
    },
    "cauchy-schwarz-inequality": {
        id: "cauchy-schwarz-inequality", l2Key: "algebra-inequality", name: "Cauchy-Schwarz 不等式", kind: "theorem",
        aliases: ["Cauchy-Schwarz不等式", "柯西不等式", "Cauchy inequality", "Cauchy Schwarz inequality"],
    },
    "holder-inequality": {
        id: "holder-inequality", l2Key: "algebra-inequality", name: "Hölder 不等式", kind: "theorem",
        aliases: ["Holder不等式", "Hölder不等式", "Holder inequality"],
    },
    "minkowski-inequality": {
        id: "minkowski-inequality", l2Key: "algebra-inequality", name: "Minkowski 不等式", kind: "theorem",
        aliases: ["Minkowski不等式", "闵可夫斯基不等式", "Minkowski inequality"],
    },
    "jensen-inequality": {
        id: "jensen-inequality", l2Key: "algebra-inequality", name: "Jensen 不等式", kind: "theorem",
        aliases: ["Jensen不等式", "琴生不等式", "凸函数不等式", "Jensen inequality"],
    },
    "rearrangement-inequality": {
        id: "rearrangement-inequality", l2Key: "algebra-inequality", name: "排序不等式", kind: "theorem",
        aliases: ["排序不等式", "rearrangement inequality"],
    },
    "chebyshev-sum-inequality": {
        id: "chebyshev-sum-inequality", l2Key: "algebra-inequality", name: "Chebyshev 求和不等式", kind: "theorem",
        aliases: ["Chebyshev求和不等式", "切比雪夫求和不等式", "Chebyshev sum inequality"],
    },
    "muirhead-inequality": {
        id: "muirhead-inequality", l2Key: "algebra-inequality", name: "Muirhead 不等式", kind: "theorem",
        aliases: ["Muirhead不等式", "Muirhead inequality", "主序不等式"],
    },
    "karamata-inequality": {
        id: "karamata-inequality", l2Key: "algebra-inequality", name: "Karamata 不等式", kind: "theorem",
        aliases: ["Karamata不等式", "Karamata inequality", "凸序不等式"],
    },
    "sos-inequality-method": {
        id: "sos-inequality-method", l2Key: "algebra-inequality", name: "平方和方法", kind: "algorithm",
        aliases: ["平方和方法", "SOS方法", "sum of squares method"],
    },
    "tangent-line-method": {
        id: "tangent-line-method", l2Key: "algebra-inequality", name: "切线法", kind: "algorithm",
        aliases: ["切线法", "切线不等式", "tangent line method"],
    },
    "fractional-inequality-sign-analysis": {
        id: "fractional-inequality-sign-analysis", l2Key: "algebra-inequality", name: "分式不等式符号分析", kind: "algorithm",
        aliases: ["分式不等式", "有理不等式", "rational inequality"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const ALGEBRA_INEQUALITY_L3_RULES: Record<string, MathV2L3Rules> = {
    // 均值不等式必须验证变量非负和等号条件，不能作为单步模板题使用。
    "am-gm-inequality": {
        definitions: ["均值不等式说明非负数的算术平均不小于几何平均；使用对象必须为非负实数。"],
        formulas: ["对 a_i>=0，有 (a_1+...+a_n)/n >= (a_1...a_n)^{1/n}；等号当且仅当 a_1=...=a_n。"],
        theorems: ["加权 AM-GM：若 w_i>0 且 sum w_i=1，则 sum w_i a_i >= product a_i^{w_i}，等号当所有正权对应的 a_i 相等。"],
        generalRequirements: ["必须验证参与 AM-GM 的量非负。", "必须说明等号条件是否与题设约束同时可达。"],
        forbiddenErrors: ["【正性遗漏】对可能为负的量直接使用 AM-GM。", "【等号不可达】给出最值但等号条件不满足约束。", "【权重遗漏】加权形式未验证权重为正且和为 1。"],
        parameterConstraints: { positivity: "所有参与几何平均的量必须非负；含根号或分式时还需核对定义域。", equality: "等号条件必须与原约束同时成立。" },
        closureChecks: ["核对非负性。", "应用 AM-GM 并保留放缩方向。", "验证等号条件并说明最值可达或不可达。"],
        scenarioChecks: { productConstraint: ["固定乘积求和最小值时，确认变量均为正且等号点满足乘积约束。"], sumConstraint: ["固定和求乘积最大值时，确认变量非负且等分点满足约束。"] },
    },
    // Cauchy-Schwarz 的等号条件来自向量线性相关或比例关系。
    "cauchy-schwarz-inequality": {
        definitions: ["Cauchy-Schwarz 不等式控制内积绝对值与范数乘积，代数竞赛中常以 Engel 形式、向量形式或求和形式出现。"],
        formulas: ["向量形式：(sum a_i b_i)^2 <= (sum a_i^2)(sum b_i^2)；Engel 形式：sum x_i^2/a_i >= (sum x_i)^2/(sum a_i)，要求 a_i>0。"],
        theorems: ["等号成立当且仅当两个向量线性相关；Engel 形式中等号对应 x_i/a_i 相等。"],
        generalRequirements: ["必须确认分母正性或内积空间前提。", "必须写出等号条件并验证可达。"],
        forbiddenErrors: ["【分母正性遗漏】Engel 形式中 a_i 未验证为正。", "【方向错误】将 Cauchy 的下界形式误用于上界。", "【等号条件错误】把所有变量相等误写成必要条件，忽略比例关系。"],
        parameterConstraints: { denominator: "Engel 形式分母必须严格为正。", equality: "等号条件是比例关系或线性相关，不一定是变量全相等。" },
        closureChecks: ["选择合适形式。", "核对正性和维数。", "给出等号条件并代回原约束。"],
        scenarioChecks: { engelForm: ["使用 sum x_i^2/a_i 时逐项检查 a_i>0。"], vectorForm: ["向量化时确保内积和范数定义在同一实向量空间中。"] },
    },
    // Hölder 不等式需要共轭指数条件，不能与 Cauchy 或幂平均随意混用。
    "holder-inequality": {
        definitions: ["Hölder 不等式是 Cauchy-Schwarz 的多指数推广，适用于共轭指数下的乘积积分或求和估计。"],
        formulas: ["若 p_i>1 且 sum 1/p_i=1，则 sum_k product_i |a_{i,k}| <= product_i (sum_k |a_{i,k}|^{p_i})^{1/p_i}。"],
        theorems: ["三元常用形式：(sum a_i^3)(sum b_i^3)(sum c_i^3) >= (sum a_i b_i c_i)^3，对非负量直接适用。"],
        generalRequirements: ["必须说明指数 p_i 的取值和共轭条件。", "必须检查涉及幂次的非负性或绝对值处理。"],
        forbiddenErrors: ["【指数条件遗漏】未验证 sum 1/p_i=1。", "【非负性遗漏】去掉绝对值后未保证各项非负。", "【等号条件遗漏】最值题中使用 Hölder 后不检查比例等号条件。"],
        parameterConstraints: { exponents: "所有 Hölder 指数须大于 1 且倒数和为 1。", signs: "若省略绝对值，相关项必须非负。" },
        closureChecks: ["核对指数和符号条件。", "写出 Hölder 作用的数组。", "验证等号比例关系是否可达。"],
        scenarioChecks: { threeSequences: ["三列 Hölder 使用前确认每列项的幂次与目标表达式完全匹配。"] },
    },
    // Minkowski 是范数三角不等式，等号条件依赖向量同向比例。
    "minkowski-inequality": {
        definitions: ["Minkowski 不等式是 L^p 范数的三角不等式，求和形式用于根式和向量模长估计。"],
        formulas: ["对 p>=1，有 (sum |x_i+y_i|^p)^{1/p} <= (sum |x_i|^p)^{1/p}+(sum |y_i|^p)^{1/p}。"],
        theorems: ["p>1 时等号通常要求两个向量非负比例同向；p=1 时等号条件退化，需要单独处理符号。"],
        generalRequirements: ["必须确认 p>=1。", "必须区分上界形式和反向三角不等式。"],
        forbiddenErrors: ["【p范围错误】p<1 时直接使用 Minkowski。", "【根式拆分错误】把 sqrt(a+b) 无条件拆成 sqrt a + sqrt b 的等号。", "【等号误判】未验证向量同向比例关系。"],
        parameterConstraints: { exponent: "Minkowski 标准形式要求 p>=1。", equality: "等号条件依赖同向比例，p=1 需单独分析。" },
        closureChecks: ["核对 p 范数条件。", "识别向量分解。", "验证等号或最值可达性。"],
        scenarioChecks: { radicalSums: ["含平方根的和可转化为二维向量模长后使用 Minkowski。"] },
    },
    // Jensen 不等式要求函数凸/凹和权重条件，方向随凸凹性改变。
    "jensen-inequality": {
        definitions: ["Jensen 不等式刻画凸函数在加权平均处的函数值与函数值加权平均之间的关系。"],
        formulas: ["若 f 为凸函数、w_i>=0、sum w_i=1，则 f(sum w_i x_i) <= sum w_i f(x_i)；凹函数方向相反。"],
        theorems: ["严格凸函数的 Jensen 等号通常要求所有正权对应的 x_i 相等；凹函数结论方向反转。"],
        generalRequirements: ["必须证明或声明函数在目标区间上凸/凹。", "必须检查变量都位于同一凸区间内。"],
        forbiddenErrors: ["【凸凹方向颠倒】凹函数仍按凸函数方向使用。", "【区间遗漏】函数只在部分区间凸，却用于区间外变量。", "【权重遗漏】权重为负或和不为 1 时直接套 Jensen。"],
        parameterConstraints: { convexity: "函数必须在包含所有变量及其加权平均的区间上凸或凹。", weights: "权重必须非负且和为 1。" },
        closureChecks: ["验证凸/凹性。", "核对权重和变量区间。", "检查等号条件和约束可达性。"],
        scenarioChecks: { tangentSupport: ["若用切线法证明 Jensen 型估计，必须确认切线确为全局支撑线。"] },
    },
    // 排序不等式要求两个序列同序或反序，不能在未排序时使用。
    "rearrangement-inequality": {
        definitions: ["排序不等式比较两个实数序列在同序、反序和任意排列下乘积和的大小。"],
        formulas: ["若 a_1<=...<=a_n 且 b_1<=...<=b_n，则 sum a_i b_{n+1-i} <= sum a_i b_{sigma(i)} <= sum a_i b_i。"],
        theorems: ["等号条件依赖序列中是否有重复值及排列是否保持同序或反序。"],
        generalRequirements: ["必须先对两个序列排序。", "必须明确排列变量和目标乘积和。"],
        forbiddenErrors: ["【未排序误用】序列未排序时直接使用同序最大结论。", "【等号条件遗漏】存在重复值时未处理多种等号排列。", "【负数混淆】含负数时仍可排序使用，但不能按正数直觉跳过排序验证。"],
        parameterConstraints: { ordering: "两个序列必须给出同序或反序排列。", permutation: "目标和必须确实是一个排列乘积和。" },
        closureChecks: ["排序两个序列。", "识别目标排列位置。", "给出最大/最小或比较结论并处理等号。"],
        scenarioChecks: { extremalPermutation: ["求所有排列中的极值时，同序给最大、反序给最小。"] },
    },
    // Chebyshev 求和不等式需要同向单调或反向单调。
    "chebyshev-sum-inequality": {
        definitions: ["Chebyshev 求和不等式比较两个同向排序序列的平均乘积与平均值乘积。"],
        formulas: ["若 a_i、b_i 同向排序，则 (1/n)sum a_i b_i >= ((1/n)sum a_i)((1/n)sum b_i)；反向排序时不等号反向。"],
        theorems: ["该不等式可由排序不等式或协方差非负推出，等号通常与某一序列常数或特殊重复结构相关。"],
        generalRequirements: ["必须证明两个序列同向或反向排序。", "必须区分 Chebyshev 求和不等式与概率中的 Chebyshev 尾界。"],
        forbiddenErrors: ["【名称混淆】把求和不等式和概率尾界混用。", "【单调性遗漏】未验证同向单调。", "【方向错误】反向排序时仍使用同向方向。"],
        parameterConstraints: { monotonicity: "两个序列必须同向或反向单调。", normalization: "平均形式和求和形式的 n 倍因子必须一致。" },
        closureChecks: ["核对排序方向。", "代入求和形式。", "检查等号条件。"],
        scenarioChecks: { weightedVersion: ["加权形式需确认权重非负并规范化。"] },
    },
    // Muirhead 只适用于非负变量上的对称齐次和，主序条件必须逐项核对。
    "muirhead-inequality": {
        definitions: ["Muirhead 不等式比较非负变量上的对称齐次和，指数向量满足主序关系时可得到大小关系。"],
        formulas: ["若 alpha 主序 beta，则对非负变量有 [alpha] >= [beta]，其中 [alpha] 表示指数 alpha 的对称和。"],
        theorems: ["Muirhead 推广了 AM-GM 和许多对称齐次不等式；但它不适用于非齐次或非对称表达式的直接比较。"],
        generalRequirements: ["必须验证变量非负。", "必须把表达式化成对称齐次和并核对主序。"],
        forbiddenErrors: ["【非负性遗漏】对可负变量直接使用 Muirhead。", "【非齐次误用】表达式次数不同仍套主序。", "【主序方向错误】把 alpha 主序 beta 的方向写反。"],
        parameterConstraints: { positivity: "变量必须非负。", homogeneity: "比较对象必须为同次数对称齐次和。" },
        closureChecks: ["写出指数向量。", "验证主序关系。", "检查等号条件是否与约束一致。"],
        scenarioChecks: { symmetricHomogeneous: ["先将表达式对称化并统一次数，再判断是否可用 Muirhead。"] },
    },
    // Karamata 依赖主序和凸性，比 Jensen 多了向量主序前提。
    "karamata-inequality": {
        definitions: ["Karamata 不等式说明若向量 x 主序 y，且 f 为凸函数，则 sum f(x_i) >= sum f(y_i)。"],
        formulas: ["x 主序 y 要求排序后前 k 项和满足 sum_{i<=k} x_i >= sum_{i<=k} y_i（k<n），且总和相等；凸函数下得到 sum f(x_i) >= sum f(y_i)。"],
        theorems: ["Karamata 是 Jensen 的强化形式；凹函数方向反转。"],
        generalRequirements: ["必须验证两个向量总和相等。", "必须逐项核对主序条件和函数凸性。"],
        forbiddenErrors: ["【总和遗漏】前缀和满足但总和不等仍使用 Karamata。", "【排序遗漏】未先降序排列就比较前缀和。", "【凸凹方向错误】凹函数仍按凸函数方向使用。"],
        parameterConstraints: { majorization: "主序要求排序、前缀和和总和三项条件。", convexity: "函数必须在覆盖所有分量的区间上凸或凹。" },
        closureChecks: ["排序两个向量。", "核对前缀和与总和。", "应用凸/凹函数方向并验证等号。"],
        scenarioChecks: { smoothing: ["平滑变量法可通过逐步主序变化证明不等式，需保持总和不变。"] },
    },
    // 平方和方法要求给出真实的非负分解，而不是形式上声称显然平方和。
    "sos-inequality-method": {
        definitions: ["平方和方法把目标不等式等价转化为若干平方项的非负线性组合。"],
        formulas: ["典型目标：F(x)>=0，若 F=sum c_i Q_i(x)^2 且 c_i>=0，则结论成立。"],
        theorems: ["对称多项式不等式常可通过 u-v-w 方法或 SOS 分解处理；但不是所有非负多项式都是平方和。"],
        generalRequirements: ["必须给出完整平方和分解。", "必须验证每个系数非负。"],
        forbiddenErrors: ["【分解不等价】平方和展开后不等于原表达式。", "【系数符号遗漏】平方项前系数可能为负。", "【过度声称】把非负多项式无条件声称为平方和。"],
        parameterConstraints: { equivalence: "平方和分解展开后必须与目标表达式完全一致。", coefficients: "所有平方项系数必须非负。" },
        closureChecks: ["展开核对恒等式。", "检查平方项系数。", "写出等号条件。"],
        scenarioChecks: { polynomialInequality: ["多项式不等式可先齐次化或对称化，再尝试 SOS 分解。"] },
    },
    // 切线法通过凸函数的支撑线给出全局下界，或凹函数给出全局上界。
    "tangent-line-method": {
        definitions: ["切线法用凸函数图像位于切线之上（或凹函数位于切线之下）来构造不等式。"],
        formulas: ["若 f 凸且可导，则 f(x)>=f(a)+f'(a)(x-a)；若 f 凹，不等号方向相反。"],
        theorems: ["切点通常由等号条件或约束的对称点决定；多切线拼接时需证明每段支撑有效。"],
        generalRequirements: ["必须验证凸性或凹性。", "必须说明切点选择，并验证变量位于支撑线有效区间内。"],
        forbiddenErrors: ["【支撑方向错误】凸函数切线下支撑、凹函数切线上支撑方向混淆。", "【局部当全局】只在切点附近成立却当作全局不等式。", "【切点不可达】切点不满足原约束却用作等号点。"],
        parameterConstraints: { convexity: "切线支撑方向由凸/凹决定。", tangentPoint: "切点必须在函数定义域内并与等号条件匹配。" },
        closureChecks: ["验证凸/凹性。", "写出切线不等式。", "检查等号点是否满足约束。"],
        scenarioChecks: { multipleTangents: ["使用多条切线拼接时逐段验证覆盖区间和支撑方向。"] },
    },
    // 分式不等式不能随意同乘分母，必须通过符号表或分段讨论完成。
    "fractional-inequality-sign-analysis": {
        definitions: ["分式不等式含未知量在分母中；解集由零点、极点和各区间符号共同决定。"],
        formulas: ["将不等式化为 R(x)=P(x)/Q(x) >= 0 后，必须排除 Q(x)=0，并在 P、Q 的实零点划分的区间上判断符号。"],
        theorems: ["同乘分母只有在已知分母符号时保持等价；分母符号未知时必须分段或用符号表。"],
        generalRequirements: ["必须先列出定义域，排除所有分母为零的点。", "必须区分大于、小于、非严格不等式中的零点和极点归属。"],
        forbiddenErrors: ["【同乘未知符号】直接同乘含未知量分母而不分情况变号。", "【极点误入解集】把分母零点纳入非严格不等式解集。", "【重数遗漏】零点或极点重数影响符号是否翻转，不能忽略。"],
        parameterConstraints: { denominator: "分母零点必须排除。", multiplicity: "零点和极点重数决定符号变化，应纳入符号表。" },
        closureChecks: ["化为单个分式并因式分解。", "列出零点、极点和重数。", "制作符号表并按严格/非严格不等式筛选解集。"],
        scenarioChecks: { parametricInequality: ["含参分式不等式须处理零点重合、分母退化和区间端点顺序变化。"] },
    },
};
