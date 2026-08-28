// 机械设计学科难度框架映射
//
// 结构对齐 materials/disciplines.ts 的六字段（name / supportedTypes / keywords /
// peak_difficulty / forbidden_errors / parameter_constraints / anti_pattern_strategies），
// 另加机械专属三字段：
//   standard_tables    —— 手册表与标准离散系列（"在多行中选对哪一行"属判断层）
//   criterion_branches —— 判据分叉点（选错分支即改答案，机械题最强的防御结构）
//   table_anchors      —— 手册表不变量（角色/单调方向/量级带），拦"表体被造反"
//
// 键名一律 md- 前缀：materials 已占用 mechanical-tensile-hardness / mechanical-fatigue
// 等键（那些是"材料力学性能"，不是机械设计），避免语义与检索撞车。
//
// 骨架阶段先放 3 个方向（齿轮 / 轴承 / 弹簧），覆盖三类机械专属结构：
// 选型+查表、离散目录+寿命、多重校核+圆整回代。后续逐个追加。
import type { MechanicalQuestionType } from '../../../types/multiNodeTypes';

/**
 * 手册表不变量。
 *
 * 实测背景：题面附的多行摘录全部由 A1 凭参数记忆现场编造——
 * 本仓没有任何真实表体，node1-rag.ts 是 MVP 占位（硬编码的还是化学术语），
 * 没有向量库、没有教材原文进上下文。一道齿轮题里三张表的**单调方向全部反了**：
 * KR 被写成"可靠度越高系数越小"的折减乘数（AGMA 2001-D04 中它是除数，
 * R=99% 取 1.00、99.9% 取 1.25），齿形系数 y 与几何系数 I 也都写成随 z / i 递减。
 * 原因是中文教材里"××系数"绝大多数是小于 1 的折减乘数，模型按家族惯例造表，
 * 一造就三张全反。
 *
 * 数值漂移（Sc 记成 1650 而真值约 1240）可以容忍——摘录写在题面，题目自足，
 * 所有答题方用同一套数据仍能得到一致可判的答案。但**角色与单调方向搞反不可容忍**：
 * 它让真懂的答题方去纠正题面而被判错，不懂的照抄反而得分，直接反转区分度
 * （正是目标区分度：弱模型答错、强模型答对）。
 *
 * 因此本字段只钉三样最少但最致命的属性，不录整表（录整表要几百个数字且会过时）：
 *   role       —— 该量以什么身份进入公式（除数/乘数/加项/直接取值）
 *   monotonic  —— 沿 conditionAxis 递增还是递减
 *   band       —— 合理量级带 [min, max]
 * 三者都是纯数值/枚举比较，对 A1 输出的**结构化摘录**做算术，不碰散文正则——
 * 上一轮六类正则误报（见 mechanical-lint.ts 顶部注释）的教训是不再从散文里刮数字。
 */
export interface MechanicalTableAnchor {
    /** 规范符号，用于与 A1 自报摘录的 name 匹配 */
    symbol: string;
    /** 同义写法（中文表名、下标变体），任一命中即视为同一量 */
    aliases: string[];
    /** 该量以什么身份进入公式：搞反即 violation */
    role: 'divisor' | 'multiplier' | 'addend' | 'direct';
    /** 各行沿什么条件轴排列（写给 A1 看，也写进违规提示） */
    conditionAxis: string;
    /** 沿 conditionAxis 由小到大时，取值的单调方向；none 表示不作要求 */
    monotonic: 'increasing' | 'decreasing' | 'none';
    /** 合理量级带 [min, max]；超出 30% 报 warning、超出 50% 判 violation */
    band: [number, number];
    unit: string;
    /** 不变量的自然语言表述，注入 A1 提示词 */
    note: string;
}

