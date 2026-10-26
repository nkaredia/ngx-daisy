import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'join',
  entryPoint: '@ngx-daisy/cdk/join',
  summary: 'Visually connect related controls into a continuous group.',
  usage: [
    'Use for tightly related actions such as time-scale choices or a search input and submit button. Apply the item directive to every joined surface.',
  ],
  angular: [
    'Join controls layout and shared edges; selection, form submission and keyboard behavior remain with the projected controls. Use orientation for vertical groups.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Give each action a name and a visible focus indicator. Joining buttons does not create tab, radio-group or toolbar keyboard semantics automatically.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'join-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyJoin, DsyJoinItem } from \'@ngx-daisy/cdk/join\';\n\n@Component({\n  selector: \'app-join-example\',\n  imports: [DsyJoin, DsyJoinItem],\n  template: `\n    <dsy-join\n      ><button type="button" dsyJoinItem>Day</button\n      ><button type="button" dsyJoinItem>Week</button\n      ><button type="button" dsyJoinItem>Month</button></dsy-join\n    >\n  `,\n})\nexport class JoinUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
