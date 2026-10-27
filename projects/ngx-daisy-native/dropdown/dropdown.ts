import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApplicationRef,
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
  type EmbeddedViewRef,
} from '@angular/core';
import type { Button } from '@nativescript/core';
import { DsyNativeMenuService, type DsyNativeMenuRef } from '@ngx-daisy/native/menu';
import { DsyTheme } from '@ngx-daisy/native/theme';
import { DsyButton } from '@ngx-daisy/native/button';

/** Declares native menu actions; arbitrary Angular visual content is not a menu surface. */
@Directive({ selector: 'ng-template[dsyDropdownContent]', standalone: true })
export class DsyDropdownContent {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
@Component({
  selector: 'StackLayout[dsyDropdown]',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: '<ng-content select="[dsyDropdownTrigger]" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'dsyDropdown',
})
export class DsyDropdown {
  readonly opened = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input('Actions');
  readonly closed = output<void>();
  readonly content = contentChild(DsyDropdownContent);
  private readonly trigger = contentChild(DsyDropdownTrigger);
  private readonly scope = inject(DsyTheme, { optional: true });
  private readonly app = inject(ApplicationRef);
  private readonly menus = inject(DsyNativeMenuService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly items = signal<readonly DsyDropdownItem[]>([]);
  private source?: EmbeddedViewRef<unknown>;
  private ref?: DsyNativeMenuRef;
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
      this.ref?.close();
      this.disposeSource();
    });
  }
  register(item: DsyDropdownItem): () => void {
    this.items.update((items) => [...items, item]);
    return () => this.items.update((items) => items.filter((entry) => entry !== item));
  }
  private present(content: DsyDropdownContent, trigger: DsyDropdownTrigger): void {
    const source = content.template.createEmbeddedView({});
    this.source = source;
    this.app.attachView(source);
    source.detectChanges();
    const items = [...this.items()];
    if (!items.length) {
      this.opened.set(false);
      this.disposeSource();
      return;
    }
    try {
      this.ref = this.menus.open(
        trigger.element.nativeElement,
        items.map((item, index) => ({
          id: String(index),
          label: item.menuLabel(),
          disabled: item.isDisabled(),
          description: item.description(),
          section: item.section(),
          destructive: item.destructive(),
        })),
        {
          label: this.label(),
          appearance: this.scope?.resolved().colorScheme,
          selected: (id) => items[Number(id)]?.activate(),
        },
      );
      this.ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.ref = undefined;
        this.opened.set(false);
        this.disposeSource();
        this.closed.emit();
      });
    } catch (error) {
      this.opened.set(false);
      this.disposeSource();
      throw error;
    }
  }
  private disposeSource(): void {
    const source = this.source;
    this.source = undefined;
    if (source) {
      this.app.detachView(source);
      source.destroy();
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
  selector: 'Button[dsyDropdownItem]',
  standalone: true,
  host: { '(tap)': 'activate()', '[attr.isEnabled]': '!isDisabled()' },
})
export class DsyDropdownItem {
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly description = input('');
  readonly section = input('');
  readonly destructive = input(false, { transform: booleanAttribute });
  readonly triggered = output<void>();
  readonly button = inject(DsyButton, { optional: true });
  private readonly element = inject<ElementRef<Button>>(ElementRef);
  private readonly dropdown = inject(DsyDropdown);
  private alive = true;
  constructor() {
    const unregister = this.dropdown.register(this);
    inject(DestroyRef).onDestroy(() => {
      this.alive = false;
      unregister();
    });
  }
  menuLabel(): string {
    return this.label() || this.button?.text() || this.element.nativeElement.text || '';
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
