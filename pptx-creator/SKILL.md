---
name: pptx-creator
description: "Creates modern, well-structured PPTX presentations from a simple JSON data file. This skill uses a layout-driven approach for reliability and speed, and includes a mandatory interactive theme selection to ensure visual consistency."
---

# PPTX Creator Skill

根据用户提供的原始内容（教材章节、文章、笔记），生成 `presentation.json`，然后通过构建脚本生成 `.pptx` 文件。

---

## 工作流程

1. **定义听众与目标**: 首先提问“本次演示的主要听众是谁？您的核心目标是什么？”，根据用户的回答，从 `references/CONTENT_GUIDE.md` 的“听众-目标策略模型”中选择一个策略（如：教学、报告、说服）。**后续所有内容创作步骤都必须遵循此策略**。
2. **列出所有可用主题**: （见下方"可用主题"表），让用户选择。若用户未选择，默认使用 `navy-executive`。
3. **构思并创作幻灯片内容**: 严格遵循 `references/CONTENT_GUIDE.md` 中定义的**所选策略模型**和**内容创作工作流**，将源文档解构和创作为幻灯片序列。这包括识别叙事弧、为每张幻灯片选择合适的类型（见下方"幻灯片类型速查"表）、撰写论点式标题和关键词要点。
4. **输出 `presentation.json`**: 生成包含 `settings` 和 `slides` 数组的JSON文件。
5. **验证**: 运行 `node ./scripts/validate-presentation.js ./presentation.json`，修复所有 ❌ 错误。然后，对照 `references/checklist.md` 检查生成的幻灯片内容。
6. **构建**: 运行 `node ./scripts/build-from-json.js ./presentation.json <输出文件名>.pptx`。

---

## 必须遵守的规则

### 主题选择

- 必须列出全部 8 个主题供用户选择，不得自行决定。
- 用户未选择时，必须使用 `navy-executive`。
- `settings.theme` 全篇只设置一次，中途不得更换。

### 内容规则

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

### 数据与指标

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `big-number-grid` | 关键指标/统计数据网格 | `title`, `stats[]` |
| `chart` | 柱状/折线/饼图/环形图 | `title`, `type`, `labels[]`, `data[]` |

### 流程与步骤

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `pipeline` | 编号步骤/工作流 | `title`, `steps[]` |

### 图片展示

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `image-grid` | 多图网格（带标题） | `title`, `images[]` |

### 引用与收束

| Type | 用途 | 必需字段 |
|:---|:---|:---|
| `quote` | 带来源的引用 | `text`, `source` |
| `minimal-quote` | 大字号引用，大量留白 | `text`, `source` |

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

---

## 可用主题

| ID | 氛围 | 推荐场景 |
|:---|:---|:---|
| `ink-classic` | 🖋️ 墨水经典 — Monocle 杂志风 | 通用默认 |
| `indigo-porcelain` | 🌊 靛蓝瓷 — 学术期刊 | AI / 科技 / 研究 |
| `forest-ink` | 🌿 森林墨 — 复古国家地理 | 自然 / 文化 / 可持续 |
| `kraft-paper` | 🍂 牛皮纸 — 旧笔记本 | 人文 / 文学 |
| `dune` | 🌙 沙丘 — 沙漠暮色 | 设计 / 艺术 / 时尚 |
| `midnight` | 🌑 午夜 — IDE 深色模式 | 技术演讲 / 开源 |
| `corporate-clean` | 🏢 企标 — 财富 500 强商务风 | 正式企业汇报 |
| `navy-executive` | 🔷 深蓝企标 — 企业蓝渐变 | 技术报告 / 企业演示 |

> 主题文件位于 `references/themes/` 目录，由 builder 自动加载。

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