import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'accordion',
  entryPoint: '@ngx-daisy/cdk/accordion',
  summary: 'Organize related disclosures with coordinated expansion.',
  usage: [
    'Use one panel per topic and clear headings that describe hidden content. Enable multi only when simultaneous expansion helps comparison.',
  ],
  angular: [
    'Project DsyCollapse children inside DsyAccordion. CDK coordinates items; use each child opened model or the parent openAll()/closeAll() methods.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Each heading is a native button with expanded state and a linked region. Closing a focused panel returns focus to its heading.',
  ],
  apiNotes: [
    {
      name: 'openAll() / closeAll()',
      description:
        'Expand enabled coordination according to the accordion multi setting, or close every item. Child opened models remain available.',
    },
  ],
  files: [
    {
      path: 'accordion-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyAccordion } from '@ngx-daisy/cdk/accordion';\nimport { DsyCollapse } from '@ngx-daisy/cdk/collapse';\n\n@Component({\n  selector: 'app-accordion-example',\n  imports: [DsyAccordion, DsyCollapse],\n  template: `\n    <dsy-accordion\n      ><dsy-collapse title=\"Shipping\">Orders ship in two business days.</dsy-collapse\n      ><dsy-collapse title=\"Returns\"\n        >Returns are accepted within 30 days.</dsy-collapse\n      ></dsy-accordion\n    >\n  `,\n})\nexport class AccordionUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
