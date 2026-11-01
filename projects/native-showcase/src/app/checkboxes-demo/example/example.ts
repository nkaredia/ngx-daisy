import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyCheckbox } from '@ngx-daisy/native/checkbox';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-checkboxes-preview',
  standalone: true,
  imports: [DsyCheckbox],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeCheckboxesPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
