import { DSY_NATIVE_FIELD } from '@ngx-daisy/native/form-field';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  output,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import type { DsyButtonColor } from '@ngx-daisy/core/button';
import type { PropertyChangeData, Slider } from '@nativescript/core';
/** Native OS slider with numeric Signal Forms value and bounded step snapping. */
@Component({
  selector: 'Slider[dsyRange]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '',
  styleUrl: './range.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[accessibilityStep]': 'increment()',
    '[isEnabled]': '!disabled() && !readonly() && !hidden()',
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
    '[class]': 'classes()',
    '[accessibilityLabel]': 'accessibleLabel()',
    '[accessibilityHint]': 'accessibleDescription()',
    '(loaded)': 'onLoaded()',
    '(unloaded)': 'loaded = false',
    '(valueChange)': 'onValueChange($event)',
  },
})
export class DsyRange implements FormValueControl<number> {
  readonly value = model(0);
  readonly min = input<number | undefined>(0);
  readonly max = input<number | undefined>(100);
  readonly step = input(1, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly description = input('');
  private readonly context = inject(DSY_NATIVE_FIELD, { optional: true });
  readonly accessibleLabel = computed(() => this.label() || this.context?.label() || 'Range');
  readonly accessibleDescription = computed(
    () => this.description() || this.context?.description() || '',
  );
  readonly color = input<DsyButtonColor>('primary', { alias: 'dsyColor' });
  readonly touch = output<void>();
  protected loaded = false;
  private writing = false;
  private readonly element = inject<ElementRef<Slider>>(ElementRef);
  constructor() {
    // Apply bounds and value as one guarded write: changing a native bound can
    // synchronously coerce the old value before the new model value is written.
    effect(() => this.syncNative());
  }
  protected onLoaded(): void {
    this.syncNative();
    this.loaded = true;
  }
  private syncNative(): void {
    const min = this.lower();
    const max = this.upper();
    const value = this.displayValue();
    this.writing = true;
    try {
      const view = this.element.nativeElement;
      view.minValue = min;
      view.maxValue = max;
      view.value = value;
    } finally {
      this.writing = false;
    }
  }
  private restoreValue(value: number): void {
    this.writing = true;
    try {
      this.element.nativeElement.value = value;
    } finally {
      this.writing = false;
    }
  }
  readonly lower = computed(() => (Number.isFinite(this.min()) ? this.min()! : 0));
  readonly upper = computed(() =>
    Math.max(this.lower(), Number.isFinite(this.max()) ? this.max()! : 100),
  );
  readonly increment = computed(() =>
    Number.isFinite(this.step()) && this.step() > 0 ? this.step() : 1,
  );
  readonly displayValue = computed(() => this.normalize(this.value()));
  protected readonly classes = computed(() =>
    [
      'dsy-native-range',
      `dsy-native-range-${this.color() ?? 'primary'}`,
      this.disabled() ? 'dsy-native-range-disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
  private normalize(value: number): number {
    const bounded = Math.min(
      this.upper(),
      Math.max(this.lower(), Number.isFinite(value) ? value : this.lower()),
    );
    const snapped =
      this.lower() + Math.round((bounded - this.lower()) / this.increment()) * this.increment();
    return Math.min(this.upper(), Math.max(this.lower(), Number(snapped.toPrecision(12))));
  }
  protected onValueChange(raw: unknown): void {
    if (!this.loaded || this.writing) return;
    const event = raw as PropertyChangeData;
    if (typeof event.value !== 'number' || !Number.isFinite(event.value)) return;
    if (event.value === this.displayValue()) return;
    if (this.disabled() || this.readonly() || this.hidden()) {
      this.restoreValue(this.displayValue());
      return;
    }
    const next = this.normalize(event.value);
    // Restore the snapped native value even if it lands on the existing step.
    if (event.value !== next) this.restoreValue(next);
    if (next === this.displayValue()) return;
    this.value.set(next);
    this.touch.emit();
  }
  focus(): void {
    if (!this.disabled() && !this.readonly() && !this.hidden()) this.element.nativeElement.focus();
  }
}
