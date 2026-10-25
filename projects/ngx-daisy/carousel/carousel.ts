import {
  Component,
  afterRenderEffect,
  Directive,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  computed,
  inject,
  effect,
  ElementRef,
  booleanAttribute,
  contentChildren,
  signal,
} from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
@Directive({
  selector: '[dsyCarouselItem]',
  host: {
    '[class]': 'daisy("carousel-item")',
    role: 'group',
    'aria-roledescription': 'slide',
    '[attr.aria-label]': 'label() || (index()+1)+" of "+total()',
    '[attr.inert]': 'active()?null:""',
  },
})
export class DsyCarouselItem {
  readonly daisy = injectDaisyUIClasses();
  readonly label = input('');
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly active = signal(false);
  readonly index = signal(0);
  readonly total = signal(0);
}
@Component({
  selector: 'dsy-carousel',
  imports: [],
  template: `<div
      class="dsy-carousel-viewport"
      [attr.data-slide-size]="slideSize()"
      [attr.data-vertical]="vertical()"
      [style.--dsy-carousel-snap]="snap()"
      [class]="
        daisy(
          'carousel',
          vertical() ? 'carousel-vertical' : 'carousel-horizontal',
          { start: 'carousel-start', center: 'carousel-center', end: 'carousel-end' }[snap()]
        ) +
        ' ' +
        viewportClass()
      "
      (scroll)="scrolled($event)"
    >
      <ng-content />
    </div>
    @if (controls()) {
      <div class="dsy-carousel-controls" [class]="controlsClass()">
        <button
          type="button"
          [attr.aria-label]="previousLabel()"
          [class]="buttonClass()"
          [disabled]="!items().length || (!loop() && index() === 0)"
          (click)="go(index() - 1)"
        >
          Previous</button
        ><span aria-live="polite"
          >{{ items().length ? index() + 1 : 0 }} / {{ items().length }}</span
        ><button
          type="button"
          [attr.aria-label]="nextLabel()"
          [class]="buttonClass()"
          [disabled]="!items().length || (!loop() && index() === items().length - 1)"
          (click)="go(index() + 1)"
        >
          Next
        </button>
      </div>
    }`,
  styleUrl: './carousel.scss',
  host: {
    role: 'region',
    'aria-roledescription': 'carousel',
    '[attr.aria-label]': 'label()',
    tabindex: '0',
    '(keydown)': 'key($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyCarousel {
  readonly daisy = injectDaisyUIClasses();
  readonly label = input('Slides');
  readonly viewportClass = input('');
  readonly slideSize = input<'auto' | 'full'>('auto');
  readonly controlsClass = input('');
  readonly buttonClass = input('');
  readonly previousLabel = input('Previous slide');
  readonly nextLabel = input('Next slide');
  readonly activeIndex = model(0);
  readonly vertical = input(false, { transform: booleanAttribute });
  readonly loop = input(false, { transform: booleanAttribute });
  readonly controls = input(true, { transform: booleanAttribute });
  readonly snap = input<'start' | 'center' | 'end'>('start');
  readonly items = contentChildren(DsyCarouselItem);
  readonly index = computed(() =>
    Math.max(0, Math.min(this.items().length - 1, Math.floor(this.activeIndex()) || 0)),
  );
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  constructor() {
    effect(() => {
      const items = this.items(),
        index = this.index();
      items.forEach((item, i) => {
        item.index.set(i);
        item.total.set(items.length);
        item.active.set(i === index);
      });
    });
    afterRenderEffect(() => {
      const items = this.items(),
        index = this.index();
      const slide = items[index]?.element.nativeElement,
        viewport = this.host.nativeElement.querySelector<HTMLElement>('.dsy-carousel-viewport');
      if (slide && viewport) {
        const r = slide.getBoundingClientRect(),
          v = viewport.getBoundingClientRect();
        const align = this.snap() === 'center' ? 0.5 : this.snap() === 'end' ? 1 : 0;
        viewport.scrollTo?.({
          left: viewport.scrollLeft + r.left - v.left - (v.width - r.width) * align,
          top: viewport.scrollTop + r.top - v.top - (v.height - r.height) * align,
          behavior: 'instant',
        });
      }
    });
  }
  go(value: number) {
    const n = this.items().length;
    this.activeIndex.set(
      n ? (this.loop() ? (value + n) % n : Math.max(0, Math.min(n - 1, value))) : 0,
    );
  }
  key(e: KeyboardEvent) {
    if (
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      (e.target as HTMLElement).closest('button,input,select,textarea,a,[contenteditable=true]')
    )
      return;
    const rtl =
      this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(this.host.nativeElement)
        .direction === 'rtl';
    let next: number | undefined;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = this.items().length - 1;
    else if (e.key === (this.vertical() ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight'))
      next = this.index() + 1;
    else if (e.key === (this.vertical() ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft'))
      next = this.index() - 1;
    if (next !== undefined) {
      e.preventDefault();
      this.go(next);
    }
  }
  scrolled(e: Event) {
    const viewport = e.target as HTMLElement,
      v = viewport.getBoundingClientRect();
    let best = Infinity,
      index = 0;
    this.items().forEach((item, i) => {
      const r = item.element.nativeElement.getBoundingClientRect();
      const align = this.snap() === 'center' ? 0.5 : this.snap() === 'end' ? 1 : 0;
      const d = Math.abs(
        this.vertical()
          ? r.top - v.top - (v.height - r.height) * align
          : r.left - v.left - (v.width - r.width) * align,
      );
      if (d < best) {
        best = d;
        index = i;
      }
    });
    if (index !== this.index()) this.activeIndex.set(index);
  }
}
