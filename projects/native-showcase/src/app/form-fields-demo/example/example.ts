import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyFormField } from '@ngx-daisy/native/form-field';
import { DsyInput } from '@ngx-daisy/native/input';
import { FormField, form, required } from '@angular/forms/signals';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-form-fields-preview',
  standalone: true,
  imports: [DsyFormField, DsyInput, FormField],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeFormFieldsPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  readonly profile = signal({ name: 'Alex Morgan' });
  readonly fields = form(this.profile, (path) => required(path.name));
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
