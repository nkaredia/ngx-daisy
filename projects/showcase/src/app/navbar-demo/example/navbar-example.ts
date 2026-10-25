import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { DsyNavbar, DsyNavbarStart, DsyNavbarCenter, DsyNavbarEnd } from 'ngx-daisy/navbar';
import { DsyButton } from 'ngx-daisy/button';

interface NavbarValues {
  readonly label?: ReturnType<DsyNavbar['label']>;
}

@Component({
  selector: 'demo-navbar-example',
  standalone: true,
  imports: [DsyNavbar, DsyNavbarStart, DsyNavbarCenter, DsyNavbarEnd, DsyButton],
  templateUrl: './navbar-example.html',
  styleUrl: './navbar-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NavbarExample {
  readonly values = input<
    readonly [NavbarValues?, Record<string, never>?, Record<string, never>?, Record<string, never>?]
  >([]);
  readonly props = computed<NavbarValues>(() => this.values()[0] ?? {});
  readonly signedIn = signal(false);
  readonly toggle = (value: boolean) => !value;
}
