import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyAura } from '@ngx-daisy/cdk/aura';
import { DsyButton } from '@ngx-daisy/cdk/button';
export interface AuraExampleValues {
  readonly preset?: ReturnType<DsyAura['preset']>;
  readonly size?: ReturnType<DsyAura['size']>;
  readonly dual?: ReturnType<DsyAura['dual']>;
  readonly glow?: ReturnType<DsyAura['glow']>;
}
@Component({
  selector: 'demo-aura-example',
  standalone: true,
  imports: [DsyAura, DsyButton],
  templateUrl: './aura-example.html',
  styleUrl: './aura-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AuraExample {
  readonly values = input<readonly AuraExampleValues[]>([]);
  readonly props = computed<AuraExampleValues>(() => this.values()[0] ?? {});
}
