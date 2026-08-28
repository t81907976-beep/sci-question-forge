import { callLLM } from "../../../llmClient";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { V2QuestionDraft } from "./generator";
import type { BlindSolverResult } from "./blind-solver";
import { formatRulesForPrompt, selectChemistryRules } from "./rule-matcher";

/**
 * V2 Node A5: Answer Comparator
 */

export interface ComparisonResult {
    answersAgree: boolean;
    discrepancies: string[];
    finalAuthorizedAnswer: string;
    finalSolutionText: string;
    confidence: "high" | "medium" | "low";
    notes: string;
    reasoningValid: boolean;
    reasoningIssues: string[];
    solutionRepaired: boolean;
    repairSummary: string;
    releaseLabel: 'standard' | 'with_caveats' | 'discussion_only' | 'adversarial' | 'not_recommended';
}

function isConfidence(value: unknown): value is ComparisonResult["confidence"] {
    return value === "high" || value === "medium" || value === "low";
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item)).filter(Boolean) : [];
}

function normalizeComparisonResult(parsed: Partial<ComparisonResult>): ComparisonResult {
    const confidence = isConfidence(parsed.confidence) ? parsed.confidence : "low";
    const discrepancies = normalizeStringArray(parsed.discrepancies);
    const reasoningIssues = normalizeStringArray(parsed.reasoningIssues);
    const solutionRepaired = Boolean(parsed.solutionRepaired ?? reasoningIssues.length > 0);
    const reasoningValid = Boolean(parsed.reasoningValid ?? (confidence === "high" && reasoningIssues.length === 0 && !solutionRepaired));
    const rawReleaseLabel = (parsed.releaseLabel && ['standard', 'with_caveats', 'discussion_only', 'adversarial', 'not_recommended'].includes(parsed.releaseLabel))
        ? parsed.releaseLabel
        : confidence === 'high' ? 'standard' : confidence === 'medium' ? 'with_caveats' : 'not_recommended';
    const releaseLabel = (!reasoningValid || reasoningIssues.length > 0 || solutionRepaired) && rawReleaseLabel === 'standard'
        ? (confidence === 'low' ? 'not_recommended' : 'with_caveats')
        : rawReleaseLabel;

    return {
        answersAgree: Boolean(parsed.answersAgree),
        discrepancies,
        finalAuthorizedAnswer: String(parsed.finalAuthorizedAnswer ?? ""),
        finalSolutionText: String(parsed.finalSolutionText ?? ""),
        confidence,
        notes: String(parsed.notes ?? ""),
        reasoningValid,
        reasoningIssues,
        solutionRepaired,
        repairSummary: String(parsed.repairSummary ?? ""),
        releaseLabel,
    };
}

function fallbackComparison(draft: V2QuestionDraft, reason: string): ComparisonResult {
    return {
        answersAgree: false,
        discrepancies: [reason],
        finalAuthorizedAnswer: draft.referenceAnswer.split("\n").slice(-1)[0] || "",
        finalSolutionText: draft.referenceAnswer,
        confidence: "low",
        notes: "Comparator failed, fell back to reference answer",
        reasoningValid: false,
        reasoningIssues: ["比较器未能完成推理审查，无法确认解析链条正确性"],
        solutionRepaired: false,
        repairSummary: "",
        releaseLabel: "not_recommended",
    };
}

function includesAny(text: string, keywords: string[]): boolean {
    return keywords.some(kw => text.includes(kw));
}

