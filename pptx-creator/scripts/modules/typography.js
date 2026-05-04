const { die } = require('./utils');

/**
 * Apply typography settings to an options object using the active theme.
 * @param {string} role - The typography role (e.g., 'heading', 'body', 'meta').
 * @param {object} theme - The active theme object.
 * @returns {object} Options object with fontFace, fontSize, bold, etc.
 */
function applyTypography(role, theme) {
  if (!theme.typography || !theme.typography[role]) {
    // Fallback to a very basic default if a role is missing, to avoid crashes
    console.warn(`Typography role '${role}' not found in theme '${theme.id}'. Using default.`);
    return {
      fontFace: "Arial",
      fontSize: 24,
      bold: false,
    };
  }

  const style = theme.typography[role];

  // Ensure minimum font size for body-like roles is respected
  if (role.toLowerCase().includes('body') || role.toLowerCase().includes('subheading')) {
      const minSize = theme.typography.minBodyFontSize || 24;
      if (style.fontSize < minSize) {
          console.warn(`Theme '${theme.id}': Role '${role}' fontSize ${style.fontSize}pt is below projection-safe minimum of ${minSize}pt.`);
      }
  }

  return {
    fontFace: style.fontFace || "Arial",
    fontSize: style.fontSize || 24,
    bold: style.bold || false,
    color: style.color, // Allow theme to specify color per-role
    italic: style.italic || false,
    allCaps: style.allCaps || false,
  };
}

module.exports = { applyTypography };
