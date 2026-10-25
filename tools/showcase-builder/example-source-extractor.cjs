const ts = require('typescript');
const { highlightSource } = require('./highlight-source.cjs');
const { readFileSync } = require('node:fs');
const { basename, dirname, extname, relative, resolve } = require('node:path');

/** Capture authored files, never compiled output or showcase shell markup. */
async function extractExampleFiles(checker, declaration, watchFiles) {
  const source = declaration.getSourceFile();
  const files = new Map();
  function capture(path) {
    path = resolve(path);
    const language = { '.ts': 'typescript', '.html': 'html', '.scss': 'scss', '.css': 'css' }[
      extname(path)
    ];
    if (!language) throw new Error(`Unsupported example source extension: ${path}`);
    const content = readFileSync(path, 'utf8');
    watchFiles.add(path);
    files.set(path, {
      path: relative(dirname(source.fileName), path).replaceAll('\\', '/'),
      language,
      content,
    });
  }
  capture(source.fileName);
  let component;
  for (const decorator of ts.getDecorators(declaration) ?? []) {
    if (!ts.isCallExpression(decorator.expression)) continue;
    let symbol = checker.getSymbolAtLocation(decorator.expression.expression);
    if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    if (
      symbol?.getName() !== 'Component' ||
      !symbol.declarations?.some((item) =>
        item.getSourceFile().fileName.replaceAll('\\', '/').includes('/@angular/core/'),
      )
    )
      continue;
    component = decorator.expression.arguments[0];
  }
  if (!component || !ts.isObjectLiteralExpression(component))
    throw new Error(`${source.fileName}: example must declare static Angular Component metadata.`);
  for (const member of component.properties) {
    if (!ts.isPropertyAssignment(member)) continue;
    const name = member.name.getText(source).replace(/^['"]|['"]$/g, '');
    if (name === 'template') {
      if (!ts.isStringLiteralLike(member.initializer))
        throw new Error(`${source.fileName}: template must be a literal for example extraction.`);
      // Remove only the indentation introduced by embedding HTML in a TS component.
      const lines = member.initializer.text.replace(/^\r?\n|\r?\n[ \t]*$/g, '').split('\n');
      const indent = Math.min(
        ...lines.filter((line) => line.trim()).map((line) => line.match(/^[ \t]*/)[0].length),
      );
      const content = lines
        .map((line) => line.slice(Number.isFinite(indent) ? indent : 0))
        .join('\n');
      files.set('inline-template', {
        path: basename(source.fileName, '.ts') + '.html',
        language: 'html',
        content,
      });
      continue;
    }
    if (!['templateUrl', 'styleUrl', 'styleUrls'].includes(name)) continue;
    const resources =
      name === 'styleUrls' && ts.isArrayLiteralExpression(member.initializer)
        ? member.initializer.elements
        : [member.initializer];
    for (const resource of resources) {
      if (!ts.isStringLiteralLike(resource))
        throw new Error(
          `${source.fileName}: ${name} must use literal resource paths for example extraction.`,
        );
      capture(resolve(dirname(source.fileName), resource.text));
    }
  }
  return Promise.all(
    [...files.values()].map(async (file) => ({
      ...file,
      tokens: await highlightSource(file.content, file.language),
    })),
  );
}

module.exports = { extractExampleFiles };
