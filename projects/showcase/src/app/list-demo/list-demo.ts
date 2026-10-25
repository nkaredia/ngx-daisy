import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { playground } from './playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect,
} from '@angular/core';
import { DsyList, DsyListRow, DsyListGrow, DsyListWrap } from '@ngx-daisy/cdk/list';

@Component({
  selector: 'demo-list-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyList, DsyListRow, DsyListGrow, DsyListWrap],
  templateUrl: './list-demo.html',
  styleUrl: './list-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ListDemo {
  readonly playground = playground;
}
