import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  Injector,
  input,
  numberAttribute,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { DSY_FIELD_CONTROL, DsyValueControl } from '@ngx-daisy/cdk/form-field';
import { DSY_DAISYUI_CONFIG, injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DsyDateAdapter } from './date-adapter';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

@Component({
  selector: 'dsy-calendar',
  standalone: true,
  imports: [LucideChevronLeft, LucideChevronRight],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DSY_FIELD_CONTROL, useExisting: forwardRef(() => DsyCalendar) }],
  host: { class: 'dsy-calendar', '(focusin)': 'focused.set(true)', '(focusout)': 'leave($event)' },
})
export class DsyCalendar
  extends DsyValueControl<string>
  implements FormValueControl<string | null>
{
  readonly daisy = injectDaisyUIClasses();
  // Provider parts skip daisyUI's prefix, but still receive Tailwind's namespace.
  private readonly classConfig = inject(DSY_DAISYUI_CONFIG);
  readonly parts = (...names: string[]) =>
    names
      .filter(Boolean)
      .flatMap((name) =>
        this.classConfig.tailwindPrefix
          ? [this.classConfig.tailwindPrefix + ':' + name, name]
          : [name],
      )
      .join(' ');
  readonly panelClass = input('');
  readonly dateClass = input<(date: string) => string>(() => '');
  readonly min = input<string>();
  readonly max = input<string>();
  readonly dateFilter = input<(date: string) => boolean>(() => true);
  readonly startAt = input<string>();
  readonly locale = input(inject(DsyDateAdapter).locale);
  readonly firstDayOfWeek = input(0, { transform: numberAttribute });
  protected readonly adapter = inject(DsyDateAdapter);
  private readonly injector = inject(Injector);
  protected readonly activeDate = signal(this.adapter.today());
  protected readonly month = computed(() => this.activeDate().slice(0, 7) + '-01');
  protected readonly title = computed(() =>
    this.adapter.format(this.month(), { month: 'long', year: 'numeric' }, this.locale()),
  );
  protected readonly weekdays = computed(() =>
    Array.from({ length: 7 }, (_, i) => {
      const day = (i + this.weekStart()) % 7;
      const date = this.adapter.addDays('2023-01-01', day);
      return {
        short: this.adapter.format(date, { weekday: 'short' }, this.locale()),
        long: this.adapter.format(date, { weekday: 'long' }, this.locale()),
      };
    }),
  );
  protected readonly weeks = computed(() => {
    const first = this.adapter.parse(this.month())!;
    const offset = (first.getUTCDay() - this.weekStart() + 7) % 7;
    const start = this.adapter.addDays(this.month(), -offset);
    return Array.from({ length: 6 }, (_, week) =>
      Array.from({ length: 7 }, (_, day) => this.adapter.addDays(start, week * 7 + day)),
    );
  });
  protected readonly today = this.adapter.today();
  constructor() {
    super();
    effect(() => {
      const value = this.value();
      const start = this.startAt();
      const target = this.adapter.parse(value)
        ? value
        : this.adapter.parse(start)
          ? start
          : this.today;
      if (target) this.activeDate.set(target);
    });
  }
  private weekStart(): number {
    return (((Math.floor(this.firstDayOfWeek()) || 0) % 7) + 7) % 7;
  }
  enabled(date: string): boolean {
    return (
      !this.isDisabled() &&
      (!this.adapter.parse(this.min()) || date >= this.min()!) &&
      (!this.adapter.parse(this.max()) || date <= this.max()!) &&
      this.dateFilter()(date)
    );
  }
  protected selected(date: string): boolean {
    return this.value() === date;
  }
  protected outsideMonth(date: string): boolean {
    return date.slice(0, 7) !== this.month().slice(0, 7);
  }
  protected label(date: string): string {
    return this.adapter.format(date, { dateStyle: 'full' }, this.locale());
  }
  protected number(date: string): number {
    return Number(date.slice(-2));
  }
  protected tabIndex(date: string): number {
    if (!this.enabled(date)) return -1;
    const active = this.enabled(this.activeDate())
      ? this.activeDate()
      : this.weeks()
          .flat()
          .find((day) => this.enabled(day));
    return date === active ? 0 : -1;
  }
  protected choose(date: string): void {
    if (!this.enabled(date) || this.readonly()) return;
    this.activeDate.set(date);
    this.commit(date);
  }
  protected canNavigate(months: number): boolean {
    if (this.isDisabled()) return false;
    const target = this.adapter.addMonths(this.month(), months);
    const end = this.adapter.addDays(this.adapter.addMonths(target, 1), -1);
    return (
      (!this.adapter.parse(this.min()) || end >= this.min()!) &&
      (!this.adapter.parse(this.max()) || target <= this.max()!)
    );
  }
  protected navigate(months: number): void {
    if (!this.canNavigate(months)) return;
    this.activeDate.set(this.adapter.addMonths(this.activeDate(), months));
  }
  override focus(options?: FocusOptions): void {
    this.host.querySelector<HTMLElement>('[data-date][tabindex="0"]')?.focus(options);
  }
  protected keydown(event: KeyboardEvent, date: string): void {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.ctrlKey ||
      event.metaKey ||
      this.isDisabled()
    )
      return;
    const rtl = getComputedStyle(this.host).direction === 'rtl';
    let target: string | undefined;
    let direction = 1;
    switch (event.key) {
      case 'ArrowLeft':
        direction = rtl ? 1 : -1;
        target = this.adapter.addDays(date, direction);
        break;
      case 'ArrowRight':
        direction = rtl ? -1 : 1;
        target = this.adapter.addDays(date, direction);
        break;
      case 'ArrowUp':
        direction = -1;
        target = this.adapter.addDays(date, -7);
        break;
      case 'ArrowDown':
        target = this.adapter.addDays(date, 7);
        break;
      case 'Home':
        direction = 1;
        target = this.adapter.addDays(
          date,
          -((this.adapter.parse(date)!.getUTCDay() - this.weekStart() + 7) % 7),
        );
        break;
      case 'End':
        direction = -1;
        target = this.adapter.addDays(
          date,
          6 - ((this.adapter.parse(date)!.getUTCDay() - this.weekStart() + 7) % 7),
        );
        break;
      case 'PageUp':
        direction = -1;
        target = this.adapter.addMonths(date, event.altKey ? -12 : -1);
        break;
      case 'PageDown':
        target = this.adapter.addMonths(date, event.altKey ? 12 : 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    for (let i = 0; target && i < 366; i++, target = this.adapter.addDays(target, direction)) {
      if (
        (this.adapter.parse(this.min()) && target < this.min()!) ||
        (this.adapter.parse(this.max()) && target > this.max()!)
      )
        return;
      if (this.enabled(target)) {
        this.activeDate.set(target);
        afterNextRender(() => this.focus({ preventScroll: true }), { injector: this.injector });
        return;
      }
    }
  }
}
