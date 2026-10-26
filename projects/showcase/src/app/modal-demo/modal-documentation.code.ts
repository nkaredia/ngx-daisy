import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'modal',
  entryPoint: '@ngx-daisy/cdk/modal',
  summary: 'Present a focused task or decision while temporarily isolating the rest of the page.',
  usage: [
    'Use a dialog for a bounded task, not routine navigation. Compose a title, body and actions. If disableClose blocks backdrop and Escape dismissal, always provide an explicit close action.',
  ],
  angular: [
    'Use the opened model or open(), close(result) and toggle(). The closed event reports the result after an opened dialog closes. Projected content remains mounted while hidden. Place the modal outside transformed or contained ancestors that would change fixed positioning.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'panelClass and backdropClass style the internal surfaces. width is a CSS length. Preserve hidden/inert, disabled states, motion preferences and modal stacking safeguards.',
  ],
  accessibility: [
    'Associate aria-labelledby with a visible title and optionally aria-describedby with instructions. Focus stays inside the top modal, background content is inert and closing restores focus. Choose alertdialog only for an urgent decision.',
  ],
  apiNotes: [
    {
      name: 'closed',
      description:
        'Emits the optional result after closure. Backdrop/Escape dismissal has no result.',
    },
    {
      name: 'close(result?, { restoreFocus? })',
      description:
        'Pass restoreFocus: false when the application intentionally moves focus, such as after routing.',
    },
  ],
  files: [
    {
      path: 'modal-example.ts',
      language: 'typescript',
      content:
        'import { Component, signal } from \'@angular/core\';\nimport {\n  DsyModal,\n  DsyModalTitle,\n  DsyModalContent,\n  DsyModalActions,\n  DsyModalClose,\n} from \'@ngx-daisy/cdk/modal\';\n\n@Component({\n  selector: \'app-modal-example\',\n  imports: [DsyModal, DsyModalTitle, DsyModalContent, DsyModalActions, DsyModalClose],\n  template: `\n    <button type="button" (click)="dialog.open()">Create project</button>\n    <dsy-modal\n      #dialog\n      aria-labelledby="new-project-title"\n      (closed)="result.set($event)"\n    >\n      <h3 dsyModalTitle id="new-project-title">Create a project</h3>\n      <p dsyModalContent>Ready to create a shared workspace?</p>\n      <div dsyModalActions>\n        <button dsyModalClose="cancelled" type="button">Cancel</button>\n        <button dsyModalClose="created" type="button">Create</button>\n      </div>\n    </dsy-modal>\n  `,\n})\nexport class ModalUsageExample {\n  readonly result = signal<unknown>(null);\n}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
