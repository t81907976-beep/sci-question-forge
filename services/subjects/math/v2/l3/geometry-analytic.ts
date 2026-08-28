import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“几何-解析几何”下的原子 L3 知识项。
// 本分支统一采用坐标语言：平面用直角坐标/极坐标/参数方程处理直线、圆与圆锥曲线，
// 空间用向量与坐标处理平面、直线与二次曲面。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const GEOMETRY_ANALYTIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // 直线方程与点线距离：各种式子的适用范围与距离、夹角公式。
    "line-equation-point-distance": {
        id: "line-equation-point-distance", l2Key: "geometry-analytic", name: "直线方程与点到直线距离", kind: "formula",
        aliases: ["点到直线距离", "point-line distance"],
    },
    // 圆的方程与直线-圆位置关系：判别与弦长。
    "circle-equation-line-circle-position": {
        id: "circle-equation-line-circle-position", l2Key: "geometry-analytic", name: "圆的方程与直线圆位置关系", kind: "criterion",
        aliases: ["直线与圆位置关系", "line circle intersection", "圆与圆位置关系"],
    },
    // 圆锥曲线标准方程：焦点、准线、离心率与统一定义。
    "conic-standard-focus-directrix": {
        id: "conic-standard-focus-directrix", l2Key: "geometry-analytic", name: "圆锥曲线标准方程与焦点准线", kind: "object",
        aliases: ["圆锥曲线", "椭圆标准方程", "双曲线标准方程", "抛物线标准方程", "conic section"],
    },
    // 焦半径、通径与焦点弦长公式。
    "focal-radius-chord-formula": {
        id: "focal-radius-chord-formula", l2Key: "geometry-analytic", name: "焦半径与焦点弦公式", kind: "formula",
        aliases: ["焦半径", "焦半径公式", "焦点弦长", "通径", "focal chord"],
    },
    // 弦长公式与点差法中点弦。
    "chord-length-midpoint-difference-method": {
        id: "chord-length-midpoint-difference-method", l2Key: "geometry-analytic", name: "弦长公式与点差法中点弦", kind: "algorithm",
        aliases: ["弦长公式", "点差法", "中点弦", "chord length formula", "midpoint chord"],
    },
    // 圆锥曲线的切线与极线（切点弦）方程。
    "conic-tangent-polar-chord": {
        id: "conic-tangent-polar-chord", l2Key: "geometry-analytic", name: "圆锥曲线的切线与切点弦方程", kind: "formula",
        aliases: ["切线方程", "圆锥曲线切线", "切点弦", "极线方程", "chord of contact", "tangent line to conic", "polar line"],
    },
    // 轨迹方程的求法与完备性检验。
    "locus-equation-method": {
        id: "locus-equation-method", l2Key: "geometry-analytic", name: "轨迹方程的求法与检验", kind: "algorithm",
        aliases: ["轨迹方程", "参数法求轨迹"],
    },
    // 二次曲线一般方程的不变量与分类。
    "conic-general-equation-invariants": {
        id: "conic-general-equation-invariants", l2Key: "geometry-analytic", name: "二次曲线一般方程的不变量与分类", kind: "criterion",
        aliases: ["二次曲线一般方程", "二次曲线分类", "conic classification", "invariants of conic"],
    },
    // 极坐标方程与参数方程。
    "polar-parametric-equations": {
        id: "polar-parametric-equations", l2Key: "geometry-analytic", name: "极坐标方程与参数方程", kind: "object",
        aliases: ["极坐标方程", "圆锥曲线极坐标方程", "polar equation", "parametric equation"],
    },
    // 空间平面与直线方程。
    "space-plane-line-equations": {
        id: "space-plane-line-equations", l2Key: "geometry-analytic", name: "空间平面与直线方程", kind: "object",
        aliases: ["平面方程", "空间直线方程", "plane equation", "line in space"],
    },
    // 空间距离与夹角的向量计算。
    "space-distance-angle-vector": {
        id: "space-distance-angle-vector", l2Key: "geometry-analytic", name: "空间距离与夹角的向量公式", kind: "formula",
        aliases: ["点到平面距离坐标法", "点到直线距离空间", "异面直线距离向量法", "二面角坐标法", "space distance formula"],
    },
    // 二次曲面的化简与分类。
    "quadric-surface-classification": {
        id: "quadric-surface-classification", l2Key: "geometry-analytic", name: "二次曲面的化简与分类", kind: "criterion",
        aliases: ["二次曲面", "二次曲面分类", "quadric surface"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const GEOMETRY_ANALYTIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // 直线方程与点到直线距离：式子的适用范围与距离/夹角公式。
    "line-equation-point-distance": {
        definitions: ["本条研究平面直线的各种代数表示及其适用范围，以及点到直线的距离、两平行线距离和两直线夹角的计算公式。"],
        formulas: ["点斜式 y - y_0 = k(x - x_0)（不能表示垂直于 x 轴的直线）；斜截式 y = kx + b；两点式 (y-y_1)/(y_2-y_1) = (x-x_1)/(x_2-x_1)（要求 x_1 ≠ x_2, y_1 ≠ y_2）；一般式 Ax + By + C = 0（A、B 不同时为 0，可表示所有直线）。", "点到直线距离：d = |A x_0 + B y_0 + C| / sqrt(A^2 + B^2)。", "两平行线 Ax+By+C_1 = 0 与 Ax+By+C_2 = 0 的距离：d = |C_1 - C_2| / sqrt(A^2+B^2)（系数须先化为相同）。", "夹角：tan θ = |(k_2 - k_1)/(1 + k_1 k_2)|（k_1 k_2 ≠ -1）；一般式下 cos θ = |A_1A_2 + B_1B_2| / (sqrt(A_1^2+B_1^2) sqrt(A_2^2+B_2^2))。", "平行 ⇔ A_1B_2 - A_2B_1 = 0；垂直 ⇔ A_1A_2 + B_1B_2 = 0（等价 k_1 k_2 = -1，斜率存在时）。"],
        theorems: ["一般式 Ax+By+C = 0 与平面直线一一对应（系数整体伸缩视为同一条直线），是唯一无遗漏的表示。", "点到直线距离公式可由投影或 Cauchy 不等式取等条件导出，且给出该直线上距离最小的垂足点。", "过定点直线系：过 l_1 ∩ l_2 的直线可写为 A_1x+B_1y+C_1 + λ(A_2x+B_2y+C_2) = 0（不含 l_2 本身）。"],
        generalRequirements: ["必须讨论斜率不存在（垂直于 x 轴）的情形，或直接使用一般式避免遗漏。", "使用平行线距离公式前必须把两式的 A、B 系数化为一致。"],
        forbiddenErrors: ["【斜率不存在遗漏】用点斜式或斜截式讨论时漏掉垂直直线情形。", "【距离公式分母错误】写成 |Ax_0+By_0+C|/sqrt(A^2+B^2+C^2) 或漏绝对值。", "【平行线距离未同系数】直接用 |C_1-C_2|/sqrt(A^2+B^2) 而两式系数不成比例。", "【垂直条件误用】在斜率不存在时仍用 k_1k_2 = -1 判定垂直。", "【直线系遗漏】用 l_1 + λ l_2 表示过交点的直线时未说明取不到 l_2。"],
        parameterConstraints: { generalFormNonzero: "一般式要求 A、B 不同时为 0。", slopeExistence: "点斜式/斜截式要求斜率存在。", parallelSameCoefficients: "平行线距离公式要求两式 A、B 相同。" },
        closureChecks: ["确认所用方程形式能覆盖题目中的所有直线（含垂直情形）。", "代入点坐标验证距离/夹角计算。", "核对平行、垂直条件所用判据与斜率存在性一致。"],
        scenarioChecks: { verticalLine: ["垂直于 x 轴的直线写成 x = x_0，并单独讨论其距离与夹角。"], symmetricPoint: ["求点关于直线的对称点时联立垂直与中点条件。"], lineFamilyThroughIntersection: ["过两直线交点的问题用直线系参数 λ 简化，最后检验漏掉的直线。"] },
    },
    // 圆的方程与直线圆位置关系：判别、切线与弦长。
    "circle-equation-line-circle-position": {
        definitions: ["本条研究圆的标准方程与一般方程之间的转换条件，以及直线与圆、圆与圆的位置关系判定与相应的弦长、切线计算。"],
        formulas: ["标准方程 (x-a)^2 + (y-b)^2 = r^2（r > 0）；一般方程 x^2 + y^2 + Dx + Ey + F = 0 表示圆 ⇔ D^2 + E^2 - 4F > 0，此时圆心 (-D/2, -E/2)、半径 r = sqrt(D^2+E^2-4F)/2。", "直线与圆：设圆心到直线距离 d，则 d < r 相交、d = r 相切、d > r 相离；弦长 |AB| = 2 sqrt(r^2 - d^2)。", "圆与圆（半径 r_1, r_2，圆心距 d）：外离 d > r_1+r_2；外切 d = r_1+r_2；相交 |r_1-r_2| < d < r_1+r_2；内切 d = |r_1-r_2|（r_1 ≠ r_2）；内含 d < |r_1-r_2|。", "圆上点 (x_0,y_0) 处切线：(x_0-a)(x-a) + (y_0-b)(y-b) = r^2；圆外点的切线长 = sqrt(pow) = sqrt((x_0-a)^2+(y_0-b)^2-r^2)。"],
        theorems: ["一般方程表示圆的充要条件是 D^2+E^2-4F > 0；等于 0 时退化为一点，小于 0 时无实点。", "直线与圆的位置关系等价于联立后判别式的符号：Δ > 0 相交、Δ = 0 相切、Δ < 0 相离，与距离判据一致。", "两圆方程相减得根轴（相交时为公共弦所在直线，相切时为公切线）。"],
        generalRequirements: ["必须先验证一般方程确实表示圆（D^2+E^2-4F > 0）。", "位置关系优先用圆心距离与半径比较，避免联立时的计算错误；若用判别式必须完整讨论符号。"],
        forbiddenErrors: ["【存在性遗漏】不验证 D^2+E^2-4F > 0 就当作圆处理。", "【半径公式错误】把半径写成 sqrt(D^2+E^2-4F) 而漏 1/2。", "【弦长公式错误】写成 2 sqrt(r^2 + d^2) 或 sqrt(r^2-d^2)。", "【两圆情形遗漏】只讨论相交/相离而漏内切、内含。", "【切线遗漏】过圆外点求切线时只求出一条（斜率不存在的那条被漏掉）。"],
        parameterConstraints: { positiveRadius: "r > 0；一般方程须满足 D^2+E^2-4F > 0。", distanceComparison: "位置关系由圆心距 d 与半径比较确定。", tangentFromOutside: "切线长公式要求点在圆外（幂为正）。" },
        closureChecks: ["把一般方程配方为标准方程并核对圆心半径。", "用 d 与 r 的比较确定位置关系，必要时与判别式结果互验。", "求切线时检查是否遗漏斜率不存在的切线。"],
        scenarioChecks: { chordLength: ["已知弦长反求参数时用 d = sqrt(r^2 - (|AB|/2)^2)。"], commonChord: ["两圆相交的公共弦所在直线由两方程相减得到。"], tangentFromPoint: ["过圆外一点有两条切线，需分别讨论斜率存在与不存在。"] },
    },
    // 圆锥曲线标准方程与焦点、准线、离心率。
    "conic-standard-focus-directrix": {
        definitions: ["本条研究椭圆、双曲线、抛物线的标准方程及其焦点、准线、离心率、渐近线等基本几何量，并给出以焦点-准线距离比为核心的统一定义。"],
        formulas: ["椭圆 x^2/a^2 + y^2/b^2 = 1（a > b > 0）：c^2 = a^2 - b^2，焦点 (±c, 0)，准线 x = ±a^2/c，e = c/a ∈ (0,1)，第一定义 |PF_1| + |PF_2| = 2a。", "双曲线 x^2/a^2 - y^2/b^2 = 1（a, b > 0）：c^2 = a^2 + b^2，焦点 (±c, 0)，准线 x = ±a^2/c，e = c/a > 1，渐近线 y = ±(b/a)x，第一定义 ||PF_1| - |PF_2|| = 2a。", "抛物线 y^2 = 2px（p > 0）：焦点 (p/2, 0)，准线 x = -p/2，e = 1。", "统一定义：到定点 F 的距离与到定直线 l 的距离之比为常数 e 的点集，0 < e < 1 为椭圆、e = 1 为抛物线、e > 1 为双曲线（F ∉ l）。"],
        theorems: ["椭圆与双曲线的 a、b、c 关系分别为 c^2 = a^2 - b^2 与 c^2 = a^2 + b^2，两者不可互换。", "离心率决定曲线形状：e 越大椭圆越扁；双曲线 e 越大开口越大；e = 1 恰为抛物线。", "焦点-准线性质：曲线上任一点满足 |PF| = e · d(P, l)，是统一定义与焦半径公式的来源。"],
        generalRequirements: ["必须明确焦点所在坐标轴（方程中分母大者对应长轴/实轴方向），并据此写焦点与准线。", "必须区分椭圆与双曲线的 c^2 公式，以及第一定义中的和/差绝对值形式。"],
        forbiddenErrors: ["【a、b、c 关系混用】对双曲线用 c^2 = a^2 - b^2（或对椭圆用 c^2 = a^2 + b^2）。", "【焦点位置错误】不判断分母大小就默认焦点在 x 轴上。", "【双曲线定义漏绝对值】写成 |PF_1| - |PF_2| = 2a 而丢掉单支限制。", "【抛物线参数混淆】把 y^2 = 2px 的焦点写成 (p, 0) 或准线写成 x = -p。", "【离心率范围错误】声称椭圆 e ≥ 1 或双曲线 e < 1。"],
        parameterConstraints: { ellipseOrder: "椭圆需 a > b > 0，焦点在分母较大的坐标轴上。", hyperbolaPositive: "双曲线需 a, b > 0，且 c^2 = a^2 + b^2。", parabolaPositive: "抛物线标准形 y^2 = 2px 需 p > 0（或按开口方向调整符号）。", directrixNotThroughFocus: "统一定义要求定点不在定直线上。" },
        closureChecks: ["由方程读出 a、b 并算出 c、e。", "写出焦点、准线（必要时含渐近线）并核对与开口方向一致。", "用第一定义或统一定义验证曲线上一点的关系。"],
        scenarioChecks: { eccentricityFromCondition: ["由几何条件求 e 时把条件化为 a、c 的关系再取比。"], asymptoteUse: ["双曲线问题中渐近线 y = ±(b/a)x 常用于确定 b/a 或作范围估计。"], unifiedDefinitionUse: ["含到点与到线距离比的条件优先用统一定义识别曲线类型。"] },
    },
    // 焦半径、通径与焦点弦。
    "focal-radius-chord-formula": {
        definitions: ["本条研究圆锥曲线上点到焦点的距离（焦半径）与过焦点的弦（焦点弦）长度公式，包括通径与用极角表示的焦点弦长。"],
        formulas: ["椭圆 x^2/a^2+y^2/b^2=1（焦点在 x 轴）：r_左 = a + e x_0，r_右 = a - e x_0。", "双曲线 x^2/a^2-y^2/b^2=1：右支上点到右焦点 r = e x_0 - a，到左焦点 r = e x_0 + a（左支取相反符号）。", "抛物线 y^2 = 2px：r = x_0 + p/2。", "半通径 ℓ = b^2/a（椭圆、双曲线），ℓ = p（抛物线 y^2 = 2px）；通径长 = 2b^2/a 与 2p。", "极角形式（以焦点为极点）：r = ℓ/(1 - e cos θ)；焦点弦长 L = 2ℓ/(1 - e^2 cos^2 θ)；抛物线特例 L = 2p / sin^2 θ。", "焦点弦倒数关系：1/r_1 + 1/r_2 = 2/ℓ（r_1, r_2 为焦点弦被焦点分成的两段）。"],
        theorems: ["焦半径公式是统一定义 |PF| = e·d(P, l) 的直接代入结果，符号由点所在的支/开口方向决定。", "过焦点的弦中通径最短（椭圆、抛物线）：L ≥ 2ℓ，等号当弦垂直于焦轴。", "焦点弦两段的调和关系 1/r_1 + 1/r_2 = 2/ℓ 与极角形式等价，是快速求解焦点弦问题的核心。"],
        generalRequirements: ["必须先确定焦点位置与曲线开口方向，再决定焦半径公式中的符号。", "使用极角公式时必须说明极点取哪个焦点、极轴方向如何。"],
        forbiddenErrors: ["【符号错误】椭圆焦半径写成 r = a - e x_0 而实际用的是左焦点。", "【通径公式错误】把椭圆通径写成 2a^2/b 或抛物线通径写成 p。", "【双曲线支别忽略】不区分左右支直接用同一符号的焦半径公式。", "【焦点弦公式误用】把 L = 2ℓ/(1-e^2cos^2θ) 用于不过焦点的弦。", "【最短弦误设】声称任意弦中通径最短（只在过焦点的弦中成立）。"],
        parameterConstraints: { focusChoice: "焦半径公式的符号依赖所取焦点与坐标轴方向。", semiLatusRectum: "ℓ = b^2/a（椭圆/双曲线）或 ℓ = p（y^2=2px）。", chordThroughFocus: "焦点弦公式仅适用于过焦点的弦。" },
        closureChecks: ["写出 a、b、c、e 与 ℓ。", "按焦点位置选择正确符号的焦半径公式。", "用 1/r_1 + 1/r_2 = 2/ℓ 或极角公式互相验算焦点弦长。"],
        scenarioChecks: { focalChordMin: ["求焦点弦最短时取 θ = 90°（通径）。"], parabolaFocalChord: ["抛物线焦点弦满足 x_1x_2 = p^2/4、y_1y_2 = -p^2，可用于快速求解。"], sumOfFocalRadii: ["涉及 |PF_1| + |PF_2| 或差的题目优先用第一定义而非坐标展开。"] },
    },
    // 弦长公式与点差法。
    "chord-length-midpoint-difference-method": {
        definitions: ["本条研究直线与圆锥曲线相交时弦长的计算（联立 + 韦达定理）以及中点弦问题的点差法：用两交点坐标之差消去二次项，得到中点坐标与弦斜率的关系。"],
        formulas: ["弦长公式：|AB| = sqrt(1+k^2) |x_1 - x_2| = sqrt(1+k^2) sqrt((x_1+x_2)^2 - 4x_1x_2)；斜率不存在时 |AB| = |y_1-y_2|。", "点差法（椭圆 x^2/a^2+y^2/b^2=1，弦中点 (x_0,y_0)，y_0 ≠ 0）：k = -b^2 x_0/(a^2 y_0)。", "点差法（双曲线 x^2/a^2-y^2/b^2=1）：k = b^2 x_0/(a^2 y_0)；（抛物线 y^2=2px）：k = p/y_0。", "联立后判别式条件：Δ > 0 保证两交点存在，是所有结果的前提。"],
        theorems: ["弦长公式来自两点距离与 y = kx+m 的代入，配合韦达定理把 x_1+x_2、x_1x_2 用系数表示。", "点差法给出中点弦斜率与中点坐标的关系（共轭直径关系），无需解出交点。", "中点弦存在性：由点差法得到的直线必须与曲线真正相交（Δ > 0），且中点必须落在曲线内部（椭圆）或对应区域（双曲线/抛物线）。"],
        generalRequirements: ["必须联立并检验 Δ > 0（或验证中点在曲线内部），否则所得直线可能与曲线不相交。", "必须单独讨论斜率不存在与 y_0 = 0（中点在焦轴上）的退化情形。"],
        forbiddenErrors: ["【判别式遗漏】直接用点差法得出斜率而不检验相交性。", "【弦长公式错误】写成 |AB| = (1+k^2)|x_1-x_2| 或漏根号。", "【点差法符号错误】把双曲线的 k 写成 -b^2x_0/(a^2y_0)（与椭圆同号）。", "【退化情形遗漏】y_0 = 0 或斜率不存在时仍套用一般公式。", "【中点位置未检验】允许中点落在曲线外部（椭圆情形）。"],
        parameterConstraints: { discriminantPositive: "联立后必须 Δ > 0。", midpointInterior: "椭圆中点弦要求中点在椭圆内部。", nonzeroDenominator: "点差法公式要求 y_0 ≠ 0（否则弦垂直于 x 轴或需单独讨论）。" },
        closureChecks: ["联立方程并写出 x_1+x_2、x_1x_2 与 Δ。", "用弦长公式或点差法得出结论后回代检验相交性。", "讨论斜率不存在与中点在轴上的特殊情形。"],
        scenarioChecks: { areaOfTriangleWithChord: ["弦与定点构成的三角形面积用 S = (1/2)|AB| · d(P, AB) 计算。"], conjugateDiameter: ["点差法关系 k · k_{OM} = -b^2/a^2（椭圆）刻画共轭直径。"], nonexistentMidpointChord: ["若中点在椭圆外或双曲线的禁区，则不存在以其为中点的弦。"] },
    },
    // 圆锥曲线的切线与切点弦（极线）方程。
    "conic-tangent-polar-chord": {
        definitions: ["本条研究圆锥曲线在其上一点处的切线方程，以及从曲线外一点所引两条切线的切点弦（极线）方程，两者形式相同但几何意义不同。"],
        formulas: ["椭圆上点 (x_0,y_0)：切线 x x_0/a^2 + y y_0/b^2 = 1；双曲线上点：x x_0/a^2 - y y_0/b^2 = 1；抛物线 y^2 = 2px 上点：y y_0 = p(x + x_0)。", "外点 (x_0,y_0) 的切点弦（极线）：形式与切线方程完全相同，但 (x_0,y_0) 不在曲线上。", "切线的判别式条件：直线 y = kx+m 与椭圆相切 ⇔ m^2 = a^2k^2 + b^2；与双曲线相切 ⇔ m^2 = a^2k^2 - b^2（且 a^2k^2 > b^2）；与抛物线 y^2=2px 相切 ⇔ 2m k = p（k ≠ 0）。"],
        theorems: ["切线方程可由隐函数求导或由联立方程令 Δ = 0 得到，二者结果一致。", "极线（切点弦）与极点的对偶关系满足 La Hire 定理：P 在 Q 的极线上 ⇔ Q 在 P 的极线上。", "点在曲线内部时同一方程仍给出该点的极线，但此时不存在实切点弦。"],
        generalRequirements: ["必须判断给定点在曲线上、外部还是内部，从而说明方程表示切线、切点弦还是纯极线。", "使用相切条件时必须补充斜率不存在的切线情形。"],
        forbiddenErrors: ["【切线与切点弦混淆】把外点代入公式后仍称其为切线方程。", "【平方替代错误】把切线写成 x^2/a^2 + y y_0/b^2 = 1 之类（应把 x^2 换为 x x_0 而非保留平方）。", "【相切条件符号错误】双曲线相切条件写成 m^2 = a^2k^2 + b^2。", "【垂直切线遗漏】只考虑 y = kx+m 形式而漏掉 x = x_0 型切线。", "【内部点误设】对曲线内部点断言存在实切线。"],
        parameterConstraints: { pointPosition: "需判定点在曲线上/外/内。", tangencyDiscriminant: "相切等价于联立后 Δ = 0。", verticalTangent: "必须单独讨论斜率不存在的切线。" },
        closureChecks: ["判定点的位置并写出对应的切线或极线方程。", "用 Δ = 0 或代入切点验证相切。", "检查是否遗漏垂直切线与双切线情形。"],
        scenarioChecks: { twoTangentsFromPoint: ["外点引两条切线时，切点弦方程给出两切点所在直线，联立曲线求切点。"], tangentLengthProblem: ["求切线长或切点距离时联立极线与曲线。"], polarDualityUse: ["用 La Hire 定理在极点与极线之间转换以简化条件。"] },
    },
    // 轨迹方程的求法与检验。
    "locus-equation-method": {
        definitions: ["本条研究如何把动点的几何条件翻译为坐标方程（轨迹方程），并强调轨迹的完备性检验：方程的解集必须与满足条件的点集完全一致。"],
        formulas: ["直接法：设动点 (x, y)，把几何条件直接化为关于 x、y 的方程并化简。", "定义法：若条件符合圆、椭圆、双曲线、抛物线的定义（距离和/差/比），直接写标准方程并确定参数。", "参数法：引入参数 t（角度、斜率、坐标之一），得 x = f(t)、y = g(t)，再消参得普通方程，同时记录参数范围导出的取值限制。", "相关点法（代换法）：动点 (x,y) 由已知曲线上点 (x', y') 通过关系式表示，反解 x' = φ(x,y)、y' = ψ(x,y) 后代入已知曲线方程。"],
        theorems: ["轨迹方程的正确性要求双向：曲线上每点满足条件（纯粹性），且满足条件的每点都在曲线上（完备性）。", "消参会引入额外点：必须用参数范围回代，去掉不满足原条件的点（扣点）或补上遗漏的点。", "分类讨论必要性：条件中含参数或位置关系分支时，轨迹可能由不同类型曲线的若干片段组成。"],
        generalRequirements: ["必须写出轨迹方程后附上取值范围或需排除的点（如去掉与已知点重合、分母为零、退化情形）。", "使用定义法必须核对定义中的常数与焦距关系（如 2a > 2c 才是椭圆）。"],
        forbiddenErrors: ["【扣点遗漏】消参后不排除不满足原条件的点（如去掉端点或与定点重合的点）。", "【完备性缺失】只验证必要性而未说明满足条件的点都在所得曲线上。", "【定义误判】距离之和等于焦距时仍写椭圆（此时为线段），或距离之差等于焦距时仍写双曲线（此时为射线）。", "【范围遗漏】参数法得到方程但未给出 x 或 y 的取值范围。", "【分支合并错误】把不同分支的轨迹强行合并为一个方程而不加限制条件。"],
        parameterConstraints: { rangeConstraints: "轨迹方程必须附带自变量取值范围与排除点。", definitionThreshold: "用定义法时需满足 2a > 2c（椭圆）、2a < 2c（双曲线）等前提。", parameterElimination: "消参过程必须保留参数范围诱导的限制。" },
        closureChecks: ["写出方程并给出取值范围与排除点。", "验证纯粹性与完备性（双向检验）。", "对退化情形（线段、射线、单点、空集）单独说明。"],
        scenarioChecks: { definitionRecognition: ["条件为到两定点距离之和/差为常数或到点线距离比为常数时优先用定义法。"], relatedPointSubstitution: ["动点由已知曲线上点线性变换而来时用相关点法。"], degenerateLocus: ["注意距离和恰等于焦距、比值恰为 1 等退化情形给出的线段、射线或抛物线。"] },
    },
    // 二次曲线一般方程的不变量与分类。
    "conic-general-equation-invariants": {
        definitions: ["本条研究平面二次曲线一般方程 Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0 的分类：用坐标变换（旋转消去交叉项、平移消去一次项）化为标准形，并用不变量判定曲线类型与退化情形。"],
        formulas: ["矩阵表示：M = [[A, B/2, D/2], [B/2, C, E/2], [D/2, E/2, F]]，M_2 = [[A, B/2], [B/2, C]]。", "不变量：I_1 = A + C，I_2 = det M_2 = AC - B^2/4，I_3 = det M。", "类型判据：I_2 > 0 椭圆型（I_3 与 I_1 异号为实椭圆，同号为虚椭圆）；I_2 < 0 双曲型（I_3 = 0 为两相交直线）；I_2 = 0 抛物型（I_3 ≠ 0 为抛物线，I_3 = 0 为两平行/重合直线或无实点）。", "等价判别式写法：B^2 - 4AC < 0 椭圆型、= 0 抛物型、> 0 双曲型。", "旋转消交叉项：取 θ 使 cot 2θ = (A - C)/B（B ≠ 0），即 tan 2θ = B/(A-C)。"],
        theorems: ["I_1、I_2、I_3 在正交坐标变换（旋转 + 平移）下不变，因此可用来判定曲线类型而无需实际化简。", "任意二次曲线经旋转与平移可化为九类标准形之一（实/虚椭圆、双曲线、抛物线、两相交/平行/重合直线、点、空集）。", "退化判据：I_3 = 0 ⇔ 曲线退化（直线对、点或空集）。"],
        generalRequirements: ["必须使用与所选记号一致的不变量定义（B 是 xy 的系数还是其一半），避免公式串用。", "必须讨论退化情形（I_3 = 0）与虚情形（无实点），不能只给出非退化类型。"],
        forbiddenErrors: ["【判别式记号混用】把 B^2-4AC 与 AC-B^2/4 的符号约定混用导致类型判断相反。", "【退化情形遗漏】只按 B^2-4AC 的符号给出椭圆/双曲/抛物而不检验 I_3。", "【虚曲线忽略】把虚椭圆（无实点）当作实椭圆。", "【旋转角公式错误】写成 tan 2θ = (A-C)/B 与 cot 2θ = B/(A-C) 混淆。", "【平移顺序错误】先平移后旋转仍声称能消去交叉项。"],
        parameterConstraints: { quadraticNondegenerate: "A、B、C 不全为 0（否则不是二次曲线）。", invariantConvention: "不变量必须与所采用的系数约定一致。", rotationCondition: "B ≠ 0 时才需要旋转消交叉项。" },
        closureChecks: ["写出 M、M_2 与 I_1、I_2、I_3。", "按 I_2 的符号定类型，再用 I_3 判断是否退化。", "必要时给出旋转角与化简后的标准形并核对不变量一致。"],
        scenarioChecks: { degenerateConic: ["I_3 = 0 时给出两直线、单点或空集，并写出具体分解。"], rotationSimplification: ["含 xy 项时先旋转消交叉项，再平移定心。"], parameterizedFamily: ["含参数的二次曲线族按 I_2、I_3 的符号分类讨论各参数区间的曲线类型。"] },
    },
    // 极坐标方程与参数方程。
    "polar-parametric-equations": {
        definitions: ["本条研究极坐标与直角坐标的互化、常见曲线的极坐标方程，以及直线、圆、圆锥曲线的参数方程及其与普通方程的转换。"],
        formulas: ["互化：x = ρ cos θ、y = ρ sin θ；ρ^2 = x^2 + y^2、tan θ = y/x（需按象限确定 θ）。", "常见极坐标方程：圆 ρ = 2R cos θ（过极点、圆心在极轴上）；直线 ρ cos(θ - α) = d；圆锥曲线（焦点为极点）ρ = ℓ/(1 - e cos θ)。", "参数方程：直线 x = x_0 + t cos α、y = y_0 + t sin α（t 为有向距离）；圆 x = a + R cos t、y = b + R sin t；椭圆 x = a cos t、y = b sin t；双曲线 x = a sec t、y = b tan t；抛物线 y^2=2px：x = 2pt^2、y = 2pt。", "极坐标面积/弧长：A = (1/2)∫ ρ^2 dθ，弧长 s = ∫ sqrt(ρ^2 + (dρ/dθ)^2) dθ。"],
        theorems: ["直线参数方程中参数 t 的几何意义是到定点 (x_0,y_0) 的有向距离（要求方向向量为单位向量），因此 |t_1 - t_2| 与 |t_1 t_2| 可直接表示弦长与乘积。", "极坐标下圆锥曲线的统一方程 ρ = ℓ/(1 - e cos θ) 把三类曲线合并，e 的取值决定类型。", "参数方程与普通方程的等价性需附带参数范围：消参可能扩大或缩小点集。"],
        generalRequirements: ["必须说明极角范围与 ρ 是否允许取负值（不同约定下同一点有不同表示）。", "使用直线参数方程的距离意义前必须把方向向量单位化。"],
        forbiddenErrors: ["【单位化遗漏】直线参数方程方向向量非单位却仍把 t 当作距离。", "【象限错误】由 tan θ = y/x 求 θ 时不按象限修正。", "【负 ρ 处理不当】未声明约定就混用 ρ < 0 的表示。", "【消参范围遗漏】椭圆参数方程消参后不限制 x、y 范围或漏掉端点。", "【双曲线参数化误用】用 (a cos t, b sin t) 表示双曲线。"],
        parameterConstraints: { polarConvention: "需声明 ρ ≥ 0 与 θ 的取值范围（或允许 ρ < 0 的约定）。", unitDirection: "直线参数方程要求方向向量单位化才有距离意义。", parameterRange: "参数方程必须给出参数范围，消参后核对点集一致。" },
        closureChecks: ["写出互化关系并确认象限。", "参数方程给出参数范围，消参后核对与原曲线一致。", "涉及弦长时用 |t_1 - t_2| 或 sqrt(1+k^2)|x_1-x_2| 互相验算。"],
        scenarioChecks: { polarConicProblem: ["以焦点为极点的圆锥曲线问题用 ρ = ℓ/(1 - e cos θ) 结合焦点弦公式。"], parametricChord: ["直线参数方程配合韦达定理求弦长、定点距离乘积。"], areaInPolar: ["极坐标下求面积用 A = (1/2)∫ρ^2 dθ 并确定积分区间。"] },
    },
    // 空间平面与直线方程。
    "space-plane-line-equations": {
        definitions: ["本条研究空间直角坐标系中平面与直线的代数表示：平面用点法式与一般式，直线用对称式、参数式或两平面交线表示，并给出位置关系的坐标判定。"],
        formulas: ["平面点法式：A(x-x_0) + B(y-y_0) + C(z-z_0) = 0，法向量 n = (A,B,C)；一般式 Ax+By+Cz+D = 0（A、B、C 不全为 0）；截距式 x/a + y/b + z/c = 1。", "直线对称式：(x-x_0)/m = (y-y_0)/n = (z-z_0)/p，方向向量 s = (m,n,p)（分母为 0 表示该坐标恒定）；参数式 x = x_0 + mt、y = y_0 + nt、z = z_0 + pt。", "两平面交线：联立两一般式；方向向量 s = n_1 × n_2。", "位置关系：直线与平面平行 ⇔ s · n = 0 且点不在平面上；直线在平面内 ⇔ s · n = 0 且点在平面上；直线垂直平面 ⇔ s ∥ n；两平面平行 ⇔ n_1 ∥ n_2；两平面垂直 ⇔ n_1 · n_2 = 0。", "两直线异面判据：(P_1P_2) · (s_1 × s_2) ≠ 0。"],
        theorems: ["一般式 Ax+By+Cz+D = 0 与空间平面一一对应（系数整体伸缩视为同一平面），法向量为 (A,B,C)。", "过一条直线的平面束可写为 (A_1x+B_1y+C_1z+D_1) + λ(A_2x+B_2y+C_2z+D_2) = 0（不含第二个平面）。", "两直线共面 ⇔ 混合积 (P_1P_2, s_1, s_2) = 0；此时平行或相交，否则异面。"],
        generalRequirements: ["对称式中出现分母为 0 时必须解释为对应坐标为常数，不能视为无意义。", "判定平行时必须同时排除包含（直线在平面内、两平面重合）的情形。"],
        forbiddenErrors: ["【法向量与方向向量混用】把平面法向量当作其内直线的方向向量。", "【分母为零误判】认为对称式分母为 0 的直线不存在。", "【平行与包含混淆】只用 s · n = 0 就断言直线与平面平行。", "【重合平面忽略】两平面系数成比例时不区分平行与重合。", "【异面判据错误】用 s_1 × s_2 ≠ 0 判异面（这只说明不平行）。"],
        parameterConstraints: { normalNonzero: "平面法向量非零；直线方向向量非零。", symmetricZeroDenominator: "对称式分母为 0 时对应坐标取常数。", coplanarityMixedProduct: "共面性由混合积是否为零判定。" },
        closureChecks: ["写出法向量/方向向量并核对非零。", "按点积、叉积、混合积判定位置关系并排除包含与重合。", "必要时把交线化为参数式便于后续计算。"],
        scenarioChecks: { planeThroughThreePoints: ["过三点的平面用两向量叉积求法向量，需先验证三点不共线。"], lineAsIntersection: ["直线由两平面给出时先求方向向量 n_1 × n_2 与一个特解点。"], planeBundle: ["含参数的平面问题用平面束简化，最后检验被排除的平面。"] },
    },
    // 空间距离与夹角的向量公式。
    "space-distance-angle-vector": {
        definitions: ["本条研究空间中点、直线、平面之间的距离与夹角的向量计算公式，包括点面距离、异面直线距离、线面角与二面角的坐标法处理。"],
        formulas: ["点到平面距离：d = |A x_0 + B y_0 + C z_0 + D| / sqrt(A^2+B^2+C^2)，等价 d = |AP · n| / |n|。", "点到直线距离：d = |AP × s| / |s|（A 为直线上一点，s 为方向向量）。", "异面直线距离：d = |P_1P_2 · (s_1 × s_2)| / |s_1 × s_2|（s_1 × s_2 ≠ 0）。", "线面角：sin θ = |s · n| / (|s| |n|)，θ ∈ [0, 90°]。", "二面角：cos φ = ± (n_1 · n_2)/(|n_1||n_2|)，符号由二面角是锐角还是钝角决定（需结合图形判断）。", "四面体体积：V = (1/6)|(AB, AC, AD)|（混合积绝对值）。"],
        theorems: ["异面直线距离等于公垂线段长度，也等于两直线所确定的平行平面之间的距离，混合积公式即该几何量的坐标表达。", "线面角是直线与其在平面内投影的夹角，取值 [0°, 90°]，因此公式中取绝对值。", "两平面法向量夹角与二面角相等或互补，必须由图形定向确定取哪一个。"],
        generalRequirements: ["必须区分向量夹角（可为钝角）与线面角、异面直线角（取锐角或直角）。", "使用法向量求二面角时必须判断所求角是锐角还是钝角，不能直接取法向量夹角。"],
        forbiddenErrors: ["【绝对值遗漏】线面角公式不取绝对值导致出现负的 sin θ。", "【二面角符号错误】直接把法向量夹角当作二面角而不判断锐钝。", "【异面距离退化】s_1 × s_2 = 0（两直线平行）时仍用混合积公式。", "【点面距离分母错误】写成 sqrt(A^2+B^2+C^2+D^2)。", "【角度范围错误】把异面直线所成角写成大于 90°。"],
        parameterConstraints: { nonParallelForSkew: "异面直线距离公式要求 s_1 × s_2 ≠ 0。", acuteRanges: "异面直线角与线面角取值在 (0°, 90°]。", orientationForDihedral: "二面角需结合图形确定锐钝以定符号。" },
        closureChecks: ["建立坐标系并写出各点坐标、方向向量与法向量。", "代入相应距离/夹角公式并检查绝对值与取值范围。", "对二面角结果结合图形核对锐钝，必要时用三垂线法复核。"],
        scenarioChecks: { dihedralByNormals: ["用法向量求二面角后必须用图形或特殊点判断锐钝。"], distanceBetweenSkewLines: ["异面直线距离优先用混合积公式，避免作公垂线。"], volumeByMixedProduct: ["四面体或平行六面体体积用混合积计算并取绝对值。"] },
    },
    // 二次曲面的化简与分类。
    "quadric-surface-classification": {
        definitions: ["本条研究空间二次曲面一般方程的化简与分类：通过正交变换（主轴化）消去交叉项、平移消去一次项，得到标准形，从而判定曲面类型。"],
        formulas: ["一般方程：a_{11}x^2 + a_{22}y^2 + a_{33}z^2 + 2a_{12}xy + 2a_{13}xz + 2a_{23}yz + 2a_{14}x + 2a_{24}y + 2a_{34}z + a_{44} = 0，对应对称矩阵 A（3×3）与扩充矩阵 Ā（4×4）。", "标准形（非退化）：椭球面 x^2/a^2+y^2/b^2+z^2/c^2 = 1；单叶双曲面 x^2/a^2+y^2/b^2-z^2/c^2 = 1；双叶双曲面 x^2/a^2-y^2/b^2-z^2/c^2 = 1；椭圆抛物面 z = x^2/a^2+y^2/b^2；双曲抛物面（马鞍面）z = x^2/a^2-y^2/b^2。", "退化类型：二次锥面 x^2/a^2+y^2/b^2-z^2/c^2 = 0；椭圆/双曲/抛物柱面；平面对、单点、空集。", "不变量：I_1 = tr A、I_2 = A 的二阶主子式和、I_3 = det A、I_4 = det Ā，在正交变换与平移下不变。"],
        theorems: ["主轴定理：实对称矩阵 A 可正交对角化，因此任意二次曲面经旋转可消去所有交叉项，特征值给出标准形系数。", "分类由 A 的特征值符号（惯性指数）与 I_4、秩共同决定：特征值同号且 I_4 与之异号得椭球面，特征值异号得双曲面/马鞍面，出现零特征值得抛物面或柱面。", "直纹性：单叶双曲面与双曲抛物面是直纹曲面（含两族直线），椭球面与椭圆抛物面不是。"],
        generalRequirements: ["必须先用特征值（惯性指数）判断类型，再配方或平移定心，不能只凭部分系数猜测。", "必须讨论退化情形（锥面、柱面、平面对、单点、空集）。"],
        forbiddenErrors: ["【单叶双叶混淆】把 x^2/a^2+y^2/b^2-z^2/c^2 = 1 与 = -1 的曲面类型互换。", "【锥面与双曲面混淆】把常数项为 0 的情形仍当作双曲面。", "【直纹性误设】声称椭球面或椭圆抛物面含直线。", "【化简顺序错误】先平移后旋转仍声称能消去交叉项。", "【退化遗漏】只列出五类非退化曲面而忽略柱面、平面对、单点与空集。"],
        parameterConstraints: { symmetricMatrix: "二次项系数构成实对称矩阵 A（交叉项系数取一半）。", eigenvalueSigns: "类型由 A 的特征值符号与 I_4 决定。", nondegenerateCheck: "I_4 = 0 或 A 降秩时进入退化情形。" },
        closureChecks: ["写出 A 与 Ā，计算特征值或不变量。", "按惯性指数与 I_4 判定类型，再化为标准形。", "对退化情形写出具体几何对象（锥面、柱面、平面对、点、空集）。"],
        scenarioChecks: { crossSectionAnalysis: ["用平面截曲面（令某坐标为常数）判断截线类型以辅助识别曲面。"], ruledSurface: ["单叶双曲面与双曲抛物面上可显式写出两族直母线。"], parameterFamily: ["含参数的曲面族按特征值符号分类讨论各参数区间的曲面类型。"] },
    },
};
