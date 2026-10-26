import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'mockup-window',
  entryPoint: '@ngx-daisy/cdk/mockup-window',
  summary: 'Frame application content in a decorative desktop window.',
  usage: [
    'Use for product screenshots or live interface demonstrations. Set explicit content backgrounds and dimensions with application classes.',
  ],
  angular: [
    'The wrapper preserves projected Angular content. It does not implement window controls, resizing or an isolated browsing context.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep content headings and links semantic. Treat decorative window chrome as supporting context, not interactive controls.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'mockup-window-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyMockupWindow } from '@ngx-daisy/cdk/mockup-window';\n\n@Component({\n  selector: 'app-mockup-window-example',\n  imports: [DsyMockupWindow],\n  template: `\n    <div dsyMockupWindow class=\"border border-base-300\">\n      <div class=\"bg-base-200 p-8\">Desktop application preview</div>\n    </div>\n  `,\n})\nexport class MockupWindowUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
