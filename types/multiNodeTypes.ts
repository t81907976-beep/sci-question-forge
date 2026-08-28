/**
 * Multi-Node Problem Generation Architecture Types (Unified: Chemistry + Math + Biology + Finance)
 */

export type Subject = 'chemistry' | 'math' | 'physics' | 'biology' | 'finance' | 'materials' | 'mechanical';

// ============= Biology-specific Types =============
/** 生物学推理范式类型 */
export type ReasoningType = 'conservation' | 'topology' | 'threshold' | 'probability' | 'constraint' | 'equilibrium' | 'selection';

/** 生物学题型 */
export type BiologyProblemType = 'calculation' | 'genetic-reasoning' | 'network-reasoning' | 'threshold-reasoning' | 'structural-reasoning';

/** 生物学难度等级 */
export type BiologyDifficulty = 'basic' | 'intermediate' | 'advanced' | 'competition';

// ============= Finance-specific Types =============
/** 量化金融推理范式类型 */
export type FinanceReasoningType =
    | 'no-arbitrage'          // 无套利/复制组合
    | 'measure-change'        // 测度变换与计价单位切换
    | 'discounting'           // 现金流折现与口径匹配
    | 'identification'        // 计量识别与因果推断
    | 'aggregation'           // 分布聚合与风险度量
    | 'accrual-consistency'   // 权责发生制与三表联动
    | 'leverage-propagation'; // 杠杆与资本结构传导

/** 量化金融题型 */
export type FinanceProblemType =
    | 'pricing'               // 衍生品定价与对冲
    | 'valuation'             // 企业/证券估值与交易结构
    | 'econometric-inference' // 计量建模与统计推断
    | 'actuarial-reserving'   // 精算定价与准备金评估
    | 'risk-measurement'      // 风险度量与资本要求
    | 'statement-analysis';   // 财务分析与资本预算决策

/** 量化金融难度等级 */
export type FinanceDifficulty = 'basic' | 'intermediate' | 'advanced' | 'professional';

/** 材料学题型（仅材料学科 V2 使用）：计算题 | 简答题 | 混合题（含计算+论述小问） */
export type MaterialsQuestionType = 'calculation' | 'short-answer' | 'mixed';

/** 机械设计题型（仅机械学科 V2 使用）：设计/校核计算题 | 论述题 | 混合题 */
export type MechanicalQuestionType = 'calculation' | 'short-answer' | 'mixed';

// ============= Node 0: User Input =============
export interface UserInput {
    subject?: Subject;
    topic: string;
    chapterRange?: string;
    trapCount: number;
    problemCount: number;
    allowTableLookup: boolean;
    singleQuestion?: boolean;
    numericAnswerOnly?: boolean;
    language?: 'zh-CN' | 'en-US' | 'ja-JP' | 'es-ES' | 'fr-FR' | 'ko-KR';
    knowledgePointIds?: string[];
    useAntiInterference?: boolean;
    perturbationType?: MathPerturbationType;
    materialsQuestionType?: MaterialsQuestionType;
    mechanicalQuestionType?: MechanicalQuestionType;
}

// ============= Node 1: RAG Constraints =============
export interface TextbookConstraints {
    terminology: string[];
    standardNotations: Record<string, string>;
    forbiddenExpressions: string[];
    requiredUnits: string[];
}

export type ReviewFailureType =
    | 'none'
    | 'too_easy'
    | 'template_problem'
    | 'topic_mismatch'
    | 'contradictory_conditions'
    | 'unsolvable'
    | 'non_unique_answer'
    | 'solution_math_error'
    | 'solution_incomplete'
    | 'unclear_statement'
    | 'perturbation_invalid'
    | 'format_issue'
    | 'review_parse_failed';

export type ReviewRetryFromNode = 2 | 5 | 6 | 7 | 'reviewer' | null;

export interface ReviewRetryHint {
    promptPatch?: string;
    solverInstruction?: string;
    formattingInstruction?: string;
    outputInstruction?: string;
    avoidPattern?: string;
}

export interface RetryContext {
    failureReason: string;
    failureCategory: string;
    previousQuestionHead: string;
    retryHint?: ReviewRetryHint;
    retryFromNode?: ReviewRetryFromNode;
}

export type MathPerturbationType =
    | 'constraint_handling_failure'
    | 'branch_explosion'
    | 'non_equivalent_transformation'
    | 'template_overfitting'
    | 'symbol_role_drift'
    | 'quantifier_order_error'
    | 'exact_calculation_fragility'
    | 'representation_selection_failure'
    | 'self_check_closure_failure'
    | 'logical_condition_misjudgment';

export interface MathPerturbationBlueprint {
    basePattern: string;
    targetWeakness: string;
    perturbationType: MathPerturbationType;
    invalidatedStandardMethod: string;
    expectedWrongPath: string;
    divergenceStep: string;
    manualValidationChecklist: string[];
}

