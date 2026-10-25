import { Component, ChangeDetectionStrategy, ViewEncapsulation, computed } from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-mockup-browser, [dsyMockupBrowser]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './mockup-browser.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyMockupBrowser {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['mockup-browser', ''].filter(Boolean)));
}
@Component({
  selector: 'dsy-browser-toolbar, [dsyBrowserToolbar]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './mockup-browser.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyBrowserToolbar {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['mockup-browser-toolbar', ''].filter(Boolean)));
}
