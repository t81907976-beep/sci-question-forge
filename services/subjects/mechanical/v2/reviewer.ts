import { callLLMTracked } from "../costTracker";
import {
    getDisciplineGuidance,
    getMatchedDisciplineForbiddenErrors,
    getMatchedStandardTables,
    getMatchedCriterionBranches,
    getPeakDifficulty,
} from "../disciplines";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { MechanicalV2QuestionDraft } from "./generator";
import {
    normalizeHandbookExcerpts,
    normalizeMarginReport,
    normalizeAnswerKey,
    normalizeDeliverables,
    renderDeliverablesSection,
} from "./generator";
import { lintMechanical, type MechanicalLintResult } from "./mechanical-lint";
import type { MechanicalQuestionType } from "../../../../types/multiNodeTypes";
import type { MechanicalDifficultyLevel } from "./difficulty";

/**
 * Mechanical V2 — A2/A3 审查 + 修复
 *
 * 机械专属拦截（与 materials 的三条对应但内容不同）：
 * 1. A2 前置确定性 lint（mechanical-lint.ts）：标准系列归属 / 圆整回代 / 算术复算 /
 *    governing 唯一性 / 模板入口 / 手册量隔离，命中即灌入 validityIssues。
 *    其中算术复算是全仓唯一会真正把解答里的等式算一遍的检查。
 * 2. MAX_REPAIR_CYCLES = 1。更高轮次本有理由（机械参数耦合重：圆整回代、多重夹逼，
 *    2 轮不够），但实测修复占单题墙钟约 45%，真正的时间黑洞是反复修仍然修不好、
 *    最后仍被丢掉的题。低轮次必须与下面第 4 条（非阻断硬伤落 degraded 而不丢题）
 *    **成对生效**：单独降轮次只会让更多题在 orchestrator-v2.ts 的
 *    `if (!reviewResult.passed) return null` 处被丢掉。
 * 3. unrepairable 归类：连续两轮出现 validity 硬伤即判不可修复，提前退出。
 * 4. validityIssues 分级：只有"题根本没成形"的那一类阻断，
 *    其余判为可人工修的，落 degraded 交人工质检。见 BLOCKING_ISSUE 与 splitBlockingIssues。
 *
 * 另有一条机械独有的审查口径反转：materials 要求"coreData 每一项都出现在题面"
 * （题干自足）；机械要求登记在 handbookLookupItems 里的量**必须缺席题面**。
 * 两者极性相反，不可混用。
 */

export interface MechanicalReviewResult {
    passed: boolean;
    validityIssues: string[];       // 事实/自洽/结构硬伤（全量，A3 修复与人工质检都读这一份）
    blockingIssues: string[];       // validityIssues 的阻断子集：只有这些会让题被丢掉
    difficultyIssues: string[];     // 难度不足（不阻断，落 degraded 交人工）
    depthIssues: string[];          // 结构防御（非阻断警告）
    overallVerdict: string;
    lintWarnings: string[];
}

export interface MechanicalReviewedDraft {
    draft: MechanicalV2QuestionDraft;
    reviewResult: MechanicalReviewResult;
    repairCycles: number;
    needsRegeneration: boolean;
    /** 'issues-deferred' 是机械独有的一档：题成形且答案数值可信，
     *  但仍有未修完的非阻断硬伤，落盘交人工（orchestrator 只比对 !== 'stable'，
     *  故任何新档位都会让 qualityLevel 落 degraded，这正是我们要的）。 */
    degradationLevel: 'stable' | 'oscillating' | 'diverging' | 'unrepairable' | 'issues-deferred';
    degradationReason: string;
    mechanicalLintTrace: MechanicalLintResult[];
}

const MAX_REPAIR_CYCLES = 1;  // 见文件头注释②

/** A2/A3 返回的数组项正常是字符串，但实测 LLM 会写成 `{ issue, severity }` 这类对象。
 *  此前一律 `String(item)` 塌成 "[object Object]"，后果远不止日志难看：
 *  ① A3 的修复提示词里【审查问题】变成一串 "[object Object]"，无从下手，白烧一轮；
 *  ② detectDegradation 靠 issue 原文比对判振荡，两个 "[object Object]" 恒相等，
 *     第 2 轮必判 oscillating 提前退出，修复轮次预算被白白用掉。
 *  这里不猜键名（各轮写法不一致），把对象里所有标量值取出来：正文类键直接给值，
 *  其余键带上键名，既保住内容也让不同 issue 之间仍然可区分。 */
const ISSUE_TEXT_KEYS = ['issue', 'description', 'message', 'text', 'problem', 'detail', 'reason', 'content', 'desc'];

/** 导出仅为可回归：塌成 "[object Object]" 会同时废掉 A3 修复与降级判定，必须有用例守着 */
export function normalizeIssueItem(item: unknown): string {
    if (item == null) return '';
    if (typeof item === 'string') return item.trim();
    if (typeof item !== 'object') return String(item).trim();

    const entries = Object.entries(item as Record<string, unknown>)
        .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
        .map(([k, v]) => [k, String(v).trim()] as [string, string])
        .filter(([, v]) => v.length > 0);
    if (entries.length === 0) {
        try { return JSON.stringify(item); } catch { return ''; }
    }
    // 正文键排前面且不带键名前缀，修复提示词里读起来就是原来的一句话；
    // 其余键（severity/location…）带键名附在括号里，保住可区分性。
    const isText = (k: string) => ISSUE_TEXT_KEYS.includes(k.toLowerCase());
    const texts = entries.filter(([k]) => isText(k)).map(([, v]) => v);
    const others = entries.filter(([k]) => !isText(k)).map(([k, v]) => `${k}: ${v}`);
    if (texts.length === 0) return others.join('，');
    return texts.join('；') + (others.length > 0 ? `（${others.join('，')}）` : '');
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(normalizeIssueItem).filter(Boolean) : [];
}

/** MechanicalV2QuestionDraft → lint 入参（字段名已对齐，此处只做类型收窄） */
function toLintDraft(draft: MechanicalV2QuestionDraft) {
    return {
        questionText: draft.questionText,
        referenceAnswer: draft.referenceAnswer,
        coreData: draft.coreData,
        referenceSteps: draft.referenceSteps,
        governingItem: draft.governingItem || undefined,
        handbookLookupItems: draft.handbookLookupItems,
        designFactorFloor: draft.designFactorFloor,
        // 表体不变量与判定余量两类检查依赖这三个字段；knowledgePoint 用于取该方向的不变量表
        knowledgePoint: draft.knowledgePoint,
        handbookExcerpts: draft.handbookExcerpts,
        marginReport: draft.marginReport,
        answerKey: draft.answerKey,
        // 交付清单查作法泄漏与覆盖度；questionType 用于让纯论述题豁免（落点是要点重合度，不是量）
        deliverables: draft.deliverables,
        questionType: draft.questionType,
    };
}

/** 按档位提升难度门槛，机械口径
 *
 *  ⚠️ 与 difficulty.ts / generator.ts 的三档定义对齐：档位分的是
 *  **题眼隐蔽度**（错法自洽性），不是体量。步数阈值必须与 buildDifficultyDirective
 *  的区间下沿一致（4-6 / 5-8 / 6-10），否则出现实测踩过的自相矛盾：
 *  A1 按提示词交了 7 步的困难题，A2 却按旧阈值报「少于 8 步」→ 白耗一轮修复、
 *  且把一道本来干净的题推进 degraded。**改这里必须同步改那两处。**
 *  体量已不是难度来源，故这一层的重心从步数转到"分叉是否自洽"。 */
function buildDifficultyGate(
    difficultyLevel: MechanicalDifficultyLevel,
    questionType: MechanicalQuestionType,
    peakDifficulty: string
): string {
    const stepUnit = questionType === 'short-answer' ? '论述层次/推理链条' : '计算步骤';
    if (difficultyLevel === 'peak') {
        return `   - ${stepUnit}数 < 6 → difficultyIssues（**不足才报；步数多不是优点，超过 10 步反而进 depthIssues**）
   - 不存在两处自洽错法联动（第一处错选不会改变第二处取值，两个分叉互不影响）→ difficultyIssues
   - 不构成设计闭环（缺少"反解尺寸 → 圆整到标准系列/目录型号 → 回代重查派生量 → 多准则校核 → 判定 governing 项"中的任一环）→ difficultyIssues
   - 无离散候选集夹逼（可行集显然宽松，随便取一个值都通过）→ difficultyIssues
   - 圆整回代未真实改变任何结论（回代只是形式上重写一遍）→ difficultyIssues
   - 未对齐以下"难度天花板"方向 → difficultyIssues：
${peakDifficulty ? peakDifficulty.split('\n').map(l => '     ' + l).join('\n') : '     （该方向未提供顶级难度描述，请以选型闭环级深度综合判断）'}
   - 单条公式一路代入即可解决 → difficultyIssues`;
    }
    if (difficultyLevel === 'hard') {
        return `   - ${stepUnit}数 < 5 → difficultyIssues（**不足才报；超过 8 步进 depthIssues，不进 difficultyIssues**）
   - **错法不自洽** → difficultyIssues：本档要求错选之后照样能算出一个像样的数、还能自圆其说（光看答卷分不出对错）。若错选会当场露馅（量纲不对/算不下去/结论明显荒谬），那只到标准档。
   - 参考答案未写出"错法会算出来的那个数" → difficultyIssues（写不出来即说明该错法不自洽）
   - 无圆整回代，或圆整后派生量未重算 → difficultyIssues
   - 明显是教材例题的换数搬用 → difficultyIssues`;
    }
    return `   - ${stepUnit}数 < 4，或属单步代入题 → difficultyIssues（**不足才报；超过 6 步进 depthIssues**）
   - 全程没有任何判据分叉/选行判断（纯正向代公式）→ difficultyIssues
   - 无任何手册/标准系列选行取值 → difficultyIssues
   - 无圆整回代环节 → difficultyIssues`;
}

