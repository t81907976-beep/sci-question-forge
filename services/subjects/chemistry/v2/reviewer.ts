import { callLLM } from "../../../llmClient";
import { V2QuestionDraft, unescapeLiteralNewlines } from "./generator";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";

// 与生成端一致：对修复产物的文本字段还原双重转义的字面量 \n，并统一走 String() 防御。
function normalizeRepairedDraft(repaired: V2QuestionDraft): void {
    repaired.questionText = unescapeLiteralNewlines(String(repaired.questionText || ""));
    repaired.requiredAnswer = unescapeLiteralNewlines(String(repaired.requiredAnswer || ""));
    repaired.referenceAnswer = unescapeLiteralNewlines(String(repaired.referenceAnswer || ""));
    repaired.referenceSteps = Array.isArray(repaired.referenceSteps)
        ? repaired.referenceSteps.map(x => unescapeLiteralNewlines(String(x))).filter(Boolean)
        : [];
}

// 公式与符号格式硬规则：与生成端保持一致，禁止 LaTeX/Markdown 数学标记，只用纯文本 Unicode。
const FORMAT_RULE = `
【公式与符号格式（强制）】：
- questionText、requiredAnswer、referenceAnswer、referenceSteps 全部字段一律使用纯文本 Unicode 表达数学，禁止任何 LaTeX/Markdown 数学标记。
- 禁止出现 \\frac \\left \\right \\mathrm \\exp \\sqrt \\sum \\theta \\times \\cdot \\approx 等反斜杠命令，禁止 $ … $、$$ … $$、\\( … \\)、\\[ … \\] 等数学定界符。
- 分数写成 a/b；乘号用 ×，除号用 /，约等号用 ≈，正负号用 ±；上标用 Unicode（如 10⁻³、³ᐟ²）或括号形式 ^(3/2)；下标直接用 m_C、B_v 等文本；希腊字母直接用 ν、θ、Δ、χ、λ 等 Unicode 字符；单位用 cm⁻¹、kJ·mol⁻¹ 等纯文本。
`;

/**
 * V2 Node A2/A3: Question Reviewer + Repair Loop
 */

export interface ReviewResult {
    passed: boolean;
    validityIssues: string[];
    difficultyIssues: string[];
    depthIssues: string[];
    overallVerdict: string;
}

