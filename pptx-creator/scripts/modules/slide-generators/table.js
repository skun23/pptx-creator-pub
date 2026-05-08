const { applyTypography } = require('../typography');
const { mdToTextRuns } = require('../markdown');

/**
 * Parse a markdown table string into an array of row arrays (strings).
 * Example:
 *   "A | B\n---|---\n1 | 2"
 *   => [["A","B"],["1","2"]]
 */
function parseMarkdownTable(mdTable) {
    const lines = mdTable
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !/^[\-\s|:]+$/.test(l));

    if (lines.length === 0) return [];

    return lines.map(line =>
        line.split('|').map(c => c.trim()).filter(c => c.length > 0)
    );
}

/**
 * Detect if a cell value is numeric (for alignment).
 */
function isNumeric(val) {
    return val !== '' && !isNaN(parseFloat(val)) && isFinite(val);
}

/**
 * Creates a table slide. Parses markdown table format and renders
 * as a proper PPTX table using pptxgenjs addTable().
 *
 * JSON structure:
 *   {
 *     "title": "Slide title",
 *     "content": "Col A | Col B\n---|---\n1 | 2"
 *   }
 */
function createTableSlide(pres, slideData, theme, slideNumber) {
    const slide = pres.addSlide({ masterName: "DEFAULT_MASTER" });

    // Title
    const titleRuns = mdToTextRuns(slideData.title, {
        ...applyTypography("heading", theme),
        color: theme.colors.primary,
    });
    slide.addText(titleRuns, {
        x: 0.5, y: 0.25, w: 9, h: 0.75,
    });

    // Parse table
    const tableContent = slideData.content || '';
    const tableRows = parseMarkdownTable(tableContent);
    if (tableRows.length === 0) return;

    const headerRow = tableRows[0];
    const dataRows = tableRows.slice(1);
    const colCount = headerRow.length;
    const rowColors = ['FFFFFF', 'F2F2F2'];
    const textColor = theme.colors.text || '333333';
    const headerColor = theme.colors.primary || '0C2340';
    const borderSize = 1;

    // Layout: content area is 9.5 inches wide, margin 0.5 each side => usable 8.5
    const margin = 0.5;
    const usableWidth = 9 - margin * 2;
    const colWidth = usableWidth / colCount;
    const headerHeight = 0.45;
    const dataCellHeight = 0.35;
    const tableHeight = headerHeight + dataRows.length * dataCellHeight;

    // Build pptxgenjs table rows: TableCell[][]
    const pptxRows = [];

    // --- Header row ---
    const headerCells = headerRow.map(cell => {
        const runs = mdToTextRuns(cell, {
            fontFace: 'Arial',
            fontSize: 14,
            bold: true,
            color: 'FFFFFF',
            align: 'center',
        });
        return {
            text: runs.map(r => r.text).join(''),
            options: {
                fill: { color: headerColor },
                border: [
                    { type: 'solid', size: borderSize, color: 'CCCCCC' }, // top
                    { type: 'solid', size: borderSize, color: 'CCCCCC' }, // right
                    { type: 'solid', size: borderSize, color: 'CCCCCC' }, // bottom
                    { type: 'solid', size: borderSize, color: 'CCCCCC' }, // left
                ],
                valign: 'middle',
                margin: [3, 6, 3, 6], // top, right, bottom, left (pts)
                align: 'center',
                fontSize: 14,
                fontFace: 'Arial',
                bold: true,
                color: 'FFFFFF',
            },
        };
    });
    pptxRows.push(headerCells);

    // --- Data rows ---
    dataRows.forEach((row, ri) => {
        const bgColor = rowColors[ri % rowColors.length];
        const cells = row.map(cell => {
            const align = isNumeric(cell) ? 'right' : 'left';
            const runs = mdToTextRuns(cell, {
                fontFace: 'Arial',
                fontSize: 12,
                color: textColor,
                align,
            });
            return {
                text: runs.map(r => r.text).join(''),
                options: {
                    fill: { color: bgColor },
                    border: [
                        { type: 'solid', size: borderSize, color: 'CCCCCC' }, // top
                        { type: 'solid', size: borderSize, color: 'CCCCCC' }, // right
                        { type: 'solid', size: borderSize, color: 'CCCCCC' }, // bottom
                        { type: 'solid', size: borderSize, color: 'CCCCCC' }, // left
                    ],
                    valign: 'middle',
                    margin: [3, 6, 3, 6],
                    align,
                    fontSize: 12,
                    fontFace: 'Arial',
                    color: textColor,
                },
            };
        });

        // Pad row if shorter than header columns
        while (cells.length < colCount) {
            cells.push({
                text: '',
                options: {
                    fill: { color: bgColor },
                    border: [
                        { type: 'solid', size: borderSize, color: 'CCCCCC' },
                        { type: 'solid', size: borderSize, color: 'CCCCCC' },
                        { type: 'solid', size: borderSize, color: 'CCCCCC' },
                        { type: 'solid', size: borderSize, color: 'CCCCCC' },
                    ],
                },
            });
        }

        pptxRows.push(cells);
    });

    // Render the table
    slide.addTable(pptxRows, {
        x: margin,
        y: 1.2,
        colW: Array(colCount).fill(colWidth),
        rowH: [headerHeight, ...dataRows.map(() => dataCellHeight)],
        border: { type: 'solid', size: borderSize, color: 'CCCCCC' },
    });
}

module.exports = createTableSlide;
