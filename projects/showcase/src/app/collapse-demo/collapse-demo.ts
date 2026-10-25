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
import { DsyCollapse } from 'ngx-daisy/collapse';

@Component({
  selector: 'demo-collapse-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyCollapse],
  templateUrl: './collapse-demo.html',
  styleUrl: './collapse-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CollapseDemo {
  readonly playground = playground;
  readonly opened = signal(true);
}