export const MECHANICAL_DISCIPLINES = {
    // ============================================================
    // 齿轮传动
    // ============================================================
    'md-gear-cylindrical': {
        name: '齿轮传动-渐开线圆柱齿轮强度与选型',
        supportedTypes: ['calculation', 'short-answer', 'mixed'] as MechanicalQuestionType[],
        keywords: ['齿轮', '圆柱齿轮', '渐开线', '模数', '径节', '齿数', '压力角', '螺旋角', '中心距', '变位', '接触强度', '弯曲强度', '齿面点蚀', '齿根折断', 'AGMA', 'ISO6336', '接触疲劳极限', '弯曲疲劳极限', '许用接触应力', '节点区域系数', '重合度', '载荷系数', '动载系数', '齿向载荷分布系数', '使用系数', '齿宽系数', '寿命系数', '胶合', '齿面硬度', '渗碳淬火', '调质', '软齿面', '硬齿面', '安全系数'],
        peak_difficulty: '硬齿面渐开线圆柱齿轮的"设计—校核"闭环：在给定传递功率、转速、寿命、可靠度与空间约束下，同时受模数/径节标准系列、齿宽窗口 3p≤F≤5p、节线速度上限、不根切齿数下界，以及接触与弯曲两条独立准则的夹逼，求出仍然可行且最经济的方案。其中弯曲安全系数 SF 可直接与设计系数比较而接触安全系数 SH 必须先平方再比较；强度基准按芯部硬度定 St、表面硬度定 Sc 分工取值；模数与齿宽双重圆整后必须回代重查所有派生量（节线速度可能跨过精度等级分界而改变动载系数）。更高层次可要求判定可行集为空，并给出唯一的放松方向。',
        forbidden_errors: [
            '【SH 与 SF 的阶次不同】弯曲安全系数 SF 是应力比，可直接与设计系数 nd 比较；接触安全系数 SH 虽然也是应力比，但其载荷阶次为平方，必须以 SH² 与 nd 比较。把 SH 直接与 nd 比是最隐蔽的假 PASS / 假"不可行"来源',
            '【St 与 Sc 的硬度基准分工】弯曲疲劳强度 St 由**芯部**硬度决定，接触疲劳强度 Sc 由**表面**硬度决定。渗碳淬火齿轮两者硬度相差 20 HRC 以上，用同一个硬度查两张图必然改变结论',
            '【模数/径节只能取标准系列】由强度式反解出的连续值必须圆整到 GB/T 1357 第一系列（或美制标准径节），且圆整后齿数、中心距、齿宽、节线速度、动载系数全部要用圆整值重算',
            '【接触强度的计算基准取许用值较低者】一对钢制齿轮啮合时接触应力相同而许用应力不同，接触校核基准应落在许用值较低的那个轮（通常是小齿轮）；只算大齿轮就下结论会得到偏乐观的安全系数',
            '【齿宽不是自由参数】齿宽受 3p≤F≤5p（p 为周节）与支承刚度共同约束，超出上界后齿向载荷分布系数急剧恶化；不得为了凑通过而任意加宽',
            '【不根切齿数下界】标准齿制外齿轮 z≥17 才不产生根切，变位齿轮另有条件；不得取 z=12 之类的值再照常套强度公式',
            '【使用系数 KA 与动载系数 KV 不可合并】KA 由原动机—工作机的特性决定，KV 由节线速度与制造精度决定，两者独立相乘。用一个"综合载荷系数"代替会漏掉速度对 KV 的强依赖',
            '【寿命系数与可靠度系数各自独立】YN/ZN 由应力循环次数决定，KR 由目标可靠度决定，两者不可互相顶替或只取其一',
        ],
        parameter_constraints: {
            module_standard_series: '模数第一系列（GB/T 1357）1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50 mm；第二系列一般不优先选用。题目给定与解答选定的模数都必须落在系列上',
            pitch_line_velocity: '节线速度——开式软齿面传动一般 <5 m/s，闭式调质齿轮 5-15 m/s，硬齿面高速级可达 20-50 m/s。超过该精度等级的允许值必须提高精度等级或降低转速',
            face_width_window: '齿宽窗口 3p ≤ F ≤ 5p（p=πm 或 π/Pd）；齿宽系数 φd=b/d1 闭式软齿面 0.8-1.4，硬齿面 0.4-0.9，开式 0.3-0.5',
            surface_hardness: '调质齿面 220-286 HBW；表面淬火 45-55 HRC；渗碳淬火表面 58-62 HRC、芯部 30-42 HRC。软齿面指 ≤350 HBW，硬齿面指 >350 HBW',
            tooth_number_range: '小齿轮齿数——闭式软齿面 z1=20-40，闭式硬齿面 z1=17-25，开式 z1=17-20。传动比一般单级不超过 6-8',
            design_factor: '通用工业齿轮设计系数 nd 常取 1.2-1.5；起重、冶金、矿山等重载或有冲击的场合取 1.5-2.0',
        },
        anti_pattern_strategies: [
            '【高防御-SH 平方阶次】把载荷与许用值刻意布置在"SH 直接比 nd 通过、SH² 比 nd 不通过"的窄带内，使阶次判断本身成为结论的翻转开关',
            '【高防御-两张硬度表分工】题面只给"渗碳淬火，表面 60 HRC，芯部 35 HRC"，不点明哪个硬度对应哪张强度图，取错即整题改答案',
            '【高防御-双重圆整回代】模数与齿宽都需圆整，且圆整后节线速度恰好跨过精度等级分界使 KV 改变——不回代就得到完全不同的安全系数',
            '【高防御-可行集为空】把标准系列中的候选模数逐个夹死，正解是"该系列内无可行方案，必须提高材料等级或加大中心距"，而不是硬凑出一个通过的模数',
            '【高防御-两准则各自 governing】接触与弯曲分别给出安全系数，题目只问"该传动是否合格、由哪种失效模式控制"，迫使答题方显式比较并取最不利者',
            '【低防御-标准教材原型】给出全部系数、指定只校核某一条准则、只要求代入一次公式——退化为正向公式链，实测有效率 0%，禁止使用',
        ],
        standard_tables: [
            '模数第一/第二系列（GB/T 1357）——强度式反解值必须圆整归属，第二系列不优先',
            'AGMA 2001-D04 / ISO 6336 系数表——KA、KV、KHβ、KHα、ZN、YN、KR 均需按工况在表内选行，选行本身属判断层',
            '材料接触疲劳极限 Sc—硬度 与 弯曲疲劳极限 St—硬度 两张**独立**图表——横坐标硬度的取用口径不同（表面 vs 芯部）',
            '齿轮精度等级与允许节线速度对照表——精度等级选定影响 KV，二者互为约束需迭代',
        ],
        criterion_branches: [
            '接触 vs 弯曲：两条准则独立给出安全系数，结论取最不利者（governing 项），且比较前须把 SH 换算到与 nd 相同的阶次',
            '软齿面 vs 硬齿面：软齿面通常接触强度控制（先按接触强度设计再验弯曲），硬齿面通常弯曲强度控制（顺序相反）',
            '开式 vs 闭式：开式传动以磨损与弯曲折断为主，一般不做接触疲劳校核；闭式必须双准则',
            '精度等级分档：节线速度跨过分界后 KV 取值改变，圆整回代可能恰好把速度推过界',
        ],
        table_anchors: [
            {
                symbol: 'KR',
                aliases: ['可靠度系数', '可靠性系数', 'K_R', 'YZ', 'KR（可靠度）'],
                role: 'divisor',
                conditionAxis: '目标可靠度 R（由低到高）',
                monotonic: 'increasing',
                band: [0.85, 1.25],
                unit: '—',
                note: 'AGMA 2001-D04 Table 14-10：KR 是**除数**（许用应力 = St·YN/(KT·KR)），且 R 越高 KR 越大——R=90% 取 0.85、99% 取 1.00、99.9% 取 1.25。实测模型会按"××系数都是折减乘数"的家族惯例把它造成"R 越高系数越小"的乘数，方向完全相反。中式体系不设 KR，可靠度体现在许用应力的 S_Hmin/S_Fmin 里；两套体系不得混用。',
            },
            {
                symbol: 'ZN',
                aliases: ['接触寿命系数', '应力循环次数系数', 'Z_N', 'CL'],
                role: 'multiplier',
                conditionAxis: '应力循环次数 N（由少到多）',
                monotonic: 'decreasing',
                band: [0.8, 1.6],
                unit: '—',
                note: '寿命系数是乘数，N 越大越小（10^7 附近约 1.0，10^9 约 0.9）。N < 10^7 时可大于 1，不得一律截到 1 以下。',
            },
            {
                symbol: 'YN',
                aliases: ['弯曲寿命系数', 'Y_N', 'KL'],
                role: 'multiplier',
                conditionAxis: '应力循环次数 N（由少到多）',
                monotonic: 'decreasing',
                band: [0.8, 1.6],
                unit: '—',
                note: '同 ZN 但衰减更快；同一 N 下 YN 一般略小于 ZN。两者不可互相顶替。',
            },
            {
                symbol: 'KV',
                aliases: ['动载系数', '动载荷系数', 'K_V', 'Kv'],
                role: 'multiplier',
                conditionAxis: '节线速度 v（由低到高）',
                monotonic: 'increasing',
                band: [1.0, 1.8],
                unit: '—',
                note: 'KV 是载荷放大乘数，速度越高越大，恒 ≥1.0。同一速度下精度等级越低（级数越大）KV 越大。写成"速度越高 KV 越小"或 <1.0 即方向错。',
            },
            {
                symbol: 'KA',
                aliases: ['使用系数', '工况系数', 'K_A', 'Ko', '过载系数'],
                role: 'multiplier',
                conditionAxis: '原动机—工作机的冲击程度（由平稳到强冲击）',
                monotonic: 'increasing',
                band: [1.0, 2.5],
                unit: '—',
                note: 'KA 是载荷放大乘数，冲击越强越大，平稳载荷取 1.00。与 KV 相互独立、相乘，不得合并为一个"综合载荷系数"。',
            },
            {
                symbol: 'Sc',
                aliases: ['接触疲劳极限', '接触疲劳强度', 'σHlim', 'sigma_Hlim', 'S_c'],
                role: 'direct',
                conditionAxis: '硬度（由低到高）',
                monotonic: 'increasing',
                band: [550, 1550],
                unit: 'MPa',
                note: '接触疲劳极限由**表面**硬度决定（渗碳淬火不得用芯部硬度查），硬度越高越大。渗碳淬火 58-62 HRC 段 Grade 1 约 1100-1300 MPa、Grade 2 约 1300-1500 MPa；调质 220-280 HBW 约 550-750 MPa。⚠️ 这条"按表面硬度查"是本方向最锋利的题眼之一：它只写给你自己用，**摘录的表名与条件轴一律只写"硬度"，不许写成"表面硬度"**（写了等于告诉答题方该查哪个硬度）。题面把表面硬度与芯部硬度两个数分别给出即可。',
            },
            {
                symbol: 'St',
                aliases: ['弯曲疲劳极限', '弯曲疲劳强度', 'σFlim', 'sigma_Flim', 'S_t'],
                role: 'direct',
                conditionAxis: '硬度（由低到高）',
                monotonic: 'increasing',
                band: [180, 520],
                unit: 'MPa',
                note: '弯曲疲劳极限由**芯部**硬度决定（与 Sc 的硬度口径不同，这是本方向最强的分工陷阱），硬度越高越大。渗碳淬火芯部 30-42 HRC 段 Grade 1 约 380 MPa、Grade 2 约 450 MPa。恒远小于 Sc（同一齿轮上二者相差 2-4 倍），若摘录里 St 与 Sc 同量级即体系错。⚠️ 同 Sc：**摘录的表名与条件轴一律只写"硬度"，不许写成"芯部硬度"**，两张表条件轴同为"硬度"也不许注明各自该取哪个——分工本身就是要考的判断层。',
            },
            {
                symbol: 'Y',
                aliases: ['齿形系数', 'Lewis齿形系数', '齿形因数', 'y', 'Y_j', 'J', '几何系数J'],
                role: 'divisor',
                conditionAxis: '齿数 z（由少到多）',
                monotonic: 'increasing',
                band: [0.22, 0.50],
                unit: '—',
                note: 'Lewis 齿形系数随齿数**递增**（Shigley Table 14-2：z=17 取 0.303、z=20 取 0.322、z=25 取 0.340、z=30 取 0.359），因为齿数越多齿根越厚。它在弯曲应力式里作分母（σF=Ft·K/(b·m·Y)），齿数越多应力越小。实测模型会写成随 z 递减，方向反了。',
            },
            {
                symbol: 'I',
                aliases: ['几何系数', '接触几何系数', 'ZI', '节点区域系数', 'Z_H'],
                role: 'divisor',
                conditionAxis: '传动比 i = mG（由小到大）',
                monotonic: 'increasing',
                band: [0.06, 0.16],
                unit: '—',
                note: '外啮合直齿 I = cosφ·sinφ/(2·mN) · mG/(mG+1)，随传动比**递增**（φ=20° 时 i=1.5 取 0.096、i=2 取 0.107、i=2.5 取 0.115、i=3 取 0.121）。它在接触应力式里作分母，传动比越大接触应力越小。实测模型会写成随 i 递减，方向反了。',
            },
            {
                symbol: 'ZE',
                aliases: ['弹性系数', '弹性影响系数', 'Cp', 'C_p', 'Z_E'],
                role: 'multiplier',
                conditionAxis: '配对材料（钢-钢 / 钢-铸铁 / 钢-青铜）',
                monotonic: 'none',
                band: [140, 200],
                unit: '√MPa',
                note: '钢-钢配对 ZE=191 √MPa（Shigley Cp=2300 √psi ≈ 191），钢-铸铁约 174，钢-青铜约 158。题面必须给出该值，不得让答题方凭记忆取 189/191（二者差 1% 会在窄余量题里改变 governing 判定）。',
            },
        ] as MechanicalTableAnchor[],
    },
    // ============================================================
    // 滚动轴承
    // ============================================================
    'md-bearing-rolling': {
        name: '滚动轴承-选型、当量载荷与寿命可靠度',
        supportedTypes: ['calculation', 'short-answer', 'mixed'] as MechanicalQuestionType[],
        keywords: ['滚动轴承', '深沟球轴承', '角接触球轴承', '圆锥滚子轴承', '圆柱滚子轴承', '推力轴承', '额定动载荷', '额定静载荷', '当量动载荷', '径向系数', '轴向系数', '派生轴向力', '成对安装', '正装', '反装', '压紧端', '放松端', '轴承寿命', 'L10', '基本额定寿命', '可靠度', 'Weibull', '寿命修正系数', '温度系数', '载荷系数', '极限转速', '游隙', '预紧', '轴承内径系列', '当量载荷立方根加权', '变载荷'],
        peak_difficulty: '成对安装角接触/圆锥滚子轴承在含外部轴向力与径向力、且轴上齿轮附加弯矩参与的轴系中：先由派生轴向力 S=Fr/(2Y)（或 eFr）判定压紧端与放松端，再对两端分别求当量动载荷，按各自的 X/Y 分区口径（Fa/Fr 与 e 比较）取式，随后按目录基准（Timken 系列以 90×10⁶ rev 为基准而非 10⁶ rev）与寿命指数（球 ε=3、滚子 ε=10/3）换算，最后经三参数 Weibull 可靠度修正与串联系统可靠度合成，判定轴系整体是否满足目标可靠度。可行结论包含"目录中该尺寸段内无型号可满足，必须改用更高承载系列或改变支承方案"。',
        forbidden_errors: [
            '【派生轴向力方向决定压紧/放松端】成对安装时必须先算 S=Fr/(2Y)（圆锥滚子）或 S=eFr（角接触球），再与外部轴向力合成判定哪端压紧、哪端放松；两端当量载荷不同，跳过判定直接对两端用同一公式必错',
            '【X/Y 系数须按 Fa/Fr 与 e 分区取值】当量动载荷 P=XFr+YFa 中 X、Y 不是常数，须按 Fa/Fr 是否超过判别值 e 分区查表；深沟球轴承的 e 本身还随 Fa/C0r 变化，须二次查取',
            '【目录额定寿命基准不统一】ISO/GB 体系 Cr 对应 10⁶ 转，Timken 等美制目录对应 90×10⁶ 转（或 3000 h @ 500 r/min）。基准弄错寿命差两个数量级',
            '【寿命指数按滚动体类型分档】球轴承 ε=3，滚子轴承（圆柱/圆锥/调心滚子）ε=10/3。用 3 去算滚子轴承会显著低估寿命',
            '【可靠度修正不是线性折减】L10 到 Ln 的换算须用三参数 Weibull 式 a1，不得用"安全系数打折"或线性插值代替；多个轴承构成串联系统时系统可靠度为各自可靠度之积',
            '【变载荷须按立方根（或 10/3 次根）加权】多工况当量载荷 Pm=[Σ(Pi^ε·ti)/Σti]^(1/ε)，指数与寿命指数一致；用算术平均代替加权是典型错法',
            '【轴承内径只能取标准系列】反解出的最小内径必须向上圆整到 GB/T 273 轴承内径系列，且圆整后重查该型号的 Cr、C0r、Y、极限转速',
            '【静载荷校核不可省略】低速重载或有冲击时应以额定静载荷 C0r 与安全系数 S0 校核塑性变形，此时寿命校核可能通过而静强度不通过',
        ],
        parameter_constraints: {
            bore_diameter_series: '轴承内径系列（GB/T 273 常用段）10, 12, 15, 17, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100 mm——20 mm 以上按 5 递增',
            life_exponent: '寿命指数 ε——球轴承 3；圆柱/圆锥/调心滚子轴承 10/3。当量载荷加权与寿命换算必须用同一个 ε',
            target_life: '目标寿命 Lh——一般机械 5000-15000 h；连续运转的重要机械 20000-30000 h；汽车变速器 500-2000 h；机床主轴 20000 h 以上',
            static_safety_factor: '静载荷安全系数 S0——旋转精度与平稳性要求高时 1.5-2.5，一般 1.0-1.5，允许有永久变形时 0.5-1.0',
            judging_value_e: '判别值 e——深沟球轴承随 Fa/C0r 由 0.22 变到 0.44；30000 型圆锥滚子轴承 e≈0.3-0.4 且 Y 随系列变化；7000AC 型 e=0.68、7000C 型 e≈0.4-0.5',
            reliability_target: '目标可靠度——L10 对应 90%；重要场合要求 95%-99%，此时寿命修正系数 a1 分别约 0.62 与 0.21（三参数 Weibull 口径）',
        },
        anti_pattern_strategies: [
            '【高防御-压紧/放松端判定】给出外部轴向力恰好与派生力同量级，使"哪端压紧"成为翻转开关；判错则两端当量载荷互换、最短寿命端也随之互换',
            '【高防御-目录基准陷阱】题面给出美制目录的额定载荷但不说明其寿命基准，答题方若按 10⁶ 转口径计算，结果偏差两个数量级',
            '【高防御-离散目录夹逼】同一尺寸段给出多个型号，正解是"该段内全部型号均不满足，必须放大尺寸或改系列"，禁止硬凑通过',
            '【高防御-e 值二次查取】深沟球轴承的 e 依赖 Fa/C0r，而 C0r 又依赖最终选定型号，构成一次隐式迭代；只查一次即定 X/Y 会取错分区',
            '【高防御-寿命通过而静强度不通过】刻意布置低速重载工况，使寿命校核轻松通过但 C0r/S0 校核不通过，考察是否记得双项校核并取最不利者',
            '【低防御-给定型号与全部系数直接代公式】题面已给 P、C、ε 只要求代一次寿命式——正向公式链，禁止使用',
        ],
        standard_tables: [
            '轴承型号目录（Cr / C0r / Y / e / 极限转速 / 尺寸）——选型必须在目录多行中定位，且选定后所有派生量回代重查',
            'GB/T 273 轴承内径系列——反解内径须向上圆整归属',
            '深沟球轴承 Fa/C0r → e、X、Y 分区表——e 随 Fa/C0r 变化，属两级查取',
            '寿命修正系数 a1（可靠度 → 系数）与 fT（温度 → 系数）表——两者独立相乘，不得只取其一',
        ],
        criterion_branches: [
            'Fa/Fr 与判别值 e 比较：决定 P=Fr（或 X=1,Y=0）还是 P=XFr+YFa，取错分区即改当量载荷',
            '压紧端 vs 放松端：由派生轴向力与外部轴向力的合成方向判定，决定两端各自的轴向载荷',
            '寿命校核 vs 静强度校核：高速轻载由寿命控制，低速重载由 C0r/S0 控制，结论取最不利者',
            '球 vs 滚子：寿命指数 ε 与派生力公式形式均不同，滚动体类型是分支入口',
        ],
        table_anchors: [
            {
                symbol: 'a1',
                aliases: ['寿命修正系数', '可靠度寿命系数', '可靠性系数a1', 'a_1', 'KR（轴承）'],
                role: 'multiplier',
                conditionAxis: '目标可靠度 R（由低到高）',
                monotonic: 'decreasing',
                // ⚠️ 下限取 0.02 而不是 0.2：[0.2, 1.0] 与本条 note 自相矛盾——
                // note 自己写着"99.9% 约 0.04"，A1 照着写 0.04 就被判超带 80% > 50% → violation → 整题作废。
                // ISO 281 的 a1 表尾段本来就落在 0.02-0.07（99.6% 约 0.07、99.8% 约 0.04、99.9% 约 0.025），
                // 0.2 这个下限等于把可靠度要求 ≥99.5% 的合法题全毙掉。上限 1.0 不动：a1 > 1 是真错。
                band: [0.02, 1.0],
                unit: '—',
                note: 'a1 是寿命**乘数**且 R=90% 时恒等于 1.00（L10 的定义点），可靠度要求越高 a1 越小：95% 约 0.62、99% 约 0.21、99.9% 约 0.04。这与齿轮的 KR 方向相反（KR 是除数且 R 越高越大），两者不可类推——实测模型最容易在这里按同一家族惯例套错。a1 恒 ≤1.0，写出 >1 即错。',
            },
            {
                symbol: 'fT',
                aliases: ['温度系数', '温度修正系数', 'f_T', 'ft'],
                role: 'multiplier',
                conditionAxis: '工作温度（由低到高）',
                monotonic: 'decreasing',
                band: [0.5, 1.0],
                unit: '—',
                note: '温度系数是折减乘数，温度越高越小，≤120 ℃ 时取 1.00。与 a1 独立相乘，不得只取其一。',
            },
            {
                symbol: 'epsilon',
                aliases: ['寿命指数', 'ε', '寿命方程指数', 'p'],
                role: 'direct',
                conditionAxis: '滚动体类型（球 / 滚子）',
                monotonic: 'none',
                band: [3.0, 3.4],
                unit: '—',
                note: '球轴承 ε=3，圆柱/圆锥/调心滚子轴承 ε=10/3≈3.333。只有这两个合法取值，不存在中间值。变载荷加权指数必须与寿命指数取同一个 ε。',
            },
            {
                symbol: 'e',
                aliases: ['判别值', '判别系数', '判定值e', 'e值'],
                role: 'direct',
                conditionAxis: 'Fa/C0r（深沟球）或轴承系列（圆锥滚子）',
                monotonic: 'increasing',
                band: [0.17, 0.72],
                unit: '—',
                note: '深沟球轴承 e 随 Fa/C0r **递增**（0.22→0.44）；7000AC 型 e=0.68、7000C 型 e≈0.4-0.5；30000 型圆锥滚子 e≈0.3-0.4。深沟球的 e 依赖 C0r 而 C0r 依赖最终选定型号，构成隐式迭代，只查一次即定 X/Y 会取错分区。',
            },
            {
                symbol: 'Y',
                aliases: ['轴向系数', '轴向载荷系数', 'Y因数', 'Y_axial'],
                role: 'multiplier',
                conditionAxis: 'Fa/Fr 相对 e 的分区',
                monotonic: 'none',
                band: [0.0, 2.5],
                unit: '—',
                note: '当量动载荷 P=X·Fr+Y·Fa 中 X、Y 均为乘数，且必须按 Fa/Fr 是否超过 e 分区取值——Fa/Fr≤e 时通常 X=1、Y=0（轴向力不进入），超过后 X 降到 0.4-0.56、Y 升到 1-2。X、Y 不是常数，全程用同一组即错。',
            },
            {
                symbol: 'Cr',
                aliases: ['额定动载荷', '基本额定动载荷', 'C', 'C_r'],
                role: 'direct',
                conditionAxis: '轴承尺寸与系列（由小到大）',
                monotonic: 'increasing',
                band: [1.0, 2000.0],
                unit: 'kN',
                note: '额定动载荷随尺寸与系列承载能力递增，且恒大于同型号的额定静载荷 C0r 之半以上。**寿命基准必须随目录声明**：ISO/GB 体系 Cr 对应 10^6 转，Timken 等美制目录对应 90×10^6 转（或 3000 h @ 500 r/min）——基准弄错寿命差两个数量级，题面给美制目录时必须写明基准。',
            },
            {
                symbol: 'S0',
                aliases: ['静载荷安全系数', '静强度安全系数', 'S_0'],
                role: 'divisor',
                conditionAxis: '旋转精度与平稳性要求（由低到高）',
                monotonic: 'increasing',
                band: [0.5, 2.5],
                unit: '—',
                note: 'S0 作为除数进入静强度判据（C0r/S0 ≥ P0），要求越高取值越大：允许永久变形 0.5-1.0、一般 1.0-1.5、高精度 1.5-2.5。',
            },
        ] as MechanicalTableAnchor[],
    },
    // ============================================================
    // 弹簧
    // ============================================================
    'md-spring-helical': {
        name: '弹簧-圆柱螺旋弹簧强度、刚度与疲劳',
        supportedTypes: ['calculation', 'short-answer', 'mixed'] as MechanicalQuestionType[],
        keywords: ['弹簧', '圆柱螺旋弹簧', '压缩弹簧', '拉伸弹簧', '扭转弹簧', '簧丝直径', '中径', '旋绕比', '有效圈数', '总圈数', '自由高度', '节距', '弹簧刚度', '曲度系数', '应力修正系数', '切应力', '许用切应力', '初拉力', '钩部', '疲劳强度', '脉动循环', '对称循环', '共振', '自振频率', '压并载荷', '稳定性', '细长比', '端部结构', '琴钢丝', '油淬火回火钢丝', 'A227', 'A228', '心轴间隙', '固体高度'],
        peak_difficulty: '拉伸/扭转弹簧的全项闭环：簧丝直径只能取标准系列，选定后旋绕比、曲度系数、刚度、自由长度、许用应力全部随之改变，需圆整回代；许用屈服比例按材料分类（音乐钢丝、硬拉钢丝、油淬火回火钢丝各不相同）取值，一律用同一比例会得出"无可行方案"的错误结论；钩部（或扭臂）是独立的第二失效点，其弯曲耐久限须由剪切数据经 0.577 换算而来，且循环屈服载荷线的起点要偏移到初拉应力处；扭转弹簧的应力修正系数须取曲梁内侧 Ki 而非外侧 Ko，刚度用 E 而非 G；心轴间隙须按绕紧后缩小的线圈内径核算而非自由态。高阶要求在数十个牌号×直径组合中判定恰好只有极少数可行，并指出最经济者。',
        forbidden_errors: [
            '【簧丝直径只能取标准系列】由强度式反解的连续值必须圆整到 GB/T 1358 系列，圆整后旋绕比、曲度系数、刚度、圈数、自由高度全部要重算',
            '【压缩弹簧用 G、扭转弹簧用 E】圆柱螺旋压缩/拉伸弹簧以扭转变形为主，刚度含 G；扭转弹簧簧丝受弯，刚度含 E。题面同时给 G 和 E 时用错即整题崩',
            '【扭转弹簧的应力修正取内侧 Ki】扭转弹簧危险点在线圈内侧，须用曲梁内侧应力修正系数 Ki；误用外侧 Ko 会低估应力，选到强度不足的廉价牌号',
            '【许用应力比例按材料分类】许用屈服比例（如 Ssy/Sut）对音乐钢丝、硬拉钢丝、油淬火回火钢丝、不锈钢丝各不相同；一律取同一比例会得到假"无可行方案"',
            '【钩部/扭臂是独立失效点】拉伸弹簧的钩部同时承受弯曲与扭转，其疲劳与静强度须单独校核；钩部弯曲耐久限须由剪切耐久限经 0.577（畸变能）换算，不能直接套用簧圈的剪切数据',
            '【拉伸弹簧的应力起点是初拉应力】有初拉力的拉伸弹簧，循环屈服载荷线的起点须偏移到初拉应力处，而非从零起算',
            '【有效圈数与总圈数不可混用】刚度式中用有效圈数 n；自由高度与总长须用总圈数（拉伸弹簧还须加两个钩的长度，扭转弹簧的 Na 含 G/E 修正项）',
            '【心轴间隙按绕紧后的内径核算】扭转弹簧加载后线圈直径缩小，心轴间隙必须按缩小后的内径核算；用自由态内径会选到实际会干涉的心轴',
            '【压缩弹簧的稳定性与共振不可省】细长比超界须验失稳（或加导杆/导套）；工作频率接近自振频率整数倍时须验共振，脉动循环下尤为关键',
        ],
        parameter_constraints: {
            wire_diameter_series: '簧丝直径系列（GB/T 1358）0.5, 0.6, 0.8, 1, 1.2, 1.6, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8, 10, 12, 16, 20, 25 mm',
            spring_index: '旋绕比 C=D/d 常用 4-14，推荐 5-8。C<4 卷制困难且内侧应力过高，C>14 弹簧易颤动、尺寸稳定性差',
            allowable_stress_ratio: '许用切应力——Ⅰ类（受循环次数 >10⁶）τp≈0.3Sut，Ⅱ类（10³-10⁵ 或受冲击）τp≈0.4Sut，Ⅲ类（<10³）τp≈0.5Sut。压并状态一般要求不超过 0.56-0.65Sut',
            active_coils: '有效圈数 n——压缩弹簧一般 ≥3 且不宜 >15；拉伸弹簧可更多。总圈数 n1=n+(1.5~2.5)（端部结构决定）',
            initial_tension_stress: '拉伸弹簧初拉应力（密圈冷卷）——推荐区间随旋绕比变化，C=5 时约 100-140 MPa，C=12 时约 40-60 MPa；超出上界卷制无法稳定实现',
            natural_frequency: '压缩弹簧一阶自振频率 fn=(1/2)·√(k/ms)（两端固定口径）；工作频率应低于 fn/10 或避开其整数分频，否则共振使动应力成倍放大',
        },
        anti_pattern_strategies: [
            '【高防御-圆整回代贯穿】簧丝直径圆整后刚度、圈数、自由高度、许用应力全变，且恰好使原本通过的校核转为不通过',
            '【高防御-Ki/Ko 翻转】扭转弹簧题只给"应力修正系数"三个字不点内外侧，取 Ko 会选到最廉价牌号并判通过，取 Ki 才是正解',
            '【高防御-许用比例按材料分类】题面列出多个牌号但不给各自的屈服比例口径，若一律取同一比例则全部不可行，正解需按材料分类查取',
            '【高防御-钩部为 governing】把簧圈校核布置得宽裕、钩部布置得紧张，使 governing 项落在钩部而非簧圈，且钩部数据须经 0.577 换算才可用',
            '【高防御-可行窗口为空】初拉力/自由高度/心轴间隙三条约束互相夹逼，正解是"该组合窗口为空，必须放宽某一条"而非硬凑',
            '【低防御-给全参数只求刚度】题面已给 d、D、n、G 只要求代一次刚度式——正向公式链，禁止使用',
        ],
        standard_tables: [
            'GB/T 1358 簧丝直径系列——反解直径须圆整归属，圆整后全链回代',
            '弹簧钢丝抗拉强度—直径 表（琴钢丝/碳素弹簧钢丝/油淬火回火钢丝，Sut 随直径下降）——直径圆整后 Sut 随之改变',
            '许用屈服比例按材料分类表（Ssy/Sut 或 τp/Sut）——不同牌号取值不同，属判断层',
            '端部结构 → 总圈数与自由高度换算表；钩部形式 → 应力集中口径表',
        ],
        criterion_branches: [
            '簧圈 vs 钩部/扭臂：两个独立失效点分别校核，结论取最不利者',
            '压缩/拉伸（受扭，用 G、τ）vs 扭转（受弯，用 E、σ）：受力性质决定整套公式与许用值口径',
            '曲梁内侧 Ki vs 外侧 Ko：扭转弹簧危险点在内侧，取错即改结论',
            '静强度 vs 疲劳 vs 稳定性 vs 共振：按载荷类别（Ⅰ/Ⅱ/Ⅲ类）决定哪几项必查，脉动循环下疲劳与共振同时进入',
        ],
        table_anchors: [
            {
                symbol: 'Sut',
                aliases: ['抗拉强度', '钢丝抗拉强度', '强度极限', 'σb', 'S_ut'],
                role: 'direct',
                conditionAxis: '簧丝直径 d（由细到粗）',
                monotonic: 'decreasing',
                band: [1000, 2400],
                unit: 'MPa',
                note: '弹簧钢丝的抗拉强度随直径**递减**（冷拔细丝强度最高）：d=1 mm 时可达 2100-2300 MPa，d=6 mm 降到 1500-1700 MPa，d=12 mm 约 1300-1500 MPa。写成"直径越大强度越高"是方向反了。直径圆整后 Sut 必须重查。',
            },
            {
                symbol: 'K',
                aliases: ['曲度系数', '曲率系数', 'Wahl系数', 'K_B', 'K_W'],
                role: 'multiplier',
                conditionAxis: '旋绕比 C=D/d（由小到大）',
                monotonic: 'decreasing',
                band: [1.05, 1.45],
                unit: '—',
                note: '曲度系数是应力**放大**乘数，恒 >1，且随旋绕比递减：C=4 时约 1.40、C=8 时约 1.18、C=14 时约 1.10。写出 <1 的值（当作折减系数）或写成随 C 递增，都是方向搞反。',
            },
            {
                symbol: 'Ki',
                aliases: ['应力修正系数', '曲梁内侧修正系数', 'K_i'],
                role: 'multiplier',
                conditionAxis: '旋绕比 C（由小到大）',
                monotonic: 'decreasing',
                band: [1.0, 1.4],
                unit: '—',
                note: '扭转弹簧内侧应力修正 Ki>1（放大），外侧 Ko<1（折减），两者不可互换：Ki=1+0.867/C+0.377/C²，Ko=1-0.841/C+0.416/C²。危险点在内侧，故校核用 Ki。若表里"应力修正系数"给成小于 1 的值，说明给的是 Ko，题面必须点明或改为 Ki。',
            },
            {
                symbol: 'tau_p_ratio',
                aliases: ['许用切应力比例', '许用应力比例', 'τp/Sut', 'Ssy/Sut', '屈服比例'],
                role: 'multiplier',
                conditionAxis: '载荷类别（Ⅰ类→Ⅲ类，即循环次数由多到少）',
                monotonic: 'increasing',
                band: [0.25, 0.65],
                unit: '—',
                note: '许用应力比例恒 <1，且随载荷类别放宽而**递增**：Ⅰ类（>10⁶ 次）≈0.3、Ⅱ类（10³-10⁵）≈0.4、Ⅲ类（<10³）≈0.5，压并状态 0.56-0.65。写成"循环次数越多比例越大"是方向反了。该比例按材料牌号还要再分，不得一律同值。',
            },
            {
                symbol: 'G',
                aliases: ['切变模量', '剪切弹性模量', '剪切模量'],
                role: 'divisor',
                conditionAxis: '材料（钢/不锈钢/铜合金）',
                monotonic: 'none',
                band: [40000, 86000],
                unit: 'MPa',
                note: '碳素弹簧钢丝 G≈79300-81500 MPa，不锈钢丝 G≈69000 MPa，磷青铜 G≈41400 MPa。G 出现在压缩/拉伸弹簧刚度式的**分母**（k=Gd⁴/(8D³n)），G 与 E 恒满足 E≈2.6G，两者写反或写成相等即整题崩。',
            },
            {
                symbol: 'E',
                aliases: ['弹性模量', '拉压弹性模量', '杨氏模量'],
                role: 'divisor',
                conditionAxis: '材料（钢/不锈钢/铜合金）',
                monotonic: 'none',
                band: [100000, 210000],
                unit: 'MPa',
                note: '碳素弹簧钢丝 E≈196500-203400 MPa，不锈钢丝 E≈193000 MPa，磷青铜 E≈111000 MPa。E 只用于**扭转**弹簧（簧丝受弯）的刚度与应力，恒约为同材料 G 的 2.6 倍。题面同时给 G 与 E 时属判断层，不得提示用哪一个。',
            },
        ] as MechanicalTableAnchor[],
    },

    // ============================================================
    // 材料力学基础
    // ============================================================
    // 为什么在"机械设计"里放一条材料力学方向：
    // 前三个方向都是"选型+查表+圆整"结构，共同前提是题面必须附手册摘录，而本仓
    // 没有 RAG、摘录全由 A1 现编（见 MechanicalTableAnchor 注释）。本方向的答案是
    // 闭式表达式，不依赖任何手册表体，于是 table_anchors 那一整层缺陷类别整体消失。
    // 落点取自第十二届周培源力学竞赛个人赛第 2 题（清华命题，三层复合梁纯弯曲）：
    // 实测中等模型答不出，且它的三个陷阱（模量加权形心 / 层界应力跳变 / 曲率测点换算）
    // 串在同一条链上，改模量比、厚度比、失效层、曲率测点即得一道新题。
    'md-beam-composite-bending': {
        name: '材料力学基础-多材料组合梁弯曲的中性轴与分层失效',
        supportedTypes: ['calculation', 'short-answer', 'mixed'] as MechanicalQuestionType[],
        keywords: ['组合梁', '层合梁', '复合梁', '多层梁', '叠合梁', '纯弯曲', '四点弯曲', '三点弯曲', '中性轴', '中性层', '模量加权形心', '等效抗弯刚度', '换算截面', '等效截面', '平行移轴', '惯性矩', '曲率半径', '正应力分布', '应变连续', '应力跳变', '层界', '分层失效', '层间应力', '强度极限', '弹性模量', '模量比', '厚度比', '双金属', '夹芯', '蒙皮', '芯层', '钢筋混凝土梁', '木-钢组合截面', '平面假设'],
        peak_difficulty: '多材料层合梁纯弯曲的"中性轴—应力分布—分层失效"闭环：中性轴是**弹性模量加权**的形心（等效刚度形心）而非几何形心，模量比与厚度比同时参与加权，任一侧写错就得到一整套自洽但错误的答案；层界上**应变连续而正应力不连续**，每个层界处应力跳变正好等于模量比，因此最大应力不一定出现在离中性轴最远的层；题面给出的曲率半径若测在上缘或下缘而非中性层，必须先做换算，换算符号由弯曲方向（上凸/下凸）决定；某层失效后剩余截面的中性轴会迁移，"失效瞬间"（仍按全截面）与"失效之后"（按剩余层重算加权形心与等效刚度）是两个不同的问题。高阶要求判定哪一层先失效并由该时刻的曲率反求其强度极限，或在给定的材料×层厚候选集内判定可行集为空并指出唯一的放松方向。',
        forbidden_errors: [
            '【中性轴是模量加权形心，不是几何形心】ȳ=Σ(E_i·A_i·y_i)/Σ(E_i·A_i)。用几何形心（或用换算截面法却忘了按 E_i/E_ref 换算宽度）会得到另一套完全自洽的错误答案——这是本方向最隐蔽的假 PASS，也是唯一必须由答题方自行完成的判断层',
            '【层界上应变连续、应力不连续】σ_i=E_i·(y−ȳ)/ρ。同一层界两侧应变相同而正应力相差正好一个模量比 E_i/E_j。把正应力画成一条连续斜直线（或把应变画成阶梯）是把两个物理量搞反，属物理性质错误',
            '【最大应力不一定在最外层】危险层由 E_i·|y−ȳ|max 决定（各层许用值不同时还要再比应力与许用值之比）。夹在中间的薄高模量层完全可能是最危险层；默认"离中性轴最远处最危险"是错的',
            '【曲率半径的测点必须换算】题面给"上缘/下缘曲率半径 R"时，中性层曲率 ρ 与 R 相差恰好一个"中性轴到该缘的距离"，且符号由弯矩方向决定（正弯矩下凸时上缘在压侧、其半径小于 ρ，故 ρ=R+该距离）。把 R 直接当 ρ 代入会整体错到若干倍',
            '【M 与 ρ 的关系用等效抗弯刚度】M=(Σ E_i·I_i,c)/ρ，其中 I_i,c 是各层对**中性轴**而非对各层自身形心轴的惯性矩，须逐层做平行移轴 I_i,c=I_i+A_i·(y_i−ȳ)²。漏掉移轴项在薄层远离中性轴时误差可达数倍',
            '【失效瞬间 vs 失效之后】问"某层断裂时该层的强度极限"用的是断裂瞬间的全截面中性轴；问"该层失效后梁的剩余承载力/曲率"则必须去掉该层重算加权形心与等效刚度。两者混用等于把两个不同问题的答案对调',
            '【governing 项是先失效的那一层】必须逐层给出应力比（该层最大应力 ÷ 该层许用值或强度极限），取最小者为 governing 项，并同时写入 answerKey.safetyFactors 与 answerKey.governing。只给各层应力不给应力比，结论无法判定',
            '【纯弯段的界定】四点弯曲只有两个加载点之间是纯弯段（剪力为零、弯矩恒定）；把支座到加载点的区段也当纯弯，或把纯弯段弯矩写成随坐标变化，均属受力分析错误',
            '【符号解必须附一组数值实例化】本方向的答案多为闭式表达式。除符号结果外，解答末尾必须另给一组具体数值（自选一套 E、h、b、M 或 ρ，并算出中性轴位置、各层最大应力、各层应力比与所求量的数值），供确定性算术复算逐式核验。只给符号不给数值等于把全部数值校验关掉',
            '【必须显式做完两条退化校验】① 令各层模量相等时，中性轴须退回几何形心、应力分布须退回一条连续斜直线；② 令某层厚度趋于零时，该层须从加权中消失、结果须退回少一层的情形。任一条不成立说明主推导有错，必须在解答里写出这两个校验的过程与结论',
        ],
        parameter_constraints: {
            modulus_ratio: '模量比 E_max/E_min 取 2-100。低于 2 时加权形心与几何形心几乎重合（本方向的判断层被抹平），高于 100 时高模量层近似成刚性、低模量层几乎不参与承载，同样退化',
            neutral_axis_offset: '模量加权形心与几何形心的偏移量必须 ≥ 截面总高的 3%：偏移量与舍入噪声同量级时，用错方法的答案与正解无法区分，题目失去判别力。母本第 2 题的偏移为 (26.0−24.25)/52=3.4%，恰在下限附近',
            thickness_ratio: '层厚比 h_max/h_min 取 2-100；层数取 2-4 层（5 层以上只是重复劳动，不增加判断层）。厚层与高模量层应错开布置，使"最危险层"不落在最外层',
            curvature_ratio: '曲率半径与截面高度之比 ρ/h ≥ 20，以满足平面假设与小变形前提；ρ/h < 10 时须改用曲梁公式，本方向不涉及',
            strain_level: '纯弯段最大应变落在 0.05%-3%（金属层 ≤0.2% 保持线弹性，聚合物/复合材料层可到 1-3%）。应变超过某层的线弹性范围就必须显式说明该层已进入非线性，否则整套线弹性公式不成立',
            strength_modulus_consistency: '各层的 σb/E 必须落在 0.0005-0.05（钢约 0.0025、铝约 0.004、环氧约 0.02、玻璃约 0.001）。凭空给出 σb/E=0.2 之类的组合会造出现实中不存在的材料，答题方无法用常识复核',
            pure_bending_span: '四点弯曲的纯弯段长度取跨距的 1/3-1/2，且加载点到支座的距离须给出，否则纯弯段无法界定',
        },
        anti_pattern_strategies: [
            '【高防御-两个形心都是整齿数值】把模量比与厚度比反向搜索到"模量加权形心与几何形心都恰好是有限小数"的组合，使误用几何形心的答案不会因为算出丑数而自我暴露（母本第 2 题：24.25h vs 26.0h，两个都是整齿数）',
            '【高防御-最危险层在中间】把薄的高模量层夹在中间，使其 E·|y−ȳ| 超过最外层，"离中性轴最远处最危险"的直觉答案错；再让该层的强度极限也偏低，使它同时是 governing 项',
            '【高防御-曲率测点错位】曲率半径给在上缘或下缘，且中性轴到该缘的距离与所给 R 同量级（如 R 与该距离比在 1:1 到 10:1 之间），不换算即错到若干倍；不换算与换算错符号是两个不同的错，答案各不相同',
            '【高防御-失效瞬间/失效之后并列问】同一道题先问"哪一层先失效、失效瞬间由曲率反求其强度极限"，再问"该层失效后梁还能承受多大弯矩"，迫使答题方两次求中性轴且认出两次的截面不同',
            '【高防御-可行集为空】给出 3-4 种候选层材料与 2-3 种候选层厚，要求选出使各层同时不失效的组合，正解是"给定候选内无可行组合，必须提高中间层强度极限（或把该层移近中性轴）"，而不是硬凑一个通过的组合',
            '【低防御-单一材料矩形截面求 σ=My/I】只有一种材料时中性轴就是几何形心，判断层为零，退化为正向公式链，禁止使用',
            '【低防御-题面直接给出中性轴位置】把本方向唯一的判断层直接交底，剩下的只是代公式，禁止使用；同理不得在题面写"须按模量加权求形心"或"须用换算截面法"',
        ],
        standard_tables: [
            '常用工程材料弹性模量表（结构钢 200-210 GPa / 铝合金 68-72 GPa / 玻璃 60-80 GPa / 混凝土 20-40 GPa / 环氧树脂 2.5-4 GPa / 单向碳纤维复合材料纵向 130-230 GPa）——层合梁的模量比由此确定，材料族选错即改中性轴位置',
            '各材料强度极限/许用应力表——判断哪一层先失效必须逐层比较该层应力与**该层自己**的许用值，不得只比应力大小；脆性层还须区分拉伸与压缩强度极限',
            '板材/型材标准厚度系列——层厚作为选定量时须归属到标准系列并圆整回代（回代后中性轴、等效刚度、各层应力全部要重算）',
            '弯曲试验加载跨距标准（GB/T 232 金属弯曲、ASTM D790 塑料三点/四点弯曲）——纯弯段长度与跨距之比属试验口径，属"在多行中选对哪一行"的判断层',
        ],
        criterion_branches: [
            '模量加权形心法 vs 换算截面法：两法数学等价、答案必须完全相同（换算截面法须按 b_i=b·E_i/E_ref 换算宽度并保持各层到中性轴的距离不变）。⚠️ 这两法只是**表述不同**，盲解与标准解答各用一法时不得判为分歧',
            '失效瞬间（全截面）vs 失效之后（剩余截面）：中性轴位置与等效刚度都不同，问法决定用哪一个',
            '曲率测点在上缘 / 下缘 / 中性层：换算的加减号由弯矩正负（下凸/上凸）与该缘在中性轴上侧还是下侧共同决定，四种组合各不相同',
            '应变连续 vs 应力连续：层界上只有应变连续；正应力跳变等于模量比。这是本方向的物理性质分叉，搞反即整题作废',
            '各层许用值相同 vs 不同：相同时 governing 由 E_i·|y−ȳ|max 最大者决定；不同时必须逐层算应力比再取最小者，两种情形的 governing 层可以不是同一层',
            '拉侧 vs 压侧：脆性层的抗拉与抗压强度极限相差可达一个量级，同一层在中性轴哪一侧决定用哪个强度极限',
        ],
        table_anchors: [
            {
                symbol: 'E',
                aliases: ['弹性模量', '杨氏模量', '拉压弹性模量', '纵向模量', 'E_i'],
                role: 'multiplier',
                conditionAxis: '材料（由软到硬：聚合物 → 混凝土 → 玻璃/铝 → 钢/碳纤维）',
                monotonic: 'none',
                band: [2000, 250000],
                unit: 'MPa',
                note: '弹性模量在本方向以**乘数**身份进入两处：加权形心的权 E_i·A_i，与应力式 σ_i=E_i·(y−ȳ)/ρ。量级须与材料族对得上：结构钢 200000-210000、铝合金 68000-72000、玻璃 60000-80000、混凝土 20000-40000、环氧树脂 2500-4000、单向碳纤维纵向 130000-230000 MPa。把环氧写成 30000 或把钢写成 20000 会让答题方无法用常识复核题面。',
            },
            {
                symbol: 'sigma_b',
                aliases: ['强度极限', '抗拉强度', '断裂强度', 'σb', 'σ_b', 'Sut'],
                role: 'direct',
                conditionAxis: '材料（由软到硬）',
                monotonic: 'none',
                band: [20, 4000],
                unit: 'MPa',
                note: '强度极限是直接取用的判据值，不作为系数参与乘除。关键不变量是它与同材料 E 的比：σb/E 必须落在 0.0005-0.05（钢约 0.0025、铝约 0.004、玻璃约 0.001、环氧约 0.02、碳纤维约 0.01）。给出 σb/E 超出该区间的组合等于造了一种现实中不存在的材料。脆性层还须分别给抗拉与抗压强度极限（后者常高出 5-10 倍），只给一个"强度极限"会让拉压两侧无法分别判定。',
            },
            {
                symbol: 'nu',
                aliases: ['泊松比', '泊松系数', 'ν', 'mu'],
                role: 'direct',
                conditionAxis: '材料（由软到硬）',
                monotonic: 'none',
                band: [0.2, 0.5],
                unit: '—',
                note: '各向同性材料的泊松比恒在 0-0.5 之间（0.5 对应不可压缩），工程材料实际落在 0.2-0.42：钢约 0.30、铝约 0.33、玻璃约 0.22、混凝土约 0.20、橡胶接近 0.50。写出 >0.5 或负值（拉胀材料属特例，本方向不涉及）在热力学上不成立。注意纯弯曲的中性轴与应力分布**与泊松比无关**，若解答里 ν 进入了这两个量的表达式，说明推导中混进了平面应变假设。',
            },
        ] as MechanicalTableAnchor[],
    },
};

