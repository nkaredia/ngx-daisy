import { Color, CSSType, Property } from '@nativescript/core';
import { colorProperty } from '@nativescript/core/ui/styling/style-properties';
import { registerElement } from '@nativescript/angular';
import { SVGView } from '@nativescript-community/ui-svg';
import { renderArtwork, type SvgArtwork } from './svg-artwork';

/** Showcase-owned SVG renderer. It works with any SVG artwork, not just either icon pack. */
@CSSType('AppSvgIcon')
export class AppSvgIcon extends SVGView {
  declare artwork: SvgArtwork | undefined;

  [colorProperty.setNative](_value: Color): void {
    this.redraw();
  }

  redraw(): void {
    const color = this.style.color ?? new Color('#000000');
    const hex = `#${[color.r, color.g, color.b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
    this.src = this.artwork ? renderArtwork(this.artwork, hex, color.a / 255) : '';
  }
}

new Property<AppSvgIcon, SvgArtwork | undefined>({
  name: 'artwork',
  valueChanged: (view) => view.redraw(),
}).register(AppSvgIcon);

// Registration and native plugin dependency belong to this app, never to DsyIcon.
registerElement('AppSvgIcon', () => AppSvgIcon);
