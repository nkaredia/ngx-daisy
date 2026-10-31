import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyProgress } from '@ngx-daisy/native/progress';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-progress-preview',
  standalone: true,
  imports: [DsyProgress],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeProgressPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
