import { callLLM } from '../../../llmClient';
import { cleanAndParseJSON } from '../../../utils/jsonCleaner';
import type { BiologyV2Draft } from './generator';
import type { BiologyProblemType } from '../../../../types/multiNodeTypes';

/**
 * Biology V2 Node A4: Blind Solver
 *
 * 完全新鲜的 LLM 上下文，只看到题目正文，不知道参考答案。
 * 按题型选取对应的解题框架，产出独立解答。
 *
 * 题型专属解题路径：
 * - calculation         : 守恒/计量逻辑，逐步列式代入
 * - genetic-reasoning   : 系谱分析标准路径（显隐性→遗传方式→亲本基因型→后代概率）
 * - network-reasoning   : 图遍历（从扰动点开始追踪激活/抑制链，注意双重否定）
 * - threshold-reasoning : 阈值门控（确认当前状态→比较信号与阈值→判断状态转换）
 * - structural-reasoning: 结构约束（识别关键结构要素→分析突变/修饰影响→推导功能变化）
 */

export interface BiologyBlindSolverResult {
  blindAnswer: string;      // 完整分步独立解答
  blindFinalAnswer: string; // 最终答案（一句话）
  isSolvable: boolean;
  failReason?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 各题型的解题路径提示（注入给 blind solver，但不含参考答案）
// ─────────────────────────────────────────────────────────────────────────────

// ─── V1 hints (deprecated): 逐题型点名了关键生物学机制，盲解模型看到后会直接绕过 AI专项陷阱
// const SOLVER_PATH_HINTS_V1: Record<BiologyProblemType, string> = {
//   'calculation': `...1.识别所有已知量及其单位 2.确定所需的生物学原理/公式
//     3.判断是否需要近似处理（如稳态假设、林德曼效率范围）4.逐步列式代入，追踪单位
//     5.得出最终答案并验证数量级合理性`,
//   'genetic-reasoning': `...2.判断遗传方式（常染色体/X连锁：看雌雄后代是否有差异；细胞质：看正反交是否有差异）...`,
//   'network-reasoning': `...4.注意双重否定（两个抑制 = 激活）和 AND/OR 门...`,
//   'threshold-reasoning': `...4.若有迟滞：激活后降低到 θ_on 以下但高于 θ_off，系统仍维持激活状态...`,
//   'structural-reasoning': `...1.识别突变/修饰位点的结构特征（在功能区/非功能区？）...`,
// };

const SOLVER_PATH_HINTS: Record<BiologyProblemType, string> = {
  'calculation':
    `解题路径框架（参考，不强制）：
1. 列出所有已知量，确认每个量的精确生物学定义（相似名称的量可能有本质区别）
2. 确定解题所需原理/方程，先验证其适用条件是否在题目给定参数范围内成立，再代入使用
3. 按推导顺序列式，保留中间量的完整表达式并追踪单位换算
4. 若最终目标是判定、选择、归因、可行性或异常解释，先找出唯一主判定变量，再把它与观测值、阈值或候选窗口比较；不要用多个辅助中间量直接语义投票
5. 若存在多个候选方案或机制，必须说明候选集合如何随推理分叉逐步收缩或翻转：先判断哪条边界决定进入哪组候选，再用后续判别量排除剩余候选；不要把所有约束并列成表格后直接筛选
6. 得出最终答案，验证数量级和单位的合理性
6. 检查所有给定参数是否都已用到；若有未使用参数，说明其为陷阱参数及唯一弃用原因`,

  'genetic-reasoning':
    `解题路径框架（参考，不强制）：
1. 对每组杂交实验，逐一记录后代各表现型的比例
2. 判断显隐性和遗传方式时，须检验所有给出的杂交组合——相同的后代比例可能来自不同遗传机制
3. 对每种可能的遗传方式假说，用全部杂交数据逐一验证
4. 排除所有不能解释全部数据的假说，确认唯一成立的解释
5. 写出最终结论，说明排除了哪些竞争假说及其排除依据`,

  'network-reasoning':
    `解题路径框架（参考，不强制）：
1. 列出所有节点的初始状态，标注每条边的调控方向（激活/抑制）
2. 对每个汇聚节点，确认其被激活所需的全部前提条件（不同节点的激活逻辑可能不同）
3. 从扰动点出发逐步追踪信号传播，每一步明确写出推理依据
4. 对从扰动点出发可能影响输出节点的所有路径，独立追踪后汇总各路径的综合影响
5. 写出输出节点的最终状态，明确引用决定该结论的逻辑依据`,

  'threshold-reasoning':
    `解题路径框架（参考，不强制）：
1. 读取题目中所有阈值参数，明确每个参数的含义（可能有多个不同用途的阈值）
2. 明确系统的初始状态（题干应有显式声明）
3. 按时序逐步分析每次刺激事件；注意：同一强度的刺激在系统处于不同历史状态时，可能产生不同的响应
4. 综合系统经历的完整刺激历史推断最终状态，不能仅依据最后一次刺激强度得出结论
5. 写出最终状态，明确说明依赖了哪些阈值条件和历史信息`,

  'structural-reasoning':
    `解题路径框架（参考，不强制）：
1. 确认突变/修饰的类型，记录其所在位置的结构上下文
2. 分析该位置的结构约束：功能是否依赖于该位置的精确物理化学特性（空间几何、电荷、疏水性）
3. 推断突变/修饰对局部构象的影响；若题目涉及多个突变，注意它们之间可能存在相互作用
4. 推导构象变化对蛋白功能的最终影响，考虑所有可能的效应类型（不限于直接的酶活改变）
5. 结合题目给定实验条件验证推断方向；若题目提供了实验数据，从数据特征反推机制`,
};

function extractBalancedJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
      if (depth < 0) return null;
    }
  }

  return null;
}

