import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“泛函分析-算子理论”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const FUNCTIONAL_OPERATOR_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 有界算子的范数、代数结构与收敛层级。
    "operator-bounded-operator-norm-algebra": {
        id: "operator-bounded-operator-norm-algebra", l2Key: "functional-operator", name: "有界算子代数与范数估计", kind: "object",
        aliases: ["有界算子范数", "B(X)Banach代数", "次乘性", "强弱算子收敛"],
    },
    // 紧算子的刻画、理想性质与逼近性。
    "operator-compact-operator-criteria": {
        id: "operator-compact-operator-criteria", l2Key: "functional-operator", name: "紧算子判据与理想性质", kind: "criterion",
        aliases: ["紧算子", "全连续", "闭理想", "有限秩逼近"],
    },
    // Fredholm 二择一与指标的稳定性。
    "operator-fredholm-alternative-index": {
        id: "operator-fredholm-alternative-index", l2Key: "functional-operator", name: "Fredholm 二择一与指标", kind: "theorem",
        aliases: ["Fredholm二择一", "Fredholm指标", "紧扰动不变", "闭值域定理"],
    },
    // 无界算子的定义域、闭性与自伴刻画。
    "operator-unbounded-selfadjoint-domain": {
        id: "operator-unbounded-selfadjoint-domain", l2Key: "functional-operator", name: "无界算子的闭性与自伴性", kind: "criterion",
        aliases: ["稠定算子", "对称与自伴", "本质自伴", "亏指数"],
    },
    // 正规、自伴、酉算子的结构与关系。
    "operator-normal-selfadjoint-unitary": {
        id: "operator-normal-selfadjoint-unitary", l2Key: "functional-operator", name: "正规、自伴与酉算子", kind: "object",
        aliases: ["正规算子", "自伴算子", "酉算子", "数值域"],
    },
    // 投影、部分等距与极分解。
    "operator-projection-polar-decomposition": {
        id: "operator-projection-polar-decomposition", l2Key: "functional-operator", name: "正交投影与极分解", kind: "theorem",
        aliases: ["算子正交投影", "部分等距", "算子极分解", "绝对值算子"],
    },
    // 半群生成元与 Hille-Yosida 判据。
    "operator-semigroup-hille-yosida": {
        id: "operator-semigroup-hille-yosida", l2Key: "functional-operator", name: "C_0 半群与 Hille-Yosida 定理", kind: "theorem",
        aliases: ["C_0半群", "Hille-Yosida定理", "半群生成元", "resolvent估计"],
    },
    // 迹类与 Hilbert-Schmidt 算子的奇异值刻画。
    "operator-trace-class-hilbert-schmidt": {
        id: "operator-trace-class-hilbert-schmidt", l2Key: "functional-operator", name: "迹类与 Hilbert-Schmidt 算子", kind: "object",
        aliases: ["迹类算子", "Hilbert-Schmidt", "奇异值", "Schatten范数"],
    },
    // 算子的插值不等式与内插定理。
    "operator-interpolation-riesz-thorin": {
        id: "operator-interpolation-riesz-thorin", l2Key: "functional-operator", name: "Riesz-Thorin 与 Marcinkiewicz 插值", kind: "theorem",
        aliases: ["Riesz-Thorin插值", "Marcinkiewicz插值", "弱型估计", "凸性不等式"],
    },
    // 不变子空间与 Toeplitz/移位算子的模型。
    "operator-shift-invariant-subspace": {
        id: "operator-shift-invariant-subspace", l2Key: "functional-operator", name: "移位算子与不变子空间", kind: "object",
        aliases: ["单侧移位", "Beurling定理", "不变子空间问题", "Toeplitz算子"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const FUNCTIONAL_OPERATOR_L3_RULES: Record<string, MathV2L3Rules> = {
    // 有界算子代数：范数次乘性与三种收敛的层级。
    "operator-bounded-operator-norm-algebra": {
        definitions: ["算子范数 ||T|| = sup_{||x||<=1} ||Tx||", "B(X) 在算子范数下为 Banach 代数（X 完备时）", "一致（范数）收敛、强收敛（点态）、弱收敛（配对）三个层级"],
        formulas: ["次乘性：||ST|| <= ||S|| ||T||，||T^n|| <= ||T||^n", "Neumann 级数：||T|| < 1 => (I - T)^{-1} = sum_{n>=0} T^n，且 ||(I-T)^{-1}|| <= 1/(1 - ||T||)", "谱半径公式：r(T) = lim_n ||T^n||^{1/n} <= ||T||", "Hilbert 空间：||T^*T|| = ||T||^2（C^*-恒等式）"],
        theorems: ["B(X) 完备当且仅当 X 完备；可逆元集合开，求逆映射在其上连续", "一致收敛 => 强收敛 => 弱收敛，反向均不成立（移位算子给出强收敛非一致的例子）", "谱半径可严格小于范数（幂零或加权移位），故不能用范数代替谱半径", "乘法在算子范数下连续，但在强算子拓扑下仅在有界集上联合连续"],
        generalRequirements: ["写算子估计必须区分范数、强、弱三种收敛并声明所用层级", "使用 Neumann 级数必须验证 ||T|| < 1 或谱半径条件", "对无穷维必须避免用有限维矩阵直觉替代范数估计"],
        forbiddenErrors: ["【收敛层级混淆】由强收敛断言范数收敛", "【级数条件缺失】未验证 ||T|| < 1（或 r(T) < 1）就展开 (I-T)^{-1}", "【谱半径等范数】默认 r(T) = ||T||", "【乘法连续误设】在强算子拓扑下无界情形使用乘法连续性", "【完备性忽略】在不完备空间上使用 B(X) 的 Banach 代数性质"],
        parameterConstraints: { completenessRequirement: "B(X) 完备需 X 完备", neumannRadius: "Neumann 级数需 ||T|| < 1 或 r(T) < 1", spectralRadiusBound: "r(T) <= ||T||，可严格小于", topologyLevel: "范数 / 强 / 弱三层依次变弱" },
        closureChecks: ["确认所用收敛层级与结论匹配", "确认级数展开的收敛半径条件", "确认谱半径与范数区分", "确认极限算子有界性的独立依据"],
        scenarioChecks: { resolventExpansion: ["用 Neumann 级数展开解析式", "确认 |lambda| > ||T||"], iterativeSchemeConvergence: ["迭代收敛用谱半径判据", "确认非正规情形需额外估计"], strongVersusUniformExample: ["移位或乘法算子说明层级严格", "确认所举反例范数计算"] },
    },
    // 紧算子：判据、闭理想性与逼近性质。
    "operator-compact-operator-criteria": {
        definitions: ["紧算子：把有界集映为相对紧集，等价于把单位球映为相对紧集", "有限秩算子：值域有限维", "逼近性质：紧算子可由有限秩算子范数逼近"],
        formulas: ["判据：T 紧 <=> 任意有界序列 x_n 有子列使 T x_{n_k} 收敛", "理想性：S 有界、T 紧 => ST 与 TS 紧；紧算子集 K(X) 是 B(X) 的闭双边理想", "Hilbert 空间：T 紧 <=> T 为有限秩算子的范数极限 <=> 奇异值 s_n(T) -> 0", "紧 + 弱收敛：x_n 弱收敛 x => T x_n 范数收敛 Tx（紧算子把弱收敛变强收敛）"],
        theorems: ["无穷维空间恒等算子不紧，故紧算子不可逆；I + T（T 紧）可逆性由 Fredholm 理论给出", "Hilbert 空间中紧算子必是有限秩极限；一般 Banach 空间需逼近性质（Enflo 反例说明不总成立）", "紧算子的共轭仍紧（Schauder 定理）；紧算子的谱为可数集且只能以 0 为聚点", "积分算子（核平方可积）为 Hilbert-Schmidt 故紧；乘法算子紧当且仅当乘子在离散意义下趋零"],
        generalRequirements: ["证明紧性必须给出子列收敛、有限秩逼近或核条件之一", "使用紧算子把弱收敛升级为强收敛必须声明弱收敛来源", "在一般 Banach 空间中不得默认有限秩逼近可行"],
        forbiddenErrors: ["【逼近性质默认】在任意 Banach 空间断言紧算子为有限秩范数极限", "【可逆误设】断言紧算子有有界逆", "【谱结构误判】认为紧算子谱可有非零聚点", "【理想性越界】断言两个有界算子之积紧", "【核条件缺失】声称积分算子紧而不给核的可积或连续条件"],
        parameterConstraints: { spaceRequirement: "有限秩逼近刻画需 Hilbert 或有逼近性质", spectrumStructure: "非零谱点为孤立特征值，只能聚于 0", idealProperty: "K(X) 为闭双边理想", kernelCondition: "Hilbert-Schmidt 需核平方可积" },
        closureChecks: ["确认紧性判据具体化", "确认谱结构结论符合紧算子理论", "确认逼近论证的空间条件", "确认弱到强的升级依据"],
        scenarioChecks: { integralEquationSolvability: ["紧核算子用 Fredholm 理论求解", "确认核可积性"], spectralDecompositionOfCompact: ["自伴紧算子有特征展开", "确认特征值趋零"], embeddingCompactness: ["Sobolev 嵌入紧性用于变分法", "确认区域有界与指数条件"] },
    },
    // Fredholm 二择一与指标的紧扰动不变性。
    "operator-fredholm-alternative-index": {
        definitions: ["Fredholm 算子：ker T 有限维、im T 闭且余维数有限", "指标 ind T = dim ker T - codim im T", "Fredholm 二择一：I - T（T 紧）的可解性两分格局"],
        formulas: ["二择一：T 紧 => 或 (I - T)x = y 对任意 y 唯一可解，或齐次方程 (I - T)x = 0 有非零解且解空间与共轭齐次解空间同维", "维数关系：dim ker(I - T) = dim ker(I - T^*) < infinity", "指标性质：ind(ST) = ind S + ind T，ind(T + K) = ind T（K 紧）", "闭值域定理：im T 闭 <=> im T = (ker T^*)^perp"],
        theorems: ["Fredholm 二择一把无穷维线性方程的可解性还原为有限维交替，核心依赖紧性与值域闭性", "指标在算子范数下局部常值且对紧扰动不变，是同伦不变量（Atkinson 定理：T Fredholm <=> T 在 Calkin 代数中可逆）", "单侧移位 S 满足 ind S = -1，说明无穷维中 dim ker 与 codim im 不必相等", "自伴或正规情形下 ind = 0，故指标非零必伴随非正规性"],
        generalRequirements: ["使用二择一必须验证算子形如 I - 紧算子（或更一般 Fredholm）", "断言可解性必须同时给出共轭齐次方程的解空间维数", "使用指标不变性必须说明扰动为紧或连续同伦"],
        forbiddenErrors: ["【紧性缺失】对一般有界算子套用 Fredholm 二择一", "【维数不等忽略】认为 dim ker 与 codim im 自动相等", "【值域闭性跳步】未验证值域闭就使用正交补刻画", "【指标误算】对移位算子给出 ind = 0", "【扰动越界】用非紧的有界扰动断言指标不变"],
        parameterConstraints: { compactnessForAlternative: "二择一要求 T 紧", finitenessRequirement: "核维数与余维数均有限", indexAdditivity: "复合时指标相加", perturbationClass: "紧扰动或连续同伦下指标不变" },
        closureChecks: ["确认算子的 Fredholm 性验证", "确认二择一两支的完整表述", "确认指标计算与共轭算子核维数一致", "确认扰动属于允许类别"],
        scenarioChecks: { integralEquationAlternative: ["第二类 Fredholm 方程用二择一判定", "确认核紧性"], ellipticOperatorIndex: ["椭圆算子 Fredholm 性与指标计算", "确认边界条件"], toeplitzIndexComputation: ["Toeplitz 算子指标由符号绕数给出", "确认符号非零连续"] },
    },
    // 无界算子：闭性、稠定性与自伴判据。
    "operator-unbounded-selfadjoint-domain": {
        definitions: ["稠定算子 T: D(T) subset H -> H，D(T) 稠密", "对称：<Tx, y> = <x, Ty> 对 x, y in D(T)", "自伴：T = T^* 且 D(T) = D(T^*)", "本质自伴：闭包为自伴"],
        formulas: ["共轭定义域：D(T^*) = {y : 存在 z 使 <Tx, y> = <x, z> 对所有 x in D(T)}", "包含关系：对称 <=> T subset T^*；自伴 <=> T = T^*；本质自伴 <=> cl(T) = T^*", "亏指数 n_+ = dim ker(T^* - i)、n_- = dim ker(T^* + i)；自伴延拓存在 <=> n_+ = n_-", "基本判据（von Neumann）：T 对称闭且 im(T +- i) = H => T 自伴"],
        theorems: ["Hellinger-Toeplitz：处处定义的对称算子必有界，故真正的无界自伴算子必须限制定义域", "对称不等于自伴：定义域的选择改变算子（如 -d^2/dx^2 在 [0,1] 上的 Dirichlet 与 Neumann 延拓不同）", "自伴算子的谱实且非空；对称非自伴算子的谱可能覆盖整个复平面或半平面", "Friedrichs 延拓与二次形式方法给出半有界对称算子的自然自伴延拓"],
        generalRequirements: ["写无界算子必须显式给出定义域并验证稠密性", "断言自伴必须比较 D(T) 与 D(T^*) 而不仅验证对称等式", "讨论谱与函数演算前必须确立自伴性或正规性"],
        forbiddenErrors: ["【定义域缺失】给出无界算子而不写定义域", "【对称当自伴】由 <Tx,y> = <x,Ty> 直接断言自伴", "【谱结构误设】对非自伴对称算子断言谱实", "【延拓唯一性误设】认为对称算子的自伴延拓唯一（需本质自伴）", "【处处定义假设】把无界自伴算子当处处定义（违反 Hellinger-Toeplitz）"],
        parameterConstraints: { domainDensity: "D(T) 必须稠密以定义 T^*", symmetryVersusSelfadjointness: "自伴需定义域相等", deficiencyIndices: "自伴延拓存在需 n_+ = n_-", closedness: "自伴算子必闭" },
        closureChecks: ["确认定义域写明且稠密", "确认自伴性论证含定义域比较", "确认延拓的唯一性主张有亏指数依据", "确认谱结论建立在自伴性之后"],
        scenarioChecks: { schrodingerOperatorSelfadjointness: ["势函数条件下用 Kato-Rellich 判本质自伴", "确认定义域为 Sobolev 类"], boundaryConditionExtensions: ["区间上二阶算子的自伴延拓由边界条件参数化", "确认亏指数计算"], quadraticFormMethod: ["半有界形式给出 Friedrichs 延拓", "确认形式闭且下有界"] },
    },
    // 正规、自伴、酉算子的结构与数值域。
    "operator-normal-selfadjoint-unitary": {
        definitions: ["正规：T^*T = TT^*", "自伴：T = T^*", "酉：T^*T = TT^* = I", "数值域 W(T) = {<Tx, x> : ||x|| = 1}"],
        formulas: ["范数刻画：T 正规 => ||T|| = r(T)；自伴 => ||T|| = sup{|lambda| : lambda in sigma(T)}", "谱位置：自伴 => sigma(T) subset R；酉 => sigma(T) subset 单位圆；正定 => sigma(T) subset [0, infinity)", "数值域：Toeplitz-Hausdorff 定理给出 W(T) 凸；T 正规 => cl(W(T)) = conv(sigma(T))", "Cartesian 分解：T = A + iB，A = (T + T^*)/2、B = (T - T^*)/(2i) 均自伴；T 正规 <=> AB = BA"],
        theorems: ["正规算子有谱定理与连续函数演算，非正规算子一般没有（Jordan 型现象与不变子空间困难）", "自伴算子的谱非空且实，特征向量对不同特征值正交；正规算子谱可为任意闭集", "酉算子保内积，是 Hilbert 空间的等距同构；等距非满射（如单侧移位）不是酉算子", "正规算子满足 ||T|| = r(T)，故谱半径小于范数必意味非正规"],
        generalRequirements: ["使用谱定理或函数演算前必须确认正规性（或自伴性）", "区分等距与酉：需验证满射性", "从数值域推谱信息必须注意仅正规情形闭数值域等于谱凸包"],
        forbiddenErrors: ["【正规性缺失】对一般有界算子使用谱定理或函数演算", "【等距当酉】把单侧移位称为酉算子", "【谱位置误设】断言正规算子谱必实或必在圆上", "【范数谱半径混用】对非正规算子写 ||T|| = r(T)", "【数值域误推】由 W(T) 凸包直接反推非正规算子的谱"],
        parameterConstraints: { normalityCondition: "T^*T = TT^*", spectrumLocation: "自伴实、酉在单位圆、正定非负", surjectivityForUnitary: "酉需满射等距", numericalRangeConvexity: "W(T) 恒凸（Toeplitz-Hausdorff）" },
        closureChecks: ["确认正规性或自伴性已验证", "确认谱位置结论与算子类别匹配", "确认等距与酉的区分", "确认范数与谱半径关系的使用前提"],
        scenarioChecks: { spectralTheoremApplication: ["自伴算子用投影值测度分解", "确认稠定与闭性（无界情形）"], quantumObservableSetting: ["观测量为自伴算子，演化为酉群", "确认 Stone 定理条件"], nonnormalCounterexamples: ["幂零或加权移位说明正规性必要", "确认范数与谱半径差异"] },
    },
    // 正交投影与极分解。
    "operator-projection-polar-decomposition": {
        definitions: ["正交投影：P = P^* = P^2", "部分等距 V：V^*V 为投影，V 在 (ker V)^perp 上等距", "绝对值 |T| = (T^*T)^{1/2}"],
        formulas: ["极分解：任意 T in B(H) 可写 T = V |T|，V 部分等距，初始空间 cl(im |T|)、终止空间 cl(im T)，且唯一（要求 ker V = ker T）", "投影关系：P 投影 => H = im P oplus ker P，且 ||P|| = 1（P != 0）", "偏序：P <= Q <=> im P subset im Q <=> QP = P", "正算子平方根唯一：A >= 0 => 存在唯一 A^{1/2} >= 0"],
        theorems: ["极分解对无界稠定闭算子同样成立，但 V 的初终空间需重新界定", "唯一性只在附加 ker V = ker T 时成立，否则 V 可在核上任意等距延拓", "T 可逆 => V 酉；T 紧 => |T| 紧且奇异值即 |T| 的特征值", "斜投影范数可大于 1，因此非自伴幂等算子不是正交投影"],
        generalRequirements: ["使用极分解必须写明 V 的初始与终止空间以及唯一性附加条件", "写投影必须验证自伴与幂等两条", "取平方根必须先确认算子正定或半正定"],
        forbiddenErrors: ["【投影条件缺失】只验证幂等就称正交投影", "【极分解顺序错】写成 T = |T| V 而不说明这是另一分解（右极分解）", "【唯一性无条件】断言 V 无条件唯一", "【平方根滥用】对非正算子取正平方根", "【范数误设】断言任意幂等算子范数为 1"],
        parameterConstraints: { projectionConditions: "P = P^* = P^2", partialIsometryDomain: "V 在 (ker V)^perp 上等距", positivityForSqrt: "平方根要求 A >= 0", uniquenessCondition: "极分解唯一需 ker V = ker T" },
        closureChecks: ["确认投影两条件均验证", "确认极分解的初终空间与唯一性条件", "确认平方根的正性前提", "确认斜投影与正交投影未混用"],
        scenarioChecks: { singularValueDecomposition: ["紧算子由极分解与谱定理得奇异值展开", "确认 |T| 紧"], subspaceDecompositionProblems: ["用投影分解空间并计算范数", "确认子空间闭"], invertibilityFromPolarForm: ["T 可逆时 V 为酉", "确认 |T| 有界可逆"] },
    },
    // C_0 半群与 Hille-Yosida 生成元判据。
    "operator-semigroup-hille-yosida": {
        definitions: ["C_0 半群 {T(t)}_{t>=0}：T(0) = I、T(t+s) = T(t)T(s)、t -> T(t)x 强连续", "生成元 A x = lim_{t->0+} (T(t)x - x)/t，定义域为极限存在者", "resolvent R(lambda, A) = (lambda I - A)^{-1}"],
        formulas: ["增长估计：存在 M >= 1, omega 使 ||T(t)|| <= M e^{omega t}", "Hille-Yosida：A 稠定闭且对 lambda > omega 有 ||R(lambda, A)^n|| <= M/(lambda - omega)^n <=> A 生成 C_0 半群", "压缩半群（Lumer-Phillips）：A 稠定、耗散（Re <Ax, x> <= 0）且 im(I - A) = H => 生成压缩半群", "Stone 定理：酉群 <=> 生成元为 i 倍自伴算子；抽象 Cauchy 问题 u'(t) = A u(t), u(0) = x 的解 u(t) = T(t)x"],
        theorems: ["生成元恒稠定且闭，反之需 resolvent 幂估计而非单个估计（单个不等式不足）", "半群唯一确定生成元，生成元唯一确定半群；同一形式算子在不同定义域上给出不同半群", "解析半群（如热半群）具有额外光滑性与紧性；一般 C_0 半群只强连续，不必范数连续（范数连续 <=> A 有界）", "初值 x in D(A) 给出经典解，x 仅在 H 中只给出 mild solution"],
        generalRequirements: ["断言生成半群必须验证稠定、闭与 resolvent 幂估计（或耗散性 + 值域条件）", "解的正则性必须按初值是否在 D(A) 中区分", "写增长界必须给出 M 与 omega 并指出 M = 1 对应压缩"],
        forbiddenErrors: ["【单一估计不足】仅用一个 resolvent 界断言 Hille-Yosida 条件", "【连续性层级误设】断言 C_0 半群在算子范数下连续", "【定义域忽视】不写 D(A) 就断言生成元唯一", "【解正则性越界】对一般初值断言经典可微解", "【耗散判据缺项】用耗散性而不验证值域满条件"],
        parameterConstraints: { growthBound: "||T(t)|| <= M e^{omega t}，M = 1 时压缩", resolventPowerEstimate: "需对全部幂 n 成立", densityAndClosedness: "生成元稠定且闭", regularityOfInitialData: "经典解需 x in D(A)" },
        closureChecks: ["确认 Hille-Yosida 或 Lumer-Phillips 条件逐项验证", "确认定义域与闭性声明", "确认解的类型与初值正则性匹配", "确认范数连续性未被误加"],
        scenarioChecks: { heatEquationSemigroup: ["Laplace 算子生成解析压缩半群", "确认定义域为 H^2 类"], schrodingerUnitaryGroup: ["Stone 定理给出酉群", "确认自伴性"], nonlinearPerturbation: ["半线性问题用变分常数公式给 mild solution", "确认非线性项 Lipschitz"] },
    },
    // 迹类与 Hilbert-Schmidt：奇异值与 Schatten 范数。
    "operator-trace-class-hilbert-schmidt": {
        definitions: ["奇异值 s_n(T)：|T| 的特征值降序排列", "Schatten p 范数 ||T||_p = (sum_n s_n(T)^p)^{1/p}", "迹类 = S_1，Hilbert-Schmidt = S_2，迹 tr T = sum_n <T e_n, e_n>"],
        formulas: ["Hilbert-Schmidt 范数：||T||_2^2 = sum_{m,n} |<T e_n, e_m>|^2 = tr(T^*T)，核算子情形等于 double integral |K(x,y)|^2", "包含链：S_1 subset S_2 subset ... subset K(H)，且 ||T|| <= ||T||_2 <= ||T||_1", "迹的性质：tr(ST) = tr(TS)（S 有界、T 迹类），迹与正交基选取无关", "Hölder 型：||ST||_1 <= ||S||_2 ||T||_2；对偶：(S_1)^* = B(H)，(K(H))^* = S_1"],
        theorems: ["迹类算子的迹绝对收敛并等于特征值之和（Lidskii 定理，非自伴情形非平凡）", "Hilbert-Schmidt 算子恰为 L^2 核的积分算子（Hilbert-Schmidt 定理），故紧", "迹不能推广到一般有界算子：B(H) 上无有限迹（无穷维），故 tr I 不存在", "S_p 均为 B(H) 的双边理想，且在自身范数下完备"],
        generalRequirements: ["使用迹必须验证算子属于迹类而不仅是紧", "写核算子的范数必须给出核的可积性条件", "使用 tr(ST) = tr(TS) 必须至少一方为迹类"],
        forbiddenErrors: ["【迹类越界】对紧但非迹类算子计算迹（如 s_n = 1/n）", "【交换性滥用】对两个仅有界算子使用迹交换律", "【范数不等式方向错】写 ||T||_1 <= ||T||_2", "【单位算子取迹】在无穷维写 tr I = dim H 作为有限值", "【核条件缺失】声称积分算子 Hilbert-Schmidt 而不验证核平方可积"],
        parameterConstraints: { schattenExponent: "p >= 1，p = 1 迹类、p = 2 Hilbert-Schmidt", summabilityRequirement: "S_p 需 sum s_n^p < infinity", traceWellDefinedness: "迹需 S_1 成员", kernelIntegrability: "HS 核需 L^2 于乘积测度" },
        closureChecks: ["确认 Schatten 类归属已验证", "确认范数不等式方向正确", "确认迹交换律的迹类假设", "确认核条件与算子类别一致"],
        scenarioChecks: { integralOperatorNormEstimate: ["用核的 L^2 范数给出 HS 范数", "确认测度 sigma 有限"], densityMatrixSetting: ["量子态为正迹类且迹为 1", "确认迹类归属"], determinantAndZetaRegularization: ["Fredholm 行列式需迹类", "确认 sum s_n < infinity"] },
    },
    // Riesz-Thorin 与 Marcinkiewicz 插值。
    "operator-interpolation-riesz-thorin": {
        definitions: ["强 (p, q) 型：||Tf||_q <= M ||f||_p", "弱 (p, q) 型：|{|Tf| > lambda}| <= (M ||f||_p / lambda)^q", "次线性算子：|T(f+g)| <= |Tf| + |Tg|"],
        formulas: ["Riesz-Thorin：T 同时 (p_0, q_0) 与 (p_1, q_1) 有界（范数 M_0, M_1）=> 对 1/p = (1-t)/p_0 + t/p_1、1/q = (1-t)/q_0 + t/q_1 有 ||T||_{p,q} <= M_0^{1-t} M_1^t", "Marcinkiewicz：弱型 (p_0, p_0) 与 (p_1, p_1)（p_0 < p_1）=> 强型 (p, p) 对 p_0 < p < p_1", "Hausdorff-Young（插值推论）：Fourier 变换从 L^p 到 L^{p'} 有界，1 <= p <= 2", "Hardy-Littlewood 极大算子：弱 (1,1) 型 + 强 (infinity, infinity) => 强 (p,p) 型对 p > 1"],
        theorems: ["Riesz-Thorin 依赖复解析（Phragmén-Lindelöf/三线引理），要求算子线性且标量域为复；实方法需 Marcinkiewicz 或 Calderón 版本", "Marcinkiewicz 适用于次线性算子且只需弱型端点，但端点 p = p_0 一般不可达（极大算子在 L^1 上无强界）", "指数在 (1/p, 1/q) 平面上沿线段插值，范数按对数凸性控制，故插值范数不能取算术平均", "q < p 的情形需注意 Riesz-Thorin 允许 q 与 p 独立插值，但 Marcinkiewicz 对角版本要求同指数"],
        generalRequirements: ["插值前必须写出两个端点估计及其常数", "使用 Marcinkiewicz 必须说明算子次线性与端点为弱型", "结论指数必须由同一参数 t 同时给出 p 与 q"],
        forbiddenErrors: ["【端点包含误设】断言插值结论在端点 p = p_0 处成立（弱型情形失败）", "【线性性缺失】对次线性算子使用 Riesz-Thorin", "【常数误算】把插值常数写成算术平均而非几何插值 M_0^{1-t} M_1^t", "【指数配对错】p 与 q 使用不同插值参数", "【实复方法混用】在实标量域上直接使用复插值论证"],
        parameterConstraints: { exponentInterpolation: "1/p 与 1/q 用同一 t 线性插值", linearityForRieszThorin: "Riesz-Thorin 需线性（复标量）", sublinearityForMarcinkiewicz: "Marcinkiewicz 允许次线性", endpointExclusion: "弱型端点通常不可达" },
        closureChecks: ["确认两端点估计与常数写明", "确认插值常数为几何形式", "确认算子线性或次线性与所用定理匹配", "确认端点是否被排除"],
        scenarioChecks: { fourierTransformBounds: ["用 L^1-L^infinity 与 L^2-L^2 插值得 Hausdorff-Young", "确认 1 <= p <= 2"], maximalFunctionEstimates: ["弱 (1,1) 与 L^infinity 界插值", "确认 p > 1"], singularIntegralOperators: ["Calderón-Zygmund 理论先证弱 (1,1) 再插值", "确认核条件"] },
    },
    // 移位算子与不变子空间（Beurling 定理）。
    "operator-shift-invariant-subspace": {
        definitions: ["单侧移位 S: l^2 -> l^2，S(a_0, a_1, ...) = (0, a_0, a_1, ...)", "不变子空间：闭子空间 M 满足 TM subset M", "内函数：H^infinity 中模在边界几乎处处为 1 的函数", "Toeplitz 算子 T_phi = P_{H^2} M_phi"],
        formulas: ["移位性质：S^*S = I、SS^* = I - P_{e_0}，故 S 等距非酉，ind S = -1", "Beurling 定理：H^2 中 S 不变的非零闭子空间恰为 theta H^2，theta 为内函数", "Toeplitz 谱：phi 连续 => sigma(T_phi) = phi(单位圆) 并加上绕数非零的点；T_phi 可逆性由符号绕数决定", "Wold 分解：等距算子 = 酉部分 oplus 单侧移位的直和"],
        theorems: ["不变子空间问题（Hilbert 空间可分无穷维中每个有界算子是否有非平凡不变子空间）仍未解决；Banach 空间中 Enflo/Read 给出反例", "Beurling 定理把 H^2 上移位不变子空间完全分类，是解析函数模型的基础", "紧算子（Lomonosov/Aronszajn-Smith）与正规算子必有非平凡不变子空间", "Toeplitz 算子无非平凡紧的情形：非零 Toeplitz 算子不紧，且 T_phi 自伴 <=> phi 实"],
        generalRequirements: ["讨论移位必须区分单侧与双侧（双侧移位为酉）", "使用 Beurling 定理必须在 H^2 框架并给出内函数", "断言不变子空间存在必须限定算子类别（紧、正规、多项式紧等）"],
        forbiddenErrors: ["【移位酉性误设】称单侧移位为酉算子", "【一般存在性越界】断言任意有界算子有非平凡不变子空间已被证明", "【Beurling 越界】在 l^2 一般子空间上使用内函数分类而不转到 H^2", "【Toeplitz 紧性误判】称非零 Toeplitz 算子可以是紧的", "【指标误算】给出 ind S = 0"],
        parameterConstraints: { shiftType: "单侧等距非酉，双侧为酉", spaceModel: "Beurling 定理作用于 Hardy 空间 H^2", innerFunctionCondition: "边界模几乎处处为 1", symbolRegularity: "Toeplitz 谱结论需符号连续（或本质有界的推广）" },
        closureChecks: ["确认移位类型与酉性判断", "确认 Beurling 定理的空间与内函数条件", "确认不变子空间结论限定在已证类别", "确认 Toeplitz 相关谱与紧性断言正确"],
        scenarioChecks: { hardySpaceModel: ["压缩算子用移位模型表示", "确认 Wold 分解"], toeplitzInvertibility: ["由符号绕数判可逆与指标", "确认符号非零"], invariantSubspaceExistence: ["紧或正规算子情形引用已知定理", "确认算子类别"] },
    },
};
