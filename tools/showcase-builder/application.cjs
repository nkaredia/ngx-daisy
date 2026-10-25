const { createBuilder } = require('@angular-devkit/architect');
const { buildApplication } = require('@angular/build');
const { createPlaygroundPlugin } = require('./playground-plugin.cjs');

module.exports = createBuilder(async function* (options, context) {
  context.logger.info('Running showcase application builder.');
  yield* buildApplication(options, context, {
    codePlugins: [createPlaygroundPlugin(context.logger, options.tsConfig)],
  });
});
