import { computed, Directive, inject, input, model } from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { DsyNativeControl } from 'ngx-daisy/form-field';

const colors = {
  neutral: 'checkbox-neutral',
  primary: 'checkbox-primary',
  secondary: 'checkbox-secondary',
  accent: 'checkbox-accent',
  info: 'checkbox-info',
  success: 'checkbox-success',
  warning: 'checkbox-warning',
  error: 'checkbox-error',
};
const sizes = {
  xs: 'checkbox-xs',
  sm: 'checkbox-sm',
  md: 'checkbox-md',
  lg: 'checkbox-lg',
  xl: 'checkbox-xl',
};
@Directive({
  selector: 'input[type=checkbox][dsyCheckbox]',
  standalone: true,
  exportAs: 'dsyCheckbox',
  hostDirectives: [{ directive: DsyNativeControl, inputs: ['errorStateMatcher'] }],
  host: {
    '[class]': 'classes()',
    '[indeterminate]': 'indeterminate()',
    '(change)': 'clearIndeterminate()',
  },
})
export class DsyCheckbox {
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();

  readonly control = inject(DsyNativeControl);
  private readonly daisy = injectDaisyUIClasses();
  protected readonly classes = computed(() =>
    this.daisy(
      'checkbox',
      colors[this.color()!] ?? '',
      sizes[this.size()!] ?? '',
      this.control.errorState() ? 'checkbox-error' : '',
    ).trim(),
  );
  readonly indeterminate = model(false);
  protected clearIndeterminate(): void {
    this.indeterminate.set(false);
  }

  focus(options?: FocusOptions): void {
    this.control.focus(options);
  }
}
