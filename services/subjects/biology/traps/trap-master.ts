import { callLLM } from "../../../llmClient";
import { BaseProblem, TrapModification, TrapType } from "../../../../types/multiNodeTypes";

/**
 * Biology: Trap Master
 * 
 * 支持 5 种题型的陷阱注入：
 * - calculation         : 生物学定量计算陷阱（领域匹配选取）
 * - genetic-reasoning   : 遗传推理陷阱
 * - network-reasoning   : 调控网络陷阱
 * - threshold-reasoning : 阈值逻辑陷阱
 * - structural-reasoning: 结构约束陷阱
 * 
 * 选取策略：领域匹配选取，优先选与题目关键词匹配得分最高的陷阱
 */

// ─────────────────────────────────────────────────────────────────────────────
// 带领域标签的陷阱条目类型
// ─────────────────────────────────────────────────────────────────────────────
interface TrapEntry {
    description: string;
    domains: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 领域匹配选取
// ─────────────────────────────────────────────────────────────────────────────
function selectTraps(pool: TrapEntry[], count: number, context: string): TrapEntry[] {
    const scored = pool.map(t => ({
        trap: t,
        score: t.domains.filter(kw => context.includes(kw)).length
    }));

    scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return Math.random() - 0.5;
    });

    return scored.slice(0, count).map(s => s.trap);
}

// ─────────────────────────────────────────────────────────────────────────────
// 入口
// ─────────────────────────────────────────────────────────────────────────────
export async function applyTraps(
    baseProblem: BaseProblem,
    trapCount: number
): Promise<TrapModification[]> {
    if (trapCount === 0) return [];

    return baseProblem.problemType === 'genetic-reasoning'
        ? applyGeneticTraps(baseProblem, trapCount)
        : applyCalculationTraps(baseProblem, trapCount);
}

