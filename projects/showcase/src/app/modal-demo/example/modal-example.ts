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
import {
  DsyModal,
  DsyModalTitle,
  DsyModalContent,
  DsyModalActions,
  DsyModalClose,
} from '@ngx-daisy/cdk/modal';

interface ModalValues {
  readonly opened?: ReturnType<DsyModal['opened']>;
  readonly placement?: ReturnType<DsyModal['placement']>;
  readonly disableClose?: ReturnType<DsyModal['disableClose']>;
  readonly label?: ReturnType<DsyModal['label']>;
  readonly labelledBy?: ReturnType<DsyModal['labelledBy']>;
  readonly describedBy?: ReturnType<DsyModal['describedBy']>;
  readonly role?: ReturnType<DsyModal['role']>;
  readonly width?: ReturnType<DsyModal['width']>;
  readonly panelClass?: ReturnType<DsyModal['panelClass']>;
  readonly backdropClass?: ReturnType<DsyModal['backdropClass']>;
}

@Component({
  selector: 'demo-modal-example',
  imports: [DsyButton, DsyModal, DsyModalTitle, DsyModalContent, DsyModalActions, DsyModalClose],
  templateUrl: './modal-example.html',
  styleUrl: './modal-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ModalExample {
  readonly values = input<readonly ModalValues[]>([]);
  readonly props = computed(() => this.values()[0] ?? {});
  private readonly configuredOpened = computed(() => this.props().opened ?? false);
  readonly opened = linkedSignal(() => this.configuredOpened());
  readonly result = signal('Open the dialog to try its settings');
}
