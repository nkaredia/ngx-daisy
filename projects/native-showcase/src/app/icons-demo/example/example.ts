import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyIcon } from '@ngx-daisy/native/icon';
import { Star } from 'lucide';
import { lucideArtwork } from '../../icons/svg-artwork';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-icons-preview',
  standalone: true,
  imports: [DsyIcon],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeIconsPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  readonly artwork = lucideArtwork(Star);
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
