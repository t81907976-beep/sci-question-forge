/**
 * Google Sheets Integration Service
 * 
 * Uses Google Apps Script as a proxy to save problems to Google Sheets
 * in real-time during batch generation.
 */

import type { FinalProblem } from "../types/multiNodeTypes";
import { formatMathNodeExecutionTime, formatMathTokenUsage } from "./subjects/math/sheetsFormatting";

export interface SheetsSaveResult {
    success: boolean;
    error?: string;
    rowNumber?: number;
}

function formatSheetList(value: unknown, fallback: string = '未记录'): string {
    if (Array.isArray(value)) {
        const items = value.map(item => String(item).trim()).filter(Boolean);
        return items.length > 0 ? items.join('\n') : fallback;
    }
    const text = String(value ?? '').trim();
    return text || fallback;
}

function formatBooleanZh(value: unknown, fallback: string = '未记录'): string {
    if (value === true) return '是';
    if (value === false) return '否';
    return fallback;
}

function formatReviewPassed(value: unknown): string {
    if (value === true) return '通过';
    if (value === false) return '未通过';
    if (value === 1) return '通过';
    if (value === 0) return '未通过';
    return '未记录';
}

/**
 * Save a single problem to Google Sheets via Apps Script Web App
 * Includes retry logic with exponential backoff for network issues
 */
