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
import { DsyPagination } from 'ngx-daisy/pagination';

@Component({
  selector: 'demo-pagination-demo',
  providers: providePlayground(playground),
  imports: [Playground, DsyPagination],
  templateUrl: './pagination-demo.html',
  styleUrl: './pagination-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PaginationDemo {
  readonly playground = playground;
  readonly page = signal(0);
  readonly changes = signal(0);
  readonly increment = (n: number) => n + 1;
}
