import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'filter',
  entryPoint: '@ngx-daisy/cdk/filter',
  summary: 'Apply a single optional filter using a compact set of choices.',
  usage: [
    'Supply options with value, label and optional disabled fields. Clearing the filter selects null; an empty string remains an actual option value.',
  ],
  angular: [
    'DsyFilter is a composed Angular control with a nullable string value. Keep the filtering operation and result data in the application. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
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
  ],
  files: [
    {
      path: 'filter-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyFilter } from '@ngx-daisy/cdk/filter';\n\n@Component({\n  selector: 'app-filter-example',\n  imports: [DsyFilter, FormField],\n  template: `\n    <dsy-filter\n      [options]=\"[\n        { value: 'open', label: 'Open' },\n        { value: 'closed', label: 'Closed' },\n      ]\"\n      [formField]=\"fields.value\"\n      aria-label=\"Filter projects\"\n    />\n  `,\n})\nexport class FilterUsageExample {\n  readonly model = signal({ value: null as string | null });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
