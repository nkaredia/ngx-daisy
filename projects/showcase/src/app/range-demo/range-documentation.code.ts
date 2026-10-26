import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'range',
  entryPoint: '@ngx-daisy/cdk/range',
  summary: 'Adjust a numeric value within native bounds and steps.',
  usage: [
    'Use a slider for an approximate value in a known range and show the current value beside it. Keep precise numeric entry available when exact values matter.',
  ],
  angular: [
    'Put bounds and validation in the Signal Forms schema. Without a form binding, use the native min, max, step and value attributes. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
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
      path: 'range-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField, min, max } from '@angular/forms/signals';\nimport { DsyRange } from '@ngx-daisy/cdk/range';\n\n@Component({\n  selector: 'app-range-example',\n  imports: [DsyRange, FormField],\n  template: `\n    <label>Volume <input dsyRange type=\"range\" [formField]=\"fields.value\" /></label>\n    <output>{{ model().value }}</output>\n  `,\n})\nexport class RangeUsageExample {\n  readonly model = signal({ value: 40 });\n  readonly fields = form(this.model, (path) => {\n    min(path.value, 0);\n    max(path.value, 100);\n  });\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
