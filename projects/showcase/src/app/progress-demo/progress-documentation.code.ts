import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'progress',
  entryPoint: '@ngx-daisy/cdk/progress',
  summary: 'Show measurable or indeterminate progress with a native progress element.',
  usage: [
    'Use a known value and maximum for measurable tasks. Omit the value for work with unknown completion; progress is an output display rather than a form control.',
  ],
  angular: [
    'Bind value and max from the application task. Finite values clamp to the sanitized maximum. The wrapper does not start or track work.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Supply a meaningful label describing the task. Keep completion and failure messages available separately from the visual percentage.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'progress-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyProgress } from \'@ngx-daisy/cdk/progress\';\n\n@Component({\n  selector: \'app-progress-example\',\n  imports: [DsyProgress],\n  template: `\n    <progress\n      dsyProgress\n      [value]="72"\n      [max]="100"\n      label="Uploading project files"\n    ></progress>\n  `,\n})\nexport class ProgressUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
