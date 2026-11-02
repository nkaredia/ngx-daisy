# Lifted tab joining edge

The first inactive tab no longer draws a straight joining edge outside the rounded panel corner when a later tab is selected. Logical border colors mirror daisyUI's native exception across the separate accessible tablist without depending on prefixed internal variables.

Verified in the production Buttons showcase with the TypeScript tab selected. `showcase-seam.jpg` captures the result. `prefix-placement-results.json` records computed transparent joining edges for 160 cases: four placement/direction combinations across default, daisyUI prefix, Tailwind prefix, both prefixes, a custom theme, and all 35 preset themes. Browser fixtures used fresh revision URLs to avoid cached CSS.

Run `yarn test:styles`, then `node docs/showcase-design/lifted-seam/create-preset-fixture.cjs` to recreate the static fixtures under `.angular/daisyui-compat`. Serve that directory for browser inspection.

Validation: `yarn build`, 133 library tests, 36 showcase tests, and 14 CSS configurations passed. This is a visual seam regression check, not a new assistive-technology audit. Colors, sizing and syntax-highlighting themes are unchanged.