export interface ReviewedDraft {
    draft: V2QuestionDraft;
    reviewResult: ReviewResult;
    repairCycles: number;
    needsRegeneration: boolean;
    degradationLevel: 'stable' | 'oscillating' | 'diverging' | 'unrepairable';
    degradationReason: string;
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

function normalizeReviewResult(parsed: Partial<ReviewResult>): ReviewResult {
    const validityIssues = normalizeStringArray(parsed.validityIssues);
    const difficultyIssues = normalizeStringArray(parsed.difficultyIssues);
    const depthIssues = normalizeStringArray(parsed.depthIssues);
    // passed 只由合理性(validityIssues)和难度(difficultyIssues)决定；
    // depthIssues(3A-3D/能力边界)是非阻断警告，保留记录但不再废题，避免深度修复引起拆小问/过度废题。
    const passed = validityIssues.length === 0 && difficultyIssues.length === 0;

    return {
        passed,
        validityIssues,
        difficultyIssues,
        depthIssues,
        overallVerdict: String(parsed.overallVerdict || (passed ? "审查通过" : "审查未通过")),
    };
}

function normalizeNumericToken(value: number): string {
    return String(value)
        .replace(/\.0+$/, '')
        .replace(/(\.\d*?)0+$/, '$1');
}

function buildCoreDataTokens(value: number): string[] {
    const tokens = new Set<string>();
    const normalized = normalizeNumericToken(value);
    tokens.add(normalized);
    tokens.add(String(value));

    if (Number.isFinite(value)) {
        tokens.add(value.toPrecision(6).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e'));
        tokens.add(value.toExponential(6).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e'));
    }

    return [...tokens].filter(token => token && token !== 'NaN' && token !== 'Infinity' && token !== '-Infinity');
}

// 收窄版确定性检查：只判定"参考答案实际用到、却没有出现在题面 questionText 中"的 coreData 数值。
// 原全量检查（对所有 coreData 都要求出现在题面）会误杀纯冗余的 coreData，故 461b1db 删除；
// 这里加上"答案实际引用"这道门重新引入：既堵住"答案凭空使用题面没有的数据"这类致命问题，
// 又不会因为 coreData 里有答案未使用的量而废题。
// 说明：命中即写入 validityIssues 硬废题，不依赖审查模型的分类；
// 常见的小整数（如 2、3）通常在题面里也会因巧合出现而被判为 visibleInQuestion，因此几乎不会误报，
// 真正会被抓到的是 298.15、3.47e-5 这类高辨识度的关键输入数据。
function findLeakedCoreDataUsedByAnswer(draft: V2QuestionDraft): string[] {
    const questionText = draft.questionText.replace(/\s+/g, '');
    const referenceAnswer = (draft.referenceAnswer || '').replace(/\s+/g, '');
    const missing: string[] = [];

    Object.entries(draft.coreData || {}).forEach(([name, data]) => {
        const value = Number(data?.value);
        if (!Number.isFinite(value)) return;

        const tokens = buildCoreDataTokens(value).map(token => token.replace(/\s+/g, ''));
        const usedInAnswer = tokens.some(token => referenceAnswer.includes(token));
        if (!usedInAnswer) return; // 答案没用到该量 → 不强制要求写进题面

        const visibleInQuestion = tokens.some(token => questionText.includes(token));
        if (visibleInQuestion) return;

        const unit = String(data?.unit || '').trim();
        missing.push(`${name}=${normalizeNumericToken(value)}${unit ? ` ${unit}` : ''}`);
    });

    return missing;
}

function mergeDeterministicReviewIssues(draft: V2QuestionDraft, review: ReviewResult): ReviewResult {
    const leaked = findLeakedCoreDataUsedByAnswer(draft);
    if (leaked.length === 0) return review;

    const issue = `参考答案使用了以下 coreData 数值，但题面 questionText 中并未出现：${leaked.slice(0, 8).join('；')}。coreData 只能是题面数据镜像，答案实际用到的量必须在题面显式给出。`;
    const validityIssues = review.validityIssues.includes(issue)
        ? review.validityIssues
        : [...review.validityIssues, issue];

    return {
        ...review,
        passed: false,
        validityIssues,
        overallVerdict: review.overallVerdict.includes('coreData') ? review.overallVerdict : `${review.overallVerdict}；coreData 题面可见性未通过`,
    };
}

async function reviewQuestion(draft: V2QuestionDraft): Promise<ReviewResult> {
    const kp = draft.knowledgePoint;
    const questionFull = `${kp} ${draft.chosenDimension} ${draft.questionText} ${draft.referenceAnswer}`;

    const solidKeywords = ['固体', '晶体', '缺陷', '掺杂', '氧空位', '钙钛矿', '尖晶石', '非化学计量', '价态', '空穴', 'ZSA', '配位场', '电荷转移', '载流子', 'XRD', 'TG', '磁矩'];
    const physChemKeywords = ['热力学', '平衡', '活度', '逸度', '标准态', '自由能', '化学势', '相平衡', '相图', 'Clapeyron', 'Gibbs-Duhem', 'Debye-Hückel', 'Pitzer'];
    const kineticsKeywords = ['动力学', '速率', '速控', '预平衡', '稳态', '酶', 'Michaelis', '盐效应', '同位素', 'KIE', '反应级数', '催化', 'Arrhenius', 'Eyring'];
    const quantumOrganicKeywords = ['Hückel', '休克尔', '芳香', '反芳香', 'HOMO', 'LUMO', '轨道', '电环化', '周环', 'Woodward', '构象', '有机机理', 'NMR', '耦合常数'];
    const surfaceKeywords = ['表面', '吸附', 'TPD', '脱附', '覆盖度', 'Langmuir', 'Temkin', 'Freundlich', 'BET', '催化表面', '等温线'];
    const acidBaseKeywords = ['酸碱', 'pH', '缓冲', '滴定', '溶解度', '沉淀', '配位', '络合', '分布系数', '条件稳定常数', '离子强度'];
    const colloidKeywords = ['DLS', '动态光散射', '纳米球', '聚沉', 'DLVO', 'Hamaker', 'ζ电位', 'Gibbs吸附', '表面活性剂', '胶体', '溶胶', 'CMC'];
    const realGasKeywords = ['非理想气体', 'van der Waals', 'vdW', '逸度', '压缩因子', '对比态', '临界参数', '真实气体', '节流', 'Joule-Thomson', 'virial', '维里'];
    const electrochemKeywords = ['Nernst', '条件电位', 'Cottrell', '电位阶跃', '计时电流', '双层电容', '电化学', 'Tafel', 'Butler-Volmer', '标准电极电势', '扩散层', '极谱', '循环伏安'];
    const energeticSpanKeywords = ['能量跨度', 'energetic span', 'TDTS', 'TDI', 'XTOF', '决定态', '休眠物种', 'off-cycle', '循环外', '转化频率'];
    const mixedValenceKeywords = ['混合价', 'Mulliken-Hush', 'IVCT', '价间电荷转移', 'Robin-Day', 'Creutz-Taube', 'Hab', 'Class III', '二态模型'];
    const groupTheoryKeywords = ['群论', '点群', 'point group', '对称性', '特征标', '不可约表示', '可约表示', '约化', '简正模', '简正振动', 'normal mode', '振动模式', '互斥规则', 'mutual exclusion', '中心对称', '反演中心', 'IR活性', 'Raman活性', '红外活性', '拉曼活性', '谱带数目', 'Td', 'Oh', 'D3h', 'D4h', 'C2v', 'C3v', 'D∞h', '羰基', 'CO伸缩', '顺反异构', 'fac', 'mer', 'Jahn-Teller', '姜-泰勒'];
    const ligandFieldKeywords = ['配位场', '晶体场', 'ligand field', 'crystal field', '分裂能', 'Δo', 'Δt', '10Dq', '成对能', '高自旋', '低自旋', 'high-spin', 'low-spin', '自旋交叉', 'spin crossover', '轨道贡献', '轨道角动量', '角动量猝灭', 'μ_eff', 'μeff', 'spin-only', '纯自旋', 't2g', 'eg', '光谱化学序列', 'Tanabe-Sugano', 'Racah', 'd电子', '过渡金属配合物', '温度依赖磁矩', 'Curie', '有效磁矩'];

    const includesAny = (keywords: string[]) => keywords.some(kw => questionFull.includes(kw));

    const params_solid = includesAny(solidKeywords) ? `
- 固体/缺陷：电荷守恒、原子守恒、位点守恒是否同时闭合；每式量/每晶胞/每位点分母是否统一；平均价态是否在元素可实现范围；XRD/TG/磁矩/滴定数据是否相互支持。` : '';

    const params_physChem = includesAny(physChemKeywords) ? `
- 热力学/相平衡：K、Q、ΔG°、ΔG 的反应方向是否一致；标准态与实际态是否区分；活度/逸度/浓度/分压体系是否统一；相平衡条件是否不互斥。` : '';

    const params_kinetics = includesAny(kineticsKeywords) ? `
- 动力学/催化：k、k_obs、k_cat、K_M 等是否为正且单位匹配；预平衡/稳态/Michaelis/Tafel 近似是否有判据；pH/盐效应/KIE/抑制剂数据是否真正改变路径。` : '';

    const params_quantumOrganic = includesAny(quantumOrganicKeywords) ? `
- 有机/量子：环状/开链、共平面性、连续共轭、边界条件是否先判断；Hückel α/β 参考零点和符号约定是否一致；热/光条件与周环选择定则是否匹配。` : '';

    const params_surface = includesAny(surfaceKeywords) ? `
- 表面/吸附：覆盖度是否满足 0≤θ≤1；单层/多层定义是否未混用；吸附模型是否由数据趋势支持；TPD 升温速率、峰温、级数和吸附能是否自洽。` : '';

    const params_acidBase = includesAny(acidBaseKeywords) ? `
- 酸碱/沉淀/配位：总浓度、游离浓度、有效形态浓度是否区分；条件常数和热力学常数是否统一；物料守恒和电荷守恒是否闭合；pH、溶解度、离子强度是否合理。` : '';

    const params_colloid = includesAny(colloidKeywords) ? `
- 胶体/界面：DLS 表观信号与真实粒径/浓度是否区分；DLVO 恒电荷/恒电位边界是否可由场景判断；Gibbs吸附是否跨 CMC/饱和区误拟合；Hamaker 常数、ζ电位、Debye 长度数量级是否合理。` : '';

    const params_realGas = includesAny(realGasKeywords) ? `
- 非理想气体：是否先判断理想近似失效；Z 因子/对比态/逸度链是否完整；vdW a,b>0 且 V>nb；Tc/Pc/Vc 与参数是否不矛盾。` : '';

    const params_electrochem = includesAny(electrochemKeywords) ? `
- 电化学：Nernst 电子数、反应商指数和电位符号是否一致；标准电势/条件电位/参比电极基准是否统一；Cottrell 法拉第电流与双层电容电流是否分离；Tafel/Butler-Volmer 过电位区间是否验证。` : '';

    const params_energeticSpan = includesAny(energeticSpanKeywords) ? `
- 能量跨度/TOF决定态：δE 是否由全部 (TS,I) 配对枚举得出而非最高单步势垒；TDI 在 TDTS 之前时是否加了循环 ΔG_r；XTOF 各态灵敏度之和是否为 1；off-cycle 休眠物种是否只缩放有效催化剂浓度而未计入 δE；最优配对是否唯一可判别。` : '';

    const params_mixedValence = includesAny(mixedValenceKeywords) ? `
- 混合价/IVCT：r_ab 是否用有效电荷转移距离（几何金属间距只能作干扰）；是否计算 2H_ab 并与重组能 λ 比较；若判为 Robin-Day Class III 是否声明 MH 带宽前提失效并改用 ν̃_max=2H_ab；波数是否统一 cm⁻¹；Class II/III 边界是否唯一可判。` : '';

    const params_groupTheory = includesAny(groupTheoryKeywords) ? `
- 群论/振动对称性：IR/Raman 谱带数是否由点群可约表示约化到不可约表示后按活性计数（而非直接用 3N−6）；互斥规则是否仅在有反演中心时使用；特征标/不可约表示维数/简并度是否正确；不同异构体的谱带数区分是否唯一可判；Jahn-Teller 畸变判据是否与 d 电子简并组态一致。` : '';

    const params_ligandField = includesAny(ligandFieldKeywords) ? `
- 配位场/磁性：高/低自旋是否由 Δ 与成对能 P 比较判定（未直接声明）；八面体 Δo 与四面体 Δt≈(4/9)Δo 是否未混用；spin-only 是否仅在轨道角动量猝灭时使用、轨道贡献偏离方向是否正确；未成对电子数 n、S、μ_eff 换算是否自洽；自旋交叉/温度依赖磁矩是否由 Δ≈P 边界唯一可判。` : '';

    const paramChecks = `${params_energeticSpan}${params_mixedValence}${params_groupTheory}${params_ligandField}${params_solid}${params_physChem}${params_kinetics}${params_quantumOrganic}${params_surface}${params_acidBase}${params_colloid}${params_realGas}${params_electrochem}`;
    const coreDataText = JSON.stringify(draft.coreData || {}, null, 2);

    const prompt = `你是化学竞赛题目审核专家，需要按下述三组标准独立审查以下题目。

【知识点】：${draft.knowledgePoint}
【考察维度】：${draft.chosenDimension}

【题目】：
${draft.questionText}

【结构化 coreData（供参考）】：
${coreDataText}

【参考答案】：
${draft.referenceAnswer}

总目标：让最终题目同时具备十项特质——①目标明确、条件完整 ②具有真实化学背景 ③有适当挑战性 ④信息与难度匹配 ⑤答案具有确定性或可评价性 ⑥推理链条清晰 ⑦能检验结果的合理性 ⑧允许解释与反思 ⑨表述严谨无歧义 ⑩难度主要来自化学本质。请把发现的问题按下述分组写入对应字段。

【审查维度 1.5 - 参数化学可实现性（高权重，命中废题必须写入 validityIssues）】
- 检查数据闭合：不能只局部守恒，必须检查题面数据、coreData 和参考答案数值彼此一致。
- coreData 题面可见性：coreData 是题面关键数据的结构化镜像；若参考答案实际用到的某个 coreData 数值/单位/常数完全没有在题面出现、也无法由题面推出，则写入 validityIssues；仅出现在 coreData、答案未使用的量不必强制写入题面。（注：答案实际引用却在题面缺失的 coreData 数值会由确定性校验强制写入 validityIssues，此处需重点核对单位/基准与可推导性。）
- 检查基准统一：标准态 vs 实际态、活度 vs 浓度、逸度 vs 分压、条件常数 vs 热力学常数、总浓度 vs 游离浓度、每式量 vs 每晶胞 vs 每位点、参比电极/电位方向、Hückel 参考零点。
- 【答案一致性硬校验，最高优先级】：referenceAnswer 分步推导得出的最终数值，必须与 referenceAnswer 结尾/requiredAnswer 声明的最终答案完全一致（数值、单位、有效数字口径一致，允许四舍五入误差但不允许因为采用了不同判断分支/不同边界取值而导致数值不同）。若分步推导过程中使用的判据取值（如某个截止组成、某个转折点、某个模型选择）与最终给出的答案所依赖的取值不一致，说明推导链内部自相矛盾，必须写入 validityIssues 判为废题，不得放行。
- 【分叉可判定性硬校验】：若本题设计了需要解题者自行判断的分叉点（如相变/结构坍缩的截止组成、模型选择边界等），该分叉点的判据必须唯一可解——即题面给出的原始数据必须能让判据结果無歧义地确定（例如结构坍缩必须表现为某个物理量的骤变/陡降，幅度需明显区别于正常波动，不能是渐变或数值上同样合理的多个候选）。若判据本身模糊、渐变、或存在两个及以上同样能自洽的取值，导致不同解题者可能得出不同但都自洽的最终答案，必须写入 validityIssues 判为废题。
【第一组：合理性与确定性 —— 命中写入 validityIssues（阻断废题）】
G1 目标明确、条件完整、无歧义（特质①⑨）：求解目标唯一清晰；题面条件充分且必要，既不缺关键条件也不靠"猜"；表述无歧义、无一词多义；答案不得引入题面未给出、也无法由题面推出的关键数据。
G2 参数化学可实现性与数据闭合（特质①，高权重）：题面数据、coreData 与参考答案数值必须彼此一致；电荷/原子/物料/电子/位点守恒闭合，热力学第二定律与反应方向不矛盾；所有公式、常数、标准态、参考电极、参考零点、单位换算、有效数字准确；K>0、k>0、浓度/压力/温度/扩散系数/电极面积为正，pH/覆盖度(0≤θ≤1)/价态/溶解度/活度系数/逸度系数不越界。
  - coreData 题面可见性：参考答案实际用到的某个 coreData 数值/单位/常数若完全没在题面出现、也无法由题面推出，写入 validityIssues；仅出现在 coreData、答案未使用的量不必强制写入题面。（注：答案实际引用却题面缺失的数值会由确定性校验强制写入，此处重点核对单位/基准与可推导性。）
  - 基准统一：标准态 vs 实际态、活度 vs 浓度、逸度 vs 分压、条件常数 vs 热力学常数、总浓度 vs 游离浓度、每式量 vs 每晶胞 vs 每位点、参比电极/电位方向、Hückel 参考零点。
${paramChecks || '- 未命中特定领域关键词时，仍需执行通用化学可实现性检查：守恒闭合、单位自洽、标准态/基准一致、模型近似边界和数值范围。'}
G3 答案确定性或可评价性（特质⑤）：客观题（数值/结构/机理判定）必须答案唯一确定，不得存在题面无法判别的多解或边界两可；开放/论述题必须给出明确、可操作的评价标准与参考结论，不能是无判分标准的漫谈。二者必居其一，都不满足才写入 validityIssues——不要仅因"答案不唯一"就判废，先看是否属于有评价标准的开放题。
G4 结果可检验性（特质⑦）：参考答案的最终结果必须能通过数量级、量纲、物理边界（如 0≤θ≤1、pH 合理区间、Z>0、价态可达）、极限行为或与公认化学常识的一致性做独立自检；若结果根本无法用任何手段验证合理性，或一经自检即暴露矛盾（量纲不符、数量级离谱、越界），写入 validityIssues。

【第二组：难度与化学本质 —— 命中写入 difficultyIssues（阻断废题）】
D1 挑战性与信息-难度匹配（特质③④）：达到全国化学竞赛/研究生级别；解题链≥5个相互依赖的实质步骤，至少融合两个概念或数据源；题面信息量与难度相称——不得冗余信息拉低难度，也不得关键信息缺失把难度伪装成"猜条件"。
D2 难度来自化学本质（特质⑩）：难度必须来自化学判断（模型/近似选择、机理辨析、守恒闭合、基准辨析、主导形态或反应方向判断），而非来自繁琐算术、人为堆砌的怪异数字、故意埋设的单位/文字陷阱、或超出化学范畴的数学技巧。若剥离这些人为负担后题目难度显著下降，写入 difficultyIssues。
D3 反低防御模板（特质③⑩）：禁止 Ka/Kb/Ksp/Nernst/Arrhenius/Langmuir/vdW/Hückel 单公式代入、单一化学计量/浓度换算、单步结论跳转、概念背诵或优缺点罗列；只换背景和数字的教材原型题判为难度不足。

【第三组：质量与结构 —— 命中写入 depthIssues（非阻断警告，仅记录不废题）】
Q1 真实化学背景（特质②）：情境应有可信的科研/工业/实验来源，术语、数量级、反应条件符合真实化学；若属明显杜撰、违背化学常识或纯教材虚构场景，写入 depthIssues。
Q2 推理链条清晰（特质⑥）：参考答案分步清楚、每步有依据、无跳步或循环论证，判断分叉与结论衔接自然。
Q3 允许解释与反思（特质⑧）：题目与参考答案应留有解释与反思空间——参考答案不止给数值，还能说明结果的化学意义、适用范围或条件变化的影响；纯机械代入、毫无反思余地的题写入 depthIssues。
Q4 结构防御 3A-3D：3A 判断分叉（存在真正改变后续路径的判断节点，非口头说明）；3B 隐含条件（至少一个关键约束由数据趋势/守恒/边界/基准/反应方向推出，且非题目漏条件——漏条件属 validityIssues）；3C 单位/基准屏障（一次不可跳过且影响结果的单位或基准转换）；3D 教材原型检测（不能是"已知A和B求C"的模板套壳）。

【passed 判定硬规则】
- passed 仅由 validityIssues 与 difficultyIssues 决定：两数组都为空时 passed=true，否则 passed=false。
- depthIssues（第三组 Q1-Q4 与能力边界）是【非阻断警告】：即使非空也不影响 passed，仅作质量记录；因此凡真正致命的合理性/确定性/守恒/数据不自洽/条件不足/结果不可检验问题，必须写入 validityIssues，绝不能塞进 depthIssues，否则会被误放行。
- 若题目有深度但数据不自洽、条件不足或结果无法检验，必须写入 validityIssues 使 passed=false。

输出必须是严格 JSON，不含 markdown 代码块：
{
  "passed": true 或 false,
  "validityIssues": ["第一组G1-G4：合理性/条件完整/确定性或可评价性/结果可检验问题"],
  "difficultyIssues": ["第二组D1-D3：挑战性/信息-难度匹配/难度来自化学本质问题"],
  "depthIssues": ["第三组Q1-Q4：真实背景/推理清晰/解释反思/3A-3D结构防御问题"],
  "overallVerdict": "一句话总结审查结论"
}`;

    const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.2, responseFormat: 'json' })).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return mergeDeterministicReviewIssues(draft, {
            passed: false,
            validityIssues: ["Failed to parse review response"],
            difficultyIssues: [],
            depthIssues: [],
            overallVerdict: "审查响应解析失败"
        });
    }
    try {
        return mergeDeterministicReviewIssues(draft, normalizeReviewResult(cleanAndParseJSON(jsonMatch[0]) as Partial<ReviewResult>));
    } catch (e) {
        return mergeDeterministicReviewIssues(draft, {
            passed: false,
            validityIssues: [`JSON parse failed: ${(e as Error).message}`],
            difficultyIssues: [],
            depthIssues: [],
            overallVerdict: "审查响应解析失败"
        });
    }
}

