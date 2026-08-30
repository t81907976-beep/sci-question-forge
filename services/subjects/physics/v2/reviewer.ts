import { callLLM } from "../../../llmClient";
import { callLLMTracked } from "../costTracker";
import type { V2QuestionDraft } from "./generator";
import { cleanAndParseJSON } from "../../../utils/jsonCleaner";
import { callWithGatewayRetry } from "./gateway-retry";
import { sanitizeCoreData } from "./coredata-sanitizer";

/**
 * V2 Node A2/A3: Question Reviewer + Repair Loop
 *
 * API-2: Reviews question validity, difficulty, and logical depth.
 * API-3a: If issues found, selects repair strategy:
 *   - "deep"   → depthIssues present: aggressive rewrite of scenario/context
 *   - "detail" → only validity/difficulty issues: surgical small fixes
 * API-3b: Re-reviews after each repair.
 * Loop limit: 2 repair cycles.
 */


export interface ReviewResult {
    passed: boolean;
    validityIssues: string[];    // Physical/logical problems
    difficultyIssues: string[];  // Too easy, too hard, not competition-level
    depthIssues: string[];       // Template-like, missing branch, missing implicit constraint
    overallVerdict: string;
    /**
     * 不通过时，问题落在哪一层：
     *   'structural' —— 题面本身有问题（条件不自洽/量级荒谬/难度不够/缺判断分叉/教材原型）
     *   'answer_only' —— 题面合格，只有参考答案的数值、算术或单位换算出错
     * 后者是 A5 比较器的本职工作（comparator 明确要求重写一版正确解答），不该在 A2/A3 就丢题。
     * 由审查模型自己填；缺省按 'structural' 处理（保守）。
     */
    blockingScope?: 'structural' | 'answer_only';
}

export interface ReviewedDraft {
    draft: V2QuestionDraft;
    reviewResult: ReviewResult;
    repairCycles: number;
    needsRegeneration: boolean;
    // 'answer-repair-pending' 是本层新增：题面已合格、仅参考答案数值待 A5 修复。
    // orchestrator 只做 `!== 'stable'` 判断并写入 metadata，新增字面量对其它学科无影响。
    degradationLevel: 'stable' | 'oscillating' | 'diverging' | 'unrepairable' | 'answer-repair-pending';
    degradationReason: string;
}

