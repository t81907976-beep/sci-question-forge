/**
 * Materials V2 — 难度分级
 *
 * 材料学科专属：将每批题目按固定比例随机分配到 3 个难度档位，
 * 使一批题目里既有教材级的标准题，也有跨概念耦合的困难题，
 * 少量对齐 disciplines.ts 的 peak_difficulty 的顶级科研题。
 *
 * 不影响其他学科：本文件只在 materials/v2 内部被引用。
 */

export type MaterialsDifficultyLevel = 'standard' | 'hard' | 'peak';

/** 目标比例：10 题 ≈ 6 标准 + 3 困难 + 1 顶级 */
export const DIFFICULTY_DISTRIBUTION: Record<MaterialsDifficultyLevel, number> = {
    standard: 0.6,
    hard: 0.3,
    peak: 0.1,
};

export const DIFFICULTY_LEVEL_LABEL: Record<MaterialsDifficultyLevel, string> = {
    standard: '标准',
    hard: '困难',
    peak: '顶级',
};

/**
 * 为一批共 count 道题分配难度档位，返回长度为 count 的数组（顺序已随机打乱）。
 *
 * 分配规则：
 * - 各档数量按比例四舍五入，标准档兜底吸收舍入误差（保证 sum === count）。
 * - count >= 2 时至少 1 道困难题；count >= 5 时至少 1 道顶级题。
 * - 用 Fisher-Yates 洗牌打散顺序，避免固定题序命中固定档位。
 */
export function assignDifficultyLevels(count: number): MaterialsDifficultyLevel[] {
    if (count <= 0) return [];

    const peakCount = count >= 5 ? Math.max(1, Math.round(count * DIFFICULTY_DISTRIBUTION.peak)) : 0;
    const hardCount = count >= 2 ? Math.max(1, Math.round(count * DIFFICULTY_DISTRIBUTION.hard)) : 0;
    const standardCount = Math.max(0, count - peakCount - hardCount);

    const levels: MaterialsDifficultyLevel[] = [
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
