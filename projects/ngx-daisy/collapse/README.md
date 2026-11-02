# @ngx-daisy/cdk/collapse

Standalone Angular collapse family with daisyUI styling. See the [Data Display guide](../../../docs/data-display.md) for exports, examples, behavior and customization.

Use `trigger="button"` for a titlebar with an independent disclosure button. Project header content (including other controls) through `[dsyCollapseHeader]`; clicking the titlebar or those controls does not toggle the panel. Customize the button with `openLabel` and `closeLabel`. The default `trigger="title"` retains the whole-title button. Both modes support `opened`, `disabled`, focus restoration and ARIA relationships.

For a custom button, pass `triggerTemplate` a template whose implicit context is the collapse instance. The template owns the button's appearance, disabled state, accessible label, expanded/controls relationship and click handler. Use `collapse.id + '-trigger'` as its ID, `collapse.id + '-panel'` as aria-controls, and `collapse.toggle()` on click so focus restoration and panel labelling remain connected.

## daisyUI alignment

Uses native grid expansion. On closing, the region immediately becomes aria-hidden/inert and returns focus; hidden is applied after the grid transition, with a cleaned-up timeout fallback. Reduced motion closes immediately. The default indicator is now none, matching bare daisyUI; pass indicator="arrow" to retain the previous appearance. The button-only trigger remains available.

## Angular Aria interaction

Enabled built-in title and button-only triggers use Angular Aria's accordion trigger, panel and content directives. Standalone Collapse creates its own internal keyboard group. Within DsyAccordion, triggers share the group's interaction context through the public `ACCORDION_GROUP` token. Existing daisyUI classes, slot classes, models, IDs, reduced-motion behavior and close transitions remain owned by the wrapper.

Native-disabled triggers stay native and disabled, and are excluded from the group's enabled-trigger list. Disabling does not prevent application-driven `opened` changes. Caller-authored `triggerTemplate` markup remains a compatibility path with its existing responsibilities; it is not silently converted into an Aria directive and does not join the built-in arrow-key list.

Panel content is retained after its first attachment. Projected Angular components and form state remain application-owned. Switching trigger mode or disabled/custom-template branches may replace the internal trigger/panel views; do not cache their DOM nodes. Obtain fresh elements when inspecting the current control. Editing keys in panel content and independent titlebar controls do not enter the accordion's disclosure key handler.

No application-facing Aria imports are required. Consumers install the declared `@angular/aria` peer alongside a matching Angular CDK version.
