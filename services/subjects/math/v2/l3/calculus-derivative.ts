import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“微积分-导数与微分”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const CALCULUS_DERIVATIVE_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 微分中值定理族与辅助函数构造。
    "mean-value-theorems-auxiliary-function": {
        id: "mean-value-theorems-auxiliary-function", l2Key: "calculus-derivative", name: "微分中值定理与辅助函数构造", kind: "theorem",
        aliases: ["Rolle定理", "Lagrange中值定理", "Cauchy中值定理", "辅助函数", "Darboux定理"],
    },
    // Taylor 公式及其余项形式。
    "taylor-theorem-remainders": {
        id: "taylor-theorem-remainders", l2Key: "calculus-derivative", name: "Taylor 公式与余项估计", kind: "theorem",
        aliases: ["Taylor公式", "Peano余项", "Lagrange余项", "积分余项", "Maclaurin展开"],
    },
    // 可微性与偏导存在、偏导连续之间的严格关系。
    "differentiability-vs-partials": {
        id: "differentiability-vs-partials", l2Key: "calculus-derivative", name: "可微性与偏导数的关系", kind: "criterion",
        aliases: ["全微分", "偏导存在", "偏导连续", "可微性判据", "C1函数"],
    },
    // 混合偏导可交换性（Clairaut-Schwarz）。
    "clairaut-mixed-partials": {
        id: "clairaut-mixed-partials", l2Key: "calculus-derivative", name: "混合偏导的可交换性", kind: "theorem",
        aliases: ["Clairaut定理", "Schwarz定理", "混合偏导", "二阶偏导交换", "对称性"],
    },
    // 隐函数定理与反函数定理。
    "implicit-inverse-function-theorem": {
        id: "implicit-inverse-function-theorem", l2Key: "calculus-derivative", name: "隐函数定理与反函数定理", kind: "theorem",
        aliases: ["隐函数定理", "反函数定理", "Jacobian非退化", "局部微分同胚", "隐函数求导"],
    },
    // Lagrange 乘数法与约束规范。
    "lagrange-multiplier-regularity": {
        id: "lagrange-multiplier-regularity", l2Key: "calculus-derivative", name: "Lagrange 乘数法与约束规范", kind: "criterion",
        aliases: ["Lagrange乘数法", "乘子", "约束极值", "约束规范", "KKT条件"],
    },
    // Hessian 二阶判别与退化情形。
    "hessian-second-order-criterion": {
        id: "hessian-second-order-criterion", l2Key: "calculus-derivative", name: "Hessian 二阶极值判别", kind: "criterion",
        aliases: ["Hessian矩阵", "二阶判别", "正定", "鞍点", "退化临界点"],
    },
    // 凸性的导数刻画。
    "convexity-derivative-characterization": {
        id: "convexity-derivative-characterization", l2Key: "calculus-derivative", name: "凸性的导数刻画", kind: "criterion",
        aliases: ["凸函数", "二阶导数非负", "切线在下方", "单调导数", "拐点判定"],
    },
    // Newton 迭代法的收敛阶。
    "newton-iteration-convergence-order": {
        id: "newton-iteration-convergence-order", l2Key: "calculus-derivative", name: "Newton 迭代法的收敛阶", kind: "algorithm",
        aliases: ["Newton迭代", "二阶收敛", "重根退化", "Newton-Kantorovich", "初值条件"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const CALCULUS_DERIVATIVE_L3_RULES: Record<string, MathV2L3Rules> = {
    // 中值定理族与辅助函数构造。
    "mean-value-theorems-auxiliary-function": {
        definitions: ["微分中值定理把区间上的整体差商与内部某点的导数值联系起来，其证明与应用的核心技术是构造满足 Rolle 定理条件的辅助函数。"],
        formulas: ["Rolle：f ∈ C[a,b]，在 (a,b) 可导，f(a) = f(b) ⇒ ∃ξ ∈ (a,b)，f'(ξ) = 0。", "Lagrange：f(b) - f(a) = f'(ξ)(b - a)。", "Cauchy：(f(b) - f(a))/(g(b) - g(a)) = f'(ξ)/g'(ξ)（g' 在 (a,b) 内不为零）。", "常用辅助函数：证 f'(ξ) + λf(ξ) = 0 取 F = e^{λx} f(x)；证 ξf'(ξ) = f(ξ) 取 F = f(x)/x；证含 f(b)-f(a) 的等式取 F = f(x) - [(f(b)-f(a))/(b-a)](x - a)。", "Darboux 定理：导函数取到两端导数值之间的一切值（即使导函数不连续）。"],
        theorems: ["三个条件（闭区间连续、开区间可导、端点相等）缺一即失效；端点处不要求可导，故 √(1-x^2) 于 [-1,1] 仍可用。", "中值点 ξ 只保证存在，一般不唯一也无法显式求出，故结论不得写成对某个指定点成立。", "Cauchy 中值定理是洛必达法则的证明基础；Taylor 公式的 Lagrange 余项由其反复应用（或 Cauchy 形式）得到。", "Darboux 定理说明导函数虽可不连续，却必具介值性质，故不存在导函数为跳跃函数的可导函数。"],
        generalRequirements: ["必须逐条验证连续性、可导性与端点条件，并区分闭区间与开区间。", "构造辅助函数时必须显式给出该函数并验证其满足 Rolle 条件。"],
        forbiddenErrors: ["【条件残缺】遗漏闭区间连续或 f(a) = f(b) 就用 Rolle 定理。", "【中值点指定】把 ξ 当作可显式确定或唯一的点。", "【Cauchy 定理分母为零】未验证 g'(x) ≠ 0（或 g(b) ≠ g(a)）。", "【端点可导性冗余要求】要求端点可导导致误判定理不适用。", "【辅助函数未验证】给出辅助函数但不检验端点值相等。"],
        parameterConstraints: { closedContinuity: "要求在 [a,b] 上连续。", openDifferentiability: "只要求在 (a,b) 内可导。", cauchyNonvanishing: "Cauchy 形式要求 g'(x) ≠ 0 于 (a,b)。" },
        closureChecks: ["逐条列出并验证定理的全部前提。", "写出辅助函数并验证其两端点函数值相等。", "把结论表述为存在性而非对指定点成立。"],
        scenarioChecks: { identityProof: ["把待证等式移项后设计辅助函数使其端点值相等。"], inequalityViaMVT: ["用 Lagrange 定理把差值转化为导数界的估计。"], derivativeIntermediateValue: ["用 Darboux 定理讨论导函数的取值范围。"] },
    },
    // Taylor 公式与余项。
    "taylor-theorem-remainders": {
        definitions: ["Taylor 公式用多项式局部逼近函数，余项形式决定结论的类型：Peano 余项给渐近信息，Lagrange 与积分余项给定量误差界。"],
        formulas: ["Taylor 多项式：P_n(x) = ∑_{k=0}^n f^{(k)}(a)(x-a)^k/k!。", "Peano 余项：f(x) = P_n(x) + o((x-a)^n)（只需 f^{(n)}(a) 存在）。", "Lagrange 余项：R_n = f^{(n+1)}(ξ)(x-a)^{n+1}/(n+1)!，ξ 介于 a 与 x 之间（需 f^{(n+1)} 于区间存在）。", "积分余项：R_n = (1/n!)∫_a^x f^{(n+1)}(t)(x-t)^n dt（需 f^{(n+1)} 连续）。", "多元二阶形式：f(a+h) = f(a) + ∇f(a)·h + (1/2) hᵀ H f(a+θh) h。"],
        theorems: ["Peano 余项只给出 x → a 的渐近行为，不能用于估计固定点处的误差；定量误差必须用 Lagrange 或积分余项。", "Taylor 级数收敛不等于收敛到原函数：f(x) = e^{-1/x^2}（f(0)=0）在 0 处所有导数为零，Taylor 级数恒为 0，说明光滑不推出解析。", "误差界由 M_{n+1} = sup |f^{(n+1)}| 给出：|R_n| ≤ M_{n+1}|x-a|^{n+1}/(n+1)!，这是数值逼近与不等式证明的标准工具。", "余项中的 ξ 依赖 x 且不可指定；把 ξ 当作固定点会破坏论证的严格性。"],
        generalRequirements: ["必须声明展开点、展开阶数与余项形式，并核对相应的光滑性假设。", "用于定量估计时必须给出 f^{(n+1)} 的界。"],
        forbiddenErrors: ["【Peano 余项作定量估计】用 o((x-a)^n) 给出具体误差数值。", "【ξ 指定或当常数】把 Lagrange 余项中的 ξ 取为端点或视为与 x 无关。", "【光滑性不足】使用 n+1 阶余项而只假设 n 阶可导。", "【级数与函数等同】由 Taylor 级数收敛断言等于原函数（漏验解析性）。", "【展开阶不足】用于未定式时阶数低于需要，导致主项抵消。"],
        parameterConstraints: { smoothnessOrder: "Peano 余项需 f^{(n)}(a) 存在；Lagrange 余项需 f^{(n+1)} 于区间存在。", xiLocation: "ξ 严格介于 a 与 x 之间且依赖 x。", boundedDerivative: "定量估计需 f^{(n+1)} 有界。" },
        closureChecks: ["写明展开点、阶数与余项类型。", "核对光滑性假设与余项类型匹配。", "定量估计时给出导数上界并写出误差不等式。"],
        scenarioChecks: { numericalErrorBound: ["用 Lagrange 余项反推达到给定精度所需阶数。"], inequalityProof: ["用余项符号（导数保号）证明单侧不等式。"], smoothNotAnalytic: ["用 e^{-1/x^2} 说明 Taylor 级数不必收敛到原函数。"] },
    },
    // 可微性与偏导数的关系。
    "differentiability-vs-partials": {
        definitions: ["多元函数在一点可微指存在线性主部使余项为 o(‖h‖)，它严格强于偏导数存在，又严格弱于偏导连续。"],
        formulas: ["可微定义：f(a+h) - f(a) = ∇f(a)·h + o(‖h‖)（h → 0）。", "全微分：df = ∑_i (∂f/∂x_i) dx_i。", "蕴含链：偏导连续（C¹）⇒ 可微 ⇒ 偏导存在且函数连续；反向均不成立。", "方向导数：可微 ⇒ D_v f(a) = ∇f(a)·v（对一切方向线性依赖）。", "标准反例：f = xy/√(x^2+y^2)（f(0,0)=0）两偏导存在、连续但不可微；f = x^2 y/(x^4+y^2) 一切方向导数存在但不连续。"],
        theorems: ["偏导存在不推出连续（f = xy/(x^2+y^2) 在原点偏导存在但不连续），故偏导存在是最弱的条件。", "方向导数对一切方向存在仍不足以保证可微，可微要求方向导数关于方向线性且余项一致为 o(‖h‖)。", "C¹ 是可微的充分不必要条件：存在可微但偏导不连续的函数（如 x^2 sin(1/x) 型构造）。", "链式法则、梯度的最速上升性质与切平面存在性都以可微为前提，仅有偏导时这些结论可能失效。"],
        generalRequirements: ["必须区分偏导存在、方向导数存在、可微与 C¹ 四个层级。", "断言可微必须验证余项为 o(‖h‖) 或引用偏导连续。"],
        forbiddenErrors: ["【偏导存在推可微】由两个偏导存在断言可微或存在切平面。", "【偏导存在推连续】由偏导存在断言函数连续。", "【方向导数推可微】由一切方向导数存在断言可微。", "【C¹ 当必要条件】认为可微必须偏导连续。", "【链式法则前提缺失】在只有偏导的情形使用多元链式法则。"],
        parameterConstraints: { remainderOrder: "余项须为 o(‖h‖) 而非 O(‖h‖)。", linearityInDirection: "可微要求方向导数关于方向线性。", sufficientCondition: "偏导在邻域内连续是可微的充分条件。" },
        closureChecks: ["明确所验证的层级并给出对应定义式。", "断言可微时写出余项极限的验证。", "使用链式法则或切平面前确认可微性成立。"],
        scenarioChecks: { counterexampleLayers: ["构造区分四个层级的例子并说明所属层级。"], tangentPlaneExistence: ["切平面存在需可微而非仅偏导存在。"], chainRuleApplication: ["复合求导前核对内外层的可微性。"] },
    },
    // 混合偏导可交换性。
    "clairaut-mixed-partials": {
        definitions: ["Clairaut-Schwarz 定理给出混合偏导可交换的充分条件：二阶混合偏导在该点邻域存在且连续时求导次序可换。"],
        formulas: ["结论：∂²f/∂x∂y = ∂²f/∂y∂x。", "充分条件（Schwarz）：f_{xy} 与 f_{yx} 在邻域内存在且在该点连续。", "更弱条件（Young）：f_x、f_y 在该点可微即可。", "反例：f = xy(x²-y²)/(x²+y²)（f(0,0)=0）在原点 f_{xy}(0,0) = -1 而 f_{yx}(0,0) = 1。", "推论：C^k 函数的所有阶数不超过 k 的混合偏导只依赖各变量的求导次数，故可写成多重指标形式。"],
        theorems: ["连续性条件不可省：上述反例的两个混合偏导在原点均存在但不连续，取值不同。", "C² 函数的 Hessian 矩阵对称，这是二阶判别使用实对称矩阵谱理论的前提。", "该对称性是微分形式理论中 d² = 0 与向量场旋度关系（保守场 ⇔ 旋度为零，单连通域上）的解析基础。", "高阶推广：C^k 下任意不超过 k 阶的混合偏导可任意换序，故可用多重指标 ∂^α 统一记号。"],
        generalRequirements: ["交换求导次序前必须声明并验证连续性（或 C² 假设）。", "对分段定义函数在拼接点处必须单独验证。"],
        forbiddenErrors: ["【无条件换序】不验证连续性直接交换混合偏导。", "【Hessian 对称性默认】在非 C² 情形使用对称 Hessian 的谱结论。", "【存在即连续】由混合偏导存在断言其连续。", "【反例适用性误判】认为反例函数不可导（它处处偏导存在，仅二阶混合偏导不连续）。"],
        parameterConstraints: { neighborhoodExistence: "混合偏导需在该点邻域内存在。", continuityAtPoint: "需在该点连续（或用 Young 条件：一阶偏导可微）。", classCk: "C^k 假设下不超过 k 阶均可换序。" },
        closureChecks: ["写明所用的充分条件（Schwarz 或 Young）。", "分段函数在分界点单独用定义计算两个混合偏导。", "使用 Hessian 对称性前确认 C² 成立。"],
        scenarioChecks: { hessianSymmetry: ["二阶判别前确认 Hessian 对称。"], conservativeField: ["单连通域上旋度为零与势函数存在的等价性依赖换序。"], pathologicalExample: ["在分界点用定义逐次求偏导以暴露不可换序。"] },
    },
    // 隐函数定理与反函数定理。
    "implicit-inverse-function-theorem": {
        definitions: ["隐函数定理与反函数定理由 Jacobian 的非退化性给出局部求解与局部可逆的充分条件，是把方程组局部化为函数图像的核心工具。"],
        formulas: ["隐函数定理：F ∈ C¹，F(a,b) = 0，det(∂F/∂y)(a,b) ≠ 0 ⇒ 存在唯一 C¹ 映射 y = φ(x) 于 a 的邻域使 F(x, φ(x)) = 0。", "导数公式：∂φ/∂x = -(∂F/∂y)^{-1}(∂F/∂x)。", "一元形式：dy/dx = -F_x/F_y（F_y ≠ 0）。", "反函数定理：f ∈ C¹，det Jf(a) ≠ 0 ⇒ f 在 a 的邻域上为 C¹ 微分同胚，且 J(f^{-1})(f(a)) = (Jf(a))^{-1}。", "秩定理：Jf 在邻域内秩恒为 r 时 f 局部等价于线性投影。"],
        theorems: ["结论严格是局部的：det Jf ≠ 0 处处成立也不能推出全局单射（如 f(x,y) = (e^x cos y, e^x sin y) 在 R² 上处处非退化但非单射）。", "Jacobian 退化时定理失效但结论不必失效（如 y³ = x 在原点可解出 y = x^{1/3}，只是不 C¹），故非退化是充分不必要条件。", "隐函数定理给出的 φ 的正则性与 F 相同：F ∈ C^k ⇒ φ ∈ C^k；F 解析 ⇒ φ 解析。", "该定理是流形的局部图册构造、正则值定理（Jacobian 满秩 ⇒ 水平集为子流形）与 Lagrange 乘数法约束规范的共同基础。"],
        generalRequirements: ["必须指明对哪组变量求解并验证对应的偏 Jacobian 非退化。", "结论必须限定在某个邻域内，并说明唯一性也是局部的。"],
        forbiddenErrors: ["【局部当全局】由处处非退化断言全局可逆或单射。", "【Jacobian 分块错位】对错误的变量分组计算 det(∂F/∂y)。", "【退化即无解】Jacobian 为零时断言隐函数不存在。", "【正则性夸大】只假设 C¹ 却断言隐函数光滑或解析。", "【求导公式漏负号或漏逆矩阵】写成 (∂F/∂y)(∂F/∂x) 或漏 -1 次幂。"],
        parameterConstraints: { c1Regularity: "F 或 f 至少 C¹（结论正则性与假设同阶）。", jacobianNonsingular: "对被求解变量的偏 Jacobian 行列式非零。", localScope: "存在性与唯一性均只在邻域内成立。" },
        closureChecks: ["写出变量分组与相应的 Jacobian 分块并计算行列式。", "把结论限定在邻域内并说明唯一性范围。", "用求导公式验证所得导数与原方程一致。"],
        scenarioChecks: { implicitDerivative: ["用 -F_x/F_y 求隐函数导数并核对 F_y ≠ 0。"], levelSetManifold: ["正则值处水平集为子流形并计算切空间。"], localInvertibility: ["用 Jacobian 判定局部微分同胚并给出反函数导数。"] },
    },
    // Lagrange 乘数法与约束规范。
    "lagrange-multiplier-regularity": {
        definitions: ["Lagrange 乘数法把约束极值的一阶必要条件写成目标梯度与约束梯度的线性相关关系，其有效性依赖约束梯度的线性无关性（约束规范）。"],
        formulas: ["等式约束：min f 使 g_i(x) = 0（i = 1..m），驻点条件 ∇f = ∑_i λ_i ∇g_i。", "Lagrange 函数：L(x, λ) = f(x) - ∑_i λ_i g_i(x)，条件为 ∇_x L = 0 且 g = 0。", "约束规范（LICQ）：{∇g_i(x*)} 线性无关。", "不等式约束（KKT）：∇f = ∑ λ_i ∇g_i + ∑ μ_j ∇h_j，μ_j ≥ 0，μ_j h_j = 0（互补松弛）。", "二阶条件：在切空间 T = {v : ∇g_i·v = 0} 上考察 ∇²_{xx} L 的正负定性。"],
        theorems: ["约束规范失效时乘子可能不存在：min x 使 x² = 0（或 g = x³）在原点 ∇g = 0，无 λ 满足 ∇f = λ∇g，故必须先验证 LICQ。", "乘数法只给必要条件：所得驻点需与边界点、不可导点及紧性论证结合才能确定全局最值。", "λ 的经济含义为影子价格：λ_i = ∂(最优值)/∂c_i（约束右端 g_i = c_i 的敏感性），这要求解在扰动下可微。", "二阶充分条件必须在约束切空间上（而非整个 R^n 上）判断 Hessian 的定性，直接用 ∇²f 会得出错误结论。"],
        generalRequirements: ["必须验证约束梯度线性无关，否则改用 Fritz John 条件或直接参数化。", "必须补充存在性论证（紧性）或逐个比较候选点。"],
        forbiddenErrors: ["【约束规范未验】在 ∇g 退化处仍套用乘数法。", "【必要当充分】把驻点直接判为极值点而不作比较或二阶判别。", "【边界与奇点遗漏】只考察内部驻点忽略约束集边界或不可导点。", "【KKT 符号错误】不等式约束乘子取负号或漏互补松弛条件。", "【全空间 Hessian】二阶判别未限制在切空间上。"],
        parameterConstraints: { licq: "要求 {∇g_i(x*)} 线性无关。", multiplierSign: "等式约束乘子符号任意；不等式约束（≤ 形式）乘子非负。", differentiability: "f 与 g 需在候选点处 C¹（二阶判别需 C²）。" },
        closureChecks: ["计算约束梯度并检验线性无关性。", "解出全部候选点并逐一比较目标值，含边界与奇点。", "如需判定极值类型，在切空间上作二阶判别。"],
        scenarioChecks: { geometricExtremum: ["曲面上最近点问题用乘子法并验证约束规范。"], inequalityConstraints: ["用 KKT 条件分区讨论活跃约束与互补松弛。"], sensitivityInterpretation: ["用乘子给出约束松紧对最优值的边际影响。"] },
    },
    // Hessian 二阶判别与退化情形。
    "hessian-second-order-criterion": {
        definitions: ["Hessian 矩阵是二阶偏导构成的对称矩阵，其在临界点处的定性给出局部极值的二阶充分条件，退化时判别失效需高阶分析。"],
        formulas: ["Hessian：H_{ij} = ∂²f/∂x_i∂x_j；C² 时对称。", "临界点：∇f(a) = 0。", "判别：H ≻ 0 ⇒ 严格局部极小；H ≺ 0 ⇒ 严格局部极大；H 有正有负特征值 ⇒ 鞍点；H 半定且退化 ⇒ 判别失效。", "二元情形：D = f_{xx} f_{yy} - f_{xy}²，D > 0 且 f_{xx} > 0 为极小，D > 0 且 f_{xx} < 0 为极大，D < 0 为鞍点，D = 0 需进一步判断。", "二阶 Taylor：f(a+h) = f(a) + (1/2) hᵀ H(a) h + o(‖h‖²)。"],
        theorems: ["半正定不足以推出极小：f = x² - y⁴ 在原点 H = diag(2, 0) 半正定却不是极小；f = x² + y⁴ 同样 H 退化但确为极小，故退化情形必须逐例分析。", "严格定性是充分不必要条件：f = x⁴ 在原点为严格极小但 H = 0。", "多元与一元判别的关键差异是鞍点的出现，故不能沿各坐标轴分别用一元判别代替 Hessian 判别（f = x² + y² - 3xy 沿两轴均极小但实为鞍点）。", "约束情形必须把 Hessian 限制到约束切空间（用投影或加边 Hessian 的顺序主子式），直接用 ∇²f 会误判。"],
        generalRequirements: ["必须先解出全部临界点并确认 C² 与 Hessian 对称。", "退化（det H = 0）时必须给出高阶展开或沿特定路径的分析。"],
        forbiddenErrors: ["【半定当定】由半正定断言极小。", "【退化仍判定】det H = 0 时仍给出极值结论。", "【逐轴判别】沿坐标轴分别用一元判别代替 Hessian。", "【局部与全局混淆】把局部极值当全局最值而不作紧性或比较论证。", "【约束情形未投影】约束极值直接用无约束 Hessian。"],
        parameterConstraints: { c2Regularity: "需 f ∈ C²（保证 Hessian 对称）。", criticalPointFirst: "判别只在 ∇f = 0 的点进行。", definitenessStrict: "结论需严格正定/负定；半定情形无结论。" },
        closureChecks: ["求全部临界点并在每点计算 Hessian 的特征值或主子式。", "对退化点用高阶项或沿路径检验。", "如需全局结论，补充紧性或边界比较。"],
        scenarioChecks: { saddleIdentification: ["特征值异号给出鞍点并写出上升下降方向。"], degenerateCritical: ["退化点用四次项或路径分析判断类型。"], constrainedSecondOrder: ["用加边 Hessian 在切空间上判别约束极值。"] },
    },
    // 凸性的导数刻画。
    "convexity-derivative-characterization": {
        definitions: ["凸函数可由零阶（弦在上方）、一阶（切线在下方、导数单调）与二阶（二阶导数非负）三种等价方式刻画，是不等式证明与优化理论的基础。"],
        formulas: ["零阶：f(λx + (1-λ)y) ≤ λf(x) + (1-λ)f(y)（λ ∈ [0,1]）。", "一阶：f(y) ≥ f(x) + f'(x)(y - x)（可导时等价于凸）；等价于 f' 单调递增。", "二阶：f'' ≥ 0 于区间 ⇔ 凸；f'' > 0 ⇒ 严格凸（充分不必要）。", "多元：Hessian 半正定 ⇔ 凸；f(y) ≥ f(x) + ∇f(x)·(y-x)。", "拐点：二阶导数变号处（f'' = 0 是必要条件而非充分条件，x⁴ 于 0 处 f'' = 0 但非拐点）。"],
        theorems: ["严格凸与 f'' > 0 不等价：x⁴ 严格凸但在 0 处二阶导数为零，故不能用 f''(x₀) = 0 否证严格凸。", "凸函数在开区间内自动连续且几乎处处可导，单侧导数处处存在且单调，故凸性可在不假设光滑性时使用。", "凸函数的局部极小即全局极小，且驻点集为凸集，这是凸优化中一阶条件充分性的来源。", "Jensen 不等式是凸性的积分形式：f(E[X]) ≤ E[f(X)]；与切线法、Karamata 等技术共同构成不等式证明的标准工具链。"],
        generalRequirements: ["必须声明凸性所在的区间（凸性是区间性质，不是点性质）。", "使用二阶判据必须确认二阶可导；否则改用一阶或零阶定义。"],
        forbiddenErrors: ["【二阶导为零否证严格凸】由 f''(x₀) = 0 断言非严格凸。", "【拐点判定错误】把 f'' = 0 的点直接判为拐点而不检验变号。", "【凸性局部化】在单点处谈凸性或把逐点二阶导数符号推广到未验证区间。", "【定义域非凸】在非凸（如断开）定义域上使用凸性不等式。", "【Jensen 方向反用】对凹函数用凸函数的不等号方向。"],
        parameterConstraints: { intervalConvexity: "凸性针对区间（或凸集）而非单点。", secondDerivativeSign: "f'' ≥ 0 对应凸，f'' ≤ 0 对应凹。", strictness: "f'' > 0 ⇒ 严格凸，反之不成立。" },
        closureChecks: ["确认定义域为区间或凸集。", "选择与光滑性假设匹配的刻画（零阶、一阶或二阶）。", "判定拐点时验证二阶导数在该点两侧变号。"],
        scenarioChecks: { inequalityViaConvexity: ["用切线法或 Jensen 不等式给出估计并声明凸区间。"], curveShapeAnalysis: ["用二阶导数符号划分凹凸区间并定位拐点。"], optimizationUse: ["凸问题中一阶条件即为全局最优的充分条件。"] },
    },
    // Newton 迭代法的收敛阶。
    "newton-iteration-convergence-order": {
        definitions: ["Newton 迭代用切线零点逐步逼近方程根，在单根附近具二阶收敛，但收敛性依赖初值与导数条件，重根处退化为线性收敛。"],
        formulas: ["迭代式：x_{k+1} = x_k - f(x_k)/f'(x_k)。", "误差递推：e_{k+1} = (f''(ξ)/(2 f'(x_k))) e_k²，故单根附近为二阶收敛。", "重根（重数 m ≥ 2）：收敛退化为线性，比率 1 - 1/m；修正迭代 x_{k+1} = x_k - m f(x_k)/f'(x_k) 恢复二阶。", "多元形式：x_{k+1} = x_k - (Jf(x_k))^{-1} f(x_k)。", "Newton-Kantorovich 条件：‖(Jf(x_0))^{-1}‖·‖f(x_0)‖·L ≤ 1/2（L 为 Jf 的 Lipschitz 常数）⇒ 收敛性与误差界可保证。"],
        theorems: ["二阶收敛只在单根（f'(x*) ≠ 0）且初值足够接近时成立，属局部收敛结论。", "初值不当会发散、振荡或收敛到别的根：f(x) = x³ - 2x + 2 从 x_0 = 0 起进入 0 → 1 → 0 的二周期循环。", "f'(x_k) → 0 时迭代数值不稳定，须切换到割线法、二分法混合策略或加阻尼（damped Newton）。", "Newton-Kantorovich 定理把局部收敛升级为可验证的定量判据，给出根的存在性、唯一区域与收敛半径。"],
        generalRequirements: ["必须声明初值条件与 f'(x*) ≠ 0，且指明收敛为局部性质。", "重根或导数接近零时必须说明处理策略。"],
        forbiddenErrors: ["【全局收敛断言】认为 Newton 法对任意初值收敛。", "【重根仍称二阶】在重根处断言二阶收敛而不作修正。", "【导数为零未处理】在 f'(x_k) 接近零时继续迭代不加保护。", "【收敛阶与迭代次数混淆】把二阶收敛理解为两步收敛。", "【多元情形漏 Jacobian 求逆】写成除以 Jacobian 或用其转置。"],
        parameterConstraints: { simpleRoot: "二阶收敛要求 f'(x*) ≠ 0。", initialGuess: "初值需落在收敛域内（可由 Kantorovich 条件量化）。", smoothness: "误差递推要求 f ∈ C²。" },
        closureChecks: ["核对根的重数并选择标准或修正迭代式。", "给出初值合理性依据（区间夹逼、单调性或 Kantorovich 条件）。", "写出误差递推并说明收敛阶与停机准则。"],
        scenarioChecks: { convergenceRateComparison: ["与二分法（线性）、割线法（超线性约 1.618 阶）对比收敛阶。"], multipleRootHandling: ["重根用修正迭代或对 f/f' 施加 Newton 法。"], globalizationStrategy: ["初值不佳时用二分预处理或阻尼步长保证全局收敛。"] },
    },



};
