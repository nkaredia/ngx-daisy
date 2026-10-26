import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'aura',
  entryPoint: '@ngx-daisy/cdk/aura',
  summary: 'Add a decorative metallic, rainbow or holographic surface around content.',
  usage: [
    'Use the effect sparingly for emphasis such as featured plans, achievements or collectible cards. Keep important text readable over the selected treatment.',
  ],
  angular: [
    'Set preset, dual and glow for the visual treatment. Project ordinary Angular content; the effect does not provide selection or card behavior.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'The aura is decorative. Keep semantic labels and controls on the projected content and respect reduced-motion preferences.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'aura-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyAura } from '@ngx-daisy/cdk/aura';\n\n@Component({\n  selector: 'app-aura-example',\n  imports: [DsyAura],\n  template: `\n    <div dsyAura preset=\"gold\" class=\"p-6\">\n      <h3>Premium membership</h3>\n      <p>All tools included.</p>\n    </div>\n  `,\n})\nexport class AuraUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
