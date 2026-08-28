import { callLLMTracked } from "../costTracker";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { MechanicalV2QuestionDraft } from "./generator";

/**
 * Mechanical V2 — A4 盲解
 *
 * 只把 draft.questionText 交给一个全新的 LLM 上下文，不传 referenceAnswer /
 * coreData / knowledgePoint / governingItem / handbookLookupItems。
 *
 * 机械盲解与 materials 的关键差别：题干**故意不自足**（手册量缺席题面）。
 * 因此盲解指令里不能写"不要臆测题面未给出的数据"——那会让盲解直接判 unsolvable。
 * 机械的口径是：题面附有多行手册摘录时须自行选行（并说明选行依据）；
 * 摘录未覆盖的量允许按机械设计通用手册取典型值，但必须写明取了多少、依据是什么。
 *
 * 另外两条机械专属作答纪律（对齐 A2 的审查口径，使 A5 的比对有意义）：
 * - 圆整后必须回代重算全部派生量；
 * - 多准则并行时必须显式比较并报出 governing 项；可行集为空是合法结论。
 */

export interface MechanicalBlindSolverResult {
    blindAnswer: string;        // 完整分步解答 / 完整论述
    blindFinalAnswer: string;   // 只有最终答案+单位（计算题）/ 要点摘要（简答题）
    blindPoints: string[];      // 简答题专用：盲解核心要点数组
    /** 机械专属：盲解自己判定的主控失效项，A5 会与出题器自报值比对 */
    blindGoverningItem: string;
    isSolvable: boolean;
    failReason?: string;
}

function normalizeBlindResult(
    parsed: Partial<MechanicalBlindSolverResult>,
    isShortAnswer: boolean
): MechanicalBlindSolverResult {
    const blindPoints = Array.isArray(parsed.blindPoints)
        ? parsed.blindPoints.map(item => String(item).trim()).filter(Boolean)
        : [];
    const blindAnswer = String(parsed.blindAnswer || "");
    const blindFinalAnswer = isShortAnswer
        ? (blindPoints.length > 0 ? blindPoints.join('；') : String(parsed.blindFinalAnswer || ""))
        : String(parsed.blindFinalAnswer || "");

    return {
        blindAnswer,
        blindFinalAnswer,
        blindPoints,
        blindGoverningItem: String(parsed.blindGoverningItem || ""),
        isSolvable: Boolean(parsed.isSolvable ?? (blindAnswer.length > 0)),
        failReason: parsed.failReason ? String(parsed.failReason) : undefined,
    };
}

/** 三种题型共用的取值纪律：机械题干故意不自足，选行本身就是判断层 */
const BLIND_LOOKUP_DISCIPLINE = `【取值纪律（机械题干故意不自足，请照此处理）】
1. 题面若附有多行手册摘录/标准系列，必须**自行按条件选行**，并写明"按什么条件选到哪一行"；档位之间需要时按列内线性插值。
2. 摘录未覆盖但求解必需的量（材料强度极限、系数表值、目录额定载荷等），允许按机械设计通用手册取典型值，但必须写明取值与依据；不要因为题面没给就判为不可解。
3. 尺寸/型号/根数/圈数等反解结果必须圆整到标准离散系列或目录型号，且**圆整后所有派生量都要用圆整值重算**。
4. 多条失效准则并行时，必须分别算出各自安全系数、**显式比较**并报出主控失效项（注意接触安全系数须先平方再与设计系数比较）。
5. 若所有候选都不满足约束，"无可行方案"是合法且正确的结论——请指出是哪条约束把窗口夹空的，以及唯一的放松方向，不要为了凑通过而改动载荷或许用值。
6. 只有在题面自相矛盾或缺少无法用手册补齐的关键工况时，才把 isSolvable 标记为 false。`;

