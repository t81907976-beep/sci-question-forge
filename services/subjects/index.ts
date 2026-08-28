import type { Subject, UserInput } from '../../types/multiNodeTypes';

export interface SubjectConfig {
    name: string;
    icon: string;
    defaultTopic: string;
    defaultTrapCount: number;
    placeholderTopic: string;
    supportsBatch: boolean;
    supportsV2: boolean;
    promptPreamble: string;
    promptDomain: string;
    difficultyScale: { min: number; max: number };
}

export const SUBJECT_CONFIGS: Record<Subject, SubjectConfig> = {
    chemistry: {
        name: '化学',
        icon: 'Beaker',
        defaultTopic: '化学平衡',
        defaultTrapCount: 2,
        placeholderTopic: '例如：化学平衡',
        supportsBatch: true,
        supportsV2: true,
        promptPreamble: '你是物理化学领域的资深教授和竞赛命题专家',
        promptDomain: '物理化学',
        difficultyScale: { min: 1, max: 10 }
    },
    math: {
        name: '数学',
        icon: 'Sigma',
        defaultTopic: '代数方程',
        defaultTrapCount: 2,
        placeholderTopic: '例如：代数方程',
        supportsBatch: false,
        supportsV2: false,
        promptPreamble: '你是数学领域的资深教授和竞赛命题专家',
        promptDomain: '数学',
        difficultyScale: { min: 1, max: 10 }
    },
    physics: {
        name: '物理',
        icon: 'Atom',
        defaultTopic: '牛顿力学',
        defaultTrapCount: 2,
        placeholderTopic: '例如：电磁感应',
        supportsBatch: false,
        supportsV2: true,
        promptPreamble: '你是物理学领域的资深教授和竞赛命题专家',
        promptDomain: '物理学',
        difficultyScale: { min: 1, max: 10 }
    },
    biology: {
        name: '生物',
        icon: 'Leaf',
        defaultTopic: '细胞代谢',
        defaultTrapCount: 2,
        placeholderTopic: '例如：光合作用、遗传推理、细胞周期',
        supportsBatch: false,
        supportsV2: false,
        promptPreamble: '你是生物学领域的资深教授和竞赛命题专家',
        promptDomain: '生物学',
        difficultyScale: { min: 1, max: 10 }
    },
    finance: {
        name: '金融',
        icon: 'TrendingUp',
        defaultTopic: '期权定价',
        defaultTrapCount: 2,
        placeholderTopic: '例如：期权定价、利率期限结构、精算准备金',
        supportsBatch: false,
        supportsV2: true,
        promptPreamble: '你是量化金融领域的博士后级别专家和CFA/FRM命题专家',
        promptDomain: '量化金融',
        difficultyScale: { min: 1, max: 10 }
    },
    materials: {
        name: '材料',
        icon: 'Layers',
        defaultTopic: '相变与热处理',
        defaultTrapCount: 2,
        placeholderTopic: '例如：马氏体相变、高分子结晶、陶瓷烧结',
        supportsBatch: false,
        supportsV2: true,
        promptPreamble: '你是材料科学与工程领域的资深教授和竞赛命题专家',
        promptDomain: '材料科学与工程',
        difficultyScale: { min: 1, max: 10 }
    },
    mechanical: {
        name: '机械',
        icon: 'Cog',
        defaultTopic: '齿轮传动-渐开线圆柱齿轮强度与选型',
        defaultTrapCount: 2,
        placeholderTopic: '例如：渐开线圆柱齿轮选型、滚动轴承寿命、圆柱螺旋弹簧',
        supportsBatch: false,
        supportsV2: true,
        promptPreamble: '你是机械设计领域的资深教授和命题专家（机械设计手册与 Shigley 体系皆熟）',
        promptDomain: '机械设计',
        difficultyScale: { min: 1, max: 10 }
    }
};

export function getSubjectConfig(subject: Subject): SubjectConfig {
    return SUBJECT_CONFIGS[subject];
}

export function getDefaultUserInput(subject: Subject): Partial<UserInput> {
    const cfg = SUBJECT_CONFIGS[subject];
    return {
        subject,
        topic: cfg.defaultTopic,
        trapCount: cfg.defaultTrapCount,
        problemCount: 3,
        allowTableLookup: true,
        language: 'zh-CN',
        useAntiInterference: true,
        singleQuestion: false,
        numericAnswerOnly: false
    };
}
