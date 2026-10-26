import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'hover-3d',
  entryPoint: '@ngx-daisy/cdk/hover-3d',
  summary: 'Give a surface a subtle pointer-driven tilt effect.',
  usage: [
    'Use decorative tilt on featured cards or media. Keep the underlying composition readable and usable when the effect is disabled.',
  ],
  angular: [
    'Project ordinary content and bind disabled if the application needs to suppress the effect. The wrapper retains working projected links and buttons.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Do not communicate essential state through tilt. Reduced-motion preferences suppress the effect; keyboard users still access projected controls normally.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'hover-3d-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyHover3d } from '@ngx-daisy/cdk/hover-3d';\n\n@Component({\n  selector: 'app-hover-3d-example',\n  imports: [DsyHover3d],\n  template: `\n    <div dsyHover3d class=\"rounded-box bg-base-200 p-6\">\n      <h3>Featured workspace</h3>\n      <a href=\"/workspaces\">Open workspace</a>\n    </div>\n  `,\n})\nexport class Hover3dUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
