import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  computed,
  inject,
  booleanAttribute,
  signal,
  Injector,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
export interface DsyTableSort {
  active: string;
  direction: 'asc' | 'desc' | '';
}
/** Client-side data source. Use a custom CDK DataSource for server-side paging. */
export class DsyTableDataSource<T> extends DataSource<T> {
  readonly data = signal<readonly T[]>([]);
  readonly filter = signal('');
  readonly sort = signal<DsyTableSort>({ active: '', direction: '' });
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly filterPredicate = signal<(row: T, filter: string) => boolean>((row, filter) =>
    Object.values(row as object)
      .join(' ')
      .toLocaleLowerCase()
      .includes(filter),
  );
  readonly sortingDataAccessor = signal<
    (row: T, key: string) => string | number | null | undefined
  >((row, key) => (row as Record<string, string | number>)[key]);
  readonly filteredData = computed(() => {
    const f = this.filter().trim().toLocaleLowerCase();
    return f ? this.data().filter((row) => this.filterPredicate()(row, f)) : [...this.data()];
  });
  readonly filteredCount = computed(() => this.filteredData().length);
  readonly effectivePageSize = computed(() =>
    Number.isFinite(this.pageSize()) ? Math.max(1, Math.floor(this.pageSize()) || 1) : 1,
  );
  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredCount() / this.effectivePageSize())),
  );
  readonly effectivePageIndex = computed(() =>
    Math.max(0, Math.min(this.pageCount() - 1, Math.floor(this.pageIndex()) || 0)),
  );
  readonly rows = computed(() => {
    const rows = [...this.filteredData()],
      sort = this.sort(),
      accessor = this.sortingDataAccessor();
    if (sort.direction && sort.active)
      rows.sort((a, b) => {
        const x = accessor(a, sort.active) ?? '',
          y = accessor(b, sort.active) ?? '';
        return (
          (typeof x === 'number' && typeof y === 'number'
            ? x - y
            : String(x).localeCompare(String(y))) * (sort.direction === 'asc' ? 1 : -1)
        );
      });
    const start = this.effectivePageIndex() * this.effectivePageSize();
    return rows.slice(start, start + this.effectivePageSize());
  });
  private readonly stream: Observable<readonly T[]>;
  constructor(data: readonly T[] = [], injector: Injector = inject(Injector)) {
    super();
    this.data.set(data);
    this.stream = toObservable(this.rows, { injector });
  }
  connect(_viewer?: CollectionViewer): Observable<readonly T[]> {
    return this.stream;
  }
  disconnect() {}
}
@Directive({ selector: 'table[dsyTable]', host: { '[class]': 'classes()' } })
export class DsyTable {
  private readonly daisy = injectDaisyUIClasses();
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly zebra = input(false, { transform: booleanAttribute });
  readonly pinRows = input(false, { transform: booleanAttribute });
  readonly pinCols = input(false, { transform: booleanAttribute });
  readonly classes = computed(() =>
    this.daisy(
      'table',
      { xs: 'table-xs', sm: 'table-sm', md: 'table-md', lg: 'table-lg', xl: 'table-xl' }[
        this.size()
      ],
      this.zebra() ? 'table-zebra' : '',
      this.pinRows() ? 'table-pin-rows' : '',
      this.pinCols() ? 'table-pin-cols' : '',
    ),
  );
}
@Directive({ selector: '[dsySort]', exportAs: 'dsySort' })
export class DsySort {
  readonly active = model('');
  readonly direction = model<'asc' | 'desc' | ''>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  toggle(key: string) {
    if (this.disabled()) return;
    this.direction.set(
      this.active() !== key
        ? 'asc'
        : this.direction() === 'asc'
          ? 'desc'
          : this.direction() === 'desc'
            ? ''
            : 'asc',
    );
    this.active.set(key);
  }
}
@Component({
  selector: 'th[dsySortHeader]',
  template: `<button type="button" [disabled]="sort.disabled()" (click)="sort.toggle(key())">
    <ng-content />
    <span aria-hidden="true">{{
      sort.active() === key()
        ? sort.direction() === 'asc'
          ? '↑'
          : sort.direction() === 'desc'
            ? '↓'
            : '↕'
        : '↕'
    }}</span>
  </button>`,
  host: {
    '[attr.aria-sort]':
      'sort.active()===key() && sort.direction() ? (sort.direction()==="asc"?"ascending":"descending") : "none"',
  },
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsySortHeader {
  readonly sort = inject(DsySort);
  readonly key = input.required<string>({ alias: 'dsySortHeader' });
}

@Directive({ selector: 'tr[dsyTableRow]', standalone: true, host: { '[class]': 'classes()' } })
export class DsyTableRow {
  readonly hover = input(false, { transform: booleanAttribute });
  private readonly daisy = injectDaisyUIClasses();
  readonly classes = computed(() => (this.hover() ? this.daisy('row-hover') : ''));
}
