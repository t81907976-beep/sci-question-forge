/**
 * 知识点归一化模块
 *
 * 功能：
 * 1. 标准化：统一大小写、去空格、繁简转换、全角转半角
 * 2. 精确匹配：查 alias 表
 * 3. 模糊匹配：编辑距离 + 同音字匹配（针对中文错别字）
 * 4. 置信度门控：高分直接返回，中分返回最高，低分拒绝
 */

import { MATH_DISCIPLINES } from './disciplines.ts';

// ========== 类型定义 ==========

export interface KnowledgePoint {
  key: string;
  name: string;
  aliases: string[];
  keywords: string[];
}

export interface NormalizeResult {
  success: boolean;
  originalInput: string;
  matchedPoint?: KnowledgePoint;
  confidence: number; // 0-1
  matchedKey?: string; // 匹配到的知识点 key
  message?: string;
}

export interface MatchCandidate {
  key: string;
  name: string;
  score: number; // 0-1
  matchType: 'exact' | 'alias' | 'keyword' | 'fuzzy';
}

// ========== 知识点库（带别名） ==========

// 从 MATH_DISCIPLINES 提取知识点并添加别名
function getKnowledgePoints(): KnowledgePoint[] {
  const points: KnowledgePoint[] = [];

  for (const [key, discipline] of Object.entries(MATH_DISCIPLINES)) {
    // 收集所有 levels 中的关键词
    const levelKeywords: string[] = [];
    if (discipline.levels) {
      for (const level of Object.values(discipline.levels)) {
        if (level) {
          // 分割级别内容中的关键词（按逗号、顿号分割）
          const keywords = level.toString().split(/[,，、]/).map(k => k.trim()).filter(k => k.length > 0);
          levelKeywords.push(...keywords);
        }
      }
    }
    
    // 合并 discipline.keywords 和 levelKeywords，去重
    const allKeywords = [...new Set([...(discipline.keywords || []), ...levelKeywords])];
    
    points.push({
      key,
      name: discipline.name,
      aliases: allKeywords, // keywords + levels 中的关键词作为隐式别名
      keywords: allKeywords
    });
  }

  return points;
}

