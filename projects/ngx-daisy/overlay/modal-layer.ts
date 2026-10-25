import { DOCUMENT, inject, Injectable, Injector, signal } from '@angular/core';
import { createBlockScrollStrategy } from '@angular/cdk/overlay';

/** Shares document-level modal state so nested modal surfaces cannot unlock each other. */
@Injectable({ providedIn: 'root' })
export class DsyModalLayer {
  private readonly document = inject(DOCUMENT);
  private readonly scroll = createBlockScrollStrategy(inject(Injector));
  private readonly layers = signal<HTMLElement[]>([]);
  private readonly previousInert = new Map<HTMLElement, string | null>();

  acquire(host: HTMLElement): void {
    if (this.layers().includes(host)) return;
    this.layers.update((layers) => [...layers, host]);
    if (this.layers().length === 1) this.scroll.enable();
    this.updateInert();
  }

  release(host: HTMLElement): void {
    this.layers.update((layers) => layers.filter((drawer) => drawer !== host));
    this.updateInert();
    if (!this.layers().length) this.scroll.disable();
  }

  isTop(host: HTMLElement): boolean {
    return this.layers().at(-1) === host;
  }

  level(host: HTMLElement): number {
    return this.layers().reduce(
      (level, layer, index) =>
        host === layer || host.contains(layer) ? Math.max(level, index) : level,
      0,
    );
  }

  private updateInert(): void {
    for (const [element, value] of this.previousInert) {
      if (value === null) element.removeAttribute('inert');
      else element.setAttribute('inert', value);
    }
    this.previousInert.clear();

    // Start outside the host: CDK's focus-trap anchors live inside it.
    let branch = this.layers().at(-1);
    while (branch && branch !== this.document.body) {
      const parent = branch.parentElement;
      if (!parent) break;
      for (const sibling of Array.from(parent.children)) {
        if (
          sibling !== branch &&
          sibling instanceof HTMLElement &&
          !sibling.classList.contains('cdk-overlay-container')
        ) {
          this.previousInert.set(sibling, sibling.getAttribute('inert'));
          sibling.setAttribute('inert', '');
        }
      }
      branch = parent;
    }
  }
}
