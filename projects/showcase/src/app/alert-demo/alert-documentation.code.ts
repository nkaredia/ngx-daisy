import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'alert',
  entryPoint: '@ngx-daisy/cdk/alert',
  summary: 'Present contextual information, success, warnings or errors in a message surface.',
  usage: [
    'Keep messages concise and actionable. Choose assertive announcements only for urgent feedback and use announcement="off" for static examples or content already announced elsewhere.',
  ],
  angular: [
    'DsyAlert is a content wrapper. Applications own visibility, dismissal and any projected action handlers. The default announcement is polite.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Semantic color supports the message but cannot replace it. Provide real, named buttons for actions; do not announce the same update through several live regions.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'alert-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyAlert } from '@ngx-daisy/cdk/alert';\n\n@Component({\n  selector: 'app-alert-example',\n  imports: [DsyAlert],\n  template: ` <dsy-alert color=\"success\">Your changes were saved.</dsy-alert> `,\n})\nexport class AlertUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