function extractJsonCandidate(raw: string): string | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    const fromFence = extractBalancedJsonObject(fenced[1]);
    if (fromFence) return fromFence;
  }

  const direct = extractBalancedJsonObject(raw);
  if (direct) return direct;

  const greedy = raw.match(/\{[\s\S]*\}/);
  return greedy?.[0] ?? null;
}

function normalizeBlindSolverResult(parsed: any): BiologyBlindSolverResult {
  return {
    isSolvable: Boolean(parsed?.isSolvable),
    failReason: typeof parsed?.failReason === 'string' ? parsed.failReason : '',
    blindAnswer: typeof parsed?.blindAnswer === 'string' ? parsed.blindAnswer : '',
    blindFinalAnswer: typeof parsed?.blindFinalAnswer === 'string' ? parsed.blindFinalAnswer : '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 主入口
// ─────────────────────────────────────────────────────────────────────────────

export async function solveBiologyBlind(
  draft: BiologyV2Draft,
  model: string = 'reasoning',
): Promise<BiologyBlindSolverResult> {
  const problemType = draft.problemType;
  const solverHint = SOLVER_PATH_HINTS[problemType] ?? SOLVER_PATH_HINTS['calculation'];

  const conditionBlock =
    draft.logicConditions && Object.keys(draft.logicConditions).length > 0
      ? '\n【已知条件】：\n' + Object.entries(draft.logicConditions).map(([k, v]) => `  - ${k}：${v}`).join('\n')
      : '';

  const dataBlock =
    draft.givenData && Object.keys(draft.givenData).length > 0
      ? '\n【已知数据】：\n' + Object.entries(draft.givenData).map(([k, v]) => `  - ${k}：${(v as any).value} ${(v as any).unit ?? ''}`).join('\n')
      : '';

  const prompt = `你是顶级生物学专家。请独立解答以下题目，不借助任何外部提示或参考答案。

【题型】：${problemType}
【题目正文】：
${draft.questionText}
${conditionBlock}
${dataBlock}
【求解目标】：${draft.requiredAnswer}

${solverHint}

解题要求：
1. 从题目文字出发，逐步推导，每步写出明确的推理依据或公式
2. 不能只写思路，必须有具体推导过程
3. 给出最终答案（推理题给出唯一结论；计算题按题目目标给出唯一数值/范围/中间闭合量/表达式或公式，数值或范围需带单位，表达式/公式需说明变量定义和适用条件）
4. 如果题目存在逻辑问题无法求解，说明具体原因

输出必须是严格 JSON，不含 markdown 代码块：
{
  "isSolvable": true 或 false,
  "failReason": "若无法求解说明原因，否则为空字符串",
  "blindAnswer": "完整分步解答过程（含推理依据）",
  "blindFinalAnswer": "最终答案（一句话）"
}`;

  const baseSystemPrompt = `你是生物学专家，正在独立解答一道${problemType}题目。请完全从题目条件出发，给出严谨的逐步推导，最后按 JSON 格式输出。`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const strictSuffix = attempt === 0
      ? ''
      : '\n\n【最后警告】你上一次输出未能被程序解析。现在你必须只输出一个 JSON 对象，禁止任何解释文字、前后缀或代码块。';

    const raw = (await callLLM(prompt + strictSuffix, {
      model,
      temperature: 0.1,
      responseFormat: 'json',
      systemPrompt: baseSystemPrompt + (attempt === 0
        ? ''
        : ' 你必须只输出单个 JSON 对象，不得输出任何额外文本。'),
    })).trim();

    const jsonCandidate = extractJsonCandidate(raw);
    if (!jsonCandidate) {
      console.warn(`[BioV2 BlindSolver] no JSON object found (attempt=${attempt + 1}), raw snippet:`, raw.slice(0, 400));
      if (attempt === 0) continue;
      return {
        isSolvable: false,
        blindAnswer: '',
        blindFinalAnswer: '',
        failReason: 'Failed to parse blind solver response: no JSON object found',
      };
    }

    try {
      const parsed = cleanAndParseJSON(jsonCandidate);
      return normalizeBlindSolverResult(parsed);
    } catch (err) {
      console.warn(`[BioV2 BlindSolver] JSON parse failed (attempt=${attempt + 1}), candidate snippet:`, jsonCandidate.slice(0, 400));
      console.warn('[BioV2 BlindSolver] Raw response snippet:', raw.slice(0, 400));
      if (attempt === 0) continue;
      return {
        isSolvable: false,
        blindAnswer: '',
        blindFinalAnswer: '',
        failReason: 'Failed to parse blind solver response: invalid JSON structure',
      };
    }
  }

  return {
    isSolvable: false,
    blindAnswer: '',
    blindFinalAnswer: '',
    failReason: 'Failed to parse blind solver response: exhausted retries',
  };
}
