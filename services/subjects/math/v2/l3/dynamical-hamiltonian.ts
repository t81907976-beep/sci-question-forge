import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“动力系统-Hamilton系统”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const DYNAMICAL_HAMILTONIAN_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Hamilton 正则方程与辛形式。
    "hamiltonian-canonical-equations-symplectic-form": {
        id: "hamiltonian-canonical-equations-symplectic-form", l2Key: "dynamical-hamiltonian", name: "正则方程与辛形式", kind: "object",
        aliases: ["Hamilton正则方程", "辛形式", "Hamilton向量场", "Darboux坐标"],
    },
    // Poisson 括号与 Poisson 结构。
    "hamiltonian-poisson-bracket-structure": {
        id: "hamiltonian-poisson-bracket-structure", l2Key: "dynamical-hamiltonian", name: "Poisson 括号结构", kind: "object",
        aliases: ["Poisson括号", "Jacobi恒等式", "Poisson结构", "Casimir函数"],
    },
    // Liouville 相体积守恒与不可压缩相流。
    "hamiltonian-liouville-phase-volume": {
        id: "hamiltonian-liouville-phase-volume", l2Key: "dynamical-hamiltonian", name: "相体积守恒定理", kind: "theorem",
        aliases: ["相体积守恒", "不可压缩相流", "辛体积不变", "Poincare积分不变量"],
    },
    // 对称性与守恒量：Noether 定理的 Hamilton 形式。
    "hamiltonian-noether-symmetry-conservation": {
        id: "hamiltonian-noether-symmetry-conservation", l2Key: "dynamical-hamiltonian", name: "对称性与守恒量定理", kind: "theorem",
        aliases: ["Noether定理", "守恒量", "单参数对称群", "首次积分"],
    },
    // Arnold-Liouville 可积性与作用角变量。
    "hamiltonian-arnold-liouville-integrability": {
        id: "hamiltonian-arnold-liouville-integrability", l2Key: "dynamical-hamiltonian", name: "Arnold-Liouville 定理", kind: "theorem",
        aliases: ["Liouville可积", "作用角变量", "不变环面", "对合的首次积分"],
    },
    // 正则变换与 Hamilton-Jacobi 生成函数。
    "hamiltonian-canonical-transformation-jacobi": {
        id: "hamiltonian-canonical-transformation-jacobi", l2Key: "dynamical-hamiltonian", name: "正则变换与 Hamilton-Jacobi 方程", kind: "algorithm",
        aliases: ["正则变换", "生成函数", "Hamilton-Jacobi方程", "变量分离求积"],
    },
    // KAM 定理与 Diophantine 条件。
    "hamiltonian-kam-diophantine": {
        id: "hamiltonian-kam-diophantine", l2Key: "dynamical-hamiltonian", name: "KAM 定理", kind: "theorem",
        aliases: ["KAM环面", "Diophantine条件", "小分母问题", "非退化条件"],
    },
    // Nekhoroshev 估计与 Arnold 扩散。
    "hamiltonian-nekhoroshev-arnold-diffusion": {
        id: "hamiltonian-nekhoroshev-arnold-diffusion", l2Key: "dynamical-hamiltonian", name: "Nekhoroshev 估计与 Arnold 扩散", kind: "theorem",
        aliases: ["Nekhoroshev估计", "Arnold扩散", "指数长时间稳定", "陡峭性条件"],
    },
    // Poincare-Birkhoff 扭转不动点定理。
    "hamiltonian-poincare-birkhoff-twist": {
        id: "hamiltonian-poincare-birkhoff-twist", l2Key: "dynamical-hamiltonian", name: "Poincare-Birkhoff 扭转定理", kind: "theorem",
        aliases: ["扭转映射", "保面积不动点定理", "周期轨存在性", "环域边界扭转"],
    },
    // 动量映射与辛约化。
    "hamiltonian-moment-map-reduction": {
        id: "hamiltonian-moment-map-reduction", l2Key: "dynamical-hamiltonian", name: "动量映射与辛约化", kind: "object",
        aliases: ["动量映射", "Marsden-Weinstein约化", "余伴随轨道", "对称群作用"],
    },
});

