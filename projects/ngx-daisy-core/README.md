# @ngx-daisy/core

Platform-independent ngx-daisy design contracts. This package has no Angular, DOM or NativeScript runtime dependency.

- `@ngx-daisy/core/button`: semantic colors, sizes, variants, shapes and layout types.
- `@ngx-daisy/core/icon`: inherited and semantic icon color types.
- `@ngx-daisy/core/theme`: the daisyUI theme token contract, `defineDaisyTheme` validation, and shared light/dark definitions.

The existing web entry points re-export the shared types, so existing application imports remain valid.
Web-specific SCSS export stays in `@ngx-daisy/cdk/theme`; native conversion and application live in `@ngx-daisy/native/theme`.

Run `yarn build:core` to create `dist/ngx-daisy-core` before building either renderer.
The root `build:lib` and `build:native` commands do this automatically.