async function deepRepairQuestion(
    draft: V2QuestionDraft,
    review: ReviewResult,
    cycleNumber: number,
    singleQuestion: boolean = false
): Promise<V2QuestionDraft> {
    const depthList = review.depthIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n");
    const otherIssues = [...review.validityIssues, ...review.difficultyIssues];
    const otherList = otherIssues.length > 0
        ? "\n【同时需要修复的合理性/难度问题】：\n" + otherIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n")
        : "";
    const singleQuestionConstraint = singleQuestion
        ? `⚠️【强制单问】修复后题目必须只有一个求解目标，禁止出现 (1)(2)(3)、（一）（二）、第一问/第二问等多小问结构；补深度只能通过加深单一问题的推理链，不能拆成多个子问。\n\n`
        : '';
    const coreDataText = JSON.stringify(draft.coreData || {}, null, 2);

    const prompt = `你是化学竞赛题目深度重写专家。本题存在逻辑深度不足的问题，需要较大幅度改写。（第 ${cycleNumber} 次修复 — 深度模式）

${singleQuestionConstraint}【当前题目】：
${draft.questionText}

【当前结构化 coreData（修复后必须逐项显式写入题面，不能只保留在JSON字段）】：
${coreDataText}

【当前参考答案】：
${draft.referenceAnswer}

【逻辑深度问题（本次修复的核心）】：
${depthList}
${otherList}

【深度修复规则（必须全部执行）】：
1. 核心考察维度保持不变（${draft.chosenDimension}）——但情境、数字、背景可以完全替换。
2. 必须补齐 3A 判断分叉：题目数据要迫使解题者先判断模型/近似/边界条件/主导形态/反应方向/电位基准等是否成立；判断结论必须改变后续计算路径，不能只是答案里的口头说明。
3. 必须补齐 3B 隐含条件：至少一个关键约束不能直接写死在题面里，而要能从数据趋势、守恒闭合、单位基准、边界条件或反应方向中推出；不得把必要条件删成题目缺陷。
4. 必须补齐 3C 单位/基准屏障：解题链中至少一次不可跳过的标准态/活度/逸度/总浓度-游离浓度/每式量-每晶胞/参比电极/Hückel参考零点等转换，并且该转换会改变数值或结论。
5. 必须补齐 3D 教材原型防御：若原题是教材模板，必须引入跨概念融合和多数据闭合，不能只更换背景和数字。
6. 若题目缺少必要常数/标准态：在题目和答案中显式补充；若使用隐含条件，必须确保其可由题面推出。
7. ${singleQuestion ? '修复后必须有 ≥5 个相互依赖的推理步骤，但全部合并为单一求解目标，禁止拆成 (1)(2)(3) 小问或多个子任务。' : '修复后推理步骤必须 ≥5 步，且步骤间有依赖，不得拆成多个无关小问。'}
8. 所有数据必须自洽：电荷守恒、原子守恒、物料守恒、电子守恒、位点守恒、热力学/动力学方向、单位基准不能矛盾。
9. coreData 只能作为题面数据镜像；修复后答案会用到的 coreData 数值、单位、系数、常数必须逐项出现在 questionText 中。
10. 参考答案必须明确标出：判断分叉、隐含条件来源、单位/基准转换节点。
11. 【结果可检验性】：参考答案末尾必须包含一次对结果合理性的自检（数量级/量纲/物理边界如 0≤θ≤1、pH 合理区间、Z>0、价态可达/极限行为/化学常识），确保最终数值经得起独立验证。
12. 【真实化学背景】：情境须有可信的科研/工业/实验来源，术语、数量级和反应条件符合真实化学，禁止杜撰或违背化学常识的场景。
13. 【难度来自化学本质】：新增难度必须来自化学判断（模型/近似选择、机理辨析、守恒或基准辨析、主导形态或反应方向），不得靠繁琐算术、怪异数字或人为文字/单位陷阱堆砌难度。
14. 【解释与反思空间】：参考答案除给出数值外，应说明结果的化学意义、适用范围或条件变化的影响，留有反思余地。
15. 【题面纯净性】：上述结构防御、单问约束和判断分叉/隐含条件/单位基准说明都只能体现在题目数据设计和 referenceAnswer 中；questionText 只能是自然的背景叙述、数据和提问，禁止出现"解答必须…""需要判断…""不得拆分成多个小问""全题只形成一个求解目标"等面向解题者/出题者的元要求句。
${FORMAT_RULE}
输出必须是严格 JSON，不含 markdown 代码块：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${draft.chosenDimension}",
  "questionText": "深度修复后的完整题目，只含背景叙述、数据和提问，禁止任何解题/出题元要求句",
  "coreData": {"化学量名称": {"value": 数值, "unit": "单位"}},
  "requiredAnswer": "${draft.requiredAnswer}",
  "referenceAnswer": "重写后的完整分步解答，含公式推导和数值代入",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]
}`;

    const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.5 })).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return draft;

    try {
        const repaired = cleanAndParseJSON(jsonMatch[0]) as V2QuestionDraft;
        repaired.problemId = draft.problemId;
        repaired.knowledgePoint = draft.knowledgePoint;
        repaired.chosenDimension = draft.chosenDimension;
        normalizeRepairedDraft(repaired);
        return repaired;
    } catch (e) {
        console.warn(`[Reviewer] deepRepair JSON parse failed (cycle ${cycleNumber}):`, e);
        return draft;
    }
}

