const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtemp, readFile, writeFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join, resolve } = require('node:path');
const ts = require('typescript');
const { extractPlaygrounds } = require('./playground-extractor.cjs');
const { createPlaygroundPlugin } = require('./playground-plugin.cjs');
const esbuild = require('esbuild');
const root = resolve(__dirname, '../..');
const logger = { info() {} };

function exampleSources(code) {
  const file = ts.createSourceFile('playground.ts', code, ts.ScriptTarget.Latest, true);
  let result;
  function read(node) {
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(read);
    if (ts.isObjectLiteralExpression(node))
      return Object.fromEntries(
        node.properties.map((item) => [
          item.name.getText(file),
          item.name.getText(file) === 'component'
            ? item.initializer.getText(file)
            : read(item.initializer),
        ]),
      );
    throw new Error('Unexpected generated source metadata');
  }
  function visit(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(file) === 'exampleSources')
      result = read(node.initializer);
    ts.forEachChild(node, visit);
  }
  visit(file);
  return result;
}

test('extracts exact authored TS, HTML and SCSS, keeps inline examples single-file, and refreshes resource edits', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'example-source-'));
  try {
    const configPath = join(directory, 'tsconfig.json');
    await writeFile(
      configPath,
      JSON.stringify({
        compilerOptions: {
          module: 'preserve',
          target: 'ES2022',
          experimentalDecorators: true,
          paths: {
            '@angular/core': [
              join(dirname(require.resolve('@angular/core/package.json')), 'types/core.d.ts'),
            ],
          },
        },
        include: ['*.ts'],
      }),
    );
    const external =
      '\uFEFFimport { Component as Comp } from "@angular/core";\r\n// Preserve this comment.\r\n@Comp({selector: "test-full", templateUrl: "./example.html", styleUrls: ["./example.scss"]})\r\nexport class ExternalExample {}\r\n';
    const inline =
      'import { Component } from "@angular/core";\n@Component({selector:"test-inline", template:`<button>Inline</button>`, styles:`:host { display: block; }`})\nexport class InlineExample {}\n';
    const html = '<button title="<example>">Value &amp; text</button>\r\n';
    const scss = ':host {\r\n  color: var(--color-primary);\r\n}\r\n';
    const playground =
      'import { ExternalExample as Full } from "./external";\nimport { InlineExample } from "./inline";\nexport const playground = {components: [], previews: [Full, Full], inlinePreviews: [{title: "Compact", component: InlineExample}]};\n';
    for (const [name, content] of Object.entries({
      'external.ts': external,
      'inline.ts': inline,
      'example.html': html,
      'example.scss': scss,
      'playground.ts': playground,
    }))
      await writeFile(join(directory, name), content);
    const result = await extractPlaygrounds(configPath, root, logger);
    const sources = exampleSources(result.modules.get(join(directory, 'playground.ts')));
    assert.equal(sources.length, 2);
    assert.equal(sources[0].component, 'Full');
    assert.deepEqual(
      sources[0].files.map(({ tokens, ...file }) => file),
      [
        { path: 'external.ts', language: 'typescript', content: external },
        { path: 'example.html', language: 'html', content: html },
        { path: 'example.scss', language: 'scss', content: scss },
      ],
    );
    assert.deepEqual(
      sources[1].files.map(({ tokens, ...file }) => file),
      [
        { path: 'inline.ts', language: 'typescript', content: inline },
        { path: 'inline.html', language: 'html', content: '<button>Inline</button>' },
      ],
    );
    for (const source of sources)
      for (const file of source.files) {
        assert.equal(file.tokens.map((token) => token.content).join(''), file.content);
        assert.ok(file.tokens.some((token) => token.color?.startsWith('light-dark(')));
      }
    assert.ok(result.watchFiles.includes(join(directory, 'example.html')));
    assert.ok(result.watchFiles.includes(join(directory, 'example.scss')));
    assert.equal(await readFile(join(directory, 'playground.ts'), 'utf8'), playground);
    assert.equal(await readFile(join(directory, 'external.ts'), 'utf8'), external);

    const context = await esbuild.context({
      absWorkingDir: root,
      entryPoints: [join(directory, 'playground.ts')],
      bundle: true,
      write: false,
      platform: 'node',
      format: 'cjs',
      metafile: true,
      external: ['@angular/core'],
      plugins: [createPlaygroundPlugin(logger, configPath)],
    });
    try {
      await context.rebuild();
      const updatedHtml = '<button>Updated source sentinel</button>\n';
      await writeFile(join(directory, 'example.html'), updatedHtml);
      const rebuilt = await context.rebuild();
      assert.match(rebuilt.outputFiles[0].text, /Updated source sentinel/);
      assert.ok(Object.keys(rebuilt.metafile.inputs).some((path) => path.endsWith('example.html')));
      assert.equal(await readFile(join(directory, 'playground.ts'), 'utf8'), playground);
    } finally {
      await context.dispose();
    }
    await rm(join(directory, 'example.scss'));
    await assert.rejects(extractPlaygrounds(configPath, root, logger), /ENOENT/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
