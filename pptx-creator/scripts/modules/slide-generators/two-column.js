const fs = require('fs');
const path = require('path');
const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

/**
 * Creates a two-column content slide. Supports layout variants.
 */
function createTwoColumnSlide(pres, slideData, theme, slideNumber) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });

    const spacing = theme.spacing || { groupInner: 0.25, groupOuter: 0.6, lineHeight: 1.4 };

    const titleRuns = mdToTextRuns(slideData.title, {
        ...applyTypography("heading", theme),
        color: theme.colors.primary,
    });
    slide.addText(titleRuns, {
        x: 0.5, y: 0.25, w: 9, h: 0.75,
    });

    const layout = slideData.layout || "equal";
    const colWidth = layout === "text-dominant" ? 6.0 : layout === "image-dominant" ? 2.5 : 4.5;
    const leftX = 0.5;
    const rightX = layout === "text-dominant" ? 6.7 : layout === "image-dominant" ? 3.2 : 5.0;

    const processColumn = (columnData, x_pos) => {
        if (!columnData) return;
        let y_pos = 0.25 + 0.75 + spacing.groupOuter; // title bottom + groupOuter gap
        if (columnData.title) {
            const colTitleRuns = mdToTextRuns(columnData.title, {
                ...applyTypography("subheading", theme),
                color: theme.colors.text,
            });
            slide.addText(colTitleRuns, {
                x: x_pos, y: y_pos, w: colWidth, h: 0.5,
            });
            y_pos += 0.5 + spacing.groupInner; // column title to content: small gap
        }
        const contentTypes = [columnData.bullets, columnData.text, columnData.image].filter(Boolean);
        if (contentTypes.length > 1) {
            console.warn("Column has multiple content types (bullets/text/image). Using bullets only.");
        }
        if (columnData.bullets && columnData.bullets.length > 0) {
            const bulletOpts = applyTypography("body", theme);
            const lineHeight = theme.spacing.lineHeight || 1.4;

            const textObjects = columnData.bullets.flatMap((point, idx) => {
              const runs = mdToTextRuns(point, {
                fontSize: bulletOpts.fontSize,
                fontFace: bulletOpts.fontFace,
                color: theme.colors.text,
                lineSpacingMultiple: lineHeight,
                bullet: false,
              });
              if (idx < columnData.bullets.length - 1 && runs.length > 0) {
                runs[runs.length - 1].options = {
                  ...runs[runs.length - 1].options,
                  breakLine: true,
                };
              }
              return runs;
            });

            // Estimate total height based on number of lines
            const charsPerLine = 30; // Estimate for a narrower column
            const singleLineH = (bulletOpts.fontSize * lineHeight) / 72;
            const totalLines = columnData.bullets.reduce((sum, txt) => {
                return sum + Math.max(1, Math.ceil(String(txt).length / charsPerLine));
            }, 0);
            const totalHeight = totalLines * singleLineH + 0.2; // Padding

            slide.addText(textObjects, {
                x: x_pos,
                y: y_pos,
                w: colWidth,
                h: totalHeight,
                valign: "top",
                lineSpacingMultiple: lineHeight,
                paraSpaceAfter: 4,
            });
        } else if (columnData.text) {
            const bodyOpts = applyTypography("body", theme);
            const textLines = Array.isArray(columnData.text) ? columnData.text : [columnData.text];
            const lineHeight = theme.spacing.lineHeight || 1.4;
            const yIncrement = (bodyOpts.fontSize * lineHeight) / 72; // Inches per line

            textLines.forEach((line, i) => {
                const runs = mdToTextRuns(line, {
                    ...bodyOpts,
                    color: theme.colors.text,
                });
                slide.addText(runs, {
                    x: x_pos,
                    y: y_pos + (i * yIncrement),
                    w: colWidth,
                    h: yIncrement,
                });
            });
        } else if (columnData.image) {
            const imagePath = path.resolve(columnData.image);
            if (!fs.existsSync(imagePath)) {
                console.warn(`Image file not found for image in two-column slide: ${columnData.image}. Showing placeholder.`);
                // Extract filename from path for display
                const imgName = columnData.image.split('/').pop() || columnData.image;
                const phY = y_pos;
                const phH = 3.5;
                const phW = colWidth;
                // Dashed border placeholder
                slide.addShape("rect", {
                    x: x_pos, y: phY, w: phW, h: phH,
                    borderSize: 1.5, borderColor: theme.colors.accent1,
                    borderAlpha: 0.5, fill: { type: "none" }
                });
                // Placeholder label: "📷 图片占位" + filename
                const metaOpts = applyTypography("meta", theme);
                slide.addText(`📷 图片占位\n${imgName}`, {
                    x: x_pos, y: phY, w: phW, h: phH,
                    fontSize: metaOpts.fontSize + 4,
                    fontFace: metaOpts.fontFace,
                    color: theme.colors.accent1,
                    align: "center", valign: "middle",
                    opacity: 0.7
                });
            } else {
                slide.addImage({ path: imagePath, x: x_pos, y: y_pos, w: colWidth, h: 3.0, sizing: { type: 'contain' } });
            }
        }
    };

    processColumn(slideData.left, leftX);
    processColumn(slideData.right, rightX);
}

module.exports = createTwoColumnSlide;
