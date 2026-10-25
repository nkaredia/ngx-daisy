import { DsyDock, DsyDockItem, DsyDockLabel } from 'ngx-daisy/dock';
import type { Playground } from '../playground/playground.types';
import { DockExample } from './example/dock-example';

export const playground: Playground = {
  components: [
    { class: DsyDock /** Generate props during build */ },
    { class: DsyDockItem /** Generate props during build */ },
    { class: DsyDockLabel /** Generate props during build */ },
  ],
  previews: [DockExample],
};
