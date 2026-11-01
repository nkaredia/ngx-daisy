const { spawnSync } = require('node:child_process');
const { existsSync, mkdirSync, symlinkSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Discover the standard SDK without modifying the developer's shell settings.
const environment = { ...process.env };
const sdk =
  environment.ANDROID_HOME ||
  environment.ANDROID_SDK_ROOT ||
  (process.platform === 'darwin' ? path.join(os.homedir(), 'Library/Android/sdk') : undefined);
if (sdk && existsSync(sdk)) {
  environment.ANDROID_HOME = sdk;
  environment.ANDROID_SDK_ROOT = sdk;
  environment.PATH = [
    path.join(sdk, 'platform-tools'),
    path.join(sdk, 'cmdline-tools/latest/bin'),
    environment.PATH,
  ]
    .filter(Boolean)
    .join(path.delimiter);
}
// Some native plugins resolve the core AAR from the app's node_modules instead
// of using Node resolution. Yarn workspaces hoist it to the repository root.
const core = path.dirname(require.resolve('@nativescript/core/package.json'));
const localCore = path.resolve(__dirname, '../node_modules/@nativescript/core');
if (!existsSync(localCore) && core !== localCore) {
  mkdirSync(path.dirname(localCore), { recursive: true });
  symlinkSync(core, localCore, 'dir');
}
const cli = require.resolve('nativescript/bin/tns');
const result = spawnSync(process.execPath, [cli, 'run', 'android', ...process.argv.slice(2)], {
  env: environment,
  stdio: 'inherit',
});
if (result.error) process.stderr.write(`${result.error.message}\n`);
process.exit(result.status ?? 1);
