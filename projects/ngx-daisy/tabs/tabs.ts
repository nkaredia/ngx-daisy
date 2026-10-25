import {
  Component,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  computed,
  inject,
  effect,
  ElementRef,
  DestroyRef,
  signal,
  booleanAttribute,
  numberAttribute,
  contentChildren,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { toSignal } from '@angular/core/rxjs-interop';
import { Directionality } from '@angular/cdk/bidi';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { DsyIdGenerator } from 'ngx-daisy/overlay';
@Directive({
  selector: 'button[dsyTab]',
  host: {
    '[class]': 'classes()',
    role: 'tab',
    type: 'button',
    '[id]': 'id',
    '[attr.aria-controls]': 'panelId()',
    '[attr.aria-selected]': 'selected()',
    '[attr.tabindex]': 'tabIndex()',
    '[disabled]': 'disabled()',
    '(click)': 'tabs.select(this)',
    '(focus)': 'tabs.focusTab(this)',
  },
})
export class DsyTab {
  readonly daisy = injectDaisyUIClasses();
  readonly id = inject(DsyIdGenerator).next('dsy-tab');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly selected = signal(false);
  readonly tabIndex = signal(-1);
  readonly panelId = signal<string | null>(null);
  readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
  readonly tabs = inject(DsyTabs);
  readonly classes = computed(() =>
    this.daisy(
      ...['tab', this.selected() ? 'tab-active' : '', this.disabled() ? 'tab-disabled' : ''].filter(
        Boolean,
      ),
    ),
  );
  focus() {
    this.element.focus();
  }
  getLabel() {
    return this.label() || this.element.textContent?.trim() || '';
  }
}
@Directive({
  selector: '[dsyTabPanel]',
  host: {
    class: 'dsy-tab-panel',
    '[class]': 'daisy("tab-content")',
    role: 'tabpanel',
    tabindex: '0',
    '[id]': 'id',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.hidden]': 'active()?null:""',
    '[attr.inert]': 'active()?null:""',
  },
})
export class DsyTabPanel {
  readonly daisy = injectDaisyUIClasses();
  readonly id = inject(DsyIdGenerator).next('dsy-tab-panel');
  readonly index = input(0, { alias: 'dsyTabPanel', transform: numberAttribute });
  readonly active = signal(false);
  readonly labelledBy = signal<string | null>(null);
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
}
@Component({
  selector: 'dsy-tabs',
  template: `<div
      class="dsy-tab-list"
      [class]="classes() + ' ' + listClass()"
      role="tablist"
      [attr.aria-label]="label()"
      [attr.aria-orientation]="orientation()"
      (keydown)="keydown($event)"
    >
      <ng-content select="[dsyTab]" />
    </div>
    <ng-content />`,
  styleUrl: './tabs.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-first-active]': 'index() === 0',
    '[attr.data-placement]': 'placement()',
    '[attr.data-orientation]': 'orientation()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyTabs {
  readonly selectedIndex = model(0);
  readonly label = input('Tabs');
  readonly listClass = input('');
  readonly variant = input<'default' | 'border' | 'box' | 'lift'>('default');
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly placement = input<'top' | 'bottom'>('top');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly activation = input<'automatic' | 'manual'>('automatic');
  readonly focused = signal(0);
  readonly items = contentChildren(DsyTab);
  readonly panels = contentChildren(DsyTabPanel);
  readonly daisy = injectDaisyUIClasses();
  private readonly direction = inject(Directionality);
  private readonly directionValue = toSignal(this.direction.change, {
    initialValue: this.direction.value,
  });
  private manager?: FocusKeyManager<{
    focus: () => void;
    getLabel: () => string;
    disabled: boolean;
  }>;
  readonly index = computed(() => {
    const items = this.items();
    const clamped = Math.max(0, Math.min(items.length - 1, Math.floor(this.selectedIndex()) || 0));
    return items[clamped] && !items[clamped].disabled()
      ? clamped
      : items.findIndex((item) => !item.disabled());
  });
  readonly hostClasses = computed(() =>
    this.daisy(
      'tabs',
      this.variant() === 'lift' ? 'tabs-lift' : '',
      this.placement() === 'bottom' ? 'tabs-bottom' : 'tabs-top',
    ),
  );
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'tabs',
        { default: '', border: 'tabs-border', box: 'tabs-box', lift: 'tabs-lift' }[this.variant()],
        { xs: 'tabs-xs', sm: 'tabs-sm', md: 'tabs-md', lg: 'tabs-lg', xl: 'tabs-xl' }[this.size()],
        { top: 'tabs-top', bottom: 'tabs-bottom' }[this.placement()],
      ].filter(Boolean),
    ),
  );
  constructor() {
    effect(() => {
      this.manager?.destroy();
      const manager = new FocusKeyManager(
        this.items().map((item) => ({
          focus: () => item.focus(),
          getLabel: () => item.getLabel(),
          get disabled() {
            return item.disabled();
          },
        })),
      )
        .withWrap()
        .withHomeAndEnd()
        .withTypeAhead();
      this.manager =
        this.orientation() === 'vertical'
          ? manager.withVerticalOrientation()
          : manager.withVerticalOrientation(false).withHorizontalOrientation(this.directionValue());
    });
    effect(() => {
      const index = this.index(),
        items = this.items(),
        panels = this.panels(),
        focused = this.focused();
      for (const panel of panels) {
        const active = panel.index() === index;
        if (
          !active &&
          panel.active() &&
          panel.element.contains(panel.element.ownerDocument.activeElement)
        )
          items[index]?.focus();
        panel.active.set(active);
        panel.labelledBy.set(items[panel.index()]?.id ?? null);
      }
      items.forEach((item, i) => {
        item.selected.set(i === index);
        item.tabIndex.set(
          !item.disabled() &&
            i ===
              (this.activation() === 'manual' && items[focused] && !items[focused].disabled()
                ? focused
                : index)
            ? 0
            : -1,
        );
        item.panelId.set(panels.find((p) => p.index() === i)?.id ?? null);
      });
    });
    inject(DestroyRef).onDestroy(() => this.manager?.destroy());
  }
  focusTab(item: DsyTab) {
    this.focused.set(this.items().indexOf(item));
    if (this.activation() === 'automatic' && !item.disabled())
      this.selectedIndex.set(this.items().indexOf(item));
  }
  select(item: DsyTab) {
    if (item.disabled()) return;
    const index = this.items().indexOf(item);
    this.focused.set(index);
    this.selectedIndex.set(index);
  }
  keydown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = this.items().find((item) => item.element === event.target);
    if (!target) return;
    const current = this.items().indexOf(target);
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(target);
      return;
    }
    this.manager?.updateActiveItem(current);
    this.manager?.onKeydown(event);
    const next = this.manager?.activeItemIndex;
    if (next != null && next !== current) {
      this.focused.set(next);
      if (this.activation() === 'automatic') this.selectedIndex.set(next);
    }
  }
}
