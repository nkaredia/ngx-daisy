import { DsyButton } from '@ngx-daisy/native/button';
import { FormField, form, disabled } from '@angular/forms/signals';
import { Component, NO_ERRORS_SCHEMA, viewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject, ReplaySubject } from 'rxjs';
import { DsyPopoverService } from '@ngx-daisy/native/popover';
vi.mock('@nativescript/core', () => ({
  GridLayout: class GridLayout {},
  CSSType: () => () => {},
  AbsoluteLayout: class AbsoluteLayout {},
  isIOS: false,
  isAndroid: false,
  getRootLayout: vi.fn(),
  Application: {},
}));

// Unit tests exercise renderer bindings and state; native presentation is checked on device.
vi.mock('@nativescript/angular', () => ({
  registerElement: vi.fn(),
  NativeDialog: class NativeDialog {},
  NativeDialogRef: class NativeDialogRef {},
  NATIVE_DIALOG_DATA: 'native-dialog-data',
  generateNativeScriptView: vi.fn(),
}));
import { NativeDialog, NativeDialogRef, NATIVE_DIALOG_DATA } from '@nativescript/angular';
import { DsyModal, DsyModalService, DsyNativeModalSurface } from './modal/modal';
import { DsyFab, DsyFabAction, DsyFabTrigger } from './fab/fab';
import { DsySwap } from './swap/swap';
import { DsyThemeController } from './theme-controller/theme-controller';
import { DsyIcon } from './icon/icon';
import {
  DsyDropdown,
  DsyDropdownContent,
  DsyDropdownTrigger,
  DsyDropdownItem,
} from './dropdown/dropdown';
import { DSY_DARK_THEME } from '@ngx-daisy/core/theme';

