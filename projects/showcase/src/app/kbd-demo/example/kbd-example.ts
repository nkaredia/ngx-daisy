import { LucidePlus } from '@lucide/angular';
import { LucideSearch } from '@lucide/angular';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyKbd } from '@ngx-daisy/cdk/kbd';
export interface KbdExampleValues {
  readonly size?: ReturnType<DsyKbd['size']>;
}
@Component({
  selector: 'demo-kbd-example',
  standalone: true,
  imports: [LucidePlus, LucideSearch, DsyKbd],
  templateUrl: './kbd-example.html',
  styleUrl: './kbd-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class KbdExample {
  readonly values = input<readonly KbdExampleValues[]>([]);
  readonly props = computed<KbdExampleValues>(() => this.values()[0] ?? {});
}
