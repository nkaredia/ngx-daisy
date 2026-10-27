# Native form composition

Select, Form Field and Fieldset extend the native Data Input catalog. They use the existing native Button, Modal, Radio and theme infrastructure, without an additional plugin or browser dependency.

| Family     | Entry point                    | Host                        | Responsibility                                                   |
| ---------- | ------------------------------ | --------------------------- | ---------------------------------------------------------------- |
| Select     | `@ngx-daisy/native/select`     | `GridLayout[dsySelect]`     | String-valued Signal Forms control with a native selection sheet |
| Form Field | `@ngx-daisy/native/form-field` | `StackLayout[dsyFormField]` | Label, required marker, helper/error text and native focus       |
| Fieldset   | `@ngx-daisy/native/fieldset`   | `StackLayout[dsyFieldset]`  | Themed visual grouping with a legend and description             |

## Select

Import `DsySelect`, `DsyFormField`, `DsyFieldset` and Angular's `FormField` in the consuming component. For example, define a string-valued model and schema:

```ts
readonly profile = signal({ region: '' });
readonly fields = form(this.profile, (path) => {
  required(path.region, { message: 'Choose a delivery region.' });
});
readonly regions: readonly DsySelectOption[] = [
  { value: 'us', label: 'United States', description: 'Delivery in 3–5 business days.' },
  { value: 'ca', label: 'Canada', description: 'Delivery in 5–8 business days.' },
  { value: 'other', label: 'More destinations', disabled: true },
];
```

```html
<StackLayout dsyFieldset legend="Delivery preferences" description="Choose your destination.">
  <StackLayout dsyFormField label="Delivery region" hint="Compare delivery estimates in the list.">
    <GridLayout
      dsySelect
      [formField]="fields.region"
      [options]="regions"
      placeholder="Choose your region"
    ></GridLayout>
  </StackLayout>
</StackLayout>
```

Select implements `FormValueControl<string>` with a `value` model; direct `[(value)]` also works. Options require unique string values and labels; descriptions and disabled state are optional. An unmatched value keeps the Angular model intact and displays the placeholder. No enabled options disables the trigger. This first native Select is single-selection and intended for short option lists; multi-select, search and virtualized lists are not implemented.

The trigger opens the shared native Modal presenter. Radio options update a draft, and Confirm commits an enabled option to the form. Cancel, native dismissal and the close button retain the current value. The complete option row is tappable. Select emits `touch` when its opened sheet closes. Disabled, read-only or hidden state closes an open sheet and guards further edits. Cancellation before presentation also clears the pending state without requiring a native close event. Native modal lifecycle owns back handling, presentation and dismissal; detached sheets inherit the declaring theme scope.

`label` and `description` override inherited Form Field metadata. `confirmText`, `cancelText` and `placeholder` are localizable. `dsyColor` and `size` configure the trigger; the radio choices use the semantic color. `triggerClass`, `optionClass` and `panelClass` expose internal visual surfaces. Scope styles through `.dsy-native-select` when overriding trigger borders/alignment. The native Button owns its text layout, so long selected labels may truncate; use concise labels and supporting descriptions in the sheet. `focus()` forwards to the native trigger when enabled.

## Form Field

Place one Angular `FormField` binding inside each wrapper. Form Field queries that binding's reactive `FieldState`, shows a required marker, replaces its hint with the first validation error after touch, and collapses when the field is hidden. It does not own the model, validators or a second value accessor. Multiple bindings in one wrapper are rejected; use separate wrappers inside a Fieldset.

Input, Textarea, Toggle, Checkbox, Radio Group, Range and Select inherit the wrapper's label and current help/error description when their explicit inputs are empty. Context flows through the exported `DSY_NATIVE_FIELD` token and `DsyNativeFieldContext` read-only signals, which custom native controls may also consume. Radio options keep their own accessible names and use the group context for supporting description. Standalone controls retain their own labels/fallbacks.

Tapping the wrapper's label asks the Angular field to focus its bound control. This is native focus forwarding, not a browser `for`/ARIA relationship. Error context is passed through native accessibility hints, and the message Label uses a polite live region where supported by the OS. Screen-reader announcement behavior still needs device testing. Explicit control label/description inputs take precedence over inherited metadata.

For controls used without Angular `FormField`, the wrapper can display `label`, `hint` and an explicit `error`. It cannot infer required/hidden state or focus a bound field in that mode. `errorFallback` supplies a localizable fallback when a validator has no message. Wrapper, label and message classes are `.dsy-native-form-field`, `.dsy-native-field-label`, `.dsy-native-field-message` and `.dsy-native-field-error`.

## Fieldset

Fieldset renders `legend`, optional `description`, and projected content inside a themed surface. It inherits base colors, border width and box radius. `legendClass` and `bodyClass` expose internal visual slots; the host accepts app utilities and native style overrides. `hidden` collapses the group. It does not disable or validate child controls: put group state in the Angular schema so controls and form state agree.

The showcase has separate Select, Form Field and Fieldset pages. Examples demonstrate delivery destinations with a disabled option, confirmation/cancellation, required selection errors, profile validation and label focus, and grouped address/contact preferences. All data stays in the local demo.

## Verification

Native unit tests cover inherited labels/hints, touched validation and recovery, explicit label overrides, hidden fields, focus forwarding, select draft confirmation/cancellation, unavailable options, external model preservation, disabled/read-only/hidden guards and early cancellation. Existing native input and switch-animation regression tests remain included.

On iPhone 17 / iOS 26.5, verified the native selection sheet, option-row taps, Cancel preserving United States after choosing Canada, confirmation changing the bound region to Canada, and clearing selection showing the schema error in both the helper Label and native accessibility hint. Verified required name validation, label tap focusing the input, typing to clear the error, and rendering grouped fields. These are simulator interactions and accessibility-tree inspection, not a screen-reader audit. Android rendering, native back behavior, large text and software-keyboard avoidance remain separate device checks.
