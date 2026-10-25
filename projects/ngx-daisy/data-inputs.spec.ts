import { Component, signal, viewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  disabled,
  email,
  form,
  FormField,
  FormRoot,
  max,
  min,
  readonly as readOnly,
  required,
} from '@angular/forms/signals';
import { DsyCalendar, DsyDateAdapter } from '@ngx-daisy/cdk/calendar';
import { DsyCheckbox } from '@ngx-daisy/cdk/checkbox';
import { provideDaisyUI } from '@ngx-daisy/cdk/config';
import { DsyFileInput } from '@ngx-daisy/cdk/file-input';
import { DsyFilter } from '@ngx-daisy/cdk/filter';
import { DsyError, DsyFormField, DsyHint } from '@ngx-daisy/cdk/form-field';
import { DsyInput } from '@ngx-daisy/cdk/input';
import { DsyLabel } from '@ngx-daisy/cdk/label';
import { DsyOtp } from '@ngx-daisy/cdk/otp';
import { DsyRadioButton, DsyRadioGroup } from '@ngx-daisy/cdk/radio';
import { DsyRange } from '@ngx-daisy/cdk/range';
import { DsyRating } from '@ngx-daisy/cdk/rating';
import { DsySelect } from '@ngx-daisy/cdk/select';
import { DsyTextarea } from '@ngx-daisy/cdk/textarea';
import { DsyToggle } from '@ngx-daisy/cdk/toggle';
import { DsyValidator } from '@ngx-daisy/cdk/validator';

