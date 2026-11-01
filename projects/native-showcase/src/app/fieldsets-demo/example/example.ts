import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyFieldset } from '@ngx-daisy/native/fieldset';
import { DsyInput } from '@ngx-daisy/native/input';
import { DsyToggle } from '@ngx-daisy/native/toggle';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-fieldsets-preview',
  standalone: true,
  imports: [DsyFieldset, DsyInput, DsyToggle],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeFieldsetsPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
