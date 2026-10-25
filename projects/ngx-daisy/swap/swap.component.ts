import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DsyButtonColor, DsyButtonSize, DsyButtonVariant } from 'ngx-daisy/button';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
export type DsySwapAnimation = 'none' | 'rotate' | 'flip';
const animations = { none: '', rotate: 'swap-rotate', flip: 'swap-flip' };
@Component({
  selector: 'dsy-swap',
  standalone: true,

  templateUrl: './swap.component.html',
  styleUrl: './swap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DsySwap), multi: true }],
  host: { class: 'dsy-swap' },
})
export class DsySwap implements ControlValueAccessor {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly animation = input<DsySwapAnimation>('none');
  readonly label = input('Toggle', { alias: 'aria-label' });
  readonly color = input<DsyButtonColor>();
  readonly size = input<DsyButtonSize>();
  readonly variant = input<DsyButtonVariant | 'plain'>('plain');
  readonly buttonClass = input('');
  private readonly formsDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formsDisabled());
  protected readonly daisyClasses = injectDaisyUIClasses();
  protected readonly classes = computed(
    () =>
      this.daisyClasses(
        'swap',
        ...[
          animations[this.animation()],
          ...(this.variant() === 'plain'
            ? []
            : [
                'btn',
                {
                  solid: '',
                  outline: 'btn-outline',
                  soft: 'btn-soft',
                  ghost: 'btn-ghost',
                  link: 'btn-link',
                  dash: 'btn-dash',
                  plain: '',
                }[this.variant()],
                this.color()
                  ? {
                      neutral: 'btn-neutral',
                      primary: 'btn-primary',
                      secondary: 'btn-secondary',
                      accent: 'btn-accent',
                      info: 'btn-info',
                      success: 'btn-success',
                      warning: 'btn-warning',
                      error: 'btn-error',
                    }[this.color()!]
                  : '',
                this.size()
                  ? { xs: 'btn-xs', sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', xl: 'btn-xl' }[
                      this.size()!
                    ]
                  : '',
              ]),
          this.checked() && !this.indeterminate() ? 'swap-active' : '',
        ].filter(Boolean),
      ) +
      ' ' +
      this.buttonClass(),
  );
  private change: (checked: boolean) => void = () => {};
  private touched: () => void = () => {};
  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.change = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formsDisabled.set(disabled);
  }
  protected toggle(): void {
    if (this.isDisabled()) return;
    this.indeterminate.set(false);
    this.checked.update((value) => !value);
    this.change(this.checked());
  }
  protected blur(): void {
    this.touched();
  }
}
