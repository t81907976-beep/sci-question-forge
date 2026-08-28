import { callLLM, cleanJsonString, getCurrentProvider, getOneApiModel } from '../../../llmClient';
import { cleanAndParseJSON } from '../../../utils/jsonCleaner';
import type { BiologyKPAnalysisResult } from './kp-analyzer';
import type { BiologyProblemType } from '../../../../types/multiNodeTypes';
import { ACTIVE_PROMPT_BUILDER, getResearchPhilosophyPrefix } from '../promptSwitcher';
import type { DisciplineEntry } from '../disciplines';

export interface BiologyDiversityPlan {
  batchSize: number;
  problemOrdinal: number;
  objectVariant?: string;
  measurementTool?: string;
  dataModality?: string;
  perturbationType?: string;
  questionStyle?: string;
  subfieldVariant?: string;
  modelVariant?: string;
  finalTaskFrame?: string;
  requiredDifferenceRule: string;
}

function buildDegenerationGuardBlock(problemType: BiologyProblemType): string {
  if (problemType !== 'calculation') return '';

  return `
【源头禁区：禁止生成公式链退化题】
以下禁区适用于所有生物计算题，不针对某个知识点或样本：
- 禁止把题目做成“给全参数/公式/上限/比例 → 选最小值或直接代入 → 单位换算 → 乘时间/面积/总量 → 得终点标量”的线性公式链。
- 禁止用更多小数、更多背景术语、更多实验仪器名称来包装本质只有 2-3 个核心操作的终点数值题。
- 最终目标仍优先保持可计算、可闭合、答案唯一：可以求唯一数值、唯一范围、唯一中间闭合量、可由题设约束唯一确定的表达式/公式，或由主闭合量支撑的唯一判定结论；禁止的是“无分叉的末端标量直算”，不是禁止数值答案。
- 必须至少设计 2 个真实核心决策点：每个决策点都要改变后续路径、变量定义、候选集合、读出口径、状态空间或适用模型；单纯单位换算、取 min/max、扣背景、乘时间不算核心决策点。
- 在写题目前先确定“主分叉变量 → 分叉后变量定义/模型切换 → 层2判别量 → 最终结论改变”四段链；若任一段只能写成代入、换算、取极值或线性积分，必须换题目骨架。
- 至少嵌入一个跨通道冲突或隐含框架选择：例如读数通道与真实状态池不等价、表观参数与真实参数口径不同、快变量/慢变量时标不同、局部边界与整体平均冲突、候选机制给出相同一阶读数但二阶判别量不同。
- 必须有有效 cascadeTrap：层1错误路径导向具体错误候选/机制/数值区间/表达式形式；层1正解后才暴露层2判别量；层2必须改变最终唯一数值、唯一范围、唯一表达式/公式、唯一候选或主闭合量。
- calculation 题的 referenceSteps 不得只是“列式→代入→换算→比较/取极值→答案”；至少 2 步必须明确写出“为什么不能使用另一路径/另一个读出口径/另一个模型”，且这些排除会改变后续计算对象。
- 若最终问法采用机制/模型/读出通道/异常来源/方案可行性/边界条件切换判定，必须先构造可计算主闭合量/判别量，并由题干可见约束唯一闭合；禁止做候选列表逐条排除，不能开放式归因，不能只凭解释偏好判定。
`;
}

function buildDiversityPlanBlock(plan?: BiologyDiversityPlan): string {
  if (!plan) return '';
  const requiredSlots = [
    plan.objectVariant ? `实验对象/系统=${plan.objectVariant}` : '',
    plan.measurementTool ? `测量工具=${plan.measurementTool}` : '',
    plan.dataModality ? `数据形式=${plan.dataModality}` : '',
    plan.perturbationType ? `扰动条件=${plan.perturbationType}` : '',
    plan.questionStyle ? `题型外观=${plan.questionStyle}` : '',
    plan.subfieldVariant ? `子领域变体=${plan.subfieldVariant}` : '',
    plan.modelVariant ? `模型变体=${plan.modelVariant}` : '',
  ].filter(Boolean);

  return `
【批次多样性硬约束（最高优先级，防止同质化）】
这是同一批次中的第 ${plan.problemOrdinal + 1}/${plan.batchSize} 题。你必须按下面的“本题专属脚手架”生成，不能回到该知识点最常见模板。
- 本题专属脚手架：${requiredSlots.join('；') || '更换实验对象、测量方式、数据形式与扰动条件'}
- ${plan.requiredDifferenceRule}
- 本题最终目标框架：${plan.finalTaskFrame || '优先生成唯一数值/范围/中间闭合量，或可由题设约束唯一确定的表达式/公式'}
- 禁止与同批其他题只做表面改写：不得仅替换物种名、数字、单位或叙事背景；优先更换实验对象/测量方式/数据呈现/扰动条件，求解目标只有在能保持题干闭合时才变化。
- 【计算题问法稳定性】：若本题为 calculation，优先围绕“唯一数值/范围/中间闭合量，或可由题设约束唯一确定的表达式/公式”组织最终目标；若采用机制选择、方案选择或异常归因问法，必须在 questionText 中给出足以排除其他合理答案的可见证据，不要只靠内部隐含条件闭合。
- 若脚手架来自多个维度池，必须给出明确的生物学/物理/化学势/调控因果耦合通道，禁止机械拼接。
`;
}

/**
 * Biology V2 Node A1: Question Generator
 *
 * 给定 KP 分析结果，按选定维度生成一道生物学高质量题目，
 * 同步输出参考答案和解题路径。
 *
 * 支持 5 种题型，每种有专属 prompt 结构：
 * - calculation         : 守恒/计量计算，数值推导
 * - genetic-reasoning   : 系谱/杂交推断，概率逻辑
 * - network-reasoning   : 调控网络因果链，拓扑逻辑
 * - threshold-reasoning : 阈值门控，全有全无 + 迟滞
 * - structural-reasoning: 序列/构象/电荷 → 功能推导
 */

