import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  NO_ERRORS_SCHEMA,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  Injector,
} from '@angular/core';
import type { Button, View } from '@nativescript/core';
import { DsyPopoverService, type DsyPopoverRef } from '@ngx-daisy/native/popover';
import { DsyTheme } from '@ngx-daisy/native/theme';
import { DsyButton } from '@ngx-daisy/native/button';

/** Live Angular content rendered in the anchored popover. */
@Directive({ selector: 'ng-template[dsyDropdownContent]', standalone: true })
export class DsyDropdownContent {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
@Component({
  selector: 'StackLayout[dsyDropdown]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '<ng-content select="[dsyDropdownTrigger]" />',
  styleUrl: './dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'dsyDropdown',
})
export class DsyDropdown {
  readonly opened = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input('Actions');
  readonly panelClass = input('');
  readonly panelWidth = input<number | 'anchor'>(280);
  readonly maxHeight = input(360);
  readonly closed = output<void>();
  readonly content = contentChild(DsyDropdownContent);
  private readonly trigger = contentChild(DsyDropdownTrigger);
  private readonly scope = inject(DsyTheme, { optional: true });
  private readonly injector = inject(Injector);
  private readonly popovers = inject(DsyPopoverService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly items = signal<readonly DsyDropdownItem[]>([]);
  private ref?: DsyPopoverRef;
  constructor() {
    effect(() => {
      const opened = this.opened();
      const disabled = this.disabled();
      const content = this.content();
      const trigger = this.trigger();
      if (disabled && opened) this.opened.set(false);
      if (opened && !disabled && !this.ref && content && trigger) this.present(content, trigger);
      else if ((!opened || disabled) && this.ref) this.ref.close();
    });
    this.destroyRef.onDestroy(() => {
      this.ref?.close('owner');
    });
  }
  register(item: DsyDropdownItem): () => void {
    this.items.update((items) => [...items, item]);
    return () => this.items.update((items) => items.filter((entry) => entry !== item));
  }
  private present(content: DsyDropdownContent, trigger: DsyDropdownTrigger): void {
    try {
      this.ref = this.popovers.open(trigger.element.nativeElement, content.template, {
        label: this.label(),
        panelClass: this.panelClass(),
        width: this.panelWidth(),
        maxHeight: this.maxHeight(),
        injector: this.injector,
        theme: this.scope?.theme,
        initialFocus: () => this.items().find((item) => !item.isDisabled())?.element.nativeElement,
      });
      this.ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.ref = undefined;
        this.opened.set(false);
        this.closed.emit();
      });
    } catch (error) {
      this.opened.set(false);
      throw error;
    }
  }
  open(): void {
    if (!this.disabled()) this.opened.set(true);
  }
  close(): void {
    this.opened.set(false);
  }
  toggle(): void {
    if (!this.disabled()) this.opened.update((value) => !value);
  }
}
@Directive({
  selector: 'Button[dsyDropdownTrigger]',
  standalone: true,
  host: {
    '(tap)': 'activate()',
    '[attr.isEnabled]': '!dropdown.disabled() && !button?.isDisabled()',
    '[attr.accessibilityHint]': 'dropdown.opened() ? "Actions open" : "Opens actions"',
  },
})
export class DsyDropdownTrigger {
  readonly dropdown = inject(DsyDropdown);
  readonly button = inject(DsyButton, { optional: true });
  readonly element = inject<ElementRef<Button>>(ElementRef);
  constructor() {
    const remove = this.button?.registerDisabledSource(() => this.dropdown.disabled());
    if (remove) inject(DestroyRef).onDestroy(remove);
  }
  activate(): void {
    if (!this.button?.isDisabled()) this.dropdown.toggle();
  }
}
@Directive({
  selector: 'Button[dsyDropdownItem], GridLayout[dsyDropdownItem], StackLayout[dsyDropdownItem]',
  standalone: true,
  host: {
    class: 'dsy-native-dropdown-item',
    '(tap)': 'activate()',
    '[attr.isEnabled]': '!isDisabled()',
    '[attr.accessibilityLabel]': 'menuLabel()',
    '[attr.accessibilityHint]': 'description()',
    '[attr.accessibilityState]': 'isDisabled() ? "disabled" : null',
    accessible: 'true',
    accessibilityRole: 'button',
    '[class.dsy-native-dropdown-item-disabled]': 'isDisabled()',
    '[class.dsy-native-dropdown-item-destructive]': 'destructive()',
  },
})
export class DsyDropdownItem {
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly description = input('');
  readonly section = input('');
  readonly destructive = input(false, { transform: booleanAttribute });
  readonly triggered = output<void>();
  readonly button = inject(DsyButton, { optional: true });
  readonly element = inject<ElementRef<View & { text?: string }>>(ElementRef);
  private readonly dropdown = inject(DsyDropdown);
  private alive = true;
  constructor() {
    const unregister = this.dropdown.register(this);
    const removeDisabled = this.button?.registerDisabledSource(
      () => this.disabled() || this.dropdown.disabled(),
    );
    inject(DestroyRef).onDestroy(() => {
      this.alive = false;
      unregister();
      removeDisabled?.();
    });
  }
  menuLabel(): string {
    return this.label() || this.button?.text() || this.element.nativeElement.text || 'Menu action';
  }
  isDisabled(): boolean {
    return this.disabled() || !!this.button?.isDisabled();
  }
  activate(): void {
    if (!this.alive || !this.dropdown.opened() || this.dropdown.disabled() || this.isDisabled())
      return;
    this.dropdown.close();
    this.triggered.emit();
  }
}
