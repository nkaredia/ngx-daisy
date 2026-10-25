import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyCheckbox } from '@ngx-daisy/cdk/checkbox';

interface ExampleValues {
  readonly color?: ReturnType<DsyCheckbox['color']>;
  readonly size?: ReturnType<DsyCheckbox['size']>;
  readonly indeterminate?: ReturnType<DsyCheckbox['indeterminate']>;
}

@Component({
  selector: 'demo-checkbox-example',
  standalone: true,
  imports: [DsyCheckbox],
  templateUrl: './checkbox-example.html',
  styleUrl: './checkbox-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CheckboxExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly checked = signal(false);
  readonly externalIndeterminate = computed(() => this.props().indeterminate ?? false);
  readonly indeterminate = signal(false);
  constructor() {
    effect(() => this.indeterminate.set(this.externalIndeterminate()));
  }
}
