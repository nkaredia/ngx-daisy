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
import { DsyStack } from 'ngx-daisy/stack';

@Component({
  selector: 'demo-stack-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyStack],
  templateUrl: './stack-demo.html',
  styleUrl: './stack-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StackDemo {
  readonly playground = playground;
}
