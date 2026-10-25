import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyMask } from '@ngx-daisy/cdk/mask';

interface MaskValues {
  readonly shape?: ReturnType<DsyMask['shape']>;
  readonly half?: ReturnType<DsyMask['half']>;
}

@Component({
  selector: 'demo-mask-example',
  standalone: true,
  imports: [DsyMask],
  templateUrl: './mask-example.html',
  styleUrl: './mask-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MaskExample {
  readonly values = input<readonly [MaskValues?]>([]);
  readonly props = computed<MaskValues>(() => this.values()[0] ?? {});
}
