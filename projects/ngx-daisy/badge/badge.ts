import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-badge, [dsyBadge]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyBadge {
  private readonly daisy = injectDaisyUIClasses();
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly variant = input<'solid' | 'outline' | 'dash' | 'soft' | 'ghost'>('solid');
  readonly classes = computed(() =>
    this.daisy(
      'badge',
      {
        neutral: 'badge-neutral',
        primary: 'badge-primary',
        secondary: 'badge-secondary',
        accent: 'badge-accent',
        info: 'badge-info',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
      }[this.color()!] ?? '',
      { xs: 'badge-xs', sm: 'badge-sm', md: 'badge-md', lg: 'badge-lg', xl: 'badge-xl' }[
        this.size()
      ],
      {
        solid: '',
        outline: 'badge-outline',
        dash: 'badge-dash',
        soft: 'badge-soft',
        ghost: 'badge-ghost',
      }[this.variant()],
    ),
  );
}
