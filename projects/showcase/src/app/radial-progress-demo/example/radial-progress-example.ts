import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyRadialProgress } from 'ngx-daisy/radial-progress';

interface ExampleValues {
  readonly color?: ReturnType<DsyRadialProgress['color']>;
  readonly value?: ReturnType<DsyRadialProgress['value']>;
  readonly size?: ReturnType<DsyRadialProgress['size']>;
  readonly thickness?: ReturnType<DsyRadialProgress['thickness']>;
  readonly label?: ReturnType<DsyRadialProgress['label']>;
}

@Component({
  selector: 'demo-radial-progress-example',
  standalone: true,
  imports: [DsyRadialProgress],
  templateUrl: './radial-progress-example.html',
  styleUrl: './radial-progress-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RadialProgressExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
}
