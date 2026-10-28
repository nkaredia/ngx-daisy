const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sass = require('sass');
const postcss = require('postcss');

async function main() {
  const source = path.resolve(__dirname, '../src/app.scss');
  const css =
    sass.compile(source).css +
    '\n' +
    sass.compile(path.resolve(__dirname, '../src/app/app.component.scss')).css;
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
  assert.match(
    rules.get('.native-navigation-overlay-panel'),
    /box-shadow:\s*var\(--dsy-native-overlay-shadow\)/,
  );
  assert.doesNotMatch(result.css, /@(?:plugin|source|import|layer|property)\b/);
  assert.ok(!rules.has('button,input,optgroup,select,textarea'), 'Browser preflight must stay out');
  // Ensure the plugin is shipped, not only available through a source-tree import.
  assert.ok(fs.existsSync(path.resolve(__dirname, '../../../dist/ngx-daisy-native/tailwind.cjs')));
  for (const [file, type] of [
    ['popover/popover.scss', 'DsyPopoverPanel'],
    ['modal/modal.scss', 'DsyModalPanel'],
  ]) {
    const surface = sass.compile(path.resolve(__dirname, '../../ngx-daisy-native', file)).css;
    const compiled = await postcss([require('@nativescript/tailwind')]).process(surface, {
      from: undefined,
    });
    let defaults;
    compiled.root.walkRules((rule) => {
      if (
        rule.selector.includes(type) &&
        rule.nodes.some((node) => node.type === 'decl' && node.prop === 'box-shadow')
      )
        defaults = rule;
    });
    assert.ok(defaults, `${type}: low-specificity native type defaults`);
    assert.match(defaults.toString(), /box-shadow:\s*var\(--dsy-native-overlay-shadow\)/);
    assert.match(defaults.toString(), /border-radius:\s*var\(--radius-box\)/);
  }
  const buttonCss = sass.compile(
    path.resolve(__dirname, '../../ngx-daisy-native/button/button.component.scss'),
  ).css;
  // NativeScript's fallback resolver truncates resolved rgba values at their first comma.
  assert.doesNotMatch(buttonCss, /var\([^;{}]*,\s*var\(/);
  assert.match(buttonCss, /--dsy-button-pressed-background:\s*var\(--dsy-color-primary-pressed\)/);
  assert.match(buttonCss, /background-color:\s*var\(--dsy-button-pressed-background\)/);
  console.log(
    'Native Tailwind semantic colors, radii, spacing, typography and overlay shadows verified.',
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
