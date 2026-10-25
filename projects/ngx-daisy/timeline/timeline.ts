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
  selector: 'ul[dsyTimeline], ol[dsyTimeline]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyTimeline {
  private readonly daisy = injectDaisyUIClasses();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly compact = input(false, { transform: booleanAttribute });
  readonly snapIcon = input(false, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(
      'timeline',
      { horizontal: 'timeline-horizontal', vertical: 'timeline-vertical' }[this.orientation()],
      this.compact() ? 'timeline-compact' : '',
      this.snapIcon() ? 'timeline-snap-icon' : '',
    ),
  );
}
@Directive({
  selector: '[dsyTimelineStart]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyTimelineStart {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('timeline-start', ''));
}
@Directive({
  selector: '[dsyTimelineMiddle]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyTimelineMiddle {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('timeline-middle', ''));
}
@Directive({
  selector: '[dsyTimelineEnd]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyTimelineEnd {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('timeline-end', ''));
}
@Directive({
  selector: '[dsyTimelineBox]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyTimelineBox {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('timeline-box', ''));
}
