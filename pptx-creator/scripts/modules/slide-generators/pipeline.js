const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

/**
 * pipeline — Process / workflow display.
 */
function createPipelineSlide(pres, slideData, theme, slideNumber) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });

    const titleRuns = mdToTextRuns(slideData.title, {
        ...applyTypography("heading", theme),
        color: theme.colors.primary,
    });
    slide.addText(titleRuns, {
        x: 0.5, y: 0.25, w: 9, h: 0.75,
    });

    const steps = slideData.steps || [];
    const stepsPerRow = 5;
    const stepWidth = 1.65;
    const stepGap = 0.3;
    const startX = 0.5;
    const startY = 1.2;
    const stepHeight = 1.8;

    steps.forEach((step, i) => {
        const col = i % stepsPerRow;
        const row = Math.floor(i / stepsPerRow);
        const x = startX + col * (stepWidth + stepGap);
        const y = startY + row * (stepHeight + 0.5);

        // Step container
        slide.addShape("line", {
            x1: x, y1: y, x2: x, y2: y + stepHeight,
            borderColor: theme.colors.accent1,
            borderSize: 1, borderAlpha: 0.3,
        });

        // Step number (top)
        const metaOpts = applyTypography("meta", theme);
        slide.addText(step.number, {
            ...metaOpts,
            x: x, y: y + 0.05, w: stepWidth, h: 0.3,
            color: theme.colors.primary,
            italic: true,
            align: "center",
            opacity: 0.5,
        });

        // Step title
        const titleRuns = mdToTextRuns(step.title, {
            fontFace: "Arial",
            fontSize: 18,
            bold: true,
            color: theme.colors.primary,
            align: "center",
        });
        const titleText = {
            text: titleRuns.map(r => r.text).join(''),
            options: {
                ...titleRuns[0]?.options || {},
                fontFace: "Arial",
                fontSize: 18,
                bold: true,
                color: theme.colors.primary,
                align: "center",
                paraSpaceAfter: 8,
                breakLine: true,
            },
        };

        // Step description
        const descRuns = mdToTextRuns(step.desc || "", {
            fontFace: "Arial",
            fontSize: 16,
            color: theme.colors.text,
            align: "center",
            opacity: 0.78,
        });
        const descText = {
            text: descRuns.map(r => r.text).join(''),
            options: {
                ...descRuns[0]?.options || {},
                fontFace: "Arial",
                fontSize: 16,
                color: theme.colors.text,
                align: "center",
                opacity: 0.78,
            },
        };

        slide.addText([titleText, descText], {
            x: x,
            y: y + 0.35,
            w: stepWidth,
            h: stepHeight - 0.4, // Use remaining height
            valign: 'top',
        });
    });
}

module.exports = createPipelineSlide;
