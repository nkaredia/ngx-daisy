import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { provideDaisyUI } from '@ngx-daisy/cdk/config';
import { DsyButton } from './button/public-api';
import {
  DsyDropdown,
  DsyDropdownTrigger,
  DsyDropdownContent,
  DsyDropdownItem,
} from './dropdown/public-api';
import { DsyModal, DsyModalClose } from './modal/public-api';
import { DsySwap } from './swap/public-api';
import { DsyFab, DsyFabTrigger, DsyFabAction, DsyFabClose } from './fab/public-api';
import { DsyThemeController } from './theme-controller/public-api';

@Component({
  imports: [DsyButton],
  template: `<button dsyButton [loading]="loading()" shape="circle" layout="wide" active>
      Save</button
    ><a dsyButton href="#target" [disabled]="disabled()" tabindex="2" (click)="clicks = clicks + 1"
      >Link</a
    >`,
})
class ButtonsHost {
  readonly loading = signal(true);
  readonly disabled = signal(true);
  clicks = 0;
}
@Component({
  imports: [DsyDropdown, DsyDropdownTrigger, DsyDropdownContent, DsyDropdownItem],
  template: `<button id="outside">Outside</button
    ><dsy-dropdown #dropdown [disabled]="disabled()"
      ><button dsyDropdownTrigger>Options</button
      ><ng-template dsyDropdownContent
        ><button dsyDropdownItem (triggered)="selected = selected + 1">Edit</button
        ><button dsyDropdownItem disabled>Disabled</button
        ><button dsyDropdownItem>Export</button></ng-template
      ></dsy-dropdown
    >`,
})
class DropdownHost {
  readonly dropdown = viewChild.required(DsyDropdown);
  readonly disabled = signal(false);
  selected = 0;
}
@Component({
  imports: [DsyModal, DsyModalClose],
  template: `<button id="open" (click)="modal.open()">Open</button
    ><dsy-modal #modal [disableClose]="locked()" aria-label="Project" (closed)="result = $event"
      ><button id="nested-open" (click)="nested.open()">Nested</button
      ><button dsyModalClose="saved">Save</button
      ><dsy-modal #nested aria-label="Confirm"
        ><button dsyModalClose>Back</button></dsy-modal
      ></dsy-modal
    >`,
})
class ModalHost {
  readonly modal = viewChild.required(DsyModal);
  readonly nested = viewChild.required('nested', { read: DsyModal });
  readonly locked = signal(false);
  result: unknown;
}
@Component({
  imports: [DsySwap, ReactiveFormsModule],
  template: `<dsy-swap [formControl]="control" animation="flip" aria-label="Updates"
    ><span dsySwapOff>Off</span><span dsySwapOn>On</span
    ><span dsySwapIndeterminate>Mixed</span></dsy-swap
  >`,
})
class SwapHost {
  readonly control = new FormControl(false, { nonNullable: true });
  readonly swap = viewChild.required(DsySwap);
}
@Component({
  imports: [DsyFab, DsyFabTrigger, DsyFabAction, DsyFabClose],
  template: `<button id="outside">Outside</button
    ><dsy-fab #fab position="inline"
      ><button dsyFabTrigger>Actions</button><button dsyFabClose>Close</button
      ><button dsyFabAction (triggered)="selected = selected + 1">Create</button
      ><button dsyFabAction disabled>Unavailable</button></dsy-fab
    >`,
})
class FabHost {
  readonly fab = viewChild.required(DsyFab);
  selected = 0;
}
@Component({
  imports: [DsyThemeController, ReactiveFormsModule],
  template: `<input
    type="checkbox"
    dsyThemeController="custom-brand"
    [formControl]="control"
    (changed)="theme = $event.theme"
  />`,
})
class ThemeHost {
  readonly control = new FormControl(false, { nonNullable: true });
  theme = '';
}
function key(element: Element, key: string, keyCode = 0) {
  const event = new KeyboardEvent('keydown', { key, keyCode, bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

describe('Actions', () => {
  it('supports loading, shapes and safe native button defaults', async () => {
    const f = TestBed.createComponent(ButtonsHost);
    await f.whenStable();
    const b = f.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(b.type).toBe('button');
    expect(b.disabled).toBe(true);
    expect(b.getAttribute('aria-busy')).toBe('true');
    expect(b.querySelector('.dsy-button-spinner')).not.toBeNull();
    expect(b.classList.contains('btn-circle')).toBe(true);
    expect(b.classList.contains('btn-wide')).toBe(true);
    expect(b.classList.contains('btn-active')).toBe(true);
    f.componentInstance.loading.set(false);
    await f.whenStable();
    expect(b.disabled).toBe(false);
    expect(b.querySelector('.dsy-button-spinner')).toBeNull();
  });
  it('blocks disabled link activation and restores consumer tabindex', async () => {
    const f = TestBed.createComponent(ButtonsHost);
    await f.whenStable();
    const a = f.nativeElement.querySelector('a') as HTMLAnchorElement;
    const e = new MouseEvent('click', { bubbles: true, cancelable: true });
    a.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(f.componentInstance.clicks).toBe(0);
    expect(a.tabIndex).toBe(-1);
    expect(a.getAttribute('aria-disabled')).toBe('true');
    f.componentInstance.disabled.set(false);
    await f.whenStable();
    expect(a.tabIndex).toBe(2);
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(f.componentInstance.clicks).toBe(1);
  });
  it('opens a portalled menu, selects an item and restores focus', async () => {
    const f = TestBed.createComponent(DropdownHost);
    await f.whenStable();
    const trigger = f.nativeElement.querySelector('[dsyDropdownTrigger]') as HTMLButtonElement;
    trigger.focus();
    trigger.click();
    await f.whenStable();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    const menu = overlay.querySelector('[role=menu]')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(menu).not.toBeNull();
    expect(menu.querySelector('[disabled]')?.getAttribute('aria-disabled')).toBe('true');
    (menu.querySelector('button') as HTMLButtonElement).click();
    await f.whenStable();
    expect(f.componentInstance.selected).toBe(1);
    expect(f.componentInstance.dropdown().opened()).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(overlay.querySelector('[role=menu]')).toBeNull();
  });
  it('closes dropdown on Escape and prevents disabled opening', async () => {
    const f = TestBed.createComponent(DropdownHost);
    await f.whenStable();
    const trigger = f.nativeElement.querySelector('[dsyDropdownTrigger]');
    key(trigger, 'ArrowDown', 40);
    await f.whenStable();
    expect(f.componentInstance.dropdown().opened()).toBe(true);
    const menu = TestBed.inject(OverlayContainer)
      .getContainerElement()
      .querySelector('[role=menu]')!;
    key(menu, 'Escape', 27);
    await f.whenStable();
    expect(f.componentInstance.dropdown().opened()).toBe(false);
    f.componentInstance.disabled.set(true);
    await f.whenStable();
    trigger.click();
    await f.whenStable();
    expect(f.componentInstance.dropdown().opened()).toBe(false);
  });
  it('keeps nested dialogs modal and restores the right opener', async () => {
    const f = TestBed.createComponent(ModalHost);
    await f.whenStable();
    const root = f.nativeElement as HTMLElement;
    const open = root.querySelector<HTMLButtonElement>('#open')!;
    open.focus();
    open.click();
    await f.whenStable();
    const panels = root.querySelectorAll('.dsy-modal-panel');
    expect(panels[0].getAttribute('aria-modal')).toBe('true');
    expect(open.hasAttribute('inert')).toBe(true);
    const nestedOpen = root.querySelector<HTMLButtonElement>('#nested-open')!;
    nestedOpen.focus();
    nestedOpen.click();
    await f.whenStable();
    expect(f.componentInstance.nested().opened()).toBe(true);
    expect(nestedOpen.hasAttribute('inert')).toBe(true);
    key(panels[1], 'Escape', 27);
    await f.whenStable();
    expect(f.componentInstance.nested().opened()).toBe(false);
    expect(f.componentInstance.modal().opened()).toBe(true);
    expect(document.activeElement).toBe(nestedOpen);
    key(panels[0], 'Escape', 27);
    await f.whenStable();
    expect(f.componentInstance.modal().opened()).toBe(false);
    expect(document.activeElement).toBe(open);
    expect(open.hasAttribute('inert')).toBe(false);
  });
  it('requires explicit close when locked and returns a close result', async () => {
    const f = TestBed.createComponent(ModalHost);
    await f.whenStable();
    f.componentInstance.locked.set(true);
    f.componentInstance.modal().open();
    await f.whenStable();
    const panel = f.nativeElement.querySelector('.dsy-modal-panel');
    key(panel, 'Escape', 27);
    await f.whenStable();
    expect(f.componentInstance.modal().opened()).toBe(true);
    (panel.querySelector('[dsyModalClose]') as HTMLButtonElement).click();
    await f.whenStable();
    expect(f.componentInstance.result).toBe('saved');
    expect(f.componentInstance.modal().opened()).toBe(false);
    expect(panel.getAttribute('aria-hidden')).toBe('true');
  });
  it('integrates swap values, touched and disabled state with forms', async () => {
    const f = TestBed.createComponent(SwapHost);
    await f.whenStable();
    const b = f.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(b.getAttribute('aria-pressed')).toBe('false');
    b.click();
    await f.whenStable();
    expect(f.componentInstance.control.value).toBe(true);
    expect(b.getAttribute('aria-pressed')).toBe('true');
    b.dispatchEvent(new Event('blur'));
    expect(f.componentInstance.control.touched).toBe(true);
    f.componentInstance.control.disable();
    await f.whenStable();
    expect(b.disabled).toBe(true);
    b.click();
    expect(f.componentInstance.control.value).toBe(true);
  });
  it('clears an indeterminate swap on activation', async () => {
    const f = TestBed.createComponent(SwapHost);
    await f.whenStable();
    f.componentInstance.swap().indeterminate.set(true);
    await f.whenStable();
    const b = f.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(b.getAttribute('aria-pressed')).toBe('mixed');
    b.click();
    await f.whenStable();
    expect(f.componentInstance.swap().indeterminate()).toBe(false);
    expect(b.querySelector('.dsy-swap-off')?.hasAttribute('inert')).toBe(true);
  });
  it('opens a speed dial and closes after action or Escape', async () => {
    const f = TestBed.createComponent(FabHost);
    await f.whenStable();
    const root = f.nativeElement as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('[dsyFabTrigger]')!;
    expect(root.querySelector('.dsy-fab-actions')?.hasAttribute('inert')).toBe(true);
    trigger.click();
    await f.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('[dsyFabClose]')?.getAttribute('aria-hidden')).toBeNull();
    (root.querySelector('[dsyFabAction]') as HTMLButtonElement).click();
    await f.whenStable();
    expect(f.componentInstance.selected).toBe(1);
    expect(f.componentInstance.fab().opened()).toBe(false);
    trigger.click();
    await f.whenStable();
    key(root.querySelector('dsy-fab')!, 'Escape', 27);
    await f.whenStable();
    expect(f.componentInstance.fab().opened()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });
  it('skips disabled menu items and supports Home/End navigation', async () => {
    const f = TestBed.createComponent(DropdownHost);
    await f.whenStable();
    f.componentInstance.dropdown().open();
    await f.whenStable();
    const panel = TestBed.inject(OverlayContainer)
      .getContainerElement()
      .querySelector('[role=menu]')!;
    key(panel, 'End', 35);
    expect(document.activeElement?.textContent).toBe('Export');
    key(panel, 'ArrowUp', 38);
    expect(document.activeElement?.textContent).toBe('Edit');
    key(panel, 'ArrowUp', 38);
    expect(document.activeElement?.textContent).toBe('Export');
    key(panel, 'Home', 36);
    expect(document.activeElement?.textContent).toBe('Edit');
  });
  it('dismisses a dropdown on outside focus without restoring its opener', async () => {
    const f = TestBed.createComponent(DropdownHost);
    await f.whenStable();
    f.componentInstance.dropdown().open();
    await f.whenStable();
    const outside = f.nativeElement.querySelector('#outside') as HTMLButtonElement;
    outside.focus();
    await f.whenStable();
    expect(f.componentInstance.dropdown().opened()).toBe(false);
    expect(document.activeElement).toBe(outside);
  });
  it('uses native theme control values and Angular forms', async () => {
    const f = TestBed.createComponent(ThemeHost);
    await f.whenStable();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.classList.contains('theme-controller')).toBe(true);
    expect(input.getAttribute('value')).toBe('custom-brand');
    input.click();
    await f.whenStable();
    expect(f.componentInstance.control.value).toBe(true);
    expect(f.componentInstance.theme).toBe('custom-brand');
  });
  it('preserves the theme-controller Tailwind prefix exception', async () => {
    TestBed.configureTestingModule({
      providers: [provideDaisyUI({ prefix: 'd-', tailwindPrefix: 'tw' })],
    });
    const f = TestBed.createComponent(ThemeHost);
    await f.whenStable();
    expect(f.nativeElement.querySelector('input').className).toContain('d-theme-controller');
    expect(f.nativeElement.querySelector('input').className).not.toContain('tw:');
  });
});
