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
import {
  DsyTable,
  DsyTableRow,
  DsyTableDataSource,
  DsySort,
  DsySortHeader,
  CdkTable,
  CdkColumnDef,
  CdkCellDef,
  CdkHeaderCellDef,
  CdkRowDef,
  CdkHeaderRowDef,
  CdkCell,
  CdkHeaderCell,
  CdkRow,
  CdkHeaderRow,
  CdkNoDataRow,
} from '@ngx-daisy/cdk/table';

@Component({
  selector: 'demo-table-demo',
  providers: providePlayground(playground),
  imports: [
    Playground,
    DsyTable,
    DsyTableRow,
    DsySort,
    DsySortHeader,
    CdkTable,
    CdkColumnDef,
    CdkCellDef,
    CdkHeaderCellDef,
    CdkRowDef,
    CdkHeaderRowDef,
    CdkCell,
    CdkHeaderCell,
    CdkRow,
    CdkHeaderRow,
    CdkNoDataRow,
  ],
  templateUrl: './table-demo.html',
  styleUrl: './table-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableDemo {
  readonly playground = playground;
  readonly columns = ['name', 'role', 'tasks'];
  readonly source = new DsyTableDataSource([
    { name: 'Alex Morgan', role: 'Designer', tasks: 14 },
    { name: 'Taylor Kim', role: 'Engineer', tasks: 23 },
    { name: 'Sam Lee', role: 'Product lead', tasks: 9 },
    { name: 'Jordan Park', role: 'Engineer', tasks: 18 },
    { name: 'Casey Rivera', role: 'Researcher', tasks: 11 },
    { name: 'Morgan Reed', role: 'Designer', tasks: 16 },
  ]);
  constructor() {
    this.source.pageSize.set(4);
  }
  search(value: string) {
    this.source.filter.set(value);
    this.source.pageIndex.set(0);
  }
}
