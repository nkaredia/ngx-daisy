import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'stat',
  entryPoint: '@ngx-daisy/cdk/stat',
  summary: 'Summarize a metric with its title, value, description and optional figure or action.',
  usage: [
    'Use clear units, a relevant comparison period and enough context to interpret a trend. Choose horizontal or vertical groups to suit the available width.',
  ],
  angular: [
    'Bind values from application data. Stats do not calculate changes, fetch metrics or periodically refresh their content.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Expose the metric title and units as text. Explain positive or negative changes beyond using color or an arrow alone.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'stat-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport {\n  DsyStats,\n  DsyStat,\n  DsyStatTitle,\n  DsyStatValue,\n  DsyStatDesc,\n} from '@ngx-daisy/cdk/stat';\n\n@Component({\n  selector: 'app-stat-example',\n  imports: [DsyStats, DsyStat, DsyStatTitle, DsyStatValue, DsyStatDesc],\n  template: `\n    <div dsyStats>\n      <div dsyStat>\n        <div dsyStatTitle>Active projects</div>\n        <div dsyStatValue>24</div>\n        <div dsyStatDesc>4 more than last month</div>\n      </div>\n    </div>\n  `,\n})\nexport class StatUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
