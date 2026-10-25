import { Component, ChangeDetectionStrategy, ViewEncapsulation, computed } from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-mockup-window, [dsyMockupWindow]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './mockup-window.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyMockupWindow {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['mockup-window', ''].filter(Boolean)));
}
