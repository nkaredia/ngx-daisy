import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'megamenu',
  entryPoint: '@ngx-daisy/cdk/megamenu',
  summary: 'Organize grouped navigation links in connected nonmodal panels.',
  usage: [
    'Use when a navigation category needs multiple destinations or rich supporting content. Set wide/full/auto width to suit the surrounding layout.',
  ],
  angular: [
    'Project each category with ng-template dsyMegamenuItem. activeIndex is number or null and only one panel opens at a time. CDK overlays handle positioning, outside focus and pointer dismissal; projected actions can set activeIndex to null.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Use panelClass and buttonClass for internal surfaces. Connected panels are outside their authored DOM ancestors, so use global panel selectors or utility classes rather than descendant selectors.',
  ],
  accessibility: [
    'Panels retain ordinary link semantics, not application menuitems. Opening focuses content, Escape returns focus to its trigger and outside focus closes without trapping the user.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'megamenu-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyMegamenu, DsyMegamenuItem } from \'@ngx-daisy/cdk/megamenu\';\n\n@Component({\n  selector: \'app-megamenu-example\',\n  imports: [DsyMegamenu, DsyMegamenuItem],\n  template: `\n    <dsy-megamenu label="Main navigation" width="wide"\n      ><ng-template dsyMegamenuItem="Products"\n        ><h3>Explore products</h3>\n        <a href="/products">All products</a></ng-template\n      ><ng-template dsyMegamenuItem="Resources"\n        ><a href="/guides">Guides</a></ng-template\n      ></dsy-megamenu\n    >\n  `,\n})\nexport class MegamenuUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
