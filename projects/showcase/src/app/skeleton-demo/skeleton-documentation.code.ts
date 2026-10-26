import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'skeleton',
  entryPoint: '@ngx-daisy/cdk/skeleton',
  summary: 'Reserve space with decorative placeholders while content loads.',
  usage: [
    'Match the approximate size and arrangement of the arriving content to reduce layout shift. Use a loader when the task needs an explicit ongoing-work signal.',
  ],
  angular: [
    'Control whether the skeleton or real content is rendered from application loading state. The wrapper does not fetch data or manage an aria-busy region.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Skeletons are aria-hidden decorative content. Put aria-busy and a useful loading message on the application region; never project focusable controls into placeholders.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'skeleton-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsySkeleton } from \'@ngx-daisy/cdk/skeleton\';\n\n@Component({\n  selector: \'app-skeleton-example\',\n  imports: [DsySkeleton],\n  template: `\n    <section aria-busy="true" aria-label="Loading profile">\n      <div dsySkeleton class="h-12 w-12 rounded-full"></div>\n      <div dsySkeleton class="mt-3 h-4 w-40"></div>\n      <p class="sr-only">Loading profile</p>\n    </section>\n  `,\n})\nexport class SkeletonUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
