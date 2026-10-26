import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'list',
  entryPoint: '@ngx-daisy/cdk/list',
  summary: 'Present repeated content in a consistent native list-row layout.',
  usage: [
    'Use ordered lists for sequences and unordered lists for collections. Grow and wrap slots help align titles, metadata and trailing content.',
  ],
  angular: [
    'Render collections with Angular @for and stable item identities. List directives provide layout; selection, navigation and item actions remain application-owned.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep native li semantics and place actions on actual buttons or links. Give icon-only row actions an accessible name.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'list-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyList, DsyListRow, DsyListGrow, DsyListWrap } from '@ngx-daisy/cdk/list';\n\n@Component({\n  selector: 'app-list-example',\n  imports: [DsyList, DsyListRow, DsyListGrow, DsyListWrap],\n  template: `\n    <ul dsyList>\n      <li dsyListRow>\n        <span>01</span>\n        <div dsyListGrow dsyListWrap>Project kickoff</div>\n        <time datetime=\"2026-10-20\">October 20</time>\n      </li>\n    </ul>\n  `,\n})\nexport class ListUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
