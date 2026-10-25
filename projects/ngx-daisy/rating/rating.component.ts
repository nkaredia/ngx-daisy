import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  numberAttribute,
  ViewEncapsulation,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DSY_FIELD_CONTROL, DsyValueControl } from '@ngx-daisy/cdk/form-field';

const colors = {
  neutral: 'rating-neutral',
  primary: 'rating-primary',
  secondary: 'rating-secondary',
  accent: 'rating-accent',
  info: 'rating-info',
  success: 'rating-success',
  warning: 'rating-warning',
  error: 'rating-error',
};
const sizes = {
  xs: 'rating-xs',
  sm: 'rating-sm',
  md: 'rating-md',
  lg: 'rating-lg',
  xl: 'rating-xl',
};
const shapes = {
  star: 'mask-star',
  'star-2': 'mask-star-2',
  heart: 'mask-heart',
  circle: 'mask-circle',
};
@Component({
  selector: 'dsy-rating',
  standalone: true,
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DSY_FIELD_CONTROL, useExisting: forwardRef(() => DsyRating) }],
  host: { class: 'dsy-rating', '(focusin)': 'focused.set(true)', '(focusout)': 'leave($event)' },
})
export class DsyRating extends DsyValueControl<number> implements FormValueControl<number | null> {
  readonly max = input<number | undefined, unknown>(undefined, {
    transform: (value) => (value == null ? undefined : numberAttribute(value)),
  });
  readonly half = input(false, { transform: booleanAttribute });
  readonly allowClear = input(false, { transform: booleanAttribute });
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  readonly shape = input<'star' | 'star-2' | 'heart' | 'circle'>('star');
  readonly color = input('');
  protected readonly resolvedColor = computed(() =>
    ['neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'].includes(
      this.color(),
    )
      ? `var(--color-${this.color()})`
      : this.color() || null,
  );
  readonly itemClass = input('');
  protected readonly count = computed(() =>
    Math.max(1, Math.min(20, Math.floor(this.max() ?? 5) || 5)),
  );
  protected readonly items = computed(() =>
    Array.from(
      { length: this.count() * (this.half() ? 2 : 1) },
      (_, index) => (index + 1) / (this.half() ? 2 : 1),
    ),
  );
  protected readonly groupName = computed(() => this.name() || this.id());
  protected readonly daisy = injectDaisyUIClasses();
  protected readonly classes = computed(() =>
    this.daisy('rating', sizes[this.size()!] ?? '', this.half() ? 'rating-half' : ''),
  );
  protected itemClasses(index: number): string {
    return (
      this.daisy(
        'mask',
        shapes[this.shape()],
        this.half() ? (index % 2 === 0 ? 'mask-half-1' : 'mask-half-2') : '',
      ) +
      ' ' +
      this.itemClass()
    );
  }
  protected label(value: number): string {
    return `${value} of ${this.count()}`;
  }
  protected rate(value: number): void {
    this.commit(value);
  }
}
