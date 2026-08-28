import { callLLM, getCurrentProvider, getOneApiModel } from '../../../llmClient';
import { cleanAndParseJSON } from '../../../utils/jsonCleaner';
import type { BiologyProblemType, ReasoningType } from '../../../../types/multiNodeTypes';

/** conservation/probability/equilibrium 类学科计算路径天然深厚，强制 ≥2 个 calculation 维度 */
const STRONG_CALC_TYPES = new Set<ReasoningType>(['conservation', 'probability', 'equilibrium']);

/**
 * Biology V2 Node A0: Knowledge Point Analyzer
 *
 * 给定知识点名称，输出竞赛/研究生级别的子考察维度，
 * 并为每个维度标注推荐的题型（5种生物题型之一），
 * 避免老套模板题角度。
 *
 * 对标化学 kp-analyzer，但维度示例完全替换为生物推理模式：
 * - 遗传推理分叉（显隐性判断、伴性 vs 常染色体）
 * - 网络双重否定（A--|B--|C → A 激活 C）
 * - 阈值迟滞（激活阈值 ≠ 去激活阈值）
 * - 结构约束（碱基互补 / 氨基酸电荷 / 空间位阻）
 * - 守恒计量（代谢通量、ATP 收支、林德曼效率链）
 */

export interface BiologyKPAnalysisResult {
  knowledgePoint: string;
  /** 融合题模式：单学科融合、跨领域融合或非融合 */
  fusionMode?: 'single-discipline' | 'cross-domain' | 'none';
  /** 融合题主学科提示（按主解题框架，而非第一个 KP） */
  primaryDisciplineHint?: string;
  /** 融合依赖链：说明各 KP 如何串成同一推理链 */
  dependencyChain?: string[];
  /** 删除测试：删除任一 KP 后为何无法唯一求解 */
  removalTest?: Record<string, string>;
  /** 当前知识点在指定学科方向下是否不适合自然出题；true 时 Orchestrator 会跳过该候选方向 */
  unsupported?: boolean;
  /** unsupported=true 时，说明为什么该学科方向下会牵强 */
  unsupportedReason?: string;
  /** 3-5 个具体子考察维度，每个注明推荐题型 */
  testDimensions: {
    dimension: string;        // 考察维度描述（≤30字）
    problemType: BiologyProblemType;  // 推荐题型（跨型题填外壳题型）
    reasoningHint: string;    // 推理路径提示（1句话）
    /** 用于能力边界规则匹配的可选标签；旧版 A0 输出可不含这些字段。 */
    conceptTags?: string[];
    reasoningTags?: string[];
    signalTags?: string[];
    failureModeTags?: string[];
    /**
     * 跨题型伪装：题目外观为 shellType，真实解题核心为 coreType。
     * 仅在该维度为跨型设计时存在，其余维度不含此字段。
     */
    crossType?: {
      shellType: BiologyProblemType;  // 外壳题型（题目表面形式）
      coreType: BiologyProblemType;   // 核心推理题型（解题必须用到的推理范式）
    };
  }[];
  /** 2-3 个已烂大街的老套角度，必须避开 */
  coreConceptsToAvoid: string[];
  /** 难度定位：说明前置知识、判断分叉、易错点 */
  suggestedDifficulty: string;
}

