import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { DsyButton } from 'ngx-daisy/button';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { DSY_FAB } from './fab-context';
@Directive({
  selector: 'button[dsyFabTrigger]',
  standalone: true,
  host: {
    class: 'dsy-fab-trigger',
    '[attr.aria-expanded]': 'fab.hasActions() ? fab.opened() : null',
    '[attr.aria-controls]': 'fab.hasActions() ? fab.id() : null',
    '[attr.aria-hidden]': 'fab.opened() && fab.hasReplacement() ? "true" : null',
    '[attr.inert]': 'fab.opened() && fab.hasReplacement() ? "" : null',
    '(click)': 'toggle()',
    '(focus)': 'focus()',
  },
})
export class DsyFabTrigger {
  readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  protected readonly fab = inject(DSY_FAB);
  protected toggle(): void {
    if (!this.element.disabled && this.fab.hasActions()) this.fab.toggle();
  }
  protected focus(): void {
    if (this.fab.openOnFocus() && this.fab.hasActions()) this.fab.open(false);
  }
}
@Directive({
  selector: 'button[dsyFabAction], a[dsyFabAction]',
  standalone: true,
  host: {
    class: 'dsy-fab-action',
    '[class]': 'classes()',
    '[attr.aria-hidden]': 'fab.opened() ? null : "true"',
    '[attr.inert]': 'fab.opened() ? null : ""',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '[attr.disabled]': 'element.tagName === "BUTTON" && disabled ? "" : null',
    '[style.--dsy-fab-angle]': 'fab.angle(this)',
    '(click)': 'activate($event)',
    '(focus)': 'fab.activateItem(this)',
  },
})
export class DsyFabAction {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly triggered = output<void>();
  readonly kind: 'action' | 'main' | 'close' = 'action';
  protected readonly fab = inject(DSY_FAB);
  protected readonly button = inject(DsyButton, { optional: true, self: true });
  private readonly daisyClasses = injectDaisyUIClasses();
  protected readonly classes = computed(() =>
    this.kind === 'main'
      ? this.daisyClasses('fab-main-action')
      : this.kind === 'close'
        ? this.daisyClasses('fab-close')
        : '',
  );
  get disabled(): boolean {
    return this.disabledInput() || !!this.button?.isDisabled();
  }
  focus(): void {
    this.element.focus({ preventScroll: true });
  }
  getLabel(): string {
    return this.element.getAttribute('aria-label') || this.element.textContent?.trim() || '';
  }
  protected activate(event: Event): void {
    if (this.disabled || !this.fab.opened()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.fab.close(true);
    if (this.kind !== 'close') this.triggered.emit();
  }
}
@Directive({
  selector: 'button[dsyFabMainAction], a[dsyFabMainAction]',
  standalone: true,
  providers: [{ provide: DsyFabAction, useExisting: forwardRef(() => DsyFabMainAction) }],
  host: { class: 'dsy-fab-replacement' },
})
export class DsyFabMainAction extends DsyFabAction {
  override readonly kind = 'main' as const;
}
@Directive({
  selector: 'button[dsyFabClose]',
  standalone: true,
  providers: [{ provide: DsyFabAction, useExisting: forwardRef(() => DsyFabClose) }],
  host: { class: 'dsy-fab-replacement' },
})
export class DsyFabClose extends DsyFabAction {
  override readonly kind = 'close' as const;
}
