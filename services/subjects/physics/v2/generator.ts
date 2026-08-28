import { callLLM } from "../../../llmClient";
import { callLLMTracked } from "../costTracker";
import type { KPAnalysisResult } from "./kp-analyzer";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { getV2Strategies, getV2Constraints } from "../disciplines";

/**
 * V2 Node A1: Question Generator
 *
 * Given KP analysis result + selected dimension,
 * generates a competition-level question WITH a reference answer in one call.
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

export async function generateQuestionWithAnswer(
    kpAnalysis: KPAnalysisResult,
    dimensionIndex: number,
    language: string = 'zh-CN',
    singleQuestion: boolean = false,
    problemIndex?: number
): Promise<V2QuestionDraft> {
    const dimension = kpAnalysis.testDimensions[dimensionIndex % kpAnalysis.testDimensions.length];
    const avoidList = kpAnalysis.coreConceptsToAvoid.join("、");

    // 难度规格：读取 A0 产出的 difficultySpec，缺省兜底。
    // ⚠️ 回退旋钮：调低下列默认值即可近似退回原难度，无需回滚代码。
    const spec = kpAnalysis.difficultySpec ?? { minReasoningActs: 6, minConceptsFused: 3, minBranchPoints: 2, minTrapPaths: 1 };
    const minReasoningActs = spec.minReasoningActs ?? 6;
    const minConceptsFused = spec.minConceptsFused ?? 3;
    const minBranchPoints = spec.minBranchPoints ?? 2;
    const minTrapPaths = spec.minTrapPaths ?? 1;
    const minIndistinguishablePairs = spec.minIndistinguishablePairs ?? 1;

    const singleQuestionConstraint = singleQuestion
        ? `⚠️ 【强制单问】：题目必须只有一个问题，只有一个求解目标。绝对禁止出现 (1)(2)(3) 等多小问、多子任务的形式。整道题从头到尾只问一件事。\n`
        : '';

    const disciplineStrategies = getV2Strategies(kpAnalysis.knowledgePoint, 3);
    const disciplineConstraints = getV2Constraints(kpAnalysis.knowledgePoint);

    const prompt = `你是物理竞赛命题专家。请根据以下规划出一道高质量竞赛题，并给出详细参考答案。

【知识点】：${kpAnalysis.knowledgePoint}
【本题考察维度】：${dimension}
【难度定位】：${kpAnalysis.suggestedDifficulty}
【必须避开的老套角度】：${avoidList || "无"}

【出题要求】：
${singleQuestionConstraint}1. 题目必须清晰明确，条件充分且必要，有唯一正确解
2. 嵌入真实科研/工程背景（不要说"某物理实验室"这种模糊背景；禁止照搬教材例题场景）
3. 所有数值、单位、物理常数必须准确无误
4. 禁止"已知A和B，求C"的直接代入型结构——题目必须有真正的推理过程，而非查表后代入
5. 禁止篡改基础物理常数（N_A、R、k_B、c、ε₀、μ₀ 等）
6. 物理条件必须自洽（等温/等压/等容/绝热、守恒律不能矛盾）
7. 【概念深度-强制】题目必须融合 ≥${minConceptsFused} 个不同知识点（跨子领域为佳），解题不能只依赖单一知识点的公式链
8. 【难度定位-强制】题目的难点必须落在"思维推理"（建模、判断、识别陷阱）而非"计算量"上；允许最终答案为符号表达式、数量级或定性结论，不得靠冗长代数或繁琐数值制造难度
9. 【题面纯净性-强制·最高优先级】questionText 只能陈述"物理情境 + 已知数据 + 待求量"，严禁出现任何暴露解题结构的元指令。以下措辞及其同义改写一律禁止出现在 questionText 中：
   - 元指令类："自行推导"、"自行确定"、"自行声明"、"不得默认成立"、"须先判断"、"注意某方法可能失效"
   - 分叉预告类："能否…"、"可否…"、"是否能…"、"是否成立"、"判断…是否"（把分叉点直接点破）
   - 结论预告类："若不能，则…"、"单一手段不足"、任何暗示答案为否定/不可行/不可区分的措辞
   正确做法：把"需要判断"这件事**隐藏在情境里**，让解题者自己撞上分叉。例如不写"判断能否用X方法匹配"，而直接写"给出接入距离与截线长度"——解题者若不先验证可行性就会算错。
   ⚠️ 若知识点描述中含"须/禁止/自行"等对命题者的约束，那是给你（命题者）的要求，绝对不可复述或改写进题面。
10. 【不可分辨性-强制】题目须包含 ≥${minIndistinguishablePairs} 组"两种不同物理机制给出同一观测特征"的情形，解题者必须自行意识到二者简并、并给出分离方案；但题面不得提示"存在两种机制"或"单一手段不足"
11. 【禁良定逆问题】若采用逆问题结构，反解路径不得唯一且有闭式；必须是欠定/简并的，或需额外物理判据才能定解。给定观测量直接反代一条固定公式链即可求出参数的逆问题，视为退化题
${disciplineConstraints}

【结构性防御铁律（确保题目固有复杂性，不依赖AI弱点）】：
① 判断分叉点（强制）：解题过程必须有≥${minBranchPoints}个判断节点——需先做物理判断（该用哪套模型/近似是否成立/处于哪个物理区域），不同结论走不同路径。判断靠"想清楚"而非"算出来"；禁止伪分叉（题目直接告知"假设XX成立"不算）。
② 隐含条件（强制）：≥2个关键约束不显式写在题面，需从物理图像/守恒律/边界条件/对称性推断。禁止所有条件都显式给出。
③ 推理依赖链（强制）：解题须形成 ≥3 层"推理"依赖——前一步的物理判断结论决定后一步用哪个模型/公式/近似（非数值传递）。禁止把难度堆在算术步数上。
④ 建模关卡（强制）：题目须先把真实情境翻译成物理模型；若存在看似可直接套用的标准公式，须让解题者判断其是否适用，并说明适用或失效的理由。
⑤ 诱导错误路径（强制）：须设置 ≥${minTrapPaths} 条"直觉上最自然但会得出错误结果"的解法；正确解答的前提是识别该路径为何错误。⚠️ 该陷阱只能体现在情境与数据的设计上，题面严禁提示"注意某解法会失效"。
⑥ 量级抵消节点（建议）：设置一处两个可比物理量近似相消，使朴素量级估计失效（如散射因子之差远小于各自数值，导致弱峰强度落到 10⁻³ 量级）。
⑦ 单位/量纲节点（建议）：推导中包含单位换算或易混淆物理量辨析。

【对抗性难度策略（强制叠加 ≥2 条；单题模式因策略C禁用则 ≥1 条）】：
${singleQuestion ? '⚠️ 单题模式：策略C已禁用\n' : ''}策略A — 混用非SI单位，推导中途必须换算到SI才能继续
策略B — 同时引入两个外观相似但含义不同的物理量，混淆则得错误结论
策略C — 推导完成后追加反直觉判断题（需分情况讨论）${singleQuestion ? '【单题禁用】' : ''}
策略D — 逆向推理：给定结果反推系统参数/初始条件（AI正向训练数据多，逆向稀少）
${disciplineStrategies}

【答案要求】：
1. 给出完整的分步推导过程（每步含具体公式和数值代入）
2. 给出最终答案（含数值和单位）
3. 参考解须包含 ≥${minReasoningActs} 个"推理动作"（每个含一次非平凡物理判断：建模/近似取舍/对称性/边界/为何某直觉解法错误）；纯代数变形与数值代入不计入。须显式点出被排除的诱导错误路径及其错误原因

输出必须是严格的 JSON，不包含 markdown 代码块：
{
  "problemId": "v2_${Date.now()}",
  "knowledgePoint": "${kpAnalysis.knowledgePoint}",
  "chosenDimension": "${dimension}",
  "questionText": "完整题目文字，所有数据已嵌入，200字以内。只含物理情境+已知数据+待求量，严禁出现自行推导/能否/是否成立/若不能等元指令与分叉预告措辞",
  "coreData": {
    "物理量名称": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "求解目标",
  "referenceAnswer": "完整分步解答，含公式推导和数值计算",
  "referenceSteps": ["推理动作1(含物理判断)", "推理动作2", "...至少${minReasoningActs}个推理动作,其中须含对诱导错误路径的排除"]
}`;

    const raw = (problemIndex !== undefined
        ? await callLLMTracked(prompt, { model: 'reasoning', temperature: 0.85 }, problemIndex)
        : await callLLM(prompt, { model: 'reasoning', temperature: 0.85 })
    ).trim();
    const draft = cleanAndParseJSON(raw) as V2QuestionDraft;

    if (!draft.questionText || !draft.referenceAnswer) {
        throw new Error("Generator: incomplete question or answer in response");
    }

    // ── 题面纯净性兜底：确定性检测 + 定向改写 ──────────────────────────
    // prompt 约束不可靠（实测 A1 会把命题者约束抄进题面，等于把分叉点
    // 和否定性结论预告给解题者）。此处做代码层检测，命中则只重写 questionText，
    // 不重跑整题（短 prompt，几乎不影响整体耗时）。
    const leaked = findLeakPhrases(draft.questionText);
    if (leaked.length > 0) {
        console.warn(`[V2 A1] 题面泄漏元指令 ${JSON.stringify(leaked)}，触发定向改写`);
        try {
            const cleaned = await sanitizeQuestionText(draft, leaked, problemIndex);
            if (cleaned) {
                const stillLeaked = findLeakPhrases(cleaned);
                if (stillLeaked.length === 0) {
                    draft.questionText = cleaned;
                } else {
                    console.warn(`[V2 A1] 改写后仍残留 ${JSON.stringify(stillLeaked)}，保留原题面待审查`);
                }
            }
        } catch (e) {
            console.warn(`[V2 A1] 题面改写失败，保留原题面:`, e);
        }
    }

    return draft;
}

/** 会把解题结构泄漏给解题者的措辞（元指令 / 分叉预告 / 结论预告） */
const LEAK_PHRASES = [
    '自行推导', '自行确定', '自行声明', '自行判断', '不得默认',
    '能否', '可否', '是否能', '是否成立', '是否可以',
    '若不能', '若不成立', '先判断', '须判断', '请判断',
];

