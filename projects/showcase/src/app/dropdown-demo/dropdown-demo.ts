import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { DsyButton } from 'ngx-daisy/button';
import {
  DsyDropdown,
  DsyDropdownTrigger,
  DsyDropdownContent,
  DsyDropdownItem,
  DsyDropdownPlacement,
  DsyDropdownAlign,
} from 'ngx-daisy/dropdown';
@Component({
  selector: 'demo-dropdown-demo',
  standalone: true,
  providers: providePlayground(playground),
  imports: [
    Playground,
    DsyButton,
    DsyDropdown,
    DsyDropdownTrigger,
    DsyDropdownContent,
    DsyDropdownItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dropdown-demo.html',
  styleUrl: './dropdown-demo.scss',
})
export class DropdownDemo {
  readonly playground = playground;
  readonly selection = signal('Nothing selected');
  readonly placement = signal<DsyDropdownPlacement>('bottom');
  readonly align = signal<DsyDropdownAlign>('start');
  readonly placements = ['bottom', 'top', 'left', 'right'] as const;
  readonly alignments = ['start', 'center', 'end'] as const;
}
