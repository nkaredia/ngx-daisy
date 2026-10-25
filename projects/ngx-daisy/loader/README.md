# Loader

`DsyLoader` displays an inline loading indicator, a section overlay or a page indicator. It provides seven visuals, daisyUI theme colors and motion controls. Ring and bar variants can also display percentage progress.

## Import and inline use

Import the standalone component from its secondary entry point:

```ts
import { DsyLoader } from 'ngx-daisy/loader';
```

Add `DsyLoader` to the consuming component's `imports`, then use it in the template:

```html
<dsy-loader aria-label="Loading results" />
<dsy-loader variant="dots" size="sm" color="primary" aria-label="Saving changes" showLabel />
```

The default is an active, medium, inline spinner that inherits text color. The label is available to assistive technology even when it is visually hidden. `showLabel` makes the same label visible.

## Variants and motion

Variants are `spinner`, `ring`, `dots`, `bars`, `ball`, `infinity` and `bar`. Each has its own CSS visual and default animation. `animation="auto"` selects that default; `spin`, `pulse` and `bounce` override it. `none` makes the indicator static.

```html
<dsy-loader variant="bar" animation="pulse" speed="slow" aria-label="Preparing report" />
<dsy-loader variant="bars" animation="bounce" speed="fast" aria-label="Loading chart" />
<dsy-loader variant="ring" animation="none" aria-label="Waiting for connection" />
```

`speed` supports `slow`, `normal` and `fast`. Native masks supply their own animation; extended modes use CSS keyframes. Reduced motion uses static artwork and disables keyframes/transitions. Determinate rings and bars stop repeating animations; their values transition when updated. `animation="none"` also disables these transitions.

## Progress

Set `value` on `ring` or `bar` to show known percentage progress:

```html
<dsy-loader
  variant="ring"
  [value]="uploadProgress()"
  color="success"
  aria-label="Upload progress"
/>
<dsy-loader variant="bar" [value]="75" color="primary" aria-label="Download progress" showLabel />
```

A value must be finite. Values below 0 are clamped to 0; values above 100 are clamped to 100. A null value selects indeterminate loading. Nonfinite values and values supplied to other variants are rejected.

Determinate loaders use `role="progressbar"`, a minimum of 0, a maximum of 100 and the normalized current value. The label describes the operation; it is not automatically replaced with a percentage.

## Section overlays

Give the containing element relative positioning. The overlay fills that element:

```html
<div class="relative min-h-48">
  <section [attr.aria-busy]="loading()" aria-label="Search results">
    <!-- Results content -->
  </section>
  <dsy-loader
    placement="overlay"
    variant="dots"
    [active]="loading()"
    color="primary"
    aria-label="Loading search results"
    showLabel
  />
</div>
```

The busy content and loader's status element are separate. This keeps the status announcement outside the region marked busy.

## Page placement

Page placement uses a fixed backdrop that covers the viewport. Place it near the app root, outside ancestors with transforms, filters or containment that could constrain its coverage or stacking:

```html
<main [attr.aria-busy]="loadingPage()">
  <!-- Page content -->
</main>
<dsy-loader
  placement="page"
  [active]="loadingPage()"
  variant="spinner"
  size="lg"
  aria-label="Loading dashboard"
  showLabel
/>
```

Overlay and page placements are visual indicators, not modal dialogs. The backdrop blocks pointer clicks, but does not manage focus, keyboard access, inert content or scroll locking. The app controls those behaviors and starts or stops the loader. When `active` is false, the host is hidden and its content and loading semantics are removed.

## Inputs

| Input        | Default   | Values or purpose                                                                      |
| ------------ | --------- | -------------------------------------------------------------------------------------- |
| `variant`    | `spinner` | `spinner`, `ring`, `dots`, `bars`, `ball`, `infinity`, `bar`.                          |
| `placement`  | `inline`  | `inline`, `overlay`, `page`.                                                           |
| `size`       | `md`      | `xs`, `sm`, `md`, `lg`, `xl`.                                                          |
| `color`      | `inherit` | Inherit text color or choose a semantic daisyUI color.                                 |
| `animation`  | `auto`    | `auto`, `spin`, `pulse`, `bounce`, `none`.                                             |
| `speed`      | `normal`  | `slow`, `normal`, `fast`.                                                              |
| `active`     | `true`    | Show the loader and expose its loading semantics.                                      |
| `showLabel`  | `false`   | Make the accessible label visible.                                                     |
| `aria-label` | `Loading` | Describe the operation; whitespace is trimmed and a blank label falls back to Loading. |
| `value`      | `null`    | Finite number for ring/bar percentage progress; null means indeterminate.              |

Semantic colors are `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning` and `error`. They follow the active daisyUI theme.

The entry point also exports `DsyLoaderVariant`, `DsyLoaderPlacement`, `DsyLoaderSize`, `DsyLoaderColor`, `DsyLoaderAnimation` and `DsyLoaderSpeed` types.

## Custom styling

Use the size presets for a consistent scale, or CSS custom properties for custom dimensions and colors:

```html
<dsy-loader
  variant="ring"
  aria-label="Preparing export"
  style="--dsy-loader-size: 3rem; --dsy-loader-color: #7c3aed"
/>
```

| Custom property           | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `--dsy-loader-size`       | Custom CSS size, overriding the size preset.     |
| `--dsy-loader-bar-height` | Height of the bar variant.                       |
| `--dsy-loader-color`      | Arbitrary CSS color for the visual.              |
| `--dsy-loader-duration`   | Animation duration, overriding the speed preset. |
| `--dsy-loader-backdrop`   | Background for overlay and page placements.      |
| `--dsy-loader-z-index`    | Stacking level for overlay and page placements.  |

These properties accept CSS values; the `size` input itself accepts only the five presets. The bar variant fills its container's width and uses `--dsy-loader-bar-height` for thickness; `--dsy-loader-size` controls the other variants. Custom animation duration still respects `animation="none"`, determinate progress and reduced motion.

Size presets scale with the inherited daisyUI `--size-selector` token. Bar tracks use `--radius-box` and bar columns use `--radius-selector`. Explicit `--dsy-loader-size` and `--dsy-loader-bar-height` overrides still take priority over those presets. See [daisyUI customization](../../../docs/daisyui-customization.md) for theme tokens, app utilities and configuration. The loader's own CSS/SVG visuals are independent of daisyUI's masked `loading-*` artwork.

## Accessibility

Indeterminate loaders use `role="status"` and contain actual label text. Keep the default hidden label or use `showLabel` to display it. Set a specific label such as “Loading account details” when context is useful.

Set `aria-busy` on the affected content region separately from the loader's status element. Place status announcements outside a busy region when they should be announced immediately. The loader does not set `aria-busy` on surrounding content.

The app decides whether users can keep interacting with content while it loads. In overlay/page modes, coordinate keyboard access as well as the pointer-blocking backdrop, and restore any app-managed interaction state when loading ends.

## daisyUI alignment

The six indeterminate native variants now use daisyUI `loading`/`loading-*` masks for auto animation at normal speed. Include `loading` in daisyUI CSS. Sizes follow native 4/5/6/7/8 selector-unit widths. Bar/determinate indicators and explicitly selected motion/speed remain library extensions. Reduced motion hides the animated native mask and shows static fallback artwork. `--dsy-loader-size` still overrides size.
