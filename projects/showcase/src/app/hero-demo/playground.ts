import { DsyHero, DsyHeroContent, DsyHeroOverlay } from 'ngx-daisy/hero';
import type { Playground } from '../playground/playground.types';
import { HeroExample } from './example/hero-example';

export const playground: Playground = {
  components: [
    { class: DsyHero /** Generate props during build */ },
    { class: DsyHeroContent /** Generate props during build */ },
    { class: DsyHeroOverlay /** Generate props during build */ },
  ],
  previews: [HeroExample],
};
