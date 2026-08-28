import { FINANCE_DISCIPLINES } from './disciplines';

/**
 * 金融 V2 生题界面的知识点目录。
 *
 * 每个分支下的知识点必须满足两个约束：
 * 1. 措辞里含该分支在 disciplines.ts 中的独有关键词，使 identifyDiscipline() 能命中本分支；
 * 2. 不含任何排在本分支之前的分支的关键词——identifyDiscipline 是首次命中即返回，
 *    例如「跨货币基差」会被 derivatives-term-structure 的「基差」抢走，
 *    「外汇储备管理」会被 international-fx 的「外汇」抢走。
 * 改动本文件后请重新校验路由（每个知识点须路由回它自己的分支）。
 */

export type FinanceDisciplineKey = keyof typeof FINANCE_DISCIPLINES;

export interface FinanceTopicGroup {
    key: FinanceDisciplineKey;
    name: string;
    topics: string[];
}

const TOPICS_BY_DISCIPLINE: Record<FinanceDisciplineKey, string[]> = {
    'derivatives-pricing': [
        '随机利率与标的相关时的远期测度切换与漂移修正',
        '由报价反演局部波动率曲面并检验 Dupire 前提',
        'SABR 校准中 β 与 ρ 的可辨识性',
        '离散对冲 P&L 分解与最优再平衡频率',
        '粘性行权价与粘性 Delta 下的对冲方向分叉',
        '含离散股息的美式期权提前行权域判定',
        '跳跃扩散下的对冲不完备性与短期限微笑',
        '方差互换报价与已实现方差的复制误差',
    ],
    'derivatives-term-structure': [
        'OIS 折现与远期曲线分离下的多曲线自举',
        '远期利率与期货利率的凸性调整来源',
        '久期与二阶近似在非平行曲线移动下的失效',
        '由 CDS 价差反解分段常数危险率曲线',
        'CDS 隐含违约概率与评级迁移概率的口径差',
        'CVA 中的错向风险与抵押品阈值处理',
        'Hull-White 校准中均值回复速度与波动率结构的可辨识性',
        '互换期权与利率上限报价对同一参数的信息含量差异',
    ],
    'portfolio-management': [
        '样本协方差矩阵在高维下的谱失真与 Marchenko-Pastur 降噪边界',
        'Black-Litterman 逆优化先验与贝叶斯后验的严格推导及 τ 的不可辨识性',
        '等风险贡献组合的非凸求解与解唯一性验证',
        'Rockafellar-Uryasev CVaR 线性化在离散情景优化中的实现',
        '高斯 copula 与 t-copula 的尾部相依系数差异对组合极端损失的影响',
        'Merton 跨期最优投资中对冲需求项的符号判定与 ICAPM 结构',
        '回测过拟合的去偏夏普比率与 PBO 检验',
        '条件贝塔时变下无条件 alpha 的系统性偏误方向',
    ],
    'asset-pricing-factors': [
        'Roll 批评下 CAPM 的不可检验性与市场组合代理偏误',
        'Fama-MacBeth 两步法中生成回归量误差的衰减偏误与 Shanken 修正',
        'GRS 联合检验的功效与测试资产选择的交互作用',
        'Hansen-Jagannathan 距离作为 SDF 模型误定度量的构造与解读',
        '因子动物园中多重检验校正与样本外因子衰减的定量估计',
        '可交易因子与不可交易宏观变量的模仿组合构造',
        '消费 CAPM 在股权溢价之谜下的参数不一致与三类解释路径',
        '有限套利中 Shleifer-Vishny 委托代理机制对异象持续性的约束',
    ],
    'investment-banking-valuation': [
        'FCFF 与 FCFE 口径下企业价值与股权价值的桥接',
        '杠杆逐期变动时 APV 与逐期重算 WACC 的交叉验证',
        '永续增长率、退出乘数与资本成本之间的终值自洽性',
        'beta 去杠杆与重加杠杆的 Hamada 前提',
        '换股并购的增厚摊薄与控制权溢价',
        'LBO 债务偿还路径与 MOIC 分解',
        '可比公司 EV/EBITDA 乘数的口径调平',
        '瀑布分配与优先股清算优先权下的股权价值分配',
    ],
    'econometrics-timeseries': [
        'ADF 与 KPSS 结论方向相反时的平稳性判定',
        '高 R² 低 DW 的伪回归识别与误差修正建模',
        'GARCH 参数接近 α+β=1 时的矩条件与预测区间',
        'Johansen 协整秩检验与 VAR 滞后阶选择',
        '已实现波动率与 HAR 模型的样本外预测比较',
        '结构突变与机制转换的区分',
        'Diebold-Mariano 检验下的预测能力比较',
        '状态空间模型的滤波估计与不可观测成分识别',
    ],
    'econometrics-causal': [
        '弱工具下 2SLS 的偏误方向与标准误失真',
        '交错处理的双重差分负权重问题',
        '断点回归带宽选择与操纵检验',
        '排他性约束的可检验与不可检验部分',
        '聚类标准误层级与处理分配层级不一致',
        '倾向得分匹配的重叠假设与协变量平衡',
        '动态面板 Arellano-Bond 估计与工具变量有效性',
        'Heckman 样本选择修正与识别来源',
        '公司-年度面板中双向聚类标准误的必要性',
    ],
    'actuarial-life': [
        '由条款唯一确定分数年龄假设（UDD / 常数死力 / Balducci）',
        'Thiele 递归求责任准备金并与前瞻式结果互验',
        '多减因模型中独立减因率与从属减因率的换算',
        '选择期内选择表与终极表接续的死亡率计算',
        '期初年金与期末年金的保费分解（利差、死差、费差）',
        '联合生存与最后生存者年金的定价',
        'Lee-Carter 死亡率改善建模与长寿风险',
        '保单失效与现金价值对保费充足性的影响',
    ],
    'actuarial-nonlife': [
        'Pareto 尾部指数 α≤2 时矩不存在下的极值理论路径',
        '免赔额对索赔频率与索赔强度的双重影响',
        '停止损失再保险的分层期望与 LER 闭合',
        '链梯法与 Bornhuetter-Ferguson 的 IBNR 差异',
        'Bühlmann-Straub 信度因子与结构参数估计',
        '复合泊松模型下的破产概率与 Lundberg 上界',
        'VaR 不满足次可加性的组合反例与 TVaR 对比',
        'GLM 定价因子选择与过度分散处理',
    ],
    'international-fx': [
        'CIP 偏离与掉期点报价的一致性判定',
        '直接标价与间接标价下三角套汇的方向唯一化',
        'quanto 产品中相关性带来的漂移调整',
        'UIP 与远期溢价之谜下的套息交易收益分解',
        'PPP 与巴拉萨-萨缪尔森效应下的实际汇率偏离',
        '外汇敞口的交易风险、折算风险与经济风险区分',
        '外汇期权风险逆转报价隐含的偏斜方向',
        '固定汇率制下货币危机与资本管制的政策权衡',
    ],
    'international-macro-finance': [
        '经常账户失衡与净外国资产的动态调整',
        '突然停止冲击下的资本流动逆转',
        '主权信用评级迁移与国别风险溢价的定价',
        '货币错配与原罪问题下的主权风险',
        '全球金融周期与美元流动性的溢出效应',
        '本国偏好与国际资产配置的最优对冲比例',
        '储备资产管理与国际投资头寸的口径',
        '量化宽松的跨境溢出与回溢效应',
    ],
    'financial-management': [
        '三表联动反推缺失科目并闭合会计恒等式',
        '研发支出资本化与费用化差异下的 ROIC 可比性',
        'FIFO 与 LIFO 存货计价差异对毛利率的影响',
        '经营租赁与融资租赁分类对财务杠杆的影响',
        '杜邦分析各层乘积还原 ROE 时的分子分母口径',
        '利润上升而现金流质量下降的应计项目背离',
        '现金转换周期与营运资本占用的联动',
        '递延所得税与资产减值对有效税率的影响',
        '经营杠杆与财务杠杆叠加下的盈亏平衡分析',
    ],
    'corporate-finance-capital': [
        '税盾价值与财务困境成本的权衡',
        '融资优序与信号理论下的资本结构选择',
        '债务悬置与资产替代下的股东债权人冲突',
        '现金流多次变号的互斥项目排序与再投资假设',
        '增量现金流闭合：沉没成本、机会成本与侵蚀效应',
        '不等寿命互斥项目的等年值比较',
        '延迟期权与放弃期权使静态决策反转',
        '名义与实际口径下的通胀处理与折旧税盾',
        '股利政策与股票回购的信号传递与客户效应',
    ],
};

export const FINANCE_TOPIC_GROUPS: FinanceTopicGroup[] = (
    Object.keys(FINANCE_DISCIPLINES) as FinanceDisciplineKey[]
).map(key => ({
    key,
    name: FINANCE_DISCIPLINES[key].name,
    topics: TOPICS_BY_DISCIPLINE[key],
}));

export const DEFAULT_FINANCE_DISCIPLINE_KEY: FinanceDisciplineKey = 'derivatives-pricing';

export const DEFAULT_FINANCE_TOPIC = TOPICS_BY_DISCIPLINE[DEFAULT_FINANCE_DISCIPLINE_KEY][0];

export function getFinanceTopics(key: FinanceDisciplineKey): string[] {
    return TOPICS_BY_DISCIPLINE[key] ?? [];
}

/** 由知识点文本反查其所属分支，用于回填下拉框（找不到时返回默认分支）。 */
export function findFinanceDisciplineByTopic(topic: string): FinanceDisciplineKey {
    const hit = FINANCE_TOPIC_GROUPS.find(group => group.topics.includes(topic));
    return hit ? hit.key : DEFAULT_FINANCE_DISCIPLINE_KEY;
}
