import { callLLM } from "../../../llmClient";
import type { V2QuestionDraft } from "./generator";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { selectFinanceRules, formatFinanceRulesForPrompt } from "./rule-matcher";

/**
 * V2 Node A2/A3 (finance): Question Reviewer + Repair Loop
 *
 * 审查优先级：可解性 > 难度 > 结构深度。
 * 难度不足是**阻断项**（写入 difficultyIssues），这是本链路的核心目标；
 * depthIssues 只作质量记录，不废题。
 */

export interface ReviewResult {
    passed: boolean;
    validityIssues: string[];
    difficultyIssues: string[];
    depthIssues: string[];
    overallVerdict: string;
}

export interface ReviewedDraft {
    draft: V2QuestionDraft;
    reviewResult: ReviewResult;
    repairCycles: number;
    needsRegeneration: boolean;
    degradationLevel: 'stable' | 'oscillating' | 'diverging' | 'unrepairable';
    degradationReason: string;
}

function normalizeStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : [];
}

function normalizeReviewResult(parsed: Partial<ReviewResult>): ReviewResult {
    const validityIssues = normalizeStringArray(parsed.validityIssues);
    const difficultyIssues = normalizeStringArray(parsed.difficultyIssues);
    const depthIssues = normalizeStringArray(parsed.depthIssues);
    // passed 只由可解性(validityIssues)和难度(difficultyIssues)决定；
    // depthIssues(结构深度警告)是非阻断的，保留记录但不废题，避免深度修复引起拆小问/过度废题。
    const passed = validityIssues.length === 0 && difficultyIssues.length === 0;

    return {
        passed,
        validityIssues,
        difficultyIssues,
        depthIssues,
        overallVerdict: String(parsed.overallVerdict || (passed ? "审查通过" : "审查未通过")),
    };
}

