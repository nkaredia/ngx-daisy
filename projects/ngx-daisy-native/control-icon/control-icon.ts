import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  ErrorHandler,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  effect,
  inject,
  input,
} from '@angular/core';
import { Color, ImageSource, Utils, isIOS, type View, type Image } from '@nativescript/core';
import type { IconNode } from 'lucide';
import { renderControlIcon } from './artwork';

// Local bridge declarations keep platform SDK globals out of consumer typings.
declare const android: {
  graphics: {
    Bitmap: {
      createBitmap(width: number, height: number, config: unknown): unknown;
      Config: { ARGB_8888: unknown };
    };
    Canvas: new (bitmap: unknown) => unknown;
  };
  text: {
    SpannableString: new (text: string) => {
      setSpan(span: unknown, start: number, end: number, flags: number): void;
    };
    style: { ImageSpan: new (context: unknown, bitmap: unknown, alignment: number) => unknown };
  };
};
type SvgModule = {
  getSVGKImage?(source: string): { UIImage: { imageWithRenderingMode(mode: number): unknown } };
  getSVG?(source: string): { renderToCanvas(canvas: unknown): void };
};
let svgModule: Promise<SvgModule> | undefined;
function loadSvg(): Promise<SvgModule> {
  return (svgModule ??= import('@nativescript-community/ui-svg') as unknown as Promise<SvgModule>);
}

/** Preserve real Button hosts and their accessibility/activation behavior. */
function bindIcon(
  source: () => IconNode | undefined,
  requestedSize: () => number,
  button: boolean,
): void {
  const host = inject<ElementRef<View>>(ElementRef).nativeElement;
  const errors = inject(ErrorHandler);
  const destroy = inject(DestroyRef);
  // Angular's browser unit renderer has no native view lifecycle.
  if (typeof host.on !== 'function') return;
  let disposed = false;
  let generation = 0;
  let lastKey = '';
  let lastNodes: IconNode | undefined;
  const clear = () => {
    if (!host.isLoaded) return;
    if (!button) (host as Image).imageSource = undefined!;
    else if (isIOS) host.ios.setImageForState(null, 0);
    else host.android.setText('');
  };
  const draw = () => {
    const nodes = source();
    const version = ++generation;
    if (disposed || !host.isLoaded) return;
    if (!nodes) {
      lastNodes = undefined;
      lastKey = '';
      clear();
      return;
    }
    const color = host.style.color ?? new Color('#000000');
    const size = Math.max(1, Math.min(64, requestedSize()));
    const key = `${color.hex}:${size}`;
    if (lastNodes === nodes && key === lastKey) return;
    loadSvg()
      .then((svg) => {
        if (disposed || !host.isLoaded || generation !== version) return;
        const rgb = `#${[color.r, color.g, color.b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
        const xml = renderControlIcon(nodes, rgb, size, color.a / 255);
        let nativeImage: unknown;
        if (isIOS) nativeImage = svg.getSVGKImage!(xml).UIImage.imageWithRenderingMode(1);
        else {
          const pixels = Math.ceil(Utils.layout.toDevicePixels(size));
          nativeImage = android.graphics.Bitmap.createBitmap(
            pixels,
            pixels,
            android.graphics.Bitmap.Config.ARGB_8888,
          );
          // AndroidSVG's root dimensions are physical pixels when drawing to a bitmap.
          svg.getSVG!(renderControlIcon(nodes, rgb, pixels, color.a / 255)).renderToCanvas(
            new android.graphics.Canvas(nativeImage),
          );
        }
        const image = new ImageSource(nativeImage);
        if (!button) (host as Image).imageSource = image;
        else if (isIOS) host.ios.setImageForState(image.ios, 0);
        else {
          const text = new android.text.SpannableString('\uFFFC');
          text.setSpan(
            new android.text.style.ImageSpan(host.android.getContext(), image.android, 1),
            0,
            1,
            33,
          );
          host.android.setText(text);
        }
        lastNodes = nodes;
        lastKey = key;
      })
      .catch((error) => {
        if (!disposed && generation === version) errors.handleError(error);
      });
  };
  const unload = () => {
    generation++;
    lastNodes = undefined;
    lastKey = '';
  };
  host.on('loaded', draw);
  host.on('unloaded', unload);
  host.style.on('colorChange', draw);
  effect(draw);
  destroy.onDestroy(() => {
    disposed = true;
    generation++;
    host.off('loaded', draw);
    host.off('unloaded', unload);
    host.style.off('colorChange', draw);
    clear();
  });
}

export function bindControlButtonIcon(
  source: () => IconNode | undefined,
  size: () => number = () => 24,
): void {
  bindIcon(source, size, true);
}

@Directive({ selector: 'Button[dsyControlIcon]', standalone: true })
export class DsyButtonIcon {
  readonly icon = input<IconNode | undefined>(undefined, { alias: 'dsyControlIcon' });
  readonly iconSize = input(20);
  constructor() {
    bindControlButtonIcon(
      () => this.icon(),
      () => this.iconSize(),
    );
  }
}

/** Decorative only: the owning control provides the accessible name and state. */
@Component({
  selector: 'Image[dsyControlIcon]',
  standalone: true,
  template: '',
  schemas: [NO_ERRORS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[width]': 'iconSize()',
    '[height]': 'iconSize()',
    stretch: 'aspectFit',
    accessible: 'false',
    accessibilityHidden: 'true',
    isUserInteractionEnabled: 'false',
  },
})
export class DsyControlIcon {
  readonly icon = input<IconNode | undefined>(undefined, { alias: 'dsyControlIcon' });
  readonly iconSize = input(20);
  constructor() {
    bindIcon(
      () => this.icon(),
      () => this.iconSize(),
      false,
    );
  }
}
