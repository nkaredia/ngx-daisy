# @ngx-daisy/cdk/tabs

Standalone Angular tabs with daisyUI appearance. See the [component guide](../../../docs/remaining-components.md) for imports, APIs, examples and behavior. Showcase: `/tabs`.

## daisyUI alignment

The default variant is now default (unadorned native tabs); specify variant="border" for the previous appearance. Lifted panels inherit native top/bottom border/radius variables on the host, with a bridge for the separate accessible tablist. Box styling is applied once to the list. Vertical tabs place the panel beside the list. All keyboard/CDK behavior and hidden/inert inactive panels are retained.

Lifted tabs also mirror daisyUI’s first-inactive-tab border exception across the separate accessible tablist. This hides the heading edge beside the rounded panel corner when a later tab is active, for top/bottom placement and RTL. It uses native border/color tokens and preserves application overrides.
