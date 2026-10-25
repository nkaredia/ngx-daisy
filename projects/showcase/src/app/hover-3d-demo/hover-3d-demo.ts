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
import { DsyHover3d } from 'ngx-daisy/hover-3d';

@Component({
  selector: 'demo-hover-3d-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyHover3d],
  templateUrl: './hover-3d-demo.html',
  styleUrl: './hover-3d-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Hover3DDemo {
  readonly playground = playground;
  readonly saved = signal(false);
  readonly toggle = (v: boolean) => !v;
}