export async function analyzeKnowledgePoint(
  knowledgePointName: string,
  disciplineReasoningType?: ReasoningType,
  /** 为 true 时，要求维度设计向生物学其他领域的自然交叉倾斜（用于无法融合的孤立 KP） */
  crossDomainHint?: boolean,
  /** 当前候选学科方向；用于判断该知识点在该方向下是否自然可出题 */
  disciplineName?: string,
): Promise<BiologyKPAnalysisResult> {
  const isStrongCalc = !disciplineReasoningType || STRONG_CALC_TYPES.has(disciplineReasoningType);

  const calcRequirement = isStrongCalc
    ? `**硬性要求：其中至少 2 个维度的 problemType 必须是 calculation（定量计算）**，
   不要因为该知识点"看起来是推理类"就全部填推理——生物中凡涉及通量、概率、种群、能量、基因频率的场景均可设计成计算题。`
    : `**当前学科以定性推理为主（${disciplineReasoningType} 范式）—— calculation 维度须满足深度门槛**：
   只有在确实存在需要定量推导（如结合常数、离子浓度梯度、信号分子阈值、概率统计等）而非单纯概念判断的场景时，才设计 calculation 维度。
   若知识点有 1-2 个深度计算角度，必须加入；若强行凑数只会产生无判断分叉、无隐含约束的浅层代入题，则不要加，以高质量推理维度为主。`;

  const crossDomainBlock = crossDomainHint
    ? `\n【跨领域交叉要求】：本知识点将单独出题，但题目应优先选择与生物学其他领域（如分子机制、生态系统、遗传调控、细胞信号等）存在自然交叉的考察角度，避免纯孤立考察单一概念。每个维度至少涉及 2 个生物学子领域的知识交叉。\n`
    : '';

  const disciplineFeasibilityBlock = disciplineName
    ? `\n【当前候选学科方向】：${disciplineName}\n【方向可行性判定（最高优先级）】：\n- 你必须先判断知识点「${knowledgePointName}」在“${disciplineName}”方向下是否存在自然、闭合、非牵强的竞赛/研究生级出题考点。\n- “自然可出题”必须满足：题目核心解法确实使用该学科的主模型/实验数据/错误陷阱，而不是只在背景里顺带提到该学科。\n- 如果该方向下只能硬凑、只靠名词拼接、无法形成唯一闭合推理链，请返回 unsupported=true，testDimensions 返回空数组，并用 unsupportedReason 一句话说明。\n- 如果可出题，请返回 unsupported=false，并且所有 testDimensions 都必须体现“${disciplineName}”的实际考点。\n`
    : '';

  const prompt = `你是生物学竞赛命题专家。知识点：「${knowledgePointName}」
${disciplineFeasibilityBlock}${crossDomainBlock}
任务：为出题做前期规划，列出该知识点下竞赛/研究生水平的考察维度。

要求：
1. 列出 3-5 个具体的子考察维度，每个维度必须明确"考什么推理/计算/判断"，不能只写知识名称
   ${calcRequirement}
   各类维度示例（只引导方向，按实际知识点生成，禁止照抄）：
   * calculation 类："三营养级食物网中，已知初级净产量和林德曼效率范围，计算顶级消费者最大种群密度"
   * calculation 类："已知亲本基因型和显性个体占比，利用 HW 定律计算下一代等位基因频率"
   * calculation 类："联立底物水平磷酸化与氧化磷酸化，计算一个葡萄糖彻底氧化的实际 ATP 净产量"
   * genetic-reasoning 类："给定 F2 表现型比例 9:3:4，推断互补基因互作机制，区分互补与上位效应"
   * network-reasoning 类："三层调控链 A--|B--|C--|D，判断 A 激活后 D 的最终变化方向（注意双重否定）"
   * threshold-reasoning 类："动作电位不应期内给予超阈值刺激，判断是否能触发新动作电位及原因"
   * structural-reasoning 类："点突变使活性位点第 47 位 Lys→Glu，推断 Km 和 Vmax 变化并说明机制"
   差的示例："光合作用" / "孟德尔遗传定律" / "神经传导"（太泛）

   【跨题型伪装维度（可选，每批 3-5 题中设计 1 个）】：
   题目外观模仿一种题型（shellType），但关键推理依赖另一种题型的核心机制（coreType）才能得出正确结论。
   设计原则：按 shellType 的标准方法直接推导，会在某关键节点因缺少 coreType 的推理而得错误答案。
   若设计跨型维度，problemType 填外壳题型（shellType），并在 crossType 字段补充两种类型。
   典型跨型组合示例：
   - calculation 外壳 + threshold-reasoning 核心：数值参数齐全但系统有迟滞，必须先用阈值逻辑判断系统历史状态，才能确定走哪条计算分支（直接计算会选错方程）
   - network-reasoning 外壳 + calculation 核心：看起来追踪信号路径，但某节点激活与否取决于两路定量信号之和是否过阈，不作数值比较无法确定结论
   - genetic-reasoning 外壳 + network-reasoning 核心：表面是遗传比例推断，实则某基因型的致死/存活由底层调控网络逻辑门决定（AND门要求双基因型共存才能存活）

2. 每个维度必须满足：
   - 需要至少 2 个知识点交叉才能解决
   - 解题过程中必须有判断分叉（先判断某条件，再走不同路径），不能一路直线推导
   - 学生需自行识别至少一个隐含约束（不是从题目直接读出所有条件）
   - 【约束闭合前提】有且仅有一个核心矛盾（一个需要学生解释的"反直觉现象"），不强行耦合两个独立科研结论
   - 【深度上界】推理路径的核心决策点 ≤3 个；禁止提出"多时间尺度 + 多状态机 + 多反馈环"同时耦合的维度

3. 每个维度标注推荐题型（从以下5种选一）：
   - calculation（定量计算）
   - genetic-reasoning（遗传推理）
   - network-reasoning（调控网络推理）
   - threshold-reasoning（阈值逻辑推理）
   - structural-reasoning（结构约束推理）

4. 列出 2-3 个该知识点"出烂了"的老套角度，必须明确避开

5. 给出难度定位：说明解题需要哪些前置知识、判断分叉在哪里、最容易在哪步犯错

输出必须是严格 JSON，不含 markdown 代码块：
{
  "knowledgePoint": "${knowledgePointName}",
  "unsupported": false,
  "unsupportedReason": "",
  "testDimensions": [
    {
      "dimension": "维度描述（≤30字）",
      "problemType": "题型（跨型题填外壳题型）",
      "reasoningHint": "推理路径提示（1句话）"
    },
    {
      "dimension": "（跨型维度示例）",
      "problemType": "calculation",
      "reasoningHint": "（提示句）",
      "crossType": {"shellType": "calculation", "coreType": "threshold-reasoning"}
    }
  ],
  "coreConceptsToAvoid": ["避开1", "避开2"],
  "suggestedDifficulty": "难度定位描述"
}

若该知识点在当前候选学科方向下不自然、不可闭合或会牵强硬凑，则必须返回：
{
  "knowledgePoint": "${knowledgePointName}",
  "unsupported": true,
  "unsupportedReason": "一句话说明为什么该学科方向下不适合自然出题",
  "testDimensions": [],
  "coreConceptsToAvoid": [],
  "suggestedDifficulty": "不建议在该学科方向下出题"
}`;

  // Kimi/MiniMax/GLM 有严格限流，A0 改走轻量模型，为生题保留 quota
  const currentModel = getOneApiModel().toLowerCase();
  const isRateLimited = getCurrentProvider() === 'oneapi' &&
    (currentModel.includes('kimi') || currentModel.includes('minimax') || currentModel.includes('glm'));
  const a0Model = isRateLimited ? 'deepseek-chat' : 'reasoning';

  const raw = (await callLLM(prompt, { model: a0Model, temperature: 0.6 })).trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      knowledgePoint: knowledgePointName,
      testDimensions: [
        {
          dimension: knowledgePointName + '核心推理',
          problemType: 'calculation',
          reasoningHint: '从基础概念出发逐步推导',
        },
      ],
      coreConceptsToAvoid: [],
      suggestedDifficulty: '竞赛/研究生级别',
    };
  }
  try {
    const parsed = cleanAndParseJSON(jsonMatch[0]) as BiologyKPAnalysisResult;
    if (parsed.unsupported || !parsed.testDimensions || parsed.testDimensions.length === 0) {
      return {
        knowledgePoint: parsed.knowledgePoint ?? knowledgePointName,
        unsupported: true,
        unsupportedReason: parsed.unsupportedReason || '该知识点在当前候选学科方向下缺少自然闭合的出题考点',
        testDimensions: [],
        coreConceptsToAvoid: [],
        suggestedDifficulty: parsed.suggestedDifficulty || '不建议在该学科方向下出题',
      };
    }
    return { ...parsed, unsupported: false };
  } catch {
    return {
      knowledgePoint: knowledgePointName,
      testDimensions: [
        {
          dimension: knowledgePointName + '核心推理',
          problemType: 'calculation',
          reasoningHint: '从基础概念出发逐步推导',
        },
      ],
      coreConceptsToAvoid: [],
      suggestedDifficulty: '竞赛/研究生级别',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 多 KP 分组：判断哪些 KP 可以融合、哪些需要单独出题
// ─────────────────────────────────────────────────────────────────────────────

export interface KPGroupingResult {
  /** 可以融合出题的 KP 列表（≥2 个且存在自然生物学交叉；若无法融合则为空数组） */
  fusionGroup: string[];
  /** 无法融入融合组、需要单独出题的 KP 列表 */
  soloKPs: string[];
  /** 融合模式：单一学科内融合、跨领域融合或无法融合 */
  fusionMode?: 'single-discipline' | 'cross-domain' | 'none';
  /** 融合题主学科方向：必须按主解题框架判断，而非默认第一个 KP */
  primaryDisciplineHint?: string;
  /** 融合依赖链：每个 KP 如何在同一推理链上贡献约束/数据/模型 */
  dependencyChain?: string[];
  /** 删除测试：删除任一 fusionGroup 中 KP 后，为何答案不唯一或无法推导 */
  removalTest?: Record<string, string>;
  /** LLM 对分组理由的简短说明 */
  reasoning: string;
}

function normalizeKPNameForGrouping(name: string): string {
  return name
    .replace(/[`$]/g, '')
    .replace(/\\[()[\]]/g, '')
    .replace(/[＋]/g, '+')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function canonicalizeKPGroup(names: string[] | undefined, kpNames: string[]): string[] {
  const exact = new Set(kpNames);
  const normalizedToOriginal = new Map(kpNames.map(k => [normalizeKPNameForGrouping(k), k]));
  const seen = new Set<string>();
  const result: string[] = [];

  for (const name of names ?? []) {
    const canonical = exact.has(name)
      ? name
      : normalizedToOriginal.get(normalizeKPNameForGrouping(name));
    if (!canonical || seen.has(canonical)) continue;
    seen.add(canonical);
    result.push(canonical);
  }

  return result;
}

/**
 * 一次 LLM 调用，判断多个 KP 的融合可行性并分组。
 * - fusionGroup ≥2：这些 KP 后续走 analyzeFusionKnowledgePoints
 * - soloKPs：无法融入的 KP，后续走 analyzeKnowledgePoint（crossDomainHint=true）
 */
export async function classifyAndGroupKPs(
  kpNames: string[],
): Promise<KPGroupingResult> {
  // 单个 KP 直接返回，不需要分组
  if (kpNames.length <= 1) {
    return {
      fusionGroup: [],
      soloKPs: kpNames,
      fusionMode: 'none',
      primaryDisciplineHint: '',
      dependencyChain: [],
      removalTest: {},
      reasoning: '只有一个知识点，无需分组',
    };
  }

  const kpList = kpNames.map((k, i) => `  ${i + 1}. ${k}`).join('\n');

  const prompt = `你是生物学竞赛命题专家。给定以下知识点列表：
${kpList}

任务：判断哪些知识点之间存在自然的生物学交叉，可以融合出一道题；哪些知识点与其他 KP 无自然交叉，需要单独出题。

【允许交叉领域融合，但必须满足（最高优先级）】：
- 至少两个知识点在同一条推理链上互相依赖，而不是题干背景并列出现
- 任意删除 fusionGroup 中一个知识点，答案都不再唯一或无法推导
- 如果融合跨越多个生物学子领域，必须给出 primaryDisciplineHint：按“主解题框架/核心模型/关键实验数据”归类，而不是按第一个 KP 归类
- fusionMode 填 single-discipline（同一学科内融合）、cross-domain（跨领域融合）或 none（无法融合）
- 必须输出 dependencyChain 和 removalTest 来证明不是硬凑

【可融合的判断标准】：
- 两个 KP 在同一生物学过程或系统中同时发挥作用，缺少任何一个的知识就无法完成核心推导
- 融合后题目有一条连贯推理主线，各 KP 在链上不同节点各自贡献约束或计算
- 示例（可融合）："酶动力学 + 代谢通量"——酶的 Km/Vmax 直接决定通量分配比
- 示例（可融合）："遗传图距 + Hardy-Weinberg 定律"——重组率影响等位基因频率计算
- 示例（可融合）："信号网络抑制 + 阈值迟滞"——信号强度决定系统是否越过阈值并维持新状态

【不可融合的判断标准】：
- 两个 KP 属于完全不同的生物学层次，强行组合只能靠背景提及而非推理依赖
- 示例（不可融合）："神经动作电位阈值 + 林德曼生态效率"——电生理与生态能流无自然交叉
- 示例（不可融合）："DNA 复制保真度 + 种群 logistic 增长"——分子机制与种群动力学无交叉

输出规则：
- fusionGroup：所有可以互相融合的 KP（若全部可融合则全部列入；若只有部分子集可融合则只列该子集）
- soloKPs：无法融入 fusionGroup 的剩余 KP
- fusionGroup 和 soloKPs 中的 KP 名称必须逐字复制输入列表，不得改写、合并、补全、规范化、删除 LaTeX 符号或改变空格
- 不要把公式内部的 +、-、=、逗号或括号当作知识点边界；例如 "$Lk = Tw + Wr$ 方程" 是一个完整 KP 名称
- 若所有 KP 都无法融合，fusionGroup 为空数组，fusionMode 填 "none"
- 若 fusionGroup 非空，dependencyChain 至少 ${Math.min(2, kpNames.length)} 条，removalTest 必须覆盖 fusionGroup 中每个 KP
- primaryDisciplineHint 必须是具体生物学方向名称，如 "生物物理学"、"结构生物学"、"遗传学"、"生物工程学"；不可只写 "生物学"

输出必须是严格 JSON，不含 markdown 代码块：
{
  "fusionGroup": ["KP名称1", "KP名称2"],
  "soloKPs": ["KP名称3"],
  "fusionMode": "cross-domain",
  "primaryDisciplineHint": "主学科方向",
  "dependencyChain": ["KP1提供什么约束/数据/模型 → KP2如何使用它"],
  "removalTest": {"KP名称1": "删除后为何无法唯一推导", "KP名称2": "删除后为何无法唯一推导"},
  "reasoning": "一句话说明分组理由"
}`;

  const currentModel = getOneApiModel().toLowerCase();
  const isRateLimited = getCurrentProvider() === 'oneapi' &&
    (currentModel.includes('kimi') || currentModel.includes('minimax') || currentModel.includes('glm'));
  const a0Model = isRateLimited ? 'deepseek-chat' : 'reasoning';

  const raw = (await callLLM(prompt, { model: a0Model, temperature: 0.3 })).trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const fallback: KPGroupingResult = {
    fusionGroup: [],
    soloKPs: kpNames,
    fusionMode: 'none',
    primaryDisciplineHint: '',
    dependencyChain: [],
    removalTest: {},
    reasoning: '分组分析失败，退回各自独立出题',
  };
  if (!jsonMatch) return fallback;
  try {
    const parsed = cleanAndParseJSON(jsonMatch[0]) as KPGroupingResult;
    const fusionGroup = canonicalizeKPGroup(parsed.fusionGroup, kpNames);
    const fusionSet = new Set(fusionGroup);
    const soloKPs = canonicalizeKPGroup(parsed.soloKPs, kpNames)
      .filter(k => !fusionSet.has(k));
    // 校验：所有输入 KP 必须出现在某个组，防止 LLM 遗漏；若 LLM 改写 KP，则尽量映射回原始输入。
    const covered = new Set([...fusionGroup, ...soloKPs]);
    const missing = kpNames.filter(k => !covered.has(k));
    parsed.fusionGroup = fusionGroup;
    parsed.soloKPs = [...soloKPs, ...missing];
    // fusionGroup 少于 2 个无意义，降级为全部单独出题
    if (!parsed.fusionGroup || parsed.fusionGroup.length < 2) {
      return {
        fusionGroup: [],
        soloKPs: kpNames,
        fusionMode: 'none',
        primaryDisciplineHint: '',
        dependencyChain: [],
        removalTest: {},
        reasoning: parsed.reasoning ?? '无可融合组合',
      };
    }
    // 结构化依赖证明不足时，降级为各自独立，避免硬凑融合题
    const removalKeys = Object.keys(parsed.removalTest ?? {});
    const hasRemovalForAll = parsed.fusionGroup.every(k => removalKeys.includes(k));
    if (!parsed.dependencyChain || parsed.dependencyChain.length === 0 || !hasRemovalForAll) {
      return {
        fusionGroup: [],
        soloKPs: kpNames,
        fusionMode: 'none',
        primaryDisciplineHint: '',
        dependencyChain: parsed.dependencyChain ?? [],
        removalTest: parsed.removalTest ?? {},
        reasoning: `融合依赖证明不足，降级为独立出题。${parsed.reasoning ?? ''}`,
      };
    }
    return {
      ...parsed,
      fusionMode: parsed.fusionMode ?? 'single-discipline',
      primaryDisciplineHint: parsed.primaryDisciplineHint ?? '',
      dependencyChain: parsed.dependencyChain ?? [],
      removalTest: parsed.removalTest ?? {},
    };
  } catch {
    return fallback;
  }
}

/**
 * 多知识点融合分析：每个维度必须同时考察 fusionGroup 中的所有 KP，
 * 缺少任何一个 KP 的知识都无法完成推导。
 */
export async function analyzeFusionKnowledgePoints(
  kpNames: string[],
  disciplineReasoningType?: ReasoningType,
  /** 融合题主学科方向，来自 classifyAndGroupKPs.primaryDisciplineHint */
  primaryDisciplineHint?: string,
  /** 分组阶段给出的结构化融合证据 */
  groupingEvidence?: Pick<KPGroupingResult, 'fusionMode' | 'dependencyChain' | 'removalTest' | 'reasoning'>,
): Promise<BiologyKPAnalysisResult> {
  const fusionLabel = kpNames.join(' × ');
  const kpList = kpNames.map((k, i) => `  ${i + 1}. ${k}`).join('\n');
  const isStrongCalc = !disciplineReasoningType || STRONG_CALC_TYPES.has(disciplineReasoningType);

  const calcRequirement = isStrongCalc
    ? `**硬性要求：其中至少 2 个维度的 problemType 必须是 calculation**`
    : `**calculation 维度须满足深度门槛，只在确实需要定量推导时设计**`;

  const fusionEvidenceBlock = groupingEvidence
    ? `\n【分组阶段融合证据（必须继承，不得推翻）】：\n- 融合模式：${groupingEvidence.fusionMode ?? 'single-discipline'}\n- 主学科方向：${primaryDisciplineHint || '未指定'}\n- 依赖链：${(groupingEvidence.dependencyChain ?? []).join('；') || '无'}\n- 删除测试：${JSON.stringify(groupingEvidence.removalTest ?? {})}\n- 分组理由：${groupingEvidence.reasoning ?? ''}\n`
    : '';

  const prompt = `你是生物学竞赛命题专家。需要融合以下 ${kpNames.length} 个知识点出题：
${kpList}
${fusionEvidenceBlock}
任务：规划 3-5 个融合考察维度，每个维度必须同时用到上述全部知识点。

【融合要求（最高优先级，违反则维度无效）】：
- 每个知识点都必须是解题路径中不可跳过的推理节点
- 缺少任何一个知识点的知识，无法得出正确答案
- 禁止"以知识点A为背景顺带提到知识点B"——必须是真正的推理依赖
- 允许跨领域融合，但必须围绕一个主解题框架闭合；主学科方向为：${primaryDisciplineHint || '按主解题框架自行判断'}
- 每个维度都要体现 dependencyChain 中的依赖关系，并能通过 removalTest：删除任一 KP 后不可唯一求解
- 合法融合举例：KP-A 的计算结果作为 KP-B 的输入参数；KP-A 的约束条件限制 KP-B 的适用范围；KP-A 的推理分叉由 KP-B 的机制决定走向

${calcRequirement}

每个维度必须满足：解题有判断分叉；至少一个隐含约束需学生自行推断；有且仅有一个核心矛盾；核心决策点 ≤3 个。

每个维度标注推荐题型（calculation / genetic-reasoning / network-reasoning / threshold-reasoning / structural-reasoning）

输出必须是严格 JSON，不含 markdown 代码块：
{
  "knowledgePoint": "${fusionLabel}",
  "fusionMode": "${groupingEvidence?.fusionMode ?? 'single-discipline'}",
  "primaryDisciplineHint": "${primaryDisciplineHint ?? ''}",
  "dependencyChain": ${JSON.stringify(groupingEvidence?.dependencyChain ?? [])},
  "removalTest": ${JSON.stringify(groupingEvidence?.removalTest ?? {})},
  "testDimensions": [
    {
      "dimension": "融合维度描述（≤40字，须体现所有知识点的交叉）",
      "problemType": "题型",
      "reasoningHint": "推理路径提示（说明各知识点如何串联）"
    }
  ],
  "coreConceptsToAvoid": ["避开的老套角度1", "避开的老套角度2"],
  "suggestedDifficulty": "难度定位（说明各知识点交叉处的判断分叉和易错点）"
}`;

  const currentModel = getOneApiModel().toLowerCase();
  const isRateLimited = getCurrentProvider() === 'oneapi' &&
    (currentModel.includes('kimi') || currentModel.includes('minimax') || currentModel.includes('glm'));
  const a0Model = isRateLimited ? 'deepseek-chat' : 'reasoning';

  const raw = (await callLLM(prompt, { model: a0Model, temperature: 0.6 })).trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const fallback: BiologyKPAnalysisResult = {
    knowledgePoint: fusionLabel,
    testDimensions: [{ dimension: fusionLabel + '融合推理', problemType: 'calculation', reasoningHint: '联立各知识点逐步推导' }],
    coreConceptsToAvoid: [],
    suggestedDifficulty: '竞赛/研究生级别',
  };
  if (!jsonMatch) return fallback;
  try {
    return cleanAndParseJSON(jsonMatch[0]) as BiologyKPAnalysisResult;
  } catch {
    return fallback;
  }
}
