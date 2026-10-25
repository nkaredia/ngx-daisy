import { computed, Directive, inject, input, contentChild } from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { DsyNativeControl } from 'ngx-daisy/form-field';

const colors = {
  neutral: 'select-neutral',
  primary: 'select-primary',
  secondary: 'select-secondary',
  accent: 'select-accent',
  info: 'select-info',
  success: 'select-success',
  warning: 'select-warning',
  error: 'select-error',
};
const sizes = {
  xs: 'select-xs',
  sm: 'select-sm',
  md: 'select-md',
  lg: 'select-lg',
  xl: 'select-xl',
};
@Directive({
  selector: 'select[dsySelect]',
  standalone: true,
  exportAs: 'dsySelect',
  hostDirectives: [{ directive: DsyNativeControl, inputs: ['errorStateMatcher'] }],
  host: { '[class]': 'classes()' },
})
export class DsySelect {
  private readonly wrapper = inject(DsySelectWrapper, { optional: true, skipSelf: true });
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
          'select',
          colors[this.color()!] ?? '',
          sizes[this.size()!] ?? '',
          this.variant() === 'ghost' ? 'select-ghost' : '',
          this.control.errorState() ? 'select-error' : '',
        ).trim(),
  );

  focus(options?: FocusOptions): void {
    this.control.focus(options);
  }
}

@Directive({
  selector: '[dsySelectWrapper]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsySelectWrapper {
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  readonly variant = input<'bordered' | 'ghost'>('bordered');
  private readonly control = contentChild(DsyNativeControl, { descendants: true });
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() =>
    this.daisy(
      'select',
      colors[this.color()!] ?? '',
      sizes[this.size()!] ?? '',
      this.variant() === 'ghost' ? 'select-ghost' : '',
      this.control()?.errorState() ? 'select-error' : '',
    ),
  );
}
