import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“几何-立体几何”下的原子 L3 知识项。
// 本分支统一采用空间综合几何与空间向量两套语言：位置关系用判定/性质定理证明，
// 角度、距离与体积优先用坐标法或等体积法计算。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const GEOMETRY_SOLID_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 线面垂直的判定与性质。
    "line-plane-perpendicular": {
        id: "line-plane-perpendicular", l2Key: "geometry-solid", name: "线面垂直的判定与性质", kind: "criterion",
        aliases: ["线面垂直", "线面垂直判定定理", "线面垂直性质定理", "line perpendicular to plane"],
    },
    // 三垂线定理及其逆定理。
    "three-perpendiculars-theorem": {
        id: "three-perpendiculars-theorem", l2Key: "geometry-solid", name: "三垂线定理与逆定理", kind: "theorem",
        aliases: ["三垂线定理", "三垂线逆定理", "theorem of three perpendiculars"],
    },
    // 空间向量坐标法：建系、法向量与统一处理角度距离。
    "space-vector-coordinate-method": {
        id: "space-vector-coordinate-method", l2Key: "geometry-solid", name: "空间向量坐标法", kind: "algorithm",
        aliases: ["空间向量法", "坐标法立体几何", "法向量法", "space vector method"],
    },
    // 二面角的计算：定义法、三垂线法、法向量法与面积投影法。
    "dihedral-angle-computation": {
        id: "dihedral-angle-computation", l2Key: "geometry-solid", name: "二面角的计算", kind: "algorithm",
        aliases: ["二面角", "二面角平面角", "dihedral angle"],
    },
    // 异面直线所成角与异面直线距离。
    "skew-lines-angle-distance": {
        id: "skew-lines-angle-distance", l2Key: "geometry-solid", name: "异面直线所成角与距离", kind: "formula",
        aliases: ["异面直线", "异面直线所成角", "异面直线距离", "公垂线", "skew lines"],
    },
    // 点到平面距离与等体积法。
    "point-plane-distance-equal-volume": {
        id: "point-plane-distance-equal-volume", l2Key: "geometry-solid", name: "点到平面距离与等体积法", kind: "algorithm",
        aliases: ["点到平面距离", "点面距离", "等体积法", "distance from point to plane"],
    },
    // 外接球与内切球半径的求法。
    "circumscribed-inscribed-sphere": {
        id: "circumscribed-inscribed-sphere", l2Key: "geometry-solid", name: "外接球与内切球半径", kind: "algorithm",
        aliases: ["外接球", "内切球", "外接球半径", "内切球半径", "circumscribed sphere"],
    },
    // Euler 多面体公式与正多面体。
    "euler-polyhedron-formula": {
        id: "euler-polyhedron-formula", l2Key: "geometry-solid", name: "Euler 多面体公式与正多面体", kind: "theorem",
        aliases: ["多面体欧拉公式", "V-E+F=2", "正多面体", "柏拉图立体", "Euler polyhedron formula"],
    },
    // 展开图与曲面上的最短路径。
    "unfolding-shortest-path": {
        id: "unfolding-shortest-path", l2Key: "geometry-solid", name: "展开图与最短路径", kind: "algorithm",
        aliases: ["展开图", "侧面展开", "展开求最短距离", "shortest path on surface"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const GEOMETRY_SOLID_L3_RULES: Record<string, MathV2L3Rules> = {
    // 线面垂直的判定与性质。
    "line-plane-perpendicular": {
        definitions: ["线面垂直研究一条直线与一个平面内所有直线都垂直的位置关系，其判定只需验证与平面内两条相交直线垂直，是空间垂直关系推理的枢纽。"],
        formulas: ["定义：a ⊥ α ⇔ a 与 α 内任意直线都垂直。", "判定定理：a ⊥ b、a ⊥ c，b ⊂ α、c ⊂ α，b ∩ c = P ⇒ a ⊥ α（b、c 必须相交）。", "性质：a ⊥ α，b ⊂ α ⇒ a ⊥ b；a ⊥ α、b ⊥ α ⇒ a ∥ b；a ⊥ α、a ∥ b ⇒ b ⊥ α。", "向量判据：a 的方向向量 s 与 α 的法向量 n 满足 s ∥ n ⇔ a ⊥ α。"],
        theorems: ["线面垂直判定定理：直线与平面内两条相交直线都垂直，则该直线垂直于该平面。", "线面垂直性质定理：垂直于同一平面的两条直线平行；垂直于同一直线的两个平面平行。", "过一点有且只有一条直线垂直于已知平面；过一点有且只有一个平面垂直于已知直线。"],
        generalRequirements: ["使用判定定理必须明确指出平面内的两条直线相交（相交点要写出），仅平行两直线不足。", "结论 a ⊥ α 之后使用性质时必须写出所用的平面内直线属于该平面。"],
        forbiddenErrors: ["【相交条件遗漏】用平面内两条平行直线垂直就断言线面垂直。", "【一条直线充分性误设】只由 a ⊥ b（b ⊂ α）就断言 a ⊥ α。", "【垂直传递性滥用】由 a ⊥ b、b ⊥ α 断言 a ∥ α 或 a ⊂ α（可能有多种位置关系）。", "【线线垂直与线面垂直混淆】把 a ⊥ α 的结论直接写成 a 垂直于 α 的某条特定直线以外的错误对象。"],
        parameterConstraints: { intersectingLines: "判定定理要求平面内两直线相交且都与所给直线垂直。", linesInPlane: "性质定理中被垂直的直线必须在该平面内。", normalVectorParallel: "向量法要求方向向量与法向量平行。" },
        closureChecks: ["写出平面内两条相交直线及其交点，并逐条验证垂直。", "得到线面垂直后再据性质推导线线垂直或平面平行。", "如用坐标法，验证方向向量与法向量平行。"],
        scenarioChecks: { provePerpendicularLines: ["证明线线垂直的标准路径是先证一条直线垂直于含另一条直线的平面。"], perpendicularFromEqualLengths: ["等腰/等边结构中常用中线（垂直平分）构造平面内两条相交垂线。"], vectorVerification: ["坐标可建时用 s ∥ n 直接验证线面垂直。"] },
    },
    // 三垂线定理及其逆定理。
    "three-perpendiculars-theorem": {
        definitions: ["三垂线定理研究平面内一条直线与平面外斜线的垂直关系如何由该直线与斜线射影的垂直关系判定，是不建系时处理垂直与二面角的经典工具。"],
        formulas: ["设 PA ⊥ α（A 为垂足），PO 是斜线，AO 是 PO 在 α 内的射影，a ⊂ α。", "三垂线定理：a ⊥ AO ⇒ a ⊥ PO。", "逆定理：a ⊥ PO ⇒ a ⊥ AO。", "常用推论：由 a ⊥ PO 与 a ⊥ AO 可得 a ⊥ 平面 PAO，从而得到更多垂直关系。"],
        theorems: ["三垂线定理及其逆定理成立的前提是 PA ⊥ α、A 为垂足、AO 为射影且 a 在 α 内。", "定理本质是线面垂直判定与性质的组合：a ⊥ PA（因 PA ⊥ α）与 a ⊥ AO 给出 a ⊥ 平面 PAO，故 a ⊥ PO。", "在二面角计算中常用其构造二面角的平面角：从一个半平面内的点向棱作垂线并连接。"],
        generalRequirements: ["必须明确 PA ⊥ α 与 A 是垂足，射影 AO 必须画在平面 α 内。", "直线 a 必须在平面 α 内，且 a 可以不过 A 或 O（不要求与射影相交于特定点）。"],
        forbiddenErrors: ["【垂足条件遗漏】未确认 PA ⊥ α 就使用定理。", "【射影错误】把 PO 在其他平面内的投影当作 AO。", "【直线位置错误】把不在 α 内的直线 a 代入定理。", "【定理方向混用】用正定理的形式书写逆定理的推理（条件与结论互换却不说明）。"],
        parameterConstraints: { footOfPerpendicular: "PA ⊥ α 且 A 为垂足。", projectionInPlane: "AO 是斜线 PO 在 α 内的射影。", lineInPlane: "a ⊂ α。" },
        closureChecks: ["画出 PA、PO、AO 并标明垂足与射影。", "确认 a 在平面内并写出所用的垂直关系。", "必要时补充 a ⊥ 平面 PAO 以得到更多结论。"],
        scenarioChecks: { dihedralPlaneAngle: ["用三垂线定理作二面角的平面角（过棱上一点在两半平面内作垂线）。"], provePerpendicular: ["无法建系时用三垂线定理证明线线垂直。"], converseUse: ["已知斜线垂直时用逆定理得到射影垂直，进而定位垂足。"] },
    },
    // 空间向量坐标法。
    "space-vector-coordinate-method": {
        definitions: ["空间向量坐标法研究如何为立体几何图形建立直角坐标系，用向量的点积、叉积与法向量把位置关系、角度与距离问题统一化为代数计算。"],
        formulas: ["建系原则：优先选择三条两两垂直的棱或由线面垂直关系提供的正交方向作为坐标轴，原点取在关键垂足或顶点。", "法向量求法：设 n = (x, y, z)，由 n · a = 0、n · b = 0（a、b 为平面内两不平行向量）解出一组非零解。", "位置关系：线面平行 ⇔ s · n = 0（且点不在平面内）；线面垂直 ⇔ s ∥ n；面面平行 ⇔ n_1 ∥ n_2；面面垂直 ⇔ n_1 · n_2 = 0。", "角度：异面直线角 cos θ = |s_1 · s_2|/(|s_1||s_2|)；线面角 sin θ = |s · n|/(|s||n|)；二面角 cos φ = ±(n_1 · n_2)/(|n_1||n_2|)。", "距离：点面距离 d = |AP · n|/|n|；异面直线距离 d = |P_1P_2 · (s_1 × s_2)|/|s_1 × s_2|。"],
        theorems: ["空间中任意向量可由一组基（不共面的三个向量）唯一线性表示，故坐标法对一般凸/非凸多面体都适用。", "只要坐标系正交且单位一致，所有角度距离公式与综合几何结论等价，可互相验证。", "若图形不具备三条互相垂直的棱，仍可用斜基底（非正交）表示向量，但此时点积必须使用基向量之间的夹角信息。"],
        generalRequirements: ["必须先说明建系的正交性依据（哪条线垂直哪个平面），不能凭图形直观假设垂直。", "所有点坐标必须写全并与题目给定的长度关系一致。"],
        forbiddenErrors: ["【正交性未证】直接假定某三条棱两两垂直而未论证。", "【法向量取零】解方程时给出零向量作为法向量。", "【角度绝对值遗漏】计算异面直线角或线面角时不取绝对值，导致出现钝角结果。", "【二面角符号未定】直接取法向量夹角作为二面角而不判断锐钝。", "【斜基底误用】在非正交基下仍按正交坐标公式计算点积与模长。"],
        parameterConstraints: { orthogonalFrame: "坐标系需正交且单位长度一致（否则须用斜基底的度量矩阵）。", nonzeroNormal: "法向量必须非零。", absoluteValueForAngles: "异面直线角与线面角取绝对值以落在 (0°, 90°]。" },
        closureChecks: ["写出建系依据与全部关键点坐标。", "求出所需的方向向量与法向量并验证非零、垂直条件。", "代入角度/距离公式并核对取值范围与几何合理性。"],
        scenarioChecks: { rectangularSolid: ["长方体、正方体与含线面垂直的棱锥优先建系求解。"], dihedralSignCheck: ["法向量法求二面角后用图形或特殊点判断锐钝。"], obliqueBasis: ["无正交棱时用斜基底表示向量，点积按夹角展开。"] },
    },
    // 二面角的计算。
    "dihedral-angle-computation": {
        definitions: ["二面角研究两个半平面沿公共棱所成的角，其大小由棱上任一点处在两个半平面内分别垂直于棱的两条射线所成的角（平面角）度量，取值范围 [0°, 180°]。"],
        formulas: ["定义法：在棱 l 上取点 O，在两半平面内分别作 OA ⊥ l、OB ⊥ l，则 ∠AOB 为二面角的平面角。", "三垂线法：从一个半平面内的点 P 向另一半平面作垂线 PH，再作 HO ⊥ l，连接 PO，则 ∠POH 的余角关系给出二面角。", "法向量法：cos φ = ±(n_1 · n_2)/(|n_1||n_2|)，符号由二面角的锐钝性决定。", "面积投影法：cos φ = S_投影 / S_原（原图形在一个半平面内，投影到另一个半平面）。"],
        theorems: ["二面角的平面角与棱上取点无关，因此可自由选择便于计算的位置。", "法向量夹角与二面角相等或互补，因此必须结合图形判断取哪一个。", "面积投影法适用于原图形与投影都容易求面积的情形，是对定义法的有效替代。"],
        generalRequirements: ["必须明确二面角的棱与两个半平面，并说明所作射线均垂直于棱。", "使用法向量法必须判断二面角的锐钝（可取棱上点向两侧的向量或用图形位置判断）。"],
        forbiddenErrors: ["【平面角构造错误】所作射线未垂直于棱就当作平面角。", "【法向量符号误判】把法向量夹角直接作为二面角，忽略互补可能。", "【取值范围错误】给出大于 180° 或负值的二面角。", "【投影法前提遗漏】用面积投影法但投影方向不是垂直于目标半平面。"],
        parameterConstraints: { edgeAndHalfPlanes: "必须指明棱与两个半平面。", perpendicularToEdge: "平面角的两条射线都要垂直于棱。", rangeZeroToPi: "二面角取值 [0°, 180°]。" },
        closureChecks: ["作出（或计算出）平面角并说明垂直于棱。", "如用法向量法，判断锐钝并确定符号。", "用第二种方法（三垂线法/投影法/坐标法）复核结果。"],
        scenarioChecks: { normalVectorApproach: ["有正交建系条件时用法向量法最快，但必须定符号。"], threePerpendicularApproach: ["无法建系时用三垂线定理作平面角。"], projectionAreaApproach: ["原图形与投影面积易求时用 cos φ = S'/S。"] },
    },
    // 异面直线所成角与距离。
    "skew-lines-angle-distance": {
        definitions: ["异面直线研究既不平行也不相交的两条空间直线，其所成角由平移到同一点后的两条相交直线的锐角（或直角）度量，距离由唯一的公垂线段长度度量。"],
        formulas: ["所成角：把其中一条直线平移到与另一条相交，取所得两角中不超过 90° 的一个；向量式 cos θ = |s_1 · s_2|/(|s_1||s_2|)，θ ∈ (0°, 90°]。", "距离：d = |P_1P_2 · (s_1 × s_2)| / |s_1 × s_2|（P_i 为各直线上一点）。", "公垂线：与两条异面直线都垂直且相交的直线唯一存在，其被夹线段长即为距离。", "等价算法：把两异面直线放入两个平行平面，距离等于两平面之间的距离。"],
        theorems: ["两条异面直线的公垂线存在且唯一，公垂线段是两直线上点对之间的最短距离。", "异面直线所成角与平移方式无关，取值范围为 (0°, 90°]。", "异面判据：混合积 (P_1P_2, s_1, s_2) ≠ 0 ⇔ 两直线异面（为 0 时共面，即平行或相交）。"],
        generalRequirements: ["所成角必须取锐角或直角，不能给出钝角。", "距离公式要求两直线不平行（s_1 × s_2 ≠ 0）；平行情形应改用点到直线距离。"],
        forbiddenErrors: ["【钝角结果】所成角计算不取绝对值给出钝角。", "【平行退化】对平行直线使用异面距离的混合积公式。", "【公垂线非唯一误设】声称公垂线不唯一或不存在。", "【共面误判】仅由不相交断言异面而不排除平行。", "【平移改变角度】平移时改变方向向量（如反向后取钝角）。"],
        parameterConstraints: { nonParallel: "距离公式要求两方向向量不平行。", acuteAngleRange: "所成角在 (0°, 90°]。", skewCriterion: "异面性由混合积非零判定。" },
        closureChecks: ["写出两条直线的方向向量与各自一点。", "用 cos θ = |s_1·s_2|/(|s_1||s_2|) 求角并核对范围。", "用混合积公式求距离，或作出公垂线段验证。"],
        scenarioChecks: { translationConstruction: ["无坐标时用平移（补形、取中点连线）把异面直线化为相交直线求角。"], parallelPlanesMethod: ["把两异面直线嵌入两平行平面，用面面距离求异面距离。"], cubeDiagonals: ["正方体中体对角线与棱、面对角线的异面角是标准计算范例。"] },
    },
    // 点到平面距离与等体积法。
    "point-plane-distance-equal-volume": {
        definitions: ["本条研究点到平面距离的求法，重点是等体积法：把同一个四面体的体积用不同底面表示，从而把待求的高（距离）解出来。"],
        formulas: ["等体积法：V = (1/3) S_1 h_1 = (1/3) S_2 h_2 ⇒ h_1 = 3V / S_1。", "向量法：d = |AP · n| / |n|（A 为平面内一点，n 为法向量）；坐标式 d = |Ax_0+By_0+Cz_0+D|/sqrt(A^2+B^2+C^2)。", "线面距离与面面距离：直线与平面平行时取直线上任一点到平面的距离；两平行平面距离取一平面上任一点到另一平面的距离。", "四面体体积：V = (1/6)|(AB, AC, AD)|（混合积）。"],
        theorems: ["点到平面的距离等于该点与平面上各点连线中的最小值，由垂线段实现（唯一）。", "等体积法的正确性来自四面体体积与底面/高选取无关，是无需作垂线求距离的通用手段。", "平行关系可把点面距离转化：直线（平面）与平面平行时，其上所有点到该平面距离相等。"],
        generalRequirements: ["等体积法必须选取同一个四面体，并确保两次计算的底面积与对应高匹配。", "使用点面距离公式时法向量必须对应正确的平面。"],
        forbiddenErrors: ["【体积不一致】两次体积计算实际用了不同的四面体。", "【底面积与高错配】用一个底面的面积配另一个底面对应的高。", "【垂线段唯一性忽略】把斜线段长度当作点面距离。", "【平行前提遗漏】在直线与平面不平行时仍用“取任一点”的距离转化。", "【绝对值遗漏】向量法计算距离时不取绝对值。"],
        parameterConstraints: { sameTetrahedron: "等体积法需使用同一四面体的两种底-高分解。", nonzeroBaseArea: "所选底面面积不为零。", parallelForTransfer: "距离转化要求直线/平面与目标平面平行。" },
        closureChecks: ["写出四面体并用两种方式表达体积。", "解出所求高并核对为正且小于相关斜线段长度。", "如用坐标法，代入点面距离公式复核。"],
        scenarioChecks: { volumeMethodForHeight: ["求点到平面距离优先用等体积法，避免作垂足。"], lineToPlaneDistance: ["线面平行时把线面距离化为点面距离。"], checkAgainstSlant: ["结果应满足 d ≤ 任一斜线段长度，用于快速校验。"] },
    },
    // 外接球与内切球半径。
    "circumscribed-inscribed-sphere": {
        definitions: ["本条研究多面体（尤其棱柱、棱锥）的外接球与内切球：外接球球心到各顶点距离相等，内切球球心到各面距离相等，核心是定位球心并列出半径方程。"],
        formulas: ["长方体（含正方体）外接球：2R = sqrt(a^2+b^2+c^2)；补形法把直角三棱锥补成长方体后同式适用。", "球心定位：外接球球心在各棱垂直平分面的交点上；对正棱锥落在高所在直线上，设底面外接圆半径 r、高 h，则 R^2 = r^2 + (h - R)^2。", "内切球：r = 3V / S_全（对任意可内切的多面体，用体积分割为以球心为顶点的锥体得到）。", "正四面体（棱长 a）：R_外 = sqrt(6)a/4，r_内 = sqrt(6)a/12，两者比为 3 : 1。"],
        theorems: ["外接球存在 ⇔ 各顶点共球；棱锥外接球球心在底面外接圆圆心正上方（当侧棱等长或有线面垂直结构时）。", "内切球半径公式 r = 3V/S_全 来自把多面体分割为以球心为公共顶点、各面为底的锥体。", "补形法：直角结构（三条棱两两垂直、直棱柱、对棱相等的四面体）可补成长方体，外接球半径由体对角线给出。"],
        generalRequirements: ["必须先论证球心位置（对称性、垂直平分面、线面垂直），不能凭直观假定球心在某点。", "内切球公式要求多面体确实存在内切球（各面到某点距离相等）。"],
        forbiddenErrors: ["【球心位置假设错误】默认外接球心在几何体中心或底面中心。", "【方程遗漏】用 R^2 = r^2 + h^2 代替 R^2 = r^2 + (h-R)^2。", "【内切球存在性遗漏】对不存在内切球的多面体套用 r = 3V/S。", "【补形对象错误】把非直角结构强行补成长方体。", "【比例记错】正四面体外接球与内切球半径比写成 2:1 或 4:1。"],
        parameterConstraints: { centerJustification: "球心位置必须由对称性或垂直关系论证。", radiusEquation: "外接球用到顶点等距方程；正棱锥用 R^2 = r^2 + (h-R)^2。", inscribedExistence: "内切球公式要求内切球存在。" },
        closureChecks: ["确定球心位置并写出等距条件。", "解出半径并检验非负与几何合理性（如 R ≥ h/2 等）。", "如用补形法，说明补形的合法性并核对体对角线。"],
        scenarioChecks: { rightAngleCompletion: ["三棱锥有三条两两垂直的棱时直接补成长方体求外接球。"], regularPyramid: ["正棱锥用 R^2 = r^2 + (h-R)^2 求外接球半径。"], inscribedByVolume: ["求内切球半径优先用 r = 3V/S_全。"] },
    },
    // Euler 多面体公式与正多面体。
    "euler-polyhedron-formula": {
        definitions: ["Euler 多面体公式研究凸多面体（更一般地与球面同胚的多面体）顶点数 V、棱数 E 与面数 F 之间的拓扑恒等式，并由此推出正多面体只有五种。"],
        formulas: ["Euler 公式：V - E + F = 2（凸多面体或与球面同胚的多面体）。", "面-棱计数关系：2E = Σ_面 (该面的边数) = Σ_顶点 (该顶点的棱数)。", "正多面体条件：每个面是正 p 边形、每个顶点有 q 条棱，则 1/p + 1/q > 1/2，解得 (p,q) ∈ {(3,3),(3,4),(3,5),(4,3),(5,3)}。", "亏格 g 曲面上的多面体：V - E + F = 2 - 2g（如环面 g = 1 时为 0）。"],
        theorems: ["Euler 公式对凸多面体恒成立，是拓扑不变量（Euler 特征）的最初形式。", "正多面体（Platonic 立体）恰有五种：正四面体、正方体、正八面体、正十二面体、正二十面体。", "推论：凸多面体必有面数不超过 5 的面，或必有度数不超过 5 的顶点（用于图论着色等论证）。"],
        generalRequirements: ["必须确认多面体是凸的（或与球面同胚）；带洞的多面体需改用 V-E+F = 2-2g。", "计数时必须用 2E = Σ 面边数 校验，避免重复或漏计。"],
        forbiddenErrors: ["【适用范围错误】对带洞（环面型）多面体使用 V-E+F = 2。", "【棱计数重复】计算 Σ 面边数时不除以 2。", "【正多面体数目错误】声称正多面体有 6 种或漏掉某一种。", "【半正多面体混入】把截角多面体等半正多面体当作正多面体。"],
        parameterConstraints: { convexOrSphereLike: "公式要求多面体凸或与球面同胚。", integerCounts: "V、E、F 为正整数且满足 2E = Σ 面边数。", regularityCondition: "正多面体要求面全等正多边形、各顶点结构相同。" },
        closureChecks: ["列出 V、E、F 并验证 V-E+F = 2。", "用 2E = Σ 面边数（或 Σ 顶点度数）交叉校验计数。", "涉及正多面体时核对 (p,q) 的五组解。"],
        scenarioChecks: { countingFacesEdges: ["由部分数据求缺失的 V、E、F 时联立 Euler 公式与计数关系。"], truncationOperation: ["截角、对偶等操作后重新计数并用 Euler 公式检验。"], higherGenus: ["带洞立体用 V-E+F = 2-2g 处理。"] },
    },
    // 展开图与最短路径。
    "unfolding-shortest-path": {
        definitions: ["本条研究把立体表面展开为平面图形后求两点间沿表面最短路径的方法，并给出球面上最短路径（大圆弧）的例外情形。"],
        formulas: ["可展曲面（柱面、锥面、多面体表面）展开后表面上的最短路径对应平面上的线段，长度由两点距离给出。", "圆柱侧面展开：矩形，宽 = 2πr（或所绕部分弧长），高 = h；螺旋路径长 = sqrt((2πr k)^2 + h^2)（绕 k 圈）。", "圆锥侧面展开：扇形，半径 = 母线 l，圆心角 θ = 2πr/l；两点最短距离用扇形内的余弦定理计算。", "球面：最短路径是过两点的大圆的劣弧，长度 = R · α（α 为球心角，cos α = (OA·OB)/R^2），球面不可展。"],
        theorems: ["柱面、锥面与多面体表面是可展曲面，展开保持路径长度，因此最短路径问题化为平面直线段问题。", "多面体上的最短路径可能跨越不同的面序列，必须对所有可能的展开方式分别计算并取最小值。", "球面不可展（Gauss 曲率非零），因此不能用平面展开求最短路径，必须用大圆弧。"],
        generalRequirements: ["必须枚举所有合理的展开方式（跨哪些面、绕哪一侧），再取最小值。", "展开后必须检查所得线段确实落在展开图形内部（否则路径不合法）。"],
        forbiddenErrors: ["【展开方式单一】只按一种展开计算就断言最短。", "【球面展开】把球面展开成平面求最短路径。", "【圆锥圆心角错误】把展开扇形圆心角写成 2π 或 r/l。", "【线段越界】展开后线段跑出展开图形而仍作为路径长度。", "【空间直线混淆】用两点的空间直线距离代替沿表面的最短路径。"],
        parameterConstraints: { developableSurface: "展开法只适用于可展曲面（柱、锥、多面体表面）。", enumerateUnfoldings: "必须比较所有可能的展开方案。", sphereGreatCircle: "球面最短路径为大圆劣弧，长度 R·α。" },
        closureChecks: ["列出所有可能的展开方案并画出展开图。", "在每种展开下计算线段长度并检查线段是否落在图形内。", "取最小值并与空间直线距离比较（应不小于后者）。"],
        scenarioChecks: { cylinderHelix: ["绕圆柱的最短路径展开后为直线，绕多圈时宽取 2πrk。"], coneUnfolding: ["圆锥上两点最短路径在展开扇形中用余弦定理求解。"], cubeAntPath: ["正方体上蚂蚁问题需比较多种跨面展开方式。"], sphericalDistance: ["球面两点距离用球心角与 R·α，不用展开。"] },
    },
};