// ============================================================
// 匹配与取值（结构对齐 materials，name 命中优先于 keyword 命中）
// ============================================================

type MechanicalDiscipline = typeof MECHANICAL_DISCIPLINES[keyof typeof MECHANICAL_DISCIPLINES];

/**
 * 找出 topic 中所有匹配到的学科方向（支持跨方向融合题）。
 * name 命中优先：UI 传下来的 topic 恒为 discipline.name，若把 name 命中与
 * keyword 命中同等对待，单选一个方向会因共享关键词（如"轴承"同时出现在齿轮
 * 方向的 keywords 里）而误判为跨方向融合、注入双份约束。
 */
function findMatchedDisciplines(topic: string): MechanicalDiscipline[] {
    const nameMatched: MechanicalDiscipline[] = [];
    const seenName = new Set<string>();
    for (const discipline of Object.values(MECHANICAL_DISCIPLINES)) {
        if (topic.includes(discipline.name) && !seenName.has(discipline.name)) {
            nameMatched.push(discipline);
            seenName.add(discipline.name);
        }
    }
    if (nameMatched.length > 0) return nameMatched;

    const kwMatched: MechanicalDiscipline[] = [];
    const seenKw = new Set<string>();
    for (const discipline of Object.values(MECHANICAL_DISCIPLINES)) {
        if (discipline.keywords.some((kw: string) => topic.includes(kw)) && !seenKw.has(discipline.name)) {
            kwMatched.push(discipline);
            seenKw.add(discipline.name);
        }
    }
    return kwMatched;
}

