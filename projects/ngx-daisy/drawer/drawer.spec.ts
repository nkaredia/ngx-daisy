import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { afterEach, vi } from 'vitest';
import { DsyDrawerContainer } from './drawer-container.component';
import { DsyDrawerContent } from './drawer-content.component';
import { DsyDrawer } from './drawer.component';

@Component({
  standalone: true,
  imports: [DsyDrawerContainer, DsyDrawerContent, DsyDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<dsy-drawer-container>
    <dsy-drawer-content>
      <button type="button" data-trigger (click)="drawer.open()">Open</button>
      <main tabindex="-1" data-route-content>Page content</main>
    </dsy-drawer-content>
    <dsy-drawer
      #drawer
      [(opened)]="opened"
      [mode]="mode()"
      [position]="position()"
      [width]="width()"
      [aria-label]="label()"
      [disableClose]="disableClose()"
    >
      <nav>
        <button type="button" data-close (click)="drawer.close()">Close</button>
        <a href="#destination">Link</a>
      </nav>
    </dsy-drawer>
  </dsy-drawer-container>`,
})
class DsyTestDrawerHost {
  readonly drawer = viewChild.required(DsyDrawer);
  readonly opened = signal(false);
  readonly mode = signal<'over' | 'side'>('over');
  readonly position = signal<'start' | 'end'>('start');
  readonly width = signal('18rem');
  readonly label = signal('Navigation');
  readonly disableClose = signal(false);
}

@Component({
  standalone: true,
  imports: [DsyDrawerContainer, DsyDrawerContent, DsyDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<dsy-drawer-container>
    <dsy-drawer-content data-outer-content>
      <button type="button" data-outer-trigger (click)="outer.open()">Open outer</button>
    </dsy-drawer-content>
    <dsy-drawer #outer [(opened)]="outerOpened" aria-label="Outer navigation">
      <button type="button" data-outer-close (click)="outer.close()">Close outer</button>
      <dsy-drawer-container>
        <dsy-drawer-content data-inner-content>
          <button type="button" data-inner-trigger (click)="inner.open()">Open inner</button>
        </dsy-drawer-content>
        <dsy-drawer #inner [(opened)]="innerOpened" aria-label="Inner navigation">
          <button type="button" data-inner-close (click)="inner.close()">Close inner</button>
        </dsy-drawer>
      </dsy-drawer-container>
    </dsy-drawer>
  </dsy-drawer-container>`,
})
class DsyTestNestedDrawerHost {
  readonly outer = viewChild.required<DsyDrawer>('outer');
  readonly inner = viewChild.required<DsyDrawer>('inner');
  readonly outerOpened = signal(false);
  readonly innerOpened = signal(false);
}

function element<T extends HTMLElement = HTMLElement>(root: HTMLElement, selector: string): T {
  const match = root.querySelector<T>(selector);
  if (!match) throw new Error(`Expected an element matching "${selector}".`);
  return match;
}

async function renderDrawer() {
  const fixture = TestBed.createComponent(DsyTestDrawerHost);
  await fixture.whenStable();
  return { fixture, host: fixture.componentInstance, root: fixture.nativeElement as HTMLElement };
}

function escape(target: HTMLElement, options: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', {
    key: 'Escape',
    bubbles: true,
    cancelable: true,
    ...options,
  });
  target.dispatchEvent(event);
  return event;
}

function mockScrollableDocument() {
  const viewport = TestBed.inject(ViewportRuler);
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000);
  vi.spyOn(viewport, 'getViewportSize').mockReturnValue({ width: 1024, height: 768 });
  vi.spyOn(viewport, 'getViewportScrollPosition').mockReturnValue({ left: 12, top: 80 });
  vi.spyOn(window, 'scroll').mockImplementation(() => {});
}