/**
 * 网关/传输类错误的判据。
 *
 * 实测中 A4 吃过一次 `Upstream HTTP/2 stream failed`：这个串**不在** llmClient 自己的
 * 重试白名单里（那里有 `Upstream request failed` / `Upstream body read failed` /
 * `Upstream service` / `temporarily unavailable`，独缺 stream 这一支），于是一次断流就致命——
 * 盲解判 unsolvable、A5 走 fallback、confidence 掉到 low，整道题降到 degraded。llmClient 是
 * 主框架不能改，所以在机械自己的节点这一层补一次重试。
 *
 * 只认这类**与题目内容无关**的错误。模型答不出来、JSON 解析不了都不在此列：那种情况重试
 * 只是重复烧钱，而且掩盖真实问题。
 */
const GATEWAY_ERROR = /HTTP\/2|stream failed|Upstream|temporarily unavailable|terminated|ECONNRESET|socket hang up|other side closed|502|503|504|Concurrency|rate limit|429/i;

export function isGatewayError(message: string): boolean {
    return GATEWAY_ERROR.test(message);
}

/**
 * 盲解专用的网关重试。
 *
 * 为什么单给盲解加而不是给每个节点都加：A4 是整条链**唯一没有下游补救**的一环。
 * A1 出题失败会重来，A2/A3 有修复轮次，A5 失败还有 fallbackComparison 兜住；只有盲解
 * 一断，一致性校验就整体失效——七次调用的钱花了，拿到的却是一道 degraded 的题。
 *
 * 退避取 6s/12s/18s：网关的瞬时断流通常几秒内恢复，而盲解本身一次要 2-4 分钟，
 * 退避再长就没意义了。
 */
async function callWithGatewayRetry(
    call: () => Promise<string>,
    label: string,
): Promise<string> {
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; ; attempt++) {
        try {
            return await call();
        } catch (error) {
            const message = (error as Error).message || String(error);
            if (attempt >= MAX_ATTEMPTS || !isGatewayError(message)) throw error;
            const waitMs = 6000 * attempt;
            console.warn(`[V2 A4] ${label} 网关错误，${waitMs / 1000}s 后重试（第 ${attempt}/${MAX_ATTEMPTS - 1} 次）: ${message.slice(0, 160)}`);
            await new Promise(resolve => setTimeout(resolve, waitMs));
        }
    }
}

