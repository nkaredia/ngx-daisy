import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { injectDsyModalFocus } from '@ngx-daisy/cdk/overlay';
import { DSY_MODAL } from './modal-context';
export type DsyModalPlacement = 'top' | 'middle' | 'bottom' | 'start' | 'end';
export interface DsyModalCloseOptions {
  restoreFocus?: boolean;
}
const placements = {
  top: 'modal-top',
  middle: 'modal-middle',
  bottom: 'modal-bottom',
  start: 'modal-start',
  end: 'modal-end',
};
@Component({
  selector: 'dsy-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DSY_MODAL, useExisting: forwardRef(() => DsyModal) }],
  host: {
    class: 'dsy-modal',
    '[class]': 'classes()',
    '[attr.data-opened]': 'opened()',
    '[attr.data-placement]': 'placement()',
    '[style.--dsy-modal-level]': 'focus.level()',
    '(keydown)': 'keydown($event)',
  },
})
export class DsyModal {
  readonly opened = model(false);
  readonly placement = input<DsyModalPlacement>('middle');
  readonly disableClose = input(false, { transform: booleanAttribute });
  readonly label = input('Dialog', { alias: 'aria-label' });
  readonly labelledBy = input<string | undefined>(undefined, { alias: 'aria-labelledby' });
  readonly describedBy = input<string | undefined>(undefined, { alias: 'aria-describedby' });
  readonly role = input<'dialog' | 'alertdialog'>('dialog');
  readonly width = input<string>();
  readonly panelClass = input('');
  readonly backdropClass = input('');
  readonly closed = output<unknown>();
  protected readonly daisyClasses = injectDaisyUIClasses();
  protected readonly focus = injectDsyModalFocus();
  protected readonly classes = computed(() =>
    this.daisyClasses(
      'modal',
      placements[this.placement()],
      ...(this.opened() ? ['modal-open'] : []),
    ),
  );
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private restore = true;
  private wasOpen = false;
  private result: unknown;
  constructor() {
    afterRenderEffect(() => {
      const opened = this.opened();
      untracked(() => {
        if (opened) {
          this.focus.activate(this.panel().nativeElement);
          this.restore = true;
        } else {
          this.focus.deactivate(this.restore);
          if (this.wasOpen) this.closed.emit(this.result);
          this.result = undefined;
          this.restore = true;
        }
        this.wasOpen = opened;
      });
    });
    inject(DestroyRef).onDestroy(() => this.focus.deactivate(this.restore));
  }
  open(): void {
    this.restore = true;
    this.opened.set(true);
  }
  close(result?: unknown, options: DsyModalCloseOptions = {}): void {
    if (!this.opened()) return;
    this.result = result;
    this.restore = options.restoreFocus !== false;
    this.opened.set(false);
  }
  toggle(): void {
    if (this.opened()) this.close();
    else this.open();
  }
  protected dismiss(): void {
    if (!this.disableClose() && this.focus.isTop()) this.close();
  }
  protected keydown(event: KeyboardEvent): void {
    if (this.opened() && this.focus.consumeEscape(event)) this.dismiss();
  }
}
