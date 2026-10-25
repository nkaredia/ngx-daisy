import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyOtp } from 'ngx-daisy/otp';

interface ExampleValues {
  readonly hidden?: ReturnType<DsyOtp['hidden']>;
  readonly disabled?: ReturnType<DsyOtp['disabled']>;
  readonly readonly?: ReturnType<DsyOtp['readonly']>;
  readonly required?: ReturnType<DsyOtp['required']>;
  readonly invalid?: ReturnType<DsyOtp['invalid']>;
  readonly touched?: ReturnType<DsyOtp['touched']>;
  readonly dirty?: ReturnType<DsyOtp['dirty']>;
  readonly pending?: ReturnType<DsyOtp['pending']>;
  readonly name?: ReturnType<DsyOtp['name']>;
  readonly id?: ReturnType<DsyOtp['id']>;
  readonly ariaLabel?: ReturnType<DsyOtp['ariaLabel']>;
  readonly ariaLabelledBy?: ReturnType<DsyOtp['ariaLabelledBy']>;
  readonly ariaDescribedBy?: ReturnType<DsyOtp['ariaDescribedBy']>;
  readonly color?: ReturnType<DsyOtp['color']>;
  readonly size?: ReturnType<DsyOtp['size']>;
  readonly visualClass?: ReturnType<DsyOtp['visualClass']>;
  readonly inputClass?: ReturnType<DsyOtp['inputClass']>;
  readonly boxClass?: ReturnType<DsyOtp['boxClass']>;
  readonly length?: ReturnType<DsyOtp['length']>;
  readonly numeric?: ReturnType<DsyOtp['numeric']>;
  readonly joined?: ReturnType<DsyOtp['joined']>;
  readonly value?: ReturnType<DsyOtp['value']>;
}

@Component({
  selector: 'demo-otp-example',
  standalone: true,
  imports: [DsyOtp],
  templateUrl: './otp-example.html',
  styleUrl: './otp-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OtpExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly externalValue = computed(() => this.props().value);
  readonly selected = signal<string | null>('');
  constructor() {
    effect(() => {
      const value = this.externalValue();
      this.selected.set(value === undefined ? '' : value);
    });
  }
}
