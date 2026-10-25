# Text Inputs

See the [Data Input integration and API guide](../../../docs/data-inputs.md) for Angular forms, composition, accessibility and customization.

## daisyUI alignment

`DsyInputWrapper` is exported for native input compositions: `<label dsyInputWrapper color="primary"><span>Search</span><input dsyInput [formControl]="search" /><kbd>⌘ K</kbd></label>`. The wrapper owns size/color/ghost/error appearance; nested DsyInput keeps native Angular value/disabled/ARIA behavior and does not add a second input surface. Wrapper colors/sizes/variant use the same API as DsyInput.
