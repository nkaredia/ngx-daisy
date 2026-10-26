import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'text-rotate',
  entryPoint: '@ngx-daisy/cdk/text-rotate',
  summary: 'Animate a short set of decorative phrases while retaining a stable accessible label.',
  usage: [
    'Keep between two and six phrases for the native daisyUI animation. Use similar lengths so the surrounding layout remains stable.',
  ],
  angular: [
    'Pass items, duration in milliseconds and running state. This is decorative animation, not a feed or a timer that drives application logic.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Set a stable label summarizing the message. Avoid announcing every animation frame; reduced motion shows the first phrase.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'text-rotate-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyTextRotate } from '@ngx-daisy/cdk/text-rotate';\n\n@Component({\n  selector: 'app-text-rotate-example',\n  imports: [DsyTextRotate],\n  template: `\n    <dsy-text-rotate\n      [items]=\"['Plan together', 'Build together', 'Ship together']\"\n      label=\"Plan, build and ship together\"\n    />\n  `,\n})\nexport class TextRotateUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
