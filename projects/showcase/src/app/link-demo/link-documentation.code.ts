import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'link',
  entryPoint: '@ngx-daisy/cdk/link',
  summary: 'Apply semantic link colors and interaction styling to a native anchor.',
  usage: [
    'Use descriptive destination text and consistent hover emphasis. Use a button for an action that does not navigate.',
  ],
  angular: [
    'href, RouterLink, target and rel remain native HTML or Angular concerns. Bind active from application routing. Disabled links retain their destination but prevent activation and leave the tab order.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Ensure links remain recognizable without color alone. Give external-link behavior context when it would otherwise surprise the user.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'link-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyLink } from '@ngx-daisy/cdk/link';\n\n@Component({\n  selector: 'app-link-example',\n  imports: [DsyLink],\n  template: ` <a dsyLink color=\"primary\" href=\"/projects\">View all projects</a> `,\n})\nexport class LinkUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
