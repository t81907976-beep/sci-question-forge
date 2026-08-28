import { callLLMTracked } from "../costTracker";
import { getDisciplineGuidance, getMatchedDisciplineForbiddenErrors } from "../disciplines";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { MechanicalV2QuestionDraft } from "./generator";
import type { MechanicalBlindSolverResult } from "./blind-solver";

/**
 * Mechanical V2 — A5 对比裁判
 *
 * 把出题器标准解答与盲解答案对比，给出最终权威答案和发布标签。
 *
 * 机械专属的第四条裁判口径（materials 没有）：**governing 项一致性**。
 * 机械题的最终数值经常一致而结论相反——两方都算出一堆安全系数，但取的最不利
 * 项不同，或接触安全系数忘了先平方就去比设计系数。数值对得上不代表结论对得上，
 * 所以 blindGoverningItem 与 draft.governingItem 不一致时一律进 discrepancies，
 * 且 answersAgree 必须为 false。
 *
 * 另有一条：双方都给出"无可行方案"才算一致；一方硬凑出可行解则以窗口为空的一方为准
 * （前提是其夹空理由成立）。
 */

export interface MechanicalComparisonResult {
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
    releaseLabel: 'standard' | 'with_caveats' | 'discussion_only' | 'not_recommended';
    /** 机械专属：双方判定的主控失效项是否一致 */
    governingAgree: boolean;
    /** 机械专属：裁判裁定的最终 governing 项 */
    finalGoverningItem: string;
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

/**
 * governing 失效项家族表。
 *
 * 为什么不能只做字符串比对：出题器与盲解是两个独立上下文，同一个失效项的写法天差地别
 * ——一边写枚举 `bending_fatigue`，一边写中文「齿根弯曲疲劳」；实测中出现过
 * 「压紧端轴承」对「轴承当量动载荷与寿命控制」（说的是同一件事）。精确相等会把这类
 * 表述差异判成结论级分歧，把一道好题降到 degraded。
 *
 * 反过来也不能放宽到"沾字就算一致"：弯曲 vs 接触是真正会翻转结论的分歧，必须留住。
 * 所以按**失效机理家族**归类：同族即一致，异族即分歧，无法归类的交给 A5，不在这一层下结论。
 *
 * 注意不要建"疲劳"这种跨族的泛家族——bending_fatigue 与 contact_fatigue 都含 fatigue，
 * 一旦建了泛家族，最该拦的那对就被判成一致了。
 */
const GOVERNING_FAMILIES: ReadonlyArray<{ id: string; aliases: readonly string[] }> = [
    { id: 'bending', aliases: ['bending', '弯曲', '齿根'] },
    { id: 'contact', aliases: ['contact', 'wear', 'pitting', '接触', '点蚀', '齿面', '磨损'] },
    { id: 'life', aliases: ['life', 'l10', '寿命', '当量动载荷'] },
    { id: 'static', aliases: ['static', '静载', '静强度', '压痕', '塑性变形'] },
    { id: 'stability', aliases: ['buckling', 'stability', 'column', '失稳', '稳定', '无导向', '侧弯'] },
    { id: 'resonance', aliases: ['resonance', '共振', '自振'] },
    { id: 'selflock', aliases: ['selflock', 'selflocking', '自锁'] },
    { id: 'deflection', aliases: ['deflection', 'stiffness', '挠度', '刚度', '变形'] },
    { id: 'shear', aliases: ['shear', '剪切', '剪断'] },
    { id: 'crush', aliases: ['crush', '挤压', '比压', '压强'] },
    { id: 'nofeasible', aliases: ['nofeasible', 'nofeasiblesolution', '无可行', '窗口为空'] },
    { id: 'discussion', aliases: ['discussiononly', '纯概念'] },
];

const normGoverning = (s: string) => s.toLowerCase().replace(/[\s_\-]/g, '');

/** 一个 governing 字符串命中的所有家族（可能为空 = 无法归类） */
function classifyGoverning(s: string): Set<string> {
    const n = normGoverning(s);
    const hit = new Set<string>();
    for (const family of GOVERNING_FAMILIES) {
        if (family.aliases.some(alias => n.includes(alias))) hit.add(family.id);
    }
    return hit;
}

/**
 * governing 项一致性判定。
 *
 * 三种结局：
 *  - agree=true                     → 不降级
 *  - agree=false                    → 结论级分歧，A5 的 releaseLabel 降到 discussion_only
 *  - agree=true 但带 note           → 无法在这一层判定，记一条备注供人工看，不降级
 *
 * **论述题一律不在这一层判定**：短答题的 governingItem 按提示词定义是"该题讨论的核心
 * 失效项"（一个话题），不是算出来的结论；两边话题措辞不同不构成结论矛盾。实测中
 * 论述题曾被这一层误杀——论述题的一致性本来由「要点
 * 重合度 ≥60%」那条规则管，再叠一道字符串闸门只会重复否决。
 */
/** 导出仅为可回归：这是"结论级分歧"的唯一确定性判据，放宽会漏真分歧、收紧会误杀好题 */
export function sameGoverning(
    a: string,
    b: string,
    questionType?: string
): { agree: boolean; note?: string } {
    const na = normGoverning(a);
    const nb = normGoverning(b);
    if (!na || !nb) return { agree: true };   // 有一方未报，交给 LLM 的 discrepancies 处理
    if (na === nb) return { agree: true };

    if (questionType === 'short-answer') {
        return {
            agree: true,
            note: `主控失效项表述不同（论述题不据此判分歧）：出题器「${a}」，盲解「${b}」`,
        };
    }

    const fa = classifyGoverning(a);
    const fb = classifyGoverning(b);
    if (fa.size === 0 || fb.size === 0) {
        // 至少一方是自由文本，措辞不同不足以断定结论矛盾——宁可不降级，留一条备注给人工
        return {
            agree: true,
            note: `主控失效项写法无法归类到失效机理家族，未在确定性层判定：出题器「${a}」，盲解「${b}」，请人工确认是否同一失效项`,
        };
    }
    for (const id of fa) {
        if (fb.has(id)) return { agree: true };   // 同族即同一失效机理，措辞差异不算分歧
    }
    return { agree: false };
}

/**
 * 计算题兜底答案。
 *
 * 不能用 draft.requiredAnswer——那是"求什么"的任务描述（如"求各安全系数并判断是否
 * 满足 nd=1.5"），把它当答案显示等于最终答案栏一片空话。优先用 A1 自报的
 * answerKey.conclusion（一句话结论，含数值与单位）；缺失时退到 referenceAnswer 的
 * 结论段（最后一段非空文本，通常是"综上…"），最后才退到 requiredAnswer。
 */
function calculationFallbackAnswer(draft: MechanicalV2QuestionDraft): string {
    const conclusion = draft.answerKey?.conclusion?.trim();
    if (conclusion) return conclusion;

    const paragraphs = String(draft.referenceAnswer || '')
        .split(/\n+/)
        .map(line => line.trim())
        .filter(Boolean);
    const last = paragraphs[paragraphs.length - 1];
    if (last && last.length >= 8) return last;

    return draft.requiredAnswer;
}

function normalizeComparisonResult(
    parsed: Partial<MechanicalComparisonResult>,
    draft: MechanicalV2QuestionDraft,
    blindGoverningItem: string
): MechanicalComparisonResult {
    const confidence: MechanicalComparisonResult['confidence'] =
        parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
            ? parsed.confidence
            : "low";
    const reasoningIssues = normalizeStringArray(parsed.reasoningIssues);
    const discrepancies = normalizeStringArray(parsed.discrepancies);
    const solutionRepaired = Boolean(parsed.solutionRepaired ?? false);

    // 机械专属：governing 项不一致 → 强制记为分歧且不算一致（数值对得上也不行）
    const governingVerdict = sameGoverning(
        draft.governingItem || '',
        blindGoverningItem || '',
        draft.questionType
    );
    const governingAgree = governingVerdict.agree;
    let answersAgree = Boolean(parsed.answersAgree);
    if (!governingAgree) {
        answersAgree = false;
        const note = `主控失效项不一致：出题器报 ${draft.governingItem || '（未填写）'}，盲解报 ${blindGoverningItem || '（未报）'}`;
        if (!discrepancies.includes(note)) discrepancies.push(note);
    } else if (governingVerdict.note && !discrepancies.includes(governingVerdict.note)) {
        // 判不了但也不该静默：记进 discrepancies 供人工看，不影响 answersAgree
        discrepancies.push(governingVerdict.note);
    }

    let releaseLabel: MechanicalComparisonResult['releaseLabel'] =
        (parsed.releaseLabel && ['standard', 'with_caveats', 'discussion_only', 'not_recommended'].includes(parsed.releaseLabel))
            ? parsed.releaseLabel
            : confidence === "high" ? "standard" : confidence === "medium" ? "with_caveats" : "not_recommended";

    // 存在推理问题或答案被修复 → 一律判推理无效（不信任 LLM 返回的 true）
    const reasoningValid = (reasoningIssues.length === 0 && !solutionRepaired)
        ? Boolean(parsed.reasoningValid ?? (confidence === "high"))
        : false;

    // 硬降级
    if (!reasoningValid || reasoningIssues.length > 0 || solutionRepaired) {
        if (releaseLabel === 'standard') {
            releaseLabel = confidence === 'low' ? 'not_recommended' : 'with_caveats';
        }
    }
    // governing 分歧是机械的结论级分歧，standard 不可保留
    if (!governingAgree && releaseLabel === 'standard') {
        releaseLabel = 'discussion_only';
    }

    const fallbackAnswer = draft.questionType === 'short-answer'
        ? ((draft.referencePoints || []).join('；') || draft.referenceAnswer)
        : calculationFallbackAnswer(draft);

    return {
        answersAgree,
        discrepancies,
        finalAuthorizedAnswer: String(parsed.finalAuthorizedAnswer || fallbackAnswer || ""),
        finalSolutionText: String(parsed.finalSolutionText || draft.referenceAnswer || ""),
        confidence,
        notes: String(parsed.notes || ""),
        reasoningValid,
        reasoningIssues,
        solutionRepaired,
        repairSummary: String(parsed.repairSummary || ""),
        releaseLabel,
        governingAgree,
        finalGoverningItem: String(parsed.finalGoverningItem || draft.governingItem || ""),
    };
}

function fallbackComparison(draft: MechanicalV2QuestionDraft, reason: string): MechanicalComparisonResult {
    return normalizeComparisonResult({
        answersAgree: false,
        discrepancies: [reason],
        // 留空：交给 normalizeComparisonResult 按题型选兜底（计算题走 answerKey.conclusion）
        finalAuthorizedAnswer: '',
        finalSolutionText: draft.referenceAnswer,
        confidence: "low",
        notes: reason,
        reasoningValid: false,
        reasoningIssues: [reason],
        solutionRepaired: false,
        repairSummary: "",
        releaseLabel: "not_recommended",
        finalGoverningItem: draft.governingItem,
    }, draft, draft.governingItem);
}

/** 四条机械裁判口径，三种题型共用 */
const MECHANICAL_JUDGE_RULES = `【机械裁判的四条专属口径】
1. **governing 项一致性优先于数值一致性**：双方都算出多个安全系数时，必须核对取的最不利项是否同一个。数值接近但 governing 项不同 → answersAgree=false，并写入 discrepancies。特别核查接触安全系数是否**先平方再与设计系数比较**（阶次错会翻转结论）。
2. **标准系列归属**：选型结果必须落在标准离散系列/目录型号上。一方给出"连续解"（如模数 3.17）即为错，以落在系列上的一方为准。
3. **圆整回代贯穿性**：圆整后派生量若仍在用圆整前的数值，该方推理无效（reasoningIssues），即使最终数值凑巧接近。
4. **窗口为空的合法性**：若一方结论为"无可行方案"、另一方硬凑出可行解，先核对夹空理由是否成立；成立则以"窗口为空"的一方为准，硬凑方记入 discrepancies（改动载荷/许用值以求通过属硬伤）。`;

function buildCalculationComparePrompt(
    draft: MechanicalV2QuestionDraft,
    blindResult: MechanicalBlindSolverResult,
    disciplineGuidance: string,
    forbiddenErrors: string[]
): string {
    return `你是机械设计领域的权威答案裁判（机械设计手册与 Shigley 体系皆熟）。请对比出题器标准解答和独立盲解，做最终裁定。

【题目】
${draft.questionText}

【版本 A：出题器标准解答】
${draft.referenceAnswer}

【版本 A 自报主控失效项】${draft.governingItem || '（未填写）'}
【版本 A 自报圆整量】${draft.roundedQuantities.join('；') || '（未声明）'}

【版本 B：独立盲解】
${blindResult.blindAnswer}

【版本 B 最终答案】
${blindResult.blindFinalAnswer}
【版本 B 判定的主控失效项】${blindResult.blindGoverningItem || '（未报）'}

${disciplineGuidance}

${MECHANICAL_JUDGE_RULES}
${forbiddenErrors.length > 0 ? `\n【本方向禁止出现的错误（两版答案都要核）】\n${forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}
【通用裁判规则】：
1. **数值对比**：允许合理精度差异（相对误差 <2%）。查表取值不同导致的差异要追到"哪一行选错"，不要笼统记为精度差异。
2. **推理对比**：公式适用条件不满足（铸铁误用 DE/MSS、非大柔度杆误用欧拉式）、寿命指数混用（球 ε=3 / 滚子 ε=10/3）、单位口径错（T=9550P/n）均属 reasoningIssues，即使最终数值一致。
3. **不一致裁定**：独立判断哪版正确（或两版都错），给出 finalAuthorizedAnswer 与 finalGoverningItem。
4. **releaseLabel**：standard（数值与 governing 均一致、推理正确）/ with_caveats（一致但有非致命瑕疵）/ discussion_only（不一致但可裁定修复）/ not_recommended（无法确定正确答案或题目有致命缺陷）。

输出严格 JSON，不含 markdown：
{
  "answersAgree": true,
  "discrepancies": [],
  "finalAuthorizedAnswer": "最终权威答案（数值+单位）",
  "finalSolutionText": "最终完整解答（含选行依据、圆整回代、多准则比较）",
  "confidence": "high",
  "notes": "裁判说明",
  "reasoningValid": true,
  "reasoningIssues": [],
  "solutionRepaired": false,
  "repairSummary": "",
  "releaseLabel": "standard",
  "finalGoverningItem": "裁定的主控失效项"
}`;
}

function buildShortAnswerComparePrompt(
    draft: MechanicalV2QuestionDraft,
    blindResult: MechanicalBlindSolverResult,
    disciplineGuidance: string,
    forbiddenErrors: string[]
): string {
    const draftPoints = (draft.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无要点）';
    const blindPoints = (blindResult.blindPoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无要点）';

    return `你是机械设计领域的权威论述裁判。请对比出题器参考答案和独立盲解论述，做最终裁定。

【题目】
${draft.questionText}

【版本 A：出题器参考答案（完整论述）】
${draft.referenceAnswer}

【版本 A 核心要点】
${draftPoints}

【版本 B：独立盲解论述】
${blindResult.blindAnswer}

【版本 B 核心要点】
${blindPoints}

${disciplineGuidance}
${forbiddenErrors.length > 0 ? `\n【本方向禁止出现的错误（两版论述都要核）】\n${forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}
【裁判规则】：
1. **要点重合度**：统计共同要点、A 独有、B 遗漏。共同要点数 ≥ 双方总要点的 60% 视为一致。
2. **准则引用正确性**：核对准则名与其**适用条件**是否匹配（Goodman/Gerber/Soderberg 的差别、欧拉与约翰逊的分界、均匀磨损与均压模型的前提、铸铁须用库仑-莫尔）。误引或适用条件写错必须列入 discrepancies。
3. **量的阶次与口径**：把接触安全系数与弯曲安全系数的阶次混为一谈、把剪切耐久限与弯曲耐久限直接互换（未经 0.577 换算）属硬错。
4. **论述完整性**：是否覆盖失效机理 + 判据依据与分界 + 工程含义三个层次。仅覆盖 1-2 层次属 reasoningIssues。
5. **融合权威答案**：一致时输出融合互补要点的共识版本；不一致时判断哪方更正确并输出该方论述，问题部分列入 discrepancies。
6. **releaseLabel**：standard（要点高度一致、无学科错误、三层次完整）/ with_caveats（基本一致但有小遗漏）/ discussion_only（部分重合、各有对错但可融合）/ not_recommended（一方有关键准则性错误或严重不完整）。

输出严格 JSON，不含 markdown：
{
  "answersAgree": true,
  "discrepancies": [],
  "finalAuthorizedAnswer": "融合后的核心要点合并文本（分号分隔）",
  "finalSolutionText": "融合后的完整论述文本",
  "confidence": "high",
  "notes": "裁判说明（列出共同要点数/A独有/B独有）",
  "reasoningValid": true,
  "reasoningIssues": [],
  "solutionRepaired": false,
  "repairSummary": "",
  "releaseLabel": "standard",
  "finalGoverningItem": "该题讨论的核心失效项（纯概念讨论填 discussion_only）"
}`;
}

function buildMixedComparePrompt(
    draft: MechanicalV2QuestionDraft,
    blindResult: MechanicalBlindSolverResult,
    disciplineGuidance: string,
    forbiddenErrors: string[]
): string {
    const draftSteps = (draft.referenceSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n') || '（无步骤）';
    const draftPoints = (draft.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无要点）';
    const blindPoints = (blindResult.blindPoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无要点）';

    return `你是机械设计领域的权威裁判。这是一道**混合题**（含计算小问 + 论述小问）。请分别对比计算部分和论述部分，做最终裁定。

【题目】
${draft.questionText}

【版本 A：出题器标准答案（分小问）】
${draft.referenceAnswer}

【版本 A 计算步骤】
${draftSteps}

【版本 A 论述要点】
${draftPoints}

【版本 A 自报主控失效项】${draft.governingItem || '（未填写）'}

【版本 B：独立盲解】
${blindResult.blindAnswer}

【版本 B 计算最终答案】
${blindResult.blindFinalAnswer}

【版本 B 论述要点】
${blindPoints}

【版本 B 判定的主控失效项】${blindResult.blindGoverningItem || '（未报）'}

${disciplineGuidance}

${MECHANICAL_JUDGE_RULES}
${forbiddenErrors.length > 0 ? `\n【本方向禁止出现的错误（两版都要核）】\n${forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}
【裁判规则】：
1. **计算部分**：数值对比允许相对误差 <2%；差异要追到"哪一行选错"或"哪个系数取错"。
2. **论述部分**：统计要点重合度，核对准则名与适用条件。
3. **整体判定**：计算、论述、**governing 项**三者都一致才算 answersAgree=true。
4. **交叉自洽**：论述结论必须与计算结果一致（不能算出接触为主控却论述弯曲为主控）；矛盾即 reasoningIssues。
5. **融合权威答案**：finalSolutionText 输出融合后的完整分小问解答；finalAuthorizedAnswer 输出「计算最终答案 + 关键论述要点」。
6. **releaseLabel**：standard（三者一致、无学科错误）/ with_caveats（整体一致但某小问有小瑕疵）/ discussion_only（某部分不一致但可裁定融合）/ not_recommended（计算无法确定、论述有关键错误、或题目缺陷）。

输出严格 JSON，不含 markdown：
{
  "answersAgree": true,
  "discrepancies": [],
  "finalAuthorizedAnswer": "计算最终答案 + 关键论述要点（合并文本）",
  "finalSolutionText": "融合后的完整分小问解答",
  "confidence": "high",
  "notes": "裁判说明（分别说明计算部分、论述部分与 governing 项的对比结论）",
  "reasoningValid": true,
  "reasoningIssues": [],
  "solutionRepaired": false,
  "repairSummary": "",
  "releaseLabel": "standard",
  "finalGoverningItem": "裁定的主控失效项"
}`;
}

export async function compareAnswers(
    draft: MechanicalV2QuestionDraft,
    blindResult: MechanicalBlindSolverResult,
    problemIndex: number = 0
): Promise<MechanicalComparisonResult> {
    if (!blindResult.isSolvable) {
        return fallbackComparison(draft, `盲解失败：${blindResult.failReason || "未知原因"}`);
    }

    const disciplineGuidance = getDisciplineGuidance(draft.knowledgePoint);
    const forbiddenErrors = getMatchedDisciplineForbiddenErrors(draft.knowledgePoint);
    const isShortAnswer = draft.questionType === 'short-answer';
    const isMixed = draft.questionType === 'mixed';

    const prompt = isMixed
        ? buildMixedComparePrompt(draft, blindResult, disciplineGuidance, forbiddenErrors)
        : isShortAnswer
        ? buildShortAnswerComparePrompt(draft, blindResult, disciplineGuidance, forbiddenErrors)
        : buildCalculationComparePrompt(draft, blindResult, disciplineGuidance, forbiddenErrors);

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'default',
            temperature: 0.1,
            responseFormat: 'json',
            systemPrompt: '你是机械设计权威裁判（机械设计手册与 Shigley 体系皆熟），只输出严格 JSON。',
        }, problemIndex, 'a5_compare')).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return fallbackComparison(draft, "对比裁判响应无法解析为 JSON");
        }
        const result = normalizeComparisonResult(
            cleanAndParseJSON(jsonMatch[0]) as Partial<MechanicalComparisonResult>,
            draft,
            blindResult.blindGoverningItem
        );
        // A5 此前无日志：answersAgree=false 会直接把题降到 degraded，但降级理由（是数值分歧、
        // 推理分歧，还是 governing 家族异族）只能事后翻 metadata 反推。照 A2/A3 的格式打一行。
        console.log(
            `[V2 A5] 对比裁定: answersAgree=${result.answersAgree} governingAgree=${result.governingAgree} `
            + `confidence=${result.confidence} releaseLabel=${result.releaseLabel} `
            + `（出题器 governing=${draft.governingItem || '（未填写）'} / 盲解 governing=${blindResult.blindGoverningItem || '（未报）'}）`
        );
        if (result.discrepancies.length > 0) console.log('[V2 A5] 差异:', result.discrepancies);
        if (result.reasoningIssues.length > 0) console.log('[V2 A5] 推理问题:', result.reasoningIssues);
        return result;
    } catch (error) {
        return fallbackComparison(draft, `对比裁判异常: ${(error as Error).message}`);
    }
}




