import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'checkbox',
  entryPoint: '@ngx-daisy/cdk/checkbox',
  summary: 'Select independent options with a native checkbox and optional mixed state.',
  usage: [
    'Use checkboxes for multiple independent selections. Bind indeterminate for a partial group selection and calculate aggregate selection in the application.',
  ],
  angular: [
    'The native checkbox keeps boolean form values. indeterminate is a separate visual model that clears after a user change. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Choose semantic color and a consistent control size. Preserve native focus and disabled/readonly presentation. Apply application classes to public surfaces instead of overriding Angular form-state safeguards.',
  ],
  accessibility: [
    'Provide a visible label or accessible name and associate supporting text with the control. Keep error messages available to assistive technology; do not communicate invalid state using color alone. Preserve native keyboard operation and a visible focus indicator.',
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
    {
      name: 'indeterminate',
      description: 'Separate two-way boolean model for a mixed checkbox. User change clears it.',
    },
  ],
  files: [
    {
      path: 'checkbox-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyCheckbox } from '@ngx-daisy/cdk/checkbox';\n\n@Component({\n  selector: 'app-checkbox-example',\n  imports: [DsyCheckbox, FormField],\n  template: `\n    <label\n      ><input dsyCheckbox type=\"checkbox\" [formField]=\"fields.value\" /> Email me\n      updates</label\n    >\n  `,\n})\nexport class CheckboxUsageExample {\n  readonly model = signal({ value: false });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
