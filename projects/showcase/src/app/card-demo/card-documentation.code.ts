import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'card',
  entryPoint: '@ngx-daisy/cdk/card',
  summary: 'Group related media, headings, descriptive content and actions into a surface.',
  usage: [
    'Compose figure, body, title and actions slots. Choose side layout for horizontal media or imageFull for a text overlay, checking contrast on the image.',
  ],
  angular: [
    'The card is a presentation container. Use native links or buttons for actions and application state for selection; it does not make the entire surface interactive.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Use size, border, side and imageFull for the card surface. Body, title and actions slots accept ordinary application classes and theme tokens.',
  ],
  accessibility: [
    'Use an appropriate heading level, meaningful image alternatives and distinct link text. Avoid wrapping multiple interactive descendants in a single link.',
  ],
  apiNotes: [],
  files: [
    {
      path: 'card-example.ts',
      language: 'typescript',
      content:
        'import { Component } from \'@angular/core\';\nimport {\n  DsyCard,\n  DsyCardBody,\n  DsyCardTitle,\n  DsyCardActions,\n} from \'@ngx-daisy/cdk/card\';\n\n@Component({\n  selector: \'app-card-example\',\n  imports: [DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions],\n  template: `\n    <article dsyCard border="solid" class="bg-base-100">\n      <dsy-card-body\n        ><h3 dsyCardTitle>Weekend trails</h3>\n        <p>Plan a short escape.</p>\n        <dsy-card-actions\n          ><a href="/trails">Explore trails</a></dsy-card-actions\n        ></dsy-card-body\n      >\n    </article>\n  `,\n})\nexport class CardUsageExample {}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
