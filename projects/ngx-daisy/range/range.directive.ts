import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { DsyNativeControl } from 'ngx-daisy/form-field';

const colors = {
  neutral: 'range-neutral',
  primary: 'range-primary',
  secondary: 'range-secondary',
  accent: 'range-accent',
  info: 'range-info',
  success: 'range-success',
  warning: 'range-warning',
  error: 'range-error',
};
const sizes = { xs: 'range-xs', sm: 'range-sm', md: 'range-md', lg: 'range-lg', xl: 'range-xl' };
@Directive({
  selector: 'input[type=range][dsyRange]',
  standalone: true,
  exportAs: 'dsyRange',
  hostDirectives: [{ directive: DsyNativeControl, inputs: ['errorStateMatcher'] }],
  host: {
    '[class]': 'classes()',
    '[attr.aria-orientation]': 'vertical() ? "vertical" : "horizontal"',
  },
})
export class DsyRange {
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();

  readonly control = inject(DsyNativeControl);
  private readonly daisy = injectDaisyUIClasses();
  protected readonly classes = computed(() =>
    this.daisy(
      'range',
      colors[this.color()!] ?? '',
      sizes[this.size()!] ?? '',
      this.control.errorState() ? 'range-error' : '',
      this.vertical() ? 'range-vertical' : '',
    ).trim(),
  );
  readonly vertical = input(false, { transform: booleanAttribute });

  focus(options?: FocusOptions): void {
    this.control.focus(options);
  }
}
