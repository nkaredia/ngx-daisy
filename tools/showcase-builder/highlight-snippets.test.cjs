const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, writeFile, readFile, realpath, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { build } = require('esbuild');
const { createPlaygroundPlugin } = require('./playground-plugin.cjs');

test('highlights authored documentation snippets in build memory and refreshes edits', async () => {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'ngx-daisy-snippets-')));
  try {
    const path = join(root, 'button.code.ts');
    const original = `export const files = [
      {path:'example.ts', language:'typescript', content:'const value = true;\\r\\n'},
      {path:'example.html', language:'html', content:'<button>Save</button>\\n'},
      {path:'example.scss', language:'scss', content:'.button { color: red; }\\n'},
    ];`;
    await writeFile(path, original);
    const compile = async () => {
      const result = await build({
        absWorkingDir: root,
        stdin: { contents: "export { files } from './button.code';", resolveDir: root },
        bundle: true,
        write: false,
        format: 'esm',
        metafile: true,
        plugins: [createPlaygroundPlugin({}, 'tsconfig.json')],
      });
      assert.ok(result.metafile.inputs['button.code.ts']);
      const module = await import(
        `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
      );
      return module.files;
    };
    for (const file of await compile()) {
      assert.equal(file.tokens.map((token) => token.content).join(''), file.content);
      assert.ok(file.tokens.some((token) => token.color?.startsWith('light-dark(')));
    }
    assert.equal(await readFile(path, 'utf8'), original);
    await writeFile(path, original.replace('Save', 'Updated'));
    assert.equal((await compile())[1].content, '<button>Updated</button>\n');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
