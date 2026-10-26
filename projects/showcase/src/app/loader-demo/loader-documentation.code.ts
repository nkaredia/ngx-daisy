import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'loader',
  entryPoint: '@ngx-daisy/cdk/loader',
  summary: 'Indicate ongoing work inline, over a section, or across a page.',
  usage: [
    'Choose a spinner, ring, dots, bars, ball, infinity or bar visual. Only ring and bar accept determinate progress. Set active from the application request lifecycle.',
  ],
  angular: [
    'Own loading state and request cancellation in the app. Overlay and page placement are visual indicators: they do not trap focus, inert the underlying app or own scroll locking. Section overlays need a relatively positioned container.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Use color, size, animation and speed to match the operation. Default indeterminate visuals use native loading masks; determinate bars/rings use library artwork and stop repeating animation.',
  ],
  accessibility: [
    'Provide an operation label. Determinate loaders expose a progressbar; indeterminate ones expose status semantics. Honor reduced motion and set aria-busy on the region being updated.',
  ],
  apiNotes: [
    {
      name: 'value',
      description:
        'A finite 0–100 percentage for ring/bar. Values clamp to that range; null selects indeterminate. Other variants and nonfinite values reject determinate input.',
    },
    {
      name: 'active',
      description:
        'Hide completed indicators by setting active to false. The component does not create a timer or fetch data.',
    },
  ],
  files: [
    {
      path: 'loader-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport { DsyLoader } from \'@ngx-daisy/cdk/loader\';\n\n@Component({\n  selector: \'app-loader-example\',\n  imports: [DsyLoader],\n  template: `\n    <dsy-loader\n      variant="dots"\n      color="primary"\n      aria-label="Loading projects"\n      showLabel\n    />\n    <dsy-loader variant="ring" [value]="72" aria-label="Upload progress" />\n  `,\n})\nexport class LoaderUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