async function detailRepairQuestion(
    draft: V2QuestionDraft,
    review: ReviewResult,
    cycleNumber: number,
    singleQuestion: boolean = false
): Promise<V2QuestionDraft> {
    const allIssues = [...review.validityIssues, ...review.difficultyIssues];
    const issueList = allIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n");
    const coreDataText = JSON.stringify(draft.coreData || {}, null, 2);
    const singleQuestionConstraint = singleQuestion
        ? `⚠️【强制单问】修复后题目必须只有一个求解目标，禁止出现 (1)(2)(3)、（一）（二）、第一问/第二问等多小问结构。\n\n`
        : '';

    const prompt = `你是化学竞赛题目细节修复专家。本题仅需修复合理性或难度问题，不改变题目情境和结构。（第 ${cycleNumber} 次修复 — 细节模式）

${singleQuestionConstraint}【当前题目】：
${draft.questionText}

【当前结构化 coreData（修复后必须逐项显式写入题面，不能只保留在JSON字段）】：
${coreDataText}

【当前参考答案】：
${draft.referenceAnswer}

【需要修复的问题】：
${issueList}

【细节修复规则】：
1. 只修复上述列出的问题，保持题目情境、背景、结构不变。
2. 若涉及常数/标准态缺失：在题目和答案中补充精确数值；若答案使用了题面无法推出的数据，必须把数据补入题面或改为可由题面推出。
3. 若数值超出合理范围：修正为化学上合理的数值，并同步更新 coreData 和答案。
4. coreData 只能作为题面数据镜像；修复后答案会用到的 coreData 数值、单位、系数、常数必须逐项出现在 questionText 中。
5. 保持逻辑深度不降低：不得删除已有 3A 判断分叉、3B 隐含条件、3C 单位/基准屏障或 3D 反模板结构。
6. 细节修复后仍必须在参考答案中保留并明确写出判断分叉、隐含条件来源、单位/基准转换节点。
7. 所有修复必须确保数据自洽：电荷守恒、原子守恒、物料守恒、电子守恒、位点守恒、热力学/动力学方向、单位基准不能矛盾。
8. 【结果可检验性】：参考答案须保留或补上一次对最终结果的合理性自检（数量级/量纲/物理边界/极限行为/化学常识）。
9. 【真实背景与化学本质】：不得为修复而引入杜撰情境或靠繁琐算术、怪异数字、人为文字/单位陷阱堆难度；难度须来自化学判断本身。
10. 【题面纯净性】：判断分叉/隐含条件/单位基准说明和单问约束只能体现在题目数据设计和 referenceAnswer 中；questionText 只能是自然的背景叙述、数据和提问，禁止出现"解答必须…""需要判断…""不得拆分成多个小问""全题只形成一个求解目标"等面向解题者/出题者的元要求句。
${FORMAT_RULE}
输出必须是严格 JSON，不含 markdown 代码块：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${draft.chosenDimension}",
  "questionText": "细节修复后的完整题目，只含背景叙述、数据和提问，禁止任何解题/出题元要求句",
  "coreData": {"化学量名称": {"value": 数值, "unit": "单位"}},
  "requiredAnswer": "${draft.requiredAnswer}",
  "referenceAnswer": "修复后的完整分步解答",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]
}`;

    const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.2 })).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return draft;

    try {
        const repaired = cleanAndParseJSON(jsonMatch[0]) as V2QuestionDraft;
        repaired.problemId = draft.problemId;
        repaired.knowledgePoint = draft.knowledgePoint;
        repaired.chosenDimension = draft.chosenDimension;
        normalizeRepairedDraft(repaired);
        return repaired;
    } catch (e) {
        console.warn(`[Reviewer] detailRepair JSON parse failed (cycle ${cycleNumber}):`, e);
        return draft;
    }
}

