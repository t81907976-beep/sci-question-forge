import { callLLMTracked } from "../costTracker";
import {
    getDisciplineGuidance,
    getMatchedDisciplineForbiddenErrors,
    getMatchedStandardTables,
    getMatchedCriterionBranches,
    getMarginFloorGuidance,
    getPeakDifficulty,
} from "../disciplines";
import { cleanAndParseJSON, validateAndFixProblemJSON } from "../../../utils/jsonCleaner";
import type { MechanicalQuestionType } from "../../../../types/multiNodeTypes";
import type { MechanicalKPAnalysisResult } from "./kp-analyzer";
import type { MechanicalDifficultyLevel } from "./difficulty";

/**
 * Mechanical V2 — A1 出题 + 答案生成器
 *
 * 与 materials 的三点结构性差异（都是机械学科的本质要求，不是风格偏好）：
 *
 * 1. **题干不自足是刻意设计。** materials 要求"所有数据都出现在题面"；机械相反：
 *    手册可查的量必须缺席题面，由答题方自行查表取值，取错即全链崩。这些量登记在
 *    handbookLookupItems 里，供 mechanical-lint 的 checkHandbookIsolation 反向校验。
 *    为解决"盲解方能否解题"的悖论，题面应附**多行手册摘录**（含干扰行与档位分界，
 *    需要列内插值），而不是附最终值——选行本身就是判断层。
 *
 * 2. **不预设可行解。** 可行窗口为空是合法且更好的正解（"该系列内无方案，必须放宽
 *    某一约束"）。禁止为了凑出通过而修改载荷或许用值。
 *
 * 3. **不得暴露模板入口。** 题面一旦点出准则名/判据阈值/模型选择/governing 项结论，
 *    题目退化为正向公式链（实测有效率 0%）。这条由 mechanical-lint 的
 *    checkTemplateEntrance 硬拦截，不依赖 LLM 是否注意到。
 *
 * 4. **手册摘录必须结构化自报。** 本仓没有 RAG（node1-rag.ts 是 MVP 占位，硬编码的还是
 *    化学术语），题面附的摘录全部由本节点凭参数记忆现场编造。实测一道齿轮题里三张表的
 *    单调方向全部反了（KR 被写成"可靠度越高系数越小"的折减乘数，真值是除数且递增）。
 *    数值漂移可容忍——摘录写在题面，题目自足；**方向/身份搞反不可容忍**，它让真懂的
 *    答题方去纠正题面而被判错，直接反转区分度。因此 A1 必须把摘录同时输出成
 *    handbookExcerpts 结构化字段，由 lint 的 checkTableAnchors 做纯算术/枚举比较
 *    （不从散文里刮数字——上一轮六类正则误报的教训）。
 *
 * 5. **判定余量必须自报。** 结论要由结构决定而非数值噪声决定，故 A1 自报 marginReport
 *    三个数，由 lint 的 checkDecisionMargin 与解答里的安全系数交叉核对。
 */

/** 结构化手册摘录的一行 */
export interface MechanicalExcerptRow {
    /** 该行的适用条件原文（如 "8级且v≤5 m/s"、"R=99%"、"z=20"） */
    condition: string;
    /**
     * 条件在 conditionAxis 上的代表数值，用于确定性地排序并检查单调方向。
     * 条件轴非数值（如材料牌号）时填 null，此时不检查单调性。
     */
    conditionValue: number | null;
    /** 该行给出的取值 */
    value: number;
}

/** 结构化手册摘录。与题面文字里的摘录一一对应，供 lint 逐行复算。 */
export interface MechanicalHandbookExcerpt {
    /** 量名，须与 coreData / handbookLookupItems 的键名一致 */
    name: string;
    /** 规范符号（KR / KV / Sc / a1 / Sut …），用于与学科不变量匹配 */
    symbol: string;
    /** 该量以什么身份进入公式 */
    role: 'divisor' | 'multiplier' | 'addend' | 'direct';
    /** 各行沿什么条件排列 */
    conditionAxis: string;
    unit: string;
    /** 至少 2 行；须按 conditionValue 由小到大排列 */
    rows: MechanicalExcerptRow[];
}

/** A1 自报的判定余量。数值由 lint 与解答里的安全系数交叉核对，虚报会被拦下。 */
export interface MechanicalMarginReport {
    /** governing 项与次不利项之间、换算到同一阶次后的相对差距（%） */
    governingGapPercent?: number;
    /** 最不利安全系数超出（或低于）设计下限 nd 的余量（%，取绝对值） */
    ndGapPercent?: number;
    /** 合法方法差异能造成的最大结论漂移（%），正常应 ≤5 */
    worstLegalVariationPercent?: number;
}

/**
 * 紧凑结构化答案。
 * 原因：comparator 的计算题兜底用的是 requiredAnswer，而那是"求解目标描述"不是答案；
 * 一旦 A5 解析失败，最终答案栏会显示一句任务描述。有了它兜底才有内容可显示。
 */
export interface MechanicalAnswerKey {
    /** 一句话结论，可直接作为最终答案显示（含数值与单位，或"无可行方案 + 放松方向"） */
    conclusion: string;
    /** 关键选定量 */
    values: Array<{ name: string; value: number | string; unit: string }>;
    /** 各校核项的安全系数，**必须已换算到与 nd 同一阶次**（接触项填 SH² 而非 SH） */
    safetyFactors: Array<{ item: string; value: number; note: string }>;
    /** 主控失效项键名，须与 governingItem 一致 */
    governing: string;
}

/**
 * 须报出的量（交付清单）。
 *
 * 为什么要单独立一个字段而不是让 A1 在题干里随手写一句「求…」：
 * 1. **防漏算**：实测多模型对照里，好几家把某个量算了但没报，判分器一律记「缺」——
 *    那是判分口径的锅不是答题方的。清单一钉，缺项就是真缺项，测出来的数才干净。
 * 2. **短答案有了唯一来源**：answerKey.values 必须逐项覆盖这份清单，于是「短答案」
 *    就是这份清单的渲染结果，不用每道题手工凑一遍、也不会两处口径打架。
 *
 * 关键约束：清单只许出现**量名/符号/单位/圆整规则**，不许带条件从句。
 * 「报出更新后的 KV」这种写法等于告诉答题方"速度一定会跨过分界"，而"发现要更新"
 * 往往正是题眼——那是 `键名藏作法` 型泄漏，与题面点出准则名同一性质。
 */
export interface MechanicalDeliverable {
    /** 量名（如「模数」「弯曲安全系数」） */
    name: string;
    /** 规范符号（如 m / b / SF；无符号填 '—'） */
    symbol: string;
    /** 单位（无量纲填 '—'） */
    unit: string;
    /** 圆整/取位要求（如「GB/T 1357 第一系列」「整数」「两位小数」；无要求填空串） */
    rounding: string;
}

