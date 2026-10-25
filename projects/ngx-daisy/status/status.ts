import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
@Component({
  selector: 'dsy-status, [dsyStatus]',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
})
export class DsyStatus {
  private readonly daisy = injectDaisyUIClasses();
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly classes = computed(() =>
    this.daisy(
      'status',
      {
        neutral: 'status-neutral',
        primary: 'status-primary',
        secondary: 'status-secondary',
        accent: 'status-accent',
        info: 'status-info',
        success: 'status-success',
        warning: 'status-warning',
        error: 'status-error',
      }[this.color()!] ?? '',
      { xs: 'status-xs', sm: 'status-sm', md: 'status-md', lg: 'status-lg', xl: 'status-xl' }[
        this.size()
      ],
    ),
  );
}
