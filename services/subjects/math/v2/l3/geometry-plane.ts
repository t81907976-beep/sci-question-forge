import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“几何-平面几何”下的原子 L3 知识项。
// 本分支统一采用欧氏平面综合几何语言：对象是点、线、圆与三角形/四边形等图形，
// 工具是全等相似、圆幂、面积法、变换（反演、螺旋相似）与射影调和性质。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const GEOMETRY_PLANE_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 圆幂定理与根轴：pow(P) = PO^2 - r^2，等幂点集为直线，三圆交于根心。
    "power-of-point-radical-axis": {
        id: "power-of-point-radical-axis", l2Key: "geometry-plane", name: "圆幂定理与根轴", kind: "theorem",
        aliases: ["圆幂定理", "圆幂", "根轴", "power of a point", "radical axis"],
    },
    // Ptolemy 定理与 Ptolemy 不等式：圆内接四边形对角线乘积 = 两组对边乘积之和。
    "ptolemy-theorem": {
        id: "ptolemy-theorem", l2Key: "geometry-plane", name: "Ptolemy 定理与不等式", kind: "theorem",
        aliases: ["托勒密定理", "Ptolemy定理", "Ptolemy theorem", "托勒密不等式"],
    },
    // Menelaus 定理：截线与三角形三边所在直线的交点满足有向比乘积为 -1。
    "menelaus-theorem": {
        id: "menelaus-theorem", l2Key: "geometry-plane", name: "Menelaus 定理", kind: "theorem",
        aliases: ["梅涅劳斯定理", "Menelaus定理", "Menelaus theorem"],
    },
    // Ceva 定理：三条从顶点出发的线共点 ⇔ 有向比乘积为 1，含三角形式。
    "ceva-theorem": {
        id: "ceva-theorem", l2Key: "geometry-plane", name: "Ceva 定理与三角形式", kind: "theorem",
        aliases: ["塞瓦定理", "Ceva定理", "Ceva theorem"],
    },
    // Simson 线：点在外接圆上 ⇔ 到三边的投影共线。
    "simson-line": {
        id: "simson-line", l2Key: "geometry-plane", name: "Simson 线", kind: "theorem",
        aliases: ["Simson线", "西姆松线", "Simson line"],
    },
    // 九点圆与 Euler 线：九点共圆、半径 R/2，O、G、H 共线且 OG:GH = 1:2。
    "nine-point-circle-euler-line": {
        id: "nine-point-circle-euler-line", l2Key: "geometry-plane", name: "九点圆与 Euler 线", kind: "theorem",
        aliases: ["九点圆", "nine-point circle", "Euler线", "欧拉线", "Euler line"],
    },
    // 三角形五心与重心坐标：重心、内心、外心、垂心、旁心的齐次重心坐标表示。
    "triangle-centers-barycentric": {
        id: "triangle-centers-barycentric", l2Key: "geometry-plane", name: "三角形五心与重心坐标", kind: "object",
        aliases: ["三角形五心", "重心坐标", "barycentric coordinates", "triangle centers"],
    },
    // 圆内接四边形判据：对角互补、同侧张角相等、圆幂逆定理。
    "cyclic-quadrilateral-criterion": {
        id: "cyclic-quadrilateral-criterion", l2Key: "geometry-plane", name: "四点共圆判据", kind: "criterion",
        aliases: ["四点共圆", "圆内接四边形", "cyclic quadrilateral"],
    },
    // Stewart 定理与中线、角平分线长公式。
    "stewart-median-bisector-length": {
        id: "stewart-median-bisector-length", l2Key: "geometry-plane", name: "Stewart 定理与中线、角平分线长", kind: "formula",
        aliases: ["Stewart定理", "斯图尔特定理", "Stewart theorem", "中线长公式", "角平分线长公式"],
    },
    // 反演变换：OP·OP' = r^2，圆与直线互换，保角但不保共线。
    "inversion-transformation": {
        id: "inversion-transformation", l2Key: "geometry-plane", name: "反演变换", kind: "object",
        aliases: ["反演", "反演变换", "inversion"],
    },
    // 螺旋相似与 Miquel 点：旋转加位似的复合，中心由两组对应点确定。
    "spiral-similarity-miquel-point": {
        id: "spiral-similarity-miquel-point", l2Key: "geometry-plane", name: "螺旋相似与 Miquel 点", kind: "object",
        aliases: ["螺旋相似", "spiral similarity", "Miquel点", "Miquel point", "密克点"],
    },
    // 调和点列与极点极线：交比 -1，圆的极线方程与 La Hire 定理。
    "harmonic-division-pole-polar": {
        id: "harmonic-division-pole-polar", l2Key: "geometry-plane", name: "调和点列与极点极线", kind: "theorem",
        aliases: ["调和点列", "harmonic division", "极点极线", "pole and polar"],
    },
    // Euler 距离公式：OI^2 = R^2 - 2Rr，推出 Euler 不等式 R ≥ 2r。
    "euler-oi-distance-formula": {
        id: "euler-oi-distance-formula", l2Key: "geometry-plane", name: "Euler 距离公式与 R ≥ 2r", kind: "formula",
        aliases: ["Euler距离公式", "欧拉距离公式", "Euler distance formula", "OI^2=R^2-2Rr"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const GEOMETRY_PLANE_L3_RULES: Record<string, MathV2L3Rules> = {
    // 圆幂定理与根轴：统一处理相交弦、切割线并给出等幂直线。
    "power-of-point-radical-axis": {
        definitions: ["圆幂研究平面上一点相对一个圆的有向量 pow(P) = PO^2 - r^2，它把过 P 的任意直线与圆的两个交点的有向线段乘积统一为同一个不依赖直线的常数；根轴是相对两圆等幂的点集。"],
        formulas: ["圆幂：pow_ω(P) = PO^2 - r^2；P 在圆外时为正，圆上为 0，圆内为负。", "相交弦/割线统一式：过 P 的直线交圆于 A、B，则 有向 PA · PB = pow_ω(P)；P 在圆内时两段异向，取无向长度写作 PA · PB = r^2 - PO^2。", "切割线定理：PT 切圆于 T，则 PT^2 = PA · PB = pow_ω(P)。", "根轴：两圆 x^2+y^2+D_1x+E_1y+F_1 = 0 与 x^2+y^2+D_2x+E_2y+F_2 = 0 的根轴为两式相减所得直线 (D_1-D_2)x + (E_1-E_2)y + (F_1-F_2) = 0。"],
        theorems: ["圆幂定理：过定点 P 的所有直线与圆交点的有向线段乘积都等于 pow_ω(P)，与直线选取无关。", "逆定理：若 PA · PB = PC · PD（有向且 A、B、C、D 中 A、B 与 C、D 分别在两条过 P 的直线上），则 A、B、C、D 四点共圆。", "根轴定理：两个不同心圆的等幂点集是一条垂直于连心线的直线；三个圆心不共线的圆的三条根轴交于一点（根心）。"],
        generalRequirements: ["必须区分 P 在圆内/圆外：写有向乘积时统一符号，写无向长度时按位置取 r^2 - PO^2 或 PO^2 - r^2。", "使用根轴时必须先确认两圆不同心（同心圆无根轴）。"],
        forbiddenErrors: ["【符号错误】P 在圆内时仍写 PA · PB = PO^2 - r^2 而不改符号。", "【逆定理条件遗漏】用 PA · PB = PC · PD 推四点共圆时不检查 P 是两直线交点及点的排列（有向性）。", "【根轴存在性遗漏】对同心圆或重合圆断言存在根轴。", "【根心误设】三圆圆心共线时仍断言三条根轴交于一点（此时三根轴平行或重合）。"],
        parameterConstraints: { circleNondegenerate: "圆必须非退化：r > 0。", pointPositionSign: "圆幂的符号由 P 与圆的位置关系决定。", radicalAxisExistence: "根轴要求两圆不同心；根心要求三圆心不共线。" },
        closureChecks: ["写出 pow_ω(P) = PO^2 - r^2 并核对 P 的位置与符号。", "用同一圆幂值连接不同直线上的乘积关系。", "若用到根轴/根心，验证不同心与圆心不共线条件。"],
        scenarioChecks: { tangentLength: ["求切线长时直接用 PT = sqrt(PO^2 - r^2)，需 P 在圆外。"], concyclicProof: ["证明四点共圆时用圆幂逆定理，注意交点位置与有向比。"], threeCirclesRadicalCenter: ["三圆两两根轴共点于根心，常用于构造等幂点或证明共点。"] },
    },
    // Ptolemy 定理与不等式：共圆等号、一般四点为不等式。
    "ptolemy-theorem": {
        definitions: ["Ptolemy 定理研究圆内接四边形四条边与两条对角线长度之间的乘积恒等式，其一般形式（Ptolemy 不等式）对平面上任意四点成立，等号刻画共圆且顺序正确。"],
        formulas: ["圆内接四边形 ABCD（顶点按圆周顺序）：AC · BD = AB · CD + BC · AD。", "Ptolemy 不等式：平面上任意四点 A、B、C、D 满足 AC · BD ≤ AB · CD + BC · AD。", "广义（推广）形式：托勒密等式可由反演以 A 为心把 B、C、D 映为共线三点后的线段加法得到。"],
        theorems: ["Ptolemy 定理：凸四边形 ABCD 内接于圆 ⇔ AC · BD = AB · CD + BC · AD。", "Ptolemy 不等式：对任意四点成立 AC · BD ≤ AB · CD + BC · AD，等号 ⇔ 四点共圆（或共线）且 B、D 分别在 AC 的两侧、顺序为 A、B、C、D。", "推论：正 n 边形与圆内接四边形的边长比例关系、以及若干三角恒等式（如 sin 加法公式）可由 Ptolemy 推出。"],
        generalRequirements: ["必须按圆周顺序标注顶点：交换顶点顺序会把等式变成不等式。", "使用等号刻画共圆时必须同时验证顶点顺序（凸性）而非仅四点共圆。"],
        forbiddenErrors: ["【顶点顺序错误】把非相邻顶点当作边、用错误配对写成 AB · CD 与 AC · BD 混排。", "【等号条件遗漏】只由 AC · BD = AB · CD + BC · AD 推共圆而不检查顺序/凸性。", "【不等式方向反用】把 Ptolemy 不等式写成 ≥。", "【退化情形忽略】四点共线时把等式当作共圆的证据。"],
        parameterConstraints: { cyclicOrder: "顶点必须按圆周顺序 A、B、C、D 标注。", convexity: "等号形式对应凸圆内接四边形（或共线退化情形）。", positiveLengths: "所有线段取正长度。" },
        closureChecks: ["确认顶点顺序与凸性。", "写出 AC · BD = AB · CD + BC · AD 并代入已知长度。", "若用于证明共圆，说明等号成立且顺序正确。"],
        scenarioChecks: { equilateralTrianglePoint: ["圆上一点到正三角形三顶点距离满足 PA = PB + PC（P 在 BC 所对弧上），是 Ptolemy 的典型推论。"], trigIdentityDerivation: ["用圆内接四边形与 Ptolemy 推导 sin(x+y) = sin x cos y + cos x sin y。"], inequalityUse: ["非共圆四点用 Ptolemy 不等式给出上界估计，等号刻画极值构型。"] },
    },
    // Menelaus 定理：截线共线判据，有向比乘积为 -1。
    "menelaus-theorem": {
        definitions: ["Menelaus 定理研究一条不过顶点的直线与三角形三边所在直线的交点，把三点共线翻译为三个有向比的乘积条件，是共线问题的标准判据。"],
        formulas: ["有向形式：直线交 BC、CA、AB 所在直线于 D、E、F，则 (BD/DC) · (CE/EA) · (AF/FB) = -1（有向比）。", "无向形式：|BD/DC| · |CE/EA| · |AF/FB| = 1，且三点中恰有一个或三个在边的延长线上。", "面积法写法：BD/DC = [ABD]/[ADC]（同底等高比），便于与 Ceva 联合使用。"],
        theorems: ["Menelaus 定理：D、E、F 分别在 BC、CA、AB 所在直线上且不为顶点，则三点共线 ⇔ (BD/DC)(CE/EA)(AF/FB) = -1（有向比）。", "逆定理成立：乘积为 -1 时三点必共线，这是常用的共线证明工具。", "与 Ceva 的对偶关系：共点对应乘积 +1，共线对应乘积 -1（有向比）。"],
        generalRequirements: ["必须固定绕行方向并全程使用有向比，或使用无向比时显式说明延长线上的点数为奇数。", "截线不得过三角形顶点，交点不得与顶点重合。"],
        forbiddenErrors: ["【符号错误】用有向比时把乘积写成 +1（该值为共点条件）。", "【延长线奇偶性遗漏】无向形式下未说明外分点个数为奇数。", "【比值顺序混乱】把 BD/DC 与 DC/BD 混用导致乘积取倒数。", "【退化情形】截线平行于某边时仍强行使用有限交点。"],
        parameterConstraints: { orientedRatios: "有向比需固定 B→C、C→A、A→B 的方向。", nonVertex: "D、E、F 不能与顶点重合。", transversalNotThroughVertex: "截线不过顶点，且与三边所在直线均有交点。" },
        closureChecks: ["标出三个交点并统一比值方向。", "计算 (BD/DC)(CE/EA)(AF/FB) 并核对为 -1（有向）。", "如用逆定理证共线，说明比值方向与外分点情形。"],
        scenarioChecks: { collinearityProof: ["证明三点共线时优先用 Menelaus 逆定理。"], combinedWithCeva: ["Ceva 与 Menelaus 联用可处理共点与共线交替出现的构型（如完全四边形）。"], massPointAlternative: ["质点法/面积法可作为验算手段核对比值。"] },
    },
    // Ceva 定理：共点判据，含 sin 三角形式。
    "ceva-theorem": {
        definitions: ["Ceva 定理研究从三角形三个顶点分别引向对边的三条线段（Ceva 线）何时共点，把共点性翻译为三个有向比的乘积等于 1，并有等价的正弦（三角）形式。"],
        formulas: ["有向形式：D ∈ BC、E ∈ CA、F ∈ AB，则 AD、BE、CF 共点 ⇔ (BD/DC)(CE/EA)(AF/FB) = 1。", "三角形式：AD、BE、CF 共点 ⇔ (sin∠BAD / sin∠DAC)(sin∠CBE / sin∠EBA)(sin∠ACF / sin∠FCB) = 1。", "重心坐标写法：共点交点的齐次重心坐标可由三个比值直接读出。"],
        theorems: ["Ceva 定理及其逆定理：三条 Ceva 线共点 ⇔ 有向比乘积为 1；逆定理是共点证明的标准工具。", "三角形式 Ceva（Jacobi 型）：用张角正弦比替代边比，适合处理由角度条件给出的构型（如等角共轭）。", "推论：中线（比值全为 1）共点于重心；角平分线（比值 c/b 等）共点于内心；高线共点于垂心。"],
        generalRequirements: ["必须使用有向比或明确点是否落在边的延长线上（外 Ceva 情形乘积仍为 1，但外分点个数为偶数）。", "三角形式必须使用顶点处被 Ceva 线分割的两个张角之比，不能用其他角替代。"],
        forbiddenErrors: ["【与 Menelaus 混用】把共点条件写成乘积 -1。", "【比值方向错误】把 BD/DC 写反导致条件变为倒数。", "【三角形式取角错误】用 ∠ABD 之类不在同一顶点的角构造正弦比。", "【退化情形】Ceva 线平行（交于无穷远点）时仍断言存在有限交点。"],
        parameterConstraints: { orientedRatios: "统一使用 B→C、C→A、A→B 方向的有向比。", cevianEndpoints: "D、E、F 位于对边所在直线上且异于顶点。", trigFormAngles: "三角形式中每个正弦比必须取同一顶点被分成的两个角。" },
        closureChecks: ["写出三个有向比并计算乘积是否为 1。", "必要时改用 sin 形式核对由角度给出的条件。", "如证共点，说明逆定理适用条件（点不在顶点、非平行退化）。"],
        scenarioChecks: { concurrencyProof: ["中线、角平分线、高线共点均可由 Ceva 直接验证。"], isogonalConjugate: ["等角共轭点对由三角形式 Ceva 给出，用于内心/垂心与外心的对应。"], externalCevian: ["含外分点时使用有向比，外分点个数为偶数才可能共点。"] },
    },
    // Simson 线：外接圆上点的三个垂足共线。
    "simson-line": {
        definitions: ["Simson 线研究一点向三角形三边所在直线作垂足后三垂足的共线性，并给出该性质与点落在外接圆上的等价刻画，是圆与垂足构型的核心定理。"],
        formulas: ["设 P 向 BC、CA、AB 的垂足为 X、Y、Z：P 在 △ABC 外接圆上 ⇔ X、Y、Z 共线（此直线称 P 的 Simson 线）。", "Steiner 线：P 关于三边的对称点共线，该直线过垂心 H，且与 Simson 线平行、位似比为 2（以 P 为位似中心）。", "两点 Simson 线的夹角等于这两点在外接圆上所对弧的圆周角（弧的一半）。"],
        theorems: ["Simson 定理（及逆定理）：P 的三垂足共线 ⇔ P 在 △ABC 的外接圆上。", "Simson 线的包络是三角形的 Steiner 三尖内摆线（deltoid），且 Simson 线始终平分 PH（H 为垂心）。", "特例：P 取顶点时 Simson 线退化为该顶点处的高线所在直线的相关退化情形，需单独讨论。"],
        generalRequirements: ["垂足必须取到三边所在直线（可能落在延长线上）。", "使用逆定理断言共圆时必须验证三垂足确实共线且 P 不与顶点重合。"],
        forbiddenErrors: ["【垂足范围限制】要求三垂足都落在边的内部，从而错判构型。", "【共圆前提遗漏】对任意点断言三垂足共线。", "【Simson 与 Steiner 混淆】把关于三边的对称点共线的直线当作 Simson 线（两者相差以 P 为心的 2 倍位似）。", "【退化忽略】P 与顶点重合时仍套用一般结论。"],
        parameterConstraints: { pointOnCircumcircle: "共线性要求 P 在外接圆上。", feetOnLines: "垂足取在三边所在直线上，允许落在延长线。", nondegenerateTriangle: "△ABC 非退化（三点不共线）。" },
        closureChecks: ["作出三条垂足并检验共线。", "如用逆定理，说明 P 落在外接圆上。", "涉及 Steiner 线时核对过垂心与 2 倍位似关系。"],
        scenarioChecks: { simsonAngle: ["两点 Simson 线夹角等于对应弧的圆周角，用于角度追踪。"], steinerLineThroughOrthocenter: ["Steiner 线过垂心，常用于把 P 与 H 联系起来。"], cyclicProofBySimson: ["用垂足共线反推四点共圆或点在外接圆上。"] },
    },
    // 九点圆与 Euler 线：九点共圆、半径 R/2、O、G、H 共线。
    "nine-point-circle-euler-line": {
        definitions: ["九点圆研究三角形中三边中点、三条高的垂足、以及顶点与垂心连线中点这九个点的共圆性；Euler 线研究外心 O、重心 G、垂心 H 的共线关系，两者通过同一位似结构联系。"],
        formulas: ["九点圆半径 = R/2，圆心 N 为 OH 的中点，且 N 也是九点圆与外接圆之间以 H 为心、比 1/2 的位似像的中心。", "Euler 线：O、G、H 共线，OG : GH = 1 : 2，向量式 OH = OA + OB + OC（以 O 为原点），OG = (OA+OB+OC)/3。", "OH^2 = R^2(1 - 8 cos A cos B cos C)，OH^2 = 9R^2 - (a^2+b^2+c^2)。"],
        theorems: ["九点圆定理：三边中点、三高垂足、顶点与垂心连线的中点共九点在同一圆上，半径为 R/2，圆心为 OH 中点。", "Euler 线定理：O、G、H 共线且 OG : GH = 1 : 2；等边三角形时三心重合，Euler 线退化。", "Feuerbach 定理：九点圆与内切圆内切、与三个旁切圆外切。"],
        generalRequirements: ["必须使用非等边三角形才谈得上 Euler 线（等边时三心重合退化为一点）。", "九点圆半径与圆心必须相对同一外接圆半径 R 与垂心 H 描述。"],
        forbiddenErrors: ["【比例反用】把 OG : GH 写成 2 : 1。", "【圆心错误】声称九点圆圆心是 O 与 G 的中点或 G 与 H 的中点。", "【内心在 Euler 线上】断言内心 I 一般也在 Euler 线上（只有等腰/等边时才成立）。", "【半径错误】把九点圆半径写成 R 或 R/3。"],
        parameterConstraints: { nondegenerate: "三角形非退化；等边时 Euler 线退化。", radiusHalf: "九点圆半径为 R/2。", centerMidpointOH: "九点圆圆心是 OH 的中点。" },
        closureChecks: ["确认九点的构造（中点、垂足、顶点-垂心中点）。", "核对九点圆半径 R/2 与圆心为 OH 中点。", "使用 Euler 线时验证 OG : GH = 1 : 2 与向量式 OH = OA+OB+OC。"],
        scenarioChecks: { homothetyH: ["以 H 为心、比 1/2 的位似把外接圆映为九点圆，是统一证明的主线。"], feuerbachTangency: ["涉及内切圆与九点圆相切时引用 Feuerbach 定理。"], isoscelesDegeneracy: ["等腰三角形中 I 落在 Euler 线上，等边时 O = G = H = I。"] },
    },
    // 三角形五心与重心坐标：齐次重心坐标统一表示各心。
    "triangle-centers-barycentric": {
        definitions: ["三角形五心与重心坐标研究如何用相对三角形 ABC 的齐次坐标 (x : y : z)（对应质点权重）统一表示重心、内心、外心、垂心与旁心，并把共线、共点问题化为线性代数计算。"],
        formulas: ["齐次重心坐标：点 P = (x : y : z) 表示位置向量 P = (xA + yB + zC)/(x+y+z)，要求 x+y+z ≠ 0。", "常见心：G = (1 : 1 : 1)；I = (a : b : c)；I_A = (-a : b : c)；O = (a^2(b^2+c^2-a^2) : b^2(c^2+a^2-b^2) : c^2(a^2+b^2-c^2))；H = (tan A : tan B : tan C)（等价地 ((b^2+c^2-a^2)^{-1} : ... ) 的齐次化形式）。", "共线判据：三点 P_i = (x_i : y_i : z_i) 共线 ⇔ 3×3 行列式 det[x_i, y_i, z_i] = 0。", "边上分点：D ∈ BC 且 BD : DC = m : n ⇔ D = (0 : n : m)。"],
        theorems: ["重心坐标唯一（在整体伸缩意义下）：每个不在无穷远直线上的点有唯一齐次重心坐标。", "Ceva 共点、Menelaus 共线均可写成重心坐标的行列式条件，从而机械化验证。", "等角共轭：P = (x : y : z) 的等角共轭为 (a^2/x : b^2/y : c^2/z)；等截共轭为 (1/x : 1/y : 1/z)（分量非零时）。"],
        generalRequirements: ["必须声明坐标是齐次的（整体倍数不改变点），且 x+y+z ≠ 0（否则为无穷远点）。", "涉及外心、垂心时必须使用边长 a、b、c 或角的显式表达式，不能凭直觉写权重。"],
        forbiddenErrors: ["【归一化遗漏】把齐次坐标当作绝对坐标直接相加，未除以 x+y+z。", "【内心与外心公式混淆】把 O 写成 (a : b : c) 或把 I 写成含 a^2 的表达式。", "【符号错误】旁心坐标未取负号（如把 I_A 写成 (a : b : c)）。", "【无穷远点忽略】x+y+z = 0 时仍当作普通点处理。"],
        parameterConstraints: { homogeneity: "坐标齐次，整体乘非零常数表示同一点。", normalizationNonzero: "普通点要求 x+y+z ≠ 0。", sideLengths: "外心/垂心/内心坐标必须用 a、b、c 或角函数正确表达。" },
        closureChecks: ["写出各点的齐次重心坐标并说明归一化。", "用行列式验证共线或用 Ceva 条件验证共点。", "把结果坐标还原为长度比或几何位置进行校验。"],
        scenarioChecks: { concurrencyByDeterminant: ["三线共点可化为系数矩阵行列式为零的代数条件。"], conjugatePoints: ["等角共轭/等截共轭在坐标下是分量取倒数型运算，用于配对已知心。"], cevianRatios: ["由 D = (0 : n : m) 直接读出 BD : DC = m : n。"] },
    },
    // 四点共圆判据：对角互补、同侧张角相等、圆幂逆定理。
    "cyclic-quadrilateral-criterion": {
        definitions: ["四点共圆判据研究平面上四点何时落在同一圆上，给出角度型（对角互补、同侧张角相等）、长度型（圆幂逆定理、Ptolemy 等号）与解析型（四阶行列式）等价条件。"],
        formulas: ["角度判据：凸四边形 ABCD 共圆 ⇔ ∠A + ∠C = 180°（等价 ∠B + ∠D = 180°）。", "同侧张角判据：A、D 在直线 BC 同侧时，A、B、C、D 共圆 ⇔ ∠BAC = ∠BDC。", "圆幂判据：AB 与 CD 交于 P 时，四点共圆 ⇔ 有向 PA · PB = PC · PD。", "解析判据：四点 (x_i, y_i) 共圆或共线 ⇔ det[[x_i^2+y_i^2, x_i, y_i, 1]] = 0（4×4 行列式）。"],
        theorems: ["圆内接四边形定理及其逆定理：凸四边形对角互补 ⇔ 四点共圆。", "圆周角定理及其逆：同弧（同侧）所对张角相等 ⇔ 四点共圆。", "圆幂逆定理：两直线交点处的有向乘积相等 ⇔ 四点共圆；Ptolemy 等号也给出等价刻画（需顶点顺序）。"],
        generalRequirements: ["使用角度判据必须说明四边形凸性或点的同侧/异侧关系。", "使用圆幂判据必须使用有向乘积（交点在线段内部与外部符号不同）。"],
        forbiddenErrors: ["【凸性遗漏】对非凸或顶点顺序错误的四边形使用对角互补判据。", "【同侧异侧混淆】把异侧点的张角相等当作共圆条件（异侧应为互补）。", "【有向性遗漏】圆幂判据只比较无向长度乘积。", "【共线退化忽略】四点共线时解析行列式也为零，需单独排除。"],
        parameterConstraints: { convexOrder: "角度判据要求顶点按凸四边形顺序。", sameSideCondition: "张角判据要求两点位于所张弦的同侧。", orientedProducts: "圆幂判据使用有向乘积。" },
        closureChecks: ["选择角度型或长度型判据并核对其前提（凸性/同侧/有向）。", "给出共圆结论后指明圆心或半径的确定方式。", "排除四点共线的退化情形。"],
        scenarioChecks: { angleChasing: ["角追踪证明中先建立一组共圆四点，再传递圆周角。"], powerOfPointConverse: ["由线段乘积关系反推共圆，常与相似三角形互换使用。"], analyticCheck: ["坐标已知时用 4×4 行列式快速判定共圆或共线。"] },
    },
    // Stewart 定理与中线、角平分线长公式。
    "stewart-median-bisector-length": {
        definitions: ["Stewart 定理给出三角形一顶点到对边上任一点的连线长度与两侧分段长度的关系，是中线长、角平分线长等公式的统一来源。"],
        formulas: ["Stewart 定理：D 在 BC 上，BD = m、DC = n、BC = m + n，则 AD^2 = (b^2 m + c^2 n)/(m+n) - m n，其中 b = CA、c = AB。", "中线长（m = n = a/2）：m_a^2 = (2b^2 + 2c^2 - a^2)/4。", "角平分线长（BD : DC = c : b）：t_a^2 = bc - m n = bc[1 - a^2/(b+c)^2]，即 t_a^2 = bc - a^2 bc/(b+c)^2。", "角平分线定理：AD 平分 ∠A ⇔ BD/DC = AB/AC = c/b（外角平分线为外分点，比值取负）。"],
        theorems: ["Stewart 定理（等价于 D 处的余弦定理配对消元，或向量恒等式 AD = (n·AB + m·AC)/(m+n) 取模平方）。", "推论：中线长公式与中线定理（AB^2 + AC^2 = 2AD^2 + BC^2/2，D 为 BC 中点）。", "推论：角平分线长公式与角平分线定理（内分点比 c : b、外分点比 -c : b）。"],
        generalRequirements: ["必须明确 D 在 BC 上的位置及分段方向；D 在延长线上时 m 或 n 取负（有向长度）。", "使用角平分线公式前必须确认 AD 确为角平分线（否则只能用一般 Stewart）。"],
        forbiddenErrors: ["【项配错】把 Stewart 写成 (b^2 n + c^2 m)/(m+n) - mn（b、c 与 m、n 配对反了）。", "【减项遗漏】漏掉 - m n 项。", "【中线公式系数错误】把 m_a^2 写成 (2b^2+2c^2-a^2)/2 或 (b^2+c^2-a^2)/4。", "【外分点符号遗漏】D 在延长线上时仍用正长度代入。"],
        parameterConstraints: { pointOnSide: "D 在 BC 所在直线上，内分时 m, n > 0，外分时取有向长度。", triangleInequality: "a、b、c 必须满足三角不等式。", bisectorHypothesis: "角平分线公式仅在 AD 平分 ∠A 时适用。" },
        closureChecks: ["确认 b、c 与 m、n 的对应关系（b 对 BD 侧、c 对 DC 侧按公式核对）。", "代入特例（中点、角平分线）验证公式一致性。", "检查所得长度为正且满足三角不等式。"],
        scenarioChecks: { medianLength: ["求中线长时直接用 m_a^2 = (2b^2+2c^2-a^2)/4。"], bisectorLength: ["求角平分线长时先用角平分线定理得 m、n，再代入 Stewart。"], externalDivision: ["外角平分线或延长线上的点需用有向长度并检查符号。"] },
    },
    // 反演变换：圆与直线互换，保角。
    "inversion-transformation": {
        definitions: ["反演变换研究以定点 O 为中心、半径 r 的反演 P ↦ P'（O、P、P' 共线且 OP · OP' = r^2），它把圆与直线的族统一起来，是处理相切、共圆构型的强力工具。"],
        formulas: ["定义：OP · OP' = r^2，P' 在射线 OP 上（O 除外）；复数形式（O 为原点）：z ↦ r^2 / conj(z)。", "距离公式：P'Q' = r^2 · PQ / (OP · OQ)。", "像的分类：过 O 的直线 ↦ 自身；不过 O 的直线 ↦ 过 O 的圆；过 O 的圆 ↦ 不过 O 的直线；不过 O 的圆 ↦ 不过 O 的圆。", "反演圆的半径关系：圆心 A、半径 ρ 且 O 的幂 p = OA^2 - ρ^2 ≠ 0 时，像圆半径为 r^2 ρ / |p|。"],
        theorems: ["反演是对合变换（作用两次为恒等），在 O 处无定义（需加入无穷远点 ∞ 作为 O 的像）。", "反演保角（共形，方向反转）：两曲线交角在反演下不变；正交圆族反演后仍正交。", "反演不保共线与不保距离比，但保交比与保相切（相切图形的像仍相切，除切点为 O 的情形化为平行）。"],
        generalRequirements: ["必须明确反演中心与半径；中心 O 本身无像，需引入 ∞。", "必须按图形是否过 O 判断像的类型（圆或直线），不能一律映为圆。"],
        forbiddenErrors: ["【类型判断错误】声称任何圆的反演像都是圆（过 O 的圆映为直线）。", "【中心处取像】对 O 直接取像或让 O 落在待反演图形上而不作特殊说明。", "【保共线误设】断言反演保共线或保距离。", "【距离公式遗漏】用 P'Q' = PQ 或缺少 r^2/(OP·OQ) 因子。"],
        parameterConstraints: { center: "反演中心 O 固定且不属于被反演点集（O 的像为 ∞）。", positiveRadius: "反演半径 r > 0；负幂反演需额外说明为反演加中心对称。", powerNonzero: "圆的像半径公式要求 O 对该圆的幂 p ≠ 0（即 O 不在圆上）。" },
        closureChecks: ["选定反演中心与半径，并说明各图形是否过中心。", "写出像的类型（圆/直线）与关键量（半径、位置）。", "反演回原图并核对结论（对合性）。"],
        scenarioChecks: { tangencyProblems: ["处理多圆相切（如 Descartes 圆/Apollonius 问题）时取切点为反演中心把圆化为平行直线。"], ptolemyByInversion: ["以某顶点为反演中心可把 Ptolemy 定理化为三点共线的线段加法。"], orthogonalCircles: ["与反演圆正交的圆在反演下不变，用于构造不动圆。"] },
    },
    // 螺旋相似与 Miquel 点：旋转位似复合与完全四边形交点。
    "spiral-similarity-miquel-point": {
        definitions: ["螺旋相似研究以定点为中心的旋转与位似的复合（相似变换中保定向的一类），Miquel 点则是完全四边形中四个三角形外接圆的公共点，它正是相关螺旋相似的中心。"],
        formulas: ["复数表示：以 O 为中心、角 θ、比 k 的螺旋相似为 z ↦ O + k e^{iθ}(z - O)；由两组对应点 A ↦ B、C ↦ D 唯一确定（当 A ≠ C）。", "中心确定：把 AC 映到 BD 的螺旋相似中心是 △(AB ∩ CD, A, C) 与 △(AB ∩ CD, B, D) 两外接圆的第二交点，也等于 (AD ∩ BC) 相关两外接圆的第二交点。", "存在性配对：若螺旋相似把 A→B、C→D，则同中心的螺旋相似把 A→C、B→D。"],
        theorems: ["螺旋相似的中心 M 满足 △MAC ∽ △MBD（保定向），即 MA/MB = MC/MD 且 ∠AMB = ∠CMD。", "Miquel 定理（完全四边形）：四条一般位置直线所成的四个三角形的外接圆共点（Miquel 点），且该点在四条直线的相关外接圆上。", "Miquel 定理（三角形版本）：若 D、E、F 分别在 BC、CA、AB 所在直线上，则 △AEF、△BFD、△CDE 的外接圆共点。"],
        generalRequirements: ["必须验证对应关系保定向（否则是反相似，需用反射复合）。", "使用完全四边形 Miquel 点时必须要求四条直线处于一般位置（无两条平行、无三线共点）。"],
        forbiddenErrors: ["【定向忽略】把反相似（含反射）当作螺旋相似处理。", "【中心构造错误】把两条对应线段的交点当作螺旋相似中心。", "【退化情形】A = C 或对应点重合时仍断言中心唯一。", "【共点前提遗漏】完全四边形中出现三线共点或平行时仍断言 Miquel 点存在。"],
        parameterConstraints: { orientationPreserving: "螺旋相似保定向，比 k > 0、角 θ 有向。", distinctSourcePoints: "由两组对应点确定中心要求源点互异。", generalPositionLines: "完全四边形要求四直线一般位置。" },
        closureChecks: ["写出螺旋相似的中心、角与比，或用复数式表示。", "验证 △MAC ∽ △MBD（角相等且比相等）。", "如使用 Miquel 点，指出其所在的外接圆并核对共点。"],
        scenarioChecks: { similarTrianglePairs: ["出现两对相似三角形共顶点时优先寻找螺旋相似中心。"], completeQuadrilateral: ["完全四边形中 Miquel 点常与 Simson 线、Newton 线构型联动。"], twoCirclesSecondIntersection: ["两圆第二交点通常就是把一条弦映到另一条弦的螺旋相似中心。"] },
    },
    // 调和点列与极点极线：交比 -1、极线方程与 La Hire 定理。
    "harmonic-division-pole-polar": {
        definitions: ["调和点列研究一条直线上四点交比为 -1 的构型；极点极线研究点与直线相对一个圆（或圆锥曲线）的对偶配对，两者通过完全四边形的调和性质紧密相连。"],
        formulas: ["调和条件：(A, B; C, D) = (AC/CB) / (AD/DB) = -1，即 C、D 内外分 AB 且比值相同。", "调和中项关系：C、D 调和分割 AB ⇔ 2/AB = 1/AC + 1/AD（以 A 为原点的有向长度）。", "圆 x^2 + y^2 = r^2 关于点 P(x_0, y_0) 的极线：x x_0 + y y_0 = r^2；P 在圆上时极线为切线。", "极线的几何构造：过 P 作两条割线，四个交点构成完全四边形，其对角点连线即为 P 的极线。"],
        theorems: ["La Hire 定理：P 在 Q 的极线上 ⇔ Q 在 P 的极线上；因此点与极线构成对合的对偶配对。", "调和性质：P 的极线与过 P 的割线交于 R 时，(A, B; P, R) = -1（A、B 为割线与圆的交点）；即极线是调和共轭点的轨迹。", "自极三角形：完全四边形的对角三角形关于圆自极；调和点列在射影变换（含中心投影）下不变。"],
        generalRequirements: ["必须使用有向长度或有向交比，符号是调和条件的关键。", "极线概念必须相对指定的圆或圆锥曲线；点在圆内/圆外都可定义极线（圆内时极线不与圆相交）。"],
        forbiddenErrors: ["【符号遗漏】把调和条件写成交比 +1 或只用无向比。", "【极线与切线混淆】对圆外点把极线当作切线本身（极线是两切点连线）。", "【极线公式错误】把极线写成 x x_0 + y y_0 = r 或 x_0^2 + y_0^2 = r^2 之类。", "【La Hire 方向单侧】只用一个方向而不承认对偶等价性。"],
        parameterConstraints: { orientedCrossRatio: "交比使用有向长度计算。", conicReference: "极点极线必须相对固定的圆或圆锥曲线。", pointNotCenter: "圆心的极线是无穷远直线，需单独处理。" },
        closureChecks: ["写出四点的有向交比并核对是否为 -1。", "写出极线方程或用完全四边形构造极线。", "利用 La Hire 定理在点与线之间对偶转换并核验结论。"],
        scenarioChecks: { tangentChordPolar: ["圆外点的极线是两条切线的切点连线，用于切线与弦的转换。"], harmonicInCompleteQuadrilateral: ["完全四边形的对角点给出调和点列，是调和性的标准来源。"], projectiveInvariance: ["中心投影保交比，可把复杂构型投影为便于计算的位置。"] },
    },
    // Euler 距离公式：OI^2 = R^2 - 2Rr 与 R ≥ 2r。
    "euler-oi-distance-formula": {
        definitions: ["Euler 距离公式给出三角形外心与内心（或旁心）之间距离与外接圆半径 R、内切圆半径 r 的关系，并直接推出 Euler 不等式 R ≥ 2r。"],
        formulas: ["OI^2 = R^2 - 2Rr（O 外心、I 内心）。", "旁心版本：OI_A^2 = R^2 + 2R r_A。", "配套关系：r = 4R sin(A/2) sin(B/2) sin(C/2)，S = rs = abc/(4R)（S 面积、s 半周长）。", "Euler 不等式：R ≥ 2r，等号 ⇔ 三角形等边。"],
        theorems: ["Euler 距离定理：OI^2 = R^2 - 2Rr；由 OI^2 ≥ 0 立即得到 Euler 不等式 R ≥ 2r，等号当且仅当 O = I（等边）。", "旁心形式 OI_A^2 = R^2 + 2R r_A 表明外心到旁心的距离总大于 R。", "推论：给定 R、r 时内心位置的可行域是以 O 为心、半径 sqrt(R^2 - 2Rr) 的圆（需 R ≥ 2r）。"],
        generalRequirements: ["必须使用同一三角形的 R、r（外接圆与内切圆半径），不能混用旁切圆半径。", "使用 R ≥ 2r 时必须说明等号条件为等边三角形。"],
        forbiddenErrors: ["【符号错误】把 OI^2 写成 R^2 + 2Rr（该式对应旁心）。", "【不等式方向反用】写成 r ≥ 2R 或 R ≤ 2r。", "【等号条件缺失】断言 R = 2r 对等腰三角形成立。", "【半径混用】把 r 换成旁切圆半径 r_A 仍用内心公式。"],
        parameterConstraints: { validTriangle: "a、b、c 满足三角不等式，三角形非退化。", radiiPositive: "R > 0、r > 0。", equalityEquilateral: "R = 2r 当且仅当等边。" },
        closureChecks: ["确认 R、r 的定义与取值。", "代入 OI^2 = R^2 - 2Rr 并检查非负性。", "如用于不等式，说明等号成立的等边条件。"],
        scenarioChecks: { eulerInequalityUse: ["证明含 R、r 的不等式时先用 R ≥ 2r 缩放。"], excenterDistance: ["涉及旁心距离时改用 OI_A^2 = R^2 + 2R r_A。"], existenceOfTriangle: ["给定 R、r 判断三角形是否存在时用 R ≥ 2r 作必要条件。"] },
    },
};
