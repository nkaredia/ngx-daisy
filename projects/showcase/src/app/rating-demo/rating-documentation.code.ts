import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'rating',
  entryPoint: '@ngx-daisy/cdk/rating',
  summary: 'Select a numeric rating with native radio-based interaction.',
  usage: [
    'Set the max and allowClear options for the review scale. Use half ratings only when the scoring system accepts half steps.',
  ],
  angular: [
    'The composed value is nullable number state. Use readonly for a rating that can be inspected but not changed, rather than making decorative content interactive. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
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
      path: 'rating-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyRating } from '@ngx-daisy/cdk/rating';\n\n@Component({\n  selector: 'app-rating-example',\n  imports: [DsyRating, FormField],\n  template: `\n    <dsy-rating [formField]=\"fields.value\" aria-label=\"Rate your experience\" />\n  `,\n})\nexport class RatingUsageExample {\n  readonly model = signal({ value: null as number | null });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
