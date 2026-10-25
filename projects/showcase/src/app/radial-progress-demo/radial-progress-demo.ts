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
import { DsyRadialProgress } from 'ngx-daisy/radial-progress';

@Component({
  providers: providePlayground(playground),
  selector: 'demo-radial-progress-demo',
  imports: [Playground, DsyRadialProgress],
  templateUrl: './radial-progress-demo.html',
  styleUrl: './radial-progress-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RadialProgressDemo {
  readonly playground = playground;
  readonly value = signal(72);
}
