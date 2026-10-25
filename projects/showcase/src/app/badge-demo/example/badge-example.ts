import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyBadge } from 'ngx-daisy/badge';
export interface BadgeExampleValues {
  readonly color?: ReturnType<DsyBadge['color']>;
  readonly size?: ReturnType<DsyBadge['size']>;
  readonly variant?: ReturnType<DsyBadge['variant']>;
}
@Component({
  selector: 'demo-badge-example',
  standalone: true,
  imports: [DsyBadge],
  templateUrl: './badge-example.html',
  styleUrl: './badge-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BadgeExample {
  readonly values = input<readonly BadgeExampleValues[]>([]);
  readonly props = computed<BadgeExampleValues>(() => this.values()[0] ?? {});
}
