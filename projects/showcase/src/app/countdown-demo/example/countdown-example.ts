import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyCountdown } from 'ngx-daisy/countdown';
export interface CountdownExampleValues {
  readonly value?: ReturnType<DsyCountdown['value']>;
  readonly digits?: ReturnType<DsyCountdown['digits']>;
}
@Component({
  selector: 'demo-countdown-example',
  standalone: true,
  imports: [DsyCountdown],
  templateUrl: './countdown-example.html',
  styleUrl: './countdown-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CountdownExample {
  readonly values = input<readonly CountdownExampleValues[]>([]);
  readonly props = computed<CountdownExampleValues>(() => this.values()[0] ?? {});
}
