import type { UserInput, TextbookConstraints, ReasoningType, BiologyProblemType } from '../../../types/multiNodeTypes';
import { getTextbookPromptConstraints } from '../../nodes/node1-rag';
import { resolveTopicGuidance } from './disciplines';
import { REASONING_CONSTRAINTS } from './generator';

/**
 * Research-grade 命题哲学前缀，供 v2 generator 注入到现有 prompt 开头。
 * 不替换 v2 的任何专有逻辑（cascade/crossType/schema 等）。
 */
export function getResearchPhilosophyPrefix(problemType: BiologyProblemType): string {
    const calculationPhilosophy = `【核心命题哲学——计算作为底层的定量校验工具】：
拒绝为了计算而计算的纯代数填空。本题的计算必须被设计为"揭示隐藏相变/拓扑分流的唯一透镜"：
1. 解题者绝不可能直接套用一个常规公式得出正确答案。
2. 计算出的定量结果，将作为"逻辑闸门开关"，决定系统究竟是滑向了"机制 A"还是"机制 B"。如果算错，后续的整个生物学响应链条将彻底溃败。`;

    const reasoningPhilosophy = `【核心命题哲学——机制欺骗与级联陷阱】：
本题必须设计一个"机制欺骗陷阱"：
1. 表面机制（诱饵）：题目呈现的初步线索必须强烈暗示某种经典的、常识性的生物学规律。
2. 深层机制（真相）：随着多步逻辑链的推进，隐藏的次级级联、空间阻抗或反馈环路突然被激活，导致系统在临界点发生"隐式相变"或"拓扑分流"，完全逆转表面机制的预测。
3. 杜绝无效噪音：所有实验观察条件必须完全符合真实前沿生命科学研究逻辑，数据与现象之间具有强烈的因果必然性。`;

    return problemType === 'calculation' ? calculationPhilosophy : reasoningPhilosophy;
}

export function buildResearchReasoningPrompt(
    input: UserInput,
    constraints: TextbookConstraints,
    disciplineGuidance: string,
    reasoningType: ReasoningType,
    problemNumber: number,
    problemType: BiologyProblemType,
    allowedAngles: string[] = [],
    usedAngles: string[] = []
): string {
    const allowedText = allowedAngles.length > 0
        ? `合法考法范围：${allowedAngles.join('、')}\n已用角度：${usedAngles.length > 0 ? usedAngles.join('、') : '无'}\n请选择一个尚未使用的角度出题；若所有角度已用，允许复用但必须更换更为颠覆性的微观情境。`
        : '请从该主题挖掘最深度的微观机理，避免重复常见套路。';

    return `你是一位享誉国际的学术期刊主编兼国家队生物学奥林匹克竞赛高级命题专家。请生成一道研究生及学术研究级（Research-grade）、逻辑极度严密的生物学机制推理题。

【核心命题哲学——机制欺骗与级联陷阱】：
普通的逻辑推理只是线性的黑白棋。本题必须设计一个"机制欺骗陷阱"：
1. 表面机制（诱饵）：题目呈现的初步线索必须极其强烈地暗示某种经典的、常识性的生物学规律（例如：没有电位变化就等于没有抑制；信号分子增加就等于下游激活）。
2. 深层机制（真相）：随着多步逻辑链的推进，隐藏的次级级联、空间阻抗、或者反馈环路突然被激活，导致系统在临界点发生"隐式相变"或"拓扑分流"，完全逆转或重塑了表面机制的预测。
3. 杜绝无效噪音：所有的实验观察条件必须完全符合真实的前沿生命科学研究逻辑，数据与现象之间具有强烈的因果必然性。

【题型角度规则（严格执行）】：
${allowedText}

【主题】：${input.topic}
【推理类型】：${problemType}
【难度阶梯约束】：竞赛/研究生级（必须包含 ≥5 个交织的实验逻辑条件，推断路径 ≥8 步。必须包含至少 2 个极具诱惑力的"状态伪迹"或常规直觉干扰项，迫使解题者通过对底层物理化学边界的校验来排除错误假设）。

${getTextbookPromptConstraints(constraints)}

【学科高阶机理框架】：
${disciplineGuidance}

${REASONING_CONSTRAINTS[reasoningType]}

【输出要求】：
请返回一个标准的、无任何多余解释的纯 JSON 对象，包含以下字段：
{
  "problemId": "base_${problemNumber}_${Date.now()}",
  "questionAngle": "本题核心考法关键词（2-5个字，如：分流抑制、双稳态窗口）",
  "topic": "${input.topic}",
  "problemType": "${problemType}",
  "scenario": "真实前沿实验背景或病理/育种突变体筛选场景描述（1-2句话）",
  "questionBody": "完整题目描述（250-400字）。需包含多组突变体对照、特异性抑制剂干扰或时空分辨率下的观测表型。不要直接给出底层结论，最后以\\"请结合上述多级响应机理，推断：\\"结尾引出唯一的终点问题。",
  "logicConditions": {
    "实验现象/表型条件A": "详细的定性/定量观测描述，作为多步演绎的基石",
    "实验现象/表型条件B": "与条件A具有非线性因果互证关系的描述",
    "隐式边界条件C": "触发机制转变、饱和效应或构象翻转的分子/环境约束条件"
  },
  "givenData": {},
  "requiredAnswer": "需要推断的唯一核心分子机制、拓扑流向或表型命运（单终点，结论必须具有排他的唯一性）",
  "solutionPath": [
    "步骤1：识别表面机制的伪迹，基于条件X指出其在物理/化学底层的不可行性。",
    "步骤2：利用条件Y，破译多级级联网络中的隐藏关键节点（如阻抗错配或变构激活）。",
    "步骤3：锁定系统跨越θ阈值或相变点后的真实非线性拓扑流向。",
    "步骤4：排除干扰项，完成全链条闭环演绎。",
    "步骤5：得出最终的唯一排他性结论。"
  ],
  "expectedDifficulty": 9.5
}

【格式死命令】：
1. logicConditions 必须包含至少 3 个高含金量的独立条件，且条件间在高级物理生物学层面上完美相容。
2. questionBody 的结尾必须形如：\\"......请结合上述多级响应机理，推断：[具体的单终点问题]\\"。
3. 严禁包含任何模糊不清、模棱两可的文学式描述，所有措辞必须符合 Nature/Science/Cell 级别的严谨学术范式。`;
}

