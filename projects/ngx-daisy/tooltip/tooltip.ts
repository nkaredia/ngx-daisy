import {
  Component,
  afterNextRender,
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
  Injector,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
import { AriaDescriber } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directionality } from '@angular/cdk/bidi';
import { DsyOverlayTheme } from 'ngx-daisy/overlay';
@Component({
  selector: 'dsy-tooltip-panel',
  imports: [DsyOverlayTheme],
  template: `<div [dsyOverlayTheme]="source()">
    <div class="dsy-tooltip-root" [class]="classes()" [attr.data-side]="side()">
      <div
        class="dsy-tooltip-surface"
        [class]="daisy('tooltip-content') + ' ' + surfaceClass()"
        role="tooltip"
        aria-hidden="true"
        (mouseenter)="entered()"
        (mouseleave)="left()"
      >
        {{ text() }}
      </div>
    </div>
  </div>`,
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyTooltipPanel {
  readonly daisy = injectDaisyUIClasses();
  readonly source = input.required<HTMLElement>();
  readonly text = signal('');
  readonly color = signal('');
  readonly surfaceClass = signal('');
  readonly placement = signal('tooltip-top');
  readonly side = signal('top');
  readonly alignment = signal('tooltip-center');
  readonly classes = computed(() =>
    this.daisy(
      ...['tooltip', 'tooltip-open', this.color(), this.placement(), this.alignment()].filter(
        Boolean,
      ),
    ),
  );
  entered = () => {};
  left = () => {};
}
@Directive({
  selector: '[dsyTooltip]',
  exportAs: 'dsyTooltip',
  host: {
    '(mouseenter)': 'enter()',
    '(mouseleave)': 'leave()',
    '(focusin)': 'show()',
    '(focusout)': 'hide()',
    '(keydown.escape)': 'hide()',
  },
})
export class DsyTooltip {
  readonly text = input('', { alias: 'dsyTooltip' });
  readonly disabled = input(false, { alias: 'tooltipDisabled', transform: booleanAttribute });
  readonly opened = model(false);
  readonly position = input<'top' | 'bottom' | 'left' | 'right'>('top');
  readonly align = input<'start' | 'center' | 'end'>('center');
  readonly color = input<
    'inherit' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  >('inherit');
  readonly tooltipClass = input('');
  readonly showDelay = input(0, { transform: numberAttribute });
  readonly hideDelay = input(100, { transform: numberAttribute });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly platform = inject(Platform);
  private readonly describer = inject(AriaDescriber);
  private readonly direction = inject(Directionality);
  private overlayRef?: OverlayRef;
  private panel?: DsyTooltipPanel;
  private timer?: ReturnType<typeof setTimeout>;
  private described = '';
  private hovered = false;
  private panelHovered = false;
  constructor() {
    effect(() => {
      const text = this.disabled() ? '' : this.text().trim();
      if (text !== this.described) {
        if (this.described) this.describer.removeDescription(this.host, this.described);
        if (text) this.describer.describe(this.host, text);
        this.described = text;
      }
      if (this.opened() && text && this.platform.isBrowser) this.render();
      else this.detach();
    });
    inject(DestroyRef).onDestroy(() => {
      this.cancel();
      this.overlayRef?.dispose();
      if (this.described) this.describer.removeDescription(this.host, this.described);
    });
  }
  enter() {
    this.hovered = true;
    this.show();
  }
  leave() {
    this.hovered = false;
    this.scheduleHide();
  }
  show() {
    this.cancel();
    if (this.disabled() || !this.text().trim()) return;
    if (this.showDelay() > 0)
      this.timer = setTimeout(() => this.opened.set(true), this.showDelay());
    else this.opened.set(true);
  }
  hide() {
    this.cancel();
    this.opened.set(false);
  }
  scheduleHide() {
    this.cancel();
    this.timer = setTimeout(
      () => {
        if (
          !this.hovered &&
          !this.panelHovered &&
          !this.host.contains(this.host.ownerDocument.activeElement)
        )
          this.opened.set(false);
      },
      Math.max(0, this.hideDelay()),
    );
  }
  private cancel() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }
  private detach() {
    this.cancel();
    this.overlayRef?.detach();
    this.panel = undefined;
  }
  private render() {
    const align = this.align(),
      position = this.position();
    const vertical = position === 'top' || position === 'bottom';
    const positions: ConnectedPosition[] = vertical
      ? [
          {
            originX: align,
            overlayX: align,
            originY: position === 'top' ? 'top' : 'bottom',
            overlayY: position === 'top' ? 'bottom' : 'top',
            offsetY: position === 'top' ? -8 : 8,
          },
          {
            originX: align,
            overlayX: align,
            originY: position === 'top' ? 'bottom' : 'top',
            overlayY: position === 'top' ? 'top' : 'bottom',
            offsetY: position === 'top' ? 8 : -8,
          },
        ]
      : [
          {
            originX: position === 'left' ? 'start' : 'end',
            overlayX: position === 'left' ? 'end' : 'start',
            originY: align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center',
            overlayY: align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center',
            offsetX: position === 'left' ? -8 : 8,
          },
          {
            originX: position === 'left' ? 'end' : 'start',
            overlayX: position === 'left' ? 'start' : 'end',
            originY: align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center',
            overlayY: align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center',
            offsetX: position === 'left' ? 8 : -8,
          },
        ];
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions(positions)
      .withViewportMargin(8)
      .withPush(true);
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        positionStrategy: strategy,
        direction: this.direction.value,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });
      this.overlayRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape') this.hide();
      });
    } else this.overlayRef.updatePositionStrategy(strategy);
    if (!this.overlayRef.hasAttached()) {
      const ref = this.overlayRef.attach(new ComponentPortal(DsyTooltipPanel, null, this.injector));
      ref.setInput('source', this.host);
      this.panel = ref.instance;
      this.panel.entered = () => {
        this.panelHovered = true;
        this.cancel();
      };
      this.panel.left = () => {
        this.panelHovered = false;
        this.scheduleHide();
      };
    }
    if (this.panel) {
      this.panel.text.set(this.text());
      this.panel.color.set(
        {
          inherit: '',
          primary: 'tooltip-primary',
          secondary: 'tooltip-secondary',
          accent: 'tooltip-accent',
          info: 'tooltip-info',
          success: 'tooltip-success',
          warning: 'tooltip-warning',
          error: 'tooltip-error',
        }[this.color()],
      );
      this.panel.surfaceClass.set(this.tooltipClass());
      this.panel.placement.set(
        {
          top: 'tooltip-top',
          bottom: 'tooltip-bottom',
          left: 'tooltip-left',
          right: 'tooltip-right',
        }[this.position()],
      );
      this.panel.alignment.set(
        { start: 'tooltip-start', center: 'tooltip-center', end: 'tooltip-end' }[this.align()],
      );
    }
    strategy.positionChanges.subscribe(({ connectionPair }) => {
      this.panel?.side.set(
        vertical
          ? connectionPair.overlayY === 'bottom'
            ? 'top'
            : 'bottom'
          : connectionPair.overlayX === 'end'
            ? this.direction.value === 'rtl'
              ? 'right'
              : 'left'
            : this.direction.value === 'rtl'
              ? 'left'
              : 'right',
      );
    });
    this.overlayRef.updatePosition();
    afterNextRender(() => this.overlayRef?.updatePosition(), { injector: this.injector });
  }
}
