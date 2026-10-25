import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyIcon } from '@ngx-daisy/cdk/icon';
import { LucideHouse } from '@lucide/angular';
export interface IconExampleValues {
  readonly size?: ReturnType<DsyIcon['size']>;
  readonly color?: ReturnType<DsyIcon['color']>;
  readonly label?: ReturnType<DsyIcon['label']>;
}
@Component({
  selector: 'demo-icon-example',
  standalone: true,
  imports: [DsyIcon, LucideHouse],
  templateUrl: './icon-example.html',
  styleUrl: './icon-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class IconExample {
  readonly values = input<readonly IconExampleValues[]>([]);
  readonly props = computed<IconExampleValues>(() => this.values()[0] ?? {});
}
