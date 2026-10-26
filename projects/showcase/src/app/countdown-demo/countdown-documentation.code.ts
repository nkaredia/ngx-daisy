import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'countdown',
  entryPoint: '@ngx-daisy/cdk/countdown',
  summary: 'Display a changing numeric value with a countdown-style presentation.',
  usage: [
    'Use for short time segments or counters. Compose separate labeled hour, minute and second values when displaying a duration.',
  ],
  angular: [
    'The component only displays the supplied value; it does not start a timer. Own interval creation, completion and destruction cleanup in the application. Values clamp to the supported digit range.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Provide understandable units and avoid a live announcement every second unless it is necessary for the task. Reduced motion disables decorative transitions.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'countdown-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyCountdown } from '@ngx-daisy/cdk/countdown';\n\n@Component({\n  selector: 'app-countdown-example',\n  imports: [DsyCountdown],\n  template: ` <p><dsy-countdown [value]=\"42\" [digits]=\"2\" /> seconds remaining</p> `,\n})\nexport class CountdownUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
