# @ngx-daisy/cdk/table

Standalone Angular table family with daisyUI styling. See the [Data Display guide](../../../docs/data-display.md) for exports, examples, behavior and customization.

## daisyUI alignment

`DsyTableRow` (`tr[dsyTableRow]`) exposes boolean `hover` to generate native `row-hover` with configured prefixes. It composes with native rows and CDK row rendering.

## Scrollable table containers

When an application wraps the table in a scrolling container, give that container `tabindex="0"`, `role="region"` and a meaningful accessible name. This enables keyboard users to reach and scroll tables even when cells contain no interactive controls. Keep the native table and caption inside it; preserve a visible focus indicator. The showcase examples demonstrate named focusable scroll regions without changing table layout or size.
