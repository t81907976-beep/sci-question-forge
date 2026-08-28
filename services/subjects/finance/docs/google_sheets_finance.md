# 金融题目 Google 表格设置指南

金融 V2 链路的落表是独立的：`action: 'saveFinance'` → 表格里的 **「金融题目」** sheet，
31 列，不含化学口径的「应用陷阱类型 / 陷阱设计原理」——本链路不以埋陷阱为目标，
落表记录的是**难度证据链**（难度审查 → 盲解对抗 → A5 裁判判定 → 发布标签）。

代码位置：
- 列定义与拍平：[sheetsFormatting.ts](../sheetsFormatting.ts)
- 落表客户端：[sheetsClient.ts](../sheetsClient.ts)
- metadata 拼装：[v2/metadata.ts](../v2/metadata.ts)
- 表头 CSV 模板：[金融题目-表头模板.csv](../金融题目-表头模板.csv)
- **可直接粘贴的完整 Apps Script**：[apps-script-完整版.js](../apps-script-完整版.js)
- 该文件的生成脚本：[scripts/generate-apps-script.ts](../scripts/generate-apps-script.ts)

---

## 从零开一张新表（推荐路径）

1. 打开 <https://sheets.google.com>，点「空白电子表格」。给表格起个名，
   比如「题库生成结果」。工作表**不用手动建**，脚本会按需创建
   （生题结果 / 数学题目 / 金融题目 / 能力边界分析-化学、生物、物理）。
2. 从地址栏抄下 Sheet ID：
   `https://docs.google.com/spreadsheets/d/【这一段就是 SHEET_ID】/edit`
3. 表格里点 **扩展程序 → Apps Script**，删掉默认的 `function myFunction() {}`，
   把 [apps-script-完整版.js](../apps-script-完整版.js) **整份**粘进去。
4. 把文件里的 `YOUR_SHEET_ID_HERE` 换成第 2 步的 Sheet ID，按 💾 保存。
5. 右上角 **部署 → 新建部署**：类型选「Web 应用」，执行身份「我」，
   访问权限 **「任何人」**。点部署，首次会要求授权，按提示允许
   （会出现「Google 未验证此应用」的警告页——点「高级 → 继续前往」）。
6. 复制形如 `https://script.google.com/macros/s/…/exec` 的 URL，
   粘进前端左栏的「Google Sheets URL (可选)」。
7. 学科选「金融」，生成一道题，表格里会自动出现「金融题目」工作表并写入一行；
   界面右下会显示「已保存 1 道题」。

> 访问权限设为「任何人」意味着任何拿到该 URL 的人都能往这张表里写行。
> 这是 Apps Script Web App 免鉴权写入的固有代价——URL 请当作凭据看待，不要外传或提交进仓库。

想改列结构时：只改 `sheetsFormatting.ts`，然后重新生成并重新部署：

```bash
npx tsx services/subjects/finance/scripts/generate-apps-script.ts
```

---

## 只想往已有表格里加金融分支

若此前已按 `docs/google_sheets_setup.md` 部署过化学/数学的 `doPost`，不必整份替换，
只需在 `if (data.action === 'saveMath') { … }` 之后插入下面这段
（依赖其中已有的 `spreadsheet`、`ensureHeaders`、`writeMappedRow`），再重新部署。

