import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import {
  DsyDropdown,
  DsyDropdownTrigger,
  DsyDropdownContent,
  DsyDropdownItem,
} from '@ngx-daisy/native/dropdown';
import { DsyButton } from '@ngx-daisy/native/button';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-dropdowns-preview',
  standalone: true,
  imports: [DsyDropdown, DsyDropdownTrigger, DsyDropdownContent, DsyDropdownItem, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeDropdownsPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
