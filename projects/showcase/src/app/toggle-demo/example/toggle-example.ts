import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyToggle } from '@ngx-daisy/cdk/toggle';

interface ExampleValues {
  readonly color?: ReturnType<DsyToggle['color']>;
  readonly size?: ReturnType<DsyToggle['size']>;
}

@Component({
  selector: 'demo-toggle-example',
  standalone: true,
  imports: [DsyToggle],
  templateUrl: './toggle-example.html',
  styleUrl: './toggle-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ToggleExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly checked = signal(false);
}
