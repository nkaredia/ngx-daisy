import { LucidePlus } from '@lucide/angular';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyInput } from '@ngx-daisy/cdk/input';

interface ExampleValues {
  readonly color?: ReturnType<DsyInput['color']>;
  readonly size?: ReturnType<DsyInput['size']>;
  readonly variant?: ReturnType<DsyInput['variant']>;
}

@Component({
  selector: 'demo-input-example',
  standalone: true,
  imports: [LucidePlus, DsyInput],
  templateUrl: './input-example.html',
  styleUrl: './input-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InputExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly value = signal('');
}
