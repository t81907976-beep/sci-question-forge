function doPost(e) {
  try {
    const SHEET_ID = ''; // ← 替换成你的表格 ID
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const input = JSON.parse(e.postData.contents);

    // 处理数组或单个对象
    const dataList = Array.isArray(input) ? input : [input];
    const results = [];

    // 遍历每个题目
    for (const data of dataList) {
      const problemId = data.problemId;
      const lastRow = sheet.getLastRow();
      let existingRow = -1;

      // 去重逻辑：同一题重复生成时更新已有行
      if (lastRow > 1) {
        const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (let i = 0; i < ids.length; i++) {
          if (ids[i][0] === problemId) {
            existingRow = i + 2;
            break;
          }
        }
      }

      // 处理对象字段：转换为JSON字符串
      // 各列表头：问题ID	知识点/主题	难度	题目主体	合并题目文本	给定数据
      // 安全解答	最终答案	应用陷阱	陷阱描述	关键洞察	生成时间	分类讨论	审查结果	模型信息
      const rowData = [
        data.problemId,
        data.topic,
        data.difficulty,
        data.questionBody,
        data.mergedProblemText,
        data.givenData,
        data.standardSafeSolution,
        data.finalAnswer,
        data.appliedTrapsMath,
        data.trapDescriptionsMath,
        data.keyInsights,
        data.generatedAt,
        data.caseAnalysis,
        data.reviewResult,
        data.modelInfo
      ];

      if (existingRow > 0) {
        sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
        results.push({ problemId, row: existingRow, updated: true });
      } else {
        sheet.appendRow(rowData);
        results.push({ problemId, row: sheet.getLastRow(), updated: false });
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, count: results.length, results })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}