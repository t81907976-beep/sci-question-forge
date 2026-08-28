# Question-Unified

用多个 AI 互相出题、互相验证，自动批量生成竞赛级理科难题。

一个 AI 出题 → 另一个 AI 往题目里埋陷阱 → 第三个 AI 验证题目没有矛盾 → 第四个 AI 独立做题验证答案对不对。

- 支持 7 个学科：化学、物理、数学、生物、金融、材料、机械
- 输出：题目 + 完整解题过程 + 陷阱标注（V1）／题目 + 权威答案 + 置信度评级 + 审查日志（V2）
- 可以一次批量生成几十上百道，实时写入 Google 表格
- 项目形态：浏览器网页应用，本地运行，不需要后端服务器

## 安装与运行

前置条件：Node.js ≥ 18，以及一个 LLM API Key（DeepSeek 官方，或任意 OpenAI 兼容网关）。

```bash
npm install
cp .env.example .env   # 填入自己的 Key
npm run dev            # 打开 http://localhost:3000
```

`.env` 已在 `.gitignore` 里，不会被提交。Key 中不能有中文字符。

页面空白 + 控制台报 CORS，通常是直接双击打开了 HTML —— 必须用 `npm run dev` 启动，请求要经过 dev server 代理。

## 核心逻辑：题目是怎么生成的

系统有两条流水线，前端 UI 上可以切换。

### V1：生成 → 埋陷阱 → 验证 → 独立解题

```
用户输入（主题/知识点）
  ↓
[Node0] 输入校验：补全默认参数，限制范围
  ↓
[Node1] 知识约束：确定该知识点的标准术语、符号、禁用表达
  ↓
[Node2] AI 出题：生成一道"干净"的竞赛级题目（无陷阱）        第 1 次 LLM 调用
  ↓
[Node3] AI 埋陷阱：往题目里注入 N 个逻辑陷阱                第 2 次 LLM 调用
  ↓     （例：混用 cal 和 J 的单位）
[Node4] 验证合并：检查陷阱之间是否矛盾、物理条件是否自洽
  ↓     （不通过 → 从 Node2 重试，最多 2 次）
[Node5] AI 独立解题：一个全新的 AI 只看最终题目，独立求解     第 3 次 LLM 调用
  ↓     （能解出来 → 题目没问题；解不出 → 重试）
[Node7] 组装输出：打包为结构化结果
  ↓
最终产出：题目原文 + 含陷阱版题目 + 完整解答 + 陷阱说明
```

V1 的核心思想：先出好题，再故意埋坑，再让另一个 AI 验证坑没有挖过头。

陷阱类型一览：

| 陷阱 | 效果 |
| --- | --- |
| 过程判定 | 混淆等温/绝热/等压等条件 |
| 公式适用性 | 在非理想条件下诱导使用理想公式 |
| 单位量纲 | 混用 cal/J、atm/Pa 等 |
| 查表干扰 | 给出相似物质的数据制造干扰 |
| 物理定义 | 混淆焓和内能、动量和动能等 |

### V2：分析 → 出题+答案 → 审查修复 → 盲解 → 对比裁判

```
用户输入（知识点）
  ↓
[A0] AI 分析知识点：枚举 3-5 个竞赛级考察维度                第 1 次 LLM 调用
  ↓   （同时列出要避开的"老套角度"，不出教材原题）
[A1] AI 出题+写答案：一次性生成题目和详细参考答案            第 2 次 LLM 调用
  ↓
[A2] AI 审查（三维度打分）                                  第 3 次 LLM 调用
  ↓   ├ 合理性：条件自洽？常数准确？条件充分？
  ↓   ├ 难度：是否达到竞赛级？推理≥5 步？
  ↓   └ 深度：有判断分叉？有隐含条件？不是模板题？
  ↓
[A3] AI 修复：深度不够 → 大幅改写；只有小问题 → 精确修补     第 4 次 LLM 调用
  ↓   （最多循环 2 轮修复，第 3 次审查无论如何直接放行）
  ↓
[A4] AI 盲解：全新 AI 上下文，只看题目，看不到答案           第 5 次 LLM 调用
  ↓
[A5] AI 裁判：对比出题者答案 vs 盲解答案                     第 6 次 LLM 调用
  ↓   ├ 两边一致 → 置信度 high，直接输出
  ↓   ├ 有小差异 → 选更严谨的那个，置信度 medium
  ↓   └ 重大分歧 → 标记 low，人工需要复核
  ↓
最终产出：题目 + 权威答案 + 置信度评级 + 审查日志
```

V2 的核心思想：不用陷阱，靠"审查 + 盲解 + 对比"三重保障确保题目质量和答案正确。

### V1 vs V2

| 维度 | V1 | V2 |
| --- | --- | --- |
| 设计目标 | 靠陷阱诱导误答 | 靠逻辑深度和推理复杂度超出模型能力边界 |
| 核心手段 | 注入干扰条件和逻辑陷阱 | 提升题目逻辑深度和推理复杂度 |
| 有无陷阱注入 | 有（Node3） | 无 |
| 质量保障 | 验证陷阱一致性 + 独立解题 | 三维度审查 + 盲解 + 双答案对比 |

### 单题 vs 批量

- 单题模式：选一个主题/知识点，生成 1-N 题，适合调试效果
- 批量模式：勾选一批知识点，系统自动遍历每个知识点并发生题，并发数可调（默认 20，最高 200），受 API 速率限制约束

## 学科模块：你能改什么

每个学科的文件独立存放，各负责人独立修改调试：

