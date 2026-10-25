import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { DsyMockupBrowser, DsyBrowserToolbar } from '@ngx-daisy/cdk/mockup-browser';
import { DsyButton } from '@ngx-daisy/cdk/button';

@Component({
  selector: 'demo-mockup-browser-example',
  standalone: true,
  imports: [DsyMockupBrowser, DsyBrowserToolbar, DsyButton],
  templateUrl: './mockup-browser-example.html',
  styleUrl: './mockup-browser-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MockupBrowserExample {
  readonly values = input<readonly [Record<string, never>?, Record<string, never>?]>([]);
  readonly clicks = signal(0);
  readonly increment = (value: number) => value + 1;
}
