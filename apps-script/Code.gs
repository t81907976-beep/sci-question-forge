/**
 * Google Apps Script endpoint for the Question-Unified web app.
 *
 * Container-bound deployment (no spreadsheet ID in the code, so it can only ever
 * write to the sheet it is attached to):
 *   1. Create a Google Sheet.
 *   2. In that sheet: Extensions -> Apps Script.
 *   3. Delete the default myFunction, paste this whole file, save.
 *   4. Deploy -> New deployment -> Web app
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Copy the .../exec URL into the app's "Google Sheets URL" field.
 *
 * Sanity check: open the exec URL in a browser. A {"ok":true,...} response means
 * the script is live, authorised, and can reach the spreadsheet.
 *
 * Three request shapes are handled:
 *   action omitted        -> chemistry / physics / biology / finance results
 *   action 'saveMath'     -> math results
 *   action 'saveMaterials'-> materials results
 */

const RESULT_SHEET_NAME = '生题结果';
const MATH_SHEET_NAME = '数学题目';
const MATERIALS_SHEET_NAME = '材料测评题目';

const RESULT_HEADERS = [
  '问题ID', '知识点/主题', '注入陷阱数',
  '【基座(全文)】原始题目本', '【基座】参考解答步骤',
  '【陷阱版(全文)】加坑后题目本', '【验证版】避坑安全解答', 'reference',
  '【数据】核心给定已知量', '【数据】额外干扰混淆量', '最终核定答案',
  '应用陷阱类型', '陷阱设计原理解释', '生成时间',
  '审查是否通过', '审查综合判定', '修复轮次',
  '盲解答案', '盲解是否可解', '盲解失败原因',
  '答案是否一致', '对比置信度', '生成单价(估算)', '使用模型',
  '题干是否改动', '题干改动摘要', 'A0-A5动态规则命中JSON',
];

const MATH_HEADERS = [
  '题目ID', '原始输入', '实际L2方向', 'L2命中方式', '是否默认回退', '考察维度',
  '最终题干', '最终权威答案', '最终完整解法', '本题反模板策略', '闭合检查项',
  '审查是否通过', '不通过原因', '修复轮数', '盲解是否可解', '盲解最终答案',
  '答案是否一致', '答案裁判置信度', '发布标签', '质量等级', '各节点耗时', 'Token消耗',
];

const MATERIALS_HEADERS = [
  '题目ID', '生成模型', '知识点', '考察维度', '题目', '答案', '完整解答',
  '质量等级', '题型', '难度档',
  '审查是否通过', '审查问题详情', '修复轮数',
  '盲解是否可解', '盲解答案', '答案是否一致', '裁判置信度', 'Token消耗',
];

/** Self-check endpoint: open the exec URL directly in a browser. */
function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    return jsonOut({
      ok: true,
      boundSpreadsheetName: spreadsheet.getName(),
      boundSpreadsheetId: spreadsheet.getId(),
      note: 'Ready to accept POST requests from the app.',
    });
  } catch (error) {
    return jsonOut({ ok: false, error: error.toString() });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (data.action === 'saveMath') {
      return jsonOut({ success: true, row: saveMath(spreadsheet, data) });
    }
    if (data.action === 'saveMaterials') {
      const row = saveMaterials(spreadsheet, data);
      return jsonOut({
        success: true,
        row: row,
        spreadsheetName: spreadsheet.getName(),
        sheetName: MATERIALS_SHEET_NAME,
      });
    }
    return jsonOut({ success: true, row: saveResult(spreadsheet, data) });
  } catch (error) {
    return jsonOut({ success: false, error: error.toString() });
  }
}

function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}

function saveResult(spreadsheet, data) {
  const sheet = getSheet(spreadsheet, RESULT_SHEET_NAME);
  const headers = ensureHeaders(sheet, RESULT_HEADERS);
  return writeMappedRow(sheet, headers, {
    '问题ID': data.problemId,
    '知识点/主题': data.topic,
    '注入陷阱数': data.trapCount,
    '【基座(全文)】原始题目本': data.originalProblemText,
    '【基座】参考解答步骤': formatSteps(data.referenceSteps),
    '【陷阱版(全文)】加坑后题目本': data.mergedProblemText || data.trapModifiedText,
    '【验证版】避坑安全解答': data.standardSafeSolution,
    'reference': data.solutionReference,
    '【数据】核心给定已知量': formatDataRecord(data.coreData),
    '【数据】额外干扰混淆量': formatDataRecord(data.distractorData),
    '最终核定答案': data.finalAnswer,
    '应用陷阱类型': data.appliedTraps,
    '陷阱设计原理解释': data.trapDescriptions,
    '生成时间': data.generatedAt,
    '审查是否通过': data.reviewPassed,
    '审查综合判定': data.reviewVerdict,
    '修复轮次': data.repairCycles,
    '盲解答案': data.blindSolveAnswer,
    '盲解是否可解': data.blindSolveSolvable,
    '盲解失败原因': data.blindSolveFailReason,
    '答案是否一致': data.answersAgree,
    '对比置信度': data.comparisonConfidence,
    '生成单价(估算)': data.costPerProblem,
    '使用模型': data.modelsUsed,
    '题干是否改动': data.isTextModified,
    '题干改动摘要': data.textDiffSummary,
    'A0-A5动态规则命中JSON': data.matchedRulesTrace,
  });
}

