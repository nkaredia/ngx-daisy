# Default subtle contrast adjustments

The user approved small color corrections as default component styling, while keeping larger visual changes deferred. This pass changes text only: theme background tokens, filled surfaces, borders, hue and chroma are retained. The earlier code-highlighting exclusion still applies.

## Scope

The corrections apply in explicit built-in `data-theme="light"` and `data-theme="dark"` scopes. Button uses daisyUI's native foreground hooks for primary/secondary outline, dashed, ghost and link variants, and the dark primary solid-button foreground. Native soft variants are unchanged. These are client-rendered Button hooks; server-only rendering retains native foregrounds until the client renders.

Showcase-owned primary text reuses the same corrected text token. This includes labels and API text; it does not globally replace daisyUI theme colors or force corrections on other component families.

| Checked normal-text pair              | Before |  After | Adjustment                           |
| ------------------------------------- | -----: | -----: | ------------------------------------ |
| Light secondary/pink text on base-100 | 3.66:1 | 4.69:1 | OKLCH lightness −0.06                |
| Dark primary/purple text on base-100  | 3.39:1 | 4.60:1 | OKLCH lightness +0.09                |
| Dark secondary/pink text on base-100  | 4.31:1 | 4.67:1 | OKLCH lightness +0.02                |
| Dark primary solid-button text        | 4.12:1 | 4.61:1 | Content lightness +0.04, capped at 1 |

Ratios are for the listed rendered pairs, not every background/state. A tinted surface can need a different correction. Hover/active filled-secondary states, soft colors, other semantic colors and other preset palettes are not certified by these results.

[Original/adjusted comparison](audits/2026-11-01-web/contrast-adjustments/comparison.png).

## Customization

Other named themes reset the correction tokens and keep native colors, including nested scopes. Customized palettes still named light/dark receive the bounded relative correction; check their actual contrast. Browsers without relative OKLCH support retain native colors.

To keep exact native colors, set the strength on the **theme scope**, where the derived values are computed:

```scss
[data-theme='dark'] {
  --dsy-contrast-strength: 0;
}
```

Applications may override these foreground hooks, leaving surfaces untouched:

- `--dsy-color-primary-text`
- `--dsy-color-secondary-text`
- `--dsy-color-primary-readable-content`

Native button hooks are namespaced by the daisyUI prefix; Tailwind's namespace does not change their names. Existing explicit foreground bindings and initially supplied CSS foreground hooks take precedence over the default correction. Foreground utilities such as `text-error` remain effective. Use the correction tokens above for reactive CSS customization of these defaults.

## Validation and remaining scope

Production core/library/showcase builds pass with the existing initial-bundle and theme-builder stylesheet warnings. The web library has 126 passing tests, including prefixed hooks, changing variants and application foreground overrides. Showcase tests pass (35), and all 14 CSS configurations compile. Browser checks cover default and combined-prefix fixtures, custom-theme boundaries, native-color opt-out and foreground utility overrides.

The [74-case browser summary](audits/2026-11-01-web/contrast-adjustments/summary.json) includes all 70 desktop dark routes, Buttons and Theme Controllers in desktop light, and Buttons in mobile light/dark. No document overflow was found. [Raw results](audits/2026-11-01-web/contrast-adjustments/browser-results.json.gz) retain remaining violations and incomplete checks. Code-highlighting accessibility is excluded.

Larger soft-color corrections, low-contrast semantic Link/Badge variants, primary text over stronger tinted surfaces, other preset themes and remaining interaction-state checks stay open. This partial correction is not an AA compliance claim. See the [deferred list](web-accessibility-deferred.md).