/**
 * 取某方向的手册表不变量。用 `in` 守卫而非直接取属性：后续追加新方向时
 * 允许先不写 table_anchors（该方向就是没有可总结的不变量，如轴承目录），
 * 不至于因为字段缺失让整个联合类型失配。
 */
function getAnchors(d: MechanicalDiscipline): MechanicalTableAnchor[] {
    const raw = (d as { table_anchors?: MechanicalTableAnchor[] }).table_anchors;
    return Array.isArray(raw) ? raw : [];
}

const ROLE_LABEL: Record<MechanicalTableAnchor['role'], string> = {
    divisor: '除数（进入分母）',
    multiplier: '乘数（进入分子）',
    addend: '加项',
    direct: '直接取值（不作为系数参与乘除）',
};

const MONOTONIC_LABEL: Record<MechanicalTableAnchor['monotonic'], string> = {
    increasing: '递增',
    decreasing: '递减',
    none: '无单调要求',
};

/**
 * 把不变量渲染成注入 A1 的文本块。
 *
 * 之所以要把这些"常识"写进提示词：本仓没有 RAG，题面附的摘录全部由模型凭
 * 参数记忆现场编造，而中文教材"××系数"绝大多数是小于 1 的折减乘数，模型会
 * 按家族惯例把 AGMA 的除数型系数（KR）造成反向乘数，一造就是三张表全反。
 * 数值漂移可以容忍（摘录写在题面，题目自足），角色与单调方向搞反不可容忍
 * ——它让真懂的答题方去纠正题面而被判错，直接反转区分度。
 */
