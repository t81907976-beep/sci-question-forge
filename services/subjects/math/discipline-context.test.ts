import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { buildMathDisciplineContext } from './discipline-context.ts';

test('splits algebra-equation fields into generation guidance and validation rules', () => {
  const context = buildMathDisciplineContext('algebra-equation', 'intermediate');

  assert.equal(context.generationGuidance.disciplineKey, 'algebra-equation');
  assert.equal(context.generationGuidance.name, '代数-代数方程');
  assert.ok(context.generationGuidance.keywords.includes('二元一次方程组'));
  assert.match(context.generationGuidance.level, /分式方程/);
  assert.ok(context.generationGuidance.antiPatternStrategies.some(item => item.includes('含参数的二次方程根分布')));

  assert.equal(context.validationRules.disciplineKey, 'algebra-equation');
  assert.ok(context.validationRules.forbiddenQuestionTypes.some(item => item.includes('机械套公式')));
  assert.ok(context.validationRules.forbiddenErrors.some(item => item.includes('分式方程的增根检验')));
  assert.match(context.validationRules.parameterConstraints.fraction_domain, /分母不能为零/);
});
