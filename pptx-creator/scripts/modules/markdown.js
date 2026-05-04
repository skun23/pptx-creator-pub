/**
 * markdown.js — Remark-based Markdown to pptxgenjs text runs converter.
 *
 * Parses inline Markdown (bold, italic, inline code, links) from a string
 * and returns an array of { text, options } objects suitable for
 * pptxgenjs slide.addText().
 *
 * Uses the `remark` library (unified ecosystem) for robust parsing.
 */

const { remark } = require('remark');

const parser = remark();

/**
 * Convert a Markdown string into pptxgenjs text run objects.
 *
 * @param {string} md - The Markdown string to parse (inline only).
 * @param {object} baseOpts - Base pptxgenjs text options (fontSize, fontFace, color, etc.).
 * @returns {Array<{text: string, options: object}>} Array of text run objects.
 */
function mdToTextRuns(md, baseOpts = {}) {
  if (!md || typeof md !== 'string') {
    return [{ text: String(md ?? ''), options: { ...baseOpts } }];
  }

  const mdast = parser.parse(md);

  // We only care about the first paragraph's children (inline content).
  // If the root has no paragraph children, return the raw string.
  const paragraph = mdast.children.find((c) => c.type === 'paragraph');
  if (!paragraph) {
    return [{ text: md, options: { ...baseOpts } }];
  }

  return paragraph.children.flatMap((node) => convertMdastNode(node, baseOpts));
}

/**
 * Recursively convert an mdast inline node to pptxgenjs text runs.
 */
function convertMdastNode(node, baseOpts) {
  switch (node.type) {
    case 'text':
      return [{ text: node.value, options: { ...baseOpts } }];

    case 'strong':
      return node.children.flatMap((child) =>
        convertMdastNode(child, { ...baseOpts, bold: true })
      );

    case 'emphasis':
      return node.children.flatMap((child) =>
        convertMdastNode(child, { ...baseOpts, italic: true })
      );

    case 'inlineCode':
      return [
        {
          text: node.value,
          options: {
            ...baseOpts,
            fontFace: 'Courier New',
          },
        },
      ];

    case 'link': {
      const linkText = node.children.map((c) => c.value).join('');
      return [
        {
          text: linkText,
          options: {
            ...baseOpts,
            underline: true,
            color: '0563C1', // Standard link blue
          },
        },
      ];
    }

    case 'delete':
      return node.children.flatMap((child) =>
        convertMdastNode(child, { ...baseOpts, strike: true })
      );

    default:
      // Fallback: collect all text from descendants
      return [
        {
          text: collectText(node),
          options: { ...baseOpts },
        },
      ];
  }
}

/**
 * Collect all text values from an mdast node tree.
 */
function collectText(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(collectText).join('');
  return '';
}

module.exports = { mdToTextRuns };