export interface MechanicalV2QuestionDraft {
    problemId: string;
    knowledgePoint: string;
    chosenDimension: string;
    questionType: MechanicalQuestionType;
    difficultyLevel: MechanicalDifficultyLevel;
    questionText: string;
    coreData: Record<string, { value: number | string; unit: string }>;
    requiredAnswer: string;
    referenceAnswer: string;
    referenceSteps: string[];
    referencePoints: string[];
    /** 机械专属：主控失效项键名，A2 会校验它是否真的等于最不利项 */
    governingItem: string;
    /** 机械专属：刻意不给数值、要求自行查表取值的量名（信息隔离白名单） */
    handbookLookupItems: string[];
    /** 机械专属：题目声明的设计安全系数下限，用于判定"硬凑通过" */
    designFactorFloor?: number;
    /** 机械专属：解答中被圆整的量及其圆整前后值，供审查核对回代是否贯穿 */
    roundedQuantities: string[];
    /** 机械专属：题面所附手册摘录的结构化副本，供 lint 逐行复算表体不变量 */
    handbookExcerpts: MechanicalHandbookExcerpt[];
    /** 机械专属：A1 自报的判定余量，供 lint 判断结论是否由结构而非噪声决定 */
    marginReport?: MechanicalMarginReport;
    /** 机械专属：紧凑结构化答案，兼作 comparator 的兜底最终答案 */
    answerKey?: MechanicalAnswerKey;
    /** 机械专属：题面末尾「须报出的量」清单，answerKey.values 须逐项覆盖 */
    deliverables: MechanicalDeliverable[];
}

const EXCERPT_ROLES = new Set(['divisor', 'multiplier', 'addend', 'direct']);

/** 结构化摘录的容错解析：字段缺失或类型不对的行直接丢弃，绝不让脏数据进 lint */
export function normalizeHandbookExcerpts(value: unknown): MechanicalHandbookExcerpt[] {
    if (!Array.isArray(value)) return [];
    const result: MechanicalHandbookExcerpt[] = [];
    for (const raw of value) {
        if (!raw || typeof raw !== 'object') continue;
        const item = raw as Record<string, unknown>;
        const name = String(item.name || '').trim();
        const symbol = String(item.symbol || '').trim();
        if (!name && !symbol) continue;

        const roleRaw = String(item.role || '').trim();
        const role = EXCERPT_ROLES.has(roleRaw)
            ? (roleRaw as MechanicalHandbookExcerpt['role'])
            : 'direct';

        const rows: MechanicalExcerptRow[] = [];
        for (const rowRaw of Array.isArray(item.rows) ? item.rows : []) {
            if (!rowRaw || typeof rowRaw !== 'object') continue;
            const row = rowRaw as Record<string, unknown>;
            const v = Number(row.value);
            if (!Number.isFinite(v)) continue;
            const cvRaw = Number(row.conditionValue);
            rows.push({
                condition: String(row.condition || '').trim(),
                conditionValue: Number.isFinite(cvRaw) ? cvRaw : null,
                value: v,
            });
        }
        if (rows.length === 0) continue;

        result.push({
            name: name || symbol,
            symbol: symbol || name,
            role,
            conditionAxis: String(item.conditionAxis || '').trim(),
            unit: String(item.unit || '').trim(),
            rows,
        });
    }
    return result;
}

export function normalizeMarginReport(value: unknown): MechanicalMarginReport | undefined {
    if (!value || typeof value !== 'object') return undefined;
    const item = value as Record<string, unknown>;
    const pick = (key: string): number | undefined => {
        const n = Number(item[key]);
        return Number.isFinite(n) ? Math.abs(n) : undefined;
    };
    const report: MechanicalMarginReport = {
        governingGapPercent: pick('governingGapPercent'),
        ndGapPercent: pick('ndGapPercent'),
        worstLegalVariationPercent: pick('worstLegalVariationPercent'),
    };
    const hasAny = Object.values(report).some(v => v !== undefined);
    return hasAny ? report : undefined;
}

export function normalizeAnswerKey(value: unknown): MechanicalAnswerKey | undefined {
    if (!value || typeof value !== 'object') return undefined;
    const item = value as Record<string, unknown>;
    const conclusion = String(item.conclusion || '').trim();

    const values: MechanicalAnswerKey['values'] = [];
    for (const raw of Array.isArray(item.values) ? item.values : []) {
        if (!raw || typeof raw !== 'object') continue;
        const v = raw as Record<string, unknown>;
        const name = String(v.name || '').trim();
        if (!name) continue;
        values.push({
            name,
            value: typeof v.value === 'number' ? v.value : String(v.value ?? '').trim(),
            unit: String(v.unit || '').trim(),
        });
    }

    const safetyFactors: MechanicalAnswerKey['safetyFactors'] = [];
    for (const raw of Array.isArray(item.safetyFactors) ? item.safetyFactors : []) {
        if (!raw || typeof raw !== 'object') continue;
        const v = raw as Record<string, unknown>;
        const num = Number(v.value);
        if (!Number.isFinite(num)) continue;
        safetyFactors.push({
            item: String(v.item || '').trim(),
            value: num,
            note: String(v.note || '').trim(),
        });
    }

    if (!conclusion && values.length === 0 && safetyFactors.length === 0) return undefined;
    return {
        conclusion,
        values,
        safetyFactors,
        governing: String(item.governing || '').trim(),
    };
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

/**
 * 交付清单的容错解析。
 *
 * name 缺失的行直接丢——没有量名的清单项对答题方毫无意义，留着只会污染短答案。
 * symbol/unit 允许缺（有些量确实没有通用符号），rounding 允许空（多数量无圆整要求）。
 */
export function normalizeDeliverables(value: unknown): MechanicalDeliverable[] {
    if (!Array.isArray(value)) return [];
    const result: MechanicalDeliverable[] = [];
    for (const raw of value) {
        if (!raw || typeof raw !== 'object') continue;
        const item = raw as Record<string, unknown>;
        const name = String(item.name || '').trim();
        if (!name) continue;
        result.push({
            name,
            symbol: String(item.symbol || '—').trim() || '—',
            unit: String(item.unit || '—').trim() || '—',
            rounding: String(item.rounding || '').trim(),
        });
    }
    return result;
}

/**
 * 交付清单渲染成题面末尾那一节。
 *
 * 供 A1 漏写时由代码补进题干（见 normalizeDraft），也供导出短答案时对齐口径。
 * 「缺项按未作答计」这句必须留着：它是这份清单的强制力来源，去掉就退化成温和建议。
 */
export function renderDeliverablesSection(items: MechanicalDeliverable[]): string {
    if (items.length === 0) return '';
    const lines = items.map((d, i) => {
        const sym = d.symbol && d.symbol !== '—' ? ` ${d.symbol}` : '';
        const unit = d.unit && d.unit !== '—' ? `（${d.unit}${d.rounding ? '，' + d.rounding : ''}）` : (d.rounding ? `（${d.rounding}）` : '');
        return `${i + 1}. ${d.name}${sym}${unit}`;
    });
    return `\n\n【须报出的量（缺项按未作答计）】\n${lines.join('\n')}`;
}

/** '齿轮传动-渐开线圆柱齿轮强度与选型' → '渐开线圆柱齿轮强度' */
function abbreviateKnowledgePoint(kp: string): string {
    const tail = kp.includes('-') ? kp.split('-').slice(1).join('') : kp;
    const cleaned = tail
        .replace(/[（(][^）)]*[）)]/g, '')
        .replace(/[与和及、\s]/g, '')
        .trim();
    const base = cleaned || kp.replace(/[-\s]/g, '');
    return base.length > 8 ? base.slice(0, 8) : base;
}

