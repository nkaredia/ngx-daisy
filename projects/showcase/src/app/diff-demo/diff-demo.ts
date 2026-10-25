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
import { DsyDiff } from 'ngx-daisy/diff';

@Component({
  selector: 'demo-diff-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyDiff],
  templateUrl: './diff-demo.html',
  styleUrl: './diff-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DiffDemo {
  readonly playground = playground;
  readonly position = signal(50);
}
