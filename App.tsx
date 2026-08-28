import React, { useState, useEffect, useRef } from 'react';
import {
  Beaker,
  Play,
  Settings,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Download,
  Terminal,
  Shield,
  RotateCcw,
  Globe,
  Layers,
  Cog,
  Sigma,
  Atom,
  Leaf,
  TrendingUp
} from 'lucide-react';
import { MultiNodeStage, FinalProblem, type MathPerturbationType, type Subject, type MaterialsQuestionType, type MechanicalQuestionType } from './types/multiNodeTypes';
import { runMultiNodeWorkflow, type BatchModeConfig } from './services/orchestrator';
import { runV2Workflow } from './services/orchestrator-v2';
import { runBiologyMultiNodeWorkflow } from './services/orchestrator-biology';
import { runBiologyV2Workflow } from './services/orchestrator-biology-v2';
import { saveProblemToSheets, saveMathProblemToSheets, saveMaterialsProblemToSheets, validateScriptUrl } from './services/googleSheetsService';
import { saveFinanceProblemToSheets } from './services/subjects/finance/sheetsClient';
import { SUBJECT_CONFIGS } from './services/subjects/index';
import { type LLMProvider, setLLMProvider, getCurrentProvider, ONEAPI_MODELS, setOneApiModel, getOneApiModel, setOneApiReviewModel, getOneApiReviewModel, setOneApiBlindModel, getOneApiBlindModel } from './services/llmClient';
import pLimit from 'p-limit';

// Limit concurrent Sheets saves to 2 to avoid overwhelming Google Apps Script
const sheetsSaveLimit = pLimit(2);
import { getI18nManager } from './services/i18n';
import { defaultCatalog, getKnowledgePointsInCategory } from './services/data/knowledgePointsCatalog';
import { SUPPORTED_LANGUAGES, type Language } from './services/i18n/languages';
import {
  DEFAULT_MATH_PERTURBATION_TYPE,
  MATH_DIFFICULTY_OPTIONS,
  MATH_PERTURBATION_OPTIONS,
  getMathDisciplineOptions
} from './mathGenerationOptions';
import { getMaterialsDisciplineOptions, getCommonQuestionTypes, getUnsupportedNamesForType, getRecommendedNamesForType, getDiscouragedNamesForType } from './materialsGenerationOptions';
import { checkCombination, getAllMaterialsDisciplineNames, getCompatLevel } from './materialsCompatibility';
import {
  getMechanicalDisciplineOptions,
  getCommonQuestionTypes as getMechanicalCommonQuestionTypes,
  getUnsupportedNamesForType as getMechanicalUnsupportedNames,
  getRecommendedNamesForType as getMechanicalRecommendedNames,
  getDiscouragedNamesForType as getMechanicalDiscouragedNames,
} from './mechanicalGenerationOptions';
import {
  getProblemBadgeVisibility,
  getStageDisplay as getUiStageDisplay,
} from './mathV2UiDisplay';
import {
  DEFAULT_FINANCE_DISCIPLINE_KEY,
  DEFAULT_FINANCE_TOPIC,
  FINANCE_TOPIC_GROUPS,
  findFinanceDisciplineByTopic,
  getFinanceTopics,
  type FinanceDisciplineKey,
} from './services/subjects/finance/topicCatalog';

type GenerationMode = 'single' | 'batch';
const mathDisciplineOptions = getMathDisciplineOptions();
const defaultMathTopic = mathDisciplineOptions[0]?.value || SUBJECT_CONFIGS.math.defaultTopic;
const materialsDisciplineOptions = getMaterialsDisciplineOptions();
const defaultMaterialsTopic = materialsDisciplineOptions[0]?.value || SUBJECT_CONFIGS.materials.defaultTopic;
const mechanicalDisciplineOptions = getMechanicalDisciplineOptions();
const defaultMechanicalTopic = mechanicalDisciplineOptions[0]?.value || SUBJECT_CONFIGS.mechanical.defaultTopic;

function clampTrapCountForSubject(subject: Subject, value: number): number {
  if (subject === 'math') {
    return Math.min(Math.max(value, 1), 4);
  }
  if (subject === 'finance') {
    // 金融题的陷阱以"口径/测度/惯例"判定为主，超过 3 个会互相遮蔽，答案唯一性难保证
    return Math.min(Math.max(value, 0), 3);
  }
  return Math.min(Math.max(value, 0), 5);
}

function getV2PipelineToggleLabel(subject: Subject, enabled: boolean): string {
  if (subject === 'math') {
    return enabled
      ? '✦ 数学 V2 链路（分析→生题→审查→盲解→对比）'
      : '○ 使用数学 V2 链路';
  }

  if (subject === 'physics') {
    return enabled
      ? '✦ 物理 V2 链路（分析→生题→审查→盲解→对比）'
      : '○ 使用物理 V2 链路';
  }

  if (subject === 'finance') {
    return enabled
      ? '✦ 金融 V2 链路（分析→生题→审查→盲解→对比）'
      : '○ 使用金融 V2 链路';
  }

  if (subject === 'materials') {
    return enabled
      ? '✦ 材料 V2 链路（分析→生题→物理自洽拦截+审查→盲解→对比）'
      : '○ 使用材料 V2 链路';
  }

  if (subject === 'mechanical') {
    return enabled
      ? '✦ 机械 V2 链路（分析→生题→标准系列/圆整回代/算术复算拦截+审查→盲解→对比）'
      : '○ 使用机械 V2 链路';
  }

  return enabled
    ? '✦ V2 新流程（分析→生题→审查→盲解→对比）'
    : '○ 使用 V2 新流程';
}

function parseSingleModeTopics(raw: string): string[] {
  const topics: string[] = [];
  let current = '';
  let depth = 0;
  let inDollarMath = false;
  let inParenMath = false;
  let inBracketMath = false;

  const flush = () => {
    const topic = current.trim();
    if (topic) topics.push(topic);
    current = '';
  };

  const isEscaped = (index: number) => index > 0 && raw[index - 1] === '\\';

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    const nextTwo = raw.slice(i, i + 2);
    const nextThree = raw.slice(i, i + 3);
    const inMath = inDollarMath || inParenMath || inBracketMath;

    if (!isEscaped(i) && char === '$') {
      inDollarMath = !inDollarMath;
      current += char;
      continue;
    }
    if (!inDollarMath && nextTwo === '\\(') {
      inParenMath = true;
      current += nextTwo;
      i += 1;
      continue;
    }
    if (inParenMath && nextTwo === '\\)') {
      inParenMath = false;
      current += nextTwo;
      i += 1;
      continue;
    }
    if (!inDollarMath && nextTwo === '\\[') {
      inBracketMath = true;
      current += nextTwo;
      i += 1;
      continue;
    }
    if (inBracketMath && nextTwo === '\\]') {
      inBracketMath = false;
      current += nextTwo;
      i += 1;
      continue;
    }

    if (!inMath && '([{（【'.includes(char)) {
      depth += 1;
      current += char;
      continue;
    }
    if (!inMath && ')] }）】'.replace(/ /g, '').includes(char)) {
      depth = Math.max(0, depth - 1);
      current += char;
      continue;
    }
    if (!inMath && depth === 0 && /[\n,，;；]/.test(char)) {
      flush();
      continue;
    }
    if (!inMath && depth === 0 && (nextThree === ' + ' || nextThree === ' ＋ ')) {
      flush();
      i += 2;
      continue;
    }

    current += char;
  }
  flush();

  return Array.from(new Set(topics));
}

