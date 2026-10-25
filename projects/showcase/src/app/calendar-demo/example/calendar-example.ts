import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyCalendar } from '@ngx-daisy/cdk/calendar';

interface ExampleValues {
  readonly hidden?: ReturnType<DsyCalendar['hidden']>;
  readonly disabled?: ReturnType<DsyCalendar['disabled']>;
  readonly readonly?: ReturnType<DsyCalendar['readonly']>;
  readonly required?: ReturnType<DsyCalendar['required']>;
  readonly invalid?: ReturnType<DsyCalendar['invalid']>;
  readonly touched?: ReturnType<DsyCalendar['touched']>;
  readonly dirty?: ReturnType<DsyCalendar['dirty']>;
  readonly pending?: ReturnType<DsyCalendar['pending']>;
  readonly name?: ReturnType<DsyCalendar['name']>;
  readonly id?: ReturnType<DsyCalendar['id']>;
  readonly ariaLabel?: ReturnType<DsyCalendar['ariaLabel']>;
  readonly ariaLabelledBy?: ReturnType<DsyCalendar['ariaLabelledBy']>;
  readonly ariaDescribedBy?: ReturnType<DsyCalendar['ariaDescribedBy']>;
  readonly panelClass?: ReturnType<DsyCalendar['panelClass']>;
  readonly min?: ReturnType<DsyCalendar['min']>;
  readonly max?: ReturnType<DsyCalendar['max']>;
  readonly startAt?: ReturnType<DsyCalendar['startAt']>;
  readonly locale?: ReturnType<DsyCalendar['locale']>;
  readonly firstDayOfWeek?: ReturnType<DsyCalendar['firstDayOfWeek']>;
  readonly value?: ReturnType<DsyCalendar['value']>;
}

@Component({
  selector: 'demo-calendar-example',
  standalone: true,
  imports: [DsyCalendar],
  templateUrl: './calendar-example.html',
  styleUrl: './calendar-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CalendarExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly locale = computed(() => {
    const locale = this.props().locale ?? 'en-US';
    try {
      return new Intl.DateTimeFormat(locale).resolvedOptions().locale;
    } catch {
      return 'en-US';
    }
  });
  readonly externalValue = computed(() => this.props().value);
  readonly selected = signal<string | null>(null);
  constructor() {
    effect(() => {
      const value = this.externalValue();
      this.selected.set(value === undefined ? null : value);
    });
  }
}
