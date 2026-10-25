import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyProgress } from 'ngx-daisy/progress';

interface ExampleValues {
  readonly color?: ReturnType<DsyProgress['color']>;
  readonly value?: ReturnType<DsyProgress['value']>;
  readonly max?: ReturnType<DsyProgress['max']>;
  readonly label?: ReturnType<DsyProgress['label']>;
}

@Component({
  selector: 'demo-progress-example',
  standalone: true,
  imports: [DsyProgress],
  templateUrl: './progress-example.html',
  styleUrl: './progress-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProgressExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
}
