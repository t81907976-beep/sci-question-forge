import { buildReasoningPrompt, buildCalculationPrompt } from './generator';
import { buildResearchReasoningPrompt, buildResearchCalculationPrompt, getResearchPhilosophyPrefix } from './promptVariants';

export { getResearchPhilosophyPrefix };

/**
 * 回退开关：设置环境变量 PROMPT_VERSION=research 可切换到竞赛级 prompt。
 * 默认使用 'original' 原始 prompt。
 * useResearchPhilosophy: v2 generator 用此标志决定是否注入命题哲学前缀。
 */
export function pickPromptBuilder(version?: string) {
    const v = version ?? process.env.PROMPT_VERSION ?? 'original';
    if (v === 'research') {
        return {
            buildReasoningPrompt: buildResearchReasoningPrompt,
            buildCalculationPrompt: buildResearchCalculationPrompt,
            useResearchPhilosophy: true,
            version: 'research' as const,
        };
    }
    return {
        buildReasoningPrompt,
        buildCalculationPrompt,
        useResearchPhilosophy: false,
        version: 'original' as const,
    };
}

export const ACTIVE_PROMPT_BUILDER = pickPromptBuilder();
