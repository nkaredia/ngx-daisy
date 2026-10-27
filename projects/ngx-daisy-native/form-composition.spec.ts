import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormField, disabled, form, hidden, readonly, required } from '@angular/forms/signals';
import { Subject } from 'rxjs';
vi.mock('@nativescript/angular', () => ({
  NativeDialog: class {},
  NativeDialogRef: class {},
  NATIVE_DIALOG_DATA: 'native-dialog-data',
}));
import { DsyModalService } from '@ngx-daisy/native/modal';
import { DsyFormField } from '@ngx-daisy/native/form-field';
import { DsyInput } from '@ngx-daisy/native/input';
import { DsyFieldset } from './fieldset/fieldset';
import { DsySelect, type DsySelectOption } from './select/select';
const options: readonly DsySelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'other', label: 'Unavailable', disabled: true },
];
function modalStub() {
  const refs: {
    close: (result?: unknown) => void;
    getState: () => number;
    afterClosed: () => Subject<unknown>;
  }[] = [];
  const service = {
    open: vi.fn(() => {
      const closed = new Subject<unknown>();
      let state = 0;
      const ref = {
        close: vi.fn((result?: unknown) => {
          if (state !== 0) return;
          state = 2;
          closed.next(result);
          closed.complete();
        }),
        getState: () => state,
        afterClosed: () => closed,
      };
      refs.push(ref);
      return ref;
    }),
  };
  TestBed.configureTestingModule({ providers: [{ provide: DsyModalService, useValue: service }] });
  return { service, refs };
}
@Component({
  imports: [DsyFormField, DsyInput, FormField],
  schemas: [NO_ERRORS_SCHEMA],
  template:
    '<StackLayout dsyFormField label="Display name" hint="Use the name your team knows."><TextField dsyInput [formField]="fields.name" [label]="override()"></TextField></StackLayout>',
})
class FieldHost {
  readonly values = signal({ name: '' });
  readonly override = signal('');
  readonly concealed = signal(false);
  readonly fields = form(this.values, (path) => {
    required(path.name, { message: 'Enter your name.' });
    hidden(path.name, () => this.concealed());
  });
}
@Component({
  imports: [DsyFormField, DsySelect, FormField],
  schemas: [NO_ERRORS_SCHEMA],
  template:
    '<StackLayout dsyFormField label="Delivery region" hint="Choose your destination."><GridLayout dsySelect [formField]="fields.region" [options]="options"></GridLayout></StackLayout>',
})
class SelectHost {
  readonly options = options;
  readonly values = signal({ region: 'us' });
  readonly locked = signal(false);
  readonly viewing = signal(false);
  readonly concealed = signal(false);
  readonly fields = form(this.values, (path) => {
    required(path.region);
    disabled(path.region, () => this.locked());
    readonly(path.region, () => this.viewing());
    hidden(path.region, () => this.concealed());
  });
}

@Component({
  imports: [DsyFieldset, DsyFormField, DsyInput, FormField],
  schemas: [NO_ERRORS_SCHEMA],
  template:
    '<StackLayout dsyFieldset legend="Contact details" [hidden]="concealed()"><StackLayout dsyFormField label="Name"><TextField dsyInput [formField]="fields.name"></TextField></StackLayout></StackLayout>',
})
class GroupedHost {
  readonly values = signal({ name: 'Maya' });
  readonly fields = form(this.values);
  readonly concealed = signal(false);
}

