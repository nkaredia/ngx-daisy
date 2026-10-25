import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DsySwap } from '@ngx-daisy/cdk/swap';
@Component({
  selector: 'demo-swap-demo',
  standalone: true,
  providers: providePlayground(playground),
  imports: [Playground, DsySwap, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './swap-demo.html',
  styleUrl: './swap-demo.scss',
})
export class SwapDemo {
  readonly playground = playground;
  readonly sound = signal(false);
  readonly formValue = signal(true);
  readonly disabled = signal(false);
}
