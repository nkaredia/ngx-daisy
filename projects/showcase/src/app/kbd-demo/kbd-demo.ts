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
import { DsyKbd } from '@ngx-daisy/cdk/kbd';

@Component({
  selector: 'demo-kbd-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyKbd],
  templateUrl: './kbd-demo.html',
  styleUrl: './kbd-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class KbdDemo {
  readonly playground = playground;
}
