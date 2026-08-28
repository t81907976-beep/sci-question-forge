import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“几何-微分几何”下的原子 L3 知识项。
// 本分支统一采用局部微分几何语言：曲线用弧长参数与 Frenet 标架，曲面用两个基本形式与形算子，
// 内蕴几何用度量、Levi-Civita 联络与曲率张量。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const GEOMETRY_DIFFERENTIAL_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Frenet-Serret 公式：弧长参数下标架的导数方程。
    "frenet-serret-formulas": {
        id: "frenet-serret-formulas", l2Key: "geometry-differential", name: "Frenet-Serret 公式", kind: "formula",
        aliases: ["Frenet公式", "Frenet-Serret公式", "Frenet标架", "Frenet-Serret formulas"],
    },
    // 空间曲线曲率与挠率的一般参数计算公式。
    "curvature-torsion-formulas": {
        id: "curvature-torsion-formulas", l2Key: "geometry-differential", name: "空间曲线的曲率与挠率公式", kind: "formula",
        aliases: ["空间曲线曲率公式", "挠率公式", "curvature formula", "torsion formula", "曲线论基本定理"],
    },
    // 平面曲线曲率与密切圆。
    "plane-curve-curvature-osculating-circle": {
        id: "plane-curve-curvature-osculating-circle", l2Key: "geometry-differential", name: "平面曲线曲率与密切圆", kind: "formula",
        aliases: ["平面曲线曲率", "曲率半径", "密切圆", "曲率圆", "osculating circle"],
    },
    // 第一基本形式：曲面的内蕴度量。
    "first-fundamental-form": {
        id: "first-fundamental-form", l2Key: "geometry-differential", name: "第一基本形式", kind: "object",
        aliases: ["第一基本形式", "first fundamental form", "第一基本量"],
    },
    // 第二基本形式与形算子（Weingarten 映射）。
    "second-fundamental-form-shape-operator": {
        id: "second-fundamental-form-shape-operator", l2Key: "geometry-differential", name: "第二基本形式与形算子", kind: "object",
        aliases: ["第二基本形式", "second fundamental form", "第二基本量", "形算子", "shape operator", "Weingarten映射"],
    },
    // 主曲率、主方向与 Euler 公式。
    "principal-curvature-euler-formula": {
        id: "principal-curvature-euler-formula", l2Key: "geometry-differential", name: "主曲率、主方向与 Euler 公式", kind: "theorem",
        aliases: ["主曲率", "主方向", "principal curvature", "principal direction", "Euler公式法曲率"],
    },
    // Gauss 曲率与平均曲率公式。
    "gauss-mean-curvature-formula": {
        id: "gauss-mean-curvature-formula", l2Key: "geometry-differential", name: "Gauss 曲率与平均曲率公式", kind: "formula",
        aliases: ["Gauss曲率", "高斯曲率", "Gaussian curvature", "平均曲率", "mean curvature"],
    },
    // Gauss 绝妙定理：Gauss 曲率的内蕴性。
    "gauss-theorema-egregium": {
        id: "gauss-theorema-egregium", l2Key: "geometry-differential", name: "Gauss 绝妙定理", kind: "theorem",
        aliases: ["Gauss绝妙定理", "绝妙定理", "theorema egregium", "Gauss曲率内蕴性"],
    },
    // Gauss-Codazzi 方程与曲面论基本定理。
    "gauss-codazzi-equations": {
        id: "gauss-codazzi-equations", l2Key: "geometry-differential", name: "Gauss-Codazzi 方程", kind: "theorem",
        aliases: ["Gauss-Codazzi方程", "Codazzi-Mainardi方程", "Codazzi equations", "曲面论基本定理"],
    },
    // 测地线方程与测地曲率。
    "geodesic-equation-curvature": {
        id: "geodesic-equation-curvature", l2Key: "geometry-differential", name: "测地线方程与测地曲率", kind: "theorem",
        aliases: ["测地线", "测地线方程", "测地曲率", "geodesic equation", "geodesic curvature"],
    },
    // Gauss-Bonnet 定理。
    "gauss-bonnet-theorem": {
        id: "gauss-bonnet-theorem", l2Key: "geometry-differential", name: "Gauss-Bonnet 定理", kind: "theorem",
        aliases: ["Gauss-Bonnet定理", "高斯-博内定理", "Gauss-Bonnet theorem"],
    },
    // 极小曲面与极小曲面方程。
    "minimal-surface-equation": {
        id: "minimal-surface-equation", l2Key: "geometry-differential", name: "极小曲面与极小曲面方程", kind: "criterion",
        aliases: ["极小曲面", "minimal surface", "极小曲面方程", "平均曲率为零"],
    },
    // Levi-Civita 联络与 Christoffel 符号。
    "levi-civita-connection-christoffel": {
        id: "levi-civita-connection-christoffel", l2Key: "geometry-differential", name: "Levi-Civita 联络与 Christoffel 符号", kind: "object",
        aliases: ["Levi-Civita联络", "Levi-Civita connection", "Christoffel符号", "Christoffel symbols"],
    },
    // Riemann 曲率张量与截面曲率。
    "riemann-curvature-sectional": {
        id: "riemann-curvature-sectional", l2Key: "geometry-differential", name: "Riemann 曲率张量与截面曲率", kind: "object",
        aliases: ["Riemann曲率张量", "曲率张量", "Riemann curvature tensor", "截面曲率", "sectional curvature"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const GEOMETRY_DIFFERENTIAL_L3_RULES: Record<string, MathV2L3Rules> = {
    // Frenet-Serret 公式：弧长参数下的标架导数方程。
    "frenet-serret-formulas": {
        definitions: ["Frenet-Serret 公式研究空间曲线沿自身的正交活动标架 (T, N, B)（切向量、主法向量、副法向量）在弧长参数下的导数方程，把曲线的局部形状完全编码为曲率与挠率两个函数。"],
        formulas: ["标架：T = dr/ds，N = (dT/ds)/|dT/ds|（要求 κ ≠ 0），B = T × N；(T, N, B) 为右手正交标架。", "Frenet-Serret 公式：dT/ds = κ N，dN/ds = -κ T + τ B，dB/ds = -τ N。", "矩阵形式：d(T,N,B)/ds = (T,N,B) · A，A 为反对称矩阵 [[0,-κ,0],[κ,0,-τ],[0,τ,0]]。", "密切平面 = span(T, N)，法平面 = span(N, B)，从切平面 = span(T, B)。"],
        theorems: ["Frenet 标架仅在 κ ≠ 0 的点有定义（否则主法向量不唯一）；反对称性保证标架保持正交。", "曲线论基本定理：给定 κ(s) > 0 与 τ(s)（连续），存在唯一（至刚体运动）弧长参数曲线以其为曲率与挠率。", "特征刻画：κ ≡ 0 ⇔ 直线；κ > 0 常数且 τ ≡ 0 ⇔ 圆；τ ≡ 0（κ > 0）⇔ 平面曲线；κ/τ 为常数 ⇔ 一般螺线。"],
        generalRequirements: ["必须使用弧长参数（或先说明如何由一般参数换算），否则公式中的导数需乘以 |r'|。", "必须验证 κ ≠ 0 才能定义 N、B 与使用完整的三条公式。"],
        forbiddenErrors: ["【非弧长参数直接代入】用一般参数 t 的导数直接写 dT/dt = κN。", "【符号错误】把 dN/ds 写成 κT + τB 或把 dB/ds 写成 +τN。", "【κ = 0 处仍用标架】在拐点（κ = 0）处断言 N、B 存在。", "【左手标架】用 B = N × T 破坏右手定向。", "【平面曲线判据错误】用 κ ≡ 常数而非 τ ≡ 0 判定平面曲线。"],
        parameterConstraints: { arcLengthParameter: "公式在弧长参数 s 下成立。", nonzeroCurvature: "κ > 0 才可定义 N、B。", rightHandedFrame: "B = T × N，(T,N,B) 右手正交。" },
        closureChecks: ["把参数化为弧长（或写出 |r'| 因子）。", "验证 κ > 0 并写出 T、N、B。", "代入三条 Frenet 公式核对符号与正交性。"],
        scenarioChecks: { helixExample: ["圆柱螺线 κ、τ 均为正常数，是标准算例。"], planarCriterion: ["判定曲线是否平面时检验 τ ≡ 0。"], rigidityUse: ["由曲率挠率相同推曲线合同（曲线论基本定理）。"] },
    },
    // 空间曲线曲率与挠率的一般参数公式。
    "curvature-torsion-formulas": {
        definitions: ["本条给出任意正则参数下空间曲线的曲率与挠率计算公式，避免先化为弧长参数，并说明二者对曲线形状的完全刻画作用。"],
        formulas: ["一般参数 r(t)（r' ≠ 0）：κ = |r' × r''| / |r'|^3。", "挠率：τ = ((r' × r'') · r''') / |r' × r''|^2（要求 r' × r'' ≠ 0，即 κ ≠ 0）。", "弧长参数下：κ = |r''(s)|，τ = (r'(s) × r''(s)) · r'''(s) / κ^2。", "弧长换算：s(t) = ∫ |r'(t)| dt，d/ds = (1/|r'|) d/dt。"],
        theorems: ["κ ≥ 0 恒成立（按定义取模），而 τ 有符号，符号反映曲线相对密切平面的扭转方向。", "曲线论基本定理：κ(s) > 0 与 τ(s) 在刚体运动意义下唯一确定曲线；镜面反射会改变 τ 的符号。", "退化刻画：κ ≡ 0 的点集上曲线为直线段；κ > 0 且 τ ≡ 0 ⇔ 曲线落在一个平面内。"],
        generalRequirements: ["必须先验证正则性 r'(t) ≠ 0；挠率公式还需 κ ≠ 0。", "使用一般参数公式时不得省略 |r'|^3 与 |r'×r''|^2 的分母。"],
        forbiddenErrors: ["【分母幂次错误】把 κ 写成 |r'×r''|/|r'|^2 或 |r'×r''|/|r'|。", "【挠率分母错误】把 τ 的分母写成 |r'×r''| 或 |r'|^6 型错误。", "【曲率取负】给出负曲率（空间曲线曲率按定义非负）。", "【κ = 0 处求挠率】在 κ = 0 的点计算 τ。", "【混合积顺序错误】把 τ 的分子写成 (r'' × r''') · r'。"],
        parameterConstraints: { regularCurve: "r'(t) ≠ 0（正则）。", nonzeroCurvatureForTorsion: "挠率要求 r' × r'' ≠ 0。", nonnegativeCurvature: "κ ≥ 0。" },
        closureChecks: ["验证正则性并计算 r'、r''、r'''。", "代入 κ、τ 公式并核对分母幂次。", "对已知曲线（直线、圆、螺线）验证特例结果。"],
        scenarioChecks: { helixConstants: ["螺线 r = (a cos t, a sin t, bt)：κ = a/(a^2+b^2)，τ = b/(a^2+b^2)。"], planeCurveInSpace: ["空间曲线落在平面内 ⇔ τ ≡ 0，可用混合积恒为零验证。"], reparametrization: ["需要弧长量时先算 s(t) = ∫|r'|dt 再换算导数。"] },
    },
    // 平面曲线曲率与密切圆。
    "plane-curve-curvature-osculating-circle": {
        definitions: ["本条研究平面曲线的（带符号）曲率、曲率半径与密切圆：密切圆是在给定点与曲线二阶相切的圆，其半径为曲率半径、圆心为曲率中心。"],
        formulas: ["参数形式：κ = (x'y'' - y'x'') / ((x'^2+y'^2)^{3/2})（带符号）；取绝对值得无符号曲率。", "函数图像 y = f(x)：κ = y'' / (1 + y'^2)^{3/2}（带符号），|κ| = |y''|/(1+y'^2)^{3/2}。", "曲率半径 R = 1/|κ|；曲率中心 = r + (1/κ) N（N 为单位法向量，与符号约定一致）。", "极坐标 ρ = ρ(θ)：κ = (ρ^2 + 2ρ'^2 - ρρ'') / (ρ^2 + ρ'^2)^{3/2}。", "渐屈线（evolute）：曲率中心的轨迹。"],
        theorems: ["密切圆与曲线在该点二阶相切（位置、切向、曲率一致），是所有与曲线相切的圆中逼近最好的。", "带符号曲率的符号依赖曲线定向与法向量选取，反向参数化会改变符号；|κ| 与定向无关。", "κ ≡ 0 ⇔ 直线；|κ| 为正常数 ⇔ 圆（半径 1/|κ|），这刻画了平面曲线的刚性。"],
        generalRequirements: ["必须声明定向与法向量约定后才能谈曲率的符号。", "使用公式前必须验证正则性（x'^2+y'^2 ≠ 0）。"],
        forbiddenErrors: ["【幂次错误】把分母写成 (1+y'^2)^{1/2} 或 (1+y'^2)^{2}。", "【符号约定混乱】在同一题中混用带符号与不带符号的曲率。", "【曲率中心方向错误】把曲率中心取在法向量的反方向（凸向错误）。", "【拐点处密切圆】在 κ = 0 处仍断言存在密切圆（此时曲率半径无限）。", "【极坐标公式错误】漏掉 2ρ'^2 项。"],
        parameterConstraints: { regularity: "参数化正则：x'^2+y'^2 ≠ 0。", orientationConvention: "带符号曲率需固定定向与单位法向量。", nonzeroCurvatureForCircle: "密切圆要求 κ ≠ 0。" },
        closureChecks: ["计算一阶、二阶导数并代入曲率公式。", "核对分母幂次 3/2 与符号约定。", "写出曲率半径与曲率中心，并验证密切圆过该点且二阶相切。"],
        scenarioChecks: { extremalCurvature: ["求曲率最大/最小点时对 κ(t) 求导，注意端点与拐点。"], evoluteInvolute: ["渐屈线与渐伸线问题由曲率中心轨迹给出。"], graphCurvature: ["y = f(x) 型曲线直接用 κ = y''/(1+y'^2)^{3/2}。"] },
    },
    // 第一基本形式：曲面的内蕴度量。
    "first-fundamental-form": {
        definitions: ["第一基本形式研究正则参数曲面上由切向量内积诱导的二次形式，它决定曲面上的弧长、夹角与面积，是曲面内蕴几何（等距不变量）的载体。"],
        formulas: ["参数曲面 r(u,v)，E = r_u · r_u，F = r_u · r_v，G = r_v · r_v；I = E du^2 + 2F du dv + G dv^2。", "正则性：r_u × r_v ≠ 0 ⇔ EG - F^2 > 0（Cauchy-Schwarz 严格不等）。", "弧长：s = ∫ sqrt(E u'^2 + 2F u'v' + G v'^2) dt；夹角 cos θ = (E u_1'u_2' + F(u_1'v_2'+u_2'v_1') + G v_1'v_2')/(sqrt(I_1) sqrt(I_2))。", "面积元：dA = sqrt(EG - F^2) du dv；面积 A = ∫∫ sqrt(EG-F^2) du dv。", "面积元也等于 |r_u × r_v| du dv。"],
        theorems: ["第一基本形式是正定二次形式（E > 0，EG - F^2 > 0），因此给出切平面上的内积。", "等距（保长度）变换保持第一基本形式；反之第一基本形式相同的两个曲面局部等距。", "参数正交 ⇔ F ≡ 0；等温（共形）参数 ⇔ E = G、F = 0，此时 I = λ(du^2+dv^2)。"],
        generalRequirements: ["必须验证参数化正则（r_u × r_v ≠ 0），否则 E、F、G 不给出正定形式。", "必须区分内蕴量（由 E、F、G 决定）与外在量（依赖法向量与第二基本形式）。"],
        forbiddenErrors: ["【正定性遗漏】不检查 EG - F^2 > 0 就使用弧长/面积公式。", "【面积元错误】写成 dA = sqrt(EG) du dv 或 (EG - F^2) du dv（漏根号）。", "【交叉项系数遗漏】把 I 写成 E du^2 + F du dv + G dv^2（漏因子 2）。", "【内蕴外在混淆】声称第一基本形式决定曲面在空间中的形状（还需第二基本形式）。", "【正交参数默认】未验证 F = 0 就按正交参数计算夹角。"],
        parameterConstraints: { regularSurface: "r_u × r_v ≠ 0，即 EG - F^2 > 0。", positiveDefinite: "E > 0、G > 0、EG-F^2 > 0。", smoothness: "参数化至少 C^2（涉及第二基本形式时）。" },
        closureChecks: ["计算 r_u、r_v 与 E、F、G 并验证 EG-F^2 > 0。", "写出所需的弧长、夹角或面积积分。", "如需内蕴结论，确认只用到 E、F、G 及其导数。"],
        scenarioChecks: { surfaceOfRevolution: ["旋转曲面 r = (f(u)cos v, f(u)sin v, g(u))：E = f'^2+g'^2、F = 0、G = f^2。"], isometryCheck: ["判断两曲面是否局部等距时比较可否化为相同的 E、F、G。"], conformalParameter: ["等温参数下 I = λ(du^2+dv^2)，便于处理极小曲面与共形映射。"] },
    },
    // 第二基本形式与形算子。
    "second-fundamental-form-shape-operator": {
        definitions: ["第二基本形式研究曲面沿法方向的弯曲程度，它由法向量的变化（Weingarten 映射/形算子）给出，是刻画曲面在空间中如何弯曲的外在量。"],
        formulas: ["单位法向量 n = (r_u × r_v)/|r_u × r_v|；L = r_uu · n，M = r_uv · n，N = r_vv · n；II = L du^2 + 2M du dv + N dv^2。", "等价表达：L = -r_u · n_u，M = -r_u · n_v = -r_v · n_u，N = -r_v · n_v。", "形算子（Weingarten 映射）S = -dn：切平面上的自伴线性算子，矩阵表示 S = I^{-1} II，即 [[E,F],[F,G]]^{-1} [[L,M],[M,N]]。", "法曲率：κ_n(du:dv) = II(du,dv)/I(du,dv) = (L du^2 + 2M du dv + N dv^2)/(E du^2 + 2F du dv + G dv^2)。"],
        theorems: ["形算子 S 是切平面上关于第一基本形式自伴的算子，因此可正交对角化，其特征值为主曲率。", "第二基本形式的符号依赖法向量取向：改变 n 的方向会使 II、S 与主曲率同时变号（K 不变，H 变号）。", "Meusnier 定理：曲面上过同一点、同一切方向的所有曲线的法曲率相同，等于 κ_n；一般曲线的曲率满足 κ cos φ = κ_n（φ 为主法向量与曲面法向量的夹角）。"],
        generalRequirements: ["必须先固定单位法向量的取向，并在整题中保持一致。", "必须区分法曲率（依赖方向的比值）与主曲率（该比值的极值）。"],
        forbiddenErrors: ["【取向不一致】中途改变 n 的方向而不调整 II、H 的符号。", "【II 交叉项系数】写成 L du^2 + M du dv + N dv^2（漏因子 2）。", "【形算子矩阵错误】写成 S = II·I^{-1} 的错误乘序或直接用 II 的矩阵当作 S。", "【法曲率与曲率混淆】把曲面上曲线的曲率直接当作法曲率（需乘 cos φ）。", "【自伴性误设】声称 S 关于欧氏标准内积自伴而不涉及第一基本形式。"],
        parameterConstraints: { unitNormalOrientation: "需固定单位法向量方向。", c2Smoothness: "参数化至少 C^2 以定义二阶导数。", shapeOperatorFormula: "S = I^{-1} II（矩阵乘序固定）。" },
        closureChecks: ["求出 n 与 L、M、N。", "写出 S = I^{-1} II 并验证自伴性（相对 I）。", "计算所需法曲率并说明方向 (du : dv)。"],
        scenarioChecks: { sphereExample: ["半径 R 的球面取内法向时 S = (1/R)Id，主曲率均为 1/R。"], planeExample: ["平面 II ≡ 0，S ≡ 0，主曲率全为零。"], meusnierUse: ["计算曲面上曲线的曲率时用 κ cos φ = κ_n 分离法向与测地分量。"] },
    },
    // 主曲率、主方向与 Euler 公式。
    "principal-curvature-euler-formula": {
        definitions: ["主曲率是形算子的特征值，即法曲率在所有切方向上的极值；主方向是对应的特征方向；Euler 公式给出任意方向法曲率关于主曲率的表达。"],
        formulas: ["主曲率 κ_1, κ_2 是 S 的特征值，满足 det(II - κ I) = 0，即 (LN-M^2) - κ(EN - 2FM + GL) + κ^2(EG-F^2) = 0。", "Euler 公式：κ_n(θ) = κ_1 cos^2 θ + κ_2 sin^2 θ，θ 为该方向与第一主方向的夹角。", "主方向判别：方向 (du:dv) 是主方向 ⇔ (L du + M dv)/(E du + F dv) = (M du + N dv)/(F du + G dv)，等价 (EM-FL)du^2 + (EN-GL)du dv + (FN-GM)dv^2 = 0。", "脐点：κ_1 = κ_2（此时所有方向都是主方向），判据 L : M : N = E : F : G。"],
        theorems: ["形算子自伴 ⇒ 主曲率为实数，且当 κ_1 ≠ κ_2 时两主方向正交（Rodrigues 定理给出 S(w) = κ w）。", "Euler 公式表明法曲率在主方向上取到最大值 max(κ_1,κ_2) 与最小值 min(κ_1,κ_2)。", "全脐点曲面分类：连通曲面处处为脐点 ⇒ 曲面是平面的一部分（κ ≡ 0）或球面的一部分。"],
        generalRequirements: ["必须区分主曲率（外在，依赖法向取向的符号）与 Gauss 曲率（乘积，取向无关）。", "使用 Euler 公式时角度必须相对主方向测量，且需 κ_1 ≠ κ_2 时主方向才唯一。"],
        forbiddenErrors: ["【特征方程错误】用 det(II - κ Id) = 0 而不含第一基本形式（忽略 I^{-1}）。", "【Euler 公式系数错误】写成 κ_1 cos θ + κ_2 sin θ 或漏平方。", "【主方向正交性误设】在脐点处仍断言存在两个唯一正交主方向。", "【符号忽略】改变法向取向后不同步改变主曲率符号。", "【极值方向错误】声称法曲率极值在非主方向取得。"],
        parameterConstraints: { selfAdjointOperator: "主曲率是 S = I^{-1}II 的特征值。", umbilicCase: "κ_1 = κ_2 时主方向不唯一。", orientationSign: "主曲率符号随法向取向改变。" },
        closureChecks: ["写出 I、II 并解特征方程求 κ_1、κ_2。", "求主方向并验证正交（非脐点）。", "用 Euler 公式核对给定方向的法曲率。"],
        scenarioChecks: { curvatureLines: ["曲率线是处处沿主方向的曲线，由主方向微分方程求出。"], umbilicClassification: ["处处脐点的曲面只能是平面或球面的一部分。"], normalCurvatureExtrema: ["求法曲率极值直接取主曲率，不必逐方向搜索。"] },
    },
    // Gauss 曲率与平均曲率公式。
    "gauss-mean-curvature-formula": {
        definitions: ["Gauss 曲率是主曲率之积、平均曲率是主曲率之算术平均；二者由两个基本形式的系数直接计算，并给出曲面点的椭圆/双曲/抛物分类。"],
        formulas: ["K = κ_1 κ_2 = det S = (LN - M^2)/(EG - F^2)。", "H = (κ_1 + κ_2)/2 = (1/2) tr S = (EN - 2FM + GL)/(2(EG - F^2))。", "主曲率反解：κ_{1,2} = H ± sqrt(H^2 - K)（要求 H^2 ≥ K，等号对应脐点）。", "点的分类：K > 0 椭圆点；K < 0 双曲点；K = 0 且 S ≠ 0 抛物点；S = 0 平点。", "旋转曲面（弧长参数母线）：K = -f''/f（r = (f cos v, f sin v, g)，f'^2+g'^2 = 1）。"],
        theorems: ["K 与法向取向无关（两个主曲率同时变号），而 H 的符号依赖取向，因此 H = 0 是取向无关的条件。", "H^2 ≥ K 恒成立，等号当且仅当该点为脐点。", "分类几何意义：K > 0 时曲面局部位于切平面一侧；K < 0 时切平面穿过曲面（鞍形）。"],
        generalRequirements: ["必须用同一取向的 n 计算 L、M、N 与 H。", "计算 K、H 前必须确认 EG - F^2 > 0（正则性）。"],
        forbiddenErrors: ["【分母错误】把 K 写成 (LN-M^2)/(EG) 或 (LN-M^2)/(EG-F^2)^2。", "【H 公式错误】写成 (L+N)/2 或 (EN+2FM+GL)/(2(EG-F^2))（符号错）。", "【K 取向依赖误设】声称改变法向取向会改变 K 的符号。", "【分类遗漏】K = 0 时不区分抛物点与平点。", "【H^2 < K 的解】给出 sqrt(H^2-K) 为虚数的主曲率结果。"],
        parameterConstraints: { regularity: "EG - F^2 > 0。", consistentOrientation: "L、M、N 与 H 使用同一法向取向。", umbilicEquality: "H^2 = K 当且仅当脐点。" },
        closureChecks: ["计算 E、F、G、L、M、N。", "代入 K、H 公式并核对分母与符号。", "由 κ = H ± sqrt(H^2-K) 反解主曲率并检验 H^2 ≥ K。"],
        scenarioChecks: { sphereTorus: ["球面 K = 1/R^2 恒正；环面上同时存在 K > 0、K = 0、K < 0 的点。"], saddlePoint: ["双曲点（K < 0）处切平面穿过曲面，两族渐近方向由 II = 0 给出。"], revolutionSurface: ["旋转曲面用 K = -f''/f 快速判断曲率符号。"] },
    },
    // Gauss 绝妙定理：K 的内蕴性。
    "gauss-theorema-egregium": {
        definitions: ["Gauss 绝妙定理断言 Gauss 曲率虽由第二基本形式定义（外在量），却只依赖第一基本形式及其导数，因此是等距不变的内蕴量。"],
        formulas: ["内蕴表达（正交参数 F = 0）：K = -(1/(2 sqrt(EG))) [ ∂_u( G_u/sqrt(EG) ) + ∂_v( E_v/sqrt(EG) ) ]。", "等温参数 I = λ(du^2+dv^2)：K = -(1/(2λ)) Δ log λ（Δ 为平面 Laplace 算子）。", "一般情形：Brioschi 公式用 E、F、G 及其一、二阶偏导表示 K。", "Gauss 方程形式：K = (LN-M^2)/(EG-F^2) 与由 Christoffel 符号给出的内蕴表达一致。"],
        theorems: ["Gauss 绝妙定理（theorema egregium）：K 只依赖 E、F、G 及其偏导，因此局部等距保持 K。", "推论：平面（K ≡ 0）与球面（K = 1/R^2）不局部等距，因此地图无法既保长度又保面积地画出球面。", "推论：可展曲面（柱面、锥面、切线面）K ≡ 0，并且局部等距于平面。"],
        generalRequirements: ["必须明确所用参数类型（正交/等温）后再套用相应的内蕴公式。", "使用等距不变性时必须是局部等距（第一基本形式相同），而非仅面积或角度保持。"],
        forbiddenErrors: ["【H 也内蕴误设】声称平均曲率同样是内蕴量（H 依赖嵌入方式）。", "【等距结论滥用】由面积相等或共形等价推断 K 相同。", "【公式适用条件混用】把正交参数公式用于 F ≠ 0 的参数。", "【可展性误判】声称球面或环面可展（K ≠ 0 不可展）。", "【符号错误】等温参数公式漏负号写成 K = (1/(2λ))Δlog λ。"],
        parameterConstraints: { intrinsicOnly: "K 的计算只允许使用 E、F、G 及其导数。", parameterType: "内蕴公式需匹配正交（F=0）或等温（E=G, F=0）参数。", localIsometry: "等距不变性针对局部等距。" },
        closureChecks: ["选取合适参数并写出 E、F、G。", "用内蕴公式计算 K，并与 (LN-M^2)/(EG-F^2) 的结果对照。", "若讨论等距，验证第一基本形式可化为相同形式。"],
        scenarioChecks: { developableSurface: ["柱面、锥面 K ≡ 0，可展开为平面。"], mapProjectionImpossibility: ["球面与平面 K 不同，故不存在保长度的地图投影。"], isometryInvariantUse: ["证明两曲面不等距时比较 K 的取值集合。"] },
    },
    // Gauss-Codazzi 方程与曲面论基本定理。
    "gauss-codazzi-equations": {
        definitions: ["Gauss-Codazzi 方程是第一、第二基本形式必须满足的相容性条件（来自 r_uuv = r_uvu 型可积性），它们与曲面论基本定理一起给出曲面存在唯一性的完整刻画。"],
        formulas: ["Gauss 方程：K = (LN - M^2)/(EG - F^2) 同时等于仅由 E、F、G 及 Christoffel 符号给出的内蕴表达式。", "Codazzi-Mainardi 方程（正交参数 F = 0 的常用形式）：L_v - M_u = L·Γ^1_{12} + M(Γ^2_{12} - Γ^1_{11}) - N·Γ^2_{11}，M_v - N_u = L·Γ^1_{22} + M(Γ^2_{22} - Γ^1_{12}) - N·Γ^2_{12}。", "等温/正交简化形式：F = 0 时 L_v - M_u = (1/2)(E_v L/E + E_v N/G)、M_v - N_u = -(1/2)(G_u L/E + G_u N/G) 等价写法（需按约定核对）。", "可积性来源：r_{uuv} = r_{uvu} 与 n_{uv} = n_{vu} 的交换性。"],
        theorems: ["Gauss 方程给出 K 的内蕴性（绝妙定理），Codazzi-Mainardi 方程约束第二基本形式沿曲面的变化。", "曲面论基本定理（Bonnet）：给定定义在单连通区域上的 E、F、G（正定）与 L、M、N，若满足 Gauss-Codazzi 方程，则存在曲面以其为两个基本形式，且在刚体运动意义下唯一。", "推论：不能任意指定 I 与 II；例如 K > 0 的度量不能配以 LN - M^2 < 0 的第二基本形式。"],
        generalRequirements: ["必须同时验证 Gauss 方程与两条 Codazzi 方程，缺一不构成完整相容性条件。", "使用曲面论基本定理需要区域单连通且系数足够光滑。"],
        forbiddenErrors: ["【只验证 Gauss 方程】就断言给定的 I、II 可实现为曲面。", "【单连通性遗漏】在非单连通区域断言整体存在与唯一。", "【唯一性过强】声称唯一到恒等而非“至刚体运动（含反射时需注意取向）”。", "【Christoffel 符号来源错误】用第二基本形式的系数计算 Christoffel 符号（应只用 E、F、G）。", "【方程形式串用】把不同参数约定下的 Codazzi 方程混用而不调整。"],
        parameterConstraints: { compatibilityRequired: "I、II 必须满足 Gauss 与 Codazzi-Mainardi 方程。", simplyConnected: "存在唯一性定理要求单连通定义域。", smoothCoefficients: "系数需足够光滑（通常 C^2 以上）。" },
        closureChecks: ["由 E、F、G 计算 Christoffel 符号与内蕴 K。", "验证 Gauss 方程与两条 Codazzi 方程。", "如用基本定理断言存在性，说明区域单连通与光滑性。"],
        scenarioChecks: { constantCurvatureSurfaces: ["常曲率曲面（球面、平面、伪球面）通过 Gauss-Codazzi 求解得到。"], rigidityQuestions: ["曲面刚性问题（如球面刚性）依赖 Codazzi 方程的约束。"], impossibleDataDetection: ["给定 I、II 判断是否存在曲面时逐条检验相容性方程。"] },
    },
    // 测地线方程与测地曲率。
    "geodesic-equation-curvature": {
        definitions: ["测地线研究曲面（或 Riemann 流形）上测地曲率恒为零的曲线，即加速度只有法向分量的曲线；它们是局部最短路径，并由二阶常微分方程刻画。"],
        formulas: ["曲率分解：κ^2 = κ_n^2 + κ_g^2，其中 κ_n 为法曲率、κ_g 为测地曲率（切平面内分量）。", "测地线条件：κ_g ≡ 0，等价于 (d^2 u^k/ds^2) + Γ^k_{ij} (du^i/ds)(du^j/ds) = 0（k = 1, 2）。", "测地曲率的内蕴性：κ_g 只依赖第一基本形式，因此测地线在局部等距下保持为测地线。", "指数映射：exp_p(v) 为从 p 出发、初速 v 的测地线在 t = 1 时的点；测地极坐标下 I = dr^2 + G(r,θ)dθ^2 且 sqrt(G) ~ r - K r^3/6。"],
        theorems: ["存在唯一性：给定点 p 与切向量 v，存在唯一的测地线满足 γ(0) = p、γ'(0) = v（局部由 ODE 解的存在唯一性给出）。", "测地线局部最短：充分小的测地段是同伦类中最短的曲线；但整体最短性不保证（如球面上大圆的长弧）。", "Clairaut 关系（旋转曲面）：沿测地线 f sin ψ = 常数（f 为到轴距离，ψ 为测地线与母线的夹角），是测地线的第一积分。"],
        generalRequirements: ["必须使用弧长参数（或常速参数），否则测地方程需附加参数化条件。", "必须区分“测地线”（κ_g = 0）与“最短线”（整体最小），后者更强。"],
        forbiddenErrors: ["【局部与整体混淆】断言测地线总是两点间最短路径。", "【非常速参数】用任意参数写测地方程而不调整（非常速曲线即使轨迹为测地线也不满足方程）。", "【κ_g 与 κ 混淆】把曲线在空间中的曲率当作测地曲率。", "【外在性误设】声称测地线依赖第二基本形式（实为内蕴概念）。", "【平面直线类比过度】声称任意两点间测地线唯一（球面对径点有无穷多条）。"],
        parameterConstraints: { arcLengthOrConstantSpeed: "测地方程要求弧长或常速参数。", intrinsicQuantity: "κ_g 只由第一基本形式决定。", localExistence: "给定初始点与初速时测地线局部存在唯一。" },
        closureChecks: ["写出 Christoffel 符号并代入测地方程。", "验证解的参数为常速且初始条件满足。", "如涉及最短性，说明是局部结论或给出整体论证。"],
        scenarioChecks: { sphereGreatCircles: ["球面测地线是大圆；对径点之间测地线不唯一。"], surfaceOfRevolutionClairaut: ["旋转曲面测地线用 Clairaut 关系 f sin ψ = 常数求解。"], geodesicPolarCoordinates: ["测地极坐标下用 sqrt(G) 的展开读出 Gauss 曲率。"] },
    },
    // Gauss-Bonnet 定理。
    "gauss-bonnet-theorem": {
        definitions: ["Gauss-Bonnet 定理把曲面上的曲率积分（几何量）与 Euler 特征（拓扑量）联系起来，是局部微分几何通向整体拓扑的桥梁。"],
        formulas: ["局部形式（单连通区域 R，边界为分段光滑曲线）：∫∫_R K dA + ∮_{∂R} κ_g ds + Σ_i θ_i = 2π，θ_i 为顶点外角。", "测地三角形（边为测地线）：∫∫_Δ K dA = (α + β + γ) - π（角超公式）。", "整体形式（紧致无边曲面 M）：∫∫_M K dA = 2π χ(M) = 4π(1 - g)，g 为亏格。", "带边整体形式：∫∫_M K dA + ∮_{∂M} κ_g ds = 2π χ(M)。"],
        theorems: ["Gauss-Bonnet 定理（局部与整体形式）：曲率积分与边界测地曲率、外角之和由拓扑量决定，与具体度量无关。", "推论：球面（χ = 2）上 ∫K dA = 4π；环面（χ = 0）上 ∫K dA = 0，因此环面不能有处处正的 Gauss 曲率。", "推论（球面几何）：球面上测地三角形内角和大于 π，双曲面（K < 0）上小于 π，角超/角亏正比于面积。"],
        generalRequirements: ["必须明确区域是否单连通、边界是否分段光滑，以及外角的符号约定（凸角为正）。", "整体形式要求曲面紧致、可定向、无边（或分别写出带边形式）。"],
        forbiddenErrors: ["【外角遗漏】边界有角点时漏掉 Σθ_i。", "【内角外角混用】把内角直接代入公式（应为外角 π - 内角）。", "【χ 与 g 关系错误】写成 χ = 2 - g 或 ∫K dA = 2π(1-g)。", "【紧致性遗漏】对非紧或带边曲面使用无边整体形式。", "【定向性遗漏】对不可定向曲面（如 Klein 瓶）直接套用可定向情形的公式。"],
        parameterConstraints: { regionRegularity: "区域边界分段光滑，顶点外角有定义。", compactOrientable: "整体形式要求紧致可定向无边（或用带边形式）。", eulerCharacteristic: "χ(M) = 2 - 2g（闭可定向曲面）。" },
        closureChecks: ["确认区域/曲面的拓扑类型与 χ。", "写出 K 的面积积分、边界测地曲率积分与外角和。", "核对等式两端并检验特例（球面、平面多边形）。"],
        scenarioChecks: { geodesicTriangleExcess: ["球面测地三角形面积 = R^2(角和 - π)。"], torusZeroTotalCurvature: ["环面上总曲率为 0，正负曲率区域相互抵消。"], boundaryWithCorners: ["含角点的区域必须逐个加入外角修正项。"] },
    },
    // 极小曲面与极小曲面方程。
    "minimal-surface-equation": {
        definitions: ["极小曲面研究平均曲率恒为零的曲面，它们是面积泛函的临界点（第一变分为零），并满足非线性二阶椭圆型的极小曲面方程。"],
        formulas: ["判据：H ≡ 0（等价 κ_1 = -κ_2，故 K = -κ_1^2 ≤ 0）。", "图像形式（z = f(x,y)）：(1 + f_y^2) f_xx - 2 f_x f_y f_xy + (1 + f_x^2) f_yy = 0，等价 div(∇f/sqrt(1+|∇f|^2)) = 0。", "面积第一变分：dA/dt|_{t=0} = -∫∫ 2H φ dA（法向变分 φ n），故 H ≡ 0 ⇔ 面积临界。", "等温参数下：H ≡ 0 ⇔ 坐标函数调和（Δr = 0），由此得 Weierstrass-Enneper 表示。"],
        theorems: ["极小曲面等价于面积泛函的临界点；临界不等于最小，需第二变分（稳定性）判断是否局部面积最小。", "极小曲面上 K ≤ 0，且非平面的极小曲面没有椭圆点。", "经典例子与刚性：平面、悬链面（catenoid）、螺旋面（helicoid）；Bernstein 定理：R^2 上整体图像形式的极小曲面必为平面。"],
        generalRequirements: ["必须区分 H ≡ 0（极小）与面积实际最小（需稳定性），不能互相代替。", "必须区分极小曲面（H = 0）与常平均曲率曲面（H = 常数 ≠ 0，如球面）。"],
        forbiddenErrors: ["【最小性误设】由 H = 0 直接断言该曲面在给定边界下面积最小。", "【方程写错】把极小曲面方程写成 f_xx + f_yy = 0（这是调和方程，只在梯度小的线性化情形近似）。", "【CMC 混淆】把球面（H = 常数 ≠ 0）当作极小曲面。", "【K 符号错误】声称极小曲面可以有 K > 0 的点。", "【取向依赖忽略】用 H 的符号做几何结论而不声明法向取向（H = 0 本身取向无关）。"],
        parameterConstraints: { meanCurvatureZero: "极小曲面定义为 H ≡ 0。", nonpositiveGauss: "极小曲面满足 K ≤ 0。", ellipticEquation: "图像形式满足非线性椭圆方程，需 f ∈ C^2。" },
        closureChecks: ["计算 H 并验证恒为零（或验证极小曲面方程）。", "核对 K ≤ 0 与主曲率互为相反数。", "若声称面积最小，给出稳定性或比较论证。"],
        scenarioChecks: { catenoidHelicoid: ["悬链面与螺旋面是经典非平面极小曲面，且局部等距。"], plateauProblem: ["给定边界求极小曲面（Plateau 问题）需变分方法与存在性理论。"], bernsteinTheorem: ["整体图像型极小曲面在 R^2 上只有平面（Bernstein 定理）。"] },
    },
    // Levi-Civita 联络与 Christoffel 符号。
    "levi-civita-connection-christoffel": {
        definitions: ["Levi-Civita 联络是 Riemann 度量所唯一决定的无挠且与度量兼容的仿射联络，其局部系数即 Christoffel 符号，用于定义协变导数、平行移动与测地线。"],
        formulas: ["Christoffel 符号：Γ^k_{ij} = (1/2) g^{kl}( ∂_i g_{jl} + ∂_j g_{il} - ∂_l g_{ij} )，对称性 Γ^k_{ij} = Γ^k_{ji}。", "协变导数：(∇_X Y)^k = X^i ∂_i Y^k + Γ^k_{ij} X^i Y^j。", "度量兼容：∇_X ⟨Y, Z⟩ = ⟨∇_X Y, Z⟩ + ⟨Y, ∇_X Z⟩，即 ∇g = 0；无挠：∇_X Y - ∇_Y X = [X, Y]。", "平行移动：沿曲线 γ 的向量场 V 平行 ⇔ ∇_{γ'} V = 0；平行移动保内积（度量兼容的推论）。"],
        theorems: ["Riemann 几何基本定理：给定 Riemann 度量 g，存在唯一无挠且度量兼容的联络（Levi-Civita 联络），由 Koszul 公式给出。", "Christoffel 符号不是张量：坐标变换下含二阶导数的附加项，因此其在一点可取零（测地正规坐标）但曲率张量不能。", "推论：曲面情形 Christoffel 符号只依赖 E、F、G 及其一阶导数，故测地线与测地曲率是内蕴的。"],
        generalRequirements: ["必须区分“联络系数不是张量”与“曲率是张量”，不能由 Γ = 0（某点）推断曲率为零。", "使用 Christoffel 公式必须先写出度量矩阵及其逆 g^{kl}。"],
        forbiddenErrors: ["【张量性误设】把 Γ^k_{ij} 当作张量分量在坐标变换下齐次变换。", "【公式符号错误】写成 Γ^k_{ij} = (1/2)g^{kl}(∂_i g_{jl} + ∂_j g_{il} + ∂_l g_{ij})（第三项符号错）。", "【对称性误用】在有挠联络（非 Levi-Civita）情形仍假设 Γ^k_{ij} = Γ^k_{ji}。", "【度量逆遗漏】计算时漏掉 g^{kl} 而直接用 g_{kl}。", "【平行移动路径无关误设】声称平行移动与路径无关（只有平坦时成立）。"],
        parameterConstraints: { riemannianMetric: "g 正定（或伪 Riemann 时非退化），存在逆 g^{kl}。", torsionFreeMetricCompatible: "Levi-Civita 联络由无挠 + 度量兼容唯一确定。", smoothness: "度量至少 C^2（涉及曲率时）。" },
        closureChecks: ["写出 g_{ij}、g^{ij} 并计算所需的 Γ^k_{ij}。", "验证对称性与（必要时）度量兼容性。", "把结果用于测地方程或平行移动并核对内积保持。"],
        scenarioChecks: { polarCoordinatesFlat: ["平面极坐标下 Γ^r_{θθ} = -r、Γ^θ_{rθ} = 1/r，但曲率仍为零。"], holonomyOnSphere: ["球面上沿闭曲线平行移动产生旋转（holonomy），体现曲率非零。"], surfaceIntrinsicUse: ["曲面情形用 E、F、G 计算 Γ 并导出测地方程。"] },
    },
    // Riemann 曲率张量与截面曲率。
    "riemann-curvature-sectional": {
        definitions: ["Riemann 曲率张量度量协变导数的不可交换性，是流形弯曲的完整局部不变量；截面曲率、Ricci 曲率与标量曲率是它的逐层缩并。"],
        formulas: ["定义：R(X,Y)Z = ∇_X ∇_Y Z - ∇_Y ∇_X Z - ∇_{[X,Y]} Z；分量 R^l_{ijk} 由 Γ 及其一阶导数给出。", "对称性：R(X,Y,Z,W) = -R(Y,X,Z,W) = -R(X,Y,W,Z) = R(Z,W,X,Y)；第一 Bianchi 恒等式 R(X,Y)Z + R(Y,Z)X + R(Z,X)Y = 0；第二 Bianchi 恒等式对协变导数成立。", "截面曲率：K(X,Y) = ⟨R(X,Y)Y, X⟩ / (|X|^2|Y|^2 - ⟨X,Y⟩^2)，只依赖 X、Y 所张的二维平面。", "Ricci 与标量曲率：Ric(Y,Z) = Σ_i ⟨R(e_i, Y)Z, e_i⟩（迹），S = Σ_i Ric(e_i, e_i)；二维时 K = Gauss 曲率、Ric = K g、S = 2K。"],
        theorems: ["曲率张量是张量（与坐标选取无关），R ≡ 0 ⇔ 流形局部等距于欧氏空间（平坦性定理）。", "截面曲率决定曲率张量：所有二维平面上的截面曲率完全确定 R。", "常截面曲率空间形式：完备单连通且截面曲率恒为 c 的流形等距于球面（c > 0）、欧氏空间（c = 0）或双曲空间（c < 0）。"],
        generalRequirements: ["必须使用 Levi-Civita 联络（无挠、度量兼容）才有上述全部对称性。", "计算截面曲率时分母必须为两向量张成的平行四边形面积平方（要求 X、Y 线性无关）。"],
        forbiddenErrors: ["【括号项遗漏】定义中漏掉 -∇_{[X,Y]}Z（在非坐标基下必需）。", "【对称性误用】断言 R(X,Y,Z,W) = R(X,Z,Y,W) 之类不成立的置换对称。", "【截面曲率分母错误】写成 |X|^2|Y|^2 而不减 ⟨X,Y⟩^2。", "【Ricci 与截面曲率混淆】由 Ric > 0 断言所有截面曲率为正。", "【平坦性判据错误】由 Ric ≡ 0 断言流形平坦（维数 ≥ 4 时不成立）。"],
        parameterConstraints: { leviCivitaRequired: "对称性与 Bianchi 恒等式基于 Levi-Civita 联络。", linearlyIndependentPlane: "截面曲率要求 X、Y 线性无关。", dimensionCaveats: "二维时 Ric 与 K 等价；高维时 Ric ≡ 0 不蕴含平坦。" },
        closureChecks: ["由 Γ 计算 R 的分量并核对反对称性。", "计算所需截面曲率并检查分母为面积平方。", "必要时缩并得到 Ric 与 S，并对二维情形与 Gauss 曲率对照。"],
        scenarioChecks: { spaceForms: ["常曲率空间形式（球面、欧氏、双曲）用截面曲率恒定刻画。"], sphereCurvature: ["半径 R 的球面截面曲率恒为 1/R^2，Ric = (n-1)/R^2 g。"], einsteinManifold: ["Ric = λ g（Einstein 流形）时标量曲率恒定，但一般不平坦。"] },
    },
};
