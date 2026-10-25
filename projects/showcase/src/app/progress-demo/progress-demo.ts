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
import { DsyProgress } from '@ngx-daisy/cdk/progress';

@Component({
  providers: providePlayground(playground),
  selector: 'demo-progress-demo',
  imports: [Playground, DsyProgress],
  templateUrl: './progress-demo.html',
  styleUrl: './progress-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProgressDemo {
  readonly playground = playground;
  readonly value = signal(45);
}
