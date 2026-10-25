import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-stack, [dsyStack]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './stack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyStack {
  readonly daisy = injectDaisyUIClasses();
  readonly position = input<'top' | 'bottom' | 'start' | 'end'>('bottom');
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'stack',
        { top: 'stack-top', bottom: 'stack-bottom', start: 'stack-start', end: 'stack-end' }[
          this.position()
        ],
      ].filter(Boolean),
    ),
  );
}
