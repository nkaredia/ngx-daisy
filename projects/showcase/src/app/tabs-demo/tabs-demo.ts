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
import { DsyTabs, DsyTab, DsyTabPanel } from '@ngx-daisy/cdk/tabs';

@Component({
  selector: 'demo-tabs-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyTabs, DsyTab, DsyTabPanel],
  templateUrl: './tabs-demo.html',
  styleUrl: './tabs-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TabsDemo {
  readonly playground = playground;
  readonly selected = signal(0);
}
