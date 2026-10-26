import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'toggle',
  entryPoint: '@ngx-daisy/cdk/toggle',
  summary: 'Turn a setting on or off using a native checkbox with switch semantics.',
  usage: [
    'Use a toggle when a binary setting takes effect immediately. Keep its label stable between states; use a checkbox for a deferred form choice where that communicates the task better.',
  ],
  angular: [
    'The native checkbox value accessor remains in charge of checked state. Bind the Angular form field and let its schema control availability. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
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
      path: 'toggle-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyToggle } from '@ngx-daisy/cdk/toggle';\n\n@Component({\n  selector: 'app-toggle-example',\n  imports: [DsyToggle, FormField],\n  template: `\n    <label\n      ><input dsyToggle type=\"checkbox\" [formField]=\"fields.value\" /> Enable\n      notifications</label\n    >\n  `,\n})\nexport class ToggleUsageExample {\n  readonly model = signal({ value: true });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
