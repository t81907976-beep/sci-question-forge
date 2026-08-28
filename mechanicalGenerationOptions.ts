import { MECHANICAL_DISCIPLINES, getSupportedQuestionTypes, getQuestionTypeAffinity } from './services/subjects/mechanical/disciplines';
import type { MechanicalQuestionType } from './types/multiNodeTypes';

export type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};

/**
 * 按机械零件族分组排序（前端下拉列表中同族方向紧挨在一起）。
 * 顺序按"传动 → 支承 → 连接 → 弹性元件 → 制动摩擦 → 通用件与系统"递进，
 * 骨架阶段只有齿轮/轴承/弹簧三项落在其中，其余前缀为后续追加方向预留。
 */
const CATEGORY_ORDER: string[] = [
  '齿轮传动',
  '蜗杆传动',
  '带传动',
  '链传动',
  '螺旋传动',
  '轴',
  '滚动轴承',
  '滑动轴承',
  '联轴器与离合器',
  '螺纹连接',
  '键与花键',
  '过盈与销连接',
  '焊接与铆接',
  '弹簧',
  '制动器',
  '导轨与丝杠',
  '起重机械',
  '机械振动',
  '机构与运动',
  '材料力学基础',
];

function getCategoryIndex(name: string): number {
  for (let i = 0; i < CATEGORY_ORDER.length; i++) {
    if (name.startsWith(CATEGORY_ORDER[i])) return i;
  }
  return CATEGORY_ORDER.length; // 未匹配的排最后
}

export function getMechanicalDisciplineOptions(): SelectOption<string>[] {
  return Object.values(MECHANICAL_DISCIPLINES)
    .map((discipline, idx) => ({
      value: discipline.name,
      label: discipline.name,
      _idx: idx,
    }))
    .sort((a, b) => {
      const catA = getCategoryIndex(a.label);
      const catB = getCategoryIndex(b.label);
      if (catA !== catB) return catA - catB;
      // 同族内保持 disciplines.ts 中的定义顺序
      return a._idx - b._idx;
    })
    .map(({ value, label }) => ({ value, label }));
}

/**
 * 给定已选中的知识点名称列表，返回它们共同支持的题型（交集）。
 * - 空选择：返回全部题型（不限制）
 * - 交集为空：返回空数组，调用方需提示用户组合不可用
 */
export function getCommonQuestionTypes(selectedNames: string[]): MechanicalQuestionType[] {
  const ALL: MechanicalQuestionType[] = ['calculation', 'short-answer', 'mixed'];
  if (selectedNames.length === 0) return ALL;

  return ALL.filter(type =>
    selectedNames.every(name => getSupportedQuestionTypes(name).includes(type))
  );
}

/** 已选知识点中不支持指定题型的名称（UI 黄色提示，不拦截） */
export function getUnsupportedNamesForType(
  selectedNames: string[],
  questionType: MechanicalQuestionType
): string[] {
  return selectedNames.filter(name => !getSupportedQuestionTypes(name).includes(questionType));
}

/** 已选知识点中「特别适合」指定题型的名称（UI 绿色提示） */
export function getRecommendedNamesForType(
  selectedNames: string[],
  questionType: MechanicalQuestionType
): string[] {
  return selectedNames.filter(name => getQuestionTypeAffinity(name, questionType) === 'recommended');
}

/** 已选知识点中「特别不适合」指定题型的名称（UI 橙色提示，不拦截） */
export function getDiscouragedNamesForType(
  selectedNames: string[],
  questionType: MechanicalQuestionType
): string[] {
  return selectedNames.filter(name => getQuestionTypeAffinity(name, questionType) === 'discouraged');
}
