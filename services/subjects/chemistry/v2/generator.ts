import { callLLM } from "../../../llmClient";
import type { KPAnalysisResult } from "./kp-analyzer";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";

/**
 * V2 Node A1: Question Generator
 */

export interface V2QuestionDraft {
    problemId: string;
    knowledgePoint: string;
    chosenDimension: string;
    questionText: string;
    coreData: Record<string, { value: number; unit: string }>;
    requiredAnswer: string;
    referenceAnswer: string;
    referenceSteps: string[];
}

function includesAny(text: string, keywords: string[]): boolean {
    return keywords.some(kw => text.includes(kw));
}

// 还原模型双重转义产生的字面量 \n / \t：JSON.parse 遇到 \\n 会解析成字面量反斜杠+n，
// 而非真换行，且这类输出是合法 JSON，会绕过 jsonCleaner 里只在解析失败时触发的修复链。
// (?![a-zA-Z]) 避开 LaTeX 命令（\nu \nabla \tau 等），只还原后面不接字母的 \n / \t。
export function unescapeLiteralNewlines(s: string): string {
    return s
        .replace(/\\r\\n|\\n(?![a-zA-Z])/g, '\n')
        .replace(/\\t(?![a-zA-Z])/g, '\t');
}

export function normalizeDraft(draft: Partial<V2QuestionDraft>, kpAnalysis: KPAnalysisResult, dimension: string): V2QuestionDraft {
    return {
        problemId: String(draft.problemId || `v2_${Date.now()}`),
        knowledgePoint: String(draft.knowledgePoint || kpAnalysis.knowledgePoint),
        chosenDimension: String(draft.chosenDimension || dimension),
        questionText: unescapeLiteralNewlines(String(draft.questionText || "")),
        coreData: draft.coreData && typeof draft.coreData === 'object' ? draft.coreData as Record<string, { value: number; unit: string }> : {},
        requiredAnswer: unescapeLiteralNewlines(String(draft.requiredAnswer || "")),
        referenceAnswer: unescapeLiteralNewlines(String(draft.referenceAnswer || "")),
        referenceSteps: Array.isArray(draft.referenceSteps) ? draft.referenceSteps.map(x => unescapeLiteralNewlines(String(x))).filter(Boolean) : [],
    };
}

