import { DsyMegamenu, DsyMegamenuItem } from 'ngx-daisy/megamenu';
import type { Playground } from '../playground/playground.types';
import { MegamenuExample } from './example/megamenu-example';

export const playground: Playground = {
  components: [
    { class: DsyMegamenu /** Generate props during build */ },
    { class: DsyMegamenuItem /** Generate props during build */ },
  ],
  previews: [MegamenuExample],
};
