const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');
const { highlightSource } = require('./highlight-source.cjs');

function luminance(hex) {
  let value = hex.slice(1);
  if (value.length === 3) value = [...value].map((c) => c + c).join('');
  return [0, 2, 4]
    .map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, index) => sum + c * [0.2126, 0.7152, 0.0722][index], 0);
}

test('emitted example tokens meet normal-text contrast against the actual light/dark editor surfaces', async () => {
  const scss = await readFile(
    join(__dirname, '../../projects/showcase/src/app/playground/example-code.scss'),
    'utf8',
  );
  const [, light, dark] = scss.match(
    /--example-code-background:\s*light-dark\((#[\da-f]+),\s*(#[\da-f]+)\)/i,
  );
  const fixtures = [
    [
      'typescript',
      '// Preserve a comment\nimport { Component } from "@angular/core";\n@Component({ selector: "app-test", template: `<p>{{value}}</p>` })\nexport class Example { readonly value = 42; enabled = true; missing = null; }\n',
    ],
    [
      'html',
      '<!-- Accessible controls -->\n<button type="button" [disabled]="false" aria-label="Save">Save &amp; close</button>\n',
    ],
    [
      'scss',
      '// Theme-aware sample\n@use "sass:color";\n$gap: 1rem;\n.card:focus-visible { color: var(--color-primary); padding: $gap; border: 2px solid #000; }\n',
    ],
    ['css', '/* Native states */\nbutton[disabled] { opacity: 0.5; }\n'],
  ];
  for (const [language, source] of fixtures) {
    const tokens = await highlightSource(source, language);
    assert.equal(tokens.map((token) => token.content).join(''), source);
    for (const token of tokens) {
      if (!token.color || !token.content.trim()) continue;
      const match = token.color.match(/^light-dark\((#[\da-f]+),\s*(#[\da-f]+)\)$/i);
      assert.ok(match, token.color);
      for (const [foreground, background] of [
        [match[1], light],
        [match[2], dark],
      ]) {
        const a = luminance(foreground),
          b = luminance(background);
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        assert.ok(
          ratio >= 4.5,
          `${language} token ${JSON.stringify(token.content)}: ${foreground} on ${background} = ${ratio}`,
        );
      }
    }
  }
});
