import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  ViewEncapsulation,
} from '@angular/core';
import { DsySwap } from 'ngx-daisy/swap';

interface SwapValues {
  readonly checked?: ReturnType<DsySwap['checked']>;
  readonly indeterminate?: ReturnType<DsySwap['indeterminate']>;
  readonly disabled?: ReturnType<DsySwap['disabled']>;
  readonly animation?: ReturnType<DsySwap['animation']>;
  readonly label?: ReturnType<DsySwap['label']>;
  readonly color?: ReturnType<DsySwap['color']>;
  readonly size?: ReturnType<DsySwap['size']>;
  readonly variant?: ReturnType<DsySwap['variant']>;
  readonly buttonClass?: ReturnType<DsySwap['buttonClass']>;
}

@Component({
  selector: 'demo-swap-example',
  imports: [DsySwap],
  templateUrl: './swap-example.html',
  styleUrl: './swap-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SwapExample {
  readonly values = input<readonly SwapValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  private readonly configuredChecked = computed(() => this.props().checked ?? false);
  readonly checked = linkedSignal(() => this.configuredChecked());
  private readonly configuredIndeterminate = computed(() => this.props().indeterminate ?? false);
  readonly indeterminate = linkedSignal(() => this.configuredIndeterminate());
}
