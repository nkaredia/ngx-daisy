import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  computed,
  booleanAttribute,
} from '@angular/core';
import { injectDaisyUIClasses } from 'ngx-daisy/config';
export interface DsyGalleryImage {
  src: string;
  alt: string;
}
@Component({
  selector: 'dsy-hover-gallery',
  template: `<div role="group" [attr.aria-label]="label()">
    <div
      [class]="daisy('hover-gallery')"
      class="dsy-gallery-stage"
      tabindex="0"
      (pointermove)="hover($event)"
      (pointerleave)="activeIndex.set(0)"
      (keydown)="key($event)"
    >
      @for (image of visibleImages(); track $index) {
        <img [src]="image.src" [alt]="image.alt" [hidden]="$index !== index()" />
      }
    </div>
    @if (controls()) {
      <div class="dsy-gallery-controls">
        @for (image of visibleImages(); track $index) {
          <button
            type="button"
            [attr.aria-label]="'Show ' + image.alt"
            [attr.aria-pressed]="$index === index()"
            (pointerenter)="activeIndex.set($index)"
            (click)="activeIndex.set($index)"
          >
            {{ $index + 1 }}
          </button>
        }
      </div>
    }
  </div>`,
  styleUrl: './hover-gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DsyHoverGallery {
  readonly daisy = injectDaisyUIClasses();
  readonly images = input<readonly DsyGalleryImage[]>([]);
  readonly controls = input(false, { transform: booleanAttribute });
  readonly visibleImages = computed(() => this.images().slice(0, 10));
  readonly activeIndex = model(0);
  readonly label = input('Image gallery');
  hover(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (rect.width)
      this.activeIndex.set(
        Math.max(
          0,
          Math.min(
            this.visibleImages().length - 1,
            1 +
              Math.floor(
                ((event.clientX - rect.left) / rect.width) * (this.visibleImages().length - 1),
              ),
          ),
        ),
      );
  }
  key(event: KeyboardEvent) {
    if (!this.visibleImages().length) return;
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    this.activeIndex.set(
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? this.visibleImages().length - 1
          : (this.index() + delta + this.visibleImages().length) %
            (this.visibleImages().length || 1),
    );
  }
  readonly index = computed(() =>
    Math.max(0, Math.min(this.visibleImages().length - 1, Math.floor(this.activeIndex()) || 0)),
  );
}
