import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'diff',
  entryPoint: '@ngx-daisy/cdk/diff',
  summary: 'Compare two noninteractive visual layers with a draggable reveal divider.',
  usage: [
    'Use for before/after images or artwork with matching dimensions. Keep content aligned to make differences meaningful.',
  ],
  angular: [
    'position is a two-way 0–100 percentage model. The component uses a native range control rather than relying on browser-specific CSS resize behavior.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'stageClass and sliderClass reach the comparison stage and native range input. Keep both content layers noninteractive.',
  ],
  accessibility: [
    'Provide a label that describes the comparison. The native slider supports keyboard and touch; keep both visual layers free of interactive descendants.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'diff-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyDiff } from \'@ngx-daisy/cdk/diff\';\n\n@Component({\n  selector: \'app-diff-example\',\n  imports: [DsyDiff],\n  template: `\n    <dsy-diff label="Compare original and edited photo"\n      ><img dsyDiffBefore src="/assets/original.jpg" alt="Original photograph" /><img\n        dsyDiffAfter\n        src="/assets/edited.jpg"\n        alt="Edited photograph"\n    /></dsy-diff>\n  `,\n})\nexport class DiffUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
