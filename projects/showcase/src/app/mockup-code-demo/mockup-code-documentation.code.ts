import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'mockup-code',
  entryPoint: '@ngx-daisy/cdk/mockup-code',
  summary: 'Present terminal-style output with optional line prefixes.',
  usage: [
    'Use native pre/code markup so spacing and copyable text remain predictable. Choose prefixes to distinguish a command from output.',
  ],
  angular: [
    'DsyMockupCode and DsyCodeLine provide presentation only. Syntax highlighting belongs to the application; no command is executed.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep code as text rather than injecting HTML. Provide surrounding context for commands and keep long output scrollable.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'mockup-code-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyMockupCode, DsyCodeLine } from '@ngx-daisy/cdk/mockup-code';\n\n@Component({\n  selector: 'app-mockup-code-example',\n  imports: [DsyMockupCode, DsyCodeLine],\n  template: `\n    <div dsyMockupCode>\n      <pre dsyCodeLine=\"$\"><code>yarn add @ngx-daisy/cdk</code></pre>\n      <pre dsyCodeLine=\">\"><code>Ready to build.</code></pre>\n    </div>\n  `,\n})\nexport class MockupCodeUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
