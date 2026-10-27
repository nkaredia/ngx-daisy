const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const ts = require('typescript');
const cache = new Map();
function loadSource(file) {
  file = path.resolve(__dirname, file);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const localRequire = createRequire(file);
  const requireSource = (name) => {
    if (name === '@ngx-daisy/core/theme')
      return require(
        path.resolve(__dirname, '../../../dist/ngx-daisy-core/fesm2022/ngx-daisy-core-theme.mjs'),
      );
    if (name.startsWith('.')) return loadSource(path.resolve(path.dirname(file), `${name}.ts`));
    return localRequire(name);
  };
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  new Function('require', 'exports', compiled)(requireSource, exports);
  return exports;
}

test('every published daisyUI preset can be converted to a native theme', () => {
  const { nativeThemes } = loadSource('../src/app/shell/themes.ts');
  const { resolveNativeTheme } = loadSource('../../ngx-daisy-native/theme/native-theme.ts');
  assert.equal(nativeThemes.length, 35);
  assert.equal(new Set(nativeThemes.map((theme) => theme.name)).size, nativeThemes.length);
  for (const theme of nativeThemes) {
    const native = resolveNativeTheme(theme);
    assert.equal(native.name, theme.name);
    assert.match(native.tokens['--color-primary'], /^rgba\(/);
    assert.ok(Number.isFinite(Number(native.tokens['--radius-field'])));
  }
});

test('native navigation lists each supported component once under the web category order', () => {
  const { nativePages, nativeGroups } = loadSource('../src/app/shell/catalog.ts');
  const pages = nativeGroups.flatMap((group) => group.pages);
  assert.deepEqual(
    nativeGroups.map((group) => group.id),
    ['actions', 'data-display', 'data-input'],
  );
  assert.deepEqual(
    pages.map((page) => page.id),
    [
      'buttons',
      'dropdowns',
      'fabs',
      'modals',
      'swaps',
      'theme-controllers',
      'icons',
      'inputs',
      'textareas',
      'checkboxes',
      'radios',
      'ranges',
      'toggles',
    ],
  );
  assert.equal(new Set(pages.map((page) => page.id)).size, nativePages.length);
});