async function reviewQuestion(draft: V2QuestionDraft): Promise<ReviewResult> {
    const kp = draft.knowledgePoint;
    const questionFull = `${kp} ${draft.chosenDimension} ${draft.questionText} ${draft.referenceAnswer}`;

    const derivativesKeywords = ['期权', '衍生品', '波动率', '对冲', 'Delta', 'Gamma', 'Vega', 'Black-Scholes', 'BSM', '测度', 'Girsanov', 'numéraire', '计价单位', '风险中性', 'Dupire', 'SABR', 'Heston', '鞅', '期货', '互换'];
    const rateCurveKeywords = ['期限结构', '收益率曲线', '久期', 'DV01', '自举', 'bootstrap', 'OIS', 'SOFR', '凸性调整', 'CMS', 'Hull-White', 'Vasicek', 'CIR', 'HJM', '债券', '折现曲线', '远期曲线'];
    const creditKeywords = ['信用', 'CDS', '违约概率', '危险率', 'hazard', '信用价差', '回收率', 'CVA', '强度模型', 'Merton模型', '生存概率', '错向风险'];
    const valuationKeywords = ['估值', 'DCF', 'WACC', 'FCFF', 'FCFE', '资本成本', '股权成本', '终值', '永续增长', 'APV', '税盾', 'MM定理', 'Hamada', '企业价值', '并购', 'LBO'];
    const capitalBudgetKeywords = ['资本预算', 'NPV', 'IRR', 'MIRR', '实物期权', '增量现金流', '沉没成本', '互斥项目', '折旧税盾'];
    const timeSeriesKeywords = ['时间序列', 'ADF', 'KPSS', '单位根', '协整', '误差修正', 'ECM', 'GARCH', '伪回归', 'Granger', '平稳'];
    const causalKeywords = ['因果推断', '工具变量', 'IV', '2SLS', '双重差分', 'DID', 'RDD', '断点回归', '固定效应', '内生性', 'GMM', '平行趋势', '弱工具', '聚类标准误'];
    const lifeActuarialKeywords = ['寿险', '生命表', '死亡率', 'UDD', 'Balducci', '常数死力', '分数年龄', '准备金', 'Thiele', 'Fackler', '年金', '纯保费', '多减因'];
    const nonLifeKeywords = ['非寿险', '损失分布', '免赔额', '责任限额', '再保险', '复合泊松', '帕累托', 'Pareto', 'GPD', '极值理论', '重尾', '链梯法', 'Bühlmann', '信度'];
    const riskMeasureKeywords = ['风险度量', 'VaR', 'TVaR', 'CVaR', '一致性风险度量', '次可加', '压力测试', '经济资本', '回测', '分位数'];
    const fxKeywords = ['汇率', '外汇', '利率平价', 'CIP', 'UIP', 'PPP', 'quanto', '货币互换', '掉期点', '跨货币基差', '三角套汇', '标价'];
    const statementKeywords = ['财务报表', '财务分析', '资产负债表', '现金流量表', '三表联动', '权责发生制', '应计', '资本化', '费用化', 'FIFO', 'LIFO', '租赁', '递延所得税', '杜邦', 'ROIC'];
    const portfolioKeywords = ['投资组合', '资产定价', 'CAPM', '因子模型', '有效前沿', '均值方差', '协方差矩阵', 'APT', '业绩归因', '夏普比率'];

    const includesAny = (keywords: string[]) => keywords.some(kw => questionFull.includes(kw));

    const params_derivatives = includesAny(derivativesKeywords) ? `
- 衍生品/波动率：测度与计价单位是否配对（被定价资产除以计价单位后是否为鞅）；随机利率下折现因子是否被错误外提；隐含/局部/瞬时波动率是否混用；隐含波动率曲面是否满足蝶式凸性与日历价差单调；波动率是否按 √t 缩放；不同期限 Vega 是否被直接相加；期权价格是否落在无套利边界内并满足看跌看涨平价。` : '';

    const params_rateCurve = includesAny(rateCurveKeywords) ? `
- 利率曲线：折现曲线与远期曲线是否分离且与抵押品口径一致；日计数基准、付息频率、复利约定是否全题统一；贴现因子是否单调且落在 (0,1]；久期是否区分麦考利与修正久期；组合久期是否市值加权；凸性调整的符号与量级是否由测度不匹配推出。` : '';

    const params_credit = includesAny(creditKeywords) ? `
- 信用风险：由价差反解的是否明确为风险中性违约概率，与真实世界概率是否混用；生存概率是否单调不增且在 [0,1]；PD 与 LGD 是否被无依据地分离；分段危险率是否与各期限价差自洽；CVA 是否体现错向风险而非独立相乘。` : '';

    const params_valuation = includesAny(valuationKeywords) ? `
- 企业估值：现金流与折现率是否严格配对（FCFF↔WACC、FCFE↔k_e）；名义与实际口径是否混用；杠杆时变时是否仍用常数 WACC；是否满足 g<WACC 且 g 不超过长期名义增速；beta 去杠杆/重加杠杆是否声明 Hamada 前提；企业价值与股权价值的桥接项是否完整。` : '';

    const params_capitalBudget = includesAny(capitalBudgetKeywords) ? `
- 资本预算：现金流多次变号时是否判别 IRR 唯一性；增量现金流是否含营运资本变动与回收、折旧税盾、机会成本并剔除沉没成本；不等寿命互斥项目是否用等年值比较；实物期权估值参数是否可由题面推出。` : '';

    const params_timeSeries = includesAny(timeSeriesKeywords) ? `
- 时间序列：ADF 与 KPSS 的原假设方向是否被正确区分；单位根检验是否误用常规 t 临界值；非平稳序列是否先判协整再建 ECM；GARCH 是否满足非负与 α+β<1，涉及峰度或标准误时是否检验四阶矩条件。` : '';

    const params_causal = includesAny(causalKeywords) ? `
- 因果识别：识别策略是否由解题者提出并论证；弱工具（首段 F 偏低）的偏误方向与标准误失真是否讨论；不可检验假设（排他性、平行趋势的处理后部分）是否与可检验部分区分；聚类层级是否与处理分配层级一致；估计量是 ATE/ATT/LATE 中哪一个是否明确。` : '';

    const params_lifeActuarial = includesAny(lifeActuarialKeywords) ? `
- 寿险精算：分数年龄假设（UDD/常数死力/Balducci）是否唯一且可由条款判定、题面是否误点名；是否满足 0<q_x<1 与 p_x+q_x=1；选择表与终极表接续是否正确；准备金递归是否与前瞻式/后顾式交叉一致；独立减因率是否被误当从属减因率；保费缴付与给付时点是否明确。` : '';

    const params_nonLife = includesAny(nonLifeKeywords) ? `
- 非寿险/损失分布：重尾分布是否先判矩存在性（Pareto α≤2 无方差）、矩不存在时是否误用正态近似；免赔额是否同时作用于频率与强度；分层期望之和是否等于总期望；复合分布方差是否用复合公式；信度因子是否落在 [0,1]。` : '';

    const params_riskMeasure = includesAny(riskMeasureKeywords) ? `
- 风险度量：置信水平、持有期与分位数取值约定是否明确；TVaR≥VaR 是否成立；VaR 的次可加性是否被错误假定；√t 时间换算是否在非独立同分布下被无条件使用。` : '';

    const params_fx = includesAny(fxKeywords) ? `
- 汇率/国际金融：标价方向（基准/报价货币、直接/间接）是否可由题面唯一确定且答案显式声明；CIP 与 UIP/PPP 是否混用；含跨货币基差时是否仍机械套 CIP；quanto 与跨货币产品是否给出相关系数；汇率与利率的期限、日计数是否一致。` : '';

    const params_statement = includesAny(statementKeywords) ? `
- 财务报表：资产=负债+所有者权益是否严格闭合；净利润是否经留存收益贯通三表；间接法调节项是否与资产负债表变动一致；跨公司比较前是否调平会计政策口径；杜邦分解乘积是否还原为 ROE；ROIC 分子分母口径是否匹配；科目数量级与相互关系是否合理。` : '';

    const params_portfolio = includesAny(portfolioKeywords) ? `
- 投资组合：协方差矩阵是否半正定、相关系数是否在 [−1,1]；权重之和是否满足预算约束；含约束时是否判定约束是否起作用而非直接套无约束解；归因各项之和是否等于总超额收益。` : '';

    const paramChecks = `${params_derivatives}${params_rateCurve}${params_credit}${params_valuation}${params_capitalBudget}${params_timeSeries}${params_causal}${params_lifeActuarial}${params_nonLife}${params_riskMeasure}${params_fx}${params_statement}${params_portfolio}`;
    const coreDataText = JSON.stringify(draft.coreData || {}, null, 2);
    const ruleBlock = formatFinanceRulesForPrompt(
        selectFinanceRules({
            node: 'A2/A3',
            knowledgePoint: draft.knowledgePoint,
            dimension: draft.chosenDimension,
            questionText: draft.questionText,
            referenceAnswer: draft.referenceAnswer,
            maxRules: 4,
        }),
        '【已匹配的规则库动态审查要求】'
    );

    const prompt = `你是量化金融领域的博士后级别专家，同时是金融工程博士资格考的题目审核人。请从三个维度独立审查以下题目。

【知识点】：${draft.knowledgePoint}
【考察维度】：${draft.chosenDimension}

【题目】：
${draft.questionText}

【结构化 coreData（供参考）】：
${coreDataText}

【参考答案】：
${draft.referenceAnswer}

${ruleBlock}
【审查维度 1 - 可解性 / 唯一可解性（最高优先，先于难度）】
- 题面条件是否充分且必要；参考答案是否引入题面没有给出、也无法由题面推出的关键数据。
- 解题所需的每个约定是否可判定：折现频率与年化约定、日计数基准、离散/连续复利、货币与标价方向、相关系数、税率、模型或假设口径（分数年龄假设、会计政策、折现曲线、测度）。凡"必须靠猜"的参数一律写入 validityIssues。
- 金融条件是否自洽：无套利（隐含波动率曲面蝶式与日历价差、贴现因子单调且在 (0,1]、看跌看涨平价）、恒等式闭合（资产=负债+权益、分层期望之和=总期望、各减因强度之和=总强度）、概率与相关系数在合法范围。
- 是否存在多组自洽解（口径未唯一化导致两条正确路径给出不同答案）；若有，写入 validityIssues。
- 所有公式、常数、单位换算、有效数字是否准确。

【审查维度 1.5 - 参数金融可实现性（高权重，命中必须写入 validityIssues）】
- 数据闭合：题面数据、coreData 与参考答案数值必须彼此一致。
- coreData 题面可见性：coreData 是题面关键数据的结构化镜像；若参考答案实际用到的某个 coreData 数值/单位/常数完全没有在题面出现、也无法由题面推出，写入 validityIssues；仅出现在 coreData 而答案未使用的量不必强制写入题面。
- 口径统一：名义vs实际、隐含vs局部vs瞬时波动率、风险中性vs真实世界概率、企业价值vs股权价值、FCFF vs FCFE、总额vs增量、面值加权vs市值加权、独立vs从属减因率、上分位数vs下分位数。
${paramChecks || '- 未命中特定领域关键词时，仍需执行通用金融可实现性检查：无套利、恒等式闭合、单位与约定自洽、模型适用边界、数值范围合理。'}

【审查维度 2 - 难度（本链路的核心目标，不足即写入 difficultyIssues 并废题）】
- 是否达到金融工程/经济学博士资格考或顶刊复现级别；不能是本科教材式题目。
- 解题链是否有 ≥5 个**相互依赖**的实质步骤（前一步输出是后一步输入）；并列的多个独立小计算不算。
- 是否存在至少一个"判定后才知道走哪条路"的模型/口径适用域判断，且判错会改变数值量级或结论方向。
- 是否要求解题者自行论证模型选择的合理性或给出失效边界。
- 禁止低难度模板：Black-Scholes / Gordon 增长 / CAPM / 久期公式 / 单次折现的直接代入；查表后乘一个系数即可完成；只换背景和数字的教材原型题；靠增加数字位数、堆叠小问或无关背景伪装难度。
- 若题目退化为"代入单一公式"，必须写入 difficultyIssues 并说明应如何提高耦合（而不是加长计算）。

【审查维度 3 - 结构深度（以下 3A-3D 不满足写入 depthIssues，非阻断）】
3A 判定分叉：题目数据必须迫使解题者先判断模型/口径/适用域，且判断结论改变后续计算路径；仅在答案里口头说"需要判断"不算通过。
3B 隐含前提：至少一个关键前提由数据关系、无套利条件、恒等式或制度背景推出，而非显式写死；若隐含前提无法从题面推出，属于 validityIssues。
3C 口径转换屏障：解题链中必须有一次不可跳过且影响结果的口径/基准转换（名义↔实际、离散↔连续复利、日计数换算、波动率层级、概率测度、企业价值↔股权价值、独立↔从属减因率）。
3D 教材原型检测：若题目可被还原为"已知 A 和 B 求 C"的教材模板且无实质跨概念融合，写入 depthIssues。

【题面纯净性（命中写入 validityIssues）】
- questionText 中不得出现解题路径提示（如"注意测度变换""需先判断是否协整"）、命题者视角表述（"本题考查/难点在于/陷阱是/分值"）、步骤编号式引导或答案量级暗示。
- 不得把应由解题者判定的前提直接写进题面。

【passed 判定硬规则】
- passed 仅由 validityIssues 与 difficultyIssues 决定：两者都为空时 passed=true，否则 passed=false。
- depthIssues 是【非阻断警告】：即使非空也不影响 passed，仅作质量记录；因此真正致命的可解性/自洽性/条件不足问题必须写入 validityIssues，绝不能塞进 depthIssues。
- 难度不足是**阻断项**，必须写入 difficultyIssues，不得因"题目本身没错"而放行。

输出必须是严格 JSON，不含 markdown 代码块：
{
  "passed": true 或 false,
  "validityIssues": ["可解性或参数可实现性问题"],
  "difficultyIssues": ["难度不足问题"],
  "depthIssues": ["3A/3B/3C/3D结构深度问题"],
  "overallVerdict": "一句话总结审查结论"
}`;

    const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.2, responseFormat: 'json' })).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return {
            passed: false,
            validityIssues: ["Failed to parse review response"],
            difficultyIssues: [],
            depthIssues: [],
            overallVerdict: "审查响应解析失败"
        };
    }
    try {
        return normalizeReviewResult(cleanAndParseJSON(jsonMatch[0]) as Partial<ReviewResult>);
    } catch (e) {
        return {
            passed: false,
            validityIssues: [`JSON parse failed: ${(e as Error).message}`],
            difficultyIssues: [],
            depthIssues: [],
            overallVerdict: "审查响应解析失败"
        };
    }
}

