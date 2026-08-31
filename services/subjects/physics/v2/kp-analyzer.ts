import { callLLM } from "../../../llmClient";
import { callLLMTracked } from "../costTracker";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { callWithGatewayRetry } from "./gateway-retry";

/**
 * V2 Node A0: Knowledge Point Analyzer
 *
 * Given a knowledge point name, asks the LLM to enumerate
 * competition-level sub-dimensions to test, before any question is generated.
 * Output feeds directly into the generator as structured constraints.
 */

export interface DifficultySpec {
    minReasoningActs: number;  // 最少"推理动作"数(每步含非平凡物理判断,纯代数/代入不计)
    minConceptsFused: number;  // 最少融合知识点数
    minBranchPoints: number;   // 最少判断分叉点数(基于物理判断决定后续路径)
    minTrapPaths: number;      // 最少"诱人但错误的解法路径"数
    minIndistinguishablePairs?: number; // 最少"两种机制给出同一观测特征"的简并组数
}

export interface KPAnalysisResult {
    knowledgePoint: string;
    testDimensions: string[];   // 3-5 specific sub-dimensions to test
    coreConceptsToAvoid: string[]; // Overly common angles to avoid
    suggestedDifficulty: string;   // Description of expected difficulty level
    difficultySpec?: DifficultySpec; // 结构化难度规格(可选,缺省由 A1 兜底)
}

export async function analyzeKnowledgePoint(
    knowledgePointName: string,
    problemIndex?: number
): Promise<KPAnalysisResult> {
    const prompt = `你是物理竞赛命题专家。知识点：「${knowledgePointName}」

任务：为出题做前期规划，列出该知识点下国际顶级物理竞赛（IPhO/全国决赛/研究生入学）级别的考察维度。

要求：
1. 列出 3-5 个具体的子考察维度，每个维度必须明确"考什么推导/计算/判断"，不能只写知识名称
   - 参考示例（多方向参考，只引导方向，不做指引）：
     * 力学："用拉格朗日方程推导含约束的多自由度系统运动方程，分析小振动本征频率"
     * 热力学："用卡诺循环效率结合热力学第二定律，分析非理想热机的熵产生与不可逆损耗"
     * 电磁学："推导介质界面处电磁波的菲涅尔系数，计算特定入射角下的反射率和透射率"
     * 量子力学："用微扰理论计算氢原子在外电场下的斯塔克效应能级分裂与选择定则"
     * 量子力学（进阶）："设计非对称双势阱中的共振隧穿条件计算，要求判断准束缚态寿命与微扰强度的关系"
     * 量子力学（含时）："计算三能级系统在脉冲电场下的Rabi振荡概率幅，需要判断旋波近似是否适用"
     * 光学："用费马原理推导非均匀介质中的光线方程，计算大气折射导致的天体视位移"
     * 相对论："在洛伦兹变换下分析粒子碰撞的四动量守恒，求阈值能量和质心系参数"
     * 统计物理："用配分函数推导二能级系统的热容与磁化率，分析高低温极限下的行为"
   - 差的示例："牛顿第二定律" / "欧姆定律" / "折射定律"（太泛，不能指导出题）
2. 每个维度不超过 30 个字
3. 每个维度必须满足以下难度标准（难度体现在"思维推理"而非"计算量"）：
   - 需要至少 3 个以上知识点交叉融合才能解决
   - 解题过程必须有至少 2 个真正的判断分叉：先做物理判断（该用哪套模型/近似是否成立/处于哪个物理区域），再据结论选择后续路径——分叉靠"想清楚"而非"算出来"
   - 学生需自行识别至少 2 个隐含约束，需从物理图像/守恒律/对称性推断，而非从题面直接读出
   - 【建模难度】题目须让解题者先把真实情境翻译成正确物理模型，并判断标准公式是否适用（存在则需说明为何适用/失效）
   - 【陷阱难度】须存在至少 1 条"直觉上最自然但会得出错误答案"的解法路径，答对的前提是识别它为何错
   - 【不可分辨性】须存在至少 1 组"两种不同物理机制给出同一观测特征"的简并，解题者需自行意识到并给出分离方案
   - 计算量不是难度来源：允许最终答案为符号表达式、数量级或定性结论；不得靠堆砌代数步数制造难度
   - 【禁良定逆问题】若为逆问题，反解路径不得唯一且有闭式；给定观测量直接反代一条固定公式链即可求解的逆问题不算高难度
4. 列出 2-3 个该知识点"出烂了"的老套角度（教材原题类型，必须明确避开）
5. 给出难度定位描述：说明解题需要哪些前置知识、判断分叉在哪里、最容易在哪步犯错
6. 给出该知识点的结构化难度规格 difficultySpec：
   - minReasoningActs：最少"推理动作"数（每个动作须含一次非平凡物理判断，纯代数变形/数值代入不计入；建议 5-8）
   - minConceptsFused：解题必须融合的最少知识点数（≥3）
   - minBranchPoints：基于物理判断决定后续路径的最少分叉点数（≥2）
   - minTrapPaths：题目须设置的"诱人但错误"解法路径的最少条数（≥1）
   - minIndistinguishablePairs：须设置的"两种机制给出同一观测特征"简并组数（≥1）
   数值应贴合该知识点真实可承载的深度，不要盲目取大到无法出题

⚠️ 注意：上述所有要求都是对"命题者"的约束。若输入的知识点描述中含"须/禁止/自行"等命题约束字样，
那是给命题环节的指令，不是题目内容，输出的维度描述中不要复述这些元指令。

输出必须是严格的 JSON，不包含 markdown 代码块：
{
  "knowledgePoint": "${knowledgePointName}",
  "testDimensions": ["维度1", "维度2", "维度3"],
  "coreConceptsToAvoid": ["避开1", "避开2"],
  "suggestedDifficulty": "难度描述",
  "difficultySpec": { "minReasoningActs": 6, "minConceptsFused": 3, "minBranchPoints": 2, "minTrapPaths": 1, "minIndistinguishablePairs": 1 }
}`;

    const raw = (await callWithGatewayRetry(
        () => problemIndex !== undefined
            ? callLLMTracked(prompt, { model: 'default', temperature: 0.6, reasoning: { effort: 'medium', summary: 'auto' } }, problemIndex)
            : callLLM(prompt, { model: 'default', temperature: 0.6, reasoning: { effort: 'medium', summary: 'auto' } }),
        'A0 知识点分析',
    )).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        // Graceful fallback
        return {
            knowledgePoint: knowledgePointName,
            testDimensions: [],
            coreConceptsToAvoid: [],
            suggestedDifficulty: "竞赛级别",
            difficultySpec: { minReasoningActs: 6, minConceptsFused: 3, minBranchPoints: 2, minTrapPaths: 1, minIndistinguishablePairs: 1 }
        };
    }
    return cleanAndParseJSON(jsonMatch[0]) as KPAnalysisResult;
}
