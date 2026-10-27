import type { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.ngxdaisy.showcase',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  // NativeScript calls its modern Yarn adapter yarn2; it also supports Yarn 4.
  cli: { packageManager: 'yarn2' },
  android: { v8Flags: '--expose_gc', markingMode: 'none' },
  ios: { discardUncaughtJsExceptions: false },
} satisfies Omit<NativeScriptConfig, 'cli'> & { cli: { packageManager: 'yarn2' } };