async function deepRepairQuestion(
    draft: V2QuestionDraft,
    review: ReviewResult,
    cycleNumber: number,
    singleQuestion: boolean = false
): Promise<V2QuestionDraft> {
    const depthList = review.depthIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n");
    const otherIssues = [...review.validityIssues, ...review.difficultyIssues];
    const otherList = otherIssues.length > 0
        ? "\n【同时需要修复的可解性/难度问题】：\n" + otherIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n")
        : "";
    const singleQuestionConstraint = singleQuestion
        ? `⚠️【强制单问】修复后题目必须只有一个求解目标，禁止出现 (1)(2)(3)、（一）（二）、第一问/第二问等多小问结构；补深度只能通过加深单一问题的推理链，不能拆成多个子问。\n\n`
        : '';
    const coreDataText = JSON.stringify(draft.coreData || {}, null, 2);

    const prompt = `你是量化金融领域的博士后级别专家，负责题目深度重写。本题难度或结构深度不足，需要较大幅度改写。（第 ${cycleNumber} 次修复 — 深度模式）

${singleQuestionConstraint}【当前题目】：
${draft.questionText}

【当前结构化 coreData（修复后必须逐项显式写入题面，不能只保留在JSON字段）】：
${coreDataText}

【当前参考答案】：
${draft.referenceAnswer}

【结构深度问题（本次修复的核心）】：
${depthList}
${otherList}

【深度修复规则（必须全部执行）】：
1. 核心考察维度保持不变（${draft.chosenDimension}）——但情境、数字、背景可以完全替换。
2. 必须补齐 3A 判定分叉：题目数据要迫使解题者先判断模型/口径/适用域/测度/曲线归属是否成立；判断结论必须改变后续计算路径，不能只是答案里的口头说明。
3. 必须补齐 3B 隐含前提：至少一个关键前提不能直接写死在题面里，而要能从数据关系、无套利条件、恒等式闭合或制度背景中推出；不得把必要参数删成题目缺陷。
4. 必须补齐 3C 口径转换屏障：解题链中至少一次不可跳过的名义↔实际、离散↔连续复利、日计数换算、隐含↔局部↔瞬时波动率、风险中性↔真实世界概率、企业价值↔股权价值、独立↔从属减因率等转换，且该转换会改变数值或结论。
5. 必须补齐 3D 教材原型防御：若原题是教材模板，必须引入跨概念融合和多数据闭合，不能只更换背景和数字。
6. 若题目缺少必要约定（利率约定、日计数、标价方向、相关系数、税率）：在题目和答案中显式补充；若使用隐含前提，必须确保其可由题面推出。
7. ${singleQuestion ? '修复后必须有 ≥5 个相互依赖的推理步骤，但全部合并为单一求解目标，禁止拆成 (1)(2)(3) 小问或多个子任务。' : '修复后推理步骤必须 ≥5 步，且步骤间有依赖，不得拆成多个无关小问。'}
8. 所有数据必须自洽：无套利、恒等式闭合、概率与相关系数合法范围、单位与约定一致。
9. coreData 只能作为题面数据镜像；修复后答案会用到的 coreData 数值、单位、系数、常数必须逐项出现在 questionText 中。
10. 参考答案必须明确标出：口径声明、判定分叉、隐含前提来源、口径转换节点。
11. 【题面纯净性】：上述 3A-3D、单问约束和判定分叉/隐含前提/口径说明都只能体现在题目数据设计和 referenceAnswer 中；questionText 只能是自然的背景叙述、数据和提问，禁止出现"解答必须…""需要判断…""注意测度变换""不得拆分成多个小问"等面向解题者/出题者的元要求句。

输出必须是严格 JSON，不含 markdown 代码块：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${draft.chosenDimension}",
  "questionText": "深度修复后的完整题目，只含背景叙述、数据和提问，禁止任何解题/出题元要求句",
  "coreData": {"金融量名称": {"value": 数值, "unit": "单位"}},
  "requiredAnswer": "${draft.requiredAnswer}",
  "referenceAnswer": "重写后的完整分步解答，含口径声明、公式推导和数值代入",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]
}`;

    const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.5 })).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return draft;

    try {
        const repaired = cleanAndParseJSON(jsonMatch[0]) as V2QuestionDraft;
        repaired.problemId = draft.problemId;
        repaired.knowledgePoint = draft.knowledgePoint;
        repaired.chosenDimension = draft.chosenDimension;
        return repaired;
    } catch (e) {
        console.warn(`[Reviewer] deepRepair JSON parse failed (cycle ${cycleNumber}):`, e);
        return draft;
    }
}