describe('DsyDrawer', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  it('keeps a closed drawer inert and hidden from accessibility while preserving projected navigation', async () => {
    const { root, host } = await renderDrawer();
    const drawer = element(root, 'dsy-drawer');
    const panel = element(root, '.dsy-drawer-panel');

    expect(host.opened()).toBe(false);
    expect(drawer.classList.contains('drawer-side')).toBe(true);
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(panel.hasAttribute('role')).toBe(false);
    expect(panel.hasAttribute('aria-modal')).toBe(false);
    expect(panel.querySelector('nav a')?.textContent).toBe('Link');
    expect(element<HTMLButtonElement>(root, '.drawer-overlay').disabled).toBe(true);
  });

  it('opens as a labeled modal, updates the bound state and makes background content inert', async () => {
    const { fixture, host, root } = await renderDrawer();
    const trigger = element<HTMLButtonElement>(root, '[data-trigger]');
    trigger.focus();
    trigger.click();
    await fixture.whenStable();
    const panel = element(root, '.dsy-drawer-panel');
    const backdrop = element<HTMLButtonElement>(root, '.drawer-overlay');

    expect(host.opened()).toBe(true);
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-label')).toBe('Navigation');
    expect(panel.hasAttribute('inert')).toBe(false);
    expect(panel.hasAttribute('aria-hidden')).toBe(false);
    expect(element(root, 'dsy-drawer-content').hasAttribute('inert')).toBe(true);
    expect(backdrop.tagName).toBe('BUTTON');
    expect(backdrop.tabIndex).toBe(-1);
    expect(backdrop.disabled).toBe(false);

    host.label.set('  Menu  ');
    await fixture.whenStable();
    expect(panel.getAttribute('aria-label')).toBe('Menu');
    host.label.set('  ');
    await fixture.whenStable();
    expect(panel.getAttribute('aria-label')).toBe('Navigation');
  });

  it('closes on Escape, immediately makes the panel inert, and updates two-way state', async () => {
    const { fixture, host, root } = await renderDrawer();
    host.drawer().open();
    await fixture.whenStable();
    const event = escape(element(root, '[data-close]'));
    await fixture.whenStable();

    expect(event.defaultPrevented).toBe(true);
    expect(host.opened()).toBe(false);
    expect(element(root, '.dsy-drawer-panel').hasAttribute('inert')).toBe(true);
    expect(element(root, '.dsy-drawer-panel').getAttribute('aria-hidden')).toBe('true');
    expect(element(root, 'dsy-drawer-content').hasAttribute('inert')).toBe(false);
  });

  it('keeps an existing CDK overlay container available while making page content inert', async () => {
    const { fixture, host, root } = await renderDrawer();
    const overlayContainer = TestBed.inject(OverlayContainer).getContainerElement();
    const overlayControl = document.createElement('button');
    overlayControl.textContent = 'Menu item';
    overlayContainer.append(overlayControl);

    host.drawer().open();
    await fixture.whenStable();
    expect(element(root, 'dsy-drawer-content').hasAttribute('inert')).toBe(true);
    expect(overlayContainer.isConnected).toBe(true);
    expect(overlayControl.closest('[inert]')).toBeNull();

    host.drawer().close();
    await fixture.whenStable();
    expect(overlayControl.closest('[inert]')).toBeNull();
    expect(overlayContainer.contains(overlayControl)).toBe(true);
  });

  it('closes from the backdrop and supports programmatic toggling', async () => {
    const { fixture, host, root } = await renderDrawer();
    host.drawer().toggle();
    await fixture.whenStable();
    expect(host.opened()).toBe(true);
    element<HTMLButtonElement>(root, '.drawer-overlay').click();
    await fixture.whenStable();
    expect(host.opened()).toBe(false);

    host.drawer().toggle();
    await fixture.whenStable();
    host.drawer().toggle();
    await fixture.whenStable();
    expect(host.opened()).toBe(false);
  });

  it('respects disableClose for dismiss gestures while allowing explicit close actions', async () => {
    const { fixture, host, root } = await renderDrawer();
    host.disableClose.set(true);
    host.drawer().open();
    await fixture.whenStable();

    escape(element(root, '[data-close]'));
    await fixture.whenStable();
    expect(host.opened()).toBe(true);
    const backdrop = element<HTMLButtonElement>(root, '.drawer-overlay');
    expect(backdrop.disabled).toBe(true);
    backdrop.click();
    await fixture.whenStable();
    expect(host.opened()).toBe(true);

    element<HTMLButtonElement>(root, '[data-close]').click();
    await fixture.whenStable();
    expect(host.opened()).toBe(false);
  });

  it('does not dismiss an overlay for modified Escape keys or an IME composition', async () => {
    const { fixture, host, root } = await renderDrawer();
    host.drawer().open();
    await fixture.whenStable();
    const close = element(root, '[data-close]');

    escape(close, { ctrlKey: true });
    escape(close, { isComposing: true });
    await fixture.whenStable();
    expect(host.opened()).toBe(true);
  });

  it('lets projected controls consume Escape before the drawer handles dismissal', async () => {
    const { fixture, host, root } = await renderDrawer();
    host.drawer().open();
    await fixture.whenStable();
    const close = element(root, '[data-close]');
    close.addEventListener('keydown', (event) => event.preventDefault(), { once: true });

    const event = escape(close);
    await fixture.whenStable();
    expect(event.defaultPrevented).toBe(true);
    expect(host.opened()).toBe(true);
    expect(element(root, '.dsy-drawer-panel').getAttribute('aria-modal')).toBe('true');
  });

  it('renders an open side drawer without modal semantics, background inertness or Escape dismissal', async () => {
    const { fixture, host, root } = await renderDrawer();
    host.mode.set('side');
    host.opened.set(true);
    host.position.set('end');
    host.width.set('22rem');
    await fixture.whenStable();
    const panel = element(root, '.dsy-drawer-panel');
    const drawer = element(root, 'dsy-drawer');
    const container = element(root, 'dsy-drawer-container');

    expect(panel.hasAttribute('inert')).toBe(false);
    expect(panel.hasAttribute('role')).toBe(false);
    expect(panel.hasAttribute('aria-modal')).toBe(false);
    expect(element(root, 'dsy-drawer-content').hasAttribute('inert')).toBe(false);
    expect(container.classList.contains('drawer-open')).toBe(true);
    expect(container.classList.contains('drawer-end')).toBe(true);
    expect(drawer.style.getPropertyValue('--dsy-drawer-width')).toBe('22rem');
    expect(element<HTMLButtonElement>(root, '.drawer-overlay').disabled).toBe(true);
    escape(element(root, '[data-close]'));
    await fixture.whenStable();
    expect(host.opened()).toBe(true);
  });

  it('releases modal behavior without moving focus when an open overlay becomes a side drawer', async () => {
    const { fixture, host, root } = await renderDrawer();
    mockScrollableDocument();
    element(root, '[data-trigger]').focus();
    host.drawer().open();
    await fixture.whenStable();
    expect(document.documentElement.classList.contains('cdk-global-scrollblock')).toBe(true);
    const close = element(root, '[data-close]');
    close.focus();

    host.mode.set('side');
    await fixture.whenStable();
    expect(host.opened()).toBe(true);
    expect(element(root, '.dsy-drawer-panel').hasAttribute('aria-modal')).toBe(false);
    expect(element(root, 'dsy-drawer-content').hasAttribute('inert')).toBe(false);
    expect(document.documentElement.classList.contains('cdk-global-scrollblock')).toBe(false);
    expect(document.activeElement).toBe(close);
  });

  it('restores focus to the connected opening control when closed normally', async () => {
    const { fixture, host, root } = await renderDrawer();
    const trigger = element(root, '[data-trigger]');
    trigger.focus();
    host.drawer().open();
    await fixture.whenStable();
    element(root, '[data-close]').focus();

    host.drawer().close();
    await fixture.whenStable();
    expect(document.activeElement).toBe(trigger);
  });

  it('allows callers to suppress focus restoration before placing focus on a routed page', async () => {
    const { fixture, host, root } = await renderDrawer();
    const trigger = element(root, '[data-trigger]');
    trigger.focus();
    host.drawer().open();
    await fixture.whenStable();
    element(root, '[data-close]').focus();
    const restore = vi.spyOn(trigger, 'focus');

    host.drawer().close({ restoreFocus: false });
    await fixture.whenStable();
    expect(restore).not.toHaveBeenCalled();
    const destination = element(root, '[data-route-content]');
    destination.focus();
    await fixture.whenStable();
    expect(document.activeElement).toBe(destination);
  });

  it('does not attempt to restore focus to an opening control that has been removed', async () => {
    const { fixture, host, root } = await renderDrawer();
    const trigger = element(root, '[data-trigger]');
    trigger.focus();
    host.drawer().open();
    await fixture.whenStable();
    element(root, '[data-close]').focus();
    trigger.remove();
    const restore = vi.spyOn(trigger, 'focus');

    host.drawer().close();
    await fixture.whenStable();
    expect(restore).not.toHaveBeenCalled();
  });

  it('restores pre-existing inert values and unlocks scrolling when an open drawer is destroyed', async () => {
    const { fixture, host, root } = await renderDrawer();
    mockScrollableDocument();
    const background = document.createElement('section');
    const previouslyInert = document.createElement('aside');
    previouslyInert.setAttribute('inert', 'existing');
    document.body.append(background, previouslyInert);
    const html = document.documentElement;
    const previousLeft = html.style.left;
    const previousTop = html.style.top;
    html.style.left = '5px';
    html.style.top = '8px';
    try {
      host.drawer().open();
      await fixture.whenStable();
      expect(background.hasAttribute('inert')).toBe(true);
      expect(previouslyInert.hasAttribute('inert')).toBe(true);
      expect(html.classList.contains('cdk-global-scrollblock')).toBe(true);
      expect(html.style.left).toBe('-12px');
      expect(html.style.top).toBe('-80px');
      expect(element(root, 'dsy-drawer-content').hasAttribute('inert')).toBe(true);

      fixture.destroy();
      expect(background.hasAttribute('inert')).toBe(false);
      expect(previouslyInert.getAttribute('inert')).toBe('existing');
      expect(html.classList.contains('cdk-global-scrollblock')).toBe(false);
      expect(html.style.left).toBe('5px');
      expect(html.style.top).toBe('8px');
      expect(window.scroll).toHaveBeenCalledWith(12, 80);
    } finally {
      fixture.destroy();
      background.remove();
      previouslyInert.remove();
      html.style.left = previousLeft;
      html.style.top = previousTop;
    }
  });

  it('allows nested containers and keeps the outer modal locked when Escape closes the inner drawer', async () => {
    const fixture = TestBed.createComponent(DsyTestNestedDrawerHost);
    await fixture.whenStable();
    mockScrollableDocument();
    const root = fixture.nativeElement as HTMLElement;
    const host = fixture.componentInstance;

    element(root, '[data-outer-trigger]').focus();
    host.outer().open();
    await fixture.whenStable();
    element(root, '[data-inner-trigger]').focus();
    host.inner().open();
    await fixture.whenStable();
    expect(host.outerOpened()).toBe(true);
    expect(host.innerOpened()).toBe(true);
    expect(document.documentElement.classList.contains('cdk-global-scrollblock')).toBe(true);
    expect(element(root, '[data-inner-content]').hasAttribute('inert')).toBe(true);

    escape(element(root, '[data-outer-close]'));
    await fixture.whenStable();
    expect(host.outerOpened()).toBe(true);
    expect(host.innerOpened()).toBe(true);

    escape(element(root, '[data-inner-close]'));
    await fixture.whenStable();
    expect(host.innerOpened()).toBe(false);
    expect(host.outerOpened()).toBe(true);
    expect(document.documentElement.classList.contains('cdk-global-scrollblock')).toBe(true);
    expect(element(root, '[data-outer-content]').hasAttribute('inert')).toBe(true);
    expect(element(root, '[data-inner-content]').hasAttribute('inert')).toBe(false);

    host.outer().close();
    await fixture.whenStable();
    expect(document.documentElement.classList.contains('cdk-global-scrollblock')).toBe(false);
    expect(element(root, '[data-outer-content]').hasAttribute('inert')).toBe(false);
  });

  it('reports multiple direct drawers with a clear composition error', () => {
    @Component({
      standalone: true,
      imports: [DsyDrawerContainer, DsyDrawer],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `<dsy-drawer-container>
        <dsy-drawer />
        <dsy-drawer />
      </dsy-drawer-container>`,
    })
    class DsyTestInvalidDrawerHost {}
    const fixture = TestBed.createComponent(DsyTestInvalidDrawerHost);
    expect(() => {
      fixture.detectChanges();
      fixture.detectChanges();
    }).toThrowError(/one direct dsy-drawer/i);
  });
});