// 显式别名映射表（优先级最高）
// key 必须与 MATH_DISCIPLINES 中的 key 完全一致
const ALIAS_MAP: Record<string, string[]> = {
  // 代数
  'algebra-equation':    ['代数方程', '方程', 'equation', '代数方程组', '解方程'],
  'algebra-polynomial':  ['多项式', 'polynomial', '因式分解'],
  'algebra-inequality':  ['不等式', 'inequality', '最值', '极值', '不等式证明'],
  'algebra-abstract':    ['抽象代数', '群论', '环论', '域论', 'abstract algebra', 'group', 'ring'],
  'algebra-linear':      ['线性代数', 'linear algebra', '矩阵', 'matrix', '行列式', '高等代数', 'advanced algebra', '特征值', '特征向量', '若尔当', 'Jordan标准形', '向量空间', '线性空间', '线性变换'],

  // 几何
  'geometry-plane':        ['平面几何', '平面', '几何', 'geometry'],
  'geometry-analytic':     ['解析几何', '坐标几何', 'analytic geometry'],
  'geometry-solid':        ['立体几何', '空间几何', 'solid geometry'],
  'geometry-differential': ['微分几何', 'differential geometry', '曲面微分几何', '正则曲面', '第一基本形式', '第二基本形式', 'Gauss曲率', '平均曲率'],
  'geometry-convex':       ['凸几何', '凸集', '凸包'],

  // 数论
  'number-theory-basic':          ['初等数论', '数论', '质数', 'number theory'],
  'number-theory-diophantine':    ['丢番图方程', '不定方程', 'diophantine'],
  'number-theory-algebraic':      ['代数数论', 'algebraic number theory'],
  'number-theory-modular':        ['模形式', 'modular form', 'modular'],
  'number-theory-sequence':       ['特殊数列', 'Fibonacci', 'Lucas', 'Stirling', 'Bell数', 'Bernoulli', '递推', '数列'],
  'number-theory-computational':  ['计算数论', '素性检测', '因子分解', '密码学'],
  'number-theory-analytic':       ['解析数论', 'Zeta函数', 'L函数', '素数定理', 'Dirichlet'],
  'number-theory-transcendental': ['超越数论', '超越数', '代数无关', 'Gelfond-Schneider', 'Lindemann-Weierstrass', 'Schmidt子空间定理', 'Baker理论'],
  'number-theory-continued-fraction': ['连分数', '有理逼近', '丢番图逼近', '最佳逼近', 'Markov谱'],

  // 概率统计
  'probability-basic':       ['概率论', '概率', 'probability'],
  'probability-statistics':  ['数理统计', '统计', 'statistics', '统计推断'],
  'probability-stochastic':  ['随机过程', '布朗运动', '鞅', '泊松过程'],
  'probability-markov':      ['马尔可夫', '马尔可夫过程', '转移函数', '遍历', '平稳'],
  'probability-limit':       ['极限定理', '中心极限定理', '大数定律', '强大数'],

  // 微积分
  'calculus-limit':                ['极限', 'limit', '连续', '无穷小', '洛必达', '多元函数极限', '多元函数连续'],
  'calculus-derivative':           ['导数', '微分', 'derivative', '求导', '切线', '中值定理', '泰勒公式', '多元微积分', '多元函数', '偏导', '全微分', '方向导数', '梯度', 'Jacobian', 'Hessian', 'Lagrange乘数'],
  'calculus-integral':             ['积分', 'integral', '定积分', '不定积分', '微积分基本定理', '重积分', '曲线积分', '曲面积分', 'Green公式', 'Gauss公式', 'Stokes公式'],

  // 常微分方程（含基础微分方程）
  'ode-qualitative':      ['微分方程', 'differential equation', 'ODE', '数理方程', '定性理论', '稳定性', '相平面', '极限环', '分岔', '振动', 'Lyapunov'],
  'ode-boundary-value':   ['边值问题', 'Sturm-Liouville', 'Green函数', '本征函数'],
  'ode-perturbation':     ['摄动方法', '渐近', 'WKB', '多尺度', '奇异摄动'],

  // 偏微分方程
  'pde-elliptic':    ['椭圆方程', 'Laplace', 'Poisson', '调和', '极值原理'],
  'pde-parabolic':   ['抛物方程', '热方程', '扩散', '最大值原理'],
  'pde-hyperbolic':  ['双曲方程', '波动方程', '特征线', '激波'],
  'pde-distribution':['分布理论', '广义函数', '弱解', 'Sobolev'],

  // 泛函分析扩展
  'functional-banach':   ['泛函分析', 'functional analysis', 'Banach空间', '赋范空间', '度量空间', '内积空间', 'Hilbert空间', '范数', '连续泛函', '对偶空间', '自反空间', 'Banach'],
  'functional-operator': ['算子理论', '有界线性算子', '紧算子', 'Fredholm算子', '自伴算子', '酉算子', '投影算子', 'C*代数', '算子代数'],
  'functional-spectral': ['谱理论', '谱分解', '谱测度', '预解式', '函数演算', '本质谱', '散射谱', '点谱', '连续谱'],

  // 数值分析
  'numerical-linear':       ['数值线性代数', '矩阵求解', 'LU', 'QR'],
  'numerical-ode':          ['常微分方程数值解', 'Euler方法', 'Runge-Kutta', '欧拉法', '步长控制'],
  'numerical-pde':          ['偏微分方程数值解', '有限元', '有限差分', '有限体积', 'Galerkin'],
  'numerical-approximation':['函数逼近', '插值', '样条', '最小二乘'],

  // 复分析
  'complex-analysis':           ['复变函数', '复分析', '全纯', '亚纯', '留数', 'Laurent', 'Cauchy', '复数'],
  'complex-geometry':           ['复几何', 'Riemann映照', 'Riemann面', '共形映射', '复流形', 'Teichmüller', '拟共形映射', '自守函数'],

  // 组合数学
  'combinatorics-basic':         ['组合数学', 'combinatorics', '计数组合', '计数', '排列', '组合', '生成函数', 'Lagrange反演', 'Polya', 'Pólya', 'Burnside', 'LGV', 'ASM'],
  'combinatorics-graph':         ['图论', 'graph theory', '图', '随机图', '图谱', 'Laplacian', '图着色', '列表着色', 'Tutte多项式'],
  'combinatorics-algebraic':     ['代数组合', '对称函数', 'Macdonald函数', 'Littlewood-Richardson', 'Hopf代数', 'Ehrhart', 'Coxeter', 'Kazhdan-Lusztig', 'Schubert', '组合Hodge'],
  'combinatorics-additive':      ['加性组合', 'Green-Tao', 'Mann不等式', 'Freiman', 'Szemerédi', 'Szemeredi', '和积问题', '和集'],
  'combinatorics-extremal':      ['极值组合', 'Kruskal-Katona', 'VC维', 'Sauer-Shelah', 'Erdos-Ko-Rado', 'Erdős-Ko-Rado', '交族'],
  'combinatorics-probabilistic': ['概率组合', '随机矩阵', 'Wigner', 'Schwartz-Zippel', 'Friedgut-Kalai-Naor', '随机方法'],
  'combinatorics-geometry':      ['组合几何', '离散几何', '堆砌', '铺砌', 'Helly', 'Szemerédi-Trotter', 'Szemeredi-Trotter', 'Guth-Katz', '多项式分割', 'Erdos-Szekeres', 'Erdős-Szekeres', '球堆积', 'kissing number'],
  'combinatorics-design':        ['组合设计', '区组设计', 'BIBD', 'Fisher不等式', 'Steiner', 'Keevash', '差集', '有限几何', '拉丁方', 'MOLS'],
  'combinatorics-coding':        ['编码理论', '线性码', 'Hamming界', 'Singleton界', 'Plotkin界', 'Griesmer界', 'Golay码', 'Reed-Solomon', 'Reed-Muller', 'MacWilliams', 'Assmus-Mattson', 'GV界', 'MRRW界', '代数几何码'],

  // 拓扑
  'topology-pointset':  ['基础拓扑', '点集拓扑', '拓扑', 'topology', '同胚', '开集', '连通性', '紧致', '连通', '分离公理'],
  'topology-algebraic': ['代数拓扑', '同调', '同伦', '纤维丛'],

  // 动力系统
  'dynamical-chaos':      ['混沌', '奇怪吸引子', '蝴蝶效应'],
  'dynamical-hamiltonian':['Hamilton系统', '辛几何', '可积', 'KAM'],
  'dynamical-ergodic':    ['遍历理论', '不变测度', '混合'],

  // 代数几何
  'algebraic-geometry-classical': ['古典代数几何', '射影代数几何', '射影几何', '射影', '射影簇', '仿射代数几何', '仿射簇', 'projective', 'affine variety'],

  // 其他
  'special-functions':    ['特殊函数', 'Gamma', 'Bessel', 'Legendre', '超几何'],
  'information-coding':   ['信息论', '熵', '编码', '信道', '纠错'],
  'optimization-linear':  ['线性规划', '单纯形', '整数规划', '分支定界'],
  'optimization-nonlinear':['非线性优化', '梯度', '牛顿法', '最速下降', '拉格朗日'],
  'lattice-theory':       ['格论', '偏序', '分配格', '布尔代数'],
  'category-theory':      ['范畴论', '函子', '自然变换', '伴随'],
};

