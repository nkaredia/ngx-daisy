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
import { DsyStatus } from '@ngx-daisy/cdk/status';

@Component({
  selector: 'demo-status-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyStatus],
  templateUrl: './status-demo.html',
  styleUrl: './status-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StatusDemo {
  readonly playground = playground;
}
