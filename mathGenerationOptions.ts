import { MATH_DISCIPLINES } from './services/subjects/math/disciplines.ts';
import type { MathPerturbationType } from './types/multiNodeTypes.ts';

export type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};

export const MATH_DIFFICULTY_OPTIONS: SelectOption<number>[] = [1, 2, 3, 4].map(value => ({
  value,
  label: String(value),
}));

export const DEFAULT_MATH_PERTURBATION_TYPE: MathPerturbationType = 'constraint_handling_failure';

export const MATH_PERTURBATION_OPTIONS: SelectOption<MathPerturbationType>[] = [
  { value: 'constraint_handling_failure', label: '约束处理失败' },
  { value: 'branch_explosion', label: '分支爆炸/分类遗漏' },
  { value: 'non_equivalent_transformation', label: '非等价变形' },
  { value: 'template_overfitting', label: '模板过拟合' },
  { value: 'symbol_role_drift', label: '符号角色漂移' },
  { value: 'quantifier_order_error', label: '量词与定序错误' },
  { value: 'exact_calculation_fragility', label: '精确计算脆弱' },
  { value: 'representation_selection_failure', label: '表示选择失败' },
  { value: 'self_check_closure_failure', label: '自检闭环失败' },
  { value: 'logical_condition_misjudgment', label: '逻辑条件误判' },
];

export function getMathDisciplineOptions(): SelectOption<string>[] {
  return Object.values(MATH_DISCIPLINES)
    .map(discipline => ({
      value: discipline.name,
      label: discipline.name,
    }));
}
