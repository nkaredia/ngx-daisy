// Run after yarn test:styles, from the repository root.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const themes = Object.keys(require('daisyui/theme/object').default);
const html = fs.readFileSync('.angular/daisyui-compat/all-themes.html', 'utf8');
const styles = html.match(/<style>[\s\S]*?<\/style>/g);
const scenes = html.match(
  /<section dir="(?:ltr|rtl)" style="margin-block:24px">[\s\S]*?<\/dsy-tabs>\s*<\/section>/g,
);
assert.equal(themes.length, 35);
assert.equal(scenes?.length, 4);
assert.equal(styles?.length, 2);
const body = themes
  .map(
    (theme) =>
      `<section data-theme="${theme}"><h2>${theme}</h2>${scenes.map((scene) => scene.replaceAll('id="seam-', `id="seam-${theme}-`)).join('')}</section>`,
  )
  .join('');
fs.writeFileSync(
  '.angular/daisyui-compat/preset-seams.html',
  `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Lifted seams: all shipped presets</title>${styles.join('')}</head><body><main id="compat-root">${body}</main></body></html>`,
);
console.log(`Created ${themes.length * scenes.length} preset/placement/direction cases`);
