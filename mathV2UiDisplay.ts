type StageDisplayContext = {
  subject?: string;
  useNewPipeline?: boolean;
};

type ProblemBadgeInput = {
  subject?: string;
  metadata?: Record<string, unknown>;
};

const DEFAULT_STAGE_LABELS: Record<string, string> = {
  IDLE: '待命',
  NODE_0_INPUT: '节点0: 输入验证',
  NODE_1_RAG: '节点1: 知识库查询',
  NODE_2_BASE_GEN: '节点2: 生成基础题',
  NODE_3_TRAPS: '节点3: 陷阱注入',
  NODE_4_VALIDATION: '节点4: 一致性校验',
  NODE_5_SOLVING: '节点5: 防伪审查与求解',
  NODE_7_OUTPUT: '节点7: 最终组装',
  COMPLETED: '完成',
  ERROR: '错误',
};

const MATH_V2_STAGE_LABELS: Record<string, string> = {
  NODE_1_RAG: '节点1: 知识点分析',
  NODE_2_BASE_GEN: '节点2: 生题 + 答案',
  NODE_3_TRAPS: '节点3: 审查 / 修复',
  NODE_4_VALIDATION: '节点4: 盲解',
  NODE_5_SOLVING: '节点5: 答案对比',
  NODE_7_OUTPUT: '节点7: 整理输出',
};

export function getStageDisplay(stage: string, context: StageDisplayContext = {}): string {
  // 金融 V2 与数学 V2 共用同一套 A0→A5 节点语义，默认标签里的"陷阱注入"会误导
  if ((context.subject === 'math' || context.subject === 'finance') && context.useNewPipeline && MATH_V2_STAGE_LABELS[stage]) {
    return MATH_V2_STAGE_LABELS[stage];
  }
  return DEFAULT_STAGE_LABELS[stage] || stage;
}

export function isMathV2Problem(problem: ProblemBadgeInput): boolean {
  return problem.subject === 'math' && Boolean(problem.metadata?.mathCategory);
}

export function getProblemBadgeVisibility(problem: ProblemBadgeInput): { showDifficulty: boolean; showTrace: boolean } {
  const hideMathV2Badges = isMathV2Problem(problem);
  return {
    showDifficulty: !hideMathV2Badges,
    showTrace: !hideMathV2Badges,
  };
}
