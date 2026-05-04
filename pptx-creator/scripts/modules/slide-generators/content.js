const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

/**
 * Creates a content slide. Supports layout variants.
 */
function createContentSlide(pres, slideData, theme, slideNumber) {
  const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });
  const layout = slideData.layout || "standard";

  // Get layout metrics from theme, with fallbacks for older themes
  const titleMetrics = theme.geometry?.title || { x: 0.5, y: 0.25, w: 9, h: 0.75 };
  const contentMetrics = theme.geometry?.content || { x: 0.5, y: 1.1, w: 9 };

  const titleRuns = mdToTextRuns(slideData.title, {
    ...applyTypography("heading", theme),
    color: theme.colors.primary,
  });
  slide.addText(titleRuns, {
    ...titleMetrics,
  });

  const bodyRole = layout === "dense" ? "bodyDense" : "body";
  const bodyOpts = applyTypography(bodyRole, theme);
  const lineHeight = theme.spacing.lineHeight || 1.4;

  if (slideData.bullets && slideData.bullets.length > 0) {
    const textObjects = slideData.bullets.flatMap((point, idx) => {
      const runs = mdToTextRuns(point, {
        fontSize: bodyOpts.fontSize,
        fontFace: bodyOpts.fontFace,
        color: theme.colors.text,
        lineSpacingMultiple: lineHeight,
        bullet: false,
      });
      // 每个 point 的最后一个 run 标记段落结束（除最后一段）
      if (idx < slideData.bullets.length - 1 && runs.length > 0) {
        runs[runs.length - 1].options = {
          ...runs[runs.length - 1].options,
          breakLine: true,
        };
      }
      return runs;
    });

    const charsPerLine = 35;
    const singleLineH = (bodyOpts.fontSize * lineHeight) / 72;
    const totalLines = slideData.bullets.reduce((sum, txt) => {
      return sum + Math.max(1, Math.ceil(String(txt).length / charsPerLine));
    }, 0);
    const totalHeight = totalLines * singleLineH + 0.2;

    slide.addText(textObjects, {
      ...contentMetrics,
      h: totalHeight, // Calculated height overrides theme
      valign: "top",
      lineSpacingMultiple: lineHeight,
      paraSpaceAfter: 4,
    });
  }
}

module.exports = createContentSlide;