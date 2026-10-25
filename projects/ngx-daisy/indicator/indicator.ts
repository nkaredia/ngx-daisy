import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-indicator, [dsyIndicator]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyIndicator {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['indicator', ''].filter(Boolean)));
}
@Directive({ selector: '[dsyIndicatorItem]', standalone: true, host: { '[class]': 'classes()' } })
export class DsyIndicatorItem {
  readonly daisy = injectDaisyUIClasses();
  readonly horizontal = input<'start' | 'center' | 'end'>('end');
  readonly vertical = input<'top' | 'middle' | 'bottom'>('top');
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'indicator-item',
        { start: 'indicator-start', center: 'indicator-center', end: 'indicator-end' }[
          this.horizontal()
        ],
        { top: 'indicator-top', middle: 'indicator-middle', bottom: 'indicator-bottom' }[
          this.vertical()
        ],
      ].filter(Boolean),
    ),
  );
}
