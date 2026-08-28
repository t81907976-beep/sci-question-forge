/**
 * Mechanical V2 — 机械设计确定性拦截器（机械学科专属，非 LLM）
 *
 * 定位与 materials/v2/physics-lint.ts 相同：在 LLM 审查（A2）之前跑一遍确定性
 * 硬规则，命中即强制进入 validityIssues，不依赖 LLM 是否"注意到"。
 *
 * 但机械的硬伤类别与材料学不同。materials 那 274 行里没有任何算术复算，
 * 只做"教科书常数记错了没"；机械最容易崩的四类它全不覆盖，本文件补上：
 *   1. checkStandardSeries    标准系列离散归属——模数/线径/带长/键宽只能取 GB 值
 *   2. checkRoundBackSub      圆整回代自洽——圆整后必须用圆整值重算派生量
 *   3. checkArithmetic        算术链复算——把解答里的纯数值等式实际算一遍
 *   4. checkGoverning         governing 项唯一性——多项校核必须显式取最不利者
 * 另外两类来自实测结论：
 *   5. checkTemplateEntrance  模板入口暴露即不合格（题面点出方法/判据名 → 答题方照做）
 *   6. checkHandbookIsolation 手册量必须缺席题面——与 materials 的题干自足性极性相反
 * 另有两类针对"表体被造反"与"结论由噪声决定"：
 *   7. checkTableAnchors      摘录表体的身份/单调方向/量级带复算（对结构化字段做算术）
 *   8. checkDecisionMargin    判定余量下限（governing 项之间、安全系数对 nd）
 * 一类针对"交付清单反而把作法说漏了"：
 *   9. checkDeliverables      「须报出的量」清单的作法泄漏与覆盖度
 * 第 9 类内含两条信噪比 warning（清单项数上限 8、题面正文上限 450 字）：
 *   出题体量失控会让盲解复现不出来，而盲解复现不出的题没有判据价值。两条都不阻断。
 */

import type { MechanicalTableAnchor } from '../disciplines';
import { getMatchedTableAnchors, getMarginFloor } from '../disciplines';
import type {
    MechanicalHandbookExcerpt,
    MechanicalExcerptRow,
    MechanicalMarginReport,
    MechanicalAnswerKey,
    MechanicalDeliverable,
} from './generator';

export interface MechanicalLintResult {
    /** 是否存在硬伤 */
    hasViolation: boolean;
    /** 违规明细（会被注入 A2 的 validityIssues） */
    violations: string[];
    /** 需要 LLM 重点复核的可疑点（非阻断） */
    warnings: string[];
}

export interface MechanicalLintDraft {
    questionText: string;
    referenceAnswer: string;
    coreData: Record<string, { value: number | string; unit: string }>;
    /** 解答分步；提供时算术复算的定位更准 */
    referenceSteps?: string[];
    /** 出题器自报的主控失效项键名，用于校验它是否真的等于最不利项 */
    governingItem?: string;
    /** 题面刻意不给、要求答题方自行查手册/目录的量名（信息隔离白名单） */
    handbookLookupItems?: string[];
    /** 题目声明的设计安全系数下限，用于判定"硬凑通过" */
    designFactorFloor?: number;
    /** 知识点方向名，用于取该方向的手册表不变量与判定余量下限 */
    knowledgePoint?: string;
    /** A1 自报的结构化手册摘录，供 checkTableAnchors 逐行复算 */
    handbookExcerpts?: MechanicalHandbookExcerpt[];
    /** A1 自报的判定余量 */
    marginReport?: MechanicalMarginReport;
    /** A1 自报的紧凑答案，用于与 marginReport 交叉核对 */
    answerKey?: MechanicalAnswerKey;
    /** A1 自报的「须报出的量」清单，供 checkDeliverables 查作法泄漏与覆盖度 */
    deliverables?: MechanicalDeliverable[];
    /** 题型；交付清单只对有数值落点的题型要求，纯论述题豁免 */
    questionType?: string;
}

/* ------------------------------------------------------------------ *
 * 1. 标准系列离散归属
 * ------------------------------------------------------------------ */

/**
 * GB 标准系列。机械设计的选型结果只能落在这些离散值上，
 * 落在区间内的"连续解"就是没做圆整，属硬伤而非风格问题。
 */
