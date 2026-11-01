import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyAlert } from '@ngx-daisy/native/alert';
import { DsyButton } from '@ngx-daisy/native/button';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-alerts-preview',
  standalone: true,
  imports: [DsyAlert, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeAlertsPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