export async function compareAnswers(
    draft: V2QuestionDraft,
    blindResult: BlindSolverResult
): Promise<ComparisonResult> {
    const adjudicationText = `${draft.knowledgePoint} ${draft.chosenDimension} ${draft.questionText} ${draft.referenceAnswer} ${blindResult.blindAnswer}`;
    const solidRules = includesAny(adjudicationText, ['固体', '晶体', '缺陷', '掺杂', '氧空位', '钙钛矿', '尖晶石', '非化学计量', '价态', 'XRD', 'TG', '磁矩']) ? `
- 固体/缺陷：核对每式量/每晶胞/每位点基准，电荷守恒、物料守恒、位点守恒、平均价态、氧空位/空穴补偿链是否一致。` : '';
    const thermoRules = includesAny(adjudicationText, ['热力学', '平衡', '活度', '逸度', '标准态', '自由能', '化学势', '相平衡', '相图', 'ΔG', 'Debye-Hückel', 'Pitzer']) ? `
- 热力学/平衡：核对 Q 的方向、ΔG° vs ΔG、标准态 vs 实际态、活度/逸度链、K 的正值和反应方向。` : '';
    const kineticsRules = includesAny(adjudicationText, ['动力学', '速率', '速控', '预平衡', '稳态', 'Michaelis', '盐效应', 'KIE', 'Arrhenius', 'Eyring', '催化']) ? `
- 动力学/催化：核对 k_obs vs k_true/k_cat，速率常数单位，预平衡/稳态/Michaelis/Tafel 适用性，以及 pH/盐效应/KIE 是否改变机理判定。` : '';
    const acidBaseRules = includesAny(adjudicationText, ['酸碱', 'pH', '缓冲', '滴定', '溶解度', '沉淀', '配位', '络合', '分布系数', '条件稳定常数']) ? `
- 酸碱/配位/沉淀：核对总浓度/游离浓度/有效形态，条件常数/热力学常数，物料守恒、电荷守恒和 pH 近似边界。` : '';
    const electroRules = includesAny(adjudicationText, ['Nernst', '条件电位', 'Cottrell', '电位阶跃', '双层电容', '电化学', 'Tafel', 'Butler-Volmer', '参比电极', '循环伏安']) ? `
- 电化学：核对 Nernst 指数、电子数、反应方向、电位符号、条件电位、参比电极基准，以及 Cottrell 法拉第电流/双层电流分离。` : '';
    const surfaceRules = includesAny(adjudicationText, ['表面', '吸附', 'TPD', '脱附', '覆盖度', 'Langmuir', 'Temkin', 'Freundlich', 'BET', '等温线']) ? `
- 表面/吸附：核对模型适用性、覆盖度 0≤θ≤1、单层/多层定义、TPD 峰温-升温速率-脱附级数-吸附能自洽。` : '';
    const colloidRules = includesAny(adjudicationText, ['DLS', '动态光散射', '胶体', 'DLVO', 'Hamaker', 'ζ电位', 'Gibbs吸附', 'CMC', '表面活性剂']) ? `
- 胶体/界面：核对表观信号与真实粒径/浓度、恒电荷/恒电位边界、Debye 长度数量级、Gibbs吸附是否跨 CMC 误拟合。` : '';
    const realGasRules = includesAny(adjudicationText, ['非理想气体', 'van der Waals', 'vdW', '压缩因子', '对比态', '临界参数', '真实气体', 'Joule-Thomson', 'virial', '维里']) ? `
- 非理想气体：核对理想性判据、Z 因子/对比态、逸度与分压转换、vdW 参数 a,b,V-nb 和临界参数自洽。` : '';
    const quantumRules = includesAny(adjudicationText, ['Hückel', '休克尔', '芳香', '反芳香', 'HOMO', 'LUMO', '轨道', '电环化', '周环', 'Woodward', 'NMR', '耦合常数']) ? `
- 有机/量子：核对环状/开链、共平面性、连续共轭、Hückel α/β 参考零点、热/光条件和周环选择规则。` : '';
    const energeticSpanRules = includesAny(adjudicationText, ['能量跨度', 'energetic span', 'TDTS', 'TDI', 'XTOF', '决定态', '休眠物种', 'off-cycle', '循环外']) ? `
- 能量跨度/TOF：核对 δE 是否由全部 (TS,I) 配对枚举得出而非最高单步活化能；TDI 在 TDTS 之前时是否加了循环 ΔG_r；XTOF 各态之和是否为 1；off-cycle 休眠物种是否只线性缩放 TOF。任一项缺失即使 TOF 数量级接近也不得 standard。` : '';
    const mixedValenceRules = includesAny(adjudicationText, ['混合价', 'Mulliken-Hush', 'IVCT', '价间电荷转移', 'Robin-Day', 'Creutz-Taube', 'Class III']) ? `
- 混合价/IVCT：核对 r_ab 是否为有效电荷转移距离、是否比较 2H_ab 与 λ、判为 Class III 后是否作废 Class II 公式结果并改用 ν̃_max=2H_ab、波数是否统一 cm⁻¹。两版类别判定不一致时必须回到 2H_ab 与 λ 的定量比较裁定，不得按文献成见采信。` : '';
    const statMechRules = includesAny(adjudicationText, ['配分函数', '电子配分', '简并', '自旋-轨道', '旋轨', '对称数', '核自旋', '正氢', '仲氢', '正-仲', '转动配分', '振动配分', 'Sackur-Tetrode', 'Boltzmann', '布居', 'θrot', 'θvib', 'θ_rot', 'θ_vib', 'Bigeleisen', '同位素交换', 'Hund第三定则', 'g_J', 'gJ']) ? `
- 统计热力学/配分函数：核对电子配分是否对低能激发态求和（非默认 q_el=g_0 或 1）、转动配分是否含正确对称数 σ、同位素交换/同核体系高温极限 K 是否仅由 σ 决定（勿答 K=1）、是否用 T/θ 判据选经典极限或逐项求和、能量零点与波数/kT 单位是否自洽。Hund 第三定则题须核对半充满前后 J 方向（<半充满 J=|L−S|，>半充满 J=L+S）与 spin-only 的区别。任一项缺失即使数值接近也不得 standard。` : '';
    const spectraRules = includesAny(adjudicationText, ['转动光谱', '振转', '振动-转动', '带头', 'band head', 'P支', 'R支', '支返转', 'Fortrat', '转动常数', 'B_v', 'Bv', 'B_e', 'αe', 'α_e', '离心畸变', 'Jmax', 'J_max', 'Fermi共振', '费米共振', '倍频', 'Birge-Sponer', 'Morse', '同位素位移']) ? `
- 分子光谱/结构反演：核对最强谱线是否含 (2J+1) 简并权重与 Boltzmann 竞争（非只看指数）、键长是否由 B_e（振转外推）而非 B_0 反算、带头是否由 B_v'<B_v'' 判据得出、Fermi 共振是否由对称性+能量接近识别（非机械倍频）、同位素取代后约化质量是否正确传递。任一项缺失即使数值接近也不得 standard。` : '';
    const domainRules = `${energeticSpanRules}${mixedValenceRules}${statMechRules}${spectraRules}${solidRules}${thermoRules}${kineticsRules}${acidBaseRules}${electroRules}${surfaceRules}${colloidRules}${realGasRules}${quantumRules}`;
    const dynamicRules = formatRulesForPrompt(selectChemistryRules({
        node: 'A5',
        knowledgePoint: draft.knowledgePoint,
        dimension: draft.chosenDimension,
        questionText: draft.questionText,
        referenceAnswer: draft.referenceAnswer,
        extraText: blindResult.blindAnswer,
        maxRules: 4,
    }), '【已匹配的规则库动态裁判要求】');

    const prompt = `你是化学题目裁判专家。请对比以下两版解答，判断最终答案和推理链是否可靠，并给出最终权威解答。

【题目】：
${draft.questionText}

【版本 A（出题者参考答案）】：
${draft.referenceAnswer}

【版本 B（独立解题者答案）】：
${blindResult.blindAnswer}

${dynamicRules}
【核心裁判规则】：
1. 不要只比较最终答案。即使两版最终答案一致，也必须逐步审查每个关键推理步骤。
2. 必须检查：化学定律适用条件、量纲、单位换算、符号约定、标准态/参考基准、活度/逸度校正、模型选择正确性、守恒律闭合性。
3. 如果最终答案一致但任一版本存在关键公式错误、单位错误、条件误用、参考基准混淆、模型边界越界或数值巧合，answersAgree 仍可为 true，但 reasoningValid 必须为 false，reasoningIssues 必须写明错误。
4. 如果最终答案一致但推理跳过关键判断分叉、隐含条件来源或单位/基准转换节点，reasoningValid 必须为 false，releaseLabel 不得为 standard。
5. 遇到「最终答案正确但推理有错」的情况，必须在 finalSolutionText 中重写一版正确、完整、可直接导出的标准解答。
6. finalAuthorizedAnswer 必须与 finalSolutionText 的结论完全一致。
7. finalSolutionText 不得保留错误推理；如需提及错误，只能明确说明该错误已被排除或修正。

【分领域裁判清单】：
${domainRules || '- 未命中特定领域关键词时，仍需按通用化学裁判规则核对守恒闭合、模型适用性、标准态/基准一致性和单位自洽。'}

【结构防御裁判】：
- 必须确认解答是否真的执行了判断分叉，而不是直接套公式。
- 必须确认隐含条件来源是否能由题面数据、守恒、趋势、边界条件或基准推出；如果只是补假设，判为推理缺陷。
- 必须确认单位/基准屏障是否正确处理；跳过该节点但数值碰巧一致，不算 reasoningValid。
- 对能力边界样本的目标 solutionLogic 覆盖检查必须作为硬裁判：如果命中动态裁判要求，但任一版本没有执行关键 failure mode 的排除/闭合，即使最终数值或结论接近，reasoningValid=false，releaseLabel 不得为 standard。
- 硬否决示例：FH端点伪残差；BV/EIS中Ageo/ECSA、带符号I·Ru、非零偏置BV导数或Warburg/RD/Rct拆错；photoredox总/游离浓度、kq,total/kSET、Iabs/V、Ri=2kt[R•]^2或链长分母混用；Craig-Gordon降级Rayleigh或漏squared S；spinchem篡改PS(t)/Haberkorn公式；QPE差分偶然抵消、τ/m/r资源枚举或ceil边界错误；VQE/JW漏I/single-Z/ZZ/X/Y项、row-sum或Vnn；玻璃VFT/Arrhenius残差/RSS/AICc不可复现；Turing最快模态偶然一致但矩阵/Jacobian/ε位置/离散谱错误；能量跨度把δE当最高单步势垒或漏跨圈ΔGr；Mulliken-Hush用几何间距当rab或判出Class III后仍沿用Class II公式结果。

【置信度标准】：
- high：最终答案确定，推理审查无关键问题，解答可直接导出
- medium：最终答案可确定，但原解答存在推理错误/缺漏，已在最终解答中修复
- low：无法可靠确定最终答案或无法修复为可靠解析

【发布标签判定】：
- standard：confidence=high，推理无关键问题，题目和答案均可直接入库
- with_caveats：confidence=medium，题目可发布但需附带假设说明或争议备注
- discussion_only：存在无法消除的合理争议，更适合用作讨论题
- adversarial：题目有深度但答案融合质量不足，仅适合对抗测试
- not_recommended：confidence=low，不建议发布

输出必须是严格 JSON，不含 markdown 代码块：
{
  "answersAgree": true 或 false,
  "reasoningValid": true 或 false,
  "reasoningIssues": ["推理错误1", "推理错误2"],
  "solutionRepaired": true 或 false,
  "repairSummary": "如果修复了解析，说明修复了什么；否则为空字符串",
  "discrepancies": ["差异1", "差异2"],
  "finalAuthorizedAnswer": "最终权威答案（数值+单位）",
  "finalSolutionText": "最终权威分步解答（每步含必要公式、数值和化学判据）",
  "confidence": "high" 或 "medium" 或 "low",
  "notes": "裁判备注（如有争议点）",
  "releaseLabel": "standard" 或 "with_caveats" 或 "discussion_only" 或 "adversarial" 或 "not_recommended"
}`;

    const raw = (await callLLM(prompt, { model: 'default', temperature: 0.1, responseFormat: 'json' })).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return fallbackComparison(draft, "Failed to parse comparator response");
    }

    try {
        return normalizeComparisonResult(cleanAndParseJSON(jsonMatch[0]) as Partial<ComparisonResult>);
    } catch {
        return fallbackComparison(draft, "Comparator JSON parse failed");
    }
}
