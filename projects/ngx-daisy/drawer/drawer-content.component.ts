import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { DSY_DRAWER_CONTAINER } from './drawer-context';
import { injectDaisyUIClasses } from 'ngx-daisy/config';

@Component({
  selector: 'dsy-drawer-content',
  standalone: true,
  templateUrl: './drawer-content.component.html',
  styleUrl: './drawer-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'dsy-drawer-content', '[class]': 'daisyClasses("drawer-content")' },
})
export class DsyDrawerContent {
  protected readonly daisyClasses = injectDaisyUIClasses();
  constructor() {
    inject(DSY_DRAWER_CONTAINER);
  }
}
