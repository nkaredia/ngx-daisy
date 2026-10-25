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
import { DsyBreadcrumbs } from 'ngx-daisy/breadcrumbs';

@Component({
  selector: 'demo-breadcrumbs-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyBreadcrumbs],
  templateUrl: './breadcrumbs-demo.html',
  styleUrl: './breadcrumbs-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbsDemo {
  readonly playground = playground;
}
