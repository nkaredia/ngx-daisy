import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'menu',
  entryPoint: '@ngx-daisy/cdk/menu',
  summary: 'Arrange site navigation and related links with native lists and optional disclosures.',
  usage: [
    'Group destinations under concise titles. Use details/summary for composed submenus; dropdown-part directives provide appearance only.',
  ],
  angular: [
    'Use DsyMenuItem on real links/buttons and derive active state from routing. DsyMenuSubmenu exposes an opened model on native details. For ARIA command-menu behavior use Dropdown instead.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep normal Tab order, native disclosure keyboard behavior and meaningful destinations. Active items expose aria-current; disabled items do not activate.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'menu-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport {\n  DsyMenu,\n  DsyMenuTitle,\n  DsyMenuItem,\n  DsyMenuSubmenu,\n} from '@ngx-daisy/cdk/menu';\n\n@Component({\n  selector: 'app-menu-example',\n  imports: [DsyMenu, DsyMenuTitle, DsyMenuItem, DsyMenuSubmenu],\n  template: `\n    <ul dsyMenu>\n      <li dsyMenuTitle>Workspace</li>\n      <li><a dsyMenuItem href=\"/overview\" active>Overview</a></li>\n      <li>\n        <details dsyMenuSubmenu>\n          <summary>Projects</summary>\n          <ul>\n            <li><a dsyMenuItem href=\"/projects/recent\">Recent projects</a></li>\n          </ul>\n        </details>\n      </li>\n    </ul>\n  `,\n})\nexport class MenuUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
