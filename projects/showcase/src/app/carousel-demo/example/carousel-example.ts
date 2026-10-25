import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DsyCarousel, DsyCarouselItem } from 'ngx-daisy/carousel';
export interface CarouselExampleValues {
  readonly label?: ReturnType<DsyCarousel['label']>;
  readonly viewportClass?: ReturnType<DsyCarousel['viewportClass']>;
  readonly slideSize?: ReturnType<DsyCarousel['slideSize']>;
  readonly controlsClass?: ReturnType<DsyCarousel['controlsClass']>;
  readonly buttonClass?: ReturnType<DsyCarousel['buttonClass']>;
  readonly previousLabel?: ReturnType<DsyCarousel['previousLabel']>;
  readonly nextLabel?: ReturnType<DsyCarousel['nextLabel']>;
  readonly activeIndex?: ReturnType<DsyCarousel['activeIndex']>;
  readonly vertical?: ReturnType<DsyCarousel['vertical']>;
  readonly loop?: ReturnType<DsyCarousel['loop']>;
  readonly controls?: ReturnType<DsyCarousel['controls']>;
  readonly snap?: ReturnType<DsyCarousel['snap']>;
}
export interface CarouselItemExampleValues {
  readonly label?: ReturnType<DsyCarouselItem['label']>;
}
@Component({
  selector: 'demo-carousel-example',
  standalone: true,
  imports: [DsyCarousel, DsyCarouselItem],
  templateUrl: './carousel-example.html',
  styleUrl: './carousel-example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CarouselExample {
  readonly values = input<readonly [CarouselExampleValues?, CarouselItemExampleValues?]>([]);
  readonly props = computed<CarouselExampleValues>(() => this.values()[0] ?? {});
  readonly item = computed<CarouselItemExampleValues>(() => this.values()[1] ?? {});
}