async function detailRepairQuestion(
    draft: V2QuestionDraft,
    review: ReviewResult,
    cycleNumber: number,
    singleQuestion: boolean = false
): Promise<V2QuestionDraft> {
    const allIssues = [...review.validityIssues, ...review.difficultyIssues];
    const issueList = allIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n");
    const coreDataText = JSON.stringify(draft.coreData || {}, null, 2);
    const singleQuestionConstraint = singleQuestion
        ? `⚠️【强制单问】修复后题目必须只有一个求解目标，禁止出现 (1)(2)(3)、（一）（二）、第一问/第二问等多小问结构。\n\n`
        : '';

    const prompt = `你是量化金融领域的博士后级别专家，负责题目细节修复。本题仅需修复可解性或难度问题，不改变题目情境和结构。（第 ${cycleNumber} 次修复 — 细节模式）

${singleQuestionConstraint}【当前题目】：
${draft.questionText}

【当前结构化 coreData（修复后必须逐项显式写入题面，不能只保留在JSON字段）】：
${coreDataText}

【当前参考答案】：
${draft.referenceAnswer}

【需要修复的问题】：
${issueList}

【细节修复规则】：
1. 只修复上述列出的问题，保持题目情境、背景、结构不变。
2. 若涉及约定缺失（利率约定、日计数基准、复利方式、标价方向、相关系数、税率、假设口径）：在题目和答案中补充明确取值；若答案使用了题面无法推出的数据，必须把数据补入题面或改为可由题面推出。
3. 若数值超出合理范围或蕴含套利：修正为金融上合理且无套利的数值，并同步更新 coreData 和答案。
4. coreData 只能作为题面数据镜像；修复后答案会用到的 coreData 数值、单位、系数、常数必须逐项出现在 questionText 中。
5. 保持难度不降低：不得删除已有的判定分叉、隐含前提、口径转换屏障或反模板结构；不得为了修可解性而把应由解题者判定的前提写进题面。
6. 细节修复后仍必须在参考答案中保留并明确写出口径声明、判定分叉、隐含前提来源、口径转换节点。
7. 所有修复必须确保数据自洽：无套利、恒等式闭合、概率与相关系数合法范围、单位与约定一致。
8. 【题面纯净性】：判定分叉/隐含前提/口径说明和单问约束只能体现在题目数据设计和 referenceAnswer 中；questionText 只能是自然的背景叙述、数据和提问，禁止出现"解答必须…""需要判断…""注意测度变换""不得拆分成多个小问"等面向解题者/出题者的元要求句。

输出必须是严格 JSON，不含 markdown 代码块：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${draft.chosenDimension}",
  "questionText": "细节修复后的完整题目，只含背景叙述、数据和提问，禁止任何解题/出题元要求句",
  "coreData": {"金融量名称": {"value": 数值, "unit": "单位"}},
  "requiredAnswer": "${draft.requiredAnswer}",
  "referenceAnswer": "修复后的完整分步解答",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]
}`;

    const raw = (await callLLM(prompt, { model: 'reasoning', temperature: 0.2 })).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return draft;

    try {
        const repaired = cleanAndParseJSON(jsonMatch[0]) as V2QuestionDraft;
        repaired.problemId = draft.problemId;
        repaired.knowledgePoint = draft.knowledgePoint;
        repaired.chosenDimension = draft.chosenDimension;
        return repaired;
    } catch (e) {
        console.warn(`[Reviewer] detailRepair JSON parse failed (cycle ${cycleNumber}):`, e);
        return draft;
    }
}

