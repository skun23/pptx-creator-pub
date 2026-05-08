---
name: pptx-creator
description: "Creates modern, well-structured PPTX presentations from a simple JSON data file. This skill uses a layout-driven approach for reliability and speed, and includes a mandatory interactive theme selection to ensure visual consistency."
---

# PPTX Creator Skill

根据用户提供的内容（教材章节、文章、笔记），生成 `presentation.json`，然后运行检查脚本检查`presentation.json`的内容，最后通过构建脚本生成 `.pptx` 文件。

---

## 工作流程

1. **定义听众与目标**: 读取下方的“听众-目标策略模型”表，列出所有选项让用户选择（如：教学、报告、说服）。**后续构思并创建幻灯片内容时，必须遵循所选的策略模型**。
2. **列出所有可用主题**: 见下方"可用主题"表，让用户选择。若用户未选择，默认使用 `navy-executive`。
3. **构思并创作幻灯片内容**: 严格遵循所选听众-目标策略模型中对**内容抽象级别和侧重点**的规定，按照`references/CONTENT_GUIDE.md` 中定义的**内容创作工作流**，将源文档解构和创作为幻灯片序列。这包括识别叙事弧、为每张幻灯片选择合适的类型（见下方"幻灯片类型速查"表）、撰写论点式标题和关键词要点。
4. **输出 `presentation.json`**: 生成包含 `settings` 和 `slides` 数组的JSON文件。
5. **验证**: 运行 `node ./scripts/validate-presentation.js ./presentation.json`，修复所有 ❌ 错误。然后，对照 `references/checklist.md` 检查生成的幻灯片内容。
6. **构建**: 运行 `node ./scripts/build-from-json.js ./presentation.json <输出文件名>.pptx`。

---

## 必须遵守的规则

### 听众-目标策略模型 (Audience-Goal Strategy Model)

这是最高级别的策略层。在内容创作开始前，必须先确定本次演示的听众和目标，并选择一个最合适的策略模型。后续内容的抽象级别和侧重点必须遵循所选的策略模型。

### 主题选择

- 必须列出全部 4 个主题供用户选择，不得自行决定。
- 用户未选择时，必须使用 `navy-executive`。
- `settings.theme` 全篇只设置一次，中途不得更换。

### JSON 字符串转义

所有 `presentation.json` 字符串值中的反斜线 `\` 必须写为双反斜线 `\\`。JSON 规范中 `\` 是转义字符，`\l`、`\t`、`\s` 等均不是合法转义序列，会导致 JSON 解析失败。

| 源内容 | JSON 中应写为 |
|:---|:---|
| `$ Q \leqslant Q' $` | `$ Q \\leqslant Q' $` |
| `$ a \times b $` | `$ a \\times b $` |
| `$ f(x) = \int $` | `$ f(x) = \\int $` |
| `\frac{a}{b}` | `\\frac{a}{b}` |

**数学公式处理：**

请遵循以下原则处理数学公式：

1.  **简单符号**：对于 `\\leqslant` (`≤`)、`\\geqslant` (`≥`)、`\\times` (`×`) 等简单的数学符号，请直接在 `presentation.json` 中使用其 Unicode 字符。
2.  **避免 `$` 符号**：如果公式内容中包含 `$` 符号（例如 `$ Q \\leqslant Q' $`），请将其移除，因为它会被视为纯文本并显示出来，而非作为公式分隔符。