export function buildResearchCalculationPrompt(
    input: UserInput,
    constraints: TextbookConstraints,
    disciplineGuidance: string,
    reasoningType: ReasoningType,
    problemNumber: number,
    allowedAngles: string[] = [],
    usedAngles: string[] = []
): string {
    const allowedText = allowedAngles.length > 0
        ? `合法考法范围：${allowedAngles.join('、')}\n已用角度：${usedAngles.length > 0 ? usedAngles.join('、') : '无'}\n请选择一个尚未使用的角度出题；若所有角度已用，允许更换数值矩阵并融入更高阶的热力学/动力学修正项（如Kosambi修正、GHK电流整流、Onsager不确定性）。`
        : '请挖掘该主题下最具颠覆性、反直觉的定量物理化学机制。';

    return `你是一位享誉国际的定量生物学（Quantitative Biology）命题专家。请生成一道工业级、研究生及顶级竞赛水准的生物学定量计算题。

【核心命题哲学——计算作为底层的定量校验工具】：
拒绝为了计算而计算的纯代数填空。本题的计算必须被设计为"揭示隐藏相变/拓扑分流的唯一透镜"：
1. 解题者绝不可能直接套用一个常规公式（如直接带入米氏方程或哈温平衡）得出正确答案。
2. 题目必须提供一系列底层的常数和状态参数。解题者必须先进行多级级联的物料/能量/热力学衡算（如利用一维空间衰减、玻尔兹曼分布或非平衡态非线性偶联）。
3. 计算出的定量结果，将作为"逻辑闸门开关"，决定系统究竟是滑向了"机制 A"还是"机制 B"。如果算错，后续的整个生物学响应链条和命运拨叉将彻底溃败。

【题型角度规则（严格执行）】：
${allowedText}

【主题】：${input.topic}
【是否允许查表】：${(input as any).allowTableLookup ? '是' : '否'}

${getTextbookPromptConstraints(constraints)}

【学科高阶定量框架】：
${disciplineGuidance}

${REASONING_CONSTRAINTS[reasoningType]}

【推理与算力双重跨越】：
推理与计算交织路径必须 ≥8 步。解题者必须在计算过程中识别出限速动力学步骤、空间阻抗衰减边界、或多组分竞争下的非线性饱和态（如利用Hill方程的微分形式或高阶分叉方程）。

【输出要求】：
请返回一个标准的、无任何多余解释的纯 JSON 对象，包含以下字段：
{
  "problemId": "base_${problemNumber}_${Date.now()}",
  "questionAngle": "本题核心定量考法（2-5个字，如：电缆整流、熵弹性极限）",
  "topic": "${input.topic}",
  "problemType": "calculation",
  "scenario": "高度真实的定量生物学实验、超分辨显微成像、质谱色谱流路、或电生理钳制定量场景（1-2句话）",
  "questionBody": "完整题目描述（300-450字，数据必须经过热力学/质量守恒精算，保证真实、无自相矛盾）。题干需嵌入所有必需的微观物理常数或经验映射系数。末尾只能有一个明确的、且必须依赖前述复杂计算才能锁定的求解目标。",
  "givenData": {
    "核心控制参数/常数1": {"value": 0.0, "unit": "单位"},
    "竞争性抑制/衰减常数2": {"value": 0.0, "unit": "单位"},
    "环境/自由能边界参数3": {"value": 0.0, "unit": "单位"}
  },
  "logicConditions": {},
  "requiredAnswer": "求解目标（必须注明最终结果保留的有效数字位数或精确代数表达式）",
  "solutionPath": [
    "步骤1：对题干给出的初始微观状态进行热力学/动力学边界核算。",
    "步骤2：利用基础公式（如电缆方程/玻尔兹曼分布），解出空间/时间维度的非线性衰减或概率分布。",
    "步骤3：将第一步的计算结果代入级联矩阵，判定系统当前越过了哪一个隐藏的临界阈值 θ。",
    "步骤4：执行核心的旁路分流物料平衡或能量对账计算（如多酶抑制下的表观 Km 变动）。",
    "步骤5：进行动力学高阶修正或竞争性物理消除。",
    "步骤6：代数合并，消除中间伪迹参数。",
    "步骤7：完成最终边界/口径复核，排除会改变结果的错误路径。",
    "步骤8：得出最终满足有效数字精度要求的唯一量化结果。"
  ],
  "expectedDifficulty": 9.8
}

【关键致命规则（严防AI作弊）】：
1. 绝对禁止生成"已知 A 和 B，代入公式求 C"的弱智题目。
2. 数据范围和单位必须严格对齐。如果涉及常数（如 R, k_B, F），必须在 givenData 中给出绝对精确的值。
3. 单终点约束：题干末尾只能有一个明确的求解目标，拒绝"并问"或"多阶段提问"。`;
}