const STANDARD_SERIES: Array<{
    label: string;
    /** 从题面/解答中抓取"某量 = 数值"的正则，捕获组 1 为数值 */
    pattern: RegExp;
    allowed: number[];
    unit: string;
}> = [
    {
        label: '渐开线圆柱齿轮第一系列模数（GB/T 1357）',
        pattern: /模数\s*m[n]?\s*[为=≈取:：]\s*([0-9]+(?:\.[0-9]+)?)\s*mm/g,
        allowed: [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50],
        unit: 'mm',
    },
    {
        label: '圆柱螺旋弹簧钢丝直径系列（GB/T 1358）',
        pattern: /(?:钢丝|簧丝)直径\s*d\s*[为=≈取:：]\s*([0-9]+(?:\.[0-9]+)?)\s*mm/g,
        allowed: [0.5, 0.6, 0.8, 1, 1.2, 1.6, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8, 10, 12, 16, 20, 25],
        unit: 'mm',
    },
    {
        label: '普通平键键宽系列（GB/T 1096）',
        pattern: /键宽\s*b\s*[为=≈取:：]\s*([0-9]+(?:\.[0-9]+)?)\s*mm/g,
        allowed: [2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40, 45, 50],
        unit: 'mm',
    },
    {
        label: '滚动轴承内径系列（GB/T 273 常用段）',
        pattern: /轴承内径\s*d\s*[为=≈取:：]\s*([0-9]+(?:\.[0-9]+)?)\s*mm/g,
        allowed: [10, 12, 15, 17, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
        unit: 'mm',
    },
];

function checkStandardSeries(text: string): string[] {
    const violations: string[] = [];
    for (const series of STANDARD_SERIES) {
        const re = new RegExp(series.pattern.source, series.pattern.flags);
        let match: RegExpExecArray | null;
        while ((match = re.exec(text)) !== null) {
            const stated = Number(match[1]);
            if (!Number.isFinite(stated)) continue;
            // 允许 0.5% 的书写误差（如 2.5 写成 2.50）
            const hit = series.allowed.some(v => Math.abs(v - stated) <= Math.max(1e-9, v * 0.005));
            if (hit) continue;

            // 圆整前的连续解本来就该落在系列之外（"解出 m=3.55 mm，按 GB/T 1357 圆整取 4 mm"）。
            // 紧随其后出现圆整动作的，是正确解法而非硬伤——只有"连续解就是最终结果"才判违规。
            const tail = text.slice(match.index + match[0].length, match.index + match[0].length + 60);
            if (/圆整|取整|标准(?:值|系列)|GB\s*\/?\s*T|第一系列|系列值/.test(tail)) continue;

            const nearest = series.allowed.reduce(
                (a, b) => (Math.abs(b - stated) < Math.abs(a - stated) ? b : a),
                series.allowed[0],
            );
            violations.push(
                `标准系列取值错误：${series.label} 不含 ${stated}${series.unit}（最近的合法值为 ${nearest}${series.unit}）——选型结果必须圆整到标准系列，不得使用连续解`,
            );
        }
    }
    return [...new Set(violations)];
}

/* ------------------------------------------------------------------ *
 * 2. 圆整回代自洽
 * ------------------------------------------------------------------ */

/** 全角符号与常见异体写法归一，使后续正则能稳定命中 */
function normalizeMechText(text: string): string {
    return text
        .replace(/[＝]/g, '=')
        .replace(/[（]/g, '(')
        .replace(/[）]/g, ')')
        .replace(/[，]/g, ',')
        .replace(/[×✕✖]/g, '*')
        .replace(/[－−—]/g, '-')
        .replace(/[／]/g, '/')
        .replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
}

/** 把量名当字面量塞进正则（键名里常见 [ ] . ( ) _ 等元字符） */
function escapeForRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 抓"计算值 X → 圆整为 Y"的三元组，再检查圆整后的 Y 是否真的被带回后续计算。
 * 判据：圆整发生后，解答里若继续出现圆整前的那个数值参与运算，即为未回代。
 */
function checkRoundBackSub(text: string): string[] {
    const violations: string[] = [];
    const normalized = normalizeMechText(text);

    // 形如 "计算值 3.17mm，圆整取 4mm" / "d=3.17 → 取标准值 d=4"
    const roundRe = /([0-9]+(?:\.[0-9]+)?)\s*(?:mm|kN|N|kW|MPa)?\s*(?:，|,|\s)*(?:圆整|取整|向上取整|按标准(?:值|系列)?)(?:为|取|到|至)?\s*([0-9]+(?:\.[0-9]+)?)/g;
    let match: RegExpExecArray | null;
    while ((match = roundRe.exec(normalized)) !== null) {
        const before = match[1];
        const after = match[2];
        if (before === after) continue;

        // 圆整语句之后的正文
        const tail = normalized.slice(match.index + match[0].length);
        if (tail.length < 20) continue;

        // 圆整前的值若在后文继续作为运算数出现，说明派生量没有用圆整值重算
        const beforeAsOperand = new RegExp(
            `(?:^|[^0-9.])${before.replace('.', '\\.')}(?:[^0-9]|$)`,
        );
        const afterAppears = new RegExp(
            `(?:^|[^0-9.])${after.replace('.', '\\.')}(?:[^0-9]|$)`,
        );
        if (beforeAsOperand.test(tail) && !afterAppears.test(tail)) {
            violations.push(
                `圆整未回代：数值圆整为 ${after} 之后，后续计算仍在使用圆整前的 ${before}，所有派生量必须用圆整值重算`,
            );
        }
    }
    return [...new Set(violations)];
}

/* ------------------------------------------------------------------ *
 * 3. 算术链复算（全仓无先例，机械长计算链的唯一硬校验）
 * ------------------------------------------------------------------ */

/**
 * 极小的算术求值器。只认数字、+ - * / ^ √ π 和括号——**不使用 eval**，
 * 遇到任何不认识的字符即返回 null（放弃该式，不误报）。
 *
 * 两处修正，都是实测踩出来的：
 * ① **一元负号原先用"往输出栈塞个 0"实现，遇到 `10^-6` 会算成 `10^0-6=-5`**
 *    （幂的优先级高于减，0 被 ^ 吃掉了）。实测中
 *    `7800*19.635*10^-6*790.88*10^-3=0.1210` 因此被判成"实际应为 148405，偏差 1.2 亿%"——
 *    一条完全正确的质量计算被当成硬伤，还挤掉了 reported<5 的名额。
 *    改为在分词后把一元负号并进数字字面量，`^` 的优先级就再也碰不到它。
 * ② 机械公式几乎离不开 π 和 √（应力、截面惯性矩、接触应力全都有），原先一律跳过，
 *    等于长计算链里最容易算错的那些式子恰好都不查。现在把 π 当常量、√ 当最高优先级
 *    右结合一元运算符吃下。
 */
const PI_CHARS = /[πΠ]/g;

function safeEvalArithmetic(expr: string): number | null {
    const src = expr.replace(PI_CHARS, 'P');
    if (!/^[0-9+\-*/^().\sP√]+$/.test(src)) return null;

    const rawTokens = src.match(/[0-9]+(?:\.[0-9]+)?|[+\-*/^()P√]/g);
    if (!rawTokens || rawTokens.length === 0) return null;

    // 一元负号并进后面的数字字面量：'-' '6' → '-6'。并不掉的（如 -(3+4)）直接放弃。
    const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3, '√': 4 };
    const tokens: string[] = [];
    for (let i = 0; i < rawTokens.length; i++) {
        const t = rawTokens[i];
        if (t !== '-') { tokens.push(t); continue; }
        const prevTok = tokens.length === 0 ? null : tokens[tokens.length - 1];
        const isUnary = prevTok === null || prevTok === '(' || prec[prevTok] !== undefined;
        if (!isUnary) { tokens.push(t); continue; }
        const next = rawTokens[i + 1];
        if (next === undefined || !/^[0-9]/.test(next)) return null;
        tokens.push(`-${next}`);
        i++;
    }

    const isNum = (t: string) => /^-?[0-9]/.test(t) || t === 'P';
    const output: string[] = [];
    const ops: string[] = [];

    for (const t of tokens) {
        if (isNum(t)) {
            output.push(t);
        } else if (t === '(') {
            ops.push(t);
        } else if (t === ')') {
            while (ops.length && ops[ops.length - 1] !== '(') output.push(ops.pop()!);
            if (!ops.length) return null;
            ops.pop();
        } else {
            if (prec[t] === undefined) return null;
            // ^ 与 √ 右结合：同优先级不弹出
            const rightAssoc = t === '^' || t === '√';
            while (
                ops.length &&
                ops[ops.length - 1] !== '(' &&
                (rightAssoc
                    ? prec[ops[ops.length - 1]] > prec[t]
                    : prec[ops[ops.length - 1]] >= prec[t])
            ) {
                output.push(ops.pop()!);
            }
            ops.push(t);
        }
    }
    while (ops.length) {
        const op = ops.pop()!;
        if (op === '(') return null;
        output.push(op);
    }

    const stack: number[] = [];
    for (const t of output) {
        if (t === 'P') { stack.push(Math.PI); continue; }
        if (isNum(t)) { stack.push(Number(t)); continue; }
        if (t === '√') {
            const a = stack.pop();
            if (a === undefined || a < 0) return null;
            stack.push(Math.sqrt(a));
            continue;
        }
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) return null;
        if (t === '+') stack.push(a + b);
        else if (t === '-') stack.push(a - b);
        else if (t === '*') stack.push(a * b);
        else if (t === '/') {
            if (b === 0) return null;
            stack.push(a / b);
        } else if (t === '^') stack.push(Math.pow(a, b));
        else return null;
    }
    return stack.length === 1 && Number.isFinite(stack[0]) ? stack[0] : null;
}

/** 左右两侧只差一个 10 的整数次幂（含 ±1.5% 容差）→ 几乎一定是省略了单位换算，
 *  不是算错。实测中 `6515/0.174533 = 37.33`（N·mm/rad 写成 N·m/rad）就是这形态，
 *  原先被判成"偏差 99895%"的硬伤。判不了它到底是笔误还是换算，所以降成 warning。 */
function decadeRatioExponent(lhs: number, rhs: number): number | null {
    if (!Number.isFinite(lhs) || !Number.isFinite(rhs) || rhs === 0 || lhs === 0) return null;
    const ratio = Math.abs(lhs / rhs);
    for (let k = -6; k <= 6; k++) {
        if (k === 0) continue;
        const target = Math.pow(10, k);
        if (Math.abs(ratio - target) / target <= 0.015) return k;
    }
    return null;
}

/**
 * 抓解答里的纯数值等式 "<算式> = <结果>"，实际算一遍并比对。
 * 相对误差 > 1.5% 判硬伤（留出中间量圆整与查表插值的余量）。
 * 只处理算式侧全为数字、运算符与 π/√ 的等式——含其他符号的一律跳过，宁漏不误报。
 *
 * 结果侧必须连科学记数法一起吃下（机械解答里 "60*1800*9000=9.72*10^8" 是常态写法）。
 * 只截到 9.72 会把正确等式判成偏差 1e10%——实测踩过这个坑。
 *
 * 两侧恰好差 10 的整数次幂时降为 warning（见 decadeRatioExponent）。
 * 这类几乎全是省写单位换算（N·m 与 N·mm、m 与 mm），判成硬伤会把正确解答毙掉，
 * 而且它们的"偏差 99895%"极为醒目，会挤占 reported<5 的名额，把真正 1.5-15% 的
 * 算错顶出报告——实测中就出现过整份报告只剩三条换算噪声的情形。
 */
