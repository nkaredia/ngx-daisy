import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';
import { DsyFab, DsyFabTrigger, DsyFabAction, DsyFabClose } from '@ngx-daisy/cdk/fab';

interface FabValues {
  readonly opened?: ReturnType<DsyFab['opened']>;
  readonly layout?: ReturnType<DsyFab['layout']>;
  readonly position?: ReturnType<DsyFab['position']>;
  readonly corner?: ReturnType<DsyFab['corner']>;
  readonly radius?: ReturnType<DsyFab['radius']>;
  readonly openOnFocus?: ReturnType<DsyFab['openOnFocus']>;
  readonly id?: ReturnType<DsyFab['id']>;
  readonly label?: ReturnType<DsyFab['label']>;
}

@Component({
  selector: 'demo-fab-example',
  imports: [DsyFab, DsyButton, DsyFabTrigger, DsyFabAction, DsyFabClose],
  templateUrl: './fab-example.html',
  styleUrl: './fab-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FabExample {
  readonly values = input<readonly FabValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  private readonly configuredOpened = computed(() => this.props().opened ?? false);
  readonly opened = linkedSignal(() => this.configuredOpened());
  readonly action = signal('Choose an action');
}
