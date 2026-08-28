import type { MathV2L3Node, MathV2L3Rules } from "./types.ts";

// 本文件只维护 L2“数论-模形式”下的原子 L3 知识项。
// 每个 L3 必须是可独立命题和审查的公式、定理、判据或数学构造，不能退化为另一个宽泛方向。
export const NUMBER_THEORY_MODULAR_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    // Eisenstein 级数 E_k：模形式的显式生成元。
    "eisenstein-series": {
        id: "eisenstein-series", l2Key: "number-theory-modular", name: "Eisenstein 级数", kind: "object",
        aliases: ["Eisenstein级数", "Eisenstein series", "E_4", "E_6", "艾森斯坦级数"],
    },
    // 级 1 模形式环 M_*(SL_2(Z)) = C[E_4, E_6] 与 valence 公式。
    "level-one-modular-forms-ring": {
        id: "level-one-modular-forms-ring", l2Key: "number-theory-modular", name: "级 1 模形式环与 valence 公式", kind: "theorem",
        aliases: ["模形式环", "C[E4,E6]", "valence公式", "维数公式", "判别式Δ"],
    },
    // Hecke 算子与特征形式的 Fourier 系数乘性。
    "hecke-operator-eigenform": {
        id: "hecke-operator-eigenform", l2Key: "number-theory-modular", name: "Hecke 算子与特征形式", kind: "object",
        aliases: ["Hecke算子", "Hecke operator", "特征形式", "Hecke特征值", "系数乘性"],
    },
    // Petersson 内积与 cusp 形式空间的正交分解。
    "petersson-inner-product": {
        id: "petersson-inner-product", l2Key: "number-theory-modular", name: "Petersson 内积", kind: "object",
        aliases: ["Petersson内积", "Petersson inner product", "cusp形式空间", "自伴性", "正交特征基"],
    },
    // 模形式 L 函数：Euler 乘积与函数方程。
    "modular-l-function-functional-equation": {
        id: "modular-l-function-functional-equation", l2Key: "number-theory-modular", name: "模形式 L 函数与函数方程", kind: "theorem",
        aliases: ["模形式L函数", "L函数函数方程", "L函数Euler乘积", "Mellin变换", "Deligne界"],
    },
    // Atkin-Lehner 新形式理论。
    "atkin-lehner-newform": {
        id: "atkin-lehner-newform", l2Key: "number-theory-modular", name: "Atkin-Lehner 新形式理论", kind: "theorem",
        aliases: ["新形式", "newform", "旧形式", "Atkin-Lehner算子", "重数一定理"],
    },
    // Eichler-Shimura 与模形式的 Galois 表示。
    "eichler-shimura-galois-representation": {
        id: "eichler-shimura-galois-representation", l2Key: "number-theory-modular", name: "Eichler-Shimura 与 Galois 表示", kind: "theorem",
        aliases: ["Eichler-Shimura关系", "Galois表示", "Deligne表示", "ℓ进表示", "Frobenius迹"],
    },
    // 模性定理：Q 上椭圆曲线与权 2 新形式的对应。
    "modularity-theorem": {
        id: "modularity-theorem", l2Key: "number-theory-modular", name: "模性定理", kind: "theorem",
        aliases: ["模性定理", "modularity theorem", "Taniyama-Shimura", "Wiles定理", "L(E,s)=L(f,s)"],
    },
});

