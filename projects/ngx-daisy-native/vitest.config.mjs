import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// NativeScript selects index.ios/index.android at device bundle time. Browser unit
// tests have neither platform; native image creation is verified separately.
export default defineConfig({
  resolve: {
    alias: {
      '@nativescript-community/ui-svg': fileURLToPath(
        new URL('./testing/svg.mock.mjs', import.meta.url),
      ),
    },
  },
});
