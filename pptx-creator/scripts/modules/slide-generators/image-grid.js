const fs = require('fs');
const path = require('path');
const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

/**
 * image-grid — Multi-image grid with captions.
 * Supports per-image aspectRatio (4:3 default) and sizingMode ('cover' default).
 */
function createImageGridSlide(pres, slideData, theme, slideNumber) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });

    const spacing = theme.spacing || { groupInner: 0.25, groupOuter: 0.6, lineHeight: 1.4 };

    // Kicker
    if (slideData.kicker) {
        const kickerRuns = mdToTextRuns(slideData.kicker, {
            ...applyTypography("kicker", theme),
            color: theme.colors.primary,
            opacity: 0.6,
        });
        slide.addText(kickerRuns, {
            x: 0.5, y: 0.3, w: 9, h: 0.4,
        });
    }

    const titleRuns = mdToTextRuns(slideData.title, {
        ...applyTypography("heading", theme),
        color: theme.colors.primary,
    });
    slide.addText(titleRuns, {
        x: 0.5, y: 0.65, w: 9, h: 0.6,
    });

    const images = slideData.images || [];
    const cols = slideData.columns || 3;
    const imgWidth = 2.7;
    // Aspect ratio ratios (width:height)
    const aspectRatios = { "16:9": 16/9, "4:3": 4/3, "1:1": 1 };
    const gapX = spacing.groupOuter; // group outer gap between images
    const gapY = spacing.groupOuter; // group outer gap between rows
    const capHeight = 0.3;

    images.forEach((img, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 0.5 + col * (imgWidth + gapX);

        // Per-image aspect ratio: default 4:3 if not specified
        const ratioMap = img.aspectRatio ? aspectRatios[img.aspectRatio] : aspectRatios["4:3"];
        const imgHeight = imgWidth / ratioMap;
        const y = 1.35 + row * (imgHeight + capHeight + gapY);

        // Per-image sizing mode: default 'cover' if not specified
        const sizingMode = img.sizingMode || 'cover';

        if (!img.path || !fs.existsSync(path.resolve(img.path))) {
            // Placeholder for missing image
            const imgName = img.path ? img.path.split('/').pop() : 'unknown';
            slide.addShape("rect", {
                x: x, y: y, w: imgWidth, h: imgHeight,
                borderSize: 1.5, borderColor: theme.colors.accent1,
                borderAlpha: 0.5, fill: { type: "none" }
            });
            const metaOpts = applyTypography("meta", theme);
            slide.addText(`📷 ${imgName}`, {
                x: x, y: y, w: imgWidth, h: imgHeight,
                fontSize: metaOpts.fontSize + 2,
                fontFace: metaOpts.fontFace,
                color: theme.colors.accent1,
                align: "center", valign: "middle",
                opacity: 0.7
            });
        } else {
            // Image with per-image sizing mode
            slide.addImage({
                path: path.resolve(img.path),
                x: x, y: y, w: imgWidth, h: imgHeight,
                sizing: { type: sizingMode }
            });

            // Caption
            if (img.caption) {
                const metaOpts = applyTypography("meta", theme);
                const captionText = img.caption || "";
                const charsPerLine = 35;
                const singleLineH = (metaOpts.fontSize * 1.2) / 72;
                const totalLines = Math.max(1, Math.ceil(captionText.length / charsPerLine));
                const totalHeight = totalLines * singleLineH;

                const captionRuns = mdToTextRuns(captionText, {
                    ...metaOpts,
                    fontSize: metaOpts.fontSize - 2,
                    color: theme.colors.text,
                    opacity: 0.65,
                });
                slide.addText(captionRuns, {
                    x: x, y: y + imgHeight + 0.05, w: imgWidth, h: totalHeight,
                });
            }
        }
    });
}

module.exports = createImageGridSlide;