async function repairQuestion(
    draft: V2QuestionDraft,
    review: ReviewResult,
    cycleNumber: number,
    singleQuestion: boolean = false
): Promise<V2QuestionDraft> {
    if (review.depthIssues.length > 0) {
        return deepRepairQuestion(draft, review, cycleNumber, singleQuestion);
    }
    return detailRepairQuestion(draft, review, cycleNumber, singleQuestion);
}

export async function reviewAndRepair(
    draft: V2QuestionDraft,
    _trackerId?: unknown,
    singleQuestion: boolean = false,
    _numericAnswerOnly?: boolean
): Promise<ReviewedDraft> {
    let current = draft;
    let repairCycles = 0;
    const allReviews: ReviewResult[] = [];

    const review0 = await reviewQuestion(current);
    allReviews.push(review0);
    console.log(`[V2 A2] 第1次审查结果: passed=${review0.passed}`, review0.overallVerdict);
    if (review0.passed) {
        return { draft: current, reviewResult: review0, repairCycles, needsRegeneration: false, degradationLevel: 'stable', degradationReason: '' };
    }

    const strategy1 = review0.depthIssues.length > 0 ? 'deep' : 'detail';
    console.log(`[V2 A3] 第1次修复 (${strategy1}模式), issues:`, [...review0.validityIssues, ...review0.difficultyIssues, ...review0.depthIssues]);
    current = await repairQuestion(current, review0, 1, singleQuestion);
    repairCycles++;

    const review1 = await reviewQuestion(current);
    allReviews.push(review1);
    console.log(`[V2 A2] 第2次审查结果: passed=${review1.passed}`, review1.overallVerdict);

    const deg1 = detectDegradation(allReviews, repairCycles);
    if (deg1.degradationLevel !== 'stable') {
        console.warn(`[V2 A2/A3] 终止条件触发: ${deg1.degradationLevel} — ${deg1.degradationReason}`);
        return { draft: current, reviewResult: review1, repairCycles, needsRegeneration: true, ...deg1 };
    }

    if (review1.passed) {
        return { draft: current, reviewResult: review1, repairCycles, needsRegeneration: false, degradationLevel: 'stable', degradationReason: '' };
    }

    if (review1.depthIssues.length === 0 &&
        review1.validityIssues.length === 0 &&
        review1.difficultyIssues.length === 0) {
        return { draft: current, reviewResult: review1, repairCycles, needsRegeneration: false, degradationLevel: 'stable', degradationReason: '' };
    }

    const strategy2 = review1.depthIssues.length > 0 ? 'deep' : 'detail';
    console.log(`[V2 A3] 第2次修复 (${strategy2}模式), issues:`, [...review1.validityIssues, ...review1.difficultyIssues, ...review1.depthIssues]);
    current = await repairQuestion(current, review1, 2, singleQuestion);
    repairCycles++;

    const review2 = await reviewQuestion(current);
    allReviews.push(review2);

    const degFinal = detectDegradation(allReviews, repairCycles);
    return {
        draft: current, reviewResult: review2, repairCycles,
        needsRegeneration: !review2.passed,
        degradationLevel: degFinal.degradationLevel,
        degradationReason: degFinal.degradationReason,
    };
}

