import { DSY_NATIVE_FIELD } from '@ngx-daisy/native/form-field';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import type { DsyButtonColor, DsyButtonSize } from '@ngx-daisy/core/button';
import type { Button } from '@nativescript/core';
/** One string-valued form control coordinates all projected native radio options. */
@Component({
  selector: 'StackLayout[dsyRadioGroup]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
    '[accessibilityLabel]': 'accessibleLabel()',
  },
})
export class DsyRadioGroup implements FormValueControl<string> {
  readonly value = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly label = input('');
  private readonly context = inject(DSY_NATIVE_FIELD, { optional: true });
  readonly accessibleLabel = computed(
    () => this.label() || this.context?.label() || 'Choose an option',
  );
  readonly accessibleDescription = computed(() => this.context?.description() || '');
  readonly color = input<DsyButtonColor>('primary', { alias: 'dsyColor' });
  readonly size = input<DsyButtonSize>('md');
  readonly touch = output<void>();
  private readonly options = contentChildren(DsyRadio, { descendants: true });
  select(value: string): void {
    if (this.disabled() || this.readonly() || this.hidden()) return;
    this.value.set(value);
    this.touch.emit();
  }
  focus(): void {
    if (this.disabled() || this.hidden()) return;
    const options = this.options().filter((option) => !option.isDisabled() && !option.hidden());
    (options.find((option) => option.selected()) ?? options[0])?.focus();
  }
}
/** Render one option inside a DsyRadioGroup; apps own adjacent descriptive content. */
@Component({
  selector: 'Button[dsyRadio]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '',
  styleUrl: './radio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[text]': 'selected() ? "●" : ""',
    '[class]': 'classes()',
    '[isEnabled]': '!isDisabled()',
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
    '[accessibilityLabel]': 'label()',
    '[accessibilityHint]': 'description() || group.accessibleDescription()',
    accessible: 'true',
    accessibilityRole: 'radioButton',
    '[accessibilityValue]': 'selected() ? "Selected" : "Not selected"',
    '[accessibilityState]': 'isDisabled() ? "disabled" : selected() ? "checked" : "unchecked"',
    '(tap)': 'select()',
  },
})
export class DsyRadio {
  readonly optionValue = input.required<string>();
  readonly label = input.required<string>();
  readonly description = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  private readonly group = inject(DsyRadioGroup);
  private readonly element = inject<ElementRef<Button>>(ElementRef);
  readonly selected = computed(() => this.group.value() === this.optionValue());
  readonly isDisabled = computed(
    () =>
      this.disabled() ||
      this.hidden() ||
      this.group.disabled() ||
      this.group.readonly() ||
      this.group.hidden(),
  );
  protected readonly classes = computed(() =>
    [
      'dsy-native-choice',
      'dsy-native-radio',
      `dsy-native-choice-${this.group.size()}`,
      `dsy-native-choice-${this.group.color() ?? 'primary'}`,
      this.selected() ? 'dsy-native-choice-selected' : '',
      this.group.invalid() && this.group.touched() ? 'dsy-native-choice-invalid' : '',
      this.isDisabled() ? 'dsy-native-choice-disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
  select(): void {
    if (!this.isDisabled()) this.group.select(this.optionValue());
  }
  focus(): void {
    if (!this.isDisabled()) this.element.nativeElement.focus();
  }
}