describe('Native form composition', () => {
  it('derives labels, required markers, hints and touched validation from the bound field', () => {
    const fixture = TestBed.createComponent(FieldHost);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.directive(DsyFormField));
    const input = fixture.debugElement.query(By.directive(DsyInput));
    expect(input.nativeElement.accessibilityLabel).toBe('Display name');
    expect(input.nativeElement.accessibilityHint).toBe('Use the name your team knows.');
    expect(wrapper.componentInstance.showError()).toBe(false);
    expect(wrapper.nativeElement.querySelector('label').text).toBe('Display name *');
    input.triggerEventHandler('blur', {});
    fixture.detectChanges();
    expect(wrapper.componentInstance.description()).toBe('Enter your name.');
    expect(input.nativeElement.accessibilityHint).toBe('Enter your name.');
    input.triggerEventHandler('textChange', { value: 'Maya', object: input.nativeElement });
    fixture.detectChanges();
    expect(wrapper.componentInstance.showError()).toBe(false);
    expect(input.nativeElement.accessibilityHint).toBe('Use the name your team knows.');
    fixture.componentInstance.override.set('Public display name');
    fixture.detectChanges();
    expect(input.nativeElement.accessibilityLabel).toBe('Public display name');
  });

  it('focuses the bound native control and collapses hidden fields', () => {
    const fixture = TestBed.createComponent(FieldHost);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.directive(DsyFormField));
    const input = fixture.debugElement.query(By.directive(DsyInput));
    const focus = vi.spyOn(input.nativeElement, 'focus');
    wrapper.componentInstance.focus();
    expect(focus).toHaveBeenCalledTimes(1);
    fixture.componentInstance.concealed.set(true);
    fixture.detectChanges();
    expect(wrapper.nativeElement.visibility).toBe('collapsed');
    expect(input.nativeElement.visibility).toBe('collapsed');
  });

  it('supports explicit helper/error presentation without taking form ownership', () => {
    const fixture = TestBed.createComponent(DsyFormField);
    fixture.componentRef.setInput('label', 'Code');
    fixture.componentRef.setInput('hint', 'Optional');
    fixture.detectChanges();
    expect(fixture.componentInstance.description()).toBe('Optional');
    fixture.componentRef.setInput('error', 'Code expired');
    fixture.detectChanges();
    expect(fixture.componentInstance.showError()).toBe(true);
    expect(fixture.componentInstance.description()).toBe('Code expired');
  });

  it('preserves projected field bindings and metadata through a fieldset', () => {
    const fixture = TestBed.createComponent(GroupedHost);
    fixture.detectChanges();
    const fieldset = fixture.debugElement.query(By.directive(DsyFieldset));
    const input = fixture.debugElement.query(By.directive(DsyInput));
    expect(input.nativeElement.text).toBe('Maya');
    expect(input.nativeElement.accessibilityLabel).toBe('Name');
    input.triggerEventHandler('textChange', { value: 'Alex', object: input.nativeElement });
    fixture.detectChanges();
    expect(fixture.componentInstance.values().name).toBe('Alex');
    fixture.componentInstance.concealed.set(true);
    fixture.detectChanges();
    expect(fieldset.nativeElement.visibility).toBe('collapsed');
    expect(fixture.componentInstance.values().name).toBe('Alex');
  });

  it('commits only a confirmed enabled select draft and touches the field on dismissal', () => {
    const { refs } = modalStub();
    const fixture = TestBed.createComponent(SelectHost);
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.directive(DsySelect))
      .componentInstance as DsySelect;
    expect(select.accessibleLabel()).toBe('Delivery region');
    select.open();
    fixture.detectChanges();
    expect(select.draft()).toBe('us');
    expect(refs).toHaveLength(1);
    select.choose(options[1]);
    fixture.detectChanges();
    expect(fixture.componentInstance.values().region).toBe('us');
    select.confirm();
    fixture.detectChanges();
    expect(fixture.componentInstance.values().region).toBe('ca');
    expect(fixture.componentInstance.fields.region().touched()).toBe(true);
    expect(select.opened()).toBe(false);
    select.open();
    fixture.detectChanges();
    select.choose(options[0]);
    select.close();
    fixture.detectChanges();
    expect(fixture.componentInstance.values().region).toBe('ca');
  });

  it('does not accept disabled options or unmatched values and preserves external form state', () => {
    const { refs } = modalStub();
    const fixture = TestBed.createComponent(SelectHost);
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.directive(DsySelect))
      .componentInstance as DsySelect;
    fixture.componentInstance.values.set({ region: 'unknown' });
    fixture.detectChanges();
    expect(select.selectedLabel()).toBe('Choose an option');
    select.open();
    fixture.detectChanges();
    select.choose(options[2]);
    expect(select.draft()).toBe('unknown');
    expect(select.canConfirm()).toBe(false);
    select.confirm();
    fixture.detectChanges();
    expect(refs[0].close).not.toHaveBeenCalled();
    expect(fixture.componentInstance.values().region).toBe('unknown');
    refs[0].close();
    fixture.detectChanges();
    expect(select.opened()).toBe(false);
  });

  it('handles cancellation before presentation and blocks an empty option list', () => {
    const { service } = modalStub();
    const fixture = TestBed.createComponent(DsySelect);
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
    const touched = vi.fn();
    fixture.componentInstance.touch.subscribe(touched);
    fixture.componentInstance.open();
    fixture.componentInstance.close();
    fixture.detectChanges();
    expect(fixture.componentInstance.opened()).toBe(false);
    expect(touched).toHaveBeenCalledTimes(1);
    expect(service.open).not.toHaveBeenCalled();
    fixture.componentRef.setInput('options', []);
    fixture.detectChanges();
    fixture.componentInstance.open();
    fixture.detectChanges();
    expect(fixture.componentInstance.isDisabled()).toBe(true);
    expect(service.open).not.toHaveBeenCalled();
  });

  for (const state of ['locked', 'viewing', 'concealed'] as const) {
    it(`closes a select and blocks edits while ${state}`, () => {
      const { refs, service } = modalStub();
      const fixture = TestBed.createComponent(SelectHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.directive(DsySelect))
        .componentInstance as DsySelect;
      select.open();
      fixture.detectChanges();
      fixture.componentInstance[state].set(true);
      fixture.detectChanges();
      expect(refs[0].close).toHaveBeenCalledTimes(1);
      expect(select.opened()).toBe(false);
      select.open();
      select.choose(options[1]);
      select.confirm();
      fixture.detectChanges();
      expect(service.open).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.values().region).toBe('us');
    });
  }
});
