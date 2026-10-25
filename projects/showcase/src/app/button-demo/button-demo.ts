import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { InlinePreviewShell } from '../playground/inline-preview-shell';
import { providePlayground } from '../playground/provide-playground';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Playground, InlinePreviewShell],
  providers: providePlayground(playground),
  selector: 'demo-button-demo',
  styleUrl: './button-demo.scss',
  templateUrl: './button-demo.html',
})
export class ButtonDemo {
  readonly playground = playground;
}
