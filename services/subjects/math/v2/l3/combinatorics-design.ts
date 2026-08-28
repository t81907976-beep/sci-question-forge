import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“组合设计”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const COMBINATORICS_DESIGN_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 平衡不完全区组设计的参数必要条件。
    "design-bibd-parameters": {
        id: "design-bibd-parameters", l2Key: "combinatorics-design", name: "平衡不完全区组设计与参数条件", kind: "object",
        aliases: ["平衡不完全区组设计", "BIBD参数条件", "区组设计可行性", "重复数与区组数关系"],
    },
    // Fisher 不等式与对称设计。
    "design-fisher-inequality": {
        id: "design-fisher-inequality", l2Key: "combinatorics-design", name: "Fisher 不等式与对称设计", kind: "theorem",
        aliases: ["Fisher不等式", "对称设计", "关联矩阵秩论证", "区组两两相交数"],
    },
    // t-设计与导出设计、剩余设计。
    "design-t-design-derived": {
        id: "design-t-design-derived", l2Key: "combinatorics-design", name: "t-设计与导出设计判据", kind: "criterion",
        aliases: ["t-设计", "导出设计", "剩余设计", "s-子集重数条件"],
    },
    // Steiner 系与三元系存在性。
    "design-steiner-system": {
        id: "design-steiner-system", l2Key: "combinatorics-design", name: "Steiner 系与三元系存在性", kind: "theorem",
        aliases: ["Steiner系", "Steiner三元系", "Kirkman存在性定理", "四元系存在条件"],
    },
    // 拉丁方与互相正交拉丁方。
    "design-latin-square-mols": {
        id: "design-latin-square-mols", l2Key: "combinatorics-design", name: "拉丁方与互相正交拉丁方", kind: "object",
        aliases: ["拉丁方", "互相正交拉丁方", "MOLS", "正交表等价性"],
    },
    // 有限射影平面与阶的限制。
    "design-projective-plane-order": {
        id: "design-projective-plane-order", l2Key: "combinatorics-design", name: "有限射影平面与 Bruck-Ryser-Chowla 条件", kind: "criterion",
        aliases: ["有限射影平面", "Bruck-Ryser-Chowla定理", "平面阶的存在条件", "阶为10不存在"],
    },
    // Hadamard 矩阵与 Hadamard 设计。
    "design-hadamard-matrix": {
        id: "design-hadamard-matrix", l2Key: "combinatorics-design", name: "Hadamard 矩阵与 Hadamard 设计", kind: "object",
        aliases: ["Hadamard矩阵", "Hadamard设计", "Sylvester构造", "Paley构造"],
    },
    // 差集与循环设计。
    "design-difference-set": {
        id: "design-difference-set", l2Key: "combinatorics-design", name: "差集与循环设计", kind: "object",
        aliases: ["差集设计", "循环设计", "平面差集", "乘子定理"],
    },
    // 可分解设计与 Kirkman 女生问题。
    "design-resolvable": {
        id: "design-resolvable", l2Key: "combinatorics-design", name: "可分解设计与平行类", kind: "criterion",
        aliases: ["可分解设计", "平行类", "Kirkman女生问题", "仿射可分解性"],
    },
    // 覆盖数与填装数的界。
    "design-covering-packing": {
        id: "design-covering-packing", l2Key: "combinatorics-design", name: "覆盖数与填装数界", kind: "criterion",
        aliases: ["覆盖数", "填装数", "Schönheim界", "渐近存在性定理"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const COMBINATORICS_DESIGN_L3_RULES: Record<string, MathV2L3Rules> = {
    // 平衡不完全区组设计的参数必要条件。
    "design-bibd-parameters": {
        definitions: ["2-(v, k, lambda) 设计：v 个点、区组大小恒为 k、任意两点恰好同时出现在 lambda 个区组中；k < v 时称不完全设计。", "重复数 r：每个点所在区组数；区组数 b：区组总数；关联矩阵 N 为 v x b 的 0-1 矩阵。", "补设计：把每个区组换成其补集；导出与剩余设计由固定点的邻域构造。"],
        formulas: ["r(k-1) = lambda(v-1)", "bk = vr", "b = lambda v(v-1) / (k(k-1)), r = lambda(v-1)/(k-1)", "补设计参数 v' = v, k' = v-k, lambda' = b - 2r + lambda"],
        theorems: ["两条计数恒等式 r(k-1) = lambda(v-1) 与 bk = vr 是 2-设计的必要条件，由点对与旗的双计数得到。", "整除条件 lambda(v-1) ≡ 0 (mod k-1) 与 lambda v(v-1) ≡ 0 (mod k(k-1)) 称为可行参数条件，仅为必要条件。", "Fisher 不等式给出 b >= v，故 r >= k。", "Wilson 渐近存在定理：固定 k 与 lambda，凡满足整除条件且 v 充分大者设计必存在；小 v 需逐例判定。"],
        generalRequirements: ["给出参数必须同时验证两条计数恒等式与两条整除条件，且 r、b 必须是正整数。", "必须区分参数可行与设计存在：可行只是通过了必要条件筛查。", "使用补设计或导出设计时必须重新计算全套参数并复验恒等式。", "k < v 与 lambda >= 1 必须显式声明，退化情形须单独说明。"],
        forbiddenErrors: ["【恒等式缺验】只给出 v、k、lambda 就断言设计成立，未验证 r 与 b 为整数。", "【必要当充分】把整除条件当成存在性证明，忽略如 2-(43,7,1) 这类可行而不存在的反例。", "【Fisher误用】忘记 b >= v，给出 b < v 的参数。", "【补设计参数错】补设计的 lambda' 直接沿用原 lambda，未用 b - 2r + lambda 重算。", "【渐近误用】把 Wilson 定理的充分大 v 结论用到小参数具体例子上。"],
        parameterConstraints: { pointCount: "v >= k+1，且 v 为正整数。", blockSize: "2 <= k < v。", lambdaValue: "lambda >= 1 为整数。", replicationNumber: "r = lambda(v-1)/(k-1) 必须为正整数。", blockCount: "b = vr/k 必须为正整数且 b >= v。" },
        closureChecks: ["双计数所得 r、b 与题目给定值一致。", "整除条件在 t = 1 与 t = 2 两层都成立。", "b >= v 成立。", "补设计或导出设计的参数经重算后仍满足全部恒等式。"],
        scenarioChecks: { feasibilityScreening: ["先算 r 再算 b", "检查两者是否为整数", "检查 b >= v", "说明结论只是必要条件"], existenceClaim: ["引用具体构造或已知存在定理", "不以整除条件代替构造", "小参数逐例核对已知表"], derivedDesign: ["明确固定点或固定区组的取法", "重算 v、k、lambda、r、b", "复验恒等式"] },
    },
    // Fisher 不等式与对称设计。
    "design-fisher-inequality": {
        definitions: ["Fisher 不等式：非平凡 2-(v, k, lambda) 设计满足 b >= v。", "对称设计：b = v 的 2-设计，此时 r = k，记作 (v, k, lambda)-设计。", "关联矩阵 N：行为点、列为区组，N[x][B] = 1 当且仅当点 x 属于区组 B。"],
        formulas: ["N N^T = (r - lambda) I + lambda J", "det(N N^T) = (r - lambda)^{v-1} · rk", "对称设计：k(k-1) = lambda(v-1)", "阶 n = k - lambda"],
        theorems: ["当 k < v 时 r > lambda，故 N N^T 的特征值 rk（重数 1）与 r - lambda（重数 v-1）全为正，N N^T 可逆，于是 v = rank(N N^T) <= rank(N) <= b。", "对称设计中任意两个不同区组恰好交于 lambda 个点，这是 b = v 情形特有的对偶结论。", "对称设计的对偶设计仍是同参数的对称设计。", "Bruck-Ryser-Chowla 定理给出对称设计的进一步存在性限制，Fisher 不等式不足以保证存在。"],
        generalRequirements: ["使用秩论证前必须验证 k < v，从而 r - lambda > 0。", "断言两区组交数恒为 lambda 时必须先确认设计是对称的。", "对称设计必须同时满足 b = v 与 r = k，二者由恒等式互推但需写明。", "Fisher 不等式只给下界，存在性需另行构造。"],
        forbiddenErrors: ["【退化未排除】在 k = v 或 r = lambda 的平凡设计上使用秩论证。", "【对偶误推】非对称设计也断言任意两区组恰交 lambda 点。", "【界当充分】用 b >= v 成立来论证设计存在。", "【矩阵式写错】把 N N^T 写成 (r - lambda) J + lambda I 之类的颠倒形式。", "【阶定义混用】把对称设计的阶 n = k - lambda 与射影平面阶的关系张冠李戴。"],
        parameterConstraints: { nonTrivial: "要求 2 <= k < v 以保证 r > lambda。", symmetricCase: "对称设计要求 b = v 且 r = k。", orderValue: "n = k - lambda >= 1。", lambdaRange: "1 <= lambda < k。", rankCondition: "det(N N^T) = (r-lambda)^{v-1} rk ≠ 0。" },
        closureChecks: ["k < v 与 r > lambda 已核验。", "N N^T 展开式与行列式公式一致。", "对称性结论只在 b = v 时使用。", "存在性另有构造或引用了 Bruck-Ryser-Chowla 判据。"],
        scenarioChecks: { rankArgument: ["写出 N N^T", "验证正定性", "由 rank 得 v <= b", "排除平凡情形"], symmetricDesign: ["核对 b = v 与 r = k", "使用 k(k-1) = lambda(v-1)", "给出两区组交数为 lambda 的依据"], nonExistence: ["先用参数可行性筛查", "再用 Bruck-Ryser-Chowla", "说明判据的适用奇偶条件"] },
    },
    // t-设计与导出设计、剩余设计。
    "design-t-design-derived": {
        definitions: ["t-(v, k, lambda) 设计：任意 t 个点恰好同时落在 lambda 个区组中。", "lambda_s：任意 s 个点（0 <= s <= t）所在区组数，由 t 层参数唯一确定。", "导出设计：固定一点 x，取含 x 的区组去掉 x；剩余设计：取不含某区组 B 的区组，点集限制在 B 的补集上。"],
        formulas: ["lambda_s = lambda · C(v-s, t-s) / C(k-s, t-s)", "lambda_0 = b, lambda_1 = r, lambda_t = lambda", "导出设计：(t-1)-(v-1, k-1, lambda)", "剩余设计（对称设计）：2-(v-k, k-lambda, lambda)"],
        theorems: ["t-设计必为 s-设计（s <= t），且 lambda_s 由上式给出，故所有 lambda_s 必须为整数，这给出 t 条整除条件。", "导出设计把 t 降一阶、v 与 k 各减一，lambda 不变；重复使用可逐层下降。", "对称 2-设计的剩余设计是 2-(v-k, k-lambda, lambda) 设计，反之准剩余设计未必可扩为对称设计（Hall-Connor 定理给出 lambda <= 2 时可扩）。", "非平凡 t-设计对 t >= 6 的存在性极其稀少；Ray-Chaudhuri-Wilson 界给出 b >= C(v, s) 型下界。"],
        generalRequirements: ["宣称 t-设计前必须逐个验证 lambda_0 到 lambda_t 全为整数。", "导出与剩余构造必须写清固定的点或区组，并重算全套参数。", "剩余设计构造只对对称设计给出上述参数公式，一般设计需另算。", "t >= 3 的存在性必须引用具体构造或已知结果，不能由整除条件推得。"],
        forbiddenErrors: ["【整除漏层】只验证 lambda_t 为整数，未检查中间层 lambda_s。", "【降阶参数错】导出设计写成 (t-1)-(v-1, k, lambda) 或让 lambda 一并变化。", "【剩余可扩】把准剩余设计一律当成某对称设计的剩余设计。", "【必要当充分】用 lambda_s 全为整数断言 t-设计存在。", "【t 值虚高】把只验证了两点条件的设计称为 t-设计（t >= 3）。"],
        parameterConstraints: { strengthT: "1 <= t <= k <= v。", lambdaIntegrality: "对每个 0 <= s <= t，lambda_s 必须为正整数。", derivedValidity: "导出设计要求 t >= 2 且 k >= 2。", residualValidity: "剩余设计要求原设计对称且 k > lambda。", nonTrivial: "k < v 且 lambda >= 1。" },
        closureChecks: ["lambda_s 序列逐项为整数。", "lambda_0 = b、lambda_1 = r 与独立计数一致。", "导出/剩余设计参数经公式与恒等式双重复验。", "t 的宣称值与实际验证的点数一致。"],
        scenarioChecks: { parameterDerivation: ["写出 lambda_s 公式", "逐层验证整数性", "报告 b 与 r"], derivedConstruction: ["指明固定点", "给出新参数", "验证 (t-1) 层条件"], residualConstruction: ["确认原设计对称", "给出 2-(v-k, k-lambda, lambda)", "不反向断言可扩性"] },
    },
    // Steiner 系与三元系存在性。
    "design-steiner-system": {
        definitions: ["Steiner 系 S(t, k, v)：lambda = 1 的 t-(v, k, 1) 设计，任意 t 个点恰含于唯一区组。", "Steiner 三元系 STS(v)：S(2, 3, v)，区组称三元组。", "Steiner 四元系 SQS(v)：S(3, 4, v)。"],
        formulas: ["STS(v) 区组数 b = v(v-1)/6，重复数 r = (v-1)/2", "S(2,3,v) 存在 <=> v ≡ 1 或 3 (mod 6)", "S(3,4,v) 存在 <=> v ≡ 2 或 4 (mod 6)", "S(2,k,v) 的必要条件：v ≡ 1 (mod k-1) 且 v(v-1) ≡ 0 (mod k(k-1))"],
        theorems: ["Kirkman 定理：STS(v) 存在当且仅当 v ≡ 1, 3 (mod 6)，这是 lambda = 1 情形中必要条件同时充分的少数例子。", "Hanani 定理：SQS(v) 存在当且仅当 v ≡ 2, 4 (mod 6)。", "S(2,4,v) 存在当且仅当 v ≡ 1, 4 (mod 12)；S(2,5,v) 存在当且仅当 v ≡ 1, 5 (mod 20)。", "对 k >= 6 与 t >= 4，除少数已知例外（如 S(5,6,12)、S(5,8,24)），一般存在性由 Keevash 的渐近结果保证充分大 v 的情况。"],
        generalRequirements: ["给出 S(t,k,v) 必须先验证 lambda = 1 下所有 lambda_s 的整除条件。", "对 STS 与 SQS 必须直接引用完整的同余判据，不得只给必要条件。", "对 k >= 6 或 t >= 4 的情形必须区分小 v 的具体存在与渐近存在。", "区组必须两两至多交于 t-1 个点，这是 lambda = 1 的等价刻画，须显式核查。"],
        forbiddenErrors: ["【同余写错】把 STS 条件写成 v ≡ 1, 3 (mod 4) 或漏掉 v ≡ 3 一支。", "【判据外推】把 Kirkman 的充要性套用到 k >= 4 的 Steiner 系。", "【交数超限】给出的两个区组交于 t 个及以上点，违反 lambda = 1。", "【渐近当具体】用 Keevash 渐近定理断言某个具体小 v 的设计存在。", "【计数错误】b 或 r 未按 v(v-1)/6 与 (v-1)/2 核算。"],
        parameterConstraints: { stsCongruence: "STS(v) 要求 v ≡ 1 或 3 (mod 6)，v >= 3。", sqsCongruence: "SQS(v) 要求 v ≡ 2 或 4 (mod 6)，v >= 4。", lambdaOne: "lambda = 1 固定不变。", blockIntersection: "任意两区组交点数 <= t-1。", generalNecessary: "S(2,k,v) 要求 v ≡ 1 (mod k-1) 且 v(v-1) ≡ 0 (mod k(k-1))。" },
        closureChecks: ["v 的同余类落在对应判据内。", "b 与 r 由公式核算为整数。", "区组两两交数不超过 t-1。", "小 v 的存在性有构造或已知表支撑。"],
        scenarioChecks: { stsExistence: ["检查 v mod 6", "算出 b 与 r", "引用 Kirkman 定理"], generalSteiner: ["写出 lambda_s 整除条件", "查已知充要判据", "对未知情形只给必要条件"], constructionCheck: ["核对每个 t-子集恰被覆盖一次", "核对区组交数上界"] },
    },
    // 拉丁方与互相正交拉丁方。
    "design-latin-square-mols": {
        definitions: ["n 阶拉丁方：n x n 数组，每个符号在每行每列恰出现一次。", "两个拉丁方 L, L' 正交：叠加后的 n^2 个有序对 (L[i][j], L'[i][j]) 互不相同。", "N(n)：n 阶互相正交拉丁方（MOLS）的最大个数；一组 n-1 个 MOLS 称完全组。"],
        formulas: ["N(n) <= n - 1", "N(n) = n - 1 <=> 存在 n 阶射影平面", "q 为素数幂时 N(q) = q - 1", "k 个 MOLS <=> 一个 OA(n^2, k+2, n, 2) 正交表 <=> 一个 (k+2)-net"],
        theorems: ["N(n) <= n-1，等号成立当且仅当存在阶为 n 的射影平面；因此 N(6) = 1、N(10) 未知等价于平面存在性问题。", "MacNeish 界：若 n = prod p_i^{a_i}，则 N(n) >= min(p_i^{a_i}) - 1；该界一般不紧。", "Euler 猜想被 Bose-Shrikhande-Parker 推翻：除 n = 2, 6 外任意 n 都存在一对正交拉丁方，即 N(n) >= 2。", "k 个 n 阶 MOLS 与强度 2、k+2 列、水平数 n 的正交表等价，也与横截设计 TD(k+2, n) 等价。"],
        generalRequirements: ["断言正交性必须核验 n^2 个有序对全不相同，不能只抽查若干行。", "使用 N(n) = n-1 时必须同时确认射影平面存在。", "MacNeish 界只作下界使用，不得当作精确值。", "n = 2 与 n = 6 必须作为例外单独说明。"],
        forbiddenErrors: ["【上界越界】给出多于 n-1 个两两正交的 n 阶拉丁方。", "【例外遗漏】声称对一切 n >= 3 都有 N(n) >= 2 而不排除 n = 6。", "【Euler未纠正】仍援引 Euler 猜想断言 n ≡ 2 (mod 4) 时无正交对。", "【界当等号】用 MacNeish 下界作为 N(n) 的准确值。", "【正交性抽查】只验证部分有序对不同就断言正交。"],
        parameterConstraints: { orderRange: "n >= 1 为整数，拉丁方阶数。", molsCount: "MOLS 个数 k 满足 1 <= k <= n-1。", exceptionalOrders: "n = 2 与 n = 6 时 N(n) = 1。", primePowerCase: "n = q 为素数幂时可取满 q-1 个。", orthogonalPairs: "叠加有序对个数必须恰为 n^2 且互异。" },
        closureChecks: ["每行每列符号无重复。", "任意两个所选拉丁方的叠加对全互异。", "MOLS 个数不超过 n-1。", "涉及 n = 6 或 n = 10 时给出了正确的已知结论。"],
        scenarioChecks: { orthogonalityVerification: ["逐对检查叠加", "统计不同有序对个数是否为 n^2", "说明验证范围"], boundUsage: ["写出 N(n) <= n-1", "需要等号时论证射影平面存在", "下界用 MacNeish 或已知构造"], equivalentObjects: ["指明是正交表还是横截设计", "写出参数换算", "核对强度与列数"] },
    },
    // 有限射影平面与阶的限制。
    "design-projective-plane-order": {
        definitions: ["阶为 n 的有限射影平面：每条直线含 n+1 个点、每点过 n+1 条直线、两点确定唯一直线、两线交于唯一点的 2-(n^2+n+1, n+1, 1) 对称设计。", "Bruck-Ryser-Chowla 条件：对称 (v,k,lambda)-设计存在性的数论必要条件。", "阶 n 的平面等价于 n-1 个 MOLS 的完全组。"],
        formulas: ["点数 = 线数 = n^2 + n + 1", "每线点数 = 每点线数 = n + 1", "n ≡ 1 或 2 (mod 4) 时，n 必须能写成两个整数平方之和", "对称设计一般情形：v 偶时 k - lambda 为完全平方；v 奇时 z^2 = (k-lambda)x^2 + (-1)^{(v-1)/2} lambda y^2 有非零整数解"],
        theorems: ["Bruck-Ryser 定理：若阶 n ≡ 1, 2 (mod 4) 的射影平面存在，则 n 是两个平方数之和；由此 n = 6, 14, 21, 22 等不存在。", "该定理对 n ≡ 0, 3 (mod 4) 不给出任何限制，故 n = 10 需要 Lam 等人的穷尽计算才排除。", "所有素数幂 n = q 都有 Desarguesian 平面 PG(2, q)；无非素数幂阶平面已知存在。", "Bruck-Ryser-Chowla 条件是必要而非充分：满足条件不意味着平面或对称设计存在。"],
        generalRequirements: ["使用 Bruck-Ryser 前必须先判定 n mod 4 落在 1 或 2。", "对 n ≡ 0, 3 (mod 4) 不得用该定理作非存在结论。", "n = 10 的不存在性必须归因于计算机穷尽搜索，而非数论判据。", "构造存在性只能对素数幂给出，其他阶必须声明未知。"],
        forbiddenErrors: ["【模条件误用】对 n ≡ 3 (mod 4) 用两平方和条件断言不存在。", "【判据当充分】由 n 是两平方和推出平面存在。", "【10阶归因错】把 n = 10 的排除归给 Bruck-Ryser 定理。", "【非素数幂断言】声称已知某非素数幂阶平面存在或已被证明不存在。", "【参数不符】给出的点数与 n^2+n+1 或线上点数与 n+1 不一致。"],
        parameterConstraints: { orderMin: "n >= 2。", pointCount: "v = n^2 + n + 1。", blockSize: "k = n + 1，lambda = 1。", brcApplicability: "两平方和条件仅在 n ≡ 1, 2 (mod 4) 时适用。", knownExistence: "已知存在者仅限 n 为素数幂。" },
        closureChecks: ["点数、线数、线上点数三项与 n 一致。", "n mod 4 的分类与所用判据匹配。", "非存在结论标明依据是数论判据还是穷尽搜索。", "存在性结论只对素数幂给出。"],
        scenarioChecks: { nonExistenceProof: ["计算 n mod 4", "适用时验证两平方和", "否则声明判据不适用"], existenceConstruction: ["确认 n 为素数幂", "给出 PG(2,q) 构造", "核对参数"], molsLink: ["写出与 n-1 个 MOLS 的等价", "说明等价是双向的"] },
    },
    // Hadamard 矩阵与 Hadamard 设计。
    "design-hadamard-matrix": {
        definitions: ["n 阶 Hadamard 矩阵 H：元素为 ±1 且满足 H H^T = n I，即任意两行正交。", "标准化：通过行列取反使首行首列全为 +1。", "Hadamard 设计：由标准化 H 去掉首行首列后把 +1 换成点得到的 2-(4m-1, 2m-1, m-1) 对称设计。"],
        formulas: ["H H^T = n I，|det H| = n^{n/2}", "n = 1, 2 或 n ≡ 0 (mod 4)", "Sylvester 构造：H_{2n} = [[H_n, H_n], [H_n, -H_n]]，得阶 2^k", "Paley 构造：q ≡ 3 (mod 4) 素数幂给出阶 q+1；q ≡ 1 (mod 4) 给出阶 2(q+1)"],
        theorems: ["除 n = 1, 2 外 Hadamard 矩阵的阶必为 4 的倍数，由标准化后行的符号配对计数得到。", "Hadamard 猜想：每个 4 的倍数阶都存在，至今未解决（最小未定阶数长期为 668 一类）。", "H 存在 <=> 存在 Hadamard 设计 2-(4m-1, 2m-1, m-1) <=> 存在 4m-1 阶 Paley 型差集（当 4m-1 为素数幂）。", "Sylvester 与 Paley 两族构造覆盖大量但非全部 4 的倍数阶；克罗内克积保持 Hadamard 性质，故阶可相乘。"],
        generalRequirements: ["验证 Hadamard 性必须核对 H H^T = n I，即所有行两两正交且每行范数为 n。", "阶必须先过 n ≡ 0 (mod 4) 的筛查（n = 1, 2 例外）。", "由 H 构造设计前必须标准化，并说明去掉首行首列。", "存在性只能引用具体构造或已知表，不能引用未证的猜想。"],
        forbiddenErrors: ["【阶数违规】给出 n 不是 4 的倍数且 n > 2 的 Hadamard 矩阵。", "【猜想当定理】把 Hadamard 猜想当已证结论使用。", "【标准化遗漏】直接删行删列而未先把首行首列化为全 +1。", "【设计参数错】把导出设计写成 2-(4m, 2m, m) 之类不满足 b = v 的参数。", "【正交性抽查】只验证相邻行正交就断言 H H^T = n I。"],
        parameterConstraints: { orderCondition: "n = 1, 2 或 n ≡ 0 (mod 4)。", entryValues: "所有元素取值 ±1。", designParameters: "对应设计参数 v = 4m-1, k = 2m-1, lambda = m-1，其中 n = 4m。", sylvesterOrders: "Sylvester 构造给出 n = 2^k。", paleyCondition: "Paley I 需 q ≡ 3 (mod 4)，Paley II 需 q ≡ 1 (mod 4)，q 为素数幂。" },
        closureChecks: ["H H^T = n I 已逐项核验。", "阶满足 4 的整除条件。", "设计参数满足对称设计恒等式 k(k-1) = lambda(v-1)。", "构造方法与 q 的同余类匹配。"],
        scenarioChecks: { matrixVerification: ["检查元素为 ±1", "验证行两两正交", "核对 H H^T = n I"], constructionChoice: ["按阶选择 Sylvester 或 Paley", "核对素数幂与同余条件", "必要时用克罗内克积组合"], designDerivation: ["先标准化", "去首行首列", "写出 2-(4m-1, 2m-1, m-1) 并复验"] },
    },
    // 差集与循环设计。
    "design-difference-set": {
        definitions: ["群 G（阶 v）中的 (v, k, lambda)-差集 D：|D| = k，且每个非单位元 g 恰有 lambda 种表示 g = d_1 d_2^{-1}（d_i ∈ D）。", "循环差集：G 为循环群 Z_v；由 D 的所有平移 D + i 作为区组得到循环对称设计。", "乘子：整数 t 使 tD = D + s 对某个 s 成立。"],
        formulas: ["k(k-1) = lambda(v-1)", "阶 n = k - lambda", "群环恒等式 D · D^{(-1)} = (k - lambda) + lambda G", "Singer 差集参数 (q^2+q+1, q+1, 1)"],
        theorems: ["(v,k,lambda)-差集与由其平移构成的对称 (v,k,lambda)-设计一一对应，故差集参数必须满足 k(k-1) = lambda(v-1) 与 Bruck-Ryser-Chowla 条件。", "乘子定理（Hall）：若素数 p 整除 n = k-lambda 且 p 与 v 互素、p > lambda，则 p 是该差集的乘子；乘子作用把区组按轨道分组，可大幅缩小搜索。", "Singer 定理：射影平面 PG(2,q) 的点线关联给出参数 (q^2+q+1, q+1, 1) 的循环差集。", "Paley 差集：q ≡ 3 (mod 4) 时二次剩余集是 (q, (q-1)/2, (q-3)/4)-差集。"],
        generalRequirements: ["验证差集必须遍历所有 v-1 个非单位元并核对表示数恒为 lambda。", "使用乘子定理必须逐条验证 p | n、gcd(p, v) = 1 与 p > lambda。", "宣称构造存在时必须给出群、子集与参数三者，并复验群环恒等式。", "阿贝尔与非阿贝尔情形的结论不得混用；差集乘子理论主要在阿贝尔群成立。"],
        forbiddenErrors: ["【表示数抽查】只验证部分差值就断言差集。", "【乘子条件缺失】跳过 p > lambda 或 gcd(p,v) = 1 直接断言 p 为乘子。", "【参数不符】给出的 (v,k,lambda) 不满足 k(k-1) = lambda(v-1)。", "【群结构混用】把阿贝尔情形的乘子定理套到非阿贝尔群。", "【存在性外推】由参数可行断言差集存在，忽略 Bruck-Ryser-Chowla 与已知非存在结果。"],
        parameterConstraints: { groupOrder: "v = |G| >= 2。", subsetSize: "1 <= k < v。", lambdaRelation: "lambda = k(k-1)/(v-1) 必须为正整数。", orderValue: "n = k - lambda >= 1。", multiplierConditions: "乘子候选 p 需满足 p | n、gcd(p, v) = 1、p > lambda。" },
        closureChecks: ["每个非单位元的差表示数均为 lambda。", "k(k-1) = lambda(v-1) 成立。", "群环恒等式 D D^{(-1)} = (k-lambda) + lambda G 核验通过。", "乘子结论的三条前提全部满足。"],
        scenarioChecks: { differenceSetVerification: ["列出全部差值", "统计每个非零元出现次数", "确认恒为 lambda"], multiplierUse: ["验证 p 的三条件", "给出轨道划分", "说明搜索缩减范围"], designCorrespondence: ["由差集写出平移区组", "核对得到对称设计", "复验 b = v 与 r = k"] },
    },
    // 可分解设计与 Kirkman 女生问题。
    "design-resolvable": {
        definitions: ["平行类：区组的一个子集，其区组两两不交且并集恰为全部点集。", "可分解设计：区组集可划分为若干平行类。", "仿射可分解（affine resolvable）：任意两个不同平行类中的区组交点数为常数。"],
        formulas: ["平行类含 v/k 个区组，平行类个数 = r", "可分解 2-(v,k,lambda) 设计要求 k | v", "Bose 条件：可分解设计满足 b >= v + r - 1", "仿射情形：b = v + r - 1，两异类区组交数 = k^2/v"],
        theorems: ["可分解性要求 k 整除 v；每个平行类恰含 v/k 个区组，平行类总数等于重复数 r。", "Bose 不等式 b >= v + r - 1 是可分解设计的必要条件，等号成立当且仅当设计仿射可分解。", "Kirkman 女生问题即 KTS(15) 的存在；可分解 Steiner 三元系 KTS(v) 存在当且仅当 v ≡ 3 (mod 6)。", "可分解 2-(v,k,1) 设计（k = 3 即 KTS）与相应的 Kirkman 系统等价；对 k >= 4 的可分解性由 Ray-Chaudhuri-Wilson 定理给出 v ≡ k (mod k(k-1)) 型充要条件。"],
        generalRequirements: ["宣称可分解必须显式给出平行类划分或论证其存在。", "先验证 k | v，再核对平行类个数等于 r。", "使用 Bose 不等式时区分一般可分解与仿射可分解。", "KTS 的同余条件是 v ≡ 3 (mod 6)，严格强于 STS 的 v ≡ 1, 3 (mod 6)。"],
        forbiddenErrors: ["【整除缺验】在 k 不整除 v 时断言可分解。", "【同余混淆】把 KTS 存在条件写成 STS 的 v ≡ 1, 3 (mod 6)。", "【Bose误用】把 b >= v + r - 1 用到非可分解设计，或把等号当一般结论。", "【仿射滥用】未验证交数为常数就称仿射可分解。", "【划分缺失】只给区组表而不给出平行类分组。"],
        parameterConstraints: { divisibility: "k | v 是可分解的必要条件。", parallelClassSize: "每个平行类含 v/k 个区组。", classCount: "平行类个数 = r。", boseBound: "b >= v + r - 1。", ktsCongruence: "KTS(v) 要求 v ≡ 3 (mod 6)。" },
        closureChecks: ["k | v 成立。", "平行类内区组两两不交且覆盖全部点。", "平行类个数与 r 一致，区组总数与 b 一致。", "Bose 不等式成立，仿射情形交数为常数 k^2/v。"],
        scenarioChecks: { resolvabilityCheck: ["验证 k | v", "给出平行类划分", "核对每类覆盖全部点"], ktsExistence: ["检查 v mod 6 = 3", "引用 Ray-Chaudhuri-Wilson 结果", "给出 v = 15 的具体解法"], affineCase: ["核对 b = v + r - 1", "验证异类区组交数为 k^2/v"] },
    },
    // 覆盖数与填装数的界。
    "design-covering-packing": {
        definitions: ["覆盖数 C(v,k,t)：覆盖全部 t-子集所需 k-子集的最小个数。", "填装数 D(v,k,t)：任意 t-子集至多被覆盖一次的 k-子集族的最大个数。", "Turán 型对偶：填装是 lambda = 1 的部分设计，覆盖允许重复覆盖。"],
        formulas: ["D(v,k,t) <= floor((v/k) floor((v-1)/(k-1)) ... floor((v-t+1)/(k-t+1)))", "C(v,k,t) >= ceil((v/k) ceil((v-1)/(k-1)) ... ceil((v-t+1)/(k-t+1)))", "D(v,k,t) <= C(v,k,t)，且两者相等当且仅当存在 S(t,k,v)", "Rödl 渐近：C(v,k,t) = (1+o(1)) C(v,t)/C(k,t)"],
        theorems: ["Schönheim 界通过逐层取整给出填装数的上界与覆盖数的下界，两式结构对称、取整方向相反。", "存在 Steiner 系 S(t,k,v) 当且仅当 D(v,k,t) = C(v,k,t) = C(v,t)/C(k,t)，此时两界同时取到。", "Rödl nibble 方法给出 v -> ∞ 时覆盖数与填装数均渐近达到 C(v,t)/C(k,t)，即渐近存在近似设计。", "Keevash 与 Glock-Kühn-Lo-Osthus 的结果把整除条件下的精确存在性推进到充分大 v，但小 v 仍需逐例判定。"],
        generalRequirements: ["使用 Schönheim 界必须写清逐层取整的方向，覆盖用上取整、填装用下取整。", "把界当成精确值前必须确认相应 Steiner 系存在。", "渐近结论只能用于 v 充分大，不得用于具体小参数。", "填装与覆盖的不等式方向必须与定义一致：D <= 精确值 <= C。"],
        forbiddenErrors: ["【取整反向】填装数用上取整或覆盖数用下取整。", "【界当精确】直接令 C(v,k,t) = C(v,t)/C(k,t) 而不验证整除与存在性。", "【方向颠倒】写出 C(v,k,t) <= D(v,k,t)。", "【渐近误用】用 Rödl 或 Keevash 的渐近结果断言小 v 的精确值。", "【定义混淆】把填装族允许重复覆盖，或把覆盖族要求恰覆盖一次。"],
        parameterConstraints: { parameterRange: "2 <= t <= k <= v。", packingBound: "D(v,k,t) 用逐层下取整上界。", coveringBound: "C(v,k,t) 用逐层上取整下界。", equalityCondition: "D = C 当且仅当 S(t,k,v) 存在。", asymptoticRegime: "渐近等式仅在 v -> ∞ 时成立。" },
        closureChecks: ["取整方向与所求量匹配。", "D <= C 的不等关系保持。", "宣称等号时给出了 Steiner 系构造或引用。", "渐近结论明确标注了 v 充分大的前提。"],
        scenarioChecks: { boundComputation: ["写出逐层取整表达式", "按方向计算", "报告是上界还是下界"], exactValueClaim: ["检查整除条件", "确认 Steiner 系存在", "否则只给区间"], asymptoticStatement: ["写出 C(v,t)/C(k,t) 主项", "标注 o(1) 与 v 充分大", "不外推到具体小 v"] },
    },
};
