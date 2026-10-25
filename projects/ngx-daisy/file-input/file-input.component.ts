import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DSY_FIELD_CONTROL, DsyValueControl } from '@ngx-daisy/cdk/form-field';

const colors = {
  neutral: 'file-input-neutral',
  primary: 'file-input-primary',
  secondary: 'file-input-secondary',
  accent: 'file-input-accent',
  info: 'file-input-info',
  success: 'file-input-success',
  warning: 'file-input-warning',
  error: 'file-input-error',
};
const sizes = {
  xs: 'file-input-xs',
  sm: 'file-input-sm',
  md: 'file-input-md',
  lg: 'file-input-lg',
  xl: 'file-input-xl',
};

@Component({
  selector: 'dsy-file-input',
  standalone: true,
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DSY_FIELD_CONTROL, useExisting: forwardRef(() => DsyFileInput) }],
  host: {
    class: 'dsy-file-input',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'leave($event)',
  },
})
export class DsyFileInput
  extends DsyValueControl<readonly File[]>
  implements FormValueControl<readonly File[] | null>
{
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  readonly inputClass = input('');
  readonly accept = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly capture = input<'user' | 'environment' | undefined>();
  readonly variant = input<'bordered' | 'ghost'>('bordered');
  readonly selectionChange = output<readonly File[]>();
  protected readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('file');
  protected readonly daisy = injectDaisyUIClasses();
  protected readonly classes = computed(
    () =>
      this.daisy(
        'file-input',
        colors[this.color()!] ?? '',
        sizes[this.size()!] ?? '',
        this.variant() === 'ghost' ? 'file-input-ghost' : '',
        this.errorState() ? 'file-input-error' : '',
      ) +
      ' ' +
      this.inputClass(),
  );
  constructor() {
    super();
    afterRenderEffect(() => {
      const value = this.value();
      if (!value?.length) this.inputElement().nativeElement.value = '';
    });
  }
  protected select(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.isDisabled() || this.readonly()) {
      input.value = '';
      return;
    }
    const files = Array.from(input.files ?? []);
    this.commit(files);
    this.selectionChange.emit(files);
  }
  clear(): void {
    if (this.isDisabled() || this.readonly()) return;
    this.value.set([]);
    this.inputElement().nativeElement.value = '';
    this.selectionChange.emit([]);
  }
  override reset(): void {
    if (!this.value()?.length) this.inputElement().nativeElement.value = '';
    this.interacted.set(false);
  }
}
