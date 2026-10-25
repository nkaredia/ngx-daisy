# @ngx-daisy/cdk/collapse

Standalone Angular collapse family with daisyUI styling. See the [Data Display guide](../../../docs/data-display.md) for exports, examples, behavior and customization.

Use `trigger="button"` for a titlebar with an independent disclosure button. Project header content (including other controls) through `[dsyCollapseHeader]`; clicking the titlebar or those controls does not toggle the panel. Customize the button with `openLabel` and `closeLabel`. The default `trigger="title"` retains the whole-title button. Both modes support `opened`, `disabled`, focus restoration and ARIA relationships.

For a custom button, pass `triggerTemplate` a template whose implicit context is the collapse instance. The template owns the button's appearance, disabled state, accessible label, expanded/controls relationship and click handler. Use `collapse.id + '-trigger'` as its ID, `collapse.id + '-panel'` as aria-controls, and `collapse.toggle()` on click so focus restoration and panel labelling remain connected.

## daisyUI alignment

Uses native grid expansion. On closing, the region immediately becomes aria-hidden/inert and returns focus; hidden is applied after the grid transition, with a cleaned-up timeout fallback. Reduced motion closes immediately. The default indicator is now none, matching bare daisyUI; pass indicator="arrow" to retain the previous appearance. The button-only trigger remains available.
