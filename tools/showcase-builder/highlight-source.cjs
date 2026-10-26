// A single build-side instance; no Shiki runtime or grammars enter the browser bundle.
let highlighter;
/**
 *
 * @param {*} content
 * @param {string} language
 * @returns
 */
async function highlightSource(content, language) {
  highlighter ??= import('shiki').then(({ createHighlighter }) =>
    createHighlighter({
      themes: ['github-light', 'light-plus', 'github-dark', 'dark-plus'],
      langs: ['typescript', 'html', 'scss', 'css'],
    }),
  );
  const engine = await highlighter;
  const { tokens } = engine.codeToTokens(content, {
    lang: language,
    themes: {
      light: language.match(/html|scss|css$/) ? 'github-light' : 'light-plus',
      dark: language.match(/html|scss|css$/) ? 'github-dark' : 'dark-plus',
    },
    defaultColor: 'light-dark()',
  });
  const result = [];
  let cursor = 0;
  for (const token of tokens.flat()) {
    // Preserve gaps verbatim, including CRLF and trailing newlines omitted by tokenization.
    if (token.offset > cursor) result.push({ content: content.slice(cursor, token.offset) });
    if (content.slice(token.offset, token.offset + token.content.length) !== token.content)
      throw new Error('Highlighted tokens do not match the authored example source.');
    if (token.content)
      result.push({
        content: token.content,
        color: token.htmlStyle.color,
        fontStyle: token.fontStyle,
      });
    cursor = token.offset + token.content.length;
  }
  if (cursor < content.length) result.push({ content: content.slice(cursor) });
  return result;
}
module.exports = { highlightSource };