function detectDegradation(
    reviews: ReviewResult[],
    cycles: number
): { degradationLevel: 'stable' | 'oscillating' | 'diverging' | 'unrepairable'; degradationReason: string } {
    if (reviews.length < 2) return { degradationLevel: 'stable', degradationReason: '' };

    const latest = reviews[reviews.length - 1];
    const previous = reviews[reviews.length - 2];

    const prevAll = new Set([...previous.validityIssues, ...previous.difficultyIssues, ...previous.depthIssues]);
    const latestAll = new Set([...latest.validityIssues, ...latest.difficultyIssues, ...latest.depthIssues]);
    const recurring = [...latestAll].filter(i => prevAll.has(i));

    if (recurring.length > 0 && cycles >= 1) {
        return { degradationLevel: 'oscillating', degradationReason: `反复横跳：以下问题经过 ${cycles} 轮修复后仍存在 — ${recurring.slice(0, 3).join('；')}` };
    }

    const prevCount = previous.validityIssues.length + previous.difficultyIssues.length + previous.depthIssues.length;
    const latestCount = latest.validityIssues.length + latest.difficultyIssues.length + latest.depthIssues.length;
    if (latestCount > prevCount) {
        return { degradationLevel: 'diverging', degradationReason: `修复发散：issue 从 ${prevCount} 个增加到 ${latestCount} 个` };
    }

    if (cycles >= 2 && !latest.passed && latest.depthIssues.length > 0) {
        const total = latest.validityIssues.length + latest.difficultyIssues.length + latest.depthIssues.length;
        if (total >= 2) {
            return { degradationLevel: 'unrepairable', degradationReason: `不可稳定修复：${cycles} 轮修复后仍有 ${total} 个问题` };
        }
    }

    return { degradationLevel: 'stable', degradationReason: '' };
}





