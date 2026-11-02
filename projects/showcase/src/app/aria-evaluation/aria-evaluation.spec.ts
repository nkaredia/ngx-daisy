import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import type { Type } from '@angular/core';
import { Injector, TemplateRef, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { By } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { Tab, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { AccordionGroup, AccordionPanel, AccordionTrigger } from '@angular/aria/accordion';
import { MENU_COMPONENT, Menu, MenuItem, MenuTrigger } from '@angular/aria/menu';

// Evaluation only: these fixtures are never routed, exported or loaded by the showcase app.
@Component({
  imports: [Tabs, TabList, Tab, TabPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div ngTabs>
      <div
        ngTabList
        [(selectedTab)]="selected"
        [selectionMode]="mode()"
        [softDisabled]="false"
        aria-label="Settings"
        class="tabs tabs-lift"
      >
        <button ngTab value="profile" class="tab">Profile</button>
        <button ngTab value="locked" [disabled]="true" class="tab">Locked</button>
        <button ngTab value="billing" class="tab">Billing</button>
      </div>
      <div ngTabPanel value="profile" class="tab-content"><input value="Keep this draft" /></div>
      <div ngTabPanel value="billing" class="tab-content">Billing details</div>
    </div>
  `,
})
class TabsProbe {
  readonly selected = signal<string | undefined>('profile');
  readonly mode = signal<'follow' | 'explicit'>('follow');
}

@Component({
  selector: 'evaluation-projected-tabs',
  imports: [TabList],
  hostDirectives: [Tabs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div ngTabList><ng-content select="[ngTab]" /></div>
    <ng-content />`,
})
class ProjectedTabsProbe {}
@Component({
  imports: [ProjectedTabsProbe, Tab, TabPanel],
  template: `<evaluation-projected-tabs
    ><button ngTab value="one">One</button>
    <div ngTabPanel value="one">Panel</div></evaluation-projected-tabs
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
class ProjectionHost {}

@Component({
  selector: 'evaluation-collapse',
  imports: [AccordionTrigger, AccordionPanel],
  template: `<h3>
      <button ngAccordionTrigger [panel]="panel" [(expanded)]="opened">Details</button>
    </h3>
    <div ngAccordionPanel #panel="ngAccordionPanel"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
class CollapseProbe {
  readonly opened = signal(false);
}
@Component({
  selector: 'evaluation-accordion',
  hostDirectives: [{ directive: AccordionGroup, inputs: ['multiExpandable: multi'] }],
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
class AccordionProbe {}
@Component({
  imports: [AccordionProbe, CollapseProbe],
  template: `<evaluation-accordion [multi]="multi()"
    ><evaluation-collapse><input value="Draft" /></evaluation-collapse
    ><evaluation-collapse>Second panel</evaluation-collapse></evaluation-accordion
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
class AccordionHost {
  readonly multi = signal(false);
}

@Component({
  imports: [Menu, MenuItem, MenuTrigger],
  template: `<button ngMenuTrigger [menu]="menu">Actions</button>
    <div ngMenu #menu="ngMenu" [softDisabled]="false" (itemSelected)="selection.set($event)">
      <button ngMenuItem value="edit">Edit</button
      ><button ngMenuItem value="archive" [disabled]="true">Archive</button>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
class MenuProbe {
  readonly selection = signal<string | undefined>('');
}

@Component({
  selector: 'evaluation-menu-template',
  imports: [Menu, NgTemplateOutlet],
  template: `<div ngMenu #menu="ngMenu">
    <ng-container
      [ngTemplateOutlet]="template()"
      [ngTemplateOutletInjector]="outletInjector(menu)"
    />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
class MenuTemplateProbe {
  readonly template = input.required<TemplateRef<unknown>>();
  readonly bridge = input(false);
  private readonly parentInjector = inject(Injector);
  private readonly injectors = new Map<Menu<unknown>, Injector>();
  outletInjector(menu: Menu<unknown>): Injector | undefined {
    if (!this.bridge()) return undefined;
    if (!this.injectors.has(menu))
      this.injectors.set(
        menu,
        Injector.create({
          parent: this.parentInjector,
          providers: [{ provide: MENU_COMPONENT, useValue: menu }],
        }),
      );
    return this.injectors.get(menu);
  }
}
@Component({
  imports: [MenuTemplateProbe, MenuItem],
  template: `<ng-template #items><button ngMenuItem value="edit">Edit</button></ng-template
    ><evaluation-menu-template [template]="items" [bridge]="bridge()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
class MenuTemplateHost {
  readonly bridge = signal(false);
}

async function create<T>(type: Type<T>) {
  const fixture = TestBed.createComponent(type);
  await fixture.whenStable();
  return { fixture, root: fixture.nativeElement as HTMLElement, state: fixture.componentInstance };
}

describe('Angular Aria adoption evaluation (not production adapters)', () => {
  it('links tab controls and panels without replacing daisyUI classes', async () => {
    const { root } = await create(TabsProbe);
    const tab = root.querySelector<HTMLButtonElement>('[ngTab]')!;
    const panel = root.querySelector<HTMLElement>('[ngTabPanel]')!;
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    expect(tab.classList.contains('tab')).toBe(true);
    expect(root.querySelector('[ngTabList]')!.classList.contains('tabs-lift')).toBe(true);
    expect(root.querySelectorAll('[ngTabPanel]')[1].hasAttribute('inert')).toBe(true);
    expect(root.querySelectorAll('[ngTabPanel]')[1].hasAttribute('hidden')).toBe(false);
  });

  it('maps follow selection to our automatic mode and skips hard-disabled tabs', async () => {
    const { fixture, root, state } = await create(TabsProbe);
    const tabs = root.querySelectorAll<HTMLButtonElement>('[ngTab]');
    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(state.selected()).toBe('billing');
    expect(document.activeElement).toBe(tabs[2]);
  });

  it('maps explicit selection to our manual mode', async () => {
    const { fixture, root, state } = await create(TabsProbe);
    state.mode.set('explicit');
    await fixture.whenStable();
    const tabs = root.querySelectorAll<HTMLButtonElement>('[ngTab]');
    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(state.selected()).toBe('profile');
    tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(state.selected()).toBe('billing');
  });

  it('retains eager projected tab content when changing the value model', async () => {
    const { fixture, root, state } = await create(TabsProbe);
    const input = root.querySelector('input')!;
    input.value = 'Edited draft';
    state.selected.set('billing');
    await fixture.whenStable();
    state.selected.set('profile');
    await fixture.whenStable();
    expect(root.querySelector('input')).toBe(input);
    expect(input.value).toBe('Edited draft');
  });

  it('exposes the internal-list projection injection boundary in our current tabs structure', () => {
    expect(() => TestBed.createComponent(ProjectionHost)).toThrow(/TAB_LIST|TabList|tab list/i);
  });

  it('supports nested collapse components under a host-directive accordion group', async () => {
    const { fixture, root } = await create(AccordionHost);
    const buttons = root.querySelectorAll<HTMLButtonElement>('button');
    buttons[0].click();
    await fixture.whenStable();
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    buttons[1].click();
    await fixture.whenStable();
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('input')!.value).toBe('Draft');
    expect(root.querySelector('[ngAccordionPanel]')!.hasAttribute('inert')).toBe(true);
  });

  it('supports the public multi-expansion mapping', async () => {
    const { fixture, root, state } = await create(AccordionHost);
    state.multi.set(true);
    await fixture.whenStable();
    const buttons = root.querySelectorAll<HTMLButtonElement>('button');
    buttons[0].click();
    buttons[1].click();
    await fixture.whenStable();
    expect([...buttons].map((button) => button.getAttribute('aria-expanded'))).toEqual([
      'true',
      'true',
    ]);
  });

  it('emits enabled menu actions and rejects disabled actions', async () => {
    const { fixture, root, state } = await create(MenuProbe);
    root.querySelector<HTMLButtonElement>('[ngMenuTrigger]')!.click();
    await fixture.whenStable();
    const items = root.querySelectorAll<HTMLButtonElement>('[ngMenuItem]');
    items[1].click();
    await fixture.whenStable();
    expect(state.selection()).toBe('');
    items[0].click();
    await fixture.whenStable();
    expect(state.selection()).toBe('edit');
    expect(root.querySelector('[ngMenuTrigger]')!.getAttribute('aria-expanded')).toBe('false');
  });
  it('requires an accordion group even for a standalone collapse', () => {
    expect(() => TestBed.createComponent(CollapseProbe)).toThrow(/ACCORDION_GROUP|AccordionGroup/i);
  });

  it('does not infer a menu parent from a template outlet DOM position', async () => {
    const { fixture } = await create(MenuTemplateHost);
    expect(
      fixture.debugElement.query(By.directive(MenuItem)).injector.get(MenuItem).parent,
    ).toBeNull();
  });

  it('can bridge the menu template boundary using the public injection token', async () => {
    const { fixture, state } = await create(MenuTemplateHost);
    state.bridge.set(true);
    await fixture.whenStable();
    const item = fixture.debugElement.query(By.directive(MenuItem)).injector.get(MenuItem);
    expect(item.parent).not.toBeNull();
    expect(item.element.getAttribute('role')).toBe('menuitem');
  });
  it('does not provide our current tab typeahead behavior by default', async () => {
    const { fixture, root, state } = await create(TabsProbe);
    const tab = root.querySelector<HTMLButtonElement>('[ngTab]')!;
    tab.focus();
    tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
    await fixture.whenStable();
    expect(state.selected()).toBe('profile');
    expect(document.activeElement).toBe(tab);
  });
});
