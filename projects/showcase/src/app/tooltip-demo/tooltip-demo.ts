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
import { DsyTooltip } from '@ngx-daisy/cdk/tooltip';

@Component({
  providers: providePlayground(playground),
  selector: 'demo-tooltip-demo',
  imports: [Playground, DsyTooltip],
  templateUrl: './tooltip-demo.html',
  styleUrl: './tooltip-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TooltipDemo {
  readonly playground = playground;
}
