import { MATERIALS_DISCIPLINES, getSupportedQuestionTypes, getQuestionTypeAffinity } from './services/subjects/materials/disciplines';
import type { MaterialsQuestionType } from './types/multiNodeTypes';

export type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};

/**
 * 按类别分组排序顺序（前端下拉列表中同类方向紧挨在一起）。
 * 顺序：材料基础 → 金属材料 → 力学性能 → 高分子材料 → 陶瓷材料 → 复合材料 →
 *       半导体材料 → 纳米材料 → 薄膜与表面 → 腐蚀与防护 → 能源材料 → 催化材料 →
 *       磁性材料 → 光电功能 → 生物材料 → 粉末冶金 → 无机非金属 → 材料热力学/动力学/计算/分析
 */
const CATEGORY_ORDER: string[] = [
  '材料基础',
  '金属材料',
  '力学性能',
  '高分子材料',
  '陶瓷材料',
  '复合材料',
  '半导体材料',
  '纳米材料',
  '薄膜与表面',
  '腐蚀与防护',
  '能源材料',
  '催化材料',
  '磁性材料',
  '光电功能',
  '生物材料',
  '粉末冶金',
  '无机非金属',
  '材料热力学',
  '材料动力学',
  '计算材料学',
  '材料分析测试',
];

function getCategoryIndex(name: string): number {
  for (let i = 0; i < CATEGORY_ORDER.length; i++) {
    if (name.startsWith(CATEGORY_ORDER[i])) return i;
  }
  return CATEGORY_ORDER.length; // 未匹配的排最后
}

export function getMaterialsDisciplineOptions(): SelectOption<string>[] {
  return Object.values(MATERIALS_DISCIPLINES)
    .map((discipline, idx) => ({
      value: discipline.name,
      label: discipline.name,
      _idx: idx,
    }))
    .sort((a, b) => {
      const catA = getCategoryIndex(a.label);
      const catB = getCategoryIndex(b.label);
      if (catA !== catB) return catA - catB;
      // 同类别内保持 disciplines.ts 中的定义顺序（按知识递进排列，优于字典序）
      return a._idx - b._idx;
    })
    .map(({ value, label }) => ({ value, label }));
}

/**
 * 给定已选中的知识点名称列表，返回它们共同支持的题型（交集）。
 * - 空选择：返回全部题型（不限制）
 * - 交集为空：返回空数组，调用方需提示用户组合不可用
 */
export function getCommonQuestionTypes(selectedNames: string[]): MaterialsQuestionType[] {
  const ALL: MaterialsQuestionType[] = ['calculation', 'short-answer', 'mixed'];
  if (selectedNames.length === 0) return ALL;

  return ALL.filter(type =>
    selectedNames.every(name => getSupportedQuestionTypes(name).includes(type))
  );
}

/**
 * 列出在已选知识点中不支持指定题型的知识点名称（用于 UI 提示具体是谁不兼容）。
 */
export function getUnsupportedNamesForType(
  selectedNames: string[],
  questionType: MaterialsQuestionType
): string[] {
  return selectedNames.filter(name => !getSupportedQuestionTypes(name).includes(questionType));
}

/**
 * 已选知识点中「特别适合」指定题型的名称（UI 绿色提示）。
 */
export function getRecommendedNamesForType(
  selectedNames: string[],
  questionType: MaterialsQuestionType
): string[] {
  return selectedNames.filter(name => getQuestionTypeAffinity(name, questionType) === 'recommended');
}

/**
 * 已选知识点中「特别不适合」指定题型的名称（UI 橙色提示，但不拦截）。
 */
export function getDiscouragedNamesForType(
  selectedNames: string[],
  questionType: MaterialsQuestionType
): string[] {
  return selectedNames.filter(name => getQuestionTypeAffinity(name, questionType) === 'discouraged');
}
