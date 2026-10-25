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
import { DsyDivider } from 'ngx-daisy/divider';

@Component({
  selector: 'demo-divider-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyDivider],
  templateUrl: './divider-demo.html',
  styleUrl: './divider-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DividerDemo {
  readonly playground = playground;
}
