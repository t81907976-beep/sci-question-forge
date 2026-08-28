/**
 * Knowledge Points Catalog - IChO/中国化学奥林匹克标准
 * Comprehensive chemistry knowledge points (70+ points)
 * Supports multi-language, difficulty levels, and discipline-aware generation
 */

import type { Language } from '../i18n/languages';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type DisciplineKey =
  | 'physical-thermodynamics'
  | 'physical-kinetics'
  | 'physical-electrochemistry'
  | 'inorganic-basic'
  | 'inorganic-structure'
  | 'analytical-titration'
  | 'analytical-instrumental'
  | 'organic-structure'
  | 'organic-mechanism'
  | 'organic-synthesis'
  | 'organic-named'
  | 'organic-spectroscopy'
  | 'organic-hetero'
  | 'organic-bio'
  | 'advanced-quantum'
  | 'advanced-surface'
  | 'advanced-colloid'
  | 'experiment-basic';

export interface KnowledgePoint {
  id: string;
  name: Record<Language, string>;
  discipline: DisciplineKey;
  difficulty: DifficultyLevel;
  keywords: Record<Language, string[]>;
  description: Record<Language, string>;
  prerequisites?: string[];
  relatedKPs?: string[];
}

export interface KnowledgePointCatalog {
  version: string;
  lastUpdated: string;
  source: 'builtin' | 'user-uploaded';
  knowledgePoints: KnowledgePoint[];
  categories: {
    id: string;
    name: Record<Language, string>;
    knowledgePointIds: string[];
  }[];
}

/**
 * Built-in knowledge points catalog (70+ points - IChO Standard)
 */
