import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { DsyAlert } from '@ngx-daisy/native/alert';
import { DsyProgress } from '@ngx-daisy/native/progress';
import { DsySkeleton } from '@ngx-daisy/native/skeleton';
import { DsyCard, DsyCardBody, DsyCardTitle } from '@ngx-daisy/native/card';
import { DsyButton } from '@ngx-daisy/native/button';
@Component({
  selector: 'dsy-native-feedback-example',
  standalone: true,
  imports: [DsyAlert, DsyProgress, DsySkeleton, DsyCard, DsyCardBody, DsyCardTitle, DsyButton],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './feedback-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NativeFeedbackExample {
  readonly family = input.required<'alerts' | 'progress' | 'skeletons'>();
  readonly restored = signal(false);
  readonly progress = signal(35);
  readonly loaded = signal(false);
  readonly animate = signal(true);
  readonly statuses = [
    {
      color: 'info',
      title: 'A little heads-up',
      message: 'Your next invoice will be ready on November 1.',
    },
    {
      color: 'success',
      title: 'Changes saved',
      message: 'Your workspace is up to date across all devices.',
    },
    {
      color: 'warning',
      title: 'Almost at your limit',
      message: 'You have used 85% of your storage. Make room before your next upload.',
    },
    {
      color: 'error',
      title: 'Payment needs attention',
      message: 'Update your payment method to keep your subscription active.',
    },
  ] as const;
  advance(): void {
    this.progress.update((value) => Math.min(100, value + 15));
  }
}