async function reviewQuestion(draft: V2QuestionDraft, problemIndex?: number): Promise<ReviewResult> {
    // ─── 条件注入：根据知识点选择性加载方向专项审查条目 ───
    const kp = draft.knowledgePoint;

    const qmKeywords = ['量子', '波函数', '薛定谔', '测不准', '能级', '氢原子', '隧穿', '势阱', '本征', '算符', '期望值', '自旋', '角动量', '微扰', '波粒'];
    const emKeywords = ['电场', '磁场', '电磁', '高斯定理', '安培', '库仑', '电势', '电容', '电荷', '磁通', '电介质', '极化', '偶极子', '镜像法', '电磁感应', '法拉第', '楞次', '自感', '互感', '麦克斯韦', '位移电流', '电磁波', '交流', '阻抗', '谐振', 'RLC', 'RC', 'RL', '功率因数', '趋肤', '辐射'];
    const thermoKeywords = ['热力学', '熵', '内能', '热容', '绝热', '等温', '循环', '效率', '卡诺', '焦耳', '克劳修斯', '自由能', '焓', '熵增', '相变', '节流', '范德华', '热机', '制冷', '导热', '传热', '热传导'];
    const statPhysKeywords = ['统计力学', '麦克斯韦分布', '玻尔兹曼', '配分函数', '微观状态', '量子统计', '费米', '玻色', '系综', '涨落', '临界指数', '比热', 'BEC', '玻色凝聚', '费米面', '态密度', '声子', '德拜', '朗之万', '布朗运动', '相变', '序参量', 'Ising', 'Landau', '重整化'];
    const mechKeywords = ['牛顿', '力学', '动量', '冲量', '摩擦力', '弹力', '受力分析', '运动学', '加速度', '哈密顿', '拉格朗日', '正则变量', '相空间', '泊松括号', '变分', '最小作用量', '约束', '虚功', '达朗贝尔', '非惯性系', '科里奥利', '变质量', '转动', '力矩', '角动量', '转动惯量', '刚体', '陀螺', '进动', '章动', '滚动', '欧拉角', '功', '能量', '势能', '动能', '振动', '简谐', '共振', '阻尼', '碰撞', '散射', '耦合振子', '简正模', '流体', '伯努利', '粘度', '雷诺数', '层流', '湍流', '纳维', 'Navier', '涡度', '表面张力', '毛细'];

    const isQM = qmKeywords.some(kw => kp.includes(kw));
    const isEM = emKeywords.some(kw => kp.includes(kw));
    const isThermo = thermoKeywords.some(kw => kp.includes(kw));
    const isStatPhys = statPhysKeywords.some(kw => kp.includes(kw));
    const isMech = mechKeywords.some(kw => kp.includes(kw));

    // 光学关键词检测
    const opticsKeywords = ['干涉', '衍射', '偏振', '相干', '杨氏双缝', '薄膜', '光栅', '分辨率', '折射', '反射', '透镜', '成像', '光程', '费马原理', '光子统计', '琼斯矩阵', '波片', '马吕斯', '布儒斯特', '全反射', 'ABCD矩阵', '像差', '球差', '色差', '菲涅耳', '夫琅禾费', '法布里', '珀罗', '迈克尔逊', '光纤', '布拉格'];
    const isOptics = opticsKeywords.some(kw => kp.includes(kw));

    // 凝聚态-晶体物理关键词检测
    const condensedKeywords = ['晶体结构', '晶格', '布拉格衍射', 'X射线衍射', '密勒指数', '倒格矢', '倒空间', '布里渊区', '结构因子', '消光规律', '点群', '空间群', '原胞', 'Laue', '粉末衍射', '晶面间距', '倒格子', '晶系', '固体物理', '凝聚态'];
    const isCondensed = condensedKeywords.some(kw => kp.includes(kw));

    // 凝聚态-能带/半导体关键词检测
    const bandKeywords = ['能带', '布洛赫', '禁带', '导带', '价带', '半导体', '掺杂', 'pn结', '有效质量', '载流子', '迁移率', '霍尔效应', '量子阱', '超晶格', '异质结', '肖特基', 'Kronig-Penney', '紧束缚', '能隙', '带隙', '耗尽层'];
    const isBand = bandKeywords.some(kw => kp.includes(kw));

    // 凝聚态-磁性与超导关键词检测
    const magneticKeywords = ['铁磁', '反铁磁', '顺磁', '居里温度', '奈尔温度', '磁畴', '交换积分', 'Heisenberg', '超导', 'BCS', 'Cooper对', '迈斯纳', '伦敦方程', 'Ginzburg-Landau', '磁通量子', 'Josephson', '穿透深度', '相干长度', '自旋波', 'RKKY'];
    const isMagnetic = magneticKeywords.some(kw => kp.includes(kw));

    // 电动力学-辐射理论关键词检测
    const radiationKeywords = ['推迟势', 'Lienard-Wiechert', '李纳-维谢尔', '多极辐射', '电偶极辐射', '同步辐射', '回旋辐射', '轫致辐射', '辐射反作用', 'Abraham-Lorentz', '天线方向图', '天线增益', '辐射功率角分布', '赫兹偶极子', '辐射阻尼', 'Larmor', '拉莫公式'];
    const isRadiation = radiationKeywords.some(kw => kp.includes(kw));

    // 电动力学-波导与谐振腔关键词检测
    const waveguideKeywords = ['波导', '截止频率', 'TE模', 'TM模', '谐振腔', '品质因子', '传输线', '特性阻抗', 'Smith圆图', '阻抗匹配', '驻波比', '介质波导', '光纤模式', 'V参数', '贝塞尔函数波导', '微带线', '同轴线'];
    const isWaveguide = waveguideKeywords.some(kw => kp.includes(kw));

    // 电动力学-相对论性电动力学关键词检测
    const relativisticEDKeywords = ['电磁场张量', '四维势', '协变Maxwell', '规范变换', '洛伦兹规范', '库仑规范', '电磁能动张量', '电磁场洛伦兹变换', 'Čerenkov', '切伦科夫', '对偶张量', '规范不变性', '电磁场不变量', '相对论性辐射'];
    const isRelativisticED = relativisticEDKeywords.some(kw => kp.includes(kw));

    const plasmaKeywords = ['等离子体', 'Debye屏蔽', '德拜屏蔽', '德拜长度', 'Debye长度', '等离子体频率', '等离子体振荡', '准中性', '回旋频率', '拉莫尔半径', '磁约束', '磁镜', '绝热不变量', '磁矩不变量', 'E×B漂移', '梯度漂移', '曲率漂移', '磁流体力学', 'MHD', '磁压强', '冻结磁通', 'Alfvén', '阿尔芬', '磁重联', 'Spitzer电阻率', '库仑对数', 'Saha方程', '萨哈方程', 'Grad-Shafranov', '箍缩', 'Bennett关系', '比压β', '朗道阻尼', 'Landau阻尼', 'Langmuir波', '朗缪尔波', '离子声波', 'Bohm-Gross', '磁声波', '哨声波', 'whistler', '上混杂', '下混杂', '双流不稳定', 'two-stream', 'Buneman', 'Penrose判据', 'Vlasov', '弗拉索夫', '介电张量等离子体', '色散张量'];
    const isPlasma = plasmaKeywords.some(kw => kp.includes(kw));

    // 维度1 方向专项合理性
    const validity_qm = isQM ? `\n- 量子数组合(n,l,m)是否合法？波函数边界条件是否自洽？算符是否厄米（要求期望值时）？能级排序是否正确？近似条件（WKB/微扰/绝热）的适用参数是否满足？` : '';

    const validity_plasma = isPlasma ? `\n- 是否检验了等离子体判据（λ_D≪L准中性、N_D=nλ_D³≫1集体行为）？若题目处于判据边界须显式讨论\n- 等离子体频率是否只取电子质量（离子太重跟不上快振荡）？Landau阻尼是否用动理学Vlasov而非流体模型？\n- 离子声波是否要求T_e≫T_i（否则强离子Landau阻尼）？磁压强是否为B²/2μ₀（含因子2）？` : '';

    // 维度1.5 方向专项参数检查
    const params_qm = isQM ? `
- 耦合方案是否与Z值匹配？（Z>70必须用jj耦合；Z<30用LS耦合；30<Z<70需说明）
- 声称的跃迁是否满足选择定则？（E1: Δl=±1且宇称改变；同类粒子E1被Laporte规则禁戒）
- 所用物理模型是否在其适用域内？（类氢模型限单电子；Rydberg碱金属需量子亏损；激子模型需L>>a_B*）
- 空间维度是否全程一致？（二维体系不讨论z方向物理量）
- 近似判据是否物理自洽？（RWA要求弱驱动且近共振；87Rb微波RWA精度~10⁻¹²不可能失效）
- 偶极矩等物理量的单位是否正确？（μ的单位是C·m或D(德拜)，不是Hz）` : '';

    const params_em = isEM ? `
- 介质参数ε_r是否与声称材料匹配（水~80，玻璃~4-10，ε_r<1在自然材料中不存在）？
- 互感|M|≤√(L₁L₂)是否满足？自感L>0是否满足？
- 趋肤深度δ=√(2/(ωμσ))与给定频率和材料是否自洽？
- 功率因数cosφ∈[0,1]是否满足？谐振参数f₀=1/(2π√(LC))是否数值自洽？
- 开关动作瞬间电感电流和电容电压是否满足换路定律（不突变）？` : '';

    const params_thermo = isThermo ? `
- 绝热与等温是否在同一过程中互斥？"完全隔热"与"温度恒定"是否矛盾共存？
- 卡诺效率中温度是否用开尔文而非摄氏度？范德华参数(a,b)与给定临界参数(T_c,V_c,p_c)是否自洽？
- 热容C_p/C_v的使用是否与过程类型匹配？比热比γ是否与气体种类一致（单原子5/3，双原子7/5）？
- 焦耳-汤姆逊效应的温度变化方向是否与气体种类和工作温度匹配（氢/氦常温下节流升温）？` : '';

    const params_statPhys = isStatPhys ? `
- 经典/量子统计选择是否正确（nλ_th³<<1经典，≥1量子）？费米子/玻色子统计是否与粒子自旋匹配？
- 费米能E_F是否与声称材料匹配（金属电子1-15eV：铜7.0eV、铝11.7eV、钠3.2eV）？偏差>3倍需解释
- 低维(1D/2D)均匀系统中是否错误讨论BEC？（Mermin-Wagner定理禁止；仅陷阱势下可能）
- 玻色气体化学势μ≤0是否满足？（BEC时μ=0为上界，μ>0物理不可能）
- 能均分定理是否在量子区域(k_BT≲ℏω)误用？低温下振动自由度冻结不贡献½k_BT
- 临界指数是否满足Rushbrooke标度律α+2β+γ=2？违反标度律说明参数自相矛盾
- 德拜温度Θ_D是否与声称材料匹配（铜343K、铝428K、铁470K、铅105K）？有效质量m*是否合理？
- 非相对论/相对论判据是否自洽？费米动量p_F与m_e c比较：p_F<<m_e c非相对论，p_F~m_e c需相对论修正（白矮星电子通常为相对论性）` : '';

    const params_mech = isMech ? `
- 摩擦系数μ是否在合理范围（0~1.5），与声称材料匹配？恢复系数e∈[0,1]？
- 转动惯量I值是否与声称的几何形状一致（薄圆盘½MR²、实心球⅖MR²等）？
- 使用拉格朗日/哈密顿方法时，约束类型（完整/非完整）是否正确识别？非完整约束是否错误地用减少自由度方法处理？
- 伯努利方程的使用条件是否满足（不可压缩Ma<0.3、沿同一流线、定常流动、无粘流体）？
- 雷诺数Re是否与声称的流态（层流/湍流）一致（管道流层流Re<2300）？` : '';

    const params_optics = isOptics ? `
- 折射率n≥1是否满足？给定n值是否与声称材料匹配（水1.33、玻璃1.5-1.9、金刚石2.42）？
- 光栅常数d是否>λ？缺级条件d/a与讨论的级次是否自洽？
- 干涉光程差是否超过相干长度L_c=λ²/Δλ？超过则无条纹，题目不成立
- 薄膜干涉中半波损失判断是否逐界面独立进行？两界面的n₁与n₂大小关系是否正确？
- ABCD矩阵乘法次序是否正确（M_N·...·M_1，M_1为最先经过的元件）？
- 全反射条件是否仅在光密→光疏方向设置？从光疏→光密不可能全反射` : '';

    const params_condensed = isCondensed ? `
- 晶格常数与声称材料是否匹配？（Si≈5.43Å、Cu≈3.62Å、Fe(BCC)≈2.87Å、NaCl≈5.64Å，偏差>1%需要解释）
- 消光规律是否正确应用？（FCC：hkl全奇或全偶；BCC：h+k+l为偶数；SC：无消光）
- 密勒指数(hkl)是否互质？结构因子中原子坐标是否使用分数坐标(0-1)而非笛卡尔坐标？
- 布拉格定律sinθ≤1是否满足？X射线波长与晶格常数量级(~Å)是否匹配？
- 配位数是否与结构匹配？（SC=6、BCC=8、FCC=12、金刚石=4）` : '';

    const params_band = isBand ? `
- 有效质量是否区分了态密度有效质量m_dos和电导率有效质量m_cond？（Si导带：m_dos≈1.08m_e vs m_cond≈0.26m_e，差4倍）
- Si(间接带隙1.12eV)/GaAs(直接带隙1.42eV)是否搞反？带隙类型是否正确？
- pn结内建电位V_bi是否<E_g/q？（超过带隙=参数矛盾）
- 本征载流子浓度n_i是否与材料和温度匹配？（Si@300K: ~1.5×10¹⁰cm⁻³，不可视为常数）
- 霍尔系数R_H=1/(nq)是否仅用于单载流子？双载流子是否用完整公式？
- 迁移率是否考虑了温度和散射机制依赖？（电离杂质μ∝T^{3/2}，声学声子μ∝T^{-3/2}）` : '';

    const params_magnetic = isMagnetic ? `
- 磁通量子是否使用Φ₀=h/(2e)？（分母2e=Cooper对电荷，不是e）
- GL参数κ分界值是否为1/√2≈0.707？（不是κ=1）
- 第一类/第二类超导体是否混淆？（第一类无混合态；第二类有H_{c1}<H<H_{c2}混合态）
- BCS弱耦合2Δ(0)=3.53kT_c是否正确应用？强耦合超导体是否偏离此值？
- 居里/奈尔温度是否与声称材料匹配？（Fe: T_C=1043K, Ni: T_C=627K, Co: T_C=1388K）
- Bloch T^{3/2}定律是否仅用于T<<T_C？接近T_C时是否用临界行为M∝(T_C-T)^β？
- 交换积分J的符号约定是否全题一致？（H=-JΣS·S: J>0铁磁, J<0反铁磁）` : '';

    const params_radiation = isRadiation ? `
- 推迟时间t_ret是否正确处理为隐方程（运动电荷位置依赖t_ret本身）？是否错误使用固定距离近似？
- Larmor公式是否在v<<c条件下使用？γ>>1时是否使用了相对论推广（区分横向γ⁴和纵向γ⁶）？
- 多极辐射级次是否正确？电偶极矩为零的对称体系是否跳过了E1直接用M1或E2？
- 辐射场(∝1/r)是否与近场/速度场(∝1/r²)正确区分？远场条件r>>λ/(2π)是否满足？
- 同步辐射临界频率ω_c=(3/2)γ³c/ρ的γ和ρ是否与粒子能量和轨道半径自洽？
- 天线辐射电阻R_rad值是否与声称的天线类型匹配（半波振子73Ω，短偶极子~20(l/λ)²Ω）？` : '';

    const params_waveguide = isWaveguide ? `
- 截止频率公式是否与波导类型(矩形/圆柱)和模式(TE/TM)匹配？TE₀₀和TM_m0/TM_0n不存在是否被避免？
- 相速度v_p>c是否被误解为违反相对论？是否明确群速度v_g<c才是信号速度？
- 贝塞尔函数零点值是否正确引用？(TE₁₁: x'₁₁=1.841, TM₀₁: x₀₁=2.405)
- Q值计算中有载Q_L和无载Q_0是否区分？是否满足Q_L<Q_0？
- Smith圆图旋转方向是否正确（负载向源=顺时针，2βl弧度）？
- 传输线特性阻抗是否与结构参数自洽？（同轴Z₀=60ln(b/a)/√ε_r，微带有经验公式）
- 光纤V参数是否与声称的单模/多模工作条件一致？（单模V<2.405）` : '';

    const params_relativisticED = isRelativisticED ? `
- 度规符号约定(+---或-+++)是否全题统一？F^{μν}分量符号是否与所用约定一致？
- E和B是否被错误地当作独立四矢量分别变换？（正确：它们是F^{μν}的分量，变换时混合）
- 电磁场不变量I₁=2(B²-E²/c²)和I₂=(4/c)E·B是否正确计算？变换前后是否守恒？
- Čerenkov辐射条件βn>1是否满足？真空中是否错误讨论Čerenkov效应？
- 规范选择（Lorenz/库仑）是否明确声明？在非Lorenz规范下是否错误地使用解耦波动方程？
- T^{μν}无迹条件T^μ_μ=0是否满足？能量密度和动量密度的关系是否正确(g=S/c²)？` : '';

    const params_plasma = isPlasma ? `
- Debye长度λ_D=7430√(T[eV]/n[m⁻³])m、等离子体频率f_pe=8980√(n[m⁻³])Hz是否数值自洽？声称的n、T是否落在合理体系（实验室~10¹⁸m⁻³、电离层~10¹²、太阳风~10⁷）？
- 是否检验了等离子体判据N_D=nλ_D³≫1？强耦合(N_D≲1)或非准中性(λ_D≳L)体系是否被误当理想等离子体？
- 磁压强是否为p_B=B²/2μ₀（含因子2，非B²/μ₀）？比压β=2μ₀nk_BT/B²是否物理合理(β≳1磁场约束不住)？
- 回旋频率/拉莫尔半径是否区分电子离子（质量差→方向反、量级差）？Alfvén速度v_A=B/√(μ₀ρ)是否含离子质量数？
- Bohm-Gross热修正系数是否为3（绝热，非等温1）？离子声速是否用T_e而非T_i？
- Saha方程的n_e是否被错误当作已知常数（应隐式自洽联立电荷守恒迭代）？
- 截止(k→0,N²=0,反射)与共振(k→∞,N²→∞,吸收)是否混淆？whistler是否误写成线性色散ω∝k（应为反常ω∝k²）？` : '';


    // 维度3 方向专项逻辑深度
    const depth_qm = isQM ? `
- 是否回避了标准教材原型（无限深势阱求能级/简谐振子升降算符/氢原子径向方程的直接求解）？是否需要物理判断（近似有效性判断、简并vs非简并判断、选择定则验证）而非纯数学操作？
- 涉及具体物理体系时：参数是否来自真实实验数据或合理外推（而非随意编造的数值）？所用模型是否对该体系有效？` : '';

    const depth_em = isEM ? `
- 是否回避了标准教材原型（平行板电容器直接求场/无限长直导线求B/匀强磁场矩形线圈旋转求ε）？是否需要物理判断（边界条件分区处理、近似适用性、近场vs远场判据）而非直接套公式？
- 是否回避了简单串并联+欧姆定律代入的结构？是否涉及瞬态分析、频域分析或非理想元件效应等深层概念？` : '';

    const depth_thermo = isThermo ? `
- 是否回避了标准教材原型（理想气体卡诺循环直接代公式/单纯等温膨胀ΔS=nRln(V₂/V₁)的代入题）？是否需要学生独立判断过程类型（可逆vs不可逆）、选择正确的计算路径（不可逆过程需设计可逆替代路径求ΔS）、或验证理想气体近似是否适用？` : '';

    const depth_statPhys = isStatPhys ? `
- 是否回避了标准教材原型（理想气体配分函数的直接套用/能均分定理的简单计算/标准三维自由电子气E_F直接代入/标准BEC临界温度T_c∝n^{2/3}直接代入/德拜模型低温C∝T³直接验证）？
- 是否涉及非标准态密度系统（低维电子气+Landau量子化、陷阱BEC重新积分态密度、相对论简并气体完整色散关系）而非教科书标准模型？
- 是否有多步数值耦合链（前一小问结果作为后续计算必要输入，≥3层依赖）？单步代入计算判定为深度不足
- 是否要求模型自洽性事后验证（如居里定律算出的终温是否仍在有效范围、非相对论公式算出的动量是否确实<<mc）？缺少自洽性检验判定为深度不足
- 是否涉及散射/弛豫机制分析（多种散射率的温度标度、交叉温度判断、宏观输运性质峰值的物理成因）或仅为单一公式代入？
- 若为相变方向：是否包含定量验证步骤（Ginzburg判据验证平均场有效性、精确解与平均场偏差分析、有限尺寸标度修正）？纯定性描述相变判定为深度不足` : '';

    const depth_mech = isMech ? `
- 是否回避了标准教材原型（简单斜面滑块、标准阿特伍德机、简单弹簧-质点系统ω=√(k/m)）？是否需要物理判断（约束类型判断、近似有效性、守恒量识别）而非直接代公式？是否涉及分析力学框架（拉格朗日/哈密顿）或非惯性系效应？
- 是否回避了简单代入I公式或ω=√(k/m)的结构？是否涉及非线性效应、耦合振子简正模分析、或散射问题的参考系转换等需要深层分析的内容？
- 若为流体力学：是否回避了标准伯努利方程直接代入的结构？是否涉及粘性效应（NS方程简化）、可压缩性判断、边界层分析或无量纲分析（Reynolds/Mach数）等深层概念？` : '';

    const depth_optics = isOptics ? `
- 是否回避了标准教材原型（杨氏双缝直接代Δy=λL/d、正入射薄膜干涉直接代δ=2nd±λ/2、薄透镜公式直接代入、单缝衍射暗纹条件asinθ=mλ直接代入）？
- 是否涉及多层膜/多元件级联、部分相干性分析、琼斯矩阵计算、像差定量估算、或光场量子统计等需要深层分析的内容？
- 是否需要物理判断（近轴近似有效性、夫琅禾费vs菲涅耳适用域、相干条件验证）而非直接套公式？` : '';

    const depth_condensed = isCondensed ? `
- 是否回避了标准教材原型（立方d=a/√(h²+k²+l²)直接代入布拉格公式求θ、FCC/BCC配位数直接背诵、简单密堆积填充率直接引用）？
- 是否包含消光规律判断分叉（先判晶格类型再决定哪些峰允许）、多基元结构因子完整计算、逆问题（从衍射数据反推结构）等高防御元素？
- 是否涉及非立方晶系或倒空间几何构造等需要深层分析的内容？` : '';

    const depth_band = isBand ? `
- 是否回避了标准教材原型（无限深量子阱E_n∝n²直接代入、肖克利方程I=I₀(e^{qV/kT}-1)直接代入、耗尽层宽度W=√(2εV/qN)直接代入）？
- 是否涉及有效质量辨析（态密度vs电导率有效质量）、多载流子霍尔效应、间接带隙声子辅助吸收等需要深层分析的内容？
- 是否包含模型适用性判断（有限深vs无限深势阱、简并vs非简并半导体、大注入vs小注入）等判断分叉？` : '';

    const depth_magnetic = isMagnetic ? `
- 是否回避了标准教材原型（居里定律χ=C/T直接代入、伦敦方程B=B₀exp(-x/λ)直接解、磁通量子Φ=nΦ₀直接计数）？
- 是否涉及自洽方程求解（BCS能隙方程、GL方程、分子场方程）、自旋波色散推导、或涡旋结构分析等需要深层计算的内容？
- 是否包含判断分叉（第一类vs第二类超导判断、弱耦合vs强耦合BCS、Bloch定律适用域判断）？` : '';

    const depth_radiation = isRadiation ? `
- 是否回避了标准教材原型（Larmor公式P=q²a²/(6πε₀c³)直接代入、电偶极辐射角分布sin²θ直接画图、天线辐射电阻直接引用数值）？
- 是否涉及推迟时间隐方程的自洽求解、多极级次判断（对称性禁戒分析）、辐射反作用力的因果律讨论等需要深层物理分析的内容？
- 是否包含判断分叉（非相对论vs相对论Larmor判断、近场vs远场区域判断、辐射多极级次的对称性判断）？` : '';

    const depth_waveguide = isWaveguide ? `
- 是否回避了标准教材原型（矩形波导TE₁₀截止频率直接代入、同轴线Z₀=60ln(b/a)直接代入、单stub匹配的标准步骤）？
- 是否涉及谐振腔Q值的完整壁损耗积分计算、模式耦合分析、多级匹配网络带宽约束等需要深层计算的内容？
- 是否包含判断分叉（单模vs多模工作判断、衰减模vs传播模判断、介质波导导模条件V参数判断）？` : '';

    const depth_relativisticED = isRelativisticED ? `
- 是否回避了标准教材原型（F^{μν}定义直接写出、Lorenz不变量直接代入验证、Čerenkov角cosθ=1/(nβ)直接代入）？
- 是否涉及完整的张量Lorentz变换计算、规范等价性证明、能量动量张量守恒律推导等需要深层张量运算的内容？
- 是否包含判断分叉（通过不变量判断特殊参考系是否存在、规范选择对方程形式的影响判断、色散介质对Čerenkov频谱的截断判断）？` : '';

    const depth_plasma = isPlasma ? `
- 是否回避了标准教材原型（Debye长度公式直接代入、等离子体频率f_pe=8980√n单步计算、Bohm-Gross/Alfvén速度/离子声速直接代入、给定"已不稳定"套双流增长率公式）？
- 是否涉及高防御结构：等离子体判据逆向验证（给边界态判定是否理想等离子体）、Landau阻尼围道解析延拓（非取主值）、复色散关系求根判失稳、非均匀场多漂移叠加+电荷分离、Saha隐式自洽迭代、MHD平衡∇p=J×B求解+稳定性判据？
- 是否包含判断分叉（绝热不变量μ守恒是否成立、截止vs共振判定、各波模在给定频率传播/截止/共振、Penrose判据失稳判定、理想vs电阻性MHD）？` : '';


    const prompt = `你是物理竞赛题目审核专家，需要从三个维度独立审查以下题目。

【题目】：
${draft.questionText}

【参考答案】：
${draft.referenceAnswer}

【审查维度 1 - 题目合理性】：
- 物理条件是否自洽（如等温/绝热/等容/等压不矛盾）？
- 物理常数是否准确（N_A、R、k_B 等）？
- 条件是否充分（能否唯一求解）？
- 数值是否在合理范围（如液体操作温度低于沸点）？
- 答案与题目是否对应？${validity_qm}${validity_plasma}

【审查维度 1.5 - 参数物理可实现性（此维度审查权重最高——直接决定题目是否为废题）】：
- 粒子质量是否与声称的粒子种类匹配？（电子0.511MeV/c²、μ子105.7MeV/c²、质子938.3MeV/c²不可混淆）
- 能量量级是否与物理体系匹配？（原子~eV、分子振动~0.01-0.5eV、核~MeV，偏差>3个数量级必须有物理解释）
- 长度量级是否与物理体系匹配？（原子~0.1nm、量子点~1-100nm、核~fm）${params_qm}${params_em}${params_thermo}${params_statPhys}${params_mech}${params_optics}${params_condensed}${params_band}${params_magnetic}${params_radiation}${params_waveguide}${params_relativisticED}${params_plasma}

【审查维度 2 - 难度合理性】：
- 是否达到全国物理竞赛/研究生考试水平？
- 推理步骤是否 ≥5 步（不是简单代入公式）？
- 是否考察了深层概念理解，而非表面记忆？

【审查维度 3 - 结构性防御深度（此维度关乎题目对AI的固有抵抗力，权重极高）】：

3A. 判断分叉点验证（缺失=不通过）：
- 解题过程中是否存在至少一个"先判断条件/近似/模型是否成立→再决定推导路径"的节点？
- ⚠️ 以下不算有效分叉：题目直接说"假设满足XX"（这是给定条件不是判断）；答案中说"因为XX所以YY"但无需计算验证（这是简单推理不是分叉）
- 有效分叉的标志：需要通过计算某个判据参数（如Re数、微扰参数λ、量子简并参数nλ³）来决定后续路径

3B. 隐含条件验证（缺失=不通过）：
- 是否有至少一个解题必需的关键条件没有显式写在题面上？
- ⚠️ 以下不算有效隐含：题目没提但答案直接假设且无需推导（如"设初速度为零"但题目没说）——这是条件不足不是隐含条件
- 有效隐含的标志：必须从物理图像/守恒律/对称性中推导出来（如"封闭系统→粒子数守恒"、"稳态→时间导数为零"）

3C. 单位/量纲壁垒验证（缺失=扣分但可通过）：
- 解题过程中是否存在至少一次单位换算节点或形似量辨析节点？
- 如果题目中所有量都是SI单位且无易混淆量对出现 → 记录为"缺少量纲壁垒"

3D. 教材原型检测（命中=不通过）：
- 是否是教材原型题/模板题？（如果题目结构和常见教材例题高度相似，判定为不通过）
- 是否是"已知A和B，代入公式求C"的直接代入型结构？${depth_qm}${depth_em}${depth_thermo}${depth_statPhys}${depth_mech}${depth_optics}${depth_condensed}${depth_band}${depth_magnetic}${depth_radiation}${depth_waveguide}${depth_relativisticED}${depth_plasma}

输出必须是严格 JSON，不含 markdown 代码块：
{
  "passed": true 或 false,
  "validityIssues": ["问题1"],
  "difficultyIssues": ["问题1"],
  "depthIssues": ["问题1"],
  "blockingScope": "structural" 或 "answer_only",
  "overallVerdict": "一句话总结审查结论"
}

注意：三个维度全部无问题才可 passed 为 true。depthIssues 中需明确说明是哪条不满足。

blockingScope 填写规则（passed 为 true 时填 "answer_only" 即可，不影响判定）：
- 填 "answer_only" 的**充分必要**条件：题面本身完全合格——维度1条件自洽、维度1.5量级可实现、维度2难度达标、维度3的判断分叉/隐含条件/非教材原型全部满足——**剩余问题只出现在参考答案的数值计算、算术、单位换算或代入错误上**，题面一个字都不用改。
- 只要题面需要改动（缺条件、量级荒谬、难度不够、缺判断分叉、缺隐含条件、命中教材原型），一律填 "structural"。
- 判断标准是「改答案还是改题面」，不是「问题严重不严重」。参考答案差十倍量级也属于 "answer_only"，因为改的是答案。`;

    const raw = (await callWithGatewayRetry(
        () => problemIndex !== undefined
            ? callLLMTracked(prompt, { model: 'reasoning', temperature: 0.2, reasoning: { effort: 'xhigh', summary: 'auto' } }, problemIndex)
            : callLLM(prompt, { model: 'reasoning', temperature: 0.2, reasoning: { effort: 'xhigh', summary: 'auto' } }),
        'A2 审查',
    )).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return {
            passed: false,
            validityIssues: ["Failed to parse review response"],
            difficultyIssues: [],
            depthIssues: [],
            overallVerdict: "审查响应解析失败",
            blockingScope: 'structural'
        };
    }
    try {
        return normalizeReviewResult(cleanAndParseJSON(jsonMatch[0]));
    } catch (e) {
        return {
            passed: false,
            validityIssues: [`JSON parse failed: ${(e as Error).message}`],
            difficultyIssues: [],
            depthIssues: [],
            overallVerdict: "审查响应解析失败",
            blockingScope: 'structural'
        };
    }
}