export default function App() {
  const [subject, setSubject] = useState<Subject>('chemistry');
  const [language, setLanguage] = useState<Language>('zh-CN');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('single');
  const [llmProvider, setLlmProvider] = useState<LLMProvider>(getCurrentProvider());
  const [oneApiModel, setOneApiModelState] = useState<string>(getOneApiModel());
  const [oneApiReviewModel, setOneApiReviewModelState] = useState<string>(getOneApiReviewModel());
  const [oneApiBlindModel, setOneApiBlindModelState] = useState<string>(getOneApiBlindModel());

  const handleProviderChange = (provider: LLMProvider) => {
    setLLMProvider(provider);
    setLlmProvider(provider);
  };

  const handleOneApiModelChange = (modelId: string) => {
    setOneApiModel(modelId);
    setOneApiModelState(modelId);
    // setOneApiModel 会同时切换底层质检/盲解模型；这里同步 React 状态，避免 UI 与运行参数不一致
    setOneApiReviewModelState(modelId);
    setOneApiBlindModelState(modelId);
    setLLMProvider('oneapi');
    setLlmProvider('oneapi');
  };

  const handleOneApiReviewModelChange = (modelId: string) => {
    setOneApiReviewModel(modelId);
    setOneApiReviewModelState(modelId);
  };

  const handleOneApiBlindModelChange = (modelId: string) => {
    setOneApiBlindModel(modelId);
    setOneApiBlindModelState(modelId);
  };

  const subjectConfig = SUBJECT_CONFIGS[subject];

  const handleSubjectChange = (nextSubject: Subject) => {
    setSubject(nextSubject);
    setTrapCount(prev => clampTrapCountForSubject(nextSubject, prev));
  };

  // Single mode
  const [topic, setTopic] = useState(SUBJECT_CONFIGS['chemistry'].defaultTopic);
  const [trapCount, setTrapCount] = useState(subject === 'math' ? 4 : 2);
  const [count, setCount] = useState(subject === 'math' ? 6 : 3);
  const [mathPerturbationType, setMathPerturbationType] = useState<MathPerturbationType>(DEFAULT_MATH_PERTURBATION_TYPE);
  // Biology multi-KP input
  const [biologyTopics, setBiologyTopics] = useState<string[]>([]);
  const [biologyTopicDraft, setBiologyTopicDraft] = useState('');
  // Finance: 分支 + 知识点两级下拉，避免手填导致 identifyDiscipline 误路由
  const [financeDiscipline, setFinanceDiscipline] = useState<FinanceDisciplineKey>(DEFAULT_FINANCE_DISCIPLINE_KEY);
  // Materials multi-select
  const [selectedMaterialsDirs, setSelectedMaterialsDirs] = useState<string[]>([materialsDisciplineOptions[0]?.value || '']);
  const [customMaterialsDirs, setCustomMaterialsDirs] = useState<string[]>([]);
  const [customMaterialsDraft, setCustomMaterialsDraft] = useState('');
  const [materialsDropdownOpen, setMaterialsDropdownOpen] = useState(false);
  const materialsDropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭材料知识点下拉
  useEffect(() => {
    if (!materialsDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (materialsDropdownRef.current && !materialsDropdownRef.current.contains(e.target as Node)) {
        setMaterialsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [materialsDropdownOpen]);

  // Mechanical single-select：机械的深度来自"一条力流链贯穿到底"，多方向勾选只会拼成
  // 互不相干的拼盘（disciplines.ts 的跨方向要求明确禁止）。跨方向题改为在选项表里
  // 预置成品条目（如"齿轮+轴承"）,而不是让用户自由勾选组合。
  const [selectedMechanicalDir, setSelectedMechanicalDir] = useState<string>(mechanicalDisciplineOptions[0]?.value || '');
  const [mechanicalDirIsCustom, setMechanicalDirIsCustom] = useState(false);
  const [customMechanicalDraft, setCustomMechanicalDraft] = useState('');
  const [mechanicalDropdownOpen, setMechanicalDropdownOpen] = useState(false);
  const mechanicalDropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭机械知识点下拉
  useEffect(() => {
    if (!mechanicalDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (mechanicalDropdownRef.current && !mechanicalDropdownRef.current.contains(e.target as Node)) {
        setMechanicalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mechanicalDropdownOpen]);

  // Batch mode
  const [selectedCategory, setSelectedCategory] = useState(defaultCatalog.categories[0]?.id || '');
  const [selectedKPs, setSelectedKPs] = useState<Set<string>>(new Set());
  const [batchTrapCount, setBatchTrapCount] = useState(2);
  const [batchProblemsPerKP, setBatchProblemsPerKP] = useState(1);
  const [concurrencyLimit, setConcurrencyLimit] = useState(20);  // 🆕 默认 20 并发

  // Common
  const [stage, setStage] = useState<MultiNodeStage>(MultiNodeStage.IDLE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [problems, setProblems] = useState<FinalProblem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sheetsUrl, setSheetsUrl] = useState(() => localStorage.getItem('sheetsUrl') ?? '');
  const [savedCount, setSavedCount] = useState(0);
  const [saveErrors, setSaveErrors] = useState(0);

  const saveGeneratedProblemToSheets = async (problem: FinalProblem, idx: number) => {
    if (!sheetsUrl || !sheetsUrl.trim()) return;
    await sheetsSaveLimit(async () => {
      try {
        const result = problem.subject === 'math'
          ? await saveMathProblemToSheets(problem, sheetsUrl.trim())
          : problem.subject === 'finance'
            ? await saveFinanceProblemToSheets(problem, sheetsUrl.trim())
          : problem.subject === 'materials'
            ? await saveMaterialsProblemToSheets(problem, sheetsUrl.trim())
            : await saveProblemToSheets(problem, sheetsUrl.trim());
        if (result.success) {
          setSavedCount(prev => prev + 1);
        } else {
          setSaveErrors(prev => prev + 1);
          console.error(`Failed to save problem ${idx + 1}:`, result.error);
        }
      } catch (e) {
        setSaveErrors(prev => prev + 1);
        console.error(`Failed to save problem ${idx + 1}:`, e);
      }
    });
  };

  const [useAntiInterference, setUseAntiInterference] = useState(true);
  const [singleQuestion, setSingleQuestion] = useState(false);
  const [numericAnswerOnly, setNumericAnswerOnly] = useState(false);
  const [useNewPipeline, setUseNewPipeline] = useState(false); // V2 pipeline toggle
  const [cascadeEnabled, setCascadeEnabled] = useState(false); // 级联陷阱开关
  // 材料学专属：题型（计算题 / 简答题），仅材料 V2 生效
  const [materialsQuestionType, setMaterialsQuestionType] = useState<MaterialsQuestionType>('calculation');
  // 机械专属：题型（设计/校核计算题 / 论述题 / 混合题），仅机械 V2 生效
  const [mechanicalQuestionType, setMechanicalQuestionType] = useState<MechanicalQuestionType>('calculation');

  // Reset topic when subject changes
  useEffect(() => {
    setTopic(
      subject === 'math' ? defaultMathTopic
        : subject === 'finance' ? DEFAULT_FINANCE_TOPIC
        : subject === 'materials' ? defaultMaterialsTopic
        : subject === 'mechanical' ? defaultMechanicalTopic
        : SUBJECT_CONFIGS[subject].defaultTopic
    );
    setBiologyTopics([]);
    setBiologyTopicDraft('');
    setFinanceDiscipline(DEFAULT_FINANCE_DISCIPLINE_KEY);
    setGenerationMode('single'); // math doesn't support batch
    setUseNewPipeline(subject === 'biology' || subject === 'materials' || subject === 'mechanical'); // biology/materials/mechanical 默认使用 V2


    // 数学学科：默认切换到 OneAPI，但保留用户已选择的模型
    if (subject === 'math') {
      // 仅确保 provider 为 oneapi，不强制覆盖模型选择
      if (llmProvider !== 'oneapi') {
        setLLMProvider('oneapi');
        setLlmProvider('oneapi');
      }
      setTrapCount(4);
      setCount(6);
    } else if (subject === 'biology') {
      // Biology UI only exposes OneAPI models — ensure provider matches
      setLLMProvider('oneapi');
      setLlmProvider('oneapi');
    } else if (subject === 'mechanical') {
      // 机械走 OneAPI 网关（DeepSeek 直连的 key 未配置，选 DeepSeek 会 401 且主面板空白）
      setLLMProvider('oneapi');
      setLlmProvider('oneapi');
      setTrapCount(2);
      setCount(3);
    } else {
      // 化学/物理：恢复默认值
      setTrapCount(2);
      setCount(3);
    }
  }, [subject]);

  // Initialize i18n
  useEffect(() => {
    const initI18n = async () => {
      const i18n = getI18nManager();
      await i18n.initialize(language);
    };
    initI18n();
  }, [language]);

  const runWorkflow = async () => {
    const logProblemTrace = (source: string, problem: FinalProblem, idx: number) => {
      const traceId = (problem.metadata as any)?.traceId || 'N/A';
      const text = (problem.trapModifiedText || '').replace(/\s+/g, ' ').slice(0, 80);
      console.log(`[UI ProblemReceive] source=${source} idx=${idx} traceId=${traceId} textHead="${text}"`);
    };
    setStage(MultiNodeStage.NODE_0_INPUT);
    setError(null);
    setProblems([]);
    setCurrentIndex(0);
    setSavedCount(0);
    setSaveErrors(0);

    try {
      if (generationMode === 'batch') {
        // Batch mode: pass config to orchestrator
        const batchConfig = {
          mode: 'batch' as const,
          knowledgePointIds: Array.from(selectedKPs) as string[],
          concurrencyLimit: concurrencyLimit  // 🆕 传递并发配置
        };

        const orchestrate = useNewPipeline ? runV2Workflow : runMultiNodeWorkflow;
        const results = await orchestrate(
          {
            topic: '', // Not used in batch mode
            trapCount: batchTrapCount,
            problemCount: batchProblemsPerKP,
            language,
            useAntiInterference,
            singleQuestion,
            numericAnswerOnly,
            allowTableLookup: true,
            subject,
            ...(subject === 'materials' ? { materialsQuestionType } : {}),
            ...(subject === 'mechanical' ? { mechanicalQuestionType } : {})
          },
          {
            onStageChange: (newStage, idx) => {
              setStage(newStage);
              setCurrentIndex(idx);
            },
            onProgress: (current, total) => {
              console.log(`Progress: ${current}/${total}`);
            },
            onError: (err) => {
              setError(err);
              setStage(MultiNodeStage.ERROR);
            },
            onProblemGenerated: async (problem, idx) => {
              logProblemTrace('callback', problem, idx);
              setTimeout(() => {
                setProblems(prev => [...prev, problem]);
              }, 0);

              void saveGeneratedProblemToSheets(problem, idx);
            }
          },
          batchConfig,
          subject === 'biology'
            ? {
                blindSolverModel: getOneApiModel(),
                cascadeEnabled,
              }
            : undefined
        );

        setStage(MultiNodeStage.COMPLETED);
      } else {
        // Single mode
        if (subject === 'biology') {
          const biologyOrchestrate = useNewPipeline ? runBiologyV2Workflow : runBiologyMultiNodeWorkflow;
          const biologyTopic = biologyTopics.length > 0 ? biologyTopics.join(' + ') : topic;
          await biologyOrchestrate(
            {
              topic: biologyTopic,
              trapCount,
              problemCount: count,
              language,
              useAntiInterference,
              singleQuestion,
              allowTableLookup: true,
              subject
            },
            {
              onStageChange: (newStage, idx) => {
                setStage(newStage);
                setCurrentIndex(idx);
              },
              onProgress: (current, total) => {
                console.log(`Progress: ${current}/${total}`);
              },
              onError: (err) => {
                setError(err);
                setStage(MultiNodeStage.ERROR);
              },
              onProblemGenerated: async (problem, idx) => {
                logProblemTrace('biology-single', problem, idx);
                setTimeout(() => {
                  setProblems((prev: FinalProblem[]) => [...prev, problem]);
                }, 0);

                void saveGeneratedProblemToSheets(problem, idx);
              }
            },
            useNewPipeline
              ? {
                  blindSolverModel: getOneApiModel(),
                  cascadeEnabled,
                }
              : undefined
          );
        } else {
          const orchestrate = useNewPipeline ? runV2Workflow : runMultiNodeWorkflow;
          let topics: string[];
          if (subject === 'materials') {
            const allDirs = [...selectedMaterialsDirs, ...customMaterialsDirs];
            if (allDirs.length === 0) {
              throw new Error('请至少选择一个方向或输入一个自定义知识点');
            }
            // 兼容性校验仅针对预设方向(自定义方向无兼容信息,不参与判断)
            const combo = checkCombination(selectedMaterialsDirs);
            if (!combo.canFuse) {
              throw new Error(`所选方向存在不适合融合的组合:${combo.weakPairs.map(p => `「${p[0]}」+「${p[1]}」`).join('、')},请调整选择`);
            }
            // 多选(含自定义)且可融合 → 合成一个跨领域主题;单个则原样
            topics = allDirs.length > 1
              ? [`跨领域融合题:${allDirs.join(' × ')}`]
              : allDirs;
          } else if (subject === 'mechanical') {
            // 机械单选：一次只出一个方向。跨方向题由选项表里的预置成品条目承担
            if (!selectedMechanicalDir.trim()) {
              throw new Error('请选择一个方向或输入一个自定义知识点');
            }
            topics = [selectedMechanicalDir.trim()];
          } else {
            topics = parseSingleModeTopics(topic);
          }
          if (topics.length === 0) {
            throw new Error('请输入至少一个知识点');
          }

          const failedTopics: string[] = [];
          const topicLimit = pLimit(10);
          await Promise.all(topics.map((topicName) => topicLimit(async () => {
            try {
              await orchestrate(
                {
                  topic: topicName,
                  trapCount,
                  problemCount: count,
                  language,
                  useAntiInterference,
                  singleQuestion,
                  numericAnswerOnly,
                  allowTableLookup: true,
                  subject,
                  ...(subject === 'math' ? { perturbationType: mathPerturbationType } : {}),
                  ...(subject === 'materials' ? { materialsQuestionType } : {}),
                  ...(subject === 'mechanical' ? { mechanicalQuestionType } : {})
                },
                {
                  onStageChange: (newStage, idx) => {
                    setStage(newStage);
                    setCurrentIndex(idx);
                  },
                  onProgress: (current, total) => {
                    console.log(`[${topicName}] Progress: ${current}/${total}`);
                  },
                  onError: (err) => {
                    setError(err);
                    setStage(MultiNodeStage.ERROR);
                  },
                  onProblemGenerated: async (problem, idx) => {
                    logProblemTrace(`single:${topicName}`, problem, idx);
                    setTimeout(() => {
                      setProblems((prev: FinalProblem[]) => [...prev, problem]);
                    }, 0);

                    void saveGeneratedProblemToSheets(problem, idx);
                  }
                }
              );
            } catch (topicError: any) {
              const message = topicError?.message || String(topicError);
              failedTopics.push(`${topicName}: ${message}`);
              console.error(`[SingleMode] ${topicName} failed:`, topicError);
            }
          })));

          if (failedTopics.length === topics.length) {
            throw new Error(`全部知识点生成失败：${failedTopics.join('；')}`);
          }
          if (failedTopics.length > 0) {
            setError(`部分知识点生成失败：${failedTopics.join('；')}`);
          }
        }
        setStage(MultiNodeStage.COMPLETED);
      }
    } catch (err: any) {
      setError(err.message || '生成失败');
      setStage(MultiNodeStage.ERROR);
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(problems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chemical_problems_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const getStageDisplay = (stage: MultiNodeStage): string => {
    return getUiStageDisplay(stage, { subject, useNewPipeline });
  };

  const isRunning = stage !== MultiNodeStage.IDLE && stage !== MultiNodeStage.COMPLETED && stage !== MultiNodeStage.ERROR;
  const allMaterialsDirs = [...selectedMaterialsDirs, ...customMaterialsDirs];
  const allMechanicalDirs = selectedMechanicalDir.trim() ? [selectedMechanicalDir.trim()] : [];
  const singleModeTopics = subject === 'biology'
    ? biologyTopics
    : subject === 'materials' ? allMaterialsDirs
    : subject === 'mechanical' ? allMechanicalDirs
    : parseSingleModeTopics(topic);
  const materialsComboCheck = subject === 'materials' ? checkCombination(selectedMaterialsDirs) : null;
  // 题型兼容性：根据已选知识点计算可用的题型
  const materialsAvailableTypes = subject === 'materials' ? getCommonQuestionTypes(allMaterialsDirs) : ['calculation', 'short-answer', 'mixed'] as MaterialsQuestionType[];
  const materialsTypeUnsupported = subject === 'materials' && materialsQuestionType
    ? getUnsupportedNamesForType(allMaterialsDirs, materialsQuestionType)
    : [];
  // 题型适配度软提示
  const materialsTypeRecommended = subject === 'materials' && (materialsQuestionType === 'short-answer' || materialsQuestionType === 'mixed')
    ? getRecommendedNamesForType(allMaterialsDirs, materialsQuestionType)
    : [];
  const materialsTypeDiscouraged = subject === 'materials' && materialsQuestionType
    ? getDiscouragedNamesForType(allMaterialsDirs, materialsQuestionType)
    : [];

  // 机械题型兼容性（无融合兼容表，只做题型适配提示）
  const mechanicalAvailableTypes = subject === 'mechanical'
    ? getMechanicalCommonQuestionTypes(allMechanicalDirs)
    : (['calculation', 'short-answer', 'mixed'] as MechanicalQuestionType[]);
  const mechanicalTypeUnsupported = subject === 'mechanical' && mechanicalQuestionType
    ? getMechanicalUnsupportedNames(allMechanicalDirs, mechanicalQuestionType)
    : [];
  const mechanicalTypeRecommended = subject === 'mechanical' && (mechanicalQuestionType === 'short-answer' || mechanicalQuestionType === 'mixed')
    ? getMechanicalRecommendedNames(allMechanicalDirs, mechanicalQuestionType)
    : [];
  const mechanicalTypeDiscouraged = subject === 'mechanical' && mechanicalQuestionType
    ? getMechanicalDiscouragedNames(allMechanicalDirs, mechanicalQuestionType)
    : [];

  const toggleKnowledgePoint = (kpId: string) => {
    setSelectedKPs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(kpId)) {
        newSet.delete(kpId);
      } else {
        newSet.add(kpId);
      }
      return newSet;
    });
  };

  const categoryKPs = selectedCategory
    ? getKnowledgePointsInCategory(defaultCatalog, selectedCategory)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              {subject === 'chemistry' ? <Beaker className="w-6 h-6 text-white" /> : subject === 'math' ? <Sigma className="w-6 h-6 text-white" /> : subject === 'biology' ? <Leaf className="w-6 h-6 text-white" /> : subject === 'finance' ? <TrendingUp className="w-6 h-6 text-white" /> : subject === 'materials' ? <Layers className="w-6 h-6 text-white" /> : subject === 'mechanical' ? <Cog className="w-6 h-6 text-white" /> : <Atom className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">{subjectConfig.name}逻辑对抗生成器</h1>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">v4.0 多语言+批量生题</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Subject Selector */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1">
              <button
                onClick={() => handleSubjectChange('chemistry')}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  subject === 'chemistry'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Beaker className="w-3.5 h-3.5" /> 化学
              </button>
              <button
                onClick={() => handleSubjectChange('math')}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  subject === 'math'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sigma className="w-3.5 h-3.5" /> 数学
              </button>
              <button
                onClick={() => handleSubjectChange('physics')}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  subject === 'physics'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Atom className="w-3.5 h-3.5" /> 物理
              </button>
              <button
                onClick={() => handleSubjectChange('biology')}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  subject === 'biology'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" /> 生物
              </button>
              <button
                onClick={() => handleSubjectChange('finance')}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  subject === 'finance'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> 金融
              </button>
              <button
                onClick={() => handleSubjectChange('materials')}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  subject === 'materials'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> 材料
              </button>
              <button
                onClick={() => handleSubjectChange('mechanical')}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  subject === 'mechanical'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cog className="w-3.5 h-3.5" /> 机械
              </button>
            </div>

            {/* Model Provider Selector */}
            {subject === 'biology' ? (
              /* 生物：只显示 OneAPI，含全部模型（包括 DeepSeek） */
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
                <select
                  value={oneApiModel}
                  onChange={(e) => handleOneApiModelChange(e.target.value)}
                  disabled={isRunning}
                  className="px-2 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 text-white border-none focus:outline-none cursor-pointer"
                >
                  {[...new Set(ONEAPI_MODELS.map(m => m.vendor))].map(vendor => (
                    <optgroup key={vendor} label={vendor}>
                      {ONEAPI_MODELS.filter(m => m.vendor === vendor).map(m => (
                        <option key={m.id} value={m.id}>{m.id}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            ) : (
              /* 化学 / 数学：保留原有 DeepSeek 直连按钮 + OneAPI 下拉 */
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
                <button
                  onClick={() => handleProviderChange('deepseek')}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    llmProvider === 'deepseek'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  DeepSeek
                </button>
                <select
                  value={llmProvider === 'oneapi' ? oneApiModel : ''}
                  onChange={(e) => handleOneApiModelChange(e.target.value)}
                  disabled={isRunning}
                  className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-all bg-transparent border-none focus:outline-none cursor-pointer ${
                    llmProvider === 'oneapi'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <option value="" disabled>OneAPI 模型...</option>
                  {[...new Set(ONEAPI_MODELS.map(m => m.vendor))].map(vendor => (
                    <optgroup key={vendor} label={vendor}>
                      {ONEAPI_MODELS.filter(m => m.vendor === vendor).map(m => (
                        <option key={m.id} value={m.id}>{m.id}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {/* 生物质检模型选择器（仅生物学科时显示） */}
            {subject === 'biology' && (
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
                <span className="px-2 text-xs text-slate-400 whitespace-nowrap">质检</span>
                <select
                  value={oneApiReviewModel}
                  onChange={(e) => handleOneApiReviewModelChange(e.target.value)}
                  disabled={isRunning}
                  className="px-2 py-1.5 rounded-md text-xs font-semibold bg-transparent border-none focus:outline-none cursor-pointer text-amber-400"
                >
                  {[...new Set(ONEAPI_MODELS.map(m => m.vendor))].map(vendor => (
                    <optgroup key={vendor} label={vendor}>
                      {ONEAPI_MODELS.filter(m => m.vendor === vendor).map(m => (
                        <option key={m.id} value={m.id}>{m.id}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}
            {/* 生物盲解模型选择器（仅生物 V2 流程时显示） */}
            {subject === 'biology' && useNewPipeline && (
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
                <span className="px-2 text-xs text-slate-400 whitespace-nowrap">盲解</span>
                <select
                  value={oneApiBlindModel}
                  onChange={(e) => handleOneApiBlindModelChange(e.target.value)}
                  disabled={isRunning}
                  className="px-2 py-1.5 rounded-md text-xs font-semibold bg-transparent border-none focus:outline-none cursor-pointer text-emerald-400"
                >
                  {[...new Set(ONEAPI_MODELS.map(m => m.vendor))].map(vendor => (
                    <optgroup key={vendor} label={vendor}>
                      {ONEAPI_MODELS.filter(m => m.vendor === vendor).map(m => (
                        <option key={m.id} value={m.id}>{m.id}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              disabled={isRunning}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>

            {stage === MultiNodeStage.COMPLETED && (
              <button
                onClick={downloadJSON}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-lg font-semibold text-sm shadow-lg">
                <Download className="w-4 h-4" /> 导出 JSON
              </button>
            )}
            <button
              onClick={runWorkflow}
              disabled={isRunning || (generationMode === 'batch' && selectedKPs.size === 0) || (generationMode === 'single' && singleModeTopics.length === 0) || (subject === 'materials' && materialsComboCheck !== null && !materialsComboCheck.canFuse)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-all transform active:scale-95 ${
                isRunning || (generationMode === 'batch' && selectedKPs.size === 0) || (generationMode === 'single' && singleModeTopics.length === 0) || (subject === 'materials' && materialsComboCheck !== null && !materialsComboCheck.canFuse)
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              }`}
            >
              {isRunning ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 正在处理...</>
              ) : (
                <><Play className="w-4 h-4" /> 开始生成</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Mode Selector — 数学暂不支持批量模式 */}
          {subjectConfig.supportsBatch && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 生题模式
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => setGenerationMode('single')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                  generationMode === 'single'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                单题模式
              </button>
              <button
                onClick={() => setGenerationMode('batch')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                  generationMode === 'batch'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                按知识点生题
              </button>
            </div>
          </section>
          )}

          {/* Single Mode Settings */}
          {generationMode === 'single' && (
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" /> 参数设置
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                    {subject === 'mechanical' ? '知识点（单选）' : '知识点（可多个）'}
                  </label>
                  {subject === 'biology' ? (
                    <div className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                      {/* Tag 列表 */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {biologyTopics.map((t, i) => (
                          <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30">
                            {t}
                            {!isRunning && (
                              <button
                                onClick={() => setBiologyTopics(prev => prev.filter((_, idx) => idx !== i))}
                                className="text-indigo-400 hover:text-white leading-none"
                              >×</button>
                            )}
                          </span>
                        ))}
                      </div>
                      {/* 输入框 */}
                      <input
                        type="text"
                        value={biologyTopicDraft}
                        onChange={(e) => setBiologyTopicDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ',') && biologyTopicDraft.trim()) {
                            e.preventDefault();
                            const val = biologyTopicDraft.trim().replace(/,$/, '');
                            if (val && !biologyTopics.includes(val)) {
                              setBiologyTopics(prev => [...prev, val]);
                            }
                            setBiologyTopicDraft('');
                          } else if (e.key === 'Backspace' && !biologyTopicDraft && biologyTopics.length > 0) {
                            setBiologyTopics(prev => prev.slice(0, -1));
                          }
                        }}
                        disabled={isRunning}
                        placeholder={biologyTopics.length === 0 ? '输入知识点，回车或逗号确认' : '继续添加…'}
                        className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                      <p className="text-xs text-slate-600 mt-1">有交叉的 KP 融合出题，无交叉的单独出题（跨领域交叉）</p>
                    </div>
                  ) : subject === 'math' ? (
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={isRunning}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                    >
                      {mathDisciplineOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : subject === 'finance' ? (
                    <div className="space-y-2">
                      <select
                        value={financeDiscipline}
                        onChange={(e) => {
                          const nextKey = e.target.value as FinanceDisciplineKey;
                          setFinanceDiscipline(nextKey);
                          setTopic(getFinanceTopics(nextKey)[0] ?? '');
                        }}
                        disabled={isRunning}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                      >
                        {FINANCE_TOPIC_GROUPS.map(group => (
                          <option key={group.key} value={group.key}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={topic}
                        onChange={(e) => {
                          const nextTopic = e.target.value;
                          setTopic(nextTopic);
                          setFinanceDiscipline(findFinanceDisciplineByTopic(nextTopic));
                        }}
                        disabled={isRunning}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                      >
                        {getFinanceTopics(financeDiscipline).map(financeTopic => (
                          <option key={financeTopic} value={financeTopic}>
                            {financeTopic}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-600">
                        先选分支，再选具体知识点；每个知识点已对应到该分支的难度框架与规则库。
                      </p>
                    </div>
                  ) : subject === 'materials' ? (
                    <div className="space-y-2 relative" ref={materialsDropdownRef}>
                      {/* 下拉触发按钮 */}
                      <button
                        type="button"
                        onClick={() => setMaterialsDropdownOpen(prev => !prev)}
                        disabled={isRunning}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white flex items-center justify-between"
                      >
                        <span className="truncate">
                          {allMaterialsDirs.length === 0
                            ? '请选择知识点方向…'
                            : allMaterialsDirs.length === 1
                              ? allMaterialsDirs[0]
                              : `已选 ${allMaterialsDirs.length} 个方向`}
                        </span>
                        <svg className={`w-4 h-4 text-slate-400 transition-transform ${materialsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* 已选标签(预设 + 自定义) */}
                      {(selectedMaterialsDirs.length > 0 || customMaterialsDirs.length > 0) && (
                        <div className="flex flex-wrap gap-1">
                          {selectedMaterialsDirs.map(dir => (
                            <span key={dir} className="inline-flex items-center gap-1 bg-indigo-600/80 text-white text-xs px-2 py-0.5 rounded-full">
                              {dir}
                              <button
                                type="button"
                                onClick={() => setSelectedMaterialsDirs(prev => prev.filter(v => v !== dir))}
                                className="hover:text-red-300 transition-colors"
                                disabled={isRunning}
                              >×</button>
                            </span>
                          ))}
                          {customMaterialsDirs.map(dir => (
                            <span key={`custom-${dir}`} className="inline-flex items-center gap-1 bg-amber-600/80 text-white text-xs px-2 py-0.5 rounded-full" title="自定义方向(无专业约束)">
                              ✎ {dir}
                              <button
                                type="button"
                                onClick={() => setCustomMaterialsDirs(prev => prev.filter(v => v !== dir))}
                                className="hover:text-red-300 transition-colors"
                                disabled={isRunning}
                              >×</button>
                            </span>
                          ))}
                        </div>
                      )}
                      {/* 下拉选项面板 */}
                      {materialsDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl p-2 max-h-64 overflow-y-auto space-y-1 shadow-xl">
                          {materialsDisciplineOptions.map(option => {
                            const checked = selectedMaterialsDirs.includes(option.value);
                            let compatHint: 'ok' | 'moderate' | 'weak' = 'ok';
                            if (!checked && selectedMaterialsDirs.length > 0) {
                              for (const sel of selectedMaterialsDirs) {
                                const lvl = getCompatLevel(sel, option.value);
                                if (lvl === 'weak') { compatHint = 'weak'; break; }
                                if (lvl === 'moderate') compatHint = 'moderate';
                              }
                            }
                            return (
                              <label
                                key={option.value}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all ${
                                  checked ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={isRunning}
                                  onChange={() => {
                                    setSelectedMaterialsDirs(prev =>
                                      prev.includes(option.value)
                                        ? prev.filter(v => v !== option.value)
                                        : [...prev, option.value]
                                    );
                                  }}
                                  className="accent-indigo-500"
                                />
                                <span className="flex-1">{option.label}</span>
                                {!checked && compatHint === 'weak' && (
                                  <span className="text-xs text-red-400" title="与已选方向不建议融合">⚠</span>
                                )}
                                {!checked && compatHint === 'moderate' && (
                                  <span className="text-xs text-amber-400" title="中等兼容,注意题面自洽">◐</span>
                                )}
                              </label>
                            );
                          })}
                          {/* 自定义输入区域 */}
                          <div className="border-t border-slate-700 mt-2 pt-2 px-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={customMaterialsDraft}
                                onChange={(e) => setCustomMaterialsDraft(e.target.value)}
                                onKeyDown={(e) => {
                                  if ((e.key === 'Enter' || e.key === ',') && customMaterialsDraft.trim()) {
                                    e.preventDefault();
                                    const val = customMaterialsDraft.trim().replace(/,$/, '');
                                    if (val && !customMaterialsDirs.includes(val) && !selectedMaterialsDirs.includes(val)) {
                                      setCustomMaterialsDirs(prev => [...prev, val]);
                                    }
                                    setCustomMaterialsDraft('');
                                  }
                                }}
                                disabled={isRunning}
                                placeholder="自定义知识点，回车确认"
                                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                              />
                            </div>
                            <p className="text-xs text-slate-600 mt-1">自定义知识点不含专业约束，出题质量可能不如预设方向</p>
                          </div>
                        </div>
                      )}
                      {materialsComboCheck && !materialsComboCheck.canFuse ? (
                        <p className="text-xs text-red-400 mt-1">
                          ⚠️ 以下组合不适合融合，请取消其中之一：
                          {materialsComboCheck.weakPairs.map((p, i) => (
                            <span key={i} className="block ml-2">· 「{p[0]}」+「{p[1]}」</span>
                          ))}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-600 mt-1">
                          {allMaterialsDirs.length > 1
                            ? (materialsComboCheck?.fusionHint || '将融合所选方向出跨领域交叉题')
                            : allMaterialsDirs.length === 1
                              ? '已选 1 个方向，单方向出题；可多选组合出跨领域题（⚠不建议 / ◐中等兼容）'
                              : '请选择或输入至少一个知识点方向'}
                        </p>
                      )}
                    </div>
                  ) : subject === 'mechanical' ? (
                    <div className="space-y-2 relative" ref={mechanicalDropdownRef}>
                      {/* 下拉触发按钮 */}
                      <button
                        type="button"
                        onClick={() => setMechanicalDropdownOpen(prev => !prev)}
                        disabled={isRunning}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white flex items-center justify-between"
                      >
                        <span className="truncate">
                          {selectedMechanicalDir.trim()
                            ? (mechanicalDirIsCustom ? `✎ ${selectedMechanicalDir}` : selectedMechanicalDir)
                            : '请选择知识点方向…'}
                        </span>
                        <svg className={`w-4 h-4 text-slate-400 transition-transform ${mechanicalDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* 下拉选项面板 */}
                      {mechanicalDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl p-2 max-h-64 overflow-y-auto space-y-1 shadow-xl">
                          {mechanicalDisciplineOptions.map(option => {
                            const checked = !mechanicalDirIsCustom && selectedMechanicalDir === option.value;
                            return (
                              <label
                                key={option.value}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all ${
                                  checked ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="mechanical-direction"
                                  checked={checked}
                                  disabled={isRunning}
                                  onChange={() => {
                                    setSelectedMechanicalDir(option.value);
                                    setMechanicalDirIsCustom(false);
                                    setMechanicalDropdownOpen(false);
                                  }}
                                  className="accent-indigo-500"
                                />
                                <span className="flex-1">{option.label}</span>
                              </label>
                            );
                          })}
                          {/* 自定义输入区域 */}
                          <div className="border-t border-slate-700 mt-2 pt-2 px-3">
                            <input
                              type="text"
                              value={customMechanicalDraft}
                              onChange={(e) => setCustomMechanicalDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && customMechanicalDraft.trim()) {
                                  e.preventDefault();
                                  const val = customMechanicalDraft.trim();
                                  const preset = mechanicalDisciplineOptions.some(o => o.value === val);
                                  setSelectedMechanicalDir(val);
                                  setMechanicalDirIsCustom(!preset);
                                  setCustomMechanicalDraft('');
                                  setMechanicalDropdownOpen(false);
                                }
                              }}
                              disabled={isRunning}
                              placeholder="自定义知识点，回车确认(将替换当前选择)"
                              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                            />
                            <p className="text-xs text-slate-600 mt-1">自定义知识点不含手册表格与判据分叉约束，出题质量可能不如预设方向</p>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-slate-600 mt-1">
                        {selectedMechanicalDir.trim()
                          ? '一次出一个方向的题'
                          : '请选择或输入一个知识点方向'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={topic}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTopic(e.target.value)}
                        disabled={isRunning}
                        rows={3}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white resize-y"
                        placeholder="例如：化学平衡，Nernst 方程，配位场分裂；多个知识点可用换行、逗号、分号分隔"
                      />
                      <p className="text-xs text-slate-600 mt-1">
                        {singleModeTopics.length > 1
                          ? `将为 ${singleModeTopics.length} 个知识点分别生成题目，每个知识点 ${count} 道，共 ${singleModeTopics.length * count} 道。`
                          : '多个知识点会分别生题，不会强行融合到同一道题。'}
                      </p>
                    </>
                  )}
                </div>
                {subject === 'materials' && useNewPipeline && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                    题型
                  </label>
                  <select
                    value={materialsQuestionType}
                    onChange={(e) => setMaterialsQuestionType(e.target.value as MaterialsQuestionType)}
                    disabled={isRunning}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                  >
                    <option value="calculation">
                      计算题{!materialsAvailableTypes.includes('calculation') ? '（部分知识点未标记支持）' : ''}
                    </option>
                    <option value="short-answer">
                      简答题（论述/机理分析）{!materialsAvailableTypes.includes('short-answer') ? '（部分知识点未标记支持）' : ''}
                    </option>
                    <option value="mixed">
                      混合题（计算+论述小问）{!materialsAvailableTypes.includes('mixed') ? '（部分知识点未标记支持）' : ''}
                    </option>
                  </select>
                  <p className="text-xs text-slate-600 mt-1">
                    {materialsQuestionType === 'short-answer'
                      ? '考察机理/原理/判据/对比分析，答案为论述要点，不含数值计算'
                      : materialsQuestionType === 'mixed'
                      ? '一道题含计算+论述小问，考察定量推导与机理理解的综合能力'
                      : '考察定量推导，答案为带单位的数值结果'}
                  </p>
                  {materialsTypeUnsupported.length > 0 && (
                    <p className="text-xs text-amber-400 mt-1">
                      ⚠ 以下知识点未标记支持「{materialsQuestionType === 'short-answer' ? '简答题' : materialsQuestionType === 'mixed' ? '混合题' : '计算题'}」，仍会尝试生成但可能质量不佳：{materialsTypeUnsupported.join('、')}
                    </p>
                  )}
                  {materialsTypeRecommended.length > 0 && (
                    <p className="text-xs text-emerald-400 mt-1">
                      ✓ 以下知识点特别适合此题型：{materialsTypeRecommended.join('、')}
                    </p>
                  )}
                  {materialsTypeDiscouraged.length > 0 && (
                    <p className="text-xs text-orange-300 mt-1">
                      △ {materialsQuestionType === 'calculation'
                        ? '以下知识点缺乏多步定量推导空间，计算题质量可能受限'
                        : '以下知识点偏向公式代入，论述题易流于定义复述'}：{materialsTypeDiscouraged.join('、')}
                    </p>
                  )}
                </div>
                )}
                {subject === 'mechanical' && useNewPipeline && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                    题型
                  </label>
                  <select
                    value={mechanicalQuestionType}
                    onChange={(e) => setMechanicalQuestionType(e.target.value as MechanicalQuestionType)}
                    disabled={isRunning}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                  >
                    <option value="calculation">
                      设计/校核计算题{!mechanicalAvailableTypes.includes('calculation') ? '（部分知识点未标记支持）' : ''}
                    </option>
                    <option value="short-answer">
                      论述题（失效机理/判据分界）{!mechanicalAvailableTypes.includes('short-answer') ? '（部分知识点未标记支持）' : ''}
                    </option>
                    <option value="mixed">
                      混合题（计算+论述小问）{!mechanicalAvailableTypes.includes('mixed') ? '（部分知识点未标记支持）' : ''}
                    </option>
                  </select>
                  <p className="text-xs text-slate-600 mt-1">
                    {mechanicalQuestionType === 'short-answer'
                      ? '考察失效机理、判据适用条件与分界、工程含义，答案为论述要点'
                      : mechanicalQuestionType === 'mixed'
                      ? '一道题含设计/校核计算小问 + 论述小问，论述结论须与计算结果自洽'
                      : '考察查表选行 → 判据分叉 → 圆整回代 → 主控失效项判定，答案为带单位数值或标准系列型号（可行域为空亦为正确答案）'}
                  </p>
                  {mechanicalTypeUnsupported.length > 0 && (
                    <p className="text-xs text-amber-400 mt-1">
                      ⚠ 以下知识点未标记支持「{mechanicalQuestionType === 'short-answer' ? '论述题' : mechanicalQuestionType === 'mixed' ? '混合题' : '计算题'}」，仍会尝试生成但可能质量不佳：{mechanicalTypeUnsupported.join('、')}
                    </p>
                  )}
                  {mechanicalTypeRecommended.length > 0 && (
                    <p className="text-xs text-emerald-400 mt-1">
                      ✓ 以下知识点特别适合此题型：{mechanicalTypeRecommended.join('、')}
                    </p>
                  )}
                  {mechanicalTypeDiscouraged.length > 0 && (
                    <p className="text-xs text-orange-300 mt-1">
                      △ {mechanicalQuestionType === 'calculation'
                        ? '以下知识点缺乏多步查表/圆整链条，计算题深度可能受限'
                        : '以下知识点偏向公式代入，论述题易流于定义复述'}：{mechanicalTypeDiscouraged.join('、')}
                    </p>
                  )}
                </div>
                )}
                {!((subject === 'math' || subject === 'finance') && useNewPipeline) && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                    {subject === 'math' ? '难度等级 (1-4)' : subject === 'finance' ? '注入陷阱数 (0-3)' : '注入陷阱数 (0-5)'}
                  </label>
                  {subject === 'math' ? (
                    <select
                      value={trapCount}
                      onChange={(e) => setTrapCount(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                    >
                      {MATH_DIFFICULTY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={trapCount}
                      min={0}
                      max={subject === 'finance' ? 3 : 5}
                      onChange={(e) => setTrapCount(clampTrapCountForSubject(subject, Number(e.target.value)))}
                      disabled={isRunning}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                    />
                  )}
                </div>
                )}
                {subject === 'math' && !useNewPipeline && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                      扰动类型
                    </label>
                    <select
                      value={mathPerturbationType}
                      onChange={(e) => setMathPerturbationType(e.target.value as MathPerturbationType)}
                      disabled={isRunning}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                    >
                      {MATH_PERTURBATION_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
                    {subject !== 'biology' && singleModeTopics.length > 1 ? '每个知识点题目数量' : '题目数量'}
                  </label>
                  <input
                    type="number"
                    value={count}
                    min={1}
                    max={100}
                    onChange={(e) => setCount(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Batch Mode Settings */}
          {generationMode === 'batch' && (
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">知识点选择</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-2">分类</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={isRunning}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    {defaultCatalog.categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name['zh-CN'] || cat.name['en-US']}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Knowledge Points Checkboxes */}
                <div className="border border-slate-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {categoryKPs.length > 0 ? (
                    categoryKPs.map((kp) => (
                      <label key={kp.id} className="flex items-center gap-2 py-1 text-xs text-slate-300 hover:text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedKPs.has(kp.id)}
                          onChange={() => toggleKnowledgePoint(kp.id)}
                          disabled={isRunning}
                          className="w-4 h-4 rounded accent-indigo-600"
                        />
                        <span>{kp.name['zh-CN'] || kp.name['en-US']} (难度{kp.difficulty})</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">请选择分类</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">每个知识点生题数</label>
                  <input
                    type="number"
                    value={batchProblemsPerKP}
                    min={1}
                    max={5}
                    onChange={(e) => setBatchProblemsPerKP(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">陷阱数 (0-5)</label>
                  <input
                    type="number"
                    value={batchTrapCount}
                    min={0}
                    max={5}
                    onChange={(e) => setBatchTrapCount(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    并发度: <span className="text-indigo-400">{concurrencyLimit}</span>
                  </label>
                  <select
                    value={concurrencyLimit}
                    onChange={(e) => setConcurrencyLimit(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value={20}>20 (推荐)</option>
                    <option value={50}>50 (快速)</option>
                    <option value={100}>100 (极速)</option>
                    <option value={150}>150 (激进)</option>
                    <option value={200}>200 (最大)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">越高越快，但可能占用更多资源</p>
                </div>

                <p className="text-xs text-slate-400">
                  将生成 {selectedKPs.size * batchProblemsPerKP} 道题目 (并发度: {concurrencyLimit})
                </p>
              </div>
            </section>
          )}

          {/* Common Settings */}
          {(subject === 'math' || subject === 'chemistry' || subject === 'physics' || subject === 'biology' || subject === 'finance' || subject === 'materials' || subject === 'mechanical') && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">高级选项</h2>
            <div className="space-y-3">
              {subject !== 'biology' && subject !== 'math' && (
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAntiInterference}
                  onChange={(e) => setUseAntiInterference(e.target.checked)}
                  disabled={isRunning}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                启用抗干扰检查
              </label>
              )}
              {subject !== 'biology' && (subject !== 'math' || useNewPipeline) && (
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={singleQuestion}
                  onChange={(e) => setSingleQuestion(e.target.checked)}
                  disabled={isRunning}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                仅生成单问题目（禁止多小问）
              </label>
              )}
              {subject === 'math' && useNewPipeline && (
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={numericAnswerOnly}
                  onChange={(e) => setNumericAnswerOnly(e.target.checked)}
                  disabled={isRunning}
                  className="w-4 h-4 rounded accent-indigo-600"
                />
                答案为数值解或表达式（禁止证明/叙述题）
              </label>
              )}
              <label className="flex items-center gap-2 text-xs cursor-pointer font-semibold"
                style={{ color: useNewPipeline ? '#818cf8' : '#94a3b8' }}>
                <input
                  type="checkbox"
                  checked={useNewPipeline}
                  onChange={(e) => setUseNewPipeline(e.target.checked)}
                  disabled={isRunning}
                  className="w-4 h-4 rounded accent-indigo-400"
                />
                {getV2PipelineToggleLabel(subject, useNewPipeline)}
              </label>
              {subject === 'biology' && useNewPipeline && (
              <label className="flex items-center gap-2 text-xs cursor-pointer ml-4"
                style={{ color: cascadeEnabled ? '#f59e0b' : '#94a3b8' }}>
                <input
                  type="checkbox"
                  checked={cascadeEnabled}
                  onChange={(e) => setCascadeEnabled(e.target.checked)}
                  disabled={isRunning}
                  className="w-4 h-4 rounded accent-amber-400"
                />
                {cascadeEnabled ? '⛓ 级联陷阱（层1解对→触发层2）' : '○ 启用级联陷阱'}
              </label>
              )}
            </div>
          </section>
          )}

          {/* Google Sheets */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <label className="block text-xs font-medium text-slate-500 mb-2">Google Sheets URL (可选)</label>
            <input
              type="text"
              value={sheetsUrl}
              onChange={(e) => { setSheetsUrl(e.target.value); localStorage.setItem('sheetsUrl', e.target.value); }}
              disabled={isRunning}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600"
            />
            {sheetsUrl && !validateScriptUrl(sheetsUrl) && (
              <p className="text-xs text-amber-400 mt-1">⚠️ URL 格式可能不正确</p>
            )}
            {savedCount > 0 && (
              <p className="text-xs text-emerald-400 mt-1">
                ✅ 已保存 {savedCount} 道题
                {saveErrors > 0 && <span className="text-red-400"> ({saveErrors} 个失败)</span>}
              </p>
            )}
          </section>

          {/* Node Status */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> 节点状态
            </h2>
            <div className="text-xs text-slate-300">
              <p className="font-bold mb-2">{getStageDisplay(stage)}</p>
              {isRunning && <p className="text-slate-500">进度: {currentIndex + 1}</p>}
            </div>
          </section>

          {/* Error Display */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <p className="text-xs text-rose-400 font-bold uppercase">错误</p>
              </div>
              <p className="text-xs text-rose-400/80 leading-relaxed">{error}</p>
              <button
                onClick={runWorkflow}
                className="mt-2 text-xs font-bold text-rose-400 bg-rose-500/20 hover:bg-rose-500/30 px-3 py-1.5 rounded-lg border border-rose-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" /> 重试
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {problems.length === 0 && stage === MultiNodeStage.IDLE ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-3xl">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">7节点高质量出题系统</h3>
              <p className="text-slate-500 max-w-md mx-auto text-sm">
                基于RAG知识库、并行陷阱注入、防伪审查、内部求解的专业出题架构<br/>
                支持 6 种语言 | 60+ 知识点 | 相似度控制
              </p>
            </div>
          ) : isRunning ? (
            <div className="flex flex-col items-center justify-center p-20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">{getStageDisplay(stage)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {problems.map((problem, idx) => (
                <ProblemCard key={problem.problemId} problem={problem} index={idx} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const ProblemCard: React.FC<{ problem: FinalProblem; index: number }> = ({ problem, index }) => {
  const [expanded, setExpanded] = useState(false);
  const metadata = problem.metadata as any;
  const badgeVisibility = getProblemBadgeVisibility({
    subject: problem.subject,
    metadata,
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div
        className="p-6 cursor-pointer flex items-start gap-5 hover:bg-slate-800/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-lg flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded uppercase tracking-wider border border-indigo-500/20">
                {problem.topic}
              </span>
              {badgeVisibility.showDifficulty && (
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs font-bold rounded uppercase border border-slate-700">
                  {problem.subject === 'math' ? '难度' : '陷阱数'}: {problem.trapCount}
                </span>
              )}
              {badgeVisibility.showTrace && (
                <span
                  className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded uppercase border border-emerald-500/20"
                  title={metadata?.traceId || ''}
                >
                  trace: {(metadata?.traceId || 'N/A').slice(0, 16)}
                </span>
              )}
              {problem.metadata.appliedTraps.map((trap, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-bold rounded border border-amber-500/20"
                  title={problem.metadata.trapDescriptions[i] || ''}
                >
                  {trap.replace('_', ' ')}
                </span>
              ))}
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </div>
          <p className="text-xs text-slate-500 line-clamp-2">{problem.trapModifiedText.substring(0, 100)}...</p>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-800 p-6 bg-slate-950/50 space-y-4 text-xs">
          <div>
            <h4 className="font-semibold text-slate-300 mb-2">含陷阱题目</h4>
            <p className="text-slate-400 whitespace-pre-wrap">{problem.trapModifiedText}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 mb-2">安全解答</h4>
            <p className="text-slate-400 whitespace-pre-wrap">{problem.standardSafeSolution}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 mb-2">最终答案</h4>
            <p className="text-emerald-400 font-mono">{problem.finalAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
