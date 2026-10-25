const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtemp, readFile, writeFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { dirname, join, resolve } = require('node:path');
const ts = require('typescript');
const { extractPlaygrounds } = require('./playground-extractor.cjs');
const { createPlaygroundPlugin } = require('./playground-plugin.cjs');
const esbuild = require('esbuild');

const logger = { info() {} };
const root = resolve(__dirname, '../..');

function readProps(text) {
  const source = ts.createSourceFile('playground.ts', text, ts.ScriptTarget.Latest, true);
  const results = [];
  function value(node) {
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(value);
    if (ts.isObjectLiteralExpression(node))
      return Object.fromEntries(
        node.properties.map((item) => [
          item.name.getText(source).replaceAll("'", ''),
          value(item.initializer),
        ]),
      );
    throw new Error(`Unexpected metadata: ${node.getText(source)}`);
  }
  function visit(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === 'props')
      results.push(value(node.initializer));
    ts.forEachChild(node, visit);
  }
  visit(source);
  return results;
}

test('resolves multiple source classes and transforms metadata without changing authored files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'playground-extractor-'));
  try {
    const config = join(directory, 'tsconfig.json');
    await writeFile(
      config,
      JSON.stringify({
        compilerOptions: {
          module: 'preserve',
          target: 'ES2022',
          skipLibCheck: true,
          paths: {
            '@angular/core': [
              join(dirname(require.resolve('@angular/core/package.json')), 'types/core.d.ts'),
            ],
          },
        },
        include: ['*.ts'],
      }),
    );
    const component = join(directory, 'control.ts');
    const source = `import { input as angularInput, model, signal } from '@angular/core';
      class Base { inherited = angularInput(false); }
      export class Control extends Base {
        choice = angularInput.required<'one' | 'two'>({ alias: 'selection' });
        value = model<number | null>(null);
        text = angularInput('hello');
        level = angularInput<1 | 2>(1);
        data = angularInput<{ id: number }>();
        ignored = signal(1);
      }`;
    await writeFile(component, source);
    const playgroundPath = join(directory, 'playground.ts');
    await writeFile(
      playgroundPath,
      `import { DsyButton as Button } from '@ngx-daisy/cdk/button';
      import { Control } from './control';
      // handwritten configuration stays
      export const playground = { label: 'Preserve me', components: [
        { class: Button, /** Generate props during build */ },
        { class: Control, /** Generate props during build */ },
      ] };`,
    );
    const original = await readFile(playgroundPath, 'utf8');
    const initial = await extractPlaygrounds(config, root, logger);
    const first = initial.modules.get(playgroundPath);
    assert.equal(await readFile(playgroundPath, 'utf8'), original);
    const [button, control] = readProps(first);
    assert.equal(button.length, 10);
    assert.deepEqual(button.find((prop) => prop.name === 'variant').values, [
      'solid',
      'outline',
      'soft',
      'ghost',
      'link',
      'dash',
    ]);
    assert.equal(button.find((prop) => prop.name === 'disabled').default, false);
    assert.equal(button.find((prop) => prop.name === 'tabindex').property, 'tabIndex');
    assert.equal(button.find((prop) => prop.name === 'tabindex').acceptedType, 'unknown');
    assert.equal(button.find((prop) => prop.name === 'color').optional, true);
    assert.equal(control.find((prop) => prop.name === 'selection').required, true);
    assert.deepEqual(control.find((prop) => prop.name === 'selection').values, ['one', 'two']);
    assert.equal(control.find((prop) => prop.name === 'value').kind, 'model');
    assert.equal(control.find((prop) => prop.name === 'value').nullable, true);
    assert.equal(control.find((prop) => prop.name === 'inherited').default, false);
    assert.equal(
      control.some((prop) => prop.name === 'ignored'),
      false,
    );
    assert.deepEqual(button.find((prop) => prop.name === 'disabled').action, {
      kind: 'toggle',
      options: [false, true],
    });
    assert.equal(button.find((prop) => prop.name === 'tabindex').action.kind, 'number');
    assert.deepEqual(control.find((prop) => prop.name === 'selection').action, {
      kind: 'select',
      options: ['one', 'two'],
    });
    assert.equal(control.find((prop) => prop.name === 'value').action.kind, 'number');
    assert.equal(control.find((prop) => prop.name === 'text').action.kind, 'text');
    assert.deepEqual(control.find((prop) => prop.name === 'level').action, {
      kind: 'select',
      options: [1, 2],
    });
    assert.equal(control.find((prop) => prop.name === 'data').action.kind, 'unsupported');

    // Type-check actual generated metadata against the renderer's contract, in memory.
    function contractDiagnostics(expression) {
      const virtualPath = join(directory, 'contract-check.ts');
      const contractPath = join(root, 'projects/showcase/src/app/playground/playground.types');
      const text = `import type { PlaygroundProperty } from '${contractPath}';
        const props: readonly PlaygroundProperty[] = ${expression};`;
      const options = {
        strict: true,
        skipLibCheck: true,
        module: ts.ModuleKind.Preserve,
        target: ts.ScriptTarget.ES2022,
      };
      const host = ts.createCompilerHost(options);
      const originalGetSourceFile = host.getSourceFile.bind(host);
      host.getSourceFile = (path, languageVersion, ...args) =>
        path === virtualPath
          ? ts.createSourceFile(path, text, languageVersion, true)
          : originalGetSourceFile(path, languageVersion, ...args);
      const program = ts.createProgram([virtualPath], options, host);
      return program.getSemanticDiagnostics(program.getSourceFile(virtualPath));
    }
    assert.deepEqual(contractDiagnostics(JSON.stringify([...button, ...control])), []);
    const invalidAction = { ...button[0], action: { kind: 'select' } };
    assert.ok(contractDiagnostics(JSON.stringify([invalidAction])).length > 0);
    assert.match(first, /handwritten configuration stays/);
    assert.match(first, /Preserve me/);
    const repeat = await extractPlaygrounds(config, root, logger);
    assert.equal(repeat.modules.get(playgroundPath), first);
    assert.equal(await readFile(playgroundPath, 'utf8'), original);
    await writeFile(component, source.replace("'one' | 'two'", "'one' | 'two' | 'three'"));
    const updated = await extractPlaygrounds(config, root, logger);
    assert.deepEqual(
      readProps(updated.modules.get(playgroundPath))[1].find((prop) => prop.name === 'selection')
        .values,
      ['one', 'two', 'three'],
    );
    const context = await esbuild.context({
      absWorkingDir: root,
      entryPoints: [playgroundPath],
      bundle: true,
      write: false,
      platform: 'node',
      format: 'cjs',
      metafile: true,
      external: ['@angular/core', '@ngx-daisy/cdk/*'],
      plugins: [
        {
          name: 'angular-compiler-probe',
          setup(build) {
            build.onLoad({ filter: /playground\.ts$/ }, () => {
              throw new Error('Playground loader did not intercept the physical TS request');
            });
          },
        },
        createPlaygroundPlugin(logger, config),
      ],
    });
    try {
      const bundle = await context.rebuild();
      assert.match(bundle.outputFiles[0].text, /name: "selection"/);
      assert.match(bundle.outputFiles[0].text, /"three"/);
      await writeFile(component, source.replace("'one' | 'two'", "'one' | 'two' | 'four'"));
      const rebuilt = await context.rebuild();
      assert.match(rebuilt.outputFiles[0].text, /"four"/);
      assert.doesNotMatch(rebuilt.outputFiles[0].text, /"three"/);
      assert.equal(await readFile(playgroundPath, 'utf8'), original);
    } finally {
      await context.dispose();
    }
    const invalid = original.replace(/\/\*\*\s*Generate props during build\s*\*\//g, '');
    await writeFile(playgroundPath, invalid);
    await assert.rejects(extractPlaygrounds(config, root, logger), /placeholder/);
    assert.equal(await readFile(playgroundPath, 'utf8'), invalid);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('does not extract unrelated files or similarly named playground files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'playground-noop-'));
  try {
    await writeFile(join(directory, 'tsconfig.json'), JSON.stringify({ include: ['*.ts'] }));
    const path = join(directory, 'playground-other.ts');
    const original = 'export const unrelated = true;\n';
    await writeFile(path, original);
    assert.equal(
      (await extractPlaygrounds(join(directory, 'tsconfig.json'), root, logger)).modules.size,
      0,
    );
    assert.equal(await readFile(path, 'utf8'), original);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
