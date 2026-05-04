const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

function createTitleSlide(pres, slideData, theme, slideNumber) {
  const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });

  const titleMetrics = theme.geometry?.title || { x: 0.5, y: 1.5, w: 9, h: 1.5 };
  const subtitleMetrics = theme.geometry?.subtitle || { x: 0.5, y: 3.0, w: 9, h: 1 };

  const titleRuns = mdToTextRuns(slideData.title, {
    ...applyTypography("heading", theme),
    color: theme.colors.primary,
  });
  slide.addText(titleRuns, {
    ...titleMetrics,
    align: "center"
  });

  if (slideData.subtitle) {
    const subRuns = mdToTextRuns(slideData.subtitle, {
      ...applyTypography("subheading", theme),
      color: theme.colors.text,
      italic: true,
      opacity: 0.8,
    });
    slide.addText(subRuns, {
      ...subtitleMetrics,
      align: "center",
    });
  }
}

module.exports = createTitleSlide;