const QUESTION_TYPE_ID_TAG: Record<MechanicalQuestionType, string> = {
    calculation: '计算',
    'short-answer': '论述',
    mixed: '混合',
};

/** mech_{方向缩写}_{题型}_{MMDD}_{序号} */
export function buildMechanicalProblemId(kp: string, questionType: MechanicalQuestionType, problemIndex: number): string {
    const now = new Date();
    const mmdd = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const seq = String(problemIndex + 1).padStart(3, '0');
    return `mech_${abbreviateKnowledgePoint(kp)}_${QUESTION_TYPE_ID_TAG[questionType]}_${mmdd}_${seq}`;
}

function normalizeDraft(
    parsed: Partial<MechanicalV2QuestionDraft>,
    kp: string,
    dimension: string,
    questionType: MechanicalQuestionType,
    problemIndex: number,
    difficultyLevel: MechanicalDifficultyLevel
): MechanicalV2QuestionDraft {
    const floorRaw = Number(parsed.designFactorFloor);
    const draft: MechanicalV2QuestionDraft = {
        problemId: buildMechanicalProblemId(kp, questionType, problemIndex),
        knowledgePoint: String(parsed.knowledgePoint || kp),
        chosenDimension: String(parsed.chosenDimension || dimension),
        questionType,
        difficultyLevel,
        questionText: String(parsed.questionText || ""),
        coreData: (parsed.coreData && typeof parsed.coreData === "object") ? parsed.coreData : {},
        requiredAnswer: String(parsed.requiredAnswer || ""),
        referenceAnswer: String(parsed.referenceAnswer || ""),
        referenceSteps: normalizeStringArray(parsed.referenceSteps),
        referencePoints: normalizeStringArray(parsed.referencePoints),
        governingItem: String(parsed.governingItem || ""),
        handbookLookupItems: normalizeStringArray(parsed.handbookLookupItems),
        designFactorFloor: Number.isFinite(floorRaw) && floorRaw > 0 ? floorRaw : undefined,
        roundedQuantities: normalizeStringArray(parsed.roundedQuantities),
        handbookExcerpts: normalizeHandbookExcerpts((parsed as Record<string, unknown>).handbookExcerpts),
        marginReport: normalizeMarginReport((parsed as Record<string, unknown>).marginReport),
        answerKey: normalizeAnswerKey((parsed as Record<string, unknown>).answerKey),
        deliverables: normalizeDeliverables((parsed as Record<string, unknown>).deliverables),
    };
    // 交付清单只对有数值落点的题型有意义；纯论述题的落点是要点重合度，不是量。
    // A1 报了清单但没写进题干时由代码补——比退回 A3 修一轮便宜，且这一节是纯附加、
    // 不改动任何已有文字，不会破坏题面自洽。
    if (questionType !== 'short-answer' && draft.deliverables.length > 0 && !draft.questionText.includes('须报出的量')) {
        draft.questionText += renderDeliverablesSection(draft.deliverables);
    }
    if (questionType === 'calculation' && draft.referenceSteps.length < 3 && draft.referenceAnswer) {
        const lines = draft.referenceAnswer.split('\n').filter(l => l.trim().length > 0);
        if (lines.length >= 3) draft.referenceSteps = lines.slice(0, 14);
    }
    if (questionType === 'short-answer' && draft.referencePoints.length < 3 && draft.referenceAnswer) {
        const lines = draft.referenceAnswer.split('\n').filter(l => l.trim().length > 10);
        if (lines.length >= 3) draft.referencePoints = lines.slice(0, 8);
    }
    if (questionType === 'mixed' && draft.referenceAnswer) {
        const lines = draft.referenceAnswer.split('\n').filter(l => l.trim().length > 5);
        if (draft.referenceSteps.length < 2 && lines.length >= 2) draft.referenceSteps = lines.slice(0, 14);
        if (draft.referencePoints.length < 2 && lines.length >= 2) {
            draft.referencePoints = lines.filter(l => l.trim().length > 10).slice(0, 8);
        }
    }
    return draft;
}

/** 机械设计事实纪律：与 materials 的"物理常数/晶体结构"完全不同，机械查的是标准与手册 */
const MECHANICAL_FACT_DISCIPLINE = `【事实纪律（强制执行）】：
1. 标准离散系列不得编造，选型结果只能落在系列值上：
   - 模数第一系列（GB/T 1357）：1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50 mm
   - 簧丝直径（GB/T 1358）：0.5, 0.6, 0.8, 1, 1.2, 1.6, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8, 10, 12, 16, 20, 25 mm
   - 普通平键键宽（GB/T 1096）：2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40, 45, 50 mm
   - 滚动轴承内径（GB/T 273 常用段）：10, 12, 15, 17, 20, 25, 30, …, 100 mm（20 以上按 5 递增）

2. 材料与力学常数须自洽：
   - 钢 E≈206 GPa、G≈79-82 GPa、ν≈0.3；铸铁 E≈120-160 GPa；铝合金 E≈70 GPa
   - 钢的抗拉与抗压许用值近似相等；铸铁抗压远大于抗拉（约 3-4 倍），故铸铁不得用 DE/MSS 准则，须用库仑-莫尔
   - 弹簧钢丝抗拉强度随直径增大而下降，直径改变后 Sut 必须重查

3. 寿命与失效指数不得混用：
   - 球轴承寿命指数 ε=3；圆柱/圆锥/调心滚子轴承 ε=10/3
   - 变载荷当量化的加权指数必须与寿命指数一致

4. 摩擦与效率须物理可行：
   - 钢-钢干摩擦 f≈0.15-0.20，油润滑 f≈0.05-0.10；自锁条件为螺纹升角不大于当量摩擦角
   - 任何传动效率必须 <1；蜗杆传动含摩擦效率不得高于 0.97

5. 单位与量纲：转矩 N·m、应力 MPa、功率 kW、转速 r/min。T=9550P/n（P 单位 kW、n 单位 r/min）时 T 为 N·m；口径混用即算术不自洽`;

