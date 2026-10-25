import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Component({
  selector: 'dsy-navbar, nav[dsyNavbar]',
  standalone: true,
  host: { '[class]': 'classes()', role: 'navigation', '[attr.aria-label]': 'label()' },
  template: `<ng-content />`,
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyNavbar {
  readonly daisy = injectDaisyUIClasses();
  readonly label = input('Primary');
  readonly classes = computed(() => this.daisy(...['navbar', ''].filter(Boolean)));
}
@Component({
  selector: 'dsy-navbar-start, [dsyNavbarStart]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyNavbarStart {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['navbar-start', ''].filter(Boolean)));
}
@Component({
  selector: 'dsy-navbar-center, [dsyNavbarCenter]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyNavbarCenter {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['navbar-center', ''].filter(Boolean)));
}
@Component({
  selector: 'dsy-navbar-end, [dsyNavbarEnd]',
  standalone: true,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyNavbarEnd {
  readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => this.daisy(...['navbar-end', ''].filter(Boolean)));
}