/**
 * 审查输出归一化。
 *
 * 原来是 `as ReviewResult` 裸转型：审查模型少写一个 depthIssues 字段，下游
 * `review.depthIssues.length` 就抛 TypeError，冒到 orchestrator 唯一的 catch 里整题变 null——
 * 和网关断流是同一类「一次抖动报废整题」的损耗。这里全部兜成数组。
 */
function normalizeReviewResult(parsed: any): ReviewResult {
    const toStringArray = (value: unknown): string[] =>
        Array.isArray(value) ? value.filter(Boolean).map(String) : [];
    const scope = parsed?.blockingScope;
    return {
        passed: Boolean(parsed?.passed),
        validityIssues: toStringArray(parsed?.validityIssues),
        difficultyIssues: toStringArray(parsed?.difficultyIssues),
        depthIssues: toStringArray(parsed?.depthIssues),
        overallVerdict: String(parsed?.overallVerdict ?? ""),
        blockingScope: scope === 'answer_only' ? 'answer_only' : 'structural',
    };
}

// ─── Deep Repair ────────────────────────────────────────────────────────────
// Used when depthIssues are present. Allows aggressive scenario rewrite.
async function deepRepairQuestion(
    draft: V2QuestionDraft,
    review: ReviewResult,
    cycleNumber: number,
    problemIndex?: number
): Promise<V2QuestionDraft> {
    const depthList = review.depthIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n");
    const otherIssues = [...review.validityIssues, ...review.difficultyIssues];
    const otherList = otherIssues.length > 0
        ? "\n【同时需要修复的合理性/难度问题】：\n" + otherIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n")
        : "";

    const prompt = `你是物理竞赛题目深度重写专家。本题存在逻辑深度不足的问题，需要较大幅度改写。（第 ${cycleNumber} 次修复 — 深度模式）

【当前题目】：
${draft.questionText}

【当前参考答案】：
${draft.referenceAnswer}

【逻辑深度问题（本次修复的核心）】：
${depthList}
${otherList}

【深度修复规则（必须全部执行）】：
1. 核心考察维度保持不变（${draft.chosenDimension}）——但情境、数字、背景可以完全替换
2. 【强制-判断分叉】：题目必须包含真正的判断分叉——解题者在推导中途必须先通过计算某判据参数来验证某条件是否成立，才能选择后续路径；不能在题目中直接给出走哪条路的提示
3. 【强制-隐含条件】：题目必须有至少一个隐含条件——删除一个显式约束，改为让学生从物理守恒律/边界条件/系统封闭性/对称性等自行推断
4. 【强制-量纲壁垒】：题目中至少包含一处单位混用（非SI与SI混用）或两个外观相似但含义不同的物理量同时出现
5. 若原题是教材模板：必须更换背景（如从质点力学换到连续介质，或从真空电磁场换到介质中的电磁场），并引入跨概念融合
6. 若题目缺少物理常数（如 ε₀、N_A、R、k_B、F）：在题目和答案中显式列出所需常数及其精确数值，确保无需查表即可解题
7. 【强制-禁止把结论补进题面】若需要向题面补充数据，只能补**原始给定量**（几何尺寸、材料参数、外加场强、实验读数等独立输入）。绝对禁止把由这些量推导出来的中间量、比值、"在某点求值"的量或最终答案写进题面——那等于把答案告诉解题者，题目防御力归零。缺条件的正确修法是补上游的原始输入，不是补下游的计算结果。
8. 【coreData 语义边界】coreData 只列题面里字面写出的原始已知量，写法与题面一致；推导量/中间量/结果量/答案一律不填，也不得出现计算残留的浮点尾巴（如 11.623892818）
9. 修复后推理步骤必须 ≥5 步

输出必须是严格 JSON，不含 markdown 代码块：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${draft.chosenDimension}",
  "questionText": "深度修复后的完整题目",
  "coreData": {"物理量名称": {"value": 数值, "unit": "单位"}},
  "requiredAnswer": "${draft.requiredAnswer}",
  "referenceAnswer": "重写后的完整分步解答，含公式推导和数值代入",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]
}`;

    const raw = (await callWithGatewayRetry(
        () => problemIndex !== undefined
            ? callLLMTracked(prompt, { model: 'reasoning', temperature: 0.5, reasoning: { effort: 'high', summary: 'auto' } }, problemIndex)
            : callLLM(prompt, { model: 'reasoning', temperature: 0.5, reasoning: { effort: 'high', summary: 'auto' } }),
        `A3 深度修复(第${cycleNumber}轮)`,
    )).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return draft;

    try {
        const repaired = cleanAndParseJSON(jsonMatch[0]) as V2QuestionDraft;
        repaired.problemId = draft.problemId;
        repaired.knowledgePoint = draft.knowledgePoint;
        repaired.chosenDimension = draft.chosenDimension;
        // 修复会整体重写 coreData，脏数据同样会重新出现，故每轮都净化一次。
        repaired.removedCoreData = sanitizeCoreData(repaired, `A3 深度修复(第${cycleNumber}轮)`);
        return repaired;
    } catch (e) {
        console.warn(`[Reviewer] deepRepair JSON parse failed (cycle ${cycleNumber}):`, e);
        return draft;
    }
}

