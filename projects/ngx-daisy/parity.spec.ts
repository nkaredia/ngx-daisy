import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DsyInput, DsyInputWrapper } from 'ngx-daisy/input';
import { DsySelect, DsySelectWrapper } from 'ngx-daisy/select';
import { DsyFieldset, DsyFieldsetLabel } from 'ngx-daisy/fieldset';
import { DsyTable, DsyTableRow } from 'ngx-daisy/table';
import { DsyLoader } from 'ngx-daisy/loader';
import { DsyCalendar } from 'ngx-daisy/calendar';
import { DsyHoverGallery } from 'ngx-daisy/hover-gallery';
import { DsyTabs } from 'ngx-daisy/tabs';
import { DsyTimeline } from 'ngx-daisy/timeline';
import { DsySwap } from 'ngx-daisy/swap';
import { DsyTextRotate } from 'ngx-daisy/text-rotate';
import { provideDaisyUI } from 'ngx-daisy/config';

@Component({
  imports: [
    ReactiveFormsModule,
    DsyInput,
    DsyInputWrapper,
    DsySelect,
    DsySelectWrapper,
    DsyFieldset,
    DsyFieldsetLabel,
    DsyTable,
    DsyTableRow,
  ],
  template: `<fieldset dsyFieldset>
      <label dsyInputWrapper color="primary"
        ><span>Search</span><input dsyInput [formControl]="text" /></label
      ><label dsySelectWrapper
        ><span>Framework</span
        ><select dsySelect [formControl]="choice">
          <option value="angular">Angular</option>
        </select></label
      >
      <p dsyFieldsetLabel>Description</p>
    </fieldset>
    <table dsyTable>
      <tbody>
        <tr dsyTableRow [hover]="hover()">
          <td>Project</td>
        </tr>
      </tbody>
    </table>`,
})
class WrapperHost {
  readonly text = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly choice = new FormControl('angular', { nonNullable: true });
  readonly hover = signal(true);
}

@Component({
  imports: [DsyTimeline, DsySwap],
  template: `<ol dsyTimeline></ol>
    <dsy-swap><span dsySwapOn>On</span><span dsySwapOff>Off</span></dsy-swap>`,
})
class DefaultsHost {}

describe('native daisyUI visual contracts', () => {
  it('keeps native wrapper styles on the wrapper while preserving reactive native control behavior', async () => {
    TestBed.configureTestingModule({
      providers: [provideDaisyUI({ prefix: 'd-', tailwindPrefix: 'tw' })],
    });
    const fixture = TestBed.createComponent(WrapperHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('input')!;
    const wrapper = root.querySelector('[dsyInputWrapper]')!;
    expect(wrapper.classList.contains('tw:d-input')).toBe(true);
    expect(input.classList.contains('tw:d-input')).toBe(false);
    expect(root.querySelector('[dsySelectWrapper]')!.classList.contains('tw:d-select')).toBe(true);
    expect(root.querySelector('select')!.classList.contains('tw:d-select')).toBe(false);
    fixture.componentInstance.text.markAsTouched();
    await fixture.whenStable();
    expect(wrapper.classList.contains('tw:d-input-error')).toBe(true);
    input.value = 'Projects';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.componentInstance.text.value).toBe('Projects');
    expect(wrapper.classList.contains('tw:d-input-error')).toBe(false);
    fixture.componentInstance.text.disable();
    await fixture.whenStable();
    expect(input.disabled).toBe(true);
    expect(
      root.querySelector('[dsyFieldsetLabel]')!.classList.contains('tw:d-fieldset-label'),
    ).toBe(true);
    expect(root.querySelector('tr')!.classList.contains('tw:d-row-hover')).toBe(true);
    fixture.componentInstance.hover.set(false);
    await fixture.whenStable();
    expect(root.querySelector('tr')!.classList.contains('tw:d-row-hover')).toBe(false);
  });

  it('uses native prefixed loading masks by default and custom artwork only for extension modes', async () => {
    TestBed.configureTestingModule({ providers: [provideDaisyUI({ prefix: 'd-' })] });
    const fixture = TestBed.createComponent(DsyLoader);
    fixture.componentRef.setInput('variant', 'ring');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.getAttribute('data-native')).toBe('true');
    expect(root.querySelector('.dsy-loader-native')?.classList.contains('d-loading-ring')).toBe(
      true,
    );
    fixture.componentRef.setInput('value', 45);
    await fixture.whenStable();
    expect(root.querySelector('.dsy-loader-native')).toBeNull();
    expect(root.getAttribute('aria-valuenow')).toBe('45');
    fixture.componentRef.setInput('value', null);
    fixture.componentRef.setInput('animation', 'none');
    await fixture.whenStable();
    expect(root.querySelector('.dsy-loader-native')).toBeNull();
    expect(root.getAttribute('data-native')).toBe('false');
  });

  it('uses daisyUI calendar selectors without a third-party date runtime', async () => {
    TestBed.configureTestingModule({ providers: [provideDaisyUI({ prefix: 'd-' })] });
    const fixture = TestBed.createComponent(DsyCalendar);
    fixture.componentRef.setInput('value', '2026-10-25');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.d-react-day-picker')).not.toBeNull();
    const chosen = root.querySelector('td.rdp-selected button')!;
    expect(chosen.classList.contains('rdp-day_button')).toBe(true);
    expect(chosen.getAttribute('data-date')).toBe('2026-10-25');
    expect(root.querySelector('[role="grid"]')).not.toBeNull();
  });

  it('changes gallery frames over the image and retains keyboard access without numbered controls', async () => {
    const fixture = TestBed.createComponent(DsyHoverGallery);
    fixture.componentRef.setInput('images', [
      { src: 'a.svg', alt: 'A' },
      { src: 'b.svg', alt: 'B' },
      { src: 'c.svg', alt: 'C' },
    ]);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const stage = root.querySelector<HTMLElement>('.dsy-gallery-stage')!;
    vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 300 } as DOMRect);
    expect(root.querySelector('button')).toBeNull();
    stage.dispatchEvent(new MouseEvent('pointermove', { clientX: 10, bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    stage.dispatchEvent(new MouseEvent('pointermove', { clientX: 250, bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.activeIndex()).toBe(2);
    stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.activeIndex()).toBe(2);
    stage.dispatchEvent(new MouseEvent('pointerleave'));
    await fixture.whenStable();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('keeps native tab, timeline and swap defaults and caps text rotation at six lines', async () => {
    const tabs = TestBed.createComponent(DsyTabs);
    await tabs.whenStable();
    expect(tabs.nativeElement.classList.contains('tabs-border')).toBe(false);
    const defaults = TestBed.createComponent(DefaultsHost);
    await defaults.whenStable();
    expect(
      defaults.nativeElement.querySelector('ol').classList.contains('timeline-horizontal'),
    ).toBe(true);
    expect(defaults.nativeElement.querySelector('button').classList.contains('btn')).toBe(false);
    const rotate = TestBed.createComponent(DsyTextRotate);
    rotate.componentRef.setInput('items', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    await rotate.whenStable();
    expect(rotate.nativeElement.querySelectorAll('[data-running] > span > span')).toHaveLength(6);
  });
});
