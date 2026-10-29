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
      'selects',
      'form-fields',
      'fieldsets',
      'toggles',
    ],
  );
  assert.equal(new Set(pages.map((page) => page.id)).size, nativePages.length);
  assert.equal(new Set(nativePages.map((page) => page.description)).size, nativePages.length);
  assert.ok(nativePages.every((page) => page.description.length > 30));
});

function snapshotFixture(available = true, opened = true) {
  const { animateSidebarSnapshot } = loadSource('../src/app/shell/sidebar-snapshot.ts');
  let scheduled;
  let completion;
  let removed = 0;
  let completed = 0;
  const snapshot = { removeFromSuperview: () => removed++ };
  const native = {
    alpha: 1,
    frame: { x: 0, y: 0, width: 288, height: 800 },
    transform: 'live-identity',
    layoutIfNeeded() {},
    superview: {
      addSubview(view) {
        assert.equal(view, snapshot);
      },
    },
    snapshotViewAfterScreenUpdates: () => {
      if (available === 'throw') throw new Error('capture failed');
      return available ? snapshot : null;
    },
  };
  const view = { opacity: 0, ios: native };
  const bridge = {
    withoutAnimation: (work) => work(),
    animate: (seconds, work, done) => {
      assert.equal(seconds, opened ? 0.18 : 0.12);
      work();
      completion = done;
    },
    translation: (x, y) => ({ x, y }),
    identity: 'identity',
    capture: (surface) => surface.snapshotViewAfterScreenUpdates(),
    schedule: (work) => {
      scheduled = work;
      return () => {
        scheduled = undefined;
      };
    },
  };
  const cancel = animateSidebarSnapshot(
    view,
    opened,
    opened ? 0.18 : 0.12,
    () => completed++,
    bridge,
  );
  return {
    view,
    native,
    snapshot,
    cancel,
    start: () => scheduled?.(),
    finish: () => completion?.(),
    get removed() {
      return removed;
    },
    get completed() {
      return completed;
    },
  };
}

test('iOS sidebar presentation leaves live layout intact and hides duplicate accessibility', () => {
  const fixture = snapshotFixture();
  fixture.start();
  assert.equal(fixture.native.transform, 'live-identity');
  assert.equal(fixture.native.alpha, 0);
  assert.equal(fixture.snapshot.transform, 'identity');
  assert.equal(fixture.snapshot.userInteractionEnabled, false);
  assert.equal(fixture.snapshot.accessibilityElementsHidden, true);
  assert.equal(fixture.completed, 0);
  fixture.finish();
  assert.equal(fixture.native.alpha, 1);
  assert.equal(fixture.view.opacity, 1);
  assert.equal(fixture.removed, 1);
  assert.equal(fixture.completed, 1);
  fixture.finish();
  assert.equal(fixture.completed, 1);
});

test('sidebar cancellation cleans up and ignores a stale animation completion', () => {
  const fixture = snapshotFixture();
  fixture.start();
  fixture.cancel();
  fixture.finish();
  assert.equal(fixture.removed, 1);
  assert.equal(fixture.completed, 0);
  assert.equal(fixture.native.alpha, 1);
  const pending = snapshotFixture();
  pending.cancel();
  pending.start();
  assert.equal(pending.removed, 0);
  assert.equal(pending.completed, 0);
});

test('sidebar snapshot failure reveals the real panel and completes dismissal ownership', () => {
  const fixture = snapshotFixture(false);
  fixture.start();
  assert.equal(fixture.native.alpha, 1);
  assert.equal(fixture.view.opacity, 1);
  assert.equal(fixture.completed, 1);
});

test('sidebar exit retains the surface until presentation finishes and recovers capture exceptions', () => {
  const exiting = snapshotFixture(true, false);
  exiting.start();
  assert.deepEqual(exiting.snapshot.transform, { x: -288, y: 0 });
  assert.equal(exiting.completed, 0);
  exiting.finish();
  assert.equal(exiting.completed, 1);
  assert.equal(exiting.native.alpha, 1);
  const failed = snapshotFixture('throw');
  failed.start();
  assert.equal(failed.completed, 1);
  assert.equal(failed.native.alpha, 1);
});
