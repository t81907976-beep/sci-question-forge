// 生物学科难度框架映射
import type { ReasoningType } from '../../../types/multiNodeTypes';
import { callLLM } from '../../llmClient';

export const BIOLOGY_DISCIPLINES = {
    // 高中生物
    'biology-highschool': {
        name: '高中生物',
        keywords: ['光合作用', '细胞呼吸', '有氧呼吸', '无氧呼吸', '光反应', '暗反应', 'ATP', '高中'],
        reasoningType: 'conservation' as ReasoningType,
        reasoningNote: '守恒逻辑：光合与呼吸均遵循能量守恒，光合产生的有机物与消耗的 CO₂/水严格对应，推理时注意净光合 vs 总光合的区分。',
        levels: {
            basic: '光合作用与呼吸作用的基本概念，光反应与暗反应简述，ATP的产生与利用',
            intermediate: '光反应中光合磷酸化，电子传递链，暗反应中C3与C5的转化，有氧与无氧呼吸的比较',
            advanced: '光合与呼吸的整体能量联系，光合效率计算，环境因素对光合的影响',
            competition: 'C3植物与C4植物的适应进化，CAM代谢，光呼吸与光合的耦联'
        },
        peakDifficulty: '在高中教材边界内完成光合-呼吸-遗传-稳态的多步骤守恒推理，同时避免引入大学级机制替代基础概念。',
        forbiddenErrors: [
            '【总光合/净光合混淆】涉及 CO₂ 吸收、O₂ 释放或有机物积累时，必须区分总光合速率、呼吸速率与净光合速率。',
            '【教材层级越界】高中生物题不得用高级分子机制、复杂微分模型或组学术语替代教材可检验概念。',
            '【能量物质不守恒】ATP、NADPH、有机物、CO₂ 与 O₂ 的变化必须与反应阶段和场所一致，不得凭直觉增减。',
        ],
        parameterConstraints: {
            photosynthesis_stage_lock: '光反应发生于类囊体膜，暗反应发生于叶绿体基质；若题干改变场所必须给出教材内可接受解释。',
            mendelian_ratio_scope: '9:3:3:1、3:1、1:1 等比例仅适用于明确满足独立分离、完全显性和足够样本量的条件。',
            enzyme_temperature_boundary: '高中酶活题必须体现最适温度和高温失活边界，不能把温度升高无限外推为反应速率升高。',
        },
        generationChainSuggestions: [
            '先锁定教材模块和变量层级，再设置一个容易混淆的净量/总量或显隐性边界，最后要求用守恒或比例关系排除干扰选项。',
            '涉及实验题时，先给对照组、单一变量和观测指标，再要求判断实验结论是否越过证据边界。',
        ],
        diversityScaffolding: {
            objectVariants: ['叶片光合装置', '萌发种子', '孟德尔杂交群体', '人体内环境稳态', '酶促反应体系'],
            measurementTools: ['颜色反应', '气体体积变化', '显微观察', '遗传杂交统计', '对照实验'],
            dataModalities: ['曲线图', '柱状图', '表格', '遗传系谱图', '实验装置示意图'],
            perturbationTypes: ['光照强度变化', '温度变化', 'CO₂浓度变化', '基因型组合变化', '激素或酶条件变化'],
            questionStyles: ['概念边界判断', '比例推断', '实验设计评价', '曲线解释', '错误结论反证'],
            antiRepeatRule: '重复高中模块时至少更换对象、变量、数据形式和问法中的两项，避免反复套用同一光合或遗传比例模板。',
            scaffoldingTransitionRule: '不得把高中概念强行拼接成大学机制题；所有跨模块组合必须通过教材内的物质、能量、遗传或稳态关系闭合。',
        },
        antiPatternStrategies: [
            '【净量陷阱】题面同时给光合与呼吸条件，要求先判定读数代表净变化还是总过程，防止直接把传感器读数当总光合。',
            '【比例适用域陷阱】给出看似标准分离比但暗含致死、连锁或样本量不足，要求判断经典比例是否仍可使用。',
            '【实验结论越界陷阱】给出单一变量实验数据，要求区分“支持相关”与“证明机制”，防止把现象直接解释为分子因果。',
        ]
    },

    // 大学基础生物学（综合）
    'biology-university-foundation': {
        name: '大学基础生物学',
        keywords: ['中心法则', '蛋白质合成', '基因表达', '信号转导', '细胞膜', '核糖体', '大学'],
        reasoningType: 'topology' as ReasoningType,
        reasoningNote: '拓扑逻辑：基因表达调控是多层次调控网络，转录因子的激活/抑制关系构成有向图，负负得正的双重抑制链是高频考点。',
        levels: {
            basic: 'DNA与RNA结构，转录与翻译的基本过程，核糖体的功能',
            intermediate: '原核与真核基因表达的差异，mRNA加工与运输，蛋白质合成过程详解',
            advanced: '基因表达调控（转录、翻译、转录后修饰），mRNA稳定性调控',
            competition: '非编码RNA的调控功能（miRNA、lncRNA），基因表达的全局调控网络'
        },
        peakDifficulty: '在中心法则、细胞结构、信号转导和基础遗传之间建立跨层级因果链，同时判断哪些调控只改变速率、哪些改变最终表达状态。',
        forbiddenErrors: [
            '【中心法则方向倒置】不得把蛋白质序列直接作为模板反向决定 DNA 序列；逆转录仅限 RNA→DNA 且需明确条件。',
            '【原核真核机制混用】启动子结构、mRNA加工、核膜隔离、核糖体装配和转录翻译耦联必须区分物种背景。',
            '【结构功能一跳论证】不能由细胞器名称直接推出功能强弱，必须连接膜结构、酶定位、底物供应或调控步骤。',
        ],
        parameterConstraints: {
            genetic_code_reading: '翻译从 mRNA 5′→3′ 方向读取，密码子三联体不重叠；任何移码或提前终止都必须重新计算下游氨基酸。',
            eukaryotic_mrna_processing: '真核成熟 mRNA 通常涉及 5′ cap、poly(A) tail 与剪接；若题目讨论核输出或翻译效率，不能忽略加工状态。',
            membrane_transport_direction: '主动运输必须说明能量来源或电化学梯度；协助扩散不得逆浓度梯度自发进行。',
        },
        generationChainSuggestions: [
            '按 DNA/RNA/蛋白质/细胞表型四层组织变量，设置一个加工、定位或反馈环节作为分叉点。',
            '跨原核和真核比较时，先锁定是否有核膜、内含子和转录翻译时空分离，再决定调控机制。',
        ],
        diversityScaffolding: {
            objectVariants: ['原核操纵子', '真核基因', '膜受体通路', '核糖体翻译体系', '分泌蛋白加工路径'],
            measurementTools: ['荧光报告基因', 'Northern blot', 'Western blot', '亚细胞定位成像', '突变体互补实验'],
            dataModalities: ['表达量时间序列', '突变前后序列表', '亚细胞定位图', '信号通路示意图', '转录翻译对照表'],
            perturbationTypes: ['启动子突变', '剪接位点突变', '翻译抑制', '信号分子撤除', '膜运输阻断'],
            questionStyles: ['路径补全', '机制排序', '错误模型反证', '跨物种比较', '变量层级映射'],
            antiRepeatRule: '同一中心法则知识点重复出题时，必须更换生物对象、调控层级和读出方式。',
            scaffoldingTransitionRule: '跨层级组合必须说明信息流或物质流连接，禁止把基因、蛋白、细胞器功能无因果堆叠。',
        },
        antiPatternStrategies: [
            '【原核真核错配】题面给真核剪接或核输出信号，却诱导使用原核操纵子式即时翻译推理。',
            '【加工状态陷阱】给出前体 mRNA、成熟 mRNA 和蛋白读数，要求判断哪一步改变导致最终表型。',
            '【通路层级陷阱】同一信号既改变转录又改变蛋白定位时，要求拆分直接效应和延迟效应。',
        ]
    },

    // 齐变模型
    'allosteric-mwc-model': {
        name: '齐变模型',
        hierarchy: {
            discipline: 'biochemistry',
            module: 'enzyme-kinetics',
            path: ['生物化学与分子生物物理学', '酶动力学', '齐变模型']
        },
        parentDiscipline: 'biochemistry',
        parentModule: 'enzyme-kinetics',
        topicType: 'specialized-model',
        keywords: [
            '齐变模型', 'MWC模型', 'MWC model', 'Monod-Wyman-Changeux', 'Monod Wyman Changeux',
            'Monod-Wyman-Changeux model', 'Concerted Model', 'concerted allosteric model',
            '齐变假说', '对称变构模型', '协同变构模型',
            '变构调节', '别构效应', '协同性', '同盟效应', '异盟效应',
            'T态', 'R态', '变构常数', '配分函数', '巨配分函数', '状态函数',
            'Hill系数', '局域Hill系数', '自由能耦联', 'Michaelis-Menten', 'Langmuir'
        ],
        semanticAliases: [
            {
                aliases: [
                    '多亚基同步构象转换模型', '多亚基协同构象跃迁模型', '全或无变构模型',
                    '只允许全T或全R的变构模型', '禁止混合构象中间体的变构模型',
                    'concerted transition model', 'concerted symmetry model', 'all-or-none allosteric transition',
                    'two-state concerted allosteric model', 'symmetric allosteric model'
                ],
                requiredSignals: ['T态', 'R态', '同步', '齐变', 'concerted', 'symmetry', 'all-or-none', '无混合态', '混合构象', '配分函数'],
                forbiddenSignals: ['KNF', '顺序模型', 'sequential model', 'induced fit', '诱导契合', '逐步']
            }
        ],
        reasoningType: 'constraint' as ReasoningType,
        // 精准化：统计力学配分函数与构象对称性约束
        reasoningNote: '统计力学配分函数与构象对称性约束：Monod-Wyman-Changeux（MWC）齐变模型要求由 $n$ 个完全相同原体组成的多亚基蛋白只能整体处于 T 态或 R 态，所有亚基同步构象跃迁，不允许稳定 TR、RTR、RRT 等杂合中间体。核心推理必须从巨配分函数 $Z=Z_R+Z_T=(1+\\alpha)^n+L(1+c\\alpha)^n$ 出发，锁定 $\\alpha=[X]/K_R$、$c=K_R/K_T$、$L=[T_0]/[R_0]$ 的定义域与物理含义，再系统推导配体饱和度 $\\bar{Y}$、R 态构象分数 $\\bar{R}$、异盟调节后的表观 $L^{\\prime}$、局域 Hill 系数 $n_H(\\alpha)$ 和自由能耦联项。该模型的核心难点是区分“位点占有”“构象比例”“经验 Hill 拟合”“异盟调节”和“自由能耦联”五类不同物理量。',
        levels: {
            basic: '识别 T 态、R 态、同盟效应、异盟效应和协同性的基本概念；理解 MWC 模型与 KNF 顺序模型的区别，知道齐变模型不允许稳定杂合构象中间体。',
            intermediate: '掌握 $n$、$K_R$、$K_T$、$\\alpha=[X]/K_R$、$c=K_R/K_T$、$L=[T_0]/[R_0]$ 的定义；能根据 $L$、$c$、$n$ 判断配体结合曲线的左移、右移、协同性增强或减弱，并能识别 $L\\to0$ 与 $c=0$ 的极限退化。',
            advanced: '从配分函数 $Z=(1+\\alpha)^n+L(1+c\\alpha)^n$ 推导 $\\bar{Y}=\\frac{\\alpha(1+\\alpha)^{n-1}+Lc\\alpha(1+c\\alpha)^{n-1}}{(1+\\alpha)^n+L(1+c\\alpha)^n}$ 与 $\\bar{R}=\\frac{(1+\\alpha)^n}{(1+\\alpha)^n+L(1+c\\alpha)^n}$；能用 $\\bar{Y}=\\frac{\\alpha}{1+\\alpha}\\bar{R}+\\frac{c\\alpha}{1+c\\alpha}(1-\\bar{R})$ 区分构象读数和配体饱和读数。',
            competition: '① MWC/KNF 模型混用陷阱：题干若声明使用齐变模型，就不能引入稳定 TR、RTR 或逐步诱导契合中间体。② $\\bar{Y}$ 与 $\\bar{R}$ 解耦陷阱：高饱和度不必等于全部蛋白处于 R 态，高 R 态比例也不等于所有位点被配体占据。③ 表观 $L^{\\prime}$ 陷阱：R 态激活剂和 T 态抑制剂首先改变构象平衡常数，$L^{\\prime}=L[(1+[I]/K_I)/(1+[A]/K_A)]^n$，而不是必然改变 $K_R$ 或 $K_T$。④ 局域 Hill 系数陷阱：$n_H(\\alpha)=d\\ln(\\bar{Y}/(1-\\bar{Y}))/d\\ln\\alpha$ 随配体浓度变化，低浓度和高浓度极限均趋近 1，不能把经验 Hill 指数直接等同于亚基数 $n$。⑤ 自由能符号陷阱：若 $L=[T_0]/[R_0]$，则 $\\Delta G_0=G_R-G_T=RT\\ln L$；配体结合后的耦联项需按 $\\Delta G_m=RT\\ln L+mRT\\ln[(1+c\\alpha)/(1+\\alpha)]$ 审计符号。'
        },
        peakDifficulty: '在同一多亚基变构体系中，同时利用结合饱和度曲线、构象读数、异盟调节剂响应、局域 Hill 斜率和自由能差反演 $K_R,K_T,L,c,n$，并判断该体系是否仍满足 MWC 齐变对称性假设。',
        formulaCoverage: {
            modelAssumptions: [
                'MWC 模型又称齐变模型或 Concerted Model，用于解释分子协同效应与变构调节。',
                '蛋白多聚体由 $n$ 个完全相同亚基组成；空间构象保持绝对对称，所有亚基必须在同一次协调跃迁中从 T 态转变为 R 态或从 R 态转变为 T 态。',
                '模型禁止稳定杂合中间体，例如 TR、RTR、RRT 等混合构象；若题干允许逐步诱导契合，应切换到 KNF 或其他顺序模型。'
            ],
            coreParameters: [
                '$n$：原体或亚基数目，例如血红蛋白通常取 $n=4$。',
                '$K_R,K_T$：配体 $X$ 分别与 R 态和 T 态亚基结合的微观解离常数；经典高亲和 R 态满足 $K_R\\ll K_T$。',
                '$\\alpha=[X]/K_R$：归一化配体浓度，必须为非负无量纲量。',
                '$c=K_R/K_T$：亲和力比值；经典 MWC 高亲和 R 态通常满足 $0\\le c<1$，$c=0$ 表示配体排他性结合 R 态。',
                '$L=[T_0]/[R_0]$：未结合配体时 T 态与 R 态的变构常数；通常 $L\\gg1$，表示游离态 T 态更稳定。'
            ],
            partitionFunction: [
                '巨配分函数或玻尔兹曼加权和：$Z=Z_R+Z_T=(1+\\alpha)^n+L(1+c\\alpha)^n$。',
                'R 态统计权重：$Z_R=(1+\\alpha)^n$，代表从未结合到结合 $n$ 个配体的所有 R 态结合物。',
                'T 态统计权重：$Z_T=L(1+c\\alpha)^n$，代表从未结合到结合 $n$ 个配体的所有 T 态结合物；二项式展开已经包含组合权重。',
                '所有宏观可观测量均应从 $Z$ 的概率权重或对 $Z$ 的偏导导出，不能在配分函数外重复乘组合数。'
            ],
            homotropicSaturation: [
                '饱和度定义：$\\bar{Y}=\\frac{1}{n}\\frac{\\partial\\ln Z}{\\partial\\ln\\alpha}$。',
                '通用 MWC 饱和度方程：$\\bar{Y}=\\frac{\\alpha(1+\\alpha)^{n-1}+Lc\\alpha(1+c\\alpha)^{n-1}}{(1+\\alpha)^n+L(1+c\\alpha)^n}$。',
                '$L\\to0$ 时系统完全锁定在 R 态，$\\bar{Y}=\\frac{\\alpha}{1+\\alpha}=\\frac{[X]}{K_R+[X]}$，退化为无协同性的 Michaelis-Menten / Langmuir 吸附形式。',
                '$c=0$ 时配体完全不结合 T 态，$\\bar{Y}=\\frac{\\alpha(1+\\alpha)^{n-1}}{(1+\\alpha)^n+L}$，表现为强协同性极限。'
            ],
            stateFunction: [
                'R 态构象分数：$\\bar{R}=\\frac{Z_R}{Z}=\\frac{(1+\\alpha)^n}{(1+\\alpha)^n+L(1+c\\alpha)^n}$。',
                '$\\bar{Y}$ 与 $\\bar{R}$ 的加权关系：$\\bar{Y}=\\frac{\\alpha}{1+\\alpha}\\bar{R}+\\frac{c\\alpha}{1+c\\alpha}(1-\\bar{R})$。',
                '物理含义：总饱和度等于 R 态微观饱和度乘以 R 态比例，加上 T 态微观饱和度乘以 T 态比例；结合读数与构象读数可联立约束 $L$ 与 $c$。'
            ],
            heterotropicEffect: [
                '若激活剂 $A$ 专一性结合 R 态、抑制剂 $I$ 专一性结合 T 态，且每个原体有 $n$ 个调节位点，则表观变构常数为 $L^{\\prime}=L\\left[\\frac{1+[I]/K_I}{1+[A]/K_A}\\right]^n$。',
                '含调节剂的全局饱和度公式：$\\bar{Y}=\\frac{\\alpha(1+\\alpha)^{n-1}+L\\left[\\frac{1+[I]/K_I}{1+[A]/K_A}\\right]^n c\\alpha(1+c\\alpha)^{n-1}}{(1+\\alpha)^n+L\\left[\\frac{1+[I]/K_I}{1+[A]/K_A}\\right]^n(1+c\\alpha)^n}$。',
                '激活剂 $[A]$ 增大时 $L^{\\prime}$ 减小，曲线左移且亲和力提高；抑制剂 $[I]$ 增大时 $L^{\\prime}$ 增大，曲线右移且 S 型特征通常更显著。'
            ],
            hillCoefficient: [
                '经验 Hill 方程 $Y=\\frac{[X]^{n_H}}{K_{0.5}^{n_H}+[X]^{n_H}}$ 中的 $n_H$ 不能直接等同于物理亚基数。',
                '局域 Hill 系数定义：$n_H(\\alpha)=\\frac{d\\ln(\\bar{Y}/(1-\\bar{Y}))}{d\\ln\\alpha}$。',
                'MWC 局域 Hill 系数显式式：$n_H(\\alpha)=1+(n-1)\\bar{R}(1-\\bar{R})\\frac{(1-c)^2\\alpha}{(1+\\alpha)[1+\\bar{R}(c-1)][c\\alpha+\\bar{R}(1-c\\alpha)]}$。',
                '$\\alpha\\to0$ 或 $\\alpha\\to\\infty$ 时 $n_H\\to1$，说明极低或极高浓度下系统分别表现为近似纯 T 态或纯 R 态的 Langmuir 行为。',
                '最大协同性通常发生在构象跃迁最剧烈区域，即 $\\bar{R}\\approx0.5$ 附近；当 $c=0$ 时可用 $n_{H,\\max}\\approx\\frac{n}{1+2(n-1)/\\sqrt{L}}$ 估算，只有 $L\\to\\infty$ 时才逼近 $n$。'
            ],
            thermodynamics: [
                '无配体构象跃迁自由能：$\\Delta G_0=G_R-G_T=-RT\\ln([R_0]/[T_0])=RT\\ln L$。',
                '结合 $m$ 个配体后的表观构象跃迁自由能：$\\Delta G_m=RT\\ln L+mRT\\ln\\left(\\frac{1+c\\alpha}{1+\\alpha}\\right)$。',
                '由于经典 MWC 中 $c<1$，第二项为负；随着配体结合增加，构象跃迁自由能下降，解释配体结合如何补偿 T→R 构象转变代价。'
            ]
        },
        forbiddenErrors: [
            '【MWC/KNF模型混用】MWC 齐变模型禁止出现稳定 TR、RTR、RRT 等杂合构象中间体；若题目使用顺序诱导模型，必须显式声明不再采用 MWC 假设。',
            '【L与c定义倒置】本框架固定 $L=[T_0]/[R_0]$、$c=K_R/K_T$；写反会导致自由能符号、曲线平移方向和激活/抑制效应全部反号。',
            '【饱和度等同构象比例】$\\bar{Y}$ 是配体位点占有比例，$\\bar{R}$ 是蛋白分子构象比例，二者不能直接相等；必须使用加权关系 $\\bar{Y}=\\frac{\\alpha}{1+\\alpha}\\bar{R}+\\frac{c\\alpha}{1+c\\alpha}(1-\\bar{R})$ 才能相互联系。',
            '【重复计算组合权重】$(1+\\alpha)^n$ 与 $(1+c\\alpha)^n$ 的二项式展开已经包含各结合数目的组合权重，不能在总配分函数外再次乘组合数。',
            '【Hill系数常数化】MWC 的局域 $n_H(\\alpha)$ 随配体浓度变化，低/高浓度极限应趋近 1；不得把单一经验 Hill 指数当作全局物理亚基数。',
            '【异盟调节改错参数】偏向 R 态或 T 态结合的调节剂首先改变表观 $L$；除非题干明确说明，否则不得擅自改写 $K_R$、$K_T$ 或 $V_{max}$。',
            '【极限退化漏判】$L\\to0$ 应退化为 R 态 Langmuir 公式，$c=0$ 应退化为配体排他性结合 R 态的强协同性公式；若极限不成立，说明公式或参数定义有误。',
            '【自由能符号漏审】若 $L=[T_0]/[R_0]$，则 $\\Delta G_0=RT\\ln L$；配体耦联项 $mRT\\ln[(1+c\\alpha)/(1+\\alpha)]$ 在 $c<1$ 时应降低 T→R 代价。',
        ],
        parameterConstraints: {
            mwc_alpha_definition: '$\\alpha=[X]/K_R$ 必须为非负无量纲量；若题目改用 $[X]/K_T$，必须同步重定义全部公式。',
            mwc_c_range: '经典高亲和 R 态前提下 $0 \\le c=K_R/K_T<1$；若 $c>1$，必须明确说明这是 T 态亲和力更高的反常变构体系。',
            mwc_L_definition: '$L=[T_0]/[R_0]$；游离态偏 T 时 $L\\gg1$，并有 $\\Delta G_0=G_R-G_T=RT\\ln L>0$。',
            mwc_partition_function: '标准 MWC 配分函数为 $Z=Z_R+Z_T=(1+\\alpha)^n+L(1+c\\alpha)^n$；不得额外加入稳定 TR 混合构象项。',
            mwc_saturation_formula: '$\\bar{Y}$ 必须由 $\\bar{Y}=\\frac{1}{n}\\frac{\\partial\\ln Z}{\\partial\\ln\\alpha}$ 或等价概率加权推导，标准式为 $\\bar{Y}=\\frac{\\alpha(1+\\alpha)^{n-1}+Lc\\alpha(1+c\\alpha)^{n-1}}{(1+\\alpha)^n+L(1+c\\alpha)^n}$。',
            mwc_state_function: '$\\bar{R}=\\frac{(1+\\alpha)^n}{(1+\\alpha)^n+L(1+c\\alpha)^n}$；题目若同时给构象读数与结合读数，必须先区分 $\\bar{R}$ 与 $\\bar{Y}$。',
            mwc_heterotropic_formula: 'R 态激活剂与 T 态抑制剂的标准处理为 $L^{\\prime}=L[(1+[I]/K_I)/(1+[A]/K_A)]^n$，再把 $L^{\\prime}$ 代入 $\\bar{Y}$ 公式。',
            mwc_hill_limit: '局域 Hill 系数在 $\\alpha\\to0$ 与 $\\alpha\\to\\infty$ 极限应回到 1；若实验曲线不满足，应考虑非 MWC 机制或实验伪影。',
            mwc_free_energy_linkage: '自由能审计必须同时检查 $\\Delta G_0=RT\\ln L$ 与 $\\Delta G_m=RT\\ln L+mRT\\ln[(1+c\\alpha)/(1+\\alpha)]$ 的符号和物理方向。',
        },
        generationChainSuggestions: [
            '先声明模型边界：$n$ 个相同亚基、只有全 T 或全 R 两类构象、无稳定混合态；再给出 $K_R,K_T,L,[X]$ 或 $\\alpha,c,L$，要求从巨配分函数 $Z=Z_R+Z_T=(1+\\alpha)^n+L(1+c\\alpha)^n$ 推导 $\\bar{Y}$ 与 $\\bar{R}$。',
            '设计同盟效应题时，先要求写出 $\\bar{Y}=\\frac{1}{n}\\frac{\\partial\\ln Z}{\\partial\\ln\\alpha}$，再展开为通用饱和度方程，并检查 $L\\to0$ 与 $c=0$ 两个极限是否正确退化。',
            '设计异盟调节题时，优先通过 $L^{\\prime}=L[(1+[I]/K_I)/(1+[A]/K_A)]^n$ 判断激活剂/抑制剂造成的曲线平移，再把 $L^{\\prime}$ 代入完整 $\\bar{Y}$ 公式，而不是直接改写配体结合常数。',
            '同时给出结合读数和构象读数时，要求用 $\\bar{Y}=\\frac{\\alpha}{1+\\alpha}\\bar{R}+\\frac{c\\alpha}{1+c\\alpha}(1-\\bar{R})$ 判断二者是否可由同一组 $L,c,n$ 解释，迫使解题者区分 $\\bar{Y}$ 与 $\\bar{R}$。',
            '在高阶题中加入 Hill 图局部斜率，要求根据 $n_H(\\alpha)=d\\ln(\\bar{Y}/(1-\\bar{Y}))/d\\ln\\alpha$ 判断协同性随浓度的变化，并用 $n_{H,\\max}\\approx n/[1+2(n-1)/\\sqrt{L}]$ 审计 $c=0$ 极限。',
            '在热力学题中加入自由能符号审计，要求根据 $L=[T_0]/[R_0]$ 判断 $\\Delta G_0=RT\\ln L$ 的方向，并用 $\\Delta G_m=RT\\ln L+mRT\\ln[(1+c\\alpha)/(1+\\alpha)]$ 解释配体结合如何补偿 T→R 构象跃迁代价。',
        ],
        diversityScaffolding: {
            objectVariants: ['血红蛋白四聚体', 'ATCase', 'PFK-1', '多亚基变构酶', '配体门控离子通道', '人工设计变构蛋白'],
            measurementTools: ['氧结合曲线', '荧光配体滴定', '圆二色谱CD', 'NMR构象读数', '酶动力学曲线', '停流动力学'],
            dataModalities: ['MWC饱和曲线', 'Hill图局部斜率', 'R态分数-配体浓度曲线', '激活剂/抑制剂滴定曲线', '自由能差表', '构象占有率矩阵'],
            perturbationTypes: ['R态激活剂加入', 'T态抑制剂加入', '2,3-BPG变化', 'pH变化', '亚基数改变', '点突变改变K_R或K_T'],
            questionStyles: ['配分函数推导', '参数反演', '构象-饱和度解耦判断', 'Hill斜率局部判定', '自由能符号审计', '模型适用性反证'],
            antiRepeatRule: '重复 MWC 题时必须更换蛋白对象、读出模态和扰动条件；不得总是血红蛋白吸氧曲线，也不得直接复用同一组 $L,c,n$ 参数。',
            scaffoldingTransitionRule: 'MWC 变构、酶动力学、结构构象读数和热力学自由能必须通过共同的构象状态或配体结合权重闭合，禁止把 Hill 方程、Michaelis-Menten 和 MWC 配分函数机械拼接。',
        },
        antiPatternStrategies: [
            '【模型边界陷阱】题干先声明齐变模型，再给出看似合理的 TR 中间态数据，要求判断该数据是否已经推翻 MWC 假设。',
            '【构象-结合解耦陷阱】同时给出荧光结合饱和度和 CD 构象比例，要求判断二者是否能直接相等，防止把不同实验读数混为一谈。',
            '【参数定义反号陷阱】故意给出 $L=[R_0]/[T_0]$ 的替代定义或 $c=K_T/K_R$ 的反定义，要求先统一定义再计算曲线方向。',
            '【Hill斜率陷阱】给出低、中、高三个浓度区间的 Hill 图斜率，要求指出只有跃迁区附近协同性最强，而不是全区间固定为 $n$。',
            '【异盟调节陷阱】给出 R 态激活剂和 T 态抑制剂的浓度变化，要求先计算表观 $L^{\\prime}$，再判断曲线左移/右移和协同性变化。',
            '【极限退化陷阱】给出 $L\\to0$ 或 $c=0$ 的参数边界，要求检查公式是否分别退化为 R 态 Langmuir 形式或强协同性排他结合形式。',
            '【自由能耦联陷阱】给出 $m$、$L$、$c$、$\\alpha$，要求判断 $\\Delta G_m$ 是否已经变负，并解释构象翻转的能量来源。',
        ]
    },

    'adair-equation': {
        name: 'Adair 方程',
        hierarchy: {
            discipline: 'biochemistry',
            module: 'enzyme-kinetics',
            path: ['生物化学与分子生物物理学', '酶动力学', 'Adair 方程']
        },
        parentDiscipline: 'biochemistry',
        parentModule: 'enzyme-kinetics',
        topicType: 'specialized-model',
        keywords: [
            'Adair方程', 'Adair Equation', 'Adair结合多项式', 'binding polynomial',
            '多位点结合', '多配体结合', '逐步结合常数', '累积稳定常数',
            'beta_i', 'βi', '宏观结合常数', '微观亲和力', '固有亲和力',
            '统计因子', '组合权重', '游离配体浓度', '总配体浓度',
            '饱和度', 'fractional saturation', '别构效应', '协同性',
            'MWC模型', 'KNF模型', 'Hill系数', '血红蛋白'
        ],
        reasoningType: 'constraint' as ReasoningType,
        // 精准化：多位点结合热力学权重与宏观常数约束
        reasoningNote: '多位点结合热力学权重与宏观常数约束：Adair 方程不假设 T/R 态、不假设诱导契合，也不预设任何构象路径；它只把一个多位点蛋白在热力学平衡下结合 0,1,2,...,n 个配体的状态权重写成结合多项式，并用结合数加权平均得到饱和度。四聚体核心式为 $Y=\\frac{\\beta_1[S]+2\\beta_2[S]^2+3\\beta_3[S]^3+4\\beta_4[S]^4}{4(1+\\beta_1[S]+\\beta_2[S]^2+\\beta_3[S]^3+\\beta_4[S]^4)}$，其中 $\\beta_i=\\prod_{j=1}^{i}K_j$ 是累积稳定常数。推理时必须同时锁定 $[S]$ 是游离配体浓度、$K_i$ 是宏观逐步结合常数而非单个位点微观亲和力、分母是所有结合状态的相对权重和、分子是已结合配体数的加权权重。MWC 与 KNF 等别构模型可以化为特定 Adair 参数组合，但 Adair 本身只能描述结合热力学结果，不能单独证明构象机制。',
        levels: {
            basic: '识别 Adair 方程、Adair 结合多项式、多位点结合和饱和度 $Y$ 的基本概念；知道 Adair 方程是无构象假设的表观热力学方程，不直接区分齐变、序变或诱导契合机制。',
            intermediate: '掌握四聚体 Adair 公式 $Y=\\frac{\\beta_1[S]+2\\beta_2[S]^2+3\\beta_3[S]^3+4\\beta_4[S]^4}{4(1+\\beta_1[S]+\\beta_2[S]^2+\\beta_3[S]^3+\\beta_4[S]^4)}$，理解 $\\beta_i=\\prod_{j=1}^{i}K_j$、分母状态权重和、分子结合数加权和以及前置归一化因子 4 的物理含义。',
            advanced: '能区分宏观逐步结合常数 $K_1,K_2,K_3,K_4$ 与位点微观固有亲和力 $K_0$；在四个完全等价且独立无协同的位点中，宏观常数天然满足 $K_1=4K_0, K_2=\\frac{3}{2}K_0, K_3=\\frac{2}{3}K_0, K_4=\\frac{1}{4}K_0$，不能因为逐步常数递减就直接判定负协同。',
            competition: '① 宏观/微观常数陷阱：$K_i$ 是宏观逐步结合常数，不是单个位点的固有亲和力；若把 $K_1>K_2>K_3>K_4$ 直接解释为负协同，会把无协同体系的统计因子误判为能量耦联。② 游离/总浓度陷阱：Adair 方程中的 $[S]$ 必须是游离配体浓度；蛋白浓度较高或配体被显著消耗时，不能把总配体浓度直接代入。③ 过度拟合陷阱：四聚体 Adair 方程含多个 $\\beta$ 参数，一条普通 S 型曲线通常不足以唯一反演 $\\beta_1,\\beta_2,\\beta_3,\\beta_4$，必须警惕参数不可识别。④ 机制误读陷阱：MWC/KNF 可化为 Adair 的具体参数解，但 Adair 本身是唯象热力学表达，不能证明蛋白采取齐变还是序变机制。'
        },
        peakDifficulty: '在同一多位点结合体系中，同时利用饱和度曲线、游离配体修正、宏观/微观常数统计因子、Hill 斜率和 MWC/KNF 机制边界，判断一组 Adair 参数是否可识别、是否超出无协同统计基线，以及能否支持具体变构机制。',
        formulaCoverage: {
            modelAssumptions: [
                'Adair 方程又称 Adair 结合多项式，是多位点配体结合的表观热力学严格表达。',
                '模型只要求体系达到热力学平衡，并枚举结合 0 到 $n$ 个配体的状态权重；它不要求存在 T/R 构象平衡，也不要求逐步诱导契合。',
                'Adair 方程描述的是结合曲线和状态占有的热力学结果，不提供构象转换路径或亚基相互作用机制。'
            ],
            coreParameters: [
                '$[S]$：游离配体浓度，不能在配体被蛋白显著消耗时用总配体浓度直接替代。',
                '$K_i$：第 $i$ 步宏观逐步结合常数，反映从结合 $i-1$ 个配体的宏观状态到结合 $i$ 个配体的总体平衡倾向。',
                '$\\beta_i=\\prod_{j=1}^{i}K_j$：累积稳定常数；四聚体中 $\\beta_1=K_1$，$\\beta_2=K_1K_2$，$\\beta_3=K_1K_2K_3$，$\\beta_4=K_1K_2K_3K_4$。',
                '$Y$：分数饱和度，即已结合位点数除以总结合位点数。'
            ],
            tetramerEquation: [
                '四聚体 Adair 方程：$Y=\\frac{\\beta_1[S]+2\\beta_2[S]^2+3\\beta_3[S]^3+4\\beta_4[S]^4}{4(1+\\beta_1[S]+\\beta_2[S]^2+\\beta_3[S]^3+\\beta_4[S]^4)}$。',
                '连续结合反应可写为 $P+S\\rightleftharpoons PS_1$、$PS_1+S\\rightleftharpoons PS_2$、$PS_2+S\\rightleftharpoons PS_3$、$PS_3+S\\rightleftharpoons PS_4$。',
                '一般 $n$ 位点体系可写为 $Y=\\frac{\\sum_{i=1}^{n}i\\beta_i[S]^i}{n\\sum_{i=0}^{n}\\beta_i[S]^i}$，其中 $\\beta_0=1$。'
            ],
            bindingPolynomialMeaning: [
                '分母中的 $1+\\beta_1[S]+\\beta_2[S]^2+\\cdots+\\beta_n[S]^n$ 是所有结合数状态的相对权重和，代表结合多项式。',
                '四聚体分母外的 4 表示总位点数；归一化后得到每个位点的平均占有比例。',
                '分子中的系数 $1,2,3,4$ 表示对应状态下已结合配体数，因此分子是结合数加权后的状态权重和。',
                '公式的本质是“已结合配体总数的期望值 / 总位点数”，而不是某一个具体构象状态的比例。'
            ],
            statisticalFactors: [
                '宏观逐步常数包含统计因子：第一个配体有多个空位可结合，最后一个配体只有少数空位可结合；解离方向也有对应的已结合配体数差异。',
                '四个完全等价且互不耦联的位点若微观亲和力为 $K_0$，宏观逐步结合常数满足 $K_1=4K_0, K_2=\\frac{3}{2}K_0, K_3=\\frac{2}{3}K_0, K_4=\\frac{1}{4}K_0$。',
                '因此宏观 $K_1>K_2>K_3>K_4$ 并不自动代表负协同；必须先除去组合统计基线，再判断是否存在真实能量耦联。'
            ],
            modelReduction: [
                'MWC 齐变模型和 KNF 序变模型在数学上都可折叠为某组 Adair 系数，因此 Adair 方程可作为多种别构模型的共同表观出口。',
                '若题目要求解释 T/R 构象选择、杂合态、界面拓扑或诱导契合路径，必须进一步调用 MWC 或 KNF 机制模型，不能停留在 Adair 唯象表达。',
                '同一组或近似同一组 Adair 曲线可能对应多个不同微观机制，因此 Adair 拟合结果不能单独作为机制判据。'
            ],
            identifiability: [
                '四聚体 Adair 方程有 $\\beta_1,\\beta_2,\\beta_3,\\beta_4$ 多个自由参数，普通饱和曲线常不足以稳定唯一拟合全部参数。',
                '若没有高精度全区间数据、独立结合数分布测量、ITC 热量约束或突变/构象读数辅助，直接给出四个 $\\beta_i$ 的物理解释通常不可靠。',
                '拟合得到的 S 型曲线能说明表观协同趋势，但不能自动区分正协同、负协同、统计因子、构象选择和诱导契合。'
            ]
        },
        forbiddenErrors: [
            '【宏观/微观常数混淆】Adair 方程中的 $K_i$ 是宏观逐步结合常数，不能直接等同于单个位点的微观固有亲和力。',
            '【统计递减误判负协同】四个独立等价位点的无协同体系也会出现 $K_1>K_2>K_3>K_4$；未扣除统计因子前不得判定负协同。',
            '【游离/总配体浓度混淆】公式中的 $[S]$ 是游离配体浓度；当蛋白浓度高或配体被大量结合时，不得把总配体浓度直接代入。',
            '【Adair机制化误读】Adair 方程是表观热力学方程，不能单独证明齐变、序变、诱导契合或特定构象路径。',
            '【四参数过拟合幻觉】仅凭一条普通 S 型饱和曲线通常不能唯一识别 $\\beta_1,\\beta_2,\\beta_3,\\beta_4$；不得给出过度精确的机制解释。',
            '【归一化位点数漏除】四聚体饱和度分母必须包含总位点数 4；若只除以结合多项式，将得到平均结合配体数而非分数饱和度。'
        ],
        parameterConstraints: {
            adair_beta_definition: '$\\beta_i=\\prod_{j=1}^{i}K_j$，且 $\\beta_0=1$；不得把 $\\beta_i$ 误写成单个第 $i$ 步常数。',
            adair_free_ligand_required: 'Adair 方程中的 $[S]$ 必须是游离配体浓度；若只给总配体浓度且蛋白结合量不可忽略，必须先用质量守恒求 $[S]_{free}$。',
            adair_macroscopic_constants: '$K_i$ 是宏观逐步结合常数，已经包含可结合空位数和可解离配体数的统计贡献。',
            adair_independent_tetramer_ratio: '四个独立等价位点且微观亲和力为 $K_0$ 时，宏观常数基线为 $K_1=4K_0, K_2=\\frac{3}{2}K_0, K_3=\\frac{2}{3}K_0, K_4=\\frac{1}{4}K_0$。',
            adair_saturation_normalization: '四聚体分数饱和度必须除以 4；一般 $n$ 位点体系必须除以 $n$，否则计算的是平均结合数而不是 $Y$。',
            adair_identifiability_warning: '若没有独立实验约束，四聚体 Adair 拟合的多个 $\\beta_i$ 可能高度相关，不得把数值拟合结果直接解释为唯一物理机制。'
        },
        generationChainSuggestions: [
            '先给出 $P,PS_1,PS_2,PS_3,PS_4$ 的连续结合反应和 $K_1,K_2,K_3,K_4$，要求写出 $\\beta_i$ 与四聚体 Adair 饱和度公式，再解释分子分母的物理含义。',
            '设计宏观常数陷阱时，给出 $K_1>K_2>K_3>K_4$ 的数据，要求先与独立四同位点统计基线比较，再判断是否存在真实负协同。',
            '设计游离浓度陷阱时，同时给出蛋白总浓度和配体总浓度，要求判断 $[S]_{total}\\approx[S]_{free}$ 是否成立，防止直接代入 Adair 方程。',
            '设计拟合题时，给出一条普通 S 型饱和曲线和多组相近的 $\\beta$ 参数，要求判断参数不可识别而不是强行选定唯一机制。',
            '设计模型比较题时，先用 Adair 方程描述共同表观曲线，再要求说明为什么还需要 MWC 或 KNF 才能解释 T/R 平衡、杂合态或诱导契合机制。'
        ],
        diversityScaffolding: {
            objectVariants: ['血红蛋白四聚体', '多亚基别构酶', '四位点受体', '人工多价结合蛋白', '配体门控通道', '抗体-抗原多价体系'],
            measurementTools: ['氧结合曲线', '荧光配体滴定', 'ITC等温滴定量热', '平衡透析', '质谱结合数分布', '停流结合实验'],
            dataModalities: ['Adair饱和曲线', '逐步结合常数表', '累积稳定常数表', '游离/总配体浓度表', 'Hill图', '结合数分布柱状图'],
            perturbationTypes: ['改变蛋白总浓度', '改变配体总量', '突变单个位点亲和力', '破坏亚基界面', '加入异盟调节剂', '改变温度或pH'],
            questionStyles: ['结合多项式推导', '宏观/微观常数判别', '统计因子校正', '游离浓度质量守恒', '参数可识别性判断', '机制模型边界反证'],
            antiRepeatRule: '重复 Adair 题时必须更换位点数、读出模态和错误来源；不得总是四聚体血红蛋白公式直代。',
            scaffoldingTransitionRule: 'Adair、MWC、KNF 与 Hill 方程必须通过“表观结合曲线—机制假设—经验拟合”三层边界衔接，禁止把唯象参数直接当构象机制。'
        },
        antiPatternStrategies: [
            '【统计基线陷阱】给出严格独立四同位点的宏观常数递减序列，要求指出这是组合统计造成的无协同基线，而不是负协同。',
            '【总量代入陷阱】给高浓度蛋白体系和总配体浓度，要求先写质量守恒并判断游离配体是否显著低于总量。',
            '【拟合幻觉陷阱】给两组几乎重合的 S 型曲线拟合参数，要求说明 Adair 参数不可识别，不能过度解释每个 $\\beta_i$。',
            '【机制越界陷阱】给出符合 Adair 方程的曲线，诱导断言 MWC 或 KNF，要求指出仅凭 Adair 曲线无法证明具体构象机制。',
            '【归一化陷阱】要求区分平均结合配体数 $\\bar{\\nu}$ 与分数饱和度 $Y=\\bar{\\nu}/n$，防止漏除总位点数。'
        ]
    },

    'allosteric-knf-model': {
        name: '序变模型',
        hierarchy: {
            discipline: 'biochemistry',
            module: 'enzyme-kinetics',
            path: ['生物化学与分子生物物理学', '酶动力学', '序变模型']
        },
        parentDiscipline: 'biochemistry',
        parentModule: 'enzyme-kinetics',
        topicType: 'specialized-model',
        keywords: [
            '序变模型', 'KNF模型', 'Koshland-Némethy-Filmer', 'Sequential Model',
            '诱导契合', 'Induced Fit', '杂合态', 'Hybrid State', '负协同', '正协同',
            'A态', 'B态', 'AB界面', 'BB界面', '界面相互作用', '几何拓扑',
            '线型三聚体', '正方形四聚体', '正四面体四聚体', 'Kt', 'Kx', 'Ks', 'KAB', 'KBB'
        ],
        reasoningType: 'topology' as ReasoningType,
        // 精准化：诱导契合、杂合构象与界面拓扑配分函数
        reasoningNote: '诱导契合与界面拓扑约束：Koshland-Némethy-Filmer（KNF）序变模型认为底物结合会强迫被结合亚基从 A 态转变为 B 态，并通过亚基间界面应变顺序改变相邻亚基亲和力；严格 KNF 不承认无底物时天然存在的 B/R 高亲和构象，因此不能使用 MWC 的 $L=[T_0]/[R_0]$ 天然构象平衡。KNF 允许同一寡聚体内存在 $A_3B_1$、$A_2B_2$、$A_1B_3$ 等杂合态，协同性由 $AA,AB,BB$ 界面相互作用常数与空间几何拓扑共同决定。核心推理必须先枚举拓扑图上的结合位点与界面类型，再写配分函数 $Z$ 和饱和度 $Y$，不能套用 MWC 的全 T/全 R 二态公式。',
        levels: {
            basic: '识别 KNF 序变模型、诱导契合、A 态/B 态、杂合态和正/负协同的基本概念；理解 KNF 与 MWC 的核心差异：KNF 是底物诱导的逐亚基构象改变，MWC 是天然构象平衡中的构象选择。',
            intermediate: '掌握 $K_t=[B]/[A]$、$K_x=[BX]/([B][X])$、$K_s=K_tK_x$ 以及界面常数 $K_{AA},K_{AB},K_{BB}$ 的含义；能用二聚体配分函数 $Z=1+2K_sK_{AB}[X]+K_s^2K_{BB}[X]^2$ 推导 $Y$。',
            advanced: '能按线型、正方形、正四面体等几何拓扑枚举 $AA,AB,BB$ 界面数，识别同一结合数下因端点/中间、邻位/对位等空间关系导致的统计权重拆分；能判断 $K_{BB}>K_{AB}^2$ 的正协同与 $K_{BB}<K_{AB}^2$ 的负协同。',
            competition: '① MWC 惯性陷阱：严格 KNF 中无底物时不存在游离 B/R 高亲和亚基，不能引入 $L=[T_0]/[R_0]$。② 杂合态陷阱：KNF 允许 $A_3B_1,A_2B_2,A_1B_3$ 等混合构象，不能强行全 A 或全 B。③ 拓扑拆项陷阱：正方形四聚体结合两个底物时邻位与对位界面类型不同，必须拆成不同权重；正四面体对应状态则可能等价。④ 常数解耦陷阱：$K_t$ 改变构象形变代价，$K_x$ 改变纯 B 态结合亲和力，单亚基表观项常以 $K_s=K_tK_x$ 出现，二者可互相抵消。⑤ 负协同陷阱：$n_H<1$ 或曲线比双曲线更钝化时应优先考虑 KNF，而不是 MWC。⑥ Hill 上界陷阱：拥有 $n$ 个位点的 KNF 系统表观 $n_H$ 不能超过物理位点数 $n$。'
        },
        peakDifficulty: '在非全连接拓扑的多亚基别构酶中，按结合位点、空间邻接关系和 $AA/AB/BB$ 界面能逐项枚举微观状态，写出可区分端点/中间、邻位/对位、线型/环型/四面体差异的 KNF 配分函数，并由此判断正协同、负协同、Hill 系数边界和与 MWC 模型的适用性分歧。',
        formulaCoverage: {
            modelAssumptions: [
                'KNF 模型又称序变模型或 Sequential Model，用于解释多亚基变构酶的顺序构象改变与协同效应。',
                '严格 KNF 采用诱导契合：无底物时所有亚基处于初始 A 态；只有底物 $X$ 结合后，该亚基才被迫转变为 B 态。',
                'KNF 允许杂合构象，同一寡聚体内可同时存在 A 态和 B 态亚基，例如 $A_3B_1,A_2B_2,A_1B_3$。',
                '协同性来自亚基构象改变造成的界面相互作用能变化，而不是 MWC 式全局 T/R 构象平衡。'
            ],
            coreParameters: [
                '$K_t=[B]/[A]$：单个亚基本征构象转变常数，描述 A 态转为 B 态的形变倾向或代价。',
                '$K_x=[BX]/([B][X])$：底物 $X$ 与已经处于 B 态亚基的本征结合常数。',
                '$K_s=K_tK_x$：复合本征项，表示 $A+X\\rightleftharpoons BX$ 的表观倾向；在无界面耦联的单亚基近似中，$K_t$ 与 $K_x$ 可通过乘积互相抵消。',
                '$K_{AA},K_{AB},K_{BB}$：界面相互作用常数，通常以 $AA$ 为基准设 $K_{AA}=1$，$K_{AB}$ 与 $K_{BB}$ 分别表示 AB 与 BB 界面对状态权重的相对稳定贡献。'
            ],
            dimerPartitionFunction: [
                '对称二聚体基态 $A-A$ 权重为 $1$。',
                '结合 1 个底物时有 $B(X)-A$ 或 $A-B(X)$ 两种等价排列，权重为 $2K_sK_{AB}[X]$。',
                '结合 2 个底物时为 $B(X)-B(X)$，权重为 $K_s^2K_{BB}[X]^2$。',
                '二聚体配分函数：$Z=1+2K_sK_{AB}[X]+K_s^2K_{BB}[X]^2$。',
                '二聚体饱和度：$Y=\\frac{K_sK_{AB}[X]+K_s^2K_{BB}[X]^2}{1+2K_sK_{AB}[X]+K_s^2K_{BB}[X]^2}$。'
            ],
            topologyRules: [
                'KNF 配分函数依赖亚基接触拓扑；不能只按组合数 $C_n^m$ 合并所有结合 $m$ 个底物的状态。',
                '线型三聚体中，结合 1 个底物若在端点与中间位置，会产生不同数量的 $AB$ 界面和剩余 $AA$ 界面，必须拆项。',
                '正方形四聚体中，结合 1 个底物产生 2 个 $AB$ 界面；结合 2 个底物时邻位 cis 状态包含 1 个 $BB$、2 个 $AB$、1 个 $AA$，对位 trans 状态包含 4 个 $AB$ 且无 $BB$，必须分开计权。',
                '正四面体四聚体中，每个亚基与其他 3 个亚基接触；结合 1 个底物产生 3 个 $AB$ 界面，结合 2 个底物的任意组合拓扑等价，通常包含 1 个 $BB$、4 个 $AB$、1 个 $AA$。'
            ],
            cooperativityCriteria: [
                '$K_{BB}>K_{AB}^2$ 通常支持正协同：形成 BB 界面的稳定性超过两个 AB 界面带来的分散贡献。',
                '$K_{BB}<K_{AB}^2$ 通常支持负协同：第一个底物诱导的界面改变使后续结合更不利。',
                'KNF 可解释 $n_H<1$ 的负协同；经典 MWC 在高亲和 R 态假设下不能产生负协同。',
                '拥有 $n$ 个结合位点的体系，表观 Hill 系数不应超过物理位点数 $n$；强协同极限只能趋近 $n$。'
            ],
            mwcContrast: [
                'MWC 是构象选择：无配体时已有 T/R 平衡；KNF 是诱导契合：无底物时严格没有游离 B/R 高亲和构象。',
                'MWC 禁止稳定杂合态；KNF 允许杂合态并把杂合界面能作为协同来源。',
                'MWC 配分函数主要由全局 T/R 两族状态加权；KNF 配分函数必须按具体亚基拓扑和界面类型逐项枚举。',
                'MWC 经典形式偏向解释正协同；KNF 可同时解释正协同和负协同。'
            ]
        },
        forbiddenErrors: [
            '【无底物活性态误判】严格 KNF 中无底物时不存在游离 B/R 高亲和亚基；若题目引入天然 T/R 平衡，应改用 MWC 或混合模型。',
            '【否认杂合态】KNF 允许同一寡聚体内同时存在 A 态和 B 态亚基，不能要求结合两个底物时只能全 A 或全 B。',
            '【拓扑组合数滥用】KNF 不能只按 $C_n^m$ 合并状态；只要不同结合图样对应不同 $AA/AB/BB$ 界面数，就必须拆成不同配分函数项。',
            '【正方形/四面体混淆】正方形四聚体的邻位与对位双结合状态界面数不同；正四面体四聚体的双结合状态通常拓扑等价，二者不可混用。',
            '【Kt/Kx混同】$K_t$ 是构象转变常数，$K_x$ 是纯 B 态本征结合常数；只有在特定推导中才以 $K_s=K_tK_x$ 合并，不得把二者物理意义等同。',
            '【负协同排除错误】出现 $n_H<1$ 或曲线钝化时，不得因“别构酶必须 S 型”而排除 KNF；应检查 $K_{BB}<K_{AB}^2$。',
            '【Hill系数越界】$n$ 位点体系的表观 Hill 系数不能超过 $n$；四聚体不能给出 $n_H=4.5$ 之类物理越界结论。'
        ],
        parameterConstraints: {
            knf_no_ligand_b_state: '严格 KNF 中 $[X]=0$ 时 B 态占有率为 0；不得使用 MWC 的 $L=[T_0]/[R_0]$ 表示无配体构象平衡。',
            knf_Ks_definition: '$K_s=K_tK_x$ 仅表示诱导构象转变与本征结合的复合倾向；突变若使 $K_t$ 与 $K_x$ 反向等比例变化，单亚基表观结合项可不变。',
            knf_interface_baseline: '界面常数通常以 $K_{AA}=1$ 为基准；题目必须说明 $K_{AB},K_{BB}$ 是稳定性权重还是解离惩罚，避免正负方向反转。',
            knf_dimer_formula: '对称二聚体标准式为 $Z=1+2K_sK_{AB}[X]+K_s^2K_{BB}[X]^2$，$Y=\\frac{K_sK_{AB}[X]+K_s^2K_{BB}[X]^2}{Z}$。',
            knf_topology_dependency: '四聚体或更高寡聚体的 KNF 配分函数必须给出亚基接触图；没有拓扑信息时不得唯一写出界面加权配分函数。',
            knf_negative_cooperativity: '负协同判据应绑定界面权重关系，例如 $K_{BB}<K_{AB}^2$；不能用 MWC 正协同模板解释 $n_H<1$。',
            knf_hill_upper_bound: '拥有 $n$ 个位点的 KNF 体系，表观 Hill 系数物理上不应超过 $n$。'
        },
        generationChainSuggestions: [
            '先判定模型边界：若无底物时已有 T/R 构象平衡，用 MWC；若底物结合后逐亚基诱导构象改变且允许杂合态，用 KNF。',
            '出 KNF 推导题时，先给出亚基接触拓扑图或文字等价描述，再要求枚举每个结合数下的界面类型和简并度。',
            '二聚体题可从 $Z=1+2K_sK_{AB}[X]+K_s^2K_{BB}[X]^2$ 推导 $Y$，再用 $K_{BB}$ 与 $K_{AB}^2$ 比较判断正/负协同。',
            '四聚体题优先设置正方形 vs 正四面体拓扑对比，要求拆分邻位/对位状态，防止直接用 $C_4^2=6$ 合并。',
            '线型三聚体题优先设置端点结合与中间结合的界面数差异，考察空间不对称导致的配分函数项拆分。',
            '常数解耦题可设置 $K_x$ 提高而 $K_t$ 降低的反向突变，要求先看 $K_s=K_tK_x$ 是否改变，再讨论界面常数是否改变。',
            '曲线判别题中给出 $n_H<1$ 或比双曲线更平缓的负协同数据，要求排除经典 MWC 并转向 KNF 界面相互作用解释。'
        ],
        diversityScaffolding: {
            objectVariants: ['对称二聚体别构酶', '线型三聚体', '正方形四聚体', '正四面体四聚体', '环型寡聚体', '负协同脱氢酶'],
            measurementTools: ['底物结合曲线', '酶速率曲线', 'Hill图', '突变体动力学', '单分子构象读数', '结构接触图'],
            dataModalities: ['界面拓扑图', '配分函数项表', 'Hill斜率曲线', '邻位/对位结合权重表', 'Kt/Kx突变矩阵', '正负协同判定表'],
            perturbationTypes: ['改变 $K_t$', '改变 $K_x$', '改变 $K_{AB}$', '改变 $K_{BB}$', '改变亚基拓扑', '破坏邻接界面'],
            questionStyles: ['模型判别', '配分函数枚举', '拓扑拆项', '负协同判定', 'Hill上界审计', 'MWC/KNF反证'],
            antiRepeatRule: '重复 KNF 题时必须更换寡聚体拓扑、界面常数关系和读出形式；不得总是二聚体标准公式直代。',
            scaffoldingTransitionRule: 'KNF 与 MWC 同题比较时必须先明确无配体构象平衡、是否允许杂合态、是否需要亚基接触拓扑三项边界，再决定使用哪套配分函数。'
        },
        antiPatternStrategies: [
            '【MWC惯性陷阱】题干声明诱导契合和杂合态，却给出类似 $L=[T_0]/[R_0]$ 的天然构象平衡诱饵，要求指出模型混用。',
            '【杂合态承认陷阱】给四聚体结合两个底物，要求判断 $A_2B_2$ 是否允许存在，防止套用全或无模型。',
            '【拓扑拆项陷阱】给正方形四聚体双结合状态，要求分别写邻位与对位权重，防止用 $C_4^2$ 一项合并。',
            '【线型端点陷阱】给线型三聚体单结合状态，要求区分端点结合和中间结合导致的界面数差异。',
            '【Kt/Kx抵消陷阱】设置 $K_x$ 与 $K_t$ 反向等比例改变，要求先计算 $K_s$ 是否不变，再判断表观曲线是否改变。',
            '【负协同反模板】给 $n_H<1$ 或钝化曲线，要求排除经典 MWC 并用 $K_{BB}<K_{AB}^2$ 解释。',
            '【Hill越界审计】给 $n$ 位点体系却声称 $n_H>n$，要求指出物理上界错误。'
        ]
    },

    'tight-binding-kinetics': {
        name: '紧密结合动力学',
        hierarchy: {
            discipline: 'biochemistry',
            module: 'enzyme-kinetics',
            path: ['生物化学与分子生物物理学', '酶动力学', '紧密结合动力学']
        },
        parentDiscipline: 'biochemistry',
        parentModule: 'enzyme-kinetics',
        topicType: 'specialized-model',
        keywords: [
            '紧密结合动力学', 'Tight-Binding Kinetics', 'Morrison方程', 'Henderson方程',
            '滴定效应', 'Titration Effect', '强效抑制剂', '高亲和力抑制剂',
            'IC50', 'Ki', 'Kiapp', '活性位点滴定', 'Active Site Titration',
            '抑制剂耗竭', '游离抑制剂', '总抑制剂', '酶总量守恒', '抑制剂总量守恒'
        ],
        reasoningType: 'conservation' as ReasoningType,
        // 精准化：总量守恒与游离抑制剂枯竭
        reasoningNote: '总量守恒与滴定效应约束：紧密结合动力学处理 $K_i$ 极低且 $[E]_t$ 与 $[I]_t$ 同量级的强效抑制剂体系。经典抑制模型默认 $[I]_{free}\\approx[I]_t$，但紧密结合体系中酶会显著消耗抑制剂，使 $[I]_{free}\\ne[I]_t$，导致普通 $IC_{50}$、竞争性抑制和 Lineweaver-Burk 变形失效。核心推理必须从酶总量守恒 $[E]_t=[E]_{free}+[EI]$ 与抑制剂总量守恒 $[I]_t=[I]_{free}+[EI]$ 出发，使用 Morrison 方程拟合速率-抑制剂曲线，并可用 Henderson 线性化图读出 $K_i^{app}$ 与活性酶浓度 $[E]_t$。',
        levels: {
            basic: '识别紧密结合抑制、滴定效应、游离抑制剂浓度与总抑制剂浓度不相等的基本概念；知道当 $[E]_t$ 与 $[I]_t$ 同量级或 $IC_{50}\\le[E]_t$ 时，普通抑制公式会失效。',
            intermediate: '掌握质量守恒 $[E]_t=[E]_{free}+[EI]$、$[I]_t=[I]_{free}+[EI]$，以及 $K_i^{app}=([E]_t-[EI])([I]_t-[EI])/[EI]$；能用 Morrison 方程计算 $v/v_0$。',
            advanced: '能区分 Morrison 方程的非线性闭式解与 Henderson 方程的线性化作图；理解 Henderson 图横轴是 $v_0/v$、纵轴是 $[I]_t/(1-v/v_0)$，斜率为 $K_i^{app}$，截距为活性酶浓度 $[E]_t$。',
            competition: '① 总量/游离量陷阱：不能把 $[I]_t$ 直接当 $[I]_{free}$。② $IC_{50}$ 低估陷阱：紧密结合半抑制关系近似为 $IC_{50}=K_i^{app}+[E]_t/2$，忽略酶滴定会严重低估药物亲和力。③ 底物修饰陷阱：竞争性抑制下 Morrison 拟合得到的是 $K_i^{app}=K_i(1+[S]/K_m)$，不是直接的真实 $K_i$。④ Henderson 坐标陷阱：不能把 Henderson 图错画成 $1/[I]_t$ 对 $1/v$ 的普通双倒数图。⑤ 活性位点滴定陷阱：Henderson 截距对应活性酶浓度而非名义加样浓度，可揭示蛋白部分失活。'
        },
        peakDifficulty: '在高亲和力抑制剂、底物竞争、酶部分失活和信号阈值共同存在时，同时利用 Morrison 非线性拟合、Henderson 线性化和底物修饰项从 $IC_{50}$、$v/v_0$、$[E]_t$、$[I]_t$ 中反推出真实 $K_i$ 与活性酶浓度，并判断普通米氏抑制公式何时完全失效。',
        formulaCoverage: {
            modelAssumptions: [
                '紧密结合动力学适用于 $K_i$ 极低、$[E]_t$ 与 $[I]_t$ 同量级、抑制剂被酶显著滴定消耗的体系。',
                '经典抑制公式的隐含前提是 $[I]\\gg[E]$，因此 $[I]_{free}\\approx[I]_t$；紧密结合体系必须放弃该近似。',
                '速率比通常由游离活性酶比例给出：$v/v_0=[E]_{free}/[E]_t=1-[EI]/[E]_t$。'
            ],
            conservationEquations: [
                '酶总量守恒：$[E]_t=[E]_{free}+[EI]$。',
                '抑制剂总量守恒：$[I]_t=[I]_{free}+[EI]$。',
                '表观解离常数：$K_i^{app}=\\frac{[E]_{free}[I]_{free}}{[EI]}=\\frac{([E]_t-[EI])([I]_t-[EI])}{[EI]}$。'
            ],
            morrisonEquation: [
                '关于 $[EI]$ 的二次方程：$[EI]^2-([E]_t+[I]_t+K_i^{app})[EI]+[E]_t[I]_t=0$。',
                '有物理意义的复合物解：$[EI]=\\frac{([E]_t+[I]_t+K_i^{app})-\\sqrt{([E]_t+[I]_t+K_i^{app})^2-4[E]_t[I]_t}}{2}$。',
                'Morrison 速率方程：$v=v_0\\left(1-\\frac{([E]_t+[I]_t+K_i^{app})-\\sqrt{([E]_t+[I]_t+K_i^{app})^2-4[E]_t[I]_t}}{2[E]_t}\\right)$。'
            ],
            hendersonEquation: [
                'Henderson 线性化：$\\frac{[I]_t}{1-v/v_0}=[E]_t+K_i^{app}\\left(\\frac{v_0}{v}\\right)$。',
                '作图坐标：横轴 $X=v_0/v$，纵轴 $Y=[I]_t/(1-v/v_0)$。',
                'Henderson 图斜率为 $K_i^{app}$，纵轴截距为活性酶总浓度 $[E]_t$。'
            ],
            substrateCorrection: [
                '竞争性紧密结合抑制：$K_i^{app}=K_i(1+[S]/K_m)$。',
                '若 $[S]=5K_m$，则 $K_i^{app}=6K_i$；必须除以底物修饰项才能得到真实热力学 $K_i$。',
                '不同抑制机制的 $K_i^{app}$ 修饰项不同，题目必须声明抑制机制，不能把 Morrison 拟合参数直接当真实 $K_i$。'
            ],
            ic50Relation: [
                '紧密结合半抑制近似关系：$IC_{50}=K_i^{app}+[E]_t/2$。',
                '若 $IC_{50}$ 与 $[E]_t$ 同量级，普通 $IC_{50}\\approx K_i^{app}$ 或 Cheng-Prusoff 式直接套用会系统性低估药物亲和力。'
            ]
        },
        forbiddenErrors: [
            '【游离/总量混淆】紧密结合体系中不得用 $[I]_t$ 直接替代 $[I]_{free}$。',
            '【经典IC50硬套】当 $IC_{50}$ 与 $[E]_t$ 同量级或 $IC_{50}\\le[E]_t$ 时，不得继续使用普通 $IC_{50}$ 公式估计 $K_i$。',
            '【Morrison参数误读】Morrison 拟合得到的是 $K_i^{app}$；若存在底物竞争，必须用对应修饰项还原真实 $K_i$。',
            '【Henderson坐标画错】Henderson 图不是 Lineweaver-Burk 图，横轴不是 $1/[I]_t$，纵轴不是 $1/v$。',
            '【活性酶浓度忽略】Henderson 截距反映活性酶浓度 $[E]_t$，不能简单等同于名义配制酶浓度。',
            '【判据缺失】题目若涉及 nM/pM 级抑制剂却不给 $[E]_t$ 或 $[I]_t$，通常无法判断是否存在紧密结合滴定效应。'
        ],
        parameterConstraints: {
            tight_binding_regime: '若 $K_i$、$IC_{50}$、$[E]_t$ 或 $[I]_t$ 处于同一数量级，必须检查紧密结合条件；不得默认 $[I]_{free}\\approx[I]_t$。',
            mass_conservation_required: '紧密结合推导必须同时满足酶总量与抑制剂总量守恒，不能只写平衡常数而忽略 $[EI]$ 对总量的扣除。',
            morrison_root_choice: 'Morrison 二次方程必须选择使 $0\\le[EI]\\le\\min([E]_t,[I]_t)$ 的物理根。',
            competitive_app_ki: '竞争性抑制下 $K_i^{app}=K_i(1+[S]/K_m)$；若题目给高底物浓度，必须还原真实 $K_i$。',
            henderson_axes: 'Henderson 图坐标固定为 $X=v_0/v$、$Y=[I]_t/(1-v/v_0)$；斜率为 $K_i^{app}$，截距为活性 $[E]_t$。',
            active_enzyme_vs_nominal: '紧密结合分析中 $[E]_t$ 应指活性酶浓度；若蛋白部分失活，名义总蛋白浓度不可直接代入。'
        },
        generationChainSuggestions: [
            '先比较 $[E]_t$、$[I]_t$、$IC_{50}$ 和预期 $K_i$ 的数量级；若同量级，强制切换到紧密结合动力学。',
            '题干给强效抑制剂时，要求先写酶总量和抑制剂总量守恒，再由 $K_i^{app}$ 推出 Morrison 二次方程。',
            '设计 $IC_{50}$ 陷阱时，让 $IC_{50}$ 接近 $[E]_t/2$，要求用 $IC_{50}=K_i^{app}+[E]_t/2$ 反推真实亲和力。',
            '设计 Henderson 图题时，给出多组 $v/v_0$ 与 $[I]_t$ 数据，要求构造 $Y=[I]_t/(1-v/v_0)$ 对 $X=v_0/v$ 的图并解释斜率和截距。',
            '涉及竞争性抑制时，加入 $[S]/K_m$ 修饰项，要求区分 $K_i^{app}$ 与真实 $K_i$。',
            '设置蛋白部分失活情境，要求用 Henderson 截距判断活性酶浓度，而不是直接相信名义加样浓度。'
        ],
        diversityScaffolding: {
            objectVariants: ['高亲和力小分子抑制剂', '抗体药物', '共价前体抑制剂', 'nM级酶活测定', '活性位点滴定实验', '部分失活酶制剂'],
            measurementTools: ['初速测定', 'IC50曲线', 'Morrison非线性拟合', 'Henderson图', '荧光底物读数', '活性位点滴定'],
            dataModalities: ['v/v0-抑制剂浓度曲线', 'Henderson线性图', 'IC50表', '底物浓度修饰表', '活性酶截距图', '总量守恒方程组'],
            perturbationTypes: ['改变酶浓度', '改变底物浓度', '改变抑制剂亲和力', '蛋白部分失活', '提高检测信号所需酶量', '竞争性抑制机制切换'],
            questionStyles: ['模型适用性判别', 'Morrison方程推导', 'IC50纠偏', 'Henderson作图解释', 'Kiapp还原Ki', '活性酶浓度反演'],
            antiRepeatRule: '重复紧密结合动力学题时必须更换抑制剂类型、数据形式和错误来源；不得总是用同一个 IC50 纠偏模板。',
            scaffoldingTransitionRule: '紧密结合动力学、经典抑制动力学和米氏动力学必须通过“游离浓度是否近似等于总浓度”这一条件切换，禁止在同一题中无条件混用。'
        },
        antiPatternStrategies: [
            '【总量陷阱】给 $[E]_t$ 与 $[I]_t$ 同量级，却诱导直接把 $[I]_t$ 当 $[I]_{free}$ 套普通竞争性抑制公式。',
            '【IC50低估陷阱】给 $IC_{50}\\le[E]_t$，要求指出普通拟合会低估亲和力并用 Morrison 半抑制关系修正。',
            '【Henderson坐标陷阱】给线性化要求但混入 Lineweaver-Burk 坐标选项，要求识别正确横纵轴。',
            '【底物稀释陷阱】给 $[S]\gg K_m$，要求把 $K_i^{app}$ 除以 $1+[S]/K_m$ 得到真实 $K_i$。',
            '【活性位点滴定陷阱】给名义酶浓度与 Henderson 截距不一致，要求判断酶部分失活或活性位点浓度低于总蛋白浓度。',
            '【物理根选择陷阱】给 Morrison 二次方程两个根，要求选择满足 $[EI]\le\min([E]_t,[I]_t)$ 的物理根。'
        ]
    },

    'cleland-multisubstrate-kinetics': {
        name: 'Cleland 多底物酶动力学',
        hierarchy: {
            discipline: 'biochemistry',
            module: 'enzyme-kinetics',
            path: ['生物化学与分子生物物理学', '酶动力学', 'Cleland 多底物酶动力学']
        },
        parentDiscipline: 'biochemistry',
        parentModule: 'enzyme-kinetics',
        topicType: 'specialized-model',
        keywords: [
            'Cleland表示法', 'Cleland notation', 'Cleland图', 'Cleland机制图', 'Cleland规则',
            '多底物酶动力学', '多底物反应', '双底物反应', 'multi-substrate kinetics', 'bisubstrate kinetics',
            'Bi-Bi反应', 'Bi Bi reaction', 'Ordered Bi-Bi', '有序Bi-Bi', '强制顺序机制', '有序序贯机制', 'leading substrate',
            'Random Bi-Bi', '随机Bi-Bi', '随机序贯机制', 'Ping-Pong Bi-Bi', '乒乓Bi-Bi', '乒乓机制', '双置换机制', 'double displacement',
            'Theorell-Chance', 'Theorell-Chance机制', '快速平衡有序机制', '三元复合物', 'ternary complex', '修饰酶F', 'substituted enzyme form',
            'Lineweaver-Burk', '双倒数图', '相交线', '平行线', '产物抑制', '产物抑制矩阵', 'product inhibition', 'product inhibition matrix',
            '竞争性抑制', '非竞争性抑制', '混合型抑制', '死端抑制', 'dead-end inhibition', '死端复合物', 'dead-end complex', '底物抑制', 'substrate inhibition'
        ],
        reasoningType: 'topology' as ReasoningType,
        reasoningNote: '酶状态拓扑与抑制矩阵诊断逻辑：Cleland 多底物动力学题必须先把文字或示意图转换为酶形式网络，锁定 $E,EA,EAB,EPQ,EQ,F$ 等节点、底物进入顺序和产物释放顺序，再判断是否存在可积累的生产性三元复合物。Ordered/Random/Theorell-Chance 等序贯机制通常允许三元复合物路径，固定一个底物并改变另一个底物时 Lineweaver-Burk 线族表现为相交线；Ping-Pong Bi-Bi 则先释放第一个产物并形成修饰酶 $F$，第二底物结合 $F$，理想初速双倒数线族表现为平行线。相交线只能完成“序贯类”初筛，不能直接区分 Ordered、Random 与 Theorell-Chance；最终机制判别必须结合产物抑制矩阵，按“加入产物是否与变动底物竞争同一酶形式”判断 C/NC。若题干出现高底物浓度、底物抑制、死端类似物或直线弯曲，还必须检查 $EB$、$FA$ 等 dead-end complex 是否破坏理想 Cleland 拓扑。',
        levels: {
            basic: '识别 Cleland 表示法中水平线、上方底物结合箭头、下方产物释放箭头的含义；掌握 A/B/P/Q 的顺序约定，能区分 Ordered Bi-Bi 中 $E\to EA\to EAB$ 的强制顺序路径与 Ping-Pong Bi-Bi 中 $E\to F\to E$ 的修饰酶循环。',
            intermediate: '能根据初速双倒数图判断序贯机制的相交线与 Ping-Pong 机制的平行线；理解 Ordered Bi-Bi 方程中斜率和纵截距均随固定底物浓度改变，而 Ping-Pong 方程中斜率项在理想条件下不随另一底物浓度改变。',
            advanced: '能构建产物抑制矩阵，按变动底物、固定底物和加入产物三项条件判断竞争性、非竞争性或混合型抑制；能用该矩阵区分 Ordered Bi-Bi、Random Bi-Bi、Theorell-Chance 与 Ping-Pong Bi-Bi。',
            competition: '① 相交线过度诊断陷阱：相交线不能直接证明 Ordered Bi-Bi。② Theorell-Chance 极限陷阱：三元复合物极短寿命导致某些产物抑制模式不同于普通 Ordered。③ Random Bi-Bi 饱和条件陷阱：另一底物饱和时表观抑制类型可能改变。④ Dead-End 畸变陷阱：高底物浓度形成 $EB$ 或 $FA$ 后，理想平行/相交线可上弯或失去典型几何特征。'
        },
        peakDifficulty: '在同一双底物酶体系中，同时利用 Cleland 状态网络、Lineweaver-Burk 线族几何、P/Q 产物抑制矩阵、Theorell-Chance 痕量底物条件以及 dead-end substrate inhibition 曲线畸变，反推出真实 Ordered、Random、Ping-Pong 或极限有序机制，并判断单一图像证据是否存在过度诊断。',
        formulaCoverage: {
            clelandNotation: [
                'Cleland 表示法用水平线表示酶在反应循环中的连续形式；上方箭头表示底物结合，下方箭头表示产物释放，箭头所在位置决定对应的酶形式。',
                '双底物双产物体系通常记为 Bi-Bi；底物常按进入顺序记为 A、B，产物按释放顺序或题干约定记为 P、Q，不能凭字母顺序反推机制。',
                '图中 $E$ 表示游离酶，$EA$、$EAB$、$EPQ$、$EQ$ 表示酶-底物或酶-产物复合物；$F$ 表示 Ping-Pong 机制中经过第一半反应后形成的稳定修饰酶形式。',
                'Cleland 图首先是拓扑图而非浓度曲线；解题时应先标注每个底物或产物竞争的酶形式，再谈抑制类型或双倒数图斜率。',
                '箭头上下位置不能省略：上方底物注入箭头决定结合步骤，下方产物释放箭头决定反向产物抑制时可竞争的酶形式。',
                'Cleland 记法不是化学计量式；同一 $A+B\to P+Q$ 总反应可对应 Ordered、Random、Theorell-Chance 或 Ping-Pong 等不同酶状态拓扑。'
            ],
            orderedBiBiNetwork: [
                'Ordered Bi-Bi 是强制顺序机制，A 必须先与游离酶 $E$ 结合形成 $EA$，B 只能在 $EA$ 上结合形成 $EAB$；A 因此是 leading substrate。',
                '典型网络为 $E\\to EA\\to EAB\\rightleftharpoons EPQ\\to EQ\\to E$；该路径包含生产性三元复合物或等价的三元过渡复合物。',
                '在用户给定约定下，P 先释放形成 $EQ$，Q 后释放使酶回到 $E$；产物释放顺序会直接决定产物抑制矩阵，不能与底物进入顺序混同。',
                '理想 Ordered 中 B 不应直接结合游离 $E$；若高浓度 B 或 B 类似物强行结合 $E$ 形成 $EB$，该支路属于 dead-end 而非正常 Ordered 路径。',
                'Ordered Bi-Bi 的核心证据不是“有两个底物”，而是底物和产物都有不可交换的进入/离开顺序，并能由产物抑制或 dead-end 抑制支持。',
                '当题目只给出相交双倒数线而不给产物抑制矩阵时，只能判为序贯类机制，不能把 Ordered 作为唯一结论。'
            ],
            pingPongBiBiNetwork: [
                'Ping-Pong Bi-Bi 又称双置换机制，第一底物 A 与 $E$ 反应后先释放 P，并把酶转化为稳定修饰态 $F$。',
                '典型网络为 $E\\to EA\\rightleftharpoons FP\\to F\\to FB\\rightleftharpoons EQ\\to E$；B 结合的是修饰酶 $F$ 而不是游离酶 $E$。',
                'Ping-Pong 的核心拓扑特征是无稳定生产性 $EAB$ 三元复合物；若题干要求 A 与 B 同时占据同一生产性三元复合物，应转向序贯机制。',
                'P 通常对应第一半反应并与 A 竞争 $E$，Q 通常对应第二半反应并与 B 竞争 $F$；但必须以题干给出的 P/Q 释放约定为准。',
                '转氨酶、某些酰基转移酶和形成共价酶中间体的双置换反应常表现为 Ping-Pong，但不能仅凭酶类别判断，仍需初速图和产物抑制证据。',
                'Ping-Pong 的平行线来自半反应分离和修饰酶循环；若出现可积累 $EAB$ 或随机结合三元复合物，则与 Ping-Pong 拓扑矛盾。'
            ],
            randomBiBiNetwork: [
                'Random Bi-Bi 中 A 和 B 均可先结合游离酶 $E$，可形成 $EA$ 或 $EB$，随后另一个底物加入形成生产性三元复合物 $EAB$。',
                'Random 的核心含义是底物结合顺序随机或可交换，不是产物释放顺序完全无约束，也不是不存在三元复合物。',
                '快速平衡 Random Bi-Bi 常给出相交 Lineweaver-Burk 线族，因此会与 Ordered 和 Theorell-Chance 在初速图上混淆。',
                'Random Bi-Bi 的产物抑制矩阵通常更对称，但当固定底物处于饱和条件时，某些竞争性抑制可表现为非竞争或混合型。',
                '题干若给出 A 或 B 均可与游离 $E$ 形成有效二元复合物，并能被另一底物推进到 $EAB$，应优先考虑 Random 而不是 Ordered。'
            ],
            theorellChanceLimit: [
                'Theorell-Chance 机制可视为 Ordered Bi-Bi 的极限形式：结合和释放顺序保持有序，但三元复合物寿命极短，宏观上几乎不积累。',
                'Theorell-Chance 与普通 Ordered Bi-Bi 均可表现为相交初速线，因此初速图本身不能完成二者区分。',
                '关键鉴别点是 B 为变动底物且 A 处于痕量或非饱和条件时，先释放产物 P 可对 B 表现为竞争性抑制。',
                '若题干强调“无可检测三元复合物”“碰撞后立即释放”或“chance complex”，不能把它机械归入普通 Ordered。',
                'Theorell-Chance 陷阱通常把 A 变动条件设置得像 Ordered，把 B 变动且 A 痕量条件隐藏在实验描述中，要求逐行读取变量条件。'
            ],
            lineweaverBurkDiagnostics: [
                '序贯 Bi-Bi 初速方程在双倒数形式中通常同时含有 $1/[A]$ 与 $1/([A][B])$ 交叉项，因此固定 B 改变 A 时，斜率和纵截距都会随 $[B]$ 改变，线族表现为相交线。',
                'Ordered Bi-Bi 以 $1/[A]$ 为横坐标时，可抽象为 $1/v=m([B])\\cdot 1/[A]+b([B])$，其中 $m([B])$ 与 $b([B])$ 均依赖 $[B]$；这解释了相交线而不是平行线。',
                'Ping-Pong Bi-Bi 理想双倒数式可抽象为 $1/v=(K_m^A/V_{max})\\cdot1/[A]+(1/V_{max})(1+K_m^B/[B])$；斜率不随 $[B]$ 改变，只有纵截距平移，线族表现为平行线。',
                '相交线只能区分“序贯类”与 Ping-Pong 初筛，不能在 Ordered、Random 和 Theorell-Chance 之间给出终局诊断；终局诊断必须加入产物抑制或 dead-end 抑制证据。',
                'Lineweaver-Burk 图会放大小底物浓度误差；若高底物浓度出现底物抑制或死端复合物，理想直线族可能弯曲，不能机械套用平行/相交模板。',
                '判断斜率是否随固定底物浓度改变时，必须先确认横轴是哪一个底物的倒数；交换横轴底物后，直线族解释也要同步重写。'
            ],
            diagnosticBoundary: [
                '双倒数图能做的是初筛：相交线提示序贯类机制或三元复合物参与，平行线提示 Ping-Pong 或双置换机制。',
                '双倒数图不能单独区分 Ordered、Random 和 Theorell-Chance，因为三者都可产生相交线族。',
                '产物抑制矩阵能进一步区分具体机制，但每一格都依赖变动底物、固定底物浓度、加入产物和允许形成的酶形式。',
                'Dead-end 抑制和底物抑制用于检验正常路径之外的错误结合支路，常用于确认底物进入顺序或解释高浓度曲线畸变。',
                '若初速图、产物抑制和 dead-end 抑制给出互相矛盾的结论，应优先检查是否存在饱和条件、逆反应、产物积累、底物耗竭或非特异性失活。'
            ],
            productInhibitionMatrix: [
                '产物抑制判别规则：若加入产物与变动底物竞争同一种酶形式，表现为竞争性抑制 C；若结合在不同酶形式上，通常表现为非竞争性或混合型抑制 NC。',
                'Ordered Bi-Bi：A 变动且 B 恒定时，P 对 A 为 NC，Q 对 A 为 C，因为 A 与末端产物 Q 均可竞争游离 $E$；B 变动且 A 恒定时，P 与 Q 对 B 通常均为 NC。',
                'Theorell-Chance：A 变动且 B 恒定时通常保持 P 为 NC、Q 为 C；但 B 变动且 A 处于痕量或非饱和条件时，P 可对 B 表现为 C，这是区别普通 Ordered 的关键证据。',
                'Random Bi-Bi：快速平衡随机机制中，A 或 B 作为变动底物时，产物抑制常更对称地表现为 C；但若另一底物饱和，某些表观竞争性可转为 NC，必须读取题干浓度条件。',
                'Ping-Pong Bi-Bi：A 变动且 B 恒定时，P 对 A 为 C、Q 对 A 为 NC；B 变动且 A 恒定时，P 对 B 为 NC、Q 对 B 为 C，因为 A/P 竞争 $E$，B/Q 竞争 $F$。',
                '矩阵题必须逐格写出“谁与谁竞争哪个酶形式”，例如 A 与 Q 竞争 $E$、B 与 Q 竞争 $F$；只背 C/NC 表格容易在 P/Q 对调或变量对调时失效。'
            ],
            mechanismDecisionWorkflow: [
                '第一步：从 Cleland 图或文字描述中列出正常生产路径，判断是否有 $EAB$ 三元复合物或修饰酶 $F$。',
                '第二步：读取初速 Lineweaver-Burk 线族，平行线优先考虑 Ping-Pong，相交线只归入 Ordered/Random/Theorell-Chance 序贯类候选。',
                '第三步：读取产物抑制矩阵，按变动底物和加入产物逐格映射竞争酶形式，区分 Ordered、Random、Theorell-Chance 和 Ping-Pong。',
                '第四步：检查固定底物是否饱和、痕量或非饱和；Random 的饱和条件和 Theorell-Chance 的 A 痕量条件会改变诊断结论。',
                '第五步：若高底物浓度曲线畸变或速率下降，加入 dead-end complex 分析，判断是否形成 $EB$、$FA$ 或其他错误酶形式。',
                '第六步：输出结论时必须给出证据层级，区分“初速图提示”“产物抑制支持”“dead-end 证实”和“仍需补充实验”。'
            ],
            deadEndAndSubstrateInhibition: [
                'Dead-end complex 是底物、产物或类似物结合到错误酶形式后形成的无生产力复合物；它能提供底物进入顺序证据，也能让初速图偏离理想直线。',
                'Ordered Bi-Bi 中 B 理想情况下只能结合 $EA$；若高浓度 B 直接结合游离 $E$ 形成 $EB$，会造成 B 的底物抑制，并使双倒数线在高 B 条件下向上弯曲。',
                'Ping-Pong 中 A 理想情况下结合 $E$，B 结合 $F$；若高浓度 A 错误结合 $F$ 形成 $FA$，会造成 A 的底物抑制，并破坏理想平行 Lineweaver-Burk 线族。',
                '底物抑制不能自动等同酶不可逆失活或产物抑制；必须指出过量底物竞争的错误酶形式、死端复合物名称以及该支路为何不能进入生产性循环。',
                'Dead-end analog 题中，类似物若只结合 $E$，通常用于判断第一个进入底物；若只结合 $EA$ 或 $F$，则用于定位后续底物或 Ping-Pong 第二半反应。'
            ],
            knowledgePointTags: [
                'Cleland 记法｜箭头含义｜图示解读',
                '酶状态识别｜$E/EA/EAB/F$｜机制拓扑',
                'Ordered Bi-Bi｜leading substrate｜强制顺序结合',
                'Ordered Bi-Bi｜P/Q 释放顺序｜产物抑制来源',
                'Ping-Pong Bi-Bi｜修饰酶 $F$｜无生产性三元复合物',
                'Lineweaver-Burk｜相交线｜序贯机制初筛',
                'Lineweaver-Burk｜平行线｜Ping-Pong 初筛',
                '产物抑制｜C/NC｜同一酶形式竞争规则',
                'Theorell-Chance｜B 变动且 A 痕量｜P 对 B 竞争性',
                'Random Bi-Bi｜快速平衡｜饱和条件改变表观抑制',
                'Dead-End Complex｜$EB/FA$｜底物抑制与图像畸变'
            ],
            highFrequencyTrapTable: [
                '图像误判：相交线直接判 Ordered；正确策略是只判序贯类，再查产物抑制矩阵。',
                '图像误判：平行线高浓度畸变后直接否定 Ping-Pong；正确策略是检查 $FA$ 等 dead-end 支路。',
                '顺序混淆：把 B 当作可直接结合 $E$ 的正常底物；正确策略是 Ordered 中 B 正常结合 $EA$，结合 $E$ 属于异常死端。',
                '产物顺序混淆：把 P/Q 释放顺序倒置；正确策略是按 Cleland 图下方箭头定位产物释放，而不是按字母或底物顺序。',
                '抑制类型混淆：只按产物名称判断 C/NC；正确策略是看产物与变动底物是否竞争同一酶形式。',
                '条件忽略：忽略固定底物是否饱和、痕量或非饱和；正确策略是先读实验条件再套矩阵。',
                'Theorell-Chance 漏判：忽略 B 变动且 A 痕量时 P 的竞争性；正确策略是把它作为区别普通 Ordered 的关键证据。',
                '底物抑制误判：把高浓度底物导致的速率下降当作酶失活；正确策略是先检查 dead-end complex。'
            ],
            questionTrapDesigns: [
                '图像型陷阱：给相交双倒数线，选项放 Ordered、Random、Theorell-Chance、以上均可能，正确考点是相交线不足以唯一诊断 Ordered。',
                '平行线陷阱：给平行 Lineweaver-Burk 线族，诱导选序贯机制，正确考点是 Ping-Pong 或双置换机制初筛。',
                'P/Q 顺序陷阱：题干说明 P 先释放、Q 后释放，但选项把 Q 当先释放产物，正确考点是必须按图定位释放顺序。',
                'Theorell-Chance 陷阱：给相交线、B 变动、A 痕量、P 对 B 竞争性，正确答案倾向 Theorell-Chance。',
                'Random 饱和陷阱：题干给 Random Bi-Bi 且另一底物饱和，要求判断产物抑制是否一定竞争性，正确考点是可转为 NC 或混合型。',
                'Dead-End 陷阱：给 Ordered Bi-Bi 高 B 导致速率下降，正确考点是 B 错误结合 $E$ 形成 $EB$。',
                'Ping-Pong 畸变陷阱：先给 Ping-Pong 平行线，再给高 A 区域上弯，正确考点是 A 错误结合 $F$ 形成 $FA$。'
            ]
        },
        forbiddenErrors: [
            '【相交线过度诊断】Lineweaver-Burk 相交线只能说明序贯类机制或存在三元复合物倾向，不能单独证明 Ordered Bi-Bi；Random Bi-Bi 与 Theorell-Chance 也可给出相交线。',
            '【Ping-Pong三元复合物误判】Ping-Pong Bi-Bi 的定义特征是第一产物释放后形成修饰酶 $F$，不得同时引入稳定生产性 $EAB$ 三元复合物。',
            '【P/Q释放顺序倒置】P、Q 必须按题干或 Cleland 图中的释放位置定义；不得因为字母顺序或“先入先出”直觉颠倒释放顺序。',
            '【产物抑制脱离变量】未明确变动底物、固定底物浓度和加入的是 P 还是 Q 时，不得直接判定竞争性或非竞争性抑制。',
            '【Theorell-Chance等同Ordered】Theorell-Chance 是三元复合物极短寿命、不积累的有序极限，尤其在 B 变动且 A 痕量时可出现不同于普通 Ordered 的 P 竞争性抑制。',
            '【Random饱和条件漏读】Random Bi-Bi 的产物抑制类型受另一底物是否饱和影响；不得把“全部竞争性”当作无条件结论。',
            '【高浓度畸变漏判】高底物浓度形成 $EB$、$FA$ 等 dead-end complex 时，理想平行线或相交线可能弯曲；不得直接判为实验错误或完全否定原机制。',
            '【横轴底物误读】Lineweaver-Burk 图以 $1/[A]$ 还是 $1/[B]$ 为横轴会改变斜率项解释；不得在交换变动底物后沿用原斜率结论。',
            '【单证据终局判定】Cleland 机制诊断必须区分初速图、产物抑制、dead-end 抑制和底物抑制的证据层级；不得用单一实验现象推出完整机制。'
        ],
        parameterConstraints: {
            cleland_state_topology_required: '机制判定必须先列出可存在的酶形式，如 $E,EA,EAB,EPQ,EQ,F$；缺少酶形式竞争对象时不得写产物抑制矩阵。',
            ordered_bibi_leading_substrate: 'Ordered Bi-Bi 中 A 是 leading substrate，正常路径要求 $E\to EA\to EAB$；B 直接结合 $E$ 只能作为异常 dead-end 支路处理。',
            ping_pong_substituted_enzyme_required: 'Ping-Pong Bi-Bi 必须出现第一半反应后的修饰酶形式 $F$，且第二底物 B 结合 $F$；若全程只有 $EAB$ 三元复合物，应切换为序贯机制。',
            lb_intersecting_scope: '相交双倒数线族只能作为 Ordered/Random/Theorell-Chance 等序贯类机制的初筛证据，不能替代产物抑制矩阵。',
            lb_parallel_scope: '理想 Ping-Pong 的平行线要求无 dead-end substrate inhibition、无显著逆反应和无实验误差放大；高底物浓度畸变时必须重新检查额外支路。',
            product_inhibition_context_required: '每个 C/NC 判定必须绑定“变动底物 + 固定底物 + 加入产物 + 竞争酶形式”四要素。',
            theorell_chance_trace_substrate_condition: 'Theorell-Chance 的特殊 P 对 B 竞争性抑制应限定在 B 变动且 A 痕量或非饱和的诊断条件下。',
            dead_end_complex_enzyme_form_lock: 'Dead-end complex 必须说明错误结合的酶形式，例如 Ordered 的 $EB$ 或 Ping-Pong 的 $FA$；不得只写“底物抑制”而不指明拓扑来源。',
            random_bibi_valid_binary_complexes: 'Random Bi-Bi 必须允许 A 或 B 均可先形成有效二元复合物并继续进入生产性 $EAB$；若某一先结合路径为死端，则不能称为理想 Random。',
            product_release_order_audit: '产物 P/Q 的定义必须随题干释放顺序锁定；任何产物抑制矩阵迁移到新题前都要先审计 P/Q 是否被重新命名。',
            diagnostic_evidence_hierarchy: '机制结论应标注证据层级：初速线族只能初筛，产物抑制支持具体机制，dead-end 抑制用于验证底物进入顺序或解释异常畸变。'
        },
        generationChainSuggestions: [
            '先给出 Cleland 图或文字路径，让模型标注 $E,EA,EAB,EPQ,EQ,F$ 等酶形式，再要求判断 Ordered、Random、Theorell-Chance 或 Ping-Pong。',
            '设计双倒数图题时，先让相交线或平行线完成机制初筛，再加入产物抑制矩阵，迫使解题者避免仅凭几何图像下终局结论。',
            '设计产物抑制题时，系统改变“变动底物 A/B、固定底物浓度、加入产物 P/Q”三项，并要求逐格写出竞争的酶形式。',
            '设计 Theorell-Chance 题时，突出 B 变动且 A 痕量条件下 P 的竞争性抑制，使其与普通 Ordered Bi-Bi 区分。',
            '设计 Random Bi-Bi 题时，加入另一底物饱和或非饱和两个版本，考察表观 C/NC 是否随条件改变。',
            '设计高阶陷阱题时，在理想 Ping-Pong 平行线或 Ordered 相交线外加入 $EB$、$FA$ 等 dead-end 支路，让高浓度底物区出现上弯或失去平行特征。',
            '设计综合诊断题时，要求学生按“Cleland 拓扑 → 初速线族 → 产物抑制矩阵 → dead-end 验证 → 证据层级结论”的顺序作答，防止跳步套模板。',
            '设计图示解读题时，可故意把 P/Q 名称、箭头上下位置或横轴底物互换，要求先重建酶状态图再判断抑制类型。'
        ],
        diversityScaffolding: {
            objectVariants: ['天冬氨酸转氨酶', '丙氨酸转氨酶', '乳酸脱氢酶', '醇脱氢酶', '己糖激酶样双底物酶', '氨基转移酶', '酰基转移酶', '人工设计双底物催化体系'],
            measurementTools: ['初速测定', 'Lineweaver-Burk双倒数图', 'Hanes-Woolf图', 'Eadie-Hofstee图', '产物抑制实验', 'dead-end analog抑制实验', '同位素交换实验'],
            dataModalities: ['Cleland机制图', '双倒数线族', '产物抑制矩阵表', '酶状态网络图', '底物抑制曲线', '固定底物浓度梯度表', 'P/Q加入实验矩阵'],
            perturbationTypes: ['固定B变动A', '固定A变动B', '加入产物P', '加入产物Q', '提高B到抑制浓度', '提高A到抑制浓度', '加入底物类似物', '改变另一底物为饱和或痕量'],
            questionStyles: ['机制判别', 'Cleland图补全', '双倒数图解释', '产物抑制矩阵推理', 'Theorell-Chance反证', 'dead-end complex识别', '底物抑制来源判断', '错误诊断反证'],
            antiRepeatRule: '重复 Cleland 多底物题时必须至少更换酶对象、变动底物、加入产物和数据模态中的两项；不得总是用转氨酶 Ping-Pong 平行线模板。',
            scaffoldingTransitionRule: 'Cleland 拓扑、初速双倒数图、产物抑制和 dead-end substrate inhibition 必须通过共同酶形式闭合；禁止把 C/NC 表格、Lineweaver-Burk 图像和机制名称机械拼接。'
        },
        antiPatternStrategies: [
            '【图像初筛陷阱】给出相交 Lineweaver-Burk 线族并在选项中放入 Ordered、Random、Theorell-Chance 和“以上均可能”，要求识别相交线不是 Ordered 的唯一证据。',
            '【平行线机械判断陷阱】先给出 Ping-Pong 典型平行线，再在高浓度底物区给出上弯，要求判断是 $FA$ 或其他 dead-end 支路导致畸变，而非立即否定 Ping-Pong。',
            '【P/Q释放顺序陷阱】题干明确 P 先释放、Q 后释放，但选项按字母或底物顺序颠倒 P/Q 的抑制对象，要求回到 Cleland 图定位释放步骤。',
            '【产物抑制变量陷阱】只改变变动底物 A/B 而保持产物相同，要求发现 C/NC 类型会随被竞争的酶形式改变。',
            '【Theorell-Chance特异性陷阱】设置 B 为变动底物且 A 为痕量，给出 P 对 B 的竞争性抑制，诱导误选普通 Ordered，正确策略是识别 Theorell-Chance 极限。',
            '【Random饱和条件陷阱】给快速平衡 Random Bi-Bi 并暗含另一底物饱和，要求判断某些产物抑制可从竞争性转为非竞争/混合型。',
            '【Dead-End Complex陷阱】给 Ordered Bi-Bi 中高 B 导致速率下降，诱导选择酶失活或产物抑制，正确策略是检查 B 是否错误结合 $E$ 形成 $EB$。',
            '【底物抑制归因陷阱】给 Ping-Pong 中高 A 破坏平行线，要求说明 A 可能错误结合 $F$ 形成 $FA$，而不是把曲线畸变归为普通实验噪声。',
            '【机制流程排序陷阱】把产物抑制矩阵、双倒数图和 Cleland 图拆散给出，要求按证据强弱排序，防止先入为主地套 Ordered 或 Ping-Pong 标签。',
            '【Random/Ordered边界陷阱】给出 B 可先结合 $E$ 但该复合物无法生成产物，诱导误判 Random；正确策略是区分有效随机二元复合物与死端 $EB$。',
            '【横轴互换陷阱】同一组数据分别以 $1/[A]$ 与 $1/[B]$ 作图，要求重新分析斜率和截距变化，防止把一个坐标系下的诊断原样迁移。'
        ]
    },

    // Hodgkin-Huxley模型
    'hodgkin-huxley-model': {
        name: 'Hodgkin-Huxley模型（HH模型）',
        hierarchy: {
            discipline: 'neurobiology',
            module: 'electrophysiology-dynamics',
            path: ['神经生物学', '系统神经生物学与突触电生理动力学', 'Hodgkin-Huxley模型']
        },
        parentDiscipline: 'neurobiology',
        parentModule: 'electrophysiology-dynamics',
        topicType: 'foundational-model',
        keywords: [
            'Hodgkin-Huxley', 'HH模型', '动作电位', '电压门控离子通道', 'm³h门控', 'n⁴门控',
            '电压钳', '电流钳', 'squid giant axon', '膜电容', 'Nernst电位', '反转电位',
            'α(V)/β(V)速率函数', 'Q10温度系数', 'channel noise', 'stochastic HH', 'Markov通道模型',
            'Hopf bifurcation', 'fold of cycles', 'hysteresis', 'odeint积分', 'XPPAUT', 'MATCONT',
            'conductance-based model', 'FitzHugh-Nagumo', 'Morris-Lecar', '心肌动作电位模型', '电缆方程'
        ],
        reasoningType: 'bifurcation' as ReasoningType,
        // 精准化：四维门控ODE、快慢变量耦合与模型适用域约束
        reasoningNote: '四维门控ODE、快慢变量耦合与模型适用域约束：Hodgkin-Huxley（HH）模型将膜电位与 m（Na⁺激活，最快）、h（Na⁺失活，较慢）、n（K⁺激活，较慢）三个门控变量耦合为四维非线性常微分方程组。核心推理必须从等效电路方程 C_m dV/dt = -g_Na m³h(V-E_Na) - g_K n⁴(V-E_K) - g_L(V-E_L) + I(t) 出发，同时闭合 α(V)、β(V) 速率函数、电压零点、经典参数集、Q10 温度校正和实验读出口径。单次动作电位触发应从阈值流形、快慢门控耦合与轨道大幅 excursion 解释；恒定电流下从静息到重复放电的 onset 才适合用 Hopf、鞍结点、极限环折叠等分岔刻画，具体类型需由参数与数值续接确认。该模型的核心难点是区分“门控变量动力学”“离子电流贡献”“膜电位轨道”“分岔/兴奋性类型”“随机通道模型与确定性平均场适用域”五类不同物理量。',
        levels: {
            basic: '识别等效电路中的膜电容、Na⁺/K⁺/漏电流、反转电位和外加电流；理解 HH 模型不是线性 RC 电路或固定阈值模型，而是由电压依赖门控变量产生动作电位。',
            intermediate: '掌握 dm/dt=α_m(V)(1-m)-β_m(V)m 及 h、n 的同型方程；能根据 α(V)、β(V) 计算稳态门控变量 x∞ 与时间常数 τ_x，并统一原始 HH 电压零点和现代绝对膜电位写法。',
            advanced: '能从电路方程推导四维 ODE 并数值积分再现动作电位；分析 Q10 温度校正、反转电位变化、通道阻断和恒定电流驱动下的兴奋性 onset；区分确定性 HH 平均场、channel-noise Langevin 与显式 Markov 通道模型。',
            competition: '① 动作电位触发 vs 重复放电 onset 陷阱：单次 spike 不能直接等同为 Hopf 分岔，必须先区分阈值流形穿越、轨道 excursion 和恒定电流下极限环产生。② 电压零点混用陷阱：α/β 速率函数必须声明采用原始静息电位为 0 的写法还是绝对膜电位 mV 写法，ENa/EK/EL 与速率函数不可跨体系硬拼。③ 时间尺度常数化陷阱：m 通常最快，h/n 较慢，但 τm、τh、τn 均随电压和温度改变，不能把 0.1 ms 或 1 ms 当全局常数。④ bifurcation 定性滥用陷阱：必须给出临界电流范围、分岔类型、稳定性变化与是否存在 hysteresis；不得预设为 supercritical Hopf。⑤ 随机模型滥用/漏用陷阱：若题目核心观测量是有限通道数、ISI 分布、first latency、噪声诱发放电或相干共振，应使用 stochastic HH、channel-noise Langevin 或 Markov 模型；若使用确定性 HH，需说明平均场近似条件。⑥ HH vs Markov 争议陷阱：m³h 可形式展开为组合门控状态，但是否能解释单通道 open-time、first latency 或 dwell-time 分布需与显式 Markov 模型定量比较，不能默认任一模型必然更优。'
        },
        peakDifficulty: '在电压钳电流、电流钳膜电位时间序列、噪声注入 ISI 分布、温度阶跃、通道阻断和单通道记录多模态冲突数据下，同时完成：(1)统一电压零点、反转电位和 Q10 校正；(2)构建确定性 HH、channel-noise Langevin 或 Markov 通道模型并说明适用域；(3)用数值积分与 XPPAUT/MATCONT 等续接方法定位重复放电 onset 的临界电流、分岔类型和 hysteresis；(4)定量比较膜电位轨道、离子电流、门控变量和单通道统计是否由同一参数组解释；(5)输出参数可辨识性与无法由当前数据唯一确定的结论。',
        relatedSubfields: [
            {
                discipline: 'neurobiology',
                module: 'electrophysiology-dynamics',
                path: ['神经生物学', '系统神经生物学与突触电生理动力学', '动作电位与电压门控通道动力学'],
                relation: '主适用域：神经元动作电位、AIS 阈值、Na⁺/K⁺ 门控变量与电流钳/电压钳读数。'
            },
            {
                discipline: 'animal-physiology',
                module: 'excitable-tissue-physiology',
                path: ['动物生理学', '兴奋性组织生理', '神经-肌肉与心肌动作电位'],
                relation: '生理变体：把 HH 型电导框架迁移到神经-肌肉接头、骨骼肌纤维、心肌浦肯野纤维或快反应心肌细胞时，必须改写通道组成、动作电位时程和不应期机制。'
            },
            {
                discipline: 'biophysics-advanced',
                module: 'membrane-biophysics',
                path: ['生物物理学', '膜生物物理与离子通道', '电导型膜模型与通道噪声'],
                relation: '物理机制变体：关注膜电容、单通道电导、有限通道数噪声、详细平衡/非平衡 Markov 状态环和电化学驱动力。'
            },
            {
                discipline: 'computational-biology',
                module: 'computational-neuroscience',
                path: ['计算生物学', '计算神经科学', '可兴奋系统数值模拟与分岔分析'],
                relation: '计算变体：用于 ODE 数值积分、参数估计、灵敏度分析、XPPAUT/MATCONT 续接和 reduced model 对照。'
            },
            {
                discipline: 'systems-biology',
                module: 'nonlinear-dynamical-systems',
                path: ['系统生物学', '非线性动力系统', '快慢变量与兴奋性网络'],
                relation: '系统变体：把 HH 视为快慢变量耦合的可兴奋系统，用于分析 limit cycle、hysteresis、相锁定、噪声诱发跃迁和网络同步。'
            },
            {
                discipline: 'bioengineering',
                module: 'bioelectronic-modeling',
                path: ['生物工程学', '生物电子与动态钳', '人工膜电路与硅神经元实现'],
                relation: '工程变体：用于动态钳、神经形态电路、Modelica/CellML 模块化和闭环刺激控制，重点审计硬件延迟、寄生电容和观测算子。'
            }
        ],
        modelVariants: [
            '经典 squid giant axon HH：m³h/n⁴ 四维 ODE 与经典电导参数，适合教学和基准数值积分。',
            'stochastic/channel-noise HH：在有限通道数、噪声诱发放电、ISI 分布或 first latency 读数下加入 Langevin 或随机通道项。',
            'Markov-state 通道模型：把通道拆成显式 Closed/Open/Inactivated 状态，用于单通道 open-time、dwell-time 和非平衡环流问题。',
            'reduced excitability models：FitzHugh-Nagumo、Morris-Lecar、Connor-Stevens 等用于相平面、兴奋性类型与分岔机制对照，不能与 HH 参数直接等价。',
            'cardiac/肌肉电导模型变体：Noble、Luo-Rudy、Huxley 肌纤维等扩展不同离子通道和钙动力学，动作电位时程与不应期边界不可套用神经元 HH。',
            'spatial cable/axon propagation HH：把局部 HH 膜电流嵌入电缆方程或轴突传播 PDE，需同时闭合空间边界、轴向电阻和传导速度。'
        ],
        formulaCoverage: {
            modelAssumptions: [
                'HH 模型将细胞膜建模为等效电路：脂质双层为膜电容 C_m，Na⁺、K⁺ 与漏通道分别贡献电压依赖或近似线性的电导，外界刺激以电流项 I(t) 或等效边界条件进入。',
                '模型用宏观门控变量 m、h、n 表示大量门控粒子的平均开放概率；Na⁺ 电导按 m³h 缩放，K⁺ 电导按 n⁴ 缩放。',
                '若题干涉及离散单通道跳变、open-time 分布、first latency 或有限通道数噪声，必须显式说明是否从确定性 HH 平均场扩展为 Markov/随机通道模型。'
            ],
            coreParameters: [
                '经典 squid giant axon 参数常取 C_m=1 μF/cm²，g_Na=120 mS/cm²，g_K=36 mS/cm²，g_L=0.3 mS/cm²。',
                '反转电位必须与电压零点配套：现代绝对膜电位写法常用 E_Na≈50 mV、E_K≈-77 mV、E_L≈-54.4 mV；原始 HH 相对静息电位写法常出现约 115、-12、10.6 mV 的平移值。',
                '恒定电流下的放电临界范围依赖参数、温度和积分/续接设置；可作为约 6–10 μA/cm² 的经验量级，但正式结论必须由数值积分或分岔分析确认。'
            ],
            gatingEquations: [
                '门控变量方程：dx/dt=α_x(V)(1-x)-β_x(V)x，其中 x∈{m,h,n}。',
                '稳态与时间常数：x∞(V)=α_x/(α_x+β_x)，τ_x(V)=1/(α_x+β_x)；m 通常最快，h/n 较慢，但三者均随 V 与温度改变。',
                '速率函数必须先声明电压零点；原始 HH 可写为 α_m(V)=0.1(25−V)/(exp((25−V)/10)−1), β_m(V)=4exp(−V/18)，现代绝对膜电位写法需整体平移，不能混用。'
            ],
            membraneEquation: [
                '核心电路方程：C_m dV/dt = -g_Na m³h(V-E_Na) - g_K n⁴(V-E_K) - g_L(V-E_L) + I(t)。',
                '总膜电流必须同时闭合 Na⁺、K⁺、漏电流和刺激项；不能只积分单一离子电流后直接断言膜电位轨道。',
                '电流方向、反转电位和膜电位符号必须统一；若采用不同文献归一化体系，应先做平移转换再计算。'
            ],
            bifurcationAndExcitability: [
                '单次动作电位触发主要是阈值流形附近的快慢系统 excursion；重复放电 onset 才用分岔语言描述，分岔类型需由数值续接确认。',
                '经典或变体 HH 可出现 Hopf、鞍结点、极限环折叠、双稳态和 hysteresis 等行为；不得预设为 supercritical Hopf。',
                '分岔题必须报告控制参数、临界值、稳定性变化、初值依赖和 hysteresis 宽度；只说“存在分岔”不足以闭合推理。'
            ],
            stochasticAndMarkov: [
                '确定性 HH 是大量通道平均场近似；当通道数有限、噪声注入、ISI 分布或 first latency 成为核心观测量时，应加入 channel noise、Langevin 项或显式 Markov 通道状态。',
                'm³h 结构可形式展开为 8 个组合门控状态，但经典 HH 不自动给出完整单通道 dwell-time 机制；需要与显式 Markov 模型定量比较。',
                '噪声强度必须与通道数、膜面积、实验放电率或相干共振峰匹配；过强噪声可能破坏动作电位而非增强响应。'
            ],
            thermodynamicsAndLimits: [
                '温度依赖通常通过速率函数乘以 Q10^((T-T_ref)/10) 处理，原始 squid giant axon 实验参考温度约 6.3°C，Q10 需按题干或文献给定。',
                '外部周期电场或正弦刺激可作为 I(t) 或等效边界条件进入；是否诱导相锁定、亚阈值共振或混沌取决于频率、幅值、细胞几何、取向和耦合方式。',
                'TTX/TEA、离子浓度改变和温度阶跃会同时改写最大电导、反转电位或门控速率；题目必须说明扰动作用在哪一类参数上。'
            ],
            crossDisciplinaryExtensions: [
                '神经生物学扩展：HH 用于 AIS 阈值、树突-胞体整合后的放电判定和突触输入到 spike 输出的非线性转换。',
                '动物生理学扩展：迁移到心肌、骨骼肌或神经-肌肉接头时，需替换通道种类、动作电位时程、Ca²⁺耦联和不应期机制。',
                '生物物理学扩展：可把门控变量解释为宏观开放概率，进一步连接单通道电导、Markov 状态环、通道噪声和非平衡耗散。',
                '计算生物学扩展：用于 ODE/PDE 求解、参数反演、灵敏度矩阵、模型降阶和分岔图绘制。',
                '系统生物学扩展：可作为快慢变量耦合的可兴奋模块，嵌入神经网络同步、相锁定、噪声诱发跃迁或病理节律模型。',
                '生物工程学扩展：用于动态钳、闭环刺激、硅神经元和可穿戴/植入式神经调控模型，但必须显式建模仪器延迟和观测噪声。'
            ]
        },
        forbiddenErrors: [
            '【线性RC误区】严禁把 HH 当作线性 RC 电路、固定阈值器或“Na⁺内流→必然 spike”的单步模板；必须闭合门控变量、离子电流和膜电位轨道。',
            '【单次触发等同Hopf】不得把一次动作电位触发直接说成 Hopf bifurcation；只有恒定电流驱动下的重复放电 onset 才适合做分岔类型判定。',
            '【电压基准混用】α/β 速率函数、ENa/EK/EL 和 V 的零点必须一致；原始 HH 相对电位与现代绝对膜电位写法不可混代。',
            '【时间尺度常数化】τm、τh、τn 是 V 与温度的函数；不得把 m≈0.1 ms、h/n≈1 ms 当作全电压范围硬编码。',
            '【分岔类型预设】不得预设 supercritical Hopf；必须由数值续接或相图确认临界电流、稳定性变化、极限环折叠和 hysteresis。',
            '【确定性模型越界】当有限通道数、ISI 分布、first latency、噪声诱发放电或相干共振是核心读数时，不能只用确定性 ODE；若使用确定性 HH，必须说明平均场近似条件。',
            '【Markov优劣先验】不能默认 Markov 必然优于 HH，也不能默认 HH 的 8 态展开等价于完整单通道模型；必须用 open-time、first latency 或 dwell-time 数据比较。',
            '【外场阈值硬编码】外部电场效应不能只凭固定幅值阈值判断；必须给出从外场到膜电位或注入电流的转换关系及频率条件。'
        ],
        parameterConstraints: {
            hh_voltage_reference: '所有速率函数和反转电位必须共享同一 V 定义；若从原始 HH 平移到绝对膜电位，应同步平移 ENa、EK、EL 和 α/β 函数。',
            hh_classic_conductance: '经典参数 g_Na=120、g_K=36、g_L=0.3 mS/cm² 与 C_m=1 μF/cm² 只在 squid giant axon 经典设定附近成立；跨物种或温度变化需重估。',
            hh_gating_exponents: 'Na⁺ 电导默认 m³h，K⁺ 电导默认 n⁴；改变指数或改用独立状态跳变必须提供模型切换说明。',
            hh_time_constants: 'τ_x(V)=1/(α_x+β_x)，并受 Q10 校正；不得把 τm、τh、τn 固定为全局常数。',
            hh_bifurcation_current: '临界电流可先用 6–10 μA/cm² 作经验量级，但题目答案必须通过数值积分、相图或 XPPAUT/MATCONT 续接确认。',
            hh_noise_scope: '噪声强度需绑定通道数、膜面积或实验 ISI 统计；若只分析平均膜电位且通道数很大，可声明确定性 HH 近似。',
            hh_external_field: '外部电场必须同时给出频率、幅值、几何耦合和等效 I(t)/V_m 转换；不能把 mV/cm 场强直接等同为膜电位扰动。',
            hh_temperature_q10: '温度变化需按 Q10^((T-T_ref)/10) 修正速率函数，T_ref 和 Q10 必须显式给出或说明采用经典 6.3°C 参考。'
        },
        generationChainSuggestions: [
            '先声明模型边界：确定性 HH 平均场、channel-noise Langevin 还是 Markov 通道模型；再统一电压零点、反转电位和 α/β 速率函数，最后从 C_m dV/dt 方程推导完整 ODE。',
            '设计数值积分题时，先给 C_m、g_Na/g_K/g_L、E_Na/E_K/E_L、初值和 I(t)，要求同步积分 V,m,h,n，并检查 Na⁺、K⁺、漏电流是否能解释同一膜电位轨道。',
            '设计分岔题时，先限定控制参数为恒定注入电流、温度或电导比例，再要求用续接/相图判断 onset 类型、稳定性变化和 hysteresis，而不是预设 Hopf。',
            '设计速率函数题时，故意给出原始 HH 与现代绝对膜电位两种写法的混合项，要求先统一 V 的零点再计算 x∞、τ_x 和电流方向。',
            '设计随机 HH 题时，优先给 ISI 分布、first latency 或噪声强度-放电率曲线，要求判断确定性平均场是否失效，并选择 Langevin 或 Markov 描述。',
            '设计外场/周期刺激题时，必须给出从外场到等效 I(t) 或膜电位边界的转换关系，再讨论相锁定 Arnold tongue、亚阈值共振或混沌边界。'
        ],
        diversityScaffolding: {
            objectVariants: ['乌贼巨轴突（经典 HH）', '哺乳动物皮层锥体神经元', '轴突始段 AIS', '心肌浦肯野纤维', '温度敏感型神经元', '硅基模拟 HH 电路'],
            measurementTools: ['电压钳', '电流钳', '动态钳', '膜片钳单通道记录', '噪声注入实验', 'MATCONT/XPPAUT 续接', 'Modelica/CellML 模块化'],
            dataModalities: ['V,m,h,n 时间序列', 'Na⁺/K⁺/漏电流轨迹', '动作电位波形与 ISI 分布', 'I-F 曲线', 'bifurcation diagram', '相锁定 Arnold tongue', '单通道开放时间分布'],
            perturbationTypes: ['温度阶跃（Q10效应）', 'TTX/TEA 通道阻断', '离子浓度梯度改变', '噪声强度连续变化', '恒定电流扫描', '正弦电流或外场刺激', 'g_Na/g_K 参数突变'],
            questionStyles: ['四维 ODE 推导', '完整数值积分', '电压零点统一', 'Hopf/SNIC/极限环折叠判别', '随机 Langevin 与 ISI 统计', 'HH vs Markov 单通道比较', '参数可辨识性审计'],
            subfieldVariants: ['神经生物学：AIS 阈值与突触输入触发 spike', '动物生理学：心肌/骨骼肌动作电位变体', '生物物理学：单通道电导与通道噪声', '计算生物学：ODE/PDE 数值积分与分岔续接', '系统生物学：快慢变量可兴奋模块与网络同步', '生物工程学：动态钳和硅神经元实现'],
            modelVariants: ['经典确定性 HH', 'stochastic HH / channel-noise Langevin', '显式 Markov 通道模型', 'FitzHugh-Nagumo 降阶模型', 'Morris-Lecar 二维电导模型', '心肌 Noble/Luo-Rudy 类模型', '空间电缆-HH 传播模型'],
            antiRepeatRule: '重复 HH 题时必须至少更换“细胞对象、记录手段、扰动类型、判定目标”中的两项；不得总是使用同一组经典参数或固定“Na⁺ 内流导致去极化”的线性叙事。',
            scaffoldingTransitionRule: '所有计算题必须保证因果闭合：电压零点与参数定义 → 门控变量动力学 → 离子电流 → 膜电位轨道 → 兴奋性/分岔或统计读数，禁止无因果地堆叠动作电位全或无、Hopf 或随机共振等标签。'
        },
        antiPatternStrategies: [
            '【模型边界陷阱】题干先声明确定性 HH，再给出有限通道数单通道 open-time 或 first latency 数据，要求判断是否必须切换到 Markov/随机通道模型。',
            '【电压反号陷阱】故意混合原始 HH 的 V=0 静息写法与现代 V≈-65 mV 写法，要求先统一速率函数和反转电位再计算电流方向。',
            '【触发-onset混淆陷阱】给出单次脉冲触发 spike 与恒定电流重复放电两组数据，要求分别用阈值轨道 excursion 和分岔 onset 解释。',
            '【时间尺度陷阱】人为改变 α/β 或 Q10，使 m、h、n 的相对快慢关系局部反转，要求判断动作电位波形、阈值和不应期如何改变。',
            '【确定性-随机解耦陷阱】同时给出确定性积分波形和噪声注入下 ISI 分布，要求判断同一参数组是否还能解释相干共振峰。',
            '【分岔类型陷阱】提供看似正常的 I-F 曲线但伴随双稳态或 hysteresis 数据，要求用续接而不是经验标签判定 Hopf、SNIC 或极限环折叠。',
            '【外场映射陷阱】给出正弦外场幅值但不给几何耦合，要求指出无法直接判断相锁定或混沌，必须先建立等效 I(t)/V_m 映射。',
            '【参数可辨识性陷阱】给电压钳、电流钳和单通道记录之间的冲突数据，要求输出哪些参数可由当前数据唯一确定，哪些只是模型先验。'
        ]
    },

    // 生物化学
    'biochemistry': {
        name: '生物化学与分子生物物理学',
        keywords: [
            '蛋白质结构域', '别构效应', '米氏动力学', 'Lineweaver-Burk', 'Hill系数', 'King-Altman法',
            '多底物序贯机制', '热力学非平衡态', '吉布斯自由能', 'ΔG剪切', '代谢通量分析', 'MFA',
            '氧化磷酸化', '质子动力势', '化学渗透偶联', '控制系数', '无效循环', '氧化还原电位'
        ],
        reasoningType: 'conservation' as ReasoningType,
        reasoningNote: '非平衡态稳态网络通量与热/动双重分叉逻辑：代谢网络在活体内被强制锁死于背离热力学平衡的“开放系统稳态”；各节点物质流严格遵循元素与电荷守恒（化学计量比矩阵 $S \cdot v = 0$），但各分支通量的流向与分配比，由该节点酶的别构/共价调节机制（微观动力学门控）与原位条件下的真实自由能变 $\Delta G$（宏观热力学非平衡驱动力）高度非线性耦联决定。【计算引导】：涉及跨膜离子电化学势梯度、多氧化还原对（NADH/NAD⁺, NADPH/NADP⁺）在不同亚细胞器间的非对称分配计算，以及利用代谢控制分析（MCA）中的通量控制系数（Flux Control Coefficient）定量拆解全局系统通量对单一速控步改变的非线性响应。',
        levels: {
            basic: '氨基酸侧链的理化性质与等电点（pI）计算，蛋白质一级至四级结构维持键能，经典酶活性的浓度依赖性。',
            intermediate: '单底物 Michaelis-Menten 动力学常数（$K_m, V_{max}$）的代数推导，可逆性抑制（竞争、非竞争、反竞争）在 Lineweaver-Burk 双倒数曲线上的几何表现，常规糖酵解与三羧酸循环（TCA）的碳架流向及净生成 ATP/NADH 计数。',
            advanced: '多底物酶促反应（乒乓机制、序贯随机机制、序贯排列机制）的 King-Altman 图论法动力学方程推导；基于 Hill 方程的协同性定量评估（$n_H$ 动态变动）；线粒体电子传递链（ETC）各复合物的氧化还原电位（$E_m$）级联阶梯与质子泵出化学计量比（P/O比）的经典核算。',
            competition: '① 混合/别构动力学变异陷阱：在多亚基别构酶（如 PFK-1）体系中引入“非传统混合型别构调节剂”。该调节剂既改变酶对底物的亲和力（K系统），又改变最大催化速率（V系统），且其协同性（Hill 系数）随底物本身浓度的增加发生非线性漂移（非对称协同）。解题者如果直接套用标准的一阶 Lineweaver-Burk 直线方程进行外推，将在高/低底物区段的两极发生动力学参数判定的完全溃败；② 双同位素示踪与隐藏的对称性代谢通量陷阱：在复杂交叉代谢流矩阵（如戊糖磷酸途径 PPP 与逆向糖异生偶联）中，通过 $^{13}\text{C}$ 和 $^{14}\text{C}$ 双同位素标记底物。当碳原子流经具有空间对称性的非手性中间产物（如柠檬酸、延胡索酸）时，由于酶的绝对立体专一性结合导致碳原子命运发生隐式非对称分化（Ogston 三点附着效应）。若解题者在矩阵方程中错误应用了空间的对称性化简，将导致旁路循环通量的稳态平衡解出现数倍的系统性偏差；③ 线粒体质子动力势的非线性“质子漏（Proton Leak）”与热解耦：内膜质子动力势（$\Delta p = \Delta \psi - Z\Delta\text{pH}$）在越过特定的临界高电位阈值后，非特异性脂质电导或解偶联蛋白（UCP）的质子通量呈现非线性对数级暴增。此时，ATP 合成速率与耗氧率（OUR）发生严重脱钩（热力学耗散分叉）。若题目给定不均一的 $\Delta \psi$ 空间分布，传统的标量代数叠加公式失效，必须通过局域电化学势梯度函数判断系统产热与产 ATP 的效率走向；④ 底物循环（Substrate Cycle）的热力学熵增放大陷阱：在具有高度放能的对立代谢反应对（如 PFK-1 与 FBPase-1 共同激活）中，构成表观上的“无效循环”。在特定应激刺激下，两者的动力学门控被同时部分开启，导致系统在碳通量净变动极小的情况下，伴随着极高强度的 ATP 盲目水解，引起细胞内局部微环境剧烈熵增、温度瞬态激增以及局部 pH 急剧酸化。解题者若单纯根据稳态碳骨架守恒进行静态计算，将完全忽略这一由动力学漏洞导致的全局系统能量崩溃。'
        },
        modules: {
            'enzyme-kinetics': {
                name: '酶动力学',
                topicRefs: ['adair-equation', 'allosteric-mwc-model', 'allosteric-knf-model', 'tight-binding-kinetics', 'cleland-multisubstrate-kinetics'],
                keywords: [
                    '酶动力学', '米氏动力学', 'Michaelis-Menten', 'Lineweaver-Burk',
                    '双倒数图', '竞争性抑制', '非竞争性抑制', '反竞争性抑制',
                    'Hill系数', '协同性', '别构酶', '多亚基酶', '多位点结合',
                    'Adair方程', 'Adair结合多项式', '齐变模型', 'MWC模型', 'Monod-Wyman-Changeux', 'Concerted Model',
                    '序变模型', 'KNF模型', '诱导契合', '杂合态', '紧密结合动力学', 'Morrison方程', 'Henderson方程',
                    'Cleland表示法', '多底物酶动力学', 'Ordered Bi-Bi', 'Ping-Pong Bi-Bi', '产物抑制矩阵'
                ],
                reasoningNote: '酶动力学模块覆盖米氏动力学、抑制动力学、多底物机制、Hill 协同性、Adair 方程、MWC 齐变模型、KNF 序变模型、紧密结合动力学和 Cleland 多底物动力学。涉及多位点配体结合、逐步/累积结合常数、宏观/微观常数区分或游离配体浓度时，应调用 adair-equation 专题规则；涉及多亚基别构酶、S 型结合曲线、T/R 构象平衡或 Hill 图局部斜率时，应调用 allosteric-mwc-model 专题规则；涉及诱导契合、杂合态、负协同或亚基几何拓扑拆项时，应调用 allosteric-knf-model 专题规则；涉及 [E]_t 与 [I]_t 同量级、Morrison/Henderson 方程或 IC50 纠偏时，应调用 tight-binding-kinetics 专题规则；涉及 Cleland 表示法、Ordered/Random/Ping-Pong Bi-Bi、产物抑制矩阵或 dead-end complex 时，应调用 cleland-multisubstrate-kinetics 专题规则。',
                subtopics: {
                    'michaelis-menten': {
                        name: '米氏动力学',
                        status: 'inline-summary',
                        note: '处理单底物酶促反应的经典稳态动力学。'
                    },
                    'enzyme-inhibition': {
                        name: '酶抑制动力学',
                        status: 'inline-summary',
                        note: '处理竞争性、非竞争性、反竞争性和混合型抑制。'
                    },
                    'hill-cooperativity': {
                        name: 'Hill 协同性',
                        status: 'inline-summary',
                        note: '处理经验 Hill 拟合与协同性判定；涉及构象机制时切换到 MWC、KNF 或 Adair。'
                    },
                    'adair-equation': {
                        name: 'Adair 方程',
                        status: 'referenced-topic',
                        ref: 'adair-equation',
                        note: '完整公式与判错规则维护在顶层 adair-equation 条目中。'
                    },
                    'allosteric-mwc-model': {
                        name: '齐变模型',
                        status: 'referenced-topic',
                        ref: 'allosteric-mwc-model',
                        note: '完整公式与判错规则维护在顶层 allosteric-mwc-model 条目中。'
                    },
                    'allosteric-knf-model': {
                        name: '序变模型',
                        status: 'referenced-topic',
                        ref: 'allosteric-knf-model',
                        note: '完整公式与判错规则维护在顶层 allosteric-knf-model 条目中。'
                    },
                    'tight-binding-kinetics': {
                        name: '紧密结合动力学',
                        status: 'referenced-topic',
                        ref: 'tight-binding-kinetics',
                        note: '完整公式与判错规则维护在顶层 tight-binding-kinetics 条目中。'
                    },
                    'cleland-multisubstrate-kinetics': {
                        name: 'Cleland 多底物酶动力学',
                        status: 'referenced-topic',
                        ref: 'cleland-multisubstrate-kinetics',
                        note: '完整公式与判错规则维护在顶层 cleland-multisubstrate-kinetics 条目中。'
                    }
                }
            }
        },
        generationChainSuggestions: [
            '先锁定酶促机制或代谢网络的守恒变量，再引入别构、同位素示踪或跨膜电化学势作为机制分叉。',
            '涉及通量题时，先做元素/电荷/还原当量闭合，再判断动力学门控和热力学方向是否允许该通量。',
            '涉及多亚基别构酶、S 型饱和曲线、T/R 构象平衡或 Hill 局部斜率时，沿“生物化学 → 酶动力学 → 齐变模型”层级调用 allosteric-mwc-model 专题规则。',
        ],
        diversityScaffolding: {
            objectVariants: ['多亚基别构酶', '线粒体电子传递链', 'PPP-TCA交叉通量', '膜转运蛋白', '底物循环反应对'],
            measurementTools: ['酶动力学曲线', '同位素示踪', '代谢通量分析', '氧耗仪', '膜电位探针'],
            dataModalities: ['Lineweaver-Burk图', 'Hill曲线', '同位素标记分布表', '通量矩阵', 'ΔG与浓度表'],
            perturbationTypes: ['别构调节剂', '底物浓度阶跃', '氧化还原状态改变', '质子漏增强', '同位素标记位置变化'],
            questionStyles: ['参数反演', '通量闭合', '热动力学分账', '模型比较', '错误外推反证'],
            antiRepeatRule: '重复生化题时至少更换酶/网络对象、读出模态和扰动条件，避免总是米氏方程直代。',
            scaffoldingTransitionRule: '酶动力学、代谢通量和热力学自由能必须通过共同底物、辅因子或膜电化学势闭合，禁止公式链拼接。',
        }
    },

    // 微生物学
   'microbiology': {
        name: '系统微生物学与分子发酵动力学',
        keywords: [
            '群体感应', 'QuorumSensing', '群体生长动力学', '双相生长', 'Diauxie', '趋化性运动',
            '生物膜', 'Biofilm', '合成菌群', '跨物种电子传递', 'DIET', '噬菌体溶源抉择', 
            '质粒复制阻抗', 'Metatranscriptomics', '限制性内切流', 'CRISPR免疫动力学'
        ],
        reasoningType: 'conservation' as ReasoningType,
        reasoningNote: '多维环境容量约束与动态协同演化守恒逻辑：微生物群体的增殖、衰亡与次级代谢产物合成，不仅受到宏观碳/氮/磷原子与还原当量（NADH/NAD⁺）的跨膜物料守恒死锁，更受到环境微空间热力学耗散与群体通讯浓度的非线性阈值限制。【计算引导】：提供基于拓展 Logistic 模型或微观个体基础模型（IbM）的非稳态动态微分方程，引入资源分配（Resource Allocation）假说，定量解析菌体在多底物共存体系下的双相生长（Diauxic Growth）转录切换滞后时间，以及群体感应分子（自诱导物 Autoinducer）在动态对流扩散边界下的局部浓度激增拐点。',
        levels: {
            basic: '微生物四大营养类型的能量与碳源分类，革兰氏染色分子机制，经典培养基（固体/液体）配制与平板划线纯化。',
            intermediate: '细菌典型生长曲线（延滞期、对数期、稳定期、衰亡期）的定性分析，常规物理与化学灭菌方法的 D 值（热死时间）计算，显微镜直接计数与平板菌落计数（CFU）的统计学换算。',
            advanced: 'Monod 增殖动力学微分方程推导与比生长速率（$\mu$）求解；细菌趋化性运动（Chemotaxis）的“随机游动-偏向性翻转（Run-and-Tumble）”分子级联调控机制；反硝化、硫酸盐还原等特殊厌氧呼吸链的电子传递效率与自由能核算。',
            competition: '① 群体感应（QS）的空间异质性与阈值猝灭陷阱：在微流控空间或多孔介质（如土壤、宿主肠道隐窝）中，自诱导物（如 AHL/AI-2）的扩散受到局域几何拓扑结构的严重束缚。虽然全局宏观菌体密度远未达到典型群体感应阈值，但由于局部物理阻隔导致信号分子局部浓度发生对数级暴增，提前触发群体行为（如毒力因子释放或生物膜 Biofilm 矩阵分化）。解题者如果固守经典的“全局均一密度触发”假设，将无法预测局部物理空间导致的生理开关断裂分叉；② 多底物双相生长（Diauxie）的碳源阻遏与通量崩溃陷阱：当菌株处于 glucose-lactose 混合体系且遭遇外部环境应激（如热激或局部反压）时，经典的合成路线阻遏（CCR）机制与应激转录因子（如 $\sigma^S$）发生高维交互阻抗。此时，细胞膜上的 PTS（磷酸转移酶系统）信号转导发生非对称振荡，导致在第一碳源耗尽向第二碳源切换的过渡期，菌体比生长速率不是平滑停滞，而是由于翻译机器抢夺（Ribosome Partitioning）导致细胞进入长期的代谢盲区甚至全群体的急性自噬性死亡。解题者若单纯根据 Monod 双底物叠加公式计算生长，将无法发现这一动力学死锁；③ 合成多菌群（Synthetic Consortia）的跨物种直接电子传递（DIET）热力学陷阱：在产甲烷菌与互营产乙酸菌构成的双菌协作厌氧体系中，物质流与能量流并非通过简单的化学底物（如氢气或甲酸）传递，而是依靠菌体表面的纳米导电菌毛（e-pili）进行跨物种直接电子交割。当外部环境的电极电位或氧化还原限度发生突变时，电子传递阻抗变为非线性。此时系统各组分的代谢通量将不再满足标准的质子守恒矩阵，而是沿着电子流动阻力最小的方向发生“代谢流突变坍塌”。AI 如果只算化学计量比而不建立电子电位差阻抗模型，将彻底算错产物分配率；④ 质粒不稳定性的“遗传负载-代谢负担”反馈分叉陷阱：在工程菌高密度表达外源蛋白质过程中，复制子（Replicon）的拷贝数控制与宿主细胞自身的染色体复制机器存在竞争。随着表达诱导剂强度的非线性增加，质粒带来的“代谢负担（Metabolic Burden）”导致细胞内游离氨基酸池枯竭，反向激活了宿主的“严紧反应（Stringent Response）”，从而触发高频率的无质粒分离子（Plasmid-free segregants）突变体的产生。这种突变体在发酵罐中因没有代谢负担而呈现指数级生长优势，引发全罐“劣币驱逐良币”的演化危机。建立在静态稳定遗传假设上的动力学模型在此处会由于完全丧失演化预测能力而彻底崩溃。'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '微观非均一扩散阻抗边界下的多菌群跨物种直接电子传递（DIET）热力学势能阻抗网络非线性求解。',
        forbiddenErrors: [
            '【无演化高密度常数设想】高密度长周期发酵中，严禁假设工程菌质粒拷贝数与外源基因表达率保持 100% 无变异稳态。',
            '【Monod 方程无限外推】Monod 方程仅在低密度营养限制的一阶动力学区有效；严禁盲目外推至高菌体密度下的代谢产物毒性抑制区。',
            '【维持能量物料恒等脱钩】恒化器极低稀释率下维持系数 m_s 占总消耗比重剧烈飙升，严禁出现维持能量为零的理想物料恒等式。',
        ],
        parameterConstraints: {
            bacterial_min_doubling_time: 'E. coli 等快速分裂菌的物理最短倍增时间不可突破 15–20 min；出现 5 min 或 2 min 属于动力学模型穿帮。',
            ahl_qs_threshold: 'AHL 群体感应激活临界浓度在几 nM 至数 μM（10⁻⁸–10⁻⁶ M）；在无空间阻抗机制的前提下设定 pM 级自发触发属硬伤。',
        },
        antiPatternStrategies: [
            '【定量时间尺度门控】先计算宏观混合时间 τ_mix 与微观细胞代谢响应时间 τ_metabolism 的比值；τ_mix ≫ τ_metabolism 时传统均一 Monod 模型彻底失效，系统强行进入时空异质性死区（巴斯德效应局部逆转 + 乙酸溢流）——AI 默认全局均一，必然得出相反产率断言。',
            '【非标准生物工质】废除标准单菌双相 glucose/lactose 模型，改用：依靠导电菌毛（e-pili）传递纳米电子的"多菌群 DIET 体系"、质粒高度表达导致极性分配不均的"自私质粒清洗系统"——AI 语料对非接触式电子流极度陌生。',
            '【离散演化博弈陷阱】在高密度发酵后期引入无质粒分离子突变体，要求定量计算其在 Replicator Dynamics 下的竞争优势增长速率和"劣币驱逐良币"的时间点——AI 惯于静态稳定遗传假设，无法预测演化博弈分叉。',
        ],
    },

    // 植物生理学
   'plant-physiology': {
        name: '系统植物生理学与长距离信号拓扑学',
        keywords: [
            '光系统II', 'PSII光抑制', 'P700', '循环电子传递', 'CEF', '韧皮部装载', '源库动力学',
            'Munch压力流动假说', '生长素极性运输', 'PIN蛋白拓扑极性', '双重受体竞争', 'TIR1-Aux/IAA',
            '气孔动力学', 'ABA非线性级联', '逆境钝化', '跨膜水势梯度', '水力学空穴化', 'Cavitation'
        ],
        reasoningType: 'topology' as ReasoningType,
        reasoningNote: '时空源-库流体动力学与多重负反馈信号拓扑逻辑：植物体作为一个高度分散但空间高度偶联的开放系统，其长距离物质输导遵循源-库静水压差流体动力学（Munch 假说）；微观信号调控则由多重植物激素通过“竞争性泛素化降解受体”构成的动态拮抗/协同网络决定，其稳态维持高度依赖于通路内部的负反馈时空延迟与非线性电化学势屏障。【计算引导】：提供基于微观极性运输（如 PIN 载体空间拓扑异构分布）导致的生长素局部形态发生素梯度（Morphogen Gradient）微分方程，以及伴随光合电子传递链（PETC）中非光化学猝灭（NPQ）与循环电子流（CEF）量子产额动态分配的热力学耗散核算。',
        levels: {
            basic: '光合作用光反应与暗反应的场所及基本产物，五大类传统植物激素的定性生理效应，根毛区吸水与蒸腾拉力的代数基础。',
            intermediate: 'C3、C4 与 CAM 植物在解剖结构（Kranz 结构）与碳固定酶（Rubisco 与 PEPC）动力学上的定量差异；生长素（IAA）促进细胞伸长的“酸生长假说”分子机制；筛管-伴胞复合体中的蔗糖-质子同向运输装载模型。',
            advanced: '光系统 II（PSII）光抑制与 D1 蛋白周转动力学；叶绿体类囊体膜跨膜质子梯度（$\Delta\text{pH}$）驱动 ATP 合成酶的旋转催化核算；ABA（脱落酸）介导保卫细胞内钙信号振荡及慢阴离子通道（SLAC1）激活的气孔非线性关闭动力学。',
            competition: '① 生长素极性运输（PAT）的空间拓扑自组织与“几何死锁”陷阱：在根尖分生组织或叶原基发生过程中，细胞膜上 PIN 家族转运蛋白的极性定位受到内吞-外排胞吐循环的动态空间调控，表现为生长素流向的拓扑自组织网络。若题目引入一种外部物理胁迫或微管抑制剂，使得 PIN 蛋白在膜上的相对扩散系数发生极微小的非线性各向同性漂移，系统将无法形成局部生长素尖峰（IAA Maximum），转而发生全细胞形态学对称性破缺的完全崩溃。解题者若只套用静态的“生长素由形态学上端向形态学下端运输”的线性代数叠加，将完全迷失于由空间拓扑异构导致的器官命运分叉点；② 源-库长距离输导的静水压“水力学空穴（Cavitation）”突变分叉陷阱：根据 Munch 压力流动假说，筛管内的蔗糖装载建立起由源到库的静水压差（$\Delta P$）。当外部遭遇急性干旱导致木质部水势（$\Psi_w$）暴跌时，木质部导管因负压过大发生非线性“空穴化（Cavitation）”，形成气栓。这会导致木质部与韧皮部之间的侧向水势动态平衡发生瞬间逆转（水流反向回流）。此时，原有的源-库质量流方程在特定静水压阈值下发生灾难性突变（系统阻抗非线性暴增至无穷大），导致全株养分分配矩阵发生彻底的拓扑断裂。AI 如果坚持认为“有糖就能运输”，将在预测干旱后期养分分配时掉进逻辑黑洞；③ 强光照下类囊体膜氧化还原电子流的“能量溢流与解耦”陷阱：在光反应中，当强光超出暗反应碳同化能力时，受体侧限制导致 PSII 产生大量激发态三线态叶绿素（$^3\text{Chl}^*$）与活性氧（ROS）。系统为了自救，会非线性激活围绕 PSI 的循环电子流（CEF）以及类囊体膜上的光呼吸旁路，从而将电子流从生成 NADPH 的路径强行分流至维持跨膜 $\Delta\text{pH}$ 以激活 NPQ（非光化学猝灭）耗散。解题者若单纯根据光合磷酸化的固定量子产额比例（如旧教材的固定的 ATP/NADPH 比值）进行能量计算，将完全忽略这一由光抑制触发的热力学耗散分叉，从而在计算逆境光合效率时得出高出数倍的荒谬电化学数据；④ 激素信号受体“解抑制”路径的饱和非线性动力学陷阱：以生长素受体 TIR1 或茉莉酸受体 COI1 为代表的“降解阻遏蛋白（Aux/IAA 或 JAZ）”信号通路，其本质是一条基于泛素-蛋白酶体系统的非线性解抑制（Disinhibition）链条。在激素浓度由低向高攀升的过渡期，阻遏蛋白的降解速率并不与激素浓度呈线性正比，而是呈现出极强的底物饱和米氏动力学。若在系统内引入具有微弱结合力的竞争性伪拟态配体，系统的转录响应曲线不仅会发生右移，更会在特定临界点由于下游转录因子（如 ARF）自我正反馈回路的切入，而展现出双稳态（Bistability）磁滞回线效应。这种“激素浓度高低不决定响应强弱，而由历史路径决定”的非线性现象，是依赖单向线性 CoT 推导的大模型的终极克星。'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '极值蒸腾负压引发的非连续"气栓-水流"双相瞬态流体力学矩阵计算，与类囊体膜 NPQ/CEF 量子产额动态分配的热力学耗散核算。',
        forbiddenErrors: [
            '【长距离质量流输导脱钩】筛管装载完全依赖 H⁺-蔗糖同向运输器建立的非线性跨膜静水压差；严禁出现"只要全身水势梯度向下，蔗糖就能无耗能自发运输"的低维幻觉。',
            '【光合量子产额静态化假设】极端强光或逆境下 PSII 实际量子产额绝非恒定；严禁无视 NPQ 和 CEF 对能量的物理耗散，用常态固定比例核算最终产糖量。',
            '【气孔开闭一元化因果链】保卫细胞运动由激素、蓝光、CO₂ 浓度等构成高维交叉网络控制；严禁出现只根据单一 ABA 浓度线性对应气孔导度的孤立因果链。',
        ],
        parameterConstraints: {
            max_xylem_tension: '纯水抗张强度上限（导管微观尺度）约为 −2.0 至 −3.0 MPa；设定为 −5.0 MPa 将触发自发相变崩溃（空穴化），属于常识穿帮。',
            rubisco_kcat: 'Rubisco 催化常数 k_cat 仅 2–5 s⁻¹，远低于一般酶；将其突变虚构为 10⁴ s⁻¹ 属于脱离生物现实的硬伤。',
            psii_excitation_wavelength: 'PSII 反应中心 P680 吸收极限死锁在 680 nm 附近；设定 730 nm 远红光单独高效驱动 PSII 属于物理机制穿帮（红降现象区域）。',
        },
        antiPatternStrategies: [
            '【定量门控推理】在推理链关键分叉处嵌入临界值判断：木质部负压是否超越空穴化阈值（−2～−3 MPa）决定水流连续性；[S]/Km 比值决定 Rubisco O₂/CO₂ 竞争走向；CEF/LEF 分配比由跨膜 ΔpH 精确值决定 NPQ 激活程度——AI 惯于跳过临界值验证，直接线性外推。',
            '【非标准生物工质】避开 C3 植物标准系统，改用：CAM 植物夜间开气孔的反相 CO₂ 固定时序动力学、菟丝子无根无叶的反向韧皮部卸载、复苏植物（卷柏）细胞壁折叠脱水后的非经典水势恢复动力学——AI 对这些系统极度低频，无法模式匹配。',
            '【多步数值级联】≥3 层串行：光合电子传递速率 → 质子泵出化学计量 → 跨膜 ΔpH → ATP 合酶产率 → Calvin 循环 RuBP 再生速率 → 净碳固定量；或：蒸腾拉力 → 木质部负压 → 是否超空穴化阈值 → 有效导水面积 → 叶片水势 → 气孔导度 → 最终光合速率——任一中间步骤误差级联放大。',
            '【强制否定回溯】给出看似正常的光合环境参数但极其反常的输出（净光合通量暴跌为负），要求反向找出被违反的隐含物理假设（高温高O₂光呼吸主导 / 超强光 NPQ 耗散 90%+ / ABA 导致气孔完全关闭 CO₂ 饥饿）——AI 倾向于正向迎合解释，极不擅长反证法。',
        ],
    },

    // 动物生理学
   'animal-physiology': {
        name: '系统动物生理学与多器官病理动力学',
        keywords: [
            '动作电位', 'Hodgkin-Huxley模型', '快钠通道失活', '心肌有效不应期', '心输出量',
            'Frank-Starling定律', '风箱效应', '顺应性', '肺换气', 'V/Q比值', '波尔效应', 
            '近球小体', '肾小球滤过率', 'GFR', '管球反馈', '对流倍增机制', '不应期分叉',
            'Bidomain', '双域模型', '非共轴各向异性', '微观可逆性破缺', '非平衡马尔可夫链',
            '熵产生率', 'modified PNP', '空间位阻', '离子关联', '电荷反转', '树突分岔',
            'Rall规则', '动态钳', '寄生电容', '逆问题退化', '膜片钳伪迹'
        ],
        reasoningType: 'equilibrium' as ReasoningType,
        reasoningNote: '多器官级联阻抗与时空多重反馈负荷稳态逻辑：内环境稳态（Homeostasis）不是静态的代数平衡，而是高度依赖于时空延迟、非线性电化学/流体静压反馈、组织各向异性边界和实验读出参照系的动态限幅稳态；各器官系统的偶联遵循流体力学阻抗匹配、质子/气体分压守恒与跨膜电荷/离子活度闭合。当系统遭受越过临界点（Tipping Point）的极值扰动时，原有的负反馈调节（如压力感受性反射、管球反馈）会因受体饱和或时间滞后而发生相变，非线性地坍塌为正反馈恶性循环或极限环（Limit Cycle）振荡。【电生理升级】：高阶题应避免停留在标准 Hodgkin-Huxley、电缆方程或详细平衡马尔可夫链的模板推导，而要显式锁定组织电导张量是否共轴、离子通道状态环是否满足微观可逆性、选择性滤器是否可用连续体 PNP 近似、树突分岔是否满足 Rall 关系，以及动态钳/膜片钳数据是否被电极寄生电容、放大器延迟或液接电位污染。解题链应先判定模型适用域和观测量口径，再进入偏微分方程、非平衡熵产生、积分-微分电扩散、时滞边界条件或逆问题可辨识性分析。【计算引导】：提供基于 Hodgkin-Huxley 方程拓展的膜电位动态变化、心肌双域/电缆模型的边界条件判定、非平衡门控状态概率通量、心肌细胞跨膜离子流与不应期重构微分方程，以及基于 Fick 原理、Henderson-Hasselbalch 方程的复杂酸碱平衡与跨毛细血管星林（Starling）流体静压/胶体渗透压驱动力核算。',
        levels: {
            basic: '神经元与突触的经典显微结构，骨骼肌横桥周期定性流路，体循环与肺循环的解剖学路径及血流方向。',
            intermediate: '静息电位（Nernst 钾平衡电位）与动作电位去极化峰值的经典代数计算；神经-肌肉接头处 ACh 释放与终板电位（EPP）的产生；心室肌细胞与快反应自律细胞动作电位分期的典型特征。',
            advanced: '利用 Hodgkin-Huxley 门控变量（$m, h, n$）定量解析快钠通道的电压依赖性激活与失活阻抗；Frank-Starling 心脏定律中前负荷（心室舒张末期容积）与每搏输出量（SV）的非线性依从关系；肺部通气/血流比值（$V/Q$）失调导致的隐藏性解剖分流与无效腔效应核算。',
            competition: '① 动作电位传导中的电压门控通道“失活相振荡与不应期拓扑分叉”陷阱：在心肌或神经纤维中引入局部高钾环境或化学毒素，使得细胞静息膜电位发生持续性的微弱去极化。此时，决定动作电位去极化速率的快电压门控 $\text{Na}^+$ 通道的失活门（$h$ 门）处于非线性部分关闭状态。若给予系统一个高频微弱的序贯刺激，膜电位的响应将不再满足标准的“全或无”定律，而是呈现出混沌传导、不完全不应期交替（Alternans）甚至拓扑迷失。解题者如果一味固守“动作电位幅值恒定”的线性阈值观念，将在预测心律失常的折返激动（Reentry）方向时彻底翻车；② 循环系统容量不匹配与星林（Starling）流体静压“正反馈急性休克”崩溃陷阱：当急性左心衰竭导致心输出量（CO）非线性骤降时，肺毛细血管静水压（$P_c$）跨越临界阈值，克服血浆胶体渗透压（$\pi_p$），引发急性肺水肿。肺水肿导致的严重缺氧反向抑制心肌细胞的 ATP 生成，进一步削弱心肌收缩力。此时，原有的血压负反馈调节系统（压力感受性反射）因为外周血管阻力极度痉挛而发生代偿极限崩溃，整体系统由负反馈稳态瞬间切换为正反馈死亡漏斗。大模型若机械地应用“血压低则血管收缩代偿以回升血压”的线性思维，将给出让外周血管无限收缩的荒谬病理生理诊断；③ 肾脏管球反馈（TGF）的时间延迟与“非线性渗透极限环”震荡陷阱：致密斑通过检测远曲小管的 $\text{Cl}^-$ 浓度来动态调节入球小动脉的阻力，以稳定肾小球滤过率（GFR）。当题目引入某种作用于髓袢升支粗段的回路抑制剂（如呋塞米），破坏了肾髓质的对流倍增梯度时，管球反馈的信号传递产生显着的时间延迟（Time Delay）。这种延迟与高阶负反馈回路非线性叠加，会导致入球小动脉舒缩状态、GFR 以及尿液流速发生持续的、无法收敛的“极限环振荡（Limit Cycle Oscillation）”。解题者若单纯根据静态守恒列出代数方程，将完全无法解出这一由时间滞后引入的动态相空间周期性分叉；④ 血液气体运输的“双向协同变构与酸碱多维去偶联”陷阱：血红蛋白（Hb）对氧气的结合呈现典型的协同别构效应（由 Bohr 效应调节），同时受 $\text{H}^+$、$\text{CO}_2$ 和 2,3-BPG 的高维非线性交叉调控。如果在高海拔或严重酸中毒应激下，呼吸系统调节（PCO2 改变）与肾脏排酸（$\text{HCO}_3^-$ 重吸收）的时空速率不匹配，血液的氧解离曲线（ODC）将发生极为诡异的非对称形变（在不同氧分压区间有的部位左移，有的部位右移）。此时，组织处的“释氧效率”并不与动脉血氧饱和度呈线性正比。AI 如果直接套用标准 ODC 曲线或查表进行代数换算，将无法察觉由外周电荷与气体分压非线性去偶联导致的深层组织窒息灾难；⑤ 非共轴各向异性心肌双域模型陷阱：在三维非均匀心肌块中令细胞内、细胞外电导率张量的主轴随空间位置错位，外加局部刺激与非规则边界。此时跨膜电位方程会保留交叉导数和张量散度项，不能通过一次坐标旋转化为标准椭圆 PDE；若解题者直接套共轴 bidomain/monodomain 模板，将把折返方向、虚拟电极极性或 Green 函数奇异结构判错；⑥ 非平衡门控马尔可夫链熵产生陷阱：电压门控通道状态环若违反详细平衡，稳态存在非零概率环流。题目可给正弦电压钳制和环路速率乘积不等条件，要求计算净通量与熵产生率；若默认微观可逆性或用平衡占有率化简，结论会在相位滞后和耗散方向上出错；⑦ 选择性滤器的修正 PNP 与电荷反转陷阱：亚纳米通道内离子有限体积、硬球排斥和静电关联会使经典 GHK/PNP 失效。高价 Ca²⁺ 与 Na⁺ 竞争、分段固定电荷和极拥挤状态可导致电荷反转及非单调 I–V 拐点；若把离子当点电荷连续稀溶液处理，将错过位阻饱和和关联屏蔽主导的临界条件；⑧ 树突分岔记忆边界陷阱：复杂树突树若局部破坏 Rall 关系，并叠加依赖前三次刺激历史的 STD 与 NMDA 电压门控放大，输入到胞体的传递函数不再是单根均匀电缆的指数衰减。必须同时处理几何不连续边界、非线性时滞和历史权重；若只做线性 EPSP 叠加，会误判周期倍分岔或 Alternans 临界频率；⑨ 动态钳逆问题退化陷阱：全细胞动态钳数据会混入电极寄生电容、放大器有限带宽延迟、液接/零点偏置和非线性电穿孔漏电。题目应要求先建立测量算子并判断参数可辨识性，再反演真实膜电位；若默认记录电压等于真实膜电位，会忽略多个真实波形映射到同一观测数据的解退化。'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '在非共轴各向异性心肌双域张量 PDE、违反微观可逆性的离子通道状态环、计入空间位阻/离子关联的修正 PNP 选择性滤器、破坏 Rall 关系且带历史记忆的树突分岔，以及动态钳硬件伪迹逆问题退化之间，完成模型适用域判定、边界条件闭合、参数可辨识性审计与关键生理方向判断；同时保留非均匀局部去极化下 Hodgkin-Huxley h 门锁死导致的不应期拓扑分叉，及多器官级联阻抗越过 Tipping Point 后正反馈死亡漏斗的定量判定。',
        forbiddenErrors: [
            '【电中性原理滥用】不得出现违反宏观电中性（Σ z_i [C_i] ≠ 0）的独立无源静态平衡间室。',
            '【阴离子能斯特方程符号颠倒】Cl⁻ 等阴离子（z=−1）平衡电位公式的真数比值与符号必须严格匹配；外比内与正负号颠倒将导致电位极性完全反向。',
            '【线性代偿无限外推】严禁机械应用"血压低则血管收缩代偿以回升血压"的线性思维；越过临界相变点后代偿直接变为催命符（正反馈死亡漏斗）。',
            '【共轴双域默认化】心肌 bidomain 题若声明细胞内/外电导张量不共轴或主轴随空间变化，严禁通过单一坐标旋转消去交叉导数，严禁退化为 monodomain 或标量扩散模型。',
            '【详细平衡偷用】离子通道马尔可夫状态环若给出正/反向速率乘积不等，禁止使用详细平衡、Boltzmann平衡占有率或零环流假设化简稳态概率。',
            '【经典PNP/GHK越权】选择性滤器处于亚纳米拥挤、高价离子竞争或强固定电荷条件时，不得直接使用点电荷稀溶液PNP或GHK电流方程，除非题干明确忽略位阻与离子关联。',
            '【Rall关系无条件套用】树突分岔若局部破坏 Rall 关系或存在非线性时滞突触可塑性，禁止按等效无限电缆或线性EPSP叠加直接求胞体响应。',
            '【记录值等同真实膜电位】动态钳/膜片钳题不得把记录电压、电流文件值直接当真实膜电位或跨膜电流；必须先审计寄生电容、放大器延迟、液接/零点偏置和漏电模型。',
        ],
        parameterConstraints: {
            membrane_capacitance: '生物膜比电容硬性约束为 1.0 μF/cm²；总电容必须与细胞几何表面积刚性偶联，不得随意捏造不符膜厚度的电容值。',
            intracellular_calcium: '静息状态胞内游离钙 [Ca²⁺]_i 严格锁定在 50–100 nM；无刺激情况下计算得出 mM 级属于严重生理穿帮（直接触发凋亡）。',
            resting_membrane_potential: '典型哺乳动物神经元静息膜电位在 −65 至 −75 mV；题目设定超过 −120 mV 或高于 −40 mV 的"静息"状态需提供明确生理依据，否则属于参数穿帮。',
            bidomain_tensor_basis_lock: '心肌双域模型必须分别声明细胞内/外电导张量的主轴方向、特征值、空间依赖和边界条件；若两张量不共轴，应保留交叉导数或张量散度项。',
            markov_nonequilibrium_cycle: '通道马尔可夫模型需检查每个闭合环的Πk_forward/Πk_backward；偏离1即存在非平衡驱动力，熵产生率和稳态环流不得置零。',
            steric_pnp_validity_gate: '选择性滤器半径接近离子水合半径、局部浓度达拥挤区或出现Ca²⁺/Mg²⁺等高价离子竞争时，必须给定位阻/活度/关联修正或声明近似边界。',
            dendritic_memory_boundary: '涉及树突树传递函数时必须给出分岔几何、末端边界、突触历史权重和NMDA/电压门控非线性；缺任一关键量时不得声称唯一解析频响。',
            dynamic_clamp_identifiability: '动态钳反演题必须给出采样率、放大器带宽/延迟、串联电阻或寄生电容模型、漏电校正和噪声假设；否则只能给可重构区间或不可辨识结论。',
        },
        antiPatternStrategies: [
            '【定量门控推理】嵌入必须精确计算才能通过的数值判断：改变外液 Cl⁻ 浓度后 E_Cl 是否越过静息膜电位 V_m（决定通道开放是超极化还是逆向去极化）；局部高钾导致的持续去极化幅度是否使 h 门发生大面积预先锁死——AI 死套"GABA=抑制"等概念模板必然失误。',
            '【非标准病理场景】避开教科书"标准心肌动作电位"，改用：局部高钾 + 高频微弱序贯刺激诱发的 Alternans / Reentry 折返激动、急性左心衰 + 肺水肿的正反馈死亡漏斗、呋塞米破坏髓质梯度后管球反馈时间延迟引发的极限环振荡（GFR 无静态解）——这些场景 AI 语料稀缺。',
            '【离散多步不可逆承诺链】步骤 1 判定遗传/生理方式后强制锁定代数框架（不可逆承诺）；步骤 2 代入复杂多器官参数计算；步骤 3 引入新反常数据制造硬冲突，强制要求推倒重来——AI 极不擅长"自我否定式回溯"，会在错误框架内强行狡辩。',
            '【张量边界破缺门控】心肌传导题优先设置非共轴各向异性、非规则边界或局部点源刺激，要求先写出张量形式控制方程和边界项，再判断是否允许坐标变换简化；禁止让题目退化为标准同轴 bidomain 公式背诵。',
            '【非平衡熵产生门控】通道门控题可给4状态以上闭环、ATP耦合或电压迟滞速率，使正反向速率乘积不等；要求计算稳态环流、相位滞后或净熵产生，而不是只求平衡开放概率。',
            '【非连续体电扩散门控】离子通道选择性滤器题应把固定电荷、离子半径/水合半径、活度或硬球排斥与I–V曲线拐点相连，迫使解题者判断经典GHK/PNP何时失效。',
            '【树突几何-历史耦合门控】树突整合题优先使用“局部破坏Rall关系 + STD/STF历史权重 + NMDA电压门控”的组合，要求先匹配分岔边界条件，再判定胞体传递函数或周期倍分岔阈值。',
            '【逆问题退化门控】动态钳/电压钳题应给出被硬件滤波和漏电污染后的混合信号，要求证明何种参数组合下存在多解退化，并输出唯一可重构区间；不要只让学生套用理想膜电容方程。',
        ],
    },

    // 发育生物学
    'developmental-biology': {
        name: '发育生物学',
        keywords: ['发育', '分化', '胚胎', '器官建成', '信号分子', '转录因子', '干细胞'],
        reasoningType: 'threshold' as ReasoningType,
        reasoningNote: '阈值逻辑（位置信息）：形态发生素梯度决定细胞命运，细胞根据所处浓度坐标越过不同阈值激活不同基因；细胞分化一旦发生通常不可逆，体现阈值的迟滞特性。',
        levels: {
            basic: '胚胎早期分裂与分化，三胚层的形成与分化方向',
            intermediate: '器官原基的形成，细胞间信号转导，形态素梯度的建立',
            advanced: '发育相关转录因子的级联调控，细胞分化的全能性与核心因子',
            competition: '器官再生机制，干细胞全能性诱导（Yamanaka因子），发育程序的分子编码'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '在形态发生素梯度、细胞谱系限制与力学/时序反馈共同作用下，判定同一信号扰动如何导致器官模式、命运边界和再生能力的分叉。',
        forbiddenErrors: [
            '【形态发生素阈值线性化】形态发生素浓度不是简单越高越强；必须区分阈值区间、暴露时间、受体饱和和下游反馈。',
            '【细胞命运可逆性误判】已承诺分化的细胞并不等同于任意可逆状态；重编程必须给出诱导因子、时间窗和表观遗传屏障。',
            '【空间位置与谱系混同】细胞所在位置、祖先谱系和当前信号环境是不同变量，不得用单一位置坐标替代全部命运信息。',
        ],
        parameterConstraints: {
            morphogen_threshold_scope: '形态发生素阈值必须与组织尺度、扩散/降解时间和受体表达范围绑定；不可把一个组织中的阈值直接迁移到另一胚层。',
            somitogenesis_time_lock: '涉及节律性体节形成时必须给出振荡周期或相位关系；无时间信息不得唯一判断边界推进速度。',
            reprogramming_factor_boundary: 'Yamanaka 因子诱导多能性需要持续表达和表观遗传重塑；瞬时单因子扰动不得直接等同完全全能性恢复。',
        },
        generationChainSuggestions: [
            '按“位置/时间 → 信号梯度 → 基因调控网络 → 细胞命运/组织形态”组织题干，并在其中设置阈值或迟滞分叉。',
            '涉及再生或重编程时，先锁定谱系状态和表观遗传屏障，再判断扰动是否足以跨越命运边界。',
        ],
        diversityScaffolding: {
            objectVariants: ['果蝇胚胎轴向图式', '脊椎动物神经管', '肢芽发育', '体节时钟', '成体干细胞生态位'],
            measurementTools: ['原位杂交', '谱系追踪', '单细胞转录组', '荧光报告基因', '显微活体成像'],
            dataModalities: ['空间表达图谱', '时间序列表达曲线', '谱系树', '扰动-表型矩阵', '阈值响应曲线'],
            perturbationTypes: ['形态发生素局部释放', '受体敲降', '转录因子过表达', '细胞移植', '机械约束改变'],
            questionStyles: ['命运边界判断', '阈值分叉', '谱系反推', '实验补证', '错误机制排除'],
            antiRepeatRule: '同一发育概念重复出题时，必须更换胚胎轴/组织、信号类型和读出模态。',
            scaffoldingTransitionRule: '跨组织组合必须通过可传播信号、细胞迁移、力学边界或谱系关系闭合，不得把发育名词机械堆叠。',
        },
        antiPatternStrategies: [
            '【阈值带陷阱】给出相近浓度和不同暴露时间，要求判断细胞命运是否跨过稳定阈值而非只看瞬时浓度。',
            '【谱系-位置冲突】设置移植实验中位置提示与谱系标记相矛盾，要求判断哪类证据能支持命运改变。',
            '【再生过度解释】给出局部再生标志物上升，要求区分增殖、去分化、转分化和真正多能性恢复。',
        ]
    },

    // 表观遗传学
    'epigenetics': {
        hierarchy: 'geneticDevelopmental',
        name: '表观遗传学与染色质动态调控',
        keywords: ['表观遗传', 'DNA甲基化', '组蛋白修饰', '染色质重塑', '非编码RNA', 'imprinting', 'Polycomb', 'Trithorax', '3D基因组', 'Hi-C', 'TAD', '相分离', 'LLPS', 'bivalent', 'bistable', 'epigenetic landscape', 'hysteresis', 'bifurcation', 'Writer-Reader-Eraser', 'epigenotoxicity', 'CpG岛', 'X染色体失活'],
        reasoningType: 'threshold' as ReasoningType,
        reasoningNote: '多阈值双稳态与表观记忆逻辑：表观修饰构成bistable/multistable景观，细胞命运由标记密度越过阈值决定；跨越后Polycomb/Trithorax对抗产生hysteresis记忆。核心约束包括bivalent多为bistable异质群体、两次胚胎重编程窗口、TAD因果方向争议、Writer-Reader-Eraser时间尺度匹配、epigenotoxicity的可遗传分类。',
        levels: {
            basic: 'DNA甲基化、组蛋白乙酰化、表观遗传与经典遗传的区别（Waddington 1942定义）',
            intermediate: 'DNMT家族、Writer-Reader-Eraser系统、CpG岛规律（人类基因组约28890个）、imprinting、X染色体失活',
            advanced: 'Polycomb/Trithorax对抗、LLPS核区室化、3D基因组拓扑、epigenetic landscape的bistability',
            competition: '① bivalent vs bistable异质群体定量区分；②两次胚胎重编程精确窗口与记忆崩溃计算；③ Hi-C TAD边界与表观修饰的因果方向性（相关性vs因果性）；④ hysteresis、bifurcation diagram与转移矩阵数值反演；⑤ Writer-Reader-Eraser时间尺度不匹配导致的记忆窗口崩溃；⑥ LLPS临界浓度证据要求；⑦ epigenotoxicity的三类可遗传性判断。'
        },
        peakDifficulty: '在scRNA-seq+scATAC-seq+Hi-C+live-cell imaging+时间分辨HDX-MS多模态冲突数据下，同时完成：转移矩阵构建、bistable势垒（kBT）计算、LLPS临界浓度映射、因果方向反演、异质性比例估计、epigenotoxicity分类，并输出参数可辨识性分析与置信区间。',
        forbiddenErrors: [
            '【bivalent幻觉】严禁默认同一核小体上H3K27me3与H3K4me3稳定共存；必须计算bistable异质细胞群体比例。',
            '【表观=跨代遗传误区】严禁把所有修饰都视为跨代可遗传；哺乳动物DNA甲基化存在两次精确重编程窗口（受精后与PGC），维持效率通常>95%。',
            '【因果倒置】不得把Hi-C TAD边界直接等同于CTCF/cohesin主动建立的因果结构，必须用时间序列+转移矩阵区分相关性与因果性。',
            '【确定性模型滥用】噪声显著时必须使用stochastic模型或转移矩阵，严禁直接用ODE替代Chemical Master Equation。',
            '【时间尺度脱钩】书写-擦除-读取窗口不匹配时记忆必然崩溃，严禁假设所有修饰同时稳态。',
            '【LLPS无证据泛化】必须同时满足临界浓度（0.1–10 μM）、FRAP、扩散系数，否则不得判定为相分离驱动。',
            '【epigenotoxicity混淆】必须区分有丝分裂、减数分裂、跨代遗传三类毒性，不可把所有环境诱导改变都称为可遗传。'
        ],
        parameterConstraints: {
            methylation_maintenance: '维持性甲基化效率通常>95%，从头甲基化速率远低于此；任何计算中<90%需强有力依据。',
            bistable_barrier: '活性-沉默势垒典型3–6 kBT；低于2 kBT易切换，高于8 kBT接近单稳态，必须显式计算。',
            phase_separation_critical: 'IDR驱动LLPS临界浓度0.1–10 μM，必须与细胞局部浓度匹配。',
            nucleosome_states: '完整epigenetic landscape模型通常考虑~144种nucleosome modification states。',
            reprogramming_window: '必须锁定受精后第一次全局去甲基化与PGC第二次重编程两个精确窗口进行积分。'
        },
        antiPatternStrategies: [
            '同时提供scMulti-omics、Hi-C、HDX-MS冲突数据，强制模型先构建转移矩阵、再判断bistable异质性比例、因果方向与记忆崩溃时间点。',
            '引入Writer-Reader-Eraser时间严重不匹配场景，要求计算hysteresis窗口崩溃概率与跨代维持效率。',
            '给出TAD边界下降但转录延迟的数据，强制同时输出bifurcation临界点、LLPS映射和参数可辨识性分析。',
            '要求闭合~144种nucleosome状态的转移矩阵计算，并判断参数是否落在bistable区间；若跳过数值积分直接定性则判错。',
            '使用同一知识点但更换对象（胚胎干细胞、肿瘤细胞、植物春化）和技术（CUT&Tag、FRAP、转移矩阵），避免重复叙事。'
        ]
    },

    // 遗传学
   'genetics-advanced': {
        name: '遗传学',
        keywords: ['等位基因', '连锁交换', '重组率', '染色体变异', '数量遗传', '母性影响', '表观遗传', '三点测交'],
        reasoningType: 'probability' as ReasoningType,
        // 精准化：强调非线性映射与多假设排他
        reasoningNote: '贝叶斯条件概率与遗传拓扑约束：系谱图分析的核心是基于贝叶斯定理的后验概率推断（排他性假设的概率修正）；连锁交换计算依赖于重组率（RF）与图距的非线性映射（如 Kosambi 映射函数对双交换的修正）以及四分子分析（Tetrad Analysis）中的着丝粒拓扑约束。',
        levels: {
            basic: '孟德尔定律，完全显性与隐性，伴性遗传基础',
            intermediate: '连锁与交换定律，重组率计算，单倍体与多倍体，伴性遗传变式',
            advanced: '三点测交定位，染色体图谱绘制，母性影响与细胞质遗传，数量性状遗传（多基因假说）',
            // 点名具体陷阱与出题分叉点
            competition: '不完全外显率（Penetrance）与表现度（Expressivity）在条件概率计算中的混淆陷阱；三点测交中因干扰系数（Coincidence）变动导致的双交换漏检修正；基因组印记（Imprinting）随性别世代传递的表观遗传重编程擦除机制；Hardy-Weinberg 平衡在有限群体（遗传漂变固定概率）及非对称选择压力下的定量非线性推导。'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '减数分裂后伴随异常有丝分裂行为的多基因不完全连锁、干扰系数非恒定状态下三点测交精确基因图距拓扑重构。',
        forbiddenErrors: [
            '【重组率超越物理天花板】任何常规非校正测交计算得出的表观重组率 r 绝对不可能超过 50%。',
            '【干扰系数盲目常数化】染色体互换的并发干扰系数受物理距离约束；严禁在未给出多重互换校正模型的前提下强行设定恒定独立干扰。',
            '【Haldane/Kosambi 函数混用】两种图距校正函数的适用假设截然不同（是否允许双交换干扰）；严禁不说明假设直接混用两套公式。',
        ],
        parameterConstraints: {
            map_distance_nonlinearity: '在没有多重互换校正模型的情况下，连锁标记之间的重组率与图距（cM）在长距离下呈高度非线性；禁止强行线性外推 50 cM 以上的图距。',
        },
        antiPatternStrategies: [
            '【非标准生物工质】彻底抛弃大模型语料库已高度污染的豌豆/果蝇/粗糙脉胞菌标准模型，改用裂殖酵母（S. pombe）减数分裂后有丝分裂的 8 孢子分析（分离比出现罕见的 6:2、5:3、3:1:3:1 离散分布）——AI 见到遗传题第一本能搜索 9:3:3:1 或 4:4，面对 8 孢子子囊会直接逻辑瘫痪。',
            '【离散多步不可逆承诺链】步骤 1 通过隐蔽模糊的后代计数判定遗传方式（常染色体显性 vs X 染色体非同源连锁），一旦判定将强制锁定两套完全不同的概率代数框架。步骤 2 代入 5 代家系计算发病率。步骤 3 引入全新反常交配比例制造硬冲突——AI 极不擅长全局清空推倒重来，会在错误框架内强行凑数。',
        ],
    },

    // 细胞生物学
    'cell-biology-advanced': {
        name: '细胞生物学',
        keywords: ['细胞骨架', '内膜系统', '核孔复合体', '细胞凋亡', '自噬', '细胞周期蛋白'],
        reasoningType: 'threshold' as ReasoningType,
        // 精准化：双稳态与非对称动力学
        reasoningNote: '双稳态开关与非对称动力学门控：细胞命运转换（周期相变、凋亡、自噬触发）由超敏感性（Ultrasensitivity）导致的双稳态开关控制；通过 Cyclin-CDK 正负反馈环的正向激活阈值与逆向去激活阈值差（迟滞性 Hysteresis）确保期相单向不可逆；空间上依赖于小 GTP 酶（如 Ran, Rab）梯度约束下的非对称转运。',
        levels: {
            basic: '细胞器识别，生物膜的流动镶嵌模型，物质跨膜运输',
            intermediate: '内膜系统协同（内质网-高尔基体-溶酶体），细胞骨架组成，细胞周期检验点（Checkpoints）',
            advanced: 'G蛋白偶联受体（GPCR）途径，程序性细胞死亡（Apoptosis）信号通路，核质转运机制',
            // 点名具体陷阱与出题分叉点
            competition: '纺锤体组装检查点（SAC）中“张力感应（Tension）”与“微管附着（Attachment）”的双重门控及解除分叉；程序性坏死（Necroptosis）与细胞凋亡在 Caspase-8 活性节点上的命运拨叉陷阱；核质转运中 Ran-GTP/GDP 浓度梯度在核孔复合体（NPC）饱和动力学下的转运速率定量推导；STED等超分辨显微成像中利用受激发射饱和耗尽机制突破衍射极限的物理边界。'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '在细胞周期、死亡命运、核质转运和膜交通多个双稳态开关之间，判定局部阈值、空间梯度和反馈回路如何共同决定细胞命运。',
        forbiddenErrors: [
            '【细胞器功能孤立化】不得只凭细胞器名称判断产物或通路强弱，必须说明膜交通、酶定位、底物来源和时间顺序。',
            '【凋亡坏死混同】凋亡、坏死性凋亡、焦亡和自噬性死亡的关键执行因子不同，不得用“细胞死亡”统称后直接推机制。',
            '【细胞周期检查点静态化】检查点不是固定刹车；其解除依赖张力、损伤修复、Cyclin-CDK活性和蛋白降解时序。',
        ],
        parameterConstraints: {
            npc_transport_direction: '核质转运方向由 Ran-GTP/Ran-GDP 梯度和载体状态决定；不能把核孔复合体当作无选择性孔洞。',
            spindle_checkpoint_release: 'SAC 解除必须同时考虑微管附着和张力状态；只满足其中一项时不得断言进入后期。',
            apoptosis_marker_order: '线粒体外膜通透化、caspase 激活、DNA 片段化等标志物有时序差异；单一晚期标志不能反推起始通路唯一性。',
        },
        generationChainSuggestions: [
            '按“局部结构/定位 → 分子开关 → 反馈或检查点 → 命运输出”组织题干，避免单一名词问答。',
            '多通路死亡题先锁定执行因子和抑制剂，再判断观测读数能否区分凋亡、坏死性凋亡或自噬。',
        ],
        diversityScaffolding: {
            objectVariants: ['核孔复合体', '纺锤体检查点', '线粒体凋亡通路', '内吞-回收通路', '细胞骨架极性系统'],
            measurementTools: ['活细胞成像', '流式细胞术', '免疫荧光', '超分辨显微', '蛋白降解报告系统'],
            dataModalities: ['定位图像', '细胞周期分布图', '时间序列荧光曲线', '蛋白剪切条带', '单细胞命运树'],
            perturbationTypes: ['微管药物', 'caspase抑制剂', '核输出抑制', '膜交通阻断', '机械张力改变'],
            questionStyles: ['命运分叉判断', '时序排序', '读出通道审计', '模型反证', '阈值判定'],
            antiRepeatRule: '同一细胞命运题重复时，必须更换细胞过程、检测读数和扰动方式。',
            scaffoldingTransitionRule: '不同细胞过程同题组合时必须通过共享定位、共同底物、反馈节点或力学状态闭合。',
        },
        antiPatternStrategies: [
            '【双标志物冲突】给出 caspase 活性和膜完整性相互矛盾的数据，要求判断死亡机制是否混合或读数时间窗错配。',
            '【核质转运方向陷阱】改变 Ran 梯度或载体结合状态，要求重新判断 cargo 定位，而不是套用“有 NLS 就进核”。',
            '【检查点解除陷阱】给出微管附着正常但张力不足的动粒，要求判断 SAC 是否仍维持。',
        ]
    },

    // 生态学与进化生物学
   'ecology-evolution': {
        name: '生态与进化生物学',
        keywords: ['种群密度', 'S型曲线', '生态位', '自然选择', '生殖隔离', '协同进化'],
        reasoningType: 'equilibrium' as ReasoningType,
        // 精准化：多动态平衡与非线性选择选择压力
        reasoningNote: '多维动态平衡与非线性选择压：生态层面，林德曼效率受限于级联能量退化（热力学第二定律），种群增长遵循时滞约束的非线性反馈，生态位由多维超体积（Hutchinsonian Hypervolume）边界约束；进化层面，自然选择、突变率与基因漂变协同作用，表现为等位基因频率在选择系数（s）作用下的非线性漂移。',
        levels: {
            basic: '生态系统成分，食物网，种间关系（竞争、捕食、寄生）',
            intermediate: '种群增长模型（J型、S型），初生/次生演替，现代生物进化理论，地理隔离',
            advanced: '生态位宽度与重叠，生态系统能流分析（林德曼定律计算），物种形成模式（异域、邻域、同域）',
            // 点名具体陷阱与出题分叉点
            competition: '亲缘选择中汉密尔顿法则（rB > C）在复杂近交家系、真社会性昆虫及利他行为演化中的定量推导陷阱；岛屿生物地理学模型中岛屿面积与孤立度对迁入/灭绝率曲线非线性交点（S*）变动的推演；分子进化中性理论中中性突变固定概率（P=1/2N）在选择性清除（Selective Sweep）连锁效应下的偏离异常解析。'
        }
    },

    // 分子生物学技术
    'molecular-techniques': {
        name: '分子生物学技术',
        keywords: ['载体', '限制酶', '连接酶', '电泳', '引物设计', '基因敲除', 'CRISPR'],
        reasoningType: 'constraint' as ReasoningType,
        // 精准化：热力学解链与拓扑约束
        reasoningNote: '立体化学与核酸热力学约束：分子操作严格受限于核酸链的 5\'→3\' 延伸极性、碱基互补配对的热力学解链温度（Tm 值拓扑约束）以及非特异性扩增的竞争动力学；从序列拓扑（如回文、发卡、重叠区）和多酶切位点组合推导动力学最优路径是核心考察方式。',
        levels: {
            basic: '基因工程三工具（剪刀、针线、运载体），转化与筛选',
            intermediate: 'PCR反应原理，质粒载体构建，凝胶电泳分析，cDNA文库与基因组文库',
            advanced: 'Sanger测序原理，荧光定量PCR（qPCR），Western Blot与Northern Blot，定点突变',
            // 点名具体陷阱与出题分叉点
            competition: 'CRISPR/Cas9 系统中 PAM 序列拓扑约束与 PAM-away（远端不匹配）脱靶效应的动力学分析；Sanger 测序中 dNTP/ddNTP 竞争比例对条带信号截断丰度的数学解析陷阱；qPCR 体系中引物二聚体竞争底物导致 Ct 值偏差的定量修正；单细胞 RNA-seq 库构建中 UMI（独特分子标识符）去重算法在扩增饱和状态下的计数失效分叉。'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '在引物热力学、酶切拓扑、测序误差和CRISPR脱靶动力学共同约束下，设计并审计可验证的分子操作流程。',
        forbiddenErrors: [
            '【序列方向错误】引物、插入片段、读长和开放阅读框必须保持 5′→3′ 方向一致；反向互补不能随意省略。',
            '【对照组缺失】分子实验结论必须有阴性、阳性或载体/空白对照；单一条带或单一Ct值不得直接证明机制。',
            '【CRISPR只看靶序列】Cas9编辑必须同时检查PAM、gRNA匹配、编辑窗口和潜在脱靶，不得只看目标20 nt。',
        ],
        parameterConstraints: {
            primer_tm_window: '常规PCR引物 Tm 通常应相近，差异过大或强发卡/二聚体会导致扩增偏差；题目需给出或允许判断Tm边界。',
            qpcr_efficiency_range: 'qPCR扩增效率理想范围约90%–110%；若效率严重偏离，不得用2^-ΔΔCt直接比较表达量。',
            crispr_pam_lock: 'SpCas9 经典PAM为NGG；无PAM或PAM方向错误时不得判定可切割，除非题干声明变体Cas系统。',
        },
        generationChainSuggestions: [
            '按“序列方向/位点 → 反应条件 → 检测读数 → 对照解释”组织实验题，强制检查每一步是否可验证。',
            '涉及编辑或克隆时，先判断拓扑方向和读框，再讨论效率、脱靶或筛选策略。',
        ],
        diversityScaffolding: {
            objectVariants: ['质粒克隆', 'qPCR表达检测', 'CRISPR编辑', 'Sanger测序', '单细胞文库构建'],
            measurementTools: ['凝胶电泳', '荧光定量PCR', '测序峰图', '限制性酶切', '流式分选'],
            dataModalities: ['条带图', 'Ct表', '测序峰图', '序列比对', '编辑效率矩阵'],
            perturbationTypes: ['引物突变', 'PAM改变', '酶切位点缺失', '模板污染', '扩增循环数改变'],
            questionStyles: ['实验设计', '失败原因定位', '序列方向判断', '对照组审计', '读数定量修正'],
            antiRepeatRule: '同一技术重复出题时必须更换实验平台、错误来源和检测读数，避免固定PCR/酶切模板。',
            scaffoldingTransitionRule: '不同技术组合必须通过同一分子样本或验证链条闭合，禁止把PCR、测序、CRISPR无因果并列。',
        },
        antiPatternStrategies: [
            '【方向性陷阱】给出正反链和载体多克隆位点，要求判断引物或插入片段是否保持读框。',
            '【读数假阳性】给出正确大小条带但缺少测序确认，要求判断是否可能为非特异扩增或空载体。',
            '【效率校正陷阱】给出qPCR效率偏离数据，要求先校正效率再比较表达量。',
        ]
    },

    // 生物信息学
    'bioinformatics': {
        name: '生物信息学',
        keywords: ['序列比对', '进化树', '蛋白质结构预测', '转录组', '差异表达', '数据库', 'BLAST'],
        reasoningType: 'constraint' as ReasoningType,
        reasoningNote: '约束逻辑：序列比对依赖碱基互补的结构约束；系统发育树的构建基于序列差异的最简约假设；蛋白质功能预测依赖序列-结构-功能的约束关系。',
        levels: {
            basic: '查阅NCBI数据库，理解DNA/蛋白质序列格式（FASTA）',
            intermediate: '使用BLAST进行同源性检索，理解得分（E-value）含义',
            advanced: '构建系统发育树（邻接法/最大似然法），蛋白质二、三级结构预测模型',
            competition: '高通量测序数据质控（FastQC），多组学数据整合（WGCNA），分子对接模拟'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '在高通量噪声、批次效应、同源性偏置和多重检验约束下，将序列、结构、表达和网络证据整合为可验证的生物学结论。',
        forbiddenErrors: [
            '【E-value当相似度】BLAST E-value 是随机命中期望数，不是序列相似百分比；数据库大小改变会影响解释。',
            '【多重检验缺失】组学差异分析必须控制FDR或等价多重校正；不得只凭未校正p值筛基因。',
            '【训练测试泄漏】机器学习预测不得在同源序列、同一批次或重复样本泄漏到测试集时声称泛化性能。',
        ],
        parameterConstraints: {
            blast_evalue_context: 'E-value解释必须绑定数据库规模、查询长度和得分矩阵；跨数据库比较需重新校准。',
            rnaseq_fdr_threshold: 'RNA-seq差异基因筛选通常需同时报告log2FC和FDR；只给fold change不足以说明显著性。',
            phylogeny_model_scope: 'NJ、ML、Bayesian树的假设不同；长枝吸引、外群选择和替换模型错配会改变拓扑结论。',
        },
        generationChainSuggestions: [
            '按“数据质控 → 标准化/校正 → 统计模型 → 生物解释 → 独立验证”组织题干。',
            '涉及机器学习或结构预测时，先检查训练数据、同源性泄漏和置信度指标，再评价功能结论。',
        ],
        diversityScaffolding: {
            objectVariants: ['转录组差异分析', 'BLAST同源检索', '系统发育树', '蛋白结构预测', '共表达网络'],
            measurementTools: ['FastQC', 'BLAST', 'DESeq2', 'MAFFT/IQ-TREE', 'AlphaFold/对接工具'],
            dataModalities: ['FASTA序列', 'counts矩阵', '火山图', '系统树', '置信度/PAE矩阵'],
            perturbationTypes: ['批次效应', '数据库规模变化', '同源序列泄漏', '低覆盖样本', '替换模型改变'],
            questionStyles: ['统计解释', '流程审计', '模型选择', '假阳性排查', '多证据整合'],
            antiRepeatRule: '同一生信主题重复时必须更换数据类型、算法假设和验证方式。',
            scaffoldingTransitionRule: '序列、表达、结构和网络证据组合时必须说明样本、同源性或功能机制的连接，禁止直接平均不同证据。',
        },
        antiPatternStrategies: [
            '【显著性陷阱】给出大量p<0.05但FDR不显著基因，要求判断是否能下功能结论。',
            '【同源泄漏陷阱】训练集和测试集共享近缘同源蛋白，要求重新评估模型泛化。',
            '【树拓扑误读】给出bootstrap低支持率分支，要求判断能否据此推断进化事件。',
        ]
    },

    // 神经生物学
    'neurobiology': {
        name: '系统神经生物学与突触电生理动力学',
        keywords: [
            '动作电位', '静息膜电位', '阈电位', 'Hodgkin-Huxley模型', '电缆方程', '长度常数', '时间常数',
            '突触后电位', 'EPSP', 'IPSP', '翻转电位', '分流抑制', '神经递质', '谷氨酸', 'GABA',
            'AMPA受体', 'NMDA受体', 'GABAA受体', '电压门控钠通道', '钾通道', '钙通道',
            '突触可塑性', '长时程增强', 'LTP', '长时程抑制', 'LTD', 'STDP', 'AIS', '光遗传学'
        ],
        reasoningType: 'threshold' as ReasoningType,
        // 精准化：电缆方程衰减、门控动力学与翻转电位漂移三重分叉
        reasoningNote: '空间阻抗积分 × 门控时间尺度 × 电化学反转分叉：轴突始段（AIS）对树突多源突触输入的代数加和受限于膜阻抗与树突形态引起的电缆方程衰减；动作电位触发并非单纯越阈，而是取决于 Na⁺/K⁺/Ca²⁺ 通道在电压-时间平面上的激活/失活门控轨迹；与此同时，局部离子流可重塑胞内外离子浓度与翻转电位（Reversal Potential），使同一递质在不同微环境下从抑制翻转为去极化驱动。',
        levels: {
            basic: '神经元极化结构、静息电位与动作电位的基本产生机制，钠钾泵与选择性离子通道的作用。',
            intermediate: '突触传递全流程（囊泡释放、受体结合、离子通透性改变），AMPA/NMDA 与 GABAA 受体介导的兴奋性/抑制性突触后电位比较。',
            advanced: '电缆方程下树突输入的时空整合、AIS 阈值决定、突触可塑性（LTP/LTD、STDP）与学习记忆的电生理基础。',
            // 点名具体陷阱与出题分叉点
            competition: '① 突触后电位（EPSP/IPSP）的翻转电位与静息/阈值电位相对位置决定的“分流抑制（Shunting Inhibition）”命运分叉陷阱：若 E_Cl 逼近甚至高于静息膜电位，GABA 开放 Cl⁻ 通道将不再等于单纯超极化，而是转化为降低输入阻抗、压缩兴奋输入增益甚至直接诱发去极化；② NMDA 受体 Mg²⁺ 阻塞解除与 STDP 时间窗耦合陷阱：前后脉冲时序差（Δt）只有在局部去极化足以解除 Mg²⁺ 堵塞时才会转化为 Ca²⁺ 内流与 LTP/LTD 分叉，不能把“前先后后必 LTP”机械线性化；③ 静息电位定量计算中 Goldman 方程在温度突变及 Na-K 泵生电效应干扰下的精确推导；④ 光遗传学中 ChR2（阳离子通道）与 NpHR（氯泵）在持续高频刺激下，因细胞内离子蓄积、驱动力耗竭与翻转电位漂移导致抑制失效乃至“反弹式放电”的实验异常解析。'
        },
        modules: {
            'electrophysiology-dynamics': {
                name: '突触电生理动力学',
                topicRefs: ['hodgkin-huxley-model'],
                keywords: ['动作电位', 'Hodgkin-Huxley模型', 'HH模型', '电压门控通道', '电流钳', '电压钳', '电缆方程', '通道噪声', '分岔分析', 'Markov通道模型'],
                reasoningNote: '突触电生理动力学模块覆盖动作电位、膜电位、门控变量、电缆衰减、突触输入整合和 HH 模型。涉及 m/h/n 门控变量、Na⁺/K⁺ 电流、数值积分、通道噪声或分岔分析时，应调用 hodgkin-huxley-model 专题规则。',
                subtopics: {
                    'action-potential': {
                        name: '动作电位',
                        status: 'inline-summary',
                        note: '处理静息膜电位、阈值、去极化、复极化和不应期。'
                    },
                    'synaptic-electrophysiology': {
                        name: '突触电生理',
                        status: 'inline-summary',
                        note: '处理 EPSP/IPSP、NMDA Mg²⁺ 阻塞、GABAA 翻转电位和 STDP。'
                    },
                    'hodgkin-huxley-model': {
                        name: 'Hodgkin-Huxley模型',
                        status: 'referenced-topic',
                        ref: 'hodgkin-huxley-model',
                        note: '完整公式与判错规则维护在顶层 hodgkin-huxley-model 条目中。'
                    }
                }
            }
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '非均匀局部去极化下 Na⁺ 通道 h 门预先锁死引发的不应期拓扑分叉，叠加树突电缆衰减与 Cl⁻ 翻转电位漂移后，对“抑制性输入究竟是削弱、分流还是改写为去极化驱动”的定量判定。',
        forbiddenErrors: [
            '【全或无定律线性化滥用】动作电位"全或无"定律仅在标准静息电位与完整可激发通道储备下成立；持续微弱去极化使 h 门部分锁死后，高频刺激可引发幅值衰减、Alternans 甚至混沌传导，严禁强行套用幅值恒定模型。',
            '【GABA=超极化一元化误区】GABA 介导 Cl⁻ 通道开放，但效应取决于 E_Cl 与当前 V_m 及阈值电位的相对位置；若 E_Cl 高于 V_m（如未成熟神经元或局部 Cl⁻ 累积时），GABA 可引发去极化或仅形成分流抑制，严禁直接断言"GABA 必然抑制"。',
            '【NMDA 受体静态导通误判】NMDA 受体并非只要谷氨酸结合就线性开放；Mg²⁺ 阻塞解除依赖膜电位，若题目未先建立足够去极化却直接给出大 Ca²⁺ 内流，属于机制穿帮。',
            '【Goldman 方程温度不变假设】Goldman 方程中离子通透性比值与 RT/F 项均受温度影响；题目如引入温度变量却不修正相关参数，属于严重假设穿帮。',
            '【GHK 阴离子项顺序错置】涉及 Cl⁻ 的 GHK 精确计算时，阴离子浓度项必须按反向比值进入；若仍按阳离子顺序代入，将导致静息膜电位与翻转电位符号级错误。',
            '【STDP 时序符号偷换】凡题目定义 Δt = t_post - t_pre，就不得在推理中改写为 t_pre - t_post；符号偷换会把 LTP/LTD 判定整体翻转。',
            '【有限电缆指数近似滥用】当树突长度与长度常数 λ 同量级时，严禁把有限电缆封端/开端问题直接按无限电缆 exp(-x/λ) 处理；边界条件错判属于模型级硬伤。',
        ],
        parameterConstraints: {
            reversal_potential_range: '典型快兴奋性突触 EPSP 翻转电位约在 0 mV 附近，成熟神经元 GABAA / Cl⁻ 相关 IPSP 翻转电位常在 −70 至 −75 mV；若设定为显著高于 0 mV 或远低于 −90 mV，需给出明确离子梯度依据。',
            resting_membrane_potential: '典型哺乳动物中枢神经元静息膜电位多在 −65 至 −75 mV；若题目将“静息”状态长期设在 −40 mV 附近却不解释持续去极化来源，属于参数穿帮。',
            action_potential_duration: '典型哺乳动物神经元动作电位持续时间约 1–2 ms；若设定为数十毫秒以上需说明细胞类型或离子通道重塑背景，禁止与心肌动作电位时程混用。',
            intracellular_calcium_rest: '静息胞内游离 Ca²⁺ 常在约 50–100 nM；若无强刺激却给出 μM 乃至 mM 级稳态值，将直接改写突触释放与可塑性判定，属于严重生理穿帮。',
            nmda_block_window: 'NMDA 受体在 −70 mV 附近通常仍受显著 Mg²⁺ 阻塞，在 −50 mV 附近阻塞才明显减弱；若题目在静息附近直接赋予大 NMDA 电流占比，需提供明确去极化依据。',
            stdp_near_zero_window: 'STDP 的方向判定在 Δt 接近 0 ms 时最敏感；若题目把 Δt 设在 ±5 ms 量级，必须保证符号定义唯一且题干中不允许存在两种等价时序解释。',
            cable_boundary_regime: '当树突长度 L 与长度常数 λ 同量级（尤其 L≈1–3λ）时，有限长度边界条件不可忽略；只有在 L≫λ 时才可近似为无限电缆。',
            opsin_tau_scale: '不同 opsin 的动力学时间常数不可混用：ChR2 的 τ_off 常为 10–20 ms 量级，Chrimson 常显著更慢，eNpHR 为泵型抑制器；若涉及开放比例计算，必须明确给定具体 opsin 及其时间常数。',
        },
        generationChainSuggestions: [
            '先给局部离子浓度与温度，要求计算含 Cl⁻ 的 GHK 静息膜电位；再给 GABAA 激活后的 E_Cl，判断主导效应是超极化、分流抑制还是去极化；最后结合给定 Δt 判断该次突触配对更倾向于 LTP 还是 LTD。',
            '先给树突长度 L 与长度常数 λ，要求判断应采用无限电缆还是有限封端模型并计算 AIS 实际去极化；再结合该去极化判断 NMDA 的 Mg²⁺ 阻塞是否足以解除；最后判定 NMDA 电流是否足以改写总 EPSC 主导成分。',
            '先给具体 opsin 类型与 τ_on/τ_off 及光脉冲宽度，计算有效开放比例；再叠加局部高钾或 Cl⁻ 累积条件，判断光刺激后的净膜电位变化方向；最后分析是否会出现抑制失效或反弹式放电。',
            '先给配对脉冲时序、树突位置与局部输入阻抗，要求判断 EPSP 传到 AIS 后是否仍足以解除 NMDA 的 Mg²⁺ 阻塞；再结合 Ca²⁺ 内流窗口决定塑性方向，最后解释为何同一递质在不同空间位置得出相反学习结果。',
            '先给发育阶段或转运蛋白扰动条件下的胞内 Cl⁻ 浓度，要求重算 E_Cl；再结合同一细胞在不同膜电位起点下的 GABAA 读出，判断其是超极化、分流抑制、去极化但不放电还是直接促发放电；最后要求反证“GABA 必然抑制”的模板结论。',
        ],
        diversityScaffolding: {
            objectVariants: [
                '海马 CA1 锥体神经元', '皮层 L2/3 锥体神经元', '小脑浦肯野细胞', '嗅球颗粒细胞',
                '未成熟神经元', '抑制性中间神经元', '轴突始段（AIS）', '树突棘-树突干复合结构'
            ],
            measurementTools: [
                'patch-clamp 全细胞记录', '电流钳/电压钳', '双光子 Ca²⁺ 成像', '单通道记录',
                '动态钳（dynamic clamp）', '局部谷氨酸 uncaging', '光遗传刺激', '细胞内 Cl⁻ 荧光探针'
            ],
            dataModalities: [
                'I–V 曲线', 'EPSC/IPSC 时间轨迹', '膜电位时间序列', '开放概率-电压曲线',
                'spike raster', '配对脉冲响应比', 'Ca²⁺ 瞬变幅度序列', '局部离子浓度变化表'
            ],
            perturbationTypes: [
                '外液 Cl⁻ 改变', '局部高钾', '温度扰动', 'Mg²⁺ 浓度改变', '配对脉冲时序偏移',
                '光脉冲宽度变化', '转运蛋白抑制', '树突输入位置迁移', '持续弱去极化预处理'
            ],
            questionStyles: [
                '参数精算', '模型判别', '方向判断', '边界条件选择',
                '反证模板结论', '多模态一致性校验', '阈值分叉判断', '误差来源回溯'
            ],
            antiRepeatRule: '同一神经知识点重复出题时，必须至少更换“细胞类型、记录手段、数据形式、扰动条件、问题目标”中的两项；不得直接复用 antiPatternStrategies 或 generationChainSuggestions 的完整叙事链。',
            scaffoldingTransitionRule: '禁止把电生理、光遗传、成像或发育条件机械拼接；若同题组合来自不同维度池，必须通过“离子梯度→翻转电位→局部膜电位→通道门控→功能读出”或“树突衰减→AIS 阈值→Ca²⁺ 内流→可塑性结果”等闭合因果链完成机理过渡。',
        },
        antiPatternStrategies: [
            '【S1｜模型先判后算】第一步先强制判断该题应使用哪一类模型或边界条件：GHK 中阴离子项是否反向、STDP 的 Δt 符号定义、NMDA 的 Mg²⁺ 阻塞是否可忽略、树突是无限电缆还是有限封端；禁止一上来直接代公式。',
            '【S2｜临界区近邻投毒】优先把关键参数设置在最易诱发方向误判的边界附近：E_Cl≈V_rest、Δt≈0（如 ±5 ms）、V_m 位于 −70 至 −50 mV、L≈2λ、光脉冲宽度与 τ_off 同量级；AI 若套模板会直接反判。',
            '【S3｜三段式不可逆承诺链】题目至少包含“先选模型/边界条件 → 再做精确数值计算 → 最后做机制方向判断”三段串联；若第一段判错，后续即使算术正确也应导向错误结论。',
            '【S4｜去模板化双重翻转】避免“GABA=抑制”“去极化=兴奋”“pre before post 必然 LTP”这类教材模板，改用局部 Cl⁻ 累积、亚阈值去极化、h 门预失活、有限树突衰减、opsin 参数切换等条件，迫使做题者先验证机制适用域再作答。',
            '【S5｜时空积分拆链】强制把“局部突触输入→树突电缆衰减→AIS 实际去极化→NMDA/Ca²⁺ 门控→是否放电或发生塑性”拆成串行链条；任一步若直接跳到系统结论，立即触发错误级联。',
            '【S6｜跨模态一致性校验】同题若同时给 patch-clamp、Ca²⁺ 成像、离子浓度与光刺激参数，必须检查翻转电位、阻塞方向、Ca²⁺ 峰值和最终功能读出是否在同一机制链上闭合；任一模态冲突应触发回溯而非强行平均。',
            '【S7｜发育/环境切换反模板】利用未成熟神经元、KCC2/NKCC1 扰动、局部高钾或持续光刺激造成的离子环境重排，让同一受体在不同背景下呈现相反效应，迫使解题者先重算 E_ion 再谈兴奋/抑制。',
            '【S8｜开放组合与去重复】以上策略只提供约束方向，不得整句复现为题干；允许围绕新细胞类型、新记录模态、新扰动条件和新功能读出自由组合，但必须遵守 forbiddenErrors、parameterConstraints 与 diversityScaffolding，并保证因果链闭合。',
        ],
    },

    // 免疫学
    'immunology': {
        name: '免疫学',
        keywords: ['抗体', 'T细胞', 'B细胞', '细胞因子', 'MHC', '单克隆抗体'],
        reasoningType: 'selection' as ReasoningType,
        // 精准化：多维亲和力过滤
        reasoningNote: '多维亲和力过滤与差异克隆扩增：免疫识别本质是通过 V(D)J 重组生成的超大随机受体库（Repertoire），通过中枢负选（亲和力过高则凋亡）和外周正选（适当亲和力存活）的双向阈值过滤；外周激活遵循“双信号+细胞因子微环境”的三维拓扑约束，构成逻辑门控，防止免疫误伤。',
        levels: {
            basic: '非特异性与特异性免疫，抗原识别，抗体基本结构',
            intermediate: '体液免疫与细胞免疫的协同，MHC分子提呈抗原，补体系统',
            advanced: '免疫多样性产生的机制（V(D)J重组），细胞因子风暴，自身免疫病诱因',
            // 点名具体陷阱与出题分叉点
            competition: 'MHC 限制性（MHC Restriction）导致的 T 细胞无法识别非本源 MHC 提呈抗原的交叉反应推理；B 细胞生发中心（GC）内体细胞高频突变（SHM）导致的亲和力成熟达尔文选择压定量计算；CAR-T 细胞设计中因单链抗体（scFv）亲和力过高触发的“靶向肿瘤外毒性（On-target off-tumor）”与耗竭（Exhaustion）分叉陷阱。'
        },
        generationChainSuggestions: [
            '按“抗原呈递 → 共刺激/细胞因子 → 克隆选择 → 效应读出/记忆形成”组织题干，要求逐层判断门控是否满足。',
            '涉及抗体或CAR-T时，先锁定亲和力、抗原密度和组织表达谱，再判断疗效、耗竭或脱靶毒性。',
        ],
        diversityScaffolding: {
            objectVariants: ['初始T细胞', 'B细胞生发中心', '树突状细胞', 'CAR-T细胞', '肿瘤免疫微环境'],
            measurementTools: ['流式细胞术', 'ELISA', '单细胞TCR/BCR测序', '细胞毒杀实验', '细胞因子谱检测'],
            dataModalities: ['MHC-肽亲和力表', '克隆扩增曲线', '细胞因子热图', '流式门控图', '肿瘤杀伤时间序列'],
            perturbationTypes: ['共刺激缺失', '抗原密度变化', '检查点阻断', '细胞因子环境改变', 'scFv亲和力调节'],
            questionStyles: ['门控判断', '克隆选择推理', '脱靶风险评估', '免疫逃逸反证', '多读出一致性校验'],
            antiRepeatRule: '同一免疫主题重复出题时，必须更换细胞类型、抗原呈递背景和效应读出。',
            scaffoldingTransitionRule: '先天免疫、适应性免疫和肿瘤免疫同题组合时，必须通过抗原、细胞因子、共刺激或组织定位形成闭合链。',
        }
    },

    // 生物工程学
   'bioengineering': {
        name: '生物工程学与生物过程工程',
        keywords: [
            // ── 原有核心词 ──
            '生物工程', '发酵工程', '细胞工程', '蛋白质工程', '代谢工程', '生物反应器',
            '质量衡算', '能量平衡', '比生长速率', '维持系数', '传质系数', 'kLa', 'CSTR',
            '溶氧控制', 'OTR', 'OUR', '剪切力敏感性', '下游纯化截留', '比表面积约束',
            '非牛顿流体', '假塑性', '流变指数', '表观粘度',
            // ── v3 新增 ──
            '多尺度建模', 'GEM', 'dFBA', 'Flux Balance Analysis', 'FBA', '13C-MFA', '胞内通量重构',
            '软测量', 'Soft Sensor', '模型预测控制', 'MPC', 'PAT', 'digital twin',
            '转录组', '蛋白质组', '代谢组', '多组学融合', '动态调控网络',
            'DBTL', 'Design-Build-Test-Learn', 'CRISPRi', 'CRISPRa', '代谢负担', '质粒拷贝数',
            '细胞异质性', 'Phenotypic Heterogeneity', '单细胞代谢状态', '亚群体分化',
            'Scale-up', 'Scale-down', '混合时间', 'Kolmogorov涡尺度', '底物脉冲暴露',
            'Hybrid Modeling', '机理-数据融合模型', 'Domain Shift',
            // ── v3.1 细胞异质性 × 13C-MFA 深度交叉扩展 ──
            '同位素示踪流平衡', '亚群代谢流拆分', 'MFA守恒方程组', '同位素富集度', '天然丰度校正',
            'M+3同位素体', 'Cleavage Mass Isotopomer', '还原性羧化', '逆向TCA循环', '单碳代谢通量',
            '胞内隐匿性碳源', '自噬流干扰', 'Metabolic Cross-feeding', '代谢交叉喂养', '代谢共生体系',
            '逆向巴斯德效应', '线粒体丙酮酸载体', 'MPC限制', '手性代谢物分流', '细胞状态转分化动力学',
            '拟时间轴积分通量', '微流控片上扩散梯度', 'FLIM-NADH荧光寿命成像', '单细胞CITE-seq', '门控估计误差',
        ],
        reasoningType: 'conservation' as ReasoningType,
        reasoningNote: '多相流质量/能量非线性偶联守恒 × 活细胞动态状态耦合逻辑：微生物增长、底物消耗与副产物积累遵循严格的瞬态物料衡算与氧化还原电子平衡；宏观传质（气-液-固三相）速率受限于边界流体动力学方程，并作为非线性约束强制锁死微观细胞动力学行为。【核心升级——细胞状态动态变量门控】：细胞并非恒定动力学粒子，而是会随局部氧限制、剪切应激、底物脉冲、代谢负担动态切换代谢状态的自适应系统。同一反应器内不同空间区域的细胞可处于完全不同的代谢相位（高呼吸态、溢流代谢态、应激维持态、凋亡前态）；宏观平均参数（平均 μ、平均 OUR）不对应任何真实单细胞状态——凡默认"平均参数 = 单细胞行为"的模型均可能在工业放大中灾难性失效。【核心升级2——微观同位素流与多区域群体平衡的破缺】：在非均相或分化体系中，$^{13}\text{C-MFA}$ 的经典均相流平衡假设可能失效。系统中的标记特征值（如 $M+3$ 丰度、特定断裂同位素分数 $q$）在宏观混合池中呈非线性叠加。各亚群真实通量不仅受转录组/蛋白组上限约束（如 G6PD、LDHA、MPC），还受胞内隐匿碳源（应激自噬降解未标记糖原）稀释及亚群间乳酸/氨基酸交叉喂养（Cross-feeding）干扰。因此，若不做亚群比例归一化与历史应激校正，通量重构将产生系统性偏差。【计算引导】：提供连续搅拌釜反应器（CSTR）与补料分批（Fed-batch）体系中，基于 Monod/Haldane/Pirt 方程拓展的菌体/底物/产物非稳态动力学耦合微分方程组，引入体积氧传质系数 $k_L a \\cdot (C^* - C_L)$ 与细胞比耗氧率（OUR）的动态平衡核算，用以给微观菌株改造的宏观工业放大设置绝对的物理传质边界与产物分配分叉。',
        levels: {
            basic: '传统发酵工艺流路，微生物工业菌种的分离与斜面保存，高压蒸汽灭菌 $\\nabla$ 值（灭菌值/Del值）的常规代数计算。',
            intermediate: '理想 CSTR 反应器在稳态下的稀释率（$D$）与细胞浓度维持平衡计算，恒化器（Chemostat）的"洗出（Washout）"临界点判定，基于常规 Monod 方程的表观比生长速率求解。',
            advanced: '动物细胞悬浮培养的剪切力耐受物理边界，代谢工程中通过基因敲除改变代谢通量平衡矩阵（FMA），高密度发酵中热量移出（冷却夹套面积/比表面积约束）的能量衡算天花板。',
            competition: '① 剪切力-传质耦合分叉：大规模反应器中叶轮搅拌提升 kLa 的同时引发局部剪切暴增，触发 CHO/动物细胞 PIEZO1 机械敏感通道开放、Ca²⁺ 内流与凋亡级联——提高搅拌不一定提高产率，AI 默认"搅拌越强越好"必然失误；② 传质时空滞后与溢流代谢分叉：高黏度发酵液中混合时间 τ_mix 远大于细胞代谢响应时间 τ_metabolism，形成"高溶氧/低糖区"与"零溶氧/高糖区"并存的时空死区，触发巴斯德效应局部逆转与乙酸/乳酸溢流积累，pH 稳态崩溃；③ Fed-batch 动态维持系数分叉：长期饥饿诱导期细胞自噬启动，维持系数 m_s 从常数变为底物浓度的非线性反馈函数，恒定 m_s 假设下的质量衡算矩阵在临界稀释率处发生断崖式分叉；④ 下游超滤凝胶层阻抗突变：浓差极化引起凝胶层阻力随通量指数增长，微量高分子杂质触发全系统急性反压，线性过滤方程在此失效；⑤ 单细胞异质性掩盖亚群体崩溃（v3）：高密度发酵后期群体平均 OUR 和 OD600 显示系统稳定，但单细胞层面已分化出高 ROS 应激亚群；AI 若默认"平均参数代表真实细胞状态"，将持续提高补料速率直至触发大规模凋亡；⑥ Scale-down 代谢历史失真（v3）：Scale-down 装置平均 DO 曲线与工业反应器匹配，但细胞经历的局部剪切谱与底物脉冲历史完全不同，代谢历史依赖（Hysteresis）导致放大后副产物暴增；⑦ DBTL 通路代谢负担非单调效应（v3）：异源通路表达量与目标产物产率呈非单调关系——低表达区受产量限制，高表达区受核糖体竞争/ATP 枯竭/NADPH 失衡导致的代谢负担崩溃限制，存在隐式最优表达窗口，AI 默认"表达越高产量越高"必然过冲；⑧ 数据驱动控制器 Domain Shift 失效（v3）：基于历史批次训练的 MPC/强化学习控制器在菌株代谢漂移或培养基批次变动后遭遇分布外状态，仍按旧策略执行高补料速率导致乙酸溢流——生物系统不存在稳定静态分布，训练集最优策略不保证跨批次迁移；⑨ 胞内隐匿自噬流导致同位素稀释：亚群 A 启动自噬后释放 M+0 糖原碳源，稀释外源 [U-13C6] 葡萄糖标记，若仍假设“丙酮酸完全来自外源葡萄糖”，会把 M+3 下降误判为糖酵解减速；⑩ 交叉喂养下拓扑闭合失效：A 外排乳酸、B 逆向摄取并入 TCA，导致全罐乳酸净通量=外排-摄取，若假设乳酸单向外排则碳流方程不闭合；⑪ 拟时间积分通量偏差：分化窗口内亚群占比 φ(t) 非线性漂移，终点法静态加权（Σ φ_i v_i）将显著偏离真实积分通量；⑫ 代谢迟滞与历史锁定：分选复测样本若经历低氧/高剪切历史，其通量参数（如 q）呈路径依赖，直接代入原位方程会触发级联失配。',
        },
        peakDifficulty: '活细胞代谢状态在非均匀反应器环境中形成跨尺度动态反馈：局部传质限制改变细胞代谢状态，代谢状态反过来重塑体系流变、氧需求与副产物分布，最终导致宏观动力学参数本身失去稳定定义——在唯一闭合动力学约束下，非牛顿流体-传质-剪切-细胞状态四重非线性耦合的动态分叉与正确稳态判断。',
        forbiddenErrors: [
            // ── 原有物理约束硬伤 ──
            '【全局理想混合滥用】大规模（>10 m³）反应器中宏观混合时间远大于微观细胞级代谢响应时间，严禁直接使用无空间梯度的均一 ODE 替代时空偏微分方程。',
            '【氧溶解度物理穿帮】水相发酵液在常规常压（37°C）下饱和溶氧浓度极低（通常 0.2–0.3 mM），严禁编造超过此物理溶解度极限的基态溶氧值。',
            '【维持能量守恒脱钩】细胞在极低稀释率下维持系数 m_s 占总消耗比重剧烈飙升；严禁出现维持能量消耗为零的理想物料恒等式。',
            // ── 原有 critical 闭合约束 ──
            '【氧消耗方程定义歧义（critical）】凡题目同时涉及"生长耗氧"与"维持耗氧"两种可能，必须在题干中用唯一公式显式声明 OUR 的组成（如 OUR = Y_O2·μ·X 或 OUR = (μ/Y_XO + m_O)·X），禁止留下歧义——此歧义直接导致解的存在性不唯一，属 critical 硬伤。',
            '【多路通量分配优先级未声明（critical）】当底物需在维持、生长、产物合成三路或更多路径间分配时，必须在题干中明确给出唯一的优先级顺序或分配规则，禁止让做题者自行假设——属 critical 闭合性违规。',
            '【氧限制稳态近似隐含条件外显（critical）】"氧限制时液相溶氧 C_L ≈ 0"属于需要学生通过比较 OUR 与 OTR 自行推断的隐含约束，严禁以任何形式直接写入题干——违反此规定属 critical depthIssue。',
            // ── v3 新增：细胞状态类硬伤 ──
            '【固定动力学参数滥用（v3）】严禁默认 μ_max、Y_X/S、m_s 等参数在全过程恒定；细胞在氧限制、剪切应激或代谢负担下会发生状态切换，若题目默认参数恒定必须显式声明适用阶段。',
            '【群体平均值替代单细胞行为（v3）】严禁直接用平均 OUR、平均 ATP 替代真实单细胞代谢状态；系统存在空间异质性或亚群体分化时，基于平均参数的控制决策将产生系统性失效。',
            '【AI 控制器泛化默认成立（v3）】严禁默认基于历史批次训练的机器学习控制器可直接迁移至新菌株、新培养基或新放大尺度；凡涉及数据驱动控制，必须声明训练域与适用边界。',
            '【通路表达越高产量越高（v3）】严禁构造"无限提高异源通路表达量而宿主生长完全不受影响"的理想化参数体系；必须给出表达量-产率关系的非单调性或显式声明忽略代谢负担的理由。',
            '【示踪产物同位素骨架不配平】严禁在 [1,2-13C2] 葡萄糖示踪模型中编造产生 M+3 的直接糖酵解乳酸（1,2 位标记断裂后最多产生 M+2 乳酸），或在 [U-13C6] 葡萄糖完全糖酵解中编造违反碳骨架断裂化学计量学的标记产物。',
            '【同位素混合分母非同质加权】严禁在两亚群总标记基数不同（如分母 F_M+1 + F_M+2 不可比）时直接对比例做线性加权；必须先还原为绝对流速并转化为绝对碳通量，再进行混合池守恒核算。',
            '【忽略天然同位素丰度背景】在未声明“数据已进行天然同位素校正”前，严禁将质谱粗丰度直接当作纯示踪贡献用于高阶计算。',
        ],
        parameterConstraints: {
            oxygen_solubility: '标准大气压 37°C 纯水中氧气亨利常数约 1.06×10⁻³ M/atm；即使纯氧环境下液相最大溶氧上限也被物理锁死，不允许违背此溶解极限的参数设定。',
            shear_stress_threshold: 'CHO 等哺乳动物细胞的机械剪切力损伤临界应变通常在 1.0–5.0 Pa；局部剪切张量计算值必须以此为生死分叉边界。',
            kla_ceiling: '工业反应器空气-水体系的最高常态 k_L a 很难突破 0.1–0.2 s⁻¹（即 360–720 h⁻¹）；捏造数个数量级的传质系数属于物理硬伤。',
            our_equation_must_be_unique: '同一道题中 OUR 方程有且只能有一种定义形式；题干前后隐含两种不同 OUR 计算公式，判为 critical 歧义。',
            flux_allocation_rule_must_be_stated: '凡底物需在≥2条代谢去路间分配时，题干必须以唯一公式或明确优先级声明分配规则；缺少此声明且存在两种以上合理分配方案时，判为 critical 闭合性违规。',
            cell_state_transition_timescale: '细胞代谢状态切换（呼吸态→溢流态→应激态）通常存在分钟至小时级时间尺度，不允许出现"环境突变后细胞参数瞬时完成稳态重构"的理想化设定。',
            empirical_parameters_must_be_given: '题干中出现的所有经验关联式参数（如 kLa 经验式的 a/b 系数、幂律流变的 K/n、Haldane 抑制常数 K_i）必须在题干中显式给出数值；禁止要求学生自行查手册或凭经验估计——经验参数可以有多个，但必须全部给定。',
            dbtl_burden_nonmonotonic: '异源通路表达量与目标产物产率关系通常非单调；若题目设定线性正比关系，必须显式声明已忽略代谢负担效应，否则属于参数设定失真。',
            tracer_enrichment_ceiling: '外源示踪底物（如 13C-葡萄糖）的输入丰度 p 不允许超过 1.0（100 mol%）；且经稀释后的任何胞内/胞外下游产物特征标记分数（如 M+3 分数）不得大于底物自身标记丰度 p。',
            subpopulation_fraction_sum_to_one: '互斥亚群占比总和（Σ φ_i）必须等于 1.0；若题目扣除死细胞或未分类细胞，需显式声明归一化基数。',
            flim_nadh_lifetime_range: 'FLIM 测定中游离态 NADH 寿命通常为 0.4–0.5 ns、蛋白结合态 NADH 为 2.0–4.0 ns；结合分数（Bound Fraction）必须在 0.0–1.0。',
        },
        antiPatternStrategies: [
            '【定量时间尺度门控】先通过发酵液高黏度参数和桨叶功率计算宏观混合时间 τ_mix 与微观细胞比耗氧速率时间尺度 τ_metabolism 的比值；τ_mix ≫ τ_metabolism 时传统均一 Monod 模型彻底失效，强制切入"时空死区"模式（高溶氧/低糖区与零溶氧/高糖区空间交替引发巴斯德效应局部逆转与乙酸溢流）——AI 默认全局均一状态。',
            '【非标准生产场景】废除标准 E. coli 批次发酵模型，改用：大规模 CHO 细胞灌注培养中 PIEZO1 机械敏感通道被局部高剪切非线性激活引发 Ca²⁺ 凋亡级联、补料分批长期饥饿期 m_s 非线性飙升破坏恒定质量衡算矩阵、下游超滤中浓差极化引发凝胶层阻力指数暴增的全系统急性反压——AI 语料对这些工业场景极度稀缺。',
            '【多步数值级联】≥3 层串行：搅拌桨叶尖速 → 局部雷诺数 → 剪切应变张量峰值 → 是否越过细胞膜临界张力 → 凋亡级联速率 → 实际可用生物量；或：底物补料速率 → 瞬态 [S] → Monod 实际 μ → 与维持能量 m_s 对比判断是否进入饥饿分叉——任一中间步骤误差级联放大。',
            '【通量分配闭合门控】题目必须先写出唯一的底物分配方程（维持 → 生长 → 产物，优先级固定），再检验氧传递约束（OUR vs OTR）是否触发限制分叉；两步均须以公式或文字唯一声明，不得依赖做题者自行假设——AI 惯于默认"生长优先"或"忽略维持"。',
            '【非牛顿流体流变阻抗门控】废除牛顿流体恒定粘度假设，采用假塑性非牛顿发酵液（真菌丝状体/黄原胶体系）。要求解题者先用幂律方程 $\\mu_{\\text{app}} = K \\cdot \\dot{\\gamma}^{n-1}$ 计算叶轮高剪切区与釜壁低剪切区的局部表观粘度差，再代入局部雷诺数判断混合制度，最终核算各空间区域 $k_L a$ 差异——AI 默认牛顿流体必然给出全局均一的错误 $k_L a$。',
            '【代谢历史路径依赖门控（v3，超高防御）】同一瞬时环境参数（DO、pH、底物浓度）下，细胞当前代谢状态取决于此前经历的氧限制、剪切暴露与饥饿周期。必须要求解题者跟踪"状态历史轨迹"而非仅分析当前稳态点——AI 默认系统为马尔可夫无记忆过程，遇到迟滞（Hysteresis）与表观遗传状态锁定会直接套用当前参数给出完全错误的产率预测。',
            '【微观同位素分流与多学融合门控（超高防御）】先给单细胞转录组/蛋白组异常比值（如 B 亚群 G6PD/TALDO1 或 PCK2/LDHA 倒置）提示氧化 PPP 或糖异生分化；再给全群体总流速与同位素特征值 + 分选亚群复测值，并混入“高剪切历史”干扰样本。要求依次完成：①识别并剔除历史失真样本；②按“绝对通量 + 同位素基数”双守恒联立方程；③按断裂链闭合规则配平，反推出不可直接测量的敏感亚群胞内通量。',
        ],
    },
    // 系统生物学
    'systems-biology': {
        name: '系统生物学',
        keywords: ['网络基序', '逻辑门', '鲁棒性', '反馈抑制', '常微分方程', '建模'],
        reasoningType: 'equilibrium' as ReasoningType,
        reasoningNote: '稳态逻辑：生物网络中负反馈环维持稳态（输出升高→抑制输入），正反馈产生双稳态开关（两个不可逆稳态之间的跳变）；ODE 建模时稳态条件是导数为零。',
        levels: {
            basic: '生物系统的组成成分及其相互作用概念。',
            intermediate: '简单的前馈环（Feed-forward loops）与反馈环，稳态的概念。',
            advanced: '使用 ODE（常微分方程）描述酶促反应动力学，系统鲁棒性分析。',
            competition: '分叉分析（Bifurcation analysis），随机噪声对基因表达的影响，代谢网络重建。'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '在非线性反馈、随机噪声、参数不可辨识和多组学观测误差共同存在时，判断系统状态、稳态可达性、分叉边界和可干预节点。',
        forbiddenErrors: [
            '【稳态等于平衡误判】ODE导数为零只表示动态稳态，不等同热力学平衡或无通量状态；开放系统可有持续通量。',
            '【网络拓扑替代动力学】激活/抑制边不能直接推出时间响应、稳态数量或振荡行为；必须给参数、时标或定性相图约束。',
            '【参数可辨识性忽略】多参数模型仅凭单一时间序列通常不可唯一反演；必须检查观测维度、噪声和参数相关性。',
        ],
        parameterConstraints: {
            ode_initial_condition_lock: '非线性系统输出可能依赖初始条件；涉及双稳态或迟滞时必须明确初始状态和扰动路径。',
            timescale_separation_gate: '快慢变量分离需要至少数量级级别的时间尺度差异；无此条件不得直接做准稳态近似。',
            stochastic_copy_number_boundary: '低拷贝数分子系统中噪声不可忽略；若拷贝数低于约10–100量级，确定性ODE结论需审计。',
        },
        generationChainSuggestions: [
            '按“网络拓扑 → 动力学方程/近似 → 稳态或分叉 → 观测读出 → 可干预性”组织题干。',
            '涉及多组学整合时，先区分因果调控、相关共变和共同驱动，再判断网络边是否可支持。',
        ],
        diversityScaffolding: {
            objectVariants: ['基因调控网络', '信号转导网络', '代谢网络', '细胞周期振荡器', '群体细胞状态转移网络'],
            measurementTools: ['时间序列RNA-seq', '蛋白磷酸化组', '代谢通量测量', '单细胞轨迹推断', '扰动筛选'],
            dataModalities: ['ODE参数表', '相图', 'nullcline图', '时间序列曲线', '网络邻接矩阵'],
            perturbationTypes: ['节点敲降', '反馈强度改变', '输入阶跃', '噪声增强', '初始条件切换'],
            questionStyles: ['稳态判定', '分叉边界分析', '参数可辨识性审计', '因果网络反证', '模型近似选择'],
            antiRepeatRule: '同一系统生物学知识点重复时，必须更换网络类型、动力学读出和扰动方式。',
            scaffoldingTransitionRule: '组学数据、网络拓扑和动力学模型必须通过可观测变量或干预实验闭合，禁止把相关网络直接当因果机制。',
        },
        antiPatternStrategies: [
            '【准稳态陷阱】给出快慢变量时间尺度接近的系统，要求判断Michaelis或准稳态近似是否失效。',
            '【同拓扑异动力学】给出相同正负反馈拓扑但不同Hill系数/延迟，要求判断稳态数量或振荡是否改变。',
            '【不可辨识反演】给出单输出时间序列却要求反推多条边参数，要求指出参数族而非唯一解。',
        ]
    },

    // 合成生物学
    'synthetic-biology': {
        name: '合成生物学、基因线路工程与可编程细胞系统',
        keywords: [
            '合成生物学', 'Synthetic Biology', '基因回路', 'gene circuit', '生物元件', 'BioBrick', '底盘细胞', 'chassis cell',
            '启动子工程', 'RBS library', 'terminator strength', '绝缘子', 'insulator', 'riboregulator', 'toehold switch',
            'CRISPRi', 'CRISPRa', 'dCas9', 'base editor', 'prime editing', 'recombinase logic', 'serine integrase', 'Bxb1',
            '逻辑门', 'NOR gate', 'NAND gate', 'toggle switch', 'repressilator', 'feed-forward loop', 'retroactivity',
            '负载效应', 'burden', 'resource competition', 'context dependence', 'copy number variation', 'plasmid instability',
            '多稳态', 'bistability', 'hysteresis', 'noise-induced switching', 'stochastic gene expression', 'chemical master equation',
            'Hill coefficient', 'cooperativity', 'dose-response curve', 'transfer function', 'phase portrait', 'nullcline', 'bifurcation',
            '代谢通路设计', 'metabolic pathway design', 'flux balance analysis', 'FBA', 'dynamic FBA', 'MFA', '13C-MFA',
            'enzyme kinetics', 'thermodynamic bottleneck', 'redox balance', 'ATP balance', 'NADPH regeneration', 'cofactor balancing',
            'pathway orthogonality', 'orthogonal translation', 'genetic code expansion', 'xenobiology', '非天然氨基酸', 'minimal genome',
            'genome-scale design', 'recoded genome', 'auxotrophic biocontainment', 'kill switch', 'gene drive containment',
            'directed evolution', 'MAGE', 'PACE', '高通量筛选', 'biosensor selection', 'microfluidic droplet screening',
            '细胞群体通信', 'quorum sensing', 'distributed computation', 'pattern formation', 'morphogen gradient', 'synthetic consortium',
            'cell-free', 'cell free', 'cell-free system', 'cell free system', 'TX-TL', 'TXTL', 'cell-free biosensor', 'cell free biosensor',
            '无细胞体系', '无细胞系统', '无细胞表达', '无细胞转录翻译', 'cell-free边界', '无细胞边界',
            'DNA assembly', 'Golden Gate', 'Gibson assembly', 'MoClo',
            'DBTL cycle', 'Design-Build-Test-Learn', 'Bayesian optimization', 'active learning', 'surrogate model', 'digital twin'
        ],
        reasoningType: 'constraint' as ReasoningType,
        reasoningNote: '工程约束与动态系统闭合逻辑：合成生物学题不能只按“元件A激活/抑制元件B”的静态拓扑推理，而必须沿“DNA构型与拷贝数 → 转录/翻译动力学 → 宿主资源分配与代谢负载 → 群体选择与突变逃逸 → 实验读出映射”的链条闭合。高阶命题需同时处理元件上下文依赖、retroactivity、细胞生长反馈、随机噪声、代谢热力学可行性、生物安全约束和DBTL测量误差；涉及代谢设计时必须区分化学计量通量、酶容量、热力学方向性、辅因子/能量守恒与动态发酵条件，不能用单一路径图或FBA最优解替代真实可实现产率。',
        levels: {
            basic: '生物学工程化视角，启动子/RBS/终止子/报告基因等元件的输入输出关系，标准化装配与底盘细胞概念。',
            intermediate: '基因线路的静态逻辑与动态行为：repressilator、toggle switch、CRISPRi/a调控、群体感应通信、简单ODE模型与剂量响应曲线。',
            advanced: '多元件线路在宿主内的资源竞争、负载效应、上下文依赖、拷贝数漂移和随机表达噪声；代谢通路重构需联立FBA/13C-MFA、酶动力学、辅因子再生、热力学方向性和发酵动态控制。',
            competition: '① 可编程细胞线路的动态失效分析：在有限核糖体/RNAP/dCas9资源池下，评估多sgRNA CRISPRi逻辑门的retroactivity、负载诱导增长率下降、Hill响应曲线重塑和噪声触发的错误开关概率。\n\n② 代谢-调控耦合设计：给定13C-MFA片段标记、转录组/蛋白组、发酵DO/pH/补料曲线和副产物谱，反推出NADPH/ATP/碳通量瓶颈，判定FBA预测产率为何被酶容量或热力学约束击穿。\n\n③ 基因组尺度设计与生物安全：最小基因组、密码子重编码或营养缺陷型生物遏制题必须同时审计遗传稳定性、逃逸突变率、水平基因转移、生态适应度和选择压力方向，不能只给“加kill switch即可安全”的定性结论。\n\n④ DBTL与机器学习闭环：高通量构建库、流式/微滴筛选、贝叶斯优化或主动学习题必须追踪测量噪声、批次效应、模型外推边界、探索-利用权衡和实验验证闭环，禁止把黑箱模型最高分构型直接视为最优生物设计。\n\n⑤ 多细胞合成生态系统：涉及群体感应、互养、空间图案或分布式计算时，必须联立扩散-反应方程、增长率差异、突变者入侵、信号串扰和空间混合尺度，判断设计在时间与空间上是否稳定。'
        },
        peakDifficulty: '在同一题中把遗传线路动力学、宿主资源约束、代谢通量、群体进化稳定性和实验读出误差放入同一约束系统，定量判断一个合成细胞设计是否可实现、可测量、可进化稳定且满足生物安全边界；天花板题应能从FBA/13C-MFA/转录翻译模型/流式分布/发酵过程数据中反推出失败机制，而不是只提出新的元件组合。',
        forbiddenErrors: [
            '【拓扑图替代动力学】不得只根据激活/抑制箭头判断线路输出；必须考虑参数区间、时间尺度、Hill系数、阈值、延迟和初始条件。',
            '【传递函数链式代入伪动力学】系统生物学-基因回路拓扑×传递函数题不得把每个节点的稳态传递函数、输入浓度和单位全部明示后要求逐层代入求最终报告分子数；合格题必须让传递函数服务于机制判别、动态边界或读出可识别性，例如比较响应时标/阈值窗口/retroactivity/生长稀释/初始状态对平台顺序和终态可达性的影响。',
            '【数字逻辑理想化】生物逻辑门不得等同无噪声电子门；leakiness、动态范围、串扰、负载和阈值漂移都可能改变真值表。',
            '【元件可移植性幻觉】启动子、RBS、terminator或sgRNA强度不能跨底盘、培养条件、拷贝数和上下游序列无校准复用。',
            '【宿主负载忽略】多基因表达、dCas9占用、外源通路和报告蛋白消耗RNAP/核糖体/ATP/NADPH，不能默认不影响增长率与线路参数。',
            '【FBA最优解等同产率】FBA通量最优只满足化学计量约束，不代表酶容量、热力学方向、调控状态、毒性和发酵传质均可实现。',
            '【辅因子与能量不守恒】代谢工程题必须配平ATP、NADH/NADPH、还原力与碳回收；不得只按碳原子数估算理论产率。',
            '【单细胞分布被均值掩盖】流式、单细胞测序或微滴筛选数据不得只看均值；双峰、长尾、噪声诱导开关和亚群选择必须进入判断。',
            '【遗传稳定性缺失】质粒丢失、重组删除、沉默突变、转座插入和逃逸者选择优势不得被忽略；长期培养题必须评估突变-选择平衡。',
            '【生物安全口号化】kill switch、营养缺陷或密码子重编码不能直接宣称绝对安全；必须量化逃逸概率、环境补偿、水平转移和选择压力。',
            '【ML设计越界外推】机器学习推荐序列或元件组合不得超出训练分布后仍被当作可靠最优；必须要求外部验证、校准曲线或不确定性估计。',
            '【细胞自由系统与活细胞混同】TX-TL或cell-free结果不得直接外推到活细胞；降解、稀释、膜转运、资源再生和毒性环境完全不同。',
            '【群体通信无空间尺度】quorum sensing或合成生态题必须考虑扩散、降解、混合、局部密度和生长差异；不得把well-mixed稳态直接外推到空间图案。'
        ],
        parameterConstraints: {
            promoter_transfer_function: '启动子或CRISPRi/a输入输出必须至少锁定basal leak、最大表达、EC50/Kd、Hill系数和动态范围；只给“强/弱启动子”不足以支撑高阶判断。',
            burden_growth_coupling: '外源表达负载需映射到增长率变化，常见题目应给或要求估算μ、蛋白表达占比、核糖体/RNAP占用或ATP消耗；线路输出必须考虑稀释率μ。',
            copy_number_gate: '质粒拷贝数变化会同时改变表达强度、噪声和负载；涉及多质粒系统时必须声明origin、选择压力与拷贝数分布，不得按单一确定值处理。',
            noise_distribution_gate: '单细胞表达题必须区分均值、CV、Fano factor、双峰比例和门控阈值；二态启动子模型不得用群体均值唯一替代。',
            retroactivity_gate: '下游模块结合或消耗上游调控因子会改变上游传递函数；级联线路需评估隔离器、磷酸化循环或资源池是否足以降低retroactivity。',
            crispri_titration_gate: '多sgRNA CRISPRi线路必须考虑dCas9/sgRNA滴定、off-target、PAM可及性和靶位点位置；不能把每条sgRNA的抑制效率线性相加。',
            metabolic_mass_balance: '代谢通路产率必须同时满足碳、电子、ATP和辅因子守恒；理论碳收率不得超过化学计量上限，副产物流需进入闭合。',
            thermodynamic_feasibility: '通路方向性需满足ΔG或浓度边界；靠近热力学平衡的反应不能在无酶量/底物拉动说明下承担高通量。',
            enzyme_capacity_limit: '若FBA预测高通量但蛋白组或kcat显示酶容量不足，必须切换到酶约束模型或说明瓶颈酶表达成本。',
            isotope_flux_constraint: '13C-MFA题必须使用同位素标记分布、片段断裂规则和原子转移矩阵约束通量；不得只按总产物浓度反推分支流量。',
            evolutionary_escape_rate: '长期稳定性题需给或估算突变率、选择系数、传代数和逃逸者适应度；kill switch有效性必须转化为逃逸概率或失效率。',
            containment_selection_pressure: '营养缺陷、生长依赖和毒素-抗毒素系统只有在环境补偿物、旁路代谢和水平转移风险被排除或量化后才能作为安全约束。',
            dbtl_measurement_noise: 'DBTL闭环题必须区分构建错误、测序覆盖、流式门控、批次效应和生物重复；模型更新需使用带不确定性的观测值。',
            consortium_spatial_scale: '合成共培养题需比较信号扩散长度、细胞增长时间、混合时间和代谢物消耗尺度；空间异质性强时well-mixed ODE不闭合。'
        },
        generationChainSuggestions: [
            '按“设计目标 → 元件/线路参数 → 宿主资源与代谢约束 → 实验读出 → 进化稳定性/安全边界”组织高阶题。',
            '代谢设计题优先把FBA预测与13C-MFA、蛋白组、辅因子、发酵过程数据放在同一约束链中制造可辨识瓶颈。',
            '线路设计题优先使用传递函数、噪声分布、负载增长耦合和retroactivity，但传递函数必须制造模型选择、动态可达性或读出口径冲突，不得退化为已给闭式函数的顺序代入。',
            'DBTL题必须让模型建议接受实验噪声、批次效应和外推不确定性审计，避免黑箱最优答案。'
        ],
        diversityScaffolding: {
            objectVariants: [
                'CRISPRi多输入逻辑门', 'toggle switch记忆线路', 'repressilator振荡器', 'toehold RNA传感器',
                '工程化E. coli底盘', '酿酒酵母萜类合成通路', '枯草芽孢杆菌分泌表达系统', '蓝藻固碳工程',
                'cell-free TX-TL诊断体系', '合成微生物共培养体系', '最小基因组细胞', '密码子重编码底盘',
                '营养缺陷型生物遏制系统', '微滴筛选定向进化体系', '多细胞空间图案生成系统', '人工细胞器/区室化代谢体系'
            ],
            measurementTools: [
                '流式细胞术', '单细胞RNA测序', '荧光时间序列显微成像', 'qPCR/RT-qPCR', 'RNA-seq', 'Ribo-seq',
                'LC-MS代谢组', 'GC-MS同位素标记', '13C-MFA', '蛋白组定量', '酶活测定', '微滴筛选',
                '连续培养/chemostat', '高通量测序质控', '自动化DBTL平台', 'cell-free TX-TL反应曲线'
            ],
            dataModalities: [
                '剂量响应曲线', '单细胞荧光分布', '时间序列表达轨迹', '相图/nullcline', '分叉图',
                '真值表错误率矩阵', '增长率-表达量耦合曲线', '质粒拷贝数分布', '13C同位素标记矩阵',
                '代谢通量图', '辅因子/能量收支表', '发酵补料与DO曲线', '突变谱与逃逸频率',
                '高通量构建库测序计数', '贝叶斯优化候选序列与不确定性', '空间荧光图案'
            ],
            perturbationTypes: [
                '诱导剂阶跃', '温度切换', '培养基碳源切换', 'DO限制', 'pH漂移', '补料策略改变',
                '质粒拷贝数改变', 'sgRNA竞争', '启动子/RBS库突变', '基因敲除/敲入', '长期传代',
                '抗生素选择压力撤除', '群体密度变化', '空间混合尺度变化', '底物毒性冲击'
            ],
            questionStyles: [
                '线路失效机制反演', '传递函数参数拟合', '单细胞噪声门控', 'FBA与13C-MFA冲突解释',
                '辅因子/ATP闭合计算', '宿主负载定量审计', '遗传稳定性与逃逸概率估算', '生物安全边界判定',
                'DBTL模型不确定性审计', '合成共培养空间稳定性分析', 'cell-free到活细胞外推边界判定'
            ],
            antiRepeatRule: '同一合成生物学知识点重复出题时，必须至少更换“底盘、线路/通路类型、测量数据、扰动条件、判定目标”中的两项；不得复用固定DBTL叙事。',
            scaffoldingTransitionRule: '跨层级组合必须有明确映射：元件强度→传递函数，表达负载→增长率/资源池，代谢通量→质量与电子守恒，单细胞分布→群体读出，突变逃逸→长期稳定性；禁止把不同证据简单投票。'
        },
        antiPatternStrategies: [
            '【S1｜传递函数门控】给出诱导剂浓度和荧光输出时，先拟合basal、maximum、EC50与Hill系数，再判断逻辑门阈值；不得只看趋势。',
            '【S2｜资源负载分账】多模块表达题必须估算RNAP/核糖体/dCas9/ATP竞争和增长率下降，并把稀释率反馈到线路动力学。',
            '【S3｜retroactivity反制】级联线路题要求比较有无insulator或buffer模块的输入输出曲线，识别下游负载反向改变上游状态的情况。',
            '【S4｜噪声与亚群门控】流式题先检查分布形状、双峰比例和门控阈值，再计算ON/OFF错误率；禁止用平均荧光直接判定成功。',
            '【S5｜FBA-MFA冲突闭合】若FBA预测高产但13C-MFA显示旁路增强，要求用同位素原子转移、辅因子和热力学约束反推出真实瓶颈。',
            '【S6｜酶容量限制】给出kcat、蛋白组占比或酶活数据时，必须审计目标通量是否超过酶容量；超过时不能继续采用纯化学计量最优解。',
            '【S7｜动态发酵门控】补料、DO或pH变化题必须分阶段建模，区分瞬时稳态、迟滞和代谢状态记忆；不能用单一稳态点代表全过程。',
            '【S8｜遗传稳定性审计】长期培养题要求根据突变率、选择系数和传代数估算逃逸者累积概率，并判断设计是否被进化压力反向筛选。',
            '【S9｜遏制系统反证】生物安全题必须考虑环境代谢物补偿、水平基因转移、旁路突变和kill switch失活；不得输出绝对安全结论。',
            '【S10｜DBTL外推审计】机器学习设计题先检查训练分布覆盖、测量噪声和不确定性，再决定是利用最高分候选还是补充探索实验。',
            '【S11｜cell-free边界】TX-TL题若外推到活细胞，必须补充稀释、降解、膜转运、毒性和资源再生差异，否则只能作为体外原型证据。',
            '【S12｜合成生态空间门控】共培养或图案形成题必须比较扩散长度、混合时间、增长率和信号降解速率，判断well-mixed模型是否失效。',
            '【S13｜去模板化总控】以上策略只能作为组合约束，不得整句复现为题干；每次生成合成生物学题至少更换对象、数据形式、扰动条件和失败机制中的两项。'
        ]
    },

    // 结构生物学
   'structural-biology-advanced': {
    name: '结构生物学、分子物理学与定量变构动力学',
    keywords: [
        // 核心技术与先进表征
        '蛋白质结构', 'X射线晶体学', '冷冻电镜', 'Cryo-EM', 'NMR', 'Cryo-ET', 'TR-SFX', 'PDB文件',
        '氢氘交换质谱', 'HDX-MS', 'HDX', 'Hydrogen-Deuterium Exchange', 'EX1', 'EX2', 'EX3', 'EXS',
        '保护因子', 'Protection Factor', '反向交换', 'Back-exchange', 'uptake curve', 'deuterium uptake',
        '固有交换速率', 'intrinsic exchange rate', 'tr-HDX', 'time-resolved HDX', 'IDR-HDX',
        '肽段覆盖图', 'peptide coverage map', '同位素包络', 'isotopic envelope',
        'DEER-EPR', '单分子FRET', 'smFRET', '金纳米颗粒阴影成像',
        // 数理核心、位相与质控
        '拉氏图', 'Ramachandran', '电子密度图', 'FSC曲线', 'R-free', '差值傅里叶图', '位相问题', 
        '分子置换法', '反常散射', 'SAS/SAD/MAD', '优先取向', 'Preferred Orientation', '傅里叶各向异性', 
        'Missing Wedge', '局部漏斗效应', 'B-factor', '原子位移参数', 'Q-score',
        // 计算物理与AI计算生物学
        'AlphaFold3', '扩散模型', 'Flow Matching', '分子动力学模拟', 'MD', '增强采样', 'Metadynamics', 
        '伞形采样', 'Umbrella Sampling', '马尔可夫状态模型', 'MSM', '自由能景观', 'Energy Landscape',
        '分子对接', 'PBSA/GBSA', '接触图', 'Contact Map', '协同进化', 'MSA', 
        // 微观物理机制与物理化学
        '构象变化', '蛋白质折叠', '变构效应', '空间位阻', '柔性无序区', 'IDR', '液-液相分离', 'LLPS', 
        '逆境键', 'Catch Bond', '质子化状态耦合', 'pKa移动', '电化学势', '电生泵电流', '微观状态简并度',
        '构象系综', 'Ensemble Refinement', '多构象占有率', 'Occupancy', '交联质谱', 'XL-MS',
        '小角散射', 'SAXS', 'SANS', '化学位移扰动', 'PRE-NMR', 'RDC-NMR', '整合建模',
        'Integrative Modeling', 'IHM', '膜蛋白纳米盘', '脂质纳米盘', 'cryo-EM局部分辨率',
        '倾斜数据采集', 'Conical Tilt', 'CTF校正', 'Ewald球曲率', '辐射损伤', 'Beam Damage',
        '晶体孪生', 'Twinning', '各向异性B因子', 'TLS精修', 'MolProbity', 'Clashscore',
        '酸碱耦联构象', '配体占有率', '多状态精修', '构象选择', '诱导契合', '自由能微扰', 'FEP',
        '热力学积分', 'TI', '双层膜弹性', '膜蛋白变构', '相分离结构系综', 'IDR系综约束'
    ],
    reasoningType: 'constraint' as ReasoningType,
    reasoningNote: '立体化学与非平衡态热力学多重约束逻辑：核心推理链为“微观扰动（特异性配体共价/非共价对接、局部点突变异构化、环境pH驱动残基pKa漂移与质子化状态翻转） → 破坏原位局域拓扑约束（氢键网络剪切、盐桥解离、主链Ramachandran盘区立体化学跨障） → 重塑全局多维自由能景观（Energy Landscape），改变微观构象简并度与统计力学波尔兹曼分布 → 驱动多状态马尔可夫链（MSM）的概率通量重新分配，触发变构分叉或功能态激活”。解题与命题逻辑应严格遵循三维空间几何位阻（Static Limits）与四维时域动力学松弛（Dynamic Relaxation）的自洽闭合。【HDX-MS专项逆问题门控】：HDX-MS不是直接观测结构，而是从带有反向交换、肽段平均、同位素包络重叠与时间采样噪声的质量偏移数据中反推局部保护、构象打开/闭合速率和表观自由能；因此凡涉及HDX-MS的高难题必须显式处理模型可辨识性、逐肽段误差校正、EX1/EX2/EXS模型选择、IDR解释边界与“HDX单独不能推出焓熵分解”的不可识别性。',
    levels: {
        basic: '蛋白质四级结构拓扑层级，α螺旋/β折叠的氢键供体-受体空间网格特征。X射线晶体学布拉格定律（Bragg\'s Law）与倒易空间概念；冷冻电镜（Cryo-EM）透射电子成像、单颗粒二维分类（2D Classification）的基本降维聚类物理原理。',
        intermediate: '氨基酸侧链立体化学倾向性与拉氏图（Ramachandran Plot）四个允许区/非允许区的能量边界判读。同源建模中序列一致性（Sequence Identity）与比对空位（Gaps）对骨架精度的热力学制约；结合口袋的空间几何互补性、共轭双键叠合（$\pi$-$\pi$ Stacking）与阳离子-$\pi$相互作用、疏水效应的自由能贡献（$\Delta G = \Delta H - T\Delta S$）。',
        advanced: '冷冻电镜三维重建流（三维细化 3D Refinement、局部遮罩 Local Masking、电荷密度校正）。晶体学 $R_{\text{work}}$ 与 $R_{\text{free}}$ 因子的交叉验证（Cross-validation）抗过拟合数理机制。傅里叶变换的位相问题（Phase Problem）核心物理本质：分子置换法（MR）的旋转/平移函数搜索，单/多波长反常散射（SAD/MAD）利用重原子异常散射信号重建位相的向量解析。分子动力学（MD）显式溶剂体系平衡态判定、均方根涨落（RMSF）与原子B-factor的物理映射、基于各向异性网络模型（ANM）的简正模分析（NMA）。',
        competition: '① AI与计算模型的边界重构：AlphaFold2/3在缺乏多序列比对（MSA）信息的孤立人工从头设计蛋白（De novo）中的结构坍塌效应；单点突变（Single Mutations）导致微观自由能景观重塑而引发的变构翻转（构象Flip），AI在静态训练集下无法感知其能量微扰的失效机理；几何深度学习与扩散模型在处理高度非共价柔性对接时，由于过分拟合静态刚性口袋导致的“形状偏见（Shape Bias）”。\n\n② 分辨率迷思与局域精细质质控：全局分辨率（基于FSC 0.143黄金标准）的平均化欺骗性，与局部分辨率（Local Resolution）空间非均一性引发的侧链错误安置灾难；如何利用原子级Q-score评估低解析度局部（如膜蛋白跨膜区外围、柔性Loop区）的密度图可信度；结构模型过拟合（Overfitting）的定量化检验与高斯滤波对噪声伪迹的操纵鉴别。\n\n③ 环境各向异性与状态伪迹陷阱：高浓度晶体点阵包埋力（Crystal Packing Forces）对蛋白质天然构象的强行扭曲，导致非生理对称多聚体假象的排查（如通过DLS或SEC-MALS验证）；冷冻电镜制样中气液界面（Air-Water Interface）引发的生物大分子变性与优先取向（Preferred Orientation）假象，导致傅里叶空间取样极度不均（Missing Cone/Wedge 漏斗效应），进而造成三维重建流在特定维度上发生严重拉伸与密度丢失的几何修复方案。\n\n④ 四维时域物理与过渡态轨迹追踪：时间分辨X射线自由电子激光（TR-SFX）与时间分辨冷冻电镜（Time-resolved Cryo-EM）中，“泵浦-探测（Pump-Probe）”或微流体快速混匀（Microfluidic Mixing）延迟时间与化学键断裂、构象过渡态寿命（Transition State Lifetime）的物理配平推导；如何通过精细计算“动力学差值傅里叶图（Difference Fourier Map）”，消除静态本底，在时域上定量分离并重构共存的微观中间体（Intermediates）非平衡态动力学演化轨迹。\n\n⑤ 多模态超静定约束整合与热力学闭合：当高分辨电镜或晶体学面对柔性无序区（IDRs）或高度动态结构发生“结构失明”时，利用整合生物学（Integrative Biology）框架重构全局构象链条：将NMR化学位移变动（Chemical Shift Perturbation）、氢氘交换质谱（HDX-MS）的溶剂可及性保护因子（Protection Factors）、顺磁共振（DEER-EPR）或单分子smFRET的距离概率分布函数作为边界约束，代入增强采样分子动力学模拟（如Metadynamics）中进行马尔可夫状态模型（MSM）演化，实现微观状态结构与非平衡态热力学驱动力的完全配平与数理闭合。\n\n⑥ HDX-MS定量反演与不可辨识性陷阱：在肽段级HDX-MS中，EX1协同打开事件、EX2局部呼吸交换、EXS过渡态交换和毫秒级tr-HDX折叠中间体可能产生相近的uptake curve或同位素包络；高阶题必须给出时间点、centroid mass或isotopic envelope、肽段序列、pH、温度、内禀交换速率、undeuterated/fully deuterated controls与重复实验，要求逐肽段back-exchange校正、误差传播、AIC/BIC/F-test模型选择、k_op/k_cl/k_int参数置信区间和可辨识性判断。禁止把HDX热图的定性保护变化直接升级为单残基结构、真实氘代量、IDR稳定二级结构或ΔH/TΔS分解。'
    },
    peakDifficulty: '在局部分辨率非均一、构象异质性与环境伪迹共存时，将冷冻电镜/晶体学/NMR/HDX-MS/smFRET/MD 多模态数据转化为同一坐标系下的超定约束，定量反演多状态构象系综、占有率、自由能差与变构通量，并能判定模型是否被数据唯一闭合；HDX-MS专项天花板为在逐肽段back-exchange、EX1/EX2/EXS模型竞争、IDR快速交换和反问题病态共存时，给出数值参数、置信区间与“哪些结论不可由HDX单独推出”的边界判定。',
    forbiddenErrors: [
        '【静态单构象滥用】结构生物学题不得默认一个 PDB 坐标即代表唯一生理态；涉及变构、膜蛋白、IDR 或配体结合时，必须显式考虑构象系综、占有率与时间尺度。',
        '【全局分辨率替代局部分辨率】严禁用单一全局 FSC 分辨率断言所有侧链、配体、离子或水分子均可信；低局部分辨率区域必须结合 Q-score、局部 map-model correlation 与化学合理性审计。',
        '【密度图过拟合】严禁只报告 R_work、FSC 或 real-space CC 而不使用 R_free、half-map 交叉验证、模型打乱重精修或独立数据集检验过拟合。',
        '【AI预测结构等同实验证据】AlphaFold/扩散模型输出不得直接替代实验结构；pLDDT/PAE/接口置信度只能作为先验，不能证明配体口袋、寡聚状态或变构路径真实存在。',
        '【晶体接触误判生理寡聚体】晶体学中由空间群对称性生成的界面不得直接判定为生理复合物；必须结合界面能、保守性、SEC-MALS/DLS/交联或突变功能数据验证。',
        '【优先取向与 Missing Wedge 忽略】冷冻电镜/断层重构题若存在取向覆盖不足，严禁把拉伸密度、缺失密度或各向异性分辨率解释为真实构象变化。',
        '【配体占有率与B因子混淆】低占有率配体、局部运动与错误放置均可造成弱密度；严禁只凭一团差值密度宣称配体完全结合或催化中间体稳定存在。',
        '【质子化状态固定化】涉及 pH、pKa 漂移、酸碱催化或质子泵时，不得把 His/Asp/Glu/Lys 等残基质子化状态固定为教科书默认值；必须说明 pH、局部电场与氢键网络。',
        '【MD时间尺度越界】纳秒级常规 MD 不得直接证明毫秒级变构转换、折叠路径或稀有事件自由能；需使用增强采样、MSM 或明确时间尺度限制。',
        '【多模态数据参照系不闭合】NMR距离、smFRET效率、HDX保护因子、XL-MS交联距离与电镜密度不得机械平均；必须转化为可比较的距离/可及性/能量约束并声明误差模型。',
        '【膜环境缺失】膜蛋白结构不得默认去污剂胶束、纳米盘、脂质体和原生膜完全等价；脂质组成、曲率、膜电位与双层厚度可改变构象与功能态。',
        '【手性与立体化学硬伤】严禁出现 D/L 氨基酸、肽键平面性、糖苷键构型、核酸糖环构象或 Ramachandran 禁区被无说明地违反。',
        '【辐射损伤当作生物态】冷冻电镜或晶体学中羧酸脱羧、二硫键断裂、金属还原等 beam damage 伪迹不得直接解释为反应中间体。',
        '【热力学/动力学方向混淆】自由能差决定平衡占有率，能垒决定转换速率；严禁用单一低能构象直接推断过渡速率或用高势垒改变热力学终态方向。',
        '【HDX基础题伪高阶】涉及HDX-MS的competition题严禁停留在“解释HDX原理”“定性区分EX1/EX2”“uptake降低说明保护增强”或简单PF代入计算；必须要求数值校正/拟合/模型选择/误差传播中的至少一项。',
        '【HDX全局反向交换校正滥用】严禁使用单一全局back-exchange factor替代逐肽段校正；若无fully deuterated control或肽段特异保留率，必须声明真实氘代量不可唯一反推，只能给范围或设计补充实验。',
        '【HDX单残基过度解释】肽段级HDX数据不得直接给出单残基氘代概率、氢键断裂时间或水渗透路径；除非给出高重叠肽段、ETD/ECD碎裂或正交NMR/MD约束，并仍需报告不确定性。',
        '【EX1参数唯一化幻觉】从单条uptake curve或低时间分辨centroid数据不得唯一拟合k_op、k_cl、k_int；多EX1事件重叠、包络重叠或采样不足时必须进行参数可辨识性/置信区间审计。',
        '【tr-HDX模型凭形状拍板】毫秒级tr-HDX不得只凭曲线形状选择EX1、EX2、EXS或Chevron模型；必须比较候选模型复杂度、残差、重复实验变异和AIC/BIC/F-test。',
        '【IDR-HDX球状蛋白框架误用】固有无序区HDX的高uptake或保护下降不得直接解释为“完全无结构”或“稳定二级结构形成”；必须考虑序列内禀交换速率、proline分布、电荷图案、瞬态接触和肽段覆盖不足。',
        '【HDX焓熵分解越权】单温度HDX只能支持PF、表观k_obs或ΔG_protection近似；严禁从HDX曲线单独拆出ΔH和TΔS，除非补充ITC/DSC/温度依赖HDX或van\'t Hoff数据。',
        '【稳定态等同信号贡献态】涉及构象占有率、空间位阻和实验信号映射时，严禁把稳定态、拥挤态、受阻态、主态或高占有率态直接等同为峰面积、酶活、结合信号或电流贡献态；必须先用结构几何、活性位点可及性或构象特异功能参数筛选有效贡献态。',
        '【结构精修指标替代功能读出】B-factor、occupancy、摄氘量差、局部分辨率或单帧MD遮挡比例不得无模型标定地替代功能读出；若要进入标准解，必须说明其对应的实验通道、母集和误差模型。',
    ],
    parameterConstraints: {
        xray_rfree_gap: '常规晶体学精修中 R_free 通常应高于 R_work 且差值约 2–7%；若 R_free≈R_work 或差值异常大，需审计过拟合、孪生、非晶体学对称性或数据/模型错误。',
        cryoem_fsc_threshold: '单颗粒冷冻电镜全局分辨率常以 gold-standard FSC=0.143 报告；解释侧链和配体必须进一步检查局部分辨率、map sharpening 与独立 half-map 验证。',
        sidechain_resolution_gate: '一般需优于约 3.5 Å 才能较可靠放置多数侧链，优于约 2.5–3.0 Å 才能讨论细粒度配体构象；低于该门槛需给出强先验或多模态约束。',
        ramachandran_outliers: '高质量蛋白结构 Ramachandran outlier 应接近 0%；若出现关键位点离群，必须说明催化应力、真实构象证据或模型错误排查。',
        clashscore_molprobity: 'MolProbity clashscore 与 rotamer outlier 必须与分辨率匹配；高 clashscore 不得被“动态柔性”随意掩盖。',
        bfactor_occupancy_coupling: 'B-factor 与 occupancy 在密度强度上高度耦合，低占有率配体精修需固定或约束其中一个自由度，否则参数不可辨识。',
        fret_distance_range: 'smFRET 对约 2–10 nm 距离敏感，必须给出或隐含 Förster 半径 R0、染料连接臂与取向因子不确定性；不得把 FRET效率直接等同原子间距离。',
        crosslink_distance_ceiling: '常见 DSS/BS3 等交联约束对应 Cα-Cα 上限常约 25–35 Å（依赖连接臂与柔性）；超过上限需解释构象异质性或错误匹配。',
        hdx_timescale_gate: 'HDX-MS 保护因子反映毫秒至小时级氢交换与溶剂可及性/氢键稳定性，不得直接等同瞬时 SASA 或单帧 MD 暴露面积。',
        md_timestep_limit: '全原子显式溶剂 MD 常用积分步长约 1–2 fs（约束氢键可到 2 fs）；显著更大步长需说明质量重分配或粗粒化模型，否则动力学不可信。',
        boltzmann_occupancy_consistency: '构象占有率与自由能差需满足 $p_i/p_j=\\exp[-(G_i-G_j)/RT]$；室温下 1 kcal/mol 约造成约 5 倍占有率差异，数量级不得随意漂移。',
        membrane_protein_environment: '膜蛋白构象解释需声明去污剂、nanodisc、amphipol、脂质体或原生膜条件；不同环境下的跨膜螺旋倾角/孔径差异不可直接合并。',
        ph_pka_consistency: '涉及质子化状态的题必须锁定 pH 与关键残基 pKa；若 pH 接近 pKa（±1 单位内），需考虑混合质子化微观状态。',
        cryoem_dose_limit: '冷冻电镜总电子剂量通常为数十 e⁻/Å² 量级；超高剂量下的高分辨密度必须审计辐射损伤与剂量加权。',
        steric_coupling_quantification: '空间位阻类结构生物学题必须进行至少 2 个耦合效应的定量剥离（位阻+电子、位阻+熵、位阻+溶剂/膜环境三类中至少选两类），不得只给“空间冲突/口袋变窄/侧链太大”的定性解释。题目必须要求输出明确数值结果，如侧链 χ 角或主链/配体二面角差（°）、Cα/重原子距离或 clash overlap（Å）、结合/催化速率比、构象占有率比、ΔΔG_bind/ΔΔG_conf/ΔG‡ 差（kJ·mol⁻¹ 或 kcal·mol⁻¹）等。',
        steric_real_substrate_requirement: '涉及空间位阻的蛋白-配体、蛋白-蛋白界面、突变侧链或膜蛋白口袋体系必须是真实存在或可由真实 PDB/UniProt/文献体系合理派生的非理想化体系；优先使用 Trp/Phe/Tyr/Arg 等大侧链突变、糖基化/磷酸化修饰、胆固醇/脂质、血红素/辅因子、甾体/大环内酯/核苷酸类配体、抗体 CDR-抗原界面、GPCR/激酶/蛋白酶真实结合口袋等对象；禁止用甲基/乙基或 Ala/Gly 这类过度简化取代基差异伪装为高阶结构位阻问题。',
        hdx_mass_shift_per_deuterium: 'HDX-MS中每引入1个氘相对氢的质量增量约为1.0063 Da；计算centroid mass shift时必须区分理论可交换酰胺数、N端/Pro后酰胺不可交换规则、charge state与同位素包络质心。',
        hdx_back_exchange_peptide_specific: 'back-exchange校正必须逐肽段进行，至少需要undeuterated control与fully deuterated control；全局校正常可带来20–40%系统误差，不得用于精确定量结论。',
        hdx_required_condition_lock: 'HDX题若要求数值拟合或PF计算，必须给出pH、温度、标记时间点、淬火条件、肽段序列和intrinsic exchange rate或其计算来源；缺少这些条件时不得要求唯一数值答案。',
        hdx_ex1_identifiability_gate: 'EX1定量拟合必须至少提供多时间点isotopic envelope而非只有centroid uptake；若多个opening event时间尺度重叠或包络分辨率不足，k_op/k_cl/k_int通常不可唯一辨识。',
        hdx_trhdx_model_selection_gate: 'tr-HDX或sub-10 ms混合实验必须声明dead time、mixing time、重复实验和噪声模型；模型选择需报告AIC/BIC/F-test或等价统计检验，不得只用R²。',
        hdx_idr_interpretation_gate: 'IDR-HDX解释必须结合disorder prediction、charge patterning、proline分布和peptide coverage；earliest time point已接近完全交换时，不得反推出稳定残基级结构。',
        hdx_thermodynamic_limit: 'ΔG_protection≈RT ln(PF)仅在EX2等适用假设下成立；HDX-derived ΔΔG_protection不得直接等同binding ΔG，更不得在无温度序列/量热数据时分解为ΔH和ΔS。',
        structural_signal_contributor_gate: '构象-功能耦合题必须明确“统计占有态、结构可及态、功能有效态、实验可读出态”的映射关系；若结构位阻或几何阈值排除了某状态，该状态不得继续贡献峰面积、结合活性、酶切初速或电流读数。',
    },
    generationChainSuggestions: [
        '按“构象占有/结构几何 → 有效贡献态筛选 → 实验信号映射 → 定量判定”组织构题，但不得复用固定对象或固定技术组合。',
        '先区分统计主态、结构可及态、功能有效态和实验可读出态，再把有效态比例映射到峰面积、酶活、结合读数或电流。',
        '多模态结构题优先建立共同物理参照系，把密度、距离、保护因子、占有率或自由能转成可比较约束后再判定。',
    ],
    diversityScaffolding: {
        objectVariants: [
            '可溶性酶-抑制剂复合物', 'GPCR-配体-β-arrestin复合物', 'ABC转运蛋白', '离子通道门控态',
            '核糖体翻译中间体', '膜蛋白纳米盘体系', '病毒衣壳装配体', '抗体-抗原界面',
            'IDR-结构域相分离体系', '酶催化短寿命中间体', '蛋白-核酸复合物', '晶体学对称寡聚体候选'
        ],
        measurementTools: [
            'X射线晶体学', 'SAD/MAD反常散射', 'TR-SFX', '单颗粒Cryo-EM', 'Cryo-ET subtomogram averaging',
            '溶液NMR', '固态NMR', 'HDX-MS', 'XL-MS', 'DEER-EPR', 'smFRET', 'SAXS/SANS',
            '分子动力学增强采样', 'AlphaFold/扩散生成模型辅助建模'
        ],
        dataModalities: [
            '电子密度/差值傅里叶图', 'half-map与FSC曲线', '局部分辨率图', 'B-factor/occupancy表',
            'Ramachandran与MolProbity报告',             '化学位移扰动谱', 'HDX保护因子热图', 'HDX uptake curve时间序列', 'HDX centroid mass shift重复数据',
            'HDX isotopic envelope时间序列', 'HDX fully deuterated/undeuterated control表', '肽段覆盖图与重叠肽段矩阵',
            '交联距离清单',
            'FRET效率时间轨迹', 'DEER距离分布', 'SAXS P(r)曲线', 'MSM转移矩阵', '自由能面PMF'
        ],
        perturbationTypes: [
            'pH阶跃', '点突变', '配体/底物/抑制剂滴定', '磷酸化或泛素化修饰', '脂质组成改变',
            '膜电位或离子梯度改变', '冷冻制样气液界面暴露', '晶体脱水', '温度跳变', '光泵浦',
            '盐浓度改变', '同位素标记', '交联剂长度改变', '低剂量/高剂量电子照射'
        ],
        questionStyles: [
            '模型质控审计', '多模态约束闭合', '构象占有率反演', '伪迹排查', '自由能差计算',
            '变构路径判定', '实验设计补证', 'AI结构置信度反证', '局部分辨率门控', '参数可辨识性判断',
            'HDX逐肽段反向交换校正', 'EX1/EX2/EXS动力学模型选择', 'tr-HDX死时间校正', 'IDR-HDX解释边界审计', 'HDX热力学不可识别性判定'
        ],
        antiRepeatRule: '同一结构知识点重复出题时，必须至少更换“实验对象、结构测量技术、数据模态、扰动条件、判定目标”中的两项；不得直接复用固定叙事链。',
        scaffoldingTransitionRule: '跨模态组合必须有明确的物理约束映射：例如 HDX-MS→溶剂可及性/氢键稳定性，smFRET/DEER→距离分布，XL-MS→上限距离，Cryo-EM→空间密度，MD/MSM→时间演化与自由能；禁止无因果地把不同模态结论简单投票。',
    },
    antiPatternStrategies: [
        '【S1｜局部分辨率门控】先读取全局FSC，再逐区检查 local resolution、Q-score、map-model CC 与侧链化学环境；若配体口袋局部分辨率不足，必须降级为“候选模型”而非确定结构。',
        '【S2｜半图交叉验证】涉及冷冻电镜精修时，要求用独立 half-map 检查模型偏置；若同一模型对两张 half-map 的拟合差异异常，触发过拟合或过度sharpening审计。',
        '【S3｜晶体接触反证】给出晶体中漂亮二聚体界面但溶液SEC-MALS为单体的数据，要求判定晶体接触伪迹，并设计突变/交联/小角散射补证。',
        '【S4｜占有率-B因子可辨识性】在弱配体密度中同时给 occupancy 与 B-factor 异常值，要求先判断参数耦合不可辨识，再决定是否需要固定B因子、omit map 或独立滴定数据。',
        '【S5｜pH-pKa微观状态门控】给出pH接近关键His/Asp/Glu pKa的活性中心，要求列举可能质子化微观状态并判断哪一状态能闭合氢键网络和催化几何。',
        '【S6｜多模态距离约束闭合】同题给smFRET、DEER、XL-MS与cryo-EM低分辨密度时，先把所有数据转成带误差的距离/体积约束，再判断单一刚体模型是否可能满足；不能满足时切换到多构象系综模型。',
        '【S7｜HDX与MD时间尺度审计】若HDX显示某环区长期保护而纳秒MD单帧暴露，要求识别时间尺度错配，禁止用单帧SASA推翻HDX保护因子。',
        '【S8｜AI结构先验反证】给出AlphaFold高pLDDT核心但低置信接口/PAE大的复合物预测，要求用界面保守性、交联距离、突变功能与实验密度验证，不得把预测复合物当作实验证据。',
        '【S9｜优先取向/Missing Wedge陷阱】给出取向分布高度偏斜和各向异性FSC，要求判断某方向密度拉伸是否为取样伪迹，并提出倾斜采集、改变网格/去污剂或多体精修方案。',
        '【S10｜膜环境因果闭合】膜蛋白题必须锁定脂质/去污剂/nanodisc环境；若构象变化依赖膜厚度、曲率或特定脂质结合，禁止把水溶液或胶束结构直接外推到原生膜功能态。',
        '【S11｜TR-SFX时间窗配平】时间分辨题先比较泵浦-探测延迟、混匀死时间、化学键变化寿命和晶体光损伤时间；时间窗不匹配时不得声称捕获真实中间体。',
        '【S12｜自由能-速率分账】同题给构象占有率和转换速率时，分别用Boltzmann关系估算ΔG、用过渡态理论/Markov模型估算能垒；禁止用占有率直接代替速率。',
        '【S13｜整合建模误差模型】整合结构题必须声明每类约束的噪声模型与权重来源；若一个高噪声模态与高分辨密度冲突，应触发权重/外点审计而非简单平均。',
        '【S14｜去模板化总控】以上策略只能作为组合约束，不得整句复现为题干；每次生成结构生物学题至少更换对象、技术、数据形式、扰动条件和目标中的两项，并保证几何、热力学与实验误差链条闭合。',
        '【S14b｜结构贡献态筛选】构象占比题必须先用几何位阻、活性位点可及性、膜孔导通性或构象特异功能参数筛选真正贡献实验信号的状态，再把有效态比例映射到AFM峰面积、酶活、结合读数或电流；禁止只算最稳定态比例后直接当作功能输出。',
        '【S15｜HDX逐肽段back-exchange门控】HDX校正题必须给每个肽段的sequence、undeuterated mass、fully deuterated control、observed centroid masses与重复实验；要求逐肽段计算retention/back-exchange fraction、corrected uptake和误差传播，明确禁止全局校正因子。',
        '【S16｜EX1参数可辨识性门控】EX1题必须从isotopic envelope时间序列而非单条uptake curve出发，同时拟合或审计k_op、k_cl、k_int；若多事件重叠，要求报告ill-posed原因、参数相关性和可接受参数族，而不是强行给唯一数值。',
        '【S17｜tr-HDX模型选择门控】毫秒级HDX题必须把EX1、EX2、EXS、Chevron或burst-phase作为候选模型，用AIC/BIC/F-test、残差结构和replicate variability选择模型；禁止只凭曲线“像不像”给机制结论。',
        '【S18｜IDR-HDX过度解释反制】IDR题应给序列、电荷图案、proline分布、disorder score、peptide coverage和apo/bound/PTM多状态uptake；要求输出哪些结论可支持、哪些必须依赖NMR/SAXS/FRET补证，避免把保护变化直接翻译成稳定结构。',
        '【S19｜HDX自由能分账】若题目要求PF或ΔΔG_protection，必须先验证EX2假设与k_int来源；若进一步要求ΔH/TΔS，必须强制回答“HDX单独不可识别”并设计ITC、DSC或temperature-dependent HDX补充实验。',
    ],
},

    // 生物物理学
   'biophysics-advanced': {
        name: '高级生物物理学与定量细胞力学',
        keywords: [
            '生物物理', '膜电位', '离子通道', '质子通道', 'HVCN1', '电压门控质子通道', 'ΔpH门控', '质子选择性', '门控电荷', '开放概率', '电化学势', '表面电势', '表面pH', '布朗运动', '分子马达', '单分子拉伸', '光镊', 
            '原子力显微镜', 'AFM', '自由能景观', '蠕虫链模型', 'WLC', '兰道尔原理', '动力学力谱', 
            '朗之万方程', '涨落耗散定理', '泊松-玻尔兹曼方程', '逆转电位', '液接电位', 'Henderson方程', '动能校正', 'Kinetic Proofreading', '离子通道Markov模型', '单通道记录', 'dwell time', '捕获键',
            'Bell模型', 'Dembo模型', '三态捕获键', 'Jarzynski等式', 'Fokker-Planck方程', 'Lorentzian噪声谱', '光镊刚度校准', '功率谱校准', '漂移校正', '力曲线分析',
            'Debye-Hückel近似', 'Gouy-Chapman边界', 'GHK电流方程', '平衡-非平衡解耦', 'cantilever compliance'
        ],
        reasoningType: 'conservation' as ReasoningType,
        reasoningNote: '非平衡态热力学与统计力学多重守恒/平衡逻辑：核心推理链为“微观热涨落统计确立自由能景观概率分布（Boltzmann因子约束） → 施加宏观外力/电位梯度打破平衡 → 驱动力与通量产生非线性流耦合（GHK方程或Onsager关系） → 最终通过分子级布朗棘轮转化为定向机械功或信息熵减”。命题时需严格约束低雷诺数（Low Reynolds number）环境，强制区分由热力学驱动力决定的平衡基态，与由涨落耗散及动力学势垒决定的非平衡态。',
        levels: {
            basic: '扩散与渗透的物理本质与Fick第一定律，膜电位的经典Nernst方程推导，ATP水解的宏观自由能释放，均方自由程与布朗运动概念。',
            intermediate: '静态Goldman-Hodgkin-Katz（GHK）电压方程判读，分子马达（驱动蛋白、肌球蛋白）的“行进（Processivity）”与步长特征，线性弹性力学在细胞膜弯曲刚度中的应用，单分子荧光共振能量转移（FRET）的空间距离测定原理；能区分 HH 门控变量模型与离子通道离散 Markov 状态模型（Closed/Open/Inactivated）及开放概率 $P_O$。',
            advanced: '基于泊松-玻尔兹曼（Poisson-Boltzmann）方程的细胞表面双电层静电势分布推导，多肽链伸展的统计力学蠕虫链（WLC）模型与持续长度（Persistence Length）估算，不平衡离子流引起的GHK电流方程整流效应（Rectification），分子动力学模拟中拉伸自由能剖面（Free Energy Profile）的积分计算；离子通道 Markov master equation、dwell-time 分布、最大似然/隐马尔可夫拟合的可辨识性判断；HVCN1 中膜电压、跨膜 $\Delta pH$ 与质子电化学势共同决定开放阈值与质子流方向的判定。',
            competition: '① 随机涨落定理：在单分子非平衡态拉伸实验中，利用Jarzynski恒等式从不可逆功的统计分布中精确重构平衡态自由能变（$\\Delta G$）的推导计算；② 跨膜非线性流：patch-clamp在强电压钳制下，膜电流从线性欧姆定律向GHK动力学整流弯曲的通量分叉与反转电位漂移异常判读；③ 聚合物力学边界：高力负载下双链DNA从熵弹性拓扑转换至焓变刚性拉伸（WLC模型失效与B-to-S相变）的力学曲线拐点解析；④ 信息热力学错配：Hopfield动能校正（Kinetic Proofreading）机制中，利用连续高能磷酸键水解（GTP/ATP）维持非平衡态稳态，将翻译/复制错误率逼近兰道尔（Landauer）信息擦除热耗散极限（$k_B T \\ln 2$）的定量动力学推导；⑤ 分子马达布朗棘轮：利用一维非对称不对称势垒（Onsager限制）定量推导分子马达停滞力（$F_{\\text{stall}}$）与负载效率的数学分叉，以及整合素等复杂粘附分子在机械负载下从滑移键（Slip bond）向捕获键（Catch bond）拓扑转换的逆直觉寿命曲线解析；⑥ 捕获键动力学力谱模型选择陷阱：在给定加载速率与寿命数据下，必须比较双态/三态 Bell 与 Dembo（clamped-filament）边界，错误模型会导致 $x_\\beta$、$x^\\ddagger$ 系统性偏移；⑦ WLC 与 catch bond 耦合分离陷阱：同一AFM曲线中平衡熵弹性（低力区）与非平衡解离（高力区）需分区拟合并修正 cantilever compliance，禁止将WLC残差误并入解离势垒；⑧ PB-膜电位-GHK 级联陷阱：非线性PB在高表面电荷密度下不得偷换为 Debye-Hückel，且 Gouy-Chapman 边界符号必须先验锁定，否则 E_rev 与 I-V 曲线极性整体翻转；⑨ 分子马达效率与兰道尔比较陷阱：由朗之万/Fokker-Planck稳态求得速度-力关系后，需区分总水解自由能与可用机械通道功，避免把 $k_BT\\ln2$ 当作可直接替代的效率上限；⑩ FDT 噪声谱适用域陷阱：有膜电位驱动时需检查近平衡条件，电流谱应先拆分热噪声、门控 Lorentzian 与 1/f 背景后再反推时间常数；⑪ 离子通道 Markov/HMM 可辨识性陷阱：同一宏观 I(t) 可由多套 $C_1\rightleftharpoons C_2\rightleftharpoons O\rightleftharpoons I$ 状态网络解释，必须同时利用电压阶跃、单通道 dwell-time、开放概率 $P_O$ 与 detailed balance 约束；若只用 HH 拟合宏观电流，会把失活态、闭合态与电压依赖速率混成不可解释参数；⑫ HVCN1 质子通道门控陷阱：HVCN1 的质子流方向由质子电化学势决定，但开放阈值同时受膜电压、$pH_i/pH_o$、$\Delta pH$、门控电荷与二聚体/构象状态影响；禁止把它简化成普通 GHK 被动质子漏通道；⑬ 光镊/AFM 实验链条陷阱：原始 detector voltage 不能直接当作力，必须经过位移标定、trap/cantilever stiffness 校准、漂移/带宽修正、instrument compliance 扣除，再分离 WLC 平衡段与 Bell/Dembo 解离动力学段。'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '非平衡单分子力谱下“功分布→自由能重构”与跨膜离子流整流（GHK）在电-力耦合边界条件下的联合反演。',
        forbiddenErrors: [
            '【低雷诺数条件忽略】细胞尺度流体环境通常处于低雷诺数区（Re ≪ 1）；严禁将惯性主导的宏观流体直觉直接套用到分子马达与膜附近流动。',
            '【Nernst/GHK 适用域混用】Nernst 仅对应单离子平衡电位，GHK 对应多离子通透非平衡稳态；严禁在多离子同时通透场景中用单离子 Nernst 直接替代膜电位。',
            '【Jarzynski 均值误读】Jarzynski 恒等式要求对 $e^{-W/k_BT}$ 取平均而非对功 $W$ 直接取算术平均；严禁将不可逆功均值直接当作平衡自由能差。',
            '【捕获键模型默认双态】严禁在未做模型比较（双态/三态 Bell、Dembo）时直接锁定双态捕获键；模型误选会导致势垒参数不可比。',
            '【平衡/非平衡贡献混算】严禁将 AFM 力-延伸中的平衡WLC贡献直接并入非平衡寿命拟合；必须先做分区与仪器顺应性修正。',
            '【PB 边界条件符号漂移】严禁在 Gouy-Chapman 边界使用未声明符号约定；z=0 处边界符号错误会使后续 E_rev 与 I-V 结论整体反向。',
            '【体相/表面电化学势重复计数】涉及 PB 表面电势、膜电位与反转电位时，必须在同一电势参照系下计算离子电化学势；若已用 Boltzmann 平衡把表面电势折算进局部浓度/表面 pH，后续不得再把同一表面电势或体相膜电位重复叠加到同一项中。体相↔表面处于局部平衡时，化学势项与静电势项应相互抵消，净跨膜驱动力只能来自两端口真实电化学势差。',
            '【动力学势垒误改热力学方向】PMF 鞍点、开放态能垒或通道前庭势垒只影响速率/通量大小，不改变由电化学势差决定的反转点与净流向；严禁用 kBT 级能垒修正 Nernst/GHK 反转电位或热力学驱动力方向。',
            '【膜电位符号约定缺失】凡计算 E_rev、Vm−E_rev 或 ΔG 时，题干和答案必须显式锁定 Vm 的定义、离子流正方向以及 ΔG 的转运方向；禁止在中途切换 Vin−Vout 与 Vout−Vin 约定。',
            '【非平衡FDT直接套用】存在持续膜电位驱动时，未经近平衡检验不得直接调用平衡FDT反推噪声谱参数。',
            '【跨尺度量纲偷换】严禁在未显式列出单位换算关系的情况下跨单分子尺度、摩尔尺度与宏观 SI 单位直接相加减；pN·nm、J、kcal/mol、$k_BT$、$RT$、mV、V、pA、mol/s 等必须先完成量纲闭合。',
            '【非线性 PDE 解析解伪造】非线性 PB、Fokker-Planck、反应-扩散或复杂边界漂移扩散方程，除非题干明确限定为一维稳态、弱电势 Debye-Hückel 线性近似、常系数或可分离边界条件，否则严禁要求或给出全局闭式解析解；应改为局部近似、无量纲化、边界条件判定、数值求解流程或临界点渐近分析。',
            '【HH/Markov 模型混同】HH 的 m/h/n 门控变量是现象学连续变量，Markov 模型是离散构象状态主方程；严禁把 HH 拟合参数直接解释为唯一微观状态转移速率。',
            '【HVCN1 被动漏通道化】HVCN1 是电压门控质子通道，开放门控受 $V_m$ 与 $\Delta pH$ 耦合调制；严禁只用 Nernst/GHK 判断质子流而完全忽略开放概率与门控阈值。',
            '【液接电位与动能校正混名】液接电位（liquid junction potential）修正与 Hopfield kinetic proofreading 不是同一概念；凡题目写“动能校正”必须明确指 kinetic proofreading，若指电生理校正应写液接电位/Henderson 修正。',
            '【原始实验信号直当物理量】光镊/AFM/patch-clamp 原始电压信号不得直接当作力、电流或距离；必须声明校准系数、滤波带宽、基线/漂移处理与仪器顺应性修正。',
            '【跨实验模态参数误配】同量纲参数若来自不同实验模态、样品条件或时间窗口，不得自动迁移到目标模型；结构谱学参数、动力学标定参数和功能读出参数必须分别说明来源、适用窗口和排除理由。',
            '【变量作用层级错置】自由能、占据率、条件构象概率、局部遮挡概率、状态特异速率和总体功能输出不得混作同一层变量；严禁把调控自由能直接乘入本征Kd，或把条件子集比例直接当总体可进入分数。',
            '【未标定读出通道并入】多通道动力学题中，只有题干明确标定的产物、状态或探针响应可进入最终读数；未标定的反向通道、bulk ROS、表达量、三重态产物或淬灭产物不得自行构造成净效应。',
        ],
        parameterConstraints: {
            thermal_energy_scale: '室温（约 298–310 K）下热能标度 $k_B T$ 约 4.1 pN·nm（≈0.6 kcal/mol）；若题目力学做功量级远低于该量级却宣称稳定定向驱动，需给出额外能量来源。',
            membrane_capacitance: '生物膜比电容通常约 1.0 μF/cm²；膜电荷-电压换算必须与膜面积一致，不得随意设定失配电容。',
            diffusion_coefficient_scale: '小分子在水中的扩散系数常见量级约 10⁻¹⁰–10⁻⁹ m²/s；显著偏离需说明介质黏度、拥挤效应或结合态限制。',
            afm_optical_tweezer_force_range: '光镊/AFM 单分子拉伸常见力区约 pN–nN；超出量级而仍声称分子结构无相变需提供合理材料与实验条件说明。',
            loading_rate_range: '单分子动力学力谱常用加载速率通常在约 1–10^5 pN/s；若超出该范围需显式说明反馈带宽与时间分辨率约束。',
            channel_size_pb_validity: '纳米通道（~1 nm）内若Debye长度与孔径同量级，连续介质PB近似可能失效；使用PB前需声明适用条件。',
            noise_spectrum_identifiability: '拟合 Lorentzian 谱时采样频带上限应至少高于截止频率约1个数量级，否则 τ 与幅值参数不可辨识。',
            temperature_consistency: '题干必须显式锁定绝对温度 T；一旦选择 298 K、300 K 或 310 K，后续 $k_BT$、$RT/F$、Nernst 斜率、Boltzmann 因子和 Jarzynski 指数项必须保持数值联动一致，不得发生跨步温标漂移。',
            electrochemical_gauge_consistency: 'PB 表面电势、电压钳 Vm、局部 pH/活度与 E_rev 必须使用同一电势零点和同一跨膜方向；对处于体相-表面局部平衡的一价离子，$a_s=a_{bulk}\\exp(-zF\\psi_s/RT)$ 与 $\\phi_s=\\phi_{bulk}+\\psi_s$ 联立时表面项应在电化学势中抵消，禁止产生两套互相矛盾的 E_rev。',
            liquid_junction_potential_scale: '常见电生理液接电位偏差可达数 mV 至十余 mV；若题目比较的 E_rev 漂移仅为同量级，必须声明是否已做 Henderson/软件 LJP 修正。',
            markov_rate_identifiability: '离子通道 Markov 模型中状态数、转移速率、电压依赖形式与采样带宽必须共同约束；若只给单一宏观 I–V 曲线，通常不足以唯一反推出完整状态网络。',
            hvcn1_ph_voltage_gate: 'HVCN1 的激活阈值应随跨膜 $\\Delta pH$ 系统性移动；若设定 pH 梯度显著变化但开放阈值完全不变，需说明突变体、固定门控或实验控制条件。',
            optical_trap_psd_bandwidth: '用 Lorentzian PSD 标定光镊刚度时，采样频带必须覆盖 corner frequency 附近并考虑探测器滤波；否则 trap stiffness 与阻尼系数不可可靠分离。',
            conditional_probability_reference_set: 'MD帧数、构象闭合比例、局部排斥比例和功能可进入分数必须标明母集；P(C|B)、P(repulsion|B,C)等条件比例不得直接替代总体概率或最终读出。',
            effective_stimulation_window: '光刺激、微流控切换或周期性扰动题必须声明有效事件产生窗口、循环次数、暗间隔是否产生事件、共同背景是否抵消；分子产率映射到细胞读数时必须使用累计有效剂量。',
            selective_readout_channel_lock: 'ROS、Ca2+、电流、报告基因或LC-MS等读出必须锁定题干标定通道；若多产物通道未给定等量反向关系，不得使用YS-YT、总产率或未标定通道差分作为最终信号。',
        },
        generationChainSuggestions: [
            '按“参数来源/实验模态 → 变量作用层级 → 机制中介变量 → 标定读出”组织构题，避免把同量纲参数跨模态直接迁移。',
            '涉及时序、光刺激或微流控切换时，先确定有效窗口、循环次数和共同背景，再累计剂量或事件数并锁定读出通道。',
            '涉及状态概率、构象特异速率或产率函数时，先计算模型中介变量，再通过题干标定映射到细胞电流、ROS、Ca2+、酶活或峰面积。',
        ],
        diversityScaffolding: {
            objectVariants: [
                '双链DNA与B-to-S相变', 'RNA发卡结构', '内在无序蛋白（IDR）', '膜蛋白连接肽',
                '糖萼/多糖链', '整合素-配体复合物', '离子通道选择性滤过孔', '分子马达-微管/肌动蛋白体系'
            ],
            measurementTools: [
                'AFM单分子力谱', '光镊', '磁镊', 'patch-clamp电压钳', 'smFRET',
                '微流控扩散室', '高速荧光追踪', '噪声谱分析'
            ],
            dataModalities: [
                '力-延伸曲线', 'rupture force histogram', 'dwell time分布', '单通道 open/closed 时间序列', 'I–V曲线',
                '反转电位漂移序列', '功分布直方图', 'FRET效率时间轨迹', 'Lorentzian噪声谱'
            ],
            perturbationTypes: [
                '加载速率变化', '盐浓度/离子强度改变', 'pH突变', '$\Delta pH$ 阶跃', '温度扰动',
                '膜电位阶跃', '局部黏度或拥挤效应改变', '表面电荷密度变化', 'ATP/GTP供能水平改变'
            ],
            questionStyles: [
                '参数估计', '模型判别', '反证错误拟合', '预测曲线变化',
                '多模态一致性校验', '量级审计', '阈值分叉判断', '误差传播分析'
            ],
            antiRepeatRule: '同一知识点重复出题时，必须至少更换“实验对象、测量工具、数据形式、扰动条件、问题目标”中的两项；不得直接复用 antiPatternStrategies 的完整叙事链。',
            scaffoldingTransitionRule: '禁止无物理因果的机械拼接。若同题组合来自不同维度池，必须给出明确的力学、电学、热力学、流体或化学势耦合通道，使实验对象、测量工具、扰动条件与数据形式形成闭合因果链；例如 AFM 单分子力谱若与膜电位阶跃同题出现，必须通过机械敏感通道、膜张力改变或电-力耦合边界条件完成机理闭合。',
        },
        antiPatternStrategies: [
            '【S1｜对应C1/C3：定量门控推理】在关键分叉处强制计算无量纲比值：Péclet 数（对流/扩散）、$W/k_BT$（外功/热噪声）、离子驱动力 $(V_m-E_{ion})$；未过阈值时禁止判定为稳定定向过程。',
            '【S2｜对应C2/C8：非标准电生理场景】用“局部离子浓度重分布 + 高频电压钳 + 通道状态依赖通透率”替代教科书固定通透率情景，要求判断 I–V 曲线由近线性向 GHK 整流弯曲的转折点。',
            '【S3｜对应C1：Jarzynski 多步数值级联】外力加载速率 → 功分布宽度 → $e^{-W/k_BT}$ 指数平均 → Jarzynski 重构偏差 → 估计 $\\Delta G$ 置信区间；任一步误差都应显式传播，禁止一步到位给确定值。',
            '【S4｜对应C5/C9：强制反证回溯】给出“平均输入功增加但有效机械输出下降”的反常现象，要求反向定位是热耗散增大、构象陷阱加深、马达停滞力接近负载，还是通道反转电位漂移导致的效率塌陷。',
            '【S5｜对应C6：捕获键模型比较先行】涉及捕获键时，先列候选模型（双态Bell/三态Bell/Dembo）与可辨识参数，再根据数据维度判定可识别性，禁止先拟合后补模型解释。',
            '【S6｜对应C3/C7：平衡-非平衡解耦门控】AFM联合题必须先分离低力区WLC平衡段与高力区解离动力学段，再做 cantilever compliance 修正与耦合反演；若未分区直接全曲线联合拟合，判为方法失效。',
            '【S7｜对应C8：PB→GHK 串联符号与参照系审计】先固定电势零点、法向方向、表面电荷符号、体相/表面电位关系、Vm 定义和离子流正方向，再求 PB 势分布、局部活度、$E_{rev}$ 与 I–V；若使用 Boltzmann 关系把表面电势折算为局部浓度，必须在电化学势表达式中检查表面化学项与静电项是否抵消，禁止把表面电势和体相膜电位双重计数。任何一步正负号或参照系未显式定义即视为不可验证推理。',
            '【S8｜对应C10：噪声谱三分量拆解】FDT题先显式拆分热噪声、门控Lorentzian、1/f背景并给出频带拟合策略；禁止用单一白噪声模型覆盖全频域。',
            '【S9｜对应C4/C9：信息热力学与机械功分账】题面同时给 ATP/GTP 水解自由能、错误率或速度-力曲线时，必须分别核算总化学自由能、信息擦除下限 $k_BT\\ln2$、实际可用机械通道功与耗散项，禁止把 Landauer 下限误当作马达效率上限。',
            '【S10｜对应C2/C8/C10：跨模态一致性校验】同一题若同时给 patch-clamp I–V、离子浓度、噪声谱与表面电荷参数，必须检查 $E_{rev}$、整流方向、Lorentzian 时间常数、PB 边界、体相/表面电化学势参照系是否同向闭合；任一模态冲突应触发回溯而不是强行平均。',
            '【S11｜对应C11：离子通道 Markov/HMM 反演门控】给出电压阶跃宏观电流 + 单通道 dwell-time 或 open probability 数据，要求先判定 HH 是否足够，再选择最小 Markov 状态网络并检查 detailed balance、采样带宽和参数可辨识性；禁止只凭 I–V 曲线反推出唯一微观机制。',
            '【S12｜对应C12：HVCN1 pH-电压联合门控】同题同时给 $pH_i/pH_o$、$V_m$、E_H、开放阈值漂移和突变/二聚体条件，要求分别判断“质子流方向”和“通道是否开放”；AI 若把 HVCN1 当作普通被动通道，会只答 Nernst 方向而漏掉门控分叉。',
            '【S13｜对应C13：实验校准链条审计】光镊/AFM 题面优先给原始探测器电压、PSD corner frequency、cantilever/trap stiffness、加载速率和漂移背景，要求完成 signal→displacement→force→model fitting 的闭合链条；任一校准步骤缺失时不得进入 WLC/Bell 参数解释。',
            '【S14｜变量层级与母集审计】同题给自由能、构象占据率、MD条件子集和功能读数时，必须先画出变量作用层级：调控变量影响哪一状态，条件概率的母集是什么，最终总体量如何由全概率或集合加权得到；禁止把局部比例或调控自由能直接塞入本征Kd/整体速率。',
            '【S15｜模型中介变量到读出映射】涉及产率函数、状态概率或构象特异速率时，必须先计算模型中介变量（如ΦS、ΣP_i v_i、有效态比例），再通过题干标定映射到细胞电流、ROS、Ca2+、酶活或峰面积；禁止用参数差值、单态概率或自由基对总数直接替代实验信号。',
            '【S16｜累计有效窗口与选择性通道】周期刺激、滤光片切换或有限光闸题必须核对有效窗口、循环次数、暗间隔和共同背景抵消；多通道S/T/淬灭/残留产物题必须只使用题干标定的读出通道，未标定通道只能作为干扰或观察项。',
            '【S17｜总控：开放组合与去模板化】以上所有策略只提供约束方向，不得整句复现为题干；允许围绕新实验体系、新分子对象、新边界条件自由组合，但必须遵守 forbiddenErrors、parameterConstraints 与 diversityScaffolding。同一知识点重复出题时，至少更换“实验对象、测量工具、数据形式、扰动条件、问题目标”中的两项。',
        ],
    },

    // 计算生物学
    'computational-biology': {
        name: '计算生物学',
        keywords: ['计算生物学', '基因组注释', '隐马尔可夫模型', '机器学习', '群体遗传学', '统计模型', '算法', '基因预测', '蛋白质功能预测', '网络分析', '多组学'],
        reasoningType: 'probability' as ReasoningType,
        reasoningNote: '概率逻辑：计算生物学将生物问题转化为统计/优化问题，隐马尔可夫模型（HMM）用于序列注释与基因预测，贝叶斯框架整合先验知识与实验数据；算法输出必须结合统计显著性（p值/FDR/E-value）评估，避免过拟合是模型选择的核心约束。',
        levels: {
            basic: '序列数据库检索（BLAST的E-value含义），基因组注释流程概述，基本统计概念（假设检验、多重校正）',
            intermediate: '隐马尔可夫模型在基因预测中的应用，RNA-seq差异表达分析（DESeq2/edgeR原理），系统发育树的构建算法（NJ/ML/贝叶斯），蛋白质互作网络分析',
            advanced: '基因组变异检测与功能注释（GWAS分析逻辑），单细胞RNA-seq数据降维与聚类（PCA/UMAP/t-SNE），群体遗传学统计量（Fst、LD、选择清除），机器学习在功能基因组学中的应用',
            competition: '深度学习在基因组学中的应用（CNN识别调控元件、Transformer在蛋白质预测中的原理），空间转录组数据分析，多组学数据整合（因果推断框架），算法复杂度分析与大规模数据处理策略'
        },
        // ── v2 新增字段 ──────────────────────────────────────────────────
        peakDifficulty: '在高维稀疏数据、模型偏差、算法复杂度、训练集偏移和生物先验共同约束下，构建可解释且可验证的计算生物学推断链。',
        forbiddenErrors: [
            '【算法准确率脱离基线】分类或预测模型必须与随机、主成分、线性模型或领域基线比较；不得只报单一高准确率。',
            '【批次效应当生物信号】单细胞、空间组学或多组学分析必须检查批次、平台和样本来源；聚类不等于真实细胞类型。',
            '【黑箱模型无验证】深度模型的高分预测必须用独立数据、实验验证或不确定性估计支撑，不得直接当生物事实。',
        ],
        parameterConstraints: {
            train_test_split_independence: '训练/验证/测试集必须在样本、个体、同源序列或批次层面独立；重复测量泄漏会虚高性能。',
            single_cell_qc_gate: '单细胞分析需检查低UMI、高线粒体比例、doublet和批次效应；未质控的聚类结论不可直接解释。',
            complexity_data_scale: '算法复杂度必须与数据规模匹配；O(n²)或O(n³)方法用于超大样本时需说明近似、采样或分块策略。',
        },
        generationChainSuggestions: [
            '按“数据来源/QC → 特征构造 → 模型或统计假设 → 验证策略 → 生物解释”组织题干。',
            '涉及深度学习或多组学整合时，先设置训练分布、缺失模式和独立验证，再判断结论是否可迁移。',
        ],
        diversityScaffolding: {
            objectVariants: ['基因调控预测模型', '蛋白功能预测', '单细胞聚类', '空间转录组解卷积', 'GWAS风险评分'],
            measurementTools: ['scRNA-seq流程', 'Transformer蛋白模型', '图神经网络', '贝叶斯模型', '因果推断框架'],
            dataModalities: ['特征矩阵', '嵌入空间图', '混淆矩阵', 'ROC/PR曲线', '空间表达图'],
            perturbationTypes: ['训练域偏移', '批次效应', '缺失值模式变化', '类别不平衡', '同源序列泄漏'],
            questionStyles: ['模型选择', '泛化审计', '复杂度评估', '因果解释边界', '多组学证据整合'],
            antiRepeatRule: '同一计算题重复时必须更换数据模态、模型类别和验证目标。',
            scaffoldingTransitionRule: '算法输出必须通过统计假设、验证数据或生物机制连接到结论；禁止把模型分数直接等同实验事实。',
        },
        antiPatternStrategies: [
            '【泄漏型高分】给出近重复样本或同源序列混入测试集，要求识别为何AUC虚高。',
            '【聚类标签陷阱】给出UMAP分群但marker相互矛盾，要求判断是批次效应、doublet还是真实亚型。',
            '【复杂度不可行】给出百万细胞或全基因组矩阵，要求判断所选算法是否需近似或稀疏化。',
        ]
    },
    
    // 量子生物学
    'quantum-biology-advanced': {
        name: '前沿量子生物学与开放量子系统动力学',
        keywords: [
            // 核心量子力学与统计物理概念
            '量子生物学', '量子相干性', 'Quantum Coherence', '退相干', 'Decoherence', '量子隧穿', 'Tunneling',
            '自旋动力学', 'Spin Dynamics', '量子纠缠', '自由基对机制', 'Radical Pair', '自由基对反应', '零场分裂', 'ZFS',
            '超精细相互作用', 'Hyperfine Interaction', '泡利不相容原理', '自旋单重态-三重态转换', 'S-T转换', 'Zeeman效应',
            'g张量各向异性', '各向异性超精细张量', '交换相互作用', '偶极相互作用', '自旋轨道耦合', '系间窜越',
            // 开放量子系统与耗散动力学
            '开放量子系统', 'Open Quantum Systems', '密度矩阵', 'Density Matrix', '冯诺依曼方程',
            '林德布拉德主方程', 'Lindblad Master Equation', '量子主方程', 'Redfield方程', 'HEOM', '层级方程',
            '非马尔可夫效应', 'Non-Markovian Dynamics', '谱密度', 'Spectral Density', '热浴关联时间', '重组能',
            'Vibronic Coupling', '振动激子耦合', '振动相干', '相干性保护机制', 'Decoherence Shielding',
            '环境辅助量子传输', 'ENAQT', '量子棘轮', 'Marcus理论', 'Marcus-Hush', 'PCET', '质子耦合电子转移',
            // 生物分子物理系统与应用场景
            '光合作用能量传递', 'FMO复合物', 'Fenna-Matthews-Olson', 'LHCII', '反应中心', '激子传导', 'Exciton Transport',
            '磁受体生物学', '隐花色素', 'Cryptochrome', 'Cry4', 'FAD自由基', 'FAD-Trp三联体', '候鸟磁导航',
            '量子嗅觉模型', '红外振动谱识别', '非弹性电子隧穿', 'IETS', '酶催化质子隧穿',
            'Kinetic Isotope Effect', 'KIE', '一级同位素效应', '二级同位素效应', '隧穿同位素效应',
            'DNA自发突变隧穿', 'Löwdin突变模型', '互变异构化', '氢键质子转移', '生物发光量子产率',
            '氮酶电子转移', '金属蛋白电子隧穿', '呼吸链电子转移', '光受体超快光异构化'
        ],
        reasoningType: 'constraint' as ReasoningType,
        reasoningNote: '开放量子系统热相干与耗散选择逻辑：核心推理链为“生物分子局域结构定义电子/振动/自旋低维哈密顿量 → 蛋白质、脂质、水和声子热浴通过谱密度、重组能与关联时间施加随机扰动 → 相干振荡、隧穿或自旋混合在退相干、弛豫、复合与反应陷阱之间竞争 → 只有当退相干时间、传输/反应时间、热浴记忆时间和生物构象涨落时间尺度闭合时，量子效应才可对可观测产率、方向性或速率产生贡献”。命题必须强制区分：热力学自由能差决定终态倾向，量子相干/隧穿/自旋选择规则决定速率与通量分配；不得把“存在量子态”直接等同于“宏观生物功能由量子效应主导”。',
        levels: {
            basic: '量子力学基本波粒二象性、能级、波函数叠加与测量概念；生物分子中电子跃迁、振动能级与光吸收的弗兰克-康登原则；经典 Arrhenius 热激活与量子隧穿在概念上的区别。',
            intermediate: '量子相干与退相干的定性判读；酶催化 KIE 中氢/氘隧穿证据与经典零点能贡献的区分；光合捕光复合物中 FRET、Dexter 与激子耦合传输的适用条件；自由基对中单重态/三重态产物通道的自旋选择规则。',
            advanced: '用密度矩阵描述开放量子系统混合态演化，能在弱耦合近似下写出 Lindblad/Redfield 型主方程并判定适用域；用 WKB、Marcus/Marcus-Hush 或 PCET 框架估算酶/金属蛋白中的电子或质子隧穿速率；为隐花色素 FAD-Trp 自由基对构建包含 Zeeman、超精细、交换/偶极与复合项的最小自旋哈密顿量；为 FMO/LHC 激子网络建立站点能、耦合矩阵、谱密度与陷阱效率的定量关系。',
            competition: '① 非马尔可夫热浴与环境辅助量子传输（ENAQT）陷阱：在 FMO、LHCII 或反应中心激子网络中，必须比较退相干率 $\gamma$、站点能失谐 $\Delta E$、电子耦合 $J$、热浴关联时间 $\tau_c$ 与陷阱时间 $\tau_{trap}$；过小噪声导致局域化，过大噪声导致 Zeno 抑制，只有中间窗口提升效率。禁止把“相干越长效率越高”作为线性规则。\n\n② 隐花色素自由基对磁感应的弱场可辨识性陷阱：地磁场约 $25$–$65\,\mu T$，电子 Zeeman 能量远小于 $k_BT$，功能信号来自自旋相干混合与产物分支差异而非普通热平衡磁化。题目必须同时闭合超精细张量、自由基寿命、复合速率、外加 RF 场频率/幅度和取向平均；禁止用宏观洛伦兹力或热磁化解释候鸟磁导航。\n\n③ 酶催化 PCET 与 KIE 反演陷阱：高 KIE、温度依赖弱或异常 Arrhenius 曲率不自动证明“纯量子隧穿”；必须区分供受体距离门控、蛋白质促进振动、零点能差、非绝热电子耦合与经典构象选择。若要求反推 H/D 转移动力学，必须给出势垒宽度、有效质量、温度、供受体距离分布或可识别的替代参数。\n\n④ DNA 互变异构化隧穿与复制突变时间尺度陷阱：Löwdin 型质子转移只能在碱基配对寿命、复制叉开放时间、聚合酶选择/校对时间和水溶剂退相干时间共同闭合时影响点突变率；禁止把瞬时隧穿概率直接等同最终突变概率，也禁止忽略互变异构体回隧穿和聚合酶校对。\n\n⑤ 量子嗅觉 IETS 模型可检验性陷阱：同位素替换导致振动频率改变并不必然证明量子嗅觉；题目必须区分形状/疏水性/受体结合亲和力变化与非弹性电子隧穿能量匹配，并给出电子能隙、振动频率、耦合强度、受体突变或同位素对照数据中的至少一类可检验证据。\n\n⑥ 量子-经典边界与退相干突变陷阱：必须计算或比较 $\tau_{dec}$、$\tau_{trans}$、$\tau_{bath}$、$\tau_{conf}$；若 $\tau_{dec}\ll\tau_{trans}$，相干相位不可作为功能机制；若 $\tau_{dec}$ 与传输时间同量级，则可考虑 vibronic 或非马尔可夫保护窗口。禁止用“生命体太热所以不可能有量子效应”或“量子效应存在所以宏观必然量子化”两种极端叙述。\n\n⑦ 多模型量子主方程适用域陷阱：Lindblad、Redfield、Förster、Haken-Strobl、HEOM 与 Marcus 理论假设不同；强耦合、结构化热浴或长记忆核场景下不能直接套用马尔可夫 Lindblad 闭式解。题目应要求先做无量纲/时间尺度审计，再选择最小可辨识模型。\n\n⑧ 实验信号解释边界陷阱：二维电子光谱振荡、瞬态吸收、磁场效应曲线、EPR/ODMR 或 KIE 数据均非量子机制的单独铁证；必须排除振动波包、热透镜、样品取向、光漂白、同位素改变酶构象、自由基副反应等伪迹，并用正交实验闭合。'
        },
        peakDifficulty: '在真实蛋白质热浴与构象涨落中，用开放量子系统模型同时反演激子/电子/质子/自旋动力学参数、退相干窗口和生物功能产率，并判定给定实验数据是否足以唯一支持量子机制而非经典或伪迹解释。',
        forbiddenErrors: [
            '【量子效应泛化】严禁因为对象是电子、质子或光子就断言宏观生物功能由量子相干主导；必须给出时间尺度、能量尺度和可观测量闭合。',
            '【退相干时间忽略】涉及相干传输、自旋相干或振动态相干时，必须比较 $\tau_{dec}$ 与传输/反应/复合时间；不得只描述相干存在而不检验其寿命是否足以影响功能。',
            '【热激活与隧穿混同】Arrhenius 越障、Marcus 电子转移、WKB 隧穿和 PCET 非绝热转移适用条件不同；严禁用单一指数公式包打所有速率。',
            '【Lindblad 万能化】Lindblad 主方程要求特定弱耦合、马尔可夫和完全正性假设；结构化蛋白热浴、强 vibronic 耦合或长记忆核下不得无审计直接套用。',
            '【相干越长效率越高误区】环境辅助量子传输存在最优噪声窗口；过强相干可能局域化，过强退相干可能 Zeno 抑制，严禁线性外推。',
            '【地磁能量与热能误判】地磁场 Zeeman 能量远小于 $k_BT$；磁受体机制依赖自旋动力学产率差而非热平衡磁化或宏观洛伦兹力。',
            '【自由基对寿命缺失】自由基对磁场效应必须给出或约束寿命/复合速率；寿命远短于 S-T 混合时间时不得声称可感知弱磁场。',
            '【KIE 过度解释】高 KIE 或温度依赖异常不能单独证明隧穿；必须排除结合构象改变、零点能差、pH/pKa 漂移和供受体距离门控。',
            '【瞬时隧穿概率等同突变率】DNA 质子隧穿题不得把单次互变异构化概率直接当最终突变率；必须考虑回隧穿、复制窗口、错配固定和校对修复。',
            '【二维光谱振荡单证据化】2D 电子光谱或瞬态吸收中的振荡不得直接判定为电子相干；需区分振动相干、脉冲伪迹、样品异质性和电子-振动混合态。',
            '【量纲和常数混乱】$k_BT$、$RT$、eV、cm⁻¹、meV、T、μT、ns、fs、ps 等必须显式换算；不得把单分子能量与摩尔能量直接相加。',
            '【开放系统概率不守恒】密度矩阵演化必须保持 trace、正定性和概率归一；加入陷阱/复合项时必须说明产率如何由损失通道积分得到。',
            '【经典对照缺失】声称量子机制优于经典模型时，必须至少给出一个经典对照模型（FRET/随机游走/Arrhenius/形状识别等）及其失败点。',
            '【产率函数跳过】自由基对或开放量子系统题不得把超精细耦合、退相干率、自由基对总数或单一参数差值直接映射为细胞读数；必须先计算扰动前后模型产率、状态通量或陷阱产率，再进入实验标定链。',
            '【未标定S/T通道差分】S/T/淬灭/残留等多通道产物不得默认以等量反向关系贡献ROS、电流、Ca2+或报告基因读数；只有题干明确标定的通道可进入最终差分。',
        ],
        parameterConstraints: {
            thermal_energy_room_temp: '室温 298–310 K 下 $k_BT\approx25$–$27\,meV\approx200$–$208\,cm^{-1}\approx0.6\,kcal/mol$；所有能级差、Zeeman 能、振动能必须与该标度比较。',
            geomagnetic_field_scale: '地磁场常见量级约 25–65 μT；若题设 mT–T 级磁场，应明确为实验外场而非自然磁导航条件。',
            electron_zeeman_scale: '电子旋磁比约 28 GHz/T；50 μT 对应约 1.4 MHz，自旋动力学题的 RF 干扰频率数量级必须与此相容。',
            hyperfine_scale: '有机自由基超精细耦合常见为约 0.1–10 mT（MHz 到百 MHz 量级）；若远超该范围需说明金属中心或特殊局域电子结构。',
            radical_pair_lifetime_gate: '弱磁场自由基对效应通常要求自由基寿命达到约 100 ns–10 μs 量级；ps 级寿命一般不足以产生地磁敏感 S-T 混合。',
            exciton_coupling_scale: '光合捕光复合物发色团间电子耦合常见约 10–100 cm⁻¹，站点能失谐与重组能通常为几十到数百 cm⁻¹；数量级异常需给出结构依据。',
            exciton_transfer_timescale: '捕光复合物激子传输常见 fs–ps 至百 ps 量级，荧光寿命通常 ns 量级；传输效率计算必须保证陷阱时间与损失时间可比较。',
            decoherence_timescale_gate: '室温生物环境电子/激子相干常见为 fs–ps 量级；若题目声称 μs 级电子相干，必须提供强屏蔽、低温或特殊自旋体系依据。',
            vibrational_frequency_units: '振动谱单位换算必须一致：1 cm⁻¹≈0.124 meV≈29.98 GHz；C-H/C-D 同位素替换频率应按约 $1/\sqrt{m}$ 标度移动。',
            proton_tunneling_distance: '酶中 H 转移供受体距离通常约 2.5–3.2 Å；隧穿概率对势垒宽度极端敏感，设定 >4 Å 仍高效隧穿需给出门控压缩或多步 PCET 机制。',
            kie_reasonable_range: '一级 H/D KIE 经典半经典常见约 2–7；显著大于 10 可提示隧穿或强耦合门控，但不得单独作为唯一证据。',
            density_matrix_validity: '密度矩阵必须满足 $Tr(\rho)=1$（或在显式陷阱/损失扩展中给出损失通道归一）、Hermitian 与正定性；产率需由通道通量积分而非任意概率相加得到。',
            marcus_inverted_region: 'Marcus 速率对 $\Delta G$、重组能 $\lambda$ 与电子耦合 $V$ 敏感；若 $-\Delta G>\lambda$ 进入 inverted region，禁止继续按放能越大速率越快线性外推。',
            radical_pair_readout_integration_window: '自由基对产率映射到细胞读数时，必须给出有效光照/反应窗口、循环次数、暗间隔和共同背景处理；不得把单次脉冲或单周期产率差直接当作全实验读数。',
            high_dimensional_master_equation_answerability: 'Liouvillian、HEOM或高维主方程数值题若不允许工具求解，必须提供可核验中间量、降维模型或明确的数值近似目标；否则应标记为工具允许型题而非手算能力边界题。',
        },
        generationChainSuggestions: [
            '按“微观扰动参数 → 产率/通量中介变量 → 分子数或浓度 → 生物读出阈值”组织构题，禁止把单一量子参数直接当宏观功能。',
            '自由基对或开放量子系统题先计算扰动前后产率、状态通量或陷阱产率，再进入有效窗口累计和标定读出。',
            '高维主方程题应把评分点放在模型适用域、初始态、可核验中间量和读出链路，而不是纯矩阵数值反演。',
        ],
        diversityScaffolding: {
            objectVariants: [
                'FMO捕光复合物', 'LHCII天线复合物', '细菌反应中心', '紫细菌LH1/LH2',
                '隐花色素Cry4自由基对', 'FAD-Trp三联体', '黄素酶自由基中间体', '脱氢酶PCET活性中心',
                '金属蛋白长程电子转移链', '氮酶FeMo-co因子', 'DNA A-T/G-C氢键质子转移', '视紫红质超快异构化',
                '嗅觉受体候选口袋', '生物发光荧光素酶', '线粒体呼吸链复合物电子转移路径'
            ],
            measurementTools: [
                '二维电子光谱', '瞬态吸收光谱', '荧光寿命/量子产率测量', 'EPR/ENDOR', 'ODMR',
                '磁场效应反应产率测量', '同位素替换KIE实验', '温度依赖速率测量', '超快泵浦-探测',
                '量子化学计算', 'QM/MM', '非绝热动力学模拟', 'HEOM/Redfield/Lindblad数值模拟'
            ],
            dataModalities: [
                '密度矩阵时间轨迹', '站点布居随时间曲线', '相干振荡衰减曲线', '2D光谱交叉峰振荡',
                '磁场强度-产率曲线', 'RF频率扰动曲线', 'EPR超精细谱线', 'KIE-温度曲线',
                'Arrhenius曲率图', '隧穿势垒PMF', '供受体距离分布', '自旋哈密顿量参数表',
                '经典模型与量子模型残差对比表'
            ],
            perturbationTypes: [
                '温度阶跃', '同位素替换（H/D、C-H/C-D）', '外加静磁场方向/强度改变', 'RF弱场干扰',
                '点突变改变发色团距离', 'pH/pKa改变', '溶剂黏度改变', '蛋白质柔性约束突变',
                '金属中心替换', '发色团能级失谐', '热浴谱密度改变', '低温冻结与室温对照'
            ],
            questionStyles: [
                '模型适用域审计', '时间尺度门控判断', '量级估算', '参数反演', '经典-量子模型判别',
                '退相干窗口计算', '产率分支积分', '伪迹排查', '实验设计补证', '多模态一致性校验'
            ],
            antiRepeatRule: '同一量子生物学知识点重复出题时，必须至少更换“生物系统、量子机制、实验工具、数据模态、扰动条件、判定目标”中的两项；不得反复复用 FMO+相干 或 隐花色素+地磁 的固定叙事链。',
            scaffoldingTransitionRule: '跨机制组合必须有明确物理耦合通道：激子问题需闭合发色团能级/耦合/热浴/陷阱；自旋问题需闭合哈密顿量/寿命/复合通道/磁场；隧穿问题需闭合势垒/有效质量/距离分布/构象门控。禁止把“量子相干、隧穿、自旋、纠缠”无因果地堆叠为题干装饰。',
        },
        antiPatternStrategies: [
            '【S1｜时间尺度门控】先列 $\tau_{dec}$、$\tau_{trans}$、$\tau_{trap}$、$\tau_{bath}$、$\tau_{conf}$ 或自由基寿命/复合时间，再判断量子机制是否能影响可观测产率；时间尺度不闭合时必须降级为经典或不可判定。',
            '【S2｜能量尺度审计】将 cm⁻¹、meV、eV、$k_BT$、Zeeman 能、超精细耦合统一单位后比较；若关键能量差远小于噪声或远大于耦合，禁止给出不受限制的强相干结论。',
            '【S3｜经典对照先行】每道声称“量子优势”的题必须先给出经典 FRET/随机游走/Arrhenius/形状识别模型的预测，再要求说明量子模型新增项如何解释残差。',
            '【S4｜ENAQT 噪声窗口】激子传输题设置低噪声、中噪声、高噪声三组参数，要求识别最优退相干窗口；AI 若默认相干越强越好会选错。',
            '【S5｜自由基对最小哈密顿量】磁感应题必须至少包含 Zeeman、超精细、复合速率与初始单重态；若给取向数据，还需处理各向异性张量和取向平均，禁止宏观磁力解释。',
            '【S6｜KIE 多因子拆账】酶隧穿题要求同时讨论零点能、供受体距离门控、蛋白促进振动、非绝热电子耦合和 pH/pKa；只凭 KIE 数值下结论判为过度解释。',
            '【S7｜主方程适用域选择】先根据系统-热浴耦合强度、谱密度结构与记忆时间选择 Lindblad/Redfield/HEOM/Förster/Marcus；不满足假设时不得给闭式解析解。',
            '【S8｜密度矩阵守恒检查】计算布居、相干项或陷阱产率后必须检查 trace、正定性、损失通道归一与产率不超过 1；概率不闭合则回溯模型。',
            '【S9｜二维光谱伪迹排查】2D 光谱振荡题必须比较电子相干、振动波包和 vibronic 混合候选模型，要求用温度、突变、同位素或偏振选择数据补证。',
            '【S10｜DNA突变窗口链条】DNA 质子隧穿题按“互变异构化 → 回隧穿竞争 → 复制掺入 → 聚合酶校对 → 错配修复”串联概率，禁止把第一步概率当总突变率。',
            '【S11｜量子嗅觉双盲对照】量子嗅觉题必须同时给同位素振动频率变化与结合/形状控制；若受体亲和力或疏水性也改变，不得唯一归因于 IETS。',
            '【S12｜自由基对读出链条】隐花色素/自由基对题必须按“参数扰动 → ΦS或通道产率 → 分子数/浓度 → 标定读出 → 阈值”串联；若题干有重复刺激或滤光片切换，必须累计有效窗口并处理共同背景抵消。',
            '【S13｜工具依赖数值降维】高维Liouvillian或主方程题若评测环境不允许工具，命题应提供中间产率、特征值、低维近似或误差界，把评分点放在模型适用性、初始态、单位和读出衔接，而不是纯矩阵数值反演。',
            '【S14｜总控：开放组合与去模板化】以上策略只提供约束方向，不得整句复现为题干；允许围绕新生物体系、新实验模态和新热浴边界自由组合，但必须遵守 forbiddenErrors、parameterConstraints 与 diversityScaffolding。',
        ],
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// 静态识别（保持向后兼容）
// ─────────────────────────────────────────────────────────────────────────────

export function identifyBiologyDiscipline(topic: string, disciplines: Record<string, DisciplineEntry> = getAllDisciplines()): string | null {
    const explicit = detectExplicitBiologyDiscipline(topic, disciplines);
    if (explicit) return explicit.disciplineKey;
    return getBiologyTopicCandidates(topic, 1, disciplines)[0]?.disciplineKey ?? null;
}

export function getBiologyDisciplineGuidance(topic: string, difficulty: string, disciplines: Record<string, DisciplineEntry> = getAllDisciplines()): string {
    const key = identifyBiologyDiscipline(topic, disciplines);
    if (!key) throw new Error(`无法通过静态规则识别生物学科：${topic}`);
    return buildGuidanceText(key, difficulty, false, disciplines);
}

// ─────────────────────────────────────────────────────────────────────────────
// 动态学科库（session 级别，运行时扩展）
// ─────────────────────────────────────────────────────────────────────────────

export interface DisciplineEntry {
    name: string;
    keywords: string[];
    semanticAliases?: Array<{
        aliases: string[];
        requiredSignals?: string[];
        forbiddenSignals?: string[];
    }>;
    hierarchy?: { discipline: string; module: string; path: string[] } | string;
    parentDiscipline?: string;
    parentModule?: string;
    topicType?: 'foundational-model' | 'specialized-model' | string;
    formulaCoverage?: Record<string, string[]>;
    callableFromDisciplines?: string[];
    crossDisciplinaryUseCases?: Array<{
        discipline: string;
        module?: string;
        path?: string[];
        useCase: string;
        constraints: string;
    }>;
    relatedSubfields?: Array<{
        discipline: string;
        module?: string;
        path?: string[];
        relation: string;
    }>;
    modelVariants?: string[];
    modules?: Record<string, {
        name: string;
        topicRefs?: string[];
        keywords?: string[];
        reasoningNote?: string;
        subtopics?: Record<string, {
            name: string;
            status?: string;
            ref?: string;
            note?: string;
            keywords?: string[];
        }>;
    }>;
    reasoningType: ReasoningType;
    reasoningNote: string;
    levels: { basic: string; intermediate: string; advanced: string; competition: string };
    isDynamic?: boolean;
    // ── v2 新增字段（可选，便于回退）──────────────────────────────────────
    /** 天花板级难度定位（1句话） */
    peakDifficulty?: string;
    /** 严禁出现的学术硬伤（负向护栏） */
    forbiddenErrors?: string[];
    /** 底层物理/生理常数死锁（防数值穿帮） */
    parameterConstraints?: Record<string, string>;
    /** 高防御出题策略素材（不写具体剧本，把组合权交给 Generator） */
    antiPatternStrategies?: string[];
    /** 本次人工确认的可选构题链路骨架；不得作为后续分析数据自动写入目标 */
    generationChainSuggestions?: string[];
    /** 多样性脚手架：用于同一知识点下更换对象/工具/数据/扰动/问法，降低重复题 */
    diversityScaffolding?: {
        objectVariants?: string[];
        measurementTools?: string[];
        dataModalities?: string[];
        perturbationTypes?: string[];
        questionStyles?: string[];
        subfieldVariants?: string[];
        modelVariants?: string[];
        antiRepeatRule?: string;
        scaffoldingTransitionRule?: string;
    };
}

/** 运行时动态创建的学科条目（session 内持久） */
const dynamicDisciplines = new Map<string, DisciplineEntry>();

/** 主题 → key 的 LLM 归一化缓存，避免重复调用 */
const topicResolutionCache = new Map<string, string>();

/** 返回所有学科（静态 + 动态） */
export function getAllDisciplines(): Record<string, DisciplineEntry> {
    return { ...BIOLOGY_DISCIPLINES, ...Object.fromEntries(dynamicDisciplines) };
}

/** 返回动态扩展的学科列表（供 UI 展示） */
export function getDynamicDisciplines(): DisciplineEntry[] {
    return Array.from(dynamicDisciplines.values());
}


// ─────────────────────────────────────────────────────────────────────────────
// 生物主题展示标签：生物-具体学科-知识点
// ─────────────────────────────────────────────────────────────────────────────

const DISCIPLINE_DISPLAY_NAMES: Record<string, string> = {
    'biology-highschool': '高中生物',
    'biology-university-foundation': '大学基础生物学',
    'adair-equation': 'Adair 方程',
    'allosteric-mwc-model': '齐变模型',
    'allosteric-knf-model': '序变模型',
    'tight-binding-kinetics': '紧密结合动力学',
    'cleland-multisubstrate-kinetics': 'Cleland 多底物酶动力学',
    'hodgkin-huxley-model': 'Hodgkin-Huxley模型',
    'biochemistry': '生物化学',
    'microbiology': '微生物学',
    'plant-physiology': '植物生理学',
    'animal-physiology': '动物生理学',
    'developmental-biology': '发育生物学',
    'genetics-advanced': '遗传学',
    'cell-biology-advanced': '细胞生物学',
    'ecology-evolution': '生态与进化生物学',
    'molecular-techniques': '分子生物学技术',
    'bioinformatics': '生物信息学',
    'neurobiology': '神经生物学',
    'immunology': '免疫学',
    'bioengineering': '生物工程学',
    'systems-biology': '系统生物学',
    'synthetic-biology': '合成生物学',
    'structural-biology-advanced': '结构生物学',
    'biophysics-advanced': '生物物理学',
    'computational-biology': '计算生物学',
    'quantum-biology-advanced': '量子生物学',
};

const DISCIPLINE_ALIASES: Record<string, string[]> = {
    'biology-highschool': ['高中生物', 'high school biology'],
    'biology-university-foundation': ['大学基础生物学', '基础生物学', 'general biology', 'foundation biology'],
    'adair-equation': ['Adair 方程', 'Adair方程', 'Adair Equation', 'Adair结合多项式', 'binding polynomial'],
    'allosteric-mwc-model': ['齐变模型', 'MWC模型', 'MWC model', 'Monod-Wyman-Changeux', 'Concerted Model', 'concerted allosteric model'],
    'allosteric-knf-model': ['序变模型', 'KNF模型', 'Koshland-Némethy-Filmer', 'Sequential Model', '诱导契合', '杂合态'],
    'tight-binding-kinetics': ['紧密结合动力学', 'Tight-Binding Kinetics', 'Morrison方程', 'Henderson方程', '滴定效应', '强效抑制剂'],
    'cleland-multisubstrate-kinetics': ['Cleland 多底物酶动力学', 'Cleland表示法', 'Cleland notation', '多底物酶动力学', 'Ordered Bi-Bi', 'Ping-Pong Bi-Bi', '产物抑制矩阵'],
    'hodgkin-huxley-model': ['Hodgkin-Huxley模型', 'Hodgkin-Huxley', 'HH模型', '动作电位非线性动力学'],
    'biochemistry': ['生物化学', '分子生物化学', 'biochemistry', 'molecular biochemistry'],
    'microbiology': ['微生物学', '系统微生物学', 'microbiology'],
    'plant-physiology': ['植物生理学', 'plant physiology'],
    'animal-physiology': ['动物生理学', 'animal physiology'],
    'developmental-biology': ['发育生物学', 'developmental biology'],
    'genetics-advanced': ['遗传学', 'genetics'],
    'cell-biology-advanced': ['细胞生物学', 'cell biology'],
    'ecology-evolution': ['生态与进化生物学', '生态学', '进化生物学', 'ecology', 'evolutionary biology'],
    'molecular-techniques': ['分子生物学技术', '分子技术', 'molecular techniques'],
    'bioinformatics': ['生物信息学', 'bioinformatics'],
    'neurobiology': ['神经生物学', 'neurobiology', 'neuroscience'],
    'immunology': ['免疫学', 'immunology'],
    'bioengineering': ['生物工程学', '生物工程', '生物过程工程', 'bioengineering', 'bioprocess engineering'],
    'systems-biology': ['系统生物学', 'systems biology'],
    'synthetic-biology': ['合成生物学', 'synthetic biology'],
    'structural-biology-advanced': ['结构生物学', '分子结构生物学', 'structural biology', 'molecular structural biology'],
    'biophysics-advanced': ['生物物理学', '高级生物物理学', 'biophysics', 'advanced biophysics', 'quantitative cell mechanics'],
    'computational-biology': ['计算生物学', 'computational biology'],
    'quantum-biology-advanced': ['量子生物学', '前沿量子生物学', '开放量子系统动力学', 'quantum biology', 'advanced quantum biology', 'open quantum systems biology'],
};

export interface BiologyTopicCandidate {
    disciplineKey: string;
    disciplineName: string;
    knowledgePoint: string;
    formattedTopic: string;
    explicitDiscipline: boolean;
    score: number;
}

function normalizeBiologyMatchText(text: string): string {
    return text.toLowerCase().replace(/[\s_\-—–:：/\\]+/g, ' ').trim();
}

function includesBiologyTerm(text: string, term: string): boolean {
    const normalizedText = normalizeBiologyMatchText(text);
    const normalizedTerm = normalizeBiologyMatchText(term);
    return !!normalizedTerm && normalizedText.includes(normalizedTerm);
}

function cleanKnowledgePointFromDiscipline(topic: string, aliases: string[]): string {
    let cleaned = topic.trim();
    for (const alias of aliases.sort((a, b) => b.length - a.length)) {
        cleaned = cleaned.replace(new RegExp(alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' ');
    }
    cleaned = cleaned
        .replace(/生物\s*[-—–_:：]?\s*/g, ' ')
        .replace(/[，,;；|/\\]+/g, ' ')
        .replace(/[-—–_:：]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return cleaned || topic.trim();
}

export function getBiologyDisciplineDisplayName(key: string, disciplines: Record<string, DisciplineEntry> = getAllDisciplines()): string {
    return DISCIPLINE_DISPLAY_NAMES[key] ?? disciplines[key]?.name ?? '生物学';
}

export function detectExplicitBiologyDiscipline(topic: string, disciplines: Record<string, DisciplineEntry> = getAllDisciplines()): BiologyTopicCandidate | null {
    for (const [key, aliases] of Object.entries(DISCIPLINE_ALIASES)) {
        if (aliases.some(alias => includesBiologyTerm(topic, alias))) {
            const disciplineName = getBiologyDisciplineDisplayName(key, disciplines);
            const knowledgePoint = cleanKnowledgePointFromDiscipline(topic, aliases);
            return {
                disciplineKey: key,
                disciplineName,
                knowledgePoint,
                formattedTopic: formatBiologyTopicLabel(key, knowledgePoint, disciplines),
                explicitDiscipline: true,
                score: Number.POSITIVE_INFINITY,
            };
        }
    }
    return null;
}

export function formatBiologyTopicLabel(disciplineKey: string, knowledgePoint: string, disciplines: Record<string, DisciplineEntry> = getAllDisciplines()): string {
    return `生物-${getBiologyDisciplineDisplayName(disciplineKey, disciplines)}-${knowledgePoint.trim() || '生物学'}`;
}

export function resolveBiologyDisciplineKeyFromName(nameOrHint?: string): string | null {
    const hint = (nameOrHint ?? '').trim();
    if (!hint) return null;

    for (const [key, displayName] of Object.entries(DISCIPLINE_DISPLAY_NAMES)) {
        if (includesBiologyTerm(hint, displayName) || includesBiologyTerm(displayName, hint)) return key;
    }

    for (const [key, aliases] of Object.entries(DISCIPLINE_ALIASES)) {
        if (aliases.some(alias => includesBiologyTerm(hint, alias) || includesBiologyTerm(alias, hint))) return key;
    }

    const all = getAllDisciplines();
    for (const [key, discipline] of Object.entries(all)) {
        if (includesBiologyTerm(hint, discipline.name) || includesBiologyTerm(discipline.name, hint)) return key;
    }

    return null;
}

function countBiologySignalHits(topic: string, signals: string[]): number {
    return signals.filter(signal => includesBiologyTerm(topic, signal)).length;
}

function scoreBiologySemanticAliases(topic: string, semanticAliases: DisciplineEntry['semanticAliases']): number {
    if (!semanticAliases?.length) return 0;

    return semanticAliases.reduce((sum, aliasGroup) => {
        const forbiddenHitCount = countBiologySignalHits(topic, aliasGroup.forbiddenSignals ?? []);
        if (forbiddenHitCount > 0) return sum;

        const aliasHitCount = countBiologySignalHits(topic, aliasGroup.aliases);
        const requiredHitCount = countBiologySignalHits(topic, aliasGroup.requiredSignals ?? []);
        if (aliasHitCount === 0 && requiredHitCount < 2) return sum;

        const aliasScore = aliasHitCount * 10;
        const requiredScore = Math.min(12, requiredHitCount * 4);
        return sum + aliasScore + requiredScore;
    }, 0);
}

function scoreBiologyDisciplineTopic(topic: string, disciplineKey: string, discipline: DisciplineEntry): number {
    const keywordScore = discipline.keywords.reduce((sum, kw) => {
        if (!kw || !includesBiologyTerm(topic, kw)) return sum;
        return sum + Math.max(1, Math.min(6, Math.ceil(kw.length / 2)));
    }, 0);
    const semanticScore = scoreBiologySemanticAliases(topic, discipline.semanticAliases);

    const advancedHeterogeneitySignals = [
        '异质性', 'heterogeneity', '单细胞', 'single-cell', 'single cell', '亚群', '亚群体', '子群', 'bulk',
        'deconvolution', '去卷积', '伪时间', 'pseudotime', 'cite-seq', 'scRNA', 'scRNA-seq', 'RNA-seq',
        'pbmc', 'cell state', '细胞状态', '群体平均', 'bulk RNA', '亚群分化', 'cross-feeding', '交叉喂养',
    ];
    const immunologySignals = ['t细胞', 'b细胞', 'pbmc', '免疫', '免疫细胞', '淋巴细胞', '巨噬细胞', '树突状细胞'];
    const systemsSignals = ['网络', '反馈', '状态转换', '状态切换', '系统层面', '多组学', '调控网络', '动力学模型'];
    const syntheticSignals = ['cell-free', 'cell free', 'TX-TL', 'TXTL', '无细胞', '合成生物', 'toehold', 'biosensor'];
    const structuralSignals = ['结构', '晶体', 'cryo-em', 'cryo em', '冷冻电镜', '结构预测', 'alphafold', '蛋白质结构', 'pdb'];
    const biophysicsSignals = ['膜电位', '离子通道', 'patch clamp', 'patch-clamp', 'afm', '光镊', '单分子', 'wlc', 'ghk', 'markov', 'hvcn1'];
    const quantumSignals = ['量子', 'quantum', '泡利', 'pauli', '相干', '退相干', '隧穿', 'tunneling', '自由基对', 'radical pair', 'lindblad', 'zeeman'];
    const computationalSignals = ['算法', '机器学习', '深度学习', '模型训练', '聚类', '降维', 'hmm', '隐马尔可夫', '统计模型'];
    const ecologySignals = ['生态', '进化', '群落', '种群', '适应度', '选择压力', '物种', '食物网'];
    const geneticsSignals = ['遗传', '突变', '连锁', '重组', 'qtl', 'gwas', '孟德尔', '表观遗传'];
    const cellSignals = ['细胞骨架', '细胞周期', '细胞器', '膜运输', '囊泡', '自噬', '凋亡', '细胞极性'];
    const techniqueSignals = ['pcr', 'western blot', 'southern blot', 'crispr', '测序', '质谱', '显微镜', '流式'];
    const highschoolSignals = ['高中', '必修', '选修', '教材', '课本', '光合作用', '细胞呼吸', '有氧呼吸', '无氧呼吸'];

    const heterogeneityHitCount = countBiologySignalHits(topic, advancedHeterogeneitySignals);
    const immunologyHitCount = countBiologySignalHits(topic, immunologySignals);
    const systemsHitCount = countBiologySignalHits(topic, systemsSignals);
    const syntheticHitCount = countBiologySignalHits(topic, syntheticSignals);
    const structuralHitCount = countBiologySignalHits(topic, structuralSignals);
    const biophysicsHitCount = countBiologySignalHits(topic, biophysicsSignals);
    const quantumHitCount = countBiologySignalHits(topic, quantumSignals);
    const computationalHitCount = countBiologySignalHits(topic, computationalSignals);
    const ecologyHitCount = countBiologySignalHits(topic, ecologySignals);
    const geneticsHitCount = countBiologySignalHits(topic, geneticsSignals);
    const cellHitCount = countBiologySignalHits(topic, cellSignals);
    const techniqueHitCount = countBiologySignalHits(topic, techniqueSignals);
    const highschoolHitCount = countBiologySignalHits(topic, highschoolSignals);

    let heuristicScore = 0;
    if (heterogeneityHitCount > 0) {
        if (disciplineKey === 'bioengineering') heuristicScore += 18 + heterogeneityHitCount * 4;
        if (disciplineKey === 'systems-biology') heuristicScore += 10 + heterogeneityHitCount * 2;
        if (disciplineKey === 'computational-biology') heuristicScore += 8 + heterogeneityHitCount * 2;
        if (disciplineKey === 'immunology') heuristicScore += immunologyHitCount > 0 ? 10 + immunologyHitCount * 2 : 0;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 18;
    }

    if (immunologyHitCount > 0) {
        if (disciplineKey === 'immunology') heuristicScore += 16 + immunologyHitCount * 3;
        if (disciplineKey === 'bioengineering' && heterogeneityHitCount > 0) heuristicScore += 6;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 8;
    }

    if (systemsHitCount > 0) {
        if (disciplineKey === 'systems-biology') heuristicScore += 10 + systemsHitCount * 2;
        if (disciplineKey === 'computational-biology') heuristicScore += 6;
    }

    if (syntheticHitCount > 0) {
        if (disciplineKey === 'synthetic-biology') heuristicScore += 18 + syntheticHitCount * 4;
        if (disciplineKey === 'systems-biology') heuristicScore += 4;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 12;
    }

    if (structuralHitCount > 0) {
        if (disciplineKey === 'structural-biology-advanced') heuristicScore += 18 + structuralHitCount * 4;
        if (disciplineKey === 'biochemistry') heuristicScore += 4;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 12;
    }

    if (biophysicsHitCount > 0) {
        if (disciplineKey === 'biophysics-advanced') heuristicScore += 18 + biophysicsHitCount * 4;
        if (disciplineKey === 'structural-biology-advanced') heuristicScore += 3;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 14;
    }

    if (quantumHitCount > 0) {
        if (disciplineKey === 'quantum-biology-advanced') heuristicScore += 20 + quantumHitCount * 5;
        if (disciplineKey === 'biophysics-advanced') heuristicScore += 4;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 16;
    }

    if (computationalHitCount > 0) {
        if (disciplineKey === 'computational-biology') heuristicScore += 16 + computationalHitCount * 3;
        if (disciplineKey === 'bioinformatics') heuristicScore += 8 + computationalHitCount * 2;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 10;
    }

    if (ecologyHitCount > 0) {
        if (disciplineKey === 'ecology-evolution') heuristicScore += 16 + ecologyHitCount * 3;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 8;
    }

    if (geneticsHitCount > 0) {
        if (disciplineKey === 'genetics-advanced') heuristicScore += 16 + geneticsHitCount * 3;
        if (disciplineKey === 'bioinformatics') heuristicScore += 4;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 8;
    }

    if (cellHitCount > 0) {
        if (disciplineKey === 'cell-biology-advanced') heuristicScore += 16 + cellHitCount * 3;
        if (disciplineKey === 'biology-university-foundation') heuristicScore += 3;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 8;
    }

    if (techniqueHitCount > 0) {
        if (disciplineKey === 'molecular-techniques') heuristicScore += 16 + techniqueHitCount * 3;
        if (disciplineKey === 'bioengineering') heuristicScore += 4;
        if (disciplineKey === 'biology-highschool') heuristicScore -= 8;
    }

    if (highschoolHitCount > 0 && disciplineKey === 'biology-highschool') {
        heuristicScore += 8 + highschoolHitCount * 2;
    }

    return keywordScore + semanticScore + heuristicScore;
}

function buildBiologyTopicCandidate(
    key: string,
    topic: string,
    score: number,
    disciplines: Record<string, DisciplineEntry>,
): BiologyTopicCandidate {
    return {
        disciplineKey: key,
        disciplineName: getBiologyDisciplineDisplayName(key, disciplines),
        knowledgePoint: topic.trim() || '生物学',
        formattedTopic: formatBiologyTopicLabel(key, topic.trim() || '生物学', disciplines),
        explicitDiscipline: false,
        score,
    };
}

function collectTopicModelSearchTerms(entry: DisciplineEntry): string[] {
    const hierarchyTerms = typeof entry.hierarchy === 'object' ? entry.hierarchy.path : [];
    const relatedTerms = (entry.relatedSubfields ?? []).flatMap(item => [item.discipline, item.module ?? '', ...(item.path ?? []), item.relation]);
    const useCaseTerms = (entry.crossDisciplinaryUseCases ?? []).flatMap(item => [item.discipline, item.module ?? '', ...(item.path ?? []), item.useCase, item.constraints]);
    return [
        entry.name,
        ...entry.keywords,
        ...hierarchyTerms,
        ...(entry.modelVariants ?? []),
        ...relatedTerms,
        ...useCaseTerms,
    ].filter(Boolean);
}

function getReferencedTopicModelCandidates(topic: string, disciplines: Record<string, DisciplineEntry>): Array<{ key: string; score: number }> {
    const boosted = new Map<string, number>();

    for (const [parentKey, parent] of Object.entries(disciplines)) {
        if (!parent.modules) continue;
        const parentHit = includesBiologyTerm(topic, parent.name) || parent.keywords.some(term => includesBiologyTerm(topic, term));

        for (const module of Object.values(parent.modules)) {
            const subtopics = Object.values(module.subtopics ?? {});
            const moduleTerms = [
                module.name,
                ...(module.keywords ?? []),
                module.reasoningNote ?? '',
                ...subtopics.flatMap(item => [item.name, item.note ?? '', ...(item.keywords ?? [])]),
            ].filter(Boolean);
            const moduleHitCount = countBiologySignalHits(topic, moduleTerms);
            const refs = new Set<string>([
                ...(module.topicRefs ?? []),
                ...subtopics.map(item => item.ref).filter((ref): ref is string => Boolean(ref)),
            ]);

            for (const ref of refs) {
                const entry = disciplines[ref];
                if (!entry) continue;
                const refHitCount = countBiologySignalHits(topic, collectTopicModelSearchTerms(entry));
                const callable = entry.callableFromDisciplines?.includes(parentKey) ?? false;
                const shouldBoost = refHitCount > 0 || (moduleHitCount > 0 && parentHit) || (callable && moduleHitCount > 0);
                if (!shouldBoost) continue;

                const score = refHitCount > 0
                    ? 80 + refHitCount * 8 + moduleHitCount * 2
                    : 35 + moduleHitCount * 4 + (callable ? 10 : 0);
                boosted.set(ref, Math.max(boosted.get(ref) ?? 0, score));
            }
        }
    }

    return Array.from(boosted.entries()).map(([key, score]) => ({ key, score }));
}

function needsModelDisciplineResolution(candidates: BiologyTopicCandidate[]): boolean {
    return candidates.length === 0;
}

export function getBiologyTopicCandidates(topic: string, maxCandidates = 3, disciplines: Record<string, DisciplineEntry> = getAllDisciplines()): BiologyTopicCandidate[] {
    const explicit = detectExplicitBiologyDiscipline(topic, disciplines);
    if (explicit) return [explicit];

    const all = disciplines;
    const scored = new Map<string, number>();
    for (const [key, discipline] of Object.entries(all)) {
        const score = scoreBiologyDisciplineTopic(topic, key, discipline);
        if (score > 0) scored.set(key, score);
    }
    for (const { key, score } of getReferencedTopicModelCandidates(topic, disciplines)) {
        scored.set(key, Math.max(scored.get(key) ?? 0, score));
    }

    return Array.from(scored.entries())
        .map(([key, score]) => ({ key, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.max(1, maxCandidates))
        .map(({ key, score }) => buildBiologyTopicCandidate(key, topic, score, disciplines));
}

export async function getBiologyTopicCandidatesWithFallbackNormalization(
    topic: string,
    maxCandidates = 3,
    disciplines: Record<string, DisciplineEntry> = getAllDisciplines(),
): Promise<BiologyTopicCandidate[]> {
    const candidates = getBiologyTopicCandidates(topic, maxCandidates, disciplines);
    if (!needsModelDisciplineResolution(candidates)) return candidates;

    try {
        const llmResult = await callNormalizationLLM(topic);
        if (llmResult.action === 'map' && llmResult.mappedKey && disciplines[llmResult.mappedKey]) {
            topicResolutionCache.set(topic, llmResult.mappedKey);
            console.info(`[biologyDisciplines] model discipline resolution: ${topic} → ${llmResult.mappedKey}`);
            return [buildBiologyTopicCandidate(llmResult.mappedKey, topic, 1, disciplines)];
        }

        if (llmResult.action === 'create' && llmResult.newKey && llmResult.newEntry) {
            dynamicDisciplines.set(llmResult.newKey, { ...llmResult.newEntry, isDynamic: true });
            topicResolutionCache.set(topic, llmResult.newKey);
            console.info(`[biologyDisciplines] 自动扩展新学科：${llmResult.newKey} → ${llmResult.newEntry.name}`);
            return [buildBiologyTopicCandidate(llmResult.newKey, topic, 1, getAllDisciplines())];
        }
    } catch (error) {
        console.warn('[biologyDisciplines] model discipline resolution failed', error);
    }

    return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 核心：异步归一化 + 自动扩展
// ─────────────────────────────────────────────────────────────────────────────

export interface TopicResolutionResult {
    guidance: string;
    disciplineKey: string;
    disciplineName: string;
    disciplineReasoningType: ReasoningType;
    isNewDiscipline: boolean;
}

/**
 * 主入口：给定任意主题字符串，返回对应的学科难度指导。
 */
export async function resolveTopicGuidance(
    topic: string,
    difficulty: string,
    client: any
): Promise<TopicResolutionResult> {
    // 1. 缓存
    const cached = topicResolutionCache.get(topic);
    if (cached) return buildResult(cached, difficulty, false);

    // 2. 关键词匹配
    const matched = identifyInAllDisciplines(topic);
    if (matched) {
        topicResolutionCache.set(topic, matched);
        return buildResult(matched, difficulty, false);
    }

    // 3. LLM 归一化 / 创建新学科
    try {
        const llmResult = await callNormalizationLLM(topic, client);

        if (llmResult.action === 'map' && llmResult.mappedKey) {
            topicResolutionCache.set(topic, llmResult.mappedKey);
            return buildResult(llmResult.mappedKey, difficulty, false);
        }

        if (llmResult.action === 'create' && llmResult.newKey && llmResult.newEntry) {
            dynamicDisciplines.set(llmResult.newKey, { ...llmResult.newEntry, isDynamic: true });
            topicResolutionCache.set(topic, llmResult.newKey);
            console.info(`[biologyDisciplines] 自动扩展新学科：${llmResult.newKey} → ${llmResult.newEntry.name}`);
            return buildResult(llmResult.newKey, difficulty, true);
        }
    } catch (e) {
        console.warn('[biologyDisciplines] LLM 归一化失败，无法完成学科判别', e);
    }

    // 4. 非生物主题或 LLM 不可用时不伪装成任何具体生物子领域
    throw new Error(`无法将主题“${topic}”判别为已有或可新增的生物学子领域`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 内部工具函数
// ─────────────────────────────────────────────────────────────────────────────

function identifyInAllDisciplines(topic: string): string | null {
    const explicit = detectExplicitBiologyDiscipline(topic);
    if (explicit) return explicit.disciplineKey;

    const all = getAllDisciplines();
    for (const [key, discipline] of Object.entries(all)) {
        if (discipline.keywords.some(kw => includesBiologyTerm(topic, kw))) return key;
    }
    return null;
}

function buildGuidanceText(key: string, difficulty: string, isNew: boolean, disciplines: Record<string, DisciplineEntry> = getAllDisciplines()): string {
    const all = disciplines;
    const discipline = all[key];
    if (!discipline) throw new Error(`未知生物学科 key：${key}`);
    const level = (discipline.levels as any)[difficulty] ?? discipline.levels.intermediate;

    let text = `
【学科识别】：${discipline.name}${isNew ? '（自动扩展）' : ''}
【推理范式】：${discipline.reasoningNote}
【难度等级要求】：
${level}

【关键提示】：
- 题目必须严格遵守上述难度定义
- 不可越级使用高难度概念
- 数据应体现真实场景
- 推理结构必须符合上述推理范式
`;

    // ── v2 扩展字段注入（可选，原有字段已在上方输出）────────────────────
    const hierarchyPath = typeof discipline.hierarchy === 'object' ? discipline.hierarchy.path : undefined;
    if (hierarchyPath?.length) {
        text += `
【专题层级路径】：${hierarchyPath.join(' → ')}
`;
    }
    if (discipline.formulaCoverage && Object.keys(discipline.formulaCoverage).length > 0) {
        text += `
【专题公式/模型覆盖范围】：
`;
        for (const [section, items] of Object.entries(discipline.formulaCoverage)) {
            text += `- ${section}：${items.slice(0, 3).join('；')}
`;
        }
    }
    if (discipline.relatedSubfields?.length) {
        text += `
【相关子领域调用路径】：
`;
        discipline.relatedSubfields.forEach(item => {
            text += `- ${item.path?.join(' → ') ?? item.discipline}：${item.relation}
`;
        });
    }
    if (discipline.crossDisciplinaryUseCases?.length) {
        text += `
【跨学科调用场景与边界】：
`;
        discipline.crossDisciplinaryUseCases.forEach(item => {
            text += `- ${item.path?.join(' → ') ?? item.discipline}：${item.useCase}；边界：${item.constraints}
`;
        });
    }
    if (discipline.modelVariants?.length) {
        text += `
【可替换模型变体】：${discipline.modelVariants.join('、')}
`;
    }
    if (discipline.peakDifficulty) {
        text += `
【本学科天花板难度定位】：${discipline.peakDifficulty}
`;
    }
    if (discipline.forbiddenErrors && discipline.forbiddenErrors.length > 0) {
        text += `
【严禁出现的学术硬伤（出题必须规避）】：
`;
        discipline.forbiddenErrors.forEach(e => { text += `- ${e}
`; });
    }
    if (discipline.parameterConstraints && Object.keys(discipline.parameterConstraints).length > 0) {
        text += `
【底层物理/生理常数死锁（数值必须在此范围内）】：
`;
        for (const [k, v] of Object.entries(discipline.parameterConstraints)) {
            text += `- ${k}：${v}
`;
        }
    }
    if (discipline.antiPatternStrategies && discipline.antiPatternStrategies.length > 0) {
        text += `
【高防御出题策略（从下列素材中随机组合，禁止直接复现剧本）】：
`;
        discipline.antiPatternStrategies.forEach(s => { text += `- ${s}
`; });
    }
    if (discipline.diversityScaffolding) {
        const d = discipline.diversityScaffolding;
        text += `
【多样性脚手架（避免同知识点重复出相似题）】：
`;
        if (d.objectVariants && d.objectVariants.length > 0) text += `- 实验对象/系统池：${d.objectVariants.join('、')}
`;
        if (d.measurementTools && d.measurementTools.length > 0) text += `- 测量工具池：${d.measurementTools.join('、')}
`;
        if (d.dataModalities && d.dataModalities.length > 0) text += `- 数据形式池：${d.dataModalities.join('、')}
`;
        if (d.perturbationTypes && d.perturbationTypes.length > 0) text += `- 扰动条件池：${d.perturbationTypes.join('、')}
`;
        if (d.questionStyles && d.questionStyles.length > 0) text += `- 问法风格池：${d.questionStyles.join('、')}
`;
        if (d.subfieldVariants && d.subfieldVariants.length > 0) text += `- 子领域变体池：${d.subfieldVariants.join('、')}
`;
        if (d.modelVariants && d.modelVariants.length > 0) text += `- 模型变体池：${d.modelVariants.join('、')}
`;
        if (d.antiRepeatRule) text += `- 去重复规则：${d.antiRepeatRule}
`;
        if (d.scaffoldingTransitionRule) text += `- 物理因果闭合规则：${d.scaffoldingTransitionRule}
`;
    }

    return text;
}

function buildResult(key: string, difficulty: string, isNew: boolean): TopicResolutionResult {
    const all = getAllDisciplines();
    const discipline = all[key];
    if (!discipline) throw new Error(`未知生物学科 key：${key}`);
    return {
        guidance: buildGuidanceText(key, difficulty, isNew),
        disciplineKey: key,
        disciplineName: discipline.name,
        disciplineReasoningType: discipline.reasoningType,
        isNewDiscipline: isNew,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// LLM 归一化调用
// ─────────────────────────────────────────────────────────────────────────────

interface NormalizationResult {
    action: 'map' | 'create' | 'fallback';
    mappedKey?: string;
    newKey?: string;
    newEntry?: DisciplineEntry;
}

async function callNormalizationLLM(
    topic: string,
    client?: any
): Promise<NormalizationResult> {
    const all = getAllDisciplines();
    const existingList = Object.entries(all)
        .map(([k, v]) => `  "${k}": ${v.name}（关键词举例：${v.keywords.slice(0, 4).join('、')}）`)
        .join('\n');

    const prompt = `你是生物学学科分类专家。请判断用户输入的主题词应该如何处理。

【已有生物学科分类】：
${existingList}

【用户输入的主题】："${topic}"

【判断规则】：
1. 如果该主题是已有某个学科的**英文名/同义词/子主题/相关概念**，则选择 "map"。
2. 如果该主题是**已有分类中未覆盖的合法生物学领域**，则选择 "create"，由模型自主辨别子领域并生成完整的新学科条目。
3. 如果该主题**与生物学完全无关**，则选择 "fallback"。
4. 不允许把未知主题、前沿子领域或未覆盖知识点映射到 biology-highschool；只有明确属于高中教材基础生物时才映射到 biology-highschool。

【输出格式】（纯 JSON，不含注释）：
{"action":"map","mappedKey":"已有学科的key"}
或
{"action":"create","newKey":"新学科的英文小写key","newEntry":{...}}
或
{"action":"fallback"}`;

    const raw = client?.chat?.completions
        ? ((await client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: '你是生物学分类专家。只返回纯 JSON，不含任何解释文字。' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2,
        })).choices[0].message.content || '{}')
        : await callLLM(`${prompt}\n\n系统要求：你是生物学分类专家。只返回纯 JSON，不含任何解释文字。`, {
            model: 'deepseek-chat',
            temperature: 0.2,
        });

    return JSON.parse(raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()) as NormalizationResult;
}
