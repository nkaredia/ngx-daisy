import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { DsyMockupPhone } from 'ngx-daisy/mockup-phone';

@Component({
  selector: 'demo-mockup-phone-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyMockupPhone],
  templateUrl: './mockup-phone-demo.html',
  styleUrl: './mockup-phone-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MockupPhoneDemo {
  readonly playground = playground;
  readonly saved = signal(false);
  readonly toggle = (v: boolean) => !v;
}
