import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyRange } from '@ngx-daisy/cdk/range';

interface ExampleValues {
  readonly color?: ReturnType<DsyRange['color']>;
  readonly size?: ReturnType<DsyRange['size']>;
  readonly vertical?: ReturnType<DsyRange['vertical']>;
}

@Component({
  selector: 'demo-range-example',
  standalone: true,
  imports: [DsyRange],
  templateUrl: './range-example.html',
  styleUrl: './range-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RangeExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly value = signal(40);
}
