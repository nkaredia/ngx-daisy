import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  numberAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-radial-progress, [dsyRadialProgress]',
  standalone: true,
  host: {
    '[class]': 'classes()',
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'safeValue()',
    '[attr.aria-label]': 'label()',
    '[style.--value]': 'safeValue()',
    '[style.--size]': 'size()',
    '[style.--thickness]': 'thickness()',
  },
  template: `<ng-content>{{ safeValue() }}%</ng-content>`,
  styleUrl: './radial-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyRadialProgress {
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
  readonly value = input(0, { transform: numberAttribute });
  readonly size = input('5rem');
  readonly thickness = input('.5rem');
  readonly label = input('Progress');
  readonly safeValue = computed(() =>
    Math.max(0, Math.min(100, Number.isFinite(this.value()) ? this.value() : 0)),
  );
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'radial-progress',
        {
          inherit: '',
          neutral: 'text-neutral',
          primary: 'text-primary',
          secondary: 'text-secondary',
          accent: 'text-accent',
          info: 'text-info',
          success: 'text-success',
          warning: 'text-warning',
          error: 'text-error',
        }[this.color()],
      ].filter(Boolean),
    ),
  );
}
