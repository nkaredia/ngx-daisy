import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'mockup-phone',
  entryPoint: '@ngx-daisy/cdk/mockup-phone',
  summary: 'Place application content inside a decorative phone frame.',
  usage: [
    'Use for a mobile product preview and choose content dimensions that fit the internal display. Avoid implying the frame is a functioning device emulator.',
  ],
  angular: [
    'The component generates camera and display slots around projected content. displayClass and cameraClass customize internal surfaces; application interactions remain ordinary Angular behavior.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'displayClass and cameraClass reach the generated phone surfaces. Set preview dimensions in the projected application content.',
  ],
  accessibility: [
    'Retain accessible content semantics and a useful description of the preview. The decorative camera does not need a separate name.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'mockup-phone-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyMockupPhone } from '@ngx-daisy/cdk/mockup-phone';\n\n@Component({\n  selector: 'app-mockup-phone-example',\n  imports: [DsyMockupPhone],\n  template: `\n    <dsy-mockup-phone displayClass=\"bg-base-100\"\n      ><div class=\"p-6\">\n        <h3>Workspace mobile</h3>\n        <p>Your projects on the go.</p>\n      </div></dsy-mockup-phone\n    >\n  `,\n})\nexport class MockupPhoneUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
