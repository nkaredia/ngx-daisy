import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyDiff } from 'ngx-daisy/diff';
export interface DiffExampleValues {
  readonly position?: ReturnType<DsyDiff['position']>;
  readonly label?: ReturnType<DsyDiff['label']>;
  readonly disabled?: ReturnType<DsyDiff['disabled']>;
  readonly stageClass?: ReturnType<DsyDiff['stageClass']>;
  readonly sliderClass?: ReturnType<DsyDiff['sliderClass']>;
}
@Component({
  selector: 'demo-diff-example',
  standalone: true,
  imports: [DsyDiff],
  templateUrl: './diff-example.html',
  styleUrl: './diff-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DiffExample {
  readonly values = input<readonly DiffExampleValues[]>([]);
  readonly props = computed<DiffExampleValues>(() => this.values()[0] ?? {});
}
