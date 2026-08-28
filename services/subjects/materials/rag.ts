import type { TextbookConstraints, UserInput } from "../../../types/multiNodeTypes";

/**
 * Materials Science: RAG Knowledge Base (材料学专属)
 *
 * 独立于共用的 nodes/node1-rag.ts（那是化学默认版本，被多学科共用）。
 * 本文件只服务材料学管线：提供材料学标准术语、符号、单位约束。
 * 根据 topic 中包含的方向关键词注入对应领域的专业术语。
 */

export function getMaterialsTextbookConstraints(input: UserInput): TextbookConstraints {
    return {
        terminology: getStandardTerminology(input.topic),
        standardNotations: getStandardNotations(input.topic),
        forbiddenExpressions: getForbiddenExpressions(),
        requiredUnits: getRequiredUnits(input.topic)
    };
}

function getStandardTerminology(topic: string): string[] {
    // 材料学通用基础术语
    const commonTerms = [
        '晶体结构', '晶格常数', '密勒指数', '位错', '滑移系',
        '相变', '固溶体', '第二相', '形核', '长大',
        '弹性模量', '屈服强度', '抗拉强度', '断裂韧性', '疲劳寿命',
        '扩散系数', '活化能', '热导率', '比热容', '热膨胀系数',
    ];

    // 根据方向注入专业术语
    const topicTerms: Record<string, string[]> = {
        '相变': ['马氏体', '珠光体', '贝氏体', '奥氏体', 'CCT图', 'TTT图', '过冷度'],
        '热处理': ['淬火', '回火', '退火', '正火', '固溶处理', '时效强化', '过时效'],
        '力学性能': ['应力-应变曲线', '加工硬化', '包辛格效应', 'Hall-Petch关系', '蠕变', '应力松弛'],
        '断裂': ['裂纹扩展', 'Paris公式', '应力强度因子', 'CTOD', 'J积分', '断口形貌'],
        '腐蚀': ['电化学腐蚀', '钝化膜', '点蚀', '晶间腐蚀', '应力腐蚀', '缝隙腐蚀', '电位-pH图'],
        '薄膜': ['PVD', 'CVD', '溅射', '外延生长', '薄膜应力', '附着力', '织构'],
        '高分子': ['玻璃化转变', '结晶度', '分子量分布', '交联密度', '链段运动', '自由体积'],
        '陶瓷': ['烧结', '致密化', '晶界', '气孔率', '热震稳定性', 'Weibull分布', '增韧机制'],
        '半导体': ['能带', '带隙', '掺杂', '载流子', '迁移率', '霍尔效应', 'pn结'],
        '复合材料': ['基体', '增强体', '界面', '混合法则', '层板理论', '分层', '脱粘'],
        '纳米': ['表面能', '量子尺寸效应', '比表面积', '纳米压痕', '尺寸效应', 'TEM', 'XRD'],
        '能源': ['锂离子电池', '比容量', '充放电曲线', '库伦效率', 'SEI膜', '固态电解质'],
        '生物材料': ['生物相容性', '降解速率', '骨整合', '表面改性', '细胞毒性', '血液相容性'],
        '磁性': ['磁畴', '矫顽力', '剩磁', '磁滞回线', '居里温度', '磁各向异性'],
        '铸造': ['凝固', '枝晶', '偏析', '缩孔', '浇注温度', '冒口', '冷铁'],
        '焊接': ['热影响区', '熔池', '焊接接头', '残余应力', '焊接变形', '热裂纹', '冷裂纹'],
        '轧制': ['塑性变形', '再结晶', '织构', '轧制力', '压下率', '加工硬化'],
        '粉末冶金': ['粉末制备', '压制', '烧结', '致密度', '增材制造', '选区激光熔化', '熔池动力学'],
        '光电': ['光吸收', '光致发光', '量子效率', '载流子寿命', '太阳能电池', 'LED'],
        '计算材料': ['第一性原理', '分子动力学', '蒙特卡洛', '有限元', '相场模拟', 'CALPHAD'],
        '热力学': ['吉布斯自由能', '化学势', '相律', '杠杆定律', '相图', '混合焓'],
        '动力学': ['扩散方程', 'Fick定律', 'Arrhenius方程', 'JMAK方程', '形核率', '长大速率'],
        '分析测试': ['XRD', 'SEM', 'TEM', 'EDS', 'XPS', 'DSC', 'TGA', 'EBSD', '拉曼光谱'],
        '无机非金属': ['玻璃', '水泥', '耐火材料', '熟料', '水化反应', '析晶', '退火点', '软化点'],
    };

    const matched: string[] = [];
    for (const [key, terms] of Object.entries(topicTerms)) {
        if (topic.includes(key)) {
            matched.push(...terms);
        }
    }

    return [...commonTerms, ...matched];
}

