# Native icon packs

`DsyIcon` stays a projection-only wrapper. Lucide and Font Awesome are demonstrated using their official SVG data, rendered by an app-owned native SVG view. Apps keep ownership of projected artwork and provider imports; no registry, discovery code or provider configuration is required.

## Built-in control icons

Library-owned UI icons use individual Lucide assets: close buttons, Select chevrons, menu selection marks, checkbox checked/mixed marks and radio indicators. Showcase navigation and actions also use Lucide. Font Awesome appears only in explicit provider-compatibility examples.

The internal `@ngx-daisy/native/control-icon` entry point renders decorative control images through `@nativescript-community/ui-svg`, which is a native package peer dependency. Lucide is a library dependency and only imported icons enter the app bundle. Existing Button-backed controls keep their native hosts, accessible labels, state and activation behavior. iOS uses original-color button images; Android uses density-aware image spans. Rendering follows inherited foreground color and alpha, updates on state/theme changes, cancels stale work and removes listeners on destruction. Image decorations stay outside accessibility traversal; native button images use the owning button's semantics.

This implementation does not change `DsyIcon` or install a provider for app content. Consumers still choose their own packages and rendering for projected icons. Web controls similarly use individual `@lucide/angular` directives; that package is a peer of `@ngx-daisy/cdk`.

## Why native SVG

The browser Angular components from Lucide and Font Awesome render DOM SVG and cannot be projected unchanged into NativeScript. The native showcase uses `@nativescript-community/ui-svg` instead. It renders SVG with native engines, without a WebView or DOM API. Imports and rendering for projected content belong to the app; internal control icons use the shared library renderer described above.

Official references: [Lucide packages](https://lucide.dev/packages), [NativeScript SVG plugin](https://github.com/nativescript-community/ui-canvas), [Font Awesome individual icon imports](https://docs.fontawesome.com/apis/javascript/tree-shaking).

## App setup

The showcase installs these app dependencies through Yarn:

```sh
yarn add @nativescript-community/ui-svg lucide @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons
```

Install only the packs your app needs. The SVG plugin has native dependencies, so rebuild the native app after adding it; a JavaScript-only refresh cannot add the iOS/Android renderer. Do not copy Font Awesome's full web font or browser CSS into a native app using this approach.

The reusable app-owned renderer lives in `projects/native-showcase/src/app/icons/`; its examples live in `projects/native-showcase/src/app/icon-example/`:

- `svg-artwork.ts` adapts any Lucide `IconNode` or Font Awesome `IconDefinition` to SVG artwork and serializes it without browser APIs.
- `app-svg-icon.ts` registers the native `AppSvgIcon` view. It renders artwork using the native inherited `color` property, including alpha, and redraws when that property changes.
- `icon-example.ts` imports only chosen icons; `icon-example.html` projects the renderer inside `DsyIcon`.

Consumers can reuse these small app-owned files or use a different provider's native renderer. Register the custom view once before bootstrap, as the showcase does in `src/main.ts`. Import `DsyIcon` from `@ngx-daisy/native/icon` in the consuming standalone Angular component.

## Lucide

```ts
import { House, Heart } from 'lucide';
import { lucideArtwork } from './svg-artwork';

readonly house = lucideArtwork(House);
readonly heart = lucideArtwork(Heart);
```

```html
<GridLayout dsyIcon [size]="24" dsyColor="primary" label="Home">
  <AppSvgIcon [artwork]="house" stretch="aspectFit" accessible="false"></AppSvgIcon>
</GridLayout>
```

All Lucide icons with the standard `IconNode` shape work through the same helper. There is no handwritten name-to-icon mapping and no global icon registration. Avoid importing `icons` or calling the browser `createIcons`/`createElement` helpers.

## Font Awesome

```ts
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { fontAwesomeArtwork } from './svg-artwork';

readonly house = fontAwesomeArtwork(faHouse);
readonly heart = fontAwesomeArtwork(faHeart);
readonly github = fontAwesomeArtwork(faGithub);
```

```html
<GridLayout dsyIcon [size]="32" dsyColor="error" label="Favorites">
  <AppSvgIcon [artwork]="heart" stretch="aspectFit" accessible="false"></AppSvgIcon>
</GridLayout>
```

Use a per-icon package path to keep collection barrels out of development bundles too. Free solid, regular and brand definitions share the same helper; it reads each definition's intrinsic view box and paths. The showcase does not demonstrate Pro/duotone styling or install licensed packs. There is no Font Awesome Angular/browser renderer dependency.

## Styling and accessibility

`DsyIcon` controls its native square size and semantic `dsyColor`. Semantic color is set on the wrapper and inherited by descendant native views. Labels inherit it automatically; the app-owned SVG view materializes that native color into SVG stroke/fill because an SVG document cannot inherit NativeScript CSS by itself. Images retain their semantic tint hook. Inherited color also works when `dsyColor` is omitted.

The renderer preserves Lucide outlines, Font Awesome fills, aspect ratios and theme color alpha. A theme change redraws SVG artwork through the native color property, without another icon lookup. Local provider colors/native properties can override inherited color, just as explicit provider styling can on the web. Other custom native provider views must support their own size/color inheritance; this wrapper does not introspect or adapt them.

Keep projected artwork noninteractive and `accessible="false"`. Supply `label` on the wrapper for a meaningful standalone image. Omit it for decorative icons and label the containing button instead. Native `size` is a positive finite DIP number, not a browser CSS length.

## Bundle and behavior checks

`yarn check:native` compiles both platform bundles, tests real Lucide and Font Awesome artwork conversion, and inspects both development bundles. The checks require exactly the selected Lucide icon modules (including shell controls), four individual Font Awesome modules, no Font Awesome collection barrels, and no Lucide browser renderers. Installing a package containing many icons does not mean its entire collection ships in the app.

The native SVG engine itself adds a native dependency; this is separate from the selected icon data. Provider licenses are copied into the showcase's `src/assets/licenses` directory, which NativeScript includes in app assets.

### Simulator verification

On iPhone 17 / iOS 26.5, verified Lucide outlines, Font Awesome free solid/regular/brand icons, 20/32/48-DIP size examples, semantic colors, inherited GitHub icon color, and live light/dark updates. The accessibility tree exposes labeled wrappers as images and omits decorative provider views. Both platform JavaScript bundles, three SVG conversion tests, bundle-content checks, and 23 native unit tests passed. Android native rendering and screen-reader operation remain unverified.

October 28: verified Lucide Select chevrons and selection checks, a theme-colored popover close icon with native dismissal, checkbox checked/mixed/disabled marks and form updates, and radio selection indicators on the same simulator. The full suite passes 73 native tests, including original-color iOS button images, theme changes, stale-work cancellation and Android density-aware image-span checks. Both native bundles pass selected-icon checks. Android image rendering is still covered by mocks and bundles rather than execution on a device.
