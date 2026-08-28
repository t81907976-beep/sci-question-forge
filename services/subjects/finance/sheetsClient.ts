import type { FinalProblem } from '../../../types/multiNodeTypes';
import { buildFinanceSheetsPayload } from './sheetsFormatting';

/**
 * 金融题目的 Google Sheets 落表客户端。
 *
 * 单独放在金融路径下，而不是塞进 googleSheetsService.ts，
 * 这样金融的列结构演进不会牵动化学/数学/生物的落表逻辑。
 * 走 action:'saveFinance'，由 Apps Script 路由到独立的「金融题目」sheet。
 */

export interface FinanceSheetsSaveResult {
    success: boolean;
    error?: string;
    rowNumber?: number;
}

const TIMEOUT_MS = 45000;

export async function saveFinanceProblemToSheets(
    problem: FinalProblem,
    scriptUrl: string,
    maxRetries: number = 3,
): Promise<FinanceSheetsSaveResult> {
    if (!scriptUrl || scriptUrl.trim() === '') {
        return { success: false, error: 'No script URL provided' };
    }

    const payload = buildFinanceSheetsPayload(problem);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(scriptUrl.trim(), {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload),
                signal: controller.signal,
                redirect: 'follow',
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
                if (responseText.includes('html')) {
                    return { success: false, error: '返回了 HTML 页面，可能是权限问题或 URL 错误（Apps Script 未部署为"任何人"可访问）' };
                }
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
