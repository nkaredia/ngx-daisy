import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { performCompilation, readConfiguration } from '@angular/compiler-cli';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const app = join(root, 'projects/showcase/src/app');
const snippets = [];
for (const directory of await readdir(app, { withFileTypes: true })) {
  if (!directory.isDirectory() || !directory.name.endsWith('-demo')) continue;
  for (const name of await readdir(join(app, directory.name))) {
    if (!name.endsWith('.code.ts')) continue;
    const path = join(app, directory.name, name);
    const file = ts.createSourceFile(
      path,
      await readFile(path, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    function visit(node) {
      if (ts.isObjectLiteralExpression(node)) {
        const fields = new Map(
          node.properties
            .filter(ts.isPropertyAssignment)
            .map((property) => [property.name.getText(file), property.initializer]),
        );
        const content = fields.get('content');
        const language = fields.get('language');
        const label = fields.get('path');
        const literal = (value) =>
          value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value));
        if (
          literal(content) &&
          literal(language) &&
          literal(label) &&
          language.text === 'typescript'
        ) {
          snippets.push({
            name: `${directory.name}-${basename(label.text)}`,
            content: content.text,
          });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
  }
}
if (snippets.length < 72)
  throw new Error(
    `Expected standalone documentation examples across the catalog, found ${snippets.length}.`,
  );
await mkdir(join(root, '.angular'), { recursive: true });
const workspace = await mkdtemp(join(root, '.angular/documentation-examples-'));
try {
  for (const snippet of snippets) await writeFile(join(workspace, snippet.name), snippet.content);
  const configPath = join(workspace, 'tsconfig.json');
  await writeFile(
    configPath,
    JSON.stringify({
      extends: '../../tsconfig.json',
      compilerOptions: { noEmit: true, strict: true, types: [] },
      files: snippets.map((snippet) => snippet.name),
      include: [],
      references: [],
    }),
  );
  const config = readConfiguration(configPath);
  const result = performCompilation({ rootNames: config.rootNames, options: config.options });
  const diagnostics = [...config.errors, ...result.diagnostics];
  if (diagnostics.length)
    process.stderr.write(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCurrentDirectory: () => root,
        getCanonicalFileName: (name) => name,
        getNewLine: () => '\n',
      }),
    );
  if (diagnostics.some((item) => item.category === ts.DiagnosticCategory.Error))
    process.exitCode = 1;
  else
    process.stdout.write(
      `Verified ${snippets.length} standalone documentation examples with Angular template checking.\n`,
    );
} finally {
  await rm(workspace, { recursive: true, force: true });
}