export function getExplicitMathAliasKeys(): string[] {
  return Object.keys(ALIAS_MAP);
}

// ========== 标准化函数 ==========

/**
 * 字符串标准化
 * 1. 转小写
 * 2. 去空格
 * 3. 去标点
 * 4. 全角转半角
 * 5. 繁简统一
 */
function standardize(input: string): string {
  let result = input.toLowerCase().trim();

  // 全角转半角
  result = result.replace(/[\u3000-\u303f\uff00-\uffef]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 0x3000 && code <= 0x303f) {
      return String.fromCharCode(code - 0x3000);
    }
    if (code >= 0xff00 && code <= 0xffef) {
      return String.fromCharCode(code - 0xff00 + 0x20);
    }
    return char;
  });

  // 去除标点符号
  result = result.replace(/[，。！？、；：""''【】（）\(\)\[\]\{\}<>,，。?!@#$%^&*_+=|\\\/]/g, '');

  // 去除空格
  result = result.replace(/\s+/g, '');

  // 常见繁体转简体
  const 繁简映射: Record<string, string> = {
    '幾': '几', '後': '后', '裡': '里', '為': '为', '與': '与',
    '於': '于', '種': '种', '來': '来', '說': '说', '時': '时',
    '認': '认', '發': '发', '體': '体', '學': '学', '數': '数',
    '處理': '处理', '訊息': '信息'
  };

  for (const [繁, 简] of Object.entries(繁简映射)) {
    result = result.replace(new RegExp(繁, 'g'), 简);
  }

  return result;
}

// ========== 同音字映射表（针对中文错别字） ==========
// 针对数学知识点库扩充的高频错别字映射

const 同音字表: Record<string, string[]> = {
  // ===== 微积分相关 =====
  '微': ['为', '维', '尾'],
  '积': ['机', '基', '极'],
  '分': ['份', '粉', '奋'],
  '极': ['机', '积'],
  '限': ['现', '线'],
  '线': ['限', '现'],
  '导': ['道', '倒'],
  '切': ['且', '窃'],

  // ===== 方程/函数/级数 =====
  '函': ['含', '韩'],
  '数': ['树', '术', '属'],
  '级': ['极', '急'],
  '程': ['成', '呈', '乘'],

  // ===== 概率/统计/分布 =====
  '概': ['盖', '钙'],
  '率': ['绿', '律'],
  '统': ['通', '同'],
  '计': ['机', '纪'],

  // ===== 线性代数/矩阵/向量 =====
  '矩': ['距', '句'],
  '阵': ['振'],
  '向': ['象', '相'],
  '量': ['良', '亮'],

  // ===== 几何相关 =====
  '形': ['型', '行'],
  '圆': ['园', '元'],
  '角': ['脚', '较'],
  '面': ['免', '缅'],
  '体': ['替', '涕'],

  // ===== 代数/多项式/因式 =====
  '因': ['音', '阴'],
  '式': ['试', '势'],
  '解': ['姐', '介'],
  '元': ['原', '圆'],
  '理': ['里', '利'],

  // ===== 数论相关 =====
  '质': ['至', '治'],
  '同': ['统', '通'],

  // ===== 不等式/最值 =====
  '等': ['懂', '冬'],
  '于': ['与', '宇'],
  '值': ['直', '职'],

  // ===== 泛函/算子/空间 =====
  '泛': ['范', '贩'],
  '算': ['蒜', '酸'],
  '空': ['控', '孔'],
  '间': ['简', '见'],

  // ===== 拓扑/同调/同伦 =====
  '扑': ['朴', '葡'],
  '调': ['掉', '吊'],
  '伦': ['论', '轮'],

  // ===== 组合数学/图论 =====
  '组': ['祖', '阻'],
  '合': ['和', '何'],
  '图': ['徒', '屠'],
  '回': ['汇', '会'],

  // ===== 复变函数/复数 =====
  '变': ['遍', '便'],
  '复': ['福', '扶'],

  // ===== 常用数学词根补充 =====
  '性': ['姓', '兴'],
  '法': ['发', '乏'],
  '度': ['渡', '镀'],
  '偏': ['片', '篇'],
  '析': ['西', '息'],
  '论': ['伦', '轮'],

  // ===== 扩充：复分析相关 =====
  '留': ['流', '刘'],
  '共': ['供', '工'],
  '映': ['应', '英'],
  '射': ['社', '设'],

  // ===== 扩充：微分方程相关 =====
  '定': ['订'],
  '稳': ['文', '闻'],
  '振': ['整', '正'],
  '动': ['冻', '洞'],
  '边': ['变', '便'],

  // ===== 扩充：偏微分方程相关 =====
  '椭': ['妥', '拓'],
  '抛': ['泡', '跑'],
  '双': ['爽'],
  '曲': ['取', '去'],
  '布': ['步', '部'],

  // ===== 扩充：泛函分析相关 =====
  'Banach': ['巴拿赫'],
  '谱': ['普', '扑'],
  '测': ['侧', '策'],
  '正': ['整', '争'],
  '则': ['侧', '测'],
  '域': ['于', '欲'],

  // ===== 扩充：概率论相关 =====
  '随': ['岁', '碎'],
  '过': ['个', '各'],
  '马': ['码', '妈'],
  '尔': ['而', '二'],

  // ===== 扩充：数值分析相关 =====
  '逼': ['比', '笔'],
  '近': ['进', '尽'],
  '插': ['查', '茶'],
  '样': ['阳', '养'],
  '误': ['悟', '物'],
  '差': ['插', '茶'],

  // ===== 扩充：动力系统相关 =====
  '混': ['魂', '昏'],
  '沌': ['顿', '盾'],
  '岔': ['查', '茶'],

  // ===== 扩充：几何相关（已排除重复：形、圆、极、限） =====

  // ===== 扩充：其他方向 =====
  '特': [],
  '殊': ['书', '树'],
  '信': ['性', '新'],
  '息': ['西', '吸'],
  '码': ['马', '吗'],
  '优': ['有', '由'],
  '化': ['话', '划'],
  '格': ['各', '个'],
  '畴': ['筹', '愁'],
};

// 生成同音字变体
function generate同音变体(word: string): string[] {
  const variants: string[] = [word];

  for (const [正确字, 错误列表] of Object.entries(同音字表)) {
    if (word.includes(正确字)) {
      for (const 错 of 错误列表) {
        variants.push(word.replace(正确字, 错));
      }
    }
  }

  return variants;
}

// ========== 编辑距离计算 ==========

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // 删除
        dp[i][j - 1] + 1,      // 插入
        dp[i - 1][j - 1] + cost // 替换
      );
    }
  }

  return dp[m][n];
}