// ─── Detail Repair ───────────────────────────────────────────────────────────
// Used when only validity/difficulty issues remain (no depth issues).
// Surgical fixes only — does not rewrite scenario.
async function detailRepairQuestion(
    draft: V2QuestionDraft,
    review: ReviewResult,
    cycleNumber: number,
    problemIndex?: number
): Promise<V2QuestionDraft> {
    const allIssues = [...review.validityIssues, ...review.difficultyIssues];
    const issueList = allIssues.map((issue, i) => `${i + 1}. ${issue}`).join("\n");

    const prompt = `你是物理竞赛题目细节修复专家。本题仅需修复合理性或难度问题，不改变题目情境和结构。（第 ${cycleNumber} 次修复 — 细节模式）

【当前题目】：
${draft.questionText}

【当前参考答案】：
${draft.referenceAnswer}

【需要修复的问题】：
${issueList}

【细节修复规则】：
1. 只修复上述列出的问题，保持题目情境、背景、结构不变
2. 若涉及物理常数缺失（如 ε₀、N_A、R、k_B、F）：在题目和答案中补充该常数的精确数值（例：真空介电常数 ε₀ = 8.854×10⁻¹² C²/(N·m²)），确保题目自洽
3. 若数值超出合理范围：修正为物理上合理的数值，并同步更新 coreData 和答案
4. 保持逻辑深度不降低（不得删除已有的判断分叉或隐含条件）
5. 【强制-禁止把结论补进题面】若审查意见是"题面缺条件"，只能补**原始给定量**（几何尺寸、材料参数、外加场强、实验读数等独立输入）。绝对禁止把由这些量推导出来的中间量、比值、"在某点求值"的量或最终答案写进题面——那等于把答案告诉解题者，题目防御力归零。缺条件的正确修法是补上游的原始输入，不是补下游的计算结果。
6. 【coreData 语义边界】coreData 只列题面里字面写出的原始已知量，写法与题面一致；推导量/中间量/结果量/答案一律不填，也不得出现计算残留的浮点尾巴（如 0.03723369）
7. 修复后重新给出与修正后题目完全对应的参考答案

输出必须是严格 JSON，不含 markdown 代码块：
{
  "problemId": "${draft.problemId}",
  "knowledgePoint": "${draft.knowledgePoint}",
  "chosenDimension": "${draft.chosenDimension}",
  "questionText": "细节修复后的完整题目",
  "coreData": {"物理量名称": {"value": 数值, "unit": "单位"}},
  "requiredAnswer": "${draft.requiredAnswer}",
  "referenceAnswer": "修复后的完整分步解答",
  "referenceSteps": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"]
}`;

    const raw = (await callWithGatewayRetry(
        () => problemIndex !== undefined
            ? callLLMTracked(prompt, { model: 'reasoning', temperature: 0.2, reasoning: { effort: 'high', summary: 'auto' } }, problemIndex)
            : callLLM(prompt, { model: 'reasoning', temperature: 0.2, reasoning: { effort: 'high', summary: 'auto' } }),
        `A3 细节修复(第${cycleNumber}轮)`,
    )).trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return draft;

    try {
        const repaired = cleanAndParseJSON(jsonMatch[0]) as V2QuestionDraft;
        repaired.problemId = draft.problemId;
        repaired.knowledgePoint = draft.knowledgePoint;
        repaired.chosenDimension = draft.chosenDimension;
        // 同 deepRepair：修复整体重写 coreData，每轮都要净化。
        repaired.removedCoreData = sanitizeCoreData(repaired, `A3 细节修复(第${cycleNumber}轮)`);
        return repaired;
    } catch (e) {
        console.warn(`[Reviewer] detailRepair JSON parse failed (cycle ${cycleNumber}):`, e);
        return draft;
    }
}