/** 五条机械铁律的审查侧表述（题面泄漏、手册量泄漏、硬凑可行解、表体造反、自报虚报）
 *
 *  这一整块固定不变、**每轮审查都随 prompt 重发**，实测 review 类调用平均两万余字符、
 *  是数学 A2 的 7 倍，故刻意压到约 2.6k 字符：只删叙事性举证与重复举例，
 *  **九条的判定边界一条都没动**。以下几处是踩坑换来的，改动前先确认自己不是在放宽判定：
 *    2 的"多行摘录合规、不得因数值出现在题面就判泄漏"（曾因此全链静默出 0 题）
 *    4 的 20% / 20~50% / 50% 三档     5 的 marginReport 只提示不阻断
 *    6 的对称性判据                   8 的删句测试与口径白名单
 *    9 的清单按判据拆项
 */
const MECHANICAL_GATE_RULES = `【机械九条硬闸门（命中任一即 validityIssues 且 passed=false）】
1. **模板入口暴露**：题面点出了准则名（Goodman/Gerber/欧拉/约翰逊/均匀磨损/均压/von Mises/库仑-莫尔等）、判据分类结论（"本题属细长杆"）、governing 项结论（"主控失效模式为…"），或直接给出许用应力数值 → 判断层被交给答题方，题目退化为正向公式链。
2. **手册量泄漏（只判"唯一取值"，不判"附了摘录"）**：判的是**查表环节是否被跳过**，不是题面能不能出现手册数据。
   - 判泄漏：handbookLookupItems 登记的量，题面**只给一个唯一取值**、无需判断即可直接取用（"KA=1.25"、"[σH]=403 MPa"）。
   - **不判泄漏**：附的是**多行摘录**，含干扰行/档位分界/区间（"8级(v≤5,KV=1.15)、7级(5<v≤10,KV=1.10)…"），须先算条件再选行、必要时插值 —— 这是保证可解的正当做法，**绝不可因"数值出现在题面"就判泄漏**。摘录只有单行、或题面已直接指明取哪一行 → depthIssues 建议加干扰行，**不进 validityIssues**。
   - **反向也是硬伤：声明了待查量却没给摘录。** handbookLookupItems 每一项题面都须有对应多行摘录；写了"按下列摘录取值"而无摘录、或某待查量根本无表 → 题目**不可解**（各方各编一套表，答案必然对不上）。修法二选一：补摘录，或移出 handbookLookupItems 改为已知条件并注明"本题按此取值"。
   （这与"题干自足"相反：机械允许并鼓励题面缺最终定值，但须留可选行的摘录。）
3. **硬凑可行解**：**必须有证据**表明为了让结论"通过"而回调过载荷、许用值或安全系数（同一量在解答不同处取值不一致、载荷被无理由折减、许用值高于摘录该行的值）→ validityIssues。
   - 仅"安全系数贴近下限"（SF=1.52 对下限 1.5）**不是硬伤**：紧裕度是常态，也正是圆整回代能翻结论的张力所在。需提示则写 depthIssues。
   - 反向亦然：可行窗口为空是合法且更好的结论，如实给出"无可行方案"并指出放松方向者不得判不通过。
4. **摘录表体身份/方向搞反（validityIssues）**：摘录是出题器凭记忆写的、本仓无真实表体可查，请用学科知识核对每张摘录的**身份与单调方向**：
   - 是**除数**还是**乘数**（AGMA 的 KR：[σ]=St·YN/(KT·KR)，是**除数**，R 越高 KR 越大：90%→0.85、99%→1.00、99.9%→1.25；若写成"可靠度越高系数越小"的折减乘数即为反转）；
   - 沿条件轴**递增**还是**递减**（弹簧钢丝 Sut 随直径递减；轴承 a1 随可靠度要求提高而递减、R=90% 恒为 1.00；齿形系数 J/Y 随齿数递增；几何系数 I 随传动比递增；KV 恒 ≥1.0 且随速度递增）。
   判定尺度（与确定性检查器同门槛）：**数值偏离合理量级 20% 以内不算硬伤**（摘录写在题面，各方用同一套数据仍得一致可判的答案，最多 depthIssues）；**身份或单调方向搞反是硬伤**——真懂的人为纠正题面而被判错、照抄错表的反而得分，区分度直接反转；量级偏离 >50% 同样按硬伤；20~50% 写 depthIssues 提示复核、不阻断。
5. **自报字段虚报**：区分"影响可判性"与"只是元数据没算准"两档，**不要混为一谈**。
   - **硬伤（validityIssues）**：① answerKey.safetyFactors 与 referenceAnswer 正文的安全系数**不是同一个数**；② 接触项未换算到与 nd 同阶次（填了 SH 而非 SH²）；③ answerKey.governing 与解答里显式比较得出的最不利项**相矛盾**。这三者会让答题方与标准答案对不上。
   - **只提示不阻断（depthIssues）**：marginReport 三个百分数与 answerKey 安全系数算出来的有偏差。**这三个数不是权威值**——余量检查是拿 answerKey.safetyFactors 与 nd 重算的，自报值只作交叉参考。写入 depthIssues 并给出正确值，**不得因此判 passed=false**：把计算、圆整回代、governing 都正确的题因元数据百分数没算准而废掉是明确的误杀。
   另需核对（validityIssues）：同一题不得混用中式（GB/ISO：T=9550P/n、GB/T 1357 模数、可靠度在 S_Hmin/S_Fmin 里，**无 KR**）与美制（AGMA：径节 Pd、齿形系数 J/y、几何系数 I、KR 作除数）——混用会造出两套体系里都不存在的量，且无手册可核。
6. **交付清单夹带作法（validityIssues，判据同第 1 条）**：计算/混合题必须有「须报出的量」清单，且**只许出现量名/符号/单位/圆整规则**。
   - 判泄漏：清单项断言取值会变或需返工（"**更新后的**动载系数 KV"、"需重新选取的…"）、点出准则/模型名、给出 governing 结论或比较结果（"主控的弯曲应力"、"大于 1.3 的安全系数"）、写进答案数值。判据一句话：**答题方看到这一项，是知道了「要交什么」，还是知道了「该往哪拐」？**后者一律不许。合规写法是「最终采用的 KV」。
   - **不判泄漏**：「圆整后的齿宽」「回代重算的分度圆直径」——圆整并回代是题面已明文声明的通用纪律；rounding 里的取位规则（"GB/T 1357 第一系列"、"两位小数"）同样合规。**多条并列判据的反解值对称列全也不判泄漏**（"接触反解模数 mH"+"弯曲反解模数 mF"），闸门 9 正要求这样拆开；判据是**对称性**——并列判据一个不漏 → 合规，只列其一或漏掉一条 → 泄漏（等于告知那条是主控）。项名出现换算后的量（"SH²"）仍判泄漏，属第 8 条。
   - 只提示不阻断（depthIssues）：清单与 answerKey.values/safetyFactors 对不上（写法不同不等于漏项）；题面缺【须报出的量】那一节（代码会自动补）。
   - **信噪比（depthIssues，只提示不得阻断）**：清单 >8 项、或题面正文（不含清单节）>450 字，通常意味着列了一堆纯正向脚手架量（传动比、转矩、齿数、分度圆、中心距、切向力…）。这些量报错了只说明答题方算错一步乘除，不说明它不懂本题要考的判断，反而把题眼的信号淹掉、并让盲解复现不出（复现不出的题没有判据价值）。请指出**哪些项应改为在题面直接给出数值**——判据是逐量自问"把这个数给进题面，本题的题眼还在不在"，还在就该给、没了就绝不能给。⚠️ 并列判据的对称性优先于项数上限，不得为压缩项数而只列其中一条。
7. **解答里有凭空引入的数值（validityIssues）——按数值溯源逐个核**：这是第 2 条的一般形式，请对参考解答做一遍完整扫描。每个被代入的数字只有三个合法来源：① 题面明写的已知条件；② 题面某张摘录的某一行（含两行间插值）；③ 由前面已报出的量算出来的。**三者都指不到 → 出题器凭空引入，题目不可解**（各方各编一个值，答案必然对不上）。
   - 最常漏的一类是**判据阈值本身没给**：解答拿 nd、许用变形、许用温升、许用磨损量去比较"是否满足"，而题面只写"以 SF 与 nd 比较"、从未给 nd 的数值。必判 validityIssues：反解尺寸、判定满足、确定 governing 全要用它。同时核 designFactorFloor 字段是否与题面一致。
   - 另一类是中途出现的材料常数/系数/几何量（E、G、ZE、I、J/Y、f、许用比例…），题面既没给、也无摘录可查、又不是算出来的。
   - **不判硬伤**：由题面已知量按公式算出的中间值（哪怕没写算式，只要能反推出来）；通用常数（π、g）；由摘录选行+插值得到的值。
8. **同阶次换算/查表依据/准则选择/失效判定被写进题面（validityIssues）**：这是第 1 条最容易被"为了统一口径"绕过的一处。判定用**删句测试**：把题面那句交待做法的话删掉，**还能不能算出唯一正确答案**？
   - **算不出**（两种都站得住的算法流派、纯人为约定、取位精度）→ 是**口径**，合规，必须留。例：「本题按给定的修正 Lewis 式，不采用完整 AGMA 弯曲式」、「许用应力不含设计系数 nd，SF 定义为 [σF]/σF、SH 同理」、「保留两位小数」。**不得因这类句子判泄漏，那是误杀。**
   - **算得出、但答题方很可能算错** → 是**题眼**，判 validityIssues。四类：① 同阶次换算（"以 SH² 与 nd 比较"——接触应力 ∝ √载荷，SH² 是唯一正解）；② 查表行的选取依据（"表面硬度定接触疲劳极限、芯部硬度定弯曲疲劳极限"——渗碳齿轮的硬度分工有唯一正解）；③ 准则/模型的选择（"按均匀磨损模型"）；④ 失效模式的判定（"本题属细长杆"）。
   一句话区分：**前者不说就有两个都自洽的答案（人为约定），后者不说答题方也该算对、算错就是该扣的分。**
9. **多准则反解只做了一条，或反解依据与 governing 矛盾（validityIssues）**：凡有多条并列判据（接触/弯曲、簧圈/钩部、强度/刚度/稳定性/共振、静强度/疲劳…），"由判据反解设计量"的步骤（反解模数、簧丝直径、轴径、齿宽、圈数…）必须**对每条判据各反解一次并取最严者**，且取到的那条应与最终报出的 governing 是同一条。
   - 一边只按弯曲反解尺寸、一边判定"主控为接触"，是**参考答案自身的矛盾**：真正控制设计的是接触，反解就该由接触定。判 validityIssues 并指出应补哪一条。
   - 后果不只是不优雅：两条准则反解值圆整后可能恰好得到同一个标准值、最终设计没变，但清单里只列一个"连续模数"时，**正确按主控准则反解的答题方会被判错**——判分口径被写坏。
   - 因此还要核 deliverables：**每条准则的反解值各占一项**（"接触反解模数 mH"、"弯曲反解模数 mF"）。若合并成一个"连续模数"而解答只按一条准则算，判 validityIssues；若解答已正确取最严者、只是清单没拆开，写 depthIssues 建议拆项。`;

