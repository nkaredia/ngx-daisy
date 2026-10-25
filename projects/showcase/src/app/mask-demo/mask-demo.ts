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
import { DsyMask } from '@ngx-daisy/cdk/mask';

@Component({
  selector: 'demo-mask-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyMask],
  templateUrl: './mask-demo.html',
  styleUrl: './mask-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MaskDemo {
  readonly playground = playground;
}
