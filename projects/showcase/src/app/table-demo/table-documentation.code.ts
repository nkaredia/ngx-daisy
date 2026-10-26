import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'table',
  entryPoint: '@ngx-daisy/cdk/table',
  summary: 'Style a native or CDK data table with optional sorting and client-side data helpers.',
  usage: [
    'Use a caption, semantic headings and appropriate columns. Put wide tables in an application-owned scrolling container; pinned rows and columns require suitable height and overflow.',
  ],
  angular: [
    'DsyTable decorates native markup. For dynamic collections, the entry point re-exports CDK table declarations and DsyTableDataSource for signal-based client filtering, sorting and paging. Use an application data source for server queries.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Apply size, zebra and pinned-row/column options to the table. Set overflow and available height on an application container; responsive column decisions remain application-owned.',
  ],
  accessibility: [
    'Keep header-cell scope and readable column names. Sort headers provide buttons and aria-sort; avoid putting other controls inside a sortable heading.',
  ],
  apiNotes: [
    {
      name: 'DsyTableDataSource',
      description:
        'Construct in an Angular injection context. data, filter, sort, pageSize and pageIndex signals drive derived rows; original arrays are not mutated.',
    },
    {
      name: 'DsySort / DsySortHeader',
      description:
        'Bind active/direction models to the data source. Sorting cycles ascending, descending and unsorted; disabled groups prevent user sorting.',
    },
  ],
  files: [
    {
      path: 'table-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyTable } from \'@ngx-daisy/cdk/table\';\n\n@Component({\n  selector: \'app-table-example\',\n  imports: [DsyTable],\n  template: `\n    <table dsyTable zebra>\n      <caption>\n        Project workload\n      </caption>\n      <thead>\n        <tr>\n          <th scope="col">Project</th>\n          <th scope="col">Tasks</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <th scope="row">Website</th>\n          <td>12</td>\n        </tr>\n      </tbody>\n    </table>\n  `,\n})\nexport class TableUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