function findLeakPhrases(text: string): string[] {
    if (!text) return [];
    return LEAK_PHRASES.filter(p => text.includes(p));
}

/**
 * 只重写 questionText：剥离元指令与分叉预告，保持物理情境、数据、待求量不变。
 * 不改 referenceAnswer —— 参考解里保留判断过程是正确的，问题只在题面。
 */
async function sanitizeQuestionText(
    draft: V2QuestionDraft,
    leaked: string[],
    problemIndex?: number
): Promise<string | null> {
    const prompt = `你是物理竞赛题面编辑。下面这道题的题面泄漏了解题结构，把本应由解题者自己发现的判断点直接写了出来，导致题目变简单。请改写题面。

【当前题面】：
${draft.questionText}

【检测到的泄漏措辞】：${leaked.join('、')}

【改写规则】：
1. 只保留"物理情境 + 已知数据 + 待求量"，删除所有元指令与分叉预告
2. 必须删除的措辞类型：
   - 元指令："自行推导/自行确定/自行声明/不得默认成立/须先判断"
   - 分叉预告："能否…/可否…/是否成立/判断…是否"
   - 结论预告："若不能则…"以及任何暗示答案为否定或不可行的表述
3. 把"需要判断"这件事隐藏进情境：不要问"能否用X方法求出Y"，直接要求"求Y"。
   解题者若不自行验证前提就会算错——这正是题目的难点所在，不可提前告知。
4. 物理情境、全部数值数据、单位、待求量必须与原题面完全一致，不得增删数据或改变求解目标
5. 不得引入新的提示或解题步骤说明
6. 字数控制在 200 字以内

只输出改写后的题面纯文本，不要 JSON，不要 markdown 代码块，不要任何解释。`;

    const raw = (problemIndex !== undefined
        ? await callLLMTracked(prompt, { model: 'default', temperature: 0.2 }, problemIndex)
        : await callLLM(prompt, { model: 'default', temperature: 0.2 })
    ).trim();

    const cleaned = raw.replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/, '').trim();
    return cleaned.length >= 20 ? cleaned : null;
}