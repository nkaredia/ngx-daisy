import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyStatus } from 'ngx-daisy/status';
export interface StatusExampleValues {
  readonly color?: ReturnType<DsyStatus['color']>;
  readonly size?: ReturnType<DsyStatus['size']>;
}
@Component({
  selector: 'demo-status-example',
  standalone: true,
  imports: [DsyStatus],
  templateUrl: './status-example.html',
  styleUrl: './status-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StatusExample {
  readonly values = input<readonly StatusExampleValues[]>([]);
  readonly props = computed<StatusExampleValues>(() => this.values()[0] ?? {});
}
