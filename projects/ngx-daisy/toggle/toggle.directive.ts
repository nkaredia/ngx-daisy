import { computed, Directive, inject, input } from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DsyNativeControl } from '@ngx-daisy/cdk/form-field';

const colors = {
  neutral: 'toggle-neutral',
  primary: 'toggle-primary',
  secondary: 'toggle-secondary',
  accent: 'toggle-accent',
  info: 'toggle-info',
  success: 'toggle-success',
  warning: 'toggle-warning',
  error: 'toggle-error',
};
const sizes = {
  xs: 'toggle-xs',
  sm: 'toggle-sm',
  md: 'toggle-md',
  lg: 'toggle-lg',
  xl: 'toggle-xl',
};
@Directive({
  selector: 'input[type=checkbox][dsyToggle]',
  standalone: true,
  exportAs: 'dsyToggle',
  hostDirectives: [{ directive: DsyNativeControl, inputs: ['errorStateMatcher'] }],
  host: { '[class]': 'classes()', role: 'switch' },
})
export class DsyToggle {
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();

  readonly control = inject(DsyNativeControl);
  private readonly daisy = injectDaisyUIClasses();
  protected readonly classes = computed(() =>
    this.daisy(
      'toggle',
      colors[this.color()!] ?? '',
      sizes[this.size()!] ?? '',
      this.control.errorState() ? 'toggle-error' : '',
    ).trim(),
  );

  focus(options?: FocusOptions): void {
    this.control.focus(options);
  }
}
