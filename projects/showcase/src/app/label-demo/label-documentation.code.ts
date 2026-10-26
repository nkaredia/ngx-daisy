import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'label',
  entryPoint: '@ngx-daisy/cdk/label',
  summary: 'Style field labels, prefixes and floating labels while retaining native associations.',
  usage: [
    'Use a persistent label for every input. Floating labels are a layout choice and should still communicate a meaningful name when the field has a value.',
  ],
  angular: [
    'DsyNativeLabel styles label[dsyLabel] and span[dsyLabel]; DsyLabel supports the form-field projection slot. A floating label composes a span and native control.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'A styled span alone does not label a control. Wrap the input in a native label or associate label for with the input id.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'label-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyNativeLabel, DsyFloatingLabel } from \'@ngx-daisy/cdk/label\';\n\n@Component({\n  selector: \'app-label-example\',\n  imports: [DsyNativeLabel, DsyFloatingLabel],\n  template: `\n    <label dsyLabel for="contact-email">Email</label>\n    <input id="contact-email" type="email" />\n    <label dsyFloatingLabel\n      ><span>Project name</span><input type="text" placeholder="Project name"\n    /></label>\n  `,\n})\nexport class LabelUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
