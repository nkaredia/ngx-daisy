import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'tabs',
  entryPoint: '@ngx-daisy/cdk/tabs',
  summary: 'Switch between related panels while retaining each panel’s Angular state.',
  usage: [
    'Use short tab labels for closely related content. Match each panel index to its direct projected tab button and avoid using tabs for unrelated route navigation.',
  ],
  angular: [
    'Bind selectedIndex for app-owned selection. Automatic activation selects on focus; manual activation waits for Enter/Space. Inactive panels remain instantiated but are hidden and inert.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Use variant, placement, size and listClass for the tab strip. Panels accept ordinary classes. Keep hidden/inert panel semantics and the lifted-tab bridge intact.',
  ],
  accessibility: [
    'CDK manages arrows, Home/End, typeahead and RTL navigation. Tabs and panels have linked IDs and selected state; moving selection away from focused panel content returns focus to the new tab.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'tabs-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyTabs, DsyTab, DsyTabPanel } from \'@ngx-daisy/cdk/tabs\';\n\n@Component({\n  selector: \'app-tabs-example\',\n  imports: [DsyTabs, DsyTab, DsyTabPanel],\n  template: `\n    <dsy-tabs label="Project details" variant="border"\n      ><button dsyTab>Overview</button><button dsyTab>Activity</button>\n      <section dsyTabPanel="0">Project overview</section>\n      <section dsyTabPanel="1">Recent activity</section></dsy-tabs\n    >\n  `,\n})\nexport class TabsUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
