import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“代数-代数方程”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const ALGEBRA_EQUATION_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    "linear-equation-system": {
        id: "linear-equation-system", l2Key: "algebra-equation", name: "线性方程组", kind: "object",
        aliases: ["线性方程组", "一次方程组", "linear system", "system of linear equations"],
    },
    "quadratic-discriminant": {
        id: "quadratic-discriminant", l2Key: "algebra-equation", name: "二次方程判别式", kind: "criterion",
        aliases: ["二次方程判别式", "二次判别式", "quadratic discriminant"],
    },
    "vieta-relations-equation": {
        id: "vieta-relations-equation", l2Key: "algebra-equation", name: "方程根与系数关系", kind: "formula",
        aliases: ["韦达定理", "根与系数关系", "Vieta relations", "Vieta formulas"],
    },
    "rational-equation": {
        id: "rational-equation", l2Key: "algebra-equation", name: "分式方程", kind: "object",
        aliases: ["分式方程","rational equation"],
    },
    "radical-equation": {
        id: "radical-equation", l2Key: "algebra-equation", name: "根式方程", kind: "object",
        aliases: ["根式方程","radical equation"],
    },
    "exponential-logarithmic-equation": {
        id: "exponential-logarithmic-equation", l2Key: "algebra-equation", name: "指数对数方程", kind: "object",
        aliases: ["指数方程", "对数方程", "指数对数方程", "exponential logarithmic equation"],
    },
    "trigonometric-equation": {
        id: "trigonometric-equation", l2Key: "algebra-equation", name: "三角方程", kind: "object",
        aliases: ["三角方程", "trigonometric equation"],
    },
    "parameter-quadratic-root-distribution": {
        id: "parameter-quadratic-root-distribution", l2Key: "algebra-equation", name: "含参二次方程根分布", kind: "criterion",
        aliases: ["含参二次方程", "parameter quadratic root distribution"],
    },
    "fixed-point-equation": {
        id: "fixed-point-equation", l2Key: "algebra-equation", name: "不动点方程", kind: "object",
        aliases: ["不动点方程", "fixed point equation", "f(x)=x"],
    },
    // Newton 恒等式把幂和与初等对称多项式联系起来，是方程根的幂次和计算的核心工具。
    "newton-identities": {
        id: "newton-identities", l2Key: "algebra-equation", name: "Newton 恒等式", kind: "theorem",
        aliases: ["Newton恒等式", "幂和与对称多项式关系", "Newton identities", "power sum symmetric polynomial"],
    },
    // Cauchy 函数方程研究满足加性、乘性等结构等式的函数，解的正则性高度依赖附加条件。
    "cauchy-functional-equation": {
        id: "cauchy-functional-equation", l2Key: "algebra-equation", name: "Cauchy 函数方程", kind: "object",
        aliases: ["Cauchy函数方程", "加性函数方程", "Cauchy functional equation", "f(x+y)=f(x)+f(y)"],
    },
    // 三次方程有一般代数求解公式（Cardano 公式），但须注意不可约情形（三实根时出现虚数中间步骤）。
    "cubic-equation": {
        id: "cubic-equation", l2Key: "algebra-equation", name: "三次方程", kind: "object",
        aliases: ["三次方程", "一元三次方程", "cubic equation", "Cardano公式", "Cardano formula"],
    },
    // 四次方程可通过引入辅助三次预解式降次求解，但一般五次及以上不可用根式求解。
    "quartic-equation": {
        id: "quartic-equation", l2Key: "algebra-equation", name: "四次方程", kind: "object",
        aliases: ["四次方程", "一元四次方程", "quartic equation"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const ALGEBRA_EQUATION_L3_RULES: Record<string, MathV2L3Rules> = {
    // 线性方程组的核心是用 Gauss 消元看清主元、矛盾和自由未知量。
    "linear-equation-system": {
        definitions: ["线性方程组可通过 Gauss 消元把方程逐步化为阶梯形；解的情况由消元后是否出现矛盾方程、每个未知量是否都有主元决定。"],
        formulas: ["消元基本步：用一个主元方程消去其他方程中的同一未知量；出现 0=c(c!=0) 时无解；没有矛盾且每个未知量都有主元时唯一解；没有矛盾但存在非主元未知量时有无穷多解。"],
        theorems: ["Gauss 消元过程中，交换两个方程、用非零常数倍乘一个方程、把一个方程加上另一个方程的倍数，均不改变原方程组的解集。"],
        generalRequirements: ["必须明确未知量个数、方程个数和系数所在域。", "必须区分无解、唯一解和无穷多解。", "必须说明消元顺序、主元选择和回代步骤。"],
        forbiddenErrors: ["【矛盾行遗漏】消元后出现 0=c(c!=0) 却继续回代。", "【主元误判】把主元可能为零的含参情形当作普通非零主元处理。", "【自由变量遗漏】有无穷多解时只给出一个特解。"],
        parameterConstraints: { field: "消元、除法和回代必须在指定基域上进行。", pivot: "含参方程组必须按主元为零或非零、方程是否变成矛盾式的参数值分支。" },
        closureChecks: ["检查消元后的每一行是否等价于原方程组。", "明确列出主元未知量和自由未知量，或说明无解。", "将最终结果代回原方程组验证。"],
        scenarioChecks: { parametricSystem: ["找出所有导致主元为零、方程退化或出现 0=c(c!=0) 的参数值。", "每个参数分支分别消元，判断是否有解以及自由未知量个数。"] },
    },
    // 二次判别式只能在确为二次方程时使用，含参时先处理退化。
    "quadratic-discriminant": {
        definitions: ["二次方程 ax^2+bx+c=0 的判别式为 Delta=b^2-4ac，前提是 a != 0。"],
        formulas: ["实系数二次方程中：Delta>0 有两个不等实根，Delta=0 有一个二重实根，Delta<0 无实根但有一对共轭复根。"],
        theorems: ["判别式由根差平方给出：Delta=a^2(r1-r2)^2；因此它控制实根个数和重根。"],
        generalRequirements: ["使用判别式前必须先确认二次项系数非零。", "含参问题必须把 a=0 的退化一次方程单独处理。"],
        forbiddenErrors: ["【退化遗漏】a 可能为零时仍直接套二次公式。", "【实复混淆】Delta<0 时声称无解而未说明是在实数范围。", "【重根遗漏】Delta=0 时把两个相同根误计为两个不同实根。"],
        parameterConstraints: { leadingCoefficient: "二次项系数必须非零。", domain: "必须说明根在实数域还是复数域中讨论。" },
        closureChecks: ["先分离 a=0 的退化分支。", "计算 Delta 并按符号分类。", "将求得根代回原方程。"],
        scenarioChecks: { realRootCount: ["明确根的计数方式：不同实根、重数计根或复根计数。"] },
    },
    // 根与系数关系是必要关系，反向使用时必须保证方程次数和首项系数不退化。
    "vieta-relations-equation": {
        definitions: ["Vieta 关系把多项式方程的根的初等对称和与系数联系起来，常用于二次方程的根和与根积。"],
        formulas: ["二次方程 ax^2+bx+c=0（a!=0）两根 r1,r2 满足 r1+r2=-b/a，r1 r2=c/a；高次情形对应初等对称多项式。"],
        theorems: ["在代数闭域中，n 次多项式按重数有 n 个根时，可由分解式推出全部 Vieta 关系。"],
        generalRequirements: ["必须明确是否按重数计根。", "用根构造方程时必须保留首项系数自由度或固定首一条件。"],
        forbiddenErrors: ["【首项系数遗漏】只由根写出方程却漏乘非零常数。", "【重数遗漏】重根未按重数进入根和根积。", "【范围混淆】实系数高次方程未说明复根也参与 Vieta 关系。"],
        parameterConstraints: { degree: "多项式次数必须固定且首项系数非零。", multiplicity: "根的列表必须说明是否包含重数。" },
        closureChecks: ["由原方程系数写出根的对称和。", "若反构方程，验证首项系数和次数。", "将候选根或参数代回原方程。"],
        scenarioChecks: { symmetricExpressions: ["将目标表达式化为根的初等对称和，再使用 Vieta 关系。"] },
    },
    // 分式方程去分母只产生必要条件，最终必须排除使原分母为零的增根。
    "rational-equation": {
        definitions: ["分式方程含有未知量所在分母；其原定义域要求每个分母都不为零。"],
        formulas: ["去分母前需列出 D(x)!=0；同乘公分母后得到的整式方程只给出候选解，候选解必须回代原分母和原方程。"],
        theorems: ["在原定义域内，同乘非零表达式是等价变形；若未限定表达式非零，则变形可能引入增根。"],
        generalRequirements: ["必须先写出定义域限制。", "所有候选解必须代回原方程或至少代回全部分母。"],
        forbiddenErrors: ["【定义域遗漏】未排除分母为零的点。", "【增根未检】去分母后直接把整式方程根作为答案。", "【参数分母遗漏】含参分母可能恒零或因参数改变零点时未分支。"],
        parameterConstraints: { denominator: "每个分母必须在原方程中非零。", parameter: "含参分式方程须处理公分母退化和参数导致的定义域变化。" },
        closureChecks: ["列出原定义域。", "求候选解。", "逐一回代原方程并剔除增根。"],
        scenarioChecks: { commonDenominator: ["使用最小公分母时确认没有遗漏任何因子。"] },
    },
    // 根式方程平方会扩大解集，必须同时核对被开方量和平方前两侧符号。
    "radical-equation": {
        definitions: ["根式方程含有未知量在根号内；偶次根式要求被开方量非负，且平方步骤通常只保持必要性。"],
        formulas: ["若 sqrt(A(x))=B(x)，则必须要求 A(x)>=0 且 B(x)>=0，再平方得到 A(x)=B(x)^2；反向成立仍需回代。"],
        theorems: ["在两侧均非负的前提下，平方是等价变形；若符号条件缺失，平方可能引入增根。"],
        generalRequirements: ["必须先列出根号定义域。", "每次平方后产生的候选解都必须回代原方程。"],
        forbiddenErrors: ["【符号遗漏】sqrt(A)=B 未要求 B>=0 就平方。", "【多次平方污染】多次平方后不逐层检验候选解。", "【定义域遗漏】偶次根被开方量未要求非负。"],
        parameterConstraints: { radicand: "偶次根被开方量必须非负。", sign: "平方前等式两侧的符号条件必须明确。" },
        closureChecks: ["列出被开方量与外侧符号条件。", "求平方后的候选解。", "回代原根式方程检验。"],
        scenarioChecks: { nestedRadicals: ["每消去一层根号后保留此前所有定义域和符号限制。"] },
    },
    // 指数对数方程的换元必须保留底数、真数和换元取值范围。
    "exponential-logarithmic-equation": {
        definitions: ["指数对数方程含指数函数或对数函数；对数必须满足底数 a>0、a!=1 且真数为正。"],
        formulas: ["常见换元如 t=a^x 时必须附加 t>0；log_a M=log_a N 等价于 M=N 仅在 a>0、a!=1、M>0、N>0 下成立。"],
        theorems: ["指数函数在合法底数下单调，因此可由单调性或换元将方程化为代数方程；对数函数同理但须保留定义域。"],
        generalRequirements: ["必须声明底数条件和真数正性。", "换元后必须把新变量范围传递到代数方程。"],
        forbiddenErrors: ["【真数遗漏】解出候选 x 后未检查所有对数真数为正。", "【换元范围遗漏】令 t=a^x 后允许 t<=0 的候选解。", "【底数退化】含参底数可能为 1 或非正时未分支。"],
        parameterConstraints: { base: "所有指数/对数底数必须满足所在函数的合法条件。", substitution: "换元变量必须带有来自指数、对数或根式的取值范围。" },
        closureChecks: ["列出定义域。", "完成换元或单调性化简。", "将候选解代回原方程并核对函数合法性。"],
        scenarioChecks: { parameterBase: ["底数含参时先处理 a<=0、a=1 和 a>0 且 a!=1 的分支。"] },
    },
    // 三角方程的解不是单个角，必须写出周期通解并处理定义区间。
    "trigonometric-equation": {
        definitions: ["三角方程的解集通常具有周期性；完整答案需给出通解或在指定区间内列出全部解。"],
        formulas: ["若 sin x=a，须要求 |a|<=1，并写出 x=(-1)^k arcsin(a)+k*pi；若 tan x=a，则 x=arctan(a)+k*pi。"],
        theorems: ["三角函数的周期性和对称性决定通解形式；限制区间问题需从通解筛选而非只取主值。"],
        generalRequirements: ["必须说明角度制还是弧度制。", "必须明确 k 属于整数并筛选指定区间。"],
        forbiddenErrors: ["【周期遗漏】只写主值解。", "【值域遗漏】sin x=a 或 cos x=a 未检查 |a|<=1。", "【区间筛选遗漏】给定区间内漏解或多列区间外解。"],
        parameterConstraints: { period: "通解必须匹配三角函数周期。", interval: "若题设给出区间，必须从通解筛选所有合法解。" },
        closureChecks: ["确定基本三角函数值域。", "写出完整周期通解。", "代回并按区间筛选。"],
        scenarioChecks: { auxiliaryAngle: ["使用辅助角公式前必须验证振幅 R=sqrt(a^2+b^2) 非零，并将等式右侧除以 R 后检查绝对值不超过 1。"] },
    },
    // 含参二次根分布需要判别式、端点值、对称轴和退化分支共同闭合。
    "parameter-quadratic-root-distribution": {
        definitions: ["含参二次方程根分布研究 ax^2+bx+c=0 的实根个数、重数及其落入指定区间的条件，参数会改变次数、判别式和顶点位置。"],
        formulas: ["区间根分布通常联合使用 Delta、f(端点)、对称轴 -b/(2a)、开闭端点和 a 的符号；没有单一模板适用于所有区间。"],
        theorems: ["二次函数图像与 x 轴交点的位置由开口方向、顶点、端点符号和判别式共同决定；含参时必须按退化和临界参数分支。"],
        generalRequirements: ["必须先处理 a=0 的退化分支。", "必须说明区间端点是否包含以及是否按重数计根。"],
        forbiddenErrors: ["【退化遗漏】a=0 时仍使用二次根分布判据。", "【端点误判】根在端点时未区分开区间和闭区间。", "【模板误套】仅凭端点异号判断两个根都在区间内。"],
        parameterConstraints: { leadingCoefficient: "二次项系数含参时必须单独处理为零的参数。", interval: "区间开闭、端点顺序和实根计数方式必须明确。" },
        closureChecks: ["列出退化、重根、端点根和顶点落点的临界参数。", "逐分支判断根的个数和位置。", "用代回或图像条件验证最终参数集合。"],
        scenarioChecks: { twoRootsInInterval: ["同时核对 Delta>0、对称轴在区间内以及端点符号/开口方向所需条件。"] },
    },
    // 不动点方程需要函数映射性质和存在唯一性前提，不能只解形式等式。
    "fixed-point-equation": {
        definitions: ["不动点方程通常为 f(x)=x，或函数迭代中的 f^n(x)=x；它研究映射的不动点、周期点及其稳定性。"],
        formulas: ["Banach 不动点原理：完备度量空间上压缩映射 T 满足 d(Tx,Ty)<=q d(x,y)、0<=q<1，则存在唯一不动点且迭代收敛。"],
        theorems: ["连续函数在区间上可用介值定理证明 f(x)=x 的存在性；唯一性通常需单调性、压缩性或导数界。"],
        generalRequirements: ["必须明确映射的定义域和值域，并验证 T(X) subset X。", "存在性和唯一性需要分别证明。"],
        forbiddenErrors: ["【自映射遗漏】未验证 f 把集合映到自身。", "【压缩条件不足】只证明连续就使用 Banach 不动点定理。", "【迭代误判】f^n(x)=x 的周期点不一定是 f(x)=x 的不动点。"],
        parameterConstraints: { domain: "映射必须在指定集合上有定义并映回该集合。", contraction: "压缩常数必须严格小于 1。" },
        closureChecks: ["验证自映射和完备性或区间闭性。", "分别证明存在和唯一。", "将候选不动点代回 f(x)=x 或迭代方程。"],
        scenarioChecks: { iteration: ["分析 f^n(x)=x 时区分真正周期点和低周期点。"] },
    },
    // Newton 恒等式递推连接幂和 p_k 与初等对称多项式 e_k，计算过程必须跟踪次数和递推起点。
    "newton-identities": {
        definitions: ["Newton 恒等式给出 n 个变量的幂和 p_k=sum x_i^k 与初等对称多项式 e_k 之间的递推关系。"],
        formulas: ["对 k<=n：p_k - e_1 p_{k-1} + e_2 p_{k-2} - ... + (-1)^{k-1} e_{k-1} p_1 + (-1)^k k e_k = 0；对 k>n：p_k - e_1 p_{k-1} + ... + (-1)^n e_n p_{k-n} = 0。"],
        theorems: ["由 Newton 恒等式可双向转化：已知方程系数（即 e_k）求根的幂和，或反之由幂和还原初等对称多项式。"],
        generalRequirements: ["必须明确变量个数 n 以确定递推截断点。", "必须区分 k<=n 和 k>n 的两段递推形式。"],
        forbiddenErrors: ["【截断遗漏】k>n 时仍使用含 e_{k} 的短递推而不截断到 e_n。", "【符号错误】递推式中 (-1)^k 的符号交替混淆。", "【幂和方向误判】把 p_k 用 e_k 表达和把 e_k 用 p_k 表达的方向混用。"],
        parameterConstraints: { variableCount: "变量个数 n 必须固定，以确定初等对称多项式的最高阶数。", powerSumRange: "幂和索引 k 必须为正整数；k=0 时 p_0=n 作为边界条件。" },
        closureChecks: ["确认 n 和初等对称多项式列表。", "按 k<=n 或 k>n 选择对应递推。", "逐步代入已知量计算目标幂和或对称多项式，并代回核对。"],
        scenarioChecks: { equationRoots: ["已知多项式系数时，先写出 Vieta 关系得到 e_k，再用 Newton 恒等式递推 p_k。"] },
    },
    // Cauchy 函数方程在无连续性或单调性等附加条件时存在病态解，不能无条件声称解为线性。
    "cauchy-functional-equation": {
        definitions: ["Cauchy 函数方程指满足加性等式 f(x+y)=f(x)+f(y) 的函数方程；扩展形式包括 f(xy)=f(x)f(y)、f(x+y)=f(x)+f(y)+f(x)f(y) 等。"],
        formulas: ["在有理数上：加性方程的解必为 f(x)=cx（c=f(1)）；在实数上，若无连续性、单调性或有界性等附加条件，存在不可测的病态解。"],
        theorems: ["若 f:R->R 满足 f(x+y)=f(x)+f(y) 且在某区间有界（或单调，或连续）则 f(x)=cx；无附加条件时病态解依赖选择公理存在。"],
        generalRequirements: ["必须明确函数的定义域（Q、R、正实数等）和附加正则性条件。", "必须区分 Q 上唯一线性解和 R 上需要附加条件的情形。"],
        forbiddenErrors: ["【附加条件遗漏】未声明连续性、单调性等就直接声称 f(x)=cx 是 R 上唯一解。", "【定义域混淆】把 Q 上的唯一性结论直接推广到 R 上。", "【方程类型混淆】把乘性方程 f(xy)=f(x)f(y) 的解混入加性方程讨论。"],
        parameterConstraints: { domain: "必须说明函数定义域；Q、R、(0,∞) 等不同情形解的唯一性不同。", regularity: "R 上唯一线性解需要连续性、单调性或在某区间有界中至少一个附加条件。" },
        closureChecks: ["明确函数定义域和正则性假设。", "在 Q 上验证线性性；在 R 上说明附加条件如何排除病态解。", "将候选解代回函数方程验证。"],
        scenarioChecks: { multipleVariables: ["多变量推广时须分别对每对变量验证加性，并注意对称性和齐次性条件。"], compositeEquation: ["形如 f(f(x))=cx 等复合形式须先分析不动点或特征根，再结合加性结构推导。"] },
    },
    // 三次方程 Cardano 公式在不可约情形（三个不同实根）中必须经过复数中间步骤，不能绕过。
    "cubic-equation": {
        definitions: ["一元三次方程 ax^3+bx^2+cx+d=0（a!=0）通过 Tschirnhaus 变换消去二次项后化为压缩形式 t^3+pt+q=0，再由 Cardano 公式求解。"],
        formulas: ["压缩形式 t^3+pt+q=0 的判别式 Delta=-4p^3-27q^2；Delta>0 三个不同实根，Delta=0 有重根，Delta<0 一实根两复根。Cardano 公式：t=cbrt(-q/2+sqrt(q^2/4+p^3/27))+cbrt(-q/2-sqrt(q^2/4+p^3/27))。"],
        theorems: ["在 Delta>0 的三实根情形下，Cardano 公式内的平方根为纯虚数，三个实根只能通过三角替换或复数运算得到，不能在实数运算中直接提取。"],
        generalRequirements: ["必须先确认 a!=0 并完成变量替换消去二次项。", "必须计算判别式并按 Delta 的符号分类讨论根的情况。", "给出所有三个根（含复根），不能只给出一个实根。"],
        forbiddenErrors: ["【不可约情形误判】Delta>0 时错误地声称 Cardano 公式失效或无法给出实根。", "【三次项退化遗漏】含参三次方程的三次项系数可能为零，退化为低次方程时不能套三次公式。", "【仅给一根】三次方程有三个根（含重数），只给出一个就声称完成。", "【变量替换遗漏】用 Cardano 公式求得 t 后忘记代回原变量替换 x=t-b/(3a)。", "【判别式符号约定混淆】部分教材定义 Delta=4p^3+27q^2（符号与本文件相反），引用公式前必须确认所用约定；本文件统一使用 Delta=-4p^3-27q^2，Delta>0 对应三实根。"],
        parameterConstraints: { leadingCoefficient: "三次项系数必须非零；含参时先处理退化分支。", discriminant: "判别式 Delta=-4p^3-27q^2 的符号决定根的类型，不能省略。" },
        closureChecks: ["核对三次项系数非零并完成变量替换。", "计算 Delta 并按符号分类。", "给出全部三个根并代回原方程验证。"],
        scenarioChecks: { irreducibleCase: ["Delta>0 时用三角替换 t=2sqrt(-p/3)cos(theta/3+2k*pi/3)（k=0,1,2）得到三个实根。"], parametricCubic: ["含参时先处理三次项为零、判别式临界值和重根参数。"] },
    },
    // 四次方程通过引入辅助三次预解式降次，最终可用根式表达；五次及以上一般不可根式求解。
    "quartic-equation": {
        definitions: ["一元四次方程 ax^4+bx^3+cx^2+dx+e=0（a!=0）可化为压缩形式，再通过 Ferrari 方法引入辅助三次预解式降次求解。"],
        formulas: ["Ferrari 方法核心步骤：把四次方程配方为两个平方之差，引入参数 y，令其行列式（辅助三次方程）为零，从而把四次方程分解为两个二次方程之积；最终解来自这两个二次方程。"],
        theorems: ["四次方程有根式解；从 Galois 理论看，这对应于四次方程的 Galois 群可解，因此可用根式表示全部根。"],
        generalRequirements: ["必须先确认 a!=0 并完成消去三次项的变量替换。", "辅助三次预解式必须完整求解，不能只取一个根就断定四次方程的解。", "最终给出全部四个根（含重数和复根）。"],
        forbiddenErrors: ["【四次项退化遗漏】含参四次方程的四次项系数可能为零，退化时不能套四次公式。", "【预解式不完整】辅助三次方程只取一个根而未检查哪个根使分解有效。", "【仅给部分根】四次方程有四个根（含重数），不能只给出实根就声称完成。", "【与五次混淆】不可与五次方程无根式解的结论混淆；四次方程仍有根式解。"],
        parameterConstraints: { leadingCoefficient: "四次项系数必须非零；含参时先处理退化分支。", resolventCubic: "辅助三次预解式的根必须使四次方程的分解有意义（判别式因子非零）。" },
        closureChecks: ["核对四次项系数非零并消去三次项。", "构造并求解辅助三次预解式。", "将四次方程分解为两个二次方程并分别求解。", "给出全部四个根并代回原方程验证。"],
        scenarioChecks: { depressedQuartic: ["压缩四次方程（无三次项）可更直接使用 Ferrari 方法，减少变量替换步骤。"], realRootsOnly: ["若只需实根，在求完四个根后筛选，不能在中间步骤就截断。"] },
    },
};
