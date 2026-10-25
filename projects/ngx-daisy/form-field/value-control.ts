import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { DsyIdGenerator } from 'ngx-daisy/overlay';
import { DsyFieldControl } from './field-control';
import { DsyErrorStateMatcher, injectDsyFormState } from './form-state';
/** State contract shared by composed Signal Forms controls. Concrete controls implement FormValueControl. */
@Directive({
  host: {
    '[attr.aria-busy]': 'formState().pending ? "true" : null',
    '[attr.hidden]': 'hidden() ? "" : null',
    '[style.display]': 'hidden() ? "none" : null',
  },
})
export abstract class DsyValueControl<T> implements DsyFieldControl {
  readonly value = model<T | null>(null);
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly dirty = input(false, { transform: booleanAttribute });
  readonly pending = input(false, { transform: booleanAttribute });
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly name = input('');
  readonly id = input(inject(DsyIdGenerator).next('dsy-control'));
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });
  readonly ariaLabelledBy = input<string | undefined>(undefined, { alias: 'aria-labelledby' });
  readonly ariaDescribedBy = input('', { alias: 'aria-describedby' });
  readonly errorStateMatcher = input(inject(DsyErrorStateMatcher));
  readonly touch = output<void>();
  readonly focused = signal(false);
  protected readonly interacted = signal(false);
  private readonly fieldLabel = signal<string | null>(null);
  readonly labelledBy = computed(() => this.ariaLabelledBy() || this.fieldLabel());
  setLabelledById(id: string | null): void {
    this.fieldLabel.set(id);
  }
  protected readonly describedIds = signal<string[]>([]);
  protected readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly formState = injectDsyFormState(() => ({
    invalid: this.invalid(),
    touched: this.touched() || this.interacted(),
    dirty: this.dirty(),
    disabled: this.disabled(),
    required: this.required(),
    pending: this.pending(),
  }));
  readonly errorState = computed(() => this.errorStateMatcher().isErrorState(this.formState()));
  readonly isDisabled = computed(() => this.disabled() || this.formState().disabled);
  readonly isRequired = computed(() => this.required() || this.formState().required);
  readonly controlId = computed(() => this.id());
  readonly describedBy = computed(
    () => [this.ariaDescribedBy(), ...this.describedIds()].filter(Boolean).join(' ') || null,
  );
  setDescribedByIds(ids: string[]): void {
    this.describedIds.set(ids);
  }
  protected guardReadonlyClick(event: Event): void {
    if (this.readonly()) event.preventDefault();
  }
  protected guardReadonly(event: KeyboardEvent): void {
    if (
      this.readonly() &&
      [' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(
        event.key,
      )
    )
      event.preventDefault();
  }
  reset(): void {
    this.interacted.set(false);
  }
  focus(options?: FocusOptions): void {
    const selected = this.host.querySelector<HTMLElement>(
      'input:checked:not([disabled]),[tabindex="0"]',
    );
    (
      selected ??
      this.host.querySelector<HTMLElement>(
        'input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled])',
      )
    )?.focus(options);
  }
  protected leave(event: FocusEvent): void {
    if (!this.host.contains(event.relatedTarget as Node)) {
      this.focused.set(false);
      this.interacted.set(true);
      this.touch.emit();
    }
  }
  protected commit(value: T | null): void {
    if (!this.isDisabled() && !this.readonly()) this.value.set(value);
  }
}
