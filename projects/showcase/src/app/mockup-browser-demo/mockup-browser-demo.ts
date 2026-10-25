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
import { DsyMockupBrowser, DsyBrowserToolbar } from '@ngx-daisy/cdk/mockup-browser';

@Component({
  selector: 'demo-mockup-browser-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyMockupBrowser, DsyBrowserToolbar],
  templateUrl: './mockup-browser-demo.html',
  styleUrl: './mockup-browser-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MockupBrowserDemo {
  readonly playground = playground;
  readonly clicks = signal(0);
  readonly increment = (n: number) => n + 1;
}
