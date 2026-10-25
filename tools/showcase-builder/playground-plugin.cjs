const { realpathSync } = require('node:fs');
const { dirname, relative, resolve } = require('node:path');
const { extractPlaygrounds } = require('./playground-extractor.cjs');

const namespace = 'ngx-daisy-playground';
const resolving = 'ngxDaisyPlaygroundResolving';

/** A loader for plain playground configuration modules, not Angular components. */
function createPlaygroundPlugin(logger, tsConfig) {
  return {
    name: namespace,
    setup(build) {
      const root = build.initialOptions.absWorkingDir;
      if (!root || !tsConfig) {
        throw new Error('Playground extraction requires a working directory and tsConfig.');
      }
      let extraction;
      build.onStart(() => {
        extraction = undefined;
      });
      build.onResolve({ filter: /(?:^|[/\\])playground(?:\.ts)?$/ }, async (args) => {
        if (args.pluginData?.[resolving]) return;
        const result = await build.resolve(args.path, {
          importer: args.importer,
          namespace: args.namespace,
          resolveDir: args.resolveDir,
          kind: args.kind,
          pluginData: { [resolving]: true },
        });
        if (result.errors.length) return { errors: result.errors, warnings: result.warnings };
        if (result.external || !result.path.endsWith('/playground.ts')) return;
        // The virtual path deliberately has no .ts suffix: Angular's compiler onLoad filter
        // must not consume this request before our loader can supply the generated module.
        return {
          path: `${result.path}.in-memory`,
          namespace,
          pluginData: { sourcePath: result.path },
        };
      });
      // Angular's incremental bundler watches metafile inputs, not arbitrary custom
      // loader watchFiles. Include our workspace analysis dependencies in that graph.
      build.onEnd(async (result) => {
        if (!extraction || !result.metafile) return;
        const { watchFiles } = await extraction;
        for (const file of watchFiles) {
          if (file.replaceAll('\\', '/').includes('/node_modules/')) continue;
          const key = relative(root, realpathSync(file)).replaceAll('\\', '/');
          result.metafile.inputs[key] ??= { bytes: 0, imports: [] };
        }
      });
      build.onLoad({ filter: /.*/, namespace }, async (args) => {
        extraction ??= extractPlaygrounds(tsConfig, root, logger);
        const { modules, watchFiles } = await extraction;
        const sourcePath = args.pluginData.sourcePath;
        const canonical = realpathSync(sourcePath);
        const key = [...modules.keys()].find((path) => realpathSync(path) === canonical);
        const contents = modules.get(key ?? resolve(sourcePath));
        if (!contents)
          throw new Error(`${sourcePath}: playground is not included by the build tsconfig.`);
        return {
          contents,
          loader: 'ts',
          resolveDir: dirname(sourcePath),
          // Refresh metadata when playgrounds, referenced components or type dependencies change.
          watchFiles,
        };
      });
    },
  };
}

module.exports = { createPlaygroundPlugin };
