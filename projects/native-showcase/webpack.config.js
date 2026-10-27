const webpack = require('@nativescript/webpack');
const path = require('node:path');

module.exports = (env) => {
  webpack.init(env);
  webpack.chainWebpack((config) => {
    // Consume the same packaged entry points that an installed native library exposes.
    config.resolve.alias
      .set('@ngx-daisy/core', path.resolve(__dirname, '../../dist/ngx-daisy-core'))
      .set('@ngx-daisy/native', path.resolve(__dirname, '../../dist/ngx-daisy-native'));
  });
  return webpack.resolveConfig();
};
