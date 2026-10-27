# @ngx-daisy/native

NativeScript Angular implementation of the ngx-daisy design system. The native catalog includes all six Actions families, Icon and theme scopes. Other component categories remain future work.

The package uses standalone Angular components/directives, signals and SCSS. It does not depend on browser components, Angular CDK or daisyUI's browser stylesheet. An optional Tailwind bridge reuses daisyUI's public semantic color and radius configuration. Shared design contracts come from `@ngx-daisy/core`.

## Usage

Import `DsyButton` from `@ngx-daisy/native/button` and `DsyTheme` from `@ngx-daisy/native/theme` into a NativeScript standalone component. Use `NativeScriptCommonModule` and NativeScript's usual `NO_ERRORS_SCHEMA` for native element markup.

```html
<StackLayout [dsyTheme]="theme">
  <button
    dsyButton
    text="Continue"
    dsyColor="primary"
    [loading]="saving()"
    loadingText="Saving…"
    (pressed)="save()"
  ></button>
</StackLayout>
```

`theme` can be `DSY_LIGHT_THEME`, `DSY_DARK_THEME`, or a custom `DsyThemeDefinition` created with `defineDaisyTheme`. Apply a scope to each Page or modal root that needs a theme; modal roots do not automatically inherit another native view's scope. Scope inputs react to theme changes.

NativeScript's renderer applies the converted CSS variables to the scope and refreshes descendant styles. Colors, radii, border and field sizing share the web token names. The adapter converts OKLCH and other Color.js-supported colors to gamut-mapped sRGB, preserves alpha, and converts `rem` to density-independent units using a default reference size of 16. `px`, `dip` and unitless design lengths map to native density-independent units. Percentage dimensions, `em`, CSS expressions and unresolved variables are rejected before styles are applied. Set `[rootFontSize]` on the theme scope to change the reference size.

`--depth` and `--noise` remain in the contract but do not currently produce native shadow/noise effects. Soft surfaces are derived from each semantic color and the base surface. Native Button sizes derive from `--size-field`, with a minimum touch size of 44 density-independent units. Native minimum sizing differs intentionally from the compact web sizes.

## Native Tailwind styling

Install Tailwind 4, `@nativescript/tailwind` and daisyUI 5 in the consuming app. NativeScript's official Tailwind integration adapts generated utilities for native views. In the app's global SCSS:

```scss
// Leave browser preflight out of native apps.
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
@plugin '@ngx-daisy/native/tailwind';
@source './app';
```

Apply a `dsyTheme` scope, then use utilities such as `bg-base-200`, `text-primary`, `rounded-box`, `p-5` and `font-semibold` directly on NativeScript views. The bridge imports daisyUI's public `functions/variables` configuration rather than maintaining a second palette or radius map. Tailwind and daisyUI are optional build-time peers; apps using only the native component styles do not need the bridge.

Native layouts still use NativeScript's GridLayout/StackLayout and native layout properties. Browser daisyUI component CSS cannot be imported wholesale: selectors, browser states, shadows and runtime color expressions are not all native-compatible. Button therefore retains a small native SCSS adapter for its appearance and interaction states. Component styles load after global utilities; use native properties/inline styles for explicit Button overrides rather than relying on utility ordering against that adapter. Shared layout examples use utilities instead of repeated custom selectors.

## Button

`Button[dsyButton]` enhances an actual NativeScript Button rather than wrapping it in an additional layout. Set its `text` input; native buttons do not project arbitrary child content. Consumer classes are retained, and NativeScript inline styles/native layout properties can override the defaults.

| Input                | Default      | Supported values                                                   |
| -------------------- | ------------ | ------------------------------------------------------------------ |
| `text`               | empty        | Native button label                                                |
| `dsyColor`           | base surface | primary, secondary, accent, neutral, info, success, warning, error |
| `size`               | md           | xs, sm, md, lg, xl                                                 |
| `variant`            | solid        | solid, outline, soft, ghost, link                                  |
| `shape`              | normal       | normal, square, circle                                             |
| `dsyLayout`          | auto         | auto, wide, block                                                  |
| `disabled`           | false        | Boolean                                                            |
| `loading`            | false        | Boolean; disables activation and replaces the visible label        |
| `loadingText`        | Loading…     | Localizable loading label                                          |
| `active`             | false        | Selected appearance and native accessibility state                 |
| `accessibilityLabel` | text         | Explicit label, particularly for symbol-only buttons               |
| `accessibilityHint`  | empty        | Native screen reader hint                                          |

Use `dsyColor` for semantic palette names. NativeScript applies static attributes before Angular initializes inputs, so `color="primary"` would be interpreted as an invalid native text color. `dsyLayout` similarly avoids shadowing NativeScript’s `View.layout()` method. The native `color` property remains available for literal foreground overrides such as `color="#ffffff"`.

Use `(pressed)` for guarded native activation. It emits NativeScript `EventData`. Both disabled and loading states set `isEnabled=false`; the output also guards against synthetic activation. Loading preserves the action name in the accessible label and restores the original text afterward. Browser-only link, submit/reset, tabindex and ARIA attributes are not part of the native API.

This first native implementation uses a loading label rather than an animated spinner. Dashed borders, projected icon layouts and native depth/noise effects are not implemented yet. `DsyNativeButtonVariant` excludes the unsupported `dash` variant. A link variant changes emphasis; it remains a native button and apps own navigation.

## Development and verification

- `yarn build:native`: build core and the native package.
- `yarn check:native`: strict Angular/type checks, then AOT JavaScript bundles for iOS and Android. This does not produce an IPA/APK or run a device.
- `yarn test:native`: state, renderer-binding and theme-conversion tests in the Angular test environment. These do not replace native device/accessibility testing.
- `yarn native:ios` / `yarn native:android`: build the library and run the native showcase with NativeScript.

See [native showcase](../native-showcase/README.md) for local toolchain requirements and [native architecture](../../docs/native.md) for package boundaries.

## Other Actions and Icon

Import Dropdown, FAB, Modal, Swap, Theme Controller and Icon from their respective `/dropdown`, `/fab`, `/modal`, `/swap`, `/theme-controller` and `/icon` entry points. See the [native Actions guide](../../docs/native-actions.md) for composition, Signal Forms integration, native presentation and API differences.

Lucide and Font Awesome examples use app-owned SVG rendering and individual icon imports. The library remains provider-independent; see [native icon packs](../../docs/native-icons.md).

## Native Data Input

Input, Textarea and Toggle are available from `/input`, `/textarea` and `/toggle`. They bind real NativeScript text editors/switches to Angular Signal Forms, with native disabled/read-only/hidden behavior and inherited themes. See the [native Data Input guide](../../docs/native-data-inputs.md) for usage, styling, accessibility and platform differences.
