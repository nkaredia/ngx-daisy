const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { test } = require('node:test');
const { extractPlaygrounds } = require('../../../tools/showcase-builder/playground-extractor.cjs');
const root = path.resolve(__dirname, '../../..');
function stateModule() {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/app/playground/state.ts'), 'utf8');
  new Function(
    'exports',
    ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
  )(exports);
  return exports;
}
test('native property state preserves explicit unset/null, aliases and typed numeric/boolean choices', () => {
  const { playgroundValue, literalIndex, selectedLiteral } = stateModule();
  const property = {
    property: 'color',
    name: 'dsyColor',
    default: 'primary',
    action: { kind: 'select', options: ['primary', 'secondary'] },
  };
  const config = { initialValues: [{ color: 'secondary' }] };
  assert.equal(playgroundValue(config, {}, 0, property), 'secondary');
  assert.equal(playgroundValue(config, { 0: { color: undefined } }, 0, property), undefined);
  assert.equal(playgroundValue(config, { 0: { color: null } }, 0, property), null);
  assert.equal(literalIndex(property, 'secondary'), '1');
  assert.equal(selectedLiteral(property, '0'), 'primary');
  assert.equal(selectedLiteral(property, '-1'), undefined);
  assert.equal(selectedLiteral(property, '1.5'), undefined);
  const numbers = { action: { kind: 'select', options: [0, 10, false, true] } };
  assert.equal(selectedLiteral(numbers, '1'), 10);
  assert.equal(selectedLiteral(numbers, '2'), false);
  assert.equal(literalIndex(numbers, true), '3');
});
test('native source themes select valid platform colors without changing source text', () => {
  const { nativeTokenColor } = stateModule();
  assert.equal(nativeTokenColor('light-dark(#24292e, #e1e4e8)', false), '#24292e');
  assert.equal(nativeTokenColor('light-dark(#24292e, #e1e4e8)', true), '#e1e4e8');
  assert.equal(nativeTokenColor(undefined, false), undefined);
});
test('all native pages extract source-backed properties and complete authored files without writing generated data', async () => {
  const { modules, watchFiles } = await extractPlaygrounds(
    'projects/native-showcase/tsconfig.json',
    root,
    { info() {} },
  );
  assert.equal(modules.size, 22);
  for (const [file, transformed] of modules) {
    const authored = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(authored, /props:|exampleSources:/);
    assert.match(transformed, /props:/);
    assert.match(transformed, /exampleSources:/);
    assert.match(transformed, /tokens:/);
    const example = path.join(path.dirname(file), 'example/example.html');
    assert.ok(watchFiles.includes(example));
    const source = ts.createSourceFile(file, transformed, ts.ScriptTarget.Latest, true);
    const declaration = source.statements
      .filter(ts.isVariableStatement)
      .flatMap((item) => item.declarationList.declarations)
      .find((item) => item.name.getText(source) === 'playground');
    const components = declaration.initializer.properties.find(
      (item) => item.name.getText() === 'components',
    ).initializer;
    for (const entry of components.elements) {
      const metadata = entry.properties.find((item) => item.name.getText() === 'props').initializer;
      const readLiteral = (node) => {
        if (ts.isArrayLiteralExpression(node)) return node.elements.map(readLiteral);
        if (ts.isObjectLiteralExpression(node))
          return Object.fromEntries(
            node.properties.map((prop) => [prop.name.text, readLiteral(prop.initializer)]),
          );
        if (ts.isStringLiteral(node)) return node.text;
        if (ts.isNumericLiteral(node)) return Number(node.text);
        if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
        if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
        if (node.kind === ts.SyntaxKind.NullKeyword) return null;
        if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken)
          return -readLiteral(node.operand);
        throw new Error('Generated metadata must contain only literal data.');
      };
      const props = readLiteral(metadata);
      const html = fs.readFileSync(example, 'utf8');
      for (const prop of props.filter((prop) => prop.action.kind !== 'unsupported'))
        assert.ok(html.includes(`[${prop.name}]=`), `${file}: missing ${prop.name}`);
    }
    assert.equal(fs.readFileSync(file, 'utf8'), authored);
  }
});

test('long highlighted sources update native formatted text in one batch and preserve exact content', () => {
  const exports = {};
  let batches = 0;
  class FormattedString {
    spans = {
      values: [],
      push(...values) {
        batches++;
        this.values.push(...values);
      },
    };
  }
  class Span {}
  class Color {
    constructor(value) {
      this.value = value;
    }
  }
  const source = fs.readFileSync(
    path.join(__dirname, '../src/app/playground/formatted-source.ts'),
    'utf8',
  );
  const requireModule = (name) =>
    name === '@nativescript/core' ? { FormattedString, Span, Color } : stateModule();
  new Function(
    'require',
    'exports',
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
  )(requireModule, exports);
  const tokens = Array.from({ length: 5000 }, (_, index) => ({
    content: `line ${index} · ✓\r\n`,
    color: 'light-dark(#123456, #abcdef)',
  }));
  const file = { content: tokens.map((token) => token.content).join(''), tokens };
  const rendered = exports.nativeSourceText(file, true);
  assert.equal(batches, 1);
  assert.equal(rendered.spans.values.map((span) => span.text).join(''), file.content);
  assert.equal(rendered.spans.values[0].color.value, '#abcdef');
});
