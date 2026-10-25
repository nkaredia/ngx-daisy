import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { DsyMockupWindow } from 'ngx-daisy/mockup-window';
import { DsyInput } from 'ngx-daisy/input';
import { DsyButton } from 'ngx-daisy/button';

@Component({
  selector: 'demo-mockup-window-example',
  standalone: true,
  imports: [DsyMockupWindow, DsyInput, DsyButton],
  templateUrl: './mockup-window-example.html',
  styleUrl: './mockup-window-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MockupWindowExample {
  readonly values = input<readonly [Record<string, never>?]>([]);
}
