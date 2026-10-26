import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'indicator',
  entryPoint: '@ngx-daisy/cdk/indicator',
  summary: 'Position a small badge or marker relative to another surface.',
  usage: [
    'Use for unread counts, presence or short corner labels. Choose logical start/end positions and keep the indicator from obscuring its target.',
  ],
  angular: [
    'DsyIndicator supplies the relative container; dsyIndicatorItem positions projected content. Bind count and visibility from application state.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'If the indicator changes the meaning of a button, include the count or status in its accessible name. Avoid announcing both an identical badge label and button description.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'indicator-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyIndicator, DsyIndicatorItem } from \'@ngx-daisy/cdk/indicator\';\n\n@Component({\n  selector: \'app-indicator-example\',\n  imports: [DsyIndicator, DsyIndicatorItem],\n  template: `\n    <dsy-indicator\n      ><span dsyIndicatorItem horizontal="end" vertical="top">8</span\n      ><button type="button" aria-label="Inbox, 8 unread messages">\n        Inbox\n      </button></dsy-indicator\n    >\n  `,\n})\nexport class IndicatorUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
