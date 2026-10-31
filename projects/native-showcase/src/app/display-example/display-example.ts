import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyBadge } from '@ngx-daisy/native/badge';
import { DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions } from '@ngx-daisy/native/card';
import { DsyDivider } from '@ngx-daisy/native/divider';
import { DsyButton } from '@ngx-daisy/native/button';
@Component({
  selector: 'dsy-native-display-example',
  standalone: true,
  imports: [DsyBadge, DsyCard, DsyCardBody, DsyCardTitle, DsyCardActions, DsyDivider, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './display-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeDisplayExample {
  readonly family = input.required<'cards' | 'badges' | 'dividers'>();
  readonly saved = signal(false);
  readonly colors = [
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error',
  ] as const;
  readonly sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
  readonly variants = ['solid', 'outline', 'soft', 'ghost'] as const;
}
