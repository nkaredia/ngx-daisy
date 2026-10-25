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
import { DsyIndicator, DsyIndicatorItem } from '@ngx-daisy/cdk/indicator';

@Component({
  selector: 'demo-indicator-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyIndicator, DsyIndicatorItem],
  templateUrl: './indicator-demo.html',
  styleUrl: './indicator-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IndicatorDemo {
  readonly playground = playground;
}