// 计算相似度 (0-1)
function calculateSimilarity(s1: string, s2: string): number {
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1;

  const distance = levenshteinDistance(s1, s2);
  return 1 - (distance / maxLen);
}

// ========== 匹配函数 ==========

/**
 * 模糊匹配：在所有别名、关键词中查找相似匹配
 */
function fuzzyMatch(input: string): MatchCandidate[] {
  const candidates: MatchCandidate[] = [];
  const points = getKnowledgePoints();

  // 生成同音变体
  const 同音变体列表 = generate同音变体(input);

  for (const point of points) {
    // 1. 精确匹配 name
    const stdInput = standardize(input);
    const stdName = standardize(point.name);

    if (stdInput === stdName) {
      candidates.push({ key: point.key, name: point.name, score: 1.0, matchType: 'exact' });
      continue;
    }

    // 2. 精确匹配 aliases
    for (const alias of point.aliases) {
      const stdAlias = standardize(alias);
      if (stdInput === stdAlias) {
        candidates.push({ key: point.key, name: point.name, score: 0.95, matchType: 'alias' });
        break;
      }
    }

    // 3. 同音字匹配
    for (const variant of 同音变体列表) {
      const stdVariant = standardize(variant);
      for (const alias of point.aliases) {
        const stdAlias = standardize(alias);
        if (stdVariant === stdAlias) {
          candidates.push({ key: point.key, name: point.name, score: 0.85, matchType: 'alias' });
          break;
        }
      }
    }

    // 4. 关键词包含匹配（改进版：支持父主题匹配子主题）
    // 例如：输入“几何”应该匹配到“平面几何”、“立体几何”等
    for (const keyword of point.keywords) {
      const stdKeyword = standardize(keyword);
      // 用户输入包含关键词，或者关键词包含用户输入（父主题匹配子主题）
      if (stdInput.includes(stdKeyword) || stdKeyword.includes(stdInput)) {
        // 父主题（如“几何”）匹配子主题关键词（如“平面”）时给更高分
        const score = stdKeyword.includes(stdInput) ? 0.8 : 0.7;
        candidates.push({ key: point.key, name: point.name, score, matchType: 'keyword' });
        break;
      }
    }

    // 5. 知识点名称包含匹配（新增：知识点名称包含用户输入）
    if (stdName.includes(stdInput) || stdInput.includes(stdName)) {
      // 检查是否已经通过关键词匹配添加过
      const existingKey = candidates.find(c => c.key === point.key && c.matchType === 'keyword');
      if (!existingKey || existingKey.score < 0.75) {
        const score = stdName.includes(stdInput) ? 0.85 : 0.65;
        candidates.push({ key: point.key, name: point.name, score, matchType: 'keyword' });
      }
    }

    // 6. 编辑距离模糊匹配
    const similarity = calculateSimilarity(stdInput, stdName);
    if (similarity >= 0.6) {
      candidates.push({ key: point.key, name: point.name, score: similarity * 0.6, matchType: 'fuzzy' });
    }
  }

  // 去重并取最高分
  const uniqueMap = new Map<string, MatchCandidate>();
  for (const c of candidates) {
    const existing = uniqueMap.get(c.key);
    if (!existing || c.score > existing.score) {
      uniqueMap.set(c.key, c);
    }
  }

  return Array.from(uniqueMap.values()).sort((a, b) => b.score - a.score);
}