interface ReviewPromptContext {
    draft: MechanicalV2QuestionDraft;
    lintReport: string;
    lintWarningsSection: string;
    disciplineGuidance: string;
    forbiddenErrors: string[];
    standardTables: string[];
    criterionBranches: string[];
    singleQuestion: boolean;
    difficultyGate: string;
}

/** 结构化摘录渲染成审查可读的表格文本（含身份与条件轴，供 LLM 核对方向） */
function formatExcerptsForReview(draft: MechanicalV2QuestionDraft): string {
    const excerpts = draft.handbookExcerpts || [];
    if (excerpts.length === 0) return '（未自报结构化摘录）';
    return excerpts
        .map(ex => {
            const rows = ex.rows
                .map(r => `      · ${r.condition || (r.conditionValue ?? '—')} → ${r.value}${ex.unit && ex.unit !== '—' ? ' ' + ex.unit : ''}`)
                .join('\n');
            return `  - ${ex.name}（符号 ${ex.symbol}；身份：${ex.role}；条件轴：${ex.conditionAxis || '未注明'}）\n${rows}`;
        })
        .join('\n');
}

function formatAnswerKeyForReview(draft: MechanicalV2QuestionDraft): string {
    const key = draft.answerKey;
    if (!key) return '（未自报 answerKey）';
    const values = key.values.map(v => `${v.name}=${v.value}${v.unit ? ' ' + v.unit : ''}`).join('；') || '（无）';
    const factors = key.safetyFactors
        .map(f => `${f.item}=${f.value}${f.note ? `（${f.note}）` : ''}`)
        .join('；') || '（无）';
    return `  结论：${key.conclusion || '（空）'}\n  关键量：${values}\n  安全系数（应已换算到与 nd 同阶次）：${factors}\n  自报 governing：${key.governing || '（空）'}`;
}

/** 交付清单渲染成审查可读的一行一项（供 A2 核对是否夹带条件从句、是否被 answerKey 覆盖） */
function formatDeliverablesForReview(draft: MechanicalV2QuestionDraft): string {
    const items = draft.deliverables || [];
    if (items.length === 0) return '（未自报「须报出的量」清单）';
    return items
        .map((d, i) => `  ${i + 1}. ${d.name}${d.symbol && d.symbol !== '—' ? `（${d.symbol}）` : ''} — 单位 ${d.unit || '—'}${d.rounding ? `；圆整 ${d.rounding}` : ''}`)
        .join('\n');
}

function formatMarginReportForReview(draft: MechanicalV2QuestionDraft): string {
    const r = draft.marginReport;
    if (!r) return '（未自报 marginReport）';
    const fmt = (v?: number) => (v === undefined ? '未填' : `${v.toFixed(1)}%`);
    return `  governing 项间差距：${fmt(r.governingGapPercent)}；对 nd 的余量：${fmt(r.ndGapPercent)}；合法方法差异漂移：${fmt(r.worstLegalVariationPercent)}`;
}