function formatAnchorBlock(anchors: MechanicalTableAnchor[], prefix: string = ''): string {
    if (anchors.length === 0) return '';
    const lines = anchors.map(a => {
        const p = prefix ? `[${prefix}] ` : '';
        return [
            `- ${p}${a.symbol}（同义写法：${a.aliases.join('、')}）`,
            `  · 身份：${ROLE_LABEL[a.role]}`,
            `  · 条件轴：${a.conditionAxis} → 取值${MONOTONIC_LABEL[a.monotonic]}`,
            `  · 合理量级带：${a.band[0]} ~ ${a.band[1]} ${a.unit}`,
            `  · ${a.note}`,
        ].join('\n');
    });
    return [
        '【手册表不变量（摘录表体的硬约束，违反即整题作废）】',
        '你写进题面的每一行摘录都会被确定性检查器逐行复算。数值可以有合理漂移（超出下列量级带外侧 20% 以内不追究，超出 20% 会被提示复核，超出 50% 判硬伤），',
        '但**身份（除数/乘数/加项）与沿条件轴的单调方向必须与下列不变量一致，量级也必须落在给定带内**。',
        '身份或方向搞反会让掌握该学科的答题方为了纠正题面而被判错、照抄错表的反而得分——区分度直接反转，题目作废。',
        '若你对某个量的真实表体没有把握，正确做法是**换一个你有把握的量**，或把该量作为已知条件直接给出（并注明"本题按此取值"），',
        '绝不要凭"系数看起来应该是什么样"编一张表。',
        '⚠️ **下面的"条件轴"名称与说明是给你自己用的，不是照抄进题面的表头**：写进题面的表名与条件轴只许写量名与轴的物理名（如"接触疲劳极限 Sc（硬度）"），',
        '**不得把"该查哪一行/该用哪个口径"的分工编码进表名或条件轴**（例如两张表都以硬度为轴时，不许注明一张按表面硬度、另一张按芯部硬度）。',
        '选行依据属于判断层，是本题要考的东西；写进表头就等于交底，与在题面点出准则名同罪。',
        lines.join('\n'),
    ].join('\n');
}

