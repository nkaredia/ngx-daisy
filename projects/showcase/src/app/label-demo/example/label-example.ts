import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyFloatingLabel } from '@ngx-daisy/cdk/label';
import { DsyInput } from '@ngx-daisy/cdk/input';

interface ExampleValues {}
interface SecondaryValues {
  readonly color?: ReturnType<DsyInput['color']>;
  readonly size?: ReturnType<DsyInput['size']>;
  readonly variant?: ReturnType<DsyInput['variant']>;
}

@Component({
  selector: 'demo-label-example',
  standalone: true,
  imports: [DsyFloatingLabel, DsyInput],
  templateUrl: './label-example.html',
  styleUrl: './label-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LabelExample {
  readonly values = input<readonly [ExampleValues?, SecondaryValues?]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly secondary = computed(() => this.values()[1] ?? {});
  readonly value = signal('');
}