/** 机械专属的六条铁律，三种题型共用 */
const MECHANICAL_IRON_RULES = `⚠️ **机械命题六条铁律（违反任一即不可发布）**：
1. **禁止暴露模板入口**：题面绝不可点出准则名（Goodman/Gerber/欧拉/约翰逊/均匀磨损/均压/von Mises/库仑-莫尔）、判据分类结论（"本题属细长杆"）、governing 项结论（"主控失效模式为…"）或直接给出许用值。判断层必须由答题方自行完成——题面一旦给出方法名，题目退化为正向公式链，实测有效率 0%。
   ⚠️ **"钉死口径"与"泄漏题眼"的分界，用删句测试判定**（这是实测最容易越界的一处：为了消除歧义而把判断层也一并写进了题面）。对题面里每一句交待做法的话，做一次实验——**把这句话删掉，还能不能算出唯一正确答案？**
   - **算不出**（存在两种都站得住的算法流派、纯人为约定、取位精度）→ 这是**口径**，必须留，删了就是题目缺信息。例：「本题按给定的修正 Lewis 弯曲式计算，不采用需另行确定几何系数 J 的完整 AGMA 弯曲式」（两式都对，不指定则两个答案都自洽）、「许用应力不含设计系数 nd，SF 定义为 [σF]/σF」、「保留两位小数」。
   - **算得出，但答题方很可能算错** → 这是**题眼**，必须删，它正是本题全部防御力的来源。例：「以 SH² 与 nd 比较」（接触应力 ∝ √载荷，故载荷阶次的安全系数是 SH²，这是唯一正解，写出来等于把最锋利的分叉点交底）、「表面硬度定接触疲劳极限、芯部硬度定弯曲疲劳极限」（渗碳齿轮的硬度分工有唯一正确答案）、「本题属细长杆」、「按均匀磨损模型」。
   - **算得出且几乎不会错** → 冗余，留着无害。
   反过来说：**同阶次换算、查表行的选取、模型/准则的选择、失效模式的判定，这四类一律属于题眼，不论多想消除歧义都不许写进题面。** 它们要么由答题方自己想到，要么就是这道题该扣的分；把它们写出来的代价是最弱的答题方也能照着做对，题目失去区分度。
2. **手册量不得给成"唯一取值"**：可查手册的量（系数表值、材料强度极限、目录额定载荷等）不允许在题面写成一个直接可用的定值（"KA=1.25"这种写法即违规）。保证可解性的**唯一正当做法**是附**多行摘录**：同一个量至少给 2-3 行候选，带上各行的适用条件（档位分界、硬度区间、速度区间、可靠度档等），使答题方必须先算出条件、再选行、必要时列内插值才能定值；并把这些量名登记进 handbookLookupItems。只给单行、或多行但题面已直接点明该取哪一行，等于变相给答案。
   注意：按此写法，摘录中的数字**出现在题面是合规的**，被考察的是选行判断而不是数字的缺席。许用应力（[σH]/[σF]/[τ]）属结论级量，任何形式都不得给出，只能给疲劳极限等基础值让答题方自行折算。
   另注意：摘录的**行键不能是题面已直接给出的量**。若某表的行键是 z1、传动比 i、硬度 HRC、可靠度 R 这些题面已明写的值，答题方无需任何判断即可对号入座——这种摘录不构成选行判断层，应改成以**需要先算出来的量**为行键（节线速度、循环次数 N、Fa/Fr、F/d1 等）。
   ⚠️ **最要紧的一条——数值溯源自查（写完解答后必须做一遍）**：把参考解答里**所有被代入的数值**列一遍，逐个标注它从哪来，只有三个合法来源：
   ① 题面已明写的已知条件（含工况、几何、材料牌号、约束窗口）；
   ② 题面某张摘录的某一行（须能指出是哪张表、哪一行，含插值则指出插的是哪两行）；
   ③ 由前面已经报出的量算出来的（须能指出算式）。
   **三者都指不到的数字，就是你凭空引入的，这道题不可解**——各答题方只能各自编一个值，答案必然对不上，测不出任何东西。修法二选一：**写进题面**，或**从解答里消掉**（改用别的路径）。
   最常漏的两类，务必逐一自查：
   - **登记进 handbookLookupItems 的量却一张摘录都没给**（尤其题面已经写了"按下列摘录取值"却没有下文）。实测原因就在这里——同一道题给了表是 11/13，不给表是 0/4，差距来自缺表而非题难。所以两者必须同增同减：**要么给摘录，要么不要把该量登记进 handbookLookupItems**（改为已知条件直接给出并注明"本题按此取值"）。题面也不得出现"按下列摘录/下表"之类指向不存在内容的措辞。
   - **判据侧的阈值本身没给**：解答里拿 nd（设计系数/安全系数下限）、许用变形、许用温升、许用磨损量之类去做"是否满足"的比较时，这个阈值必须在题面里有数值。实测踩过一次：题面只写了"以 SF 与 nd 比较"却从未给出 nd 的值，而反解尺寸、判定满足、确定 governing 全都要用它——整题不可解。**凡是解答里出现过的判据阈值，题面必须给数（或由摘录选行得到），designFactorFloor 字段同时如实填写。**
3. **不预设可行解**：可行窗口为空是合法且更好的结论。绝不允许为了凑出"通过"而调整载荷、许用值或安全系数。若窗口为空，参考答案必须明确指出这一点并给出唯一的放松方向。
4. **表体不得凭"系数看起来像什么"编造**：你写进题面的每一行摘录，其**身份（除数/乘数/加项）与沿条件轴的单调方向**必须与真实手册一致，量级必须落在合理带内。数值漂移**在合理量级带外侧 20% 以内**可以接受（摘录写在题面，题目自足，所有答题方用同一套数据仍能得到一致可判的答案）；超出 20% 会被提示复核、超出 50% 判硬伤；**方向或身份搞反不可接受**——掌握该学科的答题方会为了纠正题面而被判错、照抄错表的反而得分，区分度直接反转，题目作废。
   最常见的错法：中文教材里"××系数"绝大多数是小于 1 的折减乘数，于是把 AGMA 的除数型系数（KR：许用应力 = St·YN/(KT·KR)，R 越高 KR 越大）也造成"R 越高系数越小"的乘数。实测一次造错三张表。
   若你对某个量的真实表体没有把握，正当做法有两条：**换一个你有把握的量**，或**把该量作为已知条件直接给出并注明"本题按此取值"**（此时不得登记进 handbookLookupItems）。绝不要硬编一张表。
   你必须把题面里的每张摘录同时输出到 handbookExcerpts 结构化字段，会被逐行复算。
5. **同一题内不得混用两套系数体系**：中式（GB/ISO：T=9550P/n、GB/T 1357 模数、可靠度体现在许用应力的 S_Hmin/S_Fmin 里，**没有 KR**）与美制（AGMA/Shigley：径节 Pd、Lewis 齿形系数 y/J、几何系数 I、可靠度用 KR 作除数）是两套完整体系。混用会造出两套体系里都不存在的量（如"中式公式配 AGMA 的 KR"），且没有任何手册可核对。选定一套后全题贯穿，包括公式、系数名、标准系列、单位制。
   与体系无关的常数（弹性系数 ZE、几何系数 I、齿形系数 J/y 这类需要查图或按公式算的量）必须在题面作为已知条件写出，不能默认答题方知道。
6. **多准则题的反解必须逐准则各做一次，取最严者，且与 governing 自洽**：凡本题有多条并列判据（接触/弯曲、簧圈/钩部、强度/刚度/稳定性/共振、磨损/pv、静强度/疲劳…），任何"由判据反解设计量"的步骤（反解模数、簧丝直径、轴径、齿宽、宽度、圈数…）都必须**对每一条判据各反解一次，然后取最严的那一个**（即取各反解值中数值要求最高者）作为设计值。
   并且必须自洽：**取到的那一条，应当与最终报出的 governing 项是同一条**。一边按弯曲反解尺寸、一边判定"主控失效项为接触"，是参考答案自身的矛盾——真正控制设计的是接触，反解就该由接触定。出现不一致时回头查是反解漏了一条，还是 governing 判错了，不许两者并存。
   实测踩过一次：某齿轮题只按弯曲反解得连续模数 3.169 mm，而按接触反解为 3.456 mm（接触才是控制项，也与该题自报的 governing=接触疲劳一致）。虽然圆整后标准模数恰好相同、最终设计没变，但**交付清单里只要一个"连续模数"，一个正确按主控准则反解的答题方交 3.456 会被判错**——判分口径被写坏了。
   因此 deliverables 里，**每条准则的反解值各占一项**（如"接触反解模数 mH"、"弯曲反解模数 mF"），不得合并成单独一个"连续模数"；若确实要报合并值，须另列一项并在题面注明"取二者较大/较严者"。
   这一条同时提高题的质量下限：**"取最不利者"本身就是绝大多数设计题真正要考的知识点**，把它拆开报出来，等于把这个判断变成可判分的落点。`;

