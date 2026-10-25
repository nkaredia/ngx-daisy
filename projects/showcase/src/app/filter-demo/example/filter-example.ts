import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyFilter } from '@ngx-daisy/cdk/filter';

interface ExampleValues {
  readonly hidden?: ReturnType<DsyFilter['hidden']>;
  readonly disabled?: ReturnType<DsyFilter['disabled']>;
  readonly readonly?: ReturnType<DsyFilter['readonly']>;
  readonly required?: ReturnType<DsyFilter['required']>;
  readonly invalid?: ReturnType<DsyFilter['invalid']>;
  readonly touched?: ReturnType<DsyFilter['touched']>;
  readonly dirty?: ReturnType<DsyFilter['dirty']>;
  readonly pending?: ReturnType<DsyFilter['pending']>;
  readonly name?: ReturnType<DsyFilter['name']>;
  readonly id?: ReturnType<DsyFilter['id']>;
  readonly ariaLabel?: ReturnType<DsyFilter['ariaLabel']>;
  readonly ariaLabelledBy?: ReturnType<DsyFilter['ariaLabelledBy']>;
  readonly ariaDescribedBy?: ReturnType<DsyFilter['ariaDescribedBy']>;
  readonly color?: ReturnType<DsyFilter['color']>;
  readonly size?: ReturnType<DsyFilter['size']>;
  readonly resetLabel?: ReturnType<DsyFilter['resetLabel']>;
  readonly value?: ReturnType<DsyFilter['value']>;
}

@Component({
  selector: 'demo-filter-example',
  standalone: true,
  imports: [DsyFilter],
  templateUrl: './filter-example.html',
  styleUrl: './filter-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FilterExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly externalValue = computed(() => this.props().value);
  readonly selected = signal<string | null>(null);
  constructor() {
    effect(() => {
      const value = this.externalValue();
      this.selected.set(value === undefined ? null : value);
    });
  }
  readonly options = [
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'research', label: 'Research', disabled: true },
  ];
}
