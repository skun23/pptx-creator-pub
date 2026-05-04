const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

/**
 * comparison — A vs B side-by-side comparison.
 */
function createComparisonSlide(pres, slideData, theme, slideNumber) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });

    const titleRuns = mdToTextRuns(slideData.title, {
        ...applyTypography("heading", theme),
        color: theme.colors.primary,
    });
    slide.addText(titleRuns, {
        x: 0.5, y: 0.25, w: 9, h: 0.75,
    });

    const left = slideData.left || {};
    const right = slideData.right || {};

    // Draw vertical divider
    slide.addShape("line", {
        x1: 4.8, y1: 1.1, x2: 4.8, y2: 6.5,
        borderColor: theme.colors.accent1,
        borderSize: 1, borderAlpha: 0.2,
    });

    // Left column (weakened)
    const processSide = (sideData, x_pos, width, alpha) => {
        let y_pos = 1.1;
        if (sideData.label) {
            const labelRuns = mdToTextRuns(sideData.label, {
                ...applyTypography("kicker", theme),
                color: theme.colors.text,
                opacity: alpha * 0.9,
            });
            slide.addText(labelRuns, {
                x: x_pos, y: y_pos, w: width, h: 0.35,
            });
            y_pos += 0.5;
        }
        if (sideData.items && sideData.items.length > 0) {
            const bodyOpts = applyTypography("body", theme);
            const lineHeight = theme.spacing.lineHeight || 1.4;
            
            const textObjects = sideData.items.flatMap((item, idx) => {
              const runs = mdToTextRuns(item, {
                fontSize: bodyOpts.fontSize,
                fontFace: bodyOpts.fontFace,
                color: theme.colors.text,
                lineSpacingMultiple: lineHeight,
                bullet: false,
              });
              if (idx < sideData.items.length - 1 && runs.length > 0) {
                runs[runs.length - 1].options = {
                  ...runs[runs.length - 1].options,
                  breakLine: true,
                };
              }
              return runs;
            });

            const charsPerLine = 30; // Narrower column
            const singleLineH = (bodyOpts.fontSize * lineHeight) / 72;
            const totalLines = sideData.items.reduce((sum, txt) => {
                return sum + Math.max(1, Math.ceil(String(txt).length / charsPerLine));
            }, 0);
            const totalHeight = totalLines * singleLineH + 0.2;

            slide.addText(textObjects, {
                x: x_pos,
                y: y_pos,
                w: width,
                h: totalHeight,
                valign: "top",
                lineSpacingMultiple: lineHeight,
                paraSpaceAfter: 4,
            });
        }
    };

    // Left column with left border accent
    slide.addShape("line", {
        x1: 0.5, y1: 1.5, x2: 0.5, y2: 6.0,
        borderColor: theme.colors.primary,
        borderSize: 2, borderAlpha: 0.3,
    });
    processSide(left, 0.7, 4.0, 0.55);

    // Right column (full brightness)
    slide.addShape("line", {
        x1: 5.0, y1: 1.5, x2: 5.0, y2: 6.0,
        borderColor: theme.colors.primary,
        borderSize: 2, borderAlpha: 0.6,
    });
    processSide(right, 5.2, 4.3, 1.0);
}

module.exports = createComparisonSlide;
