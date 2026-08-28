/**
 * Mechanical V2 — 难度分级
 *
 * 口径对齐 materials/v2/difficulty.ts（6:3:1 三档 + Fisher-Yates 洗牌），
 * 但机械的档位含义按机械专属结构重定义。
 *
 * ⚠️ 档位按**题眼隐蔽度**分，不按体量（链长/准则条数）分。
 * 按体量分档时，标准档会退化成超长题面 + 大量正向代公式的脚手架步骤，
 * 带来两层后果，第二层才是致命的：
 *   1. 长链让 A1 自己丢步（分子算对了却漏掉某一步除法这类算术错）；
 *   2. 盲解复现不出的题**没有判据价值**。解题模型在中途算错一个中间量挂掉，
 *      只说明"链子长了会掉"，完全不能说明它懂不懂同阶次换算。
 *      噪声通道越多，题眼的信号越被淹掉。
 * 故三档改为：错法是否自洽（错了还能不能算出一个数）、要不要两处联动。
 * 「难」的来源是**判断层的隐蔽**，不是算术量。
 *
 *   standard —— 一处判据分叉，且错法会当场露馅（量纲不对/算不下去/结论明显荒谬）
 *   hard     —— 一处判据分叉，但错法自洽：错选之后照样能算出一个像样的数、还能自圆其说
 *   peak     —— 两处自洽错法联动，且第一处的错选会改变第二处的取值（错法有传播路径）
 *
 * 只在 mechanical/v2 内部被引用，不影响其他学科。
 */

export type MechanicalDifficultyLevel = 'standard' | 'hard' | 'peak';

/** 目标比例：10 题 ≈ 6 标准 + 3 困难 + 1 顶级 */
export const DIFFICULTY_DISTRIBUTION: Record<MechanicalDifficultyLevel, number> = {
    standard: 0.6,
    hard: 0.3,
    peak: 0.1,
};

export const DIFFICULTY_LEVEL_LABEL: Record<MechanicalDifficultyLevel, string> = {
    standard: '标准',
    hard: '困难',
    peak: '顶级',
};

/**
 * 为一批共 count 道题分配难度档位，返回长度为 count 的数组（顺序已随机打乱）。
 * count >= 2 时至少 1 道困难题；count >= 5 时至少 1 道顶级题；标准档吸收舍入误差。
 */
export function assignDifficultyLevels(count: number): MechanicalDifficultyLevel[] {
    if (count <= 0) return [];

    const peakCount = count >= 5 ? Math.max(1, Math.round(count * DIFFICULTY_DISTRIBUTION.peak)) : 0;
    const hardCount = count >= 2 ? Math.max(1, Math.round(count * DIFFICULTY_DISTRIBUTION.hard)) : 0;
    const standardCount = Math.max(0, count - peakCount - hardCount);

    const levels: MechanicalDifficultyLevel[] = [
        ...Array(standardCount).fill('standard'),
        ...Array(hardCount).fill('hard'),
        ...Array(peakCount).fill('peak'),
    ];

    for (let i = levels.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [levels[i], levels[j]] = [levels[j], levels[i]];
    }
    return levels;
}
