# PPTX Creator API Documentation

The `pptx-creator` is a skill designed to generate modern, well-structured PowerPoint presentations (`.pptx` files) from a simple JSON data file. This document serves as the API reference for creating the input JSON structure, which defines the content and layout of your presentation.

## Overview

The core of the `pptx-creator` is its input format: a `presentation.json` file. This file acts as the "script" for your presentation, specifying slides, their content, and visual themes. The system processes this JSON to build a professional-looking `.pptx` file.

## Getting Started

The general workflow is as follows:

1.  **Define your presentation content** in a `presentation.json` file according to the schema described below.
2.  **Validate** your `presentation.json` using the provided validation script.
3.  **Build** your `.pptx` file using the build script.

## `presentation.json` Structure

The `presentation.json` file is a single JSON object with two top-level fields: `settings` and `slides`.

```json
{
  "settings": {
    // ... presentation settings ...
  },
  "slides": [
    // ... array of slide objects ...
  ]
}
```

### `settings` Object

The `settings` object defines global properties for your presentation.

| Field      | Type    | Required | Description                                                                   |
| :--------- | :------ | :------- | :---------------------------------------------------------------------------- |
| `title`    | `string` | Yes      | The title of the presentation (used as metadata).                             |
| `author`   | `string` | Yes      | The author's name (used as metadata).                                         |
| `theme`    | `string` | Yes      | The ID of the theme to use for the presentation. See [Available Themes](#available-themes). |
| `layout`   | `string` | No       | Specifies the slide layout. Default: `"LAYOUT_16x9"`. Other options: `"LAYOUT_16x10"`, `"LAYOUT_4x3"`, `"LAYOUT_WIDE"`. |
| `safetyMode`| `boolean`| No       | Enables projection safety checks (contrast, font size). Default: `true`.      |

### `slides` Array

The `slides` array contains a list of slide objects. Each slide object must have a `type` field and a `data` object, whose structure depends on the `type`.

```json
[
  {
    "type": "hero-cover",
    "data": {
      "title": "Your Presentation Title",
      "subtitle": "A Catchy Subtitle"
    }
  },
  {
    "type": "content",
    "data": {
      "title": "Key Concepts",
      "bullets": [
        "First key point",
        "Second key point",
        "Third key point"
      ]
    }
  }
  // ... more slides ...
]
```

## Slide Types Reference

Below is a detailed reference for each available slide type and its corresponding `data` structure. Many text fields support inline Markdown (e.g., `**bold**`, `*italic*`, `` `inline code` ``).

### `hero-cover`

*   **Purpose**: An opening cover slide with high visual impact.
*   **Required Fields in `data`**:
    *   `title`: `string` - The main title of the presentation.
*   **Optional Fields in `data`**:
    *   `subtitle`: `string` - A secondary subtitle or tagline.

```json
{
  "type": "hero-cover",
  "data": {
    "title": "Innovating the Future of AI",
    "subtitle": "A Deep Dive into Machine Learning Advancements"
  }
}
```

### `section-divider`

*   **Purpose**: A simple slide to mark the beginning of a new section or chapter in your presentation.
*   **Required Fields in `data`**:
    *   `title`: `string` - The title of the section.

```json
{
  "type": "section-divider",
  "data": {
    "title": "Phase Two: Implementation Strategy"
  }
}
```

### `title`

*   **Purpose**: A standard title slide, often used for internal sections or simple topic introductions.
*   **Required Fields in `data`**:
    *   `title`: `string` - The main title for the slide.
*   **Optional Fields in `data`**:
    *   `subtitle`: `string` - A secondary subtitle.

```json
{
  "type": "title",
  "data": {
    "title": "Project Alpha Overview",
    "subtitle": "Understanding Our Goals"
  }
}
```

### `content`

*   **Purpose**: Displays a title with a list of bullet points.
*   **Required Fields in `data`**:
    *   `title`: `string` - The title of the content slide.
    *   `bullets`: `array<string>` - An array of strings, each representing a bullet point.
*   **Optional Fields in `data`**:
    *   `layout`: `string` - Specifies a layout variant. `"dense"` uses a smaller font size for body text; `"standard"` (default) uses the regular body font size.

```json
{
  "type": "content",
  "data": {
    "title": "Our Research Methodology",
    "bullets": [
      "Conducted extensive literature review",
      "Performed qualitative interviews with stakeholders",
      "Analyzed data using *advanced statistical models*",
      "Validated findings through peer review"
    ],
    "layout": "standard"
  }
}
```

### `two-column`

*   **Purpose**: A flexible slide type that divides content into two columns, supporting text (bullets), or images.
*   **Required Fields in `data`**:
    *   `title`: `string` - The main title of the slide.
    *   `left`: `object` - Content for the left column.
    *   `right`: `object` - Content for the right column.
*   **Optional Fields in `data`**:
    *   `layout`: `string` - Defines column width distribution. `"equal"` (default), `"text-dominant"` (left column wider), `"image-dominant"` (right column wider).
*   **`left` / `right` Object Structure**: Each column object can contain:
    *   `title`: `string` (optional) - A specific title for the column.
    *   `bullets`: `array<string>` (optional) - An array of bullet points for the column.
    *   `text`: `string` (optional) - A block of plain text for the column.
    *   `image`: `string` (optional) - An absolute path to an image file. If the file is not found, a placeholder will be rendered.

```json
{
  "type": "two-column",
  "data": {
    "title": "Market Trends vs. Our Product",
    "layout": "equal",
    "left": {
      "title": "Market Trends",
      "bullets": [
        "Increasing demand for `cloud-native` solutions",
        "*Shift* towards subscription models",
        "Emphasis on data privacy"
      ]
    },
    "right": {
      "title": "Our Solution",
      "image": "/home/user/images/product_dashboard.png"
    }
  }
}
```

### `quote`

*   **Purpose**: Displays a prominent quote with an optional source.
*   **Required Fields in `data`**:
    *   `text`: `string` - The quote text.
*   **Optional Fields in `data`**:
    *   `source`: `string` - The source of the quote.

```json
{
  "type": "quote",
  "data": {
    "text": "The only way to do great work is to love what you do.",
    "source": "Steve Jobs"
  }
}
```

### `big-number-grid`

*   **Purpose**: Presents key metrics or statistical data in a grid format.
*   **Required Fields in `data`**:
    *   `title`: `string` - The main title of the slide.
    *   `stats`: `array<object>` - An array of statistic objects.
*   **Optional Fields in `data`**:
    *   `kicker`: `string` - A small, attention-grabbing phrase above the title.
    *   `footer`: `string` - Additional information displayed at the bottom.
*   **`stats` Object Structure**: Each stat object can contain:
    *   `label`: `string` - A descriptive label for the number.
    *   `number`: `string` - The main numerical value.
    *   `unit`: `string` (optional) - A unit for the number (e.g., "M", "%", "USD").
    *   `note`: `string` (optional) - A small explanatory note below the number.

```json
{
  "type": "big-number-grid",
  "data": {
    "kicker": "Quarterly Performance",
    "title": "Growth Milestones Achieved",
    "stats": [
      { "label": "Revenue", "number": "1.2", "unit": "B" },
      { "label": "Users Acquired", "number": "500", "unit": "K", "note": "Target: 400K" },
      { "label": "Market Share", "number": "15", "unit": "%" }
    ],
    "footer": "_Data as of Q1 2024_"
  }
}
```

### `comparison`

*   **Purpose**: Provides a side-by-side comparison of two sets of items (e.g., Before/After).
*   **Required Fields in `data`**:
    *   `title`: `string` - The main title for the comparison.
    *   `left`: `object` - Defines the content for the left side.
    *   `right`: `object` - Defines the content for the right side.
*   **`left` / `right` Object Structure**: Each side object can contain:
    *   `label`: `string` (optional) - A label for this side (e.g., "Before", "Option A").
    *   `items`: `array<string>` - A list of bullet points for this side.

```json
{
  "type": "comparison",
  "data": {
    "title": "System Performance: Old vs. New",
    "left": {
      "label": "Old System",
      "items": [
        "High latency: *200ms*",
        "Frequent downtimes",
        "Limited scalability"
      ]
    },
    "right": {
      "label": "New System",
      "items": [
        "Low latency: `50ms`",
        "99.9% uptime",
        "Horizontal scalability"
      ]
    }
  }
}
```

### `pipeline`

*   **Purpose**: Illustrates a numbered process or workflow with sequential steps.
*   **Required Fields in `data`**:
    *   `title`: `string` - The main title of the pipeline.
    *   `steps`: `array<object>` - An array of step objects.
*   **`steps` Object Structure**: Each step object can contain:
    *   `number`: `string` | `number` - The step number or identifier.
    *   `title`: `string` - A concise title for the step.
    *   `desc`: `string` (optional) - A brief description of the step.

```json
{
  "type": "pipeline",
  "data": {
    "title": "Our Product Development Process",
    "steps": [
      { "number": 1, "title": "Concept & Ideation", "desc": "Brainstorming and initial concept validation." },
      { "number": 2, "title": "Design & Prototyping", "desc": "Wireframing, mockups, and interactive prototypes." },
      { "number": 3, "title": "Development", "desc": "Coding, testing, and integration." },
      { "number": 4, "title": "Deployment", "desc": "Release to production environment." },
      { "number": 5, "title": "Feedback & Iteration", "desc": "Collecting user feedback and planning next steps." }
    ]
  }
}
```

### `image-grid`

*   **Purpose**: Displays multiple images in a grid layout, with optional captions.
*   **Required Fields in `data`**:
    *   `title`: `string` - The main title of the slide.
    *   `images`: `array<object>` - An array of image objects.
*   **Optional Fields in `data`**:
    *   `columns`: `number` - Number of columns in the grid. Default: `3`.
    *   `kicker`: `string` - A small phrase above the title.
*   **`images` Object Structure**: Each image object can contain:
    *   `path`: `string` - An absolute path to the image file. A placeholder is shown if not found.
    *   `caption`: `string` (optional) - A short caption for the image.
    *   `aspectRatio`: `string` (optional) - Aspect ratio for the image: `"16:9"`, `"4:3"` (default), `"1:1"`.
    *   `sizingMode`: `string` (optional) - How the image fits: `"cover"` (default, image fills space, might crop), `"contain"` (image fits within space, might leave gaps).

```json
{
  "type": "image-grid",
  "data": {
    "kicker": "Design Portfolio",
    "title": "Recent UI/UX Projects",
    "columns": 2,
    "images": [
      { "path": "/home/user/images/project_a.png", "caption": "Project A Dashboard", "aspectRatio": "16:9" },
      { "path": "/home/user/images/project_b.png", "caption": "Mobile App Flow", "aspectRatio": "1:1" }
    ]
  }
}
```

### `minimal-quote`

*   **Purpose**: Displays a large, impactful quote with significant whitespace, ideal for closing slides or emphasizing a key message.
*   **Required Fields in `data`**:
    *   `text`: `string` - The quote text.
*   **Optional Fields in `data`**:
    *   `source`: `string` - The source of the quote.

```json
{
  "type": "minimal-quote",
  "data": {
    "text": "Innovation distinguishes between a leader and a follower.",
    "source": "Steve Jobs"
  }
}
```

### `chart`

*   **Purpose**: Integrates various chart types (bar, line, pie, etc.) directly into a slide for data visualization.
*   **Required Fields in `data`**:
    *   `title`: `string` - The title of the chart slide.
    *   `type`: `string` - The type of chart (e.g., `"bar"`, `"line"`, `"pie"`, `"doughnut"`). These values should correspond to `pptxgenjs` chart enums.
    *   `data`: `array<object>` - An array of series data for the chart.
    *   `labels`: `array<string>` - Labels for the chart's categories (e.g., months, product names).
*   **Optional Fields in `data`**:
    *   `options`: `object` - An object containing additional `pptxgenjs` chart options for fine-tuning appearance and behavior.
*   **`data` Object Structure**: Each series object can contain:
    *   `name`: `string` - The name of the data series.
    *   `values`: `array<number>` - An array of numerical values for the series.

```json
{
  "type": "chart",
  "data": {
    "title": "Quarterly Sales Performance",
    "type": "bar",
    "labels": ["Jan", "Feb", "Mar", "Apr"],
    "data": [
      { "name": "Region A", "values": [10, 12, 8, 15] },
      { "name": "Region B", "values": [7, 9, 11, 10] }
    ],
    "options": {
      "barDir": "col",
      "dataLabelColor": "FFFFFF",
      "dataLabelPos": "outEnd",
      "chartColors": ["#FF0000", "#00FF00"]
    }
  }
}
```

## Available Themes

Themes control the visual styling of your presentation (colors, fonts, spacing). You must specify a `theme` ID in your `settings` object.

| ID                | Label       | Mood                     | Recommended Scenario                  |
| :---------------- | :---------- | :----------------------- | :------------------------------------ |
| `ink-classic`     | 🖋️ 墨水经典 | Monocle / A Book Apart 杂志风 | General / Default (Safe choice)       |
| `indigo-porcelain`| 🌊 靛蓝瓷   | 学术期刊 / 蓝印花瓷器    | AI / Tech / Research / Product Launch |
| `forest-ink`      | 🌿 森林墨   | 旧版《国家地理》         | Content / Industry Insights / Culture |
| `kraft-paper`     | 🍂 牛皮纸   | 老笔记本 / 独立杂志      | Book Reviews / Lifestyle / Humanities |
| `dune`            | 🌙 沙丘     | 沙漠黄昏 / 建筑设计图册  | Design / Art / Brand                  |
| `midnight`        | 🌑 午夜     | IDE dark mode / GitHub dark | Tech Talks / Open Source / Coding     |
| `corporate-clean` | 🏢 企标     | Fortune 500 商务         | Formal Corporate / Business Proposals |
| `navy-executive`  | 🔷 深蓝企标 | 深蓝渐变封面 / 企业级技术演示 | Corporate / Tech Reports / Biz Pres.  |

## Markdown Support

Many text fields within the `data` object (e.g., `title`, `bullets`, `text`, `caption`, `label`, `note`) support inline Markdown for basic formatting:

*   **Bold text**: `**your text**` or `__your text__`
*   *Italic text*: `*your text*` or `_your text_`
*   `Inline code`: `` `your code` ``
*   ~~Strikethrough~~: `~~your text~~` (Note: `pptxgenjs` might not fully support this visually depending on the theme/font)
*   [Links](https://example.com): `[Link Text](URL)` (Links will be rendered with underline and standard blue color).

## Validation and Building

### 1. Validate your `presentation.json`

Before building, it is highly recommended to validate your JSON to catch errors and warnings early.

```bash
node ./scripts/validate-presentation.js <your_presentation_file.json>
```

This script checks for:
*   Correct JSON format and required fields.
*   Existence and validity of the selected theme.
*   Correct slide types and data structures.
*   Projection safety (minimum font size, color contrast).
*   Content density and narrative pacing.
*   Filler phrases and title semantics.
*   Image path existence.

### 2. Build your `.pptx` file

Once your `presentation.json` is valid, use the build script to generate the final PowerPoint file.

```bash
node ./scripts/build-from-json.js <your_presentation_file.json> [output_filename.pptx]
```

*   `<your_presentation_file.json>`: The path to your input JSON file.
*   `[output_filename.pptx]`: Optional. The desired name for the output `.pptx` file. If omitted, it defaults to `presentation.pptx`.
