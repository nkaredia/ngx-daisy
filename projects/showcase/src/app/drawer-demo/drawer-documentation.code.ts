import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'drawer',
  entryPoint: '@ngx-daisy/cdk/drawer',
  summary:
    'Use a persistent sidebar or an overlay drawer for application navigation and secondary content.',
  usage: [
    'Use side mode for a persistent panel and over mode when the drawer should cover the viewport. Place one drawer and one content region directly inside its container.',
  ],
  angular: [
    'Bind the opened model or call open(), close() and toggle(). Applications own responsive breakpoints. Close without focus restoration when routing deliberately moves focus to new page content.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Use width for the panel width and panelClass/backdropClass for internal surfaces. Logical start/end positions support RTL. Keep the surrounding container structure intact.',
  ],
  accessibility: [
    'Overlay mode traps focus, locks scrolling and inerts the background. Provide a named opener and explicit dismissal; side mode is nonmodal.',
  ],
  apiNotes: [
    {
      name: 'close({ restoreFocus? })',
      description:
        'Use restoreFocus: false when routing or moving focus deliberately. Escape/backdrop dismiss only when close is enabled.',
    },
    {
      name: 'panelClass / backdropClass',
      description:
        'Style the internal panel and backdrop while retaining focus, inertness and reduced-motion safeguards.',
    },
  ],
  files: [
    {
      path: 'drawer-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyDrawer, DsyDrawerContainer, DsyDrawerContent } from \'@ngx-daisy/cdk/drawer\';\n\n@Component({\n  selector: \'app-drawer-example\',\n  imports: [DsyDrawer, DsyDrawerContainer, DsyDrawerContent],\n  template: `\n    <dsy-drawer-container\n      ><dsy-drawer-content\n        ><button type="button" (click)="navigation.toggle()">Open navigation</button>\n        <main>Workspace content</main></dsy-drawer-content\n      ><dsy-drawer #navigation mode="over" aria-label="Workspace navigation"\n        ><button type="button" (click)="navigation.close()">Close navigation</button>\n        <nav><a href="/projects">Projects</a></nav></dsy-drawer\n      ></dsy-drawer-container\n    >\n  `,\n})\nexport class DrawerUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
