const { spawnSync } = require('node:child_process');
const path = require('node:path');

const environment = { ...process.env };
function hasXcodeproj() {
  return (
    spawnSync('ruby', ['-e', "require 'xcodeproj'"], {
      env: environment,
      stdio: 'ignore',
    }).status === 0
  );
}

// Homebrew keeps CocoaPods gems separate from Ruby's default gem search path.
// Adjust this launch only; preserve the developer's shell and global Ruby settings.
if (!hasXcodeproj()) {
  const ruby = spawnSync('brew', ['--prefix', 'ruby'], { encoding: 'utf8' });
  const pods = spawnSync('brew', ['--prefix', 'cocoapods'], { encoding: 'utf8' });
  if (ruby.status === 0 && pods.status === 0) {
    environment.PATH = [path.join(ruby.stdout.trim(), 'bin'), environment.PATH]
      .filter(Boolean)
      .join(path.delimiter);
    const defaultGems = spawnSync('ruby', ['-e', 'puts Gem.default_path'], {
      env: environment,
      encoding: 'utf8',
    });
    environment.GEM_PATH = [
      path.join(pods.stdout.trim(), 'libexec'),
      ...(defaultGems.status === 0 ? defaultGems.stdout.trim().split('\n') : []),
      environment.GEM_PATH,
    ]
      .filter(Boolean)
      .join(path.delimiter);
  }
  if (!hasXcodeproj()) {
    process.stderr.write(
      'Ruby cannot load xcodeproj. Install/configure CocoaPods; see projects/native-showcase/README.md.\n',
    );
    process.exit(1);
  }
}

const cli = require.resolve('nativescript/bin/tns');
const result = spawnSync(process.execPath, [cli, 'run', 'ios', ...process.argv.slice(2)], {
  env: environment,
  stdio: 'inherit',
});
if (result.error) process.stderr.write(`${result.error.message}\n`);
process.exit(result.status ?? 1);
