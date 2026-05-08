# 幻灯片 JSON 内容示例 (JSON Content Examples)

以下是各类幻灯片的 `data` 对象的内容示例。每个代码块代表一个独立的幻灯片对象，应被包含在顶层 `slides` 数组中。

## 封面与分隔 (Covers & Dividers)

**`hero-cover`**
```json
{
  "type": "hero-cover",
  "data": {
    "title": "雨水管道系统设计",
    "subtitle": "第八章 | 给水排水管道工程"
  }
}
```

**`section-divider`**
```json
{
  "type": "section-divider",
  "data": {
    "title": "第一节：雨水管道系统组成"
  }
}
```

**`title`**
```json
{
  "type": "title",
  "data": {
    "title": "结论与展望",
    "subtitle": "感谢聆听"
  }
}
```

## 内容展示 (Content)

**`content`**
```json
{
  "type": "content",
  "data": {
    "title": "雨水管道系统由多种组件构成",
    "bullets": [
      "**雨水口**: 收集地面雨水的入口",
      "**连接管**: 连接雨水口与雨水管网",
      "**雨水管网**: 地下输水管道系统",
      "**出水口**: 将雨水排入水体或处理设施"
    ]
  }
}
```

**`two-column`** (左文右图)
```json
{
  "type": "two-column",
  "data": {
    "title": "检查井是管网维护的关键节点",
    "left": {
      "title": "主要功能",
      "bullets": [
        "**清通**: 提供管道清淤和疏通的入口",
        "**检查**: 观察管道内部状况",
        "**连接**: 连接不同方向、管径或高程的管道",
        "**通风**: 为管道系统提供通风换气"
      ]
    },
    "right": {
      "image": "/home/skun2008/制作专业的ppt/给排水管道工程/image/11_2_1_检查井_39841e69e3.jpg"
    }
  }
}
```

**`comparison`**
```json
{
  "type": "comparison",
  "data": {
    "title": "新旧设计方案对比",
    "left": {
      "label": "旧方案 (2022)",
      "items": [
        "采用传统混凝土管",
        "管网流速较低 (0.6 m/s)",
        "初期投资成本高"
      ]
    },
    "right": {
      "label": "新方案 (2024)",
      "items": [
        "采用高密度聚乙烯(HDPE)管",
        "设计流速提升 (0.9 m/s)",
        "综合成本降低15%"
      ]
    }
  }
}
```

**`table`**
```json
{
  "type": "table",
  "data": {
    "title": "工业废水平均设计流量 (表 9-1)",
    "content": "街区面积编号 | F1 | F2 | F3 | F4 | F5\n------------|----|----|----|----|----\n工业废水量(L/s) | 20 | 30 | 90 | 0  | 35"
  }
}
```

## 数据与指标 (Data & Metrics)

**`big-number-grid`**
```json
{
  "type": "big-number-grid",
  "data": {
    "title": "项目核心指标达成情况",
    "stats": [
      { "label": "设计总管长", "number": "12.5", "unit": "km" },
      { "label": "服务面积", "number": "3.5", "unit": "km²" },
      { "label": "最大设计流量", "number": "5.8", "unit": "m³/s" },
      { "label": "项目总投资", "number": "1.2", "unit": "亿元" }
    ]
  }
}
```

**`chart`**
```json
{
  "type": "chart",
  "data": {
    "title": "各分区年径流总量对比 (万 m³)",
    "type": "bar",
    "labels": ["A区", "B区", "C区", "D区"],
    "data": [
      {
        "name": "年径流总量",
        "values": [450, 620, 380, 550]
      }
    ],
    "options": {
      "showValue": true
    }
  }
}
```

## 流程与步骤 (Process & Steps)

**`pipeline`**
```json
{
  "type": "pipeline",
  "data": {
    "title": "雨水管网水力计算四步法",
    "steps": [
      { "number": "01", "title": "确定设计重现期", "desc": "根据区域重要性选择P值" },
      { "number": "02", "title": "计算设计流量", "desc": "采用推理公式 Q=ψiF" },
      { "number": "03", "title": "拟定管径和坡度", "desc": "保证流速在允许范围内" },
      { "number": "04", "title": "校核水力特性", "desc": "检查充满度和流速" }
    ]
  }
}
```

## 图片展示 (Image Display)

**`image-grid`**
```json
{
  "type": "image-grid",
  "data": {
    "title": "不同类型的雨水口",
    "columns": 3,
    "images": [
      { "path": "/home/skun2008/制作专业的ppt/给排水管道工程/image/1_雨水口的设置与种类_4ab1340cc3.jpg", "caption": "平箅式雨水口" },
      { "path": "/home/skun2008/制作专业的ppt/给排水管道工程/image/1_雨水口的设置与种类_b153c0ce69.jpg", "caption": "立式雨水口" },
      { "path": "/home/skun2008/制作专业的ppt/给排水管道工程/image/1_雨水口的设置与种类_f4bc103256.jpg", "caption": "联合式雨水口" }
    ]
  }
}
```

## 引用与收束 (Quotes & Endings)

**`quote`**
```json
{
  "type": "quote",
  "data": {
    "text": "城市排水系统是城市的良心。",
    "source": "维克多·雨果"
  }
}
```

**`minimal-quote`**
```json
{
  "type": "minimal-quote",
  "data": {
    "text": "细节决定成败。",
    "source": "一句谚语"
  }
}
```