// ========== 主归一化函数 ==========

/**
 * 知识点归一化
 *
 * @param userInput 用户输入
 * @returns NormalizeResult
 */
export function normalizeKnowledgePoint(userInput: string): NormalizeResult {
  const originalInput = userInput.trim();

  if (!originalInput) {
    return {
      success: false,
      originalInput,
      confidence: 0,
      message: '输入不能为空'
    };
  }

  // 优先查显式别名表
  const stdInput = standardize(originalInput);
  for (const [标准名, 别名列表] of Object.entries(ALIAS_MAP)) {
    for (const alias of 别名列表) {
      if (standardize(alias) === stdInput) {
        // 找到显式别名，返回对应标准知识点
        const points = getKnowledgePoints();

        // 第一优先：直接用 key 精确查找（ALIAS_MAP 的 key 就是 MATH_DISCIPLINES 的 key）
        let matched = points.find(p => p.key === 标准名);

        // 第二优先：key 转小写+连字符后匹配
        if (!matched) {
          matched = points.find(p => p.key === 标准名.toLowerCase().replace(/[^a-z0-9]/g, '-'));
        }

        // 第三优先：通过 name 精确包含匹配（不做模糊 keyword 搜索，避免误匹配）
        if (!matched) {
          matched = points.find(p => p.name === 标准名 || p.name.endsWith(`-${标准名}`) || p.name.includes(`-${标准名}`));
        }

        if (matched) {
          return {
            success: true,
            originalInput,
            matchedPoint: matched,
            matchedKey: matched.key,
            confidence: 1.0
          };
        }
      }
    }
  }

  // 使用模糊匹配
  const candidates = fuzzyMatch(originalInput);

  if (candidates.length === 0) {
    return {
      success: false,
      originalInput,
      confidence: 0,
      message: '未找到匹配知识点，请使用更精确的关键词'
    };
  }

  // 取最高分的候选
  const topCandidate = candidates[0];

  // 置信度门控
  if (topCandidate.score >= 0.8) {
    // 高置信度：直接返回
    const points = getKnowledgePoints();
    const matched = points.find(p => p.key === topCandidate.key);

    return {
      success: true,
      originalInput,
      matchedPoint: matched,
      matchedKey: topCandidate.key,
      confidence: topCandidate.score
    };
  } else if (topCandidate.score >= 0.5) {
    // 中置信度：返回最高分（自动选择）
    const points = getKnowledgePoints();
    const matched = points.find(p => p.key === topCandidate.key);

    return {
      success: true,
      originalInput,
      matchedPoint: matched,
      matchedKey: topCandidate.key,
      confidence: topCandidate.score,
      message: `模糊匹配: ${topCandidate.name} (置信度 ${topCandidate.score.toFixed(2)})`
    };
  } else {
    // 低置信度：拒绝匹配
    return {
      success: false,
      originalInput,
      confidence: topCandidate.score,
      message: '未找到匹配知识点，请使用更精确的关键词'
    };
  }
}

// ========== 便捷函数 ==========

/**
 * 获取知识点名称（用于调试）
 */
export function getKnowledgePointName(key: string): string {
  const points = getKnowledgePoints();
  const found = points.find(p => p.key === key);
  return found?.name || key;
}

/**
 * 获取知识点别名（用于生成 prompt）
 */
export function getKnowledgePointAliases(key: string): string[] {
  const points = getKnowledgePoints();
  const found = points.find(p => p.key === key);
  return found?.aliases || [];
}
