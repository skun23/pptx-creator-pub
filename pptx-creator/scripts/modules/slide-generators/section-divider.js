const { applyTypography } = require('../typography');

function createSectionDividerSlide(pres, slideData, theme, slideNumber) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });
    slide.background = { color: theme.colors.accent2 };

    slide.addText(slideData.title, {
        x: 0.5, y: 0, w: 9, h: '100%',
        ...applyTypography("heading", theme),
        color: theme.colors.primary,
        align: "center",
        valign: 'middle'
    });
}

module.exports = createSectionDividerSlide;
