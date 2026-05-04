const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

/**
 * minimal-quote — Large quote with lots of whitespace.
 */
function createMinimalQuoteSlide(pres, slideData, theme) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });
    slide.background = { color: theme.colors.accent2 };

    const quoteText = slideData.text;
    const leadOpts = applyTypography("heading", theme);
    const sourceOpts = applyTypography("subheading", theme);

    // Calculate fontSize based on text length (longer text = smaller font)
    const baseLeadSize = leadOpts.fontSize;
    let quoteFontSize = baseLeadSize;
    if (quoteText.length > 150) quoteFontSize = baseLeadSize * 0.7;
    else if (quoteText.length > 80) quoteFontSize = baseLeadSize * 0.85;
    quoteFontSize = Math.max(quoteFontSize, theme.typography.minBodyFontSize || 24);

    const quoteRuns = mdToTextRuns(quoteText, {
        ...leadOpts,
        fontSize: quoteFontSize,
        color: theme.colors.primary,
        italic: true,
    });
    const textObjects = [
        {
            text: quoteRuns.map(r => r.text).join(''),
            options: {
                ...quoteRuns[0]?.options || leadOpts,
                fontSize: quoteFontSize,
                color: theme.colors.primary,
                italic: true,
                breakLine: true,
                align: "center",
            },
        },
    ];

    if (slideData.source) {
        const sourceRuns = mdToTextRuns("— " + slideData.source, {
            ...sourceOpts,
            color: theme.colors.primary,
            italic: true,
            opacity: 0.7,
        });
        textObjects.push({
            text: sourceRuns.map(r => r.text).join(''),
            options: {
                ...sourceRuns[0]?.options || sourceOpts,
                color: theme.colors.primary,
                italic: true,
                opacity: 0.7,
                align: "right",
            },
        });
    }

    slide.addText(textObjects, {
        x: 1.0,
        y: 0,
        w: 8,
        h: "100%",
        align: "left", // Default alignment for the container box, so individual alignments can take precedence
        valign: "middle",
        lineSpacingMultiple: theme.spacing.lineHeight || 1.4,
    });
}

module.exports = createMinimalQuoteSlide;