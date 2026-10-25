import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Directionality } from '@angular/cdk/bidi';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { DsyTabs, DsyTab, DsyTabPanel } from '@ngx-daisy/cdk/tabs';
import { DsyPagination } from '@ngx-daisy/cdk/pagination';
import {
  DsyMenu,
  DsyMenuItem,
  DsyMenuSubmenu,
  DsyMenuDropdown,
  DsyMenuDropdownToggle,
} from '@ngx-daisy/cdk/menu';
import { DsyLink } from '@ngx-daisy/cdk/link';
import { DsyDock, DsyDockItem } from '@ngx-daisy/cdk/dock';
import { DsyMegamenu, DsyMegamenuItem } from '@ngx-daisy/cdk/megamenu';
import { DsyTooltip } from '@ngx-daisy/cdk/tooltip';
import { DsyToastService, DsyToastOutlet } from '@ngx-daisy/cdk/toast';
import { DsyProgress } from '@ngx-daisy/cdk/progress';
import { DsyRadialProgress } from '@ngx-daisy/cdk/radial-progress';
import { DsyDivider } from '@ngx-daisy/cdk/divider';
import { DsyJoin, DsyJoinItem } from '@ngx-daisy/cdk/join';
import { DsyIndicator, DsyIndicatorItem } from '@ngx-daisy/cdk/indicator';
import { provideDaisyUI } from '@ngx-daisy/cdk/config';

@Component({
  imports: [DsyTabs, DsyTab, DsyTabPanel],
  template: `<dsy-tabs label="Project" [(selectedIndex)]="selected" [activation]="activation()"
    ><button dsyTab>Overview</button><button dsyTab disabled>Unavailable</button
    ><button dsyTab>Settings</button>
    <section [dsyTabPanel]="0"><a href="#detail">Details</a></section>
    <section [dsyTabPanel]="1">Unavailable</section>
    <section [dsyTabPanel]="2"><input aria-label="Project name" /></section
  ></dsy-tabs>`,
})
class TabsHost {
  readonly selected = signal(0);
  readonly activation = signal<'automatic' | 'manual'>('automatic');
}
@Component({
  imports: [DsyPagination],
  template: `<dsy-pagination
    [length]="length()"
    [pageSize]="size()"
    [(pageIndex)]="index"
    [disabled]="disabled()"
    (pageChange)="events.push($event)"
  />`,
})
class PaginationHost {
  readonly length = signal(1000);
  readonly size = signal(10);
  readonly index = signal(0);
  readonly disabled = signal(false);
  readonly events: unknown[] = [];
}
@Component({
  imports: [DsyMenu, DsyMenuItem, DsyMenuSubmenu, DsyLink, DsyDock, DsyDockItem],
  template: `<ul dsyMenu>
      <li>
        <a dsyMenuItem href="#menu" disabled (click)="clicks.update(increment)"
          >Disabled menu item</a
        >
      </li>
      <li>
        <details dsyMenuSubmenu [(opened)]="expanded">
          <summary>More</summary>
          <ul>
            <li><a href="#details">Details</a></li>
          </ul>
        </details>
      </li>
    </ul>
    <a dsyLink disabled href="#link" (click)="clicks.update(increment)">Disabled link</a
    ><dsy-dock
      ><button dsyDockItem disabled (click)="clicks.update(increment)">Disabled dock item</button
      ><a dsyDockItem active href="#active">Active dock item</a></dsy-dock
    >`,
})
class NavigationHost {
  readonly clicks = signal(0);
  readonly expanded = signal(false);
  readonly increment = (v: number) => v + 1;
}
@Component({
  imports: [DsyMegamenu, DsyMegamenuItem],
  template: `<dsy-megamenu label="Main navigation" [(activeIndex)]="active"
      ><ng-template dsyMegamenuItem="Products"
        ><a href="#product">Product link</a
        ><button type="button">Product action</button></ng-template
      ><ng-template dsyMegamenuItem="Resources"><a href="#resource">Resource link</a></ng-template
      ><ng-template dsyMegamenuItem="Disabled" disabled>Unavailable</ng-template></dsy-megamenu
    ><button id="outside">Outside</button>`,
})
class MegamenuHost {
  readonly active = signal<number | null>(null);
}
@Component({
  imports: [DsyTooltip],
  template: `<button
    dsyTooltip
    [dsyTooltip]="text()"
    [tooltipDisabled]="disabled()"
    [disabled]="buttonDisabled()"
    [(opened)]="opened"
  >
    Help
  </button>`,
})
class TooltipHost {
  readonly text = signal('Helpful hint');
  readonly disabled = signal(false);
  readonly buttonDisabled = signal(false);
  readonly opened = signal(false);
}
@Component({
  imports: [
    DsyProgress,
    DsyRadialProgress,
    DsyDivider,
    DsyJoin,
    DsyJoinItem,
    DsyIndicator,
    DsyIndicatorItem,
  ],
  template: `<progress
      dsyProgress
      [value]="value()"
      [max]="max()"
      color="primary"
      label="Upload"
    ></progress
    ><dsy-radial-progress [value]="value() ?? 0" label="Completion" /><dsy-divider
      orientation="vertical"
      color="primary"
    /><dsy-join><button dsyJoinItem>One</button><button dsyJoinItem>Two</button></dsy-join
    ><dsy-indicator
      ><span dsyIndicatorItem horizontal="start" vertical="bottom">New</span
      ><span>Inbox</span></dsy-indicator
    >`,
})
class PresentationHost {
  readonly value = signal<number | null>(45);
  readonly max = signal(100);
}
@Component({ imports: [DsyToastOutlet], template: `<dsy-toast-outlet />` })
class ToastHost {}
async function render<T>(component: Type<T>) {
  const fixture = TestBed.createComponent(component);
  await fixture.whenStable();
  return { fixture, host: fixture.componentInstance, root: fixture.nativeElement as HTMLElement };
}
function key(element: HTMLElement, name: string, code: number) {
  element.dispatchEvent(new KeyboardEvent('keydown', { key: name, keyCode: code, bubbles: true }));
}

