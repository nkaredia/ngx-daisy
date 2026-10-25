import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyFormField, DsyHint } from 'ngx-daisy/form-field';
import { DsyInput } from 'ngx-daisy/input';

interface ExampleValues {
  readonly label?: ReturnType<DsyFormField['label']>;
  readonly hideRequiredMarker?: ReturnType<DsyFormField['hideRequiredMarker']>;
}
interface SecondaryValues {
  readonly color?: ReturnType<DsyInput['color']>;
  readonly size?: ReturnType<DsyInput['size']>;
  readonly variant?: ReturnType<DsyInput['variant']>;
}

@Component({
  selector: 'demo-form-field-example',
  standalone: true,
  imports: [DsyFormField, DsyHint, DsyInput],
  templateUrl: './form-field-example.html',
  styleUrl: './form-field-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldExample {
  readonly values = input<readonly [ExampleValues?, SecondaryValues?]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly secondary = computed(() => this.values()[1] ?? {});
  readonly value = signal('');
}
