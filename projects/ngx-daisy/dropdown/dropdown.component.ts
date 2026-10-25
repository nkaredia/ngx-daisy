import {
  afterEveryRender,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  contentChild,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { Directionality, Dir } from '@angular/cdk/bidi';
import { FocusKeyManager, InteractivityChecker } from '@angular/cdk/a11y';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DsyIdGenerator, DsyOverlayTheme } from '@ngx-daisy/cdk/overlay';
import { DSY_DROPDOWN } from './dropdown-context';
import { DsyDropdownContent, DsyDropdownTrigger, DsyDropdownItem } from './dropdown-parts';
export type DsyDropdownPlacement = 'top' | 'bottom' | 'left' | 'right';
export type DsyDropdownAlign = 'start' | 'center' | 'end';
export type DsyDropdownKind = 'menu' | 'content';
const placements = {
  top: 'dropdown-top',
  bottom: 'dropdown-bottom',
  left: 'dropdown-left',
  right: 'dropdown-right',
};
const alignments = { start: 'dropdown-start', center: 'dropdown-center', end: 'dropdown-end' };
@Component({
  selector: 'dsy-dropdown',
  standalone: true,
  imports: [NgTemplateOutlet, CdkConnectedOverlay, Dir, DsyOverlayTheme],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DSY_DROPDOWN, useExisting: forwardRef(() => DsyDropdown) }],
  host: {
    class: 'dsy-dropdown',
    '[class]': 'classes()',
    '(mouseenter)': 'hoverEnter()',
    '(mouseleave)': 'hoverLeave()',
    '(document:focusin)': 'outsideFocus($event)',
  },
})
export class DsyDropdown {
  readonly opened = model(false);
  readonly placement = input<DsyDropdownPlacement>('bottom');
  readonly align = input<DsyDropdownAlign>('start');
  readonly kind = input<DsyDropdownKind>('menu');
  readonly hover = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly autoFocus = input(true, { transform: booleanAttribute });
  readonly panelClass = input('');
  readonly label = input('Options', { alias: 'aria-label' });
  readonly id = input(inject(DsyIdGenerator).next('dsy-dropdown'));
  protected readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly content = contentChild(DsyDropdownContent);
  protected readonly trigger = contentChild(DsyDropdownTrigger);
  protected readonly direction = signal(inject(Directionality).value);
  protected readonly daisyClasses = injectDaisyUIClasses();
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly items = signal<DsyDropdownItem[]>([]);
  private manager?: FocusKeyManager<DsyDropdownItem>;
  private readonly injector = inject(Injector);
  private readonly checker = inject(InteractivityChecker);
  private hoverTimer?: ReturnType<typeof setTimeout>;
  private focusOnOpen: false | 'first' | 'last' = 'first';
  protected readonly classes = computed(() =>
    this.daisyClasses(
      'dropdown',
      placements[this.placement()],
      alignments[this.align()],
      this.opened() ? 'dropdown-open' : 'dropdown-close',
      ...(this.hover() ? ['dropdown-hover'] : []),
    ),
  );
  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const placement = this.placement();
    const align = this.align();
    if (placement === 'top' || placement === 'bottom') {
      const down = placement === 'bottom';
      return [
        {
          originX: align,
          overlayX: align,
          originY: down ? 'bottom' : 'top',
          overlayY: down ? 'top' : 'bottom',
          offsetY: down ? 8 : -8,
        },
        {
          originX: align,
          overlayX: align,
          originY: down ? 'top' : 'bottom',
          overlayY: down ? 'bottom' : 'top',
          offsetY: down ? -8 : 8,
        },
      ];
    }
    const left = placement === 'left';
    const rtl = this.direction() === 'rtl';
    const start = rtl ? 'end' : 'start';
    const end = rtl ? 'start' : 'end';
    const y = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
    return [
      {
        originX: left ? start : end,
        overlayX: left ? end : start,
        originY: y,
        overlayY: y,
        offsetX: left ? -8 : 8,
      },
      {
        originX: left ? end : start,
        overlayX: left ? start : end,
        originY: y,
        overlayY: y,
        offsetX: left ? 8 : -8,
      },
    ];
  });
  register(item: DsyDropdownItem): void {
    this.items.update((items) => [...items, item]);
  }
  unregister(item: DsyDropdownItem): void {
    this.items.update((items) => items.filter((value) => value !== item));
  }
  activateItem(item: DsyDropdownItem): void {
    this.manager?.updateActiveItem(this.items().indexOf(item));
  }
  constructor() {
    effect(() => {
      const items = this.items();
      this.manager?.destroy();
      this.manager = new FocusKeyManager(items)
        .withWrap()
        .withVerticalOrientation()
        .withHomeAndEnd()
        .withTypeAhead();
    });
    afterEveryRender(() => {
      const direction = getComputedStyle(this.host).direction === 'rtl' ? 'rtl' : 'ltr';
      if (direction !== this.direction()) this.direction.set(direction);
    });
    afterRenderEffect(() => {
      if (this.disabled()) this.opened.set(false);
      if (this.opened() && (!this.trigger() || !this.content()))
        throw new Error(
          'dsy-dropdown needs one button[dsyDropdownTrigger] and an ng-template[dsyDropdownContent].',
        );
    });
    inject(DestroyRef).onDestroy(() => {
      this.cancelHover();
      this.manager?.destroy();
    });
  }
  open(focus: false | 'first' | 'last' = 'first'): void {
    if (this.disabled() || this.trigger()?.element.disabled) return;
    this.cancelHover();
    this.focusOnOpen = focus;
    this.opened.set(true);
    if (this.panel()) this.focusPanel();
  }
  close(restoreFocus = true): void {
    if (!this.opened()) return;
    this.cancelHover();
    this.opened.set(false);
    if (restoreFocus && this.trigger()?.element.isConnected)
      this.trigger()!.element.focus({ preventScroll: true });
  }
  toggle(): void {
    if (this.opened()) this.close();
    else this.open();
  }
  protected attached(): void {
    afterNextRender(() => this.focusPanel(), { injector: this.injector });
  }
  private focusPanel(): void {
    if (!this.opened() || !this.autoFocus() || this.focusOnOpen === false) return;
    const panel = this.panel()?.nativeElement;
    if (!panel) return;
    if (this.kind() === 'menu') {
      if (this.focusOnOpen === 'last') this.manager?.setLastItemActive();
      else this.manager?.setFirstItemActive();
    } else {
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          '[cdkFocusInitial],button,a[href],input,select,textarea,[tabindex]',
        ),
      ).filter((element) => this.checker.isFocusable(element));
      (focusable[0] ?? panel).focus({ preventScroll: true });
    }
    if (!panel.contains(panel.ownerDocument.activeElement)) panel.focus({ preventScroll: true });
  }
  protected outside(event: MouseEvent): void {
    if (!this.host.contains(event.target as Node)) this.close(false);
  }
  protected outsideFocus(event: FocusEvent): void {
    const target = event.target as Node;
    if (
      this.opened() &&
      !this.host.contains(target) &&
      !this.panel()?.nativeElement.contains(target)
    )
      this.close(false);
  }
  protected panelKeydown(event: KeyboardEvent): void {
    if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape' && (this.kind() === 'menu' || !event.defaultPrevented)) {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    } else if (event.key === 'Tab' && this.kind() === 'menu') this.close();
    else if (this.kind() === 'menu') this.manager?.onKeydown(event);
  }
  protected hoverEnter(): void {
    if (this.hover()) {
      this.cancelHover();
      if (!this.opened()) this.open(false);
    }
  }
  protected hoverLeave(): void {
    if (this.hover()) {
      this.cancelHover();
      this.hoverTimer = setTimeout(() => this.close(false), 180);
    }
  }
  private cancelHover(): void {
    if (this.hoverTimer !== undefined) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = undefined;
    }
  }
}