describe('Tabs', () => {
  it('connects labelled panels, skips disabled tabs and automatically activates keyboard selection', async () => {
    const { fixture, host, root } = await render(TabsHost);
    const tabs = root.querySelectorAll<HTMLButtonElement>('[dsyTab]'),
      panels = root.querySelectorAll<HTMLElement>('.dsy-tab-panel');
    expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
    tabs[0].focus();
    key(tabs[0], 'ArrowRight', 39);
    await fixture.whenStable();
    expect(host.selected()).toBe(2);
    expect(document.activeElement).toBe(tabs[2]);
    expect(panels[0].hidden).toBe(true);
    expect(panels[0].hasAttribute('inert')).toBe(true);
    expect(panels[2].hidden).toBe(false);
    expect(tabs[2].tabIndex).toBe(0);
    key(tabs[2], 'Home', 36);
    await fixture.whenStable();
    expect(host.selected()).toBe(0);
  });
  it('supports manual activation without exposing inactive panels', async () => {
    const { fixture, host, root } = await render(TabsHost);
    host.activation.set('manual');
    await fixture.whenStable();
    const tabs = root.querySelectorAll<HTMLButtonElement>('[dsyTab]');
    tabs[0].focus();
    key(tabs[0], 'ArrowRight', 39);
    await fixture.whenStable();
    expect(document.activeElement).toBe(tabs[2]);
    expect(host.selected()).toBe(0);
    key(tabs[2], 'Enter', 13);
    await fixture.whenStable();
    expect(host.selected()).toBe(2);
  });
  it('restores focus before an externally selected panel becomes inert', async () => {
    const { fixture, host, root } = await render(TabsHost);
    root.querySelector('a')!.focus();
    host.selected.set(2);
    await fixture.whenStable();
    expect(document.activeElement).toBe(root.querySelectorAll('[dsyTab]')[2]);
  });
  it('supports RTL arrow navigation', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: Directionality, useValue: { value: 'rtl', change: new Subject() } }],
    });
    const { fixture, host, root } = await render(TabsHost);
    const tabs = root.querySelectorAll<HTMLButtonElement>('[dsyTab]');
    tabs[0].focus();
    key(tabs[0], 'ArrowLeft', 37);
    await fixture.whenStable();
    expect(host.selected()).toBe(2);
  });
});
describe('Pagination', () => {
  it('windows large result sets and emits zero-based page events', async () => {
    const { fixture, host, root } = await render(PaginationHost);
    expect(root.querySelectorAll('button').length).toBeLessThanOrEqual(9);
    root.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!.click();
    await fixture.whenStable();
    expect(host.index()).toBe(1);
    expect(host.events).toEqual([
      { pageIndex: 1, previousPageIndex: 0, pageSize: 10, length: 1000 },
    ]);
    expect(root.querySelector('[aria-current=page]')!.textContent!.trim()).toBe('2');
    host.length.set(0);
    await fixture.whenStable();
    expect(root.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!.disabled).toBe(true);
    expect(root.querySelector('[aria-current=page]')!.textContent!.trim()).toBe('1');
  });
  it('clamps invalid inputs and blocks interaction when disabled', async () => {
    const { fixture, host, root } = await render(PaginationHost);
    host.size.set(0);
    host.index.set(99999);
    host.length.set(3);
    await fixture.whenStable();
    expect(root.querySelector('[aria-current=page]')!.textContent!.trim()).toBe('3');
    host.disabled.set(true);
    await fixture.whenStable();
    expect([...root.querySelectorAll('button')].every((button) => button.disabled)).toBe(true);
  });
});
describe('Native navigation', () => {
  it('blocks disabled links before application handlers and exposes current navigation', async () => {
    const { root, host, fixture } = await render(NavigationHost);
    for (const target of root.querySelectorAll<HTMLElement>('[aria-disabled=true]')) target.click();
    await fixture.whenStable();
    expect(host.clicks()).toBe(0);
    expect(root.querySelector<HTMLButtonElement>('button[dsyDockItem]')!.disabled).toBe(true);
    expect(root.querySelector('a[dsyDockItem]')!.getAttribute('aria-current')).toBe('page');
  });
  it('synchronizes native details state with the submenu model', async () => {
    const { root, host, fixture } = await render(NavigationHost);
    host.expanded.set(true);
    await fixture.whenStable();
    const details = root.querySelector('details')!;
    expect(details.open).toBe(true);
    details.open = false;
    details.dispatchEvent(new Event('toggle'));
    await fixture.whenStable();
    expect(host.expanded()).toBe(false);
  });
});
describe('Megamenu', () => {
  it('opens a single labelled panel and restores trigger focus with Escape', async () => {
    const { root, fixture, host } = await render(MegamenuHost);
    const buttons = root.querySelectorAll('nav button');
    (buttons[0] as HTMLButtonElement).click();
    await fixture.whenStable();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    expect(host.active()).toBe(0);
    expect(overlay.textContent).toContain('Product link');
    expect(overlay.querySelector('[role=region]')!.contains(document.activeElement)).toBe(true);
    expect(overlay.querySelector('[role=region]')!.getAttribute('aria-labelledby')).toBe(
      buttons[0].id,
    );
    key(document.activeElement as HTMLElement, 'Escape', 27);
    await fixture.whenStable();
    expect(host.active()).toBeNull();
    expect(document.activeElement).toBe(buttons[0]);
    expect(overlay.querySelector('[role=region]')).toBeNull();
  });
  it('closes when focus leaves without stealing focus back', async () => {
    const { root, fixture, host } = await render(MegamenuHost);
    (root.querySelector('nav button') as HTMLButtonElement).click();
    await fixture.whenStable();
    const outside = root.querySelector<HTMLButtonElement>('#outside')!;
    outside.focus();
    await fixture.whenStable();
    expect(host.active()).toBeNull();
    expect(document.activeElement).toBe(outside);
  });
});
describe('Tooltip', () => {
  it('describes the trigger through CDK and keeps native disabled independent', async () => {
    const { root, fixture, host } = await render(TooltipHost);
    const button = root.querySelector('button')!;
    const description = button.getAttribute('aria-describedby')!;
    expect(description).toBeTruthy();
    expect(document.getElementById(description)!.textContent).toBe('Helpful hint');
    host.disabled.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    host.buttonDisabled.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(true);
  });
  it('opens on focus, updates text and dismisses with Escape', async () => {
    const { root, fixture, host } = await render(TooltipHost);
    const button = root.querySelector('button')!;
    button.focus();
    await fixture.whenStable();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    expect(host.opened()).toBe(true);
    expect(overlay.textContent).toContain('Helpful hint');
    expect(document.activeElement).toBe(button);
    host.text.set('Updated hint');
    await fixture.whenStable();
    expect(overlay.textContent).toContain('Updated hint');
    key(button, 'Escape', 27);
    await fixture.whenStable();
    expect(host.opened()).toBe(false);
    expect(overlay.querySelector('[role=tooltip]')).toBeNull();
  });
});
describe('Toast notifications', () => {
  const announce = vi.fn().mockResolvedValue(undefined);
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: LiveAnnouncer, useValue: { announce } }],
    }),
  );
  afterEach(() => {
    vi.useRealTimers();
    announce.mockClear();
  });
  it('keeps messages until dismissed by default and announces once', () => {
    const service = TestBed.inject(DsyToastService);
    const id = service.show('Saved', { color: 'success' });
    expect(service.messages()).toHaveLength(1);
    expect(announce).toHaveBeenCalledWith('Saved', 'polite');
    service.dismiss(id);
    expect(service.messages()).toHaveLength(0);
  });
  it('pauses a timed message for overlapping hover and focus reasons', () => {
    vi.useFakeTimers();
    const service = TestBed.inject(DsyToastService);
    const id = service.show('Synced', { duration: 1000 });
    vi.advanceTimersByTime(400);
    service.pause(id, 'hover');
    service.pause(id, 'focus');
    vi.advanceTimersByTime(2000);
    service.resume(id, 'hover');
    vi.advanceTimersByTime(2000);
    expect(service.messages()).toHaveLength(1);
    service.resume(id, 'focus');
    vi.advanceTimersByTime(599);
    expect(service.messages()).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(service.messages()).toHaveLength(0);
  });
  it('renders dismiss controls without taking focus', async () => {
    const { root, fixture } = await render(ToastHost);
    const active = document.activeElement;
    const service = TestBed.inject(DsyToastService);
    service.show('Ready', { announcement: 'off' });
    await fixture.whenStable();
    expect(document.activeElement).toBe(active);
    const button = root.querySelector<HTMLButtonElement>('button')!;
    expect(button.getAttribute('aria-label')).toBe('Dismiss Ready');
    button.click();
    await fixture.whenStable();
    expect(service.messages()).toHaveLength(0);
  });
});
describe('Feedback values and customization', () => {
  it('clamps determinate progress and omits the native value for indeterminate work', async () => {
    const { root, fixture, host } = await render(PresentationHost);
    const progress = root.querySelector('progress')!,
      radial = root.querySelector('[role=progressbar]')!;
    host.value.set(500);
    await fixture.whenStable();
    expect(progress.value).toBe(100);
    expect(radial.getAttribute('aria-valuenow')).toBe('100');
    host.value.set(null);
    await fixture.whenStable();
    expect(progress.hasAttribute('value')).toBe(false);
    host.max.set(-5);
    host.value.set(-10);
    await fixture.whenStable();
    expect(progress.max).toBe(100);
    expect(progress.value).toBe(0);
  });
  it('composes native styling slots with daisyUI and Tailwind prefixes', async () => {
    TestBed.configureTestingModule({
      providers: [provideDaisyUI({ prefix: 'd-', tailwindPrefix: 'tw' })],
    });
    const { root } = await render(PresentationHost);
    expect(root.querySelector('progress')!.classList.contains('tw:d-progress-primary')).toBe(true);
    expect(root.querySelector('dsy-divider')!.classList.contains('d-divider-horizontal')).toBe(
      true,
    );
    expect(root.querySelector('[dsyJoinItem]')!.classList.contains('tw:d-join-item')).toBe(true);
    expect(
      root.querySelector('[dsyIndicatorItem]')!.classList.contains('tw:d-indicator-start'),
    ).toBe(true);
  });
});

