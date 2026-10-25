import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyRating } from 'ngx-daisy/rating';

interface ExampleValues {
  readonly hidden?: ReturnType<DsyRating['hidden']>;
  readonly disabled?: ReturnType<DsyRating['disabled']>;
  readonly readonly?: ReturnType<DsyRating['readonly']>;
  readonly required?: ReturnType<DsyRating['required']>;
  readonly invalid?: ReturnType<DsyRating['invalid']>;
  readonly touched?: ReturnType<DsyRating['touched']>;
  readonly dirty?: ReturnType<DsyRating['dirty']>;
  readonly pending?: ReturnType<DsyRating['pending']>;
  readonly name?: ReturnType<DsyRating['name']>;
  readonly id?: ReturnType<DsyRating['id']>;
  readonly ariaLabel?: ReturnType<DsyRating['ariaLabel']>;
  readonly ariaLabelledBy?: ReturnType<DsyRating['ariaLabelledBy']>;
  readonly ariaDescribedBy?: ReturnType<DsyRating['ariaDescribedBy']>;
  readonly max?: ReturnType<DsyRating['max']>;
  readonly half?: ReturnType<DsyRating['half']>;
  readonly allowClear?: ReturnType<DsyRating['allowClear']>;
  readonly size?: ReturnType<DsyRating['size']>;
  readonly shape?: ReturnType<DsyRating['shape']>;
  readonly color?: ReturnType<DsyRating['color']>;
  readonly itemClass?: ReturnType<DsyRating['itemClass']>;
  readonly value?: ReturnType<DsyRating['value']>;
}

@Component({
  selector: 'demo-rating-example',
  standalone: true,
  imports: [DsyRating],
  templateUrl: './rating-example.html',
  styleUrl: './rating-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RatingExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly externalValue = computed(() => this.props().value);
  readonly selected = signal<number | null>(3);
  constructor() {
    effect(() => {
      const value = this.externalValue();
      this.selected.set(value === undefined ? 3 : value);
    });
  }
}
