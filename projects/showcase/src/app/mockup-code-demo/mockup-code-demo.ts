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
import { DsyMockupCode, DsyCodeLine } from 'ngx-daisy/mockup-code';

@Component({
  selector: 'demo-mockup-code-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyMockupCode, DsyCodeLine],
  templateUrl: './mockup-code-demo.html',
  styleUrl: './mockup-code-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MockupCodeDemo {
  readonly playground = playground;
}
