# Native Data Input

The native Data Input catalog provides Input, Textarea, Toggle, Checkbox, Radio and Range. Each family has a secondary entry point and its own showcase page. These components use NativeScript views, not browser elements or CDK DOM behavior.

| Family   | Import                       | Native host             | Signal Forms contract      |
| -------- | ---------------------------- | ----------------------- | -------------------------- |
| Input    | `@ngx-daisy/native/input`    | `TextField[dsyInput]`   | `FormValueControl<string>` |
| Textarea | `@ngx-daisy/native/textarea` | `TextView[dsyTextarea]` | `FormValueControl<string>` |
| Toggle   | `@ngx-daisy/native/toggle`   | `Switch[dsyToggle]`     | `FormCheckboxControl`      |

| Family   | Import                       | Native host                                          | Signal Forms contract             |
| -------- | ---------------------------- | ---------------------------------------------------- | --------------------------------- |
| Checkbox | `@ngx-daisy/native/checkbox` | `Button[dsyCheckbox]`                                | `FormCheckboxControl`             |
| Radio    | `@ngx-daisy/native/radio`    | `StackLayout[dsyRadioGroup]` with `Button[dsyRadio]` | Group: `FormValueControl<string>` |
| Range    | `@ngx-daisy/native/range`    | `Slider[dsyRange]`                                   | `FormValueControl<number>`        |

## Forms and validation

```ts
import { signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { DsyInput } from '@ngx-daisy/native/input';
import { DsyTextarea } from '@ngx-daisy/native/textarea';
import { DsyToggle } from '@ngx-daisy/native/toggle';

// Include FormField and the components in the consuming component's imports.
readonly profile = signal({ name: '', bio: '', updates: true });
readonly fields = form(this.profile, (path) => {
  required(path.name, { message: 'Enter your name.' });
});
```

```html
<TextField
  dsyInput
  [formField]="fields.name"
  label="Display name"
  hint="Your name"
  autocapitalizationType="words"
></TextField>
<TextView
  dsyTextarea
  [formField]="fields.bio"
  label="Your bio"
  hint="Tell your story…"
  height="160"
></TextView>
<Switch dsyToggle [formField]="fields.updates" label="Project updates"></Switch>
```

Input and Textarea share `DsyTextControl`, exported from `/input` for native text-control extensions. They expose a string `value` model. Toggle exposes a boolean `checked` model. All three accept `disabled`, `readonly` and `hidden` from Signal Forms. Direct `[(value)]` / `[(checked)]` bindings also work without forms. Do not combine competing state owners on the same control or add a parallel CVA.

Text controls emit `touch` on native blur. Toggle emits it on a user change. Property echoes matching the current model are ignored, so initial binding and external model updates do not mark a field touched. Disabled, read-only and hidden controls reject stale native property changes and restore the view's current model value. Hidden controls collapse their native layout and are excluded from accessibility. Text read-only uses native `editable=false`; a read-only switch disables native interaction. `focus()` forwards to the native view and skips disabled/hidden controls.

Put validation and length constraints in Angular schemas. Native keyboard selection does not validate an email or number. Input is a string control even with `keyboardType="number"`; applications own numeric parsing. Text controls accept `invalid` and `touched` from Signal Forms, and show an error border after touch. Display error messages from field state beside the control. Give each control a `label` and include its helper/error context in `description`, which maps to the native accessibility hint. Do not assume browser ARIA label associations exist on native views.

## Native appearance

Text controls use theme colors, border width and field radius. `dsyColor` selects a semantic border color; `variant` is `bordered` (default) or `ghost`; `size` is xs/sm/md/lg/xl derived from the theme’s `--size-field` with at least a 44-unit touch surface. Textarea has a 128-unit minimum height; apps can set a larger native height. Semantic color, radius and utility overrides use the same native Tailwind integration as the rest of the library. Toggle keeps the operating system's switch geometry and supports `dsyColor` for its active track; web-only toggle sizing/indeterminate states are not claimed.

Native properties remain available on the hosts, including Input's `secure`, `keyboardType`, `returnKeyType`, autocorrect and autocapitalization, and Textarea's text wrapping and keyboard options. The components own `text`/`checked`, `isEnabled`, `editable`, visibility and accessibility labels/hints; use their Angular models and state inputs for those properties. Explicit native style properties and app utilities can override visual defaults. No new icon pack or animation dependency is introduced.

The showcase demonstrates editable account details, schema validation, read-only/disabled fields, a live bio preview, and notification settings. These examples are local demonstrations and do not persist or transmit profile data.

## Validation boundaries

Strict templates, both platform JavaScript bundles and targeted Signal Forms unit tests cover synchronization, native property echoes, blur/touch, validation display, read-only/disabled/hidden guards and focus forwarding. Native rendering, keyboard and interaction are additionally checked in the iPhone simulator. Android device rendering, VoiceOver/TalkBack and large text remain separate verification tasks.

