const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

function createQuoteSlide(pres, slideData, theme, slideNumber) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });

    const quoteOpts = { ...applyTypography("heading", theme), color: theme.colors.primary, italic: true };
    const quoteRuns = mdToTextRuns(slideData.text, quoteOpts);
    slide.addText(quoteRuns, {
        x: 1.0, y: 1.5, w: 8, h: 3.0,
        align: "center",
        lineSpacing: theme.spacing.lineHeight
    });

    if (slideData.source) {
        const sourceRuns = mdToTextRuns("— " + slideData.source, {
            ...applyTypography("meta", theme),
            color: theme.colors.text,
            opacity: 0.7,
        });
        slide.addText(sourceRuns, {
            x: 1.0, y: 4.8, w: 8, h: 0.5,
            align: "right",
        });
    }
}

module.exports = createQuoteSlide;
