import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'pagination',
  entryPoint: '@ngx-daisy/cdk/pagination',
  summary: 'Navigate a bounded result set with compact page controls.',
  usage: [
    'Show pagination when result sets have stable page boundaries. Keep page size and total result count consistent with the data being displayed.',
  ],
  angular: [
    'pageIndex is zero-based. User changes emit pageChange with current/previous indexes, page size and length. The component clamps displayed indexes but does not fetch data; connect it to your source or server query.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Buttons have readable page labels, current-page state and disabled boundary actions. Empty results retain one disabled page.',
  ],
  apiNotes: [
    {
      name: 'pageChange',
      description:
        'Emits DsyPageEvent on user changes. Updating input bounds adjusts the displayed index without emitting a user event.',
    },
  ],
  files: [
    {
      path: 'pagination-example.ts',
      language: 'typescript',
      content:
        'import { Component, signal } from \'@angular/core\';\nimport { DsyPagination } from \'@ngx-daisy/cdk/pagination\';\n\n@Component({\n  selector: \'app-pagination-example\',\n  imports: [DsyPagination],\n  template: `\n    <dsy-pagination\n      [length]="120"\n      [pageSize]="10"\n      [(pageIndex)]="page"\n      label="Project pages"\n    />\n    <p>Page {{ page() + 1 }}</p>\n  `,\n})\nexport class PaginationUsageExample {\n  readonly page = signal(0);\n}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
