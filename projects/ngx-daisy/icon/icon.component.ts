import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

export type DsyIconColor =
  | 'inherit'
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

@Component({
  selector: 'dsy-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './icon.component.scss',
  template: '<ng-content />',
  host: {
    class: 'dsy-icon',
    '[style.--dsy-icon-size]': 'size()',
    '[class.dsy-icon-neutral]': "color() === 'neutral'",
    '[class.dsy-icon-primary]': "color() === 'primary'",
    '[class.dsy-icon-secondary]': "color() === 'secondary'",
    '[class.dsy-icon-accent]': "color() === 'accent'",
    '[class.dsy-icon-info]': "color() === 'info'",
    '[class.dsy-icon-success]': "color() === 'success'",
    '[class.dsy-icon-warning]': "color() === 'warning'",
    '[class.dsy-icon-error]': "color() === 'error'",
    '[attr.role]': 'accessibleLabel() ? "img" : null',
    '[attr.aria-label]': 'accessibleLabel()',
    '[attr.aria-hidden]': 'accessibleLabel() ? null : "true"',
  },
})
export class DsyIcon {
  /** A CSS font size shared with the projected icon. */
  readonly size = input<string>();
  /** A daisyUI theme color; inherit follows the surrounding text color. */
  readonly color = input<DsyIconColor>('inherit');
  /** Omit for decorative icons. Label icon-only buttons on the button itself. */
  readonly label = input<string | undefined>(undefined, { alias: 'aria-label' });

  protected readonly accessibleLabel = computed(() => this.label()?.trim() || null);
}
