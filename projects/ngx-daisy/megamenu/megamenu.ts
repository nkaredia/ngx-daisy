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
  booleanAttribute,
  contentChildren,
  viewChildren,
  TemplateRef,
  Injector,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { NgTemplateOutlet } from '@angular/common';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { FocusKeyManager, InteractivityChecker } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { afterNextRender, afterRenderEffect, viewChild, signal } from '@angular/core';
import { DsyIdGenerator, DsyOverlayTheme } from 'ngx-daisy/overlay';
@Directive({ selector: 'ng-template[dsyMegamenuItem]' })
export class DsyMegamenuItem {
  readonly label = input.required<string>({ alias: 'dsyMegamenuItem' });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly template = inject(TemplateRef<unknown>);
  readonly id = inject(DsyIdGenerator).next('dsy-megamenu-item');
}
@Component({
  selector: 'dsy-megamenu',
  imports: [NgTemplateOutlet, CdkConnectedOverlay, DsyOverlayTheme],
  template: `<nav
      [class]="classes()"
      class="dsy-megamenu-nav"
      [attr.aria-label]="label()"
      [attr.data-vertical]="vertical()"
      (keydown)="headerKeydown($event)"
    >
      <span
        #highlight
        class="dsy-megamenu-highlight"
        [class]="daisy('megamenu-active')"
        aria-hidden="true"
      ></span>
      @for (item of items(); track item.id; let i = $index) {
        <button
          #trigger
          class="dsy-megamenu-trigger"
          (pointerenter)="hoveredIndex.set(i)"
          (pointerleave)="hoveredIndex.set(null)"
          type="button"
          [class]="buttonClass()"
          [id]="item.id + '-trigger'"
          [disabled]="item.disabled()"
          [attr.aria-expanded]="selected() === item"
          [attr.aria-controls]="selected() === item ? item.id + '-panel' : null"
          (click)="toggle(i)"
          (keydown.arrowdown)="openDown($event, i)"
        >
          {{ item.label() }}
        </button>
      }
    </nav>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="buttons()[activeIndex() ?? -1]?.nativeElement ?? host"
      [cdkConnectedOverlayOpen]="!!selected()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayViewportMargin]="8"
      [cdkConnectedOverlayPush]="true"
      [cdkConnectedOverlayWidth]="panelWidth()"
      (attach)="attached()"
      (overlayOutsideClick)="outside($event)"
      (detach)="close(false)"
      ><div class="dsy-megamenu-theme" [dsyOverlayTheme]="host">
        @if (selected(); as item) {
          <div
            #panel
            class="dsy-megamenu-panel"
            [class]="panelClass()"
            role="region"
            tabindex="-1"
            [id]="item.id + '-panel'"
            [attr.aria-labelledby]="item.id + '-trigger'"
            (keydown.escape)="escape($event)"
          >
            <ng-container [ngTemplateOutlet]="item.template" />
          </div>
        }</div
    ></ng-template>`,
  styleUrl: './megamenu.scss',
  host: { '(document:focusin)': 'outsideFocus($event)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyMegamenu {
  readonly hoveredIndex = signal<number | null>(null);
  private readonly highlight = viewChild<ElementRef<HTMLElement>>('highlight');
  readonly items = contentChildren(DsyMegamenuItem);
  readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('trigger');
  readonly panel = viewChildren<ElementRef<HTMLElement>>('panel');
  readonly activeIndex = model<number | null>(null);
  readonly label = input('Main menu');
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly width = input<'auto' | 'wide' | 'full'>('wide');
  readonly vertical = input(false, { transform: booleanAttribute });
  readonly panelClass = input('');
  readonly buttonClass = input('');
  readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly daisy = injectDaisyUIClasses();
  readonly selected = computed(() => {
    const item = this.items()[this.activeIndex() ?? -1];
    return item && !item.disabled() ? item : null;
  });
  readonly classes = computed(() =>
    this.daisy(
      ...[
        'megamenu',
        {
          xs: 'megamenu-xs',
          sm: 'megamenu-sm',
          md: 'megamenu-md',
          lg: 'megamenu-lg',
          xl: 'megamenu-xl',
        }[this.size()],
        { auto: '', wide: 'megamenu-wide', full: 'megamenu-full' }[this.width()],
        this.vertical() ? 'megamenu-vertical' : '',
      ].filter(Boolean),
    ),
  );
  readonly positions: ConnectedPosition[] = [
    { originX: 'start', overlayX: 'start', originY: 'bottom', overlayY: 'top', offsetY: 8 },
    { originX: 'start', overlayX: 'start', originY: 'top', overlayY: 'bottom', offsetY: -8 },
  ];
  private readonly platform = inject(Platform);
  private readonly injector = inject(Injector);
  private readonly checker = inject(InteractivityChecker);
  private readonly direction = inject(Directionality);
  private manager?: FocusKeyManager<{ focus: () => void; disabled: boolean }>;
  constructor() {
    afterRenderEffect((cleanup) => {
      const hovered = this.hoveredIndex();
      const highlighted = hovered ?? (this.selected() ? this.activeIndex() : null);
      const unavailable = highlighted != null && this.items()[highlighted]?.disabled();
      const surface = this.highlight()?.nativeElement;
      const buttons = this.buttons();
      if (!surface) return;
      const update = () => {
        const button = highlighted == null ? null : buttons[highlighted]?.nativeElement;
        if (!button || unavailable || button.disabled) {
          surface.style.opacity = '0';
          return;
        }
        const parent = surface.parentElement!.getBoundingClientRect();
        const rect = button.getBoundingClientRect();
        Object.assign(surface.style, {
          left: rect.left - parent.left + 'px',
          top: rect.top - parent.top + 'px',
          width: rect.width + 'px',
          height: rect.height + 'px',
          opacity: '1',
        });
      };
      update();
      const Observer = this.host.ownerDocument.defaultView?.ResizeObserver;
      if (!Observer) return;
      const observer = new Observer(update);
      observer.observe(surface.parentElement!);
      buttons.forEach((button) => observer.observe(button.nativeElement));
      cleanup(() => observer.disconnect());
    });
    effect(() => {
      const buttons = this.buttons(),
        items = this.items();
      this.manager?.destroy();
      this.manager = new FocusKeyManager(
        buttons.map((ref, i) => ({
          focus: () => ref.nativeElement.focus(),
          get disabled() {
            return items[i]?.disabled() ?? false;
          },
        })),
      )
        .withWrap()
        .withHomeAndEnd()
        .withHorizontalOrientation(this.vertical() ? null : this.direction.value)
        .withVerticalOrientation(this.vertical());
    });
    inject(DestroyRef).onDestroy(() => this.manager?.destroy());
  }
  toggle(index: number) {
    if (this.items()[index]?.disabled()) return;
    this.activeIndex.set(this.activeIndex() === index ? null : index);
  }
  openDown(event: Event, index: number) {
    if (this.vertical()) return;
    event.preventDefault();
    if (!this.items()[index]?.disabled()) this.activeIndex.set(index);
  }
  close(restore = true) {
    const previous = this.activeIndex();
    this.activeIndex.set(null);
    if (restore && previous != null) this.buttons()[previous]?.nativeElement.focus();
  }
  escape(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }
  headerKeydown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const index = this.buttons().findIndex((button) => button.nativeElement === event.target);
    if (index < 0) return;
    if (event.key === 'Escape') {
      this.escape(event);
      return;
    }
    if (event.key === 'ArrowDown' && !this.vertical()) return;
    this.manager?.updateActiveItem(index);
    this.manager?.onKeydown(event);
  }
  attached() {
    afterNextRender(
      () => {
        const panel = this.panel()[0]?.nativeElement;
        if (!panel) return;
        const target = Array.from(
          panel.querySelectorAll<HTMLElement>('a,button,input,select,textarea,[tabindex]'),
        ).find((el) => this.checker.isFocusable(el));
        (target ?? panel).focus({ preventScroll: true });
      },
      { injector: this.injector },
    );
  }
  outside(event: MouseEvent) {
    if (!this.host.contains(event.target as Node)) this.close(false);
  }
  outsideFocus(event: FocusEvent) {
    const target = event.target as Node;
    if (
      this.selected() &&
      !this.host.contains(target) &&
      !this.panel()[0]?.nativeElement.contains(target)
    )
      this.close(false);
  }
  panelWidth(): number | string {
    if (!this.platform.isBrowser || this.width() === 'auto') return '';
    return this.width() === 'full'
      ? Math.max(0, (this.host.ownerDocument.defaultView?.innerWidth ?? 320) - 16)
      : this.host.getBoundingClientRect().width;
  }
}
