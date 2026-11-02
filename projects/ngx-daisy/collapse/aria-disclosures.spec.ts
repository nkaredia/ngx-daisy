import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AccordionTrigger } from '@angular/aria/accordion';
import { DsyAccordion } from '@ngx-daisy/cdk/accordion';
import { DsyCollapse } from '@ngx-daisy/cdk/collapse';

@Component({
  imports: [DsyAccordion, DsyCollapse],
  template: `
    <dsy-accordion #group>
      <dsy-collapse title="First" [(opened)]="first">First details</dsy-collapse>
      <dsy-collapse title="Disabled" disabled>Disabled details</dsy-collapse>
      <dsy-collapse title="Last" [(opened)]="last">Last details</dsy-collapse>
    </dsy-accordion>
  `,
})
class GroupHost {
  readonly first = signal(false);
  readonly last = signal(false);
}
@Component({
  imports: [DsyCollapse],
  template: `<dsy-collapse
    title="Preferences"
    [(opened)]="opened"
    [disabled]="disabled()"
    [trigger]="buttonOnly() ? 'button' : 'title'"
    ><button dsyCollapseHeader (click)="headerActions.set(headerActions() + 1)">
      Header action</button
    ><input value="Draft"
  /></dsy-collapse>`,
})
class StandaloneHost {
  readonly opened = signal(false);
  readonly disabled = signal(false);
  readonly buttonOnly = signal(false);
  readonly headerActions = signal(0);
}
@Component({
  imports: [DsyAccordion, DsyCollapse],
  template: `
    <dsy-accordion #group>
      <dsy-collapse title="Default" [(opened)]="first">Default content</dsy-collapse>
      <dsy-collapse title="Custom" trigger="button" [triggerTemplate]="custom" [(opened)]="second"
        ><input value="Custom draft"
      /></dsy-collapse>
    </dsy-accordion>
    <ng-template #custom let-collapse>
      <button
        class="custom-trigger"
        [id]="collapse.id + '-trigger'"
        [disabled]="collapse.disabled()"
        [attr.aria-controls]="collapse.id + '-panel'"
        [attr.aria-expanded]="collapse.opened()"
        (click)="collapse.toggle()"
      >
        Custom toggle
      </button>
    </ng-template>
  `,
})
class CustomHost {
  readonly first = signal(false);
  readonly second = signal(false);
  readonly group = viewChild.required(DsyAccordion);
}

describe('Aria-backed disclosure compatibility', () => {
  it('uses real Aria triggers across the group view boundary, skips native-disabled controls and respects navigation boundaries', async () => {
    const fixture = TestBed.createComponent(GroupHost);
    await fixture.whenStable();
    expect(fixture.debugElement.queryAll(By.directive(AccordionTrigger))).toHaveLength(2);
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    buttons[0].focus();
    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(buttons[2]);
    expect(fixture.componentInstance.last()).toBe(false);
    buttons[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(buttons[2]);
  });

  it('keeps standalone content and its edited value through repeated disclosure', async () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const button = root.querySelector<HTMLButtonElement>('.dsy-collapse-heading button')!;
    button.click();
    await fixture.whenStable();
    const input = root.querySelector('input')!;
    // Native daisyUI selectors require the heading and content to remain direct children.
    const collapse = root.querySelector('dsy-collapse')!;
    expect(root.querySelector('[role=region]')!.parentElement).toBe(collapse);
    expect(button.closest('.dsy-collapse-heading')!.parentElement).toBe(collapse);
    input.value = 'Edited';
    button.click();
    await fixture.whenStable();
    expect(root.querySelector('[role=region]')!.hasAttribute('inert')).toBe(true);
    button.click();
    await fixture.whenStable();
    expect(root.querySelector('input')).toBe(input);
    expect(input.value).toBe('Edited');
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    const disabledButton = root.querySelector<HTMLButtonElement>('.dsy-collapse-heading button')!;
    expect(disabledButton.disabled).toBe(true);
    disabledButton.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.opened()).toBe(true);
  });

  it('does not toggle the button-only disclosure when its titlebar action is clicked', async () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    fixture.componentInstance.buttonOnly.set(true);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('[dsyCollapseHeader]')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.headerActions()).toBe(1);
    expect(fixture.componentInstance.opened()).toBe(false);
    root.querySelector<HTMLButtonElement>('.dsy-collapse-default-trigger')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.opened()).toBe(true);
  });

  it('coordinates legacy custom templates with built-in Aria triggers and group commands', async () => {
    const fixture = TestBed.createComponent(CustomHost);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('.dsy-collapse-heading button')!.click();
    await fixture.whenStable();
    root.querySelector<HTMLButtonElement>('.custom-trigger')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.first()).toBe(false);
    expect(fixture.componentInstance.second()).toBe(true);
    const input = root.querySelector('input')!;
    input.focus();
    fixture.componentInstance.group().closeAll();
    await fixture.whenStable();
    expect(document.activeElement).toBe(root.querySelector('.custom-trigger'));
    expect(fixture.componentInstance.second()).toBe(false);
  });

  it('retains exiting content while immediately making it inert, and ignores a stale close event after reopening', async () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    await fixture.whenStable();
    const original = window.getComputedStyle.bind(window);
    const style = vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => {
      if (element.tagName === 'DSY-COLLAPSE')
        return { transitionDuration: '0.2s', transitionDelay: '0s' } as CSSStyleDeclaration;
      return original(element, pseudo);
    });
    try {
      fixture.componentInstance.opened.set(true);
      await fixture.whenStable();
      fixture.componentInstance.opened.set(false);
      await fixture.whenStable();
      const root = fixture.nativeElement as HTMLElement;
      const panel = root.querySelector<HTMLElement>('[role=region]')!;
      expect(panel.hidden).toBe(false);
      expect(panel.hasAttribute('inert')).toBe(true);
      fixture.componentInstance.opened.set(true);
      await fixture.whenStable();
      const end = new Event('transitionend', { bubbles: true });
      Object.defineProperty(end, 'propertyName', { value: 'grid-template-rows' });
      root.querySelector('dsy-collapse')!.dispatchEvent(end);
      await fixture.whenStable();
      expect(panel.hidden).toBe(false);
      expect(panel.hasAttribute('inert')).toBe(false);
    } finally {
      style.mockRestore();
      fixture.destroy();
    }
  });
  it('keeps editing keys in a panel out of the group key map', async () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    fixture.componentInstance.opened.set(true);
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector('input')!;
    input.focus();
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    input.dispatchEvent(event);
    await fixture.whenStable();
    expect(event.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.opened()).toBe(true);
  });

  it('keeps trigger/panel state and draft content connected when changing trigger mode', async () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    fixture.componentInstance.opened.set(true);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector('input')!;
    input.value = 'Edited draft';
    fixture.componentInstance.buttonOnly.set(true);
    await fixture.whenStable();
    expect(root.querySelector('input')).toBe(input);
    fixture.componentInstance.opened.set(false);
    await fixture.whenStable();
    expect(root.querySelector('[role=region]')!.hasAttribute('inert')).toBe(true);
    fixture.componentInstance.opened.set(true);
    await fixture.whenStable();
    expect(root.querySelector('input')!.value).toBe('Edited draft');
  });
  it('allows programmatic state changes while keeping disabled controls noninteractive', async () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    fixture.componentInstance.opened.set(true);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('.dsy-collapse-heading button')!;
    expect(trigger.disabled).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector<HTMLElement>('[role=region]')!.hidden).toBe(false);
    trigger.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.opened()).toBe(true);
  });
});
