import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyTable, DsyTableRow } from '@ngx-daisy/cdk/table';
export interface TableExampleValues {
  readonly size?: ReturnType<DsyTable['size']>;
  readonly zebra?: ReturnType<DsyTable['zebra']>;
  readonly pinRows?: ReturnType<DsyTable['pinRows']>;
  readonly pinCols?: ReturnType<DsyTable['pinCols']>;
}
export interface TableRowExampleValues {
  readonly hover?: ReturnType<DsyTableRow['hover']>;
}
@Component({
  selector: 'demo-table-example',
  standalone: true,
  imports: [DsyTable, DsyTableRow],
  templateUrl: './table-example.html',
  styleUrl: './table-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableExample {
  readonly values = input<readonly [TableExampleValues?, TableRowExampleValues?]>([]);
  readonly props = computed<TableExampleValues>(() => this.values()[0] ?? {});
  readonly row = computed<TableRowExampleValues>(() => this.values()[1] ?? {});
  readonly people = [
    { name: 'Alex Morgan', role: 'Designer', tasks: 12 },
    { name: 'Taylor Kim', role: 'Engineer', tasks: 18 },
    { name: 'Sam Lee', role: 'Researcher', tasks: 12 },
    { name: 'Jordan Patel', role: 'Engineer', tasks: 8 },
    { name: 'Casey Chen', role: 'Designer', tasks: 9 },
    { name: 'Riley Davis', role: 'Researcher', tasks: 6 },
    { name: 'Jamie Rivera', role: 'Engineer', tasks: 14 },
    { name: 'Morgan Hall', role: 'Designer', tasks: 7 },
  ];
  readonly taskTotal = this.people.reduce((total, person) => total + person.tasks, 0);
}
