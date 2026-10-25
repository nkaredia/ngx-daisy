import { DsyCarousel, DsyCarouselItem } from 'ngx-daisy/carousel';
import type { Playground } from '../playground/playground.types';
import { CarouselExample } from './example/carousel-example';
export const playground: Playground = {
  components: [
    { class: DsyCarousel /** Generate props during build */ },
    { class: DsyCarouselItem /** Generate props during build */ },
  ],
  previews: [CarouselExample],
};
