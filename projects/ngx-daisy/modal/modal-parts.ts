import { Directive, inject, input } from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { DSY_MODAL } from './modal-context';
@Directive({ selector: 'button[dsyModalClose]', standalone: true, host: { '(click)': 'close()' } })
export class DsyModalClose {
  readonly result = input<unknown>(undefined, { alias: 'dsyModalClose' });
  private readonly modal = inject(DSY_MODAL);
  protected close(): void {
    this.modal.close(this.result());
  }
}
@Directive({ selector: '[dsyModalTitle]', standalone: true, host: { class: 'dsy-modal-title' } })
export class DsyModalTitle {}
@Directive({
  selector: '[dsyModalContent]',
  standalone: true,
  host: { class: 'dsy-modal-content' },
})
export class DsyModalContent {}
@Directive({
  selector: '[dsyModalActions]',
  standalone: true,
  host: { class: 'dsy-modal-actions', '[class]': 'classes' },
})
export class DsyModalActions {
  protected readonly classes = injectDaisyUIClasses()('modal-action');
}
