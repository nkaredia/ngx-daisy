import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-stats, [dsyStats]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyStats {
  private readonly daisy = injectDaisyUIClasses();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly classes = computed(() =>
    this.daisy(
      'stats',
      { horizontal: 'stats-horizontal', vertical: 'stats-vertical' }[this.orientation()],
    ),
  );
}
@Component({
  selector: 'dsy-stat, [dsyStat]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyStat {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('stat', ''));
}
@Directive({
  selector: '[dsyStatTitle]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyStatTitle {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('stat-title', ''));
}
@Directive({
  selector: '[dsyStatValue]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyStatValue {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('stat-value', ''));
}
@Directive({
  selector: '[dsyStatDesc]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyStatDesc {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('stat-desc', ''));
}
@Directive({
  selector: '[dsyStatFigure]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyStatFigure {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('stat-figure', ''));
}
@Directive({
  selector: '[dsyStatActions]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyStatActions {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('stat-actions', ''));
}
