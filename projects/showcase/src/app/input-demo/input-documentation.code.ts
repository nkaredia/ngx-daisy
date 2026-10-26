import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'input',
  entryPoint: '@ngx-daisy/cdk/input',
  summary: 'Enter and edit native text, numbers, dates and other supported input values.',
  usage: [
    'Use the native type attribute for email, password, date or number editing. Keep visible labels and provide instructions with a form field instead of using placeholders as labels.',
  ],
  angular: [
    'Native editing, IME, selection and Angular value conversion remain available. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Apply utilities to the native input or its supported wrapper. Omit size when using responsive daisyUI size classes. The bordered/ghost variants preserve native input appearance.',
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
  ],
  files: [
    {
      path: 'input-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyInput } from '@ngx-daisy/cdk/input';\n\n@Component({\n  selector: 'app-input-example',\n  imports: [DsyInput, FormField],\n  template: `\n    <label>Email <input dsyInput type=\"email\" [formField]=\"fields.value\" /></label>\n  `,\n})\nexport class InputUsageExample {\n  readonly model = signal({ value: '' });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
