import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyStats, DsyStat, DsyStatTitle, DsyStatValue, DsyStatDesc } from '@ngx-daisy/cdk/stat';
export interface StatsExampleValues {
  readonly orientation?: ReturnType<DsyStats['orientation']>;
}
@Component({
  selector: 'demo-stat-example',
  standalone: true,
  imports: [DsyStats, DsyStat, DsyStatTitle, DsyStatValue, DsyStatDesc],
  templateUrl: './stat-example.html',
  styleUrl: './stat-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StatExample {
  readonly values = input<readonly StatsExampleValues[]>([]);
  readonly props = computed<StatsExampleValues>(() => this.values()[0] ?? {});
}
