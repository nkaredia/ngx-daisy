import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'fab',
  entryPoint: '@ngx-daisy/cdk/fab',
  summary:
    'Keep a primary action or a compact speed dial available near the edge of the interface.',
  usage: [
    'Use a single trigger for a simple floating action. Add actions for a speed dial. Flower layout supports up to four regular actions and one replacement main action or close control, not both.',
  ],
  angular: [
    'DsyFab owns the opened model. DsyFabTrigger toggles the dial and DsyFabAction closes the dial and emits triggered on activation. Position absolute needs a positioned ancestor; inline follows normal layout.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'Use --dsy-fab-radius for flower spacing and application classes for projected actions. Keep hidden actions inert and preserve the replacement-trigger behavior.',
  ],
  accessibility: [
    'Name icon-only triggers and actions. Arrow keys, Home/End and typeahead move between actions; Escape closes and returns focus. Hidden actions are inert.',
  ],
  apiNotes: [
    {
      name: 'open(focus), close(restoreFocus), toggle()',
      description:
        'The optional focus argument is first, last or false. close() does not restore focus by default; pass true when your workflow requires it.',
    },
    {
      name: 'triggered',
      description:
        'Use DsyFabAction.triggered for action handlers. A main action uses the same event; a close control only dismisses.',
    },
  ],
  files: [
    {
      path: 'fab-example.ts',
      language: 'typescript',
      content:
        'import { Component, signal } from \'@angular/core\';\nimport { DsyFab, DsyFabTrigger, DsyFabAction } from \'@ngx-daisy/cdk/fab\';\n\n@Component({\n  selector: \'app-fab-example\',\n  imports: [DsyFab, DsyFabTrigger, DsyFabAction],\n  template: `\n    <dsy-fab position="inline" aria-label="Create content">\n      <button dsyFabTrigger type="button">Create</button>\n      <button dsyFabAction (triggered)="action.set(\'New document\')">Document</button>\n      <button dsyFabAction (triggered)="action.set(\'New folder\')">Folder</button>\n    </dsy-fab>\n    <p role="status">{{ action() }}</p>\n  `,\n})\nexport class FabUsageExample {\n  readonly action = signal(\'\');\n}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