// 每个 L3 的审查规则固定包含八个字段：definitions、formulas、theorems、generalRequirements、
// forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const DYNAMICAL_HAMILTONIAN_L3_RULES: Record<string, MathV2L3Rules> = {
    // 正则方程与辛形式。
    "hamiltonian-canonical-equations-symplectic-form": {
        definitions: ["辛流形 (M, omega) 指 omega 为闭（d omega = 0）且非退化的 2-形式，dim M = 2n。", "Hamilton 向量场 X_H 由 omega(X_H, ·) = dH 唯一确定，其流称为 Hamilton 流。"],
        formulas: ["正则方程 q_i' = partial H / partial p_i，p_i' = - partial H / partial q_i。", "标准辛形式 omega = sum_i dp_i wedge dq_i，矩阵形式 z' = J grad H(z)，J = [[0, I], [-I, 0]]。", "能量守恒 dH/dt = <grad H, J grad H> = 0（J 反对称）。", "辛条件 A^T J A = J 刻画线性正则变换。"],
        theorems: ["Darboux 定理：任意辛流形局部存在坐标使 omega = sum dp_i wedge dq_i，故辛流形无局部不变量，一切局部辛几何是标准的。", "非退化性保证 H 到 X_H 的对应是双射，闭性保证 Hamilton 流保持 omega（L_{X_H} omega = d(omega(X_H, ·)) = d dH = 0，用 Cartan 公式）。", "自治 Hamilton 系统的能量面 H = c 是流不变的；只要 dH 非零，能量面为 (2n-1) 维不变子流形。"],
        generalRequirements: ["必须先固定辛结构再谈 Hamilton 向量场，同一 H 在不同 omega 下给出不同动力学。", "必须区分自治与非自治，非自治时能量不守恒，需在扩展相空间中讨论。", "写正则方程必须保持 p 方程的负号。"],
        forbiddenErrors: ["【符号错位】把 p' 写成 + partial H / partial q，破坏辛结构与能量守恒。", "【闭性遗漏】只要求 omega 非退化就断言流保 omega，实际需 d omega = 0。", "【奇维度设定】在奇数维流形上假设存在辛形式（非退化交替 2-形式要求偶数维）。", "【能量守恒滥用】对显含时间的 H(q, p, t) 断言 H 守恒。", "【度量混淆】把辛形式当作内积用于求梯度流，梯度流与 Hamilton 流方向相差 J。"],
        parameterConstraints: { dimension: "辛流形维数必为偶数 2n。", closedness: "omega 必须闭且非退化。", autonomy: "能量守恒仅对不显含 t 的 H 成立。", darbouxScope: "Darboux 定理是局部结论，不给出整体不变量。" },
        closureChecks: ["检查辛形式的闭性与非退化性是否声明。", "检查正则方程符号是否正确。", "检查能量守恒的自治性前提。", "检查是否区分了局部（Darboux）与整体性质。"],
        scenarioChecks: { harmonicOscillator: ["写出 H = (p^2 + omega_0^2 q^2)/2", "由正则方程得线性流", "能量面为椭圆"], symplecticCheck: ["计算变换的 Jacobi 矩阵 A", "验证 A^T J A = J", "确认保 omega"], darbouxUse: ["确认局部性", "取 Darboux 坐标化简", "不据此推断整体结论"] },
    },
    // Poisson 括号结构。
    "hamiltonian-poisson-bracket-structure": {
        definitions: ["Poisson 括号是函数空间上的双线性反对称运算，满足 Jacobi 恒等式与 Leibniz 法则（对乘法的导子性质）。", "Casimir 函数指与所有函数括号为零的函数，它对任何 Hamilton 量都守恒。"],
        formulas: ["标准括号 {f, g} = sum_i (partial f/partial q_i · partial g/partial p_i - partial f/partial p_i · partial g/partial q_i)。", "辛表述 {f, g} = omega(X_f, X_g)，演化方程 df/dt = {f, H} + partial f/partial t。", "正则关系 {q_i, p_j} = delta_ij，{q_i, q_j} = {p_i, p_j} = 0。", "Jacobi 恒等式 {f, {g, h}} + {g, {h, f}} + {h, {f, g}} = 0。"],
        theorems: ["首次积分判据：f 是守恒量当且仅当 {f, H} = 0（f 不显含 t）；两个守恒量的括号仍是守恒量（Poisson 定理），可用于生成新守恒量。", "Jacobi 恒等式等价于辛形式的闭性，并使 X_{{f,g}} = -[X_f, X_g]（差一符号约定），即 f -> X_f 是 Lie 代数反同态。", "退化 Poisson 结构：Poisson 流形不必是辛流形，非满秩时相空间叶状分解为辛叶，Casimir 函数在每片叶上为常数（如刚体的角动量模长）。"],
        generalRequirements: ["必须给出所用括号的符号约定，并保持全程一致。", "用 Poisson 定理生成新守恒量时必须检查所得函数是否与已有的独立。", "在退化 Poisson 结构上必须区分 Casimir 与一般守恒量。"],
        forbiddenErrors: ["【反对称违背】写出 {f, g} = {g, f} 或忽略符号导致守恒量判据出错。", "【Jacobi 未验】自造括号却不验证 Jacobi 恒等式，得到的不是 Poisson 结构。", "【独立性缺失】用 Poisson 定理反复生成函数并声称守恒量个数无限增长，实际新函数可能与旧的函数相关。", "【退化混同】把任意 Poisson 流形当作辛流形，忽略辛叶结构与 Casimir。", "【显含时间遗漏】f 显含 t 时仍用 {f, H} = 0 判定守恒。"],
        parameterConstraints: { antisymmetry: "括号必须双线性反对称。", jacobi: "必须满足 Jacobi 恒等式与 Leibniz 法则。", conservation: "守恒判据 {f, H} = 0 要求 f 不显含 t。", degeneracy: "秩不满时存在非常数 Casimir，动力学限制在辛叶上。" },
        closureChecks: ["检查括号定义与符号约定。", "检查 Jacobi 恒等式与反对称性。", "检查守恒量判据的时间无关性前提。", "检查退化结构下的辛叶与 Casimir 讨论。"],
        scenarioChecks: { conservedQuantity: ["计算 {f, H}", "为零则守恒", "必要时用 Poisson 定理生成新积分"], canonicalRelations: ["验证 {q_i, p_j} = delta_ij", "确认变换保括号", "等价于保辛"], rigidBodyCase: ["用 so(3)* 上的 Poisson 结构", "Casimir 为角动量模长", "动力学在球面辛叶上"] },
    },
    // 相体积守恒定理。
    "hamiltonian-liouville-phase-volume": {
        definitions: ["相体积指辛体积形式 omega^n / n!（局部为 dq_1 ... dq_n dp_1 ... dp_n）给出的测度。", "Poincare 积分不变量指 omega 及其外幂在 Hamilton 流下的不变性。"],
        formulas: ["散度为零 div(J grad H) = sum_i (partial^2 H / partial q_i partial p_i - partial^2 H / partial p_i partial q_i) = 0。", "体积守恒 vol(phi_t(A)) = vol(A)，其中 phi_t 为 Hamilton 流。", "更强的形式 (phi_t)^* omega = omega，故 omega^k 对一切 k <= n 都不变。"],
        theorems: ["相体积守恒（Liouville）：Hamilton 流保持相空间体积；证明用 J grad H 的散度为零，或由 L_{X_H} omega = 0 得 L_{X_H} omega^n = 0。", "结构性推论：Hamilton 系统不存在渐近稳定的平衡点或吸引子，也不存在负散度导致的体积收缩，因此耗散系统的极限集图像不可搬用。", "与复现的联系：紧能量面上体积有限的不变测度使 Poincare 复现定理适用，几乎所有点在有限时间内回到任意小邻域。"],
        generalRequirements: ["必须区分体积守恒与更强的辛形式守恒，后者蕴含前者但反之不成立（n >= 2）。", "谈复现必须先说明能量面紧或测度有限。", "不得引入耗散项后仍断言体积守恒。"],
        forbiddenErrors: ["【吸引子虚构】在 Hamilton 系统中断言存在渐近稳定平衡或吸引子。", "【守恒强度混同】由体积守恒反推保辛（高维不成立，保体积映射类远大于辛映射类）。", "【耗散混入】给系统加摩擦项后仍套用相体积守恒。", "【复现条件遗漏】在非紧能量面且测度无限时使用 Poincare 复现。", "【维数误用】用 n = 1 的等价性（保面积等价保辛）推广到高维。"],
        parameterConstraints: { flowSmoothness: "H 需足够光滑以保证流存在且可微。", volumeForm: "体积形式取 omega^n / n!。", strengthOrder: "保辛蕴含保体积；n >= 2 时反向不成立。", recurrence: "复现需有限不变测度（例如紧能量面）。" },
        closureChecks: ["检查是否给出体积或辛形式不变的推导。", "检查是否排除了吸引子式结论。", "检查保体积与保辛的蕴含方向。", "检查复现结论的紧性或有限测度前提。"],
        scenarioChecks: { divergenceCheck: ["写出向量场 J grad H", "计算散度为零", "得体积守恒"], attractorRuleOut: ["指出体积守恒", "排除渐近稳定与体积收缩", "改用中心、环面等中性图像"], recurrenceUse: ["确认能量面紧", "不变测度有限", "应用 Poincare 复现"] },
    },
    // 对称性与守恒量定理。
    "hamiltonian-noether-symmetry-conservation": {
        definitions: ["单参数对称群指保持 H 的辛微分同胚族 psi_s，其生成向量场为某个函数 F 的 Hamilton 向量场。", "首次积分指沿流为常数的函数。"],
        formulas: ["守恒关系 {F, H} = 0 当且仅当 F 沿 H 的流守恒且 H 沿 F 的流不变（互反性）。", "平移对称给出动量守恒 F = p；旋转对称给出角动量守恒 F = q_1 p_2 - q_2 p_1。", "Lagrange 形式的 Noether 恒等式：若 L 在 q -> q + s X(q) 下不变，则 sum_i (partial L / partial q_i') X_i 守恒。"],
        theorems: ["Noether 定理（Hamilton 形式）：连续辛对称群与守恒量一一对应；对称性生成元 F 守恒，反之每个守恒量 F 生成保持 H 的单参数辛群。", "互反性：{F, H} = 0 是对称与守恒的同一条件，故守恒量与对称性在 Hamilton 框架下是同一事物的两种读法。", "适用边界：Noether 定理要求对称是连续的，离散对称（如时间反演、空间反射）不给出守恒量；耗散或含非完整约束时结论失效。"],
        generalRequirements: ["必须写出对称群的生成元并验证其保持 H。", "必须区分连续对称与离散对称。", "多守恒量时必须检查独立性与是否两两对合。"],
        forbiddenErrors: ["【离散对称误用】由反射或时间反演对称推出守恒量。", "【不变性未验】只声称系统有对称性而不验证 {F, H} = 0 或 L 的不变性。", "【辛性遗漏】用不保辛的变换群套用 Noether 定理。", "【独立性缺失】把相关的守恒量重复计数以宣称可积。", "【耗散越界】对含摩擦的系统使用 Noether 定理。"],
        parameterConstraints: { continuity: "对称必须是单参数连续群。", symplecticity: "对称变换需保辛（或 Lagrange 情形保作用量）。", invariance: "需验证 H（或 L）在群作用下不变。", independence: "多守恒量需检查函数独立性。" },
        closureChecks: ["检查对称群的生成元与不变性验证。", "检查连续性与保辛性。", "检查守恒量与对称的对应是否双向陈述。", "检查守恒量之间的独立性。"],
        scenarioChecks: { translationSymmetry: ["确认 H 不依赖某坐标", "该共轭动量为守恒量", "写出对应的对称群"], rotationSymmetry: ["验证 H 在旋转下不变", "角动量守恒", "检查生成元的 Hamilton 向量场"], symmetryFailure: ["识别离散或耗散情形", "指出 Noether 不适用", "改用其他不变量分析"] },
    },
    // Arnold-Liouville 定理与作用角变量。
    "hamiltonian-arnold-liouville-integrability": {
        definitions: ["2n 维 Hamilton 系统称 Liouville 可积，指存在 n 个函数独立且两两对合（{F_i, F_j} = 0）的首次积分，其中一个可取为 H。", "作用角变量 (I, theta) 指使 H 只依赖 I 的正则坐标，theta 为环面角坐标。"],
        formulas: ["水平集 M_c = {F_1 = c_1, ..., F_n = c_n} 在紧连通与正则情形微分同胚于 T^n。", "作用变量 I_k = (1/(2 pi)) oint_{gamma_k} sum_i p_i dq_i，gamma_k 为 T^n 的一组基本环。", "可积流 I' = 0，theta' = partial H / partial I = frequency(I)，故 theta(t) = theta(0) + omega(I) t。"],
        theorems: ["Arnold-Liouville 定理：若 n 个对合首次积分在正则值处独立且水平集紧连通，则该水平集是不变 Lagrange 环面，邻域内存在作用角变量使运动为环面上的准周期直线流。", "共振与稠密性：轨道在环面上稠密当且仅当频率向量 omega(I) 有理无关；共振时轨道落在低维子环面上。", "可积性的稀有性：Liouville 可积是极强的限制，一般 Hamilton 系统不可积（Poincare 关于三体问题的不可积性结论），也不得由存在若干守恒量就断言可积。"],
        generalRequirements: ["必须验证首次积分的个数、独立性与对合性三项，缺一不可。", "必须检查水平集的紧性与连通性，非紧时环面结论失效。", "使用作用角变量必须说明其只在正则值邻域局部存在。"],
        forbiddenErrors: ["【对合性遗漏】只数守恒量个数而不验证两两 Poisson 括号为零。", "【独立性缺失】把函数相关的积分重复计数达到 n 个。", "【紧性忽略】在非紧水平集上断言微分同胚于 T^n（可能是柱面 T^k x R^{n-k}）。", "【全局化越界】把局部作用角坐标当作整体坐标，忽略奇异纤维与单值性障碍（Duistermaat 单值性）。", "【稠密性误判】不检查频率有理无关就断言轨道在环面上稠密。"],
        parameterConstraints: { integralCount: "需恰好 n = dim M / 2 个首次积分。", involution: "积分两两对合 {F_i, F_j} = 0。", regularity: "在正则值处 dF_1, ..., dF_n 线性无关。", compactness: "环面结论要求水平集紧且连通。" },
        closureChecks: ["检查积分个数、独立性与对合性。", "检查水平集的紧性与连通性。", "检查作用变量的环路积分定义与所取基本环。", "检查频率的有理无关性判断。"],
        scenarioChecks: { integrabilityCheck: ["列出候选首次积分", "验证对合与独立", "确认个数达到 n"], actionAngleConstruction: ["取环面基本环", "计算作用积分 I_k", "由 H(I) 得频率"], resonanceAnalysis: ["计算频率向量", "检验有理无关性", "共振时定位低维子环面"] },
    },
    // 正则变换与 Hamilton-Jacobi 方程。
    "hamiltonian-canonical-transformation-jacobi": {
        definitions: ["正则变换指保持辛形式的坐标变换，等价地保持 Poisson 括号与正则方程形式。", "生成函数指由旧新变量混合表示的函数，其偏导给出变换关系。"],
        formulas: ["第二类生成函数 S(q, P, t)：p = partial S / partial q，Q = partial S / partial P，新 Hamilton 量 K = H + partial S / partial t。", "Hamilton-Jacobi 方程 H(q, partial S / partial q, t) + partial S / partial t = 0；自治时取 S = W(q) - E t 得 H(q, partial W / partial q) = E。", "分离变量 W = sum_i W_i(q_i)，可积时 W 依赖 n 个分离常数并给出作用变量。"],
        theorems: ["Hamilton-Jacobi 方法：若能求得含 n 个独立常数的完全解 S，则系统可积并由 S 生成到作用角型变量的正则变换，动力学化为平凡的直线运动。", "正则性判据：变换保辛当且仅当 Jacobi 矩阵满足 A^T J A = J，当且仅当保持基本 Poisson 括号 {Q_i, P_j} = delta_ij；由生成函数构造的变换自动保辛。", "特征与波前关系：Hamilton-Jacobi 是一阶非线性 PDE，其特征方程恰是正则方程，故解的存在性受特征交叉与焦散限制，完全解一般只局部存在。"],
        generalRequirements: ["必须指明生成函数的类型与自变量组合，混用会导致关系式错误。", "非自治时必须保留 partial S / partial t 项。", "使用完全解必须说明所含常数的独立性与解的局部性。"],
        forbiddenErrors: ["【时间项丢失】非自治情形写 K = H，漏掉 partial S / partial t。", "【生成函数类型混用】把 S(q, P) 的关系式用于 F_1(q, Q) 型生成函数。", "【完全解与通解混淆】把含任意函数的通解与含 n 个常数的完全解等同。", "【保辛未验】自造坐标变换未验证 A^T J A = J 就称正则。", "【全局解假设】忽略焦散与特征交叉，断言完全解整体存在。"],
        parameterConstraints: { symplecticity: "变换需满足 A^T J A = J。", generatorType: "生成函数须按类型匹配自变量（q,Q / q,P / p,Q / p,P）。", timeDependence: "显含时间时新 Hamilton 量需加 partial S / partial t。", completeSolution: "完全解需含 n 个独立分离常数。" },
        closureChecks: ["检查生成函数类型与导出关系式一致。", "检查保辛条件或基本括号。", "检查时间依赖项处理。", "检查完全解的常数个数与局部性说明。"],
        scenarioChecks: { generatorUse: ["选定生成函数类型", "由偏导写出变换", "确认新 Hamilton 量"], separationOfVariables: ["尝试 W = sum W_i(q_i)", "得到分离常数", "由此构造作用变量"], canonicityTest: ["计算 Jacobi 矩阵", "验证 A^T J A = J", "或验证 {Q_i, P_j} = delta_ij"] },
    },
    // KAM 定理与小分母条件。
    "hamiltonian-kam-diophantine": {
        definitions: ["近可积系统指 H = H_0(I) + eps H_1(I, theta) 形式，eps 为小参数。", "Diophantine 条件指频率向量对整数向量的共振被定量排除。"],
        formulas: ["Diophantine 条件 |<k, omega>| >= gamma / |k|^tau 对一切非零整数向量 k 成立，tau > n - 1。", "Kolmogorov 非退化 det(partial^2 H_0 / partial I^2) 非零；Arnold 等时非退化允许 H_0 退化但要求频率映射满足更弱条件。", "小分母出现在形式解的系数 (H_1)_k / (i <k, omega>) 中，共振时分母为零。", "存活环面的测度补 O(sqrt(eps))。"],
        theorems: ["KAM 定理：H_0 非退化解析（或足够光滑）时，对充分小 eps，满足 Diophantine 条件的不变环面在扰动下形变存活，且这些环面在相空间中占正测度，其补集测度随 eps -> 0 趋于零。", "结论强度：存活的环面集是 Cantor 型（无内点），故 KAM 不给出开集上的稳定性；共振区（Birkhoff 区）内可出现随机层与混沌。", "维数依赖：n = 2 时环面把三维能量面分割，作用变量被永久限制（拓扑困禁）；n >= 3 时环面不再分割能量面，作用变量可长程漂移。"],
        generalRequirements: ["必须写出并检验非退化条件与 Diophantine 条件。", "必须说明 eps 的小性是定理成立的前提，不得对有限大扰动引用。", "必须指出存活环面集无内点，不能推出对所有初值的稳定性。"],
        forbiddenErrors: ["【条件省略】不验证 Kolmogorov 非退化就套用 KAM。", "【共振忽略】对有理无关性不作定量要求，仅说频率无理（无理不足以控制小分母）。", "【稳定性夸大】由 KAM 推出所有轨道长期稳定，忽略 Cantor 集无内点与共振区混沌。", "【维数误推】把 n = 2 的拓扑困禁结论搬到 n >= 3。", "【光滑性不足】在低光滑度（远低于定理要求）下引用 KAM。"],
        parameterConstraints: { perturbation: "eps 需充分小，阈值依赖 gamma、tau 与光滑度。", nondegeneracy: "需 Kolmogorov 或 Arnold 型非退化条件。", diophantine: "频率满足 |<k, omega>| >= gamma / |k|^tau，tau > n - 1。", regularity: "H 需解析或足够高阶光滑。" },
        closureChecks: ["检查非退化条件的具体计算。", "检查 Diophantine 条件的定量形式。", "检查对 eps 小性的依赖是否声明。", "检查结论范围是否限制在正测度 Cantor 集上。"],
        scenarioChecks: { kamApplication: ["写成近可积形式", "验证非退化", "对 Diophantine 频率断言环面存活"], resonanceZone: ["定位共振 <k, omega> = 0", "分析共振区宽度", "指出可能的随机层"], dimensionEffect: ["区分 n = 2 与 n >= 3", "判断环面是否分割能量面", "据此讨论作用变量漂移"] },
    },
    // Nekhoroshev 估计与 Arnold 扩散。
    "hamiltonian-nekhoroshev-arnold-diffusion": {
        definitions: ["Nekhoroshev 估计给出近可积系统作用变量在指数长时间内的有界漂移。", "Arnold 扩散指沿共振网的作用变量长程缓慢输运。"],
        formulas: ["Nekhoroshev 界 |I(t) - I(0)| <= C eps^b 对 |t| <= T_0 exp(c / eps^a)，指数 a、b 依赖维数与陡峭性指标。", "陡峭性（steepness）条件是对 H_0 的定量非退化要求，凸性与准凸性是其特例。", "扩散时间尺度远长于 KAM 环面的存活尺度，扩散速度上界随 eps 指数小。"],
        theorems: ["Nekhoroshev 定理：H_0 陡峭（例如凸或准凸）且 H 解析时，所有初值的作用变量在指数长时间内改变量为 eps 的幂次小量；这补足了 KAM 只覆盖正测度初值的缺口。", "Arnold 扩散：在共振区内可构造轨道使作用变量发生 O(1) 的漂移（Arnold 的例子及后续 Mather、Cheng-Yan 等一般性结果），故长期稳定性只是时间受限的稳定性而非永久稳定。", "两者关系：KAM 给出无穷时间但正测度初值的稳定；Nekhoroshev 给出全部初值但有限（指数长）时间的稳定；Arnold 扩散说明该时间限制是本质的。"],
        generalRequirements: ["必须区分 KAM 型稳定与 Nekhoroshev 型稳定的量词结构（初值范围与时间范围）。", "必须写出陡峭性或凸性假设。", "谈扩散必须说明其速度受指数小上界控制。"],
        forbiddenErrors: ["【永久稳定误断】把 Nekhoroshev 的指数长时间稳定当作无穷时间稳定。", "【假设遗漏】在非陡峭（如线性或退化）H_0 上引用 Nekhoroshev。", "【量词混淆】声称 KAM 覆盖所有初值或 Nekhoroshev 覆盖无限时间。", "【扩散速率夸大】断言 Arnold 扩散在多项式时间内完成 O(1) 漂移。", "【解析性忽视】在仅有限光滑的情形直接使用解析版本的指数估计。"],
        parameterConstraints: { steepness: "H_0 需满足陡峭性（凸、准凸为特例）。", analyticity: "指数型时间界通常要求解析性。", exponents: "指数 a、b 依赖自由度与陡峭性指标。", diffusionRate: "扩散速度受 eps 指数小上界限制。" },
        closureChecks: ["检查陡峭性或凸性验证。", "检查时间界与漂移界的量化形式。", "检查与 KAM 结论的量词区分。", "检查扩散速率的上界陈述。"],
        scenarioChecks: { stabilityEstimate: ["确认 H_0 凸或准凸", "给出 eps 的幂次漂移界", "配以指数长时间界"], diffusionConstruction: ["定位共振网", "沿共振链构造转移轨道", "说明所需时间为指数长"], comparisonWithKam: ["列出两定理的初值与时间量词", "指出互补关系", "避免任一方向的夸大"] },
    },
    // Poincare-Birkhoff 扭转定理。
    "hamiltonian-poincare-birkhoff-twist": {
        definitions: ["环域 A = S^1 x [a, b] 上的映射 f 称扭转映射，指它保持两条边界圆并把它们向相反方向旋转。", "保面积指 f 保持环域上的 Lebesgue 面积。"],
        formulas: ["扭转条件：提升 F(x, r) = (x + g(x, r), h(x, r)) 满足 g(x, a) < 0 < g(x, b)（边界反向旋转）。", "单调扭转 partial g / partial r > 0 用于 Aubry-Mather 理论。", "旋转数 rho = lim (x_n - x_0) / n 用于标记周期轨与不变集。"],
        theorems: ["Poincare-Birkhoff 定理：环域上保面积、保定向且边界反向扭转的同胚至少有两个不动点；对 f^q 应用可得对每个有理旋转数 p/q（介于两边界旋转数之间）都存在周期轨。", "与 Hamilton 系统的联系：二自由度系统的 Poincare 回归映射是保面积的，故共振环面破裂后仍留下由该定理保证的周期轨（Poincare-Birkhoff 链），构成岛链与随机层的骨架。", "Aubry-Mather 理论：单调扭转映射对每个无理旋转数存在不变的 Cantor 型极小集（Mather 集），它们是 KAM 环面破裂后的残骸。"],
        generalRequirements: ["必须验证保面积、保定向与边界反向扭转三项假设。", "求特定旋转数的周期轨必须先对 f^q 化归再计数不动点。", "结论是存在性而非唯一性，不得推断轨道稳定性。"],
        forbiddenErrors: ["【面积假设遗漏】对耗散（不保面积）映射引用该定理。", "【扭转方向错】两边界同向旋转仍称满足扭转条件。", "【不动点计数错】只断言存在一个不动点（定理给出至少两个）。", "【稳定性附加】由周期轨存在直接断言其为椭圆型或稳定。", "【旋转数越界】对不落在两边界旋转数之间的 p/q 断言周期轨存在。"],
        parameterConstraints: { areaPreserving: "f 需保面积、保定向、边界不变。", twistCondition: "两边界旋转方向相反。", rotationRange: "有理旋转数需介于两边界旋转数之间。", monotoneTwist: "Aubry-Mather 结论要求单调扭转。" },
        closureChecks: ["检查保面积与保定向。", "检查边界扭转方向。", "检查旋转数是否落在允许区间。", "检查结论只作存在性陈述。"],
        scenarioChecks: { fixedPointExistence: ["验证三项假设", "断言至少两个不动点", "不附加稳定性"], periodicOrbitByRotation: ["选定 p/q 在扭转区间内", "对 f^q 应用定理", "得到该旋转数的周期轨"], islandChainPicture: ["共振环面破裂", "由定理得椭圆与双曲周期点交替", "形成岛链与随机层"] },
    },
    // 动量映射与辛约化。
    "hamiltonian-moment-map-reduction": {
        definitions: ["设 Lie 群 G 以 Hamilton 方式作用在 (M, omega) 上，动量映射 mu: M -> g^* 满足对每个 xi 属于 g 有 d<mu, xi> = omega(X_xi, ·)。", "辛约化指在动量水平集上除去群方向得到低维辛流形。"],
        formulas: ["约化空间 M_c = mu^{-1}(c) / G_c，dim M_c = dim M - dim G - dim G_c（自由正规作用时 = dim M - 2 dim G 当 c 为正则值且 G 交换）。", "等变性 mu(g · x) = Ad^*_g mu(x)。", "刚体例子：G = SO(3)，mu 为角动量，约化后得到余伴随轨道上的 Euler 方程。"],
        theorems: ["Marsden-Weinstein 约化定理：c 为 mu 的正则值且 G_c 在 mu^{-1}(c) 上自由正规作用时，M_c = mu^{-1}(c) / G_c 是辛流形，且 G-不变 Hamilton 量下降为 M_c 上的 Hamilton 量，动力学随之下降。", "守恒与约化的统一：动量映射的各分量是守恒量（Noether），约化即用守恒量固定水平集并商去对称，故对称性同时降低维数两次（一次约束、一次商）。", "奇异约化：作用非自由时约化空间是分层辛空间而非流形，各层对应不同稳定子群类型，需用奇异约化理论处理。"],
        generalRequirements: ["必须验证作用是 Hamilton 的且动量映射等变。", "必须检查 c 的正则性与作用的自由正规性，否则只得分层空间。", "必须说明维数下降的计数方式。"],
        forbiddenErrors: ["【等变性缺失】未验证 mu 的等变性就在 g^* 上作商。", "【自由性忽略】在有非平凡稳定子的点上断言约化空间为光滑辛流形。", "【维数算错】把维数下降写成只减去 dim G 一次。", "【正则值省略】在临界值处套用 Marsden-Weinstein 定理。", "【辛性丢失】称约化空间只是 Poisson 流形而不指出正则情形下它是辛流形（或反之混淆两种情形）。"],
        parameterConstraints: { hamiltonianAction: "群作用需保辛且存在动量映射。", equivariance: "mu 需 Ad^*-等变。", regularValue: "c 为 mu 的正则值。", freeness: "G_c 在 mu^{-1}(c) 上自由正规作用，否则为奇异约化。" },
        closureChecks: ["检查动量映射的定义式与等变性。", "检查正则值与自由性条件。", "检查约化后维数与辛结构。", "检查下降后 Hamilton 量与动力学的对应。"],
        scenarioChecks: { momentMapComputation: ["写出生成元的 Hamilton 函数", "组装为 g^* 值映射", "验证等变性"], reductionUse: ["取正则值水平集", "商去 G_c", "得到低维辛流形与下降动力学"], rigidBodyReduction: ["G = SO(3)，mu 为角动量", "约化到余伴随轨道", "得到 Euler 方程"] },
    },
};
