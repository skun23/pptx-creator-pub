const createHeroCoverSlide = require('./hero-cover');
const createSectionDividerSlide = require('./section-divider');
const createTitleSlide = require('./title');
const createContentSlide = require('./content');
const createTwoColumnSlide = require('./two-column');
const createQuoteSlide = require('./quote');
const createBigNumberGridSlide = require('./big-number-grid');
const createComparisonSlide = require('./comparison');
const createPipelineSlide = require('./pipeline');
const createImageGridSlide = require('./image-grid');
const createMinimalQuoteSlide = require('./minimal-quote');
const createChartSlide = require('./chart');
const createTableSlide = require('./table');

const slideGenerators = {
  "hero-cover": createHeroCoverSlide,
  "section-divider": createSectionDividerSlide,
  "title": createTitleSlide,
  "content": createContentSlide,
  "two-column": createTwoColumnSlide,
  "quote": createQuoteSlide,
  "big-number-grid": createBigNumberGridSlide,
  "comparison": createComparisonSlide,
  "pipeline": createPipelineSlide,
  "image-grid": createImageGridSlide,
  "minimal-quote": createMinimalQuoteSlide,
  "chart": createChartSlide,
  "table": createTableSlide,
};

module.exports = slideGenerators;