/** 机械专属：把 standard_tables 与 criterion_branches 也拼进指导文本 */
function formatSingle(d: MechanicalDiscipline): string {
    return [
        `【学科方向】${d.name}`,
        `【难度天花板】${d.peak_difficulty}`,
        `【禁止犯的错误】\n${d.forbidden_errors.join('\n')}`,
        `【参数约束】\n${Object.entries(d.parameter_constraints).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`,
        `【标准表与离散系列（查表取值算 0 步，但"在多行中选对哪一行"属判断层，算完整步数）】\n${d.standard_tables.map(s => `- ${s}`).join('\n')}`,
        `【判据分叉点（选错分支即改答案，机械题最强的防御结构）】\n${d.criterion_branches.map(s => `- ${s}`).join('\n')}`,
        formatAnchorBlock(getAnchors(d)),
        `【反模式出题策略】\n${d.anti_pattern_strategies.join('\n')}`,
    ].filter(Boolean).join('\n\n');
}

export function getDisciplineGuidance(topic: string): string {
    const matched = findMatchedDisciplines(topic);
    if (matched.length === 0) return '';
    if (matched.length === 1) return formatSingle(matched[0]);

    const forbidden = matched.flatMap(d => d.forbidden_errors.map(e => `[${d.name}] ${e}`));
    const constraints = matched.flatMap(d =>
        Object.entries(d.parameter_constraints).map(([k, v]) => `- [${d.name}] ${k}: ${v}`)
    );
    const tables = matched.flatMap(d => d.standard_tables.map(s => `- [${d.name}] ${s}`));
    const branches = matched.flatMap(d => d.criterion_branches.map(s => `- [${d.name}] ${s}`));
    const antiPatterns = matched.flatMap(d => d.anti_pattern_strategies.map(s => `[${d.name}] ${s}`));
    const peaks = matched.map(d => `- ${d.name}: ${d.peak_difficulty}`).join('\n');
    const anchorBlocks = matched
        .map(d => formatAnchorBlock(getAnchors(d), d.name))
        .filter(Boolean)
        .join('\n');

    return [
        `【跨方向融合】${matched.map(d => d.name).join(' × ')}`,
        `【各方向难度天花板】\n${peaks}`,
        `【禁止犯的错误（所有方向并集）】\n${forbidden.join('\n')}`,
        `【参数约束（所有方向并集）】\n${constraints.join('\n')}`,
        `【标准表与离散系列（所有方向并集）】\n${tables.join('\n')}`,
        `【判据分叉点（所有方向并集）】\n${branches.join('\n')}`,
        anchorBlocks,
        `【反模式出题策略（所有方向并集）】\n${antiPatterns.join('\n')}`,
        `【跨方向出题额外要求】必须找到一条真实的力流/失效链把所选方向串起来（如"齿轮传动 × 滚动轴承"应以齿轮啮合力作为轴承径向与轴向载荷的来源，一条链跨两章），而不是把两道独立小题拼在一起。`,
        `【跨方向不得混用体系】同一道题内不得把中式（GB/ISO，可靠度体现在 S_Hmin/S_Fmin）与美制（AGMA/Shigley，可靠度用 KR 除数）两套系数体系混用。选定一套后全题贯穿，否则会造出两套体系里都不存在的量。`,
    ].filter(Boolean).join('\n\n');
}

