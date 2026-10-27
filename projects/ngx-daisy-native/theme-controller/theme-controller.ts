import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';
import type { FormCheckboxControl } from '@angular/forms/signals';
import type { DsyThemeDefinition } from '@ngx-daisy/core/theme';
export interface DsyThemeControllerChange {
  readonly theme: DsyThemeDefinition;
  readonly checked: boolean;
}
/** Emits theme intent; the app owns the scope, persistence and coordinated selection. */
@Component({
  selector: 'Switch[dsyThemeController]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[checked]': 'checked()',
    '[isEnabled]': '!disabled()',
    '(checkedChange)': 'onCheckedChange($event)',
    '(blur)': 'touch.emit()',
    '[accessibilityLabel]': 'label()',
  },
})
export class DsyThemeController implements FormCheckboxControl {
  readonly theme = input.required<DsyThemeDefinition>({ alias: 'dsyThemeController' });
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input('Change theme');
  readonly touch = output<void>();
  readonly changed = output<DsyThemeControllerChange>();
  onCheckedChange(event: unknown): void {
    const value = (event as { value?: unknown }).value;
    if (this.disabled() || typeof value !== 'boolean' || value === this.checked()) return;
    this.checked.set(value);
    this.changed.emit({ theme: this.theme(), checked: value });
    this.touch.emit();
  }
}
