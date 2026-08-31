import type { V2QuestionDraft } from "./generator";

/**
 * coreData 语义净化（物理层内，确定性，无 LLM 调用）
 *
 * ── 起因（0827 真机批量）────────────────────────────────────────────────
 * 一批 10 题里有 9 题通过审查，其中 7 题带着 node7 的
 *   `Core data not visible in problem text: ...`
 * 被判 degraded。逐条展开后看到的其实是两类东西：
 *
 *   Type A（占绝对多数）——生成器把**自己算出来的中间量/结果量**当成"已知量"
 *     塞进了 coreData：
 *       轴向周期长度 L = 11.623892818 m   （= 2π × 1.85，把 L=2πR 算完连浮点尾巴一起贴进来）
 *       周期长度   L = 9.42477796077 m   （= 2π × 1.5，同一签名）
 *       r*处β = 0.03723369 / 0.439、B(r*) = 0.7625 T、r0/a = 0.9691
 *         （"在某点求值"的结果量，基本就是答案本身）
 *   Type B（少数）——题面真缺的原始给定量，如 `远壁半径 b = 4.5 m`。
 *
 * ── 为什么必须删而不是"补进题面" ──────────────────────────────────────
 * 消除这个报错有两条路，其中一条是陷阱：
 *   ✗ 把缺失项写进题面 —— 对 Type A 等于把 B(r*)、β(r*) 这些**结论**直接告诉解题者，
 *     该题防御力当场归零；更糟的是 outputValid 会变 true、qualityLevel 变 verified，
 *     于是"看起来最干净的题"恰好是最废的题。
 *   ✓ 把它从 coreData 里删掉 —— coreData 的语义本就是"题面直接给出的已知量"，
 *     不在题面里的东西按定义就不是 coreData 成员。
 *
 * Type B 被顺带删掉不会让缺条件的题蒙混过关：**A4 盲解只看 draft.questionText、
 * 根本看不到 coreData**，题面缺给定量必然导致盲解失败或 A5 报答案分歧——那是一条
 * 比本检查强得多的独立检测通道。本函数只负责让 node7 的 outputValid 恢复成有信号的
 * 指标，而不是继续被 Type A 的噪声淹没（历史 degraded 标记因此混杂了两件无关的事，
 * 那一列不能当"题目质量"读）。
 *
 * 剔除项一律 console.warn 列出，不做无声删除。
 */

// ⚠️ 下面两个判据是从 services/nodes/node7-output.ts 逐字复制的（那边未导出）。
// 必须与其保持一致：本函数的"可见"判据只要比 node7 更宽松，就会留下 node7 仍要报的项。
// 改动 node7 的 coreDataValueVisible / normalizeNumericToken 时，这里要同步改。
function normalizeNumericToken(value: number): string {
    return String(value)
        .replace(/\.0+$/, '')
        .replace(/(\.\d*?)0+$/, '$1');
}

function coreDataValueVisible(text: string, value: number): boolean {
    const compactText = text.replace(/\s+/g, '');
    const tokens = new Set<string>([
        normalizeNumericToken(value),
        String(value),
        value.toPrecision(6).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e'),
        value.toExponential(6).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e'),
    ]);

    return [...tokens].some(token => compactText.includes(token.replace(/\s+/g, '')));
}

function describe(name: string, data: { value: number; unit?: string }): string {
    return `${name}=${normalizeNumericToken(Number(data.value))}${data.unit ? ` ${data.unit}` : ''}`;
}

// ── 数值兜底判据（比 node7 更宽松，只用来"否决删除"，不用来放行 node7）──────────
// node7 的判据是纯字符串比对，对人类写法的科学计数法完全无效：题面写
// `n = 5.0×10¹⁸ m⁻³`，而它生成的 token 是 `5e+18`，永远匹配不上。
// 于是"题面明明写着的原始给定量"也会被判不可见。node7 那条错误因此本身就有假阳性。
//
// 修 node7 要动非物理文件，未获授权；本层的处理是：**这类项保留不删**。
// 代价是 node7 照旧会报它、题照旧被判 degraded（＝维持现状，不产生新损失），
// 但绝不会把题面里真实存在的给定量从 coreData 里删掉。命中时单独打日志，
// 以便统计这一类到底有多少、值不值得去改 node7。
const SUPERSCRIPT_MAP: Record<string, string> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-',
};