/**
 * 难度指令。
 *
 * ⚠️ 三档按「题眼隐蔽度」分，不按体量分，理由见 difficulty.ts 顶部。
 * 一句话：**难度来自判断层的隐蔽，不来自算术量。**
 * 因此本函数里不再出现"步骤数 ≥ 12"这类以链长定档的要求——链长只作**上限**约束，
 * 反过来要求把与题眼无关的正向量前置为已知，把省下来的位置让给判断层。
 */
function buildDifficultyDirective(
    difficultyLevel: MechanicalDifficultyLevel,
    peakDifficulty: string,
    questionType: MechanicalQuestionType
): string {
    const stepUnit = questionType === 'short-answer' ? '论述层次' : '计算步骤';

    if (difficultyLevel === 'peak') {
        return `【难度档位：顶级（两处自洽错法联动）⚠️ 必须满足以下全部条件】
1. **两处自洽错法，且第一处的错选会改变第二处的取值**（错法有传播路径）：错在第一处的答题方，会在第二处取到另一个值，最终得到一个自洽但错的结论。例：圆整后节线速度跨过精度等级分界 → KV 必须改档 → 许用应力随之变 → 结论翻转；或查表行选错（表面硬度 vs 芯部硬度）→ 两个疲劳极限都错 → governing 项跟着换人。
2. **必须直接对齐**该方向的难度天花板：
${peakDifficulty || '（该方向未提供顶级难度描述，请自行按判断层深度设计）'}
3. ${stepUnit}数 **6-10 步**（上限是硬约束）。若为了塞进闭环而超过 10 步，**必须把与两处题眼无关的正向量前置为题面已知**，而不是加长链条。
4. 允许离散候选集夹逼、允许可行集为空——但夹逼必须由**判断层**造成（选错行就夹不空），不得只靠罗列约束条件把题变长。
5. 禁止教材例题的换数搬用。`;
    }
    if (difficultyLevel === 'hard') {
        return `【难度档位：困难（一处自洽错法）⚠️ 必须满足以下全部条件】
1. **一处判据分叉，且错法自洽**：错选之后照样能算出一个像样的数、量纲正确、还能自圆其说，光看答卷分不出对错——只有对照标准答案才知道错了。这是本档的唯一定义。
   典型自洽错法：接触安全系数未换算到同阶次（用 SH 而不是 SH² 与 nd 比）；渗碳齿轮把表面硬度和芯部硬度的分工对调；用均压模型代替均匀磨损模型；细长杆误按短杆公式。
2. 参考答案必须在分叉处显式写出："若错选 X（常见错法）会得到 Y=…（注意这个数看着是合理的）；正确应取 Z，因为…"。**必须写出错法算出来的那个数**——写不出来说明这个错法不自洽，那这题只配 standard 档。
3. ${stepUnit}数 **5-8 步**（上限是硬约束）。至少 2 条独立失效准则并行、由最不利者定 governing，但这是为了让"取最严者"成为可判分落点，**不是为了把题变长**。
4. 至少一次圆整回代且回代后有派生量真实改变。
5. 禁止教材例题的换数搬用。`;
    }
    return `【难度档位：标准（一处分叉，错法当场露馅）】
1. 一处判据分叉/选行判断，错选之后会**当场露馅**（量纲不对、算不下去、或结论明显荒谬）。这是本档与困难档的唯一分界。
2. ${stepUnit}数 **4-6 步**（上限是硬约束），至少含一次手册/标准系列选行取值与一次圆整后的回代重算。
3. 参考答案完整给出公式、选行依据、代入、单位换算、最终答案与单位。`;
}

export async function generateQuestionWithAnswer(
    kpAnalysis: MechanicalKPAnalysisResult,
    dimensionIndex: number,
    language: string = 'zh-CN',
    singleQuestion: boolean = false,
    problemIndex: number = 0,
    questionType: MechanicalQuestionType = 'calculation',
    difficultyLevel: MechanicalDifficultyLevel = 'standard'
): Promise<MechanicalV2QuestionDraft> {
    const dimensions = kpAnalysis.testDimensions;
    const chosenDimension = dimensions.length > 0
        ? dimensions[dimensionIndex % dimensions.length]
        : kpAnalysis.knowledgePoint;
    const kp = kpAnalysis.knowledgePoint;

    const disciplineGuidance = getDisciplineGuidance(kp);
    const forbiddenErrors = getMatchedDisciplineForbiddenErrors(kp);
    const standardTables = getMatchedStandardTables(kp);
    const criterionBranches = getMatchedCriterionBranches(kp);
    const peakDifficulty = getPeakDifficulty(kp);
    const marginFloorGuidance = getMarginFloorGuidance(kp);
    const difficultyDirective = buildDifficultyDirective(difficultyLevel, peakDifficulty, questionType);

    const ctx: PromptContext = {
        kp,
        chosenDimension,
        kpAnalysis,
        disciplineGuidance,
        forbiddenErrors,
        standardTables,
        criterionBranches,
        marginFloorGuidance,
        singleQuestion,
        difficultyDirective,
    };

    const isShortAnswer = questionType === 'short-answer';
    const isMixed = questionType === 'mixed';

    const prompt = isMixed
        ? buildMixedPrompt(ctx)
        : isShortAnswer
        ? buildShortAnswerPrompt(ctx)
        : buildCalculationPrompt(ctx);

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'reasoning',
            temperature: 0.4,
            responseFormat: 'json',
            systemPrompt: `你是机械设计命题专家（熟悉机械设计手册与 Shigley 体系），用${language === 'zh-CN' ? '中文' : language}出${isMixed ? '混合题（含计算+论述小问）' : isShortAnswer ? '简答题（论述题）' : '设计/校核计算题'}，只输出严格 JSON。`,
        }, problemIndex, 'a1_generate'))
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Failed to parse generator response as JSON');

        const parsed = cleanAndParseJSON(jsonMatch[0]);
        // 计算题走 fix 逻辑；简答/混合跳过（validateAndFixProblemJSON 假设有 coreData）
        const rawParsed = (isShortAnswer || isMixed) ? parsed : validateAndFixProblemJSON(parsed);
        const draft = normalizeDraft(
            rawParsed as Partial<MechanicalV2QuestionDraft>,
            kp, chosenDimension, questionType, problemIndex, difficultyLevel
        );

        if (!draft.questionText) throw new Error('Generated question text is empty');
        if (!draft.referenceAnswer) throw new Error('Generated reference answer is empty');

        if (isShortAnswer) {
            if (draft.referencePoints.length < 3) {
                throw new Error('Reference points too short (minimum 3 required for short-answer)');
            }
        } else if (isMixed) {
            if (draft.referenceSteps.length < 2 || draft.referencePoints.length < 2) {
                throw new Error(`Mixed question must have both referenceSteps (≥2, got ${draft.referenceSteps.length}) and referencePoints (≥2, got ${draft.referencePoints.length})`);
            }
        } else {
            // 步数下界与 buildDifficultyDirective 的三档区间下沿对齐（4-6 / 5-8 / 6-10）。
            // 取 4/5/6 而非更高：长链不再是机械题的难度来源（见 difficulty.ts），
            // 它只是把 A1 的丢步概率和 A4 的复现失败率一起推高。
            // **上界故意不在这里 throw**：超长题是「能用但信噪比差」，该走 lint warning →
            // depthIssues 交人工，不该直接丢题（丢题违反「不丢只降级」的整体口径）。
            const minSteps = difficultyLevel === 'peak' ? 6 : difficultyLevel === 'hard' ? 5 : 4;
            if (draft.referenceSteps.length < minSteps) {
                throw new Error(`Reference steps too short (minimum ${minSteps} required for ${difficultyLevel} level, got ${draft.referenceSteps.length})`);
            }
        }

        return draft;
    } catch (error) {
        console.error("Mechanical V2 A1 Error:", error);
        throw new Error(`Mechanical V2 generation failed: ${(error as Error).message}`);
    }
}