function checkArithmetic(text: string): { violations: string[]; warnings: string[] } {
    const violations: string[] = [];
    const warnings: string[] = [];
    const normalized = normalizeMechText(text);

    const eqRe = /([0-9π√][0-9+\-*/^().\sπ√]{4,80}?)\s*[=≈]\s*([0-9]+(?:\.[0-9]+)?(?:\s*\*\s*10\s*\^\s*-?[0-9]+|\s*[eE]\s*-?[0-9]+)?)/g;
    let match: RegExpExecArray | null;
    let reported = 0;
    while ((match = eqRe.exec(normalized)) !== null && reported < 5) {
        const lhsRaw = match[1].trim();
        const rhsRaw = match[2].trim();

        // 算式侧必须是完整的一式。若紧邻的前一个字符是符号/希腊字母/运算符，说明我们
        // 只截到了它的尾段（"v=π*80*2500/60000" 会被截成 "80*2500/60000"，π 丢掉后
        // 复算结果差 π 倍——实测踩过）。这种一律放弃，宁漏不误报。
        const prevCh = match.index > 0 ? normalized[match.index - 1] : '=';
        if (/[A-Za-zͰ-Ͽ√·*/^.\-+(\[]/.test(prevCh)) continue;

        const rhs = /[*^eE]/.test(rhsRaw) ? safeEvalArithmetic(rhsRaw.replace(/[eE]\s*(-?[0-9]+)/, '*10^$1')) : Number(rhsRaw);
        if (rhs === null || !Number.isFinite(rhs)) continue;
        // 必须真的是个算式，而不是孤立的一个数
        if (!/[+\-*/^√]/.test(lhsRaw)) continue;

        const lhs = safeEvalArithmetic(lhsRaw);
        if (lhs === null) continue;

        const denom = Math.max(Math.abs(rhs), 1e-9);
        const relErr = Math.abs(lhs - rhs) / denom;
        if (relErr <= 0.015) continue;

        const decade = decadeRatioExponent(lhs, rhs);
        if (decade !== null) {
            warnings.push(
                `单位换算疑似省写：「${lhsRaw} = ${rhsRaw}」左右恰好差 10^${decade}（算式值 ${lhs.toPrecision(6)}）。` +
                `多半是 N·mm 与 N·m、mm 与 m 之类的换算写在了式外——请在式子里显式写出换算因子，或注明两侧单位不同`,
            );
            continue;
        }

        violations.push(
            `算术不自洽：「${lhsRaw} = ${rhsRaw}」实际应为 ${lhs.toPrecision(6)}（相对偏差 ${(relErr * 100).toFixed(1)}%）`,
        );
        reported++;
    }
    return { violations: [...new Set(violations)], warnings: [...new Set(warnings)] };
}

/* ------------------------------------------------------------------ *
 * 4. governing 项唯一性
 * ------------------------------------------------------------------ */

/**
 * 安全系数类量的抓取：形如 "S_H = 1.23" / "SF=567/337=1.68"。
 *
 * 三处实测踩过的坑，都写进了这条正则：
 *   - 符号前必须是非字母数字、且不是 '/' 或汉字：否则 "60nLh=60"、"9550P/n=9550"、
 *     "满足nd=1.5"（设计下限而非算得的安全系数）全会被误抓成安全系数。
 *   - 必须吃下连等链，取**最后**一个数：机械解答几乎总写成 "SF=[σF]/σF=567/337=1.68"，
 *     只截第一个数会抓到分子 567。
 *   - 下标只允许拉丁字母：汉字会把后面整句吞进来。
 * 捕获组 1 为下标，组 3 为数值（组 2 是被跳过的连等中段）。
 */
const FACTOR_RE = /(?:^|[^A-Za-z0-9/一-龥])(?:SF|SH|S|n)\s*[_\-]?\s*([A-Za-z]{0,4})\s*[=≈]\s*((?:[^=≈,，;；。\n]*[=≈])*)\s*([0-9]+(?:\.[0-9]+)?)/g;

/** 设计安全系数下限（nd / n_d / S_min）是题目给的阈值，不是算得的安全系数 */
const DESIGN_FLOOR_TAGS = new Set(['d', 'min', 'D', 'MIN']);

/**
 * 机械校核题的结论由**最不利项**决定。两种硬伤：
 *   a) 解答里出现多个安全系数，却没有任何"取最小/最不利"的显式比较动作；
 *   b) 出题器自报的 governingItem 并不对应数值最小的那一项。
 *
 * ⚠️ **只吃解答侧（referenceAnswer + referenceSteps），不吃题面**。
 * 原先传的是 combined，与 checkTemplateEntrance 撞出一个静默漏洞：
 * `(主控|控制性|决定性)(失效)?(项|模式)(为|是|即)` 这串措辞在题面里是 violation
 * （模板入口暴露，见 TEMPLATE_ENTRANCE_TOKENS），在解答里却是 hasComparison 的合法证据。
 * 题面一旦写了这句，它会一边被判泄漏、一边替解答"满足"了显式比较——
 * 解答里真的没做比较也查不出来。判断层必须在解答里被真的做过一次。
 */
function checkGoverning(text: string, governingItem?: string): string[] {
    const violations: string[] = [];
    const normalized = normalizeMechText(text);

    const found: Array<{ tag: string; value: number }> = [];
    const re = new RegExp(FACTOR_RE.source, FACTOR_RE.flags);
    let match: RegExpExecArray | null;
    while ((match = re.exec(normalized)) !== null) {
        const tag = (match[1] || '').trim();
        if (DESIGN_FLOOR_TAGS.has(tag)) continue; // nd 是下限阈值，不参与"多个安全系数"计数
        const value = Number(match[3]);
        if (Number.isFinite(value) && value > 0 && value < 100) {
            found.push({ tag, value });
        }
    }

    const distinct = [...new Set(found.map(f => f.value))];
    if (distinct.length < 2) return violations;

    // 显式比较动作的各种写法。实测机械解答最常用的是"比较两项安全裕量…因此由弯曲疲劳控制"，
    // 只认"取最小"会把正确解答判成硬伤。
    const hasComparison = /取(?:其)?(?:最小|较小|最不利)|最不利(?:项|工况|失效)|min\s*[（(]|以.{0,12}为(?:控制|主控|决定)|(?:主控|控制性|决定性)(?:失效)?(?:项|模式)\s*(?:为|是|即)|由.{0,14}(?:控制|决定)|比较.{0,16}(?:安全系数|裕量|裕度)/.test(normalized);
    if (!hasComparison) {
        violations.push(
            `主控失效项未判定：解答中出现 ${distinct.length} 个不同的安全系数（${distinct.join('、')}），但没有显式比较并取最不利者——机械校核的结论必须由 governing 项决定`,
        );
    }

    if (governingItem) {
        const minValue = Math.min(...found.map(f => f.value));
        const claimed = found.filter(f => f.tag && governingItem.includes(f.tag));
        if (claimed.length > 0 && !claimed.some(f => Math.abs(f.value - minValue) < 1e-9)) {
            violations.push(
                `governing 项标注错误：自报主控项为「${governingItem}」（值 ${claimed[0].value}），但解答中最小的安全系数是 ${minValue}`,
            );
        }
    }
    return [...new Set(violations)];
}

/* ------------------------------------------------------------------ *
 * 5. 模板入口暴露
 * ------------------------------------------------------------------ */

/**
 * 实测结论：题面一旦点出方法名/判据阈值/模型选择，答题模型只需照做，防御力归零
 * （P7 正向公式链实测有效率 0%）。机械题最容易犯这条——因为写清"用哪个准则"
 * 看起来像是把题目出严谨了，实际是把判断层送给了答题方。
 *
 * 注意与"作法泄漏四查"的区别：那是查不准泄漏具体陷阱，这是查不准摆出标准路线入口。
 * 两者不等价，可以同时成立。
 */
const TEMPLATE_ENTRANCE_TOKENS: Array<{ token: RegExp; label: string }> = [
    { token: /(?:请|应|需)(?:使用|按|采用|依据)\s*(?:DE-Goodman|Goodman|Gerber|Soderberg|Morrow)/i, label: '疲劳准则名' },
    { token: /(?:请|应|需)(?:使用|按|采用|依据)\s*(?:欧拉|Euler|约翰逊|Johnson)\s*公式/, label: '压杆公式选择' },
    { token: /(?:请|应|需)(?:使用|按|采用)\s*(?:均匀磨损|均压|uniform\s*wear|uniform\s*pressure)(?:模型|假设)/i, label: '摩擦副模型选择' },
    { token: /(?:请|应|需)(?:使用|按|采用|依据)\s*(?:最大剪应力|MSS|畸变能|DE|von\s*Mises|库仑-?莫尔|Coulomb-?Mohr)/i, label: '静强度准则名' },
    { token: /本题(?:属于|为)\s*(?:细长|中柔度|短粗)(?:杆|柱)/, label: '柔度类别判定结论' },
    { token: /(?:由于|因为).{0,20}(?:大于|小于|超过).{0,16}(?:临界|分界|界限).{0,10}(?:柔度|长细比|转速)/, label: '判据分叉结论' },
    { token: /(?:主控|控制性|决定性)(?:失效)?(?:项|模式)\s*(?:为|是|即)/, label: 'governing 项结论' },
    // 许用值（含下标写法 [σH] / [σF] / [τ]）直接给出，等于把查表环节从题里删掉
    { token: /(?:许用|允许)(?:接触|弯曲|剪切|挤压)?应力\s*\[?\s*[σστ][A-Za-z0-9]{0,3}\s*\]?\s*[=为取]\s*[0-9]/, label: '许用值直接给出' },
    // ---- 组合梁方向 ----
    // 该方向唯一的判断层就是"中性轴要按弹性模量加权求"，题面一旦点出解法名或直接
    // 给出中性轴位置，剩下的只是代 σ=E(y−ȳ)/ρ，与点出疲劳准则名同罪。
    // 三条都要求出现"祈使+方法名"或"位置+数字"，不会撞上合法写法：
    // 「试求中性层的位置」（无位于/在+数字）、「各层固结为一体」「平面假设成立」均放行。
    { token: /(?:请|应|需|须|按)(?:使用|按|采用|依据|照)?\s*(?:模量加权|弹性模量加权|刚度加权|换算截面|等效截面|折算截面)/, label: '组合梁解法名' },
    // 位置必须带长度单位才算"给了数"：「中性轴位于距底边 24.25h 处」拦，
    // 「试求中性层的位置」「中性轴的位置是本题第 1 问」放行（后者的 "1 问" 不带长度单位）。
    { token: /中性(?:轴|层)(?:的)?\s*(?:位于|位置\s*(?:为|在|是|等于)|距[^，,。；;]{0,10}(?:为|等于)?)[^，,。；;]{0,10}?[0-9]+(?:\.[0-9]+)?\s*(?:h|mm|cm|m|%|倍)/, label: '中性轴位置直接给出' },
    { token: /中性(?:轴|层)\s*(?:并?不|不)(?:与|在|通过)?\s*(?:几何)?形心/, label: '中性轴≠形心的结论' },
    { token: /(?:层界|界面|结合面)\s*(?:处|上|两侧)?\s*(?:应变连续|应力(?:不连续|跳变|突变)|正应力(?:不连续|跳变|突变))/, label: '层界应力/应变性质结论' },
];

function checkTemplateEntrance(questionText: string): string[] {
    const violations: string[] = [];
    for (const item of TEMPLATE_ENTRANCE_TOKENS) {
        if (item.token.test(questionText)) {
            violations.push(
                `模板入口暴露（${item.label}）：题面已把判断层的结论或方法名交给答题方，题目退化为正向公式链——判断层必须由答题方自行完成`,
            );
        }
    }
    return [...new Set(violations)];
}

/* ------------------------------------------------------------------ *
 * 6. 手册量信息隔离（与 materials 的题干自足性极性相反）
 * ------------------------------------------------------------------ */

/**
 * materials 的 checkDataSelfSufficiency 要求 coreData 每一项都出现在题面；
 * 机械正相反：**手册可查的量不能给成"唯一取值"**，必须让答题方自己选行取值，
 * 取错即全链崩。
 *
 * 但"必须缺席题面"是过头的口径：题目要可解，摘录就得进题面。真正要拦的是
 * **查表环节被跳过**，即题面把某个手册量写成一个无需判断即可直接取用的定值。
 * 因此判据改为：
 *   - 题面中该量只对应 1 个数值，且等于 coreData 里的取值 → 违规（唯一取值）
 *   - 题面中该量对应 ≥2 个候选数值（多行摘录/档位分界）→ 合规，需选行才能定值
 * 与 reviewer.ts 的硬闸门 2 同口径。
 */
function checkHandbookIsolation(draft: MechanicalLintDraft): string[] {
    const violations: string[] = [];
    const items = draft.handbookLookupItems || [];
    if (items.length === 0) return violations;

    const stem = normalizeMechText(draft.questionText);

    for (const name of items) {
        const entry = draft.coreData?.[name];
        if (!entry) continue;
        const valueStr = String(entry.value);
        const numericCore = valueStr.replace(/[^\d.]/g, '');
        if (numericCore.length < 2) continue; // 一位数字太容易偶然撞上
        if (!stem.includes(numericCore)) continue; // 未出现在题面，信息隔离成立

        // 出现了 → 判断是"唯一取值"还是"多行摘录里的一行"。
        // 以该量名/符号为锚点，统计其后窗口内出现的不同数值个数。
        const anchor = escapeForRegex(name);
        const candidates = new Set<string>();
        const anchorRe = new RegExp(anchor, 'g');
        let anchorMatch: RegExpExecArray | null;
        while ((anchorMatch = anchorRe.exec(stem)) !== null) {
            const window = stem.slice(anchorMatch.index, anchorMatch.index + 220);
            for (const num of window.match(/[0-9]+(?:\.[0-9]+)?/g) || []) {
                candidates.add(num);
            }
        }
        // 锚点找不到（题面用了别名/符号写法）时退化为全文候选数，避免误报
        if (candidates.size === 0) continue;
        if (candidates.size >= 2) continue; // 多候选 → 需选行，合规

        violations.push(
            `手册量给成唯一取值：「${name}」被声明为需自行查表取值，但题面只给出单一数值 ${valueStr}${entry.unit || ''}，答题方无需任何判断即可直接取用——选行环节被跳过。应改为附 2-3 行带适用条件（档位/区间/硬度段）的摘录`,
        );
    }
    return [...new Set(violations)];
}

/* ------------------------------------------------------------------ *
 * 7. 摘录表体不变量复算
 * ------------------------------------------------------------------ */

/**
 * 把量名/符号与学科不变量对上。symbol 精确命中优先，其次 aliases，
 * 最后才做包含匹配——顺序反了会让 'K' 抢走 'KR' 的匹配。
 */
function matchAnchor(
    excerpt: MechanicalHandbookExcerpt,
    anchors: MechanicalTableAnchor[],
): MechanicalTableAnchor | null {
    const symbol = (excerpt.symbol || '').trim();
    const name = (excerpt.name || '').trim();
    const norm = (s: string) => s.replace(/[_\-\s（）()【】]/g, '').toLowerCase();
    const symbolKey = norm(symbol);
    const nameKey = norm(name);

    for (const a of anchors) {
        if (norm(a.symbol) === symbolKey) return a;
    }
    for (const a of anchors) {
        if (a.aliases.some(al => norm(al) === symbolKey || norm(al) === nameKey)) return a;
    }
    // 包含匹配只在被检符号足够长时启用（≥2 字符），避免 'S'、'K' 之类的单字母乱撞
    if (symbolKey.length >= 2) {
        for (const a of anchors) {
            if (norm(a.symbol) === symbolKey) continue;
            if (a.aliases.some(al => norm(al).includes(symbolKey) || symbolKey.includes(norm(al)))) return a;
        }
    }
    if (nameKey.length >= 3) {
        for (const a of anchors) {
            if (a.aliases.some(al => nameKey.includes(norm(al)))) return a;
        }
    }
    return null;
}

/** 无量纲的各种写法归一，用于判断 band 是否可比 */
function isDimensionless(unit: string): boolean {
    const u = (unit || '').trim();
    return u === '' || u === '—' || u === '-' || u === '1' || u === '无量纲' || u === '—' || u === '/';
}

function unitsComparable(a: string, b: string): boolean {
    if (isDimensionless(a) && isDimensionless(b)) return true;
    return (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();
}

/**
 * 摘录的条件轴是否与不变量登记的那根轴是同一根。
 *
 * checkTableAnchors 原先直接假定"匹配上符号 = 行是沿 anchor.conditionAxis
 * 排列的"，从不核对，于是按 conditionValue 排序判单调 —— 而 A1 的摘录经常压根不在那根轴上：
 *   · 轴承 e 表的行键是候选内径 d=20/50 mm，anchor 轴却是 Fa/C0r
 *   · 弹簧「疲劳耐久限比例」表按载荷类别×材料二维组织，却被 alias 包含匹配吃进 Sut（簧丝直径轴）
 *     的不变量里——A2 当轮在 depth 里明确反驳了 lint："并不存在沿簧丝直径递增或递减的轴"，
 *     审查方比确定性检查器清醒，可 violation 已经把题毙了。
 * 轴不同说明 matchAnchor 抓错了量，此时身份/方向/量级三项比较全部无意义，只留一条 warning
 * 交给 A2 语义复核。放宽方向是安全的：漏判只是少拦一道，误判是把合法题作废。
 */
function axisAgrees(excerptAxis: string, anchorAxis: string): boolean {
    // 去掉"（由低到高）"这类方向注解与括注，只留轴的物理名
    const strip = (s: string) => (s || '')
        .replace(/[（(][^)）]*[)）]/g, ' ')
        .replace(/[_\-\s【】]/g, '')
        .toLowerCase();
    const ex = strip(excerptAxis);
    const an = strip(anchorAxis);
    if (!ex || !an) return true; // 缺注不惩罚
    // anchor 轴可能是"A 或 B"的复合（如 'Fa/C0r（深沟球）或轴承系列（圆锥滚子）'），逐支比对
    const branches = an.split(/或|、|,|，/).map(s => s.trim()).filter(Boolean);
    for (const b of branches) {
        if (ex.includes(b) || b.includes(ex)) return true;
        // A1 会用自己的话写轴名（"按目标可靠度查取"对"目标可靠度 R"），
        // 故再退两步：去掉限定前缀、去掉尾部的拉丁符号，只要核心词（≥2 字）出现即认同一根轴。
        // 放宽方向是刻意的：认错轴只是少拦一张表，认不出轴会把合法表的三项检查全跳过。
        const core = b.replace(/^(目标|工作|标准|候选|各|该)/, '').replace(/[a-z0-9/=²^.]+$/, '');
        if (core.length >= 2 && (ex.includes(core) || core.includes(ex))) return true;
    }
    return false;
}

/** 行键的标度是否混用（HRC 与 HBW 混列即不可同轴排序）。返回混用到的标度名，未混用返回空数组。 */
function mixedConditionScales(rows: MechanicalExcerptRow[]): string[] {
    const SCALES: Array<[RegExp, string]> = [
        [/hrc/i, 'HRC'],
        [/hbw|\bhb\b/i, 'HBW'],
        [/\bhv\b/i, 'HV'],
    ];
    const seen = new Set<string>();
    for (const r of rows) {
        const text = `${r.condition || ''}`;
        for (const [re, label] of SCALES) if (re.test(text)) seen.add(label);
    }
    return seen.size >= 2 ? [...seen] : [];
}

/**
 * 对 A1 自报的结构化摘录逐行复算三样不变量。
 *
 * 只做纯数值/枚举比较，不碰散文正则——上一轮六类正则误报的教训是不再从散文里刮数字。
 * 判定分级严格对齐用户定的两条阈值：
 *   - 身份从"除数"变"乘数"（或反之）→ violation（物理性质搞反，不能容忍）
 *   - 沿条件轴的单调方向反了 → violation（同上）
 *   - 量级带偏离 >50% → violation；>20% → warning
 *   - 其余身份标注差异（direct/multiplier 之类的口径差）→ warning，不阻断
 *
 * ⚠️ warning 门槛取 **20%**，为的是与三份提示词对齐。
 * generator / reviewer / disciplines 三处都逐字写着"数值漂移 10-20% 可接受"，
 * 而代码原先的静默区是 ≤30%——A2 会照提示词按 15-20% 判硬伤，lint 却放行，
 * 同一件事两个口径。50% 这条 violation 线是用户明确定的（"别差出 50% 的差距来"），不动。
 */
function checkTableAnchors(draft: MechanicalLintDraft): { violations: string[]; warnings: string[] } {
    const violations: string[] = [];
    const warnings: string[] = [];
    const excerpts = draft.handbookExcerpts || [];
    if (excerpts.length === 0) return { violations, warnings };

    const anchors = getMatchedTableAnchors(draft.knowledgePoint || '');
    if (anchors.length === 0) return { violations, warnings };

    for (const ex of excerpts) {
        const anchor = matchAnchor(ex, anchors);
        if (!anchor) continue; // 未登记不变量的量：不管，宁漏不误报

        const label = `「${ex.name || ex.symbol}」`;

        // ---- 轴对齐前置门 ----
        // 摘录的行不是沿 anchor 那根轴排列时，matchAnchor 抓错了量，
        // 底下三项比较（身份/方向/量级）全部失去意义，只留 warning 交 A2 语义复核。
        if (!axisAgrees(ex.conditionAxis, anchor.conditionAxis)) {
            warnings.push(
                `摘录条件轴与不变量登记的轴不一致：${label}自报按「${ex.conditionAxis}」排列，本方向登记的 ${anchor.symbol} 是沿「${anchor.conditionAxis}」排列——两者不是同一根轴，已跳过该表的身份/方向/量级检查。请复核这张表究竟是哪个量（若确为 ${anchor.symbol}，请把行改为沿登记轴排列；若是另一个量，请改用其规范符号避免撞名）`,
            );
            continue;
        }

        // ---- 身份 ----
        const flipped =
            (anchor.role === 'divisor' && ex.role === 'multiplier') ||
            (anchor.role === 'multiplier' && ex.role === 'divisor');
        if (flipped) {
            violations.push(
                `表体身份搞反：${label}在本方向应作为**${anchor.role === 'divisor' ? '除数（进入分母）' : '乘数（进入分子）'}**进入公式，题面却按${ex.role === 'divisor' ? '除数' : '乘数'}处理——${anchor.note}。身份反转会让掌握该学科的答题方为纠正题面而被判错、照抄错表的反而得分，区分度反转，题目作废`,
            );
        } else if (anchor.role !== ex.role) {
            warnings.push(
                `表体身份口径不一致：${label}自报为 ${ex.role}，本方向登记为 ${anchor.role}，请复核该量究竟以什么身份进入公式（${anchor.note}）`,
            );
        }

        // ---- 单调方向 ----
        // 行键标度混用（HRC 与 HBW 同表）时不判方向：60 HRC 与 250 HBW 的数字不可同轴排序，
        // 60 < 250 会把"渗碳淬火 60 HRC=1400 / 调质 250 HBW=650"判成递减（实为 60 HRC ≈ 697 HB，方向没反）。
        const mixedScales = mixedConditionScales(ex.rows);
        if (mixedScales.length >= 2) {
            warnings.push(
                `摘录行键标度混用（${mixedScales.join(' 与 ')}）：${label}的各行不在同一硬度标度上，数值不可直接排序，已跳过单调方向检查。请统一为同一标度（或按标度分成两张表），否则答题方也无法判断行的先后`,
            );
        }
        const numericRows = mixedScales.length >= 2
            ? []
            : ex.rows.filter(r => r.conditionValue !== null && Number.isFinite(r.conditionValue as number));
        if (anchor.monotonic !== 'none' && numericRows.length >= 2) {
            const sorted = [...numericRows].sort((a, b) => (a.conditionValue as number) - (b.conditionValue as number));
            const first = sorted[0];
            const last = sorted[sorted.length - 1];
            if ((first.conditionValue as number) !== (last.conditionValue as number)) {
                const delta = last.value - first.value;
                const scale = Math.max(Math.abs(first.value), Math.abs(last.value), 1e-9);
                // 2% 以内当作"基本持平"，不判方向（避免把平表判成反向）
                if (Math.abs(delta) / scale > 0.02) {
                    const actual = delta > 0 ? 'increasing' : 'decreasing';
                    if (actual !== anchor.monotonic) {
                        violations.push(
                            `表体单调方向搞反：${label}沿「${anchor.conditionAxis}」应${anchor.monotonic === 'increasing' ? '递增' : '递减'}，题面摘录却从 ${first.condition || first.conditionValue}=${first.value} 变到 ${last.condition || last.conditionValue}=${last.value}（${actual === 'increasing' ? '递增' : '递减'}）——${anchor.note}`,
                        );
                    }
                }
            }
        }

        // ---- 量级带 ----
        if (unitsComparable(anchor.unit, ex.unit)) {
            const [lo, hi] = anchor.band;
            for (const row of ex.rows) {
                const v = row.value;
                if (!Number.isFinite(v)) continue;
                // 偏离幅度以带宽外侧的相对超出量衡量
                const excess = v < lo
                    ? (lo - v) / Math.max(Math.abs(lo), 1e-9)
                    : v > hi
                    ? (v - hi) / Math.max(Math.abs(hi), 1e-9)
                    : 0;
                if (excess <= 0.2) continue;
                const msg = `${label}的取值 ${v}${ex.unit || ''}（条件：${row.condition || '未注明'}）超出本方向合理量级带 ${lo}~${hi}${anchor.unit} 达 ${(excess * 100).toFixed(0)}%`;
                if (excess > 0.5) {
                    violations.push(`表体量级失真：${msg}——数值漂移 20% 以内可以容忍，但差出 50% 以上说明记错了量或用错了单位制。${anchor.note}`);
                } else {
                    warnings.push(`表体量级可疑：${msg}（超出 20% 即提示，超出 50% 判硬伤），请复核是否记错了量或单位制`);
                }
            }
        }
    }

    return { violations: [...new Set(violations)], warnings: [...new Set(warnings)] };
}

/**
 * 行键值在题面里可能有多种写法，尤其是循环次数这类大数（1e8 / 1×10^8 / 100000000）。
 * 只做几种常见渲染，命中任一即认为题面给出了该行键。
 */
function rowKeyLiterals(v: number): string[] {
    const out = new Set<string>([String(v)]);
    if (Number.isInteger(v) && Math.abs(v) >= 1000) {
        const exp = v.toExponential().replace('e+', 'e');           // 1e8 / 1.5e8
        out.add(exp);
        const [mantissa, power] = exp.split('e');
        if (power) {
            out.add(`10^${power}`);
            out.add(`${mantissa}*10^${power}`);
            out.add(`${mantissa}×10^${power}`);
            if (mantissa === '1') out.add(`×10^${power}`);
        }
    }
    return [...out];
}

/** 条件轴的中文名是否被题面点名（去掉符号与标点后取 ≥2 字的中文片段） */
function axisNamedInStem(axis: string, stem: string): boolean {
    const tokens = (axis || '').match(/[一-龥]{2,}/g) || [];
    return tokens.some(t => stem.includes(t));
}

/**
 * 摘录的行键若是题面已直接给出的量，答题方无需任何判断即可对号入座——
 * 这种摘录不构成选行判断层。判 warning 而非 violation：可靠度 R、工况这类
 * 条件本来就必须写在题面（否则题目不可解），一律拦住会把整条链清零。
 * 只有"所有摘录都是白给的行键"才提示到最强口径。
 *
 * 判定要两个信号同时成立：条件轴的名字在题面被点名，且至少一行的行键值在题面出现。
 * 只看行键值会误报（题面的 "30 kW" 会撞上节线速度表的 30 m/s 那一行）；
 * 只看轴名会漏（题面提到"可靠度"但并未给出具体档位时，选行仍需判断）。
 */
function checkExcerptRowKeys(draft: MechanicalLintDraft): string[] {
    const warnings: string[] = [];
    const excerpts = draft.handbookExcerpts || [];
    if (excerpts.length === 0) return warnings;

    const stem = normalizeMechText(draft.questionText);
    const trivial: string[] = [];
    const computed: string[] = [];

    for (const ex of excerpts) {
        const rows = ex.rows.filter(r => r.conditionValue !== null && Number.isFinite(r.conditionValue as number));
        if (rows.length === 0) {
            computed.push(ex.name || ex.symbol); // 非数值条件轴（材料牌号等）无法判定，按需判断处理
            continue;
        }
        const axisGiven = axisNamedInStem(ex.conditionAxis || '', stem);
        const keyGiven = rows.some(r => rowKeyLiterals(r.conditionValue as number).some(lit => stem.includes(lit)));
        if (axisGiven && keyGiven) {
            trivial.push(`${ex.name || ex.symbol}（行键：${ex.conditionAxis || '未注明'}）`);
        } else {
            computed.push(ex.name || ex.symbol);
        }
    }

    if (trivial.length === 0) return warnings;
    if (computed.length === 0) {
        warnings.push(
            `选行判断层缺失（严重）：全部 ${trivial.length} 张摘录的行键都是题面已直接给出的量（${trivial.join('、')}），答题方无需任何计算即可对号入座取值——查表环节形同虚设。至少要有一张表以**需要先算出来的量**为行键（节线速度、循环次数 N、Fa/Fr、F/d1 等）`,
        );
    } else {
        warnings.push(
            `部分摘录的行键为题面已给量：${trivial.join('、')}——这些表不构成选行判断层，防御力来自另外 ${computed.length} 张（${computed.join('、')}），请确认后者确实需要先计算才能选行`,
        );
    }
    return warnings;
}

/* ------------------------------------------------------------------ *
 * 8. 判定余量
 * ------------------------------------------------------------------ */

/**
 * 结论必须由结构决定，不得由数值噪声决定。
 *
 * 机械设计里"都算对了"的合法方法差异本身有 2-5% 的宽度（钢-钢弹性系数取 189 还是
 * 191 差 2.1%，插值口径、圆整位数各差百分之几）。判定余量若与之同量级，不同答题方
 * 都算对却给出不同结论，题目不可判。取合法差异宽度的 3 倍作为下限。
 *
 * 全部判 warning，不阻断：15% 这个下限尚未验证 A1 能稳定命中，
 * 直接判 violation 会让整条链静默产出 0 题（踩过，排查成本极高）。
 *
 * ⚠️ governing 项间差距那一条已由 getMarginFloor 置 0 关闭（floor 为 0 时
 * 本函数跳过该检查）。理由见 disciplines.ts 的 DEFAULT_MARGIN_FLOOR 注释：双准则安全系数
 * 贴近是真实工程常态，而 A1 会把这条要求当成题目判据去淘汰合法方案。nd 贴边与
 * marginReport 自报背离两条保留——它们守的是"通过/不通过被舍入翻转"和"百分数是填的"。
 */
function checkDecisionMargin(draft: MechanicalLintDraft): string[] {
    const warnings: string[] = [];
    const floor = getMarginFloor(draft.knowledgePoint || '');
    const report = draft.marginReport;
    const factors = (draft.answerKey?.safetyFactors || [])
        .map(f => f.value)
        .filter(v => Number.isFinite(v) && v > 0);

    // 优先用 answerKey 里的安全系数自行算，算不出来才退回 A1 自报值
    let governingGap: number | undefined;
    if (factors.length >= 2) {
        const sorted = [...factors].sort((a, b) => a - b);
        const [worst, second] = sorted;
        governingGap = ((second - worst) / Math.max(worst, 1e-9)) * 100;
    } else if (report?.governingGapPercent !== undefined) {
        governingGap = report.governingGapPercent;
    }

    if (
        floor.governingGapPercent > 0 &&
        governingGap !== undefined &&
        governingGap < floor.governingGapPercent
    ) {
        warnings.push(
            `判定余量偏窄：最不利项与次不利项仅差 ${governingGap.toFixed(1)}%（要求 ≥${floor.governingGapPercent}%）。机械设计合法的方法差异本身有 2-5% 宽度，余量与之同量级时结论由舍入噪声决定，不同答题方都算对却给出不同 governing 项。应调整参数把两项拉开，而不是改判据。注意接触项须用 SH² 与 SF 同台比较`,
        );
    }

    let ndGap: number | undefined;
    if (factors.length >= 1 && typeof draft.designFactorFloor === 'number' && draft.designFactorFloor > 0) {
        const worst = Math.min(...factors);
        ndGap = (Math.abs(worst - draft.designFactorFloor) / draft.designFactorFloor) * 100;
    } else if (report?.ndGapPercent !== undefined) {
        ndGap = report.ndGapPercent;
    }

    if (ndGap !== undefined && ndGap < floor.ndGapPercent) {
        warnings.push(
            `合格判定贴边：最不利安全系数与设计下限 nd 仅差 ${ndGap.toFixed(1)}%（要求 ≥${floor.ndGapPercent}%）。"通过"与"不通过"的结论会被舍入误差翻转，题目不可判——应把载荷/硬度档/可靠度要求调整到离边界足够远`,
        );
    }

    if (report?.worstLegalVariationPercent !== undefined && report.worstLegalVariationPercent > 5) {
        warnings.push(
            `自报的合法方法差异漂移 ${report.worstLegalVariationPercent.toFixed(1)}% 偏大（正常 ≤5%）：说明结论对取值口径过于敏感，请复核是否有某个系数被放在了乘方或链式放大的位置上`,
        );
    }

    // 自报值与实算值背离：说明 marginReport 是"填出来的"而非算出来的
    if (report?.governingGapPercent !== undefined && governingGap !== undefined && factors.length >= 2) {
        const diff = Math.abs(report.governingGapPercent - governingGap);
        if (diff > 5) {
            warnings.push(
                `marginReport 自报与解答不符：自报 governing 差距 ${report.governingGapPercent.toFixed(1)}%，但按 answerKey 的安全系数实算为 ${governingGap.toFixed(1)}%（相差 ${diff.toFixed(1)} 个百分点）。请核对是否漏了 SH→SH² 的阶次换算，或自报值未按解答重算`,
            );
        }
    }

    return [...new Set(warnings)];
}

/* ------------------------------------------------------------------ *
 * 9. 交付清单（须报出的量）
 * ------------------------------------------------------------------ */

/**
 * 清单项里的泄漏型写法。
 *
 * 判据（与「作法泄漏四查」同一条）：**答题方看到这一项，是知道了要交什么，
 * 还是知道了该往哪拐？** 后者一律不许写。
 *
 * 刻意**不**拦四种写法，它们看着像但不是泄漏：
 *   - 「圆整后的齿宽」「回代重算的分度圆直径」——圆整并回代是题面已明文声明的
 *     通用纪律，不是只有本题才成立的暗示，写进清单不增加任何信息。
 *   - 「**修正后的**切应力」「修正后的许用接触应力」——机械里「修正」是"乘上修正系数"
 *     这一步的标准叫法（曲度系数 K、寿命系数 YN/ZN），是量的名字而不是"要返工"的暗示。
 *     弹簧题几乎每道都会出现「修正后的切应力」，把它当泄漏拦下会让整条链静默出 0 题。
 *   - 「最终采用的动载系数 KV」——只说"交最后用的那个"，没说它会不会变。
 *     这正是 `更新后的 KV` 的合规替代写法。
 *   - rounding 字段里的数字（「两位小数」「GB/T 1357 第一系列」）——那是取位规则。
 * 拦的是 `更新后的/改选后的/需重新选取` 这类**断言"取值要回头改"**的措辞：本题的题眼恰恰
 * 是"圆整后节线速度跨过 8 m/s 分界、KV 必须回头改档"，说出来题就没了。
 * 「修正」与「更新」的分界：前者是一次性的公式步骤（正向算下去就有），
 * 后者断言存在一个回头重取的循环（那是判断层）。
 */
const DELIVERABLE_LEAK_TOKENS: Array<{ token: RegExp; label: string }> = [
    { token: /(?:更新|变更|改选|重选)后(?:的)?/, label: '断言取值会变' },
    { token: /(?:需|须|要)(?:重新|再次)(?:选取|取值|查表|计算|核算)/, label: '断言需要返工' },
    { token: /(?:跨|越过|超出)(?:过)?(?:档|档位|分界|界限|区间)/, label: '点出档位分界会被跨过' },
    { token: /(?:由于|因为|若|如果|当)[^，,]{0,24}(?:则|时|就)/, label: '条件从句' },
    { token: /按\s*(?:DE-Goodman|Goodman|Gerber|Soderberg|欧拉|Euler|约翰逊|Johnson|均匀磨损|均压|库仑-?莫尔|Coulomb-?Mohr|von\s*Mises|最大剪应力|MSS|畸变能)/i, label: '点出准则/模型名' },
    { token: /(?:主控|控制性|决定性)[^，,；;]{0,10}(?:弯曲|接触|点蚀|磨损|折断|屈服|失稳|共振|自锁|挤压|剪切)/, label: '直接给出 governing 结论' },
    { token: /(?:大于|小于|超过|不足|高于|低于)\s*[0-9]/, label: '给出比较结论' },
    { token: /[=≈]\s*[0-9]|约\s*为?\s*[0-9]/, label: '把答案数值写进清单' },
];

/** 覆盖度比对用的归一化：去标点空白与"的/值"这类虚字，符号大小写归一 */
function normalizeDeliverableKey(text: string): string {
    return String(text || '')
        .replace(/[\s（）()\[\]【】，,。.、：:；;·—\-_]/g, '')
        .replace(/[的值]/g, '')
        .toLowerCase();
}

/**
 * 清单项是否被 answerKey 覆盖。
 * 安全系数落在 safetyFactors 而非 values 里，两处都要认，否则 SF/SH 必然误报为漏项。
 * 双向包含（清单名含答案名 或 答案名含清单名）：清单写「弯曲安全系数」而答案写
 * 「SF」或「齿根弯曲安全系数」都应算命中。
 *
 * ⚠️ 补两类本来就覆盖得到、却被漏认的落点（实测占全部漏项报告的约三成，
 * 全是检查器自己的误报）：
 *   · 「最终结论」「是否满足」「选型结论」类——落点是 answerKey.conclusion，
 *     而 conclusion 压根没进 keys 列表，于是永远判漏。
 *   · 「主控失效项」「控制失效项」类——落点是 answerKey.governing，
 *     但 governing 存的是英文键名（wear_pinion / fatigue），与中文项名做包含比较永远不命中。
 * 这两类的性质与已修的六类 lint 误报相同：字段两侧本来就允许写法不同，
 * 不该按逐字包含判定。修法是按语义归类认领，而不是放宽包含匹配（后者会把真漏项也放过）。
 */
function isDeliverableCovered(d: MechanicalDeliverable, answerKey?: MechanicalAnswerKey): boolean {
    if (!answerKey) return false;

    // 结论类：落点是 conclusion 这段自然语言，不可能与项名逐字匹配
    if (/结论|是否满足|能否满足|可行性|筛选结果|判定$/.test(d.name) && (answerKey.conclusion || '').trim()) {
        return true;
    }
    // 主控项类：落点是 governing，存的是英文键名，与中文项名比字符必然不中
    if (/主控|控制失效|governing/i.test(d.name) && (answerKey.governing || '').trim()) {
        return true;
    }

    const keys = [
        ...(answerKey.values || []).map(v => v.name),
        ...(answerKey.safetyFactors || []).map(f => f.item),
        answerKey.governing || '',
    ]
        .map(normalizeDeliverableKey)
        .filter(k => k.length >= 1);

    for (const probe of [normalizeDeliverableKey(d.name), normalizeDeliverableKey(d.symbol)]) {
        if (probe.length < 1 || probe === '—') continue;
        if (keys.some(k => k.includes(probe) || probe.includes(k))) return true;
    }
    return false;
}

/**
 * 交付清单检查。
 *
 * 泄漏判 violation（与模板入口同口径：把判断层交出去就是硬伤）；
 * 覆盖度一律判 warning——清单名与 answerKey 的写法本来就允许不同，
 * 按「表述不同 ≠ 题目有错」的教训（见 mechanical-v2-batch-acceptance）不得阻断。
 *
 * 纯论述题豁免：论述题的落点是要点重合度，不是可枚举的量。
 */
const DELIVERABLE_COUNT_CEILING = 8;
const STEM_LENGTH_CEILING = 450;

function checkDeliverables(draft: MechanicalLintDraft): { violations: string[]; warnings: string[] } {
    const violations: string[] = [];
    const warnings: string[] = [];
    if (draft.questionType === 'short-answer') return { violations, warnings };

    const items = draft.deliverables || [];
    if (items.length === 0) {
        warnings.push(
            '未给出「须报出的量」清单：答题方算了某个量但没报出时，判分器只能记「缺项」，测出来的是判分口径而非答题能力。计算/混合题应逐项列出须报的量（判据分叉两侧的对称量、是否满足与主控项、题眼所在的查表结果），并在题面末尾写成【须报出的量（缺项按未作答计）】一节',
        );
        return { violations, warnings };
    }

    for (const d of items) {
        // 只查 name/symbol/unit；rounding 是取位规则，天然带数字与"后"字，查它必误报
        const probe = `${d.name} ${d.symbol} ${d.unit}`;
        for (const rule of DELIVERABLE_LEAK_TOKENS) {
            if (rule.token.test(probe)) {
                violations.push(
                    `交付清单泄漏作法（${rule.label}）：清单项「${d.name}」把"该往哪拐"也一并交给了答题方。清单只许出现量名/符号/单位/圆整规则，判断层必须由答题方自行完成——如需强调交最后采用的值，写「最终采用的X」而不是「更新后的X」`,
                );
            }
        }
    }

    if (!draft.questionText.includes('须报出的量')) {
        warnings.push(
            '题面缺【须报出的量】一节：清单已在结构化字段里给出，但题干没写，答题方看不到——清单的强制力来自题面那句「缺项按未作答计」',
        );
    }

    const uncovered = items.filter(d => !isDeliverableCovered(d, draft.answerKey));
    if (uncovered.length > 0) {
        warnings.push(
            `answerKey 未覆盖清单项：${uncovered.map(d => d.name).join('、')}（共 ${uncovered.length}/${items.length} 项）。短答案由清单渲染而来，缺项会让最终答案栏与题面要求的口径打架，请补齐 answerKey.values / safetyFactors`,
        );
    }

    // ── 信噪比：清单过长与题面过长（一律 warning）────────────────
    // 为什么不判 violation：超长题**能用**，只是信噪比差，去留该由人看了再定；
    // 判硬伤就等于丢题，与「不丢只降级」的整体口径冲突。
    // 为什么要查：实测清单 27-30 项时，其中 27 项是纯正向脚手架量（转矩、齿数、
    // 分度圆、中心距…），最强解题模型 6 道一道都没复现出来（answersAgree 全 false）。
    // 盲解复现不出的题没有判据价值——答题方在第 3 步算错转矩挂掉，只说明链子长了会掉，
    // 不能说明它懂不懂本题要考的那个判断。这两条就是拿来盯住这个失效方向的。
    if (items.length > DELIVERABLE_COUNT_CEILING) {
        warnings.push(
            `「须报出的量」清单 ${items.length} 项，超出上限 ${DELIVERABLE_COUNT_CEILING} 项：清单只该列判据分叉两侧的对称量（各安全系数/各反解值）、是否满足与主控项、题眼所在的那 1-2 个查表结果。纯正向中间量（传动比、转矩、齿数、分度圆、中心距、切向力…）报错了只说明算错一步乘除，不说明不懂本题的判断，应改为在题面直接给出数值（【已知量前置】）而不是列进清单。⚠️ 若为保持并列判据的对称性而必须超出，删第三类而不是打破对称`,
        );
    }
    // 题面长度只量正文：清单那一节由代码渲染、长度与信噪比无关，计进去会误报。
    const stemBody = draft.questionText.split('【须报出的量')[0];
    if (stemBody.length > STEM_LENGTH_CEILING) {
        warnings.push(
            `题面正文 ${stemBody.length} 字（不含清单节），超出上限 ${STEM_LENGTH_CEILING} 字：通常说明还有与题眼无关的正向量没有前置为已知条件。判据是逐量自问「把这个数直接给进题面，本题的题眼还在不在」——还在就该给。⚠️ 不要靠删减手册摘录来压字数，摘录是可解性的前提，一行都不能少`,
        );
    }

    return { violations: [...new Set(violations)], warnings: [...new Set(warnings)] };
}

/* ------------------------------------------------------------------ *
 * warnings（非阻断）
 * ------------------------------------------------------------------ */

function checkUnitPresence(draft: MechanicalLintDraft): string[] {
    const warnings: string[] = [];
    const answerTail = draft.referenceAnswer.slice(-200);
    const hasUnitOrDimensionless =
        /(?:GPa|MPa|kPa|Pa|N·m|N\.m|Nm|kN|N|kW|W|mm|cm|m\/s|r\/min|rpm|Hz|°|rad|h|min|s|%|无量纲|安全系数)/i.test(
            answerTail,
        );
    if (!hasUnitOrDimensionless) {
        warnings.push('标准解答末尾未检出单位或"无量纲/安全系数"字样，请复核最终答案是否漏写单位');
    }
    return warnings;
}

/**
 * 可行窗口为空是机械题的合法结论。若解答给出的安全系数恰好贴着设计下限
 * （超出不足 2%），提示复核是不是把窗口硬凑成了通过——这是弱模型的典型失败形态。
 */
function checkFeasibilityWindow(draft: MechanicalLintDraft): string[] {
    const warnings: string[] = [];
    const floor = draft.designFactorFloor;
    if (typeof floor !== 'number' || !Number.isFinite(floor)) return warnings;

    const normalized = normalizeMechText(`${draft.questionText}\n${draft.referenceAnswer}`);
    const re = new RegExp(FACTOR_RE.source, FACTOR_RE.flags);
    let match: RegExpExecArray | null;
    while ((match = re.exec(normalized)) !== null) {
        if (DESIGN_FLOOR_TAGS.has((match[1] || '').trim())) continue; // nd 本身当然等于下限
        const value = Number(match[3]);
        if (!Number.isFinite(value)) continue;
        if (value >= floor && value < floor * 1.02) {
            warnings.push(
                `可行窗口可疑：安全系数 ${value} 仅比设计下限 ${floor} 高出不足 2%，请复核是否存在"窗口本应为空却被硬凑通过"`,
            );
            break;
        }
    }
    return warnings;
}

/* ------------------------------------------------------------------ *
 * 主入口
 * ------------------------------------------------------------------ */

/**
 * 机械 V2 确定性拦截主入口。题干与标准解答一并检查（两者的硬伤都会导致题目不可发布）。
 *
 * skipNumericChecks=true 时跳过依赖数值的检查（纯论述题），
 * 但保留模板入口、手册量隔离、表体不变量三类硬规则——它们与题型无关。
 */
export function lintMechanical(
    draft: MechanicalLintDraft,
    skipNumericChecks: boolean = false,
): MechanicalLintResult {
    const combined = `${draft.questionText}\n${draft.referenceAnswer}\n${(draft.referenceSteps || []).join('\n')}`;
    // 解答侧文本：checkGoverning 只能吃这个，不能吃题面（见该函数注释里的静默漏洞）
    const solutionOnly = `${draft.referenceAnswer}\n${(draft.referenceSteps || []).join('\n')}`;

    // 表体不变量：对结构化摘录做纯算术/枚举比较，与题型无关（论述题也可能附摘录）
    const anchorResult = checkTableAnchors(draft);
    // 交付清单：泄漏是文本级硬伤，与数值无关；论述题在函数内部自行豁免
    const deliverableResult = checkDeliverables(draft);

    const textLevel = [
        ...checkTemplateEntrance(draft.questionText),
        ...checkHandbookIsolation(draft),
        ...anchorResult.violations,
        ...deliverableResult.violations,
    ];

    // 算术复算：违规是硬伤，但"两侧差整数个 10 次幂"降为 warning（省写单位换算）
    const arithmetic = skipNumericChecks
        ? { violations: [], warnings: [] }
        : checkArithmetic(combined);

    const numericLevel = skipNumericChecks
        ? []
        : [
            ...checkStandardSeries(combined),
            ...checkRoundBackSub(combined),
            ...arithmetic.violations,
            ...checkGoverning(solutionOnly, draft.governingItem),
        ];

    const violations = [...textLevel, ...numericLevel];

    const warnings = [
        ...anchorResult.warnings,
        ...checkExcerptRowKeys(draft),
        ...deliverableResult.warnings,
        ...arithmetic.warnings,
        ...(skipNumericChecks
            ? []
            : [
                ...checkUnitPresence(draft),
                ...checkFeasibilityWindow(draft),
                ...checkDecisionMargin(draft),
            ]),
    ];

    return {
        hasViolation: violations.length > 0,
        violations: [...new Set(violations)],
        warnings: [...new Set(warnings)],
    };
}
