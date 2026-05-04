const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

function createHeroCoverSlide(pres, slideData, theme) {
  const slide = pres.addSlide();
  // Use primary color for background for a high-impact hero slide
  slide.background = { color: theme.colors.primary };
  // Use background color for text for contrast
  const textColor = theme.colors.background;

  // Kicker
  const kickerRuns = mdToTextRuns("PRESENTATION", {
    ...applyTypography("kicker", theme),
    color: textColor,
    align: "left",
    opacity: 0.7,
  });
  slide.addText(kickerRuns, {
    x: 0.5, y: 0.5, w: 9, h: 0.4,
  });

  // Main title
  const headingOpts = applyTypography("heading", theme);
  const titleRuns = mdToTextRuns(slideData.title, {
    ...headingOpts,
    fontSize: headingOpts.fontSize * 1.5,
    color: textColor,
  });
  slide.addText(titleRuns, {
    x: 0.5, y: 2.2, w: 9, h: 1.5,
    align: "center"
  });

  if (slideData.subtitle) {
    const subRuns = mdToTextRuns(slideData.subtitle, {
      ...applyTypography("subheading", theme),
      color: textColor,
      italic: true,
      opacity: 0.85,
    });
    slide.addText(subRuns, {
      x: 0.5, y: 3.8, w: 9, h: 1,
      align: "center",
    });
  }
}

module.exports = createHeroCoverSlide;
