import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'otp',
  entryPoint: '@ngx-daisy/cdk/otp',
  summary: 'Enter a short verification code across a coordinated set of character fields.',
  usage: [
    'Use the expected code length and an appropriate input mode for your verification workflow. The application verifies the code and handles retries and expiration.',
  ],
  angular: [
    'The composed value is a string or null. Paste is distributed across fields; changing focus within the group does not mark the whole field touched. Bind one value owner: Signal Forms, Reactive Forms, ngModel, or a supported value model. Do not combine them on the same field. Angular owns validation and disabled state; imports for a forms approach belong in the consuming standalone component.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
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
      path: 'otp-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { DsyOtp } from '@ngx-daisy/cdk/otp';\n\n@Component({\n  selector: 'app-otp-example',\n  imports: [DsyOtp, FormField],\n  template: `\n    <dsy-otp [length]=\"6\" [formField]=\"fields.value\" aria-label=\"Verification code\" />\n  `,\n})\nexport class OtpUsageExample {\n  readonly model = signal({ value: null as string | null });\n  readonly fields = form(this.model);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
