import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数-多项式”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ALGEBRA_POLYNOMIAL_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    "polynomial-division-algorithm": {
        id: "polynomial-division-algorithm", l2Key: "algebra-polynomial", name: "多项式带余除法", kind: "theorem",
        aliases: ["多项式除法", "带余除法", "division algorithm", "polynomial division"],
    },
    "remainder-factor-theorem": {
        id: "remainder-factor-theorem", l2Key: "algebra-polynomial", name: "余式定理与因式定理", kind: "theorem",
        aliases: ["余式定理", "因式定理", "remainder theorem", "factor theorem"],
    },
    "polynomial-gcd-bezout": {
        id: "polynomial-gcd-bezout", l2Key: "algebra-polynomial", name: "Bezout 定理", kind: "theorem",
        aliases: ["裴蜀定理", "贝祖等式", "Bezout恒等式", "多项式Bezout定理", "polynomial Bezout theorem", "Bezout identity"],
    },
    "multiple-root-criterion": {
        id: "multiple-root-criterion", l2Key: "algebra-polynomial", name: "多项式重根判定", kind: "criterion",
        aliases: ["重根判定", "多项式重根", "multiple root", "repeated root"],
    },
    "rational-root-theorem": {
        id: "rational-root-theorem", l2Key: "algebra-polynomial", name: "有理根定理", kind: "theorem",
        aliases: ["有理根定理", "有理根判定", "rational root theorem"],
    },
    "gauss-lemma-polynomial": {
        id: "gauss-lemma-polynomial", l2Key: "algebra-polynomial", name: "Gauss 引理", kind: "lemma",
        aliases: ["Gauss引理", "高斯引理", "Gauss lemma"],
    },
    "eisenstein-criterion": {
        id: "eisenstein-criterion", l2Key: "algebra-polynomial", name: "Eisenstein 不可约判别法", kind: "criterion",
        aliases: ["Eisenstein判别法", "艾森斯坦判别法", "Eisenstein criterion"],
    },
    "interpolation-polynomial": {
        id: "interpolation-polynomial", l2Key: "algebra-polynomial", name: "插值多项式", kind: "formula",
        aliases: ["插值多项式", "Lagrange插值", "interpolation polynomial"],
    },
    "symmetric-polynomial": {
        id: "symmetric-polynomial", l2Key: "algebra-polynomial", name: "对称多项式", kind: "object",
        aliases: ["对称多项式", "初等对称多项式", "symmetric polynomial"],
    },
    "sturm-theorem": {
        id: "sturm-theorem", l2Key: "algebra-polynomial", name: "Sturm 定理", kind: "theorem",
        aliases: ["Sturm定理", "Sturm序列","Sturm theorem"],
    },
    // 结式通过 Sylvester 矩阵行列式消去变量，是判断公共根存在性的代数工具。
    "resultant-elimination": {
        id: "resultant-elimination", l2Key: "algebra-polynomial", name: "结式消元", kind: "algorithm",
        aliases: ["结式", "结式消元", "resultant", "resultant elimination", "Sylvester矩阵"],
    },
    // 多项式判别式是结式的特殊情形，刻画多项式有无重根。
    "polynomial-discriminant": {
        id: "polynomial-discriminant", l2Key: "algebra-polynomial", name: "多项式判别式", kind: "formula",
        aliases: ["多项式判别式", "多项式的判别式", "polynomial discriminant", "disc(f)"],
    },
    // 有限域上的不可约多项式是构造有限域扩张的基本工具，与素数次扩域的阶数密切相关。
    "irreducible-polynomial-finite-field": {
        id: "irreducible-polynomial-finite-field", l2Key: "algebra-polynomial", name: "有限域上的不可约多项式", kind: "object",
        aliases: ["有限域上不可约多项式", "F_q上的不可约多项式", "irreducible polynomial over finite field"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const ALGEBRA_POLYNOMIAL_L3_RULES: Record<string, MathV2L3Rules> = {
    // 带余除法依赖除式非零且余式次数低于除式次数。
    "polynomial-division-algorithm": {
        definitions: ["多项式带余除法研究如何把被除式表示成除式与余式之和，并要求余式次数低于除式次数。"],
        formulas: ["f(x)=q(x)g(x)+r(x)，其中 g != 0 且 deg r<deg g；当 g=x-a 时余式为常数。"],
        theorems: ["若 F 为域、f,g in F[x] 且 g != 0，则存在唯一 q,r in F[x] 使 f=qg+r 且 r=0 或 deg r<deg g。"],
        generalRequirements: ["必须说明基域或系数环。", "必须验证除式非零且余式次数严格小于除式次数。"],
        forbiddenErrors: ["【除式为零】未排除除式为零多项式。", "【余式次数错误】余式次数不低于除式仍声称除法完成。", "【系数环误用】在非域系数环上直接执行需要除法的算法。"],
        parameterConstraints: { divisor: "除式必须非零；含参除式须处理变为零多项式或降次的分支。", field: "标准带余除法应在域上进行。" },
        closureChecks: ["核对 f=qg+r 的恒等式。", "核对 r=0 或 deg r<deg g。", "确认商和余式所在系数域。"],
        scenarioChecks: { syntheticDivision: ["综合除法只适用于一次首一除式 x-a；其他除式不得机械套用。"] },
    },
    // 余式定理只直接适用于一次因式，高次除式时余式是低次多项式。
    "remainder-factor-theorem": {
        definitions: ["余式定理与因式定理研究一次线性因式 x-a 与多项式取值之间的对应关系。"],
        formulas: ["f(x)=(x-a)q(x)+f(a)；若 f(a)=0，则 f(x)=(x-a)q(x)。"],
        theorems: ["若 f(x) 除以 x-a，则余数为 f(a)；因此 f(a)=0 当且仅当 x-a 整除 f(x)。"],
        generalRequirements: ["必须确认除式是否为 x-a。", "使用因式定理时必须说明 a 所在域。"],
        forbiddenErrors: ["【高次除式误用】除以二次或更高次多项式时只代入一个点当余式。", "【基域遗漏】a 不在基域时不能说 x-a 是该域多项式环中的因式。", "【只验一根】多重因式 (x-a)^k 只验 f(a)=0 就声称整除。"],
        parameterConstraints: { divisorDegree: "余式为数值只在一次除式 x-a 情形成立。", field: "根和线性因式必须在指定域中解释。" },
        closureChecks: ["计算 f(a) 或实际带余除法。", "验证整除恒等式。", "若要求重因式，继续检查导数或高阶整除。"],
        scenarioChecks: { moduloQuadratic: ["除以二次多项式时设余式为 ux+v，并用恒等式或根条件确定 u,v。"] },
    },
    // Bezout 定理把多项式最大公因式表示为原多项式的线性组合，依赖所在基域。
    "polynomial-gcd-bezout": {
        definitions: ["Bezout 关系研究如何用两个多项式的线性组合描述它们的最大公因式。"],
        formulas: ["在域 F 上，存在 A(x),B(x) 使 A f + B g = gcd(f,g)；若 gcd(f,g)=1，则存在 Bezout 等式 A f+B g=1。"],
        theorems: ["若 F 为域、f,g in F[x]，则存在 A(x),B(x) in F[x] 使 A(x)f(x)+B(x)g(x)=gcd(f,g)；若 gcd(f,g)=1，则可取 A(x)f(x)+B(x)g(x)=1。"],
        generalRequirements: ["必须说明 gcd 的规范化方式，如首一。", "必须区分多项式互素与数值函数没有公共零点。"],
        forbiddenErrors: ["【常数倍唯一性遗漏】把 gcd 的非零常数倍误判为不同答案。", "【基域遗漏】不同基域下 gcd 或因式分解可能不同。", "【公共根混淆】在非代数闭域上无域内公共根不等价于 gcd=1。"],
        parameterConstraints: { normalization: "gcd 通常取首一代表。", field: "Euclidean 算法和 Bezout 等式必须在指定域上的多项式环中进行。" },
        closureChecks: ["用辗转相除求 gcd。", "验证 gcd 同时整除两个多项式且任意公因式都整除它。", "若给出 Bezout 系数，代回核对等式。"],
        scenarioChecks: { coprime: ["证明互素时可给出 Bezout 等式或证明没有共同不可约因子。"] },
    },
    // 重根必须用导数或高阶整除来判定，不能只看函数值为零。
    "multiple-root-criterion": {
        definitions: ["a 是 f 的 k 重根表示 (x-a)^k 整除 f 且 (x-a)^{k+1} 不整除 f。"],
        formulas: ["a 为重根当且仅当 f(a)=0 且 f'(a)=0；更高重数可用 f(a)=f'(a)=...=f^{(k-1)}(a)=0 且 f^{(k)}(a)!=0 判定（特征为零或适当前提下）。"],
        theorems: ["f 有重根当且仅当 gcd(f,f') 非常数；在正特征中还需注意 f' 可能为零多项式。"],
        generalRequirements: ["必须说明根所在域或代数闭包。", "必须区分至少重根和恰为 k 重根。"],
        forbiddenErrors: ["【只验函数值】只检查 f(a)=0 就声称重根。", "【高阶重数遗漏】f'=0 情形未在正特征中单独处理。", "【恰好/至少混淆】证明至少二重却写成恰二重。"],
        parameterConstraints: { characteristic: "使用导数判据时须注意基域特征。", multiplicity: "题目必须明确要求至少重数还是恰好重数。" },
        closureChecks: ["验证 f(a)=0。", "验证相应阶数导数或整除条件。", "确认下一阶不为零以得到恰好重数。"],
        scenarioChecks: { parameterRepeatedRoot: ["含参重根问题通常联立 f(a)=0 与 f'(a)=0，并回代排除首项退化。"] },
    },
    // 有理根定理给出候选集合，不保证候选都是根。
    "rational-root-theorem": {
        definitions: ["有理根定理用于筛选整系数多项式可能出现的有理根候选。"],
        formulas: ["若 gcd(p,q)=1 且 f(p/q)=0，则 p divides a_0，q divides a_n；首一整系数多项式的有理根只能是整数。"],
        theorems: ["若既约有理数 p/q 是整系数多项式 a_n x^n+...+a_0 的根，则 p|a_0 且 q|a_n。"],
        generalRequirements: ["必须确认多项式系数为整数或可整体化为整系数且不改变根。", "必须要求 p/q 既约。"],
        forbiddenErrors: ["【候选当根】把 p|a0、q|an 的候选直接当作根。", "【非整系数误用】分式或参数系数未化为整系数就使用定理。", "【首项退化遗漏】首项系数含参可能为零时仍用原 an。"],
        parameterConstraints: { coefficients: "需为整系数多项式或等价整体化后的整系数多项式。", reducedFraction: "候选有理根 p/q 必须既约。" },
        closureChecks: ["列出有限候选根。", "逐个代入或综合除法验证。", "找到根后继续因式分解或说明无有理根。"],
        scenarioChecks: { monicIntegerPolynomial: ["首一整系数多项式的有理根必须为整数，可先检查常数项因子。"] },
    },
    // Gauss 引理连接整数多项式和有理数域上的可约性。
    "gauss-lemma-polynomial": {
        definitions: ["Gauss 引理研究整数多项式在取内容、分解和不可约性之间的关系。"],
        formulas: ["若 f in Z[x] 为本原多项式，且 f=gh 在 Q[x] 中有非常数分解，则可调整常数使 g,h in Z[x] 且仍为非常数分解。"],
        theorems: ["本原整系数多项式在 Z[x] 中可约当且仅当在 Q[x] 中可约；等价地，本原多项式在 Z[x] 中不可约当且仅当在 Q[x] 中不可约。", "本原多项式乘积仍本原。"],
        generalRequirements: ["必须先提取内容 content(f)，确认本原部分。", "不可约性结论必须说明是在 Z[x] 还是 Q[x] 中。"],
        forbiddenErrors: ["【本原性遗漏】未确认多项式本原就直接使用 Gauss 引理。", "【基域混淆】把 Q[x] 不可约直接说成所有域上不可约。", "【常数因子误判】把整数内容因子当作非平凡多项式分解。"],
        parameterConstraints: { primitive: "使用 Gauss 引理前应确认本原性或先除去内容。", ring: "结论只连接 Z[x] 与 Q[x] 的可约性。" },
        closureChecks: ["计算内容并得到本原部分。", "在 Q[x] 或 Z[x] 中验证可约性。", "把结论翻译回原多项式时补回内容因子。"],
        scenarioChecks: { irreducibilityProof: ["先用 Gauss 引理降到本原多项式，再使用 Eisenstein、模素数约化或次数论证。"] },
    },
    // Eisenstein 判别法是充分条件，不满足条件并不表示可约。
    "eisenstein-criterion": {
        definitions: ["Eisenstein 判别法给出整系数多项式在 Q[x] 上不可约的充分条件。"],
        formulas: ["若存在素数 p 使 p 整除除首项外所有系数，p 不整除首项系数，且 p^2 不整除常数项，则多项式在 Q[x] 上不可约。"],
        theorems: ["对本原整系数多项式，Eisenstein 条件成立可推出在 Z[x] 和 Q[x] 中不可约。"],
        generalRequirements: ["必须明确选取的素数 p。", "必须逐项检查整除条件，尤其常数项不能被 p^2 整除。"],
        forbiddenErrors: ["【充分必要混淆】Eisenstein 条件不成立就断言多项式可约。", "【首项条件遗漏】p 整除首项系数时仍使用判别法。", "【常数项平方遗漏】未检查 p^2 不整除常数项。"],
        parameterConstraints: { prime: "p 必须是素数。", coefficients: "多项式应为整系数，通常先取本原部分。" },
        closureChecks: ["指定素数 p。", "检查首项、非首项和常数项的整除条件。", "引用 Gauss 引理说明 Q[x] 不可约。"],
        scenarioChecks: { shiftedEisenstein: ["若对 f(x+a) 使用 Eisenstein，必须说明平移不改变 Q[x] 上不可约性。"] },
    },
    // 插值多项式的唯一性依赖节点互异和次数上界。
    "interpolation-polynomial": {
        definitions: ["插值多项式是在给定节点 x_i 和函数值 y_i 上满足 P(x_i)=y_i 的多项式，常取次数小于节点数的唯一代表。"],
        formulas: ["Lagrange 插值：P(x)=sum_i y_i product_{j!=i}(x-x_j)/(x_i-x_j)，要求所有 x_i 两两不同。"],
        theorems: ["n 个互异节点决定唯一一个次数 < n 的插值多项式；唯一性由非零低次数多项式根数上界推出。"],
        generalRequirements: ["必须验证插值节点两两不同。", "必须写明次数上界。"],
        forbiddenErrors: ["【节点重复】节点相同但函数值不同仍声称存在插值多项式。", "【次数遗漏】不限制次数时插值多项式不唯一。", "【分母为零】Lagrange 基函数中 x_i-x_j=0 未排除。"],
        parameterConstraints: { nodes: "插值节点必须两两不同，除非使用 Hermite 插值并给出导数数据。", degree: "唯一性结论要求次数 < 节点数。" },
        closureChecks: ["验证节点互异。", "构造插值多项式并核对次数。", "代入每个节点验证取值。"],
        scenarioChecks: { hermiteInterpolation: ["若节点重复，应改用 Hermite 插值并加入导数匹配条件。"] },
    },
    // 对称多项式可由初等对称多项式表达，但表达所在环和次数必须明确。
    "symmetric-polynomial": {
        definitions: ["对称多项式是在变量任意置换下保持不变的多项式；初等对称多项式 e_k 是所有 k 个不同变量乘积之和。"],
        formulas: ["对称多项式基本定理：任意对称多项式都可唯一表示为初等对称多项式 e_1,...,e_n 的多项式。"],
        theorems: ["Vieta 关系把一元多项式根的初等对称多项式与系数联系起来，因此根的对称表达式可转化为系数表达式。"],
        generalRequirements: ["必须说明变量个数和基环/基域。", "将根的对称式转成系数时必须按重数计根。"],
        forbiddenErrors: ["【变量数遗漏】不同变量数下 e_k 的含义不同。", "【重数遗漏】根作为变量时未按重数列出。", "【唯一性范围遗漏】基本定理是在多项式环中成立，不是任意函数表达式。"],
        parameterConstraints: { variables: "变量个数必须固定。", ring: "表达式所在多项式环必须明确。" },
        closureChecks: ["验证表达式对任意置换不变。", "用初等对称多项式表达。", "若涉及根，代入 Vieta 关系并核对重数。"],
        scenarioChecks: { rootExpression: ["先判断目标是否为根的对称式，再转为系数表达式。"] },
    },
    // Sturm 定理用于实根计数，端点不能是多项式根且序列符号变化要按规则处理。
    "sturm-theorem": {
        definitions: ["Sturm 定理通过 Sturm 序列在区间端点的符号变化数差，计算实多项式在区间内的不同实根个数。"],
        formulas: ["若 V(a),V(b) 为 Sturm 序列在 a,b 处去零后的符号变化数，且 a,b 不是根，则 (a,b) 内不同实根数为 V(a)-V(b)。"],
        theorems: ["Sturm 序列由 f、f' 及带负号的欧几里得余式递推得到；它计数不同实根，不按重数计数。"],
        generalRequirements: ["必须确认多项式为实系数。", "必须处理端点为根和重根的情形。"],
        forbiddenErrors: ["【端点根遗漏】端点恰为根时直接套开区间公式。", "【零符号误算】计算符号变化时未去掉零项。", "【重数混淆】把 Sturm 计数当作按重数计根。"],
        parameterConstraints: { coefficients: "多项式应为实系数。", endpoints: "端点为根时须改用极限、开闭区间调整或单独计入。" },
        closureChecks: ["构造正确的 Sturm 序列。", "计算端点符号变化数并去零。", "解释计数是不同实根数并处理端点。"],
        scenarioChecks: { rootIsolation: ["隔离根时需逐区间计算变化数并确认每个区间恰有一个实根。"] },
    },
    // 结式给出公共根存在的必要充分条件，但要注意首项退化和消元变量所在域。
    "resultant-elimination": {
        definitions: ["结式用于消去两个一元多项式中的公共变量，并把公共根问题转化为一个单独的判定量。"],
        formulas: ["Res_x(f,g)=0 等价于 f、g 在代数闭包中有公共根；结式也可由 Sylvester 矩阵行列式计算。"],
        theorems: ["若两个一元多项式在被消去变量上没有降次退化，则它们的结式为零当且仅当二者在代数闭包中有公共根。"],
        generalRequirements: ["必须明确被消去变量和参数。", "必须处理首项系数为零导致的降次分支。"],
        forbiddenErrors: ["【降次遗漏】首项为零时仍使用固定次数的 Sylvester 矩阵结论。", "【域遗漏】结式为零说明代数闭包中有公共根，不自动说明实公共根。", "【回代遗漏】只解 Res=0 不回代确认公共根。"],
        parameterConstraints: { variable: "必须指定结式相对于哪个变量计算。", leadingCoefficient: "多项式次数随参数变化时须分支处理。" },
        closureChecks: ["计算或构造结式。", "处理降次和首项退化参数。", "对参数候选回代求公共根并确认所在域。"],
        scenarioChecks: { realCommonRoot: ["若要求实公共根，结式为零后还需验证公共根为实数。"] },
    },
    // 多项式判别式是 f 与 f' 结式的特殊情形，为零当且仅当 f 有重根。
    "polynomial-discriminant": {
        definitions: ["多项式 f 的判别式 disc(f) 定义为 (-1)^{n(n-1)/2}/a_n * Res(f,f')，其中 n=deg f，a_n 为首项系数；disc(f)=0 当且仅当 f 在代数闭包中有重根。"],
        formulas: ["二次多项式 ax^2+bx+c 的判别式为 b^2-4ac；三次压缩形式 t^3+pt+q 的判别式为 -4p^3-27q^2；这两个公式均由 Res(f,f') 导出。"],
        theorems: ["disc(f)=0 等价于 gcd(f,f') 非常数，即 f 与 f' 有公共根；disc(f)!=0 等价于 f 无重根（在代数闭包中所有根单重）。"],
        generalRequirements: ["必须明确首项系数和归一化约定，不同来源的判别式定义可能相差非零常数因子。", "必须区分判别式等于零（重根判据）与判别式的符号（实根分布，仅对实系数多项式有意义）。"],
        forbiddenErrors: ["【归一化混淆】不同来源定义相差常数倍时，直接比较判别式数值。", "【符号误用】对复系数多项式用判别式符号判断实根个数。", "【重根充分性误用】disc=0 只说明有重根，不直接给出重根的位置或重数。"],
        parameterConstraints: { normalization: "使用判别式公式前必须确认所用定义的归一化方式。", field: "判别式符号判断实根分布仅适用于实系数多项式。" },
        closureChecks: ["确认归一化约定并计算判别式。", "判断是否为零以确认有无重根。", "若需要实根信息，结合其他判据（Sturm 序列或图像）。"],
        scenarioChecks: { parametricDiscriminant: ["含参时解 disc=0 得到重根参数，再代回验证重根位置和重数。"] },
    },
    // 有限域上的不可约多项式计数和判定均有明确公式，是构造有限域扩张的关键。
    "irreducible-polynomial-finite-field": {
        definitions: ["F_q 上次数为 n 的不可约多项式是不能在 F_q[x] 中分解为两个正次数多项式乘积的 n 次多项式；它是构造 F_{q^n} 的生成元素的最小多项式。"],
        formulas: ["F_q 上次数恰好为 n 的首一不可约多项式个数为 (1/n) * sum_{d|n} mu(n/d) * q^d（Möbius 反转公式），其中 mu 为 Möbius 函数；特别地 n=1 时有 q 个，n=2 时有 q(q-1)/2 个。"],
        theorems: ["f in F_q[x] 次数为 n 不可约当且仅当 f 整除 x^{q^n}-x 但不整除任何 x^{q^d}-x（d|n，d<n）；这给出了有限域上不可约多项式的机械判定方法。"],
        generalRequirements: ["必须明确有限域 F_q 的阶 q=p^k（p 素数）和目标多项式的次数 n。", "必须区分不可约多项式与本原多项式（本原多项式额外要求生成乘法群）。"],
        forbiddenErrors: ["【无根误判】在 F_q 上无根就称不可约（仅对次数 2、3 成立；4 次以上不充分）。", "【域阶混淆】把 F_q 上次数 n 不可约多项式的根误认为在 F_q 中，而不在 F_{q^n} 中。", "【本原与不可约混淆】不可约不等于本原；本原多项式是更强的条件。"],
        parameterConstraints: { fieldOrder: "q 必须是素数幂；n 必须为正整数。", irreducibilityTest: "判定整除性时必须对所有真因子 d|n（d<n）逐一检验。" },
        closureChecks: ["确认 F_q 的特征和阶数。", "用整除 x^{q^n}-x 且不整除 x^{q^d}-x 的标准检验不可约性。", "若需要计数，代入 Möbius 公式并核对 n=1,2 的特殊情形。"],
        scenarioChecks: { primitivePolynomial: ["若要求本原多项式，在不可约基础上还需验证其根的乘法阶为 q^n-1。"], constructExtension: ["构造 F_{q^n} 时，选定一个 n 次不可约多项式 f，取 F_q[x]/(f) 作为 F_{q^n} 的代表。"] },
    },
};
