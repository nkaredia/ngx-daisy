import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'avatar',
  entryPoint: '@ngx-daisy/cdk/avatar',
  summary: 'Represent people or entities with an image, initials and optional presence.',
  usage: [
    'Use a consistent image container size. Group avatars for a team and provide a readable fallback when an image is unavailable.',
  ],
  angular: [
    'The wrapper projects image or placeholder content. Your application owns image loading, fallback decisions and presence updates. Size and shape come from the projected container.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Set width, aspect ratio and clipping shape on the projected image container. The avatar wrapper adds status and placeholder treatment rather than selecting image dimensions.',
  ],
  accessibility: [
    'Give meaningful images descriptive alt text. If an adjacent name already identifies the person, use a decorative image alternative and do not rely on presence color alone.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'avatar-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyAvatar } from \'@ngx-daisy/cdk/avatar\';\n\n@Component({\n  selector: \'app-avatar-example\',\n  imports: [DsyAvatar],\n  template: `\n    <div dsyAvatar status="online">\n      <div class="w-12 rounded-full">\n        <img src="/assets/alex.jpg" alt="Alex Morgan" />\n      </div>\n    </div>\n  `,\n})\nexport class AvatarUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
