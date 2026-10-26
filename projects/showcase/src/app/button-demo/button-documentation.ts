import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExampleCode } from '../playground/example-code';
import { setup, navigation, form, styling } from './button.code';

@Component({
  selector: 'demo-button-documentation',
  imports: [ExampleCode, RouterLink],
  templateUrl: './button-documentation.html',
  styleUrl: './button-documentation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonDocumentation {
  readonly setup = setup;
  readonly navigation = navigation;
  readonly form = form;
  readonly styling = styling;
  readonly inputs = [
    {
      name: 'color',
      type: 'DsyButtonColor',
      values: 'neutral · primary · secondary · accent · info · success · warning · error',
      default: 'undefined',
      description: 'Semantic theme color. Omit for the default daisyUI button surface.',
    },
    {
      name: 'size',
      type: 'DsyButtonSize',
      values: 'xs · sm · md · lg · xl',
      default: 'undefined',
      description: 'Visual size. Omit when using responsive size classes such as btn-sm md:btn-lg.',
    },
    {
      name: 'variant',
      type: 'DsyButtonVariant',
      values: 'solid · outline · soft · ghost · link · dash',
      default: "'solid'",
      description:
        'Surface treatment. A link variant changes appearance; use an anchor for navigation.',
    },
    {
      name: 'shape',
      type: 'DsyButtonShape',
      values: 'normal · square · circle',
      default: "'normal'",
      description: 'Square and circle reserve equal width and height, suitable for icon actions.',
    },
    {
      name: 'layout',
      type: 'DsyButtonLayout',
      values: 'auto · wide · block',
      default: "'auto'",
      description: 'Use intrinsic width, a wider button, or the full width of its container.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      values: 'true · false',
      default: 'false',
      description:
        'Prevents click and auxiliary-click activation. Native buttons receive disabled; anchors receive aria-disabled and leave the tab order.',
    },
    {
      name: 'loading',
      type: 'boolean',
      values: 'true · false',
      default: 'false',
      description:
        'Shows a decorative spinner, sets aria-busy and disables activation. Keep meaningful visible text.',
    },
    {
      name: 'active',
      type: 'boolean',
      values: 'true · false',
      default: 'false',
      description:
        'Applies the pressed visual treatment. It does not manage selection or set aria-pressed.',
    },
    {
      name: 'type',
      type: "'button' | 'submit' | 'reset'",
      values: 'button · submit · reset',
      default: "'button'",
      description:
        'Native button behavior. Set submit explicitly for a form submission. Ignored on anchors.',
    },
    {
      name: 'tabindex',
      type: 'number | undefined',
      values: 'Native tab index',
      default: 'undefined',
      description:
        'Public alias for the tabIndex member. Prefer native document order; disabled anchors are removed from it.',
    },
  ] as const;
}