// ─── Strategy Router ─────────────────────────────────────────────────────────
async function repairQuestion(
    draft: V2QuestionDraft,
    review: ReviewResult,
    cycleNumber: number,
    problemIndex?: number
): Promise<V2QuestionDraft> {
    if (review.depthIssues.length > 0) {
        return deepRepairQuestion(draft, review, cycleNumber, problemIndex);
    }
    return detailRepairQuestion(draft, review, cycleNumber, problemIndex);
}

/**
 * 「仅答案问题」放行。
 *
 * 起因（0827 真机批量）：
 *   [V2] Problem 3: review not fully passed after 2 repair(s).
 *   题目整体物理结构完整、难度和判断分叉均达到较高竞赛或研究生考试水平…
 *   但参考答案第(8)问的碰撞频率及平均自由程存在十倍数量级错误
 * 审查自己承认题面全部合格，只有参考答案算错，orchestrator 仍按 `!passed` 把整题丢弃。
 * 而 A5 比较器（comparator）的职责恰好就是这件事——它被明确要求「必须在 finalSolutionText
 * 中重写一版正确、完整、可直接导出的标准解答」，还带 solutionRepaired 字段。丢弃点在 A2/A3，
 * 修复能力在 A4/A5，题永远等不到能救它的那一步。
 *
 * 所以这里在物理层把这类题放行到 A4/A5，代价是打上降级标记：
 *   degradationLevel !== 'stable' → orchestrator 把 qualityLevel 判为 'degraded'，
 * 永远不会被误标成 verified，人工质检照常能筛出来。原始 issues 和 overallVerdict 全部保留，
 * 不隐藏任何审查意见。
 *
 * 三道结构性安全网，防止审查模型乱填 answer_only 把模板题混进来：
 *   1. depthIssues 必须为空（3A 判断分叉 / 3B 隐含条件 / 3D 教材原型全过）——防御力全靠这一维
 *   2. difficultyIssues 必须为空
 *   3. blockingScope 必须由审查显式填 'answer_only'
 * 三条缺一即维持丢弃。
 */