/** 把题面里所有能认出来的数值抽成数组，含 `a×10^b` / `a×10⁻¹²` 等人类写法 */
function extractNumbers(text: string): number[] {
    // 上标连写成 `10¹⁸` 时不能直接抹成 `1018`，要还原出指数边界 → `10^18`
    const withCaret = text.replace(
        /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g,
        run => '^' + [...run].map(ch => SUPERSCRIPT_MAP[ch] ?? ch).join('')
    );
    // `5.0×10^18` / `5.0 x 10^18` / `5.0*10^18` / `5.0·10^18` → `5.0e18`
    const normalized = withCaret
        .replace(/(\d(?:\.\d+)?)\s*[×xX*·⋅∙]\s*10\s*\^?\s*(-?\d+)/g, '$1e$2')
        // 无系数的 `10^18` → `1e18`
        .replace(/(^|[^\d.eE])10\s*\^\s*(-?\d+)/g, '$11e$2');

    const found = normalized.match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g) ?? [];
    return found.map(Number).filter(Number.isFinite);
}

/** 数值意义上题面是否给出了这个量（相对容差 1e-9：0.9691 与题面的 0.97 不算命中） */
function valuePresentNumerically(numbers: number[], value: number): boolean {
    const tol = 1e-9 * Math.max(1, Math.abs(value));
    return numbers.some(n => Math.abs(n - value) <= tol);
}

/**
 * 就地剔除 draft.coreData 中"数值未出现在题面"的条目，返回被剔除项的描述。
 *
 * @param stage 日志标签，用于区分是 A1 出题还是第几轮 A3 修复产出的脏数据
 */
export function sanitizeCoreData(draft: V2QuestionDraft, stage: string): string[] {
    const coreData = draft.coreData;
    if (!coreData || typeof coreData !== 'object') return [];

    const text = draft.questionText || '';
    const entries = Object.entries(coreData);
    const numbers = extractNumbers(text);

    const notationGap: string[] = [];
    const removable = entries.filter(([name, data]) => {
        const value = Number(data?.value);
        // 非数值项（符号量、区间、字符串）无法做可见性判断，一律保留。
        if (!Number.isFinite(value)) return false;
        if (coreDataValueVisible(text, value)) return false;
        // node7 的字符串判据说不可见，但数值上题面确实给了 → node7 记法盲区，保留。
        if (valuePresentNumerically(numbers, value)) {
            notationGap.push(describe(name, data as any));
            return false;
        }
        return true;
    });

    if (notationGap.length > 0) {
        console.warn(
            `[V2 ${stage}] 以下 coreData 项数值上确实写在题面里、只是记法（科学计数法/上标）过不了 ` +
            `node7 的字符串比对，已保留不删；node7 仍会报这几项，属其自身假阳性：${notationGap.join('; ')}`
        );
    }

    if (removable.length === 0) return [];

    // 全删会让 coreData 变空，换来 node7 的另一条错误 'No given core data'。
    // 而且"题面里一个给定数值都找不到"本身是更严重的异常，不该被本函数抹平——
    // 保留原样，让 node7 照常报出来。
    if (removable.length === entries.length) {
        console.warn(
            `[V2 ${stage}] coreData 全部 ${entries.length} 项都不在题面中，疑似题面缺数据或 coreData 整体写错，` +
            `保留原样交 node7 报错：${removable.map(([n, d]) => describe(n, d as any)).join('; ')}`
        );
        return [];
    }

    const removed = removable.map(([name, data]) => describe(name, data as any));
    for (const [name] of removable) {
        delete coreData[name];
    }
    console.warn(
        `[V2 ${stage}] coreData 剔除 ${removed.length} 项"题面不可见"的非给定量（推导量/结果量，或题面真缺该给定量；` +
        `后者由 A4 盲解独立兜底）：${removed.join('; ')}`
    );
    return removed;
}
