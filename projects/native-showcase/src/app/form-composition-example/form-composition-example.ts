import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { FormField, email, form, required } from '@angular/forms/signals';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { DsyFormField } from '@ngx-daisy/native/form-field';
import { DsyFieldset } from '@ngx-daisy/native/fieldset';
import { DsySelect, type DsySelectOption } from '@ngx-daisy/native/select';
import { DsyInput } from '@ngx-daisy/native/input';
import { DsyToggle } from '@ngx-daisy/native/toggle';
import { DsyButton } from '@ngx-daisy/native/button';
@Component({
  selector: 'dsy-native-form-composition-example',
  standalone: true,
  imports: [
    NativeScriptCommonModule,
    FormField,
    DsyFormField,
    DsyFieldset,
    DsySelect,
    DsyInput,
    DsyToggle,
    DsyButton,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './form-composition-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeFormCompositionExample {
  readonly family = input<'selects' | 'form-fields' | 'fieldsets'>('selects');
  readonly profile = signal({
    name: '',
    email: 'maya@example.com',
    region: 'us',
    city: 'Austin',
    updates: true,
  });
  readonly fields = form(this.profile, (path) => {
    required(path.name, { message: 'Tell us what your teammates should call you.' });
    required(path.email, { message: 'Enter your email address.' });
    email(path.email, { message: 'Use a valid email address, such as maya@example.com.' });
    required(path.region, { message: 'Choose a delivery region.' });
  });
  readonly regions: readonly DsySelectOption[] = [
    { value: 'us', label: 'United States', description: 'Standard delivery in 3–5 business days.' },
    { value: 'ca', label: 'Canada', description: 'Tracked delivery in 5–8 business days.' },
    { value: 'eu', label: 'Europe', description: 'Tracked delivery in 7–10 business days.' },
    {
      value: 'other',
      label: 'More destinations',
      description: 'Coming soon. Join our updates for new locations.',
      disabled: true,
    },
  ];
  readonly message = signal('Your changes stay in this demo.');
  save(): void {
    this.fields.name().markAsTouched();
    this.fields.email().markAsTouched();
    this.fields.region().markAsTouched();
    const valid =
      this.family() === 'form-fields'
        ? this.fields.name().valid() && this.fields.email().valid()
        : this.fields.email().valid() && this.fields.region().valid();
    this.message.set(valid ? 'Preferences saved for this demo.' : 'Check the highlighted fields.');
  }
  clearRegion(): void {
    this.profile.update((value) => ({ ...value, region: '' }));
    this.fields.region().markAsTouched();
  }
}