function answerOnlyPassthrough(result: ReviewedDraft): ReviewedDraft {
    const review = result.reviewResult;
    if (review.passed) return result;

    const noIssuesAtAll =
        review.validityIssues.length === 0 &&
        review.difficultyIssues.length === 0 &&
        review.depthIssues.length === 0;

    // 审查自相矛盾：判不通过却说不出任何一条问题。这是审查输出故障，不是题的问题。
    if (noIssuesAtAll) {
        console.warn(`[Reviewer] 审查判不通过但未给出任何具体问题（审查输出自相矛盾），放行并标记降级：${review.overallVerdict}`);
        return {
            ...result,
            reviewResult: { ...review, passed: true },
            needsRegeneration: false,
            degradationLevel: result.degradationLevel !== 'stable' ? result.degradationLevel : 'answer-repair-pending',
            degradationReason: result.degradationReason
                || `审查判不通过但零具体问题（审查输出自相矛盾），已放行交人工质检 — ${review.overallVerdict}`,
        };
    }

    const answerOnly =
        review.blockingScope === 'answer_only' &&
        review.depthIssues.length === 0 &&
        review.difficultyIssues.length === 0;
    if (!answerOnly) return result;

    const deferred = review.validityIssues.slice(0, 3).join('；');
    console.warn(`[Reviewer] 题面已合格、仅参考答案有数值问题，放行至 A4/A5 修复并标记降级：${deferred}`);
    return {
        ...result,
        reviewResult: { ...review, passed: true },
        needsRegeneration: false,
        degradationLevel: result.degradationLevel !== 'stable' ? result.degradationLevel : 'answer-repair-pending',
        degradationReason: result.degradationReason
            || `仅参考答案数值问题，已交 A4/A5 修复，需人工复核答案 — ${deferred}`,
    };
}