// 每个 L3 规则对象都使用以下八个字段：definitions、formulas、theorems、generalRequirements、forbiddenErrors、parameterConstraints、closureChecks、scenarioChecks。
export const NUMBER_THEORY_MODULAR_L3_RULES: Record<string, MathV2L3Rules> = {
    // Eisenstein 级数：权 k 模形式的显式构造与 q 展开。
    "eisenstein-series": {
        definitions: ["Eisenstein 级数是权 k（偶数 ≥ 4）模形式的显式构造：由格上的求和给出，其 q 展开的 Fourier 系数是除数和函数，构成非 cusp 方向的自然生成元。"],
        formulas: ["格求和：G_k(z) = ∑_{(m,n) ≠ (0,0)} (mz + n)^{-k}，在 k 偶且 k ≥ 4 时绝对收敛。", "归一化 q 展开：E_k(z) = 1 - (2k/B_k) ∑_{n ≥ 1} σ_{k-1}(n) q^n，q = e^{2πiz}，B_k 为 Bernoulli 数。", "低权实例：E_4 = 1 + 240 ∑ σ_3(n) q^n，E_6 = 1 - 504 ∑ σ_5(n) q^n。", "权 2 例外：E_2 不是模形式（准模形式），满足 E_2(-1/z) = z^2 E_2(z) + 12z/(2πi) 型带修正的变换律。"],
        theorems: ["E_k（k 偶 ≥ 4）是 SL_2(Z) 上权 k 的模形式，且在 cusp 处取值 1，故不是 cusp 形式。", "系数恒等式来自 Eisenstein 级数间的乘法关系，例如 E_4^2 = E_8 给出 σ_7(n) 与 σ_3 卷积的恒等式。", "k 奇时 G_k ≡ 0（由 (m, n) ↦ (-m, -n) 的对称性），故只有偶权非零。"],
        generalRequirements: ["使用 E_k 必须声明权 k 为偶数且 k ≥ 4，或明确指出 E_2 的准模性。", "涉及 q 展开必须固定 q = e^{2πiz} 的约定与归一化常数 -2k/B_k。"],
        forbiddenErrors: ["【权限制忽略】对奇数权或 k = 2 断言 E_k 是模形式。", "【常数因子错写】把 E_4 的系数写成 240 以外的值或漏掉归一化。", "【cusp 形式误判】把 E_k 当作 cusp 形式（其常数项为 1）。", "【收敛性忽略】k = 2 时按绝对收敛处理格求和。"],
        parameterConstraints: { weightParity: "E_k 为模形式要求 k 为偶数且 k ≥ 4。", normalization: "E_k 的常数项归一化为 1。", qConvention: "q = e^{2πiz}，z 在上半平面 H。" },
        closureChecks: ["核对权的奇偶与下界。", "写出 q 展开前几项并与 σ_{k-1} 数值核对。", "若用于恒等式推导，比较两侧同权空间的维数与前若干系数。"],
        scenarioChecks: { divisorSumIdentity: ["由 E_4^2 = E_8 等关系导出除数和函数的卷积恒等式。"], deltaConstruction: ["用 Δ = (E_4^3 - E_6^2)/1728 构造权 12 cusp 形式。"], quasimodularE2: ["涉及 E_2 或导数时必须使用准模形式框架（Ramanujan 微分方程）。"] },
    },
    // 级 1 模形式环：M_*(SL_2(Z)) = C[E_4, E_6]，valence 公式给出零点计数。
    "level-one-modular-forms-ring": {
        definitions: ["该定理刻画 SL_2(Z) 上全体模形式构成的分次环结构，并用 valence（阶数）公式把零点分布限制为权的线性约束，从而给出各权空间的维数。"],
        formulas: ["环结构：M_*(SL_2(Z)) = C[E_4, E_6]（E_4、E_6 代数无关）。", "判别式：Δ = (E_4^3 - E_6^2)/1728 = q ∏_{n ≥ 1}(1 - q^n)^{24}，是权 12 的 cusp 形式且在 H 内无零点。", "valence 公式：ord_∞ f + (1/2) ord_i f + (1/3) ord_ρ f + ∑_{P ≠ i, ρ} ord_P f = k/12（ρ = e^{2πi/3}）。", "维数：k 偶 ≥ 4 时 dim M_k = ⌊k/12⌋ + 1，除 k ≡ 2 (mod 12) 时为 ⌊k/12⌋；且 S_k = Δ · M_{k-12}。"],
        theorems: ["结构定理：每个权 k 模形式唯一表示为 E_4^a E_6^b（4a + 6b = k）的线性组合。", "valence 公式由留数定理在基本域边界上积分 f'/f 得到，其中 i 与 ρ 的椭圆点权重分别为 1/2、1/3。", "推论：k < 12 时 S_k = 0（无非零 cusp 形式），S_12 由 Δ 一维生成，M_k 的维数公式如上。"],
        generalRequirements: ["使用维数公式必须声明权为偶数（奇权空间为 0）与级为 1。", "零点计数必须按 valence 公式的权重处理椭圆点 i 与 ρ。"],
        forbiddenErrors: ["【椭圆点权重遗漏】在 valence 公式中对 i、ρ 使用权重 1 而非 1/2、1/3。", "【维数公式误用】忽略 k ≡ 2 (mod 12) 的例外情形。", "【级混用】把级 1 的结构定理搬到 Γ_0(N)（N > 1）。", "【Δ 零点误判】断言 Δ 在上半平面内部有零点。"],
        parameterConstraints: { level: "结论限定 SL_2(Z)（级 1）。", weightParity: "非零模形式要求 k 为偶数（k ≥ 0）。", ellipticPoints: "valence 公式中 i、ρ 的阶数分别按 1/2、1/3 加权。" },
        closureChecks: ["把待定形式写成 E_4^a E_6^b 的组合并核对权。", "用 valence 公式核验零点总量等于 k/12。", "用维数公式确认所给基的个数正确。"],
        scenarioChecks: { identityByDimension: ["两个同权模形式若前 dim M_k 个系数相同则相等，可据此证明恒等式。"], cuspFormFactorization: ["S_k = Δ · M_{k-12} 用于把 cusp 形式降权分析。"], ramanujanTau: ["Δ 的系数 τ(n) 的乘性与同余（如 τ(n) ≡ σ_{11}(n) mod 691）由结构定理与 Hecke 理论给出。"] },
    },
    // Hecke 算子：T_n 的系数公式与特征形式的乘性。
    "hecke-operator-eigenform": {
        definitions: ["Hecke 算子是作用在模形式空间上的一族相互交换的线性算子，其共同特征向量（特征形式）的 Fourier 系数具有乘性结构，是 L 函数 Euler 乘积的来源。"],
        formulas: ["系数公式：f = ∑ a_n q^n 时 T_p f 的第 m 个系数为 a_{mp} + p^{k-1} a_{m/p}（p ∤ m 时第二项为 0）。", "交换性与乘性：T_m T_n = ∑_{d | gcd(m,n)} d^{k-1} T_{mn/d^2}；gcd(m, n) = 1 时 T_m T_n = T_{mn}。", "归一化特征形式（a_1 = 1）：T_n f = a_n f，且 a_m a_n = ∑_{d | gcd(m,n)} d^{k-1} a_{mn/d^2}。", "递推：a_{p^{r+1}} = a_p a_{p^r} - p^{k-1} a_{p^{r-1}}。"],
        theorems: ["Hecke 算子保持 M_k 与 S_k，且 (n, N) = 1 的 T_n 关于 Petersson 内积自伴，故 S_k(N) 有 Hecke 特征形式的正交基。", "归一化特征形式的系数完全乘性化：gcd(m, n) = 1 ⇒ a_{mn} = a_m a_n，这给出 L(f, s) 的 Euler 乘积。", "Deligne 界（Ramanujan-Petersson）：权 k 归一化 cusp 特征形式满足 |a_p| ≤ 2 p^{(k-1)/2}。"],
        generalRequirements: ["使用系数乘性必须先归一化 a_1 = 1 并声明 f 是 Hecke 特征形式。", "作用于带级结构的空间时必须区分 (n, N) = 1 与 p | N 的算子（后者为 U_p，性质不同）。"],
        forbiddenErrors: ["【乘性滥用】对非特征形式或未归一化的形式使用 a_{mn} = a_m a_n。", "【完全乘性误设】断言 a_{mn} = a_m a_n 对所有 m, n（包括不互素）成立。", "【权因子错写】把 p^{k-1} 写成 p^k 或 p^{k/2}。", "【坏素数混用】对 p | N 使用 T_p 的标准递推而不改用 U_p。"],
        parameterConstraints: { normalization: "特征形式需归一化为 a_1 = 1。", levelCoprimality: "自伴性与标准乘性要求 gcd(n, N) = 1。", weight: "系数公式中的权因子为 p^{k-1}。" },
        closureChecks: ["确认 f 为特征形式并归一化。", "用递推 a_{p^{r+1}} = a_p a_{p^r} - p^{k-1} a_{p^{r-1}} 核验高次幂系数。", "核对互素乘性与 Deligne 界的数量级。"],
        scenarioChecks: { tauFunctionMultiplicativity: ["Δ 的 τ(n) 满足互素乘性与 |τ(p)| ≤ 2p^{11/2}。"], eulerProductDerivation: ["由乘性与递推得到 L(f, s) 的二次 Euler 因子。"], eigenbasisDecomposition: ["用自伴性把 S_k(N)^{new} 分解为一维特征子空间（重数一）。"] },
    },
    // Petersson 内积：cusp 形式空间上的 Hermite 内积与自伴性。
    "petersson-inner-product": {
        definitions: ["Petersson 内积是 cusp 形式空间上的 Hermite 内积，由双曲测度加权的积分定义；它使 Hecke 算子（与级互素部分）自伴，从而提供正交特征基与谱语言。"],
        formulas: ["定义：⟨f, g⟩ = ∫_{Γ\\H} f(z) ḡ(z) y^k (dx dy)/y^2，其中 Γ 为所讨论的同余子群。", "不变性：f ḡ y^k 在 Γ 作用下不变，dx dy/y^2 是双曲面积测度，故积分与基本域选取无关。", "收敛条件：f 或 g 至少一个为 cusp 形式（cusp 处指数衰减）时积分收敛；两者都含 Eisenstein 部分时发散。", "自伴性：gcd(n, N) = 1 时 ⟨T_n f, g⟩ = ⟨f, T_n g⟩。"],
        theorems: ["Petersson 内积在 S_k(Γ) 上是正定 Hermite 内积，使 S_k(Γ) 成为有限维 Hilbert 空间。", "与级互素的 Hecke 算子构成交换的自伴算子族，因此 S_k(N) 有由 Hecke 特征形式组成的正交基，且特征值实。", "Petersson 范数出现在特征值的加权分布（Petersson 公式/迹公式）与 L 函数特殊值（如 ⟨f, f⟩ 与 L(sym^2 f, 1) 的关系）中。"],
        generalRequirements: ["使用内积前必须验证收敛（至少一个参量为 cusp 形式）。", "自伴性只能用于与级互素的 Hecke 算子；p | N 的 U_p 需单独处理。"],
        forbiddenErrors: ["【收敛性忽略】对两个 Eisenstein 级数计算 Petersson 内积。", "【测度错写】把测度写成 dx dy 或漏掉 y^k 权因子。", "【自伴范围越界】对 p | N 的算子断言自伴，进而错误地推出正交分解。", "【基本域依赖】把积分值当作依赖基本域选取的量。"],
        parameterConstraints: { cuspidality: "至少一个参量必须是 cusp 形式以保证收敛。", weightFactor: "被积函数须带 y^k 权与双曲测度 dx dy / y^2。", heckeCoprimality: "自伴性要求 gcd(n, N) = 1。" },
        closureChecks: ["核对收敛条件与测度、权因子写法。", "利用自伴性给出正交特征基并说明特征值为实数。", "若涉及范数比值，明确归一化（如 a_1 = 1 的特征形式）。"],
        scenarioChecks: { orthogonalEigenbasis: ["由自伴 Hecke 族构造 S_k(N) 的正交特征基，配合重数一定理定出新形式。"], oldNewOrthogonality: ["旧子空间与新子空间在 Petersson 内积下正交，用于分解 S_k(N)。"], petersonNormAndLValue: ["把 ⟨f, f⟩ 与对称平方 L 函数在 s = 1 的值联系起来做归一化。"] },
    },
    // 模形式 L 函数：Mellin 变换、Euler 乘积与函数方程。
    "modular-l-function-functional-equation": {
        definitions: ["模形式的 L 函数由 Fourier 系数构成的 Dirichlet 级数定义；通过 Mellin 变换与模变换律得到完备化 L 函数的解析延拓和函数方程，是 L 函数解析理论的原型。"],
        formulas: ["Dirichlet 级数：L(f, s) = ∑_{n ≥ 1} a_n n^{-s}，在 Re(s) > (k+1)/2（cusp 特征形式）绝对收敛。", "Euler 乘积（级 1 归一化特征形式）：L(f, s) = ∏_p (1 - a_p p^{-s} + p^{k-1-2s})^{-1}。", "完备化与 Mellin 变换：Λ(f, s) = (2π)^{-s} Γ(s) L(f, s) = ∫_0^∞ f(iy) y^{s-1} dy。", "函数方程（级 1，权 k）：Λ(f, s) = (-1)^{k/2} Λ(f, k - s)；一般级 N 的形式为 Λ(f, s) = ε · N^{k/2 - s} Λ(f, k - s) 型，ε = ±1 由 Fricke 对合的特征值给出。"],
        theorems: ["Hecke 定理：cusp 形式的 L 函数可解析延拓到整个复平面（cusp 形式时为整函数），并满足上述函数方程；反之满足合适增长与函数方程的 Dirichlet 级数来自模形式（Weil 逆定理）。", "函数方程的来源是模变换 f(-1/z) = z^k f(z)（级 1）在 Mellin 变换下的对应，故 s ↦ k - s 的对称中心为 s = k/2。", "Deligne 界给出临界带内的系数控制：|a_n| ≤ d(n) n^{(k-1)/2}，从而确定绝对收敛半平面与临界线位置。"],
        generalRequirements: ["必须声明形式是 cusp 特征形式并已归一化，否则 Euler 乘积不成立。", "写函数方程必须给出权 k、级 N 与符号 ε 的来源。"],
        forbiddenErrors: ["【Euler 乘积滥用】对非特征形式写出二次 Euler 因子。", "【对称中心错置】把函数方程写成 s ↦ 1 - s（这是解析归一化后的形式，需先做 s → s + (k-1)/2 平移）。", "【Gamma 因子缺失】只对 L(f, s) 本身断言函数方程而不完备化。", "【收敛域误判】在 Re(s) ≤ (k+1)/2 处直接使用级数表达式。"],
        parameterConstraints: { cuspidalEigenform: "Euler 乘积与整性要求 f 是归一化 cusp 特征形式。", weightLevel: "函数方程的符号与位移由权 k 与级 N 决定。", convergence: "级数与乘积在 Re(s) > (k+1)/2 绝对收敛。" },
        closureChecks: ["核对系数归一化与 Euler 因子形式。", "写出完备化 Λ(f, s) 并核验函数方程的对称中心 s = k/2。", "如需数值验证，比较若干系数与已知 L 函数值或特殊值。"],
        scenarioChecks: { analyticContinuation: ["用 Mellin 变换与 f(-1/z) 的变换律直接给出延拓与函数方程。"], normalizedNormalization: ["做 s → s + (k-1)/2 平移把临界线移到 Re(s) = 1/2 后再讨论零点。"], ellipticCurveLFunction: ["权 2 新形式的 L 函数与椭圆曲线 L(E, s) 一致，函数方程符号决定 BSD 中秩的奇偶性。"] },
    },
    // Atkin-Lehner 新形式理论：S_k(N) 的旧新分解与重数一。
    "atkin-lehner-newform": {
        definitions: ["新形式理论把级 N 的 cusp 形式空间分解为来自更低级的旧部分与本质属于级 N 的新部分，并证明新部分由 Hecke 特征形式唯一（重数一）张成。"],
        formulas: ["退化映射：M | N、d | (N/M) 时 f(z) ↦ f(dz) 把 S_k(M) 嵌入 S_k(N)，其像张成旧子空间 S_k(N)^{old}。", "分解：S_k(N) = S_k(N)^{old} ⊕ S_k(N)^{new}（关于 Petersson 内积正交，且 Hecke 稳定）。", "Atkin-Lehner 对合：对 Q ‖ N（Q 与 N/Q 互素）有对合 W_Q，Q = N 时为 Fricke 对合 W_N；新形式是各 W_Q 的特征向量。", "新形式的坏素数系数：p ‖ N 时 a_p = ±p^{k/2 - 1}（由 W_p 特征值决定），p^2 | N 时 a_p = 0（权 2 情形的标准结论）。"],
        theorems: ["Atkin-Lehner 定理：S_k(N)^{new} 有唯一（至多相差常数）归一化基使每个元素是所有 T_n（含 n | N）的特征形式，即重数一定理。", "新形式由其 Fourier 系数序列唯一决定级与权；两个不同级的新形式不可能有相同的全部系数（强重数一）。", "新形式的 L 函数满足带符号 ε 的精确函数方程，ε 由 Fricke 对合 W_N 的特征值给出。"],
        generalRequirements: ["讨论级 N 的特征形式必须先声明其属于新部分还是旧部分。", "使用坏素数系数公式必须区分 p ‖ N 与 p^2 | N。"],
        forbiddenErrors: ["【重数一误推到全空间】对 S_k(N) 整体（含旧部分）断言 Hecke 特征形式一维。", "【旧形式当新形式】把由低级形式提升得到的形式当作级 N 的新形式，导致导子判断错误。", "【坏素数系数错写】对 p^2 | N 仍写 a_p = ±p^{k/2-1}。", "【Atkin-Lehner 条件忽略】对不满足 Q ‖ N 的 Q 定义 W_Q。"],
        parameterConstraints: { levelDivisibility: "旧部分来自 M | N（M < N）与 d | (N/M) 的退化映射。", atkinLehnerIndex: "W_Q 要求 Q ‖ N（gcd(Q, N/Q) = 1）。", newformNormalization: "新形式归一化为 a_1 = 1。" },
        closureChecks: ["判定给定特征形式的导子（最小级）以区分新旧。", "核对全部 T_n（含坏素数）的特征性质与 Atkin-Lehner 特征值。", "用维数关系 dim S_k(N) = ∑_{M | N} σ_0(N/M) dim S_k(M)^{new} 交叉验证。"],
        scenarioChecks: { conductorDetermination: ["由系数在坏素数处的行为确定新形式的导子。"], signOfFunctionalEquation: ["用 Fricke 特征值定出 L 函数函数方程符号，进而判断中心零点的奇偶阶。"], levelLowering: ["模 ℓ 表示的层降（Ribet）把某级新形式换到更低级，是 Fermat 大定理证明的关键一步。"] },
    },
    // Eichler-Shimura 与 Galois 表示：Frobenius 迹等于 Hecke 特征值。
    "eichler-shimura-galois-representation": {
        definitions: ["Eichler-Shimura 关系把模曲线的（上）同调与 cusp 形式空间对应起来，并由此给出与每个特征形式关联的二维 ℓ 进 Galois 表示，其 Frobenius 迹恰为 Hecke 特征值。"],
        formulas: ["Eichler-Shimura 同构（权 2）：H^1(X_0(N), C) ≅ S_2(N) ⊕ S̄_2(N)，故 dim S_2(N) = g(X_0(N))。", "Eichler-Shimura 关系：在 J_0(N) 的 ℓ 进 Tate 模上 T_p = Frob_p + p·Frob_p^{-1}（p ∤ Nℓ）。", "Galois 表示：对权 k 新形式 f 存在 ρ_{f,ℓ} : G_Q → GL_2(Q̄_ℓ)，使 p ∤ Nℓ 时 tr ρ_{f,ℓ}(Frob_p) = a_p，det ρ_{f,ℓ}(Frob_p) = p^{k-1}（带特征时乘以 χ(p)）。", "特征多项式：X^2 - a_p X + p^{k-1}，其根即 Euler 因子 (1 - a_p p^{-s} + p^{k-1-2s})^{-1} 的倒根。"],
        theorems: ["Deligne 构造：权 k ≥ 2 的 Hecke 特征新形式对应二维 ℓ 进表示，在 p ∤ Nℓ 处非分歧，且迹/行列式如上；权 2 情形来自 J_0(N) 的 Tate 模（Eichler-Shimura）。", "Deligne 界 |a_p| ≤ 2p^{(k-1)/2} 由该表示的纯性（Weil 猜想）推出。", "模 ℓ 表示的不可约性、层降（Ribet）与形变理论（Mazur）构成 Wiles 证明模性的技术核心。"],
        generalRequirements: ["使用迹公式必须限定 p ∤ Nℓ（非分歧素数）。", "必须声明表示的系数域（Q̄_ℓ 或其整环）以及是特征形式对应的表示。"],
        forbiddenErrors: ["【分歧素数误用】在 p | N 或 p = ℓ 处套用 tr ρ(Frob_p) = a_p。", "【行列式错写】把 det 写成 p^k 或 p^{k/2}。", "【维数错配】把 dim S_2(N) 与 X_0(N) 的亏格弄反或忽略 Eisenstein 部分。", "【表示唯一性误设】不声明同构意义（半单化/相差有限指标）就断言表示唯一。"],
        parameterConstraints: { unramifiedPrimes: "迹与行列式公式要求 p ∤ Nℓ。", weightRange: "Deligne 构造要求权 k ≥ 2。", coefficientField: "表示取值于 GL_2(Q̄_ℓ)（或系数域的完备化）。" },
        closureChecks: ["核对所用素数是否非分歧。", "用特征多项式 X^2 - a_p X + p^{k-1} 与 Euler 因子对照。", "如涉及权 2，用亏格 g(X_0(N)) 核对 cusp 形式空间维数。"],
        scenarioChecks: { weightTwoJacobian: ["权 2 时通过 J_0(N) 的 Tate 模构造表示，并把 Hecke 作用翻译为 Frobenius 关系。"], modLReduction: ["取模 ℓ 得到剩余表示，用于层降与同余（如 τ(n) 的模 691 同余）。"], deligneBoundApplication: ["由表示的纯性推出系数的最优上界，用于解析估计。"] },
    },
    // 模性定理：Q 上椭圆曲线对应权 2 新形式。
    "modularity-theorem": {
        definitions: ["模性定理（原 Taniyama-Shimura-Weil 猜想）断言 Q 上每条椭圆曲线都来自权 2 新形式：其 L 函数与某个导子等于曲线导子的新形式的 L 函数相同，几何上表现为 X_0(N) 到 E 的非常量态射。"],
        formulas: ["L 函数等式：L(E, s) = L(f, s)，其中 f ∈ S_2(N)^{new}，N = cond(E)。", "系数对应：p ∤ N 时 a_p(f) = a_p(E) = p + 1 - #E(F_p)。", "几何形式：存在非常量态射 φ : X_0(N) → E（模参数化），等价地 E 是 J_0(N) 的商。", "表示形式：ρ_{E,ℓ} ≅ ρ_{f,ℓ} 作为 G_Q 的二维 ℓ 进表示。"],
        theorems: ["模性定理（Wiles、Taylor-Wiles，Breuil-Conrad-Diamond-Taylor 完成全部情形）：Q 上每条椭圆曲线都是模的。", "推论：L(E, s) 有到全平面的解析延拓与函数方程，从而 BSD 猜想中「在 s = 1 处的行为」有意义。", "Fermat 大定理：由 Frey 曲线的模性 + Ribet 层降 + Mazur 的 Γ_0 结论导出 x^n + y^n = z^n（n ≥ 3）无非零整数解。"],
        generalRequirements: ["必须给出曲线的导子 N（不是判别式）并说明与新形式级一致。", "系数对应只在 p ∤ N 处直接成立；坏素数处需按约化类型（分裂/非分裂乘性、加性）取 a_p = 1, -1, 0。"],
        forbiddenErrors: ["【导子判别式混用】用最小判别式 Δ 代替导子 N 作为新形式的级。", "【坏素数系数错写】在 p | N 处仍用 a_p = p + 1 - #E(F_p) 的一般形式而不区分约化类型。", "【定义域越界】把模性定理直接搬到一般数域上的椭圆曲线（一般情形仍未完全解决）。", "【FLT 因果颠倒】声称 Faltings 定理或模性定理单独即给出 Fermat 大定理，忽略层降与 Frey 曲线构造。"],
        parameterConstraints: { baseField: "定理陈述限定 Q 上的椭圆曲线。", conductor: "新形式的级必须等于 cond(E)，由 Tate 算法/约化类型计算。", weight: "对应的模形式权为 2 且为新形式。" },
        closureChecks: ["计算导子 N 与 a_p（若干小素数）并与新形式系数表对照。", "核对坏素数处的约化类型与相应 a_p 取值。", "若使用 L 函数性质，声明其来源是模性给出的延拓与函数方程。"],
        scenarioChecks: { conductorMatching: ["用 Tate 算法算出 N，再在权 2 级 N 的新形式空间中匹配系数。"], fermatLastTheorem: ["Frey 曲线的模性与层降导致级 2 的新形式不存在，从而完成反证。"], bsdSetup: ["模性给出 L(E, s) 的解析延拓，为讨论中心零点阶与秩的关系提供前提。"] },
    },
};
