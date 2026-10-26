import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'dock',
  entryPoint: '@ngx-daisy/cdk/dock',
  summary: 'Keep a compact set of primary destinations available at the bottom of the viewport.',
  usage: [
    'Limit the dock to frequently used destinations and include short labels. Reserve page space for its fixed position so content is not covered.',
  ],
  angular: [
    'Apply DsyDockItem to links or buttons and bind active from the router or application state. DsyDockLabel styles the destination label.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep native navigation semantics and meaningful names. Active items expose current-page state; disabled items leave keyboard navigation and block activation.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'dock-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyDock, DsyDockItem, DsyDockLabel } from \'@ngx-daisy/cdk/dock\';\n\n@Component({\n  selector: \'app-dock-example\',\n  imports: [DsyDock, DsyDockItem, DsyDockLabel],\n  template: `\n    <dsy-dock label="Main navigation"\n      ><a dsyDockItem href="/projects" active><span dsyDockLabel>Projects</span></a\n      ><a dsyDockItem href="/settings"><span dsyDockLabel>Settings</span></a></dsy-dock\n    >\n  `,\n})\nexport class DockUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
