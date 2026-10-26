import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'badge',
  entryPoint: '@ngx-daisy/cdk/badge',
  summary: 'Show a small status, count or classification label.',
  usage: [
    'Use a short label and semantic color. Prefer a descriptive status such as Approved over a colored dot when meaning matters.',
  ],
  angular: [
    'Apply DsyBadge to a span or use the component wrapper. Badge has no click, dismiss or selection behavior; compose a real button if an action is required.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Visible text should communicate the meaning without color. Announce changing counts through an appropriate application live region only when useful.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'badge-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyBadge } from \'@ngx-daisy/cdk/badge\';\n\n@Component({\n  selector: \'app-badge-example\',\n  imports: [DsyBadge],\n  template: `\n    <span dsyBadge color="success" variant="soft">Approved</span>\n    <span dsyBadge variant="outline">12 tasks</span>\n  `,\n})\nexport class BadgeUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
