# Custom themes

Import `DsyTheme`, `DsyThemeDefinition`, `defineDaisyTheme`, `DSY_THEME_TOKENS` and `exportDaisyTheme` from `@ngx-daisy/cdk/theme`.

The showcase's **Theme Builder** at `/themes` edits the native daisyUI theme contract: 20 color tokens, three radii, two base sizes, border width, depth, noise and color scheme. Start with any of the 35 built-in themes, save named themes in your browser, and apply one across showcase pages. The page follows daisyUI’s generator layout with a theme list, grouped color and geometry controls, and Components Demo, Component Variants and Color Palette previews. The CSS button opens the SCSS export dialog. Saving an existing name replaces that saved theme. Reset restores the selected starter.

The sidebar theme picker contains all 35 daisyUI built-ins and a separate **My themes** group for saved Theme Builder definitions. Built-in selections persist in the browser and apply across showcase routes. Selecting a custom theme applies its runtime tokens until another theme is chosen.

## Recommended application setup

Copy the generated `@plugin "daisyui/theme"` block into your global SCSS after your existing daisyUI plugin. Keep the usual Tailwind source path for `@ngx-daisy/cdk`. Then apply the name to your application root:

```html
<main data-theme="my-theme">
  <button dsyButton color="primary">Save changes</button>
</main>
```

This works with every component using the inherited theme tokens, including themed overlay panels. Nested `data-theme` scopes keep their own theme. Explicit utility or component styles still follow the CSS cascade. Colors do not automatically guarantee accessible contrast; verify your foreground/background combinations.

`default` and `prefersdark` in the exported plugin control the implicit default and system dark preference at CSS build time. Explicit `data-theme` takes precedence. They do not change OS preference handling in the runtime directive. See [daisyUI themes](https://daisyui.com/docs/themes/) and its [theme generator](https://daisyui.com/theme-generator/).

## Runtime definitions

Applications with a runtime editor can supply a complete typed definition:

```ts
import { defineDaisyTheme, DsyTheme, exportDaisyTheme } from '@ngx-daisy/cdk/theme';
import { brandTokens } from './brand-tokens';

const theme = defineDaisyTheme({
  name: 'brand',
  colorScheme: 'light',
  tokens: brandTokens, // All keys from DSY_THEME_TOKENS.
});
const scss = exportDaisyTheme(theme);
```

Import `DsyTheme` in your standalone component and use `<section [dsyTheme]="theme">…</section>`. Bind a new definition to update it. Bind `null` to restore previous inline values and the previous `data-theme`. Avoid independently binding `data-theme` or the same inline tokens on that host while the directive owns them. Other styles are preserved.

The helper validates completeness and prevents declaration delimiters in exported values. CSS color/length support depends on the browser; the showcase also checks browser support. It preserves authored CSS values (including OKLCH) without converting colors or bundling daisyUI presets in the library. Applications own persistence and selection; the showcase's local storage is not a library dependency.
