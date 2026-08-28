import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“偏微分方程-椭圆型方程”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const PDE_ELLIPTIC_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Green 函数是带边界条件的点源响应构造，不等同于全空间基本解。
    "green-function": {
        id: "green-function",
        l2Key: "pde-elliptic",
        name: "Green 函数",
        kind: "object",
        aliases: ["Green 函数", "Green函数", "Green function", "格林函数"],
    },
    "fundamental-solution": {
        id: "fundamental-solution", l2Key: "pde-elliptic", name: "椭圆算子基本解", kind: "object",
        aliases: ["椭圆算子基本解", "Laplace基本解", "fundamental solution"],
    },
    "weak-maximum-principle": {
        id: "weak-maximum-principle", l2Key: "pde-elliptic", name: "弱最大值原理", kind: "theorem",
        aliases: ["弱最大值原理", "elliptic weak maximum principle"],
    },
    "strong-maximum-principle": {
        id: "strong-maximum-principle", l2Key: "pde-elliptic", name: "强最大值原理", kind: "theorem",
        aliases: ["强最大值原理", "elliptic strong maximum principle"],
    },
    "hopf-boundary-point-lemma": {
        id: "hopf-boundary-point-lemma", l2Key: "pde-elliptic", name: "Hopf 边界点引理", kind: "lemma",
        aliases: ["Hopf引理", "Hopf边界点引理", "Hopf boundary point lemma"],
    },
    "harnack-inequality": {
        id: "harnack-inequality", l2Key: "pde-elliptic", name: "椭圆型 Harnack 不等式", kind: "theorem",
        aliases: ["Harnack不等式", "椭圆型Harnack不等式", "elliptic Harnack inequality"],
    },
    "lax-milgram-theorem": {
        id: "lax-milgram-theorem", l2Key: "pde-elliptic", name: "Lax-Milgram 定理", kind: "theorem",
        aliases: ["Lax-Milgram定理", "Lax Milgram theorem"],
    },
    "elliptic-weak-formulation": {
        id: "elliptic-weak-formulation", l2Key: "pde-elliptic", name: "椭圆方程弱形式", kind: "formula",
        aliases: ["椭圆方程弱形式", "椭圆方程变分形式", "elliptic weak formulation"],
    },
    "dirichlet-problem": {
        id: "dirichlet-problem", l2Key: "pde-elliptic", name: "Dirichlet 边值问题", kind: "object",
        aliases: ["Dirichlet问题", "Dirichlet边值问题", "狄利克雷问题"],
    },
    "neumann-problem": {
        id: "neumann-problem", l2Key: "pde-elliptic", name: "Neumann 边值问题", kind: "object",
        aliases: ["Neumann问题", "Neumann边值问题", "诺依曼问题"],
    },
    "poisson-kernel": {
        id: "poisson-kernel", l2Key: "pde-elliptic", name: "Poisson 核", kind: "formula",
        aliases: ["Poisson核", "泊松核", "Poisson kernel"],
    },
    "elliptic-regularity": {
        id: "elliptic-regularity", l2Key: "pde-elliptic", name: "椭圆正则性定理", kind: "theorem",
        aliases: ["椭圆正则性", "椭圆正则性定理", "elliptic regularity"],
    },
    "schauder-estimate": {
        id: "schauder-estimate", l2Key: "pde-elliptic", name: "Schauder 估计", kind: "theorem",
        aliases: ["Schauder估计", "Schauder estimate"],
    },
    "calderon-zygmund-estimate": {
        id: "calderon-zygmund-estimate", l2Key: "pde-elliptic", name: "Calderón-Zygmund 估计", kind: "theorem",
        aliases: ["Calderon-Zygmund估计", "Calderón-Zygmund估计", "Calderon Zygmund estimate"],
    },
    // 以下条目覆盖 L2 的非线性、谱理论、临界嵌入和变分高级内容。
    "de-giorgi-nash-moser-regularity": {
        id: "de-giorgi-nash-moser-regularity", l2Key: "pde-elliptic", name: "De Giorgi-Nash-Moser 正则性", kind: "theorem",
        aliases: ["De Giorgi-Nash-Moser正则性", "DGNM正则性", "De Giorgi Nash Moser regularity"],
    },
    "elliptic-principal-eigenvalue": {
        id: "elliptic-principal-eigenvalue", l2Key: "pde-elliptic", name: "椭圆算子主特征值", kind: "criterion",
        aliases: ["椭圆算子主特征值", "主特征值", "principal eigenvalue"],
    },
    "p-laplace-equation": {
        id: "p-laplace-equation", l2Key: "pde-elliptic", name: "p-Laplace 方程", kind: "formula",
        aliases: ["p-Laplace方程", "p调和方程", "p-Laplacian"],
    },
    "monge-ampere-equation": {
        id: "monge-ampere-equation", l2Key: "pde-elliptic", name: "Monge-Ampère 方程", kind: "formula",
        aliases: ["Monge-Ampere方程", "Monge-Ampère方程", "Monge Ampere equation"],
    },
    "critical-sobolev-exponent": {
        id: "critical-sobolev-exponent", l2Key: "pde-elliptic", name: "临界 Sobolev 指数", kind: "criterion",
        aliases: ["临界Sobolev指数", "Sobolev临界指数", "critical Sobolev exponent"],
    },
    "obstacle-problem": {
        id: "obstacle-problem", l2Key: "pde-elliptic", name: "椭圆障碍问题", kind: "object",
        aliases: ["障碍问题", "椭圆障碍问题", "obstacle problem"],
    },
    "method-of-continuity": {
        id: "method-of-continuity", l2Key: "pde-elliptic", name: "连续性方法", kind: "algorithm",
        aliases: ["连续性方法", "continuity method"],
    },
    // Pohožaev 恒等式通过乘子 x·∇u 积分，给出星形域上临界/超临界指数方程的非存在性判据。
    "pohozaev-identity": {
        id: "pohozaev-identity", l2Key: "pde-elliptic", name: "Pohožaev 恒等式", kind: "theorem",
        aliases: ["Pohozaev恒等式", "Pohožaev恒等式", "Pohozaev identity"],
    },
    // Fredholm 择一处理椭圆算子存在性与唯一性等价的情形，以及非唯一时的相容条件。
    "fredholm-alternative-elliptic": {
        id: "fredholm-alternative-elliptic", l2Key: "pde-elliptic", name: "椭圆算子 Fredholm 择一", kind: "theorem",
        aliases: ["Fredholm择一定理", "椭圆Fredholm择一", "Fredholm alternative"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：
// definitions：该知识项的正式定义、研究对象和基本语义。
// formulas：可直接用于命题或推导的核心公式，并注明符号约定和适用条件。
// theorems：与该知识项直接相关的定理、引理、等价结论及其成立前提。
// generalRequirements：凡是使用该 L3 生题或审题时都必须执行的通用要求。
// forbiddenErrors：该知识项常见的数学错误、非法推导和容易遗漏的前提。
// parameterConstraints：算子、参数、定义域、边界、函数空间和非退化条件等约束。
// closureChecks：不依赖特殊题型的闭合验收动作，如回代、边界核验和唯一性证明。
// scenarioChecks：仅在题目满足对应场景前提时启用的专项检查，不能无条件注入所有题目。
export const PDE_ELLIPTIC_L3_RULES: Record<string, MathV2L3Rules> = {
    // Green 函数需要同时验证点源方程、奇性、边界条件和最终表示公式。
    "green-function": {
        definitions: [
            "Green 函数 G(x,y) 是给定线性算子、定义域和边界条件下，对源点 y 的单位点源响应；其具体定义依赖算子和边界条件。",
        ],
        formulas: [
            "对源变量 x，应在分布意义下验证 L_x G(x,y)=delta(x-y)，并明确算子符号、Dirac 分布相对于的测度以及边界条件作用的变量。",
            "Green 恒等式把 u、G 及其法向导数的体积分和边界积分联系起来；由此得到的边界项必须由具体算子和边界条件推导，不能凭模板添加。",
            "若原问题可由 Green 函数表示，候选解通常由体积分项与由边界数据决定的边界项组成；积分核、法向导数和符号必须与原边值问题匹配。",
        ],
        theorems: [
            "对给定线性边值问题，若对应齐次问题只有零解（等价地，在相应函数空间中算子可逆），则 Green 函数的唯一性可由边值问题唯一性推出。",
            "若算子存在非平凡核，Green 函数的存在必须满足与伴随算子核相关的 Fredholm 相容性条件；还需通过归一化或正交条件消除非唯一性。",
            "对满足相应自伴边界条件且算子可逆的自伴边值问题，Green 函数具有相应的对称性；实情形为 G(x,y)=G(y,x)，复 Hilbert 空间情形通常为共轭对称。",
        ],
        generalRequirements: [
            "必须明确算子、定义域、源变量、观察变量和边界条件。",
            "必须检查对应齐次问题是否只有零解；若存在非平凡核，必须转而检查伴随核的 Fredholm 相容性和归一化条件。",
            "不能只验证候选函数满足微分方程；必须完成从构造、奇性、边界到原问题解表示的完整证明闭环。",
        ],
        forbiddenErrors: [
            "【算子方程遗漏源项】只在 x 不等于 y 的区域验证齐次方程，未在分布意义下核对 delta 源项。",
            "【奇性与跳跃条件遗漏】未检查 x=y 处的连续性、奇性阶数或由最高阶项和符号约定决定的导数跳跃。",
            "【边界条件不完整】只验证一端或一部分边界条件，就声称 Green 函数构造完成。",
            "【对称性误用】未确认算子、定义域和边界条件构成自伴问题，就直接使用 G(x,y)=G(y,x)。",
            "【唯一性误判】忽略算子核、Fredholm 相容性或归一化条件，直接声称 Green 函数唯一。",
            "【边界表示误用】未由 Green 恒等式推导边界项，或把齐次边界问题的表示公式直接套到非齐次边界数据。",
        ],
        parameterConstraints: {
            operator: "必须声明算子阶数、最高阶系数、符号约定、Dirac 分布所用测度和适用的函数/分布空间。",
            domain: "必须明确定义域、边界的正则性以及 x、y 是否位于域内或边界上。",
            boundary: "边界条件必须与所构造 Green 函数的类型一致；自伴结论只能在自伴边界条件下使用。",
            invertibility: "齐次问题只有零解时才可直接使用唯一 Green 函数；若存在非平凡核，必须给出伴随核正交相容条件和归一化约束。",
        },
        closureChecks: [
            "验证算子作用结果为指定的点源分布。",
            "验证源点处的奇性、连续性和必要导数跳跃条件。",
            "验证全部边界条件，而不是只验证一个端点或一条边界。",
            "将 Green 函数得到的积分表示代回原边值问题，核对方程、边界和相容性。",
            "若使用唯一性或对称性，必须在证明中给出其适用前提。",
        ],
        scenarioChecks: {
            selfAdjointBoundaryValueProblem: [
                "验证自伴边值问题的算子方程 L_x G(x,y)=delta(x-y)。",
                "验证 x=y 处的奇性或导数跳跃条件，跳跃阶数和系数由算子最高阶项决定。",
                "对固定 y，验证 G(·,y) 满足两端或全部边界条件。",
                "在自伴性、可逆性和边界条件前提成立时，验证相应的对称性 G(x,y)=G(y,x)；复情形核对共轭对称。",
            ],
            nonSelfAdjointOrNonUniqueProblem: [
                "非自伴问题不得直接使用 G(x,y)=G(y,x)；应分别核对原算子、伴随算子及其边界条件。",
                "若齐次问题存在非零解，必须检查源项与伴随算子核的 Fredholm 正交相容条件。",
                "非唯一时必须给出归一化、正交补或完整解族，并说明 Green 函数在何种意义下确定。",
                "若相容性条件不成立，应明确说明 Green 函数或原边值问题不存在，而不能继续给出形式积分表示。",
            ],
        },
    },
    // 基本解是全空间或局部的点源响应；它不自动满足具体区域的边界条件。
    "fundamental-solution": {
        definitions: ["基本解 Phi 是满足 L Phi=delta_0 的分布；平移不变算子可用 Phi(x-y) 表示点源响应。"],
        formulas: ["对 Laplace 算子，n>=3 时基本解与 |x|^{2-n} 成比例，n=2 时为对数型；常数和符号由 Delta 或 -Delta 的约定决定。"],
        theorems: ["若 f 足够正则且卷积有意义，则 Phi*f 给出 Lu=f 的一个分布解；在有界域中还需加入调和校正以满足边界条件。"],
        generalRequirements: ["必须明确算子符号、空间维数和分布归一化。", "必须区分基本解、Green 函数和 Poisson 核。"],
        forbiddenErrors: ["【维数遗漏】把 n>=3 的幂函数公式直接用于二维。", "【符号遗漏】未核对算子采用 Delta 还是 -Delta。", "【边界误用】把全空间基本解直接当作有界域 Green 函数。"],
        parameterConstraints: { dimension: "必须区分 n=2 与 n>=3。", singularity: "源点奇性必须在分布意义下解释，不能按普通函数逐点求值。" },
        closureChecks: ["对测试函数验证 L Phi=delta_0。", "核对源点外满足齐次方程。", "将卷积或校正后的表示代回原方程及边界条件。"],
        scenarioChecks: { boundedDomain: ["通过调和校正或镜像构造满足具体边界条件。", "不得把基本解的平移不变性误用于一般区域。"] },
    },
    // 弱最大值原理控制边界与内部上确界，是唯一性和比较原理的基础。
    "weak-maximum-principle": {
        definitions: ["弱最大值原理把满足适当椭圆不等式的函数在域内的最大值或正部控制到边界。"],
        formulas: ["典型形式：Lu>=0 且零阶项满足相应符号条件时，sup_Omega u<=sup_boundaryOmega u^+；具体方向随 L 的符号约定改变。"],
        theorems: ["对有界域中的一致椭圆二阶算子，在系数有界、零阶项符号和解的正则性满足条件时成立弱最大值原理。"],
        generalRequirements: ["先固定 Lu 的符号约定，再确定应控制最大值还是最小值。", "必须说明域有界性、椭圆性、零阶项和解的正则性。"],
        forbiddenErrors: ["【方向颠倒】改变算子符号后仍沿用原不等式方向。", "【零阶项遗漏】忽略 c(x) 的符号条件。", "【无界域误用】未加增长或衰减条件就直接用于无界域。"],
        parameterConstraints: { ellipticity: "主部必须满足所用版本要求的一致椭圆性。", zerothOrder: "零阶项必须满足对应最大值原理的符号条件。" },
        closureChecks: ["核对算子不等式方向。", "核对全部边界值或边界上确界。", "由最大值原理完成唯一性或比较结论。"],
        scenarioChecks: { uniqueness: ["对两个解作差，并验证差满足齐次方程和齐次边界条件。", "同时对差及其相反数使用原理得到恒为零。"] },
    },
    // 强最大值原理关注内部极值何时迫使解成为常数。
    "strong-maximum-principle": {
        definitions: ["强最大值原理说明非平凡椭圆次解若在连通域内部取得允许方向的极值，则在相应条件下必为常数。"],
        formulas: ["若 Lu>=0 并在 Omega 内取得非负最大值，适当前提下 u 在连通分支上为常数；方向依算子约定调整。"],
        theorems: ["对连通域上的一致椭圆算子，满足系数、零阶项和正则性条件的解适用强最大值原理。"],
        generalRequirements: ["必须区分内部真正取到极值与仅有上确界。", "必须核对域的连通性和解的正则性。"],
        forbiddenErrors: ["【连通性遗漏】把一个连通分支上的常数性推广到不连通全域。", "【极值概念混淆】仅存在内部逼近极值的序列就声称取得极值。", "【常数结论误用】未核对零阶项条件就推出常数。"],
        parameterConstraints: { connectedness: "常数性结论逐个连通分支成立。", regularity: "解和系数必须满足所引用版本的经典或弱解前提。" },
        closureChecks: ["确认内部极值确实取得。", "核对连通性和算子条件。", "将常数性代回方程核对其是否与零阶项兼容。"],
        scenarioChecks: { positiveSolutions: ["若非负解在内部一点为零，检查是否可由强原理推出恒为零。"] },
    },
    // Hopf 引理给出边界严格极值处的法向导数符号，前提比最大值原理更强。
    "hopf-boundary-point-lemma": {
        definitions: ["Hopf 边界点引理在满足内球条件的边界严格极值点给出非零法向导数及其符号。"],
        formulas: ["法向导数的正负取决于最大/最小、内/外法向以及算子符号；使用前必须固定三项约定。"],
        theorems: ["对一致椭圆算子、非恒定解和满足内球条件的边界极值点，Hopf 引理给出严格法向导数结论。"],
        generalRequirements: ["必须声明采用内法向还是外法向。", "必须验证边界点的内球条件和解非恒定。"],
        forbiddenErrors: ["【法向符号错误】未区分内外法向。", "【几何前提遗漏】尖点边界未验证内球条件。", "【非严格情形误用】对恒定解或非严格极值声称导数严格非零。"],
        parameterConstraints: { boundaryGeometry: "目标边界点须满足所用版本的内球条件。", normal: "必须明确法向方向。" },
        closureChecks: ["核对边界极值和非恒定性。", "核对内球条件。", "按法向约定计算并验证导数符号。"],
        scenarioChecks: { comparison: ["对两解之差应用引理时，先验证其满足对应算子不等式。"] },
    },
    // Harnack 不等式只比较正解或非负解在紧包含子域中的大小。
    "harnack-inequality": {
        definitions: ["椭圆型 Harnack 不等式控制正解在紧包含子域上的上确界与下确界之比。"],
        formulas: ["典型形式：sup_K u <= C inf_K u，其中 K 紧包含 Omega，常数 C 依赖椭圆性、系数、维数及 K 到边界的相对位置。"],
        theorems: ["对一致椭圆方程的非负解，在满足系数条件的内点区域成立局部 Harnack 不等式。"],
        generalRequirements: ["必须验证解非负；若需要比值形式通常应排除恒零或先由强最大值原理得到正性。", "必须说明 K 紧包含 Omega 以及常数依赖。"],
        forbiddenErrors: ["【正性遗漏】对变号解直接使用 Harnack。", "【边界误用】让 K 接触边界却仍使用纯内点版本。", "【常数误判】把 C 当成与区域、系数和距离无关的绝对常数。"],
        parameterConstraints: { positivity: "u 必须满足所用版本要求的非负性或正性。", compactSubset: "比较集合必须紧包含定义域，除非引用边界 Harnack 版本。" },
        closureChecks: ["核对正性。", "核对紧包含关系。", "说明 Harnack 常数依赖并据此完成比较或紧性论证。"],
        scenarioChecks: { harnackChain: ["链式覆盖时逐球验证重叠和球仍位于域内。"] },
    },
    // Lax-Milgram 通过连续性和强制性给出 Hilbert 空间中的唯一弱解。
    "lax-milgram-theorem": {
        definitions: ["Lax-Milgram 定理处理 Hilbert 空间 V 上的连续强制双线性或复情形半双线性型。"],
        formulas: ["求 u in V 使 a(u,v)=F(v) 对所有 v in V 成立；要求 |a(u,v)|<=M||u||||v|| 且 Re a(v,v)>=alpha||v||^2。"],
        theorems: ["当 a 连续且强制、F 为连续线性泛函时，存在唯一 u in V，并有 ||u||<=||F||/alpha。"],
        generalRequirements: ["必须明确 Hilbert 空间、试验空间和边界条件如何进入空间。", "必须分别证明连续性、强制性和 F 的连续性。"],
        forbiddenErrors: ["【强制性缺失】只证明 a(v,v)>=0 就声称唯一。", "【Poincare遗漏】在 H_0^1 上控制完整范数时未调用或验证 Poincare 不等式。", "【Neumann误用】纯 Neumann 问题存在常数核却直接声称唯一。"],
        parameterConstraints: { coercivity: "强制常数 alpha 必须严格为正。", space: "V 必须是与边界条件相适配的 Hilbert 空间。" },
        closureChecks: ["验证 a 的连续性。", "验证强制性或在商空间上的强制性。", "验证 F 连续并写出存在唯一性和先验估计。"],
        scenarioChecks: { garding: ["若仅有 Garding 不等式，不得直接当作强制性；需移位或结合 Fredholm 理论。"] },
    },
    // 弱形式把微分方程转为对所有试验函数成立的积分恒等式。
    "elliptic-weak-formulation": {
        definitions: ["椭圆方程弱形式通过乘试验函数并分部积分，把导数转移到试验函数并自然编码边界条件。"],
        formulas: ["散度型方程 -div(A grad u)+cu=f 的典型弱式为 积分 A grad u·grad v + c u v = <f,v>，并按边界类型加入相应边界项。"],
        theorems: ["足够光滑的经典解满足弱形式；弱解能否提升为经典解取决于系数、数据、区域和边界正则性。"],
        generalRequirements: ["必须明确解空间与试验空间。", "分部积分产生的边界项必须与 Dirichlet、Neumann 或 Robin 条件一致。"],
        forbiddenErrors: ["【边界项丢失】非齐次 Neumann/Robin 条件下直接删去边界项。", "【空间错配】右端泛函不属于试验空间对偶。", "【强弱混淆】弱解存在后未经正则性证明就逐点求二阶导。"],
        parameterConstraints: { spaces: "u、v 与 f 必须处于使全部配对有意义的空间。", trace: "涉及边界数据时必须保证迹与边界配对有定义。" },
        closureChecks: ["从强式逐步分部积分得到弱式。", "核对边界项和函数空间。", "必要时从弱式反推分布方程并说明正则性升级条件。"],
        scenarioChecks: { mixedBoundary: ["Dirichlet 部分进入函数空间，Neumann/Robin 部分保留在变分恒等式中。"] },
    },
    // Dirichlet 问题指定边界值，唯一性常由最大值原理或能量方法给出。
    "dirichlet-problem": {
        definitions: ["Dirichlet 问题在域内求解椭圆方程，并在边界指定 u=g。"],
        formulas: ["典型模型为 Lu=f in Omega，u=g on boundaryOmega；弱形式常先取满足边界迹的提升再化为齐次边界问题。"],
        theorems: ["在适当椭圆性、数据和区域条件下可由变分法、最大值原理或 Perron 方法得到存在唯一性。"],
        generalRequirements: ["必须区分经典边界值和 Sobolev 迹意义。", "非齐次边界必须先验证存在合适提升。"],
        forbiddenErrors: ["【边界正则性遗漏】未经迹定理就要求 H^1 函数逐点取边界值。", "【提升遗漏】把非齐次边界问题直接当作 H_0^1 问题。", "【角点正则性误判】一般 Lipschitz 或非凸域上直接声称全局 C^{2,alpha}。"],
        parameterConstraints: { boundaryData: "g 必须属于所采用解框架允许的迹空间。", domain: "全局正则性结论必须匹配边界光滑度。" },
        closureChecks: ["核对边界迹。", "验证方程或弱形式。", "用最大值原理或能量法验证唯一性。"],
        scenarioChecks: { nonhomogeneous: ["构造边界提升并核对剩余未知量具有齐次迹。"] },
    },
    // Neumann 问题通常存在常数核，必须把相容性与归一化写入题目和答案。
    "neumann-problem": {
        definitions: ["Neumann 问题指定边界上的共法向导数或通量，而非函数值。"],
        formulas: ["以 -Delta u=f、partial_n u=g 为例，积分恒等式给出相容条件 积分_Omega f + 积分_boundaryOmega g=0；符号随方程约定调整。"],
        theorems: ["纯 Neumann 问题在相容条件成立时通常仅在加常数意义下唯一；加入零均值等归一化后才唯一。"],
        generalRequirements: ["必须从散度定理推导而不是背诵相容条件的符号。", "必须明确唯一性是模常数还是经归一化后的唯一。"],
        forbiddenErrors: ["【相容性遗漏】任意 f、g 都声称存在解。", "【唯一性误判】忽略常数核。", "【法向方向错误】未明确外法向导致通量符号错误。"],
        parameterConstraints: { compatibility: "数据必须满足由弱式或散度定理推出的相容条件。", normalization: "应给出零均值、定点值或商空间约束。" },
        closureChecks: ["推导并核对相容条件。", "验证共法向边界条件。", "说明模常数唯一并核对归一化。"],
        scenarioChecks: { variableCoefficients: ["边界量应使用 A grad u·n，而非机械写 partial_n u。"] },
    },
    // Poisson 核是调和 Dirichlet 问题的边界积分核，依赖具体区域。
    "poisson-kernel": {
        definitions: ["Poisson 核表示球或半空间等区域中调和 Dirichlet 问题的边界数据传播核。"],
        formulas: ["u(x)=积分_boundaryOmega P(x,xi)g(xi)dS_xi；核应非负并对边界变量积分为 1。"],
        theorems: ["对适当边界数据，Poisson 积分在域内调和，并按相应意义趋近给定边界数据。"],
        generalRequirements: ["必须明确区域及其对应的 Poisson 核。", "必须说明边界收敛采用逐点、几乎处处或范数意义。"],
        forbiddenErrors: ["【区域错配】把单位球核直接用于半空间或一般区域。", "【归一化遗漏】未验证核积分为 1。", "【边界收敛夸大】低正则数据下无条件声称处处连续延拓。"],
        parameterConstraints: { domain: "核公式必须匹配球、圆盘或半空间的几何参数。", data: "边界数据空间必须与所声称的收敛方式一致。" },
        closureChecks: ["验证核的非负性与归一化。", "验证 Poisson 积分调和。", "验证边界极限恢复 g。"],
        scenarioChecks: { unitBall: ["核的分母、维数常数和表面积归一化必须一致。"] },
    },
    // 椭圆正则性是从数据和系数的正则性推导解的额外正则性，而非无条件光滑化。
    "elliptic-regularity": {
        definitions: ["椭圆正则性定理说明弱解在系数、右端、区域和边界足够正则时获得更高阶的内部或全局正则性。"],
        formulas: ["典型内部估计把 ||u||_{H^{k+2}(Omega')} 控制为 ||f||_{H^k(Omega)} 与 ||u||_{L^2(Omega)}，其中 Omega' 紧包含 Omega。"],
        theorems: ["内部正则性不需要边界光滑度；全局正则性还依赖边界及边界数据的光滑度和相容性。"],
        generalRequirements: ["必须区分内部估计和直到边界的全局估计。", "结论阶数不能超过系数、右端和边界允许的正则性。"],
        forbiddenErrors: ["【内部全局混淆】把 Omega' 紧包含 Omega 的结论直接推到边界。", "【数据正则性遗漏】粗糙 f 下直接声称 u 光滑。", "【角点奇性遗漏】非光滑或非凸域上忽略边界奇性。"],
        parameterConstraints: { coefficients: "系数正则性必须匹配目标估计。", boundary: "全局估计必须说明边界类别和边界数据相容性。" },
        closureChecks: ["列出系数、f、边界和域的正则性。", "选择内部或全局定理。", "核对所得导数阶和估计常数依赖。"],
        scenarioChecks: { bootstrapping: ["每次提升正则性前重新检查方程右端和系数乘积所在空间。"] },
    },
    // Schauder 估计工作在 Hölder 空间，必须明确 alpha、系数和边界的 Hölder 正则性。
    "schauder-estimate": {
        definitions: ["Schauder 估计在 Hölder 空间中控制椭圆方程解的二阶及更高阶 Hölder 范数。"],
        formulas: ["典型内部估计：||u||_{C^{2,alpha}(Omega')} <= C(||u||_{C^0(Omega)}+||f||_{C^{0,alpha}(Omega)})。"],
        theorems: ["一致椭圆算子的系数为 C^{0,alpha} 时可得内部 C^{2,alpha} 估计；全局估计还需相应边界和边界数据正则性。"],
        generalRequirements: ["必须写明 0<alpha<1。", "必须区分内部与边界 Schauder 估计。"],
        forbiddenErrors: ["【系数条件不足】仅有有界可测系数就套 C^{2,alpha} 估计。", "【低阶项遗漏】估计常数和符号条件未考虑低阶系数。", "【边界光滑度遗漏】一般 Lipschitz 边界上直接使用全局 Schauder 估计。"],
        parameterConstraints: { holderExponent: "alpha 必须位于 (0,1)。", geometry: "全局估计需匹配域边界和边界数据的 Hölder 正则性。" },
        closureChecks: ["核对系数与 f 的 Hölder 类。", "确认使用内部或全局版本。", "写明估计常数依赖并据此完成正则性结论。"],
        scenarioChecks: { dirichletBoundary: ["全局 C^{2,alpha} 结论需核对边界及 Dirichlet 数据的相应正则性。"] },
    },
    // Calderón-Zygmund 型估计工作在 L^p/W^{2,p} 框架，不能与 Schauder 估计混用。
    "calderon-zygmund-estimate": {
        definitions: ["Calderón-Zygmund 型椭圆估计用奇异积分理论在 1<p<infinity 范围内控制二阶导数的 L^p 范数。"],
        formulas: ["对全空间 Poisson 方程可有 ||D^2u||_{L^p} <= C||f||_{L^p}；有界域版本通常还包含 ||u||_{L^p} 并依赖边界条件。"],
        theorems: ["在 1<p<infinity、适当系数正则性和区域条件下，椭圆方程弱解可获得 W^{2,p} 型估计。"],
        generalRequirements: ["必须说明 p 的范围和算子系数条件。", "必须区分全空间、内部和有边界版本。"],
        forbiddenErrors: ["【端点误用】不加额外理论就把强型估计推广到 p=1 或 p=infinity。", "【低频项遗漏】有界域中无条件删去 ||u||_{L^p}。", "【系数误用】粗糙变系数下直接套常系数奇异积分公式。"],
        parameterConstraints: { exponent: "标准强型估计要求 1<p<infinity。", coefficients: "变系数版本必须满足所引用定理的连续性或振荡条件。" },
        closureChecks: ["核对 p、系数与区域条件。", "核对估计是否需要低阶 ||u|| 项。", "由 W^{2,p} 估计推出嵌入结论时再次检查 p 与维数。"],
        scenarioChecks: { sobolevEmbedding: ["从 W^{2,p} 推到 Hölder 或连续性时必须核对 Sobolev 指数关系。"] },
    },
    // De Giorgi-Nash-Moser 理论把粗糙系数下的弱解提升为 Hölder 连续，前提不能省略。
    "de-giorgi-nash-moser-regularity": {
        definitions: ["De Giorgi-Nash-Moser 正则性描述一致椭圆散度型方程弱解的局部有界性、Hölder 连续性和 Harnack 控制。"],
        formulas: ["典型结论为 ||u||_{C^{alpha}(Omega')}<=C(||u||_{L^2(Omega)}+||f||)；alpha 和 C 依赖椭圆性、维数、系数界和距离边界。"],
        theorems: ["对有界可测一致椭圆系数的齐次方程，弱解具有局部 Hölder 连续代表；非齐次结论需额外控制 f。"],
        generalRequirements: ["必须区分齐次与非齐次方程。", "必须说明弱解空间、系数可测性和局部区域。"],
        forbiddenErrors: ["【系数条件夸大】把有界可测系数误写成连续系数要求或反向使用 Schauder。", "【非齐次遗漏】对任意分布 f 直接声称 Hölder 正则。", "【边界推广】把内点正则性直接推广到边界。"],
        parameterConstraints: { ellipticity: "主部系数必须一致椭圆并有界。", source: "f 必须满足所引用非齐次版本的可积性或 Morrey 控制。" },
        closureChecks: ["核对弱解和系数条件。", "确认结论是局部还是边界正则性。", "核对 Hölder 指数和常数依赖。"],
        scenarioChecks: { harnack: ["仅对非负齐次解使用 Harnack 形式，并核对球链位于域内。"] },
    },
    // 主特征值把最大值原理、正特征函数和谱参数联系起来。
    "elliptic-principal-eigenvalue": {
        definitions: ["椭圆算子的主特征值是存在正特征函数的首个谱参数，具体定义依算子和边界条件而定。"],
        formulas: ["典型 Dirichlet 问题为 -Delta phi=lambda phi in Omega，phi=0 on boundaryOmega；主特征函数可取严格正。"],
        theorems: ["在适当有界区域和椭圆性条件下，主特征值具有变分刻画，并与最大值原理和正特征函数相关。"],
        generalRequirements: ["必须明确谱参数、边界条件和函数空间。", "必须区分主特征值、任意特征值和连续谱。"],
        forbiddenErrors: ["【边界条件混淆】把 Dirichlet 变分商直接用于 Neumann 问题。", "【首特征值误判】只找到一个特征值就称其为主特征值。", "【正性遗漏】未核对特征函数符号和强最大值原理条件。"],
        parameterConstraints: { domain: "变分刻画需要匹配区域和边界正则性。", boundary: "必须说明 Dirichlet、Neumann 或 Robin 类型。" },
        closureChecks: ["验证特征方程和边界条件。", "核对变分商或谱序关系。", "验证主特征函数的正性及归一化。"],
        scenarioChecks: { maximumPrinciple: ["使用主特征值判断最大值原理时必须核对零阶项和符号约定。"] },
    },
    // p-Laplace 是非线性退化/奇异椭圆模型，不能套用线性叠加和 Green 函数。
    "p-laplace-equation": {
        definitions: ["p-Laplace 算子为 Delta_p u=div(|grad u|^{p-2}grad u)，通常取 1<p<infinity。"],
        formulas: ["弱形式为 积分 |grad u|^{p-2}grad u·grad v = 积分 f v 加边界项；非线性来自梯度系数。"],
        theorems: ["在适当空间和数据条件下，p-Laplace Dirichlet 问题可由严格凸能量或单调性获得弱解存在性与唯一性。"],
        generalRequirements: ["必须声明 p 的范围、解空间 W^{1,p} 和边界条件。", "必须区分 p>2 的退化/扩散行为与 1<p<2 的奇异行为。"],
        forbiddenErrors: ["【线性叠加误用】把两个 p-Laplace 解相加仍称为解。", "【p范围遗漏】在 p<=1 时直接使用标准单调性结论。", "【梯度零点误用】把 |grad u|^{p-2} 当作处处光滑系数。"],
        parameterConstraints: { exponent: "标准理论要求 1<p<infinity。", space: "弱解和测试函数必须处于匹配的 Sobolev 空间。" },
        closureChecks: ["验证非线性弱形式。", "核对边界迹和能量有限性。", "用单调性或严格凸性说明唯一性范围。"],
        scenarioChecks: { comparison: ["比较原理必须引用 p-Laplace 的单调性版本，不能直接套线性最大值原理。"] },
    },
    // Monge-Ampère 方程要求凸性分支；形式上满足行列式方程不等于可接受解。
    "monge-ampere-equation": {
        definitions: ["Monge-Ampère 方程典型形式为 det(D^2u)=f，解的概念可为经典、凸、粘性或 Alexandrov 解。"],
        formulas: ["在凸解分支上 det(D^2u)=f>=0；变量变换和边界条件必须保持所选凸性分支。"],
        theorems: ["存在唯一性通常要求 f 的正性/可积性、凸区域和凸边界数据等条件；具体结论依解概念而异。"],
        generalRequirements: ["必须明确解概念和凸性分支。", "必须说明 Hessian 行列式、区域凸性及边界数据条件。"],
        forbiddenErrors: ["【分支遗漏】只验证 det(D^2u)=f 而不验证凸性。", "【正性遗漏】f 改变符号时仍套用凸解理论。", "【经典解夸大】Alexandrov/粘性解结论被写成 C^2 经典解。"],
        parameterConstraints: { convexity: "区域、边界数据和解必须满足所用凸性要求。", density: "f 的正性、可测性或可积性必须匹配所引用定理。" },
        closureChecks: ["验证 Hessian 行列式方程。", "验证凸性或所选粘性/测度解条件。", "核对边界数据和唯一性结论所属解类。"],
        scenarioChecks: { classicalSolution: ["只有在已证明 C^2 正则性和严格凸性时，才使用逐点 Hessian 方程。"] },
    },
    // 临界 Sobolev 指数决定嵌入的连续性、紧性和椭圆方程的临界非线性。
    "critical-sobolev-exponent": {
        definitions: ["n>p 时 W^{1,p} 的临界指数为 p*=np/(n-p)，它区分连续嵌入与紧嵌入的边界。"],
        formulas: ["W_0^{1,p}(Omega) 嵌入 L^q(Omega) 对 q<=p* 成立，q<p* 时在适当有界域上通常紧；q=p* 为临界情形。"],
        theorems: ["临界指数处一般连续但不紧，紧性失败会影响变分法和椭圆方程存在性。"],
        generalRequirements: ["必须区分 n<=p 与 n>p。", "必须说明区域有界性、边界和嵌入的目标空间。"],
        forbiddenErrors: ["【指数计算错误】把 np/(n-p) 用于 n<=p。", "【紧性误判】把临界嵌入写成紧嵌入。", "【边界遗漏】不区分 W^{1,p} 与 W_0^{1,p}。"],
        parameterConstraints: { dimension: "临界指数公式仅在 n>p 时按该形式使用。", exponent: "必须明确 q 与 p* 的关系。" },
        closureChecks: ["计算临界指数并核对维数。", "判断连续或紧嵌入。", "将嵌入结论与能量泛函或非线性项的可积性对应。"],
        scenarioChecks: { concentrationCompactness: ["临界问题不能直接使用弱收敛推出强收敛，需处理集中现象。"] },
    },
    // 障碍问题是变分不等式，接触集上的方程与非接触集上的方程不同。
    "obstacle-problem": {
        definitions: ["障碍问题在满足 u>=psi 的凸集合中最小化能量，解在非接触区满足方程并在接触区满足不等式。"],
        formulas: ["典型变分不等式：a(u,v-u)>=F(v-u) 对所有 v 属于 K={v:v>=psi}；不可将其全域当作 Lu=f。"],
        theorems: ["在连续强制双线性型和非空闭凸可行集下，变分不等式存在唯一解；接触集和自由边界需另行分析。"],
        generalRequirements: ["必须明确障碍 psi、可行集 K 和边界条件。", "必须区分接触区、非接触区和自由边界。"],
        forbiddenErrors: ["【全域等式误用】在接触集上仍写 Lu=f。", "【可行集遗漏】未验证候选函数满足 u>=psi。", "【自由边界混淆】把接触边界当作预先给定的固定边界。"],
        parameterConstraints: { obstacle: "psi 必须具有使 K 非空和变分不等式有意义的正则性。", coercivity: "能量型必须在相应空间上连续且强制。" },
        closureChecks: ["验证可行性 u>=psi。", "验证变分不等式对所有可行比较函数成立。", "在非接触区核对方程，在接触区核对不等式。"],
        scenarioChecks: { freeBoundary: ["若讨论自由边界正则性，必须明确采用的解概念和非退化条件。"] },
    },
    // 连续性方法把参数化方程的可解性沿路径延拓，必须同时验证开性、闭性和先验估计。
    "method-of-continuity": {
        definitions: ["连续性方法通过一族 L_t(u)=f_t 将已知可解问题连接到目标椭圆问题。"],
        formulas: ["解集 S={t in [0,1]: 存在满足边界条件的解 u_t}；证明 S 非空、相对开、相对闭并需先验估计。"],
        theorems: ["若线性化算子可逆、解有统一先验估计且非线性映射满足所需连续性，则可将可解性从 t=0 延拓到 t=1。"],
        generalRequirements: ["必须明确同伦路径、解空间和边界条件。", "开性、闭性和先验估计不能用‘显然连续’一句代替。"],
        forbiddenErrors: ["【闭性遗漏】没有统一先验估计就用极限得到解。", "【开性遗漏】未验证线性化算子可逆。", "【路径错配】中间方程不保持椭圆性或边界条件。"],
        parameterConstraints: { path: "L_t 和 f_t 必须在整个 t 区间保持适用的椭圆性和数据正则性。", estimate: "先验估计必须与 t 无关。" },
        closureChecks: ["验证 t=0 的起始解。", "分别说明相对开和相对闭。", "给出统一先验估计并完成 [0,1] 的连通性结论。"],
        scenarioChecks: { nonlinear: ["非线性问题还需核对线性化算子及其核、余核条件。"] },
    },
    // Pohožaev 恒等式通过乘子 x·∇u 对方程积分，导出星形域上临界/超临界指数非线性椭圆方程的非存在性判据。
    "pohozaev-identity": {
        definitions: ["Pohožaev 恒等式通过将方程乘以乘子 x·∇u 并在域上积分，将体积分与边界通量联系起来；仅适用于星形域（或具有相应 Killing 向量场的区域）。典型例子：对 -Delta u = u^p（p=(n+2)/(n-2)，n>=3）在有界星形域上满足零 Dirichlet 条件的 C^2 解，将方程乘以 x·∇u 在 Omega 上积分后，左端化为含 (n-2)/2 系数的项，右端化为含 n/(p+1) 系数的项加边界通量；两式相减后边界项为非负，而内部项经指数代入后恰好相消，导出矛盾，从而无非零解存在。"],
        formulas: ["对方程 -Delta u = f(u) 在星形域 Omega（以原点为星形中心）上，典型恒等式形式为：(n-2)/2 * integral_Omega u f(u) = n * integral_Omega F(u) + 1/2 * integral_{boundaryOmega} (partial_n u)^2 (x·n) dS，其中 F' = f；具体系数和边界项由具体算子和乘子推导，不能背诵。", "推论：对 -Delta u = |u|^{p-1}u 在有界星形 Omega 上的非零 Dirichlet 解，当 p >= (n+2)/(n-2)（n>=3）时恒等式导出矛盾，从而无非零 C^2 解。"],
        theorems: ["在星形域、Dirichlet 边界条件和 C^2 解的前提下，Pohožaev 恒等式成立；利用它可证明超临界或临界 Sobolev 指数时正则解不存在。", "对次临界指数 p < (n+2)/(n-2)，Pohožaev 恒等式不给出非存在性，不能将非存在性结论推广到次临界情形。"],
        generalRequirements: ["必须先验证区域为星形域（关于所选中心）；对非星形域，恒等式不适用，不能直接使用非存在性结论。", "必须明确空间维数 n>=3；二维情形临界指数概念和恒等式形式不同，不能套用三维及以上公式。", "必须从具体方程和乘子推导边界项，不能省略边界通量项。"],
        forbiddenErrors: ["【星形条件遗漏】在一般有界域甚至非星形域上直接使用基于星形区域推导的非存在性结论。", "【指数范围错误】把非存在性结论用于次临界指数 p < (n+2)/(n-2)，或混用临界与超临界的结论。", "【边界项遗漏】积分乘以 x·∇u 后未保留边界通量项，导致恒等式形式错误。", "【维数错误】直接将 n>=3 的临界指数公式 (n+2)/(n-2) 用于 n=2。", "【解正则性不足】在仅知 H_0^1 弱解时直接使用需要 C^2 的经典恒等式，而未说明正则性提升。"],
        parameterConstraints: { domain: "区域必须为星形域（相对某固定中心），或使用推广版本时须说明所用向量场条件。", dimension: "n>=3 时临界指数为 (n+2)/(n-2)；n=2 时恒等式形式和临界指数概念须另行处理。", regularity: "经典推导需要 u 至少属于 C^2(Omega) ∩ C^1(barOmega)；对弱解须先通过正则性定理提升。" },
        closureChecks: ["核对区域星形性及所选中心。", "由方程逐步推导乘子积分，保留全部边界项。", "核对维数和指数范围，确认所得矛盾或结论正确。", "若用于非存在性，验证所有项的符号一致性导出矛盾。"],
        scenarioChecks: { nonexistence: ["验证 Omega 是星形域，指数满足 p >= (n+2)/(n-2)（n>=3），边界条件为齐次 Dirichlet。", "从恒等式导出两侧同号矛盾，明确说明每一项的符号来源。", "非零解假设与恒等式矛盾时，逐步写出推导而非直接引用结论。"], generalNonlinearity: ["对一般非线性 f(u)，必须分别处理 F(u) = integral_0^u f(s) ds 的符号与增长条件。", "无法直接套幂函数结论，须重新推导恒等式并检查每项符号。"] },
    },
    // Fredholm 择一处理椭圆算子唯一性与存在性等价的情形，以及核非零时伴随核的相容条件。
    "fredholm-alternative-elliptic": {
        definitions: ["椭圆算子的 Fredholm 择一描述以下二择：要么 Lu=f 对任意 f 存在唯一解，要么齐次方程 Lu=0 存在非平凡解且 Lu=f 有解当且仅当 f 与伴随核正交；两种情形必居其一。"],
        formulas: ["标准框架：L: V -> V* 为 Fredholm 算子（指标为零），则 dim ker L = dim ker L*，Lu=f 可解当且仅当 <f,v>=0 对所有 v in ker L* 成立。", "典型椭圆实现：取 L = -Delta + c(x) 在 H_0^1(Omega) 上，通过 Rellich 紧嵌入 H_0^1 hookrightarrow L^2 将 L 写成可逆算子加紧扰动，从而 L 为 Fredholm 算子（指标零）。"],
        theorems: ["对有界域上的二阶一致椭圆算子（含适当低阶项），若不位于特征值处则方程唯一可解；若位于特征值处须满足 Fredholm 相容条件。", "唯一性蕴含存在性（Fredholm 指标为零）：ker L = {0} 等价于 L 为满射。"],
        generalRequirements: ["必须明确函数空间、算子定义域和边界条件，才能判断 Fredholm 性质是否成立。", "不能仅验证唯一性就声称存在性，须通过 Fredholm 指标为零或紧嵌入框架保证。", "必须显式构造或描述伴随算子 L* 及其核，才能写出相容条件。", "必须区分算子可逆（Lax-Milgram 情形）、算子为 Fredholm 但核非零（需相容条件）、算子非 Fredholm（无界域或强退化情形）。"],
        forbiddenErrors: ["【唯一性与存在性混淆】仅证明 ker L = {0} 就直接声称存在解，未通过 Fredholm 框架或自反空间论证。", "【伴随核遗漏】核非零时直接给出解的表达式，未验证 f 与 ker L* 的正交相容条件。", "【无界域误用】对无界域直接套有界域的 Fredholm 结论，可能紧嵌入失效。", "【Lax-Milgram 混淆】强制性成立时算子直接可逆，与 Fredholm 择一中核非零情形本质不同，不能混用。", "【指标误用】非零 Fredholm 指标时唯一性和存在性不再等价，不得直接引用零指标择一定理。"],
        parameterConstraints: { domain: "有界域上通过紧嵌入实现 Fredholm 性；无界域须另行验证紧性条件。", operator: "必须说明算子阶数、椭圆性、低阶项和边界条件，以确认算子在相应 Sobolev 空间中为指标零的 Fredholm 算子。", adjoint: "伴随算子 L* 及其边界条件须与原算子对应，不能省略伴随边界条件的推导。" },
        closureChecks: ["验证 L 为 Fredholm 算子（通常通过紧嵌入和 Riesz-Schauder 理论）。", "确认 Fredholm 指标为零（dim ker L = dim ker L*）。", "若 ker L = {0}：直接得到存在唯一性，无需相容条件。", "若 ker L ≠ {0}：显式列出 ker L* 的基，写出 f 需满足的正交相容条件，再给出解（模 ker L）。", "代入验证解满足方程和边界条件。"],
        scenarioChecks: { nonzeroKernel: ["显式求解 Lu=0 得到 ker L 的基，以及 L*v=0 得到 ker L* 的基。", "写出相容条件 integral_Omega f v_i = 0 对所有 ker L* 的基元素 v_i。", "在相容条件成立时给出解，并说明解的非唯一性（加任意 ker L 的元素仍为解）。"], periodicOrNeumannProblem: ["纯 Neumann 问题的常数核是最典型的 Fredholm 非唯一情形；相容条件为 integral_Omega f + integral_{boundaryOmega} g = 0，解模常数唯一。", "此情形 ker L = span{1}，ker L* = span{1}，须明确写出正交条件。"] },
    },
};
