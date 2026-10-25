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
import { DsySkeleton } from 'ngx-daisy/skeleton';

@Component({
  providers: providePlayground(playground),
  selector: 'demo-skeleton-demo',
  imports: [Playground, DsySkeleton],
  templateUrl: './skeleton-demo.html',
  styleUrl: './skeleton-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SkeletonDemo {
  readonly playground = playground;
  readonly loading = signal(true);
  readonly toggle = (v: boolean) => !v;
}