async function repairQuestion(
    draft: V2QuestionDraft,
    review: ReviewResult,
    cycleNumber: number,
    singleQuestion: boolean = false
): Promise<V2QuestionDraft> {
    if (review.depthIssues.length > 0) {
        return deepRepairQuestion(draft, review, cycleNumber, singleQuestion);
    }
    return detailRepairQuestion(draft, review, cycleNumber, singleQuestion);
}

export async function reviewAndRepair(
    draft: V2QuestionDraft,
    _trackerId?: unknown,
    singleQuestion: boolean = false,
    _numericAnswerOnly?: boolean
): Promise<ReviewedDraft> {
    let current = draft;
    let repairCycles = 0;
    const allReviews: ReviewResult[] = [];

    const review0 = await reviewQuestion(current);
    allReviews.push(review0);
    console.log(`[V2 A2] 第1次审查结果: passed=${review0.passed}`, review0.overallVerdict);
    if (review0.passed) {
        return { draft: current, reviewResult: review0, repairCycles, needsRegeneration: false, degradationLevel: 'stable', degradationReason: '' };
    }

    const strategy1 = review0.depthIssues.length > 0 ? 'deep' : 'detail';
    console.log(`[V2 A3] 第1次修复 (${strategy1}模式), issues:`, [...review0.validityIssues, ...review0.difficultyIssues, ...review0.depthIssues]);
    current = await repairQuestion(current, review0, 1, singleQuestion);
    repairCycles++;

    const review1 = await reviewQuestion(current);
    allReviews.push(review1);
    console.log(`[V2 A2] 第2次审查结果: passed=${review1.passed}`, review1.overallVerdict);

    const deg1 = detectDegradation(allReviews, repairCycles);
    if (deg1.degradationLevel !== 'stable') {
        console.warn(`[V2 A2/A3] 终止条件触发: ${deg1.degradationLevel} — ${deg1.degradationReason}`);
        return { draft: current, reviewResult: review1, repairCycles, needsRegeneration: true, ...deg1 };
    }

    if (review1.passed) {
        return { draft: current, reviewResult: review1, repairCycles, needsRegeneration: false, degradationLevel: 'stable', degradationReason: '' };
    }

    if (review1.depthIssues.length === 0 &&
        review1.validityIssues.length === 0 &&
        review1.difficultyIssues.length === 0) {
        return { draft: current, reviewResult: review1, repairCycles, needsRegeneration: false, degradationLevel: 'stable', degradationReason: '' };
    }

    const strategy2 = review1.depthIssues.length > 0 ? 'deep' : 'detail';
    console.log(`[V2 A3] 第2次修复 (${strategy2}模式), issues:`, [...review1.validityIssues, ...review1.difficultyIssues, ...review1.depthIssues]);
    current = await repairQuestion(current, review1, 2, singleQuestion);
    repairCycles++;

    const review2 = await reviewQuestion(current);
    allReviews.push(review2);

    const degFinal = detectDegradation(allReviews, repairCycles);
    return {
        draft: current, reviewResult: review2, repairCycles,
        needsRegeneration: !review2.passed,
        degradationLevel: degFinal.degradationLevel,
        degradationReason: degFinal.degradationReason,
    };
}

