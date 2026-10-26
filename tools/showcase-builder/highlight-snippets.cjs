const ts = require('typescript');
const { highlightSource } = require('./highlight-source.cjs');

/** Adds tokens to static source-file objects without executing the authored module. */
async function highlightSnippets(source, path) {
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const snippets = [];
  const literal = (node) =>
    node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node));
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const properties = new Map(
        node.properties
          .filter(ts.isPropertyAssignment)
          .map((property) => [
            property.name.getText(file).replace(/^['"]|['"]$/g, ''),
            property.initializer,
          ]),
      );
      const content = properties.get('content');
      const language = properties.get('language');
      const name = properties.get('path');
      if (
        literal(content) &&
        literal(language) &&
        literal(name) &&
        ['typescript', 'html', 'scss', 'css'].includes(language.text)
      ) {
        snippets.push({ node, content: content.text, language: language.text });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  const edits = await Promise.all(
    snippets.map(async ({ node, content, language }) => ({
      position: node.end - 1,
      text: `${node.properties.hasTrailingComma ? '' : ','} tokens: ${JSON.stringify(await highlightSource(content, language))}`,
    })),
  );
  for (const edit of edits.sort((a, b) => b.position - a.position)) {
    source = source.slice(0, edit.position) + edit.text + source.slice(edit.position);
  }
  return source;
}
module.exports = { highlightSnippets };
