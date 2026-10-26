import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'select',
  entryPoint: '@ngx-daisy/cdk/select',
  summary: 'Choose from native text options, option groups and multiple selections.',
  usage: [
    'Prefer a native select for a compact choice list. Options are native text; this component does not add search, custom option HTML or an overlay listbox.',
  ],
  angular: [
    'Signal Forms use native option values. Reactive Forms and ngModel retain Angular’s ngValue, compareWith and multiple-selection support. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Use bordered/ghost appearance on the select or supported wrapper. Native options remain browser-controlled; there is no custom option-template surface.',
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
      path: 'select-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsySelect } from '@ngx-daisy/cdk/select';\n\n@Component({\n  selector: 'app-select-example',\n  imports: [DsySelect, FormField],\n  template: `\n    <label\n      >Visibility\n      <select dsySelect [formField]=\"fields.value\">\n        <option value=\"team\">Team</option>\n        <option value=\"private\">Private</option>\n      </select></label\n    >\n  `,\n})\nexport class SelectUsageExample {\n  readonly model = signal({ value: 'team' });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