export interface MathGenerationGuidance {
    disciplineKey: string;
    name: string;
    keywords: string[];
    level: string;
    antiPatternStrategies: string[];
}

export interface MathValidationRules {
    disciplineKey: string;
    name: string;
    forbiddenQuestionTypes: string[];
    forbiddenErrors: string[];
    parameterConstraints: Record<string, string>;
}

export interface MathDisciplineContext {
    generationGuidance: MathGenerationGuidance;
    validationRules: MathValidationRules;
}

export type MathCoreDataKind = 'function' | 'set' | 'condition' | 'equation' | 'parameter' | 'object';

export interface MathCoreDataItem {
    kind: MathCoreDataKind;
    value: number | string;
    unit: string;
}

export type CoreDataRecord = Record<string, { value: number | string; unit: string; kind?: MathCoreDataKind }>;

// ============= Node 2: Base Problem =============
export interface BaseProblem {
    problemId: string;
    topic: string;
    scenario: string;
    // Chemistry style
    originalProblemText?: string;
    coreData?: CoreDataRecord;
    // Math style (legacy compat)
    questionBody?: string;
    givenData?: Record<string, { value: number | string; unit: string }>;
    // Biology style
    problemType?: BiologyProblemType;
    /** 遗传推理题用：文字描述形式的已知条件 */
    logicConditions?: Record<string, string>;
    // Finance style
    financeProblemType?: FinanceProblemType;
    financeReasoningType?: FinanceReasoningType;
    /** 金融题用：市场报价/合约条款等文字型已知条件（如标价方向、结算约定、契约条款） */
    marketConventions?: Record<string, string>;
    requiredAnswer: string;
    referenceSteps?: string[];
    solutionPath?: string[];
    expectedDifficulty?: number;
    mergedProblemText?: string;
    knowledgePointIds?: string[];
    mathPerturbationBlueprint?: MathPerturbationBlueprint;
    mathDisciplineContext?: MathDisciplineContext;
}

// ============= Node 3: Trap Agents =============
export enum TrapType {
    // 通用陷阱
    PROCESS_DETERMINATION = 'PROCESS_DETERMINATION',
    FORMULA_APPLICABILITY = 'FORMULA_APPLICABILITY',
    TABLE_LOOKUP = 'TABLE_LOOKUP',
    UNIT_DIMENSION = 'UNIT_DIMENSION',
    PHYSICAL_DEFINITION = 'PHYSICAL_DEFINITION',
    // 生物学计算题扩展陷阱
    MEMBRANE_POTENTIAL_DIRECTION = 'MEMBRANE_POTENTIAL_DIRECTION',   // 膜电位方向陷阱
    TROPHIC_EFFICIENCY_CASCADE = 'TROPHIC_EFFICIENCY_CASCADE',       // 能流效率层级陷阱
    PRIMER_PROBE_MISMATCH = 'PRIMER_PROBE_MISMATCH',                 // 引物/探针错配陷阱
    SIGNAL_CASCADE_AMPLIFICATION = 'SIGNAL_CASCADE_AMPLIFICATION',   // 信号级联放大陷阱
    CELL_CYCLE_PHASE_CONFUSION = 'CELL_CYCLE_PHASE_CONFUSION',       // 细胞周期时相陷阱
    GROWTH_MODEL_BOUNDARY = 'GROWTH_MODEL_BOUNDARY',                 // 增长模型边界陷阱
    // 生物学遗传推理专用陷阱
    DOMINANCE_CONFUSION = 'DOMINANCE_CONFUSION',     // 显隐性判断陷阱
    LINKAGE_TRAP = 'LINKAGE_TRAP',                   // 连锁/自由组合陷阱
    SEX_LINKED_TRAP = 'SEX_LINKED_TRAP',             // 常染色体/伴性遗传混淆
    RATIO_DISTRACTOR = 'RATIO_DISTRACTOR',           // 比例干扰陷阱
    PLOIDY_CONFUSION = 'PLOIDY_CONFUSION',           // 染色体倍性混淆陷阱
    MATERNAL_EFFECT_DIRECTION = 'MATERNAL_EFFECT_DIRECTION', // 母性遗传方向陷阱
    LETHAL_ALLELE_RATIO = 'LETHAL_ALLELE_RATIO',     // 致死基因比例陷阱
    // 生物学拓扑/阈值/约束逻辑陷阱
    DOUBLE_NEGATIVE_TOPOLOGY = 'DOUBLE_NEGATIVE_TOPOLOGY',   // 双重否定调控陷阱
    HYSTERESIS_THRESHOLD = 'HYSTERESIS_THRESHOLD',           // 迟滞性阈值陷阱
    NECESSITY_SUFFICIENCY = 'NECESSITY_SUFFICIENCY',          // 充分性/必要性混淆陷阱
    // 物理学量子力学专用陷阱
    QUANTUM_OPERATOR_CONFUSION = 'QUANTUM_OPERATOR_CONFUSION',   // 算符对易性/混淆陷阱
    QUANTUM_BASIS_SELECTION = 'QUANTUM_BASIS_SELECTION',           // 基底选择/表象陷阱
    QUANTUM_NUMBER_COUPLING = 'QUANTUM_NUMBER_COUPLING',          // 量子数耦合表象陷阱
    // 量化金融专用陷阱
    MEASURE_CHANGE_CONFUSION = 'MEASURE_CHANGE_CONFUSION',       // 测度变换/计价单位混淆陷阱
    DISCOUNT_RATE_MISMATCH = 'DISCOUNT_RATE_MISMATCH',           // 现金流口径与折现率错配陷阱
    COMPOUNDING_CONVENTION = 'COMPOUNDING_CONVENTION',           // 复利约定与天数惯例陷阱
    VOLATILITY_LAYER_CONFUSION = 'VOLATILITY_LAYER_CONFUSION',   // 隐含/局部/瞬时波动率混淆陷阱
    TAIL_MOMENT_NONEXISTENCE = 'TAIL_MOMENT_NONEXISTENCE',       // 重尾分布矩不存在陷阱
    ENDOGENEITY_IDENTIFICATION = 'ENDOGENEITY_IDENTIFICATION',   // 内生性与识别假设陷阱
    ACCOUNTING_POLICY_COMPARABILITY = 'ACCOUNTING_POLICY_COMPARABILITY', // 会计政策口径可比性陷阱
    LEVERAGE_PATH_DEPENDENCE = 'LEVERAGE_PATH_DEPENDENCE',       // 杠杆路径变化下折现率失效陷阱
    QUOTATION_DIRECTION = 'QUOTATION_DIRECTION',                 // 汇率标价方向/基准货币陷阱
}