```
services/subjects/
├── chemistry/    ← 化学
├── physics/      ← 物理
├── math/         ← 数学
├── biology/      ← 生物
├── finance/      ← 金融
├── materials/    ← 材料
└── mechanical/   ← 机械
```

| 文件 | 作用 | 你能改什么 |
| --- | --- | --- |
| `disciplines.ts` | 定义学科的知识方向和关键词 | 新增/修改知识方向、调整难度描述 |
| `generator.ts` | 出题的 AI 提示词 | 调整出题风格、强调某种能力 |
| `solver.ts` | 解题的 AI 提示词 | 调整解答格式、步骤要求 |
| `traps/` | 各类陷阱的实现 | 新增学科特有的陷阱类型 |
| `v2/` | V2 流水线的各节点 | 调整审查标准、出题约束等 |

改文件 → 保存 → 刷新浏览器看效果。

## LLM 模型配置与切换

两套 provider：

| Provider | API 地址 | 说明 |
| --- | --- | --- |
| DeepSeek | `https://api.deepseek.com` | 直连官方，`VITE_DEEPSEEK_API_KEY` |
| 网关（OpenAI 兼容） | 由 `VITE_GATEWAY_BASE_URL` 指定，经 Vite 代理转发 | `VITE_ANTHROPIC_API_KEY`，Claude 走 `/v1/messages`，其余走 `/v1/chat/completions` |

网关暴露的模型 ID 由网关自己决定，可用 `VITE_GATEWAY_MODELS` 覆盖前端下拉框的清单，格式为 `厂商:模型ID` 列表：

```
VITE_GATEWAY_MODELS="Claude:claude-opus-5,Claude:claude-sonnet-5,DeepSeek:deepseek-reasoner"
```

前端 UI 右上角可以实时切换 provider 和具体模型。

模型分工：需要创造力的节点（出题、分析）用 reasoning 模型，需要精确执行的节点（验证、对比）用 default 模型。代码里通过 `callLLM(prompt, { model: 'reasoning' })` 或 `{ model: 'default' }` 控制。

重试机制：网络超时（504/502）自动重试，响应慢的模型限制输出长度避免超时，其他错误直接报错不重试。

## 批量生成与 Google Sheets 导出

生成的每道题完成后可以实时写入 Google 表格：

1. 新建一个 Google 表格
2. 在该表格里：扩展程序 → Apps Script，粘贴 [apps-script/Code.gs](apps-script/Code.gs) 全部内容
3. 部署 → 新建部署 → Web 应用（执行身份「我」，有权访问的人员「任何人」），复制 `.../exec` URL
4. 把该 URL 填进前端的 Google Sheets URL 输入框

自检：把 exec URL 直接粘到浏览器打开，看到 `{"ok":true,...}` 说明脚本活着、权限对。表头会在首次写入时自动创建，缺列会自动补齐。

## 排错

| 问题 | 解决 |
| --- | --- |
| 页面空白 + CORS 报错 | 必须 `npm run dev` 启动，不能直接打开 HTML |
| API 报 401 | Key 无效或过期，检查 `.env` |
| 请求超时 504 | 换模型或降低批量并发数 |
| 429 Too Many Requests | 降低批量并发数 |
| 端口被占用 | 杀掉占用 3000 端口的进程，或改 `vite.config.ts` 里的 port |
| 题目太简单 | 切换到 reasoning 模型；检查 V2 A0 的维度是否太泛 |
| 答案明显错误 | 看 V2 A5 对比结果的置信度；换推理能力更强的模型 |
| JSON 解析失败 | 控制台看 LLM 原始输出，通常是模型没按格式返回 |

调试技巧：F12 打开控制台，所有节点的中间结果都有 `console.log`，日志前缀 `[LLM]`（模型切换/重试）、`[V2 A0]`（知识点分析）、`[V2 A1]`（题目和答案）、`[V2 A2]`（审查打分）、`[V2 A3]`（修复内容）。Network 面板可以看发给 LLM 的请求体和返回内容。

## 关键文件索引

| 文件 | 一句话说明 |
| --- | --- |
| [App.tsx](App.tsx) | 前端页面主文件，所有 UI 逻辑在这 |
| [vite.config.ts](vite.config.ts) | 开发服务器配置（端口 3000、网关代理地址） |
| [services/llmClient.ts](services/llmClient.ts) | 所有 AI 调用的统一入口（切换模型在这） |
| [services/orchestrator.ts](services/orchestrator.ts) | V1 流水线主控 + 学科路由 |
| [services/orchestrator-v2.ts](services/orchestrator-v2.ts) | V2 流水线主控 |
| [services/batchGenerationService.ts](services/batchGenerationService.ts) | 批量生成调度（并发控制在这） |
| [services/nodes/](services/nodes/) | V1 各节点：node0 输入校验 → node1 知识约束 → node2 出题 → node3-traps 埋陷阱 → node4 验证 → node5 独立解题 → node7 组装输出 |
| [services/subjects/chemistry/v2/](services/subjects/chemistry/v2/) | V2 各节点（以化学为例，其他学科同结构）：kp-analyzer / generator / reviewer / blind-solver / comparator |
| [services/data/knowledgePointsCatalog.ts](services/data/knowledgePointsCatalog.ts) | 知识点目录 |
| [services/utils/jsonCleaner.ts](services/utils/jsonCleaner.ts) | 修复 AI 输出的格式问题 |
| [services/googleSheetsService.ts](services/googleSheetsService.ts) | 写入 Google Sheets |
| [types/multiNodeTypes.ts](types/multiNodeTypes.ts) | 所有数据结构的类型定义 |

## 开发

```bash
npm run typecheck   # tsc --noEmit
npm test            # node --experimental-strip-types --test
npm run build
```

## License

MIT
