import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'status',
  entryPoint: '@ngx-daisy/cdk/status',
  summary: 'Show a compact visual status marker beside a readable label.',
  usage: [
    'Use a status dot as supporting information for online, completed or warning states. Pair it with visible text rather than making color the only indicator.',
  ],
  angular: [
    'Set semantic color and size from application state. The component does not announce state changes automatically.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'A standalone meaningful dot needs an accessible name; a dot beside an equivalent label can be aria-hidden.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'status-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyStatus } from '@ngx-daisy/cdk/status';\n\n@Component({\n  selector: 'app-status-example',\n  imports: [DsyStatus],\n  template: `\n    <p><span dsyStatus color=\"success\" aria-hidden=\"true\"></span> Available</p>\n  `,\n})\nexport class StatusUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
