import { bindNativeFeedback } from '@ngx-daisy/native/motion';
import { DSY_NATIVE_FIELD } from '@ngx-daisy/native/form-field';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import type { FormCheckboxControl } from '@angular/forms/signals';
import type { DsyButtonColor, DsyButtonSize } from '@ngx-daisy/core/button';
import type { Button } from '@nativescript/core';
import { bindControlButtonIcon } from '@ngx-daisy/native/control-icon';
import { Check, Minus } from 'lucide';
/** Native button-backed checkbox: one accessible control with a 44-unit minimum target. */
@Component({
  selector: 'Button[dsyCheckbox]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '',
  styleUrl: './checkbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    text: '',
    '[class]': 'classes()',
    '[isEnabled]': '!disabled() && !readonly() && !hidden()',
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
    '[accessibilityLabel]': 'accessibleLabel()',
    '[accessibilityHint]': 'accessibleDescription()',
    accessible: 'true',
    accessibilityRole: 'checkbox',
    '[accessibilityValue]': 'indeterminate() ? "Mixed" : checked() ? "Checked" : "Unchecked"',
    '[accessibilityState]':
      'disabled() || readonly() ? "disabled" : checked() ? "checked" : "unchecked"',
    '(tap)': 'toggle()',
  },
})
export class DsyCheckbox implements FormCheckboxControl {
  constructor() {
    bindNativeFeedback(
      () => this.mark(),
      () => !this.disabled() && !this.readonly() && !this.hidden(),
    );
    bindControlButtonIcon(() => this.mark());
  }
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly mark = computed(() =>
    this.indeterminate() ? Minus : this.checked() ? Check : undefined,
  );
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly description = input('');
  private readonly context = inject(DSY_NATIVE_FIELD, { optional: true });
  readonly accessibleLabel = computed(() => this.label() || this.context?.label() || 'Checkbox');
  readonly accessibleDescription = computed(
    () => this.description() || this.context?.description() || '',
  );
  readonly color = input<DsyButtonColor>('primary', { alias: 'dsyColor' });
  readonly size = input<DsyButtonSize>('md');
  readonly touch = output<void>();
  private readonly element = inject<ElementRef<Button>>(ElementRef);
  protected readonly classes = computed(() =>
    [
      'dsy-native-choice',
      `dsy-native-choice-${this.size()}`,
      `dsy-native-choice-${this.color() ?? 'primary'}`,
      this.checked() || this.indeterminate() ? 'dsy-native-choice-selected' : '',
      this.invalid() && this.touched() ? 'dsy-native-choice-invalid' : '',
      this.disabled() ? 'dsy-native-choice-disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
  toggle(): void {
    if (this.disabled() || this.readonly() || this.hidden()) return;
    const next = this.indeterminate() || !this.checked();
    this.indeterminate.set(false);
    this.checked.set(next);
    this.touch.emit();
  }
  focus(): void {
    if (!this.disabled() && !this.hidden()) this.element.nativeElement.focus();
  }
}
