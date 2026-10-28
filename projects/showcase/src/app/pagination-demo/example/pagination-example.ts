import { LucideSearch } from '@lucide/angular';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  linkedSignal,
} from '@angular/core';
import { DsyPagination } from '@ngx-daisy/cdk/pagination';

interface PaginationValues {
  readonly pageIndex?: ReturnType<DsyPagination['pageIndex']>;
  readonly pageSize?: ReturnType<DsyPagination['pageSize']>;
  readonly length?: ReturnType<DsyPagination['length']>;
  readonly disabled?: ReturnType<DsyPagination['disabled']>;
  readonly size?: ReturnType<DsyPagination['size']>;
  readonly label?: ReturnType<DsyPagination['label']>;
  readonly previousLabel?: ReturnType<DsyPagination['previousLabel']>;
  readonly nextLabel?: ReturnType<DsyPagination['nextLabel']>;
  readonly pageLabel?: ReturnType<DsyPagination['pageLabel']>;
}

@Component({
  selector: 'demo-pagination-example',
  standalone: true,
  imports: [LucideSearch, DsyPagination],
  templateUrl: './pagination-example.html',
  styleUrl: './pagination-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PaginationExample {
  readonly values = input<readonly [PaginationValues?]>([]);
  readonly props = computed<PaginationValues>(() => this.values()[0] ?? {});
  readonly configuredPageIndex = computed(() => this.props().pageIndex ?? 0);
  readonly pageIndex = linkedSignal(() => this.configuredPageIndex());
}
