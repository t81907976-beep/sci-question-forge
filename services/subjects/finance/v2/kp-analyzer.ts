import { callLLM } from "../../../llmClient";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { selectFinanceRules, formatFinanceRulesForPrompt } from "./rule-matcher";

/**
 * V2 Node A0 (finance): Knowledge Point Analyzer
 *
 * 目标不是埋陷阱，而是把考察维度直接规划到博士级深度：
 * 每个维度都要求先做模型/口径适用域判定，再完成多概念交叉的多步推导。
 */

export interface KPAnalysisResult {
    knowledgePoint: string;
    testDimensions: string[];
    coreConceptsToAvoid: string[];
    suggestedDifficulty: string;
}

const FALLBACK_DIMENSIONS = [
    "先判定适用测度或口径归属，再完成跨概念的多步定价推导",
    "由市场数据反演隐含参数并检验其无套利可行域",
    "区分名义/实际、隐含/瞬时、表观/本征等易混量并校正路径",
];

const FALLBACK_AVOID = [
    "单一公式一步代入的计算题",
    "教材标准例题改数值",
    "题面直接给出应由解题者判定的模型或口径",
    "只需查表后乘系数即可完成的题",
    "概念背诵型问答",
];

function fallbackAnalysis(knowledgePointName: string): KPAnalysisResult {
    return {
        knowledgePoint: knowledgePointName,
        testDimensions: FALLBACK_DIMENSIONS,
        coreConceptsToAvoid: FALLBACK_AVOID,
        suggestedDifficulty: "博士资格考级别：须先判定模型适用域或测度/口径归属，再联立至少两个概念完成多步推导，且判定错误会改变数值量级或结论方向。"
    };
}

function normalizeAnalysis(parsed: Partial<KPAnalysisResult>, knowledgePointName: string): KPAnalysisResult {
    const fallback = fallbackAnalysis(knowledgePointName);
    const testDimensions = Array.isArray(parsed.testDimensions)
        ? parsed.testDimensions.map(String).map(s => s.trim()).filter(Boolean)
        : [];
    const coreConceptsToAvoid = Array.isArray(parsed.coreConceptsToAvoid)
        ? parsed.coreConceptsToAvoid.map(String).map(s => s.trim()).filter(Boolean)
        : [];

    return {
        knowledgePoint: String(parsed.knowledgePoint || knowledgePointName),
        testDimensions: testDimensions.length > 0 ? testDimensions : fallback.testDimensions,
        coreConceptsToAvoid: coreConceptsToAvoid.length > 0 ? coreConceptsToAvoid : fallback.coreConceptsToAvoid,
        suggestedDifficulty: String(parsed.suggestedDifficulty || fallback.suggestedDifficulty),
    };
}

export async function analyzeKnowledgePoint(
    knowledgePointName: string
): Promise<KPAnalysisResult> {
    const ruleBlock = formatFinanceRulesForPrompt(
        selectFinanceRules({ node: 'A0', knowledgePoint: knowledgePointName, maxRules: 3 }),
        '【已匹配的规则库动态规划要求】'
    );

    const prompt = `你是量化金融领域的博士后级别专家，同时是 CFA/FRM/精算师资格考试与金融工程博士资格考的命题人。知识点：「${knowledgePointName}」

任务：为出题做前期规划，列出该知识点下**博士资格考/顶刊复现**级别的考察维度。本链路的核心目标是**难度**，不是设置陷阱。

${ruleBlock}要求：
1. 列出 3-5 个具体的子考察维度，每个维度必须明确"考什么推导/计算/判定"，不能只写知识名称
   - 参考示例（多方向参考，只引导方向，不做指引）：
     * 衍生品定价："随机利率且标的与利率相关时换 T-远期测度求漂移修正后定价"
     * 波动率曲面："由报价先检验蝶式/日历价差无套利，再用 Dupire 反演局部波动率"
     * 对冲："分解离散对冲 P&L 的 Gamma 与成本项，求再平衡频率的内点最优"
     * 利率曲线："在 OIS 折现与远期曲线分离下自举，量化单曲线法的系统偏差"
     * 信用："由 CDS 价差反解风险中性违约概率，论证与评级迁移概率的口径差"
     * 公司估值："杠杆逐期变动下比较 APV 与逐期重算 WACC 并交叉验证终值"
     * 计量："由 ADF 与 KPSS 结论方向相反的数据判定平稳性并建立误差修正模型"
     * 因果推断："自行提出识别策略，量化弱工具下 2SLS 的偏误方向与幅度"
     * 寿险精算："由条款唯一确定分数年龄假设后用 Thiele 递归求准备金并分解保费"
     * 非寿险："判定 Pareto 矩存在性后选择 EVT 路径，处理免赔额对频率与强度的双重影响"
     * 风险度量："构造 VaR 不次可加的组合反例并与 TVaR 对比说明一致性公理"
     * 国际金融："在含跨货币基差的报价下判断 CIP 套利是否真实可执行"
     * 财务分析："先将资本化与费用化口径调平，再做跨公司 ROIC 与现金流质量比较"
   - 差的示例："期权定价" / "信用风险" / "财务分析"（太泛，不能指导出题）
2. 每个维度不超过 30 个字；若属于专门模型/方法，必须保留标准术语（如 Girsanov/远期测度/numéraire、Dupire/SABR/Heston、OIS 折现/凸性调整/DV01、危险率/回收率/CVA、FCFF↔WACC/APV/Hamada、ADF/KPSS/协整/GARCH、工具变量/DID/RDD、UDD/Balducci/Thiele、Pareto/GPD/EVT、VaR/TVaR/次可加、CIP/UIP/quanto、三表联动/ROIC 等），方便后续节点继续命中动态规则
3. 每个维度必须满足以下难度标准：
   - 解题链有 ≥5 个相互依赖的实质步骤（前一步输出是后一步输入，不是并列小问）
   - 必须存在"判定后才知道走哪条路"的模型/口径适用域判断，且判错会改变数值量级或结论方向
   - 解题者需自行识别至少一个隐含约束或前提，而不是从题面直接读出全部条件
   - 必须包含至少一个易混量或基准：名义vs实际、隐含vs局部vs瞬时波动率、风险中性vs真实世界概率、FCFF vs FCFE、企业价值vs股权价值、独立减因率vs从属减因率、面值加权vs市值加权等
   - 禁止规划出可由单一公式一步代入、或查表后乘一个系数即可完成的维度
4. 列出 2-3 个该知识点"出烂了"的老套角度（教材原题类型，必须明确避开）
5. 给出难度定位描述：说明解题需要哪些前置知识、判定分叉在哪里、最容易在哪步犯错、哪个前提不能写进题面

输出必须是严格的 JSON，不包含 markdown 代码块：
{
  "knowledgePoint": "${knowledgePointName}",
  "testDimensions": ["维度1", "维度2", "维度3"],
  "coreConceptsToAvoid": ["避开1", "避开2"],
  "suggestedDifficulty": "难度描述"
}`;

    const raw = (await callLLM(prompt, { model: 'default', temperature: 0.6 })).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return fallbackAnalysis(knowledgePointName);
    }

    try {
        return normalizeAnalysis(cleanAndParseJSON(jsonMatch[0]) as Partial<KPAnalysisResult>, knowledgePointName);
    } catch {
        return fallbackAnalysis(knowledgePointName);
    }
}
