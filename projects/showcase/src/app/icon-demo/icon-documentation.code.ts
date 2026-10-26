import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'icon',
  entryPoint: '@ngx-daisy/cdk/icon',
  summary: 'Share size, semantic color and accessibility around an app-provided icon.',
  usage: [
    'Project the icon provider your application chooses. The wrapper does not discover, install or register icons; imports and tree shaking stay in the app.',
  ],
  angular: [
    'Import DsyIcon and the individual icon declarations used by the application. Projected SVGs should inherit currentColor and sizing; provider styles or Shadow DOM can limit inherited styling.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'The wrapper supplies size and semantic color through inherited styles. Explicit provider inline styles or Shadow DOM can prevent inheritance; configure the provider when necessary.',
  ],
  accessibility: [
    'Unlabeled wrappers are decorative. For a standalone meaningful icon, provide aria-label. Name icon-only buttons on the button itself and keep the nested icon decorative.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'icon-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyIcon } from \'@ngx-daisy/cdk/icon\';\n\n@Component({\n  selector: \'app-icon-example\',\n  imports: [DsyIcon],\n  template: `\n    <dsy-icon size="1.25rem" color="success" aria-label="Completed"\n      ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">\n        <path d="m5 12 4 4L19 6" /></svg\n    ></dsy-icon>\n  `,\n})\nexport class IconUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
