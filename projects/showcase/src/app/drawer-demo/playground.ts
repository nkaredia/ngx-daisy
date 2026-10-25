import { DsyDrawer, DsyDrawerContainer, DsyDrawerContent } from 'ngx-daisy/drawer';
import type { Playground } from '../playground/playground.types';
import { DrawerExample } from './example/drawer-example';

export const playground: Playground = {
  components: [
    { class: DsyDrawer /** Generate props during build */ },
    { class: DsyDrawerContainer /** Generate props during build */ },
    { class: DsyDrawerContent /** Generate props during build */ },
  ],
  previews: [DrawerExample],
};