**请注意：所有包含 LaTeX 风格表达式的 JSON 字段，仍需确保每个 `\` 都以 `\\` 形式写入，以保证 JSON 格式的有效性。**

### Markdown 表格与换行

`two-column.right.text` 等字段中的 Markdown 表格，行分隔必须使用 `\n`（JSON 转义换行符），列分隔使用 `|`。

```json
"text": "街区面积编号 | F1 | F2 | F3 | F4 | F5\n------------|----|----|----|----|----\n工业废水量(L/s) | 20 | 30 | 90 | 0  | 35"
```

- **列分隔**：用 `|` 分隔
- **行分隔**：用 `\n`（两个字符：反斜线 + n），**不可使用字面换行符**
- **表头分隔线**：用 `---|---|---` 格式

**JSON 规范不允许字符串内出现字面换行符（literal newline），必须全部使用 `\n` 转义序列。**

### 内容规则

详细要求见`references/CONTENT_GUIDE.md`。

| # | 规则 |
|:---|:---|
| 1 | 每页只传达一个核心观点。一个主题有 5 个要点则拆成 2-3 页。 |
| 2 | 标题必须是完整陈述句（≥ 3 字符）。❌ `"管径确定方法"` → ✅ `"管径由设计流量和经济流速共同确定"` |
| 3 | 要点是关键词短语（每条 ≤ 40 字），完整内容由演讲者口述。 |
| 4 | 单页总字数 ≤ 120 字，每条 ≤ 40 字，每页 ≤ 8 条。`content` 类型至少 3 条。 |
| 5 | 使用主动语态。删除填充短语："我们认为"、"值得一提的是"、"需要注意的是"。 |
| 6 | 有数字就用 `big-number-grid`、`comparison`、`chart`，不得堆在文字里。 |

### 图片规则

| # | 规则 |
|:---|:---|
| 7 | 涉及图表、示意图、流程图、照片的幻灯片，必须用 `two-column` 或 `image-grid`，不得用 `content`。 |
| 8 | 图片放在右侧，文字要点放在左侧。 |
| 9 | 图片路径使用绝对路径，不要使用相对路径。图片缺失时 builder 自动渲染占位框。 |

### 结构规则

| # | 规则 |
|:---|:---|
| 10 | 不超过 4 页连续的 body 类型（`content`、`two-column`、`comparison`、`pipeline`、`big-number-grid`）。8+ 页必须包含至少 1 个封面或分隔页。结尾用 `minimal-quote` 或 `section-divider` 收束。 |
| 11 | 典型节奏：`hero-cover` → `content` × 2 → `section-divider` → `content` × 2 → `minimal-quote`。 |

---

## 听众-目标策略模型

| 模型 | 听众 | 目标 | 内容抽象级别 | 内容侧重点 |
|:---|:---|:---|:---|:---|
| **教学 (Teaching)** | 学生 / 新手 | 传授知识、教会方法 | **低 (注重细节)** | 基础概念、完整步骤、定义、具体示例。 |
| **报告 (Reporting)** | 同行 / 专家 | 分享发现、同步信息 | **高 (注重结果)** | 创新方法、关键结果、数据对比、未来影响。 |
| **说服 (Persuading)**| 客户 / 领导 | 推动决策、获得支持 | **高 (注重价值)** | 核心价值、投资回报(ROI)、关键绩效(KPI)、行动号召。 |
| **研讨 (Discussing)**| 内部团队 | 激发讨论、对齐思路 | **中 (注重观点)** | 开放性问题、争议点、不同观点对比、团队决策。 |

---

## 可用主题

| ID | 氛围 | 推荐场景 |
|:---|:---|:---|
| `ink-classic` | 🖋️ 墨水经典 — Monocle 杂志风 | 通用默认 |
| `indigo-porcelain` | 🌊 靛蓝瓷 — 学术期刊 | AI / 科技 / 研究 |
| `forest-ink` | 🌿 森林墨 — 复古国家地理 | 自然 / 文化 / 可持续 |
| `navy-executive` | 🔷 深蓝企标 — 企业蓝渐变 | 技术报告 / 企业演示 |

> 主题文件位于 `references/themes/` 目录，由 builder 自动加载。

---

## 幻灯片类型速查

### 封面与分隔

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `hero-cover` | 开场封面，高冲击力 | `title`, `subtitle` |
| `section-divider` | 章节分隔页 | `title` |
| `title` | 标准标题页 | `title`, `subtitle`（可选） |

### 内容展示

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `content` | 标题 + 要点列表 | `title`, `bullets[]` |
| `two-column` | 左右分栏（文字/图片） | `title`, `left`, `right` |
| `comparison` | 两组对比（Before/After） | `title`, `left`, `right` |
| `table` | 标题 + Markdown 表格 | `title`, `content` |

- `content.layout`: `standard`（默认）、`dense`、`minimal`
- `two-column.layout`: `equal`（默认）、`text-dominant`、`image-dominant`
- `two-column.left`: `{ title?, bullets[] }`
- `two-column.right`: `{ image }` 或 `{ title?, bullets[], text }`
- `comparison.left/right`: `{ label, items[] }`
- `table.content`: Markdown 表格字符串，行用 `\n`，列用 `|`，与"Markdown 表格与换行"规则一致

### 数据与指标

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `big-number-grid` | 关键指标/统计数据网格 | `title`, `stats[]` |
| `chart` | 柱状/折线/饼图/环形图 | `title`, `type`, `labels[]`, `data[]` |

- `stats[]`: `{ label, number, unit?, note? }`
- `chart.type`: `bar`、`line`、`pie`、`doughnut`
- `chart.data[]`: `{ name, values[] }`
- `chart.options`: `{ showValue?, colors? }`

### 流程与步骤

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `pipeline` | 编号步骤/工作流 | `title`, `steps[]` |

- `steps[]`: `{ number, title, desc }`

### 图片展示

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `image-grid` | 多图网格（带标题） | `title`, `images[]` |

- `images[]`: `{ path, caption? }`
- `columns`: 2 或 3（默认 3）

### 引用与收束

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `quote` | 带来源的引用 | `text`, `source` |
| `minimal-quote` | 大字号引用，大量留白 | `text`, `source` |

> 幻灯片 JSON 内容示例 (JSON Content Examples)位于 `references/CONTENT_EXAMPLES.md` 文档。

---

## 输出格式：`presentation.json`

### `settings`

| 字段 | 类型 | 必需 | 说明 |
|:---|:---|:---|:---|
| `title` | string | 是 | 演示文稿标题（元数据） |
| `author` | string | 是 | 作者名（元数据） |
| `theme` | string | 是 | 主题 ID（见下方"可用主题"） |
| `layout` | string | 否 | 默认 `LAYOUT_16x9`。可选：`LAYOUT_16x10`、`LAYOUT_4x3`、`LAYOUT_WIDE` |
| `safetyMode` | boolean | 否 | 默认 `true`。启用投影安全检查（对比度、字号等） |

### `slides`

`slides` 是数组，每个元素包含 `type` 和 `data` 两个字段。`data` 的结构由 `type` 决定（见上方"幻灯片类型速查"）。
幻灯片 JSON 内容示例位于 `references/CONTENT_EXAMPLES.md` 文档。

---

## 构建与验证

```bash
# 验证 JSON
node ./scripts/validate-presentation.js ./presentation.json