export interface BiologyV2Draft {
  problemId: string;
  knowledgePoint: string;
  chosenDimension: string;
  problemType: BiologyProblemType;
  questionText: string;          // 完整题目正文，所有数据已嵌入
  explicitConditions: Record<string, string>;   // 题干中已明确给出的条件（供结构化索引）
  implicitConditions: Record<string, string>;   // 仅供 A2/A4 内部使用，绝不出现在 questionText
  /** @deprecated 旧字段，迁移用，新代码读 explicitConditions */
  logicConditions: Record<string, string>;
  givenData: Record<string, { value: number | string; unit: string }>;  // 计算题数据（推理题为 {}）
  requiredAnswer: string;
  referenceAnswer: string;       // 分步参考解答
  referenceSteps: string[];      // 关键推理步骤列表（所有题型≥8条）
  parameterDependencyTable?: Record<string, string>; // calculation 专用：每个给出参数 → "用于步骤N: XXX" 或 "陷阱参数: 唯一弃用理由"
  decisionClosure?: {       // 判定型问法专用：把计算闭合到唯一机制/候选/错误来源判定
    primaryDecisionVariable: string;  // 最小主闭合量：哪个数值/中间状态真正决定最终判定
    comparisonTarget: string;         // 与哪个观测值、阈值、候选窗口或机制预测比较
    exclusionConstraint: string;      // 该比较如何唯一排除错误候选或错误机制
    auxiliaryQuantities: string;      // 其他可算量为何只是辅助量，不能替代主判据
  };
  seductiveWrongPath?: {    // 诱惑性错误路径，供 reviewer 维度4 和 blind-solver 结果过滤使用
    wrongApproach: string;  // 标准方法直接推导时走进的错误路径起点
    divergenceStep: string; // 在哪一步被哪个约束反驳，格式："在第N步，因忽略了X，错误得到Y"
    whySeductive: string;   // 为什么推理模型容易走这条路
  };
  /**
   * 级联陷阱：层1陷阱被正确识别后，触发层2陷阱。
   * 只有使用级联陷阱设计的题目才有此字段。
   */
  cascadeTrap?: {
    trap1: string;       // 层1陷阱描述（对应某个AI专项D/E/F/G/H）
    trap2: string;       // 层2陷阱描述（由层1正确解后的推理状态触发）
    linkage: string;     // 层1正确结论的哪个特性使层2成为必须检验的约束
    trap1WrongOutcome?: string;       // 若走错层1，会得到哪个错误候选/机制/数值区间
    trap1CorrectUnlock?: string;      // 层1正确后新暴露的层2变量、边界或状态空间
    trap2Discriminator?: string;      // 层2用于改变候选集合或排除错误机制的判别量
    finalOutcomeShift?: string;       // 层2处理前后的候选/机制/结论如何发生变化
  };
  /**
   * 跨题型信息：题目外观为 shellType，解题核心依赖 coreType 推理。
   * 只有跨型伪装题目才有此字段。
   */
  crossTypeInfo?: {
    shellType: BiologyProblemType;  // 题目表面形式（外壳题型）
    coreType: BiologyProblemType;   // 真实核心推理范式
    crossoverPoint: string;         // 题目中哪个关键节点需要从外壳推理切换到核心推理
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 各题型的通用要求
// ─────────────────────────────────────────────────────────────────────────────

const PROBLEM_TYPE_REQUIREMENTS: Record<BiologyProblemType, string> = {
  'calculation': `【题型：定量计算】
出题要求：
- 嵌入真实生命科学研究/实验背景（非教材例题），背景须绑定真实物种/菌株/细胞系（如 E. coli MG1655、HEK293T、酿酒酵母 BY4741），禁止使用"某细胞""某生物"等泛化描述
- 所有数值、单位、生物学常数必须准确
- 禁止"已知A和B直接代入公式求C"——必须有真正的推理过程
- 计算步骤 ≥8 步，中间至少包含2个近似/边界判断节点（先判断条件是否成立，再选路径）
- 【单问强制】：题目最后只提出一个明确目标，严禁出现"①②③"或"(1)(2)(3)"等编号子问；计算题最终目标优先是唯一数值、唯一范围、唯一中间闭合量，或可由题设约束唯一确定的表达式/公式；表达式/公式题仍必须包含实质计算、符号推导或边界条件闭合，不得退化为纯文字机制解释；也可以是阈值/机制/方案/异常判断，但必须由题干可见数据唯一闭合
- 【源头唯一性】：计算题的难度优先来自单位换算、守恒/计量闭合、近似适用性判断、串行数值依赖或闭合边界判断；若引入多个生物机制、候选方案或异常来源，必须同步给出能区分它们的题干可见观测/边界/排除证据

【参数设计要求】：
- 参数数量：4-8 个（根据题目复杂度自然决定，不强行凑数，也不少于4个）
- 数值格式：禁止全部使用整数，至少 60% 的参数须带小数（如 Kd = 0.847 μM 而非 1 μM）；整数只允许用于分子数/计数类参数
- 单位换算陷阱（必须包含）：至少 1 个参数故意给出非计算常用单位，换算本身作为考察点；在 parameterDependencyTable 中标注为"单位换算: 原单位→计算单位"
  典型示例：给出 Vmax = 23.4 nmol·mg⁻¹·min⁻¹（需换算为 μmol·L⁻¹·s⁻¹）；给出分子数需用 Avogadro 常数换算为浓度
- 干扰参数（可选，0-2个）：若设计干扰参数，必须有唯一弃用理由，标注为"陷阱参数: [唯一弃用理由]"；禁止设计"用了和不用都自洽"的模糊参数

逻辑深度（全部满足）：
① 近似判据节点（≥2处，全部满足）：每处须明确给出判据（如[S]与Km的量级比较决定是否适用稳态近似；别构酶Hill系数>1时应用Hill方程而非MM方程），判断结果导向不同计算路径
② 隐含约束：至多一个条件不显式给出，且只能来自守恒律/系统封闭性/单位定义等硬约束
   示例：封闭体系意味着底物总量守恒；等温条件需热交换机制
   “旁路可忽略、无off-target、无细胞死亡、检测效率相同、无长期补偿、某读数唯一代表某机制”等实验软假设不应只放入 implicitConditions；这类条件若影响答案唯一性，应以自然题干条件、质控结果或实验观测形式写入 questionText
③ 多步数值依赖链（高防御优先策略，知识点天然支持时采用）：
   若知识点本身存在天然的级联计算路径（如能量代谢、生态能流、遗传图距），优先设计为"前一步的计算结果是后一步的必要输入"的串行结构（≥3层）。
   串行依赖链的防御价值：任一中间步骤的数值偏差将级联放大到最终答案，AI无法并行处理各步。
   【适用场景示例】：
   · 能量代谢：呼吸底物量→NADH/FADH₂产量→H⁺泵出总量→ATP合酶化学计量→净ATP→扣除耗能→可用ATP
   · 生态能流：净初级产量→林德曼效率连乘→各营养级可用能→转化为生物量→种群密度
   · 遗传图距：重组频率→图距→双交换期望值→校正后基因顺序→期望表型比
   · 酶级联：v₁产物作为酶2底物→扣除竞争性抑制→算v₂→v₂决定通量分流比→目标产物量
   【不适用时不强求】：若知识点本身只有2-3步（如单酶MM方程、单次Nernst计算），不要为凑依赖链而焊接无关过程——这会违反约束闭合原则②（单一核心矛盾）。此时以近似判据节点（①）和AI专项陷阱为主要难度来源。

难度策略（选1-2条）：
A — 单位制切换（非SI→SI，在换算节点制造精度陷阱）
B — 相似量混淆（如净光合 vs 总光合、摄入量 vs 同化量）
C — 多步因果链（信号放大须连乘不能线性叠加）

AI系统性错误专项（必须选1条，优先于A/B/C）：
D — 代谢通量分叉误用：代谢物在某节点被按比例分流（如糖酵解某中间物有两条竞争去路，分流比由题目条件隐含），正确解须先推出分流比，分别计算各路产物量，再取目标路径结果。AI倾向于忽视分叉点，将上游总通量直接乘以末端产率，得到偏高结论。
E — 生物学量对混淆：选取一组系统性易混淆的量对（名称相近但精确含义有本质区别，错误量导致答案差一个数量级或方向相反）。典型示例（不限于此）：摄入量/同化量/净同化量；总光合速率/净光合速率；H⁺泵出数/实际ATP合成数；Km表观值/Km真实值；净初级产量/总初级产量；细胞呼吸量/表观气体交换量。AI倾向于将两个术语视为等价，不区分精确定义边界。
F — 计量关系方向：能量流动效率或信号放大系数须连乘（复利式，各级效率之积），禁止线性叠加。AI倾向于将各级传递效率直接相加或取平均而非连乘。

【输出前必须完成参数依赖检查（结果写入 parameterDependencyTable，不可跳过）】：
步骤1 — 列出题目正文中所有数值参数（名称+值+单位）
步骤2 — 对每个参数，在 parameterDependencyTable 中填写下列三者之一：
  "用于步骤N: [具体运算描述]"  ← 正常参数（N对应 referenceSteps 编号）
  "陷阱参数: [唯一弃用理由]"   ← 有意干扰参数，须有且只有一个正确弃用原因
  "单位换算: [原单位→计算单位，如mM→M；换算是解题必经步骤，直接代入原单位是典型错误]"  ← 题目故意给出非标准单位，单位换算本身作为考察点
步骤3 — 若某参数三种描述均无法给出 → 从题目中删除该参数并调整正文
步骤4 — 检查题目中所有显式公式/化学计量定义，代入全部数值验证等式两边一致；若题目中定义了"某比率/效率"的计算公式，代入数值计算该值，确认结果在物理/生物学允许范围内（如偶联效率须≤100%）；有矛盾则先修正数值再输出
步骤5 — parameterDependencyTable 必须涵盖所有数值参数，不得遗漏
步骤6 — 执行下方【答案唯一性硬约束】自检：参数角色唯一、观测通道唯一、总数/子集闭合；若不满足则先修正题干或删除歧义数据
步骤7 — calculation 题若采用阈值/机制/方案/错误来源/异常解释作为最终问法，必须填写 decisionClosure：先确定唯一主闭合量，再说明它与哪个题干可见阈值/观测值比较，并给出排除其他口径的题干可见约束。
步骤8 — 若题目包含多个候选方案/机制，优先用唯一数值、唯一中间闭合量或可由题设约束唯一确定的表达式/公式承载判断；若保留候选判断，必须在 questionText 中给出区分竞争候选的可见证据，不能只靠 implicitConditions 排除候选。
步骤9 — 若题目涉及 FBA/13C-MFA/蛋白组/辅因子供给，避免退化为“纯FBA候选产物通量 + 一个NADPH/ATP/酶容量/PntAB/释放阈值约束 → 直接判断是否成立/最高通量/唯一方案”的问法；优先让闭合通量、辅因子需求量、酶容量缺口或可达上限成为主判据；若做可行性判定，题干应外显状态边界、读出口径和排除替代机制的证据。`,

  'genetic-reasoning': `【题型：遗传推理】
出题要求：
- 给出若干杂交实验观察结果（表现型及后代比例）
- 要求反推亲本基因型、遗传方式或基因定位
- 结论必须唯一可推导，不存在无法排除的竞争假设
- 禁止直接照搬孟德尔两点测交模板
- 【单问强制】：题目最后只提出一个明确推断目标，严禁出现"①②③"或"(1)(2)(3)"等编号子问

逻辑深度（全部满足）：
① 推理分叉：先判断是否符合独立遗传（9:3:3:1），再决定是否需考虑连锁/互作
② 隐含约束：如"雌雄后代比例不同"隐含伴性遗传；"全部存活"隐含无致死基因
③ 排除假设：题目需要学生明确排除至少一种竞争假设才能得到唯一结论

难度策略（选1-2条）：
A — 给出正反交结果不同，区分母性影响/细胞质遗传/伴性遗传三种可能
B — 后代出现非标准比例（如 2:1），要求推断致死机制
C — 三对基因连锁，用重组率定位基因顺序

AI系统性错误专项（必须选1条；以下为典型示例，不限于此）：
D — 细胞质遗传vs母性影响：设计母系偏向遗传表型，要求通过F1自交后代（细胞质遗传后代100%母系表型；母性影响F2出现性状分离）或正反交（细胞质遗传正反交后代均偏向母系；母性影响仅F1偏向母本而F2分离）进行区分。AI倾向于见"F1表现与母本相同"即判断细胞质遗传，不再验证后续代。
E — 伴性遗传vs常染色体+致死：后代雌雄比例不等，原因是常染色体杂合致死（如AA致死导致Aa:aa=2:1）而非X连锁。AI倾向于"雌雄比例不等→X连锁"而不考虑致死基因的可能性。
F — 上位效应vs连锁互斥：后代比例（如13:3、9:7或15:1）既可来自上位效应也可来自连锁互斥，需额外正反交或测交数据唯一确定。AI倾向于默认独立遗传的9:3:3:1变形，不检验连锁可能性。
H — 正反交差异方向误判：母性影响、细胞质遗传、伴性遗传三种机制各有不同的正反交预测模式（哪代开始分离、哪亲本性别决定结果），AI倾向于混淆三种机制的方向，仅依据F1与母本是否相同就得出结论。`,

  'network-reasoning': `【题型：调控网络推理】
出题要求：
- 描述一个基因调控/信号转导/代谢调节网络（3-5个节点）
- 给出扰动条件（敲除/过表达/激动剂/抑制剂某节点）
- 要求追踪信号传播，推断下游节点最终状态
- 必须包含至少一个抑制边（--|）
- 【单问强制】：题目最后只提出一个明确推断目标，严禁出现"①②③"或"(1)(2)(3)"等编号子问

逻辑深度（全部满足）：
① 推理分叉：路径中至少有一个"AND门"（需两个信号同时激活）或"OR门"（任一激活即可）
② 双重否定：必须包含连续两个抑制（负负得正），考察学生是否能正确追踪
③ 隐含约束：如"该节点是速率限制步骤"意味着其他旁路的影响可忽略

难度策略（选1-2条）：
A — 正反馈环路（A→B→A），判断扰动是否会导致双稳态跳变
B — 多路径汇聚到同一输出节点，判断哪条路径主导
C — 时序依赖：节点 A 必须在节点 B 之前激活，逆序则无效

AI系统性错误专项（必须选1条；以下为典型示例，不限于此）：
D — AND门遗漏：包含一个AND逻辑节点（两路信号须同时激活才能激活下游），题目扰动只激活其中一路。正确结论：下游不激活。AI倾向于把AND门当OR门，误认为单路激活即可激活下游。
E — 奇数抑制链极性：设计含连续3个抑制步骤的路径（负×负×负=负），同时令路径另一侧含单个抑制。AI倾向于记错连续否定次数，混淆2次和3次连续抑制的最终极性。
F — 旁路竞争激活：两条路径汇聚同一输出节点，实验扰动关闭主路，但旁路仍激活输出。正确结论：输出节点仍激活。AI倾向于只追踪被扰动的主路径，得出"输出被关闭"的错误结论。
G — 正反馈双稳态维持：含正反馈环路（A→B→A），题目将系统推过临界点后扰动消失，要求判断系统是否留在新状态。AI倾向于预测扰动消失后系统恢复原状（线性弹回思维），忽视正反馈使新状态自我维持。`,

  'threshold-reasoning': `【题型：阈值逻辑推理】
出题要求：
- 描述一个具有阈值特性的生物系统（神经/免疫/基因开关/细胞周期检查点）
- 明确给出阈值（激活阈值 θ_on）或提供可推算阈值的条件
- 若系统有迟滞，给出去激活阈值 θ_off ≠ θ_on
- 设计一系列刺激序列，要求预测系统状态
- 【强制要求】若 θ_off ≠ θ_on，题目正文必须显式声明系统初始状态（如"初始处于激活态"或"初始处于静息态"），不得依赖"在某条件下培养"等模糊表述让读者自行推断
- 【单问强制】：题目最后只提出一个明确预测目标，严禁出现"①②③"或"(1)(2)(3)"等编号子问

逻辑深度（全部满足）：
① 推理分叉：判断刺激强度/持续时间是否越过阈值
② 迟滞推理：系统已激活时，降低刺激到θ_on以下但高于θ_off，判断状态（仍激活）
③ 历史依赖：当前状态取决于系统历史轨迹，不能只看当前输入值

难度策略（选1-2条）：
A — 多个亚阈值刺激时序叠加，判断是否能越过阈值（空间/时间加和）
B — 不应期内给超阈值刺激，判断能否触发
C — 双稳态切换：两个稳定状态各自的吸引域边界在哪里

AI系统性错误专项（必须选1条；以下为典型示例，不限于此）：
D — 迟滞窗口判断：系统从激活态接受减小的刺激，使刺激处于θ_off < 刺激 < θ_on区间。正确结论：系统维持激活（处于迟滞窗口内）。AI倾向于"刺激 < 激活阈值→系统失活"，忽视迟滞窗口的存在。
E — 历史路径对比：设计两场景，终态刺激强度相同，但路径不同（A路径先超θ_on再降至迟滞窗口；B路径从静息直接到同一强度）；两场景终态不同。AI倾向于仅看终态刺激值判断状态，忽略路径差异。
F — 亚阈值加和衰减条件：多个亚阈值脉冲能否触发激活，取决于衰减时间常数τ与脉冲间隔Δt的比较（Δt≪τ则可叠加；Δt≫τ则各脉冲独立无法叠加）。AI倾向于看到"多个脉冲"就默认可以叠加，不判断衰减条件。`,

  'structural-reasoning': `【题型：结构约束推理】
出题要求：
- 给出分子结构信息（碱基序列/氨基酸序列/结构域描述）
- 引入突变或修饰（点突变/磷酸化/截短/嵌入）
- 要求从结构变化推导功能变化或实验结果
- 必须有明确的"结构→功能"因果链
- 【单问强制】：题目最后只提出一个明确推断目标，严禁出现"①②③"或"(1)(2)(3)"等编号子问

逻辑深度（全部满足）：
① 推理分叉：先判断突变是否位于功能关键区（活性位点/疏水核心/二硫键），再决定影响程度
② 隐含约束：如"pH 7.4条件"隐含Lys带正电、Asp带负电，影响静电相互作用
③ 多步推导：结构变化 → 构象影响 → 结合亲和力变化 → 酶活/转运/结合功能变化

难度策略（选1-2条）：
A — 两个突变的累加效应（各自无影响，但联合时有协同效应）
B — 同一突变在不同 pH 下效果不同
C — 从凝胶电泳/质谱/FRET实验结果反推结构变化

AI系统性错误专项（必须选1条；以下为典型示例，不限于此）：
D — 保守替换活性位点功能影响：突变为同族氨基酸（如Asp→Glu，负电荷类型保留），但该位置位于酶活性位点而非表面暴露区，侧链长度或空间几何的微小改变仍显著影响底物结合。AI倾向于"保守替换→功能保留"，忽视活性位点对侧链精确几何的依赖。
E — 双突变协同效应非线性：两个单独影响较小的突变（A和B各自不足以破坏功能），联合时产生协同负效应（功能完全丧失或方向反转）。AI倾向于线性叠加两个单突变的效果预测双突变表型，忽视跨残基相互作用的非线性性。
F — 变构vs竞争性抑制实验判读：给出凝胶迁移位移/保护性酶切/FRET实验数据，要求反推抑制机制。正确解需分析数据特征排除竞争性机制；AI倾向于默认竞争性抑制，不验证底物-抑制剂互斥性。
G — 截断蛋白显性负效应：蛋白C端截短删除调控域，截短蛋白保留底物结合能力但失去自我抑制，在野生型背景下以显性负效应占据活性位点。AI倾向于预测"截断→功能丧失（单纯失活）"，忽视显性负效应导致野生型功能也被抑制的可能。`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Kimi 精简版题型要求（削减到核心约束，为 JSON 输出保留足够 token）
// ─────────────────────────────────────────────────────────────────────────────

const PROBLEM_TYPE_REQUIREMENTS_KIMI: Record<BiologyProblemType, string> = {
  'calculation':
    `【题型：定量计算】背景绑定真实物种/菌株/细胞系（禁用“某细胞”泛化描述）；最终目标优先围绕唯一数值、唯一范围、唯一中间闭合量，或可由题设约束唯一确定的表达式/公式组织；表达式/公式题仍必须包含实质计算、符号推导或边界条件闭合，不得退化为纯文字机制解释；也可做阈值/机制/方案/异常判断，但必须由题干可见数据唯一闭合；参数 4-8 个，至少 60% 带小数，至少 1 个参数故意用非常用单位（标注“单位换算: 原单位→计算单位”）；若有干扰参数必须有唯一弃用理由，避免模糊参数；必须满足答案唯一性硬约束：参数角色唯一、观测通道唯一、总数/子集闭合；计算步骤≥8步，含≥2个近似适用性判断节点（先判断条件是否满足再选路径）；若知识点天然存在级联计算路径（如能量代谢、生态能流、遗传图距），优先形成≥3层串行数值依赖链（前步计算结果是后步必要输入）以提升防御性——若知识点本身只有2-3步则不强求，以近似判据和AI专项陷阱为主；嵌入一组生物学易混淆量对（如摄入量/同化量/净同化量，或H⁺泵出数/ATP合酶化学计量/实际ATP数）；FBA/13C-MFA/蛋白组/辅因子题避免退化为“纯FBA候选 + 单一NADPH/ATP/酶容量/PntAB/释放阈值约束”直接判断是否成立/最高通量/唯一方案；优先让闭合通量、辅因子需求量、酶容量缺口、可达上限或可唯一化表达式/公式成为主判据；至多一个隐含约束，且只能来自守恒律/系统封闭性/单位定义等硬约束，旁路可忽略、无off-target、无细胞死亡、检测效率相同、无长期补偿等软假设若影响唯一性，应以自然题干条件或实验观测写入题干；每个给出参数须在 parameterDependencyTable 中注明"用于步骤N: XXX"、"陷阱参数: 唯一弃用理由"或"单位换算: 原单位→计算单位（换算是考察点）"，无法归类则删除该参数；代入数值验证所有显式公式（含效率/比率定义式，结果须在物理允许范围内）一致后再输出。`,
  'genetic-reasoning':
    `【题型：遗传推理】给出杂交结果反推亲本基因型/遗传方式；结论唯一；含推理分叉、隐含约束、排除至少一个竞争假设；AI专项选一（典型示例，不限于此）：细胞质遗传/母性影响区分（F1自交或正反交后代验证）、伴性遗传/常染色体+致死区分（雌雄比例不等原因）、上位效应/连锁互斥区分（需额外杂交数据唯一确定）、正反交差异方向（三种机制各不同）。`,
  'network-reasoning':
    `【题型：调控网络推理】3-5节点网络，含≥1抑制边；从扰动点追踪信号；含AND/OR门和双重否定（负负得正）；AI专项选一（典型示例，不限于此）：AND门遗漏（单路激活不足以激活下游）、奇数抑制链极性（连续3次否定=负）、旁路竞争激活（被扰动路径关闭但旁路仍激活输出）、正反馈双稳态维持（扰动消失后系统仍留在新状态）。`,
  'threshold-reasoning':
    `【题型：阈值逻辑推理】明确给出θ_on（含迟滞时给θ_off）；若θ_off≠θ_on必须显式声明系统初始状态；设计刺激序列预测状态；含迟滞推理和历史依赖。`,
  'structural-reasoning':
    `【题型：结构约束推理】给出结构信息+突变/修饰；从结构→构象→功能多步推导；含功能区判断分叉和隐含pH/环境约束；AI专项选一（典型示例，不限于此）：保守替换在活性位点的功能影响（保守≠安全）、双突变协同效应非线性（不可线性叠加单突变效果）、变构/竞争性抑制实验判读（需从数据特征排除机制）、截断蛋白显性负效应（截断≠单纯失活）。`,
};

// ─────────────────────────────────────────────────────────────────────────────
// 约束闭合原则（全题型通用，最高优先级）
// 解决"系统复杂度超过约束闭合度"导致答案不唯一的核心问题
// ─────────────────────────────────────────────────────────────────────────────

const CONSTRAINT_CLOSURE_PRINCIPLES = `【约束闭合原则（最高优先级，违反则重写整道题）】
以下 5 条约束的优先级高于所有难度/深度/逻辑规则：

① 参数角色唯一：题干中每个数值/参数只能是以下两种角色之一——
   (a) 正确推理路径的必要成分；或
   (b) 有意设计的结构性陷阱：错误解题者会误用，但严格分析后有且只有一个正确判断（此参数在本题中不适用，理由唯一）。
   ✗ 禁止第三种角色"模糊参数"：使用与否都有生物学支持、导致解空间发散
   ✓ 正确：每个干扰参数都有明确的"正确弃用原因"，题目约束足以唯一确定它不适用

② 答案唯一性硬约束：
   - 每个数值只能有唯一角色：计算输入、单位换算输入、或有唯一弃用理由的质控/陷阱参数。
   - 若多个观测量可估计同一中间变量，题干必须唯一指定 operational definition；否则删除多余观测量。
   - 若给出总数及分类/直方图计数，分类合计必须等于总数；若不是全集，必须说明独立子样本分母。
   - 任一条件可支持另一条自洽计算路径并改变最终答案，则题目无效。

③ 单一核心矛盾：全题只有一个核心悖论（一个需要学生解释的"反直觉现象"）。
   ✗ 禁止：把两个独立科研结论强行焊接（AOX通路 + 曲率变化，各自都足以单独出一道题）
   ✓ 正确：一个核心矛盾（如"抑制复合体III后O₂释放反而增加"），其余条件仅定义系统边界

④ 唯一确定答案：所有给出条件联立后，只有一个满足全部约束的解。
   ✗ 禁止出现："更可能" / "倾向于" / "取决于X的具体值" / "若假设Y则"
   ✓ 正确：核心结论是明确的方向（增加/减少/不变）、唯一数值、唯一范围、唯一中间闭合量、可由题设约束唯一确定的表达式/公式，或由定量判别量唯一闭合的机制/方案结论

⑤ 推理深度上界：从题干到最终结论，核心决策点 ≤ 3 个（含判断分叉，不含代入计算步骤）。
   ✗ 禁止：多时间尺度 × 多状态机 × 多反馈环同时耦合（超过3个核心决策节点）
   ✓ 正确：一条清晰的推理主线，最多3个需要判断的关键节点

⑥ 约定自足：凡题目用到的符号方向、热力学convention、动力学模型（MM/MWC/Hill），必须在题干中显式声明。答案不依赖任何出题人的隐含知识约定。
   ✗ 禁止："默认采用MWC平均场" / "ΔG按生化惯例取反"（未在题干声明即使用）
   ✓ 正确：题干明确写出所用模型/convention，或完全不涉及此类约定
   ⚠️【注意】：可由题目数值推算出的近似（稳态近似、底物饱和、氧限制等）不属于本条管辖范围——这类假设归属②隐含约束，详见下方【隐含条件写法规定】的判定规则`;

// ─────────────────────────────────────────────────────────────────────────────
// GLM 级联陷阱预设：每种题型预先指定层1/层2 AI专项类型
// GLM-5.1 是 thinking 模型，max_tokens=8192 下如果让它"自己选哪个AI专项"
// 会花大量 thinking token 评估选项，把 8192 budget 耗尽后 content 为空。
// 预指定类型 = 消除"选择"决策 = 大幅缩短 reasoning，为 JSON 输出释放预算。
// ─────────────────────────────────────────────────────────────────────────────

const GLM_CASCADE_TRAP_PRESET: Record<BiologyProblemType, string> = {
  'calculation':
    '层1=量对混淆(E专项：选一对题目语境中的易混淆量，如摄入量/同化量或H⁺泵出数/实际ATP合成数)，层2=近似条件适用性判断（正确区分量对后，还需比较某参数与Km或τ的量级来决定能否用稳态近似/线性近似，走错层1的模型永远碰不到此判断节点）',
  'genetic-reasoning':
    '层1=伴性vs常染色体+致死(E专项：后代雌雄比例不等，但原因是常染色体杂合致死而非X连锁)，层2=排除伴性后另组正反交数据才可分析，其中隐含母性影响vs细胞质遗传判断（需验证F2是否出现性状分离）',
  'network-reasoning':
    '层1=AND门遗漏(D专项：某节点需两路信号同时激活，题目扰动只激活其中一路，正确结论是该节点不激活)，层2=主路关闭后暴露一条被掩盖的旁路，输出节点状态由旁路决定(F专项)',
  'threshold-reasoning':
    '层1=迟滞窗口判断(D专项：刺激降至θ_off<刺激<θ_on，系统维持激活)，层2=激活态与静息态的θ_off不同（状态依赖性阈值），进入激活态后θ_off改变，下一刺激须用激活态θ_off判断',
  'structural-reasoning':
    '层1=保守替换活性位点(D专项：Asp→Glu等保守替换在活性位点仍显著影响底物结合)，层2=该残基同时参与变构调节环路，Km改变触发变构构象切换进而改变Vmax（Km变化后还有Vmax的二级效应）',
};

// ─────────────────────────────────────────────────────────────────────────────
// 级联陷阱设计指南（cascadeEnabled=true 时注入，非 Kimi/MiniMax/GLM 限流模型）
// 原理：层1陷阱被正确识别后，正确推理的下一步本身隐含层2陷阱
// ─────────────────────────────────────────────────────────────────────────────

const CASCADE_TRAP_GUIDE = `【级联陷阱（在 AI专项基础上叠加，可大幅提升难度）】
设计原则：
- 层1 = AI专项陷阱（从 D/E/F/G/H 中选一），且走错层1必须导向一个具体错误候选/机制/数值区间，不能只是“可能算错”。
- 层2 = 只有在层1被正确破解、进入正确推理路径后才会浮现的第二个约束；走错层1的模型永远碰不到层2。
- 层1 与层2 的联动必须是因果性的：层1正确结论引入一个新自由度，层2是对该自由度的约束。
- 层2必须改变最终判定、主闭合量、表达式形式或读出口径：例如层1确定变量定义后，层2才改变该变量的边界条件或适用模型；禁止把层1、层2写成两个并列质控条件或候选表格筛选项。
- 题目中不得直接提示“先做层1再做层2”；但 referenceSteps 和 cascadeTrap 字段必须写清 trap1WrongOutcome、trap1CorrectUnlock、trap2Discriminator、finalOutcomeShift。

各题型层2陷阱示例（仅供参考，可自创）：
• calculation：层1=量对混淆(E)→正确得到净光合速率后，层2=该速率处于光饱和曲线拐点附近，不能用线性近似计算产物量，须判断光饱和条件是否成立
• calculation：层1=边界条件判断→正确识别须用精确MM方程后，层2=题中"表观Km"与"真实Km"两值共存，精确方程须用真实Km但模型习惯性用表观值
• genetic-reasoning：层1=伴性vs常染色体+致死(E)→正确排除伴性后，层2=另一组正反交数据此时才变得可分析，其中隐藏了母性影响vs细胞质遗传的区分
• network-reasoning：层1=AND门识别(D)→正确确认C节点不激活后，层2=主路关闭揭示了一条被主路信号掩盖的旁路抑制，D节点状态由该旁路决定
• threshold-reasoning：层1=迟滞窗口判断(D)→正确认定系统仍激活后，层2=激活态与静息态的θ_off不同（状态依赖性阈值），后续刺激须用激活态θ_off判断
• structural-reasoning：层1=保守替换活性位点(D)→正确预测Km改变后，层2=该残基同时参与变构调节环路，Km改变触发变构构象切换进而改变Vmax，必须追踪此二级效应

输出：将层1、层2、联动关系及四个可验收字段写入 cascadeTrap 字段；若无法说明“层1错解得到什么错误结果、层1正解解锁什么层2变量、层2如何改变最终候选”，说明这不是合格级联陷阱，必须重写题目骨架。`;

// ─────────────────────────────────────────────────────────────────────────────
// 学科护栏注入块（Generator 侧，与 Reviewer 审查维度 5 对称）
// ─────────────────────────────────────────────────────────────────────────────

function buildDisciplineGuardrailBlockForGenerator(discipline?: DisciplineEntry): string {
  if (!discipline) return '';
  const parts: string[] = [];

  const hierarchyPath = typeof discipline.hierarchy === 'object' ? discipline.hierarchy.path : undefined;
  if (hierarchyPath?.length) {
    parts.push(`▸ 专题层级路径：${hierarchyPath.join(' → ')}`);
  }
  if (discipline.formulaCoverage && Object.keys(discipline.formulaCoverage).length > 0) {
    parts.push(
      '▸ 专题公式/模型覆盖范围（优先用于模型边界和计算闭合）：\n' +
      Object.entries(discipline.formulaCoverage)
        .map(([section, items]) => `  - ${section}：${items.slice(0, 3).join('；')}`)
        .join('\n'),
    );
  }
  if (discipline.crossDisciplinaryUseCases?.length) {
    parts.push(
      '▸ 跨学科调用边界（若题目借用该模型，必须遵守对应边界）：\n' +
      discipline.crossDisciplinaryUseCases
        .map(item => `  - ${item.path?.join(' → ') ?? item.discipline}：${item.useCase}；边界：${item.constraints}`)
        .join('\n'),
    );
  }
  if (discipline.modelVariants?.length) {
    parts.push('▸ 可替换模型变体（按题目条件选择，不得混用参数体系）：\n' + discipline.modelVariants.map(v => `  - ${v}`).join('\n'));
  }

  if (discipline.forbiddenErrors?.length) {
    parts.push(
      '▸ 严禁出现的学术硬伤（任一违反导致题目作废，必须在生成前自检排除）：\n' +
      discipline.forbiddenErrors.map(e => `  - ${e}`).join('\n'),
    );
  }
  if (discipline.parameterConstraints && Object.keys(discipline.parameterConstraints).length > 0) {
    parts.push(
      '▸ 底层物理/生理常数边界（数值必须在此范围内，违反即为硬伤）：\n' +
      Object.values(discipline.parameterConstraints).map(v => `  - ${v}`).join('\n'),
    );
  }
  if (discipline.antiPatternStrategies?.length) {
    parts.push(
      '▸ 【强制执行】高防御出题策略——题目必须体现下列策略中的至少 1 条（审查阶段将严格验收，\n' +
      '  未体现任何一条将判为难度不足，触发修复循环。请在出题时主动选择并实施其中 1 条）：\n' +
      discipline.antiPatternStrategies.map((s, i) => `  ${i + 1}. ${s}`).join('\n'),
    );
  }
  if (discipline.diversityScaffolding) {
    const d = discipline.diversityScaffolding;
    const lines: string[] = [];
    if (d.objectVariants?.length) lines.push(`  - 实验对象/系统池：${d.objectVariants.join('、')}`);
    if (d.measurementTools?.length) lines.push(`  - 测量工具池：${d.measurementTools.join('、')}`);
    if (d.dataModalities?.length) lines.push(`  - 数据形式池：${d.dataModalities.join('、')}`);
    if (d.perturbationTypes?.length) lines.push(`  - 扰动条件池：${d.perturbationTypes.join('、')}`);
    if (d.questionStyles?.length) lines.push(`  - 问法风格池：${d.questionStyles.join('、')}`);
    if (d.subfieldVariants?.length) lines.push(`  - 子领域变体池：${d.subfieldVariants.join('、')}`);
    if (d.modelVariants?.length) lines.push(`  - 模型变体池：${d.modelVariants.join('、')}`);
    if (d.antiRepeatRule) lines.push(`  - 去重复规则：${d.antiRepeatRule}`);
    if (d.scaffoldingTransitionRule) lines.push(`  - 因果闭合规则：${d.scaffoldingTransitionRule}`);
    if (lines.length) {
      parts.push('▸ 多样性脚手架（用于开放组合，禁止整句复现为题干）：\n' + lines.join('\n'));
    }
  }

  if (parts.length === 0) return '';
  return '\n【学科专项护栏（最高优先级，与约束闭合原则并列强制执行）】：\n' + parts.join('\n\n') + '\n';
}

function getMissingCascadeTrapFields(draft: BiologyV2Draft): string[] {
  const trap = draft.cascadeTrap as any;
  const requiredFields = [
    'trap1',
    'trap2',
    'linkage',
    'trap1WrongOutcome',
    'trap1CorrectUnlock',
    'trap2Discriminator',
    'finalOutcomeShift',
  ];

  return requiredFields.filter(field => {
    const value = trap?.[field];
    return typeof value !== 'string' || value.trim().length === 0;
  });
}

function buildCascadeTrapRetryHint(missingFields: string[]): string {
  if (missingFields.length === 0) return '';
  return `
- 你上一次输出的 cascadeTrap 不合格，缺失或为空字段：${missingFields.join('、')}。
- 本次必须在生成阶段直接补齐 cascadeTrap 全部字段，禁止留空、禁止写“同上”、禁止只描述 trap1/trap2。
- 必须让层1错解导向具体错误候选/机制/数值区间；层1正解后才解锁层2变量；层2判别量必须改变候选集合、翻转机制选择或排除剩余错误候选。
- 如果当前题目骨架无法满足上述链条，直接重写题目骨架，不要输出弱级联或空字段。`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 主入口
// ─────────────────────────────────────────────────────────────────────────────

export interface FormulaChainFusionPlan {
  fusionAxis: string;
  primaryBranchVariable: string;
  readoutConflict: string;
  cascadeUnlock: string;
  finalClosureTarget: string;
  branchBudget: string;
}

export interface BiologyGenerationRetryGuidance {
  reason: string;
  requiredDirection?: string;
  formulaChainFusionPlan?: FormulaChainFusionPlan;
}

export async function generateBiologyQuestion(
  kpAnalysis: BiologyKPAnalysisResult,
  dimensionIndex: number,
  language: string = 'zh-CN',
  cascadeEnabled: boolean = false,
  discipline?: DisciplineEntry,
  diversityPlan?: BiologyDiversityPlan,
  retryGuidance?: BiologyGenerationRetryGuidance,
): Promise<BiologyV2Draft> {
  const dimEntry = kpAnalysis.testDimensions[dimensionIndex % kpAnalysis.testDimensions.length];
  const dimension = dimEntry.dimension;
  const problemType = dimEntry.problemType;
  const reasoningHint = dimEntry.reasoningHint;
  const avoidList = kpAnalysis.coreConceptsToAvoid.join('、');
  const crossType = dimEntry.crossType;

  // Kimi / MiniMax / GLM 的有效 max_tokens 上限为 8192，prompt 本身已较长，需用精简版题型要求
  const currentModel = getOneApiModel().toLowerCase();
  const isKimi    = getCurrentProvider() === 'oneapi' && currentModel.includes('kimi');
  const isMiniMax = getCurrentProvider() === 'oneapi' && currentModel.includes('minimax');
  const isGLM     = getCurrentProvider() === 'oneapi' && currentModel.includes('glm');

  const typeRequirements = (isKimi || isMiniMax || isGLM)
    ? PROBLEM_TYPE_REQUIREMENTS_KIMI[problemType]
    : PROBLEM_TYPE_REQUIREMENTS[problemType];

  // 题型决定输出 JSON 结构差异；token 受限模型（Kimi/MiniMax/GLM）进一步压缩字数要求
  const isLimitedContext = isKimi || isMiniMax || isGLM;
  const isReasoning = problemType !== 'calculation';
  const seductiveWrongPathSchema = isLimitedContext ? '' : `,
  "seductiveWrongPath": {
    "wrongApproach": "（标准方法直接推导时走进的错误路径起点）",
    "divergenceStep": "（在第N步，因忽略了X约束，错误得到结论Y）",
    "whySeductive": "（与教材方法/直觉的关联，解释为什么容易走错）"
  }`;

  // cascadeTrap schema：所有模型都可输出，限流模型省略注释
  const cascadeTrapSchema = cascadeEnabled ? `,
  "cascadeTrap": {
    "trap1": "（层1陷阱描述）",
    "trap2": "（层2陷阱描述）",
    "linkage": "（层1正确结论如何引入层2约束）",
    "trap1WrongOutcome": "（走错层1会得到的错误候选/机制/数值区间/表达式形式）",
    "trap1CorrectUnlock": "（层1正确后才暴露的层2变量、边界或状态空间）",
    "trap2Discriminator": "（层2用于改变候选集合、表达式形式或排除错误机制的判别量）",
    "finalOutcomeShift": "（层2处理前后的候选/机制/数值/范围/表达式/结论如何变化）"
  }` : '';

  // crossTypeInfo schema：有 crossType 时输出
  const crossTypeSchema = crossType ? `,
  "crossTypeInfo": {
    "shellType": "${crossType.shellType}",
    "coreType": "${crossType.coreType}",
    "crossoverPoint": "（题目中哪个节点需要切换推理范式）"
  }` : '';

  const decisionClosureSchema = problemType === 'calculation' ? `,
  "decisionClosure": {
    "primaryDecisionVariable": "（最小主闭合量：哪个数值/中间状态真正决定最终判定）",
    "comparisonTarget": "（该主闭合量要与哪个观测值、阈值、候选窗口或机制预测比较）",
    "exclusionConstraint": "（该比较如何唯一排除错误候选/错误机制/错误来源）",
    "auxiliaryQuantities": "（其他可算量为何只是辅助量，不能替代主判据）"
  }` : '';

  // 跨型伪装指令（有 crossType 时注入；限流模型用精简版）
  const crossTypeBlock = crossType ? (isLimitedContext
    ? `【跨型伪装】外壳:${crossType.shellType} 核心:${crossType.coreType}。表面模仿外壳题型格式，解题关键节点必须用核心推理范式。输出crossTypeInfo字段（crossoverPoint说明切换节点）。`
    : `【跨题型伪装（本题必须使用）】：
外壳题型：${crossType.shellType}（题目表面形式、问法、数据格式完全模仿此题型）
核心推理：${crossType.coreType}（解题关键节点必须依赖此推理机制）
设计要求：1. 题目表面特征符合 ${crossType.shellType} 的典型格式，不透露内部推理范式
2. 关键解题节点必须用 ${crossType.coreType} 的核心逻辑才能得出正确结论
3. 直接按 ${crossType.shellType} 标准方法推导，会在关键节点因缺少 ${crossType.coreType} 推理而得错误结论
4. 正确解法：先识别 ${crossType.coreType} 特征，再结合 ${crossType.shellType} 完成最终推导
输出时填写 crossTypeInfo 字段（crossoverPoint 说明哪个节点需要切换推理范式）`) : '';

  // 级联陷阱指令
  // - GLM：使用预设 trap 类型（消除"选哪个AI专项"的自由决策，大幅缩短 thinking）
  // - Kimi/MiniMax（非GLM的 isLimitedContext）：原有紧凑版指令
  // - Claude/DeepSeek：完整版 CASCADE_TRAP_GUIDE
  const cascadeTrapBlock = cascadeEnabled ? (
    isGLM
      ? `【级联陷阱（预设类型，直接实现，不需要重新选择）】${GLM_CASCADE_TRAP_PRESET[problemType]}。层1错解必须导向具体错误候选/机制/数值区间/表达式形式；层1正解后才解锁层2判别量；层2必须改变最终候选集合、表达式形式或结论。将具体实现写入cascadeTrap全部字段。`
      : isLimitedContext
        ? `【级联陷阱】层1=某AI专项陷阱且错解导向具体错误候选/机制/数值区间/表达式形式；层2=层1被正确破解后才浮现的第二约束（走错层1永远碰不到层2），且层2必须改变最终候选集合、表达式形式或结论。输出cascadeTrap全部字段。`
        : CASCADE_TRAP_GUIDE) : '';

  const outputSchema = isReasoning
    ? `{
  "problemId": "bio_v2_XXX",
  "knowledgePoint": "（知识点）",
  "chosenDimension": "（考察维度）",
  "problemType": "（题型）",
  "questionText": "（题目正文，${isLimitedContext ? '100-180' : '150-250'}字，只有一个问题目标，无子问编号）",
  "explicitConditions": {"条件名": "题干中已明确给出的条件"},
  "implicitConditions": {"条件名": "需学生自行推断的隐含条件——不出现在questionText中"},
  "logicConditions": {},
  "givenData": {},
  "requiredAnswer": "（推断目标，单一目标）",
  "referenceAnswer": "（分步参考解答）",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]${seductiveWrongPathSchema}${cascadeTrapSchema}${crossTypeSchema}
}`
    : `{
  "problemId": "bio_v2_XXX",
  "knowledgePoint": "（知识点）",
  "chosenDimension": "（考察维度）",
  "problemType": "calculation",
  "questionText": "（题目正文，${isLimitedContext ? '120-200' : '200-300'}字，数值嵌入正文，只有一个最终目标，无子问编号；最终问法优先服务计算闭合，可要求唯一数值、唯一范围、唯一中间闭合量，或可由题设约束唯一确定的表达式/公式；若采用判定/选择/归因问法须给出题干可见排除证据）",
  "explicitConditions": {},
  "implicitConditions": {"条件名": "需学生自行推断的隐含约束——不出现在questionText中"},
  "logicConditions": {},
  "givenData": {"参数名": {"value": 0, "unit": "单位"}},
  "parameterDependencyTable": {"参数名(值 单位)": "用于步骤N: 具体运算描述 | 陷阱参数: 唯一弃用理由 | 单位换算: 原单位→计算单位（换算是考察点）"},
  "requiredAnswer": "（单一计算目标：唯一数值/范围/中间闭合量/表达式或公式；数值或范围需含单位，表达式/公式需定义变量与适用条件）",
  "referenceAnswer": "（分步计算过程；若最终问法是表达式/公式，必须说明约束如何唯一确定其形式；若最终问法是判定/选择/归因/异常解释，必须先给出主闭合量再给结论）",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]${decisionClosureSchema}${seductiveWrongPathSchema}${cascadeTrapSchema}${crossTypeSchema}
}`;

  const philosophyPrefix = ACTIVE_PROMPT_BUILDER.useResearchPhilosophy
    ? getResearchPhilosophyPrefix(problemType) + '\n\n'
    : '';

  const disciplineGuardrailBlock = buildDisciplineGuardrailBlockForGenerator(discipline);
  const diversityPlanBlock = buildDiversityPlanBlock(diversityPlan);
  const degenerationGuardBlock = buildDegenerationGuardBlock(problemType);
  const formulaChainFusionPlanBlock = retryGuidance?.formulaChainFusionPlan ? `
【公式链退化专用融合骨架（必须按此骨架重写，不得只加背景术语）】
- 融合轴：${retryGuidance.formulaChainFusionPlan.fusionAxis}
- 主分叉变量：${retryGuidance.formulaChainFusionPlan.primaryBranchVariable}
- 跨通道冲突：${retryGuidance.formulaChainFusionPlan.readoutConflict}
- 级联解锁：${retryGuidance.formulaChainFusionPlan.cascadeUnlock}
- 最终闭合目标：${retryGuidance.formulaChainFusionPlan.finalClosureTarget}
- 分叉预算：${retryGuidance.formulaChainFusionPlan.branchBudget}
验收方式：referenceSteps 中必须出现主分叉变量、跨通道冲突和级联解锁三者；每个分叉必须改变后续计算对象、变量定义、读出口径或表达式形式。若某判断不改变后续计算对象，必须删除或并入给定条件。
` : '';

  const retryGuidanceBlock = retryGuidance ? `
【上一次生成被代码级退化检测拒绝，本次必须换骨架】
失败原因：${retryGuidance.reason}
${retryGuidance.requiredDirection ? `必须转向：${retryGuidance.requiredDirection}` : ''}
${formulaChainFusionPlanBlock}
硬性要求：
- 禁止继续使用“某细胞/某贴壁肿瘤细胞/某体系”等泛化背景；必须写真实物种、细胞系、菌株、蛋白/RNA/代谢体系或实验平台。
- 禁止继续做无分叉终点标量直算；计算题仍优先保持唯一数值、唯一范围、唯一中间闭合量，或可由题设约束唯一确定的表达式/公式。
- 若当前知识点天然容易落成直算，优先通过引入强相关知识点交叉、读出口径切换、边界条件切换或多通道约束来形成唯一数值、唯一范围、唯一中间闭合量，或可由题设约束唯一确定的表达式/公式；只有仍无法形成有效闭合量时，才改成唯一候选/机制/读出口径判定。若采用机制选择、方案选择或异常归因问法，必须在 questionText 中给出足以排除其他合理答案的可见证据。
- 分叉数量必须压缩为“1个主分叉 + 1个层2判别 + 最多1个辅助闭合”；禁止堆叠4个以上并列质控判断。少数有效分叉优先于多判断点。
- 必须让题面数据支持至少一个跨通道冲突或隐含框架选择，并让它改变后续计算对象。
` : '';

  const prompt = `${philosophyPrefix}你是生物学竞赛命题专家。请生成一道高质量题目并给出参考答案。

【知识点】：${kpAnalysis.knowledgePoint}
【考察维度】：${dimension}
【推理路径】：${reasoningHint}
【难度】：${kpAnalysis.suggestedDifficulty}
【避开角度】：${avoidList || '无'}
${retryGuidanceBlock}
${degenerationGuardBlock}
${typeRequirements}
${diversityPlanBlock}
${isLimitedContext ? '' : `
${CONSTRAINT_CLOSURE_PRINCIPLES}
${disciplineGuardrailBlock}
【隐含条件写法规定（必须遵守）】：
- implicitConditions 中的每一条，必须以"现象/数据/实验结果"的形式暗藏于 questionText 背景叙述中，让做题者自行推断
- 禁止在 questionText 任何位置直接陈述、标注或提示这些隐含条件（包括括号说明、"注意"、"提示"、"隐含条件"等字样）
- implicitConditions 字段仅供内部审查和求解使用，不向做题者展示
- 【可推断近似 vs 约定声明的判定规则（⑤约定自足的豁免边界）】：以下两类假设性质不同，处理方式相反——
  · 【约定类假设→必须在题干显式声明】：选用哪个动力学模型（MM/Hill/MWC）、符号正负方向（ΔG的正负convention）、热力学参照态——这类假设改变"公式形式本身"，不同约定代入同一数据会算出不同结果，属于⑤约定自足管辖，必须写入题干。
  · 【可推断近似→必须作为隐含条件，禁止写入题干】：通过比较两个可计算量的大小可以推断成立的近似——如"OUR与OTR比较后判断是否氧限制进而得出C_L≈0"、"[S]≫Km后底物饱和近似成立"、"混合时间与代谢时间尺度比较后判断死区存在"——这类近似是做题者的推断步骤，结论由题目数据唯一决定，不存在"约定"分歧，属于②隐含约束，写入题干即为depthIssue。

【改动2：显式逻辑剥离（生成前强制自检，不可跳过）】：
在写题目正文之前，必须完成以下自检——
自检A — 列出所有判断条件：写出解题过程中每一个"若…则…"结构和每一个判断阈值
自检B — 逐条判断是否出现在题目中（以下四种形式均须删除）：
  · B1【判断句式】：若某"若X则Y"/"当X时改用Y"/"超过X则判断为Y"出现在题目中 → 删除整句，只留原始参数
    错误示例："若壁面剪切率达到50 s⁻¹则认为解聚，改用幂律" → 删除，只给η₀和γc数值
  · B2【路径命名】：若题目同时命名了两条分支路径及其适用条件（如"聚集态用牛顿模型，解聚态用幂律"）→ 删除命名，只保留参数
  · B3【中间步骤操作方法外显】：若题目正文直接说明某中间步骤"应该怎么做"，而该操作本应由解题者从物理约束自行推导 → 删除操作说明，只保留使该操作成立的原始数据
    典型示例（必须删除）：
    - "按体积分数加权求体积平均OTR" → 删除，只给各区室体积分数和各自kLa
    - "对总干细胞量M建立方程" → 删除，只给补料分批总量守恒的边界条件
    - "局部氧传递推动力取C*" → 删除，只给kLa和C*数值
  · B4【数据用途说明】：若题目正文解释了某实验数据"用于做什么判断" → 删除用途说明，只呈现数据本身
    典型示例（必须删除）：
    - "在线HPLC数据用于判定CRP-cAMP回路状态" → 删除用途说明，只给HPLC浓度读数
    - "同一记录键下各模块数据已对齐" → 删除，只给各模块的原始时间戳和数值
自检C — 确认以上四类外显均已从题面清除，对应内容仅保留在 implicitConditions 字段中

【改动5：隐含前提注入规定（分叉点阈值不得出现在题目中）】：
implicitConditions 中的每一条，必须满足以下所有要求：
  1. 以"现象/数据/实验结果"形式暗藏于 questionText 背景叙述，做题者需自行推断
  2. 判断条件的触发阈值（如"50 s⁻¹""OUR/OTR比较结果""θ_on/θ_off"）不得直接出现在题目中
     · 可以给出计算该阈值所需的原始参数
     · 不可以给出"达到X则判断为Y"的完整判断语句
  3. 分叉点的两条路径及其对应条件均不得在题面中被命名或提示

【陷阱路径设计（先设计再写题）】：
在写题目正文之前，先设计 seductiveWrongPath 三个子字段：
- wrongApproach：应用标准教材方法直接推导时会走进的错误路径（一句话描述起点）
- divergenceStep：该错误路径在哪一步被哪个隐含约束反驳（格式："在第N步，因忽略了[约束X]，错误得到[结论Y]"）
- whySeductive：为什么推理模型容易走这条路（与标准方法/教材直觉的关联）
设计要求：错误路径必须从正确方法的同一起点分叉，且确实导向错误结论。
`}
${cascadeTrapBlock}${crossTypeBlock}
要求：背景真实（用真实模式生物）、数值准确、只问一个目标、referenceSteps≥8条。
输出语言：${language === 'zh-CN' ? '中文' : language}

直接输出以下 JSON，不含任何前缀文字、思考过程或说明，不含markdown代码块：
${outputSchema}`;

  const MAX_GEN_RETRIES = 2;
  let draft: BiologyV2Draft | undefined;
  let lastParseError: unknown;
  let semanticRetryHint = '';
  for (let attempt = 0; attempt <= MAX_GEN_RETRIES; attempt++) {
    const retryConstraint = attempt === 0
      ? ''
      : `\n\n【重试约束（第${attempt + 1}次，必须遵守）】：\n- 你上一次输出未满足生成阶段硬约束。\n- 本次严格压缩文本长度：questionText、referenceAnswer、referenceSteps 保留必要信息即可，避免冗长叙述。\n- 只输出 1 个完整 JSON 对象，最后一个字符必须是 }，禁止任何后缀说明。${semanticRetryHint}`;

    const promptForAttempt = prompt + retryConstraint;

    let raw: string;
    try {
      raw = (await callLLM(promptForAttempt, {
        model: 'reasoning',
        temperature: attempt === 0 ? 0.7 : 0.3,
        responseFormat: 'json',
      })).trim();
    } catch (apiErr) {
      lastParseError = apiErr;
      console.warn(
        `[BiologyV2 Generator] API 调用失败 (第 ${attempt + 1}/${MAX_GEN_RETRIES + 1} 次):`,
        apiErr,
      );
      if (attempt === MAX_GEN_RETRIES) throw apiErr;
      continue;
    }
    let parsed: BiologyV2Draft;
    try {
      parsed = cleanAndParseJSON(raw) as BiologyV2Draft;
    } catch (err) {
      // 兜底：让模型只做 JSON 语法修复，不改业务内容
      try {
        const repairedRaw = (await callLLM(
          `你是 JSON 修复器。请将下面内容修复为严格合法 JSON：\n` +
          `要求：\n` +
          `1) 只修复 JSON 语法（缺逗号、缺括号、引号转义、尾逗号、代码块包裹）\n` +
          `2) 不增删业务字段，不改动字段语义\n` +
          `3) 只输出 JSON 本体，不要任何解释\n\n` +
          `待修复内容：\n${raw}`,
          {
            model: 'default',
            temperature: 0,
            responseFormat: 'json',
            systemPrompt: '你是严格 JSON 语法修复器，只输出合法 JSON。',
          },
        )).trim();

        const repairedCleaned = cleanJsonString(repairedRaw);
        parsed = cleanAndParseJSON(repairedCleaned) as BiologyV2Draft;
        console.warn(`[BiologyV2 Generator] JSON 修复器生效 (第 ${attempt + 1}/${MAX_GEN_RETRIES + 1} 次)`);
      } catch (repairErr) {
        lastParseError = err;
        console.warn(
          `[BiologyV2 Generator] JSON 解析失败 (第 ${attempt + 1}/${MAX_GEN_RETRIES + 1} 次)，` +
          `响应长度=${raw.length}，原始响应前200字符: ${raw.slice(0, 200)}，末尾200字符: ${raw.slice(-200)}`,
          err,
        );
        console.warn(`[BiologyV2 Generator] JSON 修复器失败 (第 ${attempt + 1}/${MAX_GEN_RETRIES + 1} 次):`, repairErr);
        if (attempt === MAX_GEN_RETRIES) throw err;
        continue;
      }
    }
    if (!parsed.questionText || !parsed.referenceAnswer) {
      lastParseError = new Error('[BiologyV2 Generator] Incomplete draft: missing questionText or referenceAnswer');
      console.warn(
        `[BiologyV2 Generator] 响应字段不完整 (第 ${attempt + 1}/${MAX_GEN_RETRIES + 1} 次)，` +
        `questionText=${!!parsed.questionText}, referenceAnswer=${!!parsed.referenceAnswer}，` +
        `原始响应前300字符: ${raw.slice(0, 300)}`,
      );
      if (attempt === MAX_GEN_RETRIES) break;
      continue;
    }
    // Enforce stricter minimum reasoning depth for V2 drafts
    const minStepsRequired = 8;
    if (!parsed.referenceSteps || parsed.referenceSteps.length < minStepsRequired) {
      lastParseError = new Error(`[BiologyV2 Generator] referenceSteps too short (< ${minStepsRequired})`);
      console.warn(
        `[BiologyV2 Generator] referenceSteps 不足 (第 ${attempt + 1}/${MAX_GEN_RETRIES + 1} 次)，` +
        `需要至少 ${minStepsRequired} 步，当前步骤数=${parsed.referenceSteps?.length ?? 0}`,
      );
      if (attempt === MAX_GEN_RETRIES) break;
      continue;
    }

    // For calculation problems, require parameterDependencyTable to be present and non-empty
    if (parsed.problemType === 'calculation') {
      const pdt = (parsed as any).parameterDependencyTable;
      if (!pdt || Object.keys(pdt).length === 0) {
        lastParseError = new Error('[BiologyV2 Generator] missing parameterDependencyTable for calculation problem');
        semanticRetryHint = '';
        console.warn(
          `[BiologyV2 Generator] parameterDependencyTable 缺失 (第 ${attempt + 1}/${MAX_GEN_RETRIES + 1} 次)`
        );
        if (attempt === MAX_GEN_RETRIES) break;
        continue;
      }
    }

    if (cascadeEnabled) {
      const missingCascadeFields = getMissingCascadeTrapFields(parsed);
      if (missingCascadeFields.length > 0) {
        lastParseError = new Error(`[BiologyV2 Generator] incomplete cascadeTrap: ${missingCascadeFields.join(', ')}`);
        semanticRetryHint = buildCascadeTrapRetryHint(missingCascadeFields);
        console.warn(
          `[BiologyV2 Generator] cascadeTrap 字段缺失 (第 ${attempt + 1}/${MAX_GEN_RETRIES + 1} 次): ${missingCascadeFields.join('、')}`
        );
        if (attempt === MAX_GEN_RETRIES) break;
        continue;
      }
    }

    draft = parsed;
    break;
  }
  if (!draft) throw lastParseError;

  // 强制写入固定字段（防止 LLM 返回错误值或重复 ID）
  draft.problemId = `bio_v2_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  draft.problemType = problemType;
  draft.knowledgePoint = kpAnalysis.knowledgePoint;
  draft.chosenDimension = dimension;

  // 向后兼容：logicConditions 指向 explicitConditions，防止下游读旧字段失败
  (draft as any).logicConditions = draft.explicitConditions ?? {}; // @deprecated bridge
  draft.explicitConditions = draft.explicitConditions ?? {};
  draft.implicitConditions = draft.implicitConditions ?? {};
  if (problemType === 'calculation') {
    draft.parameterDependencyTable = draft.parameterDependencyTable ?? {};
  }

  return draft;
}