function detectDegradation(
    reviews: ReviewResult[],
    cycles: number
): { degradationLevel: 'stable' | 'oscillating' | 'diverging' | 'unrepairable'; degradationReason: string } {
    if (reviews.length < 2) return { degradationLevel: 'stable', degradationReason: '' };

    const latest = reviews[reviews.length - 1];
    const previous = reviews[reviews.length - 2];

    const prevAll = new Set([...previous.validityIssues, ...previous.difficultyIssues, ...previous.depthIssues]);
    const latestAll = new Set([...latest.validityIssues, ...latest.difficultyIssues, ...latest.depthIssues]);
    const recurring = [...latestAll].filter(i => prevAll.has(i));

    if (recurring.length > 0 && cycles >= 1) {
        return { degradationLevel: 'oscillating', degradationReason: `反复横跳：以下问题经过 ${cycles} 轮修复后仍存在 — ${recurring.slice(0, 3).join('；')}` };
    }

    const prevCount = previous.validityIssues.length + previous.difficultyIssues.length + previous.depthIssues.length;
    const latestCount = latest.validityIssues.length + latest.difficultyIssues.length + latest.depthIssues.length;
    if (latestCount > prevCount) {
        return { degradationLevel: 'diverging', degradationReason: `修复发散：issue 从 ${prevCount} 个增加到 ${latestCount} 个` };
    }

    if (cycles >= 2 && !latest.passed && latest.depthIssues.length > 0) {
        const total = latest.validityIssues.length + latest.difficultyIssues.length + latest.depthIssues.length;
        if (total >= 2) {
            return { degradationLevel: 'unrepairable', degradationReason: `不可稳定修复：${cycles} 轮修复后仍有 ${total} 个问题` };
        }
    }

    return { degradationLevel: 'stable', degradationReason: '' };
}
