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
  selector: 'progress[dsyProgress]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.value]': 'safeValue()',
    '[attr.max]': 'safeMax()',
    '[attr.aria-label]': 'label()',
  },
})
export class DsyProgress {
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
  readonly value = input<number | null, string | number | null>(null, {
    transform: (v) => (v == null ? null : numberAttribute(v)),
  });
  readonly max = input(100, { transform: numberAttribute });
  readonly label = input('Progress');
  readonly safeMax = computed(() =>
    Number.isFinite(this.max()) && this.max() > 0 ? this.max() : 100,
  );
  readonly safeValue = computed(() =>
    this.value() === null || !Number.isFinite(this.value())
      ? null
      : Math.max(0, Math.min(this.safeMax(), this.value()!)),
  );
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'progress',
        {
          inherit: '',
          neutral: 'progress-neutral',
          primary: 'progress-primary',
          secondary: 'progress-secondary',
          accent: 'progress-accent',
          info: 'progress-info',
          success: 'progress-success',
          warning: 'progress-warning',
          error: 'progress-error',
        }[this.color()],
      ].filter(Boolean),
    ),
  );
}