export async function saveProblemToSheets(
    problem: FinalProblem,
    scriptUrl: string,
    maxRetries: number = 3
): Promise<SheetsSaveResult> {
    if (!scriptUrl || scriptUrl.trim() === '') {
        return { success: false, error: 'No script URL provided' };
    }

    const TIMEOUT_MS = 45000; // 45 seconds (increased from default)

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const appliedTraps = problem.metadata?.appliedTraps;
            const trapDescriptions = problem.metadata?.trapDescriptions;
            const meta = (problem.metadata ?? {}) as Record<string, any>;


            const payload = {
                problemId: problem.problemId,
                topic: problem.topic,
                difficulty: problem.difficulty,
                questionBody: problem.questionBody,
                givenData: problem.givenData,
                mergedProblemText: problem.mergedProblemText,
                isTextModified: meta.isTextModified !== undefined ? (meta.isTextModified ? '是' : '否') : '',
                textDiffSummary: meta.textDiffSummary || '',
                solution: problem.solution,
                appliedTrapsMath: problem.metadata?.appliedTraps || [],
                trapDescriptionsMath: problem.metadata?.trapDescriptions || [],
                keyInsights: problem.solution?.keyInsights || '',
                caseAnalysis: problem.solution?.caseAnalysis || '',
                trapCount: problem.trapCount,
                originalProblemText: problem.originalProblemText,
                referenceSteps: problem.referenceSteps,
                trapModifiedText: problem.trapModifiedText,
                standardSafeSolution: problem.standardSafeSolution,
                solutionReference: problem.solutionReference || meta.solutionReference || '',
                coreData: problem.coreData,
                distractorData: problem.distractorData || {},
                finalAnswer: problem.finalAnswer,
                appliedTraps: Array.isArray(appliedTraps) ? appliedTraps.join(', ') : '',
                trapDescriptions: Array.isArray(trapDescriptions) ? trapDescriptions.join(' | ') : '',
                // generatedAt: problem.metadata?.generatedAt || new Date().toISOString(),
                reviewResult: problem.metadata?.reviewResult || '',
                modelInfo: problem.metadata?.modelInfo || {},
                // V2 管线专有字段（生物等学科动态挂载，无值则为空）
                reviewPassed: meta.reviewPassed !== undefined ? (meta.reviewPassed ? '通过' : '未通过') : '',
                reviewVerdict: (() => {
                    const verdict = String(meta.reviewVerdict || '').trim();
                    const validityIssues = Array.isArray(meta.reviewValidityIssues) ? meta.reviewValidityIssues : [];
                    const difficultyIssues = Array.isArray(meta.reviewDifficultyIssues) ? meta.reviewDifficultyIssues : [];
                    const depthIssues = Array.isArray(meta.reviewDepthIssues) ? meta.reviewDepthIssues : [];

                    const details = [
                        ...(validityIssues.length > 0 ? [`validity(${validityIssues.length}): ${validityIssues.join('；')}`] : []),
                        ...(difficultyIssues.length > 0 ? [`difficulty(${difficultyIssues.length}): ${difficultyIssues.join('；')}`] : []),
                        ...(depthIssues.length > 0 ? [`depth(${depthIssues.length}): ${depthIssues.join('；')}`] : []),
                    ].join(' | ');

                    if (details) {
                        return verdict ? `${verdict} | ${details}` : details;
                    }
                    return verdict;
                })(),
                repairCycles: meta.repairCycles ?? '',
                blindSolveAnswer: meta.blindSolveAnswer || '',
                blindSolveSolvable: meta.blindSolveSolvable !== undefined ? (meta.blindSolveSolvable ? '是' : '否') : '',
                blindSolveFailReason: meta.blindSolveFailReason || '',
                answersAgree: meta.answersAgree !== undefined ? (meta.answersAgree ? '是' : '否') : '',
                comparisonConfidence: meta.comparisonConfidence || '',
                costPerProblem: meta.costPerProblem || '',
                modelsUsed: meta.modelsUsed || '',
                inputKeyword: meta.inputKeyword || problem.topic || '',
                matchedRulesTrace: typeof meta.matchedRulesTrace === 'string'
                    ? meta.matchedRulesTrace
                    : (meta.matchedRulesTrace ? JSON.stringify(meta.matchedRulesTrace) : ''),
                generatedAt: problem.metadata?.generatedAt || '',
            };

            console.log(`🔵 Sending to Google Sheets (attempt ${attempt}/${maxRetries}):`, scriptUrl);

            // Use AbortController for timeout control
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(payload),
                signal: controller.signal,
                redirect: 'follow'
            });

            clearTimeout(timeoutId);

            console.log(`📥 Response status: ${response.status} ${response.statusText}`);

            // Check if response is ok
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Response error (attempt ${attempt}):`, errorText);

                // Don't retry on 4xx errors (client errors like 403 Forbidden)
                if (response.status >= 400 && response.status < 500) {
                    return {
                        success: false,
                        error: `HTTP ${response.status}: ${errorText.substring(0, 200)}`
                    };
                }

                // Retry on 5xx errors (server errors)
                if (attempt < maxRetries && response.status >= 500) {
                    const waitTime = 1000 * Math.pow(2, attempt - 1); // Exponential backoff
                    console.log(`⏳ Retrying in ${waitTime}ms...`);
                    await new Promise(r => setTimeout(r, waitTime));
                    continue;
                }
            }

            // Try to parse response
            const responseText = await response.text();
            console.log(`📄 Response body: ${responseText}`);

            try {
                const result = JSON.parse(responseText);
                if (result.success) {
                    console.log(`✅ Successfully saved to Sheets (attempt ${attempt}), row:`, result.row);
                    return { success: true, rowNumber: result.row };
                } else {
                    console.error(`❌ Apps Script returned error: ${result.error}`);
                    return { success: false, error: result.error };
                }
            } catch (parseError) {
                if (responseText.includes('html')) {
                    return { success: false, error: '返回了 HTML 页面，可能是权限问题或 URL 错误' };
                }
                return { success: false, error: `无法解析响应: ${responseText.substring(0, 100)}` };
            }

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);

            // Timeout or network error - retry with backoff
            const isAbort = (error instanceof DOMException && error.name === 'AbortError') || errorMsg.includes('abort');
            if (isAbort || errorMsg.includes('Failed to fetch') || errorMsg.includes('timeout')) {
                console.warn(`⚠️ Network error on attempt ${attempt}: ${errorMsg}`);

                if (attempt < maxRetries) {
                    const waitTime = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
                    console.log(`⏳ Retrying in ${waitTime}ms...`);
                    await new Promise(r => setTimeout(r, waitTime));
                    continue;
                }
            }

            console.error(`🔴 Fetch error (attempt ${attempt}):`, error);
            return {
                success: false,
                error: errorMsg
            };
        }
    }

    // All retries exhausted
    console.error(`🔴 Failed after ${maxRetries} attempts`);
    return {
        success: false,
        error: `Failed to save after ${maxRetries} retry attempts`
    };
}

/**
 * Save a math problem to the dedicated '数学题目' sheet.
 * Uses action:'saveMath' so Apps Script routes to the separate sheet.
 */
export async function saveMathProblemToSheets(
    problem: FinalProblem,
    scriptUrl: string,
    maxRetries: number = 3
): Promise<SheetsSaveResult> {
    if (!scriptUrl || scriptUrl.trim() === '') {
        return { success: false, error: 'No script URL provided' };
    }

    const TIMEOUT_MS = 45000;
    const meta = (problem.metadata ?? {}) as Record<string, any>;
    const normalizeInfo = meta.normalizeResult
        ? `${meta.normalizeResult.originalInput} → ${meta.normalizeResult.matchedKey ?? '?'} (置信度 ${((meta.normalizeResult.confidence ?? 0) * 100).toFixed(1)}%)${meta.normalizeResult.message ? ' [' + meta.normalizeResult.message + ']' : ''}`
        : '';
    const originalInput = String(meta.l2OriginalInput || problem.topic || '未记录').trim() || '未记录';
    const actualL2Direction = String(meta.l2Name || meta.mathCategory || meta.disciplineName || problem.topic || '未记录').trim() || '未记录';
    const routeMethod = String(meta.l2RoutingEvidence?.matchMethod || '未记录').trim() || '未记录';
    const fallbackUsed = formatBooleanZh(meta.l2RoutingEvidence?.fallbackUsed);
    const chosenDimension = String(meta.chosenDimension || problem.scenario || '未记录').trim() || '未记录';
    const finalQuestion = String(problem.mergedProblemText || problem.trapModifiedText || problem.questionBody || '未记录').trim() || '未记录';
    const finalAuthorizedAnswer = String(meta.finalAuthorizedAnswer || problem.finalAnswer || '未记录').trim() || '未记录';
    const finalSolutionText = String(meta.finalSolutionText || problem.standardSafeSolution || '未记录').trim() || '未记录';
    const antiPatternStrategies = formatSheetList(meta.antiPatternStrategies);
    const closureChecklist = formatSheetList(meta.closureChecklist);
    const reviewPassed = formatReviewPassed(meta.reviewPassed ?? meta.reviewerResult);
    const reviewerFailureReason = meta.reviewerFailureReason
        ? String(meta.reviewerFailureReason).trim()
        : reviewPassed === '通过'
            ? '无'
            : String(meta.reviewVerdict || '未记录').trim() || '未记录';
    const repairCycles = meta.repairCycles ?? '未记录';
    const blindSolveSolvable = formatBooleanZh(meta.blindSolveSolvable);
    const blindSolveAnswer = String(meta.blindSolveAnswer || '未记录').trim() || '未记录';
    const answersAgree = formatBooleanZh(meta.answersAgree);
    const comparisonConfidence = String(meta.comparisonConfidence || '未记录').trim() || '未记录';
    const releaseLabel = String(meta.releaseLabel || '未记录').trim() || '未记录';
    const qualityLevel = String(problem.qualityLevel || meta.qualityLevel || '未记录').trim() || '未记录';
    const nodeExecutionTime = formatMathNodeExecutionTime(meta.nodeExecutionTime ?? {}) || '未记录';
    const tokenUsageByNode = formatMathTokenUsage(meta.tokenUsageByNode ?? {});

    const payload = {
        action: 'saveMath',
        problemId: problem.problemId,
        originalInput,
        actualL2Direction,
        routeMethod,
        fallbackUsed,
        chosenDimension,
        finalQuestion,
        finalAuthorizedAnswer,
        finalSolutionText,
        antiPatternStrategies,
        closureChecklist,
        reviewPassed,
        reviewerFailureReason,
        repairCycles,
        blindSolveSolvable,
        blindSolveAnswer,
        answersAgree,
        comparisonConfidence,
        releaseLabel,
        qualityLevel,
        nodeExecutionTime,
        tokenUsageByNode,
        normalizeResult: normalizeInfo,
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload),
                signal: controller.signal,
                redirect: 'follow'
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status >= 400 && response.status < 500) {
                    return { success: false, error: `HTTP ${response.status}: ${errorText.substring(0, 200)}` };
                }
                if (attempt < maxRetries && response.status >= 500) {
                    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
                    continue;
                }
            }

            const responseText = await response.text();
            try {
                const result = JSON.parse(responseText);
                if (result.success) return { success: true, rowNumber: result.row };
                return { success: false, error: result.error };
            } catch {
                if (responseText.includes('html')) return { success: false, error: '返回了 HTML 页面，可能是权限问题或 URL 错误' };
                return { success: false, error: `无法解析响应: ${responseText.substring(0, 100)}` };
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            const isAbort = (error instanceof DOMException && error.name === 'AbortError') || errorMsg.includes('abort');
            if ((isAbort || errorMsg.includes('Failed to fetch') || errorMsg.includes('timeout')) && attempt < maxRetries) {
                await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
                continue;
            }
            return { success: false, error: errorMsg };
        }
    }

    return { success: false, error: `Failed to save after ${maxRetries} retry attempts` };
}

/**
 * Save a materials problem to the dedicated '材料题目' sheet.
 * Uses action:'saveMaterials' so Apps Script routes to the separate sheet.
 * 17 columns aligned to the V2 materials pipeline output.
 */
export async function saveMaterialsProblemToSheets(
    problem: FinalProblem,
    scriptUrl: string,
    maxRetries: number = 3
): Promise<SheetsSaveResult> {
    if (!scriptUrl || scriptUrl.trim() === '') {
        return { success: false, error: 'No script URL provided' };
    }

    const TIMEOUT_MS = 45000;
    const meta = (problem.metadata ?? {}) as Record<string, any>;

    const reviewDetails = [
        ...(Array.isArray(meta.reviewValidityIssues) ? meta.reviewValidityIssues.map((x: string) => `自洽性: ${x}`) : []),
        ...(Array.isArray(meta.reviewDifficultyIssues) ? meta.reviewDifficultyIssues.map((x: string) => `难度: ${x}`) : []),
    ].join('；') || (meta.reviewPassed ? '无' : String(meta.reviewVerdict || ''));

    const payload = {
        action: 'saveMaterials',
        // 按用户批准的 17 列顺序排列
        problemId: problem.problemId,
        generationModel: meta.modelsUsed || '',
        topic: problem.topic || '',
        chosenDimension: String(meta.chosenDimension || problem.scenario || '').trim(),
        questionText: String(problem.mergedProblemText || problem.trapModifiedText || problem.questionBody || '').trim(),
        finalAuthorizedAnswer: String(meta.finalAuthorizedAnswer || problem.finalAnswer || '').trim(),
        finalSolutionText: String(meta.finalSolutionText || problem.standardSafeSolution || '').trim(),
        qualityLevel: problem.qualityLevel || meta.qualityLevel || '',
        questionType: meta.materialsQuestionType === 'short-answer' ? '简答题' : meta.materialsQuestionType === 'mixed' ? '混合题' : '计算题',
        difficultyLevel: meta.difficultyLevelLabel || (
            meta.difficultyLevel === 'peak' ? '顶级' :
            meta.difficultyLevel === 'hard' ? '困难' :
            meta.difficultyLevel === 'standard' ? '标准' : ''
        ),
        reviewPassed: meta.reviewPassed !== undefined ? (meta.reviewPassed ? '通过' : '未通过') : '',
        reviewDetails,
        repairCycles: meta.repairCycles ?? '',
        blindSolveSolvable: meta.blindSolveSolvable !== undefined ? (meta.blindSolveSolvable ? '是' : '否') : '',
        blindSolveAnswer: String(meta.blindSolveAnswer || '').trim(),
        answersAgree: meta.answersAgree !== undefined ? (meta.answersAgree ? '是' : '否') : '',
        comparisonConfidence: meta.comparisonConfidence || '',
        nodeTokenUsage: formatMathTokenUsage(meta.tokenUsageByNode ?? {}),
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload),
                signal: controller.signal,
                redirect: 'follow'
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status >= 400 && response.status < 500) {
                    return { success: false, error: `HTTP ${response.status}: ${errorText.substring(0, 200)}` };
                }
                if (attempt < maxRetries && response.status >= 500) {
                    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
                    continue;
                }
            }

            const responseText = await response.text();
            try {
                const result = JSON.parse(responseText);
                if (result.success) return { success: true, rowNumber: result.row };
                return { success: false, error: result.error };
            } catch {
                if (responseText.includes('html')) return { success: false, error: '返回了 HTML 页面，可能是权限问题或 URL 错误' };
                return { success: false, error: `无法解析响应: ${responseText.substring(0, 100)}` };
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            const isAbort = (error instanceof DOMException && error.name === 'AbortError') || errorMsg.includes('abort');
            if ((isAbort || errorMsg.includes('Failed to fetch') || errorMsg.includes('timeout')) && attempt < maxRetries) {
                await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
                continue;
            }
            return { success: false, error: errorMsg };
        }
    }

    return { success: false, error: `Failed to save after ${maxRetries} retry attempts` };
}

/**
 * Validate the Apps Script URL format
 */
export function validateScriptUrl(url: string): boolean {
    if (!url) return false;

    // Check if it's a Google Apps Script URL
    const pattern = /^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/;
    return pattern.test(url);
}

