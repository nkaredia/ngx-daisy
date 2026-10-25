import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { playground } from './playground';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect,
} from '@angular/core';
import { DsyAura } from 'ngx-daisy/aura';

@Component({
  selector: 'demo-aura-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyAura],
  templateUrl: './aura-demo.html',
  styleUrl: './aura-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AuraDemo {
  readonly playground = playground;
}
