import { callLLM } from "../../../llmClient";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";

/**
 * V2 Node A0: Knowledge Point Analyzer
 */

export interface KPAnalysisResult {
    knowledgePoint: string;
    testDimensions: string[];
    coreConceptsToAvoid: string[];
    suggestedDifficulty: string;
}

const FALLBACK_DIMENSIONS = [
    "从数据趋势判断模型适用性并完成多步推导",
    "联立守恒约束与平衡关系推断隐含条件",
    "区分表观量与本征量并校正解题路径",
];

const FALLBACK_AVOID = [
    "计算题单一公式直接代入",
    "推理题单步结论跳转",
    "问答题概念背诵或泛泛解释",
    "教材标准例题改数值",
    "题面显式给出全部判断条件",
];

function fallbackAnalysis(knowledgePointName: string): KPAnalysisResult {
    return {
        knowledgePoint: knowledgePointName,
        testDimensions: FALLBACK_DIMENSIONS,
        coreConceptsToAvoid: FALLBACK_AVOID,
        suggestedDifficulty: "竞赛级别：需要先判断模型或近似适用性，再结合守恒、平衡或动力学关系完成多步推导。"
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
    const prompt = `你是化学竞赛命题专家。知识点：「${knowledgePointName}」

任务：为出题做前期规划，列出该知识点下国际顶级化学竞赛（IChO/全国决赛/研究生入学）级别的考察维度。

要求：
1. 列出 3-5 个具体的子考察维度，每个维度必须明确"考什么推导/计算/判断"，不能只写知识名称
   - 参考示例（多方向参考，只引导方向，不做指引）：
     * 物理化学："用对比态原理判断实际气体偏差方向，结合逸度系数计算高压化学平衡"
     * 动力学："从不同pH下k_obs数据推导活性形态pKa，判断预平衡vs稳态近似适用性"
     * 电化学："用Cottrell方程分离法拉第电流与双层充电电流，校正条件电位求扩散系数"
     * 表面化学："从TPD峰温-覆盖度数据判断吸附能量分布类型，选择Temkin vs Langmuir模型"
     * 有机/量子："从NMR耦合常数推断共轭体系拓扑类型，用Hückel模型计算非标准环系能级"
     * 酸碱平衡："在高离子强度下校正活度系数，判断Henderson-Hasselbalch近似是否越界"
     * 固体化学："联立XRD、TG和磁性数据推断钙钛矿缺陷类型和浓度"
     * 均相催化："从完整循环自由能图枚举配对判定TDTS/TDI并算含跨圈ΔGr的δE"
     * 混合价化合物："由IVCT带反演Hab后比较2Hab与λ判Robin-Day类别并处理MH公式自失效"
     * 统计热力学："含低能自旋-轨道激发态时电子配分求和求熵，或由对称数判同位素交换高温极限K"
     * 分子光谱："由(2J+1)权重定最强转动谱线Jmax，或B_v'<B_v''判带头并外推B_e反算键长"
   - 差的示例："化学平衡" / "电化学" / "配位化学"（太泛，不能指导出题）
2. 每个维度不超过 30 个字；若属于专门模型/方法，必须保留标准术语（如 BV/Tafel/EIS、Flory-Huggins、Curtin-Hammett、Marcus、NMR、HSAB、活度/逸度、同位素分馏/Rayleigh/KIE/ZPE、Oregonator/Nagumo/Turing、VFT/DSC/Tg、CIDNP/HFI/Δg、Fokker-Planck/MFPT、VQE/JW/coreData、能量跨度/TDTS/TDI/XTOF、Mulliken-Hush/IVCT/Robin-Day/Hab、配分函数/对称数/自旋-轨道/Bigeleisen/Hund第三定则/g_J、带头/Fortrat/B_e/α_e/Jmax/Fermi共振/Birge-Sponer 等），方便后续节点继续命中动态规则
3. 每个维度必须满足以下难度标准：
   - 需要至少 2 个以上知识点交叉融合才能解决
   - 解题过程必须有真正的判断分叉：先判断模型/近似/边界条件/主导形态，再选择后续路径
   - 学生需要自行识别至少一个隐含约束，而不是从题目中直接读出所有条件
   - 必须包含至少一个容易误用的量或基准：总浓度vs游离浓度、条件常数vs热力学常数、活度vs浓度、逸度vs分压、每式量vs每晶胞等
   - 限制生成低防御的计算题、推理题、问答题：计算题不能单一公式一步算出，推理题不能单步结论跳转，问答题不能停留在概念背诵或泛泛解释，三类题都必须多步推导或多证据闭合
4. 列出 2-3 个该知识点"出烂了"的老套角度（教材原题类型，必须明确避开）
5. 给出难度定位描述：说明解题需要哪些前置知识、判断分叉在哪里、最容易在哪步犯错、哪个隐含条件不能直接明说

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
