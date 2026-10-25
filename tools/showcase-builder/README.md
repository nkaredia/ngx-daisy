# Showcase builders

Private Yarn workspace package for the showcase build pipeline. Architect loads the CommonJS entry files directly.

- `application` runs for `yarn build:showcase` and `ng build showcase`.
- `dev-server` runs for `yarn start` and `ng serve showcase`.

Both entries call Angular's exported build APIs with the `ngx-daisy-playground` esbuild plugin (`codePlugins` for builds, `buildPlugins` for serving). These extension APIs are marked experimental/unsupported by Angular; verify both workflows on upgrades. Architect owns cancellation and Angular registers teardown callbacks on the supplied context.

## Playground discovery and generated props

The plugin registers a loader for imports resolving to a file named exactly `playground.ts`. Each imported file declares an object named `playground` with a `components` array:

```ts
import { DsyButton } from 'ngx-daisy/button';
import type { Playground } from '../playground/playground.types';

export const playground: Playground = {
  components: [
    {
      class: DsyButton,
      /**  Generate props during build  */
    },
  ],
};
```

Each entry needs a `class` reference and placeholder. The extractor resolves references with TypeScript's checker, including aliases and inherited members. This workspace's `ngx-daisy/*` imports resolve to authored library source rather than stale `dist` declarations. Other imports follow the active build tsconfig.

Metadata is inserted into a transformed copy held in a Map inside the build process. No authored source, generated JSON or temporary TS file is written. Prettier formats the transformed string in memory. The returned `props` includes input/model kind, property/public alias, read and transformed accepted types, required/optional/nullable flags, literal options, documentation, default expressions and safely recognized literal defaults. Initializers are never evaluated. The metadata contract remains provisional.

## Typed actions

`projects/showcase/src/app/playground/playground.types.ts` defines the authored playground, component entries, generated properties and the action-component registry. Every generated property has a discriminated `action`:

| Resolved value type                        | Action kind   | Configuration           |
| ------------------------------------------ | ------------- | ----------------------- |
| Literal union (including numeric literals) | `select`      | Typed literal `options` |
| Boolean                                    | `toggle`      | Boolean `options`       |
| String                                     | `text`        | —                       |
| Number                                     | `number`      | —                       |
| Complex/mixed broad type                   | `unsupported` | Explanation in `reason` |

Classification uses the read type, not a transform's potentially broad accepted type. Null and undefined flags remain on the property so the eventual renderer can handle unset/null separately. `PlaygroundActionComponents` requires a component entry for each action kind; the actual action UI components are not implemented yet. Unsupported types must not be presented as editable strings automatically.

## Loader lifecycle

`onResolve` delegates normal path resolution to esbuild, then redirects playground modules to our namespace with a virtual suffix. The suffix avoids Angular's earlier, namespace-independent `.ts` loader consuming the request. Our `onLoad` returns the transformed string with the TS loader and the original directory for resolving imports. Angular continues compiling referenced component classes normally. Playground configuration modules must remain plain TypeScript; Angular-decorated component declarations belong in their own files.

Extraction runs lazily when a playground is loaded. It prepares the tsconfig-included playground modules and tracks the extraction program's source/type dependencies via `watchFiles`. `onStart` clears the in-memory extraction promise for each build, including rebuilds. The plugin also annotates the in-memory metafile with workspace extraction dependencies so Angular’s outer incremental cache invalidates the bundle when those files change; loader watchFiles alone do not cover that cache. No imported playground means no extraction. Source-only discovery is not a reason to emit an unreferenced module.

This loader works at module loading time, after Angular has started compiling the original project. It is not a before-compilation compiler-host transform. Angular diagnostics/type checking still see authored source; the generated `props` is a runtime augmentation and is not automatically added to the authored module's inferred TypeScript type. The shared `Playground` contract models `props` as optional so consumers safely use `component.props ?? []`, including contexts where the loader is absent.

The extractor uses its own non-emitting TypeScript program, not Angular's in-memory compiler program. Outputs, selectors and additional composition requirements remain future work. The showcase uses the metadata for controls and a source-code viewer.

## Dependencies and verification

The manifests reuse installed Angular option schemas, copied by root postinstall into ignored local files. After an install with lifecycle scripts disabled, run `node tools/showcase-builder/sync-schemas.cjs`. Verify schema package layout and extension APIs during Angular upgrades. This package is workspace-only and assumes the node-modules linker.

Run `yarn test:builder`, `yarn build`, and `yarn start` for verification. Keep Architect and Angular build versions aligned.

## Authored example source

`example-source-extractor.cjs` resolves the actual preview class declarations from `previews` and `inlinePreviews[].component`, including aliases, and reads their complete TypeScript files as UTF-8. It recognizes Angular Component decorator aliases and literal templateUrl/styleUrl/styleUrls resources. Single-file examples include their original TypeScript and an extracted virtual HTML entry. Original file content is not trimmed, formatted or transpiled for display; comments, BOM and line endings remain intact. File labels are relative to the example directory.

The transformed config gains `exampleSources: [{ component, files: [{ path, language, content }] }]` in memory. Duplicate class references are collected once per config. Authored exampleSources is rejected to avoid conflicting definitions. Referenced resource files join the watch graph and in-memory metafile dependency annotations. Missing files and dynamic resource paths fail explicitly. Sources are data strings, not imports to execute, and no standalone source assets are emitted.

Tests cover exact source contents, alias resolution, multiple resources, single-file examples, unchanged authored files, HTML resource refreshes and failure on missing resources.

Shiki tokenizes TypeScript, HTML, SCSS and CSS during build-time source extraction. The in-memory source entries include optional `tokens` (content, dual-theme color and optional font-style flags). Token offsets preserve original gaps and line endings; joining token content reproduces the exact source. The browser renders tokens using text bindings, never innerHTML, and copies the original content. No Shiki runtime or grammars ship to the browser. Syntax highlighting uses Shiki's GitHub Light and GitHub Dark themes. Token colors use `light-dark()` and inherit the surrounding daisyUI color scheme, so the showcase theme switch updates the palette without re-tokenizing. The matching editor background and foreground can be overridden with `--example-code-background` and `--example-code-foreground`. Entries without tokens retain plain-text rendering.

Inline preview shells always display HTML source without a collapse toggle. For single-file examples, the builder extracts literal Angular `template` content as a virtual HTML entry and removes its TS embedding indentation; no file is written. External templates retain exact authored contents. Supporting TypeScript can be included through `inlinePreviews[].showTypescript` and the shell's `showTypescript` input. Button inline examples use static markup with no arrays, loops or local counter; full playground examples retain their complete source tabs.
