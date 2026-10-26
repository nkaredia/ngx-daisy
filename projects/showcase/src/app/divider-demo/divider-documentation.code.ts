import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'divider',
  entryPoint: '@ngx-daisy/cdk/divider',
  summary: 'Separate adjacent groups with a line and optional short label.',
  usage: [
    'Use dividers to clarify related sections instead of adding one between every item. The public orientation describes the line itself.',
  ],
  angular: [
    'Project plain text when a label is useful. The horizontal line maps to daisyUI’s divider-vertical naming; vertical maps to divider-horizontal, while the public API keeps intuitive orientation.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'The separator’s ARIA orientation follows the public input. Do not use decorative lines as the only way to communicate grouping.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'divider-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyDivider } from '@ngx-daisy/cdk/divider';\n\n@Component({\n  selector: 'app-divider-example',\n  imports: [DsyDivider],\n  template: ` <dsy-divider>Account settings</dsy-divider> `,\n})\nexport class DividerUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
