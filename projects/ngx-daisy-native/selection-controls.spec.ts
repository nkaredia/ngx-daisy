import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FormField,
  disabled,
  form,
  hidden,
  max,
  min,
  readonly,
  required,
} from '@angular/forms/signals';
import { DsyCheckbox } from './checkbox/checkbox';
import { DsyRadio, DsyRadioGroup } from './radio/radio';
import { DsyRange } from './range/range';
import { Check, Minus } from 'lucide';
vi.mock('@nativescript/core', () => ({
  Color: class {},
  ImageSource: class {},
  Utils: {},
  isIOS: false,
}));

@Component({
  imports: [FormField, DsyCheckbox, DsyRadio, DsyRadioGroup, DsyRange],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <Button
      dsyCheckbox
      [formField]="fields.gift"
      [indeterminate]="mixed()"
      label="Gift wrap"
      class="app-space"
    ></Button>
    <StackLayout dsyRadioGroup [formField]="fields.delivery" label="Delivery">
      <Button dsyRadio optionValue="standard" label="Standard"></Button>
      <Button dsyRadio optionValue="express" label="Express"></Button>
      <Button dsyRadio optionValue="unavailable" label="Unavailable" disabled></Button>
    </StackLayout>
    <Slider dsyRange [formField]="fields.budget" [step]="step()" label="Monthly savings"></Slider>
  `,
})
class Host {
  readonly values = signal({ gift: false, delivery: 'standard', budget: 75 });
  readonly mixed = signal(false);
  readonly locked = signal(false);
  readonly viewing = signal(false);
  readonly concealed = signal(false);
  readonly step = signal(5);
  readonly fields = form(this.values, (path) => {
    required(path.delivery);
    min(path.budget, 20);
    max(path.budget, 200);
    disabled(path.gift, () => this.locked());
    readonly(path.gift, () => this.viewing());
    hidden(path.gift, () => this.concealed());
    disabled(path.delivery, () => this.locked());
    readonly(path.delivery, () => this.viewing());
    hidden(path.delivery, () => this.concealed());
    disabled(path.budget, () => this.locked());
    readonly(path.budget, () => this.viewing());
    hidden(path.budget, () => this.concealed());
  });
}
function create() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  fixture.debugElement.query(By.directive(DsyRange)).triggerEventHandler('loaded', {});
  return {
    fixture,
    host: fixture.componentInstance,
    checkbox: fixture.debugElement.query(By.directive(DsyCheckbox)),
    group: fixture.debugElement.query(By.directive(DsyRadioGroup)),
    radios: fixture.debugElement.queryAll(By.directive(DsyRadio)),
    range: fixture.debugElement.query(By.directive(DsyRange)),
  };
}

describe('Native selection controls', () => {
  it('updates checkbox form value and touch state without losing app classes', () => {
    const { fixture, host, checkbox } = create();
    expect(checkbox.nativeElement.getAttribute('accessibilityRole')).toBe('checkbox');
    expect(checkbox.componentInstance.mark()).toBeUndefined();
    checkbox.triggerEventHandler('tap', {});
    fixture.detectChanges();
    expect(host.values().gift).toBe(true);
    expect(host.fields.gift().touched()).toBe(true);
    expect(checkbox.componentInstance.mark()).toBe(Check);
    expect(checkbox.nativeElement.classList.contains('app-space')).toBe(true);
    host.values.update((value) => ({ ...value, gift: false }));
    fixture.detectChanges();
    expect(checkbox.componentInstance.mark()).toBeUndefined();
  });

  it('resolves mixed checkbox state to checked on activation', () => {
    const { fixture, host, checkbox } = create();
    host.mixed.set(true);
    fixture.detectChanges();
    expect(checkbox.nativeElement.accessibilityValue).toBe('Mixed');
    expect(checkbox.componentInstance.mark()).toBe(Minus);
    checkbox.triggerEventHandler('tap', {});
    fixture.detectChanges();
    expect(host.values().gift).toBe(true);
    expect(checkbox.componentInstance.indeterminate()).toBe(false);
    expect(checkbox.componentInstance.mark()).toBe(Check);
  });

  it('coordinates exactly one radio selection through one form value', () => {
    const { fixture, host, radios } = create();
    expect(radios.map((radio) => radio.componentInstance.selected())).toEqual([true, false, false]);
    radios[1].triggerEventHandler('tap', {});
    fixture.detectChanges();
    expect(host.values().delivery).toBe('express');
    expect(host.fields.delivery().touched()).toBe(true);
    expect(radios.map((radio) => radio.componentInstance.selected())).toEqual([false, true, false]);
    radios[2].triggerEventHandler('tap', {});
    fixture.detectChanges();
    expect(host.values().delivery).toBe('express');
    host.values.update((value) => ({ ...value, delivery: 'standard' }));
    fixture.detectChanges();
    expect(radios[0].componentInstance.selected()).toBe(true);
  });

  it('uses Angular required validation and leaves an empty radio group unselected', () => {
    const { fixture, host, radios } = create();
    host.values.update((value) => ({ ...value, delivery: '' }));
    host.fields.delivery().markAsTouched();
    fixture.detectChanges();
    expect(host.fields.delivery().invalid()).toBe(true);
    expect(radios.every((radio) => !radio.componentInstance.selected())).toBe(true);
    expect(radios[0].nativeElement.classList.contains('dsy-native-choice-invalid')).toBe(true);
    radios[1].triggerEventHandler('tap', {});
    fixture.detectChanges();
    expect(host.fields.delivery().valid()).toBe(true);
  });

  it('forwards radio-group focus to the selected available option', () => {
    const { fixture, group, radios } = create();
    const first = vi.spyOn(radios[0].nativeElement, 'focus');
    const second = vi.spyOn(radios[1].nativeElement, 'focus');
    group.componentInstance.focus();
    expect(first).toHaveBeenCalledTimes(1);
    radios[1].triggerEventHandler('tap', {});
    fixture.detectChanges();
    group.componentInstance.focus();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('does not accept native bound coercion before loading or after unloading', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const range = fixture.debugElement.query(By.directive(DsyRange));
    range.triggerEventHandler('valueChange', { value: 20, object: range.nativeElement });
    fixture.detectChanges();
    expect(fixture.componentInstance.values().budget).toBe(75);
    expect(fixture.componentInstance.fields.budget().touched()).toBe(false);
    range.triggerEventHandler('loaded', {});
    expect(range.nativeElement.value).toBe(75);
    range.triggerEventHandler('unloaded', {});
    range.triggerEventHandler('valueChange', { value: 20, object: range.nativeElement });
    fixture.detectChanges();
    expect(fixture.componentInstance.values().budget).toBe(75);
  });

  it('ignores synchronous native value coercion while updating bounds after load', () => {
    const fixture = TestBed.createComponent(DsyRange);
    fixture.componentRef.setInput('value', 75);
    fixture.detectChanges();
    fixture.debugElement.triggerEventHandler('loaded', {});
    const touch = vi.fn();
    fixture.componentInstance.touch.subscribe(touch);
    // Emulate NativeScript minValue's synchronous valueProperty.coerce callback.
    Object.defineProperty(fixture.nativeElement, 'minValue', {
      configurable: true,
      set: () =>
        fixture.debugElement.triggerEventHandler('valueChange', {
          value: 20,
          object: fixture.nativeElement,
        }),
    });
    fixture.componentRef.setInput('min', 20);
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(75);
    expect(fixture.nativeElement.value).toBe(75);
    expect(touch).not.toHaveBeenCalled();
  });

  it('inherits slider bounds from the schema and snaps native changes to steps', () => {
    const { fixture, host, range } = create();
    expect(range.nativeElement.minValue).toBe(20);
    expect(range.nativeElement.maxValue).toBe(200);
    expect(range.nativeElement.accessibilityStep).toBe(5);
    expect(host.fields.budget().touched()).toBe(false);
    range.triggerEventHandler('valueChange', { value: 83, object: range.nativeElement });
    fixture.detectChanges();
    expect(host.values().budget).toBe(85);
    expect(range.nativeElement.value).toBe(85);
    expect(host.fields.budget().touched()).toBe(true);
    range.triggerEventHandler('valueChange', { value: 900, object: range.nativeElement });
    fixture.detectChanges();
    expect(host.values().budget).toBe(200);
  });

  it('ignores programmatic slider echoes and keeps external invalid values for Angular validation', () => {
    const { fixture, host, range } = create();
    range.triggerEventHandler('valueChange', { value: 75, object: range.nativeElement });
    fixture.detectChanges();
    expect(host.fields.budget().touched()).toBe(false);
    host.values.update((value) => ({ ...value, budget: 300 }));
    fixture.detectChanges();
    expect(range.nativeElement.value).toBe(200);
    range.triggerEventHandler('valueChange', { value: 200, object: range.nativeElement });
    fixture.detectChanges();
    expect(host.values().budget).toBe(300);
    expect(host.fields.budget().invalid()).toBe(true);
    expect(host.fields.budget().touched()).toBe(false);
  });

  it('supports fractional steps and safely handles an invalid step', () => {
    const fixture = TestBed.createComponent(DsyRange);
    fixture.componentRef.setInput('min', 0.1);
    fixture.componentRef.setInput('max', 1);
    fixture.componentRef.setInput('step', 0.1);
    fixture.detectChanges();
    fixture.debugElement.triggerEventHandler('loaded', {});
    fixture.debugElement.triggerEventHandler('valueChange', {
      value: 0.31,
      object: fixture.nativeElement,
    });
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(0.3);
    fixture.componentRef.setInput('step', 0);
    fixture.detectChanges();
    expect(fixture.nativeElement.accessibilityStep).toBe(1);
  });

  for (const state of ['locked', 'viewing', 'concealed'] as const) {
    it(`protects all selection values while ${state}`, () => {
      const { fixture, host, checkbox, group, radios, range } = create();
      host[state].set(true);
      fixture.detectChanges();
      expect(checkbox.nativeElement.isEnabled).toBe(false);
      expect(radios.every((radio) => !radio.nativeElement.isEnabled)).toBe(true);
      expect(range.nativeElement.isEnabled).toBe(false);
      if (state === 'concealed') expect(group.nativeElement.visibility).toBe('collapsed');
      checkbox.triggerEventHandler('tap', {});
      radios[1].triggerEventHandler('tap', {});
      range.triggerEventHandler('valueChange', { value: 90, object: range.nativeElement });
      fixture.detectChanges();
      expect(host.values()).toEqual({ gift: false, delivery: 'standard', budget: 75 });
      expect(range.nativeElement.value).toBe(75);
      expect(host.fields.gift().touched()).toBe(false);
      expect(host.fields.delivery().touched()).toBe(false);
      expect(host.fields.budget().touched()).toBe(false);
      host[state].set(false);
      fixture.detectChanges();
      expect(checkbox.nativeElement.isEnabled).toBe(true);
      expect(radios[1].nativeElement.isEnabled).toBe(true);
      expect(radios[2].nativeElement.isEnabled).toBe(false);
      expect(range.nativeElement.isEnabled).toBe(true);
    });
  }
});
