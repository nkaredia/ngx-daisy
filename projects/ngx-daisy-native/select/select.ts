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
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import type { Button } from '@nativescript/core';
import { DsyButton } from '@ngx-daisy/native/button';
import { DsyModal } from '@ngx-daisy/native/modal';
import { DsyRadio, DsyRadioGroup } from '@ngx-daisy/native/radio';
import { DSY_NATIVE_FIELD } from '@ngx-daisy/native/form-field';
import type { DsyButtonColor, DsyButtonSize } from '@ngx-daisy/core/button';
export interface DsySelectOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
}
/** Native selection sheet composed from Modal and Radio; only Confirm commits its draft. */
@Component({
  selector: 'GridLayout[dsySelect]',
  standalone: true,
  imports: [DsyButton, DsyModal, DsyRadio, DsyRadioGroup],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'dsy-native-select',
    '[class.dsy-native-select-invalid]': 'invalid() && touched()',
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
  },
})
export class DsySelect implements FormValueControl<string> {
  readonly value = model('');
  readonly options = input<readonly DsySelectOption[]>([]);
  readonly placeholder = input('Choose an option');
  readonly label = input('');
  readonly description = input('');
  readonly confirmText = input('Confirm selection');
  readonly cancelText = input('Cancel');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly color = input<DsyButtonColor>(undefined, { alias: 'dsyColor' });
  readonly size = input<DsyButtonSize>('md');
  readonly triggerClass = input('');
  readonly panelClass = input('');
  readonly optionClass = input('');
  readonly touch = output<void>();
  private readonly context = inject(DSY_NATIVE_FIELD, { optional: true });
  readonly accessibleLabel = computed(
    () => this.label() || this.context?.label() || 'Choose an option',
  );
  readonly accessibleDescription = computed(
    () => this.description() || this.context?.description() || '',
  );
  readonly selectedLabel = computed(
    () =>
      this.options().find((option) => option.value === this.value())?.label ?? this.placeholder(),
  );
  readonly isDisabled = computed(
    () =>
      this.disabled() ||
      this.readonly() ||
      this.hidden() ||
      !this.options().some((option) => !option.disabled),
  );
  readonly draft = signal('');
  readonly opened = signal(false);
  readonly canConfirm = computed(
    () =>
      !this.isDisabled() &&
      this.options().some((option) => option.value === this.draft() && !option.disabled),
  );
  private readonly modal = viewChild(DsyModal);
  private readonly trigger = viewChild<ElementRef<Button>>('trigger');
  constructor() {
    effect(() => {
      if (this.isDisabled() && this.opened()) this.close();
    });
    effect(() => {
      const values = this.options().map((option) => option.value);
      if (new Set(values).size !== values.length)
        throw new Error('dsySelect option values must be unique.');
    });
  }
  open(): void {
    if (this.isDisabled() || this.opened()) return;
    this.draft.set(this.value());
    this.opened.set(true);
    this.modal()?.open();
  }
  choose(option: DsySelectOption): void {
    if (this.opened() && !this.isDisabled() && !option.disabled) this.draft.set(option.value);
  }
  confirm(): void {
    if (!this.opened() || !this.canConfirm()) return;
    this.value.set(this.draft());
    this.finish('selected');
  }
  close(): void {
    this.finish();
  }
  private finish(result?: string): void {
    const modal = this.modal();
    modal?.close(result);
    // A close before modal presentation has no native afterClosed event.
    if (!modal?.opened()) this.onClosed();
  }
  onClosed(): void {
    if (!this.opened()) return;
    this.opened.set(false);
    this.touch.emit();
  }
  focus(): void {
    if (!this.isDisabled()) this.trigger()?.nativeElement.focus();
  }
}
