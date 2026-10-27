import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import type { FormCheckboxControl } from '@angular/forms/signals';
import type { DsyButtonColor, DsyButtonSize } from '@ngx-daisy/core/button';
/** A native button that swaps its label and implements the Signal Forms checkbox contract. */
@Component({
  selector: 'Button[dsySwap]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '',
  styleUrl: './swap.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[text]': 'displayText()',
    '[isEnabled]': '!disabled()',
    '[accessibilityLabel]': 'label()',
    accessibilityRole: 'checkbox',
    accessible: 'true',
    '[accessibilityValue]': 'indeterminate() ? "Mixed" : checked() ? "On" : "Off"',
    '[accessibilityState]': 'disabled() ? "disabled" : checked() ? "checked" : "unchecked"',
    '(tap)': 'toggle()',
    '(blur)': 'touch.emit()',
  },
})
export class DsySwap implements FormCheckboxControl {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();
  readonly label = input('Toggle');
  readonly onText = input('On');
  readonly offText = input('Off');
  readonly indeterminateText = input('Mixed');
  readonly color = input<DsyButtonColor>(undefined, { alias: 'dsyColor' });
  readonly size = input<DsyButtonSize>('md');
  readonly displayText = computed(() =>
    this.indeterminate()
      ? this.indeterminateText()
      : this.checked()
        ? this.onText()
        : this.offText(),
  );
  protected readonly classes = computed(() =>
    [
      'dsy-button',
      'dsy-button-outline',
      `dsy-button-${this.size()}`,
      this.color() ? `dsy-button-${this.color()}` : '',
      this.disabled() ? 'dsy-button-disabled' : '',
    ].join(' '),
  );
  toggle(): void {
    if (this.disabled()) return;
    this.indeterminate.set(false);
    this.checked.update((value) => !value);
    this.touch.emit();
  }
}