export const defaultCatalog: KnowledgePointCatalog = {
  version: '2.0',
  lastUpdated: '2026-04-09',
  source: 'builtin',
  knowledgePoints: [
    // Physical Chemistry - Thermodynamics (热力学)
    {
      id: 'kp_001',
      name: {
        'zh-CN': '理想气体状态方程',
        'en-US': 'Ideal Gas Law',
        'ja-JP': '理想気体の状態方程式',
        'es-ES': 'Ley de Gases Ideales',
        'fr-FR': 'Loi des Gaz Parfaits',
        'ko-KR': '이상 기체 상태 방정식'
      },
      discipline: 'physical-thermodynamics',
      difficulty: 1,
      keywords: {
        'zh-CN': ['理想气体', 'PV=nRT', '气体常数', '摩尔体积'],
        'en-US': ['ideal gas', 'PV=nRT', 'gas constant', 'molar volume'],
        'ja-JP': ['理想気体', 'PV=nRT', '気体定数', 'モル体積'],
        'es-ES': ['gas ideal', 'PV=nRT', 'constante de gas'],
        'fr-FR': ['gaz idéal', 'PV=nRT', 'constante des gaz'],
        'ko-KR': ['이상 기체', 'PV=nRT', '기체 상수']
      },
      description: {
        'zh-CN': '理想气体的基本状态方程及气体常数R的应用',
        'en-US': 'Fundamental equation of state for ideal gases and application of gas constant R',
        'ja-JP': '理想気体の基本的な状態方程式と気体定数Rの応用',
        'es-ES': 'Ecuación fundamental de estado para gases ideales',
        'fr-FR': 'Équation fondamentale d\'état pour les gaz idéaux',
        'ko-KR': '이상 기체의 기본 상태 방정식 및 기체 상수 R 응용'
      }
    },
    {
      id: 'kp_002',
      name: {
        'zh-CN': '化学平衡与勒夏特列原理',
        'en-US': 'Chemical Equilibrium & Le Chatelier\'s Principle',
        'ja-JP': '化学平衡とルシャトリエの原理',
        'es-ES': 'Equilibrio Químico y Principio de Le Chatelier',
        'fr-FR': 'Équilibre Chimique et Principe de Le Chatelier',
        'ko-KR': '화학 평형 및 르샤틀리에 원리'
      },
      discipline: 'physical-thermodynamics',
      difficulty: 2,
      keywords: {
        'zh-CN': ['平衡常数', 'K值', '勒夏特列', '压强', '温度', '浓度'],
        'en-US': ['equilibrium constant', 'K value', 'Le Chatelier', 'pressure', 'temperature'],
        'ja-JP': ['平衡定数', 'K値', 'ルシャトリエ', '圧力', '温度'],
        'es-ES': ['constante de equilibrio', 'principio', 'presión', 'temperatura'],
        'fr-FR': ['constante d\'équilibre', 'Le Chatelier', 'pression', 'température'],
        'ko-KR': ['평형 상수', 'K값', '르샤틀리에', '압력', '온도']
      },
      description: {
        'zh-CN': '可逆反应的平衡状态、平衡常数的计算及勒夏特列原理的应用',
        'en-US': 'Equilibrium state of reversible reactions, equilibrium constant calculations, and Le Chatelier principle applications',
        'ja-JP': '可逆反応の平衡状態と平衡定数の計算',
        'es-ES': 'Estado de equilibrio de reacciones reversibles y cálculos de constantes',
        'fr-FR': 'État d\'équilibre des réactions réversibles',
        'ko-KR': '가역 반응의 평형 상태 및 평형 상수 계산'
      },
      prerequisites: ['kp_001']
    },
    {
      id: 'kp_003',
      name: {
        'zh-CN': '热力学第一定律',
        'en-US': 'First Law of Thermodynamics',
        'ja-JP': '熱力学第一法則',
        'es-ES': 'Primera Ley de la Termodinámica',
        'fr-FR': 'Première Loi de la Thermodynamique',
        'ko-KR': '열역학 제1법칙'
      },
      discipline: 'physical-thermodynamics',
      difficulty: 2,
      keywords: {
        'zh-CN': ['内能', '焓', '做功', '放热', '吸热', '△H', 'ΔU'],
        'en-US': ['internal energy', 'enthalpy', 'work', 'exothermic', 'endothermic'],
        'ja-JP': ['内部エネルギー', 'エンタルピー', '仕事', 'ΔH'],
        'es-ES': ['energía interna', 'entalpía', 'trabajo', 'exotérmico'],
        'fr-FR': ['énergie interne', 'enthalpie', 'travail', 'exothermique'],
        'ko-KR': ['내부 에너지', '엔탈피', '일', '발열']
      },
      description: {
        'zh-CN': '能量守恒定律在化学反应中的应用，焓变的计算和意义',
        'en-US': 'Application of energy conservation in chemical reactions, enthalpy change calculations',
        'ja-JP': '化学反応におけるエネルギー保存則の適用',
        'es-ES': 'Aplicación de la conservación de energía en reacciones químicas',
        'fr-FR': 'Application de la conservation de l\'énergie dans les réactions chimiques',
        'ko-KR': '화학 반응에서의 에너지 보존 법칙 적용'
      }
    },
    {
      id: 'kp_004',
      name: {
        'zh-CN': '热力学第二定律与熵',
        'en-US': 'Second Law of Thermodynamics & Entropy',
        'ja-JP': '熱力学第二法則とエントロピー',
        'es-ES': 'Segunda Ley de la Termodinámica y Entropía',
        'fr-FR': 'Deuxième Loi de la Thermodynamique et Entropie',
        'ko-KR': '열역학 제2법칙 및 엔트로피'
      },
      discipline: 'physical-thermodynamics',
      difficulty: 3,
      keywords: {
        'zh-CN': ['熵', '熵变', 'ΔS', '自发性', '吉布斯自由能', 'ΔG'],
        'en-US': ['entropy', 'entropy change', 'spontaneity', 'Gibbs free energy'],
        'ja-JP': ['エントロピー', 'ΔS', '自発性', 'ギブスの自由エネルギー'],
        'es-ES': ['entropía', 'cambio de entropía', 'espontaneidad', 'energía libre de Gibbs'],
        'fr-FR': ['entropie', 'changement d\'entropie', 'spontanéité', 'énergie libre de Gibbs'],
        'ko-KR': ['엔트로피', '엔트로피 변화', '자발성', '깁스 자유 에너지']
      },
      description: {
        'zh-CN': '不可逆过程的方向性，熵的概念，吉布斯自由能与反应自发性的判断',
        'en-US': 'Directionality of irreversible processes, entropy concept, spontaneity prediction using Gibbs free energy',
        'ja-JP': '不可逆過程の方向性、エントロピー概念',
        'es-ES': 'Direccionalidad de procesos irreversibles, concepto de entropía',
        'fr-FR': 'Directionalité des processus irréversibles, concept d\'entropie',
        'ko-KR': '비가역 과정의 방향성, 엔트로피 개념'
      },
      prerequisites: ['kp_003']
    },
    {
      id: 'kp_005',
      name: {
        'zh-CN': '范德华气体与实际气体',
        'en-US': 'Van der Waals Gas & Real Gases',
        'ja-JP': 'ファンデルワールス気体と実在気体',
        'es-ES': 'Gas de Van der Waals y Gases Reales',
        'fr-FR': 'Gaz de Van der Waals et Gaz Réels',
        'ko-KR': '반데르발스 기체 및 실제 기체'
      },
      discipline: 'physical-thermodynamics',
      difficulty: 3,
      keywords: {
        'zh-CN': ['范德华', '非理想气体', '分子作用力', '逸度', '压缩因子'],
        'en-US': ['Van der Waals', 'non-ideal gas', 'intermolecular forces', 'fugacity'],
        'ja-JP': ['ファンデルワールス', '非理想気体', '分子間力', '逸度'],
        'es-ES': ['Van der Waals', 'gas no ideal', 'fuerzas intermoleculares'],
        'fr-FR': ['Van der Waals', 'gaz non idéal', 'forces intermoléculaires'],
        'ko-KR': ['반데르발스', '비이상 기체', '분자간 힘']
      },
      description: {
        'zh-CN': '对理想气体假设的修正，考虑分子间作用力和分子大小的影响',
        'en-US': 'Correction to ideal gas assumption accounting for intermolecular forces and molecular volume',
        'ja-JP': '分子間力と分子サイズを考慮した理想気体の仮定への補正',
        'es-ES': 'Corrección a la suposición de gas ideal considerando fuerzas intermoleculares',
        'fr-FR': 'Correction de l\'hypothèse de gaz idéal en tenant compte des forces intermoléculaires',
        'ko-KR': '분자간 힘과 분자 크기를 고려한 이상 기체 가정의 보정'
      },
      prerequisites: ['kp_001']
    },
    {
      id: 'kp_006',
      name: {
        'zh-CN': '相平衡与相图',
        'en-US': 'Phase Equilibrium & Phase Diagrams',
        'ja-JP': '相平衡と相図',
        'es-ES': 'Equilibrio de Fases y Diagramas de Fases',
        'fr-FR': 'Équilibre des Phases et Diagrammes de Phase',
        'ko-KR': '상 평형 및 상 다이어그램'
      },
      discipline: 'physical-thermodynamics',
      difficulty: 4,
      keywords: {
        'zh-CN': ['相变', '三相点', '临界点', '相图', '共晶', '吉布斯相律'],
        'en-US': ['phase transition', 'triple point', 'critical point', 'phase diagram'],
        'ja-JP': ['相転移', '三相点', '臨界点', '相図'],
        'es-ES': ['transición de fase', 'punto triple', 'punto crítico', 'diagrama de fase'],
        'fr-FR': ['transition de phase', 'point triple', 'point critique', 'diagramme de phase'],
        'ko-KR': ['상 변화', '삼중점', '임계점', '상 다이어그램']
      },
      description: {
        'zh-CN': '物质不同状态间的平衡关系、相图的读取和应用、吉布斯相律',
        'en-US': 'Equilibrium relationships between phases, phase diagram interpretation, and Gibbs phase rule',
        'ja-JP': '異なる相間の平衡関係と相図の読み取り',
        'es-ES': 'Relaciones de equilibrio entre diferentes fases e interpretación de diagramas',
        'fr-FR': 'Relations d\'équilibre entre différentes phases et interprétation des diagrammes',
        'ko-KR': '다양한 상 간의 평형 관계 및 상 다이어그램 해석'
      },
      prerequisites: ['kp_003', 'kp_004']
    },
    {
      id: 'kp_007',
      name: {
        'zh-CN': '活度与活度系数',
        'en-US': 'Activity & Activity Coefficient',
        'ja-JP': '活量と活量係数',
        'es-ES': 'Actividad y Coeficiente de Actividad',
        'fr-FR': 'Activité et Coefficient d\'Activité',
        'ko-KR': '활동도 및 활동도 계수'
      },
      discipline: 'physical-thermodynamics',
      difficulty: 5,
      keywords: {
        'zh-CN': ['活度', '活度系数', '非理想溶液', 'NRTL', 'Wilson', '盐析', '盐溶'],
        'en-US': ['activity', 'activity coefficient', 'NRTL', 'Wilson', 'ionic strength'],
        'ja-JP': ['活量', '活量係数', 'NRTL', 'Wilson', 'イオン強度'],
        'es-ES': ['actividad', 'coeficiente de actividad', 'NRTL', 'Wilson'],
        'fr-FR': ['activité', 'coefficient d\'activité', 'NRTL', 'Wilson'],
        'ko-KR': ['활동도', '활동도 계수', 'NRTL', 'Wilson']
      },
      description: {
        'zh-CN': '非理想溶液中的活度修正、活度系数模型（NRTL、Wilson）的深度应用',
        'en-US': 'Activity correction in non-ideal solutions and advanced activity coefficient models',
        'ja-JP': '非理想溶液における活量補正と活量係数モデル',
        'es-ES': 'Corrección de actividad en soluciones no ideales y modelos de coeficientes',
        'fr-FR': 'Correction d\'activité dans les solutions non idéales et modèles de coefficients',
        'ko-KR': '비이상 용액의 활동도 보정 및 활동도 계수 모델'
      },
      prerequisites: ['kp_002', 'kp_006']
    },
    {
      id: 'kp_008',
      name: {
        'zh-CN': '麦克斯韦关系式',
        'en-US': 'Maxwell Relations',
        'ja-JP': 'マクスウェル関係式',
        'es-ES': 'Relaciones de Maxwell',
        'fr-FR': 'Relations de Maxwell',
        'ko-KR': '맥스웰 관계식'
      },
      discipline: 'physical-thermodynamics',
      difficulty: 5,
      keywords: {
        'zh-CN': ['麦克斯韦', '偏导数', '热力学势', '勒让德变换', '路径函数'],
        'en-US': ['Maxwell', 'partial derivatives', 'thermodynamic potential', 'Legendre transform'],
        'ja-JP': ['マクスウェル', '偏導関数', '熱力学ポテンシャル', 'ルジャンドル変換'],
        'es-ES': ['Maxwell', 'derivadas parciales', 'potencial termodinámico'],
        'fr-FR': ['Maxwell', 'dérivées partielles', 'potentiel thermodynamique'],
        'ko-KR': ['맥스웰', '편미분', '열역학 포텐셜']
      },
      description: {
        'zh-CN': '热力学关系式的数学推导，涉及偏导数变换和热力学势的相互转换',
        'en-US': 'Mathematical derivation of thermodynamic relations with partial derivatives and potential transformations',
        'ja-JP': '偏導関数を含む熱力学関係式の数学的導出',
        'es-ES': 'Derivación matemática de relaciones termodinámicas',
        'fr-FR': 'Dérivation mathématique des relations thermodynamiques',
        'ko-KR': '편미분을 포함하는 열역학 관계식의 수학적 유도'
      },
      prerequisites: ['kp_004', 'kp_007']
    },

    // Physical Chemistry - Kinetics (动力学)
    {
      id: 'kp_010',
      name: {
        'zh-CN': '反应速率与速率方程',
        'en-US': 'Reaction Rate & Rate Equations',
        'ja-JP': '反応速度と速度方程式',
        'es-ES': 'Velocidad de Reacción y Ecuaciones de Velocidad',
        'fr-FR': 'Vitesse de Réaction et Équations de Vitesse',
        'ko-KR': '반응 속도 및 속도 방정식'
      },
      discipline: 'physical-kinetics',
      difficulty: 2,
      keywords: {
        'zh-CN': ['反应速率', '速率方程', '反应级数', '速率常数', '一级反应', '二级反应'],
        'en-US': ['reaction rate', 'rate law', 'reaction order', 'rate constant'],
        'ja-JP': ['反応速度', '速度方程式', '反応次数', '速度定数'],
        'es-ES': ['velocidad de reacción', 'ecuación de velocidad', 'orden de reacción'],
        'fr-FR': ['vitesse de réaction', 'équation de vitesse', 'ordre de réaction'],
        'ko-KR': ['반응 속도', '속도 방정식', '반응 차수', '속도 상수']
      },
      description: {
        'zh-CN': '化学反应的速率规律、速率方程的形式、反应级数的测定',
        'en-US': 'Rate laws, differential and integrated rate equations, determination of reaction order',
        'ja-JP': '化学反応の速度法則と動力学方程式',
        'es-ES': 'Leyes de velocidad y ecuaciones cinéticas de reacciones',
        'fr-FR': 'Lois de vitesse et équations cinétiques des réactions',
        'ko-KR': '화학 반응의 속도 법칙 및 동역학 방정식'
      }
    },
    {
      id: 'kp_011',
      name: {
        'zh-CN': '激活能与温度的影响',
        'en-US': 'Activation Energy & Temperature Effects',
        'ja-JP': '活性化エネルギーと温度の影響',
        'es-ES': 'Energía de Activación y Efectos de la Temperatura',
        'fr-FR': 'Énergie d\'Activation et Effets de la Température',
        'ko-KR': '활성화 에너지 및 온도 영향'
      },
      discipline: 'physical-kinetics',
      difficulty: 3,
      keywords: {
        'zh-CN': ['活化能', '阿伦尼乌斯', 'Ea', '温度', '反应速率', '动力学'],
        'en-US': ['activation energy', 'Arrhenius', 'temperature', 'kinetics'],
        'ja-JP': ['活性化エネルギー', 'アレニウス', '温度', '反応速度'],
        'es-ES': ['energía de activación', 'Arrhenius', 'temperatura'],
        'fr-FR': ['énergie d\'activation', 'Arrhenius', 'température'],
        'ko-KR': ['활성화 에너지', '아레니우스', '온도']
      },
      description: {
        'zh-CN': '阿伦尼乌斯公式、活化能的计算、温度对反应速率的影响',
        'en-US': 'Arrhenius equation, activation energy calculation, temperature dependence of rate constants',
        'ja-JP': 'アレニウスの式と活性化エネルギーの計算',
        'es-ES': 'Ecuación de Arrhenius y cálculo de energía de activación',
        'fr-FR': 'Équation d\'Arrhenius et calcul de l\'énergie d\'activation',
        'ko-KR': '아레니우스 방정식 및 활성화 에너지 계산'
      },
      prerequisites: ['kp_010']
    },
    {
      id: 'kp_012',
      name: {
        'zh-CN': '反应机理与基元反应',
        'en-US': 'Reaction Mechanism & Elementary Steps',
        'ja-JP': '反応機構と基本素反応',
        'es-ES': 'Mecanismo de Reacción y Pasos Elementales',
        'fr-FR': 'Mécanisme de Réaction et Étapes Élémentaires',
        'ko-KR': '반응 메커니즘 및 기본 단계'
      },
      discipline: 'physical-kinetics',
      difficulty: 3,
      keywords: {
        'zh-CN': ['反应机理', '基元反应', '中间体', '速控步', '平衡前提'],
        'en-US': ['mechanism', 'elementary step', 'intermediate', 'rate-determining step'],
        'ja-JP': ['反応機構', '基本素反応', '中間体', '速度決定段階'],
        'es-ES': ['mecanismo', 'paso elemental', 'intermediario', 'paso determinante'],
        'fr-FR': ['mécanisme', 'étape élémentaire', 'intermédiaire', 'étape déterminante'],
        'ko-KR': ['반응 메커니즘', '기본 단계', '중간체', '속도 결정 단계']
      },
      description: {
        'zh-CN': '反应过程的分步机理、中间体、速控步的识别、机理与总反应式的关系',
        'en-US': 'Multistep reaction mechanisms, intermediates, rate-determining steps, and mechanism verification',
        'ja-JP': '反応機構の分段階的解析と中間体の同定',
        'es-ES': 'Análisis de mecanismo de reacción y identificación de intermediarios',
        'fr-FR': 'Analyse du mécanisme de réaction et identification des intermédiaires',
        'ko-KR': '반응 메커니즘의 단계별 분석 및 중간체 동정'
      },
      prerequisites: ['kp_010']
    },
    {
      id: 'kp_013',
      name: {
        'zh-CN': '催化作用与催化剂',
        'en-US': 'Catalysis & Catalysts',
        'ja-JP': '触媒作用と触媒',
        'es-ES': 'Catálisis y Catalizadores',
        'fr-FR': 'Catalyse et Catalyseurs',
        'ko-KR': '촉매 작용 및 촉매'
      },
      discipline: 'physical-kinetics',
      difficulty: 3,
      keywords: {
        'zh-CN': ['催化', '催化剂', '活化能', '反应速率', '均相', '非均相'],
        'en-US': ['catalysis', 'catalyst', 'homogeneous', 'heterogeneous'],
        'ja-JP': ['触媒', '触媒作用', '均一', '不均一'],
        'es-ES': ['catálisis', 'catalizador', 'homogéneo', 'heterogéneo'],
        'fr-FR': ['catalyse', 'catalyseur', 'homogène', 'hétérogène'],
        'ko-KR': ['촉매', '촉매 작용', '균일', '비균일']
      },
      description: {
        'zh-CN': '催化剂的定义与性质、催化作用的原理、均相与非均相催化',
        'en-US': 'Definition of catalysts, catalytic principles, homogeneous and heterogeneous catalysis',
        'ja-JP': '触媒の定義と特性、触媒作用の原理',
        'es-ES': 'Definición de catalizadores y principios de catálisis',
        'fr-FR': 'Définition des catalyseurs et principes de catalyse',
        'ko-KR': '촉매의 정의와 특성, 촉매 작용의 원리'
      },
      prerequisites: ['kp_011']
    },
    {
      id: 'kp_014',
      name: {
        'zh-CN': '复杂反应网络与动力学模型',
        'en-US': 'Complex Reaction Networks & Kinetic Models',
        'ja-JP': '複雑反応ネットワークと動力学モデル',
        'es-ES': 'Redes de Reacción Complejas y Modelos Cinéticos',
        'fr-FR': 'Réseaux de Réaction Complexes et Modèles Cinétiques',
        'ko-KR': '복잡한 반응 네트워크 및 동역학 모델'
      },
      discipline: 'physical-kinetics',
      difficulty: 4,
      keywords: {
        'zh-CN': ['平行反应', '连串反应', '对峙反应', '准稳态', 'Michaelis-Menten'],
        'en-US': ['parallel reaction', 'consecutive', 'pre-equilibrium', 'Michaelis-Menten'],
        'ja-JP': ['平行反応', '連続反応', '準定常状態', 'Michaelis-Menten'],
        'es-ES': ['reacción paralela', 'consecutiva', 'preequilibrio', 'Michaelis-Menten'],
        'fr-FR': ['réaction parallèle', 'consécutive', 'prééquilibre', 'Michaelis-Menten'],
        'ko-KR': ['평행 반응', '연속 반응', '준정상 상태', 'Michaelis-Menten']
      },
      description: {
        'zh-CN': '平行、连串和对峙反应的动力学分析，准稳态近似，酶动力学模型',
        'en-US': 'Kinetic analysis of parallel, consecutive, and competing reactions, pre-equilibrium approximation',
        'ja-JP': '平行・連続・対峙反応の動力学解析',
        'es-ES': 'Análisis cinético de reacciones paralelas, consecutivas y competitivas',
        'fr-FR': 'Analyse cinétique des réactions parallèles, consécutives et concurrentes',
        'ko-KR': '평행, 연속 및 경쟁 반응의 동역학 분석'
      },
      prerequisites: ['kp_012', 'kp_013']
    },

    // Physical Chemistry - Electrochemistry (电化学)
    {
      id: 'kp_020',
      name: {
        'zh-CN': '氧化还原反应与电子转移',
        'en-US': 'Redox Reactions & Electron Transfer',
        'ja-JP': '酸化還元反応と電子移動',
        'es-ES': 'Reacciones Redox y Transferencia de Electrones',
        'fr-FR': 'Réactions Redox et Transfert d\'Électrons',
        'ko-KR': '산화 환원 반응 및 전자 이동'
      },
      discipline: 'physical-electrochemistry',
      difficulty: 2,
      keywords: {
        'zh-CN': ['氧化还原', '氧化数', '还原剂', '氧化剂', '电子转移'],
        'en-US': ['redox', 'oxidation number', 'reducer', 'oxidizer', 'electron transfer'],
        'ja-JP': ['酸化還元', '酸化数', '還元剤', '酸化剤'],
        'es-ES': ['redox', 'número de oxidación', 'reductor', 'oxidante'],
        'fr-FR': ['redox', 'nombre d\'oxydation', 'réducteur', 'oxydant'],
        'ko-KR': ['산화 환원', '산화수', '환원제', '산화제']
      },
      description: {
        'zh-CN': '氧化数的定义和计算、氧化还原反应的分析和配平',
        'en-US': 'Oxidation number definition, redox reaction analysis and balancing',
        'ja-JP': '酸化数の定義と計算、酸化還元反応の分析',
        'es-ES': 'Definición del número de oxidación y análisis de reacciones redox',
        'fr-FR': 'Définition du nombre d\'oxydation et analyse des réactions redox',
        'ko-KR': '산화수의 정의 및 계산, 산화 환원 반응의 분석'
      }
    },
    {
      id: 'kp_021',
      name: {
        'zh-CN': '电极电势与Nernst方程',
        'en-US': 'Electrode Potential & Nernst Equation',
        'ja-JP': '電極電位とNernst方程式',
        'es-ES': 'Potencial de Electrodo y Ecuación de Nernst',
        'fr-FR': 'Potentiel d\'Électrode et Équation de Nernst',
        'ko-KR': '전극 전위 및 Nernst 방정식'
      },
      discipline: 'physical-electrochemistry',
      difficulty: 3,
      keywords: {
        'zh-CN': ['电极电势', '标准电位', 'Nernst', '原电池', '电势'],
        'en-US': ['electrode potential', 'standard potential', 'Nernst', 'galvanic cell'],
        'ja-JP': ['電極電位', '標準電位', 'Nernst', 'ガルバニ電池'],
        'es-ES': ['potencial de electrodo', 'potencial estándar', 'Nernst'],
        'fr-FR': ['potentiel d\'électrode', 'potentiel standard', 'Nernst'],
        'ko-KR': ['전극 전위', '표준 전위', 'Nernst']
      },
      description: {
        'zh-CN': '标准电位的定义、Nernst方程的推导与应用、电极反应的书写',
        'en-US': 'Standard electrode potential, Nernst equation derivation and application',
        'ja-JP': '標準電位の定義とNernst方程式の導出と応用',
        'es-ES': 'Definición de potencial estándar y ecuación de Nernst',
        'fr-FR': 'Définition du potentiel standard et équation de Nernst',
        'ko-KR': '표준 전위의 정의 및 Nernst 방정식의 유도 및 응용'
      },
      prerequisites: ['kp_020']
    },
    {
      id: 'kp_022',
      name: {
        'zh-CN': '原电池与电解',
        'en-US': 'Galvanic Cells & Electrolysis',
        'ja-JP': 'ガルバニ電池と電解',
        'es-ES': 'Celdas Galvánicas y Electrólisis',
        'fr-FR': 'Piles Galvaniques et Électrolyse',
        'ko-KR': '갈바닉 전지 및 전기분해'
      },
      discipline: 'physical-electrochemistry',
      difficulty: 3,
      keywords: {
        'zh-CN': ['原电池', '电解', '电极', '阴阳极', '电子流', '离子流'],
        'en-US': ['galvanic cell', 'electrolysis', 'anode', 'cathode', 'current'],
        'ja-JP': ['ガルバニ電池', '電解', '陽極', '陰極'],
        'es-ES': ['celda galvánica', 'electrólisis', 'ánodo', 'cátodo'],
        'fr-FR': ['pile galvanique', 'électrolyse', 'anode', 'cathode'],
        'ko-KR': ['갈바닉 전지', '전기분해', '양극', '음극']
      },
      description: {
        'zh-CN': '原电池的构成、电极反应、电解的原理和应用',
        'en-US': 'Galvanic cell construction, electrode reactions, electrolysis principles and applications',
        'ja-JP': 'ガルバニ電池の構成と電極反応、電解の原理',
        'es-ES': 'Composición de celdas galvánicas y principios de electrólisis',
        'fr-FR': 'Composition des piles galvaniques et principes d\'électrolyse',
        'ko-KR': '갈바닉 전지의 구성 및 전기분해의 원리'
      },
      prerequisites: ['kp_021']
    },
    {
      id: 'kp_023',
      name: {
        'zh-CN': '电极过程与极化',
        'en-US': 'Electrode Processes & Polarization',
        'ja-JP': '電極過程と分極',
        'es-ES': 'Procesos de Electrodo y Polarización',
        'fr-FR': 'Processus d\'Électrode et Polarisation',
        'ko-KR': '전극 과정 및 편극'
      },
      discipline: 'physical-electrochemistry',
      difficulty: 4,
      keywords: {
        'zh-CN': ['过电位', '极化', 'Butler-Volmer', '扩散过程', '电荷转移'],
        'en-US': ['overpotential', 'polarization', 'Butler-Volmer', 'diffusion'],
        'ja-JP': ['過電位', '分極', 'Butler-Volmer', '拡散'],
        'es-ES': ['sobrevoltaje', 'polarización', 'Butler-Volmer', 'difusión'],
        'fr-FR': ['surtension', 'polarisation', 'Butler-Volmer', 'diffusion'],
        'ko-KR': ['과전위', '편극', 'Butler-Volmer', '확산']
      },
      description: {
        'zh-CN': '电极反应的动力学、过电位的概念、Butler-Volmer方程、极限电流',
        'en-US': 'Kinetics of electrode reactions, overpotential concept, Butler-Volmer equation, limiting current',
        'ja-JP': '電極反応の動力学と過電位の概念',
        'es-ES': 'Cinética de reacciones de electrodo y concepto de sobrevoltaje',
        'fr-FR': 'Cinétique des réactions d\'électrode et concept de surtension',
        'ko-KR': '전극 반응의 동역학 및 과전위 개념'
      },
      prerequisites: ['kp_022']
    },

    // Inorganic Chemistry - Basic (基础)
    {
      id: 'kp_030',
      name: {
        'zh-CN': '物质的分类与命名',
        'en-US': 'Classification & Nomenclature of Substances',
        'ja-JP': '物質の分類と命名',
        'es-ES': 'Clasificación y Nomenclatura de Sustancias',
        'fr-FR': 'Classification et Nomenclature des Substances',
        'ko-KR': '물질의 분류 및 명명'
      },
      discipline: 'inorganic-basic',
      difficulty: 1,
      keywords: {
        'zh-CN': ['单质', '化合物', '命名', '化学式', '酸碱盐'],
        'en-US': ['element', 'compound', 'nomenclature', 'chemical formula'],
        'ja-JP': ['元素', '化合物', '命名', '化学式'],
        'es-ES': ['elemento', 'compuesto', 'nomenclatura', 'fórmula química'],
        'fr-FR': ['élément', 'composé', 'nomenclature', 'formule chimique'],
        'ko-KR': ['원소', '화합물', '명명', '화학식']
      },
      description: {
        'zh-CN': '物质的基本分类、系统命名法、常见物质的命名规则',
        'en-US': 'Basic classification of substances, systematic nomenclature, naming rules',
        'ja-JP': '物質の基本的な分類と命名法',
        'es-ES': 'Clasificación básica de sustancias y reglas de nomenclatura',
        'fr-FR': 'Classification de base des substances et règles de nomenclature',
        'ko-KR': '물질의 기본 분류 및 명명 규칙'
      }
    },
    {
      id: 'kp_031',
      name: {
        'zh-CN': '微粒之间的相互作用',
        'en-US': 'Intermolecular Forces',
        'ja-JP': '分子間力',
        'es-ES': 'Fuerzas Intermoleculares',
        'fr-FR': 'Forces Intermoléculaires',
        'ko-KR': '분자간 힘'
      },
      discipline: 'inorganic-basic',
      difficulty: 2,
      keywords: {
        'zh-CN': ['离子键', '共价键', '金属键', '氢键', '范德华力'],
        'en-US': ['ionic bond', 'covalent bond', 'metallic bond', 'hydrogen bond', 'van der Waals'],
        'ja-JP': ['イオン結合', '共有結合', '金属結合', '水素結合', 'ファンデルワールス力'],
        'es-ES': ['enlace iónico', 'enlace covalente', 'enlace metálico', 'puente de hidrógeno'],
        'fr-FR': ['liaison ionique', 'liaison covalente', 'liaison métallique', 'liaison hydrogène'],
        'ko-KR': ['이온 결합', '공유 결합', '금속 결합', '수소 결합']
      },
      description: {
        'zh-CN': '离子键、共价键、金属键的形成、强度比较、性质影响',
        'en-US': 'Formation of ionic, covalent, and metallic bonds, strength comparison, property effects',
        'ja-JP': 'イオン結合、共有結合、金属結合の形成と特性',
        'es-ES': 'Formación de enlaces iónicos, covalentes y metálicos',
        'fr-FR': 'Formation des liaisons ioniques, covalentes et métalliques',
        'ko-KR': '이온 결합, 공유 결합, 금속 결합의 형성'
      }
    },
    {
      id: 'kp_032',
      name: {
        'zh-CN': '酸碱反应与中和热',
        'en-US': 'Acid-Base Reactions & Heat of Neutralization',
        'ja-JP': '酸塩基反応と中和熱',
        'es-ES': 'Reacciones Ácido-Base y Calor de Neutralización',
        'fr-FR': 'Réactions Acide-Base et Chaleur de Neutralisation',
        'ko-KR': '산염기 반응 및 중화열'
      },
      discipline: 'inorganic-basic',
      difficulty: 2,
      keywords: {
        'zh-CN': ['酸', '碱', 'pH', '中和反应', '中和热', '盐'],
        'en-US': ['acid', 'base', 'pH', 'neutralization', 'salt'],
        'ja-JP': ['酸', '塩基', 'pH', '中和反応', '中和熱'],
        'es-ES': ['ácido', 'base', 'pH', 'neutralización', 'calor'],
        'fr-FR': ['acide', 'base', 'pH', 'neutralisation', 'chaleur'],
        'ko-KR': ['산', '염기', 'pH', '중화 반응', '중화열']
      },
      description: {
        'zh-CN': '酸碱的电离与水解、中和反应、中和热的测定',
        'en-US': 'Ionization and hydrolysis of acids and bases, neutralization reactions',
        'ja-JP': '酸と塩基のイオン化と水解、中和反応',
        'es-ES': 'Ionización e hidrólisis de ácidos y bases',
        'fr-FR': 'Ionisation et hydrolyse des acides et des bases',
        'ko-KR': '산과 염기의 이온화 및 가수분해, 중화 반응'
      }
    },
    {
      id: 'kp_033',
      name: {
        'zh-CN': '沉淀溶解平衡',
        'en-US': 'Solubility Equilibrium',
        'ja-JP': '溶解度平衡',
        'es-ES': 'Equilibrio de Solubilidad',
        'fr-FR': 'Équilibre de Solubilité',
        'ko-KR': '용해도 평형'
      },
      discipline: 'inorganic-basic',
      difficulty: 2,
      keywords: {
        'zh-CN': ['溶解度', '沉淀', 'Ksp', '溶积', '沉淀条件', '沉淀分离'],
        'en-US': ['solubility', 'precipitation', 'Ksp', 'solubility product'],
        'ja-JP': ['溶解度', '沈澱', 'Ksp', '溶解度積'],
        'es-ES': ['solubilidad', 'precipitación', 'Ksp', 'producto de solubilidad'],
        'fr-FR': ['solubilité', 'précipitation', 'Ksp', 'produit de solubilité'],
        'ko-KR': ['용해도', '침전', 'Ksp', '용해도 곱']
      },
      description: {
        'zh-CN': '溶解度积常数的定义、沉淀的形成与溶解、沉淀分离的原理',
        'en-US': 'Solubility product constant, precipitation and dissolution, separation principles',
        'ja-JP': '溶解度積定数の定義と沈澱の形成',
        'es-ES': 'Definición de producto de solubilidad y formación de precipitados',
        'fr-FR': 'Définition du produit de solubilité et formation de précipités',
        'ko-KR': '용해도 곱 정수의 정의 및 침전의 형성'
      }
    },

    // Inorganic Chemistry - Structure (结构)
    {
      id: 'kp_040',
      name: {
        'zh-CN': '晶体结构与晶格能',
        'en-US': 'Crystal Structure & Lattice Energy',
        'ja-JP': '結晶構造と格子エネルギー',
        'es-ES': 'Estructura Cristalina y Energía de Red',
        'fr-FR': 'Structure Cristalline et Énergie Réticulaire',
        'ko-KR': '결정 구조 및 격자 에너지'
      },
      discipline: 'inorganic-structure',
      difficulty: 3,
      keywords: {
        'zh-CN': ['晶体', '晶胞', '晶格', '马德隆常数', '离子晶体'],
        'en-US': ['crystal', 'unit cell', 'lattice', 'Madelung constant'],
        'ja-JP': ['結晶', '単位胞', '格子', 'マデルング定数'],
        'es-ES': ['cristal', 'celda unitaria', 'red', 'constante de Madelung'],
        'fr-FR': ['cristal', 'maille élémentaire', 'réseau', 'constante de Madelung'],
        'ko-KR': ['결정', '단위포', '격자', 'Madelung 상수']
      },
      description: {
        'zh-CN': '离子晶体的结构类型、晶格能的计算与应用、物质性质与晶体结构的关系',
        'en-US': 'Ionic crystal structure types, lattice energy calculation, structure-property relationships',
        'ja-JP': 'イオン結晶の構造と格子エネルギーの計算',
        'es-ES': 'Estructura de cristales iónicos y cálculo de energía de red',
        'fr-FR': 'Structure des cristaux ioniques et calcul de l\'énergie réticulaire',
        'ko-KR': '이온 결정의 구조 및 격자 에너지 계산'
      }
    },
    {
      id: 'kp_041',
      name: {
        'zh-CN': '配合物与晶体场理论',
        'en-US': 'Coordination Compounds & Crystal Field Theory',
        'ja-JP': '配位化合物と結晶場理論',
        'es-ES': 'Complejos de Coordinación y Teoría del Campo Cristalino',
        'fr-FR': 'Composés de Coordination et Théorie du Champ Cristallin',
        'ko-KR': '배위 화합물 및 결정장 이론'
      },
      discipline: 'inorganic-structure',
      difficulty: 4,
      keywords: {
        'zh-CN': ['配合物', '配位数', '晶体场分裂', 'CFSE', '磁性', '颜色'],
        'en-US': ['complex', 'coordination number', 'crystal field splitting', 'CFSE'],
        'ja-JP': ['配位化合物', '配位数', '結晶場分裂', 'CFSE'],
        'es-ES': ['complejo', 'número de coordinación', 'división de campo cristalino'],
        'fr-FR': ['complexe', 'nombre de coordination', 'scission du champ cristallin'],
        'ko-KR': ['배위 화합물', '배위수', '결정장 분열', 'CFSE']
      },
      description: {
        'zh-CN': '配合物的结构、配位场理论、晶体场分裂能、过渡金属配合物的磁性和颜色',
        'en-US': 'Coordination complex structures, crystal field theory, magnetism and colors of transition metal complexes',
        'ja-JP': '配位化合物の構造と結晶場理論',
        'es-ES': 'Estructura de complejos de coordinación y teoría del campo cristalino',
        'fr-FR': 'Structure des complexes de coordination et théorie du champ cristallin',
        'ko-KR': '배위 화합물의 구조 및 결정장 이론'
      },
      prerequisites: ['kp_031']
    },
    {
      id: 'kp_042',
      name: {
        'zh-CN': '金属键与金属材料',
        'en-US': 'Metallic Bonding & Metal Materials',
        'ja-JP': '金属結合と金属材料',
        'es-ES': 'Enlace Metálico y Materiales Metálicos',
        'fr-FR': 'Liaison Métallique et Matériaux Métalliques',
        'ko-KR': '금속 결합 및 금속 재료'
      },
      discipline: 'inorganic-structure',
      difficulty: 3,
      keywords: {
        'zh-CN': ['金属键', '金属晶体', '自由电子模型', '金属性质', '合金'],
        'en-US': ['metallic bond', 'metal crystal', 'free electron', 'alloy'],
        'ja-JP': ['金属結合', '金属結晶', '自由電子', '合金'],
        'es-ES': ['enlace metálico', 'cristal metálico', 'electrón libre', 'aleación'],
        'fr-FR': ['liaison métallique', 'cristal métallique', 'électron libre', 'alliage'],
        'ko-KR': ['금속 결합', '금속 결정', '자유 전자', '합금']
      },
      description: {
        'zh-CN': '金属键的本质、金属的物理性质、合金的分类与应用',
        'en-US': 'Nature of metallic bonding, physical properties of metals, classification and applications of alloys',
        'ja-JP': '金属結合の本質と金属の物理的特性',
        'es-ES': 'Naturaleza de la unión metálica y propiedades de los metales',
        'fr-FR': 'Nature de la liaison métallique et propriétés des métaux',
        'ko-KR': '금속 결합의 본질 및 금속의 물리적 특성'
      },
      prerequisites: ['kp_031']
    },

    // Analytical Chemistry - Titration (滴定)
    {
      id: 'kp_050',
      name: {
        'zh-CN': '滴定分析原理',
        'en-US': 'Principles of Titration Analysis',
        'ja-JP': '滴定分析の原理',
        'es-ES': 'Principios de Análisis por Titulación',
        'fr-FR': 'Principes de l\'Analyse par Titrage',
        'ko-KR': '적정 분석의 원리'
      },
      discipline: 'analytical-titration',
      difficulty: 2,
      keywords: {
        'zh-CN': ['滴定', '当量点', '终点', '指示剂', '标准溶液', '浓度'],
        'en-US': ['titration', 'equivalence point', 'endpoint', 'indicator', 'standard solution'],
        'ja-JP': ['滴定', '等当点', '終点', '指示薬', '標準溶液'],
        'es-ES': ['titulación', 'punto de equivalencia', 'punto final', 'indicador'],
        'fr-FR': ['titrage', 'point d\'équivalence', 'point final', 'indicateur'],
        'ko-KR': ['적정', '동등점', '종점', '지시약', '표준 용액']
      },
      description: {
        'zh-CN': '滴定分析的基本原理、指示剂的选择、当量点与终点的关系',
        'en-US': 'Basic principles of titration, indicator selection, relationship between equivalence and endpoints',
        'ja-JP': '滴定分析の基本原理と指示薬の選択',
        'es-ES': 'Principios básicos de titulación y selección de indicadores',
        'fr-FR': 'Principes fondamentaux de titrage et sélection des indicateurs',
        'ko-KR': '적정 분석의 기본 원리 및 지시약 선택'
      }
    },
    {
      id: 'kp_051',
      name: {
        'zh-CN': '酸碱滴定',
        'en-US': 'Acid-Base Titration',
        'ja-JP': '酸塩基滴定',
        'es-ES': 'Titulación Ácido-Base',
        'fr-FR': 'Titrage Acido-Basique',
        'ko-KR': '산염기 적정'
      },
      discipline: 'analytical-titration',
      difficulty: 2,
      keywords: {
        'zh-CN': ['酸碱滴定', '酸性', '碱性', '中性', '滴定曲线', '突跃范围'],
        'en-US': ['acid-base titration', 'acidic', 'basic', 'neutral', 'titration curve'],
        'ja-JP': ['酸塩基滴定', '酸性', '塩基性', '中性', '滴定曲線'],
        'es-ES': ['titulación ácido-base', 'ácido', 'básico', 'neutral', 'curva de titulación'],
        'fr-FR': ['titrage acido-basique', 'acide', 'basique', 'neutre', 'courbe de titrage'],
        'ko-KR': ['산염기 적정', '산성', '염기성', '중성', '적정 곡선']
      },
      description: {
        'zh-CN': '酸碱滴定的操作、滴定曲线的形状、强酸弱碱/弱酸强碱盐的滴定',
        'en-US': 'Acid-base titration procedures, titration curves, titration of salt solutions',
        'ja-JP': '酸塩基滴定の操作と滴定曲線',
        'es-ES': 'Procedimiento de titulación ácido-base y curvas de titulación',
        'fr-FR': 'Procédure de titrage acido-basique et courbes de titrage',
        'ko-KR': '산염기 적정의 절차 및 적정 곡선'
      },
      prerequisites: ['kp_050']
    },
    {
      id: 'kp_052',
      name: {
        'zh-CN': '络合滴定与EDTA',
        'en-US': 'Complexometric Titration & EDTA',
        'ja-JP': '錯体滴定とEDTA',
        'es-ES': 'Titulación Complexométrica y EDTA',
        'fr-FR': 'Titrage Complexométrique et EDTA',
        'ko-KR': '착물 적정 및 EDTA'
      },
      discipline: 'analytical-titration',
      difficulty: 3,
      keywords: {
        'zh-CN': ['EDTA', '络合滴定', '络离子', '金属离子', '指示剂', '条件平衡常数'],
        'en-US': ['EDTA', 'complexometric titration', 'complex ion', 'metal ion'],
        'ja-JP': ['EDTA', '錯体滴定', '錯体イオン', '金属イオン'],
        'es-ES': ['EDTA', 'titulación complexométrica', 'ion complejo', 'ion metálico'],
        'fr-FR': ['EDTA', 'titrage complexométrique', 'ion complexe', 'ion métallique'],
        'ko-KR': ['EDTA', '착물 적정', '착물 이온', '금속 이온']
      },
      description: {
        'zh-CN': 'EDTA的性质、络合滴定的原理、选择性滴定',
        'en-US': 'EDTA properties, principles of complexometric titration, selective titration',
        'ja-JP': 'EDTAの性質と錯体滴定の原理',
        'es-ES': 'Propiedades del EDTA y principios de titulación complexométrica',
        'fr-FR': 'Propriétés de l\'EDTA et principes de titrage complexométrique',
        'ko-KR': 'EDTA의 성질 및 착물 적정의 원리'
      },
      prerequisites: ['kp_050', 'kp_041']
    },

    // Analytical Chemistry - Instrumental (仪器)
    {
      id: 'kp_060',
      name: {
        'zh-CN': '分光光度法原理',
        'en-US': 'Spectrophotometry Principles',
        'ja-JP': '分光光度法の原理',
        'es-ES': 'Principios de Espectrofotometría',
        'fr-FR': 'Principes de Spectrophotométrie',
        'ko-KR': '분광광도법의 원리'
      },
      discipline: 'analytical-instrumental',
      difficulty: 3,
      keywords: {
        'zh-CN': ['紫外-可见', '吸光度', 'Beer定律', '摩尔吸光系数', '波长'],
        'en-US': ['UV-Vis', 'absorbance', 'Beer\'s law', 'molar absorptivity'],
        'ja-JP': ['紫外-可視', '吸光度', 'Beer則', 'モル吸光係数'],
        'es-ES': ['UV-Vis', 'absorbancia', 'ley de Beer', 'absorptividad molar'],
        'fr-FR': ['UV-Vis', 'absorbance', 'loi de Beer', 'absorptivité molaire'],
        'ko-KR': ['자외-가시', '흡광도', 'Beer 법칙', '몰 흡광 계수']
      },
      description: {
        'zh-CN': '光的吸收、Beer定律、分光光度计的应用、定量分析',
        'en-US': 'Light absorption, Beer\'s law, spectrophotometer application, quantitative analysis',
        'ja-JP': '光の吸収とBeer則、分光光度計の応用',
        'es-ES': 'Absorción de luz, ley de Beer, aplicación de espectrofotómetro',
        'fr-FR': 'Absorption de la lumière, loi de Beer, application du spectrophotomètre',
        'ko-KR': '빛의 흡수 및 Beer 법칙, 분광광도계 응용'
      }
    },
    {
      id: 'kp_061',
      name: {
        'zh-CN': '气相色谱法',
        'en-US': 'Gas Chromatography (GC)',
        'ja-JP': 'ガスクロマトグラフィー',
        'es-ES': 'Cromatografía de Gases',
        'fr-FR': 'Chromatographie en Phase Gazeuse',
        'ko-KR': '기체 색층분석'
      },
      discipline: 'analytical-instrumental',
      difficulty: 3,
      keywords: {
        'zh-CN': ['气相色谱', '分离', '检测器', '保留时间', '定性', '定量'],
        'en-US': ['GC', 'separation', 'detector', 'retention time', 'qualitative', 'quantitative'],
        'ja-JP': ['ガスクロマトグラフィー', '分離', '検出器', '保持時間'],
        'es-ES': ['cromatografía de gases', 'separación', 'detector', 'tiempo de retención'],
        'fr-FR': ['chromatographie gazeuse', 'séparation', 'détecteur', 'temps de rétention'],
        'ko-KR': ['기체 색층분석', '분리', '검출기', '보류 시간']
      },
      description: {
        'zh-CN': '气相色谱法的原理、分离机制、检测器类型、定性和定量分析',
        'en-US': 'Principles of gas chromatography, separation mechanism, detector types, qualitative and quantitative analysis',
        'ja-JP': 'ガスクロマトグラフィーの原理と分離機構',
        'es-ES': 'Principios de cromatografía de gases y mecanismo de separación',
        'fr-FR': 'Principes de chromatographie gazeuse et mécanisme de séparation',
        'ko-KR': '기체 색층분석의 원리 및 분리 메커니즘'
      }
    },
    {
      id: 'kp_062',
      name: {
        'zh-CN': '高效液相色谱法',
        'en-US': 'High Performance Liquid Chromatography (HPLC)',
        'ja-JP': '高速液体クロマトグラフィー',
        'es-ES': 'Cromatografía Líquida de Alta Resolución',
        'fr-FR': 'Chromatographie Liquide Haute Performance',
        'ko-KR': '고성능 액체 색층분석'
      },
      discipline: 'analytical-instrumental',
      difficulty: 3,
      keywords: {
        'zh-CN': ['HPLC', '液相色谱', '分离', '流动相', '固定相', '色谱图'],
        'en-US': ['HPLC', 'liquid chromatography', 'mobile phase', 'stationary phase'],
        'ja-JP': ['HPLC', '液体クロマトグラフィー', '移動相', '固定相'],
        'es-ES': ['HPLC', 'fase móvil', 'fase estacionaria'],
        'fr-FR': ['HPLC', 'phase mobile', 'phase stationnaire'],
        'ko-KR': ['HPLC', '이동상', '고정상']
      },
      description: {
        'zh-CN': '高效液相色谱法的原理、分离机理、在混合物分离中的应用',
        'en-US': 'HPLC principles, separation mechanisms, application in mixture analysis',
        'ja-JP': 'HPLCの原理と分離機構',
        'es-ES': 'Principios de HPLC y mecanismo de separación',
        'fr-FR': 'Principes de HPLC et mécanisme de séparation',
        'ko-KR': 'HPLC의 원리 및 분리 메커니즘'
      }
    },

    // Organic Chemistry - Structure (结构)
    {
      id: 'kp_070',
      name: {
        'zh-CN': '烃的结构与同分异体',
        'en-US': 'Structure of Hydrocarbons & Isomerism',
        'ja-JP': '炭化水素の構造と異性体',
        'es-ES': 'Estructura de Hidrocarburos e Isomería',
        'fr-FR': 'Structure des Hydrocarbures et Isomérisme',
        'ko-KR': '탄화수소의 구조 및 이성질체'
      },
      discipline: 'organic-structure',
      difficulty: 2,
      keywords: {
        'zh-CN': ['烷烃', '烯烃', '炔烃', '苯', '同分异体', '构造异体'],
        'en-US': ['alkane', 'alkene', 'alkyne', 'benzene', 'isomer'],
        'ja-JP': ['アルカン', 'アルケン', 'アルキン', 'ベンゼン', '異性体'],
        'es-ES': ['alcano', 'alqueno', 'alquino', 'benceno', 'isómero'],
        'fr-FR': ['alcane', 'alcène', 'alcyne', 'benzène', 'isomère'],
        'ko-KR': ['알칸', '알켄', '알킨', '벤젠', '이성질체']
      },
      description: {
        'zh-CN': '烃的类型、烃的命名、同分异体的分类与判断',
        'en-US': 'Types of hydrocarbons, nomenclature, classification and identification of isomers',
        'ja-JP': '炭化水素の種類と命名法',
        'es-ES': 'Tipos de hidrocarburos y nomenclatura',
        'fr-FR': 'Types de hydrocarbures et nomenclature',
        'ko-KR': '탄화수소의 종류 및 명명법'
      }
    },
    {
      id: 'kp_071',
      name: {
        'zh-CN': '有机官能团与反应',
        'en-US': 'Organic Functional Groups & Reactions',
        'ja-JP': '有機官能基と反応',
        'es-ES': 'Grupos Funcionales Orgánicos y Reacciones',
        'fr-FR': 'Groupes Fonctionnels Organiques et Réactions',
        'ko-KR': '유기 작용기 및 반응'
      },
      discipline: 'organic-structure',
      difficulty: 2,
      keywords: {
        'zh-CN': ['官能团', '羟基', '羧基', '氨基', '醛基', '酮基', '活性'],
        'en-US': ['functional group', 'hydroxyl', 'carboxyl', 'amino', 'aldehyde', 'ketone'],
        'ja-JP': ['官能基', '水酸基', 'カルボキシル', 'アミノ', 'アルデヒド'],
        'es-ES': ['grupo funcional', 'hidroxilo', 'carboxilo', 'amino', 'aldehído'],
        'fr-FR': ['groupe fonctionnel', 'hydroxyle', 'carboxyle', 'amino', 'aldéhyde'],
        'ko-KR': ['작용기', '수산기', '카르복시기', '아미노기', '알데히드']
      },
      description: {
        'zh-CN': '常见官能团的结构与性质、官能团的活性比较、典型反应',
        'en-US': 'Structure and properties of functional groups, reactivity comparison, typical reactions',
        'ja-JP': '官能基の構造と特性',
        'es-ES': 'Estructura y propiedades de grupos funcionales',
        'fr-FR': 'Structure et propriétés des groupes fonctionnels',
        'ko-KR': '작용기의 구조 및 특성'
      },
      prerequisites: ['kp_070']
    },
    {
      id: 'kp_072',
      name: {
        'zh-CN': '立体异体与手性',
        'en-US': 'Stereoisomerism & Chirality',
        'ja-JP': '立体異性体とキラリティー',
        'es-ES': 'Estereoisomería y Quiralidad',
        'fr-FR': 'Stéréoisomérie et Chiralité',
        'ko-KR': '입체 이성질체 및 키랄성'
      },
      discipline: 'organic-structure',
      difficulty: 3,
      keywords: {
        'zh-CN': ['立体异体', '手性中心', '光学异体', 'R/S', 'E/Z'],
        'en-US': ['stereoisomer', 'chiral center', 'enantiomer', 'R/S', 'E/Z'],
        'ja-JP': ['立体異性体', 'キラル中心', '光学異性体', 'R/S'],
        'es-ES': ['estereoisómero', 'centro quiral', 'enantiómero', 'R/S'],
        'fr-FR': ['stéréoisomère', 'centre chiral', 'énantomère', 'R/S'],
        'ko-KR': ['입체 이성질체', '키랄 중심', '광학 이성질체', 'R/S']
      },
      description: {
        'zh-CN': '手性中心的判断、光学异体的性质、构型标记法（R/S, E/Z）',
        'en-US': 'Identification of chiral centers, properties of enantiomers, configuration notation (R/S, E/Z)',
        'ja-JP': 'キラル中心の同定と光学異性体の特性',
        'es-ES': 'Identificación de centros quirales y propiedades de enantiómeros',
        'fr-FR': 'Identification des centres chiraux et propriétés des énantomères',
        'ko-KR': '키랄 중심의 동정 및 광학 이성질체의 특성'
      },
      prerequisites: ['kp_071']
    },

    // Organic Chemistry - Mechanism (机理)
    {
      id: 'kp_080',
      name: {
        'zh-CN': '取代反应的机理',
        'en-US': 'Mechanism of Substitution Reactions',
        'ja-JP': '置換反応の機構',
        'es-ES': 'Mecanismo de Reacciones de Sustitución',
        'fr-FR': 'Mécanisme des Réactions de Substitution',
        'ko-KR': '치환 반응의 메커니즘'
      },
      discipline: 'organic-mechanism',
      difficulty: 3,
      keywords: {
        'zh-CN': ['取代', 'SN1', 'SN2', '亲核', '碳鎓', '反演'],
        'en-US': ['substitution', 'SN1', 'SN2', 'nucleophilic', 'carbocation'],
        'ja-JP': ['置換', 'SN1', 'SN2', '求核', 'カルボカチオン'],
        'es-ES': ['sustitución', 'SN1', 'SN2', 'nucleófilo', 'carbocatión'],
        'fr-FR': ['substitution', 'SN1', 'SN2', 'nucléophile', 'carbocation'],
        'ko-KR': ['치환', 'SN1', 'SN2', '친핵성', '카르보늄']
      },
      description: {
        'zh-CN': 'SN1与SN2反应机理的区别、反应条件的影响、立体化学',
        'en-US': 'Differences between SN1 and SN2 mechanisms, effect of reaction conditions, stereochemistry',
        'ja-JP': 'SN1とSN2反応の機構の違いと立体化学',
        'es-ES': 'Diferencias entre mecanismos SN1 y SN2, estereoquímica',
        'fr-FR': 'Différences entre les mécanismes SN1 et SN2, stéréochimie',
        'ko-KR': 'SN1과 SN2 반응 메커니즘의 차이 및 입체화학'
      }
    },
    {
      id: 'kp_081',
      name: {
        'zh-CN': '消除反应机理',
        'en-US': 'Mechanism of Elimination Reactions',
        'ja-JP': '脱離反応の機構',
        'es-ES': 'Mecanismo de Reacciones de Eliminación',
        'fr-FR': 'Mécanisme des Réactions d\'Élimination',
        'ko-KR': '제거 반응의 메커니즘'
      },
      discipline: 'organic-mechanism',
      difficulty: 3,
      keywords: {
        'zh-CN': ['消除', 'E1', 'E2', '扎依采夫', 'Zaitsev', '同消'],
        'en-US': ['elimination', 'E1', 'E2', 'Zaitsev', 'Hofmann'],
        'ja-JP': ['脱離', 'E1', 'E2', 'ザイツェフ', 'ホフマン'],
        'es-ES': ['eliminación', 'E1', 'E2', 'Zaitsev'],
        'fr-FR': ['élimination', 'E1', 'E2', 'Zaïtsev'],
        'ko-KR': ['제거', 'E1', 'E2', 'Zaitsev']
      },
      description: {
        'zh-CN': 'E1与E2反应机理、扎依采夫规则、消除反应与取代反应的竞争',
        'en-US': 'E1 and E2 mechanisms, Zaitsev\'s rule, competition between elimination and substitution',
        'ja-JP': 'E1とE2の反応機構とザイツェフ則',
        'es-ES': 'Mecanismos E1 y E2, regla de Zaitsev',
        'fr-FR': 'Mécanismes E1 et E2, règle de Zaïtsev',
        'ko-KR': 'E1과 E2 반응 메커니즘 및 Zaitsev 법칙'
      },
      prerequisites: ['kp_080']
    },
    {
      id: 'kp_082',
      name: {
        'zh-CN': '加成反应与亲电加成',
        'en-US': 'Addition Reactions & Electrophilic Addition',
        'ja-JP': '付加反応と求電子付加',
        'es-ES': 'Reacciones de Adición y Adición Electrofílica',
        'fr-FR': 'Réactions d\'Addition et Addition Électrophile',
        'ko-KR': '첨가 반응 및 친전자 첨가'
      },
      discipline: 'organic-mechanism',
      difficulty: 3,
      keywords: {
        'zh-CN': ['加成', '亲电', '碳鎓', 'Markovnikov', '稳定性'],
        'en-US': ['addition', 'electrophilic', 'carbocation', 'Markovnikov'],
        'ja-JP': ['付加', '求電子', 'カルボカチオン', 'マルコフニコフ'],
        'es-ES': ['adición', 'electrofílica', 'carbocatión', 'Markovnikov'],
        'fr-FR': ['addition', 'électrophile', 'carbocation', 'Markovnikov'],
        'ko-KR': ['첨가', '친전자', '카르보늄', 'Markovnikov']
      },
      description: {
        'zh-CN': '烯烃的亲电加成、Markovnikov规则、加成的选择性',
        'en-US': 'Electrophilic addition to alkenes, Markovnikov\'s rule, selectivity in additions',
        'ja-JP': 'アルケンの求電子付加とマルコフニコフ則',
        'es-ES': 'Adición electrofílica a alquenos, regla de Markovnikov',
        'fr-FR': 'Addition électrophile aux alcènes, règle de Markovnikov',
        'ko-KR': '알켄의 친전자 첨가 및 Markovnikov 법칙'
      },
      prerequisites: ['kp_071']
    },

    // Organic Chemistry - Synthesis (合成)
    {
      id: 'kp_090',
      name: {
        'zh-CN': '逆合成分析',
        'en-US': 'Retrosynthetic Analysis',
        'ja-JP': '逆合成解析',
        'es-ES': 'Análisis Retrosintético',
        'fr-FR': 'Analyse Rétrosynthétique',
        'ko-KR': '역합성 분석'
      },
      discipline: 'organic-synthesis',
      difficulty: 4,
      keywords: {
        'zh-CN': ['逆合成', '断键', '官能团', '合成子', '合成路线'],
        'en-US': ['retrosynthetic', 'disconnection', 'synthon', 'synthetic route'],
        'ja-JP': ['逆合成', '切断', 'シントン', '合成経路'],
        'es-ES': ['retrosintético', 'desconexión', 'sintón', 'ruta sintética'],
        'fr-FR': ['rétrosynthétique', 'déconnexion', 'synthon', 'route synthétique'],
        'ko-KR': ['역합성', '연결 끊기', '신톤', '합성 경로']
      },
      description: {
        'zh-CN': '逆合成分析的原理、官能团的转化、多步合成路线的设计',
        'en-US': 'Principles of retrosynthetic analysis, functional group transformations, design of multi-step synthesis',
        'ja-JP': '逆合成解析の原理と合成経路の設計',
        'es-ES': 'Principios del análisis retrosintético y diseño de ruta sintética',
        'fr-FR': 'Principes de l\'analyse rétrosynthétique et conception de route synthétique',
        'ko-KR': '역합성 분석의 원리 및 합성 경로 설계'
      },
      prerequisites: ['kp_071', 'kp_080', 'kp_081']
    },
    {
      id: 'kp_091',
      name: {
        'zh-CN': '多步有机合成',
        'en-US': 'Multi-Step Organic Synthesis',
        'ja-JP': '多段階有機合成',
        'es-ES': 'Síntesis Orgánica Multietapa',
        'fr-FR': 'Synthèse Organique Multietape',
        'ko-KR': '다단계 유기 합성'
      },
      discipline: 'organic-synthesis',
      difficulty: 4,
      keywords: {
        'zh-CN': ['多步', '官能团转化', '选择性', '保护基', '收率'],
        'en-US': ['multi-step', 'selectivity', 'protecting group', 'yield'],
        'ja-JP': ['多段階', '選択性', '保護基', '収率'],
        'es-ES': ['multietapa', 'selectividad', 'grupo protector', 'rendimiento'],
        'fr-FR': ['multietape', 'sélectivité', 'groupe protecteur', 'rendement'],
        'ko-KR': ['다단계', '선택성', '보호기', '수율']
      },
      description: {
        'zh-CN': '多步合成中的官能团保护、选择性反应、合成效率的优化',
        'en-US': 'Protecting groups, selective transformations, optimization of synthetic efficiency in multi-step synthesis',
        'ja-JP': '多段階合成における官能基保護と選択性',
        'es-ES': 'Protección de grupos funcionales y selectividad en síntesis multietapa',
        'fr-FR': 'Protection des groupes fonctionnels et sélectivité en synthèse multietape',
        'ko-KR': '다단계 합성에서의 작용기 보호 및 선택성'
      },
      prerequisites: ['kp_090']
    },

    // Advanced Topics (高等)
    {
      id: 'kp_100',
      name: {
        'zh-CN': '分子轨道理论与周环反应',
        'en-US': 'Molecular Orbital Theory & Pericyclic Reactions',
        'ja-JP': '分子軌道理論と周環反応',
        'es-ES': 'Teoría de Orbitales Moleculares y Reacciones Pericíclicas',
        'fr-FR': 'Théorie des Orbitales Moléculaires et Réactions Péricycliques',
        'ko-KR': '분자 궤도 이론 및 주기 반응'
      },
      discipline: 'advanced-quantum',
      difficulty: 5,
      keywords: {
        'zh-CN': ['分子轨道', '对称性', 'Woodward-Hoffmann', '狄-爱尔斯反应', '环加成'],
        'en-US': ['molecular orbital', 'symmetry', 'Woodward-Hoffmann', 'Diels-Alder', 'cycloaddition'],
        'ja-JP': ['分子軌道', '対称性', 'Woodward-Hoffmann', 'ディールス-アルダー'],
        'es-ES': ['orbital molecular', 'simetría', 'Woodward-Hoffmann', 'Diels-Alder'],
        'fr-FR': ['orbitale moléculaire', 'symétrie', 'Woodward-Hoffmann', 'Diels-Alder'],
        'ko-KR': ['분자 궤도', '대칭성', 'Woodward-Hoffmann', 'Diels-Alder']
      },
      description: {
        'zh-CN': '分子轨道理论的基本概念、周环反应的立体选择性、Woodward-Hoffmann规则',
        'en-US': 'Basics of molecular orbital theory, stereoselectivity of pericyclic reactions, Woodward-Hoffmann rules',
        'ja-JP': '分子軌道理論と周環反応の立体選択性',
        'es-ES': 'Conceptos básicos de teoría de orbitales moleculares y estereoselectividad de reacciones',
        'fr-FR': 'Concepts de base de la théorie des orbitales moléculaires et stéréosélectivité des réactions',
        'ko-KR': '분자 궤도 이론의 기본 개념 및 주기 반응의 입체 선택성'
      }
    },
    {
      id: 'kp_101',
      name: {
        'zh-CN': '表面化学与吸附',
        'en-US': 'Surface Chemistry & Adsorption',
        'ja-JP': '表面化学と吸着',
        'es-ES': 'Química de Superficies y Adsorción',
        'fr-FR': 'Chimie de Surface et Adsorption',
        'ko-KR': '표면 화학 및 흡착'
      },
      discipline: 'advanced-surface',
      difficulty: 4,
      keywords: {
        'zh-CN': ['吸附', '表面张力', '表面活性剂', 'Langmuir', 'BET', '催化'],
        'en-US': ['adsorption', 'surface tension', 'surfactant', 'Langmuir', 'BET'],
        'ja-JP': ['吸着', '表面張力', '界面活性剤', 'Langmuir', 'BET'],
        'es-ES': ['adsorción', 'tensión superficial', 'surfactante', 'Langmuir', 'BET'],
        'fr-FR': ['adsorption', 'tension superficielle', 'surfactant', 'Langmuir', 'BET'],
        'ko-KR': ['흡착', '표면 장력', '계면활성제', 'Langmuir', 'BET']
      },
      description: {
        'zh-CN': '物理吸附和化学吸附、Langmuir等温线、表面活性剂的作用',
        'en-US': 'Physical and chemical adsorption, Langmuir isotherm, role of surfactants',
        'ja-JP': '物理吸着と化学吸着、Langmuir等温線',
        'es-ES': 'Adsorción física y química, isoterma de Langmuir',
        'fr-FR': 'Adsorption physique et chimique, isotherme de Langmuir',
        'ko-KR': '물리적 및 화학적 흡착, Langmuir 등온선'
      }
    },
    {
      id: 'kp_102',
      name: {
        'zh-CN': '胶体化学',
        'en-US': 'Colloid Chemistry',
        'ja-JP': 'コロイド化学',
        'es-ES': 'Química de Coloides',
        'fr-FR': 'Chimie des Colloïdes',
        'ko-KR': '콜로이드 화학'
      },
      discipline: 'advanced-colloid',
      difficulty: 4,
      keywords: {
        'zh-CN': ['胶体', '分散系统', '电泳', 'Zeta电位', '稳定性', '聚沉'],
        'en-US': ['colloid', 'dispersed system', 'electrophoresis', 'zeta potential'],
        'ja-JP': ['コロイド', '分散系', '電気泳動', 'ゼータ電位'],
        'es-ES': ['coloide', 'sistema disperso', 'electroforesis', 'potencial zeta'],
        'fr-FR': ['colloïde', 'système dispersé', 'électrophorèse', 'potentiel zeta'],
        'ko-KR': ['콜로이드', '분산 체계', '전기영동', 'Zeta 전위']
      },
      description: {
        'zh-CN': '胶体的定义和性质、胶体粒子的稳定性、电泳现象',
        'en-US': 'Definition and properties of colloids, stability of colloid particles, electrophoresis',
        'ja-JP': 'コロイドの定義と特性、胶体粒子の安定性',
        'es-ES': 'Definición y propiedades de los coloides, estabilidad de partículas coloidales',
        'fr-FR': 'Définition et propriétés des colloïdes, stabilité des particules colloïdales',
        'ko-KR': '콜로이드의 정의 및 특성, 콜로이드 입자의 안정성'
      }
    },

    // Experimental Basic (实验基础)
    {
      id: 'kp_110',
      name: {
        'zh-CN': '基本实验操作',
        'en-US': 'Basic Experimental Operations',
        'ja-JP': '基本実験操作',
        'es-ES': 'Operaciones Experimentales Básicas',
        'fr-FR': 'Opérations Expérimentales de Base',
        'ko-KR': '기본 실험 작동'
      },
      discipline: 'experiment-basic',
      difficulty: 1,
      keywords: {
        'zh-CN': ['称量', '量取', '溶解', '稀释', '过滤', '洗涤'],
        'en-US': ['weighing', 'measuring', 'dissolution', 'dilution', 'filtration'],
        'ja-JP': ['秤量', '計量', '溶解', '希釈', 'ろ過'],
        'es-ES': ['pesaje', 'medición', 'disolución', 'dilución', 'filtración'],
        'fr-FR': ['pesée', 'mesure', 'dissolution', 'dilution', 'filtration'],
        'ko-KR': ['칭량', '측정', '용해', '희석', '여과']
      },
      description: {
        'zh-CN': '化学实验中的基本操作、仪器的使用、安全注意事项',
        'en-US': 'Basic operations in chemical experiments, instrument usage, safety considerations',
        'ja-JP': '化学実験の基本操作と器具の使用',
        'es-ES': 'Operaciones básicas en experimentos químicos y uso de instrumentos',
        'fr-FR': 'Opérations de base dans les expériences chimiques et utilisation des instruments',
        'ko-KR': '화학 실험의 기본 작동 및 기구 사용'
      }
    },
    {
      id: 'kp_111',
      name: {
        'zh-CN': '定量分析基础',
        'en-US': 'Fundamentals of Quantitative Analysis',
        'ja-JP': '定量分析の基礎',
        'es-ES': 'Fundamentos del Análisis Cuantitativo',
        'fr-FR': 'Fondamentaux de l\'Analyse Quantitative',
        'ko-KR': '정량 분석의 기초'
      },
      discipline: 'experiment-basic',
      difficulty: 2,
      keywords: {
        'zh-CN': ['精确度', '准确度', '误差', '有效数字', '数据处理'],
        'en-US': ['precision', 'accuracy', 'error', 'significant figures', 'data processing'],
        'ja-JP': ['精密度', '正確性', '誤差', '有効数字', 'データ処理'],
        'es-ES': ['precisión', 'exactitud', 'error', 'cifras significativas'],
        'fr-FR': ['précision', 'exactitude', 'erreur', 'chiffres significatifs'],
        'ko-KR': ['정밀도', '정확도', '오차', '유효 숫자']
      },
      description: {
        'zh-CN': '实验误差的来源和分类、有效数字的规则、数据的处理方法',
        'en-US': 'Sources of experimental error, significant figure rules, data processing methods',
        'ja-JP': '実験誤差の原因と分類、有効数字の規則',
        'es-ES': 'Fuentes de error experimental, reglas de cifras significativas',
        'fr-FR': 'Sources d\'erreur expérimentale, règles des chiffres significatifs',
        'ko-KR': '실험 오차의 원인 및 분류, 유효 숫자 규칙'
      },
      prerequisites: ['kp_110']
    }
  ],
  categories: [
    {
      id: 'cat_001',
      name: {
        'zh-CN': '物理化学-热力学',
        'en-US': 'Physical Chemistry - Thermodynamics',
        'ja-JP': '物理化学-熱力学',
        'es-ES': 'Química Física - Termodinámica',
        'fr-FR': 'Chimie Physique - Thermodynamique',
        'ko-KR': '물리 화학 - 열역학'
      },
      knowledgePointIds: ['kp_001', 'kp_002', 'kp_003', 'kp_004', 'kp_005', 'kp_006', 'kp_007', 'kp_008']
    },
    {
      id: 'cat_002',
      name: {
        'zh-CN': '物理化学-动力学',
        'en-US': 'Physical Chemistry - Kinetics',
        'ja-JP': '物理化学-動力学',
        'es-ES': 'Química Física - Cinética',
        'fr-FR': 'Chimie Physique - Cinétique',
        'ko-KR': '물리 화학 - 동역학'
      },
      knowledgePointIds: ['kp_010', 'kp_011', 'kp_012', 'kp_013', 'kp_014']
    },
    {
      id: 'cat_003',
      name: {
        'zh-CN': '物理化学-电化学',
        'en-US': 'Physical Chemistry - Electrochemistry',
        'ja-JP': '物理化学-電気化学',
        'es-ES': 'Química Física - Electroquímica',
        'fr-FR': 'Chimie Physique - Électrochimie',
        'ko-KR': '물리 화학 - 전기화학'
      },
      knowledgePointIds: ['kp_020', 'kp_021', 'kp_022', 'kp_023']
    },
    {
      id: 'cat_004',
      name: {
        'zh-CN': '无机化学-基础',
        'en-US': 'Inorganic Chemistry - Basics',
        'ja-JP': '無機化学-基礎',
        'es-ES': 'Química Inorgánica - Conceptos Básicos',
        'fr-FR': 'Chimie Inorganique - Principes Fondamentaux',
        'ko-KR': '무기 화학 - 기초'
      },
      knowledgePointIds: ['kp_030', 'kp_031', 'kp_032', 'kp_033']
    },
    {
      id: 'cat_005',
      name: {
        'zh-CN': '无机化学-结构',
        'en-US': 'Inorganic Chemistry - Structure',
        'ja-JP': '無機化学-構造',
        'es-ES': 'Química Inorgánica - Estructura',
        'fr-FR': 'Chimie Inorganique - Structure',
        'ko-KR': '무기 화학 - 구조'
      },
      knowledgePointIds: ['kp_040', 'kp_041', 'kp_042']
    },
    {
      id: 'cat_006',
      name: {
        'zh-CN': '分析化学-滴定',
        'en-US': 'Analytical Chemistry - Titration',
        'ja-JP': '分析化学-滴定',
        'es-ES': 'Química Analítica - Titulación',
        'fr-FR': 'Chimie Analytique - Titrage',
        'ko-KR': '분석 화학 - 적정'
      },
      knowledgePointIds: ['kp_050', 'kp_051', 'kp_052']
    },
    {
      id: 'cat_007',
      name: {
        'zh-CN': '分析化学-仪器',
        'en-US': 'Analytical Chemistry - Instrumental',
        'ja-JP': '分析化学-機器分析',
        'es-ES': 'Química Analítica - Análisis Instrumental',
        'fr-FR': 'Chimie Analytique - Analyse Instrumentale',
        'ko-KR': '분석 화학 - 기기 분석'
      },
      knowledgePointIds: ['kp_060', 'kp_061', 'kp_062']
    },
    {
      id: 'cat_008',
      name: {
        'zh-CN': '有机化学-结构',
        'en-US': 'Organic Chemistry - Structure',
        'ja-JP': '有機化学-構造',
        'es-ES': 'Química Orgánica - Estructura',
        'fr-FR': 'Chimie Organique - Structure',
        'ko-KR': '유기 화학 - 구조'
      },
      knowledgePointIds: ['kp_070', 'kp_071', 'kp_072']
    },
    {
      id: 'cat_009',
      name: {
        'zh-CN': '有机化学-机理',
        'en-US': 'Organic Chemistry - Mechanism',
        'ja-JP': '有機化学-機構',
        'es-ES': 'Química Orgánica - Mecanismo',
        'fr-FR': 'Chimie Organique - Mécanisme',
        'ko-KR': '유기 화학 - 메커니즘'
      },
      knowledgePointIds: ['kp_080', 'kp_081', 'kp_082']
    },
    {
      id: 'cat_010',
      name: {
        'zh-CN': '有机化学-合成',
        'en-US': 'Organic Chemistry - Synthesis',
        'ja-JP': '有機化学-合成',
        'es-ES': 'Química Orgánica - Síntesis',
        'fr-FR': 'Chimie Organique - Synthèse',
        'ko-KR': '유기 화학 - 합성'
      },
      knowledgePointIds: ['kp_090', 'kp_091']
    },
    {
      id: 'cat_011',
      name: {
        'zh-CN': '高等化学',
        'en-US': 'Advanced Chemistry',
        'ja-JP': '高等化学',
        'es-ES': 'Química Avanzada',
        'fr-FR': 'Chimie Avancée',
        'ko-KR': '고등 화학'
      },
      knowledgePointIds: ['kp_100', 'kp_101', 'kp_102']
    },
    {
      id: 'cat_012',
      name: {
        'zh-CN': '实验基础',
        'en-US': 'Experimental Basics',
        'ja-JP': '実験基礎',
        'es-ES': 'Conceptos Básicos Experimentales',
        'fr-FR': 'Principes Fondamentaux Expérimentaux',
        'ko-KR': '실험 기초'
      },
      knowledgePointIds: ['kp_110', 'kp_111']
    }
  ]
};