function getStandardNotations(topic: string): Record<string, string> {
    const base: Record<string, string> = {
        '弹性模量': 'E (单位: GPa)',
        '屈服强度': 'σ_y 或 σ₀.₂ (单位: MPa)',
        '抗拉强度': 'σ_b 或 UTS (单位: MPa)',
        '断裂韧性': 'K_IC (单位: MPa·m^½)',
        '应力': 'σ (单位: MPa 或 GPa)',
        '应变': 'ε (无量纲)',
        '温度': 'T (单位: K 或 °C，公式中用 K)',
        '扩散系数': 'D (单位: m²/s 或 cm²/s)',
        '活化能': 'Q 或 E_a (单位: kJ/mol)',
        '晶格常数': 'a (单位: nm 或 Å)',
        '位错密度': 'ρ (单位: m⁻² 或 cm⁻²)',
        '热导率': 'λ 或 k (单位: W/(m·K))',
        '比热容': 'c_p (单位: J/(kg·K) 或 J/(mol·K))',
        '热膨胀系数': 'α (单位: 10⁻⁶/K 或 K⁻¹)',
        '气体常数': 'R = 8.314 J/(mol·K)',
        '玻尔兹曼常数': 'k_B = 1.38×10⁻²³ J/K',
    };

    // 半导体方向额外符号
    if (/半导体|能带|器件/.test(topic)) {
        base['带隙'] = 'E_g (单位: eV)';
        base['载流子浓度'] = 'n/p (单位: cm⁻³)';
        base['迁移率'] = 'μ (单位: cm²/(V·s))';
        base['电导率'] = 'σ (单位: S/m 或 S/cm)';
    }

    // 磁性方向额外符号
    if (/磁性|磁学/.test(topic)) {
        base['磁化强度'] = 'M (单位: A/m 或 emu/cm³)';
        base['矫顽力'] = 'H_c (单位: kA/m 或 Oe)';
        base['磁感应强度'] = 'B (单位: T)';
        base['磁导率'] = 'μ (单位: H/m)';
    }

    // 高分子方向
    if (/高分子|聚合物/.test(topic)) {
        base['数均分子量'] = 'M_n (单位: g/mol)';
        base['重均分子量'] = 'M_w (单位: g/mol)';
        base['玻璃化转变温度'] = 'T_g (单位: °C 或 K)';
        base['多分散指数'] = 'PDI = M_w/M_n (≥1)';
    }

    return base;
}

function getForbiddenExpressions(): string[] {
    return [
        '随便', '大概', '可能', '也许',
        '差不多', '基本上', '一般来说',
        // 避免在科学题目中使用模糊表述
    ];
}

function getRequiredUnits(topic: string): string[] {
    const baseUnits = ['GPa', 'MPa', 'K', '°C', 'J/mol', 'kJ/mol', 'm²/s', 'nm', 'μm', 'W/(m·K)'];

    const topicUnits: Record<string, string[]> = {
        '力学': ['MPa', 'GPa', 'MPa·m^½', 'N/m', '%'],
        '热处理': ['°C', 'K', 's', 'min', 'h', '°C/s', '°C/min'],
        '扩散': ['m²/s', 'cm²/s', 'kJ/mol', 'K'],
        '半导体': ['eV', 'cm⁻³', 'cm²/(V·s)', 'S/cm', 'nm'],
        '高分子': ['g/mol', '°C', 'K', 'MPa', 'J/g', '%'],
        '磁性': ['T', 'A/m', 'kA/m', 'Oe', 'kOe', 'emu/g'],
        '腐蚀': ['V', 'mV', 'A/cm²', 'mA/cm²', 'mm/year', 'mpy'],
        '薄膜': ['nm', 'μm', 'Å', 'Pa', 'mTorr', 'nm/min'],
        '能源': ['mAh/g', 'Wh/kg', 'mV', 'V', 'C-rate', '%'],
        '陶瓷': ['MPa', 'GPa', '%', '°C', 'g/cm³'],
    };

    const matched: string[] = [];
    for (const [key, units] of Object.entries(topicUnits)) {
        if (topic.includes(key)) {
            matched.push(...units);
        }
    }

    return [...baseUnits, ...matched];
}

/**
 * 生成材料学教材规范约束的 prompt 片段
 */
export function getMaterialsTextbookPromptConstraints(constraints: TextbookConstraints): string {
    return `
【教材规范要求】：
1. 必须使用以下标准术语：${constraints.terminology.slice(0, 8).join('、')}等
2. 符号表示遵循：${Object.entries(constraints.standardNotations).slice(0, 4).map(([k, v]) => `${k}用${v}`).join('；')}
3. 禁止使用非正式表述：${constraints.forbiddenExpressions.join('、')}
4. 单位必须规范：${constraints.requiredUnits.slice(0, 8).join('、')}
5. 所有数据必须符合物理意义，不得人为臆造不合理数值
`;
}
