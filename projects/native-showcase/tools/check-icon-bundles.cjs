const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const outputs = [
  '../../../dist/native-check/ios/nativeshowcase/app/vendor.mjs',
  '../../../dist/native-check/android/app/src/main/assets/app/vendor.js',
];
for (const output of outputs) {
  const bundle = fs.readFileSync(path.resolve(__dirname, output), 'utf8');
  const lucideModules = [
    ...bundle.matchAll(/node_modules\/lucide\/dist\/esm\/icons\/([a-z-]+)\.mjs/g),
  ].map((match) => match[1]);
  assert.deepEqual([...new Set(lucideModules)].sort(), [
    'archive',
    'chart-no-axes-column',
    'check',
    'chevron-down',
    'circle-check',
    'dot',
    'heart',
    'house',
    'keyboard',
    'link',
    'menu',
    'minus',
    'moon',
    'paintbrush',
    'plus',
    'settings',
    'star',
    'sun',
    'user-plus',
    'x',
    'zap',
  ]);
  for (const icon of ['faHouse', 'faGear', 'faHeart', 'faGithub'])
    assert.ok(bundle.includes(`/${icon}.js`), `${icon} should be bundled individually`);
  assert.doesNotMatch(bundle, /node_modules\/@fortawesome\/free-[a-z]+-svg-icons\/index\./);
  assert.doesNotMatch(
    bundle,
    /node_modules\/lucide\/dist\/esm\/(?:replaceElement|createElement|iconsAndAliases)\.mjs/,
  );
}
console.log(
  'Both native bundles contain only selected icon modules, without browser icon renderers.',
);
