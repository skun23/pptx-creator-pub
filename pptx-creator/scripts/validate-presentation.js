const fs = require("fs");
const { die, loadThemes, DEFAULT_THEME } = require("./modules/utils");
const { validatePresentation } = require("./modules/validators");

function main() {
    const [inputFile] = process.argv.slice(2);
    if (!inputFile) {
        die("Usage: node validate-presentation.js <input.json>");
    }

    let presentationData;
    try {
        const jsonString = fs.readFileSync(inputFile, "utf8");
        presentationData = JSON.parse(jsonString);
    } catch (error) {
        die(`❌ Error reading or parsing input file: ${error.message}`);
    }

    const loadedThemes = loadThemes();
    const allThemes = new Map(loadedThemes);
    if (!allThemes.has(DEFAULT_THEME.id)) {
      allThemes.set(DEFAULT_THEME.id, DEFAULT_THEME);
    }

    const { errors, warnings } = validatePresentation(presentationData, allThemes);

    if (warnings.length > 0) {
        warnings.forEach(w => console.warn(w));
    }

    if (errors.length > 0) {
        errors.forEach(e => console.error(e));
        console.error("❌ Validation failed. Fix errors before building.");
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.log("✅ JSON structure is valid, but warnings were found (see above).");
    } else {
        console.log("✅ All validation checks passed.");
    }
}

main();