const controls = [
  DsyInput,
  DsyTextarea,
  DsySelect,
  DsyCheckbox,
  DsyToggle,
  DsyRange,
  DsyFormField,
  DsyHint,
  DsyError,
  DsyLabel,
  DsyValidator,
  DsyRadioGroup,
  DsyRadioButton,
  DsyFilter,
  DsyRating,
  DsyFileInput,
  DsyOtp,
  DsyCalendar,
];
@Component({
  imports: [FormField, ...controls],
  template: `
    <button id="outside">Outside</button>
    <dsy-form-field
      ><dsy-label>Email</dsy-label
      ><input
        id="email"
        type="email"
        dsyInput
        dsyValidator
        [formField]="fields.email"
        aria-describedby="external"
      /><dsy-hint id="hint">Enter email</dsy-hint
      ><dsy-error id="error">Email error</dsy-error></dsy-form-field
    >
    <textarea id="notes" dsyTextarea [formField]="fields.notes"></textarea>
    <select id="select" dsySelect [formField]="fields.choice">
      <option value="a">Alpha</option>
      <option value="b">Beta</option>
    </select>
    <input
      id="checkbox"
      type="checkbox"
      dsyCheckbox
      [formField]="fields.checked"
      [(indeterminate)]="mixed"
    />
    <input id="toggle" type="checkbox" dsyToggle [formField]="fields.toggle" />
    <input id="range" type="range" dsyRange [formField]="fields.range" />
    <dsy-form-field label="Delivery"
      ><dsy-radio-group #radios [formField]="fields.radio"
        ><dsy-radio-button value="a">Alpha</dsy-radio-button
        ><dsy-radio-button value="x" disabled>Disabled</dsy-radio-button
        ><dsy-radio-button value="b">Beta</dsy-radio-button></dsy-radio-group
      ><dsy-hint>Choose delivery</dsy-hint></dsy-form-field
    >
    <dsy-filter [formField]="fields.filter" [options]="options" />
    <dsy-rating [formField]="fields.rating" half allowClear />
    <dsy-file-input #files [formField]="fields.files" multiple />
    <dsy-otp #otp [formField]="fields.code" [length]="4" (completed)="complete = $event" />
    <dsy-calendar #calendar [formField]="fields.date" />
  `,
})
class SignalHost {
  readonly locked = signal(false);
  readonly readOnly = signal(false);
  readonly mixed = signal(true);
  readonly model = signal({
    email: '',
    notes: '',
    choice: 'a',
    checked: false,
    toggle: true,
    range: 25,
    radio: 'a' as string | null,
    filter: null as string | null,
    rating: 2.5 as number | null,
    files: [] as readonly File[] | null,
    code: '' as string | null,
    date: '2026-10-20' as string | null,
  });
  readonly fields = form(this.model, (s) => {
    required(s.email);
    email(s.email);
    min(s.range, 0);
    max(s.range, 100);
    disabled(s.radio, () => this.locked());
    disabled(s.code, () => this.locked());
    readOnly(s.code, () => this.readOnly());
  });
  readonly options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
  ];
  complete = '';
  readonly files = viewChild.required(DsyFileInput);
  readonly radios = viewChild.required(DsyRadioGroup);
  readonly calendar = viewChild.required(DsyCalendar);
}
@Component({
  imports: [
    ReactiveFormsModule,
    DsyInput,
    DsyFormField,
    DsyHint,
    DsyError,
    DsyValidator,
    DsyRadioGroup,
    DsyRadioButton,
    DsyOtp,
    DsyRating,
    DsyFileInput,
    DsyCalendar,
    DsyFilter,
  ],
  template: `<form [formGroup]="group">
    <dsy-form-field label="Email"
      ><input id="email" type="email" dsyInput dsyValidator formControlName="email" /><dsy-hint
        id="hint"
        >Email hint</dsy-hint
      ><dsy-error id="error">Email error</dsy-error></dsy-form-field
    ><dsy-otp [formControl]="code" [length]="4" /><dsy-rating
      [formControl]="rating"
    /><dsy-radio-group [formControl]="radio"
      ><dsy-radio-button value="a">Alpha</dsy-radio-button
      ><dsy-radio-button value="b">Beta</dsy-radio-button></dsy-radio-group
    ><dsy-filter [formControl]="filter" [options]="options" /><dsy-calendar
      [formControl]="date"
    /><dsy-file-input [formControl]="files" /><button type="submit">Submit</button>
  </form>`,
})
class ReactiveHost {
  readonly group = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  readonly code = new FormControl<string | null>('');
  readonly rating = new FormControl<number | null>(2);
  readonly radio = new FormControl<string | null>('a');
  readonly filter = new FormControl<string | null>(null);
  readonly date = new FormControl<string | null>('2026-10-20');
  readonly files = new FormControl<readonly File[] | null>([]);
  readonly options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
  ];
}
@Component({
  imports: [FormsModule, DsyOtp, DsyRadioGroup, DsyRadioButton],
  template: `<dsy-otp [(ngModel)]="code" [length]="4" /><dsy-radio-group [(ngModel)]="choice"
      ><dsy-radio-button value="a">Alpha</dsy-radio-button
      ><dsy-radio-button value="b">Beta</dsy-radio-button></dsy-radio-group
    >`,
})
class TemplateHost {
  code = '';
  choice = 'a';
}
@Component({
  imports: [DsyCalendar],
  template: `<dsy-calendar
    [value]="value()"
    min="2026-10-05"
    max="2026-11-10"
    [dateFilter]="weekdays"
  />`,
})
class CalendarHost {
  readonly value = signal<string | null>('2026-10-09');
  readonly weekdays = (date: string) => ![0, 6].includes(new Date(date + 'T12:00:00Z').getUTCDay());
}
@Component({
  imports: [FormField, FormRoot, DsyInput, DsyFormField, DsyError],
  template: `<form [formRoot]="fields">
    <dsy-form-field label="Email"
      ><input dsyInput [formField]="fields.email" /><dsy-error
        >Required email</dsy-error
      ></dsy-form-field
    ><button type="submit">Submit</button>
  </form>`,
})
class SubmitHost {
  readonly model = signal({ email: '' });
  readonly submitted = signal(false);
  readonly fields = form(this.model, (s) => required(s.email), {
    submission: {
      action: async () => {
        this.submitted.set(true);
      },
    },
  });
}
@Component({
  imports: [ReactiveFormsModule, DsySelect],
  template: `<select dsySelect [formControl]="single" [compareWith]="compare">
      @for (option of options; track option.id) {
        <option [ngValue]="option">{{ option.label }}</option>
      }</select
    ><select dsySelect multiple [formControl]="multiple" [compareWith]="compare">
      @for (option of options; track option.id) {
        <option [ngValue]="option">{{ option.label }}</option>
      }
    </select>`,
})
class ObjectSelectHost {
  readonly options = [
    { id: 1, label: 'Alpha' },
    { id: 2, label: 'Beta' },
  ];
  readonly single = new FormControl<{ id: number; label: string } | null>({
    id: 2,
    label: 'Different instance',
  });
  readonly multiple = new FormControl<readonly { id: number; label: string }[]>(
    [{ id: 1, label: 'Different instance' }],
    { nonNullable: true },
  );
  readonly compare = (a: { id: number } | null, b: { id: number } | null) => a?.id === b?.id;
}
function input(element: HTMLInputElement | HTMLTextAreaElement, value: string, event = 'input') {
  element.value = value;
  element.dispatchEvent(new Event(event, { bubbles: true }));
}
function key(element: Element, name: string, code = 0) {
  const e = new KeyboardEvent('keydown', {
    key: name,
    keyCode: code,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(e);
  return e;
}
async function render<T>(type: new (...args: any[]) => T) {
  const fixture = TestBed.createComponent(type);
  await fixture.whenStable();
  return { fixture, host: fixture.componentInstance, root: fixture.nativeElement as HTMLElement };
}

describe('Data Input forms integration', () => {
  it('keeps native values, numbers, selections and booleans reactive with Signal Forms', async () => {
    const { fixture, host, root } = await render(SignalHost);
    input(root.querySelector('#email')!, 'person@example.com');
    input(root.querySelector('#notes')!, 'Notes');
    input(root.querySelector('#select')!, 'b');
    (root.querySelector('#checkbox') as HTMLInputElement).click();
    (root.querySelector('#toggle') as HTMLInputElement).click();
    input(root.querySelector('#range')!, '40');
    await fixture.whenStable();
    expect(host.model()).toMatchObject({
      email: 'person@example.com',
      notes: 'Notes',
      choice: 'b',
      checked: true,
      toggle: false,
      range: 40,
    });
    expect(host.mixed()).toBe(false);
    host.model.update((value) => ({
      ...value,
      email: 'other@example.com',
      checked: false,
      range: 60,
    }));
    await fixture.whenStable();
    expect((root.querySelector('#email') as HTMLInputElement).value).toBe('other@example.com');
    expect((root.querySelector('#checkbox') as HTMLInputElement).checked).toBe(false);
    expect((root.querySelector('#range') as HTMLInputElement).value).toBe('60');
  });
  it('links labels, preserves external descriptions and switches hints to errors on signal touch', async () => {
    const { fixture, host, root } = await render(SignalHost);
    const control = root.querySelector<HTMLInputElement>('#email')!;
    expect(root.querySelector('label')?.htmlFor).toBe('email');
    expect(control.getAttribute('aria-describedby')).toBe('external hint');
    expect(control.getAttribute('aria-invalid')).toBeNull();
    expect(control.getAttribute('aria-required')).toBe('true');
    host.fields.email().markAsTouched();
    await fixture.whenStable();
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(control.classList.contains('input-error')).toBe(true);
    expect(control.getAttribute('aria-describedby')).toBe('external error');
    host.fields().reset();
    await fixture.whenStable();
    expect(control.getAttribute('aria-invalid')).toBeNull();
    expect(control.getAttribute('aria-describedby')).toBe('external hint');
  });
  it('updates reactive touched, disabled and reset state without a DOM event', async () => {
    const { fixture, host, root } = await render(ReactiveHost);
    const control = root.querySelector<HTMLInputElement>('#email')!;
    host.group.controls.email.markAsTouched();
    await fixture.whenStable();
    expect(control.getAttribute('aria-invalid')).toBe('true');
    host.group.controls.email.disable();
    await fixture.whenStable();
    expect(control.disabled).toBe(true);
    expect(control.getAttribute('aria-invalid')).toBeNull();
    host.group.controls.email.enable();
    host.group.reset();
    await fixture.whenStable();
    expect(control.getAttribute('aria-invalid')).toBeNull();
  });
  it('shows invalid untouched reactive controls after form submission', async () => {
    const { fixture, root } = await render(ReactiveHost);
    const form = root.querySelector('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(root.querySelector('#email')?.getAttribute('aria-invalid')).toBe('true');
    form.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(root.querySelector('#email')?.getAttribute('aria-invalid')).toBeNull();
  });
  it('uses CDK radio navigation, skips disabled options and synchronizes the group value', async () => {
    const { fixture, host, root } = await render(SignalHost);
    const group = root.querySelector('dsy-radio-group')!;
    const groupLabel = group.getAttribute('aria-labelledby');
    expect(groupLabel).toBeTruthy();
    expect(document.getElementById(groupLabel!)?.textContent?.trim()).toBe('Delivery');
    const radios = root.querySelectorAll<HTMLInputElement>('dsy-radio-button input');
    radios[0].focus();
    key(radios[0], 'ArrowDown', 40);
    await fixture.whenStable();
    expect(host.model().radio).toBe('b');
    expect(document.activeElement).toBe(radios[2]);
    expect(radios[2].checked).toBe(true);
    host.locked.set(true);
    await fixture.whenStable();
    expect(Array.from(radios).every((input) => input.disabled)).toBe(true);
  });
  it('edits custom controls through Signal Forms and marks touch on blur', async () => {
    const { fixture, host, root } = await render(SignalHost);
    const code = root.querySelector<HTMLInputElement>('dsy-otp input')!;
    input(code, '12x34');
    await fixture.whenStable();
    expect(host.model().code).toBe('1234');
    expect(host.complete).toBe('1234');
    code.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: root.querySelector('#outside') }),
    );
    await fixture.whenStable();
    expect(host.fields.code().touched()).toBe(true);
    expect(host.fields.code().dirty()).toBe(true);
    (root.querySelector('dsy-filter input[value=b]') as HTMLInputElement).click();
    (root.querySelector('dsy-rating input[aria-label="3.5 of 5"]') as HTMLInputElement).click();
    await fixture.whenStable();
    expect(host.model().filter).toBe('b');
    expect(host.model().rating).toBe(3.5);
  });
  it('honors signal readonly and disabled rules and supports bound focus', async () => {
    const { fixture, host, root } = await render(SignalHost);
    const code = root.querySelector<HTMLInputElement>('dsy-otp input')!;
    host.readOnly.set(true);
    await fixture.whenStable();
    expect(code.readOnly).toBe(true);
    host.locked.set(true);
    await fixture.whenStable();
    expect(code.disabled).toBe(true);
    host.locked.set(false);
    host.readOnly.set(false);
    await fixture.whenStable();
    host.fields.code().focusBoundControl();
    expect(document.activeElement).toBe(code);
  });
  it('does not commit partial IME composition and commits the completed text', async () => {
    const { fixture, host, root } = await render(SignalHost);
    const code = root.querySelector<HTMLInputElement>('dsy-otp input')!;
    code.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    input(code, '12');
    await fixture.whenStable();
    expect(host.model().code).toBe('');
    code.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '12' }));
    await fixture.whenStable();
    expect(host.model().code).toBe('12');
  });
  it('supports custom controls with typed Reactive Forms and resets their views', async () => {
    const { fixture, host, root } = await render(ReactiveHost);
    input(root.querySelector('dsy-otp input')!, '9876');
    (root.querySelector('dsy-radio-button:nth-child(2) input') as HTMLInputElement).click();
    (root.querySelector('dsy-rating input[aria-label="4 of 5"]') as HTMLInputElement).click();
    await fixture.whenStable();
    expect(host.code.value).toBe('9876');
    expect(host.radio.value).toBe('b');
    expect(host.rating.value).toBe(4);
    host.code.reset('');
    host.radio.setValue('a');
    host.rating.disable();
    await fixture.whenStable();
    expect((root.querySelector('dsy-otp input') as HTMLInputElement).value).toBe('');
    expect((root.querySelector('dsy-radio-button input') as HTMLInputElement).checked).toBe(true);
    expect(
      Array.from(root.querySelectorAll<HTMLInputElement>('dsy-rating input')).every(
        (input) => input.disabled,
      ),
    ).toBe(true);
  });
  it('works with ngModel without an additional value accessor', async () => {
    const { fixture, host, root } = await render(TemplateHost);
    input(root.querySelector('dsy-otp input')!, '4321');
    (root.querySelector('dsy-radio-button:nth-child(2) input') as HTMLInputElement).click();
    await fixture.whenStable();
    expect(host.code).toBe('4321');
    expect(host.choice).toBe('b');
  });
  it('stores files as file arrays and clears native picker state on reset', async () => {
    const { fixture, host, root } = await render(SignalHost);
    const picker = root.querySelector<HTMLInputElement>('dsy-file-input input')!;
    const file = new File(['test'], 'notes.txt', { type: 'text/plain' });
    Object.defineProperty(picker, 'files', { value: [file], configurable: true });
    picker.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
    expect(host.model().files).toEqual([file]);
    host.fields.files().reset([]);
    await fixture.whenStable();
    expect(host.model().files).toEqual([]);
    expect(picker.value).toBe('');
  });
  it('clears only its filter value, preserving the rest of the form', async () => {
    const { fixture, host, root } = await render(SignalHost);
    host.model.update((value) => ({ ...value, filter: 'a', notes: 'Keep me' }));
    await fixture.whenStable();
    (root.querySelector('dsy-filter button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(host.model().filter).toBeNull();
    expect(host.model().notes).toBe('Keep me');
  });
  it('selects calendar dates through Signal Forms and renders programmatic changes', async () => {
    const { fixture, host, root } = await render(SignalHost);
    (root.querySelector('[data-date="2026-10-22"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(host.model().date).toBe('2026-10-22');
    host.model.update((value) => ({ ...value, date: '2026-11-03' }));
    await fixture.whenStable();
    expect(root.querySelector('[data-date="2026-11-03"]')?.getAttribute('data-selected')).toBe(
      'true',
    );
  });
  it('skips unavailable calendar dates and clamps month/year arithmetic at month end', async () => {
    const { fixture, root } = await render(CalendarHost);
    const friday = root.querySelector<HTMLButtonElement>('[data-date="2026-10-09"]')!;
    friday.focus();
    key(friday, 'ArrowRight', 39);
    await fixture.whenStable();
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-12');
    expect((root.querySelector('[data-date="2026-10-04"]') as HTMLButtonElement).disabled).toBe(
      true,
    );
    const adapter = TestBed.inject(DsyDateAdapter);
    expect(adapter.addMonths('2024-01-31', 1)).toBe('2024-02-29');
    expect(adapter.addMonths('2024-02-29', 12)).toBe('2025-02-28');
    expect(adapter.parse('2026-02-30')).toBeNull();
  });
  it('uses FormRoot submission to reveal invalid fields and submit valid values', async () => {
    const { fixture, host, root } = await render(SubmitHost);
    const formElement = root.querySelector('form')!;
    formElement.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(host.submitted()).toBe(false);
    expect(host.fields.email().touched()).toBe(true);
    expect(root.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
    input(root.querySelector('input')!, 'person@example.com');
    await fixture.whenStable();
    formElement.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(host.submitted()).toBe(true);
  });
  it('tracks asynchronous reactive pending and server validation errors', async () => {
    const { fixture, host, root } = await render(ReactiveHost);
    const result = new Subject<{ server: true } | null>();
    const control = host.group.controls.email;
    control.markAsTouched();
    control.setAsyncValidators(() => result);
    control.setValue('person@example.com');
    await fixture.whenStable();
    expect(root.querySelector('#email')?.getAttribute('aria-busy')).toBe('true');
    result.next({ server: true });
    result.complete();
    await fixture.whenStable();
    expect(root.querySelector('#email')?.getAttribute('aria-busy')).toBeNull();
    expect(root.querySelector('#email')?.getAttribute('aria-invalid')).toBe('true');
  });
  it('preserves native reactive updateOn blur behavior when a control is replaced', async () => {
    const { fixture, host, root } = await render(ReactiveHost);
    const control = new FormControl('', { nonNullable: true, updateOn: 'blur' });
    host.group.setControl('email', control);
    await fixture.whenStable();
    const element = root.querySelector<HTMLInputElement>('#email')!;
    input(element, 'changed@example.com');
    await fixture.whenStable();
    expect(control.value).toBe('');
    element.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(control.value).toBe('changed@example.com');
    expect(control.touched).toBe(true);
  });
  it('keeps object comparison and native multiple selection compatible with Reactive Forms', async () => {
    const { fixture, host, root } = await render(ObjectSelectHost);
    const [single, multiple] = Array.from(root.querySelectorAll('select'));
    expect(single.selectedIndex).toBe(1);
    expect(multiple.options[0].selected).toBe(true);
    multiple.options[1].selected = true;
    multiple.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
    expect(host.multiple.value).toEqual(host.options);
    host.single.setValue(host.options[0]);
    await fixture.whenStable();
    expect(single.selectedIndex).toBe(0);
  });
  it('preserves all native form classes under combined prefixes', async () => {
    TestBed.configureTestingModule({
      providers: [provideDaisyUI({ prefix: 'd-', tailwindPrefix: 'tw' })],
    });
    const { root } = await render(SignalHost);
    for (const [selector, cls] of [
      ['#email', 'input'],
      ['#notes', 'textarea'],
      ['#select', 'select'],
      ['#checkbox', 'checkbox'],
      ['#toggle', 'toggle'],
      ['#range', 'range'],
      ['dsy-radio-button input', 'radio'],
      ['dsy-file-input input', 'file-input'],
      ['dsy-rating>div', 'rating'],
      ['dsy-otp label', 'otp'],
      ['dsy-filter>div', 'filter'],
    ]) {
      const element = root.querySelector(selector)!;
      expect(element.classList.contains('tw:d-' + cls)).toBe(true);
      expect(element.classList.contains('d-' + cls)).toBe(true);
    }
  });
});
