import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DSY_FIELD_CONTROL, DsyValueControl } from '@ngx-daisy/cdk/form-field';

const colors = {
  neutral: 'btn-neutral',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
};
const sizes = { xs: 'btn-xs', sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', xl: 'btn-xl' };

export interface DsyFilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}
@Component({
  selector: 'dsy-filter',
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DSY_FIELD_CONTROL, useExisting: forwardRef(() => DsyFilter) }],
  host: { class: 'dsy-filter', '(focusin)': 'focused.set(true)', '(focusout)': 'leave($event)' },
})
export class DsyFilter extends DsyValueControl<string> implements FormValueControl<string | null> {
  readonly options = input<readonly DsyFilterOption[]>([]);
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  readonly resetLabel = input('Clear filter');
  protected readonly daisy = injectDaisyUIClasses();
  protected readonly classes = this.daisy('filter');
  protected readonly optionClasses = computed(() =>
    this.daisy('btn', colors[this.color()!] ?? '', sizes[this.size()!] ?? ''),
  );
  protected readonly resetClasses = computed(() =>
    this.daisy('btn', 'btn-square', 'filter-reset', sizes[this.size()!] ?? ''),
  );
  protected readonly groupName = computed(() => this.name() || this.id());
  clear(): void {
    this.commit(null);
  }
}
