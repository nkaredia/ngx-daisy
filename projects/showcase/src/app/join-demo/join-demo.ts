import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { DsyButton } from 'ngx-daisy/button';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DsyJoin, DsyJoinItem } from 'ngx-daisy/join';

@Component({
  selector: 'demo-join-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyJoin, DsyJoinItem, DsyButton],
  templateUrl: './join-demo.html',
  styleUrl: './join-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class JoinDemo {
  readonly playground = playground;
  readonly selected = signal('Day');
}