# 构建 PPTX
node ./scripts/build-from-json.js ./presentation.json <输出文件名>.pptx
```

验证脚本自动检查：❌ 为错误必须修复，⚠️ 为建议酌情处理。

---

## Troubleshooting

| 问题 | 原因 | 解决 |
|:---|:---|:---|
| JSON 解析失败 | 字符串内未转义的双引号 | 用单引号替代：`{"text": "Use 'single quotes' inside."}` |
| 图片未显示 | 路径错误或文件不存在 | 使用绝对路径；缺失时 builder 自动渲染占位框 |
| 主题未找到 | `settings.theme` ID 与主题文件 ID 不匹配 | 检查 `references/themes/` 下的文件 ID |
| 图表渲染为占位符 | `data` 或 `labels` 结构错误 | 运行 validator 检查结构 |
| 文本框内容溢出 | 文字过多超出幻灯片边界 | 精简文字或拆分页面 |
| 字体显示异常 | 系统缺少指定字体 | 主题中 `fontFace` 使用常见字体（Arial, Georgia, 微软雅黑等） |
| 验证通过但构建报错 | JSON 中引用了不存在的字段 | 检查 `data` 对象是否包含 slide type 不支持的字段 |
| 幻灯片数量不符预期 | `slides` 数组长度与生成页数不一致 | 运行 `unzip -l output.pptx \| grep -c slide` 确认实际页数 |