/** 审查 prompt 的共同头部 */
function buildReviewHead(ctx: ReviewPromptContext, roleLine: string, bodyBlocks: string): string {
    const d = ctx.draft;
    return `${roleLine}

【知识点方向】：${d.knowledgePoint}
【考察维度】：${d.chosenDimension}

【题目】
${d.questionText}

${bodyBlocks}

【出题器自报的主控失效项】
${d.governingItem || '（未填写）'}

【出题器自报的手册待查量（这些量的数值必须缺席题面）】
${d.handbookLookupItems.length > 0 ? d.handbookLookupItems.join('、') : '（未声明）'}

【出题器自报的圆整量】
${d.roundedQuantities.length > 0 ? d.roundedQuantities.join('；') : '（未声明）'}

【出题器自报的手册摘录结构化副本（⚠️ 请用你的学科知识逐张核对身份与单调方向，本仓没有真实表体可查）】
${formatExcerptsForReview(d)}

【出题器自报的紧凑答案（须与 referenceAnswer 一致）】
${formatAnswerKeyForReview(d)}

【出题器自报的判定余量】
${formatMarginReportForReview(d)}

【出题器自报的「须报出的量」清单（题面末尾那一节的来源）】
${formatDeliverablesForReview(d)}

${ctx.lintReport}

${ctx.lintWarningsSection}

${ctx.disciplineGuidance}

${MECHANICAL_GATE_RULES}
${ctx.standardTables.length > 0 ? `\n【本方向涉及的标准表与离散系列（审查取值是否落在系列上、选行依据是否写明）】\n${ctx.standardTables.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n` : ''}${ctx.criterionBranches.length > 0 ? `\n【本方向的判据分叉点（审查题目是否命中至少一个，且题面未点明选哪一支）】\n${ctx.criterionBranches.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n` : ''}${ctx.forbiddenErrors.length > 0 ? `\n【本方向禁止出现的错误（审查清单，参考答案自身也不得犯）】\n${ctx.forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}`;
}

const REVIEW_JSON_SPEC = `输出严格 JSON，不含 markdown：
{
  "passed": true,
  "validityIssues": [],
  "difficultyIssues": [],
  "depthIssues": [],
  "overallVerdict": "一句话结论"
}
⚠️ 三个 issue 数组的**每一项都必须是一个完整的中文句子字符串**（说清是哪个量、哪一步、错在哪、应改成什么），**不许写成 {"issue": ...} 这类对象，也不许只写一个标题词**。下游修复环节直接把这些句子原文喂给修复器，写成对象等于修复器什么都收不到。`;

function buildCalculationReviewPrompt(ctx: ReviewPromptContext): string {
    const d = ctx.draft;
    const body = `【求解目标】
${d.requiredAnswer}

【标准答案】
${d.referenceAnswer}

【参考步骤】
${d.referenceSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

【核心数据】
${JSON.stringify(d.coreData, null, 2)}`;

    return `${buildReviewHead(ctx, '你是机械设计领域的资深审查专家（机械设计手册与 Shigley 体系皆熟）。请审查以下设计/校核题与标准答案是否可发布。', body)}
【审查维度】：
1. **工程与事实自洽性（validityIssues）**：
   - 选型结果是否落在标准离散系列上（模数/簧丝直径/键宽/轴承内径等），有无使用"连续解"
   - 圆整之后所有派生量是否都用圆整值重算（若解答后文仍在用圆整前的数值，即为未回代）
   - 材料常数、寿命指数（球 ε=3 / 滚子 ε=10/3）、摩擦系数、效率（必须 <1）是否物理可行
   - 公式的**适用条件**是否满足（如铸铁不得用 DE/MSS 须用库仑-莫尔；欧拉式仅适用于大柔度杆）
   - 单位与口径是否一致（T=9550P/n 中 P 为 kW、n 为 r/min 时 T 为 N·m）
   - 算术是否真实成立（逐式复算，相对偏差 >1.5% 即硬伤）
2. **governing 项唯一性（validityIssues）**：
   - 出现多个安全系数时，解答是否**显式比较**并取最不利者
   - 自报的 governingItem 是否真的对应最不利那一项（不是最小值即为标注错误）
   - 阶次是否正确换算（如接触安全系数须先平方再与设计系数比较）
3. **九条硬闸门（validityIssues）**：见上方【机械九条硬闸门】，逐条核对。
4. **难度合理性（difficultyIssues）**：
${ctx.difficultyGate}
5. **结构防御（depthIssues，非阻断）**：
   - 是否存在需要答题方自行识别的隐含条件
   - 手册摘录是否含干扰行与档位分界（只给单行等于变相给答案）
   - 可行窗口是否有真实的夹逼张力
6. **单问约束**：${ctx.singleQuestion ? '必须单问；若有 (1)(2) 拆分，进入 difficultyIssues。' : '最多 2 问且第 1 问为第 2 问的必要前提。'}

${REVIEW_JSON_SPEC}`;
}

function buildShortAnswerReviewPrompt(ctx: ReviewPromptContext): string {
    const d = ctx.draft;
    const body = `【论述问题】
${d.requiredAnswer}

【参考答案（完整论述）】
${d.referenceAnswer}

【核心要点】
${(d.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}`;

    return `${buildReviewHead(ctx, '你是机械设计领域的资深审查专家。请审查以下**简答题/论述题**与参考答案是否可发布。', body)}
【审查维度】：
1. **学科事实正确性（validityIssues）**：
   - 引用的准则/判据名称与其**适用条件**是否正确（Goodman/Gerber/Soderberg 的差别、欧拉与约翰逊的分界、均匀磨损与均压模型的前提）
   - 失效机理的因果链是否成立，有无因果倒置
   - 量的口径是否混淆（如把接触安全系数与弯曲安全系数的阶次混为一谈）
2. **模板入口（validityIssues）**：题面是否已经点出了准则名或判断结论，使题目退化为背诵题。
3. **论述深度（difficultyIssues）**：
${ctx.difficultyGate}
   - 参考答案是否只是定义复述
   - 是否覆盖机理 + 判据 + 工程含义三个层次
   - referencePoints 是否 ≥4 条且每条有实质内容
4. **结构与完整性（depthIssues，非阻断）**：论述是否有条理、是否遗漏明显关联概念、引用是否精确到具体准则名。
5. **单问约束**：${ctx.singleQuestion ? '必须是单个论述问题；若有 (1)(2) 拆分，进入 difficultyIssues。' : '最多 2 问且互为前置。'}

${REVIEW_JSON_SPEC}`;
}

function buildMixedReviewPrompt(ctx: ReviewPromptContext): string {
    const d = ctx.draft;
    const body = `【求解目标】
${d.requiredAnswer}

【参考答案（分小问）】
${d.referenceAnswer}

【计算推导步骤】
${(d.referenceSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n') || '（无）'}

【论述核心要点】
${(d.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无）'}

【核心数据】
${JSON.stringify(d.coreData, null, 2)}`;

    return `${buildReviewHead(ctx, '你是机械设计领域的资深审查专家。请审查以下**混合题（含计算小问 + 论述小问）**与参考答案是否可发布。', body)}
【审查维度】：
1. **工程自洽与事实正确性（validityIssues）**：
   - 计算小问：标准系列归属、圆整回代、算术复算、单位口径、公式适用条件
   - 论述小问：准则名与适用条件是否正确、有无概念混淆
   - 计算结果与论述内容之间是否矛盾
2. **混合题结构合规性（validityIssues，阻断）**：
   - 是否确实同时含至少 1 个计算小问（有数值答案）和 1 个论述小问
   - 各小问是否处在**同一台机器、同一工况**
   - 论述小问是否**基于**前面的计算结果展开（各自为政或沦为定义复述 → validityIssues）
3. **九条硬闸门（validityIssues）**：见上方【机械九条硬闸门】，逐条核对。
4. **难度与深度（difficultyIssues）**：
${ctx.difficultyGate}
   - 计算小问是否 ≥4 步且含一处判据分叉
   - referenceSteps 是否 ≥4 条、referencePoints 是否 ≥3 条且有实质内容
5. **结构与完整性（depthIssues，非阻断）**：小问编号与递进关系是否合理、参考答案是否按小问分别作答。
6. **小问数量约束**：${ctx.singleQuestion ? '小问总数必须为 2（1 计算 + 1 论述）；超出进入 difficultyIssues。' : '小问总数 2-4 个，需形成递进推理链。'}

${REVIEW_JSON_SPEC}`;
}

/**
 * marginReport 百分数偏差的降档兜底。
 *
 * 提示词已把这类偏差划归 depthIssues，但 A2 仍可能按老习惯塞进 validityIssues——实测
 * 出现过：A2 的 overallVerdict 写着"计算、圆整回代、governing 结论基本正确，修正该
 * 元数据后可发布"，却因为把百分数不符判成硬伤而 passed=false，整道题静默作废。
 *
 * 这三个百分数不是权威值：checkDecisionMargin 是拿 answerKey.safetyFactors 与 nd 重算的，
 * 自报值只作交叉参考。所以只要一条 issue 明确是在说余量百分数的偏差，且**没有**同时提到
 * 真正影响可判性的三件事（安全系数与正文不一致 / 接触项未平方 / governing 矛盾），
 * 就降到 depthIssues。判据写得窄，宁可漏降也不能把真硬伤放行。
 */
const MARGIN_META_ISSUE = /(marginReport|自报余量|余量字段|自报的判定余量|判定余量.{0,6}(不符|不一致|偏差|背离))/;
// governing 有两种出现方式，必须分开：governingGapPercent 是元数据百分数（可降档），
// answerKey.governing / 主控项 是结论（矛盾即真硬伤）。故对后者用否定预查排除前者，
// 且允许 40 字距离——A2 常写成"governing 填 bending 与解答显式比较得出的 contact 矛盾"。
const REAL_CONSISTENCY_ISSUE = new RegExp(
    [
        'SH\\s*²', 'SH\\^2', '平方', '阶次',
        'governing(?!GapPercent)(?!\\s*项?间?差距)[\\s\\S]{0,40}(矛盾|不符|不一致|错|填错)',
        '主控项[\\s\\S]{0,20}(矛盾|不符|不一致|错)',
        '与\\s*referenceAnswer.{0,10}不一致',
        '安全系数.{0,10}(与解答|与正文|与\\s*referenceAnswer).{0,10}(不一致|不符|背离)',
        '体系混用', '中式.{0,4}美制',
    ].join('|'),
);

/** 导出仅为可回归：判据是正则，误降档会放行真硬伤，必须有正反配对用例守着 */
export function downgradeMarginMetaIssues(validityIssues: string[], depthIssues: string[]): void {
    for (let i = validityIssues.length - 1; i >= 0; i--) {
        const issue = validityIssues[i];
        if (MARGIN_META_ISSUE.test(issue) && !REAL_CONSISTENCY_ISSUE.test(issue)) {
            validityIssues.splice(i, 1);
            const note = `[降档自 validityIssues：marginReport 百分数偏差不影响可判性] ${issue}`;
            if (!depthIssues.includes(note)) depthIssues.push(note);
        }
    }
}

/**
 * validityIssues 的阻断/非阻断分级。
 *
 * 起因：逐题盲解复核后发现，绝大多数被判 validity 硬伤的题是"改一处就能用"，
 * 真该弃的只有"题面声称附了三张表而实际没有"这一类。而 orchestrator-v2.ts 的
 * `if (!reviewResult.passed) return null` 会把它们一并丢掉，磁盘上连给人看的
 * 东西都不留——人工质检拿不到题，就没法判它到底是"缺一个数"还是"根本没成形"。
 *
 * 所以只保留下面这些阻断，判据是**这道题还能不能被人接着修**：
 *   ① 题眼被写进题面（模板入口 / 交付清单夹带作法 / 手册量给成唯一取值）→ 交底后
 *      最弱的答题方也能照做对，区分度归零，而评测要的恰恰是区分度。这类"看起来完全
 *      正常"，人工质检最难发现，必须在这里拦住。
 *   ② 审查未跑成——那不是题的问题，而是对这道题一无所知，见下方规则表。
 *
 * ⚠️ **"题面缺摘录/缺唯一化依据"这一条不阻断**，依据有两条：
 *   (a) 判可用性的活口子是 A4 盲解一致（answersAgree）：真因为缺表而两套值对不上的
 *       题，answersAgree 自然是 false，在分流那一步就筛掉了，不必在这里提前丢；
 *   (b) 这条正则是丢题主因（丢掉的题多半只是少几行表值），与"不丢只降级"直接冲突。
 *       缺表的题仍留在 validityIssues 里 → A3 下一轮照旧尝试补表，没补上就落进
 *       metadata.reviewValidityIssues 交人工，按普通警告处理。
 * 副作用要认：`题目不自足|不可解|缺少唯一化依据` 也一并不再阻断，那类题现在同样落
 * degraded。可接受——degraded 本来就不进评测池。
 *
 * 其余（算术不自洽、圆整未回代、标准系列取错、governing 标注错、表体身份/方向反转、
 * 体系混用…）全部放行为 degraded：它们都是**定点可改**的，且人工一眼能看出改哪里。
 * 表体身份反转虽然危害大，但改法明确（照手册把那张表方向改回来），留给人工比丢掉划算。
 *
 * 判据故意写成"白名单式"——只列阻断项，没匹配上的默认非阻断。反过来写（列非阻断项）
 * 会让 A2 新造的措辞默认阻断，等于这条分级白做。
 */
const BLOCKING_ISSUE_RULES: { label: string; re: RegExp }[] = [
    {
        // 这一条不是"题的问题"，但必须阻断：A2 一次都没跑成时我们对这道题一无所知，
        // 放行等于把没审过的题当审过的发出去。判据与下方 REVIEW_INFRA_ISSUE 同源，
        // 此处内联正则而不引用那个常量——它定义在本文件更下方，模块求值期引用会踩 TDZ。
        label: '审查未跑成（题目未被实际审查）',
        re: /^审查失败[:：]/,
    },
    {
        // ⚠️「题面缺摘录/缺唯一化依据」不在此阻断：缺表的可用性由 A4 盲解一致兜住，
        // 想加回来之前先读上方注释里的理由。
        label: '题眼被写进题面（交底致区分度归零）',
        re: /(模板入口暴露|手册量给成唯一取值|交付清单泄漏作法|泄漏|交底|失去.{0,6}区分度)/,
    },
];

/** 导出仅为可回归：这条判据决定一道题是被丢掉还是落盘交人工，两个方向错都很贵 */
export function splitBlockingIssues(validityIssues: string[]): { blocking: string[]; reasons: string[] } {
    const blocking: string[] = [];
    const reasons: string[] = [];
    for (const issue of validityIssues) {
        const hit = BLOCKING_ISSUE_RULES.find(r => r.re.test(issue));
        if (hit) {
            blocking.push(issue);
            if (!reasons.includes(hit.label)) reasons.push(hit.label);
        }
    }
    return { blocking, reasons };
}

function normalizeReviewResult(
    parsed: Partial<MechanicalReviewResult>,
    lint: MechanicalLintResult
): MechanicalReviewResult {
    const validityIssues = normalizeStringArray(parsed.validityIssues);
    const difficultyIssues = normalizeStringArray(parsed.difficultyIssues);
    const depthIssues = normalizeStringArray(parsed.depthIssues);

    // 先降档：只针对 A2 自己写的 issue，lint 灌入的在后面（lint 从不产出这类 issue）
    downgradeMarginMetaIssues(validityIssues, depthIssues);

    // 机械专属：确定性 lint 命中一律灌入 validityIssues（LLM 漏看也拦得住）
    for (const v of lint.violations) {
        if (!validityIssues.includes(v)) validityIssues.push(v);
    }

    // passed 只看阻断子集。非阻断硬伤仍留在 validityIssues 里，
    // 一方面 A3 下一轮照样会去修，一方面 orchestrator 把它落进 metadata 的
    // reviewValidityIssues，成为 xlsx「审查遗留」列 —— 人工质检要的正是这份清单。
    const { blocking } = splitBlockingIssues(validityIssues);
    // difficultyIssues 一并放行：难度不足的题是"能用但偏简单"，不是坏题，
    // 而评测分流本来就要按实测准确率/区分度决定去留，不必在这里替人工做决定。
    const passed = blocking.length === 0;
    return {
        passed,
        validityIssues,
        blockingIssues: blocking,
        difficultyIssues,
        depthIssues,
        overallVerdict: String(parsed.overallVerdict || (passed ? '通过' : '未通过')),
        lintWarnings: lint.warnings,
    };
}

/** 修复结果回填：先铺 previous，再逐字段覆盖；4 个机械专属字段缺失时保留原值 */
function normalizeDraft(
    parsed: Partial<MechanicalV2QuestionDraft>,
    previous: MechanicalV2QuestionDraft
): MechanicalV2QuestionDraft {
    const steps = normalizeStringArray(parsed.referenceSteps);
    const points = normalizeStringArray(parsed.referencePoints);
    const lookups = normalizeStringArray(parsed.handbookLookupItems);
    const rounded = normalizeStringArray(parsed.roundedQuantities);
    const floorRaw = Number(parsed.designFactorFloor);
    const nextAnswer = String(parsed.referenceAnswer || previous.referenceAnswer);
    const nextQuestionText = String(parsed.questionText || previous.questionText);
    // 修复动了数值却漏报结构化字段时，上一轮的值已经过期。实测出现过这个形态：
    // 修复把 SF 2.01/SH² 1.73 改成 1.65/1.52（余量从 16% 掉到 8%），answerKey 未同步，
    // checkDecisionMargin 拿旧值复算仍是 16%，判定余量检查被过期数据挡住。
    // 对应的源变了就一律丢弃未同步的自报值——宁可让检查静默，也不能让它基于假数据放行。
    // 摘录跟题干绑（表体写在题面），余量与答案键跟解答绑。
    const answerChanged = nextAnswer !== previous.referenceAnswer;
    const stemChanged = nextQuestionText !== previous.questionText;
    const nextExcerpts = normalizeHandbookExcerpts((parsed as Record<string, unknown>).handbookExcerpts);
    const nextMargin = normalizeMarginReport((parsed as Record<string, unknown>).marginReport);
    const nextAnswerKey = normalizeAnswerKey((parsed as Record<string, unknown>).answerKey);
    // 交付清单与摘录/余量不同：它描述"要交什么"，改题面数值并不使它过期，所以缺失时
    // 一律沿用上一轮，不跟着 stemChanged 清空。真正要防的是修复把题干整段重写、把
    // 「须报出的量」那一节丢了——那种情况下面按清单重新补一节回去。
    const nextDeliverables = normalizeDeliverables((parsed as Record<string, unknown>).deliverables);
    const deliverables = nextDeliverables.length ? nextDeliverables : (previous.deliverables || []);
    let questionText = nextQuestionText;
    if (previous.questionType !== 'short-answer' && deliverables.length > 0 && !questionText.includes('须报出的量')) {
        questionText += renderDeliverablesSection(deliverables);
    }
    return {
        ...previous,
        problemId: String(parsed.problemId || previous.problemId),
        knowledgePoint: String(parsed.knowledgePoint || previous.knowledgePoint),
        chosenDimension: String(parsed.chosenDimension || previous.chosenDimension),
        questionType: previous.questionType,
        difficultyLevel: previous.difficultyLevel,
        questionText,
        coreData: (parsed.coreData && typeof parsed.coreData === 'object') ? parsed.coreData : previous.coreData,
        requiredAnswer: String(parsed.requiredAnswer || previous.requiredAnswer),
        referenceAnswer: nextAnswer,
        referenceSteps: steps.length ? steps : previous.referenceSteps,
        referencePoints: points.length ? points : (previous.referencePoints || []),
        governingItem: String(parsed.governingItem || previous.governingItem),
        handbookLookupItems: lookups.length ? lookups : previous.handbookLookupItems,
        designFactorFloor: Number.isFinite(floorRaw) && floorRaw > 0 ? floorRaw : previous.designFactorFloor,
        roundedQuantities: rounded.length ? rounded : previous.roundedQuantities,
        // 三个结构化字段：修复输出里解析得到就用新的；缺失时只有"对应的源未变"才敢保留上一轮的
        handbookExcerpts: nextExcerpts.length
            ? nextExcerpts
            : (stemChanged ? [] : previous.handbookExcerpts),
        marginReport: nextMargin ?? (answerChanged ? undefined : previous.marginReport),
        answerKey: nextAnswerKey ?? (answerChanged ? undefined : previous.answerKey),
        deliverables,
    };
}

async function reviewQuestion(
    draft: MechanicalV2QuestionDraft,
    lint: MechanicalLintResult,
    problemIndex: number,
    singleQuestion: boolean
): Promise<MechanicalReviewResult> {
    const peakDifficulty = getPeakDifficulty(draft.knowledgePoint);
    const isShortAnswer = draft.questionType === 'short-answer';
    const isMixed = draft.questionType === 'mixed';

    const lintReport = lint.hasViolation
        ? `⚠️ 前置确定性检查发现以下硬伤（含算术逐式复算结果，请在你的 validityIssues 中确认或补充说明）：\n${lint.violations.map((v, i) => `${i + 1}. ${v}`).join('\n')}`
        : '前置确定性检查无硬伤。';

    const ctx: ReviewPromptContext = {
        draft,
        lintReport,
        lintWarningsSection: lint.warnings.length > 0
            ? `【前置警告（请重点复核）】：\n${lint.warnings.map((w, i) => `${i + 1}. ${w}`).join('\n')}`
            : '',
        disciplineGuidance: getDisciplineGuidance(draft.knowledgePoint),
        forbiddenErrors: getMatchedDisciplineForbiddenErrors(draft.knowledgePoint),
        standardTables: getMatchedStandardTables(draft.knowledgePoint),
        criterionBranches: getMatchedCriterionBranches(draft.knowledgePoint),
        singleQuestion,
        difficultyGate: buildDifficultyGate(draft.difficultyLevel || 'standard', draft.questionType, peakDifficulty),
    };

    const prompt = isMixed
        ? buildMixedReviewPrompt(ctx)
        : isShortAnswer
        ? buildShortAnswerReviewPrompt(ctx)
        : buildCalculationReviewPrompt(ctx);

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'review',
            temperature: 0.2,
            responseFormat: 'json',
            systemPrompt: '你是严格的机械设计审查器（熟悉机械设计手册与 Shigley 体系），只输出严格 JSON。',
        }, problemIndex, 'a2_review')).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return normalizeReviewResult({
                passed: false,
                validityIssues: ['审查响应无法解析为 JSON'],
                overallVerdict: '审查响应解析失败',
            }, lint);
        }
        return normalizeReviewResult(cleanAndParseJSON(jsonMatch[0]) as Partial<MechanicalReviewResult>, lint);
    } catch (error) {
        return normalizeReviewResult({
            passed: false,
            validityIssues: [`审查失败: ${(error as Error).message}`],
            overallVerdict: '审查异常',
        }, lint);
    }
}

interface RepairPromptContext {
    draft: MechanicalV2QuestionDraft;
    issuesSection: string;
    isDeep: boolean;
    cycle: number;
    disciplineGuidance: string;
    singleQuestion: boolean;
}

/** 修复模式说明：deep 允许换情境/换数据，detail 只动数值与措辞 */
function repairModeLine(ctx: RepairPromptContext): string {
    return ctx.isDeep
        ? `【本轮修复模式】：深度修复（第 ${ctx.cycle} 轮）—— 允许调整工程情境、设计输入、圆整目标与准则组合`
        : `【本轮修复模式】：细节修复（第 ${ctx.cycle} 轮）—— 保持情境不变，仅修正数值、选行依据与表述`;
}

/** 三种题型共用的修复硬性要求（三条铁律的修复侧表述） */
const MECHANICAL_REPAIR_RULES = `【修复硬性要求（机械）】：
1. 必须消除所有 validityIssues 与 difficultyIssues。
2. 题面不得点出准则名、判据分类结论、governing 项结论或许用应力数值（模板入口）。**逐句做删句测试**：删掉这句话后还能不能算出唯一正确答案？算不出，它就是口径（该留）；算得出、只是容易错，它就是题眼（必删）。其中**同阶次换算（"以 SH² 与 nd 比较"）、查表行的选取依据（"表面硬度定接触、芯部硬度定弯曲"）、准则/模型的选择、失效模式的判定，这四类一律是题眼**，不许以"统一口径""保证答案唯一"为名写进题面——它们本来就有唯一正确答案，不说答题方也该算对，算错就是该扣的分。只有人为约定（许用应力含不含 nd、圆整方向、报数有效位）才允许写进题面。
   ⚠️ 若 A2 提的是"口径不明确/答案不唯一"，而唯一的消法是交底上述四类之一，**正确做法不是写进题面，而是把这段推理写进参考解答**（解答不向答题方公开）；题面保持不泄漏。同一处在"泄漏"与"不唯一"之间来回被提时，一律以**不泄漏**为准。
   实测最常见的三个泄漏载体，必须逐个自查：① **摘录表的表名/条件轴不得编码分工**——不许写"Sc 表中表面硬度…、St 表中芯部硬度…"，只写量名与条件轴（如"接触疲劳极限 Sc（HRC）"），两张表的条件轴同为硬度时也不许注明各自该取哪个硬度；题面把表面硬度与芯部硬度两个数分别给出即可。② **deliverables 项名不得暴露换算，也不得只点其中一条准则**——不许出现"SH²""平方后的接触安全系数"（那是同阶次换算，属四类题眼之一）；不许只列"按弯曲准则反解的模数"这**一项**（只点一条 = 告知这条就是主控，判断层没了）。⚠️ 但**把全部并列准则对称列全是要求而不是泄漏**：「接触反解模数 mH」+「弯曲反解模数 mF」两项并列必须都写（见第 5 条与闸门 9），因为"齿轮要同时校核接触与弯曲"是常识，对称列全不透露哪一条控制设计；真正的题眼是"取哪一个"，而那一步仍留给答题方。判据是**对称性**：所有并列判据一个不漏地列出 → 合规；只列一条、或多列一条却漏另一条 → 泄漏。③ **求解要求/考察维度不得罗列判定路径**——不许写"比较 SF 与 nd、SH² 与 nd"，只写"判断是否满足设计要求，并指出主控失效项"。
3. handbookLookupItems 中登记的量，其数值**不得**出现在题面文字中；若需保证可解性，只能附多行手册摘录（含干扰行与档位分界）。
4. 选型结果必须落在标准离散系列上；圆整后所有派生量必须在解答中用圆整值重算，并写明"以下派生量按圆整值重算"。
5. 多准则校核必须显式比较各安全系数并指明 governing 项（注意接触安全系数须先平方再与设计系数比较）。**这一条只约束参考解答与 answerKey，不得因此把平方换算写进题面**（见第 2 条）。
6. 禁止为凑出"通过"而调整载荷或许用值；若可行窗口为空，就如实给出该结论，并指出是哪条约束夹空的、唯一的放松方向是什么。
7. 每一步纯数值等式必须真实成立（会被确定性算术复算器逐式核验，相对偏差 >1.5% 即不合格）。
8. **摘录表体的身份与单调方向必须正确**：数值落在合理量级带外侧 20% 以内可以接受（超出 20% 会被提示、超出 50% 判硬伤），但"除数写成乘数"、"递增写成递减"是硬伤（会让懂的人被判错、照抄的人得分，区分度反转）。若对某量的真实表体没把握，就换一个有把握的量，或把它作为已知条件直接给出并注明"本题按此取值"（此时从 handbookLookupItems 里移除），**不要硬编一张表**。
9. **同一题内不得混用中式与美制两套系数体系**（中式没有 KR，可靠度在 S_Hmin/S_Fmin 里；美制用 KR 作除数）。选定一套后公式、系数名、标准系列、单位制全题贯穿。
10. 若修改了题面摘录或解答数值，**必须同步更新** handbookExcerpts、answerKey、marginReport 三个结构化字段。其中 answerKey.safetyFactors 必须与解答正文写的数值一致、且已换算到与 nd 同阶次（接触项填 SH²）——这一项不一致是硬伤。marginReport 三个百分数请按新的安全系数重算，但它只作交叉参考、不是权威值：**算不准也不要因此回改安全系数或解答**，把解答改对、百分数照解答填即可。`;

/** 修复输出里三个结构化字段的规格，与 A1 的 STRUCTURED_FIELDS_SPEC 同构 */
const REPAIR_STRUCTURED_SPEC = `  "handbookExcerpts": [
    {"name": "量名", "symbol": "规范符号", "role": "divisor|multiplier|addend|direct", "conditionAxis": "条件轴", "unit": "单位",
     "rows": [{"condition": "适用条件", "conditionValue": 条件代表数值或 null, "value": 取值}]}
  ],
  "marginReport": {"governingGapPercent": 数值, "ndGapPercent": 数值, "worstLegalVariationPercent": 数值},
  "answerKey": {
    "conclusion": "一句话最终结论（含数值与单位）",
    "values": [{"name": "量名", "value": 数值, "unit": "单位"}],
    "safetyFactors": [{"item": "校核项键名", "value": 已换算到与 nd 同阶次的数值, "note": "换算说明"}],
    "governing": "主控失效项键名"
  }`;

/** 修复输出 JSON 规格（含 4 个机械专属字段） */
function repairJsonSpec(d: MechanicalV2QuestionDraft, kind: 'calculation' | 'short-answer' | 'mixed'): string {
    const head = `{
  "problemId": "${d.problemId}",
  "knowledgePoint": "${d.knowledgePoint}",
  "chosenDimension": "${d.chosenDimension}",
  "questionText": "修复后的完整题干",`;
    const middle = kind === 'short-answer'
        ? `
  "coreData": {},
  "requiredAnswer": "论述问题的简明描述",
  "referenceAnswer": "修复后的完整论述参考答案",
  "referencePoints": ["要点1", "要点2", "...（至少4条）"],`
        : kind === 'mixed'
        ? `
  "coreData": {"物理量名称": {"value": 数值, "unit": "单位"}},
  "requiredAnswer": "所有小问的合并简述",
  "referenceAnswer": "修复后的分小问完整答案",
  "referenceSteps": ["计算步骤1", "...（至少4步）"],
  "referencePoints": ["论述要点1", "...（至少3条）"],`
        : `
  "coreData": {"物理量名称": {"value": 数值, "unit": "单位"}},
  "requiredAnswer": "求解目标",
  "referenceAnswer": "修复后的完整标准解答",
  "referenceSteps": ["步骤1", "步骤2", "..."],`;
    return `输出严格 JSON（字段与原 draft 一致）：
${head}${middle}
  "governingItem": "主控失效项键名（无可行方案则填 no_feasible_solution）",
  "handbookLookupItems": ${kind === 'short-answer' ? '[]' : '["要求自行查表取值的量名"]'},
  "designFactorFloor": ${kind === 'short-answer' ? 'null' : '设计安全系数下限数值（无则填 null）'},
  "roundedQuantities": ${kind === 'short-answer' ? '[]' : '["被圆整的量及圆整前后值"]'},
${REPAIR_STRUCTURED_SPEC}
}`;
}

function buildCalculationRepairPrompt(ctx: RepairPromptContext): string {
    const d = ctx.draft;
    return `你是机械设计题目修复专家。请只根据审查意见修复题目与标准解答，保持知识点和考察维度不变。

【原题】
${d.questionText}

【原标准解答】
${d.referenceAnswer}

【原参考步骤】
${d.referenceSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

【原核心数据】
${JSON.stringify(d.coreData, null, 2)}

【原自报 governing 项】${d.governingItem || '（未填写）'}
【原自报手册待查量】${d.handbookLookupItems.join('、') || '（未声明）'}
【原自报圆整量】${d.roundedQuantities.join('；') || '（未声明）'}

${ctx.issuesSection}

${repairModeLine(ctx)}

${ctx.disciplineGuidance}

${MECHANICAL_REPAIR_RULES}
8. 修复后计算链不少于 5 步且步步相依；${ctx.singleQuestion ? '仍必须单问。' : '最多 2 问且第 1 问为第 2 问的前提。'}

${repairJsonSpec(d, 'calculation')}`;
}

function buildShortAnswerRepairPrompt(ctx: RepairPromptContext): string {
    const d = ctx.draft;
    return `你是机械设计简答题修复专家。请只根据审查意见修复题目与参考答案，保持知识点和论述维度不变。

【原题】
${d.questionText}

【原论述问题】
${d.requiredAnswer}

【原参考答案】
${d.referenceAnswer}

【原核心要点】
${(d.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

${ctx.issuesSection}

${repairModeLine(ctx)}

${ctx.disciplineGuidance}

【修复硬性要求（机械简答）】：
1. 必须消除所有 validityIssues 与 difficultyIssues。
2. 题面不得点出准则名或判断结论（否则退化为背诵题）；准则名只能出现在参考答案中。
3. 引用的准则/判据必须准确到具体名称，且**适用条件**正确（Goodman/Gerber/Soderberg 的差别、欧拉与约翰逊的分界、均匀磨损与均压模型的前提）。
4. referenceAnswer 为完整论述（400-700 字），覆盖失效机理 + 判据依据 + 分界条件 + 错判后果 + 工程含义。
5. referencePoints 为 4-8 条核心要点（每条 15-40 字），至少各含 1 条机理断言、1 条判据引用、1 条工程含义。
6. 不要求数值计算；定量部分用半定量表述（数量级、单调性、分界条件）。
7. ${ctx.singleQuestion ? '修复后仍必须是单个论述问题。' : '修复后最多 2 问且互为前置。'}

${repairJsonSpec(d, 'short-answer')}`;
}

function buildMixedRepairPrompt(ctx: RepairPromptContext): string {
    const d = ctx.draft;
    return `你是机械设计混合题修复专家。请只根据审查意见修复这道混合题（含计算小问 + 论述小问），保持知识点和考察维度不变。

【原题】
${d.questionText}

【原求解目标】
${d.requiredAnswer}

【原参考答案（分小问）】
${d.referenceAnswer}

【原计算推导步骤】
${(d.referenceSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n') || '（无）'}

【原论述要点】
${(d.referencePoints || []).map((p, i) => `${i + 1}. ${p}`).join('\n') || '（无）'}

【原核心数据】
${JSON.stringify(d.coreData, null, 2)}

【原自报 governing 项】${d.governingItem || '（未填写）'}
【原自报手册待查量】${d.handbookLookupItems.join('、') || '（未声明）'}
【原自报圆整量】${d.roundedQuantities.join('；') || '（未声明）'}

${ctx.issuesSection}

${repairModeLine(ctx)}

${ctx.disciplineGuidance}

${MECHANICAL_REPAIR_RULES}
8. 修复后必须仍同时含至少 1 个计算小问（有数值答案）+ 1 个论述小问，且处在**同一台机器、同一工况**。
9. 论述小问必须**基于**计算小问的结果展开（如"结合 (1) 的校核结果说明由哪种失效模式控制"），不得各自为政或沦为定义复述。
10. referenceSteps ≥4 条、referencePoints ≥3 条；${ctx.singleQuestion ? '小问总数控制在 2 个（1 计算 + 1 论述）。' : '小问总数 2-4 个，形成递进推理链。'}

${repairJsonSpec(d, 'mixed')}`;
}

async function repairQuestion(
    draft: MechanicalV2QuestionDraft,
    reviewResult: MechanicalReviewResult,
    cycle: number,
    problemIndex: number,
    singleQuestion: boolean
): Promise<MechanicalV2QuestionDraft> {
    const isShortAnswer = draft.questionType === 'short-answer';
    const isMixed = draft.questionType === 'mixed';
    // 有 validity/difficulty 硬伤 → 深度修复（可换情境和数据），只有 depth → 细节修复
    const isDeep = reviewResult.validityIssues.length > 0 || reviewResult.difficultyIssues.length > 0;

    const ctx: RepairPromptContext = {
        draft,
        issuesSection: `【审查问题】
- ${isShortAnswer ? '学科事实错误' : '工程自洽/事实错误'}（必须修）：${reviewResult.validityIssues.join('；') || '无'}
- ${isShortAnswer ? '论述深度不足' : '难度/深度不足'}（必须修）：${reviewResult.difficultyIssues.join('；') || '无'}
- 结构防御（尽量修）：${reviewResult.depthIssues.join('；') || '无'}`,
        isDeep,
        cycle,
        disciplineGuidance: getDisciplineGuidance(draft.knowledgePoint),
        singleQuestion,
    };

    const prompt = isMixed
        ? buildMixedRepairPrompt(ctx)
        : isShortAnswer
        ? buildShortAnswerRepairPrompt(ctx)
        : buildCalculationRepairPrompt(ctx);

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'reasoning',
            temperature: isDeep ? 0.4 : 0.2,
            responseFormat: 'json',
            systemPrompt: `你是机械设计${isMixed ? '混合题' : isShortAnswer ? '简答题' : '设计/校核题'}修复专家，只输出严格 JSON。`,
        }, problemIndex, 'a3_repair')).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return draft;
        return normalizeDraft(cleanAndParseJSON(jsonMatch[0]) as Partial<MechanicalV2QuestionDraft>, draft);
    } catch {
        return draft;
    }
}

/** 传输层/解析层异常不是"题的问题"：reviewQuestion 的 catch 会灌
 *  `审查失败: terminated` 这类占位 issue（reviewer.ts 的 catch 分支）。它每轮长得一样，
 *  按原文比对必判 oscillating，等于网关抖一下就把一道还没被审过的题判死。
 *  实测出现过：两次 A2 在两万余字符的提示词上 terminated，题本身一次都没审成。 */
const REVIEW_INFRA_ISSUE = /^审查失败[:：]/;

/** 导出仅为可回归：基建异常曾被当成"连续两轮相同问题"，把没审过的题判死 */
export function detectDegradation(
    reviews: MechanicalReviewResult[],
    repairCycles: number
): { level: MechanicalReviewedDraft['degradationLevel']; reason: string } {
    if (reviews.length === 0) return { level: 'stable', reason: '' };
    const last = reviews[reviews.length - 1];
    if (last.passed) return { level: 'stable', reason: '' };
    if (reviews.length < 2) return { level: 'stable', reason: '' };
    const prev = reviews[reviews.length - 2];
    const real = (r: MechanicalReviewResult) =>
        [...r.validityIssues, ...r.difficultyIssues].filter(i => !REVIEW_INFRA_ISSUE.test(i));
    const lastIssues = real(last);
    const prevIssues = real(prev);
    // 本轮审查根本没跑成（只剩基建异常）→ 手上没有可比对的证据，不判降级，
    // 留给 while 循环再试一轮；真跑不动最终由 !passed 那条路径退出。
    if (lastIssues.length === 0 || prevIssues.length === 0) return { level: 'stable', reason: '' };

    // 振荡：连续两轮出现相同问题
    const overlap = lastIssues.filter(i => prevIssues.includes(i));
    if (overlap.length > 0) return { level: 'oscillating', reason: `连续两轮出现相同问题：${overlap.join('；')}` };
    // 发散：问题数在修复中反而增加
    if (lastIssues.length > prevIssues.length) return { level: 'diverging', reason: '问题数量在修复中反而增加' };
    // 机械专属 unrepairable：连续两轮均有**阻断级**硬伤且已接近修复上限。
    // 判据用 blockingIssues 而非 validityIssues：非阻断硬伤本来就允许留到落盘（交人工），
    // 若按全量判 unrepairable，就会把刚放行的题从这条路上再丢一次——
    // 且 MAX_REPAIR_CYCLES=1 时 `repairCycles >= 0` 恒真，等于每道带硬伤的题必被判死。
    if (repairCycles >= MAX_REPAIR_CYCLES - 1 && last.blockingIssues.length > 0 && prev.blockingIssues.length > 0) {
        return { level: 'unrepairable', reason: '连续多轮题面缺摘录或题眼交底（阻断级），判定为不可修复' };
    }
    return { level: 'stable', reason: '' };
}

/**
 * 每轮审查/修复打一行日志（格式对齐 chemistry 的 [V2 A2]/[V2 A3]）。
 *
 * 单题审查会烧掉若干次调用，而此前本文件一行日志都没有，只能看到最后那句 overallVerdict，
 * 中间轮次提了什么、修复动了什么全是黑盒——排查"元数据把好题废掉"只能靠事后翻
 * 整份 draft JSON 反推。issue 原文照打，不截断：判定分歧往往就藏在措辞里。
 */
function logReviewRound(round: number, review: MechanicalReviewResult): void {
    console.log(`[V2 A2] 第${round}次审查结果: passed=${review.passed}`, review.overallVerdict);
    if (review.blockingIssues.length > 0) {
        console.log(`[V2 A2] 第${round}次审查 阻断硬伤(会丢题):`, review.blockingIssues);
    }
    // 非阻断的也照打：passed=true 但带遗留时，这份清单就是人工质检的待改项
    const deferred = review.validityIssues.filter(i => !review.blockingIssues.includes(i));
    if (deferred.length > 0) {
        console.log(`[V2 A2] 第${round}次审查 非阻断硬伤(落degraded交人工):`, deferred);
    }
    if (review.difficultyIssues.length > 0) {
        console.log(`[V2 A2] 第${round}次审查 difficulty(非阻断):`, review.difficultyIssues);
    }
    if (review.depthIssues.length > 0) {
        console.log(`[V2 A2] 第${round}次审查 depth(非阻断):`, review.depthIssues);
    }
    if (review.lintWarnings && review.lintWarnings.length > 0) {
        console.log(`[V2 A2] 第${round}次 lint 警告:`, review.lintWarnings);
    }
}

/** 审查这一轮到底有没有跑成：只剩基建异常 = 没跑成，手上没有关于题目的任何证据。 */
function reviewIsInfraFailure(review: MechanicalReviewResult): boolean {
    const all = [...review.validityIssues, ...review.difficultyIssues];
    return all.length > 0 && all.every(i => REVIEW_INFRA_ISSUE.test(i));
}

/** A2 网关抖动时直接重审，不要先花一次 A3 修复。
 *
 *  为什么值得单独绕一下：A2 失败时 catch 灌的是 `审查失败: terminated`，A3 拿着这句话
 *  去"修复"等于让它凭空改题——实测出现过连烧两轮 A3 + 两轮 A2，占掉单题大半墙钟，
 *  而题目本身一次都没被审过。
 *  A2 的审查提示词有近两万字符，比 A1 还长，掉流概率不低，这条路径会反复走到。
 *  退避 8s/16s：与 blind-solver 的 callWithGatewayRetry 同思路（那边注释解释了为什么
 *  只给关键节点加而不是全链加），但审查一次 1-3 min，退避没必要更长。 */
async function reviewWithInfraRetry(
    draft: MechanicalV2QuestionDraft,
    lint: MechanicalLintResult,
    problemIndex: number,
    singleQuestion: boolean,
): Promise<MechanicalReviewResult> {
    const MAX_ATTEMPTS = 3;
    let review = await reviewQuestion(draft, lint, problemIndex, singleQuestion);
    for (let attempt = 1; attempt < MAX_ATTEMPTS && reviewIsInfraFailure(review); attempt++) {
        const waitMs = 8000 * attempt;
        console.warn(`[V2 A2] 审查未跑成（${review.validityIssues.join('；').slice(0, 120)}），${waitMs / 1000}s 后重审（第 ${attempt}/${MAX_ATTEMPTS - 1} 次）`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        review = await reviewQuestion(draft, lint, problemIndex, singleQuestion);
    }
    return review;
}

export async function reviewAndRepair(
    draft: MechanicalV2QuestionDraft,
    problemIndex: number = 0,
    singleQuestion: boolean = false
): Promise<MechanicalReviewedDraft> {
    let currentDraft = draft;
    // mixed 有计算小问，必须跑数值检查；只有纯简答题跳过
    const skipNumeric = currentDraft.questionType === 'short-answer';

    let lint = lintMechanical(toLintDraft(currentDraft), skipNumeric);
    let review = await reviewWithInfraRetry(currentDraft, lint, problemIndex, singleQuestion);
    logReviewRound(1, review);
    const reviews: MechanicalReviewResult[] = [review];
    const lintTrace: MechanicalLintResult[] = [lint];
    let repairCycles = 0;

    // 修复条件不等于阻断条件：passed 只看阻断项，但只要还有任何硬伤/难度问题，
    // 有预算就先让 A3 修一轮——修好了当然更省人工，修不好也不再丢题（落 degraded）。
    const worthRepairing = (r: MechanicalReviewResult) =>
        !r.passed || r.validityIssues.length > 0 || r.difficultyIssues.length > 0;

    while (worthRepairing(review) && repairCycles < MAX_REPAIR_CYCLES) {
        // 重审 3 次仍是基建异常 → 不知道题错在哪，A3 只会凭空改题。直接退出，
        // 把 needsRegeneration 留给上层（重跑一道题比在这里瞎修便宜）。
        if (reviewIsInfraFailure(review)) {
            console.warn('[V2 A2] 审查连续未跑成，跳过修复直接退出（题目未被实际审查）');
            break;
        }
        const isDeep = review.validityIssues.length > 0 || review.difficultyIssues.length > 0;
        console.log(`[V2 A3] 第${repairCycles + 1}次修复 (${isDeep ? '深度' : '细节'}模式)，待修 ${review.validityIssues.length + review.difficultyIssues.length} 项硬伤 / ${review.depthIssues.length} 项建议`);
        currentDraft = await repairQuestion(currentDraft, review, repairCycles + 1, problemIndex, singleQuestion);
        repairCycles += 1;
        // 修复后必须打摘录数：normalizeDraft 在"题干变了但修复没重报摘录"时会把摘录清空，
        // 此时 checkTableAnchors 无表可查、静默无违规。若不打这一行，就分不清下一轮 passed=true
        // 是"表体被改对了"还是"检查被清空的字段架空了"。0 张 = 后者，属需要追的问题。
        console.log(`[V2 A3] 第${repairCycles}次修复后结构化字段: 摘录 ${(currentDraft.handbookExcerpts || []).length} 张 / marginReport ${currentDraft.marginReport ? '有' : '缺'} / answerKey ${currentDraft.answerKey ? '有' : '缺'}`);
        lint = lintMechanical(toLintDraft(currentDraft), skipNumeric);
        review = await reviewWithInfraRetry(currentDraft, lint, problemIndex, singleQuestion);
        logReviewRound(repairCycles + 1, review);
        reviews.push(review);
        lintTrace.push(lint);

        const degradation = detectDegradation(reviews, repairCycles);
        if (degradation.level !== 'stable' && !review.passed) {
            console.warn(`[V2 A3] 修复降级 [${degradation.level}]：${degradation.reason}`);
            return {
                draft: currentDraft,
                reviewResult: review,
                repairCycles,
                needsRegeneration: true,
                degradationLevel: degradation.level,
                degradationReason: degradation.reason,
                mechanicalLintTrace: lintTrace,
            };
        }
    }

    // 题通过了阻断闸门但仍带未修完的硬伤/难度问题 → 落 'issues-deferred'。
    // orchestrator-v2.ts 只判 `degradationLevel === 'stable'`，所以这一档会让
    // qualityLevel = degraded，题正常落盘、issues 进 metadata.reviewValidityIssues。
    // 红线：degraded 的题不得直接进评测池——评测的前提是题本身正确。
    const deferred = [
        ...review.validityIssues.filter(i => !review.blockingIssues.includes(i)),
        ...review.difficultyIssues,
    ];
    if (review.passed && deferred.length > 0) {
        console.warn(`[V2 A2] 带 ${deferred.length} 项未修完的非阻断问题落盘，交人工质检（degraded）`);
        return {
            draft: currentDraft,
            reviewResult: review,
            repairCycles,
            needsRegeneration: false,
            degradationLevel: 'issues-deferred',
            degradationReason: `修复轮次用尽仍有 ${deferred.length} 项非阻断问题待人工处理：${deferred.join('；')}`,
            mechanicalLintTrace: lintTrace,
        };
    }

    return {
        draft: currentDraft,
        reviewResult: review,
        repairCycles,
        needsRegeneration: !review.passed,
        degradationLevel: 'stable',
        degradationReason: '',
        mechanicalLintTrace: lintTrace,
    };
}







