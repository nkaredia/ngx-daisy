import { DocumentationPage } from '../documentation/documentation-page/documentation-page';
import { ComponentDocumentation } from '../documentation/component-documentation';
import { componentDocumentationSections } from '../documentation/component-documentation.types';
import { documentation } from './loader-documentation.code';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';
import {
  DsyLoader,
  type DsyLoaderAnimation,
  type DsyLoaderColor,
  type DsyLoaderSize,
  type DsyLoaderSpeed,
  type DsyLoaderVariant,
} from '@ngx-daisy/cdk/loader';

@Component({
  providers: providePlayground(playground),
  selector: 'demo-loader-demo',
  imports: [DocumentationPage, ComponentDocumentation, Playground, DsyButton, DsyLoader],
  templateUrl: './loader-demo.html',
  styleUrl: './loader-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoaderDemo {
  readonly playground = playground;
  readonly documentation = documentation;
  readonly documentationSections = componentDocumentationSections(documentation.id);
  readonly variant = signal<DsyLoaderVariant>('spinner');
  readonly animation = signal<DsyLoaderAnimation>('auto');
  readonly speed = signal<DsyLoaderSpeed>('normal');
  readonly size = signal<DsyLoaderSize>('lg');
  readonly color = signal<DsyLoaderColor>('primary');
  readonly progress = signal(65);
  readonly overlayActive = signal(false);
  readonly pageActive = signal(false);

  readonly variants: readonly DsyLoaderVariant[] = [
    'spinner',
    'ring',
    'dots',
    'bars',
    'ball',
    'infinity',
    'bar',
  ];
  readonly compactVariants = this.variants.filter((variant) => variant !== 'bar');
  readonly animations: readonly DsyLoaderAnimation[] = ['auto', 'spin', 'pulse', 'bounce', 'none'];
  readonly speeds: readonly DsyLoaderSpeed[] = ['slow', 'normal', 'fast'];
  readonly sizes: readonly DsyLoaderSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  readonly colors: readonly DsyLoaderColor[] = [
    'inherit',
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error',
  ];

  private pageTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearPageTimer());
  }

  setVariant(value: string) {
    const variant = this.variants.find((variant) => variant === value);
    if (variant) this.variant.set(variant);
  }

  setAnimation(value: string) {
    const animation = this.animations.find((animation) => animation === value);
    if (animation) this.animation.set(animation);
  }

  setSpeed(value: string) {
    const speed = this.speeds.find((speed) => speed === value);
    if (speed) this.speed.set(speed);
  }

  setSize(value: string) {
    const size = this.sizes.find((size) => size === value);
    if (size) this.size.set(size);
  }

  setColor(value: string) {
    const color = this.colors.find((color) => color === value);
    if (color) this.color.set(color);
  }

  setProgress(value: number) {
    if (Number.isFinite(value)) this.progress.set(Math.min(100, Math.max(0, value)));
  }

  previewPage() {
    this.clearPageTimer();
    this.pageActive.set(true);
    this.pageTimer = setTimeout(() => {
      this.pageActive.set(false);
      this.pageTimer = undefined;
    }, 2000);
  }

  private clearPageTimer() {
    if (this.pageTimer !== undefined) {
      clearTimeout(this.pageTimer);
      this.pageTimer = undefined;
    }
  }
}
