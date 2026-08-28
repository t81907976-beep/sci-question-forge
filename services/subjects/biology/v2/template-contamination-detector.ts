import { callLLM } from '../../../llmClient';
import type { BiologyV2Draft } from './generator';

/**
 * 改动1：关键词污染检测（Template Contamination Detector）
 *
 * 在 generator → reviewer 之间插入。
 * 用与出题模型不同的模型判断题目场景是否落入高频教材模板。
 *
 * 核心逻辑：
 *   - 让检测模型尝试"识别"这道题对应哪本教材的哪类习题
 *   - 如果它能准确说出，说明场景触发了模板，需要换场景外壳
 *   - 如果它说"不确定"或"未见过类似题目"，说明场景足够稀疏
 *
 * 只检测 calculation 类型（推理题的场景污染影响较小）。
 */

export interface ContaminationResult {
  contaminated: boolean;
  /** 检测模型识别出的模板来源（若 contaminated=true） */
  templateSource?: string;
  /** 建议替换的场景方向（若 contaminated=true） */
  suggestedAlternative?: string;
}

export async function detectTemplateContamination(
  draft: BiologyV2Draft,
): Promise<ContaminationResult> {
  // 只检测计算题；推理题的场景污染对大模型防御影响较小
  if (draft.problemType !== 'calculation') {
    return { contaminated: false };
  }

  const prompt = `你是一位熟悉生物学教材和竞赛题库的专家。请判断以下题目是否属于某本教材或标准题库中的高频模板场景。

【题目正文】：
${draft.questionText}

【判断规则】：
- 如果你能明确说出这道题对应哪本教材（如《生物化学》朱圣庚版、《微生物学》沈萍版、《生物工程原理》等）的哪类习题，或者它与某类标准竞赛题高度相似，则判为"模板场景"。
- 如果题目的场景组合（物种+实验技术+测量对象+计算目标）在你的知识库中没有高度相似的完整模板，则判为"非模板场景"。

【注意】：
- 判断的是"场景"，不是"知识点"。知识点可以是常见的（如幂律流体、OTR/OUR），但场景组合可以是稀疏的。
- 不要因为题目用了常见公式就判为模板；要看整体场景是否有现成的解题模板可以直接套用。

直接输出 JSON，不含 markdown 代码块：
{
  "contaminated": true 或 false,
  "templateSource": "若 contaminated=true，说明对应哪类教材/题库模板（1句话）；否则为空字符串",
  "confidence": "high | medium | low（对判断结果的置信度）",
  "suggestedAlternative": "若 contaminated=true，建议将场景替换为哪个方向（保持相同数学结构但换用稀疏场景，1句话）；否则为空字符串"
}`;

  try {
    // 故意使用与出题模型不同的模型（review 模型）来检测
    // 出题模型和检测模型共享训练数据越少，检测越有效
    const raw = (await callLLM(prompt, { model: 'review', temperature: 0.1 })).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { contaminated: false };

    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.contaminated !== 'boolean') return { contaminated: false };

    // 只有高置信度的污染判断才触发重生成
    if (parsed.contaminated && parsed.confidence === 'low') {
      return { contaminated: false };
    }

    return {
      contaminated: parsed.contaminated === true,
      templateSource: parsed.templateSource || undefined,
      suggestedAlternative: parsed.suggestedAlternative || undefined,
    };
  } catch {
    return { contaminated: false };
  }
}
