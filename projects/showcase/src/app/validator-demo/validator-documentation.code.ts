import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'validator',
  entryPoint: '@ngx-daisy/cdk/validator',
  summary: 'Present validation feedback using Angular form state or native unbound validity.',
  usage: [
    'Use the validator appearance to reinforce helpful field-level feedback. Explain how to correct a value instead of showing only an invalid border.',
  ],
  angular: [
    'With an Angular forms binding, Angular is the validation source. Without a binding, the native daisyUI validator class follows browser validity. Use DsyValidatorHint inside a form field for Angular error messages.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep labels and error descriptions associated with the field. Native unbound validator hints follow the expected sibling markup.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'validator-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyValidator, DsyValidatorHint } from \'@ngx-daisy/cdk/validator\';\nimport { DsyInput } from \'@ngx-daisy/cdk/input\';\n\n@Component({\n  selector: \'app-validator-example\',\n  imports: [DsyValidator, DsyValidatorHint, DsyInput],\n  template: `\n    <label for="validation-email">Email</label>\n    <input\n      id="validation-email"\n      dsyInput\n      dsyValidator\n      type="email"\n      required\n      aria-describedby="validation-email-error"\n    />\n    <dsy-validator-hint id="validation-email-error"\n      >Enter a valid email address.</dsy-validator-hint\n    >\n  `,\n})\nexport class ValidatorUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
