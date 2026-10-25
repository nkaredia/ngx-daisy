import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'kbd[dsyKbd]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyKbd {
  private readonly daisy = injectDaisyUIClasses();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly classes = computed(() =>
    this.daisy(
      'kbd',
      { xs: 'kbd-xs', sm: 'kbd-sm', md: 'kbd-md', lg: 'kbd-lg', xl: 'kbd-xl' }[this.size()],
    ),
  );
}
