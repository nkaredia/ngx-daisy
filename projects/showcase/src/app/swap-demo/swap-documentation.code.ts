import type { ComponentDocumentationContent } from '../documentation/component-documentation.types';

export const documentation = {
  id: 'swap',
  entryPoint: '@ngx-daisy/cdk/swap',
  summary: 'Switch between two visual states, with an optional indeterminate state.',
  usage: [
    'Project off, on and optional indeterminate content using the static dsySwapOff, dsySwapOn and dsySwapIndeterminate attributes. The default appearance is plain; choose a button variant when you need a button surface.',
  ],
  angular: [
    'checked and indeterminate are boolean models. Bind either checked or an Angular form control as the value owner. The ControlValueAccessor supports Reactive Forms and ngModel; clicking clears indeterminate and toggles checked.',
  ],
  styling: [
    'Appearance follows the active daisyUI theme. Use application utilities for spacing, layout and responsive sizing; keep disabled, hidden and inert safeguards. Match the library prefix provider to the CSS prefix configuration.',
    'buttonClass reaches the internal native button. color and size apply to button variants; animation is none, rotate or flip and respects reduced motion.',
  ],
  accessibility: [
    'Supply a stable action name. The internal button announces aria-pressed, including mixed state. Keep projected icons decorative and noninteractive; inactive slots are hidden and inert.',
  ],
  apiNotes: [
    {
      name: 'checkedChange / indeterminateChange',
      description:
        'Model change outputs support two-way bindings. Let a form binding own checked when using forms.',
    },
    {
      name: 'buttonClass',
      description:
        'Styles the internal button. color and size apply to button variants; plain retains the undecorated swap surface.',
    },
  ],
  files: [
    {
      path: 'swap-example.ts',
      language: 'typescript',
      content:
        'import { Component, signal } from \'@angular/core\';\nimport { DsySwap } from \'@ngx-daisy/cdk/swap\';\n\n@Component({\n  selector: \'app-swap-example\',\n  imports: [DsySwap],\n  template: `\n    <dsy-swap [(checked)]="sound" animation="rotate" aria-label="Enable sound">\n      <span dsySwapOff>Sound off</span>\n      <span dsySwapOn>Sound on</span>\n    </dsy-swap>\n  `,\n})\nexport class SwapUsageExample {\n  readonly sound = signal(false);\n}\n',
    },
  ],
} satisfies ComponentDocumentationContent;
