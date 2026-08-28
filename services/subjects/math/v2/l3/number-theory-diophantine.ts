import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数论-丢番图方程”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMBER_THEORY_DIOPHANTINE_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Pell 方程 x^2 - d y^2 = 1 的基本解与解群结构。
    "pell-equation-fundamental-solution": {
        id: "pell-equation-fundamental-solution", l2Key: "number-theory-diophantine", name: "Pell 方程基本解与解群", kind: "theorem",
        aliases: ["Pell方程", "佩尔方程", "Pell equation", "基本解", "广义Pell方程"],
    },
    // 本原勾股数的完全参数化。
    "pythagorean-triple-parametrization": {
        id: "pythagorean-triple-parametrization", l2Key: "number-theory-diophantine", name: "本原勾股数参数化", kind: "theorem",
        aliases: ["勾股数组", "本原勾股数", "Pythagoras三元组", "Pythagorean triple", "勾股数参数化"],
    },
    // Vieta jumping：二次对称方程的下降构造。
    "vieta-jumping": {
        id: "vieta-jumping", l2Key: "number-theory-diophantine", name: "Vieta jumping 下降法", kind: "algorithm",
        aliases: ["Vieta jumping", "韦达跳跃", "根跳跃", "无穷递降法", "Fermat无穷递降"],
    },
    // Mordell-Weil 定理：椭圆曲线有理点群有限生成。
    "mordell-weil-theorem": {
        id: "mordell-weil-theorem", l2Key: "number-theory-diophantine", name: "Mordell-Weil 定理", kind: "theorem",
        aliases: ["Mordell-Weil定理", "Mordell Weil theorem", "有理点群", "秩与挠子群", "下降法"],
    },
    // Nagell-Lutz 定理：挠点的整性判据。
    "nagell-lutz-theorem": {
        id: "nagell-lutz-theorem", l2Key: "number-theory-diophantine", name: "Nagell-Lutz 定理", kind: "criterion",
        aliases: ["Nagell-Lutz定理", "Nagell Lutz theorem", "挠点判据", "有限阶有理点"],
    },
    // Siegel 定理：仿射曲线整数点的有限性。
    "siegel-integral-points": {
        id: "siegel-integral-points", l2Key: "number-theory-diophantine", name: "Siegel 整数点有限性定理", kind: "theorem",
        aliases: ["Siegel定理", "Siegel theorem", "整数点有限性", "Mordell方程整数点"],
    },
    // Faltings 定理：亏格大于 1 的曲线有理点有限。
    "faltings-theorem": {
        id: "faltings-theorem", l2Key: "number-theory-diophantine", name: "Faltings 定理", kind: "theorem",
        aliases: ["Faltings定理", "Faltings theorem", "Mordell猜想", "高亏格曲线有理点"],
    },
    // 局部-整体原则与 Hasse 原理失效。
    "hasse-principle-failure": {
        id: "hasse-principle-failure", l2Key: "number-theory-diophantine", name: "Hasse 原理与其失效", kind: "criterion",
        aliases: ["Hasse原理", "局部整体原则", "Hasse principle", "Selmer反例", "Brauer-Manin障碍"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMBER_THEORY_DIOPHANTINE_L3_RULES: Record<string, MathV2L3Rules> = {
    // Pell 方程：基本解生成全部正解，解群同构于 Z（正解部分）。
    "pell-equation-fundamental-solution": {
        definitions: ["Pell 方程研究 x^2 - d y^2 = 1（d > 0 非完全平方）的整数解，其结构由实二次域 Q(√d) 中范数为 1 的单位群决定。"],
        formulas: ["解的生成：设 (x_1, y_1) 为最小正解，则全部正解由 x_n + y_n√d = (x_1 + y_1√d)^n（n ≥ 1）给出。", "递推：x_{n+1} = x_1 x_n + d y_1 y_n，y_{n+1} = x_1 y_n + y_1 x_n。", "基本解来源：x_1/y_1 是 √d 连分数展开的某个收敛子，周期长 ℓ 时取 n = ℓ（ℓ 偶）或 n = 2ℓ（ℓ 奇）位置。", "负 Pell 方程 x^2 - d y^2 = -1 可解 ⇔ √d 连分数周期长为奇数。"],
        theorems: ["Pell 方程定理：d > 0 非完全平方时 x^2 - d y^2 = 1 有无穷多组整数解，且全部由最小正解的幂生成（Lagrange）。", "解群结构：{(x, y) : x^2 - d y^2 = 1} 在乘法下同构于 Z × Z/2（符号部分），正解部分同构于 Z。", "广义 Pell 方程 x^2 - d y^2 = N 的解分成有限多个类，每类由 Pell 基本解的幂平移生成；某些 N 无解，必须用模约束或连分数枚举判定。"],
        generalRequirements: ["必须验证 d > 0 且非完全平方，否则解退化为有限。", "宣称「全部解」时必须给出最小正解并说明幂生成机制与符号变换。"],
        forbiddenErrors: ["【d 为平方数误用】d 为完全平方时仍断言无穷多解（此时 x^2 - dy^2 = 1 只有平凡解）。", "【非基本解为起点】取某个非最小的解当基本解，导致漏掉部分解。", "【广义方程结构误推】把 x^2 - dy^2 = N 的解也断言为单一等比链生成。", "【负 Pell 可解性误判】未检查连分数周期奇偶就断言 x^2 - dy^2 = -1 有解。"],
        parameterConstraints: { discriminant: "d 为正整数且非完全平方。", fundamentalSolution: "(x_1, y_1) 必须是使 x > 0, y > 0 且 x 最小的解。", generalizedForm: "x^2 - dy^2 = N 需先判定是否存在一个解作为类代表。" },
        closureChecks: ["用 √d 的连分数展开求最小正解并回代验证 x_1^2 - d y_1^2 = 1。", "由递推生成若干解并核验范数恒为 1。", "对广义方程列出所有解类代表并说明覆盖性。"],
        scenarioChecks: { continuedFractionSolution: ["用 √d 的周期连分数收敛子定位基本解，周期奇偶决定 ±1 的可解性。"], quadraticFormNorm: ["把 Pell 解视为 Z[√d] 中范数 1 的单位，与 Dirichlet 单位定理的秩 1 结论对齐。"], squareTriangularNumbers: ["平方三角数、平方和链等经典问题化为具体 Pell 方程后用基本解生成全部解。"] },
    },
    // 本原勾股数：a = m^2 - n^2, b = 2mn, c = m^2 + n^2。
    "pythagorean-triple-parametrization": {
        definitions: ["本原勾股数参数化研究 x^2 + y^2 = z^2 的互素正整数解的完全描述，其本质是单位圆上有理点的有理参数化（射影直线到圆锥曲线的双有理同构）。"],
        formulas: ["本原解（gcd(x, y) = 1，y 偶）：x = m^2 - n^2，y = 2mn，z = m^2 + n^2。", "参数条件：m > n > 0，gcd(m, n) = 1，m 与 n 一奇一偶。", "一般解：把本原解乘以任意正整数因子 k。", "圆上有理点：(x/z, y/z) = ((1 - t^2)/(1 + t^2), 2t/(1 + t^2))，t = n/m ∈ Q。"],
        theorems: ["本原勾股数完全分类定理：上述参数化与条件给出所有本原解且表示唯一。", "推论：本原解中恰有一个直角边为偶数，斜边 z 恒为奇数且其素因子均 ≡ 1 (mod 4)。", "该参数化是圆锥曲线有理点的割线法特例：亏格 0 曲线有一个有理点即可有理参数化（与高亏格的 Faltings 情形对照）。"],
        generalRequirements: ["使用参数化必须声明是本原解并给出 m, n 的互素与奇偶条件。", "从本原解推广到一般解必须显式引入公因子 k。"],
        forbiddenErrors: ["【参数条件缺失】未要求 gcd(m, n) = 1 与一奇一偶，产生重复或非本原解。", "【奇偶分配错误】把 x = m^2 - n^2 当作偶边，或断言两个直角边可同为奇数。", "【一般解遗漏】只给出本原解就宣称枚举了全部勾股数。", "【推广越界】把该参数化搬到 x^n + y^n = z^n（n ≥ 3）或 x^2 + y^2 = z^3 等非亏格 0 情形。"],
        parameterConstraints: { primitivity: "本原解要求 gcd(x, y, z) = 1。", parameterRange: "m > n > 0，gcd(m, n) = 1，m ≢ n (mod 2)。", scaling: "一般解由本原解乘以正整数 k 得到。" },
        closureChecks: ["回代验证 x^2 + y^2 = z^2。", "核对 gcd(x, y) = 1 与偶边归属。", "说明参数 (m, n) 与解的一一对应，避免重复计数。"],
        scenarioChecks: { perimeterAreaConstraint: ["给定周长或面积约束时把条件写成 m, n 的方程再枚举有限参数。"], fermatDescentLink: ["x^4 + y^4 = z^2 型问题以本原参数化为起点做无穷递降。"], rationalPointsOnConic: ["一般圆锥曲线有理点先找一个有理点，再用割线法完成有理参数化。"] },
    },
    // Vieta jumping：把整数解视为二次方程的根并跳到更小解。
    "vieta-jumping": {
        definitions: ["Vieta jumping 研究对称二次型丢番图方程的解集结构：固定一个变量后方程是另一变量的二次方程，用韦达定理把已知解「跳」到新解，从而在极小解上导出矛盾或完整分类。"],
        formulas: ["对 x^2 - kxy + y^2 = c，固定 y 后两根满足 x + x' = ky、x·x' = y^2 - c，故 x' = ky - x = (y^2 - c)/x 仍为整数。", "极小性选取：在解集中取 x + y 最小的解，再证明跳跃产生更小解从而矛盾。", "典型方程：(x^2 + y^2 + 1)/(xy) = k、x^2 + y^2 = k(xy + 1) 等均可整理为上述对称形式。"],
        theorems: ["Vieta jumping 的合法性来自韦达定理：整系数二次方程一根为整数则另一根也是整数（且由和式显式给出）。", "结合无穷递降（Fermat descent）：若每个非极小解都能跳到更小的正解，则不存在非平凡解；若跳跃在有限步终止，则得到全部解的生成链。", "Markov 方程 x^2 + y^2 + z^2 = 3xyz 的全部正整数解由 (1, 1, 1) 经 Vieta 跳跃生成 Markov 树，是该方法的标准范例。"],
        generalRequirements: ["必须显式写出跳跃映射并证明新解仍为整数（用和式而非积式作论证）。", "必须给出严格递减的正整数量（如 x + y 或 max(x, y)）并保证其非负下界。"],
        forbiddenErrors: ["【新解整性未证】只用积式 x' = (y^2 - c)/x 断言整性而不引用和式。", "【正性未验】跳跃后未检查新解是否仍在所讨论的正整数（或非负）范围内。", "【极小性缺失】未取极小解就宣称矛盾。", "【下降量非离散】用不严格递减或可无限下降的量（如实数值）作为递降参数。"],
        parameterConstraints: { symmetry: "方程对相关变量对称或可整理为二次对称形式。", integrality: "系数为整数以保证韦达定理给出整数另一根。", descentMeasure: "必须存在取值于非负整数且严格递减的下降量。" },
        closureChecks: ["整理方程为固定一变量的二次形式并写出韦达关系。", "验证跳跃保持整性与正性并使下降量严格减小。", "在极小解处完成矛盾论证或列出全部基解。"],
        scenarioChecks: { markovEquation: ["Markov 型方程用跳跃生成解树，说明全部解由最小解出发可达。"], divisibilityConstraint: ["形如 (x^2 + y^2 + c)/(xy) ∈ Z 的问题先把 k 固定为常数再跳跃。"], noSolutionProof: ["证明无解时必须组合极小性与跳跃后的矛盾，不能仅给模约束。"] },
    },
    // Mordell-Weil 定理：E(Q) ≅ Z^r ⊕ E(Q)_tors。
    "mordell-weil-theorem": {
        definitions: ["Mordell-Weil 定理研究数域上椭圆曲线（更一般地 Abel 簇）有理点的群结构，断言它是有限生成 Abel 群，从而把有理点问题化为求秩与挠子群。"],
        formulas: ["结构式：E(Q) ≅ Z^r ⊕ E(Q)_tors，r 为 Mordell-Weil 秩。", "弱 Mordell-Weil：E(Q)/2E(Q) 有限；配合高度函数的下降论证得到有限生成性。", "高度性质：正规化高度 ĥ 满足 ĥ(nP) = n^2 ĥ(P)，且 ĥ(P) = 0 ⇔ P 为挠点。", "秩的上界来自 Selmer 群：rank E(Q) ≤ dim_{F_2} Sel^{(2)}(E/Q) - 1（2-下降形式）。"],
        theorems: ["Mordell-Weil 定理：数域 K 上椭圆曲线的 K-有理点群 E(K) 有限生成。", "证明骨架：弱 Mordell-Weil（E(K)/mE(K) 有限）＋ 高度函数的下降引理。", "秩不可由该定理算出：实际计算依赖 2-下降、Selmer 群与 Sha 的信息，Sha 非平凡时下降可能给不出精确秩（BSD 猜想给出解析刻画）。"],
        generalRequirements: ["必须先确认曲线光滑（判别式 Δ ≠ 0）且给出定义域（Q 或数域 K）。", "区分「有限生成」与「可计算」：秩的确定必须交代所用下降方法及其局限。"],
        forbiddenErrors: ["【有限性误推】由有限生成断言 E(Q) 有限（秩 > 0 时有无穷多有理点）。", "【秩可算误设】声称 Mordell-Weil 定理本身给出秩的算法。", "【奇异曲线误用】对判别式为 0 的奇异三次曲线套用该定理。", "【挠与自由混淆】把无限阶点的高度 ĥ(P) = 0 或把挠点当作生成元贡献秩。"],
        parameterConstraints: { smoothness: "E 必须是光滑三次曲线（Δ ≠ 0），带有理点作为零元。", baseField: "结论对数域成立；一般无限域（如 Q̄）不成立。", heightFunction: "下降论证要求 Weil 高度与正规化高度的标准性质。" },
        closureChecks: ["核验曲线光滑并写出 Weierstrass 形式。", "确定挠子群（可用 Nagell-Lutz 或约化）与已知独立点。", "说明秩的下界（由独立点）与上界（由 Selmer/下降）来源。"],
        scenarioChecks: { rankComputation: ["用 2-下降或 Selmer 群估计秩，并声明 Sha 可能造成的间隙。"], torsionDetermination: ["先用 Nagell-Lutz 或好约化下的注入性确定 E(Q)_tors。"], integralPointsLink: ["有理点无穷时整数点仍可能有限，须转用 Siegel 定理。"] },
    },
    // Nagell-Lutz 定理：挠点坐标整性与 y^2 | Δ 型约束。
    "nagell-lutz-theorem": {
        definitions: ["Nagell-Lutz 定理给出 y^2 = x^3 + ax + b（a, b ∈ Z）上有限阶有理点坐标的整性与大小约束，是手工确定挠子群的标准判据。"],
        formulas: ["判据：非零挠点 P = (x, y) 满足 x, y ∈ Z，且 y = 0 或 y^2 | Δ，其中 Δ = -(4a^3 + 27b^2)（也常用 Δ = 4a^3 + 27b^2 的整除形式）。", "2-挠点：由 x^3 + ax + b = 0 的整数根给出，此时 y = 0。", "Mazur 定理限制：E(Q)_tors 只能是 Z/n（1 ≤ n ≤ 10 或 n = 12）或 Z/2 × Z/2n（1 ≤ n ≤ 4）。"],
        theorems: ["Nagell-Lutz 定理：上述整性与整除条件是挠点的必要条件（不是充分条件）。", "补充判据：若 E 在素数 p（p ∤ Δ，p 奇）处有好约化，则约化映射在挠子群上单射，故 |E(Q)_tors| 整除 |E(F_p)|。", "Mazur 定理给出 Q 上挠子群的完全分类，可与 Nagell-Lutz 得出的候选集合交叉验证。"],
        generalRequirements: ["使用前必须把曲线化为整系数 Weierstrass 形式 y^2 = x^3 + ax + b。", "所有候选点必须回代曲线并验证阶有限（求 2P、3P 等或用约化）。"],
        forbiddenErrors: ["【必要条件当充分】把满足 y^2 | Δ 的整点直接判为挠点。", "【模型未整化】在非整系数或含 xy、y 项的模型上套用判据。", "【判别式写错】漏掉符号或用错 Δ = -(4a^3 + 27b^2) 的表达式。", "【Mazur 越界】给出 Z/7 × Z/2 等不可能的挠群结构。"],
        parameterConstraints: { model: "要求 y^2 = x^3 + ax + b 且 a, b ∈ Z。", nonsingular: "Δ ≠ 0（曲线光滑）。", candidateCheck: "候选点必须满足 x, y ∈ Z 且 y = 0 或 y^2 | Δ。" },
        closureChecks: ["列出 y^2 | Δ 的所有候选 y 并解出整数 x。", "回代验证点在曲线上，再计算倍点确认阶。", "用好约化素数的 |E(F_p)| 或 Mazur 分类交叉核对挠群。"],
        scenarioChecks: { torsionEnumeration: ["逐个候选点计算 2P、3P 判定阶，直到确定挠群同构类型。"], goodReductionSieve: ["取多个 p ∤ Δ 计算 |E(F_p)| 取公因子，快速压缩挠群候选。"], integralModelReduction: ["一般 Weierstrass 方程先配方消去 xy、y 项再套用判据。"] },
    },
    // Siegel 定理：亏格 ≥ 1 的仿射曲线上整数点有限。
    "siegel-integral-points": {
        definitions: ["Siegel 定理研究仿射代数曲线上整点的有限性：即使有理点无穷，整点在合适几何条件下仍只有有限多个，其证明基于丢番图逼近（Thue-Siegel-Roth 型结果）。"],
        formulas: ["椭圆情形：光滑 y^2 = x^3 + ax + b（a, b ∈ Z，Δ ≠ 0）上的整点 (x, y) ∈ Z^2 只有有限多个。", "Mordell 方程：y^2 = x^3 + k（k ≠ 0）整数解有限；Baker 理论给出有效上界 max(|x|, |y|) ≤ exp(C|k|^{C'})。", "一般判据：仿射曲线亏格 ≥ 1，或亏格 0 但无穷远点（去掉的点）个数 ≥ 3 时整点有限。"],
        theorems: ["Siegel 定理（1929）：数域上亏格 ≥ 1 的光滑仿射曲线的 S-整点集合有限。", "该定理本质非有效：不给出解的显式界；有效界需 Baker 的对数线性形式方法（Thue、Mordell 方程等具体族）。", "对比：有理点可以无穷（Mordell-Weil 秩 > 0），故整点有限性与有理点有限性是不同层次的结论。"],
        generalRequirements: ["必须先确认曲线光滑并计算亏格（或无穷远点个数）以判断定理适用。", "必须明确区分「整点」「S-整点」与「有理点」，不能混用有限性结论。"],
        forbiddenErrors: ["【有理点误推】用 Siegel 定理断言有理点有限。", "【亏格条件缺失】对亏格 0 且仅两个无穷远点的曲线（如 Pell 方程对应曲线）断言整点有限。", "【有效性误设】声称 Siegel 定理直接给出解的显式上界。", "【奇异曲线误用】在奇异（Δ = 0）模型上套用结论。"],
        parameterConstraints: { geometry: "亏格 ≥ 1，或亏格 0 且去掉的点数 ≥ 3。", smoothness: "要求所用模型光滑（椭圆情形 Δ ≠ 0）。", integralityRing: "整点须相对于固定的 S-整数环给出。" },
        closureChecks: ["计算亏格与无穷远点数以核对定理前提。", "宣称有限性后，若需列出全部整点必须引用有效方法（Baker 界 + 搜索或 Ellog/椭圆对数方法）。", "对比同一曲线上有理点的秩，避免结论混淆。"],
        scenarioChecks: { mordellEquation: ["y^2 = x^3 + k 用 Baker 有效界配合搜索给出全部整数解。"], pellContrast: ["Pell 方程整点无穷，说明亏格 0 且两点情形不适用 Siegel。"], thueEquation: ["形如 F(x, y) = m（F 齐次不可约、次数 ≥ 3）用 Thue 方程有效界处理。"] },
    },
    // Faltings 定理：亏格 ≥ 2 的曲线有理点有限。
    "faltings-theorem": {
        definitions: ["Faltings 定理（原 Mordell 猜想）研究数域上亏格 ≥ 2 的光滑射影曲线，断言其有理点只有有限多个，从而把有理点有限性与曲线的几何亏格联系起来。"],
        formulas: ["亏格三分法：亏格 0（有理点无穷或空）、亏格 1（Mordell-Weil 群，可有无穷多点）、亏格 ≥ 2（有理点有限）。", "平面光滑曲线亏格：次数 d 的光滑射影平面曲线 g = (d-1)(d-2)/2，故 d ≥ 4 时 g ≥ 3。", "Fermat 曲线 x^n + y^n = z^n（n ≥ 4）亏格 (n-1)(n-2)/2 ≥ 3，其有理点有限即为 Faltings 的经典推论。"],
        theorems: ["Faltings 定理（1983）：数域 K 上亏格 ≥ 2 的光滑射影曲线 C 的 K-有理点集 C(K) 有限。", "该定理非有效：不给出有理点个数或高度的显式上界（有效性属 Vojta/Bombieri 方法与 Chabauty-Coleman 等专门技术）。", "Mordell-Lang 与 Shafarevich 猜想是同一圈结论：Faltings 同时证明了 Abel 簇的 Mordell-Lang 猜想（子簇情形）与 Shafarevich 猜想。"],
        generalRequirements: ["必须先给出曲线的光滑射影模型并计算亏格。", "只能断言有限性；若题目要求列出全部有理点，必须引用 Chabauty-Coleman 或下降等有效方法。"],
        forbiddenErrors: ["【亏格误算】直接用平面曲线次数公式而不检查奇点（奇异曲线亏格更低）。", "【低亏格误用】对亏格 0 或 1 的曲线断言有理点有限。", "【有效性误设】声称 Faltings 定理给出解的界或枚举算法。", "【整点有理点混淆】把 Faltings 的有理点有限性与 Siegel 的整点有限性等同。"],
        parameterConstraints: { genus: "要求光滑射影模型的亏格 g ≥ 2。", baseField: "K 为数域（有限次 Q 扩张）。", model: "亏格计算必须基于光滑（正规化后的）模型。" },
        closureChecks: ["写出光滑模型并计算亏格，必要时先做正规化解消奇点。", "确认 g ≥ 2 后声明有限性并指出该结论非有效。", "如需具体点集，说明将采用 Chabauty-Coleman、下降或穷搜结合高度界。"],
        scenarioChecks: { fermatCurve: ["x^n + y^n = 1（n ≥ 4）亏格 ≥ 3，有理点有限（不等于 FLT，后者需模性定理）。"], chabautyMethod: ["当 Mordell-Weil 秩 < g 时可用 Chabauty-Coleman 有效确定全部有理点。"], superellipticCurve: ["y^m = f(x) 型曲线先算亏格再判断适用 Faltings 还是 Siegel。"] },
    },
    // Hasse 原理：局部可解与整体可解的关系及其失效。
    "hasse-principle-failure": {
        definitions: ["Hasse 原理研究「在所有局部域 Q_p 与 R 上可解是否推出在 Q 上可解」这一局部-整体问题；成立时给出可判定的算法性判据，失效时需要 Selmer 群或 Brauer-Manin 障碍解释。"],
        formulas: ["局部条件集合：方程在 R 与所有 Q_p 上可解，其中只需检查有限多个「坏」素数（整除判别式或系数的素数）与 R。", "Hasse-Minkowski：有理二次型 Q(x) = 0 有非平凡有理解 ⇔ 在 R 与所有 Q_p 上有非平凡解。", "经典反例：Selmer 曲线 3x^3 + 4y^3 + 5z^3 = 0 处处局部可解但无非平凡有理点。", "Lind-Reichardt 反例：2y^2 = x^4 - 17（等价形式）局部处处可解而无有理点。"],
        theorems: ["Hasse-Minkowski 定理：二次型（任意变量数）满足 Hasse 原理，这是该原理成立的核心正面结果。", "Hasse 原理对高次型一般失效：三次曲面/曲线存在处处局部可解而整体无解的反例（Selmer）。", "失效的系统解释：亏格 1 曲线的失效由 Sha（Tate-Shafarevich 群）非零度量；更一般的障碍由 Brauer-Manin 配对给出，且存在超越 Brauer-Manin 的反例。"],
        generalRequirements: ["使用局部条件否定整体可解性是合法的（局部无解 ⇒ 整体无解），必须给出具体的 p 或实位。", "由局部处处可解推整体可解只允许在已证成立 Hasse 原理的类（如二次型）中进行。"],
        forbiddenErrors: ["【原理滥用】对三次或更高次方程由局部处处可解断言有理解存在。", "【坏素数遗漏】只检查若干小素数就宣称处处局部可解，未覆盖整除判别式的素数与实位。", "【实位忽略】忘记检查 R 上的可解性（符号条件）。", "【障碍误判】遇到反例时归因为「计算错误」而不承认 Sha 或 Brauer-Manin 障碍。"],
        parameterConstraints: { placesToCheck: "必须覆盖 R 与所有整除判别式/系数的素数，其余素数由好约化与 Weil 界处理。", degreeScope: "正面结论（Hasse-Minkowski）仅对二次型成立。", localSolvability: "局部解须为非平凡解（对齐次方程排除全零）。" },
        closureChecks: ["逐个坏位与实位检查局部可解性，并说明好素数处由约化自动可解。", "若局部处处可解，判断方程是否属于 Hasse 原理成立的类；否则改用下降或 Brauer-Manin。", "给出结论时明确是「整体无解（局部障碍）」还是「局部无障碍但整体未定」。"],
        scenarioChecks: { quadraticFormSolvability: ["用 Hilbert 符号与 Hasse-Minkowski 判定二次型有理可解性。"], selmerCounterexample: ["三次曲线处处局部可解时须用 2-/3-下降计算 Selmer 群与 Sha。"], brauerManinObstruction: ["对有理曲面等情形用 Brauer-Manin 配对排除有理点，而非仅局部条件。"] },
    },
};
