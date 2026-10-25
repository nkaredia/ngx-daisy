import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyDivider } from 'ngx-daisy/divider';

interface DividerValues {
  readonly color?: ReturnType<DsyDivider['color']>;
  readonly orientation?: ReturnType<DsyDivider['orientation']>;
  readonly align?: ReturnType<DsyDivider['align']>;
}

@Component({
  selector: 'demo-divider-example',
  standalone: true,
  imports: [DsyDivider],
  templateUrl: './divider-example.html',
  styleUrl: './divider-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DividerExample {
  readonly values = input<readonly [DividerValues?]>([]);
  readonly props = computed<DividerValues>(() => this.values()[0] ?? {});
}
