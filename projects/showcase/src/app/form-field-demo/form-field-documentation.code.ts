import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'form-field',
  entryPoint: '@ngx-daisy/cdk/form-field',
  summary: 'Compose a control with a label, hint, error messages and optional adornments.',
  usage: [
    'Project exactly one supported field control. Use hints for guidance and error content for a correction. Prefixes and suffixes are for nearby icons, units or actions.',
  ],
  angular: [
    'The wrapper reads Angular form state and associates labels and visible descriptions. Errors appear when invalid and touched or after a parent form submission. DsyErrorStateMatcher customizes presentation without changing validators.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Use prefix/suffix projection slots for adornments and global dsy-field-* slot classes for wrapper styling. Native controls should not receive a competing second styled surface.',
  ],
  accessibility: [
    'Interactive prefix/suffix content must be a real named control. Keep meaningful labels visible and let error messages describe the remedy.',
  ],
  apiNotes: [
    {
      name: 'errorStateMatcher',
      description:
        'Inject a global matcher or supply one on the field control to customize when invalid state is displayed.',
    },
  ],
  files: [
    {
      path: 'form-field-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField, required, email } from '@angular/forms/signals';\nimport { DsyFormField, DsyHint, DsyError } from '@ngx-daisy/cdk/form-field';\nimport { DsyInput } from '@ngx-daisy/cdk/input';\n\n@Component({\n  selector: 'app-form-field-example',\n  imports: [DsyFormField, DsyHint, DsyError, FormField, DsyInput],\n  template: `\n    <dsy-form-field label=\"Email\"\n      ><input dsyInput type=\"email\" [formField]=\"fields.value\" /><dsy-hint\n        >Used for account updates.</dsy-hint\n      ><dsy-error>Enter a valid email.</dsy-error></dsy-form-field\n    >\n  `,\n})\nexport class FormFieldUsageExample {\n  readonly model = signal({ value: '' });\n  readonly fields = form(this.model, (path) => {\n    required(path.value);\n    email(path.value);\n  });\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
