import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-skeleton, [dsySkeleton]',
  standalone: true,
  host: { '[class]': 'classes()', 'aria-hidden': 'true', '[attr.data-animate]': 'animate()' },
  template: `<ng-content />`,
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsySkeleton {
  readonly daisy = injectDaisyUIClasses();
  readonly text = input(false, { transform: booleanAttribute });
  readonly animate = input(true, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(...['skeleton', this.text() ? 'skeleton-text' : ''].filter(Boolean)),
  );
}
