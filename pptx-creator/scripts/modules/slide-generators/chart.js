const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

function createChartSlide(pres, slideData, theme, slideNumber) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });

    const titleRuns = mdToTextRuns(slideData.title, {
        ...applyTypography("heading", theme),
        color: theme.colors.primary,
    });
    slide.addText(titleRuns, {
        x: 0.5, y: 0.25, w: 9, h: 0.75,
    });

    const chartType = slideData.type;
    const chartData = slideData.data;
    const chartLabels = slideData.labels;
    const chartOptions = slideData.options || {};

    // Default chart position and size
    const x = 0.5;
    const y = 1.5;
    const w = 9;
    const h = 5;

    try {
        if (!chartType || !chartData || chartData.length === 0 || !chartLabels || chartLabels.length === 0) {
            throw new Error("Missing chart type, data, or labels.");
        }

        const pptxChartType = pres.charts[chartType.toUpperCase()]; // Assuming chartType matches pptxgenjs enum

        // Prepare chart data for pptxgenjs
        const chartSeries = chartData.map(series => ({
            name: series.name,
            labels: chartLabels,
            values: series.values,
        }));

        slide.addChart(pptxChartType, chartSeries, {
            x: x, y: y, w: w, h: h,
            ...chartOptions // Merge user-provided options
        });

    } catch (error) {
        console.warn(`⚠️ Could not generate chart on slide ${slideNumber}: ${error.message}. Showing placeholder.`);
        // Placeholder for missing/invalid chart
        const metaOpts = applyTypography("meta", theme);
        slide.addText(`Chart Placeholder
Type: ${chartType || 'N/A'}
Error: ${error.message}`, {
            x: x, y: y, w: w, h: h,
            fontSize: metaOpts.fontSize + 6,
            fontFace: metaOpts.fontFace,
            color: theme.colors.text,
            align: "center", italic: true, opacity: 0.8
        });
        slide.addShape("rect", {
            x: x, y: y, w: w, h: h,
            borderSize: 1, borderColor: theme.colors.accent1,
            borderAlpha: 0.4, fill: { type: "none" }
        });
    }
}

module.exports = createChartSlide;