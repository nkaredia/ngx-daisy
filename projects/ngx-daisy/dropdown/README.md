# Dropdown

See the [Actions integration and API guide](../../../docs/actions.md#dropdown) for composition, inputs, accessibility and customization.

## daisyUI alignment

Default menu items use native 0.375rem vertical spacing and 0.875rem text; the panel uses the documented compact surface/shadow dimensions. CDK placement and menu keyboard behavior remain intact. panelClass and consumer utilities continue to customize the surface.

## Keyboard focus

Keyboard-focused menu items keep the native tint and add a 2px inset outline using base-content, improving focus contrast without changing menu geometry or pointer-hover appearance. Panel focus uses the same foreground choice. `--dsy-dropdown-focus-color` customizes the indicator; preserve at least 3:1 contrast against adjacent colors. Forced-color mode uses the system Highlight color. Application utilities and panelClass remain available.