interface PromptContext {
    kp: string;
    chosenDimension: string;
    kpAnalysis: MechanicalKPAnalysisResult;
    disciplineGuidance: string;
    forbiddenErrors: string[];
    standardTables: string[];
    criterionBranches: string[];
    marginFloorGuidance: string;
    singleQuestion: boolean;
    difficultyDirective: string;
}

/** 三种题型共用的头部：方向、维度、避开项、难度、学科指导、事实纪律、铁律 */
function buildCommonHead(ctx: PromptContext, roleLine: string): string {
    return `${roleLine}

【知识点方向】：${ctx.kp}
【本题考察维度】：${ctx.chosenDimension}
【必须避开的低防御角度】：${ctx.kpAnalysis.coreConceptsToAvoid.join('、') || '无'}
【难度定位】：${ctx.kpAnalysis.suggestedDifficulty}

${ctx.difficultyDirective}

${ctx.disciplineGuidance}

${MECHANICAL_FACT_DISCIPLINE}

${MECHANICAL_IRON_RULES}

${ctx.marginFloorGuidance}
${ctx.standardTables.length > 0 ? `\n【本方向涉及的标准表与离散系列（查表取值算 0 步，但"选对哪一行"属判断层，算完整步数）】\n${ctx.standardTables.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n` : ''}${ctx.criterionBranches.length > 0 ? `\n【本方向的判据分叉点（题目应命中至少一个，且题面不得点明该选哪一支）】\n${ctx.criterionBranches.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n` : ''}${ctx.forbiddenErrors.length > 0 ? `\n【本方向禁止出现的错误（参考答案自身也不得犯）】\n${ctx.forbiddenErrors.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n` : ''}`;
}

/** 三种题型共用的结构化字段说明。计算题与混合题都要求，简答题不适用。 */
const STRUCTURED_FIELDS_SPEC = `  "handbookExcerpts": [
    {
      "name": "量名（须与 coreData / handbookLookupItems 的键名一致）",
      "symbol": "规范符号（KR / KV / Sc / St / a1 / Sut / e / Y …）",
      "role": "divisor | multiplier | addend | direct（该量以什么身份进入公式）",
      "conditionAxis": "各行沿什么条件排列（如 '节线速度 v'、'循环次数 N'、'Fa/Fr'）",
      "unit": "单位（无量纲填 '—'）",
      "rows": [
        {"condition": "该行适用条件原文", "conditionValue": 该条件在条件轴上的代表数值（非数值轴填 null）, "value": 该行取值}
      ]
    }
  ],
  "marginReport": {
    "governingGapPercent": governing 项与次不利项换算到同一阶次后的相对差距（%）,
    "ndGapPercent": 最不利安全系数与设计下限 nd 之间的余量（%，取绝对值）,
    "worstLegalVariationPercent": 合法方法差异能造成的最大结论漂移（%，正常 ≤5）
  },
  "answerKey": {
    "conclusion": "一句话最终结论，含数值与单位；若无可行方案则写明是哪条约束夹空及唯一放松方向",
    "values": [{"name": "量名", "value": 数值或字符串, "unit": "单位"}],
    "safetyFactors": [{"item": "校核项键名", "value": 数值（⚠️必须已换算到与 nd 同一阶次，接触项填 SH² 而非 SH）, "note": "换算说明"}],
    "governing": "主控失效项键名（与 governingItem 一致）"
  },
  "deliverables": [
    {"name": "量名", "symbol": "规范符号（无则填 '—'）", "unit": "单位（无量纲填 '—'）", "rounding": "圆整/取位要求（无则留空串）"}
  ]`;

/** handbookExcerpts 必须与题面摘录一一对应——这条约束单独强调一次，实测容易被忽略 */
const STRUCTURED_FIELDS_NOTE = `【结构化字段的硬要求】
1. handbookExcerpts 必须与题面文字里的摘录**一一对应、数值完全一致**，不得多写也不得少写。它会被逐行复算：身份、单调方向、量级带三项任一不符即整题作废。
   并且必须**覆盖 handbookLookupItems 的每一项**：声明了待查量却没有对应摘录的，题目不可解（各答题方自编表，答案必然对不上），整题作废。自查一遍两个数组：待查量数 ≤ 摘录数，且每个待查量名都能在摘录的 name 里找到。
2. rows 必须按 conditionValue 由小到大排列，且至少 2 行。若条件轴不是数值（如材料牌号），conditionValue 填 null。
3. answerKey.safetyFactors 的数值必须与 referenceAnswer 里写的一致（会交叉核对），且**必须已换算到与 nd 同一阶次**——接触项填 SH² 而不是 SH。
4. marginReport 三个数会与 answerKey.safetyFactors 交叉核对，虚报会被拦下。若真实余量不够，请回去调整参数把余量拉开，而不是改报数字。
5. **【须报出的量】（deliverables）**——这一节把"列什么、怎么写、答案侧要对上什么"三件事一次讲清，别处不再重复：
   - **⚠️ 硬上限 8 项，只许列下面三类。** 实测：清单列到 27-30 项时，其中 27 项是纯正向代公式的脚手架量（传动比、转矩 9550P/n、齿数、分度圆、中心距、切向力…），**最强的解题模型一道都没复现出来**。这种题筛不出任何东西：答题方在第 3 步算错转矩而挂掉，只说明"链子长了会掉"，不能说明它懂不懂本题真正要考的那个判断。噪声通道越多，题眼的信号越被淹掉。
     ① **判据分叉两侧的对称量**——本题全部并列判据的安全系数/反解值一个不漏地列全（SF 与 SH²、mF 与 mH）。**对称是硬要求**，见下文；
     ② **是否满足 + 主控失效项**（governing）；
     ③ **题眼所在的那 1-2 个查表结果**（如按硬度分工选到的 Sc/St）。
     其余一律不列。判据一句话：**这一项报错了，是说明他不懂本题要考的那个判断，还是只说明他算错了一步乘除？**后者不列。
   - **省下来的位置要用在前置已知量上**（见下面第 7 条）：不列进清单的正向量，凡与题眼无关的，直接把数值给进题面。
   - **答案侧必须逐项对上**（实测最常漏的一条）：deliverables 的每一项都要能在 answerKey.values / answerKey.safetyFactors / answerKey.governing / answerKey.conclusion 里找到落点。**填完后自查一遍：逐项过 deliverables，指出它落在 answerKey 的哪个字段上。** 名称写法允许不同（清单「弯曲安全系数」对 safetyFactors 的 bending 即可），但不许有一项落不到任何字段。
   - **只许写"交什么"，绝不许写"怎么做"**（违反即整题作废，与题面点出准则名同罪）：
     - ✅ 「动载系数 KV」「节线速度 v（m/s，两位小数）」「模数 m（mm，GB/T 1357 第一系列）」
     - ❌ 「**更新后的**动载系数 KV」——等于告知速度必然跨过分界，而"发现要更新"正是题眼
     - ❌ 「**按库仑-莫尔算的**当量应力」「**细长杆**临界力」——把判据分叉的答案写进了清单
     - ❌ 任何带"由于/因为/若…则"条件从句的写法；项名里也不许出现换算后的量（"SH²""平方后的接触安全系数"），只写"接触安全系数 SH"
     判据：答题方看到这一项，是知道了**要交什么**，还是知道了**该往哪拐**？后者一律不许写。
   - **对称性是泄漏与合规的分界，且优先于 8 项上限**：本题全部并列判据一个不漏地对称列全 → 合规（"齿轮要同时校核接触与弯曲"是常识，不透露哪条控制设计）；只列其中一条、或多列一条却漏掉另一条 → 泄漏（等于告知那条就是主控）。**若对称列全后超过 8 项，删的是第 ③ 类而不是第 ① 类**——宁可多一项也不许打破对称。多条判据各自的反解值要各占一项，见铁律 6。
6. **安全系数口径必须在题干里钉死**（一句话，写在清单前后均可）：明确许用应力是否含设计系数 nd、以及安全系数如何定义。两种口径都对，但不定口径同一道题会出现 SF=1.64 与 SF=2.13 两个都自洽的答案（相差正好一个 nd），无法判分。注意只钉口径、不得给出许用应力的**数值**。
   越界的判定与"哪四类一律是题眼"见铁律 1 的删句测试；判据阈值本身必须给数见铁律 2——此处不再重复。

7. **【已知量前置】——与题眼无关的正向量必须直接给数值，不许让答题方算。**
   这是本提示词里唯一一条**主动降低难度**的要求，目的不是把题变简单，而是**提高信噪比**。终极目标是筛出答题方"不会的那个判断"，不是筛出"谁能连续 12 步不出错"。每一个前置量都关掉一条噪声通道。
   - **判据（唯一判据，逐量过一遍）**：把这个量的数值直接写进题面，**本题的题眼还在不在**？
     - 还在 → **必须前置**。典型可前置量：传动比 i、输入转矩 T（T=9550P/n 这种一步代入）、应力循环次数 N、齿数 z1/z2、分度圆直径 d、中心距 a、切向力 Ft、当量载荷中的纯几何/纯代数中间量。
     - 题眼没了 → **绝对不许给**。反例（实测踩过）：某齿轮题的题眼恰是"圆整后节线速度 v 变了、KV 必须回头改档"，那么 v 和 KV 一个都不能给——给了等于把答案送出去，比出难题更糟。
   - 前置的量**同时要从 referenceSteps 里删掉那一步**（题面已给的数不再算一遍），这样步数自然落进档位区间，不必刻意压缩。
   - 前置的量**不进 deliverables**（已经给了还要求报出来，等于白占一个清单位）。
   - **前置不等于给冗余数据**：只给算得到题眼所必需的那些量，题面质量要求第 2 条（不给无用冗余数据）仍然有效。
   - **题面字数上限 450 字**（不含【须报出的量】那一节）。超了说明还有可前置的正向量没前置，或者塞了不必要的情境描述——回去删，不要靠压缩摘录来凑字数（摘录是可解性的前提，一行都不能少）。`;

function buildCalculationPrompt(ctx: PromptContext): string {
    return `${buildCommonHead(ctx, '你是机械设计领域的资深教授和命题专家。请生成一道高质量机械设计**设计/校核计算题**，**同时给出完整的标准解答**。')}
【题目质量要求】：
1. 真实工程情境：具体的机器与工况（如"某带式输送机减速器高速级"、"某矿井提升机卷筒轴"），给出功率/转速/寿命/工作条件等设计输入。
2. 条件充分且必要：题面给出的是**设计输入与工况**，不是中间结果；不给无用冗余数据，也不把手册系数直接给成最终值。
3. 计算链**长度受难度档位约束**（见上面的难度档位一节），不是越长越好：链子的作用是让判断层有落点，本身不是难度来源。与题眼无关的正向量按【已知量前置】直接给数值。
4. 至少含一次**圆整**（尺寸/型号/根数/圈数），且圆整后所有派生量必须在解答中用圆整值重算。
5. 至少含一处**判据分叉**，且题面不得点明该选哪一支。
6. ${ctx.singleQuestion ? '⚠️【强制单问】只能有一个求解目标，禁止拆成 (1)(2)。' : '最多 2 问，且第 1 问必须是第 2 问的必要前提。'}
7. 题面纯净：不写"本题考察…"、"注意陷阱…"、"请使用…准则"这类元信息或方法提示。

【标准解答要求】：
1. 完整写出所用公式及其**适用条件**，并在分叉处说明为什么选这一支。
2. 手册/表值须写明**按什么条件选到哪一行**（含插值过程），而不是直接给数。
3. 逐步代入数值并显示中间结果；圆整后明确写出"以下派生量按圆整值重算"。
4. 多准则校核须显式比较各安全系数并指明 governing 项。
5. 最终答案必须带单位；若结论为"无可行方案"，须说明是哪条约束把窗口夹空、以及唯一的放松方向。
6. 每一步的纯数值等式必须真实成立（会被确定性算术复算器逐式核验，相对偏差 >1.5% 即判不合格）。
7. 多准则比较前必须把各安全系数**换算到同一阶次**：接触安全系数 SH 的载荷阶次为平方，须用 SH² 与 SF、nd 同台比较。解答里要写出这一步换算。**但这句换算规则本身不许写进题面**（铁律 1 的删句测试：它有唯一正确答案，属题眼）。
8. **反解设计量时逐条判据各反解一次并取最严者**（铁律 6）：解答里要把每条判据的反解值都写出来（"按弯曲反解得 mF=…，按接触反解得 mH=…，取较大者"），并确认取到的那条与最终 governing 是同一条。只按其中一条反解、却判定另一条为主控，是解答自相矛盾。
9. **交卷前做数值溯源自查**（铁律 2）：通读一遍自己的解答，把每个被代入的数字对照"题面已知 / 摘录某行 / 前面算出"三个来源核一遍，凡指不到来源的（最典型的是 nd 的数值、以及登记了却没配摘录的待查量）必须补进题面或从解答里消掉。这一步不写进输出，但必须做。

${STRUCTURED_FIELDS_NOTE}

输出严格 JSON，不含 markdown：
{
  "problemId": "（系统自动生成，无需填写）",
  "knowledgePoint": "${ctx.kp}",
  "chosenDimension": "${ctx.chosenDimension}",
  "questionText": "完整题干（⚠️正文≤450字，不含清单那一节：工程情境 + 设计输入 + 【已知量前置】给出的正向量 + 必要的多行手册摘录 + 求解要求 + 【须报出的量】清单（≤8项）+ 安全系数口径声明）",
  "coreData": {
    "物理量名称": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "求解目标描述",
  "referenceAnswer": "完整标准解答（含公式与适用条件、选行依据、代入、圆整回代、多准则比较、governing 项、最终答案与单位）",
  "referenceSteps": ["步骤1", "步骤2", "...（标准档4-6步，困难档5-8步，顶级档6-10步；题面已前置的量不再单列一步）"],
  "governingItem": "主控失效项的键名（如 wear_pinion / fatigue / buckling / hook_r1_fatigue；若结论为无可行方案则填 no_feasible_solution）",
  "handbookLookupItems": ["刻意不给最终值、要求自行查表取值的量名（需与 coreData 的键名一致）"],
  "designFactorFloor": 设计安全系数下限数值（如 1.5；无则填 null。⚠️若解答里用它做过"是否满足"的比较，题面必须已给出这个数值——只写"与 nd 比较"却不给 nd 的值，题目不可解）,
  "roundedQuantities": ["被圆整的量及圆整前后值，如 模数 m: 3.17 → 4"],
${STRUCTURED_FIELDS_SPEC}
}`;
}

function buildShortAnswerPrompt(ctx: PromptContext): string {
    return `${buildCommonHead(ctx, '你是机械设计领域的资深教授和命题专家。请生成一道高质量机械设计**简答题/论述题**，同时给出完整的参考答案和要点。')}
【题目质量要求】：
1. 题干必须提出明确的论述性问题，且落在**判据选择、失效机理迁移、手册取值口径**三类上（如"说明在什么条件下该传动的主控失效模式会从齿根折断迁移为齿面点蚀，并给出判断依据"）。
2. 至少覆盖 3 个概念的推理链，考察为什么这样判、错判的后果是什么。
3. 不要求数值计算；可用半定量表述（数量级、单调性、分界条件）。
4. 允许给出必要背景（机器类型、工况、材料与热处理状态、组织或磨损特征）。
5. ${ctx.singleQuestion ? '⚠️【强制单问】只能有一个论述问题，禁止拆成 (1)(2)。' : '最多 2 问，且第 1 问必须是第 2 问的必要前提。'}
6. 题面纯净：不得点出准则名或判断结论（否则退化为背诵题）。

【参考答案要求】：
1. referenceAnswer：完整论述（400-700 字），含失效机理、所依据的准则/判据（可在答案中点名，题面不可）、分界条件、错判后果、工程含义。
2. referencePoints：4-8 条核心要点（每条 15-40 字），至少各含 1 条机理断言、1 条判据引用、1 条工程含义。
3. 论述必须机械设计上正确，禁止捏造准则、误引公式、混淆量的口径。

输出严格 JSON，不含 markdown：
{
  "problemId": "（系统自动生成，无需填写）",
  "knowledgePoint": "${ctx.kp}",
  "chosenDimension": "${ctx.chosenDimension}",
  "questionText": "完整论述题题干（150-300字）",
  "coreData": {},
  "requiredAnswer": "论述问题的简明描述",
  "referenceAnswer": "完整论述参考答案（400-700字）",
  "referencePoints": ["要点1（15-40字）", "要点2", "...（至少4条）"],
  "governingItem": "该题讨论的核心失效项键名（无则填 discussion_only）",
  "handbookLookupItems": [],
  "designFactorFloor": null,
  "roundedQuantities": [],
  "handbookExcerpts": [],
  "answerKey": {
    "conclusion": "一句话概括该题的核心结论（论述题也要有可判定的落点）",
    "values": [],
    "safetyFactors": [],
    "governing": "与 governingItem 一致"
  }
}`;
}

function buildMixedPrompt(ctx: PromptContext): string {
    return `${buildCommonHead(ctx, '你是机械设计领域的资深教授和命题专家。请生成一道高质量机械设计**混合题**：一道题含 2-4 个小问，其中至少 1 个计算小问（求带单位的数值）、至少 1 个论述小问（考察判据选择/失效机理/工程含义）。**同时给出完整参考答案**。')}
【题目质量要求】：
1. 题干必须是**同一台机器、同一工况**：先给情境与设计输入（含必要的多行手册摘录），再依次列出小问 (1)(2)(3)…
2. 论述小问必须**依赖**前面的计算结果（如"结合 (1) 的校核结果，说明该传动由哪种失效模式控制及其原因"），不得各自为政。
3. 计算小问至少 4 步，含一次圆整回代与一处判据分叉。
4. ${ctx.singleQuestion ? '⚠️【强制】小问总数控制在 2 个：1 个计算 + 1 个论述。' : '小问总数 2-4 个，形成递进推理链。'}
5. 题面纯净：不点准则名、不给判断结论、不给许用值。

【参考答案要求】：
1. referenceAnswer：分小问作答并标注编号；计算小问含公式、选行依据、代入、圆整回代、结果与单位；论述小问含机理、判据、错判后果。
2. referenceSteps：计算小问的推导步骤（≥4 步）。
3. referencePoints：论述小问的核心要点（≥3 条，每条 15-40 字）。
4. coreData：题面给出的全部设计输入（手册待查量也列入，但其值不得出现在题面文字中）。

${STRUCTURED_FIELDS_NOTE}

输出严格 JSON，不含 markdown：
{
  "problemId": "（系统自动生成，无需填写）",
  "knowledgePoint": "${ctx.kp}",
  "chosenDimension": "${ctx.chosenDimension}",
  "questionText": "完整题干含情境+设计输入+【已知量前置】的正向量+手册摘录+多小问 (1)(2)(3)（⚠️正文≤500字，不含清单那一节）+【须报出的量】清单（≤8项，只覆盖计算小问）+安全系数口径声明",
  "coreData": {
    "物理量名称": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "所有小问的合并简述",
  "referenceAnswer": "完整分小问参考答案",
  "referenceSteps": ["计算步骤1", "计算步骤2", "...（至少4步）"],
  "referencePoints": ["论述要点1（15-40字）", "论述要点2", "...（至少3条）"],
  "governingItem": "主控失效项键名",
  "handbookLookupItems": ["要求自行查表取值的量名"],
  "designFactorFloor": 设计安全系数下限数值（无则填 null）,
  "roundedQuantities": ["被圆整的量及圆整前后值"],
${STRUCTURED_FIELDS_SPEC}
}`;
}


