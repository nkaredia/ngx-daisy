import { DsyList } from 'ngx-daisy/list';
import type { Playground } from '../playground/playground.types';
import { ListExample } from './example/list-example';
export const playground: Playground = {
  components: [{ class: DsyList /** Generate props during build */ }],
  previews: [ListExample],
};
