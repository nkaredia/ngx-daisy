import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyLink } from '@ngx-daisy/cdk/link';

interface LinkValues {
  readonly color?: ReturnType<DsyLink['color']>;
  readonly hover?: ReturnType<DsyLink['hover']>;
  readonly disabled?: ReturnType<DsyLink['disabled']>;
  readonly active?: ReturnType<DsyLink['active']>;
}

@Component({
  selector: 'demo-link-example',
  standalone: true,
  imports: [DsyLink],
  templateUrl: './link-example.html',
  styleUrl: './link-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LinkExample {
  readonly values = input<readonly [LinkValues?]>([]);
  readonly props = computed<LinkValues>(() => this.values()[0] ?? {});
}
