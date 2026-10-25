import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'ol[dsySteps], ul[dsySteps]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './steps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsySteps {
  readonly daisy = injectDaisyUIClasses();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'steps',
        { horizontal: 'steps-horizontal', vertical: 'steps-vertical' }[this.orientation()],
      ].filter(Boolean),
    ),
  );
}
@Directive({
  selector: 'li[dsyStep]',
  standalone: true,
  host: { '[class]': 'classes()', '[attr.aria-current]': 'current()?"step":null' },
})
export class DsyStep {
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
  readonly current = input(false, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'step',
        {
          inherit: '',
          neutral: 'step-neutral',
          primary: 'step-primary',
          secondary: 'step-secondary',
          accent: 'step-accent',
          info: 'step-info',
          success: 'step-success',
          warning: 'step-warning',
          error: 'step-error',
        }[this.color()],
      ].filter(Boolean),
    ),
  );
}
@Directive({ selector: '[dsyStepIcon]', standalone: true, host: { '[class]': 'classes()' } })
export class DsyStepIcon {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['step-icon', ''].filter(Boolean)));
}
