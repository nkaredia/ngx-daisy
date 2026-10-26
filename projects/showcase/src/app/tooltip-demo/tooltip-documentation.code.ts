import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'tooltip',
  entryPoint: '@ngx-daisy/cdk/tooltip',
  summary: 'Provide a short supporting text hint on hover or keyboard focus.',
  usage: [
    'Use tooltips for supplemental context, not essential instructions or interactive content. A tooltip is not a substitute for a control’s accessible name.',
  ],
  angular: [
    'Apply dsyTooltip to a naturally focusable trigger. tooltipDisabled controls only the hint, leaving native disabled independent. opened can be model-bound; show()/hide() provide explicit control.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'tooltipClass styles the visible text surface. Inherited theme values cross its CDK portal; tooltipDisabled must stay independent of native disabled.',
  ],
  accessibility: [
    'CDK AriaDescriber maintains the accessible description. Focus or hover opens the text hint and Escape dismisses it; no interactive elements belong inside the tooltip.',
  ],
  apiNotes: [
    {
      name: 'show() / hide()',
      description:
        'Programmatically control the visible hint. The accessible description is managed separately from the portalled visual panel.',
    },
  ],
  files: [
    {
      path: 'tooltip-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyTooltip } from \'@ngx-daisy/cdk/tooltip\';\n\n@Component({\n  selector: \'app-tooltip-example\',\n  imports: [DsyTooltip],\n  template: `\n    <button type="button" dsyTooltip="Save changes to this project" position="bottom">\n      Save\n    </button>\n  `,\n})\nexport class TooltipUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
