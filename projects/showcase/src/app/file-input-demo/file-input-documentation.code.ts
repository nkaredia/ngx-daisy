import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'file-input',
  entryPoint: '@ngx-daisy/cdk/file-input',
  summary: 'Select one or more local files with a native file picker.',
  usage: [
    'Use accept and multiple to guide selection. Browser file filters are hints; the application and server own file validation, upload transport and progress.',
  ],
  angular: [
    'The composed control holds readonly File[] or null. Programmatic nonempty values do not populate the native picker; clear() or resetting to []/null clears it. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
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
      name: 'selectionChange / clear()',
      description:
        'User selection and clear() emit selection changes. Applications remain responsible for reading and uploading selected files.',
    },
  ],
  files: [
    {
      path: 'file-input-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyFileInput } from '@ngx-daisy/cdk/file-input';\n\n@Component({\n  selector: 'app-file-input-example',\n  imports: [DsyFileInput, FormField],\n  template: `\n    <dsy-file-input\n      accept=\"image/*\"\n      [formField]=\"fields.value\"\n      aria-label=\"Profile picture\"\n    />\n  `,\n})\nexport class FileInputUsageExample {\n  readonly model = signal({ value: null as readonly File[] | null });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