// ─────────────────────────────────────────────────────────────────────────────
// 遗传推理陷阱库
// ─────────────────────────────────────────────────────────────────────────────
const GENETIC_TRAP_POOL: TrapEntry[] = [
    {
        description: '- 显隐性混淆陷阱：在题目描述中故意模糊"某性状在F1中完全出现"还是"某性状在F2中占3/4"，让学生难以直接判断哪个是显性性状。',
        domains: ['显隐性', '显性', '隐性', 'F1', 'F2', '性状', '遗传', '表现型', '基因型']
    },
    {
        description: '- 伴性遗传陷阱：设计的遗传数据同时符合常染色体遗传和X染色体连锁遗传两种假设，需要通过正反交结果或性别比例才能区分。',
        domains: ['伴性', 'X染色体', 'Y染色体', '性别', '正反交', '连锁', '性染色体', '雌', '雄']
    },
    {
        description: '- 自由组合/连锁混淆陷阱：后代比例表面上符合9:3:3:1，但实际为两基因连锁遗传的变式。',
        domains: ['连锁', '重组', '自由组合', '9:3:3:1', '两对', '独立遗传', '交换', '重组率']
    },
    {
        description: '- 比例干扰陷阱：在同一组杂交实验中，顺带统计另一个表现型指标的后代数量，其偏差恰好能被误解为不同的遗传比例。',
        domains: ['比例', '后代', '表现型', '杂交', '遗传', '统计', 'F2', '比值']
    },
    {
        description: '- 染色体倍性混淆陷阱：在涉及多倍体或单倍体的遗传分析中，诱导学生混淆"染色体组数"与"染色体条数"。',
        domains: ['多倍体', '单倍体', '染色体组', '倍性', '秋水仙素', '四倍体', '二倍体']
    },
    {
        description: '- 母性遗传方向陷阱：设计正反交结果不同的遗传案例，但表现型差异的原因可能是母性影响、细胞质遗传或伴性遗传三者之一。',
        domains: ['母性', '细胞质遗传', '线粒体', '叶绿体', '正反交', '母本', '父本']
    },
    {
        description: '- 致死基因比例陷阱：在含致死基因的杂交中，后代实际存活比例为 2:1 等非标准比，但题目同时给出看似完整的 3:1 比例。',
        domains: ['致死', '存活', '纯合致死', '2:1', '致死基因', '胚胎致死']
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// 计算题陷阱库
// ─────────────────────────────────────────────────────────────────────────────
const CALCULATION_TRAP_POOL: TrapEntry[] = [
    {
        description: '- 单位量纲陷阱：混合使用非标准单位，或制造单位链断裂。',
        domains: ['单位', 'μmol', 'mmol', 'μM', 'mM', 'min', '速率', '浓度', '量纲']
    },
    {
        description: '- 变量干扰陷阱：加入无关的对照组数据或生理常数，诱导学生代入错误数值。',
        domains: ['浓度', '游离', '总量', '对照', 'Kd', '活性', '酶', '数据', '实验']
    },
    {
        description: '- 概念混淆陷阱：混淆相关但不等同的概念（如净光合 vs 总光合）。',
        domains: ['概念', '净光合', '总光合', '基因频率', '基因型频率', '光合速率', '呼吸']
    },
    {
        description: '- 膜电位方向陷阱：混淆"膜内外电位差"与"膜外内电位差"的符号约定。',
        domains: ['膜电位', '静息电位', '动作电位', 'Nernst', '离子通道', '神经', '突触']
    },
    {
        description: '- 能流效率层级陷阱：在多营养级能流计算中，混入"摄入量""粪便量""呼吸散失量"等不同层次的能量指标。',
        domains: ['营养级', '能流', '林德曼', '同化量', '摄入量', '粪便', '生态效率']
    },
    {
        description: '- 引物/探针错配陷阱：通过碱基互补配对方向诱导学生计算出错误的 PCR 产物长度。',
        domains: ['PCR', '引物', '模板链', '编码链', '5\'端', '3\'端', '碱基互补', '扩增']
    },
    {
        description: '- 信号级联放大陷阱：诱导学生将各步放大倍数线性叠加而非连乘。',
        domains: ['信号转导', '级联', '放大', '受体', '激酶', 'cAMP', 'G蛋白']
    },
    {
        description: '- 细胞周期时相陷阱：诱导学生将"处于某时相的细胞比例"与"该时相持续时间占周期比例"等价使用。',
        domains: ['细胞周期', 'S期', 'G1', 'G2', 'M期', 'DNA含量', '有丝分裂指数']
    },
    {
        description: '- 双重否定调控陷阱：给出三层调控链 A --| B --| C，诱导学生忽略双重否定。',
        domains: ['调控', '转录因子', '启动子', '抑制', '激活', '操纵子', '信号转导']
    },
    {
        description: '- 迟滞性阈值陷阱：诱导学生认为浓度降回阈值以下时系统即刻恢复初始状态。',
        domains: ['阈值', '动作电位', '不应期', '细胞周期', 'Lac操纵子', '诱导剂', '双稳态']
    },
    {
        description: '- 充分性/必要性混淆陷阱：诱导学生将"敲除基因后表型消失"错误理解为充分条件。',
        domains: ['敲除', '过表达', '基因功能', '信号通路', '必要条件', '充分条件', '表型']
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// 遗传推理陷阱
// ─────────────────────────────────────────────────────────────────────────────
async function applyGeneticTraps(
    baseProblem: BaseProblem,
    trapCount: number
): Promise<TrapModification[]> {
    const conditionsText = baseProblem.logicConditions
        ? Object.values(baseProblem.logicConditions).join(' ')
        : '';
    const context = [
        baseProblem.topic,
        baseProblem.scenario,
        baseProblem.questionBody,
        conditionsText,
    ].join(' ');

    const selected = selectTraps(GENETIC_TRAP_POOL, trapCount, context);
    const trapsToApply = selected.map(t => t.description).join('\n');

    const conditionsDisplay = baseProblem.logicConditions
        ? Object.entries(baseProblem.logicConditions).map(([k, v]) => `- ${k}：${v}`).join('\n')
        : '（无文字条件）';

    const prompt = `
你是遗传学陷阱设计专家。给定一道标准遗传推理"白板题"，你需要一次性为其添加多个维度的陷阱。

【原题信息】：
题目描述：${baseProblem.questionBody}
实验背景：${baseProblem.scenario}
已知条件：
${conditionsDisplay}
推断目标：${baseProblem.requiredAnswer}

【任务】：
在保证题目**依然有唯一正确推断结论**的前提下，注入 ${trapCount} 个陷阱：
${trapsToApply}

【修改规则】：
1. 必须保留能推导出唯一正确答案所需的全部条件
2. 可以修改题目描述使措辞更具迷惑性
3. 可以添加文字干扰条件
4. 单终点约束：题干最后只能问一个明确的推断结论

【输出格式】（JSON 数组）：
[
  {
    "trapType": "DOMINANCE_CONFUSION | SEX_LINKED_TRAP | LINKAGE_TRAP | RATIO_DISTRACTOR | PLOIDY_CONFUSION | MATERNAL_EFFECT_DIRECTION | LETHAL_ALLELE_RATIO",
    "agentId": "trap_master",
    "modifiedFields": {
      "questionBody": "完整修改后的题目描述",
      "logicConditions": {"条件名称": "修改后的条件文字"},
      "logicDistractors": {"干扰条件名称": "干扰条件文字"}
    },
    "trapDescription": "此陷阱的设计原理",
    "expectedConfusion": "学生可能产生的误判"
  }
]
`;

    try {
        const cleanContent = (await callLLM(prompt, { model: 'reasoning', temperature: 0.4 }))
            .replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const startIdx = cleanContent.indexOf('[');
        const endIdx = cleanContent.lastIndexOf(']');
        if (startIdx === -1 || endIdx === -1) throw new Error('No JSON array found');

        const jsonSlice = cleanContent.slice(startIdx, endIdx + 1);
        return JSON.parse(jsonSlice) as TrapModification[];

    } catch (error) {
        console.error("Trap Master Error:", error);
        throw new Error(`Trap Master failed: ${error.message}`);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 定量计算陷阱
// ─────────────────────────────────────────────────────────────────────────────
async function applyCalculationTraps(
    baseProblem: BaseProblem,
    trapCount: number
): Promise<TrapModification[]> {
    const context = [
        baseProblem.topic,
        baseProblem.scenario,
        baseProblem.questionBody,
        Object.keys(baseProblem.givenData || {}).join(' '),
    ].join(' ');

    const selected = selectTraps(CALCULATION_TRAP_POOL, trapCount, context);
    const trapsToApply = selected.map(t => t.description).join('\n');

    const prompt = `
你是生物学陷阱设计专家。给定一道标准生物学"白板题"，你需要一次性为其添加多个维度的陷阱。

【原题信息】：
题目：${baseProblem.questionBody}
情境：${baseProblem.scenario}
已知数据：${JSON.stringify(baseProblem.givenData, null, 2)}

【任务】：
在保证题目**依然有唯一正确解**的前提下，注入 ${trapCount} 个陷阱：
${trapsToApply}

【修改规则】：
1. 原有的正确求解所需的数据必须保留
2. 添加干扰数据时，必须符合生物学合理范围
3. 单终点约束：题干最后只能问一个明确的数值

【输出格式】（JSON 数组）：
[
  {
    "trapType": "UNIT_DIMENSION | MEMBRANE_POTENTIAL_DIRECTION | TROPHIC_EFFICIENCY_CASCADE | ...",
    "agentId": "trap_master",
    "modifiedFields": {
      "questionBody": "完整修改后的题目描述",
      "distractorData": {"干扰量1": {"value": 123, "unit": "单位"}}
    },
    "trapDescription": "此陷阱的设计原理",
    "expectedConfusion": "学生可能产生的误会"
  }
]
`;

    try {
        const cleanContent = (await callLLM(prompt, { model: 'reasoning', temperature: 0.4 }))
            .replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        const startIdx = cleanContent.indexOf('[');
        const endIdx = cleanContent.lastIndexOf(']');
        if (startIdx === -1 || endIdx === -1) throw new Error('No JSON array found');

        const jsonSlice = cleanContent.slice(startIdx, endIdx + 1);
        return JSON.parse(jsonSlice) as TrapModification[];

    } catch (error) {
        console.error("Trap Master Error:", error);
        throw new Error(`Trap Master failed: ${error.message}`);
    }
}