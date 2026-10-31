import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyThemeController } from '@ngx-daisy/native/theme-controller';
import { DSY_DARK_THEME } from '@ngx-daisy/core/theme';
import type { PlaygroundValues } from '../../playground/types';
@Component({
  selector: 'app-theme-controllers-preview',
  standalone: true,
  imports: [DsyThemeController],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeThemeControllersPreview {
  readonly values = input<PlaygroundValues>([]);
  readonly notice = signal('');
  readonly darkTheme = DSY_DARK_THEME;
  value(property: string, fallback?: any): any {
    const values = this.values()[0];
    return values && Object.hasOwn(values, property) ? values[property] : fallback;
  }
}
