import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'ul[dsyList], ol[dsyList]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyList {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('list', ''));
}
@Component({
  selector: 'li[dsyListRow]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyListRow {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('list-row', ''));
}
@Directive({
  selector: '[dsyListGrow]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyListGrow {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('list-col-grow', ''));
}
@Directive({
  selector: '[dsyListWrap]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyListWrap {
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy('list-col-wrap', ''));
}
