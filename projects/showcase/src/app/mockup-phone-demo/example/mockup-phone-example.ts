import { LucideCircle } from '@lucide/angular';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { DsyMockupPhone } from '@ngx-daisy/cdk/mockup-phone';
import { DsyButton } from '@ngx-daisy/cdk/button';

interface MockupPhoneValues {
  readonly displayClass?: ReturnType<DsyMockupPhone['displayClass']>;
  readonly cameraClass?: ReturnType<DsyMockupPhone['cameraClass']>;
}

@Component({
  selector: 'demo-mockup-phone-example',
  standalone: true,
  imports: [LucideCircle, DsyMockupPhone, DsyButton],
  templateUrl: './mockup-phone-example.html',
  styleUrl: './mockup-phone-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MockupPhoneExample {
  readonly values = input<readonly [MockupPhoneValues?]>([]);
  readonly props = computed<MockupPhoneValues>(() => this.values()[0] ?? {});
  readonly saved = signal(false);
  readonly toggle = (value: boolean) => !value;
}
