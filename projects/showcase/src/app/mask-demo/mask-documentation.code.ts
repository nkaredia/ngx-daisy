import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'mask',
  entryPoint: '@ngx-daisy/cdk/mask',
  summary: 'Clip an image or decorative surface into a chosen shape.',
  usage: [
    'Use shapes consistently for avatars or visual accents. Keep important image content away from clipped edges and use half modifiers deliberately.',
  ],
  angular: [
    'Apply DsyMask to the native image or container. The directive styles clipping only; it does not change source loading or image semantics.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep meaningful image alt text. Decorative clipping must not remove the textual identification of a person, item or action.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'mask-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyMask } from \'@ngx-daisy/cdk/mask\';\n\n@Component({\n  selector: \'app-mask-example\',\n  imports: [DsyMask],\n  template: `\n    <img\n      dsyMask\n      shape="squircle"\n      src="/assets/profile.jpg"\n      alt="Alex Morgan"\n      class="w-24"\n    />\n  `,\n})\nexport class MaskUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
