import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { DSY_DRAWER_CONTAINER } from './drawer-context';
import { injectDsyModalFocus } from 'ngx-daisy/overlay';

export type DsyDrawerMode = 'over' | 'side';
export type DsyDrawerPosition = 'start' | 'end';
export interface DsyDrawerCloseOptions {
  /** Disable restoration when navigation or the app deliberately moves focus elsewhere. */
  restoreFocus?: boolean;
}

@Component({
  selector: 'dsy-drawer',
  standalone: true,
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'dsy-drawer',
    '[class]': 'daisyClasses("drawer-side")',
    '[attr.data-opened]': 'opened()',
    '[attr.data-mode]': 'mode()',
    '[attr.data-position]': 'position()',
    '[style.--dsy-drawer-width]': 'width()',
    '[style.--dsy-drawer-level]': 'modalFocus.level()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class DsyDrawer {
  readonly opened = model(false);
  readonly mode = input<DsyDrawerMode>('over');
  readonly position = input<DsyDrawerPosition>('start');
  readonly width = input<string>();
  readonly disableClose = input(false, { transform: booleanAttribute });
  readonly label = input('Navigation', { alias: 'aria-label' });
  /** Tailwind, daisyUI or app classes applied to the internal panel. */
  readonly panelClass = input('');
  /** Classes applied to the internal backdrop. */
  readonly backdropClass = input('');
  protected readonly daisyClasses = injectDaisyUIClasses();

  protected readonly modal = computed(() => this.opened() && this.mode() === 'over');
  protected readonly accessibleLabel = computed(() => this.label().trim() || 'Navigation');
  protected readonly modalFocus = injectDsyModalFocus();
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private restoreFocusOnClose = true;

  constructor() {
    inject(DSY_DRAWER_CONTAINER);
    afterRenderEffect(() => {
      const modal = this.modal();
      untracked(() => {
        if (modal) {
          this.modalFocus.activate(this.panel().nativeElement);
          this.restoreFocusOnClose = true;
        } else this.modalFocus.deactivate(!this.opened() && this.restoreFocusOnClose);
      });
    });
    inject(DestroyRef).onDestroy(() => this.modalFocus.deactivate(this.restoreFocusOnClose));
  }

  open(): void {
    this.restoreFocusOnClose = true;
    this.opened.set(true);
  }

  close(options: DsyDrawerCloseOptions = {}): void {
    if (!this.opened()) return;
    this.restoreFocusOnClose = options.restoreFocus !== false;
    this.opened.set(false);
  }

  toggle(): void {
    if (this.opened()) this.close();
    else this.open();
  }

  protected dismiss(): void {
    if (!this.disableClose() && this.modalFocus.isTop()) this.close();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.modal() && this.modalFocus.consumeEscape(event)) this.dismiss();
  }
}
