import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DsyButton } from 'ngx-daisy/button';
import {
  DsyDropdown,
  DsyDropdownTrigger,
  DsyDropdownContent,
  DsyDropdownItem,
} from 'ngx-daisy/dropdown';

interface DropdownValues {
  readonly opened?: ReturnType<DsyDropdown['opened']>;
  readonly placement?: ReturnType<DsyDropdown['placement']>;
  readonly align?: ReturnType<DsyDropdown['align']>;
  readonly kind?: ReturnType<DsyDropdown['kind']>;
  readonly hover?: ReturnType<DsyDropdown['hover']>;
  readonly disabled?: ReturnType<DsyDropdown['disabled']>;
  readonly autoFocus?: ReturnType<DsyDropdown['autoFocus']>;
  readonly panelClass?: ReturnType<DsyDropdown['panelClass']>;
  readonly label?: ReturnType<DsyDropdown['label']>;
  readonly id?: ReturnType<DsyDropdown['id']>;
}

@Component({
  selector: 'demo-dropdown-example',
  imports: [DsyButton, DsyDropdown, DsyDropdownTrigger, DsyDropdownContent, DsyDropdownItem],
  templateUrl: './dropdown-example.html',
  styleUrl: './dropdown-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DropdownExample {
  readonly values = input<readonly DropdownValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  private readonly configuredOpened = computed(() => this.props().opened ?? false);
  readonly opened = linkedSignal(() => this.configuredOpened());
  readonly selection = signal('Choose an action');
}
