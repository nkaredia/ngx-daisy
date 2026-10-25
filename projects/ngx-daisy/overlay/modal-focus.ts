import { DOCUMENT, ElementRef, inject } from '@angular/core';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { DsyModalLayer } from './modal-layer';

export interface DsyModalFocus {
  activate(panel: HTMLElement): void;
  deactivate(restoreFocus?: boolean): void;
  isTop(): boolean;
  level(): number;
  consumeEscape(event: KeyboardEvent): boolean;
}
/** Shared modal lifecycle for drawers and dialogs; call deactivate during destruction. */
export function injectDsyModalFocus(): DsyModalFocus {
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const document = inject(DOCUMENT);
  const platform = inject(Platform);
  const factory = inject(ConfigurableFocusTrapFactory);
  const layers = inject(DsyModalLayer);
  let trap: ConfigurableFocusTrap | undefined;
  let panel: HTMLElement | undefined;
  let previousFocus: HTMLElement | null = null;
  const activeElement = () => {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
  };
  return {
    activate(element) {
      if (!platform.isBrowser || trap) return;
      const active = activeElement();
      previousFocus = active instanceof HTMLElement ? active : null;
      panel = element;
      layers.acquire(host);
      trap = factory.create(element);
      if (!trap.focusInitialElement({ preventScroll: true }))
        element.focus({ preventScroll: true });
    },
    deactivate(restoreFocus = true) {
      if (!trap) return;
      const active = activeElement();
      const focusWasInside = active === document.body || !!panel?.contains(active);
      trap.destroy();
      trap = undefined;
      panel = undefined;
      layers.release(host);
      if (
        restoreFocus &&
        focusWasInside &&
        previousFocus?.isConnected &&
        !previousFocus.closest('[inert]')
      ) {
        previousFocus.focus({ preventScroll: true });
      }
      previousFocus = null;
    },
    isTop: () => layers.isTop(host),
    level: () => layers.level(host),
    consumeEscape(event) {
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !layers.isTop(host)
      )
        return false;
      event.preventDefault();
      event.stopPropagation();
      return true;
    },
  };
}