@Component({
  imports: [DsyButton, DsyFab, DsyFabAction, DsyFabTrigger],
  schemas: [NO_ERRORS_SCHEMA],
  template:
    '<StackLayout dsyFab [disabled]="locked()"><Button dsyButton dsyFabTrigger [disabled]="buttonDisabled()"></Button><Button dsyButton dsyFabAction></Button></StackLayout>',
})
class FabHost {
  readonly locked = signal(false);
  readonly buttonDisabled = signal(false);
}
@Component({
  imports: [DsyModal],
  template: '<ng-template dsyModal><span>Private content</span></ng-template>',
})
class ModalHost {
  readonly modal = viewChild.required(DsyModal);
}
@Component({
  imports: [DsyDropdown, DsyDropdownTrigger, DsyDropdownContent, DsyDropdownItem, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template:
    '<StackLayout dsyDropdown><Button dsyDropdownTrigger></Button><ng-template dsyDropdownContent><Button dsyButton dsyDropdownItem text="Duplicate"></Button></ng-template></StackLayout>',
})
class DropdownHost {}

@Component({
  imports: [DsySwap, DsyThemeController, FormField],
  schemas: [NO_ERRORS_SCHEMA],
  template:
    '<Button dsySwap [formField]="fields.sound"></Button><Switch [dsyThemeController]="theme" [formField]="fields.dark"></Switch>',
})
class FormsHost {
  readonly theme = DSY_DARK_THEME;
  readonly values = signal({ sound: true, dark: false });
  readonly locked = signal(false);
  readonly fields = form(this.values, (path) => {
    disabled(path.sound, () => this.locked());
    disabled(path.dark, () => this.locked());
  });
}

function nativeDialog() {
  const closed = new Subject<unknown>();
  const ref = { getState: () => 0, close: vi.fn(), afterClosed: () => closed.asObservable() };
  const open = vi.fn((_component: unknown, _config: unknown) => ref);
  TestBed.configureTestingModule({ providers: [{ provide: NativeDialog, useValue: { open } }] });
  return { closed, ref, open };
}

describe('Native Actions', () => {
  it('contains dialogs on narrow screens and protects implicit dismissal', () => {
    const config = { width: 500, disableClose: true };
    const close = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: NATIVE_DIALOG_DATA, useValue: { config } },
        { provide: NativeDialogRef, useValue: { getState: () => 0, close } },
      ],
    });
    const surface = TestBed.runInInjectionContext(() => new DsyNativeModalSurface());
    surface.onLayout({ object: { getActualSize: () => ({ width: 280, height: 360 }) } });
    expect(surface.width()).toBe(248);
    expect(surface.maxHeight()).toBe(264);
    surface.dismissOutside();
    expect(close).not.toHaveBeenCalled();
    surface.close('explicit');
    expect(close).toHaveBeenCalledExactlyOnceWith('explicit');
  });
  it('uses the shared native dialog service and returns results exactly once', () => {
    const dialog = nativeDialog();
    const fixture = TestBed.createComponent(ModalHost);
    fixture.detectChanges();
    const modal = fixture.componentInstance.modal();
    const closed = vi.fn();
    modal.closed.subscribe(closed);
    modal.open();
    fixture.detectChanges();
    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(modal.opened()).toBe(true);
    modal.close('saved');
    expect(dialog.ref.close).toHaveBeenCalledWith('saved');
    dialog.closed.next('saved');
    fixture.detectChanges();
    expect(modal.opened()).toBe(false);
    expect(closed).toHaveBeenCalledExactlyOnceWith('saved');
    fixture.detectChanges();
    expect(dialog.open).toHaveBeenCalledTimes(1);
  });
  it('closes an active presentation when its owner is destroyed', () => {
    const dialog = nativeDialog();
    const fixture = TestBed.createComponent(ModalHost);
    fixture.detectChanges();
    fixture.componentInstance.modal().open();
    fixture.detectChanges();
    fixture.destroy();
    expect(dialog.ref.close).toHaveBeenCalled();
    expect(() => dialog.closed.next('late')).not.toThrow();
  });
  it('passes dismissal safeguards and native options through the shared service', () => {
    const dialog = nativeDialog();
    const service = TestBed.inject(DsyModalService);
    service.open({} as never, {
      disableClose: true,
      theme: DSY_DARK_THEME,
      nativeOptions: { fullscreen: true },
    });
    expect(dialog.open.mock.calls[0]?.[1]).toMatchObject({
      disableClose: true,
      renderIn: 'root',
      nativeOptions: {
        animated: false,
        fullscreen: true,
        stretched: false,
        ios: { presentationStyle: 5 },
      },
      data: { config: { theme: DSY_DARK_THEME } },
    });
  });
  it('opens dropdown actions through an anchored menu and closes on request', () => {
    const closed = new ReplaySubject<void>(1);
    const ref = {
      closed,
      close: vi.fn(() => {
        closed.next();
        closed.complete();
      }),
    };
    const open = vi.fn((_anchor: unknown, _items: unknown) => ref);
    TestBed.configureTestingModule({
      providers: [{ provide: DsyPopoverService, useValue: { open } }],
    });
    const fixture = TestBed.createComponent(DropdownHost);
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.directive(DsyDropdown));
    const dropdown = element.injector.get(DsyDropdown);
    const trigger = fixture.debugElement.query(By.directive(DsyDropdownTrigger));
    trigger.triggerEventHandler('tap', {});
    fixture.detectChanges();
    expect(dropdown.opened()).toBe(true);
    expect(open).toHaveBeenCalledTimes(1);
    expect(open.mock.calls[0]?.[1]).toBeDefined();
    dropdown.close();
    fixture.detectChanges();
    expect(ref.close).toHaveBeenCalled();
    fixture.detectChanges();
    expect(dropdown.opened()).toBe(false);
  });
  it('keeps closed FAB actions hidden and guards synthetic activation', () => {
    const fixture = TestBed.createComponent(FabHost);
    fixture.detectChanges();
    const fab = fixture.debugElement.query(By.directive(DsyFab)).injector.get(DsyFab);
    const action = fixture.debugElement.query(By.directive(DsyFabAction));
    const instance = action.injector.get(DsyFabAction);
    const triggered = vi.fn();
    instance.triggered.subscribe(triggered);
    action.triggerEventHandler('tap', {});
    expect(triggered).not.toHaveBeenCalled();
    expect(action.nativeElement.getAttribute('visibility')).toBe('collapse');
    fab.open();
    fixture.detectChanges();
    expect(action.nativeElement.getAttribute('visibility')).toBe('visible');
    action.triggerEventHandler('tap', {});
    fixture.detectChanges();
    expect(triggered).toHaveBeenCalledTimes(1);
    expect(fab.opened()).toBe(false);
  });
  it('composes parent and Button disability without re-enabling a disabled dial', () => {
    const fixture = TestBed.createComponent(FabHost);
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.directive(DsyFabTrigger));
    const button = trigger.injector.get(DsyButton);
    const pressed = vi.fn();
    button.pressed.subscribe(pressed);
    fixture.componentInstance.locked.set(true);
    fixture.detectChanges();
    fixture.componentInstance.buttonDisabled.set(true);
    fixture.detectChanges();
    fixture.componentInstance.buttonDisabled.set(false);
    fixture.detectChanges();
    expect(button.isDisabled()).toBe(true);
    expect(trigger.nativeElement.isEnabled).toBe(false);
    trigger.triggerEventHandler('tap', {});
    expect(pressed).not.toHaveBeenCalled();
    fixture.componentInstance.locked.set(false);
    fixture.detectChanges();
    expect(button.isDisabled()).toBe(false);
  });
  it('swaps labels and clears mixed state without activating when disabled', () => {
    const fixture = TestBed.createComponent(DsySwap);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.text).toBe('Mixed');
    fixture.debugElement.triggerEventHandler('tap', {});
    fixture.detectChanges();
    expect(fixture.componentInstance.indeterminate()).toBe(false);
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(fixture.nativeElement.text).toBe('On');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    fixture.debugElement.triggerEventHandler('tap', {});
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(fixture.nativeElement.isEnabled).toBe(false);
  });
  it('emits theme intent once for a user change and ignores property echoes', () => {
    const fixture = TestBed.createComponent(DsyThemeController);
    fixture.componentRef.setInput('dsyThemeController', DSY_DARK_THEME);
    fixture.detectChanges();
    const changed = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    fixture.debugElement.triggerEventHandler('checkedChange', { value: true });
    fixture.detectChanges();
    fixture.debugElement.triggerEventHandler('checkedChange', { value: true });
    expect(changed).toHaveBeenCalledExactlyOnceWith({ theme: DSY_DARK_THEME, checked: true });
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    fixture.debugElement.triggerEventHandler('checkedChange', { value: false });
    expect(fixture.componentInstance.checked()).toBe(true);
  });
  it('integrates Swap and Theme Controller with Signal Forms values and schema disablement', () => {
    const fixture = TestBed.createComponent(FormsHost);
    fixture.detectChanges();
    const swap = fixture.debugElement.query(By.directive(DsySwap));
    const controller = fixture.debugElement.query(By.directive(DsyThemeController));
    expect(swap.nativeElement.text).toBe('On');
    swap.triggerEventHandler('tap', {});
    controller.triggerEventHandler('checkedChange', { value: true });
    fixture.detectChanges();
    expect(fixture.componentInstance.values()).toEqual({ sound: false, dark: true });
    expect(fixture.componentInstance.fields.sound().touched()).toBe(true);
    fixture.componentInstance.locked.set(true);
    fixture.detectChanges();
    expect(swap.nativeElement.isEnabled).toBe(false);
    expect(controller.nativeElement.isEnabled).toBe(false);
    fixture.componentInstance.values.set({ sound: true, dark: false });
    fixture.detectChanges();
    expect(swap.nativeElement.text).toBe('On');
    expect(controller.nativeElement.checked).toBe(false);
  });
  it('cancels a modal open request before presentation', () => {
    const dialog = nativeDialog();
    const fixture = TestBed.createComponent(ModalHost);
    fixture.detectChanges();
    const modal = fixture.componentInstance.modal();
    modal.open();
    modal.close();
    fixture.detectChanges();
    expect(modal.opened()).toBe(false);
    expect(dialog.open).not.toHaveBeenCalled();
  });
  it('keeps unlabeled icons decorative and constrains invalid sizes', () => {
    const fixture = TestBed.createComponent(DsyIcon);
    fixture.detectChanges();
    expect(fixture.nativeElement.accessibilityHidden).toBe(true);
    fixture.componentRef.setInput('label', 'Saved');
    fixture.componentRef.setInput('size', -3);
    fixture.detectChanges();
    expect(fixture.nativeElement.accessibilityHidden).toBe(false);
    expect(fixture.nativeElement.accessibilityLabel).toBe('Saved');
    expect(fixture.nativeElement.width).toBe(24);
  });
});
