import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'steps',
  entryPoint: '@ngx-daisy/cdk/steps',
  summary: 'Present progress through a sequence of application-defined steps.',
  usage: [
    'Use brief step labels and a clear current step. Color completed or important milestones consistently; the component does not validate completion.',
  ],
  angular: [
    'Render a native ol/ul with DsyStep children and optional DsyStepIcon content. Drive current and color from the application workflow state.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Projected content accepts application classes and native semantics. Use the component inputs for supported variants and theme tokens for consistent colors, radii and density.',
  ],
  accessibility: [
    'The current step exposes aria-current="step". Provide textual status so progress is understandable without relying on connector colors.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'steps-example.ts',
      language: 'typescript',
      content:
        "import { Component } from '@angular/core';\nimport { DsySteps, DsyStep } from '@ngx-daisy/cdk/steps';\n\n@Component({\n  selector: 'app-steps-example',\n  imports: [DsySteps, DsyStep],\n  template: `\n    <ol dsySteps>\n      <li dsyStep color=\"primary\">Account</li>\n      <li dsyStep current>Profile</li>\n      <li dsyStep>Confirm</li>\n    </ol>\n  `,\n})\nexport class StepsUsageExample {}\n",
    },
  ],
} satisfies ComponentDocumentationContent;
