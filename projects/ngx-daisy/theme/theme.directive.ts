import {
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  Renderer2,
  RendererStyleFlags2,
} from '@angular/core';
import { defineDaisyTheme, DsyThemeDefinition } from './theme';

/** Applies a complete runtime theme to this scope. Descendant data-theme scopes still work. */
@Directive({ selector: '[dsyTheme]' })
export class DsyTheme {
  readonly dsyTheme = input<DsyThemeDefinition | null>(null);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect((onCleanup) => {
      const supplied = this.dsyTheme();
      if (!supplied) return;
      const theme = defineDaisyTheme(supplied);
      const host = this.element.nativeElement;
      const previousName = host.getAttribute('data-theme');
      const entries = Object.entries({ ...theme.tokens, 'color-scheme': theme.colorScheme });
      const previous = entries.map(([key]) => [
        key,
        host.style.getPropertyValue(key),
        host.style.getPropertyPriority(key),
      ]);
      this.renderer.setAttribute(host, 'data-theme', theme.name);
      for (const [key, value] of entries)
        this.renderer.setStyle(host, key, value, RendererStyleFlags2.DashCase);
      onCleanup(() => {
        if (previousName === null) this.renderer.removeAttribute(host, 'data-theme');
        else this.renderer.setAttribute(host, 'data-theme', previousName);
        for (const [key, value, priority] of previous) {
          if (value)
            this.renderer.setStyle(
              host,
              key,
              value,
              RendererStyleFlags2.DashCase |
                (priority === 'important' ? RendererStyleFlags2.Important : 0),
            );
          else this.renderer.removeStyle(host, key, RendererStyleFlags2.DashCase);
        }
      });
    });
  }
}
