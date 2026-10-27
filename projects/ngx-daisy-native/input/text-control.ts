import { DSY_NATIVE_FIELD } from '@ngx-daisy/native/form-field';
import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import type { DsyButtonColor, DsyButtonSize } from '@ngx-daisy/core/button';
import type { PropertyChangeData, TextField } from '@nativescript/core';

/** Shared native text editing contract. Validation remains owned by Angular schemas. */
@Directive()
export abstract class DsyTextControl implements FormValueControl<string> {
  readonly value = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly label = input('');
  /** Include helper/error text here so the native control announces its context. */
  readonly description = input('');
  private readonly context = inject(DSY_NATIVE_FIELD, { optional: true });
  readonly accessibleLabel = computed(() => this.label() || this.context?.label() || '');
  readonly accessibleDescription = computed(
    () => this.description() || this.context?.description() || '',
  );
  readonly color = input<DsyButtonColor>(undefined, { alias: 'dsyColor' });
  readonly size = input<DsyButtonSize>('md');
  readonly variant = input<'bordered' | 'ghost'>('bordered');
  readonly touch = output<void>();
  private readonly element = inject<ElementRef<TextField>>(ElementRef);
  protected readonly classes = computed(() =>
    [
      'dsy-native-field',
      `dsy-native-field-${this.size()}`,
      this.color() ? `dsy-native-field-${this.color()}` : '',
      this.variant() === 'ghost' ? 'dsy-native-field-ghost' : '',
      this.invalid() && this.touched() ? 'dsy-native-field-invalid' : '',
      this.disabled() ? 'dsy-native-field-disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  focus(): void {
    if (!this.disabled() && !this.hidden()) this.element.nativeElement.focus();
  }
  protected onTextChange(raw: unknown): void {
    const event = raw as PropertyChangeData;
    if (typeof event.value !== 'string' || event.value === this.value()) return;
    if (this.disabled() || this.readonly() || this.hidden()) {
      // Native property-change events also fire for programmatic changes.
      (event.object as TextField).text = this.value();
      return;
    }
    this.value.set(event.value);
  }
}
