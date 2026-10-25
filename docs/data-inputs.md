# Data Inputs and Angular forms

All 15 families in the [daisyUI Data Input catalog](https://daisyui.com/components/input/) have dedicated secondary entry points and lazy showcase pages. `ngx-daisy/form-field` supplies the shared field composition.

The functional approach follows Angular Material's [native input](https://raw.githubusercontent.com/angular/components/main/src/material/input/input.md), [native select](https://raw.githubusercontent.com/angular/components/main/src/material/select/select.md), [radio group](https://raw.githubusercontent.com/angular/components/main/src/material/radio/radio.md) and [form-field](https://raw.githubusercontent.com/angular/components/main/src/material/form-field/form-field.md) patterns. CDK provides focus monitoring, radio navigation and textarea autosizing. There is no Angular Material dependency or Material visual theme.

## Catalog

| Family            | Import                 | Public control                                                  | Showcase       |
| ----------------- | ---------------------- | --------------------------------------------------------------- | -------------- |
| Calendar          | `ngx-daisy/calendar`   | `DsyCalendar`, `DsyDateAdapter`                                 | `/calendars`   |
| Checkbox          | `ngx-daisy/checkbox`   | `DsyCheckbox`                                                   | `/checkboxes`  |
| Fieldset          | `ngx-daisy/fieldset`   | `DsyFieldset`, `DsyLegend`                                      | `/fieldsets`   |
| File Input        | `ngx-daisy/file-input` | `DsyFileInput`                                                  | `/file-inputs` |
| Filter            | `ngx-daisy/filter`     | `DsyFilter`                                                     | `/filters`     |
| Label             | `ngx-daisy/label`      | `DsyLabel`, `DsyNativeLabel`, `DsyFloatingLabel`                | `/labels`      |
| Radio             | `ngx-daisy/radio`      | `DsyRadioGroup`, `DsyRadioButton`                               | `/radios`      |
| Range             | `ngx-daisy/range`      | `DsyRange`                                                      | `/ranges`      |
| Rating            | `ngx-daisy/rating`     | `DsyRating`                                                     | `/ratings`     |
| Select            | `ngx-daisy/select`     | `DsySelect`                                                     | `/selects`     |
| Text Input        | `ngx-daisy/input`      | `DsyInput`                                                      | `/inputs`      |
| Textarea          | `ngx-daisy/textarea`   | `DsyTextarea`                                                   | `/textareas`   |
| Toggle            | `ngx-daisy/toggle`     | `DsyToggle`                                                     | `/toggles`     |
| Validator         | `ngx-daisy/validator`  | `DsyValidator`, `DsyValidatorHint`                              | `/validators`  |
| OTP               | `ngx-daisy/otp`        | `DsyOtp`                                                        | `/otp`         |
| Shared Form Field | `ngx-daisy/form-field` | `DsyFormField`, `DsyHint`, `DsyError`, `DsyPrefix`, `DsySuffix` | `/form-fields` |

## Signal Forms first

This workspace uses Angular 22. Composed controls implement the stable [FormValueControl](https://angular.dev/guide/forms/signals/custom-controls) contract: a `value` model, optional form-state inputs, a `touch` output and a focus method. Angular 22 also connects these controls to Reactive Forms and ngModel. No additional ControlValueAccessor is registered for these controls.

Native input directives leave Angular's built-in native bindings and accessors in charge of values. This preserves native editing, IME, numeric conversion, checkbox behavior, select options and mobile pickers.

Import the controls and the appropriate forms directives in the consuming component:

```ts
import { Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { DsyInput } from 'ngx-daisy/input';
import { DsyFormField, DsyHint, DsyError } from 'ngx-daisy/form-field';

@Component({
  imports: [FormField, FormRoot, DsyInput, DsyFormField, DsyHint, DsyError],
  template: `
    <form [formRoot]="fields">
      <dsy-form-field label="Email">
        <input dsyInput type="email" [formField]="fields.email" />
        <dsy-hint>We'll use this address for updates.</dsy-hint>
        <dsy-error>
          @for (error of fields.email().errors(); track $index) {
            <span>{{ error.message }}</span>
          }
        </dsy-error>
      </dsy-form-field>
      <button type="submit">Save</button>
    </form>
  `,
})
export class ProfileForm {
  readonly model = signal({ email: '' });
  readonly fields = form(
    this.model,
    (path) => {
      required(path.email, { message: 'Email is required' });
      email(path.email, { message: 'Enter a valid email' });
    },
    {
      submission: {
        action: async () => {
          /* Save the model in the app. */
        },
      },
    },
  );
}
```

Configure Signal Forms constraints and availability in the schema: `required`, `min`, `max`, `minLength`, `maxLength`, `disabled`, `readonly`, and validation rules. Angular deliberately rejects conflicting native constraint attributes on `[formField]` nodes. For example, use `min(path.volume, 0)` and `max(path.volume, 100)` for a signal-bound slider.

Use one value owner: `[formField]`, `[formControl]`/`formControlName`, `ngModel`, or the composed control's `[(value)]` model. Do not combine them on the same control. `reset()` on a Signal Forms field resets interaction state; pass a value to reset data too, for example `fields().reset({email: ''})` or `fields.email().reset('')`. See [Angular form submission](https://angular.dev/guide/forms/signals/form-submission) for FormRoot, submission and reset semantics.

## Typed Reactive Forms and ngModel

```ts
readonly email = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.email],
});
readonly delivery = new FormControl<string | null>('email');
readonly code = new FormControl<string | null>('');
```

```html
<dsy-form-field label="Email">
  <input dsyInput [formControl]="email" />
  <dsy-error>Enter a valid email.</dsy-error>
</dsy-form-field>
<dsy-radio-group [formControl]="delivery" aria-label="Delivery method">
  <dsy-radio-button value="email">Email</dsy-radio-button>
  <dsy-radio-button value="sms">Text message</dsy-radio-button>
</dsy-radio-group>
<dsy-otp [formControl]="code" [length]="6" aria-label="Verification code" />
```

Import `ReactiveFormsModule` for reactive bindings, or `FormsModule` for ngModel. Form state changes, including programmatic touch, reset, disable and async validation, update the field without a user event. Native accessors retain their normal `updateOn` behavior. Composed controls use Angular 22's custom-control integration.

## Form Field, labels and validation

`<dsy-form-field>` requires exactly one projected field control. Supply `label="..."` or project `<dsy-label>`. It generates label associations for composed controls, keeps native label targeting, and focuses composed controls when the label is clicked. Required markers follow form metadata; `hideRequiredMarker` hides the visual asterisk. Native controls receive required accessibility state without adding another validation owner.

Project `<dsy-hint>` and `<dsy-error>` messages. Errors replace hints when the control is invalid and touched, or its reactive/template parent form has been submitted. Signal Forms submission marks invalid fields touched. The field associates the visible messages with `aria-describedby`, preserves consumer descriptions, and exposes error messages through a polite live region. Errors and hints support explicit `id` values.

Use `[dsyPrefix]` and `[dsySuffix]` for projected adornments. Interactive adornments remain real controls and need their own accessible names. Use global classes and theme variables to customize the wrapper's `dsy-field-*` slots. Inner native widths have utility-overridable defaults.

`DsyErrorStateMatcher` is injectable globally or supplied through `errorStateMatcher` on a field control. Override `isErrorState(state)` to select your application's display policy. The state includes invalid, touched, dirty, pending, disabled, submitted and whether an Angular form is bound. This changes presentation, not validation results.

`DsyValidator` can accompany `dsyInput`, `dsyTextarea` or `dsySelect`. With Angular binding, Angular validation controls the error appearance; native CSS validity is not a competing validator. Without Angular binding, it applies daisyUI's native `validator` class. `DsyValidatorHint` aliases `DsyError` and supports `<dsy-validator-hint>`. Use it within a form field for Angular error presentation; native unbound markup follows daisyUI's sibling validity rules.

Fieldsets use `<fieldset dsyFieldset>` and `<legend dsyLegend>`. Their native grouping and disabled behavior remain intact; disabling a native fieldset does not rewrite Angular model state. `DsyNativeLabel` styles `label[dsyLabel]` or `span[dsyLabel]`; labels that name controls need a native `for` association or a wrapped input. `<label dsyFloatingLabel>` supports daisyUI's floating label composition with a span and native input/select.

## Native input APIs

| Directive     | Selector                            | Additional behavior                                                      |
| ------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| `DsyInput`    | `input[dsyInput]`                   | Native text/number/date/password/etc. attributes and Angular bindings    |
| `DsyTextarea` | `textarea[dsyTextarea]`             | `autosize` false by default; `minRows`, `maxRows` use CDK autosizing     |
| `DsySelect`   | `select[dsySelect]`                 | Native options, optgroups, disabled options and multiple selection       |
| `DsyCheckbox` | `input[type=checkbox][dsyCheckbox]` | Two-way boolean `indeterminate`, cleared on user change                  |
| `DsyToggle`   | `input[type=checkbox][dsyToggle]`   | Native checkbox behavior with switch semantics                           |
| `DsyRange`    | `input[type=range][dsyRange]`       | Native numeric value, step/bounds/keyboard behavior; `vertical` modifier |

Each supports optional `color` (neutral, primary, secondary, accent, info, success, warning, error), optional `size` (xs, sm, md, lg, xl), `errorStateMatcher`, and `focus(options?)`. Omitting size preserves native daisyUI default/responsive utility sizing. Input, Textarea and Select support `variant="bordered"` (default) or `ghost`. Apply utility classes directly to the native element. Autosized textareas use the content-box measurement CDK expects, with padding-aware width constraints; manual textarea mode keeps vertical resizing. Project native labels rather than hiding names in placeholders.

Select intentionally follows Material's **native select** approach. Reactive/Template Forms support `[ngValue]`, `compareWith`, object values and multiple selections through Angular's standard accessors. Signal Forms native selects use their native value bindings. There is no custom listbox overlay, HTML option rendering, search or arbitrary projected interactive option content in this family. Use native option text, disabled attributes and optgroups.

## Composed input APIs

All composed controls accept `value: model<T|null>`, `disabled`, `readonly`, `required`, `invalid`, `touched`, `dirty`, `pending`, `errors`, `hidden`, `name`, `id`, `aria-label`, `aria-labelledby`, `aria-describedby` and `errorStateMatcher`. With a forms binding, let Angular supply form state. They expose `touch` on focus leaving the whole control, `focus(options?)`, and a reset hook for local UI state. Availability and business validation remain in the form schema or Angular validators.

### Radio

`<dsy-radio-group>` owns one value; project `<dsy-radio-button [value]="...">Label</dsy-radio-button>`. Groups support semantic color, size, `labelPosition="before|after"` and `compareWith` (Object.is by default). A radio button supports `disabled`, `aria-label` and `inputClass`. Native inputs share the group's generated name, and independent groups remain independent.

CDK arrow-key/Home/End navigation skips disabled choices and updates selection, including RTL horizontal direction. The selected enabled radio, or first enabled choice, is the tab stop. Readonly groups permit focus but prevent changes. Supply a group label through a form field or ARIA. Do not nest interactive controls inside radio labels.

### File Input

`<dsy-file-input>` edits `readonly File[] | null`. Inputs: `accept`, `multiple`, optional `capture="user|environment"`, semantic color, size, `variant="bordered|ghost"`, and `inputClass`. `selectionChange` emits on user selection or `clear()`. `clear()` clears the value and native picker. A form reset to `[]`/null clears the picker; files can be selected again afterward.

Browsers only allow users to populate native file inputs. Programmatic nonempty file values are app model data and do not populate the native picker. Do not submit an unrelated native form expecting it to serialize programmatically assigned files. Apps own upload transport, file constraints and security validation; accept filters are picker hints.

### Filter

`<dsy-filter [options]="options">` edits `string | null`. Each `DsyFilterOption` has `value`, `label` and optional `disabled`. Inputs also include semantic color, size and `resetLabel` (Clear filter). The native radio/filter appearance collapses other choices after selection; keyboard focus reveals choices according to daisyUI styling. Clearing changes only the filter's value, not the surrounding form. Readonly prevents changes while retaining keyboard exit.

### Rating

`<dsy-rating>` edits `number | null`. `max` is the number of shapes (default 5, clamped 1–20); `half` enables half steps; `allowClear` adds the zero/clear radio. `shape` supports star, star-2, heart and circle. `size` has the five daisyUI presets. `color` accepts a semantic name or CSS color (base-content by default); `itemClass` customizes the radio shapes.

Native radio keyboard behavior and labels describe each step, with disabled/readonly safeguards. Schema validation owns allowed values: for example, `required` alone does not mean a rating must exceed zero; apply a minimum rule when needed. Visual shape count is independent of application business rules unless the form supplies matching max metadata.

### OTP

`<dsy-otp>` edits `string | null`. `length` defaults to 6 and is clamped 1–8 to match daisyUI's box layout. `numeric` defaults true (ASCII digits); false allows text. Other inputs: `joined`, semantic color, size, `visualClass`, `inputClass`, `boxClass`. `completed` emits when user editing produces a complete code that differs from the previous value.

One native input supports paste, selection, keyboard editing and one-time-code autofill. Partial IME composition is not committed. The boxes are decorative and do not create six separate tab stops. Length/numeric settings shape editing; configure required/pattern/length validation in the form. Apps own verification and submission.

### Calendar

`<dsy-calendar>` edits an ISO date-only `YYYY-MM-DD` string or null. `min`, `max`, `dateFilter(date)`, `startAt`, `locale` and `firstDayOfWeek` control the view. `DsyDateAdapter` centralizes date-only parsing, localized formatting and day/month arithmetic. Its default uses Gregorian date-only values to avoid local/UTC offset changes and clamps month-end/year changes correctly.

Navigation uses arrows (day/week), Home/End (week bounds), PageUp/PageDown (month), Alt+PageUp/PageDown (year), and native Space/Enter selection. Unavailable dates are disabled and skipped. View bounds and filters restrict user selection; schema/business validators handle model validity, including values supplied programmatically. Changing the model updates the displayed month. `panelClass` and `dateClass(date)` customize the panel and date buttons.

DaisyUI's Calendar page supplies vendor-specific styles for Cally, React DayPicker and Vanilla Calendar Pro. This library implements an Angular calendar using shared daisyUI theme tokens rather than installing those vendor engines. It is an inline single-date calendar. Native `input type="date" dsyInput` is also supported. Date ranges, a popup datepicker, month/year selection views, other calendar systems and third-party calendar adapters are separate future components, not part of this inline control.

## Styling and verification

Consumers own Tailwind/daisyUI compilation, themes, scoped roots, include/exclude and prefixes. See [configuration](daisyui-customization.md). Native control classes use the shared renderer and compatibility aliases. Keep complete default class literals discoverable; custom prefixes need matching source safelists. Add all used modifiers, including field colors/sizes, ghost styles, range-vertical, rating masks/halves, OTP variants, fieldset/label/validator parts and filter button classes.

Composed controls expose internal class hooks where projection cannot reach the native visual element. These classes are app-owned and are not rewritten with prefixes. Theme variables, CSS colors and utilities remain available. Custom interaction safeguards stay in Angular; keep disabled/readonly/hidden/inert behavior and reduced-motion rules intact.

The full test suite covers value flow, touch/dirty, schema availability, Reactive Forms lifecycle events, async validation, form submission, object/multiple selection, native blur updates, OTP composition, file resets, date arithmetic and keyboard navigation. The CSS matrix compiles 14 configurations including the new families and an explicit Data Input include configuration. Browser fixtures are generated under `.angular/daisyui-compat/`.

Native input/select wrappers, Fieldset Label and the native-styled Angular Calendar are available; see their entry-point READMEs for composition examples and prefix behavior.
