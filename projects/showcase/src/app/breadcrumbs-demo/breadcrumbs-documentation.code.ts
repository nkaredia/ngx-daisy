import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'breadcrumbs',
  entryPoint: '@ngx-daisy/cdk/breadcrumbs',
  summary: 'Show the current page’s position in a navigation hierarchy.',
  usage: [
    'Keep the trail concise and use meaningful ancestor names. Mark the current page separately from navigable ancestors.',
  ],
  angular: [
    'DsyBreadcrumbs projects li elements into its internal native list. Use href or RouterLink on ancestor links and keep routing in the app.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'The wrapper supplies a navigation label. Use aria-current="page" for the last item and avoid making decorative separators part of the accessible name.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'breadcrumbs-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyBreadcrumbs } from \'@ngx-daisy/cdk/breadcrumbs\';\n\n@Component({\n  selector: \'app-breadcrumbs-example\',\n  imports: [DsyBreadcrumbs],\n  template: `\n    <dsy-breadcrumbs label="Breadcrumb"\n      ><li><a href="/">Home</a></li>\n      <li><a href="/projects">Projects</a></li>\n      <li aria-current="page">Website</li></dsy-breadcrumbs\n    >\n  `,\n})\nexport class BreadcrumbsUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
