import { callLLMTracked } from "../costTracker";
import { getDisciplineGuidance, getPeakDifficulty, getMatchedStandardTables, getMatchedCriterionBranches } from "../disciplines";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import type { MechanicalQuestionType } from "../../../../types/multiNodeTypes";
import type { MechanicalDifficultyLevel } from "./difficulty";

/**
 * Mechanical V2 — A0 知识点分析器
 *
 * 结构对齐 materials/v2/kp-analyzer.ts，但考察维度的评价口径按机械重写：
 * 机械题的深度不来自"公式多"，而来自四类结构——
 *   ① 判据分叉（选错分支即改答案）
 *   ② 离散系列/手册选行（在多行中选对哪一行属判断层，算完整步数）
 *   ③ 圆整回代（圆整后派生量必须全部重算）
 *   ④ governing 项判定（多项校核必须显式取最不利者，可行集允许为空）
 * 维度若不含上述任一结构，即为"正向公式链"，实测有效率 0%，必须重写。
 */

export interface MechanicalKPAnalysisResult {
    knowledgePoint: string;
    testDimensions: string[];
    coreConceptsToAvoid: string[];
    suggestedDifficulty: string;
    difficultyLevel: MechanicalDifficultyLevel;
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

// ⚠️ 与 difficulty.ts / generator.ts / reviewer.ts 的三档定义对齐：
// 分档依据是**题眼隐蔽度（错法自洽性）**，不是步数体量。步数区间统一为 4-6 / 5-8 / 6-10。
// 这一层是 A0 列考察维度时看的口径 —— 若这里还写"12 步以上"，A0 就会按体量去构思维度，
// 后面 A1 再怎么压清单也压不住（实测踩过：A0 的 testDimensions 一条塞进 KA/KV/KHβ/KHα/ZN/YN/KR
// 七个查表量 + 圆整回代 + 双准则，A1 只能照着摊成 30 项清单）。
const DEFAULT_DIFFICULTY_TEXT: Record<MechanicalDifficultyLevel, string> = {
    standard: '机械设计课程设计级别，4-6 步相互依赖的计算，含一处判据分叉（错选会当场露馅）、至少一次查表选行与一次圆整回代',
    hard: '注册机械工程师/考研压轴级别，5-8 步计算，含一处**错法自洽**的判据分叉：错选之后照样算出一个像样的数、还能自圆其说',
    peak: '工程院选型闭环级别，6-10 步计算，**两处自洽错法联动**（第一处错选会改变第二处取值），离散目录夹逼下判定可行集（允许为空），并指出唯一的放松方向',
};

/** 各档位对"考察维度"本身的深度约束；顶级档注入 peak_difficulty 全文 */
function buildDifficultyDirective(difficultyLevel: MechanicalDifficultyLevel, peakDifficulty: string): string {
    if (difficultyLevel === 'peak') {
        return `【难度档位：顶级（选型闭环级）⚠️ 本批次这道题必须达到该深度】
你列出的考察维度必须**直接对齐**以下"难度天花板"：

${peakDifficulty || '（该方向未提供难度天花板描述，请自行按选型闭环级深度设计）'}

维度设计硬性要求：
1. 必须存在**两处自洽错法且互相联动**：第一处错选会改变第二处的取值。自洽=错选后照样算出个像样的数、能自圆其说。
2. 必须是**设计/选型闭环**而非单向校核：由载荷反解尺寸 → 圆整到标准系列/目录型号 → 回代重查全部派生量 → 多准则校核 → 判定 governing 项。
3. 必须存在**离散候选集夹逼**：多条约束同时作用于标准系列或目录型号，使可行集只剩极少数、甚至为空。可行集为空是合法且更好的正解。
4. **6-10 步即可，不要靠堆量凑深度**：与两处题眼无关的正向量（传动比、转矩、齿数、分度圆、中心距、切向力等）应当直接作为已知给出，别列进维度。
5. 禁止任何本科教材例题能直接找到原型的维度。`;
    }
    if (difficultyLevel === 'hard') {
        return `【难度档位：困难 ⚠️ 本批次这道题必须达到该深度】
维度设计硬性要求：
1. 每个维度必须存在**一处判据分叉，且错法自洽**——须先判断用哪条准则/哪个模型/哪一行表值，**选错之后照样能算出一个像样的数、还能自圆其说**（光看答卷分不出对错）。若错选会当场露馅（量纲不对/算不下去/结论荒谬），那只到标准档。
2. 若用两条独立失效准则并行（接触与弯曲、寿命与静强度、簧圈与钩部），其价值在于"取最严者"是可判分落点，**不是为了把维度变长**。
3. 必须含至少一次圆整回代，且圆整后有派生量真实改变。
4. **5-8 步即可**：与题眼无关的正向量应作为已知给出，不列进维度。查表量不要一次塞进七八个——每多一个都是噪声通道，会把题眼的信号淹掉。
5. 不能是单条公式一路代入即可完成的维度。`;
    }
    return `【难度档位：标准】
维度设计要求：
1. 每个维度需要 4-6 步相互依赖的计算，不能是单步代入。
2. 必须含一处判据分叉/选行判断（错选会当场露馅即可，不要求自洽）。
3. 至少含一次手册/标准系列选行取值，以及一次圆整后的回代重算。
4. 属机械设计课程设计难度；**与题眼无关的正向量应作为已知给出，不列进维度**。`;
}

function fallbackDimensions(kp: string): string[] {
    return [
        `${kp}：由给定工况反解主要尺寸，圆整到标准系列后回代重算全部派生量并校核`,
        `${kp}：两条独立失效准则分别校核并判定 governing 项（结论取最不利者）`,
        `${kp}：在离散候选集（标准系列/目录型号）中判定可行集，允许结论为"无可行方案"`,
    ];
}

function fallbackShortAnswerDimensions(kp: string): string[] {
    return [
        `${kp}：不同判据/模型的适用边界对比及工程选择依据`,
        `${kp}：失效机理与 governing 项如何随工况迁移`,
        `${kp}：手册表值的取用口径差异及取错后的后果分析`,
    ];
}

function fallbackMixedDimensions(kp: string): string[] {
    return [
        `${kp}：定量完成一次选型与校核（计算小问）`,
        `${kp}：说明该结论由哪种失效模式控制及其物理原因（论述小问）`,
        `${kp}：若某一约束放松，可行集如何变化（论述小问）`,
    ];
}

function normalizeKPAnalysis(
    parsed: Partial<MechanicalKPAnalysisResult>,
    fallbackKP: string,
    questionType: MechanicalQuestionType = 'calculation',
    difficultyLevel: MechanicalDifficultyLevel = 'standard'
): MechanicalKPAnalysisResult {
    const isShortAnswer = questionType === 'short-answer';
    const isMixed = questionType === 'mixed';
    const result: MechanicalKPAnalysisResult = {
        knowledgePoint: String(parsed.knowledgePoint || fallbackKP),
        testDimensions: normalizeStringArray(parsed.testDimensions),
        coreConceptsToAvoid: normalizeStringArray(parsed.coreConceptsToAvoid),
        suggestedDifficulty: String(parsed.suggestedDifficulty || DEFAULT_DIFFICULTY_TEXT[difficultyLevel]),
        difficultyLevel,
    };
    if (result.testDimensions.length === 0) {
        result.testDimensions = isMixed
            ? fallbackMixedDimensions(fallbackKP)
            : isShortAnswer
            ? fallbackShortAnswerDimensions(fallbackKP)
            : fallbackDimensions(fallbackKP);
    }
    if (result.coreConceptsToAvoid.length === 0) {
        result.coreConceptsToAvoid = isShortAnswer
            ? ['纯定义复述', '罗列公式无适用边界讨论', '不涉及失效机理']
            : isMixed
            ? ['各小问相互独立毫无关联', '计算与论述不在同一台机器/同一情境', '论述沦为定义复述']
            : ['正向公式链（题面已给全系数只需代入）', '单一准则单次校核无 governing 判定', '不含圆整或圆整后不回代'];
    }
    if (difficultyLevel !== 'standard') {
        const extra = difficultyLevel === 'peak'
            ? ['教材例题的换数搬用', '连续解不圆整到标准系列', '预设可行集非空（不允许"无可行方案"的结论）']
            : ['只校核一条准则就下结论', '手册量直接写在题面（跳过选行判断）'];
        for (const item of extra) {
            if (!result.coreConceptsToAvoid.includes(item)) result.coreConceptsToAvoid.push(item);
        }
    }
    return result;
}

export async function analyzeKnowledgePoint(
    knowledgePointName: string,
    problemIndex: number = 0,
    questionType: MechanicalQuestionType = 'calculation',
    difficultyLevel: MechanicalDifficultyLevel = 'standard'
): Promise<MechanicalKPAnalysisResult> {
    const disciplineGuidance = getDisciplineGuidance(knowledgePointName);
    const peakDifficulty = getPeakDifficulty(knowledgePointName);
    const difficultyDirective = buildDifficultyDirective(difficultyLevel, peakDifficulty);
    const standardTables = getMatchedStandardTables(knowledgePointName);
    const criterionBranches = getMatchedCriterionBranches(knowledgePointName);

    const structureBlock = `【机械题深度的四类来源（维度必须至少命中其中两类，否则视为无效维度）】
① 判据分叉——先判断该用哪条准则/哪个模型/哪一行表值，选错即改答案${criterionBranches.length ? `\n   本方向已知分叉点：\n${criterionBranches.map(s => `   - ${s}`).join('\n')}` : ''}
② 离散选行——标准系列与手册目录只有离散值；查表取值本身算 0 步，但"在多行中选对哪一行"属判断层，算完整步数${standardTables.length ? `\n   本方向涉及的表：\n${standardTables.map(s => `   - ${s}`).join('\n')}` : ''}
③ 圆整回代——圆整后所有派生量必须用圆整值重算，且回代应真实改变某个结论
④ governing 判定——多项校核必须显式比较并取最不利者；可行集允许为空`;

    const isShortAnswer = questionType === 'short-answer';
    const isMixed = questionType === 'mixed';

    const commonHead = `你是机械设计领域的资深命题专家（机械设计手册与 Shigley 体系皆熟）。请为以下方向做 A0 分析规划。

【知识点方向】：${knowledgePointName}

【学科特征参考】：
${disciplineGuidance}

${structureBlock}

${difficultyDirective}`;

    const jsonSpec = `输出严格 JSON，不含 markdown：
{
  "knowledgePoint": "${knowledgePointName}",
  "testDimensions": ["维度1：具体描述", "维度2：具体描述"],
  "coreConceptsToAvoid": ["避开项1", "避开项2"],
  "suggestedDifficulty": "难度定位描述"
}`;

    const prompt = isMixed
        ? `${commonHead}

【任务】：列出适合出 **混合题（计算+论述小问）** 的考察维度。混合题要求：
- 同一台机器/同一工况下，先定量完成选型或校核，再基于计算结果论述失效机理或工程含义
- 论述小问必须依赖计算小问的结果（如"说明为何 governing 项落在钩部而非簧圈"），不得各自为政

要求：
1. 给出 3-5 个具体考察维度，每个一句话说明情境与考察焦点。维度之间不得大面积重叠。
2. 列出 2-3 个必须避开的低质量角度。
3. 给出难度定位：计算与论述的占比、易错点、需要的知识关联跨度。

${jsonSpec}`
        : isShortAnswer
        ? `${commonHead}

【任务】：列出适合出 **简答题/论述题** 的考察维度。每个维度必须具体到能出一道有深度的论述题。

要求：
1. 给出 3-5 个具体考察维度（如"对比接触疲劳与弯曲疲劳在软/硬齿面上谁成为 governing 项及其原因"、"说明成对安装轴承压紧端判定错误会如何传播到寿命结论"）。维度之间不得大面积重叠。
2. 列出 2-3 个必须避开的低质量角度（纯定义复述、罗列公式不谈适用边界、不涉及失效机理）。
3. 给出难度定位：核心考察深度与知识关联跨度。

${jsonSpec}`
        : `${commonHead}

【任务】：列出适合出 **计算题** 的考察维度。每个维度必须具体到能出一道完整的设计/校核题。

要求：
1. 给出 3-5 个具体考察维度，每个一句话说明要算什么、在哪里分叉、哪个量需要圆整回代（如"由传递功率反解模数并圆整到第一系列，回代后节线速度跨过精度等级分界使动载系数改变，再以接触与弯曲双准则判定 governing 项"）。维度之间不得大面积重叠。
2. 列出 2-3 个必须避开的低防御角度（正向公式链、单准则单次校核、题面已给全部手册值）。
3. 给出难度定位：核心判断分叉点、易错点、前置知识跨度。

${jsonSpec}`;

    try {
        const raw = (await callLLMTracked(prompt, {
            model: 'default',
            temperature: 0.6,
            responseFormat: 'json',
            systemPrompt: '你是机械设计命题规划专家，只输出严格 JSON。',
        }, problemIndex, 'a0_kp_analysis')).trim();

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return normalizeKPAnalysis({}, knowledgePointName, questionType, difficultyLevel);
        }
        return normalizeKPAnalysis(
            cleanAndParseJSON(jsonMatch[0]) as Partial<MechanicalKPAnalysisResult>,
            knowledgePointName,
            questionType,
            difficultyLevel
        );
    } catch (error) {
        console.error("Mechanical V2 A0 Error:", error);
        return normalizeKPAnalysis({}, knowledgePointName, questionType, difficultyLevel);
    }
}
