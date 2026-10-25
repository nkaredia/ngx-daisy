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
import { DsySteps, DsyStep, DsyStepIcon } from 'ngx-daisy/steps';

@Component({
  selector: 'demo-steps-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsySteps, DsyStep, DsyStepIcon],
  templateUrl: './steps-demo.html',
  styleUrl: './steps-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StepsDemo {
  readonly playground = playground;
  readonly step = signal(0);
  readonly next = (n: number) => Math.min(2, n + 1);
  readonly previous = (n: number) => Math.max(0, n - 1);
}