export interface TrapModification {
    trapType: TrapType;
    agentId: string;
    perturbationType?: MathPerturbationType;
    invalidatedStandardMethod?: string;
    expectedWrongPath?: string;
    divergenceStep?: string;
    manualValidationChecklist?: string[];
    // Chemistry style
    trapModifiedText?: string;
    distractorData?: Record<string, { value: number; unit: string }>;
    // Math style (legacy)
    modifiedFields?: {
        questionBody?: string;
        givenData?: Record<string, { value: number | string; unit: string }>;
        distractorData?: Record<string, { value: number | string; unit: string }>;
        // Biology style
        logicConditions?: Record<string, string>;
        logicDistractors?: Record<string, string>;
        // Finance style
        marketConventions?: Record<string, string>;
        conventionDistractors?: Record<string, string>;
    };
    trapDescription: string;
    expectedConfusion?: string;
}

export interface TrapCluster {
    baseProblemId: string;
    modifications: TrapModification[];
    // Chemistry style
    mergedTrapData?: {
        appliedTraps: TrapType[];
        trapModifiedText: string;
        distractorData: Record<string, { value: number; unit: string }>;
        trapDescriptions: string[];
    };
    // Math style (legacy)
    combinedProblem?: BaseProblem & {
        appliedTraps: TrapType[];
        mergedProblemText?: string;
        distractorData?: Record<string, { value: number | string; unit: string }>;
        // Biology style
        logicDistractors?: Record<string, string>;
        problemType?: BiologyProblemType;
        // Finance style
        conventionDistractors?: Record<string, string>;
        financeProblemType?: FinanceProblemType;
    };
}

// ============= Node 4: Validation =============
export interface ValidationResult {
    isValid: boolean;
    conflicts: string[];
    physicalConstraintsViolated: string[];
    // Chemistry style
    validatedTrapData?: TrapCluster['mergedTrapData'];
    // Math style (legacy)
    isSolvable?: boolean;
    mergedProblem?: TrapCluster['combinedProblem'];
}

// ============= Node 5: Solver =============
export interface SolverResult {
    isValid: boolean;
    requiresMinimumSteps: boolean;
    hasUniqueAnswer: boolean;
    errorMessage?: string;
}

export interface CombinedSolverFormatterResult extends SolverResult {
    formattedSolution?: FormattedSolution;
    sanityCheckResult?: any;
    repairAttempts?: number;
    wasProblemRepaired?: boolean;
}

// ============= Node 6: Solution Format =============
export interface FormattedSolution {
    problemId: string;
    reasoningChain: {
        stepNumber: number;
        description: string;
        justification: string;
        trapAvoidanceNote?: string;
    }[];
    finalAnswer: string;
    keyInsights: string[];
    standardSafeSolutionText?: string;
    caseAnalysis?: string[];
}

