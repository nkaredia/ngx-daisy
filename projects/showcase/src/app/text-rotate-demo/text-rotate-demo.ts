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
import { DsyTextRotate } from 'ngx-daisy/text-rotate';

@Component({
  selector: 'demo-text-rotate-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyTextRotate],
  templateUrl: './text-rotate-demo.html',
  styleUrl: './text-rotate-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TextRotateDemo {
  readonly playground = playground;
  readonly words = ['accessible', 'flexible', 'beautiful'];
  readonly playing = signal(true);
  readonly toggle = (v: boolean) => !v;
}
