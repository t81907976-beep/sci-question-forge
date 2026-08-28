import type { FinalProblem } from '../../../types/multiNodeTypes';
import { FINANCE_DISCIPLINES, identifyDiscipline } from './disciplines';

/**
 * 金融 V2 生题结果的 Google Sheets 列映射。
 *
 * 金融走的是 A0→A5 链路，**陷阱不是产出物**，所以这里刻意不落
 * 「应用陷阱类型 / 陷阱设计原理」等化学口径列，改为落难度审查、
 * 盲解对抗与发布标签——即"这道题到底难不难、难在哪"的证据链。
 */

const NOT_RECORDED = '未记录';

function text(value: unknown, fallback: string = NOT_RECORDED): string {
    const result = String(value ?? '').trim();
    return result || fallback;
}

function list(value: unknown, fallback: string = NOT_RECORDED): string {
    if (Array.isArray(value)) {
        const items = value.map(item => String(item).trim()).filter(Boolean);
        return items.length > 0 ? items.join('\n') : fallback;
    }
    return text(value, fallback);
}

function boolZh(value: unknown, trueLabel: string = '是', falseLabel: string = '否'): string {
    if (value === true) return trueLabel;
    if (value === false) return falseLabel;
    return NOT_RECORDED;
}

function formatCoreData(value: unknown): string {
    if (!value || typeof value !== 'object') return NOT_RECORDED;
    const entries = Object.entries(value as Record<string, any>);
    if (entries.length === 0) return NOT_RECORDED;
    return entries
        .map(([key, item]) => {
            if (item && typeof item === 'object') {
                return `${key}: ${item.value ?? ''} ${item.unit ?? ''}`.trim();
            }
            return `${key}: ${item ?? ''}`.trim();
        })
        .join('\n');
}

function parseNodeKey(key: string): [number, number, string] {
    const match = key.match(/^([a-z]+)(\d+)/);
    if (!match) return [Number.MAX_SAFE_INTEGER, 0, key];
    return [Number(match[2]), 0, key];
}

export function formatFinanceNodeExecutionTime(value: unknown): string {
    const timings = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    return Object.keys(timings)
        .sort((a, b) => {
            const left = parseNodeKey(a);
            const right = parseNodeKey(b);
            return left[0] - right[0] || left[2].localeCompare(right[2]);
        })
        .map(key => {
            const ms = Number(timings[key]);
            return Number.isFinite(ms) ? `${key}: ${(ms / 1000).toFixed(3)}秒` : '';
        })
        .filter(Boolean)
        .join('\n') || NOT_RECORDED;
}

/** 由落表时的知识点反查分支名，避免 orchestrator 再多挂一个 metadata 字段。 */
export function resolveFinanceDisciplineName(topic: string): string {
    const key = identifyDiscipline(topic) as keyof typeof FINANCE_DISCIPLINES;
    return FINANCE_DISCIPLINES[key]?.name || NOT_RECORDED;
}

/** 金融题目 sheet 的表头，顺序与 buildFinanceSheetsPayload 的键一一对应。 */
export const FINANCE_SHEET_HEADERS: string[] = [
    '题目ID',
    '输入知识点',
    '学科分支',
    '考察维度',
    '最终题干',
    '最终权威答案',
    '最终完整解法',
    '参考解题步骤',
    '核心给定数据',
    '审查是否通过',
    '审查综合判定',
    '难度不足问题',
    '结构深度问题',
    '修复轮数',
    '降级状态',
    '盲解是否可解',
    '盲解最终答案',
    '盲解失败原因',
    '答案是否一致',
    '答案差异说明',
    '答案裁判置信度',
    '推理审查是否通过',
    '推理发现问题',
    '解答是否被修复',
    '修复说明',
    '裁判备注',
    '发布标签',
    '质量等级',
    '各节点耗时',
    'A0-A5动态规则命中JSON',
    '生成时间',
];

/**
 * 把一道金融 V2 题目拍平成 Apps Script 的 saveFinance 载荷。
 * 优先取 metadata（A5 裁判原始字段），缺失时回退到 FinalProblem 上的对应字段。
 */
