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
import { DsyLink } from 'ngx-daisy/link';

@Component({
  selector: 'demo-link-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyLink],
  templateUrl: './link-demo.html',
  styleUrl: './link-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LinkDemo {
  readonly playground = playground;
}
