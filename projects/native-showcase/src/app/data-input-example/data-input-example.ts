import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { FormField, email, form, minLength, required } from '@angular/forms/signals';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { DsyInput } from '@ngx-daisy/native/input';
import { DsyTextarea } from '@ngx-daisy/native/textarea';
import { DsyToggle } from '@ngx-daisy/native/toggle';
import { DsyButton } from '@ngx-daisy/native/button';
@Component({
  selector: 'dsy-native-data-input-example',
  standalone: true,
  imports: [NativeScriptCommonModule, FormField, DsyInput, DsyTextarea, DsyToggle, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './data-input-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeDataInputExample {
  readonly family = input<'inputs' | 'textareas' | 'toggles'>('inputs');
  readonly profile = signal({
    name: 'Maya Chen',
    email: 'maya@example.com',
    bio: 'Designer, weekend explorer, and collector of good ideas.',
    updates: true,
    reminders: false,
  });
  readonly fields = form(this.profile, (path) => {
    required(path.name, { message: 'Enter your display name.' });
    email(path.email, { message: 'Enter a valid email address.' });
    required(path.email, { message: 'Enter your email address.' });
    minLength(path.bio, 12, { message: 'Tell us a little more (at least 12 characters).' });
  });
  readonly message = signal('Your changes stay in this demo.');
  save(): void {
    const field = this.family() === 'textareas' ? this.fields.bio : this.fields.name;
    field().markAsTouched();
    if (this.family() === 'inputs') this.fields.email().markAsTouched();
    const valid =
      this.family() === 'textareas'
        ? this.fields.bio().valid()
        : this.fields.name().valid() && this.fields.email().valid();
    this.message.set(valid ? 'Profile saved for this demo.' : 'Check the highlighted fields.');
  }
}
