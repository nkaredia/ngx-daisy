import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyLoader } from '@ngx-daisy/cdk/loader';
import { DsyButton } from '@ngx-daisy/cdk/button';

interface ExampleValues {
  readonly variant?: ReturnType<DsyLoader['variant']>;
  readonly placement?: ReturnType<DsyLoader['placement']>;
  readonly size?: ReturnType<DsyLoader['size']>;
  readonly color?: ReturnType<DsyLoader['color']>;
  readonly animation?: ReturnType<DsyLoader['animation']>;
  readonly speed?: ReturnType<DsyLoader['speed']>;
  readonly active?: ReturnType<DsyLoader['active']>;
  readonly showLabel?: ReturnType<DsyLoader['showLabel']>;
  readonly label?: ReturnType<DsyLoader['label']>;
  readonly value?: ReturnType<DsyLoader['value']>;
}

@Component({
  selector: 'demo-loader-example',
  standalone: true,
  imports: [DsyLoader, DsyButton],
  templateUrl: './loader-example.html',
  styleUrl: './loader-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoaderExample {
  readonly values = input<readonly ExampleValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  readonly launched = signal(false);
  readonly isActive = computed(
    () =>
      (this.props().active ?? true) &&
      ((this.props().placement ?? 'inline') === 'inline' || this.launched()),
  );
  readonly progress = computed(() => {
    const props = this.props();
    return props.variant === 'ring' || props.variant === 'bar' ? (props.value ?? null) : null;
  });
}
