import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'collapse',
  entryPoint: '@ngx-daisy/cdk/collapse',
  summary: 'Reveal or hide supporting content with an accessible disclosure.',
  usage: [
    'Use a concise title that describes the content. The default disclosure can toggle from its title; choose button-only trigger mode when the header also contains other actions.',
  ],
  angular: [
    'Bind opened for application-controlled state. Project dsyCollapseTitle for rich heading content and use titleClass/contentClass for internal visual slots.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'titleClass and contentClass reach the internal disclosure slots. Keep the expansion grid, hidden content and inert safeguards intact.',
  ],
  accessibility: [
    'Headings expose expanded state and reference the controlled region. Hidden content is inert; closing a panel containing focus restores focus to the heading.',
  ],
  apiNotes: [
    {
      name: 'openedChange',
      description:
        'Two-way model output for expansion changes. disabled blocks user toggles while programmatic model updates remain possible.',
    },
  ],
  files: [
    {
      path: 'collapse-example.ts',
      language: 'typescript',
      content:
        "import { Component, signal } from '@angular/core';\nimport { DsyCollapse } from '@ngx-daisy/cdk/collapse';\n\n@Component({\n  selector: 'app-collapse-example',\n  imports: [DsyCollapse],\n  template: `\n    <dsy-collapse title=\"Shipping details\" [(opened)]=\"opened\"\n      ><p>Orders ship within two business days.</p></dsy-collapse\n    >\n  `,\n})\nexport class CollapseUsageExample {\n  readonly opened = signal(false);\n}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
