import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'stack',
  entryPoint: '@ngx-daisy/cdk/stack',
  summary: 'Layer decorative surfaces with an offset stacking treatment.',
  usage: [
    'Use for a visual collection or overlapping decorative cards. Avoid obscuring interactive controls in background layers.',
  ],
  angular: [
    'Project application content and select the stacking position. The wrapper does not implement card selection, reordering or carousel behavior.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Keep reading order meaningful and use stacks for noninteractive layers so hidden controls do not remain keyboard targets.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'stack-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyStack } from \'@ngx-daisy/cdk/stack\';\n\n@Component({\n  selector: \'app-stack-example\',\n  imports: [DsyStack],\n  template: `\n    <div dsyStack>\n      <div class="bg-primary text-primary-content rounded-box p-6">Release notes</div>\n      <div class="bg-base-300 rounded-box p-6" aria-hidden="true">Previous release</div>\n    </div>\n  `,\n})\nexport class StackUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
