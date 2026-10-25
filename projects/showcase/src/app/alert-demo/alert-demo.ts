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
import { DsyAlert } from '@ngx-daisy/cdk/alert';

@Component({
  providers: providePlayground(playground),
  selector: 'demo-alert-demo',
  imports: [Playground, DsyAlert],
  templateUrl: './alert-demo.html',
  styleUrl: './alert-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AlertDemo {
  readonly playground = playground;
}