/**
 * Get knowledge point by ID
 */
export function getKnowledgePointById(catalog: KnowledgePointCatalog, id: string): KnowledgePoint | undefined {
  return catalog.knowledgePoints.find(kp => kp.id === id);
}

/**
 * Filter knowledge points by difficulty level
 */
export function filterByDifficulty(
  catalog: KnowledgePointCatalog,
  minDifficulty?: DifficultyLevel,
  maxDifficulty?: DifficultyLevel
): KnowledgePoint[] {
  return catalog.knowledgePoints.filter(kp => {
    const meetsMin = minDifficulty === undefined || kp.difficulty >= minDifficulty;
    const meetsMax = maxDifficulty === undefined || kp.difficulty <= maxDifficulty;
    return meetsMin && meetsMax;
  });
}

/**
 * Filter knowledge points by discipline
 */
export function filterByDiscipline(
  catalog: KnowledgePointCatalog,
  discipline: DisciplineKey
): KnowledgePoint[] {
  return catalog.knowledgePoints.filter(kp => kp.discipline === discipline);
}

/**
 * Get all knowledge points in a category
 */
export function getKnowledgePointsInCategory(
  catalog: KnowledgePointCatalog,
  categoryId: string
): KnowledgePoint[] {
  const category = catalog.categories.find(c => c.id === categoryId);
  if (!category) return [];
  return category.knowledgePointIds
    .map(id => getKnowledgePointById(catalog, id))
    .filter((kp): kp is KnowledgePoint => kp !== undefined);
}
