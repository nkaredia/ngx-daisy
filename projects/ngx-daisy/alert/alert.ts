import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-alert, [dsyAlert]',
  standalone: true,
  host: {
    '[class]': 'classes()',
    '[attr.role]': 'announcement()==="off"?null:announcement()==="assertive"?"alert":"status"',
  },
  template: `<ng-content />`,
  styleUrl: './alert.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyAlert {
  readonly daisy = injectDaisyUIClasses();
  readonly color = input<'inherit' | 'info' | 'success' | 'warning' | 'error'>('inherit');
  readonly variant = input<'solid' | 'outline' | 'dash' | 'soft'>('solid');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly announcement = input<'off' | 'polite' | 'assertive'>('polite');
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'alert',
        {
          inherit: '',
          info: 'alert-info',
          success: 'alert-success',
          warning: 'alert-warning',
          error: 'alert-error',
        }[this.color()],
        { solid: '', outline: 'alert-outline', dash: 'alert-dash', soft: 'alert-soft' }[
          this.variant()
        ],
        { horizontal: 'alert-horizontal', vertical: 'alert-vertical' }[this.orientation()],
      ].filter(Boolean),
    ),
  );
}
