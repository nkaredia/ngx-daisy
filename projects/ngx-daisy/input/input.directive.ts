import { computed, Directive, inject, input, contentChild } from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DsyNativeControl } from '@ngx-daisy/cdk/form-field';

const colors = {
  neutral: 'input-neutral',
  primary: 'input-primary',
  secondary: 'input-secondary',
  accent: 'input-accent',
  info: 'input-info',
  success: 'input-success',
  warning: 'input-warning',
  error: 'input-error',
};
const sizes = { xs: 'input-xs', sm: 'input-sm', md: 'input-md', lg: 'input-lg', xl: 'input-xl' };
@Directive({
  selector: 'input[dsyInput]',
  standalone: true,
  exportAs: 'dsyInput',
  hostDirectives: [{ directive: DsyNativeControl, inputs: ['errorStateMatcher'] }],
  host: { '[class]': 'classes()' },
})
export class DsyInput {
  private readonly wrapper = inject(DsyInputWrapper, { optional: true, skipSelf: true });
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  readonly variant = input<'bordered' | 'ghost'>('bordered');
  readonly control = inject(DsyNativeControl);
  private readonly daisy = injectDaisyUIClasses();
  protected readonly classes = computed(() =>
    this.wrapper
      ? ''
      : this.daisy(
          'input',
          colors[this.color()!] ?? '',
          sizes[this.size()!] ?? '',
          this.variant() === 'ghost' ? 'input-ghost' : '',
          this.control.errorState() ? 'input-error' : '',
        ).trim(),
  );

  focus(options?: FocusOptions): void {
    this.control.focus(options);
  }
}

@Directive({
  selector: '[dsyInputWrapper]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyInputWrapper {
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  readonly variant = input<'bordered' | 'ghost'>('bordered');
  private readonly control = contentChild(DsyNativeControl, { descendants: true });
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() =>
    this.daisy(
      'input',
      colors[this.color()!] ?? '',
      sizes[this.size()!] ?? '',
      this.variant() === 'ghost' ? 'input-ghost' : '',
      this.control()?.errorState() ? 'input-error' : '',
    ),
  );
}
