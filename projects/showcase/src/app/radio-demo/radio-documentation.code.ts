import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'radio',
  entryPoint: '@ngx-daisy/cdk/radio',
  summary: 'Choose exactly one value from a labeled group of options.',
  usage: [
    'Use radio choices when users should compare a short list without opening a select. Radio values can be objects when compareWith defines equality.',
  ],
  angular: [
    'DsyRadioGroup owns the value and native group name. Child buttons provide values, labels and per-choice disabled states. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Choose semantic color and a consistent control size. Preserve native focus and disabled/readonly presentation. Apply application classes to public surfaces instead of overriding Angular form-state safeguards.',
  ],
  accessibility: [
    'Provide a visible label or accessible name and associate supporting text with the control. Keep error messages available to assistive technology; do not communicate invalid state using color alone. Arrow keys, Home/End and RTL navigation skip disabled options.',
  ],
  apiNotes: [
    {
      name: 'focus(options?)',
      description: 'Focuses the field while preserving native input interaction.',
    },
    {
      name: 'Form state',
      description:
        'Native directives use Angular’s built-in accessors. Composed controls expose value and touch through Angular 22 custom-control integration; do not add a second value owner.',
    },
  ],
  files: [
    {
      path: 'radio-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyRadioGroup, DsyRadioButton } from '@ngx-daisy/cdk/radio';\n\n@Component({\n  selector: 'app-radio-example',\n  imports: [DsyRadioGroup, DsyRadioButton, FormField],\n  template: `\n    <dsy-radio-group [formField]=\"fields.value\" aria-label=\"Delivery method\"\n      ><dsy-radio-button value=\"email\">Email</dsy-radio-button\n      ><dsy-radio-button value=\"sms\">Text message</dsy-radio-button></dsy-radio-group\n    >\n  `,\n})\nexport class RadioUsageExample {\n  readonly model = signal({ value: 'email' as string | null });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
