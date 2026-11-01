const path = require('node:path');
const ts = require('typescript');
const { extractPlaygrounds } = require('../../../tools/showcase-builder/playground-extractor.cjs');
// Each compilation owns its own non-emitting extraction. Rebuilds read fresh sources.
const compilations = new WeakMap();
module.exports = function nativePlaygroundLoader() {
  const callback = this.async();
  const root = path.resolve(__dirname, '../../..');
  let extraction = compilations.get(this._compilation);
  if (!extraction) {
    extraction = extractPlaygrounds('projects/native-showcase/tsconfig.json', root, { info() {} });
    compilations.set(this._compilation, extraction);
  }
  extraction
    .then(({ modules, watchFiles }) => {
      for (const file of watchFiles) this.addDependency(file);
      const source = modules.get(this.resourcePath);
      if (!source) throw new Error(`Missing native playground: ${this.resourcePath}`);
      // Plain configurations only; Angular still type-checks the authored module.
      callback(
        null,
        ts.transpileModule(source, {
          compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
        }).outputText,
      );
    })
    .catch(callback);
};
