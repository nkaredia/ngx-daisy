import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsySelect } from '@ngx-daisy/native/select';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-selects-preview',
  standalone: true,
  imports: [DsySelect],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeSelectsPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  readonly options = [
    { value: 'us', label: 'United States', description: 'Delivery in 3–5 days' },
    { value: 'ca', label: 'Canada', description: 'Delivery in 5–7 days' },
  ];
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
