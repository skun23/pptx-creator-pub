const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

/**
 * big-number-grid — Data poster with stat cards in a grid.
 */
function createBigNumberGridSlide(pres, slideData, theme, slideNumber) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });
    slide.background = { color: theme.colors.accent2 };

    // Kicker
    if (slideData.kicker) {
        const kickerOpts = applyTypography("kicker", theme);
        const kickerRuns = mdToTextRuns(slideData.kicker, {
            ...kickerOpts,
            color: theme.colors.primary,
            opacity: 0.6,
        });
        slide.addText(kickerRuns, {
            x: 0.5, y: 0.3, w: 9, h: 0.4,
        });
    }

    // Title
    const titleRuns = mdToTextRuns(slideData.title, {
        ...applyTypography("heading", theme),
        color: theme.colors.primary,
    });
    slide.addText(titleRuns, {
        x: 0.5, y: 0.7, w: 9, h: 0.8,
    });

    const stats = slideData.stats || [];
    const rowCount = Math.ceil(stats.length / 3);
    const cardHeight = 1.2;
    const startY = 1.7;

    stats.forEach((stat, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 0.8 + col * 3.0;
        const y = startY + row * (cardHeight + 0.2);

        // Card container with top border
        slide.addShape("rect", {
            x: x, y: y, w: 2.5, h: cardHeight,
            fill: { type: "none" },
            borderSize: 0,
        });
        // Top divider line
        slide.addShape("line", {
            x1: x, y1: y, x2: x + 2.5, y2: y,
            borderColor: theme.colors.accent1,
            borderSize: 1, borderAlpha: 0.3,
        });

        // Label (monospace, small)
        const labelRuns = mdToTextRuns(stat.label, {
            ...applyTypography("meta", theme),
            color: theme.colors.text,
            opacity: 0.55,
        });
        slide.addText(labelRuns, {
            x: x, y: y + 0.05, w: 2.5, h: 0.35,
        });

        // Number (big serif)
        const numberText = stat.number + (stat.unit ? " " + stat.unit : "");
        slide.addText(numberText, {
            x: x, y: y + 0.38, w: 2.5, h: 0.6,
            ...applyTypography("heading", theme),
            fontSize: 36, // Override heading size for big number
            color: theme.colors.primary,
            align: "left"
        });

        // Note (small sans-serif)
        if (stat.note) {
            const metaOpts = applyTypography("meta", theme);
            const noteRuns = mdToTextRuns(stat.note, {
                ...metaOpts,
                fontSize: metaOpts.fontSize + 2,
                color: theme.colors.text,
                opacity: 0.7,
            });
            slide.addText(noteRuns, {
                x: x, y: y + 1.0, w: 2.5, h: 0.3,
            });
        }
    });

    // Footer: project info
    if (slideData.footer) {
        const footerRuns = mdToTextRuns(slideData.footer, {
            ...applyTypography("meta", theme),
            color: theme.colors.text,
            opacity: 0.6,
        });
        slide.addText(footerRuns, {
            x: 0.5, y: 6.5, w: 5, h: 0.35,
        });
    }
}

module.exports = createBigNumberGridSlide;
