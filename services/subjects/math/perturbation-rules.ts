import type { MathPerturbationType } from "../../../types/multiNodeTypes";

export interface MathPerturbationRule {
    id: string;
    keywords: string[];
    perturbationType: MathPerturbationType;
    targetWeakness: string;
    invalidatedStandardMethod: string;
    expectedWrongPath: string;
    manualValidationHints: string[];
}

const GENERAL_RULES: MathPerturbationRule[] = [
    {
        id: "constraint-handling-failure",
        keywords: ["定义域", "数域", "端点", "整数", "参数", "范围", "边界", "可达", "方程", "函数", "不等式"],
        perturbationType: "constraint_handling_failure",
        targetWeakness: "约束处理失败：忽略定义域、数域、整数性、边界、端点或可达性筛选",
        invalidatedStandardMethod: "先按无约束问题求候选答案，再默认候选答案全部有效",
        expectedWrongPath: "忽略定义域、数域、端点、整数解或可达性，保留不满足原题约束的答案",
        manualValidationHints: [
            "检查解题模型是否把定义域、数域、端点、整数性和参数范围带入每一步筛选",
            "检查最终答案是否逐一满足题面所有约束",
            "若解题模型只在开头复述约束但最终未用，应标记为约束处理失败"
        ]
    },
    {
        id: "branch-explosion",
        keywords: ["绝对值", "分段", "符号", "根分布", "参数区间", "临界点", "退化", "重根", "降次", "不等式", "方程"],
        perturbationType: "branch_explosion",
        targetWeakness: "分支爆炸/分类遗漏：多个参数区间、符号区间、临界点或退化情形并行维护失败",
        invalidatedStandardMethod: "只沿一个默认分支计算，或合并本应分开讨论的参数区间",
        expectedWrongPath: "漏掉绝对值分段、符号表、根分布或参数退化情形，导致答案集合缺失或多算",
        manualValidationHints: [
            "检查解题模型是否列出所有临界点并排序",
            "检查每个分支和退化情形是否分别求解并回到原条件验证",
            "若答案只覆盖一个参数区间，应核对是否漏分支"
        ]
    },
    {
        id: "non-equivalent-transformation",
        keywords: ["平方", "消分母", "约分", "取倒数", "根式", "对数", "方程", "分式"],
        perturbationType: "non_equivalent_transformation",
        targetWeakness: "非等价变形：把候选方程当原方程，未处理增根、失根或非法变形",
        invalidatedStandardMethod: "平方、消分母、约分或取倒数后直接把新方程解集当作原方程解集",
        expectedWrongPath: "保留平方或消分母产生的增根，或因约分、取倒数漏掉原方程合法解",
        manualValidationHints: [
            "检查每个变形是否双向等价",
            "检查分母、被约因子、根式和对数定义域是否单独处理",
            "若解题模型没有把候选解回代原方程，应标记为非等价变形风险"
        ]
    },
    {
        id: "template-overfitting",
        keywords: ["判别式", "韦达", "同余", "CRT", "中国剩余", "矩阵", "特征值", "函数"],
        perturbationType: "template_overfitting",
        targetWeakness: "模板过拟合：看到熟题形态就套固定路线，未检查适用条件",
        invalidatedStandardMethod: "把看似判别式、韦达、CRT、矩阵标准题的结构直接套模板",
        expectedWrongPath: "按熟题模板推进，但忽略题目中破坏模板适用条件的结构限制",
        manualValidationHints: [
            "检查解题模型是否先验证所套模板的前提条件",
            "检查题目是否存在看似熟题但改变结论的额外约束",
            "若解题模型只识别题型不处理本题特有条件，应标记为模板过拟合"
        ]
    },
    {
        id: "symbol-role-drift",
        keywords: ["变量", "参数", "函数", "解集", "公共解", "同解", "求", "集合"],
        perturbationType: "symbol_role_drift",
        targetWeakness: "符号角色漂移：混淆变量、参数、函数、解集或参数集",
        invalidatedStandardMethod: "没有固定每个符号的角色，直接把求 x 的过程当作求参数或求集合",
        expectedWrongPath: "混淆求 x 与求 a、公共解与同解、函数值与函数本身、解集与参数集",
        manualValidationHints: [
            "检查解题模型是否明确每个符号是变量、参数、函数还是集合",
            "检查最终答案的对象类型是否等于题目要求的对象类型",
            "若解题模型把中间变量解误当最终参数答案，应标记为符号角色漂移"
        ]
    },
    {
        id: "quantifier-order-error",
        keywords: ["存在", "任意", "所有", "恰有", "至少", "唯一", "恒成立", "有解", "极限", "换序"],
        perturbationType: "quantifier_order_error",
        targetWeakness: "量词与定序错误：混淆任意、存在、唯一、恰有、至少及其先后顺序，或错误交换极限/求和/积分顺序",
        invalidatedStandardMethod: "把量词条件翻译成更弱或更强的代数条件，或默认可交换运算顺序后直接求解",
        expectedWrongPath: "把恒成立当存在解，把恰有一个解当至少一个解，交换任意与存在的顺序，或非法交换极限顺序",
        manualValidationHints: [
            "检查解题模型是否把题面量词和运算顺序逐字转成数学条件",
            "检查恒成立、有解、唯一解、恰有 n 个解、极限换序是否分别处理",
            "若解题模型用一个例子证明任意命题或交换量词顺序，应标记为量词与定序错误"
        ]
    },
    {
        id: "exact-calculation-fragility",
        keywords: ["精确计算", "展开", "因式分解", "判别式", "化简", "交集", "并集", "补集", "参数集合"],
        perturbationType: "exact_calculation_fragility",
        targetWeakness: "精确计算脆弱：长代数链中展开、因式分解或集合运算出错",
        invalidatedStandardMethod: "依赖长串手算化简但不设置中间校验点",
        expectedWrongPath: "判别式化简、因式分解、参数集合交并补或端点开闭计算错误",
        manualValidationHints: [
            "检查关键展开和因式分解是否可逆且数值一致",
            "检查集合交、并、补的端点开闭和包含关系",
            "若最终集合来自长计算，应抽取特殊值回测"
        ]
    },
    {
        id: "representation-selection-failure",
        keywords: ["状态表", "符号表", "分类表", "临界点", "矩阵秩", "同余系统", "排序"],
        perturbationType: "representation_selection_failure",
        targetWeakness: "表示选择失败：没有先建立正确状态表、符号表或分类表",
        invalidatedStandardMethod: "直接代数推进，不先整理多临界点、矩阵秩情形或同余系统结构",
        expectedWrongPath: "临界点排序、矩阵秩分类、同余系统状态或符号表建立错误，导致后续推理整体偏移",
        manualValidationHints: [
            "检查解题模型是否先建立适合本题的状态表、符号表或分类表",
            "检查多临界点排序、秩分类和同余条件是否完整",
            "若没有表示层就直接计算，应核对是否因此漏掉结构信息"
        ]
    },
    {
        id: "self-check-closure-failure",
        keywords: ["回代", "验证", "特殊值", "端点", "反向", "检验", "候选解", "闭环", "排除"],
        perturbationType: "self_check_closure_failure",
        targetWeakness: "自检闭环失败：文字声称检查、分类或回代，但没有回到最原始题干验证最终答案",
        invalidatedStandardMethod: "求出候选答案后只检验中间式，或写了回代/排除却不让检查结果影响最终答案",
        expectedWrongPath: "候选答案只满足非等价变形后的中间式，不满足原题约束，但最终仍被保留",
        manualValidationHints: [
            "检查最终答案是否逐项回代最原始题干",
            "检查声称执行的验证是否真的改变或筛选最终答案",
            "若候选答案只满足中间式不满足原题，应标记为自检闭环失败"
        ]
    },
    {
        id: "logical-condition-misjudgment",
        keywords: ["充要", "必要", "充分", "等价", "推出", "条件", "弱条件", "强条件", "当且仅当"],
        perturbationType: "logical_condition_misjudgment",
        targetWeakness: "逻辑条件误判：混淆充分条件、必要条件和充要条件，或把弱条件升格为强条件",
        invalidatedStandardMethod: "把单向蕴含当作双向等价，或默认题面弱条件满足常见强结论的适用前提",
        expectedWrongPath: "由必要条件直接推出结论，或把只在强条件下成立的模板结论用于弱条件题目",
        manualValidationHints: [
            "检查每个推出关系是否需要反向也成立",
            "检查题面只给弱条件时，解题模型是否额外假设了连续、单调、可逆、独立等强条件",
            "若解题模型把必要条件当充分条件，应标记为逻辑条件误判"
        ]
    }
];

export function getMathPerturbationRules(topicOrDisciplineKey: string): MathPerturbationRule[] {
    const text = topicOrDisciplineKey.toLowerCase();
    const matched = GENERAL_RULES.filter(rule =>
        rule.keywords.some(keyword => text.includes(keyword.toLowerCase()))
    );

    return matched.length > 0 ? matched : GENERAL_RULES.slice(0, 3);
}

export function getMathPerturbationRuleByType(perturbationType: MathPerturbationType): MathPerturbationRule {
    const rule = GENERAL_RULES.find(item => item.perturbationType === perturbationType);
    if (!rule) {
        throw new Error(`Unknown math perturbation type: ${perturbationType}`);
    }
    return rule;
}

export function formatMathPerturbationRulesForPrompt(topicOrDisciplineKey: string): string {
    return getMathPerturbationRules(topicOrDisciplineKey)
        .map((rule, index) => `${index + 1}. ${rule.id}
   扰动类型：${rule.perturbationType}
   目标弱点：${rule.targetWeakness}
   失效熟路：${rule.invalidatedStandardMethod}
   预期错误路径：${rule.expectedWrongPath}
   人工验证提示：${rule.manualValidationHints.join("；")}`)
        .join("\n");
}
