import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  numberAttribute,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { DSY_FIELD_CONTROL, DsyValueControl } from 'ngx-daisy/form-field';

const colors = {
  neutral: 'otp-neutral',
  primary: 'otp-primary',
  secondary: 'otp-secondary',
  accent: 'otp-accent',
  info: 'otp-info',
  success: 'otp-success',
  warning: 'otp-warning',
  error: 'otp-error',
};
const sizes = { xs: 'otp-xs', sm: 'otp-sm', md: 'otp-md', lg: 'otp-lg', xl: 'otp-xl' };

@Component({
  selector: 'dsy-otp',
  standalone: true,
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DSY_FIELD_CONTROL, useExisting: forwardRef(() => DsyOtp) }],
  host: { class: 'dsy-otp', '(focusin)': 'focused.set(true)', '(focusout)': 'leave($event)' },
})
export class DsyOtp extends DsyValueControl<string> implements FormValueControl<string | null> {
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  readonly visualClass = input('');
  readonly inputClass = input('');
  readonly boxClass = input('');
  readonly length = input(6, { transform: numberAttribute });
  readonly numeric = input(true, { transform: booleanAttribute });
  readonly joined = input(false, { transform: booleanAttribute });
  readonly completed = output<string>();
  protected readonly count = computed(() =>
    Math.max(1, Math.min(8, Math.floor(this.length()) || 6)),
  );
  protected readonly boxes = computed(() =>
    Array.from({ length: this.count() }, (_, index) => index),
  );
  protected readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('code');
  protected readonly daisy = injectDaisyUIClasses();
  protected readonly classes = computed(
    () =>
      this.daisy(
        'otp',
        colors[this.color()!] ?? '',
        sizes[this.size()!] ?? '',
        this.joined() ? 'otp-joined' : '',
        this.errorState() ? 'otp-error' : '',
      ) +
      ' ' +
      this.visualClass(),
  );
  private composing = false;
  protected startComposition(): void {
    this.composing = true;
  }
  protected endComposition(event: CompositionEvent): void {
    this.composing = false;
    this.update(event);
  }
  protected update(event: Event): void {
    if (this.composing || this.isDisabled() || this.readonly()) return;
    const element = event.target as HTMLInputElement;
    const value = (this.numeric() ? element.value.replace(/[^0-9]/g, '') : element.value).slice(
      0,
      this.count(),
    );
    element.value = value;
    const previous = this.value();
    this.commit(value);
    if (value.length === this.count() && value !== previous) this.completed.emit(value);
  }
  override reset(): void {
    this.composing = false;
    this.interacted.set(false);
  }
}
