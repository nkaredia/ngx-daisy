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
import { DsyBadge } from 'ngx-daisy/badge';

@Component({
  selector: 'demo-badge-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyBadge],
  templateUrl: './badge-demo.html',
  styleUrl: './badge-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BadgeDemo {
  readonly playground = playground;
}