```javascript
if (data.action === 'saveFinance') {
  const FINANCE_SHEET_NAME = '金融题目';
  const financeSheet = spreadsheet.getSheetByName(FINANCE_SHEET_NAME) || spreadsheet.insertSheet(FINANCE_SHEET_NAME);
  const financeHeaders = [
    '题目ID', '输入知识点', '学科分支', '考察维度',
    '最终题干', '最终权威答案', '最终完整解法', '参考解题步骤', '核心给定数据',
    '审查是否通过', '审查综合判定', '难度不足问题', '结构深度问题', '修复轮数', '降级状态',
    '盲解是否可解', '盲解最终答案', '盲解失败原因',
    '答案是否一致', '答案差异说明', '答案裁判置信度',
    '推理审查是否通过', '推理发现问题', '解答是否被修复', '修复说明', '裁判备注',
    '发布标签', '质量等级', '各节点耗时', 'A0-A5动态规则命中JSON', '生成时间'
  ];
  const headers = ensureHeaders(financeSheet, financeHeaders);
  const writtenRow = writeMappedRow(financeSheet, -1, headers, {
    '题目ID': data.problemId || '未记录',
    '输入知识点': data.inputKeyword || '未记录',
    '学科分支': data.disciplineName || '未记录',
    '考察维度': data.chosenDimension || '未记录',
    '最终题干': data.finalQuestion || '未记录',
    '最终权威答案': data.finalAuthorizedAnswer || '未记录',
    '最终完整解法': data.finalSolutionText || '未记录',
    '参考解题步骤': data.referenceSteps || '未记录',
    '核心给定数据': data.coreData || '未记录',
    '审查是否通过': data.reviewPassed || '未记录',
    '审查综合判定': data.reviewVerdict || '未记录',
    '难度不足问题': data.reviewDifficultyIssues || '未记录',
    '结构深度问题': data.reviewDepthIssues || '未记录',
    '修复轮数': data.repairCycles || '未记录',
    '降级状态': data.degradationLevel || '未记录',
    '盲解是否可解': data.blindSolveSolvable || '未记录',
    '盲解最终答案': data.blindSolveAnswer || '未记录',
    '盲解失败原因': data.blindSolveFailReason || '未记录',
    '答案是否一致': data.answersAgree || '未记录',
    '答案差异说明': data.discrepancies || '未记录',
    '答案裁判置信度': data.comparisonConfidence || '未记录',
    '推理审查是否通过': data.reasoningValid || '未记录',
    '推理发现问题': data.reasoningIssues || '未记录',
    '解答是否被修复': data.solutionRepaired || '未记录',
    '修复说明': data.repairSummary || '未记录',
    '裁判备注': data.comparisonNotes || '未记录',
    '发布标签': data.releaseLabel || '未记录',
    '质量等级': data.qualityLevel || '未记录',
    '各节点耗时': data.nodeExecutionTime || '未记录',
    'A0-A5动态规则命中JSON': data.matchedRulesTrace || '未记录',
    '生成时间': data.generatedAt || '未记录',
  });
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, row: writtenRow })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

这段代码可以随时用生成脚本重新产出，保证与 TS 侧列顺序一致：

```bash
npx tsx services/subjects/finance/scripts/generate-apps-script.ts
```

部署方式与上面第 5～7 步相同。若访问权限没设成「任何人」，前端 fetch 会拿到
Google 登录 HTML 页，客户端会把这种情况报成「返回了 HTML 页面，可能是权限问题或 URL 错误」。

---

## 维护约定

修改列结构时**只改 `sheetsFormatting.ts`**——`FINANCE_SHEET_HEADERS`、
`FINANCE_SHEET_FIELD_MAP` 与 `buildFinanceSheetsPayload` 三者的键顺序必须保持一致
（已校验过 31 列一一对应），然后重新跑生成脚本并重新部署。

---

## 列含义速查

| 列 | 来源 | 说明 |
| --- | --- | --- |
| 输入知识点 / 学科分支 | 界面下拉框 → `identifyDiscipline` | 分支是反查出来的，可用来核对路由是否命中预期框架 |
| 考察维度 | A0 规划、A1 选定 | 本题实际考的那条维度 |
| 审查是否通过 / 难度不足问题 | A2/A3 | **难度不足是阻断项**，这一列非空即说明改过 |
| 结构深度问题 | A2/A3 | 非阻断，仅质量记录 |
| 降级状态 | A2/A3 修复循环 | `stable` 以外会附带原因 |
| 盲解是否可解 / 盲解最终答案 | A4（只看题干的独立上下文） | 一次做对 ⇒ 难度可能不够 |
| 答案是否一致 / 差异说明 / 置信度 | A5 | 差异必须归因到口径歧义、参考答案错、盲解错、两者都对之一 |
| 推理审查 / 解答是否被修复 / 修复说明 | A5 | 即使两个数字一致，A5 也会逐步审参考解法 |
| 发布标签 | A5 | `standard` / `with_caveats` / `discussion_only` / `adversarial` / `not_recommended` |
| A0-A5动态规则命中JSON | 规则匹配器 | 每个节点实际注入了哪些规则，用于回溯"为什么生成了这道题" |
