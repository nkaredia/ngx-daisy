import { afterEveryRender, Directive, ElementRef, inject, input } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

/** Copies inherited styling onto a scope outside a portalled panel, so panel classes still win. */
@Directive({ selector: '[dsyOverlayTheme]', standalone: true })
export class DsyOverlayTheme {
  readonly source = input.required<HTMLElement>({ alias: 'dsyOverlayTheme' });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly platform = inject(Platform);
  private previous = new Set<string>();
  constructor() {
    afterEveryRender(() => {
      if (!this.platform.isBrowser) return;
      const style = getComputedStyle(this.source());
      const current = new Set<string>();
      for (const name of Array.from(style)) {
        if (!name.startsWith('--')) continue;
        current.add(name);
        const value = style.getPropertyValue(name);
        if (this.element.style.getPropertyValue(name) !== value)
          this.element.style.setProperty(name, value);
      }
      for (const name of this.previous)
        if (!current.has(name)) this.element.style.removeProperty(name);
      this.previous = current;
      for (const property of [
        'font-family',
        'font-size',
        'font-weight',
        'line-height',
        'color-scheme',
      ]) {
        const value = style.getPropertyValue(property);
        if (this.element.style.getPropertyValue(property) !== value)
          this.element.style.setProperty(property, value);
      }
      this.element.dir = style.direction;
    });
  }
}
