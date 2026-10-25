import { DsyFab } from 'ngx-daisy/fab';
import type { Playground } from '../playground/playground.types';
import { FabExample } from './example/fab-example';

export const playground: Playground = {
  components: [{ class: DsyFab /** Generate props during build */ }],
  previews: [FabExample],
};
