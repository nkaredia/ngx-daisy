const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sass = require('sass');
const postcss = require('postcss');

async function main() {
  const source = path.resolve(__dirname, '../src/app.scss');
  const css = sass.compile(source).css;
  const result = await postcss([
    require('@tailwindcss/postcss')({ optimize: true }),
    require('@nativescript/tailwind'),
  ]).process(css, { from: source });
  const rules = new Map();
  result.root.walkRules((rule) => {
    rules.set(rule.selector, rule.toString());
  });
  assert.match(rules.get('.bg-base-200'), /var\(--color-base-200\)/);
  assert.match(rules.get('.text-primary'), /var\(--color-primary\)/);
  assert.match(rules.get('.rounded-box'), /var\(--radius-box\)/);
  assert.match(rules.get('.p-5'), /padding:/);
  assert.match(rules.get('.font-semibold'), /font-weight:var\(--font-weight-semibold\)/);
  assert.doesNotMatch(result.css, /@(?:plugin|source|import|layer|property)\b/);
  assert.ok(!rules.has('button,input,optgroup,select,textarea'), 'Browser preflight must stay out');
  // Ensure the plugin is shipped, not only available through a source-tree import.
  assert.ok(fs.existsSync(path.resolve(__dirname, '../../../dist/ngx-daisy-native/tailwind.cjs')));
  console.log('Native Tailwind semantic colors, radii, spacing and typography verified.');
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