export function getMatchedDisciplineAntiPatterns(topic: string): string[] {
    return findMatchedDisciplines(topic).flatMap(d => d.anti_pattern_strategies.map(s => `[${d.name}] ${s}`));
}

export function getMatchedDisciplineForbiddenErrors(topic: string): string[] {
    return findMatchedDisciplines(topic).flatMap(d => d.forbidden_errors.map(e => `[${d.name}] ${e}`));
}

/** 机械专属：供 A1 生成与 A2 审查检查"是否真的用到了离散系列/判据分叉" */
export function getMatchedStandardTables(topic: string): string[] {
    return findMatchedDisciplines(topic).flatMap(d => d.standard_tables.map(s => `[${d.name}] ${s}`));
}

export function getMatchedCriterionBranches(topic: string): string[] {
    return findMatchedDisciplines(topic).flatMap(d => d.criterion_branches.map(s => `[${d.name}] ${s}`));
}

/**
 * 机械专属：取该 topic 下所有手册表不变量，供 lint 的 checkTableAnchors 逐行复算。
 * 同一符号在多个方向重名时（如齿轮与弹簧都有 K），按方向并集返回，匹配时任一命中即可。
 */
export function getMatchedTableAnchors(topic: string): MechanicalTableAnchor[] {
    return findMatchedDisciplines(topic).flatMap(d => getAnchors(d));
}

