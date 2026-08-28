import { callLLM } from "../../llmClient";
import { callLLMTracked } from "./costTracker";
import type { BaseProblem, UserInput, TextbookConstraints } from "../../../types/multiNodeTypes";
import { getTextbookPromptConstraints } from "../../nodes/node1-rag";
import { getDisciplineGuidance, identifyDiscipline } from "./disciplines";
import { cleanAndParseJSON, validateAndFixProblemJSON } from "../../utils/jsonCleaner";

/**
 * Physics: Base Problem Generator
 */

export async function generateBaseProblem(
    input: UserInput,
    constraints: TextbookConstraints,
    problemNumber: number,
    allowedAngles: string[] = [],
    usedAngles: string[] = [],
    problemIndex?: number
): Promise<BaseProblem> {
    const topicDisciplineGuidance = getDisciplineGuidance(input.topic);
    const disciplineKey = identifyDiscipline(input.topic);

    // 方向检测：仅加载相关方向的专项约束
    const isQuantumMechanics = disciplineKey.startsWith('modern-quantum') || disciplineKey === 'modern-photoelectric';
    const isElectromagnetism = disciplineKey.startsWith('electromagnetism-');
    const isThermodynamics = disciplineKey.startsWith('thermodynamics-') || disciplineKey.startsWith('stat-');
    const isMechanics = disciplineKey.startsWith('mechanics-');
    const isOptics = disciplineKey.startsWith('optics-');
    const isRelativity = disciplineKey === 'modern-relativity';
    const isNuclear = disciplineKey === 'modern-nuclear';

    const backgrounds = ["实验室科研", "工业生产", "前沿学术研究", "纯理论推导"];
    const randomBackground = backgrounds[(problemNumber - 1) % backgrounds.length];

    // 条件注入：量子力学专项约束（仅量子/近代物理方向加载）
    const qmGlobalConstraints = isQuantumMechanics ? `
3. 近代物理与量子力学专项禁止：
   - 隧穿指数κ = √(2m(V₀-E))/ℏ，分母为ℏ（约化普朗克常数），不是h，不是ℏ²
   - 光电效应：逸出功（Work Function）与表面势垒是同一物理量，禁止同一题中同时给出两个
   - 光电效应：最大初动能 E_k = hν - φ，必须 E_k > 0，量子效率不超过1
   - 热平衡系统必须用混合态/密度矩阵描述，不能用纯态叠加
   - 量子数合法性：主量子数n≥1，角量子数0≤l≤n-1，磁量子数|m|≤l
   - 波函数边界条件：有限势阱/势垒边界处ψ和dψ/dx均连续（δ势除外）；边界条件数量=待定系数数量
   - 对易关系[x̂,p̂]=iℏ（不是ih不是iℏ/2），不确定关系ΔxΔp≥ℏ/2（不是≥ℏ）
   - 微扰论前提：非简并微扰论仅适用于非简并能级；简并态必须用简并微扰论（先对角化简并子空间）
   - 全同粒子：费米子总波函数交换反对称，单重态(S=0)空间对称，三重态(S=1)空间反对称
   - 含时演化相位因子：|ψ(t)⟩=Σcₙe^{-iEₙt/ℏ}|n⟩，指数是-iEₙt/ℏ不是-iEₙt/h
   - 变分法：试探波函数的能量期望值E_trial≥E₀(真实基态)恒成立，且试探函数须满足边界条件
` : '';

    const qmSelfCheck = isQuantumMechanics ? `
8. 量子力学题目专项自检（强制执行）：
   - □ 波函数连续性：每个势能突变点的边界条件是否正确施加？条件数是否等于未知数？
   - □ 量子数合法性：所有(n,l,m,ms)组合是否合法？涉及跃迁的初末态量子数是否满足选择定则Δl=±1？
   - □ 能量合理性：束缚态能量是否E<V₀？能级是否正序排列（E₁<E₂<E₃...）？
   - □ 归一化可行性：给定波函数在全空间（或有限区间）的模方积分是否收敛有限？
   - □ 近似适用性：若使用WKB需|dλ/dx|<<1；若用微扰需|H'|<<ΔE；若用绝热需τ>>ℏ/ΔE——参数是否满足？
   - □ 脉冲-失谐自洽：若涉及脉冲激发，高斯脉冲带宽Δω_bw≈1/τ与失谐|Δ|的比值是否在0.1~10范围内？
   - □ Paschen-Back场强验证：声称"强场/PB极限"时，μ_B·B/ξ>10？
   - □ 厄米性：所有被要求"求期望值"或"求本征值"的算符是否为厄米的？
   - □ 量纲核验：ℏ²/(2m)的量纲为[能量·长度²]；κ=√(2m(V₀-E))/ℏ的量纲为[长度⁻¹]；所有表达式量纲是否自洽？

9. 参数物理可实现性自检（废题率最高的失败点）：
   - □ 粒子质量匹配：电子(mₑ=9.109×10⁻³¹kg)、μ子(mμ≈207mₑ)、质子(mp≈1836mₑ)——是否与声称粒子种类一致？
   - □ 能量量级匹配：原子~eV、分子振动~0.01-0.5eV、核~MeV——偏差>3个数量级必须有物理解释
   - □ 耦合方案与Z值：Z<30用LS耦合；Z>70用jj耦合——是否匹配？
   - □ 跃迁合法性：E1跃迁Δl=±1且宇称改变；同类粒子E1禁戒——是否合法？
   - □ 模型适用域：类氢模型仅限单电子体系；Rydberg原子需量子亏损修正——是否越界？
   - □ 维度一致性：二维体系不讨论z方向；一维体系无角动量——是否全程自洽？
` : '';

    // 条件注入：电磁学专项约束（仅电磁学方向加载）
    const emSelfCheck = isElectromagnetism ? `
8. 电磁学题目专项自检（强制执行）：
   - □ 边界条件完备性：每个介质/导体界面是否都独立施加了D_n连续和E_t连续？磁场界面B_n连续和H_t跃变=面电流密度K？
   - □ 介质参数合理性：ε_r是否与声称材料匹配（水~80，玻璃~4-10）？ε_r<1在自然材料中不存在？
   - □ 电磁感应符号：ε=-dΦ_B/dt 负号是否正确体现？楞次定律方向是否自洽？
   - □ 互感约束：|M|≤√(L₁L₂) 是否满足？自感L>0 是否满足？
   - □ 趋肤深度自洽：δ=√(2/(ωμσ)) 给定的频率和材料是否给出合理的δ值？
   - □ 电路换路定律：开关动作瞬间i_L(0⁺)=i_L(0⁻), v_C(0⁺)=v_C(0⁻)？
   - □ 谐振参数自洽：f₀=1/(2π√(LC))，Q=ω₀L/R，五者是否相互自洽？
   - □ 功率守恒：有功功率 P_源=ΣP_电阻？无功功率在L和C间交换但总和为零？
   - □ 远场/近场判据：讨论辐射问题时r与λ的关系是否明确？
` : '';

    // 条件注入：热力学专项约束（仅热学方向加载）
    const thermoSelfCheck = isThermodynamics ? `
8. 热力学题目专项自检（强制执行）：
   - □ 过程自洽性：绝热与等温是否在同一过程中互斥？"隔热"与"恒温"是否矛盾共存？
   - □ 热容匹配：等压用C_p，等容用C_v，绝热过程不涉及Q=nCΔT——是否正确使用？
   - □ 比热比自洽：γ=C_p/C_v是否与气体种类匹配（单原子5/3，双原子7/5）且γ>1？
   - □ 范德华参数：a,b>0且V>nb？临界参数T_c=8a/27Rb, V_c=3nb, p_c=a/27b²是否内部自洽？
   - □ 焦耳-汤姆逊方向：μ_JT符号是否与气体种类和温度匹配？（氢/氦常温下节流升温）
   - □ 不可逆熵变方法：是否避免对不可逆过程直接积分δQ/T？（应设计可逆替代路径）
   - □ 相变处理：相变段温度恒定，Q=mL而非Q=mcΔT——是否正确区分相变段与非相变段？
   - □ 第二定律方向性：ΔS_宇宙≥0是否满足？计算得到负值说明参数有误
   - □ 热力学势选择：等温等容→F最小，等温等压→G最小——约束条件与热力学势是否匹配？
` : '';

    // 条件注入：力学专项约束（仅力学方向加载）
    const mechSelfCheck = isMechanics ? `
8. 力学题目专项自检（强制执行）：
   - □ 摩擦系数合理性：μ∈[0,~1.5]且与材料匹配？静摩擦μ_s>动摩擦μ_k？
   - □ 恢复系数范围：碰撞恢复系数e∈[0,1]？完全弹性e=1，完全非弹性e=0？
   - □ 转动惯量匹配：I值是否与声称几何形状一致（薄圆盘½MR²、实心球⅖MR²、薄棒过中心¹⁄₁₂ML²）？
   - □ 约束类型识别：非完整约束（纯滚动、刀刃）是否用拉格朗日乘子法处理？是否错误地用减少自由度方法消去？
   - □ 纯滚动条件：v_cm=Rω仅在无滑动时成立——是否在有滑动情况下误用？
   - □ 非惯性系伪力完备性：旋转参考系中是否同时包含离心力和科里奥利力？遗漏任一均为错误
   - □ 变质量方程符号：dm/dt<0（喷气减质量）还是>0（收集增质量）？v_rel方向是否正确？
   - □ 速度范围验证：若v>0.1c需使用相对论力学，经典牛顿力学框架不再适用
   - □ 流体力学条件：伯努利方程需Ma<0.3+沿同一流线+定常+无粘？Re与声称流态是否一致？
   - □ 弹簧线性范围：形变量是否在弹簧自然长度的50%以内（否则胡克定律失效）？

9. 力学参数完备性自检：
   - □ 所有力（重力、弹力、摩擦力、约束力等）是否在受力分析中完备？
   - □ 守恒律应用条件：声称"能量守恒"时是否确认无非保守力做功？声称"动量守恒"时是否确认外力合力为零？
   - □ 参考系一致性：受力分析、运动方程、能量计算是否在同一参考系中进行？
` : '';

    // 条件注入：光学专项约束（仅光学方向加载）
    const opticsSelfCheck = isOptics ? `
8. 光学题目专项自检（强制执行）：
   - □ 折射率合理性：n≥1是否满足？给定n值是否与声称材料匹配（水1.33、玻璃1.5-1.9）？
   - □ 半波损失判断：每个界面是否独立判断n₁与n₂的大小关系？两界面半波损失奇偶性是否正确处理？
   - □ 光栅参数自洽：光栅常数d>λ？缺级条件d/a与讨论级次是否自洽？
   - □ 相干条件：干涉光程差是否<相干长度L_c=λ²/Δλ？超过则无条纹
   - □ 衍射域判断：菲涅耳数F=a²/(λz)是否与所用理论匹配（F<<1用夫琅禾费，F≥1用菲涅耳）？
   - □ ABCD矩阵次序：M_total=M_N·...·M_1，M_1为最先经过的元件——次序是否正确？
   - □ 全反射方向：仅光密→光疏（n₁>n₂）才可能全反射——是否在正确方向设置？
   - □ 偏振态处理：自然光过偏振片I→I/2（不是cos²θ）；马吕斯定律仅适用于线偏振光入射
` : '';

    // 条件注入：相对论专项约束（仅相对论方向加载）
    const relativitySelfCheck = isRelativity ? `
8. 相对论题目专项自检（强制执行）：
   - □ 洛伦兹因子自洽：γ=1/√(1-v²/c²)数值是否与给定速度精确匹配？γ≥1是否满足？
   - □ 速度上限：所有有质量粒子v<c是否严格满足？若出现β≥1必须修正参数
   - □ 四动量守恒：反应前后ΣE和Σp⃗是否分别守恒？每个粒子的质量壳条件E²=(pc)²+(m₀c²)²是否满足？
   - □ 参考系标注：每个物理量（E、p、v、t、x）是否明确标注了所在参考系？混用不同参考系的量=严重错误
   - □ 粒子质量匹配：给定的静质量值是否与声称粒子种类一致？（e⁻=0.511MeV, μ=105.7MeV, π±=139.6MeV, p=938.3MeV）
   - □ 近似适用性：β<<1用经典近似，β>0.1必须用完整相对论公式，β→1用极端相对论近似E≈pc——是否在正确能区？
   - □ 因果性验证：信息/能量传递速度<c？类空间隔的两事件不存在因果关系？
   - □ 不变量验证：利用p²=(E/c)²-|p⃗|²=(m₀c)²在不同参考系中取值相同来交叉校验计算结果
` : '';

    // 条件注入：核物理专项约束（仅核物理方向加载）
    const nuclearSelfCheck = isNuclear ? `
8. 核物理题目专项自检（强制执行）：
   - □ 守恒律完备性：核反应方程的A(质量数)和Z(电荷数)前后是否严格守恒？重子数和轻子数是否守恒？
   - □ Q值符号与衰变模式匹配：α衰变/自发裂变的Q>0？β⁺要求M_母>M_子+2m_e？不满足则该衰变模式禁戒
   - □ 半衰期数据核对：给定的T_{1/2}值是否与声称核素精确匹配？（C-14=5730年、Co-60=5.27年、I-131=8.02天）
   - □ 比结合能趋势：B/A随A的变化是否符合实验曲线？Fe-56附近极大？轻核起伏？重核缓慢下降？
   - □ 壳模型自洽：奇A核的J^π是否由最后未配对核子的(n,l,j)正确给出？能级填充序列是否正确？
   - □ γ跃迁选择定则：声称的跃迁类型(E1/M1/E2等)是否满足ΔJ和宇称变化的选择定则？0→0是否被标记为禁戒？
   - □ 截面量级合理性：给定σ值是否与核素种类和入射粒子能量匹配？热中子σ远大于快中子σ（对大多数核素）？
   - □ 衰变链质量自洽：链式衰变每一步的质量递减是否确保Q>0？子核质量是否必然小于母核（计及α/β粒子）？
` : '';

    const prompt = `
你是一位资深物理教育专家。请生成一道以【${randomBackground}】为背景的高质量物理题目。

【重要】：这是一道"白板题"，必须：
1. 题目清晰明确，无陷阱
2. 所有条件充分且必要
3. 有唯一正确解
4. 体现真实的${randomBackground}场景

【学科】：物理
【主题】：${input.topic}
${input.trapCount > 0 ? `【陷阱数预期】：${input.trapCount}\n` : ''}【是否允许查表】：${input.allowTableLookup ? '是' : '否'}

${getTextbookPromptConstraints(constraints)}

【事实纪律（强制执行）】：
1. 绝对禁止篡改基础物理常数：
   - 阿伏伽德罗常数: N_A = 6.02214076×10²³ mol⁻¹
   - 气体常数: R = 8.314 J/(mol·K)
   - 玻尔兹曼常数: k_B = 1.380649×10⁻²³ J/K
   - 光速: c = 2.99792458×10⁸ m/s
   - 普朗克常数: h = 6.62607015×10⁻³⁴ J·s
   - 约化普朗克常数: ℏ = h/2π = 1.05457×10⁻³⁴ J·s
   - 基本电荷: e = 1.602×10⁻¹⁹ C
   - 电子质量: m_e = 9.109×10⁻³¹ kg

2. 热力学过程边界条件必须严格自洽：
   - **绝热过程 (Q=0)**: 温度必然变化，严禁与"恒温"同时出现
   - **恒温过程 (T=const)**: 必须有热交换，绝对禁止与"绝热/完全隔热"同时出现
   - **"完全隔热封闭空间"与"温度恒为T"物理上互斥**，只能选其一
   - **理想气体假设**: 使用时必须明确说明
${qmGlobalConstraints}
4. 物理量单位必须一致，注意SI单位制，中间步骤单位换算必须显式写出

5. 力学场景中约束条件必须物理可实现：
   - 传送带/斜面输送问题：摩擦系数μ必须大于tan θ（否则物体无法被向上输送）
   - 题目中"竖直提升"与"倾角θ"不能同时出现（两者矛盾）

6. 参数完整性自查（生成题目前必须核对）：
   - 题目中所有求解步骤用到的参数是否都已在题干中给出
   - 题目数值是否在10⁻¹⁵~10¹⁵量级范围内（防止极端不合理数值）
   - 所有给定数值之间是否满足能量守恒/动量守恒等基本物理约束

7. 电磁场问题中介质参数必须符合实验数据，不同区域的ε_r必须分区处理
${qmSelfCheck}${emSelfCheck}${thermoSelfCheck}${mechSelfCheck}${opticsSelfCheck}${relativitySelfCheck}${nuclearSelfCheck}
${input.singleQuestion ? `⚠️ 【强制单问】：题目必须只有一个问题，只有一个求解目标。\n\n` : ''}【结构性防御要求（强制——确保题目对AI有固有抵抗力）】：
- 【判断分叉】：解题过程中必须存在至少一个"先判断条件/近似/模型是否成立→再决定走哪条推导路径"的节点。禁止一路直线代入到底。
- 【隐含条件】：至少一个关键物理约束不显式写在题面上，需要学生从守恒律/边界条件/对称性中自行推断。禁止把所有条件全部摆在题面。
- 【量纲壁垒】：题目中至少存在一处非SI单位的数据（如eV、Å、atm等），解题过程中需要单位换算。

- 题目应有合理的推理深度，考察学科核心概念的深层理解。
- 采用物理竞赛或研究生考试的思维水平，要求多步推理。
- 题目应包含多步逻辑推演（至少 4-6 个独立步骤）。
- ⚠️ **铁律**：当难度要求与物理自洽性冲突时，必须优先保证物理自洽性。

【反模式匹配要求（降低AI做题者正确率——至少执行2条）】：
1. 非标准起点：不从"写出方程→分离变量→解ODE"的标准流程开始，而是从物理观测量反推系统参数
2. 隐藏简并/意外对称性：看似满足某条件但实际参数恰好在适用边界上
3. 坐标系/表象选择分叉：问题可在两种框架中求解，但只有一种给出简洁结果
4. 多步序列/级联过程：多步骤中每步结果是下步输入，任一步错误导致后续全错
5. 形似标准模型但参数越界：与教材模型相似，但参数取值使标准近似失效
6. 非对角/隐含量主导：问题关键物理量不在显式给出的量中，需要从约束条件中反推

【题型角度规则（严格执行）】：
${allowedAngles.length > 0
        ? `合法考法范围：${allowedAngles.join('、')}\n已用角度：${usedAngles.length > 0 ? usedAngles.join('、') : '无'}\n请选择一个尚未使用的角度出题；若所有角度已用，允许复用但必须更换情境与数值。`
        : '请从该主题挖掘最深度且尽量多样化的考法角度。'
    }

【逻辑深度与学科特征】：
${topicDisciplineGuidance}

【输出要求】：
请返回一个 JSON 对象，包含以下字段：
{
  "problemId": "base_${problemNumber}_${Date.now()}",
  "questionAngle": "本题核心考法关键词（2-5个字）",
  "topic": "${input.topic}",
  "scenario": "真实场景描述（1-2句话）",
  "originalProblemText": "完整的带数据文字的原始题干（200-300字）",
  "coreData": {
    "物理量名称1": {"value": 数值, "unit": "单位"}
  },
  "requiredAnswer": "求解目标${input.singleQuestion ? '，必须只有一个求解目标' : ''}",
  "referenceSteps": ["步骤1", "步骤2", "...（至少6步）"]
}
`;

    try {
        const content = problemIndex !== undefined
            ? await callLLMTracked(prompt, { model: 'reasoning', temperature: 0.3 }, problemIndex)
            : await callLLM(prompt, { model: 'reasoning', temperature: 0.3 });
        const cleanContent = content
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const baseProblem: BaseProblem = cleanAndParseJSON(cleanContent);
        const fixedProblem = validateAndFixProblemJSON(baseProblem);

        if (!fixedProblem.originalProblemText || !fixedProblem.coreData || !fixedProblem.referenceSteps) {
            throw new Error('Generated problem is incomplete: missing text, data, or steps.');
        }
        if (fixedProblem.referenceSteps.length < 3) {
            throw new Error('Reference solution path too short (minimum 3 steps required)');
        }

        return fixedProblem;

    } catch (error) {
        console.error("Physics Generator Error:", error);
        throw new Error(`Failed to generate base problem: ${error.message}`);
    }
}
