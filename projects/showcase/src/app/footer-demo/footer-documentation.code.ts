import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'footer',
  entryPoint: '@ngx-daisy/cdk/footer',
  summary: 'Arrange supporting navigation, legal information and secondary content.',
  usage: [
    'Group links under short titles and keep footer content secondary to the page task. Choose orientation and center behavior for the available width.',
  ],
  angular: [
    'Use a native footer or the wrapper and project ordinary Angular links and content. The component does not own routing or responsive content decisions.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep meaningful link text and appropriate heading levels. Use footer semantics for page-level complementary content rather than an unrelated navigation menu.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'footer-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyFooter, DsyFooterTitle } from '@ngx-daisy/cdk/footer';\n\n@Component({\n  selector: 'app-footer-example',\n  imports: [DsyFooter, DsyFooterTitle],\n  template: `\n    <footer dsyFooter>\n      <nav>\n        <h3 dsyFooterTitle>Resources</h3>\n        <a href=\"/guides\">Guides</a><a href=\"/support\">Support</a>\n      </nav>\n      <p>Workspace tools</p>\n    </footer>\n  `,\n})\nexport class FooterUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
