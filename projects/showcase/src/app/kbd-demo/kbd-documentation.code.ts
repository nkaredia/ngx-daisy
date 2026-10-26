import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'kbd',
  entryPoint: '@ngx-daisy/cdk/kbd',
  summary: 'Display the key or key combination used for a shortcut.',
  usage: [
    'Use native kbd markup for keyboard keys and show separators between combined keys. Keep shortcuts consistent with the platform.',
  ],
  angular: [
    'The directive styles keycap markup. It does not register key handlers; implement shortcuts in the owning component or application service.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep shortcut instructions understandable as text. Avoid overriding browser or assistive-technology shortcuts.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'kbd-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyKbd } from '@ngx-daisy/cdk/kbd';\n\n@Component({\n  selector: 'app-kbd-example',\n  imports: [DsyKbd],\n  template: ` <p>Save changes: <kbd dsyKbd>Ctrl</kbd> + <kbd dsyKbd>S</kbd></p> `,\n})\nexport class KbdUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
