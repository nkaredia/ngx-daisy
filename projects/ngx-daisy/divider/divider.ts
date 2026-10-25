import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-divider, [dsyDivider]',
  standalone: true,
  host: { '[class]': 'classes()', role: 'separator', '[attr.aria-orientation]': 'orientation()' },
  template: `<ng-content />`,
  styleUrl: './divider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyDivider {
  readonly daisy = injectDaisyUIClasses();
  readonly color = input<
    | 'inherit'
    | 'neutral'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
  >('inherit');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly align = input<'center' | 'start' | 'end'>('center');
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'divider',
        {
          inherit: '',
          neutral: 'divider-neutral',
          primary: 'divider-primary',
          secondary: 'divider-secondary',
          accent: 'divider-accent',
          info: 'divider-info',
          success: 'divider-success',
          warning: 'divider-warning',
          error: 'divider-error',
        }[this.color()],
        { horizontal: 'divider-vertical', vertical: 'divider-horizontal' }[this.orientation()],
        { center: '', start: 'divider-start', end: 'divider-end' }[this.align()],
      ].filter(Boolean),
    ),
  );
}
