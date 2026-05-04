const fs = require("fs");
const pptxgen = require('pptxgenjs');
const { die, loadThemes, DEFAULT_THEME } = require('./modules/utils');
const { validatePresentation } = require("./modules/validators");
const slideGenerators = require('./modules/slide-generators');

// ============================================================
// MAIN EXECUTION LOGIC
// ============================================================

// 1. Get input file path from command line arguments
const [inputFile, outputFile] = process.argv.slice(2);
if (!inputFile) {
  die("Usage: node build-from-json.js <input.json> [output.pptx]");
}
const finalOutputFile = outputFile || "presentation.pptx";

// 2. Load Themes
const loadedThemes = loadThemes();
const allThemes = new Map(loadedThemes);
if (!allThemes.has(DEFAULT_THEME.id)) {
  allThemes.set(DEFAULT_THEME.id, DEFAULT_THEME);
}

// 3. Read and parse the JSON file
let presentationData;
try {
  const jsonString = fs.readFileSync(inputFile, "utf8");
  presentationData = JSON.parse(jsonString);
} catch (error) {
  die(`Error reading or parsing input file: ${error.message}`);
}

// 4. Validate the presentation data 重复检查
const { errors, warnings } = validatePresentation(presentationData, allThemes);

if (warnings.length > 0) {
    warnings.forEach(w => console.warn(w));
}
if (errors.length > 0) {
    errors.forEach(e => console.error(e));
    die("❌ Validation failed. Halting build.");
}

// 5. Determine Active Theme and Settings
const settings = presentationData.settings || {};
const activeTheme = allThemes.get(settings.theme || DEFAULT_THEME.id);

// 6. Initialize Presentation
const pres = new pptxgen();
pres.layout = settings.layout || "LAYOUT_16x9";
pres.author = settings.author || "Untitled";
pres.title = settings.title || "Untitled Presentation";

// Define a default master slide for all content slides
pres.defineSlideMaster({
  title: "DEFAULT_MASTER",
  background: { color: activeTheme.colors.background },
  objects: [
    {
      "slideNumber": {
        x: 9.0, y: 6.8, w: 0.5, h: 0.3,
        fontFace: activeTheme.typography.meta.fontFace,
        fontSize: activeTheme.typography.meta.fontSize,
        color: activeTheme.colors.text,
        align: "right",
        opacity: 0.5
      }
    }
  ],
});

// 7. Loop through slides and generate them
presentationData.slides.forEach((slideDef, index) => {
  const slideType = slideDef.type;
  const slideData = slideDef.data;
  const generator = slideGenerators[slideType];

  if (!slideType || !slideData || !generator) {
      // This should already be caught by the validator, but as a safeguard:
      console.warn(`Skipping invalid slide definition at index ${index}.`);
      return;
  }

  try {
    generator(pres, slideData, activeTheme, index + 1);
  } catch (error) {
      console.warn(`Could not generate slide ${index + 1} ('${slideType}'): ${error.message}`);
  }
});

// 8. Write the final PPTX file
pres.writeFile({ fileName: finalOutputFile })
  .then(() => {
    console.log(`Successfully created: ${finalOutputFile}`);
  })
  .catch(err => {
    die(`Error writing file: ${err}`);
  });