export async function solveBlind(
    draft: MechanicalV2QuestionDraft,
    problemIndex: number = 0
): Promise<MechanicalBlindSolverResult> {
    const isShortAnswer = draft.questionType === 'short-answer';
    const isMixed = draft.questionType === 'mixed';

    const calculationPrompt = `请独立求解下面这道机械设计**设计/校核题**。你只能看到题目本身，没有任何参考答案。

【题目】
${draft.questionText}

${BLIND_LOOKUP_DISCIPLINE}

【作答要求】
1. 逐步写出所用公式及其**适用条件**（如欧拉式仅适用于大柔度杆、铸铁须用库仑-莫尔而非 DE/MSS）。
2. 在每个判据分叉处说明为什么选这一支。
3. 逐步代入数值并显示中间结果，注意单位换算（T=9550P/n 中 P 为 kW、n 为 r/min 时 T 为 N·m）。
4. 最终答案必须带单位；并报出主控失效项。

输出严格 JSON，不含 markdown：
{
  "blindAnswer": "完整分步解答（含公式与适用条件、选行依据、代入、圆整回代、多准则比较）",
  "blindFinalAnswer": "最终答案（数值+单位；多个用；分隔）",
  "blindPoints": [],
  "blindGoverningItem": "主控失效项（如 wear_pinion / fatigue / buckling；若无可行方案填 no_feasible_solution）",
  "isSolvable": true,
  "failReason": "若不可解，说明原因；可解则留空"
}`;

    const shortAnswerPrompt = `请独立回答下面这道机械设计**简答题/论述题**。你只能看到题目本身，没有任何参考答案。

【题目】
${draft.questionText}

【作答要求】
1. 完全基于题面情境独立论述，展示对失效机理与判据体系的理解。
2. 引用具体的准则/判据名称（Goodman/Gerber/Soderberg、欧拉与约翰逊、均匀磨损与均压、库仑-莫尔等），并说明其**适用条件**与分界。
3. 覆盖三个层次：失效机理 → 判据依据与分界条件 → 错判后果与工程含义。
4. 半定量表述可用（数量级、单调性、分界条件），不必做完整数值计算。
5. 若题目自相矛盾或指向不清，把 isSolvable 标记为 false 并说明原因。

输出严格 JSON，不含 markdown：
{
  "blindAnswer": "完整论述文本（400-700字）",
  "blindPoints": ["要点1（15-40字）", "要点2", "...（至少4条）"],
  "blindFinalAnswer": "",
  "blindGoverningItem": "该题讨论的核心失效项（若纯概念讨论填 discussion_only）",
  "isSolvable": true,
  "failReason": ""
}`;

    const mixedPrompt = `请独立求解下面这道机械设计**混合题**（含计算小问与论述小问）。你只能看到题目本身，没有任何参考答案。

【题目】
${draft.questionText}

${BLIND_LOOKUP_DISCIPLINE}

【作答要求】
1. 按小问编号分别作答。
2. 计算小问：公式 + 适用条件 + 选行依据 + 代入 + 圆整回代 + 带单位结果。
3. 论述小问：必须**基于前面的计算结果**展开，引用具体准则名并说明机理与错判后果。
4. 报出主控失效项。

输出严格 JSON，不含 markdown：
{
  "blindAnswer": "完整分小问解答（含计算过程与论述）",
  "blindFinalAnswer": "计算小问的最终数值答案（含单位；多个用；分隔）",
  "blindPoints": ["论述要点1（15-40字）", "论述要点2", "...（至少3条）"],
  "blindGoverningItem": "主控失效项",
  "isSolvable": true,
  "failReason": "若不可解，说明原因；可解则留空"
}`;

    const prompt = isMixed ? mixedPrompt : isShortAnswer ? shortAnswerPrompt : calculationPrompt;

    try {
        const raw = (await callWithGatewayRetry(() => callLLMTracked(prompt, {
            model: 'reasoning',
            temperature: 0.1,
            responseFormat: 'json',
            systemPrompt: isMixed
                ? '你是机械设计领域的解题与论述专家（机械设计手册与 Shigley 体系皆熟），只根据题面独立作答，只输出严格 JSON。'
                : isShortAnswer
                ? '你是机械设计领域的论述专家，只根据题面独立作答，只输出严格 JSON。'
                : '你是机械设计领域的解题专家（机械设计手册与 Shigley 体系皆熟），只根据题面独立求解，只输出严格 JSON。',
        }, problemIndex, 'a4_blind_solve'), `第${problemIndex + 1}题盲解`)).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                blindAnswer: "",
                blindFinalAnswer: "",
                blindPoints: [],
                blindGoverningItem: "",
                isSolvable: false,
                failReason: "盲解响应无法解析为 JSON",
            };
        }
        const result = normalizeBlindResult(
            cleanAndParseJSON(jsonMatch[0]) as Partial<MechanicalBlindSolverResult>,
            isShortAnswer
        );
        // 盲解一断整条一致性校验就失效，但此前没有任何日志——批量里那道 degraded 是靠
        // metadata.blindSolveFailReason 反推出来的。成功与否都打一行。
        console.log(`[V2 A4] 盲解完成: isSolvable=${result.isSolvable} governing=${result.blindGoverningItem || '（未报）'} 答案长度=${result.blindAnswer.length}`);
        return result;
    } catch (error) {
        const failReason = `盲解异常: ${(error as Error).message}`;
        console.warn(`[V2 A4] ${failReason}`);
        return {
            blindAnswer: "",
            blindFinalAnswer: "",
            blindPoints: [],
            blindGoverningItem: "",
            isSolvable: false,
            failReason,
        };
    }
}

