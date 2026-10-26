import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'fieldset',
  entryPoint: '@ngx-daisy/cdk/fieldset',
  summary: 'Group related controls under a native fieldset and legend.',
  usage: [
    'Use a fieldset for related choices such as notification channels or delivery methods. Keep the legend short and put longer help text inside the group.',
  ],
  angular: [
    'Apply DsyFieldset to fieldset and DsyLegend to legend. Native fieldset disabled behavior remains available; it does not rewrite the Angular form model. Bind individual controls through your chosen forms approach.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'Use a real legend to name the group. Each child control still needs its own label.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'fieldset-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsyFieldset, DsyLegend } from '@ngx-daisy/cdk/fieldset';\n\n@Component({\n  selector: 'app-fieldset-example',\n  imports: [DsyFieldset, DsyLegend],\n  template: `\n    <fieldset dsyFieldset>\n      <legend dsyLegend>Notifications</legend>\n      <label><input type=\"checkbox\" /> Product updates</label\n      ><label><input type=\"checkbox\" /> Security alerts</label>\n    </fieldset>\n  `,\n})\nexport class FieldsetUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
