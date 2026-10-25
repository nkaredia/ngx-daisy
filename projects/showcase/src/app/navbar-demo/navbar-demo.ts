import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DsyNavbar, DsyNavbarStart, DsyNavbarCenter, DsyNavbarEnd } from 'ngx-daisy/navbar';

@Component({
  selector: 'demo-navbar-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyNavbar, DsyNavbarStart, DsyNavbarCenter, DsyNavbarEnd],
  templateUrl: './navbar-demo.html',
  styleUrl: './navbar-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NavbarDemo {
  readonly playground = playground;
  readonly signedIn = signal(false);
  readonly toggle = (v: boolean) => !v;
}
