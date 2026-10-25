import { DsyTabs, DsyTab, DsyTabPanel } from 'ngx-daisy/tabs';
import type { Playground } from '../playground/playground.types';
import { TabsExample } from './example/tabs-example';

export const playground: Playground = {
  components: [
    { class: DsyTabs /** Generate props during build */ },
    { class: DsyTab /** Generate props during build */ },
    { class: DsyTabPanel /** Generate props during build */ },
  ],
  previews: [TabsExample],
};
