import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyValidator } from 'ngx-daisy/validator';
import { DsyInput } from 'ngx-daisy/input';

interface ExampleValues {}
interface SecondaryValues {
  readonly color?: ReturnType<DsyInput['color']>;
  readonly size?: ReturnType<DsyInput['size']>;
  readonly variant?: ReturnType<DsyInput['variant']>;
}

@Component({
  selector: 'demo-validator-example',
  standalone: true,
  imports: [DsyValidator, DsyInput],
  templateUrl: './validator-example.html',
  styleUrl: './validator-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ValidatorExample {
  readonly values = input<readonly [ExampleValues?, SecondaryValues?]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly secondary = computed(() => this.values()[1] ?? {});
  readonly value = signal('');
}