export async function reviewAndRepair(draft: V2QuestionDraft, problemIndex?: number): Promise<ReviewedDraft> {
    let current = draft;
    let repairCycles = 0;
    const allReviews: ReviewResult[] = [];

    // ── Round 1 ──────────────────────────────────────────────────────────────
    const review0 = await reviewQuestion(current, problemIndex);
    allReviews.push(review0);
    if (review0.passed) {
        return { draft: current, reviewResult: review0, repairCycles, needsRegeneration: false, degradationLevel: 'stable', degradationReason: '' };
    }

    current = await repairQuestion(current, review0, 1, problemIndex);
    repairCycles++;

    // ── Round 2 ──────────────────────────────────────────────────────────────
    const review1 = await reviewQuestion(current, problemIndex);
    allReviews.push(review1);

    const deg1 = detectDegradation(allReviews, repairCycles);
    if (deg1.degradationLevel !== 'stable') {
        return answerOnlyPassthrough({ draft: current, reviewResult: review1, repairCycles, needsRegeneration: true, ...deg1 });
    }

    if (review1.passed) {
        return { draft: current, reviewResult: review1, repairCycles, needsRegeneration: false, degradationLevel: 'stable', degradationReason: '' };
    }

    // 2nd repair: also attempt for validity-only issues (not just depth issues)
    if (review1.depthIssues.length === 0 &&
        review1.validityIssues.length === 0 &&
        review1.difficultyIssues.length === 0) {
        // All issues resolved but still not passed (edge case) — exit
        return answerOnlyPassthrough({ draft: current, reviewResult: review1, repairCycles, needsRegeneration: false, degradationLevel: 'stable', degradationReason: '' });
    }

    current = await repairQuestion(current, review1, 2, problemIndex);
    repairCycles++;

    // ── Round 3 (final review, no further repair) ─────────────────────────────
    const review2 = await reviewQuestion(current, problemIndex);
    allReviews.push(review2);

    const degFinal = detectDegradation(allReviews, repairCycles);
    return answerOnlyPassthrough({
        draft: current, reviewResult: review2, repairCycles,
        needsRegeneration: !review2.passed,
        degradationLevel: degFinal.degradationLevel,
        degradationReason: degFinal.degradationReason,
    });
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
