import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'radial-progress',
  entryPoint: '@ngx-daisy/cdk/radial-progress',
  summary: 'Display a determinate percentage in a circular progress visualization.',
  usage: [
    'Use for a compact completion metric. Keep units and surrounding context clear, and choose a linear or indeterminate loader when a percentage would be misleading.',
  ],
  angular: [
    'Bind a 0–100 value. The component clamps finite values, supplies progressbar semantics and accepts a projected label or falls back to the percentage.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Use label to name the task. The visible number should complement an accessible name; decorative color alone should not indicate success or failure.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'radial-progress-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyRadialProgress } from '@ngx-daisy/cdk/radial-progress';\n\n@Component({\n  selector: 'app-radial-progress-example',\n  imports: [DsyRadialProgress],\n  template: `\n    <dsy-radial-progress [value]=\"72\" label=\"Project completion\"\n      >72%</dsy-radial-progress\n    >\n  `,\n})\nexport class RadialProgressUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
