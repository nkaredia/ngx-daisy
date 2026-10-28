import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  DestroyRef,
  TemplateRef,
  Directive,
  contentChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import type { FormValueControl } from '@angular/forms/signals';
import type { Button } from '@nativescript/core';
import { DsyButton } from '@ngx-daisy/native/button';
import {
  DsyNativeMenuService,
  type DsyNativeMenuItemContext,
  type DsyNativeMenuRef,
} from '@ngx-daisy/native/menu';
import { DsyTheme } from '@ngx-daisy/native/theme';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DSY_NATIVE_FIELD } from '@ngx-daisy/native/form-field';
import type { DsyButtonColor, DsyButtonSize } from '@ngx-daisy/core/button';
export interface DsySelectOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
}
export interface DsySelectOptionContext {
  readonly $implicit: DsySelectOption;
  readonly selected: boolean;
}
@Directive({ selector: 'ng-template[dsySelectOption]', standalone: true })
export class DsySelectOptionTemplate {
  readonly template = inject<TemplateRef<DsySelectOptionContext>>(TemplateRef);
  static ngTemplateContextGuard(
    _directive: DsySelectOptionTemplate,
    context: unknown,
  ): context is DsySelectOptionContext {
    return true;
  }
}
/** A string-valued form control with a themed, anchored selection popover. */
@Component({
  selector: 'GridLayout[dsySelect]',
  standalone: true,
  imports: [DsyButton, NgTemplateOutlet],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'dsy-native-select',
    '[class.dsy-native-select-invalid]': 'invalid() && touched()',
    '[class.dsy-native-select-disabled]': 'isDisabled()',
    '[visibility]': 'hidden() ? "collapsed" : "visible"',
  },
})
export class DsySelect implements FormValueControl<string> {
  readonly value = model('');
  readonly options = input<readonly DsySelectOption[]>([]);
  readonly placeholder = input('Choose an option');
  readonly label = input('');
  readonly description = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly color = input<DsyButtonColor>(undefined, { alias: 'dsyColor' });
  readonly size = input<DsyButtonSize>('md');
  readonly triggerClass = input('');
  readonly panelClass = input('');
  readonly optionClass = input('');
  readonly maxHeight = input(360);
  readonly optionTemplate = contentChild(DsySelectOptionTemplate);
  readonly menuTemplate = viewChild<TemplateRef<DsyNativeMenuItemContext>>('menuOption');
  optionFor(id: string): DsySelectOption | undefined {
    return this.options().find((option) => option.value === id);
  }
  /** Decorative trailing area; the panel and option slots have separate styling hooks. */
  readonly indicatorClass = input('');
  readonly touch = output<void>();
  private readonly context = inject(DSY_NATIVE_FIELD, { optional: true });
  readonly accessibleLabel = computed(
    () => this.label() || this.context?.label() || 'Choose an option',
  );
  readonly accessibleDescription = computed(
    () => this.description() || this.context?.description() || '',
  );
  readonly selectedLabel = computed(
    () =>
      this.options().find((option) => option.value === this.value())?.label ?? this.placeholder(),
  );
  readonly isDisabled = computed(
    () =>
      this.disabled() ||
      this.readonly() ||
      this.hidden() ||
      !this.options().some((option) => !option.disabled),
  );
  readonly opened = signal(false);
  private readonly trigger = viewChild<unknown, ElementRef<Button>>('trigger', {
    read: ElementRef,
  });
  private readonly menus = inject(DsyNativeMenuService);
  private readonly theme = inject(DsyTheme, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private ref?: DsyNativeMenuRef;
  private destroyed = false;
  private presentedOptions?: readonly DsySelectOption[];
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.cleanup();
    });
    effect(() => {
      if (this.opened() && (this.isDisabled() || this.options() !== this.presentedOptions))
        this.close();
    });
    effect(() => {
      const values = this.options().map((option) => option.value);
      if (new Set(values).size !== values.length)
        throw new Error('dsySelect option values must be unique.');
    });
  }
  private cleanup(): void {
    this.ref?.close('owner');
  }
  open(): void {
    if (this.isDisabled() || this.opened()) return;
    const anchor = this.trigger()?.nativeElement;
    if (!anchor) return;
    this.opened.set(true);
    this.presentedOptions = this.options();
    try {
      this.ref = this.menus.open(
        anchor,
        this.options().map((option) => ({
          id: option.value,
          label: option.label,
          description: option.description,
          disabled: option.disabled,
          checked: option.value === this.value(),
        })),
        {
          label: this.accessibleLabel(),
          width: 'anchor',
          panelClass: this.panelClass(),
          itemClass: this.optionClass(),
          maxHeight: this.maxHeight(),
          theme: this.theme?.theme,
          itemTemplate: this.optionTemplate() ? this.menuTemplate() : undefined,
          selected: (id) => {
            if (
              !this.destroyed &&
              !this.isDisabled() &&
              this.options().some((option) => option.value === id && !option.disabled)
            )
              this.value.set(id);
          },
        },
      );
      this.ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.ref = undefined;
        this.onClosed();
      });
    } catch (error) {
      this.opened.set(false);
      throw error;
    }
  }
  close(): void {
    if (this.ref) this.ref.close();
    else this.onClosed();
  }
  private onClosed(): void {
    if (!this.opened() || this.destroyed) return;
    this.opened.set(false);
    this.touch.emit();
  }
  focus(): void {
    if (!this.isDisabled()) this.trigger()?.nativeElement.focus();
  }
}
