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
import { DsyCountdown } from '@ngx-daisy/cdk/countdown';
import { computed } from '@angular/core';

@Component({
  selector: 'demo-countdown-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyCountdown],
  templateUrl: './countdown-demo.html',
  styleUrl: './countdown-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CountdownDemo {
  readonly playground = playground;
  readonly remaining = signal(3665);
  readonly hours = computed(() => Math.floor(this.remaining() / 3600));
  readonly minutes = computed(() => Math.floor(this.remaining() / 60) % 60);
  readonly seconds = computed(() => this.remaining() % 60);
  tick() {
    this.remaining.update((v) => Math.max(0, v - 1));
  }
}
