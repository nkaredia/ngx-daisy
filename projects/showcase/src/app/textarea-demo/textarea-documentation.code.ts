import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'textarea',
  entryPoint: '@ngx-daisy/cdk/textarea',
  summary: 'Edit longer, multiline text with optional CDK autosizing.',
  usage: [
    'Choose sensible minimum and maximum rows for a message or description. Enable autosize to grow with content; manual mode keeps native vertical resizing.',
  ],
  angular: [
    'autosize, minRows and maxRows use the CDK measurement lifecycle. Bind the native textarea through Angular forms. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Apply width and spacing to the textarea. Autosizing uses CDK content-box measurement; manual mode keeps native resizing. Keep minRows/maxRows consistent with the surrounding layout.',
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
      path: 'textarea-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyTextarea } from '@ngx-daisy/cdk/textarea';\n\n@Component({\n  selector: 'app-textarea-example',\n  imports: [DsyTextarea, FormField],\n  template: `\n    <label\n      >Description\n      <textarea\n        dsyTextarea\n        autosize\n        [minRows]=\"3\"\n        [maxRows]=\"8\"\n        [formField]=\"fields.value\"\n      ></textarea>\n    </label>\n  `,\n})\nexport class TextareaUsageExample {\n  readonly model = signal({ value: '' });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
