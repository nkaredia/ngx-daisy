import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyHover3d } from '@ngx-daisy/cdk/hover-3d';
import { DsyButton } from '@ngx-daisy/cdk/button';
export interface Hover3dExampleValues {
  readonly disabled?: ReturnType<DsyHover3d['disabled']>;
}
@Component({
  selector: 'demo-hover-3d-example',
  standalone: true,
  imports: [DsyHover3d, DsyButton],
  templateUrl: './hover-3d-example.html',
  styleUrl: './hover-3d-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Hover3DExample {
  readonly values = input<readonly Hover3dExampleValues[]>([]);
  readonly props = computed<Hover3dExampleValues>(() => this.values()[0] ?? {});
  readonly saved = signal(false);
  readonly toggle = (value: boolean) => !value;
}
