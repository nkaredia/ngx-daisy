import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DsyCalendar } from '@ngx-daisy/cdk/calendar';
import { DsyHoverGallery } from '@ngx-daisy/cdk/hover-gallery';
import { DsyLink } from '@ngx-daisy/cdk/link';
import { DsyRating } from '@ngx-daisy/cdk/rating';
import { DsySwap } from '@ngx-daisy/cdk/swap';

@Component({
  imports: [DsySwap],
  template: `<dsy-swap
    ><span dsySwapOff>Updates off</span><span dsySwapOn>Updates on</span></dsy-swap
  >`,
})
class TextSwapHost {}

@Component({
  imports: [DsyLink],
  template: `<a
    dsyLink
    href="#project"
    [disabled]="disabled()"
    (auxclick)="activations = activations + 1"
    >Project</a
  >`,
})
class LinkHost {
  readonly disabled = signal(true);
  activations = 0;
}

@Component({
  imports: [DsyCalendar],
  template: `<span id="departure-label">Departure date</span
    ><dsy-calendar
      aria-label="Fallback context"
      aria-labelledby="departure-label"
      value="2026-11-02"
    />`,
})
class LabelledCalendarHost {}

describe('web accessibility semantics', () => {
  it('lets active projected Swap text supply the name instead of overriding it with Toggle', async () => {
    const fixture = TestBed.createComponent(TextSwapHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.hasAttribute('aria-label')).toBe(false);
    expect(button.querySelector('.dsy-swap-off')?.hasAttribute('aria-hidden')).toBe(false);
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.querySelector('.dsy-swap-on')?.hasAttribute('aria-hidden')).toBe(false);
    expect(button.querySelector('.dsy-swap-off')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('retains explicit naming for icon-only Swaps', async () => {
    const fixture = TestBed.createComponent(DsySwap);
    fixture.componentRef.setInput('aria-label', 'Mute audio');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-label')).toBe(
      'Mute audio',
    );
  });

  it('includes each Gallery button number in its accessible name while retaining its image context', async () => {
    const fixture = TestBed.createComponent(DsyHoverGallery);
    fixture.componentRef.setInput('images', [
      { src: 'alpine.svg', alt: 'Alpine landscape' },
      { src: 'coast.svg', alt: 'Coast' },
    ]);
    fixture.componentRef.setInput('controls', true);
    await fixture.whenStable();
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      '1: Show Alpine landscape',
      '2: Show Coast',
    ]);
    buttons[1].click();
    await fixture.whenStable();
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.querySelector('img:not([hidden])').alt).toBe('Coast');
  });

  it('keeps read-only Rating semantics on the group and prevents pointer changes', async () => {
    const fixture = TestBed.createComponent(DsyRating);
    fixture.componentRef.setInput('readonly', true);
    fixture.componentRef.setInput('value', 2);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('[role="radiogroup"]')?.getAttribute('aria-readonly')).toBe('true');
    expect(root.querySelector('input[aria-readonly]')).toBeNull();
    root.querySelector<HTMLInputElement>('input[aria-label="4 of 5"]')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe(2);
  });

  it('names the Calendar by context and the current month, including after navigation', async () => {
    const fixture = TestBed.createComponent(DsyCalendar);
    fixture.componentRef.setInput('aria-label', 'Book a call');
    fixture.componentRef.setInput('value', '2026-10-02');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const grid = root.querySelector('[role="grid"]')!;
    const nameParts = () =>
      grid
        .getAttribute('aria-labelledby')!
        .split(' ')
        .map((id) => root.querySelector(`[id="${id}"]`)?.textContent?.trim());
    expect(nameParts()).toEqual(['Book a call', 'October 2026']);
    root.querySelector<HTMLButtonElement>('[aria-label="Next month"]')!.click();
    await fixture.whenStable();
    expect(nameParts()).toEqual(['Book a call', 'November 2026']);
  });

  it('uses an external Calendar label in preference to fallback context without losing the month', async () => {
    const fixture = TestBed.createComponent(LabelledCalendarHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const refs = root.querySelector('[role="grid"]')!.getAttribute('aria-labelledby')!.split(' ');
    expect(refs.map((id) => root.querySelector(`[id="${id}"]`)?.textContent?.trim())).toEqual([
      'Departure date',
      'November 2026',
    ]);
  });

  it('blocks disabled auxiliary link activation before application handlers and restores it when enabled', async () => {
    const fixture = TestBed.createComponent(LinkHost);
    await fixture.whenStable();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    const blocked = new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true });
    expect(link.dispatchEvent(blocked)).toBe(false);
    expect(fixture.componentInstance.activations).toBe(0);
    fixture.componentInstance.disabled.set(false);
    await fixture.whenStable();
    expect(
      link.dispatchEvent(
        new MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }),
      ),
    ).toBe(true);
    expect(fixture.componentInstance.activations).toBe(1);
  });
});
