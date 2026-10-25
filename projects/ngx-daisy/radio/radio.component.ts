import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  forwardRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DSY_FIELD_CONTROL, DsyValueControl } from '@ngx-daisy/cdk/form-field';
import { DsyRadioButton } from './radio-button';
import { DSY_RADIO_GROUP } from './radio-context';
const colors = {
  neutral: 'radio-neutral',
  primary: 'radio-primary',
  secondary: 'radio-secondary',
  accent: 'radio-accent',
  info: 'radio-info',
  success: 'radio-success',
  warning: 'radio-warning',
  error: 'radio-error',
};
const sizes = { xs: 'radio-xs', sm: 'radio-sm', md: 'radio-md', lg: 'radio-lg', xl: 'radio-xl' };

@Component({
  selector: 'dsy-radio-group',
  standalone: true,
  template: '<ng-content/>',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DSY_FIELD_CONTROL, useExisting: forwardRef(() => DsyRadioGroup) },
    { provide: DSY_RADIO_GROUP, useExisting: forwardRef(() => DsyRadioGroup) },
  ],
  host: {
    class: 'dsy-radio-group',
    role: 'radiogroup',
    '[id]': 'id()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.aria-required]': 'isRequired()',
    '[attr.aria-invalid]': 'errorState()||null',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'leave($event)',
    '(keydown)': 'keydown($event)',
  },
})
export class DsyRadioGroup<T = unknown>
  extends DsyValueControl<T>
  implements FormValueControl<T | null>
{
  readonly color = input<
    'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>();
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>(Object.is);
  readonly labelPosition = input<'before' | 'after'>('after');
  readonly buttons = contentChildren(DsyRadioButton, { descendants: true });
  readonly groupName = computed(() => this.name() || this.id());
  private readonly daisy = injectDaisyUIClasses();
  readonly radioClasses = computed(() =>
    this.daisy(
      'radio',
      colors[this.color()!] ?? '',
      sizes[this.size()!] ?? '',
      this.errorState() ? 'radio-error' : '',
    ),
  );
  private manager?: FocusKeyManager<DsyRadioButton>;
  constructor() {
    super();
    effect(() => {
      this.manager?.destroy();
      this.manager = new FocusKeyManager(this.buttons())
        .withWrap()
        .withVerticalOrientation()
        .withHorizontalOrientation('ltr')
        .withHomeAndEnd();
    });
    inject(DestroyRef).onDestroy(() => this.manager?.destroy());
  }
  tabIndex(button: DsyRadioButton): number {
    const selected = this.buttons().find((item) => item.selected() && !item.disabled);
    return (selected ?? this.buttons().find((item) => !item.disabled)) === button ? 0 : -1;
  }
  select(button: DsyRadioButton): void {
    if (!button.disabled) this.commit(button.value() as T);
  }
  activate(button: DsyRadioButton): void {
    this.manager?.updateActiveItem(this.buttons().indexOf(button));
  }
  override focus(options?: FocusOptions): void {
    (
      this.buttons().find((item) => item.selected() && !item.disabled) ??
      this.buttons().find((item) => !item.disabled)
    )?.focus(options);
  }
  protected keydown(event: KeyboardEvent): void {
    if (
      this.isDisabled() ||
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (this.readonly()) return;
      this.manager
        ?.withHorizontalOrientation(getComputedStyle(this.host).direction === 'rtl' ? 'rtl' : 'ltr')
        .onKeydown(event);
      const item = this.manager?.activeItem;
      if (item) this.select(item);
    }
  }
}
