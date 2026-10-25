import { playground } from './playground';
import { Playground } from '../playground/playground.component';
import { providePlayground } from '../playground/provide-playground';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { DsyButton } from '@ngx-daisy/cdk/button';
import {
  DsyModal,
  DsyModalTitle,
  DsyModalContent,
  DsyModalActions,
  DsyModalClose,
  DsyModalPlacement,
} from '@ngx-daisy/cdk/modal';
@Component({
  selector: 'demo-modal-demo',
  standalone: true,
  providers: providePlayground(playground),
  imports: [
    Playground,
    DsyButton,
    DsyModal,
    DsyModalTitle,
    DsyModalContent,
    DsyModalActions,
    DsyModalClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './modal-demo.html',
  styleUrl: './modal-demo.scss',
})
export class ModalDemo {
  readonly playground = playground;
  readonly placement = signal<DsyModalPlacement>('middle');
  readonly locked = signal(false);
  readonly result = signal('No result yet');
  readonly placements = ['middle', 'top', 'bottom', 'start', 'end'] as const;
}
