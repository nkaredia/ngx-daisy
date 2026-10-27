const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const { House } = require('lucide');
const { faHouse } = require('@fortawesome/free-solid-svg-icons/faHouse');
const { faHeart } = require('@fortawesome/free-regular-svg-icons/faHeart');
const { faGithub } = require('@fortawesome/free-brands-svg-icons/faGithub');

const source = fs.readFileSync(path.resolve(__dirname, '../src/app/icons/svg-artwork.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const helpers = import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('Lucide artwork preserves paths and materializes the native inherited color', async () => {
  const { lucideArtwork, renderArtwork } = await helpers;
  const artwork = lucideArtwork(House);
  assert.deepEqual(artwork.nodes, House);
  const svg = renderArtwork(artwork, '#abcdef', 0.5);
  assert.match(svg, /viewBox="0 0 24 24"/);
  assert.match(svg, /fill="none" stroke="#abcdef"/);
  assert.match(svg, /opacity="0.5"/);
  assert.doesNotMatch(svg, /currentColor/);
  assert.notEqual(svg, renderArtwork(artwork, '#123456'));
});

test('Font Awesome solid, regular and brand definitions preserve their view boxes and path data', async () => {
  const { fontAwesomeArtwork, renderArtwork } = await helpers;
  for (const icon of [faHouse, faHeart, faGithub]) {
    const artwork = fontAwesomeArtwork(icon);
    assert.equal(artwork.viewBox, `0 0 ${icon.icon[0]} ${icon.icon[1]}`);
    assert.deepEqual(
      artwork.nodes.map(([, values]) => values.d),
      [icon.icon[4]],
    );
    assert.match(renderArtwork(artwork, '#112233'), /fill="#112233"/);
  }
});

test('SVG attributes are escaped and optional attributes are omitted', async () => {
  const { renderArtwork } = await helpers;
  const svg = renderArtwork(
    { viewBox: '0 0 24 24', attributes: {}, nodes: [['path', { d: '"<&>', missing: undefined }]] },
    '#000000',
    2,
  );
  assert.match(svg, /d="&quot;&lt;&amp;&gt;"/);
  assert.match(svg, /opacity="1"/);
  assert.doesNotMatch(svg, /missing|undefined/);
});
