import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'mockup-browser',
  entryPoint: '@ngx-daisy/cdk/mockup-browser',
  summary: 'Frame a preview in a decorative browser window.',
  usage: [
    'Use to show a site or application composition in context. Project toolbar text and a realistically sized content area.',
  ],
  angular: [
    'The mockup is a wrapper around real projected content. It is not an iframe, screenshot or sandbox and does not implement browser navigation.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep functional controls inside the preview accessible. Toolbar text is decorative context unless it is deliberately implemented as a real labeled control.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'mockup-browser-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyMockupBrowser, DsyBrowserToolbar } from '@ngx-daisy/cdk/mockup-browser';\n\n@Component({\n  selector: 'app-mockup-browser-example',\n  imports: [DsyMockupBrowser, DsyBrowserToolbar],\n  template: `\n    <div dsyMockupBrowser class=\"border border-base-300\">\n      <div dsyBrowserToolbar>example.com</div>\n      <div class=\"bg-base-200 p-8\">Application preview</div>\n    </div>\n  `,\n})\nexport class MockupBrowserUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
