# Selects

See the [Data Input integration and API guide](../../../docs/data-inputs.md) for Angular forms, composition, accessibility and customization.

## daisyUI alignment

`DsySelectWrapper` is exported for native select compositions: `<label dsySelectWrapper><span>Framework</span><select dsySelect [formControl]="framework">...</select></label>`. The wrapper owns the select appearance and observes the nested control's error state. Angular's native accessors continue to own values, multiple selection and disabled state.
