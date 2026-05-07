const fs = require("fs");
const path = require("path");

function die(message) {
  console.error(message);
  process.exit(1);
}

const DEFAULT_THEME = {
  "id": "default",
  "label": "Default Theme",
  "description": "A basic, high-contrast default theme.",
  "colors": {
    "background": "#F1EFEA",
    "text": "#0A0A0B",
    "primary": "#0A0A0B",
    "accent1": "#18181A",
    "accent2": "#E8E5DE"
  },
  "typography": {
    "heading": { "fontFace": "Arial", "fontSize": 36, "bold": true },
    "subheading": { "fontFace": "Arial", "fontSize": 28 },
    "body": { "fontFace": "Arial", "fontSize": 18 },
    "bodyDense": { "fontFace": "Arial", "fontSize": 18 },
    "kicker": { "fontFace": "Arial", "fontSize": 18, "bold": true, "allCaps": true },
    "meta": { "fontFace": "Arial", "fontSize": 14 },
    "minBodyFontSize": 18
  },
  "spacing": {
    "lineHeight": 1.4,
    "groupInner": 0.25,
    "groupOuter": 0.6
  },
  "rules": {
    "minContrastRatio": 4.5,
    "maxFontSize": 36
  }
};

/**
 * Loads themes from individual JSON files in the themes directory.
 * @returns {Map<string, object>} A map of theme IDs to theme objects.
 */
function loadThemes() {
    try {
        const themesDir = path.join(__dirname, '../../references/themes');
        const themeFiles = fs.readdirSync(themesDir).filter(f => f.endsWith('.json'));
        const themes = new Map();

        for (const file of themeFiles) {
            const filePath = path.join(themesDir, file);
            const themeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (themeData.id) {
                themes.set(themeData.id, themeData);
            }
        }
        return themes;
    } catch (error) {
        die(`Error loading or parsing themes: ${error.message}`);
        // Fallback to empty map if there's an error, as this map will be merged with DEFAULT_THEME
        return new Map();
    }
}

module.exports = { die, loadThemes, DEFAULT_THEME };
