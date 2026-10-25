import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyAlert } from 'ngx-daisy/alert';

interface ExampleValues {
  readonly color?: ReturnType<DsyAlert['color']>;
  readonly variant?: ReturnType<DsyAlert['variant']>;
  readonly orientation?: ReturnType<DsyAlert['orientation']>;
  readonly announcement?: ReturnType<DsyAlert['announcement']>;
}

@Component({
  selector: 'demo-alert-example',
  standalone: true,
  imports: [DsyAlert],
  templateUrl: './alert-example.html',
  styleUrl: './alert-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AlertExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
}