export async function generateQuestionWithAnswer(
    kpAnalysis: KPAnalysisResult,
    dimensionIndex: number,
    language: string = 'zh-CN',
    singleQuestion: boolean = false
): Promise<V2QuestionDraft> {
    const dimensions = Array.isArray(kpAnalysis.testDimensions) && kpAnalysis.testDimensions.length > 0
        ? kpAnalysis.testDimensions
        : ["从数据趋势判断模型适用性并完成多步计算"];
    const dimension = dimensions[dimensionIndex % dimensions.length];
    const avoidList = Array.isArray(kpAnalysis.coreConceptsToAvoid) ? kpAnalysis.coreConceptsToAvoid.join("、") : "";

    const singleQuestionConstraint = singleQuestion
        ? `⚠️ 【强制单问】：题目必须只有一个问题，只有一个求解目标。绝对禁止出现 (1)(2)(3) 等多小问、多子任务的形式。整道题从头到尾只问一件事。这是对题目结构的约束，禁止把"全题只形成一个求解目标""不得拆分成多个小问"这类话写进 questionText 题面文字。\n`
        : '';

    const planningText = `${kpAnalysis.knowledgePoint} ${dimension} ${kpAnalysis.suggestedDifficulty}`;

    const solidKeywords = ['固体', '晶体', '缺陷', '掺杂', '氧空位', '钙钛矿', '尖晶石', '非化学计量', '价态', '空穴', 'ZSA', '配位场', '电荷转移', '载流子', 'XRD', 'TG', '磁矩', '电荷补偿'];
    const physChemKeywords = ['热力学', '平衡', '活度', '逸度', '标准态', '自由能', '化学势', '相平衡', '相图', 'Clapeyron', 'Gibbs-Duhem', 'Debye-Hückel', 'Pitzer'];
    const kineticsKeywords = ['动力学', '速率', '速控', '预平衡', '稳态', '酶', 'Michaelis', '盐效应', '同位素', 'KIE', '反应级数', '催化', 'Arrhenius', 'Eyring'];
    const quantumOrganicKeywords = ['Hückel', '休克尔', '芳香', '反芳香', 'HOMO', 'LUMO', '轨道', '电环化', '周环', 'Woodward', '构象', '有机机理', 'NMR', '耦合常数', '同位素标记'];
    const surfaceKeywords = ['表面', '吸附', 'TPD', '脱附', '覆盖度', 'Langmuir', 'Temkin', 'Freundlich', 'BET', '催化表面', '等温线'];
    const acidBaseKeywords = ['酸碱', 'pH', '缓冲', '滴定', '溶解度', '沉淀', '配位', '络合', '分布系数', '条件稳定常数', '离子强度'];
    const colloidKeywords = ['DLS', '动态光散射', '纳米球', '聚沉', 'DLVO', 'Hamaker', 'ζ电位', 'Gibbs吸附', '表面活性剂', '胶体', '溶胶', 'CMC'];
    const realGasKeywords = ['非理想气体', 'van der Waals', 'vdW', '逸度', '压缩因子', '对比态', '临界参数', '真实气体', '节流', 'Joule-Thomson', 'virial', '维里'];
    const electrochemKeywords = ['Nernst', '条件电位', 'Cottrell', '电位阶跃', '计时电流', '双层电容', '电化学', 'Tafel', 'Butler-Volmer', '标准电极电势', '扩散层', '极谱', '循环伏安'];
    const energeticSpanKeywords = ['能量跨度', 'energetic span', 'TDTS', 'TDI', 'XTOF', '决定态', '休眠物种', 'off-cycle', '循环外', '转化频率', '催化循环自由能图'];
    const mixedValenceKeywords = ['混合价', 'Mulliken-Hush', 'IVCT', '价间电荷转移', 'Robin-Day', 'Creutz-Taube', 'Hab', '电子耦合', 'Class III', '二态模型'];
    const statMechKeywords = ['配分函数', 'partition function', '电子配分', '简并', '简并度', '自旋-轨道', 'spin-orbit', '旋轨', '对称数', 'symmetry number', '核自旋统计', '正氢', '仲氢', 'ortho', 'para', '正-仲', '转动配分', '振动配分', '平动配分', 'Sackur-Tetrode', '玻尔兹曼分布', 'Boltzmann', '能级布居', '布居', '转动特征温度', '振动特征温度', 'θrot', 'θvib', 'θ_rot', 'θ_vib', '非谐振子', '离心畸变', '统计热力学', 'Bigeleisen', '同位素交换', 'Hund第三定则', '基态J', '朗德', 'g_J', 'gJ', '有效磁矩'];
    const spectraKeywords = ['转动光谱', '振转光谱', '振动-转动', '谱带', '带头', 'band head', 'P支', 'R支', 'Q支', '支返转', 'Fortrat', '转动常数', 'B_v', 'Bv', 'B_e', '振转耦合', 'αe', 'α_e', '离心畸变', 'D_e', '谱线强度', 'Jmax', 'J_max', '最强谱线', '2J+1', 'Fermi共振', 'Fermi resonance', '费米共振', '倍频', '组合频', '泛频', '转动惯量', '键长反演', '同位素位移', 'Morse', '非谐性', 'ωexe', 'ω_e x_e', 'Birge-Sponer', 'Franck-Condon', '振动进程', '振动光谱'];
    const groupTheoryKeywords = ['群论', '点群', 'point group', '对称性', '对称元素', '对称操作', '特征标', '特征标表', 'character table', '不可约表示', '可约表示', 'irreducible', '约化', '简正模', '简正振动', 'normal mode', '振动模式', '互斥规则', 'mutual exclusion', '中心对称', '反演中心', 'IR活性', 'Raman活性', '红外活性', '拉曼活性', '谱带数目', '偏振', 'Td', 'Oh', 'D3h', 'D4h', 'C2v', 'C3v', 'D∞h', '羰基', 'CO伸缩', '顺反异构', 'fac', 'mer', 'Jahn-Teller', '姜-泰勒'];
    const ligandFieldKeywords = ['配位场', '晶体场', 'ligand field', 'crystal field', '分裂能', 'Δo', 'Δt', '10Dq', '成对能', '高自旋', '低自旋', 'high-spin', 'low-spin', '自旋交叉', 'spin crossover', '轨道贡献', '轨道角动量', '角动量猝灭', 'orbital contribution', 'μ_eff', 'μeff', 'spin-only', '纯自旋', 't2g', 'eg', '光谱化学序列', 'Tanabe-Sugano', '田边-菅野', 'Racah', 'd电子', 'dn', '过渡金属配合物', '温度依赖磁矩', 'Curie', '居里', '有效磁矩'];

    const isSolid = includesAny(planningText, solidKeywords);
    const isPhysChem = includesAny(planningText, physChemKeywords);
    const isKinetics = includesAny(planningText, kineticsKeywords);
    const isQuantumOrganic = includesAny(planningText, quantumOrganicKeywords);
    const isSurface = includesAny(planningText, surfaceKeywords);
    const isAcidBase = includesAny(planningText, acidBaseKeywords);
    const isColloid = includesAny(planningText, colloidKeywords);
    const isRealGas = includesAny(planningText, realGasKeywords);
    const isElectrochem = includesAny(planningText, electrochemKeywords);
    const isEnergeticSpan = includesAny(planningText, energeticSpanKeywords);
    const isMixedValence = includesAny(planningText, mixedValenceKeywords);
    const isStatMech = includesAny(planningText, statMechKeywords);
    const isSpectra = includesAny(planningText, spectraKeywords);
    const isGroupTheory = includesAny(planningText, groupTheoryKeywords);
    const isLigandField = includesAny(planningText, ligandFieldKeywords);

    const solidStrategies = isSolid ? `
策略S1 — 多数据闭合：联立 XRD/TG/价态/磁性或滴定数据，要求同时满足电荷守恒、物料守恒和位点守恒；错误捷径通常只守恒一个局部量。
策略S2 — 基准分母陷阱：题面给局部比例（M/(A+M)、δ per formula unit、每晶胞缺陷数），正确路径需转化学式系数；错误捷径把比例直接当绝对占位。
策略S3 — 价态可实现性判断：给出名义组成和实际氧含量，先判断平均价态是否落在可达范围，再决定缺陷补偿机制。
` : '';

    const physChemStrategies = isPhysChem ? `
策略P1 — 标准态 vs 实际态：题面给 ΔG°/K° 同时给实际组成，正确路径需用反应商 Q 校正；错误捷径把标准态结论当实际态结论。
策略P2 — 活度/逸度链：题面给离子强度或高压条件，正确路径需先判断是否必须使用活度/逸度；错误捷径直接用浓度/分压。
策略P3 — 自洽性先验判断：给出热力学数据或相平衡数据，要求先验证符号、单位、温度和反应方向是否自洽，再计算。
` : '';

    const kineticsStrategies = isKinetics ? `
策略K1 — 表观速率常数拆解：题面给 k_obs 随 pH/盐强度/底物浓度变化，正确路径需剥离活性形态或吸附覆盖度；错误捷径直接拟合 k_obs。
策略K2 — 近似边界判断：参数处在稳态/预平衡/Michaelis/Tafel 近似边界附近，正确路径需先算判据；错误捷径直接套简化式。
策略K3 — 机理分叉：设计两种机理给出相近表观级数，需通过同位素效应或抑制剂数据判别速控步。
` : '';

    const quantumOrganicStrategies = isQuantumOrganic ? `
策略Q1 — 拓扑/对称性先判：看似标准多烯或芳香体系，正确路径需先判断环状/开链、共平面性、连续共轭和边界条件；错误捷径见电子数就套 4n+2。
策略Q2 — 参考零点保留：题面涉及 Hückel α、相对稳定化能或构象能差，正确路径需保留参考零点；错误捷径只比较 β 项导致结论反转。
策略Q3 — 反应条件分叉：周环/电环化题必须区分热/光条件和同旋/对旋选择定则，错误捷径忽略条件直接套单一规则。
` : '';

    const surfaceStrategies = isSurface ? `
策略F1 — 吸附模型选型：题面数据看似可用 Langmuir，但覆盖度依赖斜率暗示非均匀或相互作用；正确路径需判别 Temkin/Freundlich/BET；错误捷径套均匀模型。
策略F2 — 覆盖度边界：题面接近低覆盖、单层饱和或多层吸附边界，正确路径需判断近似是否成立；错误捷径全区间套低覆盖近似。
策略F3 — TPD 反演约束：TPD 峰温、升温速率、脱附级数和吸附能必须自洽，错误捷径直接把峰温高低等同吸附能大小。
` : '';

    const acidBaseStrategies = isAcidBase ? `
策略A1 — 活性形态分布：题面给总浓度和 pH，正确路径需先算有效形态分数；错误捷径把总浓度直接当反应活性浓度。
策略A2 — 条件常数 vs 热力学常数：题面给离子强度或条件稳定常数，正确路径需统一常数体系；错误捷径混用条件常数和热力学常数。
策略A3 — 耦合平衡闭合：沉淀/络合/酸碱耦合时，正确路径需联立物料守恒和电荷守恒；错误捷径逐个平衡孤立计算。
` : '';

    const colloidStrategies = isColloid ? `
策略C1 — 表观信号校正：DLS 基线截距、散射强度或表观粒径不能直接当真实值；正确路径需先判断多重散射/黏度/温度校正。
策略C2 — 边界条件错判：DLVO 聚沉需先判断恒电荷/恒电位边界；错误捷径不判边界直接套单一势能曲线。
策略C3 — Gibbs吸附区间：表面张力-浓度斜率需分区间，跨 CMC 或饱和区直接线性拟合会给出错误吸附量。
` : '';

    const realGasStrategies = isRealGas ? `
策略R1 — 理想性判据前置：题面给高压/近临界条件，正确路径需先用对比态或 Z 因子判断；错误捷径不判断直接假设理想气体。
策略R2 — 逸度链跳步：实际气体化学平衡 K°→K(f)→K(P) 需逐级校正；错误捷径直接用分压代逸度。
策略R3 — 参数自洽检查：vdW a,b、Tc/Pc/Vc 和操作条件必须相互一致，错误捷径不验证参数物理意义。
` : '';

    const electrochemStrategies = isElectrochem ? `
策略E1 — Cottrell与双层混淆：电位阶跃总电流含法拉第+双层充电，正确路径需线性分离；错误捷径直接读单点电流当法拉第电流。
策略E2 — 条件电位盲代：实际介质含络合/离子强度时需用条件电位E°'；错误捷径用标准E°直接代入。
策略E3 — 电位基准与反应方向：题面混用参比电极、还原电势和电池电势，正确路径需统一基准和反应方向；错误捷径符号反转。
` : '';

    const solidConstraints = isSolid ? `
【固体/缺陷化学专项约束】
1. 禁止"已知化学式和晶胞参数直接求密度"的代入题——必须引入至少两个独立数据源联立。
2. 电荷守恒、物料守恒、位点守恒必须同时闭合；平均价态不得超出元素常见可达范围，异常价态需有题面证据。
3. 氧空位 δ、掺杂比例、每式量/每晶胞/每位点分母必须自洽，禁止把局部比例直接当绝对化学式系数。
4. 若使用 XRD/TG/磁矩等实验数据，数值之间不得互相矛盾；题面应给足计算所需原始数据。
` : '';

    const physChemConstraints = isPhysChem ? `
【物理化学/热力学/相平衡专项约束】
1. 禁止"已知ΔG°和K直接求转化率"的代入题——必须引入非理想性校正、反应商或标准态适用性判断。
2. K、活度、逸度、浓度、分压必须统一体系；K 必须为正，ΔG=ΔG°+RTlnQ 的反应方向必须与题面一致。
3. 若需要活度系数/逸度系数，题面必须给出可计算或可判断的信息；不能让答案凭空查表。
4. 相平衡或热力学过程不得同时设置互斥条件；温度、压力、标准态必须明确。
` : '';

    const kineticsConstraints = isKinetics ? `
【动力学/催化专项约束】
1. 禁止"已知k和浓度直接求速率"的代入题——必须引入活性形态校正、机理判别或近似边界验证。
2. 速率常数必须为正，单位必须与反应级数匹配；反应级数不得与分子数机械等同。
3. 稳态、预平衡、Michaelis、Tafel 等近似必须有可验证判据，不得题面直接宣布正确路径。
4. pH效应、盐效应、KIE、抑制剂数据不能只作装饰，必须影响机理或路径选择。
` : '';

    const quantumOrganicConstraints = isQuantumOrganic ? `
【有机/量子化学专项约束】
1. 禁止"已知多烯碳数直接套能级公式"的代入题——必须引入拓扑判断、对称性分析或实验线索。
2. 芳香性必须同时满足环状、共平面、连续共轭和电子数条件；不得只看 4n+2。
3. Hückel α 参考零点、β 符号约定和占据电子数必须全题一致。
4. 周环反应必须区分热/光条件、电子数、同旋/对旋或面选择性，不能只背规则。
` : '';

    const surfaceConstraints = isSurface ? `
【表面/吸附专项约束】
1. 禁止"已知Langmuir参数直接求覆盖度"的代入题——必须引入模型判别或覆盖度边界判断。
2. 覆盖度必须满足 0≤θ≤1；多层吸附时不得误用单层覆盖度定义。
3. 禁止在题面直接声明模型名称，除非题目要求识别并批判模型误用。
4. TPD 题的升温速率、峰温、脱附级数、吸附能关系必须自洽。
` : '';

    const acidBaseConstraints = isAcidBase ? `
【酸碱/溶液/沉淀/配位平衡专项约束】
1. 禁止"已知Ka和总浓度直接求pH"或"已知Ksp直接求溶解度"的单步题——必须引入活度校正、条件常数或耦合平衡。
2. pH、浓度、活度、溶解度必须在合理范围；总浓度、游离浓度、有效形态浓度必须区分。
3. 条件常数和热力学常数不得混用；沉淀/络合/酸碱耦合时必须满足物料守恒和电荷守恒。
4. Henderson-Hasselbalch、忽略水电离、忽略次级解离等近似必须由学生验证，而不是题面直接给出。
` : '';

    const colloidConstraints = isColloid ? `
【胶体/界面化学专项约束】
1. 禁止"已知表面张力-浓度数据直接线性拟合求Gibbs吸附量"的代入题——必须引入分区间或CMC判断。
2. DLVO题目禁止在题面直接写出边界条件类型；恒电荷/恒电位需由数据或场景判断。
3. ζ电位、Hamaker常数、Debye长度、粒径、黏度、温度必须数量级合理且单位自洽。
4. DLS 或散射题必须区分表观信号与真实粒径/浓度，不得直接信单点读数。
` : '';

    const realGasConstraints = isRealGas ? `
【非理想气体专项约束】
1. 禁止"已知vdW参数直接代入求压力"的代入题——必须引入理想性判据或逸度校正。
2. vdW 参数 a,b>0 且 V>nb；Tc/Pc/Vc 与 a,b 不得矛盾。
3. 近临界或高压题必须先判断理想气体近似是否失效；不得题面直接说"非理想"后代公式。
4. 化学平衡中分压、逸度、逸度系数的链条必须完整，禁止混用。
` : '';

    const electrochemConstraints = isElectrochem ? `
【电化学专项约束】
1. 禁止"已知E°和浓度直接套Nernst方程"的代入题——必须引入活度校正、条件电位、参比电极或反应方向判断。
2. Nernst 方程的电子数、反应商指数、氧化/还原方向和电位符号必须一致。
3. 条件电位 E°' 与标准电极电势 E° 不得混用；参比电极基准必须统一。
4. 电位阶跃题需区分法拉第电流和双层电容电流；Cottrell 量纲、电极面积、扩散系数、浓度单位必须自洽。
5. Butler-Volmer/Tafel 近似必须先判断过电位区间，不能无条件套 Tafel 斜率。
` : '';

    const energeticSpanStrategies = isEnergeticSpan ? `
策略G1 — 反直觉判据：δE 不等于最高单步活化能。正确路径需枚举全部 (TS_i, I_j) 配对，并按 TDI 是否位于 TDTS 之前决定加不加一个循环 ΔG_r；错误捷径直接取自由能图上最高的单步势垒。
策略G2 — 循环外物种剥离：off-cycle 休眠物种只按平衡分配降低有效催化剂浓度、线性缩放 TOF；错误捷径把它的自由能直接计入 δE 配对。
策略G3 — 灵敏度归一化：XTOF 各态灵敏度之和必须为 1，可用它反查 TDTS/TDI 判定是否自洽；错误捷径只报单一决定态而不做归一化闭合。
` : '';

    const mixedValenceStrategies = isMixedValence ? `
策略M1 — 自指式失效分叉：先用 Mulliken-Hush 反演 H_ab，再比较 2H_ab 与重组能 λ；若 2H_ab ≥ λ 则体系为 Robin-Day Class III，MH 带宽公式赖以成立的双势阱前提已失效，必须改用 ν̃_max = 2H_ab 并作废原结果；错误捷径判出 Class III 后仍沿用同一 H_ab 数值。
策略M2 — 有效距离 vs 几何距离：r_ab 必须取有效电荷转移距离，题面同时给出的几何金属间距是干扰项；错误捷径直接用金属间距导致 H_ab 系统偏小。
策略M3 — 带宽来源辨析：Δν̃_1/2 的 Gaussian 理论下限 16.1·√ν̃_max 不能当实测半宽用；两者偏差本身是判断离域程度的证据。
` : '';

    const energeticSpanConstraints = isEnergeticSpan ? `
【能量跨度/TOF决定态专项约束】
1. 禁止"已知活化能直接套 Eyring 求速率"的代入题——必须给完整循环（≥4 个中间体及对应过渡态）自由能、循环净 ΔG_r，并让学生自行判定 TDTS 与 TDI。
2. 题面不得点名哪个是 TDTS 或 TDI，也不得暗示"最慢一步"；判定必须由配对枚举得出。
3. TDI 位于 TDTS 之前时 δE = G_TS − G_I + ΔG_r，位于之后时 δE = G_TS − G_I；两种情形必须在参考答案中显式区分。
4. 若给 off-cycle 休眠物种，其平衡常数只用于有效催化剂浓度扣减，不得计入 δE；TOF 随之线性缩放。
5. δE 的最优配对必须唯一：不得出现两个配对给出数值接近而题面无法判别的情形。
` : '';

    const mixedValenceConstraints = isMixedValence ? `
【混合价/IVCT/Robin-Day专项约束】
1. 禁止"已知 ε_max、ν̃_max、Δν̃_1/2 直接套 Mulliken-Hush 求 H_ab"的单公式代入题——必须包含 2H_ab 与 λ 的比较和 Robin-Day 分类判定。
2. 题面禁止直接写出 Robin-Day 类别（Class II/III）或"离域/定域"结论，必须由数据判断。
3. r_ab 必须可由题面线索推出有效电荷转移距离；几何金属间距若给出，只能作为干扰量。
4. 所有波数量统一到 cm⁻¹；ε_max 单位为 M⁻¹cm⁻¹；若给 nm 或 eV 必须要求学生自行换算。
5. 若判定落在 Class II/III 边界，题面必须提供独立判据使结论唯一；不得让答案停留在"接近边界，两种都可能"。
` : '';

    const statMechStrategies = isStatMech ? `
策略SM1 — 电子配分函数不可默认为1：含低能激发态（自旋-轨道分裂 ²Π₁/₂/²Π₃/₂、原子基态多重态、过渡金属离子低激发态）时 q_el=Σg_i·exp(−ε_i/kT) 必须求和；错误捷径直接取 q_el=g_0（只算基态）或 q_el=1，导致熵/热容/Keq 系统偏低。分裂能与 kT 同量级（100-600 cm⁻¹ vs kT≈207 cm⁻¹@298K）时激发态贡献不可略。
策略SM2 — 对称数σ与核自旋统计：Keq/熵中转动配分含 1/σ 因子。同核双原子σ=2、异核σ=1；同位素交换反应（H₂+D₂⇌2HD）经典高温极限下平-转-质量因子相乘趋于1，K 仅由 σ 比值决定（此处 K=σ_H₂σ_D₂/σ_HD²=4，Bigeleisen 定理）。错误捷径：见反应"对称"直接答 K=1，或漏 σ。正-仲氢/正-仲态需按核自旋权重（奇偶 J 分别配 3:1 或按 I 决定）加权求和。
策略SM3 — 特征温度判据选极限式：转动 T>>θ_rot 用经典高温式 q_rot=T/(σθ_rot)，否则必须逐项求和；振动室温下 T<<θ_vib 常不能用经典 kT 均分。必须先算 T/θ 判断再选式；错误捷径全程套经典均分定理或全程逐项求和。
策略SM4 — 基态角动量 Hund 第三定则方向：自由离子 μ_eff=g_J√(J(J+1))，少于半充满 J=|L−S|、多于半充满 J=L+S，二者方向相反。错误捷径：一律 spin-only √(4S(S+1))，或不分半充满前后统一取 J=|L−S|；镧系 Sm³⁺/Eu³⁺ 因低激发多重态混入偏离纯 J 公式。
` : '';

    const spectraStrategies = isSpectra ? `
策略SP1 — 谱线强度极大 J_max 的 (2J+1) 简并权重：转动谱线强度 ∝ (2J+1)exp(−B·J(J+1)hc/kT)，最强线 J_max≈√(kT/2Bhc)−1/2 由简并度与 Boltzmann 因子竞争决定，随 T 移动；错误捷径直接取 J=0 或忽略 (2J+1) 权重只看指数衰减。
策略SP2 — 带头形成与支返转判据：振转带 R 支线间距随 J 变化，当 B_v'<B_v''（激发态转动常数更小，常见）R 支在某 J 处返转形成带头（band head）；错误捷径假设 B 不随振动量子数变化、认定谱线单调展开、无带头。带头位置需用 Fortrat 抛物线极值定位。
策略SP3 — B_v 的振转耦合外推真实平衡量：实测 B_v=B_e−α_e(v+1/2)，键长/转动惯量必须由 B_e（外推到 v=−1/2）而非某个 B_v 反算；错误捷径直接用 B_0 当 B_e 求键长，或漏离心畸变 D_e 修正高 J 谱线位置。
策略SP4 — Fermi 共振/非谐性：Fermi 共振要求两态对称性相同且未微扰能量接近（如 CO₂ 对称伸缩 ν₁ 与弯曲倍频 2ν₂），微扰后两带排斥、强度重分配，观测频率非机械倍频；Morse 非谐 G(v)=ω_e(v+½)−ω_e x_e(v+½)²，用 Birge-Sponer 外推解离能时须积面积而非线性外推。错误捷径把倍频当精确 2×基频、把 ω_e 当带心。
` : '';

    const groupTheoryStrategies = isGroupTheory ? `
策略GT1 — 简正模总数 vs 光谱活性谱带数：3N−6（线性 3N−5）只给简正振动总数，真正观测到的 IR/Raman 谱带数须先把分子按点群做可约表示 Γ_vib 的约化（用 n_i=(1/h)Σ g(R)·χ_red(R)·χ_i(R)），再按各不可约表示是否张成 x,y,z（IR活性）或二次型 x²,xy…（Raman活性）计数；错误捷径把 3N−6 直接当谱带数、或凭直觉数谱带。
策略GT2 — 互斥规则的前提是严格中心对称：含反演中心 i 的分子 IR 与 Raman 谱带完全不重叠（g/u 宇称），可据"某带同时 IR、Raman 活性"反推分子无 i；错误捷径不先判有无反演中心就套互斥规则，或把"谱带数少"直接当高对称。
策略GT3 — 异构体/构型的谱带数指纹：同一化学式的不同点群（如 M(CO)₄ 的 Td vs D4h、M(CO)₃ 的 fac-C3v vs mer-C2v、cis/trans-ML₄X₂）给出不同数目的 IR 活性 C-O 伸缩带，须分别约化 Γ(CO伸缩) 计数来区分；错误捷径只按配体数或凭经验报带数。
策略GT4 — 简并与 Jahn-Teller 判据：简并不可约表示（E、T）对应简并振动/电子态，χ(E)=表示维数；轨道简并的非线性分子按 Jahn-Teller 定理须畸变降对称，须由 d 电子组态判断是否简并再定畸变方向；错误捷径忽略简并度或不判 J-T 稳定性。
` : '';

    const ligandFieldStrategies = isLigandField ? `
策略LF1 — 高/低自旋由 Δ 与成对能 P 竞争决定：须先比较分裂能（八面体 Δo、四面体 Δt≈4/9·Δo）与成对能 P，Δ>P 取低自旋、Δ<P 取高自旋，二者给出不同未成对电子数 n 和不同 μ_eff；错误捷径不比较 Δ/P 直接假设高自旋，或对四面体误用八面体 Δo。
策略LF2 — spin-only 失效与轨道贡献：μ_eff=√(4S(S+1)) 仅在轨道角动量被猝灭时成立；基态有轨道简并（如 Oh 场 t2g 未半/全充满的 T 项）时轨道角动量未猝灭，实测 μ_eff 显著偏离 spin-only，须用 μ_S+L 或指出偏离方向；错误捷径一律套 spin-only。
策略LF3 — 自旋交叉/温度依赖判据：Δ≈P 边界附近体系随温度在高/低自旋间切换，μ_eff 随 T 变化非 Curie 直线；错误捷径不判 Δ≈P 就假设磁矩温度无关，或用单一自旋态解释全温区数据。
策略LF4 — 分裂能来源与几何辨析：Δ 受金属氧化态、周期、配体在光谱化学序列中的位置共同决定；四面体无反演中心不加 g/u 下标且不发生 J-T（e、t2 非简并冲突）而八面体可 J-T；错误捷径混用几何、忽略配体场强次序。
` : '';

    const groupTheoryConstraints = isGroupTheory ? `
【群论/振动对称性专项约束】
1. 禁止"已知原子数直接用 3N−6 报谱带数"的代入题——必须要求先确定点群、写可约表示并约化到不可约表示，再按 IR/Raman 活性计数。
2. 题面不得直接给出点群名称或活性谱带数结论，须由分子结构/异构体几何自行判断；可给出实验观测（IR/Raman 带数）反推结构。
3. 互斥规则只适用于严格含反演中心的分子，题目须让学生自行判断有无 i，不得直接声明"适用互斥规则"。
4. 简并不可约表示（E、T）的维数、χ(E) 取值与 Jahn-Teller 畸变判据必须自洽；特征标数据须正确。
5. 不同异构体的谱带数区分必须唯一可判：给定观测带数应能排他地指向某一构型，不得两种构型给相同带数而无法区分。
` : '';

    const ligandFieldConstraints = isLigandField ? `
【配位场/晶体场磁性专项约束】
1. 禁止"已知未成对电子数直接套 spin-only 求 μ_eff"的代入题——必须包含 Δ 与成对能 P 的比较（定高/低自旋）或轨道贡献是否猝灭的判断。
2. 题面不得直接声明"高自旋/低自旋"或"轨道角动量猝灭/未猝灭"，须由 Δ/P、d 电子组态和基态项自行判断。
3. 八面体 Δo、四面体 Δt 及 Δt≈(4/9)Δo 的几何关系不得混用；四面体不加 g/u、不发生 J-T 须体现正确。
4. μ_eff、Δ（cm⁻¹ 或 kJ·mol⁻¹）、成对能、温度单位必须自洽；未成对电子数 n 与 S、μ_eff 之间换算正确。
5. 自旋交叉/温度依赖题必须让 Δ≈P 边界由数据推出，磁矩-温度关系唯一可判，不得停留在"可能高可能低"。
` : '';

    const statMechConstraints = isStatMech ? `
【统计热力学/配分函数专项约束】
1. 禁止"已知配分函数直接求熵/热容"的代入题——必须让学生先判断哪些自由度、哪些能级需要纳入求和（尤其电子激发态是否可略、经典极限是否成立）。
2. 电子配分函数含低能激发态时必须显式求和，题面给出激发态能量和简并度但不得声明"需要考虑激发态"。
3. 对称数σ、核自旋权重必须由分子结构自行判断，不得题面直接给 σ 值；同位素/同核体系尤其如此。
4. 能量零点、波数/焦耳/kT 单位基准必须自洽；θ_rot/θ_vib 与温度的比较判据不得省略。
5. Hund 第三定则题必须让学生判断半充满前/后以定 J 方向，不得题面直接给基态谱项 J 值。
` : '';

    const spectraConstraints = isSpectra ? `
【分子光谱/结构反演专项约束】
1. 禁止"已知转动常数 B 直接求键长"的代入题——必须引入振转耦合外推 B_e、离心畸变修正或同位素位移交叉验证。
2. 谱线强度/最强谱线题必须包含 (2J+1) 简并权重与 Boltzmann 因子的竞争，不得只用指数衰减。
3. 带头/支返转题不得题面直接声明"存在带头"，必须由 B_v'与 B_v''大小关系判断；Fortrat 抛物线极值需自行定位。
4. Fermi 共振题不得题面直接标注"Fermi 共振"，必须由对称性匹配和能量接近判据识别；倍频/组合频不得当作精确整数倍基频。
5. 所有谱学量单位（cm⁻¹/MHz/nm）与转动惯量、约化质量、键长的量纲链必须自洽；同位素取代后约化质量变化必须正确传递。
` : '';

    const limitDomainSections = (sections: string[], maxSections = 2) => sections.filter(section => section.trim()).slice(0, maxSections).join('');
    const domainConstraints = limitDomainSections([energeticSpanConstraints, mixedValenceConstraints, statMechConstraints, spectraConstraints, groupTheoryConstraints, ligandFieldConstraints, solidConstraints, physChemConstraints, kineticsConstraints, quantumOrganicConstraints, surfaceConstraints, acidBaseConstraints, colloidConstraints, realGasConstraints, electrochemConstraints]);
    const domainStrategies = limitDomainSections([energeticSpanStrategies, mixedValenceStrategies, statMechStrategies, spectraStrategies, groupTheoryStrategies, ligandFieldStrategies, solidStrategies, physChemStrategies, kineticsStrategies, quantumOrganicStrategies, surfaceStrategies, acidBaseStrategies, colloidStrategies, realGasStrategies, electrochemStrategies]);

    const prompt = `你是化学竞赛命题专家。请根据以下规划出一道高质量竞赛题，并给出详细参考答案。

【知识点】：${kpAnalysis.knowledgePoint}
【本题考察维度】：${dimension}
【难度定位】：${kpAnalysis.suggestedDifficulty}
【必须避开的老套角度】：${avoidList || "无"}
【输出语言】：${language}

【出题要求】：
${singleQuestionConstraint}1. 题目必须清晰明确，条件充分且必要，有唯一正确解
1A. 【约定唯一性硬规则】凡涉及存在多种合理约定的量——如"每电子为基准""电子转移数 n""决速步/速控步电子数""本征值 vs 表观值""per formula unit vs per mole""理论开路电压(由ΔfG°/ΔrG°推算) vs 实测/标称工作电压""质量基准是活性物质/电极/电芯/整包哪一级"等——题干必须显式锁定采用哪一种约定（写明按总反应电子数还是决速步电子数、按几何面积还是活性面积、按热力学理论电压还是实测电压、按哪一级质量基准等），使全题只有唯一可计算的解。特别地，能量密度/比能量类题目若同时给出可推算理论电压的热力学数据与一个实测/标称电压值，必须明确要求用哪一个，否则即为存在两个合理解的废题。若某量在题设下可有两个及以上依据不同约定的合理答案，即为废题，必须重新命题。
2. 嵌入真实科研/工业/实验背景，禁止照搬教材例题场景
3. 所有数值、单位、常数、标准态必须准确无误；需要学生使用的通用公式/常数/标准态必须在题面给出
4. coreData 只是题面已列关键数据的结构化镜像，不能作为题面外附件；凡参考答案会使用的 coreData 数值、单位和系数，必须逐项出现在 questionText 中
5. 题干文字叙述部分控制在 200 字以内，必要数据保留，避免冗长背景
6. 限制生成低防御的计算题、推理题、问答题：计算题不能是"已知A和B，求C"的直接代入结构；推理题不能单步结论跳转；问答题不能只复述概念或泛泛解释——三类题都必须有真正的判断分叉和推理过程
7. 物理/化学条件必须自洽（守恒律、热力学定律、反应方向、单位基准不能矛盾）
${domainConstraints}
【低防御/模板题禁令】（命中任一且未实质升级则废题）：
- 计算题：禁止 Ka/Kb/Ksp/Nernst/Arrhenius/Langmuir/vdW/Hückel 的单公式直接代入，禁止单一化学计量或单一浓度换算
- 推理题：禁止只凭一个关键词、一个趋势或一个规则直接跳到结论，必须有可验证的模型/近似/边界条件判断
- 问答题：禁止概念背诵、优缺点罗列或泛泛解释，必须要求用题面证据完成结构、机理、基准或适用域辨析
- 禁止题面直接告知"应使用某模型/某近似/某条件成立"，必须让学生判断
- 禁止只把教材题换背景和数字；必须至少融合两个概念并有多步依赖链

【结构防御要求（全部强制，但必须通过题目的数据与情境设计来体现，不得写成面向解题者/出题者的要求句）】：
3A 判断分叉：解题必须先判断模型/近似/边界条件/主导形态是否成立，不同结论导向不同计算路径；不能只是口头说明。
3A' 【分叉结论禁泄硬规则】判断分叉的"结论"绝对不能提前写进题面替解题者做掉，只能给出让其自行判断所需的原始数据/现象。以下这类判断结论尤其禁止出现在 questionText 中：哪一极是限容电极（禁止写"脱一半锂后结构坍塌""正极限容"等直接结论，只能给两极容量/化学计量数据让其自行比较）、可逆容量占比/首次库仑效率的取用值（禁止直接给"首效91%"当作已知代入项，除非它本身是被考察的推导目标）、相变/平台电压区段的归属与修正值（禁止直接给"可逆区段取3.9V"，只能给相图或放电曲线数据）、多阻抗谱段的归属（禁止直接标注"该半圆为R_ct"）。此外，以下判断量同样禁止在题面以现成结论/边界直接给出，必须改为提供原始特征让解题者自行判定：①可逆脱嵌/嵌锂窗口与相变截止组成（禁止直接写"x 由 1.0 降至 0.26 可逆""嵌锂窗口 0≤y≤0.5"，只能给原位XRD各相出现/消失的特征、放电曲线拐点或多个候选相，让其自行界定可逆区间与截止点）；②转化/嵌入反应的电子转移数 n（禁止把"n=8""转化反应转移8电子"当已知给出，只能给反应产物物相如 Co+Li₂O 让其自行推算 n）；③活性物质与涂层/极片的质量基准归属（禁止直接断言哪个数值是活性物质、哪个是涂层，必须给出面密度与活性物质占比等原始参数让其自行换算，且不得使两种读法都能算出合理答案）。凡真正的难点步骤在题面被显式提示或用数字结构提前封堵，使解题退化为顺序代入的，即为低防御废题。
3A'' 【分叉可判定性硬规则】藏起来的判断分叉，其物理判据必须唯一可解——即题面数据必须让判据结果无歧义地确定。例如：相变/结构坍缩的截止点必须表现为某个物理量（晶格参数、电压、质量变化等）的骤变或cliff（幅度应明显区别于正常连续变化，如"c轴骤降≥5%"而非"渐降2-3%"）；膨胀是否被孔隙缓冲必须由题面给出孔隙率和膨胀率等数据唯一确定；热力学模型选择必须由题面给出的判据参数（如离子强度 vs Davies 边界、Pr 值）唯一确定。若分叉点的判据是渐变、近似连续或数值上两种取法都可自洽，导致不同解题者可能得出不同但都正确的最终答案——这是新的淘汰③歧义题，必须避免。设计分叉点时必须确保：判据数据有一个明确的"锐利cliff/阈值/骤变"，使正确路径唯一。
设计题目时应优先复制"藏分叉"成功的套路：让解题者必须先从原始数据判断（理论电压用OCV还是实测、活性物质基准如何界定、可逆窗口边界在哪、电子数是多少）才能进入计算，且判断错会导致数值明显偏离。成功模板参考——第45题(v2_...949327)：题面给出一串组成-c轴数据，其中 x=0.35处c轴骤降5.9%远超正常波动，解题者必须自行识别这是H2→H3坍缩cliff从而截止可逆窗于x=0.35，用全窗则答案偏离≥15%。
3B 隐含条件：至少一个关键约束不能显式写在题目里，必须能从数据趋势、守恒律、边界条件、单位基准或反应方向中推出；不能是缺少必要条件。
3C 单位/基准屏障：解题链中必须出现一次不可跳过的单位、标准态、活度/逸度、总浓度/游离浓度、每式量/每晶胞、参考电极或参考零点转换。
3D 教材原型防御：题目必须明确区别于教材模板，不能只替换数字或背景。

【难度设计（从以下选 1-2 条执行）】：
策略A — 引入外观相似但含义不同的量：表观量vs本征量、总浓度vs有效浓度、标准态vs实际态、条件常数vs热力学常数。
策略B — 推导链中途强制单位/基准切换：单位换算、参考基准转换、活度/逸度校正、每式量/每晶胞转换。
策略C — 模型/近似选择判断：给出数据让学生自行判断应选哪个模型/近似，错误选择会导致不同结论。
${domainStrategies}
【答案要求】：
1. 给出完整的分步推导过程（每步含具体公式和数值代入）
2. 给出最终答案（含数值和单位）
2A. 【答案自洽硬规则】referenceAnswer 分步推导链中实际采用的每一个判据取值（截止组成、转折点、模型分支、基准选择等）必须与最终答案所依赖的取值完全一致；分步推导算出的数值必须与最终答案数值一致（允许四舍五入，不允许因采用了不同分支/不同边界取值而出现两个不同数值）。绝对禁止出现"分步推导用A取值得出数值1、最终答案却是按B取值得出的数值2"这类自相矛盾——这类题必定被判废题。
3. 判断分叉、隐含条件来源、单位/基准转换节点这些解题说明只能写在 referenceAnswer 字段里，绝对不能出现在 questionText 题面中

【题面纯净性硬规则（强制）】：
- questionText 只能是自然的题目背景叙述、数据和最终提问，禁止出现任何面向解题者或出题者的元要求句，例如"解答必须…""需要判断…""必须指出…""不得拆分成多个小问""全题只形成一个求解目标"等。
- 上述结构防御（3A-3D）和单问约束是对题目设计的要求，必须靠数据和情境本身体现，不能把要求原文写进题面。

【公式与符号格式（强制）】：
- questionText、requiredAnswer、referenceAnswer、referenceSteps 全部字段一律使用纯文本 Unicode 表达数学，禁止任何 LaTeX/Markdown 数学标记。
- 禁止出现 \\frac \\left \\right \\mathrm \\exp \\sqrt \\sum \\theta \\times \\cdot \\approx 等反斜杠命令，禁止 $ … $、$$ … $$、\\( … \\)、\\[ … \\] 等数学定界符。
- 分数写成 a/b；乘号用 ×，除号用 /，约等号用 ≈，正负号用 ±；上标用 Unicode（如 10⁻³、³ᐟ²）或括号形式 ^(3/2)；下标直接用 m_C、B_v 等文本；希腊字母直接用 ν、θ、Δ、χ、λ 等 Unicode 字符；单位用 cm⁻¹、kJ·mol⁻¹ 等纯文本。

输出必须是严格的 JSON，不包含 markdown 代码块：
{
  "problemId": "v2_${Date.now()}",
  "knowledgePoint": "${kpAnalysis.knowledgePoint}",
  "chosenDimension": "${dimension}",
  "questionText": "完整题目文字，只含背景叙述、数据和提问，所有数据已嵌入，200字以内，禁止任何解题/出题元要求句",
  "coreData": {
    "化学量名称": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "求解目标",
  "referenceAnswer": "完整分步解答，含公式推导、数值计算、判断分叉、隐含条件来源和单位/基准转换",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]
}`;

    const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.7 })).trim();
    const draft = normalizeDraft(cleanAndParseJSON(raw) as Partial<V2QuestionDraft>, kpAnalysis, dimension);

    if (!draft.questionText || !draft.referenceAnswer) {
        throw new Error("Generator: incomplete question or answer in response");
    }
    if (draft.referenceSteps.length < 3) {
        draft.referenceSteps = draft.referenceAnswer
            .split(/\n+/)
            .map(s => s.trim())
            .filter(Boolean)
            .slice(0, 8);
    }

    return draft;
}
