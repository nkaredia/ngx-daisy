import {
  booleanAttribute,
  Directive,
  DestroyRef,
  Renderer2,
  ElementRef,
  inject,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { DsyButton } from 'ngx-daisy/button';
import { DSY_DROPDOWN } from './dropdown-context';
@Directive({
  selector: 'button[dsyDropdownTrigger]',
  standalone: true,
  host: {
    '[attr.aria-haspopup]': 'dropdown.kind() === "menu" ? "menu" : "dialog"',
    '[attr.aria-expanded]': 'dropdown.opened()',
    '[attr.aria-controls]': 'dropdown.opened() ? dropdown.id() : null',
    '[attr.aria-disabled]': 'dropdown.disabled() ? "true" : null',
    '(click)': 'toggle()',
    '(keydown)': 'keydown($event)',
  },
})
export class DsyDropdownTrigger {
  readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  protected readonly dropdown = inject(DSY_DROPDOWN);
  protected toggle(): void {
    if (!this.element.disabled) this.dropdown.toggle();
  }
  protected keydown(event: KeyboardEvent): void {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      this.element.disabled ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.dropdown.open(event.key === 'ArrowUp' ? 'last' : 'first');
    } else if (event.key === 'Escape' && this.dropdown.opened()) {
      event.preventDefault();
      this.dropdown.close();
    }
  }
}
@Directive({ selector: 'ng-template[dsyDropdownContent]', standalone: true })
export class DsyDropdownContent {
  readonly template = inject(TemplateRef<unknown>);
}
@Directive({
  selector: 'button[dsyDropdownItem], a[dsyDropdownItem]',
  standalone: true,
  host: {
    class: 'dsy-dropdown-item',
    role: 'menuitem',
    tabindex: '-1',
    '[attr.aria-disabled]': 'disabled ? "true" : "false"',
    '[attr.disabled]': 'element.tagName === "BUTTON" && disabled ? "" : null',
    '(click)': 'activate()',
    '(keydown)': 'keydown($event)',
    '(focus)': 'dropdown.activateItem(this)',
  },
})
export class DsyDropdownItem {
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly label = input<string>();
  readonly triggered = output<void>();
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly dropdown = inject(DSY_DROPDOWN);
  private readonly button = inject(DsyButton, { optional: true, self: true });
  get disabled(): boolean {
    return this.disabledInput() || !!this.button?.isDisabled();
  }
  focus(): void {
    this.element.focus({ preventScroll: true });
  }
  getLabel(): string {
    return this.label() || this.element.textContent?.trim() || '';
  }
  constructor() {
    this.dropdown.register(this);
    const remove = inject(Renderer2).listen(
      this.element,
      'click',
      (event: Event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
    inject(DestroyRef).onDestroy(() => {
      remove();
      this.dropdown.unregister(this);
    });
  }
  protected activate(): void {
    if (!this.disabled) {
      this.dropdown.close();
      this.triggered.emit();
    }
  }
  protected keydown(rawEvent: Event): void {
    const event = rawEvent as KeyboardEvent;
    if (
      ['Enter', ' '].includes(event.key) &&
      !event.isComposing &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      if (!this.disabled) this.element.click();
    }
  }
}
