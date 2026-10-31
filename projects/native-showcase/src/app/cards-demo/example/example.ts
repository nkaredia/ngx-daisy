import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions } from '@ngx-daisy/native/card';
import { DsyButton } from '@ngx-daisy/native/button';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-cards-preview',
  standalone: true,
  imports: [DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeCardsPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
