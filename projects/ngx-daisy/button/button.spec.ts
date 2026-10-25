import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DsyButton, DsyButtonColor } from './public-api';

@Component({
  imports: [DsyButton],
  template: `<button
    dsyButton
    type="button"
    class="custom"
    [color]="color()"
    [disabled]="disabled()"
    (click)="clicks = clicks + 1"
  >
    Save
  </button>`,
})
class Host {
  readonly color = signal<DsyButtonColor>('primary');
  readonly disabled = signal(false);
  clicks = 0;
}

describe('DsyButton', () => {
  it('updates signal inputs without Zone.js and preserves consumer classes and content', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.textContent?.trim()).toBe('Save');
    expect(button.classList.contains('btn-primary')).toBe(true);
    fixture.componentInstance.color.set('success');
    await fixture.whenStable();
    expect(button.classList.contains('btn-primary')).toBe(false);
    expect(button.classList.contains('btn-success')).toBe(true);
    expect(button.classList.contains('custom')).toBe(true);
  });
  it('uses native disabled behavior to prevent activation', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(fixture.componentInstance.clicks).toBe(1);
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(true);
    button.click();
    expect(fixture.componentInstance.clicks).toBe(1);
  });
});
