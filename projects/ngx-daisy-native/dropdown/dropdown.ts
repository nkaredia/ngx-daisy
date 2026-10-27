import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  NO_ERRORS_SCHEMA,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import type { NativeDialogRef } from '@nativescript/angular';
import { DsyModalService, type DsyModalContext } from '@ngx-daisy/native/modal';
import { DsyTheme } from '@ngx-daisy/native/theme';
import { DsyButton } from '@ngx-daisy/native/button';
import { take } from 'rxjs';

@Directive({ selector: 'ng-template[dsyDropdownContent]', standalone: true })
export class DsyDropdownContent {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/** A native action popover/dialog; content is created only while open. */
@Component({
  selector: 'StackLayout[dsyDropdown]',
  standalone: true,
  imports: [NgTemplateOutlet],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<ng-content select="[dsyDropdownTrigger]" />
    <ng-template #panel
      ><StackLayout><ng-container [ngTemplateOutlet]="content()?.template ?? null" /></StackLayout
    ></ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'dsyDropdown',
})
export class DsyDropdown {
  readonly opened = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input('Actions');
  readonly panelClass = input('');
  readonly closed = output<void>();
  readonly content = contentChild(DsyDropdownContent);
  private readonly panel = viewChild<TemplateRef<DsyModalContext>>('panel');
  private readonly scope = inject(DsyTheme, { optional: true });
  private readonly container = inject(ViewContainerRef);
  private readonly modals = inject(DsyModalService);
  private readonly ref = signal<NativeDialogRef<unknown> | undefined>(undefined);
  constructor() {
    const destroyRef = inject(DestroyRef);
    effect(() => {
      const disabled = this.disabled();
      const opened = this.opened();
      const ref = this.ref();
      const panel = this.panel();
      if (disabled && opened) this.opened.set(false);
      if (opened && !disabled && !ref && panel && this.content()) {
        const next = this.modals.open(panel, {
          label: this.label(),
          panelClass: this.panelClass(),
          theme: this.scope?.theme,
          viewContainerRef: this.container,
        });
        this.ref.set(next);
        next
          .afterClosed()
          .pipe(take(1), takeUntilDestroyed(destroyRef))
          .subscribe(() => {
            this.opened.set(false);
            this.ref.set(undefined);
            this.closed.emit();
          });
      } else if ((!opened || disabled) && ref) {
        if (ref.getState() === 0) ref.close();
      }
    });
    destroyRef.onDestroy(() => {
      const ref = this.ref();
      if (ref?.getState() === 0) ref.close();
    });
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
  constructor() {
    const remove = this.button?.registerDisabledSource(() => this.dropdown.disabled());
    if (remove) inject(DestroyRef).onDestroy(remove);
  }

  readonly dropdown = inject(DsyDropdown);
  readonly button = inject(DsyButton, { optional: true });
  activate(): void {
    if (!this.button?.isDisabled()) this.dropdown.toggle();
  }
}
@Directive({
  selector: 'Button[dsyDropdownItem]',
  standalone: true,
  host: { '(tap)': 'activate()', '[attr.isEnabled]': '!disabled() && !button?.isDisabled()' },
})
export class DsyDropdownItem {
  constructor() {
    const remove = this.button?.registerDisabledSource(
      () => this.disabled() || this.dropdown.disabled() || !this.dropdown.opened(),
    );
    if (remove) inject(DestroyRef).onDestroy(remove);
  }

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly triggered = output<void>();
  readonly button = inject(DsyButton, { optional: true });
  private readonly dropdown = inject(DsyDropdown);
  activate(): void {
    if (
      !this.dropdown.opened() ||
      this.dropdown.disabled() ||
      this.disabled() ||
      this.button?.isDisabled()
    )
      return;
    this.dropdown.close();
    this.triggered.emit();
  }
}
