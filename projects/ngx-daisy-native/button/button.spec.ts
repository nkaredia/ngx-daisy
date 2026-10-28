vi.mock('@nativescript/core', () => ({ isIOS: false, Utils: {} }));
import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DsyButton } from './button.component';

@Component({
  imports: [DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template:
    '<Button dsyButton text="Continue" class="consumer-spacing" [dsyColor]="color()"></Button>',
})
class Host {
  readonly color = signal<'primary' | 'secondary'>('primary');
}

@Component({
  imports: [DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  template: '<Button dsyButton text="Continue" dsyColor="primary" dsyLayout="block"></Button>',
})
class StaticHost {}

function createButton() {
  const fixture = TestBed.createComponent(DsyButton);
  fixture.componentRef.setInput('text', 'Place order');
  fixture.detectChanges();
  return fixture;
}

describe('Native Button state and renderer bindings', () => {
  it('binds a native label, role and enabled state', () => {
    const fixture = createButton();
    const element = fixture.nativeElement;
    expect(element.text).toBe('Place order');
    expect(element.isEnabled).toBe(true);
    expect(element.accessibilityLabel).toBe('Place order');
    expect(element.getAttribute('accessibilityRole')).toBe('button');
  });

  it('updates semantic classes', () => {
    const fixture = createButton();
    fixture.componentRef.setInput('dsyColor', 'primary');
    fixture.componentRef.setInput('variant', 'outline');
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('dsy-button-primary')).toBe(true);
    expect(fixture.nativeElement.classList.contains('dsy-button-outline')).toBe(true);
    expect(fixture.nativeElement.classList.contains('dsy-button-lg')).toBe(true);
  });

  it('preserves consumer classes when semantic inputs change', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('consumer-spacing')).toBe(true);
    fixture.componentInstance.color.set('secondary');
    fixture.detectChanges();
    expect(button.classList.contains('consumer-spacing')).toBe(true);
    expect(button.classList.contains('dsy-button-secondary')).toBe(true);
    expect(button.classList.contains('dsy-button-primary')).toBe(false);
  });

  it('keeps static semantic attributes away from native color and layout properties', () => {
    const fixture = TestBed.createComponent(StaticHost);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('dsy-button-primary')).toBe(true);
    expect(button.classList.contains('dsy-button-block')).toBe(true);
    expect(button.hasAttribute('color')).toBe(false);
    expect(button.hasAttribute('layout')).toBe(false);
  });

  it('blocks activation while loading, then restores the original label and activation', () => {
    const fixture = createButton();
    const pressed = vi.fn();
    fixture.componentInstance.pressed.subscribe(pressed);
    const event = { eventName: 'tap', object: {} };
    fixture.debugElement.triggerEventHandler('tap', event);
    expect(pressed).toHaveBeenCalledExactlyOnceWith(event);
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingText', 'Saving…');
    fixture.detectChanges();
    expect(fixture.nativeElement.isEnabled).toBe(false);
    expect(fixture.nativeElement.text).toBe('Saving…');
    expect(fixture.nativeElement.accessibilityLabel).toBe('Place order, Saving…');
    fixture.debugElement.triggerEventHandler('tap', event);
    expect(pressed).toHaveBeenCalledTimes(1);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.text).toBe('Place order');
    fixture.debugElement.triggerEventHandler('tap', event);
    expect(pressed).toHaveBeenCalledTimes(2);
  });

  it('keeps explicit disabled state after loading finishes and respects an accessible label', () => {
    const fixture = createButton();
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('accessibilityLabel', 'Confirm purchase');
    fixture.detectChanges();
    expect(fixture.nativeElement.accessibilityState).toBe('disabled');
    expect(fixture.nativeElement.accessibilityLabel).toBe('Confirm purchase, Loading…');
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.isEnabled).toBe(false);
    expect(fixture.nativeElement.accessibilityLabel).toBe('Confirm purchase');
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.accessibilityState).toBe('selected');
  });
});
