import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormField, disabled, form, hidden, readonly, required } from '@angular/forms/signals';
import { DsyInput } from './input/input';
import { DsyTextarea } from './textarea/textarea';
vi.mock('@nativescript/core', () => ({
  Color: class {
    constructor(readonly value: string) {}
    get ios() {
      return this.value;
    }
  },
}));
import { DsyToggle } from './toggle/toggle';

@Component({
  imports: [FormField, DsyInput, DsyTextarea, DsyToggle],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <TextField dsyInput [formField]="fields.name" label="Name" class="app-spacing"></TextField>
    <TextView dsyTextarea [formField]="fields.bio" label="Bio"></TextView>
    <Switch
      dsyToggle
      [formField]="fields.updates"
      [dsyColor]="toggleColor()"
      label="Updates"
    ></Switch>
  `,
})
class FormsHost {
  readonly values = signal({ name: 'Maya', bio: 'Hello team', updates: true });
  readonly toggleColor = signal<'primary' | 'secondary'>('primary');
  readonly locked = signal(false);
  readonly viewing = signal(false);
  readonly concealed = signal(false);
  readonly fields = form(this.values, (path) => {
    required(path.name);
    for (const field of [path.name, path.bio]) {
      disabled(field, () => this.locked());
      readonly(field, () => this.viewing());
      hidden(field, () => this.concealed());
    }
    disabled(path.updates, () => this.locked());
    readonly(path.updates, () => this.viewing());
    hidden(path.updates, () => this.concealed());
  });
}

function create() {
  const fixture = TestBed.createComponent(FormsHost);
  fixture.detectChanges();
  return {
    fixture,
    host: fixture.componentInstance,
    input: fixture.debugElement.query(By.directive(DsyInput)),
    textarea: fixture.debugElement.query(By.directive(DsyTextarea)),
    toggle: fixture.debugElement.query(By.directive(DsyToggle)),
  };
}

describe('Native Signal Forms data inputs', () => {
  it('synchronizes initial values, native edits and external model changes', () => {
    const { fixture, host, input, textarea, toggle } = create();
    expect(input.nativeElement.text).toBe('Maya');
    expect(textarea.nativeElement.text).toBe('Hello team');
    expect(toggle.nativeElement.checked).toBe(true);
    expect(toggle.nativeElement.classList.contains('dsy-native-toggle-checked')).toBe(true);
    expect(toggle.nativeElement.accessibilityLabel).toBe('Updates');
    input.triggerEventHandler('textChange', { value: 'Alex', object: input.nativeElement });
    textarea.triggerEventHandler('textChange', {
      value: 'A new bio',
      object: textarea.nativeElement,
    });
    toggle.triggerEventHandler('checkedChange', { value: false, object: toggle.nativeElement });
    fixture.detectChanges();
    expect(host.values()).toEqual({ name: 'Alex', bio: 'A new bio', updates: false });
    expect(toggle.nativeElement.classList.contains('dsy-native-toggle-checked')).toBe(false);
    host.values.set({ name: 'Sam', bio: 'Changed elsewhere', updates: true });
    fixture.detectChanges();
    expect(input.nativeElement.text).toBe('Sam');
    expect(textarea.nativeElement.text).toBe('Changed elsewhere');
    expect(toggle.nativeElement.checked).toBe(true);
  });

  it('does not treat native property echoes as user interaction', () => {
    const { fixture, host, toggle, input } = create();
    toggle.triggerEventHandler('checkedChange', { value: true, object: toggle.nativeElement });
    input.triggerEventHandler('textChange', { value: 'Maya', object: input.nativeElement });
    fixture.detectChanges();
    expect(host.fields.updates().touched()).toBe(false);
    expect(host.fields.name().dirty()).toBe(false);
  });

  it('marks text fields touched on blur and switches touched on a user change', () => {
    const { fixture, host, input, textarea, toggle } = create();
    input.triggerEventHandler('textChange', { value: '', object: input.nativeElement });
    fixture.detectChanges();
    expect(host.fields.name().invalid()).toBe(true);
    expect(input.nativeElement.classList.contains('dsy-native-field-invalid')).toBe(false);
    input.triggerEventHandler('blur', {});
    textarea.triggerEventHandler('blur', {});
    toggle.triggerEventHandler('checkedChange', { value: false, object: toggle.nativeElement });
    fixture.detectChanges();
    expect(host.fields.name().touched()).toBe(true);
    expect(host.fields.bio().touched()).toBe(true);
    expect(host.fields.updates().touched()).toBe(true);
    expect(input.nativeElement.classList.contains('dsy-native-field-invalid')).toBe(true);
    expect(input.nativeElement.classList.contains('app-spacing')).toBe(true);
  });

  for (const mode of ['locked', 'viewing', 'concealed'] as const) {
    it(`protects form state and restores stale native changes when ${mode}`, () => {
      const { fixture, host, input, textarea, toggle } = create();
      host[mode].set(true);
      fixture.detectChanges();
      if (mode === 'viewing') {
        expect(input.nativeElement.editable).toBe(false);
        expect(textarea.nativeElement.editable).toBe(false);
      } else {
        expect(input.nativeElement.isEnabled).toBe(false);
        expect(textarea.nativeElement.isEnabled).toBe(false);
      }
      expect(toggle.nativeElement.isEnabled).toBe(false);
      if (mode === 'concealed') expect(input.nativeElement.visibility).toBe('collapsed');
      input.triggerEventHandler('textChange', { value: 'stale', object: input.nativeElement });
      textarea.triggerEventHandler('textChange', {
        value: 'stale',
        object: textarea.nativeElement,
      });
      toggle.triggerEventHandler('checkedChange', { value: false, object: toggle.nativeElement });
      fixture.detectChanges();
      expect(host.values()).toEqual({ name: 'Maya', bio: 'Hello team', updates: true });
      expect(input.nativeElement.text).toBe('Maya');
      expect(textarea.nativeElement.text).toBe('Hello team');
      expect(toggle.nativeElement.checked).toBe(true);
      expect(host.fields.updates().touched()).toBe(false);
      host[mode].set(false);
      fixture.detectChanges();
      expect(input.nativeElement.isEnabled).toBe(true);
      expect(input.nativeElement.editable).toBe(true);
      expect(toggle.nativeElement.isEnabled).toBe(true);
    });
  }

  it('tints the iOS on track without repainting or clipping the native animation', () => {
    const { fixture, host, toggle } = create();
    const native = {
      onTintColor: 'system',
      backgroundColor: 'system',
      thumbTintColor: 'system',
      clipsToBounds: false,
      layer: { masksToBounds: false },
    };
    toggle.nativeElement.ios = native;
    toggle.triggerEventHandler('loaded', {});
    fixture.detectChanges();
    const tint = native.onTintColor;
    expect(tint).not.toBe('system');
    expect(toggle.nativeElement.classList.contains('dsy-native-toggle-android')).toBe(false);
    const tintSetter = vi.fn();
    Object.defineProperty(native, 'onTintColor', { get: () => tint, set: tintSetter });
    toggle.triggerEventHandler('checkedChange', { value: false, object: toggle.nativeElement });
    fixture.detectChanges();
    expect(host.values().updates).toBe(false);
    expect(tintSetter).not.toHaveBeenCalled();
    expect(native.backgroundColor).toBe('system');
    expect(native.thumbTintColor).toBe('system');
    expect(native.clipsToBounds).toBe(false);
    expect(native.layer.masksToBounds).toBe(false);
    host.toggleColor.set('secondary');
    fixture.detectChanges();
    expect(tintSetter).toHaveBeenCalledTimes(1);
    expect(tintSetter.mock.calls[0][0]).not.toBe(tint);
    toggle.triggerEventHandler('unloaded', {});
    fixture.detectChanges();
  });

  it('forwards focus requests to the native editor and skips disabled controls', () => {
    const { fixture, host, input } = create();
    const focus = vi.spyOn(input.nativeElement, 'focus');
    input.componentInstance.focus();
    expect(focus).toHaveBeenCalledTimes(1);
    host.locked.set(true);
    fixture.detectChanges();
    input.componentInstance.focus();
    expect(focus).toHaveBeenCalledTimes(1);
  });
});
