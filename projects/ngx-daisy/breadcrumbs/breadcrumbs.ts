import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-breadcrumbs, nav[dsyBreadcrumbs]',
  standalone: true,
  host: { '[class]': 'classes()', role: 'navigation', '[attr.aria-label]': 'label()' },
  template: `<ul>
    <ng-content />
  </ul>`,
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyBreadcrumbs {
  readonly daisy = injectDaisyUIClasses();
  readonly label = input('Breadcrumb');
  readonly classes = computed(() => this.daisy(...['breadcrumbs', ''].filter(Boolean)));
}
