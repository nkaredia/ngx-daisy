import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  DestroyRef,
  Renderer2,
  RendererStyleFlags2,
  inject,
  input,
  numberAttribute,
  ViewEncapsulation,
} from '@angular/core';
import { DSY_DAISYUI_CONFIG, injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import type {
  DsyButtonColor,
  DsyButtonSize,
  DsyButtonVariant,
  DsyButtonShape,
  DsyButtonLayout,
} from '@ngx-daisy/core/button';

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

export type {
  DsyButtonColor,
  DsyButtonSize,
  DsyButtonVariant,
  DsyButtonShape,
  DsyButtonLayout,
} from '@ngx-daisy/core/button';

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
  private readonly contrastPrefix = inject(DSY_DAISYUI_CONFIG).prefix ?? '';
  protected readonly contrastStyles = computed(() => {
    const color = this.color();
    const variant = this.variant();
    const styles: Record<string, string> = {};
    // Native hooks are namespaced by daisyUI's prefix, independently of Tailwind.
    if (color === 'primary' && variant === 'solid') {
      styles[`--${this.contrastPrefix}btn-fg`] =
        'var(--dsy-color-primary-readable-content, var(--color-primary-content))';
    } else if (color === 'primary' || color === 'secondary') {
      if (variant === 'link') {
        styles[`--${this.contrastPrefix}btn-color`] =
          `var(--dsy-color-${color}-text, var(--color-${color}))`;
      } else if (variant === 'outline' || variant === 'dash' || variant === 'ghost') {
        styles[`--${this.contrastPrefix}btn-rest-fg`] = `var(--dsy-color-${color}-text)`;
      }
    }
    return styles;
  });
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
    afterRenderEffect((onCleanup) => {
      const entries = Object.entries(this.contrastStyles());
      if (!entries.length) return;
      const applied: [string, string][] = [];
      const css = element.ownerDocument.defaultView?.getComputedStyle(element);
      for (const [property, value] of entries) {
        // An application binding owns its explicit native hook; never replace it.
        if (element.style.getPropertyValue(property)) continue;
        const existing = css?.getPropertyValue(property).trim();
        if (existing) {
          const nativeToken = property.endsWith('btn-fg')
            ? '--color-primary-content'
            : `--color-${this.color()}`;
          if (
            property.endsWith('btn-rest-fg') ||
            existing !== css?.getPropertyValue(nativeToken).trim()
          )
            continue;
        }
        renderer.setStyle(element, property, value, RendererStyleFlags2.DashCase);
        applied.push([property, value]);
      }
      onCleanup(() => {
        for (const [property, value] of applied) {
          if (element.style.getPropertyValue(property) === value)
            renderer.removeStyle(element, property, RendererStyleFlags2.DashCase);
        }
      });
    });
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
