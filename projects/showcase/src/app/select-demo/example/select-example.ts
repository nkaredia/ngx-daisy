import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsySelect } from '@ngx-daisy/cdk/select';

interface ExampleValues {
  readonly color?: ReturnType<DsySelect['color']>;
  readonly size?: ReturnType<DsySelect['size']>;
  readonly variant?: ReturnType<DsySelect['variant']>;
}

@Component({
  selector: 'demo-select-example',
  standalone: true,
  imports: [DsySelect],
  templateUrl: './select-example.html',
  styleUrl: './select-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SelectExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly value = signal('design');
}