/**
 * 判定余量下限（百分比）。0 表示不设下限、该项检查关闭。
 *
 * 由来：机械设计里"合法的方法差异"本身就有 2-5% 的宽度（钢-钢弹性系数取 189 还是
 * 191 差 2.1%；插值口径、圆整位数各差百分之几）。判定余量若与之同量级，题目的答案
 * 就由数值噪声而非结构决定——不同答题方都算对了却给出不同结论。
 *
 * ⚠️ **governing 项之间的 15% 下限已关闭（置 0）**，原因有实测证据：
 *   · 真实机械设计里双准则安全系数本来就常常接近（齿轮接触与弯曲差 3% 属常态），
 *     强行要求拉开 15% 等于要求 A1 造一个不像工程题的参数组；
 *   · 更糟的是 A1 会把这条要求**当成题目判据写进解答**——实测中它"擅自引入题面
 *     不存在的『安全系数项间至少相差 15%』判定要求，并据此放弃尺寸更小且已满足
 *     nd=1.20 的 (18,45) 方案"，直接答错了"选最小可行组合"这个题目目标；
 *   · 结论的可判性本来就有更直接的守卫：算术复算器逐式核验 + A2 复核 + A4 盲解比对。
 *     只要出题器自己能把数算对、盲解能复现，两项贴近并不妨碍判分。
 * 保留 ndGapPercent=10：那一条守的是"通过/不通过"会不会被舍入翻转，是另一回事。
 * 个别方向仍可用 marginFloorPercent 覆盖。
 */
export interface MechanicalMarginFloor {
    /** governing 项与次不利项之间的相对差距下限 */
    governingGapPercent: number;
    /** 最不利安全系数超出设计下限 nd 的余量下限 */
    ndGapPercent: number;
}

const DEFAULT_MARGIN_FLOOR: MechanicalMarginFloor = {
    governingGapPercent: 0,
    ndGapPercent: 10,
};

export function getMarginFloor(topic: string): MechanicalMarginFloor {
    for (const d of findMatchedDisciplines(topic)) {
        const override = (d as { marginFloorPercent?: Partial<MechanicalMarginFloor> }).marginFloorPercent;
        if (override) {
            return {
                governingGapPercent: override.governingGapPercent ?? DEFAULT_MARGIN_FLOOR.governingGapPercent,
                ndGapPercent: override.ndGapPercent ?? DEFAULT_MARGIN_FLOOR.ndGapPercent,
            };
        }
    }
    return { ...DEFAULT_MARGIN_FLOOR };
}

/** 注入 A1 的判定余量要求文本（方向无关，故不依赖 matched 是否命中）。
 *  governingGapPercent=0 时整段不提"项间拉开"，只留 nd 贴边这一条 —— 见
 *  DEFAULT_MARGIN_FLOOR 注释：A1 曾把 15% 当成题目判据，据此淘汰了合法的最优方案。 */
export function getMarginFloorGuidance(topic: string): string {
    const floor = getMarginFloor(topic);
    const lines = [
        '【判定余量（结论必须由结构决定，不得由数值噪声决定）】',
        `机械设计中"都算对了"的合法方法差异本身有 2-5% 的宽度（钢-钢弹性系数取 189 还是 191 差 2.1%，插值口径、圆整位数各差百分之几）。`,
    ];
    if (floor.governingGapPercent > 0) {
        lines.push(
            `- governing 项（最不利项）与次不利项之间，换算到同一阶次后的相对差距必须 ≥ ${floor.governingGapPercent}%；`,
        );
    } else {
        lines.push(
            `- **各校核项的安全系数之间不要求拉开任何固定差距**：真实工程里双准则安全系数本来就常常接近（齿轮接触与弯曲差 3% 属常态）。若两项贴近，只需把每一步数算准、把 governing 判对即可。`,
            `- ⚠️ **"项间差距"不是本题的判据，绝不许写进题面，也绝不许在解答里用它淘汰候选方案**。可行性判据只有题面给出的那些（如各安全系数 ≥ nd）；一个余量小但满足全部题面判据的方案，就是合法方案，不得因"两项太近"改选别的。`,
        );
    }
    lines.push(
        `- 最不利安全系数与设计下限 nd 之间的余量必须 ≥ ${floor.ndGapPercent}%（无论是"通过"还是"不通过"，都要离边界足够远，否则结论会被舍入误差翻转）；这一条只约束你**选参数**，同样不许写进题面、不许当作解题判据。`,
        `- 注意换算阶次：接触安全系数 SH 的载荷阶次为平方，比较必须用 SH² 与 SF、nd 同台，直接拿 SH 比会算出完全不同的余量。`,
        `你必须在 marginReport 字段里自报这三个数：governingGapPercent、ndGapPercent、worstLegalVariationPercent`,
        `（最后一项 = 你估计的"合法方法差异"能造成的最大结论漂移，正常应 ≤5%）。自报值只作交叉参考，与解答里的安全系数交叉核对，虚报会被拦下。`,
    );
    return lines.join('\n');
}

export function getPeakDifficulty(topic: string): string {
    const matched = findMatchedDisciplines(topic);
    if (matched.length === 0) return '';
    return matched.map(d => d.peak_difficulty).join('\n\n');
}

// ============================================================
// 题型支持能力
// ============================================================

const DEFAULT_MECHANICAL_TYPES: MechanicalQuestionType[] = ['calculation', 'short-answer'];

export function getSupportedQuestionTypes(topic: string): MechanicalQuestionType[] {
    const exact = Object.values(MECHANICAL_DISCIPLINES).find(d => d.name === topic);
    if (exact) return exact.supportedTypes;

    const matched = findMatchedDisciplines(topic);
    if (matched.length === 0) return DEFAULT_MECHANICAL_TYPES;

    const union = new Set<MechanicalQuestionType>();
    for (const d of matched) {
        for (const t of d.supportedTypes) union.add(t);
    }
    return union.size > 0 ? Array.from(union) : DEFAULT_MECHANICAL_TYPES;
}

/** 无匹配/默认时返回 true（不拦截），与 materials 口径一致 */
export function isQuestionTypeSupported(topic: string, questionType: MechanicalQuestionType): boolean {
    return getSupportedQuestionTypes(topic).includes(questionType);
}

// ============================================================
// 题型适配度（仅 UI 软提示，不参与拦截）
// ============================================================

export type QuestionTypeAffinity = 'recommended' | 'discouraged' | 'neutral';

const MECHANICAL_TYPE_AFFINITY: Record<string, Partial<Record<MechanicalQuestionType, QuestionTypeAffinity>>> = {
    '齿轮传动-渐开线圆柱齿轮强度与选型': { calculation: 'recommended', 'short-answer': 'discouraged' },
    '滚动轴承-选型、当量载荷与寿命可靠度': { calculation: 'recommended' },
    '弹簧-圆柱螺旋弹簧强度、刚度与疲劳': { calculation: 'recommended', mixed: 'recommended' },
    // 组合梁方向的答案是闭式表达式，"求中性轴位置 / 写出应力与 ρ 的关系"天然是计算题；
    // mixed 同样推荐（母本第 2 题就是"求位置 + 画分布图 + 反求强度极限"的混合结构）。
    // short-answer 不推荐：本方向的判断层（模量加权 vs 几何形心）必须靠数值才能分辨对错，
    // 纯论述只比要点重合度，说得出"要按模量加权"却算错的答卷会被判对，区分度反而下降。
    '材料力学基础-多材料组合梁弯曲的中性轴与分层失效': {
        calculation: 'recommended',
        mixed: 'recommended',
        'short-answer': 'discouraged',
    },
};

export function getQuestionTypeAffinity(topic: string, questionType: MechanicalQuestionType): QuestionTypeAffinity {
    const exact = MECHANICAL_TYPE_AFFINITY[topic];
    if (exact && exact[questionType]) return exact[questionType]!;

    for (const d of findMatchedDisciplines(topic)) {
        const entry = MECHANICAL_TYPE_AFFINITY[d.name];
        if (entry && entry[questionType]) return entry[questionType]!;
    }
    return 'neutral';
}
