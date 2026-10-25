import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyRadioGroup, DsyRadioButton } from 'ngx-daisy/radio';

interface ExampleValues {
  readonly hidden?: ReturnType<DsyRadioGroup['hidden']>;
  readonly disabled?: ReturnType<DsyRadioGroup['disabled']>;
  readonly readonly?: ReturnType<DsyRadioGroup['readonly']>;
  readonly required?: ReturnType<DsyRadioGroup['required']>;
  readonly invalid?: ReturnType<DsyRadioGroup['invalid']>;
  readonly touched?: ReturnType<DsyRadioGroup['touched']>;
  readonly dirty?: ReturnType<DsyRadioGroup['dirty']>;
  readonly pending?: ReturnType<DsyRadioGroup['pending']>;
  readonly name?: ReturnType<DsyRadioGroup['name']>;
  readonly id?: ReturnType<DsyRadioGroup['id']>;
  readonly ariaLabel?: ReturnType<DsyRadioGroup['ariaLabel']>;
  readonly ariaLabelledBy?: ReturnType<DsyRadioGroup['ariaLabelledBy']>;
  readonly ariaDescribedBy?: ReturnType<DsyRadioGroup['ariaDescribedBy']>;
  readonly color?: ReturnType<DsyRadioGroup['color']>;
  readonly size?: ReturnType<DsyRadioGroup['size']>;
  readonly labelPosition?: ReturnType<DsyRadioGroup['labelPosition']>;
  readonly value?: ReturnType<DsyRadioGroup['value']>;
}

@Component({
  selector: 'demo-radio-example',
  standalone: true,
  imports: [DsyRadioGroup, DsyRadioButton],
  templateUrl: './radio-example.html',
  styleUrl: './radio-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RadioExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly externalValue = computed(() => this.props().value);
  readonly selected = signal<unknown>('design');
  constructor() {
    effect(() => {
      const value = this.externalValue();
      this.selected.set(value === undefined ? 'design' : value);
    });
  }
}
