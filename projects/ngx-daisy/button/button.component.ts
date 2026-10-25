import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  DestroyRef,
  Renderer2,
  inject,
  input,
  numberAttribute,
  ViewEncapsulation,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';

// Complete literals preserve Tailwind source detection for the default unprefixed setup.
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
const variants = {
  solid: '',
  outline: 'btn-outline',
  soft: 'btn-soft',
  ghost: 'btn-ghost',
  link: 'btn-link',
  dash: 'btn-dash',
};

export type DsyButtonColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type DsyButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DsyButtonVariant = 'solid' | 'outline' | 'soft' | 'ghost' | 'link' | 'dash';
export type DsyButtonShape = 'normal' | 'square' | 'circle';
export type DsyButtonLayout = 'auto' | 'wide' | 'block';

const shapes = { normal: '', square: 'btn-square', circle: 'btn-circle' };
const layouts = { auto: '', wide: 'btn-wide', block: 'btn-block' };

@Component({
  selector: 'button[dsyButton], a[dsyButton]',
  standalone: true,
  template: `@if (loading()) {
      <span class="dsy-button-spinner" aria-hidden="true"></span>
    }
    <ng-content />`,
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': '!anchor && isDisabled() ? "" : null',
    '[attr.aria-disabled]': 'anchor && isDisabled() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.tabindex]': 'anchor && isDisabled() ? -1 : tabIndex()',
    '[attr.type]': 'anchor ? null : type()',
  },
})
export class DsyButton {
  readonly color = input<DsyButtonColor>();
  /** Omit to use daisyUI's default size or a consumer-supplied responsive size class. */
  readonly size = input<DsyButtonSize>();
  readonly variant = input<DsyButtonVariant>('solid');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly active = input(false, { transform: booleanAttribute });
  readonly shape = input<DsyButtonShape>('normal');
  readonly layout = input<DsyButtonLayout>('auto');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly tabIndex = input<number | undefined, unknown>(undefined, {
    alias: 'tabindex',
    transform: (value) => (value == null ? undefined : numberAttribute(value, 0)),
  });
  readonly isDisabled = computed(() => this.disabled() || this.loading());
  protected readonly anchor =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'A';
  private readonly daisyClasses = injectDaisyUIClasses();
  protected readonly classes = computed(() => {
    const color = this.color();
    const size = this.size();
    return this.daisyClasses(
      ...[
        'btn',
        color ? colors[color] : '',
        size ? sizes[size] : '',
        variants[this.variant()],
        shapes[this.shape()],
        layouts[this.layout()],
        this.active() ? 'btn-active' : '',
        this.isDisabled() ? 'btn-disabled' : '',
      ].filter(Boolean),
    );
  });
  constructor() {
    const renderer = inject(Renderer2);
    const element = inject(ElementRef).nativeElement;
    const listeners = ['click', 'auxclick'].map((name) =>
      renderer.listen(element, name, (event: Event) => this.guardDisabled(event), {
        capture: true,
      }),
    );
    inject(DestroyRef).onDestroy(() => listeners.forEach((remove) => remove()));
  }
  private guardDisabled(event: Event): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