Native host behavior follows the official [TextField](https://docs.nativescript.org/ui/text-field) and [TextView](https://docs.nativescript.org/ui/text-view) APIs.

### iPhone simulator pass

Verified on iPhone 17 / iOS 26.5: initial field values, typing and clearing the display name, required error feedback, correction and save feedback, multiline bio editing with a live character count/preview, and notification switch changes updating form state. Light and dark field surfaces were inspected; a focused invalid field retains the error border. Switches retain intrinsic native dimensions with themed checked and neutral unchecked tracks. These are simulator interactions, not a VoiceOver audit.

The native unit suite includes a regression check that changing checked state does not recolor or clip the iOS control, while semantic color changes still update its tint. Android device execution, screen readers, software-keyboard avoidance and large-text behavior remain pending.

### iOS switch animation

On iOS, Toggle applies the semantic active color directly to `UISwitch.onTintColor` when the view loads or its theme/color changes. UIKit retains its own thumb, inactive track and slide animation. Do not use checked-state background/foreground repainting for the iOS switch: NativeScript 9.1’s generic background setter enables clipping, which can cut off the iOS 26 glass thumb during a slide. Android retains its native themed CSS path. Explicit consumer `backgroundColor` styling still opts into NativeScript’s generic background behavior.

## Checkbox, Radio and Range

```html
<button dsyCheckbox [formField]="fields.gift" label="Gift wrapping"></button>
<StackLayout dsyRadioGroup [formField]="fields.delivery" label="Delivery method">
  <button dsyRadio optionValue="standard" label="Standard delivery"></button>
  <button dsyRadio optionValue="express" label="Express delivery"></button>
</StackLayout>
<Slider dsyRange [formField]="fields.budget" step="5" label="Monthly savings"></Slider>
```

Import `DsyCheckbox`, `DsyRadioGroup`/`DsyRadio` and `DsyRange` along with `FormField`. Checkbox and Radio use real native Buttons with native accessibility roles/state and visual marks, since NativeScript core has no cross-platform Checkbox or Radio view. Apps place descriptive Labels alongside these controls in a GridLayout. Their native text is reserved for the selection mark; provide the full accessible name through `label`, and helper context through `description`. They expose `dsyColor` and `size` (xs/sm/md/lg/xl) and inherit selector radius, field sizing, border and theme colors. Touch targets are at least 44 units. Radio is circular. Utility classes and native style properties can customize their surfaces.

Checkbox supports `checked` and `indeterminate` models. Activating mixed state selects it and clears mixed state. A parent can derive mixed state from a collection, as the showcase's “all extras” example does. A checkbox activation emits `touch`. Validation state uses Signal Forms `invalid` and `touched` inputs for the error border; validation rules remain in the schema.

Radio Group owns one string value. Options require distinct `optionValue` and `label` inputs; put every option inside a group, and bind `formField` to the group only. Group-level disabled/read-only/hidden state applies to all options; each option can also be individually disabled or hidden. Selection does not toggle off when activating the current option. An empty/unmatched value leaves all options unselected and can be validated with `required` in the schema. A selection emits group `touch`. Group `focus()` selects no value; it forwards native focus to the selected available option or first available option. These native Buttons use platform navigation and do not add browser CDK roving-tabindex behavior.

Range retains the native OS slider geometry and interaction. `min` and `max` receive schema constraints from Signal Forms, with 0 and 100 as defaults when no constraint is supplied. Configure these in Angular schemas; direct model usage can bind numeric inputs. `step` defaults to 1 and must be positive/finite (invalid steps safely fall back to 1). Values snap relative to the minimum, stay within bounds and avoid common decimal-step floating-point artifacts. `accessibilityStep` tracks the step. Native user value changes emit `touch`; matching property echoes do not. `dsyColor` tints the active track without replacing the native thumb.

External out-of-range values remain in the Angular model for validation, while the native presentation is bounded/snapped. Disabled/read-only/hidden sliders reject stale native changes and restore their presented value. Changing bounds or the model must not mark a form touched. Rendering a safe fallback for a non-finite value does not make the Angular model valid. Use a visible value label and bounds alongside the slider; the showcase also includes increase/decrease buttons. OS accessibility adjustment and external-keyboard behavior still require device testing.

The three showcase pages contain optional order extras with a mixed “select all” control, coordinated delivery choices, and an adjustable savings goal. Examples are local and do not purchase or connect to an account. They share the existing Tailwind/token setup and add no plugins or icon packages.

Native slider behavior follows the official [Slider API](https://docs.nativescript.org/ui/slider).

### Selection-control verification

On iPhone 17 / iOS 26.5, inspected the Checkbox, Radio and Range examples in the dark theme. Verified mixed “select all” becoming checked, an individual change restoring mixed state, radio selection updating the delivery summary, the slider retaining its $75 starting value after native bounds initialization, and increase-button changes updating both native slider position and the savings summary. Native slider bounds/value writes are guarded as a single transaction so initialization and bound coercion cannot change or touch the Angular form. The 44-test native suite includes that synchronous coercion sequence.

The simulator automation could not perform a slider drag (`noWindowsAvailable` from its coordinate-input service). Continuous drag feel, VoiceOver/TalkBack, Android rendering and large-text behavior remain device/manual checks. Bundle and unit validation do not establish those results.

For Select and the shared Form Field/Fieldset wrappers, see [native form composition](native-form-composition.md).
