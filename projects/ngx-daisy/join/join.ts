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
  selector: 'dsy-join, [dsyJoin]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './join.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyJoin {
  readonly daisy = injectDaisyUIClasses();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'join',
        { horizontal: 'join-horizontal', vertical: 'join-vertical' }[this.orientation()],
      ].filter(Boolean),
    ),
  );
}
@Directive({ selector: '[dsyJoinItem]', standalone: true, host: { '[class]': 'classes()' } })
export class DsyJoinItem {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['join-item', ''].filter(Boolean)));
}
