# daisyUI configuration and customization

ngx-daisy uses the app's daisyUI CSS. It does not install its own themes, compile a second daisyUI bundle, or restrict theme names. Configure daisyUI through the app's global SCSS and compile it with Tailwind's PostCSS plugin.

The supported daisyUI 5 configuration surface is documented in the [official configuration guide](https://daisyui.com/docs/config/), with [themes](https://daisyui.com/docs/themes/) and [CSS variables](https://daisyui.com/docs/utilities/).

## Configuration ownership

| Option                | Where to configure it                                        | Library behavior                                                                                                                                 |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `themes`              | `@plugin "daisyui"`                                          | Any enabled theme, `all`, `false`, `--default` and `--prefersdark` work. The library inherits variables; it does not select a theme.             |
| Custom themes         | `@plugin "daisyui/theme"`                                    | Custom names, overrides of built-in themes, colors, sizes, radii, border width, depth, noise and color scheme pass through.                      |
| Nested themes         | `data-theme` on any ancestor or component host               | Each component uses the nearest inherited variables. Modal drawers stay in the projected DOM, so they retain the surrounding theme.              |
| `root`                | `@plugin "daisyui"`                                          | The app chooses the selector receiving default theme variables. Render components inside that scope or supply `data-theme`/variables explicitly. |
| `include` / `exclude` | `@plugin "daisyui"`                                          | The app controls emitted native daisyUI CSS, including base files such as `rootscrollgutter`. The library does not re-enable excluded CSS.       |
| `prefix`              | CSS plugin **and** `provideDaisyUI({ prefix })`              | Library-generated daisyUI classes use the same prefix. Angular selectors and `dsy-` classes stay unchanged.                                      |
| Tailwind prefix       | Tailwind import **and** `provideDaisyUI({ tailwindPrefix })` | Supports Tailwind's namespace, independently or combined with the daisyUI prefix.                                                                |
| `logs`                | `@plugin "daisyui"`                                          | Build logging remains controlled by daisyUI. There is no runtime log option.                                                                     |

No Angular provider is required with the default unprefixed configuration. Themes and other CSS options do not need duplicate Angular configuration. Prefixes need a provider because runtime class names cannot discover CSS build options.

## Default setup

```scss
@use 'tailwindcss';
// Adjust this path relative to your global SCSS file.
@source '../node_modules/@ngx-daisy/cdk';
@plugin 'daisyui' {
  themes: all;
  logs: false;
}
```

```html
<section data-theme="cupcake">
  <button dsyButton color="primary">Save</button>
  <div data-theme="dark">
    <dsy-loader variant="dots" color="primary" aria-label="Loading results" />
  </div>
</section>
```

`themes: false` removes daisyUI's theme definitions. Supply your own complete theme variables or a custom theme plugin. Excluding `button`, or omitting it from `include`, intentionally leaves `DsyButton` without native daisyUI styling. Icon and drawer interaction/layout styles, plus loader extension modes, belong to ngx-daisy. Default loader masks require the native loading CSS; include/exclude is not a way to remove Angular components or their styles.

## Prefixed classes

For daisyUI's `prefix: "d-"`, configure the Angular class renderer once:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideDaisyUI } from '@ngx-daisy/cdk/config';

export const appConfig: ApplicationConfig = {
  providers: [provideDaisyUI({ prefix: 'd-' })],
};
```

```scss
@use 'tailwindcss';
@source '../node_modules/@ngx-daisy/cdk';
@plugin 'daisyui' {
  prefix: 'd-';
  themes:
    light --default,
    dark --prefersdark;
  logs: false;
}

// Runtime prefix concatenation is not visible to Tailwind's source scanner.
// Explicitly include the library-generated prefixed classes.
@source inline('d-btn{,-neutral,-primary,-secondary,-accent,-info,-success,-warning,-error,-xs,-sm,-md,-lg,-xl,-outline,-soft,-ghost,-link,-dash}');
@source inline('d-drawer{,-toggle,-content,-side,-overlay,-open,-end}');
```

For a combined Tailwind prefix, the SCSS import becomes:

```scss
// Sass leaves this CSS import with its modifiers for Tailwind's PostCSS stage.
@import 'tailwindcss' prefix(tw);
@plugin 'daisyui' {
  prefix: 'd-';
}
@source inline('tw:d-btn{,-neutral,-primary,-secondary,-accent,-info,-success,-warning,-error,-xs,-sm,-md,-lg,-xl,-outline,-soft,-ghost,-link,-dash}');
@source inline('tw:d-drawer{,-toggle,-content,-side,-overlay,-open,-end}');
```

Use `provideDaisyUI({ prefix: 'd-', tailwindPrefix: 'tw' })`. A primary button then renders `tw:d-btn tw:d-btn-primary`. For a Tailwind prefix alone, omit `prefix` from both configurations and remove `d-` from the safelists. Supply Tailwind's prefix without a colon to the provider. Set this once per CSS configuration; use `data-theme` for runtime theme changes.

Consumer-written classes must use the configured spelling too. The library does not rewrite projected markup, `class`, `panelClass` or `backdropClass` strings. When generating projected class names dynamically, `injectDaisyUIClassName()` returns the same class-name formatter in an Angular injection context. Those generated classes also require complete literals or a safelist in the app's CSS sources.

With a Tailwind prefix, library-generated native classes also include daisyUI selector aliases, such as `d-btn` and `d-drawer-side`. daisyUI 5's conditional selectors and drawer variants still reference those non-Tailwind names. The actual component CSS is generated for `tw:d-*`; the aliases make its conditional selectors work and do not compile a second bundle. Keep a daisyUI prefix if other page styles use conflicting native class names. `injectDaisyUIClasses()` formats a class-list string with these aliases for projected controls that need the same compatibility; `injectDaisyUIClassName()` returns just one fully prefixed token. Safelist the fully prefixed classes in either case.

## Custom themes and scoped roots

```scss
@use 'tailwindcss';
@source '../node_modules/@ngx-daisy/cdk';
@plugin 'daisyui' {
  themes:
    light --default,
    dark --prefersdark;
  root: '#app-root';
}
@plugin 'daisyui/theme' {
  name: 'light';
  --color-primary: #3755b3;
  --color-primary-content: white;
  --radius-field: 0.75rem;
  --radius-box: 1.25rem;
  --radius-selector: 0.5rem;
  --size-field: 0.3rem;
  --size-selector: 0.3rem;
  --border: 2px;
  --depth: 0;
  --noise: 0;
}
```

Put `id="app-root"` on the application root. Here the custom plugin overrides the existing light theme; other values continue to come from that theme. For a new theme name with `themes: false`, define the complete theme using daisyUI's theme generator/template.

`root` scopes theme variables, not the entire stylesheet or Angular services. Shadow DOM still needs its own stylesheet placement and integration; setting `root` alone does not provide Shadow DOM encapsulation for these `ViewEncapsulation.None` components.

## Component styling

Native button classes and CSS variables work on the native button itself:

```html
<button dsyButton class="btn-circle" aria-label="Add">+</button>
<button dsyButton class="btn-sm md:btn-lg rounded-full px-8">Responsive button</button>
<button dsyButton color="primary" style="--btn-bg: rebeccapurple">Custom background</button>
<dsy-icon class="text-error text-2xl"
  ><svg><!-- artwork --></svg></dsy-icon
>
```

Omitting the button `size` input leaves daisyUI's default medium sizing, without adding a conflicting `btn-md` class. Use inputs or app classes for a given modifier; combining contradictory sizes/colors on the same element follows the CSS cascade. With daisyUI prefix `d-`, internal native button variables are also prefixed, for example `--d-btn-bg`. Shared theme variables such as `--color-primary`, `--radius-field`, `--border`, `--depth` and `--noise` keep their names. ngx-daisy custom properties always keep their `--dsy-` names.

The wrapper's defaults allow Tailwind utility overrides even when Angular injects component styles after the app's stylesheet. Consumer unlayered global styles and inline styles remain available. Icon sizing uses `--dsy-icon-size`, so `text-*` utilities can override its default size without an inline `font-size` winning unexpectedly.

The icon `size` and drawer `width` inputs can be omitted. Their visual defaults (`1em` and `18rem`) come from CSS fallbacks, leaving inherited `--dsy-icon-size` and `--dsy-drawer-width` values available to app styles. Setting an input explicitly sets that custom property inline. In side mode, `panelClass="w-80"` also resizes the sidebar's grid column to match the panel.

| Component     | Customization surface                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DsyButton`   | Native daisyUI button classes, shape/layout/state modifiers, responsive utilities, `glass`, theme tokens, native button variables and app styles.                              |
| `DsyIcon`     | Projected artwork, size/color inputs, utility classes, `--dsy-icon-size` and `--dsy-icon-color`.                                                                               |
| `DsyLoader`   | Semantic colors, scale via `--size-selector`, bar radius via `--radius-box`, column radius via `--radius-selector`, utility classes and documented `--dsy-loader-*` overrides. |
| Drawer family | Host classes, projected content, theme variables, panel/backdrop classes and documented `--dsy-drawer-*` properties.                                                           |

Theme tokens affect the components that use them: depth/noise, for example, affect native daisyUI button effects; a projected SVG does not gain a noise effect automatically. `DsyLoader` uses native masked `loading-*` artwork for default indeterminate modes; include the loading CSS. Determinate progress and explicit motion/speed overrides use library artwork. Calendar uses native calendar CSS: the react-day-picker root follows both prefixes; provider-owned rdp-* parts skip daisyUI's prefix but still use Tailwind's namespace. Apply provider styling to projected icons through that provider's supported API.

## Drawer customization

```html
<dsy-drawer
  #drawer
  [(opened)]="opened"
  aria-label="Navigation"
  panelClass="bg-primary text-primary-content rounded-box p-6"
  backdropClass="bg-black/60"
>
  <nav>
    <span class="is-drawer-open:font-semibold">Navigation</span>
    <button type="button" (click)="drawer.close()">Close</button>
  </nav>
</dsy-drawer>
```

Use the required container/content/drawer composition around this panel. The drawer includes a hidden, disabled checkbox that mirrors its signal state so daisyUI's `is-drawer-open:` and `is-drawer-close:` styling variants work. It is not a form control or a second source of state. Prefix those variants as documented by daisyUI, for example `tw:d-is-drawer-open:font-semibold`.

Angular owns `opened`, `mode`, position, focus, inertness and scroll locking. Use these inputs to change responsive behavior, so visual and accessibility state agree. Do not independently toggle the checkbox or use `lg:drawer-open` to force an Angular-closed panel visible. Closed drawers remain inert; styling a closed drawer does not create an interactive collapsed rail. Similarly, excluding daisyUI's root scroll helpers does not disable CDK modal scroll locking.

Keep structural overrides consistent with the interaction model. Reduced-motion preferences, native disabled controls and hidden/inert closed content retain their accessibility behavior.

## Verification

Run `yarn build` and `yarn test`. The tests include public prefix-provider integration checks and `yarn test:styles`, which compiles fourteen daisyUI configurations through the installed Tailwind/PostCSS plugins. The CSS checks cover all installed built-in themes, no themes, custom theme tokens, a scoped root, include/exclude, both prefix mechanisms, drawer styling variants and logging. Static browser fixtures with the actual compiled library SCSS are generated under `.angular/daisyui-compat/` for checking computed styles and cascade behavior.

## Actions styling

See [Actions](actions.md) for all six families and slot APIs. Button classes, Dropdown placement/state/menu classes, FAB/flower/replacement classes, Modal parts/placement/state classes and Swap states/animations all use the shared prefix renderer. Theme Controller is daisyUI's exception: its class receives only the daisyUI prefix, never Tailwind's namespace.

Modal and Drawer share document inertness/scroll locking and focus traps. Modal content remains in its theme scope; Dropdown uses a CDK portal and copies inherited custom properties, typography and direction onto a wrapper outside the panel after Angular rendering. Descendant selectors and ancestor attributes do not cross a portal; target a global panelClass. Use panelClass/backdropClass on Modals, panelClass on Dropdowns, buttonClass on Swaps and projected classes on FAB actions. Utility classes override visual defaults; keep interaction safeguards intact.

The CSS configuration matrix also checks all new native Actions class families, including prefixes and theme-controller selectors. Native include/exclude controls appearance; Angular structure and interaction remain owned by this library.

## Data Input styling

See [Data Inputs](data-inputs.md) for all 15 families, form-state styling and internal visual hooks. Native fields receive daisyUI color/size/variant classes through the shared prefix renderer. Form-bound errors follow Angular state instead of competing native CSS validity. Native unbound validators can use daisyUI's validator class. Rating shape/color, radio input, file input, OTP box/input/container and calendar panel/date hooks remain utility-overridable.

The Angular calendar uses daisyUI theme tokens; it does not depend on daisyUI's vendor-specific calendar engines. The fourteen-case CSS matrix compiles native Data Input classes and custom structural SCSS, including a Data Input include configuration. Class prefix safelists must cover the used native field families, their modifiers and rating mask classes.

## Data Display styling

See [Data Display](data-display.md) for all 19 families and slot APIs. All native family classes pass through the shared prefix renderer. Content wrappers accept projected markup and classes; disclosure heading/content and comparison stage/slider expose class inputs. Internal functional styles preserve hidden/inert, keyboard and motion behavior. The fourteen-case CSS matrix includes every Data Display class family and an explicit Data Display include configuration. Carousel scroll snapping, disclosure state, diff positioning and gallery selection are owned by Angular instead of CSS-only interaction tricks. Native table appearance composes with CDK table behavior.

## Remaining catalog styling

[Navigation, feedback, layout and mockups](remaining-components.md) cover the final 26 families. The fourteen-case CSS matrix checks their native classes, including Join utilities, tabs, tooltips, menus and mockup parts. Applications retain the same theme/root/include/exclude/prefix/logging controls. Megamenu and tooltip panels copy inherited theme tokens through CDK portals; use global selectors scoped to panelClass/tooltipClass because ancestor selectors do not cross portals. Toast outlets stay within their theme scope. New structural styles sit in a nested utilities layer so application utilities can override visual defaults.
