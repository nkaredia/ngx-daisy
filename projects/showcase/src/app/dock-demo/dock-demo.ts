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
import { DsyDock, DsyDockItem, DsyDockLabel } from 'ngx-daisy/dock';

@Component({
  selector: 'demo-dock-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyDock, DsyDockItem, DsyDockLabel],
  templateUrl: './dock-demo.html',
  styleUrl: './dock-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DockDemo {
  readonly playground = playground;
  readonly selected = signal('Home');
}