// ============= Node 7: Final Output =============
export interface FinalProblem {
    problemId: string;
    subject: Subject;
    topic: string;
    scenario?: string;
    /** 出题角度/考法维度（材料学等流程使用） */
    questionAngle?: string;
    // Chemistry style fields
    trapCount?: number;
    originalProblemText?: string;
    referenceSteps?: string[];
    trapModifiedText?: string;
    standardSafeSolution?: string;
    /** 生物 V2 等流程：避坑安全解答对应的步骤列表 reference，格式：1.xxx;2.xxx... */
    solutionReference?: string;
    coreData?: CoreDataRecord;
    distractorData?: Record<string, { value: number; unit: string }>;
    // Math style fields
    difficulty?: string;
    questionBody?: string;
    givenData?: Record<string, { value: number | string; unit: string }>;
    mergedProblemText?: string;
    solution?: FormattedSolution;
    // Biology style fields
    problemType?: BiologyProblemType;
    logicConditions?: Record<string, string>;
    logicDistractors?: Record<string, string>;
    // Finance style fields
    financeProblemType?: FinanceProblemType;
    financeReasoningType?: FinanceReasoningType;
    marketConventions?: Record<string, string>;
    conventionDistractors?: Record<string, string>;
    // Common
    finalAnswer: string;
    knowledgePointIds?: string[];
    qualityLevel?: "verified" | "degraded";  // V2: 审查质量标记
    metadata: {
        appliedTraps: TrapType[];
        trapDescriptions: string[];
        generatedAt: string;
        nodeExecutionTime: Record<string, number>;
        reviewResult?: string;  // 审查结果（数学/生物用）
        modelInfo?: string;  // 使用的模型
        perturbationType?: MathPerturbationType;
        disciplineKey?: string;
        disciplineName?: string;
        difficultyLevel?: string;
        validationRules?: MathValidationRules;
        predictedFailureMode?: string;
        expectedWrongPath?: string;
        divergenceStep?: string;
        manualValidationChecklist?: string[];
        qualityLabel?: "manual_validation_ready" | "needs_rework" | "invalid";
        // Math-specific fields
        normalizeResult?: {
            originalInput: string;
            matchedKey?: string;
            matchedName?: string;
            confidence: number;
            message?: string;
        };
        tokenUsageByNode?: Record<string, unknown>;
        retryNodeHistory?: { node: number; reason: string }[];
        reviewerResult?: 0 | 1;
        reviewerFailureReason?: string;
        l2Key?: string;
        l2Name?: string;
        l2OriginalInput?: string;
        l2RoutingEvidence?: {
            disciplineKey: string;
            disciplineName: string;
            matchInput: string;
            matchMethod: "exact_key" | "exact_name" | "alias" | "fallback";
            matchedAlias: string;
            fallbackUsed: boolean;
        };
        l2RuleVersion?: string;
        l2RuleSnapshot?: {
            peak_difficulty: string;
            forbidden_errors: string[];
            parameter_constraints: Record<string, string>;
            anti_pattern_strategies: string[];
            v2_strategies: string[];
            v2_constraints: string[];
        };
        l2RoutingVerified?: "unverified" | "verified" | "invalid";
        l2RuleViolation?: string[];
        l2RuleEffective?: "unverified" | "effective" | "ineffective" | "harmful";
    };
}

// ============= Workflow State =============
export enum MultiNodeStage {
    IDLE = 'IDLE',
    NODE_0_INPUT = 'NODE_0_INPUT',
    NODE_1_RAG = 'NODE_1_RAG',
    NODE_2_BASE_GEN = 'NODE_2_BASE_GEN',
    NODE_3_TRAPS = 'NODE_3_TRAPS',
    NODE_4_VALIDATION = 'NODE_4_VALIDATION',
    NODE_5_SOLVING = 'NODE_5_SOLVING',
    NODE_6_FORMATTING = 'NODE_6_FORMATTING',
    NODE_7_OUTPUT = 'NODE_7_OUTPUT',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR'
}

export interface MultiNodeWorkflowState {
    stage: MultiNodeStage;
    currentProblemIndex: number;
    totalProblems: number;
    baseProblems: BaseProblem[];
    trapClusters: TrapCluster[];
    finalProblems: FinalProblem[];
    error: string | null;
    retryCount: number;
}

// ============= Orchestrator =============
export interface OrchestratorCallbacks {
    onStageChange?: (stage: MultiNodeStage, problemIndex: number) => void;
    onProgress?: (current: number, total: number) => void;
    onError?: (error: string) => void;
    onProblemGenerated?: (problem: FinalProblem, index: number) => Promise<void>;
}

export interface BatchModeConfig {
    mode: 'batch';
    knowledgePointIds: string[];
    difficultyFilter?: (1 | 2 | 3 | 4 | 5)[];
    concurrencyLimit?: number;
}
