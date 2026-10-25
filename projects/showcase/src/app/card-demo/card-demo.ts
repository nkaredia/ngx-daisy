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
import { DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions } from 'ngx-daisy/card';

@Component({
  selector: 'demo-card-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions],
  templateUrl: './card-demo.html',
  styleUrl: './card-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardDemo {
  readonly playground = playground;
  readonly selected = signal('None');
}
