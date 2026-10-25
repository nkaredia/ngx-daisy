const { createBuilder, targetFromTargetString } = require('@angular-devkit/architect');
const { executeDevServerBuilder } = require('@angular/build');
const { createPlaygroundPlugin } = require('./playground-plugin.cjs');

module.exports = createBuilder(async function* (options, context) {
  context.logger.info('Running showcase development server builder.');
  const target = targetFromTargetString(options.buildTarget);
  const buildOptions = await context.getTargetOptions(target);
  yield* executeDevServerBuilder(options, context, {
    buildPlugins: [createPlaygroundPlugin(context.logger, buildOptions.tsConfig)],
  });
});
