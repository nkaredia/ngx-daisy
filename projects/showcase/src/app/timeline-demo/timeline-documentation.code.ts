import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'timeline',
  entryPoint: '@ngx-daisy/cdk/timeline',
  summary: 'Display milestones or events in chronological order.',
  usage: [
    'Use horizontal orientation for a short sequence and vertical for longer histories. Project start, middle, end and box slots to align dates, markers and descriptions.',
  ],
  angular: [
    'Render semantic ol/ul and li markup. The timeline displays application data; it does not infer current steps or execute transitions.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep chronological DOM order, readable dates and descriptive text. Hide purely decorative marker artwork from assistive technology.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'timeline-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport {\n  DsyTimeline,\n  DsyTimelineStart,\n  DsyTimelineMiddle,\n  DsyTimelineEnd,\n  DsyTimelineBox,\n} from '@ngx-daisy/cdk/timeline';\n\n@Component({\n  selector: 'app-timeline-example',\n  imports: [\n    DsyTimeline,\n    DsyTimelineStart,\n    DsyTimelineMiddle,\n    DsyTimelineEnd,\n    DsyTimelineBox,\n  ],\n  template: `\n    <ol dsyTimeline orientation=\"vertical\">\n      <li>\n        <div dsyTimelineStart>Today</div>\n        <div dsyTimelineMiddle aria-hidden=\"true\">●</div>\n        <div dsyTimelineEnd dsyTimelineBox>Project launched</div>\n      </li>\n    </ol>\n  `,\n})\nexport class TimelineUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
