import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'navbar',
  entryPoint: '@ngx-daisy/cdk/navbar',
  summary: 'Compose a navigation bar with start, center and end regions.',
  usage: [
    'Prioritize brand, main destinations and supporting actions. Choose which content remains visible at smaller widths in the application layout.',
  ],
  angular: [
    'The wrapper provides structure and a navigation label. Project ordinary links, RouterLink or other controls into DsyNavbarStart, Center and End. It does not create a mobile menu automatically.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Use native links for destinations, named buttons for actions and a clear navigation label. Keep responsive hidden controls out of keyboard focus.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'navbar-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport {\n  DsyNavbar,\n  DsyNavbarStart,\n  DsyNavbarCenter,\n  DsyNavbarEnd,\n} from \'@ngx-daisy/cdk/navbar\';\n\n@Component({\n  selector: \'app-navbar-example\',\n  imports: [DsyNavbar, DsyNavbarStart, DsyNavbarCenter, DsyNavbarEnd],\n  template: `\n    <dsy-navbar label="Main navigation"\n      ><div dsyNavbarStart><a href="/">Workspace</a></div>\n      <div dsyNavbarCenter><a href="/projects">Projects</a></div>\n      <div dsyNavbarEnd><a href="/settings">Settings</a></div></dsy-navbar\n    >\n  `,\n})\nexport class NavbarUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