function saveMath(spreadsheet, data) {
  const sheet = getSheet(spreadsheet, MATH_SHEET_NAME);
  const headers = ensureHeaders(sheet, MATH_HEADERS);
  return writeMappedRow(sheet, headers, {
    '题目ID': data.problemId,
    '原始输入': data.originalInput,
    '实际L2方向': data.actualL2Direction,
    'L2命中方式': data.routeMethod,
    '是否默认回退': data.fallbackUsed,
    '考察维度': data.chosenDimension,
    '最终题干': data.finalQuestion,
    '最终权威答案': data.finalAuthorizedAnswer,
    '最终完整解法': data.finalSolutionText,
    '本题反模板策略': data.antiPatternStrategies,
    '闭合检查项': data.closureChecklist,
    '审查是否通过': data.reviewPassed,
    '不通过原因': data.reviewerFailureReason,
    '修复轮数': data.repairCycles,
    '盲解是否可解': data.blindSolveSolvable,
    '盲解最终答案': data.blindSolveAnswer,
    '答案是否一致': data.answersAgree,
    '答案裁判置信度': data.comparisonConfidence,
    '发布标签': data.releaseLabel,
    '质量等级': data.qualityLevel,
    '各节点耗时': data.nodeExecutionTime,
    'Token消耗': data.tokenUsageByNode,
  });
}

function saveMaterials(spreadsheet, data) {
  const sheet = getSheet(spreadsheet, MATERIALS_SHEET_NAME);
  const headers = ensureHeaders(sheet, MATERIALS_HEADERS);
  return writeMappedRow(sheet, headers, {
    '题目ID': data.problemId,
    '生成模型': data.generationModel,
    '知识点': data.topic,
    '考察维度': data.chosenDimension,
    '题目': data.questionText,
    '答案': data.finalAuthorizedAnswer,
    '完整解答': data.finalSolutionText,
    '质量等级': data.qualityLevel,
    '题型': data.questionType,
    '难度档': data.difficultyLevel,
    '审查是否通过': data.reviewPassed,
    '审查问题详情': data.reviewDetails,
    '修复轮数': data.repairCycles,
    '盲解是否可解': data.blindSolveSolvable,
    '盲解答案': data.blindSolveAnswer,
    '答案是否一致': data.answersAgree,
    '裁判置信度': data.comparisonConfidence,
    'Token消耗': data.nodeTokenUsage,
  });
}

/** Fetch a tab by name, creating it on first use. */
function getSheet(spreadsheet, name) {
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

/** Idempotent header row: write it on an empty sheet, append only missing columns otherwise. */
function ensureHeaders(sheet, expected) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0]
    .map(function (h) { return String(h == null ? '' : h).trim(); });

  if (!existing.some(Boolean)) {
    sheet.getRange(1, 1, 1, expected.length).setValues([expected]);
    return expected;
  }

  const next = existing.slice();
  expected.forEach(function (h) {
    if (next.indexOf(h) === -1) next.push(h);
  });
  if (next.length !== existing.length) {
    sheet.getRange(1, 1, 1, next.length).setValues([next]);
  }
  return next;
}

/** Append a row keyed by header name, so reordering columns never shifts values. */
function writeMappedRow(sheet, headers, values) {
  const rowData = new Array(headers.length).fill('');
  Object.keys(values).forEach(function (header) {
    const idx = headers.indexOf(header);
    if (idx >= 0) rowData[idx] = values[header] == null ? '' : values[header];
  });
  sheet.appendRow(rowData);
  return sheet.getLastRow();
}

/** Flatten a {name: {value, unit}} style record into readable lines. */
function formatDataRecord(record) {
  if (!record || typeof record !== 'object') return '';
  return Object.keys(record).map(function (key) {
    const entry = record[key];
    if (entry && typeof entry === 'object') {
      const value = entry.value == null ? '' : entry.value;
      const unit = entry.unit ? ' ' + entry.unit : '';
      return key + ': ' + value + unit;
    }
    return key + ': ' + (entry == null ? '' : entry);
  }).join('\n');
}

/** Render solution steps as a numbered list. */
function formatSteps(steps) {
  if (!steps) return '';
  if (!Array.isArray(steps)) return String(steps);
  return steps.map(function (step, i) {
    if (step && typeof step === 'object') {
      const title = step.title || step.step || '';
      const body = step.content || step.detail || step.description || '';
      return (i + 1) + '. ' + [title, body].filter(Boolean).join(' — ');
    }
    return (i + 1) + '. ' + String(step);
  }).join('\n');
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

