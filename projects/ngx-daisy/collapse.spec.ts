import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DsyCollapse } from 'ngx-daisy/collapse';

@Component({
  imports: [DsyCollapse],
  template: `<dsy-collapse
    trigger="button"
    title="Example"
    [(opened)]="opened"
    [disabled]="disabled()"
  >
    <div dsyCollapseHeader>
      <button (click)="count.set(count() + 1)">Independent action</button>
    </div>
    <a href="#example">Panel link</a>
  </dsy-collapse>`,
})
class ButtonCollapseHost {
  readonly opened = signal(false);
  readonly disabled = signal(false);
  readonly count = signal(0);
}

describe('button-only collapse', () => {
  it('only toggles with its trigger and preserves disabled, focus and ARIA behavior', async () => {
    const fixture = TestBed.createComponent(ButtonCollapseHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const trigger = root.querySelector<HTMLButtonElement>('.dsy-collapse-trigger')!;
    const header = root.querySelector<HTMLElement>('.dsy-collapse-button-heading')!;
    const panel = root.querySelector<HTMLElement>('[role="region"]')!;
    header.click();
    root.querySelector<HTMLButtonElement>('[dsyCollapseHeader] button')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.count()).toBe(1);
    expect(panel.hidden).toBe(true);
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    trigger.click();
    await fixture.whenStable();
    expect(panel.hidden).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    root.querySelector<HTMLAnchorElement>('a')!.focus();
    fixture.componentInstance.opened.set(false);
    await fixture.whenStable();
    expect(document.activeElement).toBe(trigger);
    expect(panel.hasAttribute('inert')).toBe(true);
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    trigger.click();
    expect(fixture.componentInstance.opened()).toBe(false);
    expect(trigger.disabled).toBe(true);
  });
});