@Component({
  imports: [DsyMenu, DsyMenuDropdown, DsyMenuDropdownToggle],
  template: `<ul dsyMenu>
    <li>
      <button dsyMenuDropdownToggle [opened]="opened()" (click)="opened.set(!opened())">
        Projects
      </button>
      <ul dsyMenuDropdown [opened]="opened()">
        <li><a href="#project">Project</a></li>
      </ul>
    </li>
    <li>
      <button dsyMenuDropdownToggle data-manual-toggle>Manual</button>
      <ul dsyMenuDropdown class="d-menu-dropdown-show" data-manual-panel>
        <li>Manual content</li>
      </ul>
    </li>
  </ul>`,
})
class MenuDisclosureHost {
  readonly opened = signal(false);
}

describe('Menu CSS disclosures', () => {
  it('reflects open state in native prefixed classes and excludes closed contents from focus', async () => {
    TestBed.configureTestingModule({ providers: [provideDaisyUI({ prefix: 'd-' })] });
    const fixture = TestBed.createComponent(MenuDisclosureHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const button = root.querySelector('button')!;
    const panel = root.querySelector<HTMLElement>('[dsyMenuDropdown]')!;
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(root.querySelector('[data-manual-toggle]')?.hasAttribute('aria-expanded')).toBe(false);
    expect(root.querySelector('[data-manual-panel]')?.hasAttribute('inert')).toBe(false);
    expect(
      root.querySelector('[data-manual-panel]')?.classList.contains('d-menu-dropdown-show'),
    ).toBe(true);
    expect(panel.classList.contains('d-menu-dropdown-show')).toBe(false);
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(panel.classList.contains('d-menu-dropdown-show')).toBe(true);
    expect(button.classList.contains('d-menu-dropdown-show')).toBe(true);
    expect(panel.hasAttribute('inert')).toBe(false);
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hasAttribute('inert')).toBe(true);
  });
});