export function buildFinanceSheetsPayload(problem: FinalProblem): Record<string, string> {
    const meta = (problem.metadata ?? {}) as Record<string, any>;
    const inputKeyword = text(meta.inputKeyword || problem.topic);

    return {
        action: 'saveFinance',
        problemId: text(problem.problemId),
        inputKeyword,
        disciplineName: text(meta.financeDisciplineName || resolveFinanceDisciplineName(inputKeyword)),
        chosenDimension: text(meta.chosenDimension || problem.scenario),
        finalQuestion: text(problem.mergedProblemText || problem.trapModifiedText || problem.questionBody),
        finalAuthorizedAnswer: text(meta.finalAuthorizedAnswer || problem.finalAnswer),
        finalSolutionText: text(meta.finalSolutionText || problem.standardSafeSolution),
        referenceSteps: list(problem.referenceSteps),
        coreData: formatCoreData(problem.coreData),
        reviewPassed: boolZh(meta.reviewPassed, '通过', '未通过'),
        reviewVerdict: text(meta.reviewVerdict),
        reviewDifficultyIssues: list(meta.reviewDifficultyIssues, '无'),
        reviewDepthIssues: list(meta.reviewDepthIssues, '无'),
        repairCycles: text(meta.repairCycles),
        degradationLevel: text(meta.degradationLevel && meta.degradationReason
            ? `${meta.degradationLevel}${meta.degradationLevel === 'stable' ? '' : ` / ${meta.degradationReason}`}`
            : meta.degradationLevel),
        blindSolveSolvable: boolZh(meta.blindSolveSolvable),
        blindSolveAnswer: text(meta.blindSolveAnswer),
        blindSolveFailReason: text(meta.blindSolveFailReason, '无'),
        answersAgree: boolZh(meta.answersAgree),
        discrepancies: list(meta.discrepancies, '无'),
        comparisonConfidence: text(meta.comparisonConfidence),
        reasoningValid: boolZh(meta.reasoningValid, '通过', '发现问题'),
        reasoningIssues: list(meta.reasoningIssues, '无'),
        solutionRepaired: boolZh(meta.solutionRepaired),
        repairSummary: text(meta.repairSummary, '无'),
        comparisonNotes: text(meta.comparisonNotes, '无'),
        releaseLabel: text(meta.releaseLabel),
        qualityLevel: text(problem.qualityLevel || meta.qualityLevel),
        nodeExecutionTime: formatFinanceNodeExecutionTime(meta.nodeExecutionTime),
        matchedRulesTrace: typeof meta.matchedRulesTrace === 'string'
            ? meta.matchedRulesTrace
            : (meta.matchedRulesTrace ? JSON.stringify(meta.matchedRulesTrace) : ''),
        generatedAt: text(meta.generatedAt),
    };
}

/** payload 键 → 表头，供 Apps Script 与文档共用，避免两处顺序漂移。 */
export const FINANCE_SHEET_FIELD_MAP: Array<[string, string]> = [
    ['problemId', '题目ID'],
    ['inputKeyword', '输入知识点'],
    ['disciplineName', '学科分支'],
    ['chosenDimension', '考察维度'],
    ['finalQuestion', '最终题干'],
    ['finalAuthorizedAnswer', '最终权威答案'],
    ['finalSolutionText', '最终完整解法'],
    ['referenceSteps', '参考解题步骤'],
    ['coreData', '核心给定数据'],
    ['reviewPassed', '审查是否通过'],
    ['reviewVerdict', '审查综合判定'],
    ['reviewDifficultyIssues', '难度不足问题'],
    ['reviewDepthIssues', '结构深度问题'],
    ['repairCycles', '修复轮数'],
    ['degradationLevel', '降级状态'],
    ['blindSolveSolvable', '盲解是否可解'],
    ['blindSolveAnswer', '盲解最终答案'],
    ['blindSolveFailReason', '盲解失败原因'],
    ['answersAgree', '答案是否一致'],
    ['discrepancies', '答案差异说明'],
    ['comparisonConfidence', '答案裁判置信度'],
    ['reasoningValid', '推理审查是否通过'],
    ['reasoningIssues', '推理发现问题'],
    ['solutionRepaired', '解答是否被修复'],
    ['repairSummary', '修复说明'],
    ['comparisonNotes', '裁判备注'],
    ['releaseLabel', '发布标签'],
    ['qualityLevel', '质量等级'],
    ['nodeExecutionTime', '各节点耗时'],
    ['matchedRulesTrace', 'A0-A5动态规则命中JSON'],
    ['generatedAt', '生成时间'],
];

/**
 * 生成需要粘进 Apps Script doPost 的金融分支代码。
 * 与 apps-script/Code.gs 里的其它 action 分支同级，
 * 放在 `if (data.action === 'saveMath')` 之后即可。
 */
export function getFinanceAppsScriptBranch(): string {
    const headerLines = FINANCE_SHEET_HEADERS.map(header => `        '${header}'`).join(',\n');
    const mappingLines = FINANCE_SHEET_FIELD_MAP
        .map(([key, header]) => `        '${header}': data.${key} || '未记录',`)
        .join('\n');

    return `if (data.action === 'saveFinance') {
      const FINANCE_SHEET_NAME = '金融题目';
      const financeSheet = spreadsheet.getSheetByName(FINANCE_SHEET_NAME) || spreadsheet.insertSheet(FINANCE_SHEET_NAME);
      const financeHeaders = [
${headerLines}
      ];
      const headers = ensureHeaders(financeSheet, financeHeaders);
      const writtenRow = writeMappedRow(financeSheet, -1, headers, {
${mappingLines}
      });
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, row: writtenRow })
      ).setMimeType(ContentService.MimeType.JSON);
    }`;
}
