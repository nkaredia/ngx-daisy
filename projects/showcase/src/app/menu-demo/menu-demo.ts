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
import { DsyMenu, DsyMenuItem, DsyMenuTitle, DsyMenuSubmenu } from '@ngx-daisy/cdk/menu';

@Component({
  selector: 'demo-menu-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyMenu, DsyMenuItem, DsyMenuTitle, DsyMenuSubmenu],
  templateUrl: './menu-demo.html',
  styleUrl: './menu-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MenuDemo {
  readonly playground = playground;
  readonly expanded = signal(true);
}
