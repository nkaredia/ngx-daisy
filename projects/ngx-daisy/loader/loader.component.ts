import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { injectDaisyUIClasses } from 'ngx-daisy/config';

export type DsyLoaderVariant = 'spinner' | 'ring' | 'dots' | 'bars' | 'ball' | 'infinity' | 'bar';
export type DsyLoaderPlacement = 'inline' | 'overlay' | 'page';
export type DsyLoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DsyLoaderColor =
  | 'inherit'
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
export type DsyLoaderAnimation = 'auto' | 'spin' | 'pulse' | 'bounce' | 'none';
export type DsyLoaderSpeed = 'slow' | 'normal' | 'fast';

@Component({
  selector: 'dsy-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'dsy-loader',
    '[hidden]': '!active()',
    '[attr.data-native]': 'native()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-placement]': 'placement()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-animation]': 'animation()',
    '[attr.data-speed]': 'speed()',
    '[attr.data-determinate]': 'progress() !== null',
    '[attr.role]': 'active() ? (progress() === null ? "status" : "progressbar") : null',
    '[attr.aria-label]': 'active() ? accessibleLabel() : null',
    '[attr.aria-valuemin]': 'active() && progress() !== null ? 0 : null',
    '[attr.aria-valuemax]': 'active() && progress() !== null ? 100 : null',
    '[attr.aria-valuenow]': 'active() ? progress() : null',
  },
})
export class DsyLoader {
  readonly variant = input<DsyLoaderVariant>('spinner');
  readonly placement = input<DsyLoaderPlacement>('inline');
  readonly size = input<DsyLoaderSize>('md');
  readonly color = input<DsyLoaderColor>('inherit');
  /** Auto uses the selected visual's animation; other choices animate the whole indicator. */
  readonly animation = input<DsyLoaderAnimation>('auto');
  readonly speed = input<DsyLoaderSpeed>('normal');
  readonly active = input(true, { transform: booleanAttribute });
  readonly showLabel = input(false, { transform: booleanAttribute });
  readonly label = input('Loading', { alias: 'aria-label' });
  /** Percentage for bar/ring only. Null means indeterminate loading. */
  readonly value = input<number | null>(null);

  protected readonly accessibleLabel = computed(() => this.label()?.trim() || 'Loading');
  protected readonly progress = computed(() => {
    const value = this.value();
    if (value === null) return null;
    if (!Number.isFinite(value)) throw new Error('dsy-loader: value must be a finite number.');
    if (this.variant() !== 'bar' && this.variant() !== 'ring')
      throw new Error('dsy-loader: value is supported only for bar and ring variants.');
    return Math.min(100, Math.max(0, value));
  });

  protected readonly daisy = injectDaisyUIClasses();
  protected readonly native = computed(
    () =>
      this.variant() !== 'bar' &&
      this.progress() === null &&
      this.animation() === 'auto' &&
      this.speed() === 'normal',
  );
  protected readonly nativeClasses = computed(() =>
    this.daisy(
      'loading',
      {
        spinner: 'loading-spinner',
        ring: 'loading-ring',
        dots: 'loading-dots',
        bars: 'loading-bars',
        ball: 'loading-ball',
        infinity: 'loading-infinity',
        bar: '',
      }[this.variant()],
      { xs: 'loading-xs', sm: 'loading-sm', md: 'loading-md', lg: 'loading-lg', xl: 'loading-xl' }[
        this.size()
      ],
    ),
  );
  protected readonly spokes = [0, 1, 2, 3, 4, 5, 6, 7];
  protected readonly infinityPath = 'M25 35C5 35 5 65 25 65S55 35 75 35S95 65 75 65S45 35 25 35';
}
